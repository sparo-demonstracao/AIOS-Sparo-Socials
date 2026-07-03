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
- **NOVO (2026): `@lid`.** O WhatsApp migrou pra "linked id" — hoje `/api/default/chats` devolve
  IDs tipo `134509869703211@lid` (campo `id.server` = `lid`), **não** mais `@c.us`. O número real
  não está no id; vem no `name` do chat (ex.: `+55 11 96266-4811`). Pra montar `wa.me/<numero>`,
  extraia os dígitos do `name`. Pra puxar mensagens, use o `id._serialized` do próprio chat (o `@lid`).

## Endpoints mais usados

| Ação | Método | Caminho | Corpo (JSON) |
|---|---|---|---|
| Status das sessões | GET | `/api/sessions` | — |
| Enviar texto | POST | `/api/sendText` | `{ "session": "default", "chatId": "...@c.us", "text": "..." }` |
| Enviar imagem | POST | `/api/sendImage` | `{ "session":"default","chatId":"...","file":{"url":"..."},"caption":"..." }` |
| Listar conversas | GET | `/api/default/chats` | — |
| Mensagens de uma conversa | GET | `/api/default/chats/{chatId}/messages?limit=50&downloadMedia=false` | — |
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

## Pegadinhas de mensagens (descoberto em 25/jun/2026, debugando o Resumo Matinal)

Engine **WEBJS CORE** — ler histórico é frágil. Três coisas que quebram silenciosamente:

1. **`downloadMedia=false` é OBRIGATÓRIO** no `/messages`. Sem isso o WAHA tenta baixar a mídia de
   cada mensagem e estoura **500** (pior ainda em chats `@lid`). Com `&downloadMedia=false` volta
   ao normal (mídia vira só o `type`: `ptt`/`image`/etc.).
2. **`fromMe` fica no TOPO da mensagem** (`m.fromMe`), **não** em `m._data.fromMe` (esse vem VAZIO).
   Ler do lugar errado faz TODA mensagem virar "do contato" → inverte quem falou (Enzo vira contato).
   Vale pro `lastMessage` do chat também: use `lastMessage.fromMe`.
3. **`/messages` é instável** — mesmo com `downloadMedia=false`, às vezes dá 500 com
   `Cannot read properties of undefined (reading 'waitForChatLoading')` (o WEBJS precisa do chat
   "carregado" no browser headless). Na prática ~1 em 6 chats responde por chamada. Estratégia
   confiável: **tentar o histórico, mas cair na `lastMessage` do `/chats`** (essa SEMPRE vem, com o
   `fromMe` certo) quando o `/messages` falhar. Conserto de verdade do histórico = mudar de engine
   (NOWEB, que lê de store local) ou tier PLUS — mas isso exige re-parear a sessão.

## Observações de segurança

- `WAHA_DASHBOARD_NO_PASSWORD=True` → o painel web do WAHA está sem senha. Qualquer um com o
  link do painel acessa. Avaliar proteger depois.
- Enviar mensagem é ação que sai pra fora: confirmar com o Enzo antes de disparar de verdade.
