---
name: roteiro-aula
description: Use quando o Enzo pedir pra PLANEJAR / ESTRUTURAR o que falta no curso (o que ainda precisa ser ensinado pra fechar o objetivo final), ou pra ROTEIRIZAR / ESCREVER / CRIAR o roteiro de uma aula da MasterClass de Automação (Claude Code + Antigravity). Cobre dois modos sobre a base references/masterclass/. (1) PLANO — analisa todo o conteúdo do curso contra o objetivo final, acha o que falta e estrutura as próximas aulas (cada uma ensina UM conceito). (2) ROTEIRO — gera o roteiro de gravação de uma aula no formato fixo do Enzo, INCLUINDO os prompts que ele deve enviar pra IA durante a gravação (leigo entende, mas com domínio técnico do assunto). Dispare mesmo sem a palavra "skill", ex.: "o que falta no curso?", "estrutura as próximas aulas", "faz o roteiro da aula de X", "me dá os prompts pra gravar a aula de Y", "monta o roteiro do módulo Z".
bike-method-phase: 1  # Phase 1 — Training wheels. Rode na mão, valide UMA aula antes de gerar em lote.
three-ms-attribution: |
  Adapted from The Three Ms of AI™ © 2026 Nate Herk.
---

## O que esta skill faz

Transforma a sua dor nº 1 — **roteirizar as aulas** — em rascunho assistido. Você traz o tema (ou
aponta uma transcrição) e a skill devolve um roteiro de gravação **no seu formato fixo**, pronto
pra você revisar e gravar. Autonomia **L2 (Drafted)**: a IA rascunha, você decide e edita. A
gravação e o julgamento final são sempre seus.

Dois modos:

1. **PLANO do curso** — lê toda a base `references/masterclass/`, entende o **objetivo final** do
   curso, acha **o que falta** pra chegar lá, e estrutura as **próximas aulas** em ordem. Cada aula
   carrega **um conceito** que o aluno tem que sair sabendo. Saída: `references/masterclass/plano-curso.md`.

2. **ROTEIRO de uma aula** — pega uma aula (do plano ou um tema avulso) e escreve o roteiro completo
   no formato de gravação, **com os prompts pra enviar à IA durante a aula**. Saída: um Markdown novo
   em `references/masterclass/`.

## O que esta skill NÃO faz

- **Não grava nem decide sozinha.** É L2 — rascunho pra você revisar. Nunca publica nem assume que o
  roteiro está fechado.
- **Não inventa conteúdo que contradiz o curso.** Se a base não cobre um assunto, a skill **sinaliza
  a lacuna** em vez de chutar. *(Boring is Beautiful — não preenche buraco com invenção.)*
- **Não transcreve aulas.** A transcrição é peça separada e já resolvida — receita na memória
  `transcricao-local-whisper` (Whisper na GPU). Esta skill **consome** as transcrições que já existem.
- **Não gera o curso inteiro de uma vez no primeiro uso.** Bike Method Fase 1: gera **UMA** aula,
  você valida a qualidade, e só então parte pro lote. *(Validation Chain.)*

## Entradas que a skill lê (sempre, antes de escrever)

| Fonte | Pra quê |
|---|---|
| `references/masterclass/INDICE.md` | mapa do curso: módulos, status, o que já foi transcrito |
| `references/masterclass/modulo-*.md` | conhecimento de cada módulo (resumo + decisões travadas) |
| `references/masterclass/transcricoes-modulo-*/` | as aulas reais — voz, pedagogia, continuidade |
| `references/masterclass/aulas-finais-script.md` | **o template de formato** (replicar fielmente) |
| `references/masterclass/aulas-finais-roteiro.md` | o estilo "roteiro de lógica" (princípio + no projeto) |
| `references/voice.md` | registro do Enzo |
| `context/about-me.md` + `context/about-business.md` | quem é o aluno e o **objetivo final do curso** |

## O objetivo final do curso (a régua do PLANO)

Ensinar **leigos em programação** a criar automações, apps e sistemas **sem escrever código**, com
Claude Code + Antigravity — do **protótipo** (funciona pra mim) ao **produto** (um estranho paga e
usa sozinho). O fio condutor são **projetos práticos do zero**. Toda aula nova é avaliada por:
*"isso aproxima o aluno leigo de construir e cobrar por um app real?"* Se não aproxima, corta ou
adia. *(Confirme a régua relendo `about-me`/`about-business` a cada rodada — ela pode evoluir.)*

## Modo PLANO — como rodar

1. Leia INDICE + todos os `modulo-*.md` + a estrutura das transcrições. Mapeie **o que já foi
   ensinado** (por módulo/aula).
2. Compare com o objetivo final. Liste **as lacunas**: conceitos que o aluno precisa e que o curso
   ainda não cobre (ou cobre raso).
