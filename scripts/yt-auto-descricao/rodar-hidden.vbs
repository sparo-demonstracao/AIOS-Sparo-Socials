' rodar-hidden.vbs — roda o rodar.cmd SEM piscar janela de console.
' Chamado pela tarefa agendada "AIOS - YT Auto Descricao" (a cada 3 min).
' O "0" esconde a janela; o "True" espera terminar. O processar.py roda igual, só sem console.
Dim sh, here
Set sh = CreateObject("WScript.Shell")
here = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))
sh.Run """" & here & "rodar.cmd""", 0, True
