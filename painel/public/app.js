/* app.js — Painel AIOS "Command Center" ligado ao backend ao vivo. */

const $ = (s) => document.querySelector(s);

// ───────── ícones ─────────
const ICONES = {
  play: '<path d="m5 3 14 9-14 9z"/>',
  eye: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
};
const ic = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONES[n] || ""}</svg>`;

// ───────── datas ─────────
const DOW = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const hh = (d) => String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
const mesmaData = (a, b) => a.toDateString() === b.toDateString();

function fmtPassado(iso) {
  if (!iso) return "—";
  const d = new Date(iso), ag = new Date(), s = (ag - d) / 1000;
  if (s < 0) return fmtFuturo(iso);
  if (s < 90) return "agora mesmo";
  if (s < 3600) return `há ${Math.round(s / 60)} min`;
  if (mesmaData(d, ag)) return `hoje ${hh(d)}`;
  const o = new Date(ag); o.setDate(ag.getDate() - 1);
  if (mesmaData(d, o)) return `ontem ${hh(d)}`;
  if (s < 6 * 86400) return `${DOW[d.getDay()]} ${hh(d)}`;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} ${hh(d)}`;
}
function fmtFuturo(iso) {
  if (!iso) return "—";
  const d = new Date(iso), ag = new Date();
  if (mesmaData(d, ag)) return `hoje ${hh(d)}`;
  const a = new Date(ag); a.setDate(ag.getDate() + 1);
  if (mesmaData(d, a)) return `amanhã ${hh(d)}`;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} ${hh(d)}`;
}

// ───────── relógio ─────────
function tick() {
  const d = new Date();
  $("#clock").textContent = `${DOW[d.getDay()]} ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} · ${hh(d)}`;
}
setInterval(tick, 1000); tick();

// ───────── estado ─────────
let DADOS = null;
let EXEC = {}; // autoId -> { inicio, fonte } — quem está executando AGORA (poll de 3s)

function estaExecutando(autoId) {
  if (EXEC[autoId]) return true;
  const a = DADOS && DADOS.automacoes.find((x) => x.id === autoId);
  return !!(a && a.executando);
}

async function carregar() {
  const b = $("#btn-atualizar"); b.classList.add("girando");
  try {
    DADOS = await (await fetch("/api/panorama")).json();
    renderTudo(DADOS);
  } catch (e) {
    toast("Não consegui falar com o painel.", "erro", 4000);
  } finally {
    setTimeout(() => b.classList.remove("girando"), 600);
  }
}

function renderTudo(d) {
  const m = d.metricas;
  renderChip();

  // pills sidebar
  $("#pill-auto").textContent = d.automacoes.length;
  $("#pill-cap").textContent = m.capacidades;
  $("#pill-conn").textContent = m.conexoesSistemas;
  $("#pill-skool").textContent = m.rascunhosSkool || "0";

  renderHero(d);
  renderRecs(d.recomendacoes);
  renderKpis(m);
  renderAutomacoes(d.automacoes, m);
  renderCaps(d.skills);
  renderConns(d.conexoes);
  renderDecisoes(d.decisoes);
  renderChat(d);
}

// Chip do topo: "Executando · <nome>" com gradiente enquanto algo roda; senão Ativo/Pausado.
function renderChip() {
  const chip = $("#status-chip");
  if (!DADOS) return;
  const rodando = DADOS.automacoes.filter((a) => estaExecutando(a.id));
  if (rodando.length) {
    chip.className = "status-chip executando";
    const txt = rodando.length === 1 ? rodando[0].nome : `${rodando.length} automações`;
    chip.innerHTML = `<span class="mini-spin"></span>AIOS: Executando · ${esc(txt)}`;
  } else if (DADOS.resumo.ligadas > 0) {
    chip.className = "status-chip";
    chip.innerHTML = `<span class="dot"></span>AIOS: Ativo`;
  } else {
    chip.className = "status-chip off";
    chip.innerHTML = `<span class="dot" style="background:var(--amber)"></span>AIOS: Pausado`;
  }
}

function renderHero(d) {
  const m = d.metricas;
  const rm = d.automacoes.find((a) => a.id === "resumo-matinal");
  const hoje = rm && rm.ultimaExecucao && mesmaData(new Date(rm.ultimaExecucao), new Date());
  const resV = hoje ? hh(new Date(rm.ultimaExecucao)).replace(":", "<small>:") + "</small>" : "—";
  const metr = [
    { cls: "warm", k: "Automações", v: `${m.automacoesLigadas}<small>/${m.automacoesAgendadas}</small>`, x: "ligadas agora" },
    { cls: "accent", k: "Capacidades", v: m.capacidades, x: "skills prontas" },
    { cls: "accent", k: "Conexões", v: m.conexoesSistemas, x: "sistemas" },
    { cls: "", k: "Resumo feito", v: resV, x: hoje ? "entregue hoje" : "ainda não hoje" },
  ];
  $("#hero-metrics").innerHTML = metr.map((x) =>
    `<div class="hmetric ${x.cls}"><div class="k">${x.k}</div><div class="v">${x.v}</div><div class="x">${x.x}</div></div>`).join("");
}

const SPARKS = [
  { c: "#6d8bff", p: "0,20 10,18 20,19 31,12 41,13 51,7 62,4" },
  { c: "#6d8bff", p: "0,21 11,16 21,17 31,11 41,9 51,6 62,3" },
  { c: "#3ddc97", p: "0,14 12,14 24,9 36,9 48,9 62,9" },
  { c: "#ff8a4c", p: "0,20 12,20 24,20 36,14 48,14 62,7" },
  { c: "#a274ff", p: "0,21 12,19 24,15 36,15 48,9 62,5" },
  { c: "#ff8a4c", p: "0,19 12,19 24,16 36,16 48,12 62,8" },
];
function renderKpis(m) {
  const kpis = [
    { t: "Vídeos descritos", v: m.videosDescritos, x: "total" },
    { t: "Rascunhos Skool", v: m.rascunhosSkool, x: "prontos" },
    { t: "Automações ativas", v: `${m.automacoesLigadas}<span style="font-size:15px;color:var(--txt-dim)">/${m.automacoesAgendadas}</span>`, x: "ligadas" },
    { t: "Capacidades", v: m.capacidades, x: "skills" },
    { t: "Conexões", v: m.conexoesSistemas, x: "sistemas" },
    { t: "Decisões", v: m.decisoes, x: "registradas" },
  ];
  $("#kpis").innerHTML = kpis.map((k, i) => {
    const sp = SPARKS[i % SPARKS.length];
    return `<div class="kpi"><div class="kt">${k.t}</div><div class="kv">${k.v}</div>
      <div class="krow"><span class="delta flat">${k.x}</span>
      <svg class="spark-svg" viewBox="0 0 62 26" preserveAspectRatio="none"><polyline points="${sp.p}" fill="none" stroke="${sp.c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>`;
  }).join("");
}

