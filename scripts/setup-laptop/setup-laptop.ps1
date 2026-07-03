# setup-laptop.ps1 — instala/configura o que dá pra automatizar do AIOS num novo PC.
# Rode na pasta do repositório:  .\scripts\setup-laptop\setup-laptop.ps1
# Idempotente: pode rodar de novo sem problema. Passos manuais ficam no checklist do fim.

$ErrorActionPreference = "Continue"
$repo = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
Write-Host "`n=== Setup do AIOS no laptop ===" -ForegroundColor Cyan
Write-Host "Repositório: $repo`n"

function Have($cmd) { return [bool](Get-Command $cmd -ErrorAction SilentlyContinue) }
function Winget($id, $exe) {
  if ($exe -and (Have $exe)) { Write-Host "  ok  $id (já instalado)" -ForegroundColor Green; return }
  if (-not (Have "winget")) { Write-Host "  !!  winget não existe — instale '$id' manualmente" -ForegroundColor Yellow; return }
  Write-Host "  ..  instalando $id" -ForegroundColor Gray
  winget install --id $id -e --source winget --accept-package-agreements --accept-source-agreements | Out-Null
}

# ---------- 1) Pré-requisitos via winget ----------
Write-Host "[1/6] Pré-requisitos (Node, Python 3.11, ffmpeg, Git, rclone)" -ForegroundColor Cyan
Winget "OpenJS.NodeJS.LTS" "node"
Winget "Python.Python.3.11" "py"
Winget "Gyan.FFmpeg"        "ffmpeg"
Winget "Git.Git"           "git"
Winget "Rclone.Rclone"     "rclone"
Write-Host "  (se algo acabou de instalar, FECHE e reabra o PowerShell pra atualizar o PATH)`n" -ForegroundColor Yellow

# ---------- 2) npm install nas pastas com package.json ----------
Write-Host "[2/6] Dependências Node (npm install)" -ForegroundColor Cyan
$npmDirs = @("scripts\baixar-aulas", "scripts\site-descoberta", "scripts\sparo-socials")
foreach ($d in $npmDirs) {
  $full = Join-Path $repo $d
  if (Test-Path (Join-Path $full "package.json")) {
    Write-Host "  ..  npm install em $d" -ForegroundColor Gray
    Push-Location $full; try { npm install --no-fund --no-audit | Out-Null } catch { Write-Host "  !!  falhou em $d" -ForegroundColor Yellow }; Pop-Location
  }
}
Write-Host ""

# ---------- 3) Playwright (Chromium) ----------
Write-Host "[3/6] Navegadores do Playwright" -ForegroundColor Cyan
$pw = Join-Path $repo "scripts\baixar-aulas"
if (Test-Path $pw) {
  Push-Location $pw; try { npx --yes playwright install chromium | Out-Null; Write-Host "  ok  chromium instalado" -ForegroundColor Green } catch { Write-Host "  !!  rode manualmente: npx playwright install chromium" -ForegroundColor Yellow }; Pop-Location
}
Write-Host ""

# ---------- 4) venv do Whisper (versões travadas) ----------
Write-Host "[4/6] Ambiente do Whisper (transcrição)" -ForegroundColor Cyan
$venv = Join-Path $repo "scripts\.venv-whisper"
if (Have "py") {
  if (-not (Test-Path $venv)) { py -3.11 -m venv $venv }
  $vpy = Join-Path $venv "Scripts\python.exe"
  if (Test-Path $vpy) {
    & $vpy -m pip install --upgrade pip | Out-Null
    & $vpy -m pip install "faster-whisper==1.0.3" "ctranslate2==4.4.0" nvidia-cublas-cu12 "nvidia-cudnn-cu12==8.9.7.29" requests onnxruntime yt-dlp | Out-Null
    Write-Host "  ok  venv em scripts\.venv-whisper (faster-whisper 1.0.3 / ctranslate2 4.4.0)" -ForegroundColor Green
    Write-Host "  !!  GPU: precisa de placa NVIDIA + driver CUDA, e adicionar ...\nvidia\*\bin ao PATH" -ForegroundColor Yellow
  }
} else { Write-Host "  !!  Python não encontrado — reabra o PowerShell e rode de novo" -ForegroundColor Yellow }
Write-Host ""

