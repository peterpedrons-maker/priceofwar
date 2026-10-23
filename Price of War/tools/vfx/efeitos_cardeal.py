"""Efeitos de ativação das cartas do Cardeal (mockup em public/mockups/efeitos-cardeal/), tudo desenhado com numpy/PIL:
   fx-pilar.webp       pilar de luz sagrada que desce, com raios, poeira de luz subindo e cruz no chão; 24 quadros de 192x384 em 6 colunas (aditivo)
   fx-sigilo.webp      sigilo sagrado dourado (anéis, marcas, cruzes giratórias); 24 quadros de 256 em 6 colunas (aditivo, aparece-gira-some)
   fx-sigilo-azul.webp o mesmo em branco-azulado (almas)
   fx-cruz.webp        cruz de luz que estoura num golpe sagrado, com anel e raios; 16 quadros de 256 em 4 colunas (aditivo)
   fx-escudo.webp      escudo heráldico dourado com cruz que se forma de poeira de luz e brilha; 20 quadros de 192x224 em 5 colunas (normal)
   fx-alma.webp        chama-alma branco-azulada com cauda espiralada; 16 quadros de 128x192 em 8 colunas (aditivo; laço)
   fx-penas.webp       penas brancas caindo com brilho; 24 quadros de 256x320 em 6 colunas (normal)
   fx-trompa.webp      ondas de uma trompa de guerra (anéis dourados com serrilha) que se expandem; 16 quadros de 256 em 4 colunas (aditivo)
   python3 tools/vfx/efeitos_cardeal.py [nome ...]   (escreve em public/mockups/efeitos-cardeal/)
Os quadros "aditivos" guardam a cor em RGB e a intensidade em alfa: desenhe com globalCompositeOperation = 'lighter'."""
import math
import os
import sys
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter

OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'mockups', 'efeitos-cardeal')
os.makedirs(OUT, exist_ok=True)
smooth = lambda a, b, x: (lambda t: t * t * (3 - 2 * t))(np.clip((x - a) / (b - a + 1e-9), 0, 1))
GOLD = [(0, (120, 60, 8)), (.35, (230, 150, 30)), (.7, (255, 214, 110)), (1, (255, 252, 235))]
HOLY = [(0, (90, 110, 200)), (.4, (170, 200, 255)), (.75, (225, 238, 255)), (1, (255, 255, 255))]


