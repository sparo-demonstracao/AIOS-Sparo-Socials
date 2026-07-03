// app.js — o "app" do Painel do AIOS.
// Clica no ícone → este lançador sobe o server.js (filho), abre o painel numa
// janela "modo app" do Edge/Chrome (sem abas, sem barra de endereço) e fica
// vigiando essa janela. Fechou a janela do app → o servidor morre junto.
// Não sobra servidor fantasma rodando depois que você fecha.

const { spawn } = require("child_process");
const path = require("path");
const os = require("os");
const fs = require("fs");
const http = require("http");

const DIR = __dirname;
const PORT = process.env.AIOS_PORT || 4317;
const URL_PAINEL = `http://127.0.0.1:${PORT}`;

// 1) Sobe o servidor como processo filho (sem janela de console).
//    Se a porta já estiver ocupada por um servidor de um clique anterior
//    (fantasma), aproveita ele em vez de morrer em silêncio.
let servidor = null;

function iniciarServidor() {
  servidor = spawn(process.execPath, [path.join(DIR, "server.js")], {
    cwd: DIR,
    stdio: "ignore",
    windowsHide: true,
  });
  // Se o servidor cair sozinho, encerra o app também.
  servidor.on("exit", () => process.exit(0));
}

function matarServidor() {
  if (servidor) {
    try { servidor.kill(); } catch {}
    try { spawn("taskkill", ["/PID", String(servidor.pid), "/T", "/F"], { stdio: "ignore" }); } catch {}
  }
  // garante que não fica processo pendurado na porta (inclui fantasma reaproveitado)
  try {
    spawn("powershell", [
      "-NoProfile", "-Command",
      `Get-NetTCPConnection -LocalPort ${PORT} -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`,
    ], { stdio: "ignore" });
  } catch {}
}

// 2) Acha o navegador (Edge primeiro, depois Chrome).
const CANDIDATOS = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];
const navegador = CANDIDATOS.find((p) => fs.existsSync(p));

// Perfil dedicado: força o navegador a abrir uma instância PRÓPRIA, presa a esta
// janela (sem isso ele "entrega" pra uma janela já aberta e o processo sai na hora).
const PERFIL = path.join(os.tmpdir(), "aios-painel-app");

// 3) Espera o servidor responder e então abre a janela do app.
function esperarServidor(tentativas = 50) {
  http
    .get(URL_PAINEL, () => abrirJanela())
    .on("error", () => {
      if (tentativas <= 0) { matarServidor(); process.exit(1); }
      setTimeout(() => esperarServidor(tentativas - 1), 200);
    });
}

function abrirJanela() {
  if (!navegador) {
    // Sem Edge/Chrome: abre no navegador padrão (aí a vida não fica amarrada à janela).
    spawn("cmd", ["/c", "start", "", URL_PAINEL], { stdio: "ignore" });
    return;
  }
  const janela = spawn(
    navegador,
    [
      `--app=${URL_PAINEL}`,
      `--user-data-dir=${PERFIL}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--window-size=1200,820",
    ],
    { stdio: "ignore" }
  );
  // Fechou a janela do app → mata o servidor e encerra tudo.
  janela.on("exit", () => { matarServidor(); process.exit(0); });
}

// Rede de segurança: se este processo for encerrado, leva o servidor junto.
process.on("exit", matarServidor);
process.on("SIGINT", () => { matarServidor(); process.exit(0); });
process.on("SIGTERM", () => { matarServidor(); process.exit(0); });

// Já tem painel respondendo na porta? Só abre a janela. Senão, sobe o servidor.
http
  .get(URL_PAINEL, () => abrirJanela())
  .on("error", () => { iniciarServidor(); esperarServidor(); });
