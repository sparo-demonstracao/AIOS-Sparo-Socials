# Estado atual — Thumbnail YouTube (handoff entre chats)

> Este arquivo é o "save game" da skill `/thumbnail-youtube`. Um chat novo (mesmo do zero) lê isto
> e continua de onde parou. **Sempre atualize ao parar/terminar uma sessão.**

- **Status:** EM ANDAMENTO
- **Última atualização:** 2026-06-26
- **Vídeo/tema:** "1 PROMPT = SITE PERFEITO" (Claude + Fable 5 criando o site VELA)

## Onde parou
- Última versão gerada: `C:\Users\canal\Downloads\thumb-fable-v3.png` (logos Claude + Fable 5, site
  VELA "ALÉM DO CÉU, O COMEÇO." na tela do navegador, faixa "1 PROMPT = SITE PERFEITO").
- Versões anteriores: `thumb-fable-v1.png` (sem logos reais), `thumb-fable-v2.png` (site genérico).

## Próximo passo (o que falta)
1. **Trocar a pessoa pela FOTO DE ESTÚDIO profissional** (retrato ~2048×2048).
   - ⚠️ FALTA O CAMINHO DO ARQUIVO EM DISCO. Pedir ao Enzo o caminho (ex.: `C:\Users\canal\Downloads\foto-estudio.jpg`).
2. **Iluminação mais suave** (sem o rim light laranja tão dramático).
3. **Expressão mais amigável**, sem exagero.
4. Rodar em **`--resolution 2k`** pra ficar nítida.

## Referências (caminhos em disco)
- **Logos (Claude + Fable 5):** `C:\Users\canal\OneDrive\Imagens\Capturas de tela\Captura de tela 2026-06-26 020759.png`
- **Site VELA (print):** `C:\Users\canal\OneDrive\Imagens\Capturas de tela\Captura de tela 2026-06-26 022616.png`
- **Foto pessoa (recorte antigo, "amador"):** `C:\Users\canal\Downloads\Eu(sem fundo) Enzo Barbatto.png` — substituir pela foto de estúdio.
- **Foto de estúdio:** PENDENTE (pedir caminho).

## Prompt em uso
Ver `prompt-template.md` nesta pasta (versão atual = a com 3 referências: pessoa + logos + site VELA).
Aplicar os knobs "iluminação suave" + "expressão amigável" no próximo render.

## Comando pra retomar
```
cd "C:/Users/canal/Downloads"
hf generate create gpt_image_2 \
  --prompt "$(cat prompt-thumb.txt)" \
  --image "<FOTO_ESTUDIO>" \
  --image "C:/Users/canal/OneDrive/Imagens/Capturas de tela/Captura de tela 2026-06-26 020759.png" \
  --image "C:/Users/canal/OneDrive/Imagens/Capturas de tela/Captura de tela 2026-06-26 022616.png" \
  --aspect_ratio 16:9 --quality low --resolution 2k --wait --wait-timeout 8m --json
```

## Notion
Página de referência: "Thumbnail YouTube — Fable 5 + Claude (site VELA)"
https://app.notion.com/p/38ba651a308e8109a5b5c50d0df4a299
