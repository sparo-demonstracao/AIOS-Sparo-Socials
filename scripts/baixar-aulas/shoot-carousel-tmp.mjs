import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const INDIR = process.argv[2];
const OUTDIR = process.argv[3] || INDIR;
const url = pathToFileURL(path.join(INDIR, 'index.html')).href;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1300, height: 1500 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });
await page.waitForTimeout(400);

const slides = await page.$$('.slide[data-screen-label]');
console.log('slides encontrados:', slides.length);
for (const el of slides) {
  const label = await el.getAttribute('data-screen-label');
  const out = path.join(OUTDIR, `slide-${label}.png`);
  await el.screenshot({ path: out });
  console.log('ok', out);
}
await browser.close();
