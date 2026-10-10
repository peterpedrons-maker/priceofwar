// The rules of Price of War as one pure state machine.
//
//   createMatch(...)            -> the opening state (Generals placed, hands dealt)
//   applyAction(state, seat, a) -> { ok, state, events } | { ok:false, error }
//
// The state is plain JSON and is never modified: every action works on a copy and returns the new
// state together with the events that happened (for animation, sound and the log). The same code
// runs in the browser for the local game and will run on the server for online play, so both sides
// of a match are always judged by exactly the same rules.
import { DECK_RECIPES, getCardDef, requireCardDef, type DeckId } from './catalog';
import { pickRandom, seedFrom, shuffled } from './rng';
import {
  COMBAT_FROM_ROUND, DRAW_PER_TURN, GOLD_FROM_ROUND, GOLD_PER_TURN, HAND_LIMIT, START_GOLD, START_HAND,
  SOLDIER_TYPES, abilityOn, abilityPhases, adjacentSlots, areSlotsAdjacent, auraTotal, blocksAmbush, canPlaceInSlot, canReposition,
  getAuraCombatHpBonus, getCardDropKind, getEffectiveAtk, getIncomingDamageReduction, getMaxAttacksPerTurn, getMoveRow,
  getValidAttackTargets, isBackline, isCardDamaged, isFrontline, isUnitSlot, locksGeneralOnDamage, reinforceShield, canReinforce,
  restingPhasesForTurn, specCandidatesOn, targetSpecsOf, verbsOn, canPlayInPhase, withEquippedWeapons, relicModeOf, maxGeneralAbilityUses, upkeepOf, type Board,
} from './rules';
import {
  GENERAL_SLOT, SLOT_COUNT, otherSeat,
  type AbilityOn, type Action, type ActionResult, type Card, type CardFilter, type GameEvent, type GameState, type PlayerState, type Seat, type TargetSpec, type TurnPhase, type Verb,
} from './types';

// ── Setup ───────────────────────────────────────────────────────────────────
export interface DeckSetup {
  general: string;
  // Either a list of card names (one entry per copy) or a name -> copies map.
  cards: readonly string[] | Record<string, number>;
}

export const deckSetupFromRecipe = (id: DeckId): DeckSetup => ({
  general: DECK_RECIPES[id].general,
  cards: DECK_RECIPES[id].cards,
});

const expandCards = (cards: DeckSetup['cards']): string[] =>
  Array.isArray(cards)
    ? [...(cards as readonly string[])]
    : Object.entries(cards as Record<string, number>).flatMap(([name, n]) => Array<string>(n).fill(name));

export interface MatchOptions {
  seed: number;
  decks: [DeckSetup, DeckSetup];
  // Who plays first (the coin toss decides this before the match is created). Online it is the toss winner, who then
  // picks with the `choose_first` action before `begin`.
  first: Seat;
}

const cardFromName = (s: GameState, name: string, prefix = 'c'): Card => {
  const def = requireCardDef(name);
  s.uid += 1;
  const card: Card = { id: `${prefix}${s.uid}`, name: def.name, cardType: def.cardType, atk: s.statOverrides?.[name]?.atk ?? def.atk, hp: s.statOverrides?.[name]?.hp ?? def.hp, cost: def.cost, effect: def.effect };
  if (def.isFullArt) card.isFullArt = true;
  if (def.trigger) card.trigger = def.trigger;
  return card;
};

export const createMatch = (opts: MatchOptions): { state: GameState; events: GameEvent[] } => {
  const mkPlayer = (setup: DeckSetup): PlayerState => ({
    gold: START_GOLD, hand: [], board: Array(SLOT_COUNT).fill(null), graveyard: [],
    deckList: expandCards(setup.cards), drawPile: [], general: setup.general,
    generalAbilityUses: 0, generalAbilityBlocked: false, pendingGeneralBlock: false,
  });
  const s: GameState = {
    v: 1, rng: seedFrom(opts.seed), uid: 0,
    players: [mkPlayer(opts.decks[0]), mkPlayer(opts.decks[1])],
    turn: {
      started: false, active: opts.first, round: 1, phase: 'preparacao', first: opts.first,
      moved: [], bonusRepositions: 0, batedorFree: null, attackCounts: {}, activated: [],
    },
    pending: null, winner: null,
  };
  const c: Ctx = { s, ev: [] };
  ([0, 1] as Seat[]).forEach(seat => {
    const p = s.players[seat];
    p.drawPile = shuffled(s, p.deckList);   // the deck is shuffled once; from here on cards only leave it
    p.board[GENERAL_SLOT] = cardFromName(s, p.general, 'g');
    for (let i = 0; i < START_HAND; i++) drawCards(c, seat, 1, 'deal');
  });
  return { state: s, events: c.ev };
};

// ── Context and errors ──────────────────────────────────────────────────────
interface Ctx { s: GameState; ev: GameEvent[] }

// A move that is not allowed. Carries the sentence the UI shows to the player.
class RuleError extends Error {}
const fail = (message: string): never => { throw new RuleError(message); };

const log = (c: Ctx, seat: Seat, text: string, priv = false) => { c.ev.push(priv ? { t: 'log', seat, text, private: true } : { t: 'log', seat, text }); };
const P = (c: Ctx, seat: Seat) => c.s.players[seat];

export const combatOpen = (s: GameState): boolean => s.turn.round >= COMBAT_FROM_ROUND || (COMBAT_FROM_ROUND <= 2 && s.turn.active !== s.turn.first);
export const activePhases = (s: GameState): TurnPhase[] => restingPhasesForTurn(combatOpen(s));

// ── Small state helpers ─────────────────────────────────────────────────────
const addGold = (c: Ctx, seat: Seat, delta: number, reason: 'turn' | 'spend' | 'gain') => {
  if (delta === 0) return;
  P(c, seat).gold += delta;
  c.ev.push({ t: 'gold', seat, delta, reason });
};

// The deck is finite: every copy the player built is in `drawPile` (order) / `deckList` (what is left, unordered by draw)
// until it is drawn, searched or revealed. A card that reached the hand, the board or the graveyard never goes back
// into the deck — an empty deck simply draws nothing.
const removeOne = (arr: string[], name: string) => { const i = arr.indexOf(name); if (i !== -1) arr.splice(i, 1); };
const takeFromDeck = (p: PlayerState, name: string) => { removeOne(p.deckList, name); removeOne(p.drawPile, name); };

const drawCards = (c: Ctx, seat: Seat, n: number, reason: 'turn' | 'effect' | 'deal') => {
  const p = P(c, seat);
  for (let i = 0; i < n; i++) {
    if (p.drawPile.length === 0) { if (reason !== 'deal') log(c, seat, 'O baralho acabou: não há carta para comprar.'); return; }
    const name = p.drawPile.shift();
    if (!name) return;   // a hidden entry of a player view: the real draw happens on the server
    removeOne(p.deckList, name);
    const card = cardFromName(c.s, name, 'h');
    p.hand.push(card);
    c.ev.push({ t: 'draw', seat, card, reason });
  }
};

const removeFromHand = (c: Ctx, seat: Seat, cardId: string): Card => {
  const hand = P(c, seat).hand;
  const i = hand.findIndex(h => h.id === cardId);
  if (i === -1) return fail('Essa carta não está na sua mão.');
  return hand.splice(i, 1)[0];
};

const discard = (c: Ctx, seat: Seat, card: Card) => {
  P(c, seat).graveyard.push(card);
  c.ev.push({ t: 'graveyard', seat, card });
};

