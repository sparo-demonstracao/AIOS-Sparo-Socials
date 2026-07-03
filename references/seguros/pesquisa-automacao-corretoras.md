# Pesquisa: Automação para Corretoras de Seguros (Sparo Automações)

> Pesquisa de mercado para desenhar **um sistema de automação replicável** que o Enzo venda
> repetidamente a corretoras de seguros PME (foco RJ, entrada via sindicato).
> Gerada em 24-25/jun/2026 por workflow de 16 agentes (6 frentes + verificação adversarial + síntese).
> **Cada número aqui já passou por checagem de fonte.** Onde a fonte era fraca (blog de fornecedor),
> está marcado — não usar esses no material de venda.

---

## 1. Veredito estratégico (leia isto primeiro)

**O diferencial NÃO pode ser "ter IA no WhatsApp".** Isso virou commodity barata e até gratuita:

- **Segura / assistente Helena** — 3.000+ corretoras em ~2 anos, R$ 45 mi (a16z + Kaszek). É **100% GRÁTIS pro corretor** (pago pelas seguradoras via take-rate). Cliente-alvo declarado: corretora de até 7 funcionários = **exatamente a PME que miramos**.
- **Azos** (R$ 125 mi série C) e **180 Seguros** distribuem copiloto de IA de graça pros corretores parceiros.
- **SaaS self-service**: Beeia (R$ 259–590/mês), BotZz (R$ 159–199/mês), SocialHub (R$ 99–399/mês), AgentCorr/Multiplic.

**Não competir, nunca, com:** multicálculo/ERP (Segfy, Agger, Quiver/Dimensa-TOTVS, TEx) nem com conciliação de comissão — já é nativo nesses sistemas e a Quiver sozinha já processa ~36% dos prêmios de corretores do país.

**Onde está o espaço em branco real:** a corretora pequena/média que ainda roda em **planilha + WhatsApp manual** e precisa de **alguém que IMPLEMENTE, INTEGRE e ENTREGUE funcionando** — não de mais um SaaS pra ela configurar mal e abandonar.

**O moat do Enzo (em ordem de força):**
1. **Distribuição** — acesso a N corretoras de uma vez via sindicato (ver §11 — alerta a confirmar). Nenhum concorrente SaaS tem isso; eles vendem por inbound.
2. **Entrega no-code feita** — montado, integrado aos dados da corretora, com a voz e o número dela.
3. **Produto-pacote padronizado e replicável** — constrói uma vez, vende muitas, com mensalidade recorrente.

**O concorrente real não é o Segfy nem a Segura — é a planilha e a memória do dono da corretora.**

---

## 2. As dores reais (mapeadas e verificadas)

Ordem por **impacto financeiro × facilidade de automatizar**:

| # | Dor | Quão real | Automatizável |
|---|-----|-----------|---------------|
| 1 | **Renovação controlada na planilha/memória** — receita recorrente já conquistada que mais vaza | **~90% das renovações ainda são manuais** (Justos, via Revista Apólice/SEGS/Monitor Mercantil, jun/2026 — fonte forte) | Muito alta |
| 2 | **Lead que esfria** — cotação no WhatsApp demora, vira troca infinita de mensagem | Alta (responder rápido qualifica ~21× mais — estudo MIT/InsideSales; ver ressalva*) | Alta |
| 3 | **Cobrar/organizar documentos** — caos no WhatsApp, cliente desiste antes de emitir | Alta | Alta |
| 4 | **Conferência de comissão** — baixar PDF de cada seguradora e cruzar na mão | Alta | Alta — **mas já é nativo no Segfy/Quiver, NÃO atacar** |
| 5 | **Cobrança de parcela** — atraso cancela apólice e mata a comissão | Média | Média (cuidado Súmula 616 — ver §9) |
| 6 | **Atender as mesmas perguntas 24/7** e pós-venda/sinistro ("corretor sumiu" enche o Reclame Aqui) | Alta | Alta |

\* **Ressalva honesta:** o "21×" do MIT é "21× mais chance de **QUALIFICAR** o lead" (não de fechar). Vários números que circulam em blog de fornecedor — "73% decidem em 48h", "58% das apólices perdidas", "28–45% de conversão de indicação", "28% do dia em documentos" — **não têm fonte primária** e **não devem ser citados como fato** no pitch. Usar de forma qualitativa.

**Números sólidos e citáveis (esses pode usar):** ~90% das renovações manuais (Justos); **57.455 corretoras cadastradas na SUSEP (2024)**, maioria PME; Súmula 616 STJ; Circular SUSEP 251/2004; Lei 15.040/2024; Nielsen "84% confiam em indicação de amigos/família".

---

