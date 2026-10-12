<?php

class ReportController
{
    private const MULTI_ARTIST_PATTERN = '/\s(&|feat\.?|ft\.?|x|,|and)\s/i';

    public function upload(): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireAdmin($pdo);

        if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            throw new HttpException('A CSV or HTML file is required.', 422);
        }
        $filename = $_FILES['file']['name'];
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if (!in_array($extension, ['csv', 'html', 'htm'], true)) {
            throw new HttpException('Only CSV or HTML files are supported.', 422);
        }

        $contentHash = hash_file('sha256', $_FILES['file']['tmp_name']);
        $dup = $pdo->prepare('SELECT filename FROM report_uploads WHERE content_hash = ?');
        $dup->execute([$contentHash]);
        if (($dupFilename = $dup->fetchColumn()) !== false) {
            throw new HttpException("This exact report file has already been uploaded (as \"$dupFilename\").", 409);
        }

        $html = null;
        if ($extension === 'csv') {
            $rows = $this->readCsvRows($_FILES['file']['tmp_name']);
        } else {
            $html = file_get_contents($_FILES['file']['tmp_name']);
            $rows = $this->readHtmlRows($html);
        }

        [$period, $columns, $totalRows, $groups] = $this->parse($rows);

        if ($columns === null && $html !== null) {
            // Not a per-transaction table (no Artist/Track Artist column found) — try the
            // single-artist "statement summary" layout instead before giving up.
            $summary = $this->readStatementSummary($html);
            if ($summary !== null) {
                [$period, $totalRows, $groups] = $summary;
                $columns = [];
            }
        }

        if ($columns === null) {
            throw new HttpException('Could not find a "Track Artist(s)" column in this file.', 422);
        }

        $nameToId = [];
        foreach ($pdo->query("SELECT id, name FROM artists WHERE role = 'artist'") as $row) {
            $nameToId[strtolower(trim($row['name']))] = $row['id'];
        }

        $creditAliases = [];
        foreach ($pdo->query('SELECT credit_text_normalized, artist_id FROM report_credit_aliases') as $row) {
            $creditAliases[$row['credit_text_normalized']] = $row['artist_id'];
        }

        $uploadId = 'report-' . bin2hex(random_bytes(6));
        $pdo->prepare(
            'INSERT INTO report_uploads (id, filename, period, total_rows, matched_groups, pending_groups, uploaded_by, content_hash)
             VALUES (?, ?, ?, ?, 0, 0, ?, ?)'
        )->execute([$uploadId, $filename, $period, $totalRows, $user['id'], $contentHash]);

        $rate = SettingsController::gbpToUsdRate();
        $matchedGroups = 0;
        $pendingGroups = 0;
        $pending = [];

        foreach ($groups as $creditText => $totals) {
            $artistId = $nameToId[strtolower($creditText)] ?? $creditAliases[strtolower(trim($creditText))] ?? null;

            $breakdown = $this->flattenTrackPlatforms($totals['trackPlatforms'], $totals['trackCodes']);

            if ($artistId !== null) {
                $matchedGroups++;
                $this->upsertMonthly($artistId, $period, $totals['streams'], $totals['revenue']);
                foreach ($totals['trackPlatforms'] as $track => $platforms) {
                    $codes = $totals['trackCodes'][$track] ?? ['upc' => '', 'isrc' => ''];
                    $this->ensureTrackExists($artistId, $track, $period, array_keys($platforms), $codes['upc'], $codes['isrc']);
                }
                foreach ($breakdown as $tuple) {
                    $this->upsertTrackPlatform($artistId, $period, $tuple['track'], $tuple['platform'], $tuple['streams'], $tuple['revenue']);
                }
                continue;
            }

            $isMultiArtist = preg_match(self::MULTI_ARTIST_PATTERN, $creditText) === 1;
            if ($isMultiArtist) {
                $mainArtistId = $this->matchMultiArtistByMainArtist($creditText, $nameToId);
                if ($mainArtistId !== null) {
                    $matchedGroups++;
                    $this->upsertMonthly($mainArtistId, $period, $totals['streams'], $totals['revenue']);
                    foreach ($totals['trackPlatforms'] as $track => $platforms) {
                        $codes = $totals['trackCodes'][$track] ?? ['upc' => '', 'isrc' => ''];
                        $this->ensureTrackExists($mainArtistId, $track, $period, array_keys($platforms), $codes['upc'], $codes['isrc']);
                    }
                    foreach ($breakdown as $tuple) {
                        $this->upsertTrackPlatform($mainArtistId, $period, $tuple['track'], $tuple['platform'], $tuple['streams'], $tuple['revenue']);
                    }
                    continue;
                }
            }

            $pendingGroups++;
            $reason = $isMultiArtist ? 'multi_artist' : 'unmatched';
            $pendingId = 'pending-' . bin2hex(random_bytes(6));
            $pdo->prepare(
                'INSERT INTO report_pending_rows (id, report_upload_id, credit_text, reason, streams, revenue_gbp, track_platform_breakdown)
                 VALUES (?, ?, ?, ?, ?, ?, ?)'
            )->execute([$pendingId, $uploadId, $creditText, $reason, $totals['streams'], $totals['revenue'], json_encode($breakdown)]);
            $pending[] = [
                'id' => $pendingId,
                'reportUploadId' => $uploadId,
                'filename' => $filename,
                'creditText' => $creditText,
                'reason' => $reason,
                'streams' => $totals['streams'],
                'revenueUsd' => $totals['revenue'] * $rate,
                'status' => 'pending',
            ];
        }

        $pdo->prepare('UPDATE report_uploads SET matched_groups = ?, pending_groups = ? WHERE id = ?')
            ->execute([$matchedGroups, $pendingGroups, $uploadId]);

        Response::json([
            'upload' => $this->findUpload($uploadId),
            'pending' => $pending,
        ], 201);
    }

    public function index(): void
    {
        Auth::requireAdmin(Database::pdo());
        $rows = Database::pdo()->query('SELECT * FROM report_uploads ORDER BY uploaded_at DESC')->fetchAll();
        Response::json(array_map($this->mapUpload(...), $rows));
    }

    /**
     * Catches up report data that predates ensureTrackExists() (or was applied some
     * other way, e.g. a bulk SQL import): scans every (artist, track, platform, period)
     * combination the analytics tables already hold, regardless of when it was
     * uploaded, and creates any track record still missing for it — reusing the exact
     * same helper the normal upload flow now calls automatically. Idempotent, so it's
     * safe to trigger more than once. Exists as an HTTP endpoint (not a CLI script) so
     * it can be run the same way locally or once deployed, without needing shell/SSH
     * access on the host.
     */
    public function backfillTracks(): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);

        $before = (int) $pdo->query('SELECT COUNT(*) FROM tracks')->fetchColumn();

        $rows = $pdo->query(
            'SELECT artist_id, track_title, platform, period FROM artist_track_platform_analytics_monthly ORDER BY period ASC'
        )->fetchAll();

        $grouped = [];
        foreach ($rows as $r) {
            $key = $r['artist_id'] . "\x1f" . strtolower(trim($r['track_title']));
            if (!isset($grouped[$key])) {
                $grouped[$key] = ['artistId' => $r['artist_id'], 'track' => $r['track_title'], 'period' => $r['period'], 'platforms' => []];
            }
            $grouped[$key]['platforms'][$r['platform']] = true;
            if ($r['period'] < $grouped[$key]['period']) {
                $grouped[$key]['period'] = $r['period'];
            }
        }

        foreach ($grouped as $g) {
            $this->ensureTrackExists($g['artistId'], $g['track'], $g['period'], array_keys($g['platforms']));
        }

        $after = (int) $pdo->query('SELECT COUNT(*) FROM tracks')->fetchColumn();

        Response::json([
            'combinationsChecked' => count($grouped),
            'tracksCreated' => $after - $before,
        ]);
    }

    public function pending(): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $rows = $pdo->query(
            "SELECT p.*, u.filename FROM report_pending_rows p
             JOIN report_uploads u ON u.id = p.report_upload_id
             WHERE p.status = 'pending' ORDER BY p.created_at DESC"
        )->fetchAll();
        $rate = SettingsController::gbpToUsdRate();

        $artistNames = [];
        $tracksByArtist = [];
        foreach ($pdo->query("SELECT id, name FROM artists WHERE role = 'artist'") as $a) {
            $artistNames[$a['id']] = $a['name'];
        }
        foreach ($pdo->query('SELECT artist_id, title FROM tracks') as $t) {
            $tracksByArtist[$t['artist_id']][strtolower(trim($t['title']))] = true;
        }

        Response::json(array_map(
            fn (array $row) => $this->mapPendingRow($row, $rate, $tracksByArtist, $artistNames),
            $rows,
        ));
    }

    /**
     * For a pending row's track titles, finds the single existing artist who already
     * owns a track with a matching title — the same "song ownership" signal
     * matchMultiArtistBySong() uses during upload(), generalized to every pending row
     * (not just multi-artist credits), so rows that clearly belong to one of our artists
     * can be grouped and bulk-assigned together instead of resolved one at a time.
     *
     * @param array<string, array<string, true>> $tracksByArtist artist id => set of lowercased, trimmed track titles
     */
    private function suggestArtistForPendingRow(array $row, array $tracksByArtist): ?string
    {
        if ($row['track_platform_breakdown'] === null) {
            return null;
        }
        $breakdown = json_decode($row['track_platform_breakdown'], true);
        if (!is_array($breakdown)) {
            return null;
        }
        $trackTitles = [];
        foreach ($breakdown as $tuple) {
            if (isset($tuple['track']) && trim((string) $tuple['track']) !== '') {
                $trackTitles[strtolower(trim((string) $tuple['track']))] = true;
            }
        }
        if ($trackTitles === []) {
            return null;
        }

        $matches = [];
        foreach ($tracksByArtist as $artistId => $ownedTitles) {
            foreach (array_keys($trackTitles) as $title) {
                if (isset($ownedTitles[$title])) {
                    $matches[$artistId] = true;
                    break;
                }
            }
        }

        return count($matches) === 1 ? array_key_first($matches) : null;
    }

    public function resolve(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $body = Request::body();
        $artistId = $body['artistId'] ?? '';
        if ($artistId === '') {
            throw new HttpException('artistId is required.', 422);
        }

        $row = $this->findPendingRow($args['id']);
        if ($row === null) {
            throw new HttpException('Pending row not found', 404);
        }

        if (!$this->resolveRow($row, $artistId)) {
            throw new HttpException('This row was already resolved.', 409);
        }

        if ($row['reason'] === 'unmatched') {
            $this->rememberCreditAlias($row['credit_text'], $artistId);
        }

        Response::json(['success' => true]);
    }

    /**
     * Remembers that this exact distributor spelling of an artist's name (e.g. a stray
     * leading dot, different casing, extra spacing) belongs to the given artist, so the
     * next report using that same spelling matches automatically in upload() instead of
     * landing back in pending review. Only called for 'unmatched' rows — a single name
     * that just didn't match, not a multi-artist credit naming several people.
     */
    private function rememberCreditAlias(string $creditText, string $artistId): void
    {
        $normalized = strtolower(trim($creditText));
        if ($normalized === '') {
            return;
        }
        Database::pdo()->prepare(
            'INSERT INTO report_credit_aliases (id, credit_text, credit_text_normalized, artist_id)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE artist_id = VALUES(artist_id), credit_text = VALUES(credit_text)'
        )->execute(['alias-' . bin2hex(random_bytes(6)), trim($creditText), $normalized, $artistId]);
    }

    /**
     * Applies a pending row's streams/revenue to the given artist and marks it resolved.
     * Shared by the manual resolve endpoint and auto-resolution on artist creation/approval.
     *
     * The status flip happens FIRST, scoped to `status = 'pending'`, so it doubles as a
     * mutex: MySQL's row lock on this UPDATE means only one of two concurrent callers can
     * affect the row. The loser gets rowCount() === 0 and returns before touching analytics,
     * preventing the same row's streams/revenue from being added twice.
     */
    private function resolveRow(array $row, string $artistId): bool
    {
        $pdo = Database::pdo();
        $stmt = $pdo->prepare("UPDATE report_pending_rows SET status = 'resolved', resolved_artist_id = ? WHERE id = ? AND status = 'pending'");
        $stmt->execute([$artistId, $row['id']]);
        if ($stmt->rowCount() === 0) {
            return false;
        }

        $upload = $this->findUploadRow($row['report_upload_id']);
        $this->upsertMonthly($artistId, $upload['period'], (int) $row['streams'], (float) $row['revenue_gbp']);

        $breakdown = $row['track_platform_breakdown'] === null ? [] : json_decode($row['track_platform_breakdown'], true);
        $platformsByTrack = [];
        $codesByTrack = [];
        foreach ($breakdown as $tuple) {
            $platformsByTrack[$tuple['track']][] = $tuple['platform'];
            if (!isset($codesByTrack[$tuple['track']])) {
                $codesByTrack[$tuple['track']] = ['upc' => $tuple['upc'] ?? '', 'isrc' => $tuple['isrc'] ?? ''];
            }
            $this->upsertTrackPlatform($artistId, $upload['period'], $tuple['track'], $tuple['platform'], $tuple['streams'], $tuple['revenue']);
        }
        foreach ($platformsByTrack as $track => $platforms) {
            $codes = $codesByTrack[$track] ?? ['upc' => '', 'isrc' => ''];
            $this->ensureTrackExists($artistId, $track, $upload['period'], array_unique($platforms), $codes['upc'], $codes['isrc']);
        }

        return true;
    }

    /**
     * Auto-resolves any still-pending, single-artist ('unmatched') report rows whose
     * credit text exactly matches this artist's name (case-insensitive, trimmed) —
     * mirroring upload()'s own matching rule. Called after a new artist is created
     * (or approved, for invite self-registrations) so reports uploaded before the
     * artist existed get attributed automatically. Deliberately excludes
     * reason = 'multi_artist' rows: those always require a human to pick which
     * collaborator gets credit. Returns the number of rows resolved.
     */
    public static function autoResolveForArtist(string $artistId, string $artistName): int
    {
        $stmt = Database::pdo()->prepare(
            "SELECT * FROM report_pending_rows
             WHERE status = 'pending' AND reason = 'unmatched' AND LOWER(TRIM(credit_text)) = LOWER(TRIM(?))"
        );
        $stmt->execute([$artistName]);
        $rows = $stmt->fetchAll();

        $self = new self();
        $resolved = 0;
        foreach ($rows as $row) {
            if ($self->resolveRow($row, $artistId)) {
                $resolved++;
            }
        }

        return $resolved;
    }

    public function skip(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        if ($this->findPendingRow($args['id']) === null) {
            throw new HttpException('Pending row not found', 404);
        }
        $pdo->prepare("UPDATE report_pending_rows SET status = 'skipped' WHERE id = ?")->execute([$args['id']]);
        Response::json(['success' => true]);
    }

    /** @return list<list<string>> */
    private function readCsvRows(string $tmpPath): array
    {
        $handle = fopen($tmpPath, 'r');
        if ($handle === false) {
            throw new HttpException('Failed to read the uploaded file.', 500);
        }

        $rows = [];
        try {
            while (($row = fgetcsv($handle)) !== false) {
                $rows[] = $row;
            }
        } finally {
            fclose($handle);
        }

        return $rows;
    }

    /**
     * Extracts table rows from an HTML royalty report the same shape fgetcsv() would
     * produce, so the same column-matching/grouping logic in parse() works unchanged
     * regardless of which format was uploaded. Picks the table with the most rows, in
     * case the page has other small/layout tables alongside the real data table.
     *
     * @return list<list<string>>
     */
    private function readHtmlRows(string $html): array
    {
        $doc = new DOMDocument();
        libxml_use_internal_errors(true);
        $doc->loadHTML('<?xml encoding="UTF-8">' . $html);
        libxml_clear_errors();

        $bestRows = [];
        foreach ($doc->getElementsByTagName('table') as $table) {
            $rows = [];
            foreach ($table->getElementsByTagName('tr') as $tr) {
                $cells = [];
                foreach ($tr->childNodes as $cell) {
                    if ($cell->nodeName === 'td' || $cell->nodeName === 'th') {
                        $cells[] = trim($cell->textContent);
                    }
                }
                if ($cells !== []) {
                    $rows[] = $cells;
                }
            }
            if (count($rows) > count($bestRows)) {
                $bestRows = $rows;
            }
        }

        if ($bestRows === []) {
            throw new HttpException('No table found in this HTML file.', 422);
        }

        return $bestRows;
    }

    /**
     * Falls back to this when an uploaded HTML file has no Artist/Track Artist column
     * (readHtmlRows()/parse() found tables, but none of them are a per-transaction
     * export) — some distributors instead send a per-payee "statement" page: a
     * human-readable summary for a single artist, with pre-aggregated totals by revenue
     * type rather than individual transaction rows. Returns the same
     * [period, totalRows, groups] shape parse() would, with one group for the single
     * artist this statement covers (no per-track/per-platform breakdown is available at
     * this granularity, so trackPlatforms is left empty).
     *
     * @return ?array{0: string, 1: int, 2: array<string, array{streams: int, revenue: float, trackPlatforms: array<string, array<string, array{streams: int, revenue: float}>>, trackCodes: array<string, array{upc: string, isrc: string}>}>}
     */
    private function readStatementSummary(string $html): ?array
    {
        if (preg_match('/Statement prepared for.*?<h5[^>]*>\s*([^<]+?)\s*<\/h5>/is', $html, $m) !== 1) {
            return null;
        }
        $artistName = trim(html_entity_decode(strip_tags($m[1])));
        if ($artistName === '') {
            return null;
        }

        $period = date('Y-m');
        if (preg_match('/Reporting period:\s*(\d{4}-\d{2})/i', $html, $m) === 1) {
            $period = $m[1];
        }

        $streams = 0;
        if (preg_match('/Subtotal\s*<\/td>\s*<td[^>]*>([^<]*)</is', $html, $m) === 1) {
            $streams = (int) preg_replace('/[^0-9]/', '', html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        }

        $revenue = 0.0;
        if (preg_match('/Total Revenue\s*<\/td>\s*<td[^>]*>\s*<\/td>\s*<td[^>]*>([^<]*)</is', $html, $m) === 1) {
            // The currency symbol arrives HTML-entity-encoded (e.g. "&#194;&#163;" for a
            // mis-encoded £) — those entity codes contain digits themselves, so they must
            // be decoded to real characters *before* stripping non-numeric ones, or the
            // digits inside the entity codes get mistaken for part of the amount.
            $revenue = (float) preg_replace('/[^0-9.]/', '', html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        }

        if ($revenue <= 0.0) {
            return null;
        }

        return [
            $period,
            1,
            [$artistName => ['streams' => $streams, 'revenue' => $revenue, 'trackPlatforms' => [], 'trackCodes' => []]],
        ];
    }

    /**
     * @param list<list<string>> $rows
     * @return array{0: string, 1: ?array<string, int>, 2: int, 3: array<string, array{streams: int, revenue: float, trackPlatforms: array<string, array<string, array{streams: int, revenue: float}>>, trackCodes: array<string, array{upc: string, isrc: string}>}>}
     */
    private function parse(array $rows): array
    {
        $period = date('Y-m');
        $columns = null;
        $totalRows = 0;
        $groups = [];

        foreach ($rows as $row) {
            if ($columns === null) {
                foreach ($row as $cell) {
                    if (str_starts_with((string) $cell, 'Date From:')) {
                        $date = trim(substr((string) $cell, strlen('Date From:')));
                        $parsed = DateTime::createFromFormat('d/m/Y', $date);
                        if ($parsed !== false) {
                            $period = $parsed->format('Y-m');
                        }
                    }
                }

                $header = $this->matchHeader($row);
                if ($header !== null) {
                    $columns = $header;
                }
                continue;
            }

            $creditText = trim($row[$columns['artist']] ?? '');
            if ($creditText === '') {
                continue;
            }

            // Per-transaction statement formats give the period as a column value
            // (e.g. "2023-11") instead of a "Date From:" metadata line above the header.
            if (isset($columns['period'], $row[$columns['period']])) {
                $periodValue = trim((string) $row[$columns['period']]);
                if (preg_match('/^\d{4}-\d{2}$/', $periodValue) === 1) {
                    $period = $periodValue;
                }
            }

            $totalRows++;
            $streams = (int) ($row[$columns['quantity']] ?? 0);
            $revenue = (float) ($row[$columns['revenue']] ?? 0);

            if (!isset($groups[$creditText])) {
                $groups[$creditText] = ['streams' => 0, 'revenue' => 0.0, 'trackPlatforms' => [], 'trackCodes' => []];
            }
            $groups[$creditText]['streams'] += $streams;
            $groups[$creditText]['revenue'] += $revenue;

            $track = isset($columns['track']) ? trim($row[$columns['track']] ?? '') : '';
            $platform = isset($columns['store']) ? trim($row[$columns['store']] ?? '') : '';
            if ($track !== '' && $platform !== '') {
                if (!isset($groups[$creditText]['trackPlatforms'][$track][$platform])) {
                    $groups[$creditText]['trackPlatforms'][$track][$platform] = ['streams' => 0, 'revenue' => 0.0];
                }
                $groups[$creditText]['trackPlatforms'][$track][$platform]['streams'] += $streams;
                $groups[$creditText]['trackPlatforms'][$track][$platform]['revenue'] += $revenue;
            }

            if ($track !== '' && !isset($groups[$creditText]['trackCodes'][$track])) {
                $upc = isset($columns['upc']) ? trim((string) ($row[$columns['upc']] ?? '')) : '';
                $isrc = isset($columns['isrc']) ? trim((string) ($row[$columns['isrc']] ?? '')) : '';
                if ($upc !== '' || $isrc !== '') {
                    $groups[$creditText]['trackCodes'][$track] = ['upc' => $upc, 'isrc' => $isrc];
                }
            }
        }

        return [$period, $columns, $totalRows, $groups];
    }

    /**
     * For a multi-artist credit like "Boy Temmy & Cazulee", tries to automatically
     * attribute the row to whichever credited name is a registered artist who already
     * has a track matching one of this row's track titles — a stronger signal than name
     * alone, since a collab's revenue should go to whichever of our artists actually
     * owns the song, not be split or guessed at. Falls back to the existing manual
     * pending-review flow when zero or more than one candidate qualifies.
     *
     * @param array<string, array<string, array{streams: int, revenue: float}>> $trackPlatforms keyed by track title
     * @param array<string, string> $nameToId lowercased, trimmed artist name => artist id
     * @param array<string, array<string, true>> $tracksByArtist artist id => set of lowercased, trimmed track titles
     */
    private function matchMultiArtistBySong(string $creditText, array $trackPlatforms, array $nameToId, array $tracksByArtist): ?string
    {
        $candidateNames = preg_split(self::MULTI_ARTIST_PATTERN, $creditText);
        if ($candidateNames === false) {
            return null;
        }

        $trackTitles = array_map(fn (string $t) => strtolower(trim($t)), array_keys($trackPlatforms));

        $matches = [];
        foreach ($candidateNames as $name) {
            $artistId = $nameToId[strtolower(trim($name))] ?? null;
            if ($artistId === null) {
                continue;
            }
            $ownedTitles = $tracksByArtist[$artistId] ?? [];
            foreach ($trackTitles as $title) {
                if (isset($ownedTitles[$title])) {
                    $matches[$artistId] = true;
                    break;
                }
            }
        }

        return count($matches) === 1 ? array_key_first($matches) : null;
    }

    /**
     * For a multi-artist credit like "Boy Temmy & Cazulee", attributes the whole row to
     * whichever name is listed first — distributors list the primary artist before any
     * featured/collaborating names, so the first candidate is the main artist regardless
     * of how many others are credited alongside them.
     *
     * @param array<string, string> $nameToId lowercased, trimmed artist name => artist id
     */
    private function matchMultiArtistByMainArtist(string $creditText, array $nameToId): ?string
    {
        $candidateNames = preg_split(self::MULTI_ARTIST_PATTERN, $creditText);
        if ($candidateNames === false || $candidateNames === []) {
            return null;
        }

        $mainName = strtolower(trim($candidateNames[0]));
        return $nameToId[$mainName] ?? null;
    }

    /**
     * Recognizes two distributor report layouts by header name:
     *  - "Track Artist(s)" / "Store" / "Label Amount" (the original format, with a
     *    separate "Date From:" metadata line above the header for the period)
     *  - "Artist" / "Service" / "Amount Due in GBP" (per-transaction statements, with
     *    the period given as a "Statement Period" column on every row instead)
     *
     * @return ?array<string, int>
     */
    private function matchHeader(array $row): ?array
    {
        $columns = [];
        foreach ($row as $index => $cell) {
            $cell = (string) $cell;
            if (str_starts_with($cell, 'Track Artist') || $cell === 'Artist') {
                $columns['artist'] = $index;
            } elseif (str_starts_with($cell, 'Quantity')) {
                $columns['quantity'] = $index;
            } elseif (str_starts_with($cell, 'Label Amount') || str_starts_with($cell, 'Amount Due')) {
                $columns['revenue'] = $index;
            } elseif (str_starts_with($cell, 'Track Title')) {
                $columns['track'] = $index;
            } elseif ($cell === 'Store' || $cell === 'Service') {
                // Exact match only: "Store" has an adjacent "Store Type" column in the
                // original format, and a prefix match would clobber this index with that
                // one instead.
                $columns['store'] = $index;
            } elseif ($cell === 'Statement Period') {
                $columns['period'] = $index;
            } elseif ($cell === 'UPC') {
                $columns['upc'] = $index;
            } elseif ($cell === 'ISRC') {
                $columns['isrc'] = $index;
            }
        }

        return isset($columns['artist'], $columns['quantity'], $columns['revenue']) ? $columns : null;
    }

    private function upsertMonthly(string $artistId, string $period, int $streams, float $revenue): void
    {
        Database::pdo()->prepare(
            'INSERT INTO artist_analytics_monthly (id, artist_id, period, streams, revenue_gbp)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE streams = streams + ?, revenue_gbp = revenue_gbp + ?'
        )->execute(['analytics-' . bin2hex(random_bytes(6)), $artistId, $period, $streams, $revenue, $streams, $revenue]);
    }

    private function upsertTrackPlatform(string $artistId, string $period, string $track, string $platform, int $streams, float $revenue): void
    {
        Database::pdo()->prepare(
            'INSERT INTO artist_track_platform_analytics_monthly (id, artist_id, period, track_title, platform, streams, revenue_gbp)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE streams = streams + ?, revenue_gbp = revenue_gbp + ?'
        )->execute(['tpa-' . bin2hex(random_bytes(6)), $artistId, $period, $track, $platform, $streams, $revenue, $streams, $revenue]);
    }

    /**
     * Adds a track for the artist if they don't already have one with this title
     * (case-insensitive) — a report crediting them for a song is real evidence it's
     * theirs, so their catalog on the platform should reflect it without needing a
     * manual upload. Defaults mirror what a real release already earning revenue
     * implies: genre from their own profile, release_date from this report's period,
     * status 'live'. Idempotent — safe to call for a track they already have.
     *
     * @param list<string> $platforms
     */
    private function ensureTrackExists(string $artistId, string $track, string $period, array $platforms, string $upc = '', string $isrc = ''): void
    {
        $track = trim($track);
        if ($track === '') {
            return;
        }

        $pdo = Database::pdo();
        $exists = $pdo->prepare('SELECT id, upc_code, isrc_code FROM tracks WHERE artist_id = ? AND LOWER(TRIM(title)) = LOWER(?)');
        $exists->execute([$artistId, $track]);
        $existing = $exists->fetch();
        if ($existing !== false) {
            // Backfill UPC/ISRC onto a track that was already created (e.g. by an earlier
            // report upload processed before these columns were captured) but is still
            // missing them — never overwrites a code that's already set.
            if ($upc !== '' && ($existing['upc_code'] === null || trim((string) $existing['upc_code']) === '')) {
                $pdo->prepare('UPDATE tracks SET upc_code = ? WHERE id = ?')->execute([$upc, $existing['id']]);
            }
            if ($isrc !== '' && ($existing['isrc_code'] === null || trim((string) $existing['isrc_code']) === '')) {
                $pdo->prepare('UPDATE tracks SET isrc_code = ? WHERE id = ?')->execute([$isrc, $existing['id']]);
            }
            return;
        }

        $genreStmt = $pdo->prepare('SELECT genre FROM artists WHERE id = ?');
        $genreStmt->execute([$artistId]);
        $genre = $genreStmt->fetchColumn();
        $genre = (is_string($genre) && trim($genre) !== '') ? $genre : 'Other';

        $pdo->prepare(
            'INSERT INTO tracks (id, artist_id, title, genre, release_date, status, platforms, upc_code, isrc_code)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute([
            'track-' . bin2hex(random_bytes(6)),
            $artistId,
            $track,
            $genre,
            $period . '-01',
            'live',
            json_encode(array_values(array_unique($platforms))),
            $upc !== '' ? $upc : null,
            $isrc !== '' ? $isrc : null,
        ]);
    }

    /**
     * @param array<string, array<string, array{streams: int, revenue: float}>> $trackPlatforms
     * @param array<string, array{upc: string, isrc: string}> $trackCodes
     * @return list<array{track: string, platform: string, streams: int, revenue: float, upc: string, isrc: string}>
     */
    private function flattenTrackPlatforms(array $trackPlatforms, array $trackCodes = []): array
    {
        $flat = [];
        foreach ($trackPlatforms as $track => $platforms) {
            $codes = $trackCodes[$track] ?? ['upc' => '', 'isrc' => ''];
            foreach ($platforms as $platform => $totals) {
                $flat[] = [
                    'track' => $track,
                    'platform' => $platform,
                    'streams' => $totals['streams'],
                    'revenue' => $totals['revenue'],
                    'upc' => $codes['upc'],
                    'isrc' => $codes['isrc'],
                ];
            }
        }
        return $flat;
    }

    private function findPendingRow(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM report_pending_rows WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    private function findUploadRow(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM report_uploads WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    private function findUpload(string $id): ?array
    {
        $row = $this->findUploadRow($id);
        return $row === null ? null : $this->mapUpload($row);
    }

    private function mapUpload(array $row): array
    {
        return [
            'id' => $row['id'],
            'filename' => $row['filename'],
            'period' => $row['period'],
            'totalRows' => (int) $row['total_rows'],
            'matchedGroups' => (int) $row['matched_groups'],
            'pendingGroups' => (int) $row['pending_groups'],
            'uploadedBy' => $row['uploaded_by'],
            'uploadedAt' => $row['uploaded_at'],
        ];
    }

    /**
     * @param array<string, array<string, true>> $tracksByArtist artist id => set of lowercased, trimmed track titles
     * @param array<string, string> $artistNames artist id => name
     */
    private function mapPendingRow(array $row, float $rate, array $tracksByArtist = [], array $artistNames = []): array
    {
        $suggestedArtistId = $tracksByArtist === [] ? null : $this->suggestArtistForPendingRow($row, $tracksByArtist);

        return [
            'id' => $row['id'],
            'reportUploadId' => $row['report_upload_id'],
            'filename' => $row['filename'],
            'creditText' => $row['credit_text'],
            'reason' => $row['reason'],
            'streams' => (int) $row['streams'],
            'revenueUsd' => (float) $row['revenue_gbp'] * $rate,
            'status' => $row['status'],
            'createdAt' => $row['created_at'],
            'suggestedArtistId' => $suggestedArtistId,
            'suggestedArtistName' => $suggestedArtistId !== null ? ($artistNames[$suggestedArtistId] ?? null) : null,
        ];
    }
}
