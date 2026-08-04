---
name: instagram-post
description: Use quando o Enzo for POSTAR um vídeo/Reels no Instagram e pedir pra PREPARAR o post — gerar título, legenda (descrição) e a CAPA com um texto curto (3 a 6 palavras) pra dar a ideia do vídeo no grid. Dispare mesmo sem a palavra "skill", ex.: "vou postar esse reel no insta", "prepara esse vídeo pro Instagram", "gera a capa desse vídeo", "faz a legenda e a thumb pro Instagram", "monta o post do reel". A capa é um print do próprio vídeo (3 opções: início/meio/fim) com uma caixa branca de texto por cima, no estilo de capa de Reels.
bike-method-phase: 1  # Fase 1 — rode na mão, valide UM post antes de virar rotina.
---

## O que esta skill faz

Pega o **vídeo local** que o Enzo vai postar no Instagram e devolve o material pronto pra ele
revisar e publicar na mão. Autonomia **L2 (Drafted)**: a IA rascunha, o Enzo decide, edita e posta.
**Nada vai pro Instagram sozinho.**

Entrega três coisas:

1. **Título** — o gancho curto do post (a primeira linha que prende).
2. **Legenda (descrição)** — o texto completo do post, na voz do Enzo, com CTA leve e hashtags.
3. **Capa (thumb)** — um **print do próprio vídeo** com uma **caixa branca** por cima e um **texto
   curto (3 a 6 palavras)** em caixa alta preta e bold, centralizado. Resolve a dor real: no grid de
   Reels do perfil **não dá pra ver o título antes de clicar** — a capa diz do que é o vídeo.

Gera **3 capas candidatas** (frame do **início ~15%**, **meio ~50%** e **fim ~85%**) — o meio pega a
gravação de tela. O Enzo escolhe a melhor.

## Dois jeitos de usar

1. **Pelo app (painel)** — autoatendimento. No painel do AIOS, card **"Instagram · Preparar post"**
   (ou item *Instagram* no menu): você **envia o vídeo**, ele transcreve + escreve título/legenda +
   gera as 3 capas sozinho, e mostra tudo pronto pra **copiar** (título/legenda) e **baixar** (capa).
   Na tela de resultado você **edita o texto da capa** (com 3 sugestões clicáveis), **escolhe a fonte**
   e a posição, e clica em *Atualizar capas* pra redesenhar na hora. Motor: `instagram_post.py auto`
   (ver abaixo) + `cover` pra redesenhar; disparados por `painel/lib/instagram.js`.
2. **Por aqui (conversa)** — quando o Enzo pedir na conversa, o Claude orquestra os passos `prep` →
   copy → `cover` (fluxo detalhado mais abaixo), útil pra iterar no texto da capa.

## O que esta skill NÃO faz

- **Não publica no Instagram.** É L2 — rascunho pra revisão. O Enzo posta na mão (não há API de
  publicação conectada, e a regra do CLAUDE.md é não fingir a voz dele em conteúdo externo sem
  mostrar rascunho primeiro).
- **Não inventa o que não está no vídeo.** O copy sai da transcrição real. Se o áudio não der pra
  transcrever (vídeo mudo, só música), **sinaliza** e pede o tema na mão em vez de chutar.
- **Não decide o frame sozinha como "final".** Mostra 3, o Enzo escolhe. Se nenhum servir, pega um
  segundo específico que ele pedir.

## O motor (script) — o que é mecânico

`scripts/instagram-post/instagram_post.py`. Reusa o **Whisper na GPU** (receita validada em
`C:\Users\canal\Downloads\transcricao-masterclass`) e o **ffmpeg** + **Pillow** pra desenhar a capa.
Roda **sempre** com o python do venv do Whisper:

```
PY="C:/Users/canal/Downloads/transcricao-masterclass/venv/Scripts/python.exe"
SCRIPT="scripts/instagram-post/instagram_post.py"
```

Pro **app**, há um comando único que faz tudo (transcreve + copy via `claude -p` + 3 capas) e grava
um `result.json`:

```
"$PY" "$SCRIPT" auto "<CAMINHO_DO_VIDEO>" --out-dir "<PASTA>" --pos middle
```

## Fluxo (a skill orquestra estes passos)

**Passo 1 — Prep (transcreve + extrai 3 frames).** Roda:

