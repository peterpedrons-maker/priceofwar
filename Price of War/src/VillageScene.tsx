import { useEffect, useRef, useState } from 'react';
import villaImage from './assets/menu-vila.webp';
import iDesafios from './assets/ui-icon-desafios.webp';
import iOnline from './assets/ui-icon-online.webp';
import iCard from './assets/ui-icon-card.webp';
import iDeck from './assets/ui-icon-editar-deck.webp';
import iLoja from './assets/ui-icon-loja.webp';
import iCoroa from './assets/ui-icon-coroa.webp';
import iTut from './assets/ui-icon-tutoriais.webp';
import iRank from './assets/ui-icon-ranking.webp';
import spr_rider_a from './assets/vila/spr-rider_a.png';
import spr_p_azul from './assets/vila/spr-p_azul.png';
import spr_p_capuz from './assets/vila/spr-p_capuz.png';
import spr_p_ferreiro from './assets/vila/spr-p_ferreiro.png';
import spr_p_guarda from './assets/vila/spr-p_guarda.png';
const ICONS: Record<string, string> = { castelo: iDesafios, academia: iTut, biblioteca: iCard, forja: iDeck, mercado: iLoja, missoes: iCoroa, arena: iOnline, quartel: iRank };

// Menu inicial em vila (docs/menu-vila.md): a arte 704x1520 com prédios tocáveis e animação por código (fumaça, brasas, brilhos).
// Coordenadas em px da imagem; o palco escala por "cover" (corta as bordas, os prédios ficam na faixa central).
const IW = 704, IH = 1520;
export type VillageId = 'castelo' | 'academia' | 'biblioteca' | 'forja' | 'mercado' | 'missoes' | 'arena' | 'quartel';
// x,y,w,h = área tocável (centro e tamanho, em px da imagem); lx,ly = onde fica o nome (só texto), sempre na base ou ao lado do prédio, em chão calmo, sem cobrir a construção (cada um ajustado à mão).
// Nomes pela função, para o jogo se explicar sozinho.
const BUILDINGS: { id: VillageId; name: string; x: number; y: number; w: number; h: number; lx: number; ly: number }[] = [
  { id: 'castelo', name: 'Desafios', x: 545, y: 285, w: 300, h: 180, lx: 300, ly: 380 },
  { id: 'academia', name: 'Tutoriais', x: 85, y: 450, w: 170, h: 130, lx: 95, ly: 352 },
  { id: 'biblioteca', name: 'Coleção', x: 135, y: 690, w: 150, h: 300, lx: 255, ly: 858 },
  { id: 'forja', name: 'Meu Deck', x: 340, y: 650, w: 190, h: 210, lx: 405, ly: 822 },
  { id: 'mercado', name: 'Loja', x: 570, y: 610, w: 270, h: 170, lx: 620, ly: 480 },
  { id: 'missoes', name: 'Missões', x: 580, y: 820, w: 200, h: 170, lx: 600, ly: 935 },
  { id: 'arena', name: 'Online', x: 140, y: 990, w: 290, h: 260, lx: 175, ly: 1190 },
  { id: 'quartel', name: 'Ranking', x: 555, y: 1125, w: 300, h: 320, lx: 560, ly: 1320 },
];
const GLOWS: [number, number, number, string][] = [[410, 688, 120, '#ff8a2a'], [275, 775, 36, '#ffa040'], [463, 825, 36, '#ffa040'], [220, 520, 30, '#ffa040'], [520, 460, 28, '#ffa040'], [275, 1055, 36, '#ffa040'], [182, 1100, 36, '#ffa040'], [383, 1140, 36, '#ffa040'], [108, 665, 44, '#ffc060'], [165, 665, 44, '#ffc060'], [70, 420, 90, '#ff6a1a'], [440, 570, 34, '#ffc060'], [540, 545, 34, '#ffc060'], [630, 607, 34, '#ffc060'], [200, 1065, 46, '#ff9a40']];
const SOURCES: [number, number, 'smoke' | 'ember', number][] = [[388, 548, 'smoke', .35], [150, 330, 'smoke', .5], [690, 230, 'smoke', .25], [330, 470, 'smoke', .15], [70, 420, 'ember', .5], [410, 680, 'ember', .6], [600, 520, 'ember', .15], [300, 300, 'ember', .2]];
// Figuras pintadas da vila recortadas da própria arte (tools/vila): ficam paradas no ponto do pé (x,y na imagem) e só respiram. `menu-vila.webp` já vem sem elas.
const SPR_META: Record<string, { w: number; h: number; fx: number; fy: number; x: number; y: number }> = {"rider_a": {"w": 72, "h": 82, "fx": 36.0, "fy": 80.0, "x": 74.0, "y": 1224.0}, "p_azul": {"w": 25, "h": 51, "fx": 12.5, "fy": 49.0, "x": 240.5, "y": 851.0}, "p_capuz": {"w": 27, "h": 62, "fx": 13.5, "fy": 60.0, "x": 490.5, "y": 902.0}, "p_ferreiro": {"w": 28, "h": 57, "fx": 14.0, "fy": 55.0, "x": 436.0, "y": 1286.0}, "p_guarda": {"w": 20, "h": 40, "fx": 10.0, "fy": 38.0, "x": 448.0, "y": 713.0}};
const SPR_SRC: Record<string, string> = { rider_a: spr_rider_a, p_azul: spr_p_azul, p_capuz: spr_p_capuz, p_ferreiro: spr_p_ferreiro, p_guarda: spr_p_guarda };
type Particle = { t: 'smoke' | 'ember'; x: number; y: number; vx: number; vy: number; l: number; m: number; r: number };

