import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Info, X, ArrowUp, ArrowDown, Lock, ChevronRight, Hourglass, Sparkles } from 'lucide-react';
import { playAiTurn, AiAction } from './services/aiService';
import boardBattlefieldImage from './assets/board-battlefield.webp';
import logoImage from './assets/logo-price-of-war.webp';
import startScreenBgImage from './assets/start-screen-bg.webp';
import buttonPlaqueImage from './assets/button-plaque.webp';
import cardTemplateImage from './assets/card-template.webp';
import cardTemplateSilverImage from './assets/card-template-silver.webp';
import cardTemplateChampagneImage from './assets/card-template-champagne.webp';
import cardBackplateImage from './assets/card-backplate.webp';
import cardTemplateFullArtGoldImage from './assets/card-template-fullart-gold.webp';
import multidaoDeFieisArt from './assets/card-multidao-de-fieis.webp';
import comercianteDasCruzadasArt from './assets/card-comerciante-das-cruzadas.webp';
import espiaoSabotadorArt from './assets/card-espiao-sabotador.webp';
import soldadoFanaticoArt from './assets/card-soldado-fanatico.webp';
import vigiaDeMantimentosArt from './assets/card-vigia-de-mantimentos.webp';
import infantariaTreinadaArt from './assets/card-infantaria-treinada.webp';
import jorgeOLanceiroArt from './assets/card-jorge-o-lanceiro.webp';
import hospitalarioArt from './assets/card-hospitalario.webp';
import arqueiroProfissionalArt from './assets/card-arqueiro-profissional.webp';
import atiradorInfluenteArt from './assets/card-atirador-influente.webp';
import cardealPedroFullArt from './assets/card-cardeal-pedro-full.webp';
import caliceDaVidaFullArt from './assets/card-calice-da-vida-full.webp';
import nobreReligiosoFullArt from './assets/card-nobre-religioso-full.webp';
import liderDeEsquadraoFullArt from './assets/card-lider-de-esquadrao-full.webp';

export type CardType = 'Infantaria' | 'Cavalaria' | 'Arqueiro' | 'Artilharia' | 'General' | 'Relíquia' | 'Terreno' | 'Tática' | 'Emboscada';

export type CardData = {
  id: string;
  name: string;
  atk: number;
  hp: number;
  cost: number;
  art: string;
  effect: string;
  cardType?: CardType;
  isDestroyed?: boolean;
  // A handful of the most iconic cards (the Generals, for now — see DECK_CAPITAO/
  // DECK_CARDEAL) are marked as the "full art, legendary-weight" tier. Playing one
  // makes the whole board react (see triggerFullArtReaction): a stronger camera
  // shake and every other card on the field flinches, like a big finisher landing.
  isFullArt?: boolean;
  // A one-time "+X ATK/+X HP in its next combat" bonus — currently only granted by
  // Comandante Aurelion's active ability (see grantAurelionBuff) — consumed the
  // next time this exact card instance attacks or defends (see getEffectiveAtk and
  // the combat resolution blocks' own pendingCombatBonus.hp handling).
  pendingCombatBonus?: { atk: number; hp: number };
  // A permanent stack of "-1 damage taken" stamps — currently only granted by
  // Linha Fechada (see resolveOwnTacticTarget) to whoever was adjacent to the
  // chosen unit at cast time. Read in getIncomingDamageReduction alongside the
  // General/Fortaleza aura checks.
  dmgReduction?: number;
  // The explicit exception to "Táticas are single-use and never sit on the board":
  // an Armamento (Armadura Pesada/Corcelete/Flecha Envenenada/Espada Longa) doesn't
  // go to the graveyard when used — it stays equipped, rendered as a card peeking
  // out from behind this one (see CardSlot), until this unit dies (see
  // graveyardWithEquipment, which sends any equipped weapons along with it).
  equippedWeapons?: CardData[];
};

// Slot layout per side (13 slots):
//   0-4  = Vanguarda (frontline, 5 columns)
//   5-9  = Retaguarda (backline, 5 columns)
//   10   = slot especial de Relíquia (ao lado do General)
//   11   = slot especial de Terreno (ao lado do General)
//   12   = General (fixo, colocado no início da partida — não vem da mão)

export type SlotHint = 'primary' | 'secondary' | 'invalid';

// Where a given card type can go, for the "where can I play this" indicators shown
// while a card is being placed. 'primary' = its efficient spot, 'secondary' = allowed
// but not ideal, 'invalid' = can't go there at all. This is a simple first pass —
// most types just care about Vanguarda vs Retaguarda for now; per-type nuance (e.g.
// archers preferring the backline) can refine this later.
const getSlotHint = (cardType: CardType | undefined, slotIndex: number): SlotHint => {
  if (slotIndex === 12) return 'invalid'; // General slot is fixed, never playable from hand
  // Emboscada cards only resolve via the ambush interrupt (see maybeActivatePlayerAmbush)
  // and Táticas either resolve immediately or via their own on-board targeting flow (see
  // TARGETABLE_TACTICS) — neither is ever dropped onto a slot like a creature.
  if (cardType === 'Emboscada' || cardType === 'Tática') return 'invalid';
  const isSpecialSlot = slotIndex === 10 || slotIndex === 11; // beside the General: Relíquia/Terreno only
  const isFieldOnlyCard = cardType === 'Relíquia' || cardType === 'Terreno';
  if (isSpecialSlot) return isFieldOnlyCard ? 'primary' : 'invalid';
  if (isFieldOnlyCard) return 'invalid';
  return slotIndex <= 4 ? 'primary' : 'secondary'; // Vanguarda (efficient) vs Retaguarda (less efficient)
};

// Lane-based combat targeting — ported from an earlier, fully-art version of this
// project (see git history: commit 8a3d7b8, later reverted for being too broken to
// keep) so the tactical rules survive even though that build didn't. Each side has 5
// lanes (columns 0-4): a Vanguarda (front) slot and a Retaguarda (back) slot per lane,
// plus a center lane holding the General (col 2) and the two special slots beside it
// (10 at col 1, 11 at col 3).
const isFrontline = (slotIndex: number) => slotIndex >= 0 && slotIndex <= 4;
const isBackline = (slotIndex: number) => slotIndex >= 5 && slotIndex <= 9;
const getLaneCol = (slotIndex: number) => {
  if (isFrontline(slotIndex)) return slotIndex;
  if (isBackline(slotIndex)) return slotIndex - 5;
  return -1; // General/Relíquia/Terreno don't occupy a lane themselves
};

const getValidAttackTargets = (
  attackerIndex: number,
  attackerSlots: (CardData | null)[],
  enemySlots: (CardData | null)[]
): Set<number> => {
  const validTargets = new Set<number>();
  const attacker = attackerSlots[attackerIndex];
  if (!attacker) return validTargets;

  // The General/Relíquia/Terreno don't initiate attacks.
  const attackerCol = getLaneCol(attackerIndex);
  if (attackerCol === -1) return validTargets;

  // Infantaria posted in the Retaguarda doesn't attack at all — a positioning
  // trade-off for whatever defensive perk it gets back there.
  if (attacker.cardType === 'Infantaria' && isBackline(attackerIndex)) return validTargets;

  // A non-ranged attacker with an enemy directly in front (same lane, enemy
  // Vanguarda) is FORCED to target only that card — no reaching past it. Ranged
  // units (Arqueiro/Artilharia) ignore this and can always consider all 3 lanes.
  const isRanged = attacker.cardType === 'Arqueiro' || attacker.cardType === 'Artilharia';
  const directFrontalEnemy = !isRanged && !!enemySlots[attackerCol];
  const scanCols = directFrontalEnemy
    ? [attackerCol]
    : [attackerCol - 1, attackerCol, attackerCol + 1].filter(c => c >= 0 && c <= 4);

  scanCols.forEach(col => {
    const frontIdx = col;
    const backIdx = col + 5;
    if (enemySlots[frontIdx]) {
      validTargets.add(frontIdx);
    } else if (enemySlots[backIdx]) {
      // The Retaguarda card in this lane is only reachable while its own
      // Vanguarda is empty.
      validTargets.add(backIdx);
    }
  });

  // Center lane (General at col 2, the two special slots at col 1/3): reachable
  // only when the attacker's scan angle includes that column AND the whole lane
  // leading to it (front + back) is completely clear of blockers.
  const centerLane: { col: number; target: number }[] = [
    { col: 1, target: 10 },
    { col: 2, target: 12 },
    { col: 3, target: 11 },
  ];
  centerLane.forEach(({ col, target }) => {
    if (!enemySlots[target]) return;
    if (!scanCols.includes(col)) return;
    const isPathClear = !enemySlots[col] && !enemySlots[col + 5];
    if (isPathClear) validTargets.add(target);
  });

  return validTargets;
};

// Turn phases — a turn is split into Preparação (both play cards from hand AND
// reposition units, in any order) and Batalha (attack). Battle doesn't unlock until
// turn 3 (ported from the earlier full-art version, commit 8a3d7b8), so the opening
// turns are purely about setting up a formation before anyone can fight. Draw isn't a
// player-facing phase here — it already happens automatically at turn start (see the
// currentTurn effect).
//
// Reposicionar and Comando started out as separate, strictly-ordered phases, but that
// forced players through an empty "nothing to reposition yet" step before they could
// even play a card — annoying busywork with no upside on most turns. Merging them
// means the only real phase gate left is the meaningful one: no attacking before
// you've had a turn or two to set up (see phasesForTurn).
export type TurnPhase = 'preparacao' | 'batalha';
const phasesForTurn = (turn: number): TurnPhase[] =>
  turn >= 3 ? ['preparacao', 'batalha'] : ['preparacao'];
const PHASE_LABELS: Record<TurnPhase, string> = {
  preparacao: 'Preparação',
  batalha: 'Batalha',
};

// Reposition adjacency — only Vanguarda/Retaguarda slots (0-9) take part; the
// General/Relíquia/Terreno slots (10-12) are fixed, same as everywhere else they're
// special-cased in this file. A 2-row x 5-column grid, orthogonal adjacency only
// (no diagonals), matching the old version's grid-distance rule.
const getMoveRow = (slotIndex: number) => (slotIndex <= 4 ? 0 : 1);
const getMoveCol = (slotIndex: number) => (slotIndex <= 4 ? slotIndex : slotIndex - 5);
const areSlotsAdjacent = (a: number, b: number) => {
  if (a < 0 || a > 9 || b < 0 || b > 9 || a === b) return false;
  const dr = Math.abs(getMoveRow(a) - getMoveRow(b));
  const dc = Math.abs(getMoveCol(a) - getMoveCol(b));
  return dr + dc === 1;
};

// ── Deck Capitão mechanics ──────────────────────────────────────────────────
// Every card's `effect` string used to be flavor text only — none of it actually
// ran. This block gives Deck Capitão's abilities real behavior. Matched by
// `name` rather than `id`: drawFromDeck/drawFromNpcDeck stamp every drawn card
// with a fresh random id (`hand_<timestamp>_<random>`) to keep React keys and
// draw-animation bookkeeping unique per copy, which means the deck array's own
// descriptive ids (e.g. 'c_tactical_soldier_0') don't survive onto the board —
// only `name` does, and it's identical across every copy of a given card, so
// it's the stable thing to key off. Deck Cardeal Pedro's much larger and more
// varied set of abilities (healing, card draw, summon-on-play, equip-style
// buffs, deck/graveyard search) needs its own new subsystems (equipment
// attachment, reveal-and-choose UI for draws/searches) this pass doesn't build
// — those are still flavor-text-only, same as before. A few Capitão abilities
// are ALSO left as flavor-only where they need a kind of UI this pass doesn't
// add either (a free-standing "pick a unit and buff/move it" targeting mode for
// a Tática card): Reformar Linhas, Avanço Coordenado, Reposicionamento Rápido,
// Linha Fechada, Ordem de Retirada, and Batedor's "move after combat" (there's
// no post-Batalha phase to move again in — see phasesForTurn — so this would
// need a real phase-system change, not just a targeting UI). Escudeiro de
// Linha's "Protege unidades atrás" needs nothing new: getValidAttackTargets
// already blocks a lane's Retaguarda card from being attacked while its own
// Vanguarda is occupied, for any unit, so this is already generically true.

// Is the named card alive and on the field at this exact slot? Used for every
// singleton (General/Relíquia/Terreno) aura check below.
const isAliveAt = (slots: (CardData | null)[], index: number, name: string) =>
  slots[index]?.name === name && !slots[index]?.isDestroyed;

// A unit's ATK after every static Deck Capitão aura that touches it, plus any
// one-time "next combat" bonus it's currently holding (see pendingCombatBonus —
// granted by Comandante Aurelion's active below). Called from both combat
// resolution paths (handleNpcSlotClick and the AI turn loop) for whichever side
// is attacking or defending — auras are computed from board state, not stored,
// so they always reflect what's alive on the field right now.
const getEffectiveAtk = (
  card: CardData,
  ownIndex: number,
  ownSlots: (CardData | null)[],
  enemySlots: (CardData | null)[]
): number => {
  let atk = card.atk + (card.pendingCombatBonus?.atk ?? 0);
  // Estandarte da Legião (Relíquia, own slot 10): all allies +1 ATK.
  if (isAliveAt(ownSlots, 10, 'Estandarte da Legião')) atk += 1;
  // Veterano de Guerra: +2 ATK to itself while standing in column index 2
  // ("coluna 3", 1-indexed) — a positional self-buff, not an aura on others.
  if (card.name === 'Veterano de Guerra' && getLaneCol(ownIndex) === 2) atk += 2;
  // Lanceiro de Controle: the enemy unit directly facing its lane (same slot
  // index, mirrored across the board) gets -1 ATK while the Lanceiro is alive.
  const facingEnemy = enemySlots[ownIndex];
  if (facingEnemy && !facingEnemy.isDestroyed && facingEnemy.name === 'Lanceiro de Controle') atk -= 1;
  // Pântano Maldito (Terreno, enemy's own slot 11): enemy Vanguarda -1 ATK.
  if (isFrontline(ownIndex) && isAliveAt(enemySlots, 11, 'Pântano Maldito')) atk -= 1;
  // Líder de Esquadrão (Deck Cardeal): +1 ATK for allied Infantaria/Arqueiro
  // while it's standing in the Vanguarda (see hasLiderBuff below).
  if (hasLiderBuff(card, ownSlots)) atk += 1;
  return Math.max(0, atk);
};

// How much incoming damage a slot's occupant shrugs off before it's subtracted
// from HP — Comandante Aurelion's passive and Fortaleza de Pedra, both flat -1
// reductions that stack if somehow both apply.
const getIncomingDamageReduction = (ownIndex: number, ownSlots: (CardData | null)[]): number => {
  let reduction = 0;
  // Comandante Aurelion passive: units adjacent to the General (the Relíquia/
  // Terreno slots on either side of him) take -1 damage.
  if ((ownIndex === 10 || ownIndex === 11) && isAliveAt(ownSlots, 12, 'Comandante Aurelion, Mestre da Formação')) reduction += 1;
  // Fortaleza de Pedra (Terreno, own slot 11): own Retaguarda takes -1 damage.
  if (isBackline(ownIndex) && isAliveAt(ownSlots, 11, 'Fortaleza de Pedra')) reduction += 1;
  // Linha Fechada: a permanent per-unit stamp (see resolveOwnTacticTarget), not an aura.
  reduction += ownSlots[ownIndex]?.dmgReduction ?? 0;
  return reduction;
};

// Comandante Aurelion's active: "Após Remanejamento, até 2 unidades que se
// moveram ganham +1/+1 no próximo combate." Called once, right as Preparação
// ends (see the turn button's onClick) — tags up to 2 of this turn's movedSlots
// with a one-time bonus, consumed (see getEffectiveAtk / the combat blocks'
// pendingCombatBonus.hp handling) the next time that unit actually fights.
// NPC-side is out of scope: aiService.ts never repositions its own units (see
// its Relíquia/Terreno skip), so movedSlots-style tracking has nothing to read
// there even if the AI ends up playing this same deck (see resetGame).
const grantAurelionBuff = (slots: (CardData | null)[], moved: Set<number>): (CardData | null)[] => {
  if (!isAliveAt(slots, 12, 'Comandante Aurelion, Mestre da Formação') || moved.size === 0) return slots;
  const targets = [...moved].filter(i => slots[i]).slice(0, 2);
  if (targets.length === 0) return slots;
  const next = [...slots];
  targets.forEach(i => { next[i] = { ...next[i]!, pendingCombatBonus: { atk: 1, hp: 1 } }; });
  return next;
};

// Capitão de Formação: "Ao mover: adjacentes +1 ATK." Called right after a
// reposition move lands (see handleSlotClick) — a permanent stat stamp on
// whoever was standing next to its NEW position, not a recomputed aura, so the
// buff persists even if the Capitão later moves away or dies.
const applyFormationCaptainBuff = (slots: (CardData | null)[], moverNewIndex: number): (CardData | null)[] => {
  const mover = slots[moverNewIndex];
  if (!mover || mover.name !== 'Capitão de Formação') return slots;
  const next = [...slots];
  for (let j = 0; j <= 9; j++) {
    if (areSlotsAdjacent(moverNewIndex, j) && next[j]) {
      next[j] = { ...next[j]!, atk: next[j]!.atk + 1 };
    }
  }
  return next;
};

// Soldado Tático: "Troca com aliado adjacente no fim do turno." Runs for
// whichever side's turn just ended (see the turn button's onClick and the AI
// turn loop's own end) — every Soldado Tático still on the Vanguarda/Retaguarda
// grid swaps with one adjacent ally, if it has one. A slot only takes part in one
// swap per pass so two adjacent Soldados don't bounce back and forth.
const applyEndOfTurnSwaps = (slots: (CardData | null)[]): (CardData | null)[] => {
  const next = [...slots];
  const settled = new Set<number>();
  for (let i = 0; i <= 9; i++) {
    if (settled.has(i)) continue;
    const card = next[i];
    if (!card || card.name !== 'Soldado Tático') continue;
    const partner = [i - 1, i + 1, i - 5, i + 5].find(j => areSlotsAdjacent(i, j) && next[j] && !settled.has(j));
    if (partner !== undefined) {
      [next[i], next[partner]] = [next[partner], next[i]];
      settled.add(i);
      settled.add(partner);
    }
  }
  return next;
};

// Cavaleiro Tático: "Troca com qualquer aliado na linha" — its own reposition
// range is the whole Vanguarda or Retaguarda row it's standing in, not just the
// orthogonal-neighbor rule every other unit uses (see areSlotsAdjacent). Shared
// by the move-target highlight (validMoveTargets) and the actual move's own
// validity check (handleSlotClick) so both agree on what's legal.
const canReposition = (moverCard: CardData | null, from: number, to: number): boolean => {
  if (!moverCard || from === to) return false;
  if (moverCard.name === 'Cavaleiro Tático') return getMoveRow(from) === getMoveRow(to);
  return areSlotsAdjacent(from, to);
};

// Which specific effect a chosen Emboscada card performs when activated,
// replacing the old one-size-fits-all "+2/+2 to the defender" placeholder now
// that Deck Capitão's three Emboscadas have actual written mechanics. Any
// Emboscada without a case here (Deck Cardeal's "Forças Secretas" isn't wired
// yet) still gets that original generic buff as a fallback.
const resolveAmbushEffect = (
  ambushCard: CardData,
  attackerSlots: (CardData | null)[],
  attackerIndex: number,
  defenderSlots: (CardData | null)[],
  defenderIndex: number
): {
  attackerSlots: (CardData | null)[];
  defenderSlots: (CardData | null)[];
  defenderIndex: number;
  defender: CardData | null;
  cancelled: boolean;
} => {
  const defender = defenderSlots[defenderIndex];

  // Bloqueio Instantâneo: cancels the attack outright if the defender has an
  // adjacent ally to lean on — no damage to either side.
  if (ambushCard.name === 'Bloqueio Instantâneo') {
    const hasAdjacentAlly = defenderIndex <= 9 &&
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(j => areSlotsAdjacent(defenderIndex, j) && defenderSlots[j]);
    return { attackerSlots, defenderSlots, defenderIndex, defender, cancelled: hasAdjacentAlly };
  }

  // Contra-Manobra: swaps the defender out for an adjacent ally, who takes the
  // hit in their place.
  if (ambushCard.name === 'Contra-Manobra') {
    if (defenderIndex <= 9) {
      const partner = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find(j => areSlotsAdjacent(defenderIndex, j) && defenderSlots[j]);
      if (partner !== undefined) {
        const nextDefenderSlots = [...defenderSlots];
        [nextDefenderSlots[defenderIndex], nextDefenderSlots[partner]] = [nextDefenderSlots[partner], nextDefenderSlots[defenderIndex]];
        return { attackerSlots, defenderSlots: nextDefenderSlots, defenderIndex: partner, defender: nextDefenderSlots[partner], cancelled: false };
      }
    }
    return { attackerSlots, defenderSlots, defenderIndex, defender, cancelled: false };
  }

  // Formação Quebrada: yanks the ATTACKER to a random empty slot on their own
  // side, so the attack never lands.
  if (ambushCard.name === 'Formação Quebrada') {
    const emptySlots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(i => i !== attackerIndex && !attackerSlots[i]);
    const nextAttackerSlots = [...attackerSlots];
    if (emptySlots.length > 0) {
      const target = emptySlots[Math.floor(Math.random() * emptySlots.length)];
      nextAttackerSlots[target] = nextAttackerSlots[attackerIndex];
      nextAttackerSlots[attackerIndex] = null;
    }
    return { attackerSlots: nextAttackerSlots, defenderSlots, defenderIndex, defender, cancelled: true };
  }

  // Forças Secretas (Deck Cardeal): +2 ATK / +1 HP — same shape as the generic
  // fallback below but +1 HP, not +2, so it gets its own exact case.
  if (ambushCard.name === 'Forças Secretas') {
    const buffed = defender ? { ...defender, atk: defender.atk + 2, hp: defender.hp + 1 } : null;
    const nextDefenderSlots = [...defenderSlots];
    if (buffed) nextDefenderSlots[defenderIndex] = buffed;
    return { attackerSlots, defenderSlots: nextDefenderSlots, defenderIndex, defender: buffed, cancelled: false };
  }

  // Fallback — the original generic buff, for any Emboscada without its own case.
  const buffed = defender ? { ...defender, atk: defender.atk + 2, hp: defender.hp + 2 } : null;
  const nextDefenderSlots = [...defenderSlots];
  if (buffed) nextDefenderSlots[defenderIndex] = buffed;
  return { attackerSlots, defenderSlots: nextDefenderSlots, defenderIndex, defender: buffed, cancelled: false };
};

// The 4 Deck Capitão Táticas that resolve by picking a target on the board
// instead of just sitting there as an inert 0/0 card — see handlePlayCardButtonClick
// (which puts the game into "pick a target" mode instead of the normal slot-placement
// flow) and resolveOwnTacticTarget/resolveEnemyTacticTarget (which actually apply the
// effect once a target is clicked). Reformar Linhas isn't here: it doesn't target
// anything, it just grants bonus reposition moves immediately (see bonusRepositions).
export type TacticTargetKind =
  | 'avanco_coordenado' | 'reposicionamento_rapido' | 'linha_fechada' | 'ordem_retirada'
  | 'balesta' | 'catapulta' | 'equip_armadura' | 'equip_corcelete' | 'equip_flecha' | 'equip_espada';
const TARGETABLE_TACTICS: Record<string, TacticTargetKind> = {
  'Avanço Coordenado': 'avanco_coordenado',
  'Reposicionamento Rápido': 'reposicionamento_rapido',
  'Linha Fechada': 'linha_fechada',
  'Ordem de Retirada': 'ordem_retirada',
  'Balesta': 'balesta',
  'Catapulta': 'catapulta',
  'Armadura Pesada': 'equip_armadura',
  'Corcelete': 'equip_corcelete',
  'Flecha Envenenada': 'equip_flecha',
  'Espada Longa': 'equip_espada',
};
const TACTIC_TARGET_PROMPTS: Record<TacticTargetKind, string> = {
  avanco_coordenado: 'Escolha uma unidade sua que já se moveu neste turno.',
  reposicionamento_rapido: 'Escolha uma unidade inimiga para deslocar.',
  linha_fechada: 'Escolha uma unidade sua — os aliados ao lado dela recebem menos dano.',
  ordem_retirada: 'Escolha uma unidade sua na Vanguarda.',
  balesta: 'Escolha uma unidade inimiga para causar 3 de dano.',
  catapulta: 'Escolha uma fileira inimiga (clique em qualquer slot dela).',
  equip_armadura: 'Escolha uma Infantaria sua para equipar (+2 HP).',
  equip_corcelete: 'Escolha um Arqueiro ou Infantaria sua para equipar (+1 HP).',
  equip_flecha: 'Escolha um Arqueiro seu para equipar (+1 ATK).',
  equip_espada: 'Escolha uma Cavalaria ou Infantaria sua para equipar (+2 ATK).',
};
// Which own-board card types each equipment Tática accepts.
const EQUIP_ALLOWED_TYPES: Record<string, CardType[]> = {
  equip_armadura: ['Infantaria'],
  equip_corcelete: ['Arqueiro', 'Infantaria'],
  equip_flecha: ['Arqueiro'],
  equip_espada: ['Cavalaria', 'Infantaria'],
};

// What "um soldado" means across the reveal/search Táticas below (O Soldado
// Retorna, Escolher a Dedo, Reunião de Fiéis) — any regular unit, not a
// General/Relíquia/Terreno/Tática/Emboscada.
const SOLDIER_TYPES: CardType[] = ['Infantaria', 'Cavalaria', 'Arqueiro', 'Artilharia'];

// ── Deck Cardeal Pedro mechanics ─────────────────────────────────────────────
// A first pass at this deck's own abilities — much larger and more varied than
// Deck Capitão's (healing, card draw, summon-on-play, equip-style buffs,
// deck/graveyard search), so this covers what's tractable without a brand new
// subsystem: direct-damage Táticas, the 4 equipment cards (reused as a permanent
// stat stamp via the same targeting flow as Deck Capitão's Táticas, not a real
// attach/detach system), Nobre Religioso's summon-on-play, Líder de Esquadrão's
// aura, Jorge o Lanceiro's splash damage, and Forças Secretas' exact ambush
// effect. Cardeal Pedro's own heal ability + Cálice da Vida and Aprendiz de
// Infantaria's "Ao ser curado" trigger are wired too — see the
// generalAbilityPrompt/pendingGeneralHeal state, activateGeneralHeal/
// resolveGeneralHeal, and playerGeneralAbilityAvailable's "you may activate
// this" prompt on the General slot (Yu-Gi-Oh-style: the game itself notices
// the ability is usable and surfaces it, rather than it just sitting there as
// unusable flavor text). The same prompt pattern now also covers Comerciante
// das Cruzadas and Hospitalário (see getPlayerCreatureAbilityKind and their
// activate/resolve functions) — a per-card Sparkles button on their own board
// slot instead of only the General's. Vigia de Mantimentos is a passive
// version of the same "once per turn" idea, piggybacked on the turn-start draw
// effect instead of a button. Espião Sabotador and Soldado Fanático's "General
// type" text is handled pragmatically, not with a real faction system — see
// hasEspiaoInVanguarda/hasEspiaoOnBoard and the Soldado Fanático comment at its
// attack-time ATK bonus. Atirador Influente's death-trigger draw is hooked into
// every withEquippedWeapons call site (see drawForAtiradorInfluente). Arqueiro
// Profissional's double-attack introduced the game's first "already attacked
// this turn" tracking (playerAttackCounts, reset every player turn; the AI
// just queues two attack actions for it in aiService.ts) — every other unit
// implicitly caps at 1 via the same mechanism now (getMaxAttacksPerTurn).
// Still left as flavor-only: the reveal/search/graveyard-pick Táticas (O
// Soldado Retorna, Busca pelo Santo Graal, Nova Tática, Escolher a Dedo,
// Escolher Tropas, Reunião de Fiéis are actually already wired — see
// openCardPicker call sites — so nothing here is left un-wired for lack of a
// picker UI anymore). The AI doesn't know how to pick a target for the
// targeted Táticas — see AI_UNSUPPORTED_TACTICS in aiService.ts, which leaves
// them in its hand rather than wasting them as an inert placed card.

// Any Armamento cards riding along on a unit (see equippedWeapons/CardData) go to
// the graveyard together with it when it dies — nothing strips them off first, so
// every "push these destroyed cards onto the graveyard" site needs to expand
// through this rather than pushing the destroyed unit alone.
const withEquippedWeapons = (cards: CardData[]): CardData[] =>
  cards.flatMap(c => (c.equippedWeapons?.length ? [c, ...c.equippedWeapons] : [c]));

// Applies flat damage to one slot, same simple "hp minus damage, destroyed at 0"
// rule combat uses — but for effects (Trabuco/Catapulta/Balesta/Jorge's splash)
// that hit a slot directly rather than through the normal attacker-vs-defender
// exchange. Returns the updated slots array and, if something died, that card
// (already flagged) for the caller to push onto the graveyard.
const applyDamageToSlot = (
  slots: (CardData | null)[],
  index: number,
  amount: number
): { slots: (CardData | null)[]; destroyed: CardData | null } => {
  const card = slots[index];
  if (!card) return { slots, destroyed: null };
  const next = [...slots];
  const newHp = card.hp - amount;
  if (newHp <= 0) {
    next[index] = null;
    return { slots: next, destroyed: { ...card, hp: newHp, isDestroyed: true } };
  }
  next[index] = { ...card, hp: newHp };
  return { slots: next, destroyed: null };
};

