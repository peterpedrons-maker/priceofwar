// Som da recompensa de missão (sintetizado, afinado na Ré menor pentatônica como os outros sons do jogo): batida grave do selo + arpejo de sinos + moedas tilintando.
import { sfxLevel } from './audioSettings';
let ctx: AudioContext | null = null;
const ac = () => (ctx ??= new AudioContext());
const tone = (c: AudioContext, out: AudioNode, f: number, t0: number, dur: number, g: number, type: OscillatorType = 'sine', f2?: number) => {
  const o = c.createOscillator(), e = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
  e.gain.setValueAtTime(0.0001, t0); e.gain.exponentialRampToValueAtTime(g, t0 + 0.006); e.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(e).connect(out); o.start(t0); o.stop(t0 + dur + 0.05);
};
export const playRewardSfx = (big = false) => {
  try {
    const v = sfxLevel(); if (v <= 0) return;
    const c = ac(); if (c.state === 'suspended') void c.resume();
    const out = c.createGain(); out.gain.value = 0.5 * v; out.connect(c.destination);
    const t = c.currentTime + 0.01;
    tone(c, out, 120, t, 0.32, 0.9, 'sine', 42);                                   // batida do selo
    tone(c, out, 90, t, 0.12, 0.35, 'triangle', 50);
    const D = [587.33, 698.46, 880, 1174.66, 1396.91];                              // D5 F5 A5 D6 F6
    (big ? D : D.slice(0, 4)).forEach((f, i) => { tone(c, out, f, t + 0.12 + i * 0.075, 0.9, 0.22, 'sine'); tone(c, out, f * 2.01, t + 0.12 + i * 0.075, 0.45, 0.07, 'sine'); });
    for (let i = 0; i < (big ? 9 : 6); i++) tone(c, out, [2093, 2349, 2637, 3136][i % 4], t + 0.3 + i * 0.07 + Math.random() * 0.03, 0.22, 0.09, 'triangle');   // moedas
    if (big) { tone(c, out, 293.66, t + 0.5, 1.4, 0.18, 'sine'); tone(c, out, 440, t + 0.5, 1.4, 0.14, 'sine'); tone(c, out, 587.33, t + 0.5, 1.4, 0.12, 'sine'); }   // acorde final de Ré
  } catch { /* sem áudio */ }
  try { navigator.vibrate?.(big ? [30, 40, 60] : 25); } catch { /* sem vibração */ }
};
