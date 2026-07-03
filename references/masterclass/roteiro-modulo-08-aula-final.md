# Módulo 8 · Aula 8 — O Teste do Estranho (a varredura final)

> **Roteiro de gravação — L2 (rascunho pra sua revisão).** Fecha o Lead-se como MVP pronto pra
> produção e encerra o projeto. Formato: explicação pro aluno + prompt(s) + passos, como no
> `aulas-finais-script.md`. A Aula 7 terminou anunciando "varredura de segurança" — esta aula
> honra o teaser e amplia: a varredura é de segurança E de acabamento.
>
> **Duração estimada:** ~20–25 min gravados. Se preferir, corta em dois vídeos no meio
> (8.1–8.3 = acabamento · 8.4–8.5 = blindar e fechar), mas o arco é um só.

## A virada da aula (o que abre o vídeo)

Na aula passada o app foi pro ar: domínio próprio, e-mail da empresa e pagamento de verdade.
Mas "no ar" não é a mesma coisa que "pronto". Pronto é quando **um estranho** — alguém que você
não conhece e que não pode te chamar no WhatsApp — consegue percorrer a jornada inteira sozinho:

1. **Entrar** — criar a conta e receber o e-mail de confirmação.
2. **Virar cliente** — estourar o grátis e ser levado pro upgrade.
3. **Confiar** — pagar num checkout com a cara do produto.
4. **Não conseguir abusar** — nem ver dado dos outros, nem forjar pagamento, nem torrar seu crédito.
5. **Dar lucro** — o preço dele cobre o custo dele.

Esta aula percorre essa jornada de ponta a ponta e fecha cada porta que ainda está aberta.
No fim, o protótipo virou produto — e o projeto está encerrado.

**O conceito central (o que fica na cabeça):** *o Teste do Estranho — produto pronto é aquele em
que a jornada completa de um desconhecido funciona, converte e resiste sem você por perto.*

---

## 8.1 - O estranho consegue ENTRAR (e-mail de sistema via Resend no Supabase)

**Tópico:** trocar o e-mail de teste do Supabase por SMTP próprio (Resend) saindo do seu domínio. *(No Lead-se: ⏳ a fazer ao vivo — é o passo A4 do plano original, que não entrou na Aula 7.)*

**A imagem que o aluno tem que formar (ensine com esta analogia):** a empresa agora tem **duas bocas de e-mail**, e elas não têm nada a ver uma com a outra:
- **A recepção** — `atendimento@leadse.com.br` (o Zoho da aula passada). Um cliente escreve, **um humano** lê e responde. Pronta. ✅
- **O porteiro automático** — o e-mail que **o app manda sozinho**, sem ninguém digitar: "confirme sua conta", "redefina sua senha". Quem dispara é o Supabase. **Não está pronto.** ❌

Hoje o porteiro usa o carteiro de brincadeira que vem de fábrica no Supabase: entrega no máximo ~2 cartas por hora e elas chegam amassadas (spam, remetente estranho). A solução é contratar um **carteiro profissional** (Resend) e dar a ele uma **procuração** pra entregar em nome do `leadse.com.br` — a procuração são os registros DNS (SPF/DKIM).

**O que o aluno aprende:**
- **E-mail de sistema ≠ caixa da empresa** — dois circuitos separados; ter o Zoho não muda nada no e-mail que o app dispara.
- O e-mail embutido do Supabase serve pra teste e trava em produção. Se a confirmação não chega, o estranho não entra: o funil morre na porta.
- SPF/DKIM = a procuração no DNS: você prova pro mundo que autorizou o Resend a falar em nome do seu domínio.
- **Gotcha deste projeto:** o DNS já tem os registros do Zoho. **Não mexa neles.** O Resend valida num subdomínio próprio (ex.: `send.leadse.com.br`) — os dois convivem no mesmo domínio sem conflito.

**Passos no vídeo (a ordem é didática — mostre o problema antes da solução):**

