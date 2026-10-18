import type React from 'react';
// Tela de Missões (quadro de avisos da vila): diárias, semanais e, com o ranqueado ligado, de temporada. O servidor sorteia, conta e paga (server/missions.ts); aqui só se mostra,
// coleta e troca. Mockup aprovado: public/mockups/missoes/. Kit de arte: src/assets/kit-rank.
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
import iconeMissoes from './assets/ui-icon-missoes.webp';

const CINZEL = "'Cinzel', serif";
const SERIF = "'Crimson Pro', Georgia, serif";
const TAG: Record<MissionView['mode'], { label: string; bg: string; fg: string }> = { ia: { label: 'IA', bg: '#3b5a3a', fg: '#d4f3cf' }, free: { label: 'LIVRE', bg: '#4a4636', fg: '#ecdfb0' }, ranked: { label: 'RANQUEADA', bg: '#5a2a2a', fg: '#ffd0c8' } };
type Tab = 'daily' | 'weekly' | 'season';
const left = (ms: number, now: number) => { const h = Math.max(0, ms - now) / 3600e3; return h < 1 ? '< 1 h' : h < 48 ? `${Math.ceil(h)} h` : `${Math.ceil(h / 24)} dias`; };

// Moedas que saltam do botão quando a missão é coletada (posições sorteadas uma vez por linha)
const COINS = Array.from({ length: 9 }, (_, i) => ({ dx: (i - 4) * 14 + (i % 2 ? 6 : -6), dy: -50 - (i * 37 % 40), rot: (i * 53) % 360, delay: (i % 3) * 0.04 }));
const CollectFx = ({ reward }: { reward: number }) => (
  <>
    <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0] }} transition={{ duration: 0.7 }}
      style={{ borderRadius: 10, background: 'radial-gradient(ellipse at 85% 50%, rgba(255,226,140,0.95), rgba(255,190,70,0.35) 45%, rgba(255,190,70,0) 75%)' }} />
    <div className="absolute pointer-events-none" style={{ right: 50, top: '50%', width: 0, height: 0, zIndex: 6 }}>
      {COINS.map((c, i) => (
        <motion.img key={i} src={iconeCoroa} alt="" draggable={false} className="absolute" style={{ width: 18, height: 18, left: -9, top: -9, objectFit: 'contain', filter: 'drop-shadow(0 0 5px rgba(255,200,80,0.9))' }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }} animate={{ x: c.dx, y: [0, c.dy, c.dy + 38], opacity: [0, 1, 1, 0], scale: [0.4, 1.1, 0.9], rotate: c.rot }}
          transition={{ duration: 0.85, delay: c.delay, ease: 'easeOut', times: [0, 0.45, 1] }} />
      ))}
      <motion.b className="absolute" style={{ left: -26, top: -14, fontFamily: CINZEL, fontWeight: 900, fontSize: 20, color: '#ffe9a0', textShadow: '0 2px 4px #000, 0 0 10px rgba(255,200,80,0.9)', whiteSpace: 'nowrap' }}
        initial={{ y: 0, opacity: 0, scale: 0.6 }} animate={{ y: [0, -16, -34], opacity: [0, 1, 0], scale: [0.6, 1.2, 1] }} transition={{ duration: 0.9, ease: 'easeOut', times: [0, 0.3, 1] }}>+{reward}</motion.b>
    </div>
  </>
);

