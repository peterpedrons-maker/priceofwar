"""'This card has an effect you can use now': a looping aura drawn over ANY card, as one sprite sheet.
   src/assets/fx-ability-ready.webp   (card area plus padding per frame; screen-blend it over the card)
   python3 tools/vfx/ability_ready.py            -> sheet
   python3 tools/vfx/ability_ready.py preview    -> also a GIF on a real card (written next to the sheet, not in src)
Colour: the sheet is drawn in gold-white; the game tints it per effect (heal green, damage red, utility gold) with a
CSS hue-rotate, so one sheet serves every effect. Loop is seamless (every moving part is periodic in t)."""
import sys, math
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter

W, H = 232, 288                      # card area, same geometry as the punch / burn sheets
PAD = 50
FW, FH = W + 2 * PAD, H + 2 * PAD
NF, COLS = 24, 6                     # 24 frames at 15 fps = 1.6 s loop
R = 22                               # corner radius of the card
rs = np.random.default_rng(5)
yy, xx = np.mgrid[0:FH, 0:FW].astype(float)

def rounded_sdf():
    """signed distance (px) to the card outline: negative inside."""
    cx, cy = FW / 2, FH / 2
    qx = np.abs(xx - cx) - (W / 2 - R); qy = np.abs(yy - cy) - (H / 2 - R)
    return np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0) - R

sdf = rounded_sdf()
inside = (sdf < 0).astype(float)
rim = np.exp(-(sdf + 1.5) ** 2 / (2 * 1.1 ** 2))                 # thin bright line just inside the edge
inner = np.exp(-np.clip(-sdf, 0, None) / 13.0) * inside           # glow bleeding inwards
outer = np.exp(-np.clip(sdf, 0, None) / 11.0) * (sdf >= 0)        # bloom outside the edge
perim_angle = np.arctan2(yy - FH / 2, xx - FW / 2)

# rising motes: x, phase, speed, size
NM = 26
motes = [(rs.uniform(0.08, 0.92), rs.random(), rs.choice([1, 1, 2]), rs.uniform(1.1, 2.4)) for _ in range(NM)]

def star(cx, cy, size, a):
    """four-point glint"""
    d = np.zeros((FH, FW))
    dx, dy = np.abs(xx - cx), np.abs(yy - cy)
    d += np.exp(-(dy / 1.2) ** 2 - (dx / (size * 0.9)) ** 2 * 1.0) * 1.0
    d += np.exp(-(dx / 1.2) ** 2 - (dy / (size * 0.9)) ** 2 * 1.0) * 1.0
    d += np.exp(-(dx ** 2 + dy ** 2) / (2 * (size * 0.18) ** 2)) * 1.4
    return d * a

frames = []
for k in range(NF):
    t = k / NF
    pulse = 0.5 + 0.5 * math.sin(2 * math.pi * t - math.pi / 2)            # 0..1
    # 1) breathing rim + glow
    lum = rim * (0.75 + 0.25 * pulse) + inner * (0.20 + 0.28 * pulse) + outer * (0.35 + 0.35 * pulse)
    # a brighter comet that circles the edge once per loop
    ang = (perim_angle / (2 * math.pi) - t) % 1.0
    comet = np.exp(-np.minimum(ang, 1 - ang) ** 2 / (2 * 0.045 ** 2)) * np.exp(-np.abs(sdf + 1.5) ** 2 / (2 * 2.6 ** 2))
    lum = lum + comet * 1.15
    # 2) diagonal light sweep inside the card (once per loop, over the first 55 %)
    s = np.clip(t / 0.55, 0, 1)
    pos = -0.35 + 1.7 * s
    diag = (xx - (FW - W) / 2) / W * 0.62 + (yy - (FH - H) / 2) / H * 0.38
    sweep = np.exp(-((diag - pos) / 0.07) ** 2) * inside * (0.55 if t < 0.55 else 0)
    lum = lum + sweep * 0.55
    # 3) motes drifting up along the card, fading in and out
    mote = np.zeros((FH, FW))
    for mx, ph, sp, sz in motes:
        u = (t * sp + ph) % 1.0
        py = PAD + H * (1.02 - 1.18 * u)
        px = PAD + W * mx + 5 * math.sin(2 * math.pi * (u * 1.5 + ph))
        a = math.sin(math.pi * u) ** 1.4
        mote += np.exp(-((xx - px) ** 2 + (yy - py) ** 2) / (2 * (sz * 0.8) ** 2)) * a * 1.1
    # 4) corner glints, staggered
    gl = np.zeros((FH, FW))
    for ci, (cx, cy) in enumerate([(PAD + 8, PAD + 8), (PAD + W - 8, PAD + 8), (PAD + 8, PAD + H - 8), (PAD + W - 8, PAD + H - 8)]):
        a = max(0.0, math.sin(2 * math.pi * (t + ci * 0.25))) ** 6
        gl += star(cx, cy, 15, a)
    lum = lum + mote + gl
    lum = np.clip(lum, 0, 1.6)
    # gold-white ramp: low = deep amber, high = near white
    v = np.clip(lum / 1.35, 0, 1)
    colr = np.stack([np.interp(v, [0, .5, 1], [190, 255, 255]), np.interp(v, [0, .5, 1], [120, 214, 250]), np.interp(v, [0, .5, 1], [20, 100, 215])], axis=-1)
    alpha = np.clip(lum * 1.1, 0, 1)
    # keep the card's centre readable: the inside glow is already weak, cap alpha there
    alpha = np.where(sdf < -22, np.minimum(alpha, 0.30 + 0.25 * sweep), alpha)
    img = np.dstack([colr, alpha * 255]).astype(np.uint8)
    frames.append(Image.fromarray(img, 'RGBA'))

