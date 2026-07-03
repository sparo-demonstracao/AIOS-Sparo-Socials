# Abrir-Matinal.ps1 — o "cérebro" do app Resumo Matinal (é o que o Resumo Matinal.exe roda).
#
# Regra:
#   • Já existe resumo DE HOJE (a tarefa das 11h já rodou, ou você já abriu hoje)?
#       -> abre o pop-up NA HORA, sem esperar.
#   • É a PRIMEIRA vez no dia?
#       -> abre a tela de carregamento mostrando os LOGS REAIS da coleta (WhatsApp/Gmail/YouTube),
#          roda o Run-DailyBrief em segundo plano (oculto, sem console), e quando termina mostra o
#          resumo — que fica guardado pro resto do dia (próximas aberturas são instantâneas).
#
# Rodar:  powershell -NoProfile -Sta -ExecutionPolicy Bypass -File "<este arquivo>"

$ErrorActionPreference = 'Continue'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$Dir          = "C:\Users\canal\Documentos\Antigravity Projetos\AIOS - Sparo Socials\scripts\daily-brief"
$JsonPath     = "C:\tmp\aios-brief.json"
$ProgressFile = "C:\tmp\aios-brief-progress.log"
$RunScript    = Join-Path $Dir "Run-DailyBrief.ps1"
$PopupPs1     = Join-Path $Dir "popup.ps1"
$LoadingPs1   = Join-Path $Dir "loading-brief.ps1"
$Hoje         = (Get-Date).ToString("dd/MM/yyyy")

function Show-Result {
  $j = '{"data":"","destaque":"Não consegui montar o resumo agora. Tente abrir de novo em instantes.","secoes":[]}'
  if (Test-Path $JsonPath) { try { $j = [System.IO.File]::ReadAllText($JsonPath, [System.Text.Encoding]::UTF8) } catch {} }
  . $PopupPs1
  Show-BriefPopup $j
}

# É de hoje? -> instantâneo
$jaTemHoje = $false
if (Test-Path $JsonPath) {
  try {
    $cache = [System.IO.File]::ReadAllText($JsonPath, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
    if ($cache.data -eq $Hoje) { $jaTemHoje = $true }
  } catch {}
}

if ($jaTemHoje) {
  Show-Result
  return
}

# Primeira vez no dia -> coleta com tela de carregamento + logs reais
try { Remove-Item $ProgressFile -ErrorAction SilentlyContinue } catch {}

$proc = $null
try {
  $proc = Start-Process -FilePath "powershell.exe" `
    -ArgumentList @('-NoProfile','-Sta','-ExecutionPolicy','Bypass','-WindowStyle','Hidden','-File',$RunScript,'-NoPopup') `
    -WindowStyle Hidden -PassThru
} catch {}

if ($proc) {
  . $LoadingPs1
  Show-LoadingBrief $proc $ProgressFile
} else {
  # fallback raro: não deu pra abrir em segundo plano -> coleta aqui mesmo (sem a tela de logs)
  try { & $RunScript -NoPopup } catch {}
}

# Se você fechou a tela antes de terminar, a coleta continua sozinha em segundo plano — não força o pop-up.
$aindaRodando = $false
if ($proc) { try { $aindaRodando = -not $proc.HasExited } catch {} }
if ($aindaRodando) { return }

Show-Result
