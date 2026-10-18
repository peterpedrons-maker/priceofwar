import type React from 'react';
// Tela de Missões (quadro de avisos da vila): diárias, semanais e, com o ranqueado ligado, de temporada. O servidor sorteia, conta e paga (server/missions.ts); aqui só se mostra,
// coleta e troca. Mockup aprovado: public/mockups/missoes/. Kit de arte: src/assets/kit-rank.
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Win, KitButton } from './RankedScreens';
import { playRewardSfx } from './rewardSfx';
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
import iconeCoroa from './assets/ui-icon-coroa.webp';
import iconeMissoes from './assets/ui-icon-missoes.webp';

const CINZEL = "'Cinzel', serif";
const SERIF = "'Crimson Pro', Georgia, serif";
const TAG: Record<MissionView['mode'], { label: string; bg: string; fg: string }> = { ia: { label: 'IA', bg: '#2f7a46', fg: '#eafff0' }, free: { label: 'LIVRE', bg: '#8a6a1c', fg: '#fff3cf' }, ranked: { label: 'RANQUEADA', bg: '#a03434', fg: '#ffe6e0' } };
type Tab = 'daily' | 'weekly' | 'season';
const left = (ms: number, now: number) => { const h = Math.max(0, ms - now) / 3600e3; return h < 1 ? '< 1 h' : h < 48 ? `${Math.ceil(h)} h` : `${Math.ceil(h / 24)} dias`; };

