/* instagram.js — tela "Preparar post do Instagram" no painel.
   Reusa toast() e esc() globais do app.js. Fala com /api/instagram/*. */

(function () {
  const $ = (s) => document.querySelector(s);
  let JOB = null;       // jobId atual
  let TIMER = null;     // polling
  let RES = null;       // resultado (título/legenda) pra copiar
  let TICKS = 0;        // contador de polls (timeout de segurança)
  let VER = 0;          // versão das capas (cache-bust ao regerar)
  const MAX_TICKS = 200; // ~4 min a 1.3s

  function abrir() {
    pararPoll();
    JOB = null; RES = null;
    $("#ig-envio").hidden = false;
    $("#ig-proc").hidden = true;
    $("#ig-result").hidden = true;
    $("#ig-result").innerHTML = "";
    $("#ig-log").textContent = "iniciando…";
    $("#ig-file").value = "";
    $("#modal-instagram").hidden = false;
  }
  function fechar() { pararPoll(); $("#modal-instagram").hidden = true; }
  function pararPoll() { if (TIMER) { clearInterval(TIMER); TIMER = null; } }

  function posEscolhida() {
    const r = document.querySelector('input[name="ig-pos"]:checked');
    return r ? r.value : "middle";
  }

  async function enviar(file) {
    if (!file) return;
    if (!file.type.startsWith("video/") && !/\.(mp4|mov|webm|mkv|avi|m4v)$/i.test(file.name)) {
      return toast("Isso não parece um vídeo. Mande o arquivo do reel.", "erro", 4000);
    }
    $("#ig-envio").hidden = true;
    $("#ig-proc").hidden = false;
    $("#ig-result").hidden = true;
    $("#ig-proc-msg").textContent = "Enviando o vídeo…";
    $("#ig-log").textContent = "enviando " + file.name + " …";
    try {
      const url = `/api/instagram/upload?name=${encodeURIComponent(file.name)}&pos=${posEscolhida()}`;
      const resp = await fetch(url, { method: "POST", body: file });
      if (resp.status === 404 || resp.status === 405) {
        throw new Error("O painel está numa versão antiga (não conhece a tela do Instagram). Feche e reabra o app: rode parar-painel.cmd e depois abrir-painel.cmd.");
      }
      const r = await resp.json();
      if (!r.ok) throw new Error(r.mensagem || "falha no upload");
      JOB = r.jobId;
      TICKS = 0;
      $("#ig-proc-msg").textContent = "Transcrevendo o vídeo na sua GPU…";
      TIMER = setInterval(poll, 1300);
      poll();
    } catch (e) {
      $("#ig-proc-msg").textContent = "Deu ruim no envio.";
      $("#ig-log").textContent = String(e.message || e);
      toast("Não consegui enviar o vídeo.", "erro", 4000);
    }
  }

  async function poll() {
    if (!JOB) return;
    if (++TICKS > MAX_TICKS) {
      pararPoll();
      return mostrarResultado({ ok: false, erro: "Demorou demais — algo travou. Veja o log e tente de novo." });
    }
    try {
      const log = await (await fetch("/api/instagram/log?job=" + JOB)).json();
      if (log && typeof log.texto === "string") {
        const box = $("#ig-log");
        const perto = box.scrollHeight - box.scrollTop - box.clientHeight < 40;
        box.textContent = log.texto || "…";
        if (perto) box.scrollTop = box.scrollHeight;
        const ult = (log.texto.match(/^>>.*$/gm) || []).pop();
        if (ult) $("#ig-proc-msg").textContent = ult.replace(/^>>\s*/, "").replace(/\[\d\/\d\]\s*/, "");
      }
      const res = await (await fetch("/api/instagram/result?job=" + JOB)).json();
      if (res && !res.pendente) { pararPoll(); mostrarResultado(res.dados); }
    } catch { /* segue tentando no próximo tick */ }
  }

  function mostrarResultado(d) {
    $("#ig-proc").hidden = true;
    const box = $("#ig-result");
    box.hidden = false;
    if (!d || !d.ok) {
      const msg = (d && d.erro) || "Não consegui gerar o post.";
      box.innerHTML = `<div class="ig-erro">⚠ ${esc(msg)}</div>
        <div class="modal-botoes" style="justify-content:flex-start;margin-top:14px">
          <button class="btn-primario" id="ig-retry">Tentar outro vídeo</button></div>`;
      $("#ig-retry").addEventListener("click", abrir);
      return;
    }
    RES = d;
    VER = 0;
    const opcoes = (d.opcoes_capa && d.opcoes_capa.length ? d.opcoes_capa : [d.texto_capa || ""]);
    const chips = opcoes.map((o) => `<button class="ig-chip" data-cap-op="${esc(o)}">${esc(o)}</button>`).join("");

    box.innerHTML = `
      <div class="ig-bloco">
        <div class="ig-rot"><h5>Título</h5><button class="copiar" data-ig-copy="titulo">copiar</button></div>
        <div class="ig-titulo">${esc(d.titulo || "")}</div>
      </div>
      <div class="ig-bloco">
        <div class="ig-rot"><h5>Legenda (descrição)</h5><button class="copiar" data-ig-copy="descricao">copiar</button></div>
        <div class="ig-desc">${esc(d.descricao || "")}</div>
      </div>
      <div class="ig-bloco">
        <div class="ig-rot"><h5>Texto da capa</h5></div>
        <input class="ig-cap-input" id="ig-cap-text" maxlength="60" value="${esc(d.texto_capa || "")}" placeholder="3 a 6 palavras, em CAIXA ALTA" />
        <div class="ig-chips">${chips}</div>
        <div class="ig-controls">
          <label>Fonte
            <select id="ig-font">
              <option value="montserrat">Montserrat Black</option>
              <option value="poppins">Poppins Black</option>
              <option value="black">Arial Black</option>
              <option value="segoe">Segoe UI Black</option>
              <option value="impact">Impact</option>
              <option value="franklin">Franklin Heavy</option>
              <option value="bold">Arial Bold</option>
            </select></label>
          <label>Posição
            <select id="ig-pos2"><option value="top">em cima</option><option value="middle">no meio</option><option value="bottom">embaixo</option></select></label>
          <button class="btn-primario" id="ig-aplicar">Atualizar capas</button>
        </div>
      </div>
      <div class="ig-capas-rot">Capa — escolha 1, passe o mouse e clique em "Baixar"</div>
      <div class="ig-capas" id="ig-capas">${capasHtml()}</div>
      <div class="ig-result-foot">Edite o texto, troque a fonte e clique em <b>Atualizar capas</b> quantas vezes quiser.
        Depois copie o título/legenda e baixe a capa escolhida.
        Nada foi publicado — você decide. <a href="#" id="ig-outro" style="color:#E1306C;font-weight:700">Preparar outro</a></div>`;

    $("#ig-font").value = d.fonte || "montserrat";
    $("#ig-pos2").value = d.pos || "middle";
    $("#ig-outro").addEventListener("click", (e) => { e.preventDefault(); abrir(); });
  }

  function capasHtml() {
    return (RES.covers || []).map((nome, i) => {
      const src = `/api/instagram/file?job=${JOB}&name=${encodeURIComponent(nome)}&v=${VER}`;
      const tag = i === 0 ? "início" : i === 1 ? "meio" : "fim";
      return `<div class="ig-capa" data-name="${esc(nome)}">
        <span class="ig-cap-tag">${tag}</span>
        <img src="${src}" alt="capa ${tag}" />
        <a class="ig-cap-baixar" href="${src}" download="${esc(nome)}">Baixar capa</a>
      </div>`;
    }).join("");
  }

  async function atualizarCapas() {
    const text = ($("#ig-cap-text").value || "").trim();
    if (!text) return toast("Escreva o texto da capa.", "erro", 3000);
    const font = $("#ig-font").value, pos = $("#ig-pos2").value;
    const btn = $("#ig-aplicar"), rotulo = btn.textContent;
    btn.textContent = "desenhando…"; btn.disabled = true;
    try {
      const r = await (await fetch("/api/instagram/cover", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job: JOB, text, pos, font }),
      })).json();
      if (!r.ok) throw new Error(r.mensagem || "falhou");
      VER++;
      RES.texto_capa = r.texto || text;
      $("#ig-capas").innerHTML = capasHtml();
      toast("Capas atualizadas ✓", "ok", 2500);
    } catch (e) {
      toast("Não consegui atualizar: " + e.message, "erro", 4000);
    } finally {
      btn.textContent = rotulo; btn.disabled = false;
    }
  }

  // copiar título / legenda · chips de sugestão · atualizar capas · selecionar capa
  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-ig-copy]");
    if (c && RES) {
      const txt = RES[c.dataset.igCopy] || "";
      navigator.clipboard.writeText(txt).then(() => {
        c.textContent = "copiado ✓"; setTimeout(() => (c.textContent = "copiar"), 1600);
      });
      return;
    }
    const chip = e.target.closest("[data-cap-op]");
    if (chip) { const inp = $("#ig-cap-text"); if (inp) { inp.value = chip.dataset.capOp; inp.focus(); } return; }
    if (e.target.closest("#ig-aplicar")) { atualizarCapas(); return; }
    const capa = e.target.closest(".ig-capa");
    if (capa && !e.target.closest(".ig-cap-baixar")) {
      document.querySelectorAll(".ig-capa").forEach((x) => x.classList.remove("sel"));
      capa.classList.add("sel");
    }
  });

  // abrir pela navegação lateral e pelo botão do card
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-instagram]")) { e.preventDefault(); abrir(); }
  });
  $("#ig-fecha").addEventListener("click", fechar);
  $("#modal-instagram").addEventListener("click", (e) => { if (e.target.id === "modal-instagram") fechar(); });

  // seleção de arquivo + arrastar e soltar
  const drop = $("#ig-drop"), file = $("#ig-file");
  file.addEventListener("change", () => enviar(file.files[0]));
  ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("drag"); }));
  ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("drag"); }));
  drop.addEventListener("drop", (e) => { const f = e.dataTransfer.files[0]; if (f) enviar(f); });

  window.abrirInstagram = abrir; // pra eventual atalho
})();
