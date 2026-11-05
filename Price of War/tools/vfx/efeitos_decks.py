"""Efeitos das cartas únicas do Capitão e dos Mercenários (mockup em public/mockups/efeitos-decks/), tudo desenhado aqui com numpy/PIL:
   fx-coin.webp       moeda de ouro girando, 16 quadros de 96 px em 8 colunas (normal; laço perfeito)
   fx-seal.webp       selo de cera vermelho: a gota cai, é prensada e estoura em respingos; 20 quadros de 256 px em 5 colunas (normal)
   fx-contrato.webp   contrato que se rasga ao meio e as metades caem; 20 quadros de 256 px em 5 colunas (normal)
   fx-stars.webp      estrelas de tontura em órbita, 16 quadros de 128 px em 8 colunas (aditivo ou normal; laço)
   fx-pantano.webp    névoa verde do Pântano com bolhas, 24 quadros de 256x128 px em 4 colunas (laço perfeito)
   fx-cracks.webp     rachaduras no chão com brilho de brasa, 16 quadros de 256 px em 4 colunas (normal)
   fx-gold.webp       verniz de ouro que passa por uma carta "travada", 20 quadros de 256x384 em 5 colunas (aditivo)
   proj-dagger.webp / proj-purse.webp / proj-ball.webp   o punhal (ponta para baixo), a bolsa de moedas e a bala de ferro (128 px)
   python3 tools/vfx/efeitos_decks.py   (escreve em public/mockups/efeitos-decks/)"""
import math
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter

OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'mockups', 'efeitos-decks')
os.makedirs(OUT, exist_ok=True)
rs = np.random.default_rng(7)
smooth = lambda a, b, x: (lambda t: t * t * (3 - 2 * t))(np.clip((x - a) / (b - a + 1e-9), 0, 1))


