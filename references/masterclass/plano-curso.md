# Plano do Curso — o que falta gravar pra fechar a promessa

> **L2 (rascunho).** ORDEM proposta pra você aprovar. Atualizado em **06/07/2026**: Módulo 8
> fechado; **Módulo 9 reestruturado do zero** em cima do projeto votado (Atendente de WhatsApp com
> IA), **ignorando os títulos-placeholder da Kiwify** — eles eram só pra o aluno ver que haveria
> aulas nesses módulos; a estrutura ia mudar de qualquer jeito. O **AIOS virou produto próprio à
> parte** (ver abaixo) — não entra no curso.

## A régua (a sua promessa, não a do Nick)

Fonte: **masterclass.sparo.com.br**. O que a página vende:

- "Construir **automações, agentes de IA, sites e aplicativos full-stack** com o Antigravity — sem escrever uma linha de código."
- "Do zero até **cobrar R$ 10k pelo primeiro projeto**." · "Cobrar por projetos de alto ticket (R$ 5k+)."

Toda aula nova passa no teste: **aproxima o aluno leigo de CONSTRUIR e COBRAR por um sistema real?**
Se não aproxima, corta.

## Estado real dos módulos

| # Kiwify | Módulo | Estado |
|---|---|---|
| 1–7 | Introdução → Wrappers de APIs (Lead-se) | ✅ gravados e transcritos |
| 8 | Pagamentos e Monetização | ✅ **COMPLETO** — a aula final "O Teste do Estranho" foi gravada (~03/07) e postada como Aula 9; transcrita e no Obsidian em 06/07 |
| **9** | **Projeto Complexo → Atendente de WhatsApp com IA** | 🔲 a gravar — **8 aulas, ROTEIRO PRONTO em 06/07** (`roteiro-modulo-09-atendente-whatsapp.md`); WhatsApp **oficial recomendada** + não-oficial rápida; host no **Railway** (VPS só ao escalar) |
| **10** | **Empreendedorismo** | 🔲 a gravar — tema mantido, títulos-placeholder descartados |

> **Sobre os títulos-placeholder da Kiwify** (WebGL, Memória de Contexto entre IAs, OAuth 2.0,
> "Projeto Complexo Partes 1–3" / Moat, VBP, Estruturação de Planos, Geração de Demanda):
> **descartados**. Eram só marcadores pra o aluno ver que os módulos teriam aulas. A estrutura real
> é a deste documento. Lembrar de renomear/ajustar as aulas na Kiwify conforme forem gravadas.

## A votação da comunidade (Skool, encerrada ~06/07) — de onde saiu o projeto do M9

Enquete "Qual automação você MAIS quer ver na MasterClass?" — 19 votos:

| Opção | Votos |
|---|---|
| 🥇 **Atendente de WhatsApp com IA (atende + vende 24/7)** | **8** |
| 🥈 Automação de conteúdo (posts, legendas, roteiros) | 5 |
| App próprio pra um nicho específico | 3 |
| CRM + follow-up automático de leads | 2 |
| Agente que agenda no WhatsApp (clínica/salão/barbearia) | 1 |
| Recuperação de vendas e cobrança pelo WhatsApp | 0 |

Somadas, as variações de agente de WhatsApp (atendente + agendador + cobrança) levam **9 de 19
votos**. Nos comentários, Hamilton pediu *"que seja diferenciado, fora da caixa — no mercado tem
muitos genéricos"* — o que vira a régua de qualidade do módulo (ver o diferencial abaixo).

**Fila pro futuro:** Automação de conteúdo ficou em 2º (5 votos) — candidata a projeto bônus depois
do M9. Nathan (clínica) pediu integração de pagamentos/boletos via Asaas — possível variação avançada.

## Decisão travada (06/07): o AIOS é PRODUTO PRÓPRIO, não entra no curso

O AIOS (um "sistema operacional pessoal de IA" como o do Enzo) **não vira módulo da MasterClass**.
Motivo: a MasterClass vende *construir e cobrar por sistemas pra cliente*; o AIOS é *leverage
pessoal* — intenção de compra diferente, quebraria a régua "R$ 10k no primeiro projeto" se fosse o
capstone. Vira um **produto separado**, vendido inclusive pros alunos atuais da MasterClass, com o
**Kit AIOS Automatize-se** (grátis) como isca de funil. Escopo desse produto = trabalho à parte
(posicionamento + outline quando o Enzo pedir). O Módulo 9 pode fechar plantando a semente: *"essa
automação é a primeira peça que mora dentro de um sistema maior — e esse sistema é outro produto."*

