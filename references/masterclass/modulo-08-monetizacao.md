# Módulo 8 — Monetização

> **Curso:** MasterClass de Automação e Apps No Code (Claude Code + Antigravity)
> **Projeto usado:** Lead-se — app gerador de leads (raspa Google Maps via Apify, enriquece e-mail e dispara e-mails)
> **Status:** ✅ **MÓDULO COMPLETO** — 8 aulas gravadas; a final ("O Teste do Estranho") foi postada na Kiwify como Aula 9 (arquivo `[M8 A9]`, gravada ~03/07, postada até 06/07/2026)
> **Duração total gravada:** ~2h05min

Este módulo ensina a **monetizar** um app no-code: escolher o modelo de cobrança, montar o gateway de pagamento (Stripe), hospedar em servidor e amarrar tudo ao banco de dados (Supabase), além de polir o produto (raspagem + front) antes de lançar.

## Stack do projeto Lead-se

| Camada | Ferramenta |
|---|---|
| Construção (IA) | **Antigravity 2.0** (ex-Agent Manager) — "VS Code embelezado" pelo Google |
| Banco de dados / Auth | **Supabase** |
| Pagamento | **Stripe** (Mercado Pago citado p/ parcelamento) |
| Hospedagem | **Railway** (HTTPS + URL pública; caro pra escalar → VPS depois) |
| Repositório | **GitHub** privado (push → auto-deploy no Railway) |
| Raspagem | **Apify** (ator do Google Maps) |
| Localização | **API do IBGE** (estado/cidade) + **Brasil Aberto** (bairro) |
| Geração de e-mail | OpenRouter / Anthropic |
| Apoio de gravação | **Whisper Flow** (ditado por voz) |

## Decisões travadas

- **Modelo de cobrança: Freemium** (baseado em uso também serviria).
- **Planos:**
  - **Grátis** — 20 leads · 10 e-mails · 3 raspagens / mês
  - **Pro — R$ 50/mês** — 200 leads · 100 e-mails · 20 raspagens / mês
  - **Ultra — R$ 150/mês** — 1.000 leads · 500 e-mails · 100 raspagens / mês
- **Segurança:** nunca enviar chave secreta pra IA — chaves sensíveis (ex: `service_role` do Supabase) configuradas **à mão** no Railway.
- *(Obs: a aula conceitual "Gateway de Pagamento" usa preços de exemplo — R$50/R$99/empresarial — que **não** são os finais. Os finais são os de cima.)*

---

## Ordem didática das aulas

> A ordem de gravação/download ≠ ordem do curso. A sequência abaixo foi reconstruída pelas referências cruzadas ("na próxima aula…") dentro de cada vídeo.

### Aula 1 — Modelos de Precificação · 07:39
📄 [Transcrição](transcricoes-modulo-08/01-modelos-de-precificacao.txt) · [com timestamps](transcricoes-modulo-08/01-modelos-de-precificacao.timestamps.md)

**O que foi abordado:** os 4 modelos de cobrança e a escolha pro Lead-se.
- **Freemium** — grátis com limites, paga pra liberar (ex: Spotify: anúncios + não escolhe música no grátis). No Lead-se: captura X leads grátis, depois assina; dá pra bloquear features (ex: exportar CSV = recurso Pro).
- **Premium** — só acessa pagando (Netflix, Disney+). Bom pra marca já relevante; barreira de entrada alta (cliente não testa antes).
- **Baseado em uso** — créditos por uso (Apify dá US$5/mês). Margem previsível, mas efeito "taxímetro" (cliente calcula preço por lead e compara).
- **Teste grátis** — acesso ilimitado por X dias, depois assina.
- **Decisão: Freemium.**
- **Lógica de margem:** no freemium o uso por cliente varia muito (uns dão prejuízo extraindo milhares, outros dão lucro extraindo pouco). Precificar pela **média** (ex: média 200 leads; se custa ~R$30, cobrar ≥ R$99 pra ter margem). Tema aprofundado no módulo de empreendedorismo.
- **3 passos finais do módulo:** implementar pagamento → hospedar em servidor → auditoria de segurança.

