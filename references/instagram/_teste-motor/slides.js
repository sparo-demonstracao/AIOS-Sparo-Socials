// DEMO — valida o motor base.html. Conteúdo é só teste.
window.buildSlides = function () {
  setTotal(5);
  return [
    coverSlide({
      eyebrow: 'Novidade',
      titulo: 'Claude<br>na nuvem',
      sub: 'O que muda pra você?',
      titleSize: 130,
    }),
    bodySlide({
      kicker: 'O que é',
      titulo: 'Roda sem o PC ligado',
      claim: 'A IA executa suas tarefas num servidor — você fecha o notebook e ela continua.',
      mock: mockChat([
        { de: 'user', txt: 'Resolve isso enquanto eu durmo 😴' },
        { de: 'ia', txt: 'Pode deixar. Te aviso quando terminar — mesmo com seu PC desligado.' },
      ]),
      spec: { tag: 'cloud', titulo: 'autônomo 24/7', sub: 'Sem depender da sua máquina.' },
      foot: 'É o que separa quem testa de quem opera de verdade.',
    }),
    listSlide({
      titulo: '3 coisas que isso destrava',
      itens: [
        { titulo: 'Tarefas longas', sub: 'Roda por horas sem travar seu computador.' },
        { titulo: 'Agendamento real', sub: 'Dispara sozinho no horário certo.' },
        { titulo: 'Escala', sub: 'Vários trabalhos ao mesmo tempo.' },
      ],
    }),
    quoteSlide({
      texto: 'A IA não vai tomar o seu lugar. Mas alguém usando IA na nuvem, talvez.',
      fonte: '@enzosparo',
    }),
    ctaSlide({
      bio: 'Eu te ensino a montar isso do zero, sem código. Tá tudo na bio. 🔗',
    }),
  ];
};
