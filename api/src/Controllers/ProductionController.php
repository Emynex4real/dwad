<?php

class ProductionController
{
    private const AUDIO_EXTENSIONS = ['wav', 'mp3'];
    private const COVER_EXTENSIONS = ['jpg', 'jpeg', 'png'];
    private const STORAGE_DIR = __DIR__ . '/../../storage';

    public function index(): void
    {
        $rows = Database::pdo()->query('SELECT * FROM productions ORDER BY created_at ASC')->fetchAll();
        Response::json(array_map($this->mapProduction(...), $rows));
    }

    public function store(): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);

        $title = trim($_POST['title'] ?? '');
        $artistName = trim($_POST['artistName'] ?? '');
        $spotifyUrl = trim($_POST['spotifyUrl'] ?? '');

        if ($title === '' || $artistName === '') {
            throw new HttpException('title and artistName are required.', 422);
        }

        // Validate every extension before writing anything to disk, so a rejected
        // upload never leaves an orphaned cover file behind. Audio/cover are both
        // optional at creation time — e.g. a catalog entry can be added before its
        // master file is ready, then filled in later.
        $audioExt = null;
        if (!empty($_FILES['audio']) && $_FILES['audio']['error'] === UPLOAD_ERR_OK) {
            $audioExt = $this->validatedExtension($_FILES['audio']['name'], self::AUDIO_EXTENSIONS, 'Audio must be a WAV or MP3 file.');
        }
        $coverExt = null;
        if (!empty($_FILES['cover']) && $_FILES['cover']['error'] === UPLOAD_ERR_OK) {
            $coverExt = $this->validatedExtension($_FILES['cover']['name'], self::COVER_EXTENSIONS, 'Cover art must be a JPG or PNG file.');
        }

        $id = 'production-' . bin2hex(random_bytes(6));
        $audioUrl = $audioExt !== null
            ? $this->storeFile(self::STORAGE_DIR . "/productions/audio/{$id}.{$audioExt}", $_FILES['audio']['tmp_name'], "productions/audio/{$id}.{$audioExt}")
            : null;
        $coverUrl = $coverExt !== null
            ? $this->storeFile(self::STORAGE_DIR . "/productions/covers/{$id}.{$coverExt}", $_FILES['cover']['tmp_name'], "productions/covers/{$id}.{$coverExt}")
            : null;

        $stmt = $pdo->prepare(
            'INSERT INTO productions (id, title, artist_name, cover_art_url, audio_file_url, spotify_url)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$id, $title, $artistName, $coverUrl, $audioUrl, $spotifyUrl !== '' ? $spotifyUrl : null]);

        Response::json($this->findProduction($id), 201);
    }

    public function update(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);

        $row = $this->findProductionRow($args['id']);
        if ($row === null) {
            throw new HttpException('Production not found', 404);
        }

        // A PATCH with a JSON body only ever changes text fields. Replacing the
        // audio/cover file requires multipart, which PHP only populates $_FILES/
        // $_POST for on a POST request — so the admin UI posts here instead when
        // a new file is attached.
        $isMultipart = str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data');
        $body = $isMultipart ? $_POST : Request::body();

        $fieldMap = ['title' => 'title', 'artistName' => 'artist_name', 'spotifyUrl' => 'spotify_url'];
        $sets = [];
        $values = [];
        foreach ($fieldMap as $jsonKey => $column) {
            if (array_key_exists($jsonKey, $body)) {
                $value = $body[$jsonKey];
                $sets[] = "$column = ?";
                $values[] = $isMultipart && $value === '' ? null : $value;
            }
        }

        if ($isMultipart) {
            if (!empty($_FILES['audio']) && $_FILES['audio']['error'] === UPLOAD_ERR_OK) {
                $audioExt = $this->validatedExtension($_FILES['audio']['name'], self::AUDIO_EXTENSIONS, 'Audio must be a WAV or MP3 file.');
                $audioUrl = $this->storeFile(self::STORAGE_DIR . "/productions/audio/{$args['id']}.{$audioExt}", $_FILES['audio']['tmp_name'], "productions/audio/{$args['id']}.{$audioExt}");
                $this->deleteStoredFile($row['audio_file_url'], $audioUrl);
                $sets[] = 'audio_file_url = ?';
                $values[] = $audioUrl;
            }
            if (!empty($_FILES['cover']) && $_FILES['cover']['error'] === UPLOAD_ERR_OK) {
                $coverExt = $this->validatedExtension($_FILES['cover']['name'], self::COVER_EXTENSIONS, 'Cover art must be a JPG or PNG file.');
                $coverUrl = $this->storeFile(self::STORAGE_DIR . "/productions/covers/{$args['id']}.{$coverExt}", $_FILES['cover']['tmp_name'], "productions/covers/{$args['id']}.{$coverExt}");
                $this->deleteStoredFile($row['cover_art_url'], $coverUrl);
                $sets[] = 'cover_art_url = ?';
                $values[] = $coverUrl;
            }
        }

        if ($sets !== []) {
            $values[] = $args['id'];
            $pdo->prepare('UPDATE productions SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($values);
        }

        Response::json($this->findProduction($args['id']));
    }

    private function deleteStoredFile(?string $oldRelativePath, string $newRelativePath): void
    {
        if ($oldRelativePath === null || $oldRelativePath === $newRelativePath) {
            return;
        }
        $oldPath = self::STORAGE_DIR . '/' . $oldRelativePath;
        if (is_file($oldPath)) {
            unlink($oldPath);
        }
    }

    public function destroy(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $row = $this->findProductionRow($args['id']);
        if ($row === null) {
            throw new HttpException('Production not found', 404);
        }

        foreach ([$row['audio_file_url'], $row['cover_art_url']] as $relativePath) {
            if ($relativePath === null) {
                continue;
            }
            $path = self::STORAGE_DIR . '/' . $relativePath;
            if (is_file($path)) {
                unlink($path);
            }
        }

        $pdo->prepare('DELETE FROM productions WHERE id = ?')->execute([$args['id']]);
        Response::json(['success' => true]);
    }

    private function validatedExtension(string $filename, array $allowed, string $errorMessage): string
    {
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed, true)) {
            throw new HttpException($errorMessage, 422);
        }
        return $ext;
    }

    private function storeFile(string $dest, string $tmpName, string $relativePath): string
    {
        if (!move_uploaded_file($tmpName, $dest)) {
            throw new HttpException('Failed to store uploaded file.', 500);
        }
        return $relativePath;
    }

    private function findProductionRow(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM productions WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    private function findProduction(string $id): ?array
    {
        $row = $this->findProductionRow($id);
        return $row === null ? null : $this->mapProduction($row);
    }

    private function mapProduction(array $row): array
    {
        return [
            'id' => $row['id'],
            'title' => $row['title'],
            'artistName' => $row['artist_name'],
            'coverArtUrl' => $row['cover_art_url'],
            'audioFileUrl' => $row['audio_file_url'],
            'spotifyUrl' => $row['spotify_url'],
            'createdAt' => $row['created_at'],
        ];
    }
}
