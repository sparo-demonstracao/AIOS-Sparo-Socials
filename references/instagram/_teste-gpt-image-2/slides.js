// Post: GPT Image 2 (OpenAI, lançado 21/abr/2026). Notícia/feature real.
// INTENÇÃO: entreter + informar (LEI Nº 2). Sem venda. Fecho natural.
// Ângulo: a IA finalmente acerta TEXTO na imagem — o velho pesadelo de quem cria conteúdo.
window.buildSlides = function () {
  setTotal(6);
  return [
    // 1 — CAPA (gancho: "como assim a IA não sabia escrever?")
    coverSlide({
      eyebrow: 'Saiu agora · abr/2026',
      titulo: 'A IA<br>aprendeu<br>a escrever',
      sub: 'Sério. E isso é maior do que parece. 👇',
      titleSize: 120,
    }),

    // 2 — O PROBLEMA (a dor que todo mundo reconhece)
    bodySlide({
      kicker: 'Lembra disso?',
      titulo: 'Texto de IA era uma piada',
      claim: 'Por anos a IA fazia imagem linda… com um texto que parecia outra língua. Quem já tentou sabe a dor.',
      mock: mockBrowser(`
        <div style="text-align:center;padding:26px 0">
          <div style="font-family:'Archivo';font-weight:900;font-size:70px;color:#16130F;letter-spacing:.04em;transform:skew(-4deg)">PIZZGA</div>
          <div style="font-family:'Archivo';font-weight:700;font-size:34px;color:#75695A;margin-top:8px;letter-spacing:.12em">RESTAURONT · OFFNE NQW</div>
          <div style="font-family:'Archivo';font-weight:600;font-size:26px;color:#b9b1a4;margin-top:22px">↑ a IA tentando escrever "PIZZARIA"</div>
        </div>`),
      spec: { tag: 'antes', titulo: 'letra torta', sub: 'Bonito de longe, ilegível de perto.' },
      foot: 'Pra fazer um post com texto, sobrava o velho Canva.',
    }),

    // 3 — O QUE MUDOU
    bodySlide({
      kicker: 'O que mudou',
      titulo: 'Chegou o GPT Image 2',
      claim: 'A OpenAI lançou um modelo que acerta o texto em ~99% das vezes — e em vários idiomas.',
      mock: mockBrowser(`
        <div style="text-align:center;padding:26px 0">
          <div style="font-family:'Archivo';font-weight:900;font-size:70px;color:#16130F">PIZZARIA</div>
          <div style="font-family:'Archivo';font-weight:700;font-size:32px;color:#DD5731;margin-top:8px;letter-spacing:.08em">ABERTO AGORA</div>
          <div style="font-family:'Space Grotesk';font-size:24px;color:#46b860;margin-top:22px">✓ texto certo, de primeira</div>
        </div>`),
      spec: { tag: 'agora', titulo: 'texto perfeito', sub: 'Pôster, capa, anúncio — prontos.' },
      foot: 'O que mais travava virou o ponto forte.',
    }),

    // 4 — O QUE MAIS ELE FAZ (informa)
    listSlide({
      titulo: 'E não para no texto',
      itens: [
        { titulo: '4K de resolução', sub: 'Imagem pronta até pra impressão.' },
        { titulo: '2x mais rápido', sub: 'Gera no dobro da velocidade.' },
        { titulo: 'Ele "pensa" antes', sub: 'Raciocina e se autocorrige antes de entregar.' },
        { titulo: 'Edita conversando', sub: 'Você pede a mudança em palavras.' },
      ],
    }),

    // 5 — O PULO DO GATO (o "wow")
    bodySlide({
      kicker: 'O pulo do gato',
      titulo: 'Edita igual falando com designer',
      claim: 'Gerou a imagem? É só pedir os ajustes conversando — ele muda só aquilo e mantém o resto igualzinho.',
      mock: mockChat([
        { de: 'user', txt: 'Troca o fundo pro pôr do sol e deixa o texto maior' },
        { de: 'ia', txt: 'Pronto ✅ Mexi só nisso, o resto ficou igual.' },
      ]),
      spec: { tag: 'edição', titulo: 'multi-turno', sub: 'Sem recomeçar do zero.' },
      foot: 'Parece conversa, não ferramenta.',
    }),

    // 6 — CTA (leve, natural)
    ctaSlide({
      bio: 'Eu testo essas novidades direto e mostro o que presta por aqui. Se você curte, cola comigo. 🔗',
    }),
  ];
};
