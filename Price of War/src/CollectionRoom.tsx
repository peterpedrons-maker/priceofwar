// The Sala de Coleção: one painted room (a single image) with things to tap. Each one zooms the camera into it and opens what it stands for:
// the book (the whole collection, in a binder with clear plastic sheets over the pages), the door (the shop), the war table (the deck editor).
// The room is drawn on a 768 x 1376 stage that is fitted to the screen's height; dragging (or tilting the phone) looks around a little.
import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties, type MutableRefObject, type PointerEvent as RPointerEvent, type RefObject } from 'react';
import { CARD_DEFS } from './engine/catalog';
import { cardSlug } from './card3d';
import roomImage from './assets/room-collection.webp';
import coverImage from './assets/room-book-cover.webp';
import pageImage from './assets/room-book-page.webp';
import insideImage from './assets/room-book-inside.webp';

const CardViewer3D = lazy(() => import('./CardViewer3D'));
const THUMBS = import.meta.glob('./assets/card-thumb/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const thumbOf = (name: string): string | undefined => THUMBS[`./assets/card-thumb/${cardSlug(name)}.webp`];

const SW = 768, SH = 1376;                         // the stage (the room image's own size)
const PER = 9;                                     // cards on a page (3 x 3)
const BOOK_W = 330, BOOK_H = 464;                  // the open book on screen, in css px
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
const GOLD = '#e8c46a';

// Things to tap, in stage coordinates (measured off the room image).
const SPOTS = {
  book: { x: 66, y: 436, w: 196, h: 252, cx: 160, cy: 556, zoom: 2.35, label: 'COLEÇÃO', lx: 196, ly: 744 },
  door: { x: 506, y: 336, w: 262, h: 566, cx: 640, cy: 640, zoom: 2.0, label: 'LOJA', lx: 642, ly: 384 },
  deck: { x: 428, y: 1166, w: 340, h: 210, cx: 600, cy: 1270, zoom: 2.2, label: 'MEU DECK', lx: 580, ly: 1318 },
} as const;
type SpotKey = keyof typeof SPOTS;

type Entry = { name: string; type: string; full: boolean };

export default function CollectionRoom({ onClose, onOpenShop, onOpenDeck, overlayOpen }: { onClose: () => void; onOpenShop: () => void; onOpenDeck: () => void; overlayOpen: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);
  const busy = useRef(false);
  const drag = useRef<{ x: number; y: number; bx: number; by: number } | null>(null);
  const moved = useRef(0);
  const pan = useRef({ tx: 0, ty: 0, x: 0, y: 0 });
  const [bookState, setBookState] = useState<'closed' | 'opening' | 'open'>('closed');
  const [hint, setHint] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [zoomClass, setZoomClass] = useState(false);

  const entries: Entry[] = useMemo(() => CARD_DEFS.map(d => ({ name: d.name, type: d.cardType, full: !!d.isFullArt })), []);

  // ── fit the stage to the screen's height ──
  useEffect(() => {
    const fit = () => { const root = rootRef.current, el = fitRef.current; if (!root || !el) return; const s = root.clientHeight / SH; el.style.transform = `translate(-50%,-50%) scale(${s})`; };
    fit(); window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit);
  }, []);

  // ── looking around: dragging or tilting the phone shifts the room a little, with its own easing ──
  useEffect(() => {
    let raf = 0; const t0 = performance.now(); let tilt = false;
    const onTilt = (e: DeviceOrientationEvent) => { if (drag.current || e.gamma == null) return; tilt = true; pan.current.tx = clamp((e.gamma || 0) / 22, -1, 1); pan.current.ty = clamp(((e.beta || 50) - 50) / 70, -1, 1); };
    window.addEventListener('deviceorientation', onTilt);
    const loop = (now: number) => {
      const t = (now - t0) / 1000, P = pan.current;
      if (!drag.current && !tilt) { P.tx *= 0.985; P.ty *= 0.985; }
      P.x += (P.tx - P.x) * 0.09; P.y += (P.ty - P.y) * 0.09;
      if (panRef.current) panRef.current.style.transform = `translate3d(${(-(P.x + Math.sin(t * 0.35) * 0.05) * 64).toFixed(2)}px, ${(-(P.y + Math.cos(t * 0.3) * 0.03) * 30).toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('deviceorientation', onTilt); };
  }, []);
  const onDown = (e: RPointerEvent) => { if (busy.current || (e.target as HTMLElement).closest('[data-ui]')) return; drag.current = { x: e.clientX, y: e.clientY, bx: pan.current.tx, by: pan.current.ty }; moved.current = 0; };
  const onMove = (e: RPointerEvent) => {
    const d = drag.current; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y; moved.current = Math.max(moved.current, Math.hypot(dx, dy));
    pan.current.tx = clamp(d.bx - dx / 120, -1, 1); pan.current.ty = clamp(d.by - dy / 260, -1, 1); if (moved.current > 8) setHint(false);
  };
  const onUp = () => { drag.current = null; };

  // ── dust drifting in the light ──
  useEffect(() => {
    const cv = dustRef.current, root = rootRef.current; if (!cv || !root) return; const cx = cv.getContext('2d'); if (!cx) return;
    const size = () => { cv.width = root.clientWidth; cv.height = root.clientHeight; };
    size(); window.addEventListener('resize', size);
    const motes = Array.from({ length: 34 }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.5, s: 0.00008 + Math.random() * 0.00018, p: Math.random() * 6 }));
    let raf = 0; const t0 = performance.now();
    const loop = (now: number) => {
      const t = (now - t0) / 1000; cx.clearRect(0, 0, cv.width, cv.height);
      motes.forEach(m => { m.y -= m.s * 16; m.x += Math.sin(t * 0.6 + m.p) * 0.00035; if (m.y < -0.01) { m.y = 1.01; m.x = Math.random(); } cx.globalAlpha = 0.18 + 0.3 * Math.sin(t * 1.3 + m.p) ** 2; cx.fillStyle = '#ffe3a8'; cx.beginPath(); cx.arc(m.x * cv.width, m.y * cv.height, m.r, 0, 7); cx.fill(); });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size); };
  }, []);

  const say = (m: string) => { setToast(m); setTimeout(() => setToast(null), 1900); };

  // ── camera: push into a spot, and back out ──
  const camTo = (k: SpotKey | null) => {
    const el = stageRef.current, root = rootRef.current; if (!el || !root) return;
    if (!k) { el.style.transform = ''; el.style.filter = ''; return; }
    const sp = SPOTS[k], Z = sp.zoom;
    // keep the camera inside the picture: the view never goes past an edge, so no black shows (a spot near the bottom is framed higher)
    const vw = (root.clientWidth * SH) / root.clientHeight, hx = vw / (2 * Z), hy = SH / (2 * Z);
    const cx = vw >= SW ? SW / 2 : clamp(sp.cx, hx, SW - hx), cy = clamp(sp.cy, hy, SH - hy);
    el.style.transformOrigin = `${cx}px ${cy}px`; el.style.transform = `translate(${SW / 2 - cx}px, ${SH / 2 - cy}px) scale(${Z})`; el.style.filter = k === 'deck' ? 'brightness(.5)' : 'brightness(.82)';
  };
  const wasOverlay = useRef(false);
  useEffect(() => {
    if (overlayOpen) { wasOverlay.current = true; return; }
    if (wasOverlay.current) { wasOverlay.current = false; camTo(null); setZoomClass(false); busy.current = false; }   // coming back from the shop / deck editor: the camera pulls back
  }, [overlayOpen]);

  const tap = (k: SpotKey) => async () => {
    if (moved.current > 8 || busy.current) return;
    busy.current = true; pan.current.tx = 0; pan.current.ty = 0; setZoomClass(true); camTo(k); await wait(520);
    if (k === 'book') { setBookState('opening'); return; }
    if (k === 'door') onOpenShop(); else onOpenDeck();
    // busy stays true until the screen opened over the room closes (see the overlayOpen effect)
  };
  const closeBook = async () => {
    setBookState('closed'); await wait(700); camTo(null); await wait(620); setZoomClass(false); busy.current = false;
  };

  const flame = (x: number, y: number, r: number, d = 0): CSSProperties => ({ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,190,90,.55), rgba(255,150,50,.18) 55%, transparent 75%)', mixBlendMode: 'screen', animation: `roomflick ${1.3 + d}s ease-in-out infinite`, animationDelay: `${-d * 2}s`, pointerEvents: 'none' });

  return (
    <div ref={rootRef} className="fixed inset-0 overflow-hidden select-none" style={{ zIndex: 250, background: '#0d0905', touchAction: 'none' }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <style>{`
        @keyframes roomflick { 0%,100% { opacity:.55; transform:scale(.94);} 35% { opacity:1; transform:scale(1.05);} 65% { opacity:.7; transform:scale(.98);} }
        @keyframes roompulse { 0%,100% { opacity:.25; transform:scale(.94);} 50% { opacity:.85; transform:scale(1.05);} }
        .room-plaque { position:absolute; transform:translate(-50%,-50%); white-space:nowrap; font-family:'Cinzel',serif; font-weight:700; letter-spacing:.12em; font-size:17px; padding:6px 14px 4px; border-radius:9px; color:#ffe9b0;
          background:linear-gradient(#6d4523,#3b2311); border:2px solid #d9b25a; box-shadow:0 3px 9px rgba(0,0,0,.65), inset 0 2px 0 rgba(255,235,170,.35); text-shadow:0 1px 1px #000; pointer-events:none; transition:opacity .25s; }
        .room-plaque i { font-style:normal; margin-left:8px; font-size:15px; background:linear-gradient(#f6d77a,#b5842a); color:#2a1606; padding:1px 9px; border-radius:12px; text-shadow:none; }
        .room-zoomed .room-plaque, .room-zoomed .room-glow { opacity:0 !important; animation:none; }
        .room-glow { position:absolute; border-radius:46%; background:radial-gradient(closest-side, rgba(255,214,120,.5), rgba(255,190,80,.15) 60%, transparent 78%); mix-blend-mode:screen; animation:roompulse 2.6s ease-in-out infinite; pointer-events:none; transition:opacity .25s; }
        .room-chip { border:1px solid rgba(217,178,90,.55); background:rgba(14,10,6,.62); color:#ffe9b0; border-radius:10px; padding:7px 12px; font-family:'Cinzel',serif; font-size:11px; letter-spacing:.1em; font-weight:700; backdrop-filter:blur(4px); }
      `}</style>

      <div ref={fitRef} className={zoomClass ? 'room-zoomed' : ''} style={{ position: 'absolute', left: '50%', top: '50%', width: SW, height: SH, transformOrigin: 'center' }}>
        <div ref={panRef} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
          <div ref={stageRef} style={{ position: 'absolute', inset: 0, transition: 'transform .62s cubic-bezier(.55,0,.25,1), filter .62s', willChange: 'transform' }}>
            <img src={roomImage} alt="" draggable={false} style={{ position: 'absolute', left: 0, top: 0, width: SW, height: SH, display: 'block' }} />
            {/* light that moves: the torches, the lantern, the candles */}
            <div style={flame(235, 190, 64)} /><div style={flame(538, 196, 64, 0.2)} /><div style={flame(610, 545, 70, 0.4)} /><div style={flame(316, 548, 46, 0.1)} /><div style={flame(745, 1205, 48, 0.3)} />
            {/* what can be tapped */}
            {(Object.keys(SPOTS) as SpotKey[]).map(k => {
              const s = SPOTS[k];
              return (
                <div key={k}>
                  <div className="room-glow" style={{ left: s.x, top: s.y, width: s.w, height: s.h }} />
                  <button data-spot={k} aria-label={s.label} onClick={tap(k)} style={{ position: 'absolute', left: s.x, top: s.y, width: s.w, height: s.h, background: 'none', border: 0, padding: 0 }} />
                  <div className="room-plaque" style={{ left: s.lx, top: s.ly }}>{s.label}{k === 'book' && <i>{entries.length}/{entries.length}</i>}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <canvas ref={dustRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', mixBlendMode: 'screen' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 46%, transparent 40%, rgba(0,0,0,.5) 100%)' }} />

      <div data-ui style={{ position: 'absolute', left: 0, right: 0, top: 0, padding: 'max(10px, env(safe-area-inset-top)) 12px 8px', display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'none' }}>
        <button className="room-chip" style={{ pointerEvents: 'auto' }} onClick={onClose}>‹ MENU</button>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.2em', color: '#ffe9b0', textShadow: '0 1px 3px #000' }}>SALA DE COLEÇÃO</div>
        <div className="room-chip" style={{ opacity: 0 }}>‹ MENU</div>
      </div>
      {hint && bookState === 'closed' && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 'max(10px, env(safe-area-inset-bottom))', textAlign: 'center', fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,233,176,.7)', textShadow: '0 1px 2px #000', pointerEvents: 'none' }}>ARRASTE PARA OLHAR EM VOLTA · TOQUE NOS OBJETOS</div>}
      {toast && <div style={{ position: 'absolute', left: '50%', top: 64, transform: 'translateX(-50%)', padding: '9px 14px', borderRadius: 10, background: 'rgba(14,10,6,.9)', border: '1px solid #d9b25a', color: '#ffe9b0', fontSize: 12, whiteSpace: 'nowrap' }}>{toast}</div>}

      {bookState !== 'closed' && <Binder entries={entries} opening={bookState === 'opening'} onOpened={() => setBookState('open')} onClose={closeBook} />}
    </div>
  );
}

// ───────────────────────────── the collection book ─────────────────────────────
function Binder({ entries, opening, onOpened, onClose }: { entries: Entry[]; opening: boolean; onOpened: () => void; onClose: () => void }) {
  const pages = Math.ceil(entries.length / PER);
  const rootRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const leafRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pos = useRef(0);
  const anim = useRef(0);
  const drag = useRef<{ x: number; base: number; moved: number; t: number; lx: number; v: number; target: EventTarget | null } | null>(null);
  const [page, setPage] = useState(0);
  const [ui, setUi] = useState(false);
  const [missing, setMissing] = useState(false);
  const MISSING = useMemo(() => new Set([4, 7, 13, 19, 22, 28, 33, 38, 41, 45]), []);
  const owned = (i: number) => !missing || !MISSING.has(i);
  const count = entries.filter((_, i) => owned(i)).length;

  const layout = () => {
    const p = pos.current, base = Math.floor(p + 1e-6), frac = p - base;
    leafRefs.current.forEach((leaf, i) => {
      if (!leaf) return;
      const a = clamp(p - i, 0, 1);
      leaf.style.transform = `rotateY(${(-180 * a).toFixed(2)}deg)`;
      leaf.style.zIndex = String(i < base ? i : i === base ? 100 : 60 - i);
      leaf.style.display = a >= 0.999 || i > base + 1 ? 'none' : '';
      const sh = shadeRefs.current[i]; if (sh) { let d = a > 0 ? 0.55 * Math.sin(a * Math.PI) : 0; if (i === base + 1 && frac > 0) d = 0.4 * (1 - frac); sh.style.opacity = d.toFixed(3); }
    });
    const pg = Math.round(p); setPage(pg);
  };
  const glide = (to: number, ms = 520) => new Promise<void>(res => {
    cancelAnimationFrame(anim.current); const from = pos.current, s = performance.now();
    const step = (n: number) => { const u = clamp((n - s) / ms, 0, 1), e = 1 - Math.pow(1 - u, 3); pos.current = from + (to - from) * e; layout(); if (u < 1) anim.current = requestAnimationFrame(step); else res(); };
    anim.current = requestAnimationFrame(step);
  });
  const go = (d: number) => glide(clamp(Math.round(pos.current) + d, 0, pages - 1));

  // the cover swings open on the spine, then the page is there
  const setCover = (v: number) => { const el = coverRef.current; if (!el) return; el.style.transform = `rotateY(${(-180 * v).toFixed(2)}deg)`; el.style.visibility = v >= 0.999 ? 'hidden' : 'visible'; };
  const tween = (fn: (v: number) => void, from: number, to: number, ms: number) => new Promise<void>(res => {
    const s = performance.now(); const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
    const step = (n: number) => { const u = clamp((n - s) / ms, 0, 1); fn(from + (to - from) * ease(u)); if (u < 1) requestAnimationFrame(step); else res(); };
    requestAnimationFrame(step);
  });
  useEffect(() => { layout(); }, [missing]);
  useEffect(() => {
    let dead = false;
    (async () => { if (opening) { setCover(0); await wait(200); if (dead) return; await tween(setCover, 0, 1, 950); if (dead) return; setUi(true); onOpened(); } })();
    return () => { dead = true; cancelAnimationFrame(anim.current); };
  }, []);
  const close = async () => { setUi(false); await glide(0, 300); setCover(1); if (coverRef.current) coverRef.current.style.visibility = 'visible'; await tween(setCover, 1, 0, 720); onClose(); };

  // ── turning pages with the finger ──
  const down = (e: RPointerEvent) => { if (!ui) return; cancelAnimationFrame(anim.current); drag.current = { x: e.clientX, base: pos.current, moved: 0, t: performance.now(), lx: e.clientX, v: 0, target: e.target }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); };
  const move = (e: RPointerEvent) => {
    const d = drag.current; if (!d) return; const dx = e.clientX - d.x; d.moved = Math.max(d.moved, Math.abs(dx));
    const now = performance.now(); d.v = (e.clientX - d.lx) / Math.max(1, now - d.t); d.lx = e.clientX; d.t = now;
    pos.current = clamp(d.base - dx / 300, 0, pages - 1); layout();
  };
  const up = () => {
    const d = drag.current; if (!d) return; drag.current = null;
    if (d.moved < 8) { pos.current = d.base; layout(); const pk = (d.target as HTMLElement | null)?.closest?.('[data-card]') as HTMLElement | null; if (pk) openCard(Number(pk.dataset.card), pk); return; }
    let to = Math.round(pos.current); if (Math.abs(d.v) > 0.45) to = d.v < 0 ? Math.floor(d.base) + 1 : Math.ceil(d.base) - 1;
    glide(clamp(to, 0, pages - 1), 420);
  };

  // ── a card taken out of the sheet: these plastic pages load from the top, so it slides UP out of its slot first, then comes forward over a
  //    darkened page, and the 3D viewer takes over. Closing runs the same way backwards (forward-to-slot, then down into the plastic). ──
  type Rect = { x: number; y: number; w: number; h: number };
  type Phase = 'start' | 'slide' | 'fly' | 'settled' | 'back1' | 'back2';
  const [lift, setLift] = useState<null | { i: number; src: string; from: Rect; to: Rect; phase: Phase }>(null);
  const [viewerReady, setViewerReady] = useState(false);
  const liftImg = useRef<HTMLImageElement | null>(null);
  const openCard = (i: number, pk: HTMLElement) => {
    if (lift) return; const img = pk.querySelector('img') as HTMLImageElement | null; if (!img) return;
    const r = img.getBoundingClientRect(), W = window.innerWidth, H = window.innerHeight, ar = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 0.7;
    const h = Math.min(H * 0.7, (W * 0.92) / ar), w = h * ar;
    liftImg.current = img; img.style.visibility = 'hidden'; setViewerReady(false);
    setLift({ i, src: img.src, from: { x: r.left, y: r.top, w: r.width, h: r.height }, to: { x: (W - w) / 2, y: (H - h) / 2 + H * 0.01, w, h }, phase: 'start' });
  };
  useEffect(() => {
    if (!lift) return;
    let dead = false; const later = (ms: number, fn: () => void) => { const t = setTimeout(() => { if (!dead) fn(); }, ms); return t; };
    if (lift.phase === 'start') { requestAnimationFrame(() => requestAnimationFrame(() => { if (!dead) setLift(l => (l ? { ...l, phase: 'slide' } : l)); })); }
    if (lift.phase === 'slide') later(430, () => setLift(l => (l ? { ...l, phase: 'fly' } : l)));
    if (lift.phase === 'fly') later(640, () => setLift(l => (l ? { ...l, phase: 'settled' } : l)));
    if (lift.phase === 'back1') later(520, () => setLift(l => (l ? { ...l, phase: 'back2' } : l)));
    if (lift.phase === 'back2') later(470, () => { if (liftImg.current) liftImg.current.style.visibility = ''; setLift(null); setViewerReady(false); });
    return () => { dead = true; };
  }, [lift?.phase, lift?.i]);
  const showViewer = !!lift && lift.phase === 'settled' && viewerReady;
  const closeCard = () => { setLift(l => (l && l.phase === 'settled' ? { ...l, phase: 'back1' } : l)); };
  const slideRect = (f: Rect): Rect => ({ x: f.x - f.w * 0.02, y: f.y - f.h * 0.52, w: f.w * 1.04, h: f.h * 1.04 });
  const liftRect = (l: NonNullable<typeof lift>): Rect => (l.phase === 'start' || l.phase === 'back2' ? l.from : l.phase === 'slide' || l.phase === 'back1' ? slideRect(l.from) : l.to);
  const liftMs: Record<Phase, number> = { start: 0, slide: 400, fly: 600, settled: 0, back1: 520, back2: 440 };
  // 'back1' goes from the centre to above the slot, 'slide' from the slot to above it: both use the soft ease, the flight the springy one
  const liftEase = (ph: Phase) => (ph === 'fly' ? 'cubic-bezier(.2,.9,.25,1)' : 'cubic-bezier(.4,0,.2,1)');

  const pageEntries = (p: number) => entries.slice(p * PER, p * PER + PER);
  const sheetLines = (() => { const l = (dir: string, at: string) => `linear-gradient(${dir}, transparent calc(${at} - 1.5px), rgba(255,255,255,.30) calc(${at} - 1.5px), rgba(255,255,255,.30) calc(${at} + .5px), rgba(0,0,0,.35) calc(${at} + .5px), rgba(0,0,0,.35) calc(${at} + 1.5px), transparent calc(${at} + 1.5px))`; return [l('90deg', '33.333%'), l('90deg', '66.666%'), l('180deg', '33.333%'), l('180deg', '66.666%')].join(','); })();

  return (
    <div ref={rootRef} style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'radial-gradient(ellipse at 50% 40%, #2a1a10 0%, #0d0905 75%)', animation: 'binderin .25s ease both' }}>
      <style>{`
        @keyframes binderin { from { opacity:0 } to { opacity:1 } }
        .bk-face { position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden; overflow:hidden; border-radius:3px 9px 9px 3px; background-size:100% 100%; }
        .bk-sheet { position:absolute; left:8.8%; right:3.5%; top:3.2%; bottom:3.4%; border-radius:9px; pointer-events:none;
          background-image: ${sheetLines}, linear-gradient(112deg, transparent 36%, rgba(255,255,255,.17) 47%, rgba(255,255,255,.05) 56%, transparent 66%), linear-gradient(160deg, rgba(255,255,255,.07), rgba(255,255,255,0) 40%, rgba(255,255,255,.04));
          background-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 280% 100%, 100% 100%; background-position: 0 0, 0 0, 0 0, 0 0, calc(var(--sheen,0) * 100%) 0, 0 0;
          box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.34), inset 0 3px 0 rgba(255,255,255,.18), inset 0 -10px 18px rgba(0,0,0,.28), 0 1px 3px rgba(0,0,0,.6); }
        .bk-foil { position:absolute; inset:0; mix-blend-mode:color-dodge; opacity:.34; background:linear-gradient(115deg,#ff5fa2,#ffe46b,#5ff0ff,#9b6bff,#ff5fa2); background-size:300% 100%; background-position:calc(var(--sheen,0) * 100%) 0; -webkit-mask-size:contain; mask-size:contain; -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; }
        .bk-chip { border:1px solid rgba(217,178,90,.55); background:rgba(14,10,6,.65); color:#ffe9b0; border-radius:10px; padding:7px 12px; font-family:'Cinzel',serif; font-size:11px; letter-spacing:.1em; font-weight:700; }
        .bk-arrow { width:46px; height:46px; border-radius:12px; border:1px solid rgba(217,178,90,.55); background:rgba(14,10,6,.65); color:#ffe9b0; font-size:24px; display:flex; align-items:center; justify-content:center; }
        .bk-arrow:disabled { opacity:.25; }
      `}</style>
      <SheenDriver root={rootRef} pos={pos} />

      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, padding: 'max(10px, env(safe-area-inset-top)) 12px 8px', display: 'flex', alignItems: 'center', gap: 8, zIndex: 40, opacity: ui ? 1 : 0, transition: 'opacity .35s', pointerEvents: ui ? 'auto' : 'none' }}>
        <button className="bk-chip" onClick={close}>‹ SALA</button>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.18em', color: '#ffe9b0' }}>COLEÇÃO {count}/{entries.length}</div>
        <button className="bk-chip" style={{ fontSize: 9.5, background: missing ? 'rgba(232,196,106,.22)' : undefined }} onClick={() => setMissing(m => !m)}>SIMULAR FALTANTES</button>
      </div>

      <div ref={bookRef} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        style={{ position: 'absolute', left: '50%', top: 'calc(50% + 4px)', width: BOOK_W, height: BOOK_H, margin: `${-BOOK_H / 2}px 0 0 ${-BOOK_W / 2}px`, perspective: 1700, transformStyle: 'preserve-3d', touchAction: 'none' }}>
        {/* the back board and the page block under the pages */}
        <div style={{ position: 'absolute', inset: '-8px -9px -8px -12px', borderRadius: '8px 14px 14px 8px', backgroundImage: `url(${coverImage})`, backgroundSize: '100% 100%', filter: 'brightness(.5)', boxShadow: '0 18px 40px rgba(0,0,0,.7)' }} />
        <div style={{ position: 'absolute', right: -5, top: 3, bottom: 3, width: 8, borderRadius: '0 4px 4px 0', background: 'repeating-linear-gradient(180deg,#d9c9a0 0 2px,#b9a878 2px 3px)', boxShadow: 'inset -2px 0 3px rgba(0,0,0,.4)' }} />
        {(
          Array.from({ length: pages }, (_, p) => (
            <div key={p} ref={el => { leafRefs.current[p] = el; }} style={{ position: 'absolute', inset: 0, transformOrigin: '0 50%', transformStyle: 'preserve-3d', display: p > 1 ? 'none' : undefined, zIndex: 60 - p, willChange: 'transform' }}>
              <div className="bk-face" style={{ backgroundImage: `url(${pageImage})` }}>
                <div style={{ position: 'absolute', left: '8.8%', right: '3.5%', top: '3.2%', bottom: '3.4%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)' }}>
                  {Array.from({ length: PER }, (_, k) => {
                    const i = p * PER + k, e = entries[i];
                    if (!e) return <div key={k} />;
                    if (!owned(i)) return <div key={k} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '78%', height: '82%', borderRadius: 7, border: '1px solid rgba(232,196,106,.16)', background: 'rgba(0,0,0,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(232,196,106,.3)', fontSize: 24 }}>?</div></div>;
                    const t = thumbOf(e.name);
                    return (
                      <div key={k} data-card={i} style={{ position: 'relative', padding: '6% 5%' }}>
                        {t && <img src={t} alt={e.name} loading="lazy" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.7))' }} />}
                        {t && e.full && <div className="bk-foil" style={{ inset: '6% 5%', WebkitMaskImage: `url(${t})`, maskImage: `url(${t})` }} />}
                      </div>
                    );
                  })}
                </div>
                {/* ONE clear plastic sheet over the whole page, the card slots only divided inside it */}
                <div className="bk-sheet" />
                <div ref={el => { shadeRefs.current[p] = el; }} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#000,rgba(0,0,0,.6))', opacity: 0, pointerEvents: 'none' }} />
              </div>
              <div className="bk-face" style={{ transform: 'rotateY(180deg)', backgroundImage: `url(${insideImage})`, borderRadius: '9px 3px 3px 9px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(270deg,rgba(0,0,0,.55),rgba(0,0,0,.05) 40%)' }} />
              </div>
            </div>
          ))
        )}
        {/* the cover, hinged on the spine */}
        <div ref={coverRef} style={{ position: 'absolute', left: -BOOK_W * 0.043, top: -BOOK_H * 0.0225, width: BOOK_W * 1.1, height: BOOK_H * 1.045, transformOrigin: '5% 50%', transformStyle: 'preserve-3d', zIndex: 150 }}>
          <div className="bk-face" style={{ backgroundImage: `url(${coverImage})`, borderRadius: 0, filter: 'drop-shadow(0 10px 18px rgba(0,0,0,.6))' }} />
          <div className="bk-face" style={{ transform: 'rotateY(180deg)', backgroundImage: `url(${insideImage})`, borderRadius: '9px 3px 3px 9px' }} />
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 'calc(50% + 250px)', textAlign: 'center', fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,233,176,.55)', opacity: ui ? 1 : 0, transition: 'opacity .35s', pointerEvents: 'none' }}>DESLIZE PARA VIRAR · TOQUE NA CARTA PARA VER EM 3D</div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '10px 14px max(14px, env(safe-area-inset-bottom))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, zIndex: 40, opacity: ui ? 1 : 0, transition: 'opacity .35s', pointerEvents: ui ? 'auto' : 'none' }}>
        <button className="bk-arrow" aria-label="Página anterior" disabled={page < 1} onClick={() => go(-1)}>‹</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 7, justifyContent: 'center' }}>{Array.from({ length: pages }, (_, i) => <b key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i === page ? '#f6d77a' : 'rgba(232,196,106,.25)', boxShadow: i === page ? '0 0 8px #f6d77a' : 'none', transform: i === page ? 'scale(1.35)' : 'none', transition: 'all .25s' }} />)}</div>
          <div style={{ marginTop: 7, fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '.2em', color: 'rgba(255,233,176,.65)' }}>PÁGINA {page + 1} DE {pages}</div>
        </div>
        <button className="bk-arrow" aria-label="Próxima página" disabled={page > pages - 2} onClick={() => go(1)}>›</button>
      </div>

      {lift && (() => {
        const r = liftRect(lift), ms = liftMs[lift.phase] / 1000, ease = liftEase(lift.phase);
        return (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 880, background: 'radial-gradient(ellipse at 50% 45%, rgba(13,9,5,.72), rgba(5,3,2,.94))', opacity: lift.phase === 'fly' || lift.phase === 'settled' ? 1 : lift.phase === 'slide' ? 0.35 : 0, transition: 'opacity .5s', pointerEvents: 'none' }} />
            <img src={lift.src} alt="" draggable={false} style={{
              position: 'fixed', left: 0, top: 0, zIndex: 890, pointerEvents: 'none', objectFit: 'contain', width: r.w, height: r.h, transform: `translate(${r.x}px, ${r.y}px)`,
              filter: lift.phase === 'start' || lift.phase === 'back2' ? 'drop-shadow(0 2px 3px rgba(0,0,0,.6))' : 'drop-shadow(0 18px 24px rgba(0,0,0,.75))',
              opacity: showViewer ? 0 : 1, transition: lift.phase === 'start' ? 'none' : `transform ${ms}s ${ease}, width ${ms}s ${ease}, height ${ms}s ${ease}, opacity .25s, filter .4s`,
            }} />
            <div style={{ position: 'fixed', inset: 0, zIndex: 900, opacity: showViewer ? 1 : 0, pointerEvents: showViewer ? 'auto' : 'none', transition: 'opacity .25s' }}>
              <Suspense fallback={null}>
                <CardViewer3D cards={entries} index={lift.i} onIndex={() => {}} onClose={closeCard} onReady={() => setViewerReady(true)} hideArrows />
              </Suspense>
            </div>
          </>
        );
      })()}
    </div>
  );
}

// The plastic's glint moves a little with the page and with time (written to a css variable, no React renders).
function SheenDriver({ root, pos }: { root: RefObject<HTMLDivElement | null>; pos: MutableRefObject<number> }) {
  useEffect(() => {
    let raf = 0; const t0 = performance.now();
    const loop = (now: number) => { const t = (now - t0) / 1000; root.current?.style.setProperty('--sheen', ((Math.sin(t * 0.55) * 0.5 + 0.5) * 0.6 + pos.current * 0.35).toFixed(3)); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }, []);
  return null;
}
