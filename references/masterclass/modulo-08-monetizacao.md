# Módulo 8 — Monetização

> **Curso:** MasterClass de Automação e Apps No Code (Claude Code + Antigravity)
> **Projeto usado:** Lead-se — app gerador de leads (raspa Google Maps via Apify, enriquece e-mail e dispara e-mails)
> **Status:** 7 aulas gravadas · falta só a aula final (auditoria de segurança)
> **Duração total gravada:** ~1h29min

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

---

## Pontas soltas — o que falta pra fechar o Módulo 8

- [x] ~~**Stripe em produção**~~ — **feito na Aula 7** (empresa verificada, chaves live, webhook de produção, deploy).
- [ ] **Aula final: auditoria de segurança** — anunciada no fim da Aula 7. Roteiro e script prontos em [aulas-finais-roteiro.md](aulas-finais-roteiro.md) / [aulas-finais-script.md](aulas-finais-script.md) (Aula B).
- [ ] **E-mail de sistema do Supabase (SMTP)** — a Aula 7 criou a caixa profissional (Zoho), mas **não** configurou o SMTP do Supabase; confirmação de conta/reset de senha ainda saem pelo e-mail limitado do Supabase (~2/h, cai em spam). Decidir: entra na aula final ou fica pra depois.
- [ ] **Branding do checkout** — logo da Lead-se (na Aula 7 só criou o perfil "Lead-se" no Stripe).
- [ ] **Abrir `/planos` automaticamente** ao estourar o limite grátis.
- [ ] *(Opcional/futuro)* **Mercado Pago** pra parcelamento.

---

*Transcrições geradas localmente com Whisper (large-v3) na GPU. Texto pode ter pequenos erros de transcrição em termos técnicos.*
