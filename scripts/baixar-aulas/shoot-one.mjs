import { chromium } from 'playwright';
const URL = process.argv[2];
const OUTFILE = process.argv[3];
const W = parseInt(process.argv[4] || '1080', 10);
const H = parseInt(process.argv[5] || '1350', 10);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => window.__ready === true, { timeout: 60000 });
await page.waitForTimeout(500);
await page.screenshot({ path: OUTFILE });
await browser.close();
console.log('ok', OUTFILE);
