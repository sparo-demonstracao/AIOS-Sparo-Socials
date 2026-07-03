# Aulas Finais — A Fase Final de Qualquer Projeto (Protótipo → Produto)

> Roteiro-guia das duas últimas aulas do Módulo 8 (projeto Lead-se). É um **roteiro de lógica**, não de prompts decorados: cada passo é um **princípio universal** + como ele aparece **neste projeto**. O aluno decora o princípio e usa em qualquer app que criar.

> **Status (02/07/2026):** a **Aula A já foi gravada** — virou a **Aula 7 do Módulo 8** (23/06: domínio na Hostinger + DNS→Railway, e-mail profissional no Zoho, Stripe em produção). **Exceção:** o passo 4 (e-mail de **sistema** via SMTP próprio no Supabase/Resend) **não entrou** na gravação — a aula criou a caixa Zoho (e-mail humano), que não cobre confirmação de conta/reset de senha. **Falta gravar a Aula B** (auditoria de segurança) — decidir se o SMTP entra nela.

## A virada de chave (a parte que tem que ficar na cabeça)

Um **protótipo** funciona na sua máquina, com você do lado. Um **produto** um estranho **paga e usa sozinho**. A fase final de todo projeto é essa travessia — e ela responde a **3 perguntas**:

1. **A infra é minha?** — o cliente paga pelo resultado, não monta a engenharia.
2. **Está num endereço público e cobrando de verdade?** — domínio, hospedagem, e-mail, pagamento.
3. **Aguenta um estranho mal-intencionado?** — segurança.

→ **Aula A** responde as perguntas 1 e 2 (colocar no ar). **Aula B** responde a 3 (blindar).

**Regra de ouro das duas aulas:** a tela é sugestão, **o servidor é lei**. Tudo que vale dinheiro ou é segredo mora no servidor.

---

## Aula A — Tirar as rodinhas (colocar no ar)

> "Tirar as rodinhas" = o app para de depender de você estar do lado pra funcionar.
> A ordem importa: cada passo destrava o seguinte.

**1. A infra vira sua** — *o cliente compra o resultado, não a engenharia.*
- **Por quê:** enquanto o cliente precisa colar as SUAS chaves de API, não é produto — é tutorial.
- **No app:** as chaves (Apify/Firecrawl/OpenRouter) saíram da config do cliente → variáveis de ambiente no servidor. No config dele sobra só o que é dele (o e-mail de envio). A chave nunca chega ao navegador; ele paga pra usar a sua infra.

**2. Limite no servidor + ciclo** — *o que vale dinheiro, o backend controla.*
- **Por quê:** limite só na tela qualquer um burla; e plano "por mês" precisa zerar todo mês.
- **No app:** cada raspagem/e-mail confere o limite no servidor **antes** de rodar e conta o uso; o ciclo zera sozinho a cada mês.

**3. Endereço público** — *produto vive num lugar que o mundo alcança.*
- **Por quê:** localhost é só seu; e o domínio próprio é **pré-requisito** do e-mail profissional e do Stripe.
- **No app:** comprar o domínio + apontar pra hospedagem (Railway). Segredos nas variáveis de ambiente do painel do host (nunca no código); GitHub → auto-deploy; a chave mais sensível (service_role) colada na mão.

**4. E-mail profissional** — *e-mail de sistema vem de `você@seudomínio`, autenticado.*
- **Por quê:** o serviço de e-mail embutido do Supabase (confirmação de conta + reset de senha) é limitado a ~2/hora e cai em spam — só serve pra teste. *(Isso não tem nada a ver com 2FA.)*
- **No app:** configurar o Resend como SMTP do Supabase, validando o domínio no DNS (SPF/DKIM).
- **Separe na cabeça:** e-mail de **sistema** (Supabase → cliente) precisa disso; e-mail de **prospecção** (cliente → leads) sai do Gmail do próprio cliente e **não** depende disso.

**5. Pagamento real** — *modo teste é brinquedo; produção é dinheiro real.*
- **Por quê:** o gateway exige saber quem recebe (verificar a empresa) — e isso demora dias.
- **No app:** verificar a empresa no Stripe, trocar pras chaves *live*, recriar os planos em produção (os price IDs mudam → vão pra env, nunca no código) e apontar o webhook de produção pro domínio.
- **Na gravação:** como a validação demora, **prove o ciclo no modo teste** (cartão `4242 4242 4242 4242`) e deixe claro que virar pra produção é só trocar as chaves quando a empresa for aprovada.

**Fim da Aula A:** app no ar, com infra sua, e-mail funcionando e pagamento configurado. Falta blindar.

---

## Aula B — Pensar como invasor (auditoria de segurança)

> Até aqui você confiou em você. Agora assuma que **ninguém é confiável** e tranque as portas.
> A skill de auditoria faz o trabalho pesado — mas o aluno tem que entender **o que** ela checa e **por quê** (senão não sabe consertar).

**1. RLS — quem vê o quê** *(o maior risco)* — sem Row Level Security, a chave pública lê os dados de **todos** os clientes direto pela API, sem passar pelo app. Cada cliente só pode ver as próprias linhas. *Segurança mora no banco, não na boa vontade do front.*

**2. Segredos** — tudo em variável de ambiente, nada escrito no código; a service_role só no servidor; conferir o histórico do git (uma chave que já foi commitada está **vazada** — tem que rotacionar).

**3. Validação no servidor** — limites, inputs e preços conferidos no backend. Nunca confie no que vem da tela.

**4. Abuso e custo** — a infra agora é sua: um cliente (ou um bug) pode torrar seus créditos. O limite aplicado vira **defesa de custo**; somar rate limit e um teto de gasto.

**5. Pagamento à prova de fraude** — webhook **assinado** (ninguém forja um "pagou") e o banco como **fonte da verdade** do plano de cada cliente.

**Fechamento do módulo — margem:** o preço cobre o custo médio por cliente? Precificar pela **média** e cobrar **3–4× o custo** (a lógica da Aula 1 do Módulo 8). Sem isso, mais cliente = mais prejuízo.

**Fim da Aula B (e do projeto):** app no ar, blindado e cobrando — pronto pros primeiros clientes.

---

## O checklist que o aluno leva pra QUALQUER projeto

**Colocar no ar (Aula A)**
- [ ] A infra é minha — chaves no servidor, não na config do cliente
- [ ] Limites e ciclo conferidos no servidor
- [ ] Domínio + hospedagem + segredos em variáveis de ambiente
- [ ] E-mail de sistema por SMTP próprio (domínio no DNS)
- [ ] Pagamento em produção — empresa verificada, price IDs em env, webhook no domínio

**Blindar (Aula B)**
- [ ] RLS ligado — cada um só vê o que é seu
- [ ] Nenhum segredo no código ou no histórico do git
- [ ] Validação no servidor (limites, inputs, preços)
- [ ] Teto contra abuso/custo
- [ ] Webhook de pagamento assinado
- [ ] Preço cobre o custo médio por cliente

> **A frase que resume tudo:** *protótipo é o que funciona pra mim; produto é o que funciona pra um estranho que me paga e que eu não conheço.*
