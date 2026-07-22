<?php

// Copy this file to config.php and fill in real values for local development.
// In a deployed environment where config.php doesn't exist (it's gitignored —
// see api/src/Config.php), this same shape is built from environment variables
// instead: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, DB_SSL_CA (optional),
// CORS_ALLOWED_ORIGINS (comma-separated), AUTH_TOKEN_TTL_DAYS, SMTP_HOST,
// SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL, SMTP_FROM_NAME, FRONTEND_URL.
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
    // Used to send password-reset emails. Gmail: host smtp.gmail.com, port 587,
    // user is the full Gmail address, pass is a 16-character App Password (not
    // your normal Gmail password — requires 2-Step Verification to generate).
    'smtp' => [
        'host' => '',
        'port' => 587,
        'user' => '',
        'pass' => '',
        'from_email' => '',
        'from_name' => 'Dwad Music',
    ],
    // Base URL of the deployed frontend, used to build the link inside password
    // reset emails (e.g. "{frontend_url}/reset-password?token=...").
    'app' => [
        'frontend_url' => 'http://localhost:5173',
    ],
];