// Cards leaving the board for good: their Armamentos go along, their Queda effects pay out, and a fallen General ends the
// match.
const sendDestroyed = (c: Ctx, seat: Seat, entries: { slot: number; card: Card }[]) => {
  if (entries.length === 0) return;
  const p = P(c, seat);
  entries.forEach(({ slot, card }) => c.ev.push({ t: 'destroyed', seat, slot, card }));
  const cards = entries.map(e => e.card);
  withEquippedWeapons(cards).forEach(card => { p.graveyard.push(card); c.ev.push({ t: 'graveyard', seat, card }); });
  entries.forEach(({ slot, card }) => runAbilities(c, seat, card, slot, 'destroyed'));
  // Modo "loot" da Relíquia de quem destruiu: ouro por unidade inimiga destruída, com teto por ciclo.
  const killer = otherSeat(seat), mode = relicModeOf(P(c, killer).board);
  if (mode?.loot) {
    cards.filter(card => SOLDIER_TYPES.includes(card.cardType)).forEach(() => {
      const kp = P(c, killer);
      if ((kp.loot ?? 0) >= mode.loot!.cap) return;
      kp.loot = (kp.loot ?? 0) + 1;
      if (mode.loot!.gold) addGold(c, killer, mode.loot!.gold, 'gain');
      if (mode.loot!.draw) drawCards(c, killer, mode.loot!.draw, 'effect');
    });
  }
  if (cards.some(card => card.cardType === 'General')) setWinner(c, otherSeat(seat));
  reinforceFrom(c, seat, entries.map(e => e.slot));
};

// Reforço: for every fallen Vanguarda slot that is empty now, the card right behind it (if it has the `reinforce` effect) moves up.
const reinforceFrom = (c: Ctx, seat: Seat, fallenSlots: number[]) => {
  if (c.s.winner !== null) return;
  const board = P(c, seat).board;
  [...fallenSlots].sort((a, b) => a - b).forEach(slot => {
    if (slot < 0 || slot > 4 || board[slot]) return;
    const behind = board[slot + 5];
    if (!canReinforce(behind)) return;
    const shield = reinforceShield(behind);
    const moved: Card = { ...behind! };
    board[slot] = moved;
    board[slot + 5] = null;
    c.ev.push({ t: 'reinforce', seat, from: slot + 5, to: slot, card: moved });
    grantShield(c, seat, slot, shield);
    log(c, seat, `Reforço! ${moved.name} avançou para a Vanguarda com Escudo ${shield}.`);
  });
};

const setWinner = (c: Ctx, seat: Seat) => {
  if (c.s.winner !== null) return;
  c.s.winner = seat;
  c.ev.push({ t: 'winner', seat });
};

// ── Escudo and Bloqueio ──────────────────────────────────────────────────────
// Damage that reaches a card meets its Bloqueio first (the whole instance is negated, however big), then its Escudo (it eats
// N points of the damage), and only what is left touches HP. Returns the card with those used up, and what gets through.
const soak = (c: Ctx, seat: Seat, slot: number, card: Card, amount: number): { card: Card; through: number } => {
  if (amount <= 0 || (!card.block && !(card.shield && card.shield > 0))) return { card, through: Math.max(0, amount) };
  if (card.block) {
    c.ev.push({ t: 'shield_hit', seat, slot, absorbed: amount, left: card.shield ?? 0, broken: false, blocked: true });
    return { card: { ...card, block: undefined }, through: 0 };
  }
  const absorbed = Math.min(card.shield!, amount);
  const left = card.shield! - absorbed;
  c.ev.push({ t: 'shield_hit', seat, slot, absorbed, left, broken: left === 0, blocked: false });
  return { card: { ...card, shield: left > 0 ? left : undefined }, through: amount - absorbed };
};
// Cards that give an Escudo / a Bloqueio call these (the engine is ready; the cards themselves come later).
export const grantShield = (c: Ctx, seat: Seat, slot: number, amount: number) => {
  const board = P(c, seat).board; const card = board[slot];
  if (!card || amount <= 0) return;
  board[slot] = { ...card, shield: (card.shield ?? 0) + amount };
  c.ev.push({ t: 'shield', seat, slot, shield: amount, block: false });
};
export const grantBlock = (c: Ctx, seat: Seat, slot: number) => {
  const board = P(c, seat).board; const card = board[slot];
  if (!card || card.block) return;
  board[slot] = { ...card, block: true };
  c.ev.push({ t: 'shield', seat, slot, shield: 0, block: true });
};

// Flat damage straight to a slot (effects, splash) — no armor math, destroyed at 0 HP.
const damageSlot = (c: Ctx, seat: Seat, slot: number, amount: number): { slot: number; card: Card } | null => {
  const board = P(c, seat).board;
  const card = board[slot];
  if (!card) return null;
  const soaked = soak(c, seat, slot, card, amount);
  if (soaked.through > 0 || amount === 0) c.ev.push({ t: 'damage', seat, slot, amount: soaked.through });
  const hp = soaked.card.hp - soaked.through;
  if (hp <= 0) {
    board[slot] = null;
    return { slot, card: { ...soaked.card, hp } };
  }
  board[slot] = { ...soaked.card, hp };
  return null;
};

// Healing a card: +HP, and the card's own `healed` effects (Noviço Renascido) react.
const healSlot = (c: Ctx, seat: Seat, slot: number, amount: number) => {
  const board = P(c, seat).board;
  const card = board[slot]!;
  board[slot] = { ...card, hp: card.hp + amount };
  c.ev.push({ t: 'heal', seat, slot, amount });
  runAbilities(c, seat, board[slot]!, slot, 'healed');
  adjacentSlots(slot).forEach(j => { if (board[j]) runAbilities(c, seat, board[j]!, j, 'ally_healed'); });
};

// ── Turn flow ───────────────────────────────────────────────────────────────
const startTurn = (c: Ctx, seat: Seat) => {
  const t = c.s.turn;
  const p = P(c, seat);
  t.active = seat;
  t.phase = 'compra';
  t.moved = [];
  t.bonusRepositions = 0;
  t.batedorFree = null;
  t.attackCounts = {};
  t.activated = [];
  c.ev.push({ t: 'turn_start', seat, round: t.round });

  // A `buff_adjacent` bonus (Capitão de Formação) only lasts until its owner's next turn begins.
  p.board.forEach((card, i) => { if (card?.formationBuffAtk) p.board[i] = { ...card, formationBuffAtk: 0 }; });

  p.loot = 0;
  p.generalAbilityUses = 0;
  p.generalAbilityBlocked = p.pendingGeneralBlock;
  p.pendingGeneralBlock = false;

  const skip = p.skip ?? {};
  p.skip = undefined;

  // Compra. No cap on drawing: the hand limit is only enforced at the END of a turn (see advance).
  c.ev.push({ t: 'phase', seat, phase: 'compra' });
  if (skip.compra) {
    c.ev.push({ t: 'skip', seat, phase: 'compra' });
    log(c, seat, 'A fase de Compra foi pulada!');
  } else {
    drawCards(c, seat, DRAW_PER_TURN, 'turn');
    // `turn_start` effects (Despenseiro do Mosteiro refills the hand).
    for (let i = 0; i <= 9; i++) { const card = p.board[i]; if (card) runAbilities(c, seat, card, i, 'turn_start'); }
  }

  // Suprimentos. Gold is a growing, saved-up pile: nothing in round 1, then +5 every turn without a cap.
  t.phase = 'suprimentos';
  c.ev.push({ t: 'phase', seat, phase: 'suprimentos' });
  if (skip.suprimentos) {
    c.ev.push({ t: 'skip', seat, phase: 'suprimentos' });
    log(c, seat, 'A fase de Suprimentos foi pulada!');
  } else if (t.round >= GOLD_FROM_ROUND) {
    addGold(c, seat, GOLD_PER_TURN, 'turn');
  }

  // Manutenção: as cartas com `upkeep` pedem pagamento; o dono decide quais ficam (a turma só segue depois da resposta).
  const entries: { slot: number; cardId: string; cost: number }[] = [];
  for (let i = 0; i <= 9; i++) { const card = p.board[i]; if (card && upkeepOf(card.name) > 0) entries.push({ slot: i, cardId: card.id, cost: Math.max(1, upkeepOf(card.name) - (relicModeOf(p.board)?.upkeepEach ?? 0)) }); }
  const discount = relicModeOf(p.board)?.upkeepFlat ?? 0;
  // Sempre abre a tela quando há mercenários: o dono vê o que paga ou perde, mesmo sem ouro (ver docs/deck-mercenarios.md).
  if (entries.length > 0) {
    c.s.pending = { kind: 'upkeep', seat, entries, discount };
    log(c, seat, 'Manutenção: escolha quais mercenários continuam (pagando) e quais são dispensados.');
    return;
  }
  enterPreparation(c, seat);
};

