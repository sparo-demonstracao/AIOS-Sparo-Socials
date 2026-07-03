// skool-chat.cjs — lê as DMs NÃO LIDAS do chat do Skool e imprime JSON
// {dms:[{autor, original, unread, channelId, conversa:[{de,texto,quando}]}]}.
// "conversa" = o HISTÓRICO da thread (endpoint api2 /channels/<id>/messages?before=35&after=35),
// pra resposta considerar o contexto inteiro, não só a última mensagem.
// Usa Playwright (navegador real) porque o chat fica em api2.skool.com atrás do AWS WAF — só um browser
// de verdade passa o desafio. Cookie precisa estar no domínio .skool.com pra chegar no api2. SÓ LEITURA
// (buscar /messages via fetch NÃO marca como lida — quem marca é o /read, disparado só pela UI).
// Saída sempre JSON em stdout (mesmo em erro, com {dms:[],error}). Uso: node skool-chat.cjs
const fs = require('fs');
const path = require('path');
const PROJ = 'C:\\Users\\canal\\Documentos\\Antigravity Projetos\\AIOS - Sparo Socials';
const { chromium } = require(PROJ + '\\scripts\\baixar-aulas\\node_modules\\playwright');

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
function out(obj) { process.stdout.write(JSON.stringify(obj)); }

(async () => {
  let env;
  try { env = readEnv(); } catch (e) { return out({ dms: [], error: 'sem .env' }); }
  const cstr = env.SKOOL_COOKIES || '';
  if (!cstr || cstr === 'COLE_O_COOKIE_AQUI') return out({ dms: [], error: 'sem cookie' });

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'
    });
    await ctx.addCookies(parseCookies(cstr));
    const page = await ctx.newPage();
    let body = null;
    page.on('response', async (resp) => {
      if (/self\/chat-channels/i.test(resp.url()) && !body) { try { body = await resp.text(); } catch (e) {} }
    });
    await page.goto('https://www.skool.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(6000);
    // 1º: chama a api2 DIRETO de dentro da página logada. Não depende do seletor do botão
    // do chat, que o Skool troca de vez em quando (quebrou em 01/07/2026).
    try {
      const direto = await page.evaluate(async () => {
        // last=true inclui o objeto last_message (sem ele o texto da DM vem vazio)
        const r = await fetch('https://api2.skool.com/self/chat-channels?offset=0&limit=30&last=true&unread-only=false', { credentials: 'include' });
        return r.ok ? await r.text() : null;
      });
      if (direto) body = direto;
    } catch (e) {}
    // plano B: fluxo antigo — clica no ícone do chat e captura a resposta na rede
    if (!body) {
      const btn = await page.$('[class*="ChatNotificationsIconButton"], [class*="ChatIcon"], [aria-label*="chat" i]');
      if (btn) { await btn.click(); await page.waitForTimeout(10000); }
    }

    if (!body) { await browser.close(); return out({ dms: [], error: 'chat nao carregou (cookie expirado? ~3,5 dias)' }); }
    let data; try { data = JSON.parse(body); } catch (e) { await browser.close(); return out({ dms: [], error: 'json invalido: ' + String(body).slice(0, 120) }); }
    const arr = Array.isArray(data) ? data : (data.channels || data.data || data.items || []);
    const MY_ID = '7c49aa3ab078427cbd407d07dd9529ad'; // id do Enzo no Skool
    const dms = [];
    for (const c of arr) {
      const unread = (c.metadata && c.metadata.num_unread) || 0;
      if (unread <= 0) continue; // só os não lidos = quem espera resposta
      const u = c.user || {};
      const nome = ((u.first_name || '') + ' ' + (u.last_name || '')).trim() || u.name || 'Membro';
      const texto = (c.last_message && c.last_message.metadata && c.last_message.metadata.content) || '';
      dms.push({ autor: nome, original: texto.replace(/\s+/g, ' ').slice(0, 600), unread, channelId: c.id, conversa: [] });
    }

    // histórico de cada thread não lida (SÓ LEITURA — fetch em /messages não dispara o /read)
    if (dms.length) {
      const historicos = await page.evaluate(async (ids) => {
        const res = {};
        for (const id of ids) {
          try {
            const r = await fetch('https://api2.skool.com/channels/' + id + '/messages?before=35&after=35', { credentials: 'include' });
            if (r.ok) res[id] = await r.json();
          } catch (e) {}
        }
        return res;
      }, dms.map(d => d.channelId));
      for (const d of dms) {
        const h = historicos[d.channelId];
        const msgs = (h && (h.messages || h.data || h.items)) || [];
        const conv = msgs
          .filter(m => m && m.metadata && m.metadata.content)
          .map(m => ({
            de: (m.metadata.src === MY_ID) ? 'Enzo' : d.autor.split(' ')[0],
            texto: String(m.metadata.content).replace(/\s+/g, ' ').slice(0, 280),
            quando: String(m.created_at || '').slice(0, 16)
          }))
          .sort((a, b) => (a.quando < b.quando ? -1 : 1));
        d.conversa = conv.slice(-12); // últimas 12 mensagens bastam pro contexto
      }
    }
    await browser.close(); browser = null;

    // mais não lidas primeiro
    dms.sort((a, b) => b.unread - a.unread);
    return out({ dms });
  } catch (e) {
    try { if (browser) await browser.close(); } catch (_) {}
    return out({ dms: [], error: String(e && e.message) });
  }
})();