def save_sheet(frames, cols, name, quality=92):
    rows = -(-len(frames) // cols)
    w, h = frames[0].size
    img = Image.new('RGBA', (cols * w, rows * h), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        img.paste(f, ((i % cols) * w, (i // cols) * h))
    img.save(os.path.join(OUT, name), quality=quality, method=6)
    print(name, img.size, os.path.getsize(os.path.join(OUT, name)) // 1024, 'KB')


def ramp(v, stops):
    v = np.clip(v, 0, 1); out = np.zeros(v.shape + (3,))
    for (a, ca), (b, cb) in zip(stops[:-1], stops[1:]):
        m = (v >= a) & (v <= b); t = ((v - a) / (b - a))[m][:, None]
        out[m] = np.array(ca) * (1 - t) + np.array(cb) * t
    return out


def glow_rgba(I, stops, gain=1.0):
    """intensidade (0..~2) -> RGBA aditivo: a cor sobe do âmbar ao branco com a intensidade; o alfa é a própria intensidade."""
    I = np.clip(I * gain, 0, 1.6)
    col = ramp(I / 1.6, stops)
    a = np.clip(I, 0, 1)
    return Image.fromarray(np.dstack([np.clip(col, 0, 255), a * 255]).astype(np.uint8), 'RGBA')


def blur(a, s):
    return gaussian_filter(a, s, mode='constant')


def fbm(h, w, base=6, octaves=4, seed=0):
    r = np.random.default_rng(seed); out = np.zeros((h, w)); amp = 1; tot = 0
    for o in range(octaves):
        f = gaussian_filter(r.random((h, w)), max(1, min(h, w) / (base * 2 ** o)), mode='reflect'); f = (f - f.min()) / (f.max() - f.min() + 1e-9)
        out += f * amp; tot += amp; amp *= .55
    return out / tot


def line_mask(W, H, pts, width, ss=3):
    im = Image.new('L', (W * ss, H * ss), 0); d = ImageDraw.Draw(im)
    d.line([(x * ss, y * ss) for x, y in pts], fill=255, width=max(1, int(width * ss)), joint='curve')
    return np.asarray(im.resize((W, H), Image.LANCZOS), dtype=float) / 255


def poly_mask(W, H, pts, ss=3):
    im = Image.new('L', (W * ss, H * ss), 0); ImageDraw.Draw(im).polygon([(x * ss, y * ss) for x, y in pts], fill=255)
    return np.asarray(im.resize((W, H), Image.LANCZOS), dtype=float) / 255


# ── estrelas (brilho de 4 pontas) desenhadas em janela ─────────────────────────────────────────────────────────────
def add_star(I, px, py, r, a=1.0, diag=.45):
    """soma em I uma estrela de 4 pontas (mais duas diagonais finas) centrada em (px,py) com alcance r."""
    H, W = I.shape; R = int(r * 2.2) + 2
    x0, x1 = max(0, int(px) - R), min(W, int(px) + R + 1); y0, y1 = max(0, int(py) - R), min(H, int(py) + R + 1)
    if x0 >= x1 or y0 >= y1: return
    yy, xx = np.mgrid[y0:y1, x0:x1].astype(float); dx, dy = xx - px, yy - py
    w = max(.7, r * .07)
    st = np.exp(-(dy / w) ** 2) * np.exp(-(np.abs(dx) / (r * .9)) ** 1.6) + np.exp(-(dx / w) ** 2) * np.exp(-(np.abs(dy) / (r * .9)) ** 1.6)
    d1 = np.exp(-(((dx + dy) / 1.414) / (w * 1.1)) ** 2) * np.exp(-(np.abs(dx - dy) / (r * .5)) ** 1.8)
    d2 = np.exp(-(((dx - dy) / 1.414) / (w * 1.1)) ** 2) * np.exp(-(np.abs(dx + dy) / (r * .5)) ** 1.8)
    core = np.exp(-((dx ** 2 + dy ** 2) / (r * .22) ** 2))
    I[y0:y1, x0:x1] += (st + diag * (d1 + d2) + core * .9) * a


# ── pilar de luz ────────────────────────────────────────────────────────────────────────────────────────────────
def make_pilar():
    W, H, N = 224, 420, 32
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    cx = W / 2; base_y = H * .88; y0 = 6.0
    rng = np.random.default_rng(11)
    K = 11
    rays = [(rng.uniform(-.17, .17), rng.uniform(1.4, 4.2), rng.uniform(.35, 1.0), rng.uniform(0, 6.28), rng.uniform(.6, 1.6)) for _ in range(K)]
    streak = fbm(H, W, 16, 3, seed=5)
    heli = [(rng.uniform(0, 1), rng.uniform(.8, 1.4), rng.choice([-1, 1]), rng.uniform(5, 11), rng.uniform(2.2, 5.0)) for _ in range(22)]
    frames = []
    for i in range(N):
        t = i / (N - 1)
        grow = smooth(0, .2, t); life = smooth(0, .08, t) * (1 - smooth(.72, 1, t))
        front = base_y * smooth(0, .22, t)
        u = np.clip((yy - y0) / (base_y - y0), 0, 1)
        flick = 1 + .07 * math.sin(t * 40)
        I = np.zeros((H, W))
        # feixes em leque (volumétricos), cada um com largura que cresce com a distância da fonte
        for th, wk, bk, ph, fq in rays:
            xo = cx + (yy - y0) * math.tan(th)
            wid = wk + .055 * (yy - y0) * (.7 + .3 * math.sin(ph))
            amp = bk * (.65 + .35 * math.sin(t * 9 * fq + ph)) * (1 - .55 * u)
            I += np.exp(-((xx - xo) / wid) ** 2) * amp * .30
        # núcleo e halo
        half = (6 + 14 * u ** 1.3) * flick * (.6 + .4 * smooth(0, .3, t))
        dx = xx - cx
        I += np.exp(-(dx / half) ** 2) * (.95 - .25 * u) + np.exp(-(dx / (half * 2.6)) ** 2) * .38
        I *= (.8 + .2 * np.clip(np.sin(dx / 3 + streak * 5 + yy / 14 - t * 24), -1, 1) * np.exp(-(dx / (half * 3)) ** 2) + .2)
        I *= smooth(front + 16, front - 30, yy)
        I *= (1 - smooth(base_y + 6, base_y + 46, yy) * .9)
        # fonte no alto: clarão com cruz
        I += np.exp(-(((xx - cx) / 52) ** 2 + ((yy - y0) / 16) ** 2)) * .8 * grow
        I += np.exp(-((yy - y0) / 2.2) ** 2) * np.exp(-(np.abs(dx) / 80) ** 1.4) * .9 * grow
        # chão: poça de luz, raios radiais e dois anéis de onda
        if front > base_y - 34:
            k = smooth(.17, .3, t) * (1 - smooth(.66, 1, t)); ex = (xx - cx) / 78; ey = (yy - base_y) / 19; er = np.hypot(ex, ey)
            ang = np.arctan2(ey, ex)
            I += (np.exp(-er ** 2) * .95 + np.exp(-(er / .45) ** 2) * .8) * k
            I += (.5 + .5 * np.sin(ang * 22 + t * 6)) ** 4 * np.exp(-(er / 1.25) ** 2) * .42 * k
            for kk, dl in enumerate((0, .09)):
                tr = np.clip((t - .22 - dl) / .5, 0, 1)
                if 0 < tr < 1: I += np.exp(-((er - (.4 + 1.5 * tr)) / .1) ** 2) * (1 - tr) ** 1.4 * .85 * k * 1.6
            I += np.exp(-((yy - base_y) / 2.4) ** 2) * np.exp(-(np.abs(dx) / (50 + 30 * k)) ** 1.5) * 1.0 * k
        I *= life
        # estrelas em hélice subindo ao redor do feixe
        for ph, spd, sgn, A, r in heli:
            tt = (t * 1.15 * spd + ph) % 1
            py = base_y + 4 - tt * (base_y - 40)
            px = cx + sgn * A * (1 + 2.2 * tt) * math.sin(tt * 11 + ph * 9)
            al = math.sin(tt * math.pi) ** 1.1 * life * (1 if grow > .55 else 0)
            if al > .03: add_star(I, px, py, r * (.7 + .5 * math.sin(tt * math.pi)), al * 1.15)
        I += blur(I, 6) * .5 + blur(I, 16) * .25
        frames.append(glow_rgba(I, GOLD, 1.0))
    save_sheet(frames, 8, 'fx-pilar.webp')


# ── brilhos (partículas) ─────────────────────────────────────────────────────────────────────────────────────────
def make_brilhos():
    S, N = 64, 8
    yy, xx = np.mgrid[0:S, 0:S].astype(float); c = (S - 1) / 2
    rows = []
    for v in range(4):
        fr = []
        for i in range(N):
            t = i / (N - 1); sc = math.sin(t * math.pi) ** .8 + .06; I = np.zeros((S, S))
            if v == 0: add_star(I, c, c, 26 * sc, 1.0)
            elif v == 1: add_star(I, c, c, 22 * sc, 1.0, diag=1.0)
            elif v == 2:
                for k in range(6):
                    a0 = k * math.pi / 3 + t * .5; d = np.abs(((np.arctan2(yy - c, xx - c) - a0 + math.pi) % (2 * math.pi)) - math.pi)
                    I += np.exp(-(d * np.hypot(xx - c, yy - c) / 1.4) ** 2) * np.exp(-(np.hypot(xx - c, yy - c) / (22 * sc)) ** 1.5) * .8
                I += np.exp(-((xx - c) ** 2 + (yy - c) ** 2) / (4.5 * sc) ** 2)
            else:
                r = np.hypot(xx - c, yy - c); I += np.exp(-(r / (9 * sc + 1)) ** 2) * .9 + np.exp(-((r - 18 * sc) / 1.8) ** 2) * .5 * (1 - t)
            fr.append(glow_rgba(I, GOLD, 1.0))
        rows.append(fr)
    img = Image.new('RGBA', (S * N, S * 4), (0, 0, 0, 0))
    for v in range(4):
        for i in range(N): img.paste(rows[v][i], (i * S, v * S))
    img.save(os.path.join(OUT, 'fx-brilhos.webp'), quality=92, method=6); print('fx-brilhos.webp', img.size)


# ── coração sagrado (cura) ─────────────────────────────────────────────────────────────────────────────────────────
def make_coracao():
    S, N = 128, 20
    yy, xx = np.mgrid[0:S, 0:S].astype(float); c = (S - 1) / 2
    X0 = (xx - c) / (S * .285); Y0 = -(yy - c + 3) / (S * .285)
    frames = []
    for i in range(N):
        t = i / (N - 1)
        sc = 1 + .26 * math.exp(-((t - .17) / .09) ** 2) - .08 * smooth(.62, 1, t)
        X, Y = X0 / sc, Y0 / sc
        f = (X ** 2 + Y ** 2 - 1) ** 3 - X ** 2 * Y ** 3
        ins = 1 - smooth(-.015, .045, f)
        inner = 1 - smooth(-.075, -.035, f)                   # miolo vermelho; o resto é o aro dourado
        gx, gy = np.gradient(gaussian_filter(inner, 2.2)); lit = np.clip(.5 + (gx * .8 + gy * 1.0) * -9, 0, 1)
        body = ramp(.15 + .5 * lit + .35 * (1 - yy / S) + .1 * gaussian_filter(inner, 6), [(0, (96, 6, 26)), (.35, (196, 24, 46)), (.7, (244, 82, 74)), (1, (255, 178, 150))])
        rim_l = np.clip(gaussian_filter(ins, 1.2) - gaussian_filter(ins, 3.5) * .95, 0, 1)
        gx2, gy2 = np.gradient(gaussian_filter(ins, 1.8)); lit2 = np.clip(.5 + (gx2 * .8 + gy2 * 1.0) * -14, 0, 1)
        rim = ramp(.3 + .7 * lit2, [(0, (120, 72, 10)), (.5, (232, 170, 50)), (1, (255, 246, 190))])
        rim_w = np.clip(ins - inner, 0, 1)
        rgb = body * inner[..., None] + rim * rim_w[..., None]
        # brilho especular no lóbulo esquerdo e faixa que varre
        gl = np.exp(-(((xx - (c - 20)) / 9) ** 2 + ((yy - (c - 22)) / 5) ** 2)) * inner * .9
        band = np.exp(-((((xx / S) * .6 + (yy / S) * .8) - (-.2 + 1.5 * smooth(.14, .7, t))) / .05) ** 2) * ins * .7
        rgb = rgb + (gl + band)[..., None] * 255 * .55
        glow = blur(ins, 8) * (.6 * smooth(0, .2, t) * (1 - smooth(.55, 1, t)) + .6 * math.exp(-((t - .17) / .07) ** 2))
        a = ins
        tot = np.clip(a + glow * (1 - a), 0, 1)
        rgbf = (rgb * a[..., None] + np.array([255, 190, 120]) * (glow * (1 - a))[..., None]) / np.clip(tot, 1e-4, 1)[..., None]
        a_out = tot * (1 - smooth(.8, 1, t)) * smooth(0, .07, t)
        I = np.zeros((S, S))
        if .1 < t < .8: add_star(I, c + 11, c - 14, 15 * math.sin((t - .1) / .7 * math.pi), .95)
        arr = np.dstack([np.clip(rgbf, 0, 255), a_out * 255]).astype(float)
        st = np.asarray(glow_rgba(I, GOLD, 1.0)).astype(float)
        arr[..., :3] = np.clip(arr[..., :3] + st[..., :3] * st[..., 3:4] / 255, 0, 255); arr[..., 3] = np.maximum(arr[..., 3], st[..., 3])
        frames.append(Image.fromarray(arr.astype(np.uint8), 'RGBA'))
    save_sheet(frames, 5, 'fx-coracao.webp')


# ── cometa sagrado (cabeça em cruz estrelada à direita, cauda para a esquerda) ─────────────────────────────────
def make_cometa():
    W, H, N = 320, 96, 8
    yy, xx = np.mgrid[0:H, 0:W].astype(float); hx, hy = 262.0, H / 2
    noise = fbm(H, W, 10, 3, seed=9)
    frames = []
    for i in range(N):
        t = i / N; I = np.zeros((H, W))
        dx = hx - xx
        taper = np.exp(-np.clip(dx, 0, None) / 120) * (dx >= 0) * smooth(0, 14, xx)
        wid = 3 + 9 * np.exp(-np.clip(dx, 0, None) / 90)
        wob = (noise - .5) * 14 * (1 - np.exp(-np.clip(dx, 0, None) / 80))
        I += np.exp(-((yy - hy - wob * .4) / wid) ** 2) * taper * 1.1
        I += np.exp(-((yy - hy) / (wid * .45)) ** 2) * taper * .9
        # fagulhas na cauda
        rr = np.random.default_rng(100 + i)
        for k in range(18):
            px = hx - rr.uniform(10, 230) ** 1.0; py = hy + rr.normal(0, 8) * (1 + (hx - px) / 120)
            add_star(I, px, py, rr.uniform(2.5, 6), .75 * math.exp(-(hx - px) / 170))
        # cabeça: cruz estrelada
        add_star(I, hx, hy, 34, 1.4, diag=.8)
        I += np.exp(-(((xx - hx) / 14) ** 2 + ((yy - hy) / 14) ** 2)) * 1.1
        I += blur(I, 4) * .7
        frames.append(glow_rgba(I, GOLD, 1.0))
    save_sheet(frames, 2, 'fx-cometa.webp')


# ── sigilo sagrado (rosácea gótica, runas e cruzes) ──────────────────────────────────────────────────────────────
def make_sigilo(stops, name):
    from scipy.ndimage import rotate as ndrot
    S, N = 256, 28
    yy, xx = np.mgrid[0:S, 0:S].astype(float); c = (S - 1) / 2
    r = np.hypot(xx - c, yy - c) / (S / 2); ang = np.arctan2(yy - c, xx - c)
    rng = np.random.default_rng(3)
    # camada de runas (traços curtos radiais/angulares) no anel .66–.82
    runes = np.zeros((S, S))
    for k in range(40):
        a0 = k * 2 * math.pi / 40; rr0 = rng.uniform(.68, .78); typ = rng.integers(0, 4)
        px, py = c + math.cos(a0) * rr0 * S / 2, c + math.sin(a0) * rr0 * S / 2
        ux, uy = math.cos(a0), math.sin(a0); vx, vy = -uy, ux
        if typ == 0: pts = [(px - ux * 5, py - uy * 5), (px + ux * 5, py + uy * 5)]
        elif typ == 1: pts = [(px - vx * 4, py - vy * 4), (px + vx * 4, py + vy * 4)]
        elif typ == 2: pts = [(px - ux * 5 - vx * 3, py - uy * 5 - vy * 3), (px, py), (px - ux * 5 + vx * 3, py - uy * 5 + vy * 3)]
        else: pts = [(px - vx * 4 - ux * 4, py - vy * 4 - uy * 4), (px + vx * 4 + ux * 4, py + vy * 4 + uy * 4), (px - vx * 4 + ux * 4, py - vy * 4 + uy * 4)]
        runes += line_mask(S, S, pts, 1.7)
    runes = np.clip(runes, 0, 1)
    # rosácea: 12 arcos ogivais em volta do centro
    rosette = np.zeros((S, S))
    for k in range(12):
        a0 = k * math.pi / 6
        for sgn in (-1, 1):
            pts = []
            for u in np.linspace(0, 1, 18):
                rad = (.22 + .3 * u) * S / 2; aa = a0 + sgn * .26 * math.sin(u * math.pi * .95) * (1 - .35 * u)
                pts.append((c + math.cos(aa) * rad, c + math.sin(aa) * rad))
            rosette += line_mask(S, S, pts, 1.5)
    rosette = np.clip(rosette, 0, 1)
    # estrela de 8 pontas
    star8 = np.zeros((S, S))
    for sq in range(2):
        pts = [(c + math.cos(sq * math.pi / 4 + k * math.pi / 2) * .5 * (S / 2), c + math.sin(sq * math.pi / 4 + k * math.pi / 2) * .5 * (S / 2)) for k in range(5)]
        star8 += line_mask(S, S, pts, 1.6)
    star8 = np.clip(star8, 0, 1)
    frames = []
    for i in range(N):
        t = i / (N - 1)
        grow = smooth(0, .2, t); life = smooth(0, .08, t) * (1 - smooth(.72, 1, t))
        sc = .5 + .5 * grow + .03 * math.sin(t * 7)
        rr = r / sc; I = np.zeros((S, S))
        def rg(r0, w): return np.exp(-((rr - r0) / w) ** 2)
        I += rg(.94, .016) * 1.0 + rg(.88, .007) * .7 + rg(.62, .011) * .8 + rg(.2, .01) * .7
        a1 = ((ang + t * 2.2) * 48 / (2 * math.pi)) % 1.0
        I += np.exp(-((a1 - .5) / .12) ** 2) * ((rr > .89) & (rr < .93)) * .85
        def rot(a, deg):
            from scipy.ndimage import affine_transform
            th = math.radians(deg); cs, sn = math.cos(th), math.sin(th)
            M = np.array([[cs, -sn], [sn, cs]]) / sc; off = np.array([c, c]) - M @ np.array([c, c])
            return affine_transform(a, M, offset=off, order=1)
        I += rot(runes, t * -40) * .95 * grow
        I += rot(rosette, t * 24) * .85
        I += rot(star8, -t * 50) * .8
        # cruzes grandes nos 4 pontos cardeais do anel externo
        for k in range(4):
            a0 = t * 1.0 + k * math.pi / 2; px = c + math.cos(a0) * .78 * (S / 2) * sc; py = c + math.sin(a0) * .78 * (S / 2) * sc
            add_star(I, px, py, 11 * sc, .95, diag=.2)
        I += (np.exp(-((xx - c) / 2.2) ** 2) * np.exp(-((yy - c) / (30 * sc)) ** 2) + np.exp(-((yy - c + 7 * sc) / 2.2) ** 2) * np.exp(-((xx - c) / (19 * sc)) ** 2)) * 1.15
        I += np.exp(-(rr / .22) ** 2) * .55
        I *= life
        # varredura de luz que corre pelo anel
        I += np.exp(-(((((ang - t * 9) + math.pi) % (2 * math.pi)) - math.pi) / .25) ** 2) * rg(.93, .03) * .9 * life
        I += blur(I, 3) * .7 + np.exp(-(rr / .5) ** 2) * .22 * smooth(0, .12, t) * (1 - smooth(.15, .4, t))
        frames.append(glow_rgba(I, stops, 1.0))
    save_sheet(frames, 7, name)


# ── cruz sagrada que estoura ───────────────────────────────────────────────────────────────────────────────────────
def make_cruz():
    S, N = 256, 20
    yy, xx = np.mgrid[0:S, 0:S].astype(float); c = (S - 1) / 2
    dx, dy = xx - c, yy - c; r = np.hypot(dx, dy); ang = np.arctan2(dy, dx)
    rng = np.random.default_rng(21)
    shards = [(rng.uniform(0, 2 * math.pi), rng.uniform(.6, 1.3), rng.uniform(2, 4.5)) for _ in range(26)]
    frames = []
    for i in range(N):
        t = i / (N - 1)
        pop = smooth(0, .14, t); fade = 1 - smooth(.5, 1, t)
        L_h, L_v = 122 * pop + 8, 122 * pop * 1.18 + 8
        wv = 4 + 13 * (1 - smooth(0, .3, t))
        bar_h = np.exp(-(dy / (wv * .7 + 1.5)) ** 2) * (1 - smooth(L_h * .7, L_h, np.abs(dx)))
        bar_v = np.exp(-(dx / (wv * .7 + 1.5)) ** 2) * (1 - smooth(L_v * .7, L_v, np.abs(dy)))
        I = (bar_h + bar_v) * 1.15
        for sgn in (1, -1):
            d = np.abs((dx * sgn + dy) / math.sqrt(2)); along = np.abs(dx * sgn - dy) / math.sqrt(2)
            I += np.exp(-(d / 3) ** 2) * (1 - smooth(60 * pop, 90 * pop + 1, along)) * .5
        I += np.exp(-(r / (20 + 24 * (1 - smooth(0, .4, t)))) ** 2) * 1.4 * (1 - smooth(.22, .7, t))
        for rad0, dl, w0 in ((24, 0, 4), (16, .07, 3)):
            tr = np.clip((t - dl) / .6, 0, 1)
            if tr > 0: I += np.exp(-((r - (rad0 + 105 * (1 - (1 - tr) ** 2))) / (w0 + 6 * tr)) ** 2) * (1 - tr) ** 1.2 * .95
        # estilhaços de luz (losangos finos) voando
        for a0, spd, wd in shards:
            tr = np.clip((t - .02) / .6, 0, 1)
            if tr <= 0: continue
            rr_ = 16 + 100 * spd * (1 - (1 - tr) ** 2)
            da = np.abs(((ang - a0 + math.pi) % (2 * math.pi)) - math.pi)
            I += np.exp(-(((r - rr_) / (7 + 10 * spd)) ** 2)) * np.exp(-(da * r / wd) ** 2) * (1 - tr) ** 1.3 * 1.1
        add_star(I, c, c, 40 * (1 - smooth(.15, .6, t)) + 6, 1.0, diag=.9)
        I *= fade
        I += blur(I, 6) * .8 + blur(I, 18) * .22
        frames.append(glow_rgba(I, GOLD, 1.0))
    save_sheet(frames, 5, 'fx-cruz.webp')


# ── escudo heráldico ──────────────────────────────────────────────────────────────────────────────────────────────
def shield_outline(W, H, k=1.0, ox=0, oy=0):
    """escudo heráldico: topo reto, lados retos até quase a metade e uma curva convexa até a ponta."""
    cx = W / 2 + ox; top = H * .12 + oy; bot = H * .93 + oy; w = W * .36 * k
    mid = top + (bot - top) * .42
    right = [(cx + w, top), (cx + w, mid)]
    for u in np.linspace(0, 1, 26)[1:]:
        # bézier quadrática de (cx+w, mid) até a ponta, com controle (cx+w, mid + 0.8*(bot-mid)) -> curva convexa
        p0 = np.array([cx + w, mid]); p1 = np.array([cx + w * .98, mid + (bot - mid) * .78]); p2 = np.array([cx, bot])
        q = (1 - u) ** 2 * p0 + 2 * (1 - u) * u * p1 + u ** 2 * p2
        right.append((q[0], q[1]))
    left = [(2 * cx - x, y) for x, y in right[::-1]]
    return right + left


def make_escudo():
    W, H, N = 192, 224, 20
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    full = shield_outline(W, H)
    m_full = poly_mask(W, H, full)
    m_in = poly_mask(W, H, shield_outline(W, H, .86, 0, 5.5))
    m_in = np.minimum(m_in, gaussian_filter(m_in, 1.0))
    # cruz de ouro no campo azul-escuro
    cx = W / 2
    cross = np.zeros((H, W))
    cross += (np.abs(xx - cx) < 8) * (yy > H * .26) * (yy < H * .78)
    cross += (np.abs(yy - H * .43) < 8) * (np.abs(xx - cx) < W * .24)
    cross = gaussian_filter(np.clip(cross, 0, 1), .8)
    # relevo: luz de cima à esquerda
    gx, gy = np.gradient(gaussian_filter(m_full, 2.2))
    lit = np.clip(.5 - (gx * -.6 + gy * -.8) * 14, 0, 1)
    metal = ramp(.25 + .6 * lit + .1 * fbm(H, W, 7, 3, seed=2), [(0, (110, 66, 12)), (.5, (210, 150, 40)), (1, (255, 240, 170))])
    field = ramp(.2 + .45 * (1 - yy / H) + .1 * fbm(H, W, 5, 3, seed=3), [(0, (14, 20, 54)), (.6, (30, 52, 120)), (1, (70, 100, 190))])
    gcross = ramp(.35 + .6 * lit + .15, [(0, (150, 100, 20)), (.5, (240, 190, 70)), (1, (255, 246, 200))])
    gx2, gy2 = np.gradient(gaussian_filter(cross, 1.6)); lit2 = np.clip(.5 - (gx2 * -.6 + gy2 * -.8) * 6, 0, 1)
    gcross = ramp(.3 + .65 * lit2, [(0, (150, 100, 20)), (.5, (240, 190, 70)), (1, (255, 246, 200))])
    col = metal * (m_full - m_in)[..., None] + (field * (1 - cross[..., None]) + gcross * cross[..., None]) * m_in[..., None]
    alpha_full = m_full
    rng = np.random.default_rng(31)
    frames = []
    for i in range(N):
        t = i / (N - 1)
        build = smooth(0, .38, t)
        # o escudo se forma varrendo de cima para baixo, com poeira de luz atraída para ele
        edge = yy < (H * 1.05) * build
        sweep = smooth(H * 1.05 * build - 26, H * 1.05 * build, yy) * 0       # (fronteira suave)
        reveal = (1 - smooth(H * 1.05 * build - 28, H * 1.05 * build + 2, yy)) if build < 1 else np.ones((H, W))
        a = alpha_full * reveal * smooth(0, .12, t)
        c = col.copy()
        # brilho que percorre
        bandpos = -.3 + 1.5 * smooth(.3, .85, t)
        band = np.exp(-((((xx / W) * .5 + (yy / H) * .9) - bandpos * 1.2) / .07) ** 2) * (smooth(.3, .4, t)) * (1 - smooth(.85, 1, t))
        c = c + band[..., None] * np.array([255, 240, 190]) * .55 * (m_full[..., None])
        # flash ao completar
        fl = np.exp(-((t - .4) / .06) ** 2)
        c = c + fl * np.array([255, 235, 170]) * .5 * m_full[..., None]
        # contorno luminoso (borda dourada brilhando) enquanto forma
        edge_glow = (m_full - gaussian_filter(m_full, 3)) * 1.4
        edge_glow = np.clip(edge_glow, 0, 1)
        halo = blur(m_full, 9) * (1 - m_full) * (.55 * smooth(0, .4, t) * (1 - smooth(.6, 1, t)) + .5 * np.exp(-((t - .4) / .08) ** 2))
        out = np.zeros((H, W, 4))
        out[..., :3] = np.clip(c, 0, 255)
        out[..., 3] = np.clip(a, 0, 1) * 255
        # halo dourado por baixo (composição "over" sobre transparente)
        hal_a = np.clip(halo, 0, 1)
        out2 = out.copy()
        ha = hal_a * (1 - a)
        tot = np.clip(a + ha, 0, 1)
        out2[..., :3] = (out[..., :3] * a[..., None] + np.array([255, 205, 100]) * ha[..., None]) / (tot[..., None] + 1e-6)
        out2[..., 3] = tot * 255 * (1 - smooth(.88, 1, t))
        base_im = Image.fromarray(np.clip(out2, 0, 255).astype(np.uint8), 'RGBA')
        im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(im, 'RGBA')
        # faíscas de luz que convergem para o escudo e depois brilham
        for k in range(22):
            ph = rng.uniform(0, 1); ang = rng.uniform(0, 2 * math.pi); R0 = rng.uniform(70, 110)
            u = (t * 1.5 + ph) % 1
            if t < .5:
                rad = R0 * (1 - smooth(0, 1, u)) ; al = math.sin(u * math.pi)
                px = cx + math.cos(ang) * rad * .9; py = H * .5 + math.sin(ang) * rad * 1.1
                d.ellipse((px - 2, py - 2, px + 2, py + 2), fill=(255, 235, 160, int(220 * al)))
        # brilho em cruz no centro ao completar
        q = np.exp(-((t - .42) / .1) ** 2)
        if q > .05:
            L = 28 * q; cy0 = H * .43
            d.line((cx - L, cy0, cx + L, cy0), fill=(255, 250, 225, int(240 * q)), width=2); d.line((cx, cy0 - L, cx, cy0 + L), fill=(255, 250, 225, int(240 * q)), width=2)
        base_im.alpha_composite(im)
        frames.append(base_im)
    save_sheet(frames, 5, 'fx-escudo.webp')


# ── alma de soldado: elmo de luz com cauda de chama (laço) ───────────────────────────────────────────────────────────
def make_alma():
    W, H, N = 128, 192, 16
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    cx, cy = W / 2, 60.0
    # elmo fechado (great helm): cúpula, lados retos, base levemente afunilada
    pts = [(cx - 21, cy + 28), (cx - 23, cy - 6)]
    for u in np.linspace(0, math.pi, 22): pts.append((cx - 23 * math.cos(u), cy - 6 - 30 * math.sin(u)))
    pts += [(cx + 23, cy - 6), (cx + 21, cy + 28), (cx + 12, cy + 33), (cx - 12, cy + 33)]
    m = poly_mask(W, H, pts)
    slit = poly_mask(W, H, [(cx - 17, cy - 6), (cx + 17, cy - 6), (cx + 17, cy - 1), (cx - 17, cy - 1)])
    vslit = poly_mask(W, H, [(cx - 1.6, cy - 6), (cx + 1.6, cy - 6), (cx + 1.6, cy + 26), (cx - 1.6, cy + 26)])
    holes = np.zeros((H, W))
    for hx in (-10, 10):
        for hy in (8, 14, 20): holes += np.exp(-(((xx - cx - hx) / 1.5) ** 2 + ((yy - cy - hy) / 1.5) ** 2))
    rim = np.clip(m - gaussian_filter(m, 2.6), 0, 1) * 2.2
    body = gaussian_filter(m, 1.2) * .34
    noise = fbm(H, W, 9, 3, seed=8)
    frames = []
    for i in range(N):
        ph = i / N * 2 * math.pi
        I = rim * 1.1 + body
        I = I * (1 - np.clip(slit + vslit * .8, 0, 1) * .85) + np.clip(slit, 0, 1) * .75 * (.7 + .3 * math.sin(ph * 2))   # a fresta de olhar brilha
        I -= np.clip(holes, 0, 1) * .25
        # cauda: duas fitas onduladas descendo do elmo
        for k, off in enumerate((-9, 9)):
            for j in range(42):
                u = j / 41
                px = cx + off * (1 - .35 * u) + math.sin(ph + u * 5.5 + k * 2.4) * (4 + 15 * u)
                py = cy + 30 + u * (H - cy - 44)
                rad = 7.5 * (1 - u) ** .9 + 1.4
                I += np.exp(-(((xx - px) ** 2 + (yy - py) ** 2) / rad ** 2)) * (1 - u) ** .6 * .5
        I += np.exp(-(((xx - cx) / 38) ** 2 + ((yy - cy + 4) / 44) ** 2)) * .28          # halo
        I *= (.85 + .15 * np.sin(yy / 6 - ph * 2 + noise * 6))
        I = np.clip(I, 0, None)
        for k in range(7):
            p_ = ((i / N) + k / 7) % 1
            add_star(I, cx + math.sin(p_ * 9 + k * 1.7) * 26, cy - 34 + p_ * 120, 4.5, math.sin(p_ * math.pi) * .9)
        I += blur(I, 4) * .6
        frames.append(glow_rgba(I, HOLY, 1.0))
    save_sheet(frames, 8, 'fx-alma.webp')


# ── asas de luz ──────────────────────────────────────────────────────────────────────────────────────────────────────
def make_asas():
    W, H, N = 400, 260, 24
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    cx, cy = W / 2, 150.0
    rng = np.random.default_rng(14)
    def wing_layer(open_, flap, side):
        I = np.zeros((H, W))
        # três fileiras de penas: coberteiras curtas, secundárias e primárias longas
        rows = [(8, 60, 3.2, -35, 28, .5), (10, 100, 3.8, -60, 16, .75), (9, 142, 4.4, -74, 4, 1.0)]
        for n, L0, w0, a_top, a_bot, br in rows:
            for k in range(n):
                f = k / (n - 1)
                ang_open = math.radians(a_top + (a_bot - a_top) * f)
                ang = ang_open * open_ + math.radians(-80) * (1 - open_) + math.radians(flap * (1 - f * .5))
                L = L0 * (.6 + .55 * f) * (.35 + .65 * open_)
                ox, oy = cx + side * 16, cy - 8 + f * 8
                rx = (xx - ox) * side; ry = (yy - oy)
                s_ = rx * math.cos(ang) + ry * math.sin(ang); pr = -rx * math.sin(ang) + ry * math.cos(ang)
                u_ = np.clip(s_ / max(L, 1), 0, 1)
                wid = w0 * (.5 + 1.1 * np.sin(u_ * math.pi * .9) ** .7)
                prof = np.exp(-(pr / np.maximum(wid, 1)) ** 2) * (s_ > 0) * smooth(L, L * .8, s_)
                feather = prof * br * (.45 + .55 * (1 - u_ ** 1.4)) + np.exp(-(pr / 1.0) ** 2) * (s_ > 0) * smooth(L, L * .92, s_) * br * .55
                I = np.maximum(I, feather * (.35 + .65 * smooth(6, 46, s_)))
        return I
    frames = []
    for i in range(N):
        t = i / (N - 1)
        open_ = smooth(0, .3, t); life = smooth(0, .08, t) * (1 - smooth(.72, 1, t))
        flap = 3.0 * math.sin(t * 14) * smooth(.25, .4, t)
        I = wing_layer(open_, flap, 1) + wing_layer(open_, flap, -1)
        I += np.exp(-(((xx - cx) / 22) ** 2 + ((yy - cy) / 34) ** 2)) * .35 * open_
        I *= life
        for k in range(16):
            ph = (t * 1.3 + k / 16) % 1; side = 1 if k % 2 else -1
            add_star(I, cx + side * (40 + 140 * ph), cy - 70 + 120 * ((k * 37 % 10) / 10) - ph * 30, 7, math.sin(ph * math.pi) * .9 * life * smooth(.2, .35, t))
        I += blur(I, 5) * .55 + blur(I, 14) * .22
        frames.append(glow_rgba(I, GOLD, 1.0))
    save_sheet(frames, 4, 'fx-asas.webp')


# ── sol de raios (halo giratório; laço) ─────────────────────────────────────────────────────────────────────────
def make_sol():
    S, N = 256, 16
    yy, xx = np.mgrid[0:S, 0:S].astype(float); c = (S - 1) / 2
    r = np.hypot(xx - c, yy - c) / (S / 2); ang = np.arctan2(yy - c, xx - c)
    frames = []
    for i in range(N):
        rot = i / N * (2 * math.pi / 20)
        rays = (.5 + .5 * np.cos(20 * (ang + rot))) ** 5 * np.exp(-(r / .85) ** 2.2) * smooth(.12, .3, r)
        rays2 = (.5 + .5 * np.cos(40 * (ang - rot * 1.0) + 1)) ** 8 * np.exp(-(r / .6) ** 2) * smooth(.14, .3, r) * .6
        I = rays * .85 + rays2
        I += np.exp(-((r - .27) / .018) ** 2) * .9 + np.exp(-((r - .31) / .008) ** 2) * .6
        I += np.exp(-(r / .26) ** 2) * .55
        I *= 1 - smooth(.88, 1.0, r)
        I += blur(I, 3) * .5
        frames.append(glow_rgba(I, GOLD, 1.0))
    save_sheet(frames, 4, 'fx-sol.webp')


# ── portal gótico de luz ─────────────────────────────────────────────────────────────────────────────────────────
def make_portal():
    W, H, N = 192, 320, 24
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    cx = W / 2; w = 52.0; base = H * .88; ys = H * .5; apex = ys - math.sqrt(3) * w
    path = [(cx - w, base), (cx - w, ys)]
    for u in np.linspace(0, 1, 30):                              # arco esquerdo: centro em (cx+w, ys), raio 2w
        a = math.pi - u * math.radians(60); path.append((cx + w + 2 * w * math.cos(a), ys - 2 * w * math.sin(a)))
    for u in np.linspace(0, 1, 30):                              # arco direito
        a = math.radians(60) - u * math.radians(60)
        path.append((cx - w + 2 * w * math.cos(a), ys - 2 * w * math.sin(a)))
    path += [(cx + w, ys), (cx + w, base)]
    inner = poly_mask(W, H, path)
    segs = np.cumsum([0] + [math.hypot(path[k + 1][0] - path[k][0], path[k + 1][1] - path[k][1]) for k in range(len(path) - 1)])
    frames = []
    streak = fbm(H, W, 14, 3, seed=6)
    for i in range(N):
        t = i / (N - 1)
        draw = smooth(0, .3, t); fill = smooth(.22, .5, t); life = 1 - smooth(.74, 1, t)
        L = segs[-1] * draw
        I = np.zeros((H, W))
        k = int(np.searchsorted(segs, L)); k = min(k, len(path) - 2)
        # contorno: desenha a trilha até o comprimento atual, a partir das duas pontas ao mesmo tempo (esq e dir se encontram no ápice)
        half = [(x, y) for x, y in path]
        mid = len(half) // 2
        left = half[:mid]; right = half[mid:][::-1]
        for pts in (left, right):
            lens = np.cumsum([0] + [math.hypot(pts[j + 1][0] - pts[j][0], pts[j + 1][1] - pts[j][1]) for j in range(len(pts) - 1)])
            tot = lens[-1] * draw; cut = [pts[0]]
            for j in range(len(pts) - 1):
                if lens[j + 1] <= tot: cut.append(pts[j + 1])
                else:
                    f = (tot - lens[j]) / max(lens[j + 1] - lens[j], 1e-6)
                    if f > 0: cut.append((pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f))
                    break
            if len(cut) > 1:
                I += line_mask(W, H, cut, 3.4) * 1.1
                add_star(I, cut[-1][0], cut[-1][1], 12, 1.0 if draw < 1 else 0)
        # luz dentro do portal: faixas verticais brilhantes e brilho forte no centro-baixo
        v = (.55 + .45 * np.sin((xx - cx) / 5 + streak * 6 - t * 10)) * np.exp(-(((xx - cx) / (w * .9)) ** 2))
        glow = inner * fill * (.18 + .38 * v) * (.4 + .6 * smooth(apex, base, yy))
        I += glow + inner * fill * np.exp(-(((xx - cx) / 14) ** 2)) * .32
        I += blur(inner, 7) * fill * .35
        # luz que escorre pelo chão em cone
        fl = np.exp(-(((xx - cx) / (w * (1 + 1.3 * np.clip((yy - base) / 40, 0, 1)))) ** 2)) * smooth(base - 4, base + 2, yy) * (1 - smooth(base + 30, base + 38, yy)) * fill * .8
        I += fl
        I *= life
        I += blur(I, 5) * .55 + blur(I, 14) * .2
        frames.append(glow_rgba(I, GOLD, 1.0))
    save_sheet(frames, 6, 'fx-portal.webp')


# ── penas que caem ───────────────────────────────────────────────────────────────────────────────────────────────
def feather(size, rng):
    """uma pena branca (RGBA, size x size): cálamo curvo, vexilo assimétrico com barbas e borda esfiapada."""
    ss = 4; S = size * ss
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im, 'RGBA')
    x0, L = S * .08, S * .84; y0 = S * .5
    def axis(u):
        return x0 + u * L, y0 + math.sin(u * math.pi) * -S * .07 + u * S * .02
    up, dn = [], []
    for u in np.linspace(.06, 1, 60):
        x, y = axis(u)
        prof = (math.sin(min(1, u * 1.02) ** .62 * math.pi) ** .75)
        w_up = S * .20 * prof * (1 - .12 * u); w_dn = S * .13 * prof * (1 - .2 * u)
        # esfiapado: pequenas entalhes irregulares
        jit = 1 - .16 * (rng.random() > .72) * rng.random()
        jit2 = 1 - .16 * (rng.random() > .72) * rng.random()
        up.append((x - S * .03 * prof, y - w_up * jit)); dn.append((x + S * .03 * prof, y + w_dn * jit2))
    d.polygon(up + dn[::-1], fill=(250, 249, 244, 255))
    # sombreamento suave do lado de baixo e barbas
    for u in np.linspace(.1, .97, 46):
        x, y = axis(u); prof = (math.sin(min(1, u * 1.02) ** .62 * math.pi) ** .75)
        w_up = S * .20 * prof * (1 - .12 * u); w_dn = S * .13 * prof * (1 - .2 * u)
        d.line((x, y, x + S * .07, y - w_up * .96), fill=(205, 208, 222, 120), width=max(1, ss // 2))
        d.line((x, y, x + S * .06, y + w_dn * .94), fill=(198, 200, 216, 130), width=max(1, ss // 2))
    # cálamo
    pts = [axis(u) for u in np.linspace(-.04, 1.0, 30)]
    d.line(pts, fill=(196, 188, 170, 255), width=ss + 1)
    d.line([axis(u) for u in np.linspace(-.07, .06, 6)], fill=(170, 150, 120, 255), width=ss + 2)
    im = im.resize((size, size), Image.LANCZOS)
    return im


def make_penas():
    W, H, N = 256, 320, 24
    rng = np.random.default_rng(5)
    base = [feather(72, rng) for _ in range(3)]
    items = [(rng.uniform(.12, .88), rng.uniform(0, 1), rng.uniform(.65, 1.2), rng.uniform(0, 6.28), rng.uniform(-1, 1), rng.integers(0, 3), rng.uniform(.55, 1.0)) for _ in range(11)]
    frames = []
    for i in range(N):
        t = i / (N - 1)
        im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        glow = np.zeros((H, W))
        yy, xx = np.mgrid[0:H, 0:W].astype(float)
        layers = []
        for fx, ph, spd, rot0, dirn, kind, sc in items:
            tt = (t * spd * .9 + ph * .35) ; u = tt % 1.0
            if tt > 1.0 and spd < 1.0: continue
            x = W * fx + math.sin(u * 7 + rot0) * 30 * (0.6 + dirn * .3)
            y = -20 + u * (H + 30)
            ang = math.degrees(math.sin(u * 5 + rot0) * .9 + rot0 * .2)
            a = math.sin(min(1, u) * math.pi) ** .6 * (1 - smooth(.8, 1, t) * 0)
            if a < .03: continue
            f = base[kind].resize((int(72 * sc), int(72 * sc)), Image.LANCZOS).rotate(ang, expand=True, resample=Image.BICUBIC)
            # inclina lateralmente (efeito de giro 3D)
            sq = .45 + .55 * abs(math.cos(u * 6 + rot0))
            f = f.resize((max(2, int(f.width * sq)), f.height), Image.LANCZOS)
            f.putalpha(f.getchannel('A').point(lambda v: int(v * a)))
            im.alpha_composite(f, (int(x - f.width / 2), int(y - f.height / 2)))
            glow += np.exp(-(((xx - x) / 22) ** 2 + ((yy - y) / 22) ** 2)) * a * .35
        g = Image.fromarray(np.dstack([np.full((H, W), 255), np.full((H, W), 236), np.full((H, W), 170), np.clip(glow, 0, 1) * 150]).astype(np.uint8), 'RGBA')
        g.alpha_composite(im)
        frames.append(g)
    save_sheet(frames, 6, 'fx-penas.webp')


# ── trompa de guerra ──────────────────────────────────────────────────────────────────────────────────────────────
def make_trompa():
    S, N = 256, 16
    yy, xx = np.mgrid[0:S, 0:S].astype(float); c = (S - 1) / 2
    dx, dy = xx - c, yy - c; r = np.hypot(dx, dy); ang = np.arctan2(dy, dx)
    frames = []
    for i in range(N):
        t = i / (N - 1)
        I = np.zeros((S, S))
        for k in range(3):
            tk = np.clip(t * 1.25 - k * .17, 0, 1)
            if tk <= 0: continue
            rad = 10 + 112 * (1 - (1 - tk) ** 2.2); fade = (1 - smooth(.35, 1, tk)) * .9
            serr = 1 + .022 * np.sin(ang * 22 + k * 1.7)          # serrilha de onda sonora
            I += np.exp(-((r / serr - rad) / (3.2 + 5 * tk)) ** 2) * fade
        I += np.exp(-(r / 24) ** 2) * (1 - smooth(0, .4, t)) * 1.1
        I += blur(I, 5) * .6
        frames.append(glow_rgba(I, GOLD, 1.0))
    save_sheet(frames, 4, 'fx-trompa.webp')


JOBS = [('brilhos', make_brilhos), ('coracao', make_coracao), ('cometa', make_cometa), ('pilar', make_pilar), ('sigilo', lambda: make_sigilo(GOLD, 'fx-sigilo.webp')), ('sigilo-azul', lambda: make_sigilo(HOLY, 'fx-sigilo-azul.webp')),
        ('cruz', make_cruz), ('escudo', make_escudo), ('alma', make_alma), ('asas', make_asas), ('sol', make_sol), ('portal', make_portal), ('penas', make_penas), ('trompa', make_trompa)]

if __name__ == '__main__':
    only = set(sys.argv[1:])
    for name, fn in JOBS:
        if not only or name in only:
            fn()
