<?php

// Extracts every unique (artist, track title) pair from the same folder of distributor
// report statements used by bulk_import_reports.php / bulk_export_reports_csv.php, and
// generates INSERT statements to add them as real tracks for the matching artist —
// so their catalog reflects the songs that are actually earning them revenue, and so
// future report uploads can match multi-artist credits by song ownership
// (ReportController::matchMultiArtistBySong() relies on the tracks table for that).
//
// Only tracks for artists the CSV data actually matches by name (or by the same
// multi-artist song-ownership logic used during import) are created — unmatched credits
// are skipped entirely, same as report import. Tracks the artist already has (matched
// case-insensitively by title) are left alone, never duplicated.
//
// Required fields not present in report data get sensible defaults: genre from the
// artist's own profile, release_date from the earliest period the track appears across
// every processed file, status 'live' (it's already earning real revenue, so it's
// clearly released), platforms as the JSON list of services the streams came from.
//
// Usage:
//   php api/scripts/bulk_import_tracks_from_reports.php "/path/to/folder" output.sql

ini_set('serialize_precision', -1);

if ($argc < 3) {
    fwrite(STDERR, "Usage: php bulk_import_tracks_from_reports.php <folder> <output.sql>\n");
    exit(1);
}
$root = rtrim($argv[1], '/');
$outputPath = $argv[2];

if (!is_dir($root)) {
    fwrite(STDERR, "Not a directory: $root\n");
    exit(1);
}

require __DIR__ . '/../src/HttpException.php';
require __DIR__ . '/../src/Config.php';
require __DIR__ . '/../src/Database.php';
require __DIR__ . '/../src/Controllers/ReportController.php';

$pdo = Database::pdo();

$controller = new ReportController();
$reflection = new ReflectionClass($controller);
$readCsvRows = $reflection->getMethod('readCsvRows');
$readCsvRows->setAccessible(true);
$readHtmlRows = $reflection->getMethod('readHtmlRows');
$readHtmlRows->setAccessible(true);
$readStatementSummary = $reflection->getMethod('readStatementSummary');
$readStatementSummary->setAccessible(true);
$parse = $reflection->getMethod('parse');
$parse->setAccessible(true);
$matchMultiArtistBySong = $reflection->getMethod('matchMultiArtistBySong');
$matchMultiArtistBySong->setAccessible(true);
$multiArtistPattern = $reflection->getConstant('MULTI_ARTIST_PATTERN');

fwrite(STDERR, "Loading artist/track lookup tables...\n");
$nameToId = [];
$artistGenre = [];
foreach ($pdo->query("SELECT id, name, genre FROM artists WHERE role = 'artist'") as $row) {
    $nameToId[strtolower(trim($row['name']))] = $row['id'];
    $artistGenre[$row['id']] = $row['genre'] !== null && trim($row['genre']) !== '' ? $row['genre'] : 'Other';
}
$existingTracks = [];
foreach ($pdo->query('SELECT artist_id, title FROM tracks') as $row) {
    $existingTracks[$row['artist_id']][strtolower(trim($row['title']))] = true;
}
fwrite(STDERR, count($nameToId) . " artists, " . count($existingTracks) . " artists with existing tracks loaded.\n");

// Same known already-processed-elsewhere exclusions as the other bulk scripts, so this
// stays consistent with what was actually applied to production.
$excludeHashes = [
    '05f5141d8abf5f80d1b0cdf9ff7ad12d890a029f5d90731a49d297fddc084875' => true,
    'caf0aa235028659b359250745cb11326fcb684afffd1ce2fadb82c5700801547' => true,
];
$excludeFilenamePeriods = [
    '405529-highvibes.csv' => ['2024-03' => true],
    '405532-highvibes.csv' => ['2023-10' => true],
    '396267-highvibes.csv' => ['2026-01' => true],
];

$workDir = sys_get_temp_dir() . '/bulk_tracks_' . bin2hex(random_bytes(4));
mkdir($workDir, 0700, true);

/** @return list<string> */
function listStatementFolders(string $root): array
{
    $folders = [];
    foreach (scandir($root) as $entry) {
        if ($entry === '.' || $entry === '..') {
            continue;
        }
        $full = "$root/$entry";
        if (is_dir($full)) {
            $folders[] = $full;
        }
    }
    sort($folders);
    return $folders;
}

function pickReportFile(string $folder, string $workDir): ?array
{
    $entries = scandir($folder);
    $csv = null;
    $csvZip = null;
    $html = null;
    foreach ($entries as $entry) {
        $lower = strtolower($entry);
        if (str_ends_with($lower, '.csv')) {
            $csv = "$folder/$entry";
        } elseif (str_ends_with($lower, '.csv.zip')) {
            $csvZip = "$folder/$entry";
        } elseif (str_ends_with($lower, '.html') || str_ends_with($lower, '.htm')) {
            $html = "$folder/$entry";
        }
    }
    if ($csv !== null) {
        return ['csv', $csv];
    }
    if ($csvZip !== null) {
        $zip = new ZipArchive();
        if ($zip->open($csvZip) === true) {
            $zip->extractTo($workDir);
            $extractedName = $zip->getNameIndex(0);
            $zip->close();
            $extractedPath = "$workDir/$extractedName";
            if (is_file($extractedPath)) {
                return ['csv', $extractedPath];
            }
        }
    }
    if ($html !== null) {
        return ['html', $html];
    }
    return null;
}

$folders = listStatementFolders($root);
fwrite(STDERR, count($folders) . " statement folders found.\n");

