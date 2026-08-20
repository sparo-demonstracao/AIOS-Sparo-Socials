# AIOS Automatize-se

**Não é um chat. É um contratado.**

Este kit transforma o Claude Code (ou o Antigravity) num **AIOS** — um assistente de IA que
conhece você, conhece o seu negócio e automatiza seus processos, um de cada vez. Você não
precisa saber programar. O caminho inteiro é: **responder 7 perguntas uma vez, e depois usar
os comandos do dia a dia.** Investindo um tempo nisso, **em um mês você tem um assistente com cerca de 5
automações fazendo o trabalho exatamente do seu jeito.**

## Pra quem é

- **Donos de pequenos negócios** que perdem horas com tarefa repetida: responder o mesmo
  WhatsApp, montar a planilha de segunda, cobrar quem atrasou o Pix.
- **Quem quer viver de automação** e precisa de um método simples pra entregar valor de verdade.
- **Profissionais** que querem automatizar o próprio trabalho.

Se você nunca escreveu uma linha de código, está no lugar certo. Tudo em português, em
linguagem de gente. **Você nunca vai precisar abrir terminal nem digitar comando de
programador** — quem faz isso é o seu AIOS. Você só conversa com ele.

## Os 4 comandos

- **`/iniciar`** — roda uma vez. Faz 7 perguntas sobre você e seu negócio, monta toda a
  estrutura sozinho e registra a data de nascimento do seu AIOS.
- **`/automatizar`** — o comando do dia a dia. Apareceu uma tarefa chata? Digite
  `/automatizar` e saia com ela fora das suas costas — sem dia certo, sem fila. Se você não
  souber o que automatizar, ele descobre por você: parte das metas que você contou no
  `/iniciar` e acha o que está te roubando tempo delas. E quando faltar uma peça no caminho
  (uma ferramenta conectada, mais contexto), ele resolve a peça junto.
- **`/analisar`** — dá a nota do seu AIOS de 0 a 100: quanto dele já está de pé e
  funcionando. Junto vem o **ritmo**, que compara essa nota com a idade dele. AIOS recém
  criado tira nota baixa — e está certo assim: 25 no dia 0 é o esperado. E ele fecha dizendo
  os 3 próximos passos, com quantos pontos cada um devolve.
- **`/painel`** — a Central de Comando: uma página que abre no seu navegador com o negócio
  inteiro numa tela — conexões, automações rodando, capacidades e as recomendações do seu
  AIOS. E ele cresce junto: automação que produz algo pra você revisar (um relatório, uns
  rascunhos) ganha uma aba própria no menu.

## O método por trás

Dois nomes pra você guardar — e mais nada:

- **Método 3A** — o passo a passo que o `/automatizar` segue toda vez: **Anotar** a tarefa →
  **Avaliar** o que vale automatizar → **Automatizar** na hora. Está explicado em
  [`references/metodo-3a.md`](references/metodo-3a.md).
- **Boletim do AIOS** — a régua do `/analisar`: 4 notas de 25 pontos (ele te conhece? alcança
  suas ferramentas? entrega trabalho? roda sozinho?). A nota mede o que já está funcionando —
  nota 100 é o AIOS do fim do primeiro mês, com 5 automações e uma rotina disparando sozinha.
  Está em [`references/boletim.md`](references/boletim.md).

## Como começar (sem terminal, sem código)

1. **Baixe o kit na sua área de aluno.** Você recebeu o kit como um arquivo ZIP junto com o
   curso. Baixe, clique com o botão direito no arquivo e escolha **Extrair tudo** — vai virar
   uma pasta no seu computador. Guarde ela onde você achar fácil (Documentos, por exemplo).

2. **Abra essa pasta no Claude Code ou no Antigravity.** Nos dois é a mesma ideia: abra o
   programa e mande ele abrir a pasta que você acabou de extrair (**Abrir pasta**, ou
   arraste a pasta pra dentro dele).

3. **Digite `/iniciar` e dê Enter.** É uma conversa de uns 15 minutos: ele pergunta, você
   responde com suas palavras, ele monta tudo sozinho.

Daí em diante: **`/automatizar` sempre que quiser tirar uma tarefa das costas, `/analisar`
pra ver a nota do seu AIOS, e `/painel` pra abrir a sua Central de Comando.** Se em algum momento você não souber o que fazer, é só
perguntar pra ele ali mesmo na conversa.

## Estrutura de pastas

```
aios-automatize-se/
├── README.md            ← você está aqui
├── LICENSE              ← sua licença de uso
├── CLAUDE.md            ← as instruções do seu AIOS (o /iniciar preenche)
├── aios-intake.md       ← as 7 perguntas (o /iniciar preenche por você)
├── EXPANSOES.md         ← o que adicionar quando seu AIOS crescer
├── tarefas.md           ← suas tarefas repetidas: as candidatas a automação
├── connections.md       ← as ferramentas que seu AIOS alcança
├── .claude/skills/      ← os 4 comandos (Claude Code)
├── .agents/skills/      ← os mesmos 4 comandos (Antigravity)
├── references/          ← Método 3A, Boletim e amostras da sua voz
├── context/             ← quem você é, seu negócio, suas prioridades
├── boletins/            ← o histórico das suas notas (o /analisar cria)
├── decisions/log.md     ← o que você decidiu e por quê
└── archives/            ← coisas antigas — arquiva, não deleta
```

## Feito por Enzo Sparo

Eu ensino automação com IA sem escrever código — do zero, em português. Se o kit te ajudou:

- **YouTube:** [youtube.com/@enzosparo](https://www.youtube.com/@enzosparo)
- **Instagram:** [@enzosparo](https://www.instagram.com/enzosparo)
- **Comunidade Automatize-se e todos os links:** [links.sparo.com.br](https://links.sparo.com.br)

## Licença

© 2026 Enzo Barbatto (o Enzo Sparo aqui de cima). Todos os direitos reservados. Este kit faz
parte do produto **AIOS Sparo**: use e adapte à vontade no seu negócio, mas não redistribua
nem compartilhe — os detalhes estão no arquivo `LICENSE`.

Os nomes **"Método 3A"** e **"Boletim do AIOS"** são marcas de Enzo Barbatto.

Estrutura inspirada nos kits AIOS open-source da comunidade, entre eles o kit de Nate Herk (MIT).
