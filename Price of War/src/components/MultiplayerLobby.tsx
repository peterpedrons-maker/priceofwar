/**
 * MultiplayerLobby — Automatic matchmaking queue.
 * Players choose a deck, join the queue, and are automatically matched.
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  joinLobby, leaveLobby,
  createGame, setLobbyStatus,
  findAvailableOpponent, getActiveGameForUser,
} from '../services/supabaseService';
import type { CardData } from '../App';

interface OnlineUser {
  id: string;
  username: string;
  email: string;
}

interface MultiplayerLobbyProps {
  user: OnlineUser;
  customDeck: CardData[];
  onGameStart: (params: {
    gameId: string;
    isP1: boolean;
    opponentUsername: string;
    myDeck: 'custom' | 'deck1' | 'cardeal';
    opponentDeck: string;
  }) => void;
  onBack: () => void;
}

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ user, customDeck, onGameStart, onBack }) => {
  const [step, setStep] = useState<'deck' | 'searching' | 'found'>('deck');
  const [selectedDeck, setSelectedDeck] = useState<'custom' | 'deck1' | 'cardeal' | null>(null);
  const [statusMsg, setStatusMsg] = useState('Procurando adversário...');
  const [loading, setLoading] = useState(false);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [foundParams, setFoundParams] = useState<Parameters<typeof onGameStart>[0] | null>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const matchedRef = useRef(false);

  // ── Step 1: Deck selection ─────────────────────────────────────────────
  const handleDeckSelect = async (deckId: 'custom' | 'deck1' | 'cardeal') => {
    setSelectedDeck(deckId);
    setLoading(true);
    try {
      await joinLobby(user.id, user.username, deckId);
      matchedRef.current = false;
      setWaitSeconds(0);
      setStep('searching');
    } catch {
      setStatusMsg('Erro ao entrar na fila. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ── Matchmaking loop ───────────────────────────────────────────────────
  useEffect(() => {
    if (step !== 'searching') return;

    timerRef.current = setInterval(() => setWaitSeconds(s => s + 1), 1000);

    const doMatchmaking = async () => {
      if (matchedRef.current) return;

      // 1. Check if a game was already created for us (we are p2)
      const existingGame = await getActiveGameForUser(user.id);
      if (existingGame && !matchedRef.current) {
        matchedRef.current = true;
        if (timerRef.current) clearInterval(timerRef.current);
        await leaveLobby(user.id);
        const amP1 = existingGame.player1_id === user.id;
        const params = {
          gameId: existingGame.id,
          isP1: amP1,
          opponentUsername: amP1 ? existingGame.player2_username : existingGame.player1_username,
          myDeck: (selectedDeck ?? 'deck1') as 'custom' | 'deck1' | 'cardeal',
          opponentDeck: amP1 ? existingGame.player2_deck : existingGame.player1_deck,
        };
        setFoundParams(params);
        setStep('found');
        setTimeout(() => onGameStart(params), 2800);
        return;
      }

      // 2. Look for an available opponent
      const opponent = await findAvailableOpponent(user.id);
      if (opponent && !matchedRef.current) {
        if (user.id < opponent.user_id) {
          // Our ID is lower → we create the game
          const opponentGame = await getActiveGameForUser(opponent.user_id);
          if (!opponentGame) {
            try {
              const game = await createGame(
                user.id, user.username, selectedDeck ?? 'deck1',
                opponent.user_id, opponent.username, opponent.selected_deck
              );
              matchedRef.current = true;
              if (timerRef.current) clearInterval(timerRef.current);
              await leaveLobby(user.id);
              const params = {
                gameId: game.id,
                isP1: true,
                opponentUsername: opponent.username,
                myDeck: (selectedDeck ?? 'deck1') as 'custom' | 'deck1' | 'cardeal',
                opponentDeck: opponent.selected_deck as 'custom' | 'deck1' | 'cardeal',
              };
              setFoundParams(params);
              setStep('found');
              setTimeout(() => onGameStart(params), 2800);
              return;
            } catch {
              // Race condition — retry next poll
            }
          }
        }
        // Our ID is higher → opponent will create the game, just wait
        setStatusMsg('Adversário encontrado! Aguardando início...');
      } else {
        setStatusMsg('Procurando adversário...');
      }

      pollRef.current = setTimeout(doMatchmaking, 2000);
    };

    pollRef.current = setTimeout(doMatchmaking, 1000);

    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      leaveLobby(user.id);
    };
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Deck selection screen ─────────────────────────────────────────────
  if (step === 'deck') {
    const decks = [
      { id: 'deck1' as const, name: 'Deck Capitão', desc: 'Infantaria disciplinada e reformação tática.', color: 'indigo' },
      { id: 'cardeal' as const, name: 'Deck Cardeal', desc: 'Fé e ferro. Cura, invocações e emboscadas sagradas.', color: 'amber' },
      ...(customDeck.length > 0 ? [{ id: 'custom' as const, name: 'Meu Deck', desc: `${customDeck.length} cartas personalizadas.`, color: 'emerald' }] : []),
    ];
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-[999] p-6">
        <motion.h2 initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 uppercase tracking-widest">
          Multiplayer — Escolha seu Deck
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
          {decks.map((d, idx) => (
            <motion.button key={d.id}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => handleDeckSelect(d.id)} disabled={loading}
              className={`flex-1 flex flex-col items-center gap-3 bg-zinc-900/80 border-2 rounded-2xl px-6 py-8 disabled:opacity-50 transition-all ${
                d.color === 'amber' ? 'border-amber-600 hover:border-amber-400' :
                d.color === 'indigo' ? 'border-indigo-600 hover:border-indigo-400' :
                'border-emerald-600 hover:border-emerald-400'
              }`}>
              <span className={`text-lg font-black uppercase tracking-widest ${
                d.color === 'amber' ? 'text-amber-300' :
                d.color === 'indigo' ? 'text-indigo-300' : 'text-emerald-300'
              }`}>{d.name}</span>
              <span className="text-zinc-400 text-xs text-center">{d.desc}</span>
            </motion.button>
          ))}
        </div>
        <button onClick={onBack} className="mt-8 text-[#8c7a5f] hover:text-white text-sm underline transition-colors">
          ← Voltar ao Menu
        </button>
        {statusMsg !== 'Procurando adversário...' && (
          <p className="mt-3 text-red-400 text-sm">{statusMsg}</p>
        )}
      </div>
    );
  }

  // ── Found screen ────────────────────────────────────────────────────
  if (step === 'found' && foundParams) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18)_0%,transparent_65%)] pointer-events-none" />
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="flex flex-col items-center gap-6 text-center px-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.5 }}
            className="text-8xl select-none"
          >
            ⚔️
          </motion.div>
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-[#ffe87c] to-[#c87a00]"
            style={{ textShadow: '0 0 40px rgba(212,175,55,0.5)' }}
          >
            Adversário Encontrado!
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex items-center gap-4 bg-[#0e0b06] border border-[#d4af37]/40 rounded-2xl px-8 py-4"
          >
            <span className="text-[#8c7a5f] text-sm uppercase tracking-widest">vs</span>
            <span className="text-2xl font-black text-white tracking-wide">{foundParams.opponentUsername}</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 1] }}
            transition={{ delay: 1, duration: 1.5 }}
            className="text-[#d4af37]/70 text-sm uppercase tracking-widest"
          >
            Preparando o campo de batalha...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // ── Searching screen ──────────────────────────────────────────────────
  const mins = Math.floor(waitSeconds / 60);
  const secs = waitSeconds % 60;
  const timeStr = mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `${secs}s`;

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center z-[999] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(49,46,129,0.25)_0%,transparent_70%)] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex flex-col items-center gap-8 w-full max-w-sm text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="text-7xl select-none"
        >
          ⚔
        </motion.div>

        <div>
          <h2 className="text-2xl font-black text-[#d4af37] uppercase tracking-widest mb-2">
            Buscando Partida
          </h2>
          <p className="text-[#8c7a5f] text-sm">{statusMsg}</p>
        </div>

        <div className="bg-[#0e0b06] border border-[#8c7a5f]/30 rounded-xl px-6 py-3 text-sm">
          <span className="text-[#8c7a5f]">Deck: </span>
          <span className="text-[#d4af37] font-bold">
            {selectedDeck === 'cardeal' ? 'Deck Cardeal' : selectedDeck === 'deck1' ? 'Deck Capitão' : 'Deck Personalizado'}
          </span>
        </div>

        <div className="text-[#8c7a5f]/60 text-xs tabular-nums">
          Na fila há {timeStr} • {user.username}
        </div>

        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <motion.div key={i}
              className="w-2 h-2 rounded-full bg-[#d4af37]"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </div>

        <button
          onClick={() => { setStep('deck'); setStatusMsg('Procurando adversário...'); setWaitSeconds(0); }}
          className="text-[#8c7a5f] hover:text-white text-sm underline transition-colors"
        >
          ← Cancelar e Voltar
        </button>
      </motion.div>
    </div>
  );
};

