# aplicar-corrente-matinal.ps1 — BLINDA o agendamento da rotina da manhã.
#   Tarefa "AIOS - Triagem de E-mail": Daily 7:55 + AtLogOn + StartWhenAvailable (roda mesmo se o PC
#   estava desligado no horário). Essa tarefa roda o Run-Triagem.ps1 SEM flag, que faz a corrente
#   Gmail → Zoho → Resumo Matinal (o próprio wrapper chama o Resumo no fim; ver Run-Triagem.ps1).
#   Tarefa "AIOS - Resumo Matinal": recebe um gatilho de evento que, na prática, NÃO auto-dispara
#   (o log do TaskScheduler vem desligado no Windows) — de propósito, pra o Resumo NÃO abrir sozinho
#   às 11h; quem abre o pop-up é a corrente da Triagem. Pede admin sozinho (UAC).
# Uso: só precisa rodar de novo se recriar as tarefas do zero. Clique direito > "Executar com PowerShell".

$log = "C:\tmp\aios-corrente-matinal.log"
function W($m){ Write-Host $m; try { Add-Content -Path $log -Value ("{0}  {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $m) -Encoding utf8 } catch {} }

$ehAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $ehAdmin) {
  Start-Process powershell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
  exit
}

try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}
$triage = "AIOS - Triagem de E-mail"
$brief  = "AIOS - Resumo Matinal"
$ErrorActionPreference = 'Stop'
try { Remove-Item $log -ErrorAction SilentlyContinue } catch {}
try {
  # 1) Blindar a Triagem: Daily 7:55 + AtLogOn(2min) + roda assim que possível (se o PC estava desligado)
  $t1 = New-ScheduledTaskTrigger -Daily -At 7:55am
  $t2 = New-ScheduledTaskTrigger -AtLogOn
  try { $t2.Delay = 'PT2M' } catch {}
  $tt = Get-ScheduledTask -TaskName $triage
  $tt.Settings.StartWhenAvailable = $true
  Set-ScheduledTask -TaskName $triage -Trigger @($t1,$t2) -Settings $tt.Settings | Out-Null
  W "OK: '$triage' -> 7:55 + ao ligar o PC + roda assim que possivel."

  # 2) Resumo Matinal dispara ao TÉRMINO da Triagem (evento 102 do TaskScheduler p/ aquela tarefa)
  $cls = Get-CimClass -Namespace ROOT\Microsoft\Windows\TaskScheduler -ClassName MSFT_TaskEventTrigger
  $ev  = New-CimInstance -CimClass $cls -ClientOnly
  $ev.Enabled = $true
  $ev.Subscription = @"
<QueryList><Query Id='0' Path='Microsoft-Windows-TaskScheduler/Operational'><Select Path='Microsoft-Windows-TaskScheduler/Operational'>*[System[Provider[@Name='Microsoft-Windows-TaskScheduler'] and (EventID=102)]] and *[EventData[Data[@Name='TaskName']='\AIOS - Triagem de E-mail']]</Select></Query></QueryList>
"@
  $bt = Get-ScheduledTask -TaskName $brief
  $bt.Settings.StartWhenAvailable = $true
  Set-ScheduledTask -TaskName $brief -Trigger $ev -Settings $bt.Settings | Out-Null
  W "OK: '$brief' -> dispara ao TERMINAR a Triagem (pop-up ~8h)."
  W "PRONTO: corrente Gmail -> Zoho -> Resumo Matinal encadeada."
} catch {
  W ("ERRO: " + $_.Exception.Message)
}
Write-Host "`nPode fechar esta janela."
Start-Sleep -Seconds 8
