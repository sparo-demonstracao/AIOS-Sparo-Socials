// Passo 3 — MAPEAR LOGADO
// Janela viva. Espera o login, captura toda a API autenticada da Kiwify
// (cursos -> módulos -> aulas) e salva o token pra reuso. Sem fechar até mapear.

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CLUB = 'https://members.kiwify.com/?club=dab85c14-2438-4f59-bd75-25ee62b799f4';
const OUT = path.join(__dirname, 'artifacts');
const APIDIR = path.join(OUT, 'api2');
const PROFILE = path.join(__dirname, 'profile');
fs.mkdirSync(APIDIR, { recursive: true });

(async () => {
  const ctx = await chromium.launchPersistentContext(PROFILE, {
    headless: false, viewport: null, args: ['--start-maximized'],
  });
  const page = ctx.pages()[0] || await ctx.newPage();

  let i = 0;
  const apis = [];
  page.on('response', async (res) => {
    try {
      const url = res.url();
      const ct = res.headers()['content-type'] || '';
      if (/(admin-api|render|api)\.kiwify/i.test(url) && /json/i.test(ct)) {
        const body = await res.text();
        if (body && body.length > 40 && !/"template":"login"/.test(body)) {
          const f = `${String(++i).padStart(3, '0')}.json`;
          fs.writeFileSync(path.join(APIDIR, f), `// ${url}\n` + body);
          apis.push({ url, file: 'api2/' + f, len: body.length });
        }
      }
    } catch {}
  });

  await page.goto(CLUB, { waitUntil: 'domcontentloaded' }).catch(() => {});

  console.log('==========================================================');
  console.log('  Se aparecer tela de login, FAÇA O LOGIN na janela.');
  console.log('  Não precisa abrir aula nenhuma. Só logar e esperar.');
  console.log('==========================================================');

  // Espera o conteúdo do curso aparecer (logado) — até 6 min
  const start = Date.now();
  let logged = false;
  while (Date.now() - start < 6 * 60 * 1000) {
    const n = await page.evaluate(() =>
      document.querySelectorAll('[class*="content-section"], a[href*="?club="]').length
    ).catch(() => 0);
    if (n > 3) { logged = true; break; }
    await page.waitForTimeout(2000);
  }
  console.log('Logado / conteúdo presente:', logged);

  if (logged) {
    // Salva token de auth (localStorage) pra reuso futuro sem navegador
    try {
      const store = await page.evaluate(() => {
        const o = {};
        for (let k = 0; k < localStorage.length; k++) {
          const key = localStorage.key(k); o[key] = localStorage.getItem(key);
        }
        return o;
      });
      fs.writeFileSync(path.join(OUT, 'localstorage.json'), JSON.stringify(store, null, 2));
    } catch {}

    // Rola a página pra carregar todas as seções de curso (lazy load)
    for (let s = 0; s < 8; s++) {
      await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight)).catch(() => {});
      await page.waitForTimeout(1200);
    }

    // Abre cada seção de curso pra forçar carregar módulos/aulas na API
    const sections = await page.$$('[class*="content-section--modu"]');
    console.log('Seções de curso:', sections.length);
    for (let s = 0; s < sections.length; s++) {
      try {
        await sections[s].scrollIntoViewIfNeeded();
        await sections[s].click({ timeout: 5000 });
        await page.waitForTimeout(2500);
        // dentro do modal, tenta expandir todos os módulos (clica nos botões de accordion)
        const toggles = await page.$$('div[role="dialog"] button, .modal button, [class*="modal"] button');
        for (const t of toggles.slice(0, 40)) { try { await t.click({ timeout: 1000 }); await page.waitForTimeout(300); } catch {} }
        await page.waitForTimeout(1000);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(800);
      } catch (e) { console.log('  seção', s, 'erro:', e.message); }
    }

    // Coleta todos os links de aula do DOM (padrão /curso/modulo/aula?club=)
    const lessons = await page.evaluate(() => {
      const re = /^\/[0-9a-f-]{36}\/[0-9a-f-]{36}\/[0-9a-f-]{36}\?club=/i;
      const out = [];
      document.querySelectorAll('a[href]').forEach(a => {
        const h = a.getAttribute('href') || '';
        if (re.test(h)) out.push({ href: h, text: (a.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 160) });
      });
      return out;
    }).catch(() => []);
    fs.writeFileSync(path.join(OUT, 'lessons-dom.json'), JSON.stringify(lessons, null, 2));
    console.log('Links de aula no DOM:', lessons.length);
  }

  fs.writeFileSync(path.join(OUT, 'api2-index.json'), JSON.stringify(apis, null, 2));
  console.log('Respostas JSON autenticadas:', apis.length);
  await page.waitForTimeout(2000);
  await ctx.close();
  process.exit(0);
})().catch(e => { console.error('ERRO:', e); process.exit(1); });