3. **Honestidade de cobertura (sem teto silencioso):** os Módulos 1-6 ainda não estão transcritos
   (ver INDICE). Diga isso em voz alta — o plano é **parcial** até elas existirem, e fica mais
   afiado a cada transcrição que entra. Nunca dê a entender que cobriu tudo.
4. Estruture as **próximas aulas em ordem** (cada passo destrava o seguinte, como no
   `aulas-finais-roteiro.md`). Pra cada aula proposta:
   - **Título** da aula
   - **O conceito** que o aluno aprende (UM, central)
   - **Por que agora** (qual lacuna fecha / o que destrava)
   - **Pré-requisito** (qual aula tem que vir antes)
5. Escreva em `references/masterclass/plano-curso.md`. **Pare e mostre** pro Enzo aprovar a ordem
   antes de roteirizar qualquer aula.

## Modo ROTEIRO — o formato fixo (replicar fielmente)

Cada aula segue **exatamente** a estrutura do `aulas-finais-script.md`:

```
### [Código da aula] - [Título curto]

**Tópico:** [uma frase: o que essa aula coloca no ar / resolve]

**O que o aluno aprende:**
- [o CONCEITO central — o que tem que ficar na cabeça]
- [3-4 bullets, princípio universal antes do detalhe do projeto]

**Prompt(s) pra enviar:**

Quando: [em que ponto da gravação esse prompt entra, e por quê. Diga quando PULAR também.]

​```
[O prompt que o Enzo manda pra IA AO VIVO. Linguagem de leigo — sem jargão solto — mas
demonstrando domínio técnico do assunto da aula. Use [colchetes] pro que muda por projeto.]
​```

**Passos no vídeo (depois do prompt):**

1. [passo concreto, na ordem de execução]
2. [...]

**Pra qualquer projeto:** [a generalização — o princípio reutilizável que o aluno leva embora]
```

No fim do conjunto de aulas (módulo), adicione uma **frase-âncora** que resume tudo, no estilo do
`aulas-finais-script.md` (ex.: *"protótipo é o que funciona pra mim; produto é o que funciona pra
um estranho que me paga"*).

## Os prompts de gravação — a régua (isto é o coração do pedido do Enzo)

Cada aula entrega **os prompts que o Enzo deve enviar à IA durante a gravação**, e eles têm que:

- **Ser entendíveis por um leigo** — frase direta, zero jargão jogado sem explicar. O aluno tem que
  conseguir copiar e adaptar pro app dele.
- **Demonstrar domínio técnico do assunto daquela aula** — o prompt mostra que quem escreveu sabe
  o que está pedindo (cita o conceito certo, antecipa o gotcha, delimita o escopo: "não encosta nas
  chaves de API, só nos IDs dos planos").
- **Vir com "Quando:"** — o contexto de quando disparar na aula, e quando pular.
- **Usar [colchetes]** pro que o aluno troca pelo stack dele.
- **Pedir explicação, não só execução** (Curiosity Rule): quando fizer sentido, o prompt manda a IA
  explicar pra leigo o risco/o porquê antes de mexer — como nos prompts de auditoria de segurança.

## Regras de qualidade

1. **Um conceito por aula.** Se a aula tenta ensinar três coisas, quebre em três aulas (Function
   Breakdown).
2. **Princípio antes do projeto.** Ensine a regra universal e *depois* mostre como ela aparece no
   app de exemplo — é o que faz o roteiro reaproveitável (estilo `aulas-finais-roteiro.md`).
3. **Na voz do Enzo.** Frases curtas, direto, "você/seu/sua" (nunca "tu/teu"), sem gíria técnica
   solta. Ver `voice.md`.
4. **Continuidade.** Conecte cada aula nova ao que já foi ensinado nos módulos transcritos. Não
   repita o que aula anterior já cobriu; referencie.
5. **Sinalize lacuna em vez de inventar.** Se falta base pra escrever bem uma aula, diga o que falta
   transcrever/decidir e pare.
6. **Valide UMA antes do lote.** Gere um roteiro, mostre pro Enzo, ajuste o que ele apontar — só
   depois replique o padrão pras outras aulas (Bike Method Fase 1 + Validation Chain).

## Saída

- **Plano:** `references/masterclass/plano-curso.md`.
- **Roteiro:** `references/masterclass/roteiro-modulo-XX-<nome-curto>.md` (siga a convenção do INDICE;
  registre o módulo novo na tabela do INDICE quando fechar).
- Sempre **Markdown**, no formato acima, pronto pra revisão. Nunca grava direto como "final".

## KPI (por que isto existe)

Bucket 1 (mais clientes) + Bucket 3 (menos custo do seu tempo). Métrica: **tempo do tema até o
roteiro pronto pra gravar** — de horas pra minutos de rascunho + uma passada de revisão. Sustenta a
meta de **8 vídeos/mês** e a produção do curso (→ R$70k/mês).

---

> *Adapted from The Three Ms of AI™. © 2026 Nate Herk. All rights reserved.*
> *The Three Ms of AI™ is a trademark of Nate Herk.*
