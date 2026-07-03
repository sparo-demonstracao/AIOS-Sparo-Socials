# Run-Triagem.ps1 — AIOS: roda a triagem de e-mail em lote (categoriza + aplica label + rascunha, L2).
# Agendada pra 7:55 todo dia (ou quando o PC voltar, via -StartWhenAvailable na tarefa). É idempotente:
# o triar.mjs só pega threads SEM categoria (has:nouserlabels), então re-rodar no mesmo dia não duplica.
# Nada é enviado — L2 (só aplica label e cria rascunho pro Enzo revisar).
#
# CORRENTE DA MANHÃ: Gmail -> Zoho -> Resumo Matinal, um após o outro. O Resumo só é disparado quando
# ESTE wrapper roda pela TAREFA agendada (sem flag). O botão "Rodar triagem" do painel passa -SemResumo
# pra fazer SÓ as triagens (não abrir o pop-up do Resumo). E o Resumo só dispara se a tarefa dele estiver
# LIGADA no painel (respeita o liga/desliga).

param([switch]$SemResumo)

$ErrorActionPreference = 'Continue'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$Proj    = "C:\Users\canal\Documentos\Antigravity Projetos\AIOS - Sparo Socials"
$Node    = "C:\Program Files\nodejs\node.exe"
$Script  = Join-Path $Proj "scripts\triagem-email\triar.mjs"
$LogFile = "C:\tmp\aios-triagem-cron.log"
$LastOut = "C:\tmp\aios-triagem-cron-last.txt"

function Log($m){ try { Add-Content -Path $LogFile -Value ("{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $m) -Encoding utf8 } catch {} }

# Garante que `node`, `bash` (Git) e `gws` (npm) sejam encontrados mesmo com o PATH enxuto do agendador.
# O triar.mjs chama `bash -lc 'gws ...'` internamente — bash precisa estar no PATH do processo node.
$env:PATH = "C:\Program Files\Git\bin;C:\Users\canal\AppData\Roaming\npm;C:\Program Files\nodejs;" + $env:PATH

Log "===== Início da Triagem (cron 7:55) ====="
Set-Location $Proj
try {
  # --days 7: janela de segurança se o PC ficou dias desligado; has:nouserlabels mantém o custo baixo.
  & $Node $Script --days 7 *> $LastOut
  Log "Triagem terminou (exit=$LASTEXITCODE). Detalhe: C:\tmp\aios-triagem-email.log · JSON: C:\tmp\aios-triagem-email.json"
} catch {
  Log "Triagem ERRO: $($_.Exception.Message)"
}

# ENCADEADO (1/2): assim que a triagem do Gmail termina, roda a triagem da caixa de ATENDIMENTO (Zoho)
# em sequência. O wrapper do Zoho loga no próprio arquivo. (Isto SEMPRE roda — o botão do painel também
# cobre as duas caixas.)
Log "Encadeando -> Triagem Atendimento (Zoho)..."
try {
  & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $Proj "scripts\triagem-email\Run-Triagem-Zoho.ps1")
  Log "Triagem Atendimento (Zoho) terminou (exit=$LASTEXITCODE). Detalhe: C:\tmp\aios-triagem-zoho.log"
} catch {
  Log "Encadeamento Zoho ERRO: $($_.Exception.Message)"
}

# ENCADEADO (2/2): RESUMO MATINAL por último — SÓ na corrente agendada (sem -SemResumo) e SÓ se a tarefa
# do Resumo estiver LIGADA no painel. O botão "Rodar triagem" passa -SemResumo e pula esta etapa.
if (-not $SemResumo) {
  try {
    $briefTask = Get-ScheduledTask -TaskName "AIOS - Resumo Matinal" -ErrorAction SilentlyContinue
    if ($briefTask -and $briefTask.State -ne 'Disabled') {
      Log "Encadeando -> Resumo Matinal (pop-up)..."
      & powershell.exe -NoProfile -Sta -ExecutionPolicy Bypass -WindowStyle Hidden -File (Join-Path $Proj "scripts\daily-brief\Run-DailyBrief.ps1")
      Log "Resumo Matinal terminou (exit=$LASTEXITCODE)."
    } else {
      Log "Resumo Matinal DESLIGADO no painel (ou tarefa ausente) — pulado."
    }
  } catch { Log "Encadeamento Resumo Matinal ERRO: $($_.Exception.Message)" }
} else {
  Log "Chamado com -SemResumo (botão do painel) — Resumo Matinal NÃO disparado."
}
Log "===== Fim ====="
