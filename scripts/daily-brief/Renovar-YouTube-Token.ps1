# Renovar-YouTube-Token.ps1 — refaz o consentimento OAuth do YouTube e grava um
# YOUTUBE_REFRESH_TOKEN novo no .env do projeto. Use quando a renovação falhar com
# "invalid_grant / Token has been expired or revoked" (token expira a cada 7 dias
# enquanto o app OAuth estiver em modo "Em teste").
#
# Sobe um servidor local em http://localhost:<porta>, abre o navegador pra você
# autorizar na conta do canal, troca o "code" por tokens e grava só o refresh_token.
# NÃO imprime o token na tela.

param([int]$Port = 8080)

$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$Proj    = "C:\Users\canal\Documentos\Antigravity Projetos\AIOS - Sparo Socials"
$EnvFile = Join-Path $Proj ".env"
$Scope   = "https://www.googleapis.com/auth/youtube.force-ssl"
$Redirect = "http://localhost:$Port/"

# --- lê client_id / client_secret do .env ---
$envMap = @{}
Get-Content $EnvFile | ForEach-Object {
  if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') { $envMap[$matches[1]] = $matches[2].Trim() }
}
$ClientId = $envMap['YOUTUBE_CLIENT_ID']
$ClientSecret = $envMap['YOUTUBE_CLIENT_SECRET']
if (-not $ClientId -or -not $ClientSecret) { throw "YOUTUBE_CLIENT_ID/SECRET não encontrados no .env" }

# --- monta a URL de consentimento (offline + prompt=consent força vir refresh_token) ---
$authUrl = "https://accounts.google.com/o/oauth2/v2/auth?" + (@(
  "client_id=$([uri]::EscapeDataString($ClientId))",
  "redirect_uri=$([uri]::EscapeDataString($Redirect))",
  "response_type=code",
  "scope=$([uri]::EscapeDataString($Scope))",
  "access_type=offline",
  "prompt=consent"
) -join "&")

# --- sobe o listener local ANTES de abrir o navegador ---
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($Redirect)
try { $listener.Start() }
catch { throw "Não consegui abrir a porta $Port (talvez em uso). Rode com -Port 3000 e tente de novo. Erro: $($_.Exception.Message)" }

Write-Host ""
Write-Host "Abrindo o navegador para você autorizar o YouTube..." -ForegroundColor Cyan
Write-Host "IMPORTANTE: faça login na conta do CANAL (Enzo Sparo)." -ForegroundColor Yellow
Write-Host "Se abrir a tela 'App não verificado', clique em 'Avançado' -> 'Acessar ...(não seguro)'." -ForegroundColor Yellow
Write-Host ""
Start-Process $authUrl

# --- espera o Google chamar de volta com o ?code=... ---
$context = $listener.GetContext()
$code = $context.Request.QueryString["code"]
$err  = $context.Request.QueryString["error"]

# responde algo bonitinho no navegador
$html = if ($code) { "<h2>Pronto! Pode fechar esta aba e voltar pro terminal.</h2>" }
        else { "<h2>Falhou: $err. Volte pro terminal.</h2>" }
$buf = [System.Text.Encoding]::UTF8.GetBytes("<html><meta charset='utf-8'><body style='font-family:sans-serif'>$html</body></html>")
$context.Response.ContentType = "text/html; charset=utf-8"
$context.Response.OutputStream.Write($buf, 0, $buf.Length)
$context.Response.OutputStream.Close()
$listener.Stop()

if ($err) { throw "Autorização negada/erro: $err" }
if (-not $code) { throw "Não recebi o 'code' do Google." }

# --- troca o code por tokens ---
$body = @{
  code          = $code
  client_id     = $ClientId
  client_secret = $ClientSecret
  redirect_uri  = $Redirect
  grant_type    = "authorization_code"
}
$tok = Invoke-RestMethod -Uri "https://oauth2.googleapis.com/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body $body

if (-not $tok.refresh_token) {
  throw "O Google não devolveu refresh_token. Revogue o acesso antigo em myaccount.google.com/permissions e rode de novo (o prompt=consent já força, mas se persistir é isso)."
}

# --- grava/atualiza YOUTUBE_REFRESH_TOKEN no .env, preservando o resto ---
$lines = Get-Content $EnvFile
$found = $false
$newLines = foreach ($l in $lines) {
  if ($l -match '^\s*YOUTUBE_REFRESH_TOKEN\s*=') { $found = $true; "YOUTUBE_REFRESH_TOKEN=$($tok.refresh_token)" }
  else { $l }
}
if (-not $found) { $newLines = @($newLines) + "YOUTUBE_REFRESH_TOKEN=$($tok.refresh_token)" }
Set-Content -Path $EnvFile -Value $newLines -Encoding utf8

Write-Host ""
Write-Host "OK! YOUTUBE_REFRESH_TOKEN novo gravado no .env." -ForegroundColor Green
Write-Host "Validando a chamada de comentarios do canal..." -ForegroundColor Cyan

# --- valida na hora: renova com o token novo e bate na API ---
$rt = $tok.refresh_token
$rBody = "client_id=$ClientId&client_secret=$ClientSecret&refresh_token=$rt&grant_type=refresh_token"
$r = Invoke-RestMethod -Uri "https://oauth2.googleapis.com/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body $rBody
$h = @{ Authorization = "Bearer $($r.access_token)" }
try {
  $ct = Invoke-RestMethod -Uri "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&allThreadsRelatedToChannelId=UCifUfSNdly4yFOfzSDS2xog&order=time&maxResults=5" -Headers $h -TimeoutSec 40
  Write-Host ("VALIDADO: a API respondeu (itens recentes: {0}). YouTube voltou a funcionar." -f @($ct.items).Count) -ForegroundColor Green
} catch {
  Write-Host "Token gravado, mas a chamada de teste falhou: $($_.Exception.Message)" -ForegroundColor Yellow
}
