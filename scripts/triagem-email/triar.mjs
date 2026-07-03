#!/usr/bin/env node
// AIOS — Triagem de e-mail em lote (bulk)
// Classifica (Haiku) + pesquisa a empresa das parcerias na web (Haiku :online) + rascunha (Sonnet 4.6),
// via OpenRouter, aplicando label e criando rascunho no Gmail pelo `gws` CLI.
//
// Modos:
//   node scripts/triagem-email/triar.mjs                      # processa novos (has:nouserlabels), aplica
//   node scripts/triagem-email/triar.mjs --dry-run --limit 6  # testa sem mexer no Gmail
//   node scripts/triagem-email/triar.mjs --recheck-parcerias  # reavalia as Propostas/Parcerias JÁ rotuladas
//                                                              #   e gera um RANKING de relevância (web)
// Flags: --days N (30) · --limit N · --classify-model · --draft-model · --research-model
//
// Idempotente (só pega threads sem label de usuário; re-rodar continua). Pesquisa de empresa = Google/web
// via OpenRouter :online (sinais de terceiros > marketing próprio). Nada é ENVIADO — rascunho é L2.

import { spawnSync } from 'node:child_process';
import { readFileSync, appendFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

// ---------- args ----------
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const DRY = has('--dry-run');
const RECHECK = has('--recheck-parcerias');
const RESPOND = has('--responder-naograndes');  // responde as parcerias de empresas NÃO-grandes (agenda cheia → voltar em N meses)
const FALTANTES = has('--rascunhos-faltantes'); // cria os rascunhos que faltam: grandes (interesse) + Importante/Curso/Reunião
const MESES = parseInt(val('--meses', '4'), 10);
const DAYS = parseInt(val('--days', '30'), 10);
const LIMIT = parseInt(val('--limit', '250'), 10);
const CLASSIFY_MODEL = val('--classify-model', process.env.TRIAGEM_CLASSIFY_MODEL || 'anthropic/claude-haiku-4.5');
const DRAFT_MODEL = val('--draft-model', process.env.TRIAGEM_DRAFT_MODEL || 'anthropic/claude-sonnet-4.6');
const RESEARCH_MODEL = val('--research-model', process.env.TRIAGEM_RESEARCH_MODEL || 'anthropic/claude-haiku-4.5:online');

// ---------- env ----------
const envText = readFileSync(resolve(ROOT, '.env'), 'utf8');
const OPENROUTER_API_KEY = (envText.match(/^OPENROUTER_API_KEY=(.+)$/m) || [])[1]?.trim();
if (!OPENROUTER_API_KEY) { console.error('Faltou OPENROUTER_API_KEY no .env'); process.exit(1); }
const ME = 'agenciasparo@gmail.com';

// ---------- labels reais do Enzo ----------
const LABELS = {
  'Importante':           { id: 'Label_1822373933227828650', draft: true },
  'Propostas/Parcerias':  { id: 'Label_6954570115436509362', draft: true },
  'Curso':                { id: 'Label_8095239955334782594', draft: true },
  'Reunião':              { id: 'Label_6400709588805680384', draft: true },
  'Médio':                { id: 'Label_3632722313834281694', draft: false },
  'Sem Importância':      { id: 'Label_8493917233294908215', draft: false },
};
const CATEGORIES = Object.keys(LABELS);
const VOZ = readFileSync(resolve(ROOT, 'references', 'voz-email.md'), 'utf8');

const LOG = 'C:/tmp/aios-triagem-email.log';
const OUT = 'C:/tmp/aios-triagem-email.json';
const RANK = 'C:/tmp/aios-parcerias-ranking.json';
const PROP = 'C:/tmp/aios-parcerias.json';        // por-proposta (alimenta a página do painel)
const log = (m) => { console.log(`${m}`); try { appendFileSync(LOG, `${m}\n`); } catch {} };

// ---------- gws (via Git Bash) ----------
function gws(parts) {
  const cmd = 'gws ' + parts.join(' ');
  const r = spawnSync('bash', ['-lc', cmd], { encoding: 'utf8', maxBuffer: 1 << 28 });
  const out = (r.stdout || '');
  const i = out.indexOf('{');
  if (i < 0) { if (r.status !== 0) throw new Error(`gws falhou: ${cmd}\n${r.stderr}`); return {}; }
  let obj; try { obj = JSON.parse(out.slice(i)); } catch { throw new Error(`JSON inválido do gws: ${cmd}\n${out.slice(0, 400)}`); }
  if (obj.error) throw new Error(`gws API erro: ${cmd}\n${JSON.stringify(obj.error).slice(0, 300)}`);  // não mascarar falha de escrita
  return obj;
}
const q = (obj) => `'${JSON.stringify(obj)}'`;

// ---------- helpers Gmail payload ----------
const b64urlDecode = (d) => Buffer.from((d || '').replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
const stripHtml = (h) => h.replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/[ \t]{2,}/g, ' ').trim();
function extractText(payload) {
  const walk = (p, mime) => {
    if (!p) return '';
    if (p.mimeType === mime && p.body?.data) return b64urlDecode(p.body.data);
    if (p.parts) for (const c of p.parts) { const t = walk(c, mime); if (t) return t; }
    return '';
  };
  let txt = walk(payload, 'text/plain');
  if (!txt) { const html = walk(payload, 'text/html'); if (html) txt = stripHtml(html); }
  return txt;
}
const header = (msg, name) => (msg.payload?.headers || []).find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';
const emailOf = (from) => (from.match(/<([^>]+)>/) || [, from.trim()])[1].trim();

// ---------- OpenRouter ----------
async function llm(model, system, user, maxTokens = 1200, temp = 0.3) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${OPENROUTER_API_KEY}`, 'Content-Type': 'application/json', 'X-Title': 'AIOS Triagem Email' },
        body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: temp, max_tokens: maxTokens }),
      });
      const j = await r.json();
      if (!r.ok || j.error) throw new Error(`OpenRouter ${r.status}: ${JSON.stringify(j.error || j).slice(0, 300)}`);
      return j.choices[0].message.content;
    } catch (e) { if (attempt === 2) throw e; await new Promise(s => setTimeout(s, 1500 * (attempt + 1))); }
  }
}
function parseJson(text) {
  const i = text.indexOf('{'), j = text.lastIndexOf('}');
  if (i < 0 || j < 0) throw new Error('sem JSON: ' + text.slice(0, 150));
  return JSON.parse(text.slice(i, j + 1));
}
// pool de concorrência (pra pesquisa web não ir 1 a 1)
async function mapPool(items, n, fn) {
  const out = new Array(items.length); let idx = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (idx < items.length) { const k = idx++; try { out[k] = await fn(items[k], k); } catch (e) { out[k] = { __err: String(e.message) }; } }
  }));
  return out;
}

// ---------- prompts ----------
const CLASSIFY_SYS = `Você classifica e-mails recebidos pelo Enzo Barbato — criador de YouTube que ensina automação/IA (Claude Code, Antigravity) e vende um curso (Masterclass). Audiência: leigos querendo aprender automação.

Escolha UMA categoria (nome EXATO):
- "Importante": ação pessoal/negócio — pagamento, comissão, problema de conta/acesso, jurídico, parceiro recorrente.
- "Propostas/Parcerias": patrocínio, colab paga, agência de IA/hosting, proposta de vídeo pago.
- "Curso": dúvida sobre a Masterclass — o que inclui, acesso, conteúdo, reembolso.
- "Reunião": agendar/confirmar reunião, recap de call, disponibilidade.
- "Médio": útil mas NÃO pede resposta — newsletter que ele segue, update de ferramenta, recibo.
- "Sem Importância": promo em massa, marketing irrelevante, notificação de rede social, ruído.

Regras:
- "isAutomation": true se no-reply/notificação automática/disparo em massa/merge tag quebrada ({$channelName})/rodapé de unsubscribe.
- "shouldDraft": true só se categoria Importante/Propostas/Parcerias/Curso/Reunião E for humano real esperando resposta.
- "brand": para Propostas/Parcerias, o NOME da empresa/marca/produto promovido (não a agência intermediária). Se houver VÁRIAS marcas, escolha SÓ a principal/mais conhecida (uma só). Senão "".
- "language": "pt" ou "en", espelhando o remetente.

Responda SÓ JSON: {"category","isAutomation","shouldDraft","brand","language","reason"} (reason ≤ 12 palavras).`;

const RESEARCH_SYS = `Você pesquisa na web se uma empresa/marca que propôs parceria ao Enzo (YouTuber de automação/IA; audiência quer aprender a CONSTRUIR com IA, código e automação) é RELEVANTE no mercado, pra ele priorizar relacionamento com empresas grandes.

REGRAS:
- Pese SINAIS DE TERCEIROS — aporte/funding, valuation, Crunchbase, notícias, Wikipedia, IPO, nº de usuários citado por imprensa. DESCONFIE de claims do site/marketing da própria empresa (não conte como prova).
- Avalie o FIT com a audiência: IA/código/automação/produtividade/dev tools = bom; videoclipe/música/fintech/beleza/dropshipping/genérico = fraco.
- "verdict": "grande" (marca conhecida E/OU bem financiada/relevante E bom fit) · "media" (real mas porte médio OU fit parcial) · "pequena" (obscura/sem rastro de terceiros OU claramente fora do nicho) · "desconhecida" (não achou nada).
- Se o e-mail citar VÁRIAS marcas, avalie a PRINCIPAL/mais conhecida.

Responda APENAS com o objeto JSON (nada antes nem depois): {"brand","verdict":"grande|media|pequena|desconhecida","fit":"bom|parcial|fraco","evidencia":"1 frase factual com número/fonte de terceiro","fonte":"url"}`;

const DRAFT_SYS = `Você escreve um RASCUNHO de resposta de e-mail NA VOZ do Enzo Barbato, seguindo o guia abaixo. Nunca envia — é rascunho pro Enzo revisar.

${VOZ}

Instruções:
- Espelhe o idioma do remetente.
- Propostas/Parcerias por "recommendation": "interesse" → demonstre interesse e PEÇA briefing (objetivos, orçamento, exclusividade/uso) antes de cravar valor; "recusa" → RECUSA cordial com a porta aberta (motivo é interno, não escreva no e-mail); "briefing" → peça educadamente qual é a marca/detalhes + briefing.
- Nunca invente número de valor. Curto, frases curtas, agradecendo primeiro, fechando com a assinatura "Enzo Barbatto".

Responda SÓ JSON: {"subject","body"} — subject já com "Re: ..." e body texto puro com \\n.`;

// recomendação DETERMINÍSTICA (conservadora): recusa SÓ se "pequena"; desconhecida/média → briefing (nunca recusa por engano)
function recommend(verdict, fit) {
  if (verdict === 'pequena') return 'recusa';
  if (verdict === 'grande' && fit !== 'fraco') return 'interesse';
  return 'briefing';
}
// rede de segurança: marcas de IA claramente relevantes — corrige erro de identidade (ex.: "Minimax" virar a empresa
// alemã de incêndio). Se a pesquisa rebaixou uma dessas pra pequena/desconhecida, sobe pra grande.
const BIG_AI = ['minimax', 'moonshot', 'kimi', 'manus', 'bytedance', 'trae', 'abacus', 'perplexity', 'mistral', 'genspark', 'pixverse', 'higgsfield', 'runway', 'elevenlabs', 'suno', 'stability', 'cohere', 'deepseek', 'qwen', 'zhipu', 'midjourney', 'virtuals', 'skywork'];
function applyKnown(g) {
  const k = (g.brand || '').toLowerCase();
  if (BIG_AI.some(b => k.includes(b)) && (g.verdict === 'pequena' || g.verdict === 'desconhecida')) {
    return { ...g, verdict: 'grande', fit: g.fit === 'fraco' ? 'parcial' : (g.fit || 'bom'), recommendation: 'interesse', evidencia: `${g.evidencia || ''} [corrigido: marca de IA reconhecida]`.trim() };
  }
  return g;
}
async function research(brandHint, emailCtx) {
  const txt = await llm(RESEARCH_MODEL, RESEARCH_SYS,
    `Marca/empresa: ${brandHint || '(descobrir pelo e-mail)'}\n\n--- trecho do e-mail ---\n${(emailCtx || '').slice(0, 1400)}`, 750, 0);
  let obj; try { obj = parseJson(txt); } catch { obj = { brand: brandHint || '?', verdict: 'desconhecida', fit: '?', evidencia: '(sem parse)', fonte: '' }; }
  if (!obj.brand) obj.brand = brandHint || '?';
  obj.recommendation = recommend(obj.verdict, obj.fit);
  return obj;
}
const verdictToCompany = (v) => ({ interesse: 'grande', recusa: 'pequena', briefing: 'indefinido' }[v] || 'indefinido');

// ---------- MIME ----------
function buildRaw({ to, subject, inReplyTo, body }) {
  const needsEnc = (s) => /[^\x00-\x7F]/.test(s);
  const encWord = (s) => `=?UTF-8?B?${Buffer.from(s, 'utf8').toString('base64')}?=`;
  const h = [`From: ${ME}`, `To: ${to}`, `Subject: ${needsEnc(subject) ? encWord(subject) : subject}`];
  if (inReplyTo) { h.push(`In-Reply-To: ${inReplyTo}`, `References: ${inReplyTo}`); }
  h.push('MIME-Version: 1.0', 'Content-Type: text/plain; charset="UTF-8"', 'Content-Transfer-Encoding: base64');
  const b64body = Buffer.from(body, 'utf8').toString('base64').replace(/(.{76})/g, '$1\r\n');
  const mime = h.join('\r\n') + '\r\n\r\n' + b64body + '\r\n';
  return Buffer.from(mime, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ---------- coletor de threads ----------
function listThreads(query) {
  let pageToken = '', ids = [];
  do {
    const params = { userId: 'me', q: query, maxResults: 100 };
    if (pageToken) params.pageToken = pageToken;
    const res = gws(['gmail', 'users', 'threads', 'list', '--params', q(params)]);
    (res.threads || []).forEach(t => ids.push(t.id));
    pageToken = res.nextPageToken || '';
  } while (pageToken && ids.length < LIMIT);
  return ids.slice(0, LIMIT);
}
function readThread(tid) {
  const thread = gws(['gmail', 'users', 'threads', 'get', '--params', q({ userId: 'me', id: tid, format: 'full' })]);
  const msgs = thread.messages || [];
  const incoming = [...msgs].reverse().find(m => emailOf(header(m, 'From')).toLowerCase() !== ME) || msgs[msgs.length - 1];
  return {
    msgs,
    from: header(incoming, 'From'), senderEmail: emailOf(header(incoming, 'From')),
    subject: header(incoming, 'Subject') || '(sem assunto)',
    msgId: header(incoming, 'Message-ID') || header(incoming, 'Message-Id'),
    dateMs: Number(incoming.internalDate) || (header(incoming, 'Date') ? Date.parse(header(incoming, 'Date')) : 0) || 0,
    body: (extractText(incoming.payload) || incoming.snippet || '').slice(0, 3500),
    userLabels: new Set([].concat(...msgs.map(m => m.labelIds || [])).filter(l => l.startsWith('Label_'))),
  };
}

// ============================================================
// MODO RECHECK — reavalia as Propostas/Parcerias já rotuladas e gera RANKING de relevância (web)
// ============================================================
async function runRecheck() {
  writeFileSync(LOG, '');
  log(`▶ RECHECK parcerias — últimos ${DAYS}d | research=${RESEARCH_MODEL}`);
  const ids = listThreads(`in:inbox newer_than:${DAYS}d label:"Propostas/Parcerias"`);
  log(`🤝 ${ids.length} threads de parceria pra reavaliar\n`);

  // 1) extrair marca (barato, sem web) de cada thread
  const items = [];
  for (let n = 0; n < ids.length; n++) {
    try {
      const t = readThread(ids[n]);
      let brand = '';
      try { brand = (parseJson(await llm(CLASSIFY_MODEL, 'Extraia o NOME da empresa/marca/produto promovido neste e-mail de proposta de parceria (NÃO a agência intermediária). Se houver VÁRIAS marcas, escolha SÓ a principal/mais conhecida (UMA). Responda só JSON {"brand"}.', `De: ${t.from}\nAssunto: ${t.subject}\n\n${t.body.slice(0, 1200)}`, 80, 0)).brand || '').trim(); } catch {}
      items.push({ tid: ids[n], from: t.senderEmail, subject: t.subject, body: t.body, brand: brand || t.senderEmail, date: t.dateMs });
      log(`· ${n + 1}/${ids.length} marca: ${brand || '(?)'}  — ${t.subject.slice(0, 50)}`);
    } catch (e) { log(`✗ ${n + 1}/${ids.length} ${String(e.message).slice(0, 80)}`); }
  }

  // 2) dedupe por marca → pesquisar cada marca única UMA vez (web, concorrência 4)
  const byBrand = new Map();
  const norm = (s) => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\b(ai|inc|labs|technologies|group|io|com)\b/g, '').replace(/\s+/g, ' ').trim();
  for (const it of items) { const k = norm(it.brand) || it.brand.toLowerCase(); if (!byBrand.has(k)) byBrand.set(k, { brand: it.brand, threads: [] }); byBrand.get(k).threads.push(it); }
  const uniq = [...byBrand.values()];
  log(`\n🔎 ${uniq.length} marcas únicas — pesquisando na web...\n`);
  const researched = (await mapPool(uniq, 4, async (g) => {
    const r = await research(g.brand, g.threads[0].body);
    log(`   [${(r.verdict || '?').padEnd(11)}] ${g.brand}  (${g.threads.length}x)  — ${(r.evidencia || '').slice(0, 70)}`);
    return { ...g, ...r };
  })).map(applyKnown);   // rede de segurança p/ marcas de IA conhecidas

  // 3) ranking
  const order = { grande: 0, media: 1, desconhecida: 2, pequena: 3 };
  researched.sort((a, b) => (order[a.verdict] ?? 9) - (order[b.verdict] ?? 9) || b.threads.length - a.threads.length);
  writeFileSync(RANK, JSON.stringify({ days: DAYS, when: new Date().toISOString(), brands: researched.map(r => ({ brand: r.brand, verdict: r.verdict, fit: r.fit, recommendation: r.recommendation, evidencia: r.evidencia, fonte: r.fonte, threads: r.threads.length, exemplos: r.threads.slice(0, 3).map(t => t.from) })) }, null, 2));
  log(`\n──────── RANKING DE PARCERIAS (relevância) ────────`);
  const tally = { grande: 0, media: 0, desconhecida: 0, pequena: 0 };
  for (const r of researched) { tally[r.verdict] = (tally[r.verdict] || 0) + 1; log(`  [${(r.verdict || '?').toUpperCase().padEnd(11)}] fit:${(r.fit || '?').padEnd(7)} ${String(r.threads.length).padStart(2)}x  ${r.brand}\n        → ${r.recommendation} | ${(r.evidencia || '').slice(0, 90)} | ${r.fonte || ''}`); }
  log(`\n  grandes: ${tally.grande} · médias: ${tally.media} · desconhecidas: ${tally.desconhecida} · pequenas: ${tally.pequena}`);

  // 4) arquivo POR-PROPOSTA (alimenta a página /parcerias do painel): cada thread com data + relevância
  const proposals = [];
  for (const g of researched) {
    if (/\bsparo\b/i.test(g.brand)) continue;  // própria empresa do Enzo — não é proposta recebida
    for (const t of g.threads) proposals.push({
      threadId: t.tid, dateMs: t.date || 0, dateISO: t.date ? new Date(t.date).toISOString() : '',
      from: t.from, subject: t.subject, brand: g.brand,
      verdict: g.verdict, fit: g.fit, recommendation: g.recommendation, evidencia: g.evidencia || '', fonte: g.fonte || '',
    });
  }
  proposals.sort((a, b) => b.dateMs - a.dateMs);  // padrão: cronológico (recente → antigo)
  const pc = { grande: 0, media: 0, desconhecida: 0, pequena: 0 };
  proposals.forEach(p => { pc[p.verdict] = (pc[p.verdict] || 0) + 1; });
  writeFileSync(PROP, JSON.stringify({ generatedAt: new Date().toISOString(), days: DAYS, total: proposals.length, counts: pc, proposals }, null, 2));
  log(`  ranking: ${RANK}\n  página:  ${PROP} (${proposals.length} propostas)`);
}

// ============================================================
// MODO PADRÃO — categoriza novos + rascunha (parceria com pesquisa web)
// ============================================================
async function runTriage() {
  writeFileSync(LOG, '');
  log(`▶ Triagem em lote — ${DRY ? 'DRY-RUN' : 'APLICANDO'} | ${DAYS}d | classify=${CLASSIFY_MODEL} research=${RESEARCH_MODEL} draft=${DRAFT_MODEL}`);
  const ids = listThreads(`in:inbox newer_than:${DAYS}d has:nouserlabels`);
  log(`📥 ${ids.length} threads sem categoria\n`);

  const report = [], counts = Object.fromEntries(CATEGORIES.map(c => [c, 0])), seen = new Set();
  let drafted = 0, skippedAuto = 0, errors = 0, dups = 0;

  for (let n = 0; n < ids.length; n++) {
    const tid = ids[n];
    try {
      const t = readThread(tid);
      if ([...t.userLabels].some(l => Object.values(LABELS).some(v => v.id === l))) { log(`· ${n + 1}/${ids.length} já categorizada`); continue; }

      const cls = parseJson(await llm(CLASSIFY_MODEL, CLASSIFY_SYS, `De: ${t.from}\nAssunto: ${t.subject}\n\n${t.body}`, 300, 0.2));
      const category = CATEGORIES.includes(cls.category) ? cls.category : 'Sem Importância';
      const labelId = LABELS[category].id;
      if (!DRY) gws(['gmail', 'users', 'threads', 'modify', '--params', q({ userId: 'me', id: tid }), '--json', q({ addLabelIds: [labelId] })]);
      counts[category]++; if (cls.isAutomation) skippedAuto++;

      const dupKey = `${t.senderEmail.toLowerCase()}|${t.subject.toLowerCase().replace(/[\s\W]+/g, ' ').trim().slice(0, 45)}`;
      const isDup = seen.has(dupKey); seen.add(dupKey); if (isDup) dups++;
      const wantsDraft = LABELS[category].draft && cls.shouldDraft && !cls.isAutomation && !isDup;

      let rec = {};
      if (wantsDraft && category === 'Propostas/Parcerias') {
        rec = await research(cls.brand, t.body);   // pesquisa web da empresa
      }
      if (wantsDraft) {
        const companyVerdict = category === 'Propostas/Parcerias' ? verdictToCompany(rec.recommendation) : '';
        const dr = parseJson(await llm(DRAFT_MODEL, DRAFT_SYS,
          `Categoria: ${category}\nrecommendation: ${rec.recommendation || ''}\ncompanyVerdict: ${companyVerdict}\nMarca: ${rec.brand || cls.brand || ''}\nIdioma: ${cls.language || 'pt'}\n\n--- E-mail recebido ---\nDe: ${t.from}\nAssunto: ${t.subject}\n\n${t.body}`, 1500, 0.4));
        if (!DRY) gws(['gmail', 'users', 'drafts', 'create', '--params', q({ userId: 'me' }), '--json', q({ message: { threadId: tid, raw: buildRaw({ to: t.senderEmail, subject: dr.subject || `Re: ${t.subject}`, inReplyTo: t.msgId, body: dr.body }) } })]);
        drafted++;
        report.push({ tid, from: t.senderEmail, subject: t.subject, category, brand: rec.brand || cls.brand || '', verdict: rec.verdict || '', recommendation: rec.recommendation || '', evidencia: rec.evidencia || '', fonte: rec.fonte || '', drafted: true });
        log(`${n + 1}/${ids.length}  ✍️ [${category}]${rec.verdict ? ` {${rec.verdict}→${rec.recommendation}}` : ''}  ${t.senderEmail} — ${t.subject.slice(0, 55)}`);
      } else {
        report.push({ tid, from: t.senderEmail, subject: t.subject, category, drafted: false, reason: isDup ? 'duplicado' : (cls.reason || '') });
        log(`${n + 1}/${ids.length}  ${isDup ? '🔁' : '🏷️ '} [${category}]  ${t.senderEmail} — ${t.subject.slice(0, 55)}`);
      }
    } catch (e) { errors++; log(`✗ ${n + 1}/${ids.length} ${String(e.message).slice(0, 150)}`); report.push({ tid, error: String(e.message).slice(0, 200) }); }
  }

  writeFileSync(OUT, JSON.stringify({ when: new Date().toISOString(), dry: DRY, counts, drafted, dups, skippedAuto, errors, report }, null, 2));
  log(`\n──────── RESUMO ${DRY ? '(DRY-RUN)' : ''} ────────`);
  for (const c of CATEGORIES) log(`  ${c.padEnd(20)} ${counts[c]}`);
  log(`  rascunhos: ${drafted} · duplicados: ${dups} · automação: ${skippedAuto} · erros: ${errors}`);
  log(`  detalhe: ${OUT}`);
}

// ============================================================
// MODO RESPONDER NÃO-GRANDES — pras parcerias de empresas que NÃO são grandes/relevantes:
// rascunho "agradeço, mas agenda de parcerias cheia agora — me chame de novo em <mês +N>".
// Atualiza o rascunho existente da thread no lugar (não cria um segundo).
// ============================================================
async function runResponder() {
  writeFileSync(LOG, '');
  const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + MESES);
  const PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const MONTH_PT = `${PT[d.getMonth()]} de ${d.getFullYear()}`, MONTH_EN = `${EN[d.getMonth()]} ${d.getFullYear()}`;
  const SYS = `Você escreve um RASCUNHO de resposta NA VOZ do Enzo Barbato pra uma proposta de PARCERIA de uma empresa que, neste momento, ele NÃO vai fechar. Tom: cordial, grato, porta aberta. Nunca envia — é rascunho.

${VOZ}

Conteúdo OBRIGATÓRIO (adapte à voz, não cole literal):
1) Agradece o contato e o interesse na parceria.
2) Diz que no momento a agenda de parcerias está cheia e por isso não consegue encaixar agora.
3) Pede pra entrarem em contato de novo em ${MONTH_PT} (se o e-mail estiver em inglês: ${MONTH_EN}) — cite o MÊS específico.
4) Fecha cordial, deixando claro que terá prazer em conversar mais pra frente.

