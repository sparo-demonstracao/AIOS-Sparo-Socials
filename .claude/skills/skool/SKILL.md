---
name: skool
description: Use quando o Enzo pedir pra VER / RESPONDER / RASCUNHAR respostas das comunidades dele no Skool (Automatize-se grátis E Automatize-se+ de alunos), ou puxar o que está pendente lá — posts, comentários E DMs (chat) de membros esperando retorno. Lê as duas comunidades (só leitura) e rascunha as respostas NA VOZ do Enzo pra ele revisar e postar (L2 — nada é publicado automaticamente). Dispare mesmo sem "skill", ex.: "o que tem pra responder no Skool?", "rascunha as respostas da comunidade", "responder Skool", "tem DM nova no Skool?", "tem dúvida nova no Skool?".
---

# Responder Skool (read + draft, L2)

Lê a atividade recente das **DUAS comunidades do Enzo no Skool** — **Automatize-se** (grátis,
`comunidade-de-automacao-com-ia-8164`) e **Automatize-se + Alunos** (paga,
`automatize-se-alunos-2228`) — **posts, comentários e DMs (chat) não lidas** — e **rascunha** uma
resposta na voz dele pra cada item de membro que pede retorno. Cada card mostra uma **etiqueta de
origem** (Grátis = verde, Alunos+ = dourada, Chat/DM = lilás); itens de aluno pagante têm prioridade.
**L2 — Drafted:** a IA rascunha, o Enzo revisa e **posta na mão**. Nada é publicado por aqui.
(DMs aparecem marcadas com 💬 no pop-up.)

Por que L2 (decisão travada, ver `decisions/log.md` 2026-06-24): o Skool não tem API oficial; a
comunidade é **ativo pago**; e responder membros **é a voz do Enzo indo pra fora** — que, pela regra
dele, nunca sai sem ele ver antes. Bot que posta sozinho fica fora por enquanto (risco de ToS/ban +
fere a Regra do Estagiário).

## Dois jeitos de rodar

1. **No Claude Code (`/skool`, interativo):** puxa a atividade, mostra os rascunhos **aqui no chat**,
   e o Enzo pode pedir ajuste ("muda o tom desse", "encurta") antes de copiar e postar. Melhor pra
   sentar e responder em lote conversando.
2. **Botão "Responder Skool" no app matinal:** o pop-up do daily-brief (11h) e o `.exe` "Resumo
   Matinal" têm um botão amarelo que dispara `Run-Skool.ps1` → abre um pop-up com os rascunhos e um
   botão **"Copiar resposta"** por item. Pra um glance rápido fora do Claude Code.

Os dois usam a mesma config (`.env`), a mesma voz (`references/voice.md`) e o mesmo ator do Apify.

## Arquitetura

```
/skool (Claude Code)  ──┐    posts + comentários  →  ator Apify "cristiantala/skool-all-in-one-api"
                        ├──►  DMs (chat)           →  skool-chat.cjs (Playwright → api2.skool.com)
Botão no app matinal  ──┘                                  │  (tudo SÓ LEITURA)
                                                           ▼
                            claude -p (headless, voz do Enzo)  ──►  rascunhos JSON
                                                           │
                                                           ▼
                            pop-up WPF (skool-popup.ps1) com "Copiar resposta"  (DM = 💬)
```

- **Posts + comentários via ator do Apify** (HTTP `run-sync-get-dataset-items`, token no `.env`) — é
  "formato de API", confiável (Integration Ladder).
- **DMs via Playwright** (`skool-chat.cjs`): o chat fica em `api2.skool.com` atrás do **AWS WAF**, que
  bloqueia HTTP puro (401) — só um **navegador real** passa o desafio. O cookie precisa estar no
  domínio `.skool.com` (todos os subdomínios) pra chegar no `api2`. Lê a API `/self/chat-channels` e
  pega as conversas com `num_unread > 0`. É o degrau mais frágil (quebra se o Skool mudar a tela).
