# Kit de Descoberta — Corretoras de Seguros (Sparo)

> Ferramenta de campo pra validar a oportunidade ANTES de construir, e depois pra fechar cada
> corretora indicada pela tia. Baseado na pesquisa em `pesquisa-automacao-corretoras.md`.
> Regra de ouro: **na descoberta você ESCUTA, não vende.** A venda vem depois, com o demo na mão.

---

## Como usar — dois modos

**MODO A — Cliente zero (corretora da sua tia). ~45–60 min. Faça primeiro.**
É a sessão mais funda. Serve pra duas coisas ao mesmo tempo: (1) confirmar que a dor é real e
(2) **tirar a planta pra construir o sistema**. Anote tudo — vira a especificação do build.
Como é de graça pra ela, ela colabora à vontade. Esta corretora vira o seu **demo vivo**.

**MODO B — Cada corretora indicada. ~30 min. Depois que o demo existir.**
Foco em confirmar a dor e medir disposição a pagar. Você já chega podendo **mostrar funcionando**
na corretora da tia. Menos pergunta aberta, mais "isso aqui resolveria pra você? quanto valeria?".

---

## Roteiro de perguntas

> 🔧 = pergunta extra do **Modo A** (cliente zero), pra montar o sistema. No Modo B pode pular.

**Aquecimento / operação**
1. Me conta como é um dia normal aqui na corretora — da hora que abre até fechar, o que mais consome o tempo de vocês?
2. Quem cuida do operacional (cadastro, emissão, renovação, cobrança)? Uma pessoa só ou divide? Quantas no total?
3. 🔧 Com quais seguradoras vocês mais trabalham? (Porto, Bradesco, Amil, Tokio...) E quais ramos puxam mais — auto, saúde, vida, residencial?
4. 🔧 Mais ou menos quantas apólices ativas vocês têm na carteira hoje? Quantas renovações por mês?

**Renovação (a dor nº 1 — a aposta principal)**
5. Hoje, como vocês controlam os vencimentos das apólices pra renovar? Me mostra na prática (planilha, caderno, sistema)?
6. Quando foi a última vez que uma renovação passou da data ou o cliente foi avisado em cima da hora? Com que frequência? Quanto de comissão isso custa?
7. 🔧 Quando vai renovar, o que vocês mandam pro cliente, em quantos dias antes, e por qual canal?

**Cotação / lead**
8. Quando chega um pedido de cotação no WhatsApp, o que acontece da mensagem chegar até vocês responderem? Quanto tempo leva e o que trava?
9. Quantos pedidos por semana vocês não conseguem responder a tempo? O que acham que perdem com isso?

**Sistema atual (o gate técnico)**
10. Que sistema(s) vocês usam hoje (multicálculo, ERP, CRM)? O que fazem bem e o que falta?
11. ⚠️ **Desse sistema, dá pra exportar a lista de clientes e apólices numa planilha (CSV/Excel)? Vocês já fazem isso?** *(Se não sair CSV fácil, o build muda — esta resposta é crítica.)*
12. Já tentaram alguma ferramenta de WhatsApp/bot/CRM antes? O que aconteceu — funcionou, abandonaram, por quê?

**Dados / LGPD (sobretudo onde tem saúde/Amil)**
13. Como vocês lidam com documento e dado de cliente hoje (RG, CNH, declaração de saúde)? Tem preocupação com LGPD/consentimento?

**A pergunta-chave (mede a dor e o bolso)**
14. Se existisse uma coisa que avisasse o cliente da renovação sozinha, no WhatsApp da corretora, na voz de vocês, e só te entregasse o cliente pronto pra fechar — resolveria uma dor real? Pagaria por isso? **Quanto por mês faria sentido?**
15. *(Modo B, com o demo na tela)* Olha aqui rodando na corretora da [tia]. Se eu te entregasse isso montado, integrado com o que você já usa, sem você configurar nada — quanto mudaria o seu dia? O que te faria dizer sim?

---

## Ficha de captura (uma por corretora)

| Campo | Resposta |
|---|---|
| Corretora / corretor | |
| Data da conversa | |
| Nº de pessoas no operacional | |
| Seguradoras principais | |
| Ramos principais | |
| Nº apólices ativas (aprox.) | |
| Renovações/mês (aprox.) | |
| **Como controla renovação hoje** | |
| Renovação já passou da data? Com que frequência? | |
| Tempo de resposta a cotação no WhatsApp | |
| Sistema(s) que usa | |
| **Sai CSV/Excel? (Sim / Não / Não sei)** | |
| Já tentou bot/CRM antes? O que rolou? | |
| Preocupação com LGPD/saúde? | |
| **Resolveria? Pagaria? Quanto/mês?** | |
| Sinais de compra (ver abaixo) | |

---

## Especificação do cliente zero (só Modo A — corretora da tia)

Anote pra já sair construindo:
- [ ] Sistema/planilha de onde sai a carteira + **formato do export** (colunas: nome, telefone, ramo, seguradora, nº apólice, **data de vencimento**, valor/comissão)
- [ ] Número de WhatsApp que vai ser usado (linha dedicada? Z-API)
- [ ] Voz/tom das mensagens (pega exemplos de mensagens que ela já manda)
- [ ] Régua por ramo (auto/saúde renovam anual; quantos dias antes avisar)
- [ ] Quais seguradoras → montar o "mapa de seguradoras" (sinistro/2ª via/renovação de cada) — **ativo reaproveitável pra TODAS as próximas**
- [ ] Onde entra dado sensível (saúde) → desenhar o canal seguro + termo de consentimento

---

## Scorecard de validação — só constrói pra escala se bater

Depois de **3+ corretoras** (contando a da tia), marque:

**Hipótese 1 — a dor de renovação é real e paga?**
- [ ] 3+ disseram que controlam renovação na mão (planilha/caderno/memória)
- [ ] 3+ já perderam renovação por descuido
- [ ] 3+ topariam pagar recorrente (faixa R$ 300–700/mês citada como aceitável)

**Hipótese 2 — dá pra construir replicável?**
- [ ] 3+ conseguem exportar a carteira em CSV/Excel
- [ ] Os campos essenciais (telefone + ramo + **vencimento**) estão no export

**Sinais de compra a observar na conversa:**
perguntou o preço sem você puxar · falou "isso eu preciso" · já tentou e se frustrou com bot ·
reclamou de renovação específica que perdeu · pediu pra ver funcionando.

> ✅ Bateu as duas hipóteses → constrói a arquitetura-mãe e começa a fechar os indicados.
> ❌ Não bateu (ex.: ninguém exporta CSV, ou ninguém pagaria) → **me traz o resultado**, a gente
> repensa o produto antes de gastar tempo construindo.
