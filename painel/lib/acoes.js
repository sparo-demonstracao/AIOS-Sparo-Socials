// acoes.js — as ÚNICAS coisas que o painel tem permissão de executar.
// É uma allowlist fechada: o front manda um id conhecido; nada de comando arbitrário.
// Toda ação que executa algo já chegou aqui depois de uma confirmação na tela.

const path = require("path");
const { spawn, execFile } = require("child_process");

const RAIZ = path.resolve(__dirname, "..", "..");
const PS = "powershell.exe";

// Execuções disparadas pelo próprio painel, ainda vivas. É o sinal EXATO de "rodando
// agora": entra quando o spawn acontece e sai no exit do processo. O front usa isso
// pra pintar o card com o gradiente e pro chip "AIOS: Executando".
const EXECUCOES = {}; // autoId -> { inicio: ISO, pid }
// Términos recentes (autoId -> timestamp ms). Serve pro coletor NÃO cair no falso
// positivo do log recém-escrito logo depois que a execução terminou.
const FINS_RECENTES = {};

// Dispara um .ps1 em background (não trava o painel). Usado pras automações longas.
// IMPORTANTE: detached:false. Com detached:true o powershell.exe sai na hora (exit 0) SEM rodar o
// corpo do -File — testado na matriz A/B/C/E na máquina real: só detached:false executa o script.
// O unref() já solta o painel (não espera o filho). NÃO trocar de volta pra true, senão as
// automações "Rodar agora" (triagem, resumo, skool) só fingem que rodaram.
// `autoId` (opcional) liga a execução ao card da automação no painel.
function dispararPs1(relPath, args = [], autoId = null) {
  const script = path.join(RAIZ, relPath);
  const filho = spawn(
    PS,
    ["-NoProfile", "-Sta", "-ExecutionPolicy", "Bypass", "-WindowStyle", "Hidden", "-File", script, ...args],
    { detached: false, stdio: "ignore", windowsHide: true }
  );
  if (autoId) {
    EXECUCOES[autoId] = { inicio: new Date().toISOString(), pid: filho.pid };
    const encerrar = () => {
      delete EXECUCOES[autoId];
      FINS_RECENTES[autoId] = Date.now();
    };
    filho.once("exit", encerrar);
    filho.once("error", encerrar);
  }
  filho.unref();
}

// Fotografia das execuções vivas + términos recentes (consumido pelo coletor).
function execucoesAtivas() {
  return { vivas: { ...EXECUCOES }, fins: { ...FINS_RECENTES } };
}

// Liga/desliga uma tarefa do Agendador. Espera terminar (é rápido) e devolve o resultado.
function alternarTarefa(taskName, ligar) {
  return new Promise((resolve) => {
    const verbo = ligar ? "Enable-ScheduledTask" : "Disable-ScheduledTask";
    const cmd = `try { ${verbo} -TaskName '${taskName.replace(/'/g, "''")}' -ErrorAction Stop | Out-Null; 'OK' } catch { 'ERRO: ' + $_.Exception.Message }`;
    execFile(
      PS,
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", cmd],
      { windowsHide: true, timeout: 20000 },
      (err, stdout) => {
        const saida = (stdout || "").trim();
        if (saida.startsWith("OK")) {
          resolve({ ok: true, mensagem: ligar ? "Automação ligada." : "Automação desligada." });
        } else {
          const det = saida.replace(/^ERRO:\s*/, "");
          resolve({
            ok: false,
            mensagem:
              "Não consegui mexer no Agendador" +
              (det ? `: ${det}` : ".") +
              " Se for permissão, abra o painel como administrador.",
          });
        }
      }
    );
  });
}

