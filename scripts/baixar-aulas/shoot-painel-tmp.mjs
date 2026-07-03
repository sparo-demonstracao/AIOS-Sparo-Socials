import { chromium } from 'playwright';
const OUT = process.argv[2];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1477, height: 998 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:4317/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500); // deixar o globo 3D e as fontes assentarem
await page.screenshot({ path: OUT });
await browser.close();
console.log('ok', OUT);
