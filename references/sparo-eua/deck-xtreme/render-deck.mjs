// render-deck.mjs — captura cada .slide do deck.html em PNG 1920×1080 @2×.
// Rodar de DENTRO de scripts/baixar-aulas (onde o playwright está instalado):
//   node "../../references/sparo-eua/deck-xtreme/render-deck.mjs"
// Saída: references/sparo-eua/deck-xtreme/out/slide-01.png ...
// Também avisa se o conteúdo de alguma tela estourou os 1080px de altura.
import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
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
await page.waitForTimeout(400);

// checagem de estouro: o .pad de cada slide não pode passar de 1080px
const overflow = await page.evaluate(() => {
  return [...document.querySelectorAll('.slide')].map((s, i) => {
    const pad = s.querySelector('.pad');
    return { n: i + 1, alturaConteudo: Math.round(pad.scrollHeight), limite: pad.clientHeight };
  }).filter(r => r.alturaConteudo > r.limite + 1);
});
if (overflow.length) console.log('⚠ ESTOUROU:', JSON.stringify(overflow));
else console.log('✓ nenhuma tela estourou');

const slides = await page.$$('.slide');
console.log('telas:', slides.length);
let i = 0;
for (const el of slides) {
  const out = path.join(OUTDIR, `slide-${String(++i).padStart(2, '0')}.png`);
  await el.scrollIntoViewIfNeeded();
  await el.screenshot({ path: out });
  console.log('ok', out);
}
await browser.close();
