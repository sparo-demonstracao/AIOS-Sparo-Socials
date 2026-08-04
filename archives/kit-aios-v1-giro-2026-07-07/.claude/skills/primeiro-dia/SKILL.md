---
name: primeiro-dia
description: O Dia 1 do seu AIOS — a entrevista de contratação do seu funcionário digital. Use quando o usuário disser "me configura", "vamos começar", "instalar meu AIOS", "preenche meu kit", "primeiro dia", "bora montar isso", ou logo depois de baixar o kit. Faz as 7 perguntas da entrevista uma por vez, preenche o CLAUDE.md e cria os arquivos de contexto (sobre você, seu negócio, prioridades, conexões, decisões, Lista de Pepitas, amostras de voz). Re-rodável a qualquer momento — se o aios-intake.md já estiver preenchido, atualiza os arquivos a partir dele em vez de perguntar tudo de novo.
---

# /primeiro-dia — a entrevista de contratação

Hoje é o primeiro dia do seu funcionário digital. Você é esse funcionário — e esta skill é a sua
entrevista de contratação. Ao final dela, você vai saber quem é seu chefe, o que ele vende, pra
quem, o que importa neste trimestre e como ele escreve. Tudo salvo em arquivo, porque funcionário
bom não pergunta a mesma coisa duas vezes.

Lembre da frase-síntese do kit: **"Não é um chat. É um contratado."** Um chat responde e esquece.
Um contratado anota, guarda e usa amanhã. Seu trabalho aqui é anotar e guardar.

**O que faz:** entrevista o usuário (7 perguntas), preenche o `CLAUDE.md` e cria toda a estrutura
de arquivos do AIOS.
**Como rodar:** o usuário chama `/primeiro-dia` (ou diz "me configura" / "vamos começar").
**O que ainda NÃO faz:** não conecta ferramenta nenhuma (isso vem depois, com o tempo) e não
constrói automação (isso é papel do `/giro-semanal`).

---

## Passo 0 — Checagem antes de começar (idempotência)

Antes de qualquer pergunta, leia o arquivo `aios-intake.md` na raiz do kit.

- **Se ele estiver preenchido de verdade** (respostas reais no lugar dos placeholders `{ASSIM}`):
  NÃO refaça a entrevista. Diga ao usuário que encontrou o intake preenchido, mostre um resumo
  de 3 linhas do que entendeu e pergunte: *"Quer que eu atualize todos os arquivos a partir dele,
  ou prefere revisar alguma resposta antes?"* Depois pule direto para o **Passo 3** (salvar e
  gerar arquivos). É assim que o usuário atualiza o AIOS: edita o `aios-intake.md` na mão e
  re-roda `/primeiro-dia`.
- **Se estiver vazio ou pela metade:** siga a entrevista do Passo 1 em diante. Se estiver pela
  metade, aproveite o que já existe e pergunte só o que falta.

## Passo 1 — Boas-vindas (2 frases, não mais)

Abra com no máximo duas frases. Exemplo de tom (adapte, não copie robótico):

> Bem-vindo ao primeiro dia do seu AIOS. Vou te fazer 7 perguntas rápidas — uma por vez — e no
> final eu mesmo crio todos os arquivos pra começar a trabalhar pra você.

Não explique a arquitetura do kit agora. Não liste as 7 perguntas de antemão. Comece.

## Passo 2 — A entrevista (7 perguntas, UMA POR VEZ)

Regras da entrevista:

- **Uma pergunta por mensagem.** Espere a resposta antes da próxima. Isto é uma conversa, não um
  formulário.
- **Resposta vaga = aprofunde na hora.** Se o usuário disser "vendo serviços", pergunte qual
  serviço, pra quem, por quanto. Uma resposta boa tem substantivo, número ou exemplo concreto.
- **Frases curtas, linguagem leiga.** Nada de termo técnico solto. O usuário pode ser dono de
  salão, corretor, dono de loja ou de agência — fale a língua dele.
- **Sempre "você/seu/sua". Nunca "tu/teu/tua".**

As perguntas (as mesmas 7 do `aios-intake.md`, na mesma ordem — salve cada resposta lá no
Passo 3):

**1. Quem é você e o que você faz?**
Nome, profissão, como o dia dele funciona. Se vier só "sou o João", pergunte: *"E o que ocupa a
maior parte do seu dia, João?"*

