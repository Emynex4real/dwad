<?php

class ReportController
{
    private const MULTI_ARTIST_PATTERN = '/\s(&|feat\.?|ft\.?|x|,|and)\s/i';

    public function upload(): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireAdmin($pdo);

        if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            throw new HttpException('A CSV file is required.', 422);
        }
        $filename = $_FILES['file']['name'];
        if (strtolower(pathinfo($filename, PATHINFO_EXTENSION)) !== 'csv') {
            throw new HttpException('Only CSV files are supported.', 422);
        }

        $handle = fopen($_FILES['file']['tmp_name'], 'r');
        if ($handle === false) {
            throw new HttpException('Failed to read the uploaded file.', 500);
        }

        try {
            [$period, $columns, $totalRows, $groups] = $this->parse($handle);
        } finally {
            fclose($handle);
        }

        if ($columns === null) {
            throw new HttpException('Could not find a "Track Artist(s)" column in this file.', 422);
        }

        $nameToId = [];
        foreach ($pdo->query("SELECT id, name FROM artists WHERE role = 'artist'") as $row) {
            $nameToId[strtolower(trim($row['name']))] = $row['id'];
        }

        $uploadId = 'report-' . bin2hex(random_bytes(6));
        $pdo->prepare(
            'INSERT INTO report_uploads (id, filename, period, total_rows, matched_groups, pending_groups, uploaded_by)
             VALUES (?, ?, ?, ?, 0, 0, ?)'
        )->execute([$uploadId, $filename, $period, $totalRows, $user['id']]);

        $rate = SettingsController::gbpToUsdRate();
        $matchedGroups = 0;
        $pendingGroups = 0;
        $pending = [];

        foreach ($groups as $creditText => $totals) {
            $artistId = $nameToId[strtolower($creditText)] ?? null;

            $breakdown = $this->flattenTrackPlatforms($totals['trackPlatforms']);

            if ($artistId !== null) {
                $matchedGroups++;
                $this->upsertMonthly($artistId, $period, $totals['streams'], $totals['revenue']);
                foreach ($breakdown as $tuple) {
                    $this->upsertTrackPlatform($artistId, $period, $tuple['track'], $tuple['platform'], $tuple['streams'], $tuple['revenue']);
                }
                continue;
            }

            $pendingGroups++;
            $reason = preg_match(self::MULTI_ARTIST_PATTERN, $creditText) === 1 ? 'multi_artist' : 'unmatched';
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

    public function pending(): void
    {
        Auth::requireAdmin(Database::pdo());
        $rows = Database::pdo()->query(
            "SELECT p.*, u.filename FROM report_pending_rows p
             JOIN report_uploads u ON u.id = p.report_upload_id
             WHERE p.status = 'pending' ORDER BY p.created_at DESC"
        )->fetchAll();
        $rate = SettingsController::gbpToUsdRate();
        Response::json(array_map(fn (array $row) => $this->mapPendingRow($row, $rate), $rows));
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

        $upload = $this->findUploadRow($row['report_upload_id']);
        $this->upsertMonthly($artistId, $upload['period'], (int) $row['streams'], (float) $row['revenue_gbp']);

        $breakdown = $row['track_platform_breakdown'] === null ? [] : json_decode($row['track_platform_breakdown'], true);
        foreach ($breakdown as $tuple) {
            $this->upsertTrackPlatform($artistId, $upload['period'], $tuple['track'], $tuple['platform'], $tuple['streams'], $tuple['revenue']);
        }

        $pdo->prepare("UPDATE report_pending_rows SET status = 'resolved', resolved_artist_id = ? WHERE id = ?")
            ->execute([$artistId, $args['id']]);

        Response::json(['success' => true]);
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

    /** @return array{0: string, 1: ?array<string, int>, 2: int, 3: array<string, array{streams: int, revenue: float, trackPlatforms: array<string, array<string, array{streams: int, revenue: float}>>}>} */
    private function parse($handle): array
    {
        $period = date('Y-m');
        $columns = null;
        $totalRows = 0;
        $groups = [];

        while (($row = fgetcsv($handle)) !== false) {
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

            $totalRows++;
            $streams = (int) ($row[$columns['quantity']] ?? 0);
            $revenue = (float) ($row[$columns['revenue']] ?? 0);

            if (!isset($groups[$creditText])) {
                $groups[$creditText] = ['streams' => 0, 'revenue' => 0.0, 'trackPlatforms' => []];
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
        }

        return [$period, $columns, $totalRows, $groups];
    }

    /** @return ?array<string, int> */
    private function matchHeader(array $row): ?array
    {
        $columns = [];
        foreach ($row as $index => $cell) {
            $cell = (string) $cell;
            if (str_starts_with($cell, 'Track Artist')) {
                $columns['artist'] = $index;
            } elseif (str_starts_with($cell, 'Quantity')) {
                $columns['quantity'] = $index;
            } elseif (str_starts_with($cell, 'Label Amount')) {
                $columns['revenue'] = $index;
            } elseif (str_starts_with($cell, 'Track Title')) {
                $columns['track'] = $index;
            } elseif ($cell === 'Store') {
                // Exact match only: the header also has an adjacent "Store Type" column,
                // and a prefix match would clobber this index with that one instead.
                $columns['store'] = $index;
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
     * @param array<string, array<string, array{streams: int, revenue: float}>> $trackPlatforms
     * @return list<array{track: string, platform: string, streams: int, revenue: float}>
     */
    private function flattenTrackPlatforms(array $trackPlatforms): array
    {
        $flat = [];
        foreach ($trackPlatforms as $track => $platforms) {
            foreach ($platforms as $platform => $totals) {
                $flat[] = ['track' => $track, 'platform' => $platform, 'streams' => $totals['streams'], 'revenue' => $totals['revenue']];
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

    private function mapPendingRow(array $row, float $rate): array
    {
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
        ];
    }
}
