<?php

class PricingController
{
    private const RATES_CACHE_TTL_SECONDS = 24 * 60 * 60;
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
     * $base lets a page quote its prices in a currency other than USD and still
     * get them converted correctly — the cached rates table is USD-based, so
     * any base-to-target rate is just rates[target] / rates[base].
     */
    private function resolve(string $base): array
    {
        $fallback = ['currencyCode' => $base, 'rate' => 1.0];

        $ip = $this->clientIp();
        if ($ip === null || !$this->isPublicIp($ip)) {
            return $fallback;
        }

        $geo = self::fetchJson('https://ipwho.is/' . $ip);
        if ($geo === null || ($geo['success'] ?? false) !== true) {
            return $fallback;
        }

        $countryCode = $geo['country_code'] ?? null;
        $currencyCode = is_string($countryCode) ? (self::COUNTRY_CURRENCY[$countryCode] ?? null) : null;
        if ($currencyCode === null || $currencyCode === $base) {
            return $fallback;
        }

        $rates = self::cachedRates();
        $targetRate = $rates[$currencyCode] ?? null;
        $baseRate = $rates[$base] ?? null;
        if (!is_numeric($targetRate) || !is_numeric($baseRate) || (float) $targetRate <= 0 || (float) $baseRate <= 0) {
            return $fallback;
        }

        return ['currencyCode' => $currencyCode, 'rate' => (float) $targetRate / (float) $baseRate];
    }

    private const PLAN_GROUPS = ['distro-basic', 'distro-bundle', 'studio', 'akiib'];
    private const PLAN_COLUMNS = 'id, label, price, features_json, group_key, featured, sort_order, updated_at';

    public function plansIndex(): void
    {
        $rows = Database::pdo()->query('SELECT ' . self::PLAN_COLUMNS . ' FROM pricing_plans ORDER BY group_key, sort_order')->fetchAll();
        Response::json(array_map(fn (array $row) => self::formatPlan($row), $rows));
    }

    public function plansCreate(): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);

        $body = Request::body();
        $label = is_string($body['label'] ?? null) ? trim($body['label']) : '';
        $price = $body['price'] ?? null;
        $groupKey = is_string($body['groupKey'] ?? null) ? trim($body['groupKey']) : '';
        $featured = !empty($body['featured']);

        if ($label === '') {
            throw new HttpException('label is required.', 422);
        }
        if (!is_numeric($price) || (float) $price <= 0) {
            throw new HttpException('price must be a positive number.', 422);
        }
        if (!in_array($groupKey, self::PLAN_GROUPS, true)) {
            throw new HttpException('groupKey must be one of: ' . implode(', ', self::PLAN_GROUPS), 422);
        }

        $features = $this->normalizedFeatures($body['features'] ?? []);

        $maxSort = $pdo->prepare('SELECT COALESCE(MAX(sort_order), -1) FROM pricing_plans WHERE group_key = ?');
        $maxSort->execute([$groupKey]);
        $sortOrder = (int) $maxSort->fetchColumn() + 1;

        $id = $groupKey . '-' . bin2hex(random_bytes(5));

        $stmt = $pdo->prepare(
            'INSERT INTO pricing_plans (id, label, price, features_json, group_key, featured, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$id, $label, (float) $price, json_encode($features), $groupKey, $featured ? 1 : 0, $sortOrder]);

        Response::json($this->findPlan($id), 201);
    }

    public function plansUpdate(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);

        $body = Request::body();
        $hasLabel = array_key_exists('label', $body);
        $hasPrice = array_key_exists('price', $body);
        $hasFeatures = array_key_exists('features', $body);
        $hasFeatured = array_key_exists('featured', $body);
        if (!$hasLabel && !$hasPrice && !$hasFeatures && !$hasFeatured) {
            throw new HttpException('label, price, features, or featured must be provided.', 422);
        }

        $setClauses = [];
        $params = [];

        if ($hasLabel) {
            $label = is_string($body['label']) ? trim($body['label']) : '';
            if ($label === '') {
                throw new HttpException('label must not be empty.', 422);
            }
            $setClauses[] = 'label = ?';
            $params[] = $label;
        }

        if ($hasPrice) {
            $price = $body['price'];
            if (!is_numeric($price) || (float) $price <= 0) {
                throw new HttpException('price must be a positive number.', 422);
            }
            $setClauses[] = 'price = ?';
            $params[] = (float) $price;
        }

        if ($hasFeatures) {
            $setClauses[] = 'features_json = ?';
            $params[] = json_encode($this->normalizedFeatures($body['features']));
        }

        if ($hasFeatured) {
            $setClauses[] = 'featured = ?';
            $params[] = !empty($body['featured']) ? 1 : 0;
        }

        $params[] = $args['id'];
        $stmt = $pdo->prepare('UPDATE pricing_plans SET ' . implode(', ', $setClauses) . ' WHERE id = ?');
        $stmt->execute($params);
        if ($stmt->rowCount() === 0) {
            $exists = $pdo->prepare('SELECT 1 FROM pricing_plans WHERE id = ?');
            $exists->execute([$args['id']]);
            if ($exists->fetchColumn() === false) {
                throw new HttpException('Pricing plan not found', 404);
            }
        }

        Response::json($this->findPlan($args['id']));
    }

    public function plansDestroy(array $args): void
    {
        $pdo = Database::pdo();
        Auth::requireAdmin($pdo);

        $stmt = $pdo->prepare('DELETE FROM pricing_plans WHERE id = ?');
        $stmt->execute([$args['id']]);
        if ($stmt->rowCount() === 0) {
            throw new HttpException('Pricing plan not found', 404);
        }

        Response::json(['success' => true]);
    }

    /** @return list<string> */
    private function normalizedFeatures(mixed $features): array
    {
        if (!is_array($features) || array_is_list($features) === false) {
            throw new HttpException('features must be an array of strings.', 422);
        }
        return array_values(array_filter(array_map(
            fn ($f) => is_string($f) ? trim($f) : null,
            $features
        ), fn ($f) => $f !== null && $f !== ''));
    }

    private function findPlan(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT ' . self::PLAN_COLUMNS . ' FROM pricing_plans WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row === false ? null : self::formatPlan($row);
    }

    private static function formatPlan(array $row): array
    {
        $features = json_decode($row['features_json'] ?? '[]', true);
        return [
            'id' => $row['id'],
            'label' => $row['label'],
            'price' => (float) $row['price'],
            'features' => is_array($features) ? array_values($features) : [],
            'groupKey' => $row['group_key'],
            'featured' => (bool) $row['featured'],
            'sortOrder' => (int) $row['sort_order'],
            'updatedAt' => $row['updated_at'],
        ];
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

    /**
     * USD-based rates (rates[X] = units of X per 1 USD), cached 24h. Public+static
     * so other controllers needing a live exchange rate (e.g. SettingsController's
     * GBP→USD figure for royalty reports) reuse the same fetch+cache instead of
     * hitting the upstream API independently.
     */
    public static function cachedRates(): array
    {
        $pdo = Database::pdo();
        $row = $pdo->query('SELECT rates_json, fetched_at FROM currency_rates_cache WHERE id = 1')->fetch();

        $isStale = $row === false || (time() - strtotime($row['fetched_at'])) > self::RATES_CACHE_TTL_SECONDS;
        if (!$isStale) {
            return json_decode($row['rates_json'], true);
        }

        $fresh = self::fetchJson('https://open.er-api.com/v6/latest/USD');
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

    private static function fetchJson(string $url): ?array
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
