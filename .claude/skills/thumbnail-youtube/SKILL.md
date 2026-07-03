---
name: thumbnail-youtube
description: Use quando o Enzo for criar a CAPA/THUMBNAIL de um vídeo do YouTube no estilo que mais converte pra ele — pessoa à direita, navegador flutuante mostrando um site/app, logos no topo e uma faixa de texto chamativo embaixo. Dispare mesmo sem a palavra "skill", ex.: "cria uma thumb pro vídeo", "faz a capa do YouTube", "monta a thumbnail desse vídeo", "gera a thumb com esse site e essa foto", "thumbnail no meu estilo". Gera a imagem 16:9 via Higgsfield (gpt_image_2) usando a foto do Enzo + print do site + logos como referência. L2 — rascunho pra ele aprovar antes de subir.
bike-method-phase: 1  # Fase 1 — rode na mão, valide cada thumb antes de virar rotina.
---

## O que esta skill faz

Gera a **thumbnail 16:9 do YouTube** no **template que mais deu view pro Enzo** (estilo
tech-channel BR / MrBeast). Usa o **Higgsfield CLI** (`hf`) com o modelo **`gpt_image_2`**, passando
imagens de referência (foto do Enzo + print do site/app + logos). Autonomia **L2 (Drafted)**: a IA
gera, mostra, o Enzo escolhe/refina. **Nada sobe pro YouTube sozinho.**

## O template (o estilo que converte)

1. **Pessoa à DIREITA** — Enzo do peito pra cima, sorrindo, olhando pra câmera, camiseta preta.
   Rosto/cabelo/bigode fiéis à foto de referência.
2. **Navegador flutuante à ESQUERDA/CENTRO** — janela com bordas brancas arredondadas e sombra
   forte, mostrando o **site/app do vídeo** (vem do print de referência).
3. **Logos no TOPO ESQUERDO** — ícones de app arredondados com brilho, no formato "A **+** B"
   (ex.: Claude + Fable 5, banana/Google + curva). Vêm da imagem de referência dos logos.
4. **Faixa de TEXTO embaixo** — barra preta levemente inclinada, fonte sans-serif extra-bold em
   CAIXA ALTA, em **duas linhas**: a chamada em **branco** e o complemento em **laranja vibrante**
   (ex.: "1 PROMPT" / "= SITE PERFEITO"). Contorno preto sutil.
5. **Fundo** — estúdio escuro (quase preto) com **glow radial laranja-dourado** e partículas de luz.

Variar um pouco o fundo a cada vídeo pra não virar cópia idêntica do anterior.

## 🔁 Continuar de onde parou (funciona em chat NOVO, mesmo com o PC desligado)

O estado vive em **arquivo**, não na memória da conversa — então um chat aberto do zero amanhã
retoma normal. **SEMPRE faça isto:**

1. **Ao começar (toda vez que a skill dispara):** leia `references/thumbnail-youtube/estado.md`.
   - Se o `Status` for `EM ANDAMENTO`, **resuma pro Enzo onde parou** (última versão, o que falta,
     caminhos das referências) e **continue desse ponto** — não recomece do zero. Confirme só o que
     estiver `PENDENTE` (ex.: o caminho de uma foto nova).
   - Se for `CONCLUÍDO` (ou não existir), trate como thumb nova.
2. **Ao parar ou terminar a sessão:** **atualize** `references/thumbnail-youtube/estado.md` com:
   última versão gerada (caminho), próximo passo, o que está pendente, e os caminhos das referências.
   É isto que permite retomar em outro chat.

> Sempre cite as referências por **caminho de arquivo** no estado — assim o próximo chat só precisa
> reusar os mesmos arquivos.

## ⚠️ Regra crítica: imagens precisam estar EM DISCO

O `hf` só aceita **caminhos de arquivo** (`--image "C:\...\foto.png"`) — ele faz upload sozinho.
**Imagem colada no chat NÃO dá pra usar**: o Claude não consegue salvá-la em disco. Se o Enzo colar
uma imagem, **peça o caminho do arquivo** (ou que ele salve em `Downloads` e cole o caminho). Antes
de pedir, **procure** o arquivo (Downloads, `OneDrive\Imagens\Capturas de tela`) por nome/data —
muitas vezes já está salvo.

