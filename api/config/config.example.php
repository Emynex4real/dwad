<?php

// Copy this file to config.php and fill in real values for local development.
// In a deployed environment where config.php doesn't exist (it's gitignored —
// see api/src/Config.php), this same shape is built from environment variables
// instead: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, DB_SSL_CA (optional),
// CORS_ALLOWED_ORIGINS (comma-separated), AUTH_TOKEN_TTL_DAYS.
return [
    'db' => [
        'host' => '127.0.0.1',
        'name' => 'dwad',
        'user' => 'root',
        'pass' => '',
    ],
    // Any http(s)://localhost:<port> origin is allowed automatically (Vite picks a free
    // port at random when 5173 is taken), so this list only needs non-localhost origins
    // e.g. your production frontend domain.
    'cors' => [
        'allowed_origins' => [],
    ],
    'auth' => [
        'token_ttl_days' => 30,
    ],
];
