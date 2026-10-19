// Música da vila (menu principal): "music-vila.mp3" (tools/audio/musica-vila.py), 90,8 s em laço sem emenda (AudioBufferSource com loop, como a música do duelo).
// Entra com fade quando o menu aparece e sai com fade quando uma partida começa. O nível segue os ajustes de som do jogador (Música) ao vivo.
import vilaUrl from './assets/music-vila.mp3';
import { MUSIC_BASE_GAIN, musicLevel, subscribeAudio } from './audioSettings';

let ctx: AudioContext | null = null;
let buffer: AudioBuffer | null = null;
let loading: Promise<void> | null = null;
let source: AudioBufferSourceNode | null = null;
let gain: GainNode | null = null;
let wanted = false;
let unsub: (() => void) | null = null;
const FADE_IN = 2.5, FADE_OUT = 0.8;

const level = () => MUSIC_BASE_GAIN * musicLevel() * 1.0;
const begin = () => {
  if (!wanted || source || !ctx || !buffer) return;
  if (ctx.state === 'suspended') return;
  source = ctx.createBufferSource(); source.buffer = buffer; source.loop = true;
  gain = ctx.createGain(); gain.gain.setValueAtTime(0, ctx.currentTime); gain.gain.linearRampToValueAtTime(level(), ctx.currentTime + FADE_IN);
  source.connect(gain).connect(ctx.destination); source.start();
  unsub = subscribeAudio(() => { if (gain && ctx) { gain.gain.cancelScheduledValues(ctx.currentTime); gain.gain.setValueAtTime(level(), ctx.currentTime); } });
};
const unlock = () => { if (ctx && ctx.state === 'suspended') ctx.resume().then(begin).catch(() => {}); };

export const startMenuMusic = () => {
  wanted = true;
  try {
    ctx = ctx ?? new AudioContext();
    if (ctx.state === 'suspended') {   // sem toque ainda (por exemplo, reabriu o jogo já logado): começa no primeiro toque
      ctx.resume().then(begin).catch(() => {});
      const once = () => { window.removeEventListener('pointerdown', once, true); unlock(); };
      window.addEventListener('pointerdown', once, true);
    }
    loading = loading ?? fetch(vilaUrl).then(r => r.arrayBuffer()).then(b => ctx!.decodeAudioData(b)).then(buf => { buffer = buf; });
    void loading.then(begin).catch(() => { loading = null; });
  } catch { /* sem WebAudio: o menu fica sem música */ }
};
export const stopMenuMusic = () => {
  wanted = false;
  if (unsub) { unsub(); unsub = null; }
  const s = source, g = gain, c = ctx; source = null; gain = null;
  if (!s || !g || !c) return;
  g.gain.cancelScheduledValues(c.currentTime); g.gain.setValueAtTime(g.gain.value, c.currentTime); g.gain.linearRampToValueAtTime(0, c.currentTime + FADE_OUT);
  window.setTimeout(() => { try { s.stop(); } catch { /* já parou */ } }, FADE_OUT * 1000 + 100);
};
export const menuMusicState = () => ({ wanted, playing: !!source, gain: gain ? Number(gain.gain.value.toFixed(3)) : null, ctx: ctx?.state ?? null });
