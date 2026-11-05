import { CARD_DEFS } from '../../src/engine/catalog';
import fs from 'fs';
const d: any = CARD_DEFS; const arr: any[] = Array.isArray(d) ? d : Object.values(d);
const out: any = {}; for (const c of arr) { const { name, cardType, effect, isFullArt, faction, trigger } = c; out[name] = { effect, isFullArt, faction, trigger }; }
fs.writeFileSync(process.argv[2] ?? 'defs.json', JSON.stringify(out));
console.log(Object.keys(out).length);
