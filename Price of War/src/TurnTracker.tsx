// The central turn panel: five phase medallions under a name band. The band is green on the player's turn and red on
// the adversary's; the lower area stays neutral. Art, band mask and neutral mask share one 1400x341 canvas.
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import trackerArt from './assets/ui-turn-tracker-art.webp';
import trackerBand from './assets/ui-turn-tracker-band.webp';
import trackerNeutral from './assets/ui-turn-tracker-neutral.webp';
import endArt from './assets/ui-turn-tracker-end-art.webp';
import endMask from './assets/ui-turn-tracker-end-mask.webp';
import type { TurnPhase } from './engine/types';

export const TRACKER_PHASES: TurnPhase[] = ['compra', 'suprimentos', 'preparacao', 'combate', 'movimentacao'];
// Where each medallion sits along the plate (percent of its width), measured on the art.
const MEDALLION_X = [10.86, 29.86, 48.86, 67.86, 86.86];
// Band / medallion row geometry (fractions of the plate height), measured on the art.
const BAND_TOP = 0.1038, BAND_BOTTOM = 0.4654, MEDALLION_Y = 0.6975;

export const TRACKER_NAMES: Record<TurnPhase, string> = {
  compra: 'COMPRA', suprimentos: 'SUPRIMENTOS', preparacao: 'PREPARAÇÃO',
  combate: 'COMBATE', movimentacao: 'MOVIMENTAÇÃO',
};
const PALETTE = {
  me: { b1: '#17c777', b2: '#07803f', glow: '#5af0a8' },
  foe: { b1: '#f23a3a', b2: '#a50f19', glow: '#ff7a7a' },
};