// Líder de Esquadrão: "Na Vanguarda: Infantaria e Arqueiros aliados ganham +1 ATK
// e +1 HP durante o combate." A positional aura (must itself be standing in the
// Vanguarda) — the ATK half is folded into getEffectiveAtk below; the HP half is
// its own helper since it's added directly to HP in the combat blocks (same spot
// pendingCombatBonus.hp applies), not a damage-reduction value.
const hasLiderBuff = (card: CardData, ownSlots: (CardData | null)[]): boolean => {
  if (card.cardType !== 'Infantaria' && card.cardType !== 'Arqueiro') return false;
  return [0, 1, 2, 3, 4].some(i => {
    const c = ownSlots[i];
    return c && !c.isDestroyed && c.name === 'Líder de Esquadrão';
  });
};
const getAuraCombatHpBonus = (card: CardData, ownSlots: (CardData | null)[]): number =>
  hasLiderBuff(card, ownSlots) ? 1 : 0;

// Espião Sabotador: "Na Vanguarda: impede Emboscadas inimigas." — checked from the
// ATTACKING side (see maybeActivatePlayerAmbush/maybeActivateNpcAmbush) to see
// through the DEFENDER's Emboscada, so this only ever looks at slots 0-4.
const hasEspiaoInVanguarda = (slots: (CardData | null)[]): boolean =>
  [0, 1, 2, 3, 4].some(i => slots[i] && !slots[i]?.isDestroyed && slots[i]?.name === 'Espião Sabotador');
// Espião Sabotador's other half ("Se o General aliado receber dano...") cares about
// it being anywhere on the board, not specifically the Vanguarda — see the General
// damage checks in handleNpcSlotClick and the AI turn loop.
const hasEspiaoOnBoard = (slots: (CardData | null)[]): boolean =>
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(i => slots[i] && !slots[i]?.isDestroyed && slots[i]?.name === 'Espião Sabotador');

// Arqueiro Profissional: "Pode atacar duas vezes por rodada." Every other unit
// still only gets one swing per turn (see playerAttackCounts/handleSlotClick).
const getMaxAttacksPerTurn = (card: CardData): number => card.name === 'Arqueiro Profissional' ? 2 : 1;

// Nobre Religioso: "Ao entrar em campo: invoca Soldados Leais (1 ATK / 2 HP) nos
// slots adjacentes livres da mesma fileira." Called right after ANY card lands on
// a slot (player or AI) — a no-op unless that card is actually Nobre Religioso.
const applyNobreReligiosoSummon = (slots: (CardData | null)[], placedIndex: number): (CardData | null)[] => {
  const placed = slots[placedIndex];
  if (!placed || placed.name !== 'Nobre Religioso' || placedIndex > 9) return slots;
  const next = [...slots];
  [placedIndex - 1, placedIndex + 1].forEach(j => {
    if (areSlotsAdjacent(placedIndex, j) && !next[j]) {
      next[j] = { id: `soldado_leal_${Date.now()}_${j}`, name: 'Soldado Leal', atk: 1, hp: 2, cost: 0, art: '', effect: '', cardType: 'Infantaria' };
    }
  });
  return next;
};

// Both Generals now come from whichever deck each side is playing (see DECKS
// below) — picked at match start in resetGame, not fixed constants like before.

const SlashEffect = () => (
  <motion.div
    initial={{ scale: 0, opacity: 1, rotateZ: -45 }}
    animate={{ scale: [0, 2, 2.5], opacity: [1, 1, 0] }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
  >
    <div className="w-[200%] h-4 bg-white shadow-[0_0_30px_rgba(255,255,255,1)] rounded-full" />
    <div className="absolute w-[200%] h-2 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)] rounded-full" />
  </motion.div>
);

const ExplosionEffect = () => (
  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
    {/* Explosion */}
    <motion.div
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{ scale: 3, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="absolute flex items-center justify-center"
    >
      <div className="w-32 h-32 bg-orange-500 rounded-full blur-xl mix-blend-screen" />
      <div className="absolute w-24 h-24 bg-yellow-300 rounded-full blur-lg mix-blend-screen" />
      <div className="absolute w-16 h-16 bg-white rounded-full blur-md mix-blend-screen" />
    </motion.div>
    {/* Particles */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{ 
          x: (Math.random() - 0.5) * 300, 
          y: (Math.random() - 0.5) * 300,
          scale: 0,
          opacity: 0
        }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      />
    ))}
  </div>
);

// A gold coin, not a mana crystal — Ouro is the game's resource (see the turn-start
// effect above for how it accumulates), so its badge is styled to match: a coin face
// instead of Hearthstone's blue hexagon.
const ManaBadge = ({ value, className = "" }: { value: number, className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
      <circle cx="50" cy="50" r="46" fill="#d4af37" stroke="#7a4a00" strokeWidth="6" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="#fff3c4" strokeWidth="2.5" opacity="0.6" />
    </svg>
    <span className="relative z-10 text-amber-950 font-black drop-shadow-[0_1px_1px_rgba(255,243,196,0.5)] leading-none">{value}</span>
  </div>
);

// The on-board Graveyard pile — an empty placeholder box until a card actually dies,
// then it shows the most recently destroyed card's name plus a count badge, so cards
// leaving the field via combat visibly end up somewhere instead of just vanishing.
const GraveyardPile = ({ cards }: { cards: CardData[] }) => (
  <div className="w-24 md:w-36 h-32 md:h-48 border-2 border-zinc-700 rounded-xl bg-zinc-900/80 flex items-center justify-center shadow-lg relative overflow-hidden">
    {cards.length === 0 ? (
      <span className="text-zinc-600 font-mono text-xs md:text-sm uppercase tracking-widest rotate-90 opacity-50">Cemitério</span>
    ) : (
      <>
        <div className="absolute inset-1 border border-zinc-700 rounded-lg bg-zinc-800/50 translate-x-1 translate-y-1 -z-10" />
        <div className="absolute inset-1 border border-zinc-700 rounded-lg bg-zinc-800/30 translate-x-2 translate-y-2 -z-20" />
        <div className="w-[85%] h-[90%] border border-zinc-600 rounded-lg bg-zinc-800 flex flex-col items-center justify-center gap-1 p-1 text-center">
          <span className="text-zinc-300 font-bold text-[9px] md:text-xs leading-tight px-1">{cards[cards.length - 1].name}</span>
          <span className="text-zinc-500 font-mono text-[7px] md:text-[9px] uppercase tracking-widest">Cemitério</span>
        </div>
        <span className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-900/90 border border-red-500 text-red-200 text-[9px] md:text-xs font-black rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
          {cards.length}
        </span>
      </>
    )}
  </div>
);

const AtkBadge = ({ value, className = "" }: { value: number, className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
      <path d="M20 80 L80 20 M20 20 L80 80" stroke="#4a4a4a" strokeWidth="12" strokeLinecap="round" />
      <path d="M50 5 L85 20 L85 60 C85 80 50 95 50 95 C50 95 15 80 15 60 L15 20 Z" fill="#e4e4e7" stroke="#3f3f46" strokeWidth="8" strokeLinejoin="round" />
    </svg>
    <span className="relative z-10 text-zinc-900 font-black drop-shadow-[0_1px_1px_rgba(255,255,255,1)] leading-none">{value}</span>
  </div>
);

const HpBadge = ({ value, className = "" }: { value: number, className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
      <path d="M50 90 C 50 90, 10 60, 10 30 C 10 10, 35 10, 50 30 C 65 10, 90 10, 90 30 C 90 60, 50 90, 50 90 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="8" strokeLinejoin="round" />
    </svg>
    <span className="relative z-10 text-white font-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-none">{value}</span>
  </div>
);

// A plain gradient-gold number with a strong drop shadow and no background shape —
// unlike AtkBadge/HpBadge/ManaBadge above, this is used INSIDE CardFace, where the
// imported card-template artwork already draws its own coin/blade/shield emblem at
// each of these exact spots; this just fills in the number on top of it.
//
// Self-fitting like FitText below: CardFace renders at several very different
// pixel sizes (a 224px-wide hand card, a small board slot, a 128px card-picker
// option, ...) sharing the same className-driven base font size, so a fixed
// size that looks right on one overflows its coin/blade/heart badge on a
// smaller one. This measures its own box and shrinks (never grows past the
// base size) exactly enough to always fit, on any container size.
const GoldNumber = ({ value, className = "" }: { value: number, className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;
    const fit = () => {
      textEl.style.transform = 'scale(1)';
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const scaleW = containerWidth > 0 && textEl.scrollWidth > containerWidth ? containerWidth / textEl.scrollWidth : 1;
      const scaleH = containerHeight > 0 && textEl.scrollHeight > containerHeight ? containerHeight / textEl.scrollHeight : 1;
      textEl.style.transform = `scale(${Math.min(scaleW, scaleH)})`;
    };
    fit();
    document.fonts?.ready?.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(container);
    return () => ro.disconnect();
  }, [value]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden">
      <span
        ref={textRef}
        className={`font-black leading-none ${className}`}
        style={{
          fontFamily: "'Cinzel', serif",
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FDE08B 30%, #D4AF37 60%, #AA7200 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 4px rgba(0,0,0,0.8))',
          display: 'inline-block',
          whiteSpace: 'nowrap',
          transformOrigin: 'center',
        }}
      >
        {value}
      </span>
    </div>
  );
};

// CardBack — the card back, wherever a face-down card renders (both deck piles, the
// opponent's hand, the flip a drawn card does on its way into yours).
//
// The artwork's outline is not a rectangle: red ribbons flare past the frame's sides and
// a carved spire juts out top and bottom. So the image is sized for the frame's straight
// BODY to fill the card's slot exactly (the body covers 80.5% x 73.9% of the source, hence
// these percentages) and those flourishes are left to spill past it — which means every
// container rendering this has to stay transparent and must NOT clip, or the overhang is
// sheared off and a box shows up around the card. Same reason the shadow is a drop-shadow
// and not a box-shadow: it has to follow the card's real silhouette, not a rectangle.
const CardBack = ({ offset = 0, brightness = 1, shadow = false }: {
  offset?: number, brightness?: number, shadow?: boolean
}) => {
  const filters = [
    brightness !== 1 ? `brightness(${brightness})` : '',
    shadow ? 'drop-shadow(0 5px 9px rgba(0,0,0,0.55))' : '',
  ].filter(Boolean).join(' ');
  return (
    <img
      src={cardBackplateImage}
      alt=""
      className="absolute pointer-events-none select-none max-w-none"
      style={{
        width: '124.5%',
        height: '135.3%',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50.7%)${offset ? ` translate(${offset}px, ${offset}px)` : ''}`,
        filter: filters || undefined,
      }}
      draggable={false}
    />
  );
};

// CardFace — the shared visual for every place a card's front actually renders (hand,
// board slot, detail modal, the flying/announced overlays): the card-template artwork
// as the frame, the card's own art sitting in the template's cutout window, and the
// name/cost/type/effect/atk/hp positioned at the exact percentages the template was
// painted for. Ported from an earlier full-art version of this project (see
// card-template.webp / card-backplate.webp) — the template image and these
// coordinates are a matched pair, not independently adjustable.
const CARD_FACE_VARIANTS = {
  hand:  { name: 'text-lg',                    effect: 'text-[17px]',              type: 'text-[13px]',              stat: 'text-2xl' },
  field: { name: 'text-[8px] md:text-[10px]',  effect: 'text-[7px] md:text-[9px]', type: 'text-[7px] md:text-[9px]', stat: 'text-xs md:text-base' },
  modal: { name: 'text-2xl',                   effect: 'text-2xl',                 type: 'text-lg',                  stat: 'text-3xl' },
  popup: { name: 'text-xs md:text-sm',         effect: 'text-[11px] md:text-[13px]', type: 'text-[9px] md:text-[11px]', stat: 'text-sm md:text-base' },
} as const;

// Which physical card-stock a type is printed on. The gold frame has the
// ATK/HP emblem pair baked into its art; the silver and champagne frames don't —
// they carry a single decorative emblem instead, since Tática/Terreno/Emboscada
// cards mostly resolve their effect immediately rather than sitting in combat
// with real stats. Ported from the same full-art commit as the gold frame
// (see card-template.webp) — card-template-silver.webp and
// card-template-champagne.webp are that commit's other two frame variants.
const NO_STAT_TYPES = new Set<CardType>(['Tática', 'Terreno', 'Emboscada']);
const templateForType = (cardType?: CardType) => {
  if (cardType === 'Tática' || cardType === 'Terreno') return cardTemplateSilverImage;
  if (cardType === 'Emboscada') return cardTemplateChampagneImage;
  return cardTemplateImage;
};

// FitText — shrinks its text (via a uniform CSS scale, never wrapping or
// truncating) just enough that it always fits the width of its container,
// measured for real off the actual rendered pixels rather than guessed from
// character count. That's the only way to guarantee it fits everywhere this
// renders (hand cards, board slots at two breakpoints, the detail modal, the
// announce popup) since each has a different real pixel width for the same
// name box percentage. Short names that already fit render at their natural
// size (scale is only ever ≤ 1, never enlarged past the base font size).
const FitText = ({ text, className, style }: { text: string, className?: string, style?: React.CSSProperties }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;
    // Sets the scale directly on the DOM node instead of going through React
    // state — this re-renders constantly (every animation tick on the board),
    // and a state-driven scale kept getting stomped back to its initial value
    // by those re-renders faster than the effect could correct it again.
    const fit = () => {
      textEl.style.transform = 'scale(1)';
      const containerWidth = container.clientWidth;
      const textWidth = textEl.scrollWidth;
      const scale = textWidth > containerWidth && textWidth > 0 ? containerWidth / textWidth : 1;
      textEl.style.transform = `scale(${scale})`;
    };
    fit();
    // Re-measure once the real font is done loading — measuring against the
    // fallback font (during the @font-face swap window) would bake in a scale
    // sized for the wrong glyph metrics.
    document.fonts?.ready?.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(container);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden">
      <span
        ref={textRef}
        className={className}
        style={{ ...style, display: 'inline-block', whiteSpace: 'nowrap', transformOrigin: 'center' }}
      >
        {text}
      </span>
    </div>
  );
};

// Same idea as FitText but for the effect-text box, which wraps across several lines
// instead of staying on one — a long ability description (e.g. Comandante Aurelion's
// "Após Remanejamento: até 2 unidades... Passiva: unidades adjacentes recebem -1 de
// dano.") used to just get sliced off by the box's overflow-hidden once it ran past
// its fixed height. Text already wraps to the container's width on its own, so this
// grows to fill the box when there's room to spare (a short effect used to always
// render at the same small base size, leaving a lot of visibly empty parchment
// below it) and still shrinks exactly as before when the wrapped block runs
// taller than its box. Unlike FitText's plain CSS-transform scale (fine for a
// single line), this changes the real font-size and lets the browser re-wrap at
// each candidate size — a transform-scale big enough to fill vertical space would
// also stretch each already-wrapped line past the box horizontally.
const FitEffectText = ({ text, className, style }: { text: string, className?: string, style?: React.CSSProperties }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;
    const fit = () => {
      const containerHeight = container.clientHeight;
      if (containerHeight <= 0) return;
      textEl.style.fontSize = '';
      const baseFontSize = parseFloat(window.getComputedStyle(textEl).fontSize);
      if (!baseFontSize) return;
      // Binary search the largest multiplier of the base font size (capped above
      // 1x so short text fills more of the box, capped below it for long text)
      // whose real wrapped height still fits.
      let lo = 0.3, hi = 1.6;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        textEl.style.fontSize = `${baseFontSize * mid}px`;
        if (textEl.scrollHeight <= containerHeight) lo = mid; else hi = mid;
      }
      textEl.style.fontSize = `${baseFontSize * lo}px`;
    };
    fit();
    document.fonts?.ready?.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(container);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden">
      <p ref={textRef} className={className} style={{ ...style, margin: 0 }}>
        {text}
      </p>
    </div>
  );
};

// Full Art layout — General/Relíquia (and, for now, any other card testing this
// print — see CardData.isFullArt) skip the Padrão frame entirely: the art fills
// almost the whole card behind a dedicated frame (card-template-fullart-gold),
// name/cost sit in its own top bar instead of a parchment name-plate, and there's
// no separate effect-text panel at all — the frame has none to put it in (see
// art-prompts/README.md item 3's own note on this). Same GoldNumber/FitText
// building blocks as the Padrão layout below, just placed for this frame's own
// window/badge coordinates (measured off reference/full-art-frame-gold-v1.png).
const CardFaceFullArt = ({ card, variant = 'hand' }: { card: CardData, variant?: keyof typeof CARD_FACE_VARIANTS }) => {
  const v = CARD_FACE_VARIANTS[variant];
  const showStats = !NO_STAT_TYPES.has(card.cardType as CardType);
  return (
    <>
      <div className="absolute overflow-hidden" style={{ left: '10.2%', top: '15.4%', width: '79.4%', height: '73.4%' }}>
        {card.art ? (
          <img src={card.art} alt={card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900" />
        )}
      </div>
      <img src={cardTemplateFullArtGoldImage} alt="" aria-hidden className="absolute inset-0 w-full h-full pointer-events-none select-none" draggable={false} />

      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Name — sits on the frame's own dark top bar, so light/gold text instead
            of the Padrão layout's dark-ink-on-parchment. */}
        <div className="absolute px-1" style={{ top: '5%', left: '8%', right: '25%', height: '9%' }}>
          <FitText
            text={card.name}
            className={`${v.name} font-bold uppercase tracking-tight`}
            style={{ fontFamily: "'Cinzel', serif", color: '#f5deA0', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
          />
        </div>

        {/* Cost — the frame's own circular medallion cutout, top-right of the bar. */}
        <div className="absolute flex items-center justify-center" style={{ left: '85%', top: '10.5%', width: '15%', height: '8%', transform: 'translate(-50%, -50%)' }}>
          <GoldNumber value={card.cost} className={v.stat} />
        </div>

        {/* ATK/HP — the frame's own black shield (left) and red heart shield
            (right) at the bottom, same idea as the Padrão layout's blade/heart
            emblems just at this frame's own coordinates. */}
        {showStats && (
          <>
            <div className="absolute flex items-center justify-center" style={{ left: '11%', bottom: '2%', width: '18%', height: '9%' }}>
              <GoldNumber value={card.atk} className={v.stat} />
            </div>
            <div className="absolute flex items-center justify-center" style={{ right: '11%', bottom: '2%', width: '18%', height: '9%' }}>
              <GoldNumber value={card.hp} className={v.stat} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

const CardFace = ({ card, variant = 'hand' }: { card: CardData, variant?: keyof typeof CARD_FACE_VARIANTS }) => {
  const v = CARD_FACE_VARIANTS[variant];
  const showStats = !NO_STAT_TYPES.has(card.cardType as CardType);
  if (card.isFullArt) return <CardFaceFullArt card={card} variant={variant} />;
  return (
    <>
      {/* Art + frame share one oversized, shifted coordinate space because the template
          art itself has an ambient glow bleeding past the card's real edges. Both
          layers use the exact same box so the art aligns perfectly with the
          template's transparent cutout window. */}
      <div
        className="absolute pointer-events-none"
        style={{ width: '122%', height: '145.5%', top: '50%', left: '50%', transform: 'translate(-50%, -46%)' }}
      >
        <div className="absolute overflow-hidden" style={{ left: '11.52%', top: '17.64%', width: '76.95%', height: '31.83%' }}>
          {card.art ? (
            <img src={card.art} alt={card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900" />
          )}
        </div>
        <img src={templateForType(card.cardType)} alt="" aria-hidden className="absolute inset-0 w-full h-full pointer-events-none select-none" draggable={false} />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Name — FitText shrinks long names down (see its own comment) instead of
            truncating them with an ellipsis, so the full name is always readable. */}
        <div className="absolute px-1" style={{ top: '0%', left: '12%', right: '22%', height: '8%' }}>
          <FitText
            text={card.name}
            // The name plate and type ribbon are pale parchment, so the text on them is
            // dark ink, not gold — light-on-light was the reason they were hard to read.
            // The highlight underneath gives it the engraved-into-the-plate look.
            className={`${v.name} font-bold uppercase tracking-tight`}
            style={{ fontFamily: "'Cinzel', serif", color: '#2a1605', textShadow: '0 1px 0 rgba(255,243,206,0.55)' }}
          />
        </div>

        {/* Cost (Ouro) — mapped to the template's round cutout, top-right. Explicit
            width/height (not just left/top) so GoldNumber above has a real box to
            measure itself against and shrink to fit, same as the ATK/HP badges below. */}
        <div className="absolute flex items-center justify-center" style={{ left: '92%', top: '2.5%', width: '16%', height: '9%', transform: 'translate(-50%, -50%)' }}>
          <GoldNumber value={card.cost} className={v.stat} />
        </div>

        {/* Card type — the gold ribbon between art and rules text */}
        {card.cardType && (
          <div className="absolute flex items-center justify-center px-1 overflow-hidden" style={{ top: '56%', left: '12%', right: '12%', height: '7%' }}>
            <span
              className={`${v.type} font-black uppercase tracking-widest truncate w-full text-center`}
              style={{
                fontFamily: "'Cinzel', serif",
                color: card.cardType === 'Relíquia' ? '#6b3f00' : card.cardType === 'Terreno' ? '#17502a' : '#3a2408',
                textShadow: '0 1px 0 rgba(255,243,206,0.55)',
              }}
            >
              {card.cardType}
            </span>
          </div>
        )}

        {/* Effect — the parchment text area */}
        <div className="absolute p-1" style={{ top: '64%', bottom: '10%', left: '11%', right: '11%' }}>
          <FitEffectText
            text={card.effect}
            className={`${v.effect} text-[#0d0901] font-semibold text-center leading-tight`}
            style={{ fontFamily: "'Crimson Pro', serif" }}
          />
        </div>

        {/* ATK/HP — blade + heart emblems, only on the gold frame (see NO_STAT_TYPES) */}
        {showStats && (
          <>
            <div className="absolute flex items-center justify-center" style={{ left: '1%', bottom: '-2%', width: '20%', height: '13%' }}>
              <GoldNumber value={card.atk} className={v.stat} />
            </div>
            <div className="absolute flex items-center justify-center" style={{ right: '0%', bottom: '-2%', width: '20%', height: '13%' }}>
              <GoldNumber value={card.hp} className={v.stat} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

// The board art used to be two separate images — one for the playing surface
// inside the bordered board frame, one for the space around it — that had to
// visually match up at the seam. That never worked well (see art-prompts/
// README.md, "3d"), so it's now a single full-screen battlefield image (both
// front lines AND the ground between them, top to bottom); the interior board
// frame has no image, border, or darkening tint of its own anymore, just a
// transparent window onto this same background (see the "3D Board" comment
// further down — its own separate tint used to make that box read as visibly
// darker than the rest of the art, like a leftover seam from the old two-image
// split, even though there's nothing left to seam against).
const BOARD_EXTERIOR_ART_URL = boardBattlefieldImage;

// How big the previewed card renders while parked at the edge during slot selection.
// The game is played almost entirely on phones, so legibility there matters more than
// avoiding every last bit of overlap with the board.
const FIELD_PREVIEW_SCALE = { mobile: 0.95, desktop: 0.95 };

// Hand fan layout: cards spread across a modest total angle, center card slightly raised.
const FAN_SPREAD_DEG = 26;
const FAN_LIFT_PX = 20;
const HAND_CARD_WIDTH = 224; // w-56
const HAND_CARD_HEIGHT = 320; // h-80
// Cards overlap like a real hand of cards instead of sitting apart with a gap —
// each card only advances this much past the previous one.
const HAND_CARD_STEP = HAND_CARD_WIDTH * 0.5;

// ── DECK CAPITÃO ────────────────────────────────────────────────────────────
// Ported from the earlier full-art version of this project (commit 8a3d7b8,
// constant DECK_1) — its own General, Criaturas, Táticas, Emboscadas, one
// Relíquia and two Terrenos. Every ability here is wired up now (move/swap
// rules, the +1/-1 ATK auras, the reposition Táticas, the 3 Emboscadas —
// search this file for each card's name to find its logic). The one gap is
// the AI: it doesn't reposition units at all, so the move-triggered
// abilities (Capitão de Formação, Batedor, Cavaleiro Tático's wider swap,
// Aurelion's own active ability) only ever fire for the player, and the
// targeted Táticas are left in the AI's hand entirely (see
// AI_UNSUPPORTED_TACTICS in aiService.ts) rather than risk it wasting them.
const DECK_CAPITAO: CardData[] = [
  { id: 'gen1', name: 'Comandante Aurelion, Mestre da Formação', atk: 0, hp: 20, cost: 0, art: '', effect: 'Após Remanejamento: até 2 unidades que se moveram ganham +1/+1 no próximo combate. Passiva: unidades adjacentes recebem -1 de dano.', cardType: 'General' },

  // Criaturas (27)
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_tactical_soldier_${i}`, name: 'Soldado Tático', atk: 3, hp: 3, cost: 2, art: '', effect: 'Troca com aliado adjacente no fim do turno.', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_line_squire_${i}`, name: 'Escudeiro de Linha', atk: 2, hp: 4, cost: 2, art: '', effect: 'Protege unidades atrás.', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_formation_captain_${i}`, name: 'Capitão de Formação', atk: 3, hp: 4, cost: 3, art: '', effect: 'Ao mover: adjacentes +1 ATK.', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_scout_${i}`, name: 'Batedor', atk: 1, hp: 2, cost: 1, art: '', effect: 'Move após combate.', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_control_lancer_${i}`, name: 'Lanceiro de Controle', atk: 3, hp: 2, cost: 2, art: '', effect: 'Inimigo à sua frente recebe -1 ATK.', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_tactical_knight_${i}`, name: 'Cavaleiro Tático', atk: 4, hp: 4, cost: 3, art: '', effect: 'Troca com qualquer aliado na linha.', cardType: 'Cavalaria' })),
  ...Array(3).fill(null).map((_, i): CardData => ({ id: `c_veteran_${i}`, name: 'Veterano de Guerra', atk: 4, hp: 3, cost: 3, art: '', effect: '+2 ATK na coluna 3.', cardType: 'Infantaria' })),

  // Táticas (20)
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `t_reform_lines_${i}`, name: 'Reformar Linhas', atk: 0, hp: 0, cost: 2, art: '', effect: 'Reorganiza até 3 unidades.', cardType: 'Tática' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `t_coordinated_advance_${i}`, name: 'Avanço Coordenado', atk: 0, hp: 0, cost: 2, art: '', effect: 'Após mover: +2 ATK.', cardType: 'Tática' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `t_quick_reposition_${i}`, name: 'Reposicionamento Rápido', atk: 0, hp: 0, cost: 1, art: '', effect: 'Move inimigo 1 slot.', cardType: 'Tática' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `t_closed_line_${i}`, name: 'Linha Fechada', atk: 0, hp: 0, cost: 2, art: '', effect: 'Adjacentes recebem menos dano.', cardType: 'Tática' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `t_retreat_order_${i}`, name: 'Ordem de Retirada', atk: 0, hp: 0, cost: 2, art: '', effect: 'Move para a Retaguarda + cura.', cardType: 'Tática' })),

  // Emboscadas (12)
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `a_instant_block_${i}`, name: 'Bloqueio Instantâneo', atk: 0, hp: 0, cost: 2, art: '', effect: 'Cancela ataque se houver adjacente.', cardType: 'Emboscada' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `a_counter_maneuver_${i}`, name: 'Contra-Manobra', atk: 0, hp: 0, cost: 3, art: '', effect: 'Troca posições durante o ataque.', cardType: 'Emboscada' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `a_broken_formation_${i}`, name: 'Formação Quebrada', atk: 0, hp: 0, cost: 2, art: '', effect: 'Move inimigo aleatoriamente.', cardType: 'Emboscada' })),

  // Relíquia (1)
  { id: 'relic_banner_0', name: 'Estandarte da Legião', atk: 0, hp: 5, cost: 3, art: '', effect: 'Permanente. Todas as unidades aliadas ganham +1 ATK enquanto esta relíquia estiver no campo.', cardType: 'Relíquia', isFullArt: true },

  // Terrenos (2)
  { id: 'terrain_fortress_0', name: 'Fortaleza de Pedra', atk: 0, hp: 8, cost: 3, art: '', effect: 'Permanente. Unidades aliadas na Retaguarda recebem -1 de dano de ataques inimigos.', cardType: 'Terreno' },
  { id: 'terrain_swamp_0', name: 'Pântano Maldito', atk: 0, hp: 6, cost: 2, art: '', effect: 'Permanente. Unidades inimigas na Vanguarda sofrem -1 ATK enquanto este terreno estiver no campo.', cardType: 'Terreno' },
];

