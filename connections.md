# Connections

Registry of every system your AIOS can reach. Filled by `/onboard` from Q4-Q7 answers; expanded over time as you wire new tools. `/audit` checks this file for domain coverage and freshness.

| # | Domain | Tool | Mechanism | Auth | Last checked |
|---|---|---|---|---|---|
| 1 | Revenue / Financials | Kiwify (curso) ✅ + YouTube Studio (faturamento) ✅ | script (Kiwify + YouTube Analytics, ver references/) | .env (Kiwify keys + YouTube OAuth refresh token) | 2026-06-21 |
| 2 | Customer interactions | YouTube (@EnzoSparo, ID UCifUfSNdly4yFOfzSDS2xog) ✅ + WhatsApp ✅ + Skool ✅ (só leitura) | mcp (youtube) + script (WAHA) + script (Skool via ator Apify, ver references/skool-apify.md) | sem credencial (YT) / X-Api-Key (WAHA) / Apify token + cookie Skool no .env | 2026-06-24 |
| 3 | Calendar | Google Calendar ✅ | mcp (mcp.ai googlecalendar) + script (gws CLI, ver references/gws-cli.md) | OAuth Google | 2026-06-22 |
| 4 | Communication | Gmail ✅ (+ triagem/rascunho L2) + WhatsApp (WAHA) ✅ | mcp (claude_ai_Gmail) + script (gws CLI) p/ Gmail; script (WAHA, ver references/waha-api.md) p/ WhatsApp | OAuth Gmail / X-Api-Key no .env | 2026-06-25 |
| 5 | Project / task tracking | Notion (vídeos a gravar) ✅ | mcp (Notion oficial, mcp.notion.com — escopo user) | OAuth Notion | 2026-06-23 |
| 6 | Meeting intelligence | Fireflies (vazio por enquanto) | not yet connected | — | — |
| 7 | Knowledge / files | Notion ✅ + Google Drive ✅ + Google Docs/Sheets/Slides ✅ + Obsidian (segundo cérebro / LLM Wiki) ✅ | mcp (Notion oficial mcp.notion.com + mcp.ai googledrive) + script (gws CLI, ver references/gws-cli.md) + filesystem/headless (Obsidian, ver skill `obsidian`) | OAuth Notion/Google / sem credencial (Obsidian local) | 2026-06-23 |

**Mechanism options:** `mcp` (MCP server), `script` (Python/Bash hitting an API, in `scripts/`), `export` (CSV/JSON dump pipeline), `key+ref` (`.env` key + `references/{tool}-api.md` guide), `not yet connected`.

When you wire a new tool, also save `references/{tool}-api.md` capturing endpoints, auth flow, and common queries — researched-once-saved-forever.

**Notion — conectado de verdade em 2026-06-23.** O catálogo do mcp.ai **não tem** conector de
Notion (verificado por busca e por nome). A conexão real usa o **MCP oficial do Notion**
(`https://mcp.notion.com/mcp`, transporte HTTP), adicionado ao Claude Code no **escopo user** com
`claude mcp add --transport http --scope user notion …` e autenticado por OAuth. Importante: as
ferramentas do Notion só carregam em **conversas abertas depois** da autenticação — uma conversa
que já estava aberta não enxerga o Notion até ser reiniciada.

**Google Workspace CLI (`gws`) — adicionada 2026-06-22.** Mecanismo de script que cobre Drive,
Gmail, Calendar, Docs, Sheets, Slides e Tasks numa só ferramenta (conta `agenciasparo@gmail.com`,
projeto `aios-sparo-yt`, escopos leitura+escrita). Reforça as conexões MCP já existentes de Gmail/
Calendar/Drive e **abre Docs/Sheets/Slides**, que não eram alcançáveis. Guia completo (instalação,
auth, gotchas do PowerShell, exemplos): `references/gws-cli.md`. Para automações, invoque pela
ferramenta Bash.