// The plate has to fit the gap between the two Vanguarda rows (about 45 px on a 390-px-wide phone, growing and
// shrinking with the width), so it is drawn at a fraction of its 250-px design size.
const PLATE_W = 250, PLATE_H = 250 * 341 / 1400;
// The "Encerrar turno" segment continues the plate to the right (same height, its own frame; the two end caps make the divider).
const END_W = 250 * 440 / 1400;
const trackerScale = (vw: number) => 0.7 * Math.min(1.3, Math.max(0.9, vw / 390));
const useTrackerScale = () => {
  const [vw, setVw] = useState(() => (typeof window === 'undefined' ? 390 : window.innerWidth));
  useEffect(() => {
    const on = () => setVw(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return trackerScale(vw);
};

type Props = {
  mine: boolean;
  // The phase shown as "now" (null on the adversary's turn before it is known).
  phase: TurnPhase | null;
  // Phases that exist in the rules but cannot be reached yet (Combate before combat opens).
  locked: TurnPhase[];
  // Optional small line before the name. The panel normally shows just the name and a chevron for "tap to go on".
  caption?: string;
  // Name override (the adversary's turn reads "ADVERSÁRIO" instead of the phase).
  name?: string;
  // Tappable phases show the double chevron; automatic ones and the adversary's turn do not.
  tappable: boolean;
  // The extra segment on the right that ends the turn at once (the plate itself still goes phase by phase). Absent: no segment.
  onEnd?: () => void;
  // The segment is lit (the player can end the turn now); otherwise it sits dark.
  endReady?: boolean;
};

export function TurnTracker({ mine, phase, locked, caption, name, tappable, onEnd, endReady = false }: Props) {
  const scale = useTrackerScale();
  const pal = PALETTE[mine ? 'me' : 'foe'];
  const shown = phase ?? 'preparacao';
  const nowIndex = TRACKER_PHASES.indexOf(shown);
  const label = name ?? TRACKER_NAMES[shown];

  // Green ↔ red: the new colour wipes across the band over the old one.
  const [wipe, setWipe] = useState<{ id: number; fromMine: boolean } | null>(null);
  const prevMine = useRef(mine);
  const wipeId = useRef(0);
  useEffect(() => {
    if (prevMine.current === mine) return;
    const id = ++wipeId.current;
    setWipe({ id, fromMine: prevMine.current });
    prevMine.current = mine;
    const t = window.setTimeout(() => setWipe(w => (w?.id === id ? null : w)), 800);
    return () => window.clearTimeout(t);
  }, [mine]);

  // A light sweep runs over the band whenever the phase changes or the plate is pressed.
  const [sweep, setSweep] = useState(0);
  const firstPhase = useRef(true);
  useEffect(() => {
    if (firstPhase.current) { firstPhase.current = false; return; }
    setSweep(n => n + 1);
  }, [shown, mine]);

  // The plate dips a little while it is pressed (the end segment has its own press).
  const [pressed, setPressed] = useState(false);
  const [endPressed, setEndPressed] = useState(false);

  const base = wipe ? PALETTE[wipe.fromMine ? 'me' : 'foe'] : pal;
  const vars = {
    '--b1': base.b1, '--b2': base.b2, '--glow': pal.glow,
    '--bt': BAND_TOP, '--bb': BAND_BOTTOM, '--my': MEDALLION_Y,
    '--fb': 1, transform: `scale(${scale * (pressed ? 0.96 : 1)})`,
    '--mband': `url(${trackerBand})`, '--mneu': `url(${trackerNeutral})`, '--mart': `url(${trackerArt})`,
  } as CSSProperties;

  return (
    <div className="trk-box" style={{ width: (PLATE_W + (onEnd ? END_W : 0)) * scale, height: PLATE_H * scale }}>
    <div className="trk" style={vars}
      onPointerDown={() => { if (tappable) { setSweep(n => n + 1); setPressed(true); } }}
      onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)} onPointerCancel={() => setPressed(false)}>
      <div className="trk-layer trk-neutral" />
      <div className="trk-layer trk-band">
        <div className="trk-fill" />
        {wipe && (
          <div key={wipe.id}>
            <div className="trk-wipe"><div className="trk-fill" style={{ '--b1': pal.b1, '--b2': pal.b2 } as CSSProperties} /></div>
            <div className="trk-wipe-edge" />
          </div>
        )}
        <div className="trk-sheen" />
        {sweep > 0 && <div key={sweep} className="trk-sweep" />}
      </div>
      <div className="trk-layer trk-art" />
      <div className="trk-diamond" />
      <div className="trk-lab" key={label}>
        {caption && <em>{caption}</em>}
        <b className={label.length > 11 ? 'long' : ''}>{label}</b>
        {tappable && <s>››</s>}
      </div>
      {TRACKER_PHASES.map((p, i) => {
        const state = locked.includes(p) ? 'lock' : !mine && phase === null ? 'future' : i < nowIndex ? 'done' : i === nowIndex ? 'now' : 'future';
        return <div key={p} className={`trk-m ${state}`} style={{ left: `${MEDALLION_X[i]}%` }} />;
      })}
    </div>
    {onEnd && (
      <div className={`trk-end ${endReady ? 'ready' : ''} ${endPressed ? 'press' : ''}`} data-tut="end-turn" role="button" aria-disabled={!endReady}
        style={{ left: PLATE_W * scale, width: END_W * scale, height: PLATE_H * scale, '--esc': scale, '--mend': `url(${endMask})`, '--aend': `url(${endArt})` } as CSSProperties}
        onPointerDown={(e) => { e.stopPropagation(); if (endReady) setEndPressed(true); }}
        onPointerUp={() => setEndPressed(false)} onPointerLeave={() => setEndPressed(false)} onPointerCancel={() => setEndPressed(false)}
        onClick={(e) => { e.stopPropagation(); if (endReady) onEnd(); }}>
        <div className="trk-end-fill" />
        <div className="trk-end-art" />
        <span><b>Encerrar</b><b>turno</b></span>
      </div>
    )}
    </div>
  );
}
