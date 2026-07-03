// Passo 2 — MAPEAR ESTRUTURA
// Reusa o login salvo (profile/), navega o club e captura todas as respostas JSON
// da API da Kiwify — que contêm a árvore cursos -> módulos -> aulas.
// Roda headless: não precisa do Enzo.

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CLUB = 'https://members.kiwify.com/?club=dab85c14-2438-4f59-bd75-25ee62b799f4';
const OUT = path.join(__dirname, 'artifacts');
const APIDIR = path.join(OUT, 'api');
const PROFILE = path.join(__dirname, 'profile');
fs.mkdirSync(APIDIR, { recursive: true });

(async () => {
  const ctx = await chromium.launchPersistentContext(PROFILE, { headless: true });
  const page = ctx.pages()[0] || await ctx.newPage();

  let i = 0;
  const apis = [];
  page.on('response', async (res) => {
    try {
      const url = res.url();
      const ct = res.headers()['content-type'] || '';
      if (/kiwify/i.test(url) && /json/i.test(ct)) {
        const body = await res.text();
        if (body && body.length > 40) {
          const f = `${String(++i).padStart(3, '0')}.json`;
          fs.writeFileSync(path.join(APIDIR, f), `// ${url}\n` + body);
          apis.push({ url, file: 'api/' + f, len: body.length });
        }
      }
    } catch {}
  });

  await page.goto(CLUB, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(4000);

  // Clica em cada seção de curso pra forçar o carregamento de módulos/aulas
  const sections = await page.$$('[class*="content-section--modu"]');
  console.log('Seções de curso encontradas:', sections.length);
  for (let s = 0; s < sections.length; s++) {
    try {
      await sections[s].click({ timeout: 5000 });
      await page.waitForTimeout(2500);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(800);
    } catch (e) { console.log('  seção', s, 'erro:', e.message); }
  }

  fs.writeFileSync(path.join(OUT, 'api-index.json'), JSON.stringify(apis, null, 2));
  console.log('Respostas JSON capturadas:', apis.length);
  await ctx.close();
  process.exit(0);
})().catch(e => { console.error('ERRO:', e); process.exit(1); });
