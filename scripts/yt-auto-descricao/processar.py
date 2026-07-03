# -*- coding: utf-8 -*-
"""
AIOS — Auto-descrição de vídeos do YouTube.

Fluxo (roda na máquina do Enzo, precisa da GPU pro Whisper):
  1. Varre os uploads recentes do canal (@EnzoSparo) via YouTube Data API.
  2. Pra cada vídeo novo (postado depois da instalação e ainda não processado):
     baixa o áudio (yt-dlp) -> transcreve local (faster-whisper) ->
     gera resumo + capítulos + hashtags (claude -p) -> monta no template fixo ->
     publica a descrição via videos.update.
  3. Marca como processado. Se o áudio ainda não estiver baixável (vídeo recém-postado),
     NÃO marca — o próximo ciclo do agendador tenta de novo.

Uso:
  python processar.py                      # ciclo normal (pro agendador)
  python processar.py --dry-run            # gera mas NÃO publica (salva preview-<id>.txt)
  python processar.py --video=<ID>         # força um vídeo específico (ignora estado)
  python processar.py --video=<ID> --dry-run   # teste: gera e mostra, sem publicar

Reusa: receita de Whisper em C:\\Users\\canal\\Downloads\\transcricao-masterclass
       OAuth do YouTube no .env do projeto (escopo youtube.force-ssl).
"""
import os
import re
import sys
import json
import time
import subprocess
import urllib.parse
import urllib.request
import urllib.error
from pathlib import Path
from datetime import datetime, timezone

# Console do Windows é cp1252 e quebra com emoji/acento; força UTF-8 na saída.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# ----------------------------------------------------------------------------
# Config
# ----------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent
AIOS_DIR = SCRIPT_DIR.parent.parent
ENV_PATH = AIOS_DIR / ".env"

WHISPER_WORK = Path(r"C:\Users\canal\Downloads\transcricao-masterclass")
MODELS_DIR = WHISPER_WORK / "models"
CLAUDE_EXE = r"C:\Users\canal\.local\bin\claude.exe"
MODELO_CLAUDE = "claude-sonnet-4-6"

CHANNEL_ID = "UCifUfSNdly4yFOfzSDS2xog"
UPLOADS_PLAYLIST = "UU" + CHANNEL_ID[2:]
MAX_AGE_HOURS = 48            # ignora vídeos mais velhos que isto (não reprocessa catálogo)
MIN_AGE_SECONDS = 60         # espera 1 min após o vídeo ir ao ar (deixa o YouTube finalizar o upload)
MIN_TRANSCRICAO_CHARS = 200  # abaixo disso, considera que a transcrição falhou

ESTADO_PATH = SCRIPT_DIR / "estado.json"
LOG_PATH = SCRIPT_DIR / "log.txt"
LOCK_PATH = SCRIPT_DIR / ".lock"
TEMP_DIR = SCRIPT_DIR / "tmp"
TRANSCR_DIR = SCRIPT_DIR / "transcricoes"

DRY_RUN = ("--dry-run" in sys.argv) or (os.environ.get("YT_DRY_RUN") == "1")
ONLY_VIDEO = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--video=")), None)

# ----------------------------------------------------------------------------
# Template fixo da descrição (só resumo / capítulos / hashtags mudam)
# ----------------------------------------------------------------------------
HEADER = """🎓MasterClass de Antigravity + Claude Code (Curso Completo do Básico ao Avançado): https://masterclass.sparo.com.br/

🌍Nossa comunidade Grátis: https://www.skool.com/comunidade-de-automacao-com-ia-8164
🌟Hospede suas automações e aplicativos na VPS da Hostinger (10% OFF usando o cupom SPARO10): https://hostinger.com/SPARO10

📞Minha Agência de Automação(Sparo Automações): https://sparo.com.br
🤝Trabalhe comigo: Entre em contato pelo chat da nossa comunidade grátis!

Antigravity Download: https://antigravity.google/download"""