## Pré-requisitos

- **Higgsfield CLI** logado (`hf auth login`). Conta `agenciasparo@gmail.com`, plano pro. Detalhes e
  o gotcha de instalação no Windows estão na memória `higgsfield-cli`.
- Os **arquivos de referência** em disco: foto da pessoa, print do site, (opcional) imagem dos logos.

## Fluxo (a skill orquestra)

**Passo 1 — Reunir as referências (caminhos em disco).**
- **Foto da pessoa** — de preferência um retrato bom do Enzo (foto de estúdio > recorte amador).
- **Print do site/app** — a tela que vai aparecer no navegador flutuante.
- **Logos** (opcional) — imagem com os ícones que vão no topo.

Se faltar algum, peça o caminho. Não invente logo/site "de cabeça" — sem o arquivo sai errado.

**Passo 2 — Montar o prompt.** Escreva o prompt em **inglês** (o `gpt_image_2` segue melhor),
descrevendo o template acima e **citando o que cada referência é** ("the third image is the website
that must be on the browser screen"). Salve num `.txt` no scratchpad pra evitar dor de cabeça com
aspas/acentos. Modelo de prompt pronto: ver `references/thumbnail-youtube/prompt-template.md`.

**Passo 3 — Gerar.** Rode (cada `--image` é uma referência; a ordem segue a citada no prompt):

```
cd <pasta-de-saida>
hf generate create gpt_image_2 \
  --prompt "$(cat prompt-thumb.txt)" \
  --image "<FOTO_PESSOA>" \
  --image "<IMG_LOGOS>" \
  --image "<PRINT_SITE>" \
  --aspect_ratio 16:9 --quality low --resolution 1k \
  --wait --wait-timeout 8m --json
```

Pega o `result_url` do JSON, baixa com `curl -o thumb-vN.png "<url>"` e **mostra pro Enzo**.

**Passo 4 — Refinar.** Iterar conforme o feedback. Quando ele aprovar a composição, **rode em `2k`**
(`--resolution 2k`) pra acabamento nítido (texto e site ficam mais limpos). Pra ver opções de
enquadramento, `--batch_size 3` gera 3 de uma vez.

## Parâmetros do gpt_image_2 (lembretes)

- Params com **underscore**: `--aspect_ratio` (não `-`). Aspect: `16:9` pra YouTube.
- `--quality`: `low` (rascunho, ~0,5 crédito) → `medium`/`high` no final.
- `--resolution`: `1k` rascunho, `2k`/`4k` acabamento.
- Várias `--image` = várias referências. `--wait` bloqueia até terminar e imprime a URL.
- Inspecionar: `hf model get gpt_image_2`.

## Regras de qualidade

1. **Texto curto e legível em tela pequena.** Duas linhas, branco + laranja. Soletre exato (a IA às
   vezes erra letra em `1k` — subir pra `2k` resolve).
2. **Fiel às referências.** Foto = rosto do Enzo; logos = os ícones reais; site = o print real.
3. **Varie o fundo** entre vídeos pra não parecer a mesma thumb.
4. **L2 — nada sobe sozinho.** Mostre o rascunho; o Enzo aprova, baixa e sobe no YouTube na mão.
5. **Honestidade.** Se faltar um arquivo de referência, pare e peça — não chute o logo/site.

## Saída

- `thumb-vN.png` (16:9) na pasta de saída — versões iteradas até o Enzo aprovar.
- O prompt salvo (`prompt-thumb.txt`) pra reusar/ajustar no próximo vídeo.

## KPI (por que isto existe)

Sustenta a meta do trimestre de **ser constante no YouTube (8 vídeos/mês)** — tira o atrito de fazer
a capa, que é parte do gargalo de produção. Métrica: **tempo de "vídeo pronto" até "thumb pronta"**.
