// Passo 1 — EXPLORAÇÃO
// Abre a Kiwify num Chrome controlado, espera o Enzo logar e abrir UMA aula,
// e captura: o stream do vídeo (m3u8/mp4), a estrutura do menu e o HTML/print da página.
// Esses artefatos dizem qual o host do vídeo e como enumerar as 40 aulas.

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CLUB_URL = 'https://members.kiwify.com/?club=dab85c14-2438-4f59-bd75-25ee62b799f4';
const OUT = path.join(__dirname, 'artifacts');
const PROFILE = path.join(__dirname, 'profile'); // login persiste aqui entre execuções
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const ctx = await chromium.launchPersistentContext(PROFILE, {
    headless: false,
    viewport: null,
    args: ['--start-maximized'],
  });
  const page = ctx.pages()[0] || await ctx.newPage();

  // Captura toda requisição que cheira a vídeo
  const streams = [];
  const seen = new Set();
  ctx.on('request', (req) => {
    const url = req.url();
    if (/\.m3u8|\.mpd|\/playlist|\.mp4(\?|$)|panda|vimeo|cloudfront|mux\.com|\.ts(\?|$)/i.test(url)) {
      const key = url.split('?')[0];
      if (seen.has(key)) return;
      seen.add(key);
      streams.push({
        url,
        method: req.method(),
        resourceType: req.resourceType(),
        headers: req.headers(),
      });
    }
  });

  await page.goto(CLUB_URL, { waitUntil: 'domcontentloaded' }).catch(() => {});

  console.log('==========================================================');
  console.log('  FAÇA O LOGIN na janela do Chrome que abriu.');
  console.log('  Depois, ABRA UMA AULA QUALQUER e deixe o vídeo começar.');
  console.log('  Estou esperando o vídeo carregar para capturar o stream...');
  console.log('==========================================================');

  // Espera até detectar um m3u8/mpd/mp4 de vídeo (ou 6 min)
  const start = Date.now();
  let got = false;
  while (Date.now() - start < 6 * 60 * 1000) {
    if (streams.some(s => /\.m3u8|\.mpd|\.mp4(\?|$)|panda|vimeo|mux\.com/i.test(s.url))) { got = true; break; }
    await page.waitForTimeout(2000);
  }

  // Dump dos artefatos
  try { fs.writeFileSync(path.join(OUT, 'url.txt'), page.url()); } catch {}
  try { fs.writeFileSync(path.join(OUT, 'page.html'), await page.content()); } catch {}
  try { await page.screenshot({ path: path.join(OUT, 'screen.png'), fullPage: false }); } catch {}
  try { fs.writeFileSync(path.join(OUT, 'streams.json'), JSON.stringify(streams, null, 2)); } catch {}

  // Tenta mapear o menu/sidebar (links e botões com texto) pra enumerar módulos/aulas
  try {
    const nav = await page.evaluate(() => {
      const els = [...document.querySelectorAll('a,[role="button"],button,li,[class*="lesson"],[class*="module"],[class*="aula"],[class*="modulo"]')];
      return els.map(el => ({
        tag: el.tagName,
        cls: (el.getAttribute('class') || '').slice(0, 120),
        text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 100),
        href: el.getAttribute('href') || null,
      })).filter(x => x.text).slice(0, 600);
    });
    fs.writeFileSync(path.join(OUT, 'nav.json'), JSON.stringify(nav, null, 2));
  } catch (e) {
    fs.writeFileSync(path.join(OUT, 'nav.json'), 'ERRO: ' + e.message);
  }

  console.log(got ? '>>> STREAM CAPTURADO. Artefatos salvos em artifacts/.'
                  : '>>> Tempo esgotado sem detectar vídeo. Salvei o que deu.');
  console.log('>>> Pode deixar a janela aberta. Encerrando captura em 5s.');
  await page.waitForTimeout(5000);
  await ctx.close();
  process.exit(0);
})().catch(e => { console.error('ERRO:', e); process.exit(1); });
