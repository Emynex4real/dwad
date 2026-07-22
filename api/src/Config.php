<?php

class Config
{
    private static ?array $config = null;

    public static function get(): array
    {
        if (self::$config !== null) {
            return self::$config;
        }

        $path = __DIR__ . '/../config/config.php';
        if (file_exists($path)) {
            return self::$config = require $path;
        }

        // No local config.php present (e.g. a deployed container, where the
        // gitignored file was never committed) — build config from env vars instead.
        return self::$config = [
            'db' => [
                'host' => getenv('DB_HOST') ?: '127.0.0.1',
                'port' => getenv('DB_PORT') ?: '3306',
                'name' => getenv('DB_NAME') ?: 'dwad',
                'user' => getenv('DB_USER') ?: 'root',
                'pass' => getenv('DB_PASS') ?: '',
                'sslCa' => getenv('DB_SSL_CA') ?: null,
            ],
            'cors' => [
                'allowed_origins' => array_filter(explode(',', getenv('CORS_ALLOWED_ORIGINS') ?: '')),
            ],
            'auth' => [
                'token_ttl_days' => (int) (getenv('AUTH_TOKEN_TTL_DAYS') ?: 30),
            ],
            'smtp' => [
                'host' => getenv('SMTP_HOST') ?: '',
                'port' => (int) (getenv('SMTP_PORT') ?: 587),
                'user' => getenv('SMTP_USER') ?: '',
                'pass' => getenv('SMTP_PASS') ?: '',
                'from_email' => getenv('SMTP_FROM_EMAIL') ?: '',
                'from_name' => getenv('SMTP_FROM_NAME') ?: 'Dwad Music',
            ],
            'app' => [
                'frontend_url' => getenv('FRONTEND_URL') ?: 'http://localhost:5173',
            ],
        ];
    }
}
