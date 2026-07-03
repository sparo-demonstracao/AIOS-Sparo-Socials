# Auto-descrição de vídeos do YouTube

Toda vez que você posta um vídeo novo no canal, isto gera **resumo + capítulos + hashtags**
a partir da fala do próprio vídeo e publica a descrição no YouTube Studio — sozinho, em < 10 min.

## Como funciona

1. Um ciclo (agendado a cada 1 min, na sua máquina) dá uma espiada rápida nos uploads recentes do
   canal — uma chamada de API (< 1s, sem GPU). Sem vídeo novo, sai na hora sem carregar nada.
2. Achou vídeo novo (postado depois da instalação, ainda não processado) **e já no ar há ≥ 1 min**
   (`MIN_AGE_SECONDS`, dá tempo do YouTube finalizar o upload):
   - **baixa o áudio** com `yt-dlp`;
   - **transcreve local** na GPU com `faster-whisper` (large-v3) — receita em
     `C:\Users\canal\Downloads\transcricao-masterclass`;
   - **gera** resumo/capítulos/hashtags com `claude -p` (modelo Sonnet), só as partes variáveis;
   - **monta** no template fixo (links, cupom, CTA nunca mudam — ver
     `references/youtube-descricao-template.md`);
   - **publica** via `videos.update` (OAuth `youtube.force-ssl` no `.env`).
3. Marca como processado. Se o áudio ainda não estiver baixável (vídeo recém-postado),
   **não marca** — o próximo ciclo tenta de novo. É esse o "tentar" do qual o problema some:
   o Whisper não depende da legenda automática do YouTube ficar pronta.

## Comandos

```powershell
$py = "C:\Users\canal\Downloads\transcricao-masterclass\venv\Scripts\python.exe"
$s  = "$PSScriptRoot\processar.py"   # ou o caminho absoluto do processar.py

& $py $s                       # ciclo normal (o que o agendador roda)
& $py $s --dry-run             # processa novos SEM publicar (salva preview-<id>.txt)
& $py $s --video=ID --dry-run  # testa um vídeo específico, sem publicar
& $py $s --video=ID            # força reprocessar/publicar um vídeo específico
```

## Ligar / desligar o automático

- **Ligar:** tarefa do Windows `AIOS - YT Auto Descricao` (Agendador de Tarefas), gatilho a cada
  1 min, "executar só quando o usuário estiver conectado" (precisa da GPU + auth do claude).
  **A ação da tarefa é `wscript.exe "…\rodar-hidden.vbs"`** — roda o `rodar.cmd` OCULTO, sem piscar
  janela de console a cada 3 min (2026-06-24). Se re-registrar a tarefa, mantenha esse wrapper,
  senão o console volta a aparecer toda hora.
- **Desligar:** desabilite a tarefa no Agendador de Tarefas, ou rode
  `schtasks /Change /TN "AIOS - YT Auto Descricao" /DISABLE`.

## Arquivos

- `rodar.cmd` — wrapper que ajusta o console pra UTF-8 e roda o `processar.py` (saída → `agendador.log`).
- `rodar-hidden.vbs` — roda o `rodar.cmd` SEM janela de console; **é o que a tarefa agendada chama**.
- `processar.py` — o pipeline.
- `estado.json` — marca de instalação + vídeos já processados (não apagar).
- `log.txt` — histórico de cada ciclo.
- `transcricoes/<id>.md` — transcrição com timestamps de cada vídeo (reaproveitável).
- `preview-<id>.txt` — descrição gerada em dry-run (não publicada).
- `tmp/` — áudio temporário (apagado após transcrever).

## Ajustes rápidos (topo do `processar.py`)

- `MODELO_CLAUDE` — modelo usado na geração.
- `MAX_AGE_HOURS` — ignora vídeos mais velhos que isso (default 48h).
- `HEADER` / `FOOTER` / `PROMPT` — o template fixo e o estilo do texto.
