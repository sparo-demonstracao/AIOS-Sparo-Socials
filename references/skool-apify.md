# Skool — conexão via ator do Apify

Guia da conexão do Skool (comunidades do Enzo). O Skool **não tem API pública oficial** (2026), então
a leitura/escrita passa por um **ator do Apify** de terceiros. No AIOS usamos **só leitura** (L2 — ver
skill `skool` e `decisions/log.md` 2026-06-24).

## Comunidades (desde 01/07/2026 lemos as DUAS)

- **Automatize-se** (grátis, ~4k membros): slug `comunidade-de-automacao-com-ia-8164`
- **Automatize-se + (Alunos)** (paga, alunos do curso): slug `automatize-se-alunos-2228`

Pra descobrir os slugs de todas as comunidades da conta: com o cookie logado, um browser (Playwright)
consegue chamar `https://api2.skool.com/self/groups?limit=30` de dentro da página (`page.evaluate`) —
cada grupo vem com `name` (slug) e `metadata.display_name`.

## Ator

- **ID:** `cristiantala/skool-all-in-one-api` (na API do Apify vira `cristiantala~skool-all-in-one-api`).
- **Lê:** posts, comentários (aninhados), membros, pedidos pendentes, cursos, settings, Auto DM.
- **Escreve** (não usamos no L2): criar/editar/apagar posts e comentários, aprovar/recusar/banir
  membros, publicar cursos, Auto DM. Escrita exige **admin/mod** na comunidade.
- **Fura o cap de ~35 comentários** do Skool com rolagem via browser (`posts:getCommentsFull`, ~US$ 0,05).

## Auth

Duas opções; usamos a **(A) cookie** (mais rápido, ~2s, sem deixar senha gravada):

- **(A) Cookie:** campo `cookies` = a string inteira do header `Cookie` de uma sessão logada do Skool.
  **Expira ~3,5 dias** — renovado AUTOMATICAMENTE (seção abaixo).
- **(B) Email + senha:** campos `email` + `password` (login via Playwright a cada chamada, ~10s).

### Conta reserva do Apify (failover automático) — desde 01/07/2026

`APIFY_TOKEN_BACKUP` no `.env` = token de uma segunda conta Apify. Se a principal devolver
`Monthly usage hard limit exceeded` (403), o `Invoke-Skool` do `Run-Skool.ps1` troca pro backup
na mesma rodada e segue. Só se as DUAS falharem o pop-up "Apify sem saldo" aparece.
Testado ao vivo em 01/07/2026 (principal sem saldo → backup leu 32 posts numa boa).

### Renovação AUTOMÁTICA do cookie (zero manutenção) — desde 01/07/2026

Com `SKOOL_EMAIL` + `SKOOL_PASSWORD` preenchidos no `.env`, o cookie se renova sozinho:

- **`scripts/skool/renovar-cookie.cjs`** — loga em `www.skool.com/login` via Playwright (headless,
  mesmo runtime do `skool-chat.cjs`, passa o WAF), espera o cookie `auth_token`, e reescreve a
  linha `SKOOL_COOKIES=` do `.env`. Grava a data em `C:\tmp\aios-skool-cookie-renovado.txt`.
  Saída JSON: `{ok:true, cookies:N}` ou `{ok:false, error}`. Teste manual: `node renovar-cookie.cjs`.
- **`Run-Skool.ps1`** chama a renovação em dois momentos: **proativo** (início da rodada, se o
  marcador tem 2+ dias ou não existe) e **reativo** (se `posts:list` não trouxer nenhum post
  válido — cookie vencido no Apify vem como 1 item `{success:false, errorCode:AUTH_ERROR}`, não
  como lista vazia! — renova e tenta 1x de novo).
- Se mesmo assim falhar: pop-up "Skool inacessível" com a causa, e o `aios-skool.json` (rascunhos
  antigos) é **preservado** — nunca mais falso "nenhum pendente ✅" por cookie vencido.

