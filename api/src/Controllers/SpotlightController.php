<?php

class SpotlightController
{
    private const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
    private const STORAGE_DIR = __DIR__ . '/../../storage';
    private const SECTIONS = ['roster', 'top_talents', 'top_hits', 'videos', 'top_classics', 'cover_wall'];

    public function index(): void
    {
        $pdo = Database::pdo();

        $settingsRow = $pdo->query('SELECT * FROM spotlight_settings WHERE id = 1')->fetch();
        $itemRows = $pdo->query('SELECT * FROM spotlight_items ORDER BY section ASC, sort_order ASC')->fetchAll();

        $items = array_fill_keys(self::SECTIONS, []);
        foreach ($itemRows as $row) {
            $items[$row['section']][] = $this->mapItem($row);
        }

        Response::json([
            'settings' => $this->mapSettings($settingsRow),
            'items' => [
                'roster' => $items['roster'],
                'topTalents' => $items['top_talents'],
                'topHits' => $items['top_hits'],
                'videos' => $items['videos'],
                'topClassics' => $items['top_classics'],
                'coverWall' => $items['cover_wall'],
            ],
        ]);
    }

    public function storeItem(): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);

        $section = $_POST['section'] ?? '';
        if (!in_array($section, self::SECTIONS, true)) {
            throw new HttpException('Invalid section.', 422);
        }

        $primaryText = trim($_POST['primaryText'] ?? '');
        $secondaryText = trim($_POST['secondaryText'] ?? '');
        $videoId = trim($_POST['videoId'] ?? '');
        $externalUrl = $this->validatedUrl(trim($_POST['externalUrl'] ?? ''));

        $imageExt = null;
        if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $imageExt = $this->validatedExtension($_FILES['image']['name']);
        }

        if ($section === 'cover_wall' && $imageExt === null) {
            throw new HttpException('An image is required for cover wall entries.', 422);
        }
        if ($section === 'videos' && ($primaryText === '' || $secondaryText === '' || $videoId === '')) {
            throw new HttpException('Artist, title and YouTube video id are required for videos.', 422);
        }
        if (!in_array($section, ['videos', 'cover_wall'], true) && $primaryText === '') {
            throw new HttpException('primaryText is required.', 422);
        }

        $id = 'spotlight-item-' . bin2hex(random_bytes(6));
        $imagePath = $imageExt !== null
            ? $this->storeFile(self::STORAGE_DIR . "/spotlight/items/{$id}.{$imageExt}", $_FILES['image']['tmp_name'], "spotlight/items/{$id}.{$imageExt}")
            : null;

        $maxOrder = $pdo->prepare('SELECT COALESCE(MAX(sort_order), 0) FROM spotlight_items WHERE section = ?');
        $maxOrder->execute([$section]);
        $sortOrder = (int) $maxOrder->fetchColumn() + 1;

        $stmt = $pdo->prepare(
            'INSERT INTO spotlight_items (id, section, primary_text, secondary_text, image_path, video_id, external_url, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $id,
            $section,
            $primaryText !== '' ? $primaryText : null,
            $secondaryText !== '' ? $secondaryText : null,
            $imagePath,
            $videoId !== '' ? $videoId : null,
            $externalUrl,
            $sortOrder,
        ]);

        Response::json($this->findItem($id), 201);
    }

    public function updateItem(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);

        $row = $this->findItemRow($args['id']);
        if ($row === null) {
            throw new HttpException('Spotlight item not found', 404);
        }

        $isMultipart = str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data');
        $body = $isMultipart ? $_POST : Request::body();

        $fieldMap = ['primaryText' => 'primary_text', 'secondaryText' => 'secondary_text', 'videoId' => 'video_id'];
        $sets = [];
        $values = [];
        foreach ($fieldMap as $jsonKey => $column) {
            if (array_key_exists($jsonKey, $body)) {
                $value = trim((string) $body[$jsonKey]);
                $sets[] = "$column = ?";
                $values[] = $value !== '' ? $value : null;
            }
        }
        if (array_key_exists('externalUrl', $body)) {
            $sets[] = 'external_url = ?';
            $values[] = $this->validatedUrl(trim((string) $body['externalUrl']));
        }

        if ($isMultipart && !empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $ext = $this->validatedExtension($_FILES['image']['name']);
            $imagePath = $this->storeFile(self::STORAGE_DIR . "/spotlight/items/{$row['id']}.{$ext}", $_FILES['image']['tmp_name'], "spotlight/items/{$row['id']}.{$ext}");
            $this->deleteStoredFile($row['image_path'], $imagePath);
            $sets[] = 'image_path = ?';
            $values[] = $imagePath;
        }

        if ($sets !== []) {
            $values[] = $args['id'];
            $pdo->prepare('UPDATE spotlight_items SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($values);
        }

        Response::json($this->findItem($args['id']));
    }

    public function moveItem(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);

        $row = $this->findItemRow($args['id']);
        if ($row === null) {
            throw new HttpException('Spotlight item not found', 404);
        }

        $direction = Request::body()['direction'] ?? '';
        if (!in_array($direction, ['up', 'down'], true)) {
            throw new HttpException('direction must be "up" or "down".', 422);
        }

        $neighborStmt = $pdo->prepare(
            $direction === 'up'
                ? 'SELECT * FROM spotlight_items WHERE section = ? AND sort_order < ? ORDER BY sort_order DESC LIMIT 1'
                : 'SELECT * FROM spotlight_items WHERE section = ? AND sort_order > ? ORDER BY sort_order ASC LIMIT 1'
        );
        $neighborStmt->execute([$row['section'], $row['sort_order']]);
        $neighbor = $neighborStmt->fetch();

        if ($neighbor !== false) {
            $swap = $pdo->prepare('UPDATE spotlight_items SET sort_order = ? WHERE id = ?');
            $swap->execute([$neighbor['sort_order'], $row['id']]);
            $swap->execute([$row['sort_order'], $neighbor['id']]);
        }

        Response::json($this->findItem($args['id']));
    }

    public function destroyItem(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);

        $row = $this->findItemRow($args['id']);
        if ($row === null) {
            throw new HttpException('Spotlight item not found', 404);
        }

        if ($row['image_path'] !== null) {
            $path = self::STORAGE_DIR . '/' . $row['image_path'];
            if (is_file($path)) {
                unlink($path);
            }
        }

        $pdo->prepare('DELETE FROM spotlight_items WHERE id = ?')->execute([$args['id']]);
        Response::json(['success' => true]);
    }

    public function updateSettings(): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);

        $isMultipart = str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data');
        $body = $isMultipart ? $_POST : Request::body();

        $fieldMap = [
            'artistOfMonthName' => 'artist_of_month_name',
            'artistOfMonthGenre' => 'artist_of_month_genre',
            'artistOfMonthCountry' => 'artist_of_month_country',
        ];
        $sets = [];
        $values = [];
        foreach ($fieldMap as $jsonKey => $column) {
            if (array_key_exists($jsonKey, $body)) {
                $value = trim((string) $body[$jsonKey]);
                $sets[] = "$column = ?";
                $values[] = $value !== '' ? $value : null;
            }
        }

        if ($isMultipart && !empty($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $current = $pdo->query('SELECT artist_of_month_photo FROM spotlight_settings WHERE id = 1')->fetch();
            $ext = $this->validatedExtension($_FILES['photo']['name']);
            $photoPath = $this->storeFile(self::STORAGE_DIR . "/spotlight/artist-of-month.{$ext}", $_FILES['photo']['tmp_name'], "spotlight/artist-of-month.{$ext}");
            $this->deleteStoredFile($current['artist_of_month_photo'] ?? null, $photoPath);
            $sets[] = 'artist_of_month_photo = ?';
            $values[] = $photoPath;
        }

        if ($sets !== []) {
            $pdo->prepare('UPDATE spotlight_settings SET ' . implode(', ', $sets) . ' WHERE id = 1')->execute($values);
        }

        $settingsRow = $pdo->query('SELECT * FROM spotlight_settings WHERE id = 1')->fetch();
        Response::json($this->mapSettings($settingsRow));
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

    // Rendered as a raw <a href> on the public Spotlight page — without a scheme
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

    private function validatedExtension(string $filename): string
    {
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if (!in_array($ext, self::IMAGE_EXTENSIONS, true)) {
            throw new HttpException('Image must be a JPG, PNG or WEBP file.', 422);
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

    private function findItemRow(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM spotlight_items WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    private function findItem(string $id): ?array
    {
        $row = $this->findItemRow($id);
        return $row === null ? null : $this->mapItem($row);
    }

    private function mapItem(array $row): array
    {
        return [
            'id' => $row['id'],
            'section' => $row['section'],
            'primaryText' => $row['primary_text'],
            'secondaryText' => $row['secondary_text'],
            'imagePath' => $row['image_path'],
            'videoId' => $row['video_id'],
            'externalUrl' => $row['external_url'],
            'sortOrder' => (int) $row['sort_order'],
        ];
    }

    private function mapSettings(array $row): array
    {
        return [
            'artistOfMonth' => [
                'name' => $row['artist_of_month_name'],
                'genre' => $row['artist_of_month_genre'],
                'country' => $row['artist_of_month_country'],
                'photoUrl' => $row['artist_of_month_photo'],
            ],
        ];
    }
}
