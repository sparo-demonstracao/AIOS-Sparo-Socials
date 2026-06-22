# Google Workspace CLI (`gws`)

Acesso unificado por linha de comando ao Google Workspace (Drive, Gmail, Calendar, Sheets, Docs,
Slides, Tasks, People, Chat e mais). Saída em JSON, feita pra humano **e** pra agente de IA. Lê o
Discovery do Google em runtime, então endpoints novos aparecem sem atualizar a ferramenta.

- **Repo oficial:** https://github.com/googleworkspace/cli (mantido pelo Google — `google-wombot` + Justin Poehnelt)
- **Comando base:** `gws`
- **Conectado em:** 2026-06-22 · conta `agenciasparo@gmail.com` · projeto GCP `aios-sparo-yt`
- *Disclaimer do projeto: "This is not an officially supported Google product."*

## Estrutura de comando

```
gws <service> <resource> [sub-resource] <method> [flags]
```

Flags principais:
- `--params '<JSON>'` — parâmetros de URL/query (ex.: `{"userId":"me","maxResults":10}`)
- `--json '<JSON>'` — corpo da requisição (POST/PATCH/PUT)
- `--format json|table|yaml|csv` (default: json)
- `--page-all` / `--page-limit N` — auto-paginação (NDJSON, 1 linha por página)
- `--upload <PATH>` / `--output <PATH>` — upload/download de mídia binária

**Descoberta:** `gws <service> --help` lista os resources; `gws schema <service.resource.method>`
mostra os parâmetros exatos de um método. Use isso em vez de adivinhar.

Serviços: `drive sheets gmail calendar docs slides tasks people chat classroom forms keep meet
admin reports script workflow`.

## Como invocar (⚠️ importante no Windows)

**Use a ferramenta Bash (Git Bash), não o PowerShell, pra comandos com JSON.** O PowerShell 5.1
desta máquina mastiga as aspas e quebra o argumento em espaços. No Bash, aspas simples preservam
tudo:

```bash
# ✅ Bash — limpo, aguenta espaços no JSON
gws drive files list --params '{"pageSize":5,"orderBy":"modifiedTime desc"}' --format table
```

Se *precisar* rodar no PowerShell: escape as aspas com `\"` **e evite espaços** dentro do JSON
(o espaço em `"modifiedTime desc"` corta o argumento). Ex.: `--params '{\"pageSize\":5}'`.

**Subcomandos são camelCase**, não kebab-case: `calendarList` (não `calendar-list`),
`getProfile` (não `get-profile`).

**PATH:** `gws` (npm global) e `gcloud` já estão no PATH de um terminal novo. Dentro de uma sessão
PowerShell recém-aberta por ferramenta, pode ser preciso reinjetar:
`$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')`

## Instalação (já feita)

```bash
npm install -g @googleworkspace/cli   # wrapper npm baixa o binário Rust no postinstall
```

Requer Node (tem v24) e, só pro `gws auth setup`, o gcloud (Google Cloud SDK, instalado via
`winget install --id Google.CloudSDK`).

## Autenticação (como foi montada)

O `gws auth setup` automático **não consegue criar o cliente OAuth** — é uma limitação do Google
(cliente OAuth só nasce no Console). O que funcionou:

1. `gcloud auth login` → conta `agenciasparo@gmail.com`, projeto `aios-sparo-yt`.
2. `gcloud services enable` das 5 APIs (drive, gmail, calendar-json, docs, sheets) — habilitar é grátis.
3. No Console (https://console.cloud.google.com/apis/credentials?project=aios-sparo-yt):
   criar **OAuth client ID → Desktop app**, baixar o JSON.
4. JSON salvo em `C:\Users\canal\.config\gws\client_secret.json`.
5. `gws auth login --scopes "<escopos>"` → navegador → "Permitir". Credenciais ficam **criptografadas**
   (AES-256-GCM, chave no keyring do Windows) em `C:\Users\canal\.config\gws\credentials.enc`.

### Escopos concedidos (leitura + escrita)

```
openid · userinfo.email · userinfo.profile
https://www.googleapis.com/auth/drive            (Drive read/write)
https://www.googleapis.com/auth/gmail.modify     (Gmail ler/escrever/ENVIAR)
https://www.googleapis.com/auth/calendar         (Calendar read/write)
https://www.googleapis.com/auth/documents        (Docs read/write)
https://www.googleapis.com/auth/spreadsheets     (Sheets read/write)
```

`gmail.modify` já cobre envio (`users.messages.send`). Pra reduzir/ampliar acesso depois, refaça o
`gws auth login` com outros `--scopes` (ou `--readonly` / `--full` / `-s drive,gmail,...`).

### Gerenciar auth

```bash
gws auth status      # quem está logado, escopos, validade do token
gws auth login ...   # (re)autenticar
gws auth logout      # limpar credenciais e cache de token
gws auth export      # imprimir credenciais descriptografadas (cuidado)
```

## Exemplos testados (funcionando em 2026-06-22)

```bash
# Drive — últimos arquivos
gws drive files list --params '{"pageSize":5,"orderBy":"modifiedTime desc","fields":"files(name,mimeType,modifiedTime)"}' --format table

# Gmail — perfil (total de mensagens/threads)
gws gmail users getProfile --params '{"userId":"me"}'

# Gmail — listar mensagens
gws gmail users messages list --params '{"userId":"me","maxResults":10}'

# Calendar — minhas agendas
gws calendar calendarList list --format table

# Calendar — atalho de agenda do dia
gws calendar +agenda

# Gmail — atalho de envio (rascunho/enviar)
gws gmail +send --to fulano@exemplo.com --subject "Assunto"
```

## Como isto se encaixa no AIOS

Mecanismo `script`/CLI que cobre Gmail, Calendar e Drive (que já tinham MCP) **e abre Docs, Sheets,
Slides, Tasks** — antes inalcançáveis. Bom candidato pra automações que produzem artefatos (ex.:
gerar um Google Doc de roteiro, planilha de controle de vídeos, resumo semanal). Ver `connections.md`.
