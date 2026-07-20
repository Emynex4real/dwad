<?php

class PricingController
{
    private const RATES_CACHE_TTL_SECONDS = 24 * 60 * 60;
    private const HTTP_TIMEOUT_SECONDS = 3;
    private const FALLBACK = ['currencyCode' => 'USD', 'rate' => 1.0];

    // ipwho.is's response has no currency field, only an ISO 3166-1 country_code —
    // this maps that to an ISO 4217 currency code. Kept as a static table rather than
    // PHP's intl/NumberFormatter (which can derive this from a locale) because intl
    // isn't installed in the production Docker image and adding it would mean an
    // extra apt package + docker-php-ext-install, the same deployment risk already
    // avoided by choosing file_get_contents over curl for the HTTP calls below.
    private const COUNTRY_CURRENCY = [
        'US' => 'USD', 'GB' => 'GBP', 'CA' => 'CAD', 'AU' => 'AUD', 'NZ' => 'NZD',
        'IE' => 'EUR', 'DE' => 'EUR', 'FR' => 'EUR', 'IT' => 'EUR', 'ES' => 'EUR',
        'PT' => 'EUR', 'NL' => 'EUR', 'BE' => 'EUR', 'AT' => 'EUR', 'FI' => 'EUR',
        'GR' => 'EUR', 'LU' => 'EUR', 'MT' => 'EUR', 'CY' => 'EUR', 'SK' => 'EUR',
        'SI' => 'EUR', 'EE' => 'EUR', 'LV' => 'EUR', 'LT' => 'EUR', 'HR' => 'EUR',
        'CH' => 'CHF', 'NO' => 'NOK', 'SE' => 'SEK', 'DK' => 'DKK', 'PL' => 'PLN',
        'CZ' => 'CZK', 'HU' => 'HUF', 'RO' => 'RON', 'BG' => 'BGN', 'IS' => 'ISK',
        'UA' => 'UAH', 'RU' => 'RUB', 'TR' => 'TRY',
        'NG' => 'NGN', 'GH' => 'GHS', 'KE' => 'KES', 'ZA' => 'ZAR', 'EG' => 'EGP',
        'TZ' => 'TZS', 'UG' => 'UGX', 'RW' => 'RWF', 'ET' => 'ETB', 'MA' => 'MAD',
        'DZ' => 'DZD', 'TN' => 'TND', 'SN' => 'XOF', 'CI' => 'XOF', 'CM' => 'XAF',
        'ZM' => 'ZMW', 'ZW' => 'ZWL', 'BW' => 'BWP', 'NA' => 'NAD', 'MZ' => 'MZN',
        'AO' => 'AOA', 'ML' => 'XOF', 'BF' => 'XOF', 'NE' => 'XOF', 'TG' => 'XOF',
        'BJ' => 'XOF', 'GA' => 'XAF', 'CD' => 'CDF', 'SL' => 'SLE', 'LR' => 'LRD',
        'IN' => 'INR', 'PK' => 'PKR', 'BD' => 'BDT', 'LK' => 'LKR', 'NP' => 'NPR',
        'CN' => 'CNY', 'JP' => 'JPY', 'KR' => 'KRW', 'HK' => 'HKD', 'TW' => 'TWD',
        'SG' => 'SGD', 'MY' => 'MYR', 'ID' => 'IDR', 'TH' => 'THB', 'VN' => 'VND',
        'PH' => 'PHP', 'AE' => 'AED', 'SA' => 'SAR', 'QA' => 'QAR', 'KW' => 'KWD',
        'BH' => 'BHD', 'OM' => 'OMR', 'JO' => 'JOD', 'IL' => 'ILS', 'LB' => 'LBP',
        'MX' => 'MXN', 'BR' => 'BRL', 'AR' => 'ARS', 'CL' => 'CLP', 'CO' => 'COP',
        'PE' => 'PEN', 'VE' => 'VES', 'UY' => 'UYU', 'EC' => 'USD', 'JM' => 'JMD',
        'TT' => 'TTD', 'BB' => 'BBD',
    ];

    public function localized(): void
    {
        Response::json($this->resolve());
    }

    private function resolve(): array
    {
        $ip = $this->clientIp();
        if ($ip === null || !$this->isPublicIp($ip)) {
            return self::FALLBACK;
        }

        $geo = $this->fetchJson('https://ipwho.is/' . $ip);
        if ($geo === null || ($geo['success'] ?? false) !== true) {
            return self::FALLBACK;
        }

        $countryCode = $geo['country_code'] ?? null;
        $currencyCode = is_string($countryCode) ? (self::COUNTRY_CURRENCY[$countryCode] ?? null) : null;
        if ($currencyCode === null || $currencyCode === 'USD') {
            return self::FALLBACK;
        }

        $rate = $this->cachedRates()[$currencyCode] ?? null;
        if (!is_numeric($rate) || (float) $rate <= 0) {
            return self::FALLBACK;
        }

        return ['currencyCode' => $currencyCode, 'rate' => (float) $rate];
    }

    private function clientIp(): ?string
    {
        // Render's edge proxy appends the real client IP to X-Forwarded-For; a
        // spoofed first entry only ever affects which currency a visitor sees
        // displayed on this marketing page, nothing security- or payment-relevant.
        $forwardedFor = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
        if ($forwardedFor !== '') {
            $first = trim(explode(',', $forwardedFor)[0]);
            if ($first !== '') {
                return $first;
            }
        }
        return $_SERVER['REMOTE_ADDR'] ?? null;
    }

    private function isPublicIp(string $ip): bool
    {
        // Covers local dev (127.0.0.1) and any private/reserved range — ipwho.is
        // can't geolocate those anyway, so skip the call and go straight to fallback.
        return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false;
    }

    private function cachedRates(): array
    {
        $pdo = Database::pdo();
        $row = $pdo->query('SELECT rates_json, fetched_at FROM currency_rates_cache WHERE id = 1')->fetch();

        $isStale = $row === false || (time() - strtotime($row['fetched_at'])) > self::RATES_CACHE_TTL_SECONDS;
        if (!$isStale) {
            return json_decode($row['rates_json'], true);
        }

        $fresh = $this->fetchJson('https://open.er-api.com/v6/latest/USD');
        $rates = ($fresh['result'] ?? null) === 'success' && is_array($fresh['rates'] ?? null)
            ? $fresh['rates']
            : null;

        if ($rates === null) {
            // Refetch failed — serve the stale cache rather than nothing, if we have one.
            return $row === false ? [] : json_decode($row['rates_json'], true);
        }

        $pdo->prepare(
            'INSERT INTO currency_rates_cache (id, rates_json, fetched_at) VALUES (1, ?, NOW())
             ON DUPLICATE KEY UPDATE rates_json = VALUES(rates_json), fetched_at = VALUES(fetched_at)'
        )->execute([json_encode($rates)]);

        return $rates;
    }

    private function fetchJson(string $url): ?array
    {
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => self::HTTP_TIMEOUT_SECONDS,
                'header' => "User-Agent: DwadMusic/1.0\r\n",
                'ignore_errors' => true,
            ],
        ]);

        // @ suppresses the E_WARNING file_get_contents() raises on a failed
        // connection/timeout — we branch on the false return instead, and every
        // failure path here must degrade to the USD fallback, never surface as an error.
        $body = @file_get_contents($url, false, $context);
        if ($body === false) {
            return null;
        }

        $data = json_decode($body, true);
        return is_array($data) ? $data : null;
    }
}
