// The opponent AI, built on the engine instead of next to it: it looks at a GameState and answers with
// the next Action it wants to take, exactly the way a human's taps become Actions. Because it only
// ever submits actions to the same applyAction as everyone else, it cannot break a rule — and the
// same brain plays a bot seat on a server, so a match against the AI is a match like any other.
//
// Call aiNextAction repeatedly (applying each result) until the turn passes; it returns
// { type: 'advance' } when it has nothing more to do in a phase.
import { getCardDef } from './catalog';
import { combatOpen } from './game';
import {
  EQUIP_ALLOWED_TYPES, SOLDIER_TYPES, TARGETABLE_TACTICS, adjacentSlots, canReposition, getEffectiveAtk,
  getIncomingDamageReduction, getLaneCol, getMaxAttacksPerTurn, getValidAttackTargets, isCardDamaged,
  type Board, type TacticTargetKind,
} from './rules';
import type { Action, Card, GameState, Seat } from './types';
import { otherSeat } from './types';

export type Rand = () => number;

const randomOf = <T,>(rand: Rand, items: readonly T[]): T => items[Math.floor(rand() * items.length)];

const weakest = (board: Board, slots: number[]): number =>
  slots.reduce((a, b) => (board[a]!.hp <= board[b]!.hp ? a : b));

const UNIT_SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const isSoldier = (c: { cardType?: string }) => SOLDIER_TYPES.includes(c.cardType as never);

// A rough "how much do I want to keep this card" score, used for picks and for discards.
const cardValue = (c: { name: string; cardType?: string; atk: number; hp: number; cost: number }): number => {
  if (isSoldier(c)) return c.atk * 1.2 + c.hp + c.cost * 0.2;
  if (c.cardType === 'Relíquia' || c.cardType === 'Terreno') return 6;
  if (c.cardType === 'Emboscada') return 3.5;
  if (c.cardType === 'Tática') return 3 + c.cost * 0.5;
  return 1;
};

const unitWorth = (c: Card) => c.atk * 1.2 + c.hp;

// ── How good is a formation? ────────────────────────────────────────────────
// One number for "how well is this side's board arranged", used to decide where to put new units, which
// reposition is worth making, and whether a card like Reformar Linhas pays off.
const isRangedType = (c: { cardType?: string }) => c.cardType === 'Arqueiro' || c.cardType === 'Artilharia';

const boardScore = (me: Board, foe: Board): number => {
  let score = 0;
  const foeThreat = UNIT_SLOTS.some(i => foe[i] && foe[i]!.atk > 0);
  for (const i of UNIT_SLOTS) {
    const u = me[i];
    if (!u) continue;
    const front = i <= 4;
    const worth = u.atk * 1.2 + u.hp;
    if (u.atk > 0) {
      if (u.cardType === 'Infantaria') score += front ? 2.5 : -2.5;   // Infantaria in the back cannot attack at all
      else if (isRangedType(u)) score += front ? -1 : 1.2;             // archers shoot from behind cover
      else score += front ? 0.8 : 0.2;
    } else if (front) {
      score += u.hp >= 3 ? 0.8 : 0.2;                                   // a wall for the rest
    }
    if (front) score += u.hp >= 4 ? 1.2 : u.hp <= 2 ? -1.2 : 0;         // tough at the front, fragile behind
    else if (u.hp <= 2) score += 0.6;
    // A back-row unit whose front slot is empty can be hit directly.
    if (!front && !me[i - 5] && foeThreat) score -= 0.12 * worth;
    // Facing an enemy card: good if it wins the exchange, bad if it loses.
    const facing = front ? foe[i] : null;
    if (facing) {
      if (u.hp > facing.atk && u.atk >= facing.hp) score += 1;
      else if (u.hp <= facing.atk && u.atk < facing.hp) score -= 1;
    }
  }
  // The General sits behind column 2 (and the Relíquia/Terreno behind columns 1/3): an empty lane exposes them.
  if (foeThreat) {
    if (!me[2] && !me[7]) score -= 7;
    if (me[10] && !me[1] && !me[6]) score -= 1.5;
    if (me[11] && !me[3] && !me[8]) score -= 1.5;
  }
  return score;
};