### Aula 2 — Gateway de Pagamento (conceito) · 07:41
📄 [Transcrição](transcricoes-modulo-08/02-gateway-de-pagamento.txt) · [com timestamps](transcricoes-modulo-08/02-gateway-de-pagamento.timestamps.md)

**O que foi abordado:** como um gateway funciona, ponta a ponta.
- **Fluxo:** página de planos (na landing + dentro do app) → cliente escolhe plano → vai pro **checkout do gateway** → paga → gateway dispara **webhook** pro servidor → atualiza **Supabase** → libera acesso.
- **Por que usar gateway (e não processar você mesmo):** segurança + credibilidade. A URL do checkout é do gateway (ex: `mercadopago.com.br/lead-se`), não do seu app. Dica de ouro: nunca colocar dados de cartão numa URL do próprio vendedor (sinal de golpe).
- **Stripe** = maior do mundo, mais fácil. **Mercado Pago** = quando precisa de parcelamento.
- **Webhooks são instantâneos** (vs API, que precisa ficar perguntando) — liga com a aula de APIs/Webhooks/MCPs. Tipos de evento: fatura paga, assinatura cancelada/expirada, falha de pagamento (cartão recusado), cada um com JSON (e-mail/ID do cliente + valor/motivo).
- **Supabase = fonte de verdade** do que cada cliente pode usar (plano + limites/créditos).

### Aula 3 — Integração Stripe (Parte 1): MCPs, planos e checkout · 14:10
📄 [Transcrição](transcricoes-modulo-08/03-stripe-mcps-planos-checkout.txt) · [com timestamps](transcricoes-modulo-08/03-stripe-mcps-planos-checkout.timestamps.md)
*(arquivo original: "[Integração com o Stripe Hospedagem no Railway]")*

**O que foi abordado:** preparar Stripe + Supabase + tela de planos.
- Migração pro **Antigravity 2.0**; como abrir a IDE a partir do projeto.
- Conectar **MCP do Railway** (config JSON do site oficial; instruções de VS Code servem). **Gotcha:** se não conectar, o tipo provavelmente é **SSE**, não HTTP.
- Conectar **MCP do Stripe** (nativo no Antigravity 2.0: Configurações → Modelos → Customizações → adicionar MCP). Pede só a **chave secreta (SK)**.
- Reiniciar o Antigravity pros MCPs subirem.
- **Criar planos no Stripe via MCP:** Pro R$50 e Ultra R$150 (grátis não precisa). Stripe devolve os **IDs**.
- **Supabase:** criar tabela de inscrição/plano + **trigger** que coloca todo novo usuário no grátis e zera o uso do mês.
- **Criar página `/planos`:** 3 cards (grátis/pró/ultra) lado a lado mostrando plano atual e uso; + link na sidebar.
- **Botão "fazer upgrade"** → redireciona pro checkout do Stripe (volta com sucesso/cancelamento). Envia SK + PK, instala pacotes do Stripe.
- Verificação da empresa no Stripe fica pra depois (precisa de URL pública).

### Aula 4 — Integração Stripe (Parte 2): Railway, webhooks e limites · 16:59
📄 [Transcrição](transcricoes-modulo-08/04-stripe-railway-webhooks-limites.txt) · [com timestamps](transcricoes-modulo-08/04-stripe-railway-webhooks-limites.timestamps.md)

**O que foi abordado:** testar pagamento, hospedar e fechar o ciclo até o banco.
- **Testar checkout:** cartão de teste **4242 4242 4242 4242** finge compra aprovada (não cobra); dados errados = recusado. Continua grátis pq é teste.
- **Por que hospedar:** o Stripe precisa mandar o webhook pra um servidor público; em localhost só com a CLI do Stripe. Melhor já hospedar.
- **Deploy no Railway (via MCP):** Railway puxa o repo do GitHub e sobe com HTTPS + URL pública. Primeiro manda o projeto pro GitHub; **GitHub↔Railway = auto-deploy a cada push**.
  - **Variáveis de ambiente** (chaves) ficam no Railway, não no código. A **`service_role` do Supabase** o Enzo coloca **manualmente** (nunca mandar chave secreta pra IA).
  - **Custo:** Railway é ótimo pra dev/projeto pequeno; **caro pra escalar** → VPS (Hostinger etc.) com muitos clientes.
  - CLI expirada (Railway/Supabase) = relogar pelo terminal (mostrou como).
