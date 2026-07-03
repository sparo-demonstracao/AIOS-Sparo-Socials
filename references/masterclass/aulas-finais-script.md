# Aulas Finais - Script de Gravação (Protótipo -> Produto)

> Este é o script com explicação + prompts. O mapa/overview está em `aulas-finais-roteiro.md`.

> **Status (02/07/2026):** **Aula A gravada** — é a Aula 7 do Módulo 8 (A1 ✅ domínio+DNS+deploy · A5 ✅ Stripe em produção · **A4 ❌ não entrou**: a aula criou a caixa Zoho, mas o SMTP do Supabase segue no e-mail de teste). **A gravar: Aula B** (B1 auditoria + B2 margem) — decidir se o A4 entra nela.

## A virada (a espinha)

Tudo aqui responde a 3 perguntas:

1. A infra é minha?
2. Está num endereço público e cobrando de verdade?
3. Aguenta um estranho mal-intencionado?

A Aula A responde 1 e 2. A Aula B responde a 3.

Regra de ouro do módulo inteiro: **a tela é sugestão, o servidor é lei.**

## Ordem de execução

Primeiro as **mudanças de código/lógica** (Aula A, passos 1-2). Depois a **finalização** (subir no ar, e-mail, pagamento). Por fim, **blindar** (Aula B).

Faça nesta ordem. Mexer no código antes de subir evita retrabalho; blindar por último só faz sentido quando já tem um app no ar pra atacar.

## Aula A - Colocar no ar


### A1 - Subir num endereço público (domínio + hospedagem + deploy)

**Tópico:** sair do localhost e dar ao app um domínio próprio apontado pro host. *(No Lead-se: ⏳ a fazer ao vivo — comprar o domínio e apontar pro host.)*

**O que o aluno aprende:**
- Produto precisa de um endereço que o mundo alcance, não só localhost.
- O trabalho braçal é seu: comprar o domínio e mexer no DNS na mão.
- Domínio próprio é pré-requisito do e-mail profissional e do pagamento de verdade.
- Segredo nunca no código — tudo nas variáveis de ambiente do host.

**Prompt(s) pra enviar:**

Quando: Depois que o domínio próprio já estiver comprado e apontado pro host -- só pra alinhar a URL pública do app com o domínio novo, pra que links de callback e e-mail saiam certos. Pule este prompt se o app ainda não tem variável de URL pública.

```
Coloquei um domínio próprio no meu app: [https://seudominio.com.br]. Antes ele usava aquele endereço provisório do servidor. Procura no projeto inteiro onde ainda aparece o endereço antigo e troca pelo novo — principalmente os links que vão por e-mail e os redirecionamentos do pagamento. Me avisa se tem alguma coisa que eu preciso trocar na mão em algum painel.
```

**Passos no vídeo (depois do prompt):**

1. Compre o domínio num registrador (Registro.br pra .com.br; Hostinger/Namecheap pra outros).
2. No host (Railway) > Settings > Domains > "Add Custom Domain", cole o domínio e pegue o registro DNS que ele pedir (geralmente um CNAME).
3. No registrador, crie esse registro exatamente como o host mostrou e espere propagar; o HTTPS sai automático depois do "verified".
4. Confirme que as variáveis sensíveis estão TODAS no painel do host (a service_role você cola na mão, nunca manda pra IA).
5. Atualize a URL pública nos serviços conectados (no Supabase, Authentication > URL Configuration: Site URL e Redirect URLs).
6. Dê um push (GitHub) pro host fazer o deploy, abra o domínio e teste conta, login e o redirect do checkout.

**Pra qualquer projeto:** produto vive num endereço público com domínio próprio, base do e-mail profissional e do pagamento real, com todo segredo nas variáveis do host e cada push virando deploy.

---

### A4 - E-mail profissional (SMTP próprio no Supabase via Resend)

**Tópico:** trocar o e-mail de teste do Supabase por SMTP próprio (Resend) saindo do seu domínio. *(No Lead-se: ⏳ a fazer ao vivo — Resend + DNS + Supabase.)*

**O que o aluno aprende:**
- O e-mail embutido do Supabase manda ~2 por hora — só serve pra teste, trava em produção.
- A troca é 90% config na mão: Resend mandando do seu domínio.
- Valide o domínio no DNS (SPF/DKIM) ou o e-mail cai em spam.
- É só o e-mail de SISTEMA (confirmar conta, resetar senha) — não é 2FA e não mexe em outros fluxos de e-mail do app.