function renderRecs(recs) {
  $("#recs-cnt").textContent = recs.length + (recs.length === 1 ? " item" : " itens");
  $("#recs-list").innerHTML = recs.map((r) =>
    `<div class="rec" ${r.ir ? `data-rec-ir="${r.ir}"` : ""}>
      <div class="ri ${r.cor}">${r.icone}</div>
      <div class="rb"><div class="rt">${esc(r.texto)}</div><div class="rm">${esc(r.meta || "")}</div></div>
      <span class="prio ${r.prioridade}">${r.prioridade}</span>
    </div>`).join("");
}

function renderAutomacoes(lista, m) {
  $("#auto-badge").textContent = `${lista.length} fluxos`;
  $("#auto-tbody").innerHTML = lista.map((a) => {
    const rodando = estaExecutando(a.id);
    // status
    let st;
    if (rodando) st = `<span class="st executando"><span class="mini-spin"></span>Executando…</span>`;
    else if (!a.taskName) st = `<span class="st demanda"><span class="d"></span>Sob demanda</span>`;
    else if (a.agendamento && a.agendamento.ligada) st = `<span class="st ativa"><span class="d"></span>Ativa</span>`;
    else st = `<span class="st desligada"><span class="d"></span>Desligada</span>`;

    // resultado por automação
    let res = "—";
    if (a.id === "yt-auto-descricao") {
      res = `<div class="res"><span class="ok">✓</span> ${m.videosDescritos} vídeos</div><span class="res-warn">⚠ publica sem revisão</span>`;
    } else if (a.id === "skool") {
      res = `<div class="res">📝 ${m.rascunhosSkool} rascunhos</div>`;
    } else if (a.agendamento && a.agendamento.resultado) {
      const r = a.agendamento.resultado;
      const cls = r.ok === true ? "ok" : r.ok === false ? "err" : "";
      const ico = r.ok === true ? "✓" : r.ok === false ? "✕" : "•";
      res = `<div class="res"><span class="${cls}">${ico}</span> ${r.label}</div>`;
    }

    const nivCls = (a.nivel || "").toLowerCase();
    const ultima = a.ultimaExecucao ? `<span class="when">${fmtPassado(a.ultimaExecucao)}</span>` : `<span class="when" style="color:var(--txt-faint)">nunca</span>`;

    // ações
    const botoes = (a.acoes || []).map((ac) => {
      if (ac.tipo === "abrir-instagram") {
        return `<button class="btn sm primary" data-instagram>${ic("play")}Preparar post</button>`;
      }
      if (ac.tipo === "run") {
        const lbl = a.id === "skool" ? "Rascunhar" : "Rodar";
        return `<button class="btn sm primary" data-acao="${ac.id}" data-tipo="run" data-auto="${a.id}">${ic("play")}${lbl}</button>`;
      }
      if (ac.tipo === "toggle") {
        const lig = a.agendamento && a.agendamento.ligada;
        return `<button class="toggle ${lig ? "" : "off"}" data-acao="${ac.id}" data-tipo="toggle" data-auto="${a.id}" data-ligada="${lig}" title="${lig ? "Ligada — clique pra desligar" : "Desligada — clique pra ligar"}"></button>`;
      }
      // ver-*
      const icone = ac.tipo === "ver-log" ? "doc" : ac.tipo === "ver-estado" ? "list" : "eye";
      return `<button class="iconbtn" data-acao="${ac.id}" data-tipo="${ac.tipo}" data-auto="${a.id}" title="${ac.label}">${ic(icone)}</button>`;
    }).join("");

    return `<tr class="${rodando ? "executando" : ""}" data-row-auto="${a.id}"${rodando ? ' title="Executando agora — clique pra ver o que está acontecendo"' : ""}>
      <td><div class="auto-name"><div class="ai">${a.emoji}</div><div>
        <div class="an">${a.nome}</div>
        <div class="lvl"><span class="tagn ${nivCls}">${a.nivel}</span> ${a.escreve ? "publica" : "só leitura"}</div>
      </div></div></td>
      <td>${st}</td>
      <td><span class="trig">${a.horario}</span></td>
      <td>${ultima}</td>
      <td>${res}</td>
      <td><div class="row-act">${botoes}</div></td>
    </tr>`;
  }).join("");
}

