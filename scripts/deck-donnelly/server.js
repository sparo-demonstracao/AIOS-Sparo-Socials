// server.js — serve estático o pitch deck Donnelly (mesmo padrão do sparo-socials).
// "/" = deck.html (modo apresentação com a tecla P) · "/slides/slide-NN.png" = PNGs.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'public');
const PORT = process.env.PORT || 8080;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/' || p === '') p = '/index.html';
  // /slides = a mesma apresentação sem animações (o index detecta o pathname)
  if (p === '/slides' || p === '/slides/') p = '/index.html';
  const f = path.normalize(path.join(ROOT, p));
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end('403'); }
  fs.readFile(f, (err, data) => {
    if (err) { res.writeHead(404); return res.end('404'); }
    const type = TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream';
    const headers = { 'Content-Type': type, 'X-Robots-Tag': 'noindex, nofollow' };
    if (path.extname(f) !== '.html') headers['Cache-Control'] = 'public, max-age=3600';
    res.writeHead(200, headers);
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => console.log('Deck Donnelly on 0.0.0.0:' + PORT));
