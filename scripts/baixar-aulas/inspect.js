// Inspeciona o schema dos JSONs de curso capturados.
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, 'artifacts', 'api2');

function load(f) {
  const s = fs.readFileSync(path.join(DIR, f), 'utf8');
  return JSON.parse(s.replace(/^\/\/.*\n/, ''));
}

function shape(v, depth = 0, maxDepth = 3) {
  const pad = '  '.repeat(depth);
  if (Array.isArray(v)) {
    let out = `Array(${v.length})`;
    if (v.length && depth < maxDepth) out += `\n${pad}  [0] ` + shape(v[0], depth + 1, maxDepth);
    return out;
  }
  if (v && typeof v === 'object') {
    const keys = Object.keys(v);
    if (depth >= maxDepth) return `{${keys.join(', ')}}`;
    return '{\n' + keys.map(k => `${pad}  ${k}: ` + shape(v[k], depth + 1, maxDepth)).join('\n') + `\n${pad}}`;
  }
  if (typeof v === 'string') return JSON.stringify(v.length > 70 ? v.slice(0, 70) + '…' : v);
  return JSON.stringify(v);
}

for (const f of ['002.json', '006.json']) {
  console.log('\n\n############## ' + f + ' ##############');
  const j = load(f);
  console.log(shape(j, 0, 4));
}
