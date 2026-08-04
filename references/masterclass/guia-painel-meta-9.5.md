# Guia clique a clique — Painel da Meta pra 9.5 (Atendente no WhatsApp)

> Guia de gravação do Enzo (não é material de aluno). Siga NA ORDEM — cada etapa depende da
> anterior. Tempo estimado: 30-45 min de tela. Criado 21/07/2026, conferido com a documentação
> oficial da Meta (developers.facebook.com/docs/whatsapp/cloud-api/get-started).

---

## ✅ ETAPA 0 — Antes de abrir a Meta (5 min, fora do painel)

Nada aqui aparece em aula, mas sem isso a verificação do webhook FALHA na frente da câmera.

- [ ] **Projeto no ar no Railway** (`git push` feito) e a **URL pública copiada** — ex.: `https://atendente-renov.up.railway.app`
- [ ] **Descubra a rota do webhook** que a IA criou no `server.js` (ex.: `/webhook`). A URL completa será `https://SEU-APP.up.railway.app/webhook`
- [ ] **INVENTE o verify token agora** — qualquer string, ex.: `renov-webhook-2026`
- [ ] **Cole o verify token no Railway JÁ** (variável, ex.: `VERIFY_TOKEN`) e espere o redeploy terminar. A Meta vai bater na sua URL na Etapa 3 — se o token não estiver lá ANTES, a verificação falha
- [ ] Logado em **developers.facebook.com** e **business.facebook.com** com a conta que administra o portfólio da A2
- [ ] **Celular 1** na mão (o do número do atendente — ou o chip novo) · **Celular 2** pra fazer o papel de cliente
- [ ] Confira em business.facebook.com → Central de segurança se a **verificação do negócio** (disparada na A2) saiu. Se ainda estiver pendente: **siga mesmo assim** — pra RESPONDER cliente (o caso do atendente) não bloqueia; só limita conversas que a EMPRESA inicia (~250/dia) e o nome de exibição pode ficar "em análise"

---

## 📱 ETAPA 1 — Criar o app (developers.facebook.com)

1. Entre em **developers.facebook.com** → canto superior direito → **"Meus apps"**
2. Clique **"Criar app"**
3. Caso de uso: escolha **"Conectar com clientes pelo WhatsApp"** *(se essa opção não aparecer no seu painel, escolha "Outro" → tipo "Negócios" → e adicione o produto WhatsApp na mão no passo 6)*
4. **Nome do app**: `atendente-renov` (ou o que preferir) + seu e-mail de contato
5. **Vincule o portfólio de negócios** — o MESMO da verificação da A2 (isso conecta o app à empresa verificada)
6. Clique **"Criar app"** → você cai no painel do app.

**⚠️ Layout novo do painel (confirmado na gravação de 21/07):** o WhatsApp **não aparece como item próprio** no menu lateral — ele vive dentro de **"Casos de uso"**. O caminho pra tudo é: menu lateral → **Casos de uso** → **"Conectar-se com os clientes pelo WhatsApp"** → **Personalizar** → lá dentro estão a **"Configuração da API"** (número de teste, IDs) e a **"Configuração"** (webhook).

**✔ Checkpoint:** no Painel, a linha *"Personalizar o caso de uso 'Conectar-se com os clientes pelo WhatsApp'"* aparece com check verde.

---

## 🔢 ETAPA 2 — Configuração da API: número de teste + anotar os IDs

1. Menu lateral → **Casos de uso → "Conectar-se com os clientes pelo WhatsApp" → Personalizar → Configuração da API**
2. A Meta te dá um **número de TESTE grátis** (tipo +1 555...). É com ele que você prova o caminho ANTES do número real
3. Em **"Para"** (destinatários): clique em gerenciar/adicionar e cadastre o número do seu **Celular 2** → chega um código por WhatsApp → digite → confirmado *(o número de teste só envia pra até 5 números cadastrados)*
4. **ANOTE AGORA** (deixa num bloco de notas aberto):
   - **Phone Number ID** — aparece logo abaixo do número em "De:" ⚠️ NÃO é o telefone, é um ID numérico longo
   - **WhatsApp Business Account ID (WABA ID)** — na mesma tela
