# Zoho Mail API — leitura de e-mail pro Resumo Matinal

Como o **daily-brief** lê a caixa do Zoho: OAuth 2.0 com **refresh token** guardado no `.env`
(mesmo padrão do YouTube). O script troca o refresh token por um access token de curta duração e
chama a REST do Zoho Mail. Nada de MCP — coleta agendada às 11h precisa ser confiável sem sessão.

Data center da conta: **`.com`** (global/Brasil). Se um dia migrar de DC, trocar os hosts no `.env`
(`ZOHO_ACCOUNTS_HOST` / `ZOHO_API_HOST`) — ver tabela no fim.

## Chaves no `.env`

```
ZOHO_CLIENT_ID=1000.xxxxxxxxxxxxxxxxxxxx
ZOHO_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ZOHO_REFRESH_TOKEN=1000.xxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxx
# opcionais:
ZOHO_ACCOUNT_ID=            # se vazio, o script descobre a 1ª conta automaticamente
ZOHO_FOLDER_ID=             # se vazio, o script acha a Inbox (folderType=Inbox)
ZOHO_ACCOUNTS_HOST=https://accounts.zoho.com   # só troca se a conta for de outro DC
ZOHO_API_HOST=https://mail.zoho.com            # idem
```

Sem `ZOHO_CLIENT_ID` **e** `ZOHO_REFRESH_TOKEN`, o bloco Zoho no `Run-DailyBrief.ps1` é **pulado**
(o resumo sai normal com as outras fontes).

## Como gerar o refresh token (Self Client — feito UMA vez)

1. Acesse **https://api-console.zoho.com/** logado na conta do Zoho Mail → **Add Client** →
   escolha **Self Client** → Create. Anote **Client ID** e **Client Secret**.
2. Aba **Generate Code**:
   - **Scope:** `ZohoMail.accounts.READ,ZohoMail.messages.READ`
   - **Time Duration:** 10 minutos · **Scope Description:** qualquer texto → **Create**.
   - Escolha o **portal**/produção e **copie o `code`** gerado (é o grant token, expira em minutos).
3. Troque o `code` por um **refresh token** (rode logo, antes do code expirar):
   ```bash
   curl -s "https://accounts.zoho.com/oauth/v2/token" \
     -d "grant_type=authorization_code" \
     -d "client_id=SEU_CLIENT_ID" \
     -d "client_secret=SEU_CLIENT_SECRET" \
     -d "code=O_CODE_COPIADO"
   ```
   A resposta traz `refresh_token` (guarde no `.env`) e um `access_token` (descartável).
   O **refresh token não expira** sozinho — só se você revogar no API Console.

> Atalho: me passe **Client ID + Client Secret + o `code`** no chat que eu rodo a troca e escrevo
> as chaves no `.env` pra você. O `code` dura poucos minutos, então gere e mande na hora.

## Runtime (o que o script faz a cada coleta)

1. **Access token** a partir do refresh token:
   ```
   POST https://accounts.zoho.com/oauth/v2/token
   body (x-www-form-urlencoded):
     refresh_token=<...>&client_id=<...>&client_secret=<...>&grant_type=refresh_token
   → { access_token, expires_in: 3600, ... }
   ```
2. **Header de autenticação** (ATENÇÃO: prefixo do Zoho, **não** é `Bearer`):
   ```
   Authorization: Zoho-oauthtoken <access_token>
   ```
3. **accountId** (se não estiver no `.env`):
   ```
   GET https://mail.zoho.com/api/accounts   →   data[0].accountId
   ```
4. **folderId da Inbox** (se não estiver no `.env`):
   ```
   GET https://mail.zoho.com/api/accounts/{accountId}/folders
   → escolhe o folder com folderType == "Inbox"
   ```
5. **Listar e-mails recentes da Inbox:**
   ```
   GET https://mail.zoho.com/api/accounts/{accountId}/messages/view
       ?limit=25&sortBy=date&sortorder=false&status=all&folderId={inbox}
   ```
   - `sortorder=false` = **decrescente** (mais novos primeiro). `limit` 1–200.
   - Campos usados por item: `messageId`, `fromAddress`, `subject`, `summary`, `folderId`,
     `receivedTime`, `sentDateInGMT`.
   - ⚠️ **`receivedTime` vem em epoch MILISSEGUNDOS (string)** — dividir por 1000 antes de comparar
     com a janela das últimas 24h (em segundos). O script já faz isso.
6. **Link do item** (abre o e-mail direto no webmail):
   `https://mail.zoho.com/zm/#mail/folder/{folderId}/{messageId}` — se o formato não abrir a mensagem
   exata num dia, cai no fallback da própria Inbox. (Zoho não permite pré-preencher a resposta como o
   WhatsApp; o link só abre pra você responder lá.)

## Diagnóstico rápido (se o Zoho sumir do resumo)

