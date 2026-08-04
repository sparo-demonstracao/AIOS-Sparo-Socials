# Rodapé de e-mail — Sparo

Um único design de assinatura pra marca inteira (curso + agência), em **duas variantes de voz**:

| Arquivo | Voz | Onde instalar |
|---|---|---|
| `assinatura-enzo.html` | **Enzo Barbatto** (foto, "Fundador da Sparo") | Gmail — agenciasparo@gmail.com |
| `assinatura-equipe-sparo.html` | **Equipe Sparo** (monograma S, "Atendimento") | Zoho — atendimento@sparo.com.br |

Decisão registrada em `decisions/log.md` (2026-07-13): um rodapé só, porque a mesma caixa atende
aluno e cliente de agência — rodapé identifica, não vende; segmentação fica no corpo do e-mail.

## Como instalar

**Gmail (variante Enzo):**
1. Abra `assinatura-enzo.html` no navegador (duplo clique).
2. `Ctrl+A` → `Ctrl+C` (copia a assinatura renderizada).
3. Gmail → ⚙️ → *Ver todas as configurações* → *Geral* → *Assinatura* → *Criar nova* → cole com `Ctrl+V`.
4. Em "Padrões de assinatura", selecione ela para **novos e-mails** e **respostas**. Salve no fim da página.

**Zoho (variante Equipe):**
1. Abra `assinatura-equipe-sparo.html` num editor e copie o **código** da `<table>` (ou o arquivo todo).
2. Zoho Mail → ⚙️ *Configurações* → *Assinaturas* → **+** adicionar.
3. No editor da assinatura, clique no ícone `</>` (inserir HTML) e cole o código.
4. Associe ao endereço `atendimento@sparo.com.br` e marque para novos e-mails e respostas.

⚠️ Os rascunhos gerados por `scripts/triagem-email/triar-zoho.mjs` e pela `/triagem-email` **não**
precisam embutir o rodapé: o Gmail/Zoho anexa a assinatura configurada na hora do envio.

## Regras de manutenção (por que o HTML é "feio")

E-mail não é navegador. O que sobrevive em Gmail/Zoho/Outlook/Apple Mail:

- **Só `<table>` + estilos inline.** Nada de `<style>`, flexbox, grid ou classes.
- **Só Arial/Helvetica.** Webfont não carrega em cliente de e-mail.
- **Imagem por URL absoluta.** A foto vem de `https://links.sparo.com.br/foto.jpg` (Railway,
  repo `scripts/sparo-socials`). Se esse serviço sair do ar, a foto some do rodapé.
- **Degradação aceitável:** Outlook desktop antigo não arredonda cantos (foto/monograma ficam
  quadrados) e não renderiza o gradiente do monograma (mostra laranja sólido `#FF6633`). Sem quebra.
- **Dark mode do Gmail** reajusta as cores sozinho — não usar fundo branco fixo na tabela (não usa).

## Paleta (a mesma de links.sparo.com.br)

- `#FF6633` laranja Sparo (filete vertical, monograma)
- `#E8551F` laranja profundo (links, destaque "Sparo")
- `#2a1206` tinta (nome)
- `#7a4427` tinta suave (linha de papel)
- `#d9b8a3` separadores · `#FFD3B0` anel da foto