---

## MÓDULO 9 — Projeto Complexo: Atendente de WhatsApp com IA (proposta de estrutura)

> **O projeto:** um atendente de IA que **atende e vende 24/7 no WhatsApp** — construído pra o aluno
> **instalar e cobrar** de um negócio (clínica, salão, loja, prestador). É o capstone: amarra tudo
> do curso (automação + app + banco + segurança) num sistema que uma empresa paga ~R$ 8k pra ter.
>
> **Foco/exemplo (decidido 06/07): negócio de serviço local com agendamento** — exemplo de gravação
> escolhido: **clínica de estética** (facial/corporal). Usa TODOS os diferenciais (áudio pra marcar +
> agenda real + qualificação + lembrete), é a venda mais fácil pro aluno e demo limpo (sem conselho
> médico). Define a persona ("a recepcionista da clínica"), a base de conhecimento e os prompts das
> 8 aulas. Ecommerce/B2B/outras clínicas ficam como variações que o aluno adapta (a 9.8 é reaproveitável).
>
> **O diferencial (a régua do Hamilton: "fora da caixa, não genérico").** O bot genérico é uma
> árvore de menu ("digite 1"). O nosso: **conversa natural** (é um agente, não script), **conhece o
> negócio de verdade** (base de conhecimento), **age no mundo real** (agenda, envia link de
> pagamento, registra o lead), **entende áudio e imagem** (o cliente manda um áudio e ele resolve),
> **lembra do cliente** e **sabe chamar o humano**. Cada aula empilha
> uma dessas camadas.
>
> **Conexão do WhatsApp (decidido 06/07):** a **API oficial** (Cloud API + coexistence) no **número
> atual da empresa** é a **recomendada e o foco** da aula (9.5). A **não-oficial** (Z-API, num
> **número comprado** só pra isso) é mostrada **rápido**, como o atalho barato. O produto **não tem
> as duas opções** — a rota é decidida **conversando com o Claude Code** (pra trocar, o aluno pede
> no chat e a IA refaz a integração). Hospedagem: **Railway** no M9 inteiro (o `git push` do Lead-se —
> dev E entrega do 1º cliente). A **VPS** é passo de ESCALA (vários clientes numa VPS = margem), citada como crescimento, não obrigatória. Número de teste da Meta descartado (gringo, sem credibilidade).

**9.1 — O que é um agente de IA (e por que o atendente precisa ser um)**
- **Conceito:** agente decide o próximo passo sozinho num loop — percebe → decide → age. Diferente da automação (trilho fixo, do M1) e do app (espera o clique, do M7). Uma conversa de cliente é imprevisível → pede agente, não script. É a 3ª categoria que o título do curso promete.
- **Também aqui:** deixar claro que o atendente é um **app real, hospedado, construído do mesmo jeito que o Lead-se** (backend + Supabase) — não é ferramenta pronta nem mágica. E cravar a régua "fora da caixa" (conversa natural + conhece o negócio + age + lembra + faz handoff), o mapa do módulo.
- **Por que agora:** o aluno já fez automação e app; falta a categoria "agente".
- **Fecho da aula, NA TELA (decidido 07/07):** criar a conta de desenvolvedor da Meta ao vivo e disparar a **verificação do negócio**, explicando o porquê: o processo pode levar dias e não depende de aula nenhuma — quanto antes dispara, mais rápido o aluno termina o projeto (na 9.5 o cadastro já está liberado). Mesma lógica do documento enviado pro cliente preencher: o que depende de terceiros dispara na 9.1. A ordem das aulas NÃO muda (cérebro antes do canal) — só a espera anda antes.
- **Pré-requisito:** M1 (automações) + M7 (apps). **Entregável:** desenhar o atendente no papel (persona, o que responde, o que pode FAZER, quando chama humano).

**9.2 — O cérebro no sandbox: persona + memória, testado ANTES do WhatsApp**
- **Conceito:** montar o cérebro — modelo + **constituição** (persona: tom, o que vende, regras e limites) + **memória da conversa** (Supabase) — e **conversar com ele num chat de teste** (sandbox), sem WhatsApp ainda. O aluno vê o agente pensando e respondendo com inteligência **já nesta aula** — o "uau" vem antes de qualquer infra.
- **Por que primeiro (mudança da reavaliação de 06/07):** provar o motor na bancada antes de botar na rua. Cérebro bom aqui = o resto é encanamento; cérebro ruim, melhor descobrir agora, barato — sem a fricção de conectar WhatsApp na frente.
- **Por que agora:** com o atendente desenhado (9.1), você dá vida a ele.
- **Pré-requisito:** 9.1 + M3 (memória, constituição, Supabase).

