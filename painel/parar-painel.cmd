@echo off
chcp 65001 >nul
echo Parando o painel do AIOS (porta 4317)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4317 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
echo Pronto.
timeout /t 2 >nul
