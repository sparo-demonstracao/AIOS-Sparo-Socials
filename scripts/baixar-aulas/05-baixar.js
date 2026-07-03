// Passo 5 — BAIXAR
// Lê manifest.json, filtra o curso Antigravity (só aulas com vídeo) e baixa
// cada .mp4 direto do CloudFront com curl (resume + retry). Concorrência limitada.
// Organiza em: <OUTROOT>/Antigravity/M{n} - {modulo}/{NN} - {titulo}.mp4

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const OUTROOT = 'C:\\Users\\canal\\Downloads\\aulas-masterclass';
const COURSE_MATCH = /antigravity/i;
const INCLUDE_MODULES = new Set([1, 2, 3, 4, 5, 6]); // M7/M8 já transcritos e no Drive — pulados
const CONCURRENCY = 4;
const YTDLP = path.join(__dirname, 'tools', 'yt-dlp.exe'); // baixa via HLS 1080p

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf8'));
const jobs = manifest
  .filter(x => x.hasVideo && COURSE_MATCH.test(x.course) && INCLUDE_MODULES.has(x.moduleNum))
  .map(x => {
    const modDir = `M${x.moduleNum} - ${x.moduleName}`;
    const file = `${String(x.lessonNum).padStart(2, '0')} - ${x.title}.mp4`;
    const dest = path.join(OUTROOT, 'Antigravity', modDir, file);
    return { ...x, dest };
  });

console.log(`Vou baixar ${jobs.length} vídeos para ${OUTROOT}\\Antigravity`);
console.log(`Concorrência: ${CONCURRENCY}\n`);

function curlDownload(job) {
  return new Promise((resolve) => {
    fs.mkdirSync(path.dirname(job.dest), { recursive: true });
    const label = `M${job.moduleNum}/${String(job.lessonNum).padStart(2, '0')} ${job.title}`;
    // yt-dlp via HLS, escolhendo a MAIOR resolução (1080p) e juntando em mp4
    const args = ['-S', 'res,br', '--no-overwrites', '--no-part',
      '--retries', '8', '--fragment-retries', '15', '-N', '4',
      '--merge-output-format', 'mp4', '--no-progress',
      '-o', job.dest, job.m3u8];
    const p = spawn(YTDLP, args);
    let err = '';
    p.stderr.on('data', d => { err += d.toString(); });
    p.on('close', (code) => {
      let sizeMB = 0;
      try { sizeMB = (fs.statSync(job.dest).size / 1048576); } catch {}
      if (code === 0 && sizeMB > 0.05) {
        console.log(`  ✅ ${label}  (${sizeMB.toFixed(1)} MB)`);
        resolve({ job, ok: true, sizeMB });
      } else {
        console.log(`  ❌ ${label}  (exit ${code}) ${err.split('\n').pop().slice(0, 80)}`);
        resolve({ job, ok: false, sizeMB });
      }
    });
  });
}

(async () => {
  const results = [];
  let idx = 0;
  async function worker() {
    while (idx < jobs.length) {
      const myIdx = idx++;
      results[myIdx] = await curlDownload(jobs[myIdx]);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const ok = results.filter(r => r.ok);
  const fail = results.filter(r => !r.ok);
  const totalMB = ok.reduce((s, r) => s + r.sizeMB, 0);
  fs.writeFileSync(path.join(__dirname, 'download-log.json'),
    JSON.stringify(results.map(r => ({ dest: r.job.dest, ok: r.ok, sizeMB: r.sizeMB, mp4: r.job.mp4 })), null, 2));

  console.log(`\n================ RESUMO ================`);
  console.log(`OK: ${ok.length}/${jobs.length}  |  Falhas: ${fail.length}  |  Total: ${(totalMB / 1024).toFixed(2)} GB`);
  if (fail.length) {
    console.log('Falhas:');
    fail.forEach(r => console.log('  -', r.job.dest));
  }
  process.exit(fail.length ? 1 : 0);
})();
