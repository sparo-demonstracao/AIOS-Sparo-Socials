---
name: proximo-video
description: Use quando o Enzo for planejar o PRÓXIMO VÍDEO do YouTube — pedir ideias/temas ("me dá temas", "qual o próximo vídeo?", "o que gravar essa semana?") OU roteirizar um tema já escolhido/sugerido por ele ("roteiriza esse tema", "monta o roteiro do vídeo sobre X"). Minera temas dos sinais reais (comentários do canal, dúvidas do Skool, performance dos vídeos, ideias no Notion), apresenta top 5 com ângulo, e — escolhido o tema — analisa os concorrentes e rascunha o ROTEIRO com a didática do próprio Enzo, criando a página no Notion. L2 — tudo é rascunho, nada é publicado.
bike-method-phase: 1  # Fase 1 — Rodinhas. Rodar manualmente no Claude Code; painel só em fase posterior.
three-ms-attribution: |
  Adapted from The Three Ms of AI™ © 2026 Nate Herk.
---

# Próximo Vídeo (tema + roteiro, L2)

Ataca o top_pain do Enzo: **escolher, roteirizar** (a gravação segue com ele). Dois modos, um
comando cada. KPI: 8 vídeos/mês publicados; tema→roteiro pronto pra revisar em < 1h.

## Modo A — "me dá temas" (mineração)

1. **Coletar sinais** (tudo já conectado, custo ~zero):
   - Comentários recentes do canal: MCP `banco` → `youtube_channel_videos` + `youtube_comments`
     (canal `UCifUfSNdly4yFOfzSDS2xog`).
   - Dúvidas reais das comunidades: ler `C:\tmp\aios-skool-raw.json` (dump que o /skool já pagou —
     NÃO refazer chamadas ao Apify só pra isso).
   - Performance dos próprios vídeos: script de analytics já existente (ver `connections.md` linha
     Revenue/YouTube Studio) — quais temas/formatos performaram.
   - Ideias já anotadas: buscar no Notion (MCP `notion-search`) no banco de vídeos.
2. **Pontuar temas:** frequência do sinal × alinhamento com o curso (Antigravity/Claude Code/
   automação pra leigos) × performance de vídeos similares. Notícia quente de IA conta como
   multiplicador.
3. **Entregar top 5** no chat: pra cada tema → ângulo, título provisório (estilo dos títulos que
   convertem no canal), evidência (quem pediu/o que performou) e nota. Perguntar qual ele quer
   roteirizar — ou aceitar um tema que ELE sugerir do nada (fluxo idêntico a partir daqui).

## Modo B — "roteiriza esse tema"

1. **Analisar concorrentes:** MCP `banco` → `youtube_search` pelo tema (+ variações). Levantar os
   top vídeos: views vs. idade do vídeo, título/ângulo, o que a thumb promete. Resumir: qual ângulo
   está saturado, qual está vago.
2. **Carregar a didática do Enzo:** ler `references/didatica-youtube.md`.
   - **Se o arquivo NÃO existir (1ª rodada — calibração):** gerá-lo antes. Fonte: transcrições dos
     vídeos de MELHOR resultado do canal (pipeline existente: `scripts/yt-auto-descricao/processar.py
     --video=ID --dry-run` transcreve qualquer vídeo; performance vem do analytics). Extrair a
     ESTRUTURA recorrente (como abre o hook, como promete, ordem dos blocos, como demonstra na
     tela, como faz o CTA do curso/comunidade, duração típica por bloco, tiques de linguagem) e
     salvar no arquivo — perfil local, mesmo padrão do `voz-skool.md`, custo recorrente zero.
3. **Rascunhar o roteiro** seguindo a didática dele À RISCA — mesma pegada, ordem e lógica
   didática dos vídeos que performaram. Linguagem de leigo, "você" (nunca "tu"), demonstração
   prática no centro.
4. **Entregar no Notion:** criar página no banco de vídeos a gravar (MCP `notion-create-pages`;
   achar o banco via `notion-search` por "vídeos"). Título = título provisório; corpo = roteiro +
   análise de concorrentes + evidência do tema. Mostrar o link no chat.

## Guardrails

- **L2 — Drafted:** roteiro é RASCUNHO; o Enzo revisa, adapta e grava. Nada é publicado por aqui.
- Tema é decisão DELE — a IA só sugere e evidencia. Não roteirizar sem tema confirmado.
- Não prometer no roteiro nada que o curso/canal não tenha (datas, recursos).
- Custo: reusar dumps e transcrições existentes; só chamadas novas ao YouTube MCP (grátis) e
  Notion. Zero Apify novo.

## Bike Method — avanço de fase (só por edição explícita deste arquivo)

- **Fase 1 (atual):** rodar manualmente no Claude Code, conferindo cada saída.
- **Fase 2:** depois de ~4 rodadas boas, criar a página no Painel AIOS pra escolher/sugerir tema
  com um clique (visão final do Enzo) — o botão chama este mesmo fluxo em headless.
- **Fase 3+:** só se fizer sentido; escolha de tema continua humana.

> *Adapted from The Three Ms of AI™ © 2026 Nate Herk. All rights reserved.*
