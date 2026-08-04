// server.js — o painel do AIOS. Servidor HTTP em Node puro (zero dependências).
// Sobe em http://127.0.0.1:4317 e serve: a página, a API de leitura (status, logs,
// resultados) e a API de ação (com allowlist). Só escuta em localhost por padrão.

const http = require("http");
const fs = require("fs");
const path = require("path");
const { panorama, detectarExecucoes, tail, lerJson } = require("./lib/coletor");
const { executar, ACOES, execucoesAtivas } = require("./lib/acoes");
const { AUTOMACOES } = require("./lib/registro");
const insta = require("./lib/instagram");

const PORT = process.env.AIOS_PORT || 4317;
const HOST = process.env.AIOS_HOST || "127.0.0.1";
const PUBLIC = path.join(__dirname, "public");

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

function json(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(body);
}

function servirEstatico(res, rel) {
  let rota = rel === "/" || rel === "" ? "index.html" : rel.replace(/^\/+/, "");
  if (rota.endsWith("/")) rota += "index.html";
  const limpo = path.normalize(rota).replace(/^(\.\.[\\/])+/, "");
  let arq = path.join(PUBLIC, limpo);
  // se apontar pra uma pasta, serve o index.html dela
  try { if (fs.statSync(arq).isDirectory()) arq = path.join(arq, "index.html"); } catch {}
  if (!arq.startsWith(PUBLIC)) {
    res.writeHead(403);
    return res.end("403");
  }
  fs.readFile(arq, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Não encontrado");
    }
    res.writeHead(200, { "Content-Type": TIPOS[path.extname(arq)] || "application/octet-stream" });
    res.end(data);
  });
}

function acharAutomacao(id) {
  return AUTOMACOES.find((a) => a.id === id);
}

