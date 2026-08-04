---
name: daily-brief
description: O "Resumo Matinal" do Enzo — junta tudo dos últimos 7 dias que ele ainda NÃO respondeu (WhatsApp, Gmail, Zoho Mail e comentários do YouTube) e mostra num pop-up, com "Hoje" no topo e um bloco "Pendentes da semana" (2+ dias) pra nada escapar quando ele fica 2-3 dias sem responder. O app abre instantâneo se já há resumo de hoje; na 1ª vez do dia, coleta mostrando os logs reais ao vivo numa tela de carregamento e guarda o resumo pro resto do dia. Roda sozinho via Task Scheduler às 11:00. Use quando o Enzo pedir pra ver/rodar o resumo do dia na hora, mudar o horário, ajustar o que entra no resumo, ou consertar se o pop-up não apareceu.
---

# Resumo Matinal (daily-brief)

Ritual de cadência: todo dia às **11:00** um pop-up sobe na tela do Enzo com **tudo dos últimos 7 dias
que ele ainda NÃO respondeu** em três frentes — WhatsApp, e-mail (**duas caixas**: Gmail + Zoho Mail) e
comentários do YouTube. A janela é de **7 dias** (não mais 24h) porque o Enzo às vezes passa 2-3 dias sem
responder e o item sumia. Cada fonte tem um filtro de **"não respondido"**:
- **WhatsApp** — última mensagem é do contato (se o Enzo respondeu por último, não aparece).
- **Gmail** — threads da Inbox (7d) cuja ÚLTIMA mensagem não foi o Enzo (via `threads.get`, mesma regra do WhatsApp).
- **Zoho** — e-mails da Inbox (7d) sem uma resposta do Enzo pra aquela pessoa depois (compara com a pasta Enviados).
- **YouTube** — comentários (7d) sem uma resposta do canal (`part=snippet,replies`).

Na montagem, o que é de **HOJE** fica no topo (por fonte) e o que tem **2+ dias** vai pro bloco
**"Pendentes da semana"**, AGRUPADO POR ORIGEM (subcabeçalho por fonte: WhatsApp / E-mail Gmail /
E-mail Zoho / YouTube; o grupo com o item mais atrasado vem primeiro e, dentro do grupo, o mais antigo
no topo; cada item leva o "há N dias"). Quem decide o que é
"importante" e escreve os rascunhos é o `claude -p` (headless, usa a assinatura, sem custo de API), seguindo
a voz do Enzo (PT-BR, "você", direto; rebaixa divulgação/newsletter pro "ver mais").

## Arquitetura

```
Task Scheduler (11:00, diário, interativo)
   └─ powershell -File scripts/daily-brief/Run-DailyBrief.ps1
        1. lê .env
        2. coleta (REST puro, sem MCP — funciona sem sessão aberta), janela de 7 DIAS + filtro "não respondido":
           • WhatsApp → WAHA  (Invoke-RestMethod, X-Api-Key do .env); só conversas cuja última msg é do contato
           • Gmail    → gws.cmd  (q:newer_than:7d, labelIds:[INBOX]) — query SEM espaços (PS 5.1);
                        junta por thread e threads.get pega a última msg: se o "From" for o Enzo, pula (já respondeu)
           • Zoho     → REST (refresh_token do .env → access token → mail.zoho.com /messages/view)
                        header "Zoho-oauthtoken"; lê Inbox E Enviados (7d) e pula quem o Enzo já respondeu;
                        INERTE se .env não tiver ZOHO_CLIENT_ID+ZOHO_REFRESH_TOKEN
           • YouTube  → Data API commentThreads (part=snippet,replies): pula comentário com resposta do canal
        3. monta o prompt e chama claude -p via Git Bash → resumo em texto
        4. pop-up WPF estilizado (popup.ps1) com logo próprio, TopMost + som
```

Há também um **app de desktop**: `Resumo Matinal.exe` (logo do sol, sem console), que agora roda o
**`Abrir-Matinal.ps1`** (cache inteligente). Atalhos no Desktop e no Menu Iniciar.

```
Resumo Matinal.exe → Abrir-Matinal.ps1
   • Já existe resumo DE HOJE? (campo "data" == hoje no aios-brief.json)
        → abre o pop-up (popup.ps1) NA HORA, sem esperar.
   • PRIMEIRA vez no dia?
        → tela de carregamento (loading-brief.ps1) mostrando os LOGS REAIS da coleta ao vivo,
          roda Run-DailyBrief.ps1 -NoPopup OCULTO em segundo plano, e quando termina mostra o
          resumo — que fica guardado pro resto do dia (próximas aberturas são instantâneas).
```

