# WAHA — WhatsApp HTTP API (guia de uso)

Conexão do WhatsApp do Enzo, hospedada no Railway. Imagem `devlikeapro/waha`.
Pesquisado e salvo em 2026-06-21 — "researched-once-saved-forever".

## Acesso

- **Endereço base:** está em `.env` → `WAHA_BASE_URL`
  (`https://whatsapp-http-api-production-e91f.up.railway.app`)
- **Chave:** está em `.env` → `WAHA_API_KEY` (variável `WHATSAPP_API_KEY` no Railway).
  Enviar em TODA requisição no cabeçalho `X-Api-Key`.
- **Sessão:** `default` (status WORKING). Número: +55 21 96402-8125 ("Sparo Automações").
- **Engine:** WEBJS.

> Nunca colocar a chave em código nem no chat. Sempre ler do `.env`.

## Formato de identificadores (chatId)

- Contato individual: `<DDI><DDD><numero>@c.us` — ex.: `5521964028125@c.us`
- Grupo: `<id>@g.us`

## Endpoints mais usados

| Ação | Método | Caminho | Corpo (JSON) |
|---|---|---|---|
| Status das sessões | GET | `/api/sessions` | — |
| Enviar texto | POST | `/api/sendText` | `{ "session": "default", "chatId": "...@c.us", "text": "..." }` |
| Enviar imagem | POST | `/api/sendImage` | `{ "session":"default","chatId":"...","file":{"url":"..."},"caption":"..." }` |
| Listar conversas | GET | `/api/default/chats` | — |
| Mensagens de uma conversa | GET | `/api/default/chats/{chatId}/messages?limit=50` | — |
| Marcar como lida | POST | `/api/sendSeen` | `{ "session":"default","chatId":"..." }` |
| Contatos | GET | `/api/contacts/all?session=default` | — |

Documentação oficial: https://waha.devlike.pro/docs/

## Exemplo (PowerShell) — ler chave do .env e enviar mensagem

```powershell
$lines = Get-Content ".env"
$base = (($lines | Where-Object { $_ -match '^WAHA_BASE_URL=' }) -replace '^WAHA_BASE_URL=','').Trim()
$key  = (($lines | Where-Object { $_ -match '^WAHA_API_KEY=' })  -replace '^WAHA_API_KEY=','').Trim()
$body = @{ session="default"; chatId="5521964028125@c.us"; text="Teste do AIOS" } | ConvertTo-Json
Invoke-RestMethod -Uri "$base/api/sendText" -Method POST -Headers @{ "X-Api-Key"=$key } -ContentType "application/json" -Body $body
```

## Observações de segurança

- `WAHA_DASHBOARD_NO_PASSWORD=True` → o painel web do WAHA está sem senha. Qualquer um com o
  link do painel acessa. Avaliar proteger depois.
- Enviar mensagem é ação que sai pra fora: confirmar com o Enzo antes de disparar de verdade.