const enterPreparation = (c: Ctx, seat: Seat) => {
  c.s.turn.phase = 'preparacao';
  c.ev.push({ t: 'phase', seat, phase: 'preparacao' });
};

// Answer to the Suprimentos upkeep prompt: the listed cards stay (their upkeep, minus the Relíquia's discount, is paid from the gold),
// the others are dismissed — to the graveyard, or back to the hand when the card says so — and their Rescisão effects run.
const payUpkeep = (c: Ctx, seat: Seat, a: Extract<Action, { type: 'upkeep' }>) => {
  assertCanAct(c, seat, true);
  const pend = c.s.pending;
  if (!pend || pend.kind !== 'upkeep') return fail('Não há manutenção para pagar.');
  if (pend.seat !== seat) return fail('Essa manutenção não é sua.');
  const p = P(c, seat);
  const keep = new Set(a.keep);
  if (!a.keep.every(id => pend.entries.some(e => e.cardId === id))) fail('Essa carta não está na lista de manutenção.');
  const kept = pend.entries.filter(e => keep.has(e.cardId));
  const dismissed = pend.entries.filter(e => !keep.has(e.cardId));
  const total = Math.max(0, kept.reduce((n, e) => n + e.cost, 0) - pend.discount);
  if (total > p.gold) fail('Ouro insuficiente para a manutenção: dispense alguém.');
  c.s.pending = null;
  if (total > 0) addGold(c, seat, -total, 'spend');
  c.ev.push({ t: 'upkeep', seat, paid: total, dismissed: dismissed.length });
  [...dismissed].sort((x, y) => y.slot - x.slot).forEach(e => {
    const card = p.board[e.slot];
    if (!card || card.id !== e.cardId) return;
    p.board[e.slot] = null;
    const toHand = getCardDef(card.name)?.dismiss === 'hand';
    const weapons = card.equippedWeapons ?? [];
    weapons.forEach(w => { p.graveyard.push(w); c.ev.push({ t: 'graveyard', seat, card: w }); });
    if (toHand) p.hand.push(cardFromName(c.s, card.name, 'h'));
    else { p.graveyard.push({ ...card, equippedWeapons: undefined }); c.ev.push({ t: 'graveyard', seat, card }); }
    c.ev.push({ t: 'dismissed', seat, slot: e.slot, card, toHand });
    log(c, seat, `${card.name} foi dispensado${toHand ? ' e voltou para a mão' : ''}.`);
    runAbilities(c, seat, card, e.slot, 'dismissed');
  });
  reinforceFrom(c, seat, dismissed.map(e => e.slot));
  enterPreparation(c, seat);
};

// The Relíquia's mode can only change at the end of the turn (Movimentação) and then holds until the end of the next one.
const setRelicMode = (c: Ctx, seat: Seat, a: Extract<Action, { type: 'relic_mode' }>) => {
  assertCanAct(c, seat);
  if (c.s.turn.phase !== 'movimentacao') fail('O modo da Relíquia só muda no fim do turno (Movimentação).');
  const p = P(c, seat);
  const relic = p.board[10];
  const def = relic ? getCardDef(relic.name) : undefined;
  if (!relic || !def?.modes) fail('Você não tem uma Relíquia com modos em campo.');
  if (!def!.modes!.some(m => m.id === a.mode)) fail('Esse modo não existe nessa Relíquia.');
  p.board[10] = { ...relic!, mode: a.mode };
  c.ev.push({ t: 'relic_mode', seat, mode: a.mode });
};

