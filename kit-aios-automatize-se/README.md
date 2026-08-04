# AIOS Automatize-se

**Não é um chat. É um contratado.**

Este kit transforma o Claude Code (ou o Antigravity) num **AIOS** — um assistente de IA que
conhece você, conhece o seu negócio e automatiza seus processos, um de cada vez. Você não
precisa saber programar. O caminho inteiro é: **responder 7 perguntas uma vez, e depois usar
2 comandos.** Investindo um tempo nisso, **em um mês você tem um assistente com cerca de 5
automações fazendo o trabalho exatamente do seu jeito.**

## Pra quem é

- **Donos de pequenos negócios** que perdem horas com tarefa repetida: responder o mesmo
  WhatsApp, montar a planilha de segunda, cobrar quem atrasou o Pix.
- **Quem quer viver de automação** e precisa de um método simples pra entregar valor de verdade.
- **Profissionais** que querem automatizar o próprio trabalho.

Se você nunca escreveu uma linha de código, está no lugar certo. Tudo em português, em
linguagem de gente.

## As 3 skills

- **`/iniciar`** — roda uma vez. Faz 7 perguntas sobre você e seu negócio, monta toda a
  estrutura sozinho e registra a data de nascimento do seu AIOS.
- **`/automatizar`** — o comando do dia a dia. Apareceu uma tarefa chata? Digite
  `/automatizar` e saia com ela fora das suas costas — sem dia certo, sem fila. Se você não
  souber o que automatizar, ele descobre por você: parte das metas que você contou no
  `/iniciar` e acha o que está te roubando tempo delas. E quando faltar uma peça no caminho
  (uma ferramenta conectada, mais contexto), ele resolve a peça junto.
- **`/analisar`** — dá a nota do seu AIOS (0 a 100) comparando com a **idade** dele: um AIOS
  de 3 dias não é cobrado como um de 3 semanas. E diz exatamente o que fazer pra ficar em dia.

## O método por trás

Dois nomes pra você guardar — e mais nada:

- **Método 3A** — o passo a passo que o `/automatizar` segue toda vez: **Anotar** a tarefa →
  **Avaliar** o que vale automatizar → **Automatizar** na hora. Está explicado em
  [`references/metodo-3a.md`](references/metodo-3a.md).
- **Boletim do AIOS** — a régua do `/analisar`: 4 notas de 25 pontos (ele te conhece? alcança
  suas ferramentas? entrega trabalho? roda sozinho?), sempre cobradas **pela idade do AIOS** —
  nota 100 significa "em dia com o esperado", e a régua do primeiro mês termina em 5
  automações. Está em [`references/boletim.md`](references/boletim.md).

## Como instalar e começar

1. **Baixe o kit** (clone ou ZIP):

   ```
   git clone https://github.com/enzosparo/aios-automatize-se.git
   ```

   Não sabe o que é "clonar"? Baixe o ZIP pelo botão verde **Code → Download ZIP** e
   descompacte numa pasta sua.

2. **Abra a pasta no Claude Code ou no Antigravity.** No Claude Code: abra o terminal na pasta
   e digite `claude`. No Antigravity: abra a pasta como projeto.

3. **Rode `/iniciar`.** É uma conversa de uns 15 minutos: ele pergunta, você responde, ele
   monta tudo.

Daí em diante: **`/automatizar` sempre que quiser tirar uma tarefa das costas, e `/analisar`
pra ver se o seu AIOS está em dia com a idade.**

## Estrutura de pastas

```
aios-automatize-se/
├── README.md            ← você está aqui
├── LICENSE              ← MIT
├── CLAUDE.md            ← as instruções do seu AIOS (o /iniciar preenche)
├── aios-intake.md       ← as 7 perguntas (o /iniciar preenche por você)
├── EXPANSOES.md         ← o que adicionar quando seu AIOS crescer
├── tarefas.md           ← suas tarefas repetidas: as candidatas a automação
├── connections.md       ← as ferramentas que seu AIOS alcança
├── .claude/skills/      ← as 3 skills (Claude Code)
├── .agents/skills/      ← as mesmas 3 skills (Antigravity)
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

MIT License. © 2026 Enzo Barbatto (o Enzo Sparo aqui de cima). Use, adapte, redistribua —
veja o arquivo `LICENSE`.

Os nomes **"Método 3A"** e **"Boletim do AIOS"** são marcas de Enzo Barbatto. O conteúdo dos
frameworks segue os termos MIT; os nomes são reservados.

Estrutura inspirada nos kits AIOS open-source da comunidade, entre eles o kit de Nate Herk (MIT).
