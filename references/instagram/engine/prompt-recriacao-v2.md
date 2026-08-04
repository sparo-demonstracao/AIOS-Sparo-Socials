# Prompt de recriação — carrossel estilo v2 ("5 Níveis de IA")

O HTML original da v2 foi construído em iterações no Claude Design (sem prompt único salvo).
Este prompt é a engenharia reversa do design final: cole no Claude Design (ou em qualquer
Claude) pra recriar carrosséis neste mesmo padrão. Alternativa sem prompt: a skill
`/instagram-design` usa o motor `engine/base.html`, derivado deste mesmo design.

---

Crie um carrossel de Instagram com 7 slides em HTML/CSS, um card por slide, cada um com
1080×1350 px (4:5), pensado pra ser capturado em PNG @2× (2160×2700). Identidade visual:

**Paleta e fundo**
- Coral da marca: `#DD5731` (acentos, palavras-destaque, elementos gráficos).
- Fundo "papel": `#F4EFE6` com uma grade sutil por cima (linhas de 1px em
  `rgba(20,15,10,.06)` a cada ~72px, vertical e horizontal).
- Tinta (texto principal): `#17130E`. Slides escuros pontuais: fundo `#0F0E0C`.

**Tipografia (Google Fonts)**
- Archivo — títulos e frases fortes (pesos 700–900, tracking levemente negativo).
- Space Grotesk — labels, paginador, textos "de máquina".
- Newsreader itálico — subtítulos e citações (contraste editorial).

**Componentes fixos em TODOS os slides**
- Fita/ribbon coral no canto superior esquerdo (retângulo com dobra).
- Paginador no canto superior direito: `@enzosparo` + pílula escura com `N/7`.
- Margens internas generosas (~96px).

**Slide 1 — capa**
- Imagem-conceito em tela cheia como fundo (gerada no Higgsfield; ver o prompt real da
  estátua em `references/instagram/carrossel-v2/cover-prompt.md`), com gradiente escuro
  na metade de baixo pra legibilidade.
- Eyebrow em coral (ex.: `GUIA — 5 NÍVEIS`), título gigante branco em Archivo (2–3
  palavras por linha), subtítulo curto em Newsreader itálico.

**Slides 2–6 — um nível por slide (o corpo)**
- Fundo papel com grade.
- Título: `#N: O Nome do Nível` (número em tinta, nome em coral), seguido de 1 frase de
  apoio grande em Archivo bold.
- UM mockup de interface por slide, ilustrando o nível na prática (variar entre):
  janela de navegador (barra com 3 bolinhas de semáforo, conteúdo claro), painel de
  chat com a IA (mensagens user/IA), terminal escuro com linhas de comando, lista de
  pastas/arquivos.
- Cartão "spec" flutuante sobrepondo o mockup: `enzosparo / nivel-0N`, nome do nível,
  descrição de 1 linha, medidor `autonomia N/5` com bolinhas (N em coral).
- Rodapé: 1 linha curta de reforço + seta `→` em coral.

**Slide 7 — CTA**
- Foto do Enzo (avatar circular), `Salve · Compartilhe · Siga`, pílula `@enzosparo`,
  frase de bio leve (convite, não oferta).

**Regras de texto**
- Português BR, linguagem de leigo, frases curtas. SEMPRE "você/seu/sua", nunca "tu".
- Textos dos 7 slides: usar os travados em
  `references/instagram/carrossel-niveis-textos.md`.

**Render**
- Cada slide num elemento `.slide[data-screen-label="0N"]`; sinalizar
  `window.__ready = true` quando as fontes carregarem (compatível com
  `engine/render-carousel.mjs`).
