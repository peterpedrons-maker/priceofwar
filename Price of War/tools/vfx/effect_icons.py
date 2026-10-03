"""The painted effect icons (art-prompts/reference/ui-effect-*.jpg), cut out and animated by code.
   Each still is keyed off its flat gray background and split into its parts (object / sign); the animation is rebuilt from
   those parts, so a repainted icon only has to be dropped over the file and this script re-run:
        python3 tools/vfx/effect_icons.py [preview]
   Output (src/assets):
     fx-<name>-sheet.webp   30 frames, 6 cols x 5 rows, 224x224, transparent: atk-down, hp-up, hp-down, reinforce, swap
     ui-effect-<name>.webp  the still cut out, 256x256 (for small permanent marks)
   '-down' icons are the same object with the sign rebuilt as a red MINUS cut from the painted plus (so no extra art is needed).
   (The sword's own sheet, fx-atk-up-sheet.webp, is made by atk_up_icon.py.)"""
import sys, math
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

REF = 'art-prompts/reference'
S = 1024
NF, COLS, ROWS, FS = 30, 6, 5, 224
ease = lambda x: x * x * (3 - 2 * x)
def back(x, k=1.9): return 1 + (k + 1) * (x - 1) ** 3 + k * (x - 1) ** 2
yy, xx = np.mgrid[0:S, 0:S].astype(float)

# ── cutting ───────────────────────────────────────────────────────────────────
def cutout(path):
    im = np.asarray(Image.open(path).convert('RGB')).astype(float)
    bg = np.median(np.concatenate([im[:40, :40].reshape(-1, 3), im[-40:, -40:].reshape(-1, 3), im[:40, -40:].reshape(-1, 3), im[-40:, :40].reshape(-1, 3)]), axis=0)
    dist = np.abs(im - bg).max(axis=2)
    reach = dist < 70
    lab, _ = ndi.label(reach)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    outside = np.isin(lab, list(border))
    alpha = np.where(outside, np.clip((dist - 12) / 38, 0, 1), 1.0)
    alpha = ndi.gaussian_filter(alpha, 0.6)
    a3 = np.clip(alpha, 1e-3, 1)[..., None]
    rgb = np.where(outside[..., None], np.clip((im - bg * (1 - a3)) / a3, 0, 255), im)
    return np.dstack([rgb, alpha * 255])

def split_two(rgba):
    """two biggest opaque parts -> (left part layer, right part layer, their centres); soft pixels go to the nearest part"""
    core = rgba[..., 3] > 235                      # solid pixels only: the glows of two neighbours would otherwise join them
    cl, cn = ndi.label(core)
    sizes = ndi.sum(core, cl, range(1, cn + 1))
    big = [i + 1 for i in np.argsort(sizes)[::-1][:2]]
    cents = {i: ndi.center_of_mass(core, cl, i) for i in big}
    left_id, right_id = sorted(big, key=lambda i: cents[i][1])
    seeds = np.zeros(core.shape, int); seeds[cl == left_id] = 1; seeds[cl == right_id] = 2
    _, (iy, ix) = ndi.distance_transform_edt(seeds == 0, return_indices=True)
    owner = seeds[iy, ix]
    out = []
    for k in (1, 2):
        layer = rgba * (owner == k)[..., None]
        c = ndi.center_of_mass(layer[..., 3] / 255)
        out.append((layer, (c[1], c[0])))
    return out

# ── compositing helpers ───────────────────────────────────────────────────────
def transform(layer, pivot, angle_deg=0.0, scale=1.0, dx=0.0, dy=0.0, alpha_mul=1.0):
    pm = layer.copy(); pm[..., :3] *= (pm[..., 3:4] / 255)
    t = math.radians(angle_deg); c, s = math.cos(t), math.sin(t)
    a = c / scale; b = -s / scale; d = s / scale; e = c / scale
    cx_ = pivot[0] - a * (pivot[0] + dx) - b * (pivot[1] + dy); cy_ = pivot[1] - d * (pivot[0] + dx) - e * (pivot[1] + dy)
    chans = [np.asarray(Image.fromarray(pm[..., k].astype(np.float32), 'F').transform((S, S), Image.AFFINE, (a, b, cx_, d, e, cy_), Image.BICUBIC)) for k in range(4)]
    out = np.dstack(chans); al = np.clip(out[..., 3], 0, 255)
    rgb_ = np.where(al[..., None] > 0.5, out[..., :3] / np.clip(al[..., None] / 255, 1e-3, 1), 0)
    return np.dstack([np.clip(rgb_, 0, 255), al * alpha_mul])

