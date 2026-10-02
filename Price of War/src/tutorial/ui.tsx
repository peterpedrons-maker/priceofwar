// The tutorial's look: the instructor (Aldric) and his speech panel, the tapping hand, the dimming with exact-silhouette
// holes, the list in the menu and the opening talk. Everything is drawn with the thin gold-line frame (src/ui/ThinFrame.tsx).
// Logic lives in App.tsx (it needs the engine and the board); the data in script.ts.
import React, { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import handSprite from '../assets/tut-hand.webp';
import { GameBox, GameButton, ThinFrame } from '../ui/ThinFrame';
import { INTRO_LINES, NPC_NAME, NPC_TITLE, TUTORIALS, type Expr, type Step } from './script';

// ── The instructor ───────────────────────────────────────────────────────────
// Art: src/assets/npc-instrutor-<neutral|point|happy|warn|think|cheer>.webp. Missing pictures fall back to a silhouette.
// @ts-ignore (vite glob)
const NPC_ART = import.meta.glob('../assets/npc-instrutor-*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const npcArt = (e: Expr): string | null => NPC_ART[`../assets/npc-instrutor-${e}.webp`] ?? NPC_ART['../assets/npc-instrutor-neutral.webp'] ?? null;
const GLYPH: Record<Expr, string> = { neutral: '', point: '☞', happy: '♥', warn: '!', think: '?', cheer: '★' };

const FONT_HEAD = "'Cinzel', serif";
const FONT_BODY = "'Crimson Pro', serif";

export const NpcPortrait = ({ expr, size = 78, tag = false }: { expr: Expr; size?: number; tag?: boolean }) => {
  const art = npcArt(expr);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 35%, #5b4326, #1b130b 75%)', border: '2px solid #d9ae5c', boxShadow: '0 0 0 1.5px #2a1c0a, 0 4px 14px rgba(0,0,0,.7), inset 0 0 12px rgba(0,0,0,.6)' }}>
        {art ? (
          <img src={art} alt={NPC_NAME} className="w-full h-full object-cover" draggable={false} />
        ) : (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50 14c-17 0-28 11-28 27v10l-8 8v14h72V59l-8-8V41c0-16-11-27-28-27z" fill="#8b6b3a" stroke="#2a1c0a" strokeWidth="3" />
            <path d="M32 46h36v13c0 9-8 15-18 15s-18-6-18-15z" fill="#d9b48a" stroke="#2a1c0a" strokeWidth="3" />
            <rect x="46" y="22" width="8" height="26" rx="3" fill="#b8924d" stroke="#2a1c0a" strokeWidth="2" />
            <circle cx="42" cy="54" r="2.6" fill="#2a1c0a" /><circle cx="58" cy="54" r="2.6" fill="#2a1c0a" />
            <path d="M43 65q7 5 14 0" stroke="#2a1c0a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M20 100c4-14 16-20 30-20s26 6 30 20z" fill="#5a3b1c" stroke="#2a1c0a" strokeWidth="3" />
          </svg>
        )}
      </div>
      {GLYPH[expr] && !art && (
        <div className="absolute -right-1 -top-1 w-6 h-6 rounded-full flex items-center justify-center text-[13px] font-black"
          style={{ background: '#ffd477', color: '#2a1605', border: '2px solid #2a1c0a' }}>{GLYPH[expr]}</div>
      )}
      {tag && (
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: -9 }}>
          <GameBox px={8}><span className="block px-1.5 text-[9px] tracking-[0.18em] uppercase whitespace-nowrap" style={{ fontFamily: FONT_HEAD, fontWeight: 700, color: '#ffe3a1' }}>{NPC_NAME}</span></GameBox>
        </div>
      )}
    </div>
  );
};

