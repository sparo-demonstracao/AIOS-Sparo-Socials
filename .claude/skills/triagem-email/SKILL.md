---
name: triagem-email
description: Use quando o Enzo pedir pra TRIAR / CATEGORIZAR / ORGANIZAR a caixa de e-mail, ou pra RASCUNHAR respostas dos e-mails que chegaram ("o que tem no e-mail?", "categoriza meus e-mails", "responde os e-mails", "tem e-mail pra responder?", "rascunha as respostas do Gmail", "organiza minha caixa de entrada", "categoriza o atendimento", "triar o Zoho"). Lê o Gmail (via MCP), ignora duplicados/automação, escolhe a categoria certa (label), aplica o label e cria um RASCUNHO de resposta na voz do Enzo pra ele enviar com um clique — exceto nas categorias Médio e Sem Importância. Cobre TAMBÉM a caixa de atendimento no Zoho (atendimento@sparo.com.br) via script próprio, aplicando as mesmas 6 tags e rascunhando na voz da equipe Sparo. L2: nada é enviado, só rascunhado.
---

# Triagem de E-mail (categoriza + rascunha, L2)

Lê os e-mails recebidos do Enzo (`agenciasparo@gmail.com`), trata cada **thread única**, **escolhe a
categoria** entre os 6 labels que ele já usa, **aplica o label** e **cria um rascunho de resposta** na
voz dele — pronto pra ele revisar e enviar com **um clique**. **L2 — Drafted:** a IA categoriza e
rascunha; o **Enzo envia**. Nada sai daqui automaticamente.

Por que L2: responder e-mail é **a voz do Enzo indo pra fora** (parceiros, alunos, clientes) — e, pela
regra dele, isso nunca sai sem ele ver antes. Aplicar label é reversível e de baixo risco, então é
automático; **enviar** nunca é. (Mesma filosofia da skill `/skool`.)

## As regras de negócio (decididas pelo Enzo)

