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

// Same as playSfx but started `when` seconds from now (and optionally at another speed): the combat effects schedule their sounds
// ahead, so the boom lands on the frame the picture does.
export const playSfxAt = (url: string, when = 0, volume = 1, rate = 1) => {
  const c = getCtx();
  const buf = buffers.get(url);
  if (!c || !buf) {
    preloadSfx(url);
    window.setTimeout(() => { const audio = new Audio(url); audio.volume = Math.min(1, volume * sfxLevel()); audio.playbackRate = rate; audio.play().catch(() => {}); }, Math.max(0, when) * 1000);
    return;
  }
  if (c.state === 'suspended') c.resume().catch(() => {});
  const src = c.createBufferSource(); src.buffer = buf; src.playbackRate.value = rate;
  const g = c.createGain(); g.gain.value = volume * sfxLevel();
  src.connect(g).connect(c.destination);
  src.start(c.currentTime + Math.max(0, when));
};

// A synthesized "whoosh" (filtered noise sweeping from f0 to f1): the passing of an arrow, a boulder, a weapon being raised.
export const playWhoosh = (when: number, dur: number, vol = .5, f0 = 400, f1 = 1800) => {
  const c = getCtx();
  const level = sfxLevel();
  if (!c || level <= 0) return;
  if (c.state === 'suspended') c.resume().catch(() => {});
  const n = Math.ceil(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource(); s.buffer = b;
  const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2;
  const t = c.currentTime + Math.max(0, when);
  f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = c.createGain(); const v = Math.max(0.0002, vol * level);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + dur * .55); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(c.destination); s.start(t);
};

// A bell-like "ding" (a coin): a sine with two partials that dies away fast. `f` is the pitch of the first partial.
export const playDing = (when = 0, vol = .22, f = 1760) => {
  const c = getCtx();
  const level = sfxLevel();
  if (!c || level <= 0) return;
  if (c.state === 'suspended') c.resume().catch(() => {});
  const t = c.currentTime + Math.max(0, when);
  ([[1, 1], [2.76, .45], [5.4, .22]] as const).forEach(([m, a]) => {
    const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = f * m;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(Math.max(0.0002, vol * a * level), t + .004); g.gain.exponentialRampToValueAtTime(0.0001, t + .55);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + .6);
  });
};