5. O painel mostra um **token temporário** (~24h). Ele serve SÓ pra esta etapa — o definitivo vem na Etapa 4
6. 🚂 **Cole JÁ no Railway** (2ª ida): `WHATSAPP_TOKEN` (o temporário) e `WHATSAPP_PHONE_NUMBER_ID` (do número de teste) → espere o redeploy. ⚠️ **WABA ID não é variável** — o server não usa; fica só anotado pro painel. Nomes confirmados no `.env` real: `WHATSAPP_TOKEN` · `WHATSAPP_PHONE_NUMBER_ID` · `WHATSAPP_VERIFY_TOKEN` · `META_APP_SECRET` (opcional). Recap das 3 idas: **(1)** `WHATSAPP_VERIFY_TOKEN` antes da Meta · **(2)** token temporário + Phone Number ID agora · **(3)** na Etapa 4/5, trocar pelo token permanente e pelo Phone Number ID do número real
7. **Teste hello_world**: na mesma tela, botão de enviar mensagem de teste → o template `hello_world` chega no Celular 2. *(Bom momento de tela: "a API funciona antes de qualquer código nosso.")*

**✔ Checkpoint:** `hello_world` recebido no Celular 2; Phone Number ID e WABA ID anotados.

---

## 🔗 ETAPA 3 — Webhook (é aqui que a Meta conecta no seu app do Railway)

> Pré-condição: Etapa 0 completa (verify token JÁ nas **Variables do Railway** — não só no `.env`
> local, que está no `.gitignore` e não sobe no push!).
>
> ✅ **Teste do navegador ANTES de clicar em Verificar na Meta:** abra
> `https://SEU-APP.up.railway.app/webhook?hub.mode=subscribe&hub.verify_token=SEU-TOKEN&hub.challenge=teste123`
> → deve aparecer **teste123**. 404/sandbox = faltou `git push` · erro = variável faltando no
> Railway (logs mostram `WhatsApp: DESLIGADO — motivo`).

1. Mesmo caminho da Etapa 2 (Casos de uso → caso do WhatsApp) → **Configuração** (Configuration)
2. Seção **Webhook** → **"Editar"**
3. **URL de callback**: `https://SEU-APP.up.railway.app/webhook` (a rota exata da Etapa 0)
4. **Token de verificação**: cole o MESMO que está no Railway (`renov-webhook-2026`)
5. Clique **"Verificar e salvar"** — a Meta faz um GET na sua URL com um desafio e o seu app responde
   - ❌ **Se falhar**, é uma destas 3 coisas: (a) token diferente nos dois lados; (b) app fora do ar/ainda deployando no Railway; (c) rota errada (confira no `server.js`). Corrija e clique de novo — pode tentar quantas vezes quiser
6. Ainda na seção Webhook → **"Gerenciar"** → encontre o campo **`messages`** → **Assinar** ✅ *(sem isso, NENHUMA mensagem chega no seu app — é o esquecimento mais comum)*
7. **Teste**: responda o `hello_world` no Celular 2 com qualquer texto → abra os logs do Railway → o payload JSON da mensagem aparece. *(Momento de tela: "o WhatsApp acabou de bater na porta do nosso app.")*

**✔ Checkpoint:** webhook verificado (bolinha verde) + campo `messages` assinado + mensagem aparecendo no log.

---

## 🔑 ETAPA 4 — Token PERMANENTE (usuário do sistema)

> O token da Etapa 2 morre em ~24h — "funcionou na aula, morreu no dia seguinte". Este aqui é o
> definitivo. ⚠️ NOTA DE GRAVAÇÃO: borre o token na edição e REVOGUE depois de gravar.

1. Abra **business.facebook.com → Configurações do negócio** (engrenagem)
2. Menu esquerdo → **Usuários → Usuários do sistema** → **"Adicionar"**
3. Nome: `servidor-atendente` · Função: **Administrador** → criar
4. Com o usuário selecionado → **"Adicionar ativos"** → aba **Apps** → selecione o `atendente-renov` → ative **"Gerenciar app"** (controle total) → salvar
5. *(Checagem extra, se listado: em Adicionar ativos → **Contas do WhatsApp**, atribua também a WABA ao usuário — em alguns painéis isso já vem herdado do portfólio; se der erro de permissão no envio mais tarde, é aqui que se resolve)*
6. Clique **"Gerar novo token"**:
   - App: `atendente-renov`
   - Validade: **"Nunca expira"**
   - Permissões: marque **`whatsapp_business_messaging`** e **`whatsapp_business_management`**