- **Webhooks Stripe → Supabase:** pago → sobe plano · cancelou → volta grátis · falhou → marca atrasado (2 dias de tolerância ou corta na hora). Webhook aponta pra URL do Railway.
- **SQL manual** no Supabase (SQL Editor) — política de segurança não deixa criar coluna via API externa.
- **Limites + barras de progresso:** backend confere plano em tempo real; estourou → erro elegante levando pra `/planos`. Barras 0–100% (80% laranja, 100% vermelho).
- **Estado final:** front completo · auth (Supabase) · faturamento (checkout Stripe) · webhooks · infra (Railway HTTPS) · DB (Supabase) · código no GitHub privado.
- **Pendências citadas:** (a) ao pedir 10 leads, entregar 10 *com e-mail* (→ Aula 5); (b) verificar empresa + branding do checkout quando tiver URL.

### Aula 5 — Aprimorando a Raspagem · 10:05
📄 [Transcrição](transcricoes-modulo-08/05-aprimorando-a-raspagem.txt) · [com timestamps](transcricoes-modulo-08/05-aprimorando-a-raspagem.timestamps.md)

**O que foi abordado:** deixar o motor de raspagem "redondo".
- **Raspagem em loop:** o ator da Apify traz empresas (muitas sem e-mail); roda rodadas extras até bater a quantidade pedida **com e-mail**. (Usou Gemini 3.1 Pro High — recomenda os melhores modelos pra backend.)
- **Trava de segurança:** 3 buscas sem empresa nova (ou Google Maps vazio) → para, entrega o que tem, mensagem amigável. Evita loop infinito + estouro de créditos da Apify (ex: "fabricante de foguete em Grumari").
- **Dropdowns de localização:** estado/cidade via **API do IBGE**; bairro via **Brasil Aberto** (precisa de chave). Resolve imprecisão (vinha Jardim Botânico ao pedir Ipanema). Menu: estado → cidade → bairro, na formatação que o ator da Apify pede.
- **Dedup:** ignora empresas que já estão em "Meus Leads" após cada loop (sem leads repetidos).
- Testes: subiu a conta pra Pro direto no Supabase (limite grátis de 3 raspagens estourou).

### Aula 6 — Aprimorando o Frontend · 16:21
📄 [Transcrição](transcricoes-modulo-08/06-aprimorando-o-frontend.txt) · [com timestamps](transcricoes-modulo-08/06-aprimorando-o-frontend.timestamps.md)

**O que foi abordado:** redesign do app + landing.
- **Fluxo de trabalho visual:** prints + **Whisper Flow** (ditado, Ctrl+Win) pra explicar mudanças enquanto navega; "marcação rápida" (desenhar no print) pra indicar layout.
- **Teoria de cores:** complementares (lados opostos do círculo — as 2 cores principais do app), análogas (vizinhas — usar como 3ª/4ª cor), monocromático. Ex: hover laranja complementar ao verde.
- **Configurações:** remover toda config de chave de API (cliente não insere chave — usa a do Enzo e paga pra usar). Manter só: prompt de personalização do e-mail, assinatura/rodapé, e passo a passo (4 cards) da senha de app do Google + aviso de "em breve, conectar com 1 clique".
- **Sidebar fixa** (sticky), "Minha Conta" sempre visível.
- Renomear **"Raspagem" → "Buscar Leads"**; tirar o jargão "leads" da copy da landing (termo que leigo entenda).
- **Simulador interativo na landing:** card que simula extração (empresas fictícias, envio de e-mail simulado), trava em 5, avisa que é simulação. Corrigiu 2 erros de React mandando **print do erro** pro Antigravity. Sinaliza simulação com verde piscando.

