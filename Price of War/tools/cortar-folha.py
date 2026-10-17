"""Corta uma folha de ícones (grade LINHAS x COLUNAS) em arquivos quadrados, um por ícone.
Uso: python3 tools/cortar-folha.py folha.png LINHAS COLUNAS pasta-saida nome1 nome2 ... [--tam 512]
Os nomes seguem a ordem da leitura (esquerda para direita, de cima para baixo). Cada célula vira um webp quadrado."""
import sys, os
from PIL import Image
a = sys.argv[1:]
tam = 512
if '--tam' in a: i = a.index('--tam'); tam = int(a[i + 1]); del a[i:i + 2]
src, rows, cols, out, names = a[0], int(a[1]), int(a[2]), a[3], a[4:]
im = Image.open(src).convert('RGB'); W, H = im.size; cw, ch = W / cols, H / rows
os.makedirs(out, exist_ok=True)
for k, n in enumerate(names):
    r, c = divmod(k, cols)
    box = (round(c * cw), round(r * ch), round((c + 1) * cw), round((r + 1) * ch))
    cell = im.crop(box); s = min(cell.size); x = (cell.width - s) // 2; y = (cell.height - s) // 2
    cell.crop((x, y, x + s, y + s)).resize((tam, tam), Image.LANCZOS).save(os.path.join(out, n + '.webp'), 'WEBP', quality=90, method=6)
    print('ok', n)