**Como os logs reais aparecem na tela:** o `Run-DailyBrief.ps1` escreve cada passo (via função
`Step()`) numa linha limpa em `C:\tmp\aios-brief-progress.log` ("📱 Lendo WhatsApp...",
"📧 Gmail: 8 e-mails...", "🧠 Pedindo pro AIOS priorizar...", "✨ Resumo pronto!"). O
`loading-brief.ps1` faz *tail* desse arquivo (DispatcherTimer ~350ms, leitura por offset com
`FileShare.ReadWrite` pra não travar a escrita) e vai acrescentando as linhas na tela. Fecha sozinho
quando o processo do `Run-DailyBrief` sai. A tarefa das 11h continua sendo o **pré-cache do dia**:
se ela já rodou, abrir o app é instantâneo.

Por que cada peça é assim (decisões já tomadas, não regredir):
- **Coleta em REST/script, não MCP.** MCPs autenticados via claude.ai (ex.: Gmail MCP) podem sumir
  num run headless/agendado. Script com credencial no `.env`/keyring é confiável sem supervisão.
- **WhatsApp: só o que ESPERA você, lido dos DOIS lados, já com rascunho.** Mostra só conversas cuja
  última mensagem é do contato (se você respondeu por último, não aparece). Pra cada uma, monta um
  trecho rotulado (`Você:` = Enzo / `<nome>:` = contato) — sem isso a IA inverte quem falou (achava que
  o contato pedia o currículo quando era o Enzo) — e escreve um `rascunho` na sua voz; o item vira o
  link `wa.me/<numero>?text=<rascunho>`: clicar abre a conversa com a mensagem JÁ digitada, é só dar Enter.
  ⚠️ Histórico do WAHA (WEBJS) é instável — ver `references/waha-api.md`: precisa `downloadMedia=false`,
  `fromMe` vem no TOPO da mensagem (não em `_data`), e cai na última mensagem quando o `/messages` falha.
- **E-mail separa "importantes" de "secundários"; YouTube copia a resposta.** O e-mail mostra os que
  pedem ação no topo e esconde divulgação/newsletter atrás de um "ver mais" (1 linha cada). No YouTube,
  cada comentário ganha uma sugestão de resposta; clicar **copia a resposta** pro clipboard e abre o
  comentário (link `&lc=`) pra você colar (Ctrl+V) — o YouTube não deixa pré-preencher o campo como o WhatsApp.
- **Gmail via `gws` chamado do PowerShell** com JSON **sem espaços** (`q:newer_than:7d` + `labelIds:[INBOX]`).
  O PowerShell 5.1 quebra `--params` que tenham espaço — por isso NÃO se usa `in:inbox` (tem espaço); usa-se
  `labelIds`. O "não respondido" vem de `threads.get` (última msg não é do Enzo), não de uma query do Gmail.
- **`claude -p` via Git Bash** (`C:\Program Files\Git\bin\bash.exe`) — o `claude` é shim unix em
  `~/.local/bin`. O `bash.exe` do PATH do Windows é o do WSL e **não** serve.
- **Pop-up exige agendador local + sessão logada.** Rotina na nuvem não desenha janela na máquina.
  A task roda com LogonType **Interactive** ("só quando logado").

## Arquivos e caminhos

| O quê | Onde |
|---|---|
| Cérebro do app (cache do dia) | `scripts/daily-brief/Abrir-Matinal.ps1` — é o que o `.exe` roda |
| Script coletor (fresco) | `scripts/daily-brief/Run-DailyBrief.ps1` (aceita `-NoPopup`) |
| Tela de carregamento (logs ao vivo) | `scripts/daily-brief/loading-brief.ps1` (`Show-LoadingBrief`) |
| Renderizador do pop-up (WPF) | `scripts/daily-brief/popup.ps1` (`Show-BriefPopup`) |
| Reabrir o último resumo (sem checar data) | `scripts/daily-brief/Show-Brief.ps1` (utilitário; o `.exe` não usa mais) |
| App de desktop (.exe) | `scripts/daily-brief/Resumo Matinal.exe` (compilado do **Abrir-Matinal.ps1** via PS2EXE) |
| Logo / ícone | `scripts/daily-brief/assets/aios-sol.ico` (app) + `aios-sol-glyph.png` (cabeçalho) |
| Atalhos | Desktop + Menu Iniciar → "Resumo Matinal" |
| Cache do dia (resumo) | `C:\tmp\aios-brief.json` (campo `data` = `dd/MM/yyyy` decide instantâneo vs. coletar) |
| Progresso ao vivo (logs da coleta) | `C:\tmp\aios-brief-progress.log` (zerado a cada coleta; lido pela tela de carregamento) |
| Log | `C:\tmp\aios-daily-brief.log` |
| Segredos | `.env` (WAHA_*, YOUTUBE_*, ZOHO_*) + `gws` (Gmail, keyring) |
| Tarefa agendada | Nome **"AIOS - Resumo Matinal"** no Task Scheduler (sem limite de tempo, `-Sta`) |

**Recompilar o .exe** (só se mudar o `Abrir-Matinal.ps1`; mudanças no `popup.ps1`/`loading-brief.ps1`/
`Run-DailyBrief.ps1` já valem na hora, pois o `.exe` os carrega em runtime). Feche o app antes
(o .exe trava o arquivo se estiver aberto: `Get-Process "Resumo Matinal" | Stop-Process -Force`):
```powershell
Import-Module ps2exe
Invoke-PS2EXE -InputFile "scripts\daily-brief\Abrir-Matinal.ps1" -OutputFile "scripts\daily-brief\Resumo Matinal.exe" -iconFile "scripts\daily-brief\assets\aios-sol.ico" -noConsole -STA -title "Resumo Matinal"
```

