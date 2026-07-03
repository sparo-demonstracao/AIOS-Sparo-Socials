# Conectar-Zoho.ps1 — troca o "code" do Self Client por um refresh token e grava no .env.
# RODE VOCÊ MESMO no seu terminal. Nada sensível passa pelo chat/Claude: os segredos são
# digitados aqui, a troca é HTTPS direto com o Zoho, e o resultado vai só pro .env local.
#
# Uso:
#   powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\daily-brief\Conectar-Zoho.ps1"
#
# Antes: crie um Self Client em https://api-console.zoho.com/  (Add Client -> Self Client),
# aba Generate Code, e copie o "code". SCOPE recomendado (leitura p/ o Resumo + escrita p/ a Triagem):
#   ZohoMail.accounts.READ,ZohoMail.messages.READ,ZohoMail.tags.READ,ZohoMail.messages.UPDATE,ZohoMail.messages.CREATE
# (Só leitura, se não usar a triagem: ZohoMail.accounts.READ,ZohoMail.messages.READ)
# O escopo maior é superset — o Resumo Matinal continua funcionando e a Triagem de Atendimento ganha
# permissão pra aplicar tag e criar rascunho. Ver references/zoho-mail-api.md.
#
# Modo ASSISTIDO (o Claude roda por você, sem os segredos passarem pelo chat): passe -InFile
# apontando um arquivo com 3 linhas — client_id=... / client_secret=... / code=... — que o script
# LÊ e APAGA na hora (o segredo não fica no disco). Sem -InFile, ele pergunta os dados no terminal.

param([string]$InFile)

$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$Proj    = "C:\Users\canal\Documentos\Antigravity Projetos\AIOS - Sparo Socials"
$EnvFile = Join-Path $Proj ".env"
$AcctHost = 'https://accounts.zoho.com'   # DC .com (Brasil/global)
$ApiHost  = 'https://mail.zoho.com'

Write-Host ""
Write-Host "== Conectar Zoho Mail ao Resumo Matinal ==" -ForegroundColor Cyan
Write-Host "Cole os dados do Self Client (eles ficam SÓ nesta janela)." -ForegroundColor DarkGray
Write-Host ""

if($InFile){
  if(-not (Test-Path $InFile)){ Write-Host "Arquivo não encontrado: $InFile" -ForegroundColor Red; exit 1 }
  $kv=@{}; Get-Content -Path $InFile -Encoding UTF8 | ForEach-Object { if($_ -match '^\s*([A-Za-z_]\w*)\s*=\s*(.*)$'){ $kv[$matches[1].ToLower()]=$matches[2].Trim() } }
  Remove-Item $InFile -Force -ErrorAction SilentlyContinue   # apaga JÁ — o segredo não fica no disco
  $clientId=[string]$kv['client_id']; $clientSecret=[string]$kv['client_secret']; $code=[string]$kv['code']
  Write-Host "(Modo assistido: li e apaguei $InFile)" -ForegroundColor DarkGray
} else {
  $clientId = (Read-Host "Client ID").Trim()
  $secSec   = Read-Host "Client Secret" -AsSecureString
  $clientSecret = [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secSec))
  $code     = (Read-Host "Code (grant token — expira em minutos)").Trim()
}

if(-not $clientId -or -not $clientSecret -or -not $code){ Write-Host "Faltou algum campo. Abortando." -ForegroundColor Red; exit 1 }

# 1) troca o code por refresh token
Write-Host "`nTrocando o code por um refresh token..." -ForegroundColor Yellow
$body = "grant_type=authorization_code&client_id=$clientId&client_secret=$clientSecret&code=$code"
try {
  $r = Invoke-RestMethod -Uri "$AcctHost/oauth/v2/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body $body -TimeoutSec 30
} catch { Write-Host "Falha na troca: $($_.Exception.Message)" -ForegroundColor Red; exit 1 }