const MissionRow = ({ m, busy, onClaim, onReroll, collecting }: { m: MissionView; busy: boolean; onClaim: () => void; onReroll?: () => void; collecting?: boolean }) => {
  const done = m.progress >= m.target, ready = done && !m.claimed, tag = TAG[m.mode];
  return (
    <motion.div className="relative" animate={collecting ? { scale: [1, 1.035, 1] } : { scale: 1 }} transition={{ duration: 0.45 }} style={{ height: 96, marginBottom: 4, opacity: m.claimed ? 0.78 : 1 }}>
      {collecting && <CollectFx reward={m.reward} />}
      <div className="absolute inset-0" style={{ border: '18px solid transparent', borderImage: `url(${ready ? linhaAtual : linhaNormal}) 38 fill / 18px stretch` }} />
      <div className="absolute grid place-items-center" style={{ left: 14, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, backgroundImage: `url(${ready ? slotBrilhando : slotNormal})`, backgroundSize: '100% 100%' }}>
        <img src={iconeMissoes} alt="" draggable={false} style={{ width: 30, height: 30, objectFit: 'contain' }} />
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
        {collecting ? <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 10, letterSpacing: '0.1em', color: '#ffe9a0', textTransform: 'uppercase' }}>✓ Pago!</div>
          : m.claimed ? <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: 9, letterSpacing: '0.08em', color: '#8fe0a4', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>✓ Coletado</div>
          : <button onClick={onClaim} disabled={!ready || busy} style={{ width: 78, height: 30, backgroundImage: `url(${ready ? botaoPrimario : botaoSecundario})`, backgroundSize: '100% 100%', border: 'none', fontFamily: CINZEL, fontWeight: 900, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: ready ? '#2a1a05' : '#a89a78', opacity: busy ? 0.6 : 1 }}>{ready ? 'Coletar' : 'Em curso'}</button>}
      </div>
    </motion.div>
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
  const [fx, setFx] = useState<string | null>(null);                    // missão que está recebendo o efeito de coleta
  const [toast, setToast] = useState<{ n: number; k: number } | null>(null);   // "+N coroas" que sobe e some
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  // Coletar: primeiro o efeito (brilho, moedas, "+N", "Pago!"), SÓ DEPOIS o quadro novo chega e a linha desce até o fim da lista deslizando.
  const collect = async (m: MissionView, wait = 850) => {
    setFx(m.id);
    const t0 = Date.now(), r = await claimMission(m.key, m.id);
    await sleep(Math.max(0, wait - (Date.now() - t0)));
    if (r.ok === true) setToast(t => ({ n: (t && Date.now() - t.k < 1800 ? t.n : 0) + m.reward, k: Date.now() }));
    apply(r); setFx(null);
  };
  const claim = async (m: MissionView) => { setBusy(true); await collect(m); setBusy(false); };
  const claimAll = async () => { setBusy(true); for (const m of list.filter(x => !x.claimed && x.progress >= x.target)) await collect(m, 600); setBusy(false); };
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(null), 1900); return () => clearTimeout(id); }, [toast]);
  const reroll = async (m: MissionView) => { setRerolling(true); apply(await rerollMission(m.id)); setRerolling(false); };
  const now = board?.now ?? Date.now();
  const readyList = list.filter(x => !x.claimed && x.progress >= x.target);
  return (
    <Win title="Missões" onClose={onClose} footer={<div className="flex w-full justify-center" style={{ gap: 4 }}>
      {readyList.length >= 2 && <KitButton primary onClick={claimAll} width={190}>{busy ? '…' : `Coletar tudo +${readyList.reduce((n, m) => n + m.reward, 0)}`}</KitButton>}
      <KitButton onClick={onClose} width={readyList.length >= 2 ? 120 : 210}>Voltar</KitButton></div>}>
      <div style={{ padding: '0 4px' }}>
        <div className="sticky pointer-events-none" style={{ top: 2, height: 0, zIndex: 30 }}>
          <AnimatePresence>{toast && (
            <motion.div key={toast.k} className="mx-auto grid place-items-center" initial={{ y: 8, opacity: 0, scale: 0.8 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.25 }}
              style={{ width: 'fit-content', padding: '5px 16px 5px 10px', borderRadius: 20, background: 'linear-gradient(#5a3b10,#2a1805)', border: '1.5px solid #e8c766', boxShadow: '0 4px 14px rgba(0,0,0,0.7), 0 0 14px rgba(255,200,80,0.55)' }}>
              <span className="flex items-center" style={{ gap: 6, fontFamily: CINZEL, fontWeight: 900, fontSize: 15, color: '#ffe9b0' }}><img src={iconeCoroa} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />+{toast.n} coroas</span>
            </motion.div>)}
          </AnimatePresence>
        </div>
        {board === undefined && <div style={{ textAlign: 'center', color: '#cdbd97', fontFamily: SERIF, padding: 30 }}>Carregando…</div>}
        {board === null && <div style={{ textAlign: 'center', color: '#f0a595', fontFamily: SERIF, padding: 30 }}>{error || 'Não foi possível carregar as missões.'} Entre com uma conta e tente de novo.</div>}
        {board && (<>
          <div className="flex justify-center" style={{ margin: '0 0 6px' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className="relative" style={{ width: 104, height: 44, backgroundImage: `url(${tab === t.id ? abaAtiva : abaInativa})`, backgroundSize: '100% 100%', border: 'none', paddingTop: 3, fontFamily: CINZEL, fontWeight: tab === t.id ? 900 : 700, fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', color: tab === t.id ? '#2a1a05' : '#a89a78' }}>
                {t.label}
                {ready(t.id) > 0 && <span className="absolute grid place-items-center" style={{ right: 5, top: 2, zIndex: 3, minWidth: 15, height: 15, borderRadius: 8, background: '#c93a2a', border: '1.5px solid #ffd9d0', color: '#fff', fontFamily: CINZEL, fontWeight: 900, fontSize: 9, boxShadow: '0 1px 3px #000' }}>{ready(t.id)}</span>}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center" style={{ margin: '2px 12px 6px', fontFamily: SERIF, fontWeight: 600, fontSize: 12, color: '#cdbd97' }}>
            <b style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', color: '#e8c766', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{tab === 'daily' ? `Renovam em ${left(board.dayEndsAt, now)}` : tab === 'weekly' ? `Renovam em ${left(board.weekEndsAt, now)}` : 'Valem nesta temporada'}</b>
            {tab === 'daily' && <span style={{ whiteSpace: 'nowrap' }}>{board.rerollsLeft > 0 ? '1 troca por dia' : 'Troca de hoje usada'}</span>}
          </div>
          {error && <div style={{ textAlign: 'center', color: '#f0a595', fontFamily: SERIF, fontSize: 12, padding: '0 10px 6px' }}>{error}</div>}
          {list.map(m => (
            <motion.div key={m.id} layout="position" transition={{ type: 'spring', stiffness: 380, damping: 34 }}>
              <MissionRow m={m} busy={busy || rerolling} collecting={fx === m.id} onClaim={() => claim(m)} onReroll={tab === 'daily' && m.reroll ? () => reroll(m) : undefined} />
            </motion.div>
          ))}
          {list.length === 0 && <div style={{ textAlign: 'center', color: '#cdbd97', fontFamily: SERIF, padding: 30 }}>Nenhuma missão aqui por enquanto.</div>}
        </>)}
      </div>
    </Win>
  );
};
export const MissionsHost = ({ open, ...p }: { open: boolean; onClose: () => void; onCoroas: (balance: number) => void; onBoard?: (claimable: number) => void }) => <AnimatePresence>{open && <MissionsScreen key="missions" {...p} />}</AnimatePresence>;