**Prompt(s) pra enviar:**

Quando: Depois de já ter criado a conta no Resend, validado o domínio (SPF/DKIM) e plugado o SMTP no painel do Supabase -- quando quiser que a IA confirme que está tudo certo e ajuste o que faltar no código/config.

```
Configurei um e-mail profissional (Resend) no Supabase pro meu app mandar a confirmação de conta e o reset de senha saindo do meu domínio, no lugar do e-mail de teste. Confere se ficou tudo certo e se os links desses e-mails apontam pro meu domínio de produção, não pro endereço provisório. Se algum e-mail estiver em inglês, deixa em português. Isso não é 2FA, e não é pra mexer em nenhum outro e-mail que o app mande.
```

**Passos no vídeo (depois do prompt):**

1. Pré-requisito: domínio já comprado e apontado pra hospedagem.
2. No Resend, adicione o domínio, copie os registros DNS (SPF/DKIM/MX), cole no seu provedor e espere virar "Verified".
3. Pegue o SMTP do Resend: host `smtp.resend.com`, porta 587/465, usuário `resend`, senha = a API key (`re_...`).
4. No Supabase > Authentication > Emails > Custom SMTP, cole host, porta, usuário e senha; configure o Sender com um e-mail do domínio validado.
5. Em URL Configuration, troque a Site URL pro domínio de produção e inclua a Redirect URL COM o caminho de callback (no projeto, `/auth/confirm`), não só o domínio raiz.
6. Atualize a variável da URL pública (no projeto, `NEXT_PUBLIC_SITE_URL`) no host e faça redeploy; garanta os templates em português.
7. Teste de verdade: crie conta e peça reset; o e-mail tem que sair do seu domínio, cair na entrada e o link abrir no domínio de produção.

**Pra qualquer projeto:** e-mail de sistema sai de você@seudominio, autenticado no DNS (SPF/DKIM), por SMTP próprio — vale pra qualquer app que crie conta de usuário.  

---

### A5 - Pagamento em produção (Stripe): sair do modo teste e cobrar de verdade

**Tópico:** provar o pagamento no modo teste e preparar a virada pra produção sem chumbar nada no código. *(No Lead-se: ⏳ a refatoração dos price IDs dá pra fazer ao vivo; a virada pra produção espera a empresa validar no Stripe.)*

**O que o aluno aprende:**
- Modo teste (cartão 4242) é brinquedo; pra cobrar de verdade, o gateway exige verificar a empresa — e isso demora dias.
- Provou em teste (plano sobe no banco), funciona em produção: só troca as chaves "test" por "live".
- Os price IDs ficam chumbados no código em dois lugares e MUDAM em produção — tire pra variável de ambiente.
- Cada modo tem suas chaves, price IDs e webhook secret próprios — não misture teste com live.

**Prompt(s) pra enviar:**

Quando: Antes de virar a chave pra produção. Para de chumbar os IDs dos planos no código e move pra variável de ambiente -- vale pra preparar a virada e pra deixar o app limpo. Funciona em qualquer app com planos de assinatura (Stripe, Mercado Pago, etc.).

```
Os IDs dos meus planos de assinatura ([Pro] e [Ultra]) estão escritos na mão dentro do código, em mais de um lugar. Isso vai me dar dor de cabeça quando eu colocar o pagamento em produção, porque esses IDs mudam. Tira eles do código e deixa numa configuração separada, pra eu trocar depois sem mexer em código. Não encosta em nenhuma chave de API — só nos IDs dos planos. No fim, me diz os nomes que você criou.
```

**Passos no vídeo (depois do prompt):**

1. Prove em teste: com o painel no modo TESTE, cadastre os price IDs de teste nas variáveis novas (`STRIPE_PRICE_PRO`, `STRIPE_PRICE_ULTRA`) no `.env` e no host.
2. Gire o ciclo: pague com o 4242 (data futura, CVC, CEP) e confirme no banco que o plano subiu pro/ultra.
3. Verifique a empresa (começa agora, demora dias): CNPJ, dados bancários e URL pública; siga no modo teste enquanto analisam.
4. Quando aprovada: vire pro modo PRODUÇÃO, recrie os dois planos e copie os novos price IDs (diferentes dos de teste).
5. Vire SÓ via variáveis no host: secret key e chave pública "live" + os novos `STRIPE_PRICE_*`. Não toque no código.
6. Crie o webhook de produção apontando pra URL pública, com os eventos `checkout.session.completed`, `customer.subscription.deleted` e `invoice.payment_failed`; atualize `STRIPE_WEBHOOK_SECRET` com o novo `whsec_`.
7. Suba o logo no checkout, faça redeploy e teste uma compra real pequena de ponta a ponta.