function lerCorpo(req) {
  return new Promise((resolve) => {
    let b = "";
    req.on("data", (c) => {
      b += c;
      if (b.length > 1e6) req.destroy(); // trava simples contra payload gigante
    });
    req.on("end", () => {
      try {
        resolve(b ? JSON.parse(b) : {});
      } catch {
        resolve({});
      }
    });
  });
}

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const rota = url.pathname;

  try {
    // ---------- API ----------
    if (rota === "/api/panorama" && req.method === "GET") {
      return json(res, 200, await panorama(execucoesAtivas()));
    }

    // Execuções ao vivo — leve de propósito (sem PowerShell), o front consulta a cada
    // poucos segundos pra pintar o card em execução e o chip do topo em tempo real.
    if (rota === "/api/execucoes" && req.method === "GET") {
      return json(res, 200, { agora: new Date().toISOString(), execucoes: detectarExecucoes(execucoesAtivas()) });
    }

    // Catálogo das ações executáveis (pro front montar os diálogos de confirmação).
    if (rota === "/api/acoes" && req.method === "GET") {
      const cat = {};
      for (const [id, a] of Object.entries(ACOES)) cat[id] = { confirma: a.confirma };
      return json(res, 200, cat);
    }

    // Log de uma automação (últimas linhas).
    if (rota === "/api/log" && req.method === "GET") {
      const a = acharAutomacao(url.searchParams.get("id"));
      if (!a || !a.logFile) return json(res, 404, { erro: "sem log" });
      const t = tail(a.logFile, 200);
      return json(res, 200, { nome: a.nome, arquivo: a.logFile, ...(t || { texto: "(log ainda vazio)", mtime: null }) });
    }

    // Resultado estruturado de uma automação (o resumo, os rascunhos do Skool).
    if (rota === "/api/saida" && req.method === "GET") {
      const a = acharAutomacao(url.searchParams.get("id"));
      if (!a || !a.outputFile) return json(res, 404, { erro: "sem saída" });
      const r = lerJson(a.outputFile);
      if (!r) return json(res, 200, { vazio: true, nome: a.nome });
      return json(res, 200, { nome: a.nome, mtime: r.mtime, dados: r.dados });
    }

    // Estado (ex.: vídeos já processados pela auto-descrição).
    if (rota === "/api/estado" && req.method === "GET") {
      const a = acharAutomacao(url.searchParams.get("id"));
      if (!a || !a.stateFile) return json(res, 404, { erro: "sem estado" });
      const r = lerJson(a.stateFile);
      if (!r) return json(res, 200, { vazio: true, nome: a.nome });
      return json(res, 200, { nome: a.nome, mtime: r.mtime, dados: r.dados });
    }

    // Propostas de parceria (a página /parcerias.html): por-proposta, com data + relevância da empresa.
    if (rota === "/api/parcerias" && req.method === "GET") {
      const r = lerJson("C:\\tmp\\aios-parcerias.json");
      if (!r) return json(res, 200, { vazio: true, proposals: [] });
      return json(res, 200, { mtime: r.mtime, ...r.dados });
    }

    // Executar ação (allowlist). Exige POST + id conhecido.
    if (rota === "/api/acao" && req.method === "POST") {
      const corpo = await lerCorpo(req);
      const id = corpo.id;
      if (!id || !ACOES[id]) return json(res, 400, { ok: false, mensagem: "Ação não permitida." });
      const resultado = await executar(id, corpo.params || {});
      return json(res, 200, resultado);
    }

    // ---------- Instagram: preparar post ----------
    // Recebe o vídeo cru (bytes no corpo), salva e dispara o pipeline. Devolve o jobId.
    if (rota === "/api/instagram/upload" && req.method === "POST") {
      const nome = url.searchParams.get("name") || "reel.mp4";
      const pos = url.searchParams.get("pos") || "middle";
      const { jobId, dir } = insta.novoJob();
      try {
        const inputPath = await insta.salvarUpload(req, dir, nome);
        insta.iniciar(dir, inputPath, pos);
        return json(res, 200, { ok: true, jobId });
      } catch (e) {
        return json(res, 400, { ok: false, mensagem: "Falha no upload: " + e.message });
      }
    }

    // Log ao vivo do job.
    if (rota === "/api/instagram/log" && req.method === "GET") {
      const r = insta.lerLog(url.searchParams.get("job"));
      if (!r) return json(res, 400, { erro: "job inválido" });
      return json(res, 200, r);
    }

    // Resultado do job (título, legenda, capas) — null enquanto não termina.
    if (rota === "/api/instagram/result" && req.method === "GET") {
      const r = insta.lerResult(url.searchParams.get("job"));
      if (r === null) return json(res, 200, { pendente: true });
      return json(res, 200, { pendente: false, dados: r });
    }

    // Regerar as 3 capas com texto / fonte / posição escolhidos pelo Enzo.
    if (rota === "/api/instagram/cover" && req.method === "POST") {
      const corpo = await lerCorpo(req);
      const r = await insta.reRenderCapas(corpo.job, corpo.text, corpo.pos, corpo.font);
      return json(res, r.ok ? 200 : 400, r);
    }

    // Feed de carrosséis prontos (skill /instagram-design) — lê C:\tmp\aios-instagram-posts.
    if (rota === "/api/instagram/feed" && req.method === "GET") {
      return json(res, 200, insta.feedCarrosseis());
    }

    // Serve um slide PNG de um post do feed, com caminho validado.
    if (rota === "/api/instagram/slide" && req.method === "GET") {
      const p = insta.caminhoSlide(url.searchParams.get("post"), url.searchParams.get("name"));
      if (!p) { res.writeHead(404); return res.end("404"); }
      res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=300" });
      return fs.createReadStream(p).pipe(res);
    }

    // Serve uma imagem (capa-N.png) do job, com caminho validado.
    if (rota === "/api/instagram/file" && req.method === "GET") {
      const p = insta.caminhoImagem(url.searchParams.get("job"), url.searchParams.get("name"));
      if (!p) { res.writeHead(404); return res.end("404"); }
      res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "no-store" });
      return fs.createReadStream(p).pipe(res);
    }

    // ---------- estáticos ----------
    if (req.method === "GET") return servirEstatico(res, rota);

    res.writeHead(405);
    res.end("405");
  } catch (e) {
    json(res, 500, { erro: e.message });
  }
});

servidor.listen(PORT, HOST, () => {
  console.log(`\n  ☀  Painel do AIOS no ar:  http://${HOST}:${PORT}\n  (Ctrl+C para parar)\n`);
});
