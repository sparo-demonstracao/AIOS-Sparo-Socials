// Post: Fable 5 banido pelo governo dos EUA (notícia real jun/2026).
// INTENÇÃO: entreter + informar (a história já é fascinante). SEM moral de venda.
// Fecho natural, leve — convida quem curtiu, sem empurrar.
window.buildSlides = function () {
  setTotal(6);
  return [
    // 1 — CAPA (gancho: stakes + lacuna de curiosidade)
    coverSlide({
      eyebrow: 'Aconteceu agora · jun/2026',
      titulo: 'Banida<br>em 72h',
      sub: 'A IA mais poderosa do mundo foi desligada.',
      titleSize: 158,
    }),

    // 2 — O QUE ERA (set up)
    bodySlide({
      kicker: 'O que era',
      titulo: 'A IA mais avançada já feita',
      claim: 'Dia 9 de junho a Anthropic liberou o Fable 5 pro público. Muita gente chamou de a IA mais poderosa de todas.',
      mock: mockChat([
        { de: 'user', txt: 'Faz isso que nenhuma IA conseguiu até hoje 👀' },
        { de: 'ia', txt: 'Feito. E ainda melhorei 3 coisas que você nem tinha pedido.' },
      ]),
      spec: { tag: '9 jun 2026', titulo: 'lançado', sub: 'Aberto pro mundo todo.' },
      foot: 'A expectativa estava nas alturas.',
    }),

    // 3 — O QUE ACONTECEU (twist 1)
    bodySlide({
      kicker: '72 horas depois',
      titulo: 'O governo mandou desligar',
      claim: 'O governo dos EUA emitiu uma ordem de emergência. A Anthropic teve que desligar a IA — no mundo inteiro.',
      mock: mockBrowser(`
        <div style="display:flex;gap:10px;align-items:center">
          <span style="background:#E0245E;color:#fff;font-family:'Space Grotesk';font-weight:700;font-size:20px;padding:6px 14px;border-radius:8px">URGENTE</span>
          <span style="font-family:'Space Grotesk';font-size:22px;color:#75695A">12 jun 2026 · 17:21 ET</span>
        </div>
        <div style="font-family:'Archivo';font-weight:800;font-size:39px;color:#16130F;line-height:1.15;margin-top:20px">EUA mandam a Anthropic desligar o Fable 5 — no mundo todo</div>
        <div style="font-family:'Archivo';font-weight:500;font-size:25px;color:#75695A;line-height:1.4;margin-top:16px">Ordem de segurança nacional. Cumprimento imediato.</div>`),
      spec: { tag: 'jun/2026', titulo: 'desligada', sub: 'Em questão de horas.' },
      foot: 'Do dia pra noite, simplesmente sumiu.',
    }),

    // 4 — POR QUÊ (informa)
    bodySlide({
      kicker: 'Por quê',
      titulo: 'Ficou poderosa demais',
      claim: 'Pesquisadores forçaram a IA e ela acabou revelando informação que dava pra usar em ataques. Virou caso de segurança nacional.',
      mock: mockTerminal([
        'Pesquisadores testam os limites do Fable 5',
        'A IA dribla as próprias travas',
        '>Revela informação sensível demais',
        '>Governo classifica como risco nacional',
        '>Ordem: desligar tudo',
      ]),
      spec: { tag: 'motivo', titulo: 'poder demais', sub: 'Forte o bastante pra preocupar.' },
      foot: 'Quanto mais poderosa a IA, mais ela vira alvo.',
    }),

    // 5 — O DETALHE MAIS DOIDO (payoff de entretenimento)
    bodySlide({
      kicker: 'O detalhe mais doido',
      titulo: 'Ninguém escapou',
      claim: 'Como não dava pra checar a nacionalidade de cada usuário em tempo real, desligaram pra TODO MUNDO — inclusive os próprios americanos.',
      mock: mockBrowser(`
        <div style="text-align:center;padding:14px 0">
          <div style="font-family:'Archivo';font-weight:900;font-size:104px;color:#DD5731;line-height:1;letter-spacing:-.02em">TODOS.</div>
          <div style="font-family:'Archivo';font-weight:600;font-size:30px;color:#16130F;margin-top:16px;line-height:1.3">Centenas de milhões de usuários perderam acesso de uma vez</div>
          <div style="font-family:'Space Grotesk';font-size:22px;color:#75695A;margin-top:14px">inclusive nos EUA · sem aviso prévio</div>
        </div>`),
      foot: 'A IA mais avançada do mundo, offline pra todo planeta. 🌍',
    }),

    // 6 — CTA (leve e natural, sem pitch)
    ctaSlide({
      bio: 'Esse mundo de IA muda toda semana — e eu adoro acompanhar de perto. Se você curte, cola comigo por aqui. 🔗',
    }),
  ];
};