**Pra qualquer projeto:** tudo que muda entre teste e produção (chaves, price IDs, URL e segredo do webhook) é configuração em variável de ambiente, nunca código — virar a chave é trocar valores no painel.

## Aula B - Blindar

### B1 - Auditoria de segurança: pensar como invasor

**Tópico:** rodar uma auditoria que varre o app como um invasor e te entrega os buracos pra você fechar na mão. *(No Lead-se: ⏳ a fazer ao vivo — rodar a auditoria; o webhook já valida assinatura e a chave da Brasil Aberto já saiu pro env — falta ligar RLS e rotacionar a chave.)*

**O que o aluno aprende:**
- Vire a cabeça: o estranho que paga pode querer ver dado dos outros, forjar um "pagou" ou torrar seus créditos.
- O maior risco é o banco: sem RLS, a chave pública lê os dados de TODOS direto pela API.
- Segredo commitado no Git está vazado — não basta tirar do código, tem que ROTACIONAR.
- Infra é sua: abuso vira custo no seu cartão, então ponha teto de gasto em cada API.

**Prompt(s) pra enviar:**

Quando: Prompt PRINCIPAL -- use se você tem a skill de auditoria de segurança instalada. Acione a skill e cole este briefing junto pra ela focar nos pontos certos do SEU app. Preencha os [colchetes] com o seu stack.

```
Roda a auditoria de segurança no meu app inteiro, pensando como uma pessoa mal-intencionada que pagou pra entrar. Olha principalmente: se um cliente consegue ver os dados de outro cliente, se tem alguma chave ou senha escrita no código, se dá pra furar os limites do plano e se dá pra forjar um pagamento. Pra cada problema que achar, me explica como se eu fosse leigo: qual o risco (com um exemplo do que o cara conseguiria fazer), o quão grave é, e como consertar. Não conserta nada ainda — só me mostra a lista pra eu decidir a ordem.
```

Quando: Prompt ALTERNATIVO -- use se você NÃO tem a skill de auditoria. Cole direto no chat da IA com o projeto aberto. Cobre os mesmos pontos sem depender da skill. Preencha os [colchetes] com o seu stack.

```
Você é um especialista em segurança. Varre meu app inteiro como se fosse invadir ele e me mostra os pontos fracos. Olha principalmente: se um cliente consegue ver os dados de outro, se tem chave ou senha escrita no código (procura no histórico do projeto também), se dá pra furar os limites do plano e se dá pra forjar um pagamento. Pra cada problema: o risco explicado pra leigo com um exemplo, o quão grave é, e como consertar. Só me mostra a lista, não muda nada ainda.
```

**Passos no vídeo (depois do prompt):**

1. Leia o relatório e ataque os CRÍTICOS primeiro — quase sempre é o RLS.
2. Ligue o RLS e crie a policy na MESMA sessão por tabela (`ENABLE ROW LEVEL SECURITY` + `CREATE POLICY ... USING (auth.uid() = user_id)`); ligar sem policy tranca a tabela pra todos. No Lead-se são `leads` e `user_subscriptions`.
3. Teste o isolamento com dois usuários e confirme que a service_role (só no servidor) ainda passa.
4. Rotacione TODA chave que apareceu no histórico do Git: gere a nova, atualize a env (host e local) e só então queime a antiga (no Lead-se, a `BRASIL_ABERTO_API_KEY`).
5. Confirme teto de gasto em cada API paga e o alerta de gasto do gateway/cartão.
6. Confirme que o webhook valida a assinatura antes de confiar no evento (no Lead-se, `stripe.webhooks.constructEvent` em `src/app/api/webhook/route.ts`) e que o plano vem do banco, não da requisição.
7. Rode a auditoria de novo até voltar limpa e registre no `decisions/log.md` o que foi rotacionado.

