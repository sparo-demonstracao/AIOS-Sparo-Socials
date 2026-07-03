# Instalar o AIOS num outro computador (laptop)

Guia pra rodar o AIOS **completo e independente** num segundo PC — não é túnel; é uma
segunda instalação que funciona sozinha. Siga na ordem. Os passos marcados **[auto]** o
script `scripts/setup-laptop/setup-laptop.ps1` faz por você; os **[manual]** só você pode.

> ⚠️ **Realidade:** a parte visual (painel) é fácil. O que dá trabalho é o **motor**:
> Whisper precisa de **GPU NVIDIA**, vários logins precisam ser refeitos na mão, e há
> **segredos** que não estão no Git (de propósito) e precisam ser copiados com cuidado.

---

## 0. Antes de começar — o que levar pra dentro do laptop

Copie para o laptop (pen drive / sync privado, **não** por e-mail/WhatsApp):

1. **Este repositório inteiro** (a pasta `AIOS - Sparo Socials`).
2. **O vault do Obsidian** — é um projeto à parte: `Documentos\Obsidian\Enzo Barbatto`.
3. **Os arquivos de segredo** (não estão no Git). Veja a lista exata em
   [`scripts/setup-laptop/SEGREDOS-PARA-LEVAR.md`](scripts/setup-laptop/SEGREDOS-PARA-LEVAR.md).

---

## 1. Pré-requisitos [auto]

Abra o **PowerShell** na pasta do repositório e rode:

```powershell
.\scripts\setup-laptop\setup-laptop.ps1
```

Ele instala (via winget) e configura o que é automatizável:
- **Node.js LTS**, **Python 3.11**, **ffmpeg**, **Git**, **rclone**
- `npm install` nas pastas que precisam (`scripts/baixar-aulas`, `site-descoberta`, `sparo-socials`)
- navegadores do **Playwright** (`playwright install chromium`)
- venv do **Whisper** com as versões **exatas** que funcionam (ver passo 5)
- baixa o **Higgsfield CLI** com o fix do Windows

No fim ele imprime um checklist do que falta fazer à mão (passos 2 a 7 abaixo).

---

## 2. Contas e logins pra refazer [manual]

Cada um desses guarda credencial **por máquina** — tem que logar de novo no laptop:

| Ferramenta | Comando / como | Conta |
|---|---|---|
| **Claude Code** | instalar do site oficial (cai em `~\.local\bin\claude.exe`) e `claude login` | sua conta Claude |
| **Higgsfield** | `hf auth login` (abre o navegador) | agenciasparo@gmail.com |
| **gws CLI** (Google Workspace) | seguir `references/gws-cli.md` (OAuth) | agenciasparo@gmail.com |
| **rclone** (Google Drive) | já vem do `rclone.conf` copiado — testar `rclone listremotes` | — |

---

## 3. MCPs (Gmail, Notion, banco, Supabase) [manual]

Os MCPs são adicionados **por instalação** do Claude Code. No laptop, dentro da pasta do repo:

- **Notion:** `claude mcp add --transport http --scope user notion https://mcp.notion.com/mcp`
  e autenticar por OAuth. (As ferramentas só aparecem em conversas abertas **depois** do login.)
- **banco / Gmail / Supabase:** reconectar pelos mesmos fluxos usados aqui (OAuth/connect).
  Veja `connections.md` pra a lista e o mecanismo de cada um.

---

## 4. Corrigir os caminhos fixos `C:\Users\canal\...` [auto-assistido]

Vários scripts têm o caminho do **seu usuário atual** embutido (inclusive o `claude.exe`).
Num laptop com outro nome de usuário isso quebra. O `setup-laptop.ps1` faz um **dry-run**
mostrando cada ocorrência de `C:\Users\canal` e, se você confirmar, troca pelo caminho do
usuário do laptop. (Também é possível criar o mesmo usuário `canal` no laptop pra evitar isso.)

Pontos sensíveis que dependem disso:
- `CLAUDE_EXE` em `scripts/instagram-post/instagram_post.py` e `scripts/yt-auto-descricao/processar.py`
- a pasta do venv do Whisper (passo 5)
- a pasta do vault do Obsidian (passo 7)

---

## 5. Whisper / transcrição — precisa de GPU NVIDIA [auto + manual]

A transcrição local (auto-descrição do YouTube, baixar-aulas) roda na **GPU**. O combo de
versões é frágil — o `setup-laptop.ps1` cria o venv com **exatamente** estas:

```
faster-whisper==1.0.3
ctranslate2==4.4.0            # 4.8 dá crash nativo — NÃO atualizar
nvidia-cublas-cu12
nvidia-cudnn-cu12==8.9.7.29   # cuDNN 8 (não 9)
requests
onnxruntime
yt-dlp
```

**Manual / atenção:**
- O laptop precisa de **GPU NVIDIA** com driver CUDA. Sem isso, ou roda lento em CPU, ou não roda.
- É preciso adicionar `…\nvidia\*\bin` ao **PATH** (senão o cuDNN não acha as DLLs na inferência).
- O **modelo `large-v3`** (~3 GB) é baixado no primeiro uso (ou copie a pasta `models/` cacheada).
- VAD fica desligado de propósito (`vad_filter=False`).

---

## 6. Agendamentos (Agendador de Tarefas) [manual — exige admin]

Abra o PowerShell **como administrador** e rode:

```powershell
.\scripts\daily-brief\aplicar-agendamento.ps1     # Resumo Matinal (11:00)
```

E recrie a tarefa **`AIOS - YT Auto Descricao`** (a cada 3 min) — ver `scripts/yt-auto-descricao/README.md`.

---

## 7. Obsidian (segundo cérebro) [manual]

O vault é **outro projeto Claude Code**. Depois de copiar a pasta `Obsidian\Enzo Barbatto`:
- abra-a uma vez no Claude Code pra confirmar o `CLAUDE.md` dela,
- ajuste o caminho do vault na skill `obsidian` se o usuário mudou (passo 4).

---

## 8. Teste final ✅

```powershell
# sobe o painel pelo app (servidor morre ao fechar a janela)
.\painel\AIOS Painel.vbs
```

Abra `http://127.0.0.1:4317` e teste **uma** automação leve (ex.: Skool leitura) antes de
confiar nas pesadas (Whisper/YouTube). Se a leve funcionar, o miolo está de pé.

---

### O que **não** migra sozinho (resumo honesto)
- GPU/CUDA: depende do hardware do laptop.
- Logins (Claude, Higgsfield, gws, MCPs): refeitos à mão.
- Segredos do `.env`/`rclone.conf`/cookies: copiados à mão.
- WAHA (WhatsApp): se for um serviço/endpoint externo, é o mesmo endpoint; se rodava local
  aqui, precisa subir no laptop também (ver `references/waha-api.md`).
- Cookies que **expiram** (Skool ~3,5 dias): vão precisar ser renovados no laptop.
