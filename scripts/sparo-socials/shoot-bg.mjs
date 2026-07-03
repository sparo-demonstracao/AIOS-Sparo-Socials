import { chromium } from 'playwright';

const OUT = process.argv[2] || '.';
const N = parseInt(process.argv[3] || '6', 10);
const BASE = 'http://localhost:8099/carrossel-bg.html';
// 4:5 retrato (feed Instagram), 2x p/ alta resolução => 2160x2700
const W = 1080, H = 1350;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

for (let v = 1; v <= N; v++) {
  await page.goto(`${BASE}?v=${v}`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });
  await page.waitForTimeout(400);
  const file = `${OUT}/3d-v${v}.png`;
  await page.screenshot({ path: file });
  console.log('ok', file);
}

await browser.close();
console.log('done');
