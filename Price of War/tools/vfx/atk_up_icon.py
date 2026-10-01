"""Animates the painted 'Ataque +' icon (art-prompts/reference/ui-effect-atk-up.jpg): the sword starts upright, lays itself
down to its drawn angle with a little overshoot, and when it lands the plus sign fades in softly with a warm halo and a few sparks.
The still is cut apart by code (background keyed out, the plus separated from the sword), so any later repaint of the same
icon can be dropped in and rebuilt:  python3 tools/vfx/atk_up_icon.py [preview]
   src/assets/fx-atk-up-sheet.webp   36 frames, 6 cols x 6 rows, 256x256, transparent (plays once, ends on the original image)"""
import sys, math
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = 'art-prompts/reference/ui-effect-atk-up.jpg'
BG = 114.0
im = np.asarray(Image.open(SRC).convert('RGB')).astype(float)
H, W, _ = im.shape
dist = np.abs(im - BG).max(axis=2)

# ── key out the flat gray, keeping everything enclosed by the artwork opaque ──
reach = dist < 70                                           # background plus soft glow, as long as it connects to the border
lab, n = ndi.label(reach)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
outside = np.isin(lab, list(border))
alpha = np.where(outside, np.clip((dist - 5) / 38, 0, 1), 1.0)
alpha = ndi.gaussian_filter(alpha, 0.6)
a3 = np.clip(alpha, 1e-3, 1)[..., None]
rgb = np.where(outside[..., None], np.clip((im - BG * (1 - a3)) / a3, 0, 255), im)   # un-mix the gray out of the glows
rgba = np.dstack([rgb, alpha * 255])

# ── split the plus from the sword ──
core = alpha > 0.6
cl, cn = ndi.label(ndi.binary_dilation(core, iterations=3))
sizes = ndi.sum(core, cl, range(1, cn + 1))
cents = ndi.center_of_mass(core, cl, range(1, cn + 1))
big = [i + 1 for i in np.argsort(sizes)[::-1][:2]]
plus_id = min(big, key=lambda i: cents[i - 1][1] + cents[i - 1][0])      # the one nearer the top-left corner
sword_id = [i for i in big if i != plus_id][0]
seeds = np.zeros((H, W), int); seeds[cl == plus_id] = 1; seeds[cl == sword_id] = 2
_, (iy, ix) = ndi.distance_transform_edt(seeds == 0, return_indices=True)
owner = seeds[iy, ix]                                                      # every soft pixel (glow, sparks) goes to the nearest part
plus_layer = rgba * (owner == 1)[..., None]
sword_layer = rgba * (owner == 2)[..., None]
sc = ndi.center_of_mass(sword_layer[..., 3] / 255); pc = ndi.center_of_mass(plus_layer[..., 3] / 255)
sword_c = (sc[1], sc[0]); plus_c = (pc[1], pc[0])
print('sword centre', [round(v) for v in sword_c], 'plus centre', [round(v) for v in plus_c])

def transform(layer, pivot, angle_deg, scale, dx=0, dy=0, alpha_mul=1.0):
    """rotate (PIL convention: +deg = counter-clockwise) and scale a premultiplied RGBA layer about `pivot`, then shift."""
    pm = layer.copy(); pm[..., :3] *= (pm[..., 3:4] / 255)
    t = math.radians(angle_deg); c, s = math.cos(t), math.sin(t)
    # output (x,y) -> input: undo shift, scale, rotation about pivot
    def inv(x, y):
        x0, y0 = x - pivot[0] - dx, y - pivot[1] - dy
        x1, y1 = x0 / scale, y0 / scale
        return (c * x1 - s * y1 + pivot[0], s * x1 + c * y1 + pivot[1])
    # affine coefficients (a,b,c,d,e,f): x_in = a x + b y + c ; y_in = d x + e y + f
    a = c / scale; b = -s / scale; d = s / scale; e = c / scale
    cx_ = pivot[0] - a * (pivot[0] + dx) - b * (pivot[1] + dy); cy_ = pivot[1] - d * (pivot[0] + dx) - e * (pivot[1] + dy)
    chans = []
    for k in range(4):
        ch = Image.fromarray(pm[..., k].astype(np.float32), 'F').transform((W, H), Image.AFFINE, (a, b, cx_, d, e, cy_), Image.BICUBIC)
        chans.append(np.asarray(ch))
    out = np.dstack(chans); al = np.clip(out[..., 3], 0, 255)
    rgb_ = np.where(al[..., None] > 0.5, out[..., :3] / np.clip(al[..., None] / 255, 1e-3, 1), 0)
    return np.dstack([np.clip(rgb_, 0, 255), al * alpha_mul])

def over(base, top):
    ta = top[..., 3:4] / 255; ba = base[..., 3:4] / 255
    oa = ta + ba * (1 - ta)
    orgb = (top[..., :3] * ta + base[..., :3] * ba * (1 - ta)) / np.clip(oa, 1e-3, 1)
    return np.dstack([orgb, oa[..., 0] * 255])

def add_light(img, mask, color, amount):
    """additive glow (screen-ish) in `color`, strength `amount`, over the image's alpha"""
    out = img.copy()
    out[..., :3] = np.clip(out[..., :3] + mask[..., None] * np.array(color) * amount, 0, 255)
    out[..., 3] = np.clip(np.maximum(out[..., 3], mask * 255 * min(1, amount * 1.3)), 0, 255)
    return out

