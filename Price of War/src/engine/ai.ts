// The opponent AI, built on the engine instead of next to it: it looks at a GameState and answers with
// the next Action it wants to take, exactly the way a human's taps become Actions. Because it only
// ever submits actions to the same applyAction as everyone else, it cannot break a rule — and the
// same brain plays a bot seat on a server, so a match against the AI is a match like any other.
//
// Call aiNextAction repeatedly (applying each result) until the turn passes; it returns
// { type: 'advance' } when it has nothing more to do in a phase.
import { getCardDef } from './catalog';
import {
  EQUIP_ALLOWED_TYPES, SOLDIER_TYPES, TARGETABLE_TACTICS, adjacentSlots, getMaxAttacksPerTurn,
  getValidAttackTargets, isCardDamaged, type Board, type TacticTargetKind,
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
    case 'Reposicionamento Rápido':
    case 'Reformar Linhas':
    case 'Avanço Coordenado':
      return null; // the AI does not reposition, so these have no use for it
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

  if (t.phase === 'preparacao') {
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
    // 4) Creatures, in hand order, front rows first.
    for (const card of me.hand) {
      if (!isSoldier(card) || !afford(card)) continue;
      const empty = UNIT_SLOTS.filter(i => !me.board[i]);
      if (empty.length === 0) break;
      const front = empty.filter(i => i <= 4);
      return { type: 'play', cardId: card.id, slot: randomOf(rand, front.length > 0 ? front : empty) };
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
    for (const i of UNIT_SLOTS) {
      const attacker = me.board[i];
      if (!attacker || attacker.atk <= 0) continue;
      if ((t.attackCounts[i] ?? 0) >= getMaxAttacksPerTurn(attacker)) continue;
      const targets = [...getValidAttackTargets(i, me.board, foe.board)];
      if (targets.length === 0) continue;
      return { type: 'attack', from: i, to: targets.includes(12) ? 12 : randomOf(rand, targets) };
    }
    return { type: 'advance' };
  }

  // Movimentação: the AI does not reposition.
  return { type: 'advance' };
};
