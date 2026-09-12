import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Info, X, Sword, Zap, Users, Library, ArrowUp, ArrowDown } from 'lucide-react';
import { playAiTurn, AiAction } from './services/aiService';
import boardInteriorImage from './assets/board-interior.webp';
import swordTurnButtonImage from './assets/sword-turn-button.webp';
import cardTemplateImage from './assets/card-template.webp';
import cardTemplateSilverImage from './assets/card-template-silver.webp';
import cardTemplateChampagneImage from './assets/card-template-champagne.webp';
import cardBackplateImage from './assets/card-backplate.webp';

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
      <span className="text-zinc-600 font-mono text-xs md:text-sm uppercase tracking-widest rotate-90 opacity-50">Graveyard</span>
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
const GoldNumber = ({ value, className = "" }: { value: number, className?: string }) => (
  <span
    className={`font-black leading-none ${className}`}
    style={{
      fontFamily: "'Cinzel', serif",
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FDE08B 30%, #D4AF37 60%, #AA7200 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 4px rgba(0,0,0,0.8))',
    }}
  >
    {value}
  </span>
);

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

const CardFace = ({ card, variant = 'hand' }: { card: CardData, variant?: keyof typeof CARD_FACE_VARIANTS }) => {
  const v = CARD_FACE_VARIANTS[variant];
  const showStats = !NO_STAT_TYPES.has(card.cardType as CardType);
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
        {/* Name */}
        <div className="absolute flex items-center justify-center px-1 overflow-hidden" style={{ top: '0%', left: '12%', right: '22%', height: '8%' }}>
          <span
            // The name plate and type ribbon are pale parchment, so the text on them is
            // dark ink, not gold — light-on-light was the reason they were hard to read.
            // The highlight underneath gives it the engraved-into-the-plate look.
            className={`${v.name} font-bold uppercase tracking-tight truncate w-full text-center`}
            style={{ fontFamily: "'Cinzel', serif", color: '#2a1605', textShadow: '0 1px 0 rgba(255,243,206,0.55)' }}
          >
            {card.name}
          </span>
        </div>

        {/* Cost (Ouro) — mapped to the template's round cutout, top-right */}
        <div className="absolute flex items-center justify-center" style={{ left: '92%', top: '2.5%', transform: 'translate(-50%, -50%)' }}>
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
        <div className="absolute flex items-center justify-center p-1 overflow-hidden" style={{ top: '64%', bottom: '10%', left: '11%', right: '11%' }}>
          <p className={`${v.effect} text-[#0d0901] font-semibold text-center leading-tight`} style={{ fontFamily: "'Crimson Pro', serif" }}>
            {card.effect}
          </p>
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

// The board's art comes as two separate images: one for the playing surface
// itself (inside the bordered board frame) and one for the space around it
// (outside the frame, filling the rest of the screen). Empty for now — the
// game renders flat neutral placeholders instead until real art is dropped in.
const BOARD_INTERIOR_ART_URL = boardInteriorImage;
const BOARD_EXTERIOR_ART_URL = '';

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
// Relíquia and two Terrenos. Effect text carries over as flavor only for now:
// none of these abilities (move, buff, reorganize...) actually run yet, same
// as "Taunt"/"Charge"/"Flying" on the placeholder cards this replaces.
const DECK_CAPITAO: CardData[] = [
  { id: 'gen1', name: 'Comandante Aurelion, Mestre da Formação', atk: 0, hp: 20, cost: 0, art: '', effect: 'Após Remanejamento: até 2 unidades que se moveram ganham +1/+1 no próximo combate. Passiva: unidades adjacentes recebem -1 de dano.', cardType: 'General' },

  // Criaturas (27)
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_tactical_soldier_${i}`, name: 'Soldado Tático', atk: 3, hp: 3, cost: 2, art: '', effect: 'Troca com aliado adjacente no fim do turno.', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_line_squire_${i}`, name: 'Escudeiro de Linha', atk: 2, hp: 4, cost: 2, art: '', effect: 'Protege unidades atrás.', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_formation_captain_${i}`, name: 'Capitão de Formação', atk: 3, hp: 4, cost: 3, art: '', effect: 'Ao mover: adjacentes +1 ATK.', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_scout_${i}`, name: 'Batedor', atk: 1, hp: 2, cost: 1, art: '', effect: 'Move após combate.', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_control_lancer_${i}`, name: 'Lanceiro de Controle', atk: 3, hp: 2, cost: 2, art: '', effect: 'Inimigos adjacentes -1 ATK.', cardType: 'Infantaria' })),
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
  { id: 'relic_banner_0', name: 'Estandarte da Legião', atk: 0, hp: 5, cost: 3, art: '', effect: 'Permanente. Todas as unidades aliadas ganham +1 ATK enquanto esta relíquia estiver no campo.', cardType: 'Relíquia' },

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
  { id: 'cardeal_gen', name: 'Cardeal Pedro', atk: 0, hp: 20, cost: 0, art: '', effect: 'Fase Principal: cure 1 HP em um soldado aliado. Pague 1 ouro para curar 3 HP em vez disso.', cardType: 'General' },
  { id: 'cardeal_relic', name: 'Cálice da Vida', atk: 0, hp: 5, cost: 3, art: '', effect: 'Permanente. Permite que o General Cardeal Pedro use sua habilidade duas vezes por turno.', cardType: 'Relíquia' },

  // Plebeus → Infantaria
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `cardeal_fiel_${i}`, name: 'Multidão de Fiéis', atk: 0, hp: 3, cost: 1, art: '', effect: '—', cardType: 'Infantaria' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_comerciante_${i}`, name: 'Comerciante das Cruzadas', atk: 1, hp: 1, cost: 1, art: '', effect: 'Uma vez por turno: veja as 2 cartas do topo do deck. Adicione 1 à mão e coloque a outra no fundo.', cardType: 'Infantaria' })),

  // Infantaria
  { id: 'cardeal_espiao', name: 'Espião Sabotador', atk: 1, hp: 2, cost: 1, art: '', effect: 'Na Vanguarda: impede Emboscadas inimigas. Se o General aliado receber dano, no próximo turno não poderá usar sua habilidade.', cardType: 'Infantaria' },
  { id: 'cardeal_fanatico', name: 'Soldado Fanático', atk: 1, hp: 2, cost: 1, art: '', effect: 'Ao atacar: se o General inimigo for de tipo oposto, ganha +2 ATK.', cardType: 'Infantaria' },
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_aprendiz_${i}`, name: 'Aprendiz de Infantaria', atk: 0, hp: 2, cost: 1, art: '', effect: 'Ao ser curado: recebe +1 ATK permanente.', cardType: 'Infantaria' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_vigia_${i}`, name: 'Vigia de Mantimentos', atk: 2, hp: 3, cost: 2, art: '', effect: 'Uma vez por turno: se você tiver menos de 2 cartas na mão, compre até ficar com 2.', cardType: 'Infantaria' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_inf_treinada_${i}`, name: 'Infantaria Treinada', atk: 3, hp: 5, cost: 2, art: '', effect: '—', cardType: 'Infantaria' })),

  // Cavaleiros
  ...Array(3).fill(null).map((_, i): CardData => ({ id: `cardeal_jorge_${i}`, name: 'Jorge, o Lanceiro', atk: 4, hp: 6, cost: 3, art: '', effect: 'Ao atacar a Vanguarda: causa 2 de dano à unidade na Retaguarda da mesma coluna.', cardType: 'Cavalaria' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_hosp_${i}`, name: 'Hospitalário', atk: 2, hp: 4, cost: 2, art: '', effect: 'Uma vez por turno: cure 1 HP de um aliado e cause 1 de dano a um inimigo na Vanguarda.', cardType: 'Cavalaria' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_nobre_${i}`, name: 'Nobre Religioso', atk: 4, hp: 5, cost: 3, art: '', effect: 'Ao entrar em campo: invoca Soldados Leais (1 ATK / 2 HP) nos slots adjacentes livres da mesma fileira.', cardType: 'Cavalaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `cardeal_cavaleiro_${i}`, name: 'Cavaleiro Branco', atk: 5, hp: 7, cost: 3, art: '', effect: '—', cardType: 'Cavalaria' })),
  { id: 'cardeal_lider', name: 'Líder de Esquadrão', atk: 5, hp: 5, cost: 3, art: '', effect: 'Na Vanguarda: Infantaria e Arqueiros aliados ganham +1 ATK e +1 HP durante o combate.', cardType: 'Cavalaria' },

  // Arqueiros
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_arq_pro_${i}`, name: 'Arqueiro Profissional', atk: 1, hp: 4, cost: 2, art: '', effect: 'Pode atacar duas vezes por rodada.', cardType: 'Arqueiro' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_atirador_${i}`, name: 'Atirador Influente', atk: 1, hp: 3, cost: 2, art: '', effect: 'Ao ir ao cemitério: compre 3 cartas.', cardType: 'Arqueiro' })),

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

const MainMenu = ({ onSelectMode }: { onSelectMode: (mode: string) => void }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [-500, 500], [-20, 20]);
  const bgY = useTransform(mouseY, [-500, 500], [-20, 20]);

  const icons = {
    'Campaign': Sword,
    'Quick Match': Zap,
    'Multiplayer': Users,
    'My Deck': Library
  };

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
      {/* Animated Background with Parallax */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        className="absolute -inset-20 bg-[radial-gradient(circle_at_center,rgba(49,46,129,0.3)_0%,rgba(0,0,0,1)_100%)] z-0"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.h1 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-7xl font-black mb-16 text-transparent bg-clip-text bg-gradient-to-b from-indigo-300 to-indigo-600 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10"
      >
        CARD BATTLE
      </motion.h1>

      <div className="flex flex-col gap-6 relative z-10">
        {['Campaign', 'Quick Match', 'Multiplayer', 'My Deck'].map((mode, i) => {
          const Icon = icons[mode as keyof typeof icons];
          return (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              animate={{ boxShadow: ["0 0 10px rgba(99, 102, 241, 0.3)", "0 0 20px rgba(99, 102, 241, 0.6)", "0 0 10px rgba(99, 102, 241, 0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={(e) => { e.stopPropagation(); onSelectMode(mode); }}
              className="px-10 py-5 bg-zinc-900/80 hover:bg-indigo-950 rounded-xl text-2xl font-bold transition-all border-2 border-zinc-700 hover:border-indigo-500 shadow-lg flex items-center gap-4"
            >
              <Icon className="w-8 h-8" />
              {mode}
            </motion.button>
          );
        })}
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
  const [impactBurst, setImpactBurst] = useState<{ x: number; y: number } | null>(null);
  const handCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isMobile = windowSize.width < 768;
  // Board container is a fixed 1000x1400px canvas (see the 3D Board div below) that gets
  // scaled down to fit the real viewport — these divisors must match those exact dimensions.
  const boardScale = isMobile ? Math.min(windowSize.width / 1000, windowSize.height / 1400) * 1.05 : Math.min(windowSize.width / 1600, 1);
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
  const handScale = isMobile
    ? Math.min(0.85, (windowSize.width - 16) / (handTotalWidth + handFanExtraWidth))
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
      if (turnNumber > 1 && hand.length < 10) {
        const newCard = drawFromDeck();
        const origin = computeDrawOrigin(playerDeckRef, hand.length);
        if (origin) drawOriginsRef.current[newCard.id] = origin;
        setHand(prev => [...prev, newCard]);
      }
    } else {
      if (turnNumber >= 3) setNpcMana(prev => prev + 4);
      setViewState('field');
      if (turnNumber > 1 && npcHand.length < 10) {
        setNpcHand(prev => [...prev, drawFromNpcDeck()]);
      }
    }
  }, [currentTurn, turnNumber]);

  useEffect(() => {
    if (currentTurn === 'npc' && gameMode === 'Quick Match' && !isAnimating && !gameOverWinner) {
      const runAiTurn = async () => {
        setIsAnimating(true);
        const { actions, playedCardIds } = playAiTurn(npcSlots, playerSlots, npcMana, npcHandRef.current, getValidAttackTargets);
        if (playedCardIds.length > 0) {
          setNpcHand(prev => prev.filter(c => !playedCardIds.includes(c.id)));
        }

        let currentNpcSlots = [...npcSlots];
        let currentPlayerSlots = [...playerSlots];
        let currentNpcMana = npcMana;
        let playerGeneralFell = false;

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

            const defender = currentPlayerSlots[action.targetSlot];
            if (defender) {
              const updatedAttacker = { ...attacker, hp: attacker.hp - defender.atk };
              const updatedDefender = { ...defender, hp: defender.hp - attacker.atk };

              if (updatedAttacker.hp <= 0) {
                currentNpcSlots[action.attackerSlot] = { ...updatedAttacker, isDestroyed: true };
                hasDestroyed = true;
              } else {
                currentNpcSlots[action.attackerSlot] = updatedAttacker;
              }

              if (updatedDefender.hp <= 0) {
                currentPlayerSlots[action.targetSlot] = { ...updatedDefender, isDestroyed: true };
                hasDestroyed = true;
                if (updatedDefender.cardType === 'General') {
                  playerGeneralFell = true;
                }
              } else {
                currentPlayerSlots[action.targetSlot] = updatedDefender;
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
              if (destroyedNpcCards.length) setNpcGraveyard(g => [...g, ...destroyedNpcCards]);
              if (destroyedPlayerCards.length) setPlayerGraveyard(g => [...g, ...destroyedPlayerCards]);
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

  const handleSlotClick = (slotIndex: number, slotEl?: HTMLElement) => {
    if (gameOverWinner || isCardInFlightTransition) return;
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
        setPlayerSlots(newSlots);
      }
    } else if (selectedCardIndex === null && playerSlots[slotIndex]) {
      // Select attacker
      if (selectedAttackerIndex === slotIndex) {
        setSelectedAttackerIndex(null);
      } else {
        setSelectedAttackerIndex(slotIndex);
      }
    }
  };

  const handleNpcSlotClick = async (slotIndex: number) => {
    if (gameOverWinner) return;
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
      const defender = npcSlots[slotIndex];
      
      if (attacker && defender) {
        const updatedAttacker = { ...attacker, hp: attacker.hp - defender.atk };
        const updatedDefender = { ...defender, hp: defender.hp - attacker.atk };
        
        const newPlayerSlots = [...playerSlots];
        const newNpcSlots = [...npcSlots];
        
        let hasDestroyed = false;

        if (updatedAttacker.hp <= 0) {
           newPlayerSlots[selectedAttackerIndex] = { ...updatedAttacker, isDestroyed: true };
           hasDestroyed = true;
        } else {
           newPlayerSlots[selectedAttackerIndex] = updatedAttacker;
        }

        let npcGeneralFell = false;
        if (updatedDefender.hp <= 0) {
           newNpcSlots[slotIndex] = { ...updatedDefender, isDestroyed: true };
           hasDestroyed = true;
           if (updatedDefender.cardType === 'General') npcGeneralFell = true;
        } else {
           newNpcSlots[slotIndex] = updatedDefender;
        }

        setPlayerSlots(newPlayerSlots);
        setNpcSlots(newNpcSlots);
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
          if (destroyedPlayerCards.length) setPlayerGraveyard(g => [...g, ...destroyedPlayerCards]);
          if (destroyedNpcCards.length) setNpcGraveyard(g => [...g, ...destroyedNpcCards]);
          setPlayerSlots(prev => prev.map(c => c?.isDestroyed ? null : c));
          setNpcSlots(prev => prev.map(c => c?.isDestroyed ? null : c));
        }
      }
      setIsAnimating(false);
    }
  };

  const handleBackgroundClick = () => {
    if (isCardInFlightTransition) return; // don't cancel a card mid hand-off to the board
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

  const getBoardAnimation = () => {
    // The board stays visible at all times — like looking down at a table with the
    // hand of cards held up in front of it — instead of tilting away out of view
    // while browsing the hand. Drawing a card never moves the camera either: the new
    // hand card animates itself in from the on-board deck pile (see computeDrawOrigin)
    // while the view stays put.
    const baseAnim = {
      // Flattened from the original 25/35deg: a steep tilt makes the board's near
      // (player) edge occupy far more screen height than its far (opponent) edge —
      // the perspective foreshortening is asymmetric — so the opponent's end of the
      // board was always fully visible while the player's own end ran off past the
      // hand UI at the bottom. A shallower angle (closer to a top-down Hearthstone-
      // style view) keeps both ends reading at a similar scale.
      rotateX: isMobile ? 8 : 12,
      rotateZ: 0,
      y: isMobile ? 0 : -50,
      x: 0,
      z: isMobile ? 50 : 50,
      scale: (isMobile ? 1.0 : 0.85) * boardScale,
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
      const focusedRotateX = baseAnim.rotateX - 8;

      if (cameraSettling) {
        // The card just landed — a sharp shake on top of the same focused view, plus a
        // quick extra punch-in on the zoom for a stronger felt impact.
        return {
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

  return (
    <div 
      className="relative w-full h-dvh bg-zinc-950 overflow-hidden flex flex-col items-center justify-center touch-none"
      style={{ perspective: '1200px' }}
      onClick={handleBackgroundClick}
    >
      {/* Exterior — the space around the board (see BOARD_EXTERIOR_ART_URL); falls
          back to the plain dark gradient below when no art has been dropped in yet. */}
      {BOARD_EXTERIOR_ART_URL && (
        <img src={BOARD_EXTERIOR_ART_URL} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      )}

      {/* Background ambient light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,30,60,0.8)_0%,rgba(0,0,0,1)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(80,60,140,0.15)_0%,transparent_60%)] pointer-events-none" />

      {/* 3D Board */}
      <motion.div
        className="w-[1000px] h-[1400px] grid grid-rows-2 gap-24 p-8 relative"
        animate={getBoardAnimation()}
        transition={{ duration: viewportSettled ? 0.8 : 0, ease: [0.32, 0.72, 0, 1] }}
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
        {/* Board Surface — the playing-surface art, inside the bordered frame (see
            BOARD_INTERIOR_ART_URL). */}
        <div
          className="absolute inset-0 border-4 border-stone-700/50 bg-[#2b2825] rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.5)] pointer-events-none overflow-hidden"
          style={{ transform: 'translateZ(-1px)' }}
        >
          {BOARD_INTERIOR_ART_URL ? (
            <img src={BOARD_INTERIOR_ART_URL} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
          )}
        </div>

        {/* Central Divider */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.6)] -translate-y-1/2 rounded-full pointer-events-none" />

        {/* Turn Plaque / End Turn Button — sits right on the divider like a physical
            marker on the table instead of a floating HUD overlay, since the board is
            now always on screen. It's a single flippable plaque: "SEU TURNO" is itself
            the end-turn button (tap it to pass), and it flips (like a name plate on a
            board game) to "TURNO DO ADVERSÁRIO" while it's not the player's turn, then
            flips back on its own once the NPC's turn ends. The flip rotates around the
            horizontal axis (rotateX, top-over-bottom) rather than the vertical one, so
            it reads as tipping toward the viewer instead of swiveling side to side. */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-auto"
          style={{ perspective: 600 }}
          onClick={(e) => {
            e.stopPropagation();
            if (currentTurn === 'player') setCurrentTurn('npc');
          }}
        >
          <motion.div
            className="relative w-[340px] h-[78px] md:w-[420px] md:h-[96px] cursor-pointer"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateX: currentTurn === 'player' ? 0 : 180 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            whileTap={currentTurn === 'player' ? { scale: 0.94 } : undefined}
          >
            {/* Front face — SEU TURNO, rendered as a sword lying on the divider (the
                actionable "pass turn" face). The text sits over the blade, offset past
                the hilt (which occupies the left ~22% of the image). */}
            <motion.div
              className="absolute inset-0"
              style={{ backfaceVisibility: 'hidden' }}
              animate={{
                filter: currentTurn === 'player'
                  ? ['drop-shadow(0 0 4px rgba(245,158,11,0.5))', 'drop-shadow(0 0 10px rgba(245,158,11,0.9))', 'drop-shadow(0 0 4px rgba(245,158,11,0.5))']
                  : 'drop-shadow(0 0 4px rgba(245,158,11,0.5))'
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <img
                src={swordTurnButtonImage}
                alt=""
                draggable={false}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              />
              <div className="absolute inset-0 flex items-center justify-center pl-[24%] pr-[6%]">
                <span className="flex items-center gap-2 font-black text-base md:text-lg tracking-wide text-zinc-900">
                  <span className="w-2 h-2 rounded-full bg-amber-700 animate-pulse shrink-0" />
                  SEU TURNO
                </span>
              </div>
            </motion.div>

            {/* Back face — TURNO DO ADVERSÁRIO (not actionable). Same sword image as the
                front face (tinted red, since it's a CSS filter on the same asset) so the
                plaque always reads as "the sword", never reverting to a plain box. */}
            <div
              className="absolute inset-0 cursor-not-allowed"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
            >
              <img
                src={swordTurnButtonImage}
                alt=""
                draggable={false}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                style={{ filter: 'sepia(1) saturate(6) hue-rotate(-50deg) brightness(0.85) drop-shadow(0 0 6px rgba(239,68,68,0.7))' }}
              />
              <div className="absolute inset-0 flex items-center justify-center pl-[24%] pr-[6%]">
                <span className="flex items-center gap-2 font-black text-sm md:text-base tracking-wide text-red-950">
                  <span className="w-2 h-2 rounded-full bg-red-700 animate-pulse shrink-0" />
                  TURNO DO ADVERSÁRIO
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* NPC Field */}
        <div className="flex flex-col gap-6 justify-start pt-4">
          {/* General row (fixed) + Relíquia/Terreno slots */}
          <div className="flex justify-center gap-16 items-center">
            <CardSlot
              slotId="npc-10"
              card={npcSlots[10]}
              onClick={() => handleNpcSlotClick(10)}
              onInfoClick={setDetailedCard}
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
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === i}
                attackDirection="down"
                isValidAttackTarget={validAttackTargets.has(i)}
                isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(i) && !!npcSlots[i]}
              />
            ))}
          </div>
        </div>

        {/* Player Field */}
        <div className="flex flex-col gap-6 justify-end pb-4 pointer-events-auto">
          {/* Vanguarda Player (Frontline) */}
          <div className="flex justify-center gap-3 md:gap-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <CardSlot
                key={i}
                slotId={`player-${i}`}
                card={playerSlots[i]}
                onClick={(el) => handleSlotClick(i, el)}
                isSelected={selectedAttackerIndex === i}
                onInfoClick={setDetailedCard}
                isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === i}
                attackDirection="up"
                hint={getPlayerSlotHint(i)}
              />
            ))}
          </div>
          <div className="text-center text-[8px] md:text-[10px] tracking-widest text-zinc-500 uppercase -mt-3">Vanguarda</div>
          {/* Retaguarda Player (Backline) */}
          <div className="flex justify-center gap-3 md:gap-6">
            {[5, 6, 7, 8, 9].map((i) => (
              <CardSlot
                key={i}
                slotId={`player-${i}`}
                card={playerSlots[i]}
                onClick={(el) => handleSlotClick(i, el)}
                isSelected={selectedAttackerIndex === i}
                onInfoClick={setDetailedCard}
                isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === i}
                attackDirection="up"
                hint={getPlayerSlotHint(i)}
              />
            ))}
          </div>
          <div className="text-center text-[8px] md:text-[10px] tracking-widest text-zinc-500 uppercase -mt-3">Retaguarda</div>
          {/* General row (fixed) + Relíquia/Terreno slots */}
          <div className="flex justify-center gap-16 items-center">
            <CardSlot
              slotId="player-10"
              card={playerSlots[10]}
              onClick={(el) => handleSlotClick(10, el)}
              isSelected={selectedAttackerIndex === 10}
              onInfoClick={setDetailedCard}
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
                isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 12}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 12}
                attackDirection="up"
              />
              <ManaBadge value={playerMana} className="absolute -top-3 -left-3 w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm z-20" />
            </div>
            <CardSlot
              slotId="player-11"
              card={playerSlots[11]}
              onClick={(el) => handleSlotClick(11, el)}
              isSelected={selectedAttackerIndex === 11}
              onInfoClick={setDetailedCard}
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
        className="absolute top-[2%] md:top-[4%] left-1/2 -translate-x-1/2 flex pointer-events-none z-50"
        style={{ transform: `scale(${(isMobile ? 1.0 : 0.85) * boardScale})`, transformOrigin: 'top center' }}
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
            {/* Card Back Design */}
            <CardBack shadow />
          </motion.div>
          );
        })}
      </div>

      {/* Hand UI */}
      <motion.div
        className="absolute inset-0 w-full h-full flex justify-center items-end pb-4 md:pb-6 pointer-events-none z-50"
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
                    ? (selectedCardIndex === i ? 1 : 0.4)
                    : (selectedCardIndex !== null && i > selectedCardIndex ? 0.3 : 1),
                  x: selectedCardIndex === i && viewState === 'field' ? getSelectedCardX(i) : 0,
                  // Float the previewed card up near the vertical center of the real screen
                  // instead of sitting down at the hand's normal resting height (see
                  // getSelectedCardY above for how mobile's handScale is compensated for).
                  y: selectedCardIndex === i
                    ? (viewState === 'field' ? getSelectedCardY() : -40)
                    : (viewState === 'field' ? (isMobile ? 150 : 150) : getFanLift(i)),
                  scale: selectedCardIndex === i
                    ? (viewState === 'field' ? (isMobile ? FIELD_PREVIEW_SCALE.mobile : FIELD_PREVIEW_SCALE.desktop) : 1.1)
                    : (viewState === 'field' ? 0.6 : 1),
                  rotateZ: selectedCardIndex === i || viewState === 'field' ? 0 : getFanRotation(i),
                  zIndex: selectedCardIndex === i ? 150 : i + 1,
                  // boxShadow lives on the front face now (see below), not here: a shadow
                  // on THIS element is a flat 2D box that doesn't perspective-foreshorten
                  // the way the nested 3D-rotated card does, so during the flip it kept
                  // rendering as a separate, undistorted rounded-rectangle ghost sitting
                  // behind the actual (already turning, narrower-looking) card.
                }}
                whileHover={{
                  y: selectedCardIndex === i
                    ? (viewState === 'field' ? getSelectedCardY() : -40)
                    : viewState === 'field' ? 120 : -20,
                  scale: selectedCardIndex === i ? (viewState === 'field' ? (isMobile ? FIELD_PREVIEW_SCALE.mobile : FIELD_PREVIEW_SCALE.desktop) + 0.05 : 1.1) : 1.05,
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
                  zIndex: { delay: selectedCardIndex === i ? 0 : 0.4 },
                }}
                onAnimationComplete={() => { delete drawOriginsRef.current[card.id]; }}
                onClick={(e) => {
                  e.stopPropagation();
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
                        boxShadow: selectedCardIndex === i
                          ? "inset 0 0 0 1px rgba(212,175,55,0.45), 0 0 120px rgba(212, 175, 55, 0.95)"
                          : "inset 0 0 0 1px rgba(212,175,55,0.45), 0 10px 30px rgba(0,0,0,0.5)"
                      }}
                      whileHover={{
                        boxShadow: selectedCardIndex === i
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

                  {/* Selection Glow */}
                  {selectedCardIndex === i && (
                    <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(212,175,55,0.6)] rounded-xl border-2 border-[#d4af37] pointer-events-none" />
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
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>



      {/* Camera Toggle Button */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
        <button 
          disabled={currentTurn === 'npc'}
          className={`pointer-events-auto px-4 py-2 md:px-6 md:py-3 font-mono font-bold text-[10px] md:text-sm rounded-lg border backdrop-blur-md transition-all flex items-center gap-2 ${
            currentTurn === 'npc'
              ? 'bg-zinc-900/80 text-zinc-600 border-zinc-800 cursor-not-allowed'
              : viewState === 'field' 
                ? 'bg-emerald-900/80 text-emerald-300 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)]' 
                : 'bg-black/60 text-zinc-400 border-zinc-600 hover:bg-zinc-800/60 hover:text-zinc-300'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (isCardInFlightTransition) return; // don't cancel a card mid hand-off to the board
            setViewState(prev => prev === 'hand' ? 'field' : 'hand');
            setSelectedCardIndex(null);
          }}
        >
          <div className={`w-2 h-2 rounded-full ${viewState === 'field' ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]' : 'bg-zinc-600'}`} />
          VISUALIZAR CAMPO
        </button>
      </div>

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
                  return next;
                });
                // Impact burst + brief camera shake right as the card lands.
                setImpactBurst({ x: flyingCard.toX, y: flyingCard.toY });
                setTimeout(() => setImpactBurst(null), 780);
                // Keep the camera's zoomed focus on the slot for a beat before easing back.
                setCameraSettling({ slotIndex: flyingCard.slotIndex });
                setFlyingCard(null);
                setTimeout(() => setCameraSettling(null), 300);
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
        {impactBurst && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.75 }}
            style={{ position: 'fixed', left: impactBurst.x, top: impactBurst.y, zIndex: 499 }}
            className="pointer-events-none -translate-x-1/2 -translate-y-1/2"
          >
            {/* Ground shadow pulse — a flattened ring suggesting weight hitting the field */}
            <motion.div
              initial={{ scaleX: 0.3, scaleY: 0.1, opacity: 0.7 }}
              animate={{ scaleX: 2.4, scaleY: 0.5, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute -inset-8 rounded-full bg-black/70 blur-sm"
            />
            {/* Bright core flash */}
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute -inset-4 rounded-full bg-white"
              style={{ boxShadow: '0 0 40px 10px rgba(255,255,255,0.95)' }}
            />
            {/* Inner glow */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0.95 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute -inset-7 rounded-full bg-amber-200/70 blur-md"
            />
            {/* Two staggered shockwave rings */}
            <motion.div
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute -inset-6 rounded-full border-4 border-amber-300"
              style={{ boxShadow: '0 0 30px rgba(252,211,77,0.8)' }}
            />
            <motion.div
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: 2.1, opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
              className="absolute -inset-6 rounded-full border-2 border-orange-200"
            />
            {/* Radiating sparks */}
            {Array.from({ length: 10 }).map((_, i) => {
              const angle = (i / 10) * Math.PI * 2;
              const dist = 38;
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
            {/* Dust puffs kicked up off the field */}
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i / 6) * Math.PI * 2 + 0.4;
              const dist = 26 + (i % 2) * 10;
              return (
                <motion.div
                  key={`dust-${i}`}
                  initial={{ x: 0, y: 4, opacity: 0.55, scale: 0.4 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist * 0.5 - 22,
                    opacity: 0,
                    scale: 1.6,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.03 * i }}
                  className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 rounded-full bg-[#c9b48a] blur-[3px]"
                />
              );
            })}
          </motion.div>
        )}
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
    </div>
  );
}

