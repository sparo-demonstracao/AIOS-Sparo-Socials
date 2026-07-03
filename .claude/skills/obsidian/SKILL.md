---
name: obsidian
description: Use quando o Enzo pedir pra ENVIAR / MANDAR / SALVAR / SUBIR um arquivo ou conteúdo no Obsidian (também chamado de "segundo cérebro", "vault", "LLM Wiki" ou "Enzo Barbatto"), OU pra INGERIR / PROCESSAR / DIGERIR / RODAR os documentos no Obsidian. Cobre duas operações ligadas a um vault que é, ele mesmo, um projeto Claude Code separado. (1) ENVIAR — grava o conteúdo como arquivo na pasta raw/assets do vault. (2) INGERIR — dispara o projeto do vault em modo headless pra transformar o que está em raw/ em páginas da wiki. Dispare mesmo sem a palavra "skill", ex.: "manda isso pro meu Obsidian", "salva no segundo cérebro", "joga esse texto no vault", "ingere os arquivos novos", "processa o que tá no raw", "digere isso na wiki".
---

## O que esta skill faz

Liga o AIOS ao **segundo cérebro do Enzo** — um vault Obsidian que é, ao mesmo tempo, **um
projeto Claude Code próprio** com regras próprias. São dois cérebros separados de propósito:
o AIOS **produz** material; o projeto do vault **digere** esse material em wiki.

Duas operações:

1. **ENVIAR** — escreve um arquivo na pasta de entrada do vault (`raw/assets/`). É só largar a
   fonte bruta lá. Rápido, sem risco.
2. **INGERIR** — dispara o projeto do vault em **headless** (`claude -p`) pra ele ler o que está
   em `raw/` e gerar/atualizar as páginas da wiki seguindo o `CLAUDE.md` dele. Por padrão roda em
   **preview** (read-only) primeiro; só escreve depois que o Enzo aprova.

## O que esta skill NÃO faz

- **Não formata páginas da wiki.** Frontmatter, `[[wikilinks]]`, cruzar referências, sinalizar
  contradições — isso é trabalho do projeto do vault, governado pelo `CLAUDE.md` dele. Daqui a
  gente só entrega o material bruto e dispara.
- **Não edita nem apaga nada em `raw/`** além de adicionar arquivos novos. `raw/` é fonte da
  verdade, imutável pro mantenedor da wiki.
- **Não mexe em `wiki/`, `index.md` ou `log.md` diretamente daqui.** Quem toca nessas é o projeto
  do vault, pra manter a disciplina dele.
- **Não faz ingest pela sessão do AIOS.** Ingerir "na mão" daqui misturaria o CLAUDE.md do AIOS
  com o do vault e quebraria as convenções. Sempre dispare o projeto do vault.

## Caminhos fixos (decorar)

| O quê | Caminho |
|---|---|
| Raiz do vault (projeto Claude Code) | `C:\Users\canal\Documentos\Obsidian\Enzo Barbatto` |
| **Destino do ENVIAR (documentos)** | `C:\Users\canal\Documentos\Obsidian\Enzo Barbatto\raw` |
| Anexos / imagens de uma fonte | `C:\Users\canal\Documentos\Obsidian\Enzo Barbatto\raw\assets` |
| Em path POSIX (Bash) | `/c/Users/canal/Documentos/Obsidian/Enzo Barbatto` |

> Por quê: o esquema do vault (`CLAUDE.md` seção 2) trata `raw/` como os documentos-fonte e
> `raw/assets/` como só imagens/anexos de uma fonte. Então **documento/nota → `raw/`**;
> imagem/anexo → `raw/assets/`.

---

## Operação 1 — ENVIAR

**Objetivo:** colocar o material (conteúdo do chat OU um arquivo que ele apontar) em
`raw/assets/`, fiel, sem editorializar.

### Passos

1. **Defina o conteúdo.** Pode vir de duas formas:
   - Texto/resultado da conversa → escreva como `.md`.
   - Um arquivo existente que o Enzo aponta → copie pra `raw/` (não mova; preserve o original).
2. **Nomeie com título legível**, com acentos e maiúsculas, terminando em `.md`. Ex.:
   `Reunião com Acme — proposta.md`. Use prefixo de data `AAAA-MM-DD — ` só se for um snapshot
   claramente datado (transcrição, clipping de um dia). Sem data pra material atemporal.
3. **Cabeçalho de origem leve (opcional, ajuda o ingest).** Se você sabe de onde veio, comece o
   arquivo com uma linha de contexto e mantenha o resto fiel à fonte:
   ```markdown
   > origem: <ex.: WhatsApp / transcrição YouTube / e-mail / nota> · data: AAAA-MM-DD
   ```
   Se não souber a origem, escreva só o conteúdo. **Não reescreva nem resuma** — `raw/` é a fonte
   da verdade.
