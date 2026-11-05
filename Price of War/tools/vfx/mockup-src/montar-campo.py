"""Monta os GIFs a partir dos quadros gravados por gravar-campo.cjs. Uso: python3 montar-campo.py <pasta-quadros> <pasta-gifs> [largura]"""
import sys, os, glob
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]; width = int(sys.argv[3]) if len(sys.argv) > 3 else 300; colors = int(sys.argv[4]) if len(sys.argv) > 4 else 128
os.makedirs(dst, exist_ok=True)
for d in sorted(os.listdir(src)):
    fs = sorted(glob.glob(os.path.join(src, d, '*.png')))
    if not fs: continue
    # 20 quadros por segundo gravados; o GIF usa 15 (pega 3 de cada 4) para ficar menor
    fs = [fs[(k * 4) // 3] for k in range(len(fs) * 3 // 4)]
    rgb = []
    for f in fs:
        im = Image.open(f).convert('RGB'); h = round(im.height * width / im.width); rgb.append(im.resize((width, h), Image.LANCZOS))
    # uma paleta só para o GIF inteiro (paletas diferentes por quadro deixam o arquivo enorme)
    step = max(1, len(rgb) // 10); sample = rgb[::step][:10]
    strip = Image.new('RGB', (width, rgb[0].height * len(sample)))
    for i, s in enumerate(sample): strip.paste(s, (0, i * rgb[0].height))
    pal = strip.quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    frames = [r.quantize(palette=pal, dither=Image.Dither.NONE) for r in rgb]
    out = os.path.join(dst, d + '.gif')
    frames[0].save(out, save_all=True, append_images=frames[1:], duration=70, loop=0, optimize=True, disposal=2)
    print(out, os.path.getsize(out) // 1024, 'KB', len(frames), 'quadros')
