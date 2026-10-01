// Shared types of the rules engine. Everything here is plain, JSON-serializable data: a whole match
// can be saved, sent over a network, or replayed from a seed + the list of actions.

export type CardType =
  | 'Infantaria' | 'Cavalaria' | 'Arqueiro' | 'Artilharia' | 'General'
  | 'Relíquia' | 'Terreno' | 'Tática' | 'Emboscada';

// A seat is a chair at the table, not "the human" or "the NPC": online play seats two humans, the
// local game seats a human and the AI, and the rules never care which is which.
export type Seat = 0 | 1;
export const otherSeat = (s: Seat): Seat => (s === 0 ? 1 : 0);

// Turn flow: Compra and Suprimentos run by themselves at the start of the turn (cards can skip them);
// the seat only ever rests in Preparação, Combate, Pós-combate and Movimentação.
export type TurnPhase = 'compra' | 'suprimentos' | 'preparacao' | 'combate' | 'pos_combate' | 'movimentacao';

// What the catalog stores for a card name (no artwork, no per-copy data).
export interface CardDef {
  name: string;
  cardType: CardType;
  atk: number;
  hp: number;
  cost: number;
  effect: string;
  isFullArt?: boolean;
}

// One physical copy of a card inside a match. Field names intentionally match the client's CardData
// (minus `art`) so the UI can render an engine card by attaching the artwork found via `name`.
export interface Card {
  id: string;
  name: string;
  cardType: CardType;
  atk: number;
  hp: number;
  cost: number;
  effect: string;
  isFullArt?: boolean;
  // A one-time "+X ATK / +X HP in its next combat" bonus (Comandante Aurelion's active).
  pendingCombatBonus?: { atk: number; hp: number };
  // A permanent stack of "-1 damage taken" stamps (Linha Fechada).
  dmgReduction?: number;
  // A temporary ATK stack from Capitão de Formação's "Ao mover" — cleared at every turn start.
  formationBuffAtk?: number;
  // Armamentos stay attached until the unit dies, then go to the graveyard with it.
  equippedWeapons?: Card[];
  // Only on what a seat is not allowed to see (see redactFor): a face-down placeholder.
  hidden?: boolean;
}

// Slot layout per side (13 slots):
//   0-4 Vanguarda · 5-9 Retaguarda · 10 Relíquia · 11 Terreno · 12 General
export const SLOT_COUNT = 13;
export const GENERAL_SLOT = 12;
export const RELIC_SLOT = 10;
export const TERRAIN_SLOT = 11;

export interface PlayerState {
  gold: number;
  hand: Card[];
  board: (Card | null)[];
  graveyard: Card[];
  // The deck is a list of card names (copies included). `drawPile` is the shuffled queue being drawn
  // from, rebuilt from `deckList` whenever it runs out.
  deckList: string[];
  drawPile: string[];
  general: string;
  // General ability (Cardeal Pedro): uses this turn, blocked this turn, blocked next turn.
  generalAbilityUses: number;
  generalAbilityBlocked: boolean;
  pendingGeneralBlock: boolean;
  // Set by card effects: skips the automatic Compra / Suprimentos of this seat's next turn start.
  skip?: { compra?: boolean; suprimentos?: boolean };
}

export interface TurnState {
  // false until the `begin` action ran (the opening hands are dealt, nobody has started a turn yet).
  started: boolean;
  active: Seat;
  // Counts rounds: it goes up when the SECOND player of the round finishes their turn.
  round: number;
  phase: TurnPhase;
  first: Seat;
  // Slots (of the active seat) touched by a reposition this turn.
  moved: number[];
  bonusRepositions: number;
  // Batedor: the slot that may move once for free right after its attack.
  batedorFree: number | null;
  attackCounts: Record<number, number>;
  // Card ids that already used their once-per-turn ability this turn.
  activated: string[];
}

export type PickMode = 'graveyard_soldier' | 'deck_search' | 'top_reveal' | 'summon';