## Operações comuns

**Rodar agora (testar / ver o resumo na hora):** — precisa de `-Sta` (ver gotcha)
```powershell
powershell -NoProfile -Sta -ExecutionPolicy Bypass -File "scripts\daily-brief\Run-DailyBrief.ps1"
```

**Só reabrir o último resumo (sem re-coletar):**
```powershell
powershell -NoProfile -Sta -ExecutionPolicy Bypass -File "scripts\daily-brief\Show-Brief.ps1"
```

**Mudar o horário** (ex.: 08:30):
```powershell
Set-ScheduledTask -TaskName "AIOS - Resumo Matinal" -Trigger (New-ScheduledTaskTrigger -Daily -At 8:30am)
```

**Ver se está agendado / quando rodou:**
```powershell
Get-ScheduledTask -TaskName "AIOS - Resumo Matinal" | Get-ScheduledTaskInfo
```

**Desligar / religar:**
```powershell
Disable-ScheduledTask -TaskName "AIOS - Resumo Matinal"
Enable-ScheduledTask  -TaskName "AIOS - Resumo Matinal"
```

**Mudar o que entra no resumo:** editar o bloco `$prompt` no `.ps1` (regras de priorização) ou os
caps de coleta (`maxResults`, limite de chats/mensagens). Pra somar uma 4ª fonte, replicar o padrão
de uma seção de coleta e acrescentar mais um bloco `[FONTE]` no prompt.

## Pegadinhas

- Se o pop-up não aparecer: a máquina precisa estar **ligada e logada** às 11h. Com
  `-StartWhenAvailable`, se estava desligada, roda quando voltar. Conferir `C:\tmp\aios-daily-brief.log`.
- Cada fonte é isolada em try/catch: se uma falhar (ex.: WAHA fora do ar), o resumo sai com as
  outras duas e registra o erro no log.
- Token do YouTube: `redirect_uri`/escopos em `references/youtube-studio-api.md`. WAHA em
  `references/waha-api.md`. Gmail (`gws`) em `references/gws-cli.md`. **Zoho** (Self Client, escopos,
  como gerar o refresh token e as chaves `ZOHO_*` do `.env`) em `references/zoho-mail-api.md`.
- **Zoho é opcional e à prova de falha.** Sem `ZOHO_CLIENT_ID`/`ZOHO_REFRESH_TOKEN` no `.env`, a
  coleta do Zoho é pulada e o resumo sai normal com as outras fontes. Refresh token do Zoho não expira
  sozinho (só se revogado). Se o Zoho sumir do resumo, testar o token (ver `references/zoho-mail-api.md`).
- **BOM obrigatório nos `.ps1`.** O PowerShell 5.1 lê script sem BOM como ANSI e embaralha
  emojis/acentos (quebra o parser). Depois de editar qualquer `.ps1` daqui, re-salvar com **UTF-8 BOM**:
  `$c=Get-Content -Raw -Encoding UTF8 $p; [IO.File]::WriteAllText($p,$c,(New-Object Text.UTF8Encoding($true)))`.
- **STA obrigatório.** WinForms/WPF (`ShowDialog`) morre na hora se o PowerShell não for STA. Rodar
  sempre com `-Sta` (manual) — a tarefa agendada e o `.exe` (compilado com `-STA`) já garantem isso.
- **Encoding UTF-8 na captura.** `Run-DailyBrief.ps1` força `[Console]::OutputEncoding = UTF8` antes de
  capturar stdout de `claude`/`gws`; sem isso o texto vira mojibake no PS 5.1.
- O app (.exe) abre **instantâneo** se já há resumo de hoje; na 1ª vez do dia ele **coleta** com a
  tela de logs ao vivo. Pra forçar uma re-coleta no mesmo dia, apague o cache:
  `Remove-Item C:\tmp\aios-brief.json` e abra o app de novo (ou rode `Run-DailyBrief.ps1 -Sta`).
- **Janela WPF só renderiza lançada por processo "direto".** Janela aberta por processo "neto"
  (ex.: `Start-Process` dentro de `Start-Process`) pode não desenhar. Por isso o `.exe` mostra o
  pop-up/loading **no próprio processo** (in-process), e o `Run-DailyBrief -NoPopup` (que NÃO desenha
  nada) é que roda em segundo plano. Ao testar via `powershell -File ...`, lance como filho direto.
- **Timer de WPF não enxerga uma variável que referencie a si mesma.** No `loading-brief.ps1`, o
  fechamento adiado é feito pelo próprio DispatcherTimer (contador `closeAt`), não por um timer
  aninhado — um `$closeT` criado dentro do `Add_Tick` fica `$null` quando o tick aninhado dispara.