7. **"Gerar token"** → **COPIE AGORA** — ele NÃO aparece de novo depois que você fechar
8. Cole no Railway na variável do token (ex.: `WHATSAPP_TOKEN`), substituindo o temporário

**✔ Checkpoint:** token permanente no Railway; redeploy ok; mande outra mensagem de teste pra confirmar que o envio continua funcionando com o token novo.

---

## ☎️ ETAPA 5 — O número REAL (a bifurcação — grave a porta que abrir)

1. Volte em **WhatsApp → Configuração da API** → no seletor de número, **"Adicionar número de telefone"**

**🅰️ Se aparecer a opção "conectar número existente do app WhatsApp Business" (coexistence):**
2. Siga o fluxo: a Meta mostra um **QR code/código** → no Celular 1, abra o **app WhatsApp Business** (atualizado!) → siga a instrução de pareamento
3. Escolha se sincroniza **histórico (até 6 meses) e contatos** — pra demo, tanto faz; pro cliente real, recomende sincronizar
4. Conectado: o app do celular **continua funcionando** (com as limitações que você explica no passo 4 do vídeo: sem chamadas de voz/vídeo, sem listas de transmissão, sem catálogo, etc.)

**🅱️ Se a opção NÃO aparecer** *(o fluxo de coexistence é liberado via plataformas parceiras — diga a frase roteirizada do passo 8b)*:
2. Use o **chip/eSIM dedicado**. ⚠️ O número **não pode ter conta ativa de WhatsApp** — se tiver, no app: Configurações → Conta → **Excluir conta** (e espere uns minutos)
3. "Adicionar número" → **nome de exibição** (é o que o cliente vê — pode cair em análise se o negócio não estiver verificado; não trava o teste) → categoria → fuso/idioma
4. Verificação por **SMS ou ligação** no Celular 1 → digite o código
5. Se pedir **PIN de verificação em duas etapas**: defina um de 6 dígitos e GUARDE (a Meta pede ele em re-registros futuros)

**Pros DOIS caminhos, ao terminar:**
6. ⚠️⚠️ **O Phone Number ID MUDOU** — o do número real é OUTRO, diferente do número de teste. Volte na Configuração da API, copie o **novo Phone Number ID** e **atualize a variável no Railway**. *(Esquecer isso = agente responde pelo número de teste ou não responde nada — o erro mais traiçoeiro da aula)*

**✔ Checkpoint:** número real listado na Configuração da API + Phone Number ID novo no Railway.

---

## 🏁 ETAPA 6 — Fechamento e teste final

1. **Confira as variáveis no Railway** (nomes CONFIRMADOS no `.env` real do projeto):
   - `WHATSAPP_TOKEN` = token permanente (Etapa 4)
   - `WHATSAPP_PHONE_NUMBER_ID` = **do número REAL** (Etapa 5!)
   - `WHATSAPP_VERIFY_TOKEN` = o inventado na Etapa 0
   - `META_APP_SECRET` *(opcional)* = painel do app → Configurações do app → Básico
   - *(WABA ID: só no bloco de notas — não é variável)*
2. Redeploy terminado → **teste final do Celular 2** (o do passo 9 do roteiro): mande *"oi, quanto custa a limpeza de pele?"* em texto **e um ÁUDIO** pedindo horário → o agente responde com o valor da base (R$ 180, ou a promo de R$ 99 se cair nela)
3. Se foi coexistence: mostre o **espelho** — a conversa aparecendo no app do Celular 1

## 🚨 Erros comuns (diagnóstico em 10 segundos)

| Sintoma | Causa quase sempre |
|---|---|
| Mensagem do cliente não chega no app/log | Campo `messages` não assinado (Etapa 3.6) |
| Funcionava ontem, hoje não responde | Token temporário expirou — Etapa 4 não feita ou variável não trocada |
| Verificação do webhook falha | Verify token diferente nos dois lados, app fora do ar, ou rota errada |
| Agente não responde só no número real | Phone Number ID antigo (do número de teste) na variável — Etapa 5.6 |
| Erro ao enviar pro Celular 2 (número de teste) | Celular 2 não cadastrado na lista de destinatários (Etapa 2.3) |
| Erro de permissão ao enviar | WABA não atribuída ao usuário do sistema (Etapa 4.5) |
