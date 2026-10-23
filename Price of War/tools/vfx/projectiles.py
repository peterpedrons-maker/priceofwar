"""Projectiles and blasts for ranged attacks (mockup in public/mockups/projeteis/), all drawn here with numpy/PIL:
   fx-boom-fire.webp   fireball, 30 frames of 256 px in 6 columns (draw it ADDITIVELY: 'lighter' / mix-blend-mode: screen)
   fx-boom-smoke.webp  the smoke that is left behind, same grid (normal blending, drawn under the fire)
   fx-holy.webp        golden burst with rays, 24 frames of 256 px in 6 columns (additive)
   fx-puff.webp        4 soft smoke puffs of 128 px side by side (trails and dust)
   fx-debris.webp      4 rock chunks of 64 px side by side
   proj-rock.webp      the boulder: plain (left) and with glowing cracks (right), 128 px each
   proj-bolt.webp / proj-lance.webp / proj-arrow.webp   pointing right
   python3 tools/vfx/projectiles.py   (writes to public/mockups/projeteis/)"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter, map_coordinates

OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'mockups', 'projeteis')
os.makedirs(OUT, exist_ok=True)
rs = np.random.default_rng(21)
S = 256
smooth = lambda a, b, x: (lambda t: t * t * (3 - 2 * t))(np.clip((x - a) / (b - a + 1e-9), 0, 1))
yy, xx = np.mgrid[0:S, 0:S].astype(float)


def fbm2(h, w, base=5, octaves=5, seed=None):
    r = np.random.default_rng(seed) if seed is not None else rs
    out = np.zeros((h, w)); amp = 1; tot = 0
    for o in range(octaves):
        f = gaussian_filter(r.random((h, w)), h / (base * 2 ** o), mode='wrap'); f = (f - f.min()) / (f.max() - f.min() + 1e-9)
        out += f * amp; tot += amp; amp *= .55
    return out / tot


def fbm3(h, w, d, base=5, octaves=5, seed=0):
    """noise that changes smoothly with the 3rd axis (time), wraps in x and y"""
    r = np.random.default_rng(seed)
    out = np.zeros((d, h, w)); amp = 1; tot = 0
    for o in range(octaves):
        v = r.random((d, h, w))
        f = gaussian_filter(v, (d / (3 + o), h / (base * 2 ** o), w / (base * 2 ** o)), mode='wrap')
        f = (f - f.min()) / (f.max() - f.min() + 1e-9)
        out += f * amp; tot += amp; amp *= .55
    return out / tot


def sheet(frames, cols, path, quality=90):
    rows = -(-len(frames) // cols)
    h, w = frames[0].shape[:2]
    img = Image.new('RGBA', (cols * w, rows * h), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        img.paste(Image.fromarray(np.clip(f, 0, 255).astype(np.uint8), 'RGBA'), ((i % cols) * w, (i // cols) * h))
    img.save(os.path.join(OUT, path), quality=quality, method=6)
    print(path, img.size, os.path.getsize(os.path.join(OUT, path)) // 1024, 'KB')


# ── fire ramp (black-body-ish): 0 transparent -> deep red -> orange -> yellow -> white ─────────────────────────────
def fire_ramp(v):
    v = np.clip(v, 0, 1)
    stops = [(0.0, (0, 0, 0)), (0.12, (110, 14, 4)), (0.32, (225, 60, 8)), (0.55, (255, 140, 20)), (0.78, (255, 214, 90)), (1.0, (255, 252, 230))]
    out = np.zeros(v.shape + (3,))
    for (a, ca), (b, cb) in zip(stops[:-1], stops[1:]):
        m = (v >= a) & (v <= b); t = ((v - a) / (b - a))[m][:, None]
        out[m] = np.array(ca) * (1 - t) + np.array(cb) * t
    return out


NF = 30
# billows that change smoothly with time (3-D noise); contrast boosted so the edges are ragged and lumpy
def punch(v, k=2.4): return np.clip((v - .5) * k + .5, 0, 1)
N_BIG = punch(fbm3(S, S, NF, base=3, octaves=6, seed=3), 1.9)
N_MID = punch(fbm3(S, S, NF, base=7, octaves=5, seed=4), 2.2)
N_FINE = fbm3(S, S, NF, base=16, octaves=4, seed=6)
WARP_X = fbm2(S, S, base=2.5, octaves=4, seed=5) - .5
WARP_Y = fbm2(S, S, base=2.5, octaves=4, seed=15) - .5
ease_out = lambda x: 1 - (1 - np.clip(x, 0, 1)) ** 2.4

WINDOW = smooth(1.0, 0.66, np.hypot(xx - S / 2, yy - S / 2) / (S / 2))     # nothing is cut off by the frame edge
fire_frames, smoke_frames = [], []
for f in range(NF):
    t = f / (NF - 1)
    cx, cy = S / 2, S * 0.60
    grow = ease_out(t / 0.62)
    # the whole domain is pushed outwards by turbulence that grows with the blast: that is what makes the cauliflower
    amp = 26 + 62 * grow
    wx = xx + WARP_X * amp * 2.0
    wy = yy + WARP_Y * amp * 2.0 - 26 * smooth(0.1, 1, t) * (yy / S)
    big, mid, fine = N_BIG[f], N_MID[f], N_FINE[f]
    # ── fire
    R = 34 + 88 * grow
    d = np.hypot(wx - cx, wy - cy) / R
    v = (1.0 - d) * 1.25 + (big - .5) * 1.0 + (mid - .5) * 0.7 + (fine - .5) * 0.25
    cool = (1 - smooth(0.18, 0.9, t)) ** 1.1
    body = smooth(0.02, 0.22, v)
    heat = np.clip(v * 0.95, 0, 1) ** 1.1 * body * cool * (0.5 + 0.95 * mid) * (0.8 + 0.4 * fine)
    heat += 1.1 * np.exp(-(np.hypot(xx - cx, yy - cy) / (14 + 56 * t)) ** 2) * (1 - smooth(0.0, 0.3, t))      # white flash at the start
    heat = gaussian_filter(heat, 0.7)
    col = fire_ramp(heat)
    alpha = np.clip(heat * 2.6, 0, 1) * 255 * WINDOW
    fire_frames.append(np.dstack([col, alpha]))
    # ── smoke: grows later and larger, climbs, thins out; lit from underneath by the fire
    Rs = 52 + 78 * ease_out(t / 0.9)
    scy = cy - 8 - 46 * smooth(0.0, 1.0, t)
    sd = np.hypot(wx - cx, wy - scy) / Rs
    sv = (1.0 - sd) * 1.15 + (big - .5) * 1.1 + (mid - .5) * 0.8
    sbody = smooth(0.0, 0.2, sv)
    life = smooth(0.04, 0.22, t) * (1 - smooth(0.72, 1.0, t))
    lit = gaussian_filter(heat, 10) * 2.4
    shade = 0.55 + 0.75 * (1 - mid) * (0.6 + 0.4 * big)
    base = 70 * shade * (1 + 0.9 * smooth(0.3, 1.0, t))
    scol = np.dstack([base + 255 * 0.5 * lit, base * 0.9 + 140 * 0.5 * lit, base * 0.8 + 50 * 0.4 * lit])
    smoke_frames.append(np.dstack([np.clip(scol, 0, 255), sbody * life * 1.0 * 255 * WINDOW]))
sheet(fire_frames, 6, 'fx-boom-fire.webp', 92)
sheet(smoke_frames, 6, 'fx-boom-smoke.webp', 88)

# ── holy burst: a gold-white flash, an expanding ring and rays (additive) ───────────────────────────────────────────
NH = 24
ang = np.arctan2(yy - S / 2, xx - S / 2)
rays_a = fbm2(1, 1, 1) if False else None
ray_noise = gaussian_filter(rs.random(720), 3, mode='wrap'); ray_noise = (ray_noise - ray_noise.min()) / (ray_noise.max() - ray_noise.min())
ray_idx = ((ang + np.pi) / (2 * np.pi) * 719).astype(int)
rays = ray_noise[ray_idx]
holy_frames = []
spark = [(rs.random() * 2 * np.pi, 0.35 + rs.random() * 0.6, 0.5 + rs.random()) for _ in range(26)]
for f in range(NH):
    t = f / (NH - 1)
    r = np.hypot(xx - S / 2, yy - S / 2)
    core = np.exp(-(r / (22 + 70 * t)) ** 2) * (1 - smooth(0.0, 0.7, t)) * 1.6
    ringR = 18 + 100 * (1 - (1 - t) ** 2)
    ring = np.exp(-((r - ringR) / (7 + 10 * t)) ** 2) * (1 - smooth(0.2, 1.0, t))
    rr = np.clip(1 - r / (120 * (0.5 + t)), 0, 1)
    ray = (rays ** 2.2) * rr ** 1.5 * (1 - smooth(0.05, 0.8, t)) * 1.4
    glow = np.exp(-(r / 95) ** 2) * (1 - smooth(0.1, 1, t)) * 0.45
    inten = np.clip(core + ring + ray + glow, 0, 1.6)
    img = np.zeros((S, S, 4))
    img[..., 0] = 255 * np.clip(inten * 1.0, 0, 1)
    img[..., 1] = 244 * np.clip(inten * 0.96, 0, 1)
    img[..., 2] = 200 * np.clip(inten * 0.7 - 0.05, 0, 1)
    img[..., 3] = np.clip(inten * 1.25, 0, 1) * 255
    # little floating sparks
    pil = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), 'RGBA'); dr = ImageDraw.Draw(pil)
    for a, sp, sz in spark:
        rad = 10 + sp * 112 * (1 - (1 - t) ** 1.6)
        fade = (1 - smooth(0.45, 1.0, t)) * smooth(0.0, 0.1, t)
        if fade <= 0: continue
        x0 = S / 2 + np.cos(a) * rad; y0 = S / 2 + np.sin(a) * rad - 14 * t
        k = sz * 2.2 * fade
        dr.ellipse([x0 - k, y0 - k, x0 + k, y0 + k], fill=(255, 238, 170, int(255 * fade)))
    holy_frames.append(np.array(pil).astype(float))
sheet(holy_frames, 6, 'fx-holy.webp', 90)

# ── soft smoke puffs for trails / dust ────────────────────────────────────────────────────────────────────────────
puffs = []
P = 128
py, px = np.mgrid[0:P, 0:P].astype(float)
for i in range(4):
    nn = fbm2(P, P, base=4, octaves=4, seed=40 + i)
    d = np.hypot(px - P / 2, py - P / 2) / (P / 2)
    a = smooth(1.0, 0.1, d + (nn - .5) * 0.9) * 0.9
    shade = 150 + 90 * (nn - .3)
    puffs.append(np.dstack([np.clip(shade, 0, 255), np.clip(shade * 0.96, 0, 255), np.clip(shade * 0.9, 0, 255), a * 255]))
sheet(puffs, 4, 'fx-puff.webp', 88)

# ── rock chunks (debris) and the boulder ──────────────────────────────────────────────────────────────────────────
def rock(size, seed, glow=False, rough=0.16):
    r = np.random.default_rng(seed)
    N = size * 4
    y, x = np.mgrid[0:N, 0:N].astype(float)
    cx = cy = N / 2
    th = np.arctan2(y - cy, x - cx)
    # lumpy outline
    lump = np.zeros_like(th)
    for k in range(2, 7):
        lump += r.normal(0, 1) / k * np.cos(k * th + r.random() * 6.28)
    Rr = N * 0.42 * (1 + rough * lump * 0.7)
    d = np.hypot(x - cx, y - cy)
    mask = smooth(1.0, 0.94, d / Rr)
    z = np.sqrt(np.clip(1 - (d / Rr) ** 2, 0, 1))
    n = fbm2(N, N, base=6, octaves=5, seed=seed + 100)
    n2 = fbm2(N, N, base=18, octaves=3, seed=seed + 200)
    height = z * 0.75 + (n - .5) * 0.55 + (n2 - .5) * 0.18
    gy, gx = np.gradient(gaussian_filter(height, 2.0))
    nx, ny, nz = -gx * 26, -gy * 26, np.ones_like(gx)
    ln = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2); nx, ny, nz = nx / ln, ny / ln, nz / ln
    L = np.array([-0.55, -0.6, 0.58]); L = L / np.linalg.norm(L)
    diff = np.clip(nx * L[0] + ny * L[1] + nz * L[2], 0, 1)
    rim = np.clip(1 - z, 0, 1) ** 2
    base = 0.12 + 0.95 * diff ** 1.3 + 0.14 * (n2 - .5) - 0.45 * rim
    base = np.clip(base, 0, 1.15)
    col = np.dstack([base * 150 + 22, base * 138 + 20, base * 124 + 18])
    if glow:
        cr = smooth(0.58, 0.5, np.abs(gaussian_filter(n, 1.5) - 0.5) + 0.35 * (1 - z) * 0.0) * (0.35 + 0.65 * z)
        crack = (np.abs(fbm2(N, N, base=7, octaves=4, seed=seed + 300) - 0.5) < 0.022).astype(float)
        crack = gaussian_filter(crack, 1.8) * 2.0 * (0.4 + 0.6 * z)
        col = col + np.dstack([crack * 255, crack * 90, crack * 10])
    img = np.dstack([np.clip(col, 0, 255), mask * 255])
    im = Image.fromarray(img.astype(np.uint8), 'RGBA').resize((size, size), Image.LANCZOS)
    return np.array(im).astype(float)


sheet([rock(64, 7, rough=0.5), rock(64, 8, rough=0.5), rock(64, 9, rough=0.5), rock(64, 10, rough=0.5)], 4, 'fx-debris.webp', 90)
sheet([rock(128, 3, rough=0.14), rock(128, 3, glow=True, rough=0.14)], 2, 'proj-rock.webp', 92)


# ── bolt, lance, arrow: drawn big and shrunk (anti-aliasing), pointing right ───────────────────────────────────────
def draw(w, h, fn, path, ss=4):
    im = Image.new('RGBA', (w * ss, h * ss), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    fn(d, w * ss, h * ss, ss)
    im = im.filter(ImageFilter.GaussianBlur(ss * 0.35)).resize((w, h), Image.LANCZOS)
    im.save(os.path.join(OUT, path), quality=92, method=6); print(path, im.size)


def grad_line(d, x0, x1, yc, thick, c0, c1, steps=40):
    for i in range(steps):
        t = i / (steps - 1)
        xa = x0 + (x1 - x0) * i / steps; xb = x0 + (x1 - x0) * (i + 1) / steps + 1
        c = tuple(int(c0[k] * (1 - t) + c1[k] * t) for k in range(3)) + (255,)
        d.rectangle([xa, yc - thick / 2, xb, yc + thick / 2], fill=c)


def bolt(d, W, H, ss):
    """crossbow bolt: short thick wooden shaft, dark broad steel head with a collar, two leather vanes"""
    yc = H / 2
    wood0, wood1 = (88, 58, 30), (156, 108, 58)
    grad_line(d, W * 0.20, W * 0.80, yc, H * 0.26, wood0, wood1)                           # shaft
    grad_line(d, W * 0.20, W * 0.80, yc - H * 0.07, H * 0.07, (200, 156, 98), (222, 184, 124))    # light along the top
    grad_line(d, W * 0.20, W * 0.80, yc + H * 0.09, H * 0.05, (60, 38, 18), (82, 54, 28))         # shadow along the bottom
    d.rectangle([W * 0.77, yc - H * 0.20, W * 0.83, yc + H * 0.20], fill=(70, 74, 82, 255))        # collar
    d.rectangle([W * 0.77, yc - H * 0.20, W * 0.79, yc + H * 0.20], fill=(150, 156, 166, 255))
    d.polygon([(W * 0.82, yc - H * 0.40), (W * 1.0, yc), (W * 0.82, yc + H * 0.40)], fill=(120, 128, 140, 255))   # head
    d.polygon([(W * 0.82, yc - H * 0.40), (W * 1.0, yc), (W * 0.82, yc)], fill=(206, 214, 226, 255))              # lit half
    d.line([(W * 0.83, yc), (W * 0.99, yc)], fill=(90, 96, 108, 255), width=int(ss * 0.8))
    for x0 in (0.02, 0.10):                                                                   # vanes (leather)
        d.polygon([(W * x0, yc - H * 0.08), (W * (x0 + .05), yc - H * 0.46), (W * (x0 + .14), yc - H * 0.46), (W * (x0 + .17), yc - H * 0.06)], fill=(98, 56, 34, 255))
        d.polygon([(W * x0, yc + H * 0.08), (W * (x0 + .05), yc + H * 0.46), (W * (x0 + .14), yc + H * 0.46), (W * (x0 + .17), yc + H * 0.06)], fill=(74, 40, 24, 255))
    d.rectangle([W * 0.0, yc - H * 0.09, W * 0.05, yc + H * 0.09], fill=(60, 40, 22, 255))      # nock


def arrow(d, W, H, ss):
    """longbow arrow: light shaft (readable on dark ground), leaf-shaped steel head, three-feather fletching"""
    yc = H / 2
    grad_line(d, W * 0.06, W * 0.90, yc, H * 0.17, (176, 134, 84), (222, 186, 130))
    grad_line(d, W * 0.06, W * 0.90, yc - H * 0.045, H * 0.05, (246, 224, 178), (255, 240, 200))
    d.polygon([(W * 0.84, yc), (W * 0.915, yc - H * 0.27), (W * 1.0, yc), (W * 0.915, yc + H * 0.27)], fill=(176, 184, 196, 255))     # leaf head
    d.polygon([(W * 0.84, yc), (W * 0.915, yc - H * 0.27), (W * 1.0, yc)], fill=(232, 238, 246, 255))
    for k in range(3):                                                                        # feathers
        x = W * (0.0 + k * 0.05)
        col_t = (244, 236, 218, 255) if k != 1 else (200, 56, 46, 255)
        col_b = (208, 200, 182, 255) if k != 1 else (150, 36, 32, 255)
        d.polygon([(x, yc), (x + W * 0.05, yc - H * 0.34), (x + W * 0.12, yc - H * 0.34), (x + W * 0.10, yc)], fill=col_t)
        d.polygon([(x, yc), (x + W * 0.05, yc + H * 0.34), (x + W * 0.12, yc + H * 0.34), (x + W * 0.10, yc)], fill=col_b)


def lance(d, W, H, ss):
    """holy lance: golden banded shaft, a collar, a leaf-shaped silver blade with a ridge, a small red pennant"""
    yc = H / 2
    grad_line(d, W * 0.05, W * 0.74, yc, H * 0.15, (140, 100, 36), (232, 192, 90))
    grad_line(d, W * 0.05, W * 0.74, yc - H * 0.04, H * 0.045, (255, 236, 168), (255, 248, 214))
    grad_line(d, W * 0.05, W * 0.74, yc + H * 0.05, H * 0.035, (96, 64, 20), (150, 108, 40))
    for x in (0.16, 0.30, 0.44, 0.58):
        d.rectangle([W * x, yc - H * 0.12, W * (x + 0.016), yc + H * 0.12], fill=(110, 70, 18, 255))
    d.polygon([(W * 0.58, yc - H * 0.03), (W * 0.72, yc - H * 0.34), (W * 0.74, yc - H * 0.05)], fill=(196, 40, 36, 255))       # pennant
    d.polygon([(W * 0.58, yc - H * 0.03), (W * 0.72, yc - H * 0.34), (W * 0.66, yc - H * 0.06)], fill=(236, 80, 64, 255))
    d.rectangle([W * 0.72, yc - H * 0.22, W * 0.80, yc + H * 0.22], fill=(206, 164, 64, 255))                                      # collar
    d.rectangle([W * 0.72, yc - H * 0.22, W * 0.745, yc + H * 0.22], fill=(255, 226, 130, 255))
    d.rectangle([W * 0.78, yc - H * 0.16, W * 0.80, yc + H * 0.16], fill=(120, 80, 22, 255))
    blade = [(W * 0.79, yc), (W * 0.86, yc - H * 0.38), (W * 0.95, yc - H * 0.2), (W * 1.0, yc), (W * 0.95, yc + H * 0.2), (W * 0.86, yc + H * 0.38)]
    d.polygon(blade, fill=(176, 188, 206, 255))
    d.polygon([blade[0], blade[1], blade[2], blade[3]], fill=(240, 246, 255, 255))                                                  # lit half
    d.line([(W * 0.80, yc), (W * 0.99, yc)], fill=(120, 134, 156, 255), width=int(ss * 0.9))                                         # ridge
    d.ellipse([W * 0.0, yc - H * 0.12, W * 0.07, yc + H * 0.12], fill=(214, 170, 70, 255))                                          # butt cap


draw(150, 30, bolt, 'proj-bolt.webp', ss=6)
draw(130, 22, arrow, 'proj-arrow.webp', ss=6)
draw(250, 40, lance, 'proj-lance.webp', ss=6)
