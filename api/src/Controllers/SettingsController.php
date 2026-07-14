<?php

class SettingsController
{
    public function exchangeRate(): void
    {
        Auth::requireAdmin(Database::pdo());
        Response::json($this->mapSettings($this->row()));
    }

    public function updateExchangeRate(): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);
        $body = Request::body();

        $rate = $body['gbpToUsdRate'] ?? null;
        if (!is_numeric($rate) || (float) $rate <= 0) {
            throw new HttpException('gbpToUsdRate must be a positive number.', 422);
        }

        $pdo->prepare('UPDATE settings SET gbp_to_usd_rate = ? WHERE id = 1')->execute([(float) $rate]);
        Response::json($this->mapSettings($this->row()));
    }

    public static function gbpToUsdRate(): float
    {
        $stmt = Database::pdo()->query('SELECT gbp_to_usd_rate FROM settings WHERE id = 1');
        $rate = $stmt->fetchColumn();
        return $rate === false ? 1.0 : (float) $rate;
    }

    private function row(): array
    {
        return Database::pdo()->query('SELECT * FROM settings WHERE id = 1')->fetch();
    }

    private function mapSettings(array $row): array
    {
        return [
            'gbpToUsdRate' => round((float) $row['gbp_to_usd_rate'], 4),
            'updatedAt' => $row['updated_at'],
        ];
    }
}
