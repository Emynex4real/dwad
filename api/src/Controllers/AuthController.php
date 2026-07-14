<?php

class AuthController
{
    public function login(): void
    {
        $body = Request::body();
        $email = strtolower(trim($body['email'] ?? ''));
        $password = (string) ($body['password'] ?? '');

        if ($email === '' || $password === '') {
            throw new HttpException('Email and password are required.', 422);
        }

        $pdo = Database::pdo();
        $stmt = $pdo->prepare('SELECT id, email, name, role, status, password_hash FROM artists WHERE email = ?');
        $stmt->execute([$email]);
        $row = $stmt->fetch();

        if ($row === false || !password_verify($password, $row['password_hash'])) {
            throw new HttpException('No account found with that email and password.', 401);
        }
        if ($row['status'] === 'pending') {
            throw new HttpException('Your account is pending admin approval.', 403);
        }

        $ttlDays = Config::get()['auth']['token_ttl_days'];

        $token = bin2hex(random_bytes(32));
        $insert = $pdo->prepare(
            'INSERT INTO auth_tokens (token, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))'
        );
        $insert->execute([$token, $row['id'], $ttlDays]);

        Response::json([
            'token' => $token,
            'user' => [
                'id' => $row['id'],
                'email' => $row['email'],
                'name' => $row['name'],
                'role' => $row['role'],
                'artistId' => $row['role'] === 'artist' ? $row['id'] : null,
            ],
        ]);
    }

    public function logout(): void
    {
        $token = Auth::bearerToken();
        if ($token !== null) {
            $stmt = Database::pdo()->prepare('DELETE FROM auth_tokens WHERE token = ?');
            $stmt->execute([$token]);
        }
        Response::json(['success' => true]);
    }

    public function me(): void
    {
        $user = Auth::requireUser(Database::pdo());
        Response::json(['user' => $user]);
    }
}
