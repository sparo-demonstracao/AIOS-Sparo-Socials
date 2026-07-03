---
name: pausar
description: Use quando o Enzo for PARAR um trabalho no meio e quiser CONTINUAR depois em OUTRO chat, do zero (tipicamente na hora de dormir). Gera uma MENSAGEM DE CONTINUAÇÃO auto-suficiente que ele copia e cola num chat NOVO no dia seguinte pra retomar exatamente de onde parou — sem depender da memória desta conversa. Dispare mesmo sem a palavra "skill", ex.: "pausar", "vou dormir", "continuar amanhã", "gera o resumo pra continuar isso depois", "passa o bastão deste chat", "salva o ponto", "handoff". Funciona em QUALQUER projeto/chat.
---

## O que esta skill faz

Olha **a conversa atual** e gera uma **mensagem de continuação** (handoff) que o Enzo copia e cola
num **chat totalmente novo** depois pra retomar o trabalho. O chat novo não tem a memória desta
conversa — então a mensagem precisa ser **auto-suficiente**: tudo que o próximo "eu" precisa saber
pra continuar sem perguntar o óbvio.

O Enzo usa assim: na hora de dormir, ele dispara esta skill em **cada chat que ficou pendente**.
Cada um devolve uma mensagem. No dia seguinte, ele abre chats novos e cola cada mensagem.

## A regra de ouro

A mensagem é escrita **para o próximo assistente** (não pro Enzo), em 2ª pessoa ("Continue de onde
paramos..."). Quem ler tem que conseguir **agir na hora**, sabendo:
- onde estão os arquivos (caminhos absolutos),
- qual é o **próximo passo concreto**,
- o que está **pendente do Enzo** (ex.: um caminho de arquivo, uma decisão),
- os gotchas que já descobrimos (pra não repetir erro).

Sem isso, o chat novo recomeça do zero — que é exatamente o que esta skill evita.

## Como gerar (passo a passo)

**Passo 1 — Reconstrua o estado a partir da conversa.** Levante:
- **Trabalho / objetivo** — o que está sendo feito e por quê.
- **Projeto / diretório** — o working dir e repo, se houver.
- **Já feito** — resumo curto do que foi concluído (com caminhos dos artefatos gerados).
- **Próximo passo** — a PRIMEIRA coisa a fazer ao retomar (bem concreta).
- **Pendente do Enzo** — o que falta ele fornecer/decidir pra destravar.
- **Arquivos / comandos / URLs** — caminhos absolutos, comandos exatos, links (Notion, deploy etc.).
- **Decisões e gotchas** — escolhas travadas e armadilhas já descobertas.
- **Skill envolvida** — se o trabalho tem uma skill própria (ex.: `/thumbnail-youtube`), cite pra o
  chat novo já invocar ela.

**Passo 2 — Escreva a mensagem** no molde abaixo, preenchendo só o que existe (corte seções vazias).

**Passo 3 — Entregue de TRÊS jeitos:**
1. **No chat, dentro de um bloco de código** (```) pra o Enzo copiar com um clique.
2. **Salve uma cópia em arquivo** pra não perder se ele fechar o chat: em
   `handoffs/AAAA-MM-DD-<slug>.md` na raiz do projeto (crie a pasta `handoffs/` se não existir). Diga
   o caminho do arquivo salvo.
3. **Anexe na página fixa do Notion** "Continuações — prompts pra mandar de manhã" (a caixa de
   entrada que o Enzo abre de manhã). É AQUI que ele pega o prompt do dia.

### Como anexar no Notion (com data/hora automáticas)

- **Página alvo (fixa):** `Continuações — prompts pra mandar de manhã`
  - ID: `38ba651a-308e-817f-a93a-d0c56b6a5ab1`
  - URL: https://app.notion.com/p/38ba651a308e817fa93ad0c56b6a5ab1
- **Pegue a data/hora REAL** antes de anexar (não invente): `get_current_date_time` (timezone -3).
- **Anexe uma nova entrada NO TOPO da lista** (mais recente primeiro), com o formato:
  ```
  ## 🕒 <AAAA-MM-DD HH:MM> — <título curto>

  <bloco de código com a mensagem de continuação>

  ---
  ```
- Use `notion-update-page` (ou `notion-fetch` pra ver a estrutura e então atualizar) pra inserir a
  entrada na página existente — **não crie uma página nova a cada vez**, sempre a mesma.
- Se a página não existir mais (apagada), recrie com esse mesmo título e siga.

## Molde da mensagem de continuação

```
CONTINUAÇÃO DE TRABALHO — <título curto>

Estamos retomando um trabalho de outro chat. Você não tem o histórico; este texto tem tudo. Leia,
confirme em 1 linha que entendeu e já execute o "Próximo passo".

PROJETO: <nome / diretório / repo>
OBJETIVO: <o que queremos entregar>

JÁ FEITO:
- <ponto 1 (+ caminho do artefato)>
- <ponto 2>

PRÓXIMO PASSO (faça isto primeiro):
- <ação concreta>

PENDENTE DE MIM (Enzo) — me peça se faltar:
- <ex.: caminho do arquivo X / decisão sobre Y>

ARQUIVOS / COMANDOS / LINKS:
- <caminho absoluto / comando exato / URL>

DECISÕES E GOTCHAS (não repita erros):
- <decisão travada / armadilha>

SKILL: <se houver, ex.: invoque /thumbnail-youtube ao começar>
```

## Regras de qualidade

1. **Auto-suficiente.** Assuma memória zero no chat novo. Caminhos **absolutos**, comandos completos.
2. **Específico, não genérico.** "Próximo passo: rodar `hf ... --resolution 2k`" > "continuar a thumb".
3. **Marque o que é do Enzo.** Deixe claríssimo o que falta ele fornecer pra destravar.
4. **Curto e escaneável.** Bullets, sem encher. Só o que importa pra retomar.
5. **Salve sempre em `handoffs/`.** O bloco no chat pode se perder; o arquivo não.
6. Se o trabalho já tem um arquivo de estado próprio (ex.: `references/<x>/estado.md`), **atualize-o
   também** e aponte pra ele na mensagem.

## KPI (por que isto existe)

Mata o atrito de retomar trabalho no dia seguinte e evita refazer o que já foi decidido — sustenta a
constância nas prioridades do trimestre quando o trabalho atravessa vários dias/chats.
