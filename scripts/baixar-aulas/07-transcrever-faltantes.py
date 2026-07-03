# Wrapper robusto: globa os mp4 pelo Python (sem shell glob -> sem mangling de [ ] ( ) +)
# e pula os que já têm .txt. Reusa o transcrever.py validado.
import sys
from pathlib import Path

TRANSCR = r"C:\Users\canal\Downloads\transcricao-masterclass"
ROOT = Path(r"C:\Users\canal\Downloads\aulas-masterclass\Antigravity")

sys.path.insert(0, TRANSCR)
import transcrever as T  # roda só os imports do topo, não o main()

files = sorted(ROOT.glob("*/*.mp4"))
todo = [f for f in files if not (T.OUT_DIR / (f.stem + ".txt")).exists()]
print(f"Total de vídeos: {len(files)} | já transcritos: {len(files)-len(todo)} | faltando: {len(todo)}")
for f in todo:
    print("  faltando:", f.name)

if not todo:
    print("Nada a fazer — tudo transcrito.")
    sys.exit(0)

T.add_cuda_dlls()
model = T.load_model()
import time
t0 = time.time()
for f in todo:
    T.transcrever(model, f)
print(f"\n=== PRONTO: +{len(todo)} aulas em {time.time()-t0:.0f}s ===")
