<?php

/**

 * CMS SEO Manager - Auto-Installer for Docker/Easypanel

 * This script runs automatically during the Docker build process

 * to set up the database and generate configuration files.

 */



// 1. Get database credentials from environment variables

$db_host = getenv('DB_HOST') ?: 'db';

$db_name = getenv('DB_NAME') ?: 'cms_seo';

$db_user = getenv('DB_USER') ?: 'admin';

$db_pass = getenv('DB_PASS') ?: 'senha_segura';

$db_prefix = getenv('DB_PREFIX') ?: 'cms_';



// Site settings

$site_domain = getenv('SITE_DOMAIN') ?: 'http://localhost';

$site_name = getenv('SITE_NAME') ?: 'Notebook Master SP';



// Admin settings

$admin_user = getenv('ADMIN_USER') ?: 'admin';

$admin_pass = getenv('ADMIN_PASS') ?: 'admin123';

$admin_whatsapp = getenv('ADMIN_WHATSAPP') ?: '5511999999999';

$admin_phone = getenv('ADMIN_PHONE') ?: '(11) 99999-9999';



echo "--- Starting Automated Installation ---\n";

echo "Host: $db_host\n";

echo "Database: $db_name\n";



// 2. Wait for MySQL to be ready

$max_retries = 30;

$retry_count = 0;

$pdo = null;



while ($retry_count < $max_retries) {

    try {

        $pdo = new PDO("mysql:host=$db_host;charset=utf8mb4", $db_user, $db_pass, [

            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,

            PDO::ATTR_TIMEOUT => 5

        ]);

        echo "Successfully connected to MySQL!\n";

        break;

    } catch (PDOException $e) {

        $retry_count++;

        echo "Waiting for MySQL... ($retry_count/$max_retries)\n";

        sleep(2);

    }

}



if (!$pdo) {

    echo "ERROR: Could not connect to MySQL after $max_retries attempts.\n";

    exit(1);

}



// 3. Create Database and Tables

