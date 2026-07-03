# Módulo 7 — Construção do App (Lead-se)

> **Curso:** MasterClass de Automação e Apps No Code (Claude Code + Antigravity)
> **Projeto usado:** Lead-se — app gerador de leads (raspa Google Maps via Apify, enriquece com e-mail do site via Firecrawl e dispara e-mail personalizado)
> **Status:** 8 aulas gravadas · construção completa (monetização vem no Módulo 8)
> **Duração total gravada:** ~1h38min

Este é o **terceiro projeto** do curso e o primeiro que não é só didático — é um app real e usável. O módulo ensina a **construir um web app do zero, sem escrever código**, empacotando várias APIs numa solução de nicho. A tese central: *"99% dos web apps que você vê são empacotamento de APIs voltado pra um nicho específico"* — ninguém cria API do zero, monta-se uma interface bonita por cima de APIs que fazem o trabalho pesado.

## Stack do projeto Lead-se

| Camada | Ferramenta |
|---|---|
| Construção (IA) | **Antigravity** + extensão **Claude Code** (alternados; mesmo resultado) |
| Framework | **Next.js** (full stack — *server routes* escondem as chaves do navegador + SEO da landing) |
| Estilo | **CSS vanilla** (controle fino do glassmorphism, sem amarras de biblioteca) |
| Banco de dados / Auth | **Supabase** (autenticação + tabela `configs`) |
| Raspagem (primária) | **Apify** — ator *Crawler Google Places* (Google Maps) e *CodeCrafter Lead Finder* |
| Enriquecimento (e-mail) | **Firecrawl** — entra no site da empresa e extrai e-mail + conteúdo |
| Geração de e-mail (IA) | **OpenRouter** (1 chave → todos os modelos) |
| Envio de e-mail | **Gmail** (senha de app, teste) → Instantly/Resend (profissional, depois) |
| Referências de design/copy | **Dribbble** (UI) + **leadscraper.io** (estrutura da landing) |

## Decisões travadas

- **Planejar antes de codar:** montar um **board com todas as páginas** e mandar um *print* pro Antigravity gerar a **descrição completa** do app — aumenta a assertividade desde o 1º prompt e economiza créditos/retrabalho.
- **Next.js por causa de segurança:** as requisições às APIs rodam nas *server routes*, então as chaves **nunca ficam expostas** no navegador.
- **OpenRouter no lugar de chave por IA:** uma única chave dá acesso a todos os modelos (Anthropic, OpenAI, Gemini…), com crédito num lugar só e acesso imediato a modelos novos. **Cloud Sonnet 4.6** como modelo principal e **GPT 5.3** como *fallback*.
- **Lead sem e-mail é descartado:** se não dá pra entrar em contato, não entra no banco (regra do funil).
- **Quebra-gelo (icebreaker) vem do site, não do Google Maps:** o Firecrawl extrai o conteúdo do site → a IA gera a 1ª frase personalizada do e-mail.
- **`upsert` na tabela `configs`:** sobrescreve as chaves do usuário em vez de empilhar linhas.
- **Agente do Antigravity pra trabalho paralelo:** várias conversas mudando *partes diferentes* do código ao mesmo tempo — nunca a mesma área em duas conversas.
- **Plano de tirar as chaves do cliente:** no fim, o cliente **não** insere chave de Apify/Firecrawl/OpenRouter — usa a conta do Enzo e **paga por uso**. (Implementado no Módulo 8.)

---

## Ordem didática das aulas

> A ordem de download ≠ ordem do curso. A sequência abaixo foi reconstruída pelas referências cruzadas ("na próxima aula…" / "é exatamente isso") entre os vídeos.

### Aula 1 — A Lógica de API Wrappers · 12:04
📄 [Transcrição](transcricoes-modulo-07/01-a-logica-de-api-wrappers.txt) · [com timestamps](transcricoes-modulo-07/01-a-logica-de-api-wrappers.timestamps.md)

**O que foi abordado:** a tese do projeto e o planejamento.
- **API wrapper:** empacotar APIs (Apify + Google Maps + Anthropic/ChatGPT + Gmail) numa interface de nicho — é assim que 99% dos web apps funcionam.
- **As 5 páginas do Lead-se:** landing, login/criar conta, configuração (chaves de API + prompts), raspagem (o coração) e "Meus Leads".
- **O fluxo do produto:** input simples → raspagem Apify → *fallback* Google Maps se faltar lead → enriquecimento + quebra-gelo por IA → output CSV (garante nome + e-mail + coluna "personalização").
- **Técnica:** criar um **board** das páginas e mandar print + prompt pro Antigravity gerar a descrição completa (base do desenvolvimento).

