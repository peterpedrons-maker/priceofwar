"""Removes the flat magenta background of the painted weapon/projectile art (art-prompts/reference/projeteis/*.jpg, section 4ac of
   art-prompts/README.md) and writes trimmed WebP sprites with alpha to public/mockups/projeteis/art/.
   python3 tools/vfx/key_art.py"""
import os, numpy as np
from PIL import Image
from scipy.ndimage import binary_erosion, binary_dilation, gaussian_filter

HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, '..', '..', 'art-prompts', 'reference', 'projeteis')
OUT = os.path.join(HERE, '..', '..', 'public', 'mockups', 'projeteis', 'art')
# name: (file, output width, horizontal squash for the boulders that came out stretched)
JOBS = {
    'flecha': ('flecha.jpg', 560, 1), 'lanca': ('lanca.jpg', 700, 1), 'virote': ('virote.jpg', 520, 1), 'flecha-veneno': ('flecha-veneno.jpg', 560, 1),
    'pedra': ('pedra.jpg', 1000, .36), 'pedra-brasa': ('pedra-brasa.jpg', 1000, .38),
    'espada-aurelion': ('espada-aurelion.jpg', 700, 1), 'martelo': ('martelo.jpg', 620, 1),
}

# a few drawings came with a glow around them that is half magenta: cut harder
LOHI = {}
TIGHT = {'lanca': 2}      # keep only what is within 2 px of the solid part of the drawing (drops the soft glow)


def key(rgb, lo=38, hi=95):
    a = rgb.astype(float)
    border = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
    bg = np.median(border, axis=0)
    d = np.sqrt(((a - bg) ** 2).sum(axis=2))
    alpha = np.clip((d - lo) / (hi - lo), 0, 1)
    alpha = gaussian_filter(alpha, 0.6)
    alpha = np.clip((alpha - .08) / .84, 0, 1)
    # un-mix the background colour from the soft edge so no magenta halo is left
    al = np.clip(alpha, 1e-3, 1)[..., None]
    fg = np.where(alpha[..., None] < .98, (a - bg * (1 - al)) / al, a)
    return np.clip(fg, 0, 255), alpha


for name, (f, w, squash) in JOBS.items():
    im = Image.open(os.path.join(SRC, f)).convert('RGB')
    rgb, alpha = key(np.array(im), *(LOHI.get(name, (38, 95))))
    if name in TIGHT:
        core = binary_dilation(alpha > .92, iterations=TIGHT[name])
        alpha = alpha * gaussian_filter(core.astype(float), .8)
    # pull the matte in by a hair to lose the light fringe the generator leaves around the objects
    solid = binary_erosion(alpha > .5, iterations=1)
    alpha = np.where(solid, alpha, alpha * .55)
    # despill: near the outline, take the magenta (what red and blue share above green) out of the colour
    edge = binary_dilation(~binary_erosion(alpha > .5, iterations=3), iterations=2) & (alpha > .02)
    m = np.clip(np.minimum(rgb[..., 0], rgb[..., 2]) - rgb[..., 1], 0, None) * .95
    rgb = rgb.copy(); rgb[..., 0] = np.where(edge, rgb[..., 0] - m, rgb[..., 0]); rgb[..., 2] = np.where(edge, rgb[..., 2] - m, rgb[..., 2])
    rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    img = Image.fromarray(rgba, 'RGBA')
    bbox = img.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    img = img.crop(bbox)
    h = int(img.height * w / img.width * (1 if squash == 1 else 1))
    img = img.resize((int(w * (squash if squash != 1 else 1)), h), Image.LANCZOS) if squash != 1 else img.resize((w, h), Image.LANCZOS)
    img.save(os.path.join(OUT, name + '.webp'), quality=92, method=6)
    print(name, img.size)