def over(base, top):
    ta = top[..., 3:4] / 255; ba = base[..., 3:4] / 255
    oa = ta + ba * (1 - ta)
    orgb = (top[..., :3] * ta + base[..., :3] * ba * (1 - ta)) / np.clip(oa, 1e-3, 1)
    return np.dstack([orgb, oa[..., 0] * 255])

def add_light(img, mask, color, amount):
    out = img.copy()
    out[..., :3] = np.clip(out[..., :3] + mask[..., None] * np.array(color) * amount, 0, 255)
    out[..., 3] = np.clip(np.maximum(out[..., 3], mask * 255 * min(1, amount * 1.3)), 0, 255)
    return out

def hue_rotate(layer, deg, around=None, width=50):
    """turn the hue by `deg`; with `around` (degrees) only colours within `width` of that hue move, so a gold outline stays gold"""
    rgb = np.clip(layer[..., :3], 0, 255).astype(np.uint8)
    hsv = np.asarray(Image.fromarray(rgb).convert('HSV')).astype(float)
    sat_ok = hsv[..., 1] > 40
    if around is not None:
        d = np.abs(((hsv[..., 0] / 255 * 360) - around + 540) % 360 - 180)
        sat_ok = sat_ok & (d < width)
    hsv[..., 0] = np.where(sat_ok, (hsv[..., 0] + deg / 360 * 255) % 255, hsv[..., 0])
    out = np.asarray(Image.fromarray(hsv.astype(np.uint8), 'HSV').convert('RGB')).astype(float)
    return np.dstack([out, layer[..., 3]])

def dominant_hue(layer):
    m = layer[..., 3] > 200
    hsv = np.asarray(Image.fromarray(np.clip(layer[..., :3], 0, 255).astype(np.uint8)).convert('HSV')).astype(float)
    sel = m & (hsv[..., 1] > 80)
    return np.median(hsv[..., 0][sel]) / 255 * 360 if sel.any() else 0.0

def minus_from_plus(plus, centre):
    """Rebuild the plus as a MINUS: keep its horizontal arm (rows around the centre), fill the middle where the vertical arm
    crossed with a tiled slice of the flat arm so the outline runs straight, fade the glow above/below, then turn it red."""
    A = plus[..., 3] > 150
    ys, xs = np.where(A)
    x0, x1 = xs.min(), xs.max(); cy = int(round(centre[1])); cx = int(round(centre[0]))
    ref_x = int(x0 + 0.12 * (x1 - x0))
    col = A[:, ref_x]; r0 = cy
    while r0 > 0 and col[r0 - 1]: r0 -= 1
    r1 = cy
    while r1 < S - 1 and col[r1 + 1]: r1 += 1
    thick = r1 - r0 + 1
    pad = 40
    band = plus[max(0, r0 - pad):r1 + pad + 1].copy()
    gap0, gap1 = cx - int(thick * 0.75), cx + int(thick * 0.75)
    for x in range(gap0, gap1):
        band[:, x] = band[:, ref_x]            # one flat column, repeated: no ribbing from the painted highlights
    rows = np.arange(band.shape[0]) + max(0, r0 - pad)
    d = np.where(rows < r0, r0 - rows, np.where(rows > r1, rows - r1, 0)).astype(float)
    band[..., 3] *= np.exp(-(d / 22) ** 2)[:, None]
    out = np.zeros_like(plus); out[max(0, r0 - pad):r1 + pad + 1] = band
    h = dominant_hue(plus)
    return hue_rotate(out, ((8 - h) + 540) % 360 - 180, around=h)    # land on a warm red; the gold outline is left alone

