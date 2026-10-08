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


# ── muralha que desaba ───────────────────────────────────────────────────────────────────────
def stone_color(rng, shade=1.0):
    v = rng.uniform(.8, 1.12) * shade
    return (int(150 * v), int(136 * v), int(118 * v), 255)


def make_wall():
    """o trecho de muro (de pé, com uma rachadura no meio) → blocos que se soltam e caem → pilha de escombros e nuvem de poeira"""
    FW, FH, N = 256, 192, 24
    rng = np.random.default_rng(5)
    cols, rows, bw, bh = 9, 5, 22, 16
    ox, oy = (FW - cols * bw) // 2, 150 - rows * bh
    blocks = []
    total = cols * bw
    for r in range(rows):
        x = ox
        if r % 2:   # fiada deslocada: começa com meio tijolo e termina com meio tijolo
            sizes = [bw // 2] + [bw] * (cols - 1) + [bw - bw // 2]
        else:
            sizes = [bw] * cols
        for c, wdt in enumerate(sizes):
            blocks.append(dict(x0=x + wdt / 2, y0=oy + r * bh + bh / 2, w=wdt - 1, h=bh - 1, col=stone_color(rng), r=r, c=c, rot=0.0))
            x += wdt
    # os blocos do meio caem; os das pontas ficam (com fraturas) — a "brecha"
    mid = cols / 2
    for b in blocks:
        dist = abs((b['x0'] - FW / 2) / bw)
        b['falls'] = dist < 2.6 - (b['r'] * .12)
        b['t0'] = .06 + .38 * (1 - dist / 3.0) * .9 + (rows - b['r']) * .018 + rng.uniform(0, .05)
        b['vx'] = rng.normal(0, 22) + (b['x0'] - FW / 2) * .55
        b['vr'] = rng.normal(0, 3.4)
        b['rest'] = 150 + rng.uniform(-3, 3) - b['h'] / 2 * rng.uniform(0, .5) - rng.uniform(0, 14) * (1 - dist / 3)
    frames = []
    dust = [(FW / 2 + rng.normal(0, 40), 140 + rng.normal(0, 8), rng.uniform(18, 36), rng.uniform(0, .25)) for _ in range(16)]
    for fi in range(N):
        t = fi / (N - 1)
        img = Image.new('RGBA', (FW * SS, FH * SS), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
        # sombra no chão
        d.ellipse((ox * SS, 140 * SS, (ox + cols * bw) * SS, 164 * SS), fill=(0, 0, 0, 70))
        shake = math.sin(fi * 2.1) * 1.4 * max(0, 1 - abs(t - .25) * 4)
        for b in sorted(blocks, key=lambda q: q['r']):
            x, y, rot = b['x0'], b['y0'], 0.0
            if b['falls'] and t > b['t0']:
                tt = (t - b['t0']) * 1.9; y = b['y0'] + 200 * tt * tt; x = b['x0'] + b['vx'] * tt * .35; rot = b['vr'] * tt
                if y > b['rest']:
                    y = b['rest'] - abs(math.sin((y - b['rest']) * .08)) * 2; rot *= .3
                    y = min(y, b['rest']); y = b['rest']
            elif not b['falls']:
                x += shake * (1 if b['c'] % 2 else -1)
            w, h = b['w'] * SS, b['h'] * SS
            corners = [(-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)]
            ca, sa = math.cos(rot), math.sin(rot)
            pts = [(x * SS + cx * ca - cy * sa, y * SS + cx * sa + cy * ca) for cx, cy in corners]
            d.polygon(pts, fill=b['col'], outline=(26, 20, 16, 255))
            d.line([pts[0], pts[1]], fill=(186, 176, 160, 255), width=SS)               # luz em cima
            d.line([pts[2], pts[3]], fill=(60, 54, 46, 255), width=SS)
        if .03 < t < .3:   # rachadura em zigue-zague no meio do muro, que cresce de cima para baixo
            zz = [(FW / 2 + (7 if k % 2 else -7) * SS * 0 + (6 if k % 2 else -6), oy + k * bh * .5) for k in range(int(11 * min(1, (t - .03) / .14)))]
            if len(zz) > 1: d.line([(x * SS, y * SS) for x, y in zz], fill=(18, 14, 10, 255), width=2 * SS)
        out = img.resize((FW, FH), Image.LANCZOS)
        # poeira
        dl = Image.new('RGBA', (FW, FH), (0, 0, 0, 0)); dd = ImageDraw.Draw(dl)
        for dx, dy, dr, d0 in dust:
            u = (t - .22 - d0 * .5) / .78
            if u <= 0: continue
            rr = dr * (.6 + 1.5 * u); al = int(150 * (1 - u) ** 1.3 * min(1, u * 5))
            dd.ellipse((dx + u * (dx - FW / 2) * .6 - rr, dy - u * 30 - rr * .7, dx + u * (dx - FW / 2) * .6 + rr, dy - u * 30 + rr * .7), fill=(176, 160, 138, al))
        dl = dl.filter(ImageFilter.GaussianBlur(5))
        out.alpha_composite(dl)
        frames.append(out)
    save_sheet(frames, 6, 'fx-muro.webp')


def make_ruins():
    FW, FH = 256, 192
    rng = np.random.default_rng(9)
    img = Image.new('RGBA', (FW * SS, FH * SS), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    # mancha de terra arrasada
    d.ellipse((24 * SS, 104 * SS, 232 * SS, 172 * SS), fill=(14, 9, 6, 175))
    img = img.filter(ImageFilter.GaussianBlur(10)); d = ImageDraw.Draw(img)
    # rachaduras escuras irradiando
    for k in range(9):
        a = rng.uniform(math.pi * .05, math.pi * .95) * (1 if k % 2 else -1) + (0 if k % 2 else math.pi)
        x, y = FW / 2 + rng.normal(0, 18), 142 + rng.normal(0, 6); pts = [(x * SS, y * SS)]
        for _ in range(7):
            a += rng.normal(0, .35); x += math.cos(a) * 10; y += math.sin(a) * 4.5; pts.append((x * SS, y * SS))
        d.line(pts, fill=(14, 10, 8, 235), width=2 * SS)
    # pedras caídas
    for _ in range(60):
        x = FW / 2 + rng.normal(0, 56); y = 144 + rng.normal(0, 12); w, h = rng.uniform(7, 17), rng.uniform(5, 12); rot = rng.uniform(-.7, .7)
        corners = [(-w / 2, -h / 2), (w / 2, -h / 2), (w / 2 + rng.uniform(-2, 2), h / 2), (-w / 2, h / 2)]
        ca, sa = math.cos(rot), math.sin(rot)
        pts = [((x + cx * ca - cy * sa) * SS, (y + cx * sa + cy * ca) * SS) for cx, cy in corners]
        d.polygon(pts, fill=stone_color(rng, .9), outline=(40, 34, 28, 255)); d.line([pts[0], pts[1]], fill=(176, 166, 150, 255), width=SS)
    img.resize((FW, FH), Image.LANCZOS).save(os.path.join(OUT, 'fx-ruinas.webp'), quality=90, method=6)
    print('fx-ruinas.webp')


if __name__ == '__main__':
    only = set(sys.argv[1:])
    if not only or {'bandeira', 'plantar', 'cair'} & only: make_flags()
    if not only or 'muro' in only: make_wall()
    if not only or 'ruinas' in only: make_ruins()