**2. Como é o seu negócio?**
O que vende, por quanto, e pra quem. Produto ou serviço, preço, como o dinheiro entra (venda
avulsa, mensalidade, comissão) e o cliente típico numa frase que dê pra visualizar: "dona de
clínica com 3 funcionárias", "condomínios da zona norte". "Todo mundo" não é resposta — aperte.
Se ele tiver mais de uma fonte de renda, anote todas e pergunte qual paga as contas hoje.

**3. Quais são as suas prioridades deste trimestre?**
Exija **número e prazo**. "Crescer" não vale. "R$ 20k/mês até setembro" vale. "2 posts por semana
a partir de agosto" vale. Se vier meta sem número, pergunte: *"Como você vai saber que chegou lá?
Me dá um número e uma data."* Anote de 1 a 3 metas, não mais.

**4. Qual é a maior dor recorrente da sua semana?**
A tarefa que mais rouba tempo ou que ele mais adia. Peça detalhe: o que é, quantas vezes
acontece, quanto tempo come. Essa resposta vira a candidata número 1 da Lista de Pepitas e,
provavelmente, a primeira automação do `/giro-semanal`.

**5. Quais ferramentas você usa todo dia de trabalho?**
Puxe pelo dia a dia brasileiro: e-mail (Gmail?), agenda (Google Agenda?), planilha, WhatsApp,
plataforma de venda (Kiwify, Hotmart, Shopify?), Notion, Drive, sistema de nota fiscal. Liste
tudo que ele citar — cada uma vira uma linha no registro de conexões.

**6. Como você escreve? Me manda amostras reais.**
Peça 2 ou 3 trechos **verbatim** (copiados e colados, sem editar) de e-mail ou WhatsApp que ele
mesmo escreveu: um pra cliente, um mais informal. Explique o porquê em uma frase: *"É assim que eu
aprendo a rascunhar mensagens que parecem suas, não de robô."* Descrição abstrata de tom ("sou
descontraído") não substitui amostra — insista com jeito.

**7. O que o AIOS NUNCA deve fazer sem perguntar antes?**
Os limites inegociáveis dele. Dê exemplos pra destravar: "nunca enviar mensagem pra cliente sem
eu aprovar", "nunca mexer em pagamento ou Pix", "nunca apagar arquivo". Anote como regras claras —
elas entram no `CLAUDE.md` e valem pra sempre.

## Passo 3 — Salvar as respostas no aios-intake.md

Escreva todas as respostas no `aios-intake.md`, cada uma sob a pergunta correspondente,
substituindo os placeholders. Este arquivo é a fonte da verdade do onboarding: quem quiser mudar
algo depois, edita ele e re-roda `/primeiro-dia`.

## Passo 4 — Preencher o CLAUDE.md

Abra o `CLAUDE.md` do kit e substitua **todos** os placeholders `{ASSIM}` pelas respostas.
Regra dura: **nenhum placeholder pode sobrar.** Se alguma informação não apareceu na entrevista,
volte e pergunte — não invente e não deixe `{PRIORIDADES_DO_TRIMESTRE}` ou `{MAIOR_DOR}` órfão
no arquivo.

## Passo 5 — Criar os arquivos de contexto

Crie os três arquivos abaixo a partir das respostas (não copie a resposta crua — organize):

**`context/sobre-mim.md`** — quem é o usuário: nome, profissão, rotina, como prefere trabalhar
com você (direto, sem enrolação) e os limites da pergunta 7 (o que você NUNCA faz sem perguntar).

**`context/sobre-negocio.md`** — o que vende, por quanto, pra quem, como o dinheiro entra, e o
que NÃO é foco.

**`context/prioridades.md`** — as metas do trimestre, cada uma com número e prazo, e a data em
que foram registradas. Siga o formato do template: abra com a linha `**Trimestre:**
{TRIMESTRE_E_ANO}` (ex.: "jul–set/2026").

Crie também **`references/voz.md`** com as amostras verbatim da pergunta 6, marcadas como
"não editar", e 3 ou 4 traços observados do registro dele (ex.: "abre com 'Oi, tudo bem?'",
"frases curtas", "usa 'a gente', não 'nós'").

## Passo 6 — Criar o registro de conexões

Crie o `connections.md` com uma linha por ferramenta citada na pergunta 5, neste formato:

```markdown
# Conexões do AIOS

Registro de todo sistema que este AIOS alcança. Nível de acesso: só leitura → rascunha → age.

| Ferramenta | Nível de acesso | Status | Último teste |
|---|---|---|---|
| {FERRAMENTA} | — | ainda não conectada | — |
```