**9.3 — O que faz ele "fora da caixa": conhecimento do negócio + ferramentas**
- **Conceito:** dar ao agente (a) uma **base de conhecimento simples** — uma tabela/documento que ele consulta (catálogo, preços, FAQ, políticas), **nível leigo, sem RAG de empresa grande** — e (b) **ferramentas** pra consultar dado real e agir (ver disponibilidade, buscar um produto, registrar o lead). É AQUI que ele deixa de ser chatbot e vira atendente de verdade — o diferencial.
- **Regra de ouro (não inventar):** o agente responde **só do que está na base de conhecimento** — se não sabe, diz que vai verificar ou chama o humano; nunca inventa preço, desconto ou promessa. (Testado na 9.8.)
- **Tudo é DADO, não código chumbado:** persona, catálogo e regras ficam em dados editáveis — é o que vai permitir reaproveitar pra outro cliente (9.8).
- **Por que agora:** o agente já conversa e lembra (9.2); agora ele *sabe* e *faz*. Ainda testando no sandbox.
- **Pré-requisito:** 9.2.

**9.4 — Os sentidos do agente: entender áudio e imagem**
- **Conceito:** no Brasil o cliente manda **áudio** o tempo todo (e foto). Um atendente que só lê texto ignora metade das mensagens reais — e volta a ser genérico. Aqui o agente ganha **ouvido e visão**: entende o **áudio** e **lê a imagem** (foto de produto, documento) antes de responder. Opcional: responder **em áudio** também.
- **Como transcrever (o agente roda numa VPS SEM GPU):** NÃO usar o Whisper local da sua GPU — isso é pra transcrever os vídeos do curso. No agente, usar **API**: o mais simples é um **modelo multimodal (Gemini)** que entende áudio **e** imagem direto — um call só = ouvido + visão + cérebro, nada pra hospedar. Alternativa pra transcrição PT-BR dedicada: **Whisper via API (Groq/OpenAI)** — barata, rápida, sem GPU. *(Wispr Flow NÃO serve — é ditado por voz no seu PC, não uma API que o bot chama.)*
- **O "uau" do módulo:** o cliente manda um áudio "queria marcar amanhã de tarde" e o robô entende e agenda — o maior diferencial pro mercado brasileiro.
- **Por que agora:** completa o cérebro no sandbox — ele já pensa, sabe e age; agora **percebe** qualquer tipo de mensagem. Dá pra testar com um arquivo de áudio antes de ter WhatsApp.
- **Pré-requisito:** 9.3 + uma API multimodal/de transcrição (Gemini, ou Whisper via Groq/OpenAI).

**9.5 — Conectar no WhatsApp de verdade (publicando com 1 push, como no Lead-se)**
- **Conceito:** agora que existe um agente que vale a pena, dá o canal real. O WhatsApp entra e sai por **webhook** — que precisa de uma **URL pública** (o WhatsApp não entrega no seu `localhost`). Sem complicação e **sem ferramenta nova**: você **publica o app com um `git push`, igualzinho ao Lead-se** — o Railway sobe e te dá a URL pública na hora, e é só apontar o webhook pra ela. Cada ajuste é outro push. A hospedagem definitiva (VPS, pra rodar barato 24/7) fica pra 9.8.
- **Rota recomendada (o foco): API oficial** (Cloud API + coexistence) no **número atual da empresa** — profissional, segura, dentro das regras da Meta (que permite agente de atendimento/vendas). Coexistence conecta em minutos e já vale no Brasil (o "leva semanas" era boato).
- **Rota rápida (mostrada de leve): não-oficial (Z-API)** num **número comprado** só pra isso (chip pré-pago ou eSIM de operadora real; fugir de número virtual/VoIP) — barata e simples, mas zona cinzenta do ToS; número separado protege o da empresa de um bloqueio.
- **Envio manual + janela de 24h (com a oficial):** com **coexistence**, o número fica no app WhatsApp Business **e** na API ao mesmo tempo — o dono continua conversando manualmente pelo celular, e as mensagens espelham nos dois lados (echo via webhook). *(No mundo antigo, migrar pra API trancava o app — coexistence resolveu exatamente isso.)* Regra da API oficial: dentro de **24h** da última mensagem do cliente, manda texto livre (grátis); passadas 24h de silêncio, só reabre com um **template aprovado** (aprovação até 48h). Isso pega no follow-up proativo. *(Na rota não-oficial/Z-API não há janela nem template — manda a qualquer hora, ao custo do risco de ToS.)*
- **A escolha é no Claude Code, não no app:** o produto não tem as duas opções — a rota é **decidida conversando com o Claude Code**; pra trocar depois, o aluno pede a troca no chat e a IA refaz a integração.
- **Por que push no Railway, e não túnel (sua pergunta):** dava pra usar um túnel (ngrok), mas é ferramenta nova e URL que muda a cada reinício — complexidade à toa. O `git push` pro Railway é o que o aluno **já sabe** (Lead-se), dá URL fixa e é o caminho mais fácil. O passo pesado (VPS) fica só na entrega (9.8).
- **Pré-requisito:** 9.4 + M2 (API/Webhook/MCP). Pode virar 2 vídeos.

