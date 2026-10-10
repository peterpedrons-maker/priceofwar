"""Reforço marker: a steel shield with an up-chevron (what an Infantaria in the Retaguarda is: the reserve that steps
forward when the card in front falls), plus the burst that plays when it appears.
   src/assets/fx-reinforce-badge.webp   the shield, 128x128, transparent (the number is drawn by code on top)
   src/assets/fx-reinforce-burst.webp   14 frames, 6 cols x 3 rows, 192x192 each: flash, shock ring, steel sparks
   python3 tools/vfx/reinforce_badge.py"""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter

# ── the shield ──────────────────────────────────────────────────────────────
S = 128; K = 4
def shield_path(cx, cy, w, h):
    # heater shield: flat top with softly cut corners, sides straight then curving to a point
    pts = []
    top = cy - h / 2; bot = cy + h / 2
    pts += [(cx - w / 2 + w * .10, top), (cx + w / 2 - w * .10, top), (cx + w / 2, top + h * .10)]
    pts += [(cx + w / 2, top + h * .52)]
    for t in np.linspace(0, 1, 28):
        x = cx + w / 2 * (1 - t) ** 1.6; y = top + h * .52 + (bot - top - h * .52) * (t ** 0.85)
        pts.append((x, y))
    pts = pts[:-1]
    mirror = [(2 * cx - x, y) for x, y in reversed(pts[3:])]
    return pts + [(cx, bot)] + mirror + [(cx - w / 2, top + h * .10)]

def make_badge():
    W = S * K
    def poly_mask(w, h, dy=0):
        m = Image.new('L', (W, W), 0); ImageDraw.Draw(m).polygon([(x, y + dy) for x, y in shield_path(W / 2, W / 2, w, h)], fill=255); return m
    outer = poly_mask(W * .80, W * .90)
    inner = poly_mask(W * .70, W * .79, dy=-W * .004)
    face = poly_mask(W * .62, W * .70, dy=-W * .004)
    o = np.asarray(outer, float) / 255; i_ = np.asarray(inner, float) / 255; f = np.asarray(face, float) / 255
    yy, xx = np.mgrid[0:W, 0:W].astype(float) / W
    # rim: brushed steel, light on the upper left
    rim_t = np.clip((xx * .6 + yy * .4 - .15) / .7, 0, 1)
    rim = np.stack([np.interp(rim_t, [0, .45, 1], c) for c in ([232, 160, 70], [238, 168, 76], [248, 186, 96])], axis=-1) * 0 + \
          np.stack([np.interp(rim_t, [0, .4, .6, 1], c) for c in ([236, 150, 96, 60], [242, 168, 112, 70], [250, 190, 132, 86])], axis=-1)
    # dark steel-blue face with a vertical sheen
    ft = np.clip(yy * 1.1 - .05, 0, 1)
    face_c = np.stack([np.interp(ft, [0, 1], c) for c in ([76, 28], [102, 44], [138, 72])], axis=-1)
    img = np.zeros((W, W, 4))
    img[..., :3] = rim; img[..., 3] = o * 255
    ring_in = (i_ > 0.5)
    dark = np.stack([np.full((W, W), v) for v in (24, 30, 42)], axis=-1)
    img[ring_in, :3] = dark[ring_in]
    fa = f > 0.5
    img[fa, :3] = face_c[fa]
    # inner top-left sheen on the face
    sheen = np.clip(1 - np.hypot(xx - .40, yy - .28) / .42, 0, 1) ** 2
    img[..., :3] = np.where(fa[..., None], img[..., :3] + sheen[..., None] * np.array([60, 80, 100]), img[..., :3])
    # chevron: two stacked up-arrows (a thick one and a thinner one under it), light steel with a glow
    ch = Image.new('L', (W, W), 0); d = ImageDraw.Draw(ch)
    cx = W / 2
    def chev(y0, half, thick):
        d.line([(cx - half, y0 + half * .75), (cx, y0), (cx + half, y0 + half * .75)], fill=255, width=int(thick), joint='curve')
        for sx in (-1, 1):
            r = thick / 2; d.ellipse([cx + sx * half - r, y0 + half * .75 - r, cx + sx * half + r, y0 + half * .75 + r], fill=255)
        d.ellipse([cx - thick / 2, y0 - thick / 2, cx + thick / 2, y0 + thick / 2], fill=255)
    chev(W * .30, W * .20, W * .075)
    chev(W * .50, W * .20, W * .075)
    c = np.asarray(ch, float) / 255
    glow = gaussian_filter(c, W * .018)
    img[..., :3] = np.where(fa[..., None], img[..., :3] + glow[..., None] * np.array([40, 120, 220]) * .9, img[..., :3])
    img[..., :3] = np.where(c[..., None] > .02, img[..., :3] * (1 - c[..., None]) + np.array([232, 244, 255]) * c[..., None], img[..., :3])
    # thin dark outline
    edge = gaussian_filter(o, 1.4 * K) - o
    img[..., :3] = img[..., :3] * (1 - np.clip(-edge * 6, 0, .7)[..., None])
    out = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), 'RGBA').resize((S, S), Image.LANCZOS)
    return out

