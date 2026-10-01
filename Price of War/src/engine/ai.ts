// The opponent AI, built on the engine instead of next to it: it looks at a GameState and answers with
// the next Action it wants to take, exactly the way a human's taps become Actions. Because it only
// ever submits actions to the same applyAction as everyone else, it cannot break a rule — and the
// same brain can play a bot seat on a server.
//
// Call aiNextAction repeatedly (applying each result) until the turn passes; it returns
// { type: 'advance' } when it has nothing more to do in a phase.
import { getMaxAttacksPerTurn, getValidAttackTargets, isCardDamaged } from './rules';
import type { Action, Card, GameState, Seat } from './types';
import { otherSeat } from './types';

export type Rand = () => number;

const randomOf = <T,>(rand: Rand, items: readonly T[]): T => items[Math.floor(rand() * items.length)];

const weakest = (board: (Card | null)[], slots: number[]): number =>
  slots.reduce((a, b) => (board[a]!.hp <= board[b]!.hp ? a : b));

const ownUnitSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

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
    // A pick: prefer real creatures over 0/0 cards, otherwise take what comes first.
    const ranked = [...pend.options].sort((a, b) => Number(b.cardType !== 'Tática' && b.cardType !== 'Emboscada') - Number(a.cardType !== 'Tática' && a.cardType !== 'Emboscada'));
    return { type: 'choose', cardIds: ranked.slice(0, Math.max(pend.min, Math.min(pend.max, ranked.length))).map(c => c.id) };
  }

  if (t.phase === 'preparacao') {
    // 1) Cardeal Pedro: pay 2 gold to heal the weakest ally (a deliberate trade-off, once per turn).
    const general = me.board[12];
    if (general?.name === 'Cardeal Pedro, Voz da Fé' && me.generalAbilityUses < 1 && !me.generalAbilityBlocked && me.gold >= 2) {
      const allies = ownUnitSlots.filter(i => me.board[i]);
      if (allies.length > 0) return { type: 'ability', slot: 12, target: weakest(me.board, allies) };
    }
    // 2) Once-per-turn creature abilities.
    for (const i of ownUnitSlots) {
      const card = me.board[i];
      if (!card || t.activated.includes(card.id)) continue;
      if (card.name === 'Mercador da Cruzada') return { type: 'ability', slot: i };
      if (card.name === 'Cavaleiro Hospitalário') {
        const damaged = ownUnitSlots.filter(j => me.board[j] && isCardDamaged(me.board[j]!));
        const enemyFront = [0, 1, 2, 3, 4].filter(j => foe.board[j]);
        if (damaged.length === 0 && enemyFront.length === 0) continue;
        return {
          type: 'ability', slot: i,
          target: damaged.length > 0 ? weakest(me.board, damaged) : undefined,
          target2: enemyFront.length > 0 ? randomOf(rand, enemyFront) : undefined,
        };
      }
    }
    // 3) Play every affordable creature, in hand order, front rows first. Táticas, Emboscadas, Relíquias
    //    and Terrenos stay in hand (the AI does not know how to use them yet).
    for (const card of me.hand) {
      if (card.cardType === 'Relíquia' || card.cardType === 'Terreno' || card.cardType === 'Tática' || card.cardType === 'Emboscada') continue;
      if (card.cost > me.gold) continue;
      const empty = ownUnitSlots.filter(i => !me.board[i]);
      if (empty.length === 0) break;
      const front = empty.filter(i => i <= 4);
      return { type: 'play', cardId: card.id, slot: randomOf(rand, front.length > 0 ? front : empty) };
    }
    return { type: 'advance' };
  }

  if (t.phase === 'combate') {
    for (const i of ownUnitSlots) {
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
