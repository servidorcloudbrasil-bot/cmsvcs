import path from "path"
import fs from "fs"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import type { Plugin } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// Plugin to handle sitemap generation via API endpoint
function sitemapPlugin(): Plugin {
  return {
    name: 'sitemap-generator',
    configureServer(server) {
      server.middlewares.use('/api/sitemap', (req, res) => {
        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const { content } = JSON.parse(body);
              if (!content) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing content' }));
                return;
              }

              // Ensure public directory exists
              const publicDir = path.resolve(__dirname, 'public');
              if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir, { recursive: true });
              }

              // Write sitemap.xml to public folder
              const sitemapPath = path.join(publicDir, 'sitemap.xml');
              fs.writeFileSync(sitemapPath, content, 'utf-8');

              // Also write robots.txt if it doesn't exist
              const robotsPath = path.join(publicDir, 'robots.txt');
              if (!fs.existsSync(robotsPath)) {
                const { domain } = JSON.parse(body);
                const robotsContent = `User-agent: *\nAllow: /\n\nSitemap: ${domain || 'https://seusite.com.br'}/sitemap.xml\n`;
                fs.writeFileSync(robotsPath, robotsContent, 'utf-8');
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                path: sitemapPath,
                message: 'Sitemap salvo com sucesso!'
              }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to save sitemap', details: String(err) }));
            }
          });
        } else {
          // GET - serve the current sitemap if it exists
          const sitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml');
          if (fs.existsSync(sitemapPath)) {
            const content = fs.readFileSync(sitemapPath, 'utf-8');
            res.setHeader('Content-Type', 'application/xml');
            res.end(content);
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Sitemap not found' }));
          }
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react(), sitemapPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