FOOTER = """Gostou do vídeo? Deixe seu like, inscreva-se no canal e ative o sininho para não perder nenhuma novidade sobre automação e inteligência artificial. Se tiver alguma dúvida, deixe nos comentários abaixo!"""

PROMPT = """Você é o editor de descrições do canal do Enzo Barbato no YouTube (@EnzoSparo), que ensina automação com IA (Claude Code, Antigravity) pra gente LEIGA em programação. Tom: português do Brasil, informal mas profissional, direto, frases curtas, entusiasmado sem ser apelão de vendas. Sempre "você", nunca "tu".

A partir da TRANSCRIÇÃO com timestamps no fim, gere SÓ o conteúdo variável da descrição:

1) "resumo": 1 parágrafo (4 a 7 frases) explicando o que o vídeo mostra na prática e qual a transformação/benefício pra quem assiste. Estilo do canal: começa forte, fala em resultado concreto. Não invente nada que não esteja na transcrição.

2) "capitulos": use entre %%NCAP_LO%% e %%NCAP_HI%% capítulos — proporcional à duração (este vídeo tem %%DUR%%): vídeo curto = poucos capítulos, vídeo longo = mais. O PRIMEIRO obrigatoriamente com ts "00:00". Cada item {"ts","titulo"}. ts no formato MM:SS (ou H:MM:SS se passar de 1h), em ordem crescente, usando momentos REAIS da transcrição (≥10s entre um e outro). Títulos curtos, específicos e que dão curiosidade, no estilo do canal (ex.: "O Grande Segredo: Protegendo a Janela de Contexto").

3) "hashtags": de 6 a 9. SEMPRE inclua #Antigravity #ClaudeCode #Automação #IA #SparoAutomacoes e some de 1 a 4 específicas do tema do vídeo.

Título do vídeo: %%TITLE%%
Duração aproximada: %%DUR%%

Responda APENAS com um JSON válido, sem markdown, sem crases, exatamente neste formato:
{"resumo":"...","capitulos":[{"ts":"00:00","titulo":"..."}],"hashtags":["#Antigravity"]}

TRANSCRIÇÃO:
%%TRANSCRIPT%%"""


# ----------------------------------------------------------------------------
# Log / util
# ----------------------------------------------------------------------------
def log(msg):
    linha = f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}"
    print(linha, flush=True)
    try:
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(linha + "\n")
    except Exception:
        pass


def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def idade_horas(iso):
    try:
        dt = datetime.strptime(iso, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
    except ValueError:
        dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
    return (datetime.now(timezone.utc) - dt).total_seconds() / 3600.0


def fmt_hms(sec):
    sec = int(sec)
    h, m, s = sec // 3600, (sec % 3600) // 60, sec % 60
    return f"{h:02d}:{m:02d}:{s:02d}"


def fmt_cap(sec):
    sec = int(sec)
    h, m, s = sec // 3600, (sec % 3600) // 60, sec % 60
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


def parse_ts(s):
    parts = [int(x) for x in str(s).strip().split(":")]
    while len(parts) < 3:
        parts.insert(0, 0)
    h, m, sec = parts[-3], parts[-2], parts[-1]
    return h * 3600 + m * 60 + sec


# ----------------------------------------------------------------------------
# .env / OAuth / YouTube Data API
# ----------------------------------------------------------------------------
def read_env():
    d = {}
    with open(ENV_PATH, encoding="utf-8") as f:
        for line in f:
            s = line.rstrip("\n")
            if "=" in s and not s.lstrip().startswith("#"):
                k, v = s.split("=", 1)
                d[k.strip()] = v.strip()
    return d


def get_access_token(env):
    body = urllib.parse.urlencode({
        "client_id": env["YOUTUBE_CLIENT_ID"],
        "client_secret": env["YOUTUBE_CLIENT_SECRET"],
        "refresh_token": env["YOUTUBE_REFRESH_TOKEN"],
        "grant_type": "refresh_token",
    }).encode()
    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=body)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())["access_token"]


