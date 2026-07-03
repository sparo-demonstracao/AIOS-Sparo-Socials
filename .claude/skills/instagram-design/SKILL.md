---
name: instagram-design
description: Use quando o Enzo der um TEMA (notícia, atualização, novidade sobre IA / Claude Code / Antigravity / automação) e quiser TRANSFORMAR num POST de carrossel pro Instagram — capa + slides + legenda, na identidade visual @enzosparo. Gera o design (motor local + empurra pro Claude Design), cria imagem no Higgsfield só quando o tema pedir, dá uma NOTA de qualidade ao post e melhora se ficar abaixo do corte, e entrega tudo pronto pra revisar. Dispare mesmo sem a palavra "skill", ex.: "faz um post sobre isso", "vi essa notícia, vira um carrossel", "cria um post de Instagram sobre o Claude X", "transforma essa atualização num post", "post pro insta sobre [tema]". NÃO confundir com /instagram-post (essa é pra VÍDEO/Reels: capa + legenda de um vídeo local). Esta aqui parte de um TEMA e gera um CARROSSEL do zero. L2 — nada é publicado, só rascunho.
bike-method-phase: 1  # Fase 1 — rode na mão e valide UNS posts antes de virar rotina/agendar.
---

## O que esta skill faz

Recebe um **tema de atualidade** (uma notícia, um lançamento, uma atualização do Claude Code /
Antigravity, uma novidade de IA) e devolve um **post de carrossel pronto pra revisar e postar** na
identidade visual do @enzosparo — o mesmo estilo do carrossel "5 Níveis de IA".

Objetivo do post: **engajamento e relevância** pro perfil. Sempre com gancho forte, linguagem de
leigo e CTA que convida a salvar / comentar / seguir.

## ⚠️ A LEI Nº 1: a capa e o título são o post

A pessoa **só vê o carrossel se a PRIMEIRA imagem a fisgar.** No feed ela decide em < 1 segundo se
vale "perder tempo" deslizando. Se a capa não cria uma curiosidade que ela **não pode deixar de
ver**, o resto dos slides não existe — ninguém chega neles.

Por isso, **desenhe a capa PRIMEIRO e gaste nela a maior parte do esforço.** Trate o título da capa
como o ativo mais importante do post inteiro. Regras:

- **Pare o dedo.** A capa tem que provocar tensão, curiosidade ou um "como assim?" imediato.
- **Lacuna de curiosidade** (curiosity gap): mostre que existe algo valioso que ela ainda **não
  sabe** — e que vai descobrir deslizando. Prometa um resultado, um atalho, um erro evitado, um
  "ninguém te conta isso".
