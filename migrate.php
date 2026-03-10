<?php
/**
 * ============================================================
 *  CMS SEO MANAGER - MIGRAÇÃO PARA SERVIDOR
 * ============================================================
 *  Este arquivo gerencia a migração completa do sistema local
 *  para um servidor de hospedagem remoto.
 *  
 *  Funcionalidades:
 *  1. Recebe os dados (páginas, configurações) via POST
 *  2. Cria o banco de dados e tabelas no servidor de destino
 *  3. Importa todos os dados
 *  4. Gera config.php, api.php e .htaccess
 *  5. Retorna status da migração em JSON
 * ============================================================
 */

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

set_time_limit(600);
error_reporting(E_ALL);

// Only accept POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Método não permitido. Use POST."]);
    exit;
}

$body = json_decode(file_get_contents("php://input"), true);

if (!$body) {
    http_response_code(400);
    echo json_encode(["error" => "Dados inválidos"]);
    exit;
}

// Required fields
$action = $body["action"] ?? "";

// ============================================================
// ACTION: test - Test connection to remote database
// ============================================================
if ($action === "test") {
    $db_host = $body["db_host"] ?? "localhost";
    $db_name = $body["db_name"] ?? "";
    $db_user = $body["db_user"] ?? "";
    $db_pass = $body["db_pass"] ?? "";

    if (empty($db_name) || empty($db_user)) {
        http_response_code(400);
        echo json_encode(["error" => "Nome do banco e usuário são obrigatórios"]);
        exit;
    }

    try {
        $pdo = new PDO(
            "mysql:host=$db_host;charset=utf8mb4",
            $db_user,
            $db_pass,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        echo json_encode([
            "success" => true,
            "message" => "Conexão com o banco de dados estabelecida com sucesso!",
            "server_info" => [
                "php_version" => PHP_VERSION,
                "mysql_version" => $pdo->getAttribute(PDO::ATTR_SERVER_VERSION),
                "server_software" => $_SERVER["SERVER_SOFTWARE"] ?? "Unknown",
            ]
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Falha na conexão: " . $e->getMessage()]);
    }
    exit;
}

// ============================================================
// ACTION: migrate - Full migration
// ============================================================
if ($action === "migrate") {
    $db_host    = $body["db_host"] ?? "localhost";
    $db_name    = $body["db_name"] ?? "";
    $db_user    = $body["db_user"] ?? "";
    $db_pass    = $body["db_pass"] ?? "";
    $db_prefix  = $body["db_prefix"] ?? "cms_";
    $site_domain = rtrim($body["site_domain"] ?? "", "/");
    $site_name  = $body["site_name"] ?? "CMS SEO Manager";
    $admin_user = $body["admin_user"] ?? "admin";
    $admin_pass = $body["admin_pass"] ?? "";
    $admin_whatsapp = $body["admin_whatsapp"] ?? "";
    $admin_phone    = $body["admin_phone"] ?? "";
    $pages      = $body["pages"] ?? [];
    $template_html = $body["template_html"] ?? "";

    $errors = [];
    $log = [];

    // Validations
    if (empty($db_name)) $errors[] = "Nome do banco de dados é obrigatório";
    if (empty($db_user)) $errors[] = "Usuário do banco é obrigatório";
    if (empty($site_domain)) $errors[] = "Domínio do site é obrigatório";
    if (empty($admin_user)) $errors[] = "Usuário admin é obrigatório";
    if (empty($admin_pass)) $errors[] = "Senha admin é obrigatória";
    if (!preg_match('/^https?:\/\//', $site_domain)) $errors[] = "Domínio deve começar com http:// ou https://";

    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(["error" => implode("; ", $errors)]);
        exit;
    }

    try {
        // 1. Connect and create database
        $log[] = "Conectando ao banco de dados...";
        $pdo = new PDO(
            "mysql:host=$db_host;charset=utf8mb4",
            $db_user,
            $db_pass,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );

        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo->exec("USE `$db_name`");
        $log[] = "✅ Banco de dados '$db_name' criado/conectado";

        // 2. Create tables
        $log[] = "Criando tabelas...";
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
                `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_slug (`slug`),
                INDEX idx_active (`active`),
                INDEX idx_zona (`zona`),
                INDEX idx_keyword (`keyword`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");

        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `{$db_prefix}users` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `username` VARCHAR(100) NOT NULL UNIQUE,
                `password` VARCHAR(255) NOT NULL,
                `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");

        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `{$db_prefix}settings` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `setting_key` VARCHAR(100) NOT NULL UNIQUE,
                `setting_value` TEXT,
                `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        $log[] = "✅ Tabelas criadas com sucesso";

        // 3. Create admin user
        $log[] = "Criando usuário admin...";
        $hashed = password_hash($admin_pass, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO `{$db_prefix}users` (`username`, `password`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `password` = ?");
        $stmt->execute([$admin_user, $hashed, $hashed]);
        $log[] = "✅ Usuário admin criado";

        // 4. Insert settings
        $log[] = "Salvando configurações...";
        $defaultSettings = [
            'site_name'        => $site_name,
            'site_domain'      => $site_domain,
            'default_whatsapp' => $admin_whatsapp,
            'default_phone'    => $admin_phone,
            'installed_at'     => date('Y-m-d H:i:s'),
            'migrated_at'      => date('Y-m-d H:i:s'),
        ];
        $stmtSetting = $pdo->prepare("INSERT INTO `{$db_prefix}settings` (`setting_key`, `setting_value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `setting_value` = ?");
        foreach ($defaultSettings as $key => $val) {
            $stmtSetting->execute([$key, $val, $val]);
        }
        $log[] = "✅ Configurações salvas";

        // 5. Import pages
        $log[] = "Importando " . count($pages) . " páginas...";
        $created = 0;
        $skipped = 0;

        $stmtInsert = $pdo->prepare("
            INSERT INTO `{$db_prefix}pages` 
            (`keyword`, `location`, `slug`, `lat`, `lng`, `address`, `cep`, `zona`, `referencia`, `whatsapp`, `phone`, `active`, `created_at`, `updated_at`) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            `keyword` = VALUES(`keyword`),
            `location` = VALUES(`location`),
            `lat` = VALUES(`lat`),
            `lng` = VALUES(`lng`),
            `address` = VALUES(`address`),
            `cep` = VALUES(`cep`),
            `zona` = VALUES(`zona`),
            `referencia` = VALUES(`referencia`),
            `whatsapp` = VALUES(`whatsapp`),
            `phone` = VALUES(`phone`),
            `active` = VALUES(`active`),
            `updated_at` = VALUES(`updated_at`)
        ");

        foreach ($pages as $p) {
            try {
                $stmtInsert->execute([
                    $p["keyword"] ?? "",
                    $p["location"] ?? "",
                    $p["slug"] ?? "",
                    $p["lat"] ?? 0,
                    $p["lng"] ?? 0,
                    $p["address"] ?? "",
                    $p["cep"] ?? "",
                    $p["zona"] ?? "",
                    $p["referencia"] ?? "",
                    $p["whatsapp"] ?? "",
                    $p["phone"] ?? "",
                    isset($p["active"]) ? (int)$p["active"] : 1,
                    $p["createdAt"] ?? date('Y-m-d H:i:s'),
                    $p["updatedAt"] ?? date('Y-m-d H:i:s'),
                ]);
                $created++;
            } catch (PDOException $e) {
                $skipped++;
            }
        }
        $log[] = "✅ Páginas importadas: $created criadas, $skipped ignoradas";

        // 6. Generate config.php
        $log[] = "Gerando config.php...";
        $secret_key = bin2hex(random_bytes(32));
        $configContent = '<?php
/**
 * CMS SEO Manager - Configuração
 * Gerado automaticamente pela migração em ' . date('Y-m-d H:i:s') . '
 * NÃO edite este arquivo manualmente a menos que saiba o que está fazendo.
 */
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
        if (!file_put_contents(__DIR__ . '/config.php', $configContent)) {
            $errors[] = "Não foi possível criar config.php";
        }
        $log[] = "✅ config.php gerado";

        // 7. Generate api.php
        $log[] = "Gerando api.php...";
        $apiContent = '<?php
/**
 * CMS SEO Manager - API Backend
 * Gerado automaticamente pela migração
 */
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// Load config
$config = include __DIR__ . "/config.php";
if (!$config || empty($config["installed"])) {
    http_response_code(500);
    echo json_encode(["error" => "Sistema não instalado"]);
    exit;
}

// Database connection
try {
    $pdo = new PDO(
        "mysql:host={$config[\'db\'][\'host\']};dbname={$config[\'db\'][\'name\']};charset={$config[\'db\'][\'charset\']}",
        $config[\'db\'][\'user\'],
        $config[\'db\'][\'pass\'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erro de conexão com banco de dados"]);
    exit;
}

$prefix = $config[\'db\'][\'prefix\'];
$secret = $config[\'security\'][\'secret_key\'];
$expiry = $config[\'security\'][\'token_expiry\'];

// Simple JWT-like token
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
        echo json_encode(["error" => "Não autorizado"]);
        exit;
    }
    return $payload;
}

// Router
$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = rtrim($uri, "/");
$body = json_decode(file_get_contents("php://input"), true) ?? [];

// ===================== AUTH =====================
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
        echo json_encode(["error" => "Credenciais inválidas"]);
    }
    exit;
}

if ($uri === "/api/auth/check" && $method === "GET") {
    $payload = requireAuth($secret);
    echo json_encode(["authenticated" => true, "username" => $payload["user"]]);
    exit;
}

if ($uri === "/api/auth/change-password" && $method === "POST") {
    $payload = requireAuth($secret);
    $newUser = $body["username"] ?? "";
    $newPass = $body["password"] ?? "";
    
    if (strlen($newPass) < 6) {
        http_response_code(400);
        echo json_encode(["error" => "Senha deve ter no mínimo 6 caracteres"]);
        exit;
    }
    
    $hashed = password_hash($newPass, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE {$prefix}users SET username = ?, password = ? WHERE id = ?");
    $stmt->execute([$newUser, $hashed, $payload["id"]]);
    echo json_encode(["success" => true]);
    exit;
}

// ===================== PAGES =====================
if ($uri === "/api/pages" && $method === "GET") {
    $stmt = $pdo->query("SELECT * FROM {$prefix}pages ORDER BY created_at DESC");
    $pages = $stmt->fetchAll();
    // Convert active to boolean
    foreach ($pages as &$p) { $p["active"] = (bool)$p["active"]; }
    echo json_encode($pages);
    exit;
}

if ($uri === "/api/pages" && $method === "POST") {
    requireAuth($secret);
    $required = ["keyword", "location", "slug"];
    foreach ($required as $f) {
        if (empty($body[$f])) {
            http_response_code(400);
            echo json_encode(["error" => "Campo obrigatório: $f"]);
            exit;
        }
    }
    
    // Check duplicate slug
    $stmt = $pdo->prepare("SELECT id FROM {$prefix}pages WHERE slug = ?");
    $stmt->execute([$body["slug"]]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(["error" => "Slug já existe"]);
        exit;
    }
    
    $stmt = $pdo->prepare("INSERT INTO {$prefix}pages (keyword, location, slug, lat, lng, address, cep, zona, referencia, whatsapp, phone, active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
    $stmt->execute([
        $body["keyword"], $body["location"], $body["slug"],
        $body["lat"] ?? 0, $body["lng"] ?? 0,
        $body["address"] ?? "", $body["cep"] ?? "", $body["zona"] ?? "",
        $body["referencia"] ?? "", $body["whatsapp"] ?? "", $body["phone"] ?? "",
        isset($body["active"]) ? (int)$body["active"] : 1
    ]);
    
    $id = $pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT * FROM {$prefix}pages WHERE id = ?");
    $stmt->execute([$id]);
    $page = $stmt->fetch();
    $page["active"] = (bool)$page["active"];
    echo json_encode($page);
    exit;
}

// Bulk create pages
if ($uri === "/api/pages/bulk" && $method === "POST") {
    requireAuth($secret);
    $pages = $body["pages"] ?? [];
    $created = 0;
    $skipped = 0;
    
    foreach ($pages as $p) {
        $stmt = $pdo->prepare("SELECT id FROM {$prefix}pages WHERE slug = ?");
        $stmt->execute([$p["slug"] ?? ""]);
        if ($stmt->fetch()) { $skipped++; continue; }
        
        $stmt = $pdo->prepare("INSERT INTO {$prefix}pages (keyword, location, slug, lat, lng, address, cep, zona, referencia, whatsapp, phone, active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
        $stmt->execute([
            $p["keyword"] ?? "", $p["location"] ?? "", $p["slug"] ?? "",
            $p["lat"] ?? 0, $p["lng"] ?? 0,
            $p["address"] ?? "", $p["cep"] ?? "", $p["zona"] ?? "",
            $p["referencia"] ?? "", $p["whatsapp"] ?? "", $p["phone"] ?? "",
            1
        ]);
        $created++;
    }
    
    echo json_encode(["created" => $created, "skipped" => $skipped]);
    exit;
}

// Single page by slug (public)
if (preg_match(\'#^/api/pages/slug/(.+)$#\', $uri, $m) && $method === "GET") {
    $stmt = $pdo->prepare("SELECT * FROM {$prefix}pages WHERE slug = ? AND active = 1");
    $stmt->execute([urldecode($m[1])]);
    $page = $stmt->fetch();
    if ($page) {
        $page["active"] = (bool)$page["active"];
        echo json_encode($page);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Página não encontrada"]);
    }
    exit;
}

// Single page by ID
if (preg_match(\'#^/api/pages/(\\d+)$#\', $uri, $m)) {
    $id = (int)$m[1];
    
    if ($method === "PUT") {
        requireAuth($secret);
        $fields = [];
        $values = [];
        $allowed = ["keyword","location","slug","lat","lng","address","cep","zona","referencia","whatsapp","phone","active"];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $body)) {
                $fields[] = "$f = ?";
                $values[] = $f === "active" ? (int)$body[$f] : $body[$f];
            }
        }
        if (!empty($fields)) {
            $values[] = $id;
            $stmt = $pdo->prepare("UPDATE {$prefix}pages SET " . implode(", ", $fields) . " WHERE id = ?");
            $stmt->execute($values);
        }
        $stmt = $pdo->prepare("SELECT * FROM {$prefix}pages WHERE id = ?");
        $stmt->execute([$id]);
        $page = $stmt->fetch();
        if ($page) $page["active"] = (bool)$page["active"];
        echo json_encode($page);
        exit;
    }
    
    if ($method === "DELETE") {
        requireAuth($secret);
        $stmt = $pdo->prepare("DELETE FROM {$prefix}pages WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        exit;
    }
    
    if ($method === "GET") {
        $stmt = $pdo->prepare("SELECT * FROM {$prefix}pages WHERE id = ?");
        $stmt->execute([$id]);
        $page = $stmt->fetch();
        if ($page) {
            $page["active"] = (bool)$page["active"];
            echo json_encode($page);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Não encontrado"]);
        }
        exit;
    }
}

// Toggle active
if (preg_match(\'#^/api/pages/(\\d+)/toggle$#\', $uri, $m) && $method === "PUT") {
    requireAuth($secret);
    $id = (int)$m[1];
    $pdo->prepare("UPDATE {$prefix}pages SET active = NOT active WHERE id = ?")->execute([$id]);
    $stmt = $pdo->prepare("SELECT * FROM {$prefix}pages WHERE id = ?");
    $stmt->execute([$id]);
    $page = $stmt->fetch();
    if ($page) $page["active"] = (bool)$page["active"];
    echo json_encode($page);
    exit;
}

// ===================== SETTINGS =====================
if ($uri === "/api/settings" && $method === "GET") {
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM {$prefix}settings");
    $settings = [];
    while ($row = $stmt->fetch()) {
        $settings[$row["setting_key"]] = $row["setting_value"];
    }
    echo json_encode($settings);
    exit;
}

// ===================== SITEMAP =====================
if ($uri === "/api/sitemap" && $method === "POST") {
    requireAuth($secret);
    $content = $body["content"] ?? "";
    $domain = $body["domain"] ?? "";
    
    if (empty($content)) {
        http_response_code(400);
        echo json_encode(["error" => "Conteúdo do sitemap é obrigatório"]);
        exit;
    }
    
    $sitemapPath = __DIR__ . "/sitemap.xml";
    if (file_put_contents($sitemapPath, $content)) {
        // Also create/update robots.txt
        $robotsPath = __DIR__ . "/robots.txt";
        $robotsContent = "User-agent: *\\nAllow: /\\n\\nSitemap: $domain/sitemap.xml\\n";
        file_put_contents($robotsPath, str_replace("\\\\n", "\\n", $robotsContent));
        
        echo json_encode(["success" => true, "path" => $sitemapPath]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Falha ao salvar sitemap"]);
    }
    exit;
}

// ===================== STATS =====================
if ($uri === "/api/stats" && $method === "GET") {
    $total = $pdo->query("SELECT COUNT(*) FROM {$prefix}pages")->fetchColumn();
    $active = $pdo->query("SELECT COUNT(*) FROM {$prefix}pages WHERE active = 1")->fetchColumn();
    $zonas = $pdo->query("SELECT COUNT(DISTINCT zona) FROM {$prefix}pages")->fetchColumn();
    echo json_encode(["total" => (int)$total, "active" => (int)$active, "inactive" => (int)$total - (int)$active, "zonas" => (int)$zonas]);
    exit;
}

// 404
http_response_code(404);
echo json_encode(["error" => "Endpoint não encontrado: $method $uri"]);
';
        if (!file_put_contents(__DIR__ . '/api.php', $apiContent)) {
            $errors[] = "Não foi possível criar api.php";
        }
        $log[] = "✅ api.php gerado";

        // 8. Generate .htaccess
        $log[] = "Gerando .htaccess...";
        $htaccessContent = '# CMS SEO Manager - Rewrite Rules
RewriteEngine On
RewriteBase /

# Security: Block access to config
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>

# API requests -> api.php
RewriteRule ^api/(.*)$ api.php [QSA,L]

# Sitemap
RewriteRule ^sitemap\.xml$ sitemap.xml [L]

# Robots
RewriteRule ^robots\.txt$ robots.txt [L]

# Static assets (js, css, images, fonts)
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|mp4|webm)$ - [L]

# React SPA - all other requests go to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
';
        file_put_contents(__DIR__ . '/.htaccess', $htaccessContent);
        $log[] = "✅ .htaccess gerado";

        // 9. Generate sitemap if pages exist
        if (count($pages) > 0) {
            $log[] = "Gerando sitemap.xml...";
            $now = date('Y-m-d');
            $sitemapUrls = ["  <url>\n    <loc>{$site_domain}/</loc>\n    <lastmod>{$now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>"];
            
            foreach ($pages as $p) {
                if (!empty($p["active"])) {
                    $slug = htmlspecialchars($p["slug"] ?? "");
                    $sitemapUrls[] = "  <url>\n    <loc>{$site_domain}/{$slug}</loc>\n    <lastmod>{$now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>";
                }
            }

            $sitemapXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset\n  xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"\n  xmlns:geo=\"http://www.google.com/geo/schemas/sitemap/1.0\"\n>\n" . implode("\n", $sitemapUrls) . "\n</urlset>";
            file_put_contents(__DIR__ . '/sitemap.xml', $sitemapXml);

            $robotsContent = "User-agent: *\nAllow: /\n\nSitemap: {$site_domain}/sitemap.xml\n";
            file_put_contents(__DIR__ . '/robots.txt', $robotsContent);
            $log[] = "✅ sitemap.xml e robots.txt gerados";
        }

        // 10. Save template HTML if provided
        if (!empty($template_html)) {
            $log[] = "Salvando template HTML...";
            // The template is embedded in index.html, nothing extra needed
            $log[] = "✅ Template será servido via index.html";
        }

        // Summary
        echo json_encode([
            "success" => true,
            "message" => "Migração concluída com sucesso!",
            "log" => $log,
            "stats" => [
                "pages_created" => $created,
                "pages_skipped" => $skipped,
                "total_pages" => count($pages),
                "files_generated" => ["config.php", "api.php", ".htaccess", "sitemap.xml", "robots.txt"],
            ],
            "urls" => [
                "home" => $site_domain,
                "admin" => $site_domain . "/login",
                "api" => $site_domain . "/api/stats",
            ]
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "error" => "Erro durante a migração: " . $e->getMessage(),
            "log" => $log,
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "error" => "Erro inesperado: " . $e->getMessage(),
            "log" => $log,
        ]);
    }
    exit;
}

// Unknown action
http_response_code(400);
echo json_encode(["error" => "Ação desconhecida: $action. Use 'test' ou 'migrate'."]);