def http_json(method, url, token=None, body=None):
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    if body is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")
        raise RuntimeError(f"HTTP {e.code} em {method} {url}\n{detail}")


def list_uploads(token, n=10):
    url = (f"https://www.googleapis.com/youtube/v3/playlistItems"
           f"?part=snippet,contentDetails&playlistId={UPLOADS_PLAYLIST}&maxResults={n}")
    d = http_json("GET", url, token)
    out = []
    for it in d.get("items", []):
        s = it["snippet"]
        pub = it.get("contentDetails", {}).get("videoPublishedAt") or s.get("publishedAt")
        out.append({"id": s["resourceId"]["videoId"], "publishedAt": pub, "title": s.get("title", "")})
    return out


def get_video(token, vid):
    url = (f"https://www.googleapis.com/youtube/v3/videos"
           f"?part=snippet,contentDetails,status&id={vid}")
    items = http_json("GET", url, token).get("items", [])
    return items[0] if items else None


def publicar(token, vid, snip, nova_desc):
    body = {"id": vid, "snippet": {
        "title": snip["title"],
        "categoryId": snip.get("categoryId", "27"),
        "description": nova_desc,
    }}
    for k in ("tags", "defaultLanguage", "defaultAudioLanguage"):
        if snip.get(k):
            body["snippet"][k] = snip[k]
    return http_json("PUT", "https://www.googleapis.com/youtube/v3/videos?part=snippet", token, body)


# ----------------------------------------------------------------------------
# Download (yt-dlp) + Whisper (receita validada do Enzo)
# ----------------------------------------------------------------------------
def add_cuda_dlls():
    """Registra as pastas de DLL CUDA (nvidia/*/bin) no search path — copiado de transcrever.py."""
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
        return WhisperModel("large-v3", device="cpu", compute_type="int8", download_root=str(MODELS_DIR))
    try:
        m = WhisperModel("large-v3", device="cuda", compute_type="float16", download_root=str(MODELS_DIR))
        log(">> Whisper na GPU (large-v3, float16)")
        return m
    except Exception as e:
        log(f">> GPU indisponível ({e}); caindo pra CPU")
        return WhisperModel("large-v3", device="cpu", compute_type="int8", download_root=str(MODELS_DIR))


def baixar_audio(vid):
    TEMP_DIR.mkdir(exist_ok=True)
    for f in TEMP_DIR.glob(f"{vid}.*"):
        try:
            f.unlink()
        except Exception:
            pass
    out_tpl = str(TEMP_DIR / f"{vid}.%(ext)s")
    cmd = [sys.executable, "-m", "yt_dlp", "-f", "bestaudio/best",
           "--no-playlist", "--no-warnings", "-o", out_tpl,
           f"https://www.youtube.com/watch?v={vid}"]
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        log(f"[download] falhou ({vid}): {(r.stderr or '')[-400:]}")
        return None
    files = list(TEMP_DIR.glob(f"{vid}.*"))
    return files[0] if files else None


def transcrever(model, caminho):
    segments, info = model.transcribe(
        str(caminho), language="pt", vad_filter=False, beam_size=5,
        condition_on_previous_text=False,
    )
    md_lines, full = [], []
    fim = 0.0
    for seg in segments:
        t = seg.text.strip()
        md_lines.append(f"[{fmt_hms(seg.start)}] {t}")
        full.append(t)
        fim = seg.end
    return "\n".join(md_lines), " ".join(full), fim


# ----------------------------------------------------------------------------
# Geração de conteúdo (claude -p) + montagem
# ----------------------------------------------------------------------------
def alvo_capitulos(dur_s):
    """Nº-alvo de capítulos proporcional à duração: ~1 a cada 2,5 min, entre 3 e 12."""
    return max(3, min(12, round((dur_s / 60.0) / 2.5)))


