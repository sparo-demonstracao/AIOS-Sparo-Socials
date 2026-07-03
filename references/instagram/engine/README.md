# Motor de carrossel do Instagram (@enzosparo)

Identidade visual reutilizável pros posts de carrossel da Sparo. Usado pela skill `/instagram-design`.
Mesma linguagem do carrossel "5 Níveis de IA": paleta **coral** (`#DD5731`), fonte **Archivo** (títulos),
**Space Grotesk** (mono/paginador), **Newsreader** (itálico/citação), **faixa/ribbon** no canto,
**paginador** `@enzosparo N/total`, **fundo de grade**. Tudo **1080×1350** (4:5), capturado em **2×**
(2160×2700).

## Arquivos

| Arquivo | O que é |
|---|---|
| `base.html` | O motor. Tema fixo + builders de slide. **Não edite.** Renderiza `window.buildSlides()`. |
| `slides.js` | O **conteúdo do post** (você escreve um por post). Define `window.buildSlides()`. |
| `avatar.js` | Foto do Enzo (slide de CTA). `window.AVATAR` = data URI. |
| `render-carousel.mjs` | Captura cada slide em PNG @2× (Playwright). |

## Como usar

```bash
# 1) pasta do post + assets do motor
mkdir -p "C:/tmp/aios-instagram-posts/<id>"
cp references/instagram/engine/base.html  "C:/tmp/aios-instagram-posts/<id>/"
cp references/instagram/engine/avatar.js  "C:/tmp/aios-instagram-posts/<id>/"
# 2) escreva o slides.js na pasta do post (o conteúdo)
# 3) renderize — TEM que rodar de dentro de scripts/baixar-aulas (ESM ignora NODE_PATH)
cp references/instagram/engine/render-carousel.mjs scripts/baixar-aulas/render-carousel.mjs
cd scripts/baixar-aulas && node render-carousel.mjs "C:/tmp/aios-instagram-posts/<id>"
# saem slide-01.png … na pasta do post
```

## slides.js — exemplo

```js
window.buildSlides = function () {
  setTotal(5);                       // nº de slides — chame ANTES dos builders
  return [
    coverSlide({ eyebrow:'Novidade', titulo:'Claude<br>na nuvem', sub:'O que muda pra você?', titleSize:130 }),
    bodySlide({
      kicker:'O que é', titulo:'Roda sem o PC ligado',
      claim:'A IA executa num servidor — você fecha o notebook e ela continua.',
      mock: mockChat([{de:'user',txt:'Resolve isso enquanto eu durmo 😴'},{de:'ia',txt:'Pode deixar.'}]),
      spec:{ tag:'cloud', titulo:'autônomo 24/7', sub:'Sem depender da sua máquina.' },
      foot:'É o que separa quem testa de quem opera.',
    }),
    listSlide({ titulo:'3 coisas que isso destrava', itens:[
      {titulo:'Tarefas longas', sub:'Roda por horas sem travar seu PC.'},
      {titulo:'Agendamento real', sub:'Dispara sozinho no horário.'},
      {titulo:'Escala', sub:'Vários trabalhos ao mesmo tempo.'},
    ]}),
    quoteSlide({ texto:'A IA não vai tomar o seu lugar. Mas alguém usando IA, talvez.', fonte:'@enzosparo' }),
    ctaSlide({ bio:'Eu te ensino a montar isso do zero, sem código. Tá tudo na bio. 🔗' }),
  ];
};
```

## Builders

- `coverSlide({eyebrow, titulo, sub, titleSize, hero})` — capa (slide 1). `hero` = caminho de imagem
  (vira fundo escuro c/ texto branco); sem `hero` = fundo de grade. `titulo` aceita `<br>`.
- `bodySlide({kicker, titulo, claim, mock, spec, foot})` — conteúdo c/ mockup + cartão de spec.
- `listSlide({titulo, itens:[{titulo, sub}]})` — lista numerada.
- `quoteSlide({texto, fonte})` — citação/declaração forte.
- `ctaSlide({l1, l2, l3, bio})` — CTA final.

**Mockups** (pro `mock`): `mockChat([{de,txt}])` · `mockTerminal(['ok','>pendente'])` ·
`mockBrowser(html, dark?)` · `mockImage(src)`.

## Notas

- O paginador numera **na ordem de chamada** dos builders (contador automático). Chame os builders
  na ordem visual.
- O avatar atual veio de um arquivo grande e fica meio escuro no CTA — trocar por uma foto melhor
  quando der.
- Pra imagens-conceito (hero), gerar no Higgsfield (`hf`, 3:4) — ver memória `higgsfield-cli`.