- **Tem que ter o que está em jogo (stakes / FOMO):** "se você ignora isso, está ficando pra trás".
- **Específico bate genérico:** número, resultado concreto, antes/depois. ("Automatizei 8h de
  trabalho por semana" > "Automação é incrível").
- **Ângulos que funcionam:** contrarian/mito ("Você está usando IA errado"), o erro ("O erro que
  90% comete ao começar"), o segredo ("O que ninguém te conta sobre o Claude Code"), a promessa
  ("Como fazer X em 5 min, sem código"), a novidade urgente ("Saiu agora: o Claude faz Y").
- **Curto e legível no grid:** o título tem que bater à distância, no tamanho de miniatura. Poucas
  palavras, fonte gigante.
- **Imagem-conceito quando ampliar a parada** (Higgsfield) — uma capa visual forte para mais o dedo
  que texto sobre fundo. Decida slide a slide.

Se a capa não passa nesse teste, **o post não sai** (ver o PORTÃO na rubrica). Refaça a capa antes
de qualquer outra coisa.

## ⚠️ A LEI Nº 2: entreter e informar — NÃO vender

O post tem que se sustentar sozinho como **conteúdo interessante**: uma história boa, um fato que a
pessoa não sabia, algo que diverte ou surpreende. **Não transforme o tema num argumento de venda.**
Erros a evitar:

- **Não vire a notícia numa "lição" que leva ao seu curso.** Conte a história pela história. Se o
  tema é uma novidade, entregue a novidade bem contada — não force uma moral do tipo "e é por isso
  que você precisa aprender comigo".
- **Sem slide de pitch.** Nada de "o que isso significa pra você → contrata o Enzo". O valor é o
  próprio conteúdo.
- **CTA leve e natural.** O fecho convida quem **já curtiu** — sem empurrar. Tom: "se você curte
  esse tipo de coisa, cola comigo / eu adoro acompanhar e compartilhar isso aqui". Algo que soa como
  uma pessoa real falando, não um anúncio. O "Salve / Compartilhe / Siga" pode ficar (é engajamento
  normal), mas a frase de bio é um convite, não uma oferta.
- **Pergunta-se sempre:** "se eu tirar qualquer menção ao Enzo/curso, esse post ainda é bom de ver?"
  Se a resposta for não, o post está apoiado em venda — reescreva.

Entrega, em uma rodada:

1. **Slides PNG** (1080×1350 @2× = 2160×2700), numerados `slide-01.png` … `slide-NN.png`.
2. **Legenda + 1º comentário** na voz do Enzo (gancho → valor → CTA → hashtags).
3. **Nota de qualidade** (rubrica abaixo) — e o post **melhorado** se ficar abaixo do corte.
4. O post **empurrado pro Claude Design** (pra editar no navegador depois, se quiser).
5. (opcional) Subido pro **Google Drive** em `instagram/<nome-do-post>/`.

Autonomia **L2 (Rascunha)**: a IA monta tudo, **mostra**, e o Enzo aprova/edita/posta. **Nada vai
pro Instagram sozinho.** Regra do CLAUDE.md: não fingir a voz do Enzo em conteúdo externo sem
mostrar rascunho primeiro.

## O motor de design (o que é mecânico) — `references/instagram/engine/`

A identidade visual é um **motor reutilizável** (não precisa redesenhar do zero):

- `base.html` — o motor. Define o tema fixo (paleta coral, fonte Archivo/Space Grotesk/Newsreader,
  faixa/ribbon, paginador `@enzosparo N/total`, fundo de grade) e os **builders de slide** (abaixo).
  **Não edite.** Ele renderiza `window.buildSlides()`.
- `slides.js` — **o conteúdo do post** (você escreve isto). Define `window.buildSlides()` retornando
  um array de slides montados com os builders.
- `avatar.js` — a foto do Enzo (usada no slide de CTA).
- `render-carousel.mjs` — captura cada slide em PNG @2× via Playwright.

**Builders disponíveis** (use no `buildSlides`; chame `setTotal(N)` primeiro com o nº de slides):

| Builder | Pra quê |
|---|---|
| `coverSlide({eyebrow, titulo, sub, titleSize, hero})` | **Capa** (slide 1). `hero` = caminho de imagem (Higgsfield) → vira fundo com gradiente escuro e texto branco. Sem `hero` = fundo de grade. `titulo` aceita `<br>`. |
| `bodySlide({kicker, titulo, claim, mock, spec, foot})` | Slide de conteúdo: título + claim + um **mockup** + cartão de spec opcional + rodapé. |
| `listSlide({titulo, itens:[{titulo, sub}]})` | Lista numerada (3–5 itens). |
| `quoteSlide({texto, fonte})` | Declaração/citação forte, texto grande em serifa. |
| `ctaSlide({l1, l2, l3, bio})` | **CTA final**: Salve/Compartilhe/Siga + pílula @enzosparo + frase de bio. |

**Mockups** (pro `mock` do `bodySlide`): `mockChat([{de:'user'|'ia', txt}])`, `mockTerminal(['linha ok','>linha pendente'])`, `mockBrowser(html, dark?)`, `mockImage(src)`.

### Como renderizar (passo mecânico)

1. Crie a pasta do post: `C:\tmp\aios-instagram-posts\<id>\` (id = `AAAAMMDD-slug`).
2. Copie pra ela: `base.html`, `avatar.js` (de `references/instagram/engine/`).
3. Escreva o `slides.js` na pasta (o conteúdo — isto é o coração, quem faz é o Claude).
4. Copie o render pra dentro de `scripts/baixar-aulas/` (o ESM ignora NODE_PATH — tem que rodar de
   lá) e rode:
   ```bash
   cp "references/instagram/engine/render-carousel.mjs" "scripts/baixar-aulas/render-carousel.mjs"
   cd "scripts/baixar-aulas" && node render-carousel.mjs "C:/tmp/aios-instagram-posts/<id>"
   ```
   Saem `slide-01.png` … na própria pasta do post.

## O fluxo (a skill orquestra)

**Passo 1 — Entender o tema + pesquisar.** Use `WebSearch` pra pegar o que há de concreto e atual
sobre o tema. Ache o **ângulo pro nicho**: o público são leigos em programação querendo aprender
automação (donos de PME, futuros donos de agência, profissionais que querem automatizar o trabalho).
Sempre conecte o tema a **Claude Code / Antigravity / automação sem código**. Leia `references/voice.md`
e `context/` se precisar afinar a voz. **Honestidade:** se a "notícia" não tiver nada concreto por
trás, diga e peça mais contexto — não invente fato.

**Passo 2 — Roteirizar o carrossel (estrutura flexível). COMECE PELA CAPA.** Antes de qualquer
slide, trave o **título da capa** que para o dedo (ver "LEI Nº 1" acima) — gere 3–5 opções de
gancho e escolha a mais irresistível. Só depois roteirize o corpo. Escolha a estrutura que o tema
pede (5–8 slides costuma ser o ideal):
- **Capa** (o gancho — o ativo mais importante: promete algo / cria tensão / lacuna de curiosidade).
- **Corpo** (3–6 slides): explique, mostre o "antes/depois", liste, compare mito × verdade, mostre
  o passo a passo. Use mockups pra ilustrar (chat, terminal, navegador).
- **CTA** (último): salve/compartilhe/siga + bio.
Regras de voz: **português BR, leigo, frases curtas, direto. SEMPRE "você/seu/sua" (e "te"), NUNCA
"tu/teu/tua".** Sem jargão técnico solto.

**Passo 3 — Imagem (só se o tema pedir).** Se a capa pede uma imagem-conceito (hero), gere no
**Higgsfield** (ver [[higgsfield-cli]]): `hf generate create gpt_image_2 --prompt "..." --quality low
--resolution 1k --aspect_ratio 3:4 --wait --json`, baixe o `result_url` como `hero.png` na pasta do
post e passe `hero:'hero.png'` no `coverSlide`. Estética da marca: limpa, editorial, com a estrela
coral do Claude / formas 3D quando fizer sentido. Pra fundos com a identidade da Sparo, considere o
[[fundos-3d-instagram]] em vez do Higgsfield. **Se o tema não pede imagem, use o fundo de grade** (é
o padrão e já é bonito).

**Passo 4 — Montar e renderizar.** Escreva o `slides.js`, renderize (passo mecânico acima), e
**olhe os PNGs** (leia as imagens) pra conferir que nada estourou (texto cortado, sobreposição,
linha demais). Ajuste o `slides.js` e re-renderize se preciso.

**Passo 5 — Avaliar a qualidade (rubrica) e melhorar.** Dê uma nota honesta de **0 a 10** em cada
critério, calcule a **média ponderada**, e mostre ao Enzo:

| Critério | Peso | Pergunta |
|---|---|---|
| 🚪 **Gancho da capa** | **PORTÃO** | A PRIMEIRA imagem para o dedo e cria uma curiosidade que a pessoa **não pode deixar de ver** em < 1s? |
| Clareza p/ leigo | 2,0 | Alguém que não é de tech entende, sem jargão? |
| Valor / insight | 1,5 | Ensina algo real? Não é raso nem óbvio? |
| Relevância pro nicho | 1,5 | Conecta com automação / Claude Code / Antigravity e com a dor do público? |
| Visual | 1,5 | Identidade certa, legível, hierarquia boa, nada estourado? |
| CTA / engajamento | 1,5 | Convida a salvar/comentar/seguir de um jeito **natural** (não vendedor — LEI Nº 2)? Tem pergunta que gera comentário? |
| 🎭 Entretém sem vender | (veto) | Se eu tirar o Enzo/curso, o post ainda é bom de ver? Se **não**, reprova — está apoiado em venda. |

**O Gancho da capa é um PORTÃO, não um peso.** Dê nota de 0 a 10 só pra capa primeiro. **Se a capa
tirar menos de 8, o post REPROVA na hora** — não importa o quão bom é o resto. Refaça a capa (título
e/ou imagem) e só siga quando ela passar. Esse é o critério que mais mexe no resultado real do post:
trate-o como inegociável.

Depois do portão, **nota final = média ponderada dos outros 5 critérios (/10). Corte = 8,5.** Se
ficar abaixo, identifique o **pior critério**, refaça o que for preciso e re-renderize. **Máximo 2
iterações**; depois entregue com a nota e diga honestamente o que ainda dá pra melhorar.

**Passo 6 — Legenda + 1º comentário.** Escreva na voz do Enzo (e siga a **LEI Nº 2** — conta a
história, não vende):
- **Legenda**: gancho na 1ª linha → a história/o fato bem contado em frases curtas → **fecho leve e
  natural** (convite, não oferta) → 5–12 hashtags (mistura amplas + de nicho: #automação #ia
  #claudecode #antigravity #nocode #produtividade + do tema).
- **1º comentário**: uma pergunta leve que puxa conversa (ex.: "você chegou a usar?" / "o que você
  faria?") — entretenimento, não isca de venda.

**Passo 7 — Empurrar pro Claude Design.** Via MCP `DesignSync` (login claude.ai): garanta um projeto
do tipo design-system "Sparo · Posts Instagram" (crie na 1ª vez com `create_project`; guarde o
`projectId` em `references/instagram/engine/claude-design.json`). `finalize_plan` + `write_files`
gravando, em `posts/<id>/`: `base.html`, `slides.js`, `avatar.js`, `hero.png` (se houver). Marque o
`base.html` como card (primeira linha `<!-- @dsCard group="Posts Instagram" -->`) pra aparecer no
painel do Design. Assim o Enzo abre e ajusta no navegador quando quiser.

**Passo 8 — Drive (opcional, se o Enzo pedir ou por padrão).** Suba os PNGs pro Drive com `gws`
(ver `references/gws-cli.md`): crie/use a pasta `instagram`, uma subpasta com o nome do post, e
`gws drive files create --upload <png> --json '{"name":"slide-NN.png","parents":["<idSub>"]}'`.

**Passo 9 — Registrar pro painel (pra ver no app AIOS).** Grave o manifesto (contrato abaixo) pra
o post aparecer na seção Instagram do painel.

**Passo 10 — Mostrar tudo (L2).** Apresente: os slides, a nota, a legenda + 1º comentário, e os
links (Drive/Claude Design). **Pare aqui.** O Enzo aprova/edita/posta na mão.

## Contrato com o painel (app AIOS)

Cada post gera um manifesto pra o painel listar na seção **Instagram**:

- Pasta do post: `C:\tmp\aios-instagram-posts\<id>\` com os `slide-NN.png` + `post.json`.
- `post.json`:
  ```json
  {
    "id": "20260626-claude-na-nuvem",
    "titulo": "Claude na nuvem",
    "tema": "<o tema cru que o Enzo deu>",
    "criadoEm": "2026-06-26T21:00:00-03:00",
    "status": "rascunho",
    "nota": 9.1,
    "slides": ["slide-01.png", "slide-02.png", "..."],
    "legenda": "…",
    "comentario": "…",
    "drive": "https://drive.google.com/drive/folders/…",
    "claudeDesign": "posts/20260626-claude-na-nuvem"
  }
  ```
- Índice: acrescente o post ao topo do array em `C:\tmp\aios-instagram-posts\index.json` (crie `[]`
  se não existir). O painel lê esse índice pra montar o feed (mais recente primeiro).

## O que esta skill NÃO faz

- **Não publica no Instagram.** L2 — só rascunho. Não há API de publicação conectada.
- **Não inventa notícia.** Se não houver fato concreto, sinaliza e pede contexto.
- **Não entrega post abaixo do corte sem avisar.** Se depois de 2 melhorias ainda ficar < 8,5, diz
  a nota e o que falta — não maquia.
- **Não posta sozinho nem agenda** (ainda é Fase 1 do bike method).

## Roadmap — mesma ideia pra Skool e YouTube (em breve)

O Enzo quer o mesmo motor pra **Skool** (post/conteúdo da comunidade) e **YouTube** (ideia/roteiro/
thumbnail a partir de um tema). Quando for construir: reaproveite o motor e a rubrica, troque só o
formato de saída (texto longo + imagem pro Skool; título + roteiro + thumb pro YouTube — ver
`/thumbnail-youtube`). Manter o mesmo contrato de manifesto pro painel listar os três canais.

## KPI (por que isto existe)

Sustenta as metas do trimestre: **lançar o Instagram** e **ser constante**. Tira o atrito de
transformar uma notícia/novidade num carrossel bonito e na voz certa. Métrica: **tempo de "vi um
tema" até "post pronto pra publicar"** — de horas de design pra minutos de revisão.
