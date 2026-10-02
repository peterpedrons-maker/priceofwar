// Tutorial 1 "Seu primeiro duelo": the scripted duel, played straight through the real engine to prove that the
// script (fixed hands, fixed draws, the trainer's fixed moves) always ends with the player winning on turn 4.
//   npx tsx tests/tutorial-script.ts
import { requireCardDef } from '../src/engine/catalog';
import { applyAction, createMatch, deckSetupFromRecipe } from '../src/engine/game';
import type { Action, Card, GameEvent, GameState, Seat } from '../src/engine/types';
let n = 0;
const mk = (name: string): Card => { const d = requireCardDef(name); return { id: `t${++n}`, name: d.name, cardType: d.cardType, atk: d.atk, hp: d.hp, cost: d.cost, effect: d.effect }; };
let s = createMatch({ seed: 11, decks: [deckSetupFromRecipe('cardeal'), deckSetupFromRecipe('capitao')], first: 0 }).state;
const HAND0 = ['Devotos da Cruzada', 'Soldados da Ordem', 'Soldados da Ordem', 'Cavaleiro da Luz', 'Soldados da Ordem', 'Devotos da Cruzada', 'Soldados da Ordem'];
const PILE0 = ['Soldados da Ordem', 'Cavaleiro da Luz', 'Soldados da Ordem', 'Cavaleiro da Luz', 'Soldados da Ordem', 'Soldados da Ordem'];
const HAND1 = ['Soldados da Ordem', 'Devotos da Cruzada', 'Devotos da Cruzada', 'Soldados da Ordem', 'Devotos da Cruzada', 'Soldados da Ordem', 'Soldados da Ordem'];
const PILE1 = ['Soldados da Ordem', 'Devotos da Cruzada', 'Soldados da Ordem', 'Devotos da Cruzada', 'Soldados da Ordem', 'Soldados da Ordem'];
s.players[0].hand = HAND0.map(mk); s.players[0].drawPile = [...PILE0];
s.players[1].hand = HAND1.map(mk); s.players[1].drawPile = [...PILE1];
const log: string[] = [];
const run = (seat: Seat, a: Action) => {
  const r = applyAction(s, seat, a);
  if (r.ok === false) { console.log('REFUSED', seat, JSON.stringify(a), r.error); process.exit(1); }
  s = r.state; return r.events;
};
const hand = (seat: Seat, name: string) => { const c = s.players[seat].hand.find(h => h.name === name); if (!c) throw new Error('no ' + name + ' in hand ' + seat + ': ' + s.players[seat].hand.map(h => h.name)); return c.id; };
const play = (seat: Seat, name: string, slot: number) => run(seat, { type: 'play', cardId: hand(seat, name), slot } as Action);
const atk = (seat: Seat, from: number, to: number) => { const ev = run(seat, { type: 'attack', from, to } as Action); const d = ev.filter(e => e.t === 'damage' || e.t === 'destroyed' || e.t === 'reinforce' || e.t === 'shield_hit').map(e => JSON.stringify(e)); console.log(`   atk ${from}->${to}`, d.join(' ')); };
const adv = (seat: Seat) => run(seat, { type: 'advance' } as Action);
const show = (tag: string) => {
  const f = (b: (Card | null)[]) => b.slice(0, 12).map((c, i) => c ? `${i}:${c.name.split(' ')[0]}${c.atk}/${c.hp}${(c as any).shield ? 'S' + (c as any).shield : ''}` : null).filter(Boolean).join(' ');
  console.log(`[${tag}] r${s.turn.round} P0 gold${s.players[0].gold} hp${s.players[0].board[12]?.hp} | ${f(s.players[0].board)}\n        P1 gold${s.players[1].gold} genhp${s.players[1].board[12]?.hp} | ${f(s.players[1].board)}`);
};
const begin = run(0, { type: 'begin' } as Action);
console.log('hand after begin', s.players[0].hand.length, 'phase', s.turn.phase); show('start');
// ---------- T1 player
play(0, 'Devotos da Cruzada', 1); play(0, 'Soldados da Ordem', 6); play(0, 'Cavaleiro da Luz', 3);
show('P T1 prep'); adv(0); /* movimentacao */ adv(0); show('P T1 end');
// ---------- T1 enemy
console.log('enemy phase', s.turn.phase, 'active', s.turn.active);
play(1, 'Soldados da Ordem', 1); play(1, 'Devotos da Cruzada', 3);
adv(1); // -> combate
atk(1, 1, 1); show('E T1 after attack');
adv(1); adv(1); adv(1); show('E T1 end');
// ---------- T2 player
console.log('--- T2 player gold', s.players[0].gold, 'hand', s.players[0].hand.map(h=>h.name).join(','));
play(0, 'Cavaleiro da Luz', 2); play(0, 'Soldados da Ordem', 7);
adv(0); // combate
atk(0, 2, 1); atk(0, 1, 12); atk(0, 3, 3); show('P T2 after combat');
adv(0); adv(0); adv(0);
// ---------- T2 enemy
play(1, 'Soldados da Ordem', 0); play(1, 'Soldados da Ordem', 5);
adv(1); atk(1, 0, 1); show('E T2 after attack');
adv(1); adv(1); adv(1);
// ---------- T3 player
console.log('--- T3 player gold', s.players[0].gold, 'hand', s.players[0].hand.map(h=>h.name).join(','));
adv(0);
atk(0, 1, 12); atk(0, 2, 12); atk(0, 3, 12); show('P T3 after combat');
adv(0); adv(0); run(0, { type: 'move', from: 7, to: 6 } as Action); adv(0);
// ---------- T3 enemy
play(1, 'Devotos da Cruzada', 2);
adv(1); atk(1, 0, 1); show('E T3 after attack');
adv(1); adv(1); adv(1);
// ---------- T4 player
console.log('--- T4 player');
adv(0);
atk(0, 2, 2); atk(0, 3, 12); atk(0, 1, 12); show('P T4 after combat'); console.log('winner', s.winner);
if (s.winner !== 0) { console.log('SCRIPT BROKEN: the player must win on turn 4'); process.exit(1); }
console.log('tutorial duel script OK: player wins on their 4th turn');
