# Decisions Log

Append-only record of meaningful decisions and why they were made. `/level-up` Phase 2 (Method interview) writes scoped automation specs here. You can also append manually whenever you decide something worth remembering.

**Format per entry:**

```
## YYYY-MM-DD — Short title

**Decision:** what was decided.

**Why:** the reasoning, constraints, and what would change your mind.

**Alternatives considered:** what else was on the table.

**Owner:** who's accountable.
```

Keep it terse. Future-you will thank present-you for capturing the *why*, not just the *what*.

---

## 2026-06-21 — YouTube Studio: focar só em números públicos por enquanto

**Decision:** Para o domínio de receita, conectar apenas os **números públicos** do YouTube
(visualizações, inscritos, likes, comentários — via conexão YouTube do mcp.ai). O **faturamento
privado do Studio** (receita, RPM, tempo de exibição) fica **adiado**.

**Why:** Os números públicos já estão ao alcance, de graça (1 consulta grátis restante, depois
R$ 9,90/mês). Já o faturamento privado exige criar projeto no Google Cloud e configurar a API de
Analytics do YouTube com OAuth — processo técnico e demorado, sem conector pronto. O custo de
montar não se justifica agora; a receita principal já é acompanhada pela Kiwify (conectada).

**Alternatives considered:** (a) Montar a API de Analytics do YouTube agora — descartado pelo
esforço. (b) Ignorar o YouTube por completo — descartado, pois os números públicos têm valor e
custo baixo.

**Owner:** Enzo. Revisar quando tráfego pago/escala exigir acompanhar receita do canal de perto.

**Update (mesmo dia, 2026-06-21):** Decisão revertida — o Enzo quis conectar o faturamento privado
na hora. Feito com sucesso: projeto Google Cloud "AIOS YouTube", OAuth da conta dona do canal,
acesso à YouTube Analytics API (gratuito). Guia em `references/youtube-studio-api.md`. Conclusão
útil: o setup levou ~30 min e o custo era zero; o "trabalho" não era tão grande quanto estimei.

---

## 2026-06-22 — Conectar a Google Workspace CLI (`gws`)

**Decision:** Instalar e conectar a `gws` (Google Workspace CLI oficial) como mecanismo de script
pro Google Workspace, na conta `agenciasparo@gmail.com`, reusando o projeto GCP `aios-sparo-yt`.
Escopos de **leitura + escrita** em Drive, Gmail (inclui envio via `gmail.modify`), Calendar, Docs
e Sheets. Credenciais criptografadas (AES-256-GCM) em `~/.config/gws/`. Guia em
`references/gws-cli.md`.

**Why:** Uma só ferramenta cobre Gmail/Calendar/Drive (que já tinham MCP) **e abre Docs/Sheets/
Slides/Tasks**, antes inalcançáveis — base pra automações que produzem artefatos (Doc de roteiro,
planilha de vídeos, resumo semanal). Saída em JSON, pensada pra agente de IA. Reusar o projeto do
YouTube evitou criar infra nova.

**Alternatives considered:** (a) `gws auth setup` 100% automático — **não dá**, o Google exige criar
o cliente OAuth no Console manualmente (limitação do Google, não da ferramenta). (b) Só MCP do
mcp.ai — não cobre Docs/Sheets. (c) Escopo só leitura — preterido; o Enzo quis já poder
criar/enviar (Regra do Estagiário: começar restrito ficou pra trás conscientemente).

**Gotcha registrado:** no Windows PowerShell 5.1 o JSON do `--params` quebra (aspas/espaços). Usar a
ferramenta **Bash** com aspas simples. Subcomandos são camelCase (`calendarList`, `getProfile`).

**Owner:** Enzo. Reduzir escopos (ex.: voltar a readonly) ou criar identidade própria pra IA
(Regra do Estagiário) se/quando for operar em modo mais autônomo.
