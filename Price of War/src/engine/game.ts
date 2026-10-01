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
  GOLD_FROM_ROUND, GOLD_PER_TURN, HAND_LIMIT, START_GOLD, START_HAND,
  EQUIP_ALLOWED_TYPES, SOLDIER_TYPES, TARGETABLE_TACTICS,
  adjacentSlots, areSlotsAdjacent, canPlaceInSlot, canReposition, getAuraCombatHpBonus, getCardDropKind,
  getEffectiveAtk, getIncomingDamageReduction, getMaxAttacksPerTurn, getMoveRow, getValidAttackTargets,
  hasEspiaoInVanguarda, hasEspiaoOnBoard, isBackline, isCardDamaged, isFrontline, isUnitSlot, phasesForTurn,
  withEquippedWeapons, type Board,
} from './rules';
import {
  GENERAL_SLOT, SLOT_COUNT, otherSeat,
  type Action, type ActionResult, type Card, type GameEvent, type GameState, type PlayerState, type Seat, type TurnPhase,
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
  // Who plays first (the coin toss decides this before the match is created).
  first: Seat;
}

const cardFromName = (s: GameState, name: string, prefix = 'c'): Card => {
  const def = requireCardDef(name);
  s.uid += 1;
  const card: Card = { id: `${prefix}${s.uid}`, name: def.name, cardType: def.cardType, atk: def.atk, hp: def.hp, cost: def.cost, effect: def.effect };
  if (def.isFullArt) card.isFullArt = true;
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

const log = (c: Ctx, seat: Seat, text: string) => { c.ev.push({ t: 'log', seat, text }); };
const P = (c: Ctx, seat: Seat) => c.s.players[seat];

export const combatOpen = (s: GameState): boolean => s.turn.round >= 2 || s.turn.active !== s.turn.first;
export const activePhases = (s: GameState): TurnPhase[] => phasesForTurn(combatOpen(s));

// ── Small state helpers ─────────────────────────────────────────────────────
const addGold = (c: Ctx, seat: Seat, delta: number, reason: 'turn' | 'spend' | 'gain') => {
  if (delta === 0) return;
  P(c, seat).gold += delta;
  c.ev.push({ t: 'gold', seat, delta, reason });
};

const drawCards = (c: Ctx, seat: Seat, n: number, reason: 'turn' | 'effect' | 'deal') => {
  const p = P(c, seat);
  for (let i = 0; i < n; i++) {
    if (p.drawPile.length === 0) p.drawPile = shuffled(c.s, p.deckList);
    const name = p.drawPile.shift();
    if (!name) return; // an empty deck list: nothing to draw
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

// Cards leaving the board for good: their Armamentos go along, Atirador da Cruzada pays out, and a
// fallen General ends the match.
const sendDestroyed = (c: Ctx, seat: Seat, entries: { slot: number; card: Card }[]) => {
  if (entries.length === 0) return;
  const p = P(c, seat);
  entries.forEach(({ slot, card }) => c.ev.push({ t: 'destroyed', seat, slot, card }));
  const cards = entries.map(e => e.card);
  withEquippedWeapons(cards).forEach(card => { p.graveyard.push(card); c.ev.push({ t: 'graveyard', seat, card }); });
  const atiradores = cards.filter(card => card.name === 'Atirador da Cruzada').length;
  if (atiradores > 0) drawCards(c, seat, atiradores * 2, 'effect');
  if (cards.some(card => card.cardType === 'General')) setWinner(c, otherSeat(seat));
};

const setWinner = (c: Ctx, seat: Seat) => {
  if (c.s.winner !== null) return;
  c.s.winner = seat;
  c.ev.push({ t: 'winner', seat });
};

// Flat damage straight to a slot (effects, splash) — no armor math, destroyed at 0 HP.
const damageSlot = (c: Ctx, seat: Seat, slot: number, amount: number): { slot: number; card: Card } | null => {
  const board = P(c, seat).board;
  const card = board[slot];
  if (!card) return null;
  c.ev.push({ t: 'damage', seat, slot, amount });
  const hp = card.hp - amount;
  if (hp <= 0) {
    board[slot] = null;
    return { slot, card: { ...card, hp } };
  }
  board[slot] = { ...card, hp };
  return null;
};

// Recruta Devoto: "Ao ser curado: recebe +1 ATK permanente."
const healSlot = (c: Ctx, seat: Seat, slot: number, amount: number) => {
  const board = P(c, seat).board;
  const card = board[slot]!;
  let healed: Card = { ...card, hp: card.hp + amount };
  if (healed.name === 'Recruta Devoto') healed = { ...healed, atk: healed.atk + 1 };
  board[slot] = healed;
  c.ev.push({ t: 'heal', seat, slot, amount });
};

// Nobre da Cruzada: "Ao entrar em campo: invoca Soldados Leais nos slots adjacentes livres da mesma fileira."
const applyNobreSummon = (c: Ctx, seat: Seat, slot: number) => {
  const board = P(c, seat).board;
  if (board[slot]?.name !== 'Nobre da Cruzada' || slot > 9) return;
  [slot - 1, slot + 1].forEach(j => {
    if (areSlotsAdjacent(slot, j) && !board[j]) {
      const token = cardFromName(c.s, 'Soldado Leal', 't');
      board[j] = token;
      c.ev.push({ t: 'summon', seat, slot: j, card: token });
    }
  });
};

// Capitão de Formação: "Ao mover: adjacentes +1 ATK" (this turn only).
const applyFormationCaptainBuff = (c: Ctx, seat: Seat, slot: number) => {
  const board = P(c, seat).board;
  if (board[slot]?.name !== 'Capitão de Formação') return;
  adjacentSlots(slot).forEach(j => {
    if (board[j]) {
      board[j] = { ...board[j]!, formationBuffAtk: (board[j]!.formationBuffAtk ?? 0) + 1 };
      c.ev.push({ t: 'buff', seat, slot: j, atk: 1, hp: 0 });
    }
  });
};

// ── Turn flow ───────────────────────────────────────────────────────────────
const startTurn = (c: Ctx, seat: Seat) => {
  const t = c.s.turn;
  const p = P(c, seat);
  t.active = seat;
  t.phase = 'preparacao';
  t.moved = [];
  t.bonusRepositions = 0;
  t.batedorFree = null;
  t.attackCounts = {};
  t.activated = [];
  c.ev.push({ t: 'turn_start', seat, round: t.round });

  // Gold is a growing, saved-up pile: nothing in round 1, then +5 every turn without a cap.
  if (t.round >= GOLD_FROM_ROUND) addGold(c, seat, GOLD_PER_TURN, 'turn');

  // Capitão de Formação's buff only lasts until its owner's next turn begins.
  p.board.forEach((card, i) => { if (card?.formationBuffAtk) p.board[i] = { ...card, formationBuffAtk: 0 }; });

  p.generalAbilityUses = 0;
  p.generalAbilityBlocked = p.pendingGeneralBlock;
  p.pendingGeneralBlock = false;

  // No cap on drawing: the hand limit is only enforced at the END of a turn (see advance).
  drawCards(c, seat, 1, 'turn');
  // Intendente do Exército: with fewer than 2 cards in hand, draw up to 2.
  if (p.board.some((card, i) => i <= 9 && card?.name === 'Intendente do Exército') && p.hand.length < 2) {
    drawCards(c, seat, 2 - p.hand.length, 'effect');
  }
  c.ev.push({ t: 'phase', seat, phase: 'preparacao' });
};

// Comandante Aurelion: "Após Remanejamento: até 2 unidades que se moveram ganham +1/+1 no próximo combate."
const grantAurelionBuff = (c: Ctx, seat: Seat) => {
  const board = P(c, seat).board;
  if (board[GENERAL_SLOT]?.name !== 'Comandante Aurelion, Mestre da Formação' || c.s.turn.moved.length === 0) return;
  c.s.turn.moved.filter(i => board[i]).slice(0, 2).forEach(i => {
    board[i] = { ...board[i]!, pendingCombatBonus: { atk: 1, hp: 1 } };
    c.ev.push({ t: 'buff', seat, slot: i, atk: 1, hp: 1 });
  });
};

// Soldado Tático: swaps with an adjacent ally at the end of its owner's turn (once per pass).
const applyEndOfTurnSwaps = (c: Ctx, seat: Seat) => {
  const board = P(c, seat).board;
  const settled = new Set<number>();
  for (let i = 0; i <= 9; i++) {
    if (settled.has(i) || board[i]?.name !== 'Soldado Tático') continue;
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
  grantAurelionBuff(c, seat);
  applyEndOfTurnSwaps(c, seat);
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

// ── Playing a card ──────────────────────────────────────────────────────────
const uniqueByName = (names: string[]) => [...new Set(names)];

const playCard = (c: Ctx, seat: Seat, a: Extract<Action, { type: 'play' }>) => {
  assertCanAct(c, seat);
  const p = P(c, seat);
  const enemySeat = otherSeat(seat);
  const enemy = P(c, enemySeat);
  const card = p.hand.find(h => h.id === a.cardId);
  if (!card) return fail('Essa carta não está na sua mão.');
  // Cards are played in Preparação — except Avanço Coordenado ("Após mover: +2 ATK"), which can only ever be
  // used on a unit that already moved this turn, and moving happens in Movimentação.
  const inMovement = c.s.turn.phase === 'movimentacao' && card.name === 'Avanço Coordenado';
  if (c.s.turn.phase !== 'preparacao' && !inMovement) fail('Jogar cartas só na fase de Preparação!');
  if (p.gold < card.cost) fail('Ouro insuficiente!');

  // Spends the cost and takes the card out of the hand — only called once everything is validated.
  const commit = () => {
    removeFromHand(c, seat, card.id);
    addGold(c, seat, -card.cost, 'spend');
    c.ev.push({ t: 'play', seat, card });
  };
  const toGraveyard = () => discard(c, seat, card);

  // Opens a pick prompt (search / reveal).
  const openPick = (mode: 'graveyard_soldier' | 'deck_search' | 'top_reveal' | 'summon', title: string, options: Card[], min: number, max: number, extra: { revealed?: boolean; slots?: number[] } = {}) => {
    c.s.pending = { kind: 'pick', seat, mode, title, options, min, max, source: card, ...extra };
    c.ev.push({ t: 'pick', seat, title });
  };
  const optionsFromNames = (names: string[]) => uniqueByName(names).map(n => cardFromName(c.s, n, 'o'));
  const requireTarget = (needsSlot: number | undefined, message: string): number => {
    if (needsSlot === undefined) return fail(message);
    return needsSlot;
  };

  const kind = getCardDropKind(card);

  if (kind === 'place') {
    const slot = requireTarget(a.slot, 'Escolha um slot para a carta.');
    if (slot === 12) fail('O General não pode ser substituído!');
    if ((slot === 10 || slot === 11) && card.cardType !== 'Relíquia' && card.cardType !== 'Terreno') fail('Esse slot é só para Relíquia ou Terreno!');
    if (slot <= 9 && (card.cardType === 'Relíquia' || card.cardType === 'Terreno')) fail('Relíquia/Terreno só pode ir no slot especial ao lado do General!');
    if (card.cardType === 'Relíquia' && slot !== 10) fail('A Relíquia vai no slot especial da esquerda do General.');
    if (card.cardType === 'Terreno' && slot !== 11) fail('O Terreno vai no slot especial da direita do General.');
    if (!canPlaceInSlot(card.cardType, slot)) fail('Esse slot não aceita essa carta.');
    if (p.board[slot]) fail('Esse slot já está ocupado!');
    commit();
    p.board[slot] = card;
    c.ev.push({ t: 'place', seat, slot, card });
    applyNobreSummon(c, seat, slot);
    return;
  }

  if (kind === 'blocked') {
    if (card.cardType === 'Emboscada') fail('Emboscadas ativam sozinhas quando você é atacado — mantenha na mão.');
    fail('Essa Tática ainda não pode ser jogada.');
  }

  if (kind === 'immediate') {
    switch (card.name) {
      case 'Reformar Linhas':
        commit(); toGraveyard();
        c.s.turn.bonusRepositions += 3;
        log(c, seat, 'Reformar Linhas: +3 reposicionamentos bônus neste turno!');
        return;
      case 'Tributo de Guerra':
        commit(); toGraveyard();
        addGold(c, seat, 1, 'gain');
        log(c, seat, 'Tributo de Guerra: +1 ouro neste turno!');
        return;
      case 'Trabuco de Cerco': {
        commit(); toGraveyard();
        const dead: { slot: number; card: Card }[] = [];
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12].forEach(i => {
          const d = damageSlot(c, enemySeat, i, 2);
          if (d) dead.push(d);
        });
        log(c, seat, 'Trabuco de Cerco: 2 de dano a todas as unidades inimigas!');
        sendDestroyed(c, enemySeat, dead);
        return;
      }
      case 'Retorno do Soldado': {
        const options = p.graveyard.filter(g => SOLDIER_TYPES.includes(g.cardType));
        if (options.length === 0) fail('Não há soldados no cemitério.');
        commit();
        openPick('graveyard_soldier', 'Escolha um soldado do cemitério para adicionar à mão', options, 1, 1);
        return;
      }
      case 'Graal da Dádiva': {
        const names = p.deckList.filter(n => { const t = getCardDef(n)?.cardType; return t === 'Terreno' || t === 'Relíquia'; });
        if (names.length === 0) fail('Não há Terreno ou Relíquia no deck.');
        commit();
        openPick('deck_search', 'Escolha uma carta de Terreno ou Relíquia do deck', optionsFromNames(names), 1, 1);
        return;
      }
      case 'Doutrina Renovada': {
        const names = p.deckList.filter(n => getCardDef(n)?.cardType === 'Tática');
        if (names.length === 0) fail('Não há Táticas no deck.');
        commit();
        openPick('deck_search', 'Escolha uma Tática do deck para adicionar à mão', optionsFromNames(names), 1, 1);
        return;
      }
      case 'Recrutamento Seletivo': {
        const names = p.deckList.filter(n => SOLDIER_TYPES.includes(getCardDef(n)!.cardType));
        if (names.length === 0) fail('Não há soldados no deck.');
        commit();
        openPick('deck_search', 'Escolha um soldado do deck para adicionar à mão', optionsFromNames(names), 1, 1);
        return;
      }
      case 'Recrutar Veteranos': {
        commit();
        if (p.drawPile.length < 4) p.drawPile = [...p.drawPile, ...shuffled(c.s, p.deckList)];
        const revealed = p.drawPile.splice(0, 4).map(n => cardFromName(c.s, n, 'o'));
        openPick('top_reveal', 'Veja as 4 cartas do topo — escolha 2 para a mão', revealed, 1, 2, { revealed: true });
        return;
      }
      case 'Chamado às Armas': {
        const names = p.deckList.filter(n => { const d = getCardDef(n)!; return SOLDIER_TYPES.includes(d.cardType) && d.atk === 0; });
        const slots = [0, 1, 2, 3, 4].filter(i => !p.board[i]);
        if (names.length === 0) fail('Não há soldados de 0 ATK no deck.');
        if (slots.length === 0) fail('Não há slots livres na Vanguarda.');
        commit();
        const max = Math.min(2, slots.length);
        openPick('summon', `Escolha até ${max} soldado(s) de 0 ATK para invocar na Vanguarda`, optionsFromNames(names), 1, max, { slots });
        return;
      }
      default:
        fail('Essa Tática ainda não pode ser jogada.');
    }
  }

  // Targeted Táticas.
  const tactic = TARGETABLE_TACTICS[card.name];
  const slot = requireTarget(a.target, 'Escolha um alvo no campo.');
  const own = p.board;
  const foe = enemy.board;

  if (tactic === 'avanco_coordenado') {
    if (slot > 9 || !own[slot]) fail('Escolha uma unidade sua no campo.');
    if (!c.s.turn.moved.includes(slot)) fail('Essa unidade não se moveu neste turno.');
    commit(); toGraveyard();
    own[slot] = { ...own[slot]!, atk: own[slot]!.atk + 2 };
    c.ev.push({ t: 'buff', seat, slot, atk: 2, hp: 0 });
    log(c, seat, `${own[slot]!.name} recebeu +2 ATK!`);
  } else if (tactic === 'linha_fechada') {
    if (slot > 9 || !own[slot]) fail('Escolha uma unidade sua no campo.');
    commit(); toGraveyard();
    adjacentSlots(slot).forEach(j => { if (own[j]) own[j] = { ...own[j]!, dmgReduction: (own[j]!.dmgReduction ?? 0) + 1 }; });
    log(c, seat, 'Linha Fechada: aliados adjacentes recebem menos dano!');
  } else if (tactic === 'ordem_retirada') {
    if (!isFrontline(slot) || !own[slot]) fail('Escolha uma unidade sua na Vanguarda.');
    const back = slot + 5;
    if (own[back]) fail('A Retaguarda dessa coluna já está ocupada.');
    commit(); toGraveyard();
    const moved = { ...own[slot]!, hp: own[slot]!.hp + 2 };
    own[back] = moved;
    own[slot] = null;
    c.ev.push({ t: 'move', seat, from: slot, to: back, swapped: false });
    c.ev.push({ t: 'heal', seat, slot: back, amount: 2 });
    log(c, seat, `${moved.name} recuou para a Retaguarda e recuperou 2 HP!`);
  } else if (tactic === 'equip_armadura' || tactic === 'equip_corcelete' || tactic === 'equip_flecha' || tactic === 'equip_espada') {
    const allowed = EQUIP_ALLOWED_TYPES[tactic];
    const target = own[slot];
    if (slot > 9 || !target || !allowed.includes(target.cardType)) fail(`Escolha uma unidade do tipo certo: ${allowed.join(' ou ')}.`);
    commit();
    const atkBonus = tactic === 'equip_flecha' ? 1 : tactic === 'equip_espada' ? 2 : 0;
    const hpBonus = tactic === 'equip_armadura' ? 2 : tactic === 'equip_corcelete' ? 1 : 0;
    own[slot] = { ...target!, atk: target!.atk + atkBonus, hp: target!.hp + hpBonus, equippedWeapons: [...(target!.equippedWeapons ?? []), card] };
    c.ev.push({ t: 'equip', seat, slot, card });
    log(c, seat, `${target!.name} equipado: ${card.name}!`);
  } else if (tactic === 'reposicionamento_rapido') {
    if (slot > 9 || !foe[slot]) fail('Escolha uma unidade inimiga no campo.');
    commit(); toGraveyard();
    const free = adjacentSlots(slot).filter(j => !foe[j]);
    if (free.length > 0) {
      const dest = pickRandom(c.s, free);
      foe[dest] = foe[slot];
      foe[slot] = null;
      c.ev.push({ t: 'move', seat: enemySeat, from: slot, to: dest, swapped: false });
      log(c, seat, 'Reposicionamento Rápido: unidade inimiga deslocada!');
    } else {
      log(c, seat, 'Não havia slot livre adjacente para deslocar a unidade.');
    }
  } else if (tactic === 'balesta') {
    if (slot > 9 || !foe[slot]) fail('Escolha uma unidade inimiga no campo.');
    commit(); toGraveyard();
    const d = damageSlot(c, enemySeat, slot, 3);
    log(c, seat, 'Balestra de Precisão: 3 de dano causado!');
    if (d) sendDestroyed(c, enemySeat, [d]);
  } else if (tactic === 'catapulta') {
    if (slot > 9) fail('Escolha uma fileira inimiga (Vanguarda ou Retaguarda).');
    commit(); toGraveyard();
    const row = getMoveRow(slot) === 0 ? [0, 1, 2, 3, 4] : [5, 6, 7, 8, 9];
    const dead: { slot: number; card: Card }[] = [];
    row.forEach(i => { const d = damageSlot(c, enemySeat, i, 2); if (d) dead.push(d); });
    log(c, seat, 'Catapulta de Guerra: 2 de dano em toda a fileira!');
    sendDestroyed(c, enemySeat, dead);
  } else {
    fail('Essa Tática ainda não pode ser jogada.');
  }
};

// ── Abilities ───────────────────────────────────────────────────────────────
const useAbility = (c: Ctx, seat: Seat, a: Extract<Action, { type: 'ability' }>) => {
  assertCanAct(c, seat);
  if (c.s.turn.phase !== 'preparacao') fail('Habilidades só na fase de Preparação.');
  const p = P(c, seat);
  const enemySeat = otherSeat(seat);
  const card = p.board[a.slot];
  if (!card) return fail('Não há carta nesse slot.');
  const usedUp = c.s.turn.activated.includes(card.id);

  if (a.slot === GENERAL_SLOT) {
    if (card.name !== 'Cardeal Pedro, Voz da Fé') fail('Esse General não tem habilidade ativa.');
    if (p.generalAbilityUses >= 1) fail('A habilidade do General já foi usada neste turno.');
    if (p.generalAbilityBlocked) fail('Infiltrado da Ordem: a habilidade do General está bloqueada neste turno.');
    if (p.gold < 2) fail('Ouro insuficiente!');
    const target = a.target;
    if (target === undefined || target > 9 || !p.board[target]) fail('Escolha um soldado aliado no campo.');
    const amount = p.board[10]?.name === 'Cálice da Graça' ? 2 : 1;
    addGold(c, seat, -2, 'spend');
    p.generalAbilityUses += 1;
    c.ev.push({ t: 'ability', seat, slot: a.slot, name: card.name });
    healSlot(c, seat, target!, amount);
    log(c, seat, `${p.board[target!]!.name} recuperou ${amount} HP!`);
    return;
  }

  if (!isUnitSlot(a.slot)) fail('Essa carta não tem habilidade ativa.');

  if (card.name === 'Mercador da Cruzada') {
    if (usedUp) fail('Essa habilidade já foi usada neste turno.');
    c.s.turn.activated.push(card.id);
    c.ev.push({ t: 'ability', seat, slot: a.slot, name: card.name });
    if (p.drawPile.length < 2) p.drawPile = [...p.drawPile, ...shuffled(c.s, p.deckList)];
    const revealed = p.drawPile.splice(0, 2).map(n => cardFromName(c.s, n, 'o'));
    const title = 'Mercador da Cruzada: veja as 2 cartas do topo — escolha 1 para a mão';
    c.s.pending = { kind: 'pick', seat, mode: 'top_reveal', title, options: revealed, min: 1, max: 1, source: null, revealed: true };
    c.ev.push({ t: 'pick', seat, title });
    return;
  }

  if (card.name === 'Cavaleiro Hospitalário') {
    if (usedUp) fail('Essa habilidade já foi usada neste turno.');
    const foe = P(c, enemySeat).board;
    const hasDamaged = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(i => p.board[i] && isCardDamaged(p.board[i]!));
    const hasEnemyFront = [0, 1, 2, 3, 4].some(i => foe[i]);
    if (!hasDamaged && !hasEnemyFront) fail('Cavaleiro Hospitalário: nenhum alvo disponível.');
    if (hasDamaged) {
      const t1 = a.target;
      if (t1 === undefined || t1 > 9 || !p.board[t1] || !isCardDamaged(p.board[t1]!)) fail('Escolha um aliado ferido no campo.');
    }
    if (hasEnemyFront) {
      const t2 = a.target2;
      if (t2 === undefined || !isFrontline(t2) || !foe[t2]) fail('Escolha um inimigo na Vanguarda.');
    }
    c.s.turn.activated.push(card.id);
    c.ev.push({ t: 'ability', seat, slot: a.slot, name: card.name });
    if (hasDamaged) {
      healSlot(c, seat, a.target!, 1);
      log(c, seat, `${p.board[a.target!]!.name} recuperou 1 HP!`);
    }
    if (hasEnemyFront) {
      const d = damageSlot(c, enemySeat, a.target2!, 1);
      log(c, seat, 'Cavaleiro Hospitalário causou 1 de dano!');
      if (d) sendDestroyed(c, enemySeat, [d]);
    }
    return;
  }

  fail('Essa carta não tem habilidade ativa.');
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
    toHand(picked[0]);
    log(c, seat, `${picked[0].name} adicionada à mão!`);
  } else if (pend.mode === 'top_reveal') {
    picked.forEach(toHand);
    const pickedIds = new Set(picked.map(x => x.id));
    p.drawPile.push(...pend.options.filter(o => !pickedIds.has(o.id)).map(o => o.name));
    log(c, seat, `${picked.length} carta(s) adicionada(s) à mão!`);
  } else if (pend.mode === 'summon') {
    const slots = pend.slots ?? [];
    picked.forEach((card, i) => {
      const slot = slots[i];
      if (slot === undefined || p.board[slot]) return;
      const copy = cardFromName(c.s, card.name, 'h');
      p.board[slot] = copy;
      c.ev.push({ t: 'summon', seat, slot, card: copy });
    });
    p.drawPile = shuffled(c.s, p.deckList);
    log(c, seat, `${picked.length} soldado(s) invocado(s)! Deck embaralhado.`);
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
  const options = hasEspiaoInVanguarda(p.board) ? [] : enemy.hand.filter(h => h.cardType === 'Emboscada').map(h => h.id);
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

// What a chosen Emboscada does to the attack that triggered it. Mutates the two boards.
const resolveAmbushEffect = (
  c: Ctx, ambush: Card, attackerBoard: Board, attackerIndex: number, defenderBoard: Board, defenderIndex: number,
): { defenderIndex: number; cancelled: boolean } => {
  const unitSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  if (ambush.name === 'Bloqueio Instantâneo') {
    // Cancels the attack if the defender has an adjacent ally to lean on.
    const hasAlly = defenderIndex <= 9 && unitSlots.some(j => areSlotsAdjacent(defenderIndex, j) && defenderBoard[j]);
    return { defenderIndex, cancelled: hasAlly };
  }
  if (ambush.name === 'Contra-Manobra') {
    // Swaps the defender with an adjacent ally, who takes the hit instead.
    if (defenderIndex <= 9) {
      const partner = unitSlots.find(j => areSlotsAdjacent(defenderIndex, j) && defenderBoard[j]);
      if (partner !== undefined) {
        // The ally steps into the targeted slot and takes the hit; the original defender takes the ally's place.
        [defenderBoard[defenderIndex], defenderBoard[partner]] = [defenderBoard[partner], defenderBoard[defenderIndex]];
        return { defenderIndex, cancelled: false };
      }
    }
    return { defenderIndex, cancelled: false };
  }
  if (ambush.name === 'Formação Quebrada') {
    // Yanks the ATTACKER to a random empty slot of its own side, so the attack never lands.
    const empty = unitSlots.filter(i => i !== attackerIndex && !attackerBoard[i]);
    if (empty.length > 0) {
      const dest = pickRandom(c.s, empty);
      attackerBoard[dest] = attackerBoard[attackerIndex];
      attackerBoard[attackerIndex] = null;
    }
    return { defenderIndex, cancelled: true };
  }
  const buff = ambush.name === 'Reforços Ocultos' ? { atk: 2, hp: 1 } : { atk: 2, hp: 2 };
  const defender = defenderBoard[defenderIndex];
  if (defender) defenderBoard[defenderIndex] = { ...defender, atk: defender.atk + buff.atk, hp: defender.hp + buff.hp };
  return { defenderIndex, cancelled: false };
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
  // Fanático da Cruzada: +2 ATK against a General that is not Cardeal Pedro (a stand-in for "tipo oposto").
  if (attacker.name === 'Fanático da Cruzada' && dBoard[12] && dBoard[12]!.name !== 'Cardeal Pedro, Voz da Fé') attackerAtk += 2;
  const defenderAtk = getEffectiveAtk(defender, target, dBoard, aBoard);
  const attackerReduction = getIncomingDamageReduction(from, aBoard);
  const defenderReduction = getIncomingDamageReduction(target, dBoard);
  const attackerHpBonus = (attacker.pendingCombatBonus?.hp ?? 0) + getAuraCombatHpBonus(attacker, aBoard);
  const defenderHpBonus = (defender.pendingCombatBonus?.hp ?? 0) + getAuraCombatHpBonus(defender, dBoard);
  const damageToDefender = Math.max(0, attackerAtk - defenderReduction);
  const damageToAttacker = Math.max(0, defenderAtk - attackerReduction);

  // Infiltrado da Ordem: a General that takes damage cannot use its ability on its next turn.
  if (target === 12 && damageToDefender > 0 && hasEspiaoOnBoard(dBoard)) {
    P(c, dSeat).pendingGeneralBlock = true;
    log(c, dSeat, 'Infiltrado da Ordem: a habilidade do General foi bloqueada no próximo turno!');
  }

  // Bonus HP (Comandante da Ordem's aura, Aurelion's one-time +1/+1) is a buffer that exists only for this
  // combat: damage eats into it first and whatever is left of it disappears afterwards.
  const newAttacker: Card = { ...attacker, hp: attacker.hp - Math.max(0, damageToAttacker - attackerHpBonus), pendingCombatBonus: undefined };
  const newDefender: Card = { ...defender, hp: defender.hp - Math.max(0, damageToDefender - defenderHpBonus), pendingCombatBonus: undefined };
  c.ev.push({ t: 'damage', seat: aSeat, slot: from, amount: damageToAttacker });
  c.ev.push({ t: 'damage', seat: dSeat, slot: target, amount: damageToDefender });

  if (newAttacker.hp <= 0) { aBoard[from] = null; dead.push({ seat: aSeat, slot: from, card: newAttacker }); }
  else {
    aBoard[from] = newAttacker;
    // Batedor: "Move após combate" — one free reposition right after landing an attack and surviving.
    if (attacker.name === 'Batedor') t.batedorFree = from;
  }
  if (newDefender.hp <= 0) { dBoard[target] = null; dead.push({ seat: dSeat, slot: target, card: newDefender }); }
  else dBoard[target] = newDefender;

  // Jorge, Lança Sagrada: attacking a Vanguarda card also hits the Retaguarda card in the same column for 2.
  if (attacker.name === 'Jorge, Lança Sagrada' && isFrontline(target) && dBoard[target + 5]) {
    const d = damageSlot(c, dSeat, target + 5, 2);
    if (d) dead.push({ seat: dSeat, ...d });
  }

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
  applyFormationCaptainBuff(c, seat, a.to);

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
      case 'play': playCard(c, seat, action); break;
      case 'attack': attack(c, seat, action); break;
      case 'move': move(c, seat, action); break;
      case 'ability': useAbility(c, seat, action); break;
      case 'ambush': respondAmbush(c, seat, action); break;
      case 'choose': choose(c, seat, action); break;
      case 'discard': discardExcess(c, seat, action); break;
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
