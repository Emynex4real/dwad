<?php

// Same source data and matching logic as bulk_import_reports.php, but instead of a raw
// SQL script, emits one CSV file per distinct period — in the exact format the admin
// Reports page's normal upload already understands (Artist/Track Title/Service/
// Quantity/Amount Due in GBP + a Statement Period column) — so the result can just be
// drag-and-dropped through the existing upload UI (which already supports multiple
// files at once), reusing its own dedup/matching/pending-row logic instead of a
// hand-rolled SQL script.
//
// Matched credits are re-labeled with the artist's own registered name (a clean exact
// match on re-upload); unmatched/multi-artist credits keep their original text so they
// land in Pending Review exactly like a normal upload would.
//
// Usage:
//   php api/scripts/bulk_export_reports_csv.php "/path/to/folder" "/path/to/output-dir"

ini_set('serialize_precision', -1);

if ($argc < 3) {
    fwrite(STDERR, "Usage: php bulk_export_reports_csv.php <folder> <output-dir>\n");
    exit(1);
}
$root = rtrim($argv[1], '/');
$outputDir = rtrim($argv[2], '/');

if (!is_dir($root)) {
    fwrite(STDERR, "Not a directory: $root\n");
    exit(1);
}
if (!is_dir($outputDir) && !mkdir($outputDir, 0755, true)) {
    fwrite(STDERR, "Could not create output dir: $outputDir\n");
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
$idToName = [];
foreach ($pdo->query("SELECT id, name FROM artists WHERE role = 'artist'") as $row) {
    $nameToId[strtolower(trim($row['name']))] = $row['id'];
    $idToName[$row['id']] = $row['name'];
}
$tracksByArtist = [];
foreach ($pdo->query('SELECT artist_id, title FROM tracks') as $row) {
    $tracksByArtist[$row['artist_id']][strtolower(trim($row['title']))] = true;
}
fwrite(STDERR, count($nameToId) . " artists, " . count($tracksByArtist) . " artists-with-tracks loaded.\n");

$existingHashes = [];
foreach ($pdo->query('SELECT content_hash FROM report_uploads WHERE content_hash IS NOT NULL') as $row) {
    $existingHashes[$row['content_hash']] = true;
}
// Same known already-on-production exclusions as bulk_import_reports.php.
$existingHashes['05f5141d8abf5f80d1b0cdf9ff7ad12d890a029f5d90731a49d297fddc084875'] = true; // 404470-highvibes.csv, 2024-03
$existingHashes['caf0aa235028659b359250745cb11326fcb684afffd1ce2fadb82c5700801547'] = true; // 396267-apple-music.csv, 2026-02
$excludeFilenamePeriods = [
    '405529-highvibes.csv' => ['2024-03' => true],
    '405532-highvibes.csv' => ['2023-10' => true],
    '396267-highvibes.csv' => ['2026-01' => true],
];
fwrite(STDERR, count($existingHashes) . " excluded file hashes loaded.\n");

$workDir = sys_get_temp_dir() . '/bulk_export_' . bin2hex(random_bytes(4));
mkdir($workDir, 0700, true);

/** @return list<string> subfolders, sorted */
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

// [period][name][track."\x1f".platform] = ['streams'=>int,'revenue'=>float]
$rowsByPeriod = [];
$seenHashesThisRun = [];
$fileCount = 0;
$filesUsed = 0;

foreach ($folders as $folder) {
    $fileCount++;
    $picked = pickReportFile($folder, $workDir);
    if ($picked === null) {
        continue;
    }
    [$type, $path] = $picked;
    $displayName = basename($path);

    $contentHash = hash_file('sha256', $path);
    if (isset($existingHashes[$contentHash]) || isset($seenHashesThisRun[$contentHash])) {
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
        fwrite(STDERR, "[$fileCount/" . count($folders) . "] SKIP (no Artist column matched): $displayName\n");
        continue;
    }

    $filesUsed++;
    foreach ($groups as $creditText => $totals) {
        $artistId = $nameToId[strtolower(trim($creditText))] ?? null;
        if ($artistId === null && preg_match($multiArtistPattern, $creditText) === 1) {
            $artistId = $matchMultiArtistBySong->invoke($controller, $creditText, $totals['trackPlatforms'], $nameToId, $tracksByArtist);
        }
        // Re-label matched credits with the artist's own canonical name — a clean exact
        // match on re-upload, regardless of how the distributor originally spelled it.
        $outputName = $artistId !== null ? $idToName[$artistId] : $creditText;

        foreach ($totals['trackPlatforms'] as $track => $platforms) {
            foreach ($platforms as $platform => $tp) {
                $key = $outputName . "\x1f" . $track . "\x1f" . $platform;
                $rowsByPeriod[$period][$key]['name'] = $outputName;
                $rowsByPeriod[$period][$key]['track'] = $track;
                $rowsByPeriod[$period][$key]['platform'] = $platform;
                $rowsByPeriod[$period][$key]['streams'] = ($rowsByPeriod[$period][$key]['streams'] ?? 0) + $tp['streams'];
                $rowsByPeriod[$period][$key]['revenue'] = ($rowsByPeriod[$period][$key]['revenue'] ?? 0.0) + $tp['revenue'];
            }
        }
        // A credit with no track/platform breakdown at all (shouldn't happen for CSV
        // input, but keep it from being silently dropped if it ever does).
        if ($totals['trackPlatforms'] === []) {
            $key = $outputName . "\x1f\x1f";
            $rowsByPeriod[$period][$key]['name'] = $outputName;
            $rowsByPeriod[$period][$key]['track'] = '';
            $rowsByPeriod[$period][$key]['platform'] = '';
            $rowsByPeriod[$period][$key]['streams'] = ($rowsByPeriod[$period][$key]['streams'] ?? 0) + $totals['streams'];
            $rowsByPeriod[$period][$key]['revenue'] = ($rowsByPeriod[$period][$key]['revenue'] ?? 0.0) + $totals['revenue'];
        }
    }
}

fwrite(STDERR, "\n$filesUsed files contributed data across " . count($rowsByPeriod) . " distinct periods.\n");

ksort($rowsByPeriod);
$manifest = [];
foreach ($rowsByPeriod as $period => $rows) {
    $filename = "import_$period.csv";
    $path = "$outputDir/$filename";
    $fh = fopen($path, 'w');
    fputcsv($fh, ['Statement Period', 'Artist', 'Track Title', 'Service', 'Quantity', 'Amount Due in GBP']);
    foreach ($rows as $r) {
        fputcsv($fh, [$period, $r['name'], $r['track'], $r['platform'], $r['streams'], sprintf('%.10F', $r['revenue'])]);
    }
    fclose($fh);
    $manifest[] = [$filename, count($rows)];
    fwrite(STDERR, "wrote $filename — " . count($rows) . " rows\n");
}

fwrite(STDERR, "\n=== SUMMARY ===\n");
fwrite(STDERR, count($manifest) . " CSV files written to $outputDir\n");
fwrite(STDERR, "Upload them all at once by selecting all files in the admin Reports page's drop zone.\n");

foreach (glob("$workDir/*") as $f) {
    unlink($f);
}
rmdir($workDir);
