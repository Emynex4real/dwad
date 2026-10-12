<?php

// One-time bulk import of a folder of distributor report statements (CSV, optionally
// zipped inside per-statement subfolders, with an optional paired HTML summary used
// only as a fallback when no CSV exists) into a single SQL script — same
// parsing/matching logic as ReportController::upload() (name match, then multi-artist
// song-ownership match, else pending review), just run across many files at once and
// aggregated into one script instead of one DB write per file.
//
// Usage:
//   php api/scripts/bulk_import_reports.php "/path/to/folder" output.sql
//
// Matches artists/tracks against whatever DB api/config/config.php (or the DB_* env
// vars) point at — run this against a snapshot of the same DB the output SQL will be
// applied to, so newly-added artists benefit from matching.

// The shared php.ini here sets serialize_precision=100, which makes json_encode() dump
// scientific notation / ~50 garbage digits for small floats (matches the same fix
// api/index.php applies for the live app's own JSON responses).
ini_set('serialize_precision', -1);

if ($argc < 3) {
    fwrite(STDERR, "Usage: php bulk_import_reports.php <folder> <output.sql>\n");
    exit(1);
}

/**
 * Formats a float as a plain fixed-point decimal string, never scientific notation —
 * PHP's default (string) cast switches to "1.23E-5"-style notation for very small
 * magnitudes, which risks being misparsed depending on the SQL client/driver.
 */
