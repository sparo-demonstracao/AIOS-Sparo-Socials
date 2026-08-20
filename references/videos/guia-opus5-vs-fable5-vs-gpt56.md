# Guia de gravação — Opus 5 vs Fable 5 vs GPT-5.6

**Não é roteiro. São tópicos na ordem, pra você criar as frases na hora.**
Tese: a Anthropic lançou o modelo mais caro da história dela e, semanas depois, lançou um mais
barato que ganha dele. Prova com dado + teste ao vivo.

**Regra de linguagem:** todo termo técnico traduzido na 1ª vez, depois usa à vontade.
- Token → "unidade que a IA cobra, tipo minuto de ligação"
- Verboso → "fala demais, e você paga por palavra"
- Fallback → "um segurança na porta que passa o pedido pro modelo mais fraco"
- Benchmark → "prova padronizada, todo modelo faz a mesma"
- Harness → "o programa que pilota a IA — Claude Code, Codex"
- Agêntico → "a IA trabalhando sozinha por horas, sem você do lado"

---

## 1. HOOK [0:00–0:40] — rosto

- Anthropic lançou o modelo mais caro dela (Fable 5) e semanas depois um pela metade do preço (Opus 5)
- O mais barato **ganha** do mais caro — em prova de empresa de fora
- Promessa: 2 provas → gráfico lido junto + os 3 rodando ao vivo com cronômetro
- Gancho que segura até o fim: "no final falo qual eu uso de verdade — e o motivo não é o que você tá pensando"
- ⚠️ Falar "metade do preço **por token**" e traduzir token na hora
- ⚠️ NÃO dizer "assinatura" — é preço de API, não do plano mensal

## 2. PROVA VISUAL [0:40–0:55] — tela do gráfico, rápido

- Mostrar o gráfico por 10s antes de explicar qualquer coisa
- "É exatamente isso que a gente vai destrinchar juntos"

## 3. LIKE / INSCRIÇÃO [0:55–1:10]

- Fórmula de sempre, rápida, sem enrolar

## 4. ROADMAP [1:10–1:30]

- O que o vídeo cobre: o gráfico → os defeitos de cada um (na documentação oficial) → o ajuste que
  economiza dinheiro → o teste dos 3 ao vivo → qual eu uso

---

## 5. O GRÁFICO [1:30–3:00] — artificialanalysis.ai / Coding Agent Index

**Ordem das abas: Index → Cost → Execution Time. Segurar 3s em cada troca.**

- Quem é a Artificial Analysis: não vende IA, testa IA — "é tipo o Inmetro dos modelos"
- Não é múltipla escolha: tarefa de programação de ponta a ponta, mede se entregou funcionando
- **[Index]** Opus 5 = 67 · GPT-5.6 = 67 · Fable 5 = 66
  - o mais caro da Anthropic não é o melhor nem dentro da própria casa
- **[Cost]** Fable US$ 11,70 · Opus US$ 8,23 por tarefa
  - ~30% mais barato e resultado melhor — não é empate barato, é vitória mais barata
- **[Zoom no rótulo do Fable: "(max, with fallback)"]** ← o achado do vídeo, círculo na edição
  - traduzir fallback: segurança na porta, desvia pro modelo mais fraco no meio do caminho
  - o preço de 11,70 já inclui as vezes em que você pagou Fable e recebeu Opus
  - "guarda isso, volto nesse ponto em 2 minutos"
- **[Execution Time]** Opus e Fable ≈ 23 min · GPT-5.6 ≈ 10 min
  - honestidade: se o seu problema é tempo, a OpenAI ganha essa
- Ressalva de 10s: a prova mede a IA **junto com o programa que pilota ela** (Claude Code vs Codex) —
  parte da diferença é a ferramenta, não o cérebro
- ❌ NÃO falar "melhor modelo por esse preço" — o GPT empata por menos dinheiro

---

## 6. OS DEFEITOS [3:00–4:20] — rosto + 2 telas de documentação

**TELA A — doc do Opus 5 (Anthropic)**
- Forte dele: planejar, tarefa grande, refatoração, revisão
- A própria Anthropic avisa: responde mais longo, narra o que faz, se confere sozinho
- Tradução: **ele fala demais — e você paga por palavra**
- Número: 100 milhões de "palavras-máquina" contra média 63 milhões dos concorrentes → quase o dobro
- Plantar: "te mostro como travar isso em 30 segundos"

**TELA B — central de ajuda da Anthropic, artigo do fallback**
- Retomar o "segurança na porta" — agora escrito pela própria Anthropic
- Checagem automática a cada pedido; cibersegurança e biologia desviam pro modelo mais fraco
- Está escrito lá: em cibersegurança, **esperar taxa alta de desvio**
- Melhoraram 85% no lado da biologia; em segurança continua igual

