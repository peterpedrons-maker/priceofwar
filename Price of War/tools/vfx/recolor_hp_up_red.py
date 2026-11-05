"""Turn the green heart of the HP-up icon (still + sheet) red, leaving the gold outline alone, and cut the text-sized icons
(sword and heart without their "+") used inline in card effect text. Run from the app dir: python3 tools/vfx/recolor_hp_up_red.py"""
import numpy as np
from PIL import Image

def to_red(rgba, target=8.0, width=60):
    a = np.asarray(rgba.convert('RGBA')).astype(float)
    hsv = np.asarray(Image.fromarray(a[..., :3].astype(np.uint8)).convert('HSV')).astype(float)
    m = (a[..., 3] > 0) & (hsv[..., 1] > 10)
    hue = hsv[..., 0] / 255 * 360
    green = m & (np.abs(hue - 140) < width)
    hsv[..., 0] = np.where(green, target / 360 * 255, hsv[..., 0])
    rgb = np.asarray(Image.fromarray(hsv.astype(np.uint8), 'HSV').convert('RGB')).astype(float)
    return Image.fromarray(np.dstack([rgb, a[..., 3]]).astype(np.uint8), 'RGBA')

def tight(img, thr=40):
    return img.crop(img.getchannel('A').point(lambda v: 255 if v > thr else 0).getbbox())

A = 'src/assets/'
for name in ('ui-effect-hp-up.webp', 'fx-hp-up-sheet.webp'):
    to_red(Image.open(A + name)).save(A + name, quality=92, method=6)

# text icons: last frame of each "up" sheet; the + sits to the right of the heart / top-left of the sword
sheet = Image.open(A + 'fx-hp-up-sheet.webp').convert('RGBA'); fs = sheet.width // 6
last = 29
heart = sheet.crop(((last % 6) * fs, (last // 6) * fs, (last % 6 + 1) * fs, (last // 6 + 1) * fs))
heart = np.asarray(heart).copy(); heart[:, int(fs * 0.595):, 3] = 0
tight(Image.fromarray(heart)).resize((96, 100), Image.LANCZOS).save(A + 'ui-icon-heart.webp', quality=92, method=6)

from scipy import ndimage
sheet = Image.open(A + 'fx-atk-up-sheet.webp').convert('RGBA'); fs = sheet.width // 6
last = 35
sword = np.asarray(sheet.crop(((last % 6) * fs, (last // 6) * fs, (last % 6 + 1) * fs, (last // 6 + 1) * fs))).copy()
lab, n = ndimage.label(sword[..., 3] > 40)
keep = 1 + int(np.argmax([(lab == i).sum() for i in range(1, n + 1)]))     # the blade is the biggest piece; the plus and the sparks go
sword[..., 3] = np.where(lab == keep, sword[..., 3], 0)
s = tight(Image.fromarray(sword)); s = s.resize((96, round(96 * s.height / s.width)), Image.LANCZOS)
s.save(A + 'ui-icon-sword.webp', quality=92, method=6)
