import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(HERE, '..', '..', '..', 'scripts', 'baixar-aulas', 'package.json'));
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(path.join(HERE, 'proposta.html')).href, { waitUntil: 'networkidle' });
const pages = await page.$$('.page');
let i = 1;
for (const el of pages) { await el.screenshot({ path: path.join(HERE, `qa-page${i}.png`) }); i++; }
console.log('ok', pages.length, 'paginas');
await browser.close();
