<?php

// This XAMPP install's shared php.ini sets serialize_precision=100, which makes
// json_encode() dump ~50 garbage digits for any float (e.g. 1.27 becomes
// 1.270000000000000017763...). Scope the fix to this app's requests only, since
// other projects share the same php.ini.
ini_set('serialize_precision', -1);

require __DIR__ . '/src/HttpException.php';
require __DIR__ . '/src/Response.php';
require __DIR__ . '/src/Request.php';
require __DIR__ . '/src/Config.php';
require __DIR__ . '/src/Database.php';
require __DIR__ . '/src/Router.php';
require __DIR__ . '/src/Auth.php';
require __DIR__ . '/src/Controllers/AuthController.php';
require __DIR__ . '/src/Controllers/ArtistController.php';
require __DIR__ . '/src/Controllers/NotificationController.php';
require __DIR__ . '/src/Controllers/TrackController.php';
require __DIR__ . '/src/Controllers/ReportController.php';
require __DIR__ . '/src/Controllers/SettingsController.php';
require __DIR__ . '/src/Controllers/AnalyticsController.php';
require __DIR__ . '/src/Controllers/PayoutController.php';
require __DIR__ . '/src/Controllers/InviteController.php';
require __DIR__ . '/src/Controllers/ProductionController.php';
require __DIR__ . '/src/Controllers/BeatController.php';
require __DIR__ . '/src/Controllers/PricingController.php';

$config = Config::get();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$isAllowedOrigin = in_array($origin, $config['cors']['allowed_origins'], true)
    || (bool) preg_match('#^https?://localhost:\d+$#', $origin);
if ($isAllowedOrigin) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
if ($basePath !== '' && str_starts_with($path, $basePath)) {
    $path = substr($path, strlen($basePath));
}
$path = '/' . ltrim($path, '/');

$router = new Router();

$authController = new AuthController();
$artistController = new ArtistController();
$notificationController = new NotificationController();
$trackController = new TrackController();
$reportController = new ReportController();
$settingsController = new SettingsController();
$analyticsController = new AnalyticsController();
$payoutController = new PayoutController();
$inviteController = new InviteController();
$productionController = new ProductionController();
$beatController = new BeatController();
$pricingController = new PricingController();

$router->add('POST', '/auth/login', [$authController, 'login']);
$router->add('POST', '/auth/logout', [$authController, 'logout']);
$router->add('GET', '/auth/me', [$authController, 'me']);

$router->add('GET', '/artists', [$artistController, 'index']);
$router->add('POST', '/artists', [$artistController, 'store']);
$router->add('GET', '/artists/{id}', [$artistController, 'show']);
$router->add('PATCH', '/artists/{id}/upload-access', [$artistController, 'updateUploadAccess']);
$router->add('PATCH', '/artists/{id}/payout', [$artistController, 'updatePayout']);
$router->add('PATCH', '/artists/{id}/approve', [$artistController, 'approve']);
$router->add('PATCH', '/artists/{id}', [$artistController, 'update']);
$router->add('DELETE', '/artists/{id}', [$artistController, 'destroy']);

$router->add('GET', '/notifications', [$notificationController, 'index']);
$router->add('GET', '/notifications/artist/{id}', [$notificationController, 'forArtist']);
$router->add('POST', '/notifications/broadcast', [$notificationController, 'broadcast']);
$router->add('POST', '/notifications', [$notificationController, 'store']);
$router->add('PATCH', '/notifications/artist/{id}/read-all', [$notificationController, 'markAllRead']);
$router->add('PATCH', '/notifications/{id}/read', [$notificationController, 'markRead']);
$router->add('DELETE', '/notifications/{id}', [$notificationController, 'destroy']);

$router->add('GET', '/tracks', [$trackController, 'index']);
$router->add('POST', '/tracks', [$trackController, 'store']);
$router->add('GET', '/tracks/artist/{id}', [$trackController, 'forArtist']);
$router->add('GET', '/tracks/{id}/audio', [$trackController, 'audio']);
$router->add('GET', '/tracks/{id}', [$trackController, 'show']);
$router->add('PATCH', '/tracks/{id}/status', [$trackController, 'updateStatus']);
$router->add('PATCH', '/tracks/{id}', [$trackController, 'update']);

$router->add('POST', '/reports/upload', [$reportController, 'upload']);
$router->add('GET', '/reports', [$reportController, 'index']);
$router->add('GET', '/reports/pending', [$reportController, 'pending']);
$router->add('PATCH', '/reports/pending/{id}/resolve', [$reportController, 'resolve']);
$router->add('PATCH', '/reports/pending/{id}/skip', [$reportController, 'skip']);

$router->add('GET', '/settings/exchange-rate', [$settingsController, 'exchangeRate']);
$router->add('PATCH', '/settings/exchange-rate', [$settingsController, 'updateExchangeRate']);

$router->add('GET', '/analytics', [$analyticsController, 'index']);
$router->add('GET', '/analytics/artist/{id}', [$analyticsController, 'forArtist']);

$router->add('POST', '/payouts', [$payoutController, 'store']);
$router->add('GET', '/payouts/artist/{id}', [$payoutController, 'forArtist']);

$router->add('POST', '/invites', [$inviteController, 'store']);
$router->add('GET', '/invites/{token}', [$inviteController, 'show']);
$router->add('POST', '/invites/{token}/register', [$inviteController, 'register']);

$router->add('GET', '/productions', [$productionController, 'index']);
$router->add('POST', '/productions', [$productionController, 'store']);
$router->add('PATCH', '/productions/{id}', [$productionController, 'update']);
$router->add('POST', '/productions/{id}', [$productionController, 'update']);
$router->add('DELETE', '/productions/{id}', [$productionController, 'destroy']);

$router->add('GET', '/beats', [$beatController, 'index']);
$router->add('POST', '/beats', [$beatController, 'store']);
$router->add('PATCH', '/beats/{id}', [$beatController, 'update']);
$router->add('POST', '/beats/{id}', [$beatController, 'update']);
$router->add('DELETE', '/beats/{id}', [$beatController, 'destroy']);

$router->add('GET', '/pricing/localized', [$pricingController, 'localized']);

try {
    $router->dispatch($_SERVER['REQUEST_METHOD'], $path);
} catch (HttpException $e) {
    Response::error($e->getMessage(), $e->status);
} catch (Throwable $e) {
    error_log($e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine() . "\n" . $e->getTraceAsString());
    Response::error('Internal server error', 500);
}