// `turn_end` effects, once the owner's turn is over: bonuses for the units that moved (Aurelion), then swaps (Soldado Tático).
const runTurnEnd = (c: Ctx, seat: Seat) => {
  const board = P(c, seat).board;
  [12, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(slot => {
    const card = board[slot];
    if (card) verbsOn(card.name, 'turn_end').forEach(v => { if (v.kind === 'buff_moved') grantMovedBuff(c, seat, v); });
  });
  const settled = new Set<number>();
  for (let i = 0; i <= 9; i++) {
    const card = board[i];
    if (settled.has(i) || !card || !verbsOn(card.name, 'turn_end').some(v => v.kind === 'swap_adjacent')) continue;
    const partner = [i - 1, i + 1, i - 5, i + 5].find(j => areSlotsAdjacent(i, j) && board[j] && !settled.has(j));
    if (partner !== undefined) {
      [board[i], board[partner]] = [board[partner], board[i]];
      settled.add(i);
      settled.add(partner);
      c.ev.push({ t: 'move', seat, from: i, to: partner, swapped: true });
    }
  }
};

const endTurn = (c: Ctx) => {
  const t = c.s.turn;
  const seat = t.active;
  runTurnEnd(c, seat);
  // The round counter goes up when the SECOND player of the round has finished.
  if (seat !== t.first) t.round += 1;
  startTurn(c, otherSeat(seat));
};

// ── Validation shared by every action ───────────────────────────────────────
const assertCanAct = (c: Ctx, seat: Seat, allowPending = false) => {
  const s = c.s;
  if (s.winner !== null) fail('A partida já terminou.');
  if (!s.turn.started) fail('A partida ainda não começou.');
  if (s.turn.active !== seat) fail('Não é o seu turno.');
  if (s.pending && !allowPending) fail('Responda à escolha pendente primeiro.');
};

// ── Effects, by type ────────────────────────────────────────────────────────────────────────────────────────────
// A card's abilities live in the catalog (CardDef.abilities, see types.ts and docs/efeitos.md): WHEN they happen and a list of
// verbs (the effect types). This section is the one place that knows how to run each verb; no card is mentioned by name.
interface Fx {
  seat: Seat;
  source: Card;              // the card whose effect this is
  slot: number | null;       // where it stands (null for a Tática, which is not on the board)
  targets: (number | undefined)[];   // the board slots the player chose, one per targeted verb, in order
}

const uniqueByName = (names: string[]) => [...new Set(names)];
const matchesFilter = (def: { cardType: string; atk: number }, f: CardFilter) =>
  (!f.types || f.types.includes(def.cardType as never)) && (f.atk === undefined || def.atk === f.atk);
const filterLabel = (f: CardFilter) =>
  !f.types ? 'carta' : f.types.length === SOLDIER_TYPES.length && SOLDIER_TYPES.every(t => f.types!.includes(t)) ? 'soldado' : f.types.join(' ou ');

const specCandidates = (c: Ctx, seat: Seat, spec: TargetSpec): number[] =>
  specCandidatesOn(spec, P(c, seat).board, P(c, otherSeat(seat)).board, c.s.turn.moved);

// Fails with the sentence the player sees when `slot` is not a legal choice for `spec`.
const checkTarget = (c: Ctx, seat: Seat, spec: TargetSpec, slot: number | undefined) => {
  const own = spec.side === 'own';
  if (spec.area === 'row') {
    if (slot === undefined || slot < 0 || slot > 9) fail(`Escolha uma fileira ${own ? 'sua' : 'inimiga'} (Vanguarda ou Retaguarda).`);
    return;
  }
  const board = own ? P(c, seat).board : P(c, otherSeat(seat)).board;
  const row = spec.where === 'front' ? (own ? ' na Vanguarda' : ' na Vanguarda') : spec.where === 'back' ? ' na Retaguarda' : ' no campo';
  const generic = own ? `Escolha uma unidade sua${row}.` : spec.where ? `Escolha um inimigo${row}.` : 'Escolha uma unidade inimiga no campo.';
  if (slot === undefined || slot < 0 || slot > 9 || !board[slot]) return fail(generic);
  if (spec.where === 'front' && !isFrontline(slot)) return fail(generic);
  if (spec.where === 'back' && !isBackline(slot)) return fail(generic);
  if (spec.types && !spec.types.includes(board[slot]!.cardType)) return fail(`Escolha uma unidade do tipo certo: ${spec.types.join(' ou ')}.`);
  if (spec.needs === 'damaged' && !isCardDamaged(board[slot]!)) return fail('Escolha um aliado ferido no campo.');
  if (spec.needs === 'moved' && own && !c.s.turn.moved.includes(slot)) return fail('Essa unidade não se moveu neste turno.');
};

// Which of an ability's targeted verbs actually need a choice right now (an `optional` target with no candidate is skipped).
const activeTargets = (c: Ctx, seat: Seat, verbs: Verb[]): { spec: TargetSpec; index: number; skipped: boolean }[] =>
  targetSpecsOf(verbs).map((spec, index) => ({ spec, index, skipped: !!spec.optional && specCandidates(c, seat, spec).length === 0 }));

// Checks the player's choices for a list of verbs (called before anything is paid or moved).
const validateTargets = (c: Ctx, seat: Seat, verbs: Verb[], picks: (number | undefined)[]) => {
  const targets = activeTargets(c, seat, verbs);
  if (targets.length > 0 && targets.every(t => t.spec.optional) && targets.every(t => t.skipped)) fail('Nenhum alvo disponível.');
  targets.forEach(t => { if (!t.skipped) checkTarget(c, seat, t.spec, picks[t.index]); });
};

// Checks what a verb needs from the match itself (cards to look at, free slots…), before anything is paid.
const checkVerb = (c: Ctx, seat: Seat, v: Verb) => {
  const p = P(c, seat);
  if (v.kind === 'look_top' && p.drawPile.length === 0) fail('O baralho está vazio.');
  if (v.kind === 'search') {
    if (v.zone === 'graveyard' && !p.graveyard.some(g => matchesFilter(g, v.filter))) fail(`Não há ${filterLabel(v.filter)} no cemitério.`);
    if (v.zone === 'deck' && !p.deckList.some(n => matchesFilter(getCardDef(n)!, v.filter))) fail(`Não há ${filterLabel(v.filter)} no deck.`);
  }
  if (v.kind === 'summon_deck') {
    if (!p.deckList.some(n => matchesFilter(getCardDef(n)!, v.filter))) fail('Não há cartas assim no deck.');
    if (![0, 1, 2, 3, 4].some(i => !p.board[i])) fail('Não há slots livres na Vanguarda.');
  }
  if (v.kind === 'retreat') { /* the chosen unit's back slot is checked with the target */ }
};
// The same, for a verb that has a chosen target (slot-dependent rules).
const checkVerbTarget = (c: Ctx, seat: Seat, v: Verb, slot: number) => {
  if (v.kind === 'retreat' && P(c, seat).board[slot + 5]) fail('A Retaguarda dessa coluna já está ocupada.');
};

const openPick = (c: Ctx, fx: Fx, mode: 'graveyard_soldier' | 'deck_search' | 'top_reveal' | 'summon', title: string, options: Card[], min: number, max: number, extra: { revealed?: boolean; restTo?: 'graveyard'; slots?: number[] } = {}) => {
  // A Tática keeps resolving until the choice is made (it goes to the graveyard then); a board ability has no card to discard.
  c.s.pending = { kind: 'pick', seat: fx.seat, mode, title, options, min, max, source: fx.slot === null ? fx.source : null, ...extra };
  c.ev.push({ t: 'pick', seat: fx.seat, title });
};

// Runs one verb. `slot` is the board slot the player chose for it (only targeted verbs get one).
const runVerb = (c: Ctx, fx: Fx, v: Verb, slot: number | undefined) => {
  const { seat } = fx;
  const enemySeat = otherSeat(seat);
  const p = P(c, seat);
  const own = p.board;
  const foe = P(c, enemySeat).board;
  const name = fx.source.name;
  switch (v.kind) {
    case 'gold':
      addGold(c, seat, v.amount, 'gain');
      log(c, seat, `${name}: +${v.amount} ouro neste turno!`);
      return;
    case 'draw':
      drawCards(c, seat, v.amount, 'effect');
      return;
    case 'lose_gold': {
      const lost = Math.min(v.amount, p.gold);
      if (lost > 0) addGold(c, seat, -lost, 'spend');
      log(c, seat, `${name}: ${lost > 0 ? `perdeu ${lost} de ouro` : 'não havia ouro para perder'}.`);
      return;
    }
    case 'hurt_own_general': {
      const dead = damageSlot(c, seat, GENERAL_SLOT, v.amount);
      log(c, seat, `${name}: o General sofre ${v.amount} de dano!`);
      sendDestroyed(c, seat, dead ? [dead] : []);
      return;
    }
    case 'refill_hand':
      if (p.hand.length < v.to) drawCards(c, seat, v.to - p.hand.length, 'effect');
      return;
    case 'extra_moves':
      c.s.turn.bonusRepositions += v.amount;
      log(c, seat, `${name}: +${v.amount} reposicionamentos bônus neste turno!`);
      return;
    case 'damage': {
      const dead: { slot: number; card: Card }[] = [];
      let slots: number[];
      if (v.all === 'enemy') slots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12];
      else if (v.target?.area === 'row') slots = getMoveRow(slot!) === 0 ? [0, 1, 2, 3, 4] : [5, 6, 7, 8, 9];
      else slots = [slot!];
      slots.forEach(i => { const d = damageSlot(c, enemySeat, i, v.amount); if (d) dead.push(d); });
      log(c, seat, v.all ? `${name}: ${v.amount} de dano a todas as unidades inimigas!` : v.target?.area === 'row' ? `${name}: ${v.amount} de dano em toda a fileira!` : `${name}: ${v.amount} de dano causado!`);
      sendDestroyed(c, enemySeat, dead);
      return;
    }
    case 'heal': {
      const amount = v.amount + (v.withAuras ? auraTotal('healBonus', GENERAL_SLOT, own) : 0);
      healSlot(c, seat, slot!, amount);
      log(c, seat, `${own[slot!]!.name} recuperou ${amount} HP!`);
      return;
    }
    case 'buff': {
      const at = v.target ? slot! : fx.slot!;
      const card = own[at];
      if (!card) return;
      own[at] = { ...card, atk: card.atk + (v.atk ?? 0), hp: card.hp + (v.hp ?? 0) };
      c.ev.push({ t: 'buff', seat, slot: at, atk: v.atk ?? 0, hp: v.hp ?? 0 });
      if (v.target) log(c, seat, `${own[at]!.name} recebeu ${v.atk ? `+${v.atk} ATK` : `+${v.hp} HP`}!`);
      return;
    }
    case 'equip': {
      const target = own[slot!]!;
      own[slot!] = { ...target, atk: target.atk + (v.atk ?? 0), hp: target.hp + (v.hp ?? 0), equippedWeapons: [...(target.equippedWeapons ?? []), fx.source] };
      c.ev.push({ t: 'equip', seat, slot: slot!, card: fx.source, atk: v.atk ?? 0, hp: v.hp ?? 0 });
      if (v.block) grantBlock(c, seat, slot!);
      log(c, seat, `${target.name} equipado: ${name}!`);
      return;
    }
    case 'buff_self_temp': {
      const card = own[fx.slot!];
      if (!card) return;
      own[fx.slot!] = { ...card, formationBuffAtk: (card.formationBuffAtk ?? 0) + v.atk };
      c.ev.push({ t: 'buff', seat, slot: fx.slot!, atk: v.atk, hp: 0 });
      return;
    }
    case 'guard_adjacent':
      adjacentSlots(slot!).forEach(j => { if (own[j]) own[j] = { ...own[j]!, dmgReduction: (own[j]!.dmgReduction ?? 0) + v.amount }; });
      log(c, seat, `${name}: aliados adjacentes recebem menos dano!`);
      return;
    case 'buff_adjacent':
      adjacentSlots(fx.slot!).forEach(j => {
        if (own[j]) {
          own[j] = { ...own[j]!, formationBuffAtk: (own[j]!.formationBuffAtk ?? 0) + v.atk };
          c.ev.push({ t: 'buff', seat, slot: j, atk: v.atk, hp: 0 });
        }
      });
      return;
    case 'retreat': {
      const back = slot! + 5;
      const moved = { ...own[slot!]!, hp: own[slot!]!.hp + v.heal };
      own[back] = moved;
      own[slot!] = null;
      c.ev.push({ t: 'move', seat, from: slot!, to: back, swapped: false });
      c.ev.push({ t: 'heal', seat, slot: back, amount: v.heal });
      log(c, seat, `${moved.name} recuou para a Retaguarda e recuperou ${v.heal} HP!`);
      return;
    }
    case 'displace': {
      const free = adjacentSlots(slot!).filter(j => !foe[j]);
      if (free.length > 0) {
        const dest = pickRandom(c.s, free);
        foe[dest] = foe[slot!];
        foe[slot!] = null;
        c.ev.push({ t: 'move', seat: enemySeat, from: slot!, to: dest, swapped: false });
        log(c, seat, `${name}: unidade inimiga deslocada!`);
      } else {
        log(c, seat, 'Não havia slot livre adjacente para deslocar a unidade.');
      }
      return;
    }
    case 'free_move':
      c.s.turn.batedorFree = fx.slot;
      return;
    case 'look_top': {
      const top = p.drawPile.splice(0, v.count);
      top.forEach(n => removeOne(p.deckList, n));
      const revealed = top.map(n => cardFromName(c.s, n, 'o'));
      const keep = v.keepMin === v.keepMax ? `${v.keepMax}` : `até ${v.keepMax}`;
      const body = `veja as ${top.length} cartas do topo — escolha ${keep} para a mão${v.rest === 'graveyard' ? ' (o resto vai para o cemitério)' : ''}`;
      openPick(c, fx, 'top_reveal', fx.slot === null ? body[0].toUpperCase() + body.slice(1) : `${name}: ${body}`, revealed, Math.min(v.keepMin, revealed.length), v.keepMax, { revealed: true, restTo: v.rest });
      return;
    }
    case 'search': {
      const label = filterLabel(v.filter);
      if (v.zone === 'graveyard') {
        openPick(c, fx, 'graveyard_soldier', `Escolha um ${label} do cemitério para adicionar à mão`, p.graveyard.filter(g => matchesFilter(g, v.filter)), 1, 1);
      } else {
        const names = p.deckList.filter(n => matchesFilter(getCardDef(n)!, v.filter));
        openPick(c, fx, 'deck_search', `Escolha ${label === 'carta' ? 'uma carta' : `um ${label}`} do deck para adicionar à mão`, uniqueByName(names).map(n => cardFromName(c.s, n, 'o')), 1, 1);
      }
      return;
    }
    case 'summon_deck': {
      const names = p.deckList.filter(n => matchesFilter(getCardDef(n)!, v.filter));
      const slots = [0, 1, 2, 3, 4].filter(i => !p.board[i]);
      const max = Math.min(v.max, slots.length);
      openPick(c, fx, 'summon', `Escolha até ${max} carta(s) do deck para convocar na Vanguarda`, uniqueByName(names).map(n => cardFromName(c.s, n, 'o')), 1, max, { slots });
      return;
    }
    case 'summon_token': {
      const at = fx.slot!;
      if (at > 9) return;
      [at - 1, at + 1].forEach(j => {
        if (areSlotsAdjacent(at, j) && !own[j]) {
          const token = cardFromName(c.s, v.token, 't');
          own[j] = token;
          c.ev.push({ t: 'summon', seat, slot: j, card: token });
        }
      });
      return;
    }
    default:
      // attack_bonus, splash_behind, reinforce, buff_moved, swap_adjacent and the Emboscada verbs are run by the part of the
      // game they belong to (combat, Reforço, end of turn, ambush) — see their own sections.
      return;
  }
};

