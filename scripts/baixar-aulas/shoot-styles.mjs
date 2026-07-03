import { chromium } from 'playwright';
import { pathToFileURL } from 'url';
import path from 'path';

const HTML = process.argv[2];
const OUT  = process.argv[3];
const W = 1080, H = 1350;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

for (const style of ['A','B','C']) {
  const url = pathToFileURL(HTML).href + `?style=${style}&n=2`;
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, `sample-${style}.png`) });
  console.log('ok', `sample-${style}.png`);
}
await browser.close();
console.log('done');
