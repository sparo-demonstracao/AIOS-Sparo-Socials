---
name: automatizar
description: Automatiza mais um processo do usuário, na hora, seguindo o Método 3A (Anotar → Avaliar → Automatizar) — e, se ele não souber O QUE automatizar, descobre por ele, cruzando as respostas do /iniciar (metas do trimestre, maior dor, negócio) com o que rouba o tempo dele. Use sempre que o usuário quiser tirar uma tarefa das costas — "quero automatizar isso", "automatiza esse processo", "faz isso pra mim toda vez", "o que eu automatizo agora?". Uma rodada = uma automação entregue e funcionando.
---

# /automatizar — mais um processo fora das suas costas

Esta skill segue o **Método 3A** (`references/metodo-3a.md`): **Anotar** o processo →
**Avaliar** o que vale automatizar → **Automatizar** agora. Não tem dia certo nem fila de
espera: apareceu uma tarefa chata, o usuário digita `/automatizar` e sai com ela resolvida.
Quem roda isso umas 5 vezes no primeiro mês monta um AIOS que trabalha do jeito dele.

**A bússola da skill são as respostas do `/iniciar`.** O usuário já contou qual é a meta do
trimestre, qual a maior dor da semana e como o negócio funciona — automação boa é a que
aproxima ele DESSA meta, não a mais impressionante. Toda recomendação desta skill nasce daí.

**Regra de ouro: uma entrega por rodada, terminada.** Na maioria das vezes a entrega é uma
automação — mas ela também pode ser a peça que faltava pra automação existir: uma ferramenta
conectada e testada, um comando novo, ou contexto melhorado (mais amostras de voz, prioridades
atualizadas). O que não vale é terminar sem nada de pé. Melhor 1 funcionando que 3 pela metade.

**Regra de linguagem e de mão na massa (vale a rodada inteira):**

- O usuário **não sabe programar e não vai abrir terminal**. Nunca peça pra ele digitar
  comando de sistema, instalar programa pela linha de comando, editar arquivo na mão ou
  "configurar" qualquer coisa técnica. Tudo isso é você quem faz.
- O que ele faz é: **conversar com você aqui, clicar em telas normais de aplicativo** (a de
  permissão do Gmail, por exemplo) e **digitar um comando com barra** (`/automatizar`).
- Fale sem jargão: "comando" no lugar de "skill", "um programinha que eu criei e rodo pra
  você" no lugar de "script", "registro" no lugar de "log". Se precisar usar uma palavra
  técnica, explique em 4 palavras entre parênteses.

## Antes de falar com o usuário

1. Releia as respostas do `/iniciar`: `context/prioridades.md` (a meta nº 1 do trimestre),
   `aios-intake.md` (a maior dor da pergunta 4) e `context/sobre-negocio.md` (como o dinheiro
   entra). É esse trio que decide o que vale automatizar.
2. Leia `tarefas.md` (a lista de tarefas repetidas). Se não existir, crie com o cabeçalho
   padrão: uma tarefa por linha — o que é · vezes por semana · tempo por vez · anotada em.
3. Leia as últimas entradas de `decisions/log.md`: o que já foi automatizado? Alguma automação
   anterior com revisão pendente?

**Se existe automação anterior rodando, abra com uma pergunta rápida sobre ela:** funcionou?
Errou onde? Se rodou uma semana inteira sem erro e o usuário confia, ela pode passar a rodar
sem aprovação. Se não valeu, mova pra `archives/` (não delete) e anote o aprendizado. Isso
leva 1 minuto — depois vá pro que o usuário veio fazer.

## Passo 1 — ANOTAR (descobrir o que automatizar, guiado pela meta)

Dois cenários:

**O usuário já chegou com a tarefa** ("quero automatizar a cobrança dos atrasados"): ótimo.
Entenda o processo com 3 perguntas: o que exatamente acontece hoje, quantas vezes por
semana/mês, quanto tempo come por vez. Anote em `tarefas.md`. Se a tarefa não tiver relação
nenhuma com as metas do trimestre, automatize mesmo assim (a escolha é dele) — mas diga qual
candidata empurraria a meta, pra ele considerar na próxima.

**O usuário não sabe o quê** ("o que eu automatizo agora?"): aqui a skill trabalha de trás
pra frente, **partindo da meta que ele declarou no `/iniciar`**:

1. Relembre a meta em voz alta: *"sua meta do trimestre é {META}. Vamos achar o que está
   entre você e ela."*
2. Pergunte guiado pela meta, uma por vez:
   - *"O que você faz na semana que mais te ROUBA tempo de trabalhar nessa meta?"*
   - *"Tem algo que precisa ser feito TODA vez pra essa meta andar (proposta, cobrança,
     post, follow-up) e que hoje sai na mão?"*
   - *"O que você adia sempre — e que empurra essa meta junto?"*
3. Cruze as respostas com a maior dor da pergunta 4 do `/iniciar` e com o que já está em
   `tarefas.md`. Se ainda faltar ideia, puxe exemplos do tipo de negócio dele (use o
   `sobre-negocio.md` pra escolher os exemplos certos):
   - Vende serviço com hora marcada → lembrete de consulta/horário de amanhã
   - Vende produto → responder "qual o prazo de entrega?" no WhatsApp, copiar pedido pra planilha
   - Recebe de clientes → cobrar (com jeitinho) quem atrasou o Pix, emitir boleto todo dia 5
   - Vive de conteúdo/vendas → rascunhar post, separar e-mail que importa, follow-up de proposta
