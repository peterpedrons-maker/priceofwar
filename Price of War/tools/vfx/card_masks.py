"""Exact card silhouettes, for effects that must follow the real outline of a card (wings, spikes, notched corners)
instead of a rounded rectangle.
   src/assets/mask-<name>.webp       the card's filled silhouette (the art window is filled in), white on transparent
   src/assets/mask-<name>-rim.webp   the same silhouette reduced to a soft band along its edge (for a rim light)
Built from the very frame images the board draws, so the masks line up with them when the effect uses the same box.
   python3 tools/vfx/card_masks.py"""
import numpy as np
from PIL import Image
from scipy.ndimage import binary_fill_holes, binary_closing, distance_transform_edt, gaussian_filter

FRAMES = {
    'gold': 'card-template-mini',
    'silver': 'card-template-silver-mini',
    'champagne': 'card-template-champagne-mini',
    'fullart-gold': 'card-template-fullart-gold',
    'fullart-tatica': 'card-fullart-frame-tatica',
    'fullart-emboscada': 'card-fullart-frame-emboscada',
    'hand-gold': 'card-template',               # the big card in hand / raised (tutorial highlights)
    'hand-silver': 'card-template-silver',
    'hand-champagne': 'card-template-champagne',
}
OUT_W = 384
for name, src in FRAMES.items():
    im = Image.open(f'src/assets/{src}.webp').convert('RGBA')
    h = round(im.height * OUT_W / im.width)
    a = np.asarray(im.resize((OUT_W, h), Image.LANCZOS))[..., 3].astype(float) / 255
    solid = binary_closing(a > 0.25, iterations=3)
    filled = binary_fill_holes(solid)
    soft = gaussian_filter(filled.astype(float), 0.9)                 # a hair of anti-aliasing on the edge
    mask = np.zeros((h, OUT_W, 4), np.uint8); mask[..., :3] = 255; mask[..., 3] = np.clip(soft * 255, 0, 255)
    Image.fromarray(mask, 'RGBA').save(f'src/assets/mask-{name}.webp', lossless=True, method=6)
    d = distance_transform_edt(filled)
    r = OUT_W * 0.030
    rim = np.clip(1 - d / r, 0, 1) ** 1.4 * filled
    rim_img = np.zeros((h, OUT_W, 4), np.uint8); rim_img[..., :3] = 255; rim_img[..., 3] = np.clip(gaussian_filter(rim, 0.7) * 255, 0, 255)
    Image.fromarray(rim_img, 'RGBA').save(f'src/assets/mask-{name}-rim.webp', lossless=True, method=6)
    print(name, (OUT_W, h), 'silhouette %.1f%%' % (filled.mean() * 100))
