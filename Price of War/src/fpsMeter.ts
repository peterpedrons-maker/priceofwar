// Medidor de quadros por segundo (Opções > "Mostrar FPS"; desligado por padrão): um selinho pequeno no canto superior direito, que não captura toques.
// Mostra o FPS médio do último segundo e o pior quadro (ms). Só roda o laço enquanto está ligado.
import { getGameSettings, subscribeSettings } from './gameSettings';

let el: HTMLDivElement | null = null, raf = 0, last = 0, acc = 0, frames = 0, worst = 0;
const tick = (ts: number) => {
  if (!el) return;
  if (last) { const d = ts - last; acc += d; frames++; if (d > worst) worst = d; }
  last = ts;
  if (acc >= 1000) { const fps = Math.round(frames * 1000 / acc); el.textContent = `${fps} fps · ${Math.round(worst)} ms`; el.style.color = fps >= 50 ? '#8fe3a0' : fps >= 30 ? '#ffd166' : '#ff7b6b'; acc = 0; frames = 0; worst = 0; }
  raf = requestAnimationFrame(tick);
};
const sync = () => {
  const on = getGameSettings().showFps;
  if (on && !el) { el = document.createElement('div'); el.style.cssText = 'position:fixed;top:calc(env(safe-area-inset-top,0px) + 4px);right:6px;z-index:99999;pointer-events:none;font:600 10px/1 ui-monospace,monospace;padding:3px 5px;border-radius:4px;background:rgba(0,0,0,.55);color:#8fe3a0;letter-spacing:.02em'; el.textContent = '… fps'; document.body.appendChild(el); last = 0; acc = frames = worst = 0; raf = requestAnimationFrame(tick); }
  else if (!on && el) { cancelAnimationFrame(raf); el.remove(); el = null; }
};
export const initFpsMeter = () => { if (typeof document === 'undefined') return; subscribeSettings(sync); sync(); };
