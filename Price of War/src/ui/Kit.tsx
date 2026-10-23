// Peças do kit de interface das janelas (9 fatias em CSS, ver src/ui/kit.css e docs/janelas-ui.md).
// FramedWindow/WindowTitle/WindowButton/WindowOption/ToggleRow/VolumeRow/ArtChip, em App.tsx, são só invólucros destas.
import React from 'react';
import './kit.css';
import frameImg from '../assets/kit/modal-frame.png';
import dividerImg from '../assets/kit/divider.png';
import btnSecondary from '../assets/kit/btn-secondary.png';
import btnPrimary from '../assets/kit/btn-primary.png';
import btnDanger from '../assets/kit/perigo.png';
import rowImg from '../assets/kit/panel-row.png';
import rowSelImg from '../assets/kit/row-selected.png';
import tabOn from '../assets/kit/tab_on.png';
import tabOff from '../assets/kit/tab_off.png';
import toggleOn from '../assets/kit/toggle-on.png';
import toggleOff from '../assets/kit/toggle-off.png';
import knobImg from '../assets/kit/slider_botao.png';

export const KitWindow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`kit-win ${className}`} style={{ borderImageSource: `url(${frameImg})` }}>{children}</div>
);

export const KitTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <h2 className="kit-title">{children}</h2>
    <i className="kit-div" aria-hidden style={{ backgroundImage: `url(${dividerImg})` }} />
  </div>
);

