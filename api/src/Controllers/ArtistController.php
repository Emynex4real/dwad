<?php

class ArtistController
{
    private const ARTIST_COLUMNS = 'id, name, email, phone, genre, country, avatar_url, bio, upload_access, status, payout_method, payout_details, joined_date, social_spotify, social_instagram, social_youtube, social_apple';
    private const PAYOUT_METHODS = ['bank_transfer', 'paypal', 'mobile_money'];

    public function index(): void
    {
        Auth::requireAdmin(Database::pdo());

        $pdo = Database::pdo();
        $artists = $pdo->query('SELECT ' . self::ARTIST_COLUMNS . " FROM artists WHERE role = 'artist' ORDER BY joined_date")->fetchAll();

        $result = array_map(fn (array $row) => $this->mapArtist($row), $artists);
        Response::json($result);
    }

    public function show(array $args): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireUser($pdo);
        $id = $args['id'];

        if ($user['role'] !== 'admin' && $user['id'] !== $id) {
            throw new HttpException('Forbidden', 403);
        }

        $artist = $this->findArtistRow($id);
        if ($artist === null) {
            throw new HttpException('Artist not found', 404);
        }

        Response::json($this->mapArtist($artist));
    }

    public function store(): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $body = Request::body();

        $email = strtolower(trim($body['email'] ?? ''));
        if (empty($body['name']) || $email === '' || empty($body['password'])) {
            throw new HttpException('Name, email, and password are required.', 422);
        }

        $id = 'artist-' . bin2hex(random_bytes(6));

        $stmt = $pdo->prepare(
            'INSERT INTO artists (id, name, email, password_hash, role, phone, genre, country, avatar_url, bio, upload_access, joined_date, social_spotify, social_instagram, social_youtube, social_apple)
             VALUES (?, ?, ?, ?, \'artist\', ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?)'
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
                $body['avatarUrl'] ?? null,
                $body['bio'] ?? '',
                $body['uploadAccess'] ?? 'granted',
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
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $subStmt->execute([
            'sub-' . bin2hex(random_bytes(6)),
            $id,
            $sub['plan'] ?? 'plan-a',
            $sub['status'] ?? 'active',
            $sub['startDate'] ?? date('Y-m-d'),
            $sub['expiryDate'] ?? date('Y-m-d', strtotime('+1 year')),
            !empty($sub['autoRenew']) ? 1 : 0,
            $sub['price'] ?? 0,
        ]);

        ReportController::autoResolveForArtist($id, $body['name']);

        Response::json($this->mapArtist($this->findArtistRow($id)), 201);
    }

    public function update(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $id = $args['id'];
        $body = Request::body();

        if ($this->findArtistRow($id) === null) {
            throw new HttpException('Artist not found', 404);
        }

        $fieldMap = [
            'name' => 'name', 'email' => 'email', 'phone' => 'phone', 'genre' => 'genre',
            'country' => 'country', 'avatarUrl' => 'avatar_url', 'bio' => 'bio', 'uploadAccess' => 'upload_access',
        ];
        $sets = [];
        $values = [];
        foreach ($fieldMap as $jsonKey => $column) {
            if (array_key_exists($jsonKey, $body)) {
                $sets[] = "$column = ?";
                $values[] = $body[$jsonKey];
            }
        }
        if (!empty($body['password'])) {
            $sets[] = 'password_hash = ?';
            $values[] = password_hash($body['password'], PASSWORD_BCRYPT);
        }
        if (array_key_exists('socialLinks', $body)) {
            $social = $body['socialLinks'];
            foreach (['spotify' => 'social_spotify', 'instagram' => 'social_instagram', 'youtube' => 'social_youtube', 'apple' => 'social_apple'] as $jsonKey => $column) {
                if (array_key_exists($jsonKey, $social)) {
                    $sets[] = "$column = ?";
                    $values[] = $social[$jsonKey];
                }
            }
        }
        if ($sets !== []) {
            $values[] = $id;
            $pdo->prepare('UPDATE artists SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($values);
        }

        if (array_key_exists('subscription', $body)) {
            $this->updateSubscription($id, $body['subscription']);
        }

        Response::json($this->mapArtist($this->findArtistRow($id)));
    }

    public function updatePayout(array $args): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireUser($pdo);
        $id = $args['id'];

        if ($user['role'] !== 'admin' && $user['id'] !== $id) {
            throw new HttpException('Forbidden', 403);
        }
        if ($this->findArtistRow($id) === null) {
            throw new HttpException('Artist not found', 404);
        }

        $body = Request::body();
        $method = $body['payoutMethod'] ?? null;
        if ($method !== null && !in_array($method, self::PAYOUT_METHODS, true)) {
            throw new HttpException('payoutMethod must be one of: ' . implode(', ', self::PAYOUT_METHODS), 422);
        }

        $stmt = $pdo->prepare('UPDATE artists SET payout_method = ?, payout_details = ? WHERE id = ?');
        $stmt->execute([$method, $body['payoutDetails'] ?? null, $id]);

        Response::json($this->mapArtist($this->findArtistRow($id)));
    }

    public function approve(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $id = $args['id'];

        $artist = $this->findArtistRow($id);
        if ($artist === null) {
            throw new HttpException('Artist not found', 404);
        }

        $pdo->prepare("UPDATE artists SET status = 'active' WHERE id = ?")->execute([$id]);

        ReportController::autoResolveForArtist($id, $artist['name']);

        Response::json($this->mapArtist($this->findArtistRow($id)));
    }

    public function updateUploadAccess(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $id = $args['id'];
        $body = Request::body();

        if ($this->findArtistRow($id) === null) {
            throw new HttpException('Artist not found', 404);
        }

        $stmt = $pdo->prepare('UPDATE artists SET upload_access = ? WHERE id = ?');
        $stmt->execute([$body['uploadAccess'] ?? 'granted', $id]);

        Response::json($this->mapArtist($this->findArtistRow($id)));
    }

    public function destroy(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $stmt = $pdo->prepare('DELETE FROM artists WHERE id = ?');
        $stmt->execute([$args['id']]);
        Response::json(['success' => true]);
    }

    private function updateSubscription(string $artistId, array $patch): void
    {
        $fieldMap = [
            'plan' => 'plan', 'status' => 'status', 'startDate' => 'start_date',
            'expiryDate' => 'expiry_date', 'autoRenew' => 'auto_renew', 'price' => 'price',
        ];
        $sets = [];
        $values = [];
        foreach ($fieldMap as $jsonKey => $column) {
            if (array_key_exists($jsonKey, $patch)) {
                $sets[] = "$column = ?";
                $values[] = $jsonKey === 'autoRenew' ? (int) (bool) $patch[$jsonKey] : $patch[$jsonKey];
            }
        }
        if ($sets === []) {
            return;
        }
        $values[] = $artistId;
        Database::pdo()->prepare('UPDATE subscriptions SET ' . implode(', ', $sets) . ' WHERE artist_id = ?')->execute($values);
    }

    private function findArtistRow(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT ' . self::ARTIST_COLUMNS . ' FROM artists WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    private function mapArtist(array $row): array
    {
        $subStmt = Database::pdo()->prepare('SELECT * FROM subscriptions WHERE artist_id = ?');
        $subStmt->execute([$row['id']]);
        $sub = $subStmt->fetch();

        return [
            'id' => $row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'phone' => $row['phone'],
            'genre' => $row['genre'],
            'country' => $row['country'],
            'avatarUrl' => $row['avatar_url'],
            'bio' => $row['bio'],
            'uploadAccess' => $row['upload_access'],
            'status' => $row['status'],
            'payoutMethod' => $row['payout_method'],
            'payoutDetails' => $row['payout_details'],
            'joinedDate' => $row['joined_date'],
            // Cast to object so an all-null result encodes as `{}`, not `[]` (PHP can't
            // otherwise distinguish an empty map from an empty list in JSON).
            'socialLinks' => (object) array_filter([
                'spotify' => $row['social_spotify'],
                'instagram' => $row['social_instagram'],
                'youtube' => $row['social_youtube'],
                'apple' => $row['social_apple'],
            ], fn ($v) => $v !== null),
            'subscription' => $sub === false ? null : [
                'id' => $sub['id'],
                'artistId' => $sub['artist_id'],
                'plan' => $sub['plan'],
                'status' => $sub['status'],
                'startDate' => $sub['start_date'],
                'expiryDate' => $sub['expiry_date'],
                'autoRenew' => (bool) $sub['auto_renew'],
                'price' => (float) $sub['price'],
            ],
        ];
    }
}
