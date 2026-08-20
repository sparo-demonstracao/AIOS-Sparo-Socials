# Decisions Log

Append-only record of meaningful decisions and why they were made. `/level-up` Phase 2 (Method interview) writes scoped automation specs here. You can also append manually whenever you decide something worth remembering.

**Format per entry:**

```
## YYYY-MM-DD — Short title

**Decision:** what was decided.

**Why:** the reasoning, constraints, and what would change your mind.

**Alternatives considered:** what else was on the table.

**Owner:** who's accountable.
```

Keep it terse. Future-you will thank present-you for capturing the *why*, not just the *what*.

---

## 2026-06-21 — YouTube Studio: focar só em números públicos por enquanto

**Decision:** Para o domínio de receita, conectar apenas os **números públicos** do YouTube
(visualizações, inscritos, likes, comentários — via conexão YouTube do mcp.ai). O **faturamento
privado do Studio** (receita, RPM, tempo de exibição) fica **adiado**.

**Why:** Os números públicos já estão ao alcance, de graça (1 consulta grátis restante, depois
R$ 9,90/mês). Já o faturamento privado exige criar projeto no Google Cloud e configurar a API de
Analytics do YouTube com OAuth — processo técnico e demorado, sem conector pronto. O custo de
montar não se justifica agora; a receita principal já é acompanhada pela Kiwify (conectada).

**Alternatives considered:** (a) Montar a API de Analytics do YouTube agora — descartado pelo
esforço. (b) Ignorar o YouTube por completo — descartado, pois os números públicos têm valor e
custo baixo.

**Owner:** Enzo. Revisar quando tráfego pago/escala exigir acompanhar receita do canal de perto.

**Update (mesmo dia, 2026-06-21):** Decisão revertida — o Enzo quis conectar o faturamento privado
na hora. Feito com sucesso: projeto Google Cloud "AIOS YouTube", OAuth da conta dona do canal,
acesso à YouTube Analytics API (gratuito). Guia em `references/youtube-studio-api.md`. Conclusão
útil: o setup levou ~30 min e o custo era zero; o "trabalho" não era tão grande quanto estimei.

---

## 2026-06-22 — Conectar a Google Workspace CLI (`gws`)

**Decision:** Instalar e conectar a `gws` (Google Workspace CLI oficial) como mecanismo de script
pro Google Workspace, na conta `agenciasparo@gmail.com`, reusando o projeto GCP `aios-sparo-yt`.
Escopos de **leitura + escrita** em Drive, Gmail (inclui envio via `gmail.modify`), Calendar, Docs
e Sheets. Credenciais criptografadas (AES-256-GCM) em `~/.config/gws/`. Guia em
`references/gws-cli.md`.

**Why:** Uma só ferramenta cobre Gmail/Calendar/Drive (que já tinham MCP) **e abre Docs/Sheets/
Slides/Tasks**, antes inalcançáveis — base pra automações que produzem artefatos (Doc de roteiro,
planilha de vídeos, resumo semanal). Saída em JSON, pensada pra agente de IA. Reusar o projeto do
YouTube evitou criar infra nova.

**Alternatives considered:** (a) `gws auth setup` 100% automático — **não dá**, o Google exige criar
o cliente OAuth no Console manualmente (limitação do Google, não da ferramenta). (b) Só MCP do
mcp.ai — não cobre Docs/Sheets. (c) Escopo só leitura — preterido; o Enzo quis já poder
criar/enviar (Regra do Estagiário: começar restrito ficou pra trás conscientemente).

**Gotcha registrado:** no Windows PowerShell 5.1 o JSON do `--params` quebra (aspas/espaços). Usar a
ferramenta **Bash** com aspas simples. Subcomandos são camelCase (`calendarList`, `getProfile`).

**Owner:** Enzo. Reduzir escopos (ex.: voltar a readonly) ou criar identidade própria pra IA
(Regra do Estagiário) se/quando for operar em modo mais autônomo.

---

## 2026-06-24 — `/level-up`: skill `roteiro-aula` (gerador de roteiro de aula)

**Decision:** Construir a skill `roteiro-aula` (AI-assisted, `.claude/skills/roteiro-aula/`) pra
escopar e rascunhar os roteiros das aulas do curso. Spec do Method (3Ms):

- **Constraint (Passo 1):** roteirizar as aulas — a dor nº 1 documentada (`about-me`), o gargalo que
  trava a produção dos vídeos → trava o curso (R$70k) e a constância no YouTube (8/mês).
- **EAD (Passo 2):** **Automatizar** (AI-assisted). Eliminar não — o roteiro é o padrão de qualidade.
  Delegar não — humano perderia a voz/pedagogia. 60/30/10: ~30% determinístico (formato fixo +
  contexto do masterclass), ~50% IA (rascunho na voz), ~20% manual (julgamento + gravação).
- **Mapa (Passo 3):** Trigger = Enzo roda a skill com o tema/transcrição (manual). Fontes =
  `references/masterclass/` (INDICE, módulos, transcrições) + `voice.md` + about-me/business.
  Transformação = tema+contexto → roteiro no formato fixo. Decisão = curso vs YouTube (v1 = curso).
  Destino = Markdown em `references/masterclass/`.
- **Autonomia (Passo 4):** **L2 (Drafted)** — IA rascunha, Enzo revisa antes de gravar. Bike Method
  Fase 1 (rodar na mão, validar UMA aula antes do lote).
- **KPI (Passo 5):** Bucket 1 (mais clientes) + Bucket 3 (menos custo do tempo). Métrica = tempo do
  tema → roteiro pronto pra gravar (horas → minutos de rascunho + revisão). Sustenta 8 vídeos/mês.

A skill tem 2 modos: **PLANO** (analisa o curso vs objetivo final, acha lacunas, estrutura as
próximas aulas — cada uma com 1 conceito) e **ROTEIRO** (gera o roteiro de uma aula no formato fixo,
incluindo os **prompts pra enviar à IA durante a gravação** — leigo entende, mas com domínio técnico).

**Why:** Primeira capacidade própria do AIOS — ataca direto a maior lacuna do audit de 21/06
(Capacidades 10/25: 0 skills próprias) e a dor recorrente do Enzo. O plano dele: transcrever os
módulos restantes (Whisper, ver memória `transcricao-local-whisper`) e usar as transcrições como base
de voz/continuidade pra elaborar o roteiro das aulas que faltam pra fechar o curso.

**Alternatives considered:** (a) Template de prompt — descartado: faria o Enzo reunir o contexto do
masterclass na mão toda semana (atrito recorrente) e não fecharia a lacuna de "skill própria".
(b) Sub-agente — exagero; o trabalho não precisa de loop de raciocínio+ferramentas (Workflows >
agentes). (c) Script determinístico puro — não resolve: não escreve na voz do Enzo. (d) v1 pra
YouTube — adiado; o curso é prioridade nº 1 e o formato está documentado. YouTube vira v2 na mesma skill.

**Owner:** Enzo. Subir pra L3 só depois de validar a qualidade em várias aulas na mão (Bike Method).

---

## 2026-06-24 — Auto-descrição dos vídeos do YouTube (transcrição → descrição + capítulos)

**Decision:** Automação que, a cada novo upload no canal, baixa o áudio do próprio vídeo (yt-dlp),
transcreve local na GPU (faster-whisper, receita validada), gera **resumo + capítulos + hashtags**
com `claude -p` (Sonnet) e publica a descrição via YouTube Data API `videos.update`. Template fixo
(links/cupom/CTA) **imutável**; só as 3 partes variáveis mudam. Roda na máquina do Enzo via Agendador
de Tarefas a cada 3 min (tarefa `AIOS - YT Auto Descricao`). Capítulos **proporcionais à duração**
(~1 a cada 2,5 min, entre 3 e 12). **Publica direto**, sem rascunho. Código em `scripts/yt-auto-descricao/`.

**Why:** Tira do Enzo a tarefa manual de escrever descrição/capítulos a cada vídeo (meta 8/mês).
Whisper local em vez da legenda automática do YouTube **elimina o "tentar"** (legenda de vídeo novo
demora horas) e dá melhor qualidade em PT. Baixar o áudio do próprio upload dispensa apontar arquivo
→ 100% hands-off, < 10 min. Pré-requisitos já existiam: o token OAuth já tinha escopo
`youtube.force-ssl` (escrita) e a GPU já tinha a receita de Whisper.

**Alternatives considered:** (a) `youtube-transcript-api` na legenda automática — descartado: depende
do YouTube gerar legenda (lento/instável em vídeo novo) e qualidade PT pior. (b) Enzo apontar o
arquivo local gravado — descartado: exige ação manual, conflita com "ser avisado sozinho". (c)
Rascunho pra aprovar antes — o Enzo escolheu publicar direto. (d) Anthropic API — não há key;
`claude -p` reusa a auth existente (mesmo padrão da skill Obsidian). (e) WebSub/push pra disparo
instantâneo — exige servidor público; poll a cada 3 min já cumpre os < 10 min.

**Owner:** Enzo. Revisar estilo/contagem de capítulos após os primeiros vídeos reais; o 1º upload
novo é o teste real do `videos.update`.

---

## 2026-06-24 — Skool: leitura + rascunho de respostas (L2), NÃO bot autônomo

**Decision:** Conectar o Skool em **só leitura** via ator do Apify (`cristiantala/skool-all-in-one-api`)
e construir a skill `skool` + um **botão "Responder Skool"** no app matinal. Fluxo: lê posts/comentários
da comunidade → `claude -p` rascunha a resposta **na voz do Enzo** → ele revisa e **posta na mão**.
**L2 (Drafted), nada publicado automaticamente.** Código em `scripts/skool/` (Run-Skool.ps1 +
skool-popup.ps1), config no `.env` (APIFY_TOKEN, SKOOL_GROUP_SLUG, SKOOL_COOKIES), guia em
`references/skool-apify.md`.

**Why:** O Enzo pediu inicialmente um **bot de navegador que postasse e respondesse sozinho** (L4).
Recusado por três motivos, todos regras dele/do framework: (1) **Integration Ladder** — bot de
navegador caseiro é o degrau mais frágil; o ator do Apify é "formato de API", confiável, e o Enzo já
usa Apify no curso. (2) **Autonomia** — começar no nível mais baixo que resolve; L4 numa comunidade
**paga** é over-reach. (3) **Voz + Regra do Estagiário** — responder alunos é a voz do Enzo indo pra
fora, que pela regra dele nunca sai sem revisão; e IA não se passa por ele. O downside é assimétrico:
economiza minutos, arrisca o ativo (ban por ToS). O L2 entrega ~80% do ganho com ~0 de risco.

