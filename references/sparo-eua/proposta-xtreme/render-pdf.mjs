// render-pdf.mjs — gera o PDF da proposta da Xtreme a partir do proposta.html (Letter).
// Rodar: node render-pdf.mjs   (usa o playwright de scripts/baixar-aulas)
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(HERE, '..', '..', '..', 'scripts', 'baixar-aulas', 'package.json'));
const { chromium } = require('playwright');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(HERE, 'proposta.html')).href, { waitUntil: 'networkidle' });

// aviso se alguma página estourou a altura de 11in (conteúdo cortado no PDF)
const overflow = await page.evaluate(() => {
  return [...document.querySelectorAll('.page')].map((p, i) => ({
    pagina: i + 1, alturaConteudo: p.scrollHeight, limite: p.clientHeight,
  })).filter(r => r.alturaConteudo > r.limite + 1);
});
if (overflow.length) console.log('⚠ ESTOUROU:', JSON.stringify(overflow));
else console.log('✓ nenhuma página estourou');

await page.pdf({
  path: path.join(HERE, 'Sparo-Xtreme-Proposta-Automacao-IA.pdf'),
  format: 'Letter',
  printBackground: true,
});
console.log('ok Sparo-Xtreme-Proposta-Automacao-IA.pdf');
await browser.close();
