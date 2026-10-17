import type React from 'react';
// Ranked mode screens: Ligas (my league and all of them), Ranking (the list), the end-of-match result with the points bar, and the
// promotion celebration. Art: src/assets/kit-rank (UI kit), src/assets/ligas (league emblems and portrait rings). Mockups: docs/janelas/ranqueado-*.png.
import { memo, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LEAGUES, LEAGUE_NAMES, ROMAN, SEASON_COROAS, leagueOf, type League } from './engine/ranked';
import { claimSeason, fetchRanked, fetchRanking, type RankedView, type RankingRow, type RewardInfo } from './services/online';
import janela from './assets/kit-rank/janela.png';
import fitaCoroa from './assets/kit-rank/fita-coroa.png';
import barraMoldura from './assets/kit-rank/barra-moldura.png';
import encOuro from './assets/kit-rank/enchimento-ouro.png';
import encVerde from './assets/kit-rank/enchimento-verde.png';
import encVermelho from './assets/kit-rank/enchimento-vermelho.png';
import gemaCheia from './assets/kit-rank/gema-cheia.png';
import gemaVazia from './assets/kit-rank/gema-vazia.png';
import abaAtiva from './assets/kit-rank/aba-ativa.png';
import abaInativa from './assets/kit-rank/aba-inativa.png';
import linhaNormal from './assets/kit-rank/linha-normal-livre.png';
import linhaAtual from './assets/kit-rank/linha-atual-livre.png';
import faixaTemporada from './assets/kit-rank/faixa-temporada.png';
import botaoPrimario from './assets/kit-rank/botao-primario.png';
import botaoSecundario from './assets/kit-rank/botao-secundario.png';
import medOuro from './assets/kit-rank/medalha-ouro.png';
import medPrata from './assets/kit-rank/medalha-prata.png';
import medBronze from './assets/kit-rank/medalha-bronze.png';
import iconeCoroa from './assets/ui-icon-coroa.webp';
import symFerro from './assets/ligas/simbolo-ferro.webp';
import symBronze from './assets/ligas/simbolo-bronze.webp';
import symPrata from './assets/ligas/simbolo-prata.webp';
import symOuro from './assets/ligas/simbolo-ouro.webp';
import symPlatina from './assets/ligas/simbolo-platina.webp';
import symDiamante from './assets/ligas/simbolo-diamante.webp';
import symMestre from './assets/ligas/simbolo-mestre.webp';
import symTopo from './assets/ligas/simbolo-senhor-da-guerra.webp';
import ringFerro from './assets/ligas/ferro.webp';
import ringBronze from './assets/ligas/bronze.webp';
import ringPrata from './assets/ligas/prata.webp';
import ringOuro from './assets/ligas/ouro.webp';
import ringPlatina from './assets/ligas/platina.webp';
import ringDiamante from './assets/ligas/diamante.webp';
import ringMestre from './assets/ligas/mestre.webp';
import ringSenhorDaGuerra from './assets/ligas/senhor-da-guerra.webp';

