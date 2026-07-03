# Run-Triagem-Zoho.ps1 — AIOS: triagem da caixa de ATENDIMENTO (Zoho — atendimento@sparo.com.br).
# Categoriza (aplica a tag) + rascunha na voz da equipe (L2 — nada é enviado). Idempotente: o triar-zoho.mjs
# guarda os messageId já vistos em C:\tmp\aios-triagem-zoho-seen.json, então re-rodar no mesmo dia não duplica.
# Pensado pra rodar sozinho todo dia via Task Scheduler (ou quando o PC voltar, com -StartWhenAvailable).

$ErrorActionPreference = 'Continue'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$Proj    = "C:\Users\canal\Documentos\Antigravity Projetos\AIOS - Sparo Socials"
$Node    = "C:\Program Files\nodejs\node.exe"
$Script  = Join-Path $Proj "scripts\triagem-email\triar-zoho.mjs"
$LogFile = "C:\tmp\aios-triagem-zoho-cron.log"
$LastOut = "C:\tmp\aios-triagem-zoho-cron-last.txt"

function Log($m){ try { Add-Content -Path $LogFile -Value ("{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $m) -Encoding utf8 } catch {} }

# PATH enxuto do agendador — garante o node.
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

Log "===== Início da Triagem Zoho (atendimento) ====="
Set-Location $Proj
try {
  # --days 7: janela de segurança se o PC ficou dias desligado; o seen-file mantém o custo baixo.
  & $Node $Script --days 7 *> $LastOut
  Log "Triagem Zoho terminou (exit=$LASTEXITCODE). Detalhe: C:\tmp\aios-triagem-zoho.log · JSON: C:\tmp\aios-triagem-zoho.json"
} catch {
  Log "Triagem Zoho ERRO: $($_.Exception.Message)"
}
Log "===== Fim ====="