ease = lambda x: x * x * (3 - 2 * x)
def back(x, k=2.2): return 1 + (k + 1) * (x - 1) ** 3 + k * (x - 1) ** 2
yy, xx = np.mgrid[0:H, 0:W].astype(float)
rs = np.random.default_rng(3)
spark_a = rs.uniform(0, 2 * math.pi, 14); spark_v = rs.uniform(110, 300, 14); spark_s = rs.uniform(5, 11, 14)
START = 45.0       # the painted sword leans 45 degrees; it begins upright, i.e. 45 degrees back
NF = 36
frames = []
for k in range(NF):
    t = k / (NF - 1)
    # sword: pop in upright (0..0.14), hold + tremble (..0.24), lay down with overshoot (0.24..0.60)
    appear = ease(min(1, t / 0.14))
    lay = min(1, max(0, (t - 0.24) / 0.36))
    angle = START * (1 - back(lay)) if lay > 0 else 0
    angle = START + (angle - START) * (1 if lay > 0 else 0)
    if lay == 0: angle = START + (math.sin(t * 140) * 1.2 if t > 0.14 else 0)
    scale = (0.55 + 0.37 * appear) + 0.08 * ease(lay)
    lift = -14 * math.sin(math.pi * min(1, max(0, (t - 0.14) / 0.14))) if t < 0.3 else 0
    sw = transform(sword_layer, sword_c, angle, scale, 0, lift, alpha_mul=appear)
    # a flash of heat along the blade when it lands
    land = math.exp(-((t - 0.62) / 0.05) ** 2)
    if land > 0.02:
        sw = add_light(sw, (sw[..., 3] / 255) * land, (255, 170, 80), 0.45)
    # plus: pops in from the landing (0.58..0.86): small, spinning, overshoot, then home
    pt = min(1, max(0, (t - 0.56) / 0.40))                  # the plus fades in slowly (0.56..0.96), it does not pop
    frame = sw
    if pt > 0:
        ps = 0.78 + 0.22 * ease(pt) + 0.06 * math.sin(math.pi * pt)      # eases up from a bit smaller, a tiny swell on the way
        pa = ease(min(1, pt / 0.85)) ** 1.2
        pl = transform(plus_layer, plus_c, 0, ps, 0, 8 * (1 - ease(pt)), alpha_mul=pa)
        frame = over(frame, pl)
        # a soft warm halo that breathes in with it, and a few sparks drifting up and away (no hard ring)
        halo = np.exp(-(np.hypot(xx - plus_c[0], yy - plus_c[1]) / (150 + 60 * pt)) ** 2) * math.sin(math.pi * min(1, pt)) * 0.35
        frame = add_light(frame, halo, (255, 190, 100), 1.0)
        for i in range(14):
            d = spark_v[i] * 0.55 * ease(pt)
            px = plus_c[0] + math.cos(spark_a[i]) * d; py = plus_c[1] + math.sin(spark_a[i]) * d - 60 * pt
            m = np.exp(-((xx - px) ** 2 + (yy - py) ** 2) / (2 * (spark_s[i] * (1 - 0.5 * pt)) ** 2)) * math.sin(math.pi * pt) ** 1.5
            frame = add_light(frame, m, (255, 190, 90), 1.0)
    frames.append(Image.fromarray(np.clip(frame, 0, 255).astype(np.uint8), 'RGBA').resize((256, 256), Image.LANCZOS))

COLS = 6; ROWS = 6
sheet = Image.new('RGBA', (COLS * 256, ROWS * 256), (0, 0, 0, 0))
for i, f in enumerate(frames): sheet.paste(f, ((i % COLS) * 256, (i // COLS) * 256))
sheet.save('src/assets/fx-atk-up-sheet.webp', quality=88, method=6)
Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), 'RGBA').resize((512, 512), Image.LANCZOS).save('/tmp/claude-0/atk_cutout.png')
print('sheet', sheet.size)

if len(sys.argv) > 1 and sys.argv[1] == 'preview':
    out = []
    for f in frames + [frames[-1]] * 14:
        bg = Image.new('RGBA', (560, 300), (23, 17, 11, 255))
        yy2, xx2 = np.mgrid[0:300, 0:560]
        disc = Image.new('RGBA', (240, 240), (0, 0, 0, 0)); d = np.zeros((240, 240, 4), np.uint8)
        r = np.hypot(np.mgrid[0:240, 0:240][0] - 120, np.mgrid[0:240, 0:240][1] - 120)
        d[..., :3] = np.array([30, 22, 12]); d[..., 3] = np.clip((118 - r) * 40, 0, 255); disc = Image.fromarray(d, 'RGBA')
        bg.alpha_composite(f.resize((240, 240), Image.LANCZOS), (20, 30))
        bg.alpha_composite(f.resize((74, 74), Image.LANCZOS), (330, 110))      # the size it has in the game
        bg.alpha_composite(f.resize((150, 150), Image.LANCZOS), (410, 75))
        out.append(bg.convert('RGB').quantize(96))
    out[0].save('/tmp/claude-0/atk_up_anim.gif', save_all=True, append_images=out[1:], duration=33, loop=0, optimize=True)
    print('gif ok')
