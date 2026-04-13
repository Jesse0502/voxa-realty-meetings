import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = join(__dirname, 'dist');
const PORT = process.env.PORT || 4173;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.eot':  'application/vnd.ms-fontobject',
  '.webp': 'image/webp',
  '.txt':  'text/plain; charset=utf-8',
};

const server = createServer(async (req, res) => {
  // Strip query string
  const urlPath = req.url.split('?')[0];
  let filePath = join(DIST_DIR, urlPath);

  // Resolve to index.html for directory requests
  if (urlPath.endsWith('/') || !extname(urlPath)) {
    const indexPath = join(filePath, 'index.html');
    if (existsSync(indexPath)) {
      filePath = indexPath;
    } else {
      // SPA fallback — serve root index.html for client-side routing
      filePath = join(DIST_DIR, 'index.html');
    }
  }

  if (!existsSync(filePath)) {
    // Final SPA fallback
    filePath = join(DIST_DIR, 'index.html');
  }

  try {
    const data = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Long-lived cache for hashed assets, no-cache for HTML
    const isHtml = ext === '.html';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': isHtml
        ? 'no-cache, no-store, must-revalidate'
        : 'public, max-age=31536000, immutable',
    });
    res.end(data);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