**Alternatives considered:** (a) Bot de navegador autônomo (L4) — recusado (acima). (b) Template de
prompt — descartado: o Enzo quis embutido no app matinal. (c) skoolapi.com em vez do Apify — Apify
preferido porque ele já conhece. (d) Auto-postar conteúdo pré-aprovado (L3) — adiado; só depois de
validar o L2 e com **conta de moderador dedicada** pra IA (Regra do Estagiário). (e) Cobrir DMs —
adiado: o ator confirma posts+comentários; leitura da caixa de DMs precisa ser verificada.

**Pendências:** o Enzo precisa colar o **cookie de sessão do Skool** no `.env` (passo a passo em
`references/skool-apify.md`) pra leitura funcionar; a **1ª rodada é de calibração** dos nomes de campo
do ator (saída crua em `C:\tmp\aios-skool-raw.json`); e **rotacionar o token do Apify** (foi colado no
chat). Cookie expira ~3,5 dias.

**Owner:** Enzo. Subir pra L3 (escrita) só após meses validando o L2 na mão (Bike Method).

**Update (mesmo dia, 2026-06-24) — DMs do chat por Playwright:** o Enzo pediu pra incluir as mensagens
do **chat (DMs)**. O ator do Apify **não lê DMs** (roadmap). O Enzo escolheu o caminho de **bot de
navegador** (Playwright), ciente da fragilidade. Implementado em `scripts/skool/skool-chat.cjs`:
navegador real (passa o AWS WAF que dá 401 no HTTP puro) + cookie no domínio `.skool.com` (pra chegar
no `api2.skool.com`) → lê `/self/chat-channels`, filtra `num_unread > 0`. Integrado ao `Run-Skool.ps1`
(`$IncluirChat`), DMs entram na atividade (marcadas 💬) e o `claude` rascunha junto. **Validado ponta a
ponta:** 1 rodada real gerou 19 rascunhos (2 DMs que precisavam + 17 posts/comentários; as 3 DMs de
"obrigado/resolvido" o claude dispensou sozinho). Continua **L2, só leitura.** Detalhes técnicos e
recalibração: `references/skool-apify.md`.

---

## 2026-06-25 — Resumo Matinal: cache do dia + tela de carregamento com logs reais

**Decision:** O app "Resumo Matinal" (`Resumo Matinal.exe`) passou a rodar o **`Abrir-Matinal.ps1`**
(antes rodava o `Show-Brief.ps1`). Comportamento novo: se já existe resumo **de hoje** (campo `data`
== hoje no `C:\tmp\aios-brief.json`), abre o pop-up **na hora**; se é a **1ª vez no dia**, mostra uma
**tela de carregamento** (`loading-brief.ps1`) com os **logs reais** da coleta aparecendo ao vivo,
roda o `Run-DailyBrief.ps1 -NoPopup` oculto em segundo plano e, ao terminar, mostra o resumo — que
fica cacheado pro resto do dia (aberturas seguintes são instantâneas). A tarefa das 11h continua
sendo o **pré-cache** do dia.