export const KitButton = ({ children, onClick, tone = 'normal', className = '', disabled }: {
  children: React.ReactNode; onClick: () => void; tone?: 'normal' | 'gold' | 'danger'; className?: string; disabled?: boolean; key?: React.Key;
}) => (
  <button
    onClick={onClick} disabled={disabled}
    className={`kit-btn ${tone === 'gold' ? 'gold' : tone === 'danger' ? 'danger' : ''} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
    style={{ borderImageSource: `url(${tone === 'gold' ? btnPrimary : tone === 'danger' ? btnDanger : btnSecondary})` }}
  >{children}</button>
);

// Linha tocável. Com `icon`, usa a arte com encaixe de retrato (o ícone vai no encaixe); sem, usa a faixa lisa do botão secundário.
export const KitRow = ({ children, onClick, selected = false, icon }: { children: React.ReactNode; onClick: () => void; selected?: boolean; icon?: React.ReactNode; key?: React.Key }) => (
  <button
    onClick={onClick} className={icon ? 'kit-row kit-row-ic' : 'kit-row kit-row-plain'}
    style={{ borderImageSource: `url(${icon ? (selected ? rowSelImg : rowImg) : btnSecondary})`, filter: selected ? 'drop-shadow(0 0 7px rgba(240,200,100,.5))' : undefined }}
  >
    {icon && <span className="kit-sock">{icon}</span>}
    {children}
  </button>
);

export const KitTab = ({ active, onClick, children, className = '' }: { active: boolean; onClick: () => void; children: React.ReactNode; className?: string; key?: React.Key }) => (
  <button
    onClick={onClick} className={`kit-tab ${className}`}
    style={{ borderImageSource: `url(${active ? tabOn : tabOff})`, color: active ? '#2a1604' : '#a99768', textShadow: active ? '0 1px 0 rgba(255,255,255,.5)' : undefined }}
  >{children}</button>
);

export const KitToggle = ({ on }: { on: boolean }) => (
  <span className={`kit-tg ${on ? 'on' : ''}`} style={{ backgroundImage: `url(${on ? toggleOn : toggleOff})` }} />
);

export const KitRange = ({ value, onChange, onRelease, label }: { value: number; onChange: (v: number) => void; onRelease?: () => void; label: string }) => (
  <input
    type="range" min={0} max={100} step={1} value={Math.round(value * 100)} aria-label={label}
    className="kit-range" style={{ ['--v' as string]: `${Math.round(value * 100)}%`, ['--kit-knob' as string]: `url(${knobImg})` }}
    onChange={e => onChange(Number(e.target.value) / 100)} onPointerUp={onRelease} onKeyUp={onRelease}
  />
);

// ── Editor de decks e telas cheias ──────────────────────────────────────────
import iconBtnImg from '../assets/kit/icon-btn.png';
import countOk from '../assets/kit/cont_ok.png';
import countBad from '../assets/kit/cont_inc.png';
import searchImg from '../assets/kit/busca.png';
import iVoltar from '../assets/kit/i_voltar.png';
import iBusca from '../assets/kit/i_busca.png';
import iFiltro from '../assets/kit/i_filtro.png';
import iCarta from '../assets/kit/i_carta.png';
import iLista from '../assets/kit/i_lista.png';
import iGrade from '../assets/kit/i_grade.png';
import iLixo from '../assets/kit/i_lixo.png';
import iEspadas from '../assets/kit/i_espadas.png';
import iCartas from '../assets/kit/i_cartas.png';

export const KIT_ICONS = { voltar: iVoltar, busca: iBusca, filtro: iFiltro, carta: iCarta, lista: iLista, grade: iGrade, lixo: iLixo, espadas: iEspadas, cartas: iCartas };

export const KitIcon = ({ src, size = 20, className = '' }: { src: string; size?: number; className?: string }) => (
  <i aria-hidden className={`kit-ic ${className}`} style={{ width: size, height: size, backgroundImage: `url(${src})` }} />
);

// Botão redondo com ícone (voltar, ver em cartas/lista, tamanho). `on` = selecionado (brilho dourado).
export const KitIconButton = ({ icon, onClick, label, on = false, disabled = false, size = 38, children }: {
  icon?: string; onClick: () => void; label: string; on?: boolean; disabled?: boolean; size?: number; children?: React.ReactNode; key?: React.Key;
}) => (
  <button
    aria-label={label} title={label} onClick={onClick} disabled={disabled}
    className={`kit-ib ${disabled ? 'opacity-35 pointer-events-none' : ''}`}
    style={{ width: size, height: size, backgroundImage: `url(${iconBtnImg})`, filter: on ? 'brightness(1.25) drop-shadow(0 0 6px rgba(240,200,100,.6))' : 'brightness(.8) drop-shadow(0 3px 4px rgba(0,0,0,.6))' }}
  >{icon ? <KitIcon src={icon} size={Math.round(size * .55)} /> : children}</button>
);

// Placa com encaixe de retrato (nome do deck + General): o retrato vai no encaixe, o resto à direita.
export const KitPlate = ({ portrait, children }: { portrait: string; children: React.ReactNode }) => (
  <div className="kit-row kit-row-ic" style={{ borderImageSource: `url(${rowImg})`, cursor: 'default', minHeight: 58 }}>
    <span className="kit-sock" style={{ backgroundImage: `url(${portrait})`, backgroundSize: 'cover', backgroundPosition: '50% 12%' }} />
    {children}
  </div>
);

// Contador (60) em pílula verde; vermelha quando o deck está fora do limite.
export const KitCount = ({ children, bad = false }: { children: React.ReactNode; bad?: boolean }) => (
  <span className="kit-count" style={{ backgroundImage: `url(${bad ? countBad : countOk})` }}>{children}</span>
);

export const KitSearch = ({ value, onChange, placeholder = 'Buscar...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <label className="kit-search" style={{ borderImageSource: `url(${searchImg})` }}>
    <KitIcon src={iBusca} size={16} className="kit-search-ic" />
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
  </label>
);

import coinChipImg from '../assets/kit/moeda_mais.png';
// Saldo de Coroas em pílula com a moeda (Loja).
export const KitCoins = ({ children }: { children: React.ReactNode }) => (
  <span className="kit-coins" style={{ backgroundImage: `url(${coinChipImg})` }}>{children}</span>
);

import fieldImg from '../assets/kit/campo.png';
import fieldFocusImg from '../assets/kit/campo_foco.png';
// Campo de texto (login, nome do comandante): o <input> vai dentro; a moldura acende no foco.
export const KitField = ({ children }: { children: React.ReactNode }) => (
  <div className="kit-field" style={{ ['--kf' as string]: `url(${fieldImg})`, ['--kff' as string]: `url(${fieldFocusImg})` }}>{children}</div>
);

// Título de prompt da partida (Manutenção, modo da Relíquia, escolher carta): o mesmo título das janelas, com divisor e uma frase de apoio.
export const PromptTitle = ({ title, sub, small = false }: { title: string; sub?: React.ReactNode; small?: boolean }) => (
  <div className="text-center pointer-events-none flex flex-col items-center gap-1.5 px-3">
    <h2 className="kit-title" style={small ? { fontSize: 17, letterSpacing: '.09em', lineHeight: 1.2 } : undefined}>{title}</h2>
    <i className="kit-div" aria-hidden style={{ backgroundImage: `url(${dividerImg})` }} />
    {sub && <p className="m-0 text-[#e6d6ae]" style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontWeight: 600, fontSize: 14.5, lineHeight: 1.25, textShadow: '0 2px 6px #000' }}>{sub}</p>}
  </div>
);
