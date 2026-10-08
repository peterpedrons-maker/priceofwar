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


# ── pilar de luz ────────────────────────────────────────────────────────────────────────────────────────────────
def make_pilar():
    W, H, N = 192, 384, 24
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    cx = W / 2; base_y = H * .86
    rng = np.random.default_rng(11)
    motes = [(rng.uniform(-.8, .8), rng.uniform(0, 1), rng.uniform(.6, 1.6), rng.uniform(1.2, 2.6)) for _ in range(34)]
    streak = fbm(H, W, 14, 3, seed=5)
    frames = []
    for i in range(N):
        t = i / (N - 1)
        grow = smooth(0, .22, t)                       # a luz desce
        life = smooth(0, .12, t) * (1 - smooth(.74, 1, t))
        top = H * (1 - grow) * .0                      # o pilar nasce no topo e a frente cai até o chão
        front = base_y * smooth(0, .24, t)             # até onde a luz já chegou
        pulse = 1 + .08 * math.sin(t * 22)
        # largura do feixe: estreita no alto, abre um pouco no chão
        u = np.clip(yy / base_y, 0, 1)
        half = (14 + 20 * u ** 1.4) * pulse * (.5 + .5 * smooth(0, .3, t))
        dx = (xx - cx)
        core = np.exp(-(dx / (half * .55)) ** 2)
        beam = np.exp(-(dx / half) ** 2)
        sh = streak + .25 * np.sin(yy / 9 - t * 18)      # fios que correm para baixo
        rays = (.72 + .28 * np.clip(np.sin(dx / 3.4 + sh * 4), -1, 1)) * beam
        reach = smooth(front + 18, front - 28, yy)       # corte suave na frente de luz
        vert = (.55 + .45 * smooth(0, .25, 1 - u * .9)) * (1 - smooth(base_y, base_y + 40, yy) * .85)
        I = (beam * .5 + core * .9 + rays * .18) * reach * vert
        # brilho no alto (fonte)
        I += np.exp(-((xx - cx) ** 2 / (60 ** 2) + (yy - 4) ** 2 / (22 ** 2))) * .55 * grow
        # impacto no chão: elipse + cruz
        if front > base_y - 30:
            k = smooth(.2, .36, t) * (1 - smooth(.68, 1, t))
            ell = np.exp(-(((xx - cx) / 58) ** 2 + ((yy - base_y) / 15) ** 2)) * .9
            ring = np.exp(-((np.hypot((xx - cx) / 66, (yy - base_y) / 17) - (.55 + .5 * smooth(.2, .7, t))) / .09) ** 2) * (1 - smooth(.5, .8, t)) * .8
            cross_h = np.exp(-((yy - base_y) / 2.6) ** 2) * np.exp(-((xx - cx) / (46 + 20 * k)) ** 2) * 1.1
            cross_v = np.exp(-((xx - cx) / 2.6) ** 2) * np.exp(-((yy - base_y) / (70 + 30 * k)) ** 2) * 1.1 * (yy < base_y + 14)
            I += (ell + ring + cross_h + cross_v) * k
        I *= life
        # poeira de luz que sobe
        mote = np.zeros((H, W))
        for mx, mp, ms, mr in motes:
            tt = (t * 1.2 + mp) % 1
            px = cx + mx * (half[int(base_y * .6), 0] if False else 40) * (1 + .3 * math.sin(tt * 6 + mp * 9)) + math.sin(tt * 7 + mp * 12) * 6
            py = base_y + 8 - tt * (base_y * .9) * ms
            a = math.sin(tt * math.pi) ** 1.2 * life * (grow > .5)
            if a > .02 and 0 < py < H:
                mote += a * np.exp(-(((xx - px) / mr) ** 2 + ((yy - py) / (mr * 1.5)) ** 2))
        I = I + mote * 1.1
        I += blur(I, 5) * .55                              # bloom
        frames.append(glow_rgba(I, GOLD, 1.0))
    save_sheet(frames, 6, 'fx-pilar.webp')


