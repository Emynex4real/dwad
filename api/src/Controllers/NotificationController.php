<?php

class NotificationController
{
    public function index(): void
    {
        Auth::requireAdmin(Database::pdo());
        $rows = Database::pdo()->query('SELECT * FROM notifications ORDER BY created_at DESC')->fetchAll();
        Response::json(array_map($this->mapNotification(...), $rows));
    }

    public function forArtist(array $args): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireUser($pdo);
        $id = $args['id'];

        if ($user['role'] !== 'admin' && $user['id'] !== $id) {
            throw new HttpException('Forbidden', 403);
        }

        $stmt = $pdo->prepare('SELECT * FROM notifications WHERE artist_id = ? ORDER BY created_at DESC');
        $stmt->execute([$id]);
        Response::json(array_map($this->mapNotification(...), $stmt->fetchAll()));
    }

    public function store(): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $body = Request::body();

        if (empty($body['artistId']) || empty($body['type']) || empty($body['title']) || empty($body['message'])) {
            throw new HttpException('artistId, type, title, and message are required.', 422);
        }

        $id = $this->insertNotification($body['artistId'], $body['type'], $body['title'], $body['message'], $body['metadata'] ?? null);
        Response::json($this->findNotification($id), 201);
    }

    public function broadcast(): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $body = Request::body();

        if (empty($body['artistIds']) || !is_array($body['artistIds']) || empty($body['type']) || empty($body['title']) || empty($body['message'])) {
            throw new HttpException('artistIds, type, title, and message are required.', 422);
        }

        $ids = array_map(
            fn (string $artistId) => $this->insertNotification($artistId, $body['type'], $body['title'], $body['message']),
            $body['artistIds'],
        );
        Response::json(array_map($this->findNotification(...), $ids), 201);
    }

    public function markRead(array $args): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireUser($pdo);
        $notification = $this->findNotification($args['id']);

        if ($notification === null) {
            throw new HttpException('Notification not found', 404);
        }
        if ($user['role'] !== 'admin' && $user['id'] !== $notification['artistId']) {
            throw new HttpException('Forbidden', 403);
        }

        $pdo->prepare('UPDATE notifications SET is_read = 1 WHERE id = ?')->execute([$args['id']]);
        Response::json($this->findNotification($args['id']));
    }

    public function markAllRead(array $args): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireUser($pdo);
        $id = $args['id'];

        if ($user['role'] !== 'admin' && $user['id'] !== $id) {
            throw new HttpException('Forbidden', 403);
        }

        $pdo->prepare('UPDATE notifications SET is_read = 1 WHERE artist_id = ?')->execute([$id]);
        Response::json(['success' => true]);
    }

    public function destroy(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $pdo->prepare('DELETE FROM notifications WHERE id = ?')->execute([$args['id']]);
        Response::json(['success' => true]);
    }

    private function insertNotification(string $artistId, string $type, string $title, string $message, ?array $metadata = null): string
    {
        $id = 'notif-' . bin2hex(random_bytes(6));
        $stmt = Database::pdo()->prepare(
            'INSERT INTO notifications (id, artist_id, type, title, message, metadata) VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$id, $artistId, $type, $title, $message, $metadata !== null ? json_encode($metadata) : null]);
        return $id;
    }

    private function findNotification(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM notifications WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row === false ? null : $this->mapNotification($row);
    }

    private function mapNotification(array $row): array
    {
        $metadata = $row['metadata'] !== null ? json_decode($row['metadata'], true) : null;

        return [
            'id' => $row['id'],
            'artistId' => $row['artist_id'],
            'type' => $row['type'],
            'title' => $row['title'],
            'message' => $row['message'],
            'isRead' => (bool) $row['is_read'],
            'createdAt' => $row['created_at'],
            ...($metadata !== null ? ['metadata' => $metadata] : []),
        ];
    }
}