// What the match is waiting for before anything else can happen.
export type Pending =
  | {
      kind: 'pick';
      seat: Seat;
      mode: PickMode;
      title: string;
      options: Card[];
      min: number;
      max: number;
      // The tactic being resolved (it goes to the graveyard once resolved), or null for a board ability.
      source: Card | null;
      // Cards revealed from the top of the deck and not chosen go back to the bottom.
      revealed?: boolean;
      // Chamado às Armas: where the summoned soldiers land.
      slots?: number[];
    }
  | {
      // End of turn with more than HAND_LIMIT cards: the seat must discard down to the limit.
      kind: 'discard';
      seat: Seat;
      count: number;
    }
  | {
      kind: 'ambush';
      // The DEFENDER decides whether to spring an Emboscada.
      seat: Seat;
      attacker: Seat;
      from: number;
      to: number;
      options: string[];
    };

export interface GameState {
  v: 1;
  rng: number;
  uid: number;
  players: [PlayerState, PlayerState];
  turn: TurnState;
  pending: Pending | null;
  winner: Seat | null;
}

// ── Actions: everything a player can ask the engine to do ───────────────────
export type Action =
  // Starts the very first turn (draw for the first seat). Sent once after the opening hands.
  | { type: 'begin' }
  // Plays a hand card. `slot` is the destination for creatures/Relíquia/Terreno; `target` is the board
  // slot a targeted Tática aims at (own board or enemy board depending on the card).
  | { type: 'play'; cardId: string; slot?: number; target?: number }
  | { type: 'attack'; from: number; to: number }
  | { type: 'move'; from: number; to: number }
  // Activates a once-per-turn ability of the unit/General standing in `slot`. Targets depend on the card.
  | { type: 'ability'; slot: number; target?: number; target2?: number }
  // The defender answers an ambush prompt: the Emboscada card id, or null to let the attack through.
  | { type: 'ambush'; cardId: string | null }
  // Resolves a pick prompt (search/reveal): the chosen card ids.
  | { type: 'choose'; cardIds: string[] }
  // Answers the end-of-turn discard prompt: exactly the number of cards asked for, they go to the graveyard.
  | { type: 'discard'; cardIds: string[] }
  // Ends the current phase (and the turn, from the last phase).
  | { type: 'advance' }
  | { type: 'concede' };

// ── Events: what happened, for animation/sound/log ──────────────────────────
export type GameEvent =
  | { t: 'turn_start'; seat: Seat; round: number }
  | { t: 'phase'; seat: Seat; phase: TurnPhase }
  // An automatic phase (Compra / Suprimentos) was skipped by a card effect.
  | { t: 'skip'; seat: Seat; phase: TurnPhase }
  | { t: 'gold'; seat: Seat; delta: number; reason: 'turn' | 'spend' | 'gain' }
  | { t: 'draw'; seat: Seat; card: Card; reason: 'turn' | 'effect' | 'deal' }
  | { t: 'play'; seat: Seat; card: Card; slot?: number }
  | { t: 'place'; seat: Seat; slot: number; card: Card }
  | { t: 'summon'; seat: Seat; slot: number; card: Card }
  | { t: 'attack'; seat: Seat; from: number; to: number }
  | { t: 'ambush'; seat: Seat; card: Card }
  | { t: 'cancelled'; seat: Seat; from: number; to: number }
  | { t: 'damage'; seat: Seat; slot: number; amount: number }
  | { t: 'heal'; seat: Seat; slot: number; amount: number }
  | { t: 'buff'; seat: Seat; slot: number; atk: number; hp: number }
  | { t: 'destroyed'; seat: Seat; slot: number; card: Card }
  | { t: 'move'; seat: Seat; from: number; to: number; swapped: boolean }
  // Reforço: the card behind a fallen Vanguarda card stepped forward into its place.
  | { t: 'reinforce'; seat: Seat; from: number; to: number; card: Card }
  | { t: 'equip'; seat: Seat; slot: number; card: Card; atk: number; hp: number }
  | { t: 'graveyard'; seat: Seat; card: Card }
  | { t: 'ability'; seat: Seat; slot: number; name: string }
  | { t: 'pick'; seat: Seat; title: string }
  | { t: 'winner'; seat: Seat }
  // Plain-language line for the UI toast/log (pt-BR).
  // `private`: only the acting seat gets to read it (it names a card taken from the deck/hand).
  | { t: 'log'; seat: Seat; text: string; private?: boolean };

export type ActionResult =
  | { ok: true; state: GameState; events: GameEvent[] }
  | { ok: false; error: string };
