"""A card burning away, as two sprite sheets that work over ANY card art:
   src/assets/fx-burn-mask.webp  alpha mask per frame (opaque = card still there) -> CSS mask on the live card
   src/assets/fx-burn-fire.webp  fire edge, scorch and embers drawn over it (card area plus padding)
   python3 tools/vfx/burn_sheets.py"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter

W, H = 232, 288                    # card area (same geometry as the punch overlay: frame = 332x388 with 50 px padding)
PADX, PADY = 50, 50
FW, FH = W + 2 * PADX, H + 2 * PADY
NF = 18; COLS = 6
rs = np.random.default_rng(8)
yy, xx = np.mgrid[0:H, 0:W].astype(float)
smooth = lambda a, b, x: (lambda t: t * t * (3 - 2 * t))(np.clip((x - a) / (b - a + 1e-9), 0, 1))

def fbm(h, w, base=6, octaves=5):
    out = np.zeros((h, w)); amp = 1; tot = 0
    for o in range(octaves):
        f = gaussian_filter(rs.random((h, w)), h / (base * 2 ** o), mode='wrap'); f = (f - f.min()) / (f.max() - f.min()); out += f * amp; tot += amp; amp *= .58
    return out / tot

n1 = fbm(H, W); n2 = fbm(H, W, base=14)
# time field: where the fire reaches each pixel and when (0 = first). It starts low-centre (where the card was hit) and spreads.
dist = np.hypot((xx - W * 0.5) / W, (yy - H * 0.62) / H * 0.85)
T = 0.5 * np.clip(dist / 0.78, 0, 1) + 0.38 * n1 + 0.12 * n2
T = (T - T.min()) / (T.max() - T.min())

def ramp(v):
    v = np.clip(v, 0, 1); xs = [0, .25, .5, .75, 1]
    cols = np.array([(120, 18, 4), (225, 70, 10), (255, 150, 30), (255, 215, 90), (255, 250, 220)], float)
    return np.stack([np.interp(v, xs, cols[:, c]) for c in range(3)], axis=-1)

# a rounded card outline so the overlay never paints outside the card (except the outer glow / embers)
m = Image.new('L', (W * 4, H * 4), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, W * 4 - 1, H * 4 - 1], radius=26 * 2 * 4 // 2, fill=255)
card = np.asarray(m.resize((W, H), Image.LANCZOS), float) / 255

masks, fires = [], []
ember_seed = np.random.default_rng(99)
for k in range(NF):
    p = -0.10 + 1.18 * k / (NF - 1)
    alive = smooth(p - 0.006, p + 0.006, T)                                 # 1 = card still there
    mk = np.dstack([np.full((H, W, 3), 255), alive * 255]).astype(np.uint8)
    masks.append(Image.fromarray(mk, 'RGBA'))
    # --- fire overlay (padded frame)
    flick = fbm(H, W, base=10, octaves=3)
    front = (1 - smooth(0.0, 0.07, T - p)) * smooth(-0.001, 0.0, T - p)       # glowing line just ahead of the burn (card still there)
    hot = np.clip(front * 1.5, 0, 1)
    ahead_glow = np.exp(-np.clip(T - p, 0, 1) / 0.06) * (T >= p)               # soft heat spreading into the unburnt card
    char = smooth(p + 0.04, p + 0.12, T) * (1 - smooth(p + 0.12, p + 0.30, T)) # scorched band
    behind = np.exp(-np.clip(p - T, 0, 1) / 0.05) * (T < p)                   # flames licking where the card already is gone
    lick = smooth(0.35, 0.8, flick) * behind
    R = np.zeros((H, W, 4))
    def over(layer_rgb, a):
        global R
        a = np.clip(a, 0, 1)[..., None]
        out_a = a + R[..., 3:4] * (1 - a)
        R = np.concatenate([(layer_rgb * a + R[..., :3] * R[..., 3:4] * (1 - a)) / np.maximum(out_a, 1e-6), out_a], axis=-1)
    over(np.array([18, 8, 4]) * np.ones((H, W, 1)), char * 0.6 * card)
    over(ramp(0.2 + 0.5 * ahead_glow) , ahead_glow * 0.55 * card)
    over(ramp(0.45 + 0.55 * np.clip(behind * 1.2 + lick, 0, 1)), np.clip(behind * 0.85 + lick * 0.6, 0, 1) * card)
    over(ramp(0.65 + 0.35 * hot), hot * card)
    layer = np.zeros((FH, FW, 4)); layer[PADY:PADY + H, PADX:PADX + W] = R
    img = Image.fromarray((layer * [1, 1, 1, 255]).clip(0, 255).astype(np.uint8), 'RGBA')
    # outer glow around the burning edge (spills a little outside the card), embers and smoke
    glow_src = np.zeros((FH, FW)); glow_src[PADY:PADY + H, PADX:PADX + W] = (hot * 0.9 + behind * 0.5) * card
    og = gaussian_filter(glow_src, 7)
    glow = Image.fromarray(np.dstack([np.full((FH, FW), 255), np.full((FH, FW), 120), np.full((FH, FW), 25), np.clip(og * 255 * 0.9, 0, 255)]).astype(np.uint8), 'RGBA')
    out = Image.alpha_composite(glow, img)
    d = ImageDraw.Draw(out)
    er = np.random.default_rng(500 + k)
    ys, xs = np.where((hot > 0.5) & (card > 0.5))
    if len(ys) and p > -0.05:
        for j in er.choice(len(ys), min(55, len(ys)), replace=False):
            rise = er.uniform(4, 60) * (0.4 + 0.6 * min(1, (k + 1) / 8))
            x, y = xs[j] + PADX + er.uniform(-8, 8), ys[j] + PADY - rise
            r = er.uniform(0.9, 2.1)
            d.ellipse([x - r, y - r, x + r, y + r], fill=(255, int(150 + er.integers(0, 90)), 50, int(110 + er.integers(0, 140))))
    # smoke drifting up, late frames
    if k >= 5:
        sm = np.zeros((FH, FW)); t = (k - 5) / (NF - 6)
        for i in range(6):
            cx = PADX + W * (0.25 + 0.5 * ((i * 37) % 10) / 10); cy = PADY + H * (0.38 - 0.55 * t) - 10 * i * t
            rr = 16 + 9 * ((i * 53) % 5) / 5
            sm += np.exp(-(((np.arange(FW)[None, :] - cx) ** 2 + (np.arange(FH)[:, None] - cy) ** 2) / (2 * rr ** 2)))
        sm = np.clip(sm, 0, 1) * 0.30 * smooth(0.0, 0.3, t) * (1 - smooth(0.55, 1.0, t))
        out = Image.alpha_composite(out, Image.fromarray(np.dstack([np.full((FH, FW), 70), np.full((FH, FW), 58), np.full((FH, FW), 52), sm * 255]).astype(np.uint8), 'RGBA'))
    fires.append(out)

ROWS = (NF + COLS - 1) // COLS
ms = Image.new('RGBA', (W * COLS, H * ROWS), (0, 0, 0, 0)); fs = Image.new('RGBA', (FW * COLS, FH * ROWS), (0, 0, 0, 0))
for i in range(NF):
    ms.paste(masks[i], ((i % COLS) * W, (i // COLS) * H)); fs.paste(fires[i], ((i % COLS) * FW, (i // COLS) * FH))
ms.save('../../src/assets/fx-burn-mask.webp', quality=92, alpha_quality=100, method=6)
fs.save('../../src/assets/fx-burn-fire.webp', quality=88, method=6)
print(NF, 'frames; mask', ms.size, 'fire', fs.size, 'cols', COLS, 'rows', ROWS, 'frame', FW, FH, 'pad', PADX / W, PADY / H)