export type LeagueKey = League | 'senhor-da-guerra';
export const EMBLEM: Record<LeagueKey, string> = { ferro: symFerro, bronze: symBronze, prata: symPrata, ouro: symOuro, platina: symPlatina, diamante: symDiamante, mestre: symMestre, 'senhor-da-guerra': symTopo };
const RING: Record<LeagueKey, string> = { ferro: ringFerro, bronze: ringBronze, prata: ringPrata, ouro: ringOuro, platina: ringPlatina, diamante: ringDiamante, mestre: ringMestre, 'senhor-da-guerra': ringSenhorDaGuerra };
// The league ring around a portrait: the image is 3x the portrait (its hole is a third of the width), so it is laid over it and spills out.
export const LeagueRing = ({ league, size }: { league: string; size: number }) => {
  const src = RING[league as LeagueKey];
  if (!src) return null;
  return <img src={src} alt="" draggable={false} className="absolute pointer-events-none select-none" style={{ width: size * 3, height: size * 3, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', maxWidth: 'none' }} />;
};
const LEAGUE_COLOR: Record<LeagueKey, string> = { ferro: '#c3c9d0', bronze: '#e2a56a', prata: '#eef3f8', ouro: '#ffe08a', platina: '#b8fff2', diamante: '#bcd7ff', mestre: '#e2c0ff', 'senhor-da-guerra': '#ffd36a' };
const RANGES: Record<League, string> = { ferro: '0–399', bronze: '400–799', prata: '800–1199', ouro: '1200–1599', platina: '1600–1999', diamante: '2000–2399', mestre: '2400+' };
export const keyOfPoints = (points: number): League => leagueOf(points).league;
export const labelOfPoints = (points: number, top = false): string => { const l = leagueOf(points); return l.league === 'mestre' ? (top ? LEAGUE_NAMES['senhor-da-guerra'] : LEAGUE_NAMES.mestre) : `${LEAGUE_NAMES[l.league]} ${ROMAN[l.division!]}`; };

const DECO = "'Cinzel Decorative', 'Cinzel', serif";
const CINZEL = "'Cinzel', serif";
const SERIF = "'Crimson Pro', Georgia, serif";

// ── Pieces ──────────────────────────────────────────────────────────────────
const Win = ({ title, children, footer, onClose }: { title: string; children: ReactNode; footer?: ReactNode; onClose: () => void }) => (
  <motion.div className="fixed inset-0 z-[620]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
    style={{ background: 'rgba(6,4,2,0.9)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
    <div className="absolute inset-x-2 top-2 bottom-2 mx-auto max-w-[460px]" onClick={e => e.stopPropagation()}
      style={{ border: '34px solid transparent', borderImage: `url(${janela}) 95 fill / 34px stretch`, filter: 'drop-shadow(0 8px 24px #000)' }}>
      <div className="absolute left-1/2 z-10" style={{ top: -62, transform: 'translateX(-50%)', width: 236, height: 73, backgroundImage: `url(${fitaCoroa})`, backgroundSize: '100% 100%', display: 'grid', placeItems: 'center' }}>
        <span style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: title.length > 9 ? 14 : 17, letterSpacing: title.length > 9 ? '0.12em' : '0.2em', paddingLeft: title.length > 9 ? '0.12em' : '0.2em', color: '#2a1a05', textShadow: '0 1px 0 rgba(255,240,180,.7)', textTransform: 'uppercase' }}>{title}</span>
      </div>
      <div className="absolute inset-0 flex flex-col" style={{ padding: '30px 2px 0' }}>
        <div className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>{children}</div>
        {footer && <div className="shrink-0 flex justify-center" style={{ padding: '8px 0 2px' }}>{footer}</div>}
      </div>
    </div>
  </motion.div>
);

export const KitButton = ({ children, primary, onClick, width = 210, height }: { children: ReactNode; primary?: boolean; onClick: () => void; width?: number; height?: number }) => (
  <button onClick={onClick} style={{ width: '100%', maxWidth: width, minWidth: 0, flex: '1 1 0', height: height ?? (primary ? 56 : 48), backgroundImage: `url(${primary ? botaoPrimario : botaoSecundario})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', border: 'none', color: primary ? '#2a1a05' : '#ecdcb8', fontFamily: CINZEL, fontWeight: 900, fontSize: 13, letterSpacing: '0.1em', paddingLeft: '0.1em', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{children}</button>
);

const Row = ({ current, locked, children, emblem }: { current?: boolean; locked?: boolean; children: ReactNode; emblem?: string; key?: React.Key }) => (
  <div className="relative" style={{ height: 56, marginBottom: 3, opacity: locked ? 0.85 : 1 }}>
    <div className="absolute inset-0" style={{ border: '18px solid transparent', borderImage: `url(${current ? linhaAtual : linhaNormal}) 38 fill / 18px stretch`, filter: locked ? 'grayscale(.85) brightness(.8)' : undefined }} />
    {emblem && <img src={emblem} alt="" draggable={false} className="absolute" style={{ left: 12, top: 7, width: 42, height: 42, objectFit: 'contain', filter: locked ? 'grayscale(.8) brightness(.7)' : undefined }} />}
    <div className="absolute flex items-center" style={{ left: emblem ? 62 : 14, right: 14, top: 0, bottom: 0, gap: 8 }}>{children}</div>
  </div>
);

const Divisions = ({ division }: { division: number | null }) => {
  if (division === null) return null;
  const filled = 5 - division;   // IV = 1 gem, I = 4 gems
  return <div className="flex" style={{ gap: 6, margin: '4px 0' }}>{[0, 1, 2, 3].map(i => <img key={i} src={i < filled ? gemaCheia : gemaVazia} alt="" draggable={false} style={{ width: 22, height: 27 }} />)}</div>;
};

// The glass tube: the gold part is where I am, `gain` (green) or `loss` (red hatched) is what the last match changed. Values are 0 to 100.
export const PointsBar = ({ base, gain = 0, loss = 0, width = 330, animate = true }: { base: number; gain?: number; loss?: number; width?: number; animate?: boolean }) => {
  const part = (img: string, left: number, w: number, delay: number) => (
    <motion.img src={img} alt="" draggable={false} style={{ position: 'absolute', top: 0, height: '100%', left: `${left}%`, objectFit: 'fill', transformOrigin: 'left' }}
      initial={animate ? { width: 0 } : false} animate={{ width: `${w}%` }} transition={{ duration: 0.9, delay, ease: 'easeOut' }} />);
  return (
    <div className="relative" style={{ width: '100%', maxWidth: width, aspectRatio: '4 / 1' }}>
      <img src={barraMoldura} alt="" draggable={false} className="absolute inset-0 w-full h-full" />
      <div className="absolute overflow-hidden" style={{ left: '12.3%', right: '12.1%', top: '17%', bottom: '22%', borderRadius: 14 }}>
        {part(encOuro, 0, loss > 0 ? Math.max(0, base - 0) : base, 0.2)}
        {gain > 0 && part(encVerde, base, gain, 1.1)}
        {loss > 0 && part(encVermelho, base, loss, 1.1)}
        {[25, 50, 75].map(x => <div key={x} className="absolute top-0 bottom-0" style={{ left: `${x}%`, width: 2, background: 'rgba(0,0,0,.6)', boxShadow: '1px 0 0 rgba(255,230,160,.2)' }} />)}
      </div>
    </div>
  );
};

const Emblem = ({ k, size, style }: { k: LeagueKey; size: number; style?: CSSProperties }) => <img src={EMBLEM[k]} alt="" draggable={false} style={{ width: size, height: size, objectFit: 'contain', filter: 'drop-shadow(0 4px 6px #000)', ...style }} />;

// ── Ligas ───────────────────────────────────────────────────────────────────
export const LigasScreen = ({ onClose, onRanking, onCoroas }: { onClose: () => void; onRanking?: () => void; onCoroas?: (balance: number) => void; key?: React.Key }) => {
  const [me, setMe] = useState<RankedView | null | undefined>(undefined);
  const [rewardsOpen, setRewardsOpen] = useState(false);
  useEffect(() => { let on = true; fetchRanked().then(r => { if (on) setMe(r); }); return () => { on = false; }; }, []);
  const key = (me?.league ?? 'ferro') as LeagueKey;
  const idx = LEAGUES.indexOf(me && me.league !== 'senhor-da-guerra' ? (me.league as League) : (me ? 'mestre' : 'ferro'));
  return (
    <>
    <Win title="Ligas" onClose={onClose} footer={<div className="flex w-full justify-center" style={{ gap: 4 }}>{onRanking && <KitButton onClick={onRanking}>Ranking</KitButton>}<KitButton onClick={onClose} width={onRanking ? 150 : 210}>Voltar</KitButton></div>}>
      <div className="flex flex-col items-center relative" style={{ paddingTop: 22 }}>
        <button onClick={() => setRewardsOpen(true)} aria-label="Ver recompensas" className="absolute flex flex-col items-center" style={{ right: 4, top: 10, background: 'none', border: 'none', zIndex: 2 }}>
          <span className="grid place-items-center" style={{ width: 46, height: 46, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #4a3512, #150e08)', boxShadow: 'inset 0 0 0 2px #d9b45a, 0 0 10px rgba(255,205,90,.35), 0 3px 6px #000' }}>
            <img src={iconeCoroa} alt="" draggable={false} style={{ width: 28, height: 28, objectFit: 'contain' }} />
          </span>
          {!!me?.pending.length && <span className="absolute" style={{ right: 0, top: 0, width: 14, height: 14, borderRadius: '50%', background: '#e0482f', boxShadow: '0 0 0 2px #1a0f08, 0 0 8px #ff7a4a', color: '#fff', fontFamily: CINZEL, fontWeight: 900, fontSize: 9, display: 'grid', placeItems: 'center' }}>{me.pending.length}</span>}
          <span style={{ fontFamily: CINZEL, fontWeight: 800, fontSize: 8, letterSpacing: '0.04em', color: '#e8d6b0', marginTop: 3, textTransform: 'uppercase' }}>Recompensas</span>
        </button>
        {me === undefined ? <div style={{ color: '#cdbd97', fontFamily: SERIF, padding: 40 }}>Carregando…</div> : (
          <>
            <Emblem k={key} size={112} />
            <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 18, letterSpacing: '0.14em', color: LEAGUE_COLOR[key], textShadow: '0 2px 4px #000', textTransform: 'uppercase' }}>{me?.label ?? 'Ferro IV'}</div>
            <Divisions division={me ? me.division : 4} />
            <PointsBar base={me?.inDivision ?? 0} />
            <div className="flex justify-between" style={{ width: '100%', maxWidth: 300, padding: '0 6px', boxSizing: 'border-box', marginTop: -4, fontFamily: CINZEL, fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', color: '#cdbd97' }}>
              <span>{me ? (me.division === null ? `${me.points} pontos` : `${me.inDivision} / 100`) : '0 / 100'}</span>
              <span>{me && me.placementLeft > 0 ? `Classificação: faltam ${me.placementLeft}` : me?.shield ? 'Escudo ativo' : ''}</span>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 12, color: '#a89a78', margin: '4px 0 8px' }}>{me ? `${me.wins} vitórias · ${me.losses} derrotas` : 'Jogue uma partida ranqueada para começar'}</div>
            <div style={{ width: 'calc(100% - 12px)' }}>
              {LEAGUES.map((l, i) => (
                <Row key={l} current={i === idx} locked={i > idx} emblem={EMBLEM[l]}>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><b style={{ display: 'block', fontFamily: CINZEL, fontWeight: 800, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: LEAGUE_COLOR[l] }}>{LEAGUE_NAMES[l]}</b></div>
                  <div style={{ textAlign: 'right', flex: 'none' }}><u style={{ display: 'block', textDecoration: 'none', fontFamily: CINZEL, fontWeight: 800, fontSize: 14, color: '#e8d6b0', whiteSpace: 'nowrap' }}>{RANGES[l]}</u><i style={{ display: 'block', fontFamily: SERIF, fontSize: 11, color: '#a89a78', fontStyle: 'normal' }}>pontos</i></div>
                </Row>
              ))}
              <Row locked={!(me && me.top)} emblem={EMBLEM['senhor-da-guerra']}>
                <div style={{ flex: '1 1 0', minWidth: 0 }}><b style={{ display: 'block', fontFamily: CINZEL, fontWeight: 800, fontSize: 11.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: LEAGUE_COLOR['senhor-da-guerra'], lineHeight: 1.1 }}>Senhor da Guerra</b></div>
                <div style={{ textAlign: 'right', flex: 'none' }}><u style={{ display: 'block', textDecoration: 'none', fontFamily: CINZEL, fontWeight: 800, fontSize: 12, color: '#e8d6b0', whiteSpace: 'nowrap' }}>os 50 melhores</u><i style={{ display: 'block', fontFamily: SERIF, fontSize: 11, color: '#a89a78', fontStyle: 'normal' }}>do Mestre</i></div>
              </Row>
            </div>
          </>
        )}
      </div>
    </Win>
    <AnimatePresence>{rewardsOpen && <RewardsScreen key="rewards" me={me ?? null} onClose={() => setRewardsOpen(false)} onClaimed={(profile, balance) => { setMe(profile); onCoroas?.(balance); }} />}</AnimatePresence>
    </>
  );
};

// What a season pays, by the highest league reached: the portrait frame of that league and Coroas (`SEASON_COROAS`, in engine/ranked.ts).
const daysLeftText = (endsAt: number) => { const d = Math.ceil((endsAt - Date.now()) / 86400000); return d <= 1 ? 'termina hoje' : `termina em ${d} dias`; };
const nameOfLeague = (k: string) => LEAGUE_NAMES[k as LeagueKey] ?? k;
const RewardsScreen = ({ me, onClose, onClaimed }: { me: RankedView | null; onClose: () => void; onClaimed: (profile: RankedView, balance: number) => void; key?: React.Key }) => {
  const [busy, setBusy] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const claim = async (season: number) => {
    setBusy(season); setFailed(false);
    const r = await claimSeason(season);
    setBusy(null);
    if (r) onClaimed(r.profile, r.coroas_after); else setFailed(true);
  };
  return (
    <Win title="Recompensas" onClose={onClose} footer={<KitButton onClick={onClose}>Voltar</KitButton>}>
      <div style={{ padding: '14px 12px 0' }}>
        {me?.pending.map(p => (
          <div key={p.season} className="flex flex-col items-center" style={{ gap: 6, margin: '0 0 12px', padding: '10px 10px 6px', borderRadius: 10, background: 'linear-gradient(180deg, rgba(120,84,20,.55), rgba(40,26,8,.7))', boxShadow: 'inset 0 0 0 1.5px #d9b45a, 0 0 14px rgba(255,205,90,.3)' }}>
            <div className="flex items-center" style={{ gap: 10, width: '100%' }}>
              <Emblem k={p.league as LeagueKey} size={48} />
              <div className="flex-1 min-w-0" style={{ fontFamily: SERIF, fontSize: 13, color: '#f3e3bd', lineHeight: 1.25 }}>
                <b style={{ fontFamily: CINZEL, fontSize: 11.5, letterSpacing: '0.06em', color: '#ffe08a', textTransform: 'uppercase' }}>Temporada {p.season} encerrada</b><br />
                Você chegou à liga {nameOfLeague(p.league)}: moldura e <b style={{ color: '#ffe08a' }}>{p.coroas} coroas</b>.
              </div>
            </div>
            <div className="flex w-full justify-center"><KitButton primary width={200} onClick={() => { if (busy === null) void claim(p.season); }}>{busy === p.season ? '…' : 'Resgatar'}</KitButton></div>
          </div>
        ))}
        {failed && <div style={{ textAlign: 'center', fontFamily: SERIF, fontSize: 12, color: '#ff9a8a', margin: '0 0 8px' }}>Não deu para resgatar agora. Tente de novo.</div>}
        <div style={{ textAlign: 'center', fontFamily: SERIF, fontSize: 13, color: '#cdbd97', margin: '0 8px 6px' }}>No fim da temporada você recebe a moldura do retrato e as coroas da <b style={{ color: '#ffe08a' }}>maior liga</b> que alcançou. Os pontos caem pela metade e as 5 partidas de classificação voltam.</div>
        {me && <div style={{ textAlign: 'center', fontFamily: CINZEL, fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', color: '#e8d6b0', margin: '0 0 10px', textTransform: 'uppercase' }}>Temporada {me.season} {daysLeftText(me.endsAt)}{me.frame ? ` · sua moldura: ${nameOfLeague(me.frame)}` : ''}</div>}
        {([...LEAGUES, 'senhor-da-guerra'] as LeagueKey[]).map(k => (
          <Row key={k} emblem={EMBLEM[k]}>
            <div style={{ flex: '1 1 0', minWidth: 0 }}><b style={{ display: 'block', fontFamily: CINZEL, fontWeight: 800, fontSize: 11.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: LEAGUE_COLOR[k], lineHeight: 1.1 }}>{LEAGUE_NAMES[k]}</b></div>
            <div className="flex-1" style={{ textAlign: 'right' }}>{['Moldura', `${SEASON_COROAS[k]} coroas`].map(t => <div key={t} style={{ fontFamily: SERIF, fontSize: 12.5, color: '#f3e3bd', lineHeight: 1.2 }}>{t}</div>)}</div>
          </Row>
        ))}
      </div>
    </Win>
  );
};

// ── Ranking ─────────────────────────────────────────────────────────────────
export const RankingScreen = ({ onClose, onLigas }: { onClose: () => void; onLigas?: () => void; key?: React.Key }) => {
  const [data, setData] = useState<{ rows: RankingRow[]; me: RankedView } | null | undefined>(undefined);
  const [tab, setTab] = useState<'global' | 'minha'>('global');
  useEffect(() => { let on = true; fetchRanking(50).then(r => { if (on) setData(r); }); return () => { on = false; }; }, []);
  const rows = data ? (tab === 'global' ? data.rows : data.rows.filter(r => keyOfPoints(r.points) === keyOfPoints(data.me.points))) : [];
  const meInList = !!data && data.rows.some(r => r.me);
  const tabBtn = (id: 'global' | 'minha', label: string, on: boolean) => (
    <button key={id} onClick={() => setTab(id)} style={{ flex: 1, height: 34, backgroundImage: `url(${on ? abaAtiva : abaInativa})`, backgroundSize: '100% 100%', border: 'none', fontFamily: CINZEL, fontWeight: 800, fontSize: 10, letterSpacing: '0.1em', paddingLeft: '0.1em', color: on ? '#2a1a05' : '#cdbd97', textTransform: 'uppercase' }}>{label}</button>);
  const line = (r: { rank: number; name: string; points: number; label: string; top: boolean; me: boolean }) => {
    const k = (r.top ? 'senhor-da-guerra' : keyOfPoints(r.points)) as LeagueKey;
    const med = r.rank === 1 ? medOuro : r.rank === 2 ? medPrata : r.rank === 3 ? medBronze : null;
    return (
      <Row key={`${r.rank}-${r.name}`} current={r.me} emblem={EMBLEM[k]}>
        <div className="shrink-0 grid place-items-center" style={{ width: 30, height: 30, backgroundImage: med ? `url(${med})` : undefined, backgroundSize: '100% 100%', fontFamily: CINZEL, fontWeight: 900, fontSize: med ? 13 : 13, color: med ? '#2a1a05' : '#cdbd97' }}>{r.rank}</div>
        <div className="flex-1 min-w-0"><b className="block truncate" style={{ fontFamily: CINZEL, fontWeight: 800, fontSize: 12.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: r.me ? '#ffe08a' : '#f3e3bd' }}>{r.me ? 'Você' : r.name}</b><i style={{ display: 'block', fontFamily: SERIF, fontSize: 11, color: '#cdbd97', fontStyle: 'normal' }}>{r.label}</i></div>
        <b style={{ fontFamily: CINZEL, fontWeight: 800, fontSize: 14, color: '#ffe08a' }}>{r.points}</b>
      </Row>
    );
  };
  return (
    <Win title="Ranking" onClose={onClose} footer={<div className="flex w-full justify-center" style={{ gap: 4 }}>{onLigas && <KitButton onClick={onLigas} width={150}>Ligas</KitButton>}<KitButton onClick={onClose} width={onLigas ? 150 : 210}>Voltar</KitButton></div>}>
      <div style={{ padding: '4px 12px 0' }}>
        <div className="relative mx-auto" style={{ width: '100%', maxWidth: 316, aspectRatio: '316 / 118', marginBottom: 4, containerType: 'inline-size' }}>
          <img src={faixaTemporada} alt="" draggable={false} className="absolute inset-0 w-full h-full" />
          <div className="absolute flex flex-col items-center justify-center text-center" style={{ left: '14%', right: '14%', top: '40%', bottom: '12%' }}>
            <div style={{ fontFamily: DECO, fontWeight: 900, fontSize: '6.6cqw', letterSpacing: '0.06em', paddingLeft: '0.06em', whiteSpace: 'nowrap', color: '#3a2a10', textShadow: '0 1px 0 rgba(255,240,190,.85),0 2px 3px rgba(60,40,10,.35)', lineHeight: 1 }}>TEMPORADA {data?.me.season ?? 1}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '4.4cqw', color: '#4a3820', marginTop: 4 }}>{data?.me ? daysLeftText(data.me.endsAt) : 'em andamento'}</div>
          </div>
        </div>
        <div className="flex" style={{ gap: 4, margin: '0 0 8px' }}>{tabBtn('global', 'Global', tab === 'global')}{tabBtn('minha', 'Minha liga', tab === 'minha')}</div>
        {data === undefined && <div style={{ textAlign: 'center', color: '#cdbd97', fontFamily: SERIF, padding: 30 }}>Carregando…</div>}
        {data === null && <div style={{ textAlign: 'center', color: '#f0a595', fontFamily: SERIF, padding: 30 }}>Não foi possível carregar o ranking. Entre com uma conta e tente de novo.</div>}
        {data && rows.length === 0 && <div style={{ textAlign: 'center', color: '#cdbd97', fontFamily: SERIF, padding: 30 }}>Ainda não há jogadores aqui. Jogue uma partida ranqueada!</div>}
        {rows.map(line)}
        {data && !meInList && (<>
          <div style={{ textAlign: 'center', color: '#6d5a37', letterSpacing: '0.4em', fontWeight: 900 }}>· · ·</div>
          {line({ rank: data.me.position, name: 'Você', points: data.me.points, label: data.me.label, top: data.me.top, me: true })}
        </>)}
      </div>
    </Win>
  );
};

// ── End of a ranked match ───────────────────────────────────────────────────
// The points part of the result screen: league emblem, +N or -N, the bar and what changed (shield, placement). `reward.ranked` comes from the server.
export const RankedResult = ({ reward }: { reward: RewardInfo }) => {
  const r = reward.ranked;
  if (!r) return null;
  const now = r.profile.points, before = Math.max(0, now - r.delta);
  const lAfter = leagueOf(now), lBefore = leagueOf(before);
  const sameLeague = lAfter.league === lBefore.league;
  const k = lAfter.league as LeagueKey;
  const startIn = sameLeague ? ((lBefore.division === lAfter.division) ? lBefore.inDivision : lBefore.inDivision) : 0;
  // within one division the bar shows the move; crossing a division it restarts at the new division
  const crossed = lBefore.division !== lAfter.division || !sameLeague;
  const base = r.delta >= 0 ? (crossed ? 0 : lBefore.inDivision) : Math.max(0, lAfter.inDivision);
  const gain = r.delta > 0 ? (crossed ? lAfter.inDivision : r.delta) : 0;
  const loss = r.delta < 0 ? (crossed ? 0 : Math.min(-r.delta, lBefore.inDivision)) : 0;
  void startIn;
  return (
    <div className="flex flex-col items-center" style={{ gap: 2 }}>
      <Emblem k={k} size={132} />
      <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 15, letterSpacing: '0.14em', color: '#f6e7c4', textTransform: 'uppercase' }}>{r.league_after}</div>
      <Divisions division={lAfter.division} />
      <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 36, color: r.delta > 0 ? '#8fe0a4' : r.delta < 0 ? '#f0a595' : '#e8d6b0', textShadow: '0 2px 8px #000', lineHeight: 1.1 }}>{r.delta > 0 ? `+${r.delta}` : r.delta < 0 ? `−${-r.delta}` : '0'}</div>
      <div style={{ fontFamily: SERIF, fontSize: 12, color: '#dccfae', marginBottom: 2 }}>pontos de liga{r.placement ? ' · partida de classificação' : ''}</div>
      <PointsBar base={base} gain={gain} loss={loss} width={300} />
      <div style={{ fontFamily: SERIF, fontSize: 12, color: '#9ad0ff', marginTop: -2, minHeight: 16, textAlign: 'center', maxWidth: 300 }}>{r.repeat ? 'Muitas partidas hoje contra o mesmo adversário: sem pontos desta vez' : r.shield_used ? 'O escudo protegeu você: nenhum ponto perdido' : r.profile.shield ? 'Escudo ativo: a próxima derrota não custa pontos' : ''}</div>
    </div>
  );
};

// memo: the parent re-renders when its stage changes, and that must not restart the burst
const PromoBurst = memo(({ c, to }: { c: string; to: LeagueKey }) => (
  <>
    <motion.div className="absolute" style={{ inset: -40, borderRadius: '50%', background: `radial-gradient(circle, #fff 0%, ${c} 35%, ${c}00 70%)` }} initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: [0, 1, 0], scale: [0.3, 1.5, 2.1] }} transition={{ duration: 1.1, times: [0, 0.3, 1], ease: 'easeOut' }} />
    <motion.img src={EMBLEM[to]} alt="" draggable={false} className="absolute inset-0 w-full h-full object-contain" style={{ filter: `drop-shadow(0 0 22px ${c})` }}
      initial={{ opacity: 0, scale: 0.25 }} animate={{ opacity: 1, scale: [0.25, 1.18, 1] }} transition={{ delay: 0.15, opacity: { duration: 0.35, ease: 'easeOut' }, scale: { duration: 0.9, times: [0, 0.6, 1], ease: 'easeOut' } }} />
    {Array.from({ length: 14 }).map((_, i) => {
      const a = (i / 14) * Math.PI * 2, d = 120 + (i % 3) * 30;
      return <motion.span key={i} className="absolute" style={{ left: '50%', top: '50%', width: 7, height: 7, marginLeft: -3.5, marginTop: -3.5, borderRadius: '50%', background: c, boxShadow: `0 0 8px ${c}` }}
        initial={{ opacity: 1, x: 0, y: 0, scale: 1 }} animate={{ opacity: 0, x: Math.cos(a) * d, y: Math.sin(a) * d, scale: 0.2 }} transition={{ duration: 1.2 + (i % 4) * 0.12, delay: 0.25, ease: 'easeOut' }} />;
    })}
  </>
));

// ── Promotion: the new league's emblem arrives with a flash ─────────────────
export const PromotionOverlay = ({ from, to, label, onDone }: { from: LeagueKey; to: LeagueKey; label: string; onDone: () => void; key?: React.Key }) => {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  useEffect(() => { const a = window.setTimeout(() => setStage(1), 900); const b = window.setTimeout(() => setStage(2), 1500); return () => { window.clearTimeout(a); window.clearTimeout(b); }; }, []);
  const c = LEAGUE_COLOR[to];
  return (
    <motion.div className="fixed inset-0 z-[700] flex flex-col items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
      style={{ background: 'radial-gradient(ellipse at 50% 42%, rgba(46,30,12,.96), rgba(5,3,1,.98) 75%)' }} onClick={() => { if (stage === 2) onDone(); }}>
      {/* slow rays behind the emblem, after the flash */}
      <motion.div className="absolute" style={{ left: '50%', top: '42%', width: 640, height: 640, margin: '-320px 0 0 -320px', borderRadius: '50%', background: `repeating-conic-gradient(from 0deg, ${c}00 0deg, ${c}38 5deg, ${c}00 10deg)`, WebkitMask: 'radial-gradient(circle, #000 0, transparent 68%)', mask: 'radial-gradient(circle, #000 0, transparent 68%)' }}
        initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: stage >= 1 ? 1 : 0, rotate: 360 }} transition={{ opacity: { duration: 0.8 }, rotate: { duration: 40, repeat: Infinity, ease: 'linear' } }} />
      <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 13, letterSpacing: '0.34em', paddingLeft: '0.34em', color: '#ffd36a', textShadow: '0 2px 6px #000', marginBottom: 14, opacity: stage >= 2 ? 1 : 0, transition: 'opacity .6s' }}>SUBIU DE LIGA</div>
      <div className="relative" style={{ width: 260, height: 260 }}>
        {/* the old emblem shrinks and fades */}
        <motion.img src={EMBLEM[from]} alt="" draggable={false} className="absolute inset-0 w-full h-full object-contain" initial={{ opacity: 1, scale: 1 }} animate={{ opacity: stage >= 1 ? 0 : 1, scale: stage >= 1 ? 0.7 : 1, filter: stage >= 1 ? 'blur(6px) brightness(2)' : 'blur(0px) brightness(1)' }} transition={{ duration: 0.6 }} />
        {/* the flash and the new emblem start once (stage 1) and are not touched again by later stage changes */}
        {stage >= 1 && <PromoBurst c={c} to={to} />}
      </div>
      <motion.div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 24, letterSpacing: '0.16em', paddingLeft: '0.16em', color: c, textShadow: '0 2px 8px #000', marginTop: 8, textTransform: 'uppercase' }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 12 }} transition={{ duration: 0.6 }}>{label}</motion.div>
      <div style={{ marginTop: 26, opacity: stage >= 2 ? 1 : 0, transition: 'opacity .6s .5s' }}><KitButton primary onClick={onDone} width={200}>Continuar</KitButton></div>
    </motion.div>
  );
};

