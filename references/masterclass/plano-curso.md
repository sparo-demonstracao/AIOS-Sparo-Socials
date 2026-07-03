# Plano do Curso — o que falta gravar pra fechar a promessa

> **L2 (rascunho).** Isto é a ORDEM proposta pra você aprovar. Nada de roteiro de aula ainda —
> primeiro a gente fecha *o que* falta e *em que ordem*. Depois eu roteirizo UMA pra você validar
> a qualidade antes do lote.

## A régua (a sua promessa, não a do Nick)

Fonte: **masterclass.sparo.com.br**. O que a página vende:

- "Construir **automações, agentes de IA, sites e aplicativos full-stack** com o Antigravity — sem escrever uma linha de código."
- "Do zero até **cobrar R$ 10k pelo primeiro projeto**." · "Cobrar por projetos de alto ticket (R$ 5k+)."

Toda aula nova passa no teste: **aproxima o aluno leigo de CONSTRUIR e COBRAR por um sistema real?**
Se não aproxima, corta.

> ⚠️ Li a página por fetch (resumo automático). Se algum projeto/promessa abaixo estiver torto,
> me corrige — eu ajusto o plano.

## O que JÁ está coberto (não vou tocar)

Esqueci contagem de aula e nome de módulo de propósito — isso é seu pra ajustar no Kiwify. Aqui é
só **conteúdo**.

| Família prometida na página | Onde já está | Status |
|---|---|---|
| Toolkit (Antigravity + Claude Code + modelos) | M1, M2 | ✅ |
| Automações (1ª automação ponta a ponta) | M1.6/1.7 (orçamentos) | ✅ |
| Sites / landing | M2.3/2.4 | ✅ |
| Apps full-stack (CRM, dashboard, Micro SaaS) | M3 (CRM), M5 (Kanban), M7–M8 (Lead-se) | ✅ |
| Memória + contexto + constituição | M3 | ✅ |
| Conexões — MCP / API / Webhook | M2.2, M7 | ✅ (falta só o lado "Comunicação"/WhatsApp → entra no Bloco B) |
| Segurança / engenharia de software | M4, M6 | ✅ |
| Lançamento e produção | M8 + Bloco A | ✅ (fechando) |

## O que FALTA gravar — em ordem

Três blocos. Cada passo destrava o seguinte.

---

### BLOCO A — Fechar o Lead-se (Lançamento e Produção)

**A0 — Colocar no ar (domínio + e-mail profissional + Stripe em produção)** — ✅ **JÁ GRAVADA.**
É a **M8 A7** (transcrita hoje). Só falta editar/publicar. Roteiro de referência: `aulas-finais-script.md` (Aula A).

**A1 — Auditoria de segurança + margem (blindar como invasor)**

- **Conceito:** um estranho que paga vai cutucar — feche as portas no servidor e no banco (RLS, segredos rotacionados, webhook assinado, teto de custo) e só então confira se o preço cobre o custo médio (3–4×).
- **Por que agora:** o app está no ar (A0); blindar por último só faz sentido quando já existe alvo. Fecha o projeto Lead-se.
- **Pré-requisito:** A0 (no ar) + M4 (segurança base).
- **Atalho:** o roteiro já existe pronto em `aulas-finais-script.md` (B1 + B2). É a aula mais rápida de fechar.

---

### BLOCO B — Agentes de IA (o pilar que falta) — ancorado no **SDR de WhatsApp**

> É o maior buraco vs. a sua página: "agentes de IA" está no **título** e o **SDR de WhatsApp (R$ 8k)**
> é projeto carro-chefe. Um módulo enxuto, construindo o SDR ponta a ponta. O mesmo padrão gera o
> "atendimento inteligente" e os "fluxos multi-agente" que a página também cita — então um projeto
> entrega três promessas.

**B1 — Agente de IA na prática (o que é, e quando vale)**
- **Conceito:** agente decide o próximo passo sozinho num loop (percebe → decide → age); automação segue trilho fixo, app espera o clique. Use agente quando a entrada é imprevisível — uma conversa humana.
- **Por que agora:** o aluno já fez automação (orçamentos) e app (Lead-se). Falta a 3ª categoria — a que o título promete.
- **Pré-requisito:** M1 (automações) + M7 (apps). Entregável da aula: desenhar o SDR no papel.