// [artistId][lowercaseTitle] = ['title'=>string, 'platforms'=>set, 'earliestPeriod'=>string]
$tracksSeen = [];
$seenHashesThisRun = [];
$fileCount = 0;

foreach ($folders as $folder) {
    $fileCount++;
    $picked = pickReportFile($folder, $workDir);
    if ($picked === null) {
        continue;
    }
    [$type, $path] = $picked;
    $displayName = basename($path);

    $contentHash = hash_file('sha256', $path);
    if (isset($excludeHashes[$contentHash]) || isset($seenHashesThisRun[$contentHash])) {
        continue;
    }
    $seenHashesThisRun[$contentHash] = true;

    if ($type === 'csv') {
        $rows = $readCsvRows->invoke($controller, $path);
    } else {
        $rows = $readHtmlRows->invoke($controller, file_get_contents($path));
    }

    [$period, $columns, $totalRows, $groups] = $parse->invoke($controller, $rows);

    if (isset($excludeFilenamePeriods[$displayName][$period])) {
        continue;
    }

    if ($columns === null && $type === 'html') {
        $summary = $readStatementSummary->invoke($controller, file_get_contents($path));
        if ($summary !== null) {
            [$period, $totalRows, $groups] = $summary;
            $columns = [];
        }
    }
    if ($columns === null) {
        continue;
    }

    foreach ($groups as $creditText => $totals) {
        $artistId = $nameToId[strtolower(trim($creditText))] ?? null;
        if ($artistId === null && preg_match($multiArtistPattern, $creditText) === 1) {
            $artistId = $matchMultiArtistBySong->invoke($controller, $creditText, $totals['trackPlatforms'], $nameToId, $existingTracks);
        }
        if ($artistId === null) {
            continue; // unmatched credit — no artist to attach a track to, skip entirely
        }

        foreach ($totals['trackPlatforms'] as $trackTitle => $platforms) {
            $trackTitle = trim($trackTitle);
            if ($trackTitle === '') {
                continue;
            }
            $key = strtolower($trackTitle);
            if (isset($existingTracks[$artistId][$key])) {
                continue; // artist already has this track
            }
            if (!isset($tracksSeen[$artistId][$key])) {
                $tracksSeen[$artistId][$key] = ['title' => $trackTitle, 'platforms' => [], 'earliestPeriod' => $period, 'upc' => '', 'isrc' => ''];
            }
            foreach (array_keys($platforms) as $platform) {
                $platform = trim($platform);
                if ($platform !== '') {
                    $tracksSeen[$artistId][$key]['platforms'][$platform] = true;
                }
            }
            if ($period < $tracksSeen[$artistId][$key]['earliestPeriod']) {
                $tracksSeen[$artistId][$key]['earliestPeriod'] = $period;
            }
            $codes = $totals['trackCodes'][$trackTitle] ?? ['upc' => '', 'isrc' => ''];
            if ($tracksSeen[$artistId][$key]['upc'] === '' && $codes['upc'] !== '') {
                $tracksSeen[$artistId][$key]['upc'] = $codes['upc'];
            }
            if ($tracksSeen[$artistId][$key]['isrc'] === '' && $codes['isrc'] !== '') {
                $tracksSeen[$artistId][$key]['isrc'] = $codes['isrc'];
            }
        }
    }

    if ($fileCount % 25 === 0) {
        fwrite(STDERR, "[$fileCount/" . count($folders) . "] processed...\n");
    }
}

$totalNewTracks = 0;
foreach ($tracksSeen as $artistId => $titles) {
    $totalNewTracks += count($titles);
}
fwrite(STDERR, "\n" . count($tracksSeen) . " artists get new tracks, $totalNewTracks new track rows total.\n");

$sql = fopen($outputPath, 'w');
fwrite($sql, "-- Tracks extracted from report data — generated " . date('Y-m-d H:i:s') . "\n");
fwrite($sql, "-- New track rows: $totalNewTracks across " . count($tracksSeen) . " artists\n\n");

$valueRows = [];
foreach ($tracksSeen as $artistId => $titles) {
    $genre = $pdo->quote($artistGenre[$artistId] ?? 'Other');
    foreach ($titles as $t) {
        $releaseDate = $pdo->quote($t['earliestPeriod'] . '-01');
        $platformsJson = $pdo->quote(json_encode(array_values(array_keys($t['platforms']))));
        $upc = $t['upc'] !== '' ? $pdo->quote($t['upc']) : 'NULL';
        $isrc = $t['isrc'] !== '' ? $pdo->quote($t['isrc']) : 'NULL';
        $valueRows[] = sprintf(
            "(%s, %s, %s, NULL, %s, %s, %s, %s, NULL, NULL, NULL, 'live', CURRENT_TIMESTAMP, NULL, %s)",
            $pdo->quote('track-' . bin2hex(random_bytes(6))),
            $pdo->quote($artistId),
            $pdo->quote($t['title']),
            $genre,
            $releaseDate,
            $upc,
            $isrc,
            $platformsJson
        );
    }
}

foreach (array_chunk($valueRows, 500) as $chunk) {
    fwrite($sql, "INSERT INTO tracks (id, artist_id, title, featuring, genre, release_date, upc_code, isrc_code, release_link, cover_art_url, audio_file_url, status, submitted_at, review_note, platforms) VALUES\n");
    fwrite($sql, implode(",\n", $chunk) . ";\n\n");
}
fclose($sql);

fwrite(STDERR, "SQL written to: $outputPath\n");

foreach (glob("$workDir/*") as $f) {
    unlink($f);
}
rmdir($workDir);