**GPT-5.6**
- Também tem segurança na porta — não é defeito exclusivo da Anthropic, não vender peixe
- Forte dele: o relógio. Mesma nota, metade do tempo
- ⚠️ **Marcar em voz alta que o que vem agora é OPINIÃO, não documentação:** em trabalho agêntico
  longo, o GPT perde o fio da meada mais que o Opus na minha experiência. Não tenho gráfico, tenho vivência
- ❌ NÃO afirmar como fato que o GPT é pior como agente (dado público aponta o contrário)
- ❌ NÃO dizer que o Fable é "rápido na execução" (23,4 min)
- Se estourar o tempo: cortar o parágrafo do fallback do GPT

---

## 7. O AJUSTE QUE ECONOMIZA [4:20–5:00] — digitando ao vivo

- Trava a personalidade dele antes de começar: uma frase, uma vez
- **Prompt na tela (card pra printar):**
  > "Atue como um desenvolvedor sênior. Responda APENAS com o código solicitado. Seja extremamente
  > conciso. Sem explicações, introduções ou conclusões. Não adicione etapa de verificação — você já
  > verifica sozinho."
- O detalhe que quase ninguém sabe: a doc pede pra **tirar** o clássico "confira seu trabalho no final"
  - era boa prática nos modelos antigos; no Opus 5 ele confere 2x e te cobra as 2
- Avisar: **o prompt tá na comunidade grátis** (link na descrição)

---

## 8. TESTE 1 — uma IA fiscalizando a outra [5:00–6:40]

- A sacada não é escolher um modelo, é usar um pra fiscalizar o outro
- Colar código escrito pelo Opus 5 dentro do Fable 5, sem dizer quem escreveu
- Mostrar: onde ele apontou risco, a falha que achou, a função reescrita
- **Fecho do bloco (não cortar):** aqui o Fable justifica o preço — revisar não é tarefa longa, então
  os 23 min e o custo alto não pesam. A conta muda quando o trabalho é conferir, não construir
  - ↳ isso é o que impede o vídeo de virar linchamento de um modelo

## 9. TESTE 2 — mesmo pedido, 3 modelos [6:40–10:10]

- **Prompt na tela:**
  > "Crie um simulador 3D completo de uma montanha-russa rodando direto no navegador em um único
  > arquivo HTML autocontido. Use apenas HTML, CSS e JavaScript vanilla. Adicione um botão de
  > 'Iniciar Corrida', aplique física de aceleração nas curvas e texturas simples no chão e no céu."
- Cronômetro visível nos 3 — elemento visual mais forte do vídeo
- Os 3 são obrigatórios (você prometeu 3 na abertura)
- ⚠️ **NÃO decidir o resultado antes de rodar.** Narrar o que realmente aconteceu
- Voltar no gancho: o gráfico previu Opus ≈ Fable no tempo e GPT mais rápido → bateu ou não?
  - lembrar: 1 tarefa é amostra de 1; a prova padronizada roda centenas
- Carta na manga se o Opus ganhar no visual: na prova de imagem→site o Opus 5 é 1º com 1.669 pts,
  à frente do GPT-5.6 com 1.581

---

## 10. QUAL EU USO + VENDA [10:10–12:50] — rosto

- Responder a pergunta do começo: **uso os três**
- **Pico de autoridade (não cortar):** "aqui eu vou discordar do que todo mundo repete"
  - senso comum: GPT pro visual, Claude pra lógica → o dado não sustenta (imagem→site: Opus na frente)
- Minha divisão é por **momento do processo**, não por parte do sistema:
  - **Opus 5 constrói** — lógica e tela, os dois
  - **Fable 5 fiscaliza** — onde o preço dele faz sentido
  - **GPT-5.6 entra quando preciso testar rápido** — 10 min vs 23 muda o dia quando testo 10 versões
- Ponte pra venda (honesta): tela bonita gerada por IA não coloca dinheiro no bolso
- O que faz empresa pagar 10, 15, 20 mil é o que tá **atrás** da tela: banco de dados, CRM, n8n rodando sozinho
- CTA Masterclass completo — mencionar SEMPRE:
  - do básico ao avançado · sem escrever uma linha de código · comunidade paga dos alunos
    (dúvidas, networking, projetos valendo dinheiro todo mês) · 2 primeiros módulos grátis no YouTube
  - "primeiro link da descrição"

## 11. FECHO [12:50–13:15]

- Resumo em 30s: mais caro lançado antes, mais barato depois e ganhando; Opus pontua igual ou mais,
  custa ~30% menos por tarefa, e não tem o segurança na porta atrapalhando
- Com a verbosidade travada, hoje é a melhor compra da Anthropic
- Fecho fixo: like + comentário, se inscreve, "e se eu não te vir na comunidade, até o próximo vídeo"

---

## Checklist de edição
- [ ] Círculo/zoom no "(max, with fallback)"
- [ ] 3s parado em cada troca de aba do gráfico
- [ ] Card na tela com o prompt anti-verbosidade
- [ ] Cronômetro visível nos 3 modelos
- [ ] Não deixar a edição engolir a frase "isso é opinião minha, não documentação"
- [ ] 1 CTA de meio (máx.) + CTA final
