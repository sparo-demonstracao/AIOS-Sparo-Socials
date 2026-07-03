// renovar-cookie.cjs — renova o cookie de sessão do Skool SOZINHO, sem manutenção manual.
// Loga em www.skool.com/login com SKOOL_EMAIL/SKOOL_PASSWORD num navegador invisível (Playwright,
// o mesmo que já passa o WAF no skool-chat.cjs), captura os cookies novos e reescreve a linha
// SKOOL_COOKIES do .env. Grava a data da renovação em C:\tmp\aios-skool-cookie-renovado.txt
// (o Run-Skool usa esse marcador pra renovar proativamente a cada ~2 dias — o cookie dura ~3,5).
// Saída sempre JSON em stdout: {ok:true, cookies:N} ou {ok:false, error:"..."}. Uso: node renovar-cookie.cjs
const fs = require('fs');
const path = require('path');
const PROJ = 'C:\\Users\\canal\\Documentos\\Antigravity Projetos\\AIOS - Sparo Socials';
const { chromium } = require(PROJ + '\\scripts\\baixar-aulas\\node_modules\\playwright');
const ENV = path.join(PROJ, '.env');
const MARCADOR = 'C:\\tmp\\aios-skool-cookie-renovado.txt';

function readEnv() {
  const txt = fs.readFileSync(ENV, 'utf8');
  const map = {};
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m) map[m[1]] = m[2].trim();
  }
  return map;
}
function out(o) { process.stdout.write(JSON.stringify(o)); process.exit(o.ok ? 0 : 1); }

(async () => {
  let env;
  try { env = readEnv(); } catch (e) { return out({ ok: false, error: 'sem .env' }); }
  const email = env.SKOOL_EMAIL || '';
  const senha = env.SKOOL_PASSWORD || '';
  if (!email || !senha || /COLE_O_EMAIL/.test(email) || /COLE_A_SENHA/.test(senha)) {
    return out({ ok: false, error: 'SKOOL_EMAIL/SKOOL_PASSWORD nao configurados no .env' });
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'
    });
    const page = await ctx.newPage();
    await page.goto('https://www.skool.com/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000); // deixa o WAF/JS da página assentar

    const campoEmail = await page.$('input[type="email"], input[name="email"], input[id*="email" i]');
    const campoSenha = await page.$('input[type="password"], input[name="password"]');
    if (!campoEmail || !campoSenha) {
      await browser.close();
      return out({ ok: false, error: 'nao achei os campos de login (a pagina do Skool mudou?)' });
    }
    await campoEmail.fill(email);
    await campoSenha.fill(senha);
    const botao = await page.$('button[type="submit"]');
    if (botao) { await botao.click(); } else { await campoSenha.press('Enter'); }

    // espera o cookie de sessão (auth_token) aparecer — até 30s
    let logado = false;
    for (let i = 0; i < 30 && !logado; i++) {
      await page.waitForTimeout(1000);
      const cs = await ctx.cookies('https://www.skool.com');
      logado = cs.some((c) => c.name === 'auth_token' && c.value);
    }
    const cookies = await ctx.cookies('https://www.skool.com');
    await browser.close(); browser = null;

    if (!logado) return out({ ok: false, error: 'login nao devolveu o cookie de sessao (senha errada? captcha?)' });

    // reescreve SÓ a linha SKOOL_COOKIES do .env, preservando o resto
    const linha = 'SKOOL_COOKIES=' + cookies.map((c) => `${c.name}=${c.value}`).join('; ');
    let txt = fs.readFileSync(ENV, 'utf8');
    if (/^SKOOL_COOKIES=.*$/m.test(txt)) txt = txt.replace(/^SKOOL_COOKIES=.*$/m, () => linha);
    else txt += (txt.endsWith('\n') ? '' : '\n') + linha + '\n';
    fs.writeFileSync(ENV, txt);
    try { fs.writeFileSync(MARCADOR, new Date().toISOString()); } catch (e) {}
    return out({ ok: true, cookies: cookies.length });
  } catch (e) {
    try { if (browser) await browser.close(); } catch (_) {}
    return out({ ok: false, error: String(e && e.message) });
  }
})();