export const VillageScene = ({ onPick, badges }: { onPick: (id: VillageId) => void; badges?: Partial<Record<VillageId, number | string>> }) => {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const life = useRef<HTMLCanvasElement>(null);
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


  // Nuvens escuras atravessando o céu e as figuras pintadas respirando (movimento mínimo, fases próprias). Com "reduzir movimento" desenha um quadro só (as figuras precisam aparecer).
  useEffect(() => {
    const c = life.current?.getContext('2d'); if (!c) return;
    const reduced = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const imgs: Record<string, HTMLImageElement> = {};
    const idle = Object.keys(SPR_META).map((k, i) => { const im = new Image(); im.src = SPR_SRC[k]; imgs[k] = im; const rider = k.startsWith('rider'); return { k, ph: i * 1.9 + .7, rider, tilt: rider ? .014 : .025, breath: rider ? .03 : .045, rate: rider ? 1.1 : 1.5 + i * .12 }; });
    const clouds = Array.from({ length: 7 }, (_, i) => ({ x: Math.random() * 900 - 100, y: 40 + i * 52 + Math.random() * 30, w: 200 + Math.random() * 180, h: 34 + Math.random() * 26, v: .12 + Math.random() * .16, a: .22 + Math.random() * .16 }));
    const draw = (t: number) => {
      c.clearRect(0, 0, IW, IH);
      if (!reduced) for (const cl of clouds) {
        cl.x += cl.v; if (cl.x - cl.w > IW) cl.x = -cl.w;
        const fade = Math.max(0, 1 - Math.max(0, cl.y - 250) / 160);
        c.save(); c.translate(cl.x, cl.y); c.scale(1, cl.h / cl.w);
        for (const [dx, r, al] of [[-.35, .55, .7], [0, .7, 1], [.38, .5, .7]]) { const g = c.createRadialGradient(dx * cl.w, 0, 0, dx * cl.w, 0, r * cl.w); g.addColorStop(0, `rgba(38,30,52,${cl.a * al * fade})`); g.addColorStop(1, 'rgba(38,30,52,0)'); c.fillStyle = g; c.beginPath(); c.arc(dx * cl.w, 0, r * cl.w, 0, 7); c.fill(); }
        c.restore();
      }
      for (const a of idle) {
        const m = SPR_META[a.k], im = imgs[a.k]; if (!im.complete || !im.naturalWidth) continue;
        const w1 = reduced ? 0 : Math.sin(t * a.rate + a.ph), w2 = reduced ? 0 : Math.sin(t * a.rate * .43 + a.ph * 1.7);
        c.save(); c.translate(m.x + w2 * 1.4 * (a.rider ? .5 : 1), m.y);
        c.fillStyle = 'rgba(0,0,0,.26)'; c.beginPath(); c.ellipse(0, 0, m.w * .36, m.w * .085, 0, 0, 7); c.fill();
        c.rotate(a.tilt * w2); c.scale(1 - a.breath * w1 * .18, 1 + a.breath * w1 * .5); c.drawImage(im, -m.fx, -m.fy, m.w, m.h); c.restore();
      }
    };
    let raf = 0;
    if (reduced) { draw(0); const timers = [200, 800, 2000].map(ms => window.setTimeout(() => draw(0), ms)); return () => timers.forEach(clearTimeout); }
    const loop = (now: number) => { draw(now / 1000); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={box} className="absolute inset-0 z-0 overflow-hidden select-none">
      <style>{`@keyframes vilaGlow{0%{opacity:.55;scale:.9}100%{opacity:1;scale:1.12}}@keyframes vilaBadge{50%{transform:scale(1.18)}}`}</style>
      <div className="absolute left-0 top-0" style={{ width: IW, height: IH, transformOrigin: '0 0', transform: `translate(${view.ox}px,${view.oy}px) scale(${view.s})`, backgroundImage: `url(${villaImage})`, backgroundSize: '100% 100%' }}>
        {GLOWS.map(([x, y, r, col], i) => (
          <div key={i} className="absolute pointer-events-none" style={{ left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', mixBlendMode: 'screen', background: `radial-gradient(${col}cc,${col}00 70%)`, animation: `vilaGlow ${.9 + (i % 4) * .25}s ${-(i * .37) % 1.3}s infinite alternate ease-in-out` }} />
        ))}
        <canvas ref={life} width={IW} height={IH} className="absolute inset-0 pointer-events-none" />
        <canvas ref={cv} width={IW} height={IH} className="absolute inset-0 pointer-events-none" />
      </div>
      {BUILDINGS.map(b => {
        const W = box.current?.clientWidth ?? 390, half = b.name.length * 7.6 + 10;
        const cx = view.ox + b.x * view.s, cy = view.oy + b.y * view.s, bd = badges?.[b.id];
        const lx = Math.min(Math.max(view.ox + b.lx * view.s, half), W - half), ly = view.oy + b.ly * view.s, on = pressed === b.id;
        return (
          <button key={b.id} type="button" aria-label={b.name}
            onPointerDown={() => setPressed(b.id)} onPointerUp={() => setPressed(null)} onPointerLeave={() => setPressed(null)} onPointerCancel={() => setPressed(null)}
            onClick={() => onPick(b.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 bg-transparent border-0 p-0"
            style={{ left: cx, top: cy, width: b.w * view.s, height: b.h * view.s, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', borderRadius: 18, background: on ? 'rgba(255,211,106,.16)' : 'transparent', boxShadow: on ? '0 0 22px 4px rgba(255,190,80,.5)' : 'none', transition: 'all .12s' }}>
            <span className="absolute flex flex-col items-center pointer-events-none" style={{ left: lx - cx + b.w * view.s / 2, top: ly - cy + b.h * view.s / 2, transform: `translate(-50%,-50%) scale(${on ? 1.1 : 1})`, transition: 'transform .1s', filter: 'drop-shadow(0 1px 2px #000) drop-shadow(0 0 4px rgba(0,0,0,.8))' }}>
              <span className="relative flex items-center justify-center rounded-full" style={{ width: 26, height: 26, background: 'radial-gradient(circle at 35% 30%,#3a2a18,#120b06)', border: '1.5px solid #d9b25a', boxShadow: on ? '0 0 10px 2px rgba(255,200,90,.9)' : '0 0 0 1px #000' }}>
                <img src={ICONS[b.id]} alt="" draggable={false} className="h-[17px] w-[17px] object-contain" />
                {bd ? <i className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] rounded-full border border-white bg-[#d12b2b] text-white text-[10px] font-bold not-italic leading-[14px] text-center" style={{ animation: 'vilaBadge 1.6s infinite' }}>{bd}</i> : null}
              </span>
              <span className="mt-0.5 whitespace-nowrap font-extrabold text-white" style={{ fontFamily: "'Cinzel','PT Serif',serif", fontSize: b.id === 'castelo' ? 14 : 11.5, letterSpacing: '0.04em', textShadow: '0 1px 0 #000, 1px 0 0 #000, -1px 0 0 #000, 0 -1px 0 #000' }}>{b.name}</span>
              <span className="block h-px" style={{ width: '120%', minWidth: 56, background: 'linear-gradient(to right, transparent, #e8c766, transparent)' }} />
              <span className="block" style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid #e8c766' }} />
            </span>
          </button>
        );
      })}
    </div>
  );
};
