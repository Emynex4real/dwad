<?php

class InviteController
{
    public function store(): void
    {
        $pdo = Database::pdo();
        $admin = Auth::requireAdmin($pdo);

        $token = bin2hex(random_bytes(24));
        $pdo->prepare('INSERT INTO artist_invites (token, created_by) VALUES (?, ?)')
            ->execute([$token, $admin['id']]);

        Response::json(['token' => $token], 201);
    }

    public function show(array $args): void
    {
        if ($this->findValidInvite($args['token']) === null) {
            throw new HttpException('This invite link is no longer valid.', 404);
        }
        Response::json(['valid' => true]);
    }

    public function register(array $args): void
    {
        $pdo = Database::pdo();
        $token = $args['token'];

        if ($this->findValidInvite($token) === null) {
            throw new HttpException('This invite link is no longer valid.', 404);
        }

        $body = Request::body();
        $email = strtolower(trim($body['email'] ?? ''));
        if (empty($body['name']) || $email === '' || empty($body['password'])) {
            throw new HttpException('Name, email, and password are required.', 422);
        }

        $id = 'artist-' . bin2hex(random_bytes(6));

        $stmt = $pdo->prepare(
            'INSERT INTO artists (id, name, email, password_hash, role, phone, genre, country, bio, upload_access, status, joined_date, social_spotify, social_instagram, social_youtube, social_apple)
             VALUES (?, ?, ?, ?, \'artist\', ?, ?, ?, ?, \'granted\', \'pending\', CURDATE(), ?, ?, ?, ?)'
        );
        $social = $body['socialLinks'] ?? [];
        try {
            $stmt->execute([
                $id,
                $body['name'],
                $email,
                password_hash($body['password'], PASSWORD_BCRYPT),
                $body['phone'] ?? '',
                $body['genre'] ?? '',
                $body['country'] ?? '',
                $body['bio'] ?? '',
                $social['spotify'] ?? null,
                $social['instagram'] ?? null,
                $social['youtube'] ?? null,
                $social['apple'] ?? null,
            ]);
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                throw new HttpException('An artist with that email already exists.', 409);
            }
            throw $e;
        }

        $sub = $body['subscription'] ?? [];
        $subStmt = $pdo->prepare(
            'INSERT INTO subscriptions (id, artist_id, plan, status, start_date, expiry_date, auto_renew, price)
             VALUES (?, ?, ?, \'active\', ?, ?, ?, ?)'
        );
        $subStmt->execute([
            'sub-' . bin2hex(random_bytes(6)),
            $id,
            $sub['plan'] ?? 'plan-a',
            date('Y-m-d'),
            date('Y-m-d', strtotime('+1 year')),
            !empty($sub['autoRenew']) ? 1 : 0,
            $sub['price'] ?? 0,
        ]);

        $pdo->prepare('UPDATE artist_invites SET used_at = NOW(), used_by_artist_id = ? WHERE token = ?')
            ->execute([$id, $token]);

        Response::json(['success' => true], 201);
    }

    private function findValidInvite(string $token): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM artist_invites WHERE token = ? AND used_at IS NULL');
        $stmt->execute([$token]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }
}
