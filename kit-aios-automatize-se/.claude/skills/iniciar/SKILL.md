---
name: iniciar
description: Monta o AIOS do zero em uma conversa de 15 minutos — faz as 7 perguntas do aios-intake.md uma por vez, preenche o CLAUDE.md e cria todos os arquivos (contexto, prioridades, voz, ferramentas, tarefas repetidas, decisões). Use quando o usuário disser "me configura", "vamos começar", "iniciar meu AIOS", "preenche meu kit", "bora montar isso", ou logo depois de baixar o kit. Re-rodável — se o aios-intake.md já estiver preenchido, atualiza os arquivos a partir dele em vez de perguntar tudo de novo.
---

# /iniciar — monta o seu AIOS

Esta skill faz 7 perguntas, uma por vez, e monta toda a estrutura de arquivos do AIOS a partir
das respostas. No final, o usuário sai com o kit funcionando e sabendo os dois próximos passos.

## Antes de começar (re-rodável)

Leia o `aios-intake.md` na raiz do kit.

- **Se já estiver preenchido** (respostas reais no lugar dos campos `{ENTRE_CHAVES}`): não refaça a
  entrevista. Mostre um resumo de 3 linhas do que entendeu e pergunte: *"Atualizo todos os
  arquivos a partir daqui, ou você quer revisar alguma resposta antes?"* Depois pule direto
  pro passo "Gerar os arquivos". É assim que o usuário atualiza o AIOS: edita o intake e
  re-roda `/iniciar`.
- **Se estiver vazio ou pela metade:** siga a conversa abaixo, aproveitando o que já existir.

## A conversa (7 perguntas, UMA por vez)

Abra com no máximo duas frases: diga que vai fazer 7 perguntas rápidas e que no final você
mesmo cria tudo. Não liste as perguntas de antemão — comece.

Regras da conversa:

- **Uma pergunta por mensagem.** Espere a resposta antes da próxima.
- **Resposta vaga? Aprofunde na hora.** "Vendo serviços" → qual serviço, pra quem, por quanto.
- **Linguagem simples, frases curtas.** O usuário pode ser dono de salão, corretor, lojista.
  Nada de palavra técnica: não use "skill", "script", "repositório", "arquivo de configuração".
  Fale em "comando", "programa que eu crio e rodo pra você", "pasta do seu AIOS".
- **Nunca peça pra ele abrir terminal, prompt de comando ou digitar comando de sistema.**
  Tudo que precisa ser rodado, você roda. Ele só conversa com você.
- **Sempre "você/seu/sua". Nunca "tu/teu/tua".**

As 7 perguntas (as mesmas do `aios-intake.md`, na mesma ordem):

1. **Quem é você e o que você faz?** — nome, profissão, o que ocupa a semana.
2. **Como é o seu negócio?** — o que vende, por quanto, pra quem. "Todo mundo" não é
   resposta — peça o cliente típico numa frase que dê pra visualizar.
3. **Quais são as suas prioridades do trimestre?** — exija número e prazo. "Crescer" não
   vale; "R$ 20k/mês até setembro" vale. De 1 a 3 metas.
4. **Qual é a maior dor recorrente da sua semana?** — a tarefa que mais rouba tempo ou que
   ele mais adia. Peça detalhe: o que é, quantas vezes acontece, quanto tempo come.
5. **Quais ferramentas você usa todo dia?** — puxe pelo dia a dia: e-mail, agenda, planilha,
   WhatsApp, plataforma de venda (Kiwify, Hotmart...), Notion, Drive.
6. **Como você escreve? Me manda amostras reais.** — 2 ou 3 trechos copiados e colados de
   e-mail ou WhatsApp dele. Explique: *"é assim que eu aprendo a escrever como você, não como
   robô."* Descrição de tom não substitui amostra.
7. **O que o AIOS NUNCA deve fazer sem perguntar antes?** — os limites. Dê exemplos pra
   destravar: "nunca enviar mensagem pra cliente sem eu aprovar", "nunca mexer em Pix".

Depois da 7, faça UMA pergunta extra: **"Pra fechar: quais tarefas você mais repete no mês?"**
Colete de 3 a 6, cada uma com quantas vezes por semana acontece e quanto tempo toma.

## Gerar os arquivos

Com as respostas em mãos, crie/atualize nesta ordem:

1. **`aios-intake.md`** — salve cada resposta sob a pergunta correspondente. É a fonte da
   verdade do kit.
2. **`CLAUDE.md`** — substitua TODOS os campos `{ENTRE_CHAVES}` pelas respostas. Regra dura:
   nenhum campo pode sobrar em branco. Faltou informação? Volte e pergunte — não invente.
   **Inclui a data de nascimento do AIOS:** pegue a data de HOJE do ambiente sozinho (nunca
   pergunte a data pro usuário nem peça pra ele rodar nada) e preencha a linha
   `**AIOS criado em:** {DATA_DE_CRIACAO}`, no formato AAAA-MM-DD. É essa data que o
   `/analisar` usa pra saber a idade do AIOS — não pule. (Se estiver re-rodando o `/iniciar`
   e a data já estiver preenchida, NÃO mude: aniversário não se reseta.)
3. **`context/sobre-mim.md`**, **`context/sobre-negocio.md`**, **`context/prioridades.md`** —
   preencha os templates a partir das respostas (organize, não copie cru).
4. **`references/voz.md`** — as amostras da pergunta 6, copiadas na íntegra e marcadas como
   "não editar", mais 3 ou 4 traços que você observou ("abre com 'Oi, tudo bem?'", "frases
   curtas").
5. **`connections.md`** — uma linha por ferramenta citada na pergunta 5, todas com status
   "ainda não conectada".
6. **`tarefas.md`** — as tarefas repetidas coletadas no final, uma por linha (o que é ·
   vezes por semana · tempo por vez · anotada em), começando pela maior dor da pergunta 4.
7. **`decisions/log.md`** — a primeira entrada: data de hoje, "Montei meu AIOS", e a meta
   número 1 do trimestre.

Se algum desses arquivos já existir de uma rodada anterior: `decisions/log.md` e `tarefas.md`
só recebem acréscimos (nunca apague o que já está lá); os demais podem ser regenerados a
partir do intake.

## Fechamento

Feche em três blocos:

1. **O que foi criado** — liste os arquivos, um por linha, cada um com o que guarda.
2. **Onde o AIOS está hoje** — seja honesto, sem inflar. Hoje ele **conhece você, mas ainda
   não conectou nada e não automatizou nada**. Na régua do Boletim
   (`references/boletim.md`) isso é **nota 25 de 100 — e 25 é exatamente o esperado pro
   dia 0**. Diga nessa ordem: a nota é baixa porque quase tudo ainda está por construir, e
   pra idade dele você está em dia. Depois avise o que vem até o dia 7: a primeira
   ferramenta conectada e a primeira automação funcionando (nota 41).
3. **Os dois próximos passos:**
   - **Quando aparecer a primeira tarefa chata** (pode ser agora): digite `/automatizar` —
     a maior dor que você contou na pergunta 4 é a candidata número 1.
   - **No dia 7:** digite `/analisar` — o primeiro boletim que já cobra alguma coisa.

Termine perguntando qual ferramenta ele quer conectar primeiro — e-mail e agenda costumam
ser as mais rápidas. Deixe claro que quem conecta é você: ele só diz qual, e responde as
telas de permissão que aparecerem.