export { AnimatePresence };

// ── Match dialogs (same kit as the screens above) ───────────────────────────
// A small confirm window: used instead of the phone's own confirm() box. The safe answer is the gold button.
export const ConfirmDialog = ({ title, text, confirmLabel, cancelLabel, onConfirm, onCancel }: { title: string; text: ReactNode; confirmLabel: string; cancelLabel: string; onConfirm: () => void; onCancel: () => void; key?: React.Key }) => (
  <motion.div className="fixed inset-0 z-[620] grid place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
    style={{ background: 'rgba(6,4,2,0.82)', backdropFilter: 'blur(3px)', padding: '0 14px' }} onClick={onCancel}>
    <motion.div className="relative" onClick={e => e.stopPropagation()} initial={{ scale: 0.9, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0 }} transition={{ type: 'spring', damping: 20, stiffness: 260 }}
      style={{ width: 'min(100%, 340px)', border: '34px solid transparent', borderImage: `url(${janela}) 95 fill / 34px stretch`, filter: 'drop-shadow(0 8px 24px #000)', marginTop: 40 }}>
      <div className="absolute left-1/2 z-10" style={{ top: -62, transform: 'translateX(-50%)', width: 236, height: 73, backgroundImage: `url(${fitaCoroa})`, backgroundSize: '100% 100%', display: 'grid', placeItems: 'center' }}>
        <span style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 17, letterSpacing: '0.2em', paddingLeft: '0.2em', color: '#2a1a05', textShadow: '0 1px 0 rgba(255,240,180,.7)', textTransform: 'uppercase' }}>{title}</span>
      </div>
      <div style={{ padding: '14px 4px 6px', textAlign: 'center', fontFamily: SERIF, fontSize: 15, lineHeight: 1.35, color: '#f3e3bd' }}>{text}</div>
      <div className="flex w-full justify-center" style={{ gap: 4, paddingTop: 8 }}>
        <KitButton primary onClick={onCancel} width={150} height={52}>{cancelLabel}</KitButton>
        <KitButton onClick={onConfirm} width={150} height={52}>{confirmLabel}</KitButton>
      </div>
    </motion.div>
  </motion.div>
);

