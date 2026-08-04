# Skill: Criar Agente de IA 🧭

Uma skill que te guia, na ordem certa, a construir o seu próprio agente de IA — do
planejamento até colocar no ar. Funciona no **Claude Code** e no **Antigravity**.

Ela é um **coach**: conduz você passo a passo, ensina o porquê de cada etapa e gera os
rascunhos, mas quem constrói e aprende é você.

## O que ela faz

Te leva por 6 passos, um de cada vez:

1. **Planejar** — o objetivo e a base de conhecimento
2. **Montar o cérebro na bancada** — um chat de teste, longe do canal
3. **Dar conhecimento e ferramentas** — aí ele vira agente de verdade
4. **Testar até convencer** — o checkpoint (não pule!)
5. **Conectar o canal** — WhatsApp, site, Instagram — só agora
6. **Produção** — blindar, colocar no ar e cobrar

**Regra de ouro:** o cérebro primeiro, o canal por último.

## Como instalar

Dentro deste pacote tem uma pasta chamada `criar-agente`. É ela que você copia.

### No Claude Code

Copie a pasta `criar-agente` pra dentro de uma destas:

- `.claude/skills/` do seu projeto — vale só naquele projeto; ou
- `C:\Users\SEU-USUARIO\.claude\skills\` (no Windows) / `~/.claude/skills/` (Mac/Linux) — vale em todos os seus projetos.

Depois, é só digitar `/criar-agente` no chat.

### No Antigravity

Copie a pasta `criar-agente` pra dentro de `.agents/skills/` do seu projeto.

Depois, peça pra criar um agente (ex.: *"quero criar um agente de IA"*) que a skill entra sozinha.

> O arquivo da skill (`SKILL.md`) é **o mesmo** pros dois ambientes — só muda a pasta onde ele fica:
> `.claude/skills/` no Claude Code e `.agents/skills/` no Antigravity.

## Estrutura do pacote

```
skill-criar-agente/
├── README.md              ← este arquivo
└── criar-agente/
    └── SKILL.md           ← a skill (copie a pasta criar-agente inteira)
```
