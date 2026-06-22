# Kiwify — API oficial (guia de uso)

Conexão de receita do curso. Conectada por **script** (a API oficial, lida direto), porque o
formulário do conector mcp.ai recusava as credenciais — ver "Pegadinha" abaixo.
Pesquisado e salvo em 2026-06-21.

## Credenciais (no .env)

- `KIWIFY_CLIENT_ID` — client_id gerado em: Painel Kiwify → Configurações → API.
- `KIWIFY_CLIENT_SECRET` — client_secret (par do client_id; só aparece UMA vez ao gerar).
- `KIWIFY_ACCOUNT_ID` — store_id, enviado no header `x-kiwify-account-id`.
- Integração nomeada na Kiwify: "AIOS - Sparo YT". Escopos: sales, events, webhooks,
  affiliates, stats, products, financial.

> ⚠️ **Pegadinha que custou tempo:** o Account ID correto é `Rl8w2KJr6qy59yS` — o 2º caractere é
> **L minúsculo**, não "i maiúsculo". Na fonte do painel os dois são idênticos. O valor
> autoritativo está no claim `store_id` do próprio token (ver fluxo abaixo). Se a API devolver 401
> em TODAS as chamadas mesmo com token válido, é quase certo que o account_id está com essa letra
> trocada.

## Fluxo de autenticação

1. **Pegar token** (válido 24h, `expires_in: 86400`):
   - POST `https://public-api.kiwify.com/v1/oauth/token`
   - Content-Type: `application/x-www-form-urlencoded`
   - Body: `client_id=<id>&client_secret=<secret>`
   - Resposta: `{ access_token, token_type: "Bearer", expires_in, scope[] }`
   - O `access_token` é um JWT; o payload tem `store_id` (= o account_id correto).

2. **Chamar a API** com:
   - Header `Authorization: Bearer <access_token>`
   - Header `x-kiwify-account-id: <store_id>`

## Endpoints úteis

| Ação | Método | Caminho | Observações |
|---|---|---|---|
| Vendas | GET | `/v1/sales?start_date=AAAA-MM-DD&end_date=AAAA-MM-DD&page_size=&page=` | **start_date/end_date são obrigatórios** (sem eles → 400). Campos: id, reference, type, created_at, product, status, payment_method, net_amount, currency, customer. |
| Detalhe de uma venda | GET | `/v1/sales/{sale_id}` | |
| Produtos | GET | `/v1/products?page_size=&page=` | |
| Assinaturas | GET | `/v1/subscriptions?product_id=&status=` | |
| Afiliados | GET | `/v1/affiliates?status=` | |

Paginação vem em `pagination: { count, page_number, page_size }`.

## Exemplo (PowerShell) — total de vendas de um período

```powershell
$lines = Get-Content ".env"
function Get-EnvVal($n){ (($lines|?{$_ -match "^$n="}) -replace "^$n=","").Trim() }
$tok = Invoke-RestMethod -Uri "https://public-api.kiwify.com/v1/oauth/token" -Method POST `
  -ContentType "application/x-www-form-urlencoded" `
  -Body "client_id=$(Get-EnvVal 'KIWIFY_CLIENT_ID')&client_secret=$(Get-EnvVal 'KIWIFY_CLIENT_SECRET')"
$h = @{ "Authorization"="Bearer $($tok.access_token)"; "x-kiwify-account-id"=(Get-EnvVal 'KIWIFY_ACCOUNT_ID') }
Invoke-RestMethod -Uri "https://public-api.kiwify.com/v1/sales?start_date=2026-06-01&end_date=2026-06-21&page_size=100" -Headers $h
```

## Alternativa: conector nativo mcp.ai

Existe o MCP `kiwify` no mcp.ai (install_id `mi_VC4V_x_xSuDRjAxT44Q-MYtW`). O formulário dele
funcionaria também — bastava corrigir o Account ID para `Rl8w2...` (L minúsculo). Ficou por script
por já estar testado e sob nosso controle.