4. Apresente **3 candidatas pra ele escolher — sempre marcando a sua recomendada**, com a
   conexão com a meta explícita. Cada alternativa em 1 linha (o que é + o que devolve).
   Exemplo do formato:

   > Das tarefas que apareceram, essas 3 valem a rodada:
   > 1. **Cobrança dos atrasados — minha recomendação:** acontece todo dia, te toma 4 horas
   >    por semana, e acelera o dinheiro entrando rumo aos R$ 20k/mês.
   > 2. Lembrete de consulta de amanhã — corta os furos de agenda.
   > 3. Separar os e-mails que importam — devolve 20 minutos toda manhã.
   >
   > Qual você prefere?

   A escolha é dele: escolheu outra que não a recomendada, sem discussão — automatize a
   escolhida.

   As alternativas não precisam ser todas automações: quando o maior desbloqueio do momento
   for uma conexão nova ("conectar sua agenda"), um comando novo ou contexto melhor ("colar mais
   amostras da sua voz"), inclua no cardápio — sempre dizendo o que cada uma destrava.

Aproveite e anote TODAS as tarefas que aparecerem na conversa em `tarefas.md` — as que não
forem automatizadas hoje ficam prontas pra próxima rodada. Se o usuário colar uma lista de
tarefas que anotou no celular durante o dia, anote todas de uma vez.

## Passo 2 — AVALIAR (tamanho que cabe em uma sentada)

**Quebre a tarefa em passos** e mostre em linguagem direta o que cabe a cada um:
*"desses 5 passos, a IA faz 3 (achar quem atrasou, escrever a mensagem no seu tom, anotar que
cobrou), você continua com 2 (decidir se cobra, apertar enviar) — e 1 a gente corta, porque
nem precisava existir."*

Regra de segurança pro começo: prefira a parte onde o erro da IA custa barato (um rascunho
ruim que ninguém envia não custa nada; um Pix errado custa caro).

**Cheque as peças antes de construir:** a tarefa escolhida precisa de uma ferramenta que o
AIOS ainda não alcança (agenda, e-mail, planilha)? Então conectar e testar essa ferramenta é
a primeira parte da entrega — e se a conexão comer a sessão inteira, ela É a entrega da
rodada (registre em `connections.md` com a data do teste; a automação já fica escolhida pra
próxima). Conectar é trabalho seu: o usuário só diz qual ferramenta e clica no "permitir"
que aparecer na tela. Falta contexto pro resultado sair bom (ex.: rascunhos com cara de robô
porque `references/voz.md` tem pouca amostra)? Resolva isso junto, na mesma rodada.

**Feche em uma frase e confirme:** *"A partir de hoje o AIOS faz X, você continua fazendo
Y."* Se não couber em uma sentada, encolha até caber.

## Passo 3 — AUTOMATIZAR (construir agora)

Construa nesta sessão a menor versão que já resolve — um comando novo, um modelo de mensagem,
um programinha que você mesmo cria e roda, uma rotina que o computador dispara sozinha no
horário marcado. Escolha a forma mais simples que resolve.

Regras:

1. **Nada de terminal pro usuário.** Se a automação precisa de um programa, de uma instalação
   ou de um agendamento no computador, **você faz tudo**: cria, instala, agenda e testa. O
   usuário nunca vê uma linha de comando.
2. **Toda automação tem que ter um jeito humano de disparar.** No fim da rodada, ela roda de
   uma destas formas — e você diz qual em uma frase: (a) ele **pede aqui na conversa**;
   (b) você criou um **comando com barra** pra ele digitar (ex.: `/cobrar`); ou (c) ela
   **dispara sozinha** no horário, porque você deixou agendada. Automação que só funciona se
   alguém abrir o terminal não está terminada.
3. **Teste com caso real, nunca inventado.** Peça o material de verdade: um e-mail real, a
   planilha da segunda passada, a última mensagem daquele cliente. Rode o teste você mesmo e
   mostre o resultado pra ele conferir.
4. **Toda automação nova nasce pedindo aprovação:** a IA prepara, o usuário confere antes de
   valer. Só depois de uma semana rodando sem erro ela pode passar a rodar sozinha (decisão
   que se toma na abertura de um próximo `/automatizar`).
5. **Não ficou de pé em uma sessão? Estava grande demais.** Volte ao passo 2 e encolha.
   Não é fracasso — é o tamanho certo.
6. **Se criar um comando novo:** grave a pasta em `.claude/skills/` E em `.agents/skills/`
   (cópia idêntica, pra funcionar no Claude Code e no Antigravity). Isso é serviço seu — pro
   usuário, o que existe é "um comando novo chamado /nome".

## Fechar a rodada

1. **Registre em `decisions/log.md`:** a data, o que foi entregue (automação, conexão,
   comando novo ou contexto), o que faz, **como o usuário dispara**, o que ainda NÃO faz, e a
   data de revisão (daqui a 7 dias). Se a entrega foi uma conexão, registre também em
   `connections.md`, com nível de acesso e data do teste.
2. **Atualize `tarefas.md`:** marque a tarefa como automatizada; as outras ficam na lista.
3. **Diga em uma frase como usar daqui pra frente** — o gatilho do item 2 do passo 3, com as
   palavras exatas que ele digita ou o horário em que a coisa dispara sozinha.
4. Feche convidando pra próxima: *"apareceu outra tarefa chata? É só digitar /automatizar de
   novo — não precisa esperar dia certo. E de vez em quando roda o /analisar pra ver como
   está a nota do seu AIOS."*

**Se nada foi construído** (raro): registre em `decisions/log.md` o motivo em uma linha —
qual processo foi escolhido, onde travou e qual pedaço menor será tentado na próxima rodada.
Motivo registrado também é entrega; sumir sem registro não é.
