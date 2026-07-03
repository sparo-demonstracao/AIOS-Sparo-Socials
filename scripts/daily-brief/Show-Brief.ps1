# Show-Brief.ps1 — reabre o pop-up interativo com o ÚLTIMO resumo (C:\tmp\aios-brief.json),
# sem re-coletar. Usa o renderizador WPF compartilhado (popup.ps1). É o que o .exe executa.
# Rodar:  powershell -NoProfile -Sta -ExecutionPolicy Bypass -File "<este arquivo>"
$ErrorActionPreference = 'Continue'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$jsonPath = "C:\tmp\aios-brief.json"
if (Test-Path $jsonPath) {
  $json = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
} else {
  $json = '{"data":"","destaque":"Ainda não há um resumo gerado. Rode o Resumo Matinal primeiro (skill daily-brief).","secoes":[]}'
}

. "C:\Users\canal\Documentos\Antigravity Projetos\AIOS - Sparo Socials\scripts\daily-brief\popup.ps1"
Show-BriefPopup $json
