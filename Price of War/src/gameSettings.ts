// Player's gameplay options, kept on this device. For now: the optional on-screen hints (all ON by default, so a new player
// sees them; anyone can turn them off in Opções, in the menu or during a match).
import { useSyncExternalStore } from 'react';

export type GameSettings = {
  hintsDrag: boolean;   // finger above the hand, "segure e arraste" in the card view, the "Solte…" pill while dragging
  hintsBoard: boolean;  // the words on the board slots (ATACA / RESERVA / PROTEGIDA) and on Tática targets
};
const KEY = 'pow.settings';
const DEFAULTS: GameSettings = { hintsDrag: true, hintsBoard: true };
const load = (): GameSettings => {
  try {
    const r = JSON.parse(localStorage.getItem(KEY) || '{}');
    return { hintsDrag: r.hintsDrag !== false, hintsBoard: r.hintsBoard !== false };
  } catch { return { ...DEFAULTS }; }
};
let state: GameSettings = load();
const listeners = new Set<() => void>();
export const getGameSettings = () => state;
export const subscribeSettings = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
export const setGameSettings = (patch: Partial<GameSettings>) => {
  state = { ...state, ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage is optional */ }
  listeners.forEach(l => l());
};
export const useGameSettings = (): GameSettings => useSyncExternalStore(subscribeSettings, getGameSettings, getGameSettings);