function renderCaps(skills) {
  $("#caps-badge").textContent = `${skills.length} skills`;
  const cards = skills.map((s) =>
    `<div class="cap" data-cap="${s.id}" title="${esc(s.descricao || "")}"><div class="ci">${s.emoji}</div><div><div class="cn">${s.nome}</div><div class="cc">${s.trigger}</div></div></div>`).join("");
  $("#caps").innerHTML = cards;
}

const CONN_ICO = {
  "Revenue / Financials": "💰", "Customer interactions": "👥", "Calendar": "📅",
  "Communication": "✉️", "Project / task tracking": "✅", "Knowledge / files": "📚", "Meeting intelligence": "🎙️",
};
const CONN_NOME = {
  "Revenue / Financials": "Receita", "Customer interactions": "Clientes", "Calendar": "Agenda",
  "Communication": "Comunicação", "Project / task tracking": "Tarefas", "Knowledge / files": "Conhecimento", "Meeting intelligence": "Reuniões",
};
function renderConns(conns) {
  $("#conns-badge").textContent = `${conns.length} domínios`;
  $("#conns").innerHTML = conns.map((c) => {
    const nome = CONN_NOME[c.dominio] || c.dominio;
    const ico = CONN_ICO[c.dominio] || "🔗";
    const tools = c.ferramentas.length ? c.ferramentas.join(" · ") : c.bruto.replace(/\s*\(.*/, "");
    const stat = c.ferramentas.length
      ? `<span class="cstat on"><span class="d"></span>conectado</span>`
      : `<span class="cstat pend"><span class="d"></span>a conectar</span>`;
    return `<div class="conn"><div class="cdi">${ico}</div><div class="cd-main"><div class="cd-name">${nome}</div><div class="cd-tools">${esc(tools)}</div></div>${stat}</div>`;
  }).join("");
}

function renderDecisoes(decs) {
  if (!decs.length) { $("#decisoes").innerHTML = `<div class="visor-vazio">sem decisões registradas</div>`; return; }
  $("#decisoes").innerHTML = decs.map((d) =>
    `<div class="decisao"><div class="data">${d.data}</div><div class="tit">${esc(d.titulo)}</div><div class="res-d">${esc(d.resumo)}</div></div>`).join("");
}

function renderChat(d) {
  const m = d.metricas;
  const partes = [];
  if (m.rascunhosSkool > 0) partes.push(`tem <b>${m.rascunhosSkool} rascunhos do Skool</b> esperando`);
  const rm = d.automacoes.find((a) => a.id === "resumo-matinal");
  if (rm && rm.ultimaExecucao && mesmaData(new Date(rm.ultimaExecucao), new Date())) partes.unshift(`já fiz seu <b>Resumo Matinal</b>`);
  const msg = partes.length ? `Fala Enzo, tudo certo? ${partes.join(" e ")}. Por onde começamos?` : "Fala Enzo, tudo certo? Por onde começamos?";
  $("#chat-greet").innerHTML = msg;
}

// ───────── ações ─────────
const CONFIRMACOES = {
  "rodar-resumo": { icone: "🌅", titulo: "Rodar o Resumo Matinal agora?", detalhe: "Vou ler suas caixas das últimas 24h e abrir o pop-up na tela. Leva ~1 min." },
  "rodar-skool": { icone: "💬", titulo: "Rascunhar respostas do Skool?", detalhe: "Leio a comunidade e rascunho as respostas na sua voz. Não publico nada — você revisa e posta." },
  "toggle-resumo": { icone: "⏻", liga: { titulo: "Religar o Resumo Matinal?", detalhe: "Volta a rodar sozinho de manhã." }, desliga: { titulo: "Desligar o Resumo Matinal?", detalhe: "Para de rodar sozinho de manhã. Você ainda pode rodar na mão.", perigo: true } },
  "toggle-yt": { icone: "⏻", liga: { titulo: "Religar a Auto-Descrição?", detalhe: "Volta a descrever e publicar nos vídeos novos." }, desliga: { titulo: "Desligar a Auto-Descrição do YouTube?", detalhe: "Vídeos novos vão ficar SEM descrição até você religar.", perigo: true } },
  "rodar-triagem": { icone: "📧", titulo: "Rodar a Triagem de E-mail agora?", detalhe: "Passo pelas duas caixas — Gmail (sua voz) e atendimento no Zoho (voz da equipe) —, categorizo nos 6 labels e rascunho as respostas. Não envio nada (L2). Leva ~2-4 min; depois confira nas duas caixas." },
  "toggle-triagem": { icone: "⏻", liga: { titulo: "Religar a Triagem de E-mail?", detalhe: "Volta a categorizar e rascunhar sozinha de manhã." }, desliga: { titulo: "Desligar a Triagem de E-mail?", detalhe: "Para de rodar sozinha de manhã. Você ainda pode rodar na mão pelo botão.", perigo: true } },
};

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-acao]");
  if (btn) {
    const { acao, tipo, auto } = btn.dataset;
    if (tipo === "abrir-resumo") return executar(acao, {});
    if (tipo === "ver-resumo") return verSaida(auto, "brief");
    if (tipo === "ver-skool") return verSaida(auto, "skool");
    if (tipo === "ver-log") return verLog(auto);
    if (tipo === "ver-estado") return verEstado(auto);
    if (tipo === "run") return confirmar(CONFIRMACOES[acao], false, () => executar(acao, {}));
    if (tipo === "toggle") {
      const lig = btn.dataset.ligada === "true";
      const c = CONFIRMACOES[acao];
      if (!c) { toast("Ação sem confirmação configurada: " + acao, "erro", 4000); return; }
      const t = lig ? c.desliga : c.liga;
      return confirmar({ icone: c.icone, ...t }, !!t.perigo, () => executar(acao, { ligar: !lig }));
    }
  }
  // linha da automação em execução → visor ao vivo
  const linha = e.target.closest("tr[data-row-auto]");
  if (linha && estaExecutando(linha.dataset.rowAuto)) return verExecucao(linha.dataset.rowAuto);
  // recomendações clicáveis
  const rec = e.target.closest("[data-rec-ir]");
  if (rec) {
    const ir = rec.dataset.recIr;
    if (ir === "skool") return verSaida("skool", "skool");
    if (ir === "resumo-matinal") return verSaida("resumo-matinal", "brief");
    if (ir === "yt-auto-descricao") return verEstado("yt-auto-descricao");
    return;
  }
  // nav lateral
  const nav = e.target.closest(".nav a");
  if (nav) {
    document.querySelectorAll(".nav a").forEach((x) => x.classList.remove("active"));
    nav.classList.add("active");
    if (nav.dataset.scroll) {
      const el = nav.dataset.scroll === "top" ? $("#top") : document.getElementById(nav.dataset.scroll);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (nav.dataset.ver) {
      const f = nav.dataset.fmt;
      if (f === "estado") verEstado(nav.dataset.ver); else verSaida(nav.dataset.ver, f);
    } else if (nav.dataset.soon !== undefined) {
      toast("Configurações chegam numa próxima versão.", "ok", 3000);
    }
    return;
  }
  // capacidade → mostra o que faz
  const cap = e.target.closest("[data-cap]");
  if (cap) { const s = DADOS.skills.find((x) => x.id === cap.dataset.cap); if (s) abrirVisor(`${s.emoji} ${s.nome}  ·  ${s.trigger}`, `<p style="font-size:14px;line-height:1.6;color:var(--txt-2)">${esc(s.descricao || "Sem descrição.")}</p>`); return; }
});

