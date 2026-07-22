<?php

class PricingController
{
    private const HTTP_TIMEOUT_SECONDS = 3;

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

    // Full English names for the admin currency-rates table, so it reads
    // "Nigeria — NGN" rather than bare ISO codes. Same key set as COUNTRY_CURRENCY.
    private const COUNTRY_NAMES = [
        'US' => 'United States', 'GB' => 'United Kingdom', 'CA' => 'Canada', 'AU' => 'Australia', 'NZ' => 'New Zealand',
        'IE' => 'Ireland', 'DE' => 'Germany', 'FR' => 'France', 'IT' => 'Italy', 'ES' => 'Spain',
        'PT' => 'Portugal', 'NL' => 'Netherlands', 'BE' => 'Belgium', 'AT' => 'Austria', 'FI' => 'Finland',
        'GR' => 'Greece', 'LU' => 'Luxembourg', 'MT' => 'Malta', 'CY' => 'Cyprus', 'SK' => 'Slovakia',
        'SI' => 'Slovenia', 'EE' => 'Estonia', 'LV' => 'Latvia', 'LT' => 'Lithuania', 'HR' => 'Croatia',
        'CH' => 'Switzerland', 'NO' => 'Norway', 'SE' => 'Sweden', 'DK' => 'Denmark', 'PL' => 'Poland',
        'CZ' => 'Czech Republic', 'HU' => 'Hungary', 'RO' => 'Romania', 'BG' => 'Bulgaria', 'IS' => 'Iceland',
        'UA' => 'Ukraine', 'RU' => 'Russia', 'TR' => 'Turkey',
        'NG' => 'Nigeria', 'GH' => 'Ghana', 'KE' => 'Kenya', 'ZA' => 'South Africa', 'EG' => 'Egypt',
        'TZ' => 'Tanzania', 'UG' => 'Uganda', 'RW' => 'Rwanda', 'ET' => 'Ethiopia', 'MA' => 'Morocco',
        'DZ' => 'Algeria', 'TN' => 'Tunisia', 'SN' => 'Senegal', 'CI' => 'Ivory Coast', 'CM' => 'Cameroon',
        'ZM' => 'Zambia', 'ZW' => 'Zimbabwe', 'BW' => 'Botswana', 'NA' => 'Namibia', 'MZ' => 'Mozambique',
        'AO' => 'Angola', 'ML' => 'Mali', 'BF' => 'Burkina Faso', 'NE' => 'Niger', 'TG' => 'Togo',
        'BJ' => 'Benin', 'GA' => 'Gabon', 'CD' => 'DR Congo', 'SL' => 'Sierra Leone', 'LR' => 'Liberia',
        'IN' => 'India', 'PK' => 'Pakistan', 'BD' => 'Bangladesh', 'LK' => 'Sri Lanka', 'NP' => 'Nepal',
        'CN' => 'China', 'JP' => 'Japan', 'KR' => 'South Korea', 'HK' => 'Hong Kong', 'TW' => 'Taiwan',
        'SG' => 'Singapore', 'MY' => 'Malaysia', 'ID' => 'Indonesia', 'TH' => 'Thailand', 'VN' => 'Vietnam',
        'PH' => 'Philippines', 'AE' => 'United Arab Emirates', 'SA' => 'Saudi Arabia', 'QA' => 'Qatar', 'KW' => 'Kuwait',
        'BH' => 'Bahrain', 'OM' => 'Oman', 'JO' => 'Jordan', 'IL' => 'Israel', 'LB' => 'Lebanon',
        'MX' => 'Mexico', 'BR' => 'Brazil', 'AR' => 'Argentina', 'CL' => 'Chile', 'CO' => 'Colombia',
        'PE' => 'Peru', 'VE' => 'Venezuela', 'UY' => 'Uruguay', 'EC' => 'Ecuador', 'JM' => 'Jamaica',
        'TT' => 'Trinidad and Tobago', 'BB' => 'Barbados',
    ];

    public function localized(): void
    {
        $base = strtoupper(trim($_GET['base'] ?? 'USD'));
        if (!preg_match('/^[A-Z]{3}$/', $base)) {
            $base = 'USD';
        }
        Response::json($this->resolve($base));
    }