// ── DECK CARDEAL PEDRO ──────────────────────────────────────────────────────
// Ported from the same commit (constant DECK_CARDEAL). Every card there had
// its own unique ability keyed by `effectKey` (heal, draw, summon, buff on
// equip...) — none of that runs yet, same flavor-text-only scope as above.
// Three of the old commit's card types don't exist in this game's CardType
// union: Leve and Plebeu fold into Infantaria (they're stat-bearing frontline
// bodies same as any other Infantaria card), and Armamento (equipment) folds
// into Tática (a 0/0 card whose whole point is its one-time effect).
const DECK_CARDEAL: CardData[] = [
  { id: 'cardeal_gen', name: 'Cardeal Pedro', atk: 0, hp: 20, cost: 0, art: cardealPedroFullArt, effect: 'Fase Principal: cure 1 HP em um soldado aliado. Pague 1 ouro para curar 3 HP em vez disso.', cardType: 'General', isFullArt: true },
  { id: 'cardeal_relic', name: 'Cálice da Vida', atk: 0, hp: 5, cost: 3, art: caliceDaVidaFullArt, effect: 'Permanente. Permite que o General Cardeal Pedro use sua habilidade duas vezes por turno.', cardType: 'Relíquia', isFullArt: true },

  // Plebeus → Infantaria
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `cardeal_fiel_${i}`, name: 'Multidão de Fiéis', atk: 0, hp: 3, cost: 1, art: multidaoDeFieisArt, effect: '—', cardType: 'Infantaria' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_comerciante_${i}`, name: 'Comerciante das Cruzadas', atk: 1, hp: 1, cost: 1, art: comercianteDasCruzadasArt, effect: 'Uma vez por turno: veja as 2 cartas do topo do deck. Adicione 1 à mão e coloque a outra no fundo.', cardType: 'Infantaria' })),

  // Infantaria
  { id: 'cardeal_espiao', name: 'Espião Sabotador', atk: 1, hp: 2, cost: 1, art: espiaoSabotadorArt, effect: 'Na Vanguarda: impede Emboscadas inimigas. Se o General aliado receber dano, no próximo turno não poderá usar sua habilidade.', cardType: 'Infantaria' },
  { id: 'cardeal_fanatico', name: 'Soldado Fanático', atk: 1, hp: 2, cost: 1, art: soldadoFanaticoArt, effect: 'Ao atacar: se o General inimigo for de tipo oposto, ganha +2 ATK.', cardType: 'Infantaria' },
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_aprendiz_${i}`, name: 'Aprendiz de Infantaria', atk: 0, hp: 2, cost: 1, art: '', effect: 'Ao ser curado: recebe +1 ATK permanente.', cardType: 'Infantaria' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_vigia_${i}`, name: 'Vigia de Mantimentos', atk: 2, hp: 3, cost: 2, art: vigiaDeMantimentosArt, effect: 'Uma vez por turno: se você tiver menos de 2 cartas na mão, compre até ficar com 2.', cardType: 'Infantaria' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_inf_treinada_${i}`, name: 'Infantaria Treinada', atk: 3, hp: 5, cost: 2, art: infantariaTreinadaArt, effect: '—', cardType: 'Infantaria' })),

  // Cavaleiros
  ...Array(3).fill(null).map((_, i): CardData => ({ id: `cardeal_jorge_${i}`, name: 'Jorge, o Lanceiro', atk: 4, hp: 6, cost: 3, art: jorgeOLanceiroArt, effect: 'Ao atacar a Vanguarda: causa 2 de dano à unidade na Retaguarda da mesma coluna.', cardType: 'Cavalaria' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_hosp_${i}`, name: 'Hospitalário', atk: 2, hp: 4, cost: 2, art: hospitalarioArt, effect: 'Uma vez por turno: cure 1 HP de um aliado e cause 1 de dano a um inimigo na Vanguarda.', cardType: 'Cavalaria' })),
  // Testing the Full Art print for this card (see CardFaceFullArt) instead of its
  // Padrão one now that both exist — once boosters exist this becomes a real
  // per-copy choice instead of swapping the one CardData entry's own art/isFullArt.
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_nobre_${i}`, name: 'Nobre Religioso', atk: 4, hp: 5, cost: 3, art: nobreReligiosoFullArt, isFullArt: true, effect: 'Ao entrar em campo: invoca Soldados Leais (1 ATK / 2 HP) nos slots adjacentes livres da mesma fileira.', cardType: 'Cavalaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `cardeal_cavaleiro_${i}`, name: 'Cavaleiro Branco', atk: 5, hp: 7, cost: 3, art: '', effect: '—', cardType: 'Cavalaria' })),
  // Same Full Art testing swap as Nobre Religioso above.
  { id: 'cardeal_lider', name: 'Líder de Esquadrão', atk: 5, hp: 5, cost: 3, art: liderDeEsquadraoFullArt, isFullArt: true, effect: 'Na Vanguarda: Infantaria e Arqueiros aliados ganham +1 ATK e +1 HP durante o combate.', cardType: 'Cavalaria' },

  // Arqueiros
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_arq_pro_${i}`, name: 'Arqueiro Profissional', atk: 1, hp: 4, cost: 2, art: arqueiroProfissionalArt, effect: 'Pode atacar duas vezes por rodada.', cardType: 'Arqueiro' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_atirador_${i}`, name: 'Atirador Influente', atk: 1, hp: 3, cost: 2, art: atiradorInfluenteArt, effect: 'Ao ir ao cemitério: compre 3 cartas.', cardType: 'Arqueiro' })),

  // Táticas de dano
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_trabuco_${i}`, name: 'Trabuco', atk: 0, hp: 0, cost: 3, art: '', effect: 'Causa 2 de dano a TODAS as unidades inimigas.', cardType: 'Tática' })),
  ...Array(3).fill(null).map((_, i): CardData => ({ id: `cardeal_catapulta_${i}`, name: 'Catapulta', atk: 0, hp: 0, cost: 2, art: '', effect: 'Escolha uma fileira inimiga. Todas as unidades naquela fileira recebem 2 de dano.', cardType: 'Tática' })),
  { id: 'cardeal_balesta', name: 'Balesta', atk: 0, hp: 0, cost: 1, art: '', effect: 'Causa 3 de dano a uma unidade inimiga à sua escolha.', cardType: 'Tática' },

  // Armamentos → Tática
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_armadura_${i}`, name: 'Armadura Pesada', atk: 0, hp: 0, cost: 1, art: '', effect: 'Infantaria equipada recebe +2 HP.', cardType: 'Tática' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_corcelete_${i}`, name: 'Corcelete', atk: 0, hp: 0, cost: 1, art: '', effect: 'Arqueiro, Plebeu ou Infantaria equipada recebe +1 HP.', cardType: 'Tática' })),
  { id: 'cardeal_flecha', name: 'Flecha Envenenada', atk: 0, hp: 0, cost: 1, art: '', effect: 'Arqueiro equipado recebe +1 ATK.', cardType: 'Tática' },
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_espada_${i}`, name: 'Espada Longa', atk: 0, hp: 0, cost: 1, art: '', effect: 'Cavalaria, Infantaria ou Plebeu equipado recebe +2 ATK.', cardType: 'Tática' })),

  // Emboscadas
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_forcas_${i}`, name: 'Forças Secretas', atk: 0, hp: 0, cost: 1, art: '', effect: 'Durante um ataque inimigo: um soldado aliado recebe +2 ATK e +1 HP até o fim do turno.', cardType: 'Emboscada' })),

  // Táticas de utilidade
  { id: 'cardeal_soldado_retorna', name: 'O Soldado Retorna', atk: 0, hp: 0, cost: 1, art: '', effect: 'Adicione um soldado do cemitério à sua mão.', cardType: 'Tática' },
  { id: 'cardeal_busca_graal', name: 'Busca pelo Santo Graal', atk: 0, hp: 0, cost: 1, art: '', effect: 'Adicione uma carta de Terreno ou Relíquia do deck à sua mão.', cardType: 'Tática' },
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_nova_tatica_${i}`, name: 'Nova Tática', atk: 0, hp: 0, cost: 1, art: '', effect: 'Adicione uma carta de Tática do deck à sua mão.', cardType: 'Tática' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_esc_dedo_${i}`, name: 'Escolher a Dedo', atk: 0, hp: 0, cost: 1, art: '', effect: 'Adicione um soldado do deck à sua mão.', cardType: 'Tática' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_esc_tropas_${i}`, name: 'Escolher Tropas', atk: 0, hp: 0, cost: 1, art: '', effect: 'Veja as 4 cartas do topo. Adicione 2 à mão e coloque 2 no fundo do deck.', cardType: 'Tática' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_impostos_${i}`, name: 'Aumento de Impostos', atk: 0, hp: 0, cost: 0, art: '', effect: 'Ganhe 1 ouro adicional neste turno.', cardType: 'Tática' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_reuniao_${i}`, name: 'Reunião de Fiéis', atk: 0, hp: 0, cost: 2, art: '', effect: 'Invoque do deck até 2 soldados com 0 ATK para slots livres na Vanguarda. Embaralhe o deck.', cardType: 'Tática' })),
];

// The playable pool each side actually draws from during a match — the General
// isn't a draw, it's placed straight onto the board at kickoff (see resetGame).
const DECKS = {
  capitao: {
    id: 'capitao' as const,
    name: 'Deck Capitão',
    description: 'Infantaria disciplinada e reformação tática.',
    general: DECK_CAPITAO.find(c => c.cardType === 'General')!,
    pool: DECK_CAPITAO.filter(c => c.cardType !== 'General'),
  },
  cardeal: {
    id: 'cardeal' as const,
    name: 'Deck Cardeal Pedro',
    description: 'Fé e ferro — cura, invocações e emboscadas sagradas.',
    general: DECK_CARDEAL.find(c => c.cardType === 'General')!,
    pool: DECK_CARDEAL.filter(c => c.cardType !== 'General'),
  },
} as const;
type DeckId = keyof typeof DECKS;

// Hospitalário's "cure 1 HP de um aliado" only makes sense targeting someone who's
// actually hurt — but CardData has no separate max-HP field, hp IS current HP (see
// resolveGeneralHeal, which has no such restriction and just heals whatever's
// clicked). So "damaged" is derived here instead: a card's starting HP is whatever
// its own deck-pool entry says, looked up by name (first match — every copy of a
// given card shares the same base stats).
const BASE_HP_BY_NAME: Record<string, number> = {};
[...DECK_CAPITAO, ...DECK_CARDEAL].forEach(c => {
  if (!(c.name in BASE_HP_BY_NAME)) BASE_HP_BY_NAME[c.name] = c.hp;
});
const isCardDamaged = (card: CardData): boolean => card.hp < (BASE_HP_BY_NAME[card.name] ?? card.hp);

// Display-only Portuguese labels for the main menu buttons — the mode strings
// themselves ('Quick Match' etc.) stay in English since they're also used as
// identifiers (gameMode comparisons, onSelectMode), not just display text.
const MODE_LABELS_PT: Record<string, string> = {
  'Campaign': 'Campanha',
  'Quick Match': 'Partida Rápida',
  'Multiplayer': 'Multijogador',
  'My Deck': 'Meu Deck',
};

// A single gold plaque texture (see art-prompts/README.md "4c" and
// button-plaque.webp — cropped from the user's own generated reference sheet,
// specifically the largest of several sizes it came in, per their instruction to
// resize ONE image via code rather than keep multiple generated variants) reused
// for every menu button below. Sizing differences between buttons (e.g. Quick
// Match reading as the "primary" action) are a later code-only change if wanted,
// not a reason to generate more image variants.
const MenuButton = ({ label, onClick, className = '' }: {
  label: string, onClick: (e: React.MouseEvent) => void, className?: string
}) => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`relative w-full ${className}`}
    style={{ aspectRatio: '831 / 177' }}
  >
    <img src={buttonPlaqueImage} alt="" className="absolute inset-0 w-full h-full pointer-events-none select-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]" draggable={false} />
    {/* Text style matches the user's own reference mockup exactly (see
        art-prompts/reference/start-screen-mockup-v1.png): plain cream/off-white
        fill with a dark engraved outline, no icon — a bold condensed sans rather
        than the Cinzel serif used elsewhere, since that's what the reference
        actually uses for button labels (Cinzel stays on the logo/headings). */}
    <span
      className="absolute inset-0 flex items-center justify-center font-black uppercase tracking-wide text-base md:text-xl"
      style={{
        color: '#f3e3c3',
        textShadow: '-1px -1px 0 #2a1608, 1px -1px 0 #2a1608, -1px 1px 0 #2a1608, 1px 1px 0 #2a1608, 0 2px 3px rgba(0,0,0,0.6)',
      }}
    >
      {label}
    </span>
  </motion.button>
);