### Aula 2 — Stack Tecnológica · 08:18
📄 [Transcrição](transcricoes-modulo-07/02-stack-tecnologica.txt) · [com timestamps](transcricoes-modulo-07/02-stack-tecnologica.timestamps.md)

**O que foi abordado:** escolher o ator da Apify e definir a stack.
- **Apify e seus "atores":** cada ator raspa uma plataforma (TikTok, Instagram, LinkedIn, Google Maps…) fingindo ser um humano com IPs rotativos — necessário porque essas plataformas bloqueiam raspagem comum (Firecrawl não dá conta).
- **Atores escolhidos:** *CodeCrafter Lead Finder* (leads) e *Crawler Google Places* (Google Maps, nota 4.7).
- **Teste real:** raspou dermatologistas em Petrópolis (custou ~US$0,17; Apify dá **US$5/mês grátis**).
- Enviar as URLs dos atores pro Antigravity atualizar a descrição.

### Aula 3 — Fluxo do Usuário e Referências · 10:20
📄 [Transcrição](transcricoes-modulo-07/03-fluxo-do-usuario-e-referencias.txt) · [com timestamps](transcricoes-modulo-07/03-fluxo-do-usuario-e-referencias.timestamps.md)

**O que foi abordado:** dar referências visuais e de copy e gerar a base do código.
- **Referência de design:** print de um Web App no **Dribbble** (cores, fontes, navegação — não a função).
- **Referência de copy:** **leadscraper.io** (estrutura de landing já validada — não reinventar; nunca copiar provas sociais).
- **Landing ≠ site:** página única com âncoras (rolagem), não páginas separadas.
- A IA definiu a stack (**Next.js + Supabase + CSS vanilla**) com justificativa e gerou a base: estrutura Next.js, landing e *mock* das rotas internas (páginas interligadas pelos botões). Design da 1ª landing não agradou (será refeito).

### Aula 4 — Agentes Múltiplos e Login · 11:54
📄 [Transcrição](transcricoes-modulo-07/04-agentes-multiplos-e-login.txt) · [com timestamps](transcricoes-modulo-07/04-agentes-multiplos-e-login.timestamps.md)

**O que foi abordado:** autenticação no Supabase + paralelizar trabalho.
- **Ordem de construção** (uma página depende da outra): login → configuração → raspagem → leads.
- **Login/criar conta com Supabase:** *server actions* (senha processada no servidor), **middleware** que bloqueia rotas sem sessão válida, `env.local` com URL + chave anon do projeto.
- **Confirmação de e-mail:** novo usuário precisa confirmar o e-mail antes de logar.
- **Página configuração:** lê/grava na tabela `configs` (chaves já preenchidas ao voltar, via *upsert*); sidebar fixa com logout.
- **Agente do Antigravity:** abrir várias conversas pra fazer mudanças em paralelo (ex: trocar a fonte enquanto outra coisa roda) — sem interpolar a mesma área.

### Aula 5 — APIs no Supabase · 10:55
📄 [Transcrição](transcricoes-modulo-07/05-apis-no-supabase.txt) · [com timestamps](transcricoes-modulo-07/05-apis-no-supabase.timestamps.md)

**O que foi abordado:** conectar as chaves de API e entender o banco.
- **Modelo principal + fallback:** Sonnet 4.6 principal, GPT 5.3 de *fallback* (se o 1º falhar).
- **OpenRouter:** trocar as chaves Anthropic/OpenAI por **uma chave só** do OpenRouter (mais barato — US$5 vs US$15 mínimos — e acesso imediato a qualquer modelo novo).
- **Chaves no `env` + no app:** Apify, OpenRouter, Gmail.
- **SQL na mão:** criar/alterar a tabela `configs` rodando o SQL que a IA gera no **SQL Editor** do Supabase (entender o banco pra contornar erros).
- **Gmail (senha de app)** pra testar o envio; e-mail profissional (Instantly/Resend) fica pro fim, porque exige mexer em DNS.

### Aula 6 — Páginas, Raspagem e Leads · 14:42
📄 [Transcrição](transcricoes-modulo-07/06-paginas-raspagem-e-leads.txt) · [com timestamps](transcricoes-modulo-07/06-paginas-raspagem-e-leads.timestamps.md)