function decimalString(float $n): string
{
    return sprintf('%.10F', $n);
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
$flatten = $reflection->getMethod('flattenTrackPlatforms');
$flatten->setAccessible(true);
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
fwrite(STDERR, count($existingHashes) . " already-uploaded file hashes loaded (will be skipped).\n");

// Files already uploaded directly to the PRODUCTION (Truehost) database during earlier
// manual testing, which this script's dedup can't see since it only checks the LOCAL
// DB's history. Two are exact re-uploads of a CSV we already have (same content_hash,
// added here directly). The other three are cases where production already has the
// HTML *summary* for that exact payee+period, and this batch would otherwise also add
// the CSV *transaction detail* for the same underlying statement — same real revenue,
// different format, so applying both would double-count it.
$existingHashes['05f5141d8abf5f80d1b0cdf9ff7ad12d890a029f5d90731a49d297fddc084875'] = true; // 404470-highvibes.csv, 2024-03
$existingHashes['caf0aa235028659b359250745cb11326fcb684afffd1ce2fadb82c5700801547'] = true; // 396267-apple-music.csv, 2026-02
$excludeFilenamePeriods = [
    '405529-highvibes.csv' => ['2024-03' => true], // production already has 405529-highvibes.html for this period
    '405532-highvibes.csv' => ['2023-10' => true], // production already has 405532-highvibes.html for this period
    '396267-highvibes.csv' => ['2026-01' => true], // production already has 396267-highvibes.html for this period
];

// Extraction workspace for zipped CSVs.
$workDir = sys_get_temp_dir() . '/bulk_import_' . bin2hex(random_bytes(4));
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

/** Picks the file to process for one statement folder: prefer a CSV (unzipping if needed) over the HTML summary. */
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

// Global accumulators across every file processed.
$analyticsDeltas = [];       // [artistId][period] = ['streams'=>int,'revenue'=>float]
$trackPlatformDeltas = [];   // [artistId][period][track][platform] = ['streams'=>int,'revenue'=>float]
$uploadsLog = [];            // list of ['id','filename','period','totalRows','matchedGroups','pendingGroups','contentHash']
$pendingRows = [];           // list of ['id','reportUploadId','creditText','reason','streams','revenueGbp','breakdown']
$seenHashesThisRun = [];
$unmatchedArtistNames = [];  // creditText => cumulative streams, for the end-of-run summary

$fileCount = 0;
foreach ($folders as $folder) {
    $fileCount++;
    $picked = pickReportFile($folder, $workDir);
    if ($picked === null) {
        fwrite(STDERR, "[$fileCount/" . count($folders) . "] SKIP (no csv/html found): $folder\n");
        continue;
    }
    [$type, $path] = $picked;
    $displayName = basename($path);

    $contentHash = hash_file('sha256', $path);
    if (isset($existingHashes[$contentHash]) || isset($seenHashesThisRun[$contentHash])) {
        fwrite(STDERR, "[$fileCount/" . count($folders) . "] dup, skipping: $displayName\n");
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
        fwrite(STDERR, "[$fileCount/" . count($folders) . "] SKIP (production already has this payee+period via a different format): $displayName / $period\n");
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

    $uploadId = 'report-' . bin2hex(random_bytes(6));
    $matchedGroups = 0;
    $pendingGroups = 0;

    foreach ($groups as $creditText => $totals) {
        $artistId = $nameToId[strtolower(trim($creditText))] ?? null;
        $breakdown = $flatten->invoke($controller, $totals['trackPlatforms']);

        if ($artistId === null) {
            $isMultiArtist = preg_match($multiArtistPattern, $creditText) === 1;
            if ($isMultiArtist) {
                $artistId = $matchMultiArtistBySong->invoke($controller, $creditText, $totals['trackPlatforms'], $nameToId, $tracksByArtist);
            }
        }

        if ($artistId !== null) {
            $matchedGroups++;
            $analyticsDeltas[$artistId][$period]['streams'] = ($analyticsDeltas[$artistId][$period]['streams'] ?? 0) + $totals['streams'];
            $analyticsDeltas[$artistId][$period]['revenue'] = ($analyticsDeltas[$artistId][$period]['revenue'] ?? 0.0) + $totals['revenue'];
            foreach ($breakdown as $tuple) {
                $key = $tuple['track'] . "\x1f" . $tuple['platform'];
                $trackPlatformDeltas[$artistId][$period][$key]['track'] = $tuple['track'];
                $trackPlatformDeltas[$artistId][$period][$key]['platform'] = $tuple['platform'];
                $trackPlatformDeltas[$artistId][$period][$key]['streams'] = ($trackPlatformDeltas[$artistId][$period][$key]['streams'] ?? 0) + $tuple['streams'];
                $trackPlatformDeltas[$artistId][$period][$key]['revenue'] = ($trackPlatformDeltas[$artistId][$period][$key]['revenue'] ?? 0.0) + $tuple['revenue'];
            }
            continue;
        }

        $pendingGroups++;
        $reason = preg_match($multiArtistPattern, $creditText) === 1 ? 'multi_artist' : 'unmatched';
        $pendingRows[] = [
            'id' => 'pending-' . bin2hex(random_bytes(6)),
            'reportUploadId' => $uploadId,
            'creditText' => $creditText,
            'reason' => $reason,
            'streams' => $totals['streams'],
            'revenueGbp' => $totals['revenue'],
            'breakdown' => json_encode($breakdown),
        ];
        $unmatchedArtistNames[$creditText] = ($unmatchedArtistNames[$creditText] ?? 0) + $totals['streams'];
    }

    $uploadsLog[] = [
        'id' => $uploadId,
        'filename' => $displayName,
        'period' => $period,
        'totalRows' => $totalRows,
        'matchedGroups' => $matchedGroups,
        'pendingGroups' => $pendingGroups,
        'contentHash' => $contentHash,
    ];

    fwrite(STDERR, "[$fileCount/" . count($folders) . "] OK $displayName — period=$period rows=$totalRows matched=$matchedGroups pending=$pendingGroups\n");
}

// ── Emit SQL ─────────────────────────────────────────────────────────────────
fwrite(STDERR, "\nWriting SQL to $outputPath...\n");
$sql = fopen($outputPath, 'w');

/**
 * Writes rows as batched multi-row INSERT statements instead of one INSERT per row —
 * on a 70k-row script this is the difference between single-digit seconds and 8+
 * minutes of execution, which matters a lot for a shared-hosting phpMyAdmin import
 * that may have a much shorter execution-time limit than that.
 *
 * @param resource $sql
 * @param list<string> $valueRows each entry a pre-built "(...)" tuple literal
 */
function writeBatched($sql, string $table, string $columnsSql, array $valueRows, ?string $updateClause, int $batchSize = 500): void
{
    foreach (array_chunk($valueRows, $batchSize) as $chunk) {
        fwrite($sql, "INSERT INTO $table ($columnsSql) VALUES\n" . implode(",\n", $chunk) . "\n");
        fwrite($sql, $updateClause !== null ? "ON DUPLICATE KEY UPDATE $updateClause;\n\n" : ";\n\n");
    }
}

fwrite($sql, "-- Bulk report import — generated " . date('Y-m-d H:i:s') . "\n");
fwrite($sql, "-- Source: $root\n");
fwrite($sql, "-- Files processed: " . count($uploadsLog) . "\n\n");
fwrite($sql, "SET FOREIGN_KEY_CHECKS=0;\n\n");

fwrite($sql, "-- Upload history log\n");
$uploadRows = [];
foreach ($uploadsLog as $u) {
    $uploadRows[] = sprintf(
        "(%s, %s, %s, %d, %d, %d, 'admin-001', %s)",
        $pdo->quote($u['id']),
        $pdo->quote($u['filename']),
        $pdo->quote($u['period']),
        $u['totalRows'],
        $u['matchedGroups'],
        $u['pendingGroups'],
        $pdo->quote($u['contentHash'])
    );
}
writeBatched($sql, 'report_uploads', 'id, filename, period, total_rows, matched_groups, pending_groups, uploaded_by, content_hash', $uploadRows, null);

fwrite($sql, "-- Pending rows (unmatched / multi-artist credits needing manual review)\n");
$pendingValueRows = [];
foreach ($pendingRows as $p) {
    $pendingValueRows[] = sprintf(
        "(%s, %s, %s, %s, %d, %s, %s)",
        $pdo->quote($p['id']),
        $pdo->quote($p['reportUploadId']),
        $pdo->quote($p['creditText']),
        $pdo->quote($p['reason']),
        $p['streams'],
        $pdo->quote(decimalString($p['revenueGbp'])),
        $pdo->quote($p['breakdown'])
    );
}
writeBatched($sql, 'report_pending_rows', 'id, report_upload_id, credit_text, reason, streams, revenue_gbp, track_platform_breakdown', $pendingValueRows, null);

fwrite($sql, "-- Aggregated artist analytics (one row per artist+period, summed across every file)\n");
$analyticsValueRows = [];
foreach ($analyticsDeltas as $artistId => $periods) {
    foreach ($periods as $period => $totals) {
        $analyticsValueRows[] = sprintf(
            "(%s, %s, %s, %d, %s)",
            $pdo->quote('analytics-' . bin2hex(random_bytes(6))),
            $pdo->quote($artistId),
            $pdo->quote($period),
            $totals['streams'],
            $pdo->quote(decimalString($totals['revenue']))
        );
    }
}
writeBatched($sql, 'artist_analytics_monthly', 'id, artist_id, period, streams, revenue_gbp', $analyticsValueRows, 'streams = streams + VALUES(streams), revenue_gbp = revenue_gbp + VALUES(revenue_gbp)');

fwrite($sql, "-- Aggregated per-track/per-platform analytics\n");
$tpaValueRows = [];
foreach ($trackPlatformDeltas as $artistId => $periods) {
    foreach ($periods as $period => $tuples) {
        foreach ($tuples as $tuple) {
            $tpaValueRows[] = sprintf(
                "(%s, %s, %s, %s, %s, %d, %s)",
                $pdo->quote('tpa-' . bin2hex(random_bytes(6))),
                $pdo->quote($artistId),
                $pdo->quote($period),
                $pdo->quote($tuple['track']),
                $pdo->quote($tuple['platform']),
                $tuple['streams'],
                $pdo->quote(decimalString($tuple['revenue']))
            );
        }
    }
}
writeBatched($sql, 'artist_track_platform_analytics_monthly', 'id, artist_id, period, track_title, platform, streams, revenue_gbp', $tpaValueRows, 'streams = streams + VALUES(streams), revenue_gbp = revenue_gbp + VALUES(revenue_gbp)');

fwrite($sql, "SET FOREIGN_KEY_CHECKS=1;\n");
fclose($sql);

// ── Summary ──────────────────────────────────────────────────────────────────
$totalMatchedArtists = count($analyticsDeltas);
$totalPending = count($pendingRows);
fwrite(STDERR, "\n=== SUMMARY ===\n");
fwrite(STDERR, "Files processed: " . count($uploadsLog) . "\n");
fwrite(STDERR, "Distinct matched artists: $totalMatchedArtists\n");
fwrite(STDERR, "Pending rows (need manual review in admin Reports page): $totalPending\n");
fwrite(STDERR, "Distinct unmatched credit names: " . count($unmatchedArtistNames) . "\n");
fwrite(STDERR, "SQL written to: $outputPath\n");

// Clean up extracted temp files.
foreach (glob("$workDir/*") as $f) {
    unlink($f);
}
rmdir($workDir);