badge = make_badge()
badge.save('src/assets/fx-reinforce-badge.webp', quality=95, method=6)

# ── the burst ───────────────────────────────────────────────────────────────
FW = 192; NF = 14; COLS = 6; ROWS = 3
yy, xx = np.mgrid[0:FW, 0:FW].astype(float)
cx = cy = FW / 2
rr = np.hypot(xx - cx, yy - cy)
rs = np.random.default_rng(12)
ang = rs.uniform(0, 2 * math.pi, 18); spd = rs.uniform(36, 82, 18); sz = rs.uniform(1.2, 2.6, 18)
frames = []
for k in range(NF):
    t = min(1.0, k / (NF - 1))
    a = np.zeros((FW, FW)); col = np.zeros((FW, FW, 3))
    # flash at the start
    fl = np.exp(-rr ** 2 / (2 * (26 + 20 * t) ** 2)) * max(0, 1 - t * 3.2) * 1.2
    # shock ring
    r0 = 12 + 70 * (1 - (1 - t) ** 2); wid = 5 - 3 * t
    ring = np.exp(-(rr - r0) ** 2 / (2 * wid ** 2)) * max(0.0, 1 - t) ** 1.3
    # second thinner ring a beat later
    t2 = min(1.0, max(0, t - .18) / .82)
    r1 = 10 + 62 * (1 - (1 - t2) ** 2)
    ring2 = np.exp(-(rr - r1) ** 2 / (2 * 2.2 ** 2)) * max(0.0, 1 - t2) ** 1.5 * (t > .18) * .7
    # radial shine rays
    th = np.arctan2(yy - cy, xx - cx)
    rays = (np.cos(th * 8 + 0.6) * .5 + .5) ** 6 * np.exp(-rr / (38 + 30 * t)) * max(0, 1 - t * 1.8) * .55
    # steel sparks flying out
    sp = np.zeros((FW, FW))
    for i in range(18):
        d = spd[i] * (1 - (1 - t) ** 2) + 6
        px = cx + math.cos(ang[i]) * d; py = cy + math.sin(ang[i]) * d + 10 * t * t
        life = max(0, 1 - t * 1.15)
        sp += np.exp(-((xx - px) ** 2 + (yy - py) ** 2) / (2 * (sz[i] * (1 - .4 * t)) ** 2)) * life * 1.3
    lum = fl + ring + ring2 + rays + sp
    lum = np.clip(lum, 0, 1.6)
    v = np.clip(lum / 1.3, 0, 1)
    colr = np.stack([np.interp(v, [0, .5, 1], [70, 150, 245]), np.interp(v, [0, .5, 1], [120, 200, 250]), np.interp(v, [0, .5, 1], [200, 245, 255])], axis=-1)
    alpha = np.clip(lum, 0, 1)
    frames.append(Image.fromarray(np.dstack([colr, alpha * 255]).astype(np.uint8), 'RGBA'))
sheet = Image.new('RGBA', (COLS * FW, ROWS * FW), (0, 0, 0, 0))
for i, f in enumerate(frames):
    sheet.paste(f, ((i % COLS) * FW, (i // COLS) * FW))
sheet.save('src/assets/fx-reinforce-burst.webp', quality=88, method=6)
print('ok', badge.size, sheet.size)