const swapped = (board: Board, a: number, b: number): Board => {
  const next = [...board];
  [next[a], next[b]] = [next[b], next[a]];
  return next;
};

interface MoveOption { from: number; to: number; delta: number }

// Every reposition the rules allow right now, with how much better (or worse) it makes the formation.
const moveOptions = (s: GameState, seat: Seat, only?: number): MoveOption[] => {
  const me = s.players[seat].board;
  const foe = s.players[otherSeat(seat)].board;
  const t = s.turn;
  const free = only !== undefined; // Batedor's free move is not limited by "already moved"
  const base = boardScore(me, foe);
  const aurelion = me[12]?.name === 'Comandante Aurelion, Mestre da Formação' && t.moved.length < 2;
  const out: MoveOption[] = [];
  for (const from of UNIT_SLOTS) {
    const u = me[from];
    if (!u || (free && from !== only)) continue;
    if (!free && t.moved.includes(from) && t.bonusRepositions <= 0) continue;
    for (const to of UNIT_SLOTS) {
      if (!canReposition(u, from, to)) continue;
      const after = swapped(me, from, to);
      let delta = boardScore(after, foe) - base;
      if (u.name === 'Capitão de Formação') delta += 0.5 * adjacentSlots(to).filter(j => after[j]).length; // buffs the neighbours' ATK
      if (aurelion && !free) delta += 0.6;                                                                    // Aurelion's +1/+1 for movers
      out.push({ from, to, delta });
    }
  }
  return out;
};

const bestMove = (s: GameState, seat: Seat, threshold: number, only?: number): MoveOption | null => {
  const options = moveOptions(s, seat, only).filter(o => o.delta >= threshold);
  return options.length ? options.reduce((a, b) => (b.delta > a.delta ? b : a)) : null;
};

// How much better would the formation get with this many repositions (each unit moving at most once, plus
// `bonus` extra moves)? Simulated greedily on a copy — used to decide if Reformar Linhas is worth a card.
const planGain = (s: GameState, seat: Seat, bonus: number): number => {
  let me: Board = [...s.players[seat].board];
  const foe = s.players[otherSeat(seat)].board;
  const moved = new Set<number>();
  let gain = 0;
  let extra = bonus;
  for (let step = 0; step < 12; step++) {
    const base = boardScore(me, foe);
    let best: MoveOption | null = null;
    for (const from of UNIT_SLOTS) {
      const u = me[from];
      if (!u || (moved.has(from) && extra <= 0)) continue;
      for (const to of UNIT_SLOTS) {
        if (!canReposition(u, from, to)) continue;
        const delta = boardScore(swapped(me, from, to), foe) - base;
        if (delta >= 0.75 && (!best || delta > best.delta)) best = { from, to, delta };
      }
    }
    if (!best) break;
    if (moved.has(best.from)) extra -= 1;
    me = swapped(me, best.from, best.to);
    moved.add(best.from); moved.add(best.to);
    gain += best.delta;
  }
  return gain;
};

// The empty slot where a new unit makes the formation best.
const bestSlot = (s: GameState, seat: Seat, card: Card, empty: number[], rand: Rand): number => {
  const me = s.players[seat].board;
  const foe = s.players[otherSeat(seat)].board;
  let best = empty[0];
  let bestScore = -Infinity;
  for (const slot of empty) {
    const next: Board = [...me];
    next[slot] = card;
    const score = boardScore(next, foe) + rand() * 0.01; // random tie-break
    if (score > bestScore) { bestScore = score; best = slot; }
  }
  return best;
};

// How good is this attack? Kills and General hits are worth a lot; trading a unit away for nothing is not.
const attackScore = (me: Board, foe: Board, from: number, to: number): number => {
  const a = me[from]!;
  const d = foe[to]!;
  const raw = Math.max(0, getEffectiveAtk(a, from, me, foe) - getIncomingDamageReduction(to, foe));
  const rawBack = Math.max(0, getEffectiveAtk(d, to, foe, me) - getIncomingDamageReduction(from, me));
  // An Escudo / Bloqueio on either side eats part (or all) of the blow before HP is touched.
  const soak = (card: { shield?: number; block?: boolean }, dmgIn: number) => (card.block ? 0 : Math.max(0, dmgIn - (card.shield ?? 0)));
  const dmg = soak(d, raw), back = soak(a, rawBack);
  const kills = dmg >= d.hp;
  const dies = back >= a.hp;
  let score = kills ? d.atk * 1.2 + d.hp + 2 : dmg * 0.6;
  score -= dies ? a.atk * 1.2 + a.hp : back * 0.4;
  if (to === 12) score += dmg * 1.5 + (kills ? 100 : 0);
  else if (to === 10 || to === 11) score += kills ? 1 : 0.3;
  return score;
};