**1. Trabalhe por THREAD, não por mensagem.** Isso já elimina os follow-ups repetidos ("just checking
in", "following up one more time") — uma thread = uma decisão, um rascunho.

**2. Ignore e-mail de automação / massa / duplicado.** NÃO categoriza nem rascunha quando:
   - remetente é `no-reply` / `noreply` / `notifications@...`;
   - tem rodapé de *Unsubscribe* / pixel de tracking / "Entraremos em contato em breve!" (auto-resposta);
   - é o mesmo template disparado pra várias pessoas (blast);
   - é só mais um follow-up automático de uma proposta que já está na caixa.
   > O Enzo só quer agir nos e-mails **únicos e genuínos** (escritos por uma pessoa pra ele).

**3. Categorize em UM dos 6 labels.** (IDs reais da conta — use no `label_thread`.)

| Label | ID | Quando | Rascunha? |
|---|---|---|---|
| **Importante** | `Label_1822373933227828650` | Ação pessoal/negócio que não cai nas de baixo: pagamento, comissão, problema de conta/acesso, jurídico, parceiro recorrente | ✅ |
| **Propostas/Parcerias** | `Label_6954570115436509362` | Patrocínio, colab, agência de IA/hosting, proposta de vídeo pago, "quero fechar parceria" (a mais comum) | ✅ |
| **Curso** | `Label_8095239955334782594` | Dúvida sobre a Masterclass: o que inclui, acesso, conteúdo, **reembolso** | ✅ |
| **Reunião** | `Label_6400709588805680384` | Agendar/confirmar reunião, recap de call, disponibilidade, "podemos marcar?" | ✅ |
| **Médio** | `Label_3632722313834281694` | Útil mas não pede resposta: newsletter que ele segue, update de ferramenta | ❌ |
| **Sem Importância** | `Label_8493917233294908215` | Promo em massa, marketing irrelevante, ruído | ❌ |

**4. Rascunho SEMPRE, MENOS em Médio e Sem Importância.** Essas duas só recebem o label, sem rascunho.

**5. Parceria → pesquise a empresa na internet ANTES de rascunhar.** (Regra do Enzo.) Pra TODA thread
de **Propostas/Parcerias**, rode `WebSearch` sobre a empresa que está propondo (nome + "company" /
"funding" / "empresa") e decida se é **grande/relevante** ou **pequena/desconhecida**:
   - **Grande/relevante** (marca conhecida de IA, startup com aporte, audiência/produto sério) →
     **oportunidade**: rascunhe demonstrando interesse e pedindo briefing/valores (moldes (a)/(b) do guia).
   - **Pequena/desconhecida** (sem presença real, produto obscuro, sem rastro) → **recusa elegante,
     porta aberta** (molde (c) do guia). Ainda aplica o label e rascunha — mas rascunha a recusa.
   > **Por quê:** todo vídeo do Enzo vende o curso dele. Num vídeo de promoção paga ele **não** consegue
   > vender o curso junto — então o custo de oportunidade só compensa com empresa **grande/relevante**
   > (vale o dinheiro + relacionamento). Com empresa pequena, não vale trocar uma venda de curso por
   > uma colab fraca. **O motivo é interno** — não escreva isso no e-mail; a recusa pro contato é só
   > a cordial de sempre ("sem espaço para inserções no momento...").
   > No relatório pro Enzo, mostre o **veredito** (grande/pequena), 1 linha de evidência e o **link da
   > fonte**, pra ele poder discordar e mandar seguir mesmo assim.

**6. O rascunho vai na voz do Enzo.** ANTES de escrever qualquer rascunho, **leia `references/voz-email.md`**
(guia de voz específico de e-mail: aberturas, fechamentos, assinatura e o molde de cada categoria).
Espelhe o idioma de quem escreveu (PT → PT, EN → EN). Preço/exclusividade/datas o Enzo decide —
deixe um `[ ]` em vez de inventar número.

## Procedimento (modo interativo no Claude Code)

1. **Puxe as threads** com `mcp__claude_ai_Gmail__search_threads`. Padrão: caixa de entrada não lida
   das últimas 48h →
   `query: "in:inbox is:unread newer_than:2d"` (`view: THREAD_VIEW_MINIMAL`).
   Ajuste a janela se o Enzo pedir ("a semana toda", "só hoje").
2. **Para cada thread**, leia o conteúdo real com `mcp__claude_ai_Gmail__get_thread`
   (`messageFormat: FULL_CONTENT`). Aplique a **regra 2** (ignorar automação/massa) — se cair nela, pula.
3. **Decida a categoria** pela tabela (regra 3). Na dúvida entre duas, vale o conteúdo da última
   mensagem **do remetente** (não a sua resposta anterior).
4. **Aplique o label** com `mcp__claude_ai_Gmail__label_thread` (`threadId` + `labelIds: ["<ID>"]`).
5. **Se for Propostas/Parcerias** (regra 5): rode `WebSearch` sobre a empresa e classifique
   grande/relevante vs pequena/desconhecida — isso decide se o rascunho vai ser de **interesse** ou de
   **recusa**. Guarde o veredito + 1 fonte pro relatório.
6. **Se a categoria rascunha** (regra 4): leia `references/voz-email.md` (uma vez por rodada) e crie o
   rascunho com `mcp__claude_ai_Gmail__create_draft`:
   - `to`: e-mail do remetente (só o endereço, sem nome);
   - `replyToMessageId`: **id da última mensagem recebida** da thread (faz o rascunho colar na conversa);
   - `subject`: `Re: <assunto>`;
   - `body`: a resposta na voz do Enzo.
7. **Reporte em tabela** no chat: remetente · categoria aplicada · rascunhou? (sim/não) · 1 linha do
   que o rascunho diz. Em parceria, acrescente o **veredito da empresa** (grande/pequena + fonte).
   Threads ignoradas entram numa linha "puladas (automação): N".

> Primeira rodada do dia pode ter muitos e-mails. Se passar de ~15 threads, mostre o plano (quem vai
> pra qual categoria, quem vai ser rascunhado) e confirme com o Enzo antes de aplicar em lote.

## Modo lote (script — OpenRouter + gws)

Pra **volume** (caixa inteira / últimos N dias), não dá pra ler thread por thread aqui no chat — use o
script `scripts/triagem-email/triar.mjs`. Ele faz o mesmo, mas barato e em escala:

- **Classifica com Haiku** (`anthropic/claude-haiku-4.5`) e **rascunha com Sonnet 4.6**
  (`anthropic/claude-sonnet-4.6`), via **OpenRouter** (`OPENROUTER_API_KEY` no `.env`). Modelos
  configuráveis por flag (`--classify-model`, `--draft-model`) ou env (`TRIAGEM_CLASSIFY_MODEL`,
  `TRIAGEM_DRAFT_MODEL`). Haiku é o barato pra triar os ~200; Sonnet só roda no subconjunto que rascunha.
- **Gmail pelo `gws` CLI** (não MCP — script não enxerga MCP). `gws` tem escopo `gmail.modify`
  (lista, aplica label, cria rascunho). Ver `references/gws-cli.md`.
- **Voz:** lê `references/voz-email.md` em runtime e injeta no prompt do Sonnet (fonte única).
- **Idempotente + retomável:** só pega threads `has:nouserlabels` e aplica label conforme processa —
  re-rodar continua de onde parou (pula o que já tem categoria). **De-dup** por remetente+assunto na
  rodada (disparo repetido de automação é categorizado mas não rascunhado de novo 🔁).
- **Parceria no lote = pesquisa web de verdade.** Pra cada parceria, o script faz uma busca na web
  (OpenRouter `:online`, `--research-model`, default `anthropic/claude-haiku-4.5:online`) sobre a
  **marca** (deduplicada — pesquisa KIMI 1x, não 10), pesando **sinais de terceiros** (aporte,
  valuation, Crunchbase, notícias, Wikipedia) **acima do marketing do próprio site**, e o **fit** com o
  nicho (IA/código/automação = bom; videoclipe/fintech/beleza = fraco). Veredito
  grande/media/pequena/desconhecida → recomendação **determinística e conservadora** (no código, função
  `recommend`): **recusa SÓ se "pequena"**; desconhecida/média → **briefing**; **nunca recusa empresa
  grande por engano** (o medo nº 1 do Enzo). **Google Trends foi descartado** — mede busca do
  consumidor, não relevância de empresa, e não tem API oficial.
- **L2:** aplica label e cria rascunho; **nada é enviado.**

```bash
# testar sem mexer no Gmail (classifica + monta rascunho, não aplica):
node scripts/triagem-email/triar.mjs --dry-run --limit 6
# rodar de verdade nos últimos 30 dias:
node scripts/triagem-email/triar.mjs --days 30
# RANKING de relevância das parcerias que já estão rotuladas (reavalia + pesquisa web por marca):
node scripts/triagem-email/triar.mjs --recheck-parcerias --days 30
# RESPONDER as parcerias NÃO-grandes (média/desconhecida/pequena): "agenda cheia → me chame em <mês +N>".
# Atualiza o rascunho existente da thread NO LUGAR (não cria um segundo). Precisa do aios-parcerias.json:
node scripts/triagem-email/triar.mjs --responder-naograndes --meses 4
# CRIAR os rascunhos que faltam (grandes → interesse, 1 por marca; + Importante/Curso/Reunião):
node scripts/triagem-email/triar.mjs --rascunhos-faltantes --days 30
```
A política das não-grandes (regra do Enzo): rascunho cordial que **agradece o interesse**, diz que a
**agenda de parcerias está cheia** agora, e pede pra **voltarem em N meses** (mês específico — ex.: 4
meses a partir de jun/2026 = **outubro de 2026**). Espelha o idioma, na voz do Enzo. As **grandes** não
são tocadas (mantêm o rascunho de interesse/briefing). Saída em `C:/tmp/aios-parcerias-naograndes.json`.
Saídas em `C:/tmp/aios-triagem-email.{log,json}`; ranking de parcerias em `C:/tmp/aios-parcerias-ranking.json`
(ordenado grande→pequena, com evidência + fonte — pra priorizar relacionamento com as grandes).

**Página no painel:** o `--recheck-parcerias` também grava `C:/tmp/aios-parcerias.json` (por-proposta, com
data + relevância), que alimenta a página **`painel/public/parcerias.html`** (link "Parcerias" no menu do
painel, rota `/api/parcerias`). Lá o Enzo vê **todas as propostas**, ordenáveis por **relevância** (criar
relacionamento com as grandes) ou por **data**, com filtro por veredito e clique pra abrir no Gmail. Há
uma **rede de segurança** (`BIG_AI` no script) que corrige marcas de IA conhecidas mal pesquisadas (ex.:
"Minimax" não pode cair como a empresa alemã de incêndio) e ignora a própria "Sparo".

## Rodar sozinho todo dia (agendado — 7:55)

A triagem roda **automaticamente todo dia às 7:55** (ou quando o PC voltar, se estava desligado nesse
horário) via Task Scheduler — tarefa **"AIOS - Triagem de E-mail"**, mesmo padrão do Resumo Matinal
(Diária + `-StartWhenAvailable` + Interactive). É o **modo padrão** do `triar.mjs` (`--days 7`):
categoriza, aplica o label e rascunha (L2) só o que ainda não tem categoria (`has:nouserlabels`) —
idempotente, não duplica. **NÃO é o Resumo Matinal**: são **duas automações separadas** (o Enzo pediu
pra não misturar — o resumo continua só lendo/mostrando; quem organiza a caixa é esta tarefa).

- **Wrapper:** `scripts/triagem-email/Run-Triagem.ps1` — fixa o PATH de node/bash/gws (o agendador tem
  PATH enxuto) e loga. Mudar os flags aqui (ex.: janela de dias) se precisar.
- **Logs:** `C:\tmp\aios-triagem-cron.log` (início/fim/exit) + saída completa em
  `C:\tmp\aios-triagem-cron-last.txt`; detalhe por e-mail em `C:\tmp\aios-triagem-email.{log,json}`.
- **Operar a tarefa:**
  ```powershell
  Get-ScheduledTask -TaskName "AIOS - Triagem de E-mail" | Get-ScheduledTaskInfo        # quando roda / rodou
  Start-ScheduledTask  -TaskName "AIOS - Triagem de E-mail"                             # rodar agora
  Set-ScheduledTask    -TaskName "AIOS - Triagem de E-mail" -Trigger (New-ScheduledTaskTrigger -Daily -At 8:30am)  # mudar horário
  Disable-ScheduledTask -TaskName "AIOS - Triagem de E-mail"                            # desligar (Enable- religa)
  ```

## Caixa de Atendimento (Zoho — atendimento@sparo.com.br)

A MESMA lógica roda também na **caixa de atendimento** (Zoho Mail), com script próprio
`scripts/triagem-email/triar-zoho.mjs`. Não usa `gws`/Gmail — fala direto com a **REST do Zoho** via
refresh token no `.env` (mesmo padrão do Resumo Matinal). Categoriza nas **mesmas 6 tags** (que o Enzo
criou no Zoho; o script **descobre os IDs sozinho** por nome via `/labels`), aplica a tag e rascunha.

Diferenças do Gmail:
- **Voz de EQUIPE/atendimento** (`references/voz-atendimento.md`), não a voz pessoal do Enzo. Assina
  "Equipe Sparo". Quando o assunto precisa do Enzo (parceria, comercial, jurídico, pede falar com ele),
  o rascunho avisa que **"já repassou pro Enzo"** — não decide nada. Por isso **NÃO** há pesquisa web de
  empresa (a equipe não fecha parceria; só repassa).
- **Reembolso (regras do Enzo):** (a) aviso **AUTOMÁTICO** de reembolso (Kiwify `naoresponder@`
  "Reembolso da venda ...") → sempre **Médio**, sem rascunho (override determinístico no código);
  (b) **PEDIDO** de reembolso de um **aluno real** → **Curso** + rascunho com roteiro fixo: agradece,
  pede **o e-mail que a pessoa usou pra COMPRAR** a Masterclass, e pergunta o **MOTIVO** do reembolso
  (acolhedor — o motivo interno, reduzir a taxa de reembolso, **não** vai no e-mail).
- **Por MENSAGEM, não por thread** (o Zoho lista por mensagem). Idempotência via **seen-file**
  `C:\tmp\aios-triagem-zoho-seen.json`; de-dupa por remetente+assunto na rodada.
- **Rascunho VINCULADO à thread do original:** o script busca o Message-ID RFC do e-mail
  (`GET .../messages/{id}/header?raw=false`) e cria o rascunho com `inReplyTo` + `refHeader` — assim
  ele aparece **dentro da conversa na Inbox** (equivalente ao `replyToMessageId` do Gmail), não só na
  pasta Rascunhos. Se o header falhar, cai no rascunho solto sem quebrar a triagem.
- **Escopos Zoho de ESCRITA** (regerados uma vez, superset dos de leitura): `ZohoMail.tags.READ` +
  `ZohoMail.messages.UPDATE` + `ZohoMail.messages.CREATE`. Endpoints e receita em
  `references/zoho-mail-api.md`; reconectar via `scripts/daily-brief/Conectar-Zoho.ps1`.

```bash
node scripts/triagem-email/triar-zoho.mjs --dry-run --limit 8   # testa (tags + classificação + rascunhos), NÃO escreve
node scripts/triagem-email/triar-zoho.mjs --days 7              # aplica tag + rascunha o que ainda não foi visto
```
Agendável pelo wrapper `scripts/triagem-email/Run-Triagem-Zoho.ps1` (log em `C:\tmp\aios-triagem-zoho-cron.log`;
detalhe por e-mail em `C:\tmp\aios-triagem-zoho.{log,json}`). **L2 — nada é enviado.**

## Aprender a voz dele (mantença do guia)

`references/voz-email.md` foi extraído dos e-mails que o **próprio Enzo** respondeu. Se um dia ele
disser "não escrevo assim" ou mudar o padrão, **atualize esse arquivo** (não o CLAUDE.md — a voz de
e-mail mora lá pra ser lida só na hora de escrever). Pra recalibrar do zero, reler os enviados:
`search_threads` com `query: "in:sent newer_than:1y"` e abrir as threads genuínas (ignorando os
disparos em massa, ex.: o blast "Fala, [Nome]! ... MasterClass de n8n").

## Gotchas

- **`create_draft` só aceita e-mail puro** no `to` (sem `Nome <...>`). Pegue o `sender` da thread.
- **`replyToMessageId` = última mensagem do OUTRO**, não a sua — senão o rascunho cola no lugar errado.
- **Thread, não mensagem.** Operar por thread é o que dá o "ignore duplicados" de graça.
- **Label é reversível, envio não.** Pode aplicar label sem medo; rascunho nunca vira envio aqui.
- **Gmail via MCP (`mcp__claude_ai_Gmail__*`)** funciona no modo interativo (sessão claude.ai aberta).
  Pra **volume/headless**, use o **modo lote** (script com `gws` + OpenRouter) — não depende do MCP.
- **Não rascunhe Médio nem Sem Importância** — só label. É regra, não esqueça.
- **`gws` no script** roda via Git Bash (aspas simples no JSON; o PowerShell quebra). A saída do `gws`
  vem com a linha `Using keyring backend: keyring` antes do JSON — o script já corta tudo antes do 1º `{`.
- **`gws drafts create/update` EXIGE `userId` via `--params`** (`--params '{"userId":"me"}'`), não só
  `--json`. Sem isso, **400 "Required path parameter userId is missing"**. E o `gws()` do script **lança
  erro** quando o JSON de resposta tem `.error` — senão falha de escrita passa silenciosa (já aconteceu:
  o bulk "criou" rascunhos que não existiam). Sempre confira `criados/atualizados/erros` no resumo.