Regras: espelhe o idioma do remetente (PT→PT, EN→EN). Use o primeiro nome se der pra identificar. Frases curtas, assinatura "Enzo Barbatto". Não invente valores nem promessas.
Responda SÓ JSON: {"subject","body"} — subject com "Re: ...", body texto puro com \\n.`;

  log(`▶ Responder parcerias NÃO-grandes — "agenda cheia → voltar em ${MONTH_PT}" | ${DRY ? 'DRY-RUN' : 'APLICANDO'} | draft=${DRAFT_MODEL}`);
  const data = JSON.parse(readFileSync(PROP, 'utf8'));
  let alvos = (data.proposals || []).filter(p => p.verdict !== 'grande');
  const seen = new Set();
  alvos = alvos.filter(p => { const k = `${(p.from || '').toLowerCase()}|${(p.subject || '').toLowerCase().replace(/[\s\W]+/g, ' ').trim().slice(0, 45)}`; if (seen.has(k)) return false; seen.add(k); return true; });
  alvos = alvos.slice(0, LIMIT);
  log(`🎯 ${alvos.length} propostas (média/desconhecida/pequena, sem duplicados) pra responder\n`);

  // mapa threadId -> draftId (pra atualizar o rascunho existente no lugar)
  const draftMap = {}; let pageToken = '';
  do {
    const params = { userId: 'me', maxResults: 100 }; if (pageToken) params.pageToken = pageToken;
    const r = gws(['gmail', 'users', 'drafts', 'list', '--params', q(params)]);
    (r.drafts || []).forEach(dr => { if (dr.message?.threadId && !draftMap[dr.message.threadId]) draftMap[dr.message.threadId] = dr.id; });
    pageToken = r.nextPageToken || '';
  } while (pageToken);

  let feitos = 0, criados = 0, atualizados = 0, errors = 0;
  const report = [];
  for (let n = 0; n < alvos.length; n++) {
    const p = alvos[n];
    try {
      const t = readThread(p.threadId);
      const dr = parseJson(await llm(DRAFT_MODEL, SYS, `--- E-mail recebido ---\nDe: ${t.from}\nAssunto: ${t.subject}\n\n${t.body}`, 900, 0.4));
      const raw = buildRaw({ to: t.senderEmail, subject: dr.subject || `Re: ${t.subject}`, inReplyTo: t.msgId, body: dr.body });
      const tem = draftMap[p.threadId];
      if (!DRY) {
        if (tem) { gws(['gmail', 'users', 'drafts', 'update', '--params', q({ userId: 'me', id: tem }), '--json', q({ message: { threadId: p.threadId, raw } })]); atualizados++; }
        else { gws(['gmail', 'users', 'drafts', 'create', '--params', q({ userId: 'me' }), '--json', q({ message: { threadId: p.threadId, raw } })]); criados++; }
      }
      feitos++;
      report.push({ threadId: p.threadId, from: t.senderEmail, subject: t.subject, verdict: p.verdict, brand: p.brand, acao: tem ? 'atualizado' : 'novo', assunto: dr.subject, corpo: dr.body });
      log(`${n + 1}/${alvos.length}  ${tem ? '♻️ atualiza' : '✍️ novo'}  [${p.verdict}]  ${t.senderEmail} — ${(t.subject || '').slice(0, 50)}`);
    } catch (e) { errors++; log(`✗ ${n + 1}/${alvos.length} ${String(e.message).slice(0, 120)}`); }
  }
  writeFileSync('C:/tmp/aios-parcerias-naograndes.json', JSON.stringify({ when: new Date().toISOString(), mes_alvo: MONTH_PT, dry: DRY, feitos, atualizados, criados, errors, report }, null, 2));
  log(`\n──────── RESUMO ${DRY ? '(DRY-RUN)' : ''} ────────`);
  log(`  respondidas: ${feitos} (atualizadas: ${atualizados} · novas: ${criados}) · erros: ${errors}`);
  log(`  política: agenda cheia → pedir retorno em ${MONTH_PT}`);
}

// ============================================================
// MODO RASCUNHOS FALTANTES — cria os drafts que o bug do `create` (sem userId) deixou de fora:
// (A) parcerias GRANDES → interesse/briefing (uma por marca, na thread mais recente);
// (B) Importante / Curso / Reunião → resposta na voz (pulando automação/no-reply e quem já tem rascunho).
// ============================================================
async function runFaltantes() {
  writeFileSync(LOG, '');
  log(`▶ Rascunhos faltantes — grandes + Importante/Curso/Reunião | ${DRY ? 'DRY-RUN' : 'APLICANDO'} | draft=${DRAFT_MODEL}`);

  // mapa threadId -> draftId (pra NÃO duplicar quem já tem rascunho)
  const draftMap = {}; let pageToken = '';
  do {
    const params = { userId: 'me', maxResults: 100 }; if (pageToken) params.pageToken = pageToken;
    const r = gws(['gmail', 'users', 'drafts', 'list', '--params', q(params)]);
    (r.drafts || []).forEach(dr => { if (dr.message?.threadId && !draftMap[dr.message.threadId]) draftMap[dr.message.threadId] = dr.id; });
    pageToken = r.nextPageToken || '';
  } while (pageToken);

  let criados = 0, pulados = 0, errors = 0;
  const seen = new Set();
  async function fazDraft(tid, category, opts = {}) {
    if (draftMap[tid]) return 'ja-tem';
    const t = readThread(tid);
    const key = `${t.senderEmail.toLowerCase()}|${(t.subject || '').toLowerCase().replace(/[\s\W]+/g, ' ').trim().slice(0, 45)}`;
    if (seen.has(key)) return 'dup'; seen.add(key);
    let language = opts.language || 'pt';
    if (!opts.skipCheck) {  // Importante/Curso/Reunião: filtra automação/no-reply
      const cls = parseJson(await llm(CLASSIFY_MODEL, CLASSIFY_SYS, `De: ${t.from}\nAssunto: ${t.subject}\n\n${t.body}`, 300, 0.2));
      if (cls.isAutomation || !cls.shouldDraft) return 'auto';
      language = cls.language || language;
    }
    const dr = parseJson(await llm(DRAFT_MODEL, DRAFT_SYS,
      `Categoria: ${category}\nrecommendation: ${opts.recommendation || ''}\ncompanyVerdict: ${opts.companyVerdict || ''}\nMarca: ${opts.brand || ''}\nIdioma: ${language}\n\n--- E-mail recebido ---\nDe: ${t.from}\nAssunto: ${t.subject}\n\n${t.body}`, 1500, 0.4));
    if (!DRY) gws(['gmail', 'users', 'drafts', 'create', '--params', q({ userId: 'me' }), '--json', q({ message: { threadId: tid, raw: buildRaw({ to: t.senderEmail, subject: dr.subject || `Re: ${t.subject}`, inReplyTo: t.msgId, body: dr.body }) } })]);
    return `criado:${t.senderEmail}`;
  }

  // (A) GRANDES — uma por marca, na thread mais recente
  const data = JSON.parse(readFileSync(PROP, 'utf8'));
  const byBrand = new Map();
  for (const p of (data.proposals || []).filter(p => p.verdict === 'grande')) {
    const k = (p.brand || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cur = byBrand.get(k); if (!cur || (p.dateMs || 0) > (cur.dateMs || 0)) byBrand.set(k, p);
  }
  const grandes = [...byBrand.values()];
  log(`\n[A] ${grandes.length} marcas grandes (interesse/briefing)`);
  for (const p of grandes) {
    try {
      const r = await fazDraft(p.threadId, 'Propostas/Parcerias', { skipCheck: true, companyVerdict: 'grande', recommendation: p.recommendation || 'interesse', brand: p.brand });
      if (r.startsWith('criado')) { criados++; log(`  ✍️ ${p.brand} — ${p.from}`); } else { pulados++; log(`  · (${r}) ${p.brand}`); }
    } catch (e) { errors++; log(`  ✗ ${p.brand}: ${String(e.message).slice(0, 90)}`); }
  }

  // (B) Importante / Curso / Reunião
  for (const cat of ['Importante', 'Curso', 'Reunião']) {
    const ids = listThreads(`in:inbox newer_than:${DAYS}d label:"${cat}"`);
    log(`\n[B] ${cat}: ${ids.length} threads`);
    for (const tid of ids) {
      try {
        const r = await fazDraft(tid, cat, {});
        if (r.startsWith('criado')) { criados++; log(`  ✍️ [${cat}] ${r.slice(7)}`); } else pulados++;
      } catch (e) { errors++; log(`  ✗ [${cat}] ${String(e.message).slice(0, 90)}`); }
    }
  }

  log(`\n──────── RESUMO ${DRY ? '(DRY-RUN)' : ''} ────────`);
  log(`  rascunhos criados: ${criados} · pulados (já-tem/auto/dup): ${pulados} · erros: ${errors}`);
}

(FALTANTES ? runFaltantes() : RESPOND ? runResponder() : RECHECK ? runRecheck() : runTriage()).catch(e => { console.error(e); process.exit(1); });
