# Segredos pra levar pro laptop (NÃO estão no Git)

Estes arquivos são propositalmente ignorados pelo Git (`.gitignore`). Sem eles, o motor do
AIOS não autentica. Copie por meio **privado** (pen drive / sync criptografado) — nunca por
e-mail ou WhatsApp. Depois de copiar, guarde no **mesmo lugar relativo** dentro do repo.

## Obrigatórios

| Arquivo (caminho relativo ao repo) | O que tem dentro |
|---|---|
| `.env` | Kiwify keys · YouTube OAuth refresh token · WAHA `X-Api-Key` · Apify token + **cookie do Skool** · `OPENROUTER_API_KEY` |
| `scripts/baixar-aulas/rclone.conf` | token OAuth do **Google Drive** (texto puro — trate como senha) |
| `scripts/baixar-aulas/profile/` | cookies de sessão da **Kiwify** (login pra baixar aulas) |

## Se existirem (Google OAuth do gws/YouTube)

| Padrão | O que é |
|---|---|
| `*.credentials.json` | credenciais OAuth do Google |
| `client_secret*.json` | client secret do projeto Google `aios-sparo-yt` |
| `token.json` | token de acesso já trocado |

## Fora do repo (mas parte do AIOS)

| Pasta | O que é |
|---|---|
| `Downloads\transcricao-masterclass\` | venv + `transcrever.py` + `models/large-v3` (cache do Whisper) |
| `Documentos\Obsidian\Enzo Barbatto` | o vault do segundo cérebro (outro projeto Claude Code) |

## Depois de copiar — confira (não imprima os valores!)

```powershell
Test-Path .\.env
Test-Path .\scripts\baixar-aulas\rclone.conf
Test-Path .\scripts\baixar-aulas\profile
```

> 🔒 **Dica de segurança:** o token do Drive no `rclone.conf` ficou exposto em texto puro.
> Se algum dia esse arquivo vazar, **revogue** o acesso na conta Google e gere de novo.
