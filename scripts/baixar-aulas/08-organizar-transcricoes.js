// Passo 8 — ORGANIZAR TRANSCRIÇÕES pro /roteiro-aula
// Copia as transcrições cruas (transcricao-masterclass/transcricoes/) pra
// references/masterclass/transcricoes-modulo-NN/ com slug limpo:
//   NN-slug.txt  (corrido)  +  NN-slug.timestamps.md  (com timestamps)
// Deriva tudo dos arquivos .mp4 reais (verdade de campo).

const fs = require('fs');
const path = require('path');

const VIDEOS = 'C:\\Users\\canal\\Downloads\\aulas-masterclass\\Antigravity';
const TR = 'C:\\Users\\canal\\Downloads\\transcricao-masterclass\\transcricoes';
const DEST = 'C:\\Users\\canal\\Documentos\\Antigravity Projetos\\AIOS - Sparo Socials\\references\\masterclass';

function slugify(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

let copied = 0, missing = [];
const summary = {};

for (const mod of fs.readdirSync(VIDEOS).sort()) {
  const modDir = path.join(VIDEOS, mod);
  if (!fs.statSync(modDir).isDirectory()) continue;
  const mNum = (mod.match(/^M(\d+)/) || [])[1];
  if (!mNum) continue;
  const NN = String(mNum).padStart(2, '0');
  const outDir = path.join(DEST, `transcricoes-modulo-${NN}`);
  fs.mkdirSync(outDir, { recursive: true });
  summary[`M${mNum}`] = [];

  for (const file of fs.readdirSync(modDir).sort()) {
    const m = file.match(/^(\d+)\.\s+(.+)\s-\sMasterClass de Automação e Apps No Code\.mp4$/);
    if (!m) continue;
    const lessonNum = String(parseInt(m[1], 10)).padStart(2, '0');
    const title = m[2].trim();
    const stem = file.replace(/\.mp4$/, '');
    const srcTxt = path.join(TR, stem + '.txt');
    const srcMd = path.join(TR, stem + '.md');
    const slug = slugify(title);
    const destTxt = path.join(outDir, `${lessonNum}-${slug}.txt`);
    const destMd = path.join(outDir, `${lessonNum}-${slug}.timestamps.md`);

    if (!fs.existsSync(srcTxt)) { missing.push(stem); continue; }
    fs.copyFileSync(srcTxt, destTxt);
    if (fs.existsSync(srcMd)) fs.copyFileSync(srcMd, destMd);
    copied++;
    summary[`M${mNum}`].push(`${lessonNum}-${slug}`);
  }
}

console.log(`Transcrições organizadas: ${copied}`);
if (missing.length) { console.log('FALTOU fonte:'); missing.forEach(s => console.log('  ', s)); }
for (const [k, v] of Object.entries(summary)) {
  console.log(`\n${k} (${v.length}):`);
  v.forEach(x => console.log('   ' + x));
}
