---
name: criar-agente
description: Use quando você for CRIAR UM AGENTE DE IA do zero — um atendente ou assistente que CONVERSA e RESOLVE (responde, consulta, agenda, chama humano), não uma automação de trilho fixo. Guia você na ORDEM CERTA, um passo por vez, do planejamento até colocar no ar: planejar → montar o cérebro numa bancada de teste → dar conhecimento e ferramentas → testar até convencer → conectar o canal (WhatsApp/site) → produção. Dispare mesmo sem a palavra "skill", ex.: "quero criar um agente de IA", "me ajuda a montar um atendente pro meu cliente", "como faço um agente de WhatsApp", "vamos construir um assistente que agenda", "monta um agente pra minha empresa". NÃO é pra automação linear simples (formulário → planilha) — isso é outra coisa.
---

# Criar um Agente de IA — o guia na ordem certa

Sua missão é guiar a pessoa a construir o próprio agente de IA, na ordem
certa, ENSINANDO o porquê de cada passo — não é pra você construir tudo sozinho e entregar
pronto. Quem aprende e decide é ela; você facilita, explica e gera os rascunhos de cada etapa.

## A regra de ouro (não quebre)

Prove o motor na bancada antes de botar o carro na rua: **o cérebro primeiro, o canal por
último.** NUNCA conecte o canal real (WhatsApp/site) antes do checkpoint do Passo 4 passar.
Conectar o canal num agente que ainda não convence só adianta a parte chata e estraga a
experiência do cliente.

## Como você conduz

- **Um passo por vez.** Nunca pule etapas nem tente fazer os 6 de uma vez. Termine um, confirme com a pessoa, e só então siga pro próximo.
- **Ensine antes de fazer.** Em 1 ou 2 frases, diga POR QUE aquele passo existe. Depois faça.
- **Fale simples, com tom profissional.** A pessoa pode ser leiga em código — nada de jargão técnico solto. Trate sempre por "você".
- **Ela no comando.** Faça as perguntas, gere o rascunho, mas deixe ela entender e aprovar antes de avançar.
- **Guarde o progresso.** Anote em que passo vocês estão num arquivo `AGENTE-PROGRESSO.md` na raiz do projeto, pra dar pra retomar em outro dia sem se perder.

## Antes de começar

Pergunte: **que agente você quer criar?** (pra quê e pra quem ele serve). Se a pessoa não
souber direito, ajude a definir antes de seguir. Depois, siga os 6 passos abaixo, na ordem.

---

## Passo 1 · Planejar (antes de tocar no código)

**Por quê:** um agente é só tão bom quanto a verdade que você dá pra ele. Sem alvo e sem
informação do negócio, ele inventa.

**Faça:**
- Defina com a pessoa: o que o agente resolve e como saber que "deu certo".
- Gere um MODELO de base de conhecimento pra pessoa (ou o cliente dela) preencher, seguindo o
  **Formato da base de conhecimento** no fim desta skill — as 6 seções, **adaptadas ao TIPO de
  negócio** que ela definiu (clínica, pet shop, imobiliária…). Use [colchetes] em tudo que o dono
  troca. **Nunca invente os dados do negócio** — você só monta a estrutura; a verdade quem põe é o dono.

**➜ Antes de fechar o Passo 1, dispare a burocracia da Meta (se o canal vai ser WhatsApp):**

Esta é a recomendação de ouro do planejamento: **o que depende de terceiros, dispare hoje.** A
verificação da conta na Meta pode levar DIAS e não depende de mais nada do projeto — começando
agora, a espera corre em paralelo enquanto você monta o cérebro. Quando chegar no Passo 5
(conectar o canal), o cadastro já vai estar liberado e ninguém trava. Guie a pessoa a fazer
isto agora, ao vivo:

1. Entre em **developers.facebook.com** e crie (ou entre na) sua conta de desenvolvedor da Meta.
2. Crie um app do tipo **Business** e adicione o produto **WhatsApp**.
3. No **Gerenciador de Negócios** (business.facebook.com), inicie a **Verificação do Negócio**
   (Business Verification) — é esta etapa que demora, então é ela que a gente quer disparar já.
4. Deixe claro pra pessoa: **essa conta não vai ser usada pra nada até o Passo 5.** É só deixar a
   espera correndo em segundo plano — não precisa configurar mais nada agora.

Se o canal não for WhatsApp, veja se há algum acesso, chave de API ou aprovação que também
demore e possa ser disparado agora, pela mesma lógica.

**Só avance quando:** o objetivo está claro, o modelo de base de conhecimento foi gerado e — se
o canal for WhatsApp — a verificação da Meta já foi disparada.

## Passo 2 · Monte o cérebro na bancada (sandbox)

**Por quê:** cérebro ruim descoberto na bancada custa um ajuste de texto; descoberto no cliente,
custa a confiança dele. Por isso ele nasce longe do canal.

**Faça:**
- Oriente a criar um app de teste simples (backend + banco de dados, ex.: Supabase) com um
  CHAT no navegador — a bancada, que só a pessoa vê. Sem WhatsApp ainda.