**9.6 — Atende + vende: qualificar, agendar, cobrar e passar pro humano**
- **Conceito:** o núcleo do valor. O agente qualifica o lead, recomenda/vende (manda o link de pagamento), **marca na agenda real** do negócio, manda o **lembrete no dia anterior** e sabe a hora de **passar o lead quente pro humano**. É o "atende + vende 24/7" acontecendo.
- **Agendar de verdade puxa integração (reserve tempo):** marcar na agenda real = conectar o **Google Calendar via OAuth** (o dono autoriza uma vez). É um pedaço técnico de peso, não um detalhe — o aluno já viu login com Google no M5; aqui vê o app pedindo acesso à agenda.
- **Lembrete fecha o ciclo (decidido 07/07):** agendou → no dia anterior o agente manda o **lembrete** no WhatsApp (serviço, hora, endereço — tudo da base). Cliente que falta esvazia a agenda que o robô encheu. Na API oficial, mensagem proativa fora da janela de 24h sai por **template aprovado** — a regra da 9.5 na prática.
- **Por que agora:** com cérebro + conhecimento + ferramentas + sentidos e já no WhatsApp (9.5), ele fecha o ciclo comercial.
- **Pré-requisito:** 9.5. Aula densa (funil + OAuth da agenda + lembrete) — como a 9.5, **pode virar 2 vídeos**.

**9.7 — O painel do dono: ver conversas/leads/agendamentos e ASSUMIR o atendimento (handoff)**
- **Conceito:** o **cockpit** do atendente — uma tela (front + Supabase + login) onde o dono acompanha em tempo real: conversas acontecendo, leads que entraram, quem foi qualificado, o que foi agendado. E, principalmente, é onde ele **assume** quando o agente marca um lead como quente — o handoff da 9.6 ganha casa. O dono **responde manualmente dali mesmo** (o painel envia pela API), e o que ele digitar pelo WhatsApp Business no celular também aparece no painel — os dois lados espelham. Não é "mais um CRM": é o **posto de comando de um agente autônomo** (human-in-the-loop).
- **Por que agora:** o agente já atende, vende e agenda (9.6) gravando tudo no Supabase; o painel é a **visão por cima do que já existe** — pouco esforço novo, e é o que o cliente VÊ (o que justifica os R$ 8k). Reusa CRM do M3 e app do M5/M7; abraça também a opção "CRM + follow-up" da enquete.
- **Pré-requisito:** 9.6 (os dados já estão no Supabase desde a 9.2).

