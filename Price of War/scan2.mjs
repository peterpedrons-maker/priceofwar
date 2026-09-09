// Deep scan to find the center of each badge circle precisely
import { Jimp } from 'jimp';
import { readFile } from 'fs/promises';

const buf = await readFile('src/assets/template.png');
const img = await Jimp.fromBuffer(buf);
const W = img.width, H = img.height;

// Frame rectangle (mid-edge scan from previous session)
const FL=58, FT=129, FR=963, FB=1416;
const FW=FR-FL;  // 905
const FH=FB-FT;  // 1287

// Helper: convert PNG pixel to frame-relative percentage
const px2pctX = x => ((x - FL) / FW * 100).toFixed(2);
const px2pctY = y => ((y - FT) / FH * 100).toFixed(2);

// Find darkest (most non-background) pixels in a region to locate the circle centers
function findCircleCenter(x0, y0, x1, y1, label) {
  // Collect pixels that are clearly NOT the beige parchment background
  // Background is roughly RGBA(197,181,153) - we want darker/stronger pixels
  let pixels = [];
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const c = img.getPixelColor(x, y);
      const r = (c >>> 24) & 0xff;
      const g = (c >>> 16) & 0xff;
      const b = (c >>> 8)  & 0xff;
      const a = c & 0xff;
      if (a < 100) continue; // transparent
      // "Darkness" score: darker pixels = badge/circle
      const darkness = 255 - (r * 0.3 + g * 0.59 + b * 0.11);
      if (darkness > 60) pixels.push({ x, y, darkness });
    }
  }
  if (!pixels.length) { console.log(label, 'no dark pixels'); return; }

  // Weighted centroid by darkness
  let sw = 0, sx = 0, sy = 0;
  for (const p of pixels) { sx += p.x * p.darkness; sy += p.y * p.darkness; sw += p.darkness; }
  const cx = sx / sw, cy = sy / sw;

  // Bounding box of these dark pixels
  const xs = pixels.map(p=>p.x), ys = pixels.map(p=>p.y);
  const bx0=Math.min(...xs), bx1=Math.max(...xs), by0=Math.min(...ys), by1=Math.max(...ys);

  console.log(`\n=== ${label} ===`);
  console.log(`Centroid PNG px: (${Math.round(cx)}, ${Math.round(cy)})`);
  console.log(`Centroid frame%: left=${px2pctX(cx)}%, top=${px2pctY(cy)}%`);
  console.log(`BBox PNG: (${bx0},${by0}) -> (${bx1},${by1})`);
  console.log(`BBox frame%: left=${px2pctX(bx0)}%, top=${px2pctY(by0)}%, right=${((FR-bx1)/FW*100).toFixed(2)}%, bottom=${((FB-by1)/FH*100).toFixed(2)}%`);
  console.log(`BBox size: w=${((bx1-bx0)/FW*100).toFixed(2)}%, h=${((by1-by0)/FH*100).toFixed(2)}%`);
}

// Scan each quadrant for the badge circles
findCircleCenter(820, 100, W,  280, 'MANA (top-right circle)');
findCircleCenter(58,  1100, 320, H, 'ATK  (bottom-left circle)');
findCircleCenter(700, 1100, W,   H, 'HP   (bottom-right circle)');

// Name plate area
findCircleCenter(58, 129, 870, 310, 'NAME plate');

// Effect text area center
{
  const by0=829, by1=1215, bx0=61, bx1=956;
  console.log(`\n=== EFFECT text area ===`);
  console.log(`top=${px2pctY(by0)}%, bottom=${((FB-by1)/FH*100).toFixed(2)}%, left=${px2pctX(bx0)}%, right=${((FR-bx1)/FW*100).toFixed(2)}%`);
}
