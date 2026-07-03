# status.ps1 — devolve, em JSON, o estado real de tarefas do Agendador do Windows.
# Uso: powershell -NoProfile -ExecutionPolicy Bypass -File status.ps1 "AIOS - Resumo Matinal" "AIOS - YT Auto Descricao"
# O painel chama isto pra saber: ligada/desligada, última execução, resultado e próxima execução.

param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Names)

try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}
$ErrorActionPreference = 'SilentlyContinue'

$out = @()
foreach ($n in $Names) {
  if ([string]::IsNullOrWhiteSpace($n)) { continue }
  try {
    $t = Get-ScheduledTask -TaskName $n -ErrorAction Stop
    $i = $t | Get-ScheduledTaskInfo
    $out += [pscustomobject]@{
      taskName   = $n
      found      = $true
      state      = "$($t.State)"   # Ready | Running | Disabled
      lastRun    = if ($i.LastRunTime)  { (Get-Date $i.LastRunTime  -Format 'o') } else { $null }
      lastResult = $i.LastTaskResult
      nextRun    = if ($i.NextRunTime)  { (Get-Date $i.NextRunTime  -Format 'o') } else { $null }
    }
  } catch {
    $out += [pscustomobject]@{ taskName = $n; found = $false }
  }
}

# @() + ',' garante que sempre sai um ARRAY, mesmo com 1 item só.
ConvertTo-Json @($out) -Depth 5
