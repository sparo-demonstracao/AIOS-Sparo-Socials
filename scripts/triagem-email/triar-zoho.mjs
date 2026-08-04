#!/usr/bin/env node
// AIOS — Triagem da caixa de ATENDIMENTO (Zoho Mail — atendimento@sparo.com.br)
// Mesma lógica da triagem do Gmail (triar.mjs), mas na caixa de atendimento e sobre a API REST do Zoho:
//   classifica (Haiku via OpenRouter) → aplica a TAG certa (PUT /updatemessage) →
//   rascunha resposta na VOZ DE ATENDIMENTO/EQUIPE (POST /messages mode:draft), exceto Médio/Sem Importância.
// O rascunho é VINCULADO À THREAD do e-mail original: busca o Message-ID RFC via GET .../header?raw=false
// e manda inReplyTo + refHeader no save-draft — assim ele aparece na conversa da Inbox, não só em Rascunhos.
// Se a busca do header falhar, cai no comportamento antigo (rascunho solto) sem quebrar a triagem.
// Voz: references/voz-atendimento.md. Parceria NÃO passa por pesquisa web — o rascunho só agradece e
// avisa que repassou pro Enzo (decisão dele). L2 — NADA é enviado; só aplica tag e cria rascunho.
//
// Escopos Zoho necessários (regerar o Self Client com estes — ver references/zoho-mail-api.md):
//   ZohoMail.accounts.READ, ZohoMail.messages.READ, ZohoMail.tags.READ,
//   ZohoMail.messages.UPDATE, ZohoMail.messages.CREATE
//
// Modos:
//   node scripts/triagem-email/triar-zoho.mjs --dry-run --limit 8   # testa: classifica + monta, NÃO mexe no Zoho
//   node scripts/triagem-email/triar-zoho.mjs --days 7              # aplica tag + rascunha o que ainda não foi visto
// Flags: --days N (7) · --limit N (100) · --classify-model · --draft-model
// Idempotente: guarda os messageId já processados em C:/tmp/aios-triagem-zoho-seen.json (re-rodar pula esses).

import { readFileSync, appendFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

// ---------- args ----------
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const DRY = has('--dry-run');
const DAYS = parseInt(val('--days', '7'), 10);
const LIMIT = parseInt(val('--limit', '100'), 10);
const CLASSIFY_MODEL = val('--classify-model', process.env.TRIAGEM_CLASSIFY_MODEL || 'anthropic/claude-haiku-4.5');
const DRAFT_MODEL = val('--draft-model', process.env.TRIAGEM_DRAFT_MODEL || 'anthropic/claude-sonnet-4.6');

// ---------- env ----------
const envText = readFileSync(resolve(ROOT, '.env'), 'utf8');
const env = (k) => (envText.match(new RegExp(`^${k}=(.+)$`, 'm')) || [])[1]?.trim();
const OPENROUTER_API_KEY = env('OPENROUTER_API_KEY');
const Z = {
  clientId: env('ZOHO_CLIENT_ID'),
  clientSecret: env('ZOHO_CLIENT_SECRET'),
  refresh: env('ZOHO_REFRESH_TOKEN'),
  accountId: env('ZOHO_ACCOUNT_ID') || '',
  folderId: env('ZOHO_FOLDER_ID') || '',
  acctHost: env('ZOHO_ACCOUNTS_HOST') || 'https://accounts.zoho.com',
  apiHost: env('ZOHO_API_HOST') || 'https://mail.zoho.com',
};
if (!OPENROUTER_API_KEY) { console.error('Faltou OPENROUTER_API_KEY no .env'); process.exit(1); }
if (!Z.clientId || !Z.clientSecret || !Z.refresh) { console.error('Faltam chaves ZOHO_* no .env'); process.exit(1); }

const VOZ = readFileSync(resolve(ROOT, 'references', 'voz-atendimento.md'), 'utf8');

const LOG = 'C:/tmp/aios-triagem-zoho.log';
const OUT = 'C:/tmp/aios-triagem-zoho.json';
const SEEN = 'C:/tmp/aios-triagem-zoho-seen.json';
const log = (m) => { console.log(`${m}`); try { appendFileSync(LOG, `${m}\n`); } catch {} };

// ---------- categorias (mapeadas para o NOME da tag no Zoho) ----------
// A tag no Zoho é casada pelo displayName (sem acento/caixa). O ID é descoberto em runtime via /labels.
const CATEGORIES = {
  'Importante':          { tag: 'Importante',            draft: true },
  'Propostas/Parcerias': { tag: 'Propostas e Parcerias', draft: true },
  'Curso':               { tag: 'Curso',                 draft: true },
  'Reunião':             { tag: 'Reunião',               draft: true },
  'Médio':               { tag: 'Médio',                 draft: false },
  'Sem Importância':     { tag: 'Sem Importância',       draft: false },
};
const CAT_NAMES = Object.keys(CATEGORIES);
const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, ' ').trim();

