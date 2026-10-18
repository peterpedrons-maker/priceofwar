import type React from 'react';
// Tela de Missões (quadro de avisos da vila): diárias, semanais e, com o ranqueado ligado, de temporada. O servidor sorteia, conta e paga (server/missions.ts); aqui só se mostra,
// coleta e troca. Mockup aprovado: public/mockups/missoes/. Kit de arte: src/assets/kit-rank.
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Win, KitButton } from './RankedScreens';
import { claimMission, fetchMissions, rerollMission, type MissionsBoard, type MissionView } from './services/online';
import abaAtiva from './assets/kit-rank/aba-ativa.png';
import abaInativa from './assets/kit-rank/aba-inativa.png';
import linhaNormal from './assets/kit-rank/linha-normal-livre.png';
import linhaAtual from './assets/kit-rank/linha-atual-livre.png';
import barraMoldura from './assets/kit-rank/barra-moldura.png';
import encOuro from './assets/kit-rank/enchimento-ouro.png';
import slotNormal from './assets/kit-rank/slot-normal.png';
import slotBrilhando from './assets/kit-rank/slot-brilhando.png';
import chipNeutro from './assets/kit-rank/chip-neutro.png';
import botaoPrimario from './assets/kit-rank/botao-primario.png';
import botaoSecundario from './assets/kit-rank/botao-secundario.png';
import iconeCoroa from './assets/ui-icon-coroa.webp';
import iconeDesafios from './assets/ui-icon-desafios.webp';
import iconeSword from './assets/ui-icon-sword.webp';
import iconeCard from './assets/ui-icon-card.webp';
import iconeRanking from './assets/ui-icon-ranking.webp';

const CINZEL = "'Cinzel', serif";
const SERIF = "'Crimson Pro', Georgia, serif";
const TAG: Record<MissionView['mode'], { label: string; bg: string; fg: string }> = { ia: { label: 'IA', bg: '#3b5a3a', fg: '#d4f3cf' }, free: { label: 'LIVRE', bg: '#4a4636', fg: '#ecdfb0' }, ranked: { label: 'RANQUEADA', bg: '#5a2a2a', fg: '#ffd0c8' } };
const iconOf = (m: MissionView) => m.metric === 'reach_league' ? iconeRanking : m.metric === 'win' ? iconeDesafios : m.metric === 'play' ? iconeSword : iconeCard;
type Tab = 'daily' | 'weekly' | 'season';
const left = (ms: number, now: number) => { const h = Math.max(0, ms - now) / 3600e3; return h < 1 ? 'menos de 1 h' : h < 48 ? `${Math.ceil(h)} h` : `${Math.ceil(h / 24)} dias`; };

