CONTINUAÇÃO DE TRABALHO — Thumbnail YouTube "1 PROMPT = SITE PERFEITO"

Estamos retomando um trabalho de outro chat. Você não tem o histórico; este texto tem tudo. Leia,
confirme em 1 linha que entendeu e já execute o "Próximo passo".

PROJETO: AIOS - Sparo Socials (c:\Users\canal\Documentos\Antigravity Projetos\AIOS - Sparo Socials)
OBJETIVO: Thumbnail 16:9 do YouTube no estilo que mais converte pro Enzo — pessoa à direita +
navegador flutuante com o site VELA + logos Claude + Fable 5 no topo + faixa "1 PROMPT / = SITE PERFEITO".

JÁ FEITO:
- 3 versões geradas via Higgsfield (gpt_image_2). Melhor até agora: C:\Users\canal\Downloads\thumb-fable-v3.png
  (logos Claude + Fable 5, site VELA "ALÉM DO CÉU, O COMEÇO." na tela, faixa branco/laranja).
- Página no Notion com prompt + processo: https://app.notion.com/p/38ba651a308e8109a5b5c50d0df4a299

PRÓXIMO PASSO (faça isto primeiro):
- Regerar a v3 trocando a pessoa pela FOTO DE ESTÚDIO profissional, com: iluminação mais suave (sem
  rim light laranja forte), expressão mais amigável (sem exagero), e --resolution 2k.

PENDENTE DE MIM (Enzo) — me peça se faltar:
- O CAMINHO da foto de estúdio (retrato ~2048x2048) em disco. Sem ele não dá pra rodar.
  (Imagem colada no chat NÃO serve — o hf só aceita caminho de arquivo.)

ARQUIVOS / COMANDOS / LINKS:
- Logos (Claude + Fable 5): C:\Users\canal\OneDrive\Imagens\Capturas de tela\Captura de tela 2026-06-26 020759.png
- Site VELA (print): C:\Users\canal\OneDrive\Imagens\Capturas de tela\Captura de tela 2026-06-26 022616.png
- Prompt-template: references\thumbnail-youtube\prompt-template.md
- Estado detalhado: references\thumbnail-youtube\estado.md
- Comando (trocar <FOTO_ESTUDIO>):
  cd "C:/Users/canal/Downloads"; hf generate create gpt_image_2 --prompt "$(cat prompt-thumb.txt)" --image "<FOTO_ESTUDIO>" --image "C:/Users/canal/OneDrive/Imagens/Capturas de tela/Captura de tela 2026-06-26 020759.png" --image "C:/Users/canal/OneDrive/Imagens/Capturas de tela/Captura de tela 2026-06-26 022616.png" --aspect_ratio 16:9 --quality low --resolution 2k --wait --wait-timeout 8m --json

DECISÕES E GOTCHAS (não repita erros):
- Logo do topo = Claude + Fable 5 (borboletas formando o "5"), no formato "A + B".
- gpt_image_2: params com underscore (--aspect_ratio); aceita várias --image (referências).
- A 1k o texto às vezes serrilha; 2k resolve.
- L2: nada sobe pro YouTube sozinho — mostrar o rascunho pro Enzo aprovar.

SKILL: invoque /thumbnail-youtube ao começar (ela já lê o references\thumbnail-youtube\estado.md).