// ── Which Tática to play, on what ───────────────────────────────────────────
// Returns the action to send, or null when the card has no worthwhile use right now. `gold` is what is left to spend.
const tacticPlay = (s: GameState, seat: Seat, card: Card, rand: Rand): Action | null => {
  const me = s.players[seat];
  const foe = s.players[otherSeat(seat)];
  const play = (target?: number): Action => ({ type: 'play', cardId: card.id, target });
  const enemyUnits = UNIT_SLOTS.filter(i => foe.board[i]);
  const ownUnits = UNIT_SLOTS.filter(i => me.board[i]);

  switch (card.name) {
    case 'Tributo de Guerra':
      return play();
    case 'Trabuco de Cerco': {
      // 2 damage to every enemy unit and the General: worth it when it kills something or hits a crowd.
      const hit = [...enemyUnits, 12].filter(i => foe.board[i]);
      const kills = hit.filter(i => foe.board[i]!.hp <= 2).length;
      return kills >= 1 && hit.length >= 3 || kills >= 2 || hit.length >= 5 ? play() : null;
    }
    case 'Balestra de Precisão': {
      const killable = enemyUnits.filter(i => foe.board[i]!.hp <= 3);
      if (killable.length === 0) return null;
      return play(killable.reduce((a, b) => (unitWorth(foe.board[a]!) >= unitWorth(foe.board[b]!) ? a : b)));
    }
    case 'Catapulta de Guerra': {
      const rows = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9]].map(row => {
        const units = row.filter(i => foe.board[i]);
        return { slot: row[0], count: units.length, kills: units.filter(i => foe.board[i]!.hp <= 2).length };
      });
      const best = rows.reduce((a, b) => (b.kills * 2 + b.count > a.kills * 2 + a.count ? b : a));
      return best.kills >= 1 && best.count >= 2 || best.count >= 3 ? play(best.slot) : null;
    }
    case 'Linha Fechada': {
      // Stamp the neighbours of the unit that has the most allies around it.
      const scored = ownUnits.map(i => ({ i, n: adjacentSlots(i).filter(j => me.board[j]).length })).filter(x => x.n >= 2);
      return scored.length ? play(scored.reduce((a, b) => (b.n > a.n ? b : a)).i) : null;
    }
    case 'Ordem de Retirada': {
      const hurt = [0, 1, 2, 3, 4].filter(i => me.board[i] && !me.board[i + 5] && isCardDamaged(me.board[i]!));
      return hurt.length ? play(weakest(me.board, hurt)) : null;
    }
    case 'Reformar Linhas':
      // +3 extra repositions this turn: worth a card when the formation can really improve with them.
      return planGain(s, seat, 3) - planGain(s, seat, 0) >= 1.5 ? play() : null;
    case 'Avanço Coordenado': {
      // +2 ATK to a unit that already moved this turn (only playable in Movimentação, after moving).
      if (s.turn.phase !== 'movimentacao') return null;
      const movers = s.turn.moved.filter(i => me.board[i] && i <= 9 && me.board[i]!.atk > 0);
      return movers.length ? play(movers.reduce((a, b) => (me.board[b]!.atk > me.board[a]!.atk ? b : a))) : null;
    }
    case 'Reposicionamento Rápido': {
      // Pull the only blocker out of the enemy General's lane — when I have hitters ready to use the opening.
      if (!combatOpen(s) || !foe.board[12]) return null;
      const blockers = [2, 7].filter(i => foe.board[i]);
      if (blockers.length !== 1) return null;
      const hitters = ownUnits.filter(i => {
        const u = me.board[i]!;
        if (u.atk < 2 || (u.cardType === 'Infantaria' && i > 4)) return false;
        return isRangedType(u) || Math.abs(getLaneCol(i) - 2) <= 1;
      });
      const free = adjacentSlots(blockers[0]).filter(j => !foe.board[j]);
      const opens = free.filter(j => j !== 2 && j !== 7);   // landing back in the lane would not help
      return hitters.length > 0 && free.length > 0 && opens.length / free.length >= 0.6 ? play(blockers[0]) : null;
    }
    case 'Armadura de Guerra':
    case 'Couraça Reforçada':
    case 'Flechas Venenosas':
    case 'Espada Longa': {
      const kind = TARGETABLE_TACTICS[card.name] as TacticTargetKind;
      const allowed = EQUIP_ALLOWED_TYPES[kind];
      // Best on a front-row unit that can actually fight.
      const targets = ownUnits.filter(i => allowed.includes(me.board[i]!.cardType) && i <= 4);
      if (targets.length === 0) return null;
      return play(targets.reduce((a, b) => (unitWorth(me.board[b]!) > unitWorth(me.board[a]!) ? b : a)));
    }
    case 'Retorno do Soldado':
      return me.graveyard.some(isSoldier) ? play() : null;
    case 'Graal da Dádiva':
      return me.deckList.some(n => { const t = getCardDef(n)?.cardType; return t === 'Terreno' || t === 'Relíquia'; }) && me.hand.length <= 9 ? play() : null;
    case 'Doutrina Renovada':
      return me.hand.length <= 8 && me.deckList.some(n => getCardDef(n)?.cardType === 'Tática') ? play() : null;
    case 'Recrutamento Seletivo':
    case 'Recrutar Veteranos':
      return me.hand.length <= 8 ? play() : null;
    case 'Chamado às Armas': {
      const free = [0, 1, 2, 3, 4].filter(i => !me.board[i]).length;
      const has = me.deckList.some(n => { const d = getCardDef(n)!; return isSoldier(d) && d.atk === 0; });
      return free >= 1 && has ? play() : null;
    }
    default:
      void rand;
      return null;
  }
};

