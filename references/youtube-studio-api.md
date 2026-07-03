# YouTube Studio — API de Analytics (guia de uso)

Acesso aos dados PRIVADOS do canal @EnzoSparo: faturamento, visualizações, tempo assistido,
inscritos. Conectado por **script**, via API oficial do Google (gratuita). Projeto Google Cloud:
**"AIOS YouTube"**. Configurado em 2026-06-21.

## Credenciais (no .env)

- `YOUTUBE_CLIENT_ID` / `YOUTUBE_CLIENT_SECRET` — OAuth client (tipo **Aplicativo da Web**) do
  projeto Google Cloud "AIOS YouTube".
- `YOUTUBE_REFRESH_TOKEN` — token de atualização da conta `agenciasparo@gmail.com` (dona do canal).
  Capturado uma vez pelo script `c:\tmp\yt_oauth.py`. Não expira no uso normal.
- Canal: @EnzoSparo, ID `UCifUfSNdly4yFOfzSDS2xog`.
- Escopos autorizados: `youtube.force-ssl` (leitura **e escrita** na Data API — permite
  `videos.update`, responder comentários etc.), `yt-analytics.readonly`,
  `yt-analytics-monetary.readonly`. (Recapturado via `c:\tmp\yt_oauth.py`; versão antiga deste guia
  listava só leitura — `youtube.readonly` foi superado pelo `force-ssl`.)

## Como autenticar a cada chamada

1. Trocar o refresh_token por um access_token (válido ~1h):
   - POST `https://oauth2.googleapis.com/token`
   - Content-Type: `application/x-www-form-urlencoded`
   - Body: `client_id=..&client_secret=..&refresh_token=..&grant_type=refresh_token`
2. Usar `Authorization: Bearer <access_token>` nas chamadas da API.

## Endpoint principal — Relatórios

GET `https://youtubeanalytics.googleapis.com/v2/reports`

Parâmetros úteis:
- `ids=channel==MINE` (o canal do dono autenticado).
- `startDate` / `endDate` no formato `AAAA-MM-DD`.
- `metrics=views,estimatedMinutesWatched,estimatedRevenue,subscribersGained` (e muitas outras:
  `likes`, `comments`, `averageViewDuration`, `cpm`, `playbackBasedCpm`, etc.).
- `currency=BRL` → devolve a receita já em reais (padrão é USD).
- `dimensions=day` ou `video` para detalhar; `sort=-estimatedRevenue` para ordenar.

> ⚠️ **Receita (`estimatedRevenue`) exige o escopo monetary** (já autorizado) e canal monetizado.

## Pegadinhas que já custaram tempo (não repetir)

1. **`redirect_uri_mismatch` na autorização:** o OAuth client precisa ser **Aplicativo da Web** com
   os URIs `http://127.0.0.1:8765/` e `http://localhost:8765/` cadastrados em "URIs de
   redirecionamento autorizados". (Tipo "App para computador" deu mismatch.)
2. **`dimensions=month` reclama de alinhamento de data** mesmo com início/fim em começo/fim de mês.
   Solução adotada: NÃO usar a dimensão month — fazer uma chamada por mês (intervalo `01` ao último
   dia) e somar. Funciona sempre.
3. O app está em modo **teste** (tela de consentimento), com `agenciasparo@gmail.com` como usuário
   de teste. Por isso aparece "O Google não verificou este app" → Avançado → Acessar. É esperado.

## Exemplo (PowerShell) — receita do mês em reais

```powershell
$lines = Get-Content ".env"
function Get-EnvVal($n){ (($lines|?{$_ -match "^$n="}) -replace "^$n=","").Trim() }
$tok = Invoke-RestMethod -Uri "https://oauth2.googleapis.com/token" -Method POST `
  -ContentType "application/x-www-form-urlencoded" `
  -Body "client_id=$(Get-EnvVal 'YOUTUBE_CLIENT_ID')&client_secret=$(Get-EnvVal 'YOUTUBE_CLIENT_SECRET')&refresh_token=$(Get-EnvVal 'YOUTUBE_REFRESH_TOKEN')&grant_type=refresh_token"
$h = @{ Authorization = "Bearer $($tok.access_token)" }
$q = "ids=channel==MINE&startDate=2026-06-01&endDate=2026-06-21&metrics=views,estimatedRevenue,subscribersGained&currency=BRL"
Invoke-RestMethod -Uri "https://youtubeanalytics.googleapis.com/v2/reports?$q" -Headers $h
```

## Snapshot inicial (2026, capturado em 21/jun)

Total no ano: 2.356.880 views · R$ 17.553,86 de receita estimada · 37.378 novos inscritos.
Pico em Mar/26 (1,08 mi views). Detalhe mês a mês foi mostrado ao Enzo na conexão.
