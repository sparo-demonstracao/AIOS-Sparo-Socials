// registro.js — A fonte da verdade sobre o que o AIOS do Enzo faz.
//
// Cada automação descrita aqui vira um card no painel. O coletor (coletor.js) usa
// os campos `taskName`, `logFile`, `outputFile` e `stateFile` para descobrir, em
// tempo real, se a automação está ligada, quando rodou pela última vez e qual foi
// o resultado. As `acoes` viram botões no front (toda ação que executa algo pede
// confirmação antes de rodar).
//
// Para ensinar uma capacidade nova ao painel, basta acrescentar um objeto aqui.

// Níveis de autonomia (Regra do Estagiário): quanto o AIOS faz sozinho.
const NIVEIS = {
  L1: { label: "L1 · Sugere", cor: "cinza", desc: "Só sugere. Você decide e faz." },
  L2: { label: "L2 · Rascunha", cor: "azul", desc: "Rascunha pra você revisar. Nada sai sem você." },
  L3: { label: "L3 · Faz e avisa", cor: "ambar", desc: "Executa e te avisa depois." },
  L4: { label: "L4 · Publica direto", cor: "vermelho", desc: "Age sozinho, sem revisão. Cuidado." },
};

const AUTOMACOES = [
  {
    id: "resumo-matinal",
    nome: "Resumo Matinal",
    emoji: "🌅",
    acento: "#F5A623",
    tipo: "agendada", // agendada | continua | manual
    resumo:
      "Junta o que importa das últimas 24h — WhatsApp, Gmail e comentários do YouTube — e mostra num pop-up priorizado, na sua voz.",
    comoFunciona:
      "Roda sozinho às 7:55 — e também quando você liga o PC, se ainda não tiver rodado hoje. O que vier primeiro coleta; o resto reaproveita. Lê suas caixas de entrada, pede pro AIOS escolher o que precisa de ação e abre o pop-up. Você pode forçar uma atualização a qualquer hora pelo botão.",
    taskName: "AIOS - Resumo Matinal",
    horario: "Todo dia · 7:55 + ao ligar o PC",
    fontes: ["WhatsApp", "Gmail", "YouTube"],
    nivel: "L2",
    escreve: false,
    skill: "/daily-brief",
    logFile: "C:\\tmp\\aios-daily-brief.log",
    outputFile: "C:\\tmp\\aios-brief.json", // resultado estruturado (o resumo em si)
    acoes: [
      { id: "rodar-resumo", label: "Rodar agora", tipo: "run", confirma: true, icone: "play" },
      { id: "mostrar-resumo", label: "Ver último resumo", tipo: "abrir-resumo", confirma: false, icone: "eye" },
      { id: "ver-log-resumo", label: "Ver log", tipo: "ver-log", confirma: false, icone: "doc" },
      { id: "toggle-resumo", label: "Ligar / desligar", tipo: "toggle", confirma: true, icone: "power" },
    ],
  },
  {
    id: "yt-auto-descricao",
    nome: "YouTube · Auto-Descrição",
    emoji: "🎬",
    acento: "#E0245E",
    tipo: "continua",
    resumo:
      "A cada vídeo novo no canal, escreve a descrição completa — resumo, capítulos por tempo e hashtags — e publica direto.",
    comoFunciona:
      "Verifica o canal a cada 3 minutos. Achou upload novo: baixa o áudio, transcreve local na sua GPU (Whisper) e gera resumo + capítulos + hashtags com a IA, dentro do seu template fixo. Publica via API do YouTube, sem rascunho.",
    taskName: "AIOS - YT Auto Descricao",
    horario: "Contínuo · a cada 3 min",
    fontes: ["YouTube"],
    nivel: "L4",
    escreve: true,
    skill: null,
    logFile: "scripts\\yt-auto-descricao\\log.txt",
    stateFile: "scripts\\yt-auto-descricao\\estado.json",
    acoes: [
      { id: "ver-log-yt", label: "Ver últimos ciclos", tipo: "ver-log", confirma: false, icone: "doc" },
      { id: "ver-estado-yt", label: "Vídeos processados", tipo: "ver-estado", confirma: false, icone: "list" },
      { id: "toggle-yt", label: "Ligar / desligar", tipo: "toggle", confirma: true, icone: "power" },
    ],
  },
  {
    id: "instagram-post",
    nome: "Instagram · Preparar post",
    emoji: "📸",
    acento: "#E1306C",
    tipo: "manual",
    resumo:
      "Você envia o vídeo do Reels e recebe título, legenda e 3 capas (com um texto curto) prontos pra copiar e postar.",
    comoFunciona:
      "Você escolhe o arquivo do reel aqui no app. O AIOS transcreve na sua GPU, escreve o título e a legenda na sua voz e desenha a caixa de texto em 3 frames (início / meio / fim). Você escolhe a capa, copia o texto e posta na mão. Nada vai pro Instagram sozinho (L2).",
    taskName: null, // não é agendada
    horario: "Sob demanda",
    fontes: ["Instagram"],
    nivel: "L2",
    escreve: false,
    skill: "/instagram-post",
    acoes: [
      { id: "abrir-instagram", label: "Preparar post", tipo: "abrir-instagram", confirma: false, icone: "play" },
    ],
  },
  {
    id: "instagram-design",
    nome: "Instagram · Post de tema",
    emoji: "🎨",
    acento: "#E1306C",
    tipo: "manual",
    resumo:
      "Você dá um tema (notícia/atualização sobre IA, Claude Code, Antigravity) e recebe um carrossel pronto — capa, slides e legenda — na identidade @enzosparo, com nota de qualidade.",
    comoFunciona:
      "O AIOS pesquisa o tema, acha o ângulo pro seu nicho, monta o carrossel no motor de design (e empurra pro Claude Design), gera imagem no Higgsfield só quando o tema pede, dá uma nota de qualidade ao post e melhora se ficar abaixo do corte, e escreve a legenda + 1º comentário na sua voz. Nada vai pro Instagram sozinho (L2). Os posts ficam listados aqui na seção Instagram.",
    taskName: null, // sob demanda
    horario: "Sob demanda",
    fontes: ["Instagram"],
    nivel: "L2",
    escreve: false,
    skill: "/instagram-design",
    outputFile: "C:\\tmp\\aios-instagram-posts\\index.json", // feed de posts gerados (mais recente primeiro)
    acoes: [
      { id: "ver-posts-instagram", label: "Ver posts gerados", tipo: "ver-posts-instagram", confirma: false, icone: "eye" },
    ],
  },
  {
    id: "skool",
    nome: "Skool · Respostas",
    emoji: "💬",
    acento: "#7B61FF",
    tipo: "manual",
    resumo:
      "Lê a comunidade — posts, comentários e DMs esperando retorno — e rascunha as respostas na sua voz. Você revisa e posta.",
    comoFunciona:
      "Você dispara quando quiser (ou pelo botão no resumo matinal). Lê o que está pendente no Skool, rascunha cada resposta na sua voz e te entrega pra copiar. Nada é publicado automaticamente — é só leitura e rascunho (L2).",
    taskName: null, // não é agendada
    horario: "Sob demanda",
    fontes: ["Skool"],
    nivel: "L2",
    escreve: false,
    skill: "/skool",
    logFile: "C:\\tmp\\aios-skool.log",
    outputFile: "C:\\tmp\\aios-skool.json",
    acoes: [
      { id: "rodar-skool", label: "Rascunhar respostas", tipo: "run", confirma: true, icone: "play" },
      { id: "ver-skool", label: "Ver últimos rascunhos", tipo: "ver-skool", confirma: false, icone: "eye" },
      { id: "ver-log-skool", label: "Ver log", tipo: "ver-log", confirma: false, icone: "doc" },
    ],
  },
  {
    id: "triagem-email",
    nome: "Triagem de E-mail",
    emoji: "📧",
    acento: "#3B5BFF",
    tipo: "agendada",
    resumo:
      "Categoriza as DUAS caixas — Gmail (sua voz) e atendimento no Zoho (voz da equipe) — nos 6 labels, pesquisa a relevância das parcerias e rascunha as respostas, menos em Médio e Sem Importância.",
    comoFunciona:
      "Roda sozinha todo dia às 7:55 — e também quando você liga o PC, se estava desligado nesse horário. Passa pelas DUAS caixas: o Gmail (na sua voz, com pesquisa de parceria na web) e o atendimento no Zoho (na voz da equipe Sparo). Ignora automação e duplicado, escolhe a categoria (Haiku) e rascunha (Sonnet 4.6) via OpenRouter — Gmail pelo gws, Zoho pela API REST. Só mexe no que ainda não foi triado, então não duplica. Nada é enviado (L2). As parcerias ranqueadas por relevância ficam na página Parcerias.",
    taskName: "AIOS - Triagem de E-mail",
    horario: "Todo dia · 7:55 + ao ligar o PC",
    fontes: ["Gmail", "Zoho"],
    nivel: "L2",
    escreve: false,
    skill: "/triagem-email",
    pagina: "/parcerias.html",
    logFile: "C:\\tmp\\aios-triagem-email.log",
    outputFile: "C:\\tmp\\aios-triagem-email.json",
    acoes: [
      { id: "rodar-triagem", label: "Rodar agora", tipo: "run", confirma: true, icone: "play" },
      { id: "ver-log-triagem", label: "Ver log", tipo: "ver-log", confirma: false, icone: "doc" },
      { id: "toggle-triagem", label: "Ligar / desligar", tipo: "toggle", confirma: true, icone: "power" },
    ],
  },
];

// Skills que NÃO são automações rodando, mas capacidades que você pode pedir.
// O coletor enriquece isto lendo o frontmatter de cada SKILL.md. Aqui ficam só os
// rótulos amigáveis e a ordem.
const SKILLS_CATALOGO = [
  { id: "roteiro-aula", emoji: "📝", grupo: "Conteúdo" },
  { id: "level-up", emoji: "⚡", grupo: "Operação" },
  { id: "audit", emoji: "🔎", grupo: "Operação" },
  { id: "obsidian", emoji: "🧠", grupo: "Conhecimento" },
  { id: "daily-brief", emoji: "🌅", grupo: "Operação" },
  { id: "skool", emoji: "💬", grupo: "Conteúdo" },
  { id: "instagram-post", emoji: "📸", grupo: "Conteúdo" },
  { id: "instagram-design", emoji: "🎨", grupo: "Conteúdo" },
  { id: "triagem-email", emoji: "📧", grupo: "Operação" },
  { id: "onboard", emoji: "🧩", grupo: "Operação" },
];

module.exports = { NIVEIS, AUTOMACOES, SKILLS_CATALOGO };