if(-not $r.refresh_token){
  Write-Host "O Zoho NÃO devolveu refresh_token." -ForegroundColor Red
  if($r.error){ Write-Host "Erro do Zoho: $($r.error)" -ForegroundColor Red }
  Write-Host "Causas comuns: o code expirou (gere outro) ou já foi usado. Gere um code novo e rode de novo." -ForegroundColor DarkGray
  exit 1
}
$refresh = $r.refresh_token
$access  = $r.access_token
Write-Host "Refresh token obtido." -ForegroundColor Green

# 2) descobre accountId e a pasta Inbox (pra o resumo já vir certinho e mais rápido)
$accountId = ""; $folderId = ""
try {
  $h = @{ Authorization = "Zoho-oauthtoken $access" }
  $accs = Invoke-RestMethod -Uri "$ApiHost/api/accounts" -Headers $h -TimeoutSec 30
  $a = @($accs.data)[0]
  $accountId = [string]$a.accountId
  $email = [string]$a.primaryEmailAddress
  Write-Host "Conta: $email (accountId $accountId)" -ForegroundColor Green
  $fol = Invoke-RestMethod -Uri "$ApiHost/api/accounts/$accountId/folders" -Headers $h -TimeoutSec 30
  $inbox = @($fol.data | Where-Object { $_.folderType -eq 'Inbox' -or $_.path -eq '/Inbox' } | Select-Object -First 1)
  if($inbox){ $folderId = [string]$inbox[0].folderId }
} catch { Write-Host "(Não consegui descobrir accountId/Inbox agora — o resumo descobre sozinho depois.)" -ForegroundColor DarkGray }

# 3) grava no .env (atualiza a chave se já existir — inclusive linhas comentadas — senão acrescenta)
function Set-EnvKey([string[]]$lines, [string]$key, [string]$val){
  $pat = "^\s*#?\s*$([regex]::Escape($key))\s*="
  $done = $false
  $out = foreach($ln in $lines){ if($ln -match $pat){ $done = $true; "$key=$val" } else { $ln } }
  if(-not $done){ $out += "$key=$val" }
  ,$out
}
$lines = @()
if(Test-Path $EnvFile){ $lines = Get-Content -Path $EnvFile -Encoding UTF8 }
$lines = Set-EnvKey $lines 'ZOHO_CLIENT_ID'     $clientId
$lines = Set-EnvKey $lines 'ZOHO_CLIENT_SECRET' $clientSecret
$lines = Set-EnvKey $lines 'ZOHO_REFRESH_TOKEN' $refresh
if($accountId){ $lines = Set-EnvKey $lines 'ZOHO_ACCOUNT_ID' $accountId }
if($folderId){  $lines = Set-EnvKey $lines 'ZOHO_FOLDER_ID'  $folderId }
# .env SEM BOM (um BOM na 1ª linha quebraria o parse da 1ª chave no Run-DailyBrief)
[IO.File]::WriteAllText($EnvFile, (($lines -join "`r`n") + "`r`n"), (New-Object Text.UTF8Encoding($false)))
Write-Host "`nChaves gravadas no .env (que já é ignorado pelo git)." -ForegroundColor Green

# 4) teste rápido: conta quantos e-mails recentes a Inbox devolve
try {
  $h = @{ Authorization = "Zoho-oauthtoken $access" }
  $u = "$ApiHost/api/accounts/$accountId/messages/view?limit=5&sortBy=date&sortorder=false&status=all"
  if($folderId){ $u += "&folderId=$folderId" }
  $t = Invoke-RestMethod -Uri $u -Headers $h -TimeoutSec 30
  $n = @($t.data).Count
  Write-Host "Teste OK: a Inbox respondeu com $n e-mail(s) recente(s)." -ForegroundColor Green
  Write-Host "`nPronto! O Zoho já vai entrar no próximo Resumo Matinal." -ForegroundColor Cyan
  Write-Host "Pra ver agora: apague o cache e reabra o app  ->  Remove-Item C:\tmp\aios-brief.json" -ForegroundColor DarkGray
} catch { Write-Host "Gravou as chaves, mas o teste de leitura falhou: $($_.Exception.Message)" -ForegroundColor Yellow }

# limpa o segredo da memória
$clientSecret = $null; [GC]::Collect()
