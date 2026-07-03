# Mostrar-Resumo.ps1 — abre o pop-up NATIVO do Resumo Matinal com o ÚLTIMO resumo já gravado.
# NÃO recoleta nada: só lê C:\tmp\aios-brief.json e mostra o Show-BriefPopup (o mesmo pop-up de
# todo dia, com os cards do YouTube divididos etc.). É o que o botão de "olho" do painel dispara.
# Precisa de -Sta (WPF) — o painel já chama com -Sta.

$ErrorActionPreference = 'Continue'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$Dir   = "C:\Users\canal\Documentos\Antigravity Projetos\AIOS - Sparo Socials\scripts\daily-brief"
$Json  = "C:\tmp\aios-brief.json"
$Popup = Join-Path $Dir "popup.ps1"

if (-not (Test-Path $Json)) {
  try {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show("Ainda não há um resumo gerado. Clique em 'Rodar' pra gerar o de hoje.", "Resumo Matinal") | Out-Null
  } catch {}
  return
}

try {
  . $Popup
  Show-BriefPopup ([System.IO.File]::ReadAllText($Json, [System.Text.Encoding]::UTF8))
} catch {
  try { Add-Content -Path "C:\tmp\aios-daily-brief.log" -Value ("{0}  Mostrar-Resumo ERRO: {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $_.Exception.Message) -Encoding utf8 } catch {}
}
