<?php

class PayoutController
{
    public function store(): void
    {
        $pdo = Database::pdo();
        $admin = Auth::requireAdmin($pdo);
        $body = Request::body();

        $artistId = $body['artistId'] ?? '';
        $amount = $body['amountUsd'] ?? null;
        if ($artistId === '' || !is_numeric($amount) || (float) $amount <= 0) {
            throw new HttpException('artistId and a positive amountUsd are required.', 422);
        }

        $stmt = $pdo->prepare('SELECT id FROM artists WHERE id = ?');
        $stmt->execute([$artistId]);
        if ($stmt->fetch() === false) {
            throw new HttpException('Artist not found', 404);
        }

        $period = $body['period'] ?? null;

        // Debounce accidental double-clicks/retries: a truly separate payout for the same
        // artist/amount/period will always be at least a few seconds apart in practice.
        $dup = $pdo->prepare(
            'SELECT id FROM payouts
             WHERE artist_id = ? AND amount_usd = ? AND period <=> ? AND paid_at > (NOW() - INTERVAL 30 SECOND)'
        );
        $dup->execute([$artistId, (float) $amount, $period]);
        $existingId = $dup->fetchColumn();
        if ($existingId !== false) {
            Response::json($this->findPayout($existingId));
            return;
        }

        $id = 'payout-' . bin2hex(random_bytes(6));
        $pdo->prepare(
            'INSERT INTO payouts (id, artist_id, amount_usd, period, note, recorded_by)
             VALUES (?, ?, ?, ?, ?, ?)'
        )->execute([$id, $artistId, (float) $amount, $period, $body['note'] ?? null, $admin['id']]);

        Response::json($this->findPayout($id), 201);
    }

    public function forArtist(array $args): void
    {
        $pdo = Database::pdo();
        $user = Auth::requireUser($pdo);
        $id = $args['id'];

        if ($user['role'] !== 'admin' && $user['id'] !== $id) {
            throw new HttpException('Forbidden', 403);
        }

        $stmt = $pdo->prepare('SELECT * FROM payouts WHERE artist_id = ? ORDER BY paid_at DESC');
        $stmt->execute([$id]);
        Response::json(array_map($this->mapPayout(...), $stmt->fetchAll()));
    }

    private function findPayout(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM payouts WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row === false ? null : $this->mapPayout($row);
    }

    private function mapPayout(array $row): array
    {
        return [
            'id' => $row['id'],
            'artistId' => $row['artist_id'],
            'amountUsd' => (float) $row['amount_usd'],
            'period' => $row['period'],
            'note' => $row['note'],
            'recordedBy' => $row['recorded_by'],
            'paidAt' => $row['paid_at'],
        ];
    }
}