def static_and_sheet(name, rgba, frames, preview_pairs):
    still = Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), 'RGBA')
    still.resize((256, 256), Image.LANCZOS).save(f'src/assets/ui-effect-{name}.webp', quality=92, method=6)
    pil = [Image.fromarray(np.clip(f, 0, 255).astype(np.uint8), 'RGBA').resize((FS, FS), Image.LANCZOS) for f in frames]
    sheet = Image.new('RGBA', (COLS * FS, ROWS * FS), (0, 0, 0, 0))
    for i, f in enumerate(pil): sheet.paste(f, ((i % COLS) * FS, (i // COLS) * FS))
    sheet.save(f'src/assets/fx-{name}-sheet.webp', quality=88, method=6)
    return pil

def gif(name, pil_frames):
    out = []
    for f in pil_frames + [pil_frames[-1]] * 12:
        bg = Image.new('RGBA', (440, 260), (23, 17, 11, 255))
        bg.alpha_composite(f.resize((220, 220), Image.LANCZOS), (10, 20))
        bg.alpha_composite(f.resize((74, 74), Image.LANCZOS), (260, 100))
        bg.alpha_composite(f.resize((110, 110), Image.LANCZOS), (330, 80))
        out.append(bg.convert('RGB').quantize(128))
    out[0].save(f'/tmp/claude-0/{name}_anim.gif', save_all=True, append_images=out[1:], duration=33, loop=0, optimize=True)

# ── heart (+/-) ───────────────────────────────────────────────────────────────
def heart_frames(rgba, sign_layer, sign_c, heart, heart_c):
    frames = []
    for k in range(NF):
        t = k / (NF - 1)
        appear = ease(min(1, t / 0.14))
        pop = 0.55 + 0.45 * back(min(1, t / 0.18)) if t < 0.18 else 1.0
        beat = 1 + 0.15 * math.exp(-((t - 0.26) / 0.04) ** 2) + 0.10 * math.exp(-((t - 0.40) / 0.04) ** 2)
        h = transform(heart, heart_c, 0, pop * beat, 0, 0, alpha_mul=appear)
        flash = math.exp(-((t - 0.26) / 0.04) ** 2) * 0.5 + math.exp(-((t - 0.40) / 0.04) ** 2) * 0.3
        if flash > 0.02: h = add_light(h, (h[..., 3] / 255) * flash, (190, 255, 210), 0.5)
        frame = h
        pt = min(1, max(0, (t - 0.50) / 0.42))
        if pt > 0:
            ps = 0.8 + 0.2 * ease(pt) + 0.05 * math.sin(math.pi * pt)
            pa = ease(min(1, pt / 0.85)) ** 1.2
            pl = transform(sign_layer, sign_c, 0, ps, 0, 8 * (1 - ease(pt)), alpha_mul=pa)
            frame = over(frame, pl)
            halo = np.exp(-(np.hypot(xx - sign_c[0], yy - sign_c[1]) / (140 + 50 * pt)) ** 2) * math.sin(math.pi * pt) * 0.3
            frame = add_light(frame, halo, (190, 255, 210), 1.0)
        frames.append(frame)
    return frames

# ── shield (reforço) ──────────────────────────────────────────────────────────
def shield_frames(rgba):
    rgb = np.clip(rgba[..., :3], 0, 255)
    chev = ((rgb[..., 1] > 190) & (rgb[..., 2] > 200) & (rgba[..., 3] > 200)).astype(float)
    chev = ndi.binary_dilation(ndi.binary_opening(chev > 0.5, iterations=2), iterations=4).astype(float)
    chev = ndi.gaussian_filter(chev, 2.0)
    ys, xs = np.where(rgba[..., 3] > 200); c = (xs.mean(), ys.mean())
    cys = np.where(chev > 0.5)[0]; ytop, ybot = cys.min(), cys.max()
    frames = []
    for k in range(NF):
        t = k / (NF - 1)
        rise = min(1, t / 0.30)
        e = back(rise, 1.6)
        scale = 0.6 + 0.4 * e
        dy = (1 - e) * 150
        img = transform(rgba, c, 0, scale, 0, dy, alpha_mul=ease(min(1, t / 0.18)))
        # two light sweeps climbing the chevrons, bottom to top: the unit "advancing"
        for lo, hi in ((0.30, 0.62), (0.52, 0.86)):
            u = (t - lo) / (hi - lo)
            if 0 < u < 1:
                yc = ybot + 60 - (ybot - ytop + 120) * ease(u)
                band = np.exp(-((yy - yc) / 55) ** 2) * math.sin(math.pi * u)
                m = chev * band
                m2 = transform(np.dstack([np.zeros((S, S, 3)), m * 255]), c, 0, scale, 0, dy)[..., 3] / 255
                img = add_light(img, m2, (200, 245, 255), 1.1)
        frames.append(img)
    return frames

# ── swap arrows (mover) ───────────────────────────────────────────────────────
def swap_frames(rgba):
    ys, xs = np.where(rgba[..., 3] > 200); c = (xs.mean(), ys.mean())
    frames = []
    for k in range(NF):
        t = k / (NF - 1)
        appear = ease(min(1, t / 0.15))
        pop = 0.6 + 0.4 * back(min(1, t / 0.2)) if t < 0.2 else 1.0
        rot = 180 * ease(min(1, max(0, (t - 0.18) / 0.55)))
        swell = 1 + 0.08 * math.sin(math.pi * min(1, max(0, (t - 0.18) / 0.55)))
        img = transform(rgba, c, -rot, pop * swell, 0, 0, alpha_mul=appear)
        # the rotated end state is only symmetric up to the painted lighting: cross-fade back to the original
        fade = ease(min(1, max(0, (t - 0.70) / 0.22)))
        if fade > 0:
            orig = transform(rgba, c, 0, 1.0, 0, 0)
            img = over(img * np.array([1, 1, 1, 1 - fade]), orig * np.array([1, 1, 1, fade])) if False else np.dstack([img[..., :3] * (1 - fade) + orig[..., :3] * fade, img[..., 3] * (1 - fade) + orig[..., 3] * fade])
        glow = math.sin(math.pi * min(1, max(0, (t - 0.18) / 0.55)))
        if glow > 0.02: img = add_light(img, (img[..., 3] / 255) * glow * 0.35, (170, 240, 255), 0.5)
        frames.append(img)
    return frames

def main(preview=False):
    # heart: + and −
    rgba = cutout(f'{REF}/ui-effect-hp-up.jpg')
    (heart, hc), (plus, pc) = split_two(rgba)
    hp_up = heart_frames(rgba, plus, pc, heart, hc)
    minus = minus_from_plus(plus, pc)
    hp_down = heart_frames(rgba, minus, pc, heart, hc)
    p1 = static_and_sheet('hp-up', rgba, hp_up, None)
    rgba_dn = over(heart, minus)
    p2 = static_and_sheet('hp-down', rgba_dn, hp_down, None)
    # sword: only the minus version (the + sheet is made by atk_up_icon.py)
    srgba = cutout(f'{REF}/ui-effect-atk-up.jpg')
    (plus_s, pcs), (sword, sc) = split_two(srgba)       # plus is the one further left here
    # (atk_up_icon.py keeps its own sword animation; for the minus we reuse its timeline through this generic one)
    def sword_frames(sign, sign_c):
        START = 45.0; out = []
        for k in range(NF):
            t = k / (NF - 1)
            appear = ease(min(1, t / 0.14)); lay = min(1, max(0, (t - 0.24) / 0.36))
            angle = START * (1 - back(lay, 2.2)) if lay > 0 else START + (math.sin(t * 140) * 1.2 if t > 0.14 else 0)
            scale = (0.55 + 0.37 * appear) + 0.08 * ease(lay)
            sw = transform(sword, sc, angle, scale, 0, 0, alpha_mul=appear)
            land = math.exp(-((t - 0.62) / 0.05) ** 2)
            if land > 0.02: sw = add_light(sw, (sw[..., 3] / 255) * land, (255, 170, 80), 0.45)
            pt = min(1, max(0, (t - 0.56) / 0.40)); frame = sw
            if pt > 0:
                ps = 0.78 + 0.22 * ease(pt) + 0.06 * math.sin(math.pi * pt); pa = ease(min(1, pt / 0.85)) ** 1.2
                frame = over(frame, transform(sign, sign_c, 0, ps, 0, 8 * (1 - ease(pt)), alpha_mul=pa))
                halo = np.exp(-(np.hypot(xx - sign_c[0], yy - sign_c[1]) / (150 + 60 * pt)) ** 2) * math.sin(math.pi * pt) * 0.35
                frame = add_light(frame, halo, (255, 190, 100), 1.0)
            out.append(frame)
        return out
    minus_s = minus_from_plus(plus_s, pcs)
    atk_down = sword_frames(minus_s, pcs)
    p3 = static_and_sheet('atk-down', over(sword, minus_s), atk_down, None)
    Image.fromarray(np.clip(srgba, 0, 255).astype(np.uint8), 'RGBA').resize((256, 256), Image.LANCZOS).save('src/assets/ui-effect-atk-up.webp', quality=92, method=6)
    # shield and arrows
    rrgba = cutout(f'{REF}/ui-effect-reinforce.jpg')
    p4 = static_and_sheet('reinforce', rrgba, shield_frames(rrgba), None)
    mrgba = cutout(f'{REF}/ui-effect-move.jpg')
    p5 = static_and_sheet('swap', mrgba, swap_frames(mrgba), None)
    if preview:
        for n, p in (('hp_up', p1), ('hp_down', p2), ('atk_down', p3), ('reinforce', p4), ('swap', p5)): gif(n, p)
    print('done')

if __name__ == '__main__':
    main(len(sys.argv) > 1 and sys.argv[1] == 'preview')
