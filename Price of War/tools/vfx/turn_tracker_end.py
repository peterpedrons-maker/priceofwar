"""The "Encerrar turno" segment that continues the turn tracker plate to the right: the plate's own right end cap mirrored
(so the two end caps back to back make the divider), the plate's outer border lines tiled in between, and the plate's right end cap
closing it. Writes the frame art and a full-shape mask. Run from the app dir: python3 tools/vfx/turn_tracker_end.py"""
import numpy as np
from PIL import Image, ImageOps

A = 'src/assets/'
END_W = 440      # on the plate's 1400 x 341 canvas
CAP = 62         # the end cap: corner ornaments and the inner frame's vertical edge (x 1338..1400 on the plate)
TILE = (1296, 1330)

def segment(src, tile_clear=None):
    im = Image.open(A + src).convert('RGBA')
    right = im.crop((1400 - CAP, 0, 1400, 341))
    left = ImageOps.mirror(right)
    tile = im.crop((TILE[0], 0, TILE[1], 341))
    if tile_clear:
        a = np.asarray(tile).copy(); a[tile_clear[0]:tile_clear[1], :, :] = 0; tile = Image.fromarray(a)
    out = Image.new('RGBA', (END_W, 341), (0, 0, 0, 0))
    out.paste(left, (0, 0))
    x = CAP
    while x < END_W - CAP:
        out.alpha_composite(tile, (x, 0)); x += tile.width
    out.paste(right, (END_W - CAP, 0))
    return out

# the plate's art has inner lines (under the band) that must not run through the text: keep only the outer double border
art = segment('ui-turn-tracker-art.webp', tile_clear=(44, 296))
a = np.asarray(art).copy()
a[138:172, 36:CAP] = 0; a[138:172, END_W - CAP:END_W - 36] = 0      # the stubs of the inner frame's diagonals, left over from the band
art = Image.fromarray(a)
art.save(A + 'ui-turn-tracker-end-art.webp', quality=92, method=6)
neutral = segment('ui-turn-tracker-neutral.webp')
band = segment('ui-turn-tracker-band.webp')
full = np.maximum(np.asarray(neutral)[..., 3], np.asarray(band)[..., 3])
mask = Image.fromarray(np.dstack([np.full_like(full, 255)] * 3 + [full]).astype('uint8'), 'RGBA')
mask.save(A + 'ui-turn-tracker-end-mask.webp', quality=92, method=6)
bg = Image.new('RGBA', (END_W + 40 + 1400, 341), (60, 90, 60, 255))
bg.alpha_composite(Image.open(A + 'ui-turn-tracker-art.webp').convert('RGBA'), (0, 0))
bg.alpha_composite(art, (1400, 0))
bg.convert('RGB').save('/tmp/claude-0/-home-user-priceofwar/53582eeb-f6be-53f8-9656-e04ea703ad88/scratchpad/kw/end_seg_prev.png')
