// Número de coleção (0002UR) nas faces em 3D: as imagens de src/assets/card3d são a carta pronta e não trazem o número (ele muda com a raridade),
// então ele é escrito por cima do canto superior direito da caixa de efeito, o mesmo lugar onde a carta do jogo o mostra.
import * as THREE from 'three';

export const stampCode = (tex: THREE.Texture, code: string | undefined, full: boolean): THREE.Texture => {
  const im = tex.image as HTMLImageElement | undefined;
  if (!code || !im || !im.width) return tex;
  const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
  const g = c.getContext('2d'); if (!g) return tex;
  g.drawImage(im as CanvasImageSource, 0, 0);
  const k = c.width / 840, x = (full ? 692 : 702) * k, y = (full ? 727 : 716) * k;
  g.font = `800 ${Math.round(19 * k)}px Cinzel, serif`; g.textAlign = 'right'; g.textBaseline = 'middle'; g.letterSpacing = `${Math.round(1.2 * k)}px`;
  if (full) { g.fillStyle = 'rgba(0,0,0,.8)'; g.fillText(code, x + k, y + k); g.fillStyle = '#e9d8a6'; } else { g.fillStyle = 'rgba(255,243,206,.55)'; g.fillText(code, x, y + k); g.fillStyle = '#4a3010'; }
  g.globalAlpha = .85; g.fillText(code, x, y);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = tex.anisotropy; tex.dispose(); return t;
};
