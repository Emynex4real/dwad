<?php

class TrackController
{
    private const AUDIO_EXTENSIONS = ['wav', 'mp3'];
    private const COVER_EXTENSIONS = ['jpg', 'jpeg', 'png'];
    private const STORAGE_DIR = __DIR__ . '/../../storage';

    public function index(): void
    {
        Auth::requireAdmin(Database::pdo());
        $rows = Database::pdo()->query('SELECT * FROM tracks ORDER BY submitted_at DESC')->fetchAll();
        Response::json(array_map($this->mapTrack(...), $rows));
    }

    public function live(): void
    {
        // cover_art_url IS NOT NULL: real submissions always have cover art
        // (store() requires it), but a handful of older seed/demo rows were
        // inserted directly without one — exclude those rather than show a
        // broken image in this cover-art-driven grid.
        $rows = Database::pdo()->query(
            "SELECT t.id, t.title, t.release_date, t.cover_art_url, t.release_link, a.name AS artist_name
             FROM tracks t
             JOIN artists a ON a.id = t.artist_id
             WHERE t.status = 'live' AND t.cover_art_url IS NOT NULL
             ORDER BY t.submitted_at DESC
             LIMIT 12"
        )->fetchAll();

        Response::json(array_map(fn (array $row) => [
            'id' => $row['id'],
            'title' => $row['title'],
            'artistName' => $row['artist_name'],
            'coverArtUrl' => $row['cover_art_url'],
            'releaseLink' => $row['release_link'],
            'releaseDate' => $row['release_date'],
        ], $rows));
    }

    public function forArtist(array $args): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireUser($pdo);
        $id = $args['id'];

        if ($user['role'] !== 'admin' && $user['id'] !== $id) {
            throw new HttpException('Forbidden', 403);
        }