const MissionRow = ({ m, busy, onClaim, onReroll }: { m: MissionView; busy: boolean; onClaim: () => void; onReroll?: () => void }) => {
  const done = m.progress >= m.target, ready = done && !m.claimed, tag = TAG[m.mode];
  return (
    <div className="relative" style={{ height: 96, marginBottom: 4, opacity: m.claimed ? 0.78 : 1 }}>
      <div className="absolute inset-0" style={{ border: '18px solid transparent', borderImage: `url(${ready ? linhaAtual : linhaNormal}) 38 fill / 18px stretch` }} />
      <div className="absolute grid place-items-center" style={{ left: 14, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, backgroundImage: `url(${ready ? slotBrilhando : slotNormal})`, backgroundSize: '100% 100%' }}>
        <img src={iconOf(m)} alt="" draggable={false} style={{ width: 26, height: 26, objectFit: 'contain' }} />
      </div>
      <div className="absolute flex flex-col justify-center" style={{ left: 68, right: 92, top: 12, bottom: 12, gap: 2 }}>
        <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: 12, lineHeight: 1.1, color: '#f3e3c3', whiteSpace: 'nowrap' }}>{m.title}</div>
        <div style={{ fontFamily: SERIF, fontSize: 12, lineHeight: 1.15, color: '#cdbd97' }}>
          <span style={{ display: 'inline-block', fontFamily: CINZEL, fontWeight: 700, fontSize: 8, letterSpacing: '0.14em', padding: '1px 5px', borderRadius: 4, marginRight: 4, verticalAlign: 1, background: tag.bg, color: tag.fg }}>{tag.label}</span>{m.desc}
        </div>
        <div className="relative" style={{ height: 17, width: '100%', marginTop: 2 }}>
          <img src={barraMoldura} alt="" draggable={false} className="absolute inset-0 w-full h-full" />
          <div className="absolute overflow-hidden" style={{ left: '12.3%', right: '12.1%', top: '17%', bottom: '22%', borderRadius: 6 }}>
            <img src={encOuro} alt="" draggable={false} className="absolute left-0 top-0 h-full" style={{ width: `${Math.min(100, (m.progress / m.target) * 100)}%`, objectFit: 'fill', maxWidth: 'none' }} />
          </div>
          <div className="absolute inset-0 grid place-items-center" style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 9, color: '#fff3cf', textShadow: '0 1px 2px #000' }}>{m.progress}/{m.target}</div>
        </div>
      </div>
      {onReroll && <button onClick={onReroll} disabled={busy} className="absolute" style={{ right: 14, top: 3, zIndex: 2, fontFamily: CINZEL, fontWeight: 700, fontSize: 8, letterSpacing: '0.1em', color: '#e8c766', textTransform: 'uppercase', background: 'none', border: 'none', padding: 2, opacity: 0.9 }}>↻ Trocar</button>}
      <div className="absolute flex flex-col items-center justify-center" style={{ right: 12, top: 0, bottom: 0, width: 78, gap: 5 }}>
        <div className="flex items-center" style={{ gap: 3, backgroundImage: `url(${chipNeutro})`, backgroundSize: '100% 100%', padding: '0 12px 0 8px', height: 26, fontFamily: CINZEL, fontWeight: 900, fontSize: 14, color: '#ffe9b0' }}>
          <img src={iconeCoroa} alt="" draggable={false} style={{ width: 17, height: 17, objectFit: 'contain' }} />+{m.reward}
        </div>
        {m.claimed ? <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: 9, letterSpacing: '0.08em', color: '#8fe0a4', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>✓ Coletado</div>
          : <button onClick={onClaim} disabled={!ready || busy} style={{ width: 78, height: 30, backgroundImage: `url(${ready ? botaoPrimario : botaoSecundario})`, backgroundSize: '100% 100%', border: 'none', fontFamily: CINZEL, fontWeight: 900, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: ready ? '#2a1a05' : '#a89a78', opacity: busy ? 0.6 : 1 }}>{ready ? 'Coletar' : 'Em curso'}</button>}
      </div>
    </div>
  );
};

