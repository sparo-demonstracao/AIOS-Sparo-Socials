# -*- coding: utf-8 -*-
"""
AIOS — Preparador de post pro Instagram (Reels).

A partir de um vídeo LOCAL (o reel que o Enzo vai postar), entrega o material
de apoio pra ele revisar e publicar na mão (L2 — nada vai pro Instagram sozinho):

  1. TRANSCREVE o vídeo na GPU (faster-whisper, receita validada do Enzo).
  2. EXTRAI 3 frames candidatos (início ~15%, meio ~50%, fim ~85%) — o meio pega
     a gravação de tela.
  3. DESENHA a capa: caixa branca arredondada com um texto curto (3 a 6 palavras),
     em CAIXA ALTA preta e bold, centralizada — no estilo de capa de reel.

Quem escreve o título / a legenda / o texto-da-capa é o Claude na conversa
(lê a transcrição + a voz do Enzo). Este script é só o MOTOR mecânico.

Uso (dois passos — o Claude orquestra):

  # 1) Transcreve e extrai os 3 frames. Salva tudo em <video>-instagram/ ao lado do vídeo.
  python instagram_post.py prep "C:\\caminho\\reel.mp4"

  # 2) Depois que o Claude decidir o texto curto, desenha a capa nos 3 frames:
  python instagram_post.py cover --dir "C:\\caminho\\reel-instagram" --text "TEXTO DA CAPA"
      [--pos top|middle|bottom]   (default: middle)

Saída em <video>-instagram/:
  transcript.txt     — transcrição corrida (o Claude lê pra escrever o copy)
  frame-1/2/3.png    — frames crus 1080x1920 (início / meio / fim)
  capa-1/2/3.png     — os mesmos frames com a caixa de texto (você escolhe 1)

Reusa: receita de Whisper em C:\\Users\\canal\\Downloads\\transcricao-masterclass
"""
import os
import re
import sys
import json
import argparse
import subprocess
from pathlib import Path
from datetime import datetime

# Console do Windows é cp1252 e quebra com acento; força UTF-8 na saída.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# ----------------------------------------------------------------------------
# Config
# ----------------------------------------------------------------------------
WHISPER_WORK = Path(r"C:\Users\canal\Downloads\transcricao-masterclass")
MODELS_DIR = WHISPER_WORK / "models"
# Fontes disponíveis pra capa. Cada uma: {"path", "variation"?}. As embutidas em fonts/
# (grátis, OFL) funcionam em qualquer máquina; as do Windows são fallback.
FONT_DIR = Path(__file__).resolve().parent / "fonts"
FONTS = {
    "montserrat": {"path": str(FONT_DIR / "Montserrat-Variable.ttf"), "variation": "Black"},  # padrão
    "poppins":    {"path": str(FONT_DIR / "Poppins-Black.ttf")},     # geométrica (tipo Sofia Pro)
    "black":      {"path": r"C:\Windows\Fonts\ariblk.ttf"},          # Arial Black
    "segoe":      {"path": r"C:\Windows\Fonts\seguibl.ttf"},         # Segoe UI Black
    "impact":     {"path": r"C:\Windows\Fonts\impact.ttf"},          # Impact (condensada)
    "franklin":   {"path": r"C:\Windows\Fonts\FRAHV.TTF"},           # Franklin Gothic Heavy
    "bold":       {"path": r"C:\Windows\Fonts\arialbd.ttf"},         # Arial Bold (mais leve)
}
DEFAULT_FONT = "montserrat"
FONT_FALLBACK = r"C:\Windows\Fonts\arialbd.ttf"

# Geração do copy (título / legenda / texto da capa) — mesmo padrão do yt-auto-descricao.
CLAUDE_EXE = r"C:\Users\canal\.local\bin\claude.exe"
MODELO_CLAUDE = "claude-sonnet-4-6"

