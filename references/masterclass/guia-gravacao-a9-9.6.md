# 🎬 A9 (roteiro 9.6) — Guia de gravação: Blindar + vender

> Guia do Enzo, não material de aluno. Formato da 9.5: **a ordem em 9 linhas curtas** + o detalhe
> logo abaixo de cada uma. O roteiro completo (`roteiro-modulo-09-atendente-whatsapp.md`, seção
> 9.6) é referência, não teleprompter. Criado 30/07/2026.
>
> **Aula:** o agente ganha a trava contra inventar (regra de ouro) e aprende a conduzir a venda.
> **Tempo estimado:** 20-25 min de vídeo. **Decisão 29/07:** a cobrança NÃO é construída — vira
> um aparte de ~20s (passo 6).

---

## A ordem, de bate-olho

1. Abertura — "voltei pra API oficial" (~40s) + a correção do chip dedicado (~30s)
2. O vilão ao vivo: o agente inventa criolipólise
3. **Prompt 1** — a regra de ouro, do jeito reativo → testa de novo
4. O funil na tela (conceito, sem código)
5. **Prompt 2** — o funil + a marcação de lead quente
6. Teste do funil no WhatsApp + **o aparte dos 20s sobre pagamento**
7. O momento-vitrine: áudio → agenda real (o plano que vende os R$ 8k)
8. **Prompt 3** — o lembrete por template aprovado
9. O sinal do handoff → ponte pra 9.7 (o painel)

---

## ✅ ETAPA 0 — Antes de ligar a câmera

**⚠️ O item do template é o único que pode te travar no dia. Faça com dias de antecedência.**

- [ ] **Template do lembrete JÁ SUBMETIDO e aprovado na Meta** (Gerenciador do WhatsApp →
      Modelos de mensagem → categoria **Utilidade**). A aprovação leva de minutos a 24h — se você
      submeter no dia, a aula trava no passo 8. **Tenha um aprovado de reserva.**
      Texto sugerido (variáveis entre chaves):
      `Oi, {{1}}! Passando pra lembrar do seu horário na Renov Estética: {{2}}, {{3}} às {{4}}. Estamos na {{5}}. Qualquer coisa é só responder por aqui.`