## 3. Concorrência e preços (referência de mercado)

| Player | O que é | Preço | Observação |
|--------|---------|-------|------------|
| **Segura / Helena** | IA no WhatsApp, elo corretor↔seguradora | **Grátis** pro corretor | Ameaça nº 1. Mesma PME-alvo. |
| **Beeia** | SaaS WhatsApp p/ corretoras | R$ 258,90 / 469,90 / 589,90 (5/10/15 usuários) + setup R$ 199 | Concorrente direto no caso "renovação + atendimento". Self-service. |
| **BotZz (Vox)** | IA generativa no WhatsApp | R$ 199/mês (ou R$ 159 anual) | Piso de preço. Ativação ~20s. |
| **SocialHub** | WhatsApp+CRM horizontal | R$ 99 / 199 / 399 + Meta por conversa | Genérico com verniz de seguros. |
| **AgentCorr (Multiplic)** | Agente IA p/ corretora PME (cota, agenda, qualifica) | "custo acessível" (sem preço público) | **O mais parecido com a proposta.** Fundador com 20+ anos no setor. Auto-declara −80% tempo de resposta, +40% conversão. |
| **Agger / Segfy / Quiver / TEx** | Multicálculo + ERP | Agger R$ 98 (multicálculo) / R$ 198 (gestão); Segfy ~R$ 124,90/usuário | Camada que fica EMBAIXO. Integrar, não competir. |
| **Freelancers n8n/Make** | Automação por projeto | R$ 300–1.000 (simples) a R$ 3.000–10.000 (avançado) | **Nenhum é "o cara das corretoras".** Espaço pra especialista vertical. |

*Custo Meta por conversa em 2026: ~R$ 0,03 (utility) a ~R$ 0,40 (marketing); 1.000 conversas/mês grátis; iniciadas pelo cliente grátis.*

---

## 4. Oportunidades rankeadas por alavancagem

| Score | Oportunidade | Demanda | Build | Paga? | Replica |
|:---:|---|:---:|:---:|:---:|:---:|
| **10** | **Radar de Renovação no WhatsApp** (check-in 45d + régua 30/15/7) | alta | fácil | alta | alta |
| **8** | **SDR / Atendente de cotação 24/7** (qualifica e entrega pronto) | alta | média | média | alta |
| **7** | **Coletor de documentos + handoff seguro (LGPD)** | média | média | média | alta |
| **6** | **Régua de cobrança de parcela** (com notificação formal) | média | fácil | média | alta |
| **5** | **Motor de indicação + cross-sell pós-venda** | média | fácil | baixa | alta |
| **4** | **Coletor de endosso e aviso de sinistro** | média | média | baixa | alta |

Os 4 últimos rodam **no mesmo motor de cadência** do Radar — custo marginal quase zero pra adicionar depois.

---

## 5. Produto V1 — "Corretora no Piloto"

**Camada complementar de relacionamento no WhatsApp que SENTA EM CIMA do que a corretora já usa** (ERP/planilha/multicálculo). Não substitui gestão nem refaz multicálculo. Entregue montada e integrada pela Sparo, com a **voz e o número da própria corretora**.

**Módulos do MVP:**
1. **Base única** (Supabase ou planilha): clientes, apólices, vencimentos, parcelas — populada por **export CSV** do ERP/planilha existente (não depende de API nativa do ERP).
2. **Radar de Renovação** — carro-chefe: check-in aos 45 dias + lembretes 30/15/7, tarefa interna de recotação, roteia pro corretor quando o cliente responde. *Não recota sozinho — só lembra, organiza e entrega pronto.*
3. **SDR / Atendente 24/7** (bot de negócio): responde na hora, coleta dados com validação (CEP/placa), qualifica, entrega o lead pronto. Alimenta o multicálculo; **humano fecha**.
4. **Pacote LGPD embutido**: termo de consentimento documentado (finalidade/data/timestamp), handoff de dado sensível pra canal seguro, log de interações (prova do dever de informação — Lei 15.040/2024).
5. **Painel simples (Notion)**: renovações da semana, leads quentes, o que precisa de ação.

**Fica de fora do V1:** conciliação de comissão (nativo no ERP), multicálculo próprio, integração nativa profunda com ERP (só CSV até validar), cobrança de inadimplência (fase 2), endosso/sinistro (fase 2/3), disparo em massa pra base fria (risco de ban).

**Stack:** n8n + Z-API + Supabase/Sheets + Claude (API) + Notion + Gmail/Drive.