4. **Guarda de sobrescrita.** Se já existir arquivo com esse nome em `raw/`, **pergunte**
   antes de sobrescrever — você estaria por cima de uma fonte.
5. **Grave** com a ferramenta Write em `raw/` (documentos) — ou `raw/assets/` se for imagem/anexo.
6. **Confirme em 1 linha:** nome do arquivo + caminho, e ofereça o próximo passo:
   *"Tá em `raw/`. Quer que eu ingira agora?"*

---

## Operação 2 — INGERIR

**Objetivo:** disparar o projeto Claude Code do vault pra processar `raw/` em páginas de `wiki/`.
Roda **headless** (`claude -p`) a partir da pasta do vault, então ele carrega o `CLAUDE.md` dele
e age como o mantenedor da wiki.

### Padrão de comando (via ferramenta Bash)

> **Gotchas que vão te morder se ignorar** (aprendidos na marra):
> - **Prompt vai por stdin (heredoc).** Flags como `--allowedTools` e `--add-dir` são variádicas
>   e engolem o prompt posicional. Mande o prompt por `<<'EOF' ... EOF`.
> - **`cd` na pasta do vault** antes de chamar `claude`, pra carregar SÓ o CLAUDE.md do vault (não
>   o do AIOS). O cwd do shell volta sozinho depois — tudo bem.
> - **Não use `--bare`** (ele força auth por API key). O headless reaproveita a auth atual.
> - **Timeout generoso.** Um ingest real toca 8–15 páginas; pode levar minutos. Use timeout alto
>   (ex.: 600000ms) ou rode em background.

#### Passo A — PREVIEW (read-only, não escreve) — padrão, rode sempre primeiro

```bash
cd "/c/Users/canal/Documentos/Obsidian/Enzo Barbatto" && claude -p --permission-mode plan --allowedTools Read Glob Grep <<'EOF'
INGEST em modo PREVIEW (NAO crie nem edite nada). Olhe os arquivos novos em raw/ e,
seguindo a secao 7.1 (INGEST) do seu CLAUDE.md, descreva o plano: qual pagina de fonte criaria,
quais paginas de wiki/ criaria ou tocaria, e quais contradicoes checaria. Nao escreva arquivos.
EOF
```

Mostre o plano ao Enzo e pergunte: *"Mando ele executar?"*

#### Passo B — EXECUTAR (escreve na wiki) — só após o "ok"

```bash
cd "/c/Users/canal/Documentos/Obsidian/Enzo Barbatto" && claude -p --permission-mode acceptEdits --allowedTools Read Glob Grep Edit Write MultiEdit <<'EOF'
INGEST: processe o(s) arquivo(s) novo(s) em raw/ seguindo integralmente a secao 7.1 do seu
CLAUDE.md. Crie a pagina de fonte, propague para wiki/ (pessoas, empresas, projetos, conceitos,
decisoes), cruze referencias nos dois sentidos, sinalize contradicoes, e atualize index.md e log.md.
Ao final, RESUMA em poucas linhas: quais paginas criou/tocou e o que eu devo revisar.
EOF
```

Repasse o resumo dele pro Enzo e sugira abrir o vault no Obsidian pra conferir o grafo.

### Autonomia (default = rodinha de bicicleta)

Comece sempre por **Preview → aprovação → Executar**. Isso mantém o Enzo no controle de uma
operação que escreve em muitas páginas. Só colapse pra um disparo direto (pular o preview) se o
Enzo pedir explicitamente, depois de já ter confiado no fluxo algumas vezes.

---

## Por que existe e como pensar nisso

O vault é o **segundo cérebro** do Enzo (uma LLM Wiki estilo Karpathy). O valor está em manter os
dois cérebros separados: o AIOS é bom em produzir e operar o dia a dia; o projeto do vault é bom
em destilar conhecimento durável com disciplina (citações, contradições, grafo limpo). Esta skill
é a ponte — entrega material e aciona a destilação — sem borrar as fronteiras de cada um.

## Verificação (pra quem implementa/ajusta)

- **Enviar:** peça "manda esse texto pro Obsidian". Esperado: arquivo `.md` aparece em
  `raw/` com nome legível, conteúdo fiel, e confirmação curta + oferta de ingerir.
- **Sobrescrita:** envie com um nome que já existe. Esperado: pergunta antes de sobrescrever.
- **Ingerir preview:** peça "ingere". Esperado: headless roda em plan mode, devolve um plano,
  **nada** é escrito no vault, e a skill pede aprovação antes do passo B.
- **Separação:** confirme que a skill nunca edita `wiki/`, `index.md` ou `log.md` diretamente —
  sempre via disparo do projeto do vault.