// Runs a card's own automatic abilities of one kind (place, destroyed, healed, turn_start…): no player choice involved.
const runAbilities = (c: Ctx, seat: Seat, card: Card, slot: number, on: AbilityOn) => {
  const fx: Fx = { seat, source: card, slot, targets: [] };
  verbsOn(card.name, on).forEach(v => runVerb(c, fx, v, undefined));
};

// Aurelion-style bonus: the units that moved this turn (up to `count`) get a one-time combat bonus.
const grantMovedBuff = (c: Ctx, seat: Seat, v: Extract<Verb, { kind: 'buff_moved' }>) => {
  const board = P(c, seat).board;
  if (c.s.turn.moved.length === 0) return;
  c.s.turn.moved.filter(i => board[i]).slice(0, v.count).forEach(i => {
    board[i] = { ...board[i]!, pendingCombatBonus: { atk: v.atk, hp: v.hp } };
    c.ev.push({ t: 'buff', seat, slot: i, atk: v.atk, hp: v.hp });
  });
};

// ── Playing a card ──────────────────────────────────────────────────────────
const playCard = (c: Ctx, seat: Seat, a: Extract<Action, { type: 'play' }>) => {
  assertCanAct(c, seat);
  const p = P(c, seat);
  const card = p.hand.find(h => h.id === a.cardId);
  if (!card) return fail('Essa carta não está na sua mão.');
  const playAbility = card.cardType === 'Tática' ? abilityOn(card.name, 'play') : undefined;
  // Cards are played in Preparação. In Movimentação (after combat) only Táticas still come out of the hand — no more units, Relíquias or Terrenos.
  const phase = c.s.turn.phase;
  if (!canPlayInPhase(card, phase)) {
    fail(phase === 'movimentacao' ? 'Na Movimentação só dá pra jogar Táticas!' : 'Jogar cartas só nas fases de Preparação e Movimentação!');
  }
  if (p.gold < card.cost) fail('Ouro insuficiente!');

  // Spends the cost and takes the card out of the hand — only called once everything is validated.
  const commit = () => {
    removeFromHand(c, seat, card.id);
    addGold(c, seat, -card.cost, 'spend');
    c.ev.push({ t: 'play', seat, card });
  };

  const kind = getCardDropKind(card);

  if (kind === 'place') {
    const slot = a.slot;
    if (slot === undefined) return fail('Escolha um slot para a carta.');
    if (slot === 12) fail('O General não pode ser substituído!');
    if ((slot === 10 || slot === 11) && card.cardType !== 'Relíquia' && card.cardType !== 'Terreno') fail('Esse slot é só para Relíquia ou Terreno!');
    if (slot <= 9 && (card.cardType === 'Relíquia' || card.cardType === 'Terreno')) fail('Relíquia/Terreno só pode ir no slot especial ao lado do General!');
    if (card.cardType === 'Relíquia' && slot !== 10) fail('A Relíquia vai no slot especial da esquerda do General.');
    if (card.cardType === 'Terreno' && slot !== 11) fail('O Terreno vai no slot especial da direita do General.');
    if (!canPlaceInSlot(card.cardType, slot)) fail('Esse slot não aceita essa carta.');
    if (p.board[slot]) fail('Esse slot já está ocupado!');
    commit();
    const modes = getCardDef(card.name)?.modes;
    if (modes?.length && !card.mode) card.mode = modes[0].id;   // a Relíquia com modos entra no primeiro; o dono troca no fim do turno
    p.board[slot] = card;
    c.ev.push({ t: 'place', seat, slot, card });
    runAbilities(c, seat, card, slot, 'place');
    return;
  }

  if (!playAbility) {
    if (card.cardType === 'Emboscada') fail('Emboscadas ativam sozinhas quando você é atacado — mantenha na mão.');
    fail('Essa Tática ainda não pode ser jogada.');
  }

  // A Tática: check what it needs, pay, and run its verbs in order.
  const verbs = playAbility!.do;
  if (targetSpecsOf(verbs).length > 0 && a.target === undefined) fail('Escolha um alvo no campo.');
  validateTargets(c, seat, verbs, [a.target]);
  verbs.forEach(v => checkVerb(c, seat, v));
  const specVerbs = verbs.filter(v => 'target' in v && v.target);
  specVerbs.forEach((v, i) => checkVerbTarget(c, seat, v, [a.target][i]!));
  commit();
  // A Tática goes to the graveyard when it is used — unless it stays attached (equip) or still has a choice to resolve (pick).
  const stays = verbs.some(v => v.kind === 'equip');
  const picks = verbs.some(v => v.kind === 'look_top' || v.kind === 'search' || v.kind === 'summon_deck');
  if (!stays && !picks) discard(c, seat, card);
  const fx: Fx = { seat, source: card, slot: null, targets: [a.target] };
  let ti = 0;
  verbs.forEach(v => runVerb(c, fx, v, 'target' in v && v.target ? [a.target][ti++] : undefined));
};