- [ ] **Projeto de volta na API oficial** — branch `API-oficial-renove` ativa no Antigravity,
      Railway com as variáveis da Cloud API (`WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
      `WHATSAPP_VERIFY_TOKEN`, `META_APP_SECRET`) e o WAHA desligado. **Faça isso ANTES** — na
      câmera só a confirmação de 40s (passo 1).
- [ ] **Teste ponta a ponta funcionando** antes de gravar: manda "oi" do celular-cliente e o agente
      responde. Se estiver mudo, é webhook ou variável — resolva fora do vídeo.
- [ ] **Confirme na base (`constituicao.md`) que existe:** formas de pagamento (Pix, dinheiro,
      débito, crédito em 6x) e a política de **sinal de 30% acima de R$ 800**. São elas que o
      agente vai INFORMAR no passo 6.
- [ ] **Confirme que criolipólise NÃO está na base** — é o vilão do passo 2. Se estiver, escolha
      outro serviço inexistente (ex.: depilação a laser) e ajuste a fala.
- [ ] **Celular-cliente** na mão, com o número do atendente salvo · Google Calendar da Renov aberto
      numa janela lateral (você vai usar no passo 7) · Supabase aberto numa aba (passo 9)
- [ ] Grave um **áudio de cliente** antes: *"oi, queria marcar uma limpeza de pele quinta à tarde"*

---

## 1 · Abertura: "voltei pra API oficial" + a correção do chip

**~40s pra retomada.** Não refaça na câmera — só mostre e siga. Abra o Source Control, mostre a
branch `API-oficial-renove` ativa, e fale:

> *"Como eu falei no vídeo passado, eu já voltei tudo pra API oficial: o projeto, o Railway, tudo.
> E repara numa coisa — pra trocar o canal duas vezes, ida e volta, eu não encostei no cérebro do
> agente. O prompt, a base de conhecimento, as ferramentas, a memória: intactos. Guarda isso, é a
> tese do módulo inteiro."*

**~30s pra correção** (fecha a ambiguidade entre a A6 e a A7 — o vault pegou isso):

> *"E antes de continuar, uma correção importante, porque eu falei disso em duas aulas diferentes
> e pode ter ficado confuso. Na API oficial, você PODE usar o número oficial da empresa, com selo
> de verificado — não tem problema nenhum. O motivo de eu recomendar um chip dedicado não é medo
> de bloqueio: é que quando você conecta um número na API oficial, esse número SAI do aplicativo
> do celular. Ninguém da clínica consegue mais abrir o WhatsApp e conversar por ali. Se esse é o
> número que a recepcionista usa todo dia, você acabou de tirar uma ferramenta dela. Por isso o
> chip dedicado. Na API não oficial o motivo é outro — lá é risco de ban mesmo."*

---

## 2 · O vilão: o agente inventa

Pelo celular-cliente, no WhatsApp real:

> *"vocês fazem criolipólise? quanto custa?"*

Deixe o agente inventar/enrolar **com toda a segurança na resposta**. Mostre a mensagem em tela
cheia. Fala:

> *"Olha o que acabou de acontecer. Esse serviço não existe na clínica. Ele conversa, ele ouve
> áudio, ele agenda, ele salva o cliente na planilha... e mente na cara dura, com uma segurança
> impressionante. E mentira com preço no WhatsApp do cliente não é bug de programa — é a clínica
> perdendo a confiança do cliente, e é você perdendo o contrato de R$ 8 mil."*

**Se ele NÃO inventar** (o modelo às vezes acerta): tente de novo pedindo desconto —
*"consegue me fazer por 300?"* — ou um serviço com preço específico que não existe. Você precisa
do erro em tela; é ele que justifica a regra.

---

## 3 · Prompt 1 — a regra de ouro

Este é o jeito reativo da 9.3: apareceu o problema, **agora** escreve a regra. Diga isso em voz
alta, é didática do curso.

```
Quando perguntam algo que não está na base de conhecimento, o meu agente enrola ou inventa. Adiciona na seção "Nunca faça isso" do prompt-agente.md: ele só responde com o que está na base; se a informação não estiver lá, ele diz que vai confirmar com a equipe e sinaliza pra um humano assumir; e ele nunca inventa preço, desconto ou promessa. Altera só o prompt de sistema, mais nada.
```

Mostre o `prompt-agente.md` ganhando a regra na seção "Nunca faça isso". **Refaça o teste da
criolipólise** — mesmo cérebro, resposta oposta: *"vou confirmar com a equipe"*.

> *"Repara: eu não mudei o modelo, não mudei a base, não escrevi uma linha de código. Eu escrevi
> uma regra. É essa regra que protege a clínica — e o seu contrato. Guarda ela, porque na última
> aula do módulo a gente vai construir um robô só pra tentar quebrar essa regra."*

---

## 4 · O funil na tela (conceito, sem código)

Desenhe/mostre as 4 etapas: **qualificar → recomendar → agendar → chamar o humano.**

Concretize com a Renov: chega *"quanto custa botox?"*

- Chatbot genérico: *"R$ 900."* → **a conversa morre ali.**
- O nosso: pergunta o objetivo, sugere a avaliação gratuita, conduz pro horário.

> *"A clínica não paga R$ 8 mil por um robô que responde. Ela paga pelo que ele FECHA. E vender
> numa conversa é uma coisa só: saber em que etapa a conversa está e fazer a ação que fecha aquela
> etapa."*

Lembre que **a agenda real já está de pé desde a aula 4** (conta de serviço + calendário
dedicado). Aqui não tem integração nova — o funil só USA o que já existe.

---

## 5 · Prompt 2 — o funil + o lead quente

```
Agora eu quero que o meu atendente conduza a venda. Quando a pessoa demonstrar interesse, ele qualifica: pergunta o que ela procura e pra quando, uma pergunta por vez. Depois recomenda só serviços que existem na base, com o preço de lá. Quando a pessoa perguntar de pagamento, ele responde com as formas de pagamento e a política de sinal que estão na base, e avisa que o pagamento é feito na clínica -- ele não cobra nem manda link. E quando o cliente pedir pra fechar, negociar desconto ou fizer uma pergunta que deve ir pro humano, ele marca o lead como quente no Supabase e avisa o dono. Antes de codar, me explica em uma frase por etapa como ele vai saber em que etapa a conversa está.
```

**Leia a explicação da IA com o aluno ANTES de deixar codar** — é o hábito que o curso ensina.
Depois mostre que preço, formas de pagamento e política de sinal vêm **da base**, não do código.

---

## 6 · Teste do funil + o aparte dos 20s

Pelo celular-cliente: *"quanto é o preenchimento labial?"*

O agente qualifica → recomenda (R$ 1.200, o preço da base) → e, ao falar de pagamento, **informa**:
formas de pagamento e o sinal de 30% (R$ 360), pago na clínica. Conduz pro horário.

**Aqui, olhando pra câmera (~20s, sem demo, sem link de teste):**

> *"Repara que ele só INFORMA o pagamento — ele não cobra, não manda link. Pra essa clínica é
> assim mesmo: o cliente paga no balcão. Agora, se o SEU cliente quiser link de cobrança automático
> na conversa, isso é só mais uma ferramenta — exatamente a mesma receita que a gente usou na aula
> 4 pra conectar a agenda: você chama a API do sistema de cobrança que ele já usa, InfinitePay,
> PagSeguro, o link do banco. É um pedido no chat. Não é o caso da Renov, então eu não vou
> construir aqui."*

E emende com a lição, que é maior que o aparte:

> *"E fica a regra: nem toda etapa do funil vira ferramenta. Ferramenta é onde o agente precisa
> AGIR. Onde ele só precisa SABER, é dado na base. Cada ferramenta a mais é mais coisa pra dar
> errado — e mais token pra pagar."*

---

## 7 · O momento-vitrine: áudio → agenda real

**É o plano que vende o serviço.** Google Calendar aberto do lado, visível.

Mande o **áudio** gravado na Etapa 0: *"oi, queria marcar uma limpeza de pele quinta à tarde"*.

O agente entende (sentidos, aula 5), consulta os horários realmente livres, oferece, confirma — e
o **evento aparece no Calendar ao vivo**. Deixe o silêncio trabalhar por 2 segundos.

> *"Um cliente mandou um áudio às onze da noite. Ninguém da clínica estava acordado. E o horário
> está marcado na agenda. É isso que você está vendendo."*

---

## 8 · Prompt 3 — o lembrete por template

```
Agora quero o lembrete automático: no dia anterior a cada horário marcado, o atendente manda uma mensagem no WhatsApp do cliente confirmando o serviço, o dia, a hora e o endereço, puxando tudo da agenda e da base. Como pode ter passado mais de 24 horas, essa mensagem precisa sair como template aprovado da API oficial -- deixa o texto pronto pra eu colar e me diz o passo a passo pra aprovar no painel da Meta. Se o cliente responder ao lembrete, o agente assume a conversa e atualiza a agenda. Não mexe no que já funciona.
```

Mostre o template no painel da Meta (o que você já aprovou na Etapa 0 — diga que submeteu antes
porque a aprovação demora; é informação útil pro aluno). Simule o dia anterior e mostre o
lembrete chegando no celular-cliente com o horário puxado da agenda.

Amarre com a regra da A7, que o aluno já viu:

> *"Lembra da tabela de preços da aula passada? Essa mensagem aqui é categoria utilidade, uns
> três centavos e meio. Quinhentos lembretes no mês dão uns dezessete reais. É o custo de não
> deixar a agenda esvaziar."*

> *"Agenda cheia não é agenda confirmada. O lembrete é o que segura o cliente."*

---

## 9 · O handoff → ponte pra 9.7

Pelo celular-cliente, faça a pergunta que a base proíbe:

> *"qual o melhor procedimento pro meu caso?"*

O agente responde que vai passar pra equipe, **marca o lead como quente no Supabase** (mostre a
linha no banco, ao vivo) e o dono é avisado.

⚠️ **Lembre o split da aula 4 em uma frase:** cadastro de cliente vive no **Google Sheets**; a
memória e o **lead quente** vivem no **Supabase**.

**Fecho:**

> *"O sinal nasceu — mas ele nasceu dentro de um banco de dados que o dono da clínica nunca vai
> abrir. Na próxima aula esse sinal ganha casa: o painel onde o dono vê tudo o que o agente está
> fazendo, vê o funil, e assume a conversa quando o lead esquenta."*

---

## ⚠️ Gotchas desta gravação

| Risco | Como se proteger |
|---|---|
| **Template não aprovado a tempo** | Submeta dias antes + tenha um de reserva já aprovado. É o único bloqueador real da aula. |
| **O agente não inventa no passo 2** | Tenha 2-3 perguntas-armadilha prontas (serviço inexistente, desconto, promessa). Precisa do erro em tela. |
| **Janela de 24h fechada na hora do teste** | Mande uma mensagem do celular-cliente pouco antes de gravar pra manter a janela aberta — senão o texto livre não sai. |
| **Aula inchar** | Sem a construção da cobrança, cabe em um vídeo. Se passar de 30 min, o corte natural é entre o passo 7 e o 8 (lembrete vira vídeo próprio). |
| **Aparte do pagamento virar aula** | 20 segundos, sem abrir nenhum site de cobrança. Se abrir o InfinitePay na tela, já perdeu. |

---

## Depois desta

**A10 = 9.7 (painel do dono)** — atenção: na A7 você prometeu em vídeo *"gráficos de quantas
conversas foram fechadas, quantas ficaram em uma etapa específica"*. O painel precisa nascer com
**visão de funil**, não só lista de conversas. **A11 = 9.8** (quebrar + revender + cobrar), **sem**
o segmento do Meta Business Agent — a A7 já entregou ele inteiro.