try {

    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

    $pdo->exec("USE `$db_name`");



    // Pages Table

    $pdo->exec("

        CREATE TABLE IF NOT EXISTS `{$db_prefix}pages` (

            `id` INT AUTO_INCREMENT PRIMARY KEY,

            `keyword` VARCHAR(255) NOT NULL,

            `location` VARCHAR(255) NOT NULL,

            `slug` VARCHAR(500) NOT NULL UNIQUE,

            `lat` DECIMAL(10, 6) NOT NULL DEFAULT 0,

            `lng` DECIMAL(10, 6) NOT NULL DEFAULT 0,

            `address` VARCHAR(500) DEFAULT '',

            `cep` VARCHAR(20) DEFAULT '',

            `zona` VARCHAR(100) DEFAULT '',

            `referencia` VARCHAR(500) DEFAULT '',

            `whatsapp` VARCHAR(50) DEFAULT '',

            `phone` VARCHAR(50) DEFAULT '',

            `active` TINYINT(1) NOT NULL DEFAULT 1,

            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci

    ");



    // Users Table

    $pdo->exec("

        CREATE TABLE IF NOT EXISTS `{$db_prefix}users` (

            `id` INT AUTO_INCREMENT PRIMARY KEY,

            `username` VARCHAR(100) NOT NULL UNIQUE,

            `password` VARCHAR(255) NOT NULL,

            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci

    ");



    // Settings Table

    $pdo->exec("

        CREATE TABLE IF NOT EXISTS `{$db_prefix}settings` (

            `id` INT AUTO_INCREMENT PRIMARY KEY,

            `setting_key` VARCHAR(100) NOT NULL UNIQUE,

            `setting_value` TEXT,

            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci

    ");



    // 4. Insert Admin User

    $hashed = password_hash($admin_pass, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("INSERT INTO `{$db_prefix}users` (`username`, `password`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `password` = ?");

    $stmt->execute([$admin_user, $hashed, $hashed]);



    // 5. Insert Settings

    $settings = [

        'site_name' => $site_name,

        'site_domain' => $site_domain,

        'default_whatsapp' => $admin_whatsapp,

        'default_phone' => $admin_phone,

        'installed_at' => date('Y-m-d H:i:s'),

    ];

    $stmt = $pdo->prepare("INSERT INTO `{$db_prefix}settings` (`setting_key`, `setting_value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `setting_value` = ?");

    foreach ($settings as $key => $val) {

        $stmt->execute([$key, $val, $val]);

    }



    echo "Tables and data initialized successfully.\n";



} catch (PDOException $e) {

    echo "ERROR during database setup: " . $e->getMessage() . "\n";

    exit(1);

}



// 6. Generate config.php

$secret_key = bin2hex(random_bytes(32));

$configContent = '<?php

return [

    \'installed\' => true,

    \'db\' => [

        \'host\' => \'' . addslashes($db_host) . '\',

        \'name\' => \'' . addslashes($db_name) . '\',

        \'user\' => \'' . addslashes($db_user) . '\',

        \'pass\' => \'' . addslashes($db_pass) . '\',

        \'prefix\' => \'' . addslashes($db_prefix) . '\',

        \'charset\' => \'utf8mb4\',

    ],

    \'site\' => [

        \'name\' => \'' . addslashes($site_name) . '\',

        \'domain\' => \'' . addslashes($site_domain) . '\',

    ],

    \'security\' => [

        \'secret_key\' => \'' . $secret_key . '\',

        \'token_expiry\' => 86400,

    ],

];

';



file_put_contents(__DIR__ . '/config.php', $configContent);

echo "config.php generated successfully.\n";



// 7. Generate api.php
$apiContent = '<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

$configPath = __DIR__ . "/config.php";
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(["error" => "Config not found"]);
    exit;
}
$config = include $configPath;

try {
    $pdo = new PDO(
        "mysql:host={$config[\'db\'][\'host\']};dbname={$config[\'db\'][\'name\']};charset={$config[\'db\'][\'charset\']}",
        $config[\'db\'][\'user\'],
        $config[\'db\'][\'pass\'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "DB Error"]);
    exit;
}

$prefix = $config[\'db\'][\'prefix\'];
$secret = $config[\'security\'][\'secret_key\'];
$expiry = $config[\'security\'][\'token_expiry\'];

function generateToken($userId, $username, $secret, $expiry) {
    $payload = json_encode(["id" => $userId, "user" => $username, "exp" => time() + $expiry]);
    $encoded = base64_encode($payload);
    $signature = hash_hmac("sha256", $encoded, $secret);
    return $encoded . "." . $signature;
}

function verifyToken($token, $secret) {
    $parts = explode(".", $token);
    if (count($parts) !== 2) return false;
    $sig = hash_hmac("sha256", $parts[0], $secret);
    if (!hash_equals($sig, $parts[1])) return false;
    $payload = json_decode(base64_decode($parts[0]), true);
    if (!$payload || $payload["exp"] < time()) return false;
    return $payload;
}

function requireAuth($secret) {
    $headers = getallheaders();
    $auth = $headers["Authorization"] ?? $headers["authorization"] ?? "";
    $token = str_replace("Bearer ", "", $auth);
    $payload = verifyToken($token, $secret);
    if (!$payload) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }
    return $payload;
}

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = rtrim($uri, "/");
$body = json_decode(file_get_contents("php://input"), true) ?? [];

if ($uri === "/api/login" && $method === "POST") {
    $username = $body["username"] ?? "";
    $password = $body["password"] ?? "";
    $stmt = $pdo->prepare("SELECT * FROM {$prefix}users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    if ($user && password_verify($password, $user["password"])) {
        $token = generateToken($user["id"], $user["username"], $secret, $expiry);
        echo json_encode(["success" => true, "token" => $token, "username" => $user["username"]]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials"]);
    }
    exit;
}

if ($uri === "/api/pages" && $method === "GET") {
    $stmt = $pdo->query("SELECT * FROM {$prefix}pages ORDER BY created_at DESC");
    $pages = $stmt->fetchAll();
    foreach ($pages as &$p) { $p["active"] = (bool)$p["active"]; }
    echo json_encode($pages);
    exit;
}
// ... (adding minimal API markers for now)
';

file_put_contents(__DIR__ . '/api.php', $apiContent);
echo "api.php generated successfully.\n";

echo "--- Automated Installation Completed ---\n";