// ---------- OpenRouter ----------
async function llm(model, system, user, maxTokens = 800, temp = 0.3) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${OPENROUTER_API_KEY}`, 'Content-Type': 'application/json', 'X-Title': 'AIOS Triagem Zoho' },
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

// ---------- Zoho REST ----------
let ACCESS = '';
async function getAccessToken() {
  const body = `refresh_token=${encodeURIComponent(Z.refresh)}&client_id=${encodeURIComponent(Z.clientId)}&client_secret=${encodeURIComponent(Z.clientSecret)}&grant_type=refresh_token`;
  const r = await fetch(`${Z.acctHost}/oauth/v2/token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  const j = await r.json();
  if (!j.access_token) throw new Error(`Zoho token: ${JSON.stringify(j).slice(0, 200)}`);
  return j.access_token;
}
// body: undefined | objeto (JSON.stringify) | string (JSON já pronto, p/ preservar precisão de IDs long)
async function zoho(method, path, body) {
  const opts = { method, headers: { 'Authorization': `Zoho-oauthtoken ${ACCESS}`, 'Accept': 'application/json' } };
  if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = typeof body === 'string' ? body : JSON.stringify(body); }
  const r = await fetch(`${Z.apiHost}${path}`, opts);
  const txt = await r.text();
  let j; try { j = txt ? JSON.parse(txt) : {}; } catch { j = { raw: txt }; }
  const code = j?.status?.code;
  if (!r.ok || (code && code !== 200)) throw new Error(`Zoho ${method} ${path} → ${r.status} ${JSON.stringify(j?.status || j).slice(0, 220)}`);
  return j;
}

// Pasta Rascunhos do Zoho (conta atendimento@) — um rascunho NÃO é resposta enviada, então é ignorado
// ao decidir "essa conversa já foi respondida?". Override por .env se trocar de conta. Ver zoho-mail-api.md.
const DRAFTS_FOLDER = env('ZOHO_DRAFTS_FOLDER_ID') || '8159880000000008016';
const MINE_RX = /@sparo\.com\.br/i;   // e-mail nosso (a caixa é atendimento@sparo.com.br)

// Conversa INTEIRA por threadId (Inbox + Enviados juntos, cross-folder). Monta um transcript cronológico
// (Cliente vs. Nós) pra o rascunho entender o contexto de TODA a troca — não só o último e-mail —, e diz se
// a conversa JÁ foi respondida (última mensagem, ignorando rascunho, saiu de um endereço nosso).
async function threadContext(accountId, threadId) {
  if (!threadId) return { transcript: '', alreadyReplied: false, count: 0 };
  try {
    const conv = await zoho('GET', `/api/accounts/${accountId}/messages/view?threadId=${threadId}&limit=50&status=all`);
    let msgs = (conv.data || []).filter(x => String(x.folderId) !== DRAFTS_FOLDER);
    msgs.sort((a, b) => (Number(a.receivedTime) || 0) - (Number(b.receivedTime) || 0));
    if (!msgs.length) return { transcript: '', alreadyReplied: false, count: 0 };
    const last = msgs[msgs.length - 1];
    const alreadyReplied = MINE_RX.test(last.fromAddress || '');
    // já respondida: o chamador vai pular o rascunho, então nem busca o corpo (economiza chamadas)
    if (alreadyReplied) return { transcript: '', alreadyReplied: true, count: msgs.length };
    // busca o corpo de cada mensagem da conversa (thread costuma ser curto; cap nas 8 mais recentes)
    const recent = msgs.slice(-8);
    const parts = [];
    for (const mm of recent) {
      const fid = String(mm.folderId || '');
      let body = '';
      try {
        const c = await zoho('GET', `/api/accounts/${accountId}/folders/${fid}/messages/${String(mm.messageId)}/content`);
        body = stripHtml(c?.data?.content || c?.data || '');
      } catch { body = ''; }
      if (!body) body = mm.summary || '';
      const mine = MINE_RX.test(mm.fromAddress || '');
      const who = mine ? 'NÓS (Equipe Sparo)' : `CLIENTE <${emailOf(mm.fromAddress || '')}>`;
      parts.push(`>>> ${who} — "${(mm.subject || '').slice(0, 80)}"\n${body.slice(0, 1500)}`);
    }
    return { transcript: parts.join('\n\n'), alreadyReplied, count: msgs.length };
  } catch { return { transcript: '', alreadyReplied: false, count: 0 }; }
}

