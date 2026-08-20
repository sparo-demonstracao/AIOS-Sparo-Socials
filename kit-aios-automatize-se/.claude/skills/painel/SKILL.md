---
name: painel
description: Cria ou atualiza a Central de Comando — o Painel do Dono; uma página que o usuário abre no navegador e vê o negócio inteiro numa tela só; todas as conexões, automações e capacidades do AIOS, com recomendações e decisões recentes — e abas novas no menu pra cada automação que merecer uma tela própria. Use quando o usuário disser "/painel", "painel do dono", "central de comando", "quero ver meu negócio numa tela", "atualiza o painel", "abre o painel", "cria uma aba pra isso".
---

# /painel — a Central de Comando

Este comando cria (ou atualiza) o **Painel do Dono**: um conjunto de páginas em `painel/`,
começando pela `painel/index.html`, que o usuário abre no navegador e enxerga tudo que o
AIOS dele faz — conexões, automações, capacidades, recomendações. Re-rodável: cada `/painel`
refaz as páginas com os dados de agora.

## Passo 1 — Juntar os dados (só o que é REAL)

Leia o que existir e monte o inventário:

1. `CLAUDE.md` — nome do dono, nome do negócio, prioridades, maior dor.
2. `connections.md` — **todas as conexões**, agrupadas por domínio (Receita, Clientes,
   Agenda, Comunicação, Tarefas, Conhecimento…). Ferramenta de anotações/segundo cérebro
   (Obsidian, Notion) entra como conexão do domínio **Conhecimento**.
3. `.claude/skills/` — **todas as capacidades** (os comandos), com nome e o que fazem.
4. `decisions/log.md` — automações entregues e as **decisões recentes** (data + título).
5. `tarefas.md`, `boletins/` — pendências e o último boletim (nota, próximos passos).
6. Qualquer automação agendada que você criou (o que roda sozinho, quando, última execução
   se souber) — e o que cada uma PRODUZ (relatórios, rascunhos, planilhas).

**Regra de ouro: nunca invente número nem status.** Conexão que não foi testada aparece como
"a conectar", não como "conectado". Seção sem dado vira convite ("Rode /analisar pra ver seus
próximos passos aqui"), nunca zero falso.

## Passo 2 — Montar a página principal (o padrão visual)

`painel/index.html`, **sem depender de internet** (CSS e scripts embutidos). Visual de
produto profissional, não de rascunho:

- **Clima:** fundo quase preto azulado, cards escuros com borda sutil e cantos arredondados,
  texto claro, UM tom de destaque (laranja) + apoios discretos. Números grandes em fonte
  mono. Status em "pílulas" coloridas: verde = ativa/conectado · azul = sob demanda ·
  cinza = desligada · laranja = atenção/a conectar.
- **Barra lateral** (esquerda, igual em todas as páginas): nome do AIOS no topo, menu com a
  página Painel, as seções (Automações, Capacidades, Conexões, Decisões), **as abas das
  automações que têm tela própria** (com contador quando houver pendência), e o rodapé com
  o negócio e o nome do dono.
- **Topo:** campo "Perguntar ao AIOS…" (decorativo), selo "AIOS: Ativo" e a data de hoje.
- **Herói "Central de Comando":** título grande, subtítulo "Tudo que seu AIOS faz por você —
  num lugar só", e 3–4 números grandes: automações ligadas, capacidades, conexões, e a
  última rotina que rodou. Um fundo com efeito de constelação/rede (canvas simples) dá vida
  — sem exagerar.
- **Recomendações do AIOS:** 3–5 itens gerados dos dados reais, cada um com etiqueta de
  prioridade (ALTA / MÉDIA / INFO). Exemplos: pendência esperando revisão, conexão ainda
  não ligada, "/analisar não roda há X dias", a próxima automação candidata (da maior dor
  ou de `tarefas.md`).
- **Fileira de indicadores:** 4–6 cartões pequenos com número grande + rótulo.
- **Central de Automações (tabela):** uma linha por automação — nome, status (pílula),
  gatilho ("todo dia às 8h", "sob demanda"), última execução e resultado. Na v1 o painel é
  de LEITURA: em vez de botão "rodar", mostre o comando que dispara ("peça /automatizar no
  chat"). Nada de botão que finge funcionar.
- **Capacidades (grade):** um cartão por comando — nome e `/comando` em fonte mono.
- **Conexões (lista):** agrupadas por domínio, cada uma com a pílula
  "conectado" / "a conectar".
- **Decisões recentes:** as últimas 5 do `decisions/log.md` — data, título e a primeira
  linha, mais recente primeiro.

## Passo 3 — Abas próprias por automação (o painel cresce junto)

**Sempre que uma automação produzir algo que o dono precisa VER ou revisar, ela ganha uma
aba própria** — uma página `painel/<nome>.html` + o item no menu lateral de TODAS as
páginas. Exemplos do que merece aba:

- Relatório semanal de vendas → aba "Vendas" mostrando o relatório mais recente (e os
  anteriores numa lista).
- Rascunhos esperando revisão (respostas, mensagens, posts) → aba com os rascunhos, um
  card por item, com contador de pendentes no menu.
- Agenda/confirmações do dia seguinte → aba com a lista do dia.

Critério simples: **saída que o dono olha toda semana = aba; tarefa silenciosa = só a linha
na tabela de automações.** Quando criar uma automação nova (`/automatizar`) que se encaixe
no critério, crie a aba na mesma entrega — e avise: "criei a aba X no seu painel". Cada aba
segue o mesmo visual e a mesma barra lateral da página principal.

## Passo 4 — Entregar

1. Salve tudo em `painel/` (crie a pasta se não existir).
2. **Abra a página no navegador pro usuário** — quem faz isso é você; nunca peça pra ele
   abrir arquivo na mão.
3. Diga em uma frase o que entrou de novo desde a última versão (primeira vez: o que entrou
   e o que ainda falta conectar).

## Regras

- Linguagem leiga: "painel", "página", "aba", "cartão" — nunca "HTML", "frontend",
  "componente".
- O usuário nunca abre terminal nem edita arquivo: ele digita `/painel` e olha a tela.
- O painel mostra; a conversa faz. Toda ação continua sendo pedida no chat.
- Visual sóbrio e legível vence enfeite: se uma seção não tem dado, convite curto no lugar.
- Este comando faz parte do **AIOS Sparo** (produto completo).
