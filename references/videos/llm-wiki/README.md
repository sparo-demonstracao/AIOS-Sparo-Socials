# Telas de apoio — vídeo "LLM Wiki"

Arquivo único: `telas.html`. Abre no Chrome, aperta **F** (tela cheia) e grava.
Escala sozinho pra qualquer resolução — o palco é 1920×1080 e fica centralizado.

## Controles

| tecla | o que faz |
|---|---|
| `→` / `espaço` / clique | avança um beat |
| `←` | volta |
| `1` / `2` | pula pra tela 1 ou 2 |
| `F` | tela cheia |
| `H` | mostra/esconde a ajudinha e a barra de progresso |
| `R` | volta pro começo |

A ajudinha do canto some sozinha em 5 segundos.

## Onde entra no roteiro

Só dois momentos. O resto é tela real — Obsidian, terminal, a graph view do seu vault.
Não use essas telas onde dá pra mostrar a coisa funcionando.

| minuto | trecho | o que fazer |
|---|---|---|
| **0:00–0:40** | gancho | **Tela 1, beat 0**. Você em cena falando do problema, e essa tela como corte de apoio. |
| 0:40–3:15 | conceito | **Tela 1, beats 1→4**. É aqui que ela trabalha de verdade: você explica o método antes de abrir qualquer ferramenta. Sai da tela no beat 4. |
| 3:15–5:39 | por que importa | Volta pra sua cara. Sem tela. |
| 5:39–13:02 | setup, ingestão, fluxo | **Nada de tela.** Grava Obsidian e terminal de verdade. A graph view antes/depois da ingestão é o melhor visual do vídeo — não substitua por desenho. |
| **~13:02** | comparação com RAG | **Tela 2 inteira, beats 0→3**. Volta pra tela real logo depois. |
| 13:02–17:20 | consulta e manutenção | Tela real de novo. |
| final | CTA | Você em cena. |

Somando: a tela 1 fica no ar ~2 min, a tela 2 ~1 min. Menos de 20% do vídeo. É esse o ponto —
elas existem só onde não há o que filmar.

## Tela 1 — o método (5 beats)

| beat | o que aparece | o que falar |
|---|---|---|
| 0 | "Você aprende uma coisa. Fecha a aba. E esquece." | O problema. Deixa a frase respirar antes de falar. |
| 1 | passo 1 · joga tudo numa pasta | "O primeiro passo é ridículo de simples: você só joga o material lá dentro." |
| 2 | passo 2 · a IA lê e organiza | "Aí você pede em português. Ela lê tudo e separa por assunto." |
| 3 | passo 3 · vira páginas ligadas | "E vira isso: páginas curtas, uma puxando a outra." |
| 4 | cresce sozinho | "Cada coisa nova deixa tudo que já estava lá mais fácil de achar." |

## Tela 2 — RAG vs Wiki (4 beats)

| beat | o que aparece | o que falar |
|---|---|---|
| 0 | só o título | "Quem já mexeu com IA vai perguntar: mas isso não é RAG?" |
| 1 | lado RAG | "RAG pica o texto em pedacinhos e devolve os 3 mais parecidos com a sua pergunta." |
| 2 | lado Wiki | "O wiki guarda o texto inteiro e liga uma página na outra. Ela segue os links." |
| 3 | remate | "RAG procura pedaço. Wiki entende o assunto." E lê a ressalva — ela te dá credibilidade. |

## A ideia visual

Simples de propósito, porque o público é leigo. As regras:

- fundo claro `#F6F4EF`, texto quase preto, **uma** cor de destaque (`#D9481F`)
- **zero cartão, zero sombra, zero canto arredondado** (`border-radius:0` no reset)
- monoespaçada só em nome de arquivo e no pedido pra IA — o resto é Archivo
- pouco texto por tela, tipo grande, muito espaço vazio
- um beat = uma ideia nova na tela, nunca duas

Se for editar: cartão branco com sombra, grade de fundo, tabela comparativa e terminal
cheio de linha verde são justamente o que fazia parecer complicado. Não volte com eles.

As fontes vêm do Google Fonts — se for gravar sem internet, os fallbacks entram e o layout
muda um pouco. Testa antes.