    /**
     * Resolves what 1 unit of $base is worth in the visitor's local currency.
     * $base lets a page quote its prices in a currency other than USD (e.g.
     * AkiibStudioPage quotes in NGN) and still get them converted correctly —
     * admin-set rates are all USD-based, so any base-to-target rate is just
     * adminRate(target) / adminRate(base).
     */
    private function resolve(string $base): array
    {
        $fallback = ['currencyCode' => $base, 'rate' => 1.0];

        $ip = $this->clientIp();
        if ($ip === null || !$this->isPublicIp($ip)) {
            return $fallback;
        }

        $geo = $this->fetchJson('https://ipwho.is/' . $ip);
        if ($geo === null || ($geo['success'] ?? false) !== true) {
            return $fallback;
        }

        $countryCode = $geo['country_code'] ?? null;
        $currencyCode = is_string($countryCode) ? (self::COUNTRY_CURRENCY[$countryCode] ?? null) : null;
        if ($currencyCode === null || $currencyCode === $base) {
            return $fallback;
        }

        $targetRate = $this->adminRate($currencyCode);
        $baseRate = $this->adminRate($base);
        if ($targetRate === null || $baseRate === null) {
            return $fallback;
        }

        return ['currencyCode' => $currencyCode, 'rate' => $targetRate / $baseRate];
    }

    // USD is the fixed pivot (1 USD = 1 USD) — never stored, never admin-editable.
    // Every other currency's rate is admin-entered; no row means "not configured".
    private function adminRate(string $currencyCode): ?float
    {
        if ($currencyCode === 'USD') {
            return 1.0;
        }
        $stmt = Database::pdo()->prepare('SELECT rate FROM currency_rates WHERE currency_code = ?');
        $stmt->execute([$currencyCode]);
        $rate = $stmt->fetchColumn();
        return $rate === false ? null : (float) $rate;
    }

    public function adminIndex(): void
    {
        Auth::requireAdmin(Database::pdo());

        $rows = Database::pdo()->query('SELECT currency_code, rate, updated_at FROM currency_rates')->fetchAll();
        $ratesByCode = [];
        foreach ($rows as $row) {
            $ratesByCode[$row['currency_code']] = ['rate' => (float) $row['rate'], 'updatedAt' => $row['updated_at']];
        }

        $countriesByCurrency = [];
        foreach (self::COUNTRY_CURRENCY as $countryCode => $currencyCode) {
            if ($currencyCode === 'USD') {
                continue;
            }
            $countriesByCurrency[$currencyCode][] = self::COUNTRY_NAMES[$countryCode] ?? $countryCode;
        }

        $result = [];
        foreach ($countriesByCurrency as $currencyCode => $countries) {
            sort($countries);
            $result[] = [
                'currencyCode' => $currencyCode,
                'countries' => $countries,
                'rate' => $ratesByCode[$currencyCode]['rate'] ?? null,
                'updatedAt' => $ratesByCode[$currencyCode]['updatedAt'] ?? null,
            ];
        }
        usort($result, fn (array $a, array $b) => $a['currencyCode'] <=> $b['currencyCode']);

        Response::json($result);
    }

    public function adminUpdate(array $args): void
    {
        Auth::requireAdmin(Database::pdo());
        $code = strtoupper($args['code']);
        if (!preg_match('/^[A-Z]{3}$/', $code) || $code === 'USD') {
            throw new HttpException('Invalid currency code.', 422);
        }

        $body = Request::body();
        $rate = $body['rate'] ?? null;
        if (!is_numeric($rate) || (float) $rate <= 0) {
            throw new HttpException('rate must be a positive number.', 422);
        }

        Database::pdo()->prepare(
            'INSERT INTO currency_rates (currency_code, rate) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE rate = VALUES(rate)'
        )->execute([$code, (float) $rate]);

        Response::json(['success' => true]);
    }

    public function adminDelete(array $args): void
    {
        Auth::requireAdmin(Database::pdo());
        $code = strtoupper($args['code']);
        Database::pdo()->prepare('DELETE FROM currency_rates WHERE currency_code = ?')->execute([$code]);
        Response::json(['success' => true]);
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
        // failure path here must degrade to the base-currency fallback, never
        // surface as an error.
        $body = @file_get_contents($url, false, $context);
        if ($body === false) {
            return null;
        }

        $data = json_decode($body, true);
        return is_array($data) ? $data : null;
    }
}
