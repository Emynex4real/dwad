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

    public function forgotPassword(): void
    {
        $body = Request::body();
        $email = strtolower(trim($body['email'] ?? ''));
        if ($email === '') {
            throw new HttpException('Email is required.', 422);
        }

        $pdo = Database::pdo();
        $stmt = $pdo->prepare('SELECT id, name, email FROM artists WHERE email = ?');
        $stmt->execute([$email]);
        $row = $stmt->fetch();

        if ($row !== false) {
            $token = bin2hex(random_bytes(32));
            $pdo->prepare(
                'INSERT INTO password_reset_tokens (token, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))'
            )->execute([$token, $row['id']]);

            $frontendUrl = rtrim(Config::get()['app']['frontend_url'], '/');
            $resetLink = $frontendUrl . '/reset-password/' . $token;

            $html = '<p>Hi ' . htmlspecialchars($row['name']) . ',</p>'
                . '<p>Click the link below to reset your Dwad Music password. This link expires in 1 hour.</p>'
                . '<p><a href="' . htmlspecialchars($resetLink) . '">Reset your password</a></p>'
                . '<p>If you didn\'t request this, you can safely ignore this email.</p>';

            Mailer::send($row['email'], $row['name'], 'Reset your Dwad Music password', $html);
        }

        // Always the same response whether or not the email exists, so this
        // endpoint can't be used to enumerate registered accounts.
        Response::json(['success' => true]);
    }

    public function resetPassword(): void
    {
        $body = Request::body();
        $token = $body['token'] ?? '';
        $password = (string) ($body['password'] ?? '');

        if ($token === '' || $password === '') {
            throw new HttpException('Token and new password are required.', 422);
        }
        if (strlen($password) < 8) {
            throw new HttpException('Password must be at least 8 characters.', 422);
        }

        $pdo = Database::pdo();
        $stmt = $pdo->prepare(
            'SELECT * FROM password_reset_tokens WHERE token = ? AND used_at IS NULL AND expires_at > NOW()'
        );
        $stmt->execute([$token]);
        $row = $stmt->fetch();

        if ($row === false) {
            throw new HttpException('This reset link is invalid or has expired.', 404);
        }

        $pdo->prepare('UPDATE artists SET password_hash = ? WHERE id = ?')
            ->execute([password_hash($password, PASSWORD_BCRYPT), $row['user_id']]);

        $pdo->prepare('UPDATE password_reset_tokens SET used_at = NOW() WHERE token = ?')
            ->execute([$token]);

        // Reset invalidates any existing sessions, in case the account was
        // compromised and this reset is the recovery step.
        $pdo->prepare('DELETE FROM auth_tokens WHERE user_id = ?')->execute([$row['user_id']]);

        Response::json(['success' => true]);
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
