<?php

class InviteController
{
    // Mirrors PLAN_DEFINITIONS in src/services/subscriptions.service.ts — the only other
    // place these prices are defined. Self-registration must derive the price server-side
    // from the chosen plan rather than trusting a client-supplied amount (unlike admin-created
    // artists via ArtistController::store(), where a custom price is legitimate admin input).
    private const PLAN_PRICES = [
        'plan-a' => 10.00,
        'plan-b' => 15.00,
        'unlimited' => 30.00,
        'gold' => 150.00,
        'diamond' => 500.00,
        'platinum' => 1000.00,
        'platinum-pro' => 5000.00,
    ];

    public function store(): void
    {
        $pdo = Database::pdo();
        $admin = Auth::requireAdmin($pdo);

        // The invite link is permanent and shared by every artist — idempotent,
        // so repeated clicks of "Generate Invite Link" always return the same one.
        $existing = $pdo->query('SELECT token FROM artist_invites LIMIT 1')->fetchColumn();
        if ($existing !== false) {
            Response::json(['token' => $existing]);
            return;
        }

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
        $pdo->beginTransaction();
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
            $pdo->rollBack();
            if ($e->getCode() === '23000') {
                throw new HttpException('An artist with that email already exists.', 409);
            }
            throw $e;
        }

        $sub = $body['subscription'] ?? [];
        $plan = $sub['plan'] ?? 'plan-a';
        if (!isset(self::PLAN_PRICES[$plan])) {
            $pdo->rollBack();
            throw new HttpException('Invalid subscription plan.', 422);
        }

        $subStmt = $pdo->prepare(
            'INSERT INTO subscriptions (id, artist_id, plan, status, start_date, expiry_date, auto_renew, price)
             VALUES (?, ?, ?, \'active\', ?, ?, ?, ?)'
        );
        try {
            $subStmt->execute([
                'sub-' . bin2hex(random_bytes(6)),
                $id,
                $plan,
                date('Y-m-d'),
                date('Y-m-d', strtotime('+1 year')),
                !empty($sub['autoRenew']) ? 1 : 0,
                self::PLAN_PRICES[$plan],
            ]);
        } catch (PDOException $e) {
            $pdo->rollBack();
            throw $e;
        }
        $pdo->commit();

        Response::json(['success' => true], 201);
    }

    private function findValidInvite(string $token): ?array
    {
        // No used_at check — the invite link is permanent and reusable by every artist.
        $stmt = Database::pdo()->prepare('SELECT * FROM artist_invites WHERE token = ?');
        $stmt->execute([$token]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }
}
