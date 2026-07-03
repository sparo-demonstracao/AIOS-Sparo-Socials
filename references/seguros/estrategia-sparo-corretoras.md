# A jogada de mestre — Sparo para corretoras de seguros

> Documento-norte da estratégia. Destila as duas pesquisas
> (`pesquisa-automacao-corretoras.md` = a dor; `demanda-o-que-procuram.md` = a procura) numa
> única jogada. Tudo aqui aponta pra meta do trimestre: **5 clientes recorrentes na Sparo.**

---

## A jogada em uma frase

**Você não vende automação pra corretora. Você ENSINA (seu superpoder), DEMONSTRA na corretora da
sua tia (prova viva e grátis) e ENTREGA um produto replicável de assinatura. A educação é o funil,
o "Corretora no Piloto" é a oferta, o sindicato é a distribuição.**

Nome interno: **"Ensina pra vender, entrega pra escalar."**

---

## Por que é ESSA jogada (e não outra)

Olha quem está no jogo e o que cada um NÃO consegue fazer:

- **Vendedores de ferramenta** (Beeia, Segura/Helena, BotZz, AgentCorr): vendem um SaaS pra corretora configurar sozinha. **Não ensinam, não entregam montado, não integram.** Vários são commodity quase grátis.
- **Quem ensina** (Sincor-RJ, ENS, cursos de IA): dá a teoria. **Não entrega nada construído.**

**Você é o único que faz os DOIS: ensina a prática E entrega montado.** Esse é o fosso. E ele se
apoia em três coisas que nenhum concorrente tem juntas:

1. **Você é professor de automação no-code** — criar conteúdo e ensinar é o que você já faz.
2. **Distribuição quente** — a tia indica caso a caso + o Sincor-RJ está evangelizando IA agora.
3. **Demo vivo grátis** — a corretora da tia rodando o sistema = prova + motor de indicação.

A jogada usa os três ao mesmo tempo. Qualquer abordagem que ignore um deles é jogar fora vantagem.

---

## O produto replicável: "Corretora no Piloto"

**Uma arquitetura-mãe no n8n**, parametrizada por corretora. Não é projeto sob medida toda vez —
é o MESMO sistema com variáveis de onboarding.

- **Carro-chefe:** Radar de Renovação (dispara da carteira via CSV — não compete com o ERP, senta em cima).
- **+ Atendente no WhatsApp** (qualifica e entrega o lead pronto) **+ pacote LGPD** (consentimento, canal seguro, log).
- **Replica porque** a dor (renovação) e o formato dos dados (carteira com vencimentos) são quase
  idênticos de corretora pra corretora. O "mapa de seguradoras" (Porto/Bradesco/Amil...) é um ativo
  único, reaproveitado em TODAS as clientes.
- **Onboarding:** 1ª corretora (a da tia) = 2-3 semanas montando a arquitetura. Da 2ª em diante =
  **1-2 dias** (preencher onboarding + importar CSV + apontar o número).
- **Recorrência:** setup R$ 800-2k (grátis pras primeiras, por depoimento) + **R$ 300-700/mês**.
  São esses os 5 clientes recorrentes da meta.

---

## O motor de clientes (a sacada que vira flywheel)

```
ENSINA  →  DEMONSTRA  →  ENTREGA  →  FILMA  →  atrai mais corretoras  →  ENSINA...
(oficina) (corretora    (Corretora  (YouTube/                          (de novo, em escala)
          da tia)       no Piloto)  Instagram)
```

1. **Ensina:** oficina prática "Automação com IA na corretora, na prática" pelo canal da tia / Sincor-RJ. Você não chega como vendedor — chega como autoridade. (E o sindicato JÁ cobra por formação de IA: a demanda existe e é paga.)
2. **Demonstra:** na oficina e nos 1:1, mostra o sistema **rodando na corretora da tia**. Ver funcionando = desejo.
3. **Entrega:** fecha o "Corretora no Piloto" — montado, integrado, cuidado. Lidera pela **renovação** (receita protegida), não por "tenho IA".
4. **Filma tudo:** cada build e cada caso vira conteúdo de YouTube/Instagram. **Isso resolve DUAS metas do seu trimestre com um esforço só** — conteúdo (8 vídeos/mês, lançar Instagram) E clientes da Sparo. Cada corretora automatizada = um case = mais corretoras (inclusive de fora do RJ). O produto replicável escala nacional pelo seu conteúdo.

---

## A sequência (o que fazer, em ordem)

1. **Cliente zero:** sessão funda na corretora da tia (kit em `descoberta-corretoras.md`) → construir o Radar lá → **fazer funcionar e MEDIR** (renovações recuperadas).
2. **Plugar na onda do Sincor-RJ:** entrar no evento de IA de 30/jun (recon + relação com o organizador Arley Boullosa).
3. **Empacotar:** a oficina + a oferta "Corretora no Piloto" (preço, escopo, termo LGPD).
4. **Fechar os 3-5 primeiros** via oficina + indicações da tia. Setup grátis pelos primeiros depoimentos.
5. **Filmar e publicar** → inbound nacional → escalar o produto replicável.

---

## As 2 regras que protegem a jogada

1. **Qualidade no cliente zero é sagrada.** A corretora da tia é a sua vitrine e a reputação da tia.
   Se quebrar, queima os dois. Nail it antes de mostrar pra qualquer um.
2. **Não prometa integração nativa com o ERP.** No V1 é **export CSV**. Prometer API que não existe
   é a forma mais rápida de não entregar e perder a indicação.

---

## O que explicitamente NÃO fazer

- ❌ Vender "chatbot 24/7" como produto principal (commodity quase grátis — Segura/Helena).
- ❌ Fazer projeto sob medida do zero a cada cliente (mata a margem e a replicabilidade).
- ❌ Competir com multicálculo/ERP (Segfy/Agger/Quiver) — integrar, nunca competir.
- ❌ Citar estatística de fornecedor não verificada (ver lista em `demanda-o-que-procuram.md`).