async function executar(id, params) {
  fecharModais();
  toast("Enviando…", "ok", 1200);
  try {
    const res = await (await fetch("/api/acao", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, params }) })).json();
    toast(res.mensagem || (res.ok ? "Feito." : "Não rolou."), res.ok ? "ok" : "erro", 5000);
    setTimeout(pollExec, 600); // pinta o card "executando" quase na hora
    setTimeout(carregar, 1500);
  } catch { toast("Falha de conexão com o painel.", "erro", 4000); }
}

// ───────── modais ─────────
function confirmar(c, perigo, onOk) {
  if (!c) { toast("Ação sem confirmação configurada.", "erro", 4000); return; }
  $("#confirma-icone").textContent = c.icone || "⚠️";
  $("#confirma-titulo").textContent = c.titulo;
  $("#confirma-detalhe").textContent = c.detalhe || "";
  const ok = $("#confirma-ok");
  ok.className = "btn-primario" + (perigo ? " perigo" : "");
  ok.textContent = perigo ? "Sim, pode" : "Confirmar";
  const novo = ok.cloneNode(true); ok.replaceWith(novo);
  novo.addEventListener("click", onOk);
  $("#modal-confirma").hidden = false;
}
$("#confirma-cancela").addEventListener("click", fecharModais);
$("#visor-fecha").addEventListener("click", fecharModais);
document.querySelectorAll(".modal-fundo").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m) fecharModais(); }));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharModais(); });
function fecharModais() { $("#modal-confirma").hidden = true; $("#modal-visor").hidden = true; if (typeof execTimer !== "undefined" && execTimer) { clearInterval(execTimer); execTimer = null; } }
function abrirVisor(titulo, html) { $("#visor-titulo").innerHTML = titulo; $("#visor-corpo").innerHTML = html; $("#modal-visor").hidden = false; }

