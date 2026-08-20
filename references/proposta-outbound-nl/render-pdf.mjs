// render-pdf.mjs — gera os PDFs da proposta de outbound (Holanda) em A4.
// Rodar: node render-pdf.mjs           → versão COM preço (proposta.html)
//        node render-pdf.mjs escopo    → versão SEM preço, pra confirmar o escopo (escopo.html)
// (usa o playwright de scripts/baixar-aulas)
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(HERE, '..', '..', 'scripts', 'baixar-aulas', 'package.json'));
const { chromium } = require('playwright');

const VERSOES = {
  proposta: { html: 'proposta.html', pdf: 'Automated Prospecting & Outreach - Sparo.pdf' },
  escopo:   { html: 'escopo.html',   pdf: 'Automated Prospecting & Outreach - Scope - Sparo.pdf' },
};
const alvo = VERSOES[process.argv[2] || 'proposta'];
if (!alvo) { console.error('versão desconhecida — use: proposta | escopo'); process.exit(1); }

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(HERE, alvo.html)).href, { waitUntil: 'networkidle' });

// aviso se alguma página estourou a altura de 297mm (conteúdo cortado no PDF)
const overflow = await page.evaluate(() => {
  return [...document.querySelectorAll('.page')].map((p, i) => ({
    pagina: i + 1, alturaConteudo: p.scrollHeight, limite: p.clientHeight,
  })).filter(r => r.alturaConteudo > r.limite + 1);
});
if (overflow.length) console.log('⚠ ESTOUROU:', JSON.stringify(overflow));
else console.log('✓ nenhuma página estourou');

await page.pdf({
  path: path.join(HERE, alvo.pdf),
  format: 'A4',
  printBackground: true,
});
console.log('ok ' + alvo.pdf);
await browser.close();