// ── Abilities ───────────────────────────────────────────────────────────────
const useAbility = (c: Ctx, seat: Seat, a: Extract<Action, { type: 'ability' }>) => {
  assertCanAct(c, seat);
  const p = P(c, seat);
  const card = p.board[a.slot];
  if (!card) return fail('Não há carta nesse slot.');
  const ability = abilityOn(card.name, 'ability');
  if (!ability) return fail(a.slot === GENERAL_SLOT ? 'Esse General não tem habilidade ativa.' : 'Essa carta não tem habilidade ativa.');
  if (!isUnitSlot(a.slot) && a.slot !== GENERAL_SLOT) fail('Essa carta não tem habilidade ativa.');
  const phases = abilityPhases(card.name);
  if (!phases.includes(c.s.turn.phase)) {
    fail(phases.includes('movimentacao') ? 'Essa habilidade só vale na Preparação e na Movimentação.' : 'Habilidades só na fase de Preparação.');
  }
  const isGeneral = a.slot === GENERAL_SLOT;
  if (isGeneral) {
    if (p.generalAbilityUses >= maxGeneralAbilityUses(p.board)) fail('A habilidade do General já foi usada neste turno.');
    if (p.generalAbilityBlocked) fail('Confessor Silencioso: a habilidade do General está bloqueada neste turno.');
  } else if (ability.once && c.s.turn.activated.includes(card.id)) {
    fail('Essa habilidade já foi usada neste turno.');
  }
  const cost = ability.cost ?? 0;
  if (p.gold < cost) fail('Ouro insuficiente!');
  const picks = [a.target, a.target2];
  validateTargets(c, seat, ability.do, picks);
  ability.do.forEach(v => checkVerb(c, seat, v));
  const targets = activeTargets(c, seat, ability.do);
  ability.do.filter(v => 'target' in v && v.target).forEach((v, i) => { if (!targets[i].skipped) checkVerbTarget(c, seat, v, picks[i]!); });

  if (cost > 0) addGold(c, seat, -cost, 'spend');
  if (isGeneral) p.generalAbilityUses += 1;
  else c.s.turn.activated.push(card.id);
  c.ev.push({ t: 'ability', seat, slot: a.slot, name: card.name });
  const fx: Fx = { seat, source: card, slot: a.slot, targets: picks };
  let ti = 0;
  ability.do.forEach(v => {
    if ('target' in v && v.target) { const i = ti++; if (!targets[i].skipped) runVerb(c, fx, v, picks[i]); }
    else runVerb(c, fx, v, undefined);
  });
};

// ── Picks (search / reveal) ─────────────────────────────────────────────────
const choose = (c: Ctx, seat: Seat, a: Extract<Action, { type: 'choose' }>) => {
  const pend = c.s.pending;
  if (!pend || pend.kind !== 'pick') return fail('Não há nenhuma escolha pendente.');
  if (pend.seat !== seat) return fail('Essa escolha não é sua.');
  const ids = a.cardIds;
  if (new Set(ids).size !== ids.length) fail('Escolha cartas diferentes.');
  if (ids.length < pend.min || ids.length > pend.max) fail(`Escolha ${pend.min === pend.max ? pend.max : `de ${pend.min} a ${pend.max}`} carta(s).`);
  const picked = ids.map(id => pend.options.find(o => o.id === id) ?? fail('Carta inválida para essa escolha.'));
  const p = P(c, seat);
  c.s.pending = null;

  // Cards taken from the deck / graveyard arrive as fresh copies in the hand.
  const toHand = (card: Card) => {
    const copy = cardFromName(c.s, card.name, 'h');
    p.hand.push(copy);
    c.ev.push({ t: 'draw', seat, card: copy, reason: 'effect' });
  };

  if (pend.mode === 'graveyard_soldier') {
    const chosen = picked[0];
    p.graveyard = p.graveyard.filter(g => g.id !== chosen.id);
    toHand(chosen);
    log(c, seat, `${chosen.name} voltou para sua mão!`);
  } else if (pend.mode === 'deck_search') {
    takeFromDeck(p, picked[0].name);
    p.drawPile = shuffled(c.s, p.drawPile);
    toHand(picked[0]);
    log(c, seat, `${picked[0].name} adicionada à mão!`, true);
  } else if (pend.mode === 'top_reveal') {
    picked.forEach(toHand);
    const pickedIds = new Set(picked.map(x => x.id));
    const rest = pend.options.filter(o => !pickedIds.has(o.id));
    if (pend.restTo === 'graveyard') {
      rest.forEach(o => discard(c, seat, o));   // the cards not kept are lost for good
    } else {
      p.drawPile.push(...rest.map(o => o.name));   // the cards not kept go under the deck — still part of it
      p.deckList.push(...rest.map(o => o.name));
    }
    log(c, seat, `${picked.length} carta(s) adicionada(s) à mão!`);
  } else if (pend.mode === 'summon') {
    const slots = pend.slots ?? [];
    picked.forEach((card, i) => {
      const slot = slots[i];
      if (slot === undefined || p.board[slot]) return;
      const copy = cardFromName(c.s, card.name, 'h');
      p.board[slot] = copy;
      takeFromDeck(p, card.name);
      c.ev.push({ t: 'summon', seat, slot, card: copy });
    });
    p.drawPile = shuffled(c.s, p.drawPile);
    log(c, seat, `${picked.length} soldado(s) convocado(s)! Deck embaralhado.`);
  }
  if (pend.source) discard(c, seat, pend.source);
};

