"""Physical-hit effect as a transparent overlay sprite sheet (plays over any card).
   python3 tools/vfx/punch_overlay.py   ->  src/assets/fx-punch-sheet.webp
Frame = the card (232x288 at the centre) plus padding for sparks/dust; the game positions it over the hit card.
The card's own shove / squash / tremor is done live by CardSlot, so none of that is painted here."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter

W, H = 464, 576                  # card area in the working resolution (the frame is rendered at 2x, then halved)
PAD = 100; CW, CH = W + 2 * PAD, H + 2 * PAD; SS = 2
rad = 26
rs = np.random.default_rng(33)
IX, IY = W * 0.50, H * 0.40
smooth = lambda a, b, x: (lambda t: t * t * (3 - 2 * t))(np.clip((x - a) / (b - a + 1e-9), 0, 1))

m = Image.new('L', (W * 4, H * 4), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, W * 4 - 1, H * 4 - 1], radius=rad * 4, fill=255)
card_mask = m.resize((W, H), Image.LANCZOS)
card_mask_full = Image.new('L', (CW, CH), 0); card_mask_full.paste(card_mask, (PAD, PAD))
card_mask_arr = np.asarray(card_mask_full, float) / 255

def fbm(h, w, base=6, octaves=5):
    out = np.zeros((h, w)); amp = 1; tot = 0
    for o in range(octaves):
        f = gaussian_filter(rs.random((h, w)), h / (base * 2 ** o), mode='wrap'); f = (f - f.min()) / (f.max() - f.min()); out += f * amp; tot += amp; amp *= .55
    return out / tot
DUSTN = fbm(CH, CW)

def make_cracks():
    segs = []
    def walk(x, y, ang, n, w0, depth):
        px, py = x, y
        for i in range(int(n)):
            ang += rs.normal(0, 0.09) + (rs.choice([-1, 1]) * rs.uniform(0.4, 0.85) if rs.random() < 0.25 else 0)
            step = rs.uniform(9, 17); nx, ny = px + np.cos(ang) * step, py + np.sin(ang) * step
            segs.append(((px, py), (nx, ny), max(1.2, w0 * (1 - i / max(n, 1)) ** 0.8), i / max(n, 1), depth))
            px, py = nx, ny
            if depth < 2 and rs.random() < 0.13: walk(px, py, ang + rs.choice([-1, 1]) * rs.uniform(0.45, 0.95), n * 0.5 - i * 0.25, w0 * 0.55, depth + 1)
    for i in range(9): walk(IX, IY, i / 9 * 2 * np.pi + rs.normal(0, 0.2), rs.uniform(8, 15), 6.5, 0)
    return segs
cracks = make_cracks()

deb = [dict(a=rs.uniform(0, 6.28), v=rs.uniform(120, 340), s=rs.uniform(5, 15), rot=rs.uniform(0, 6.28), spin=rs.uniform(-9, 9), c=int(rs.integers(0, 4))) for _ in range(30)]
deb_col = [((250, 214, 120), (150, 100, 40)), ((196, 140, 60), (96, 60, 26)), ((255, 240, 190), (190, 150, 90)), ((120, 84, 44), (60, 40, 20))]
spikes = [(i / 20 * 2 * np.pi, rs.uniform(0.6, 1.0) if i % 2 == 0 else rs.uniform(0.26, 0.4)) for i in range(20)]
speed_lines = [(i / 34 * 2 * np.pi + rs.normal(0, 0.05), rs.uniform(0, 25), rs.uniform(50, 140)) for i in range(34)]

def layer_from_alpha(color, alpha):
    a = np.clip(alpha, 0, 1)
    return Image.fromarray(np.dstack([np.full(a.shape + (1,), 1) * np.array(color)[None, None, :], a[..., None] * 255]).astype(np.uint8), 'RGBA')

KS = [3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]    # frames from the blow on; the first two are the held peak (hit-stop)
frames = []
Y, X = np.mgrid[0:CH, 0:CW].astype(float)
ix, iy = PAD + IX, PAD + IY
for f, k in enumerate(KS):
    hold = (f == 1)
    out = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
    # white flash and bruise over the card
    flash = np.exp(-((k - 3) / 0.6) ** 2) * (0.5 if hold else 0.38)
    near = np.exp(-(np.hypot(X - ix, Y - iy) / 150) ** 2)
    bruise = smooth(3, 4, k) * (1 - smooth(5, 12, k)) * 0.42 * (0.3 + 0.7 * near)
    out.alpha_composite(layer_from_alpha((255, 40, 28), bruise * card_mask_arr))
    out.alpha_composite(layer_from_alpha((255, 255, 255), flash * card_mask_arr))
    # cracks: glowing first, then dark with a light lip
    grow = smooth(3, 6, k); keep = 1 - smooth(11.5, 15.5, k)
    cl = Image.new('L', (CW * SS, CH * SS), 0); cd = ImageDraw.Draw(cl); lip = Image.new('L', (CW * SS, CH * SS), 0); ld = ImageDraw.Draw(lip)
    for (p0, p1, wd, pos, dep) in cracks:
        if pos > grow + 0.02 - dep * 0.02: continue
        cd.line([(p0[0] + PAD) * SS, (p0[1] + PAD) * SS, (p1[0] + PAD) * SS, (p1[1] + PAD) * SS], fill=255, width=max(2, int(wd * SS * 0.8)))
        ld.line([(p0[0] + PAD + 1.6) * SS, (p0[1] + PAD + 1.8) * SS, (p1[0] + PAD + 1.6) * SS, (p1[1] + PAD + 1.8) * SS], fill=255, width=max(1, int(wd * SS * 0.35)))
    c = np.asarray(cl.resize((CW, CH), Image.LANCZOS), float) / 255 * keep * card_mask_arr
    lp = np.asarray(lip.resize((CW, CH), Image.LANCZOS), float) / 255 * keep * card_mask_arr
    e = smooth(3, 4, k) * (1 - smooth(4.5, 8.5, k))
    out.alpha_composite(layer_from_alpha((255, 120, 20), gaussian_filter(c, 5) * e * 0.9 * card_mask_arr))
    out.alpha_composite(layer_from_alpha((14, 8, 4), c * (1 - e) * 0.94))
    out.alpha_composite(layer_from_alpha((255, 240, 205), lp * (1 - c) * (1 - e) * 0.34))
    out.alpha_composite(layer_from_alpha((255, 225, 150), c * e))
    # dust
    tt = (k - 3) / 12
    dl = np.zeros((CH, CW))
    for i in range(18):
        a = i / 18 * 2 * np.pi + 0.3 * np.sin(i * 7.3); v = 70 + 130 * ((i * 37) % 10) / 10
        cx_ = ix + np.cos(a) * v * tt * 1.7; cy_ = iy + np.sin(a) * v * tt * 1.35 - 26 * tt
        rr = (36 + 22 * ((i * 53) % 7) / 7) * (0.55 + 1.6 * tt)
        dl += np.exp(-(((X - cx_) ** 2 + (Y - cy_) ** 2) / (2 * (rr * 0.5) ** 2)))
    dl = np.clip(dl, 0, 1) * smooth(0.15, 0.55, np.roll(DUSTN, int(k * 17), axis=1)) * (1 - smooth(0.2, 1.0, tt)) * smooth(0, 0.07, tt) * 1.5
    out.alpha_composite(layer_from_alpha((214, 192, 156), np.clip(dl, 0, 0.9)))
    # impact star + speed lines
    if k <= 6:
        u = (k - 3) / 3 + (-0.05 if hold else 0.0)
        sz = 52 + 92 * (1 - (1 - min(1, max(0, u) * 1.7)) ** 2)
        for scale, col, blur, amt in ((1.4, (255, 110, 15), 6, 0.85), (1.0, (255, 214, 70), 1.2, 1.0), (0.6, (255, 255, 236), 1.0, 1.0)):
            st = Image.new('L', (CW * SS, CH * SS), 0); sd = ImageDraw.Draw(st)
            pts = [((ix + np.cos(a + 0.2 * u) * sz * rr * scale * 1.6) * SS, (iy + np.sin(a + 0.2 * u) * sz * rr * scale * 1.6) * SS) for a, rr in spikes]
            sd.polygon(pts, fill=255)
            L = np.asarray(st.resize((CW, CH), Image.LANCZOS).filter(ImageFilter.GaussianBlur(blur)), float) / 255
            out.alpha_composite(layer_from_alpha(col, L * (1 - smooth(0.55, 1.0, u)) * amt))
        ln = Image.new('L', (CW * SS, CH * SS), 0); ld2 = ImageDraw.Draw(ln)
        for a, r1_, ln_ in speed_lines:
            r1 = sz * 1.15 + r1_ + 20 * u; r2 = r1 + ln_
            ld2.line([(ix + np.cos(a) * r1) * SS, (iy + np.sin(a) * r1) * SS, (ix + np.cos(a) * r2) * SS, (iy + np.sin(a) * r2) * SS], fill=255, width=int(2.4 * SS))
        out.alpha_composite(layer_from_alpha((255, 246, 224), np.asarray(ln.resize((CW, CH), Image.LANCZOS), float) / 255 * 0.95 * (1 - smooth(0.15, 1.0, u))))
    # debris
    dbl = Image.new('RGBA', (CW * SS, CH * SS), (0, 0, 0, 0)); dd = ImageDraw.Draw(dbl)
    for d_ in deb:
        dist = d_['v'] * (1 - (1 - min(1, tt * 1.15)) ** 2)
        x0, y0 = ix + np.cos(d_['a']) * dist, iy + np.sin(d_['a']) * dist + 240 * tt * tt
        s_ = d_['s'] * (1 - 0.35 * tt); a = d_['rot'] + tt * d_['spin']; al = int(255 * (1 - smooth(0.55, 1.0, tt)))
        quad = [((x0 + np.cos(a + q) * s_ * (1.0 if j % 2 == 0 else 0.6)) * SS, (y0 + np.sin(a + q) * s_ * 0.85 * (1.0 if j % 2 == 0 else 0.6)) * SS) for j, q in enumerate((0, 1.7, 3.3, 4.6))]
        light, dark = deb_col[d_['c']]
        dd.polygon(quad, fill=light + (al,)); dd.polygon([quad[0], quad[1], quad[2]], fill=dark + (al,))
    out.alpha_composite(dbl.resize((CW, CH), Image.LANCZOS))
    # shock ring
    if k <= 9:
        t6 = (k - 3) / 6; d = np.hypot(X - ix, Y - iy); rr = 20 + 200 * (1 - (1 - t6) ** 2)
        out.alpha_composite(layer_from_alpha((255, 236, 204), np.exp(-((d - rr) / (6 * (1 + t6))) ** 2) * (1 - smooth(0.2, 1.0, t6)) * 0.85))
    frames.append(out.resize((CW // 2, CH // 2), Image.LANCZOS))

COLS = 5; ROWS = (len(frames) + COLS - 1) // COLS
fw, fh = frames[0].size
sheet = Image.new('RGBA', (fw * COLS, fh * ROWS), (0, 0, 0, 0))
for i, fr in enumerate(frames): sheet.paste(fr, ((i % COLS) * fw, (i // COLS) * fh))
sheet.save('../../src/assets/fx-punch-sheet.webp', quality=88, method=6)
print(len(frames), 'frames', fw, 'x', fh, 'sheet', sheet.size, 'cols', COLS, 'rows', ROWS, 'frame/card ratios', CW / W, CH / H, PAD / W, PAD / H)
