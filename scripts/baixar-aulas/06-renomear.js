// Passo 6 — RENOMEAR
// Renomeia "NN - Titulo.mp4" -> "N. Titulo - MasterClass de Automação e Apps No Code.mp4"
// (padrão das pastas que já existem no Drive). Derivado do próprio nome, sem manifesto.

const fs = require('fs');
const path = require('path');

const ROOT = 'C:\\Users\\canal\\Downloads\\aulas-masterclass\\Antigravity';
const SUFFIX = ' - MasterClass de Automação e Apps No Code';

let renamed = 0, already = 0;
for (const mod of fs.readdirSync(ROOT)) {
  const md = path.join(ROOT, mod);
  if (!fs.statSync(md).isDirectory()) continue;
  for (const f of fs.readdirSync(md)) {
    if (!f.toLowerCase().endsWith('.mp4')) continue;
    const m = f.match(/^(\d+)\s*-\s*(.+)\.mp4$/i);
    if (!m) { continue; }
    const num = parseInt(m[1], 10);
    const title = m[2].trim();
    const novo = `${num}. ${title}${SUFFIX}.mp4`;
    if (novo === f) { already++; continue; }
    fs.renameSync(path.join(md, f), path.join(md, novo));
    renamed++;
  }
}
console.log(`Renomeados: ${renamed} | já no padrão: ${already}`);

// Lista final por módulo
for (const mod of fs.readdirSync(ROOT).sort()) {
  const md = path.join(ROOT, mod);
  if (!fs.statSync(md).isDirectory()) continue;
  const files = fs.readdirSync(md).filter(f => f.toLowerCase().endsWith('.mp4'));
  console.log(`\n${mod}  (${files.length})`);
  files.sort().forEach(f => console.log('   ' + f));
}
