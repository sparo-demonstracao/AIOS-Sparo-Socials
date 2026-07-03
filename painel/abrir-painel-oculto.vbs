' abrir-painel-oculto.vbs — sobe o painel SEM mostrar janela de console e abre o navegador.
' Use este se nao quiser a janelinha do servidor na barra de tarefas.
' Para parar depois: rode parar-painel.cmd.

Set fso = CreateObject("Scripting.FileSystemObject")
pasta = fso.GetParentFolderName(WScript.ScriptFullName)
Set sh = CreateObject("WScript.Shell")
sh.CurrentDirectory = pasta
' 0 = janela oculta; servidor roda em segundo plano
sh.Run "cmd /c node """ & pasta & "\server.js""", 0, False
WScript.Sleep 1500
sh.Run "http://127.0.0.1:4317", 1, False