**YouTube — escrita liberada + auto-descrição — 2026-06-24.** O token OAuth do canal já tem escopo
`youtube.force-ssl` (escrita na Data API), corrigindo a referência antiga que listava só leitura. Com
isso, montada a automação **auto-descrição**: a cada novo upload, baixa o áudio (yt-dlp), transcreve
local (Whisper) e publica **resumo + capítulos + hashtags** via `videos.update`, rodando no Agendador
de Tarefas a cada 3 min (tarefa `AIOS - YT Auto Descricao`). Template fixo imutável; só as 3 partes
variáveis mudam. Código em `scripts/yt-auto-descricao/` (README lá), template em
`references/youtube-descricao-template.md`, decisão em `decisions/log.md`. O MCP do YouTube (mcp.ai
`banco`) segue **só leitura/scraping** — a escrita é por script.

**Skool — comunidade, só leitura — 2026-06-24.** O Skool **não tem API pública oficial**, então a
conexão usa dois mecanismos, ambos **só leitura** (L2): (1) **posts + comentários** via **ator do
Apify** (`cristiantala/skool-all-in-one-api`, HTTP, token + cookie no `.env`); (2) **DMs (chat)** via
**Playwright** (`scripts/skool/skool-chat.cjs`) — o chat fica em `api2.skool.com` atrás do AWS WAF, que
bloqueia HTTP puro, então só um navegador real passa (cookie no domínio `.skool.com`). O AIOS **rascunha**
respostas na voz do Enzo pra ele revisar e postar — nada é publicado automaticamente (regra de voz +
Regra do Estagiário + risco de ToS da comunidade paga). Acionada pela skill `skool` (interativo) ou pelo
botão "Responder Skool" no app matinal (DMs marcadas com 💬). Cookie expira ~3,5 dias. Guia completo
(ator, auth, cookie, chat/WAF, custo): `references/skool-apify.md`. Decisão em `decisions/log.md` (2026-06-24).

**Gmail — triagem + rascunho de respostas (L2) — 2026-06-25.** Skill `triagem-email`: lê a caixa
(via MCP `claude_ai_Gmail`), trata por **thread** (ignora automação/massa/follow-up duplicado),
**categoriza** em um dos 6 labels que o Enzo já usa (Importante, Propostas/Parcerias, Curso, Reunião,
Médio, Sem Importância — IDs na skill), **aplica o label** e **cria um rascunho de resposta na voz do
Enzo** pra ele enviar com 1 clique — **menos** em Médio e Sem Importância (só label). Em
**Propostas/Parcerias**, faz `WebSearch` da empresa antes de rascunhar: grande/relevante → interesse,
pequena/desconhecida → recusa cordial (motivo é interno: vídeo de promo paga não pode vender o curso
junto). **L2 — nada é enviado**, só rascunhado (label é reversível, envio não). A voz de e-mail mora
em `references/voz-email.md` (lida **só na hora de rascunhar**, fora do contexto de rotina). **Dois
modos:** (1) **interativo** no Claude Code (`/triagem-email`, MCP `claude_ai_Gmail` + `WebSearch` ao
vivo); (2) **lote** (`scripts/triagem-email/triar.mjs`) pra caixa inteira / últimos N dias — usa
**OpenRouter** (classifica com **Haiku** `anthropic/claude-haiku-4.5`, rascunha com **Sonnet 4.6**
`anthropic/claude-sonnet-4.6`; `OPENROUTER_API_KEY` no `.env`) e o **`gws` CLI** pro Gmail (não MCP).
O lote é idempotente (`has:nouserlabels`, label-as-go) e de-dupa disparos repetidos; nele o veredito de
empresa é por conhecimento do modelo (conservador — na dúvida pede briefing), a pesquisa ao vivo é só
no interativo. Decisão em `decisions/log.md` (2026-06-25).

**Obsidian — segundo cérebro / LLM Wiki — adicionado 2026-06-23.** O vault fica em
`C:\Users\canal\Documentos\Obsidian\Enzo Barbatto` e é, ele mesmo, **um projeto Claude Code**
(CLAUDE.md próprio, estrutura `raw/` → `wiki/`, operações ingest/query/lint). O AIOS é só
**produtor**: **ENVIAR** grava o documento em `raw/` (imagens/anexos em `raw/assets/`, ferramenta Write); **INGERIR** dispara
o projeto do vault em **headless** (`claude -p` rodando da pasta do vault, prompt via stdin, com
preview read-only antes de escrever) pra processar `raw/` em páginas da wiki. Headless validado
em 2026-06-23. Fluxo completo, caminhos fixos e gotchas: skill `obsidian`
(`.claude/skills/obsidian/SKILL.md`).
