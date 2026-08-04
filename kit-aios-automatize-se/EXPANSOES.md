# EXPANSÕES — pra onde o seu AIOS cresce

O kit é o primeiro dia, não o teto. Este guia lista o que adicionar conforme seu AIOS
amadurece — do mais fácil ao mais avançado. Regra de sempre: **uma expansão por vez**, e só
depois que o que já existe estiver rodando. Na dúvida, rode `/analisar`: os 3 próximos passos
do boletim já apontam a expansão certa.

## Nível 1 — primeiras semanas (minutos de esforço)

**Engorde o `tarefas.md`.** Toda tarefa que se repetir na sua semana, anote na hora. Lista
cheia = `/automatizar` melhor. Custa 30 segundos por tarefa.

**Cole mais amostras de voz.** Adicione mais e-mails e mensagens reais em
`references/voz.md`, de situações diferentes (cliente, cobrança, parceiro). Quanto mais
amostra, menos os rascunhos parecem de robô.

**Conecte mais uma ferramenta — só pra ler.** Agenda, e-mail, planilha: comece deixando o
AIOS apenas LER, e anote em `connections.md`. Cada ferramenta que responde são pontos no
boletim.

## Nível 2 — quando já tiver ritmo (semanas 3 a 6)

**Transforme automação boa em skill.** Quando uma automação do `/automatizar` virar rotina,
dê um comando próprio a ela: uma pasta em `.claude/skills/` com cópia idêntica em
`.agents/skills/` (pra funcionar também no Antigravity), dizendo quando usar, o que faz e o
que ainda não faz.

**Crie um guia por ferramenta conectada.** Pra cada ferramenta que o AIOS alcança, um arquivo
em `references/` com o que ele pode e não pode fazer lá. Assim nenhuma sessão nova precisa
redescobrir.

**Deixe as automações confiáveis rodarem sozinhas.** Automação que passou uma semana sem erro
não precisa mais da sua aprovação a cada uso. Registre a mudança em `decisions/log.md`.

## Nível 3 — modo avançado (mês 2 em diante)

**Primeira rotina agendada.** Escolha uma automação que já roda sozinha e agende-a pra
disparar em horário fixo, usando o agendador de tarefas do computador (o "despertador" do
sistema: Agendador de Tarefas no Windows, ou equivalente no Mac).

**Resumo do dia.** A rotina agendada mais valiosa pra maioria: toda manhã, o AIOS junta
e-mails, agenda e pendências num resumo único que chega pronto, sem você pedir.

**Memória que atravessa semanas.** Mantenha `decisions/log.md` vivo (toda decisão com data e
porquê) e mova o que morreu pra `archives/` — nunca delete. Um AIOS que lembra não repete
pergunta nem refaz erro antigo.

**Nota 91+.** Com automações rodando sozinhas, rotina agendada e novas automações chegando,
o boletim fica **Em dia** — e pode ganhar o selo **⭐ Adiantado**. Aí a pergunta muda: o que
MAIS do seu negócio ele pode tocar com você?
