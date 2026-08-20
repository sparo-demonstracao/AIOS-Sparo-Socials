# 🎬 A10 e A11 — Guia de gravação (M9)

> ## ✅ STATUS 12/08/2026 — A A10 JÁ FOI GRAVADA E POSTADA (11/08, 11min29s)
>
> Transcrita e ingerida no vault. **A seção da A10 abaixo é histórico** — o que ela entregou:
> layout em tela cheia, os 2 templates na Meta (com botões), a aba Templates no painel e a
> reabertura ao vivo de uma conversa de 19 dias. **O que ela NÃO entregou:**
> - **o tratamento do clique do botão** (o Prompt 3 não foi rodado) — e ela AFIRMA em vídeo que o
>   clique abre a janela de 24h. **Vira o Bloco 0 da A11.**
> - a campanha de remarketing pelo Sheets (Prompt 4) — virou **enquete nos comentários**
>
> **Achado da A10 que muda a A11:** o agente admitiu em produção ter passado um horário que
> *"não ficou confirmado de verdade"*. **O vilão da regra de ouro agora é real e está gravado** —
> use o histórico dessa conversa em vez de só a armadilha da criolipólise.
>
> **Achado que vai pra A12 (9.8):** o painel deixou de ser só leitura — agora envia mensagem
> cobrada pra cliente, sem autenticação declarada. Virou item **bloqueante** pra entregar a
> cliente real, e entra no bloco de blindagem junto com as travas de custo.

> Criado 11/08/2026, logo depois de postar a **A9 (painel do dono)**. Guia do Enzo, não material de
> aluno. Substitui o `guia-gravacao-a9-9.6.md` na parte do lembrete/template (migrou pra A10) e
> corrige o fecho do 9.6 (o painel JÁ existe).
>
> **Numeração:** gravação A10 = aula nova (não existia no roteiro) · gravação A11 = **9.6 do roteiro**.

---

# A10 — "Reiniciar a conversa: templates aprovados + reativação"