const MainMenu = ({ onSelectMode }: { onSelectMode: (mode: string) => void }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [-500, 500], [-8, 8]);
  const bgY = useTransform(mouseY, [-500, 500], [-8, 8]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onMouseMove={(e) => {
        mouseX.set(e.clientX - window.innerWidth / 2);
        mouseY.set(e.clientY - window.innerHeight / 2);
      }}
      className="flex flex-col items-center justify-center w-full h-full bg-zinc-950 text-white relative overflow-hidden"
    >
      {/* Background — a besieged castle at dusk (art-prompts/README.md "4"),
          generated landscape but reads well cropped to a phone's portrait screen
          via object-cover (the castle sits naturally near center). A subtle
          mouse-parallax drift on the image itself, and a bottom-heavy dark
          gradient so the menu buttons stay legible over busy sky/cloud detail. */}
      <motion.img
        src={startScreenBgImage}
        alt=""
        style={{ x: bgX, y: bgY }}
        className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] object-cover z-0 pointer-events-none select-none"
        draggable={false}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/10 via-black/40 to-black/85" />

      {/* Logo — cropped straight out of the card back's own emblem (see
          card-backplate.webp / art-prompts/README.md "4d"): that art already had a
          fully-lettered "PRICE OF WAR — FAITH AND FIRE" crest painted into it, so
          there was no need to generate a whole separate logo asset. */}
      <motion.img
        src={logoImage}
        alt="Price of War — Faith and Fire"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-[85vw] max-w-md mb-10 z-10 select-none pointer-events-none drop-shadow-[0_0_35px_rgba(212,175,55,0.35)]"
        draggable={false}
      />

      <div className="flex flex-col gap-4 relative z-10 w-[85vw] max-w-sm">
        {/* The mode identifiers themselves (used in onSelectMode/gameMode comparisons
            elsewhere) stay in English — only the label actually shown is translated,
            so this doesn't need to touch any of the logic keyed off those strings. */}
        {(['Campaign', 'Quick Match', 'Multiplayer', 'My Deck'] as const).map((mode) => (
          <MenuButton
            key={mode}
            label={MODE_LABELS_PT[mode]}
            onClick={(e) => { e.stopPropagation(); onSelectMode(mode); }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const InstallPrompt = ({
  kind, onInstall, onDismiss
}: {
  kind: 'native' | 'ios', onInstall: () => void, onDismiss: () => void
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 pointer-events-auto"
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="w-full max-w-xs bg-gradient-to-b from-[#e8dcbe] via-[#c9b48a] to-[#a3895f] rounded-2xl border-2 border-[#5c4a30] shadow-2xl p-6 flex flex-col items-center gap-4 text-center"
      style={{ boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.45), 0 10px 40px rgba(0,0,0,0.6)' }}
    >
      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#5c4a30] shadow-lg shrink-0">
        <img src={`${import.meta.env.BASE_URL}icon-192.png`} alt="" className="w-full h-full object-cover" />
      </div>
      <h2 className="text-lg font-black uppercase tracking-wide text-[#2a2117]">Instale o Price of War</h2>
      {kind === 'native' ? (
        <>
          <p className="text-sm text-[#4a3b2c]">Jogue em tela cheia, sem as barras do navegador. Instale o app no seu aparelho.</p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onDismiss}
              className="flex-1 px-4 py-2 rounded-full border-2 border-[#5c4a30] text-[#4a3b2c] font-bold text-sm hover:bg-black/5 transition-colors"
            >
              Agora não
            </button>
            <button
              onClick={onInstall}
              className="flex-1 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg transition-colors"
            >
              Instalar
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-[#4a3b2c]">
            Toque em <strong>Compartilhar</strong> e depois em <strong>"Adicionar à Tela de Início"</strong> para jogar em tela cheia, sem as barras do navegador.
          </p>
          <button
            onClick={onDismiss}
            className="px-6 py-2 rounded-full border-2 border-[#5c4a30] text-[#4a3b2c] font-bold text-sm hover:bg-black/5 transition-colors"
          >
            Entendi
          </button>
        </>
      )}
    </motion.div>
  </motion.div>
);

// Shown right after tapping "Quick Match" — picking a deck here is what decides
// which General and card pool the player gets; the AI always takes the other
// deck (see resetGame), so every match pits the two against each other.
const DeckPickerModal = ({ onSelect, onClose }: { onSelect: (deckId: DeckId) => void, onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 pointer-events-auto"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-sm flex flex-col gap-4"
    >
      <h2 className="text-center text-xl font-black uppercase tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Escolha seu Deck</h2>
      {Object.values(DECKS).map((deck) => (
        <motion.button
          key={deck.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(deck.id)}
          className="text-left bg-gradient-to-b from-[#e8dcbe] via-[#c9b48a] to-[#a3895f] rounded-2xl border-2 border-[#5c4a30] shadow-2xl p-5 flex flex-col gap-1"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.45), 0 10px 40px rgba(0,0,0,0.6)' }}
        >
          <span className="text-lg font-black uppercase tracking-wide text-[#2a2117]">{deck.name}</span>
          <span className="text-xs font-bold text-[#5c4a30]">General: {deck.general.name}</span>
          <span className="text-sm text-[#4a3b2c] mt-1">{deck.description}</span>
          <span className="text-[11px] text-[#6b5636] mt-1 uppercase tracking-wide">{deck.pool.length + 1} cartas</span>
        </motion.button>
      ))}
      <button onClick={onClose} className="mx-auto mt-1 px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors">
        Cancelar
      </button>
    </motion.div>
  </motion.div>
);

export default function App() {
  const [gameMode, setGameMode] = useState<string | null>(null);
  // Quick Match asks which deck to play before actually starting the match —
  // see DECKS above and the DeckPickerModal rendered in the !gameMode branch.
  const [deckPickerOpen, setDeckPickerOpen] = useState(false);
  const [viewState, setViewState] = useState<'hand' | 'field'>('hand');
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'npc'>('player');
  const [turnNumber, setTurnNumber] = useState(1);
  // Which part of the player's own turn they're in — see TurnPhase above. The AI's
  // turn doesn't use this; it just plays/attacks directly via playAiTurn.
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('preparacao');
  // Slots (0-9) that have already moved/swapped this reposition phase — each unit
  // gets one reposition action per own turn, then it's locked until the next one.
  const [movedSlots, setMovedSlots] = useState<Set<number>>(new Set());
  const [selectedMoverIndex, setSelectedMoverIndex] = useState<number | null>(null);
  // Reformar Linhas: extra reposition moves for this Preparação, usable even on a
  // unit that already moved (bypassing the movedSlots gate) — see handleSlotClick.
  const [bonusRepositions, setBonusRepositions] = useState(0);
  // A Tática card that's been played and is now waiting for the player to click its
  // target on the board (see TARGETABLE_TACTICS / resolveOwnTacticTarget /
  // resolveEnemyTacticTarget) — the card is already out of hand and mana already
  // spent by this point, same as a normal card that's mid-flight to a slot.
  const [pendingTacticAction, setPendingTacticAction] = useState<{ card: CardData; kind: TacticTargetKind } | null>(null);
  // Batedor: "Move após combate" — the slot it's standing in right after it survives
  // an attack, so handleSlotClick can grant it exactly one free reposition even
  // though it's the Batalha phase (see the reposition branch's own phase check).
  const [batedorFreeMove, setBatedorFreeMove] = useState<number | null>(null);

  // ── General activatable abilities (Yu-Gi-Oh-style "you may activate this" prompt) ──
  // Cardeal Pedro's "Fase Principal: cure 1 HP em um soldado aliado. Pague 1 ouro
  // para curar 3 HP em vez disso." used to be pure flavor text with no way to trigger
  // it at all. Instead of hardcoding just this one ability, this is meant to read as
  // the general shape a card game like this needs: the game itself notices the
  // General has an available Fase-Principal effect and surfaces it (a glowing prompt
  // on the General, see the CardSlot call sites below) rather than the player having
  // to already know it's there. generalAbilityUses resets every player turn (see the
  // currentTurn === 'player' effect) and caps at 1, or 2 while Cálice da Vida sits in
  // the Relíquia slot (see getGeneralAbilityMaxUses).
  const [playerGeneralAbilityUses, setPlayerGeneralAbilityUses] = useState(0);
  const [npcGeneralAbilityUses, setNpcGeneralAbilityUses] = useState(0);
  // "Ativar habilidade?" — the first prompt, offering the free vs. paid variant (or
  // just a plain activate/cancel for an ability with no cost choice).
  // `confirmed` splits this into the two Yu-Gi-Oh-style steps: first a plain "activate
  // this effect?" yes/no on the card itself, and only once the player says yes does
  // the card's own cost/amount choice show up (see activateGeneralHeal) — instead of
  // dumping both decisions on the player at once.
  const [generalAbilityPrompt, setGeneralAbilityPrompt] = useState<{ kind: 'cardeal_heal', confirmed: boolean } | null>(null);
  // Set once the player has committed to activating and chosen an amount — now
  // waiting for them to click the actual ally to heal, same two-step shape as
  // pendingTacticAction above.
  const [pendingGeneralHeal, setPendingGeneralHeal] = useState<{ amount: number } | null>(null);

  // Espião Sabotador's "Se o General aliado receber dano, no próximo turno não
  // poderá usar sua habilidade." pendingPlayerGeneralAbilityBlock/
  // pendingNpcGeneralAbilityBlock are set the moment that side's General takes
  // damage while a living Espião Sabotador is on their own board (see the damage
  // checks in handleNpcSlotClick and the AI turn loop). The "...BlockedThisTurn"
  // pair is what actually gates the ability and is deliberately a ref, not
  // state: it's flipped on inside the currentTurn-start effect (copied from the
  // pending flag above, which is then cleared) and needs to already read as
  // updated to the AI-turn-runner effect that fires in that very same
  // currentTurn-change pass — a state update made by one effect isn't visible to
  // a sibling effect's closure until a further render, but a ref mutation is
  // immediate. playerGeneralAbilityAvailable below reads it straight off the ref
  // at render time for the same reason; it still catches every real change
  // because the same effect that flips it always also calls other setState
  // (e.g. setPlayerGeneralAbilityUses(0)) that forces the next render anyway.
  const [pendingPlayerGeneralAbilityBlock, setPendingPlayerGeneralAbilityBlock] = useState(false);
  const [pendingNpcGeneralAbilityBlock, setPendingNpcGeneralAbilityBlock] = useState(false);
  const playerGeneralAbilityBlockedThisTurnRef = useRef(false);
  const npcGeneralAbilityBlockedThisTurnRef = useRef(false);

  // Comerciante das Cruzadas ("Uma vez por turno: veja as 2 cartas do topo do
  // deck...") and Hospitalário ("Uma vez por turno: cure 1 HP...") — the same
  // Yu-Gi-Oh-style on-board prompt as the General's own ability above, just keyed
  // per-card instead of only the General slot (see getPlayerCreatureAbilityKind).
  // Tracks card INSTANCE ids (stable while a card sits on the board) rather than
  // names, since both cards have 2 copies that could be on the field at once, each
  // usable independently. Resets every player turn (see the currentTurn effect).
  const [playerActivatedAbilityIds, setPlayerActivatedAbilityIds] = useState<Set<string>>(new Set());
  // Hospitalário's two independent halves (heal an ally, then damage an enemy
  // Vanguarda unit) — same two-step "commit, then click a target" shape as
  // pendingGeneralHeal, except it can move straight to 'damage' without ever
  // showing 'heal' (see activateHospitalario) when there's no damaged ally to
  // heal, so the card isn't wasted just because the heal half has no target.
  const [pendingHospitalario, setPendingHospitalario] = useState<{ step: 'heal' | 'damage' } | null>(null);

  // Arqueiro Profissional's "Pode atacar duas vezes por rodada" is the game's
  // first case of any unit attacking more than once a turn, which means this is
  // also the game's first "already attacked this turn" tracker — every other
  // unit is implicitly capped at 1 through the exact same map (see
  // getMaxAttacksPerTurn). Keyed by slot index rather than card id: a slot that's
  // attacked once and then had its occupant swapped out via a reposition mid-turn
  // is an edge case this doesn't try to chase — Batalha-phase repositioning is
  // already restricted to Batedor's one free move (see batedorFreeMove) so it's
  // not really reachable in practice. Reset every player turn (see the
  // currentTurn effect). The AI's own attacks aren't tracked here at all — it
  // never lets a unit swing more than aiService.ts's own per-unit loop already
  // decides (see playAiTurn's Arqueiro Profissional case), so it never needs to
  // consult this.
  const [playerAttackCounts, setPlayerAttackCounts] = useState<Record<number, number>>({});

  // The reveal/search Táticas (O Soldado Retorna, Busca pelo Santo Graal, Nova
  // Tática, Escolher a Dedo, Escolher Tropas, Reunião de Fiéis) all boil down to
  // the same shape: show the player a set of candidate cards and let them pick
  // one (or a couple), then do something with the pick(s) — see openCardPicker
  // and its call sites in handlePlayCardButtonClick.
  const [cardPicker, setCardPicker] = useState<{
    title: string;
    options: CardData[];
    maxPicks: number;
    selected: CardData[];
    onConfirm: (picked: CardData[]) => void;
  } | null>(null);
  const openCardPicker = (title: string, options: CardData[], maxPicks: number, onConfirm: (picked: CardData[]) => void) => {
    setCardPicker({ title, options, maxPicks, selected: [], onConfirm });
  };

  const [playerMana, setPlayerMana] = useState(10);
  const [npcMana, setNpcMana] = useState(10);

  const [hand, setHand] = useState<CardData[]>([]);
  // The opponent's actual hand of real cards — it plays from this on its turn (see
  // playAiTurn) instead of conjuring a placeholder card out of nowhere. The face-down
  // card backs shown above the board (see npcHand.length below) are just its length;
  // the player never sees what's actually in it.
  const [npcHand, setNpcHand] = useState<CardData[]>([]);
  const [playerSlots, setPlayerSlots] = useState<(CardData | null)[]>(Array(13).fill(null));
  const [npcSlots, setNpcSlots] = useState<(CardData | null)[]>(Array(13).fill(null));
  // Cards that have died in combat, per side — shown in the on-board Graveyard pile
  // (see GraveyardPile) so a destroyed card visibly ends up somewhere instead of just
  // disappearing after its destruction animation plays out.
  const [playerGraveyard, setPlayerGraveyard] = useState<CardData[]>([]);
  const [npcGraveyard, setNpcGraveyard] = useState<CardData[]>([]);

  const [selectedAttackerIndex, setSelectedAttackerIndex] = useState<number | null>(null);
  const [detailedCard, setDetailedCard] = useState<CardData | null>(null);
  // A brief, bigger callout for whichever card was just played — mainly for the
  // opponent's plays, which otherwise happen inside a small board slot that's easy to
  // miss on a phone. Player's own plays already get a large preview during selection.
  const [announcedCard, setAnnouncedCard] = useState<{ card: CardData, side: 'player' | 'npc' } | null>(null);

  const [isImpacting, setIsImpacting] = useState(false);
  const [attackAnim, setAttackAnim] = useState<{ attackerIndex: number, targetIndex: number, isPlayerAttacking: boolean } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [gameOverWinner, setGameOverWinner] = useState<'player' | 'npc' | null>(null);

  // Emboscada (ambush) interrupt — ported/generalized from the old full-art version's
  // trap-card system: whenever EITHER side is about to take a hit, if the DEFENDING
  // side has an Emboscada card in hand, combat pauses so that card can be activated
  // before damage lands. Works both ways now (the old version only paused for the
  // human defending; here the AI gets the same reactive option, decided by a simple
  // heuristic instead of a modal — see maybeActivatePlayerAmbush/maybeActivateNpcAmbush).
  // No per-card effectKeys exist yet (none of the Emboscada cards' flavor text is wired
  // to real logic, same as every other card right now), so activating any of them
  // applies one generic reactive buff (+2 ATK / +2 HP to the unit being attacked) —
  // a placeholder in the same spirit as the rest of the deck's flavor-only effects.
  const [ambushPrompt, setAmbushPrompt] = useState<{
    defenderName: string;
    attackerName: string;
    options: CardData[];
    resolve: (chosen: CardData | null) => void;
  } | null>(null);

  // Prompt to install the game as an app (standalone, no browser chrome) — since it's
  // played almost entirely on phones, that extra screen space matters. Shown every time
  // the game is opened in a regular browser tab (never persisted as "don't show again").
  const [installPromptKind, setInstallPromptKind] = useState<'native' | 'ios' | null>(null);
  const deferredInstallPromptRef = useRef<any>(null);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;
    if (isStandalone) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      // iOS Safari has no beforeinstallprompt API — there's nothing to defer, so show
      // manual "Add to Home Screen" instructions right away.
      setInstallPromptKind('ios');
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredInstallPromptRef.current = e;
      setInstallPromptKind('native');
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      deferredInstallPromptRef.current = null;
      setInstallPromptKind(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredInstallPromptRef.current;
    if (!promptEvent) return;
    promptEvent.prompt();
    await promptEvent.userChoice;
    deferredInstallPromptRef.current = null;
    setInstallPromptKind(null);
  };

  // Flight animation for a card being played from hand onto a board slot: computed from real
  // on-screen positions (getBoundingClientRect), since the hand sits in a flat layer while the
  // board is a heavily 3D-transformed one — Framer Motion's automatic layoutId animation can't
  // reconcile the two, so this animates plain 2D screen coordinates instead.
  // The camera zooms toward the target slot BEFORE the card starts flying, so that by the
  // time we measure the slot's real screen position the board has already stopped moving —
  // otherwise the zoom/pan mid-flight makes the card land visibly offset from the real slot.
  const [preZoomSlot, setPreZoomSlot] = useState<{ slotIndex: number } | null>(null);
  const [flyingCard, setFlyingCard] = useState<{
    card: CardData; slotIndex: number;
    fromX: number; fromY: number; fromW: number; fromH: number;
    toX: number; toY: number; toW: number; toH: number;
  } | null>(null);
  // Holds the camera's zoomed-in focus for a brief moment after the card lands,
  // so the placement reads clearly before the view eases back to normal.
  const [cameraSettling, setCameraSettling] = useState<{ slotIndex: number } | null>(null);
  // A brief flash/ring burst at the screen position where a played card just landed.
  const [impactBurst, setImpactBurst] = useState<{ x: number; y: number; big?: boolean } | null>(null);
  // A "full art" card (see CardData.isFullArt) landing makes the whole board react —
  // a stronger camera shake (see getBoardAnimation's cameraSettling branch) and every
  // other card on the field flinches (see CardSlot's shockActive). Just a boolean pulse:
  // true for one beat, then back to false.
  const [boardShock, setBoardShock] = useState(false);
  const triggerFullArtReaction = () => {
    setBoardShock(true);
    setTimeout(() => setBoardShock(false), 500);
  };
  const handCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isMobile = windowSize.width < 768;
  // Board container is a fixed 1000x1250px canvas (see the 3D Board div below) that gets
  // scaled down to fit the real viewport — these divisors must match those exact dimensions.
  // Was 1400 tall: each half (NPC/player field) only needs ~484px for its general row +
  // two label+slot rows, but grid-rows-2 split the old 1400px evenly into 620px halves,
  // leaving ~136px of dead space sitting unused right next to the center divider on each
  // side — on top of the gap itself. Since this is a fixed-width-bound layout on phones
  // (width is almost always the tighter constraint, see the isMobile branch below), that
  // wasted height didn't make anything bigger — it just showed up as pure empty margin
  // above/below the whole board, squeezing the floating hand trays into less real screen
  // space than they needed. Trimming it to 1250 keeps the turn button/phase-tracker area
  // comfortably clear of the nearest slot rows while giving the hands ~150px more room.
  const boardScale = isMobile ? Math.min(windowSize.width / 1000, windowSize.height / 1250) * 1.05 : Math.min(windowSize.width / 1600, 1);
  // Hand cards are fanned out (see getFanRotation below), so the outer cards' bounding box
  // is wider than their flat width — account for that tilt or the fan's edge cards clip.
  // Scale so the WHOLE hand always fits on screen — no floor, or large hands would overflow
  // and get clipped past the screen edges (the outer container clips, it doesn't scroll).
  // Sized against a fixed reference count (not the hand's actual current length) so cards
  // stay the SAME size while dealing the opening hand (1 card growing to 5) instead of
  // visibly shrinking card by card as each new one arrives — it only starts shrinking
  // further once the hand genuinely grows past a normal opening hand's size.
  const HAND_SCALE_REFERENCE_COUNT = 5;
  const handScaleCount = Math.max(hand.length, HAND_SCALE_REFERENCE_COUNT);
  const handTotalWidth = handScaleCount > 0 ? HAND_CARD_WIDTH + (handScaleCount - 1) * HAND_CARD_STEP : HAND_CARD_WIDTH;
  const handFanMaxAngleRad = (FAN_SPREAD_DEG / 2) * (Math.PI / 180);
  const handFanExtraWidth = handScaleCount > 1 ? HAND_CARD_HEIGHT * Math.sin(handFanMaxAngleRad) : 0;
  // The 0.88 safety factor accounts for what the width-only math above doesn't: the fan's
  // rotation also pushes each card's TOP edge higher (a rotated rectangle's bounding box
  // is taller than the flat card, not just wider) and the outer cards get lifted further
  // down via getFanLift — without this margin, real devices measured the fan's outer/edge
  // cards clipping past the bottom (and, on the widest hands, the left/right) screen edges
  // instead of just sitting snugly inside them.
  const handScale = isMobile
    ? Math.min(0.85, (windowSize.width - 32) / (handTotalWidth + handFanExtraWidth)) * 0.88
    : 1;
  // Kept in sync so code running inside timers set up once at match start (which close
  // over stale state values from that render) can still read the current hand/handScale.
  // Declared here (rather than nearer their only other use, further down) because this
  // whole component returns early for the menu screen below — hooks can't come after that.
  const handRef = useRef(hand);
  useEffect(() => { handRef.current = hand; }, [hand]);
  const handScaleRef = useRef(handScale);
  useEffect(() => { handScaleRef.current = handScale; }, [handScale]);
  // The AI-turn effect (below) fires on the same currentTurn change as the redraw
  // effect that hands the NPC its per-turn card — reading npcHand directly there would
  // close over the pre-redraw value, since that update lands in a later render this
  // effect's own dependencies don't re-trigger on. A ref side-steps that: it's updated
  // synchronously enough that the AI turn, even scheduled moments later, sees the draw.
  const npcHandRef = useRef(npcHand);
  useEffect(() => { npcHandRef.current = npcHand; }, [npcHand]);

  // Real on-board deck piles — the thing the player actually looks at on the table, and
  // the anchor a newly drawn card's own arrival animation starts from (see
  // computeDrawOrigin). Kept as refs so we can read their true, on-screen position
  // (getBoundingClientRect already resolves the board's 3D transform) whenever a draw
  // happens, instead of hardcoding coordinates that would drift if the layout changes.
  const playerDeckRef = useRef<HTMLDivElement>(null);
  const npcDeckRef = useRef<HTMLDivElement>(null);
  const DRAW_FLIGHT_MS = 750; // how long a newly drawn card takes to travel from the deck and flip face-up in hand
  // Which deck's pool each side is currently drawing from — set in resetGame from
  // the deck chosen at the Quick Match picker, so this can't just be a constant
  // anymore now that there are two real decks instead of one shared card pool.
  const playerDeckPoolRef = useRef<readonly CardData[]>(DECKS.capitao.pool);
  const npcDeckPoolRef = useRef<readonly CardData[]>(DECKS.cardeal.pool);
  // Each side's General comes from the same chosen deck as its draw pool — set
  // alongside it in resetGame instead of the fixed GENERAL_PLAYER/GENERAL_NPC
  // constants this replaced.
  const generalPlayerRef = useRef<CardData>(DECKS.capitao.general);
  const generalNpcRef = useRef<CardData>(DECKS.cardeal.general);
  // A shuffled draw pile, reshuffled from the active deck once exhausted — draws
  // come from here instead of a plain random pick so the same card can't turn up
  // twice in a row purely by chance (with only 10 card types and a 5-card opening
  // hand, picking WITH replacement made an immediate repeat likely on almost every
  // match, which read as the game "swapping" a card for another copy of itself
  // rather than dealing a fresh one).
  const deckQueueRef = useRef<CardData[]>([]);
  const drawFromDeck = (): CardData => {
    if (deckQueueRef.current.length === 0) {
      deckQueueRef.current = [...playerDeckPoolRef.current].sort(() => Math.random() - 0.5);
    }
    const card = deckQueueRef.current.shift()!;
    return { ...card, id: `hand_${Date.now()}_${Math.random()}` };
  };
  // The opponent's own independent shuffled draw pile — same mechanism as the
  // player's, kept separate so the two sides don't deplete/reshuffle one shared queue.
  const npcDeckQueueRef = useRef<CardData[]>([]);
  const drawFromNpcDeck = (): CardData => {
    if (npcDeckQueueRef.current.length === 0) {
      npcDeckQueueRef.current = [...npcDeckPoolRef.current].sort(() => Math.random() - 0.5);
    }
    const card = npcDeckQueueRef.current.shift()!;
    return { ...card, id: `npc_hand_${Date.now()}_${Math.random()}` };
  };

  // Atirador Influente: "Ao ir ao cemitério: compre 3 cartas." Called from every
  // "push these destroyed cards onto the graveyard" call site (the same ones
  // withEquippedWeapons already touches — see its own comment), so it fires
  // whether the player's or the NPC's copy is the one that died. Takes the raw
  // (pre-withEquippedWeapons) destroyed list since an equipped weapon can never
  // itself be named 'Atirador Influente'. No hand-size cap — same as every other
  // draw in this game (drawFromDeck/drawFromNpcDeck have none either).
  const drawForAtiradorInfluente = (destroyedCards: CardData[], isPlayerOwner: boolean) => {
    const count = destroyedCards.filter(c => c.name === 'Atirador Influente').length;
    for (let i = 0; i < count * 3; i++) {
      if (isPlayerOwner) {
        setHand(prev => [...prev, drawFromDeck()]);
      } else {
        setNpcHand(prev => [...prev, drawFromNpcDeck()]);
      }
    }
  };

  // Where a newly drawn card should land: right next to the last real hand card (or the
  // tray's own resting spot if the hand is still empty) — an approximation of the new
  // card's actual fan slot, close enough that the flight's landing point and the real
  // hand card's resting spot read as the same place instead of two unrelated ones. Reads
  // through refs (not the hand/handScale state directly) because this is called from
  // inside timers set up once at match start (startMatchIntro) — a closure over the
  // state variables themselves would keep seeing the hand as it was at that moment.
  const getHandArrivalPoint = () => {
    const currentHand = handRef.current;
    const lastId = currentHand.length > 0 ? currentHand[currentHand.length - 1].id : null;
    const lastEl = lastId ? handCardRefs.current[lastId] : null;
    if (lastEl) {
      const r = lastEl.getBoundingClientRect();
      return { x: r.left + r.width / 2 + (HAND_CARD_STEP - HAND_CARD_WIDTH) * handScaleRef.current, y: r.top + r.height / 2 };
    }
    return { x: windowSize.width / 2, y: windowSize.height - 140 };
  };
  // Fan the hand out like a real card fan: a modest total spread, distributed evenly
  // across however many cards are in hand, with the center card slightly raised.
  // totalOverride lets code compute what a card's fan spot WILL be before it's actually
  // in the hand array yet (see computeDrawOrigin) — normal rendering just omits it and
  // uses the hand's current length. Declared here (rather than down with the rest of the
  // render-time helpers) so computeDrawOrigin below can call it without a forward
  // reference — a plain function is safe to call from a deferred timer either way, but
  // referencing one declared later in the same component is still a temporal-dead-zone
  // error at the moment this function is DEFINED, since JS evaluates default parameter
  // and closure bindings eagerly for const declarations in source order.
  const getFanRotation = (index: number, totalOverride?: number) => {
    const total = totalOverride ?? hand.length;
    if (total <= 1) return 0;
    const mid = (total - 1) / 2;
    const step = FAN_SPREAD_DEG / (total - 1);
    return (index - mid) * step;
  };
  const getFanLift = (index: number, totalOverride?: number) => {
    const total = totalOverride ?? hand.length;
    if (total <= 1) return 0;
    const mid = (total - 1) / 2;
    const normalized = mid === 0 ? 0 : (index - mid) / mid;
    return normalized * normalized * FAN_LIFT_PX;
  };
  // A newly drawn hand card's OWN initial x/y/scale (in the same local, pre-handScale
  // units its normal resting animate already uses — see the hand card's `initial` below)
  // so it starts sitting right at the real on-board deck and animates itself into its
  // fan slot, flipping face-up along the way. This card is the ONLY element involved
  // start to finish — no separate flight overlay that then hands off to a different real
  // card, which is what used to read as the card "turning into a different game element"
  // partway through, no matter how well the handoff was timed.
  const drawOriginsRef = useRef<Record<string, { x: number; y: number; scale: number }>>({});
  const computeDrawOrigin = (deckRef: React.RefObject<HTMLDivElement>, index: number) => {
    const rect = deckRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const arrival = getHandArrivalPoint();
    const scale = handScaleRef.current;
    const restLift = getFanLift(index, index + 1);
    const deckX = rect.left + rect.width / 2;
    const deckY = rect.top + rect.height / 2;
    return {
      x: (deckX - arrival.x) / scale,
      y: restLift + (deckY - arrival.y) / scale,
      scale: Math.max(0.2, rect.width / (HAND_CARD_WIDTH * scale)),
    };
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const announceCardPlayRef = useRef<number | null>(null);
  const announceCardPlay = (card: CardData, side: 'player' | 'npc') => {
    if (announceCardPlayRef.current) window.clearTimeout(announceCardPlayRef.current);
    setAnnouncedCard({ card, side });
    announceCardPlayRef.current = window.setTimeout(() => setAnnouncedCard(null), 1400);
  };

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // On mobile, window.innerHeight at the very first paint often doesn't match the real
  // settled viewport yet (the browser's own URL bar is still on screen and collapses a
  // moment later), which fires a resize -> windowSize update -> boardScale change right
  // as a match starts. Since the board's own transform animates smoothly (see the 3D
  // board's transition below), that correction used to play out as a real, visible 0.8s
  // glide of the WHOLE board — deck included — overlapping the opening deal's very
  // first draw and making the card's start point (measured mid-glide) land in a
  // slightly wrong spot, as if it hadn't come from the deck at all. Suppressing the
  // smooth transition for a brief settle window after a match starts makes any such
  // correction snap instantly instead of visibly animating, so by the time the deal's
  // first card measures the deck it's already sitting at its true final position.
  const [viewportSettled, setViewportSettled] = useState(false);
  useEffect(() => {
    if (!gameMode) { setViewportSettled(false); return; }
    const t = window.setTimeout(() => setViewportSettled(true), 500);
    return () => window.clearTimeout(t);
  }, [gameMode]);

  // Pending timers for the match-intro sequence (see startMatchIntro) — tracked so a
  // fresh resetGame (e.g. backing out to the menu and starting a new match right away)
  // can cancel any that haven't fired yet instead of letting a stale sequence land on
  // top of the new match.
  const matchIntroTimeoutsRef = useRef<number[]>([]);

  // Brings both Generals onto the board, then deals both starting hands (5 cards each)
  // with a staggered "drawn from the deck" beat — the player's own draw-animation
  // viewState for their hand, and incrementally revealing the opponent's face-down
  // hand for theirs — so the match visibly begins instead of the board and both hands
  // just appearing fully set up the instant the match starts.
  const startMatchIntro = () => {
    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay);
      matchIntroTimeoutsRef.current.push(id);
    };

    schedule(() => {
      setPlayerSlots(prev => { const next = [...prev]; next[12] = generalPlayerRef.current; return next; });
      setNpcSlots(prev => { const next = [...prev]; next[12] = generalNpcRef.current; return next; });
    }, 300);

    // Kept comfortably past the 500ms viewport-settle window above (see
    // viewportSettled) so the deck's on-screen position is already final, not still
    // correcting itself, by the time the first card's flight measures it.
    const DEAL_START = 1300;
    const DEAL_STEP = 820;
    for (let i = 0; i < 5; i++) {
      const t = DEAL_START + i * DEAL_STEP;
      schedule(() => {
        const newCard = drawFromDeck();
        const origin = computeDrawOrigin(playerDeckRef, handRef.current.length);
        if (origin) drawOriginsRef.current[newCard.id] = origin;
        setHand(prev => [...prev, newCard]);
      }, t);
      schedule(() => setNpcHand(prev => [...prev, drawFromNpcDeck()]), t + 400);
    }
  };

  // deckId is which deck the PLAYER picked at the Quick Match screen; the AI
  // always plays the other one, so every match shows both decks in action.
  const resetGame = (deckId: DeckId = 'capitao') => {
    matchIntroTimeoutsRef.current.forEach(clearTimeout);
    matchIntroTimeoutsRef.current = [];

    const npcDeckId: DeckId = deckId === 'capitao' ? 'cardeal' : 'capitao';
    playerDeckPoolRef.current = DECKS[deckId].pool;
    npcDeckPoolRef.current = DECKS[npcDeckId].pool;
    generalPlayerRef.current = DECKS[deckId].general;
    generalNpcRef.current = DECKS[npcDeckId].general;
    deckQueueRef.current = [];
    npcDeckQueueRef.current = [];

    setGameOverWinner(null);
    setCurrentTurn('player');
    setTurnNumber(1);
    setTurnPhase('preparacao');
    setMovedSlots(new Set());
    setSelectedMoverIndex(null);
    setBonusRepositions(0);
    setPendingTacticAction(null);
    setBatedorFreeMove(null);
    setAmbushPrompt(null);
    setPlayerGeneralAbilityUses(0);
    setNpcGeneralAbilityUses(0);
    setGeneralAbilityPrompt(null);
    setPendingGeneralHeal(null);
    setPlayerMana(10);
    setNpcMana(10);
    setSelectedCardIndex(null);
    setSelectedAttackerIndex(null);
    setViewState('hand');

    // Start from a clean, empty board and hand — startMatchIntro (above) brings the
    // Generals and both starting hands on with a visible entrance. Each side's General
    // is the only thing that belongs on the board at kickoff; no other cards should be
    // there until actually played.
    setHand([]);
    setNpcHand([]);
    setPlayerSlots(Array(13).fill(null));
    setNpcSlots(Array(13).fill(null));
    setPlayerGraveyard([]);
    setNpcGraveyard([]);

    startMatchIntro();
  };

  useEffect(() => {
    resetGame();
  }, []);

  const startGame = (mode: string, deckId?: DeckId) => {
    resetGame(deckId);
    setGameMode(mode);
  };

  useEffect(() => {
    if (currentTurn === 'player') {
      // Ouro (gold) is a persistent economy, not a Hearthstone-style mana crystal that
      // refills to a fixed amount every turn: it starts at 10, sits still through turns
      // 1-2, then grows by +4 every turn from turn 3 onward with no upper cap — and
      // whatever wasn't spent carries over. So a big play can be saved up for instead
      // of always being locked to what a single turn's allowance affords.
      if (turnNumber >= 3) setPlayerMana(prev => prev + 4);
      // The NPC's turn forces viewState to 'field' (zoomed out to watch it play), which
      // leaves the hand tray dimmed and pushed down off-screen (see the Hand UI's own
      // animate below) — nothing ever brought it back once play returned to the
      // player, so the hand looked like it had vanished. Bring it back to 'hand' here.
      setViewState('hand');
      // Fresh turn, fresh phase cycle — back to Preparação and every unit's move
      // available again.
      setTurnPhase('preparacao');
      setMovedSlots(new Set());
      setSelectedMoverIndex(null);
      setBonusRepositions(0);
      setBatedorFreeMove(null);
      setPlayerGeneralAbilityUses(0);
      // See pendingPlayerGeneralAbilityBlock's own comment for why this is a ref,
      // not state: playerGeneralAbilityAvailable reads it straight off at render
      // time, and a ref mutation (unlike a sibling setState call made in this same
      // effect) is visible on the very next render this effect's own other
      // setState calls already force.
      playerGeneralAbilityBlockedThisTurnRef.current = pendingPlayerGeneralAbilityBlock;
      if (pendingPlayerGeneralAbilityBlock) setPendingPlayerGeneralAbilityBlock(false);
      setPlayerActivatedAbilityIds(new Set());
      setPlayerAttackCounts({});
      if (turnNumber > 1 && hand.length < 10) {
        const newCard = drawFromDeck();
        const origin = computeDrawOrigin(playerDeckRef, hand.length);
        if (origin) drawOriginsRef.current[newCard.id] = origin;
        setHand(prev => [...prev, newCard]);
      }
      // Vigia de Mantimentos: "Uma vez por turno: se você tiver menos de 2 cartas
      // na mão, compre até ficar com 2." A passive check (no button, unlike
      // Comerciante das Cruzadas/Hospitalário) piggybacked on this same
      // once-per-turn-start effect instead of a separate per-turn guard.
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(i => playerSlots[i] && !playerSlots[i]?.isDestroyed && playerSlots[i]?.name === 'Vigia de Mantimentos')) {
        setHand(prev => prev.length >= 2 ? prev : [...prev, ...Array.from({ length: 2 - prev.length }, () => drawFromDeck())]);
      }
    } else {
      if (turnNumber >= 3) setNpcMana(prev => prev + 4);
      setViewState('field');
      setNpcGeneralAbilityUses(0);
      // Same ref-not-state reasoning as the player branch above, but here it's
      // load-bearing for a different reason: the AI-turn-runner effect below
      // fires in this exact same currentTurn-change pass, and its closure would
      // otherwise still see the pre-update value if this were plain state (a
      // sibling effect's setState isn't visible to another effect's closure
      // until a further render — a ref mutation is immediate).
      npcGeneralAbilityBlockedThisTurnRef.current = pendingNpcGeneralAbilityBlock;
      if (pendingNpcGeneralAbilityBlock) setPendingNpcGeneralAbilityBlock(false);
      if (turnNumber > 1 && npcHand.length < 10) {
        setNpcHand(prev => [...prev, drawFromNpcDeck()]);
      }
      // Vigia de Mantimentos, NPC side — same passive check as the player's own above.
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(i => npcSlots[i] && !npcSlots[i]?.isDestroyed && npcSlots[i]?.name === 'Vigia de Mantimentos')) {
        setNpcHand(prev => prev.length >= 2 ? prev : [...prev, ...Array.from({ length: 2 - prev.length }, () => drawFromNpcDeck())]);
      }
    }
  }, [currentTurn, turnNumber]);

  useEffect(() => {
    if (currentTurn === 'npc' && gameMode === 'Quick Match' && !isAnimating && !gameOverWinner) {
      const runAiTurn = async () => {
        setIsAnimating(true);
        const { actions, playedCardIds } = playAiTurn(npcSlots, playerSlots, npcMana, npcHandRef.current, getValidAttackTargets, turnNumber);
        if (playedCardIds.length > 0) {
          setNpcHand(prev => prev.filter(c => !playedCardIds.includes(c.id)));
        }

        let currentNpcSlots = [...npcSlots];
        let currentPlayerSlots = [...playerSlots];
        let currentNpcMana = npcMana;
        let playerGeneralFell = false;

        // Cardeal Pedro's General ability (see resolveGeneralHeal/GENERAL_ABILITIES
        // below for the player-facing version of the exact same rule) has no target
        // to pick for the AI — it just always heals its currently weakest ally,
        // spending gold for the bigger heal whenever it can afford to. Mirrors the
        // player's own once-or-twice-per-turn cap (Cálice da Vida) instead of a
        // separate, potentially more generous rule for the opponent.
        // Espião Sabotador: blocked for exactly the turn after the General took
        // damage (see npcGeneralAbilityBlockedThisTurnRef's own comment above).
        if (currentNpcSlots[12]?.name === 'Cardeal Pedro' && !npcGeneralAbilityBlockedThisTurnRef.current) {
          const maxUses = currentNpcSlots[10]?.name === 'Cálice da Vida' ? 2 : 1;
          let usesThisTurn = 0;
          while (usesThisTurn < maxUses) {
            const allyIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(i => currentNpcSlots[i]);
            if (allyIndices.length === 0) break;
            const weakest = allyIndices.reduce((a, b) => currentNpcSlots[a]!.hp <= currentNpcSlots[b]!.hp ? a : b);
            const payGold = currentNpcMana >= 1;
            const healAmount = payGold ? 3 : 1;
            if (payGold) currentNpcMana -= 1;
            let healed = { ...currentNpcSlots[weakest]!, hp: currentNpcSlots[weakest]!.hp + healAmount };
            // Aprendiz de Infantaria: "Ao ser curado: recebe +1 ATK permanente."
            if (healed.name === 'Aprendiz de Infantaria') healed = { ...healed, atk: healed.atk + 1 };
            currentNpcSlots[weakest] = healed;
            usesThisTurn++;
          }
          if (usesThisTurn > 0) {
            setNpcGeneralAbilityUses(usesThisTurn);
            setNpcSlots([...currentNpcSlots]);
            setNpcMana(currentNpcMana);
            showToast(`O oponente usou a habilidade do General (${usesThisTurn}x)!`);
            await new Promise(resolve => setTimeout(resolve, 700));
          }
        }

        // Comerciante das Cruzadas / Hospitalário: the same once-per-turn creature
        // abilities as the player's own copies (see activateComercianteDasCruzadas/
        // activateHospitalario below), just auto-run with no UI — every living copy
        // on the NPC's board fires once, same as the player only ever gets one
        // activation per copy per turn.
        for (let i = 0; i <= 9; i++) {
          const ownedCard = currentNpcSlots[i];
          if (!ownedCard || ownedCard.isDestroyed) continue;
          if (ownedCard.name === 'Comerciante das Cruzadas') {
            if (npcDeckQueueRef.current.length < 2) {
              npcDeckQueueRef.current = [...npcDeckQueueRef.current, ...[...npcDeckPoolRef.current].sort(() => Math.random() - 0.5)];
            }
            const revealed = npcDeckQueueRef.current.splice(0, 2);
            if (revealed.length > 0) {
              // Not real strategy, just a simple heuristic: prefer an actual
              // creature over a 0/0 Tática/Emboscada, otherwise take the first.
              const creatureIdx = revealed.findIndex(c => c.cardType !== 'Tática' && c.cardType !== 'Emboscada');
              const pickIdx = creatureIdx !== -1 ? creatureIdx : 0;
              const chosen = revealed[pickIdx];
              const leftovers = revealed.filter((_, idx) => idx !== pickIdx);
              npcDeckQueueRef.current = [...npcDeckQueueRef.current, ...leftovers];
              setNpcHand(prev => [...prev, { ...chosen, id: `npc_hand_${Date.now()}_${Math.random()}` }]);
            }
          } else if (ownedCard.name === 'Hospitalário') {
            const allyIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(j => currentNpcSlots[j] && !currentNpcSlots[j]!.isDestroyed && isCardDamaged(currentNpcSlots[j]!));
            if (allyIndices.length > 0) {
              const weakest = allyIndices.reduce((a, b) => currentNpcSlots[a]!.hp <= currentNpcSlots[b]!.hp ? a : b);
              let healed = { ...currentNpcSlots[weakest]!, hp: currentNpcSlots[weakest]!.hp + 1 };
              if (healed.name === 'Aprendiz de Infantaria') healed = { ...healed, atk: healed.atk + 1 };
              currentNpcSlots[weakest] = healed;
            }
            const enemyVanguardaIndices = [0, 1, 2, 3, 4].filter(j => currentPlayerSlots[j] && !currentPlayerSlots[j]!.isDestroyed);
            if (enemyVanguardaIndices.length > 0) {
              const dmgTarget = enemyVanguardaIndices[Math.floor(Math.random() * enemyVanguardaIndices.length)];
              const dmg = applyDamageToSlot(currentPlayerSlots, dmgTarget, 1);
              currentPlayerSlots = dmg.slots;
              if (dmg.destroyed) {
                setPlayerGraveyard(g => [...g, ...withEquippedWeapons([dmg.destroyed!])]);
                drawForAtiradorInfluente([dmg.destroyed], true);
              }
            }
          }
        }
        setNpcSlots([...currentNpcSlots]);
        setPlayerSlots([...currentPlayerSlots]);

        for (const action of actions) {
          if (action.type === 'play_card') {
            // General (12) is fixed at game start; Relíquia/Terreno slots (10/11) are off-limits to the AI's generic minions
            if (action.slotIndex >= 10) continue;
            // Show the card big in the corner and pause on it for a beat BEFORE it lands
            // on the board — the opponent used to slap cards down almost instantly, too
            // fast to read on a small phone screen, and this fixes both problems at once.
            announceCardPlay(action.card, 'npc');
            await new Promise(resolve => setTimeout(resolve, 1000));
            currentNpcSlots[action.slotIndex] = action.card;
            // Nobre Religioso: "Ao entrar em campo: invoca Soldados Leais..." —
            // applies regardless of which side plays it.
            currentNpcSlots = applyNobreReligiosoSummon(currentNpcSlots, action.slotIndex);
            currentNpcMana -= action.card.cost;
            setNpcSlots([...currentNpcSlots]);
            setNpcMana(currentNpcMana);
            await new Promise(resolve => setTimeout(resolve, 700));
          } else if (action.type === 'attack') {
            setAttackAnim({ attackerIndex: action.attackerSlot, targetIndex: action.targetSlot, isPlayerAttacking: false });
            await new Promise(resolve => setTimeout(resolve, 300));

            setIsImpacting(true);
            await new Promise(resolve => setTimeout(resolve, 200));
            setIsImpacting(false);

            const attacker = currentNpcSlots[action.attackerSlot];
            if (!attacker) continue;

            let hasDestroyed = false;

            let defender = currentPlayerSlots[action.targetSlot];
            let targetSlot = action.targetSlot;
            if (defender) {
              const ambushCard = await maybeActivatePlayerAmbush(attacker, defender, currentNpcSlots);
              let cancelled = false;
              if (ambushCard) {
                const resolved = resolveAmbushEffect(ambushCard, currentNpcSlots, action.attackerSlot, currentPlayerSlots, action.targetSlot);
                currentNpcSlots = resolved.attackerSlots;
                currentPlayerSlots = resolved.defenderSlots;
                targetSlot = resolved.defenderIndex;
                defender = resolved.defender;
                cancelled = resolved.cancelled;
                setNpcSlots([...currentNpcSlots]);
                setPlayerSlots([...currentPlayerSlots]);
              }

              if (!cancelled && defender) {
                let attackerAtk = getEffectiveAtk(attacker, action.attackerSlot, currentNpcSlots, currentPlayerSlots);
                // Soldado Fanático — see the exact same check (and its comment) in
                // handleNpcSlotClick above; this is the AI-side mirror of it.
                if (attacker.name === 'Soldado Fanático' && currentPlayerSlots[12] && currentPlayerSlots[12]?.name !== 'Cardeal Pedro') attackerAtk += 2;
                const defenderAtk = getEffectiveAtk(defender, targetSlot, currentPlayerSlots, currentNpcSlots);
                const attackerReduction = getIncomingDamageReduction(action.attackerSlot, currentNpcSlots);
                const defenderReduction = getIncomingDamageReduction(targetSlot, currentPlayerSlots);
                const attackerHpBonus = (attacker.pendingCombatBonus?.hp ?? 0) + getAuraCombatHpBonus(attacker, currentNpcSlots);
                const defenderHpBonus = (defender.pendingCombatBonus?.hp ?? 0) + getAuraCombatHpBonus(defender, currentPlayerSlots);
                const damageToDefender = Math.max(0, attackerAtk - defenderReduction);

                // Espião Sabotador — see the exact same check (and its comment) in
                // handleNpcSlotClick above; here the DEFENDER's side is the player.
                if (targetSlot === 12 && damageToDefender > 0 && hasEspiaoOnBoard(currentPlayerSlots)) {
                  setPendingPlayerGeneralAbilityBlock(true);
                  showToast('Espião Sabotador: a habilidade do seu General foi bloqueada no seu próximo turno!');
                }

                const updatedAttacker = {
                  ...attacker,
                  hp: attacker.hp + attackerHpBonus - Math.max(0, defenderAtk - attackerReduction),
                  pendingCombatBonus: undefined,
                };
                const updatedDefender = {
                  ...defender,
                  hp: defender.hp + defenderHpBonus - damageToDefender,
                  pendingCombatBonus: undefined,
                };

                if (updatedAttacker.hp <= 0) {
                  currentNpcSlots[action.attackerSlot] = { ...updatedAttacker, isDestroyed: true };
                  hasDestroyed = true;
                } else {
                  currentNpcSlots[action.attackerSlot] = updatedAttacker;
                }

                if (updatedDefender.hp <= 0) {
                  currentPlayerSlots[targetSlot] = { ...updatedDefender, isDestroyed: true };
                  hasDestroyed = true;
                  if (updatedDefender.cardType === 'General') {
                    playerGeneralFell = true;
                  }
                } else {
                  currentPlayerSlots[targetSlot] = updatedDefender;
                }

                // Jorge, o Lanceiro: "Ao atacar a Vanguarda: causa 2 de dano à
                // unidade na Retaguarda da mesma coluna." A splash side-effect,
                // independent of whether the main target survived.
                if (attacker.name === 'Jorge, o Lanceiro' && isFrontline(targetSlot) && currentPlayerSlots[targetSlot + 5]) {
                  const splash = applyDamageToSlot(currentPlayerSlots, targetSlot + 5, 2);
                  currentPlayerSlots = splash.slots;
                  if (splash.destroyed) {
                    setPlayerGraveyard(g => [...g, ...withEquippedWeapons([splash.destroyed!])]);
                    drawForAtiradorInfluente([splash.destroyed], true);
                    hasDestroyed = true;
                  }
                }
              }

              setNpcSlots([...currentNpcSlots]);
              setPlayerSlots([...currentPlayerSlots]);
            }

            setAttackAnim(null);

            if (playerGeneralFell) break;

            if (hasDestroyed) {
              await new Promise(resolve => setTimeout(resolve, 1000));
              const destroyedNpcCards = currentNpcSlots.filter((c): c is CardData => !!c?.isDestroyed);
              const destroyedPlayerCards = currentPlayerSlots.filter((c): c is CardData => !!c?.isDestroyed);
              if (destroyedNpcCards.length) {
                setNpcGraveyard(g => [...g, ...withEquippedWeapons(destroyedNpcCards)]);
                drawForAtiradorInfluente(destroyedNpcCards, false);
              }
              if (destroyedPlayerCards.length) {
                setPlayerGraveyard(g => [...g, ...withEquippedWeapons(destroyedPlayerCards)]);
                drawForAtiradorInfluente(destroyedPlayerCards, true);
              }
              currentNpcSlots = currentNpcSlots.map(c => c?.isDestroyed ? null : c);
              currentPlayerSlots = currentPlayerSlots.map(c => c?.isDestroyed ? null : c);
              setNpcSlots([...currentNpcSlots]);
              setPlayerSlots([...currentPlayerSlots]);
            } else {
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          }
        }

        if (playerGeneralFell) {
          setGameOverWinner('npc');
          setIsAnimating(false);
          return;
        }

        // The NPC's own turn just ended too — same Soldado Tático end-of-turn swap
        // as the player's side (see applyEndOfTurnSwaps), in case the AI ends up
        // playing Deck Capitão this match (see resetGame). Aurelion's active isn't
        // mirrored here: it only fires off actual repositioning, and the AI never
        // repositions its own units (see the Relíquia/Terreno skip above).
        currentNpcSlots = applyEndOfTurnSwaps(currentNpcSlots);
        setNpcSlots([...currentNpcSlots]);

        setCurrentTurn('player');
        setTurnNumber(prev => prev + 1);
        setIsAnimating(false);
      };
      
      const timer = setTimeout(runAiTurn, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, gameMode, gameOverWinner]);

  if (!gameMode) {
    return (
      <div className="relative w-full h-dvh bg-zinc-950 text-white">
        <MainMenu onSelectMode={(mode) => {
          if (mode === 'Quick Match') setDeckPickerOpen(true);
          else startGame(mode);
        }} />
        <AnimatePresence>
          {deckPickerOpen && (
            <DeckPickerModal
              onSelect={(deckId) => { setDeckPickerOpen(false); startGame('Quick Match', deckId); }}
              onClose={() => setDeckPickerOpen(false)}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {installPromptKind && (
            <InstallPrompt
              kind={installPromptKind}
              onInstall={handleInstallClick}
              onDismiss={() => setInstallPromptKind(null)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  const handleCardClick = (index: number) => {
    if (viewState === 'field') return; // hand cards are non-interactive once zoomed to the board
    if (turnPhase !== 'preparacao') {
      showToast("Jogar cartas só na fase de Preparação!");
      return;
    }
    if (selectedCardIndex === index) {
      // Tapped the already-previewed card again — cancel the preview
      setSelectedCardIndex(null);
    } else {
      // First tap: bring the card to the front of the overlapping fan and show
      // the "Jogar Carta" button, without leaving the hand view yet. This lets
      // the player read a card that's normally covered by the ones in front of it.
      setSelectedCardIndex(index);
      setSelectedAttackerIndex(null);
    }
  };

  const handlePlayCardButtonClick = () => {
    const card = hand[selectedCardIndex!];
    if (playerMana < card.cost) {
      showToast("Ouro insuficiente!");
      return;
    }

    // Reformar Linhas: no target to pick, it just grants bonus reposition moves —
    // resolve it immediately instead of zooming to the board for nothing.
    if (card.name === 'Reformar Linhas') {
      setPlayerMana(prev => prev - card.cost);
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      setPlayerGraveyard(g => [...g, card]);
      setBonusRepositions(prev => prev + 3);
      setSelectedCardIndex(null);
      showToast('Reformar Linhas: +3 reposicionamentos bônus neste turno!');
      return;
    }

    // Aumento de Impostos (Deck Cardeal): immediate, no target.
    if (card.name === 'Aumento de Impostos') {
      setPlayerMana(prev => prev - card.cost + 1);
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      setPlayerGraveyard(g => [...g, card]);
      setSelectedCardIndex(null);
      showToast('Aumento de Impostos: +1 ouro neste turno!');
      return;
    }

    // Trabuco (Deck Cardeal): "Causa 2 de dano a TODAS as unidades inimigas" —
    // immediate AOE, no target to pick. Hits every enemy creature/General (0-9,
    // 12) — the Relíquia/Terreno slots (10/11) aren't "unidades".
    if (card.name === 'Trabuco') {
      setPlayerMana(prev => prev - card.cost);
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      setPlayerGraveyard(g => [...g, card]);
      setSelectedCardIndex(null);
      let nextNpcSlots = [...npcSlots];
      const destroyed: CardData[] = [];
      let npcGeneralFell = false;
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12].forEach(i => {
        const result = applyDamageToSlot(nextNpcSlots, i, 2);
        nextNpcSlots = result.slots;
        if (result.destroyed) {
          destroyed.push(result.destroyed);
          if (result.destroyed.cardType === 'General') npcGeneralFell = true;
        }
      });
      setNpcSlots(nextNpcSlots);
      if (destroyed.length) {
        setNpcGraveyard(g => [...g, ...withEquippedWeapons(destroyed)]);
        drawForAtiradorInfluente(destroyed, false);
      }
      showToast('Trabuco: 2 de dano a todas as unidades inimigas!');
      if (npcGeneralFell) setGameOverWinner('player');
      return;
    }

    // The other 4 targetable Táticas (see TARGETABLE_TACTICS) — commit to playing
    // the card now (same as any other card, mana spent and out of hand), then wait
    // for the player to click its target instead of a slot to place it in.
    const kind = TARGETABLE_TACTICS[card.name];
    if (kind) {
      setPlayerMana(prev => prev - card.cost);
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      setPendingTacticAction({ card, kind });
      setSelectedCardIndex(null);
      setViewState('field');
      showToast(TACTIC_TARGET_PROMPTS[kind]);
      return;
    }

    // O Soldado Retorna: reclaim one soldier from your own graveyard.
    if (card.name === 'O Soldado Retorna') {
      const candidates = playerGraveyard.filter(c => SOLDIER_TYPES.includes(c.cardType as CardType));
      if (candidates.length === 0) {
        setSelectedCardIndex(null);
        showToast('Não há soldados no cemitério.');
        return;
      }
      setPlayerMana(prev => prev - card.cost);
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      setSelectedCardIndex(null);
      openCardPicker('Escolha um soldado do cemitério para adicionar à mão', candidates, 1, (picked) => {
        const chosen = picked[0];
        setPlayerGraveyard(g => g.filter(c => c.id !== chosen.id).concat(card));
        setHand(prev => [...prev, { ...chosen, id: `hand_${Date.now()}_${Math.random()}`, isDestroyed: undefined }]);
        setCardPicker(null);
        showToast(`${chosen.name} voltou para sua mão!`);
      });
      return;
    }

    // Busca pelo Santo Graal: search the deck for a Terreno or Relíquia.
    if (card.name === 'Busca pelo Santo Graal') {
      const candidates = playerDeckPoolRef.current.filter(c => c.cardType === 'Terreno' || c.cardType === 'Relíquia');
      if (candidates.length === 0) {
        setSelectedCardIndex(null);
        showToast('Não há Terreno ou Relíquia no deck.');
        return;
      }
      setPlayerMana(prev => prev - card.cost);
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      setSelectedCardIndex(null);
      openCardPicker('Escolha uma carta de Terreno ou Relíquia do deck', candidates, 1, (picked) => {
        const chosen = picked[0];
        setHand(prev => [...prev, { ...chosen, id: `hand_${Date.now()}_${Math.random()}` }]);
        setPlayerGraveyard(g => [...g, card]);
        setCardPicker(null);
        showToast(`${chosen.name} adicionada à mão!`);
      });
      return;
    }

    // Nova Tática: search the deck for any Tática.
    if (card.name === 'Nova Tática') {
      const candidates = playerDeckPoolRef.current.filter(c => c.cardType === 'Tática');
      if (candidates.length === 0) {
        setSelectedCardIndex(null);
        showToast('Não há Táticas no deck.');
        return;
      }
      setPlayerMana(prev => prev - card.cost);
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      setSelectedCardIndex(null);
      openCardPicker('Escolha uma Tática do deck para adicionar à mão', candidates, 1, (picked) => {
        const chosen = picked[0];
        setHand(prev => [...prev, { ...chosen, id: `hand_${Date.now()}_${Math.random()}` }]);
        setPlayerGraveyard(g => [...g, card]);
        setCardPicker(null);
        showToast(`${chosen.name} adicionada à mão!`);
      });
      return;
    }

    // Escolher a Dedo: search the deck for any soldier.
    if (card.name === 'Escolher a Dedo') {
      const candidates = playerDeckPoolRef.current.filter(c => SOLDIER_TYPES.includes(c.cardType as CardType));
      if (candidates.length === 0) {
        setSelectedCardIndex(null);
        showToast('Não há soldados no deck.');
        return;
      }
      setPlayerMana(prev => prev - card.cost);
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      setSelectedCardIndex(null);
      openCardPicker('Escolha um soldado do deck para adicionar à mão', candidates, 1, (picked) => {
        const chosen = picked[0];
        setHand(prev => [...prev, { ...chosen, id: `hand_${Date.now()}_${Math.random()}` }]);
        setPlayerGraveyard(g => [...g, card]);
        setCardPicker(null);
        showToast(`${chosen.name} adicionada à mão!`);
      });
      return;
    }

    // Escolher Tropas: reveal the real top 4 of the deck (not just the pool —
    // this one actually cares about draw order), keep 2, bottom 2.
    if (card.name === 'Escolher Tropas') {
      if (deckQueueRef.current.length < 4) {
        deckQueueRef.current = [...deckQueueRef.current, ...[...playerDeckPoolRef.current].sort(() => Math.random() - 0.5)];
      }
      const revealed = deckQueueRef.current.splice(0, 4);
      setPlayerMana(prev => prev - card.cost);
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      setSelectedCardIndex(null);
      openCardPicker('Veja as 4 cartas do topo — escolha 2 para a mão', revealed, 2, (picked) => {
        const pickedIds = new Set(picked.map(c => c.id));
        const leftovers = revealed.filter(c => !pickedIds.has(c.id));
        deckQueueRef.current = [...deckQueueRef.current, ...leftovers];
        setHand(prev => [...prev, ...picked.map(c => ({ ...c, id: `hand_${Date.now()}_${Math.random()}` }))]);
        setPlayerGraveyard(g => [...g, card]);
        setCardPicker(null);
        showToast(`${picked.length} carta(s) adicionada(s) à mão!`);
      });
      return;
    }

    // Reunião de Fiéis: summon up to 2 zero-ATK soldiers straight from the deck
    // into empty Vanguarda slots, then shuffle.
    if (card.name === 'Reunião de Fiéis') {
      const candidates = playerDeckPoolRef.current.filter(c => SOLDIER_TYPES.includes(c.cardType as CardType) && c.atk === 0);
      const emptyVanguarda = [0, 1, 2, 3, 4].filter(i => !playerSlots[i]);
      if (candidates.length === 0 || emptyVanguarda.length === 0) {
        setSelectedCardIndex(null);
        showToast(candidates.length === 0 ? 'Não há soldados de 0 ATK no deck.' : 'Não há slots livres na Vanguarda.');
        return;
      }
      setPlayerMana(prev => prev - card.cost);
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      setSelectedCardIndex(null);
      openCardPicker(
        `Escolha até ${Math.min(2, emptyVanguarda.length)} soldado(s) de 0 ATK para invocar na Vanguarda`,
        candidates,
        Math.min(2, emptyVanguarda.length),
        (picked) => {
          setPlayerSlots(prev => {
            const next = [...prev];
            picked.forEach((chosen, i) => {
              const slot = emptyVanguarda[i];
              if (slot !== undefined) next[slot] = { ...chosen, id: `hand_${Date.now()}_${Math.random()}_${i}` };
            });
            return next;
          });
          deckQueueRef.current = [...playerDeckPoolRef.current].sort(() => Math.random() - 0.5);
          setPlayerGraveyard(g => [...g, card]);
          setCardPicker(null);
          showToast(`${picked.length} soldado(s) invocado(s)! Deck embaralhado.`);
        }
      );
      return;
    }

    // Emboscada cards have no placement behavior at all — they only resolve via the
    // ambush interrupt when the OPPONENT attacks (see maybeActivatePlayerAmbush).
    // Dropping one on the board like a creature would just waste it as an inert 0/0
    // body forever, so keep it in hand instead.
    if (card.cardType === 'Emboscada') {
      setSelectedCardIndex(null);
      showToast('Emboscadas ativam sozinhas quando você é atacado — mantenha na mão.');
      return;
    }
    // Any other Tática reaching this point isn't handled by the immediate/targetable
    // branches above, meaning it has no implemented effect yet (see the Deck Cardeal
    // mechanics note above this component) — same reasoning as Emboscada.
    if (card.cardType === 'Tática') {
      setSelectedCardIndex(null);
      showToast('Essa Tática ainda não pode ser jogada.');
      return;
    }

    // Only now do we zoom out to the board so the player can pick a slot.
    setViewState('field');
  };

  // True for the whole hand-off from "card selected" to "card landed on the board" — the
  // camera pre-zoom, the flight itself, and the brief settle afterward. Used to ignore
  // stray clicks that would otherwise cancel the card's selection mid-transition.
  const isCardInFlightTransition = !!(preZoomSlot || flyingCard || cameraSettling);

  // Which of the opponent's slots the currently-selected attacker can actually reach
  // (see getValidAttackTargets) — a plain per-render computation rather than a Hook
  // (this component conditionally returns early above for the main menu, so anything
  // declared here can't be a Hook call without breaking React's rules-of-hooks).
  const validAttackTargets = selectedAttackerIndex !== null
    ? getValidAttackTargets(selectedAttackerIndex, playerSlots, npcSlots)
    : new Set<number>();

  // Which slots (0-9) the currently-selected mover can reposition into this
  // Preparação phase — an empty adjacent slot, or an adjacent ally to swap with.
  // Cavaleiro Tático gets the whole row instead (see canReposition).
  const validMoveTargets = selectedMoverIndex !== null
    ? new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(i => canReposition(playerSlots[selectedMoverIndex!], selectedMoverIndex!, i)))
    : new Set<number>();

  // Most turns (1-2) have exactly one phase, so the plaque just reads "SEU TURNO" like
  // it always has — tapping it ends the turn directly, no extra step. Only from turn 3
  // on, when Batalha exists as a second phase, does it briefly show a named transition
  // ("AVANÇAR: BATALHA") before settling back to "SEU TURNO" for the actual end-turn tap.
  const activePhases = phasesForTurn(turnNumber);
  const isLastPhaseOfTurn = activePhases[activePhases.length - 1] === turnPhase;

  // Cálice da Vida (Relíquia, the slot-10 special slot) lets Cardeal Pedro's General
  // ability fire twice per turn instead of once — see GENERAL_ABILITIES below.
  const playerGeneralAbilityMaxUses = playerSlots[10]?.name === 'Cálice da Vida' ? 2 : 1;
  // Whether the player's own General has an activatable Fase-Principal ability ready
  // right now — drives the glowing prompt icon on the General slot (see CardSlot's
  // showAbilityPrompt call sites). Requires an actual ally on the board to heal;
  // otherwise there's nothing to target and the prompt would just dead-end.
  const playerGeneralAbilityAvailable =
    playerSlots[12]?.name === 'Cardeal Pedro' && !playerSlots[12]?.isDestroyed &&
    currentTurn === 'player' && turnPhase === 'preparacao' &&
    playerGeneralAbilityUses < playerGeneralAbilityMaxUses &&
    // Espião Sabotador: blocked for exactly the one turn following the General
    // taking damage (see playerGeneralAbilityBlockedThisTurnRef's own comment).
    !playerGeneralAbilityBlockedThisTurnRef.current &&
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(i => playerSlots[i]);

  // Comerciante das Cruzadas / Hospitalário: which once-per-turn creature ability
  // (if any) is available to activate on this exact player slot right now — same
  // "you may activate this" shape as playerGeneralAbilityAvailable above, just
  // per-card instead of only the General (see the Sparkles button rendered next
  // to each of these below, and activateComercianteDasCruzadas/activateHospitalario).
  const getPlayerCreatureAbilityKind = (slotIndex: number): 'comerciante' | 'hospitalario' | null => {
    if (currentTurn !== 'player' || turnPhase !== 'preparacao') return null;
    const card = playerSlots[slotIndex];
    if (!card || card.isDestroyed || playerActivatedAbilityIds.has(card.id)) return null;
    if (card.name === 'Comerciante das Cruzadas') return 'comerciante';
    if (card.name === 'Hospitalário') return 'hospitalario';
    return null;
  };

  // A "conducting line" from the selected attacker to every occupied enemy slot — green
  // and flowing for a reachable target, dim red for one that's blocked/out of range —
  // so the lane-blocking rule reads as an obvious line on the board, not just an arrow
  // or a border color the player has to notice on their own. Uses real on-screen
  // positions (via the slotId DOM ids) rather than board-local coordinates because the
  // two ends live in a 3D-tilted board and need to line up exactly as rendered.
  const attackLines: { x1: number; y1: number; x2: number; y2: number; valid: boolean }[] = [];
  if (selectedAttackerIndex !== null) {
    const fromEl = document.getElementById(`player-${selectedAttackerIndex}`);
    if (fromEl) {
      const fromRect = fromEl.getBoundingClientRect();
      const from = { x: fromRect.left + fromRect.width / 2, y: fromRect.top + fromRect.height / 2 };
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(i => {
        if (!npcSlots[i]) return;
        const toEl = document.getElementById(`npc-${i}`);
        if (!toEl) return;
        const toRect = toEl.getBoundingClientRect();
        attackLines.push({
          x1: from.x, y1: from.y,
          x2: toRect.left + toRect.width / 2, y2: toRect.top + toRect.height / 2,
          valid: validAttackTargets.has(i),
        });
      });
    }
  }

  // Player is defending: pause and let them choose (or decline) — the actual prompt UI
  // lives right on the eligible card(s) in the hand fan (see the "isAmbushCandidate"
  // branch in the hand render below), not a separate modal, so the player keeps seeing
  // their whole hand while deciding. This toast is just the "why did my hand just pop
  // up" context, since that part has nowhere else to live.
  const maybeActivatePlayerAmbush = (attacker: CardData, defender: CardData, attackerSlots: (CardData | null)[]): Promise<CardData | null> => {
    // Espião Sabotador: "Na Vanguarda: impede Emboscadas inimigas." The DEFENDER
    // here is the player — this card has to be read on the ATTACKER's (the NPC's)
    // side to matter, since it's the attacker's own Espião that "sees through"
    // the defender's ambush. Easy to get backwards: it does NOT protect whoever
    // it's standing in front of on defense, only whoever it's attacking WITH.
    if (hasEspiaoInVanguarda(attackerSlots)) return Promise.resolve(null);
    const options = handRef.current.filter(c => c.cardType === 'Emboscada');
    if (options.length === 0) return Promise.resolve(null);
    showToast(`${attacker.name} está atacando ${defender.name} — ativar Emboscada?`);
    return new Promise(resolve => {
      setAmbushPrompt({ defenderName: defender.name, attackerName: attacker.name, options, resolve });
    });
  };

  // AI is defending: no UI, just a simple heuristic — activate if the hit would
  // otherwise destroy the unit. Always picks the first Emboscada card it's holding.
  const maybeActivateNpcAmbush = async (attacker: CardData, defender: CardData, attackerSlots: (CardData | null)[]): Promise<CardData | null> => {
    // Same rule as maybeActivatePlayerAmbush above, mirrored: the player is
    // attacking here, so it's the PLAYER's own Espião Sabotador (not the NPC's,
    // even though the NPC is the one defending) that blocks the NPC's Emboscada.
    if (hasEspiaoInVanguarda(attackerSlots)) return null;
    const options = npcHandRef.current.filter(c => c.cardType === 'Emboscada');
    if (options.length === 0) return null;
    const wouldDie = defender.hp - attacker.atk <= 0;
    if (!wouldDie) return null;
    const chosen = options[0];
    await new Promise(resolve => setTimeout(resolve, 500));
    setNpcHand(prev => prev.filter(c => c.id !== chosen.id));
    setNpcGraveyard(g => [...g, chosen]);
    showToast(`O oponente ativou uma Emboscada: ${chosen.name}!`);
    return chosen;
  };

  // Resolves Avanço Coordenado / Linha Fechada / Ordem de Retirada once the player
  // clicks their target on their OWN board (see pendingTacticAction). Reposicionamento
  // Rápido targets the enemy board instead — see resolveEnemyTacticTarget.
  const resolveOwnTacticTarget = (slotIndex: number) => {
    if (!pendingTacticAction) return;
    const { card, kind } = pendingTacticAction;
    if (kind === 'reposicionamento_rapido' || kind === 'balesta' || kind === 'catapulta') return;
    const target = playerSlots[slotIndex];

    if (kind === 'avanco_coordenado') {
      if (slotIndex > 9 || !target) { showToast('Escolha uma unidade sua no campo.'); return; }
      if (!movedSlots.has(slotIndex)) { showToast('Essa unidade não se moveu neste turno.'); return; }
      setPlayerSlots(prev => {
        const next = [...prev];
        next[slotIndex] = { ...next[slotIndex]!, atk: next[slotIndex]!.atk + 2 };
        return next;
      });
      showToast(`${target.name} recebeu +2 ATK!`);
    } else if (kind === 'linha_fechada') {
      if (slotIndex > 9 || !target) { showToast('Escolha uma unidade sua no campo.'); return; }
      setPlayerSlots(prev => {
        const next = [...prev];
        for (let j = 0; j <= 9; j++) {
          if (areSlotsAdjacent(slotIndex, j) && next[j]) {
            next[j] = { ...next[j]!, dmgReduction: (next[j]!.dmgReduction ?? 0) + 1 };
          }
        }
        return next;
      });
      showToast('Linha Fechada: aliados adjacentes recebem menos dano!');
    } else if (kind === 'ordem_retirada') {
      if (!isFrontline(slotIndex) || !target) { showToast('Escolha uma unidade sua na Vanguarda.'); return; }
      const backIndex = slotIndex + 5;
      if (playerSlots[backIndex]) { showToast('A Retaguarda dessa coluna já está ocupada.'); return; }
      setPlayerSlots(prev => {
        const next = [...prev];
        next[backIndex] = { ...next[slotIndex]!, hp: next[slotIndex]!.hp + 2 };
        next[slotIndex] = null;
        return next;
      });
      showToast(`${target.name} recuou para a Retaguarda e recuperou 2 HP!`);
    } else if (kind === 'equip_armadura' || kind === 'equip_corcelete' || kind === 'equip_flecha' || kind === 'equip_espada') {
      // Deck Cardeal's 4 "Armamento" Táticas — the one explicit exception to
      // "Táticas are single-use and go straight to the graveyard": an equipped
      // weapon stays in play, visually stacked behind the unit it's on (see
      // CardSlot), until that unit dies (see graveyardWithEquipment).
      const allowedTypes = EQUIP_ALLOWED_TYPES[kind];
      if (slotIndex > 9 || !target || !target.cardType || !allowedTypes.includes(target.cardType)) {
        showToast(`Escolha uma unidade do tipo certo: ${allowedTypes.join(' ou ')}.`);
        return;
      }
      const atkBonus = kind === 'equip_flecha' ? 1 : kind === 'equip_espada' ? 2 : 0;
      const hpBonus = kind === 'equip_armadura' ? 2 : kind === 'equip_corcelete' ? 1 : 0;
      setPlayerSlots(prev => {
        const next = [...prev];
        const equipped = next[slotIndex]!;
        next[slotIndex] = {
          ...equipped,
          atk: equipped.atk + atkBonus,
          hp: equipped.hp + hpBonus,
          equippedWeapons: [...(equipped.equippedWeapons ?? []), card],
        };
        return next;
      });
      showToast(`${target.name} equipado: ${card.name}!`);
      setPendingTacticAction(null);
      setViewState('hand');
      return;
    }

    setPlayerGraveyard(g => [...g, card]);
    setPendingTacticAction(null);
    setViewState('hand');
  };

  // Resolves Reposicionamento Rápido once the player clicks the enemy unit to
  // displace — the only Deck Capitão Tática that targets the opponent's board.
  const resolveEnemyTacticTarget = (slotIndex: number) => {
    if (!pendingTacticAction) return;
    const { card, kind } = pendingTacticAction;
    if (kind !== 'reposicionamento_rapido' && kind !== 'balesta' && kind !== 'catapulta') return;

    if (kind === 'reposicionamento_rapido') {
      if (slotIndex > 9 || !npcSlots[slotIndex]) { showToast('Escolha uma unidade inimiga no campo.'); return; }
      const emptyAdjacent = [slotIndex - 1, slotIndex + 1, slotIndex - 5, slotIndex + 5]
        .filter(j => areSlotsAdjacent(slotIndex, j) && !npcSlots[j]);
      if (emptyAdjacent.length > 0) {
        const dest = emptyAdjacent[Math.floor(Math.random() * emptyAdjacent.length)];
        setNpcSlots(prev => {
          const next = [...prev];
          next[dest] = next[slotIndex];
          next[slotIndex] = null;
          return next;
        });
        showToast('Reposicionamento Rápido: unidade inimiga deslocada!');
      } else {
        showToast('Não havia slot livre adjacente para deslocar a unidade.');
      }
    } else if (kind === 'balesta') {
      if (slotIndex > 9 || !npcSlots[slotIndex]) { showToast('Escolha uma unidade inimiga no campo.'); return; }
      const result = applyDamageToSlot(npcSlots, slotIndex, 3);
      setNpcSlots(result.slots);
      if (result.destroyed) {
        setNpcGraveyard(g => [...g, ...withEquippedWeapons([result.destroyed!])]);
        drawForAtiradorInfluente([result.destroyed], false);
        if (result.destroyed.cardType === 'General') setGameOverWinner('player');
      }
      showToast('Balesta: 3 de dano causado!');
    } else if (kind === 'catapulta') {
      if (slotIndex > 9) { showToast('Escolha uma fileira inimiga (Vanguarda ou Retaguarda).'); return; }
      const row = getMoveRow(slotIndex) === 0 ? [0, 1, 2, 3, 4] : [5, 6, 7, 8, 9];
      let nextNpcSlots = [...npcSlots];
      const destroyed: CardData[] = [];
      let npcGeneralFell = false;
      row.forEach(i => {
        const result = applyDamageToSlot(nextNpcSlots, i, 2);
        nextNpcSlots = result.slots;
        if (result.destroyed) {
          destroyed.push(result.destroyed);
          if (result.destroyed.cardType === 'General') npcGeneralFell = true;
        }
      });
      setNpcSlots(nextNpcSlots);
      if (destroyed.length) {
        setNpcGraveyard(g => [...g, ...withEquippedWeapons(destroyed)]);
        drawForAtiradorInfluente(destroyed, false);
      }
      if (npcGeneralFell) setGameOverWinner('player');
      showToast('Catapulta: 2 de dano em toda a fileira!');
    }

    setPlayerGraveyard(g => [...g, card]);
    setPendingTacticAction(null);
    setViewState('hand');
  };

  // Toggles one option in/out of the current cardPicker selection — used by the
  // multi-pick cases (Escolher Tropas, Reunião de Fiéis); single-pick cases resolve
  // immediately on tap instead (see the cardPicker modal below) and never call this.
  const toggleCardPickerSelection = (option: CardData) => {
    setCardPicker(prev => {
      if (!prev) return prev;
      const already = prev.selected.some(c => c.id === option.id);
      if (already) return { ...prev, selected: prev.selected.filter(c => c.id !== option.id) };
      if (prev.selected.length >= prev.maxPicks) return prev; // already at the cap
      return { ...prev, selected: [...prev.selected, option] };
    });
  };

  // Commits to activating the General's ability with a chosen cost/amount (the first
  // "Ativar habilidade?" step — see generalAbilityPrompt's modal below) and opens
  // targeting for the actual ally to heal, same two-step shape as a targetable Tática.
  const activateGeneralHeal = (amount: number, cost: number) => {
    if (cost > 0) setPlayerMana(prev => prev - cost);
    setPlayerGeneralAbilityUses(prev => prev + 1);
    setPendingGeneralHeal({ amount });
    setGeneralAbilityPrompt(null);
    showToast('Escolha um soldado aliado para curar.');
  };

  // Resolves the heal once the player clicks their chosen ally (see pendingGeneralHeal
  // above and its dispatch at the top of handleSlotClick).
  const resolveGeneralHeal = (slotIndex: number) => {
    if (!pendingGeneralHeal) return;
    const target = playerSlots[slotIndex];
    if (slotIndex > 9 || !target) { showToast('Escolha um soldado aliado no campo.'); return; }
    const amount = pendingGeneralHeal.amount;
    setPlayerSlots(prev => {
      const next = [...prev];
      let healed = { ...next[slotIndex]!, hp: next[slotIndex]!.hp + amount };
      // Aprendiz de Infantaria: "Ao ser curado: recebe +1 ATK permanente."
      if (healed.name === 'Aprendiz de Infantaria') healed = { ...healed, atk: healed.atk + 1 };
      next[slotIndex] = healed;
      return next;
    });
    showToast(`${target.name} recuperou ${amount} HP!`);
    setPendingGeneralHeal(null);
  };

  // Comerciante das Cruzadas: "Uma vez por turno: veja as 2 cartas do topo do
  // deck. Adicione 1 à mão e coloque a outra no fundo." Same reveal-then-choose
  // shape as Escolher Tropas above (see openCardPicker there), just N=2/keep=1
  // and triggered from the card's own on-board prompt instead of a hand Tática.
  const activateComercianteDasCruzadas = (card: CardData) => {
    setPlayerActivatedAbilityIds(prev => new Set(prev).add(card.id));
    if (deckQueueRef.current.length < 2) {
      deckQueueRef.current = [...deckQueueRef.current, ...[...playerDeckPoolRef.current].sort(() => Math.random() - 0.5)];
    }
    const revealed = deckQueueRef.current.splice(0, 2);
    openCardPicker('Comerciante das Cruzadas: veja as 2 cartas do topo — escolha 1 para a mão', revealed, 1, (picked) => {
      const chosen = picked[0];
      const other = revealed.find(c => c.id !== chosen.id);
      if (other) deckQueueRef.current = [...deckQueueRef.current, other];
      setHand(prev => [...prev, { ...chosen, id: `hand_${Date.now()}_${Math.random()}` }]);
      setCardPicker(null);
      showToast(`${chosen.name} adicionada à mão!`);
    });
  };

  // Hospitalário: "Uma vez por turno: cure 1 HP de um aliado e cause 1 de dano a
  // um inimigo na Vanguarda." Two independent halves, each with its own target
  // (see pendingHospitalario/resolveHospitalarioHeal/resolveHospitalarioDamage) —
  // starts on whichever half actually has a target so a fully-healthy board (or
  // an empty enemy Vanguarda) never wastes the whole activation.
  const activateHospitalario = (card: CardData) => {
    setPlayerActivatedAbilityIds(prev => new Set(prev).add(card.id));
    const hasDamagedAlly = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(i => playerSlots[i] && !playerSlots[i]?.isDestroyed && isCardDamaged(playerSlots[i]!));
    if (hasDamagedAlly) {
      setPendingHospitalario({ step: 'heal' });
      showToast('Hospitalário: escolha um aliado ferido para curar 1 HP.');
      return;
    }
    const hasEnemyVanguarda = [0, 1, 2, 3, 4].some(i => npcSlots[i] && !npcSlots[i]?.isDestroyed);
    if (hasEnemyVanguarda) {
      setPendingHospitalario({ step: 'damage' });
      showToast('Hospitalário: escolha um inimigo na Vanguarda para causar 1 de dano.');
    } else {
      showToast('Hospitalário: nenhum alvo disponível para nenhuma das duas metades.');
    }
  };

  // Resolves Hospitalário's heal half once the player clicks their own board (see
  // pendingHospitalario's dispatch at the top of handleSlotClick).
  const resolveHospitalarioHeal = (slotIndex: number) => {
    if (!pendingHospitalario) return;
    const target = playerSlots[slotIndex];
    if (slotIndex > 9 || !target || !isCardDamaged(target)) { showToast('Escolha um aliado ferido no campo.'); return; }
    setPlayerSlots(prev => {
      const next = [...prev];
      let healed = { ...next[slotIndex]!, hp: next[slotIndex]!.hp + 1 };
      // Aprendiz de Infantaria: "Ao ser curado: recebe +1 ATK permanente."
      if (healed.name === 'Aprendiz de Infantaria') healed = { ...healed, atk: healed.atk + 1 };
      next[slotIndex] = healed;
      return next;
    });
    showToast(`${target.name} recuperou 1 HP!`);
    const hasEnemyVanguarda = [0, 1, 2, 3, 4].some(i => npcSlots[i] && !npcSlots[i]?.isDestroyed);
    if (hasEnemyVanguarda) {
      setPendingHospitalario({ step: 'damage' });
      showToast('Hospitalário: escolha um inimigo na Vanguarda para causar 1 de dano.');
    } else {
      setPendingHospitalario(null);
    }
  };

  // Resolves Hospitalário's damage half once the player clicks the enemy board
  // (see pendingHospitalario's dispatch at the top of handleNpcSlotClick).
  const resolveHospitalarioDamage = (slotIndex: number) => {
    if (!pendingHospitalario) return;
    if (!isFrontline(slotIndex) || !npcSlots[slotIndex] || npcSlots[slotIndex]?.isDestroyed) {
      showToast('Escolha um inimigo na Vanguarda.');
      return;
    }
    const result = applyDamageToSlot(npcSlots, slotIndex, 1);
    setNpcSlots(result.slots);
    if (result.destroyed) {
      setNpcGraveyard(g => [...g, ...withEquippedWeapons([result.destroyed!])]);
      drawForAtiradorInfluente([result.destroyed], false);
    }
    showToast('Hospitalário causou 1 de dano!');
    setPendingHospitalario(null);
  };

  const handleSlotClick = (slotIndex: number, slotEl?: HTMLElement) => {
    if (gameOverWinner || isCardInFlightTransition) return;

    if (pendingTacticAction) { resolveOwnTacticTarget(slotIndex); return; }
    if (pendingGeneralHeal) { resolveGeneralHeal(slotIndex); return; }
    if (pendingHospitalario?.step === 'heal') { resolveHospitalarioHeal(slotIndex); return; }

    // Batedor's free post-combat move (see batedorFreeMove) opens this same
    // reposition flow even during Batalha, but only for that one exact unit.
    const isBatedorFreeMove = batedorFreeMove !== null;
    if ((turnPhase === 'preparacao' || isBatedorFreeMove) && selectedCardIndex === null) {
      // Reposition — only while no hand card is mid-selection (if one is, a click on
      // an empty slot means "play it here", handled below). Only Vanguarda/Retaguarda
      // units reposition — General/Relíquia/Terreno (10-12) are fixed, same as
      // everywhere else in this file.
      if (slotIndex > 9) {
        if (playerSlots[slotIndex]) showToast("Essa carta não pode ser reposicionada.");
        return;
      }
      if (selectedMoverIndex === null) {
        if (!playerSlots[slotIndex]) return;
        if (isBatedorFreeMove && slotIndex !== batedorFreeMove) {
          showToast("Só dá pra mover o Batedor que acabou de atacar.");
          return;
        }
        // Reformar Linhas' bonus moves (see bonusRepositions) let an already-moved
        // unit be picked back up anyway.
        if (!isBatedorFreeMove && movedSlots.has(slotIndex) && bonusRepositions <= 0) {
          showToast("Essa unidade já se reposicionou nesse turno.");
          return;
        }
        setSelectedMoverIndex(slotIndex);
        return;
      }
      if (selectedMoverIndex === slotIndex) { setSelectedMoverIndex(null); return; }
      if (!canReposition(playerSlots[selectedMoverIndex], selectedMoverIndex, slotIndex)) {
        // Clicking a different one of your own (unmoved) units re-selects it instead
        // of just failing — reads nicer than forcing a deselect first.
        if (!isBatedorFreeMove && playerSlots[slotIndex] && !movedSlots.has(slotIndex)) { setSelectedMoverIndex(slotIndex); return; }
        showToast("Só dá pra reposicionar para um slot adjacente!");
        return;
      }
      const wasAlreadyMoved = movedSlots.has(selectedMoverIndex);
      const mover = playerSlots[selectedMoverIndex];
      const occupant = playerSlots[slotIndex];
      const newSlots = [...playerSlots];
      newSlots[selectedMoverIndex] = occupant ?? null; // moving into empty, or swapping
      newSlots[slotIndex] = mover;
      // Capitão de Formação: "Ao mover: adjacentes +1 ATK" — a permanent stamp on
      // whoever ends up next to its new position.
      setPlayerSlots(applyFormationCaptainBuff(newSlots, slotIndex));
      setSelectedMoverIndex(null);

      if (isBatedorFreeMove) {
        setBatedorFreeMove(null);
        showToast("Batedor se reposicionou após o combate!");
        return;
      }
      setMovedSlots(prev => {
        const next = new Set(prev);
        next.add(selectedMoverIndex!);
        next.add(slotIndex);
        return next;
      });
      if (wasAlreadyMoved) setBonusRepositions(prev => Math.max(0, prev - 1));
      return;
    }
    if (selectedCardIndex !== null && !playerSlots[slotIndex]) {
      const cardToPlay = hand[selectedCardIndex];

      // Slot 12 is the fixed General slot — never played from hand.
      if (slotIndex === 12) {
        showToast("O General não pode ser substituído!");
        return;
      }
      // Slots 10/11 are the special slots beside the General — Relíquia/Terreno only.
      if ((slotIndex === 10 || slotIndex === 11) && cardToPlay.cardType !== 'Relíquia' && cardToPlay.cardType !== 'Terreno') {
        showToast("Esse slot é só para Relíquia ou Terreno!");
        return;
      }
      if (slotIndex <= 9 && (cardToPlay.cardType === 'Relíquia' || cardToPlay.cardType === 'Terreno')) {
        showToast("Relíquia/Terreno só pode ir no slot especial ao lado do General!");
        return;
      }

      if (playerMana < cardToPlay.cost) {
        showToast("Ouro insuficiente!");
        return;
      }

      setPlayerMana(prev => prev - cardToPlay.cost);

      const fromEl = handCardRefs.current[cardToPlay.id];
      const fromRect = fromEl?.getBoundingClientRect();

      if (fromRect && slotEl) {
        // Let the camera zoom/pan toward the slot and settle first — only once it has
        // stopped moving do we measure the slot's real on-screen position and start the
        // card's flight, so the landing spot doesn't drift out from under it mid-flight.
        // Crucially, the card stays selected and visible in its floating preview spot for
        // this whole hold — we don't touch the hand yet, so it never disappears.
        setPreZoomSlot({ slotIndex });
        setTimeout(() => {
          // Re-measure the card's own rect too, right before handing off to the flying
          // overlay, in case anything shifted during the hold.
          const latestFromRect = fromEl.getBoundingClientRect();
          const toRect = slotEl.getBoundingClientRect();
          setPreZoomSlot(null);
          setFlyingCard({
            card: cardToPlay,
            slotIndex,
            fromX: latestFromRect.left + latestFromRect.width / 2,
            fromY: latestFromRect.top + latestFromRect.height / 2,
            fromW: latestFromRect.width,
            fromH: latestFromRect.height,
            toX: toRect.left + toRect.width / 2,
            toY: toRect.top + toRect.height / 2,
            toW: toRect.width,
            toH: toRect.height,
          });
          // Only now remove the card from the hand and clear the selection — the flying
          // overlay takes over in this exact same update, so there's no frame where the
          // card isn't rendered anywhere.
          setHand(prevHand => {
            const idx = prevHand.findIndex(c => c.id === cardToPlay.id);
            if (idx === -1) return prevHand;
            const next = [...prevHand];
            next.splice(idx, 1);
            return next;
          });
          setSelectedCardIndex(null);
          setViewState('hand');
        }, 520);
      } else {
        // Couldn't measure a position (shouldn't normally happen) — place instantly.
        const newHand = [...hand];
        newHand.splice(selectedCardIndex, 1);
        setHand(newHand);
        setSelectedCardIndex(null);
        setViewState('hand');
        const newSlots = [...playerSlots];
        newSlots[slotIndex] = cardToPlay;
        setPlayerSlots(applyNobreReligiosoSummon(newSlots, slotIndex));
      }
    } else if (selectedCardIndex === null && playerSlots[slotIndex]) {
      // Select attacker — only once Batalha has unlocked (turn 3+).
      if (turnPhase !== 'batalha') {
        showToast(turnNumber < 3 ? "A fase de Batalha só libera a partir do turno 3." : "Só dá pra atacar na fase de Batalha!");
        return;
      }
      // Arqueiro Profissional gets 2 attacks this turn; every other unit gets 1
      // (see getMaxAttacksPerTurn/playerAttackCounts).
      const usedAttacks = playerAttackCounts[slotIndex] ?? 0;
      if (usedAttacks >= getMaxAttacksPerTurn(playerSlots[slotIndex]!)) {
        showToast("Essa unidade já atacou neste turno.");
        return;
      }
      if (selectedAttackerIndex === slotIndex) {
        setSelectedAttackerIndex(null);
      } else {
        setSelectedAttackerIndex(slotIndex);
      }
    } else if (selectedCardIndex !== null && playerSlots[slotIndex]) {
      // A card is selected for placement but this slot is already occupied — used to
      // be a silent no-op with no feedback at all.
      showToast("Esse slot já está ocupado!");
    }
  };

  const handleNpcSlotClick = async (slotIndex: number) => {
    if (gameOverWinner) return;
    if (pendingTacticAction) { resolveEnemyTacticTarget(slotIndex); return; }
    if (pendingHospitalario?.step === 'damage') { resolveHospitalarioDamage(slotIndex); return; }
    if (selectedAttackerIndex !== null && npcSlots[slotIndex] && !isAnimating) {
      if (!validAttackTargets.has(slotIndex)) {
        showToast("Alvo fora de alcance — tem uma carta bloqueando o caminho!");
        return;
      }
      setIsAnimating(true);
      setAttackAnim({ attackerIndex: selectedAttackerIndex, targetIndex: slotIndex, isPlayerAttacking: true });
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setIsImpacting(true);
      await new Promise(resolve => setTimeout(resolve, 200));
      setIsImpacting(false);
      
      const attacker = playerSlots[selectedAttackerIndex];
      let defender = npcSlots[slotIndex];
      let targetSlot = slotIndex;

      if (attacker && defender) {
        const ambushCard = await maybeActivateNpcAmbush(attacker, defender, playerSlots);
        let attackerSlotsAfterAmbush: (CardData | null)[] = playerSlots;
        let defenderSlotsAfterAmbush: (CardData | null)[] = npcSlots;
        let cancelled = false;
        if (ambushCard) {
          const resolved = resolveAmbushEffect(ambushCard, playerSlots, selectedAttackerIndex, npcSlots, slotIndex);
          attackerSlotsAfterAmbush = resolved.attackerSlots;
          defenderSlotsAfterAmbush = resolved.defenderSlots;
          targetSlot = resolved.defenderIndex;
          defender = resolved.defender;
          cancelled = resolved.cancelled;
        }

        const newPlayerSlots = [...attackerSlotsAfterAmbush];
        const newNpcSlots = [...defenderSlotsAfterAmbush];

        let hasDestroyed = false;
        let npcGeneralFell = false;

        if (!cancelled && defender) {
          let attackerAtk = getEffectiveAtk(attacker, selectedAttackerIndex, newPlayerSlots, newNpcSlots);
          // Soldado Fanático: "Ao atacar: se o General inimigo for de tipo oposto,
          // ganha +2 ATK." The game has no real General-faction/type concept — with
          // only 2 decks existing today, "tipo oposto" is simplified to "the enemy
          // General isn't Cardeal Pedro" (this card only exists in Deck Cardeal, so
          // its "opposite type" enemy is always Deck Capitão's General in practice).
          // Revisit this exact check if a third deck/General is ever added.
          if (attacker.name === 'Soldado Fanático' && newNpcSlots[12] && newNpcSlots[12]?.name !== 'Cardeal Pedro') attackerAtk += 2;
          const defenderAtk = getEffectiveAtk(defender, targetSlot, newNpcSlots, newPlayerSlots);
          const attackerReduction = getIncomingDamageReduction(selectedAttackerIndex, newPlayerSlots);
          const defenderReduction = getIncomingDamageReduction(targetSlot, newNpcSlots);
          const attackerHpBonus = (attacker.pendingCombatBonus?.hp ?? 0) + getAuraCombatHpBonus(attacker, newPlayerSlots);
          const defenderHpBonus = (defender.pendingCombatBonus?.hp ?? 0) + getAuraCombatHpBonus(defender, newNpcSlots);
          const damageToDefender = Math.max(0, attackerAtk - defenderReduction);

          // Espião Sabotador: "Se o General aliado receber dano, no próximo turno
          // não poderá usar sua habilidade." Checked on the DEFENDER's (NPC's) own
          // side, since it's their own General and their own Espião.
          if (targetSlot === 12 && damageToDefender > 0 && hasEspiaoOnBoard(newNpcSlots)) {
            setPendingNpcGeneralAbilityBlock(true);
            showToast('Espião Sabotador: a habilidade do General inimigo foi bloqueada no próximo turno dele!');
          }

          const updatedAttacker = {
            ...attacker,
            hp: attacker.hp + attackerHpBonus - Math.max(0, defenderAtk - attackerReduction),
            pendingCombatBonus: undefined,
          };
          const updatedDefender = {
            ...defender,
            hp: defender.hp + defenderHpBonus - damageToDefender,
            pendingCombatBonus: undefined,
          };

          if (updatedAttacker.hp <= 0) {
            newPlayerSlots[selectedAttackerIndex] = { ...updatedAttacker, isDestroyed: true };
            hasDestroyed = true;
          } else {
            newPlayerSlots[selectedAttackerIndex] = updatedAttacker;
            // Batedor: "Move após combate" — a free reposition right after it lands
            // an attack and survives, even though Batalha doesn't normally allow
            // moving (see handleSlotClick's own isBatedorFreeMove bypass).
            if (attacker.name === 'Batedor') setBatedorFreeMove(selectedAttackerIndex);
          }

          if (updatedDefender.hp <= 0) {
            newNpcSlots[targetSlot] = { ...updatedDefender, isDestroyed: true };
            hasDestroyed = true;
            if (updatedDefender.cardType === 'General') npcGeneralFell = true;
          } else {
            newNpcSlots[targetSlot] = updatedDefender;
          }

          // Jorge, o Lanceiro: "Ao atacar a Vanguarda: causa 2 de dano à unidade
          // na Retaguarda da mesma coluna." A splash side-effect, independent of
          // whether the main target survived.
          const splashTarget = attacker.name === 'Jorge, o Lanceiro' && isFrontline(targetSlot) ? newNpcSlots[targetSlot + 5] : null;
          if (splashTarget) {
            const splashHp = splashTarget.hp - 2;
            if (splashHp <= 0) {
              newNpcSlots[targetSlot + 5] = null;
              setNpcGraveyard(g => [...g, ...withEquippedWeapons([{ ...splashTarget, hp: splashHp, isDestroyed: true }])]);
              drawForAtiradorInfluente([splashTarget], false);
              hasDestroyed = true;
              if (splashTarget.cardType === 'General') npcGeneralFell = true;
            } else {
              newNpcSlots[targetSlot + 5] = { ...splashTarget, hp: splashHp };
            }
          }
        }

        setPlayerSlots(newPlayerSlots);
        setNpcSlots(newNpcSlots);
        // Arqueiro Profissional / getMaxAttacksPerTurn — recorded even if the
        // attacker didn't survive or the attack was ambush-cancelled; either way
        // it "attacked" this turn and the slot is either gone or spent.
        setPlayerAttackCounts(prev => ({ ...prev, [selectedAttackerIndex]: (prev[selectedAttackerIndex] ?? 0) + 1 }));
        setSelectedAttackerIndex(null);
        setAttackAnim(null);

        if (npcGeneralFell) {
          setGameOverWinner('player');
          setIsAnimating(false);
          return;
        }

        if (hasDestroyed) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const destroyedPlayerCards = newPlayerSlots.filter((c): c is CardData => !!c?.isDestroyed);
          const destroyedNpcCards = newNpcSlots.filter((c): c is CardData => !!c?.isDestroyed);
          if (destroyedPlayerCards.length) {
            setPlayerGraveyard(g => [...g, ...withEquippedWeapons(destroyedPlayerCards)]);
            drawForAtiradorInfluente(destroyedPlayerCards, true);
          }
          if (destroyedNpcCards.length) {
            setNpcGraveyard(g => [...g, ...withEquippedWeapons(destroyedNpcCards)]);
            drawForAtiradorInfluente(destroyedNpcCards, false);
          }
          setPlayerSlots(prev => prev.map(c => c?.isDestroyed ? null : c));
          setNpcSlots(prev => prev.map(c => c?.isDestroyed ? null : c));
        }
      }
      setIsAnimating(false);
    }
  };

  const handleBackgroundClick = () => {
    if (isCardInFlightTransition) return; // don't cancel a card mid hand-off to the board
    if (pendingTacticAction) {
      // The card's mana/hand cost is already spent (see handlePlayCardButtonClick) —
      // tapping away without picking a target just fizzles it into the graveyard
      // instead of leaving the player stuck if they change their mind or have no
      // valid target.
      setPlayerGraveyard(g => [...g, pendingTacticAction.card]);
      setPendingTacticAction(null);
      setViewState('hand');
      return;
    }
    if (pendingGeneralHeal) {
      // Same reasoning as pendingTacticAction above: the activation (and any gold
      // cost) is already committed, so backing out here just wastes it rather than
      // refunding — otherwise there'd be no real cost to peeking at the board first.
      showToast('Habilidade desperdiçada — nenhum alvo escolhido.');
      setPendingGeneralHeal(null);
      return;
    }
    if (pendingHospitalario) {
      // Same reasoning again — the card is already marked used (see
      // activateHospitalario) whether or not either half actually lands.
      showToast('Hospitalário desperdiçado — nenhum alvo escolhido.');
      setPendingHospitalario(null);
      return;
    }
    if (viewState === 'field') {
      setSelectedCardIndex(null);
      setViewState('hand');
    } else if (selectedCardIndex !== null) {
      // Tapped away while a card was only previewed (Jogar Carta not pressed yet) — cancel it
      setSelectedCardIndex(null);
    }
  };

  // On mobile, the whole hand tray is itself scaled down by handScale (see above) to fit
  // the fan on screen — since that scale is anchored at the tray's own center, it also
  // shrinks how far any translate we apply actually moves a card on screen. Dividing our
  // desired on-screen distance by handScale compensates, so these two helpers always land
  // the previewed card at the same real screen position regardless of hand size/width.
  const previewScaleFactor = isMobile ? handScale : 1;

  const getSelectedCardX = (index: number) => {
    const startX = -handTotalWidth / 2 + HAND_CARD_WIDTH / 2;
    const cardX = startX + index * HAND_CARD_STEP;
    // Tuck the previewed card right up against a side edge while the player picks a
    // slot, so it blocks as little of the board (and its slot indicators) as possible,
    // while staying fully on-screen so the player always knows what they're about to play.
    const previewHalfWidthOnScreen = (HAND_CARD_WIDTH * (isMobile ? FIELD_PREVIEW_SCALE.mobile : FIELD_PREVIEW_SCALE.desktop) * previewScaleFactor) / 2;
    const edgeGap = 6;
    // Tucked to the LEFT edge on both mobile and desktop: the right side of the board
    // now holds the player's own deck + graveyard, so parking the preview there would
    // sit it right on top of them.
    const desiredAbsDelta = -(windowSize.width / 2) + edgeGap + previewHalfWidthOnScreen;
    const targetX = desiredAbsDelta / previewScaleFactor;
    return targetX - cardX;
  };

  // How far down the screen (0 = top, 1 = bottom) the previewed card centers on.
  // Anchored near the vertical middle of the screen (just above dead center) so it
  // reads as centered rather than pinned up near the top bar, while still mostly
  // clearing the player's own Retaguarda/Vanguarda slots below it — the row they
  // need to see to pick where to play the card.
  const PREVIEW_Y_FRACTION = 0.45;
  const getSelectedCardY = () => {
    if (!isMobile) return -490;
    // Empirically calibrated against the real rendered geometry (now that the hand tray
    // scales from a bottom-center origin — see the Hand UI wrapper below — its anchor
    // sits ~106px below the true bottom edge in local, pre-scale units, and the observed
    // lift comes out to ~94% of handScale rather than handScale exactly, likely from the
    // tray's own translate+scale composition). Solving that same relationship for an
    // arbitrary target screen position (instead of just dead center) keeps this correct
    // regardless of viewport height or hand size.
    const liftScale = handScale * 0.94;
    const targetAbsY = windowSize.height * PREVIEW_Y_FRACTION;
    return (targetAbsY - windowSize.height - 106) / liftScale;
  };

  // Fan the hand out like a real card fan: a modest total spread, distributed evenly
  // across however many cards are in hand, with the center card slightly raised.

  // `baseScaleOverride` lets the background art layer (see boardAnim/artAnim below)
  // share this exact same camera logic without also inheriting boardScale — that
  // responsive fit-to-viewport factor only makes sense for the 1000x1250 board box,
  // not for a full-viewport object-cover image that already fills the screen on its
  // own. Passing 1 there means "fully covering" is the resting state, and the zoom
  // multipliers below (1.15, the shake sequences, etc.) apply as ratios on top of
  // that instead of on top of the board's own fit-to-screen scale.
  const getBoardAnimation = (baseScaleOverride?: number) => {
    // The board stays visible at all times — like looking down at a table with the
    // hand of cards held up in front of it — instead of tilting away out of view
    // while browsing the hand. Drawing a card never moves the camera either: the new
    // hand card animates itself in from the on-board deck pile (see computeDrawOrigin)
    // while the view stays put.
    const baseAnim = {
      // Flattened all the way to a true top-down view (was 25/35deg originally, then
      // 8/12deg): any tilt at all makes the board's near (player) edge occupy more
      // screen height than its far (opponent) edge and the two rows of slots read as
      // different sizes — a straight-down Hearthstone-style view keeps every slot the
      // same size and shape, easier to scan at a glance on a small phone screen.
      rotateX: 0,
      rotateZ: 0,
      y: isMobile ? 0 : -50,
      x: 0,
      z: isMobile ? 50 : 50,
      scale: baseScaleOverride ?? (isMobile ? 1.0 : 0.85) * boardScale,
    };

    // Camera follows a card being played, zooming in toward the slot it's headed for —
    // a Yu-Gi-Oh Forbidden Memories-style summon camera — then eases back once it lands.
    if (preZoomSlot || flyingCard || cameraSettling) {
      const slot = (preZoomSlot ?? flyingCard ?? cameraSettling)!.slotIndex;
      const col = slot <= 9 ? slot % 5 : 2; // 10/11/12 (Relíquia/Terreno/General) sit near center
      const rowFocus = slot <= 4 ? 1 : slot <= 9 ? 0.55 : 0.2; // Vanguarda is farthest from the hand, General row is closest
      const panX = (2 - col) * (isMobile ? 16 : 22);
      const panY = rowFocus * (isMobile ? 90 : 65);
      const focusedX = baseAnim.x + panX;
      const focusedY = baseAnim.y - panY;
      const focusedScale = baseAnim.scale * 1.15;
      // Clamped at 0 — with the base view already flat, tilting further "back" would
      // just look like the board leaning away from the player during the zoom.
      const focusedRotateX = Math.max(0, baseAnim.rotateX - 8);

      if (cameraSettling) {
        // The card just landed — a sharp shake on top of the same focused view, plus a
        // quick extra punch-in on the zoom for a stronger felt impact. A full-art card
        // (see boardShock/triggerFullArtReaction) gets a noticeably bigger, longer
        // version of the same shake instead of a separate effect.
        return boardShock ? {
          ...baseAnim,
          x: [focusedX - 32, focusedX + 26, focusedX - 18, focusedX + 11, focusedX - 5, focusedX],
          y: [focusedY + 26, focusedY - 20, focusedY + 13, focusedY - 7, focusedY + 3, focusedY],
          scale: [focusedScale * 1.12, focusedScale * 0.93, focusedScale * 1.04, focusedScale],
          rotateX: focusedRotateX,
          transition: { duration: 0.5, ease: "easeOut" }
        } : {
          ...baseAnim,
          x: [focusedX - 18, focusedX + 14, focusedX - 8, focusedX + 4, focusedX],
          y: [focusedY + 14, focusedY - 10, focusedY + 6, focusedY - 2, focusedY],
          scale: [focusedScale * 1.06, focusedScale * 0.98, focusedScale],
          rotateX: focusedRotateX,
          transition: { duration: 0.32, ease: "easeOut" }
        };
      }

      return {
        ...baseAnim,
        x: focusedX,
        y: focusedY,
        scale: focusedScale,
        rotateX: focusedRotateX,
        transition: { duration: 0.5, ease: "easeOut" }
      };
    }

    // Combat no longer moves the camera at all (it used to zoom/tilt/shake toward
    // whichever side was attacking) — the board now stays put like it does the rest
    // of the time, and only the attacking card itself lunges at its target (see
    // CardSlot's isAttacking/attackY), the way Hearthstone does it.
    return baseAnim;
  };

  // While the player is picking a slot for a previewed card, show a hint on every
  // empty slot of their own field for where that card type can (and can't) go.
  const previewedCard = viewState === 'field' && selectedCardIndex !== null ? hand[selectedCardIndex] : null;
  const getPlayerSlotHint = (slotIndex: number): SlotHint | undefined =>
    previewedCard && !playerSlots[slotIndex] ? getSlotHint(previewedCard.cardType, slotIndex) : undefined;

  // Computed once and shared by both the background art layer below and the board's
  // own motion.div (see the "3D Board" comment further down) — the "summon camera"
  // zoom/pan toward a played card used to only apply to the board's own transparent
  // tint layer, since the battlefield art lived in a separate, untransformed <img>
  // outside of it: the slots would zoom in while the actual art underneath stayed
  // completely still, looking like the camera was zooming into an empty demarcated
  // box. Both layers are centered on the same point in the viewport, so animating
  // them off the same x/y/rotateX and a matching *ratio* of zoom keeps the art and
  // the board moving in lockstep — artAnim passes baseScaleOverride=1 so the art's
  // own full-viewport coverage isn't ALSO shrunk by the board's boardScale fit
  // factor, which doesn't apply to it at all.
  const boardAnim = getBoardAnimation();
  const artAnim = getBoardAnimation(1);
  const boardTransition = { duration: viewportSettled ? 0.8 : 0, ease: [0.32, 0.72, 0, 1] as const };

  return (
    <div
      className="relative w-full h-dvh bg-[#140f0a] overflow-hidden flex flex-col items-center justify-center touch-none"
      style={{ perspective: '1200px' }}
      onClick={handleBackgroundClick}
    >
      {/* Exterior — the space around the board (see BOARD_EXTERIOR_ART_URL), now that
          the flat top-down camera (see getBoardAnimation) leaves a visible strip of it
          above/below the board — right where the hand of cards floats — instead of
          just a sliver at the tilted edges. Falls back to the plain dark gradient below
          when no art has been dropped in yet; that fallback is now a dim warm brown
          (matching the new sandstone board, see art-prompts/README.md) instead of the
          old cold indigo/black, so it reads as "the same dim stone chamber continuing
          off past the table" rather than a jarring void behind the hand. */}
      <motion.div className="absolute inset-0" animate={artAnim} transition={boardTransition}>
        {BOARD_EXTERIOR_ART_URL && (
          <img src={BOARD_EXTERIOR_ART_URL} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        )}

        {/* Background ambient light — the heavy version below was tuned as a total
            fallback for when there was no exterior art at all (a flat void), so it's
            only rendered in that case now; with the real battlefield art in place it
            was dark/opaque enough to hide almost the entire image. A much lighter
            vignette still applies on top of real art, just for edge falloff. */}
        {!BOARD_EXTERIOR_ART_URL && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(70,52,34,0.75)_0%,rgba(15,10,6,1)_100%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(180,120,50,0.12)_0%,transparent_60%)] pointer-events-none" />
          </>
        )}
        {BOARD_EXTERIOR_ART_URL && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.45)_100%)] pointer-events-none" />
        )}
      </motion.div>

      {/* 3D Board — flex-shrink-0 matters here: the root container above is a flex
          column, and this box's own explicit 1250px height is taller than most real
          viewports, so without it the browser's own flex layout was quietly shrinking
          this all the way down to viewport height BEFORE the boardScale transform
          below ever got applied — a second, uncontrolled scale-down stacked on top of
          the real one, which threw off both the object-cover crop on the board art
          (cropping away far more than intended) and any percentage-based positioning
          inside this box (resolved against the shrunk box, not the real 1000x1250). */}
      <motion.div
        className="w-[1000px] h-[1250px] shrink-0 grid grid-rows-2 gap-12 p-8 relative"
        animate={boardAnim}
        transition={boardTransition}
        onClick={(e) => {
          e.stopPropagation();
          if (isCardInFlightTransition) return; // don't cancel a card mid hand-off to the board
          if (selectedCardIndex !== null) {
            setSelectedCardIndex(null);
            setViewState('hand');
          }
          if (selectedAttackerIndex !== null) {
            setSelectedAttackerIndex(null);
          }
        }}
      >
        {/* Central Divider */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.6)] -translate-y-1/2 rounded-full pointer-events-none" />

        {/* Turn Button — a small circular tap target on the divider, off to the side,
            NOT the wide pill this used to be: that pill (and the wide horizontal
            phase-tracker row above it) was big enough to actually sit on top of the
            Vanguarda slots next to it. A plain icon (▶ to pass/advance, an hourglass
            while it's not your turn) says everything a small circle can say — the
            full "SEU TURNO"/"AVANÇAR: BATALHA"/"TURNO DO ADVERSÁRIO" text doesn't fit
            here anymore, but the always-visible phase tracker (now a narrow vertical
            stack of two short labels, not a wide horizontal row) still spells out
            which phase is which. Flips (like a coin) between an amber "your turn"
            face and a dull gray "not your turn" face. */}
        <div
          className="absolute top-1/2 -translate-y-1/2 right-16 md:right-16 z-40 pointer-events-auto flex flex-col items-center gap-2"
          style={{ perspective: 600 }}
          onClick={(e) => {
            e.stopPropagation();
            if (currentTurn !== 'player') return;
            setSelectedCardIndex(null);
            setSelectedAttackerIndex(null);
            setSelectedMoverIndex(null);
            // Preparação is ending — this is "Após Remanejamento" for Comandante
            // Aurelion (see grantAurelionBuff) and Soldado Tático's end-of-turn swap,
            // whether that means advancing into Batalha or, on an early turn with no
            // Batalha yet, ending the turn outright.
            if (turnPhase === 'preparacao') {
              setPlayerSlots(prev => applyEndOfTurnSwaps(grantAurelionBuff(prev, movedSlots)));
            }
            if (isLastPhaseOfTurn) {
              setCurrentTurn('npc');
            } else {
              const idx = activePhases.indexOf(turnPhase);
              setTurnPhase(activePhases[idx + 1]);
            }
          }}
        >
          {/* Phase tracker — always visible on the player's turn (Yu-Gi-Oh-style: every
              phase the game has shown at once, not just the current one named in
              isolation), so it's always clear what's coming, not just what's active.
              Stacked vertically (not a wide horizontal row anymore) so the whole
              turn-button cluster stays narrow enough to actually clear the board's
              slots instead of sitting on top of them. */}
          {currentTurn === 'player' && (
            <div className="flex flex-col items-center gap-1">
              {(['preparacao', 'batalha'] as TurnPhase[]).map((p, idx) => {
                const isLocked = p === 'batalha' && turnNumber < 3;
                const isCurrent = turnPhase === p;
                return (
                  <React.Fragment key={p}>
                    {idx > 0 && <div className="w-px h-1.5 bg-zinc-600" />}
                    <div
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[7px] md:text-[8px] font-black tracking-wide uppercase whitespace-nowrap transition-colors ${
                        isCurrent
                          ? 'bg-amber-500 border-amber-300 text-zinc-950 shadow-[0_0_8px_rgba(245,158,11,0.7)]'
                          : isLocked
                            ? 'bg-zinc-950/80 border-zinc-700 text-zinc-600'
                            : 'bg-zinc-950/80 border-zinc-600 text-zinc-400'
                      }`}
                    >
                      {isLocked && <Lock className="w-2 h-2" strokeWidth={3} />}
                      {PHASE_LABELS[p]}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
          <motion.div
            className="relative w-14 h-14 md:w-16 md:h-16"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateX: currentTurn === 'player' ? 0 : 180 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            whileTap={currentTurn === 'player' ? { scale: 0.9 } : undefined}
          >
            {/* Front face — tap to pass/advance. A plain code-built circle for now (a
                proper illustrated one is planned later), pulsing while it's actually
                the player's turn. */}
            <motion.div
              className="absolute inset-0 rounded-full cursor-pointer flex items-center justify-center overflow-hidden
                bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700
                border-2 border-amber-200
                shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_0_rgba(120,53,15,0.9),0_6px_12px_rgba(0,0,0,0.5)]"
              style={{ backfaceVisibility: 'hidden' }}
              animate={{
                boxShadow: currentTurn === 'player'
                  ? [
                      'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 0 rgba(120,53,15,0.9), 0 0 8px rgba(245,158,11,0.5)',
                      'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 0 rgba(120,53,15,0.9), 0 0 20px rgba(245,158,11,0.95)',
                      'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 0 rgba(120,53,15,0.9), 0 0 8px rgba(245,158,11,0.5)',
                    ]
                  : 'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 0 rgba(120,53,15,0.9), 0 0 8px rgba(245,158,11,0.5)'
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-zinc-900" strokeWidth={3} />
            </motion.div>

            {/* Back face — opponent's turn (not actionable). Same circle, dull
                red/stone tones and an hourglass instead of the arrow, so it clearly
                reads as "not yours right now". */}
            <div
              className="absolute inset-0 rounded-full cursor-not-allowed flex items-center justify-center
                bg-gradient-to-b from-zinc-500 via-zinc-600 to-zinc-800
                border-2 border-red-900/60
                shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_0_rgba(30,10,10,0.9),0_6px_12px_rgba(0,0,0,0.5)]"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
            >
              <Hourglass className="w-5 h-5 md:w-6 md:h-6 text-red-200" strokeWidth={2.5} />
            </div>
          </motion.div>
        </div>

        {/* NPC Field — reverted back to the pre-gateway-art flex layout (three real
            rows: General/Relíquia/Terreno, then Retaguarda, then Vanguarda), per the
            user's explicit ask: the absolute-positioned single-row version above
            (see git history) put General/Relíquia/Terreno at almost the same board
            depth as Retaguarda, so it visually read as only two rows instead of three.
            The new gateway art sits behind this as a background image and isn't
            pixel-aligned to these rows anymore — the user prioritized the old,
            functionally-clear 3-row layout over exact alignment with the art's gate
            opening/torches. */}
        <div className="flex flex-col gap-6 justify-start pt-16">
          {/* General row (fixed) + Relíquia/Terreno slots */}
          <div className="flex justify-center gap-8 items-center">
            <CardSlot
              slotId="npc-10"
              card={npcSlots[10]}
              onClick={() => handleNpcSlotClick(10)}
              onInfoClick={setDetailedCard}
              shockActive={boardShock}
              isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 10}
              isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === 10}
              attackDirection="down"
              isValidAttackTarget={validAttackTargets.has(10)}
              isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(10) && !!npcSlots[10]}
            />
            <div className="relative">
              <CardSlot
                slotId="npc-12"
                card={npcSlots[12]}
                onClick={() => handleNpcSlotClick(12)}
                onInfoClick={setDetailedCard}
              shockActive={boardShock}
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 12}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === 12}
                attackDirection="down"
                isValidAttackTarget={validAttackTargets.has(12)}
                isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(12)}
              />
              <ManaBadge value={npcMana} className="absolute -top-3 -left-3 w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm z-20" />
            </div>
            <CardSlot
              slotId="npc-11"
              card={npcSlots[11]}
              onClick={() => handleNpcSlotClick(11)}
              onInfoClick={setDetailedCard}
              shockActive={boardShock}
              isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 11}
              isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === 11}
              attackDirection="down"
              isValidAttackTarget={validAttackTargets.has(11)}
              isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(11) && !!npcSlots[11]}
            />
          </div>
          {/* Retaguarda NPC (Backline) */}
          <div className="text-center text-[8px] md:text-[10px] tracking-widest text-zinc-500 uppercase -mb-3">Retaguarda</div>
          <div className="flex justify-center gap-3 md:gap-6">
            {[5, 6, 7, 8, 9].map((i) => (
              <CardSlot
                key={i}
                slotId={`npc-${i}`}
                card={npcSlots[i]}
                onClick={() => handleNpcSlotClick(i)}
                onInfoClick={setDetailedCard}
              shockActive={boardShock}
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === i}
                attackDirection="down"
                isValidAttackTarget={validAttackTargets.has(i)}
                isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(i) && !!npcSlots[i]}
              />
            ))}
          </div>
          {/* Vanguarda NPC (Frontline) */}
          <div className="text-center text-[8px] md:text-[10px] tracking-widest text-zinc-500 uppercase -mb-3">Vanguarda</div>
          <div className="flex justify-center gap-3 md:gap-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <CardSlot
                key={i}
                slotId={`npc-${i}`}
                card={npcSlots[i]}
                onClick={() => handleNpcSlotClick(i)}
                onInfoClick={setDetailedCard}
              shockActive={boardShock}
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === i}
                attackDirection="down"
                isValidAttackTarget={validAttackTargets.has(i)}
                isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(i) && !!npcSlots[i]}
              />
            ))}
          </div>
        </div>

        {/* Player Field — mirrors the NPC block above (see comment there). */}
        <div className="flex flex-col gap-6 justify-end pb-16 pointer-events-auto">
          {/* Vanguarda Player (Frontline) */}
          <div className="flex justify-center gap-3 md:gap-6">
            {[0, 1, 2, 3, 4].map((i) => {
              const creatureAbilityKind = getPlayerCreatureAbilityKind(i);
              return (
              <div key={i} className="relative">
              <CardSlot
                slotId={`player-${i}`}
                card={playerSlots[i]}
                onClick={(el) => handleSlotClick(i, el)}
                isSelected={selectedAttackerIndex === i}
                onInfoClick={setDetailedCard}
              shockActive={boardShock}
                isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === i}
                attackDirection="up"
                hint={getPlayerSlotHint(i)}
                isMoverSelected={selectedMoverIndex === i}
                isValidMoveTarget={validMoveTargets.has(i)}
                hasMoved={movedSlots.has(i)}
              />
              {/* Comerciante das Cruzadas / Hospitalário: same Yu-Gi-Oh-style
                  "you may activate this" Sparkles prompt as the General's own
                  ability (see playerGeneralAbilityAvailable above), just on
                  this card's own slot instead of only the General's. */}
              {creatureAbilityKind && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (creatureAbilityKind === 'comerciante') activateComercianteDasCruzadas(playerSlots[i]!);
                    else activateHospitalario(playerSlots[i]!);
                  }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-200 flex items-center justify-center shadow-[0_0_14px_rgba(251,191,36,0.8)] z-20 pointer-events-auto"
                >
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-amber-950" />
                </motion.button>
              )}
              </div>
              );
            })}
          </div>
          <div className="text-center text-[8px] md:text-[10px] tracking-widest text-zinc-500 uppercase -mt-3">Vanguarda</div>
          {/* Retaguarda Player (Backline) */}
          <div className="flex justify-center gap-3 md:gap-6">
            {[5, 6, 7, 8, 9].map((i) => {
              const creatureAbilityKind = getPlayerCreatureAbilityKind(i);
              return (
              <div key={i} className="relative">
              <CardSlot
                slotId={`player-${i}`}
                card={playerSlots[i]}
                onClick={(el) => handleSlotClick(i, el)}
                isSelected={selectedAttackerIndex === i}
                onInfoClick={setDetailedCard}
              shockActive={boardShock}
                isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === i}
                attackDirection="up"
                hint={getPlayerSlotHint(i)}
                isMoverSelected={selectedMoverIndex === i}
                isValidMoveTarget={validMoveTargets.has(i)}
                hasMoved={movedSlots.has(i)}
              />
              {creatureAbilityKind && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (creatureAbilityKind === 'comerciante') activateComercianteDasCruzadas(playerSlots[i]!);
                    else activateHospitalario(playerSlots[i]!);
                  }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-200 flex items-center justify-center shadow-[0_0_14px_rgba(251,191,36,0.8)] z-20 pointer-events-auto"
                >
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-amber-950" />
                </motion.button>
              )}
              </div>
              );
            })}
          </div>
          <div className="text-center text-[8px] md:text-[10px] tracking-widest text-zinc-500 uppercase -mt-3">Retaguarda</div>
          {/* General row (fixed) + Relíquia/Terreno slots */}
          <div className="flex justify-center gap-8 items-center">
            <CardSlot
              slotId="player-10"
              card={playerSlots[10]}
              onClick={(el) => handleSlotClick(10, el)}
              isSelected={selectedAttackerIndex === 10}
              onInfoClick={setDetailedCard}
              shockActive={boardShock}
              isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 10}
              isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 10}
              attackDirection="up"
              hint={getPlayerSlotHint(10)}
            />
            <div className="relative">
              <CardSlot
                slotId="player-12"
                card={playerSlots[12]}
                onClick={(el) => handleSlotClick(12, el)}
                isSelected={selectedAttackerIndex === 12}
                onInfoClick={setDetailedCard}
              shockActive={boardShock}
                isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 12}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 12}
                attackDirection="up"
              />
              <ManaBadge value={playerMana} className="absolute -top-3 -left-3 w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm z-20" />
              {/* Yu-Gi-Oh-style "you may activate this" prompt — the game itself
                  notices the General has a usable Fase-Principal ability right now
                  (see playerGeneralAbilityAvailable) and surfaces it here instead of
                  it just being unusable flavor text on the card. */}
              {playerGeneralAbilityAvailable && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setGeneralAbilityPrompt({ kind: 'cardeal_heal', confirmed: false });
                  }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-3 -right-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-200 flex items-center justify-center shadow-[0_0_18px_rgba(251,191,36,0.8)] z-20 pointer-events-auto"
                >
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-amber-950" />
                </motion.button>
              )}
            </div>
            <CardSlot
              slotId="player-11"
              card={playerSlots[11]}
              onClick={(el) => handleSlotClick(11, el)}
              isSelected={selectedAttackerIndex === 11}
              onInfoClick={setDetailedCard}
              shockActive={boardShock}
              isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 11}
              isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 11}
              attackDirection="up"
              hint={getPlayerSlotHint(11)}
            />
          </div>
        </div>

        {/* Opponent Deck & Graveyard (On Board) — kept inside the board's own canvas
            (not past its edge) so it's actually visible under the normal, fixed camera
            used at all times, including while a card is being drawn. Mirrored to the
            LEFT (the player's own deck sits on the right) so the two decks sit on
            diagonally opposite corners instead of stacked in the same column. */}
        <div className="absolute left-4 md:left-8 top-12 flex flex-col gap-6 items-center z-40 pointer-events-none">
          {/* Deck */}
          {/* The stack's thickness is dimmed copies of the card itself, offset behind the
              top one — a plain dark rectangle would read as a box around a card whose
              outline isn't rectangular (see CardBack). */}
          <div ref={npcDeckRef} className="w-24 md:w-36 h-32 md:h-48 relative">
            <CardBack offset={6} brightness={0.3} />
            <CardBack offset={3} brightness={0.55} />
            <CardBack shadow />
          </div>
          {/* Graveyard */}
          <GraveyardPile cards={npcGraveyard} />
        </div>

        {/* Deck & Graveyard (On Board) — kept inside the canvas, on the RIGHT side of
            the player's own field (the opponent's mirrors it on the left, so the two
            sit on diagonally opposite corners), so it's visible under the normal
            camera at all times (see computeDrawOrigin for how a drawn hand card
            animates itself in from this exact spot). Used to need a much bigger inset
            than the opponent's block on its side, back when the board's steep tilt
            made the player's nearer row project onto a proportionally wider slice of
            the screen — now that the tilt is much shallower (see baseAnim.rotateX in
            getBoardAnimation), that large offset just crowded this block into the
            Retaguarda slots next to it, so it's back to a small inset matching the
            opponent's. */}
        <div className="absolute right-16 md:right-8 bottom-16 flex flex-col gap-6 items-center z-40 pointer-events-auto">
          {/* Graveyard */}
          <GraveyardPile cards={playerGraveyard} />

          {/* Deck */}
          <motion.div
            ref={playerDeckRef}
            className="w-24 md:w-36 h-32 md:h-48 relative group"
          >
            {/* Deck thickness effect — dimmed copies of the card, not dark rectangles */}
            <CardBack offset={6} brightness={0.3} />
            <CardBack offset={3} brightness={0.55} />
            <CardBack shadow />
          </motion.div>
        </div>
      </motion.div>

      {/* Opponent Hand (Floating) — one face-down card back per card actually in
          npcHand, revealed one at a time during the match-intro deal (see
          startMatchIntro) and again whenever the AI draws for its turn, each card
          sliding in from roughly where the opponent's deck sits (on the LEFT side of
          the board). The player never sees what's actually in it. This lives as a
          sibling of the 3D board rather than inside it: the board's own motion.div
          carries a rotateX tilt (see baseAnim in getBoardAnimation) that every card
          lying flat on its surface should inherit, but this hand floats above the
          table facing the player and needs to stay upright. A counter-rotateX inside
          the board didn't work — the board never opts into transform-style:
          preserve-3d, so a child's own 3D scene gets flattened before the board's
          rotation is applied to it, and the counter-rotation has no visible effect.
          Living outside the tilted subtree entirely sidesteps that — but it also
          means this hand no longer inherits the board's own scale-down (see
          baseAnim.scale in getBoardAnimation), so without correcting for that it
          renders at full, unscaled card size instead of sitting small and "far
          away" like the rest of the opponent's side of the table. Reapplying that
          same scale factor here keeps it the same size it always was. */}
      <div
        // Pushed up so only about the bottom half of each card actually shows — the
        // opponent doesn't need to be legible (the player never sees their hand
        // anyway, see the plain card backs below), just present, so tucking half of
        // it off the top edge reads as "cards in hand" without spending as much
        // real screen height on it as a fully on-screen fan would.
        className="absolute left-1/2 -translate-x-1/2 flex pointer-events-none z-40"
        style={{
          top: `${-((isMobile ? 192 : 224) * (isMobile ? 1.0 : 0.85) * boardScale) / 2}px`,
          transform: `scale(${(isMobile ? 1.0 : 0.85) * boardScale})`,
          transformOrigin: 'top center',
        }}
      >
        {[...Array(npcHand.length)].map((_, i) => {
          // Same fan technique as the player's own hand (see getFanRotation/getFanLift
          // and HAND_CARD_STEP below): overlapping cards via a negative margin, rotated
          // and lifted outward from the center, instead of a flat evenly-gapped row —
          // otherwise this reads as a straight strip of tilted cards, not a hand fan.
          const npcCardWidth = isMobile ? 128 : 160;
          const npcCardStep = npcCardWidth * 0.5;
          return (
          <motion.div
            key={`npc-hand-${i}`}
            className="w-32 h-48 md:w-40 md:h-56 shrink-0 relative"
            style={{
              transformOrigin: 'top center',
              marginLeft: i === 0 ? 0 : npcCardStep - npcCardWidth,
            }}
            initial={{ x: -260, y: 40, opacity: 0, rotateZ: getFanRotation(i, npcHand.length) - 20, scale: 0.7 }}
            animate={{
              x: 0,
              y: getFanLift(i, npcHand.length),
              opacity: 1,
              rotateZ: getFanRotation(i, npcHand.length),
              scale: 1,
              zIndex: i + 1,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Card Back Design — flipped 180° around its OWN center (a separate inner
                wrapper, not folded into the fan's rotateZ above, which pivots around
                'top center': a 180° turn around THAT pivot would relocate the whole
                card to the opposite side of the pivot point instead of just flipping
                it in place). The opponent's board cards already face them (see
                CardSlot's isOpponentSlot flip), so their hand should too, rather than
                presenting right-side-up to the player the way their own hand does. */}
            <div style={{ transform: 'rotate(180deg)', transformOrigin: 'center center', width: '100%', height: '100%', position: 'relative' }}>
              <CardBack shadow />
            </div>
          </motion.div>
          );
        })}
      </div>

      {/* Hand UI */}
      <motion.div
        className="absolute inset-0 w-full h-full flex justify-center items-end pb-12 md:pb-6 pointer-events-none z-50"
        // Anchor scaling at the bottom-center of the screen (instead of the default
        // center) so shrinking the hand to fit (handScale) keeps it flush against the
        // real bottom edge rather than pulling it up toward the middle of the screen,
        // which used to leave a large empty gap below the cards on mobile.
        style={{ transformOrigin: 'bottom center' }}
        animate={{
          scale: handScale,
          y: isMobile ? (viewState === 'field' ? 200 : 0) : (viewState === 'field' ? 220 : 0),
          // Hidden once the card is actually flying to the board (and briefly after, while
          // the camera settles) so the rest of the hand doesn't clutter the summon
          // animation. NOT hidden during the camera's pre-zoom hold, though — the selected
          // card is still sitting right here in its floating preview spot and must stay
          // visible the whole time, with no gap before the flying overlay takes over.
          opacity: (flyingCard || cameraSettling) ? 0 : 1,
        }}
        transition={{ opacity: { duration: 0.15 } }}
      >
        <div className="flex pointer-events-none">
          <AnimatePresence>
            {hand.map((card, i) => {
              const origin = drawOriginsRef.current[card.id];
              // An Emboscada card the player can react with right now (see
              // maybeActivatePlayerAmbush) — gets the exact same "floating preview"
              // treatment as a manually selected card below, so the ambush prompt
              // reads as this specific card in the player's hand standing out, not a
              // separate screen replacing the hand.
              const isAmbushCandidate = ambushPrompt?.options.some(o => o.id === card.id) ?? false;
              const isFocused = selectedCardIndex === i || isAmbushCandidate;
              return (
              <motion.div
                // No layoutId here: it would make Framer Motion auto-animate this card's
                // layout position with its own internal spring on ANY re-render that
                // shifts its computed position even slightly (e.g. when unrelated sibling
                // state like cameraSettling/impactBurst toggles) — fighting our own
                // explicit animate/transition below and causing a visible re-bounce each
                // time. key alone is enough for React to keep reusing this same DOM node.
                key={card.id}
                ref={(el) => { handCardRefs.current[card.id] = el; }}
                className={`w-56 h-80 shrink-0 cursor-pointer relative group ${viewState === 'field' ? 'pointer-events-none' : 'pointer-events-auto'}`}
                // A freshly drawn card (see computeDrawOrigin) mounts sitting right at the
                // real on-board deck's position/size and animates itself — this same
                // element, start to finish — into its fan slot below, flipping from its
                // back face to its front face along the way (see the 3D flip wrapper
                // inside). Nothing hands off to a different element partway through.
                initial={origin
                  ? { opacity: 1, x: origin.x, y: origin.y, scale: origin.scale, rotateZ: 0 }
                  : { opacity: 1, x: 0, y: getFanLift(i), scale: 1, rotateZ: getFanRotation(i) }
                }
                style={{
                  transformOrigin: 'bottom center',
                  marginLeft: i === 0 ? 0 : HAND_CARD_STEP - HAND_CARD_WIDTH,
                }}
                animate={{
                  opacity: viewState === 'field'
                    ? (isFocused ? 1 : 0.4)
                    // Dim every OTHER card in hand, not just the ones after it in the fan —
                    // dimming only "i > selectedCardIndex" left earlier cards sitting at full
                    // opacity right behind/beside the enlarged selected card, poking out as
                    // a stray, undimmed card edge.
                    : ((selectedCardIndex !== null || ambushPrompt) && !isFocused ? 0.3 : 1),
                  x: isFocused && viewState === 'field' ? getSelectedCardX(i) : 0,
                  // Float the previewed card up near the vertical center of the real screen
                  // instead of sitting down at the hand's normal resting height (see
                  // getSelectedCardY above for how mobile's handScale is compensated for).
                  y: isFocused
                    ? (viewState === 'field' ? getSelectedCardY() : -40)
                    : (viewState === 'field' ? (isMobile ? 150 : 150) : getFanLift(i)),
                  scale: isFocused
                    ? (viewState === 'field' ? (isMobile ? FIELD_PREVIEW_SCALE.mobile : FIELD_PREVIEW_SCALE.desktop) : 1.1)
                    : (viewState === 'field' ? 0.6 : 1),
                  rotateZ: isFocused || viewState === 'field' ? 0 : getFanRotation(i),
                  zIndex: isFocused ? 150 : i + 1,
                  // boxShadow lives on the front face now (see below), not here: a shadow
                  // on THIS element is a flat 2D box that doesn't perspective-foreshorten
                  // the way the nested 3D-rotated card does, so during the flip it kept
                  // rendering as a separate, undistorted rounded-rectangle ghost sitting
                  // behind the actual (already turning, narrower-looking) card.
                }}
                whileHover={{
                  y: isFocused
                    ? (viewState === 'field' ? getSelectedCardY() : -40)
                    : viewState === 'field' ? 120 : -20,
                  scale: isFocused ? (viewState === 'field' ? (isMobile ? FIELD_PREVIEW_SCALE.mobile : FIELD_PREVIEW_SCALE.desktop) + 0.05 : 1.1) : 1.05,
                }}
                whileTap={{ scale: 0.95 }}
                // A freshly drawn card gets a slower transition, matching the full travel
                // time from the deck (the flip itself is a separate, nested rotateY — see
                // below — kept off this element entirely: composing a Z-axis fan rotation
                // with a Y-axis flip on the SAME transform mirrors the fan rotation once
                // the flip passes 90°, which is what made settled cards look crooked).
                // Cleared via onAnimationComplete once that first arrival finishes, so
                // every later interaction (hover, selection, the fan reflowing for the
                // next card) goes back to the normal snappy transition.
                transition={{
                  duration: origin ? DRAW_FLIGHT_MS / 1000 : 0.4,
                  ease: "easeOut",
                  zIndex: { delay: isFocused ? 0 : 0.4 },
                }}
                onAnimationComplete={() => { delete drawOriginsRef.current[card.id]; }}
                onClick={(e) => {
                  e.stopPropagation();
                  // An ambush interrupt isn't the normal "pick a card to play" flow —
                  // tapping the highlighted card here shouldn't fall into handleCardClick's
                  // own selection logic (which would just bounce off the Preparação-phase
                  // check anyway, but with an unrelated toast).
                  if (ambushPrompt) return;
                  handleCardClick(i);
                }}
              >
                {/* The 3D flip lives on its own dedicated element, nested inside the outer
                    div above — never combined with that div's rotateZ (the fan angle).
                    Composing a Z rotation and a Y rotation on the SAME transform mirrors
                    the Z rotation once the Y flip passes 90° (each subsequent rotation
                    applies in the already-rotated local frame), which is exactly what was
                    making settled cards render crooked: every card's fan angle was being
                    flipped left-right once it finished turning face up. */}
                <div className="absolute inset-0" style={{ perspective: 1000 }}>
                  <motion.div
                    className="relative w-full h-full"
                    style={{ transformStyle: 'preserve-3d' }}
                    initial={{ rotateY: origin ? 0 : 180 }}
                    animate={{ rotateY: 180 }}
                    transition={origin
                      ? { delay: DRAW_FLIGHT_MS * 0.55 / 1000, duration: DRAW_FLIGHT_MS * 0.4 / 1000, ease: "easeInOut" }
                      : { duration: 0 }
                    }
                  >
                    {/* Back face — plain card-back design, shown while rotateY is near 0.
                        backfaceVisibility hides this once flipped past 90°, leaving the
                        front face below. */}
                    <div
                      className="absolute inset-0"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <CardBack shadow />
                    </div>

                    {/* Front face — the real card, pre-rotated 180° so it reads upright
                        once this wrapper reaches its rest angle. No background/border of
                        its own: CardFace's template art draws the entire frame, so this is
                        just a positioning shell. The selection/idle glow lives here (not on
                        the outer div) so it's part of the same 3D-rotated surface as the
                        card itself, instead of a flat 2D shadow that stayed undistorted
                        while the actual card was still perspective-foreshortened mid-flip. */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      animate={{
                        boxShadow: isFocused
                          ? "inset 0 0 0 1px rgba(212,175,55,0.45), 0 0 120px rgba(212, 175, 55, 0.95)"
                          : "inset 0 0 0 1px rgba(212,175,55,0.45), 0 10px 30px rgba(0,0,0,0.5)"
                      }}
                      whileHover={{
                        boxShadow: isFocused
                          ? "0 0 80px rgba(212, 175, 55, 0.8)"
                          : "0 0 25px rgba(212, 175, 55, 0.5)"
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                  {/* Info Button — only actually clickable while still browsing the hand.
                      Once past "Jogar Carta" it sits over the board (see the floating
                      preview position), and pointer-events-auto here would otherwise keep
                      intercepting taps meant for whatever board slot is underneath it. */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailedCard(card);
                    }}
                    className={`absolute top-1 left-1 w-8 h-8 bg-blue-600/90 rounded-full border-2 border-blue-900 flex items-center justify-center shadow-md z-30 hover:bg-blue-500 transition-colors ${viewState === 'field' ? 'pointer-events-none' : 'pointer-events-auto'}`}
                  >
                    <Info className="text-white w-5 h-5" />
                  </button>

                  <CardFace card={card} variant="hand" />

                  {/* Selection Glow — red for an Emboscada interrupt (matches the old
                      "Emboscada disponível!" warning color), gold for a normal
                      hand-card selection. */}
                  {isFocused && (
                    <div className={`absolute inset-0 rounded-xl border-2 pointer-events-none ${isAmbushCandidate ? 'shadow-[inset_0_0_30px_rgba(239,68,68,0.6)] border-[#ef4444]' : 'shadow-[inset_0_0_30px_rgba(212,175,55,0.6)] border-[#d4af37]'}`} />
                  )}

                  {/* "Jogar Carta" menu — shown on first tap, before zooming to the board */}
                  {selectedCardIndex === i && viewState === 'hand' && (
                    <motion.button
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayCardButtonClick();
                      }}
                      className="absolute -top-5 left-1/2 -translate-x-1/2 z-40 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-full text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(16,185,129,0.7)] border-2 border-emerald-400 pointer-events-auto whitespace-nowrap"
                    >
                      Jogar Carta
                    </motion.button>
                  )}

                  {/* Emboscada interrupt — "here's the card, activate it or not?" anchored
                      right on the eligible card itself instead of a separate dialog, so
                      the rest of the hand stays visible the whole time (see
                      maybeActivatePlayerAmbush). */}
                  {isAmbushCandidate && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.9 }}
                      className="absolute -top-5 left-1/2 -translate-x-1/2 z-40 flex gap-2 pointer-events-auto whitespace-nowrap"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setHand(prev => prev.filter(c => c.id !== card.id));
                          setPlayerGraveyard(g => [...g, card]);
                          showToast(`Emboscada ativada: ${card.name}!`);
                          ambushPrompt!.resolve(card);
                          setAmbushPrompt(null);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-full text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(16,185,129,0.7)] border-2 border-emerald-400"
                      >
                        Ativar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          ambushPrompt!.resolve(null);
                          setAmbushPrompt(null);
                        }}
                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-full text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(0,0,0,0.6)] border-2 border-zinc-500"
                      >
                        Não
                      </button>
                    </motion.div>
                  )}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>



      {/* The manual "Visualizar Campo" toggle that used to live here was removed — it
          only duplicated what already happens automatically the moment a card is
          actually played (see handlePlayCardButtonClick, which sets viewState to
          'field' itself), so it was one more thing sitting in the corner without a
          real job, plus it was colliding with the opponent's hand fan up there. */}

      {/* Flying card — plays from hand to the chosen board slot along real screen coordinates.
          Rises to a large "presentation" size above the slot, holds briefly, then descends
          straight down into place. Kept simple on purpose: no wobble, dip, or shake. */}
      <AnimatePresence>
        {flyingCard && (() => {
          // Keep the box at the card's real intrinsic size (same as the hand card's own
          // w-56 h-80) and do ALL resizing through the scale transform, exactly like the
          // hand card does. Setting literal width/height to the small on-screen pixel
          // size (as this used to) breaks the content's own layout — a min-h-[5rem] text
          // box and full-size badges don't fit inside a ~100px-tall box, so everything
          // overflowed and badges flew off far outside the card.
          const HALF_W = HAND_CARD_WIDTH / 2;
          const HALF_H = HAND_CARD_HEIGHT / 2;
          const startScale = flyingCard.fromW / HAND_CARD_WIDTH;
          const endScale = flyingCard.toW / HAND_CARD_WIDTH;
          const hoverScale = Math.min(3, Math.max(0.8, 190 / flyingCard.fromW));
          const hoverX = flyingCard.toX;
          const hoverY = flyingCard.toY - 70;
          const times = [0, 0.55, 0.7, 1];
          return (
            <motion.div
              initial={{
                left: flyingCard.fromX - HALF_W,
                top: flyingCard.fromY - HALF_H,
                width: HAND_CARD_WIDTH,
                height: HAND_CARD_HEIGHT,
                scale: startScale,
              }}
              animate={{
                // Rise up to the hover presentation, hold there, then drop straight down.
                left: [flyingCard.fromX - HALF_W, hoverX - HALF_W, hoverX - HALF_W, flyingCard.toX - HALF_W],
                top: [flyingCard.fromY - HALF_H, hoverY - HALF_H, hoverY - HALF_H, flyingCard.toY - HALF_H],
                width: HAND_CARD_WIDTH,
                height: HAND_CARD_HEIGHT,
                scale: [startScale, startScale * hoverScale, startScale * hoverScale, endScale],
                times,
              }}
              transition={{ duration: 0.95, ease: ["easeOut", "linear", "easeIn"] }}
              onAnimationComplete={() => {
                setPlayerSlots(prev => {
                  const next = [...prev];
                  next[flyingCard.slotIndex] = flyingCard.card;
                  // Nobre Religioso: "Ao entrar em campo: invoca Soldados Leais..."
                  return applyNobreReligiosoSummon(next, flyingCard.slotIndex);
                });
                // Impact burst + brief camera shake right as the card lands. A full-art
                // card (see CardData.isFullArt) gets the bigger version of both, plus
                // makes every other card on the board flinch (see triggerFullArtReaction).
                const big = !!flyingCard.card.isFullArt;
                setImpactBurst({ x: flyingCard.toX, y: flyingCard.toY, big });
                setTimeout(() => setImpactBurst(null), big ? 950 : 780);
                if (big) triggerFullArtReaction();
                // Keep the camera's zoomed focus on the slot for a beat before easing back.
                setCameraSettling({ slotIndex: flyingCard.slotIndex });
                setFlyingCard(null);
                setTimeout(() => setCameraSettling(null), big ? 500 : 300);
              }}
              style={{
                position: 'fixed', zIndex: 500, transformOrigin: 'center center',
                boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.45), 0 0 40px rgba(212,175,55,0.6)',
              }}
              // Same frame, art, and layout as the hand card it came from — it should read
              // as the exact same card the whole time, not switch to a simplified design.
              className="pointer-events-none rounded-xl flex flex-col p-2 relative"
            >
              <div className="absolute top-1 left-1 w-8 h-8 bg-blue-600/90 rounded-full border-2 border-blue-900 flex items-center justify-center shadow-md z-30">
                <Info className="text-white w-5 h-5" />
              </div>

              <CardFace card={flyingCard.card} variant="hand" />
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Impact burst — flash, double shockwave, radiating sparks and a ground shadow pulse
          where the card just landed. */}
      <AnimatePresence>
        {impactBurst && (() => {
          const big = !!impactBurst.big;
          const mult = big ? 1.6 : 1;
          // Real dust, not sparkle: dry earth tones, no glow/blur, and an actual arc —
          // kicked up fast, then gravity pulls each speck back down as it fades, instead
          // of just floating outward and dissolving. Twice the count on a full-art land.
          const dustCount = big ? 22 : 12;
          const dustTones = ['#8a7a5f', '#71614a', '#a3906d', '#5c5040', '#96835f'];
          return (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: big ? 0.95 : 0.75 }}
              style={{ position: 'fixed', left: impactBurst.x, top: impactBurst.y, zIndex: 499 }}
              className="pointer-events-none -translate-x-1/2 -translate-y-1/2"
            >
              {/* Ground shadow pulse — a flattened ring suggesting weight hitting the field */}
              <motion.div
                initial={{ scaleX: 0.3, scaleY: 0.1, opacity: 0.7 }}
                animate={{ scaleX: 2.4 * mult, scaleY: 0.5 * mult, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute -inset-8 rounded-full bg-black/70 blur-sm"
              />
              {/* Bright core flash */}
              <motion.div
                initial={{ scale: 0.1, opacity: 1 }}
                animate={{ scale: 1.4 * mult, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute -inset-4 rounded-full bg-white"
                style={{ boxShadow: '0 0 40px 10px rgba(255,255,255,0.95)' }}
              />
              {/* Inner glow */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0.95 }}
                animate={{ scale: 1.8 * mult, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute -inset-7 rounded-full bg-amber-200/70 blur-md"
              />
              {/* Two staggered shockwave rings */}
              <motion.div
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: 1.6 * mult, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute -inset-6 rounded-full border-4 border-amber-300"
                style={{ boxShadow: '0 0 30px rgba(252,211,77,0.8)' }}
              />
              <motion.div
                initial={{ scale: 0.2, opacity: 0.9 }}
                animate={{ scale: 2.1 * mult, opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
                className="absolute -inset-6 rounded-full border-2 border-orange-200"
              />
              {/* Radiating sparks */}
              {Array.from({ length: big ? 16 : 10 }).map((_, i) => {
                const n = big ? 16 : 10;
                const angle = (i / n) * Math.PI * 2;
                const dist = 38 * mult;
                return (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 0.3 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full bg-amber-300"
                    style={{ boxShadow: '0 0 8px rgba(252,211,77,0.9)' }}
                  />
                );
              })}
              {/* Real dust kicked up off the field — dry, matte earth-tone specks that
                  arc up and then actually fall back down as they fade, not glowing motes
                  that just float outward (see dustTones above). */}
              {Array.from({ length: dustCount }).map((_, i) => {
                const angle = (i / dustCount) * Math.PI * 2 + (i % 2) * 0.25;
                const outDist = (22 + (i % 5) * 9) * mult;
                const peakLift = (14 + (i % 4) * 7) * mult;
                const size = 2 + (i % 3) * 1.5;
                const tone = dustTones[i % dustTones.length];
                return (
                  <motion.div
                    key={`dust-${i}`}
                    initial={{ x: 0, y: 2, opacity: 0.9, scale: 0.7 }}
                    animate={{
                      // Kicked outward and up first (the "puff"), then gravity wins and it
                      // drifts back down while fading — a real arc, not a straight float.
                      x: [0, Math.cos(angle) * outDist * 0.6, Math.cos(angle) * outDist],
                      y: [2, -peakLift, Math.sin(angle) * outDist * 0.2 + peakLift * 0.5],
                      opacity: [0.9, 0.8, 0],
                      scale: [0.7, 1, 0.8],
                    }}
                    transition={{ duration: 0.55 + (i % 3) * 0.15, ease: "easeOut", delay: 0.015 * i }}
                    className="absolute top-1/2 left-1/2 rounded-full"
                    style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, backgroundColor: tone }}
                  />
                );
              })}
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Attack Targeting Lines — a thin, mostly-just-a-hint line (à la Yu-Gi-Oh GX Tag
          Force) rather than a bold effect: it only needs to make clear a connection
          exists, not shout about it. Drawn in real viewport coordinates (not
          board-local ones) since the board itself is 3D-tilted; see attackLines
          above. */}
      {attackLines.length > 0 && (
        <svg className="fixed inset-0 z-40 pointer-events-none" width="100%" height="100%">
          {attackLines.map((line, idx) => (
            line.valid ? (
              <line
                key={idx}
                x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="#34d399"
                strokeWidth={1}
                strokeLinecap="round"
                opacity={0.75}
                style={{ filter: 'drop-shadow(0 0 2px rgba(52,211,153,0.7))' }}
              />
            ) : (
              <line
                key={idx}
                x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="#ef4444"
                strokeWidth={1}
                strokeLinecap="round"
                opacity={0.4}
              />
            )
          ))}
        </svg>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-red-600/90 text-white font-bold rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] border-2 border-red-400 pointer-events-none"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Play Announcement — a bigger, clearer preview of whichever card the
          opponent just played, since the actual board slot is small on a phone and
          easy to miss what landed there. Tucked in the corner (the top-right HUD spot
          freed up when the old turn indicator moved onto the board) rather than dead
          center so it doesn't block the board while it's showing. */}
      <AnimatePresence>
        {announcedCard && (
          <motion.div
            key={announcedCard.card.id}
            initial={{ opacity: 0, scale: 0.6, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="fixed top-20 right-3 md:top-24 md:right-6 z-[200] pointer-events-none flex flex-col items-end gap-1.5"
          >
            <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-md ${
              announcedCard.side === 'npc' ? 'bg-red-900/90 text-red-200 border border-red-500' : 'bg-blue-900/90 text-blue-200 border border-blue-400'
            }`}>
              {announcedCard.side === 'npc' ? 'Adversário jogou' : 'Você jogou'}
            </span>
            {/* No clipping, and a drop-shadow rather than a box-shadow: the card frame's
                outline isn't a rectangle (wings and spires stick out past it). */}
            <div className="relative w-32 h-44 md:w-40 md:h-56" style={{ filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.7))' }}>
              <CardFace card={announcedCard.card} variant="popup" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install-as-app prompt */}
      <AnimatePresence>
        {installPromptKind && (
          <InstallPrompt
            kind={installPromptKind}
            onInstall={handleInstallClick}
            onDismiss={() => setInstallPromptKind(null)}
          />
        )}
      </AnimatePresence>

      {/* Game Over Overlay — the General has fallen */}
      <AnimatePresence>
        {gameOverWinner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-6 bg-black/90 pointer-events-auto"
          >
            <h1 className={`text-4xl md:text-6xl font-black uppercase tracking-widest drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] ${gameOverWinner === 'player' ? 'text-emerald-400' : 'text-red-500'}`}>
              {gameOverWinner === 'player' ? 'Vitória!' : 'Derrota!'}
            </h1>
            <p className="text-zinc-300 text-sm md:text-base text-center max-w-xs">
              {gameOverWinner === 'player' ? 'O General inimigo caiu em batalha.' : 'Seu General caiu em batalha.'}
            </p>
            <button
              onClick={() => setGameMode(null)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-colors"
            >
              Voltar ao Menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Picker — the reveal/search Táticas (O Soldado Retorna, Busca pelo Santo
          Graal, Nova Tática, Escolher a Dedo, Escolher Tropas, Reunião de Fiéis) all
          resolve through this: a set of real candidate cards the game found (in the
          graveyard, the deck's pool, or the actual top of the deck), tap one to pick
          it. Multi-pick cases (maxPicks > 1) toggle a selection and need an explicit
          confirm instead of resolving on the first tap. */}
      <AnimatePresence>
        {cardPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex flex-col items-center justify-center gap-4 p-4 bg-black/80 backdrop-blur-sm pointer-events-auto"
          >
            <p className="text-center text-amber-400 font-black uppercase tracking-wide text-sm max-w-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {cardPicker.title}
            </p>
            <div className="flex gap-3 overflow-x-auto max-w-full px-2 py-2">
              {cardPicker.options.map(opt => {
                const isSelected = cardPicker.selected.some(c => c.id === opt.id);
                return (
                  <motion.div
                    key={opt.id}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-2 shrink-0"
                    onClick={() => {
                      if (cardPicker.maxPicks === 1) {
                        cardPicker.onConfirm([opt]);
                      } else {
                        toggleCardPickerSelection(opt);
                      }
                    }}
                  >
                    <div className={`relative w-32 aspect-[2/3] rounded-xl ${isSelected ? 'ring-4 ring-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.7)]' : ''}`}>
                      <CardFace card={opt} variant="hand" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {cardPicker.maxPicks > 1 && (
              <button
                onClick={() => cardPicker.onConfirm(cardPicker.selected)}
                disabled={cardPicker.selected.length === 0}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-full text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(16,185,129,0.7)] border-2 border-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
              >
                Confirmar ({cardPicker.selected.length}/{cardPicker.maxPicks})
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Card Modal */}
      <AnimatePresence>
        {detailedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto"
            onClick={() => setDetailedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm aspect-[2/3] rounded-2xl flex flex-col p-4 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            >
              <button
                onClick={() => setDetailedCard(null)}
                className="absolute -top-4 -left-4 w-10 h-10 bg-red-600 rounded-full border-2 border-red-900 flex items-center justify-center shadow-lg z-30 hover:bg-red-500 transition-colors pointer-events-auto"
              >
                <X className="text-white w-6 h-6" />
              </button>

              <CardFace card={detailedCard} variant="modal" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Ativar habilidade?" — the General's own Fase-Principal effect, offered
          Yu-Gi-Oh-style: the card floats up in the exact same tucked-aside "selected
          card" spot a hand card gets when picked to be played (see getSelectedCardX/Y
          and the hand render above), with a plain ativar/não first — only once the
          player says yes does the card's own cost choice (grátis vs. pago) show up,
          instead of dumping both decisions on the player in one screen. */}
      <AnimatePresence>
        {generalAbilityPrompt && playerSlots[12] && (
          <div
            className="fixed z-[210] left-2 md:left-6 pointer-events-none"
            style={{ top: '45%', transform: 'translateY(-50%)' }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: isMobile ? FIELD_PREVIEW_SCALE.mobile : FIELD_PREVIEW_SCALE.desktop, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              style={{ transformOrigin: 'center left' }}
              className="relative w-56 h-80 pointer-events-auto"
            >
              <CardFace card={playerSlots[12]!} variant="hand" />
              <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(212,175,55,0.6)] rounded-xl border-2 border-[#d4af37] pointer-events-none" />

              {!generalAbilityPrompt.confirmed ? (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-40 flex gap-2 whitespace-nowrap">
                  <button
                    onClick={() => setGeneralAbilityPrompt(prev => prev ? { ...prev, confirmed: true } : prev)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-full text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(16,185,129,0.7)] border-2 border-emerald-400"
                  >
                    Ativar
                  </button>
                  <button
                    onClick={() => setGeneralAbilityPrompt(null)}
                    className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-full text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(0,0,0,0.6)] border-2 border-zinc-500"
                  >
                    Não ativar
                  </button>
                </div>
              ) : (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-40 flex flex-col gap-1.5 items-center whitespace-nowrap">
                  <button
                    onClick={() => activateGeneralHeal(1, 0)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-full text-white font-black text-[11px] uppercase tracking-wider shadow-[0_4px_16px_rgba(16,185,129,0.7)] border-2 border-emerald-400"
                  >
                    Curar 1 HP (grátis)
                  </button>
                  <button
                    onClick={() => activateGeneralHeal(3, 1)}
                    disabled={playerMana < 1}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-full text-white font-black text-[11px] uppercase tracking-wider shadow-[0_4px_16px_rgba(16,185,129,0.7)] border-2 border-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
                  >
                    Pagar 1 ouro: curar 3 HP
                  </button>
                  <button
                    onClick={() => setGeneralAbilityPrompt(null)}
                    className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-full text-white font-black text-[11px] uppercase tracking-wider shadow-[0_4px_16px_rgba(0,0,0,0.6)] border-2 border-zinc-500"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

const CardSlot = ({
  onClick, onInfoClick, card, isSelected = false,
  isAttacking = false, isImpactingTarget = false, attackDirection = 'up', hint,
  isValidAttackTarget = false, isInvalidAttackTarget = false, slotId,
  isMoverSelected = false, isValidMoveTarget = false, hasMoved = false,
  shockActive = false,
}: {
  onClick?: (el: HTMLElement) => void, onInfoClick?: (card: CardData) => void, card?: CardData | null,
  isSelected?: boolean, isAttacking?: boolean, isImpactingTarget?: boolean, attackDirection?: 'up' | 'down',
  hint?: SlotHint, key?: React.Key,
  // Shown on the opponent's slots while the player has an attacker selected: a green
  // glow on anything actually reachable this turn (see getValidAttackTargets), a
  // dimmed/grayed look on an occupied slot that's blocked or out of the attacker's
  // lane — so the lane-blocking rule reads as a visible board state, not a rejected
  // click the player has to guess at.
  isValidAttackTarget?: boolean, isInvalidAttackTarget?: boolean,
  // A stable DOM id (e.g. "player-3", "npc-12") so the targeting-line overlay can find
  // this exact slot's on-screen position via getBoundingClientRect, without needing a
  // forwarded ref on every one of the 26 slots on the board.
  slotId?: string,
  // Preparação-phase equivalents of isSelected/isValidAttackTarget/(already acted) —
  // a unit picked up to move, the adjacent slots it can move/swap into, and a unit
  // that already used its reposition this turn (dimmed, still clickable to inspect).
  isMoverSelected?: boolean, isValidMoveTarget?: boolean, hasMoved?: boolean,
  // True for one brief pulse whenever a full-art card lands anywhere on the board (see
  // CardData.isFullArt / triggerFullArtReaction) — every occupied slot flinches at once.
  shockActive?: boolean,
}) => {
  const attackY = attackDirection === 'up' ? -150 : 150;
  // The opponent sits across the table, so their own cards should face THEM, not the
  // player — a 180° turn on the card's content only (not the slot, the info button,
  // or the attack-target arrows), same as how a real card would be laid on their side
  // of the table. Derived from the slotId naming convention ("npc-3" vs "player-3")
  // rather than a prop, since every one of the 26 CardSlot call sites already passes
  // one and threading a whole new boolean through each would be pure repetition.
  const isOpponentSlot = slotId?.startsWith('npc-') ?? false;

  const hintClass = hint === 'invalid'
    ? 'border-red-500/60 bg-red-950/30'
    : hint === 'primary'
      ? 'border-emerald-400/70 bg-emerald-500/10 shadow-[0_0_25px_rgba(52,211,153,0.5)]'
      : hint === 'secondary'
        ? 'border-amber-400/60 bg-amber-500/10 shadow-[0_0_18px_rgba(251,191,36,0.4)]'
        : '';

  return (
    <motion.div
      id={slotId}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick(e.currentTarget as HTMLElement);
        }
      }}
      className={`w-24 md:w-36 h-32 md:h-48 rounded-lg bg-transparent flex items-center justify-center transition-colors group relative ${card && !card.isDestroyed ? '' : 'border-[3px] border-[#e8dcc0]/35 hover:border-[#e8dcc0]/70 hover:bg-[#e8dcc0]/10 hover:shadow-[0_0_25px_rgba(232,220,192,0.45)]'} ${onClick ? 'cursor-pointer pointer-events-auto' : ''} ${isSelected ? 'ring-4 ring-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)]' : ''} ${hintClass} ${isValidAttackTarget ? 'ring-4 ring-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.7)]' : ''} ${isInvalidAttackTarget ? 'opacity-40 saturate-50' : ''} ${isMoverSelected ? 'ring-4 ring-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.7)]' : ''} ${isValidMoveTarget ? 'ring-4 ring-sky-300/80 shadow-[0_0_22px_rgba(125,211,252,0.6)]' : ''} ${hasMoved && card ? 'opacity-60 saturate-[.6]' : ''}`}
    >
      {!card && hint && (
        // Simple first-pass "where can this card go" indicator: a green arrow on its
        // efficient spot, a dimmer amber arrow where it's allowed but not ideal, and a
        // red X where it can't be placed at all. Can grow more nuanced per card type later.
        <>
          {hint === 'invalid' ? (
            <X className="w-8 h-8 md:w-10 md:h-10 text-red-500/80 pointer-events-none" strokeWidth={3} />
          ) : hint === 'primary' ? (
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none"
            >
              <ArrowUp className="w-8 h-8 md:w-10 md:h-10 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]" strokeWidth={3} />
            </motion.div>
          ) : (
            <ArrowUp className="w-7 h-7 md:w-8 md:h-8 text-amber-400/80 pointer-events-none" strokeWidth={3} />
          )}
        </>
      )}
      {!card && !hint && (
        <>
          <div className="w-[70%] h-[70%] border border-[#e8dcc0]/20 rotate-45 group-hover:border-[#e8dcc0]/50 group-hover:scale-110 transition-all pointer-events-none" />
          <div className="absolute inset-0 bg-[#e8dcc0]/0 group-hover:bg-[#e8dcc0]/15 transition-colors rounded-lg pointer-events-none" />
        </>
      )}
      {/* Attack targeting indicators — while the player has an attacker selected, a
          bouncing green arrow points down at every enemy slot it can actually reach
          (see getValidAttackTargets), and a red X marks an occupied enemy slot that's
          blocked or out of range (on top of the dimmed/grayed-out card itself), so the
          lane-blocking rule reads as something the player can SEE, not just a click
          that silently fails. */}
      {isValidAttackTarget && (
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-7 md:-top-9 left-1/2 -translate-x-1/2 pointer-events-none z-30"
        >
          <ArrowDown className="w-7 h-7 md:w-9 md:h-9 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,1)]" strokeWidth={3.5} />
        </motion.div>
      )}
      {isInvalidAttackTarget && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <X className="w-9 h-9 md:w-11 md:h-11 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]" strokeWidth={3.5} />
        </div>
      )}
      {card && !card.isDestroyed && (
        <motion.div
          key={card.id}
          // A card arriving in a slot (a General at match start, an AI or opponent
          // play) should visibly appear, not just pop into existence — a quick
          // scale/drop-in with a touch of overshoot reads as it "landing" here.
          initial={{ opacity: 0, scale: 0.4, y: -24, rotate: isOpponentSlot ? 180 : 0 }}
          animate={{
            opacity: 1,
            // A full-art card landing elsewhere on the board makes this one flinch —
            // a quick up-down jolt, like the table itself shook (see shockActive).
            y: isAttacking ? attackY : (shockActive ? [0, -14, 2, 0] : 0),
            z: isAttacking ? 100 : 0,
            scale: isAttacking ? 1.2 : 1,
            rotateX: isAttacking ? (attackDirection === 'up' ? 20 : -20) : 0,
            rotate: isOpponentSlot ? 180 : 0,
          }}
          transition={{
            duration: 0.3,
            scale: { type: "spring", stiffness: 400, damping: 15 },
            y: shockActive ? { duration: 0.4, ease: "easeOut" } : undefined,
          }}
          // A resting card gets a two-layer shadow: a tight, hard-edged sliver right
          // behind it (reads as the card's own physical thickness/cardstock edge) plus
          // a softer, further-offset one (ambient contact shadow) — together they're
          // what was making every card look like a flat, weightless sheet of paper.
          style={{ filter: 'drop-shadow(1.5px 2.5px 0 rgba(0,0,0,0.5)) drop-shadow(0 7px 9px rgba(0,0,0,0.4))' }}
          className="w-full h-full rounded-lg flex flex-col p-1 relative"
        >
          {isImpactingTarget && <SlashEffect />}

          {/* Equipped Armamentos — the one Tática exception that doesn't discard to
              the graveyard on use (see equippedWeapons/withEquippedWeapons): instead
              it stays attached, peeking out from behind this card like a real stacked
              equip card, until this unit dies (equippedWeapons rides along with it to
              the graveyard then). Rendered before the CardFace below so it sits
              underneath in paint order, each one offset a little further out. */}
          {card.equippedWeapons?.map((weapon, wi) => (
            <div
              key={weapon.id}
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{ transform: `translate(${9 + wi * 6}px, ${9 + wi * 6}px) scale(0.9)` }}
            >
              <CardFace card={weapon} variant="field" />
            </div>
          ))}

          {/* Info Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onInfoClick) onInfoClick(card);
            }}
            className="absolute top-0.5 left-0.5 w-5 h-5 md:w-6 md:h-6 bg-blue-600/90 rounded-full border border-blue-900 flex items-center justify-center shadow-md z-30 hover:bg-blue-500 transition-colors pointer-events-auto"
          >
            <Info className="text-white w-3 h-3 md:w-4 md:h-4" />
          </button>

          <CardFace card={card} variant="field" />
        </motion.div>
      )}
      {card && card.isDestroyed && (
        <>
          <motion.div
            initial={{ scale: 1, opacity: 1, rotateZ: 0 }}
            animate={{ 
              scale: [1, 1.1, 0.8, 0], 
              opacity: [1, 1, 0.5, 0], 
              rotateZ: [0, -5, 5, -10, 10, 0],
              filter: ["brightness(1)", "brightness(2)", "brightness(0.5)", "brightness(0)"]
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-40 pointer-events-none"
          >
            <div className="w-full h-full bg-[#c5b599] rounded-lg border-2 border-[#8c7a5f] shadow-lg overflow-hidden grayscale">
               {card.art ? (
                 <img src={card.art} className="w-full h-full object-cover opacity-50" />
               ) : (
                 <div className="w-full h-full bg-zinc-800" />
               )}
            </div>
          </motion.div>
          <ExplosionEffect />
        </>
      )}
    </motion.div>
  );
};

