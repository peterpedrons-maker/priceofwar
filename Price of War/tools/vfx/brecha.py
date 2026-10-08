"""Brecha e Estandarte de conquista (mockup em public/mockups/efeitos-decks/), tudo desenhado aqui com numpy/PIL:
   fx-bandeira-<a|b>.webp   o estandarte ondulando ao vento: 24 quadros de 128x192, laço perfeito (a = vermelho e ouro, b = azul-aço e prata)
   fx-bandeira-plantar-<a|b>.webp   o mastro cai do alto, crava e o pano se abre: 20 quadros de 128x192
   fx-bandeira-cair-<a|b>.webp      o mastro tomba e o pano cai: 16 quadros de 128x192
   fx-muro.webp             um trecho de muralha de pedra que racha e desaba em blocos: 24 quadros de 256x192
   fx-ruinas.webp           escombros e rachaduras que ficam na casa aberta (imagem parada, 256x192)
   python3 tools/vfx/brecha.py [bandeira plantar cair muro ruinas]   (escreve em public/mockups/efeitos-decks/)"""
import math
import os
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter

OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'mockups', 'efeitos-decks')
os.makedirs(OUT, exist_ok=True)
SS = 3


def save_sheet(frames, cols, name, quality=90):
    rows = -(-len(frames) // cols)
    w, h = frames[0].size
    img = Image.new('RGBA', (cols * w, rows * h), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        img.paste(f, ((i % cols) * w, (i // cols) * h))
    img.save(os.path.join(OUT, name), quality=quality, method=6)
    print(name, img.size, os.path.getsize(os.path.join(OUT, name)) // 1024, 'KB')


# ── o pano ────────────────────────────────────────────────────────────────────────────────
SCHEMES = {
    'a': dict(base=(168, 32, 36), dark=(96, 14, 22), trim=(236, 190, 84), emblem=(244, 214, 120)),
    'b': dict(base=(52, 94, 150), dark=(24, 50, 92), trim=(214, 222, 236), emblem=(232, 238, 248)),
}
CW, CH = 84, 58          # tamanho do pano em repouso (px lógicos)


def cloth_texture(sc):
    """textura do pano (CW*SS x CH*SS): campo com sombra embaixo, faixa dourada em cima e embaixo, brasão (moeda atravessada por espada) e cauda de andorinha"""
    W, H = CW * SS, CH * SS
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    t = yy / H
    base = np.array(sc['base'], float) * (1 - t[..., None]) + np.array(sc['dark'], float) * t[..., None]
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), 'RGB').convert('RGBA')
    d = ImageDraw.Draw(img)
    tw = 5 * SS
    d.rectangle((0, 0, W, tw), fill=sc['trim'] + (255,)); d.rectangle((0, H - tw, W, H), fill=sc['trim'] + (255,))
    d.rectangle((0, 0, 3 * SS, H), fill=sc['trim'] + (255,))                                   # lado do mastro
    cx, cy, r = W * .46, H * .5, H * .26
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=sc['emblem'] + (255,), width=3 * SS)
    d.ellipse((cx - r * .62, cy - r * .62, cx + r * .62, cy + r * .62), fill=sc['emblem'] + (255,))
    d.polygon([(cx - 2.5 * SS, cy - r * 1.35), (cx + 2.5 * SS, cy - r * 1.35), (cx + 2.5 * SS, cy + r * 1.35), (cx - 2.5 * SS, cy + r * 1.35)], fill=sc['dark'] + (255,))
    d.rectangle((cx - r * .8, cy + r * .05, cx + r * .8, cy + r * .05 + 3 * SS), fill=sc['dark'] + (255,))
    # cauda de andorinha (corta um V na ponta livre)
    cut = Image.new('L', (W, H), 255); cd = ImageDraw.Draw(cut)
    cd.polygon([(W, 0), (W - 16 * SS, H / 2), (W, H)], fill=0)
    img.putalpha(Image.eval(cut, lambda v: v))
    return img


def render_flag(sc, phase, unfurl=1.0, amp=1.0, angle=0.0, drop=0.0, fw=128, fh=192, tear=0.0):
    """um quadro: mastro em (34, base 186) e o pano ondulando. phase em [0,1) (laço), unfurl 0..1 (largura do pano), angle (graus, tomba em volta da base), drop (px acima)"""
    tex = cloth_texture(sc)
    W, H = fw * SS, fh * SS
    canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    bx, by = 34 * SS, 186 * SS
    # mastro
    pole = Image.new('RGBA', (W, H), (0, 0, 0, 0)); pd = ImageDraw.Draw(pole)
    px0, px1 = bx - 2 * SS, bx + 2 * SS
    pd.rectangle((px0, 16 * SS, px1, by), fill=(96, 62, 30, 255)); pd.rectangle((px0, 16 * SS, px0 + SS, by), fill=(150, 104, 54, 255))
    pd.ellipse((bx - 4 * SS, 10 * SS, bx + 4 * SS, 20 * SS), fill=sc['trim'] + (255,)); pd.ellipse((bx - 2 * SS, 12 * SS, bx + 2 * SS, 16 * SS), fill=(255, 244, 200, 255))
    pd.polygon([(px0, by), (px1, by), (bx, by + 5 * SS)], fill=(60, 38, 18, 255))
    # pano: coluna por coluna, deslocada por uma onda que viaja para a ponta livre
    cloth = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ncols = int(CW * SS * max(.02, unfurl))
    ty0 = 22 * SS
    tw_ = tex.size[0]
    for i in range(ncols):
        u = i / (CW * SS)                         # 0 no mastro, 1 na ponta (do pano inteiro)
        un = i / max(1, ncols - 1)                # 0..1 dentro do pano que já abriu
        a = amp * (3.2 + 7.5 * un ** 1.15) * SS * (.35 + .65 * unfurl)
        w1 = math.sin(2 * math.pi * (u * 1.25 - phase))
        w2 = .35 * math.sin(2 * math.pi * (u * 2.6 - 2 * phase) + 1.3)
        dy = a * (w1 + w2) * un ** .6
        dx = -abs(dy) * .12 - un * 3 * SS * (1 - unfurl)
        col = tex.crop((int(u * tw_), 0, int(u * tw_) + 1, tex.size[1]))
        # sombreamento pela inclinação da onda
        slope = (math.cos(2 * math.pi * (u * 1.25 - phase)) * 1.25 * 2 * math.pi) * un ** .6
        sh = 1 - np.clip(slope * .05, -.28, .28)
        arr = np.asarray(col).astype(float); arr[..., :3] = np.clip(arr[..., :3] * sh, 0, 255)
        col = Image.fromarray(arr.astype(np.uint8), 'RGBA')
        cloth.alpha_composite(col, (int(bx + 2 * SS + i + dx), int(ty0 + dy)))
    canvas.alpha_composite(cloth)
    canvas.alpha_composite(pole)
    if angle or drop:
        canvas = canvas.rotate(-angle, resample=Image.BICUBIC, center=(bx, by))
        if drop:
            sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sh.alpha_composite(canvas, (0, int(-drop * SS))); canvas = sh
    # sombra do mastro no chão
    return canvas.resize((fw, fh), Image.LANCZOS)


def make_flags():
    for key, sc in SCHEMES.items():
        save_sheet([render_flag(sc, i / 24) for i in range(24)], 6, f'fx-bandeira-{key}.webp')
        frames = []
        for i in range(20):
            if i < 6:    # cai do alto, um pouco inclinado, e crava
                u = i / 5; frames.append(render_flag(sc, 0, unfurl=0.02, amp=0, angle=(1 - u) * -14, drop=(1 - u ** 2) * 190))
            elif i < 8:  # o impacto: treme
                frames.append(render_flag(sc, 0, unfurl=0.02, amp=0, angle=(-1) ** i * 2.2 * (8 - i) / 2))
            else:        # o pano se abre ao vento
                u = (i - 8) / 11; e = 1 - (1 - u) ** 3
                frames.append(render_flag(sc, (i - 8) / 24 * 1.6, unfurl=e, amp=.4 + .6 * e))
        save_sheet(frames, 5, f'fx-bandeira-plantar-{key}.webp')
        frames = []
        for i in range(16):
            u = i / 15; ang = 86 * (u ** 2.2)
            frames.append(render_flag(sc, i / 24, unfurl=1 - .25 * u, amp=1 - u * .8, angle=ang))
        save_sheet(frames, 4, f'fx-bandeira-cair-{key}.webp')


# ── paliçada que se parte (linha de estacas e escudos num campo aberto) ──────────────────────────────────────────────────
FW, FH = 256, 192
GROUND = 150


def wood(rng, k=1.0):
    v = rng.uniform(.85, 1.12) * k
    return (int(196 * v), int(138 * v), int(76 * v), 255)


def poly_rot(cx, cy, pts, rot):
    ca, sa = math.cos(rot), math.sin(rot)
    return [((cx + x * ca - y * sa) * SS, (cy + x * sa + y * ca) * SS) for x, y in pts]


def make_scene(t, dust_on=True, patch=1.0, seed=3):
    """t em [0,1]: 0 = a paliçada de pé; ~.12 racha; .15 parte; 1 = tudo no chão (estado final, igual às ruínas)"""
    rng = np.random.default_rng(seed)
    img = Image.new('RGBA', (FW * SS, FH * SS), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    # chão: terra revirada que cresce com a quebra
    pr = min(1, t / .5) * patch
    d.ellipse(((128 - 100 * pr) * SS, (GROUND - 4 - 18 * pr) * SS, (128 + 100 * pr) * SS, (GROUND + 4 + 22 * pr) * SS), fill=(40, 26, 16, int(190 * pr)))
    d.ellipse((38 * SS, (GROUND - 6) * SS, 218 * SS, (GROUND + 12) * SS), fill=(52, 36, 22, 235))                       # montinho de terra da base
    n = 9; xs = [44 + i * 21 for i in range(n)]
    broke = .15
    shake = math.sin(t * 120) * 1.3 * (1 if .06 < t < broke else 0)
    pieces = []
    for i, x0 in enumerate(xs):
        h = 92 + rng.uniform(-8, 8); w = 15; br = rng.uniform(.34, .55)             # altura, largura e onde parte (fração da altura)
        col = wood(rng); col2 = wood(rng, .7)
        t0 = broke + abs(i - 4) * .018 + rng.uniform(0, .02)
        vx = (x0 - 128) * .55 + rng.normal(0, 10); vy = -rng.uniform(110, 190); vr = rng.normal(0, 6)
        # parte de baixo (toco): sempre existe
        stump = h * br
        ytop = GROUND - stump
        if t < t0:
            ytop = GROUND - h; sx = x0 + shake * (1 if i % 2 else -1)
            pts = [(sx - w / 2, GROUND), (sx - w / 2, ytop + 14), (sx, ytop - 4), (sx + w / 2, ytop + 14), (sx + w / 2, GROUND)]
            d.polygon([(x * SS, y * SS) for x, y in pts], fill=col, outline=(24, 14, 6, 255), width=2 * SS)
            d.polygon([(x * SS, y * SS) for x, y in [(sx - w / 2, GROUND), (sx - w / 2, ytop + 14), (sx - 1, ytop - 3), (sx - 1, GROUND)]], fill=col2)
            for yy in (GROUND - h * .3, GROUND - h * .62):
                d.rectangle(((sx - w / 2) * SS, yy * SS, (sx + w / 2) * SS, (yy + 3) * SS), fill=(240, 218, 150, 255))
        else:
            jag = [(x0 - w / 2, GROUND), (x0 - w / 2, ytop + 3), (x0 - w / 4, ytop - 4), (x0, ytop + 2), (x0 + w / 4, ytop - 5), (x0 + w / 2, ytop + 3), (x0 + w / 2, GROUND)]
            d.polygon([(x * SS, y * SS) for x, y in jag], fill=col, outline=(24, 14, 6, 255), width=2 * SS)
            # a metade de cima: sai voando, gira e cai deitada
            tt = (t - t0) * 2.3; g = 360
            top_h = h - stump
            px = x0 + vx * tt * .6; py = ytop + vy * tt + .5 * g * tt * tt; rot = vr * tt
            rest_y = GROUND + 14 + (i % 3) * 5 - 4 + rng.uniform(-6, 6)
            if py > rest_y:
                py = rest_y; rot = (rot * .15) + math.pi / 2 * (1 if vx > 0 else -1) * .92 + rng.uniform(-.2, .2)
                px = x0 + vx * (math.sqrt(max(0, 2 * (rest_y - ytop - vy * 0) / g)) if False else .5) * .9
            piece = [(-w / 2, 0), (w / 2, 0), (w / 2, -top_h + 12), (0, -top_h), (-w / 2, -top_h + 12)]
            pieces.append((poly_rot(px, py, piece, rot), col, col2))
    # escudos redondos (dois), à frente: racham e partem em duas metades
    for si, sx0 in enumerate((88, 168)):
        sy = GROUND - 22; r = 19
        t0 = broke + .03 + si * .03
        base = [(math.cos(a) * r, math.sin(a) * r) for a in np.linspace(0, 2 * math.pi, 28, endpoint=False)]
        def shield_poly(cx, cy, rot, half=None):
            pts = base if half is None else ([(x, y) for x, y in base if (x <= 0) == (half == 0)] + [(0, -r), (0, r)] if False else None)
            return pts
        if t < t0:
            cx = sx0 + shake
            d.ellipse(((cx - r) * SS, (sy - r) * SS, (cx + r) * SS, (sy + r) * SS), fill=(176, 52, 44, 255), outline=(24, 14, 6, 255), width=2 * SS)
            d.ellipse(((cx - r * .62) * SS, (sy - r * .62) * SS, (cx + r * .62) * SS, (sy + r * .62) * SS), outline=(214, 186, 112, 255), width=SS)
            d.ellipse(((cx - 5) * SS, (sy - 5) * SS, (cx + 5) * SS, (sy + 5) * SS), fill=(196, 196, 204, 255), outline=(60, 60, 68, 255))
            if t > .08:
                d.line([(cx * SS, (sy - r) * SS), ((cx - 3) * SS, (sy - 5) * SS), ((cx + 2) * SS, (sy + 4) * SS), (cx * SS, (sy + r) * SS)], fill=(20, 14, 10, 255), width=2 * SS)
        else:
            tt = (t - t0) * 2.4; g = 380
            for half, sgn in ((0, -1), (1, 1)):
                vx = sgn * (26 + 14 * si) ; vy = -(90 + 30 * half); vr = sgn * (4.2 + si)
                cx = sx0 + vx * tt * .5; cy = sy + vy * tt + .5 * g * tt * tt; rot = vr * tt
                rest = GROUND + 6 + half * 4
                if cy > rest:
                    cy = rest; rot = sgn * (.9 + .2 * half)
                    cx = sx0 + vx * .45
                hp = [(0, -r), (sgn * r * .98, -r * .3), (sgn * r * .98, r * .3), (0, r), (sgn * 3, 0)]
                pieces.append((poly_rot(cx, cy, hp, rot), (176, 52, 44, 255), (230, 200, 120, 255)))
    # as peças caídas, desenhadas por cima
    for pts, c1, c2 in pieces:
        d.polygon(pts, fill=c1, outline=(24, 14, 6, 255), width=2 * SS)
    # lascas (tiras finas) e torrões de terra
    if t > broke:
        tt = (t - broke) * 2.0
        for k in range(46):
            ang = rng.uniform(-math.pi * .98, -math.pi * .02); sp = rng.uniform(60, 190); x = 128 + rng.normal(0, 60) * .4
            vx, vy = math.cos(ang) * sp * 1.1, math.sin(ang) * sp
            px = x + vx * tt * .55; py = GROUND - 8 + vy * tt * .9 + .5 * 420 * tt * tt
            if py > GROUND + 10 + rng.uniform(-2, 8): py = GROUND + 10 + rng.uniform(0, 12)
            if k % 2 == 0:     # lasca
                L = rng.uniform(6, 14); rot = rng.uniform(0, 6.28) + tt * 3
                d.line([(px * SS, py * SS), ((px + math.cos(rot) * L) * SS, (py + math.sin(rot) * L) * SS)], fill=(232, 176, 104, 255), width=int(2.2 * SS))
            else:              # torrão de terra
                r_ = rng.uniform(2.4, 5.2)
                d.ellipse(((px - r_) * SS, (py - r_ * .8) * SS, (px + r_) * SS, (py + r_ * .8) * SS), fill=(84, 54, 30, 255), outline=(26, 16, 8, 255))
    out = img.resize((FW, FH), Image.LANCZOS)
    if dust_on and t > .14:
        dl = Image.new('RGBA', (FW, FH), (0, 0, 0, 0)); dd = ImageDraw.Draw(dl)
        drng = np.random.default_rng(11)
        for _ in range(18):
            dx = 128 + drng.normal(0, 52); dy = GROUND + drng.normal(0, 6); dr = drng.uniform(16, 34); d0 = drng.uniform(0, .2)
            u = (t - .15 - d0 * .5) / .8
            if u <= 0 or u >= 1: continue
            rr = dr * (.6 + 1.6 * u); al = int(165 * (1 - u) ** 1.3 * min(1, u * 5))
            ox = dx + u * (dx - 128) * .7
            dd.ellipse((ox - rr, dy - u * 34 - rr * .7, ox + rr, dy - u * 34 + rr * .7), fill=(150, 126, 96, al))
        out.alpha_composite(dl.filter(ImageFilter.GaussianBlur(5)))
    return out


def make_wall():
    frames = [make_scene(i / 23) for i in range(24)]
    save_sheet(frames, 6, 'fx-muro.webp')


def make_ruins():
    img = make_scene(1.0, dust_on=False)
    # as ruínas ficam um pouco mais discretas que a cena (para a bandeira ficar em primeiro plano)
    img.save(os.path.join(OUT, 'fx-ruinas.webp'), quality=90, method=6)
    print('fx-ruinas.webp')


if __name__ == '__main__':
    only = set(sys.argv[1:])
    if not only or {'bandeira', 'plantar', 'cair'} & only: make_flags()
    if not only or 'muro' in only: make_wall()
    if not only or 'ruinas' in only: make_ruins()