```powershell
# lê as chaves do .env do projeto
$env=@{}; Get-Content ".env" | ForEach-Object { if($_ -match '^\s*([A-Za-z_]\w*)\s*=\s*(.*)$'){ $env[$matches[1]]=$matches[2].Trim() } }
# 1) refresh -> access token
$b="refresh_token=$($env.ZOHO_REFRESH_TOKEN)&client_id=$($env.ZOHO_CLIENT_ID)&client_secret=$($env.ZOHO_CLIENT_SECRET)&grant_type=refresh_token"
$t=Invoke-RestMethod "https://accounts.zoho.com/oauth/v2/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body $b
$h=@{ Authorization="Zoho-oauthtoken $($t.access_token)" }
# 2) contas e 3) últimos e-mails
Invoke-RestMethod "https://mail.zoho.com/api/accounts" -Headers $h | % { $_.data } | Select accountId, primaryEmailAddress
```

Erros comuns:
- **`INVALID_OAUTHTOKEN` / 401** → access token errado ou header sem o prefixo `Zoho-oauthtoken`.
- **`invalid_code`** na troca inicial → o `code` do Self Client expirou (gere outro, é rápido).
- **Refresh parou de funcionar** → token revogado no API Console, ou a conta mudou de DC (trocar os
  hosts `ZOHO_ACCOUNTS_HOST`/`ZOHO_API_HOST`).
- **Só aparece e-mail antigo** → `sortorder` invertido, ou a Inbox não foi encontrada e caiu em "todas
  as pastas" (setar `ZOHO_FOLDER_ID` no `.env`).
- **`/folders` dá 401** → é ESPERADO: os escopos usados (`accounts.READ` + `messages.READ`) NÃO
  incluem `ZohoMail.folders.READ`, então a listagem de pastas falha. Não faz falta — o `messages/view`
  **sem** folderId já cai na Inbox. Mesmo assim, o folderId da Inbox está fixado no `.env`
  (`ZOHO_FOLDER_ID`), então a chamada a `/folders` nem acontece no runtime. **Setup atual (jul/2026):**
  conta `atendimento@sparo.com.br`, accountId `8159880000000008002`, Inbox folderId
  `8159880000000008014`. Se um dia precisar da API de pastas, adicionar `ZohoMail.folders.READ` ao
  gerar um novo code.

## Escrita — Triagem de Atendimento (aplicar tag + rascunhar)

A **Triagem da caixa de atendimento** (`scripts/triagem-email/triar-zoho.mjs`) escreve no Zoho —
aplica tag e cria rascunho. Isso exige **escopos além dos de leitura** do Resumo Matinal. Como OAuth
não deixa acrescentar escopo num refresh token existente, é preciso **regerar o code do Self Client**
com a lista ampliada (o refresh token novo substitui o antigo no `.env`). A lista é superset — o Resumo
Matinal continua funcionando.

**Scope completo (leitura + escrita):**
```
ZohoMail.accounts.READ,ZohoMail.messages.READ,ZohoMail.tags.READ,ZohoMail.messages.UPDATE,ZohoMail.messages.CREATE
```

Endpoints usados pela triagem (todos com `Authorization: Zoho-oauthtoken <access>`):

1. **Listar as tags** (pega os `labelId` que o Enzo criou; casados por nome):
   `GET /api/accounts/{accountId}/labels` — scope `ZohoMail.tags.READ`.
   Campos: `labelId`, `displayName`, `color`.
2. **Corpo do e-mail** (o `messages/view` só traz `summary`):
   `GET /api/accounts/{accountId}/folders/{folderId}/messages/{messageId}/content` — scope `messages.READ`.
3. **Aplicar tag:**
   `PUT /api/accounts/{accountId}/updatemessage` — scope `ZohoMail.messages.UPDATE`.
   Body: `{"mode":"applyLabel","messageId":[<long>],"labelId":[<long>]}`.
   > ⚠️ `messageId` do Zoho é um **long** que estoura o `Number` do JS (perde precisão). O script emite
   > o id como **literal numérico** no JSON (string→literal), sem passar por `Number()`.
4. **Criar rascunho de resposta:**
   `POST /api/accounts/{accountId}/messages` — scope `ZohoMail.messages.CREATE`.
   Body: `{"mode":"draft","fromAddress":"atendimento@sparo.com.br","toAddress":"<remetente>","subject":"Re: ...","content":"<html>","mailFormat":"html"}`.
   Opcionais de thread (não usados na v1, pois o `messages/view` não traz o Message-ID RFC): `inReplyTo`, `refHeader`.
   > L2 — `mode:draft` **nunca envia**. O Enzo revisa e manda.

Fontes: Apply labels — https://www.zoho.com/mail/help/api/add-tag-to-email.html ·
Get all labels — https://www.zoho.com/mail/help/api/get-all-label-details.html ·
Save draft — https://www.zoho.com/mail/help/api/post-save-draft-template.html

## Hosts por data center

| DC | ZOHO_ACCOUNTS_HOST | ZOHO_API_HOST |
|---|---|---|
| **.com (global/Brasil)** | `https://accounts.zoho.com` | `https://mail.zoho.com` |
| .eu | `https://accounts.zoho.eu` | `https://mail.zoho.eu` |
| .in | `https://accounts.zoho.in` | `https://mail.zoho.in` |
| .com.au | `https://accounts.zoho.com.au` | `https://mail.zoho.com.au` |

## Fontes
- Email Messages / List Emails API: https://www.zoho.com/mail/help/api/get-emails-list.html
- OAuth 2.0 (Self Client, escopos): https://www.zoho.com/mail/help/api/using-oauth-2.html
- Índice da API: https://www.zoho.com/mail/help/api/