# ---------- 5) Higgsfield CLI (fix do Windows) ----------
Write-Host "[5/6] Higgsfield CLI (hf)" -ForegroundColor Cyan
if (Have "hf") { Write-Host "  ok  hf já instalado" -ForegroundColor Green }
else {
  try {
    $tmp = Join-Path $env:TEMP "hf.tar.gz"
    $url = "https://github.com/higgsfield-ai/cli/releases/download/v0.2.3/hf_0.2.3_windows_amd64.tar.gz"
    Invoke-WebRequest -Uri $url -OutFile $tmp
    $dest = Join-Path $env:APPDATA "npm"
    if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Force -Path $dest | Out-Null }
    tar -xzf $tmp -C $dest hf.exe
    if (Test-Path (Join-Path $dest "hf.exe")) { Write-Host "  ok  hf.exe instalado em $dest" -ForegroundColor Green } else { Write-Host "  !!  extração falhou — baixe manualmente (ver memória higgsfield-cli)" -ForegroundColor Yellow }
  } catch { Write-Host "  !!  download do hf falhou: $($_.Exception.Message)" -ForegroundColor Yellow }
}
Write-Host ""

# ---------- 6) Caminhos fixos C:\Users\canal -> usuário deste PC ----------
Write-Host "[6/6] Caminhos fixos (C:\Users\canal)" -ForegroundColor Cyan
$me = $env:USERNAME
if ($me -eq "canal") { Write-Host "  ok  usuário deste PC já é 'canal' — nada a trocar" -ForegroundColor Green }
else {
  $hits = Select-String -Path (Join-Path $repo "scripts\**\*.py"), (Join-Path $repo "scripts\**\*.ps1"), (Join-Path $repo "scripts\**\*.mjs"), (Join-Path $repo "scripts\**\*.cjs") -Pattern "C:\\Users\\canal" -List -ErrorAction SilentlyContinue
  if (-not $hits) { Write-Host "  ok  nenhuma ocorrência encontrada" -ForegroundColor Green }
  else {
    Write-Host "  Encontrei 'C:\Users\canal' nestes arquivos:" -ForegroundColor Yellow
    $hits | ForEach-Object { Write-Host "    - $($_.Path)" }
    $ans = Read-Host "  Trocar 'C:\Users\canal' por 'C:\Users\$me' nesses arquivos? (s/N)"
    if ($ans -eq "s") {
      foreach ($h in $hits) {
        (Get-Content $h.Path -Raw) -replace [regex]::Escape("C:\Users\canal"), "C:\Users\$me" | Set-Content $h.Path -Encoding utf8
      }
      Write-Host "  ok  caminhos atualizados" -ForegroundColor Green
    } else { Write-Host "  -- pulado (faça à mão depois)" -ForegroundColor Gray }
  }
}

# ---------- Checklist final (manual) ----------
Write-Host "`n=== Falta fazer À MÃO (ver INSTALAR-NO-LAPTOP.md) ===" -ForegroundColor Cyan
Write-Host @"
  [ ] Copiar os SEGREDOS (scripts\setup-laptop\SEGREDOS-PARA-LEVAR.md): .env, rclone.conf, profile\
  [ ] Instalar Claude Code (site oficial) e 'claude login'
  [ ] hf auth login   (Higgsfield)
  [ ] gws CLI: OAuth   (references\gws-cli.md)
  [ ] MCPs: Notion (claude mcp add ...), banco/Gmail/Supabase reconectar (connections.md)
  [ ] Modelo Whisper large-v3 (1º uso baixa ~3GB) + PATH do nvidia\*\bin
  [ ] Agendador (admin): scripts\daily-brief\aplicar-agendamento.ps1  +  tarefa 'AIOS - YT Auto Descricao'
  [ ] Copiar o vault do Obsidian (Documentos\Obsidian\Enzo Barbatto)
  [ ] Teste: .\painel\AIOS Painel.vbs  ->  http://127.0.0.1:4317
"@ -ForegroundColor Gray
Write-Host "Pronto. Os passos [auto] já rodaram.`n" -ForegroundColor Green