# ── sigilo sagrado ───────────────────────────────────────────────────────────────────────────────────────────────
def make_sigilo(stops, name):
    S, N = 256, 24
    yy, xx = np.mgrid[0:S, 0:S].astype(float); c = (S - 1) / 2
    r = np.hypot(xx - c, yy - c) / (S / 2); ang = np.arctan2(yy - c, xx - c)

    def ring(r0, w):
        return np.exp(-((r - r0) / w) ** 2)

    def ticks(r0, r1, n, rot, w=.012):
        a = ((ang + rot) * n / (2 * math.pi)) % 1.0
        tk = np.exp(-(((a - .5) * 2 * math.pi * r0 / n * 2) / (w * 3)) ** 2) if False else np.exp(-((a - .5) / (w * n / 6)) ** 2)
        return tk * smooth(r0 - .005, r0, r) * (1 - smooth(r1, r1 + .01, r))

    def cross_at(rad, a0, size):
        cxp = c + math.cos(a0) * rad * (S / 2); cyp = c + math.sin(a0) * rad * (S / 2)
        return (np.exp(-((xx - cxp) / 1.6) ** 2) * np.exp(-((yy - cyp) / size) ** 2) +
                np.exp(-((yy - cyp) / 1.6) ** 2) * np.exp(-((xx - cxp) / (size * .75)) ** 2))

    frames = []
    for i in range(N):
        t = i / (N - 1)
        grow = smooth(0, .22, t); life = smooth(0, .1, t) * (1 - smooth(.7, 1, t))
        sc = .55 + .45 * grow + .05 * math.sin(t * 6)
        rot = t * 2.4
        I = np.zeros((S, S))
        rr = r / sc
        # anéis (usam rr para crescer na abertura)
        def rg(r0, w): return np.exp(-((rr - r0) / w) ** 2)
        I += rg(.92, .018) * 1.0 + rg(.86, .008) * .7 + rg(.60, .012) * .8 + rg(.34, .01) * .6
        # marcas giratórias entre os anéis
        a1 = ((ang + rot) * 36 / (2 * math.pi)) % 1.0
        I += np.exp(-((a1 - .5) / .1) ** 2) * ((rr > .875) & (rr < .915)) * .8
        a2 = ((ang - rot * 1.4) * 12 / (2 * math.pi)) % 1.0
        I += np.exp(-((a2 - .5) / .09) ** 2) * ((rr > .62) & (rr < .84)) * .55
        # cruzes giratórias no anel do meio
        for k in range(6):
            a0 = rot * .8 + k * math.pi / 3
            px = c + math.cos(a0) * .73 * (S / 2) * sc; py = c + math.sin(a0) * .73 * (S / 2) * sc
            L = 8 * sc
            I += (np.exp(-((xx - px) / 1.5) ** 2) * np.exp(-((yy - py) / L) ** 2) + np.exp(-((yy - py) / 1.5) ** 2) * np.exp(-((xx - px) / (L * .7)) ** 2)) * .95
        # estrela de oito pontas no centro (dois quadrados) em linhas finas
        for sq in range(2):
            pts = [(c + math.cos(rot * (-1) + sq * math.pi / 4 + k * math.pi / 2) * .5 * (S / 2) * sc, c + math.sin(rot * (-1) + sq * math.pi / 4 + k * math.pi / 2) * .5 * (S / 2) * sc) for k in range(5)]
            I += line_mask(S, S, pts, 1.6) * .7
        # cruz central
        I += (np.exp(-((xx - c) / 2.2) ** 2) * np.exp(-((yy - c) / (26 * sc)) ** 2) + np.exp(-((yy - c + 6 * sc) / 2.2) ** 2) * np.exp(-((xx - c) / (16 * sc)) ** 2)) * 1.1
        I += np.exp(-(rr / .16) ** 2) * .5
        I *= life
        # brilho de abertura
        I += blur(I, 4) * .7 + np.exp(-(rr / .5) ** 2) * .22 * smooth(0, .12, t) * (1 - smooth(.15, .4, t))
        frames.append(glow_rgba(I, stops, 1.0))
    save_sheet(frames, 6, name)


