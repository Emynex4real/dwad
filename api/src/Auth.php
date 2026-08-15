<?php

class Auth
{
    private const SESSION_COOKIE = 'dwad_session';

    private static function cookieSecure(): bool
    {
        if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
            return true;
        }
        // Render (and most PaaS hosts) terminate TLS at a reverse proxy and forward plain
        // HTTP to the app container, so $_SERVER['HTTPS'] is never set even in production —
        // X-Forwarded-Proto is how the proxy communicates the original scheme.
        return strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
    }

    /**
     * In production the frontend and API are on different registrable domains, so the
     * session cookie must be SameSite=None (which browsers only honor alongside Secure)
     * to be sent at all. Locally, frontend (Vite) and API (XAMPP) both live under
     * "localhost" — same site, just different ports — so Lax works fine over plain HTTP
     * without needing a local TLS setup.
     */
    private static function cookieOptions(int $expires): array
    {
        $secure = self::cookieSecure();
        return [
            'expires' => $expires,
            'path' => '/',
            'secure' => $secure,
            'httponly' => true,
            'samesite' => $secure ? 'None' : 'Lax',
        ];
    }

    public static function setSessionCookie(string $token, int $ttlDays): void
    {
        setcookie(self::SESSION_COOKIE, $token, self::cookieOptions(time() + $ttlDays * 86400));
    }

    public static function clearSessionCookie(): void
    {
        setcookie(self::SESSION_COOKIE, '', self::cookieOptions(time() - 3600));
    }

    public static function sessionToken(): ?string
    {
        $token = $_COOKIE[self::SESSION_COOKIE] ?? null;
        return $token === null || $token === '' ? null : $token;
    }

    public static function user(PDO $pdo): ?array
    {
        $token = self::sessionToken();
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
        if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'HEAD', 'OPTIONS'], true)) {
            self::validateCsrf($pdo);
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

    public static function currentCsrfToken(PDO $pdo): ?string
    {
        $token = self::sessionToken();
        if ($token === null) {
            return null;
        }

        $stmt = $pdo->prepare('SELECT csrf_token FROM auth_tokens WHERE token = ? AND expires_at > NOW()');
        $stmt->execute([$token]);
        $csrf = $stmt->fetchColumn();
        return $csrf === false || $csrf === null ? null : $csrf;
    }

    /**
     * Guards state-changing requests with a synchronizer-pattern CSRF token (issued at
     * login, returned only in the JSON response body — never as a cookie). This matters
     * because the session cookie is SameSite=None in production, which lets any site
     * trigger a request that carries it; a cross-site page can't produce a matching
     * X-CSRF-Token header because it never had a way to read the token in the first
     * place — CORS keeps it from reading the login/me response body cross-origin.
     *
     * Called from requireUser() rather than globally in index.php, so it only ever
     * applies to routes that actually authorize via the session cookie. Public routes
     * (login, forgot/reset-password, invite registration) never call requireUser(), so
     * they stay usable even if the caller's browser happens to also hold an unrelated
     * valid session cookie (e.g. an admin testing their own invite link in the same
     * browser they're logged in with) — a global cookie-presence check would have
     * wrongly demanded a CSRF token those flows have no way to provide.
     */
    public static function validateCsrf(PDO $pdo): void
    {
        $expected = self::currentCsrfToken($pdo);
        $submitted = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if ($expected === null || $submitted === '' || !hash_equals($expected, $submitted)) {
            throw new HttpException('Invalid or missing CSRF token.', 403);
        }
    }
}
