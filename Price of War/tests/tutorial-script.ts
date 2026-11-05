// Tutorial 1 "Seu primeiro duelo": the scripted duel, played straight through the real engine to prove that the
// script (fixed hands, fixed draws, the trainer's fixed moves) always ends with the player winning on turn 4.
//   npx tsx tests/tutorial-script.ts
import { BEATS, ENEMY_SCRIPT, PLAYER_PATH, STEPS, createTutorialMatch, playTutorialForTest } from '../src/tutorial/script';

const fail = (m: string) => { console.log('  ✗ ' + m); process.exit(1); };
const r = playTutorialForTest();
if (r.winner !== 0) fail(`the player must win on turn 4, winner = ${r.winner}`);
console.log(r.log.join(' | '));
const s = createTutorialMatch();
if (s.players[0].hand.length !== 7 || s.players[1].hand.length !== 7) fail('both start with 7 cards');
if (s.players[0].hand.some(c => !['Infantaria', 'Cavalaria'].includes(c.cardType ?? ''))) fail('the tutorial hand must only hold soldiers');
const ids = new Set<string>(); STEPS.forEach(st => { if (ids.has(st.id)) fail('duplicate step id ' + st.id); ids.add(st.id); });
Object.values(BEATS).flat().forEach(st => { if (ids.has(st.id)) fail('duplicate beat id ' + st.id); ids.add(st.id); });
STEPS.filter(st => st.kind === 'enemy').forEach((_, i) => { if (!ENEMY_SCRIPT[i + 1]) fail('no enemy script for turn ' + (i + 1)); });
if (PLAYER_PATH.length !== 4) fail('four player turns');
console.log('tutorial duel script OK: the player wins on their 4th turn');
