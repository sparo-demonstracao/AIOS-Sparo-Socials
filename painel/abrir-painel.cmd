@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo   Subindo o painel do AIOS...
echo.
start "AIOS Painel" /min cmd /c "node server.js"
timeout /t 2 >nul
start "" "http://127.0.0.1:4317"
echo   Pronto! O painel abriu no navegador.
echo   (Para parar: feche a janela "AIOS Painel" la na barra de tarefas,
echo    ou rode parar-painel.cmd)
timeout /t 3 >nul
