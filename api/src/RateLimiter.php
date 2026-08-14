<?php

class RateLimiter
{
    /**
     * Records one attempt for $key within a fixed window and reports whether the
     * caller has now exceeded $maxAttempts for that window. Buckets are keyed by
     * client IP (not account/email) so a flood of failed logins for one address
     * can't be used to lock a victim's account out of their own login.
     */
    public static function tooManyAttempts(string $key, int $maxAttempts, int $windowSeconds): bool
    {
        $pdo = Database::pdo();

        // Compare timestamps entirely in SQL (NOW() vs. window_started_at, both read by
        // MySQL using its own session timezone) rather than pulling the value into PHP and
        // parsing it with strtotime() — PHP's date.timezone and MySQL's session timezone
        // can differ (they do on this app's XAMPP setup), which would make strtotime()
        // silently misjudge whether the window has expired.
        $stmt = $pdo->prepare(
            'SELECT attempts FROM rate_limit_hits WHERE id = ? AND window_started_at > NOW() - INTERVAL ? SECOND'
        );
        $stmt->execute([$key, $windowSeconds]);
        $attempts = $stmt->fetchColumn();

        if ($attempts === false) {
            $pdo->prepare(
                'INSERT INTO rate_limit_hits (id, attempts, window_started_at) VALUES (?, 1, NOW())
                 ON DUPLICATE KEY UPDATE attempts = 1, window_started_at = NOW()'
            )->execute([$key]);
            return false;
        }

        if ((int) $attempts >= $maxAttempts) {
            return true;
        }

        $pdo->prepare('UPDATE rate_limit_hits SET attempts = attempts + 1 WHERE id = ?')->execute([$key]);
        return false;
    }

    public static function clientIp(): string
    {
        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
}