```
"$PY" "$SCRIPT" prep "<CAMINHO_DO_VIDEO>"
```

Cria a pasta `<nome-do-video>-instagram/` ao lado do vídeo, com `transcript.txt` e
`frame-1/2/3.png`. O script imprime um JSON com os caminhos.

**Passo 2 — Escreve o copy (isto é o coração — quem faz é o Claude, não o script).**
Antes de escrever, **leia**:
- `<out_dir>/transcript.txt` — o conteúdo real do vídeo.
- `references/voice.md` — o registro do Enzo.

Gere e **mostre pro Enzo** (rascunho, pra ele aprovar/editar):
- **Texto da capa** — **3 a 6 palavras**, gancho de curiosidade, em CAIXA ALTA. É o que vai na
  caixa branca. Prefira frases que quebrem bem em 2-3 linhas (ex.: "COMO AUTOMATIZEI MEU WHATSAPP",
  "O ERRO QUE TODO INICIANTE COMETE"). Pense no estilo de capa de Reels: promete um resultado ou
  cria curiosidade.
- **Título** — o gancho do post (1 linha).
- **Legenda** — gancho na 1ª linha → entrega de valor em frases curtas → CTA leve (comenta / salva /
  segue) → 5 a 12 hashtags (mistura amplas + de nicho: #automação #ia #claudecode #antigravity
  #nocode #produtividade + específicas do tema).

**Passo 3 — Desenha as 3 capas** com o texto aprovado:

```
"$PY" "$SCRIPT" cover --dir "<out_dir>" --text "TEXTO DA CAPA" --pos middle --font black
```

`--pos` aceita: `top` (em cima, ~28% da altura), `middle` (**padrão**, centro) e `bottom` (embaixo,
~72% da altura).

`--font` aceita: `montserrat` (Montserrat Black — **padrão**, geométrica), `poppins` (Poppins Black,
geométrica arredondada), `black` (Arial Black), `segoe` (Segoe UI Black), `impact` (Impact,
condensada), `franklin` (Franklin Gothic Heavy), `bold` (Arial Bold). As duas primeiras são grátis
(OFL) e ficam embutidas em `scripts/instagram-post/fonts/` — funcionam em qualquer máquina.

Gera `capa-1/2/3.png` (1080x1920, prontas pra Reels). **Mostre as 3** pro Enzo escolher.

**Passo 4 (opcional) — Frame específico.** Se nenhum dos 3 servir, pega outro segundo e redesenha:

```
"$PY" "$SCRIPT" frame "<CAMINHO_DO_VIDEO>" --dir "<out_dir>" --at 12.5
"$PY" "$SCRIPT" cover --dir "<out_dir>" --text "TEXTO DA CAPA"
```

## Regras de voz e qualidade

1. **Na voz do Enzo.** Português do Brasil, informal mas profissional, frases curtas, direto.
   Linguagem de **leigo** — sem jargão técnico solto. Ver `references/voice.md`.
2. **Sempre "você/seu/sua" (e "te"). Nunca "tu/teu/tua".** Em nenhum texto.
3. **Texto da capa: 3 a 6 palavras.** Mais que isso vira parede de texto e some no grid. Curto,
   curioso, promete algo.
4. **Não fingir a voz em conteúdo externo sem mostrar rascunho.** Tudo é L2 — pare e mostre antes.
5. **Honestidade.** Se a transcrição falhou ou veio curta, diga e peça o tema — não invente.

## Saída

Tudo em `<nome-do-video>-instagram/` ao lado do vídeo:

| Arquivo | O que é |
|---|---|
| `transcript.txt` | transcrição corrida (base do copy) |
| `frame-1/2/3.png` | frames crus (início / meio / fim), 1080x1920 |
| `capa-1/2/3.png` | os frames com a caixa de texto — **escolha 1 pra usar de capa** |

O título e a legenda ficam na conversa (rascunho), prontos pro Enzo copiar.

## KPI (por que isto existe)

Sustenta a meta do trimestre de **lançar o Instagram** e **ser constante** — tira o atrito de
escrever legenda e fazer capa toda vez que vai postar um corte/reel. Métrica: **tempo do vídeo
pronto até o post pronto pra publicar** — de "deixo pra depois" pra minutos de revisão.