**Como replicar:** UMA arquitetura-mãe no n8n (templates de fluxos parametrizados por variáveis de onboarding: número Z-API, voz/tom, ramos, formato da planilha, marcos de cadência). Nova corretora = checklist de onboarding + importar CSV + apontar o número. **Manter um "mapa de seguradoras" reaproveitável** (0800/WhatsApp/e-mail de sinistro e 2ª via) compartilhado entre todas as clientes.

**Tempo:** 2–3 semanas pra arquitetura-mãe + 1º piloto; **1–2 dias por corretora** depois do template pronto.

---

## 6. Modelo de preço

- **Setup único:** R$ 800–2.000 por corretora (importar carteira, configurar número/voz, parametrizar fluxos, termo LGPD). **Pras 3–5 primeiras via sindicato: setup simbólico ou grátis em troca de virarem casos/depoimentos** — distribuição e prova social valem mais que a margem inicial.
- **Recorrente:** R$ 300–700/mês por corretora conforme tamanho da carteira/módulos. Ancorado **no que ela já gasta com software do setor** (ERP R$ 98–198, Beeia R$ 259+) — posicionado acima dos SaaS self-service porque **inclui implementação, integração e suporte próximo**.
- **Por que paga:** não paga por "ter IA" (commodity grátis) — paga por **não precisar configurar/integrar/manter sozinho** e por ter alguém do lado dele. A recorrência de manutenção é o que vira os **"5 clientes recorrentes" da meta do trimestre**.

---

## 7. Posicionamento

> "A Sparo coloca a sua corretora no piloto automático do WhatsApp: nenhuma renovação escapa e nenhum lead esfria — montado, integrado e cuidado pela gente, com a voz e o número da SUA corretora."

**Ângulo:** não é mais um SaaS pra você configurar e abandonar, nem a IA genérica e grátis que serve à seguradora — é **entrega feita, integrada aos seus dados, com alguém do setor do seu lado.**

---

## 8. Restrições regulatórias que o sistema PRECISA respeitar

- **Corretora não emite apólice nem precifica risco** — quem faz é a seguradora. O bot **qualifica e entrega ao corretor habilitado**; nunca "fecha" seguro nem promete preço/cobertura final. (Venda de seguro exige corretor com registro SUSEP.)
- **Dever de informação do corretor (Lei 15.040/2024, em vigor desde 11/12/2025):** registrar/arquivar todas as interações vira **prova jurídica** e **feature vendável**. Ponto de revisão humana antes do fechamento.
- **LGPD — dado sensível (saúde/sinistro/CPF):** exige **consentimento específico e destacado** (art. 11). Não trafegar dado sensível por IA/WhatsApp aberto → mandar pra **canal seguro** (formulário autenticado). O termo de consentimento é **cirúrgico** (só na etapa de saúde/sinistro) — o resto do funil (lead/cotação/follow-up) roda sob "execução de contrato"/"legítimo interesse" (art. 7).
- **Não usar dado de saúde em scoring/qualificação** (boa prática + não-discriminação).
- **Decisão automatizada que afeta o cliente** dá direito a revisão (art. 20) → humano no laço. **IA é tema prioritário de fiscalização da ANPD 2026–2027.**
- **Multa ANPD:** até 2% do faturamento, teto R$ 50 mi/infração. Ter consentimento + política + trilha de auditoria **atenua a multa** (Resolução Dosimetria CD/ANPD 4/2023) → o "pacote LGPD" reduz risco real, não só aparência.
- **Política Meta (15/01/2026):** proíbe IA "de uso geral" no WhatsApp, mas **libera bot de negócio** (o caso da corretora). Risco real = o gateway: **checar se a Z-API (BSP não-oficial) está conforme os Termos da Meta** — bloqueio de número parte da Meta.
- **Prazos a monitorar (SLA):** emissão/endosso até 15 dias da aceitação (Circular SUSEP 251/2004, na verdade dois prazos de 15d: manifestação + emissão); documentos em 5 dias úteis (Lei 15.040/24).

---

## 9. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| **Premissa do sindicato pode estar errada** (ver §11) | Reconfirmar cargo/parentesco/período da tia ANTES de tratar como moat garantido |
| **IA no WhatsApp comoditizada e grátis** (Segura/Azos) | Nunca vender "ter IA". Vender resultado (renovação recuperada), integração feita, voz própria, vendas ativas, relação local |
| **SaaS baratos viram piso de preço** ("achei mais barato") | Não competir em preço de ferramenta — competir em "feito por você, integrado, com suporte". Alvo é quem já tentou SaaS e abandonou |
| **Ban do número** por disparo em massa sem opt-in | Embutir opt-in/opt-out e aquecimento desde o V1; começar só com contatos de relação ativa (renovação de cliente próprio) |
| **LGPD com dado sensível** | Humano no fechamento, consentimento documentado, canal seguro, log. Transformar conformidade em feature de venda |
| **Integração nativa com ERP não validada** | NÃO prometer API nativa no V1. Assumir export CSV. API é upgrade futuro |
| **Números de venda fracos queimam credibilidade** | No pitch usar só fonte sólida (§2). Os demais, qualitativos |

