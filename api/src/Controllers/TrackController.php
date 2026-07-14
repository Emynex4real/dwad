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

        $stmt = $pdo->prepare(
            'INSERT INTO tracks (id, artist_id, title, featuring, genre, release_date, cover_art_url, audio_file_url, platforms)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $id, $artistId, $title, $featuring !== '' ? $featuring : null, $genre, $releaseDate,
            $coverUrl, $audioUrl, json_encode($platforms),
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
            $zip->addFile($f['tmp_name'], sprintf('%02d-%s', $i + 1, $f['name']));
        }
        $zip->close();
        return "audio/{$id}.zip";
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
        ];
    }
}