PROMPT_IG = """Você é o social media do Enzo Barbato, que ensina automação com IA (Claude Code, Antigravity) pra gente LEIGA em programação. Tom: português do Brasil, informal mas profissional, frases curtas, direto, sem jargão técnico solto. Sempre "você", nunca "tu". Não invente nada que não esteja na transcrição.

A partir da TRANSCRIÇÃO de um Reels que o Enzo vai postar, gere o material do post. Responda EXATAMENTE neste formato, com cada marcador numa linha própria, sem markdown e sem NENHUM texto antes do primeiro marcador ou depois do último:

<<<CAPA1>>>
(opção 1 de texto pra capa)
<<<CAPA2>>>
(opção 2)
<<<CAPA3>>>
(opção 3)
<<<TITULO>>>
(o gancho do post, 1 linha)
<<<DESCRICAO>>>
(a legenda completa)
<<<FIM>>>

- CAPA1/2/3: 3 opções de texto pra CAPA do Reel (o que aparece no grid do perfil), pra ele escolher. Cada uma com 3 a 6 palavras, EM CAIXA ALTA, gancho de curiosidade — promete um resultado ou cria curiosidade. Variadas entre si (ângulos diferentes). Ex.: COMO AUTOMATIZEI MEU WHATSAPP / O ERRO QUE TODO INICIANTE COMETE.
- TITULO: uma linha curta — o gancho do post.
- DESCRICAO: a legenda do post. Comece com um gancho forte na 1ª linha, entregue o valor em frases curtas e termine com um CTA leve (comenta, salva ou segue). Depois de uma linha em branco, coloque de 5 a 10 hashtags (misture amplas e de nicho: #automação #ia #claudecode #antigravity #nocode #produtividade + específicas do tema).

SEMPRE responda nesse formato, mesmo que a transcrição pareça curta, incompleta ou estranha (nesse caso, gere o melhor material possível com o que tiver).

TRANSCRIÇÃO:
%%TRANSCRIPT%%"""

W, H = 1080, 1920          # dimensões do reel (9:16)
SIDE_MARGIN = 70           # respiro mínimo entre a caixa e a borda do canvas
PAD_X, PAD_Y = 46, 38      # padding interno da caixa branca
RADIUS = 36                # raio dos cantos arredondados
MAX_LINES = 4
FONT_MAX, FONT_MIN = 124, 46
BOX_WHITE = (255, 255, 255)
TEXT_BLACK = (17, 17, 17)


def log(msg):
    print(msg, flush=True)


# ----------------------------------------------------------------------------
# ffmpeg / ffprobe
# ----------------------------------------------------------------------------
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    return r


def video_duration(video):
    r = run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", str(video)])
    try:
        return float(r.stdout.strip())
    except (ValueError, AttributeError):
        return 0.0


def extract_audio(video, out_wav):
    r = run(["ffmpeg", "-y", "-i", str(video), "-vn", "-ac", "1",
             "-ar", "16000", "-f", "wav", str(out_wav)])
    if r.returncode != 0:
        raise RuntimeError(f"ffmpeg (áudio) falhou: {(r.stderr or '')[-400:]}")
    return out_wav


def extract_frames(video, out_dir, fracs=(0.15, 0.50, 0.85)):
    dur = video_duration(video)
    if dur <= 0:
        raise RuntimeError("não consegui ler a duração do vídeo (ffprobe).")
    paths = []
    for i, fr in enumerate(fracs, 1):
        t = max(0.0, min(dur - 0.1, dur * fr))
        out = out_dir / f"frame-{i}.png"
        r = run(["ffmpeg", "-y", "-ss", f"{t:.2f}", "-i", str(video),
                 "-frames:v", "1", "-q:v", "2", str(out)])
        if r.returncode != 0 or not out.exists():
            raise RuntimeError(f"ffmpeg (frame {i}) falhou: {(r.stderr or '')[-400:]}")
        paths.append(out)
        log(f"  frame {i}: {out.name}  (em {t:.1f}s de {dur:.1f}s)")
    return paths