// ── Combat ──────────────────────────────────────────────────────────────────
const attack = (c: Ctx, seat: Seat, a: Extract<Action, { type: 'attack' }>) => {
  assertCanAct(c, seat);
  const t = c.s.turn;
  if (t.phase !== 'combate') fail('Ataques só na fase de Combate!');
  const p = P(c, seat);
  const enemySeat = otherSeat(seat);
  const enemy = P(c, enemySeat);
  const attacker = p.board[a.from];
  if (!attacker) return fail('Não há unidade nesse slot.');
  if ((t.attackCounts[a.from] ?? 0) >= getMaxAttacksPerTurn(attacker)) fail('Essa unidade já atacou neste turno.');
  if (attacker.cardType === 'Infantaria' && isBackline(a.from)) fail('Infantaria na Retaguarda não pode atacar.');
  if (!enemy.board[a.to] || !getValidAttackTargets(a.from, p.board, enemy.board).has(a.to)) {
    fail('Alvo fora de alcance — tem uma carta bloqueando o caminho!');
  }
  c.ev.push({ t: 'attack', seat, from: a.from, to: a.to });

  // The defender may answer with an Emboscada — unless the attacker has an Infiltrado in its Vanguarda.
  const options = blocksAmbush(p.board) ? [] : enemy.hand.filter(h => h.cardType === 'Emboscada').map(h => h.id);
  if (options.length > 0) {
    c.s.pending = { kind: 'ambush', seat: enemySeat, attacker: seat, from: a.from, to: a.to, options };
    log(c, enemySeat, `${attacker.name} está atacando ${enemy.board[a.to]!.name} — ativar Emboscada?`);
    return;
  }
  resolveCombat(c, seat, a.from, a.to, null);
};

const respondAmbush = (c: Ctx, seat: Seat, a: Extract<Action, { type: 'ambush' }>) => {
  const pend = c.s.pending;
  if (!pend || pend.kind !== 'ambush') return fail('Não há nenhuma Emboscada a decidir.');
  if (pend.seat !== seat) return fail('Essa decisão não é sua.');
  let chosen: Card | null = null;
  if (a.cardId !== null) {
    if (!pend.options.includes(a.cardId)) fail('Essa Emboscada não pode ser usada agora.');
    chosen = removeFromHand(c, seat, a.cardId);
    discard(c, seat, chosen);
    c.ev.push({ t: 'ambush', seat, card: chosen });
    log(c, seat, `Emboscada ativada: ${chosen.name}!`);
  }
  c.s.pending = null;
  resolveCombat(c, pend.attacker, pend.from, pend.to, chosen);
};

// What a chosen Emboscada does to the attack that triggered it (its `ambush` verbs, in order). Mutates the two boards.
const resolveAmbushEffect = (
  c: Ctx, ambush: Card, attackerBoard: Board, attackerIndex: number, defenderBoard: Board, defenderIndex: number,
): { defenderIndex: number; cancelled: boolean } => {
  const unitSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let cancelled = false;
  verbsOn(ambush.name, 'ambush').forEach(v => {
    if (v.kind === 'cancel_attack') {
      // Cancels the attack — if asked to, only when the defender has an adjacent ally to lean on.
      const hasAlly = defenderIndex <= 9 && unitSlots.some(j => areSlotsAdjacent(defenderIndex, j) && defenderBoard[j]);
      if (!v.ifAdjacentAlly || hasAlly) cancelled = true;
    } else if (v.kind === 'swap_defender') {
      // The defender swaps with an adjacent ally, who takes the hit instead.
      if (defenderIndex <= 9) {
        const partner = unitSlots.find(j => areSlotsAdjacent(defenderIndex, j) && defenderBoard[j]);
        if (partner !== undefined) [defenderBoard[defenderIndex], defenderBoard[partner]] = [defenderBoard[partner], defenderBoard[defenderIndex]];
      }
    } else if (v.kind === 'displace_attacker') {
      // Yanks the ATTACKER to a random empty slot of its own side, so the attack never lands.
      const empty = unitSlots.filter(i => i !== attackerIndex && !attackerBoard[i]);
      if (empty.length > 0) {
        const dest = pickRandom(c.s, empty);
        attackerBoard[dest] = attackerBoard[attackerIndex];
        attackerBoard[attackerIndex] = null;
      }
      cancelled = true;
    } else if (v.kind === 'buff_defender') {
      const defender = defenderBoard[defenderIndex];
      if (defender) defenderBoard[defenderIndex] = { ...defender, atk: defender.atk + v.atk, hp: defender.hp + v.hp };
    }
  });
  return { defenderIndex, cancelled };
};

const resolveCombat = (c: Ctx, aSeat: Seat, from: number, to: number, ambush: Card | null) => {
  const t = c.s.turn;
  const dSeat = otherSeat(aSeat);
  const aBoard = P(c, aSeat).board;
  const dBoard = P(c, dSeat).board;
  const attacker = aBoard[from]!;
  let target = to;
  let cancelled = false;

  if (ambush) {
    const r = resolveAmbushEffect(c, ambush, aBoard, from, dBoard, to);
    target = r.defenderIndex;
    cancelled = r.cancelled;
    if (cancelled) c.ev.push({ t: 'cancelled', seat: aSeat, from, to });
  }

  // Counts as this unit's attack for the turn whatever happens (even a cancelled one).
  t.attackCounts[from] = (t.attackCounts[from] ?? 0) + 1;
  if (cancelled) return;

  const defender = dBoard[target]!;
  const dead: { seat: Seat; slot: number; card: Card }[] = [];

  let attackerAtk = getEffectiveAtk(attacker, from, aBoard, dBoard);
  // `attack_bonus` (Ofensiva): extra ATK for this attack, possibly only against a General of another faction.
  verbsOn(attacker.name, 'attack').forEach(v => {
    if (v.kind !== 'attack_bonus') return;
    const foeGeneral = dBoard[GENERAL_SLOT] ? getCardDef(dBoard[GENERAL_SLOT]!.name) : undefined;
    const myGeneral = aBoard[GENERAL_SLOT] ? getCardDef(aBoard[GENERAL_SLOT]!.name) : undefined;
    if (!v.ifEnemyGeneral || (foeGeneral && foeGeneral.faction !== myGeneral?.faction)) attackerAtk += v.amount;
  });
  const defenderAtk = getEffectiveAtk(defender, target, dBoard, aBoard);
  const attackerReduction = getIncomingDamageReduction(from, aBoard, dBoard);
  const defenderReduction = getIncomingDamageReduction(target, dBoard, aBoard);
  const attackerHpBonus = (attacker.pendingCombatBonus?.hp ?? 0) + getAuraCombatHpBonus(from, aBoard);
  const defenderHpBonus = (defender.pendingCombatBonus?.hp ?? 0) + getAuraCombatHpBonus(target, dBoard);
  const damageToDefender = Math.max(0, attackerAtk - defenderReduction);
  const damageToAttacker = Math.max(0, defenderAtk - attackerReduction);

  // Escudo / Bloqueio soak what they can before HP is touched (the retaliation of the blow is not affected by them).
  const defSoak = soak(c, dSeat, target, defender, damageToDefender);
  const atkSoak = soak(c, aSeat, from, attacker, damageToAttacker);
  const throughToDefender = defSoak.through, throughToAttacker = atkSoak.through;

  // Confessor Silencioso: a General that takes damage cannot use its ability on its next turn.
  if (target === 12 && throughToDefender > 0 && locksGeneralOnDamage(dBoard)) {
    P(c, dSeat).pendingGeneralBlock = true;
    log(c, dSeat, 'A habilidade do General foi bloqueada no próximo turno!');
  }

  // Bonus HP (Marechal do Sol Poente's aura, Aurelion's one-time +1/+1) is a buffer that exists only for this
  // combat: damage eats into it first and whatever is left of it disappears afterwards.
  const newAttacker: Card = { ...atkSoak.card, hp: attacker.hp - Math.max(0, throughToAttacker - attackerHpBonus), pendingCombatBonus: undefined };
  const newDefender: Card = { ...defSoak.card, hp: defender.hp - Math.max(0, throughToDefender - defenderHpBonus), pendingCombatBonus: undefined };
  c.ev.push({ t: 'damage', seat: aSeat, slot: from, amount: throughToAttacker });
  c.ev.push({ t: 'damage', seat: dSeat, slot: target, amount: throughToDefender });

  if (newAttacker.hp <= 0) { aBoard[from] = null; dead.push({ seat: aSeat, slot: from, card: newAttacker }); }
  else {
    aBoard[from] = newAttacker;
    // `after_attack` effects (Batedor's free reposition) — only for a unit that survived.
    runAbilities(c, aSeat, newAttacker, from, 'after_attack');
  }
  if (newDefender.hp <= 0) { dBoard[target] = null; dead.push({ seat: dSeat, slot: target, card: newDefender }); }
  else dBoard[target] = newDefender;

  // `splash_behind` (Ofensiva): hitting a Vanguarda card also hurts the card behind it in the same column.
  verbsOn(attacker.name, 'attack').forEach(v => {
    if (v.kind !== 'splash_behind' || !isFrontline(target) || !dBoard[target + 5]) return;
    const d = damageSlot(c, dSeat, target + 5, v.amount);
    if (d) dead.push({ seat: dSeat, ...d });
  });

  ([aSeat, dSeat] as Seat[]).forEach(seat => sendDestroyed(c, seat, dead.filter(d => d.seat === seat)));
};