**Promessa a cumprir (você falou em vídeo na A9):** a nova aba de templates de mensagem, o ajuste do
layout (tela cheia em vez de pop-up) e a campanha de remarketing pelo Sheets ("promoção de botox pra
quem teve interesse em botox").

**Tempo estimado:** 22-28 min.

## ✅ Antes de ligar a câmera

- [ ] **Os 2 templates JÁ SUBMETIDOS** na Meta (o `lembrete_consulta` de Utilidade e o
      `promocao_servico` de Marketing — textos na Etapa 5 abaixo). É o ÚNICO bloqueador real da
      aula: aprovação leva de minutos a 24h. **Tenha um terceiro de reserva já aprovado.**
- [ ] Branch `api-oficial-renove` ativa + Railway com as vars da Cloud API + WAHA desligado
- [ ] Painel do dono no ar (o da A9) e Google Sheets da Renov com a coluna de **interesse**
      populada — precisa ter 2-3 clientes com "botox" pra a campanha fazer sentido
- [ ] Uma conversa com a **janela de 24h FECHADA** (cliente que não responde há mais de 1 dia) —
      é ela que você vai reabrir ao vivo. **Sem isso a demo principal não acontece.**
- [ ] **Pegue o WABA ID** agora (Gerenciador do WhatsApp → Configurações da conta, ou no topo da
      página de modelos) — o prompt 2 vai pedir
- [ ] Celular-cliente na mão

## A ordem, de bate-olho

1. Abertura: o buraco — "o cliente parou de responder e você não pode fazer nada"
2. **A correção dos 30s** (chip dedicado / número da empresa) — fecha a ambiguidade A6↔A7
3. **Prompt 1** — ajuste do layout em tela cheia (a promessa da A9)
4. Conceito: janela de 24h, template e as 3 categorias — com a tabela de preços na tela
5. **Painel da Meta, campo por campo** — criar o template do lembrete + o de promoção
6. **Prompt 2** — a aba de Templates no painel + o botão de reabrir conversa
7. **Demo 1:** reabrir ao vivo uma conversa morta com template de Utilidade
8. **Prompt 3** — o clique nos botões de resposta rápida (o agente assume a conversa)
9. **Prompt 4** — a reativação pelo Sheets (campanha segmentada por interesse)
10. **Demo 2:** campanha de botox pra 2-3 clientes (NUNCA a lista toda)
11. Qualidade do número: bloqueio, limite de envio e a regra de não encher o cliente
12. Fecho → ponte pra A11 (blindar + vender)

---

## 1 · Abertura: o buraco

- Abra o painel da A9 e aponte uma conversa parada: o cliente perguntou, o agente respondeu, e
  **sumiu**. Não fechou, não agendou.
- *"Esse cliente aqui parou de responder há três dias. Se eu tentar mandar uma mensagem pra ele
  agora, a Meta simplesmente não entrega. E é aqui que muita gente perde a venda que já estava na
  mão."*
- Diga o que a aula entrega: **um jeito de reiniciar conversa** — e, de brinde, o motor de
  remarketing que faz a clínica vender pra quem já falou com ela.

## 2 · A correção dos 30s (não pule — está pendente desde a A6)

> *"Uma correção rápida antes de continuar. Na API oficial você PODE usar o número oficial da
> empresa, com selo de verificado — não tem problema nenhum. O motivo de eu recomendar um chip
> dedicado não é medo de bloqueio: é que quando você conecta um número na API oficial, esse número
> SAI do aplicativo do celular, como eu mostrei no fim da aula passada. Ninguém da clínica abre o
> WhatsApp e conversa por ali. Se é o número que a recepcionista usa todo dia, você acabou de tirar
> uma ferramenta dela. Na API não oficial o motivo é outro — lá é risco de ban mesmo."*

## 3 · Prompt 1 — o layout (a promessa da A9)

## 4 · O conceito + a tabela na tela

- **Janela de 24h** (recap da A7): cliente escreve → você responde à vontade por 24h. Cada resposta
  dele reabre a janela. Passou 24h sem mensagem dele, **texto livre não entrega** — só template.
- **As 3 categorias e os preços que VOCÊ já deu na A7** (repita idênticos):
  - **Marketing** (promoção, oferta) — **R$ 0,32/mensagem**, a mais cara
  - **Utilidade** (lembrete de consulta, confirmação) — **~R$ 0,035/mensagem**
  - **Autenticação** (código de verificação) — mesmo preço da Utilidade
- A regra que vale ouro: **template pago → cliente responde → abre 24h de conversa livre.** Você
  paga a entrada, não a conversa.
- ⚠️ **Nova tabela sai 01/09 e vale a partir de 01/10** — diga de novo que vai trazer quando sair.
- Callback da conta da A7: os R$ 17,50 de 500 lembretes e os R$ 643 da campanha pra 2 mil clientes
  saem exatamente daqui. *"Aquela conta que eu fiz duas aulas atrás? É essa aba que gera ela."*

## 5 · O painel da Meta, campo por campo

**Como chegar:** `business.facebook.com/wa/manage/message-templates/` — ou `business.facebook.com` →
**Todas as ferramentas** → **Gerenciador do WhatsApp** → **Ferramentas de conta** → **Modelos de
mensagem**. (Em inglês: *Account tools → Message templates*.)

⚠️ Fale em voz alta: os modelos **não ficam no painel do app** em `developers.facebook.com` (onde
você pegou as credenciais na aula 6). *"O app é onde ficam as chaves; o modelo de mensagem fica no
gerenciador do negócio."*

**Gancho:** o `hello_world` que você disparou na aula 6 pra provar que a API funcionava **era um
template**. Hoje o aluno cria os dele. Fecha o arco.

### Template 1 — o lembrete (Utilidade)

| Campo | O que preencher | Por quê (pro vídeo) |
|---|---|---|
| **Categoria** | **Utilidade** | é lembrete de algo já contratado. ~R$ 0,035 |
| **Nome** | `lembrete_consulta` | minúsculas e underline, sem acento nem espaço. **Não muda depois de aprovado** — é o nome que o código chama |
| **Idioma** | Portuguese (BR) | o código manda `pt_BR`. Idioma trocado = erro de "template não encontrado", o tropeço nº 1 |
| **Tipo de variável** | **Número** (troque ANTES de adicionar variáveis) | sai `{{1}}`, `{{2}}`. Com "Nome" o código precisa mandar o nome de cada variável — mais coisa pra dar errado |
| **Amostra de mídia** | Nenhum | só serve se o cabeçalho fosse imagem ou PDF |
| **Cabeçalho** | `Lembrete do seu horário` (fixo, sem variável) | aparece em negrito no topo, dá cara de empresa, não custa nada |
| **Corpo** | ver abaixo | as variáveis entram pelo botão **+ Adicionar variável** — digitar `{{}}` na mão não vale |
| **Rodapé** | `Renov Estética` | rodapé não aceita variável |
| **Botões** | 2 de **Resposta rápida**: `Confirmar presença` e `Preciso remarcar` | **é o momento mais valioso da aula** — ver abaixo |
| **Período de validade** | deixe desligado | mas explique em 15s: se não entregar no prazo, **você não paga** |

**Corpo:**

```
Olá {{1}}, tudo bem? Passando para lembrar da sua {{2}} na Renov Estética amanhã, {{3}}. Estamos na {{4}}. Se precisar remarcar, é só responder por aqui.
```

**Amostras (pedidas antes do "Enviar para análise"):** `{{1}}` Carla · `{{2}}` limpeza de pele ·
`{{3}}` quinta-feira às 14h · `{{4}}` Rua das Palmeiras, 120 – Copacabana

**As 3 regras da Meta que valem falar em voz alta:** não comece nem termine o texto com variável;
nunca duas variáveis colada uma na outra (`{{1}} {{2}}`); todo `{{n}}` precisa de exemplo preenchido.
E: **quem classifica a categoria é a Meta, não você** — marketing disfarçado de utilidade é
reprovado ou reclassificado, e aí você paga preço de marketing sem saber.

**O ponto dos botões (fale devagar, é a sacada da aula):**

> *"Repara no que esses dois botões fazem com a conta. O clique do cliente conta como resposta —
> então ele abre a janela de 24 horas. Eu pago três centavos e meio pelo lembrete e ganho um dia
> inteiro de conversa livre com esse cliente. O botão não é enfeite: é o que transforma uma mensagem
> paga numa conversa de graça."*

### Template 2 — a promoção (Marketing)

Nome `promocao_servico`, categoria **Marketing**, mesmo idioma, mesmo tipo de variável:

```
Oi {{1}}! Tem novidade na Renov Estética: {{2}} com condição especial até {{3}}. Quer que eu veja um horário para você?
```

Botão de resposta rápida: `Quero saber mais`. Amostras: `Carla` · `botox` · `sexta-feira`.

Mostre os dois lado a lado na lista — **R$ 0,035 vs R$ 0,32**, mesma tela, mesma clínica. É a
diferença de preço aparecendo na prática.

## 6 · Prompt 2 — a aba de Templates

- **Leia a explicação da IA antes de deixar codar** (o hábito do curso). O ponto que ela precisa
  acertar: a janela se calcula pela **data da última mensagem DO CLIENTE**, não da última mensagem
  da conversa.

## 7 · Demo 1 — reabrir uma conversa morta

- Escolha a conversa parada, clique em reabrir, escolha o `lembrete_consulta`, preencha as variáveis
  e envie.
- Mostre a mensagem **chegando no celular-cliente**, com o cabeçalho em negrito e os dois botões.
- *"Custou três centavos e meio pra trazer de volta um cliente que ia sumir. Uma limpeza de pele
  na Renov é 180 reais."*
- Volte pro painel e mostre a mensagem registrada no histórico da conversa, marcada como template.

## 8 · Prompt 3 — o clique do botão

- Clique em **Confirmar presença** no celular e mostre: a janela abre, o agente reage, o histórico
  atualiza. Depois teste o **Preciso remarcar** e deixe o agente conduzir a remarcação com a agenda
  real (a da aula 4).
- *"O cliente não digitou nada. Ele encostou o dedo numa tela e o agente já sabia o que fazer."*

## 9 · Prompt 4 — a reativação pelo Sheets

- O detalhe que salva o aluno: **prévia com contagem e custo antes de disparar.** Sem isso ele
  manda 2 mil mensagens sem querer.

## 10 · Demo 2 — a campanha de botox

- Filtre por interesse "botox", mostre a prévia (quantos + custo) e envie **pra 2 ou 3 números
  seus**. ⚠️ **NÃO dispare a lista toda na câmera** — custo real e risco de qualidade do número.
- Mostre a mensagem chegando com o nome certo. Clique em **Quero saber mais** e mostre o agente
  assumindo a conversa dentro da janela nova.
- Frase de valor: *"a clínica tem uma lista de gente que já quis comprar. Isso não é lead frio, é
  cliente com interesse declarado. Reativar essa lista é a coisa mais barata que essa clínica pode
  fazer — e agora é um botão."*

## 11 · Qualidade do número (não pule)

- Cliente pode **bloquear ou denunciar** o número. Isso derruba a **classificação de qualidade** da
  Meta → cai o limite de mensagens que você pode enviar por dia, e no limite o número é restrito.
- Regra pro aluno: reativação é **cirúrgica** (segmentada por interesse, com espaçamento), nunca
  lista inteira toda semana. *"Marketing no WhatsApp é o canal mais íntimo que existe. Quem abusa
  perde o número."*
- Se o número for restrito, quem sofre é a clínica — mais um motivo do chip dedicado.

## 12 · Fecho → ponte pra A11

> *"Agora o seu agente atende, ouve, agenda, tem painel e consegue trazer o cliente de volta. Só que
> tem um problema que eu venho escondendo de você desde o começo do módulo: esse agente ainda pode
> mentir. E na próxima aula eu vou provar isso na sua frente — e consertar com uma regra só."*

---

## 📋 Os 4 prompts da A10 (prontos pra colar)

### Prompt 1 — o layout (passo 3)

```
O painel do dono ficou dentro de uma espécie de pop-up estreito e não aproveita a tela do navegador. Ajusta o layout pra ocupar a página inteira, mantendo as três telas que já existem -- conversas, agenda e funil -- e o mesmo visual. Não mexe em nenhuma lógica nem em nenhum dado, só no layout.
```

### Prompt 2 — a aba de Templates + reabrir conversa (passo 6)

```
Quero uma aba nova no painel do dono chamada Templates, e ela resolve um problema específico: quando o cliente fica mais de 24 horas sem falar com o agente, a Meta bloqueia mensagem de texto livre naquela conversa, e o único jeito de reabrir é enviando um modelo de mensagem que já foi aprovado por ela.

A aba lista os modelos aprovados na minha conta do WhatsApp, mostrando o nome, a categoria (marketing, utilidade ou autenticação), o texto com as variáveis e o preço estimado por envio. Busca essa lista na API da Meta usando o WABA ID, que eu vou colocar numa variável de ambiente nova -- e se o token não tiver permissão pra isso, não invente contorno: me avisa e deixa a lista num arquivo de configuração que eu edito na mão.

Na aba de conversas, cada conversa mostra se a janela de 24 horas está aberta ou fechada. Quando estiver fechada, aparece um botão de reabrir: eu escolho um modelo, preencho as variáveis com o nome do cliente e os dados do agendamento, vejo o texto final antes de confirmar, e o envio sai pela API oficial no formato de modelo, com o nome exato e o idioma pt_BR. A mensagem enviada precisa ficar salva no Supabase junto com as outras, marcada como modelo, senão o histórico do painel passa a mentir.

Antes de mexer em qualquer arquivo, me explica em uma frase como você vai calcular se a janela está aberta ou fechada -- e presta atenção nisso, porque o que conta é a última mensagem que o CLIENTE mandou, não a última mensagem da conversa.
```

### Prompt 3 — o clique do botão (passo 8)

```
Os meus modelos de mensagem têm botões de resposta rápida: no lembrete de consulta são "Confirmar presença" e "Preciso remarcar", e na promoção é "Quero saber mais". Quando o cliente toca num desses botões, o WhatsApp não manda um texto comum pro nosso webhook -- manda um evento de botão, com o nome do botão que foi clicado. Hoje o agente provavelmente ignora isso.

Quero que o clique seja tratado como uma resposta de verdade: o agente reconhece qual botão foi apertado, registra no Supabase igual a qualquer mensagem e reage de acordo. "Confirmar presença" ele agradece e mantém o horário. "Preciso remarcar" ele já entra no fluxo de remarcação, consultando os horários livres na agenda que a gente conectou na aula 4. "Quero saber mais" ele retoma a conversa a partir do serviço que estava na promoção.

Uma coisa importante de aproveitar: esse clique reabre a janela de 24 horas, então dali pra frente o agente volta a conversar por texto livre, sem custo por mensagem. Antes de implementar, me mostra onde no código a mensagem que chega é interpretada, pra eu entender em que ponto esse novo caso entra.
```

### Prompt 4 — a reativação pelo Sheets (passo 9)

```
Agora quero usar a planilha do Google Sheets que o agente já preenche -- a que tem o cliente, o telefone e o interesse dele -- pra fazer reativação de clientes antigos.

Na aba de Templates, quero escolher um modelo de marketing, filtrar os clientes por interesse (por exemplo, todo mundo que perguntou de botox) e disparar a mensagem personalizada com o nome de cada um. Antes de enviar qualquer coisa, a tela mostra quantas pessoas vão receber e quanto isso vai custar no total, e espera a minha confirmação -- essa parte não é opcional, é o que impede alguém de mandar duas mil mensagens sem perceber.

Três cuidados: não cria tabela nova, os clientes e os interesses continuam vindo da planilha; manda os envios com um intervalo entre eles em vez de tudo de uma vez, porque disparo em rajada derruba a reputação do número na Meta; e quem já recebeu essa mesma campanha não recebe de novo. Cada envio fica registrado no Supabase como mensagem da conversa, e quando a pessoa responder, o agente assume normalmente.

Antes de codar, me explica como você vai controlar quem já recebeu.
```

## ⚠️ Gotchas da A10

| Risco | Proteção |
|---|---|
| Template não aprovado a tempo | Submeta dias antes. Tenha 2 aprovados + 1 de reserva. |
| Não ter conversa com janela fechada | Prepare desde ontem: mande mensagem de um número e não responda mais. |
| Disparar a lista toda ao vivo | Filtre e envie pra 2-3 números seus. Confirme a prévia antes. |
| Contradizer a A7 no preço | Marketing R$ 0,32 · Utilidade ~R$ 0,035 · nova tabela 01/09, vale 01/10. |
| Token sem permissão pra listar modelos | O prompt 2 já prevê o plano B (lista em arquivo). Não improvise na câmera. |
| Digitar `{{}}` na mão no painel da Meta | Variável entra pelo botão **+ Adicionar variável**. |
| Aula inchar | Se passar de 30 min, corte a reativação (passos 9-10) pra vídeo próprio. |

---

# A11 — "Blindar + vender" (9.6 do roteiro)

**⚠️ Três correções vs. o `guia-gravacao-a9-9.6.md`, porque a ordem mudou:**

1. **O prompt do lembrete/template SAIU** — virou a A10 inteira. Não grave de novo.
2. **O fecho mudou:** o roteiro velho fechava com *"na próxima aula o sinal ganha casa: o painel"*.
   **O painel já existe (A9).** Agora o fecho é: mostrar o lead quente **aparecendo no painel que
   você já construiu** e a ponte é pra 9.8 (quebrar + revender + cobrar).
3. **O funil ganhou um vilão real:** o painel da A9 já mostra as etapas. Use os números dele
   (14 parados na entrada, 10 responderam, 2 qualificados, 5 agendaram) como o problema da aula.

**Tempo estimado:** 18-22 min (sem o template, encurtou).

## ✅ Antes de ligar a câmera

- [ ] Confirme que **criolipólise NÃO está na `constituicao.md`** — é o vilão do passo 2. (Se
      estiver, escolha outro serviço inexistente e ajuste a fala.)
- [ ] Confirme que na base EXISTEM: formas de pagamento (Pix, dinheiro, débito, crédito 6x) e a
      política de **sinal de 30% acima de R$ 800**
- [ ] Painel do dono aberto numa aba (passo 1 e fecho) · Google Calendar da Renov numa janela
      lateral (passo 7) · Supabase numa aba (passo 8)
- [ ] Grave antes um **áudio de cliente**: *"oi, queria marcar uma limpeza de pele quinta à tarde"*
- [ ] **Mande uma mensagem do celular-cliente pouco antes de gravar** pra manter a janela de 24h
      aberta — senão o texto livre não sai
- [ ] 2-3 perguntas-armadilha na manga (serviço inexistente, desconto, promessa)

## A ordem, de bate-olho

> ### ⚠️ CONTINGÊNCIA 12/08 — templates ainda EM ANÁLISE na Meta
> O Bloco 0 é o **único** pedaço da A11 que depende de template aprovado. Se na hora da gravação
> eles ainda não tiverem saído:
> - **corte o Bloco 0** e comece na abertura do funil (passo 1);
> - **tire o último parágrafo da intro** (o *"mas antes, vamos terminar o que ficou pendente"*);
> - **não prometa o botão no fecho** — a ponte segue sendo o cliente chato;
> - **mova o Bloco 0 pro começo da A12**, que é o seu padrão de abertura de sempre (foi assim que a
>   A10 abriu, com o layout que ficou da A9). Até lá os templates estarão aprovados.
>
> ⚠️ E confira se o status é **Em análise** ou **Rejeitado** — se foi rejeitado, leia o motivo
> (normalmente categoria reclassificada ou formatação) e reenvie, porque a fila reinicia.
>
> Cuidado extra sem template aprovado: **mantenha a janela de 24h aberta** mandando mensagem do
> celular-cliente pouco antes de gravar — você não tem template de reserva pra reabrir se ela fechar.

0. **[NOVO 12/08] Bloco 0 — fechar a dívida da A10 (~5 min):** templates aprovados → dispara o
   `lembrete_consulta` de verdade → **Prompt A (tratamento do clique)** → clica em "Confirmar
   presença" e mostra a janela abrindo e o agente reagindo. Cumpre o *"quando forem aprovados a
   gente vai conseguir enviar"* e conserta a afirmação da A10 sobre o botão.
   ```
   Os meus modelos de mensagem têm botões de resposta rápida: no lembrete são "Confirmar presença" e "Preciso remarcar", e na promoção são "Quero ver horários" e "Não, obrigado!". Quando o cliente toca num desses botões, o WhatsApp não manda um texto comum pro nosso webhook -- manda um evento de botão, com o nome do botão clicado. Hoje o agente ignora isso, então ele fica mudo justo no momento em que o cliente respondeu.

   Quero que o clique seja tratado como resposta de verdade: reconhece qual botão foi apertado, registra no Supabase como qualquer mensagem e reage. "Confirmar presença" agradece e mantém o horário. "Preciso remarcar" entra no fluxo de remarcação, consultando os horários livres na agenda que a gente conectou na aula 4. "Quero ver horários" retoma a conversa a partir do serviço da promoção. E "Não, obrigado!" marca o cliente na planilha como não receber campanha -- ele nunca mais entra em disparo de marketing, mas continua sendo atendido normalmente.

   Antes de implementar, me mostra onde no código a mensagem que chega é interpretada, pra eu entender em que ponto esse caso novo entra.
   ```
1. Abertura: o painel mostra o funil vazando
2. O vilão ao vivo: **[ATUALIZADO 12/08] a alucinação REAL da A10** (o agente pedindo desculpa por
   um horário que não estava confirmado — abra o histórico e leia) + reforço com a criolipólise
3. **Prompt 1** — a regra de ouro (reativa) → testa de novo
4. O funil na tela (conceito, sem código)
5. **Prompt 2** — o funil + a marcação de lead quente
6. Teste do funil no WhatsApp + **o aparte dos 20s sobre pagamento**
7. O momento-vitrine: áudio → agenda real
8. O handoff: lead quente no Supabase → **aparecendo no painel**
9. **[NOVO 12/08 — decisão do Enzo: vai fazer] Assumir o atendimento** (~4 min): o dono responde do
   painel e devolve pro agente. Barato porque a A10 já construiu o envio pela API.
   ```
   Na aba de conversas do painel, quando o agente marcar um lead como quente, quero um campo pra eu responder ali mesmo -- a mensagem sai pelo mesmo WhatsApp, usando o envio que a gente já construiu pros templates. Ao enviar, o agente para de responder só naquela conversa, e existe um botão de devolver pro agente. Antes de implementar, me explica como você vai marcar quem está no comando de cada conversa -- nunca pode o robô e eu respondendo juntos.
   ```
   - Leia a explicação da marcação de comando **antes** de deixar implementar
   - Demo: responde do painel → chega no celular → **devolver pro agente** → o robô volta
   - **Callback obrigatório da A10:** *"consegui responder texto livre porque o cliente falou agora.
     Se a conversa estivesse fria, o dono só sairia dela com template."*
   - **Frase que planta a A12:** *"e sim, isso significa que esse painel não pode ficar num link
     solto. A gente tranca ele na última aula."*
10. Fecho → ponte pra 9.8

---

## 1 · Abertura: o funil vazando (NOVA — usa a A9)

- Abra o painel na tela do funil: *"31 conversas. 14 pessoas entraram e morreram na primeira
  mensagem. 10 responderam e não foram pra frente. Só 5 agendaram."*
- *"O painel da aula passada não serve só pra você olhar bonito — ele serve pra isso: mostrar onde o
  dinheiro está vazando. E hoje a gente conserta os dois motivos desse vazamento: o agente ainda
  pode mentir, e ele ainda não sabe conduzir uma venda."*

## 2 · O vilão — e ele é REAL (atualizado 12/08)

**Primeiro o vilão de verdade, que já está gravado.** Abra o histórico daquela conversa da A10 (a
que você reabriu com template) e leia na tela a mensagem do próprio agente:

> *"peço desculpa, tive uma falha aqui e o horário que passei não ficou confirmado de verdade"*

- *"Isso não é um exemplo que eu inventei pra aula. Foi o meu agente, numa conversa real, na aula
  passada. Ele afirmou um horário que não existia. Agora imagina isso na clínica do seu cliente: a
  pessoa organiza o dia dela, atravessa a cidade, chega lá — e não tem horário nenhum."*

**Depois o reforço ao vivo:** pelo celular-cliente, *"vocês fazem criolipólise? quanto custa?"* —
serviço que não existe na base. Deixe ele inventar/enrolar com toda a segurança, em tela cheia.

- *"São os dois lados da mesma doença. Ele mente sobre o que a clínica VENDE e mente sobre o que ele
  próprio FEZ. Mentira com preço no WhatsApp do cliente não é bug de programa — é a clínica perdendo
  a confiança do cliente, e é você perdendo o contrato de R$ 8 mil."*
- **Se ele não inventar:** peça desconto (*"consegue fazer por 300?"*) ou outro serviço inexistente.
  **Você precisa do erro em tela** — é ele que justifica a regra.

## 3 · Prompt 1 — a regra de ouro (com a cláusula do horário)

Diga em voz alta que este é o jeito **reativo** da 9.3: apareceu o problema, agora escreve a regra.

```
Quando perguntam algo que não está na base de conhecimento, o meu agente enrola ou inventa. E numa conversa real ele chegou a dizer que tinha confirmado um horário que não existia. Adiciona na seção "Nunca faça isso" do prompt-agente.md: ele só responde com o que está na base; se a informação não estiver lá, ele diz que vai confirmar com a equipe e sinaliza pra um humano assumir; ele nunca inventa preço, desconto ou promessa; e ele nunca diz que um horário está confirmado sem ter criado o evento na agenda -- se a criação falhar, ele avisa com honestidade que não conseguiu confirmar e chama um humano. Altera só o prompt de sistema, mais nada.
```

- Mostre o `prompt-agente.md` ganhando a regra. **Refaça o teste da criolipólise** — mesmo cérebro,
  resposta oposta: *"vou confirmar com a equipe"*.
- *"Não mudei o modelo, não mudei a base, não escrevi uma linha de código. Escrevi uma regra. Guarda
  ela, porque na última aula a gente vai construir um robô só pra tentar quebrar essa regra."*

## 4 · O funil na tela (conceito, sem código)

- As 4 etapas: **qualificar → recomendar → agendar → chamar o humano.**
- Concretize: chega *"quanto custa botox?"*
  - Chatbot genérico: *"R$ 900."* → **a conversa morre ali** (são os 14 parados na entrada).
  - O nosso: pergunta o objetivo, sugere a avaliação, conduz pro horário.
- *"A clínica não paga R$ 8 mil por um robô que responde. Ela paga pelo que ele FECHA. E vender numa
  conversa é uma coisa só: saber em que etapa a conversa está e fazer a ação que fecha aquela etapa."*
- Lembre: **a agenda real já está de pé desde a aula 4** (conta de serviço + calendário dedicado).
  Aqui não tem integração nova — o funil só USA o que existe.

## 5 · Prompt 2 — o funil + o lead quente

```
Agora eu quero que o meu atendente conduza a venda. Quando a pessoa demonstrar interesse, ele qualifica: pergunta o que ela procura e pra quando, uma pergunta por vez. Depois recomenda só serviços que existem na base, com o preço de lá. Quando a pessoa perguntar de pagamento, ele responde com as formas de pagamento e a política de sinal que estão na base, e avisa que o pagamento é feito na clínica -- ele não cobra nem manda link. E quando o cliente pedir pra fechar, negociar desconto ou fizer uma pergunta que deve ir pro humano, ele marca o lead como quente no Supabase e avisa o dono. Antes de codar, me explica em uma frase por etapa como ele vai saber em que etapa a conversa está.
```

- **Leia a explicação da IA com o aluno ANTES de deixar codar.**
- Depois mostre que preço, formas de pagamento e política de sinal vêm **da base**, não do código.

## 6 · Teste do funil + o aparte dos 20s

- Pelo celular-cliente: *"quanto é o preenchimento labial?"* → qualifica → recomenda (R$ 1.200, o
  preço da base) → informa formas de pagamento e o sinal de 30% (R$ 360), pago na clínica → conduz
  pro horário.
- **Olhando pra câmera, ~20s, sem demo e sem abrir nenhum site de cobrança:**

> *"Repara que ele só INFORMA o pagamento — não cobra, não manda link. Pra essa clínica é assim
> mesmo: o cliente paga no balcão. Se o SEU cliente quiser link de cobrança automático, é só mais
> uma ferramenta — exatamente a receita da aula 4 pra conectar a agenda: você chama a API do sistema
> de cobrança que ele já usa, InfinitePay, PagSeguro, o link do banco. É um pedido no chat. Não é o
> caso da Renov, então eu não vou construir aqui."*

- E a lição, que é maior que o aparte: *"nem toda etapa do funil vira ferramenta. Ferramenta é onde
  o agente precisa AGIR. Onde ele só precisa SABER, é dado na base. Cada ferramenta a mais é mais
  coisa pra dar errado — e mais token pra pagar."*
- **Regra da resposta consolidada** (cuidado com o tempo verbal — hoje responder dentro da janela
  ainda é grátis): *"quando a tabela nova entrar, em outubro, cada resposta vai custar. Um agente
  que quebra a resposta em cinco mensagenzinhas vai custar cinco vezes mais que um que responde de
  uma vez. Então já deixa no prompt: uma resposta completa por vez, uma pergunta por vez."*

## 7 · O momento-vitrine: áudio → agenda real

- **É o plano que vende o serviço.** Google Calendar aberto do lado, visível.
- Mande o áudio: *"oi, queria marcar uma limpeza de pele quinta à tarde"*.
- Ele entende (sentidos, aula 5), consulta os horários realmente livres, oferece, confirma — e o
  **evento aparece no Calendar ao vivo**. Deixe o silêncio trabalhar 2 segundos.
- *"Um cliente mandou um áudio às onze da noite. Ninguém da clínica estava acordado. E o horário
  está marcado na agenda. É isso que você está vendendo."*

## 8 · O handoff → e o painel acendendo (FECHO NOVO)

- Pelo celular-cliente, a pergunta que a base proíbe: *"qual o melhor procedimento pro meu caso?"*
- O agente responde que vai passar pra equipe e **marca o lead como quente no Supabase** — mostre a
  linha no banco ao vivo.
- **Agora vire pro painel** (o da A9) e mostre esse lead **subindo destacado**: *"lembra que na aula
  passada eu construí o painel e ele estava só olhando? Agora ele tem o que mostrar."*
- ⚠️ **Lembre o split da aula 4 em uma frase:** cadastro de cliente vive no **Google Sheets**;
  memória e **lead quente** vivem no **Supabase**.

## 9 · Assumir o atendimento (~4 min) — decisão de 12/08

O buraco que a lógica do módulo abriu: o número saiu do app do celular (A9), o agente diz *"vou
passar pra equipe"*... e a equipe não tem por onde falar. Ficou barato porque **a A10 já construiu o
envio pela API** — responder texto livre é o mesmo caminho.

```
Na aba de conversas do painel, quando o agente marcar um lead como quente, quero um campo pra eu responder ali mesmo -- a mensagem sai pelo mesmo WhatsApp, usando o envio que a gente já construiu pros templates. Ao enviar, o agente para de responder só naquela conversa, e existe um botão de devolver pro agente. Antes de implementar, me explica como você vai marcar quem está no comando de cada conversa -- nunca pode o robô e eu respondendo juntos.
```

- **Leia a explicação da marcação de comando ANTES de deixar implementar** — dois cérebros não podem
  responder juntos na mesma conversa
- Demo: responda do painel → **chega no celular do cliente** → clique em **devolver pro agente** →
  o robô volta a atender
- **Callback obrigatório da A10:** *"repara que eu consegui responder texto livre porque o cliente
  falou agora. Se essa conversa estivesse fria, o dono só sairia dela com template — igual a gente
  fez na aula passada."*
- **Frase que planta a A12:** *"e sim, isso significa que esse painel não pode ficar num link solto.
  A gente tranca ele na última aula."*

## 10 · Fecho → ponte pra 9.8

> *"O sistema está completo: ele pensa, sabe, ouve, vende, agenda, avisa o dono e reabre conversa.
> Na próxima aula a gente tenta QUEBRAR ele — eu vou construir um cliente chato que vai passar
> horas tentando fazer esse agente mentir. E depois eu te mostro como transformar isso num serviço
> que você revende em minutos."*

## ⚠️ Gotchas da A11

| Risco | Proteção |
|---|---|
| **Fechar prometendo o painel** | O painel já foi (A9). Feche com o lead acendendo NELE e a ponte pra 9.8. |
| **Regravar o template** | Saiu pra A10. Se citar, é como coisa já feita. |
| O agente não inventar no passo 2 | 2-3 perguntas-armadilha prontas. Precisa do erro em tela. |
| Janela de 24h fechada na hora do teste | Mande mensagem do celular-cliente pouco antes de gravar. |
| Dizer que resposta "custa" hoje | Dentro da janela ainda é grátis. Fale no futuro: "quando a tabela nova valer, em outubro". |
| Aparte do pagamento virar aula | 20 segundos. Se abrir o InfinitePay na tela, já perdeu. |

---

# A12 — "Vamos quebrar esse agente" (proposta 13/08)

> **Por que esta aula existe assim:** o fecho da A11 prometeu em vídeo *"na próxima aula a gente vai
> criar uma automação para testar a fundo esse agente, encontrar as falhas dele"*. E a **regra de
> ouro nunca foi gravada** — então ela entra aqui como **conserto do que o relatório achar**, não
> como aula teórica. É o jeito reativo que o curso ensina desde a 9.3: apareceu o problema, agora
> escreve a regra. Melhor do que o plano original, onde o Enzo forjava o vilão à mão.

**Tempo estimado:** 20-24 min.

## ✅ Antes de ligar a câmera

> **DECISÃO 13/08 (Enzo): não vai criar ambiente de teste.** Nenhum cliente real conversou com o
> agente até hoje — tudo no Supabase é teste dele mesmo. Então **apaga tudo** e o painel começa
> limpo. A separação teste × produção vira **uma frase de 15s** (passo 4), não construção.

- [ ] ⚠️ **Print da conversa da A10 ANTES de apagar** — a mensagem do agente pedindo desculpa pelo
      horário que não estava confirmado é o vilão do passo 3, e depois do `DELETE` ela só existe no
      vídeo da aula 10
- [ ] **Limpar também o Google Calendar** depois do teste — o testador cria eventos de verdade (a
      2ª régua precisa disso pra conferir), e a agenda da Renov aparece em câmera nas outras aulas
- [ ] Sistema da A11 rodando (botões, opt-out, agrupamento, `cancelar evento`)
- [ ] Supabase e Google Calendar abertos numa aba cada

## A ordem, de bate-olho

1. Abertura: a promessa da aula passada + a pergunta
2. O conceito: Teste do Estranho em formato de conversa
3. **As duas réguas** (o que ele FALA × o que ele AFIRMA TER FEITO)
4. A separação teste × produção (antes de rodar qualquer coisa)
5. **Prompt 1** — o cliente chato
6. Ler o relatório ao vivo
7. **Prompt 2** — a regra de ouro, como conserto
8. O conserto que vai na BASE, não na regra
9. O momento "nem toda falha vira conserto" (os dois horários)
10. Roda de novo → comparação dos dois relatórios
11. Fecho → ponte pra A13

---

## 1 · Abertura

- *"Na aula passada eu prometi que a gente ia testar esse agente a fundo. E testar de verdade não é
  eu ficar aqui mandando mensagem por meia hora — é construir um robô que faz isso por mim, centenas
  de vezes, enquanto eu tomo um café."*
- A pergunta da aula: *"esse agente aguenta um estranho?"*

## 2 · O conceito

- É o **Teste do Estranho do M8, em formato de conversa**: protótipo funciona pra você, que sabe o
  que perguntar; produto funciona pra um estranho, que não sabe nada
- O cliente chato escreve torto, manda em pedaços, pede desconto que não existe, tenta enganar,
  pergunta de serviço que a clínica não faz, muda de assunto
- **IA testando IA** — é a única forma de fazer isso em escala

## 3 · As duas réguas (o coração da aula)

- A pior falha **não é travar, é inventar**. E inventar tem dois sabores:
  - **falar** errado → preço, serviço ou promessa que não está na base
  - **mentir sobre o que fez** → dizer que agendou sem o evento existir
- ⚠️ **Cite a aula 10:** *"vocês viram isso acontecer de verdade. Naquela conversa ele pediu desculpa
  porque tinha passado um horário que não estava confirmado. Um relatório que só olha preço não
  pegaria esse erro nunca — porque horário não vive na base de conhecimento, vive na agenda."*
- E agora tem a terceira ferramenta pra checar: **remarcou** = horário novo existe **e** antigo
  cancelado (o `cancelar evento` que nasceu na A11)

## 4 · Limpar o banco (e a lição que vem de graça)

- Abra o Supabase e apague as conversas e mensagens. Painel volta a zero
- *"Esse agente nunca falou com um cliente de verdade — tudo que está aqui sou eu testando. Então eu
  começo do zero, e o painel passa a mostrar só o que esse teste produzir."*
- **A frase de 15 segundos que salva o aluno** (entrega a lição sem construir nada):

> *"E repara: eu posso apagar tudo porque aqui ninguém real conversou com esse agente. No dia que
> você entregar pra um cliente, isso muda — teste não pode encostar no dado de quem está pagando.
> Aí você separa os dois ambientes antes de rodar qualquer robô."*

## 5 · Prompt 1 — o cliente chato

```
Quero criar um testador automático pro meu atendente: um cliente chato simulado que conversa com ele como gente de verdade, pra achar as falhas dele sem eu ficar trocando mensagem à mão.

Antes de qualquer coisa, uma coisa que não pode dar errado: essas conversas de teste não podem se misturar com as conversas reais de cliente, nem no banco nem no painel do dono -- senão o funil que eu mostro pro dono da clínica vira lixo. Me explica primeiro como você vai separar as duas coisas.

O testador gera umas 30 conversas difíceis: gente que escreve tudo errado, que manda a mensagem em pedaços, que pede desconto que não existe, que tenta enganar o atendente, que pergunta de serviço que a clínica não faz e que muda de assunto no meio.

E compara cada resposta com duas réguas, não uma. A primeira é a base de conhecimento: se ele falou preço, serviço ou promessa que não está lá, é falha grave. A segunda é o que ele afirma ter FEITO: quando disser que agendou, confere se o evento existe mesmo no Google Calendar; quando disser que remarcou, confere se o horário novo existe e se o antigo foi cancelado; quando disser que anotou o cliente, confere na planilha. Afirmar que fez e não ter feito é falha grave também -- é o erro mais caro, porque o cliente aparece na clínica num horário que não existe.

Roda tudo e não conserta nada ainda. No fim me entrega um relatório simples: quantas conversas, onde ele falhou, em qual das duas réguas, e a conversa inteira de cada falha pra eu ler.
```

- **Leia a explicação da separação antes de deixar construir** — é o hábito do curso e aqui protege
  dado de cliente

## 6 · Ler o relatório ao vivo

- Mostre 2-3 conversas na tela: a torta, a do desconto, a que tenta enganar
- Leia uma falha de cada régua, em voz alta. Se aparecer uma falha de agendamento, **pare em cima
  dela** — é o fecho do arco que começou na A10

## 7 · Prompt 2 — a regra de ouro (o conserto)

```
O relatório achou as falhas que eu queria ver: ele inventou coisa que não está na base e afirmou ter feito coisa que não fez. Vamos consertar do jeito certo, que é na regra e não no código. Adiciona na seção "Nunca faça isso" do prompt-agente.md: ele só responde com o que está na base de conhecimento; se a informação não estiver lá, ele diz que vai confirmar com a equipe e sinaliza pra um humano assumir; ele nunca inventa preço, desconto ou promessa; e ele nunca diz que um horário foi marcado, remarcado ou cancelado sem que a ferramenta correspondente tenha funcionado de verdade -- se falhar, ele avisa com honestidade que não conseguiu e chama um humano. Altera só o prompt de sistema: não mexe no código, nem na base, nem nas ferramentas.
```

- *"Repara no que eu acabei de fazer. Eu não escrevi código, não troquei o modelo, não mexi em
  ferramenta. Eu escrevi uma regra. É essa regra que protege a clínica — e o seu contrato."*

## 8 · O conserto que vai na BASE

- Escolha uma falha do relatório em que o agente errou porque **a informação não existia** (não
  porque inventou) e conserte **na `constituicao.md`**
- *"Olha a diferença: essa aqui não é culpa do agente, é buraco na base. Quando você entregar isso
  pra um cliente, boa parte dos ajustes vai ser assim — você editando um documento, não programando."*

## 9 · Nem toda falha vira conserto (~1 min, e é ouro)

- Se o relatório levantar a confusão dos **dois horários** (o agente achando que o horário do próprio
  cliente está ocupado), use o momento:
- *"Essa aqui eu vou deixar como está, de propósito. O relatório está certo em apontar, mas o
  cliente pode querer marcar um segundo procedimento — e aí o horário dele aparecer como ocupado é
  o comportamento certo. Guarda isso: a IA aponta, quem decide é você. Nem toda observação vira
  mudança."*

## 10 · Roda de novo → e o painel nasce do teste

- Solte o testador outra vez e **compare os dois relatórios lado a lado**
- Volte ao painel: ele saiu do zero e agora tem **30 conversas com o funil distribuído** — todas
  produzidas pelo robô. *"Esse painel não está mais vazio, e nem uma dessas conversas fui eu que
  digitei."* É um fecho visual forte, e só existe porque você limpou antes

## 11 · Fecho → ponte pra A13

> *"O agente parou de mentir e a gente provou isso com dado, não com achismo. Mas ainda tem uma
> coisa faltando: quando ele diz 'vou passar pra equipe', a equipe não tem por onde falar — porque
> esse número saiu do aplicativo do celular. Na próxima aula você entra na conversa pelo painel,
> a gente tranca esse painel com login, coloca teto de custo, e eu te mostro como subir o segundo
> cliente em minutos — e quanto cobrar por isso."*

## ⚠️ Gotchas da A12

| Risco | Proteção |
|---|---|
| **30 conversas falsas na tabela de produção** | Resolvido no 1º parágrafo do prompt. Confira a explicação antes de deixar rodar. |
| O testador não achar nada | Improvável com a regra de ouro ainda ausente. Se acontecer, rode com perguntas mais agressivas — mas seria ótimo sinal, e aí a regra entra como prevenção. |
| Falha de agendamento não aparecer | Force: peça remarcação no meio do teste. É a régua que justifica a aula. |
| Consertar tudo no código | O ponto pedagógico é o oposto: regra no prompt, dado na base. |
| Aula inchar | Corte o passo 8 (conserto na base) — é o único opcional. |

---

# A13 — "O painel vira posto de comando" (reescrita 14/08)

> **O que mudou:** o cliente chato virou a A12 (gravada). Esta aula junta os três buracos que sobraram
> no painel — **pausar o agente pra um humano responder**, **criar template pelo painel** e **trancar
> a casa com login**. O preço fica pra A14, por decisão do Enzo: tranca a casa antes de dizer quanto
> custa.

**Tempo estimado:** 18-22 min.

## ✅ Antes de ligar a câmera

- [ ] Uma **conversa com lead quente** (ou gere na hora com a pergunta que a base proíbe), com a
      **janela de 24h aberta** — mande mensagem do celular-cliente pouco antes
- [ ] Railway aberto (você vai fechar a aula com o deploy limpo) · Supabase numa aba
- [ ] Gerenciador do WhatsApp aberto numa aba, pra comparar com o formulário novo
- [ ] ⚠️ **Confira fora da câmera se o token cria modelo pela API** — o prompt 2 já testa isso
      primeiro, mas é o único ponto que pode travar a aula

## A ordem, de bate-olho

1. Abertura: o agente sabe chamar o humano, mas o humano não tem porta
2. **Prompt 1** — pausar o agente e responder pelo painel (com continuidade de memória)
3. A demo em 3 provas
4. **Prompt 2** — criar template pelo painel
5. **Prompt 3** — o login
6. O susto: o painel aberto numa janela anônima
7. Deploy no Railway, sem erro
8. Fecho → ponte pra A14

---

## 1 · Abertura: o buraco

- *"O agente já sabe a hora de chamar um humano — ele marca o lead como quente e avisa o dono. Só
  que o humano não tem porta de entrada. Esse número saiu do aplicativo do celular quando a gente
  conectou na API oficial. A dona da clínica não abre o WhatsApp e responde: ela não tem WhatsApp."*
- *"Hoje a gente resolve isso. E de quebra tira a última tarefa que ainda obriga você a abrir o
  painel da Meta."*

## 2 · Prompt 1 — pausar e assumir

```
Quero poder assumir o atendimento de um cliente específico pelo painel.

Na conversa, um campo pra eu escrever e enviar a mensagem pelo mesmo WhatsApp -- usando o envio que a gente já construiu pros templates. No momento em que eu envio, o agente pausa NAQUELA conversa e não responde mais nada ali, mesmo que o cliente escreva. As outras conversas seguem normais.

E um botão pra devolver pro agente. Quando ele voltar, ele não pode agir como se nada tivesse acontecido: as mensagens que eu escrevi precisam estar no mesmo histórico que ele lê, marcadas como enviadas por um humano da equipe, pra ele continuar de onde a conversa parou -- se eu já ofereci um desconto ou remarquei um horário, ele parte dali.

Antes de implementar, me explica duas coisas: como você vai marcar quem está no comando de cada conversa, e como o agente vai enxergar as minhas mensagens quando voltar.
```

- **Leia as duas explicações antes de deixar codar.** A segunda é a que separa um botão de pausa de
  um handoff de verdade

## 3 · A demo em 3 provas (faça nessa ordem)

1. Cliente escreve → **você assume e responde do painel** → chega no celular ✅
2. Cliente escreve de novo → **o agente fica calado** ✅ *(prova que não tem dois cérebros falando)*
3. Você **devolve pro agente** → e o cliente pergunta algo que depende do que VOCÊ falou
   (*"então fica esse valor que você me passou?"*) → **o agente responde sabendo** ✅

> A terceira prova é a que vale a aula. Sem ela o aluno não vê diferença entre pausar e passar o
> bastão. Fale isso em voz alta: *"repara: ele não me perguntou de novo o que já foi combinado. Pra
> ele, o que eu escrevi faz parte da conversa."*

## 4 · Prompt 2 — criar template pelo painel

```
Quero criar modelo de mensagem direto pelo painel do dono, sem precisar abrir o Gerenciador do WhatsApp da Meta toda vez.

Antes de montar qualquer tela, faz um teste: tenta criar um modelo pela API da Meta com o token que a gente já usa. Se o token não tiver permissão pra isso, me avisa agora e não inventa contorno -- prefiro descobrir antes de construir a tela.

Se funcionar: na aba de Templates, um formulário onde eu escolho a categoria (marketing, utilidade ou autenticação), dou o nome, escrevo o texto com as variáveis, adiciono os botões de resposta rápida e mando pra análise. O painel mostra o status de cada modelo -- em análise, aprovado ou rejeitado -- e o motivo, quando for rejeitado.

E duas coisas o formulário tem que impedir antes de enviar, porque são as regras que fazem a Meta reprovar: variável no começo ou no fim do texto, e duas variáveis coladas uma na outra. Deixa claro na tela que o modelo entra em análise e não pode ser usado na hora.
```

- ⚠️ **A demo termina em "enviado pra análise", não em "pronto pra usar"** — diga isso, senão parece
  que quebrou
- Fala boa: *"repara no que a gente acabou de fazer: as regras que eu aprendi apanhando no painel da
  Meta agora estão dentro do meu formulário. O dono da clínica não precisa saber nenhuma delas."*

## 5 · Prompt 3 — o login

> **Decisão 14/08: senha em variável de ambiente, não login com Google.** O painel lê o Calendar por
> conta de serviço desde a A4, então o Google não é necessário pra nada além de identificar quem
> entra — e configurar OAuth (tela de consentimento, URL de retorno) é o jeito mais fácil de travar
> uma gravação. E-mail e senha próprios também não: aí você passa a guardar senha dos outros.

```
O painel do dono está num link aberto, e agora ele responde em nome da clínica e cria modelo de mensagem na conta da Meta. Quem tiver o link consegue fazer tudo isso.

Coloca uma tela de login simples: uma senha guardada numa variável de ambiente no Railway, sem cadastro e sem banco de usuários. Quem acerta ganha uma sessão que dura alguns dias; quem não tem sessão não vê nada.

E o mais importante: a verificação tem que estar no servidor, não na tela. Qualquer pedido de ler conversa, enviar mensagem ou criar modelo precisa ser recusado se não vier de uma sessão válida -- mesmo que a pessoa chame o endereço direto, sem passar pelo navegador.

Antes de implementar, me mostra onde exatamente essa verificação vai ficar, e me diz o que aconteceria hoje se alguém chamasse esses endereços direto, sem abrir o painel.
```

**A fala que justifica a escolha (pra ninguém achar que é preguiça):**

> *"Eu podia botar 'entrar com Google' aqui. Mas pra um painel usado pela dona da clínica e mais uma
> recepcionista, isso é configuração demais pra pouco ganho. Comece pelo simples que funciona. No dia
> que a clínica tiver equipe e você precisar tirar o acesso de uma pessoa sem trocar a senha de todo
> mundo, aí sim você troca por login com Google — e é um pedido no chat."*

## 6 · O susto (30s, e é o que fixa a lição)

- A resposta da IA à última pergunta do prompt já mostra o que qualquer pessoa consegue fazer hoje
  com a URL do painel. **Leia em voz alta**
- Abra o painel numa **janela anônima**: antes, entrava; depois, porta fechada
- *"Repara que eu não pedi pra esconder o botão. Esconder botão não é segurança, é decoração. A
  trava está no servidor — senão quem souber o endereço passa por cima da tela. A tela é sugestão,
  o servidor é lei."*

## 7 · Deploy no Railway, sem erro

- Push, deploy verde, logs limpos
- Teste ponta a ponta ao vivo: cliente escreve → agente responde → você assume → devolve
- *"Isso aqui não está rodando no meu computador. Está no ar, 24 horas por dia, e a clínica não
  depende de mim ter deixado alguma coisa aberta."*

## 8 · Fecho → ponte pra A14

> *"O painel virou o posto de comando: o dono vê tudo, entra na conversa quando quer, devolve pro
> agente sem perder o fio, e cria as mensagens dele sem abrir o painel da Meta. Na última aula do
> módulo eu te entrego a skill que eu prometi lá na aula 2 — a que guia você a criar um agente
> desses do zero — a gente sobe um segundo cliente na sua frente pra você ver quanto tempo leva, e
> eu falo quanto se cobra por isso."*

## ⚠️ Gotchas da A13

| Risco | Proteção |
|---|---|
| **Token sem permissão pra criar modelo** | O prompt 2 testa antes de construir. Confira fora da câmera. |
| Janela de 24h fechada na hora do assumir | Mande mensagem do celular-cliente pouco antes de gravar. |
| A 3ª prova não acontecer | É a mais importante. Prepare a pergunta que depende do que você falou. |
| Parecer que o template quebrou | Ele entra **em análise** — avise antes de mostrar. |
| Login só escondendo a tela | O prompt cobra a verificação no servidor. Leia a explicação antes de aceitar. |

---

# A14 — "Isso já é um negócio?" — A ÚLTIMA DO MÓDULO

**Tempo estimado:** 16-20 min. **SEM o Meta Business Agent** (a A7 entregou inteiro — no máximo uma
frase de callback).

## ✅ Antes de ligar a câmera

- [ ] **A skill `/criar-agente` aberta e conferida** — `references/masterclass/skill-criar-agente/`.
      Promessa gravada na **A2, 00:02:12**. É a única coisa desta aula que você não pode improvisar
- [ ] **Dados do cliente nº 2 escolhidos** (outro nicho — preencher ao vivo É a demonstração)
- [ ] Railway e o cronômetro à mão

## A ordem

1. **Recap → a última prova** — *"ele aguenta um estranho (a gente provou com relatório), e você já
   assume a conversa quando quiser. Falta a pergunta que interessa: isso é um negócio?"*
2. **A skill `/criar-agente`** — o que é e por que existe: ela guarda a ORDEM certa (planejar →
   sandbox → conhecimento e ferramentas → testar → canal → produção). *"Você não precisa lembrar da
   ordem: a skill lembra."* Cumpre a promessa da A2
3. **Cliente nº 2 ao vivo, cronometrado** — a skill guiando, você trocando só os dados
   (`constituicao.md`, persona, variáveis) até o cérebro novo responder **no sandbox**.
   ⚠️ **Pare no sandbox e diga por quê:** *"eu não vou comprar outro chip só pra gravar. O número é
   uma variável, e conectar o WhatsApp você já fez comigo na aula 6 — são os mesmos oito minutos. O
   que eu quero te mostrar é que eu não reescrevi uma linha de código pra atender outro cliente."*
4. **Travas de custo** *(opcional — corte se a aula esticar)*
   ```
   Cada mensagem que o meu atendente responde custa dinheiro. Primeiro me explica, como se eu fosse leigo, por onde o dinheiro sai neste projeto -- a chamada do modelo, a tarifa da Meta, a hospedagem -- e quanto custa mais ou menos uma conversa típica. Depois cria duas travas no servidor, não na tela: um teto por conversa, e quando ele passar do limite o agente encerra com educação e chama um humano; e uma trava anti-abuso pra quem fica mandando mensagem sem parar. Não mexe em mais nada.
   ```
   Amarre com a A11: *"lembra que a gente fez ele esperar pra responder uma vez só? Ali já era
   dinheiro. Aqui é o teto."*
5. **Produção** — fica no Railway, 24/7, e pro primeiro cliente a margem já sobra. **VPS da
   Hostinger** só como passo de escala (cupom SPARO10) — não faça agora
6. **O preço** — ~R$ 8 mil de implantação + mensalidade. E o porquê, que é o argumento do módulo
   inteiro: *"a clínica não paga por um robô que responde. Paga pelo que ele fecha."* Como precificar
   por valor e empacotar é o **Módulo 10**
7. **Fecho do módulo** — *"você não aprendeu a mexer numa ferramenta. Aprendeu a arquitetura de um
   agente: cérebro separado do canal, conhecimento em documento, ferramentas pra agir, memória,
   painel e regra. Ferramenta muda, preço muda; isso aqui não."*

## 🧵 Pontas soltas — decida quais valem (todas cabem em segundos)

| Ponta | Recomendação |
|---|---|
| **Variáveis do template preenchidas sozinhas pelo histórico** — afirmado na A11 (00:00:35), nunca demonstrado | 30s reabrindo uma conversa que TEM histórico, na A13 |
| **Idempotência** (Meta reenviar a mesma mensagem) — anunciada na A11, não narrada | confira no código; se não entrou, é uma linha num prompt. Não vira aula |
| **"Delay humano"** — pendente desde a A6, **não é** o buffer da A11 | 20s de menção ou descarte |
| **Funil nunca nomeado** | 1 min no recap da A14, por cima do painel |

---

## Depois desta, o M9 fecha. Fica em aberto:

- **Aula da nova tabela de preços da Meta** — prometida 2x (A6 e A7). Sai **01/09**, vale **01/10**.
  É a promessa que te cobra
- **Aba de Marketing / campanha pelo Sheets** — condicional aos comentários da A10
- **Bônus 9.9 — Meta Business Agent** — sem data, depende da Meta liberar
- **Links na descrição** das aulas A2, A4 e A6 — 10 minutos na Kiwify
- **Módulo 10** (4 aulas conceituais): por que vale R$ 10k → precificar por valor → empacotar →
  gerar demanda
