' AIOS Painel.vbs — clique aqui pra abrir o app do Painel do AIOS.
' Roda o lancador (app.js) em segundo plano, sem janela de console.
' O servidor sobe junto e morre quando voce fecha a janela do app.
Set fso = CreateObject("Scripting.FileSystemObject")
pasta = fso.GetParentFolderName(WScript.ScriptFullName)
Set sh = CreateObject("WScript.Shell")
sh.CurrentDirectory = pasta
' 0 = oculto. node fica vigiando a janela e mata o servidor ao fechar.
sh.Run "node """ & pasta & "\app.js""", 0, False
