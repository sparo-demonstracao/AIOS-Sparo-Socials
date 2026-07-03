import { chromium } from 'playwright';

const OUT  = process.argv[2] || '.';
const SEED = process.argv[3] || '2';
const SLIDES = 7;
const SW = 1080, SH = 1350;          // por slide (4:5)
const W = SW * SLIDES;               // faixa total
const BASE = `http://localhost:8099/carrossel-bg.html?pano=1&v=${SEED}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: SH }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

await page.goto(BASE, { waitUntil: 'load' });
await page.waitForFunction(() => window.__ready === true, { timeout: 60000 });
await page.waitForTimeout(500);

// faixa inteira (referência da continuidade)
await page.screenshot({ path: `${OUT}/pano-full.png` });
console.log('ok pano-full.png');

// fatias contínuas
for (let i = 0; i < SLIDES; i++) {
  const file = `${OUT}/pano-s${i+1}.png`;
  await page.screenshot({ path: file, clip: { x: i*SW, y: 0, width: SW, height: SH } });
  console.log('ok', `pano-s${i+1}.png`);
}

await browser.close();
console.log('done seed=' + SEED);
