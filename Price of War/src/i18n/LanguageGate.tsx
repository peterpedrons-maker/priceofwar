// Primeira abertura do jogo: escolher o idioma (aparece só uma vez; depois, em Opções). A tela é bilíngue de propósito.
import logo from '../assets/logo-price-of-war.webp';
import type { CSSProperties } from 'react';
import type { Lang } from './index';

const BTN: CSSProperties = {
  width: '100%', padding: '16px 18px', borderRadius: 12, border: '2px solid #e8c766', cursor: 'pointer',
  background: 'linear-gradient(180deg,#f3d27a,#b98a2c)', color: '#2a1a06', fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: 20, letterSpacing: '0.08em',
  boxShadow: '0 4px 14px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.5)',
};
export const LanguageGate = ({ onPick }: { onPick: (l: Lang) => void }) => (
  <div data-no-i18n style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '24px 20px', background: 'radial-gradient(ellipse at 50% 35%, #3a2a14, #0c0906 75%)', color: '#f3e7c6' }}>
    <img src={logo} alt="Price of War" draggable={false} style={{ width: 'min(70vw, 280px)', height: 'auto', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,.7))' }} />
    <div style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.16em', fontSize: 13, textAlign: 'center', color: '#cdbd97' }}>ESCOLHA O IDIOMA · CHOOSE YOUR LANGUAGE</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 'min(80vw, 300px)' }}>
      <button type="button" style={BTN} onClick={() => onPick('pt')}>Português</button>
      <button type="button" style={BTN} onClick={() => onPick('en')}>English</button>
    </div>
    <div style={{ fontSize: 11, color: '#a89a78', textAlign: 'center' }}>Você pode mudar depois em Opções · You can change it later in Options</div>
  </div>
);
