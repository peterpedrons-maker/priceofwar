# Arte PROVISÓRIA dos Mercenários: uma imagem por carta (emblema do tipo sobre um fundo de couro e brasa), só para o deck funcionar no jogo
# até as artes reais chegarem (prompts em art-prompts/README.md, seção 5). Troque o arquivo por uma imagem real com o mesmo nome em src/assets/merc/.
#   npx tsx -e "import {CARD_DEFS,DECK_RECIPES} from './src/engine/catalog'; const r=DECK_RECIPES.mercenarios; const n=[r.general,...Object.keys(r.cards)]; console.log(JSON.stringify(n.map(x=>{const d=CARD_DEFS.find(c=>c.name===x)!;return {name:d.name,type:d.cardType,full:!!d.isFullArt}})))" > /tmp/merc-cards.json
#   python3 tools/mercenarios-arte-provisoria.py /tmp/merc-cards.json
import json, math, random, sys, unicodedata, re
from PIL import Image, ImageDraw, ImageFilter, ImageFont

def slug(name):
    s = unicodedata.normalize('NFD', name).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

PALETTE = {  # (topo, base, brilho)
    'Infantaria': ((70, 46, 30), (28, 18, 12), (214, 150, 70)),
    'Arqueiro':   ((56, 62, 34), (20, 24, 12), (190, 190, 90)),
    'Cavalaria':  ((88, 36, 28), (30, 12, 10), (230, 120, 80)),
    'Artilharia': ((62, 58, 66), (22, 20, 26), (240, 150, 60)),
    'Tática':     ((40, 50, 84), (14, 16, 30), (140, 170, 240)),
    'Emboscada':  ((64, 40, 84), (20, 12, 30), (190, 130, 230)),
    'Relíquia':   ((96, 74, 26), (30, 22, 8), (250, 215, 110)),
    'General':    ((98, 34, 30), (30, 10, 10), (250, 200, 100)),
}
GOLD = (233, 191, 90, 255)
DARK = (30, 20, 8, 255)