1. **Abra mostrando o vilão ao vivo:** crie uma conta nova no app e mostre o e-mail de confirmação chegando — demorado, no spam, com remetente do Supabase. Frase: *"se um cliente de verdade passar por isso, ele não volta."* Agora o aluno QUER a solução.
2. **Desarme a confusão com a aula passada:** *"você pode estar pensando: e-mail a gente já fez. Fizemos a RECEPÇÃO — a caixa que eu abro e respondo. Agora é o e-mail que o APP manda sozinho. São dois circuitos."*
3. **Resend + DNS (a procuração):** crie a conta no Resend, adicione o domínio (`leadse.com.br`) — ele sugere um subdomínio de envio, aceite — e copie os registros. Cole na Hostinger, **a mesma tela de DNS da aula passada** (continuidade!): *"e repara que eu não apago nada do Zoho — o Resend valida num subdomínio próprio, os dois convivem."* Espere virar "Verified".
4. **Plugue no Supabase:** Authentication > Emails > Custom SMTP — host `smtp.resend.com`, porta 587/465, usuário `resend`, senha = a API key (`re_...`); Sender = `nao-responda@leadse.com.br`. Tradução pro aluno: *"estou falando pro Supabase: quando for mandar e-mail, não usa mais o seu carteiro de teste — usa o meu."*
5. **Confira os links (o detalhe que morde):** em URL Configuration, Site URL = `https://leadse.com.br` e a Redirect URL COM o caminho de callback (no projeto, `/auth/confirm`). Por quê: o e-mail pode chegar bonito, mas se o botão dentro dele abrir o endereço antigo do Railway, quebrou a experiência.
6. **Rode o prompt** (abaixo) pra IA conferir e traduzir o que faltar.
7. **Feche com o antes/depois:** crie OUTRA conta e mostre — e-mail na hora, na caixa de entrada, remetente `@leadse.com.br`, link abrindo `leadse.com.br`. Mesma ação do passo 1, resultado oposto: a prova visual de que a etapa entregou.

**Prompt(s) pra enviar:**

Quando: No passo 6 — depois de já ter criado a conta no Resend, validado o domínio (SPF/DKIM) e plugado o SMTP no painel do Supabase. A IA confirma que está tudo certo e ajusta o que faltar no código/config.

```
Configurei um e-mail profissional (Resend) no Supabase pro meu app mandar a confirmação de conta e o reset de senha saindo do meu domínio, no lugar do e-mail de teste. Confere se ficou tudo certo e se os links desses e-mails apontam pro meu domínio de produção, não pro endereço provisório. Se algum e-mail estiver em inglês, deixa em português. Isso não é 2FA, e não é pra mexer em nenhum outro e-mail que o app mande.
```

**Pra qualquer projeto:** todo app que cria conta de usuário tem os dois circuitos — a recepção (caixa profissional, ex.: Zoho) e o porteiro automático (SMTP próprio, ex.: Resend). Os dois moram no mesmo domínio sem brigar, porque cada um tem sua procuração no DNS.

---

## 8.2 - O estranho vira CLIENTE (o limite leva pro upgrade)

**Tópico:** quando o grátis estoura, o app leva o usuário direto pra `/planos` com o upgrade recomendado — o limite vira ponto de venda. *(No Lead-se: ⏳ a fazer ao vivo — hoje o estouro mostra um erro elegante; falta conduzir pro upgrade.)*

**O que o aluno aprende:**
- O limite do plano grátis não é castigo — é **o momento exato em que o usuário provou que quer mais**. Se o app só mostra "limite atingido", você desperdiça a melhor chance de conversão do produto.
- A regra continua a mesma do módulo inteiro: **o limite é decidido no servidor** (isso já está pronto desde a aula de webhooks). Aqui a gente só muda a REAÇÃO da tela.
- Conversão boa não engana: mostra o que a pessoa ganhou no grátis, qual plano resolve, e um botão só.

**Prompt(s) pra enviar:**

Quando: Com o app aberto, antes de testar o estouro do limite. Delimita o escopo pra IA não encostar na lógica de limites do servidor — ela é lei e já está pronta.

```
Hoje, quando um usuário do plano grátis estoura um limite (raspagens, leads ou e-mails), o app mostra uma mensagem de erro. Eu quero transformar esse momento em conversão: em vez de só avisar, abre a página /planos automaticamente (ou um aviso com botão direto pra ela), mostrando qual plano resolve o problema daquele usuário. Primeiro me mostra como esse fluxo funciona hoje, e depois faz a mudança. Importante: não mexe na checagem de limite do servidor — ela está certa e fica como está. Só muda a reação da interface quando o servidor recusar.
```

**Passos no vídeo (depois do prompt):**

1. Deixe a IA explicar o fluxo atual antes de mudar (Curiosity Rule — o aluno entende o que existe).
2. Aplique a mudança e derrube sua conta pro plano grátis direto no Supabase (como na aula da raspagem, só que ao contrário).
3. Estoure um limite de verdade (o grátis tem 3 raspagens) e mostre na tela: recusou → abriu `/planos` → o plano recomendado em destaque.
4. Confirme que o servidor continua recusando por baixo (a tela é sugestão, o servidor é lei).

**Pra qualquer projeto:** todo limite de plano tem dois lados — a trava (servidor) e o convite (tela). A trava protege seu custo; o convite converte. Nunca troque um pelo outro.

---

## 8.3 - O estranho CONFIA na hora de pagar (branding do checkout)

**Tópico:** colocar logo, ícone e cor da Lead-se no checkout do Stripe. *(No Lead-se: ⏳ a fazer ao vivo — configuração de painel, sem código.)*

