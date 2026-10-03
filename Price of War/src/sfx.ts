// Low-latency one-shot sounds. The effect sounds are tied to animations (the blow, the burn, the card's glow), so they have to
// start on the frame the picture does: each file is decoded once into an AudioBuffer (preloadSfx, at the start of a match)
// and started on the audio clock; an <audio> element would add a variable delay on every play. Falls back to <audio> until the
// buffer has loaded.
import { sfxLevel } from './audioSettings';
let ctx: AudioContext | null = null;
const buffers = new Map<string, AudioBuffer>();
const loading = new Set<string>();

const debugOn = () => typeof window !== 'undefined' && window.location.search.includes('debug');
// ?debug only: a log of (name, ms) so a test can compare when a sound started with when its picture did.
export const dbgMark = (name: string) => { if (debugOn()) ((window as any).__sfxLog ||= []).push([name, Math.round(performance.now() * 10) / 10]); };

const getCtx = (): AudioContext | null => {
  try { return ctx ?? (ctx = new AudioContext()); } catch { return null; }
};
export const preloadSfx = (url: string) => {
  const c = getCtx();
  if (!c) return;
  if (c.state === 'suspended') c.resume().catch(() => {});
  if (buffers.has(url) || loading.has(url)) return;
  loading.add(url);
  fetch(url).then(r => r.arrayBuffer()).then(b => c.decodeAudioData(b)).then(buf => { buffers.set(url, buf); }).catch(() => {}).finally(() => loading.delete(url));
};
export const playSfx = (url: string, volume = 1, mark?: string) => {
  const c = getCtx();
  const buf = buffers.get(url);
  if (!c || !buf) {
    preloadSfx(url);
    const audio = new Audio(url); audio.volume = Math.min(1, volume * sfxLevel()); audio.play().catch(() => {});
    if (mark) dbgMark(mark + ' (fallback)');
    return;
  }
  if (c.state === 'suspended') c.resume().catch(() => {});
  const src = c.createBufferSource(); src.buffer = buf;
  const g = c.createGain(); g.gain.value = volume * sfxLevel();
  src.connect(g).connect(c.destination);
  src.start();
  if (mark) dbgMark(mark);
};