// Catálogo fechado de ações executáveis.
const ACOES = {
  "rodar-resumo": {
    confirma: true,
    titulo: "Rodar o Resumo Matinal agora?",
    detalhe: "Vai ler suas caixas das últimas 24h e abrir o pop-up na tela. Leva ~1 min.",
    run: async () => {
      // MESMO comando da tarefa agendada de 7:55 / logon (Run-DailyBrief.ps1), só que com -Force
      // pra sempre recoletar. No fim ele abre o Show-BriefPopup — o MESMO pop-up de todo dia.
      dispararPs1("scripts\\daily-brief\\Run-DailyBrief.ps1", ["-Force"], "resumo-matinal");
      return { ok: true, mensagem: "Resumo iniciado — o pop-up de todo dia abre em ~1 min. Atualizo o status sozinho." };
    },
  },
  "mostrar-resumo": {
    confirma: false,
    titulo: "Abrir o Resumo Matinal",
    detalhe: "Abre o pop-up do último resumo já gerado (não recoleta).",
    run: async () => {
      // Abre o pop-up NATIVO com o último resumo salvo — o mesmo de todo dia, sem recoletar.
      dispararPs1("scripts\\daily-brief\\Mostrar-Resumo.ps1");
      return { ok: true, mensagem: "Abrindo o pop-up do Resumo Matinal…" };
    },
  },
  "rodar-skool": {
    confirma: true,
    titulo: "Rascunhar respostas do Skool agora?",
    detalhe: "Lê a comunidade e rascunha as respostas na sua voz. Não publica nada. Pode levar 1-2 min.",
    run: async () => {
      dispararPs1("scripts\\skool\\Run-Skool.ps1", [], "skool");
      return { ok: true, mensagem: "Rascunhos do Skool em andamento. Quando terminar, clique em 'Ver últimos rascunhos'." };
    },
  },
  "rodar-triagem": {
    confirma: true,
    titulo: "Rodar a Triagem de E-mail agora?",
    detalhe: "Passa pelas DUAS caixas — Gmail (sua voz) e atendimento no Zoho (voz da equipe) —, categoriza nos 6 labels e rascunha as respostas. Não envia nada (L2). Leva ~2-4 min; depois confira os labels e rascunhos nas duas caixas.",
    run: async () => {
      // Mesmo wrapper da tarefa das 7:55, mas com -SemResumo: roda o Gmail (triar.mjs) e encadeia o Zoho
      // (Run-Triagem-Zoho.ps1), SEM abrir o pop-up do Resumo Matinal (a corrente completa Gmail→Zoho→Resumo
      // é só na tarefa agendada, que roda o wrapper sem flag).
      dispararPs1("scripts\\triagem-email\\Run-Triagem.ps1", ["-SemResumo"], "triagem-email");
      return { ok: true, mensagem: "Triagem iniciada (Gmail + Zoho) — em alguns minutos os labels e rascunhos aparecem nas duas caixas. Clique em 'Ver log' pra acompanhar." };
    },
  },
  "toggle-triagem": {
    confirma: true,
    titulo: (p) => (p.ligar ? "Religar a Triagem de E-mail?" : "Desligar a Triagem de E-mail?"),
    detalhe: (p) =>
      p.ligar
        ? "Volta a categorizar e rascunhar sozinha de manhã."
        : "Para de rodar sozinha de manhã. Você ainda pode rodar na mão pelo botão.",
    run: async (p) => alternarTarefa("AIOS - Triagem de E-mail", !!p.ligar),
  },
  "toggle-resumo": {
    confirma: true,
    titulo: (p) => (p.ligar ? "Religar o Resumo Matinal?" : "Desligar o Resumo Matinal?"),
    detalhe: (p) =>
      p.ligar
        ? "Volta a rodar sozinho de manhã."
        : "Para de rodar sozinho de manhã. Você ainda pode rodar na mão pelo botão.",
    run: async (p) => alternarTarefa("AIOS - Resumo Matinal", !!p.ligar),
  },
  "toggle-yt": {
    confirma: true,
    titulo: (p) => (p.ligar ? "Religar a Auto-Descrição do YouTube?" : "Desligar a Auto-Descrição do YouTube?"),
    detalhe: (p) =>
      p.ligar
        ? "Volta a descrever e publicar nos vídeos novos automaticamente."
        : "Para de publicar descrição nos vídeos novos. Atenção: vídeos novos vão ficar sem descrição até religar.",
    run: async (p) => alternarTarefa("AIOS - YT Auto Descricao", !!p.ligar),
  },
};

async function executar(id, params = {}) {
  const acao = ACOES[id];
  if (!acao) return { ok: false, mensagem: "Ação desconhecida." };
  try {
    return await acao.run(params);
  } catch (e) {
    return { ok: false, mensagem: "Falhou ao executar: " + e.message };
  }
}

module.exports = { executar, ACOES, execucoesAtivas };