def save_sheet(frames, cols, name, quality=90):
    rows = -(-len(frames) // cols)
    w, h = frames[0].size
    img = Image.new('RGBA', (cols * w, rows * h), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        img.paste(f, ((i % cols) * w, (i // cols) * h))
    img.save(os.path.join(OUT, name), quality=quality, method=6)
    print(name, img.size, os.path.getsize(os.path.join(OUT, name)) // 1024, 'KB')


def fbm2(h, w, base=5, octaves=5, seed=0, mode='wrap'):
    r = np.random.default_rng(seed)
    out = np.zeros((h, w)); amp = 1; tot = 0
    for o in range(octaves):
        f = gaussian_filter(r.random((h, w)), max(1, min(h, w) / (base * 2 ** o)), mode=mode); f = (f - f.min()) / (f.max() - f.min() + 1e-9)
        out += f * amp; tot += amp; amp *= .55
    return out / tot


def fbm3(d, h, w, base=4, octaves=4, seed=0):
    """ruído que muda devagar no tempo (eixo 0) e fecha o laço no tempo, em x e em y"""
    r = np.random.default_rng(seed)
    out = np.zeros((d, h, w)); amp = 1; tot = 0
    for o in range(octaves):
        v = r.random((d, h, w))
        f = gaussian_filter(v, (d / (2.2 + o * .6), h / (base * 2 ** o), w / (base * 2 ** o)), mode='wrap')
        f = (f - f.min()) / (f.max() - f.min() + 1e-9)
        out += f * amp; tot += amp; amp *= .55
    return out / tot


def rgba(arr):
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), 'RGBA')


def lerp_ramp(v, stops):
    v = np.clip(v, 0, 1); out = np.zeros(v.shape + (3,))
    for (a, ca), (b, cb) in zip(stops[:-1], stops[1:]):
        m = (v >= a) & (v <= b); t = ((v - a) / (b - a))[m][:, None]
        out[m] = np.array(ca) * (1 - t) + np.array(cb) * t
    return out


SS = 4   # supersampling dos desenhos de vetor


# ── moeda ─────────────────────────────────────────────────────────────────────────────────────────────────────────
def coin_face(S, reverse=False):
    """a face da moeda de frente, S x S (sem achatar). Anverso: espada curta cravada; reverso: coroa de louros e um C."""
    yy, xx = np.mgrid[0:S, 0:S].astype(float); cx = cy = (S - 1) / 2
    r = np.hypot(xx - cx, yy - cy) / (S / 2)
    ang = np.arctan2(yy - cy, xx - cx)
    # ouro: brilho vindo de cima à esquerda
    lx, ly = (xx - cx) / (S / 2), (yy - cy) / (S / 2)
    shade = np.clip(.62 - .38 * (lx * .6 + ly * .8) + .18 * (1 - r), 0, 1)
    base = lerp_ramp(shade, [(0, (96, 58, 8)), (.35, (176, 118, 24)), (.65, (232, 176, 52)), (1, (255, 236, 150))])
    rim = smooth(.86, .9, r) * (1 - smooth(.96, 1.0, r))       # aro em relevo
    groove = np.exp(-((r - .8) / .022) ** 2)                    # sulco fino
    img = base * (1 + .22 * rim[..., None] - .38 * groove[..., None])
    img = np.where((r > .9)[..., None], img * (1 + .12 * np.cos(ang * 36)[..., None]), img)   # serrilha do aro
    mot = Image.new('L', (S * SS // SS, S), 0); d = ImageDraw.Draw(mot)
    s = S / 100
    if not reverse:
        d.polygon([(50 * s, 14 * s), (56 * s, 22 * s), (56 * s, 60 * s), (50 * s, 68 * s), (44 * s, 60 * s), (44 * s, 22 * s)], fill=255)   # lâmina
        d.rectangle((34 * s, 60 * s, 66 * s, 66 * s), fill=255)                                                                             # guarda
        d.rectangle((47 * s, 66 * s, 53 * s, 80 * s), fill=255); d.ellipse((44 * s, 78 * s, 56 * s, 88 * s), fill=255)                      # cabo
    else:
        for k in range(-5, 6):
            a0 = math.pi / 2 + k * .27; px, py = 50 * s + 31 * s * math.cos(a0), 50 * s + 31 * s * math.sin(a0)
            d.ellipse((px - 5 * s, py - 3.2 * s, px + 5 * s, py + 3.2 * s), fill=255)
        d.rectangle((38 * s, 40 * s, 62 * s, 46 * s), fill=255); d.rectangle((38 * s, 54 * s, 62 * s, 60 * s), fill=255); d.rectangle((38 * s, 40 * s, 44 * s, 60 * s), fill=255)
    m = np.asarray(mot.filter(ImageFilter.GaussianBlur(S / 160)), float) / 255
    hi = np.roll(m, (-max(1, S // 90), -max(1, S // 90)), (0, 1)); lo = np.roll(m, (max(1, S // 90), max(1, S // 90)), (0, 1))
    img = img * (1 - .45 * m[..., None]) + 255 * np.clip(m - lo, 0, 1)[..., None] * .35 - 0 * hi[..., None]
    alpha = (1 - smooth(.97, 1.0, r)) * 255
    return np.dstack([np.clip(img, 0, 255), alpha])


def make_coin():
    S, N, FS = 384, 16, 96
    front, back = coin_face(S), coin_face(S, True)
    frames = []
    for i in range(N):
        th = 2 * math.pi * i / N; c = math.cos(th); w = max(abs(c), .14)
        face = rgba(front if c >= 0 else back)
        fw = max(2, int(S * w)); sq = face.resize((fw, S), Image.LANCZOS)
        canvas = Image.new('RGBA', (S + 40, S + 40), (0, 0, 0, 0))
        # espessura: uma faixa escura atrás, que aparece mais quando a moeda está de lado
        thick = int(S * .075 * (1 - w) ** .8 + 3)
        edge = Image.new('RGBA', (fw, S), (0, 0, 0, 0)); ed = ImageDraw.Draw(edge)
        a = np.asarray(sq.getchannel('A')); edge_mask = Image.fromarray(a, 'L')
        edge_col = Image.new('RGBA', (fw, S), (150, 96, 18, 255)); edge.paste(edge_col, (0, 0), edge_mask)
        ox = (S + 40 - fw) // 2
        for t in range(thick, 0, -1):
            canvas.alpha_composite(edge, (ox + (t if c >= 0 else -t) , 20 + t // 2 + 0))
        canvas.alpha_composite(sq, (ox, 20))
        # brilho que corre pela face (some quando de lado)
        arr = np.asarray(canvas).astype(float)
        yy, xx = np.mgrid[0:arr.shape[0], 0:arr.shape[1]]
        pos = ((th / (2 * math.pi)) * 2.6 % 1) * 2.4 - .7
        band = np.exp(-((((xx - arr.shape[1] / 2) / S * .9 + (yy - arr.shape[0] / 2) / S * .9) - pos + .5 - .5) / .09) ** 2) * (w > .3) * .6
        arr[..., :3] = np.clip(arr[..., :3] + band[..., None] * 120 * (arr[..., 3:4] > 20), 0, 255)
        out = rgba(arr).resize((FS, FS), Image.LANCZOS)
        frames.append(out)
    save_sheet(frames, 8, 'fx-coin.webp')


# ── selo de cera ─────────────────────────────────────────────────────────────────────────────────────────────────
def make_seal():
    S, N = 256, 20
    yy, xx = np.mgrid[0:S, 0:S].astype(float); cx = cy = S / 2
    ang = np.arctan2(yy - cy, xx - cx); rr = np.hypot(xx - cx, yy - cy)
    wob = fbm2(1, 360, 14, 3, seed=3)[0]     # contorno irregular da cera
    wobv = np.interp((ang + math.pi) / (2 * math.pi) * 359, np.arange(360), wob)
    sig = Image.new('L', (S, S), 0); d = ImageDraw.Draw(sig)
    d.ellipse((cx - 58, cy - 58, cx + 58, cy + 58), outline=255, width=5)
    d.polygon([(cx, cy - 40), (cx + 7, cy - 30), (cx + 7, cy + 12), (cx, cy + 22), (cx - 7, cy + 12), (cx - 7, cy - 30)], fill=255)
    d.rectangle((cx - 24, cy + 10, cx + 24, cy + 17), fill=255); d.rectangle((cx - 4, cy + 17, cx + 4, cy + 38), fill=255)
    d.ellipse((cx - 33, cy - 33, cx + 33, cy + 33), outline=255, width=3)
    sigm = np.asarray(sig.filter(ImageFilter.GaussianBlur(1.2)), float) / 255
    frames = []
    ray_rng = np.random.default_rng(11); rays = [(ray_rng.uniform(0, 2 * math.pi), ray_rng.uniform(70, 118), ray_rng.uniform(1.5, 4)) for _ in range(26)]
    for i in range(N):
        t = i / (N - 1)
        spread = smooth(0, .3, t)                            # a gota se espalha
        press = smooth(.3, .42, t) * (1 - smooth(.5, .62, t) * .0)   # a prensa
        R = 20 + 70 * (smooth(0, .22, t) ** .7) + 5 * np.sin(smooth(.3, .45, t) * math.pi) * 1.0
        R *= (1 + .08 * (1 - spread))
        edge = R * (1 + .09 * (wobv - .5) * 2)
        inside = 1 - smooth(-1.5, 1.5, rr - edge)
        shade = np.clip(.55 + .32 * (-(xx - cx) * .55 - (yy - cy) * .8) / (edge + 1) + .25 * (1 - rr / (edge + 1)), 0, 1)
        col = lerp_ramp(shade, [(0, (60, 4, 6)), (.4, (140, 14, 16)), (.75, (206, 40, 34)), (1, (255, 120, 96))])
        ridge = np.exp(-((rr - edge * .88) / 3.2) ** 2) * press       # aro em relevo da prensa
        col = col * (1 + .25 * ridge[..., None])
        dep = smooth(.34, .5, t) * (1 - smooth(.93, 1, t) * .0)
        col = col * (1 - .55 * sigm[..., None] * dep) + 255 * np.roll(sigm, (-2, -2), (0, 1))[..., None] * 0
        hl = np.exp(-(((xx - cx + 24) ** 2 + (yy - cy + 28) ** 2) / (2 * 15 ** 2))) * inside * (1 - press * .4)
        col = np.clip(col + hl[..., None] * 150, 0, 255)
        alpha = inside * 255 * smooth(0, .05, t) * (1 - smooth(.86, 1, t))
        arr = np.dstack([col, alpha])
        img = rgba(arr)
        # respingos de tinta: raios finos que saem na hora da prensa
        ov = Image.new('RGBA', (S, S), (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
        q = smooth(.26, .5, t)
        for a, L, wd in rays:
            r0 = R * .9; r1 = r0 + (L - 70) * q + 30 * q
            if q > 0 and t < .8:
                fade = int(255 * (1 - smooth(.5, .8, t)))
                od.line((cx + math.cos(a) * r0, cy + math.sin(a) * r0, cx + math.cos(a) * r1, cy + math.sin(a) * r1), fill=(190, 24, 24, fade), width=max(1, int(wd * (1 - q * .5))))
                od.ellipse((cx + math.cos(a) * r1 - wd, cy + math.sin(a) * r1 - wd, cx + math.cos(a) * r1 + wd, cy + math.sin(a) * r1 + wd), fill=(170, 18, 18, fade))
        ov = ov.filter(ImageFilter.GaussianBlur(.6)); ov.alpha_composite(img); frames.append(ov)
    save_sheet(frames, 5, 'fx-seal.webp')


# ── contrato rasgado ─────────────────────────────────────────────────────────────────────────────────────────────
def make_contract():
    S, N = 256, 20
    PW, PH = 150, 196
    tex = fbm2(PH, PW, 5, 5, seed=5, mode='reflect')
    yy, xx = np.mgrid[0:PH, 0:PW].astype(float)
    paper = lerp_ramp(.45 + .35 * tex + .1 * np.sin(yy / 3.1), [(0, (166, 128, 74)), (.5, (222, 196, 140)), (1, (246, 232, 190))])
    edge = np.minimum.reduce([xx, PW - 1 - xx, yy, PH - 1 - yy])
    paper *= (.62 + .38 * smooth(0, 16, edge))[..., None]     # bordas escurecidas pelo tempo
    base = Image.fromarray(np.dstack([paper, np.full((PH, PW), 255.)]).astype(np.uint8), 'RGBA')
    d = ImageDraw.Draw(base)
    d.rectangle((12, 12, PW - 13, 34), outline=(96, 62, 24, 200), width=2); d.line((24, 23, PW - 25, 23), fill=(96, 62, 24, 190), width=3)
    for k in range(9):
        y = 48 + k * 11; d.line((16, y, PW - 18 - (k % 3) * 14, y), fill=(70, 46, 20, 165), width=2)
    d.line((22, PH - 30, 66, PH - 30), fill=(60, 40, 20, 210), width=2)
    # selo de cera no pé do contrato (do meio para a esquerda: o rasgo passa ao lado dele)
    seal = Image.new('RGBA', (60, 60), (0, 0, 0, 0)); sd = ImageDraw.Draw(seal)
    sd.ellipse((4, 4, 56, 56), fill=(150, 16, 18, 255)); sd.ellipse((10, 10, 50, 50), outline=(205, 52, 44, 255), width=2); sd.polygon([(30, 14), (34, 20), (34, 38), (30, 44), (26, 38), (26, 20)], fill=(100, 8, 10, 255)); sd.rectangle((20, 34, 40, 38), fill=(100, 8, 10, 255))
    base.alpha_composite(seal, (PW - 62, PH - 62))
    # linha do rasgo: caminho irregular de cima a baixo
    n = fbm2(1, PH, 8, 4, seed=9)[0]; path = 84 + (n - .5) * 30 + np.sin(np.arange(PH) / 5.0) * 3
    m_left = (xx < path[:, None]).astype(float); m_right = 1 - m_left
    fib = np.exp(-((xx - path[:, None]) / 2.3) ** 2)       # fibras claras na borda rasgada
    def half(mask):
        arr = np.asarray(base).astype(float).copy()
        arr[..., :3] = np.clip(arr[..., :3] + fib[..., None] * 60, 0, 255)
        arr[..., 3] = gaussian_filter(mask, .7) * (arr[..., 3] / 255) * 255
        return Image.fromarray(arr.astype(np.uint8), 'RGBA')
    L, Rr = half(m_left), half(m_right)
    K = .72                                                  # o papel é reduzido para sobrar espaço da queda no quadro
    eo = lambda u: 1 - (1 - u) ** 3
    frames = []
    for i in range(N):
        t = i / (N - 1); can = Image.new('RGBA', (S, S), (0, 0, 0, 0))
        pop = smooth(0, .1, t); sc = K * (.8 + .2 * pop)
        tear = smooth(.16, .4, t)                            # o rasgo desce, ainda com o papel inteiro
        sep = smooth(.4, 1, t)                               # depois as metades se afastam e caem
        fade = 1 - smooth(.78, 1, t)
        if sep <= 0:
            whole = Image.new('RGBA', (PW, PH), (0, 0, 0, 0)); whole.alpha_composite(L); whole.alpha_composite(Rr)
            d = ImageDraw.Draw(whole, 'RGBA'); cut = int(PH * tear)
            pts = [(float(path[y]), y) for y in range(0, max(2, cut))]
            if cut > 1:
                d.line(pts, fill=(52, 36, 18, 255), width=3); d.line(pts, fill=(250, 238, 200, 255), width=1)
            whole = whole.resize((int(PW * sc), int(PH * sc)), Image.LANCZOS)
            sh = 2 * math.sin(t * 60) * tear * (1 - tear) * 2                  # treme enquanto rasga
            can.alpha_composite(whole, (int(S / 2 - whole.width / 2 + sh), int(S / 2 - whole.height / 2)))
        else:
            for img, sgn in ((L, -1), (Rr, 1)):
                ang = sgn * 50 * sep ** 1.2; dx = sgn * (3 + 52 * eo(sep)); dy = 4 + 58 * sep ** 2
                rot = img.rotate(-ang, resample=Image.BICUBIC, expand=True, center=(PW * (.8 if sgn < 0 else .2), PH * .45))
                rot = rot.resize((int(rot.width * sc), int(rot.height * sc)), Image.LANCZOS)
                if fade < 1: rot.putalpha(rot.getchannel('A').point(lambda v: int(v * fade)))
                can.alpha_composite(rot, (int(S / 2 - rot.width / 2 + dx), int(S / 2 - rot.height / 2 + dy - 8)))
        # pó de papel no instante da separação
        pd = ImageDraw.Draw(can); rr = np.random.default_rng(100 + i)
        if .36 < t < .8:
            for _ in range(12):
                px = S / 2 + rr.normal(0, 10 + 50 * (t - .36)); py = S / 2 + rr.normal(0, 40 * smooth(.36, .6, t) + 8) + 10 * (t - .36) * 6
                pd.ellipse((px - 1.5, py - 1.5, px + 1.5, py + 1.5), fill=(238, 220, 170, int(210 * (1 - smooth(.5, .8, t)))))
        frames.append(can)
    save_sheet(frames, 5, 'fx-contrato.webp')


# ── estrelas de tontura ───────────────────────────────────────────────────────────────────────────────────────
def star_poly(cx, cy, R, rot=0, r=.45):
    pts = []
    for k in range(10):
        a = rot + k * math.pi / 5 - math.pi / 2; rad = R if k % 2 == 0 else R * r
        pts.append((cx + math.cos(a) * rad, cy + math.sin(a) * rad))
    return pts


def make_stars():
    S, N, K = 128, 16, 5
    frames = []
    for i in range(N):
        im = Image.new('RGBA', (S * SS, S * SS), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        items = []
        for k in range(K):
            ph = 2 * math.pi * (i / N + k / K)
            x = S / 2 + 42 * math.cos(ph); y = S / 2 + 11 * math.sin(ph); depth = math.sin(ph)       # depth>0: na frente
            items.append((depth, x, y, k))
        for depth, x, y, k in sorted(items):
            R = 11 + 4 * depth; rot = (i / N) * math.pi * 2 / 5 * 2 + k
            for g, (Rg, a) in enumerate([(R * 1.7, 55), (R * 1.25, 110)]):
                d.polygon([(px * SS, py * SS) for px, py in star_poly(x, y, Rg, rot, .5)], fill=(255, 214, 90, a))
            d.polygon([(px * SS, py * SS) for px, py in star_poly(x, y, R, rot)], fill=(255, 236, 140, 255), outline=(255, 252, 220, 255))
            d.polygon([(px * SS, py * SS) for px, py in star_poly(x, y, R * .42, rot, .6)], fill=(255, 255, 240, 255))
        frames.append(im.resize((S, S), Image.LANCZOS).filter(ImageFilter.GaussianBlur(.4)))
    save_sheet(frames, 8, 'fx-stars.webp')


# ── névoa do pântano ─────────────────────────────────────────────────────────────────────────────────────────
def make_swamp():
    W, H, N = 256, 128, 24
    n1 = fbm3(N, H, W, 3, 4, 1); n2 = fbm3(N, H, W, 6, 3, 2)
    # a névoa também anda de lado: desloca o ruído com np.roll (o laço fecha porque o deslocamento total dá uma volta)
    frames = []
    br = np.random.default_rng(31); bubbles = [(br.uniform(0, W), br.uniform(20, H), br.uniform(4, 9), br.uniform(0, 1)) for _ in range(14)]
    for i in range(N):
        sh = int(W * i / N)
        a = np.roll(n1[i], sh, 1); b = np.roll(n2[(i * 2) % N], -sh * 2 % W, 1)
        c3 = np.roll(n2[(i * 3 + 5) % N], int(W * .37) + sh, 1)
        dens = np.clip(.5 * a + .32 * b + .18 * c3, 0, 1)
        dens = smooth(.3, .62, dens) ** .8
        yy = np.linspace(0, 1, H)[:, None]
        dens *= np.sin(np.clip(yy, 0, 1) * math.pi) ** .7
        tone = np.clip(a * .6 + b * .4, 0, 1)
        col = lerp_ramp(tone, [(0, (10, 26, 18)), (.4, (30, 62, 30)), (.7, (74, 110, 38)), (1, (150, 176, 70))])
        arr = np.dstack([col, dens * 215])
        im = rgba(arr)
        d = ImageDraw.Draw(im, 'RGBA')
        for bx, by0, rad, ph in bubbles:
            u = (i / N + ph) % 1; by = by0 - 38 * u;
            if u < .86:
                r = rad * (.55 + .6 * u); al = int(170 * smooth(0, .15, u))
                d.ellipse((bx - r, by - r, bx + r, by + r), outline=(190, 230, 120, al), width=1, fill=(120, 170, 60, al // 4))
                d.ellipse((bx - r * .45, by - r * .5, bx - r * .1, by - r * .15), fill=(240, 255, 200, al))
            elif u < .95:
                q = (u - .86) / .09; r = rad * 1.15 * (1 + q * .9)
                d.ellipse((bx - r, by - r, bx + r, by + r), outline=(200, 240, 130, int(190 * (1 - q))), width=1)
        frames.append(im)
    save_sheet(frames, 4, 'fx-pantano.webp')


# ── rachaduras ──────────────────────────────────────────────────────────────────────────────────────────────
def make_cracks():
    S, N = 256, 16
    rng = np.random.default_rng(17)
    segs = []   # (profundidade, x0, y0, x1, y1, largura)
    def branch(x, y, a, L, depth, w, t0=0.0, dur=.5):
        pts = [(x, y)]
        for _ in range(int(L / 9)):
            a += rng.normal(0, .32); x += math.cos(a) * 9; y += math.sin(a) * 9 * .7; pts.append((x, y))
        segs.append((depth, pts, w, t0, dur))
        if depth < 3:
            for _ in range(2 if depth == 0 else 1):
                j = int(rng.integers(len(pts) // 3, len(pts)))
                branch(*pts[j], a + rng.choice([-1, 1]) * rng.uniform(.5, 1.0), L * .55, depth + 1, w * .65, t0 + dur * j / len(pts), dur * .7)
    for k in range(7): branch(S / 2, S / 2, 2 * math.pi * k / 7 + rng.uniform(-.2, .2), rng.uniform(90, 118), 0, 3.4)
    frames = []
    for i in range(N):
        t = i / (N - 1); grow = smooth(0, .62, t); glow = (1 - smooth(.4, 1, t)) * .9 + .1; fade = 1 - smooth(.78, 1, t)
        glow_im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); gd = ImageDraw.Draw(glow_im); core = Image.new('RGBA', (S, S), (0, 0, 0, 0)); cd = ImageDraw.Draw(core)
        for depth, pts, w, t0, dur in segs:
            gb = float(np.clip((grow - t0) / dur, 0, 1))
            if gb <= 0: continue
            n = max(2, int(len(pts) * gb)); P = pts[:n]
            if len(P) > 1:
                gd.line(P, fill=(255, 120, 30, int(255 * glow)), width=int(w * 3.4))
                cd.line(P, fill=(18, 10, 6, 255), width=max(1, int(w)))
        glow_im = glow_im.filter(ImageFilter.GaussianBlur(3))
        glow_im.alpha_composite(core)
        a = np.asarray(glow_im).astype(float); a[..., 3] *= fade
        frames.append(rgba(a))
    save_sheet(frames, 4, 'fx-cracks.webp')


# ── verniz de ouro (carta travada pelo suborno) ─────────────────────────────────────────────────────────────
def make_gold():
    W, H, N = 256, 384, 20
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    tex = fbm2(H, W, 8, 5, seed=4, mode='reflect')
    rim = np.minimum.reduce([xx, W - 1 - xx, yy, H - 1 - yy]); rimg = np.exp(-(rim / 9) ** 2)
    sp = np.random.default_rng(23); spk = [(sp.uniform(20, W - 20), sp.uniform(20, H - 20), sp.uniform(0, 1)) for _ in range(16)]
    frames = []
    for i in range(N):
        t = i / (N - 1); grow = smooth(0, .3, t); hold = 1 - smooth(.78, 1, t)
        d = (xx / W * .5 + yy / H * .86)
        band = np.exp(-(((d - (-.2 + 1.5 * ((t * 1.3) % 1))) / .09)) ** 2) * (1 - smooth(.7, 1, t))     # a faixa de brilho
        gold = lerp_ramp(.35 + .5 * tex, [(0, (150, 96, 14)), (.5, (222, 164, 44)), (1, (255, 230, 130))])
        alpha = (.2 * grow * (.55 + .45 * tex) + .55 * rimg * grow + .42 * band) * hold
        col = gold * (1 - band[..., None] * .25) + band[..., None] * np.array([255, 244, 200]) * .5
        im = rgba(np.dstack([np.clip(col, 0, 255), np.clip(alpha, 0, 1) * 255]))
        d2 = ImageDraw.Draw(im, 'RGBA')
        for sx, sy, ph in spk:
            u = (t * 1.6 + ph) % 1
            if u < .35 and grow > .4:
                q = math.sin(u / .35 * math.pi); L = 12 * q
                d2.line((sx - L, sy, sx + L, sy), fill=(255, 250, 220, int(230 * q * hold)), width=2); d2.line((sx, sy - L, sx, sy + L), fill=(255, 250, 220, int(230 * q * hold)), width=2)
        frames.append(im)
    save_sheet(frames, 5, 'fx-gold.webp')


# ── objetos: punhal, bolsa, bala ─────────────────────────────────────────────────────────────────────────────
def shade_poly(size, polys, light=(-.6, -.8)):
    pass


def make_props():
    S = 128; F = S * SS
    # punhal, ponta para baixo
    im = Image.new('RGBA', (F, F), (0, 0, 0, 0)); d = ImageDraw.Draw(im); s = F / 128
    d.polygon([(64 * s, 122 * s), (73 * s, 62 * s), (55 * s, 62 * s)], fill=(168, 176, 188, 255))                  # lâmina
    d.polygon([(64 * s, 122 * s), (73 * s, 62 * s), (64 * s, 62 * s)], fill=(214, 222, 232, 255))                    # lado claro
    d.line((64 * s, 118 * s, 64 * s, 66 * s), fill=(96, 104, 118, 255), width=int(2 * s))                          # fio central
    d.rounded_rectangle((36 * s, 52 * s, 92 * s, 62 * s), radius=int(4 * s), fill=(86, 70, 40, 255)); d.rounded_rectangle((36 * s, 52 * s, 92 * s, 56 * s), radius=int(2 * s), fill=(214, 168, 70, 255))   # guarda
    d.rounded_rectangle((58 * s, 20 * s, 70 * s, 52 * s), radius=int(3 * s), fill=(58, 30, 20, 255))               # cabo
    for k in range(5): d.line((58 * s, (26 + k * 6) * s, 70 * s, (28 + k * 6) * s), fill=(36, 18, 12, 255), width=int(1.5 * s))
    d.ellipse((55 * s, 8 * s, 73 * s, 24 * s), fill=(214, 168, 70, 255)); d.ellipse((58 * s, 11 * s, 66 * s, 17 * s), fill=(255, 226, 150, 255))
    im.resize((S, S), Image.LANCZOS).save(os.path.join(OUT, 'proj-dagger.webp'), quality=92, method=6)
    # bolsa de moedas
    im = Image.new('RGBA', (F, F), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.ellipse((20 * s, 44 * s, 108 * s, 120 * s), fill=(110, 66, 30, 255)); d.ellipse((26 * s, 48 * s, 90 * s, 104 * s), fill=(150, 94, 44, 255)); d.ellipse((34 * s, 54 * s, 66 * s, 80 * s), fill=(188, 128, 66, 255))
    d.polygon([(44 * s, 50 * s), (84 * s, 50 * s), (74 * s, 34 * s), (54 * s, 34 * s)], fill=(124, 76, 34, 255))           # gargalo franzido
    d.rounded_rectangle((44 * s, 44 * s, 84 * s, 52 * s), radius=int(4 * s), fill=(70, 40, 18, 255)); d.line((44 * s, 48 * s, 84 * s, 48 * s), fill=(214, 168, 70, 255), width=int(2 * s))   # cordão
    d.line((64 * s, 48 * s, 50 * s, 30 * s), fill=(70, 40, 18, 255), width=int(3 * s)); d.line((64 * s, 48 * s, 80 * s, 30 * s), fill=(70, 40, 18, 255), width=int(3 * s))
    for (cx, cy) in [(58, 36), (72, 38), (66, 30)]:
        d.ellipse(((cx - 7) * s, (cy - 4) * s, (cx + 7) * s, (cy + 4) * s), fill=(236, 184, 56, 255), outline=(150, 98, 18, 255))
    im.resize((S, S), Image.LANCZOS).save(os.path.join(OUT, 'proj-purse.webp'), quality=92, method=6)
    # bala de ferro: esfera iluminada de cima à esquerda, escura, com um brilho pequeno e seco
    yy, xx = np.mgrid[0:S, 0:S].astype(float); nx = (xx - 64) / 46; ny = (yy - 64) / 46; r2 = nx ** 2 + ny ** 2
    nz = np.sqrt(np.clip(1 - r2, 0, 1)); L = np.array([-.5, -.62, .6]); L /= np.linalg.norm(L)
    diff = np.clip(nx * L[0] + ny * L[1] + nz * L[2], 0, 1)
    refl = np.clip(2 * diff * nz - L[2], 0, 1)
    spec = refl ** 28
    base = lerp_ramp(.12 + .55 * diff + .08 * nz, [(0, (8, 9, 12)), (.5, (44, 48, 58)), (1, (110, 118, 134))])
    col = base + spec[..., None] * np.array([210, 220, 235])
    col *= (1 - .35 * smooth(.6, 1, np.sqrt(r2)))[..., None]
    a = (1 - smooth(.965, 1.0, np.sqrt(r2))) * 255
    Image.fromarray(np.dstack([np.clip(col, 0, 255), a]).astype(np.uint8), 'RGBA').save(os.path.join(OUT, 'proj-ball.webp'), quality=92, method=6)
    print('props ok')


if __name__ == '__main__':
    import sys
    only = set(sys.argv[1:])
    for name, fn in [('coin', make_coin), ('seal', make_seal), ('contract', make_contract), ('stars', make_stars), ('swamp', make_swamp), ('cracks', make_cracks), ('gold', make_gold), ('props', make_props)]:
        if not only or name in only: fn()
