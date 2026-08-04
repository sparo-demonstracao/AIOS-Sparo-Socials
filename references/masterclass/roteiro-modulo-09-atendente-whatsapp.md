# Módulo 9 · Script de Gravação — Atendente de IA no WhatsApp (Clínica de Estética)

> Script com explicação + prompts, no formato do `aulas-finais-script.md`. **L2 (rascunho pra sua
> revisão).** Projeto: um atendente de IA que **atende e vende 24/7 no WhatsApp** — o aluno instala
> num cliente real e cobra ~R$ 8 mil. Exemplo de gravação: **Clínica Renov Estética** (fictícia —
> base preenchida em `exemplo-clinica-estetica-base-conhecimento.md`).

> **Status (20/07/2026):** ✅ **5 aulas GRAVADAS** — 9.1 (`[M9 A1].mp4` 08/07), 9.2 (`[M9 A2].mp4`
> 13/07), 9.3 (`[M9 A3].mp4` 13-14/07), **A4 — ferramentas de ação** (`[M9 A4] Ferramentas VO`) e
> **A5 — sentidos/áudio e imagem** (`[M9 A5]VO`), as duas transcritas 20/07. A gravação divergiu do
> roteiro em pontos importantes — veja a **nota de arquitetura** abaixo e os blocos "✅ como foi
> gravada" em cada aula. A numeração na Kiwify o Enzo acerta depois.
> **[21/07] A rota NÃO-oficial (Z-API) SAIU da 9.5** — virou **aula própria, a PENÚLTIMA do
> módulo** (entre a 9.7 e a 9.8). A 9.5 agora é 100% API oficial — nem mencione a Z-API nela.
> **[24/07] ✅ 9.5 GRAVADA como A6** (`[M9 A6].mp4`, 21–23/07; transcrita e no vault 24/07) — veja
> o bloco na aula. **[24/07] NOVA ORDEM (decisão do Enzo):** a rota não-oficial NÃO é mais a
> penúltima — ela vem AGORA, em **DUAS aulas**, e a ferramenta é **WAHA** (não mais Z-API):
> **próxima gravação (A7) = "API oficial vs não-oficial"** (conceito, preços da oficial + mudanças
> de 2026, a conta comparativa na tela, o risco) e **(A8) = conectar o agente na API não-oficial
> com WAHA**. Isso cumpre a promessa gravada no fecho da A6 (*"na próxima aula: todos os preços +
> a API não oficial"*). Depois segue normal: 9.6 → 9.7 → 9.8. A antiga "aula Z-API penúltima"
> morre como posição; o conteúdo dela foi absorvido pelas duas novas aulas (ver anotação lá).
> **[21/07] ESTILO DE PROMPT (regra pra todo prompt novo):** curto, como o Enzo dita em aula —
> 2-6 frases corridas em primeira pessoa, imperativo simples ("Cria...", "Faz..."), uma trava
> enxuta no fim quando precisar, um pedido final ("me diz..."), SEM listas numeradas, SEM
> colchetes, SEM parênteses explicativos. Detalhe extra vai em mensagem separada (follow-up).
> Os prompts das aulas ainda não gravadas (9.5 em diante) já foram reescritos nesse estilo;
> os das gravadas ficaram como registro.
>
> **🔀 O que a A4 e a A5 mudaram (leia antes de gravar a 9.5):**
> - **A agenda REAL já foi conectada na A4** — e **por conta de serviço (service account)**, não
>   por OAuth: projeto no `console.cloud.google.com` → Google Calendar API ativada → credencial de
>   **conta de serviço** (papel proprietário) → chave **`googlecredentials.json`** ao lado do
>   `server.js` (no `.gitignore`, é senha) → **calendário dedicado novo** compartilhado com o
>   e-mail da conta de serviço. Ferramentas criadas: **ver horários livres** + **criar evento**.
>   ➜ Isso **esvazia a parte pesada da 9.6** (que previa conectar a agenda via OAuth). A 9.6 agora
>   só USA a agenda que já existe.
> - **O "salvar cliente" foi pro Google Sheets**, não pra uma tabela de leads no Supabase. Motivo
>   dito em aula: contato do cliente vale ouro pra remarketing (promoção a cada 6 meses). O Supabase
>   segue guardando só a **memória** (conversas/mensagens). ⚠️ Split a lembrar: **cadastro de
>   cliente = Google Sheets; memória e "lead quente"/handoff = Supabase.**
> - **A regra de ouro NÃO foi gravada** (a A4 pulou direto pras ferramentas). ➜ **Encaixada na
>   abertura da 9.6**, antes de ensinar o agente a vender — é lá que a trava contra inventar
>   preço/desconto faz mais sentido, e é ela que o "cliente chato" ataca na 9.8.
> - **Os sentidos (A5) vieram por OpenRouter, com o Gemini 3.5 Flash** (o Sonnet 5 não lê áudio).
>   A triagem de mídia é um **PRÉ-PASSO do fluxo linear** (não uma ferramenta do agente): a mensagem
>   chega → identifica texto/áudio/imagem → áudio/imagem viram texto com um **rótulo** → segue pro
>   resto. Uma linha no prompt ensina o agente a tratar o rótulo como fala normal, sem mencioná-lo.
>
> **⚠️ Nota de arquitetura (corrigida em 14/07, a partir do que foi GRAVADO):** a base de
> conhecimento **NÃO é lida a cada mensagem** — ela é uma **FERRAMENTA** que o agente decide usar
> (function calling), consultada só quando precisa de dado da empresa. O que é lido a cada mensagem
> é só o **prompt de sistema**, enxuto. Porquês (ditos em aula): documento grande lido toda mensagem
> fica **caro** (imagine o catálogo de um e-commerce) e prompt inchado **aumenta alucinação** —
> quanto mais enxuto o prompt, mais preciso o agente. A 9.1 gravada já ensinava assim (12:58:
> *"a base de conhecimento não vai ficar no prompt, vai ser uma ferramenta"*); a 9.3 gravada
> implementou. O texto original da 9.3 abaixo ("lê o documento INTEIRO antes de cada resposta")
> estava ERRADO e foi corrigido.
>
> **Terminologia que valeu na gravação (diferente do roteiro original):**
> - `prompt-agente.md` = **prompt de sistema** (lido a CADA mensagem): OBJETIVO (título) +
>   Ferramentas + Como agir + Nunca faça isso (subtítulos). "Como agir"/"Nunca faça isso" se
>   preenchem de forma **reativa** (só quando aparecer problema), nunca proativa.
> - `constituicao.md` = **a base de conhecimento da empresa** (ferramenta, consultada sob demanda).
>   ⚠️ NÃO é o documento de persona do M3 como o roteiro original chamava — nas aulas 9.4–9.8,
>   onde se lê "constituição", entenda "base de conhecimento".
> - Estrutura do projeto: pastas `skills/` (arquivos .md que dizem como agir e quando usar cada
>   ferramenta) e `tools/` (o código das ações) + `server.js` — criado no **Antigravity** com a
>   extensão do Claude Code. Modelo do agente via **OpenRouter** (`openrouter.ai`, chave no `.env`)
>   — não console.anthropic.com; agente rodando com **Sonnet 5**, e o aluno pode testar qualquer
>   modelo com a mesma chave.

> **💰 MUDANÇA DE PREÇO DO WHATSAPP (confirmada na documentação oficial da Meta, 21/07/2026) — afeta a 9.5, a 9.6 e o fecho da 9.8:**
> - **01/08/2026:** o **Meta Business Agent (MBA)** — o agente de IA da PRÓPRIA Meta, lançado 01/07 — passa a ser cobrado **por token**: US$ 2,00 por 1M de tokens, taxa global única. Mensagem típica gasta 20-25k tokens ≈ **R$ 0,22-0,28 por resposta**.
> - **01/10/2026:** as mensagens de serviço **dentro da janela de 24h deixam de ser grátis** e passam a pagar tarifa por mensagem. ⚠️ O valor do Brasil só será anunciado até 01/09 — na aula, mostre **ONDE consultar** a tabela oficial, não grave o número como verdade eterna.
> - **A janela de 24h NÃO acaba.** Ela continua sendo a regra de PERMISSÃO (dentro: texto livre; fora: só template aprovado). O que muda é que responder dentro dela deixa de ser de graça.
> - **Não existe cobrança dupla.** A doc é explícita: *"Meta applies one charge for Meta Business Agent messages"* — quem RESPONDE define a categoria. MBA = só token. Seu agente (ou um humano) = só tarifa por mensagem.
> - **As 72h do Click-to-WhatsApp seguem isentas da tarifa por mensagem** (conversa que nasceu de um anúncio). Como o SEU agente é cobrado por mensagem, ele responde **de graça** nessa janela (sobra só o custo do modelo). O MBA não se beneficia: token não tem isenção.
> - **A conta que vai pra tela:** seu agente ≈ **R$ 0,05-0,10 por resposta** (tarifa + modelo via OpenRouter) vs. MBA ≈ **R$ 0,22-0,28**. Um taxímetro de cada lado — canal (entrega) e cérebro (pensar).
> - **O MBA ainda NÃO foi liberado pra conta do Enzo** → sem demo. Ele entra só como **segmento final da 9.8**: conceito + conta + promessa de vídeo bônus quando a Meta liberar.

## A virada (a espinha)

Todo o módulo constrói UM sistema: um atendente de IA que **atende e vende 24/7 no WhatsApp** de uma clínica de estética, que o aluno **instala e cobra** (~R$ 8k).

Cada aula responde a uma pergunta, nesta ordem:

1. Ele pensa como gente? (cérebro: persona + memória — 9.1 a 9.3)
2. Ele entende áudio e foto? (os sentidos — 9.4)
3. Ele fala pelo WhatsApp? (o canal — 9.5)
4. Ele vende, agenda e sabe a hora de me chamar? (9.6 e 9.7)
5. Ele aguenta o mundo real e me dá lucro? (blindar, reaproveitar, cobrar — 9.8)

Regra de ouro do módulo inteiro: **um chatbot responde; um agente resolve.** (percebe → decide → age)

## Ordem de execução

Primeiro o **cérebro**, no sandbox, longe do WhatsApp — provar o motor na bancada antes de botar na rua. Só quando ele já pensa, sabe e percebe é que entra o **canal** (WhatsApp). Vender, painel e produção por último, quando já existe um sistema pronto pra atacar e pra revender.

Faça nesta ordem. Conectar o WhatsApp cedo, num agente vazio, só adianta a parte chata e atrasa o "uau".

## Parte 1 — O cérebro no sandbox (aulas 9.1 a 9.4)

### 9.1 - O que é um agente + a "cabeça" dele (o documento que a clínica preenche)

> ✅ **GRAVADA (08/07, `[M9 A1].mp4`, ~17 min) — SÓ a parte conceitual:** linear vs agente,
> percebe → decide → age, as 4 peças (modelo + prompt + ferramentas + memória) e — importante —
> **já ensinou a base de conhecimento como FERRAMENTA** (12:58: *"a base não vai ficar no prompt;
> vai ser uma ferramenta... não é em toda mensagem que ele precisa ler essa base inteira"*) e citou
> a regra de ouro no prompt de exemplo. A conta da Meta foi pra abertura da A2; o passo de GERAR o
> documento-modelo pro cliente **não foi gravado em nenhuma aula** (pendência anotada na A4).

**Tópico:** entender o que é um agente de IA (e a diferença pra tudo que o curso já construiu), entender por que ele precisa de uma **base de conhecimento**, e só então gerar o **documento-modelo** que a clínica preenche com os dados reais. A aula segue essa ordem: primeiro o conceito, depois o porquê, depois o prompt — e fecha criando a conta da Meta na tela, pra adiantar a verificação. *(No exemplo: ⏳ a fazer ao vivo — gerar o modelo, mostrar o preenchido e criar a conta da Meta.)*

**O que o aluno aprende (na ordem da aula):**
- **1º — O que é um agente:** percebe → decide → age. A automação (M1) segue um trilho fixo — sempre os mesmos passos; o app (M7) espera o clique. O **agente decide o próximo passo sozinho** — por isso serve pra conversa, onde a entrada é imprevisível. E por baixo é um **app real, igual ao Lead-se** (backend + Supabase + deploy com push).
- **2º — Por que ele precisa de uma base de conhecimento [CORRIGIDO 14/07]:** ela é a **fonte da verdade da empresa, que o agente consulta como FERRAMENTA** quando precisa (preço, serviço, política). Ela não fica no prompt: no prompt fica quem ele é e quando usar cada ferramenta. É dela que ele tira **como responder da melhor forma** (só com informação VERDADEIRA da clínica). Agente sem base de conhecimento **inventa**.
- **3º — Quem escreve a verdade é a clínica, não a IA.** Seu papel é FACILITAR: gerar com o Claude Code um **modelo bem estruturado** (esboço com as seções prontas) e mandar a clínica só **preencher** — ela não escreve do zero. A IA monta o esqueleto; a clínica põe a verdade.
- **4º — Disparar cedo o que depende de terceiros:** a verificação do negócio na Meta pode levar DIAS — criando a conta já na primeira aula, a espera corre em paralelo com o resto do módulo e ninguém trava na 9.5. Quanto antes dispara, mais rápido o projeto termina.

**Prompt(s) pra enviar:**

Quando: Na parte prática, SÓ DEPOIS de explicar o que é um agente e por que ele precisa da base de conhecimento (senão o aluno gera um documento sem entender pra que serve). Gera o documento-modelo que você vai ENVIAR pro cliente preencher. Não é pra IA inventar os dados da clínica; é pra ela montar a ESTRUTURA. Pule se você já tem um modelo desses pronto.

```
Cria um DOCUMENTO-MODELO (um esboço genérico e bem organizado) da base de conhecimento de uma [clínica de estética], pra eu ENVIAR pro meu cliente preencher com os dados reais dele. NÃO invente os dados da clínica -- use exemplos entre [colchetes] que ele troca. Organize em seções claras:
- Sobre a clínica (nome, endereço, horários, contato, profissionais);
- Serviços, preços e duração (em tabela);
- Perguntas frequentes, com as respostas;
- Políticas (agendamento, remarcação/cancelamento, atraso, pagamento, cuidados antes/depois);
- Regras do atendente (o que ele NÃO responde, quando chama um humano, o tom);
- Promoções vigentes (o que vale agora, com validade).
Deixe cada campo fácil de preencher e explique em uma linha o que vai em cada seção, pra clínica não ter que escrever do zero.
```

**Passos no vídeo (na ordem da gravação -- o prompt entra no passo 6):**

1. Abra mostrando o vilão ao vivo: um chatbot de menu ("digite 1... digite 2") recebendo um áudio ou pergunta torta, e travando. Frase: *"isso é um cartaz, não um atendente."*
2. Logo na sequência, a **promessa do módulo**: *"neste módulo a gente constrói um atendente de IA que atende e vende 24/7 no WhatsApp -- e no fim você instala numa clínica de verdade e cobra uns R$ 8 mil por isso."* Se o sistema já estiver pronto quando você gravar (vale gravar esta abertura por último), mostre 30 segundos dele funcionando: chega um áudio, ele responde certo e agenda. É o "uau" que segura o aluno pelas 8 aulas.
3. Explique **o que é um agente**, devagar: o loop **percebe → decide → age**. Compare com o que o curso já construiu: a automação (M1) segue um trilho fixo -- sempre os mesmos passos, na mesma ordem; o app (M7) fica parado esperando o clique. O agente **decide o próximo passo sozinho** -- por isso é o certo pra uma conversa. Dê o alívio: *"por baixo é um app igual ao Lead-se, que você já fez."*
4. Mostre a régua "fora da caixa" na tela (conversa natural · conhece a clínica · age · lembra · chama humano) -- o mapa do módulo. Aponte o item **"conhece a clínica"**: é a ponte pro resto da aula.
5. Explique **por que ele precisa de uma base de conhecimento**: sem ela, o agente INVENTA (preço errado, promessa que a clínica não faz). A base é o **"prompt" do agente**: é dela que ele tira **como responder** (só com a verdade da clínica) e **quando usar cada ferramenta** -- perguntaram preço? consulta a tabela. Pediram horário? agenda. Pergunta médica? chama um humano. *"O agente é só tão bom quanto esse documento."*
6. AGORA rode o prompt e gere o **documento-modelo** ao vivo. Mostre que a IA fez a ESTRUTURA com [colchetes] -- sem inventar dado de clínica nenhum.
7. Explique como o aluno usa: **manda o modelo pro cliente** (WhatsApp/e-mail), a clínica só troca os [colchetes] pelos dados reais e devolve. *"Ela não escreve do zero -- só preenche."*
8. Mostre o **exemplo já preenchido** (a Clínica Renov, fictícia, do material da aula) pra dar o resultado esperado. Feche: *"esse documento é a cabeça do atendente. Na 9.3 ele passa a responder SÓ com o que está aqui -- e a saber a hora de agendar e a hora de te chamar."*
9. Feche a aula **NA TELA, adiantando a burocracia da Meta**: entre em developers.facebook.com, crie a sua conta de desenvolvedor ao vivo e, se ela pedir, dispare a **verificação do negócio**. Explique o porquê enquanto clica: *"esse processo pode demorar alguns dias -- e ele não depende de nada das próximas aulas. Quanto antes a gente disparar, mais rápido você termina o projeto: quando o atendente estiver pronto pro WhatsApp, na 9.5, o seu cadastro já vai estar liberado."* Mesma lógica do documento que o cliente foi preencher: **o que depende de terceiros dispara hoje**. Deixe claro que a conta não é usada pra NADA até a 9.5 -- é só deixar a espera correndo. *(Nota de gravação: atenção aos dados pessoais na tela durante o cadastro.)*

**Pra qualquer projeto [CORRIGIDO 14/07]:** a base de conhecimento é a **fonte da verdade que o agente consulta como FERRAMENTA** (não fica no prompt — no prompt fica quem ele é e quando usar cada ferramenta). A IA monta o esqueleto (o modelo), o cliente preenche a verdade -- **nunca peça pra IA inventar os dados do negócio.**

---

### 9.2 - O cérebro no sandbox: persona + memória, testado ANTES do WhatsApp

> ✅ **GRAVADA (13/07, `[M9 A2].mp4`, ~10 min) — o que mudou em relação ao roteiro:**
> - **Abriu com a Meta, não fechou a 9.1 com ela:** verificação do negócio disparada em
>   **business.facebook.com** (portfólio empresarial → central de segurança → iniciar verificação;
>   2–5 dias úteis) — não developers.facebook.com. A conta de dev + app entram só na 9.5.
> - **Projeto no Antigravity** com a estrutura de agente (`skills/` + `tools/`), não "esqueleto do
>   Lead-se". Primeira skill criada: `constituicao` — de propósito **vazia** (a base entra na 9.3).
> - **Chave via OpenRouter** (não Anthropic) e modelo do agente = **Sonnet 5**; construção com
>   Opus 4.8. Chave no `.env` criado à mão — segredo fora do código.
> - **A memória veio ANTES da persona** (persona ficou pra A3): sandbox no navegador → agente
>   genérico ("sou o Claude") → sem memória ("qual o meu nome?") → Supabase projeto
>   `atendimento-renove`, tabelas **`conversas`** e **`mensagens`**, agente lê as **últimas 20
>   mensagens** antes de cada resposta (via MCP do Supabase).
> - **Promessa feita em vídeo (não estava no roteiro):** *"no final desse módulo eu vou
>   disponibilizar uma skill que vai te guiar a criar um agente de IA"* — entregar na 9.8
>   (anotado lá).
> - Não teve: leitura da constituição/persona ao vivo (foi pra A3) e o teste do preço inventado
>   como fecho (ainda não aconteceu em nenhuma aula).
> - **Pendências anotadas pelo Enzo no Notion (14/07):** (1) disparar a verificação da Meta DE
>   VERDADE (clicar "Iniciar verificação" — na gravação aparece o caminho, confirmar se o clique
>   real ficou de fora); (2) gerar o documento-modelo ao vivo + mostrar o exemplo da Renov
>   preenchido ("mando pra clínica preencher") — encaixado como item opcional da A4.

**Tópico:** nasce o projeto do atendente — um app novo, com o mesmo esqueleto do Lead-se (backend + Supabase), e um chat de teste simples no navegador (o **sandbox**) onde você monta o cérebro (modelo + constituição + memória) e CONVERSA com ele. Sem WhatsApp nenhum ainda. *(No exemplo: ⏳ a fazer ao vivo — criar o projeto, conversar no sandbox e ligar a memória.)*

**O que o aluno aprende (na ordem da aula):**
- **1º — Cérebro e canal são peças separadas.** O WhatsApp é só o canal por onde a mensagem chega; quem pensa é o cérebro. E o cérebro não sabe de onde a mensagem veio — por isso dá pra testar num **sandbox**: uma bancada de teste, um chat simples no navegador que só você vê.
- **2º — Por que o cérebro vem primeiro:** cérebro ruim descoberto no sandbox se conserta com um prompt — barato. Descoberto no WhatsApp do cliente, custa a confiança dele. E conectar canal num agente vazio só adianta a parte chata; o "uau" tem que vir antes da infra.
- **3º — As 3 peças do cérebro (nenhuma é nova):** o **modelo de IA** pensa e responde; a **constituição** (o documento de regras que você conheceu no M3) diz quem ele é — o tom, o que vende, os limites; a **memória** no Supabase (também do M3) faz ele lembrar da conversa e reconhecer o cliente que volta. Tudo dentro de um app real, construído igual ao Lead-se.
- **4º — O que ele ainda NÃO tem:** a base de conhecimento (o documento da 9.1). Ele conversa bem, mas não sabe preço, serviço nem política — e, se perguntarem, INVENTA. É de propósito: esse buraco é exatamente o que a 9.3 conserta.

**Prompt(s) pra enviar:**

Quando: Na parte prática, SÓ DEPOIS de explicar o cérebro e o porquê do sandbox (senão o aluno cria um app sem entender por que ainda não tem WhatsApp) -- faz nascer o projeto do zero, com o chat de teste e a constituição. Pule se você já criou o projeto do agente com um sandbox funcionando.

```
Vamos criar um projeto NOVO do zero: um atendente de IA pra uma [clínica de estética]. Ele ainda NÃO vai ter WhatsApp -- por enquanto eu quero só o cérebro, com um chat de teste simples no navegador pra eu conversar com ele e avaliar as respostas. Usa o mesmo esqueleto do meu projeto anterior: [backend + Supabase]. A personalidade fica numa constituição -- um arquivo separado, que eu edito sem mexer em código: ele é a recepcionista da [Clínica Renov Estética], tom atencioso e objetivo, trata por "você", entende o que a pessoa procura e conduz pra agendar uma [avaliação gratuita]; não dá conselho médico e não promete resultado. Ele ainda NÃO tem os dados da clínica (serviços, preços, políticas) -- isso entra depois, então NÃO invente nada disso na constituição. A chave do modelo de IA fica nas variáveis de ambiente, fora do código. Antes de criar, me explica em poucas linhas como as partes se conectam.
```

Quando: Depois de você conversar com o agente e mostrar ele ESQUECENDO tudo ao recarregar a página -- a dor aparece antes da solução. Pule se o seu agente já grava as conversas no Supabase.

```
Agora dá MEMÓRIA pro atendente, gravada no Supabase -- a mesma ideia da memória que eu montei no [CRM do Módulo 3]: cria as tabelas pra guardar as conversas e as mensagens, e faz o agente ler o histórico antes de cada resposta, pra lembrar do que já foi dito e reconhecer quando o mesmo cliente volta. Antes de mexer, me explica como pra leigo o caminho que uma mensagem faz do chat até o banco e de volta. Não encosta na constituição nem nas chaves de API -- é só a memória. No fim, me diz os nomes das tabelas que você criou.
```

**Passos no vídeo (na ordem da gravação -- o prompt 1 entra no passo 4; o prompt 2, no passo 9):**

1. Retome a 9.1 em 30 segundos: o atendente está desenhado e o documento-modelo já foi pra clínica preencher. *"Enquanto a clínica preenche, a gente dá vida ao agente. Hoje NASCE o projeto -- e no fim da aula você conversa com ele."*
2. Explique o **conceito**: cérebro e canal são peças separadas. O WhatsApp é só a porta de entrada; quem pensa é o cérebro -- e o cérebro não sabe de onde a mensagem veio. Por isso dá pra testar numa bancada: o **sandbox**, um chat no navegador que só você vê. Mostre as 3 peças na tela: modelo (pensa) + constituição (quem ele é -- do M3) + memória (lembra -- Supabase, do M3).
3. Explique o **porquê da ordem**: motor se prova na bancada antes de botar o carro na rua. Cérebro ruim descoberto aqui custa um prompt; descoberto no WhatsApp do cliente, custa a confiança dele. WhatsApp num agente vazio só adianta a parte chata. Dê o alívio: *"o app é igual ao Lead-se -- backend + Supabase. Nada novo de infra hoje."*
4. AGORA rode o **prompt 1** e acompanhe a IA criando o projeto. Leia a explicação dela em voz alta -- o aluno precisa ver que você entende o que está sendo montado.
5. Crie a **chave do modelo NA TELA** (sem ela o cérebro não liga): abra o painel do provedor -- no nosso caso, o da Anthropic (console.anthropic.com) -- gere a chave ao vivo e cole na variável de ambiente (`.env`). *"Segredo fora do código, regra desde o M8. Essa chave é a conta de luz do cérebro: é por ela que o modelo cobra -- e cada cliente seu vai ter a dele."* *(Nota de gravação: não deixe a chave legível no vídeo -- gere na tela e revogue depois da gravação.)*
6. Abra a **constituição** e leia ao vivo: o tom, o objetivo (conduzir pra avaliação gratuita), os limites (não dá conselho médico, não promete resultado). Mude uma linha do tom e mostre: persona é documento, não código -- igual à constituição do M3.
7. O **"uau"**: converse com ele no sandbox. *"Oi, queria saber mais sobre a clínica"* -- repare no tom de recepcionista, nas perguntas que ele faz de volta, na condução pra avaliação. Frase: *"isso não é menu de 'digite 1'. É uma conversa."*
8. Quebre a memória ao vivo: recarregue a página e diga *"oi, sou eu de novo"*. Ele não faz ideia de quem você é -- memória de peixinho. Cliente de verdade some e volta 3 dias depois; desse jeito não dá. É o gancho do prompt 2.
9. Rode o **prompt 2**. Abra o painel do Supabase e mostre as tabelas com as mensagens caindo em tempo real -- a conversa virou dado, igual aos leads do Lead-se.
10. Teste o retorno: diga *"meu nome é [Ana], tenho interesse em limpeza de pele"*, feche o chat, volte -- ele te reconhece e retoma de onde parou.
11. Feche com o **teste do preço** (o gancho da 9.3): pergunte *"quanto custa a limpeza de pele?"*. Ele responde com toda a segurança... um preço INVENTADO. Não conserte. *"Ele conversa bem, mas ainda não sabe a verdade da clínica. Na 9.3, o documento da 9.1 entra no cérebro -- e ele passa a responder SÓ com o que está lá."*

**Pra qualquer projeto:** todo agente é **cérebro + canal** -- e o cérebro se prova num sandbox antes de ganhar o canal. Modelo + constituição + memória primeiro, na bancada, onde errar custa um prompt; o canal só entra quando a conversa já convence.

---

### 9.3 - O que faz ele "fora da caixa": conhecimento do negócio + ferramentas

> ✅ **GRAVADA (13-14/07, `[M9 A3].mp4`) — cobriu o SABER; o FAZER ficou pra A4:**
> - Criou o **`prompt-agente.md`** (prompt de sistema, lido a cada mensagem): OBJETIVO em título
>   (recepcionista virtual da Clínica Renov, conduzir pra avaliação gratuita, tom caloroso, "você",
>   mensagens curtas, uma pergunta por vez) + seções Ferramentas / Como agir / Nunca faça isso
>   (vazias — preencher de forma REATIVA, quando aparecer problema).
> - **Base de conhecimento como FERRAMENTA (o coração da aula):** o Claude Code tentou colocar a
>   `constituicao.md` no prompt de sistema e o Enzo corrigiu ao vivo — ela é ferramenta consultada
>   só quando necessário. Explicou **function calling** (o que transforma modelo em agente; o mesmo
>   mecanismo dos MCPs e dos conectores do ChatGPT) e o loop de ferramentas no `server.js`.
> - Porquês ditos em aula: doc grande lido toda mensagem = **caro**; prompt inchado = **mais
>   alucinação**; prompt enxuto = agente mais preciso.
> - **Base preenchida entrou via PDF → Markdown** (Claude Code converteu; limpou os guias de
>   preenchimento; colou na `constituicao.md`). Antes/depois na tela: sem base, ele enrola sobre o
>   endereço; com base, responde os 4 serviços + promoção de cliente novo (R$ 99) e o endereço
>   (Rua das Flores, 123).
> - Ferramenta declarada no prompt: *"constituição — tudo sobre a Clínica Renov: dados, serviços,
>   preços, dúvidas frequentes, políticas e promoções"*.
> - Fecho gravado: *"ele ainda não consegue FAZER nada — agendar, registrar cliente no CRM — é o
>   que a gente faz na próxima aula"* → o teaser aponta pras **ferramentas de ação (A4)**, não
>   pros sentidos.
> - **NÃO cobriu (vai pra A4):** ferramentas de horário e de registrar lead; a regra de ouro
>   escrita no prompt; a demo "muda o preço na base e a resposta muda"; o teste do preço inventado
>   (criolipólise); o passo de GERAR o documento-modelo pro cliente preencher (usou a base já
>   preenchida — o modelo em branco vira material da aula ou entra na A4, decidir).

**Tópico:** plugar a base de conhecimento preenchida (a da Renov, que nasceu na 9.1) no agente e dar as primeiras **ferramentas** — consultar preço, ver horário livre (ainda simulado) e registrar o lead no Supabase. É aqui que ele deixa de ser chatbot e vira atendente. Ainda no sandbox. *(No exemplo: ⏳ a fazer ao vivo — plugar a base preenchida e criar as 3 ferramentas.)*

**O que o aluno aprende (na ordem da aula):**
- **1º — O que separa um chatbot de um atendente: SABER e FAZER.** O cérebro da 9.2 conversa e lembra — mas, quando não sabe, inventa. Atendente de verdade **sabe** (a base da 9.1, agora preenchida pelo cliente) e **faz** (ferramentas). ~~E o "sabe" NÃO é ler a base a cada mensagem~~ **[CORRIGIDO 14/07]**: a base é a **primeira FERRAMENTA** do agente — ele consulta quando precisa de dado da empresa, e só então. No prompt de sistema (lido a cada mensagem) fica só quem ele é e quando usar cada ferramenta. Doc da empresa no prompt = caro (pensa num e-commerce) e prompt inchado = mais alucinação.
- **2º — Ferramenta = ação que o agente executa sozinho no meio da conversa** (consultar a tabela de preços, ver horário livre, gravar o lead no Supabase). É o "age" do loop percebe → decide → age da 9.1 — e quem decide QUANDO usar cada uma é o próprio agente.
- **3º — A regra de ouro (anti-invenção):** o agente responde SÓ com o que está na base; se não sabe, diz que vai confirmar com a equipe e passa pra um humano; NUNCA inventa preço, desconto ou promessa. (Essa regra vai ser atacada de propósito na 9.8.)
- **4º — Tudo é DADO, não código:** persona, base e regras moram em arquivos editáveis, separados do código. Trocar de cliente = trocar arquivos, não reconstruir — a semente do serviço que você revende (9.8).

**Prompt(s) pra enviar:**

**[SUPERADO na gravação — a base virou FERRAMENTA, não leitura a cada resposta. O prompt abaixo ficou como registro; o que valeu está no bloco "✅ como foi gravada" acima.]** Quando: Na parte prática, SÓ DEPOIS de explicar a regra de ouro e o porquê da arquitetura -- senão o aluno pluga a base sem a trava e o agente continua inventando. Você precisa da base JÁ PREENCHIDA: se o seu cliente ainda não devolveu a dele, use a da Clínica Renov (o exemplo do material da aula) -- não pule a aula esperando o documento.

```
Quero plugar o conhecimento no meu agente [a recepcionista da clínica de estética]. A base de conhecimento preenchida pelo cliente está em [base-conhecimento.md]. Esse documento é pequeno e cabe inteiro na "cabeça" do agente -- então NÃO monta sistema de busca de empresa grande: faz o agente ler o documento INTEIRO antes de cada resposta. E grava a regra de ouro nas regras dele: responder SÓ com o que está nesse documento; se a informação não estiver lá, dizer que vai confirmar com a equipe e sinalizar a conversa pra um humano assumir -- NUNCA inventar preço, desconto ou promessa. Deixa a base, a persona e as regras como ARQUIVOS editáveis, separados do código, pra eu trocar de cliente depois sem reprogramar nada. Antes de mexer, me explica em uma linha onde cada coisa vai morar. Não encosta nas chaves de API nem na memória de conversa que já funciona.
```

Quando: Só depois que o teste da base passou (preço certo E "vou confirmar" no que não está lá) -- ferramenta em cima de base furada só espalha o erro. Não caia na tentação de já conectar a agenda real: aqui o horário é simulado de propósito; o Google Calendar de verdade entra na 9.6.

```
Agora quero dar 3 ferramentas pro agente -- ações que ele mesmo decide usar no meio da conversa: (1) consultar serviços, preços e duração na base de conhecimento; (2) ver horários disponíveis -- por enquanto SIMULADA, com uma lista fixa de horários de exemplo, porque a agenda real do Google entra só numa aula mais pra frente; deixa anotado no projeto que ela é temporária; (3) registrar o lead numa tabela de leads NOVA, no Supabase DESTE projeto, no mesmo formato da que eu construí no [CRM do Módulo 3]: nome, telefone e serviço de interesse. As ferramentas seguem a regra de ouro: nada de resposta fora da base. Antes de construir, me explica pra leigo, em uma linha cada, quando o agente vai decidir usar cada ferramenta. Não encosta nas chaves de API.
```

**Passos no vídeo (na ordem da gravação -- os prompts entram nos passos 4 e 6):**

1. Abra com o vilão da aula, ao vivo: no sandbox da 9.2, pergunte algo que não existe em base nenhuma -- *"vocês fazem criolipólise? quanto custa?"* -- e deixe o agente inventar um preço com toda a confiança. Frase: *"ele conversa bem, lembra de você -- e mente na cara dura. E mentira com preço custa cliente."*
2. Explique o conceito: pra virar atendente faltam duas coisas -- **SABER** e **FAZER**. Saber = a base de conhecimento que você gerou na 9.1, agora preenchida pelo cliente. Fazer = **ferramentas**: ações que o agente executa sozinho no meio da conversa (consultar a tabela de preços, ver horário, gravar o lead). É o "age" do loop percebe → decide → age -- e é o agente quem decide a hora de usar cada uma.
3. **[CORRIGIDO 14/07]** Explique o porquê da arquitetura ANTES do prompt: o prompt de sistema é lido a CADA mensagem — por isso ele fica ENXUTO (quem ele é + quando usar cada ferramenta); a base da empresa entra como **ferramenta** que o agente consulta sob demanda (function calling). Doc no prompt = caro e mais alucinação. E crave a **regra de ouro**: responde SÓ com o que está na base; não sabe → "vou confirmar com a equipe" e um humano assume; NUNCA inventa preço, desconto ou promessa. *"É essa regra que protege a clínica -- e o seu contrato de R$ 8 mil."* *(Na gravação, a regra de ouro NÃO foi escrita no prompt — ficou pra A4.)*
4. Rode o **Prompt 1**. Leia a explicação que a IA devolver e mostre no projeto: base, persona e regras viraram arquivos de dados, separados do código.
5. Teste no sandbox: pergunte *"quanto custa a limpeza de pele?"* -- tem que vir **R$ 180**, o valor da base. Depois repita a pergunta da abertura (criolipólise): agora ele diz que vai confirmar com a equipe. Mesmo cérebro, resposta oposta -- a diferença é a base + a regra.
6. Rode o **Prompt 2** (as 3 ferramentas). Antes de aceitar, leia a explicação de leigo que você pediu: quando o agente decide consultar preço, quando olha horário, quando grava o lead.
7. Teste as ferramentas numa conversa só: *"tem horário amanhã à tarde pra massagem modeladora?"* -- ele consulta a disponibilidade (simulada) e oferece opções; dê nome e telefone; abra o Supabase do projeto e mostre o lead gravado na tabela nova. *"O PADRÃO do CRM que você construiu lá atrás acabou de virar peça do atendente."*
8. Feche provando que tudo é DADO: mude um preço na base ao vivo (limpeza de pele de R$ 180 pra R$ 200), pergunte de novo e veja a resposta mudar sem tocar em código. **Desfaça e volte pro R$ 180 antes de encerrar** -- é o valor que o teste da 9.5 espera. *"Trocar de cliente é trocar esses arquivos -- guarde isso pra 9.8."* Teaser: *"ele já sabe e já faz. Na 9.4 ele ganha ouvido e visão: áudio e foto."*

**Pra qualquer projeto:** conhecimento + ferramentas é o que transforma chatbot em atendente: o agente só fala a verdade do negócio (está na base? responde; não está? humano) e age por ferramentas que ele mesmo decide usar. E tudo que muda de cliente pra cliente -- persona, base, regras -- é dado editável, nunca código: trocar de cliente é trocar arquivos.

---

### ✅ A4 — GRAVADA: Fechar o FAZER: as primeiras ferramentas de ação (agenda REAL + Sheets)

> ✅ **GRAVADA (`[M9 A4] Ferramentas VO`, transcrita 20/07) — o FAZER que a 9.3 deixou de fora,
> mas com DUAS divergências grandes do roteiro:**
> - **Deu a agenda REAL logo aqui — e por CONTA DE SERVIÇO, não OAuth simulado.** O roteiro previa
>   horário SIMULADO nesta aula e a agenda real só na 9.6. Na gravação o Enzo já conectou o Google
>   Calendar de verdade: `console.cloud.google.com` → novo projeto ("agente renove") → Google
>   Calendar API ativada → **credencial de conta de serviço** (papel proprietário) → chave
>   **JSON** salva como **`googlecredentials.json`** ao lado do `server.js` (adicionada ao
>   `.gitignore` — *"esse arquivo é uma senha, nunca manda pro GitHub"*) → **calendário dedicado
>   novo** ("R9/Renove") **compartilhado com o e-mail da conta de serviço**. Ferramentas:
>   **ver horários livres** + **criar evento**.
> - **O "salvar cliente" foi pro Google Sheets, não Supabase.** Todo cliente novo cai numa planilha
>   ("Cliente Renove"). Motivo dito em aula: contato vale ouro pra remarketing (promoção a cada
>   6 meses); citou que dava pra usar um CRM ou o Supabase, mas escolheu Sheets pela simplicidade.
> - **As descrições das ferramentas foram pro prompt REATIVAMENTE:** o agente primeiro NÃO usou as
>   ferramentas direito porque o prompt não as descrevia (o Antigravity até recomendou as
>   descrições); aí o Enzo voltou pro **Sonnet 5** e adicionou "ver horários livres", "criar
>   evento" e "salvar cliente" na seção Ferramentas — cada uma com o que faz + quando usar.
> - Momento didático extra: **compactar o contexto** em vez de `/clear` pra economizar token,
>   aproveitando que a conversa já sabe onde as ferramentas moram.
> - **NÃO cobriu (movido pra 9.6):** a **regra de ouro** (nada de "regra de ouro", "criolipólise"
>   ou teste do preço inventado na gravação); a demo "muda o preço na base e a resposta muda"; o
>   documento-modelo em branco da 9.1 (segue não gravado — vira material da aula).
> - Fecho gravado: teaser pros **sentidos** (*"na próxima aula ele vai receber fotos e áudios"*) →
>   é a A5.

**Tópico (como FICOU gravado):** o agente já SABE (base como ferramenta, A3); nesta aula ele passa
a FAZER de verdade — **ver horários livres** e **criar evento** na agenda real (conta de serviço +
calendário dedicado) e **salvar todo cliente novo no Google Sheets**. Cada ferramenta é declarada
no prompt de sistema (o que faz + quando usar). Ainda no sandbox.

**Prompts que valeram (reconstruídos do vídeo):**

Quando: agente com a base como ferramenta funcionando (A3). É o pedido das ferramentas de ação.

```
Agora quero dar ferramentas de ação pro meu agente, pelo mesmo function calling que a gente já implementou: (1) VER HORÁRIOS LIVRES e (2) CRIAR EVENTO na agenda real da clínica -- o Google Calendar; e (3) SALVAR todo cliente novo que chegar numa planilha do Google Sheets (nome, telefone/WhatsApp e serviço de interesse), porque esse contato vale pra remarketing depois. Antes de construir, me explica pra leigo, em uma linha cada, quando o agente vai decidir usar cada ferramenta, e me diz o passo a passo pra eu criar a credencial do Google (a parte manual eu faço). Não encosta nas chaves de API nem na memória que já funciona.
```

Passo manual do Google (na tela, o Enzo faz): `console.cloud.google.com` → novo projeto → ativar
**Google Calendar API** → **Credenciais → conta de serviço** (papel proprietário) → **Chaves →
adicionar chave → JSON** → renomear pra **`googlecredentials.json`** e arrastar pro projeto ao lado
do `server.js` (confirmar que entrou no `.gitignore`) → copiar o **e-mail da conta de serviço** →
criar um **calendário novo** só do atendimento → **compartilhar** esse calendário com aquele
e-mail. Só então as ferramentas de agenda funcionam.

Quando: se o agente não estiver usando as ferramentas direito — falta a descrição no prompt.

```
Volta pro modelo Sonnet 5 e adiciona a descrição de cada ferramenta (ver horários livres, criar evento, salvar cliente) na seção Ferramentas do prompt-agente.md: uma linha com o que faz e quando usar. É isso que faz o agente decidir usar cada uma na hora certa.
```

**Pra qualquer projeto:** ferramenta nova só entra com a linha "o que faz + quando usar" no prompt
(se faltar, o agente não usa). Agenda de terceiro conecta por **conta de serviço** (uma chave JSON
que é senha, no `.gitignore`) + um **calendário dedicado compartilhado** — não precisa de OAuth do
dono pra um calendário que o próprio atendente administra. E contato de cliente é ativo de
remarketing: salve desde o primeiro dia.

> **⏳ Pendência pra encaixar na 9.6:** a **regra de ouro** (trava anti-invenção) não foi ao ar.
> Ela abre a 9.6 — veja lá.

---

### 9.4 - Os sentidos do agente: entender áudio e imagem

> ✅ **GRAVADA como A5 (`[M9 A5]VO`, transcrita 20/07) — o que valeu vs. o roteiro:**
> - **Rota = OpenRouter + Gemini 3.5 Flash** (não uma `GEMINI_API_KEY` separada). O Enzo checou
>   que o Sonnet 5 lê imagem mas **não lê áudio**, então escolheu no OpenRouter o **Gemini 3.5
>   Flash** (texto, imagem, vídeo, arquivo e áudio) — uma chamada só cobre os dois sentidos.
> - **Triagem de mídia é PRÉ-PASSO do fluxo linear, não ferramenta do agente** (o Enzo frisou isso
>   na tela): mensagem chega → **identifica** texto/áudio/imagem → áudio e imagem são **transcritos/
>   descritos pro Gemini** e viram **texto com um rótulo** → só então salva na memória (Supabase) e
>   segue pro agente. Da imagem ele devolve descrição objetiva + qualquer texto visível; legenda do
>   cliente é preservada.
> - **Uma linha nova no prompt de sistema** ensina o agente a tratar os rótulos ("[áudio do
>   cliente]", "[imagem...]") como fala normal, **sem mencioná-los** na resposta.
> - **Testado ponta a ponta:** áudio *"Botox amanhã 4 da tarde"* → transcrito → agente vê a agenda,
>   não tem 16h, oferece horários próximos e **salva o cliente no Sheets**; **print de promoção**
>   (limpeza de pele R$ 99, válida até 31/07, só cliente novo) → agente lê e confirma pela base;
>   fechou agendando uma cliente nova (limpeza de pele, 60 min, promo R$ 99) na agenda real.
> - Não usou a alternativa Whisper (o prompt 2 abaixo segue como registro, fora do vídeo).
> - Fecho gravado: teaser direto pro **WhatsApp** (a 9.5).

**Tópico:** dar **ouvido e visão** ao agente — entender o áudio e ler a foto que o cliente manda, via modelo multimodal (Gemini 3.5 Flash pelo OpenRouter) por API, ainda no sandbox. *(No exemplo: ⏳ a fazer ao vivo — plugar o Gemini e testar com um áudio real e uma foto.)*

**O que o aluno aprende (na ordem da aula):**
- **1º — No Brasil, cliente manda áudio.** O tempo todo (e foto também). Um atendente que só lê texto ignora metade das mensagens reais — e volta a ser o chatbot genérico da 9.1. É aqui que mora o maior diferencial pro mercado brasileiro.
- **2º — O que é multimodal:** um modelo que entende mais do que texto — áudio e imagem também. É o "percebe" do loop percebe → decide → age, completado: o agente já pensa (9.2), sabe (9.3) e age (A4); agora ele **ouve e enxerga**.
- **3º — Por que via API, e não instalado no servidor:** programa de transcrição rodando na própria máquina exige GPU (placa de vídeo potente) — e o servidor do agente, a mesma hospedagem do Lead-se, **não tem**. Pela API você manda o arquivo e recebe o entendimento, pagando centavos. O **Gemini** resolve os DOIS sentidos numa chamada só (ouvido + visão), nada pra hospedar. Alternativa só pro áudio: **Whisper via API** (Groq/OpenAI) — transcreve (transforma o áudio em texto) e o texto segue o caminho normal.
- **4º — Sentido novo, regras velhas:** o que o agente ouviu ou viu passa pelo MESMO cérebro — ele continua respondendo só com o que está na base de conhecimento e chamando o humano no resto. Entender o áudio não é licença pra inventar.

**Prompt(s) pra enviar:**

Quando: Na parte prática, SÓ DEPOIS de explicar por que a rota é via API -- senão o aluno aceita a primeira solução que a IA sugerir, que pode ser instalar um modelo pesado no servidor. Antes de rodar, pegue a chave do Gemini e coloque na variável de ambiente (passo 4). Pule se o seu agente já entende áudio e imagem.

```
Meu agente do sandbox hoje só entende texto, e cliente brasileiro manda áudio e foto o tempo todo. Quero dar a ele ouvido e visão usando um modelo multimodal via API (o Gemini): quando chegar um áudio ou uma imagem na conversa, o agente manda o arquivo pro Gemini entender (transcrever o áudio, descrever a imagem) e responde a partir disso -- seguindo as MESMAS regras de sempre: só responde com o que está na base de conhecimento e chama um humano no resto. Antes de mexer em qualquer coisa, me explica em linguagem de leigo como isso vai funcionar e o que você vai alterar. Importante: tudo via API, nada de instalar modelo de transcrição no servidor (ele não tem placa de vídeo). A chave já está na variável de ambiente [GEMINI_API_KEY] -- usa ela de lá e não encosta nas outras chaves de API. Ainda é só no sandbox, sem WhatsApp.
```

Quando: Só se você quiser (ou precisar) trocar o ouvido pra Whisper via API ([Groq/OpenAI]) -- ex.: pra separar a transcrição do cérebro ou comparar a qualidade em português. Pule se o teste com o Gemini funcionou -- uma chamada só é mais simples e já cobre áudio e imagem.

```
Em vez do Gemini pra entender o áudio, quero usar o Whisper via API ([Groq/OpenAI]) SÓ pra transcrição: o áudio vira texto e o texto segue o caminho normal do agente. Me explica a diferença entre as duas rotas antes de trocar. Continua tudo via API (nada instalado no servidor), a chave nova vai em variável de ambiente, e você não encosta nas chaves que já existem. As imagens continuam sendo entendidas como estão hoje.
```

**Passos no vídeo (na ordem da gravação -- o prompt 1 entra no passo 5; o prompt 2 é alternativa e não entra no vídeo):**

1. Abra com o problema ao vivo: toque um áudio real de cliente ("queria marcar amanhã de tarde") e mande pro agente como ele está hoje — ele trava ou pede "pode escrever?". Frase: *"no Brasil, cliente manda áudio. Atendente que não ouve perde metade das conversas — e vira genérico de novo."*
2. Explique o conceito: **multimodal** é um modelo que entende mais do que texto — áudio e imagem. O agente já pensa (9.2), sabe (9.3) e age (A4); esta aula completa o "percebe" do loop. É o "uau" do módulo: o diferencial que os bots de menu não têm.
3. Explique o **porquê da rota**: a tentação é instalar um programa de transcrição no próprio servidor — mas isso pede GPU (placa de vídeo potente), e o servidor do agente (a mesma hospedagem do Lead-se) não tem. A saída é API: manda o arquivo, recebe o entendimento, paga centavos. O Gemini faz ouvido + visão numa chamada só; Whisper via API (Groq/OpenAI) é a alternativa só pro áudio.
4. Pegue a chave do Gemini no Google AI Studio e coloque na variável de ambiente — regra do M8: segredo nunca no código.
5. AGORA rode o Prompt 1. Leia com o aluno a explicação que a IA der ANTES de aceitar as mudanças — é ela quem confirma que nada vai ser instalado no servidor.
6. Teste o ouvido no sandbox: envie o MESMO arquivo de áudio do passo 1. O agente transcreve, entende "amanhã de tarde", consulta a disponibilidade (ferramenta da 9.3) e responde certo, oferecendo horários da tarde. Compare com o passo 1 — é o antes e depois da aula.
7. Teste a visão: mande um print da promoção da Renov ("limpeza de pele + peeling por R$ 280") perguntando *"isso ainda vale?"* — ele lê a imagem e responde pela seção de promoções da base. E o contra-teste: foto da pele com *"o que resolve isso?"* → é diagnóstico, ele chama o humano. A regra de não inventar vale pros sentidos também.
8. Cite de leve: responder EM áudio também dá (voz gerada via API) — opcional, toque final pra quem quiser depois. Não construa agora.
9. Feche: *"o cérebro está completo — pensa, lembra, sabe, age e agora percebe qualquer mensagem que chegar. Na 9.5 ele sai da bancada e ganha o canal de verdade: o WhatsApp."*

**Pra qualquer projeto:** agente que atende gente de verdade precisa entender a mensagem como ela CHEGA (áudio, foto, texto torto), não como você queria que chegasse. Sentidos vêm por API multimodal — nada de modelo pesado no seu servidor — e tudo que ele ouve ou vê obedece às mesmas regras do cérebro: base de conhecimento ou humano.

## Parte 2 — O canal (aula 9.5)

### 9.5 - Conectar no WhatsApp de verdade (publicando com 1 push, como no Lead-se)

> 🎬 **PRA GRAVAR, abra SÓ a página filha no Notion "🎬 9.5 — Guia de gravação"** —
> **autossuficiente e consolidada (21/07)**: checklist pré-gravação, a ordem em 11 passos, os
> prompts curtos e TODO o passo a passo do painel da Meta (app → IDs → webhook → token permanente
> → número real com bifurcação) + tabela de erros. O texto abaixo e o `guia-painel-meta-9.5.md`
> viraram referência — não precisam estar abertos na gravação.

> ✅ **GRAVADA como A6 (`[M9 A6].mp4`, 21–23/07; transcrita e no vault 24/07) — como foi:**
> webhook + deploy no Railway via MCP GitHub/Railway (repo `atendimento-renove`); app criado na
> Meta (caso de uso WhatsApp); **número de TESTE primeiro** e depois **chip dedicado COMPRADO
> (na Salve)** — sem coexistence (não existe no painel DIY; recomendação gravada: nunca usar o
> número oficial da empresa com agente de IA, risco de banimento). Token permanente, chave secreta
> do app (`META_APP_SECRET`), pagamento em US$. Bug ao vivo resolvido: `googlecredentials.json`
> estava no `.gitignore`, nunca subiu → virou variável de ambiente no Railway. Teste ponta a
> ponta: conversa no WhatsApp real com agendamento caindo no Google Calendar. **Fecho prometeu:
> "na próxima aula, todos os preços, as mudanças de 2026 e a API não oficial"** → é exatamente o
> que a nova A7 cobre (ver nota no topo).

**Tópico:** tirar o agente do sandbox e dar a ele o canal real: publicar o app no Railway com um `git push` (igual ao Lead-se) pra ganhar a URL pública que o webhook do WhatsApp exige, e conectar pela API oficial da Meta no número atual da clínica. *(No exemplo: ⏳ a fazer ao vivo — push no Railway, conectar o número e ver a primeira resposta chegar no WhatsApp.)*

**O que o aluno aprende (na ordem da aula):**
- **1º — O WhatsApp fala por webhook, e webhook exige porta na rua.** Lembra do M2: webhook é quando um serviço avisa o SEU app chamando uma URL dele. Cada mensagem de cliente vira uma batida do WhatsApp nessa URL. Só que ela precisa ser **pública** — `localhost` é um endereço que só existe dentro do seu computador; o WhatsApp não entrega mensagem lá.
- **2º — A solução você já sabe: `git push` no Railway.** Igualzinho ao Lead-se: um push e o app está no ar, com URL pública **fixa**, na hora. Dava pra usar um túnel (programa que empresta uma URL temporária pro seu PC, tipo ngrok) — mas é ferramenta nova e a URL muda toda hora. Complexidade à toa. Cada ajuste no agente é só outro push.
- **3º — Rota recomendada: API oficial da Meta (Cloud API) com coexistence no número ATUAL da clínica.** Coexistence = o mesmo número fica no aplicativo do celular E na API ao mesmo tempo: o dono continua atendendo pelo WhatsApp Business e as conversas espelham nos dois lados. Conecta em minutos — o "leva semanas" era boato. A regra que vem junto: dentro de **24h** da última mensagem do cliente, texto livre; passou disso, só reabre com **template** (mensagem-modelo que a Meta aprova em até 48h). Isso vai pesar no follow-up proativo. **[ATUALIZADO 21/07]** A janela continua valendo como PERMISSÃO, mas a partir de **01/10/2026 responder dentro dela passa a ter custo** (tarifa por mensagem de serviço; valor do Brasil sai até 01/09). Exceção que interessa: conversa que veio de **anúncio Click-to-WhatsApp tem 72h isentas de tarifa** — quem faz tráfego pago sai na frente. **[NOVO 21/07] E o que o app do celular PERDE ao ligar o coexistence (transparência com o dono ANTES de conectar):** chamadas de voz e vídeo pelo WhatsApp, listas de transmissão, mensagens temporárias, visualização única, localização ao vivo, catálogo/pedidos e as saudações/respostas rápidas do próprio app. Nada disso afeta o atendente — e o painel da 9.7 devolve a visão que o app perde — mas o dono decide SABENDO.
- **4º — [MOVIDO 21/07 → aula própria da rota não-oficial (penúltima do módulo)].** A rota rápida (Z-API) saiu DESTA aula — nem mencionar aqui.
- **5º — [MOVIDO 21/07 → aula própria da rota não-oficial].** "A escolha da rota mora no chat" foi junto — nesta aula só existe a rota oficial.
- **6º — [NOVO 21/07] Toda mensagem passa a custar — e isso muda o argumento de venda.** Desde 01/10 cada resposta paga tarifa. Longe de matar o projeto, isso o fortalece: um bot que só conversa vira DESPESA; um agente que FECHA venda vira investimento (uma limpeza de pele de R$ 99 agendada paga centenas de mensagens). *(Mencione em UMA frase que a Meta também lançou o agente de IA dela — o Meta Business Agent — e que você fala dele no fim do módulo. Não abra o assunto aqui: o aluno ainda está construindo.)*

**Prompt(s) pra enviar:**

Quando: Na parte prática, DEPOIS de explicar webhook/URL pública e a rota oficial -- é o prompt principal da aula.

```
Meu agente já funciona completo no sandbox. Agora eu quero conectar ele no WhatsApp de verdade, pela API oficial da Meta. Cria o webhook que vai receber as mensagens do WhatsApp, liga ele no agente que já existe e faz a resposta voltar pelo próprio WhatsApp. As chaves e tokens vão em variáveis de ambiente, sem mexer nas que já existem. Antes de fazer qualquer coisa, me explica pra leigo o caminho que a mensagem faz do celular do cliente até o meu app e de volta. No fim, me diz o que eu preciso pegar no painel da Meta e onde colar cada coisa.
```

Follow-up (mande logo depois, numa mensagem separada):

```
Dois detalhes: o que a própria clínica responder pelo celular também vai chegar no webhook -- o agente não pode responder essas mensagens como se fossem de cliente. E guarda a hora da última mensagem de cada cliente, porque a regra da janela de 24 horas vai importar mais pra frente.
```

**[MOVIDO 21/07 → aula própria da rota não-oficial (penúltima). O prompt abaixo fica aqui só como registro — NÃO aparece na 9.5.]** Quando: SÓ se a rota escolhida for a não-oficial -- ou mais tarde, pra trocar de rota em qualquer direção.

```
Quero trocar a integração do WhatsApp do meu agente: sai a API oficial da Meta, entra a [Z-API], usando um número comprado só pro atendente (não é o número principal da [clínica]). Me explica primeiro, pra leigo, o que muda na prática. Depois refaz SÓ a camada que conversa com o WhatsApp -- o cérebro do agente, a base de conhecimento e o banco ficam exatamente como estão. As credenciais novas vão em variáveis de ambiente, e no fim me diz o que eu preciso configurar na mão no painel da [Z-API].
```

**🔑 [NOVO 21/07] MAPA DE CREDENCIAIS + passo a passo no painel da Meta (deixe do lado na gravação — é isso que você configura tela a tela):**

> 📖 **Guia DETALHADO clique a clique** (etapas 0-6, checkpoints e tabela de erros comuns):
> `references/masterclass/guia-painel-meta-9.5.md` — também no Notion como página filha deste
> roteiro ("Guia clique a clique — Painel da Meta pra 9.5"). O mapa abaixo é o resumo; o guia é
> o que você segue na gravação.

São **6 peças** — nomes de variável CONFIRMADOS no `.env` real do projeto (gravação 21/07):

| # | Credencial | Onde pegar | Onde colar |
|---|---|---|---|
| 1 | **Phone Number ID** (ID do número — não é o telefone!) | Painel do app → caso de uso WhatsApp → **Configuração da API**, logo abaixo do número | Variável **`WHATSAPP_PHONE_NUMBER_ID`** no Railway (é ele que entra na URL de envio) |
| 2 | **WABA ID** (ID da conta WhatsApp Business) | Mesma tela da Configuração da API | **SÓ ANOTAR — não é variável** (o server não usa; serve pro painel, ex.: template da 9.6) |
| 3 | **Token PERMANENTE** | business.facebook.com → **Configurações do negócio → Usuários do sistema** (passo 5 abaixo) | Variável **`WHATSAPP_TOKEN`** no Railway (NUNCA o temporário do painel — expira em ~24h) |
| 4 | **Verify token do webhook** | **VOCÊ INVENTA** (qualquer string, ex.: `renov-webhook-2026`) | Em DOIS lugares — variável **`WHATSAPP_VERIFY_TOKEN`** no Railway **E** no campo do webhook na Meta. Idênticos |
| 5 | **URL do webhook** | O Railway te dá (URL pública + a rota que a IA criou, ex.: `/webhook`) | Painel do app → caso de uso WhatsApp → **Configuração → Webhook** |
| 6 | **App Secret** *(opcional, mas recomendado)* | Painel do app → **Configurações do app → Básico** | Variável **`META_APP_SECRET`** no Railway (valida que quem bate no webhook é a Meta) |

**A ordem no painel (grave nessa sequência):**

1. **Criar o app:** developers.facebook.com → Criar app → caso de uso **"Conectar com clientes pelo WhatsApp"** → vincular ao portfólio de negócios (o mesmo da verificação da A2).
2. **Configuração da API:** a Meta te dá um **número de TESTE** de graça — perfeito pra provar o caminho antes do número real. Anote já o **Phone Number ID** e o **WABA ID** (peças 1 e 2). *(Opcional na tela: mandar o template `hello_world` pro seu próprio celular — prova que a API responde antes de qualquer configuração.)*
3. **Adicionar o número REAL:** a bifurcação do passo 8(b) — coexistence se aparecer, chip dedicado se não. Se a Meta pedir **PIN de verificação em duas etapas** do número, é normal: define/digita na hora. ⚠️ Ao trocar do número de teste pro real, o **Phone Number ID muda** — atualize a variável.
4. **Webhook:** WhatsApp → Configuração → Editar: cole a **URL do Railway** (peça 5) + o **verify token que você inventou** (peça 4 — já colado ANTES no Railway, senão a verificação da Meta falha). Clique em verificar; a Meta bate na sua URL e o app responde. Depois **assine o campo `messages`** — sem isso, nada chega.
5. **Token permanente (peça 3):** business.facebook.com → Configurações do negócio → **Usuários do sistema** → criar usuário (papel Admin) → **Adicionar ativos** (atribua o SEU APP, com controle total) → **Gerar token** → selecione o app → marque `whatsapp_business_messaging` + `whatsapp_business_management` → copie NA HORA (só aparece uma vez). *(Nota de gravação: borre o token na edição e revogue depois.)*
6. **Colar tudo no Railway** (as 5-6 variáveis) → redeploy automático → teste real do passo 9.

**Passos no vídeo (na ordem da gravação -- o prompt entra no passo 7):**

1. Recap com gancho: mostre o agente da 9.4 respondendo no sandbox — ele pensa, sabe, ouve, vê, **já marca na agenda real e salva o cliente** (A4). Frase: *"só que ele mora na sua máquina. E o cliente da clínica está no WhatsApp."* *(Nota: a trava contra inventar — a regra de ouro — entra logo na 9.6, antes de ele começar a vender de verdade.)*
2. Explique o **conceito**: o WhatsApp entrega mensagem por **webhook** (relembre o M2 em uma linha: um serviço avisando o seu app numa URL). Desenhe o caminho: cliente manda mensagem → WhatsApp bate na sua URL → agente pensa → resposta volta pela API. E crave o problema: essa URL precisa ser **pública** — `localhost` não tem endereço na rua.
3. Dê o alívio: a solução é o que você já faz desde o Lead-se — **`git push` no Railway** = app no ar com URL pública fixa. Explique por que NÃO túnel/ngrok: ferramenta nova + URL que muda a cada reinício = complexidade à toa. *"Cada ajuste no agente daqui pra frente é só outro push."*
4. Apresente a **rota oficial** (o foco): Cloud API + **coexistence** no número atual da clínica. Desminta o boato ("leva semanas" — não leva; conecta em minutos) e mostre o trunfo: o dono CONTINUA no app WhatsApp Business do celular, as conversas espelham nos dois lados. Explique a **janela de 24h**: dentro dela, texto livre; fora, só template aprovado (até 48h de análise) — anote que isso volta quando o agente for fazer follow-up. **[ATUALIZADO 21/07] Abra a tabela de preços da Meta NA TELA** e explique o que muda em 01/10: responder dentro da janela deixa de ser grátis e passa a pagar tarifa por mensagem. Diga a frase que salva o vídeo do envelhecimento: *"não decore o preço — aprenda ONDE olhar; a Meta muda isso de tempos em tempos."* E some a exceção: conversa vinda de anúncio (Click-to-WhatsApp) tem **72h sem tarifa** — casa com tráfego pago. E responda a dúvida de quem acompanha sem cliente: pra praticar, um chip/eSIM barato de operadora real no WhatsApp Business faz o papel do "número da clínica" — o caminho é exatamente o mesmo. **[NOVO 21/07]** Diga também na tela o que o app do celular perde ao ligar o coexistence (sem chamadas de voz/vídeo, sem listas de transmissão, sem catálogo/pedidos, sem respostas rápidas do app) — o dono aceita sabendo, e o painel da 9.7 compensa.
5. **[MOVIDO 21/07]** *(A rota rápida/Z-API e a "escolha da rota" saíram desta aula → viraram a penúltima aula do módulo. Nem mencione a Z-API. Pule direto pro passo 7.)*
6. **[MOVIDO 21/07]** *(idem — vazio de propósito pra não renumerar os passos seguintes.)*
7. AGORA rode o prompt principal. Leia com o aluno a explicação que a IA deu ANTES de aprovar o plano — o caminho da mensagem tem que fazer sentido pra você primeiro.
8. `git push`, Railway sobe, copie a URL pública. Agora o painel da Meta, na mão, tela a tela, **seguindo o MAPA DE CREDENCIAIS acima** (e conferindo com a lista que a IA entregou): **(a)** crie a conta de desenvolvedor e o app em developers.facebook.com com o caso de uso WhatsApp (a verificação do negócio você disparou na ABERTURA da A2, em business.facebook.com -- já teve dias pra sair). **(b) [ATUALIZADO 21/07 — BIFURCAÇÃO ROTEIRIZADA: grave a porta que abrir, nenhuma é erro]** Na hora de adicionar o número, procure a opção de **conectar o número EXISTENTE do app WhatsApp Business** (coexistence — pareamento por QR code/código lido no celular). **Se a opção aparecer**, siga com ela. **Se NÃO aparecer**, diga com naturalidade na tela: *"esse fluxo de conectar o número que já existe, a Meta libera pelas plataformas parceiras — então aqui eu sigo com o chip dedicado, que é exatamente o caminho de quem está praticando sem cliente; pro número atual do SEU cliente, você usa uma plataforma parceira ou abre um chip novo pra ele"* — e registre o chip/eSIM na rota clássica (atenção: nesse caminho o número **não pode ter conta ativa de WhatsApp**; a verificação é por SMS). **(c)** Cole a URL do webhook + o token de verificação e assine o campo de mensagens. **(d) [NOVO 21/07] O token que o painel gera no início é TEMPORÁRIO — expira em ~24h** (o clássico "funcionou na aula, morreu no dia seguinte"). Crie o **token PERMANENTE de usuário do sistema** (Configurações do negócio → Usuários do sistema → gerar token com `whatsapp_business_messaging` e `whatsapp_business_management`) — é ESSE que vai nas variáveis do Railway.
9. O teste real: de outro celular, mande um "oi, quanto custa a limpeza de pele?" e um ÁUDIO pedindo horário. O agente responde no WhatsApp — R$ 180, direto da base da Renov (se ele citar a promoção de R$ 99 de cliente novo, melhor ainda: os dois valores vêm da base). **Se conectou via coexistence**, mostre o espelho: a conversa aparecendo no celular do dono. *(Se a demo foi no chip dedicado, esse espelho não existe — mostre a conversa caindo na memória do Supabase e diga que o espelho é o trunfo da rota coexistence.)* Feche: *"o atendente está na rua. Na próxima aula ele começa a VENDER: primeiro ganha a trava que o impede de inventar, depois aprende a qualificar, cobrar e fechar."*

**Pra qualquer projeto:** todo serviço que te avisa de algo em tempo real (mensagem, pagamento, agendamento) fala por webhook — e webhook exige URL pública, que o deploy que você já domina resolve com um push, sem ferramenta nova. E canal é camada, não alicerce: o cérebro do agente não muda quando o canal troca — trocar de integração é um pedido no chat.

## Parte 3 — Vender, operar e cobrar (9.6 · 9.7 · aula Z-API [penúltima] · 9.8)

### 9.6 - Blindar + vender: a regra de ouro, o funil, o lembrete e o handoff

> **⚠️ Ajustada em 20/07 pós-A4.** A agenda real JÁ foi conectada na A4 (conta de serviço +
> calendário dedicado) — então **esta aula NÃO constrói mais a agenda via OAuth**; ela só USA o
> "criar evento" que já existe. O peso técnico que era o OAuth foi embora; entra no lugar a **regra
> de ouro** (que a A4 não gravou), que abre a aula como a trava que blinda a venda.

> **⚠️ Ajustada em 29/07 — a cobrança NÃO é construída.** Decisão do Enzo: o atendente da Renov
> não precisa de link de pagamento; o agente **informa** as formas de pagamento e a política de
> sinal que já estão na base de conhecimento, e o cliente paga na clínica. Link automático de
> cobrança vira um **aparte de ~20 segundos** ("se o seu cliente quiser isso, é mais uma ferramenta,
> igual às da A4 — chama a API do sistema de cobrança que ele já usa"), sem demo. Efeito colateral
> bom: a aula era a mais densa do módulo e agora cabe num vídeo só.

**Tópico:** o agente já atende, ouve, vê, **marca na agenda real e salva cliente** (A4). Agora ele
ganha a **trava contra inventar** (a regra de ouro) e aprende a **fechar a venda**: qualificar →
recomendar → agendar (já funciona) → lembrar no dia anterior → passar
pro humano. *(No exemplo: ⏳ a fazer ao vivo — escrever a regra de ouro, as ferramentas do funil,
o lembrete e o teste de ponta a ponta.)*

**O que o aluno aprende (na ordem da aula):**
- **1º — A regra de ouro, antes de deixar ele vender.** Um agente que vende faz promessas: recomenda serviço, fala preço, oferece condição. Se ele inventa, a promessa errada vai pro WhatsApp do cliente e custa o contrato. Então, ANTES do funil, a trava: responde SÓ com o que está na base; não sabe → *"vou confirmar com a equipe"* e sinaliza pra um humano; **NUNCA** inventa preço, desconto ou promessa. Escreve-se de forma **reativa** (9.3): aparece o erro (perguntam de um serviço que não existe, ele enrola/inventa) → agora escreve a regra na seção "Nunca faça isso" do prompt. *"É essa regra que protege a clínica — e o seu contrato de R$ 8 mil."* (É ela que o cliente chato ataca na 9.8.)
- **2º — O funil dentro da conversa.** Até aqui o agente atende; a clínica paga R$ 8 mil pelo que ele FECHA. Vender numa conversa é saber em que etapa ela está e executar a ação que fecha aquela etapa: **qualificar** (entender o que a pessoa procura) → **recomendar** (só serviço que existe na base) → **agendar** (na agenda de verdade — já conectada na A4) → **passar pro humano** na hora certa. O chatbot genérico responde o preço e a conversa morre; o agente conduz até o fim.
- **3º — [AJUSTADO 29/07] Dinheiro é INFORMAÇÃO da base, não ferramenta nova:** o agente não cobra nem processa pagamento — ele **informa** o que já está na base (formas de pagamento: Pix, dinheiro, débito, crédito em 6x; e a política de sinal de 30% acima de R$ 800) e o cliente paga na clínica. **Aparte de ~20s, sem demo:** *"se o seu cliente quiser link de cobrança automático, é só mais uma ferramenta — do mesmo jeito que a gente fez a da agenda na aula 4, chamando a API do sistema de cobrança que ele já usa (InfinitePay, PagSeguro, o link do banco). Não é o caso da clínica, então eu não vou construir aqui."* Reforça a tese do módulo: o que muda de cliente pra cliente é **dado e ferramenta**, não arquitetura.
- **4º — O lembrete que segura o horário:** agendar não fecha o ciclo — cliente que falta esvazia a agenda que o robô encheu. No dia anterior, o agente manda o **lembrete no WhatsApp** (serviço, dia, hora e endereço — tudo da base e do evento da agenda que ele criou na A4). Detalhe da API oficial: passadas 24h sem mensagem do cliente, a conversa só reabre com **template aprovado** — a regra da 9.5 aparecendo na prática; aprova o template do lembrete uma vez e o agente usa sempre.
- **5º — O sinal do handoff** (a passagem de bastão pro humano): lead pedindo pra fechar, negociando desconto ou fazendo pergunta que a base proíbe → o agente marca o lead como **quente** no Supabase (junto da memória) e avisa o dono. ⚠️ Lembre o split da A4: **cadastro de cliente vive no Google Sheets; o "lead quente"/handoff vive no Supabase.** Aqui nasce o sinal; a "casa" dele — onde o dono vê tudo e assume — é a próxima aula (9.7).
- **6º — [NOVO 21/07] Cada mensagem custa: responda CONSOLIDADO, não picotado.** Desde 01/10 toda resposta paga tarifa — então um agente que quebra a resposta em 5 mensagenzinhas custa 5x mais que um que responde de uma vez. Regra prática pro prompt: uma resposta completa por vez, uma pergunta por vez. Bom pro bolso do cliente e melhor de ler no WhatsApp.

**Prompt(s) pra enviar:**

Quando: ABRE a aula, do jeito reativo — depois de mostrar o agente inventando/enrolando num serviço que não está na base (o vilão). É a trava que blinda tudo que vem depois.

```
Quando perguntam algo que não está na base de conhecimento, o meu agente enrola ou inventa. Adiciona na seção "Nunca faça isso" do prompt-agente.md: ele só responde com o que está na base; se a informação não estiver lá, ele diz que vai confirmar com a equipe e sinaliza pra um humano assumir; e ele nunca inventa preço, desconto ou promessa. Altera só o prompt de sistema, mais nada.
```

Quando: com a regra de ouro escrita e testada — ensina o agente a CONDUZIR a venda e cria a marcação de lead quente. A agenda real já existe (A4); aqui é só o funil que a usa.

```
Agora eu quero que o meu atendente conduza a venda. Quando a pessoa demonstrar interesse, ele qualifica: pergunta o que ela procura e pra quando, uma pergunta por vez. Depois recomenda só serviços que existem na base, com o preço de lá. Quando a pessoa perguntar de pagamento, ele responde com as formas de pagamento e a política de sinal que estão na base, e avisa que o pagamento é feito na clínica -- ele não cobra nem manda link. E quando o cliente pedir pra fechar, negociar desconto ou fizer uma pergunta que deve ir pro humano, ele marca o lead como quente no Supabase e avisa o dono. Antes de codar, me explica em uma frase por etapa como ele vai saber em que etapa a conversa está.
```

Quando: SÓ DEPOIS que o funil estiver rodando no WhatsApp. O lembrete nasce do evento que a agenda (A4) já cria. Pule se o seu cliente não trabalha com horário marcado.

```
Agora quero o lembrete automático: no dia anterior a cada horário marcado, o atendente manda uma mensagem no WhatsApp do cliente confirmando o serviço, o dia, a hora e o endereço, puxando tudo da agenda e da base. Como pode ter passado mais de 24 horas, essa mensagem precisa sair como template aprovado da API oficial -- deixa o texto pronto pra eu colar e me diz o passo a passo pra aprovar no painel da Meta. Se o cliente responder ao lembrete, o agente assume a conversa e atualiza a agenda. Não mexe no que já funciona.
```

**Passos no vídeo (na ordem da gravação -- os prompts entram nos passos 2, 5 e 8):**

1. Abra com o vilão, ao vivo no WhatsApp: pergunte algo que NÃO está na base — *"vocês fazem criolipólise? quanto custa?"* — e deixe o agente inventar um preço/enrolar com toda a segurança. Frase: *"ele conversa, agenda, salva cliente... e mente na cara dura. E mentira com preço custa o contrato."*
2. Rode o **prompt 1 (a regra de ouro)**, do jeito reativo: apareceu o erro, agora escreve a trava. Mostre a seção "Nunca faça isso" do prompt ganhando a regra. Teste de novo a criolipólise — mesmo cérebro, resposta oposta: *"vou confirmar com a equipe"*. Crave: *"é essa regra que protege a clínica — e o seu R$ 8 mil. Guarde: é ela que a gente vai tentar quebrar na última aula."*
3. Explique **o funil dentro da conversa**, na tela: qualificar → recomendar → agendar → chamar humano. Concretize com a Renov: chega "quanto custa botox?" — o chatbot genérico responde "R$ 900" e a conversa morre; o nosso pergunta o objetivo, sugere a avaliação gratuita e conduz pro horário.
4. Relembre que **a agenda real já está de pé** (A4 — conta de serviço + calendário dedicado): aqui o agente só USA o "criar evento" que já existe, agora dentro do funil. Nada de OAuth novo.
5. Rode o **prompt 2 (o funil)** e leia com o aluno a explicação da IA sobre as etapas antes de deixar codar. Mostre que as regras (preço, formas de pagamento, sinal, quando chamar humano) vêm da BASE — nada chumbado no código, como na 9.3.
6. Teste o funil no WhatsApp real: *"quanto é o preenchimento labial?"* — o agente qualifica, recomenda e, como R$ 1.200 pede sinal de 30% pela política da Renov, ele **avisa** o valor do sinal e as formas de pagamento (tudo da base) e conduz pro horário. **Aqui entra o aparte de ~20s** (item 3 acima): *"repare que ele só INFORMA. Se o seu cliente quiser link de cobrança automático, é mais uma ferramenta — mesma receita da agenda na aula 4. Não é o caso da clínica, então não vou construir."* Sem demo, sem link de teste — segue o vídeo.
7. O momento-vitrine (usando a agenda da A4): mande um ÁUDIO de cliente *"queria marcar uma limpeza de pele quinta à tarde"* — o agente entende (9.4/A5), oferece só horários realmente livres e o evento APARECE no Google Calendar aberto do lado. É o plano que vende o serviço de R$ 8 mil.
8. Rode o **prompt 3** e feche o ciclo com o lembrete: crie o template no painel da Meta na tela e envie pra aprovação (pode levar horas -- deixe um já aprovado de reserva pra gravação não travar). Simule o dia anterior e mostre o lembrete chegando no celular-cliente com o horário puxado da agenda. Frase: *"agenda cheia não é agenda confirmada -- o lembrete é o que segura o cliente."*
9. Por fim, o sinal do handoff: pergunte algo que a base proíbe (*"qual o melhor procedimento pro meu caso?"*). O agente responde que vai passar pra equipe, marca o lead como quente no **Supabase** (mostre a linha no banco) e o dono recebe o aviso. Feche: *"o sinal nasceu. Na próxima aula ele ganha casa: o painel onde o dono vê tudo isso e assume a conversa."*

**Pra qualquer projeto:** antes de deixar um agente vender, escreva a **regra de ouro** — vender é fazer promessa, e promessa inventada custa o contrato. E agente que vende não é o que fala bonito: é o que sabe em que etapa a conversa está e executa a ação que fecha aquela etapa, sempre nas ferramentas que o dono JÁ usa (a agenda real), com a regra vinda da base, nunca chumbada no código. E cuidado com o escopo: **nem toda etapa do funil vira ferramenta** — no negócio de serviço local, pagamento é INFORMAÇÃO da base (o cliente paga no balcão), não integração. Construa ferramenta só onde o agente precisa AGIR.

---

### 9.7 - O painel do dono: ver tudo e ASSUMIR o atendimento

**Tópico:** o cockpit do atendente — uma tela (front + Supabase + login, tudo que você já fez no M5/M7) onde o dono da clínica vê em tempo real o que o agente está fazendo e **assume** a conversa quando o lead esquenta. *(No exemplo: ⏳ a fazer ao vivo — gerar o painel e demonstrar o Assumir com o celular na mão.)*

**O que o aluno aprende (na ordem da aula):**
- **1º — Human-in-the-loop** (o humano no circuito): um agente autônomo de verdade tem um posto de comando — um lugar onde uma pessoa vê tudo o que ele faz e pode intervir a qualquer momento. Não é "mais um CRM" pra digitar dado na mão: é o cockpit de um robô que trabalha sozinho.
- **2º — O painel é uma visão por cima do que JÁ existe. [AJUSTADO 21/07 ao que foi gravado]** Desde a 9.2 o agente grava as conversas no Supabase; desde a A4, os agendamentos vivem no Google Calendar e o cadastro de clientes no Google Sheets. O painel só LÊ essas três fontes — pouco esforço novo: o front e o login você já fez no M5 e no Lead-se (M7).
- **3º — É o painel que o cliente VÊ.** O dono da clínica nunca vai ver webhook nem prompt; pra ele, o atendente É essa tela. É ela que justifica os R$ 8 mil.
- **4º — Assumir tem regra de comando:** lead quente (9.6) → o dono responde do painel (que envia pela API) ou do celular (WhatsApp Business — a coexistence da 9.5); os dois lados espelham. E quando o humano assume, o agente cala naquela conversa — nunca os dois respondendo juntos.

**Prompt(s) pra enviar:**

Quando: Na parte prática, depois de explicar o human-in-the-loop e de mostrar no Supabase que os dados já estão todos lá -- o painel nasce como LEITURA do que existe. Pule se o seu projeto ainda não grava as conversas no banco -- volte na 9.2 antes, senão o painel nasce vazio.

```
Quero criar o painel do dono: a tela onde o dono da clínica acompanha o atendente trabalhando. Os dados já existem -- as conversas e os leads quentes no Supabase, os agendamentos no Google Calendar e os clientes no Google Sheets -- então o painel só lê, não cria tabela nova e não muda nada no cérebro do agente. Quero login com Google, as conversas chegando em tempo real, os leads e os agendamentos, com lead quente destacado no topo. Antes de mexer em qualquer arquivo, me explica quais telas você vai criar e de onde vem cada informação.
```

Quando: Só com o painel no ar e mostrando as conversas em tempo real -- o Assumir é uma camada em cima da leitura, e construir as duas coisas juntas confunde o teste. Pule por enquanto se você for entregar uma primeira versão só de leitura pro cliente ver -- dá pra adicionar o Assumir depois, sem retrabalho.

```
Agora o assumir: quando o dono abrir uma conversa no painel, quero um botão de assumir o atendimento. Ao clicar, o agente para de responder só naquela conversa e o dono digita a resposta ali mesmo, saindo pelo mesmo WhatsApp. Quero também o botão de devolver pro agente. E o que o dono responder pelo celular tem que aparecer no painel como resposta humana. Antes de implementar, me explica como você vai marcar quem está no comando de cada conversa -- nunca pode o robô e o dono responderem juntos.
```

**Passos no vídeo (na ordem da gravação -- os prompts entram nos passos 4 e 7):**

1. Abra com o buraco: pegue o celular e converse com o atendente como cliente — ele responde, qualifica, agenda (9.6)... e corte pra pergunta: *"e o dono da clínica? Ele viu o quê? Nada."* Um robô que vende sozinho e que ninguém enxerga não passa confiança — nem pro dono, nem pra você que vai cobrar por ele.
2. Dê nome ao conceito: **human-in-the-loop** — o humano no circuito: o robô trabalha sozinho, mas existe um posto de comando onde uma pessoa vê tudo e pode intervir a qualquer momento. Deixe claro o que o painel NÃO é: não é "mais um CRM" pra digitar dado na mão — é o cockpit de um agente autônomo.
3. Mostre por que essa aula é barata: abra o Supabase (mensagens e leads), o Google Calendar (agendamentos) e o Sheets (clientes) e mostre que está tudo cheio — o agente grava desde a 9.2. *"O painel não cria nada. Ele mostra."* Front, login com Google e tela: tudo coisa que você já fez no M5 e no Lead-se (M7). E é ESSA tela que o cliente compra — ele não vê webhook, vê o painel.
4. Rode o **prompt 1**. A IA explica o plano de telas primeiro; aprove e deixe construir. Publique com o mesmo `git push` de sempre (Railway, igual ao Lead-se).
5. Demonstre ao vivo: faça login no painel, pegue o celular e mande mensagem como cliente. A conversa aparece na tela em tempo real; mostre o lead entrando, o estágio mudando pra "qualificado", o agendamento aparecendo. É o "uau" da aula.
6. Explique o **Assumir** antes de construir: quando o agente marca lead quente (9.6), o dono precisa de um lugar pra entrar na conversa. São dois caminhos que se espelham: pelo painel (que envia pela API) e pelo celular (WhatsApp Business — a coexistence da 9.5 já manda essas mensagens pro seu app pelo webhook). E a pegadinha: dois cérebros não podem responder juntos — o banco precisa marcar quem está no comando de cada conversa.
7. Rode o **prompt 2**. Leia com o aluno a explicação da IA sobre a marcação de comando no banco antes de deixar implementar.
8. Feche com a demo completa: como cliente, pergunte de [preenchimento labial — R$ 1.200] e deixe o agente qualificar e marcar quente; a conversa sobe destacada no painel; clique em **Assumir** e responda dali — chega no celular do cliente (e como ele acabou de mandar mensagem, você está dentro da janela de 24h da 9.5: texto livre). Responda também pelo app do WhatsApp Business e mostre a mensagem aparecendo no painel como resposta humana. Clique em **Devolver pro agente** e mostre o robô voltando. Ponte: *"o sistema está completo. Na próxima aula a gente tenta QUEBRAR ele — e transforma isso num produto que você revende."*

**Pra qualquer projeto:** agente autônomo entregue a cliente precisa de um posto de comando (human-in-the-loop): uma tela que só LÊ o que o agente já grava no banco + um jeito de o humano assumir, com regra clara de quem está no comando de cada conversa. O motor você constrói uma vez; **é o painel que o cliente vê — e é por ele que ele paga.**

---

### A rota não-oficial — ~~AULA Z-API (PENÚLTIMA)~~ → **[24/07] VIROU DUAS AULAS (A7 + A8), LOGO APÓS A 9.5, com WAHA**

> **Nova em 21/07 (decisão do Enzo):** a rota não-oficial SAIU da 9.5 (que ficou 100% API oficial)
> e virou aula própria, gravada com o sistema completo (pós-painel). Motivos: (1) com a cobrança
> por mensagem da rota oficial a partir de 01/10, a não-oficial virou uma decisão de CUSTO que
> merece a conta na tela; (2) trocar de rota com o sistema inteiro de pé é a prova final de que
> canal é camada. Numeração final na Kiwify o Enzo acerta (é a penúltima; a 9.8 fecha o módulo).

> **🔀 [24/07] REFORMULADA (decisão do Enzo) — a posição penúltima morreu.** A rota não-oficial
> vem AGORA, logo após a 9.5/A6 (cumprindo a promessa do fecho da A6), dividida em DUAS gravações:
> - **A7 — "API oficial vs API não-oficial":** só conceito e decisão — os preços da rota oficial
>   (e as mudanças de ago-out/2026), o que é a rota não-oficial, a conta comparativa na tela e o
>   risco sem dourar. Não constrói nada.
> - **A8 — Conectar o agente na não-oficial com WAHA:** a troca da camada de canal na prática +
>   teste ponta a ponta. **A ferramenta agora é WAHA** (WhatsApp HTTP API, self-hosted/open-source
>   — roda em container no próprio Railway, SEM mensalidade de terceiro), não mais Z-API. A conta
>   comparativa muda junto: flat de SaaS (~R$ 100-200) → custo de hospedagem do próprio container.
> - O texto abaixo segue valendo como base de conteúdo, com dois ajustes: trocar Z-API por WAHA em
>   tudo, e **tirar as referências ao painel da 9.7** (passos 6 e o "mostre o painel recebendo") —
>   o painel ainda não vai existir quando a A8 for gravada. A regra do número dedicado comprado
>   permanece inteira (o chip da Salve da A6 já cumpre isso).

**Tópico:** a segunda porta do WhatsApp: a rota **não-oficial (Z-API)** num número comprado só pro atendente — mensalidade flat, sem tarifa por mensagem e sem janela de 24h, em troca da zona cinzenta dos termos. E a demonstração-prova do módulo: **trocar de rota é um pedido no chat** — o cérebro não muda. *(No exemplo: ⏳ a fazer ao vivo — a conta comparativa, a troca da camada e o teste no número novo.)*

**O que o aluno aprende (na ordem da aula):**
- **1º — O que é a rota não-oficial:** serviços como a **Z-API** conectam um número de WhatsApp ao seu app SEM a API da Meta (na prática, um "WhatsApp Web programável"). Preço: **mensalidade flat** (~R$ 100-200), sem tarifa por mensagem, sem janela de 24h, sem template — conversa livre.
- **2º — Quando ela ganha da oficial (a conta na tela):** desde 01/10 a oficial cobra por mensagem. Negócio com MUITO volume de conversa → o flat vence. Faça a conta com o aluno: [conversas/mês × respostas × tarifa] vs. a mensalidade da Z-API. É decisão de CUSTO, não de tecnologia.
- **3º — O risco, sem dourar:** zona cinzenta dos termos do WhatsApp → risco de bloqueio do número. Por isso a regra inegociável: **número COMPRADO só pro atendente** (chip pré-pago ou eSIM de operadora real, NUNCA número virtual/VoIP) — se algo der errado, o número da empresa fica intacto. O dono decide SABENDO do risco.
- **4º — Canal é camada (a prova final):** a troca refaz SÓ a integração do WhatsApp. Cérebro, base, ferramentas, memória, sentidos e painel ficam EXATAMENTE como estão. É a tese do módulo demonstrada de ponta a ponta.
- **5º — Como decidir com o cliente:** oficial = número atual da empresa, selo/compliance, custo por mensagem (com 72h grátis vindo de anúncio); não-oficial = flat, sem janela, risco assumido em número dedicado. Você apresenta as duas contas; quem escolhe é o dono.

**Prompt(s) pra enviar:**

Quando: Depois da conta na tela e do aviso de risco — com o sistema completo rodando na rota oficial. A troca É a demonstração da aula.

```
Quero trocar a integração do WhatsApp do meu agente: sai a API oficial da Meta, entra a Z-API, com um número comprado só pro atendente. Refaz só a camada que conversa com o WhatsApp -- o cérebro, a base e o banco ficam exatamente como estão. As credenciais novas vão em variáveis de ambiente. Antes de trocar, me explica pra leigo o que muda na prática, e no fim me diz o que eu configuro na mão no painel da Z-API.
```

**Passos no vídeo (na ordem da gravação -- o prompt entra no passo 4):**

1. Abra com a fatura: monte na tela a conta da rota oficial pra um negócio movimentado ([2.000 conversas/mês × 8 respostas × tarifa]) e, do lado, a mensalidade flat da Z-API. *"Existe uma segunda porta pro WhatsApp — e agora que o sistema está inteiro, eu te mostro em minutos como é atravessar ela."*
2. Explique o que é a rota não-oficial (o "WhatsApp Web programável") e crave o risco sem dourar: zona cinzenta dos termos, risco de bloqueio → **regra do número comprado** (chip/eSIM de operadora real, nunca virtual/VoIP). O dono escolhe sabendo.
3. Mostre o painel da Z-API: criar a instância, o QR code lido pelo WhatsApp do número dedicado, onde ficam as credenciais.
4. Rode o **prompt** e deixe a IA explicar o que muda ANTES de refazer. Mostre no projeto: só a camada do canal foi tocada — abra o `prompt-agente.md` e a `constituicao.md` intactos na tela.
5. Credenciais da Z-API nas variáveis do Railway, push, e o webhook da Z-API apontando pro app (mesma lógica da 9.5: URL pública + rota).
6. O teste-prova: a MESMA conversa do teste da 9.5, agora no número novo — texto + áudio → mesmo agente, mesmas respostas, canal diferente. Mostre o painel da 9.7 recebendo a conversa igual.
7. Feche com a decisão: *"mesmo cérebro, duas portas. Uma tem selo e cobra por mensagem; a outra é flat e corre o risco num número separado. Você apresenta as duas contas — quem escolhe é o dono."* Teaser pra última aula: *"agora a gente vai tentar QUEBRAR esse sistema — e transformar ele num produto."*

**Pra qualquer projeto:** rota não-oficial é decisão de CUSTO com risco assumido: flat e sem janela, mas zona cinzenta — só em número dedicado comprado, nunca no número principal da empresa. E qualquer troca de canal, em qualquer direção, refaz UMA camada — se trocar o canal obrigar a mexer no cérebro, a arquitetura estava errada.

---

### 9.8 - Testar quebrando + reaproveitar pra outros clientes + produção e cobrar (~R$ 8 mil)

**Tópico:** provar que o atendente aguenta o mundo real (um "cliente chato" simulado tenta quebrar ele), transformar o projeto num serviço que se revende em minutos, deixar rodando 24/7 com custo travado — e cobrar. *(No exemplo: ⏳ a fazer ao vivo — rodar o cliente chato na Renov, consertar as falhas, simular o cliente nº 2 e ativar as travas de custo.)*

**O que o aluno aprende (na ordem da aula):**
- **1º — O teste que vale é o do estranho, em formato de conversa.** No M8 você aprendeu: protótipo funciona pra você; produto funciona pra um estranho. No agente, o estranho é o cliente chato: escreve torto, manda áudio confuso, pede desconto que não existe, tenta enganar, foge do assunto. Testar isso na mão levaria dias — então é **IA testando IA**: o Claude Code cria o cliente chato e roda dezenas de conversas sozinho.
- **2º — A pior falha não é travar, é INVENTAR.** O relatório do teste compara cada resposta com a base de conhecimento — a regra de ouro da 9.3 posta à prova. Preço, promoção ou promessa que não está no documento é falha grave.
- **3º — Cliente nº 2 é reconfigurar, não reconstruir.** Persona, base de conhecimento, catálogo e número são DADOS (9.3) — subir outro cliente é trocar dados e dar um push: minutos, não dias. É o que transforma "fiz um bot" em "tenho um serviço que eu revendo". **E aqui se entrega a SKILL prometida na A2** (*"no final desse módulo eu vou disponibilizar uma skill que vai te guiar a criar um agente de IA"*): a skill `criar-agente`, que o aluno manda pro Antigravity e ela guia os pedidos — planejar → sandbox → conhecimento/ferramentas → testar → canal → produção.
- **4º — Produção com custo travado.** O bot do cliente FICA no Railway (o mesmo push do Lead-se; 24/7, custo baixo). Cada mensagem custa dinheiro (a chamada do modelo + a cobrança da Meta, que mudou a precificação em 2026) — então teto de custo por conversa e trava anti-abuso, no servidor. E o preço do pacote: ~R$ 8 mil de implantação + mensalidade (precificar e empacotar é o Módulo 10).
- **5º — [NOVO 21/07] O elefante na sala: o agente de IA da própria Meta (Meta Business Agent).** O aluno VAI ouvir falar dele — melhor ouvir de você, com a conta na mão. É a IA da Meta respondendo dentro do WhatsApp, cobrada **por token** (~R$ 0,22-0,28/resposta) contra ~R$ 0,05-0,10 do agente que ele acabou de construir. E o que o aluno construiu **continua valendo** por cinco motivos: (1) o MBA só atende **5 verticais** e exige aprovação da Meta — muito cliente fica de fora; (2) os **Connectors** do MBA chamam "uma API do negócio" — e a clínica NÃO tem API: alguém precisa construir, e esse alguém é quem fez este módulo; (3) os dados ficam com a Meta, sem painel próprio; (4) sem escolha de modelo e preso a um canal só — o cérebro dele já vai pra Instagram, site, o que vier; (5) **a arquitetura é a MESMA** (prompt de sistema, base como ferramenta, ações, handoff) — quem entendeu aqui sabe operar o da Meta em uma tarde. Fecho honesto: *"a Meta entrar nesse jogo prova que a tese está certa — e vai educar o mercado inteiro a querer o que você sabe fazer."*

**Prompt(s) pra enviar:**

Quando: Depois de explicar o cliente chato e a regra "inventar é a falha grave" -- com o sistema completo da 9.7 rodando. Pule se ainda falta fechar a 9.6/9.7: testar metade do sistema dá um relatório pela metade.

```
Cria um testador automático pro meu atendente: um cliente chato simulado, que conversa com ele igual gente de verdade. Gera umas 30 conversas difíceis: gente que escreve tudo errado, pede desconto que não existe, tenta enganar o atendente e muda de assunto o tempo todo. Compara cada resposta com a base de conhecimento -- se ele falou preço, serviço ou promessa que não está lá, marca como falha grave. No fim me entrega um relatório simples de onde ele falhou. Roda tudo no ambiente de teste e não conserta nada ainda.
```

Quando: Depois que o cliente chato passou limpo e antes de entregar pro cliente -- toda conversa em produção sai do seu bolso ou do dele. Pule se o seu projeto já tem teto de custo por conversa travado no servidor.

```
Cada mensagem que o meu atendente responde custa dinheiro. Primeiro me explica, como se eu fosse leigo, por onde o dinheiro sai neste projeto e quanto custa mais ou menos uma conversa típica. Depois cria duas travas no servidor: um teto por conversa -- passou do limite, ele encerra com educação e chama um humano -- e uma trava anti-abuso pra quem fica mandando mensagem sem parar. Não mexe em mais nada.
```

**Passos no vídeo (na ordem da gravação -- os prompts entram nos passos 4 e 8):**

1. Abra com o recap: o atendente pensa, sabe, ouve, vende, agenda e tem painel (9.1 a 9.7). A pergunta da aula: *"isso já é um NEGÓCIO?"* Só se passar em três provas: aguenta um estranho, se replica pra outro cliente e roda sozinho dando lucro.
2. Explique o conceito: é o **Teste do Estranho do M8, agora em formato de conversa**. Liste o que o cliente chato faz (escreve torto, áudio confuso, desconto que não existe, tenta enganar, foge do assunto). Na mão seriam dias de teste — por isso **IA testando IA**.
3. Explique o porquê da régua: a pior falha não é travar, é **inventar** — um preço errado no WhatsApp do cliente custa a confiança (e o contrato). É a regra de ouro da 9.3 posta à prova; o relatório tem que acusar invenção.
4. Rode o **1º prompt** e deixe o simulador trabalhar. Mostre 2-3 conversas na tela: a torta, a do desconto, a que tenta enganar.
5. Leia o relatório ao vivo. Conserte 1 ou 2 falhas reais — quase sempre o buraco é na base de conhecimento ou na constituição, não no código. Rode o teste de novo até passar limpo.
6. Reaproveite: relembre a decisão da 9.3 (persona, base, catálogo e número são dados, não código). Simule o cliente nº 2 ao vivo: base de conhecimento nova preenchida, variáveis novas (número, chaves do cliente), serviço novo no Railway, push. Cronometre. Frase: *"'fiz um bot' virou 'tenho um serviço que eu revendo'."* **E cumpra a promessa da A2:** apresente a skill `criar-agente` (material da aula), mostre ela guiando a criação do cliente nº 2 no Antigravity — é a prova de que o processo virou produto.
7. Produção: o bot do cliente **fica no Railway** — o mesmo push do módulo inteiro, 24/7, custo baixo; pro 1º cliente a margem já sobra. Cite a **VPS da Hostinger** (um computador alugado, sempre ligado) só como passo de ESCALA: com vários clientes, roda todos numa VPS só e barateia — é a mesma do bônus de n8n, cupom SPARO10. Não faça agora.
8. Blinde: rode o **2º prompt**. Deixe a IA explicar primeiro por onde o dinheiro sai; depois mostre o teto por conversa e a trava anti-abuso entrando — no servidor, lembrando o M8: a tela é sugestão, o servidor é lei.
9. Teste quebrando de novo: solte o cliente chato numa conversa sem fim e mostre a trava cortando com educação e chamando o humano.
10. Feche o módulo com energia: o preço — **~R$ 8 mil de implantação + mensalidade** (como precificar e empacotar direito é o Módulo 10). Variação em 1 frase: trocando "vendas" por "suporte", o mesmo sistema vira atendimento inteligente pra qualquer negócio. Fecho opcional em 1 frase: *"essa automação é a primeira peça de um sistema maior — e esse sistema é outro produto."*
11. **[NOVO 21/07] Segmento final (~5 min, SEM demo): "o elefante na sala — o Meta Business Agent".** Não é aula de construir; é aula de CRITÉRIO, e o aluno já tem o sistema pronto pra comparar. (a) Abra a **documentação oficial na tela** (`developers.facebook.com/documentation/meta-business-agent/overview`) e diga o que ele é, sem diminuir: a Meta lançou o agente de IA dela dentro do WhatsApp, com base de conhecimento, skills, conectores de API e handoff — *"repare: é a MESMA arquitetura que a gente construiu nas últimas aulas"*. (b) **A conta, lado a lado na tela**: MBA cobra **por token** (US$ 2/1M ≈ R$ 0,22-0,28 por resposta); o nosso cobra **tarifa por mensagem + o modelo** (≈ R$ 0,05-0,10) — e dentro das 72h de anúncio o nosso responde sem tarifa. Um taxímetro de cada lado; sem cobrança dupla, quem responde define a conta. (c) **Por que o que ele construiu continua valendo**: os 5 motivos do bloco acima — com ênfase em que **o Connector do MBA precisa de uma API que a clínica não tem**, e construir essa API é o mesmo serviço que ele acabou de aprender a cobrar. (d) **A PROMESSA** (grave com naturalidade): *"o Meta Business Agent ainda não foi liberado pra minha conta — quando liberar, eu gravo um vídeo aqui dentro do módulo mostrando como usar na prática. Este curso é vivo."* → vira a futura **aula bônus 9.9**. (e) Fecho do módulo: *"você não aprendeu a mexer numa ferramenta — aprendeu a ARQUITETURA de um agente. Ferramenta muda, preço muda; isso aqui não."*

**Pra qualquer projeto:** o sistema vira serviço quando passa em três provas — um estranho simulado tenta quebrar (IA testando IA, comparando cada resposta com a fonte da verdade), o cliente nº 2 sobe só trocando dados (nunca código) e o custo roda travado no servidor. Aí você não entrega um projeto: **revende um serviço**.

## Checklist final (o que o aluno leva pra qualquer projeto)

- [ ] A base de conhecimento é a fonte da verdade que o agente consulta como FERRAMENTA (function calling) — ela NÃO fica no prompt de sistema, que é enxuto (quem ele é + quando usar cada ferramenta) e lido a cada mensagem. A IA monta o esqueleto (o modelo com [colchetes]) e o CLIENTE preenche a verdade — nunca peça pra IA inventar os dados do negócio.
- [ ] Cérebro e canal são peças separadas — e o cérebro (modelo + prompt de sistema + memória no banco) se prova num sandbox, onde errar custa um prompt; o canal só entra quando a conversa já convence.
- [ ] "Como agir" e "Nunca faça isso" do prompt se preenchem de forma REATIVA: apareceu o problema, escreve a regra — prompt inchado aumenta alucinação.
- [ ] O que separa chatbot de atendente é SABER e FAZER: conhecimento do negócio plugado + ferramentas que o PRÓPRIO agente decide quando usar no meio da conversa.
- [ ] Regra de ouro gravada nas regras do agente: responde SÓ com o que está na base; não sabe → "vou confirmar com a equipe" e um humano assume — NUNCA inventa preço, desconto ou promessa.
- [ ] Tudo que muda de cliente pra cliente — persona, base, catálogo, regras — é DADO em arquivo editável, nunca código.
- [ ] O agente entende a mensagem como ela CHEGA (áudio, foto, texto torto): sentidos via API multimodal — nada de modelo pesado no seu servidor — e o que ele ouve ou vê obedece às mesmas regras da base.
- [ ] Canal em tempo real fala por webhook, e webhook exige URL pública — o deploy que você já domina resolve com um push, sem túnel nem ferramenta nova.
- [ ] Canal é camada, não alicerce: trocar de integração (oficial ↔ não-oficial) é um pedido no chat que refaz SÓ essa camada — o cérebro não muda.
- [ ] Agente que vende sabe em que etapa a conversa está e executa a ação que fecha aquela etapa: qualificar → recomendar → agendar → lembrar no dia anterior (por template aprovado, se passou da janela de 24h) → chamar o humano na hora certa.
- [ ] Agendar acontece na ferramenta que o dono JÁ usa (a agenda real — conectada por conta de serviço + calendário dedicado compartilhado) — com a regra vinda da base, nunca chumbada no código. E nem toda etapa vira ferramenta: pagamento, num negócio de balcão, é INFORMAÇÃO da base (formas de pagamento e política de sinal), não integração — construa ferramenta só onde o agente precisa AGIR.
- [ ] Agente autônomo entregue a cliente tem posto de comando (human-in-the-loop): um painel que só LÊ o que ele já grava no banco + o Assumir, com regra clara de quem comanda cada conversa — é essa tela que o cliente vê e paga.
- [ ] Antes de entregar, três provas: um estranho simulado tenta quebrar (IA testando IA, cada resposta comparada com a base — inventar é a falha grave), o cliente nº 2 sobe só trocando dados, e o custo roda TRAVADO no servidor (teto por conversa + trava anti-abuso).

---

Frase-âncora: "um chatbot responde; um agente resolve: ele ouve, sabe, agenda e sabe a hora de te chamar."