---

## 10. Próximo passo: VALIDAR antes de construir

Plano (ordem):
0. **Reconfirmar o vínculo da tia no Sincor-RJ** (ver §11).
1. Pedir à tia/sindicato uma lista de **3–5 corretoras PME** dispostas a uma conversa de 30 min (**descoberta, não venda**).
2. Rodar as entrevistas abertas (gravar), **sem propor solução** — só escutar a operação real.
3. Validar a hipótese central: **renovação manual dói de verdade e a corretora pagaria recorrente por automatizá-la?**
4. Validar o caminho técnico: **a carteira sai fácil em CSV do ERP/planilha que ela usa?**
5. Só depois de **3+ corretoras confirmarem a dor de renovação E o export de carteira**, construir a arquitetura-mãe e fechar 1 piloto (setup grátis por depoimento).
6. Confirmar com a tia (como dirigente) os **limites do que um bot pode dizer** sem configurar intermediação indevida.

### Roteiro de entrevista (descoberta)
1. Me conta como é um dia normal aqui na corretora — da hora que abre até fechar, o que mais consome o tempo de vocês?
2. Quem cuida do operacional (cadastro, emissão, renovação, cobrança)? Uma pessoa só ou divide? Quantas no total?
3. Hoje, como vocês controlam os vencimentos das apólices pra renovar? Me mostra na prática (planilha, caderno, sistema)?
4. Quando foi a última vez que uma renovação passou da data ou o cliente foi avisado em cima da hora? Com que frequência? Quanto de comissão isso custa?
5. Quando chega um pedido de cotação no WhatsApp, o que acontece da mensagem chegar até vocês responderem? Quanto tempo leva e o que trava?
6. Quantos pedidos de cotação por semana vocês não conseguem responder a tempo? O que acham que perdem com isso?
7. Que sistema(s) vocês usam hoje (multicálculo, ERP, CRM)? O que fazem bem e o que falta?
8. Desse sistema, dá pra exportar a lista de clientes e apólices numa planilha (CSV/Excel)? Vocês já fazem isso?
9. Se existisse uma coisa que avisasse o cliente da renovação sozinha, no WhatsApp da corretora, na voz de vocês, e só te entregasse o cliente pronto pra fechar — resolveria uma dor real? Pagaria por isso? Quanto por mês faria sentido?
10. Já tentaram alguma ferramenta de WhatsApp/bot/CRM antes? O que aconteceu — funcionou, abandonaram, por quê?
11. Como vocês lidam com documento e dado de cliente hoje (RG, CNH, declaração de saúde)? Tem preocupação com LGPD?
12. Se eu te entregasse isso montado e funcionando, integrado com o que você já usa, sem você configurar nada — quanto mudaria o seu dia? O que te faria dizer sim na hora?

---

## 11. ⚠️ Alerta a confirmar — a presidência do Sincor-RJ

A pesquisa encontrou, em fontes públicas (CQCS, Sincor), que o **presidente eleito do Sincor-RJ para o mandato 2026–2029 é Ricardo Faria Garrido** (chapa "Construir Mais", 77% dos votos, descrito como "primeiro corretor a liderar a instituição"). Isso **conflita** com o contexto de que "a tia do Enzo é presidente do sindicato".

O Sincor-RJ é real e ativo (fundado em 1932; estrutura de 1 presidente + 1 vice + 7 diretores executivos + 18 diretores), então **acesso via diretoria também vale muito** — mas o tamanho do moat depende do vínculo real. **Confirmar com o Enzo: a tia é presidente atual? De gestão anterior? Diretora? De outra entidade (ex.: outro sindicato/Fenacor/Clube de Corretores)?** Dimensionar a tese com base no acesso REAL.

---

## 12. Fontes-chave (citáveis no material de venda)

- Renovação ~90% manual: Justos via **Revista Apólice / SEGS / Monitor Mercantil** (jun/2026)
- **57.455 corretoras** cadastradas na SUSEP (2024)
- **Súmula 616 STJ** (cancelamento exige notificação prévia) · **Circular SUSEP 251/2004** (prazos) · **Lei 15.040/2024** (dever de informação)
- **LGPD** art. 7, 11, 20 · Multa até 2% / R$ 50 mi · Resolução Dosimetria CD/ANPD 4/2023
- Preços concorrentes lidos das páginas oficiais: Beeia, BotZz, SocialHub, Agger, Segfy