const Chip = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center" style={{ gap: 6, padding: '5px 13px', borderRadius: 999, background: 'rgba(0,0,0,.5)', boxShadow: 'inset 0 0 0 1.5px #8a6a2a', fontFamily: CINZEL, fontWeight: 900, fontSize: 14, letterSpacing: '0.06em', color: '#ffe08a' }}>{children}</span>
);

// Everything under the Vitória/Derrota banner: what the match paid, the ladder result when ranked, and the way back to the menu.
export const MatchResult = ({ won, reward, onMenu }: { won: boolean; reward: RewardInfo | 'pending' | null; onMenu?: () => void }) => {
  const paid = reward && reward !== 'pending' && (reward.reason === 'win' || reward.reason === 'loss');
  const note = reward && reward !== 'pending' ? (reward.reason === 'too_short' ? 'Partida curta demais para render recompensas.' : reward.reason === 'abandoned' ? 'Partida abandonada: sem recompensas.' : '') : '';
  return (
    <motion.div className="flex flex-col items-center" style={{ gap: 12, width: 'min(92vw, 360px)' }} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
      <div style={{ fontFamily: SERIF, fontSize: 16, color: won ? '#f3e3bd' : '#cdbd97', textAlign: 'center' }}>{won ? 'O General inimigo caiu em batalha.' : 'Seu General caiu em batalha.'}</div>
      {reward === 'pending' && <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: 11, letterSpacing: '0.18em', color: '#e8c766', textTransform: 'uppercase' }}>Calculando recompensas…</div>}
      {reward && reward !== 'pending' && (note || paid || reward.ranked) && (
        <div className="w-full" style={{ border: '26px solid transparent', borderImage: `url(${janela}) 95 fill / 26px stretch`, filter: 'drop-shadow(0 6px 18px #000)' }}>
          <div className="flex flex-col items-center" style={{ gap: 8, margin: '-8px -6px -6px' }}>
            {note && <div style={{ fontFamily: SERIF, fontSize: 14, color: '#cdbd97', textAlign: 'center' }}>{note}</div>}
            {reward.ranked && <RankedResult reward={reward} />}
            {paid && (
              <>
                <div className="flex items-center justify-center" style={{ gap: 8 }}>
                  <Chip>+{reward.xp} XP</Chip>
                  {reward.coroas > 0 && <Chip><img src={iconeCoroa} alt="" draggable={false} style={{ width: 18, height: 18, objectFit: 'contain' }} />+{reward.coroas}</Chip>}
                </div>
                {!!reward.first_win && <div style={{ fontFamily: CINZEL, fontWeight: 800, fontSize: 11, letterSpacing: '0.14em', color: '#ffe08a', textTransform: 'uppercase' }}>Primeira vitória do dia · +{reward.first_win} coroas</div>}
                {reward.levels_gained > 0 && <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 13, letterSpacing: '0.16em', color: '#ffe08a', textShadow: '0 0 12px rgba(255,205,90,.6)', textTransform: 'uppercase' }}>★ Subiu para o nível {reward.level}! ★</div>}
              </>
            )}
          </div>
        </div>
      )}
      {onMenu && <div className="flex w-full justify-center"><KitButton primary onClick={onMenu} width={240}>Voltar ao menu</KitButton></div>}
    </motion.div>
  );
};