O passo a passo manual abaixo fica como **último recurso** (ex.: Skool adicionou captcha no login).

### Como pegar o cookie do Skool NA MÃO (último recurso)

⚠️ **Gotcha:** o Skool usa AWS WAF (anti-bot). Muitos requests na aba Network vão pra
`...edge.sdk.awsswaf.com` (outro domínio) e **não** carregam o cookie do skool.com (`Sec-Fetch-Site:
cross-site`). Tem que pegar de um request pro **próprio `skool.com`**.

**Jeito mais fácil — extensão Cookie-Editor (recomendado):**
1. Instale a extensão **Cookie-Editor** (Chrome/Edge), abra a comunidade **logado**.
2. Clique no ícone da extensão → **Export** → **Header String** (ou "Export as") → copia tudo.
3. Cole no `.env`, campo `SKOOL_COOKIES=` (uma linha só, sem aspas).

**Jeito manual — aba Network com filtro:**
1. Abra `https://www.skool.com/comunidade-de-automacao-com-ia-8164` **logado**.
2. `F12` → **Network** → no campo de filtro digite `skool.com` e marque **Doc** (ou **Fetch/XHR**).
3. Recarregue (`F5`). Clique numa linha cujo **domínio seja `www.skool.com`** (NÃO `awsswaf`, NÃO
   `cloudfront`).
4. **Headers** → **Request Headers** → linha **`Cookie:`** → copie **todo** o valor
   (`auth_token=...; client_id=...; ...`).
5. Cole no `.env`, campo `SKOOL_COOKIES=`.

> O `auth_token` costuma ser **HttpOnly**, então `document.cookie` no Console **não** mostra ele —
> use a extensão ou a aba Network. A aba Application → Cookies → `https://www.skool.com` também lista
> todos (inclusive HttpOnly), mas aí você monta a string `nome=valor; ...` na mão.

### Alternativa: sem cookie (email + senha)

Se o cookie der trabalho, preencha `SKOOL_EMAIL` + `SKOOL_PASSWORD` no `.env` (e deixe `SKOOL_COOKIES`
no placeholder). O ator faz o login sozinho via Playwright (~US$ 0,02/run) e ainda lida com o WAF.
Trade-off: a senha fica gravada no `.env` (segredo mais sensível que um cookie) e cada rodada faz um
login novo (~10s a mais). Não tem expiração de cookie pra renovar.

## Config no `.env`

```
APIFY_TOKEN=apify_api_...
SKOOL_GROUP_SLUG=comunidade-de-automacao-com-ia-8164
# múltiplas comunidades (prioridade sobre SKOOL_GROUP_SLUG); rótulos SEM acento (parser lê em ANSI):
SKOOL_GROUP_SLUGS=comunidade-de-automacao-com-ia-8164|Gratis;automatize-se-alunos-2228|Alunos+
SKOOL_COOKIES=auth_token=...; client_id=...; ...
```

> O token do Apify foi colado uma vez no chat — **rotacionar** quando der (Apify > Settings >
> Integrations > API tokens > criar novo, apagar o antigo), pela regra "segredo exposto se rotaciona".

## Chamar o ator (HTTP, run-sync)

`POST https://api.apify.com/v2/acts/cristiantala~skool-all-in-one-api/run-sync-get-dataset-items?token=APIFY_TOKEN`
Body JSON:

```json
{
  "action": "posts:list",
  "groupSlug": "comunidade-de-automacao-com-ia-8164",
  "cookies": "auth_token=...; client_id=...",
  "params": { "page": 1 }
}
```

Comentários de um post:

```json
{ "action": "posts:getComments", "groupSlug": "...", "cookies": "...", "params": { "postId": "ID_DO_POST" } }
```

Ações úteis: `posts:list`, `posts:getComments`, `posts:getCommentsFull` (thread cheia, ~US$ 0,05).

