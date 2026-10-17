// The thin gold-line frame (the same art as the menu buttons), as a 9-slice, plus the two things the game builds from it:
// a text box (GameBox) and a button (GameButton). Every prompt, hint, toast and button in a match uses these, so there is
// one line style everywhere. `px` is the border width (the corner flourishes are scaled to it). Slice 31 = the corner size
// in the 810px frame art.
import React from 'react';
import './kit.css';
import toastImg from '../assets/kit/toast.png';
import btnGold from '../assets/kit/btn-primary.png';
import btnGoldOff from '../assets/kit/btn-primary-off.png';
import btnDark from '../assets/kit/btn-secondary.png';
import btnDarkOff from '../assets/kit/btn-secondary-off.png';
import btnRed from '../assets/kit/perigo.png';
import btnRedOff from '../assets/kit/perigo_off.png';
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

// The text/hint box (kit "toast" art, 9-sliced). `px` is kept for the old call sites and only sets the border width (10 to 14). `tint` lays a colour
// over the dark plate (red for a warning, say).
export const GameBox = ({ children, className = '', style, px = 12, tint }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; px?: number; tint?: string }) => {
  const bw = Math.max(10, Math.min(14, px));
  return (
    <div
      className={`relative ${className}`}
      style={{ borderStyle: 'solid', borderColor: 'transparent', borderWidth: bw, borderImageSource: `url(${toastImg})`, borderImageSlice: '26 fill', borderImageRepeat: 'stretch', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.6))', ...style }}
    >
      {tint && <span aria-hidden className="absolute pointer-events-none" style={{ inset: -bw + 4, borderRadius: 6, background: tint, mixBlendMode: 'multiply', opacity: 0.85 }} />}
      <div className="relative">{children}</div>
    </div>
  );
};

// Buttons of the match: the kit's art (gold = primary/gold, dark = neutral, red = danger). Sizes come from `size` (font px); the
// width comes from `className` (flex-1, w-full...). Two buttons that answer the same question use the same tone.
const TONE_ART = { primary: [btnGold, btnGoldOff], gold: [btnGold, btnGoldOff], neutral: [btnDark, btnDarkOff], danger: [btnRed, btnRedOff] } as const;
const TONE_TEXT = { primary: '#2a1604', gold: '#2a1604', neutral: '#f6e3a3', danger: '#ffd9d2' } as const;
export type GameButtonTone = keyof typeof TONE_ART;

export const GameButton = ({ children, onClick, tone = 'neutral', disabled = false, className = '', size = 11, icon, tutUi = false, compact = false }: {
  children: React.ReactNode; onClick?: (e: React.MouseEvent) => void; tone?: GameButtonTone; disabled?: boolean; className?: string; size?: number; icon?: React.ReactNode; tutUi?: boolean; compact?: boolean; key?: React.Key;
}) => {
  const gold = tone === 'primary' || tone === 'gold';
  const small = size <= 12 || compact;
  return (
    <button
      onClick={onClick} disabled={disabled} data-tut-ui={tutUi ? '' : undefined}
      className={`kit-btn ${gold ? 'gold' : ''} ${small ? 'gm-sm' : ''} ${disabled ? 'gm-off' : ''} ${className}`}
      style={{ borderImageSource: `url(${TONE_ART[tone][disabled ? 1 : 0]})`, fontSize: size, color: disabled ? (gold ? '#5a4a2c' : '#8d8068') : TONE_TEXT[tone], ...(disabled ? { filter: 'none', textShadow: 'none' } : {}) }}
    >
      {icon && <span className="mr-1.5 flex">{icon}</span>}{children}
    </button>
  );
};