**O que o aluno aprende:**
- A tela de pagamento é o momento de MAIOR desconfiança da jornada — a pessoa está de cartão na mão num domínio que não é o seu (`checkout.stripe.com`, como visto na aula do gateway).
- A continuidade visual (logo + cor do app) é o que diz "você ainda está comprando da mesma empresa".
- Isso é configuração de painel — sem prompt, sem código. Nem tudo em produção passa pela IA.

**Prompt(s) pra enviar:**

Quando: Não tem prompt neste passo — é só painel do Stripe. Pule direto pros passos.

**Passos no vídeo:**

1. No Stripe (modo produção) > Configurações > Branding: suba o logo da Lead-se, o ícone e defina a cor principal (o verde do app, da aula de teoria de cores).
2. Abra um checkout de verdade pelo app e mostre o antes/depois: de página genérica pra página com a cara do produto.

**Pra qualquer projeto:** vista o checkout com a identidade do app — é 5 minutos de painel que paga a desconfiança do momento mais sensível da compra.

---

## 8.4 - O estranho MAL-INTENCIONADO (a varredura de segurança)

**Tópico:** rodar uma auditoria que varre o app como um invasor e entrega os buracos pra você fechar na mão. *(No Lead-se: ⏳ a fazer ao vivo — o webhook já valida assinatura e a chave da Brasil Aberto já saiu pro env; falta ligar RLS e rotacionar a chave.)*

**O que o aluno aprende:**
- Vire a cabeça: até aqui você confiou em você. O estranho que paga pode querer ver dado dos outros, forjar um "pagou" ou torrar seus créditos.
- O maior risco é o banco: sem RLS (Row Level Security), a chave pública lê os dados de TODOS os clientes direto pela API, sem nem passar pelo app.
- Segredo que já foi commitado no Git está VAZADO — não basta tirar do código, tem que rotacionar (gerar nova, atualizar env, queimar a antiga).
- A infra agora é sua: abuso vira custo no seu cartão. Teto de gasto em cada API é defesa de custo, não frescura.

**Prompt(s) pra enviar:**

Quando: Prompt PRINCIPAL — use se você tem a skill de auditoria de segurança instalada (Módulo 4). Acione a skill e cole este briefing junto pra ela focar nos pontos certos do SEU app.

```
Roda a auditoria de segurança no meu app inteiro, pensando como uma pessoa mal-intencionada que pagou pra entrar. Olha principalmente: se um cliente consegue ver os dados de outro cliente, se tem alguma chave ou senha escrita no código, se dá pra furar os limites do plano e se dá pra forjar um pagamento. Pra cada problema que achar, me explica como se eu fosse leigo: qual o risco (com um exemplo do que o cara conseguiria fazer), o quão grave é, e como consertar. Não conserta nada ainda — só me mostra a lista pra eu decidir a ordem.
```

Quando: Prompt ALTERNATIVO — use se você NÃO tem a skill de auditoria. Cole direto no chat da IA com o projeto aberto. Cobre os mesmos pontos sem depender da skill.

```
Você é um especialista em segurança. Varre meu app inteiro como se fosse invadir ele e me mostra os pontos fracos. Olha principalmente: se um cliente consegue ver os dados de outro, se tem chave ou senha escrita no código (procura no histórico do projeto também), se dá pra furar os limites do plano e se dá pra forjar um pagamento. Pra cada problema: o risco explicado pra leigo com um exemplo, o quão grave é, e como consertar. Só me mostra a lista, não muda nada ainda.
```

**Passos no vídeo (depois do prompt):**

1. Leia o relatório e ataque os CRÍTICOS primeiro — quase sempre é o RLS.
2. Ligue o RLS e crie a policy na MESMA sessão por tabela (`ENABLE ROW LEVEL SECURITY` + `CREATE POLICY ... USING (auth.uid() = user_id)`); ligar sem policy tranca a tabela pra todo mundo. No Lead-se são `leads` e `user_subscriptions`. Lembra da aula do Railway: SQL de estrutura roda no SQL Editor do Supabase, na mão.
3. Teste o isolamento com dois usuários e confirme que a service_role (só no servidor) ainda passa.
4. Rotacione TODA chave que apareceu no histórico do Git: gere a nova, atualize a env (host e local) e só então queime a antiga (no Lead-se, a `BRASIL_ABERTO_API_KEY` da aula da raspagem).
5. Confirme teto de gasto em cada API paga (Apify, OpenRouter, Resend) e o alerta de gasto do cartão.
6. Confirme que o webhook valida a assinatura antes de confiar no evento (no Lead-se, `stripe.webhooks.constructEvent` em `src/app/api/webhook/route.ts`) e que o plano de cada usuário vem do BANCO, nunca da requisição.
7. Rode a auditoria de novo até voltar limpa.

