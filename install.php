<?php
/**
 * ============================================================
 *  CMS SEO MANAGER - INSTALADOR
 *  Sistema de Landing Pages com Geolocalização
 * ============================================================
 *  Instruções:
 *  1. Faça upload de todos os arquivos para sua hospedagem
 *  2. Acesse: https://seudominio.com.br/install.php
 *  3. Preencha as informações do banco de dados e domínio
 *  4. Clique em "Instalar Sistema"
 *  5. Após a instalação, delete este arquivo por segurança
 * ============================================================
 */

// Prevent timeout for large operations
set_time_limit(300);
error_reporting(E_ALL);

// Check if already installed
if (file_exists(__DIR__ . '/config.php')) {
    $config = include __DIR__ . '/config.php';
    if (!empty($config['installed'])) {
        $already_installed = true;
    }
}

$step = isset($_POST['step']) ? (int)$_POST['step'] : 1;
$errors = [];
$success = false;

// ============================================================
// STEP 2: Process Installation
// ============================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $step === 2) {
    
    $db_host = trim($_POST['db_host'] ?? 'localhost');
    $db_name = trim($_POST['db_name'] ?? '');
    $db_user = trim($_POST['db_user'] ?? '');
    $db_pass = $_POST['db_pass'] ?? '';
    $db_prefix = trim($_POST['db_prefix'] ?? 'cms_');
    $site_domain = rtrim(trim($_POST['site_domain'] ?? ''), '/');
    $site_name = trim($_POST['site_name'] ?? 'Notebook Master SP');
    $admin_user = trim($_POST['admin_user'] ?? 'admin');
    $admin_pass = $_POST['admin_pass'] ?? '';
    $admin_pass2 = $_POST['admin_pass2'] ?? '';
    $admin_whatsapp = trim($_POST['admin_whatsapp'] ?? '');
    $admin_phone = trim($_POST['admin_phone'] ?? '');

    // Validations
    if (empty($db_name)) $errors[] = 'Nome do banco de dados é obrigatório';
    if (empty($db_user)) $errors[] = 'Usuário do banco é obrigatório';
    if (empty($site_domain)) $errors[] = 'Domínio do site é obrigatório';
    if (empty($admin_user)) $errors[] = 'Usuário admin é obrigatório';
    if (empty($admin_pass)) $errors[] = 'Senha admin é obrigatória';
    if (strlen($admin_pass) < 6) $errors[] = 'Senha deve ter no mínimo 6 caracteres';
    if ($admin_pass !== $admin_pass2) $errors[] = 'As senhas não coincidem';
    if (!preg_match('/^https?:\/\//', $site_domain)) $errors[] = 'Domínio deve começar com http:// ou https://';

    // Test database connection
    if (empty($errors)) {
        try {
            $pdo = new PDO(
                "mysql:host=$db_host;charset=utf8mb4",
                $db_user,
                $db_pass,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );

            // Create database if not exists
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $pdo->exec("USE `$db_name`");

            // Create tables
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

            // Insert admin user
            $hashed = password_hash($admin_pass, PASSWORD_BCRYPT);
            $stmt = $pdo->prepare("INSERT INTO `{$db_prefix}users` (`username`, `password`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `password` = ?");
            $stmt->execute([$admin_user, $hashed, $hashed]);

            // Insert default settings
            $defaultSettings = [
                'site_name' => $site_name,
                'site_domain' => $site_domain,
                'default_whatsapp' => $admin_whatsapp,
                'default_phone' => $admin_phone,
                'installed_at' => date('Y-m-d H:i:s'),
            ];
            $stmtSetting = $pdo->prepare("INSERT INTO `{$db_prefix}settings` (`setting_key`, `setting_value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `setting_value` = ?");
            foreach ($defaultSettings as $key => $val) {
                $stmtSetting->execute([$key, $val, $val]);
            }

        } catch (PDOException $e) {
            $errors[] = 'Erro no banco de dados: ' . $e->getMessage();
        }
    }

    // Generate config.php
    if (empty($errors)) {
        $secret_key = bin2hex(random_bytes(32));
        $configContent = '<?php
/**
 * CMS SEO Manager - Configuração
 * Gerado automaticamente pelo instalador em ' . date('Y-m-d H:i:s') . '
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
        \'token_expiry\' => 86400, // 24 hours
    ],
];
';
        if (!file_put_contents(__DIR__ . '/config.php', $configContent)) {
            $errors[] = 'Não foi possível criar o arquivo config.php. Verifique as permissões da pasta.';
        }
    }

    // Generate api.php
    if (empty($errors)) {
        $apiContent = '<?php
/**
 * CMS SEO Manager - API Backend
 * Gerado automaticamente pelo instalador
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
            $errors[] = 'Não foi possível criar o arquivo api.php. Verifique as permissões da pasta.';
        }
    }

    // Generate .htaccess
    if (empty($errors)) {
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
    }

    if (empty($errors)) {
        $success = true;
    }
}

// ============================================================
// Check PHP requirements
// ============================================================
$requirements = [
    ['PHP >= 7.4', version_compare(PHP_VERSION, '7.4.0', '>=')],
    ['PDO Extension', extension_loaded('pdo')],
    ['PDO MySQL', extension_loaded('pdo_mysql')],
    ['JSON Extension', extension_loaded('json')],
    ['mbstring Extension', extension_loaded('mbstring')],
    ['Pasta gravável', is_writable(__DIR__)],
];

?><!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instalação - CMS SEO Manager</title>
    <meta name="robots" content="noindex, nofollow">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --gold: 45, 80%, 55%;
            --black: 220, 20%, 8%;
            --navy: 220, 25%, 12%;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: hsl(var(--black));
            color: #e2e8f0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background: 
                radial-gradient(ellipse at 20% 50%, hsla(var(--gold), 0.06) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, hsla(220, 60%, 50%, 0.05) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 90%, hsla(var(--gold), 0.04) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
        }
        .container {
            max-width: 680px;
            width: 100%;
            position: relative;
            z-index: 1;
        }
        .card {
            background: hsla(var(--navy), 0.7);
            border: 1px solid hsla(var(--gold), 0.15);
            border-radius: 16px;
            padding: 40px;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .logo {
            text-align: center;
            margin-bottom: 32px;
        }
        .logo h1 {
            font-size: 28px;
            font-weight: 800;
            background: linear-gradient(135deg, hsl(var(--gold)), hsl(45, 90%, 70%));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .logo p {
            color: #94a3b8;
            font-size: 14px;
            margin-top: 4px;
        }
        .logo .icon {
            width: 56px;
            height: 56px;
            background: hsla(var(--gold), 0.1);
            border: 1px solid hsla(var(--gold), 0.2);
            border-radius: 14px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            font-size: 28px;
        }
        .step-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 32px;
        }
        .step-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: hsla(var(--gold), 0.15);
            transition: all 0.3s;
        }
        .step-dot.active {
            background: hsl(var(--gold));
            box-shadow: 0 0 12px hsla(var(--gold), 0.4);
            width: 28px;
            border-radius: 5px;
        }
        .step-dot.done {
            background: #22c55e;
        }
        .section {
            margin-bottom: 28px;
        }
        .section-title {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: hsl(var(--gold));
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .section-title::after {
            content: '';
            flex: 1;
            height: 1px;
            background: hsla(var(--gold), 0.15);
        }
        .form-group {
            margin-bottom: 16px;
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        label {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: #cbd5e1;
            margin-bottom: 6px;
        }
        label small {
            color: #64748b;
            font-weight: 400;
        }
        input, select {
            width: 100%;
            padding: 12px 16px;
            border-radius: 10px;
            border: 1px solid hsla(var(--gold), 0.15);
            background: hsla(var(--black), 0.6);
            color: #e2e8f0;
            font-size: 14px;
            font-family: 'Inter', sans-serif;
            outline: none;
            transition: all 0.3s;
        }
        input:focus {
            border-color: hsla(var(--gold), 0.5);
            box-shadow: 0 0 0 3px hsla(var(--gold), 0.1);
        }
        input::placeholder { color: #475569; }
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px 28px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
            width: 100%;
        }
        .btn-primary {
            background: linear-gradient(135deg, hsl(var(--gold)), hsl(40, 85%, 50%));
            color: #0f172a;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px hsla(var(--gold), 0.35);
        }
        .btn-success {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
        }
        .btn-danger {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 10px 20px;
            font-size: 13px;
        }
        .alert {
            padding: 14px 18px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 13px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        .alert-error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.25);
            color: #fca5a5;
        }
        .alert-success {
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.25);
            color: #86efac;
        }
        .alert-info {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.2);
            color: #93c5fd;
        }
        .requirements {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 24px;
        }
        .req-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 14px;
            border-radius: 8px;
            background: hsla(var(--black), 0.5);
            font-size: 13px;
        }
        .req-ok { color: #22c55e; font-weight: 600; }
        .req-fail { color: #ef4444; font-weight: 600; }
        .success-box {
            text-align: center;
            padding: 20px 0;
        }
        .success-box .icon {
            font-size: 64px;
            margin-bottom: 16px;
        }
        .success-box h2 {
            font-size: 24px;
            font-weight: 700;
            color: #22c55e;
            margin-bottom: 8px;
        }
        .success-box p {
            color: #94a3b8;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .file-list {
            text-align: left;
            margin: 20px 0;
        }
        .file-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
            border-radius: 8px;
            background: hsla(var(--black), 0.5);
            margin-bottom: 6px;
            font-size: 13px;
        }
        .file-item code {
            color: hsl(var(--gold));
            font-family: 'JetBrains Mono', monospace;
        }
        .links-box {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 20px;
        }
        .links-box a {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 12px;
            border-radius: 10px;
            background: hsla(var(--gold), 0.08);
            border: 1px solid hsla(var(--gold), 0.15);
            color: hsl(var(--gold));
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.3s;
        }
        .links-box a:hover {
            background: hsla(var(--gold), 0.15);
            transform: translateY(-1px);
        }
        .warning-box {
            margin-top: 20px;
            padding: 16px;
            border-radius: 10px;
            background: rgba(245, 158, 11, 0.08);
            border: 1px solid rgba(245, 158, 11, 0.2);
        }
        .warning-box h4 {
            color: #fbbf24;
            font-size: 13px;
            margin-bottom: 6px;
        }
        .warning-box p, .warning-box li {
            color: #94a3b8;
            font-size: 12px;
            line-height: 1.6;
        }
        .warning-box ul {
            padding-left: 16px;
            margin-top: 6px;
        }
        @media (max-width: 640px) {
            .card { padding: 24px; }
            .form-row { grid-template-columns: 1fr; }
            .links-box { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="card">
        <div class="logo">
            <div class="icon">💻</div>
            <h1>CMS SEO Manager</h1>
            <p>Instalador do Sistema de Landing Pages</p>
        </div>

        <?php if (!empty($already_installed) && !$success): ?>
            <div class="alert alert-info">
                ⚠️ O sistema já está instalado. Para reinstalar, delete o arquivo <code>config.php</code> e acesse novamente.
            </div>
            <div class="links-box" style="margin-top: 0;">
                <a href="/">🏠 Página Inicial</a>
                <a href="/admin">⚙️ Painel Admin</a>
            </div>
        <?php elseif ($success): ?>
            <!-- SUCCESS -->
            <div class="success-box">
                <div class="icon">✅</div>
                <h2>Instalação Concluída!</h2>
                <p>O CMS SEO Manager foi instalado com sucesso.</p>
            </div>

            <div class="file-list">
                <p style="font-size: 12px; color: #64748b; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Arquivos gerados:</p>
                <div class="file-item">📄 <code>config.php</code> — Configuração do banco de dados</div>
                <div class="file-item">🔌 <code>api.php</code> — API backend (endpoints REST)</div>
                <div class="file-item">🔒 <code>.htaccess</code> — Regras de rewrite e segurança</div>
            </div>

            <div class="links-box">
                <a href="<?php echo htmlspecialchars($site_domain); ?>">🏠 Página Inicial</a>
                <a href="<?php echo htmlspecialchars($site_domain); ?>/admin">⚙️ Painel Admin</a>
            </div>

            <div class="warning-box">
                <h4>⚠️ Importante — Pós-instalação:</h4>
                <ul>
                    <li><strong>Delete este arquivo</strong> (<code>install.php</code>) por segurança</li>
                    <li>Faça login com: <strong><?php echo htmlspecialchars($admin_user); ?></strong></li>
                    <li>Configure o SSL (HTTPS) no seu domínio</li>
                    <li>Submeta o sitemap.xml no Google Search Console</li>
                </ul>
            </div>

        <?php else: ?>
            <!-- STEP INDICATOR -->
            <div class="step-indicator">
                <div class="step-dot active"></div>
                <div class="step-dot"></div>
            </div>

            <!-- REQUIREMENTS -->
            <div class="section">
                <div class="section-title">📋 Requisitos do Sistema</div>
                <div class="requirements">
                    <?php 
                    $all_ok = true;
                    foreach ($requirements as $req): 
                        if (!$req[1]) $all_ok = false;
                    ?>
                    <div class="req-item">
                        <span><?php echo $req[0]; ?></span>
                        <span class="<?php echo $req[1] ? 'req-ok' : 'req-fail'; ?>">
                            <?php echo $req[1] ? '✓ OK' : '✗ FALHOU'; ?>
                        </span>
                    </div>
                    <?php endforeach; ?>
                </div>
                <?php if (!$all_ok): ?>
                    <div class="alert alert-error">
                        ❌ Alguns requisitos não foram atendidos. Corrija antes de prosseguir.
                    </div>
                <?php endif; ?>
            </div>

            <?php if (!empty($errors)): ?>
                <?php foreach ($errors as $err): ?>
                    <div class="alert alert-error">❌ <?php echo htmlspecialchars($err); ?></div>
                <?php endforeach; ?>
            <?php endif; ?>

            <?php if ($all_ok): ?>
            <form method="POST" autocomplete="off">
                <input type="hidden" name="step" value="2">

                <!-- DATABASE -->
                <div class="section">
                    <div class="section-title">🗄️ Banco de Dados MySQL</div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Host do Banco</label>
                            <input type="text" name="db_host" value="<?php echo htmlspecialchars($_POST['db_host'] ?? 'localhost'); ?>" placeholder="localhost">
                        </div>
                        <div class="form-group">
                            <label>Nome do Banco</label>
                            <input type="text" name="db_name" value="<?php echo htmlspecialchars($_POST['db_name'] ?? ''); ?>" placeholder="cms_seo" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Usuário</label>
                            <input type="text" name="db_user" value="<?php echo htmlspecialchars($_POST['db_user'] ?? ''); ?>" placeholder="root" required>
                        </div>
                        <div class="form-group">
                            <label>Senha</label>
                            <input type="password" name="db_pass" value="<?php echo htmlspecialchars($_POST['db_pass'] ?? ''); ?>" placeholder="••••••••">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Prefixo das tabelas <small>(opcional)</small></label>
                        <input type="text" name="db_prefix" value="<?php echo htmlspecialchars($_POST['db_prefix'] ?? 'cms_'); ?>" placeholder="cms_">
                    </div>
                </div>

                <!-- SITE -->
                <div class="section">
                    <div class="section-title">🌐 Configuração do Site</div>
                    <div class="form-group">
                        <label>Domínio do Site <small>(com https://)</small></label>
                        <input type="url" name="site_domain" value="<?php echo htmlspecialchars($_POST['site_domain'] ?? ''); ?>" placeholder="https://notebookmastersp.com.br" required>
                    </div>
                    <div class="form-group">
                        <label>Nome do Site</label>
                        <input type="text" name="site_name" value="<?php echo htmlspecialchars($_POST['site_name'] ?? 'Notebook Master SP'); ?>" placeholder="Notebook Master SP">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>WhatsApp Padrão</label>
                            <input type="text" name="admin_whatsapp" value="<?php echo htmlspecialchars($_POST['admin_whatsapp'] ?? ''); ?>" placeholder="5511999999999">
                        </div>
                        <div class="form-group">
                            <label>Telefone Padrão</label>
                            <input type="text" name="admin_phone" value="<?php echo htmlspecialchars($_POST['admin_phone'] ?? ''); ?>" placeholder="(11) 99999-9999">
                        </div>
                    </div>
                </div>

                <!-- ADMIN -->
                <div class="section">
                    <div class="section-title">🔐 Conta do Administrador</div>
                    <div class="form-group">
                        <label>Usuário Admin</label>
                        <input type="text" name="admin_user" value="<?php echo htmlspecialchars($_POST['admin_user'] ?? 'admin'); ?>" placeholder="admin" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Senha <small>(mín. 6 caracteres)</small></label>
                            <input type="password" name="admin_pass" placeholder="••••••••" required minlength="6">
                        </div>
                        <div class="form-group">
                            <label>Confirmar Senha</label>
                            <input type="password" name="admin_pass2" placeholder="••••••••" required minlength="6">
                        </div>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary">
                    🚀 Instalar Sistema
                </button>
            </form>
            <?php endif; ?>
        <?php endif; ?>
    </div>

    <p style="text-align: center; margin-top: 16px; color: #475569; font-size: 11px;">
        CMS SEO Manager v1.0 — Sistema de Landing Pages com Geolocalização
    </p>
</div>
</body>
</html>