// ── The speech panel ─────────────────────────────────────────────────────────
export type PanelProps = {
  step: Pick<Step, 'id' | 'expr' | 'title' | 'lines' | 'note' | 'kind'>;
  chapter?: number; chapters: number;
  position: 'top' | 'bottom';
  replay: number;                      // changes when REPETIR is pressed, so the lines play again
  canBack: boolean;
  onNext?: () => void;                 // only in "read" steps
  onBack: () => void; onRepeat: () => void; onSkip: () => void;
  nextLabel?: string;
};
export const NpcPanel = ({ step, chapter, chapters, position, replay, canBack, onNext, onBack, onRepeat, onSkip, nextLabel = 'ENTENDI' }: PanelProps) => {
  const isDo = step.kind === 'do';
  return (
    <>
      <GameButton tutUi size={10} tone="neutral" onClick={onSkip} className="fixed z-[955] top-2.5 right-2.5">PULAR</GameButton>
      <motion.div
        key={`${step.id}:${replay}`} data-tut-ui
        initial={{ opacity: 0, y: position === 'top' ? -14 : 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}
        className="fixed z-[950] left-2.5 right-2.5 mx-auto max-w-[560px]"
        style={position === 'top' ? { top: 'max(64px, env(safe-area-inset-top))' } : { bottom: 'max(10px, env(safe-area-inset-bottom))' }}
      >
        <div className="relative">
          <GameBox px={16} style={{ boxShadow: '0 8px 30px rgba(0,0,0,.65)' }}>
            <div className="pl-[78px] pr-0.5 pb-0.5">
              <div className="flex items-center justify-between gap-2 min-h-[20px]">
                <span className="text-[13px] leading-none font-bold tracking-wide" style={{ fontFamily: FONT_HEAD, color: '#ffe3a1' }}>{step.title ?? NPC_NAME.toUpperCase()}</span>
                {chapter ? (
                  <span className="flex gap-[3px] shrink-0">
                    {Array.from({ length: chapters }, (_, i) => <i key={i} className="block w-[5px] h-[5px] rounded-full" style={{ background: i < chapter ? '#ffd477' : 'rgba(150,125,85,.5)' }} />)}
                  </span>
                ) : null}
              </div>
              <div className="mt-1.5 flex flex-col gap-1">
                {(step.lines ?? []).map((ln, i) => (
                  <motion.p key={`${replay}-${i}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.4, duration: 0.35 }}
                    className="text-[17px] leading-[1.28]" style={{ fontFamily: FONT_BODY, fontWeight: 600, color: '#f1e4c4' }}>{ln}</motion.p>
                ))}
                {step.note && <p className="text-[13px] leading-tight mt-0.5" style={{ fontFamily: FONT_BODY, fontWeight: 600, color: '#ffc866' }}>{step.note}</p>}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <GameButton compact size={10} disabled={!canBack} onClick={onBack}>◂ Voltar</GameButton>
              <GameButton compact size={10} onClick={onRepeat}>↻ Repetir</GameButton>
              <span className="flex-1" />
              {onNext && !isDo && <GameButton compact tone="gold" size={12} className="tut-next" onClick={onNext}>{nextLabel} ▸</GameButton>}
              {isDo && <span className="text-[12px] tracking-wide tut-blink whitespace-nowrap" style={{ fontFamily: FONT_BODY, fontWeight: 700, color: '#ffd477' }}>Toque no brilho</span>}
            </div>
          </GameBox>
          <div className="absolute left-3 -top-6"><NpcPortrait expr={step.expr ?? 'neutral'} size={68} tag /></div>
        </div>
      </motion.div>
    </>
  );
};

// ── The hand that taps (fingertip at x,y) ───────────────────────────────────
export const TapHand = ({ x, y, scale = 0.62 }: { x: number; y: number; scale?: number }) => {
  const W = 112 * scale, H = 140 * scale, tipX = 47 * scale, tipY = 6 * scale;
  return (
    <div className="fixed pointer-events-none z-[945]" style={{ left: x - tipX, top: y - tipY, width: W, height: H }}>
      <div className="absolute rounded-full tut-ripple" style={{ left: tipX - 6, top: tipY - 6, width: 12, height: 12 }} />
      <div className="absolute rounded-full tut-ripple tut-ripple2" style={{ left: tipX - 6, top: tipY - 6, width: 12, height: 12 }} />
      <img src={handSprite} alt="" draggable={false} className="absolute inset-0 w-full h-full tut-hand" style={{ filter: 'drop-shadow(0 0 10px rgba(255,226,150,.85)) drop-shadow(0 3px 4px rgba(0,0,0,.7))' }} />
    </div>
  );
};

// ── Dimming with holes ───────────────────────────────────────────────────────
export type Hole = {
  x: number; y: number; w: number; h: number; round?: number;
  noRing?: boolean;                     // a plain hole with no glowing border (the ring is drawn by another hole)
  // a card: its exact silhouette, already placed (px). `rotate` + `origin` tilt the rim for a card in the fan of the hand.
  sil?: { fill: string; rim: string; bx: number; by: number; bw: number; bh: number; rotate?: string; origin?: string; rimOnly?: boolean };
};
const roundedRectUri = (w: number, h: number, r: number) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><rect width='${w}' height='${h}' rx='${r}' ry='${r}' fill='black'/></svg>`)}")`;

export const Spotlight = ({ holes, dim = 0.76 }: { holes: Hole[]; dim?: number }) => {
  const mask = useMemo(() => {
    const imgs: string[] = [], sizes: string[] = [], poss: string[] = [], comps: string[] = [], wk: string[] = [];
    holes.forEach(h => {
      if (h.sil && h.sil.rimOnly) return;
      if (h.sil) {
        imgs.push(`url(${h.sil.fill})`); sizes.push(`${h.sil.bw}px ${h.sil.bh}px`); poss.push(`${h.sil.bx}px ${h.sil.by}px`);
      } else {
        const w = Math.max(1, Math.round(h.w)), hh = Math.max(1, Math.round(h.h));
        imgs.push(roundedRectUri(w, hh, h.round ?? 16)); sizes.push(`${w}px ${hh}px`); poss.push(`${Math.round(h.x)}px ${Math.round(h.y)}px`);
      }
      comps.push('exclude'); wk.push('xor');
    });
    imgs.push('linear-gradient(#000,#000)'); sizes.push('100% 100%'); poss.push('0 0'); comps.push('add'); wk.push('source-over');
    return { imgs: imgs.join(','), sizes: sizes.join(','), poss: poss.join(','), comps: comps.join(','), wk: wk.join(',') };
  }, [holes]);
  const style: CSSProperties = {
    background: `rgba(6,8,18,${dim})`,
    maskImage: mask.imgs, maskSize: mask.sizes, maskPosition: mask.poss, maskRepeat: 'no-repeat', maskComposite: mask.comps as CSSProperties['maskComposite'],
    WebkitMaskImage: mask.imgs, WebkitMaskSize: mask.sizes, WebkitMaskPosition: mask.poss, WebkitMaskRepeat: 'no-repeat', WebkitMaskComposite: mask.wk,
  };
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 940 }}>
      <div className="absolute inset-0" style={style} />
      {holes.map((h, i) => h.sil ? (
        <div key={i} className="absolute tut-sil" style={{ left: h.sil.bx, top: h.sil.by, width: h.sil.bw, height: h.sil.bh, transform: h.sil.rotate, transformOrigin: h.sil.origin }}>
          <div className="absolute inset-0 tut-sil-rim" style={{ WebkitMaskImage: `url(${h.sil.rim})`, maskImage: `url(${h.sil.rim})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' }} />
        </div>
      ) : h.noRing ? null : (
        <div key={i} className="absolute tut-ring" style={{ left: h.x, top: h.y, width: h.w, height: h.h, borderRadius: h.round ?? 16 }} />
      ))}
    </div>
  );
};

// ── The tutorials list (menu) ────────────────────────────────────────────────
const DONE_KEY = 'pow.tutorials.done';
export const loadTutorialsDone = (): string[] => { try { return JSON.parse(localStorage.getItem(DONE_KEY) ?? '[]'); } catch { return []; } };
export const markTutorialDone = (id: string) => { try { const d = new Set(loadTutorialsDone()); d.add(id); localStorage.setItem(DONE_KEY, JSON.stringify([...d])); } catch { /* storage may be blocked */ } };

export const TutorialList = ({ onClose, onPlay }: { onClose: () => void; onPlay: (id: string) => void; key?: React.Key }) => {
  const done = loadTutorialsDone();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,.78)' }} onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()} className="w-full max-w-[400px]" style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,.8))' }}>
        <GameBox px={20} tint="rgba(14,9,5,0.96)">
          <div className="flex flex-col gap-3 p-1">
            <div className="flex items-center gap-3">
              <NpcPortrait expr="happy" size={58} />
              <div>
                <h2 className="text-[20px] font-bold tracking-wide" style={{ fontFamily: FONT_HEAD, color: '#ffe3a1' }}>TUTORIAIS</h2>
                <p className="text-[15px] leading-tight" style={{ fontFamily: FONT_BODY, fontWeight: 600, color: '#d9c79b' }}>Aprenda com {NPC_NAME}, o {NPC_TITLE}.</p>
              </div>
            </div>
            {TUTORIALS.map((t, i) => (
              <ThinFrame key={t.id} px={11} style={{ background: 'rgba(40,28,10,.45)', opacity: t.available ? 1 : 0.55 }}>
                <div className="p-1.5 flex items-center gap-3">
                  <div className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-[16px] font-black" style={{ background: done.includes(t.id) ? '#2f7d4a' : '#6f4710', border: '1.5px solid #ffe29a', color: '#fff5d8', fontFamily: FONT_HEAD }}>{done.includes(t.id) ? '✓' : i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold leading-tight" style={{ fontFamily: FONT_HEAD, color: '#ffe3a1' }}>{t.title}</div>
                    <div className="text-[15px] leading-tight mt-0.5" style={{ fontFamily: FONT_BODY, fontWeight: 600, color: '#d9c79b' }}>{t.blurb}</div>
                  </div>
                  {t.available
                    ? <GameButton tone="gold" size={11} onClick={() => onPlay(t.id)}>{done.includes(t.id) ? 'Repetir' : 'Jogar'}</GameButton>
                    : <span className="text-[11px] tracking-wider shrink-0" style={{ fontFamily: FONT_HEAD, color: '#9d8a5f' }}>EM BREVE</span>}
                </div>
              </ThinFrame>
            ))}
            <GameButton className="self-center" onClick={onClose}>Fechar</GameButton>
          </div>
        </GameBox>
      </motion.div>
    </motion.div>
  );
};

// ── The opening talk (before the duel) ───────────────────────────────────────
export const TutorialIntro = ({ onStart, onClose }: { onStart: () => void; onClose: () => void; key?: React.Key }) => {
  const [page, setPage] = useState(0);
  const [replay, setReplay] = useState(0);
  const last = page === INTRO_LINES.length - 1;
  useEffect(() => { setReplay(0); }, [page]);
  return (
    <motion.div data-tut-ui initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[310] flex flex-col items-center justify-end p-4 pb-8"
      style={{ background: 'radial-gradient(circle at 50% 30%, #3a2a14 0%, #0b0805 75%)' }}>
      <GameButton size={10} onClick={onClose} className="absolute top-3 left-3">Sair</GameButton>
      <div className="flex-1 flex items-center justify-center"><NpcPortrait expr={page === 0 ? 'happy' : last ? 'point' : page === 2 ? 'cheer' : 'neutral'} size={200} tag /></div>
      <div className="w-full max-w-[420px]">
        <GameBox px={18}>
          <div className="px-1 pb-1">
            <div className="text-[13px] font-bold tracking-wide" style={{ fontFamily: FONT_HEAD, color: '#ffe3a1' }}>{NPC_NAME.toUpperCase()} · {NPC_TITLE.toUpperCase()}</div>
            <div className="mt-1.5 flex flex-col gap-1.5 min-h-[92px]">
              {INTRO_LINES[page].map((ln, i) => (
                <motion.p key={`${page}-${replay}-${i}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.5, duration: 0.4 }}
                  className="text-[19px] leading-[1.3]" style={{ fontFamily: FONT_BODY, fontWeight: 600, color: '#f1e4c4' }}>{ln}</motion.p>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <GameButton compact size={10} disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>◂ Voltar</GameButton>
              <GameButton compact size={10} onClick={() => setReplay(r => r + 1)}>↻ Repetir</GameButton>
              <span className="flex-1" />
              <GameButton compact tone="gold" size={12} className="tut-next" onClick={() => (last ? onStart() : setPage(p => p + 1))}>{last ? 'Começar' : 'Próximo'} ▸</GameButton>
            </div>
          </div>
        </GameBox>
      </div>
    </motion.div>
  );
};