### Aula 7 — Domínio, E-mail Profissional e Stripe em Produção · 15:41
📄 Transcrição no Obsidian (seção "Aula 07" da página do Módulo 8) · gravada em 23/06

**O que foi abordado:** tirar o app do modo teste — endereço próprio, e-mail da empresa e pagamento de verdade.
- **Por que o domínio vem primeiro:** a verificação da empresa no Stripe pede uma URL; se verificar com a URL do Railway e trocar depois, risco de **conta bloqueada**. Então: domínio antes do Stripe.
- **Domínio próprio:** comprado na **Hostinger** (`leadse.com.br`; o `.ai` estava ~R$470 — descartado). **DNS → Railway:** em Settings → Networking → Custom Domain o Railway entrega os registros (CNAME + TXT); **apagar os DNS antigos antes** (o `@` antigo conflita e mandaria o domínio pra 2 servidores). Propagação: de 1min a 2h (geralmente <5min).
- **E-mail profissional grátis (Zoho Mail):** o plano grátis sumiu da home, mas continua vivo por **link direto** (vai na descrição da aula). Verificação de posse por registro TXT + **3 registros MX** (prioridades 10/20/50) + **SPF** + **DKIM**. Criou `atendimento@leadse.com.br`.
- **Stripe em produção:** alternar pra conta de produção → passo a passo (URL do domínio, categoria Software, **descrição honesta** do produto — ajuda na análise —, descrição do extrato, contato). Copiou os produtos Pro/Ultra do teste, mas **em produção os price IDs mudam** (planos recriados do zero).
- **Prompt de transição teste→produção (Antigravity):** pedir pra analisar o projeto e listar tudo que muda entre ambientes — IDs dos planos, chaves, webhook, variáveis — deixando a IA livre pra achar o que passou batido. **Price IDs podem ir pelo chat** (não são segredo); **chaves vão direto no Railway**, na mão.
- **4 passos executados:** (1) chaves live no Railway · (2) planos recriados + novos price IDs · (3) **webhook de produção** com 3 eventos — compra concluída, assinatura cancelada/expirada, falha de pagamento — apontando pra `leadse.com.br/api/webhook`, com o segredo de assinatura no Railway · (4) variáveis de ambiente (URL do site + price IDs novos) → **deploy**.
- **Fecha anunciando a próxima aula:** *"só precisa fazer uma varredura de segurança, que é o que a gente vai fazer na próxima aula."*

### Aula final — O Teste do Estranho · 36:24 *(postada como Aula 9, arquivo `[M8 A9]`)*
📄 Transcrição no Obsidian (fonte do Módulo 8) · gravada ~03/07 · **substitui a live de 26/06 que não aconteceu** — cobre tudo que a live abordaria

