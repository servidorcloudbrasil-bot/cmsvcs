const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'cms_seo',
};

let pool;

async function getPool() {
    if (!pool) {
        pool = mysql.createPool(dbConfig);
    }
    return pool;
}

// Pages API
app.get('/api/pages', async (req, res) => {
    try {
        const db = await getPool();
        const [rows] = await db.execute('SELECT * FROM pages ORDER BY createdAt DESC');
        res.json(rows.map(row => ({
            ...row,
            active: !!row.active,
            lat: parseFloat(row.lat),
            lng: parseFloat(row.lng)
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/pages', async (req, res) => {
    const page = req.body;
    try {
        const db = await getPool();
        const id = page.id || require('crypto').randomUUID();
        await db.execute(
            'INSERT INTO pages (id, keyword, location, slug, lat, lng, address, cep, zona, referencia, whatsapp, phone, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, page.keyword, page.location, page.slug, page.lat, page.lng, page.address, page.cep, page.zona, page.referencia, page.whatsapp, page.phone, page.active ? 1 : 0]
        );
        const [rows] = await db.execute('SELECT * FROM pages WHERE id = ?', [id]);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/pages/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    try {
        const db = await getPool();
        // Get current page
        const [results] = await db.execute('SELECT * FROM pages WHERE id = ?', [id]);
        if (results.length === 0) return res.status(404).json({ error: 'Page not found' });
        
        const current = results[0];
        const updated = { ...current, ...updates };

        await db.execute(
            'UPDATE pages SET keyword=?, location=?, slug=?, lat=?, lng=?, address=?, cep=?, zona=?, referencia=?, whatsapp=?, phone=?, active=? WHERE id=?',
            [updated.keyword, updated.location, updated.slug, updated.lat, updated.lng, updated.address, updated.cep, updated.zona, updated.referencia, updated.whatsapp, updated.phone, updated.active ? 1 : 0, id]
        );
        
        const [newRows] = await db.execute('SELECT * FROM pages WHERE id = ?', [id]);
        res.json(newRows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/pages/:id', async (req, res) => {
    try {
        const db = await getPool();
        await db.execute('DELETE FROM pages WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Template API
app.get('/api/template', async (req, res) => {
    try {
        const db = await getPool();
        const [rows] = await db.execute('SELECT content FROM template WHERE id = 1');
        if (rows.length === 0) return res.json(null);
        res.json(JSON.parse(rows[0].content));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/template', async (req, res) => {
    try {
        const db = await getPool();
        const content = JSON.stringify(req.body);
        await db.execute(
            'INSERT INTO template (id, content) VALUES (1, ?) ON DUPLICATE KEY UPDATE content = ?',
            [content, content]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Auth API
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const db = await getPool();
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (rows.length > 0) {
            res.json({ success: true, username: rows[0].username });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/change-password', async (req, res) => {
    const { username, password } = req.body;
    try {
        const db = await getPool();
        await db.execute('UPDATE users SET username = ?, password = ? WHERE id = 1', [username, password]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