// ───────── visualizadores ─────────
async function verSaida(autoId, formato) {
  abrirVisor("Carregando…", `<div class="carregando">buscando…</div>`);
  const d = await (await fetch("/api/saida?id=" + encodeURIComponent(autoId))).json();
  if (d.vazio || !d.dados) return abrirVisor(d.nome || "Resultado", `<div class="visor-vazio">Ainda não há resultado salvo. Rode a automação pelo botão.</div>`);
  const meta = d.mtime ? `<div class="visor-meta">gerado ${fmtPassado(d.mtime)}</div>` : "";
  abrirVisor(d.nome, meta + (formato === "brief" ? htmlBrief(d.dados) : htmlSkool(d.dados)));
}
function htmlBrief(j) {
  let h = "";
  if (j.destaque) h += `<div class="brief-destaque">${esc(j.destaque)}</div>`;
  for (const sec of j.secoes || []) {
    h += `<div class="brief-secao"><h5>${esc(sec.fonte)}</h5>`;
    for (const it of sec.itens || []) h += `<div class="brief-item"><span>${esc(it.texto)}</span>${it.url ? `<a href="${it.url}" target="_blank">abrir ↗</a>` : ""}</div>`;
    h += `</div>`;
  }
  return h || `<div class="visor-vazio">Resumo vazio.</div>`;
}
function htmlSkool(j) {
  const itens = Array.isArray(j) ? j : (j.itens || j.rascunhos || []);
  if (!itens.length) return `<div class="visor-vazio">Nenhum rascunho salvo.</div>`;
  return itens.map((it, i) => {
    const autor = it.autor || it.origem || "Skool";
    const pergunta = it.original || it.pergunta || it.texto || "";
    const resposta = it.rascunho || it.resposta || "";
    const link = it.url ? `<a href="${it.url}" target="_blank" style="color:var(--blue);font-size:11px;float:right">abrir ↗</a>` : "";
    return `<div class="skool-item"><div class="origem">${esc(String(autor))}${link}</div>
      ${pergunta ? `<div class="pergunta">${esc(String(pergunta)).slice(0, 500)}</div>` : ""}
      <div class="resposta" id="resp-${i}">${esc(String(resposta))}</div>
      ${resposta ? `<button class="copiar" data-copia="resp-${i}">copiar resposta</button>` : ""}</div>`;
  }).join("");
}
async function verLog(autoId) {
  abrirVisor("Carregando…", `<div class="carregando">lendo o log…</div>`);
  const d = await (await fetch("/api/log?id=" + encodeURIComponent(autoId))).json();
  const meta = `<div class="visor-meta">${d.arquivo || ""}${d.mtime ? " · atualizado " + fmtPassado(d.mtime) : ""}</div>`;
  abrirVisor("Log · " + (d.nome || ""), meta + `<div class="log-cru">${esc(d.texto || "(vazio)")}</div>`);
}
async function verEstado(autoId) {
  abrirVisor("Carregando…", `<div class="carregando">lendo…</div>`);
  const d = await (await fetch("/api/estado?id=" + encodeURIComponent(autoId))).json();
  if (d.vazio || !d.dados) return abrirVisor(d.nome || "Estado", `<div class="visor-vazio">Sem dados ainda.</div>`);
  const j = d.dados, proc = j.processados || {};
  const videos = Array.isArray(proc) ? proc.map((v) => ({ id: v.id || "", titulo: v.titulo || v, seed: v.seed }))
    : Object.entries(proc).map(([id, v]) => ({ id, titulo: (v && v.titulo) || id, seed: v && v.seed }));
  let topo = "";
  if (j.ultimo_ciclo) topo += `<div class="brief-item"><span>Último ciclo</span><span style="margin-left:auto" class="mono">${fmtPassado(j.ultimo_ciclo)}</span></div>`;
  if (j.instalado_em) topo += `<div class="brief-item"><span>Rodando desde</span><span style="margin-left:auto" class="mono">${fmtPassado(j.instalado_em)}</span></div>`;
  topo += `<div class="brief-item"><span>Vídeos processados</span><span style="margin-left:auto;color:var(--blue);font-weight:700" class="mono">${videos.length}</span></div>`;
  const corpo = videos.length
    ? videos.map((v) => `<div class="brief-item"><span>${v.seed ? "◷ " : "✓ "}${esc(v.titulo)}</span>${v.id ? `<a href="https://youtu.be/${v.id}" target="_blank">ver ↗</a>` : ""}</div>`).join("")
    : `<div class="visor-vazio">Nenhum vídeo ainda.</div>`;
  abrirVisor(d.nome, `<div class="visor-meta">atualizado ${fmtPassado(d.mtime)} · ◷ = marcado na instalação, ✓ = descrito pelo AIOS</div><div class="brief-secao">${topo}</div><div class="brief-secao"><h5>histórico</h5>${corpo}</div>`);
}

