# Módulo 9 · Roteiro de Gravação — Atendente de IA no WhatsApp (Clínica de Estética)

> Script com explicação + prompts. **L2 (rascunho pra sua revisão).** Mesma estrutura do
> `aulas-finais-script.md`. **Esta é a Aula 9.1**, escrita primeiro como referência de qualidade —
> valide antes de eu gerar as 7 restantes.

## A virada (a espinha)

Todo o módulo constrói UM sistema: um atendente de IA que **atende e vende 24/7 no WhatsApp** de uma clínica de estética, que o aluno **instala e cobra** (~R$ 8k).

Cada aula responde a uma pergunta, nesta ordem:

1. Ele pensa como gente? (cérebro: persona + memória — 9.1 a 9.3)
2. Ele entende áudio e foto? (os sentidos — 9.4)
3. Ele fala pelo WhatsApp? (o canal — 9.5)
4. Ele vende, agenda e sabe a hora de me chamar? (9.6 e 9.7)
5. Ele aguenta o mundo real e me dá lucro? (blindar, reaproveitar, cobrar — 9.8)

Regra de ouro do módulo inteiro: **um chatbot responde; um agente resolve.** (percebe → decide → age)

## Ordem de execução

Primeiro o **cérebro**, no sandbox, longe do WhatsApp — provar o motor na bancada antes de botar na rua. Só quando ele já pensa, sabe e percebe é que entra o **canal** (WhatsApp). Vender, painel e produção por último, quando já existe um sistema pronto pra atacar e pra revender.

Faça nesta ordem. Conectar o WhatsApp cedo, num agente vazio, só adianta a parte chata e atrasa o "uau".

## Parte 1 — O cérebro (aulas 9.1 a 9.4)

### 9.1 - O que é um agente + a "cabeça" dele (o documento que a clínica preenche)

**Tópico:** entender o que é um agente de IA (e a diferença pra tudo que o curso já construiu), entender por que ele precisa de uma **base de conhecimento**, e só então gerar o **documento-modelo** que a clínica preenche com os dados reais. A aula segue essa ordem: primeiro o conceito, depois o porquê, depois o prompt. *(No exemplo: ⏳ a fazer ao vivo — gerar o modelo e mostrar o preenchido.)*

**O que o aluno aprende (na ordem da aula):**
- **1º — O que é um agente:** percebe → decide → age. A automação (M1) segue um trilho fixo — sempre os mesmos passos; o app (M7) espera o clique. O **agente decide o próximo passo sozinho** — por isso serve pra conversa, onde a entrada é imprevisível. E por baixo é um **app real, igual ao Lead-se** (backend + Supabase + deploy com push).
- **2º — Por que ele precisa de uma base de conhecimento:** ela é o **"prompt" do agente**. É dela que ele tira **como responder da melhor forma** (só com informação VERDADEIRA da clínica) e **quando usar cada ferramenta** (pergunta de preço → consulta a tabela; pedido de horário → agenda; pergunta médica → chama humano). Agente sem base de conhecimento **inventa**.
- **3º — Quem escreve a verdade é a clínica, não a IA.** Seu papel é FACILITAR: gerar com o Claude Code um **modelo bem estruturado** (esboço com as seções prontas) e mandar a clínica só **preencher** — ela não escreve do zero. A IA monta o esqueleto; a clínica põe a verdade.

**Prompt(s) pra enviar:**

Quando: Na parte prática, SÓ DEPOIS de explicar o que é um agente e por que ele precisa da base de conhecimento (senão o aluno gera um documento sem entender pra que serve). Gera o documento-modelo que você vai ENVIAR pro cliente preencher. Não é pra IA inventar os dados da clínica; é pra ela montar a ESTRUTURA. Pule se você já tem um modelo desses pronto.

```
Cria um DOCUMENTO-MODELO (um esboço genérico e bem organizado) da base de conhecimento de uma [clínica de estética], pra eu ENVIAR pro meu cliente preencher com os dados reais dele. NÃO invente os dados da clínica -- use exemplos entre [colchetes] que ele troca. Organize em seções claras:
- Sobre a clínica (nome, endereço, horários, contato, profissionais);
- Serviços, preços e duração (em tabela);
- Perguntas frequentes, com as respostas;
- Políticas (agendamento, remarcação/cancelamento, atraso, pagamento, cuidados antes/depois);
- Regras do atendente (o que ele NÃO responde, quando chama um humano, o tom).
Deixe cada campo fácil de preencher e explique em uma linha o que vai em cada seção, pra clínica não ter que escrever do zero.
```

**Passos no vídeo (na ordem da gravação -- o prompt entra no passo 6):**

1. Abra mostrando o vilão ao vivo: um chatbot de menu ("digite 1... digite 2") recebendo um áudio ou pergunta torta, e travando. Frase: *"isso é um cartaz, não um atendente."*
2. Logo na sequência, a **promessa do módulo**: *"neste módulo a gente constrói um atendente de IA que atende e vende 24/7 no WhatsApp -- e no fim você instala numa clínica de verdade e cobra uns R$ 8 mil por isso."* Se o sistema já estiver pronto quando você gravar (vale gravar esta abertura por último), mostre 30 segundos dele funcionando: chega um áudio, ele responde certo e agenda. É o "uau" que segura o aluno pelas 8 aulas.
3. Explique **o que é um agente**, devagar: o loop **percebe → decide → age**. Compare com o que o curso já construiu: a automação (M1) segue um trilho fixo -- sempre os mesmos passos, na mesma ordem; o app (M7) fica parado esperando o clique. O agente **decide o próximo passo sozinho** -- por isso é o certo pra uma conversa. Dê o alívio: *"por baixo é um app igual ao Lead-se, que você já fez."*
3. Mostre a régua "fora da caixa" na tela (conversa natural · conhece a clínica · age · lembra · chama humano) -- o mapa do módulo. Aponte o item **"conhece a clínica"**: é a ponte pro resto da aula.
4. Explique **por que ele precisa de uma base de conhecimento**: sem ela, o agente INVENTA (preço errado, promessa que a clínica não faz). A base é o **"prompt" do agente**: é dela que ele tira **como responder** (só com a verdade da clínica) e **quando usar cada ferramenta** -- perguntaram preço? consulta a tabela. Pediram horário? agenda. Pergunta médica? chama um humano. *"O agente é só tão bom quanto esse documento."*
5. AGORA rode o prompt e gere o **documento-modelo** ao vivo. Mostre que a IA fez a ESTRUTURA com [colchetes] -- sem inventar dado de clínica nenhum.
6. Explique como o aluno usa: **manda o modelo pro cliente** (WhatsApp/e-mail), a clínica só troca os [colchetes] pelos dados reais e devolve. *"Ela não escreve do zero -- só preenche."*
7. Mostre o **exemplo já preenchido** (a Clínica Renove, fictícia, do material da aula) pra dar o resultado esperado. Feche: *"esse documento é a cabeça do atendente. Na 9.3 ele passa a responder SÓ com o que está aqui -- e a saber a hora de agendar e a hora de te chamar."*

**Pra qualquer projeto:** a base de conhecimento é o **"prompt" do agente**: dela ele tira o que responder e quando usar cada ferramenta. A IA monta o esqueleto (o modelo), o cliente preenche a verdade -- **nunca peça pra IA inventar os dados do negócio.**

---

> **Fecham o MÓDULO (na última aula, como no M8):** o **Checklist final** (o que o aluno leva pra qualquer projeto) e a **frase-âncora** — *"um chatbot responde; um agente resolve: ele ouve, sabe, agenda e sabe a hora de te chamar."*
