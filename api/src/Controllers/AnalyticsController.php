<?php

class AnalyticsController
{
    public function index(): void
    {
        Auth::requireAdmin(Database::pdo());
        $rate = SettingsController::gbpToUsdRate();

        $rows = Database::pdo()->query(
            'SELECT artist_id, period, streams, revenue_gbp FROM artist_analytics_monthly ORDER BY artist_id, period'
        )->fetchAll();

        $byArtist = [];
        foreach ($rows as $row) {
            $byArtist[$row['artist_id']][] = $row;
        }

        $result = [];
        foreach ($byArtist as $artistId => $artistRows) {
            $result[] = $this->buildArtistAnalytics($artistId, $artistRows, $rate, false);
        }
        Response::json($result);
    }

    public function forArtist(array $args): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireUser($pdo);
        $id = $args['id'];

        if ($user['role'] !== 'admin' && $user['id'] !== $id) {
            throw new HttpException('Forbidden', 403);
        }

        $rate = SettingsController::gbpToUsdRate();
        $stmt = $pdo->prepare('SELECT artist_id, period, streams, revenue_gbp FROM artist_analytics_monthly WHERE artist_id = ? ORDER BY period');
        $stmt->execute([$id]);
        $rows = $stmt->fetchAll();

        Response::json($this->buildArtistAnalytics($id, $rows, $rate, true));
    }

    private function buildArtistAnalytics(string $artistId, array $rows, float $rate, bool $withTopTracks): array
    {
        $paidByPeriod = $this->paidByPeriod($artistId);
        $totalStreams = 0;
        $totalRevenue = 0.0;
        $monthly = [];
        foreach ($rows as $row) {
            $streams = (int) $row['streams'];
            $revenue = (float) $row['revenue_gbp'] * $rate;
            $totalStreams += $streams;
            $totalRevenue += $revenue;
            $paid = $paidByPeriod[$row['period']] ?? 0.0;
            $monthly[] = [
                'month' => $this->periodLabel($row['period']),
                'period' => $row['period'],
                'streams' => $streams,
                'revenue' => $revenue,
                'paidUsd' => $paid,
                'pendingUsd' => max(0.0, $revenue - $paid),
            ];
        }

        return [
            'artistId' => $artistId,
            'totalStreams' => $totalStreams,
            'totalRevenue' => $totalRevenue,
            'pendingPayout' => max(0.0, $totalRevenue - $this->paidOutTotal($artistId)),
            'monthly' => $monthly,
            'topTracks' => $withTopTracks ? $this->topTracks($artistId, $rate) : [],
        ];
    }

    private function paidOutTotal(string $artistId): float
    {
        $stmt = Database::pdo()->prepare('SELECT COALESCE(SUM(amount_usd), 0) FROM payouts WHERE artist_id = ?');
        $stmt->execute([$artistId]);
        return (float) $stmt->fetchColumn();
    }

    /** @return array<string, float> period => total paid */
    private function paidByPeriod(string $artistId): array
    {
        $stmt = Database::pdo()->prepare(
            'SELECT period, SUM(amount_usd) AS total FROM payouts WHERE artist_id = ? AND period IS NOT NULL GROUP BY period'
        );
        $stmt->execute([$artistId]);

        $result = [];
        foreach ($stmt->fetchAll() as $row) {
            $result[$row['period']] = (float) $row['total'];
        }
        return $result;
    }

    private function topTracks(string $artistId, float $rate): array
    {
        $stmt = Database::pdo()->prepare(
            'SELECT track_title, platform, SUM(streams) AS streams, SUM(revenue_gbp) AS revenue_gbp
             FROM artist_track_platform_analytics_monthly
             WHERE artist_id = ?
             GROUP BY track_title, platform'
        );
        $stmt->execute([$artistId]);

        $byTrack = [];
        foreach ($stmt->fetchAll() as $row) {
            $byTrack[$row['track_title']][] = $row;
        }

        $tracks = [];
        foreach ($byTrack as $title => $platformRows) {
            $totalStreams = 0;
            $totalRevenue = 0.0;
            $platforms = [];
            foreach ($platformRows as $row) {
                $streams = (int) $row['streams'];
                $revenue = (float) $row['revenue_gbp'] * $rate;
                $totalStreams += $streams;
                $totalRevenue += $revenue;
                $platforms[] = ['name' => $row['platform'], 'streams' => $streams];
            }
            $tracks[] = [
                'trackId' => 'track-' . md5($artistId . '|' . $title),
                'title' => $title,
                'totalStreams' => $totalStreams,
                'totalRevenue' => $totalRevenue,
                'platforms' => $platforms,
                'monthly' => [],
            ];
        }

        usort($tracks, fn (array $a, array $b) => $b['totalRevenue'] <=> $a['totalRevenue']);
        return $tracks;
    }

    private function periodLabel(string $period): string
    {
        $date = DateTime::createFromFormat('Y-m-d', $period . '-01');
        return $date === false ? $period : $date->format('M y');
    }
}