ROWS = math.ceil(NF / COLS)
sheet = Image.new('RGBA', (COLS * FW, ROWS * FH), (0, 0, 0, 0))
for i, f in enumerate(frames):
    sheet.paste(f, ((i % COLS) * FW, (i // COLS) * FH))
sheet.save('src/assets/fx-ability-ready.webp', quality=88, method=6)
print('sheet', sheet.size, 'frame', FW, FH, 'frames', NF, 'cols', COLS, 'rows', ROWS)

if len(sys.argv) > 1 and sys.argv[1] == 'preview':
    import colorsys
    def tint(im, hue_deg):
        a = np.asarray(im, float); r, g, b, al = [a[..., i] for i in range(4)]
        h = np.asarray(Image.fromarray(a[..., :3].astype(np.uint8)).convert('HSV'), float)
        h[..., 0] = (h[..., 0] + hue_deg / 360 * 255) % 255
        rgb = np.asarray(Image.fromarray(h.astype(np.uint8), 'HSV').convert('RGB'), float)
        return Image.fromarray(np.dstack([rgb, al]).astype(np.uint8), 'RGBA')
    def card_img(name):
        c = Image.open(f'src/assets/{name}.webp').convert('RGB')
        s = max(W / c.width, H / c.height); c = c.resize((int(c.width * s) + 1, int(c.height * s) + 1), Image.LANCZOS)
        c = c.crop(((c.width - W) // 2, (c.height - H) // 2, (c.width - W) // 2 + W, (c.height - H) // 2 + H))
        m = Image.new('L', (W * 4, H * 4), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, W * 4 - 1, H * 4 - 1], radius=R * 4, fill=255)
        out = c.convert('RGBA'); out.putalpha(m.resize((W, H), Image.LANCZOS)); return out
    board = Image.open('src/assets/board-battlefield.webp').convert('RGB')
    cards = [('card-cardeal-pedro-full', 130), ('card-cavaleiro-da-luz-full', 0), ('card-batedor', 0)]
    PW = 3 * FW + 40; PHH = FH + 40
    bg = board.resize((PW * 2, int(board.height * PW * 2 / board.width)))
    bg = bg.crop((0, 300, PW, 300 + PHH)).convert('RGBA')
    # dim it like the game does
    shade = Image.new('RGBA', bg.size, (0, 0, 0, 90)); bg = Image.alpha_composite(bg, shade)
    cs = [card_img(n) for n, _ in cards]
    gif = []
    for k in range(NF):
        fr = bg.copy()
        for ci, ((n, hue), card) in enumerate(zip(cards, cs)):
            ox = 20 + ci * FW
            base = Image.new('RGBA', (FW, FH), (0, 0, 0, 0)); base.paste(card, (PAD, PAD))
            fx = tint(frames[k], [100, 0, 0][ci] if ci else 90)
            # screen blend of the glow over the card
            layer = Image.new('RGBA', (FW, FH), (0, 0, 0, 0)); layer = Image.alpha_composite(layer, base)
            a = np.asarray(layer, float); f = np.asarray(fx, float); fa = f[..., 3:4] / 255
            rgb = 255 - (255 - a[..., :3]) * (255 - f[..., :3] * fa) / 255
            outa = np.maximum(a[..., 3:4], f[..., 3:4])
            comp = Image.fromarray(np.dstack([np.where(a[..., 3:4] > 0, rgb, f[..., :3]), outa]).astype(np.uint8), 'RGBA')
            fr.alpha_composite(comp, (ox, 20))
        gif.append(fr.convert('RGB').resize((PW * 2 // 2 * 1, PHH)))
    gif[0].save('/tmp/claude-0/ability_ready_preview.gif', save_all=True, append_images=gif[1:], duration=int(1000 / 15), loop=0)
    gif[NF // 2].save('/tmp/claude-0/ability_ready_still.png')
    print('preview written')