- **`claude -p` via Git Bash** (mesmo padrão do daily-brief; `claude` é shim unix em `~/.local/bin`).
- **Só leitura** em tudo. No L2 nada escreve — quem posta é o Enzo. Sem risco de conta.

## Arquivos e caminhos

| O quê | Onde |
|---|---|
| Coletor + cérebro (dispara o pop-up) | `scripts/skool/Run-Skool.ps1` |
| Leitor de DMs (Playwright) | `scripts/skool/skool-chat.cjs` (Node; imprime `{dms:[...]}` em JSON) |
| Renderizador do pop-up (WPF) | `scripts/skool/skool-popup.ps1` (`Show-SkoolPopup`) |
| Botão no app matinal | `scripts/daily-brief/popup.ps1` (`BtnSkool`) |
| Segredos | `.env` → `APIFY_TOKEN`, `APIFY_TOKEN_BACKUP` (conta reserva, failover automático se a principal ficar sem saldo), `SKOOL_GROUP_SLUGS` (duas comunidades, formato `slug\|Rótulo;slug2\|Rótulo2`, rótulos SEM acento — fallback: `SKOOL_GROUP_SLUG`), `SKOOL_COOKIES` (renova sozinho), `SKOOL_EMAIL`+`SKOOL_PASSWORD` (pro renovador logar) |
| Guia de conexão (ator, auth, custo, cookie) | `references/skool-apify.md` |
| Log | `C:\tmp\aios-skool.log` |
| Saída crua do ator (calibrar campos) | `C:\tmp\aios-skool-raw.json` |
| Rascunhos gerados | `C:\tmp\aios-skool.json` |

## Operações comuns

**Rodar agora (testar / abrir o pop-up):** — precisa de `-Sta` (WPF)
```powershell
powershell -NoProfile -Sta -ExecutionPolicy Bypass -File "scripts\skool\Run-Skool.ps1"
```

**Modo interativo no Claude Code:** ler `.env`, chamar o ator do Apify pela ferramenta Bash
(`curl`/`Invoke-RestMethod`) com `action: "posts:list"` e `posts:getComments`, e rascunhar as
respostas aqui no chat seguindo as regras de voz abaixo. Ver request exato em `references/skool-apify.md`.

**Custo:** ~US$ 0,005 por leitura; thread cheia (acima de ~35 comentários) ~US$ 0,05. Uma rodada
típica sai por centavos.

## Regras de voz (valem nos dois modos)

**A fonte é `references/voz-skool.md`** — perfil extraído em 01/07/2026 de 248 DMs + 38
posts/comentários REAIS do Enzo (aberturas, fechamentos, emojis, vocabulário, formato por canal e
playbook por situação: elogio, crítica, reembolso, dúvida técnica, pré-venda, parceria). O
`Run-Skool.ps1` injeta esse arquivo no prompt (arquivo LOCAL — zero custo extra por rodada). No modo
interativo, ler o mesmo arquivo. Resumo mínimo:

- SEMPRE "você" (nunca "tu/teu"); primeiro nome do membro na resposta; frases curtas, energia alta.
- DM = mensagens **picotadas** (2-4 blocos separados por linha em branco); comentário = bloco único.
- Fecho padrão 👊; **não prometer** o que não dá pra confirmar; próximo passo concreto sempre.
- É **rascunho** — o Enzo revisa antes de postar.
- Pra REGERAR o perfil no futuro (se a voz dele evoluir): coletar as mensagens dele com
  Playwright (`api2 /self/chat-channels` paginado + `/channels/<id>/messages`, grátis) + o dump
  `C:\tmp\aios-skool-raw.json` (posts/comentários, já pago), e reescrever `references/voz-skool.md`.

## Achar o comentário sem caçar (botão "Abrir e localizar")

O Skool não tem deep-link de comentário. O botão **"Abrir e localizar"** do pop-up contorna assim:
1. abre a URL do post com **`#:~:text=<trecho do comentário>`** (scroll-to-text do Chrome/Edge — o
   navegador rola até o trecho e destaca em amarelo). Por isso o prompt exige que o campo `original`
   seja um **trecho LITERAL** (não paráfrase) do que o membro escreveu;
