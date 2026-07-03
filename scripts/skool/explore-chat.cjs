// explore-chat.cjs — EXPLORAÇÃO (descartável): captura o JSON da API /self/chat-channels.
// Uso: node explore-chat.cjs <pasta-de-saida>
const fs = require('fs');
const path = require('path');
const PROJ = 'C:\\Users\\canal\\Documentos\\Antigravity Projetos\\AIOS - Sparo Socials';
const { chromium } = require(PROJ + '\\scripts\\baixar-aulas\\node_modules\\playwright');
const OUT = process.argv[2] || '.';

function readEnv() {
  const txt = fs.readFileSync(path.join(PROJ, '.env'), 'utf8');
  const map = {};
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m) map[m[1]] = m[2].trim();
  }
  return map;
}
function parseCookies(str) {
  return str.split(';').map(p => p.trim()).filter(Boolean).map(p => {
    const i = p.indexOf('=');
    return { name: p.slice(0, i).trim(), value: p.slice(i + 1).trim(), domain: '.skool.com', path: '/' };
  });
}

(async () => {
  const env = readEnv();
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'
  });
  await ctx.addCookies(parseCookies(env.SKOOL_COOKIES));
  const page = await ctx.newPage();

  let body = null;
  page.on('response', async (resp) => {
    if (/self\/chat-channels/i.test(resp.url()) && !body) {
      try { body = await resp.text(); } catch (e) {}
    }
  });

  await page.goto('https://www.skool.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);
  const btn = await page.$('[class*="ChatNotificationsIconButton"]');
  await btn.click();
  await page.waitForTimeout(10000);
  await browser.close();

  if (!body) { console.log('NAO CAPTUREI O BODY'); return; }
  fs.writeFileSync(path.join(OUT, 'chat-channels.json'), body, 'utf8');
  const data = JSON.parse(body);
  // descobre o formato: array? {channels:[...]}?
  const arr = Array.isArray(data) ? data : (data.channels || data.data || data.items || []);
  console.log('total de canais: ' + arr.length);
  if (arr.length) {
    console.log('CAMPOS do 1o canal: ' + Object.keys(arr[0]).join(', '));
    console.log('1o CANAL (JSON, 1600):\n' + JSON.stringify(arr[0], null, 2).slice(0, 1600));
  } else {
    console.log('estrutura topo: ' + Object.keys(data).join(', '));
    console.log(JSON.stringify(data, null, 2).slice(0, 1200));
  }
})().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