**Pra qualquer projeto:** um estranho pagante vai cutucar — não confie em ninguém, feche as portas no servidor e no banco antes de abrir pro público.

---

### B2 - Margem: o preço cobre o custo? (fechamento)

**Tópico:** a última conta antes de abrir — o preço de cada plano cobre o custo médio do cliente? *(No Lead-se: ⏳ conceitual — é a conta de margem, não mexe em código.)*

**O que o aluno aprende:**
- Infra é sua: cada raspagem, e-mail e texto de IA sai do seu bolso.
- Precifique pela MÉDIA de uso, não pelo melhor nem pelo pior caso.
- Regra de bolso: cobre 3 a 4x o custo do cliente médio — é o colchão contra abuso e alta de API.
- Se o preço chegar perto do custo, pare e mexa: suba o preço OU aperte o limite (só no servidor).

**Prompt(s) pra enviar:**

Quando: Para a IA estimar o custo médio por cliente de cada plano e comparar com o preço cobrado (conceitual, não mexe no código). Funciona pra qualquer app cuja infra é sua e que cobra por planos.

```
Você é meu consultor de preço — não mexe em código, é só uma conta. Meu app é [o que ele faz]. Cada cliente que usa consome serviços que eu pago: [serviço 1] custa [tanto], [serviço 2] custa [tanto]. Meus planos pagos são [Pro: R$ X, com tais limites] e [Ultra: R$ Y, com tais limites]. Calcula quanto me custa em média atender um cliente de cada plano e me diz se o preço que eu cobro está pelo menos 3 a 4 vezes acima do custo. Se não estiver, me diz o quanto eu teria que subir o preço ou apertar o limite.
```

**Passos no vídeo (depois do prompt):**

1. Junte os preços reais de cada serviço por uso (raspagem, enriquecimento, IA, e-mail) e dos custos fixos (host, domínio, e-mail de sistema) — não chute.
2. Anote os limites e o preço de cada plano do seu app (use OS SEUS números).
3. Rode o prompt e leia o veredito de cada plano pago.
4. Se algum ficar abaixo de 3x: aplique SÓ UMA das duas — preço novo no gateway OU limite novo no servidor.
5. Se mexeu no PREÇO: o novo plano gera novo price ID; atualize a env, redeploy e refaça um checkout de teste.
6. Se apertou o LIMITE: confirme que ele está travado no servidor (não só na tela) e teste o bloqueio.
7. Registre a decisão de precificação (margem aceita, preço e limite de cada plano, e por quê) num arquivo do projeto.

**Pra qualquer projeto:** agora a infra é sua — precifique pela média de uso e cobre 3-4x o custo, senão mais cliente = mais prejuízo.

## Checklist final (o que o aluno leva pra qualquer projeto)

- [ ] As chaves dos serviços que fazem o app funcionar são MINHAS, em variável de ambiente no servidor -- nunca na tela do cliente.
- [ ] Nenhuma chave chega ao navegador, nem pela tela, nem pela mensagem de erro (prefixo/tamanho/formato só vão pro log).
- [ ] Todo limite que custa dinheiro é conferido no servidor ANTES da ação; o uso é contado depois que a ação deu certo, com upsert e contando o REAL.
- [ ] Plano "por mês" zera o uso a cada ciclo (reset preguiçoso na leitura, sem cron).
- [ ] O app vive num endereço público com domínio próprio; todo segredo mora nas variáveis de ambiente do host.
- [ ] E-mail de sistema sai de você@seudominio, autenticado no DNS (SPF/DKIM), por SMTP próprio -- não pelo limite baixo do serviço de teste.
- [ ] Pagamento foi provado em teste; chaves, price IDs, URL e segredo do webhook são configuração (env), nunca código.
- [ ] RLS LIGADO em toda tabela de dado de cliente, com policy que limita cada um às próprias linhas (ligar e criar a policy juntos).
- [ ] Todo segredo que já foi pro Git foi ROTACIONADO -- gerar nova, atualizar env, queimar a antiga.
- [ ] Teto de gasto ativo em CADA API paga (além do limite de plano); webhook valida a assinatura e o plano vem do banco.
- [ ] A conta fecha: cada plano pago cobra 3-4x o custo médio; o grátis tem prejuízo de aquisição controlado.

---

Frase-âncora: "protótipo é o que funciona pra mim; produto é o que funciona pra um estranho que me paga e que eu não conheço."
