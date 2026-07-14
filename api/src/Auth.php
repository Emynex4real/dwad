<?php

class Auth
{
    public static function bearerToken(): ?string
    {
        // Apache doesn't forward the Authorization header into $_SERVER by default,
        // so fall back to getallheaders() when HTTP_AUTHORIZATION is missing.
        $header = $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? (function_exists('getallheaders') ? (getallheaders()['Authorization'] ?? '') : '');

        if (preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) {
            return $matches[1];
        }

        // Plain <a href> downloads can't set an Authorization header, so allow a
        // ?token= query param fallback for those (e.g. the admin "download audio" link).
        if (!empty($_GET['token'])) {
            return $_GET['token'];
        }

        return null;
    }

    public static function user(PDO $pdo): ?array
    {
        $token = self::bearerToken();
        if ($token === null) {
            return null;
        }

        $stmt = $pdo->prepare(
            'SELECT a.id, a.email, a.name, a.role
             FROM auth_tokens t
             JOIN artists a ON a.id = t.user_id
             WHERE t.token = ? AND t.expires_at > NOW()'
        );
        $stmt->execute([$token]);
        $row = $stmt->fetch();

        if ($row === false) {
            return null;
        }

        return [
            'id' => $row['id'],
            'email' => $row['email'],
            'name' => $row['name'],
            'role' => $row['role'],
            'artistId' => $row['role'] === 'artist' ? $row['id'] : null,
        ];
    }

    public static function requireUser(PDO $pdo): array
    {
        $user = self::user($pdo);
        if ($user === null) {
            throw new HttpException('Unauthorized', 401);
        }
        return $user;
    }

    public static function requireAdmin(PDO $pdo): array
    {
        $user = self::requireUser($pdo);
        if ($user['role'] !== 'admin') {
            throw new HttpException('Forbidden', 403);
        }
        return $user;
    }
}
