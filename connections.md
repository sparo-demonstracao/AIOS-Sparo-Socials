# Connections

Registry of every system your AIOS can reach. Filled by `/onboard` from Q4-Q7 answers; expanded over time as you wire new tools. `/audit` checks this file for domain coverage and freshness.

| # | Domain | Tool | Mechanism | Auth | Last checked |
|---|---|---|---|---|---|
| 1 | Revenue / Financials | Kiwify (curso) ✅ + YouTube Studio (faturamento) ✅ | script (Kiwify + YouTube Analytics, ver references/) | .env (Kiwify keys + YouTube OAuth refresh token) | 2026-06-21 |
| 2 | Customer interactions | YouTube (@EnzoSparo, ID UCifUfSNdly4yFOfzSDS2xog) ✅ + WhatsApp ✅ + Skool | mcp (youtube) + script (WAHA) / Skool pendente | sem credencial (YT) / X-Api-Key (WAHA) | 2026-06-21 |
| 3 | Calendar | Google Calendar ✅ | mcp (mcp.ai googlecalendar) + script (gws CLI, ver references/gws-cli.md) | OAuth Google | 2026-06-22 |
| 4 | Communication | Gmail ✅ + WhatsApp (WAHA) ✅ | mcp (claude_ai_Gmail) + script (gws CLI) p/ Gmail; script (WAHA, ver references/waha-api.md) p/ WhatsApp | OAuth Gmail / X-Api-Key no .env | 2026-06-22 |
| 5 | Project / task tracking | Notion (vídeos a gravar) ✅ | mcp (mcp.ai notion) | OAuth Notion | 2026-06-21 |
| 6 | Meeting intelligence | Fireflies (vazio por enquanto) | not yet connected | — | — |
| 7 | Knowledge / files | Notion ✅ + Google Drive ✅ + Google Docs/Sheets/Slides ✅ | mcp (mcp.ai notion + googledrive) + script (gws CLI, ver references/gws-cli.md) | OAuth Notion/Google | 2026-06-22 |

**Mechanism options:** `mcp` (MCP server), `script` (Python/Bash hitting an API, in `scripts/`), `export` (CSV/JSON dump pipeline), `key+ref` (`.env` key + `references/{tool}-api.md` guide), `not yet connected`.

When you wire a new tool, also save `references/{tool}-api.md` capturing endpoints, auth flow, and common queries — researched-once-saved-forever.

**Google Workspace CLI (`gws`) — adicionada 2026-06-22.** Mecanismo de script que cobre Drive,
Gmail, Calendar, Docs, Sheets, Slides e Tasks numa só ferramenta (conta `agenciasparo@gmail.com`,
projeto `aios-sparo-yt`, escopos leitura+escrita). Reforça as conexões MCP já existentes de Gmail/
Calendar/Drive e **abre Docs/Sheets/Slides**, que não eram alcançáveis. Guia completo (instalação,
auth, gotchas do PowerShell, exemplos): `references/gws-cli.md`. Para automações, invoque pela
ferramenta Bash.
