<?php

class BeatController
{
    private const AUDIO_EXTENSIONS = ['wav', 'mp3'];
    private const STORAGE_DIR = __DIR__ . '/../../storage';
    private const TYPES = ['lease', 'purchase'];

    public function index(): void
    {
        $rows = Database::pdo()->query('SELECT * FROM beats ORDER BY created_at ASC')->fetchAll();
        Response::json(array_map($this->mapBeat(...), $rows));
    }

    public function store(): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);

        $title = trim($_POST['title'] ?? '');
        $bpm = trim($_POST['bpm'] ?? '');
        $type = $_POST['type'] ?? 'lease';
        $price = $_POST['price'] ?? '';

        if ($title === '') {
            throw new HttpException('title is required.', 422);
        }
        if (!in_array($type, self::TYPES, true)) {
            throw new HttpException('type must be one of: ' . implode(', ', self::TYPES), 422);
        }

        // Audio is optional at creation — a catalog entry can be added before its
        // master file is ready, then filled in later.
        $audioUrl = null;
        if (!empty($_FILES['audio']) && $_FILES['audio']['error'] === UPLOAD_ERR_OK) {
            $audioExt = $this->validatedExtension($_FILES['audio']['name'], self::AUDIO_EXTENSIONS, 'Audio must be a WAV or MP3 file.');
            $id = 'beat-' . bin2hex(random_bytes(6));
            $dest = self::STORAGE_DIR . "/beats/audio/{$id}.{$audioExt}";
            if (!move_uploaded_file($_FILES['audio']['tmp_name'], $dest)) {
                throw new HttpException('Failed to store audio file.', 500);
            }
            $audioUrl = "beats/audio/{$id}.{$audioExt}";
        } else {
            $id = 'beat-' . bin2hex(random_bytes(6));
        }

        $stmt = $pdo->prepare(
            'INSERT INTO beats (id, title, bpm, type, price, audio_file_url)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$id, $title, $bpm !== '' ? $bpm : null, $type, $price !== '' ? $price : null, $audioUrl]);

        Response::json($this->findBeat($id), 201);
    }

    public function update(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);

        $row = $this->findBeatRow($args['id']);
        if ($row === null) {
            throw new HttpException('Beat not found', 404);
        }

        // A PATCH with a JSON body only ever changes text fields. Replacing the
        // audio file requires multipart, which PHP only populates $_FILES/$_POST
        // for on a POST request — so the admin UI posts here instead when a new
        // file is attached.
        $isMultipart = str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data');
        $body = $isMultipart ? $_POST : Request::body();

        if (array_key_exists('type', $body) && !in_array($body['type'], self::TYPES, true)) {
            throw new HttpException('type must be one of: ' . implode(', ', self::TYPES), 422);
        }

        $fieldMap = ['title' => 'title', 'bpm' => 'bpm', 'type' => 'type', 'price' => 'price'];
        $sets = [];
        $values = [];
        foreach ($fieldMap as $jsonKey => $column) {
            if (array_key_exists($jsonKey, $body)) {
                $value = $body[$jsonKey];
                $sets[] = "$column = ?";
                $values[] = $isMultipart && $value === '' ? null : $value;
            }
        }

        if ($isMultipart && !empty($_FILES['audio']) && $_FILES['audio']['error'] === UPLOAD_ERR_OK) {
            $audioExt = $this->validatedExtension($_FILES['audio']['name'], self::AUDIO_EXTENSIONS, 'Audio must be a WAV or MP3 file.');
            $dest = self::STORAGE_DIR . "/beats/audio/{$args['id']}.{$audioExt}";
            $audioUrl = "beats/audio/{$args['id']}.{$audioExt}";
            if (!move_uploaded_file($_FILES['audio']['tmp_name'], $dest)) {
                throw new HttpException('Failed to store audio file.', 500);
            }
            if ($row['audio_file_url'] !== null && $row['audio_file_url'] !== $audioUrl) {
                $oldPath = self::STORAGE_DIR . '/' . $row['audio_file_url'];
                if (is_file($oldPath)) {
                    unlink($oldPath);
                }
            }
            $sets[] = 'audio_file_url = ?';
            $values[] = $audioUrl;
        }

        if ($sets !== []) {
            $values[] = $args['id'];
            $pdo->prepare('UPDATE beats SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($values);
        }

        Response::json($this->findBeat($args['id']));
    }

    public function destroy(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $row = $this->findBeatRow($args['id']);
        if ($row === null) {
            throw new HttpException('Beat not found', 404);
        }

        $path = self::STORAGE_DIR . '/' . $row['audio_file_url'];
        if (is_file($path)) {
            unlink($path);
        }

        $pdo->prepare('DELETE FROM beats WHERE id = ?')->execute([$args['id']]);
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

    private function findBeatRow(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM beats WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    private function findBeat(string $id): ?array
    {
        $row = $this->findBeatRow($id);
        return $row === null ? null : $this->mapBeat($row);
    }

    private function mapBeat(array $row): array
    {
        return [
            'id' => $row['id'],
            'title' => $row['title'],
            'bpm' => $row['bpm'],
            'type' => $row['type'],
            'price' => $row['price'] !== null ? (float) $row['price'] : null,
            'audioFileUrl' => $row['audio_file_url'],
            'createdAt' => $row['created_at'],
        ];
    }
}
