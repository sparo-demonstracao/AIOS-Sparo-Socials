// Passo 9 — ENVIAR transcrições pro Obsidian (operação ENVIAR da skill)
// Agrupa as aulas por módulo num arquivo .md fiel (texto corrido) e grava em raw/ do vault.

const fs = require('fs');
const path = require('path');

const VIDEOS = 'C:\\Users\\canal\\Downloads\\aulas-masterclass\\Antigravity';
const TR = 'C:\\Users\\canal\\Downloads\\transcricao-masterclass\\transcricoes';
const RAW = 'C:\\Users\\canal\\Documentos\\Obsidian\\Enzo Barbatto\\raw';
const DATA = '2026-06-24';

function sanitizeFile(s) {
  return s.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
}

const created = [];

for (const mod of fs.readdirSync(VIDEOS).sort()) {
  const modDir = path.join(VIDEOS, mod);
  if (!fs.statSync(modDir).isDirectory()) continue;
  const mm = mod.match(/^M(\d+)\s*-\s*(.+)$/);
  if (!mm) continue;
  const mNum = parseInt(mm[1], 10);
  const mName = mm[2].trim();

  // coleta aulas do módulo
  const lessons = [];
  for (const file of fs.readdirSync(modDir)) {
    const lm = file.match(/^(\d+)\.\s+(.+)\s-\sMasterClass de Automação e Apps No Code\.mp4$/);
    if (!lm) continue;
    const lessonNum = parseInt(lm[1], 10);
    const title = lm[2].trim();
    const txtPath = path.join(TR, file.replace(/\.mp4$/, '') + '.txt');
    const corrido = fs.existsSync(txtPath) ? fs.readFileSync(txtPath, 'utf8').trim() : '(transcrição não encontrada)';
    lessons.push({ lessonNum, title, corrido });
  }
  lessons.sort((a, b) => a.lessonNum - b.lessonNum);

  // monta o markdown
  const head = `> origem: transcrição das aulas da MasterClass de Automação e Apps No Code (curso Antigravity do Enzo) — Módulo ${mNum}: ${mName} · gravações de tela transcritas com Whisper · data: ${DATA}\n`;
  let body = `${head}\n# Módulo ${mNum} — ${mName}\n\nTranscrições completas das ${lessons.length} aulas deste módulo (texto corrido, fiel ao áudio).\n`;
  for (const L of lessons) {
    body += `\n---\n\n## Aula ${String(L.lessonNum).padStart(2, '0')} — ${L.title}\n\n${L.corrido}\n`;
  }

  const fname = sanitizeFile(`MasterClass Antigravity — Módulo ${mNum} — ${mName} (transcrição).md`);
  const dest = path.join(RAW, fname);
  if (fs.existsSync(dest)) { console.log(`!! JÁ EXISTE (pulado): ${fname}`); continue; }
  fs.writeFileSync(dest, body, 'utf8');
  created.push({ fname, lessons: lessons.length, kb: Math.round(body.length / 1024) });
}

console.log(`\nArquivos criados em raw/: ${created.length}`);
created.forEach(c => console.log(`  ${c.fname}  (${c.lessons} aulas, ${c.kb} KB)`));
