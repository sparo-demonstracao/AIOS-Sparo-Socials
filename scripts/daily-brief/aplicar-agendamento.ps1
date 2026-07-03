# aplicar-agendamento.ps1 — define os gatilhos do Resumo Matinal: 7:55 todo dia
# E também ao ligar o PC (logon, com 2 min de folga). Pede admin sozinho (UAC).
# Uso: clique direito > "Executar com PowerShell", e aceite o aviso do Windows.

$ehAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $ehAdmin) {
  Start-Process powershell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
  exit
}

$nome = "AIOS - Resumo Matinal"
try {
  $daily = New-ScheduledTaskTrigger -Daily -At 7:55am
  $logon = New-ScheduledTaskTrigger -AtLogOn
  try { $logon.Delay = 'PT2M' } catch {}
  Set-ScheduledTask -TaskName $nome -Trigger @($daily, $logon) -ErrorAction Stop | Out-Null
  $i = Get-ScheduledTask -TaskName $nome | Get-ScheduledTaskInfo
  Write-Host "Pronto! Resumo Matinal agora roda 7:55 + ao ligar o PC." -ForegroundColor Green
  Write-Host ("Proxima execucao: " + $i.NextRunTime)
} catch {
  Write-Host ("ERRO: " + $_.Exception.Message) -ForegroundColor Red
}
Write-Host "`nPode fechar esta janela."
Start-Sleep -Seconds 6