**Why:** O Enzo não quer esperar toda vez que abre o app ("não quero ter que abrir e aguardar, a
menos que seja a 1ª vez no dia") e, quando precisa esperar, quer ver que **está buscando as
mensagens** em vez de uma tela parada. Logs reais (não fake): o `Run-DailyBrief` escreve cada passo
via `Step()` em `C:\tmp\aios-brief-progress.log` e a tela de carregamento faz *tail* desse arquivo.

**Alternatives considered:** (a) Sempre coletar ao abrir — descartado: lento toda vez. (b) Barra de
progresso fake/genérica — descartado: o Enzo pediu os logs reais. (c) Mudar a tarefa das 11h pra
`-NoPopup` (só cachear, sem pop-up) — descartado por ora pra não tirar o "empurrão" diário das 11h;
ela segue mostrando o pop-up e servindo de pré-cache.

**Validado ponta a ponta (2026-06-25):** coleta real `-NoPopup` gerou o cache de hoje (4 WhatsApp,
8 Gmail, 3 YouTube, 10 itens priorizados) com o log fechando em "✨ Resumo pronto!"; a tela de
carregamento renderiza e transmite os logs ao vivo (emoji/acentos OK) e fecha sozinha ao fim; o
caminho instantâneo abre o pop-up de imediato quando o cache é de hoje. `.exe` recompilado do
`Abrir-Matinal.ps1`; atalhos (Desktop/Menu Iniciar) já apontam pro mesmo caminho.

**Owner:** Enzo.

---

## 2026-06-25 — Triagem de e-mail: categoriza + rascunha (L2), com pesquisa de empresa nas parcerias

**Decision:** Skill `triagem-email` (`.claude/skills/` + `.agents/skills/`) que lê a caixa do Gmail
(MCP `claude_ai_Gmail`), trata por **thread**, ignora automação/massa/follow-up duplicado, **categoriza**
em um dos **6 labels que o Enzo já tem** (Importante, Propostas/Parcerias, Curso, Reunião, Médio, Sem
Importância), **aplica o label** e **cria um rascunho de resposta na voz dele** pra enviar com 1 clique.
**Não rascunha** Médio nem Sem Importância (só label). Em **Propostas/Parcerias**, roda `WebSearch` da
empresa **antes** de rascunhar: **grande/relevante → interesse** (pede briefing/valores);
**pequena/desconhecida → recusa cordial, porta aberta**. A voz de e-mail foi extraída dos próprios
envios do Enzo e salva em `references/voz-email.md`, **lida só na hora de rascunhar** (fora do contexto
de rotina, como o Enzo pediu). **L2 — nada é enviado**, só rascunhado.

**Why:** Tira do Enzo a triagem manual da caixa e o trabalho de escrever resposta do zero (responder
com 1 clique). Categorias e regra de rascunho são **dele** — a skill usa os labels reais e o corte
"rascunho só fora de Médio/Sem Importância" que ele definiu. A **pesquisa de empresa** nas parcerias é
regra dele: todo vídeo vende o curso, então um vídeo de **promo paga** tem custo de oportunidade (não
dá pra vender o curso junto) — só compensa com empresa **grande/relevante**; com empresa pequena, não
vale trocar venda de curso por colab fraca → recusa. O motivo é interno; o e-mail de recusa é só a
cordialidade de sempre. **L2** porque responder e-mail é a voz do Enzo indo pra fora (Regra do
Estagiário + regra de voz): aplicar label é reversível e automático; **enviar** nunca sai sem ele ver.

**Alternatives considered:** (a) Salvar a voz de e-mail no CLAUDE.md — descartado: ficaria no contexto
sempre; o Enzo quis que só fosse lida ao escrever e-mail → arquivo `references/voz-email.md` carregado
sob demanda pela skill. (b) Voz de e-mail como skill própria — redundante; reference carregado pela
skill resolve. (c) Auto-enviar a resposta (L3/L4) — recusado: voz pra fora sem revisão. (d) Rodar
agendado/headless agora — adiado: o MCP do Gmail (auth claude.ai) é frágil em headless (anotado no
daily-brief); se virar rotina, migrar a coleta pra REST/`gws`. (e) Só sugerir o label sem aplicar —
preterido: o Enzo quis que a IA **escolha e aplique** a categoria (e label é reversível).

**Owner:** Enzo. Subir pra envio automático (L3) só após validar os rascunhos na mão (Bike Method);
calibrar `references/voz-email.md` se algum rascunho soar fora da voz.

**Update (mesmo dia, 2026-06-25) — modo lote com OpenRouter (Haiku classifica, Sonnet 4.6 rascunha):**
O Enzo pediu pra categorizar **toda a caixa dos últimos 30 dias** (~200 threads) e rascunhar onde
preciso, **usando a chave OpenRouter dele** (`OPENROUTER_API_KEY` no `.env`) — e, pra baratear,
**Haiku** (`anthropic/claude-haiku-4.5`) pra **analisar/classificar** e **Sonnet 4.6**
(`anthropic/claude-sonnet-4.6`) só pra **escrever os rascunhos** (subconjunto menor). Construído o
script `scripts/triagem-email/triar.mjs` (Node): Gmail pelo **`gws` CLI** (não MCP — script não enxerga
MCP; `gws` tem `gmail.modify`), voz lida de `references/voz-email.md` em runtime. **Idempotente**
(`has:nouserlabels` + label-as-go → re-rodar continua) e **de-dupa** disparos repetidos por
remetente+assunto. **Decisão de design:** no lote o veredito de empresa (parceria) é pelo conhecimento
do modelo, com regra **conservadora** — na menor dúvida "indefinido" (pede briefing), **nunca** recusa
empresa grande por engano (mitiga o medo do Enzo de perder oportunidade grande); a **pesquisa ao vivo**
(`WebSearch`) fica só no modo **interativo**. Validado em dry-run (2 lotes) antes de aplicar; L2 mantido
(nada enviado). Saída em `C:/tmp/aios-triagem-email.{log,json}`. **Pendência observada:** o Pipedream do
Enzo (workflow "Categorizador Automático de Emails") está **falhando por saldo negativo** — este modo
lote do AIOS é justamente o substituto nativo.

**Update (mesmo dia, 2026-06-25) — pesquisa web real das parcerias (Google via OpenRouter `:online`, NÃO
Google Trends):** o Enzo quis que a automação **pesquise as empresas das propostas pra medir relevância**
(objetivo: criar relacionamento com **empresas grandes**). Decisão: usar **busca web** (não Trends).
**Por quê:** relevância/porte = aporte, valuation, Crunchbase, notícias, Wikipedia — o que a busca
mostra; **Google Trends mede interesse de busca do consumidor**, ruidoso pra isso (ferramentinha viral
trenda alto, B2B gigante trenda baixo) e **sem API oficial** (só libs frágeis). Mecanismo: **OpenRouter
`:online`** (`anthropic/claude-haiku-4.5:online`) — busca web embutida, reaproveita a chave, sem montar
Google Custom Search. Implementado no `triar.mjs`: pra cada parceria pesquisa a **marca** (deduplicada —
KIMI 1x, não 10), pesa **sinais de terceiros acima do marketing próprio** (gotcha: o `:online` puxou
evidência do site da própria empresa e superestimou "UltraPic" → prompt reforçado) + **fit** com o nicho.
Recomendação é **determinística no código** (`recommend()`): **recusa SÓ se "pequena"**; desconhecida/
média → **briefing**; nunca recusa empresa grande por engano. Novo modo **`--recheck-parcerias`** reavalia
as Propostas/Parcerias já rotuladas e gera **ranking de relevância** (`C:/tmp/aios-parcerias-ranking.json`,
grande→pequena com evidência+fonte). Modelos: **Haiku** classifica/pesquisa (barato), **Sonnet 4.6**
rascunha. **Alternativa registrada:** Google Custom Search JSON API (100/dia grátis) se um dia quiser
resultados Google puros — preterida pela fricção (chave + CSE) vs. o `:online` pronto.

**Update (mesmo dia, 2026-06-25) — página "Parcerias" no painel:** o Enzo quis uma página que mostre
**todas as propostas de parceria** ordenáveis por **relevância da empresa** e por **ordem cronológica**.
Feito em `painel/public/parcerias.html` (link "Parcerias" no menu lateral), servida pela rota
`/api/parcerias` (lê `C:/tmp/aios-parcerias.json`). O `--recheck-parcerias` passou a gravar esse arquivo
**por-proposta** (data via `internalDate` do Gmail + veredito/fonte da marca). A página tem toggle
Relevância/Data, filtro por veredito, busca e clique→abre no Gmail.

**Update (mesmo dia) — página agrupada por EMPRESA (1 card por empresa):** o Enzo pediu pra juntar
produtos/empresas repetidos — uma empresa que mandou N mensagens vira **1 card** (com "N×" e as mensagens
expansíveis), pra ele ver futuramente *quais empresas* o procuraram. A `parcerias.html` agora agrupa
client-side por marca normalizada (`normBrand` junta variações tipo "MiniMax"/"MiniMax Agent",
"Manus"/"Manus AI"), pega o **melhor veredito** do grupo (não rebaixa empresa por um resultado ruim),
e ordena por Relevância / Último contato / **Mais insistentes** (nº de contatos). KPIs viraram contagem
de **empresas** (não de mensagens). Validado: 84 propostas → 37 empresas. **Rede de segurança** no script
(`BIG_AI` + filtro `sparo`): corrige marca de IA conhecida mal pesquisada (a "Minimax" não pode virar a
empresa alemã de incêndio) e remove a própria Sparo da lista. Automação `triagem-email` registrada no
painel (`registro.js`). Validado: API 200 (84 propostas), `/api/panorama` intacto, página 200.

**Update (mesmo dia, 2026-06-25) — política das parcerias NÃO-grandes (agenda cheia → voltar em 4 meses):**
o Enzo decidiu que toda proposta de empresa que **não** é grande/relevante (veredito ≠ "grande": média,
desconhecida, pequena) recebe um rascunho cordial que **agradece o interesse**, diz que a **agenda de
parcerias está cheia** agora, e pede pra **entrarem em contato de novo em 4 meses, com o mês específico**
(jun/2026 + 4 = **outubro de 2026**). Novo modo `--responder-naograndes --meses 4` no `triar.mjs`:
lê `aios-parcerias.json`, filtra ≠ grande, dedupa remetente+assunto, e **atualiza o rascunho existente da
thread NO LUGAR** (`drafts.update` via `gws`, mapeando threadId→draftId) — sem criar um segundo. As
**grandes** ficam intocadas (mantêm o interesse/briefing). Mês calculado em runtime (`--meses` configurável).
Espelha idioma, na voz do Enzo. Validado em dry-run (corpo PT+EN corretos). Saída em
`C:/tmp/aios-parcerias-naograndes.json`. **L2** — nada enviado.

**BUG ENCONTRADO E CORRIGIDO (2026-06-25) — `gws drafts create` exige `userId` via `--params`:** ao rodar
o responder, descobri que `gws gmail users drafts create` precisa de `--params '{"userId":"me"}'` (não só
`--json`); sem isso retorna **400 "Required path parameter userId is missing"**. Pior: a 1ª versão do
`gws()` no `triar.mjs` **não acusava erro de API** (só checava exit≠0 sem `{`), então as criações de
rascunho do **bulk falharam silenciosamente** e foram contadas como sucesso — os "~70 rascunhos" do lote
**nunca existiram** (só os labels, que usam `modify` com `userId`, e os 6 feitos via MCP no chat). Prova:
ao re-rodar o responder corrigido, **53 de 58 foram CRIADAS** (não tinham rascunho) e só 5 atualizadas.
Correções: (1) `gws()` agora **lança erro** quando o JSON tem `.error`; (2) **toda** `drafts.create` passa
`--params '{"userId":"me"}'`. Verificado de forma independente: 58 rascunhos na conta contêm "outubro de
2026"/"October 2026". **Pendência RESOLVIDA:** modo `--rascunhos-faltantes` criou os que faltavam —
**6 parcerias grandes** (Kimi já tinha do chat; +Manus, Atoms, Virtuals Protocol, PixVerse, Genspark →
interesse, 1 por marca na thread mais recente) e varreu **Importante/Curso/Reunião** (as 25 de Importante
eram todas automação/no-reply → 0 rascunho, correto; 0 Curso/0 Reunião na janela). Verificado por threadId
na conta. Estado final dos rascunhos: 6 grandes (interesse) + 58 não-grandes (agenda cheia → out/2026),
todos reais. Brands borderline (Verdent, Abacus, TRAE, Higgsfield) caíram como "media" nesta rodada do
recheck → receberam come-back; se o Enzo quiser tratá-las como grandes, mover na mão ou ajustar `BIG_AI`.

---

## 2026-06-25 — Nome canônico do app de leads: **Lead-se**

**Decision:** O app gerador de leads construído nos Módulos 7–8 da MasterClass se chama **Lead-se**
(com hífen, "L" maiúsculo). Esse é o nome canônico a usar em **todo** material — repo AIOS e vault
Obsidian. As grafias erradas que circulavam ("Leadsie", "Leadzo", "Leadsy", "Lidse", "LEAD-SE") foram
padronizadas para *Lead-se* em todas as fontes (414 substituições em 55 arquivos + 18 colapsos de
redundância). O domínio `leadse.com.br` (sem hífen) e o e-mail `@leadse.com.br` **ficam como estão**.

**Why:** O Enzo confirmou o nome oficial. As transcrições do Whisper grafavam o nome de N formas
(erro de transcrição), o que poluía a base de conhecimento e o grafo do Obsidian com duplicatas. Um
nome único = busca confiável, sem páginas duplicadas, sem ambiguidade pro `/roteiro-aula`.

**Alternatives considered:** (a) "Leadsie" (o que o ingest tinha escolhido como canônico, por bater
com o domínio) — descartado, o Enzo definiu Lead-se. (b) Manter as variantes como *aliases* no
Obsidian — reduzido ao mínimo (só `leadse.com.br` e `Lead.se`) a pedido de eliminar as grafias erradas.

**Owner:** Enzo. Regra salva na memória `[[nome-app-lead-se]]` pra novos materiais já nascerem
com "Lead-se". Confirmar a grafia exibida na área do aluno se algum dia divergir.

---

## 2026-07-01 — App OAuth "Em produção" p/ Gmail + YouTube não expirarem mais

**Decision:** Publicar a tela de consentimento OAuth do projeto Google Cloud `aios-sparo-yt` de
**"Em teste" para "Em produção"**, e regenerar os dois tokens que tinham expirado: o
`YOUTUBE_REFRESH_TOKEN` (no `.env`) e o login do **gws** (Gmail, credenciais criptografadas em
`~/.config/gws`). Ambos os clientes OAuth ("AIOS - Sparo YT" Web + "gws CLI" Desktop) vivem no
mesmo projeto, então uma publicação resolve os dois de vez.

**Why:** O Resumo Matinal apareceu sem YouTube nem e-mail. Causa raiz: em modo **"Em teste"**, o
Google **revoga o refresh token a cada 7 dias** (`invalid_grant: Token expired or revoked`). Os dois
tokens morreram juntos por isso. Em **"Em produção"**, o token não expira mais por tempo — só morre
se ficar 6 meses sem uso (não ocorre, o brief roda diário), se a senha da conta mudar, ou se for
revogado na mão. Verificação do Google não é necessária p/ uso pessoal (o aviso "app não verificado"
é só na tela de autorização, não afeta o token já concedido).

**Também corrigido:** o `Run-DailyBrief.ps1` mascarava falha de auth do Gmail como "0 e-mails"
(o `2>$null` engolia o erro do gws). Agora detecta o `.error` do gws e loga "Gmail SEM ACESSO —
login expirou" em vez de fingir caixa vazia. O YouTube já estourava erro visível; sem mudança lá.

**Alternatives considered:** (a) Só regenerar os tokens sem publicar — descartado: quebraria de
novo em 7 dias. (b) Verificar o app no Google (privacy policy + auditoria dos escopos restritos de
Gmail) — descartado: processo pesado, desnecessário p/ 1 usuário. (c) Trocar Gmail por outro
provedor — fora de escopo.

**Owner:** Enzo. Receitas de reconexão nas memórias `[[youtube-token-renovacao]]` e
`[[gws-auth-renovacao]]`. Script novo: `scripts/daily-brief/Renovar-YouTube-Token.ps1`. Só relogar
se trocar a senha da conta agenciasparo ou revogar acesso manualmente.

---

## 2026-07-01 — Triagem de e-mail estendida à caixa de ATENDIMENTO (Zoho)

**Decision:** Replicar a lógica da triagem do Gmail na caixa de atendimento
`atendimento@sparo.com.br` (Zoho Mail), com script próprio `scripts/triagem-email/triar-zoho.mjs`.
Classifica (Haiku/OpenRouter) nas **mesmas 6 tags** que o Enzo criou no Zoho (o script descobre os
`labelId` sozinho por nome via `/labels`), **aplica a tag** (`PUT /updatemessage`) e **rascunha**
(`POST /messages` mode:draft) — **exceto Médio/Sem Importância**. L2: nada é enviado.

**Diferenças da do Gmail (decididas com o Enzo):**
- **Voz de EQUIPE/atendimento** (`references/voz-atendimento.md`), não a voz pessoal do Enzo. Assina
  "Equipe Sparo". Quando o assunto exige o Enzo (parceria, comercial, jurídico), o rascunho só avisa
  que **"já repassou pro Enzo"** — a equipe não decide. Por isso **sem pesquisa web de parceria**.
- **Reembolso:** (a) aviso **automático** de reembolso (Kiwify `naoresponder@`) → sempre **Médio**,
  sem rascunho (override determinístico no código); (b) **pedido** de reembolso de aluno real →
  **Curso** + rascunho que **agradece, pede o e-mail da COMPRA da Masterclass e pergunta o MOTIVO**
  (acolhedor). O motivo interno — entender p/ **reduzir a taxa de reembolso** — **não** vai no e-mail.
- **Por mensagem** (Zoho lista por mensagem), idempotência via seen-file
  `C:\tmp\aios-triagem-zoho-seen.json`.

**Why:** o Zoho já era lido pelo Resumo Matinal (só leitura). O Enzo criou as tags no Zoho e quis a
mesma organização/rascunho da caixa de atendimento. Caixa é quase toda suporte de curso/comunidade
(acesso, reembolso, dúvida) — encaixa direto nas categorias.

**Escopos:** exigiu **regerar o refresh token do Zoho** (mesmo Self Client, code novo) com escopo
superset: `ZohoMail.accounts.READ,messages.READ,tags.READ,messages.UPDATE,messages.CREATE`. O Resumo
Matinal segue funcionando (escopos de leitura preservados). Receita/endpoints em
`references/zoho-mail-api.md`.

**Validação (01/jul):** 8 e-mails → 4 Curso + 4 Médio, 4 rascunhos criados, **tags confirmadas** na
Inbox por leitura de volta. Escrita (UPDATE/CREATE) provada em produção.

**Alternatives considered:** (a) MCP em vez de REST — descartado: MCP não sobrevive a run agendado
(mesmo motivo do brief). (b) Reusar `triar.mjs`/`gws` — descartado: `gws` é do Gmail; Zoho tem API
própria. (c) Rascunhar na voz pessoal do Enzo — descartado pelo Enzo: é caixa de equipe.

**Corrente da manhã (encadeada, 01/jul):** o Enzo quis Gmail -> Zoho -> Resumo Matinal rodando **um após o outro**. Implementado no NÍVEL DE SCRIPT (sem depender do log de eventos do Windows, que vem desligado): o `Run-Triagem.ps1` faz Gmail (`triar.mjs`) -> encadeia `Run-Triagem-Zoho.ps1` -> e no fim dispara o **Resumo Matinal** (`Run-DailyBrief.ps1`, pop-up), MENOS com `-SemResumo` e só se a tarefa "AIOS - Resumo Matinal" estiver LIGADA (respeita o liga/desliga do painel). O **botão "Rodar triagem"** do painel (`acoes.js`) passa `-SemResumo` -> faz só as duas triagens, sem pop-up; a corrente COMPLETA é só na TAREFA agendada. **Blindagem** (via `aplicar-corrente-matinal.ps1`, admin já aplicado): "AIOS - Triagem de E-mail" = Daily 7:55 + AtLogOn + StartWhenAvailable; ambas Interactive. Pop-up do Resumo passou de 11:00 -> ~8h (fim da corrente). Descartado o encadeamento por EVENTO do TaskScheduler porque o log "Operational" vem DESLIGADO no Windows.

**Owner:** Enzo. Skill `/triagem-email` (atualizada nas duas pastas).


## 2026-07-02 — /level-up: Esteira "Próximo Vídeo" (tema + roteiro do YouTube, L2)

**Decision:** Construir a skill `/proximo-video` — a esteira que ataca o top_pain (escolher,
roteirizar): (A) minera TEMAS candidatos dos sinais reais (comentários do canal, dúvidas do
Skool — dump já pago das rodadas do /skool —, performance dos vídeos via YouTube Analytics,
ideias do Notion) e apresenta top 5 com ângulo + título provisório; (B) o Enzo escolhe um tema
OU sugere o dele; (C) a skill analisa os CONCORRENTES do tema (busca YouTube: top vídeos,
views/idade, ângulos usados) e roteiriza com a DIDÁTICA DO PRÓPRIO ENZO — extraída uma vez das
transcrições dos vídeos dele de melhor resultado e salva em `references/didatica-youtube.md`
(mesmo padrão do voz-skool.md: perfil local, custo recorrente zero); (D) o roteiro rascunhado é
criado como página no Notion (gerenciador de projetos dele, banco de vídeos a gravar).

**Method spec (3Ms):**
- **Restrição:** decidir tema + roteirizar trava a cadência de 8 vídeos/mês (prioridade 2), motor
  da prioridade 1 (R$ 70k/mês de curso).
- **EAD:** Automate. 60/30/10 = coleta de sinais determinística / ranking+roteiro com IA / escolha
  do tema e gravação manuais (julgamento e voz são do Enzo).
- **Processo:** gatilho = SOB DEMANDA ("me dá temas" / "roteiriza esse tema"); fontes = comentários
  YT + Skool + Analytics + Notion + transcrições próprias (pipeline Whisper existente); transformações
  = clusterizar dúvidas → pontuar (frequência × alinhamento com curso × performance de similares) →
  top 5; depois análise de concorrentes → roteiro na didática dele; decisões = Enzo escolhe o tema
  (IA só sugere) e revisa o roteiro; destino = Notion (página no banco de vídeos).
- **Autonomia:** L2 — Drafted. Nada é publicado; roteiro é rascunho.
- **KPI:** balde "more customers". Métricas: vídeos publicados/mês (meta 8) e tempo de
  "tema decidido → roteiro pronto pra revisar" (meta < 1h de revisão).

**Fases do build (Lego + Bike Method):** V1 (agora) = skill rodando no Claude Code, saída no chat +
Notion. V2 = página no Painel AIOS pra escolher/sugerir tema com um clique (visão final do Enzo).
Avanço de fase do Bike Method só por edição explícita do frontmatter da skill.

**Alternatives considered:** (a) FAQ vivo das comunidades e (b) rastreador de promessas — ficaram
pro backlog dos próximos /level-up. (c) Agendar a esteira semanalmente — descartado no v1 (sob
demanda primeiro, Bike Fase 1). (d) Sub-agente — descartado: workflow com IA pontual resolve.

**Owner:** Enzo. Artefato: `.claude/skills/proximo-video/SKILL.md` (+ espelho em `.agents/`).

> *Adapted from The Three Ms of AI™ © 2026 Nate Herk.*

---

## 2026-07-03 — Kit AIOS próprio pra distribuir aos inscritos

**Decision:** Criar o **"AIOS Automatize-se"** — starter kit próprio em PT-BR pra distribuir grátis
aos inscritos do YouTube. Licença **MIT © 2026 Enzo Barbatto** (mesmo modelo de credibilidade do
kit do Nate Herk), com **frameworks 100% originais** do Enzo (nomes próprios, protegidos por nota
de marca na licença) no lugar dos 3Ms/Four Cs. Kit escrito do zero — nada copiado do original.

**Why:** O kit do Nate é MIT (permite copiar, adaptar e redistribuir mantendo o aviso de
copyright), e "AIOS" é termo genérico (paper acadêmico da Rutgers de 2024, vários produtos
paralelos — pesquisa verificada em 03/07). Mas frameworks próprios com nomes próprios (a) eliminam
qualquer questão de trademark, (b) constroem a marca do Enzo em vez da do Nate, e (c) viram ativo
didático pros vídeos e pro curso. README leva 1 linha opcional de inspiração citando o AIS-OS.

**Alternatives considered:** (a) Redistribuir o kit do Nate traduzido com atribuição — permitido
pela MIT, mas constrói a marca dele, não a do Enzo. (b) Licença própria restrita — protege mais,
mas mata a vibe open-source que dá credibilidade. (c) Nome "Sparo AIOS" ou "AIOS do Enzo Sparo" —
preterido por "AIOS Automatize-se", que amarra na comunidade do Skool e no funil do curso.

**Owner:** Enzo. Artefato: pasta `kit-aios-automatize-se/` (futuro repo próprio no GitHub).
Cuidados travados: nunca distribuir a pasta do AIOS pessoal (tem segredos); não usar "AIS-OS" nem
"AI Automation Society" no marketing.


---

## 2026-07-06 — Módulo 8 fechado · projeto do Módulo 9 definido por votação · aula de WebGL cortada

**Decision:** Três decisões que destravam a reta final do curso:
1. **Módulo 8 está COMPLETO.** A live de 26/06 (auditoria de segurança) não aconteceu; no lugar,
   o Enzo gravou (~03/07) e postou a aula final "O Teste do Estranho" como Aula 9 na Kiwify
   (arquivo `[M8 A9]`), cobrindo tudo que a live abordaria: Resend/SMTP + templates de e-mail,
   conversão no estouro do limite, branding do checkout, auditoria de segurança completa (rotação
   de chaves, purge do Git, cota anti-abuso) e margem. O Lead-se está fechado como MVP.
2. **O projeto do Módulo 9 (Projeto Complexo) foi definido por votação no Skool:** "Atendente de
   WhatsApp com IA (atende + vende 24/7)" venceu com 8/19 votos (2º: automação de conteúdo, 5).
   Somadas, as variações de agente de WhatsApp levaram 9/19 — valida a decisão de 24/06 (ancorar
   o pilar de agentes no SDR de WhatsApp; o vencedor "atende + vende" embute o SDR). Módulo
   anunciado pra começar segunda 06/07.
3. **A aula placeholder "Landing Pages Imersivas com WebGL" foi CORTADA** — não passa na régua
   (não aproxima o aluno de construir-e-cobrar). Ajustar o placeholder na Kiwify.

**Why:** A régua do curso é a página de vendas (masterclass.sparo.com.br) — "agentes de IA" está
no título e era o único buraco real de conteúdo. A votação transfere a escolha do projeto pra
comunidade (engajamento) e confirma a aposta. Detalhe dos comentários: Hamilton pediu atendente
"diferenciado, fora da caixa" — o diferencial didático é o agente com ferramentas + memória
(consulta agenda/banco e AGE), não chatbot de script.

**Processo:** transcrição da aula final via pipeline Whisper local → enviada pro vault Obsidian
(`raw/`) → ingest disparado no projeto do vault. Base local atualizada: INDICE, resumo do M8 e
plano-curso.md (estrutura de 6 aulas proposta pro M9 aguardando aprovação do Enzo).

**Fila registrada:** automação de conteúdo (2º lugar, 5 votos) como candidata a projeto
bônus/aula extra pós-M9; pedido do Nathan (pagamentos/boletos Asaas pra clínica) anotado.

**Owner:** Enzo. Artefatos: `references/masterclass/plano-curso.md` (estrutura do M9) ·
`references/masterclass/modulo-08-monetizacao.md` (resumo da aula final) · fonte nova no vault.


---

## 2026-07-06 — AIOS vira produto próprio (não entra na MasterClass) · Módulo 9 reestruturado

**Decision:** Duas decisões conectadas:
1. **O AIOS será um produto próprio**, separado da MasterClass — vendido inclusive pros alunos
   atuais, com o **Kit AIOS Automatize-se** (grátis) como isca de funil. NÃO vira módulo do curso.
2. **O Módulo 9 (Projeto Complexo) foi reestruturado do zero** em cima do projeto votado —
   **Atendente de WhatsApp com IA (atende + vende 24/7)** — ignorando por completo os
   títulos-placeholder da Kiwify (WebGL, Memória de Contexto entre IAs, OAuth 2.0, "Projeto
   Complexo Partes 1–3"). Esses títulos eram só marcadores pra o aluno ver que haveria aulas; a
   estrutura ia mudar de qualquer forma. Nova estrutura: 6 aulas derivadas do que o PROJETO pede
   (agente → canal WhatsApp → cérebro/memória → conhecimento+ferramentas → atende+vende+handoff →
   produção+cobrança), com a régua de qualidade "fora da caixa" pedida pelo Hamilton na votação.

**Why:** A MasterClass vende "construir e cobrar por sistemas pra cliente" (régua: R$ 10k no
primeiro projeto). O AIOS é leverage PESSOAL — intenção de compra diferente; se fosse o capstone,
quebraria a espinha do curso e daria ao aluno um projeto que ele não sabe cobrar. Como produto
separado, o AIOS ganha funil próprio (Kit grátis → curso pago) e não dilui nenhum dos dois. O
Módulo 9 continua sendo um sistema vendável (atendente instalado num negócio, ~R$ 8k).

**Alternatives considered:** (a) AIOS como capstone do M9 — descartado (quebra a régua). (b) AIOS
como "sistema operacional pra empresa" dentro do M9 — viável (sellable), mas some o foco e explode
o escopo do último módulo; preterido por deixar o AIOS crescer como produto próprio. (c) Manter os
títulos da Kiwify no M9 — descartado pelo Enzo (eram placeholders).

**Owner:** Enzo. Artefato: `references/masterclass/plano-curso.md` (M9 reestruturado). Próximo
passo: roteirizar a aula 9.1 (validar UMA antes do lote). Produto de AIOS = escopo à parte quando
o Enzo pedir (posicionamento + funil com o Kit + outline). Relacionado ao Kit em
`kit-aios-automatize-se/`.


---

## 2026-07-06 — Módulo 9: WhatsApp via Z-API no número da empresa + aula de painel (cockpit)

**Decision (build do M9):**
1. **Conexão do WhatsApp = API não-oficial (Z-API) no número ATUAL da empresa.** Descartados: (a)
   número de teste da Meta — é americano, não passa credibilidade numa demo brasileira; (b) comprar
   número novo (eSIM etc.) — Enzo não quis. A Cloud API oficial + coexistence fica registrada como
   o "upgrade profissional" (selo + escala), mas não entra na gravação por adicionar etapas de BSP.
2. **Entra uma aula de PAINEL (cockpit) — nova 9.6**, empurrando produção pra 9.7 (M9 vira 7 aulas).
   O painel é a tela onde o dono vê conversas/leads/agendamentos em tempo real e ASSUME o lead
   quente (o handoff ganha casa). É o que o cliente VÊ e o que justifica os R$ 8k; reusa CRM (M3) +
   app (M5/M7); é a visão por cima do dado que o agente já grava no Supabase desde a 9.3.

**Why:** número real brasileiro = credibilidade na demo, e é o que o Enzo já tem montado (pasta
`Z-API`). Pesquisa web (jul/2026) desmentiu o medo do coexistence: setup é de minutos e já vale no
Brasil — o "leva semanas" era confusão com a verificação de empresa da Meta. Meta PERMITE agentes
de IA de atendimento/vendas (só baniu chatbot genérico sem propósito), então o projeto está dentro
das regras. Ressalva a ensinar: na entrega ao cliente, usar número DEDICADO ao robô (não a linha
principal), porque API não-oficial tem risco de banimento e a Meta apertou a detecção em 2026.

**Owner:** Enzo. Artefato: `references/masterclass/plano-curso.md` (M9 = 7 aulas). Fontes da
pesquisa registradas na conversa (ycloud/chakrahq sobre coexistence; z-api/wehsoft sobre banimento
de API não-oficial em 2026).


**Correção (mesmo dia, 06/07):** a entrada acima inverteu a ordem. O correto é: ensinar a **API
oficial PRIMEIRO** (Cloud API + coexistence) no **número ATUAL da empresa** — rota profissional e
segura; e a **API não-oficial (Z-API) DEPOIS** num **número COMPRADO só pra isso** (chip pré-pago
ou eSIM de operadora real, dedicado ao robô), pra um bloqueio não derrubar o número da empresa. A
aula 9.2 ensina as duas rotas nessa ordem. Número virtual/VoIP "SMS online" fica de fora (mais
banimento). O número de teste da Meta (gringo) segue descartado por falta de credibilidade no BR.


---

## 2026-07-06 — Módulo 9 reavaliado: cérebro antes do canal, conexão via Claude Code, VPS, teste automático

**Decision (refinamentos do M9, após reavaliação):**
1. **Ordem "cérebro primeiro".** Reordenado: montar e TESTAR o cérebro do agente num sandbox
   (persona + memória, conversando com ele) ANTES de conectar o WhatsApp. Motivo: "uau" cedo e
   sem fricção de infra; provar o motor na bancada antes da rua. WhatsApp desce pra 9.4.
2. **Conexão: oficial é o foco/recomendada; não-oficial é mostrada rápido.** A escolha oficial ×
   não-oficial NÃO é um toggle no app do cliente — é decidida **conversando com o Claude Code**
   (pra trocar, o aluno pede no chat e a IA refaz a integração). Oficial (Cloud API + coexistence)
   no número da empresa; não-oficial (Z-API) num número comprado dedicado.
3. **Hospedagem = VPS da Hostinger** (não Railway). Motivo: agente é 24/7 → VPS flat é mais barata
   que Railway metered, e cabem VÁRIOS clientes numa VPS só (margem alta pro aluno-agência). Railway
   fica como deploy rápido inicial. Casa com o bônus de n8n (VPS Hostinger, cupom SPARO10).
4. **Teste do agente = automático.** Aula de produção (9.7) ensina o Claude Code a gerar um
   "cliente chato" simulado que dispara dezenas de conversas difíceis e entrega o relatório de
   onde o agente quebrou (IA testando IA) — o Teste do Estranho do M8 aplicado à conversa.

**Why:** cérebro-primeiro é melhor didática (momentum + de-risca infra); a troca de rota via chat
reforça o ethos "você constrói conversando com a IA"; a VPS vira parte da história de margem do
M10; e teste automático ataca a habilidade nº 1 de quem faz agente (ele quebra na CONVERSA, não no
código). Tudo aprovado pelo Enzo nesta sessão.

**Owner:** Enzo. Artefato: `references/masterclass/plano-curso.md` (M9, 7 aulas reordenadas).
Próximo passo: roteirizar a 9.1 (validar UMA antes do lote).


---

## 2026-07-06 — Módulo 9 reavaliado (2ª rodada): áudio/imagem, reaproveitável por cliente, ajustes

**Decision (M9 vira 8 aulas):**
1. **Nova aula 9.4 "Os sentidos do agente: áudio + imagem".** No Brasil o cliente manda ÁUDIO o
   tempo todo — atendente que só lê texto ignora metade das mensagens e volta a ser genérico. O
   agente passa a TRANSCREVER áudio (Whisper — pipeline do Enzo já existe) e LER imagem (visão),
   antes de responder; opcional responder em áudio. É o maior diferencial pro mercado BR e o "uau"
   do módulo. Fica no sandbox (dá pra testar com arquivo de áudio antes do WhatsApp).
2. **Reaproveitável por cliente (na 9.8).** Persona, base de conhecimento, catálogo e número como
   DADO (não código chumbado) → subir cliente nº 2 é reconfigurar, não reconstruir. Sustenta a
   história de margem "vários clientes numa VPS". Semente na 9.3, explícito na 9.8.
3. **Ajustes menores:** (a) 9.6 sinaliza que "agendar de verdade" puxa Google Calendar via OAuth
   (pedaço técnico de peso, não detalhe); (b) regra de ouro "não inventar" na 9.3 (responde só da
   base de conhecimento) e testada na 9.8.

**Nova ordem (8 aulas):** 9.1 agente+desenhar · 9.2 cérebro sandbox (persona+memória) · 9.3
conhecimento+ferramentas (+não inventar, tudo é dado) · **9.4 sentidos áudio+imagem** · 9.5
conectar WhatsApp+host · 9.6 atende+vende (+Calendar/OAuth) · 9.7 painel/cockpit · 9.8 testar
quebrando + reaproveitar + produção + cobrar.

**Why:** o Enzo pediu "o melhor sistema de atendimento possível" — áudio/imagem é o que separa um
atendente brasileiro de verdade de um genérico, e ele já tem o Whisper; reaproveitável é o que faz
o projeto virar SERVIÇO escalável (não um bot único), fechando a régua R$10k/margem. Tudo aprovado.

**Owner:** Enzo. Artefato: `references/masterclass/plano-curso.md` (M9, 8 aulas). Próximo passo:
roteirizar a 9.1 (validar UMA antes do lote).


---

## 2026-07-06 — M9: foco travado (serviço c/ agendamento) · hosting no fim via túnel · transcrição por API

**Decision (mais 3 refinamentos do M9):**
1. **Foco = negócio de serviço local com agendamento** (salão, clínica, barbearia, estética),
   escolhido pelo Enzo. Motivo: é o único nicho que usa TODOS os diferenciais de uma vez (áudio
   pra marcar + agenda real/OAuth + qualificação + lembrete), é a venda mais fácil pro aluno leigo
   (dor de no-show, ROI óbvio, R$8k defensável) e o mais replicável. Ecommerce/B2B ficam como
   variações que o aluno adapta (arquitetura reaproveitável da 9.8). Define persona + base de
   conhecimento + prompts das 8 aulas.
2. **Hospedagem sai do meio pro fim.** Na 9.5, conecta o WhatsApp ao agente rodando LOCAL via
   **túnel** (ngrok/Cloudflare Tunnel) — itera rápido sem servidor. A **VPS da Hostinger** só entra
   na 9.8 (produção/entrega). Mesmo padrão do curso (testa local, publica no fim).
3. **Transcrição de áudio NÃO é o Whisper local.** O agente roda numa VPS SEM GPU, então o Whisper
   local (GPU do Enzo, pros vídeos do curso) não serve. Usar API: recomendado **modelo multimodal
   (Gemini)** que entende áudio E imagem num call só; alternativa Whisper via API (Groq/OpenAI).
   **Wispr Flow não serve** (é ditado por voz no PC, não API que o bot chama).

**Why:** foco concreto = prompts e base de conhecimento afiados (agente genérico demonstra mal);
túnel-primeiro de-risca a infra e casa com o fluxo do curso; e a pegadinha da VPS-sem-GPU exige API
de transcrição (o Enzo levantou isso sozinho). Tudo aprovado.

**Owner:** Enzo. Artefato: `references/masterclass/plano-curso.md` (M9, 8 aulas). Próximo passo:
roteirizar a 9.1 com o exemplo concreto do nicho de agendamento.


**Correção (mesmo dia, 06/07):** cortado o túnel (ngrok) da 9.5 — era complexidade à toa pra leigo.
No lugar, **deploy no Railway com `git push`** (o que o aluno já aprendeu no Lead-se) pra dar a URL
pública do webhook; a **VPS da Hostinger** continua só na entrega (9.8), pra rodar barato 24/7.


**Correção (mesmo dia, 06/07):** cortado o "Railway depois VPS" — publicar 2x não vale num 1º
projeto. O aluno **fica no Railway** o M9 inteiro (dev + entrega do 1º cliente). A **VPS** vira só
NOTA de crescimento ("quando tiver vários clientes, migra pra baratear") — coerente com o M8
(Railway caro pra escalar → VPS quando cresce). Escolher UM host e ficar é como as pessoas fazem.


---

## 06/07/2026 — Roteiro completo do Módulo 9 gerado (8 aulas)

**Decisão:** roteiro de gravação das 8 aulas do M9 fechado em
`references/masterclass/roteiro-modulo-09-atendente-whatsapp.md`, no formato do
`aulas-finais-script.md`. Processo: 9.1 escrita primeiro e validada pelo Enzo (Bike Method), com 3
correções dele: (a) a IA gera o MODELO da base de conhecimento e a CLÍNICA preenche a verdade —
nunca pedir pra IA inventar dados do negócio (exemplo fictício: Clínica Renove Estética, em
`exemplo-clinica-estetica-base-conhecimento.md`); (b) ordem da aula = conceito → porquê → prompt →
prática (o prompt nunca abre a aula); (c) abertura com a PROMESSA do módulo logo depois do vilão
("constrói, instala e cobra ~R$ 8 mil"), com teaser do sistema pronto se possível. As 9.2–9.8 foram
geradas em paralelo nesse mesmo padrão (workflow multi-agente) + verificação de consistência que
apontou 6 problemas, todos corrigidos (continuidade do preço R$ 180, tabela de leads no Supabase do
próprio projeto, seção Promoções no modelo da 9.1, cabeçalhos de prompt, escopo do prompt da 9.5).
Rascunho antigo da 9.1 movido pra `archives/`.

**Por quê:** validar UMA aula antes do lote garantiu que as 7 restantes já nascessem no padrão
aprovado — em vez de 8 rodadas de correção, uma só.


**Correção (mesmo dia, 06/07):** o nome da clínica fictícia do M9 mudou de "Clínica Renove Estética"
pra **"Clínica Renov Estética"** (sem o "e"), a pedido do Enzo. Atualizado no roteiro, no exemplo
preenchido e no INDICE.


---

## 2026-07-07 — Kit AIOS v2: reconstruído do zero, simples estilo Nate Herk

**Decision:** O Kit AIOS Automatize-se foi **reconstruído do zero** — o Enzo achou a v1 (Método
GIRO + Raio-X) complexa demais pra leigo. A v2 segue o estilo fácil do kit do Nate: responder 7
perguntas uma vez + 3 skills, e acabou. Decisões travadas nesta sessão:

- **Skills:** `/iniciar` (onboarding), `/analisar` (nota) e `/evoluir` (1 automação/semana) —
  verbos no infinitivo (padrão de botão BR); `/evoluir` escolhido no lugar de `/automatizar`
  porque carrega a ideia do "level-up" (evoluir o AIOS, não só automatizar tarefa).
- **Frameworks (marcas do Enzo):** **Método 3A** (Anotar → Avaliar → Automatizar) e **Boletim
  do AIOS** (4 notas de 25 = 0 a 100; faixas Começando / Ajudando / Entregando / Voando).
  Vocabulário total do kit: esses 2 nomes e mais nada (v1 tinha ~8 termos: pepita, peso,
  escala de confiança etc. — tudo aposentado ou virou frase comum).
- **Narrativa:** só o bordão "Não é um chat. É um contratado." na capa do README; o resto do
  kit fala direto, sem a metáfora do funcionário.
- **LICENSE:** MIT pura (© 2026 Enzo Barbatto), SEM a nota de marcas dentro — pro GitHub
  detectar e exibir o selo "MIT License" (o repo do Nate mostra NOASSERTION por ter poluído o
  LICENSE). A nota de marcas vive só no README.
- **Arquivo de candidatas:** `tarefas.md` ("tarefas repetidas"), sem metáfora de garimpo.

**Why:** o público do kit é leigo total; a v1 exigia decorar duas metáforas e oito termos antes
de usar. Regra da v2: a complexidade mora na skill (o AIOS faz a conta e recomenda), não no
vocabulário. Pesquisa de 06/07 no GitHub confirmou o posicionamento: o formato "kit de método
sem código" é o nicho do Nate (915★/285 forks em 2 meses), sem nenhum player em PT-BR.

**Alternatives considered:** (a) manter GIRO/Raio-X e só simplificar — o Enzo preferiu recomeçar;
(b) skills em inglês iguais às do Nate (/onboard, /audit, /level-up) — permitido (nome de comando
não tem dono), mas preterido por verbos PT-BR; (c) sem frameworks nomeados — descartado: perderia
a marca própria, que foi o motivo da licença com o nome dele.

**Owner:** Enzo. Artefatos: `kit-aios-automatize-se/` (v2) · v1 arquivada em
`archives/kit-aios-v1-giro-2026-07-07/`. Pendências pra publicar: confirmar grafia
Barbatto/Barbato, conferir links do README, criar o repo GitHub com topics.


**Update (mesma noite, 06-07/07) — v2.1: sem ritual semanal + nota por idade.** Dois pedidos
do Enzo pra afastar o kit do esqueleto do Nate (ritual semanal + prova de 100 pontos absoluta):

1. **`/evoluir` virou `/automatizar`, sob demanda.** Sem dia certo: quer automatizar mais um
   processo, digita `/automatizar` — com ou sem tarefa em mente (sem ideia, a skill puxa a
   melhor de `tarefas.md`). Método 3A reformulado de ciclo semanal pra receita de cada rodada.
   Pitch do vídeo: "investindo um tempo, em um mês você tem um funcionário com ~5 automações
   fazendo o trabalho do SEU jeito".
2. **Boletim agora cobra PELA IDADE do AIOS.** O `/iniciar` grava a certidão de nascimento no
   CLAUDE.md ("**AIOS criado em:** AAAA-MM-DD", data do ambiente; re-rodar não reseta). O
   `/analisar` calcula a idade e compara com a régua de crescimento: dia 0-6 contexto completo;
   dia 7 +1 ferramenta +1 automação; dia 14 +2ª/3ª automações; dia 21 +4ª e 1 rodando sem
   aprovação; dia 30 = 5 automações + rotina agendada; depois, manutenção + 1 nova/mês.
   Nota 100 = "em dia com a idade" (nunca pune por ser novo — o que a idade não cobra vale
   ponto cheio; recém-nascido bem configurado já nasce Em dia). Faixas novas: Atrasado (0-40) /
   Correndo atrás (41-70) / Quase em dia (71-90) / Em dia (91-100) + selo ⭐ Adiantado pra quem
   passou do esperado. Faixas antigas (Começando/Ajudando/Entregando/Voando) aposentadas.

## 2026-07-07 — M9: lembrete entra na 9.6 + verificação da Meta vira dever de casa da 9.1

**Decision:** duas correções de conteúdo no roteiro do M9 (`roteiro-modulo-09-atendente-whatsapp.md`
+ `plano-curso.md`). (1) O **lembrete** pós-agendamento — prometido no foco do módulo ("áudio pra
marcar + agenda real + qualificação + lembrete") mas sem aula que o construísse — agora é construído
na **9.6**: bullet próprio, prompt 3 (template aprovado da API oficial, o caso real da janela de 24h
explicada na 9.5), passo 9 na gravação e item no checklist final. Com isso a 9.6 fica densa (funil +
OAuth da agenda + lembrete) e ganha a mesma nota da 9.5: **pode virar 2 vídeos**. (2) A conta de
desenvolvedor da Meta + **verificação do negócio** (espera de dias) viram **dever de casa no fim da
9.1**, junto com o envio da base pro cliente preencher — o que depende de terceiros dispara na
primeira aula. A **ordem das aulas não muda** (cérebro antes do canal); só a burocracia anda em
paralelo, e a 9.5 continua sendo onde se conecta.

**Why:** lembrete órfão quebrava a promessa do módulo; e um aluno que só descobre a verificação da
Meta na 9.5 trava dias no meio do módulo — momentum é o que mais mata conclusão de curso.

**Alternatives considered:** (a) cortar o lembrete da promessa — descartado, é diferencial real
(menos falta = agenda cheia de verdade); (b) mover a conexão inteira do WhatsApp pra cedo —
descartado, reintroduz a fricção que a estrutura evitou de propósito ("conectar cedo só adianta a
parte chata e atrasa o uau").

**Owner:** Enzo. Nota de gravação: o roteiro antigo da 9.1 avulsa já está em
`archives/roteiro-modulo-09-aula-01.md`; gravar SEMPRE pelo consolidado.

**Update (07/07, mesma conversa):** o fecho da 9.1 subiu de "dever de casa recomendado" pra
**demonstração na tela**: o Enzo cria a conta de desenvolvedor da Meta ao vivo e dispara a
verificação do negócio, explicando que é pra adiantar um processo que pode levar dias — quanto
antes dispara, mais rápido o aluno finaliza o projeto. Roteiro (tópico, aprendizado 4º, passo 9,
com nota de gravação sobre dados pessoais na tela) e plano-curso atualizados.

**Update 2 (07/07):** regra pedagógica cravada pro M9 — **nenhuma chave/conta/configuração nasce
fora das câmeras**: o aluno vê tudo ser criado em aula. Faltavam três e entraram no roteiro: a
chave do modelo (Anthropic) virou o passo 5 da 9.2 (com nota de segurança: borrar/revogar), o
link de pagamento ganhou demonstração no passo 4 da 9.6 (criar link de teste na tela), e a 9.5
passou a responder "e quem não tem cliente?" (chip/eSIM próprio no WhatsApp Business). O
"checklist pré-gravação" deixou de existir como lista fora de aula — virou mapa de onde cada
configuração aparece + materiais de cena (página do Notion do pacote M9 atualizada).

## 2026-07-13 — Rodapé de e-mail único (marca Sparo), em duas variantes de voz

**Decision:** um único design de assinatura de e-mail pra Sparo, guarda-chuva das duas frentes
(curso + agência), em duas variantes do mesmo layout: **Enzo Barbatto** (Gmail pessoal, com foto)
e **Equipe Sparo** (Zoho atendimento@, sem foto pessoal — monograma "S", coerente com a voz de
equipe da caixa). Paleta e tagline tiradas de links.sparo.com.br (#FF6633 / "Automação com IA,
sem escrever código"). Arquivos em `references/rodape-email/` (assinaturas + README com passo a
passo e regras de manutenção).

**Why:** a mesma caixa atende aluno e cliente de agência — dois rodapés diferentes no mesmo
endereço criam inconsistência; rodapé identifica, não vende (a segmentação fica no corpo do
e-mail, que a triagem já personaliza); e mostrar as duas frentes como links nomeados (Curso ·
Sparo Automações) faz venda cruzada passiva nos dois públicos.

**Alternatives considered:** (a) dois rodapés distintos por público — descartado: risco de o
rascunho sair com o errado e manutenção dupla; (b) CTA segmentado por categoria da triagem —
fica como evolução futura se fizer falta; o motor de rascunhos já saberia escolher a variante.

**Owner:** Enzo — instalar no Gmail (variante Enzo) e no Zoho (variante Equipe); os rascunhos da
triagem não embutem rodapé, o cliente de e-mail anexa no envio. Nota: a foto do rodapé é servida
por links.sparo.com.br/foto.jpg (Railway) — se o serviço cair, a foto some do rodapé.

## 2026-07-17 — Pedro aceito na equipe: Gerente de Conteúdo e Automação (CLT)

**Decision:** contratar o Pedro como **Gerente de Conteúdo e Automação**, CLT, início em
**30/07/2026** (junto com a conclusão da migração MEI→ME). Meses 1–2 em meio período
(art. 58-A, 25h/sem — 4h seg–sex + 5h sáb, compatível com a reta final do estágio dele);
a partir de 30/09/2026, tempo integral 40h com salário de **R$ 3.520** (proporcional exato
de R$ 2.200 do parcial). Remuneração variável **na folha, como prêmio (art. 457 §4º)**:
prêmio de produção por vídeo longo (R$ 70–170 conforme duração/complexidade; 8–12 vídeos/mês;
Reels e criativos dentro do expediente) + prêmio por resultado sobre a receita líquida Kiwify
(45k→1.000 · 65k→2.000 · 85k→3.500, maior patamar, tabela por ciclo semestral). Potencial
~R$ 9.000/mês. Reavaliação de fixo e prêmios na virada da Fase 3 (~30/11/2026). Exclusividade
de nicho + confidencialidade (2 anos); PI só no contrato. Docs em `equipe/`
(Carta-Oferta-Pedro.pdf aceita na call de 17/07; Contrato-Trabalho-Pedro.pdf gerado como
minuta pra revisão do contador).

**Why:** Pedro criou o estilo de edição do canal e estava prospectando concorrentes por falta
de previsibilidade; a proposta converte a relação freela (~R$ 2.000/mês) em carreira com piso
maior, produção premiada e trilha de especialização em automação — que é o que ele pediu.
CLT único formato (PJ por fora foi VETADO: salário por fora + MEI não pode faturar contra o
próprio empregador). Custo pra empresa (Simples): ~R$ 3.900–8.400/mês nos meses 1–2 e
~R$ 5.650–10.200 do 3º mês, sempre ~8–12% da receita líquida nos cenários de meta.

**Alternatives considered:** (a) manter freela por vídeo — não segura exclusividade nem cria
braço direito; (b) PJ mensal — jornada fixa de quase-gerente é vínculo disfarçado; (c) cargo
amplo "Gerente da Marca" com Sparo/atendimento — descartado pra focar crescimento; (d) 40% do
AdSense como variável — vetado (métrica que ele não controla, otimiza pro alvo errado).

**Owner:** Enzo — até 30/07: preencher os campos do contrato (razão social, CNPJ, CPF,
endereços, foro), revisar com o contador, admissão no eSocial + **ASO admissional**, assinar
via gov.br/Autentique. Contador: prêmios como prêmio 457 §4º (nunca "comissão") e checar
Fator R (folha ≥28% da receita → Anexo III no DAS).

## 2026-07-21 — M9: mudança de preço do WhatsApp e o Meta Business Agent no fecho do módulo

**Decision:** fechar o Módulo 9 com a arquitetura de agente PRÓPRIO (Cloud API/Z-API) e tratar o
**Meta Business Agent (MBA)** apenas como **segmento final da 9.8** (~5 min, conceito + conta +
promessa), sem demo — porque o MBA ainda não foi liberado para a conta do Enzo. A promessa gravada
em vídeo: quando a Meta liberar, sai um **vídeo bônus (aula 9.9)** mostrando o MBA na prática.
Nada do módulo fica bloqueado esperando a Meta.

**Fatos confirmados na documentação oficial (developers.facebook.com/documentation/meta-business-agent):**
01/08/2026 o MBA passa a ser cobrado **por token** (US$ 2,00/1M, ~R$ 0,22-0,28 por resposta);
01/10/2026 as mensagens de serviço **dentro da janela de 24h deixam de ser grátis** (valor do Brasil
só sai até 01/09). A **janela de 24h NÃO acaba** — segue como regra de permissão. **Não há cobrança
dupla**: quem responde define a categoria ("Meta applies one charge for Meta Business Agent
messages") — MBA = só token; agente próprio ou humano = só tarifa por mensagem. As **72h do
Click-to-WhatsApp seguem isentas de tarifa por mensagem**, o que favorece o agente próprio (responde
sem tarifa nessa janela) e não beneficia o MBA (token não tem isenção).

**Why:** o medo inicial era "o agente ficou obsoleto". A conta diz o contrário: agente próprio
≈ R$ 0,05-0,10 por resposta contra ≈ R$ 0,22-0,28 do MBA. Além disso o MBA só atende 5 verticais
com aprovação da Meta, guarda os dados, não dá painel próprio nem escolha de modelo — e seus
**Connectors exigem uma API do negócio que a clínica não tem**: construir essa API é exatamente o
serviço que o módulo ensina a cobrar. A Meta entrar no jogo VALIDA a tese e educa o mercado.
Na aula, ensinar **onde consultar o preço** (não decorar o número) é o que impede o vídeo de
envelhecer em outubro.

**Alternatives considered:** (a) abrir o MBA como rota construível na 9.5 — descartado: sem acesso
à conta, viraria aula teórica, e comparar plataformas no meio da construção confunde o aluno;
(b) criar uma aula inteira só do MBA agora — descartado pelo mesmo motivo e porque alonga um módulo
já grande; (c) ignorar o assunto — descartado: o aluno vai ouvir falar de qualquer jeito, melhor
ouvir do Enzo com a conta na mão.

**Owner:** Enzo — gravar 9.5 (com a tabela de preços na tela), 9.6, 9.7 e 9.8 (com o segmento
final do MBA). Roteiro atualizado em `references/masterclass/roteiro-modulo-09-atendente-whatsapp.md`
e na página Notion homônima (sincronizados 21/07). Rever o valor BR da tarifa de serviço quando a
Meta anunciar (até 01/09).

## 2026-07-21 — M9: Z-API vira aula própria (penúltima) e a 9.5 ganha versão de gravação em toggles

**Decision:** (1) a rota NÃO-oficial (Z-API) saiu completamente da 9.5 — que ficou 100% API
oficial — e virou **aula própria, a penúltima do módulo** (entre a 9.7 e a 9.8), com conta de
custo na tela, regra do número comprado e a troca de camada como demonstração. (2) A 9.5 ganhou
uma **versão de gravação em tópicos clicáveis** (página filha no Notion, "🎬 9.5 — Guia de
gravação"): a ordem em 7 linhas curtas + os detalhes dentro de toggles — o roteiro completo vira
referência, não teleprompter.

**Why:** (1) misturar as duas rotas na 9.5 confunde o aluno em plena construção; com a cobrança
por mensagem da oficial (01/10), a não-oficial virou decisão de CUSTO que rende aula própria — e
trocar de rota com o sistema completo é a prova final de que canal é camada. (2) O roteiro
detalhado ficou longo demais pra ler durante a gravação; o formato toggle dá a ordem de bate-olho
e o detalhe sob demanda.

**Owner:** Enzo — gravar a 9.5 pela página de toggles (com o Guia clique a clique do painel da
Meta aberto do lado). Replicar o formato toggle pras próximas aulas se funcionar bem na 9.5.

## 2026-07-21 — Coexistence só via parceiro: correção ao vivo na 9.5 + pauta "Sparo Provedor de Tecnologia"

**Decision:** confirmado NA PRÁTICA durante a gravação da 9.5: o painel DIY da Meta NÃO oferece
conectar número existente do app WhatsApp Business (coexistence) — o fluxo é exclusivo de
plataformas parceiras/Provedores de Tecnologia, e número que vive no app fica "Offline" na WABA
(rodar /register nele DERRUBARIA o app do celular — quase aconteceu com o número real da Sparo,
+55 21 96402-8125, que vive no celular). Decisões: (1) a 9.5 demonstra com **chip dedicado** e
ensina coexistence como conceito+decisão; (2) como o Enzo prometeu coexistence em take já gravado,
a solução é a **correção ao vivo no passo 8** (fala roteirizada — "descobri na prática que é via
parceiro") em vez de regravar; (3) **PAUTA PÓS-MÓDULO: Sparo virar Provedor de Tecnologia** —
destrava o Embedded Signup próprio (conectar número de cliente COM coexistence, sem derrubar o
app), vira o método de entrega do serviço de R$ 8k em cliente real E o vídeo bônus do coexistence
no módulo (mesmo padrão da promessa do MBA).

**Why:** regra da Meta, comprovada em tela; a correção ao vivo preserva as gravações e combina com
a didática do Enzo (mostrar o problema e resolver na tela). Provedor de Tecnologia é estratégico
além do curso: é como a Sparo conecta o número real dos clientes.

**Owner:** Enzo — gravar a correção + chip agora; iniciar cadastro de Provedor de Tecnologia
depois do módulo (verificação da empresa já ✅; falta app review — leva dias).

## 2026-07-24 — M9: rota não-oficial vira 2 aulas AGORA (A7+A8) com WAHA; penúltima Z-API morre

**Decisão:** depois da A6 (9.5 — WhatsApp oficial, gravada 21–23/07), as duas próximas gravações
são: **A7 — "API oficial vs API não-oficial"** (conceito + preços da oficial e mudanças de 2026 +
conta comparativa + risco, sem construir nada) e **A8 — conectar o agente na API não-oficial com
WAHA** (self-hosted/open-source, container no próprio Railway — a ferramenta deixa de ser Z-API).
Depois o módulo segue normal: 9.6 (regra de ouro + funil) → 9.7 (painel) → 9.8. A "aula Z-API
penúltima" (decisão de 21/07) deixa de existir como posição — o conteúdo foi absorvido pelas duas
novas aulas.

**Why:** o fecho gravado da A6 promete "na próxima aula: todos os preços, as mudanças de 2026 e a
API não oficial" — gravar a comparação AGORA honra a promessa em vídeo. WAHA em vez de Z-API tira
a mensalidade de terceiro da conta (flat SaaS → custo de hospedagem própria). Ajuste no conteúdo
herdado: sem referências ao painel da 9.7 (ainda não existirá) e regra do número dedicado mantida
(o chip da Salve da A6 já cumpre).

**Owner:** Enzo — gravar A7 e A8; AIOS mantém roteiro local anotado (Notion pendente de
autorização do conector pra sincronizar).

---

## 2026-08-17 — AIOS Sparo vira produto PAGO: kit deixa de ser grátis (reverte 03/07 e parte de 06/07)

**Decision:** O **Kit AIOS Automatize-se** deixa de ser distribuído grátis e vira o núcleo do
produto pago **"AIOS Sparo — Automatize todo o seu negócio sem saber programação"**:

1. **Preço:** R$ 600 o AIOS Sparo sozinho; **bundle R$ 800** com a MasterClass completa de
   Claude Code + Antigravity (R$ 1.000 separado → 20% off). **Alunos atuais da MasterClass
   ganham o desconto** (entram pelo bundle).
2. **O comprador recebe SOMENTE o kit** (`kit-aios-automatize-se/`) pra montar o AIOS dele do
   zero — nunca o AIOS pessoal do Enzo, nem `.env`, tokens ou scripts privados.
3. **Distribuição:** ZIP na área de aluno (Kiwify), não mais GitHub público. README reescrito
   (sem "Code → Download ZIP") e **licença trocada de MIT → licença de uso proprietária**
   (uso pessoal, sem redistribuição). Nomes "Método 3A" e "Boletim do AIOS" seguem como marcas.
4. **Lançamento:** vídeo do YouTube sobre o AIOS no padrão do canal (prática → teoria →
   começar do zero com o kit), com a oferta no final.

**Why:** O AIOS já era produto próprio separado da MasterClass (decisão de 06/07); o Enzo
decidiu monetizá-lo diretamente em vez de usar o kit como isca grátis — o kit É o produto.
MIT permitiria a qualquer comprador redistribuir de graça legalmente, o que mataria a venda;
como o repo público ainda não tinha sido criado, a troca de licença sai limpa, sem versão MIT
em circulação.

**Alternatives considered:** (a) Kit grátis como isca + curso pago só com a implementação
guiada — descartado pelo Enzo: quer cobrar pelo AIOS em si. (b) Manter MIT e cobrar só pela
conveniência — descartado: sem exclusividade legal, o produto vaza.

**Owner:** Enzo. Pendências antes do vídeo: subir o produto na Kiwify (R$ 600 + bundle R$ 800
+ cupom/oferta pros alunos atuais) e empacotar o painel em .exe com segredos blindados
(rclone.conf tem token do Drive) antes de mostrar em tela.

## 2026-08-19 — Público-alvo do AIOS MasterClass: operador solo (primário) + futuro dono de agência (secundário)

**Decision:** A comunicação do AIOS MasterClass mira o **operador solo** — quem toca um negócio
(ou vida profissional) inteiro sozinho: criador de conteúdo, dono de agência pequena, consultor,
corretor, prestador de serviço, dono de PME sem equipe estruturada. Segundo público (linha de
argumento própria, ponte pro combo): **futuro dono de agência de automação**, que compra pra
aprender o modelo e replicar como serviço. Funcionário CLT vira público **terciário** — atendido
no FAQ, sem diluir a mensagem principal.

**Why:** (1) Autonomia total sobre as ferramentas — o AIOS só rende conectado a Gmail/WhatsApp/
agenda/financeiro, e só o dono conecta tudo sem pedir permissão; CLT esbarra em TI e compliance.
(2) A dor certa — o valor do AIOS é centralizar operação dispersa, e quem mais sofre dispersão é
quem faz venda, atendimento, conteúdo e financeiro no mesmo dia. (3) Espelho do Enzo — o produto
é o AIOS que ele usa pra tocar a Sparo, e a audiência do YouTube se vê nele.

**Impacto:** copy da página de vendas (v7 do site refeita nesse ângulo — "Você faz tudo sozinho.
Até agora." / primeiro contratado), temas de vídeo, e futuramente o roteiro do curso do kit.

**Owner:** Enzo. Artefato: `scripts/aios-masterclass-site/index-v7-solo.html`.

## 2026-08-20 — Estrutura do AIOS Sparo na Kiwify: 1 área de membros, 3 grupos, 2 checkouts novos

**Decision:** O AIOS Sparo entra na Kiwify como **produto separado** ("AIOS Sparo"), apontando pra
**mesma área de membros** da MasterClass ("MasterClass de Automação e Apps (No Code)"). Nada de
área nova. O recorte de acesso é por **grupo**:

| Oferta | Preço | Grupo | Vê |
|---|---|---|---|
| MasterClass (produto antigo) | R$ 400 | Grupo A (padrão) | CC+AG + N8N |
| AIOS Sparo | R$ 599,90 → https://pay.kiwify.com.br/PglnPoI | AIOS Sparo | só AIOS Masterclass (3 módulos) |
| Bundle AIOS | R$ 799,90 → https://pay.kiwify.com.br/eSF1x8A | AIOS Bundle | os 3 cursos |

Alunos atuais (701, pagaram R$ 400) **não** recebem o AIOS — Grupo A fica sem o curso marcado.
Testado em 20/08 com aluno fictício nos grupos AIOS Sparo e AIOS Bundle: acesso correto nos dois.

**Why:** uma área só evita duplicar upload/personalização e mantém o aluno num login; produto
separado dá relatório de vendas, afiliados e página próprios pro lançamento do AIOS.

**Gotchas aprendidos:** (1) oferta se cria em Produto → Geral → Preços ("Esse produto tem diferentes
ofertas"); a aba Links só lista. (2) Uma oferta só pode estar em 1 grupo — se não aparece na lista
do grupo, está presa em outro (lixeira lá primeiro). (3) A aba **Vendas** do curso ("Permitir a
compra pela área de membros") cria um grupo automático com nome/curso travados e oferta que não
exclui — foi desligada; o grupo órfão "AIOS Masterclass" ficou sem oferta e é inofensivo.
(4) Oferta fantasma "AIOS Masterclass R$ 799,90" no produto antigo: desativar em Links.

**Owner:** Enzo. Site aios.sparo.com.br atualizado com os 2 links no mesmo dia.

## 2026-08-20 — Preços finais do AIOS MasterClass: R$ 499,90 / R$ 799,90 / R$ 599,90

**Decision:** MasterClass Antigravity + Claude Code = **R$ 499,90** · Combo AIOS + MasterClass =
**R$ 799,90** · AIOS MasterClass sozinho = **R$ 599,90** (substitui os R$ 400/800/600 redondos
usados no planejamento). Economia anunciada no combo passa a **R$ 299,90** (499,90 + 599,90 − 799,90).
Preços "cheios" riscados na promoção de lançamento seguem R$ 997 (cada curso) e R$ 1.994 (combo)
até o Enzo definir outros.

**Owner:** Enzo. Artefato: `scripts/aios-masterclass-site/public/index.html` (seção oferta) +
checkouts Kiwify já com esses valores.