2. deixa o **nome do membro copiado** no clipboard como plano B — se o destaque falhar (comentário
   fora dos ~35 primeiros carregados, ou texto quebrado em nós), é só `Ctrl+F` + `Ctrl+V`.

## Gotchas

- **Cookie do Skool expira ~3,5 dias — mas se RENOVA SOZINHO.** Com `SKOOL_EMAIL`/`SKOOL_PASSWORD`
  no `.env`, o `scripts/skool/renovar-cookie.cjs` loga via Playwright e reescreve o `SKOOL_COOKIES`.
  O `Run-Skool.ps1` renova proativamente (última renovação há 2+ dias, marcador em
  `C:\tmp\aios-skool-cookie-renovado.txt`) e reativamente (coleta sem posts válidos → renova e
  tenta 1x de novo). Cookie vencido no Apify vem como item `{success:false, errorCode:AUTH_ERROR}`,
  NÃO como lista vazia. Se falhar de vez, o pop-up avisa e os rascunhos antigos são preservados
  (nunca sobrescreve com falso "tudo certo"). Renovação manual só como último recurso
  (`references/skool-apify.md`).
- **1ª rodada é de calibração.** Os nomes de campo do ator (autor/conteúdo/id) podem vir diferentes
  do esperado; o script salva o cru em `C:\tmp\aios-skool-raw.json`. Se algum rascunho vier vazio ou
  sem autor, conferir esse arquivo e ajustar os campos em `Run-Skool.ps1` (função `Get-Prop`).
- **BOM + STA obrigatórios** nos `.ps1` (PowerShell 5.1): re-salvar com UTF-8 BOM depois de editar;
  rodar sempre com `-Sta` (o botão do app matinal já passa `-Sta`).
- **DMs precisam do cookie no domínio `.skool.com`.** O `skool-chat.cjs` já seta assim. Desde
  01/07/2026 ele chama a api2 DIRETO de dentro da página logada:
  `https://api2.skool.com/self/chat-channels?offset=0&limit=30&last=true&unread-only=false` —
  o `last=true` é OBRIGATÓRIO (sem ele o texto da DM vem vazio) e `limit` > ~25 dá erro. O clique
  no ícone (`ChatNotificationsIconButton`, seletor que o Skool quebrou) ficou só como plano B.
  Se quebrar de novo, recalibrar com `scripts/skool/explore-chat.cjs` (debug).
- **Só "não lidas" no chat.** As DMs surgem por `num_unread > 0`. DM já lida mas não respondida não
  aparece — limitação consciente do v1.
- **DMs vêm com a CONVERSA INTEIRA (desde 01/07/2026).** O `skool-chat.cjs` busca o histórico de cada
  thread não lida em `api2.skool.com/channels/<channelId>/messages?before=35&after=35` (últimas 12
  mensagens; `metadata.src == 7c49aa3ab078427cbd407d07dd9529ad` = mensagem do Enzo) e o rascunho
  considera todo o contexto — nunca só a última mensagem. CUIDADO: buscar `/messages` via fetch NÃO
  marca como lida; quem marca é o endpoint `/read`, que a UI dispara ao ABRIR a conversa — não clicar
  em conversas num navegador automatizado logado, senão ela some da fila de não lidas.
- **Desligar as DMs:** `$IncluirChat = $false` no topo do `Run-Skool.ps1` (cada rodada de chat custa
  ~20s de navegador).

## Subir pra L3 depois (não agora)

Se um dia o Enzo quiser **auto-postar conteúdo pré-aprovado** ou aprovar membros, o ator escreve
(precisa admin/mod). Aí, pela Regra do Estagiário: criar uma **conta de moderador dedicada** pra IA
(nunca a conta pessoal do Enzo), e só depois de meses validando o L2 na mão (Bike Method).
