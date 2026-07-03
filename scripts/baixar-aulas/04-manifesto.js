// Passo 4 — MONTAR MANIFESTO
// Lê os JSONs dos cursos e gera o manifesto: curso -> módulo -> aula -> URL do mp4.
// Pula aulas sem vídeo gravado ([Em Breve] / locked).

const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, 'artifacts', 'api2');
const load = f => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8').replace(/^\/\/.*\n/, ''));

const COURSE_FILES = ['006.json', '007.json'];

function sanitize(s) {
  return (s || '').trim()
    .replace(/[\\/:*?"<>|]/g, '-')   // proibidos no Windows
    .replace(/\s+/g, ' ')
    .replace(/\s*\[Em Breve\]\s*/i, '')
    .trim();
}

const manifest = [];
const summary = [];

for (const f of COURSE_FILES) {
  const course = load(f).course;
  const courseName = sanitize(course.name);
  const modules = [...course.modules].sort((a, b) => a.order - b.order);
  let courseVideos = 0, courseTotal = 0;
  const modLines = [];

  modules.forEach((m, mi) => {
    const mNum = mi + 1; // M1, M2...
    const lessons = [...(m.lessons || [])].sort((a, b) => a.order - b.order);
    let withVideo = 0;
    lessons.forEach((L, li) => {
      courseTotal++;
      const v = L.video;
      const url = v && (v.download_link_full_url || v.stream_link_full_url);
      const hasVideo = !!(v && v.download_link_full_url && /\.mp4(\?|$)/i.test(v.download_link_full_url));
      if (hasVideo) { withVideo++; courseVideos++; }
      manifest.push({
        course: courseName,
        courseId: course.id,
        moduleNum: mNum,
        moduleName: sanitize(m.name),
        lessonNum: li + 1,
        lessonOrder: L.order,
        title: sanitize(L.title),
        ref: L.ref,
        hasVideo,
        mp4: hasVideo ? v.download_link_full_url : null,
        m3u8: v ? v.stream_link_full_url : null,
        videoName: v ? v.name : null,
        durationSec: v ? v.duration : null,
      });
    });
    modLines.push(`   M${mNum} · ${m.name.trim()} — ${withVideo}/${lessons.length} aulas com vídeo`);
  });

  summary.push(`\n📚 ${course.name}  (${course.id})\n   ${courseVideos} vídeos gravados / ${courseTotal} aulas no total\n${modLines.join('\n')}`);
}

fs.writeFileSync(path.join(__dirname, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(summary.join('\n'));
console.log('\n==> manifest.json salvo com', manifest.length, 'aulas (', manifest.filter(x => x.hasVideo).length, 'com vídeo ).');