# ----------------------------------------------------------------------------
# Whisper (receita validada do Enzo — copiada de scripts/yt-auto-descricao)
# ----------------------------------------------------------------------------
def add_cuda_dlls():
    try:
        import nvidia
        bases = [Path(p) for p in list(getattr(nvidia, "__path__", []))]
        if not bases and getattr(nvidia, "__file__", None):
            bases = [Path(nvidia.__file__).parent]
        path_extra = []
        for base in bases:
            for bindir in base.glob("*/bin"):
                if bindir.is_dir():
                    os.add_dll_directory(str(bindir))
                    path_extra.append(str(bindir))
        if path_extra:
            os.environ["PATH"] = os.pathsep.join(path_extra) + os.pathsep + os.environ.get("PATH", "")
    except Exception as e:
        log(f"[aviso] não consegui registrar libs CUDA: {e}")


def load_model():
    from faster_whisper import WhisperModel
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    if os.environ.get("FORCE_CPU") == "1":
        log(">> Whisper na CPU (large-v3, int8) [FORCE_CPU]")
        return WhisperModel("large-v3", device="cpu", compute_type="int8",
                            download_root=str(MODELS_DIR))
    try:
        m = WhisperModel("large-v3", device="cuda", compute_type="float16",
                         download_root=str(MODELS_DIR))
        log(">> Whisper na GPU (large-v3, float16)")
        return m
    except Exception as e:
        log(f">> GPU indisponível ({e}); caindo pra CPU")
        return WhisperModel("large-v3", device="cpu", compute_type="int8",
                            download_root=str(MODELS_DIR))


def transcribe(video, out_dir):
    wav = out_dir / "_audio.wav"
    extract_audio(video, wav)
    try:
        add_cuda_dlls()
        model = load_model()
        segments, _info = model.transcribe(
            str(wav), language="pt", vad_filter=False, beam_size=5,
            condition_on_previous_text=False,
        )
        full = " ".join(seg.text.strip() for seg in segments).strip()
    finally:
        try:
            wav.unlink()
        except Exception:
            pass
    return full


# ----------------------------------------------------------------------------
# Capa (Pillow) — caixa branca arredondada + texto bold em caixa alta
# ----------------------------------------------------------------------------
def _load_font(size, font_key=DEFAULT_FONT):
    from PIL import ImageFont
    candidatos = [FONTS.get(font_key) or FONTS[DEFAULT_FONT], FONTS[DEFAULT_FONT], {"path": FONT_FALLBACK}]
    for spec in candidatos:
        try:
            f = ImageFont.truetype(spec["path"], size)
        except OSError:
            continue
        var = spec.get("variation")
        if var:  # fonte variável (ex.: Montserrat) — seleciona o peso Black
            try:
                f.set_variation_by_name(var)
            except Exception:
                pass
        return f
    return ImageFont.load_default()


def _wrap(words, font, draw, max_w):
    """Quebra gulosa de palavras em linhas que cabem em max_w pixels."""
    lines, cur = [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=font) <= max_w or not cur:
            cur = test
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def _fit_text(draw, text, max_w, font_key=DEFAULT_FONT):
    """Acha o maior corpo de fonte em que o texto cabe em <= MAX_LINES linhas."""
    words = text.upper().split()
    best = None
    for size in range(FONT_MAX, FONT_MIN - 1, -2):
        font = _load_font(size, font_key)
        lines = _wrap(words, font, draw, max_w)
        widest = max((draw.textlength(ln, font=font) for ln in lines), default=0)
        if len(lines) <= MAX_LINES and widest <= max_w:
            return font, lines, size
        best = (font, lines, size)  # guarda o último como fallback
    return best