// Efeito de coleta (a recompensa tem que ser sentida): brilho dourado na linha, onda de choque e raios a partir da recompensa, faíscas, moedas saltando, o selo "COMPLETA" carimbando com impacto.
const COINS = Array.from({ length: 9 }, (_, i) => ({ dx: (i - 4) * 14 + (i % 2 ? 6 : -6), dy: -50 - (i * 37 % 40), rot: (i * 53) % 360, delay: (i % 3) * 0.04 }));
const SPARKS = Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2 + (i % 3) * 0.2, r = 40 + (i * 29 % 46); return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.8, s: 0.6 + (i % 4) * 0.25, d: (i % 5) * 0.03 }; });
const Spark = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 20 20"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8Z" fill="#fff4c2" /></svg>;
const CollectFx = ({ reward }: { reward: number }) => (
  <>
    <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.55, 0] }} transition={{ duration: 1.0, times: [0, 0.12, 0.5, 1] }}
      style={{ borderRadius: 12, boxShadow: '0 0 0 2px rgba(255,226,140,0.95), 0 0 26px 6px rgba(255,200,80,0.85), inset 0 0 30px rgba(255,214,120,0.55)' }} />
    <div className="absolute pointer-events-none" style={{ right: 50, top: '50%', width: 0, height: 0, zIndex: 6 }}>
      <motion.div className="absolute" style={{ left: -90, top: -90, width: 180, height: 180, borderRadius: '50%', background: 'repeating-conic-gradient(from 0deg, rgba(255,226,140,0.85) 0deg 7deg, rgba(255,226,140,0) 7deg 20deg)', WebkitMaskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,0.6) 40%, transparent 70%)', maskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,0.6) 40%, transparent 70%)' }}
        initial={{ opacity: 0, scale: 0.3, rotate: 0 }} animate={{ opacity: [0, 0.95, 0], scale: [0.3, 1.2, 1.5], rotate: 40 }} transition={{ duration: 0.95, ease: 'easeOut' }} />
      <motion.div className="absolute" style={{ left: -22, top: -22, width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(255,230,150,0.95)', boxShadow: '0 0 14px rgba(255,200,80,0.9)' }}
        initial={{ scale: 0.2, opacity: 0.95 }} animate={{ scale: [0.2, 4.2], opacity: [0.95, 0] }} transition={{ duration: 0.65, ease: 'easeOut' }} />
      {SPARKS.map((p, i) => (
        <motion.div key={'s' + i} className="absolute" style={{ left: -6, top: -6, filter: 'drop-shadow(0 0 5px rgba(255,210,100,0.95))' }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.2, rotate: 0 }} animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: [0.2, p.s, 0], rotate: 90 }} transition={{ duration: 0.8, delay: 0.05 + p.d, ease: 'easeOut' }}><Spark size={12} /></motion.div>
      ))}
      {COINS.map((c, i) => (
        <motion.img key={i} src={iconeCoroa} alt="" draggable={false} className="absolute" style={{ width: 18, height: 18, left: -9, top: -9, objectFit: 'contain', filter: 'drop-shadow(0 0 5px rgba(255,200,80,0.9))' }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }} animate={{ x: c.dx, y: [0, c.dy, c.dy + 38], opacity: [0, 1, 1, 0], scale: [0.4, 1.1, 0.9], rotate: c.rot }}
          transition={{ duration: 0.85, delay: c.delay, ease: 'easeOut', times: [0, 0.45, 1] }} />
      ))}
      <motion.b className="absolute" style={{ left: -26, top: -14, fontFamily: CINZEL, fontWeight: 900, fontSize: 20, color: '#ffe9a0', textShadow: '0 2px 4px #000, 0 0 10px rgba(255,200,80,0.9)', whiteSpace: 'nowrap' }}
        initial={{ y: 0, opacity: 0, scale: 0.6 }} animate={{ y: [0, -16, -34], opacity: [0, 1, 0], scale: [0.6, 1.2, 1] }} transition={{ duration: 0.9, ease: 'easeOut', times: [0, 0.3, 1] }}>+{reward}</motion.b>
    </div>
    {/* selo "COMPLETA" carimbando no meio da linha, com clarão de impacto */}
    <motion.div className="absolute pointer-events-none" style={{ left: 36, top: '50%', width: 0, height: 0, zIndex: 7 }}>
      <motion.div className="absolute" style={{ left: -60, top: -60, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,244,200,0.95), rgba(255,200,80,0) 65%)' }}
        initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: [0, 0, 1, 0], scale: [0.4, 0.4, 1.4, 1.8] }} transition={{ duration: 0.55, delay: 0.1, times: [0, 0.3, 0.5, 1] }} />
      <motion.div className="absolute flex flex-col items-center justify-center" style={{ left: -33, top: -33, width: 66, height: 66, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #ffe08a, #c98a1a 60%, #6a3f08)', border: '3px double #fff1b8', boxShadow: '0 4px 12px rgba(0,0,0,0.75), 0 0 18px rgba(255,200,80,0.8)', transform: 'rotate(-12deg)' }}
        initial={{ scale: 3, opacity: 0, rotate: -34 }} animate={{ scale: [3, 0.88, 1, 1], opacity: [0, 1, 1, 1], rotate: [-34, -12, -12, -12] }} transition={{ duration: 0.5, delay: 0.1, times: [0, 0.55, 0.75, 1], ease: 'easeOut' }}>
        <svg width="30" height="24" viewBox="0 0 30 24" style={{ marginBottom: 1, filter: 'drop-shadow(0 1px 0 rgba(255,240,180,0.7))' }}><path d="M3 13 L11 21 L27 3" fill="none" stroke="#3a2005" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 8, letterSpacing: '0.04em', color: '#3a2005', textShadow: '0 1px 0 rgba(255,240,180,0.7)', lineHeight: 1, marginTop: -2 }}>COMPLETA</span>
      </motion.div>
    </motion.div>
  </>
);