Todas nascem com status **"ainda não conectada"**. Diga ao usuário, sem drama: *"Seu funcionário
foi contratado, mas ainda não recebeu as chaves de nada. Vamos entregar uma chave de cada vez,
nas próximas semanas."*

## Passo 7 — Iniciar o registro de decisões

Crie o `decisions/log.md` (registro que só cresce — nunca apague entradas) com a primeira entrada:

```markdown
# Registro de decisões

Só adicionar no topo. Nunca apagar.

## {DATA_DE_HOJE} — Instalei meu AIOS
Contratei um funcionário digital pro meu negócio. Meta do primeiro mês: sair de Enfeite pra
Operário no Raio-X. Primeiro exame marcado pro Dia 7.
```

## Passo 8 — Criar a Lista de Pepitas

Antes de criar o arquivo, faça UMA pergunta extra (fora das 7 da entrevista):

> **"Pra fechar: quais tarefas você mais repete no mês?"**

Use a **Regra das 3 Vezes**: fez 3 ou mais vezes no mês? É candidata. Dê exemplos pra destravar:
responder a mesma pergunta no WhatsApp, montar a planilha de segunda, emitir boleto todo dia 5,
cobrar quem atrasou o Pix, lembrar cliente da consulta de amanhã. Para cada tarefa citada,
pergunte **quantas vezes por semana** acontece e **quanto tempo come por vez**. Colete de 3 a 6
tarefas — e some a elas a maior dor da pergunta 4, que entra como a primeira pepita da lista.

Crie o `pepitas.md` na raiz com essas tarefas — as primeiras pepitas:

```markdown
# Lista de Pepitas

Toda tarefa candidata a automação entra aqui. Anotar, não resolver na hora.
O ouro mora nas tarefas chatas.

| Pepita (o que é) | Vezes por semana | Tempo por vez | Anotada em |
|---|---|---|---|
| {TAREFA} | {N} | {MIN} min | {DATA} |
```

Se alguma pepita veio sem frequência ou tempo, pergunte agora — a tabela não aceita coluna
vazia.

## Passo 9 — Fechamento

Feche em três blocos, nesta ordem:

**1. O que foi criado.** Liste os arquivos, um por linha, com um checque na frente:
`aios-intake.md`, `CLAUDE.md` preenchido, `context/sobre-mim.md`, `context/sobre-negocio.md`,
`context/prioridades.md`, `references/voz.md`, `connections.md`, `decisions/log.md`,
`pepitas.md`.

**2. A nota estimada do primeiro Raio-X.** Estime com honestidade usando as 4 chapas
(Memória 20 · Alcance 25 · Ofício 35 · Pulso 20). Logo após o primeiro dia, o cenário típico é:
Memória alta (os arquivos acabaram de nascer preenchidos), Alcance quase zero (nenhuma ferramenta
conectada), Ofício zero (nenhuma skill entregou trabalho ainda), Pulso zero (nada roda sozinho).
Isso dá algo entre 15 e 25 pontos: faixa **Enfeite**. Diga isso sem rodeio e sem desânimo —
*"todo contratado começa o primeiro dia sem as chaves e sem entrega. A meta do kit é te levar de
Enfeite pra Operário no primeiro mês."*

**3. Os próximos passos.** Dois compromissos, com data:
- **Dia 7:** rode `/raio-x` — o primeiro exame de verdade do seu funcionário. Vai medir o que
  responde ao vivo, não o que está no papel.
- **Primeira sexta-feira:** rode `/giro-semanal` — a primeira volta do Método GIRO. Uma volta =
  uma automação entregue, começando pelas pepitas que você acabou de anotar.

Termine perguntando qual ferramenta ele quer conectar primeiro — a agenda e o e-mail costumam
ser as chaves mais rápidas de entregar.

---

## Se algo der errado

- **Usuário sem paciência pra 7 perguntas:** encurte sem pular — junte no máximo duas perguntas
  afins (2+3, por exemplo), mas nunca entregue as 7 de uma vez.
- **Usuário não tem amostras de voz à mão:** crie o `references/voz.md` com um aviso
  `{PENDENTE: colar 2-3 trechos reais de e-mail/WhatsApp}` e lembre que isso custa pontos de
  Memória no Raio-X.
- **Já existem arquivos de uma rodada anterior:** nunca sobrescreva `decisions/log.md` nem apague
  pepitas antigas do `pepitas.md` — nesses dois, apenas acrescente. Os demais podem ser
  regenerados a partir do `aios-intake.md`.