def _downsample(itens, cap):
    """Se vierem capítulos demais, mantém uma amostra uniforme (preserva 1º e último)."""
    if len(itens) <= cap:
        return itens
    idxs = sorted({round(i * (len(itens) - 1) / (cap - 1)) for i in range(cap)})
    return [itens[i] for i in idxs]


def gerar(title, dur_s, transcript_md):
    alvo = alvo_capitulos(dur_s)
    lo, hi = max(3, alvo - 1), min(12, alvo + 1)
    prompt = (PROMPT
              .replace("%%TITLE%%", title)
              .replace("%%DUR%%", fmt_cap(dur_s))
              .replace("%%NCAP_LO%%", str(lo))
              .replace("%%NCAP_HI%%", str(hi))
              .replace("%%TRANSCRIPT%%", transcript_md))
    r = subprocess.run([CLAUDE_EXE, "-p", "--model", MODELO_CLAUDE],
                       input=prompt, capture_output=True, text=True,
                       encoding="utf-8", errors="replace", cwd=str(SCRIPT_DIR))
    if r.returncode != 0:
        raise RuntimeError(f"claude -p falhou: {(r.stderr or '')[-400:]}")
    raw = (r.stdout or "").strip()
    m = re.search(r"\{.*\}", raw, re.S)
    if not m:
        raise RuntimeError(f"claude não devolveu JSON: {raw[:300]}")
    return json.loads(m.group(0))


def limpar_capitulos(caps, dur_s):
    itens = []
    for c in caps or []:
        try:
            itens.append((parse_ts(c["ts"]), str(c["titulo"]).strip()))
        except Exception:
            continue
    itens.sort(key=lambda x: x[0])
    if not itens:
        return []
    out = [(0, itens[0][1])]  # primeiro sempre 00:00
    teto = max(int(dur_s), 1) + 1
    for t, tit in itens[1:]:
        if t - out[-1][0] >= 10 and t < teto and tit:
            out.append((t, tit))
    return _downsample(out, min(12, alvo_capitulos(dur_s) + 1))


def montar(resumo, caps, hashtags):
    cap_block = "\n".join(f"{fmt_cap(t)} - {tit}" for t, tit in caps)
    tags_line = " ".join((h if str(h).startswith("#") else "#" + str(h)) for h in (hashtags or []))
    desc = (f"{HEADER}\n\n{resumo.strip()}\n\n"
            f"Neste tutorial, você aprenderá:\n{cap_block}\n\n"
            f"{tags_line}\n\n{FOOTER}")
    return desc.replace("<", "").replace(">", "")


# ----------------------------------------------------------------------------
# Estado / lock
# ----------------------------------------------------------------------------
def load_estado():
    if not ESTADO_PATH.exists():
        return None
    return json.loads(ESTADO_PATH.read_text(encoding="utf-8"))


def save_estado(e):
    ESTADO_PATH.write_text(json.dumps(e, ensure_ascii=False, indent=2), encoding="utf-8")


def marcar_processado(vid, title):
    e = load_estado() or {"instalado_em": now_iso(), "processados": {}}
    e["processados"][vid] = {"em": now_iso(), "titulo": title}
    save_estado(e)


def adquirir_lock():
    if LOCK_PATH.exists():
        try:
            idade = time.time() - LOCK_PATH.stat().st_mtime
            if idade < 20 * 60:  # lock fresco: outro ciclo ainda rodando
                return False
        except Exception:
            pass
    LOCK_PATH.write_text(str(os.getpid()), encoding="utf-8")
    return True


def soltar_lock():
    try:
        LOCK_PATH.unlink()
    except Exception:
        pass