const CardSlot = ({
  onClick, onInfoClick, card, isSelected = false,
  isAttacking = false, isImpactingTarget = false, attackDirection = 'up', hint,
  isValidAttackTarget = false, isInvalidAttackTarget = false, slotId
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
  slotId?: string
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
      className={`w-24 md:w-36 h-32 md:h-48 rounded-lg bg-transparent flex items-center justify-center transition-colors group relative ${card && !card.isDestroyed ? '' : 'border-[3px] border-indigo-400/70 hover:border-indigo-300 hover:bg-indigo-500/10 hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]'} ${onClick ? 'cursor-pointer pointer-events-auto' : ''} ${isSelected ? 'ring-4 ring-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)]' : ''} ${hintClass} ${isValidAttackTarget ? 'ring-4 ring-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.7)]' : ''} ${isInvalidAttackTarget ? 'opacity-40 saturate-50' : ''}`}
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
          <div className="w-[70%] h-[70%] border border-indigo-500/25 rotate-45 group-hover:border-indigo-400/60 group-hover:scale-110 transition-all pointer-events-none" />
          <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/20 transition-colors rounded-lg pointer-events-none" />
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
            y: isAttacking ? attackY : 0,
            z: isAttacking ? 100 : 0,
            scale: isAttacking ? 1.2 : 1,
            rotateX: isAttacking ? (attackDirection === 'up' ? 20 : -20) : 0,
            rotate: isOpponentSlot ? 180 : 0,
          }}
          transition={{ duration: 0.3, scale: { type: "spring", stiffness: 400, damping: 15 } }}
          className="w-full h-full rounded-lg flex flex-col p-1 relative"
        >
          {isImpactingTarget && <SlashEffect />}

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