// ───────── execução ao vivo ─────────
// Transforma o log cru em etapas: extrai a hora do começo da linha e classifica
// cada uma (ok / erro / normal) pra timeline do visor.
function estruturarLog(texto) {
  const linhas = String(texto || "").split("\n").map((l) => l.trim()).filter(Boolean);
  return linhas.slice(-120).map((l) => {
    const m = l.match(/^\[?(?:\d{4}-\d{2}-\d{2}[T ])?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*[-–—·>]*\s*(.*)$/);
    const hora = m && m[2] ? m[1] : "";
    const txt = m && m[2] ? m[2] : l;
    let cls = "";
    if (/erro|error|falh|fail|exce[pç]|✗|✕|não consegui/i.test(txt)) cls = "err";
    else if (/✓|✔|\bok\b|sucesso|conclu|pronto|salv[oa]|enviad|gerad[oa]|terminad|feito|publicad/i.test(txt)) cls = "ok";
    return { hora, txt, cls };
  });
}

function cronometro(inicioIso) {
  const s = Math.max(0, Math.round((Date.now() - new Date(inicioIso)) / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

let execTimer = null;
async function verExecucao(autoId) {
  const a = (DADOS && DADOS.automacoes.find((x) => x.id === autoId)) || { nome: autoId, emoji: "⚙️" };
  abrirVisor(`${a.emoji} ${esc(a.nome)} · ao vivo`, `<div class="carregando">abrindo o log…</div>`);

  const atualizar = async () => {
    if ($("#modal-visor").hidden) { clearInterval(execTimer); execTimer = null; return; }
    let d;
    try { d = await (await fetch("/api/log?id=" + encodeURIComponent(autoId))).json(); }
    catch { return; }
    const rodando = estaExecutando(autoId);
    const inicio = EXEC[autoId] && EXEC[autoId].inicio;
    const passos = estruturarLog(d.texto);

    const topo = rodando
      ? `<div class="exec-topo"><span class="mini-spin azul"></span><b>Executando agora</b>` +
        (inicio ? `<span class="exec-cron mono">⏱ ${cronometro(inicio)}</span>` : "") + `</div>`
      : `<div class="exec-topo"><span class="exec-fim">✓ Terminou</span><span class="exec-cron mono">atualizado ${fmtPassado(d.mtime)}</span></div>`;

    const corpo = passos.length
      ? `<div class="exec-steps">` + passos.map((p, i) => {
          const atual = rodando && i === passos.length - 1;
          return `<div class="exec-step ${p.cls}${atual ? " atual" : ""}"><span class="es-dot"></span><span class="es-txt">${esc(p.txt)}</span>${p.hora ? `<span class="es-hora mono">${p.hora}</span>` : ""}</div>`;
        }).join("") + `</div>`
      : `<div class="visor-vazio">O log ainda está vazio — a automação acabou de começar.</div>`;

    const el = $("#visor-corpo");
    el.innerHTML = topo + corpo;
    if (rodando) el.scrollTop = el.scrollHeight; // acompanha a etapa mais nova
    else { clearInterval(execTimer); execTimer = null; } // acabou: congela o retrato final
  };

  clearInterval(execTimer);
  await atualizar();
  execTimer = setInterval(atualizar, 2000);
}

// Poll leve (3s): mantém EXEC em dia, repinta card + chip e avisa quando termina.
async function pollExec() {
  let novas;
  try { novas = (await (await fetch("/api/execucoes")).json()).execucoes || {}; }
  catch { return; }
  const antes = Object.keys(EXEC).sort().join(",");
  const terminadas = Object.keys(EXEC).filter((id) => !novas[id]);
  EXEC = novas;
  if (Object.keys(novas).sort().join(",") !== antes) {
    if (DADOS) { renderAutomacoes(DADOS.automacoes, DADOS.metricas); renderChip(); }
    for (const id of terminadas) {
      const a = DADOS && DADOS.automacoes.find((x) => x.id === id);
      toast(`✓ ${a ? a.nome : id} terminou de executar.`, "ok", 5000);
    }
    if (terminadas.length) setTimeout(carregar, 1200); // atualiza resultado + última execução
  }
}
setInterval(pollExec, 3000);
pollExec();

// copiar resposta
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-copia]");
  if (!b) return;
  navigator.clipboard.writeText(document.getElementById(b.dataset.copia).innerText).then(() => { b.textContent = "copiado ✓"; setTimeout(() => (b.textContent = "copiar resposta"), 1800); });
});

// chat (placeholder — copiloto embutido vem depois)
function chatSoon() { toast("O copiloto aqui dentro vem numa próxima. Por ora, fale comigo no Claude Code 🙂", "ok", 4500); }
$("#chat-send").addEventListener("click", chatSoon);
$("#chat-input").addEventListener("keydown", (e) => { if (e.key === "Enter") chatSoon(); });
document.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => { $("#chat-input").value = c.textContent.trim(); $("#chat-input").focus(); }));
$("#chat-min").addEventListener("click", () => { $("#chat").style.display = "none"; $("#chat-fab").style.display = "grid"; });
$("#chat-fab").addEventListener("click", () => { $("#chat").style.display = ""; $("#chat-fab").style.display = "none"; });

// ⌘K foca a busca
window.addEventListener("keydown", (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("#busca").focus(); } });

// ───────── toast ─────────
let tT;
function toast(msg, tipo, ms = 4000) {
  const t = $("#toast"); t.textContent = msg; t.className = "toast " + (tipo || "ok"); t.hidden = false;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(tT); tT = setTimeout(() => { t.classList.remove("show"); setTimeout(() => (t.hidden = true), 300); }, ms);
}
function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

// ───────── start ─────────
$("#btn-atualizar").addEventListener("click", carregar);
$("#btn-atualizar-2").addEventListener("click", carregar);
carregar();
setInterval(carregar, 60000);