**B2 — Dar voz ao agente: conectar o WhatsApp**
- **Conceito:** o agente precisa de um canal pra ouvir e responder; o WhatsApp entra e sai por webhook (a mensagem chega, o agente responde).
- **Por que agora:** sem canal não há SDR. É o lado "Comunicação" que faltava nas Conexões.
- **Pré-requisito:** B1 + M2.2 (API/webhook/MCP).

**B3 — O cérebro do SDR: persona, memória e ferramentas**
- **Conceito:** agente = modelo + constituição (persona de SDR) + memória da conversa (Supabase) + ferramentas (qualificar o lead, consultar a agenda). Sem memória ele esquece; sem ferramenta ele só conversa.
- **Por que agora:** já tem o canal (B2); agora o agente pensa, lembra e age.
- **Pré-requisito:** B2 + M3 (memória, gemini.md, Supabase).

**B4 — Sub-agentes e paralelização**
- **Conceito:** dividir o trabalho em especialistas (um qualificador, um agendador) e rodar em paralelo o que é independente — um agente que faz tudo trava e erra. *(É o título literal do módulo na página.)*
- **Por que agora:** o SDR básico funciona (B3); aqui ele escala e fica confiável.
- **Pré-requisito:** B3. Cobre os "fluxos multi-agente" da página.

**B5 — Agente em produção: agendar, handoff, blindar e cobrar a implantação**
- **Conceito:** o agente sabe a hora de chamar o humano (agenda com o comercial e passa o lead quente), respeita limite/custo/segurança (cada mensagem custa) — e isso se empacota como serviço de ~R$ 8k.
- **Por que agora:** fecha o projeto vendável e faz a ponte pro Bloco C.
- **Pré-requisito:** B4 + M4/M8 (segurança e custo). Variação: trocar "SDR" por "suporte" entrega o *atendimento inteligente* (mesmo padrão).

---

### BLOCO C — Projetos Finais (empacotar e vender → R$ 10k)

> A última milha da promessa do título: "do zero até cobrar R$ 10k". Conceitual, sem build.

**C1 — Empacotar o que você construiu numa oferta**
- **Conceito:** a empresa compra **resultado**, não código. Pegue o que já existe (CRM, Lead-se, SDR) e transforme em oferta com preço por valor (R$ 5k / R$ 8k / R$ 10k).
- **Por que agora:** o aluno tem três sistemas na mão; agora viram produto.
- **Pré-requisito:** todos os projetos + M8.1 (precificação).

**C2 — Pegar, entregar e cobrar o primeiro cliente (→ R$ 10k)**
- **Conceito:** prospecção simples + diagnóstico + fechamento + entrega + recorrência — o arco "primeira semana".
- **Por que agora:** é o que fecha a régua da página.
- **Pré-requisito:** C1. *(A comunidade Automatize-se+ e o Balcão Sparo já dão o "onde achar cliente" — a aula ensina o COMO.)*

---

## Honestidade de cobertura

- A medição é contra a **sua página de vendas**, lida por fetch — confirme os projetos carro-chefe se algo soar errado.
- O "Inteligência Infinita" da página não bateu com nada óbvio do gravado — presumo que seja modelos/contexto (M2.1 + M3). É naming seu, não buraco de conteúdo.
- Contagem de aula (70+) e nome de módulo: deixei de fora de propósito — você ajusta no Kiwify.
- n8n é **bônus** ("Master em n8n"), curso à parte — não entra no core.

## Volume

Pra fechar a promessa: **A1** (1 aula, roteiro pronto) + **Bloco B** (~5 aulas, o pilar de agentes) +
**Bloco C** (~2 aulas, vender). Toda a gravação nova concentrada no que de fato falta — sem inflar.

## Próximo passo

Você aprova **esta ordem**? Se sim, eu rodo o modo ROTEIRO e escrevo **UMA aula completa** pra você
validar a qualidade antes do lote (Bike Method Fase 1). Sugiro começar pela **A1** (já tem script, fecha o Lead-se)
ou pela **B1** (abre o pilar de agentes). Qual você quer ver primeiro?
