# Template de prompt — Thumbnail YouTube (estilo que converte)

Prompt em inglês pro `gpt_image_2`. Troque os trechos `<...>` conforme o vídeo. Cite sempre o que
cada imagem de referência é, na MESMA ordem em que você passa os `--image`.

```
YouTube thumbnail, 16:9 landscape, ultra high resolution, Brazilian tech-channel / MrBeast style, razor sharp, very high contrast.

REFERENCE IMAGES (three): (1) the PERSON photo. (2) an image with the LOGOS that go on the top-left (<descreva: ex. orange Claude sunburst icon + a white "+" + cream Fable 5 butterflies icon>). (3) a WEBSITE screenshot — <descreva o site: ex. dark space site "VELA", reddish ringed planet, headline "ALÉM DO CÉU, O COMEÇO.">. THIS THIRD IMAGE IS THE WEBSITE THAT MUST BE SHOWN ON THE BROWSER/LAPTOP SCREEN IN THE THUMBNAIL.

PERSON: use the person from the person photo. Place him on the RIGHT side, chest up, smiling confidently, looking at the camera. Keep the face, hair and mustache identical to the photo. He wears a black t-shirt. <iluminação: ex. soft natural lighting / subtle warm rim light>.

TOP-LEFT LOGOS: in the top-left corner, reproduce the logos from the logo reference EXACTLY, as glowing rounded app icons in a row (keep their colors and shapes faithful).

MAIN ELEMENT: on the LEFT/CENTER, a large floating browser window with rounded white borders and a strong shadow. Inside it, show the website from the third reference faithfully.

BACKGROUND: dark studio (almost black) with a dramatic orange-gold radial glow and soft light particles. Premium, technological look.

TEXT OVERLAY: at the bottom, extra-bold uppercase sans-serif on a slightly tilted black bar: "<LINHA 1>" in white and on the line below "<LINHA 2>" in vibrant orange. Large, readable on small screens, subtle black outline. Spell it exactly and cleanly.

Overall style: vibrant colors, very high contrast, eye-catching expression, clean balanced composition. No watermark, no extra text beyond what is specified.
```

## Knobs que o Enzo costuma pedir
- **Iluminação mais suave** → trocar o rim light dramático por "soft natural lighting, gentle".
- **Expressão mais amigável** → "warm friendly smile, approachable, not exaggerated".
- **Fundo diferente do vídeo anterior** → mudar a cor/posição do glow pra não parecer cópia.
- **Acabamento** → subir `--resolution` de `1k` pra `2k`.