**9.8 — Testar quebrando + reaproveitar pra outros clientes + produção e cobrar (~R$ 8k)**
- **Testar (automático):** o Claude Code gera um **"cliente chato" simulado** que dispara dezenas de conversas difíceis (escreve torto, manda áudio confuso, tenta enganar, foge do script) e entrega o **relatório de onde o agente falhou** — inclusive se ele **inventou** algo fora da base. IA testando IA; é o Teste do Estranho do M8 na conversa.
- **Reaproveitar pra outro cliente (faz o serviço escalar):** como persona, base de conhecimento, catálogo e número são **dados** (9.3), subir o cliente nº 2 é **reconfigurar, não reconstruir** — minutos, não dias. Cada cliente é uma config nova, não um app novo = margem alta. Transforma "fiz um bot" em "tenho um serviço que revendo".
- **Fica no ar no Railway — VPS só quando escalar:** o bot do cliente **roda no Railway** (o mesmo push do dev; 24/7, custo baixo — pro 1º cliente já sobra margem). A **VPS da Hostinger** é o passo de **escala**: quando tiver **vários clientes**, migra pra rodar todos numa VPS só e baratear (= margem). Cite como crescimento, não faça no 1º cliente. (VPS Hostinger você já ensina no bônus de n8n — cupom SPARO10.)
- **Blindar + cobrar:** teto de custo por conversa (cada mensagem custa; precificação da Meta mudou em 2026), trava anti-abuso, segurança. Empacotar como serviço (~R$ 8k) — ponte pro M10. Se um agente só não der conta, dividir em especialistas (o "fluxo multi-agente" da página). Variação: "suporte" no lugar de "vendas" = o *atendimento inteligente* da página.
- **Por que agora:** fecha o projeto vendável, confiável e escalável.
- **Pré-requisito:** 9.7 + M4/M8 (segurança e custo). **Fecho opcional:** teaser do produto de AIOS.

---

## MÓDULO 10 — Empreendedorismo (tema mantido; ordem derivada do arco de venda)

> Títulos-placeholder descartados. As aulas saem do arco **por que vale R$ 10k → como precificar →
> como empacotar → como vender** — não dos nomes que estavam na Kiwify. Esboço pra refinar com você.

**10.1 — Por que um leigo com IA pode cobrar R$ 10k (a virada de chave)**
- **Conceito:** software deixou de ser caro de construir — o valor migrou da construção pra **implantação** no negócio do cliente. É o que destrava cobrar alto sem ser programador.
- **Por que agora:** é a mentalidade que precede qualquer conversa de preço.
- **Pré-requisito:** ter construído os projetos do curso (Lead-se, CRM, atendente de WhatsApp).

**10.2 — Precificar por valor, não por hora**
- **Conceito:** a empresa compra RESULTADO, não código. O preço ancora no que o sistema gera/economiza (um atendente que vende 24/7 vale R$ 8k), não nas horas que você levou.
- **Por que agora:** 10.1 explicou que existe valor; aqui você aprende a medi-lo e cobrá-lo.
- **Pré-requisito:** 10.1 + M8 (modelos de precificação).

**10.3 — Empacotar em oferta (setup + recorrência, faixas)**
- **Conceito:** transformar o que você construiu em oferta clara: setup + mensalidade, faixas (R$ 5k / R$ 8k / R$ 10k), o que entra e o que fica de fora. Sem pacote, toda venda vira negociação do zero.
- **Por que agora:** com o valor medido (10.2), você embala.
- **Pré-requisito:** 10.2.

**10.4 — Gerar demanda e fechar o primeiro cliente (→ R$ 10k)**
- **Conceito:** prospecção simples + diagnóstico + fechamento + entrega + recorrência — o arco da primeira venda. (A comunidade Automatize-se+ dá o "onde"; a aula ensina o COMO.)
- **Por que agora:** fecha a régua da página: "do zero até cobrar R$ 10k".
- **Pré-requisito:** 10.3.

---

## Honestidade de cobertura

- A régua é a **sua página de vendas** — confirme os projetos carro-chefe se algo soar errado.
- Módulo 8 fechado (a live de 26/06 não aconteceu; a aula gravada cobre tudo).
- Títulos-placeholder da Kiwify **descartados** — renomear as aulas lá conforme gravar.
- AIOS = **produto à parte**, fora do core do curso.
- n8n segue **bônus**, fora do core.

## Volume pra fechar a promessa

**Módulo 9** (8 aulas, o pilar de agentes — inclui áudio/imagem e o painel) + **Módulo 10**
(4 aulas, conceituais, sem build). Total: **~12 gravações**. Lead-se e Módulo 8 fechados.

## Próximo passo

**Roteiro do M9 PRONTO (06/07):** as 8 aulas estão em `roteiro-modulo-09-atendente-whatsapp.md`
(formato do `aulas-finais-script.md`; 9.1 validada pelo Enzo, 9.2–9.8 geradas no mesmo padrão e
revisadas por consistência). Base fictícia do exemplo: `exemplo-clinica-estetica-base-conhecimento.md`.
Falta: Enzo revisar o roteiro completo → gravar (renomeando as aulas na Kiwify) → depois roteirizar
o M10 (4 aulas, conceituais).
