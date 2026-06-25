// Servidor estático mínimo (zero dependências) para hospedar o site no Railway.
// Serve sempre o index.html (single-page); query params como ?r=tia funcionam no cliente.
const http = require("http");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "index.html"));
const og = fs.readFileSync(path.join(__dirname, "og.jpg")); // capa pro preview (WhatsApp/Open Graph)
const port = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    // Força HTTPS: o Railway serve http e https; se cair no http, redireciona.
    // (essencial pro microfone/voz, que só funciona em conexão segura)
    if (req.headers["x-forwarded-proto"] === "http") {
      res.writeHead(301, {
        Location: "https://" + req.headers.host + req.url,
      });
      return res.end();
    }
    // capa do link (Open Graph) — WhatsApp, redes etc.
    if (req.url.startsWith("/og.jpg")) {
      res.writeHead(200, {
        "content-type": "image/jpeg",
        "cache-control": "public, max-age=604800",
      });
      return res.end(og);
    }
    // healthcheck simples
    if (req.url === "/health") {
      res.writeHead(200, { "content-type": "text/plain" });
      return res.end("ok");
    }
    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      // HSTS: o navegador passa a forçar https sozinho neste domínio (some o "não seguro")
      "strict-transport-security": "max-age=31536000",
    });
    res.end(html);
  })
  .listen(port, () => console.log("Sparo descoberta no ar na porta " + port));
