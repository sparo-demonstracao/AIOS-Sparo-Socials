// render-carousel.mjs — captura cada .slide do base.html em PNG 1080×1350 @2× (2160×2700).
// Uso (rodar de DENTRO de scripts/baixar-aulas, onde o playwright está instalado):
//   node <ESTE_ARQUIVO> <PASTA_DO_POST> [PASTA_DE_SAIDA]
// A PASTA_DO_POST precisa conter: base.html, avatar.js, slides.js e os assets (hero.png...).
// Saída: slide-01.png ... slide-NN.png (na PASTA_DE_SAIDA, ou na própria pasta do post).
import { chromium } from 'playwright';
import path from 'path';
import { pathToFileURL } from 'url';

const INDIR = process.argv[2];
const OUTDIR = process.argv[3] || INDIR;
if (!INDIR) { console.error('uso: node render-carousel.mjs <pasta-do-post> [saida]'); process.exit(1); }
const url = pathToFileURL(path.join(INDIR, 'base.html')).href;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1300, height: 1500 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });
await page.waitForTimeout(400);

const slides = await page.$$('.slide[data-screen-label]');
console.log('slides:', slides.length);
for (const el of slides) {
  const label = await el.getAttribute('data-screen-label');
  const out = path.join(OUTDIR, `slide-${label}.png`);
  await el.screenshot({ path: out });
  console.log('ok', out);
}
await browser.close();