**O que foi abordado:** montar o coração do app e fechar a pipeline ponta a ponta.
- **Página de raspagem:** formulário (tipo de empresa, cidade, estado, bairro, quantidade, idioma) → ator do Google Maps.
- **Limite técnico:** *endpoint* aguarda até **300s**; em produção, migrar pra fluxo **assíncrono** (não esperar tudo terminar pra começar a próxima etapa). Vercel só pra site estático (limite 10–60s).
- **Enriquecimento com Firecrawl:** Google Maps não entrega e-mail → o Firecrawl entra no site de cada empresa, extrai o **e-mail** e o **conteúdo** (pra gerar o quebra-gelo). Filtro remove falsos positivos / sem site / sem e-mail.
- **Pipeline completa testada:** raspar contabilidades em Ipanema → 6 leads com e-mail → IA gera quebra-gelo a partir do site → "Meus Leads" → **e-mail enviado de verdade** via Gmail (rate limit ~500/dia).
- Gancho: app funciona; agora é **otimizar** e adicionar **pagamento** (custo de Apify + Firecrawl + OpenRouter → vender por 3–4× o custo).

### Aula 7 — Enriquecimento do Projeto (Parte 1): Autenticação e UX · 14:11
📄 [Transcrição](transcricoes-modulo-07/07-enriquecimento-do-projeto-parte-1.txt) · [com timestamps](transcricoes-modulo-07/07-enriquecimento-do-projeto-parte-1.timestamps.md)

**O que foi abordado:** corrigir a autenticação e a experiência de login.
- **"Esqueci minha senha":** novas telas (pedir e-mail → link de recuperação → nova senha) + config no Supabase (URL do site, URL de redirecionamento, e-mail de reset **em português**).
- **Mensagens de erro específicas** (em PT): senha errada, e-mail não confirmado (reenvia link), muitas tentativas, e-mail já cadastrado, senha fraca.
- **Senha mínima de 8 caracteres** (ajustar também no painel do Supabase, senão passa com 6).
- **Aviso de confirmação** ao criar conta (faixa verde "confirme seu e-mail").
- **Limite do Supabase:** só **2 e-mails/hora** até configurar um e-mail próprio (Resend, que exige domínio) — adiado pra produção.
- Dica recorrente: pedir pro Cloud Code **"explicar pra um leigo"** quando vier termo técnico demais.

### Aula 8 — Enriquecimento do Projeto (Parte 2): Qualidade do Produto · 15:20
📄 [Transcrição](transcricoes-modulo-07/08-enriquecimento-do-projeto-parte-2.txt) · [com timestamps](transcricoes-modulo-07/08-enriquecimento-do-projeto-parte-2.timestamps.md)

**O que foi abordado:** polir o resultado final que o app entrega.
- **Revisar o e-mail antes de enviar:** botão **"gerar prévia"** (texto editável) + **regenerar** quantas vezes quiser; o "enviar" também salva. A prévia **não é persistida** no banco — só quando o e-mail é enviado de fato.
- **Assinatura/rodapé** configurável (nome, cargo, empresa, telefone) pra o e-mail não parecer spam.
- **Exportar CSV** de "Meus Leads" (nome, categoria, e-mail, telefone, cidade, site, estado, nota, status/data de envio, quebra-gelo), com a data no nome do arquivo.
- **Busca com lupa** na tabela de leads (filtra por nome/e-mail/cidade/categoria, com contador "X de Y").
- Usou o plugin **Superpowers** do Cloud Code (desenvolvimento por **subagentes em paralelo**).
- Gancho final: **tirar as chaves do cliente** → usar a conta do Enzo e **cobrar por uso** → entra no **Módulo 8 (monetização)**.

---

## Ganchos pro Módulo 8

- A página de configuração deixa de pedir chave de Apify/Firecrawl/OpenRouter — o cliente passa a **pagar pra usar** a infra do Enzo. → `modulo-08-monetizacao.md`
- Configuração do **e-mail profissional** (Resend) + **e-mail de reset** próprio ficaram adiados pra quando o app estiver em produção (com domínio e URL pública).
- O fluxo **assíncrono** da raspagem (vs os 300s síncronos) é uma dívida técnica citada pra produção.

---

*Transcrições geradas localmente com Whisper (large-v3) na GPU. Texto pode ter pequenos erros de transcrição em termos técnicos (ex.: "Cloud Code" = Claude Code). O nome do app foi padronizado para **Lead-se** (o Whisper grafava "Leadsie/Leadzo/Lidse").*
