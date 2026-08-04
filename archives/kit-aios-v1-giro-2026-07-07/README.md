# AIOS Automatize-se

**Não é um chat. É um contratado.**

Este kit transforma o Claude Code (ou o Antigravity) num **AIOS** — um "sistema operacional de IA" pessoal. Em vez de abrir um chat vazio toda vez e explicar tudo de novo, você contrata um funcionário digital: ele aprende quem você é, o que você vende e pra quem, ganha acesso às ferramentas do seu dia (e-mail, agenda, planilha, WhatsApp) e passa a entregar trabalho pronto — uma automação nova por semana. Você não precisa saber programar. Você só precisa responder perguntas e revisar entregas.

Sendo honesto: o kit não faz mágica no primeiro dia. No começo, seu AIOS é um contratado novo — sabe pouco, pede aprovação pra tudo e erra como todo estagiário. A diferença é que ele tem um método pra evoluir: o **Método GIRO** (o ritual semanal que entrega uma automação por vez) e o **Raio-X do AIOS** (o exame de 100 pontos que mostra em que estágio ele está e o que tratar primeiro). Seguindo o kit, a meta é clara: sair de *Enfeite* pra *Operário* no primeiro mês — um sistema que entrega trabalho terminado toda semana.

## Pra quem é

- **Donos de pequenos negócios** que perdem horas com tarefa repetida: responder o mesmo WhatsApp, montar a planilha de segunda, cobrar quem atrasou o Pix.
- **Quem quer abrir uma agência de automação** e precisa de um método pra entregar valor de verdade, não só demos bonitas.
- **Profissionais** que querem automatizar o próprio trabalho antes que alguém automatize por eles.

Se você nunca escreveu uma linha de código, está no lugar certo. Tudo aqui é em português e em linguagem de gente.

## O que vem dentro

**3 skills** (comandos que você roda no Claude Code ou no Antigravity):

- **`/primeiro-dia`** — a entrevista de contratação: seu AIOS aprende quem você é, o que você vende, suas metas e sua voz, e monta toda a estrutura de arquivos.
- **`/raio-x`** — o exame do funcionário: 4 chapas, 100 pontos, sua faixa de maturidade (Enfeite → Assistente → Operário → Sócio) e os 3 tratamentos mais urgentes.
- **`/giro-semanal`** — o ritual de trabalho: toda semana ele Garimpa, Isola, Roda e Observa — e entrega UMA automação nova rodando.

**2 frameworks** (a teoria por trás, explicada em `references/`):

- **Método GIRO** — o ciclo semanal de 4 passos que transforma tarefa chata em automação entregue: Garimpar → Isolar → Rodar → Observar. Uma volta por semana, uma automação por volta.
- **Raio-X do AIOS** — a auditoria pontuável que mede se seu AIOS tem Memória (sabe de você), Alcance (toca suas ferramentas), Ofício (entrega trabalho pronto) e Pulso (aparece sem ser chamado).

## Como instalar e começar

1. **Baixe o kit** (clone ou download):

   ```
   git clone https://github.com/enzosparo/aios-automatize-se.git
   ```

   Não sabe o que é "clonar"? Sem problema: baixe o ZIP pelo botão verde **Code → Download ZIP** e descompacte numa pasta sua.

2. **Abra a pasta no Claude Code OU no Antigravity.** No Claude Code: abra o terminal na pasta e digite `claude`. No Antigravity: abra a pasta como projeto. Os dois funcionam — as skills vivem em `.claude/skills/` e `.agents/skills/`, sincronizadas.

3. **Rode `/primeiro-dia`.** É uma conversa de uns 15 minutos. Ele pergunta, você responde, ele preenche tudo. No final você já sai com sua Lista de Pepitas (as primeiras candidatas a automação) e um convite: no Dia 7, tire seu primeiro Raio-X.

Daí em diante o ritmo é esse: **`/giro-semanal` toda semana, `/raio-x` pra ver a nota subir.**

## Estrutura de pastas

```
aios-automatize-se/
├── README.md               ← você está aqui
├── LICENSE                 ← MIT + nota sobre as marcas
├── CLAUDE.md               ← o "manual do funcionário": quem ele é e como trabalha com você
├── aios-intake.md          ← a ficha de contratação (o /primeiro-dia preenche por você)
├── EXPANSOES.md            ← o que adicionar quando seu AIOS crescer
├── .claude/skills/         ← as 3 skills (versão Claude Code)
├── .agents/skills/         ← as mesmas 3 skills (versão Antigravity)
├── references/             ← Método GIRO e Raio-X do AIOS por extenso
├── context/                ← quem você é, seu negócio, suas prioridades do trimestre
├── pepitas.md              ← a Lista de Pepitas: candidatas a automação (o /primeiro-dia cria)
├── connections.md          ← registro das ferramentas que seu AIOS alcança (e com que nível de acesso)
├── decisions/log.md        ← registro de decisões: o que você decidiu e por quê
└── archives/               ← automações aposentadas — arquiva, não deleta
```

## Feito por Enzo Sparo

Eu ensino automação com IA sem escrever código — do zero, em português. Se o kit te ajudou, esses são os próximos passos:

- **YouTube:** [youtube.com/@enzosparo](https://www.youtube.com/@enzosparo) — tutoriais completos de Claude Code e Antigravity
- **Instagram:** [@enzosparo](https://www.instagram.com/enzosparo)
- **Comunidade Skool "Automatize-se":** tire dúvidas e mostre suas automações pra outras pessoas no mesmo caminho — o convite está em [links.sparo.com.br](https://links.sparo.com.br)
- **Todos os links:** [links.sparo.com.br](https://links.sparo.com.br)

## Licença

MIT License. © 2026 Enzo Barbatto (o Enzo Sparo aqui de cima). Use, adapte, redistribua — veja o arquivo `LICENSE`.

Os nomes **"Método GIRO"** e **"Raio-X do AIOS"** são marcas de Enzo Barbatto. O conteúdo dos frameworks segue os termos MIT; os nomes são reservados.

Estrutura inspirada nos kits AIOS open-source da comunidade, entre eles o kit de Nate Herk (MIT).
