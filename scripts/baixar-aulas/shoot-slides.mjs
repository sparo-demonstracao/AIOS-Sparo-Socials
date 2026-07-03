import { chromium } from 'playwright';
import { pathToFileURL } from 'url';
import path from 'path';

const HTML = process.argv[2];   // caminho absoluto do slide.html
const OUT  = process.argv[3];   // pasta de saída
const W = 1080, H = 1350;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

for (let n = 1; n <= 7; n++) {
  const url = pathToFileURL(HTML).href + `?n=${n}`;
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const file = path.join(OUT, `slide-${n}.png`);
  await page.screenshot({ path: file });
  console.log('ok', `slide-${n}.png`);
}

await browser.close();
console.log('done');
