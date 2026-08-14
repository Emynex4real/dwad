<?php

/**
 * One-time bulk import of existing label artists from an external roster.
 * Not wired into index.php or any route — run manually from the CLI.
 *
 * Usage: php import_artists.php path/to/artists.json
 * Input JSON: a list of {"name": "...", "email": "..."} objects.
 */

require __DIR__ . '/../src/HttpException.php';
require __DIR__ . '/../src/Config.php';
require __DIR__ . '/../src/Database.php';
require __DIR__ . '/../src/Controllers/ReportController.php';

$path = $argv[1] ?? null;
if ($path === null || !is_file($path)) {
    fwrite(STDERR, "Usage: php import_artists.php path/to/artists.json\n");
    exit(1);
}

$artists = json_decode(file_get_contents($path), true);
if (!is_array($artists)) {
    fwrite(STDERR, "Could not parse JSON array from $path\n");
    exit(1);
}

$pdo = Database::pdo();
$insertStmt = $pdo->prepare(
    'INSERT INTO artists (id, name, email, password_hash, role, upload_access, joined_date)
     VALUES (?, ?, ?, ?, \'artist\', \'granted\', CURDATE())'
);
// Every artist created through the app (admin-created or invite-registered) always gets a
// subscription row — the frontend's ArtistProfile.subscription type is non-nullable and
// ~25 call sites across the admin dashboard dereference it directly with no null check.
// price 0 keeps these historical-import accounts out of real MRR figures.
$subStmt = $pdo->prepare(
    "INSERT INTO subscriptions (id, artist_id, plan, status, start_date, expiry_date, auto_renew, price)
     VALUES (?, ?, 'plan-a', 'active', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 0, 0)"
);
$existsStmt = $pdo->prepare('SELECT id FROM artists WHERE email = ?');

$created = 0;
$skipped = 0;
$resolvedRows = 0;

foreach ($artists as $row) {
    $name = trim((string) ($row['name'] ?? ''));
    $email = strtolower(trim((string) ($row['email'] ?? '')));

    if ($name === '' || $email === '') {
        echo "SKIP (missing name/email): " . json_encode($row) . "\n";
        $skipped++;
        continue;
    }

    $existsStmt->execute([$email]);
    if ($existsStmt->fetchColumn() !== false) {
        echo "SKIP (already exists): $name <$email>\n";
        $skipped++;
        continue;
    }

    try {
        $id = 'artist-' . bin2hex(random_bytes(6));
        // Random, never surfaced anywhere — the artist sets their own password via
        // the existing "Forgot Password" flow using the real email imported here.
        $passwordHash = password_hash(bin2hex(random_bytes(16)), PASSWORD_BCRYPT);
        $insertStmt->execute([$id, $name, $email, $passwordHash]);
        $subStmt->execute(['sub-' . bin2hex(random_bytes(6)), $id]);
    } catch (PDOException $e) {
        echo "ERROR creating $name <$email>: " . $e->getMessage() . "\n";
        $skipped++;
        continue;
    }

    $resolved = ReportController::autoResolveForArtist($id, $name);
    $resolvedRows += $resolved;

    echo "CREATED: $name <$email>" . ($resolved > 0 ? " (auto-resolved $resolved pending report row(s))" : '') . "\n";
    $created++;
}

echo "\n--- Summary ---\n";
echo "Created: $created\n";
echo "Skipped: $skipped\n";
echo "Pending report rows auto-resolved: $resolvedRows\n";
