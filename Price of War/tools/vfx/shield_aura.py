"""A magic shield around a card (like a divine shield): a translucent, shield-shaped bubble of ice-blue glass.
   src/assets/fx-shield-appear-sheet.webp  10 frames  the bubble inflates around the card, with a ring of light
   src/assets/fx-shield-loop-sheet.webp    24 frames  idle: a sheen glides over it, the rim breathes (seamless loop)
   src/assets/fx-shield-hit-sheet.webp     10 frames  a hit that does NOT break it: flash and ripples where it landed
   src/assets/fx-shield-break-sheet.webp   18 frames  it shatters into glass shards
   All frames are 332x388 (the card area, 232x288, plus 50 px on every side), 6 columns.
   python3 tools/vfx/shield_aura.py [preview]   (the preview GIF goes to /tmp/claude-0/shield_demo.gif)"""
import sys, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from scipy.spatial import cKDTree

W, H, PAD = 232, 288, 50
FW, FH = W + 2 * PAD, H + 2 * PAD
SS = 2                                  # supersampling
RW, RH = FW * SS, FH * SS
COLS = 6
yy, xx = np.mgrid[0:RH, 0:RW].astype(float)
ease = lambda x: x * x * (3 - 2 * x)
def back(x, k=1.9): return 1 + (k + 1) * (x - 1) ** 3 + k * (x - 1) ** 2

def shield_polygon(cx, cy, w, h):
    top = cy - h * 0.47; bot = cy + h * 0.53
    pts = [(cx - w / 2 + w * .12, top), (cx + w / 2 - w * .12, top), (cx + w / 2, top + h * .09), (cx + w / 2, top + h * .50)]
    for t in np.linspace(0, 1, 40):
        pts.append((cx + w / 2 * (1 - t) ** 1.55, top + h * .50 + (bot - top - h * .50) * t ** 0.9))
    pts = pts[:-1]
    mirror = [(2 * cx - x, y) for x, y in reversed(pts[3:])]
    return pts + [(cx, bot)] + mirror + [(cx - w / 2, top + h * .09)]

CX, CY = RW / 2, RH / 2 + 4 * SS
POLY = shield_polygon(CX, CY, (W + 44) * SS, (H + 62) * SS)
m_img = Image.new('L', (RW, RH), 0); ImageDraw.Draw(m_img).polygon(POLY, fill=255)
MASK = np.asarray(m_img, float) / 255
DIST = ndi.distance_transform_edt(MASK)
MAXD = DIST.max()
RIM = np.exp(-DIST / (5.0 * SS)) * MASK
RIM2 = np.exp(-DIST / (14.0 * SS)) * MASK

def render(t_loop=0.0, pulse=1.0):
    """the idle bubble at loop time t_loop in [0,1)"""
    top_grad = np.clip(1 - (yy - (CY - H * SS * 0.5)) / (H * SS * 1.1), 0, 1)
    fill = (0.07 + 0.10 * top_grad + 0.10 * (1 - DIST / MAXD)) * MASK
    breathe = 0.5 + 0.5 * math.sin(2 * math.pi * t_loop)
    rim = RIM * (0.65 + 0.35 * breathe) * pulse
    # a broad soft sheen sliding diagonally, once per loop
    diag = (xx / RW) * 0.65 + (yy / RH) * 0.35
    pos = -0.25 + 1.5 * t_loop
    sheen = np.exp(-((diag - pos) / 0.08) ** 2) * MASK * 0.55
    # fixed glass highlights: a curved glint at the upper left and a small one at the lower right
    gl1 = np.exp(-(((xx - (CX - W * SS * 0.30)) / (W * SS * 0.05)) ** 2 + ((yy - (CY - H * SS * 0.30)) / (H * SS * 0.18)) ** 2)) * MASK * 0.55
    gl2 = np.exp(-(((xx - (CX + W * SS * 0.30)) / (W * SS * 0.03)) ** 2 + ((yy - (CY + H * SS * 0.22)) / (H * SS * 0.07)) ** 2)) * MASK * 0.35
    lum = fill * 0.9 + rim * 0.95 + RIM2 * 0.12 * pulse + sheen + gl1 + gl2
    lum = np.clip(lum, 0, 1.3)
    col = np.stack([np.interp(np.clip(lum, 0, 1), [0, .5, 1], c) for c in ([90, 150, 240], [120, 195, 255], [235, 248, 255])], axis=-1)
    alpha = np.clip(fill * 0.9 + rim * 0.95 + RIM2 * 0.12 + sheen * 0.8 + gl1 * 0.8 + gl2 * 0.6, 0, 1) * MASK
    # a soft glow outside the rim
    outside = ndi.gaussian_filter(MASK, 7 * SS) * (1 - MASK) * 0.35 * pulse
    col = np.where((MASK > 0.5)[..., None], col, np.array([140, 205, 255]))
    return np.dstack([col, np.clip(alpha + outside, 0, 1) * 255])