        $stmt = $pdo->prepare('SELECT * FROM tracks WHERE artist_id = ? ORDER BY submitted_at DESC');
        $stmt->execute([$id]);
        Response::json(array_map($this->mapTrack(...), $stmt->fetchAll()));
    }

    public function show(array $args): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireUser($pdo);
        $row = $this->findTrackRow($args['id']);

        if ($row === null) {
            throw new HttpException('Track not found', 404);
        }
        if ($user['role'] !== 'admin' && $user['id'] !== $row['artist_id']) {
            throw new HttpException('Forbidden', 403);
        }

        Response::json($this->mapTrack($row));
    }

    public function store(): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireUser($pdo);

        $artistId = $_POST['artistId'] ?? '';
        $title = trim($_POST['title'] ?? '');
        $genre = trim($_POST['genre'] ?? '');
        $releaseDate = $_POST['releaseDate'] ?? '';
        $platformsRaw = $_POST['platforms'] ?? '';
        $featuring = trim($_POST['featuring'] ?? '');

        if ($artistId === '' || $title === '' || $genre === '' || $releaseDate === '' || $platformsRaw === '') {
            throw new HttpException('artistId, title, genre, releaseDate, and platforms are required.', 422);
        }
        if ($user['role'] !== 'admin' && $user['id'] !== $artistId) {
            throw new HttpException('Forbidden', 403);
        }

        $platforms = json_decode($platformsRaw, true);
        if (!is_array($platforms)) {
            throw new HttpException('platforms must be a JSON array.', 422);
        }

        if (empty($_FILES['cover']) || $_FILES['cover']['error'] !== UPLOAD_ERR_OK) {
            throw new HttpException('Cover art is required.', 422);
        }
        if (empty($_FILES['audio']) || empty($_FILES['audio']['name'][0])) {
            throw new HttpException('At least one audio file is required.', 422);
        }

        // Validate every extension before writing anything to disk, so a rejected
        // upload (e.g. a bad audio extension) never leaves an orphaned cover file behind.
        $coverExt = $this->validatedExtension($_FILES['cover']['name'], self::COVER_EXTENSIONS, 'Cover art must be a JPG or PNG file.');
        $validAudio = $this->validAudioFiles($_FILES['audio']);

        $id = 'track-' . bin2hex(random_bytes(6));
        $coverUrl = $this->storeCover($id, $_FILES['cover']['tmp_name'], $coverExt);
        $audioUrl = $this->storeAudio($id, $validAudio);

        $albumId = trim($_POST['albumId'] ?? '');
        $albumTitle = trim($_POST['albumTitle'] ?? '');
        $albumType = trim($_POST['albumType'] ?? '');
        $details = $this->sanitizedDetails($_POST['details'] ?? '');

        $stmt = $pdo->prepare(
            'INSERT INTO tracks (id, artist_id, title, featuring, genre, release_date, cover_art_url, audio_file_url, platforms, album_id, album_title, album_type, submission_json)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $id, $artistId, $title, $featuring !== '' ? $featuring : null, $genre, $releaseDate,
            $coverUrl, $audioUrl, json_encode($platforms),
            $albumId !== '' ? $albumId : null,
            $albumTitle !== '' ? $albumTitle : null,
            $albumType !== '' ? $albumType : null,
            $details !== [] ? json_encode($details) : null,
        ]);

        Response::json($this->findTrack($id), 201);
    }

    public function updateStatus(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $body = Request::body();

        if (empty($body['status'])) {
            throw new HttpException('status is required.', 422);
        }

        $sets = ['status = ?'];
        $values = [$body['status']];
        if (array_key_exists('reviewNote', $body)) {
            $sets[] = 'review_note = ?';
            $values[] = $body['reviewNote'];
        }
        $values[] = $args['id'];
        $pdo->prepare('UPDATE tracks SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($values);

        $track = $this->findTrack($args['id']);
        if ($track === null) {
            throw new HttpException('Track not found', 404);
        }
        Response::json($track);
    }

    public function update(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $body = Request::body();

        $fieldMap = [
            'title' => 'title', 'featuring' => 'featuring', 'genre' => 'genre',
            'releaseDate' => 'release_date', 'upcCode' => 'upc_code', 'isrcCode' => 'isrc_code',
            'releaseLink' => 'release_link', 'status' => 'status', 'reviewNote' => 'review_note',
        ];
        $sets = [];
        $values = [];
        foreach ($fieldMap as $jsonKey => $column) {
            if (array_key_exists($jsonKey, $body)) {
                $sets[] = "$column = ?";
                $values[] = $body[$jsonKey];
            }
        }
        if (array_key_exists('platforms', $body)) {
            if (!is_array($body['platforms'])) {
                throw new HttpException('platforms must be an array.', 422);
            }
            $sets[] = 'platforms = ?';
            $values[] = json_encode($body['platforms']);
        }

        if ($sets !== []) {
            $values[] = $args['id'];
            $pdo->prepare('UPDATE tracks SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($values);
        }

        $track = $this->findTrack($args['id']);
        if ($track === null) {
            throw new HttpException('Track not found', 404);
        }
        Response::json($track);
    }

    // Lets an artist clean up their own still-pending submission — used by the
    // upload form to roll back songs already saved for an album when a later
    // song in the same batch fails, so a failed multi-song upload never leaves
    // a broken partial album behind. Admins may delete any track for general cleanup.
    public function destroy(array $args): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireUser($pdo);
        $row = $this->findTrackRow($args['id']);

        if ($row === null) {
            throw new HttpException('Track not found', 404);
        }
        if ($user['role'] !== 'admin') {
            if ($user['id'] !== $row['artist_id']) {
                throw new HttpException('Forbidden', 403);
            }
            if ($row['status'] !== 'pending') {
                throw new HttpException('Only a pending submission can be deleted.', 403);
            }
        }

        foreach ([$row['cover_art_url'], $row['audio_file_url']] as $relativePath) {
            if ($relativePath === null) {
                continue;
            }
            $path = self::STORAGE_DIR . '/' . $relativePath;
            if (is_file($path)) {
                unlink($path);
            }
        }

        $pdo->prepare('DELETE FROM tracks WHERE id = ?')->execute([$args['id']]);
        Response::json(['success' => true]);
    }

    public function audio(array $args): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireUser($pdo);
        $row = $this->findTrackRow($args['id']);

        if ($row === null || $row['audio_file_url'] === null) {
            throw new HttpException('Audio file not found', 404);
        }
        if ($user['role'] !== 'admin' && $user['id'] !== $row['artist_id']) {
            throw new HttpException('Forbidden', 403);
        }

        $path = self::STORAGE_DIR . '/' . $row['audio_file_url'];
        if (!is_file($path)) {
            throw new HttpException('Audio file not found', 404);
        }

        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $mime = match ($ext) {
            'zip' => 'application/zip',
            'wav' => 'audio/wav',
            default => 'audio/mpeg',
        };

        header('Content-Type: ' . $mime);
        header('Content-Disposition: attachment; filename="' . basename($path) . '"');
        header('Content-Length: ' . (string) filesize($path));
        readfile($path);
    }

    // Cover art is otherwise served as a static file under /storage/ (no CORS headers,
    // since Apache serves it directly rather than through this PHP app) — fine for an
    // <img> tag, but a cross-origin fetch()/download attribute silently fails. This
    // endpoint routes through the app so Content-Disposition can force a real download.
    public function cover(array $args): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireUser($pdo);
        $row = $this->findTrackRow($args['id']);

        if ($row === null || $row['cover_art_url'] === null) {
            throw new HttpException('Cover art not found', 404);
        }
        if ($user['role'] !== 'admin' && $user['id'] !== $row['artist_id']) {
            throw new HttpException('Forbidden', 403);
        }

        $path = self::STORAGE_DIR . '/' . $row['cover_art_url'];
        if (!is_file($path)) {
            throw new HttpException('Cover art not found', 404);
        }

        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $mime = match ($ext) {
            'png' => 'image/png',
            'webp' => 'image/webp',
            default => 'image/jpeg',
        };

        header('Content-Type: ' . $mime);
        header('Content-Disposition: attachment; filename="' . basename($path) . '"');
        header('Content-Length: ' . (string) filesize($path));
        readfile($path);
    }

    // Free-text key -> max length. Anything not listed here is dropped, so a client
    // can't stash arbitrary data in the row.
    private const DETAIL_TEXT_FIELDS = [
        'stageName' => 200, 'realName' => 200, 'country' => 120, 'whatsapp' => 60,
        'producer' => 200, 'profileLink' => 500, 'featuringProfileLink' => 500, 'notes' => 2000,
    ];
    private const DETAIL_YES_NO_FIELDS = ['previouslyReleased', 'featuringPreviouslyReleased'];

    /** @return array<string, string> */
    private function sanitizedDetails(mixed $raw): array
    {
        if (!is_string($raw) || $raw === '') {
            return [];
        }
        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            return [];
        }

        $clean = [];
        foreach (self::DETAIL_TEXT_FIELDS as $key => $maxLength) {
            if (isset($decoded[$key]) && is_string($decoded[$key])) {
                $value = trim($decoded[$key]);
                if ($value !== '') {
                    $clean[$key] = mb_substr($value, 0, $maxLength);
                }
            }
        }
        foreach (self::DETAIL_YES_NO_FIELDS as $key) {
            if (isset($decoded[$key]) && in_array($decoded[$key], ['yes', 'no'], true)) {
                $clean[$key] = $decoded[$key];
            }
        }
        return $clean;
    }

    public function albumAudio(array $args): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireUser($pdo);

        $stmt = $pdo->prepare('SELECT * FROM tracks WHERE album_id = ? AND audio_file_url IS NOT NULL ORDER BY submitted_at ASC, id ASC');
        $stmt->execute([$args['albumId']]);
        $rows = $stmt->fetchAll();

        if ($rows === []) {
            throw new HttpException('Album audio not found', 404);
        }
        // Every row in an album belongs to one artist (they're created in a single submit).
        if ($user['role'] !== 'admin' && $user['id'] !== $rows[0]['artist_id']) {
            throw new HttpException('Forbidden', 403);
        }

        $tmp = tempnam(sys_get_temp_dir(), 'album');
        $zip = new ZipArchive();
        if ($zip->open($tmp, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new HttpException('Failed to create archive.', 500);
        }
        $added = 0;
        foreach ($rows as $i => $row) {
            $path = self::STORAGE_DIR . '/' . $row['audio_file_url'];
            if (!is_file($path)) {
                continue;
            }
            $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            $zip->addFile($path, sprintf('%02d-%s.%s', $i + 1, $this->sanitizeZipEntryName($row['title']), $ext));
            $added++;
        }
        $zip->close();

        if ($added === 0) {
            unlink($tmp);
            throw new HttpException('Album audio not found', 404);
        }

        $name = $this->sanitizeZipEntryName($rows[0]['album_title'] ?? 'album') . '.zip';
        header('Content-Type: application/zip');
        header('Content-Disposition: attachment; filename="' . $name . '"');
        header('Content-Length: ' . (string) filesize($tmp));
        readfile($tmp);
        unlink($tmp);
    }

    private function validatedExtension(string $filename, array $allowed, string $errorMessage): string
    {
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed, true)) {
            throw new HttpException($errorMessage, 422);
        }
        return $ext;
    }

    /** @return list<array{tmp_name: string, ext: string, name: string}> */
    private function validAudioFiles(array $files): array
    {
        $valid = [];
        foreach ($files['name'] as $i => $name) {
            if ($files['error'][$i] !== UPLOAD_ERR_OK) {
                continue;
            }
            $ext = $this->validatedExtension($name, self::AUDIO_EXTENSIONS, 'Audio files must be WAV or MP3.');
            $valid[] = ['tmp_name' => $files['tmp_name'][$i], 'ext' => $ext, 'name' => $name];
        }

        if ($valid === []) {
            throw new HttpException('At least one valid audio file is required.', 422);
        }
        return $valid;
    }

    private function storeCover(string $id, string $tmpName, string $ext): string
    {
        $dest = self::STORAGE_DIR . "/covers/{$id}.{$ext}";
        if (!move_uploaded_file($tmpName, $dest)) {
            throw new HttpException('Failed to store cover art.', 500);
        }
        return "covers/{$id}.{$ext}";
    }

    /** @param list<array{tmp_name: string, ext: string, name: string}> $valid */
    private function storeAudio(string $id, array $valid): string
    {
        if (count($valid) === 1) {
            $dest = self::STORAGE_DIR . "/audio/{$id}.{$valid[0]['ext']}";
            if (!move_uploaded_file($valid[0]['tmp_name'], $dest)) {
                throw new HttpException('Failed to store audio file.', 500);
            }
            return "audio/{$id}.{$valid[0]['ext']}";
        }

        $dest = self::STORAGE_DIR . "/audio/{$id}.zip";
        $zip = new ZipArchive();
        if ($zip->open($dest, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new HttpException('Failed to create archive.', 500);
        }
        foreach ($valid as $i => $f) {
            $zip->addFile($f['tmp_name'], sprintf('%02d-%s', $i + 1, $this->sanitizeZipEntryName($f['name'])));
        }
        $zip->close();
        return "audio/{$id}.zip";
    }

    private function sanitizeZipEntryName(string $name): string
    {
        $name = preg_replace('/[^A-Za-z0-9._-]/', '_', basename($name)) ?? '';
        return $name !== '' ? $name : 'file';
    }

    private function findTrackRow(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM tracks WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    private function findTrack(string $id): ?array
    {
        $row = $this->findTrackRow($id);
        return $row === null ? null : $this->mapTrack($row);
    }

    private function mapTrack(array $row): array
    {
        return [
            'id' => $row['id'],
            'artistId' => $row['artist_id'],
            'title' => $row['title'],
            ...($row['featuring'] !== null ? ['featuring' => $row['featuring']] : []),
            'genre' => $row['genre'],
            'releaseDate' => $row['release_date'],
            ...($row['upc_code'] !== null ? ['upcCode' => $row['upc_code']] : []),
            ...($row['isrc_code'] !== null ? ['isrcCode' => $row['isrc_code']] : []),
            ...($row['release_link'] !== null ? ['releaseLink' => $row['release_link']] : []),
            ...($row['cover_art_url'] !== null ? ['coverArtUrl' => $row['cover_art_url']] : []),
            ...($row['audio_file_url'] !== null ? ['audioFileUrl' => $row['audio_file_url']] : []),
            'status' => $row['status'],
            'submittedAt' => $row['submitted_at'],
            ...($row['review_note'] !== null ? ['reviewNote' => $row['review_note']] : []),
            'platforms' => json_decode($row['platforms'], true),
            ...($row['album_id'] !== null ? ['albumId' => $row['album_id']] : []),
            ...($row['album_title'] !== null ? ['albumTitle' => $row['album_title']] : []),
            ...($row['album_type'] !== null ? ['albumType' => $row['album_type']] : []),
            ...(($row['submission_json'] ?? null) !== null ? ['details' => json_decode($row['submission_json'], true)] : []),
        ];
    }
}