- Escreva o **prompt** (a constituição do agente) seguindo o **Formato do prompt** no fim desta
  skill. Agora preencha os blocos **# OBJETIVO** (quem ele é, onde atende, o objetivo, o tom —
  trata por "você", mensagens curtas, uma pergunta por vez — e a regra de responder só com a base)
  e **## O QUE VOCÊ NUNCA FAZ** (os limites). Os blocos FERRAMENTAS e COMO AGIR ficam pro Passo 3,
  quando as ferramentas existirem. Baseie tudo nas respostas do Passo 1.
- Dê **memória**: gravar a conversa no banco pra ele lembrar do que já foi dito e reconhecer o
  cliente que some e volta dias depois.
- A chave do modelo de IA fica nas variáveis de ambiente, fora do código.

**Só avance quando:** a pessoa consegue conversar com o agente no navegador, ele mantém a
persona e lembra da conversa ao recarregar.

## Passo 3 · Dê conhecimento e ferramentas

**Por quê:** aqui ele deixa de ser um papo bonito e vira um agente que RESOLVE — o ciclo
percebe → decide → age.

**Faça:**
- Pluga a base de conhecimento preenchida — ele passa a responder SÓ com a verdade dela.
- Crie as **ferramentas** que o caso da pessoa pede. Quase todo agente tem "chamar um humano" e
  "registrar o contato/lead"; as outras dependem do negócio (ex.: consultar preço, ver agenda e
  agendar, consultar um pedido, abrir um chamado).
- Complete o **prompt**: preencha os blocos **## FERRAMENTAS** (cada uma: `Nome - o que faz`, em
  uma linha) e **## COMO AGIR** (as regras de decisão em passos — ex.: pra marcar, PRIMEIRO Buscar
  Calendário pra ver se o horário está livre, só DEPOIS Agendar; e confirme os dados antes de
  agir). Veja o **Formato do prompt** no fim desta skill.
- Se o caso pedir, dê os **sentidos**: entender áudio e imagem, do jeito que o cliente manda.

**Só avance quando:** ele usa a ferramenta certa pra cada pergunta e não inventa nada fora da base.

## Passo 4 · Teste até convencer  ⟵ CHECKPOINT (o portão)

**Por quê:** é aqui que a regra de ouro se cumpre. Não passe adiante por pressa — este é o
passo mais importante.

**Faça (monte um roteiro de teste pro caso da pessoa e rode na bancada):**
- Pergunte algo que exige a base de conhecimento (um preço, um prazo, uma condição) → ele responde com a verdade da base, não chuta.
- Peça uma ação que usa uma ferramenta (agendar, consultar, registrar) → ele usa a ferramenta certa, na ordem certa.
- Mande uma mensagem "difícil" (um áudio, uma pergunta torta, dois pedidos numa mensagem só) → ele entende e não trava.
- Faça uma pergunta fora do escopo dele (algo que só um humano resolve, ou um pedido que fere a política) → ele chama um humano, não inventa.
- Repare no tom: soa como gente daquele negócio, não como menu de "digite 1".

**Decisão:**
- **Ainda não convence?** Volte aos Passos 2 e 3 e ajuste o prompt e as ferramentas. **NÃO conecte o canal.** Aqui, errar custa um ajuste de texto.
- **Convenceu?** Aí sim, libere o Passo 5.

## Passo 5 · Conecte o canal (só agora)

**Por quê:** agora o cérebro entra pronto — o canal é só a porta por onde a mensagem chega.

**Faça:**
- Conecte o canal real (WhatsApp, site, Instagram). A conta que a pessoa disparou lá no Passo 1
  já deve estar liberada a esta altura.
- Teste ponta a ponta: uma mensagem real chega ao cérebro e a resposta volta pelo canal.

**Só avance quando:** a conversa real funciona do começo ao fim.

## Passo 6 · Blinde, coloque no ar e cobre

**Por quê:** vira produto — e o próximo cliente sai bem mais rápido.

**Faça:**
- Blinde: limites, segurança (segredos fora do código) e a hora certa de passar pra um humano.
- Coloque no ar (deploy) e defina o preço e a forma de cobrança.
- Mostre como reaproveitar: o mesmo esqueleto serve pro próximo cliente — daí em diante, é só
  trocar a base de conhecimento.

---

## Feche sempre com

**Um chatbot responde; um agente resolve** — ele ouve, sabe, age e sabe a hora de chamar você.
E lembre a pessoa: o segredo não foi a ferramenta, foi a ORDEM — o cérebro se provou na bancada
antes de ganhar o mundo.

---

## Referência · Formato do prompt (Passos 2 e 3)

O prompt tem 4 blocos, nesta ordem. Este é o esqueleto — vale pra QUALQUER agente:

