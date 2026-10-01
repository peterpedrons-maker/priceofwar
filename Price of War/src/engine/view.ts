// What a given seat is allowed to see. The server keeps the full GameState; each player gets
// redactFor(state, theirSeat) and redactEvents(events, theirSeat), so an opponent's hand and the order
// of any deck never leave the server.
import type { Card, GameEvent, GameState, PlayerState, Seat } from './types';

const hiddenCard = (id: string): Card => ({ id, name: '', cardType: 'Tática', atk: 0, hp: 0, cost: 0, effect: '', hidden: true });

const redactPlayer = (p: PlayerState): PlayerState => ({
  ...p,
  hand: p.hand.map(c => hiddenCard(c.id)),
  // Nothing about the deck's contents or order is revealed; only how many cards remain in the queue.
  deckList: [],
  drawPile: p.drawPile.map(() => ''),
});

export const redactFor = (state: GameState, seat: Seat): GameState => {
  const other: Seat = seat === 0 ? 1 : 0;
  const players = [state.players[0], state.players[1]] as [PlayerState, PlayerState];
  players[other] = redactPlayer(players[other]);
  // The RNG state would let a client predict shuffles.
  const pending = state.pending && state.pending.kind === 'pick' && state.pending.seat !== seat
    ? { ...state.pending, options: state.pending.options.map(o => hiddenCard(o.id)) }
    : state.pending;
  return { ...state, rng: 0, players, pending };
};

export const redactEvents = (events: GameEvent[], seat: Seat): GameEvent[] =>
  events.map(e => {
    if (e.t === 'draw' && e.seat !== seat) return { ...e, card: hiddenCard(e.card.id) };
    return e;
  });

// ── Seat mirroring ───────────────────────────────────────────────────────────
// The screen always shows "me" as seat 0 (bottom) and the opponent as seat 1. A player who really sits in chair 1
// plays on a mirrored copy of the match: the same state with the two chairs swapped. Mirroring twice gives back
// the original.
export const mirrorSeats = (state: GameState): GameState => {
  const flip = (s: Seat): Seat => (s === 0 ? 1 : 0);
  const pending = state.pending
    ? state.pending.kind === 'ambush'
      ? { ...state.pending, seat: flip(state.pending.seat), attacker: flip(state.pending.attacker) }
      : { ...state.pending, seat: flip(state.pending.seat) }
    : null;
  return {
    ...state,
    players: [state.players[1], state.players[0]],
    turn: { ...state.turn, active: flip(state.turn.active), first: flip(state.turn.first) },
    pending,
    winner: state.winner === null ? null : flip(state.winner),
  };
};

export const mirrorEvents = (events: GameEvent[]): GameEvent[] =>
  events.map(e => ('seat' in e ? ({ ...e, seat: (e.seat === 0 ? 1 : 0) as Seat } as GameEvent) : e));