def emblem(d, kind, cx, cy, r):
    lw = max(4, int(r * 0.09))
    def line(a, b, w=lw, c=GOLD): d.line([a, b], fill=c, width=w)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=GOLD, width=lw)
    k = r * 0.62
    if kind in ('Infantaria', 'General'):
        line((cx - k, cy + k), (cx + k, cy - k)); line((cx - k, cy - k), (cx + k, cy + k))
        if kind == 'General':
            pts = [(cx - k, cy + k * .35), (cx - k * .7, cy - k * .55), (cx - k * .3, cy), (cx, cy - k * .8), (cx + k * .3, cy), (cx + k * .7, cy - k * .55), (cx + k, cy + k * .35)]
            d.polygon(pts, fill=GOLD, outline=DARK)
    elif kind == 'Arqueiro':
        d.arc([cx - k, cy - k, cx + k * .3, cy + k], 270, 90, fill=GOLD, width=lw)
        line((cx - k * .2, cy - k), (cx - k * .2, cy + k), w=max(2, lw // 2)); line((cx - k * .9, cy), (cx + k, cy)); line((cx + k, cy), (cx + k * .6, cy - k * .25)); line((cx + k, cy), (cx + k * .6, cy + k * .25))
    elif kind == 'Cavalaria':
        d.arc([cx - k, cy - k, cx + k, cy + k], 200, 340, fill=GOLD, width=lw * 2)
        line((cx - k * .95, cy - k * .15), (cx - k * .95, cy + k * .8)); line((cx + k * .95, cy - k * .15), (cx + k * .95, cy + k * .8))
    elif kind == 'Artilharia':
        d.ellipse([cx - k * .55, cy - k * .1, cx + k * .35, cy + k * .8], fill=GOLD)
        d.polygon([(cx - k * .1, cy - k * .15), (cx + k * .9, cy - k * .75), (cx + k * 1.0, cy - k * .45), (cx + k * .1, cy + k * .15)], fill=GOLD)
    elif kind == 'Tática':
        d.rounded_rectangle([cx - k * .75, cy - k * .9, cx + k * .75, cy + k * .9], radius=int(k * .2), outline=GOLD, width=lw)
        for i in (-.45, -.1, .25, .6): line((cx - k * .45, cy + k * i), (cx + k * .45, cy + k * i), w=max(2, lw // 2))
    elif kind == 'Emboscada':
        d.ellipse([cx - k, cy - k * .55, cx + k, cy + k * .55], outline=GOLD, width=lw); d.ellipse([cx - k * .3, cy - k * .3, cx + k * .3, cy + k * .3], fill=GOLD)
    elif kind == 'Relíquia':
        d.rounded_rectangle([cx - k * .8, cy - k * .9, cx + k * .8, cy + k * .9], radius=int(k * .12), outline=GOLD, width=lw)
        line((cx - k * .45, cy - k * .9), (cx - k * .45, cy + k * .9)); d.ellipse([cx - k * .05, cy - k * .25, cx + k * .55, cy + k * .35], outline=GOLD, width=max(3, lw // 2))

def make(size, kind, seed):
    w, h = size
    top, base, glow = PALETTE[kind]
    rnd = random.Random(seed)
    im = Image.new('RGB', size)
    px = im.load()
    for y in range(h):
        t = y / (h - 1)
        for x in range(w):
            g = math.exp(-(((x - w / 2) / (w * .55)) ** 2 + ((y - h * .52) / (h * .55)) ** 2) * 1.6)
            c = [int(top[i] * (1 - t) + base[i] * t + glow[i] * g * .30) for i in range(3)]
            px[x, y] = tuple(c)
    # fibras de couro / grão
    layer = Image.new('RGBA', size, (0, 0, 0, 0)); ld = ImageDraw.Draw(layer)
    for _ in range(int(w * h / 900)):
        x, y = rnd.randrange(w), rnd.randrange(h); l = rnd.randint(8, 34); a = rnd.randint(8, 26)
        ang = rnd.uniform(-.5, .5); ld.line([(x, y), (x + l * math.cos(ang), y + l * math.sin(ang))], fill=(0, 0, 0, a) if rnd.random() < .6 else (255, 220, 160, a // 2), width=1)
    im = Image.alpha_composite(im.convert('RGBA'), layer)
    # vinheta
    vig = Image.new('L', size, 0); vd = ImageDraw.Draw(vig)
    vd.ellipse([-w * .25, -h * .25, w * 1.25, h * 1.25], fill=255); vig = vig.filter(ImageFilter.GaussianBlur(min(w, h) * .18))
    black = Image.new('RGBA', size, (0, 0, 0, 255)); im = Image.composite(im, black, vig)
    r = min(w, h) * (.27 if h < w else .22)
    cy = h * (.46 if h > w else .5)
    disc = Image.new('RGBA', size, (0, 0, 0, 0))
    ImageDraw.Draw(disc).ellipse([w / 2 - r * 1.25, cy - r * 1.25, w / 2 + r * 1.25, cy + r * 1.25], fill=(0, 0, 0, 80))
    im = Image.alpha_composite(im.convert('RGBA'), disc.filter(ImageFilter.GaussianBlur(r * .25)))
    d = ImageDraw.Draw(im)
    emblem(d, kind, w / 2, cy, r)
    try: f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf', max(12, int(min(w, h) * .05)))
    except Exception: f = ImageFont.load_default()
    label = 'ARTE PROVISÓRIA'
    tw = d.textlength(label, font=f)
    d.text(((w - tw) / 2, h * (.86 if h > w else .84)), label, fill=(233, 191, 90, 190), font=f)
    return im.convert('RGB')

cards = json.load(open(sys.argv[1]))
for c in cards:
    size = (438, 608) if c['full'] else (656, 408)
    im = make(size, c['type'], hash(c['name']) & 0xffff)
    im.save(f"src/assets/merc/{slug(c['name'])}.webp", quality=82)
print(len(cards), 'imagens')
