"""Converts the PNGs rendered by render-faces.cjs into the game's 3D textures (src/assets/card3d/<slug>.webp), and cuts the card back
to its own art (the source image has transparent margins: left in, the back would look smaller than the front, with the gold body
showing around it). Run from the app dir: python3 tools/card3d/to-webp.py [pngDir]"""
import sys, os, glob
from PIL import Image
src = sys.argv[1] if len(sys.argv) > 1 else 'tools/card3d/png'
dst = 'src/assets/card3d'; os.makedirs(dst, exist_ok=True)
for f in sorted(glob.glob(os.path.join(src, '*.png'))):
    im = Image.open(f).convert('RGBA'); w = 840
    im = im.resize((w, round(w * im.height / im.width)), Image.LANCZOS)
    im.save(os.path.join(dst, os.path.basename(f)[:-4] + '.webp'), 'WEBP', quality=82, method=6)
back = Image.open('src/assets/card-backplate.webp').convert('RGBA')
box = back.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
back = back.crop(box); back = back.resize((640, round(640 * back.height / back.width)), Image.LANCZOS)
back.save(os.path.join(dst, '_back.webp'), 'WEBP', quality=86, method=6)
print('faces', len(glob.glob(os.path.join(dst, '*.webp'))) - 1, 'back', back.size, 'aspect', round(back.width / back.height, 3))