**O que foi abordado:** a varredura final que transforma o protótipo em produto — a jornada do estranho em 5 etapas.
- **Frame da aula:** pronto ≠ no ar. Pronto é quando **um estranho** percorre a jornada sozinho: **entrar → virar cliente → confiar → não abusar → dar lucro**. Frase-âncora: *"protótipo é o que funciona pra mim; produto é o que funciona pra um estranho que me paga e que eu não conheço."*
- **1. ENTRAR (e-mail de sistema via Resend):** o e-mail de confirmação saía pelo Supabase (`no-reply@mail.app.supabase.io`, ~2 e-mails por período — mata o funil e parece golpe). Solução: conta no **Resend** → adicionar domínio `leadse.com.br` (região Brasil) → registros DNS na Hostinger (DKIM + SPF obrigatórios, DMARC opcional, MX) → verificado em ~5 min → **SMTP customizado no Supabase** (Authentication → Emails): remetente `nao-responda@leadse.com.br`, host `smtp.resend.com`, porta 465, usuário `resend`, senha = API key do Resend. **Rate limit do Supabase subido de 30 → 120 e-mails/h.** URL Configuration: Site URL = `leadse.com.br` + redirect `/auth/confirm` (mantendo a URL local pra testes).
- **Templates de e-mail personalizados:** Claude Code gerou HTML de confirmação de conta + reset de senha com a logo (hospedada no bucket público `assets` do Supabase — a URL pública entra no HTML). Gotcha ensinado: e-mail "não responda" **sem foto de perfil é o padrão do mercado** (foto exigiria certificado VMC, +US$ 1.000/ano — ignorar).
- **Extra de fluxo:** título da tela de cadastro trocado ("Crie a sua conta" / "conecte-se e escale sua operação"); rodar o app **localmente** pra testar e só depois mandar lote de mudanças pro Railway (economiza tempo e tokens); `/clear` entre tarefas não relacionadas; modelo simples (Sonnet) pra mudança simples, melhor modelo pra auditoria.
- **2. VIRAR CLIENTE (o limite vira conversão):** estourou o grátis = "momento de ouro" — o usuário provou que quer mais. Prompt mudou **só a reação da interface** (checagem do servidor intacta): a IA optou por **aviso com botão** (em vez de redirect automático) → leva pra `/planos` com o plano recomendado destacado. Testado ao vivo estourando as 3 raspagens do grátis.
- **3. CONFIAR (branding do checkout):** Stripe → Configurações → Empresa → Marca: ícone + logo (extraídos pelo Claude Code, texto em verde), fundo branco, cor de destaque verde. Lição: **branding de MVP não é prioridade** — polir depois de validar com clientes.
- **4. NÃO ABUSAR (auditoria de segurança):** documento-guia (PDF na descrição da aula) enviado ao Claude Code no Antigravity; usar **o melhor modelo disponível** (usou Opus 4.8). A IA corrigiu 7 de 9 itens sozinha: segredos fora do repositório, autenticação no checkout, middleware, redirecionamento, **erros que não vazam detalhes**, dependências vulneráveis (3→0), **cota anti-abuso de IA** (impede bot de torrar créditos Apify/IA via injeção de prompt). 2 itens manuais: **migração SQL** no SQL Editor + **rotação de chaves** (Supabase secreta/publicável + token de acesso + Brasil Aberto — atualizar `.env` local E Railway) e **purge do histórico do Git** (a própria IA rodou; histórico reescrito no GitHub). Regra: chave que já foi commitada está vazada — rotacionar sempre. Fim: críticos e altos zerados, só restaram baixos/opcionais.
- **5. DAR LUCRO (conceitual, ponte pro módulo de empreendedorismo):** infra é sua — mais cliente pode ser mais prejuízo; precificar pela **média de uso** (precisão real só com 10/50/100 clientes); margem **3–4×** (colchão pra marketing e alta de custos); alternativa a subir preço: **apertar limites**; liberar grátis pros primeiros testers acharem os erros; MVP escala até ~1k clientes — 10k/100k exige equipe e diferencial próprio (ex.: raspagem própria no lugar da Apify); virar "head de marketing" do produto ou ter **sócio de marketing**.
- **Anúncio:** quando o curso finalizar, o Lead-se será liberado pra todos os alunos testarem.

---

## Pontas soltas — o que falta pra fechar o Módulo 8

**TODAS FECHADAS na aula final (O Teste do Estranho):**

- [x] ~~**Stripe em produção**~~ — feito na Aula 7 (empresa verificada, chaves live, webhook de produção, deploy).
- [x] ~~**Aula final: auditoria de segurança**~~ — gravada e postada (rotação de chaves, purge do Git, cota anti-abuso, RLS/migração SQL).
- [x] ~~**E-mail de sistema do Supabase (SMTP)**~~ — Resend configurado + templates HTML personalizados (confirmação + reset de senha).
- [x] ~~**Branding do checkout**~~ — logo, ícone e cor da Lead-se no Stripe.
- [x] ~~**Abrir `/planos` ao estourar o limite**~~ — aviso com botão + plano recomendado destacado.
- [ ] *(Opcional/futuro, fora do MVP)* **Mercado Pago** pra parcelamento — citado como evolução, não entra.

---

*Transcrições geradas localmente com Whisper (large-v3) na GPU. Texto pode ter pequenos erros de transcrição em termos técnicos.*
