import { Jimp } from 'jimp';
import { readFile } from 'fs/promises';

const buf = await readFile('src/assets/template.png');
const img = await Jimp.fromBuffer(buf);
const W = img.width, H = img.height;
console.log('Size:', W, 'x', H);

const FL=58, FT=129, FR=963, FB=1416;
const FW=FR-FL, FH=FB-FT;

function centroid(x0,y0,x1,y1,label) {
  let sx=0,sy=0,n=0;
  for(let y=y0;y<y1;y++) {
    for(let x=x0;x<x1;x++) {
      const c = img.getPixelColor(x,y);
      const a = c & 0xff;
      if(a>200) { sx+=x; sy+=y; n++; }
    }
  }
  if(n===0){ console.log(label, 'no pixels'); return; }
  const cx=sx/n, cy=sy/n;
  console.log(
    label,
    'center px:', Math.round(cx), Math.round(cy),
    ' left%:', (((cx-FL)/FW)*100).toFixed(1),
    ' top%:', (((cy-FT)/FH)*100).toFixed(1),
    ' right%:', (((FR-cx)/FW)*100).toFixed(1),
    ' bottom%:', (((FB-cy)/FH)*100).toFixed(1)
  );
}

// Scan each badge quadrant
centroid(800, 0,    W,   220,  'MANA (top-right)');
centroid(0,   FB-220, 250, H,  'ATK  (bot-left)');
centroid(780, FB-220, W,   H,  'HP   (bot-right)');
centroid(FL,  FT,   800, FT+130, 'NAME (top)');

// Find bounding box of non-transparent pixels in a region
function bbox(x0,y0,x1,y1,label) {
  let minx=x1,maxx=x0,miny=y1,maxy=y0;
  for(let y=y0;y<y1;y++) for(let x=x0;x<x1;x++) {
    const a = img.getPixelColor(x,y) & 0xff;
    if(a>50) {
      if(x<minx) minx=x; if(x>maxx) maxx=x;
      if(y<miny) miny=y; if(y>maxy) maxy=y;
    }
  }
  console.log(label,'bbox px:', minx,miny,'→',maxx,maxy,
    ' left%:', (((minx-FL)/FW)*100).toFixed(1),
    ' top%:', (((miny-FT)/FH)*100).toFixed(1),
    ' right%:', (((FR-maxx)/FW)*100).toFixed(1),
    ' bottom%:', (((FB-maxy)/FH)*100).toFixed(1));
}

bbox(FL,  FT,   870, FT+160, 'NAME plate');
bbox(800, 0,    W,   240,    'MANA emblem');
bbox(0,   FB-240, 280, H,    'ATK emblem');
bbox(750, FB-240, W,  H,     'HP emblem');
bbox(FL, FT+130, FR, FT+700, 'ART area');
bbox(FL, FT+700, FR, FB-200, 'EFFECT text box');