export const MissionsScreen = ({ onClose, onCoroas, onBoard }: { onClose: () => void; onCoroas: (balance: number) => void; onBoard?: (claimable: number) => void; key?: React.Key }) => {
  const [board, setBoard] = useState<MissionsBoard | null | undefined>(undefined);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('daily');
  const [busy, setBusy] = useState(false);
  const [rerolling, setRerolling] = useState(false);
  const apply = useCallback((r: Awaited<ReturnType<typeof fetchMissions>>) => {
    if (r.ok === true) { setBoard(r.board); setError(''); onBoard?.(r.board.claimable); if (r.board.coroas_after !== undefined) onCoroas(r.board.coroas_after); }
    else { setError(r.error); setBoard(b => b ?? null); }
  }, [onBoard, onCoroas]);
  useEffect(() => { let on = true; fetchMissions().then(r => { if (on) apply(r); }); return () => { on = false; }; }, []);   // eslint-disable-line react-hooks/exhaustive-deps
  const tabs: { id: Tab; label: string }[] = [{ id: 'daily', label: 'Diárias' }, { id: 'weekly', label: 'Semanais' }, ...(board && board.season.length ? [{ id: 'season' as Tab, label: 'Temporada' }] : [])];
  const list = board ? [...board[tab]].sort((a, b) => Number(a.claimed) - Number(b.claimed)) : [];   // as já coletadas descem para o fim
  const ready = (t: Tab) => board ? board[t].filter(m => !m.claimed && m.progress >= m.target).length : 0;
  const claim = async (m: MissionView) => { setBusy(true); apply(await claimMission(m.key, m.id)); setBusy(false); };
  const reroll = async (m: MissionView) => { setRerolling(true); apply(await rerollMission(m.id)); setRerolling(false); };
  const now = board?.now ?? Date.now();
  return (
    <Win title="Missões" onClose={onClose} footer={<KitButton onClick={onClose}>Voltar</KitButton>}>
      <div style={{ padding: '0 4px' }}>
        {board === undefined && <div style={{ textAlign: 'center', color: '#cdbd97', fontFamily: SERIF, padding: 30 }}>Carregando…</div>}
        {board === null && <div style={{ textAlign: 'center', color: '#f0a595', fontFamily: SERIF, padding: 30 }}>{error || 'Não foi possível carregar as missões.'} Entre com uma conta e tente de novo.</div>}
        {board && (<>
          <div className="flex justify-center" style={{ margin: '0 0 6px' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className="relative" style={{ width: 104, height: 44, backgroundImage: `url(${tab === t.id ? abaAtiva : abaInativa})`, backgroundSize: '100% 100%', border: 'none', paddingTop: 3, fontFamily: CINZEL, fontWeight: tab === t.id ? 900 : 700, fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', color: tab === t.id ? '#2a1a05' : '#a89a78' }}>
                {t.label}
                {ready(t.id) > 0 && <span className="absolute grid place-items-center" style={{ right: -3, top: -4, zIndex: 3, minWidth: 17, height: 17, borderRadius: 9, background: '#c93a2a', border: '1.5px solid #ffd9d0', color: '#fff', fontFamily: CINZEL, fontWeight: 900, fontSize: 10, boxShadow: '0 1px 3px #000' }}>{ready(t.id)}</span>}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center" style={{ margin: '2px 12px 6px', fontFamily: SERIF, fontWeight: 600, fontSize: 12, color: '#cdbd97' }}>
            <b style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: '#e8c766', textTransform: 'uppercase' }}>{tab === 'daily' ? `Renovam em ${left(board.dayEndsAt, now)}` : tab === 'weekly' ? `Renovam em ${left(board.weekEndsAt, now)}` : 'Valem nesta temporada'}</b>
            {tab === 'daily' && <span>{board.rerollsLeft > 0 ? 'Troque 1 por dia' : 'Troca de hoje usada'}</span>}
          </div>
          {error && <div style={{ textAlign: 'center', color: '#f0a595', fontFamily: SERIF, fontSize: 12, padding: '0 10px 6px' }}>{error}</div>}
          {list.map(m => (
            <div key={m.id}>
              <MissionRow m={m} busy={busy || rerolling} onClaim={() => claim(m)} onReroll={tab === 'daily' && m.reroll ? () => reroll(m) : undefined} />
            </div>
          ))}
          {list.length === 0 && <div style={{ textAlign: 'center', color: '#cdbd97', fontFamily: SERIF, padding: 30 }}>Nenhuma missão aqui por enquanto.</div>}
        </>)}
      </div>
    </Win>
  );
};
export const MissionsHost = ({ open, ...p }: { open: boolean; onClose: () => void; onCoroas: (balance: number) => void; onBoard?: (claimable: number) => void }) => <AnimatePresence>{open && <MissionsScreen key="missions" {...p} />}</AnimatePresence>;