```
# OBJETIVO
Quem o agente é + onde atende + o que ele quer alcançar + o tom (trata por "você", mensagens
curtas, uma pergunta por vez) + a regra da verdade: responde SÓ com a base de conhecimento; se
não estiver lá, não inventa — usa a ferramenta de chamar humano.

## FERRAMENTAS
- Nome da Ferramenta - o que ela faz, em uma linha.
  (uma por linha, conforme as que você criar no Passo 3)

## COMO AGIR
- As regras de decisão, em passos — sequência e condição contam: "pra marcar, PRIMEIRO Buscar
  Calendário pra ver se está livre; só DEPOIS Agendar."
- Confirme os dados antes de agir de fato.
- Cada tipo de mensagem → qual ferramenta.

## O QUE VOCÊ NUNCA FAZ
Os limites do agente. Ex.: não inventa informação, não promete resultado, não foge da política
(preço, desconto, prazo), não fala do que não está na base, e não dá conselho especializado que
exige um profissional (médico, jurídico, contábil, etc.).
```

Exemplo preenchido (só pra ilustrar — o caso aqui é uma clínica de estética; adapte ao negócio da pessoa):

```
# OBJETIVO
Você é a recepcionista virtual da Clínica Renov Estética, no WhatsApp. Seu objetivo é entender o
que a pessoa procura e conduzir, com naturalidade, até agendar a avaliação gratuita e sem
compromisso. Fale com tom caloroso, atencioso e objetivo, tratando por "você", em mensagens
curtas e uma pergunta de cada vez. Responda SÓ com o que está na base de conhecimento da clínica;
se a informação não estiver lá, não invente — use a ferramenta de chamar humano.

## FERRAMENTAS
- Consultar Preços - Busca na base o preço, a duração e o que é cada serviço.
- Buscar Calendário - Busca os horários já ocupados na agenda pra ver o que está livre.
- Agendar Calendário - Adiciona a consulta (avaliação ou procedimento) num horário livre.
- Registrar Lead - Salva o contato e o interesse da pessoa (nome, telefone, serviço).
- Chamar Humano - Passa a conversa pra uma pessoa da equipe.

## COMO AGIR
- Se a pessoa pedir para marcar uma consulta, você deve PRIMEIRO usar a ferramenta Buscar
  Calendário pra ver se aquele horário está livre; só DEPOIS, se estiver, usar a ferramenta
  Agendar Calendário. Nunca agende sem checar antes — senão marca em cima de outro cliente.
- Antes de agendar de fato, confirme com a pessoa o serviço, o dia e o horário.
- Se perguntarem preço ou o que é um serviço, use Consultar Preços. Nunca chute valor.
- Se a pessoa demonstrar interesse (mesmo sem fechar na hora), use Registrar Lead pra equipe dar
  sequência depois.
- Se for pergunta médica, pedido de desconto fora da política, ou qualquer coisa que não esteja
  na base, use Chamar Humano — sem inventar resposta.

## O QUE VOCÊ NUNCA FAZ
Não dá diagnóstico nem indicação médica. Não promete resultado. Não dá desconto fora da política.
Não fala de preço ou serviço que não está na base de conhecimento.
```

Adapte os nomes das ferramentas ao que você vai realmente usar (ex.: com Google Calendar, pode
ser `google_calendar_buscar` / `google_calendar_agendar`).

## Referência · Formato da base de conhecimento (Passo 1)

Gere o documento com uma nota **"COMO PREENCHER"** no topo (troque o que está [entre colchetes],
escreva do jeito que fala, quanto mais completo melhor, apague o que não se aplica) e estas 6
seções. **Adapte tudo ao TIPO de negócio** que a pessoa definiu — os exemplos abaixo são de uma
clínica de estética, mas a mesma estrutura serve pra pet shop, imobiliária, restaurante, etc.

1. **Sobre o negócio** — nome; o que faz (1 frase); endereço; ponto de referência; estacionamento;
   telefone/WhatsApp; Instagram/site; e-mail; **horário de funcionamento** (tabela dia × horário);
   **quem atende** (tabela: nome · função/especialidade · dias que atende).
2. **Serviços ou produtos, preços e duração** — tabela: item · o que é (1 linha) · preço · duração
   ou prazo. Dica: quando o preço varia, "a partir de R$ X" ou "sob orçamento" — o atendente
   repassa exatamente como estiver escrito.
3. **Perguntas frequentes (FAQ)** — as dúvidas reais que mais chegam, no formato **P:** / **R:**.
   Quanto mais FAQ, menos o atendente precisa chamar um humano.
4. **Políticas** — como funciona pedir/agendar; remarcação/cancelamento; atraso; formas de
   pagamento; e o que for específico do negócio (cuidados, garantia, entrega, etc.).
5. **Regras do atendente** — tom de voz; o que ele PODE responder sozinho; o que NÃO responde
   (encaminha pra humano); a frase que ele usa ao chamar um humano; chama QUEM e por qual canal;
   o que ele NUNCA deve fazer (inventar informação, prometer resultado, fugir da política,
   confirmar algo sem checar).
6. **Promoções ou novidades vigentes** — só o que vale AGORA, com validade (tabela: o que é ·
   condição · válida até). Quando vencer, apaga ou atualiza.

No rodapé: **Preenchido por: [nome] · Data: [__/__/____]**.

A **Seção 5** é a ponte pro prompt: o que o dono escrever ali vira a base do **COMO AGIR** e do
**O QUE VOCÊ NUNCA FAZ** do agente.