# ----------------------------------------------------------------------------
# Pipeline por vídeo
# ----------------------------------------------------------------------------
def processar_um(token, model, vid):
    video = get_video(token, vid)
    if not video:
        log(f"{vid}: não encontrado")
        return False
    snip = video["snippet"]
    title = snip.get("title", "")
    log(f"=== {vid} | {title} ===")

    audio = baixar_audio(vid)
    if not audio:
        log(f"{vid}: áudio indisponível (talvez ainda processando) — tenta no próximo ciclo")
        return False  # NÃO marca processado -> retry no próximo agendamento

    try:
        md, full, dur = transcrever(model, audio)
    finally:
        try:
            audio.unlink()
        except Exception:
            pass

    if len(full) < MIN_TRANSCRICAO_CHARS:
        log(f"{vid}: transcrição curta demais ({len(full)} chars) — retry depois")
        return False

    TRANSCR_DIR.mkdir(exist_ok=True)
    (TRANSCR_DIR / f"{vid}.md").write_text(md, encoding="utf-8")

    dados = gerar(title, dur, md)
    caps = limpar_capitulos(dados.get("capitulos", []), dur)
    desc = montar(dados.get("resumo", ""), caps, dados.get("hashtags", []))

    if len(caps) < 3:
        log(f"[aviso] {vid}: só {len(caps)} capítulos — YouTube precisa de ≥3 pra renderizar.")

    if DRY_RUN:
        out = SCRIPT_DIR / f"preview-{vid}.txt"
        out.write_text(desc, encoding="utf-8")
        log(f"[DRY-RUN] {vid}: gerado ({len(desc)} chars, {len(caps)} capítulos) -> {out.name}")
        print("\n" + "=" * 70 + "\n" + desc + "\n" + "=" * 70 + "\n")
        return True

    publicar(token, vid, snip, desc)
    marcar_processado(vid, title)
    log(f"{vid}: PUBLICADO ✅ ({len(caps)} capítulos, {len(desc)} chars)")
    return True


def main():
    env = read_env()
    token = get_access_token(env)

    if ONLY_VIDEO:
        add_cuda_dlls()
        model = load_model()
        processar_um(token, model, ONLY_VIDEO)
        return

    if not adquirir_lock():
        log("outro ciclo em andamento — saindo.")
        return
    try:
        estado = load_estado()
        if estado is None:
            ups = list_uploads(token, 15)
            save_estado({
                "instalado_em": now_iso(),
                "ultimo_ciclo": now_iso(),
                "processados": {u["id"]: {"seed": True, "titulo": u["title"]} for u in ups},
            })
            log(f"inicializado: {len(ups)} vídeos do catálogo marcados, nada processado. "
                f"Só vídeos postados a partir de agora serão processados.")
            return

        estado["ultimo_ciclo"] = now_iso()  # heartbeat: confirma que o ciclo rodou
        save_estado(estado)
        cutoff = estado["instalado_em"]
        ups = list_uploads(token, 10)
        novos = [u for u in ups
                 if u["publishedAt"] and u["publishedAt"] > cutoff
                 and u["id"] not in estado["processados"]
                 and idade_horas(u["publishedAt"]) <= MAX_AGE_HOURS]
        if not novos:
            return  # nada novo: sai rápido, sem carregar o modelo

        # Espera 1 min após o vídeo ir ao ar antes de processar (o "1 minuto depois").
        alvos = []
        for u in novos:
            idade_s = idade_horas(u["publishedAt"]) * 3600.0
            if idade_s < MIN_AGE_SECONDS:
                log(f"{u['id']}: vídeo novo há {int(idade_s)}s — aguardando 1 min, processa no próximo ciclo.")
            else:
                alvos.append(u)
        if not alvos:
            return  # tem vídeo novo, mas ainda dentro do 1 min de espera

        log(f"{len(alvos)} vídeo(s) novo(s) pra processar.")
        add_cuda_dlls()
        model = load_model()
        for u in alvos:
            try:
                processar_um(token, model, u["id"])
            except Exception as e:
                log(f"{u['id']}: ERRO — {e}")
    finally:
        soltar_lock()


if __name__ == "__main__":
    main()