# ── cruz sagrada que estoura ───────────────────────────────────────────────────────────────────────────────────────
def make_cruz():
    S, N = 256, 16
    yy, xx = np.mgrid[0:S, 0:S].astype(float); c = (S - 1) / 2
    dx, dy = xx - c, yy - c; r = np.hypot(dx, dy); ang = np.arctan2(dy, dx)
    frames = []
    for i in range(N):
        t = i / (N - 1)
        pop = smooth(0, .18, t); fade = 1 - smooth(.5, 1, t)
        L_h, L_v = 118 * pop + 10, 118 * pop * 1.15 + 10
        wv = 5 + 11 * (1 - smooth(0, .3, t))           # espessura que afina
        # barras da cruz: largas no começo, afinando e crescendo para as pontas
        bar_h = np.exp(-(dy / (wv * .7 + 1.5)) ** 2) * (1 - smooth(L_h * .75, L_h, np.abs(dx)))
        bar_v = np.exp(-(dx / (wv * .7 + 1.5)) ** 2) * (1 - smooth(L_v * .75, L_v, np.abs(dy)))
        I = (bar_h + bar_v) * 1.1
        # duas barras diagonais finas (estrela)
        for sgn in (1, -1):
            d = np.abs((dx * sgn + dy) / math.sqrt(2)); along = np.abs(dx * sgn - dy) / math.sqrt(2)
            I += np.exp(-(d / 3) ** 2) * (1 - smooth(60 * pop, 85 * pop + 1, along)) * .45
        # núcleo
        I += np.exp(-(r / (20 + 20 * (1 - smooth(0, .4, t)))) ** 2) * 1.3 * (1 - smooth(.25, .7, t))
        # anel de choque
        rad = 20 + 100 * smooth(.04, .6, t)
        I += np.exp(-((r - rad) / (4 + 6 * t)) ** 2) * (1 - smooth(.3, .7, t)) * .9
        # fagulhas radiais
        for k in range(18):
            a0 = k * 2 * math.pi / 18 + .3; sp = 40 + (k * 37 % 50)
            rr_ = 18 + sp * 2.1 * smooth(.04, .6, t)
            da = np.abs(((ang - a0 + math.pi) % (2 * math.pi)) - math.pi)
            I += np.exp(-((r - rr_) / 3.2) ** 2) * np.exp(-(da * r / 3.5) ** 2) * (1 - smooth(.3, .6, t)) * .9
        I *= fade
        I += blur(I, 6) * .8
        frames.append(glow_rgba(I, GOLD, 1.0))
    save_sheet(frames, 4, 'fx-cruz.webp')


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


# ── chama-alma ────────────────────────────────────────────────────────────────────────────────────────────────────
def make_alma():
    W, H, N = 128, 192, 16
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    noise = fbm(H, W, 9, 3, seed=8)
    frames = []
    for i in range(N):
        ph = i / N * 2 * math.pi
        I = np.zeros((H, W))
        # cabeça (gota arredondada) em (64, 70) e cauda que sobe espiralando
        cx0, cy0 = W / 2, H * .62
        for k in range(46):
            u = k / 45
            sway = math.sin(ph + u * 5.2) * (6 + 14 * u)
            px = cx0 + sway; py = cy0 - u * H * .62
            rad = (11 * (1 - u) ** .9 + 1.6)
            I += np.exp(-(((xx - px) ** 2 + (yy - py) ** 2) / (rad ** 2))) * (1 - u) ** .5 * .55
        # cabeça brilhante
        hx = cx0 + math.sin(ph) * 1.5; hy = cy0
        I += np.exp(-(((xx - hx) / 12) ** 2 + ((yy - hy) / 15) ** 2)) * .9
        I += np.exp(-(((xx - hx) / 5.5) ** 2 + ((yy - (hy + 3)) / 7) ** 2)) * .9
        # dois "olhos" sutis de alma
        for ex in (-5.5, 5.5):
            I -= np.exp(-(((xx - hx - ex) / 2.4) ** 2 + ((yy - hy + 2) / 3.4) ** 2)) * .35
        # fiapos da cauda
        wob = np.sin(yy / 7 - ph * 2 + noise * 6)
        I *= (.8 + .2 * wob)
        I = np.clip(I, 0, None)
        I += blur(I, 4) * .6
        # faíscas flutuando
        for k in range(8):
            p = ((i / N) + k / 8) % 1
            px = cx0 + math.sin(p * 9 + k) * 18; py = cy0 + 18 - p * H * .7
            I += np.exp(-(((xx - px) ** 2 + (yy - py) ** 2) / 4.0)) * math.sin(p * math.pi) * .8
        frames.append(glow_rgba(I, HOLY, 1.0))
    save_sheet(frames, 8, 'fx-alma.webp')


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


JOBS = [('pilar', make_pilar), ('sigilo', lambda: make_sigilo(GOLD, 'fx-sigilo.webp')), ('sigilo-azul', lambda: make_sigilo(HOLY, 'fx-sigilo-azul.webp')),
        ('cruz', make_cruz), ('escudo', make_escudo), ('alma', make_alma), ('penas', make_penas), ('trompa', make_trompa)]

if __name__ == '__main__':
    only = set(sys.argv[1:])
    for name, fn in JOBS:
        if not only or name in only:
            fn()
