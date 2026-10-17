import { useEffect, useRef, useState } from 'react';
import villaImage from './assets/menu-vila.webp';
import iconDesafios from './assets/ui-icon-desafios.webp';
import iconOnline from './assets/ui-icon-online.webp';
import iconCard from './assets/ui-icon-card.webp';
import iconDeck from './assets/ui-icon-editar-deck.webp';
import iconLoja from './assets/ui-icon-loja.webp';
import iconCoroa from './assets/ui-icon-coroa.webp';
import iconTutoriais from './assets/ui-icon-tutoriais.webp';

// Menu inicial em vila (docs/menu-vila.md): a arte 704x1520 com prédios tocáveis e animação por código (fumaça, brasas, brilhos).
// Coordenadas em px da imagem; o palco escala por "cover" (corta as bordas, os prédios ficam na faixa central).
const IW = 704, IH = 1520;
export type VillageId = 'academia' | 'biblioteca' | 'forja' | 'mercado' | 'missoes' | 'arena' | 'quartel';
const BUILDINGS: { id: VillageId; name: string; x: number; y: number; icon: string }[] = [
  { id: 'academia', name: 'Academia', x: 90, y: 470, icon: iconTutoriais },
  { id: 'biblioteca', name: 'Biblioteca', x: 130, y: 700, icon: iconCard },
  { id: 'forja', name: 'Forja', x: 340, y: 640, icon: iconDeck },
  { id: 'mercado', name: 'Mercado', x: 570, y: 590, icon: iconLoja },
  { id: 'missoes', name: 'Missões', x: 560, y: 830, icon: iconCoroa },
  { id: 'arena', name: 'Arena', x: 140, y: 990, icon: iconOnline },
  { id: 'quartel', name: 'Quartel', x: 510, y: 1110, icon: iconDesafios },
];
const GLOWS: [number, number, number, string][] = [[410, 688, 120, '#ff8a2a'], [275, 775, 36, '#ffa040'], [463, 825, 36, '#ffa040'], [220, 520, 30, '#ffa040'], [520, 460, 28, '#ffa040'], [275, 1055, 36, '#ffa040'], [182, 1100, 36, '#ffa040'], [383, 1140, 36, '#ffa040'], [108, 665, 44, '#ffc060'], [165, 665, 44, '#ffc060'], [70, 420, 90, '#ff6a1a'], [440, 570, 34, '#ffc060'], [540, 545, 34, '#ffc060'], [630, 607, 34, '#ffc060'], [200, 1065, 46, '#ff9a40']];
const SOURCES: [number, number, 'smoke' | 'ember', number][] = [[388, 548, 'smoke', .35], [150, 330, 'smoke', .5], [690, 230, 'smoke', .25], [330, 470, 'smoke', .15], [70, 420, 'ember', .5], [410, 680, 'ember', .6], [600, 520, 'ember', .15], [300, 300, 'ember', .2]];
type Particle = { t: 'smoke' | 'ember'; x: number; y: number; vx: number; vy: number; l: number; m: number; r: number };

