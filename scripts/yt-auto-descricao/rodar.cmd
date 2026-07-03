@echo off
REM Wrapper chamado pelo Agendador de Tarefas do Windows.
REM chcp 65001 = console em UTF-8 (emoji/acento no log nao quebram).
chcp 65001 >nul
"C:\Users\canal\Downloads\transcricao-masterclass\venv\Scripts\python.exe" "%~dp0processar.py" >> "%~dp0agendador.log" 2>&1
