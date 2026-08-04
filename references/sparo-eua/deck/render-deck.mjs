// render-deck.mjs — captura cada .slide do deck.html em PNG 1920×1080 @2× (3840×2160).
// Rodar de DENTRO de scripts/baixar-aulas (onde o playwright está instalado):
//   node "../../references/sparo-eua/deck/render-deck.mjs"
// Saída: references/sparo-eua/deck/out/slide-01.png ... slide-15.png
import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// playwright vive em scripts/baixar-aulas/node_modules (repo-raiz/scripts/baixar-aulas)
const require = createRequire(path.join(HERE, '..', '..', '..', 'scripts', 'baixar-aulas', 'package.json'));
const { chromium } = require('playwright');
const OUTDIR = path.join(HERE, 'out');
fs.mkdirSync(OUTDIR, { recursive: true });
const url = pathToFileURL(path.join(HERE, 'deck.html')).href;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 2000, height: 1200 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });
await page.waitForTimeout(300);

const slides = await page.$$('.slide[data-screen-label]');
console.log('slides:', slides.length);
for (const el of slides) {
  const label = await el.getAttribute('data-screen-label');
  const out = path.join(OUTDIR, `slide-${label}.png`);
  await el.scrollIntoViewIfNeeded();
  await el.screenshot({ path: out });
  console.log('ok', out);
}
await browser.close();
