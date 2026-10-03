// Player's sound settings: overall volume, music, effects and a mute switch, kept on this device. Every sound in the game reads its
// final level from here (sfxLevel / musicLevel), so a slider moved in the menu takes effect at once, even on the music that is playing.
import { useSyncExternalStore } from 'react';

export type AudioSettings = { master: number; music: number; effects: number; muted: boolean };   // 0..1 each (slider positions)
const KEY = 'pow.audio';
const clamp01 = (v: unknown, d: number) => (typeof v === 'number' && isFinite(v) ? Math.min(1, Math.max(0, v)) : d);
const load = (): AudioSettings => {
  try {
    const r = JSON.parse(localStorage.getItem(KEY) || '{}');
    return { master: clamp01(r.master, 1), music: clamp01(r.music, 1), effects: clamp01(r.effects, 1), muted: r.muted === true };
  } catch { return { master: 1, music: 1, effects: 1, muted: false }; }
};
let state: AudioSettings = load();
const listeners = new Set<() => void>();
export const getAudioSettings = () => state;
export const subscribeAudio = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
export const setAudioSettings = (patch: Partial<AudioSettings>) => {
  state = { ...state, ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage is optional */ }
  listeners.forEach(l => l());
};
export const useAudioSettings = (): AudioSettings => useSyncExternalStore(subscribeAudio, getAudioSettings, getAudioSettings);

// A slider position becomes a gain on a curve (position²): half way on the bar sounds about half as loud, not three quarters.
const curve = (v: number) => v * v;
export const sfxLevel = () => (state.muted ? 0 : curve(state.master) * curve(state.effects));
export const musicLevel = () => (state.muted ? 0 : curve(state.master) * curve(state.music));
// The duel track at slider 100%: 60% of the level it first shipped at (0.19).
export const MUSIC_BASE_GAIN = 0.114;
