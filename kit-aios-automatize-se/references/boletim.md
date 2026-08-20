# Boletim do AIOS — a nota do que já está de pé

O Boletim é a régua que o `/analisar` usa. Ele responde duas coisas, nessa ordem:

1. **Nota (0 a 100):** quanto do seu AIOS já está de pé, de verdade, funcionando.
2. **Ritmo:** se isso está em dia com o tempo que ele tem de vida.

A nota é honesta: **AIOS recém-criado tira nota baixa, e está certo assim.** No dia em que
você termina o `/iniciar`, o seu AIOS conhece você — mas ainda não conectou nada e não
automatizou nada. A nota disso é 25, não 100. O que a idade dele diz é: **25 no dia 0 é
exatamente o esperado.** Nota baixa + ritmo em dia = você está indo bem.

Nota 100 é o AIOS do fim do primeiro mês: te conhece, alcança 3 ferramentas, tem 5
automações funcionando e uma rotina disparando sozinha.

## O caminho do primeiro mês

Cada semana soma com a anterior. Ao lado, a nota que se espera até ali:

| Idade | O que já deveria estar de pé | Nota esperada |
|---|---|---|
| **Dia 0 a 6** | O AIOS sabe quem você é, o que você vende, suas metas, sua voz e seus limites | **25** |
| **Dia 7 a 13** | + 1ª ferramenta conectada e respondendo + 1ª automação funcionando | **41** |
| **Dia 14 a 20** | + 2ª ferramenta + 2ª e 3ª automações | **58** |
| **Dia 21 a 29** | + 3ª ferramenta + 4ª automação + 1 automação rodando sem pedir sua aprovação | **80** |
| **Dia 30 em diante** | + 5ª automação + 1 rotina disparando sozinha no horário + boletins salvos | **100** |
| **Depois do 1º mês** | Manter tudo funcionando + pelo menos 1 automação nova por mês | **manter 100** |

Ou seja: **investindo um tempo por semana, em 30 dias você tem um assistente com cerca de 5
automações fazendo o trabalho do seu jeito.**

## De onde saem os 100 pontos

**1. Ele te conhece? (25)**
Contexto preenchido sem campos vazios (10), metas com número e prazo (5), pelo menos 2
trechos reais escritos por você em `references/voz.md` (5), decisões anotadas no último mês (5).

**2. Ele alcança suas ferramentas? (25)**
Cada ferramenta que responde quando ele testa na hora vale 7 pontos, até 3 ferramentas (21).
Mais 4 pontos quando a sua lista de ferramentas (`connections.md`) bate com a realidade — ou
seja, nada anotado lá como conectado que na hora do teste não responde.

**3. Ele entrega trabalho? (25)**
Cada automação construída **e usada de verdade** vale 5 pontos, até 5 automações.

**4. Ele roda sozinho? (25)**
1 automação rodando sem pedir sua aprovação (10), 1 rotina disparando sozinha no horário
marcado, com prova de que disparou (10), pelo menos 1 boletim salvo em `boletins/` (5).

**A regra que vale pra tudo: só conta o que funciona.** Ferramenta anotada que não responde
no teste vale zero. Automação que nunca rodou vale zero. Promessa não vale ponto.

## Como ler o ritmo

O ritmo compara a sua nota com a nota esperada pra idade do seu AIOS (tabela acima):

| Ritmo | Quando aparece |
|---|---|
| **⭐ Adiantado** | A nota passou do esperado pra idade |
| **Em dia** | A nota bateu o esperado |
| **Quase lá** | Faltou pouco (70% ou mais do esperado) |
| **Correndo atrás** | Metade do caminho — dá pra recuperar numa sentada |
| **Atrasado** | O AIOS parou no tempo: existe, mas não andou |

Um exemplo: nota 25 no dia 2 é **Em dia**. A mesma nota 25 no dia 25 é **Atrasado**.

## Como usar

- Rode o `/analisar` no dia 7 — o primeiro boletim que cobra alguma coisa — e depois sempre
  que quiser saber se está no ritmo.
- Deixe ele salvar os boletins em `boletins/`. É a série que mostra a sua evolução.
- Todo boletim termina com os 3 próximos passos, cada um com quantos pontos devolve. Faça o
  primeiro da lista e a próxima nota agradece.

---

© 2026 Enzo Barbatto. Todos os direitos reservados. Boletim do AIOS é marca de Enzo
Barbatto. Uso conforme o arquivo `LICENSE` do kit.
