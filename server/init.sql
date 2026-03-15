CREATE DATABASE IF NOT EXISTS cms_seo;
USE cms_seo;

CREATE TABLE IF NOT EXISTS pages (
    id VARCHAR(36) PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    lat DOUBLE,
    lng DOUBLE,
    address TEXT,
    cep VARCHAR(20),
    zona VARCHAR(100),
    referencia TEXT,
    whatsapp VARCHAR(20),
    phone VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS template (
    id INT PRIMARY KEY DEFAULT 1,
    content TEXT NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user if not exists (password: admin123)
-- In a real app, use hashed passwords
INSERT IGNORE INTO users (username, password) VALUES ('admin', 'admin123');
