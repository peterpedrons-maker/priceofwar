import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Info, X, Sword, Zap, Users, Library, ArrowUp } from 'lucide-react';
import { playAiTurn, AiAction } from './services/aiService';

export type CardType = 'Infantaria' | 'Cavalaria' | 'Arqueiro' | 'Artilharia' | 'General' | 'Relíquia' | 'Terreno' | 'Tática';

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
const GENERAL_PLAYER: CardData = {
  id: 'general_player',
  name: 'Comandante Aldric',
  atk: 0,
  hp: 20,
  cost: 0,
  art: '',
  effect: 'O comandante do seu exército. Se ele cair em batalha, você perde a guerra.',
  cardType: 'General',
};

const GENERAL_NPC: CardData = {
  id: 'general_npc',
  name: 'Comandante Inimigo',
  atk: 0,
  hp: 20,
  cost: 0,
  art: '',
  effect: 'O comandante do exército inimigo. Derrote-o para vencer a guerra.',
  cardType: 'General',
};

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

const ManaBadge = ({ value, className = "" }: { value: number, className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
      <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="6" strokeLinejoin="round" />
      <polygon points="50,15 85,35 85,65 50,85 15,65 15,35" fill="none" stroke="#bfdbfe" strokeWidth="2" opacity="0.5" />
    </svg>
    <span className="relative z-10 text-white font-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-none">{value}</span>
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

// Placeholder for the board's full background art (to be an AI-generated battlefield
// image later). Empty for now — the board renders a flat neutral surface instead.
const BOARD_ART_URL = '';

// How big the previewed card renders while parked in the corner during slot selection.
// Kept smaller on mobile since the board there fills nearly the full screen width,
// leaving much less clear side margin to tuck the card into.
const FIELD_PREVIEW_SCALE = { mobile: 0.58, desktop: 0.85 };

// Hand fan layout: cards spread across a modest total angle, center card slightly raised.
const FAN_SPREAD_DEG = 26;
const FAN_LIFT_PX = 20;
const HAND_CARD_WIDTH = 224; // w-56
const HAND_CARD_HEIGHT = 320; // h-80
// Cards overlap like a real hand of cards instead of sitting apart with a gap —
// each card only advances this much past the previous one.
const HAND_CARD_STEP = HAND_CARD_WIDTH * 0.5;

const MOCK_DECK: CardData[] = [
  { id: 'c1', name: 'Crimson Dragon', atk: 6, hp: 5, cost: 5, art: '', effect: 'Flying. Deals double damage to players.', cardType: 'Cavalaria' },
  { id: 'c2', name: 'Iron Knight', atk: 3, hp: 6, cost: 3, art: '', effect: 'Taunt. Protects adjacent allies.', cardType: 'Infantaria' },
  { id: 'c3', name: 'Arcane Mage', atk: 4, hp: 2, cost: 4, art: '', effect: 'Spell Damage +2. Battlecry: Draw a card.', cardType: 'Artilharia' },
  { id: 'c4', name: 'Forest Goblin', atk: 2, hp: 1, cost: 1, art: '', effect: 'Charge. Can attack immediately.', cardType: 'Infantaria' },
  { id: 'c5', name: 'Stone Golem', atk: 4, hp: 8, cost: 6, art: '', effect: 'Cannot attack unless provoked.', cardType: 'Infantaria' },
  { id: 'c6', name: 'Arqueiro Élfico', atk: 3, hp: 2, cost: 2, art: '', effect: 'Ataca à distância a partir da Retaguarda.', cardType: 'Arqueiro' },
  { id: 'c7', name: 'Relicário Sagrado', atk: 0, hp: 3, cost: 3, art: '', effect: 'Relíquia. Ocupa o slot especial ao lado do General.', cardType: 'Relíquia' },
  { id: 'c8', name: 'Trincheira', atk: 0, hp: 5, cost: 2, art: '', effect: 'Terreno. Ocupa o slot especial ao lado do General.', cardType: 'Terreno' },
];

const generateHand = (count: number) => {
  return Array(count).fill(null).map((_, i) => ({
    ...MOCK_DECK[Math.floor(Math.random() * MOCK_DECK.length)],
    id: `hand_${Date.now()}_${i}`
  }));
};

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

export default function App() {
  const [gameMode, setGameMode] = useState<string | null>(null);
  const [viewState, setViewState] = useState<'hand' | 'field' | 'draw'>('hand');
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'npc'>('player');
  const [turnNumber, setTurnNumber] = useState(1);

  const [playerMana, setPlayerMana] = useState(10);
  const [npcMana, setNpcMana] = useState(10);

  const [hand, setHand] = useState<CardData[]>([]);
  const [playerSlots, setPlayerSlots] = useState<(CardData | null)[]>(Array(13).fill(null));
  const [npcSlots, setNpcSlots] = useState<(CardData | null)[]>(Array(13).fill(null));

  const [selectedAttackerIndex, setSelectedAttackerIndex] = useState<number | null>(null);
  const [detailedCard, setDetailedCard] = useState<CardData | null>(null);

  const [isImpacting, setIsImpacting] = useState(false);
  const [attackAnim, setAttackAnim] = useState<{ attackerIndex: number, targetIndex: number, isPlayerAttacking: boolean } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [gameOverWinner, setGameOverWinner] = useState<'player' | 'npc' | null>(null);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resetGame = () => {
    setGameOverWinner(null);
    setCurrentTurn('player');
    setTurnNumber(1);
    setPlayerMana(10);
    setNpcMana(10);
    setSelectedCardIndex(null);
    setSelectedAttackerIndex(null);
    setViewState('hand');

    setHand(generateHand(5));

    // Place each side's General in their fixed slot (12)
    const mockPlayerSlots = Array(13).fill(null);
    mockPlayerSlots[12] = GENERAL_PLAYER;
    setPlayerSlots(mockPlayerSlots);

    // Mock NPC field
    const mockNpcSlots = Array(13).fill(null);
    mockNpcSlots[6] = MOCK_DECK[1]; // Iron Knight
    mockNpcSlots[8] = MOCK_DECK[3]; // Forest Goblin
    mockNpcSlots[12] = GENERAL_NPC;
    setNpcSlots(mockNpcSlots);
  };

  useEffect(() => {
    resetGame();
  }, []);

  const startGame = (mode: string) => {
    resetGame();
    setGameMode(mode);
  };

  useEffect(() => {
    if (currentTurn === 'player') {
      setPlayerMana(10);
      if (turnNumber > 1) {
        setViewState('draw');
        setTimeout(() => {
          setHand(prev => {
            if (prev.length < 10) {
              const newCard = {
                ...MOCK_DECK[Math.floor(Math.random() * MOCK_DECK.length)],
                id: `hand_${Date.now()}_${Math.random()}`
              };
              return [...prev, newCard];
            }
            return prev;
          });
          setViewState('hand');
        }, 1200);
      }
    } else {
      setNpcMana(10);
      setViewState('field');
    }
  }, [currentTurn, turnNumber]);

  useEffect(() => {
    if (currentTurn === 'npc' && gameMode === 'Quick Match' && !isAnimating && !gameOverWinner) {
      const runAiTurn = async () => {
        setIsAnimating(true);
        const { actions } = playAiTurn(npcSlots, playerSlots, npcMana, hand);
        
        let currentNpcSlots = [...npcSlots];
        let currentPlayerSlots = [...playerSlots];
        let currentNpcMana = npcMana;
        let playerGeneralFell = false;

        for (const action of actions) {
          if (action.type === 'play_card') {
            // General (12) is fixed at game start; Relíquia/Terreno slots (10/11) are off-limits to the AI's generic minions
            if (action.slotIndex >= 10) continue;
            currentNpcSlots[action.slotIndex] = action.card;
            currentNpcMana -= action.card.cost;
            setNpcSlots([...currentNpcSlots]);
            setNpcMana(currentNpcMana);
            await new Promise(resolve => setTimeout(resolve, 500));
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
        <MainMenu onSelectMode={startGame} />
      </div>
    );
  }

  const isMobile = windowSize.width < 768;
  // Board container is a fixed 1000x1400px canvas (see the 3D Board div below) that gets
  // scaled down to fit the real viewport — these divisors must match those exact dimensions.
  const boardScale = isMobile ? Math.min(windowSize.width / 1000, windowSize.height / 1400) * 0.9 : Math.min(windowSize.width / 1600, 1);
  // Hand cards are fanned out (see getFanRotation below), so the outer cards' bounding box
  // is wider than their flat width — account for that tilt or the fan's edge cards clip.
  // Scale so the WHOLE hand always fits on screen — no floor, or large hands would overflow
  // and get clipped past the screen edges (the outer container clips, it doesn't scroll).
  const handTotalWidth = hand.length > 0 ? HAND_CARD_WIDTH + (hand.length - 1) * HAND_CARD_STEP : HAND_CARD_WIDTH;
  const handFanMaxAngleRad = (FAN_SPREAD_DEG / 2) * (Math.PI / 180);
  const handFanExtraWidth = hand.length > 1 ? HAND_CARD_HEIGHT * Math.sin(handFanMaxAngleRad) : 0;
  const handScale = isMobile
    ? Math.min(0.85, (windowSize.width - 16) / (handTotalWidth + handFanExtraWidth))
    : 1;

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

  const handleSlotClick = (slotIndex: number, slotEl?: HTMLElement) => {
    if (gameOverWinner) return;
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
        showToast("Not enough mana!");
        return;
      }

      setPlayerMana(prev => prev - cardToPlay.cost);

      // Capture the hand card's current position now, before it's removed from the DOM.
      const fromEl = handCardRefs.current[cardToPlay.id];
      const fromRect = fromEl?.getBoundingClientRect();

      // Remove from hand right away...
      const newHand = [...hand];
      newHand.splice(selectedCardIndex, 1);
      setHand(newHand);
      setSelectedCardIndex(null);
      setViewState('hand');

      if (fromRect && slotEl) {
        // First, let the camera zoom/pan toward the slot and settle — only once it has
        // stopped moving do we measure the slot's real on-screen position and start the
        // card's flight, so the landing spot doesn't drift out from under it mid-flight.
        setPreZoomSlot({ slotIndex });
        setTimeout(() => {
          const toRect = slotEl.getBoundingClientRect();
          setPreZoomSlot(null);
          setFlyingCard({
            card: cardToPlay,
            slotIndex,
            fromX: fromRect.left + fromRect.width / 2,
            fromY: fromRect.top + fromRect.height / 2,
            fromW: fromRect.width,
            fromH: fromRect.height,
            toX: toRect.left + toRect.width / 2,
            toY: toRect.top + toRect.height / 2,
            toW: toRect.width,
            toH: toRect.height,
          });
        }, 520);
      } else {
        // Couldn't measure a position (shouldn't normally happen) — place instantly.
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
          setPlayerSlots(prev => prev.map(c => c?.isDestroyed ? null : c));
          setNpcSlots(prev => prev.map(c => c?.isDestroyed ? null : c));
        }
      }
      setIsAnimating(false);
    }
  };

  const handleBackgroundClick = () => {
    if (viewState === 'field') {
      setSelectedCardIndex(null);
      setViewState('hand');
    } else if (selectedCardIndex !== null) {
      // Tapped away while a card was only previewed (Jogar Carta not pressed yet) — cancel it
      setSelectedCardIndex(null);
    }
  };

  const getSelectedCardX = (index: number) => {
    const startX = -handTotalWidth / 2 + HAND_CARD_WIDTH / 2;
    const cardX = startX + index * HAND_CARD_STEP;
    // Tuck the previewed card right up against a side edge while the player picks a
    // slot, so it blocks as little of the board (and its slot indicators) as possible,
    // while staying fully on-screen so the player always knows what they're about to play.
    const previewHalfWidth = (HAND_CARD_WIDTH * (isMobile ? FIELD_PREVIEW_SCALE.mobile : FIELD_PREVIEW_SCALE.desktop)) / 2;
    const edgeMargin = previewHalfWidth + 14;
    const targetX = isMobile ? (windowSize.width / 2 - edgeMargin) : (-(windowSize.width / 2) + edgeMargin);
    return targetX - cardX;
  };

  // Fan the hand out like a real card fan: a modest total spread, distributed evenly
  // across however many cards are in hand, with the center card slightly raised.
  const getFanRotation = (index: number) => {
    if (hand.length <= 1) return 0;
    const mid = (hand.length - 1) / 2;
    const step = FAN_SPREAD_DEG / (hand.length - 1);
    return (index - mid) * step;
  };
  const getFanLift = (index: number) => {
    if (hand.length <= 1) return 0;
    const mid = (hand.length - 1) / 2;
    const normalized = mid === 0 ? 0 : (index - mid) / mid;
    return normalized * normalized * FAN_LIFT_PX;
  };

  const getBoardAnimation = () => {
    // The board stays visible at all times — like looking down at a table with the
    // hand of cards held up in front of it — instead of tilting away out of view
    // while browsing the hand. Only the one-off draw animation gets a distinct camera.
    const baseAnim = {
      rotateX: viewState === 'draw' ? 25 : (isMobile ? 25 : 35),
      rotateZ: viewState === 'draw' ? -5 : 0,
      y: viewState === 'draw' ? -400 : (isMobile ? 0 : -50),
      x: viewState === 'draw' ? -350 : 0,
      z: viewState === 'draw' ? 300 : (isMobile ? 50 : 50),
      scale: (viewState === 'draw' ? 1.1 : (isMobile ? 1.0 : 0.85)) * boardScale,
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

    if (attackAnim) {
      const isPlayer = attackAnim.isPlayerAttacking;
      const targetRotateX = isPlayer ? baseAnim.rotateX - 25 : baseAnim.rotateX + 25;
      const targetY = isPlayer ? baseAnim.y + 250 : baseAnim.y - 250;
      const targetZ = baseAnim.z + 300;
      const targetScale = baseAnim.scale * 1.15;

      if (isImpacting) {
        return {
          ...baseAnim,
          rotateX: [targetRotateX, targetRotateX + 5, targetRotateX - 5, targetRotateX],
          rotateZ: [baseAnim.rotateZ, baseAnim.rotateZ - 5, baseAnim.rotateZ + 5, baseAnim.rotateZ],
          x: [baseAnim.x, baseAnim.x - 30, baseAnim.x + 30, baseAnim.x],
          y: targetY,
          z: targetZ,
          scale: targetScale,
          transition: { duration: 0.2 }
        };
      }

      return {
        ...baseAnim,
        rotateX: targetRotateX,
        y: targetY,
        z: targetZ,
        scale: targetScale,
        transition: { duration: 0.4, ease: "easeInOut" }
      };
    }

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
      {/* Background ambient light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,30,60,0.8)_0%,rgba(0,0,0,1)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(80,60,140,0.15)_0%,transparent_60%)] pointer-events-none" />

      {/* 3D Board */}
      <motion.div
        className="w-[1000px] h-[1400px] grid grid-rows-2 gap-24 p-8 relative"
        animate={getBoardAnimation()}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        onClick={(e) => {
          e.stopPropagation();
          if (selectedCardIndex !== null) {
            setSelectedCardIndex(null);
            setViewState('hand');
          }
          if (selectedAttackerIndex !== null) {
            setSelectedAttackerIndex(null);
          }
        }}
      >
        {/* Board Surface — a flat, neutral placeholder for now; drop BOARD_ART_URL in
            later to swap in a full AI-generated battlefield image. */}
        <div
          className="absolute inset-0 border-4 border-stone-700/50 bg-[#2b2825] rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.5)] pointer-events-none overflow-hidden"
          style={{ transform: 'translateZ(-1px)' }}
        >
          {BOARD_ART_URL ? (
            <img src={BOARD_ART_URL} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
          )}
        </div>

        {/* Central Divider */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.6)] -translate-y-1/2 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-indigo-400/70 bg-indigo-950 shadow-[0_0_20px_rgba(99,102,241,0.8)] pointer-events-none" />

        {/* NPC Field */}
        <div className="flex flex-col gap-6 justify-start pt-4">
          {/* General row (fixed) + Relíquia/Terreno slots */}
          <div className="flex justify-center gap-16 items-center">
            <CardSlot
              card={npcSlots[10]}
              onClick={() => handleNpcSlotClick(10)}
              onInfoClick={setDetailedCard}
              isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 10}
              isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === 10}
              attackDirection="down"
            />
            <div className="relative">
              <CardSlot
                card={npcSlots[12]}
                onClick={() => handleNpcSlotClick(12)}
                onInfoClick={setDetailedCard}
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 12}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === 12}
                attackDirection="down"
              />
              <ManaBadge value={npcMana} className="absolute -top-3 -left-3 w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm z-20" />
            </div>
            <CardSlot
              card={npcSlots[11]}
              onClick={() => handleNpcSlotClick(11)}
              onInfoClick={setDetailedCard}
              isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 11}
              isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === 11}
              attackDirection="down"
            />
          </div>
          {/* Retaguarda NPC (Backline) */}
          <div className="text-center text-[8px] md:text-[10px] tracking-widest text-zinc-500 uppercase -mb-3">Retaguarda</div>
          <div className="flex justify-center gap-6">
            {[5, 6, 7, 8, 9].map((i) => (
              <CardSlot 
                key={i} 
                card={npcSlots[i]} 
                onClick={() => handleNpcSlotClick(i)} 
                onInfoClick={setDetailedCard} 
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === i}
                attackDirection="down"
              />
            ))}
          </div>
          {/* Vanguarda NPC (Frontline) */}
          <div className="text-center text-[8px] md:text-[10px] tracking-widest text-zinc-500 uppercase -mb-3">Vanguarda</div>
          <div className="flex justify-center gap-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <CardSlot
                key={i}
                card={npcSlots[i]}
                onClick={() => handleNpcSlotClick(i)}
                onInfoClick={setDetailedCard}
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === i}
                attackDirection="down"
              />
            ))}
          </div>
        </div>

        {/* Player Field */}
        <div className="flex flex-col gap-6 justify-end pb-4 pointer-events-auto">
          {/* Vanguarda Player (Frontline) */}
          <div className="flex justify-center gap-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <CardSlot
                key={i}
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
          <div className="flex justify-center gap-6">
            {[5, 6, 7, 8, 9].map((i) => (
              <CardSlot
                key={i}
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

        {/* Opponent Deck & Graveyard (On Board) */}
        <div className="absolute -right-40 md:-right-64 top-12 flex flex-col gap-6 items-center z-40 pointer-events-none">
          {/* Deck */}
          <div className="w-24 md:w-36 h-32 md:h-48 border-2 border-[#8c7a5f] rounded-xl bg-[#4a3b2c] flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative">
            <div className="absolute inset-0 border-2 border-[#8c7a5f] rounded-xl translate-x-1 translate-y-1 bg-[#3a2b1c] -z-10" />
            <div className="absolute inset-0 border-2 border-[#8c7a5f] rounded-xl translate-x-2 translate-y-2 bg-[#2a1b0c] -z-20" />
            <div className="absolute inset-0 border-2 border-[#8c7a5f] rounded-xl translate-x-3 translate-y-3 bg-[#1a0b00] -z-30" />
            <div className="w-[80%] h-[85%] border border-[#8c7a5f]/50 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.2)_0%,transparent_70%)]" />
              <div className="w-8 h-8 md:w-12 md:h-12 opacity-50 bg-zinc-800 rounded-full border-2 border-[#8c7a5f]" />
            </div>
          </div>
          {/* Graveyard */}
          <div className="w-24 md:w-36 h-32 md:h-48 border-2 border-zinc-700 rounded-xl bg-zinc-900/80 flex items-center justify-center shadow-lg relative overflow-hidden">
            <span className="text-zinc-600 font-mono text-xs md:text-sm uppercase tracking-widest rotate-90 opacity-50">Graveyard</span>
          </div>
        </div>

        {/* Opponent Hand (Floating) */}
        <div className="absolute top-[-150px] md:top-[-200px] left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 pointer-events-none z-50" style={{ perspective: '1000px' }}>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`npc-hand-${i}`}
              className="w-32 h-48 md:w-40 md:h-56 shrink-0 bg-[#c5b599] rounded-xl border-2 border-[#8c7a5f] relative shadow-2xl"
              initial={{ y: -100, opacity: 0, rotateX: -20, rotateZ: (i - 2) * 5 }}
              animate={{ 
                y: [0, -10, 0], 
                opacity: 1,
                rotateX: -20,
                rotateZ: (i - 2) * 5
              }}
              transition={{ 
                y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
                opacity: { duration: 0.5, delay: i * 0.1 }
              }}
            >
              {/* Card Back Design */}
              <div className="absolute inset-2 border border-[#8c7a5f]/50 rounded-lg flex items-center justify-center bg-[#4a3b2c]">
                <div className="w-8 h-8 bg-zinc-800 rounded-full border-2 border-[#d4af37] opacity-50" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Deck & Graveyard (On Board) */}
        <div className="absolute -right-40 md:-right-64 bottom-12 flex flex-col gap-6 items-center z-40 pointer-events-auto">
          {/* Graveyard */}
          <div className="w-24 md:w-36 h-32 md:h-48 border-2 border-zinc-700 rounded-xl bg-zinc-900/80 flex items-center justify-center shadow-lg relative overflow-hidden">
            <span className="text-zinc-600 font-mono text-xs md:text-sm uppercase tracking-widest rotate-90 opacity-50">Graveyard</span>
          </div>
          
          {/* Deck */}
          <motion.div 
            className="w-24 md:w-36 h-32 md:h-48 border-2 border-[#8c7a5f] rounded-xl bg-[#4a3b2c] flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative group"
          >
            {/* Deck thickness effect */}
            <div className="absolute inset-0 border-2 border-[#8c7a5f] rounded-xl translate-x-1 -translate-y-1 bg-[#3a2b1c] -z-10" />
            <div className="absolute inset-0 border-2 border-[#8c7a5f] rounded-xl translate-x-2 -translate-y-2 bg-[#2a1b0c] -z-20" />
            <div className="absolute inset-0 border-2 border-[#8c7a5f] rounded-xl translate-x-3 -translate-y-3 bg-[#1a0b00] -z-30" />
            
            {/* Card Back Design */}
            <div className="w-[80%] h-[85%] border border-[#8c7a5f]/50 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.2)_0%,transparent_70%)]" />
              <div className="w-8 h-8 md:w-12 md:h-12 opacity-50 bg-zinc-800 rounded-full border-2 border-[#8c7a5f]" />
            </div>

            {/* Draw Animation Effect */}
            <AnimatePresence>
              {viewState === 'draw' && (
                <motion.div
                  initial={{ opacity: 0, y: 0, z: 0, scale: 1 }}
                  animate={{ opacity: [0, 1, 1, 0], y: 250, z: 200, scale: 2.5, rotateX: 20, rotateZ: 5 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute inset-0 border-2 border-[#8c7a5f] rounded-xl bg-[#4a3b2c] flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.8)] z-50"
                >
                  <div className="w-[80%] h-[85%] border border-[#8c7a5f]/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.4)_0%,transparent_70%)]" />
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-zinc-800 rounded-full border-2 border-[#d4af37]" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* Hand UI */}
      <motion.div
        className="absolute inset-0 w-full h-full flex justify-center items-end pb-4 md:pb-6 pointer-events-none z-50"
        animate={{
          scale: handScale,
          y: isMobile ? (viewState === 'field' ? 200 : 0) : (viewState === 'field' ? 220 : 0),
          // Hidden while a card is flying to the board (and briefly after, while the camera
          // settles) so the rest of the hand doesn't clutter the summon animation.
          opacity: (preZoomSlot || flyingCard || cameraSettling) ? 0 : 1,
        }}
        transition={{ opacity: { duration: 0.15 } }}
      >
        <div className="flex pointer-events-none">
          <AnimatePresence>
            {hand.map((card, i) => (
              <motion.div
                layoutId={card.id}
                key={card.id}
                ref={(el) => { handCardRefs.current[card.id] = el; }}
                className={`w-56 h-80 shrink-0 bg-gradient-to-b from-[#e8dcbe] via-[#c9b48a] to-[#a3895f] rounded-xl cursor-pointer flex flex-col p-2 relative group border-2 border-[#5c4a30] ${viewState === 'field' ? 'pointer-events-none' : 'pointer-events-auto'}`}
                initial={{
                  opacity: 0,
                  x: windowSize.width / 2,
                  y: 200,
                  scale: 0.5,
                  rotateZ: 45
                }}
                style={{
                  transformOrigin: 'bottom center',
                  marginLeft: i === 0 ? 0 : HAND_CARD_STEP - HAND_CARD_WIDTH,
                }}
                animate={{
                  opacity: viewState === 'field'
                    ? (selectedCardIndex === i ? 1 : 0.4)
                    : (selectedCardIndex !== null && i > selectedCardIndex ? 0.3 : 1),
                  x: selectedCardIndex === i && viewState === 'field' ? getSelectedCardX(i) : 0,
                  // While field-view is up, the hand tray itself drops down out of the way
                  // (see the wrapper's own y below) — cancel that out and then some, so the
                  // previewed card floats up alongside the board's own rows of cards rather
                  // than sitting down at the hand's normal resting height.
                  y: selectedCardIndex === i
                    ? (viewState === 'field' ? (isMobile ? -260 : -380) : -40)
                    : (viewState === 'field' ? (isMobile ? 150 : 150) : getFanLift(i)),
                  scale: selectedCardIndex === i
                    ? (viewState === 'field' ? (isMobile ? FIELD_PREVIEW_SCALE.mobile : FIELD_PREVIEW_SCALE.desktop) : 1.1)
                    : (viewState === 'field' ? 0.6 : 1),
                  rotateZ: selectedCardIndex === i || viewState === 'field' ? 0 : getFanRotation(i),
                  zIndex: selectedCardIndex === i ? 150 : i + 1,
                  boxShadow: selectedCardIndex === i
                    ? "inset 0 0 0 1px rgba(212,175,55,0.45), 0 0 120px rgba(212, 175, 55, 0.95)"
                    : "inset 0 0 0 1px rgba(212,175,55,0.45), 0 10px 30px rgba(0,0,0,0.5)"
                }}
                whileHover={{
                  y: selectedCardIndex === i
                    ? (viewState === 'field' ? (isMobile ? -260 : -380) : -40)
                    : viewState === 'field' ? 120 : -20,
                  scale: selectedCardIndex === i ? (viewState === 'field' ? (isMobile ? FIELD_PREVIEW_SCALE.mobile : FIELD_PREVIEW_SCALE.desktop) + 0.05 : 1.1) : 1.05,
                  boxShadow: selectedCardIndex === i
                    ? "0 0 80px rgba(212, 175, 55, 0.8)"
                    : "0 0 25px rgba(212, 175, 55, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ 
                  duration: 0.4, 
                  ease: "easeOut",
                  zIndex: { delay: selectedCardIndex === i ? 0 : 0.4 }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(i);
                }}
              >
                {/* Info Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailedCard(card);
                  }}
                  className="absolute top-1 left-1 w-8 h-8 bg-blue-600/90 rounded-full border-2 border-blue-900 flex items-center justify-center shadow-md z-30 hover:bg-blue-500 transition-colors pointer-events-auto"
                >
                  <Info className="text-white w-5 h-5" />
                </button>

                {/* Full Card Art Background */}
                {card.art ? (
                  <img src={card.art} alt={card.name} className="absolute inset-0 w-full h-full object-cover z-0 rounded-xl" referrerPolicy="no-referrer" />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 flex items-center justify-center z-0 rounded-xl">
                    <div className="w-1/3 h-1/3 border border-zinc-500/40 rotate-45" />
                  </div>
                )}

                {/* Content Wrapper */}
                <div className="absolute inset-0 z-10 pointer-events-none p-2 flex flex-col justify-between">
                  {/* Top Section: Name and Cost */}
                  <div className="relative flex items-start justify-between w-full">
                    {/* Name */}
                    <div className="flex-1 bg-gradient-to-b from-black/75 to-black/60 border border-amber-100/25 rounded-lg flex items-center px-3 py-1.5 shadow-sm mr-4">
                      <span className="text-sm font-bold text-white uppercase tracking-tighter truncate drop-shadow-md">{card.name}</span>
                    </div>
                    {/* Gold Badge */}
                    <ManaBadge value={card.cost} className="absolute -top-4 -right-4 w-12 h-12 text-xl z-20 drop-shadow-md" />
                  </div>

                  {/* Bottom Section: Effect, ATK, HP */}
                  <div className="relative w-full flex flex-col items-center">
                    {/* Text Box */}
                    <div className="w-full bg-gradient-to-b from-black/60 to-black/75 border border-amber-100/25 rounded-lg p-3 shadow-sm flex items-center justify-center min-h-[5rem] mb-2">
                      <p className="text-xs leading-snug text-white/90 font-medium text-center drop-shadow-md">{card.effect}</p>
                    </div>
                    
                    {/* ATK Badge */}
                    <AtkBadge value={card.atk} className="absolute -bottom-4 -left-4 w-12 h-12 text-xl z-20 drop-shadow-md" />
                    
                    {/* HP Badge */}
                    <HpBadge value={card.hp} className="absolute -bottom-4 -right-4 w-12 h-12 text-xl z-20 drop-shadow-md" />
                  </div>
                </div>

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
            ))}
          </AnimatePresence>
        </div>
      </motion.div>



      {/* Turn Indicator UI */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col items-end gap-3 pointer-events-none z-50">
        <motion.div 
          className={`px-6 py-3 rounded-xl border-2 backdrop-blur-md font-black text-sm md:text-lg tracking-widest transition-colors flex items-center gap-3 shadow-2xl
            ${currentTurn === 'player' 
              ? 'bg-blue-900/80 border-blue-400 text-blue-200' 
              : 'bg-red-900/80 border-red-500 text-red-200'}`}
          animate={{
            boxShadow: currentTurn === 'player'
              ? ['0 0 10px rgba(59,130,246,0.5)', '0 0 30px rgba(59,130,246,0.8)', '0 0 10px rgba(59,130,246,0.5)']
              : ['0 0 10px rgba(239,68,68,0.5)', '0 0 30px rgba(239,68,68,0.8)', '0 0 10px rgba(239,68,68,0.5)'],
            scale: currentTurn === 'player' ? [1, 1.05, 1] : 1
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className={`w-4 h-4 rounded-full ${currentTurn === 'player' ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,1)]' : 'bg-red-500 shadow-[0_0_10px_rgba(248,113,113,1)]'} animate-pulse`} />
          {currentTurn === 'player' ? "SEU TURNO" : "TURNO DO INIMIGO"}
        </motion.div>
        
        {/* End Turn Button */}
        <button 
          className={`pointer-events-auto px-8 py-3 text-sm md:text-base font-black tracking-widest rounded-xl border-b-4 transition-all active:border-b-0 active:translate-y-1 ${
            currentTurn === 'player'
              ? 'bg-amber-500 hover:bg-amber-400 text-amber-950 border-amber-700 shadow-[0_4px_20px_rgba(245,158,11,0.4)]'
              : 'bg-zinc-700 text-zinc-500 border-zinc-800 cursor-not-allowed'
          }`}
          onClick={(e) => { 
            e.stopPropagation(); 
            if (currentTurn === 'player') setCurrentTurn('npc'); 
          }}
          disabled={currentTurn !== 'player'}
        >
          ENCERRAR TURNO
        </button>
      </div>

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
            setViewState(prev => prev === 'hand' ? 'field' : 'hand');
            setSelectedCardIndex(null);
          }}
        >
          <div className={`w-2 h-2 rounded-full ${viewState === 'field' ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]' : 'bg-zinc-600'}`} />
          VISUALIZAR CAMPO
        </button>
      </div>

      {/* Flying card — plays from hand to the chosen board slot along real screen coordinates.
          Flies up to a large "presentation" size, pauses (Hearthstone-style), wobbles and dips
          with a bit of organic life, then drops in hard with an overshoot/settle impact bounce. */}
      <AnimatePresence>
        {flyingCard && (() => {
          const halfW = flyingCard.fromW / 2;
          const halfH = flyingCard.fromH / 2;
          const finalScale = flyingCard.toW / flyingCard.fromW;
          const hoverScale = Math.min(3, Math.max(0.8, 190 / flyingCard.fromW));
          const hoverX = flyingCard.toX;
          const hoverY = flyingCard.toY - 70;
          const dipY = hoverY + 16; // small "gathering" dip just before the drop
          const times = [0, 0.34, 0.5, 0.62, 0.72, 0.86, 0.94, 1];
          return (
            <motion.div
              initial={{
                left: flyingCard.fromX - halfW,
                top: flyingCard.fromY - halfH,
                width: flyingCard.fromW,
                height: flyingCard.fromH,
                scale: 1,
                rotate: 0,
              }}
              animate={{
                left: [
                  flyingCard.fromX - halfW, hoverX - halfW, hoverX - halfW, hoverX - halfW,
                  hoverX - halfW, flyingCard.toX - halfW, flyingCard.toX - halfW, flyingCard.toX - halfW,
                ],
                top: [
                  flyingCard.fromY - halfH, hoverY - halfH, hoverY - halfH, hoverY - halfH,
                  dipY - halfH, flyingCard.toY - halfH, flyingCard.toY - halfH, flyingCard.toY - halfH,
                ],
                width: flyingCard.fromW,
                height: flyingCard.fromH,
                // Hold, breathe, dip in anticipation, then slam down with an overshoot before settling.
                scale: [1, hoverScale, hoverScale * 1.03, hoverScale * 0.94, hoverScale * 0.9, finalScale * 1.2, finalScale * 0.96, finalScale],
                rotate: [0, 0, 4, -3, 1, 2, -1, 0],
                times,
              }}
              transition={{ duration: 1.15, ease: ["easeOut", "easeInOut", "easeIn", "easeIn", "easeIn", "easeOut", "easeInOut"] }}
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
              style={{ position: 'fixed', zIndex: 500, transformOrigin: 'center center' }}
              className="pointer-events-none bg-gradient-to-b from-[#e8dcbe] via-[#c9b48a] to-[#a3895f] rounded-xl flex flex-col p-2 relative border-2 border-[#5c4a30] shadow-[0_0_40px_rgba(212,175,55,0.6)]"
            >
              <div className="w-full bg-gradient-to-b from-black/75 to-black/60 border border-amber-100/25 rounded-lg flex items-center justify-center px-1 py-1.5 text-center">
                <span className="text-[9px] font-bold text-white uppercase tracking-tighter leading-tight">{flyingCard.card.name}</span>
              </div>
              <ManaBadge value={flyingCard.card.cost} className="absolute -top-4 -right-4 w-10 h-10 text-lg z-20" />
              <AtkBadge value={flyingCard.card.atk} className="absolute -bottom-4 -left-4 w-10 h-10 text-lg z-20" />
              <HpBadge value={flyingCard.card.hp} className="absolute -bottom-4 -right-4 w-10 h-10 text-lg z-20" />
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
              className="relative w-full max-w-sm aspect-[2/3] bg-gradient-to-b from-[#e8dcbe] via-[#c9b48a] to-[#a3895f] rounded-2xl flex flex-col p-4 border-4 border-[#5c4a30] shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            >
              <button
                onClick={() => setDetailedCard(null)}
                className="absolute -top-4 -left-4 w-10 h-10 bg-red-600 rounded-full border-2 border-red-900 flex items-center justify-center shadow-lg z-30 hover:bg-red-500 transition-colors pointer-events-auto"
              >
                <X className="text-white w-6 h-6" />
              </button>

              {/* Full Card Art Background */}
              {detailedCard.art ? (
                <img src={detailedCard.art} alt={detailedCard.name} className="absolute inset-0 w-full h-full object-cover z-0 rounded-2xl" referrerPolicy="no-referrer" />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 flex items-center justify-center z-0 rounded-2xl">
                  <div className="w-1/4 h-1/4 border border-zinc-500/40 rotate-45" />
                </div>
              )}

              {/* Content Wrapper */}
              <div className="absolute inset-0 z-10 pointer-events-none p-4 flex flex-col justify-between">
                {/* Top Section */}
                <div className="relative flex items-start justify-between w-full">
                  {/* Name */}
                  <div className="flex-1 bg-gradient-to-b from-black/75 to-black/60 border border-amber-100/25 rounded-lg flex items-center px-4 py-2 shadow-sm mr-6">
                    <span className="text-lg font-bold text-white uppercase tracking-tight truncate drop-shadow-md">{detailedCard.name}</span>
                  </div>
                  {/* Gold Badge */}
                  <ManaBadge value={detailedCard.cost} className="absolute -top-6 -right-6 w-16 h-16 text-2xl z-20 drop-shadow-lg" />
                </div>

                {/* Bottom Section */}
                <div className="relative w-full flex flex-col items-center">
                  {/* Description Area */}
                  <div className="w-full bg-gradient-to-b from-black/60 to-black/75 border border-amber-100/25 rounded-lg p-4 shadow-sm flex items-center justify-center min-h-[6rem] mb-2">
                    <p className="text-base leading-relaxed text-white/90 font-medium italic text-center drop-shadow-md">
                      {detailedCard.effect}
                    </p>
                  </div>
                  
                  {/* ATK Badge */}
                  <AtkBadge value={detailedCard.atk} className="absolute -bottom-6 -left-6 w-16 h-16 text-2xl z-20 drop-shadow-lg" />
                  
                  {/* HP Badge */}
                  <HpBadge value={detailedCard.hp} className="absolute -bottom-6 -right-6 w-16 h-16 text-2xl z-20 drop-shadow-lg" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CardSlot = ({
  onClick, onInfoClick, card, isSelected = false,
  isAttacking = false, isImpactingTarget = false, attackDirection = 'up', hint
}: {
  onClick?: (el: HTMLElement) => void, onInfoClick?: (card: CardData) => void, card?: CardData | null,
  isSelected?: boolean, isAttacking?: boolean, isImpactingTarget?: boolean, attackDirection?: 'up' | 'down',
  hint?: SlotHint, key?: React.Key
}) => {
  const attackY = attackDirection === 'up' ? -150 : 150;

  const hintClass = hint === 'invalid'
    ? 'border-red-500/60 bg-red-950/30'
    : hint === 'primary'
      ? 'border-emerald-400/70 bg-emerald-500/10 shadow-[0_0_25px_rgba(52,211,153,0.5)]'
      : hint === 'secondary'
        ? 'border-amber-400/60 bg-amber-500/10 shadow-[0_0_18px_rgba(251,191,36,0.4)]'
        : '';

  return (
    <motion.div
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick(e.currentTarget as HTMLElement);
        }
      }}
      className={`w-24 md:w-36 h-32 md:h-48 border-2 border-indigo-500/30 rounded-lg bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,rgba(0,0,0,0.6)_75%)] flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] transition-colors hover:border-indigo-400 hover:bg-indigo-900/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] group relative ${onClick ? 'cursor-pointer pointer-events-auto' : ''} ${isSelected ? 'ring-4 ring-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)]' : ''} ${hintClass}`}
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
      {card && !card.isDestroyed && (
        <motion.div
          animate={{
            y: isAttacking ? attackY : 0,
            z: isAttacking ? 100 : 0,
            scale: isAttacking ? 1.2 : 1,
            rotateX: isAttacking ? (attackDirection === 'up' ? 20 : -20) : 0,
          }}
          transition={{ duration: 0.3 }}
          className="w-full h-full bg-gradient-to-b from-[#e8dcbe] via-[#c9b48a] to-[#a3895f] rounded-lg flex flex-col p-1 relative border-2 border-[#5c4a30] shadow-lg"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.45), 0 4px 10px rgba(0,0,0,0.5)' }}
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

          {/* Full Card Art Background */}
          {card.art ? (
            <img src={card.art} alt={card.name} className="absolute inset-0 w-full h-full object-cover z-0 rounded-lg" referrerPolicy="no-referrer" />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 flex items-center justify-center z-0 rounded-lg">
              <div className="w-1/3 h-1/3 border border-zinc-500/40 rotate-45" />
            </div>
          )}

          {/* Content Wrapper */}
          <div className="absolute inset-0 z-10 pointer-events-none p-1 flex flex-col justify-between">
            {/* Top Section */}
            <div className="relative flex items-start justify-between w-full">
              {/* Name Bar */}
              <div className="flex-1 bg-gradient-to-b from-black/75 to-black/60 border border-amber-100/25 rounded flex items-center px-1.5 py-0.5 shadow-sm mr-2">
                <span className="text-[7px] md:text-[9px] font-bold text-white uppercase tracking-tight truncate drop-shadow-md">{card.name}</span>
              </div>
              {/* Gold Badge */}
              <ManaBadge value={card.cost} className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 text-[10px] md:text-xs z-20 drop-shadow-md" />
            </div>

            {/* Bottom Section */}
            <div className="relative w-full flex flex-col items-center">
              {/* Description Area */}
              <div className="w-full bg-gradient-to-b from-black/60 to-black/75 border border-amber-100/25 rounded p-1 shadow-sm flex items-center justify-center min-h-[2.5rem] mb-1">
                <p className="text-[6px] md:text-[8px] leading-[1.1] md:leading-tight text-white/90 font-medium italic text-center drop-shadow-md">
                  {card.effect}
                </p>
              </div>
              
              {/* ATK Badge */}
              <AtkBadge value={card.atk} className="absolute -bottom-2 -left-2 w-6 h-6 md:w-8 md:h-8 text-[10px] md:text-xs z-20 drop-shadow-md" />
              
              {/* HP Badge */}
              <HpBadge value={card.hp} className="absolute -bottom-2 -right-2 w-6 h-6 md:w-8 md:h-8 text-[10px] md:text-xs z-20 drop-shadow-md" />
            </div>
          </div>
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