export const VillageScene = ({ onPick, badges }: { onPick: (id: VillageId) => void; badges?: Partial<Record<VillageId, number | string>> }) => {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState({ s: 1, ox: 0, oy: 0 });
  const [pressed, setPressed] = useState<VillageId | null>(null);

  useEffect(() => {
    const fit = () => { const el = box.current; if (!el) return; const w = el.clientWidth, h = el.clientHeight, s = Math.max(w / IW, h / IH); setView({ s, ox: (w - IW * s) / 2, oy: (h - IH * s) / 2 }); };
    fit();
    const ro = new ResizeObserver(fit);
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const c = cv.current?.getContext('2d'); if (!c) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const P: Particle[] = []; let raf = 0;
    const loop = () => {
      c.clearRect(0, 0, IW, IH);
      for (const [x, y, t, r] of SOURCES) if (Math.random() < r * .3) P.push(t === 'smoke' ? { t, x: x + Math.random() * 16 - 8, y, vx: .25 + Math.random() * .3, vy: -.5 - Math.random() * .3, l: 0, m: 200, r: 10 } : { t, x: x + Math.random() * 40 - 20, y: y - 10, vx: Math.random() - .3, vy: -.8 - Math.random() * 1.2, l: 0, m: 110, r: 2 });
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i]; p.l++; p.x += p.vx + (p.t === 'ember' ? Math.sin(p.l / 9) * .5 : 0); p.y += p.vy;
        const k = p.l / p.m; if (k >= 1) { P.splice(i, 1); continue; }
        if (p.t === 'smoke') { c.globalCompositeOperation = 'source-over'; const r = p.r + k * 46, g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, r); g.addColorStop(0, `rgba(50,45,58,${.34 * (1 - k)})`); g.addColorStop(1, 'rgba(50,45,58,0)'); c.fillStyle = g; c.fillRect(p.x - r, p.y - r, r * 2, r * 2); }
        else { c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,${150 + Math.random() * 60 | 0},60,${1 - k})`; c.beginPath(); c.arc(p.x, p.y, p.r * (1 - k * .5), 0, 7); c.fill(); }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={box} className="absolute inset-0 z-0 overflow-hidden select-none">
      <style>{`@keyframes vilaGlow{0%{opacity:.55;scale:.9}100%{opacity:1;scale:1.12}}@keyframes vilaBadge{50%{transform:scale(1.18)}}`}</style>
      <div className="absolute left-0 top-0" style={{ width: IW, height: IH, transformOrigin: '0 0', transform: `translate(${view.ox}px,${view.oy}px) scale(${view.s})`, backgroundImage: `url(${villaImage})`, backgroundSize: '100% 100%' }}>
        {GLOWS.map(([x, y, r, col], i) => (
          <div key={i} className="absolute pointer-events-none" style={{ left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', mixBlendMode: 'screen', background: `radial-gradient(${col}cc,${col}00 70%)`, animation: `vilaGlow ${.9 + (i % 4) * .25}s ${-(i * .37) % 1.3}s infinite alternate ease-in-out` }} />
        ))}
        <canvas ref={cv} width={IW} height={IH} className="absolute inset-0 pointer-events-none" />
      </div>
      {BUILDINGS.map(b => {
        const half = (46 + b.name.length * 11) / 2 + 8, W = box.current?.clientWidth ?? 390, left = Math.min(Math.max(view.ox + b.x * view.s, half), W - half), top = view.oy + b.y * view.s, bd = badges?.[b.id];
        return (
          <button key={b.id} type="button" aria-label={b.name}
            onPointerDown={() => setPressed(b.id)} onPointerUp={() => setPressed(null)} onPointerLeave={() => setPressed(null)} onPointerCancel={() => setPressed(null)}
            onClick={() => onPick(b.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-transparent border-0 p-0 text-[#f4e3b5]"
            style={{ left, top, width: 120 * view.s + 40, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
            <span className="block w-full" style={{ height: 100 * view.s + 10, borderRadius: 18, background: pressed === b.id ? 'rgba(255,211,106,.28)' : 'transparent', boxShadow: pressed === b.id ? '0 0 22px 6px rgba(255,190,80,.55)' : 'none', transition: 'all .12s' }} />
            <span className="relative mt-1 flex items-center" style={{ transform: pressed === b.id ? 'scale(.94)' : 'scale(1)', transition: 'transform .1s', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,.85))' }}>
              <span className="relative z-10 -mr-3 flex h-[34px] w-[34px] items-center justify-center rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%,#ffe9a8,#d4a23a 55%,#7a4e10)', border: '2px solid #fff1b8', boxShadow: 'inset 0 0 0 2px #5b3a0c, 0 0 8px rgba(255,200,90,.7)' }}>
                <img src={b.icon} alt="" draggable={false} className="h-[22px] w-[22px] object-contain" />
              </span>
              <span className="rounded-r-full py-[3px] pl-5 pr-3.5 text-[13px] font-extrabold uppercase tracking-[0.1em]" style={{ fontFamily: "'Cinzel', Georgia, serif", background: 'linear-gradient(#4a2f17,#1f1209)', border: '2px solid #d9b25a', borderLeft: 'none', boxShadow: 'inset 0 1px 0 rgba(255,235,170,.45), inset 0 -2px 4px rgba(0,0,0,.6)', color: '#ffe9ad', textShadow: '0 1px 0 #3a2208, 0 0 6px rgba(255,190,70,.55)' }}>{b.name}</span>
            </span>
            {bd ? <i className="absolute -top-1 right-1 min-w-[22px] h-[22px] rounded-full border-2 border-white bg-[#d12b2b] text-white text-[12px] font-bold not-italic leading-[18px] text-center" style={{ animation: 'vilaBadge 1.6s infinite' }}>{bd}</i> : null}
          </button>
        );
      })}
    </div>
  );
};
