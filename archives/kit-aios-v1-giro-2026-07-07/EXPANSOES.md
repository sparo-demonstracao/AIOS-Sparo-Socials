# EXPANSÕES — pra onde o seu AIOS cresce

O kit é o primeiro dia de trabalho do seu funcionário digital, não o teto dele. Este guia lista
o que adicionar conforme ele amadurece — do mais fácil ao mais avançado. Regra de sempre: **uma
expansão por vez**, e só depois que o que já existe estiver rodando. Na dúvida sobre qual vem
primeiro, rode `/raio-x`: os 3 tratamentos urgentes já apontam a próxima expansão.

## Nível 1 — primeiras semanas (minutos de esforço)

**Engorde a Lista de Pepitas.** Toda vez que a Pergunta de Alavanca disparar ("quanto disso a IA
carrega pra mim?"), anote a tarefa em `pepitas.md`. Lista gorda = giros melhores. Custa 30
segundos por pepita.

**Cole mais amostras de voz.** Colocou só 2 trechos no começo? Adicione mais e-mails e mensagens
reais em `references/voz.md`, de situações diferentes (cliente, cobrança, parceiro). Quanto mais
amostra, menos os rascunhos parecem de robô.

**Conecte mais uma ferramenta — só leitura.** Agenda, e-mail, planilha: comece deixando o AIOS
apenas LER e anote em `connections.md` o nível de acesso e a data do teste. Cada ferramenta
respondendo ao vivo são pontos na chapa Alcance.

## Nível 2 — quando já tiver ritmo (semanas 3 a 6)

**Uma skill nova por pepita resolvida.** Quando um `/giro-semanal` entregar uma automação que você
usa toda semana, transforme-a numa skill própria — uma pasta em `.claude/skills/` com cópia
idêntica em `.agents/skills/`, pra funcionar também no Antigravity — com gatilho claro e o
registro de 3 linhas: o que faz · como rodar · o que ainda não faz.

**Crie um guia por ferramenta conectada.** Pra cada ferramenta que o AIOS alcança, um arquivo em
`references/` com o que ele pode e não pode fazer lá, e os detalhes de acesso. Assim qualquer
sessão nova já sabe operar sem você explicar de novo.

**Promova automações de degrau.** Automação que rodou uma semana sem susto sobe um degrau na
Escala de Confiança: de Junto pra Rascunho, de Rascunho pra Sozinho. Registre a promoção em
`decisions/log.md` — é isso que pontua no Pulso.

## Nível 3 — modo avançado (mês 2 em diante)

**Primeira rotina agendada.** Escolha uma automação já no degrau Sozinho e agende pra rodar em
horário fixo usando o agendador de tarefas do seu computador (o "despertador" do sistema: Agendador
de Tarefas no Windows, ou equivalente no Mac). É o batimento próprio do AIOS — a chapa Pulso.

**Resumo do dia.** A rotina agendada mais valiosa pra maioria: toda manhã, o AIOS junta e-mails,
agenda e pendências num resumo único que chega pronto, sem você pedir. Você começa o dia
decidindo, não caçando informação.

**Memória que atravessa semanas.** Mantenha `decisions/log.md` vivo (toda decisão com data e
porquê) e mova o que morreu pra `archives/` — nunca delete. Um AIOS que lembra o que já foi
decidido não repete pergunta nem refaz erro antigo.

**Faixa Sócio.** Com várias automações no Sozinho, rotinas disparando no horário e o giro semanal
em dia, o Raio-X chega aos 89 pontos ou mais: o AIOS aparece antes de você pedir. Aí a expansão vira outra:
o que MAIS do seu negócio ele pode tocar com você?
