<?php

class DistroReleaseController
{
    private const COVER_EXTENSIONS = ['jpg', 'jpeg', 'png'];
    private const STORAGE_DIR = __DIR__ . '/../../storage';

    public function index(): void
    {
        $rows = Database::pdo()->query('SELECT * FROM distro_releases ORDER BY created_at DESC')->fetchAll();
        Response::json(array_map($this->mapRelease(...), $rows));
    }

    public function store(): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);

        $title = trim($_POST['title'] ?? '');
        $artistName = trim($_POST['artistName'] ?? '');
        $releaseUrl = $this->validatedUrl(trim($_POST['releaseUrl'] ?? ''));

        if ($title === '' || $artistName === '') {
            throw new HttpException('title and artistName are required.', 422);
        }

        $coverExt = null;
        if (!empty($_FILES['cover']) && $_FILES['cover']['error'] === UPLOAD_ERR_OK) {
            $coverExt = $this->validatedExtension($_FILES['cover']['name'], self::COVER_EXTENSIONS, 'Cover art must be a JPG or PNG file.');
        }

        $id = 'distro-release-' . bin2hex(random_bytes(6));
        $coverUrl = $coverExt !== null
            ? $this->storeFile(self::STORAGE_DIR . "/distro_releases/covers/{$id}.{$coverExt}", $_FILES['cover']['tmp_name'], "distro_releases/covers/{$id}.{$coverExt}")
            : null;

        $stmt = $pdo->prepare(
            'INSERT INTO distro_releases (id, title, artist_name, cover_art_url, release_url)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([$id, $title, $artistName, $coverUrl, $releaseUrl]);

        Response::json($this->findRelease($id), 201);
    }

    public function update(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);

        $row = $this->findReleaseRow($args['id']);
        if ($row === null) {
            throw new HttpException('Distro release not found', 404);
        }

        $isMultipart = str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data');
        $body = $isMultipart ? $_POST : Request::body();

        $fieldMap = ['title' => 'title', 'artistName' => 'artist_name'];
        $sets = [];
        $values = [];
        foreach ($fieldMap as $jsonKey => $column) {
            if (array_key_exists($jsonKey, $body)) {
                $value = $body[$jsonKey];
                $sets[] = "$column = ?";
                $values[] = $isMultipart && $value === '' ? null : $value;
            }
        }
        if (array_key_exists('releaseUrl', $body)) {
            $sets[] = 'release_url = ?';
            $values[] = $this->validatedUrl(trim((string) $body['releaseUrl']));
        }

        if ($isMultipart && !empty($_FILES['cover']) && $_FILES['cover']['error'] === UPLOAD_ERR_OK) {
            $coverExt = $this->validatedExtension($_FILES['cover']['name'], self::COVER_EXTENSIONS, 'Cover art must be a JPG or PNG file.');
            $coverUrl = $this->storeFile(self::STORAGE_DIR . "/distro_releases/covers/{$args['id']}.{$coverExt}", $_FILES['cover']['tmp_name'], "distro_releases/covers/{$args['id']}.{$coverExt}");
            $this->deleteStoredFile($row['cover_art_url'], $coverUrl);
            $sets[] = 'cover_art_url = ?';
            $values[] = $coverUrl;
        }

        if ($sets !== []) {
            $values[] = $args['id'];
            $pdo->prepare('UPDATE distro_releases SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($values);
        }

        Response::json($this->findRelease($args['id']));
    }

    public function destroy(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $row = $this->findReleaseRow($args['id']);
        if ($row === null) {
            throw new HttpException('Distro release not found', 404);
        }

        if ($row['cover_art_url'] !== null) {
            $path = self::STORAGE_DIR . '/' . $row['cover_art_url'];
            if (is_file($path)) {
                unlink($path);
            }
        }

        $pdo->prepare('DELETE FROM distro_releases WHERE id = ?')->execute([$args['id']]);
        Response::json(['success' => true]);
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

    // Rendered as a raw <a href> on the public Distro page — without a scheme
    // allowlist here, an admin-set `javascript:` URL would execute in any visitor's
    // browser when clicked (target="_blank"/rel="noreferrer" don't block that scheme).
    private function validatedUrl(string $url): ?string
    {
        if ($url === '') {
            return null;
        }
        $scheme = strtolower((string) parse_url($url, PHP_URL_SCHEME));
        if (!in_array($scheme, ['http', 'https'], true)) {
            throw new HttpException('URL must start with http:// or https://.', 422);
        }
        return $url;
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

    private function findReleaseRow(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM distro_releases WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    private function findRelease(string $id): ?array
    {
        $row = $this->findReleaseRow($id);
        return $row === null ? null : $this->mapRelease($row);
    }

    private function mapRelease(array $row): array
    {
        return [
            'id' => $row['id'],
            'title' => $row['title'],
            'artistName' => $row['artist_name'],
            'coverArtUrl' => $row['cover_art_url'],
            'releaseUrl' => $row['release_url'],
            'createdAt' => $row['created_at'],
        ];
    }
}