const MissionRow = ({ m, busy, onClaim, onReroll, collecting }: { m: MissionView; busy: boolean; onClaim: () => void; onReroll?: () => void; collecting?: boolean }) => {
  const done = m.progress >= m.target, ready = done && !m.claimed, tag = TAG[m.mode];
  return (
    <motion.div className="relative" animate={collecting ? { scale: [1, 1.05, 1.0] } : { scale: 1 }} transition={{ duration: 0.5 }} style={{ height: 96, marginBottom: 4 }}>
      {collecting && <CollectFx reward={m.reward} />}
      <div className="absolute inset-0" style={{ border: '18px solid transparent', borderImage: `url(${ready ? linhaAtual : linhaNormal}) 38 fill / 18px stretch` }} />
      {/* fundo escuro por dentro da moldura: o texto claro lê bem (o cinza do painel era claro demais para a letra clara) */}
      <div className="absolute pointer-events-none" style={{ inset: 13, borderRadius: 8, background: ready ? 'linear-gradient(rgba(96,60,10,0.94), rgba(44,24,4,0.96))' : m.claimed ? 'linear-gradient(rgba(14,44,28,0.95), rgba(6,24,14,0.97))' : 'linear-gradient(rgba(26,32,52,0.95), rgba(12,15,28,0.97))', boxShadow: 'inset 0 0 16px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)' }} />
      <div className="absolute grid place-items-center" style={{ left: 14, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, backgroundImage: `url(${ready ? slotBrilhando : slotNormal})`, backgroundSize: '100% 100%' }}>
        <img src={iconeMissoes} alt="" draggable={false} style={{ width: 30, height: 30, objectFit: 'contain' }} />
      </div>
      <div className="absolute flex flex-col justify-center" style={{ left: 68, right: 92, top: 12, bottom: 12, gap: 2 }}>
        <div style={{ fontFamily: CINZEL, fontWeight: 800, fontSize: 13, lineHeight: 1.1, color: m.claimed ? '#c9f2d4' : ready ? '#ffe9a8' : '#f6efe0', textShadow: '0 1px 2px #000', whiteSpace: 'nowrap' }}>{m.title}</div>
        <div style={{ fontFamily: SERIF, fontSize: 12.5, lineHeight: 1.15, color: m.claimed ? '#bfe0c9' : '#e4e1d6', textShadow: '0 1px 2px #000' }}>
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
        {collecting ? <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 9, letterSpacing: '0.04em', color: '#ffe9a0', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>✓ Completa!</div>
          : m.claimed ? <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: 9, letterSpacing: '0.04em', color: '#8fe0a4', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>✓ Completa</div>
          : <button data-claim={m.id} onClick={onClaim} disabled={!ready || busy} style={{ width: 78, height: 30, ...(ready ? { backgroundImage: `url(${botaoPrimario})`, backgroundSize: '100% 100%', border: 'none' } : { background: 'linear-gradient(#323a58,#1b2036)', border: '1.5px solid #6a7396', borderRadius: 6, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)' }), fontFamily: CINZEL, fontWeight: 900, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: ready ? '#2a1a05' : '#d4dcf4', opacity: busy ? 0.6 : 1 }}>{ready ? 'Coletar' : 'Em curso'}</button>}
      </div>
    </motion.div>
  );
};

export const MissionsScreen = ({ onClose, onCoroas, onBoard, coroas }: { onClose: () => void; onCoroas: (balance: number) => void; onBoard?: (claimable: number) => void; coroas: number; key?: React.Key }) => {
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
  const [bal, setBal] = useState(coroas); const [bump, setBump] = useState(0);   // saldo mostrado (conta subindo) e pulso quando as moedas chegam
  const [flights, setFlights] = useState<{ id: number; x0: number; y0: number; x1: number; y1: number; d: number }[]>([]);
  const [finale, setFinale] = useState(false);
  const balRef = useRef<HTMLDivElement>(null); const flightId = useRef(0); const balNow = useRef(coroas);
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  const countTo = (to: number) => { const from = balNow.current, t0 = performance.now(); balNow.current = to; const step = (t: number) => { const k = Math.min(1, (t - t0) / 550); setBal(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
  // Moedas voam do botão até o saldo lá em cima (portal no body: o painel tem filtro, que prenderia um "fixed")
  const fly = (id: string) => {
    const b = document.querySelector(`[data-claim="${id}"]`)?.getBoundingClientRect(), c = balRef.current?.getBoundingClientRect(); if (!b || !c) return;
    const arr = Array.from({ length: 8 }, (_, i) => ({ id: ++flightId.current, x0: b.left + b.width / 2, y0: b.top + b.height / 2, x1: c.left + c.width / 2, y1: c.top + c.height / 2, d: i * 0.06 }));
    setFlights(f => [...f, ...arr]); setTimeout(() => setFlights(f => f.filter(x => !arr.some(a => a.id === x.id))), 1500);
  };
  // Coletar: o efeito começa NO TOQUE (brilho, onda, raios, faíscas, selo COMPLETA, som, vibração, moedas voando até o saldo); o saldo conta para cima quando as moedas chegam;
  // SÓ DEPOIS o quadro novo chega e a linha desce até o fim da lista deslizando.
  const collect = async (m: MissionView, wait = 1250, big = false) => {
    setFx(m.id); fly(m.id); playRewardSfx(big);
    const t0 = Date.now(), r = await claimMission(m.key, m.id);
    await sleep(Math.max(0, 700 - (Date.now() - t0)));
    if (r.ok === true) { countTo(r.board.coroas_after ?? balNow.current + m.reward); setBump(b => b + 1); setToast(t => ({ n: (t && Date.now() - t.k < 2200 ? t.n : 0) + m.reward, k: Date.now() })); }
    await sleep(Math.max(0, wait - 700));
    apply(r); setFx(null);
  };
  const claim = async (m: MissionView) => { setBusy(true); await collect(m); setBusy(false); };
  const claimAll = async () => {
    setBusy(true); const todo = list.filter(x => !x.claimed && x.progress >= x.target);
    for (const m of todo) await collect(m, 900);
    setFinale(true); playRewardSfx(true); setTimeout(() => setFinale(false), 1900); setBusy(false);
  };
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(null), 2300); return () => clearTimeout(id); }, [toast]);
  const reroll = async (m: MissionView) => { setRerolling(true); apply(await rerollMission(m.id)); setRerolling(false); };
  const now = board?.now ?? Date.now();
  const readyList = list.filter(x => !x.claimed && x.progress >= x.target);
  return (
    <Win title="Missões" onClose={onClose} footer={<div className="flex w-full justify-center" style={{ gap: 4 }}>
      {readyList.length >= 2 && <KitButton primary onClick={claimAll} width={190}>{busy ? '…' : `Coletar tudo +${readyList.reduce((n, m) => n + m.reward, 0)}`}</KitButton>}
      <KitButton onClick={onClose} width={readyList.length >= 2 ? 120 : 210}>Voltar</KitButton></div>}>
      <div style={{ padding: '4px 4px 6px', minHeight: '100%' }}>
        {createPortal(<>
          {flights.map(f => (
            <motion.img key={f.id} src={iconeCoroa} alt="" draggable={false} style={{ position: 'fixed', left: -11, top: -11, width: 22, height: 22, objectFit: 'contain', zIndex: 900, pointerEvents: 'none', filter: 'drop-shadow(0 0 7px rgba(255,205,90,0.95))' }}
              initial={{ x: f.x0, y: f.y0, opacity: 0, scale: 0.5 }} animate={{ x: [f.x0, (f.x0 + f.x1) / 2 + (f.id % 3 - 1) * 40, f.x1], y: [f.y0, Math.min(f.y0, f.y1) - 60 - (f.id % 4) * 14, f.y1], opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 0.8] }}
              transition={{ duration: 0.75, delay: 0.08 + f.d, ease: 'easeInOut', times: [0, 0.5, 1] }} />
          ))}
          <AnimatePresence>{finale && (
            <motion.div key="finale" className="fixed inset-0" style={{ zIndex: 910, pointerEvents: 'none' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <motion.div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 45%, rgba(255,220,120,0.55), rgba(255,180,60,0.18) 40%, rgba(0,0,0,0) 70%)' }} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.5] }} transition={{ duration: 1.2 }} />
              <motion.div className="absolute" style={{ left: '50%', top: '45%', width: 420, height: 420, marginLeft: -210, marginTop: -210, borderRadius: '50%', background: 'repeating-conic-gradient(from 0deg, rgba(255,226,140,0.7) 0deg 6deg, rgba(255,226,140,0) 6deg 18deg)', WebkitMaskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,0.5) 40%, transparent 70%)', maskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,0.5) 40%, transparent 70%)' }}
                initial={{ opacity: 0, scale: 0.4, rotate: 0 }} animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1.1, 1.4], rotate: 50 }} transition={{ duration: 1.6, ease: 'easeOut' }} />
              <motion.div className="absolute text-center" style={{ left: 0, right: 0, top: '41%', fontFamily: CINZEL, fontWeight: 900, fontSize: 26, letterSpacing: '0.12em', color: '#fff0b8', textTransform: 'uppercase', textShadow: '0 3px 6px #000, 0 0 22px rgba(255,200,80,0.95)' }}
                initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: [0.4, 1.25, 1], opacity: [0, 1, 1] }} transition={{ duration: 0.5, ease: 'easeOut' }}>Missões completas!</motion.div>
            </motion.div>)}
          </AnimatePresence></>, document.body)}
        {board === undefined && <div style={{ textAlign: 'center', color: '#cdbd97', fontFamily: SERIF, padding: 30 }}>Carregando…</div>}
        {board === null && <div style={{ textAlign: 'center', color: '#f0a595', fontFamily: SERIF, padding: 30 }}>{error || 'Não foi possível carregar as missões.'} Entre com uma conta e tente de novo.</div>}
        {board && (<>
          <div className="flex justify-between items-center" style={{ margin: '0 8px 6px' }}>
            <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 13, color: '#ecdfbf', textShadow: '0 1px 2px #000' }}>Hoje: <b style={{ color: '#ffe9a0' }}>{board.daily.filter(x => x.claimed).length}/{board.daily.length}</b> coletadas</span>
            <motion.div ref={balRef} key={bump} className="flex items-center" style={{ gap: 5, padding: '2px 12px 2px 6px', borderRadius: 16, background: 'linear-gradient(#4a300c,#22140a)', border: '1.5px solid #d9b25a', boxShadow: '0 2px 6px rgba(0,0,0,0.7)', fontFamily: CINZEL, fontWeight: 900, fontSize: 15, color: '#fff0c0' }}
              initial={bump ? { scale: 1.3, boxShadow: '0 0 22px rgba(255,210,100,0.95)' } : false} animate={{ scale: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.7)' }} transition={{ duration: 0.5 }}>
              <img src={iconeCoroa} alt="" draggable={false} style={{ width: 20, height: 20, objectFit: 'contain' }} />{bal}
            </motion.div>
          </div>
          <div className="flex justify-center" style={{ margin: '0 0 6px' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className="relative" style={{ width: 104, height: 44, backgroundImage: `url(${tab === t.id ? abaAtiva : abaInativa})`, backgroundSize: '100% 100%', border: 'none', paddingTop: 3, fontFamily: CINZEL, fontWeight: tab === t.id ? 900 : 700, fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', color: tab === t.id ? '#2a1a05' : '#a89a78' }}>
                {t.label}
                {ready(t.id) > 0 && <span className="absolute grid place-items-center" style={{ right: 5, top: 2, zIndex: 3, minWidth: 15, height: 15, borderRadius: 8, background: '#c93a2a', border: '1.5px solid #ffd9d0', color: '#fff', fontFamily: CINZEL, fontWeight: 900, fontSize: 9, boxShadow: '0 1px 3px #000' }}>{ready(t.id)}</span>}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center" style={{ margin: '2px 12px 6px', fontFamily: SERIF, fontWeight: 600, fontSize: 12.5, color: '#ecdfbf', textShadow: '0 1px 2px #000' }}>
            <b style={{ fontFamily: CINZEL, fontWeight: 800, fontSize: 11, letterSpacing: '0.1em', color: '#ffd978', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{tab === 'daily' ? `Renovam em ${left(board.dayEndsAt, now)}` : tab === 'weekly' ? `Renovam em ${left(board.weekEndsAt, now)}` : 'Valem nesta temporada'}</b>
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
export const MissionsHost = ({ open, ...p }: { open: boolean; onClose: () => void; onCoroas: (balance: number) => void; onBoard?: (claimable: number) => void; coroas: number }) => <AnimatePresence>{open && <MissionsScreen key="missions" {...p} />}</AnimatePresence>;
