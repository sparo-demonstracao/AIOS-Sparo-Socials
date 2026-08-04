// render-pdf.mjs — gera proposta-donnelly.pdf a partir do proposta.html (Letter).
// Rodar de qualquer lugar: node render-pdf.mjs
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(HERE, '..', '..', '..', 'scripts', 'baixar-aulas', 'package.json'));
const { chromium } = require('playwright');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(HERE, 'proposta.html')).href, { waitUntil: 'networkidle' });
await page.pdf({
  path: path.join(HERE, 'Sparo-Donnelly-AI-Automation-Proposal.pdf'),
  format: 'Letter',
  printBackground: true,
});
console.log('ok proposta-donnelly.pdf');
await browser.close();