// ── Picks and discards ──────────────────────────────────────────────────────
const bestIds = (cards: Card[], n: number) => [...cards].sort((a, b) => cardValue(b) - cardValue(a)).slice(0, n).map(c => c.id);

export const aiNextAction = (state: GameState, seat: Seat, rand: Rand = Math.random): Action => {
  const me = state.players[seat];
  const foe = state.players[otherSeat(seat)];
  const t = state.turn;

  // Answering a prompt comes first.
  const pend = state.pending;
  if (pend && pend.seat === seat) {
    if (pend.kind === 'ambush') {
      const attacker = state.players[pend.attacker].board[pend.from];
      const defender = me.board[pend.to];
      const options = me.hand.filter(h => pend.options.includes(h.id));
      // Spring it only when the hit would otherwise kill the unit.
      if (attacker && defender && options.length > 0 && defender.hp - attacker.atk <= 0) return { type: 'ambush', cardId: options[0].id };
      return { type: 'ambush', cardId: null };
    }
    if (pend.kind === 'discard') {
      // Throw away the cards it values least.
      const worst = [...me.hand].sort((a, b) => cardValue(a) - cardValue(b)).slice(0, pend.count).map(c => c.id);
      return { type: 'discard', cardIds: worst };
    }
    // A search/reveal: keep the best the prompt allows.
    return { type: 'choose', cardIds: bestIds(pend.options, Math.max(pend.min, Math.min(pend.max, pend.options.length))) };
  }

  if (t.phase === 'preparacao' || t.phase === 'pos_combate') {
    const afterCombat = t.phase === 'pos_combate';
    // 1) Cardeal Pedro: pay 2 gold to heal the weakest ally (a deliberate trade-off, once per turn).
    const general = me.board[12];
    if (general?.name === 'Cardeal Pedro, Voz da Fé' && me.generalAbilityUses < 1 && !me.generalAbilityBlocked && me.gold >= 2) {
      const allies = UNIT_SLOTS.filter(i => me.board[i]);
      if (allies.length > 0) return { type: 'ability', slot: 12, target: weakest(me.board, allies) };
    }
    // 2) Once-per-turn creature abilities.
    for (const i of UNIT_SLOTS) {
      const card = me.board[i];
      if (!card || t.activated.includes(card.id)) continue;
      if (card.name === 'Mercador da Cruzada') return { type: 'ability', slot: i };
      if (card.name === 'Cavaleiro Hospitalário') {
        const damaged = UNIT_SLOTS.filter(j => me.board[j] && isCardDamaged(me.board[j]!));
        const enemyFront = [0, 1, 2, 3, 4].filter(j => foe.board[j]);
        if (damaged.length === 0 && enemyFront.length === 0) continue;
        return {
          type: 'ability', slot: i,
          target: damaged.length > 0 ? weakest(me.board, damaged) : undefined,
          target2: enemyFront.length > 0 ? randomOf(rand, enemyFront) : undefined,
        };
      }
    }

    const afford = (c: Card) => c.cost <= me.gold;
    // 3) Free money, then removal that pays off, then the permanent auras.
    for (const card of me.hand) if (card.name === 'Tributo de Guerra') { const a = tacticPlay(state, seat, card, rand); if (a) return a; }
    for (const card of me.hand) {
      if (!afford(card) || card.cardType !== 'Tática') continue;
      if (!['Balestra de Precisão', 'Trabuco de Cerco', 'Catapulta de Guerra'].includes(card.name)) continue;
      const a = tacticPlay(state, seat, card, rand);
      if (a) return a;
    }
    for (const card of me.hand) {
      if (!afford(card)) continue;
      if (card.cardType === 'Relíquia' && !me.board[10]) return { type: 'play', cardId: card.id, slot: 10 };
      if (card.cardType === 'Terreno' && !me.board[11]) return { type: 'play', cardId: card.id, slot: 11 };
    }
    // 4) Creatures, in hand order, front rows first (not after combat: units cannot come out of the hand then).
    for (const card of afterCombat ? [] : me.hand) {
      if (!isSoldier(card) || !afford(card)) continue;
      const empty = UNIT_SLOTS.filter(i => !me.board[i]);
      if (empty.length === 0) break;
      return { type: 'play', cardId: card.id, slot: bestSlot(state, seat, card, empty, rand) };
    }
    // 5) With the board set, spend what is left on buffs, graveyard/deck help and the rest.
    for (const card of me.hand) {
      if (card.cardType !== 'Tática' || !afford(card)) continue;
      if (['Balestra de Precisão', 'Trabuco de Cerco', 'Catapulta de Guerra', 'Tributo de Guerra'].includes(card.name)) continue;
      const a = tacticPlay(state, seat, card, rand);
      if (a) return a;
    }
    return { type: 'advance' };
  }

  if (t.phase === 'combate') {
    // Batedor: its free move right after an attack — take it if the formation improves.
    if (t.batedorFree !== null) {
      const m = bestMove(state, seat, 0.4, t.batedorFree);
      if (m) return { type: 'move', from: m.from, to: m.to };
    }
    // Pick the best attack left (a kill, a hit on the General), skipping ones that only throw a unit away.
    let best: { from: number; to: number; score: number } | null = null;
    for (const i of UNIT_SLOTS) {
      const attacker = me.board[i];
      if (!attacker || attacker.atk <= 0) continue;
      if ((t.attackCounts[i] ?? 0) >= getMaxAttacksPerTurn(attacker)) continue;
      for (const to of getValidAttackTargets(i, me.board, foe.board)) {
        const score = attackScore(me.board, foe.board, i, to);
        if (!best || score > best.score) best = { from: i, to, score };
      }
    }
    if (best && best.score >= -1.5) return { type: 'attack', from: best.from, to: best.to };
    return { type: 'advance' };
  }

  // Movimentação: rearrange the formation while it pays off, then give a unit that moved the Avanço Coordenado bonus.
  const m = bestMove(state, seat, 0.75);
  if (m) return { type: 'move', from: m.from, to: m.to };
  for (const card of me.hand) {
    if (card.name !== 'Avanço Coordenado' || card.cost > me.gold) continue;
    const a = tacticPlay(state, seat, card, rand);
    if (a) return a;
  }
  return { type: 'advance' };
};
