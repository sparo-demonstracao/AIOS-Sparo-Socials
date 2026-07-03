# Base de Conhecimento — MasterClass de Automação e Apps No Code

Índice mestre do curso do Enzo (Claude Code + Antigravity). Aqui fica **todo o conhecimento e tudo que foi abordado** em cada aula, organizado por módulo. Conforme novas aulas forem transcritas, esta base cresce.

## Sobre o curso

Ensina **leigos em programação** a criar automações e apps **sem escrever código**, usando Claude Code e Antigravity. O fio condutor são projetos práticos construídos do zero — o **Lead-se** (app gerador de leads) é o **terceiro projeto**: **construído no Módulo 7** e **monetizado no Módulo 8**.

## Módulos

| # | Módulo | Status | Documento |
|---|---|---|---|
| **1** | **Introdução ao Antigravity** | 7 aulas ✅ transcrito · 📚 no Obsidian | *Obsidian → `Módulo 1 — Introdução ao Antigravity (transcrição)`* |
| **2** | **Fundamentos Iniciais** | 4 aulas ✅ transcrito · 📚 no Obsidian | *Obsidian → `Módulo 2 — Fundamentos Iniciais (transcrição)`* |
| **3** | **Memória** | 6 aulas ✅ transcrito · 📚 no Obsidian | *Obsidian → `Módulo 3 — Memória (transcrição)`* |
| **4** | **Segurança Base** | 4 aulas ✅ transcrito · 📚 no Obsidian | *Obsidian → `Módulo 4 — Segurança Base (transcrição)`* |
| **5** | **Primeiro Aplicativo (Front + Back + Banco)** | 6 aulas ✅ transcrito · 📚 no Obsidian | *Obsidian → `Módulo 5 — Primeiro Aplicativo (transcrição)`* |
| **6** | **Engenharia de Software** | 4 aulas ✅ transcrito · 📚 no Obsidian | *Obsidian → `Módulo 6 — Engenharia de Software (transcrição)`* |
| **7** | **Construção do App (Lead-se)** | 8 aulas ✅ · ~1h38min · 📚 transcrição no Obsidian | [modulo-07-construcao.md](modulo-07-construcao.md) *(resumo)* |
| **8** | **Monetização** | 7 aulas ✅ · falta 1 aula (auditoria de segurança) · 📚 transcrição no Obsidian | [modulo-08-monetizacao.md](modulo-08-monetizacao.md) *(resumo)* |
| 9? | Empreendedorismo *(citado como "último módulo")* | a gravar/transcrever | — |

> **Transcrições migradas pro Obsidian (25/06/2026):** todas as transcrições completas dos **Módulos 1 a 8** agora vivem no segundo cérebro (vault `Enzo Barbatto`, como páginas de fonte `MasterClass Antigravity — Módulo N — ... (transcrição)`). As pastas locais `transcricoes-modulo-01..08/` foram **removidas pra economizar tokens** — o conteúdo (texto corrido) está seguro no Obsidian; os timestamps `.timestamps.md` não foram pro vault, mas são regeneráveis pelo pipeline Whisper se precisar. **Continuam aqui** os documentos-resumo `modulo-07-construcao.md` e `modulo-08-monetizacao.md` (docs de trabalho do `/roteiro-aula`); falta gerar os resumos `modulo-0N-nome.md` dos Módulos 1–6. Curso inteiro gravado (M1–M8) transcrito; o PLANO do `/roteiro-aula` pode ser feito com base completa (puxando as transcrições do Obsidian).

> **Aulas finais:** a **Aula A (colocar no ar)** já foi gravada — é a **Aula 7 do Módulo 8** (23/06: domínio + e-mail profissional + Stripe em produção; obs: usou **Zoho Mail** pro e-mail da empresa e **não** configurou o SMTP do Supabase, que era o passo A4 do roteiro). **Falta gravar só a aula final (Aula 8)** — roteiro pronto:
> - [roteiro-modulo-08-aula-final.md](roteiro-modulo-08-aula-final.md) — **o roteiro de gravação da Aula 8 "O Teste do Estranho"**: SMTP/Resend + conversão no limite + branding do checkout + auditoria de segurança + margem. Fecha o Lead-se como MVP.
> - [aulas-finais-roteiro.md](aulas-finais-roteiro.md) / [aulas-finais-script.md](aulas-finais-script.md) — os documentos-base (mapa das 3 perguntas + script original das Aulas A/B) que geraram a Aula 7 e a Aula 8.

## Módulo 8 — Monetização (resumo de 1 linha por aula)

1. **Modelos de Precificação** — freemium, premium, baseado em uso, teste grátis; escolha do freemium.
2. **Gateway de Pagamento (conceito)** — fluxo plano → checkout → webhook → Supabase; por que usar gateway.
3. **Integração Stripe — Parte 1** — Antigravity 2.0, MCPs (Railway + Stripe), criar planos, página `/planos`, botão de checkout.
4. **Integração Stripe — Parte 2** — testar (cartão 4242), deploy no Railway, webhooks → Supabase, limites + barras de progresso.
5. **Aprimorando a Raspagem** — loop até N leads com e-mail, trava de segurança, dropdowns IBGE/Brasil Aberto, dedup.
6. **Aprimorando o Frontend** — redesign, teoria de cores, tirar config de API, sidebar fixa, simulador na landing.
7. **Domínio, E-mail Profissional e Stripe em Produção** — domínio na Hostinger + DNS→Railway, e-mail no Zoho (MX/SPF/DKIM), Stripe em produção (chaves live, planos recriados, webhook, env, deploy).

**Falta pra fechar o módulo:** aula final de auditoria de segurança (Aula B) · SMTP do Supabase (decidir se entra) · branding do checkout · abrir `/planos` no limite · (opcional) Mercado Pago. Detalhes em [modulo-08-monetizacao.md](modulo-08-monetizacao.md#pontas-soltas--o-que-falta-pra-fechar-o-módulo-8).

## Como esta base é organizada

```
references/masterclass/
  INDICE.md                      ← este arquivo (índice mestre do curso)
  modulo-07-construcao.md        ← conhecimento do módulo 7 (resumo de cada aula + decisões)
  modulo-08-monetizacao.md       ← conhecimento do módulo 8 (resumo de cada aula + decisões)
  aulas-finais-roteiro.md / aulas-finais-script.md
  (transcrições completas → Obsidian, vault "Enzo Barbatto", páginas "MasterClass Antigravity — Módulo N — ... (transcrição)")
```

**Pra adicionar um módulo novo:** transcreva as aulas (ver memória `transcricao-local-whisper`), envie a transcrição pro Obsidian (skill `/obsidian`, padrão `MasterClass Antigravity — Módulo N — Nome (transcrição).md`), crie aqui só o `modulo-XX-nome.md` (resumo) e registre o módulo na tabela acima.