**Pra qualquer projeto:** um estranho pagante vai cutucar — não confie em ninguém, feche as portas no servidor e no banco antes de abrir pro público.

---

## 8.5 - O estranho dá LUCRO (a conta fecha — margem)

**Tópico:** a última conta antes de abrir — o preço de cada plano cobre o custo médio do cliente? *(No Lead-se: ⏳ conceitual — não mexe em código. Bônus de gravação: cravar na tela o preço real do Pro no Stripe em produção — R$49 ou R$50 — que ficou ambíguo entre as aulas.)*

**O que o aluno aprende:**
- Infra é sua: cada raspagem, e-mail e texto de IA sai do seu bolso — mais cliente pode significar mais prejuízo se a conta não fechar.
- Precifique pela MÉDIA de uso, não pelo melhor nem pelo pior caso (a lógica lá da Aula 1 deste módulo, agora com números reais).
- Regra de bolso: cobre 3 a 4× o custo do cliente médio — é o colchão contra abuso e alta de preço das APIs.
- Se o preço chegar perto do custo: suba o preço OU aperte o limite (no servidor) — só UMA das duas por vez.

**Prompt(s) pra enviar:**

Quando: Para a IA estimar o custo médio por cliente de cada plano e comparar com o preço cobrado. Junte ANTES os preços reais dos serviços (Apify, OpenRouter, Railway, domínio, Resend) — não chute.

```
Você é meu consultor de preço — não mexe em código, é só uma conta. Meu app é [o que ele faz]. Cada cliente que usa consome serviços que eu pago: [serviço 1] custa [tanto], [serviço 2] custa [tanto]. Meus planos pagos são [Pro: R$ X, com tais limites] e [Ultra: R$ Y, com tais limites]. Calcula quanto me custa em média atender um cliente de cada plano e me diz se o preço que eu cobro está pelo menos 3 a 4 vezes acima do custo. Se não estiver, me diz o quanto eu teria que subir o preço ou apertar o limite.
```

**Passos no vídeo (depois do prompt):**

1. Abra o catálogo do Stripe em produção e CRAVE o preço real de cada plano na tela (resolve a ambiguidade R$49/R$50 de uma vez).
2. Junte os custos reais por uso (raspagem, enriquecimento, IA, e-mail) e os fixos (Railway, domínio) — números seus, não exemplo.
3. Rode o prompt e leia o veredito de cada plano pago.
4. Se algum ficar abaixo de 3×: mude preço no gateway OU limite no servidor — e se mudou o preço, lembre que nasce um price ID novo (atualiza a env e refaz um checkout de teste, como na aula passada).

**Pra qualquer projeto:** agora a infra é sua — precifique pela média e cobre 3–4× o custo, senão crescer significa sangrar.

---

## Fechamento da aula (e do projeto)

Volte na jornada do começo e marque na tela, um por um:

- [x] O estranho ENTRA — e-mail de confirmação chega, do seu domínio, na caixa de entrada.
- [x] O estranho VIRA CLIENTE — estourou o grátis, foi conduzido pro plano certo.
- [x] O estranho CONFIA — checkout com a cara do produto.
- [x] O estranho NÃO ABUSA — RLS ligado, segredos rotacionados, webhook assinado, teto de gasto.
- [x] O estranho DÁ LUCRO — cada plano cobra 3–4× o custo médio.

E encerra com a frase-âncora do módulo:

> **"Protótipo é o que funciona pra mim; produto é o que funciona pra um estranho que me paga e que eu não conheço."**

O Lead-se começou como uma ideia no Módulo 7 e termina aqui: no ar, com domínio próprio, cobrando
de verdade, blindado e com a conta fechando. Esse é o caminho que você repete em qualquer projeto
seu daqui pra frente — e é exatamente o que uma empresa paga R$ 5k, R$ 8k, R$ 10k pra ter.

---

## Notas de produção (não vai pro vídeo)

- **Antes de gravar:** criar a conta no Resend · ter o logo/ícone da Lead-se exportados · conferir se a skill de auditoria (M4) está instalada no projeto · anotar os custos reais por uso (Apify/OpenRouter/Railway) pra 8.5 não travar.
- **Continuidade citada na aula:** limites no servidor (Aula 4) · dropdowns e chave Brasil Aberto (Aula 5) · teoria de cores e config sem chave (Aula 6) · domínio/Zoho/Stripe produção (Aula 7) · skill de auditoria e RLS (Módulo 4).
- **Ponta que fica de fora (de propósito):** Mercado Pago/parcelamento — citado como evolução futura, não entra no MVP.
- **Depois de gravar:** transcrever (pipeline Whisper) → enviar pro Obsidian → ingerir (a pendência "Aula 08" já está registrada na página da fonte do Módulo 8) → atualizar INDICE e o resumo do módulo.