def render_cover(frame_png, text, out_png, pos="middle", font_key=DEFAULT_FONT):
    from PIL import Image, ImageDraw

    img = Image.open(frame_png).convert("RGB")
    # escala + corte central pra garantir 1080x1920 (9:16)
    sw, sh = img.size
    scale = max(W / sw, H / sh)
    img = img.resize((round(sw * scale), round(sh * scale)), Image.LANCZOS)
    nw, nh = img.size
    img = img.crop(((nw - W) // 2, (nh - H) // 2, (nw - W) // 2 + W, (nh - H) // 2 + H))

    draw = ImageDraw.Draw(img)
    max_text_w = W - 2 * SIDE_MARGIN - 2 * PAD_X
    font, lines, size = _fit_text(draw, text, max_text_w, font_key)

    ascent, descent = font.getmetrics()
    line_h = ascent + descent
    gap = round(size * 0.16)
    n = len(lines)
    block_h = n * line_h + (n - 1) * gap
    widest = max(draw.textlength(ln, font=font) for ln in lines)

    box_w = min(W - 2 * SIDE_MARGIN, widest + 2 * PAD_X)
    box_h = block_h + 2 * PAD_Y
    cx = W // 2
    if pos == "top":
        cy = round(H * 0.28)
    elif pos == "bottom":
        cy = round(H * 0.72)
    else:
        cy = H // 2

    x0, y0 = cx - box_w / 2, cy - box_h / 2
    x1, y1 = cx + box_w / 2, cy + box_h / 2
    draw.rounded_rectangle([x0, y0, x1, y1], radius=RADIUS, fill=BOX_WHITE)

    top = cy - block_h / 2
    for i, ln in enumerate(lines):
        line_cy = top + i * (line_h + gap) + line_h / 2
        draw.text((cx, line_cy), ln, font=font, fill=TEXT_BLACK, anchor="mm")

    img.save(out_png, "PNG")
    return out_png, size, lines


# ----------------------------------------------------------------------------
# Comandos
# ----------------------------------------------------------------------------
def out_dir_for(video):
    video = Path(video)
    d = video.parent / f"{video.stem}-instagram"
    d.mkdir(parents=True, exist_ok=True)
    return d


def cmd_prep(args):
    video = Path(args.video)
    if not video.exists():
        log(f"ERRO: vídeo não encontrado: {video}")
        sys.exit(1)
    out_dir = out_dir_for(video)
    log(f"=== PREP: {video.name} -> {out_dir.name}/ ===")

    log(">> Extraindo 3 frames candidatos...")
    extract_frames(video, out_dir)

    log(">> Transcrevendo (Whisper na GPU)...")
    full = transcribe(video, out_dir)
    (out_dir / "transcript.txt").write_text(full, encoding="utf-8")
    log(f">> Transcrição salva ({len(full)} chars): transcript.txt")

    print(json.dumps({
        "out_dir": str(out_dir),
        "transcript": str(out_dir / "transcript.txt"),
        "transcript_chars": len(full),
        "frames": [str(out_dir / f"frame-{i}.png") for i in (1, 2, 3)],
    }, ensure_ascii=False))


def _parse_copy(raw):
    """Extrai os campos do formato <<<MARCADOR>>>. Devolve dict ou None se faltar campo."""
    partes = re.split(r"<<<(CAPA1|CAPA2|CAPA3|TITULO|DESCRICAO|FIM)>>>", raw)
    campos = {}
    for i in range(1, len(partes) - 1, 2):
        campos[partes[i]] = partes[i + 1].strip()
    opcoes = [campos.get(k, "").upper() for k in ("CAPA1", "CAPA2", "CAPA3") if campos.get(k)]
    titulo = campos.get("TITULO", "")
    descricao = campos.get("DESCRICAO", "")
    if not (opcoes and titulo and descricao):
        return None
    return {
        "opcoes_capa": opcoes[:3],
        "texto_capa": opcoes[0],
        "titulo": titulo,
        "descricao": descricao,
    }


def gerar_copy(transcript):
    """Chama o claude -p e devolve {opcoes_capa, texto_capa, titulo, descricao}.
    Tenta até 3 vezes (cobre erro transitório de API e resposta fora do formato)."""
    prompt = PROMPT_IG.replace("%%TRANSCRIPT%%", transcript)
    ultimo_erro = ""
    for tentativa in (1, 2, 3):
        r = subprocess.run([CLAUDE_EXE, "-p", "--model", MODELO_CLAUDE],
                           input=prompt, capture_output=True, text=True,
                           encoding="utf-8", errors="replace")
        if r.returncode != 0:
            # o CLI imprime erros de API no stdout — mostra os dois
            ultimo_erro = (f"claude -p falhou (código {r.returncode}) "
                           f"stderr: {(r.stderr or '').strip()[-300:] or '(vazio)'} | "
                           f"stdout: {(r.stdout or '').strip()[-300:] or '(vazio)'}")
        else:
            d = _parse_copy((r.stdout or "").strip())
            if d:
                return d
            ultimo_erro = f"claude respondeu fora do formato: {(r.stdout or '').strip()[:300]}"
        log(f">> tentativa {tentativa}/3 falhou — {ultimo_erro}")
    raise RuntimeError(ultimo_erro)


def cmd_auto(args):
    """Pipeline completo pro app: transcreve + gera copy + 3 capas + result.json."""
    video = Path(args.video)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    resultado_path = out_dir / "result.json"

    def falhar(msg):
        log(f"ERRO: {msg}")
        resultado_path.write_text(json.dumps({"ok": False, "erro": msg}, ensure_ascii=False),
                                  encoding="utf-8")
        sys.exit(1)

    if not video.exists():
        falhar(f"vídeo não encontrado: {video}")

    try:
        log(">> [1/4] Extraindo 3 frames candidatos (início / meio / fim)...")
        extract_frames(video, out_dir)

        if args.no_copy:
            log(">> [pulando transcrição/copy: modo --no-copy]")
            transcript = ""
            copy = {"opcoes_capa": ["TEXTO DE TESTE", "OUTRA OPÇÃO AQUI", "MAIS UMA DE TESTE"],
                    "texto_capa": "TEXTO DE TESTE",
                    "titulo": "Título de teste",
                    "descricao": "Legenda de teste do pipeline.\n\n#teste #aios"}
        else:
            log(">> [2/4] Transcrevendo o áudio na GPU (Whisper)...")
            transcript = transcribe(video, out_dir)
            (out_dir / "transcript.txt").write_text(transcript, encoding="utf-8")
            log(f">> Transcrição: {len(transcript)} caracteres.")
            if len(transcript) < 20:
                falhar("não consegui transcrever o vídeo (áudio mudo ou só música). "
                       "Me diga o tema na mão que eu escrevo o copy.")
            log(">> [3/4] Escrevendo título, legenda e texto da capa (na voz do Enzo)...")
            copy = gerar_copy(transcript)

        log(">> [4/4] Desenhando a caixa de texto nas 3 capas...")
        covers = []
        for fp in sorted(out_dir.glob("frame-*.png")):
            idx = fp.stem.split("-")[-1]
            out = out_dir / f"capa-{idx}.png"
            render_cover(fp, copy["texto_capa"], out, pos=args.pos, font_key=args.font)
            covers.append(out.name)
    except SystemExit:
        raise  # falhar() já escreveu o result.json
    except Exception as e:
        falhar(f"deu erro no processamento: {str(e)[:300]}")

    resultado = {
        "ok": True,
        "gerado_em": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
        "titulo": copy["titulo"],
        "texto_capa": copy["texto_capa"],
        "opcoes_capa": copy.get("opcoes_capa", [copy["texto_capa"]]),
        "descricao": copy["descricao"],
        "pos": args.pos,
        "fonte": args.font,
        "transcript_chars": len(transcript),
        "covers": covers,
    }
    resultado_path.write_text(json.dumps(resultado, ensure_ascii=False, indent=2),
                              encoding="utf-8")
    log(f">> PRONTO ✅  título + legenda + {len(covers)} capas geradas.")
    print(json.dumps({"result": str(resultado_path)}, ensure_ascii=False))


def cmd_frame(args):
    """Pega UM frame extra num segundo específico (quando os 3 candidatos não servem)."""
    video = Path(args.video)
    out_dir = Path(args.dir)
    if not video.exists():
        log(f"ERRO: vídeo não encontrado: {video}")
        sys.exit(1)
    if args.idx is not None:
        idx = args.idx
    else:
        existing = [int(p.stem.split("-")[-1]) for p in out_dir.glob("frame-*.png")
                    if p.stem.split("-")[-1].isdigit()]
        idx = (max(existing) + 1) if existing else 1
    out = out_dir / f"frame-{idx}.png"
    r = run(["ffmpeg", "-y", "-ss", f"{args.at:.2f}", "-i", str(video),
             "-frames:v", "1", "-q:v", "2", str(out)])
    if r.returncode != 0 or not out.exists():
        raise RuntimeError(f"ffmpeg falhou: {(r.stderr or '')[-400:]}")
    log(f"frame {idx} em {args.at:.1f}s: {out.name}")
    print(json.dumps({"frame": str(out)}, ensure_ascii=False))


def cmd_cover(args):
    out_dir = Path(args.dir)
    frames = sorted(out_dir.glob("frame-*.png"))
    if not frames:
        log(f"ERRO: nenhum frame-*.png em {out_dir}")
        sys.exit(1)
    log(f"=== COVER: \"{args.text}\" ({args.pos}/{args.font}) em {len(frames)} frame(s) ===")
    for fp in frames:
        idx = fp.stem.split("-")[-1]
        out = out_dir / f"capa-{idx}.png"
        _, size, lines = render_cover(fp, args.text, out, pos=args.pos, font_key=args.font)
        log(f"  {out.name}: fonte {size}px, {len(lines)} linha(s)")
    print(json.dumps({
        "covers": [str(out_dir / f"capa-{fp.stem.split('-')[-1]}.png") for fp in frames]
    }, ensure_ascii=False))


def main():
    p = argparse.ArgumentParser(description="AIOS — preparador de post pro Instagram")
    sub = p.add_subparsers(dest="cmd", required=True)

    pp = sub.add_parser("prep", help="transcreve + extrai 3 frames")
    pp.add_argument("video")
    pp.set_defaults(func=cmd_prep)

    pa = sub.add_parser("auto", help="pipeline completo pro app (copy + 3 capas)")
    pa.add_argument("video")
    pa.add_argument("--out-dir", required=True)
    pa.add_argument("--pos", choices=["top", "middle", "bottom"], default="middle")
    pa.add_argument("--font", choices=list(FONTS.keys()), default=DEFAULT_FONT)
    pa.add_argument("--no-copy", action="store_true", help="pula transcrição/claude (teste)")
    pa.set_defaults(func=cmd_auto)

    pf = sub.add_parser("frame", help="pega um frame extra num segundo específico")
    pf.add_argument("video")
    pf.add_argument("--dir", required=True)
    pf.add_argument("--at", type=float, required=True, help="segundo do vídeo")
    pf.add_argument("--idx", type=int, default=None, help="índice do frame (default: próximo)")
    pf.set_defaults(func=cmd_frame)

    pc = sub.add_parser("cover", help="desenha a caixa de texto nos frames")
    pc.add_argument("--dir", required=True)
    pc.add_argument("--text", required=True)
    pc.add_argument("--pos", choices=["top", "middle", "bottom"], default="middle")
    pc.add_argument("--font", choices=list(FONTS.keys()), default=DEFAULT_FONT)
    pc.set_defaults(func=cmd_cover)

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
