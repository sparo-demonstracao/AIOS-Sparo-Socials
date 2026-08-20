const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../../../scripts/baixar-aulas/node_modules/playwright-core'));
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1783, height: 1080 } });
  await page.goto('file://' + path.resolve(__dirname, 'banner.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'banner-aios-masterclass.png' });
  await browser.close();
  console.log('OK banner-aios-masterclass.png');
})().catch(e => { console.error(e.message); process.exit(1); });