def to_frame(rgba, scale=1.0, dx=0, dy=0, alpha_mul=1.0):
    img = Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), 'RGBA')
    if scale != 1.0 or dx or dy:
        cx, cy = RW / 2, RH / 2
        a = 1 / scale
        img = img.transform((RW, RH), Image.AFFINE, (a, 0, cx - a * (cx + dx * SS), 0, a, cy - a * (cy + dy * SS)), Image.BICUBIC)
    arr = np.asarray(img).astype(float); arr[..., 3] *= alpha_mul
    return Image.fromarray(arr.astype(np.uint8), 'RGBA').resize((FW, FH), Image.LANCZOS)

def sheet(frames, path):
    rows = math.ceil(len(frames) / COLS)
    sh = Image.new('RGBA', (COLS * FW, rows * FH), (0, 0, 0, 0))
    for i, f in enumerate(frames): sh.paste(f, ((i % COLS) * FW, (i // COLS) * FH))
    sh.save(path, quality=86, method=6); return sh

def add_light(rgba, mask, color, amount):
    out = rgba.copy()
    out[..., :3] = np.clip(out[..., :3] + mask[..., None] * np.array(color) * amount, 0, 255)
    out[..., 3] = np.clip(np.maximum(out[..., 3], mask * 255 * min(1, amount * 1.2)), 0, 255)
    return out

# ── appear ────────────────────────────────────────────────────────────────────
appear = []
base = render(0.0)
for k in range(10):
    t = k / 9
    sc = 0.78 + 0.22 * back(min(1, t / 0.8), 2.4)
    ring_r = (60 + 190 * ease(t)) * SS
    ring = np.exp(-((np.hypot(xx - CX, yy - CY) - ring_r) / (6 * SS)) ** 2) * (1 - t) ** 1.3
    fr = add_light(base, ring, (210, 240, 255), 0.9)
    appear.append(to_frame(fr, sc, 0, 0, alpha_mul=ease(min(1, t / 0.5))))
# ── loop ──────────────────────────────────────────────────────────────────────
loop = [to_frame(render(k / 24, 1.0)) for k in range(24)]
# ── hit that does not break it ────────────────────────────────────────────────
hit = []
hx, hy = CX, CY - H * SS * 0.36                      # where the blow lands (upper middle)
for k in range(10):
    t = k / 9
    r = np.hypot(xx - hx, yy - hy)
    flash = np.exp(-(r / (26 * SS)) ** 2) * max(0, 1 - t * 2.6) * 1.4
    ripple = np.exp(-((r - (10 + 150 * ease(t)) * SS) / (9 * SS)) ** 2) * (1 - t) ** 1.2 * MASK * 0.9
    pulse = 1 + 1.2 * math.exp(-((t - 0.1) / 0.18) ** 2)
    fr = render(0.3, pulse)
    fr = add_light(fr, flash + ripple, (225, 245, 255), 1.0)
    hit.append(to_frame(fr, 1 + 0.025 * math.exp(-((t - 0.1) / 0.15) ** 2)))
# ── break ─────────────────────────────────────────────────────────────────────
rs = np.random.default_rng(21)
inside = np.argwhere(MASK > 0.5)
seeds = inside[rs.choice(len(inside), 18, replace=False)]
tree = cKDTree(seeds)
_, owner = tree.query(np.column_stack([yy.ravel(), xx.ravel()]))
owner = owner.reshape(RH, RW)
shards = []
shield_img = render(0.35, 1.0)
for i in range(len(seeds)):
    m = (owner == i) & (MASK > 0.5)
    if m.sum() < 30: continue
    ys, xs = np.where(m)
    c = (xs.mean(), ys.mean())
    ang = math.atan2(c[1] - CY, c[0] - CX) + rs.normal(0, 0.35)
    dist0 = math.hypot(c[0] - CX, c[1] - CY)
    shards.append((m, c, ang, rs.uniform(90, 190) * SS, rs.uniform(-160, 160), (dist0 / (H * SS)) ))
brk = []
NFB = 18
for k in range(NFB):
    t = k / (NFB - 1)
    canvas = np.zeros((RH, RW, 4))
    if t < 0.12:                                       # a crack of light before it goes
        crack = np.exp(-(np.hypot(xx - CX, yy - CY) / (50 * SS)) ** 2) * (1 - t / 0.12) * 0.9
    else: crack = None
    for m, c, ang, speed, spin, d0 in shards:
        if t < 0.08:
            canvas[m] = shield_img[m]; continue
        u = (t - 0.08) / 0.92
        mv = speed * ease(min(1, u * 1.15))
        dx, dy = math.cos(ang) * mv / SS, math.sin(ang) * mv / SS + 40 * u * u
        layer = np.zeros((RH, RW, 4)); layer[m] = shield_img[m]
        layer[..., 3] *= 1.0
        pil = Image.fromarray(np.clip(layer, 0, 255).astype(np.uint8), 'RGBA')
        th = math.radians(spin * u); s = 1 - 0.45 * u
        cs, sn = math.cos(th), math.sin(th)
        a = cs / s; b = -sn / s; d = sn / s; e = cs / s
        cx0, cy0 = c[0] + dx * SS, c[1] + dy * SS
        pil = pil.transform((RW, RH), Image.AFFINE, (a, b, c[0] - a * cx0 - b * cy0, d, e, c[1] - d * cx0 - e * cy0), Image.BICUBIC)
        arr = np.asarray(pil).astype(float); arr[..., 3] *= (1 - ease(max(0, (u - 0.35) / 0.65)))
        # edge glints on the shard
        arr = add_light(arr, np.clip(ndi.gaussian_filter(arr[..., 3] / 255, 1.2) * 0, 0, 1), (255, 255, 255), 0)
        a_ = arr[..., 3:4] / 255; ca = canvas[..., 3:4] / 255
        oa = a_ + ca * (1 - a_)
        canvas[..., :3] = (arr[..., :3] * a_ + canvas[..., :3] * ca * (1 - a_)) / np.clip(oa, 1e-3, 1)
        canvas[..., 3:4] = oa * 255
    fl = np.exp(-(np.hypot(xx - CX, yy - CY) / (90 * SS)) ** 2) * max(0, 1 - t * 4) * 1.1
    ring = np.exp(-((np.hypot(xx - CX, yy - CY) - (30 + 220 * ease(t)) * SS) / (7 * SS)) ** 2) * max(0, 1 - t * 1.4) * 0.8
    canvas = add_light(canvas, fl + ring + (crack if crack is not None else 0), (225, 245, 255), 1.0)
    brk.append(to_frame(canvas))

sheet(appear, 'src/assets/fx-shield-appear-sheet.webp'); sheet(loop, 'src/assets/fx-shield-loop-sheet.webp')
sheet(hit, 'src/assets/fx-shield-hit-sheet.webp'); sheet(brk, 'src/assets/fx-shield-break-sheet.webp')
print('frames', len(appear), len(loop), len(hit), len(brk))

if len(sys.argv) > 1 and sys.argv[1] == 'preview':
    card = Image.open('src/assets/card-cardeal-pedro-full.webp').convert('RGB')
    s_ = max(W / card.width, H / card.height); card = card.resize((int(card.width * s_) + 1, int(card.height * s_) + 1), Image.LANCZOS)
    card = card.crop(((card.width - W) // 2, (card.height - H) // 2, (card.width - W) // 2 + W, (card.height - H) // 2 + H))
    mk = Image.new('L', (W * 4, H * 4), 0); ImageDraw.Draw(mk).rounded_rectangle([0, 0, W * 4 - 1, H * 4 - 1], radius=88, fill=255)
    card = card.convert('RGBA'); card.putalpha(mk.resize((W, H), Image.LANCZOS))
    board = Image.open('src/assets/board-battlefield.webp').convert('RGB').resize((1000, 1250)).crop((300, 500, 300 + FW + 40, 500 + FH + 40))
    seq = [(f, 0) for f in appear] + [(loop[k % 24], 0) for k in range(24)] + [(f, 1) for f in hit] + [(loop[(k + 8) % 24], 0) for k in range(20)] + [(f, 2) for f in brk] + [(None, 2)] * 8
    out = []
    for n, (fx, mode) in enumerate(seq):
        bg = board.copy().convert('RGBA'); dim = Image.new('RGBA', bg.size, (0, 0, 0, 80)); bg = Image.alpha_composite(bg, dim)
        shake = 0
        if mode == 1: shake = int(3 * math.sin(n * 3) * max(0, 1 - ((n - 34) / 10)))
        if not (mode == 2 and fx is not None and False):
            bg.alpha_composite(card, (20 + PAD + shake, 20 + PAD))
        if fx is not None: bg.alpha_composite(fx, (20, 20))
        out.append(bg.convert('RGB').quantize(128))
    out[0].save('/tmp/claude-0/shield_demo.gif', save_all=True, append_images=out[1:], duration=50, loop=0, optimize=True)
    print('gif', len(out))
