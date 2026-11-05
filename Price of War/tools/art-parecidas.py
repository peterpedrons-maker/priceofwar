"""Compara artes novas com as artes de carta existentes.
Uso: python3.11 -I tools/art-parecidas.py saida.png nome1=img1 nome2=img2 ...
Mede: dHash (estrutura), histograma de cor e miniatura 16x16 (composição).
Gera ranking no terminal e uma folha de contato (nova | 3 mais parecidas)."""
import sys, glob, os
import numpy as np
from PIL import Image
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'assets')
def feats(im):
    im = im.convert('RGB')
    w, h = im.size
    # recorta o miolo (cartas têm proporção diferente da arte)
    g = im.resize((17, 16)).convert('L'); a = np.asarray(g, float)
    dh = (a[:, 1:] > a[:, :-1]).flatten()
    t = np.asarray(im.resize((16, 16)), float).flatten() / 255
    hs = np.asarray(im.resize((64, 64)).convert('HSV'))
    hist = np.concatenate([np.histogram(hs[..., i], 8, (0, 256))[0] for i in range(3)]).astype(float)
    hist /= hist.sum()
    return dh, t, hist
def dist(a, b):
    d1 = (a[0] != b[0]).mean()
    d2 = np.abs(a[1] - b[1]).mean() * 2
    d3 = np.abs(a[2] - b[2]).sum() / 6
    return d1 * .4 + d2 * .4 + d3 * .2, d1, d2, d3
files = [f for f in glob.glob(root + '/**/*.webp', recursive=True) + glob.glob(root + '/**/*.png', recursive=True)
         if not os.path.basename(f).startswith(('avatar', 'attack', 'ui', 'icon')) and 'card3d' not in f]
ex = {}
for f in files:
    try:
        im = Image.open(f)
        if im.size[0] < 200: continue
        ex[f] = (feats(im), im)
    except Exception: pass
out = sys.argv[1]; novos = [a.split('=', 1) for a in sys.argv[2:]]
rows = []
for nome, p in novos:
    im = Image.open(p); fn = feats(im)
    r = sorted(((dist(fn, v[0]), f) for f, v in ex.items()), key=lambda x: x[0][0])[:3]
    print(f"\n{nome}")
    for d, f in r: print(f"  {d[0]:.3f} (hash {d[1]:.2f} cor {d[2]:.2f} hist {d[3]:.2f}) {os.path.relpath(f, root)}")
    rows.append((im, [ex[f][1] for _, f in r], nome, r))
S = 220
sheet = Image.new('RGB', (S * 4, S * len(rows)), 'white')
for i, (im, sims, nome, r) in enumerate(rows):
    for j, x in enumerate([im] + sims):
        sheet.paste(x.convert('RGB').resize((S, S)), (j * S, i * S))
sheet.save(out)
