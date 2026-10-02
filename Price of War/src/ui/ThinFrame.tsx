// The thin gold-line frame (the same art as the menu buttons), as a 9-slice, plus the two things the game builds from it:
// a text box (GameBox) and a button (GameButton). Every prompt, hint, toast and button in a match uses these, so there is
// one line style everywhere. `px` is the border width (the corner flourishes are scaled to it). Slice 31 = the corner size
// in the 810px frame art.
import React from 'react';
import uiFrameMenuCardImage from '../assets/ui-frame-menu-card.webp';

export const ThinFrame = ({ px, className = '', style, children }: { px: number; className?: string; style?: React.CSSProperties; children: React.ReactNode; key?: React.Key }) => (
  <div
    className={className}
    style={{
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderWidth: px,
      borderImageSource: `url(${uiFrameMenuCardImage})`,
      borderImageSlice: '31',
      borderImageWidth: `${px}px`,
      borderImageRepeat: 'stretch',
      ...style,
      backgroundOrigin: 'border-box',
      backgroundClip: 'border-box',
    }}
  >
    {children}
  </div>
);

// A dark, slightly see-through plate inside the thin frame. `tint` swaps the plate colour (red for a warning, say).
export const GameBox = ({ children, className = '', style, px = 12, tint }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; px?: number; tint?: string }) => (
  <ThinFrame px={px} className={className} style={{ background: tint ?? 'rgba(12,8,5,0.9)', ...style }}>{children}</ThinFrame>
);

const TONES = { primary: 'rgba(24,100,58,0.82)', danger: 'rgba(104,24,24,0.78)', neutral: 'rgba(24,16,8,0.78)', gold: 'rgba(130,92,22,0.85)' } as const;
const TEXT = { primary: '#eafff0', danger: '#ffd9d2', neutral: '#f0e0bb', gold: '#fff3d2' } as const;

export const GameButton = ({ children, onClick, tone = 'neutral', disabled = false, className = '', size = 11, icon, tutUi = false, compact = false }: {
  children: React.ReactNode; onClick?: (e: React.MouseEvent) => void; tone?: keyof typeof TONES; disabled?: boolean; className?: string; size?: number; icon?: React.ReactNode; tutUi?: boolean; compact?: boolean; key?: React.Key;
}) => (
  <button onClick={onClick} disabled={disabled} data-tut-ui={tutUi ? '' : undefined} className={`active:scale-95 active:brightness-125 transition disabled:opacity-55 disabled:active:scale-100 ${className}`}>
    <ThinFrame px={10} style={{ background: disabled ? 'rgba(34,28,22,0.8)' : TONES[tone] }}>
      <span className={`flex items-center justify-center gap-1.5 ${compact ? 'px-1.5' : 'px-3'} py-[3px] uppercase tracking-[0.12em] whitespace-nowrap`}
        style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: size, color: disabled ? '#a89c84' : TEXT[tone] }}>
        {icon}{children}
      </span>
    </ThinFrame>
  </button>
);