// Message-ID RFC + References do e-mail original (p/ vincular o rascunho à thread).
// raw=false devolve headerContent como objeto { Nome-Do-Header: [valores] }; nomes variam de caixa, então casa case-insensitive.
async function rfcHeaders(accountId, folderId, mid) {
  try {
    const h = await zoho('GET', `/api/accounts/${accountId}/folders/${folderId}/messages/${mid}/header?raw=false`);
    const hc = h?.data?.headerContent || {};
    const get = (name) => {
      const k = Object.keys(hc).find(x => x.toLowerCase() === name);
      const v = k ? hc[k] : '';
      return (Array.isArray(v) ? v[0] : v || '').replace(/\s+/g, ' ').trim();
    };
    return { rfcId: get('message-id'), references: get('references') };
  } catch { return { rfcId: '', references: '' }; }
}

// ---------- HTML → texto / texto → HTML ----------
const stripHtml = (h) => (h || '').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
  .replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
const escHtml = (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const toHtml = (s) => escHtml(s).replace(/\n/g, '<br>\n');
const emailOf = (from) => ((from || '').match(/<([^>]+)>/) || [, (from || '').trim()])[1].trim();

// ---------- prompts ----------
const CLASSIFY_SYS = `Você classifica e-mails que chegam na caixa de ATENDIMENTO da Sparo (atendimento@sparo.com.br). A Sparo é do Enzo Barbato — criador de YouTube que ensina automação/IA (Claude Code, Antigravity) e vende um curso (Masterclass); também tem a agência Sparo Automações. Audiência: leigos querendo aprender/usar automação.

Escolha UMA categoria (nome EXATO):
- "Importante": ação de negócio/conta — pagamento, comissão, problema de acesso/conta, jurídico, fornecedor/parceiro recorrente.
- "Propostas/Parcerias": patrocínio, colab paga, agência/hosting, proposta de vídeo pago, "quero fechar parceria".
- "Curso": dúvida sobre a Masterclass — o que inclui, acesso, conteúdo, reembolso, suporte ao aluno. PEDIDO de reembolso feito por um ALUNO REAL entra aqui.
- "Reunião": agendar/confirmar reunião, recap de call, disponibilidade, "podemos marcar?".
- "Médio": útil mas NÃO pede resposta — newsletter, update de ferramenta, recibo, aviso. NOTIFICAÇÃO AUTOMÁTICA de reembolso (ex.: Kiwify naoresponder@ "Reembolso da venda ...") entra aqui.
- "Sem Importância": promo em massa, marketing irrelevante, notificação de rede social, ruído.

Campos:
- "isAutomation": true se no-reply/notificação automática/disparo em massa/merge tag quebrada/rodapé de unsubscribe.
- "isRefundRequest": true SÓ se for uma PESSOA REAL (não automação) pedindo reembolso/cancelamento da compra da Masterclass. Notificação automática de reembolso → false.
- "shouldDraft": true só se categoria Importante/Propostas/Parcerias/Curso/Reunião E for uma pessoa real esperando resposta.
- "needsEnzo": true se o assunto precisa da decisão ou ação PESSOAL do Enzo (parceria/patrocínio, comercial, imprensa, jurídico, ou pede falar com ele, ou a equipe não resolve sozinha). Propostas/Parcerias → sempre true. Dúvida rotineira de curso (inclusive pedido de reembolso de aluno) que o atendimento resolve → false.
- "language": "pt" ou "en", espelhando o remetente.

Responda SÓ JSON: {"category","isAutomation","isRefundRequest","shouldDraft","needsEnzo","language","reason"} (reason ≤ 12 palavras).`;

const DRAFT_SYS = `Você escreve um RASCUNHO de resposta de e-mail na VOZ DA EQUIPE DE ATENDIMENTO DA SPARO (não a voz pessoal do Enzo), seguindo o guia abaixo. Nunca envia — é rascunho pra revisar.

${VOZ}

Instruções:
- Você pode receber a CONVERSA INTEIRA (vários e-mails, do mais antigo pro mais novo, marcados ">>> CLIENTE" e ">>> NÓS"). LEIA tudo e entenda o contexto geral do que a pessoa pede — não responda só o último e-mail isolado. Responda ao ÚLTIMO e-mail do cliente levando em conta todo o histórico (o que já foi pedido, o que já respondemos, o que ficou pendente). Não repita o que já dissemos.
- Espelhe o idioma do remetente (PT→PT, EN→EN).
- Se "isRefundRequest" for true (aluno pedindo reembolso): SIGA ESTE ROTEIRO — (1) agradeça sempre o contato; (2) peça o e-mail que a pessoa usou pra COMPRAR a Masterclass (é a informação que precisamos pra localizar o pedido); (3) pergunte, com cuidado e de forma acolhedora, o MOTIVO do reembolso ("pra gente entender melhor o que aconteceu e ver se consegue te ajudar de outra forma"). NÃO processe o reembolso, NÃO prometa prazo, NÃO negue. Nunca escreva que o objetivo é reduzir reembolso — isso é interno.
- Se "needsEnzo" for true: NÃO decida/negocie nada. Agradeça, diga com transparência que já repassou a mensagem pro Enzo e que ele retorna pessoalmente, e feche cordial. (Parcerias/propostas caem sempre aqui.)
- Se "needsEnzo" for false (ex.: dúvida de curso): responda como equipe, resolvendo o que dá. Se faltar um dado (valor, política, prazo), deixe um [ ] e diga que confirma e retorna.
- Nunca invente número, data ou política. Frases curtas, agradecendo primeiro. Assine "Equipe Sparo" (EN: "Sparo Team").

Responda SÓ JSON: {"subject","body"} — subject já com "Re: ..." e body texto puro com \\n (sem HTML).`;

// ---------- seen (idempotência) ----------
function loadSeen() { try { return new Set(JSON.parse(readFileSync(SEEN, 'utf8'))); } catch { return new Set(); } }
function saveSeen(set) { try { writeFileSync(SEEN, JSON.stringify([...set], null, 0)); } catch {} }

// ============================================================
async function run() {
  writeFileSync(LOG, '');
  log(`▶ Triagem Zoho (atendimento) — ${DRY ? 'DRY-RUN' : 'APLICANDO'} | ${DAYS}d | classify=${CLASSIFY_MODEL} draft=${DRAFT_MODEL}`);

  ACCESS = await getAccessToken();

  // conta + endereço "from" (pro rascunho)
  const accs = await zoho('GET', '/api/accounts');
  const acc = (accs.data || []).find(a => String(a.accountId) === String(Z.accountId)) || (accs.data || [])[0];
  if (!acc) throw new Error('Nenhuma conta Zoho retornada.');
  const accountId = String(acc.accountId);
  const FROM = acc.primaryEmailAddress || 'atendimento@sparo.com.br';
  log(`📬 Conta: ${FROM} (accountId ${accountId})`);

  // tags do usuário → mapa categoria → labelId (casado por displayName normalizado)
  const labels = (await zoho('GET', `/api/accounts/${accountId}/labels`)).data || [];
  const tagMap = {};   // categoria -> {id, name}
  for (const name of CAT_NAMES) {
    const want = norm(CATEGORIES[name].tag);
    const hit = labels.find(l => norm(l.displayName) === want)
      || labels.find(l => { const dn = norm(l.displayName); return want.split(' ').every(tok => dn.includes(tok)); });
    if (hit) tagMap[name] = { id: String(hit.labelId), name: hit.displayName };
  }
  log(`\n🏷️  Tags encontradas no Zoho:`);
  for (const name of CAT_NAMES) log(`   ${name.padEnd(20)} → ${tagMap[name] ? `${tagMap[name].name} (id ${tagMap[name].id})` : '⚠️  NÃO ENCONTRADA'}`);
  const faltando = CAT_NAMES.filter(n => !tagMap[n]);
  if (faltando.length) log(`\n⚠️  Sem tag no Zoho pra: ${faltando.join(', ')}. Crie a tag com esse nome, ou o script só não aplica essas.`);

  // listar Inbox (mais novos primeiro)
  let url = `/api/accounts/${accountId}/messages/view?limit=${LIMIT}&sortBy=date&sortorder=false&status=all`;
  if (Z.folderId) url += `&folderId=${Z.folderId}`;
  const msgs = (await zoho('GET', url)).data || [];
  const cutoff = Date.now() - DAYS * 86400 * 1000;
  const recent = msgs.filter(m => (Number(m.receivedTime) || 0) >= cutoff);
  log(`\n📥 ${recent.length} e-mails nos últimos ${DAYS}d (de ${msgs.length} retornados)\n`);

  const seen = loadSeen();
  const report = [], counts = Object.fromEntries(CAT_NAMES.map(c => [c, 0])), dupSeen = new Set(), draftedThreads = new Set();
  let drafted = 0, skippedAuto = 0, skippedSeen = 0, errors = 0, dups = 0, skippedReplied = 0;

  for (let n = 0; n < recent.length; n++) {
    const m = recent[n];
    const mid = String(m.messageId);
    const threadId = m.threadId ? String(m.threadId) : '';
    const folderId = String(m.folderId || Z.folderId || '');
    const from = m.fromAddress || '';
    const senderEmail = emailOf(from);
    const subject = m.subject || '(sem assunto)';
    try {
      if (seen.has(mid)) { skippedSeen++; continue; }

      // corpo completo (fallback: summary da listagem)
      let bodyText = '';
      try {
        const c = await zoho('GET', `/api/accounts/${accountId}/folders/${folderId}/messages/${mid}/content`);
        bodyText = stripHtml(c?.data?.content || c?.data || '');
      } catch { bodyText = ''; }
      if (!bodyText) bodyText = m.summary || '';
      bodyText = bodyText.slice(0, 3500);

      const cls = parseJson(await llm(CLASSIFY_MODEL, CLASSIFY_SYS, `De: ${from}\nAssunto: ${subject}\n\n${bodyText}`, 300, 0.2));
      let category = CAT_NAMES.includes(cls.category) ? cls.category : 'Sem Importância';
      // Regra do Enzo: aviso AUTOMÁTICO de reembolso (Kiwify etc.) = sempre Médio (é só notificação, não pedido de aluno)
      const isRefundNotice = cls.isAutomation && /reembolso|refund|estorno|chargeback/i.test(`${subject} ${bodyText.slice(0, 300)}`);
      if (isRefundNotice) category = 'Médio';
      counts[category]++; if (cls.isAutomation) skippedAuto++;

      // aplica a tag (messageId/labelId como literais numéricos p/ não perder precisão do long)
      const tag = tagMap[category];
      if (tag && !DRY) {
        const midLit = /^\d+$/.test(mid) ? mid : JSON.stringify(mid);
        const tagLit = /^\d+$/.test(tag.id) ? tag.id : JSON.stringify(tag.id);
        await zoho('PUT', `/api/accounts/${accountId}/updatemessage`, `{"mode":"applyLabel","messageId":[${midLit}],"labelId":[${tagLit}]}`);
      }

      // rascunho (menos Médio/Sem Importância, e só p/ humano real esperando resposta)
      const dupKey = `${senderEmail.toLowerCase()}|${subject.toLowerCase().replace(/[\s\W]+/g, ' ').trim().slice(0, 45)}`;
      const isDup = dupSeen.has(dupKey); dupSeen.add(dupKey); if (isDup) dups++;
      let wantsDraft = CATEGORIES[category].draft && cls.shouldDraft && !cls.isAutomation && !isDup;

      // CONTEXTO DA CONVERSA: antes de rascunhar, puxa a thread inteira (todos os e-mails dessa troca).
      // Serve pra (1) o rascunho entender o histórico completo, não só o último e-mail; e (2) NÃO rascunhar
      // se a conversa já foi respondida (última msg, fora rascunho, foi nossa) ou se já rascunhamos essa
      // thread nesta passada (evita 2 rascunhos pra "X" e "Re: X" da mesma conversa).
      let convText = `De: ${from}\nAssunto: ${subject}\n\n${bodyText}`;
      let skipReason = '';
      if (wantsDraft) {
        const ctx = await threadContext(accountId, threadId);
        if (ctx.alreadyReplied) { wantsDraft = false; skipReason = 'já respondida'; skippedReplied++; }
        else if (threadId && draftedThreads.has(threadId)) { wantsDraft = false; skipReason = 'thread já rascunhada'; }
        else if (ctx.transcript) { convText = ctx.transcript; }
      }

      if (wantsDraft) {
        const dr = parseJson(await llm(DRAFT_MODEL, DRAFT_SYS,
          `Categoria: ${category}\nisRefundRequest: ${cls.isRefundRequest ? 'true' : 'false'}\nneedsEnzo: ${cls.needsEnzo ? 'true' : 'false'}\nIdioma: ${cls.language || 'pt'}\n\n--- CONVERSA (do mais antigo pro mais novo; responda ao ÚLTIMO e-mail do cliente com base em tudo) ---\n${convText}`, 1200, 0.4));
        const subj = dr.subject && /^re:/i.test(dr.subject) ? dr.subject : `Re: ${subject}`;
        if (!DRY) {
          const draft = {
            mode: 'draft', fromAddress: FROM, toAddress: senderEmail,
            subject: subj, content: toHtml(dr.body || ''), mailFormat: 'html',
          };
          // vincula à thread do original (inReplyTo = Message-ID RFC; refHeader = cadeia References + ele)
          const { rfcId, references } = await rfcHeaders(accountId, folderId, mid);
          if (rfcId) { draft.inReplyTo = rfcId; draft.refHeader = references ? `${references} ${rfcId}` : rfcId; }
          else log(`   ⚠️ sem Message-ID RFC (${mid}) — rascunho vai sem vínculo de thread`);
          await zoho('POST', `/api/accounts/${accountId}/messages`, draft);
        }
        if (threadId) draftedThreads.add(threadId);
        drafted++;
        report.push({ mid, from: senderEmail, subject, category, needsEnzo: !!cls.needsEnzo, drafted: true, corpo: DRY ? dr.body : undefined });
        log(`${n + 1}/${recent.length}  ✍️ [${category}]${cls.needsEnzo ? ' →Enzo' : ''}  ${senderEmail} — ${subject.slice(0, 55)}`);
      } else {
        const reason = skipReason || (isDup ? 'duplicado' : (cls.reason || ''));
        const icon = skipReason === 'já respondida' ? '✅' : (isDup || skipReason) ? '🔁' : '🏷️ ';
        report.push({ mid, from: senderEmail, subject, category, drafted: false, reason });
        log(`${n + 1}/${recent.length}  ${icon} [${category}]${skipReason ? ` (${skipReason})` : ''}  ${senderEmail} — ${subject.slice(0, 55)}`);
      }

      if (!DRY) { seen.add(mid); saveSeen(seen); }
    } catch (e) { errors++; log(`✗ ${n + 1}/${recent.length} ${String(e.message).slice(0, 160)}`); report.push({ mid, from: senderEmail, subject, error: String(e.message).slice(0, 200) }); }
  }

  writeFileSync(OUT, JSON.stringify({ when: new Date().toISOString(), dry: DRY, days: DAYS, counts, drafted, dups, skippedAuto, skippedSeen, skippedReplied, errors, report }, null, 2));
  log(`\n──────── RESUMO ${DRY ? '(DRY-RUN)' : ''} ────────`);
  for (const c of CAT_NAMES) log(`  ${c.padEnd(20)} ${counts[c]}`);
  log(`  rascunhos: ${drafted} · já respondidas: ${skippedReplied} · duplicados: ${dups} · automação: ${skippedAuto} · já vistos: ${skippedSeen} · erros: ${errors}`);
  log(`  detalhe: ${OUT}`);
}

run().catch(e => { console.error(e); process.exit(1); });