// ── Movement ────────────────────────────────────────────────────────────────
const move = (c: Ctx, seat: Seat, a: Extract<Action, { type: 'move' }>) => {
  assertCanAct(c, seat);
  const t = c.s.turn;
  const free = t.batedorFree !== null && t.phase === 'combate';
  if (!(t.phase === 'movimentacao' || free)) fail('Só dá pra reposicionar na fase de Movimentação!');
  if (a.from > 9 || a.to > 9 || a.from < 0 || a.to < 0) fail('Essa carta não pode ser reposicionada.');
  const board = P(c, seat).board;
  const mover = board[a.from];
  if (!mover) return fail('Não há unidade nesse slot.');
  if (free) {
    if (a.from !== t.batedorFree) fail('Só dá pra mover o Batedor que acabou de atacar.');
  } else if (t.moved.includes(a.from) && t.bonusRepositions <= 0) {
    fail('Essa unidade já se reposicionou nesse turno.');
  }
  if (!canReposition(mover, a.from, a.to)) fail('Só dá pra reposicionar para um slot adjacente!');

  const wasAlreadyMoved = t.moved.includes(a.from);
  const occupant = board[a.to];
  board[a.from] = occupant;
  board[a.to] = mover;
  c.ev.push({ t: 'move', seat, from: a.from, to: a.to, swapped: !!occupant });
  runAbilities(c, seat, mover, a.to, 'move');

  if (free) {
    t.batedorFree = null;
    log(c, seat, 'Batedor se reposicionou após o combate!');
    return;
  }
  [a.from, a.to].forEach(i => { if (!t.moved.includes(i)) t.moved.push(i); });
  if (wasAlreadyMoved) t.bonusRepositions = Math.max(0, t.bonusRepositions - 1);
};

// ── Phases ──────────────────────────────────────────────────────────────────
const advance = (c: Ctx, seat: Seat) => {
  assertCanAct(c, seat);
  const t = c.s.turn;
  const phases = activePhases(c.s);
  const i = phases.indexOf(t.phase);
  if (i < phases.length - 1) {
    t.phase = phases[i + 1];
    t.batedorFree = null; // the free Batedor move only exists right after combat
    c.ev.push({ t: 'phase', seat, phase: t.phase });
    return;
  }
  // Effects can push a hand past the limit during the turn; at the end of it the seat has to discard the excess.
  const excess = P(c, seat).hand.length - HAND_LIMIT;
  if (excess > 0) {
    c.s.pending = { kind: 'discard', seat, count: excess };
    log(c, seat, `Você tem ${P(c, seat).hand.length} cartas: descarte ${excess} para terminar o turno.`);
    return;
  }
  endTurn(c);
};

// The discard that ends a turn which ran over the hand limit.
const discardExcess = (c: Ctx, seat: Seat, a: Extract<Action, { type: 'discard' }>) => {
  assertCanAct(c, seat, true);
  const pend = c.s.pending;
  if (!pend || pend.kind !== 'discard') return fail('Não há descarte pendente.');
  if (pend.seat !== seat) return fail('Esse descarte não é seu.');
  const ids = a.cardIds;
  if (new Set(ids).size !== ids.length) fail('Escolha cartas diferentes.');
  if (ids.length !== pend.count) fail(`Descarte exatamente ${pend.count} carta(s).`);
  const hand = P(c, seat).hand;
  if (!ids.every(id => hand.some(h => h.id === id))) fail('Essa carta não está na sua mão.');
  ids.forEach(id => discard(c, seat, removeFromHand(c, seat, id)));
  c.s.pending = null;
  log(c, seat, `${ids.length} carta(s) descartada(s).`);
  endTurn(c);
};

// ── Entry point ─────────────────────────────────────────────────────────────
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

export const applyAction = (state: GameState, seat: Seat, action: Action): ActionResult => {
  const c: Ctx = { s: clone(state), ev: [] };
  try {
    switch (action.type) {
      case 'begin':
        if (c.s.turn.started) fail('A partida já começou.');
        c.s.turn.started = true;
        startTurn(c, c.s.turn.first);
        break;
      case 'choose_first':
        if (c.s.turn.started) fail('A partida já começou.');
        if (seat !== c.s.turn.active) fail('Só quem ganhou a moeda escolhe quem começa.');
        c.s.turn.first = c.s.turn.active = action.goFirst ? seat : otherSeat(seat);
        break;
      case 'play': playCard(c, seat, action); break;
      case 'attack': attack(c, seat, action); break;
      case 'move': move(c, seat, action); break;
      case 'ability': useAbility(c, seat, action); break;
      case 'ambush': respondAmbush(c, seat, action); break;
      case 'choose': choose(c, seat, action); break;
      case 'discard': discardExcess(c, seat, action); break;
      case 'upkeep': payUpkeep(c, seat, action); break;
      case 'relic_mode': setRelicMode(c, seat, action); break;
      case 'advance': advance(c, seat); break;
      case 'concede':
        if (c.s.winner !== null) fail('A partida já terminou.');
        setWinner(c, otherSeat(seat));
        break;
      default:
        fail('Ação desconhecida.');
    }
  } catch (e) {
    if (e instanceof RuleError) return { ok: false, error: e.message };
    throw e;
  }
  return { ok: true, state: c.s, events: c.ev };
};

// ── Match record ────────────────────────────────────────────────────────────
// A match is fully described by how it was created plus the actions that were applied, in order. Keeping that
// record (for every match, against the AI or a person) lets a server re-run it to check a result before
// rewarding it, and lets anything be replayed.
export interface MatchLog {
  seed: number;
  decks: [DeckSetup, DeckSetup];
  first: Seat;
  actions: { seat: Seat; action: Action }[];
}

export const newMatchLog = (opts: MatchOptions): MatchLog => ({ seed: opts.seed, decks: opts.decks, first: opts.first, actions: [] });

// Re-runs a record from scratch. Fails (ok: false) if any recorded action is no longer legal.
export const replayMatch = (log: MatchLog): ActionResult => {
  let state = createMatch({ seed: log.seed, decks: log.decks, first: log.first }).state;
  let events: GameEvent[] = [];
  for (const { seat, action } of log.actions) {
    const r = applyAction(state, seat, action);
    if (r.ok === false) return r;
    state = r.state;
    events = events.concat(r.events);
  }
  return { ok: true, state, events };
};
