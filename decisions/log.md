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
