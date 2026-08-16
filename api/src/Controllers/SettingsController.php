<?php

class SettingsController
{
    public function exchangeRate(): void
    {
        Auth::requireAdmin(Database::pdo());
        Response::json(['gbpToUsdRate' => round(self::gbpToUsdRate(), 4)]);
    }

    /**
     * Derived from PricingController's live-fetched, 24h-cached USD-based rates
     * (rates['GBP'] = GBP per 1 USD) instead of an admin-entered value — royalty
     * reports arrive in GBP and always convert at whatever the real rate is "now",
     * same reasoning as the marketing-page price localization.
     */
    public static function gbpToUsdRate(): float
    {
        $rates = PricingController::cachedRates();
        $gbpPerUsd = $rates['GBP'] ?? null;
        if (!is_numeric($gbpPerUsd) || (float) $gbpPerUsd <= 0) {
            return 1.0;
        }
        return 1 / (float) $gbpPerUsd;
    }
}