## Custo

- Leitura básica: ~US$ 0,005 / operação.
- Login: ~US$ 0,02. Escrita: ~US$ 0,01. Scrape (thread cheia): ~US$ 0,05.
- Uma rodada típica de leitura (1 list + N getComments) sai por **centavos**.

## Schema confirmado (calibrado em 2026-06-24)

Cada **post** e **comentário** vem com: `id`, `name` (slug — NÃO é o autor), `title`, `content`,
`author` (**objeto** `{id, firstName, lastName, slug}` — não é string!), `createdAt`, `updatedAt`,
`likes`, `commentCount`, `isPinned`, `url`, `rootId`, `parentId`. Comentários ainda têm `replies[]`
(respostas aninhadas). O `Run-Skool.ps1` já trata tudo isso (`Get-Author` monta `firstName+lastName`).

**Gotcha do PowerShell (importante):** o `Invoke-RestMethod` às vezes devolve o array de itens
**aninhado** — 1 elemento que é, ele mesmo, o array de N posts (parece "1 post com campos em array").
Não é erro do servidor (as runs no Apify dão `SUCCEEDED`); é unrolling do PowerShell. O
`Invoke-SkoolSafe` **desempacota** (`while count==1 e [0] é array`). Se mexer no parsing, manter isso.

A saída crua de cada rodada fica em `C:\tmp\aios-skool-raw.json` (pra depurar campos novos).

## Chat / DMs — via Playwright (NÃO pelo ator)

O ator do Apify **não lê DMs** (não tem ação de chat; está no roadmap deles). O chat fica na API
`https://api2.skool.com/self/chat-channels`, **atrás do AWS WAF**. Aprendizados (calibrado 2026-06-24):

- **HTTP puro dá 401**, mesmo com o cookie certo OU com `Authorization: Bearer <auth_token>` — o WAF
  bloqueia cliente não-navegador, e o `api2` usa um access token próprio que o SPA obtém depois do login.
- **A solução é navegador real (Playwright):** ele passa o desafio JS do WAF. O cookie precisa estar no
  domínio **`.skool.com`** (todos os subdomínios), senão não chega no `api2` (era esse o 401 inicial).
- Fluxo do `skool-chat.cjs`: carrega `www.skool.com` com o cookie em `.skool.com` → clica no botão de
  chat (seletor `[class*="ChatNotificationsIconButton"]`) → captura a resposta de `/self/chat-channels`.
- **Schema do canal:** `user` (o membro, com `first_name`/`last_name`), `metadata.num_unread`,
  `last_message.metadata.content` (o texto da última mensagem), `user_ids`. O id do Enzo é
  `7c49aa3ab078427cbd407d07dd9529ad`. Filtra por `num_unread > 0` = quem espera resposta.
- **Histórico da thread (desde 01/07/2026):** `GET api2.skool.com/channels/<channelId>/messages?before=35&after=35`
  devolve `{messages:[{metadata:{content, src, dst}, created_at, ...}]}` — `src` = quem enviou
  (comparar com o id do Enzo pra saber de que lado veio). O `skool-chat.cjs` anexa as últimas 12
  como `conversa[]` em cada DM. Buscar `/messages` via fetch NÃO marca a conversa como lida — quem
  marca é o `POST/GET .../read`, disparado pela UI ao abrir a conversa (não clicar em conversa
  em browser automatizado logado).
- **Recalibrar** (se o Skool mudar a tela): `node scripts/skool/explore-chat.cjs <pasta-saida>` — ele
  abre o chat, salva `chat-channels.json` e dumpa a estrutura.

## Fontes

- [Skool All-in-One API · Apify](https://apify.com/cristiantala/skool-all-in-one-api)
- [Skool Public API · Skool Community](https://www.skool.com/community/skool-public-api)
- [Apify API — run actor synchronously](https://docs.apify.com/api/v2)
