import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './desafios.css';
import mapImage from './assets/desafios/map.webp';
import portraitCapitao from './assets/desafios/capitao.webp';
import portraitCardeal from './assets/desafios/cardeal.webp';
import portraitMercenarios from './assets/desafios/mercenarios.webp';

// Tela "Desafios": um mapa limpo com um pino por adversário; tocar num pino dá zoom na cidade e sobe o cartão do general
// (retrato, descrição, seus decks e o botão Batalha). Veio do mockup public/mockups/desafios (ver docs/visao-geral.md).
// Os dados (generais, decks salvos) vêm de fora; aqui só ficam o mapa e o jeito de escolher.

export type DzOpponent = { id: string; name: string; epithet: string; desc: string; style?: string };
export type DzDeck = { id: string; name: string; deckId: string; count: number; problem: string | null };

// Onde cada general mora no mapa (coordenadas na arte de 1024 px) e o clima de cada região.
const PLACES: Record<string, { px: number; py: number; region: string; lbl: string; tint: string; img?: string }> = {
  capitao: { px: 158, py: 488, region: 'Marca de Aurelion', lbl: 'Aurelion', tint: 'rgba(200,70,40,.5)', img: portraitCapitao },
  cardeal: { px: 676, py: 500, region: 'Sé de Pedro', lbl: 'Cardeal Anselmo', tint: 'rgba(240,200,90,.55)', img: portraitCardeal },
  mercenarios: { px: 790, py: 745, region: 'Porto das Meias-Coroas', lbl: 'Brann', tint: 'rgba(120,150,60,.5)', img: portraitMercenarios },
  bardos: { px: 432, py: 705, region: 'Vila do Javali Dourado', lbl: 'Aldric', tint: 'rgba(150,80,170,.45)' },
};
const LOCKED: DzOpponent[] = [{ id: 'bardos', name: 'Aldric Língua-de-Prata', epithet: 'Menestrel do Rei', desc: 'Em breve: cantores que se dão bônus entre si; em grupo ficam difíceis de abater.' }];

const MAPPX = 1150, ZOOM = MAPPX / 1024;
const PIN_SVG = '<svg viewBox="0 0 34 52"><path d="M17 51 C5 33 1 26 1 17 A16 16 0 0 1 33 17 C33 26 29 33 17 51Z" fill="#e0b04a" stroke="#3a2406" stroke-width="2"/><circle cx="17" cy="17" r="7" fill="#1a0f06" stroke="#3a2406" stroke-width="1.5"/><circle cx="17" cy="17" r="3.2" fill="#ffe9a6"/></svg>';
const LAST_DECK_KEY = 'pow-desafios-deck';

export const DesafiosScreen = ({ opponents, decks, onBack, onEditDecks, onStart }: {
  opponents: DzOpponent[]; decks: DzDeck[];
  onBack: () => void; onEditDecks: () => void; onStart: (deckSlotId: string, opponentId: string) => void; key?: import('react').Key;
}) => {
  const all = [...opponents, ...LOCKED.map(o => ({ ...o, locked: true }))] as (DzOpponent & { locked?: boolean })[];
  const [sel, setSel] = useState(-1);
  const [deckId, setDeckId] = useState<string>(() => {
    let last: string | null = null; try { last = localStorage.getItem(LAST_DECK_KEY); } catch { /* sem armazenamento */ }
    return (decks.find(d => d.id === last && !d.problem) ?? decks.find(d => !d.problem) ?? decks[0])?.id ?? '';
  });
  const [size, setSize] = useState({ w: 390, h: 520 });
  const [lx, setLx] = useState<number[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const lblRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dustRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const el = stageRef.current; if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure(); const ro = new ResizeObserver(measure); ro.observe(el); return () => ro.disconnect();
  }, []);

  // O mapa afastado (nenhum selecionado) ou com zoom na cidade escolhida.
  const o = sel >= 0 ? all[sel] : null, pl = o ? PLACES[o.id] : null;
  const aimX = size.w / 2, aimY = Math.round(size.h * (sel >= 0 ? .3 : .5));
  const ovScale = .42 * size.w / 390;
  const xs = all.map(a => PLACES[a.id].px * ZOOM), minX = Math.min(...xs), maxX = Math.max(...xs);
  const ovTx = size.w / 2 - (minX + maxX) / 2 * ovScale, ovTy = size.h / 2 - MAPPX / 2 * ovScale + 6;
  const zTx = pl ? Math.min(0, Math.max(size.w - MAPPX, aimX - pl.px * ZOOM)) : 0, zTy = pl ? Math.min(0, Math.max(size.h - MAPPX, aimY - pl.py * ZOOM)) : 0;
  // O pino do zoom fica exatamente sobre o ponto do mapa (o mapa trava nas bordas, então ele pode sair do alvo).
  const pinX = pl ? zTx + pl.px * ZOOM : aimX, pinY = pl ? zTy + pl.py * ZOOM : aimY;
  const mapTransform = sel < 0 ? `translate(${ovTx}px, ${ovTy}px) scale(${ovScale})` : `translate(${zTx}px, ${zTy}px) scale(1)`;

  // As plaquinhas dos pinos não podem sair da tela.
  useLayoutEffect(() => {
    setLx(all.map((a, i) => {
      const l = lblRefs.current[i]; if (!l) return 0;
      const x = ovTx + PLACES[a.id].px * ZOOM * ovScale, half = l.offsetWidth * 1.15 / 2 + 8;
      const cl = Math.min(size.w - half, Math.max(half, x)); return ((cl - x) / ovScale) / 1.15;
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w, size.h, all.length]);

  const select = useCallback((i: number) => {
    setSel(prev => {
      if (prev >= 0 && i >= 0 && prev !== i && fxRef.current) { const fx = fxRef.current; fx.classList.remove('hop'); void fx.offsetWidth; fx.classList.add('hop'); }
      return i;
    });
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (sel >= 0) setSel(-1); else onBack(); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [sel, onBack]);

  // poeira dourada no ar
  useEffect(() => {
    const cv = dustRef.current; if (!cv) return; const cx = cv.getContext('2d'); if (!cx) return;
    let W = 0, H = 0, raf = 0; const P = Array.from({ length: 34 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + .5, v: Math.random() * .012 + .004, ph: Math.random() * 6.28 }));
    const fit = () => { const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); cv.width = r.width * d; cv.height = r.height * d; cx.setTransform(d, 0, 0, d, 0, 0); W = r.width; H = r.height; };
    fit(); window.addEventListener('resize', fit);
    const loop = (t: number) => { cx.clearRect(0, 0, W, H);
      for (const p of P) { p.y -= p.v * .016; p.x += Math.sin(t / 2600 + p.ph) * .0004; if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); } const a = (.25 + .35 * Math.sin(t / 900 + p.ph)) * Math.min(1, p.y * 6);
        cx.fillStyle = `rgba(255,226,150,${Math.max(0, a)})`; cx.beginPath(); cx.arc(p.x * W, p.y * H, p.r, 0, 7); cx.fill(); }
      raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop); return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', fit); };
  }, []);

  const deck = decks.find(d => d.id === deckId);
  const deckOk = !!deck && !deck.problem && deck.count > 0;
  let why = '', canFight = false;
  if (o && !o.locked) {
    if (!deck) why = 'Você ainda não tem um deck. Monte um no editor.';
    else if (!deckOk) why = `${deck.name} está incompleto: ${deck.problem ?? 'vazio'}. Escolha outro deck ou complete no editor.`;
    else { canFight = true; why = `${deck.name} contra ${o.name}`; }
  }
  const pickDeck = (d: DzDeck) => {
    if (d.count === 0) { onEditDecks(); return; }
    setDeckId(d.id); try { localStorage.setItem(LAST_DECK_KEY, d.id); } catch { /* sem armazenamento */ }
  };

  return (
    <div className="dz-wrap">
      <div className="dz">
        <div className={`dz-stage${sel < 0 ? ' ov' : ''}`} ref={stageRef}>
          <div className="dz-fx" ref={fxRef} style={{ transformOrigin: `${pinX}px ${pinY}px` }}>
            <div className={`dz-map ${sel < 0 ? 'over' : 'zoomed'}`} style={{ transform: mapTransform, ['--inv' as string]: (1.15 / ovScale).toFixed(3) }} onClick={() => { if (sel >= 0) select(-1); }}>
              {all.map((a, i) => (
                <div key={a.id} className={`dz-mk ${a.locked ? 'lock' : 'new'}`} style={{ left: PLACES[a.id].px * ZOOM, top: PLACES[a.id].py * ZOOM }} onClick={e => { e.stopPropagation(); select(i); }}>
                  <span dangerouslySetInnerHTML={{ __html: PIN_SVG }} />
                  <div className="dz-lbl" ref={el => { lblRefs.current[i] = el; }} style={{ ['--lx' as string]: `${lx[i] ?? 0}px` }}>{a.locked ? '🔒 ' : ''}{PLACES[a.id].lbl}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="dz-tint" style={{ background: pl ? pl.tint : 'transparent' }} />
          <div className="dz-shade" />
          <canvas className="dz-dust" ref={dustRef} />
          <div className={`dz-pin${sel < 0 ? ' dz-hide' : ''}${o?.locked ? ' locked' : ''}`} style={{ left: pinX, top: pinY }}>
            <div className="dz-pulse" /><div className="dz-pulse b" />
            <span dangerouslySetInnerHTML={{ __html: PIN_SVG }} />
          </div>
          <div className="dz-head">
            <div className="dz-iconbtn" onClick={() => { if (sel >= 0) select(-1); else onBack(); }}>‹</div>
            <div className="dz-title"><h1>Desafios</h1><i /></div>
            <div style={{ width: 46 }} />
          </div>
          <div className={`dz-place${sel < 0 ? ' dz-hide' : ''}`} style={{ top: pinY + 20 }}>
            <div className="dz-plaque">{pl?.region}</div>
            <div className="dz-sub">{o ? (o.locked ? 'Região ainda inexplorada' : `${o.name} · ${o.epithet}`) : ''}</div>
          </div>
          <div className={`dz-hint${sel >= 0 ? ' dz-hide' : ''}`}>Escolha um adversário</div>
        </div>

        <div className={`dz-card${o ? ' on' : ''}`}>
          <div className="x" onClick={() => select(-1)}>×</div>
          {o && (<>
            <div className="dz-who">
              <div className={`dz-pt${o.locked ? ' lock' : ''}`} style={o.locked ? undefined : { backgroundImage: `url('${pl?.img}')` }}>{o.locked ? '🔒' : ''}</div>
              <div className="dz-nm"><h2>{o.name}</h2><div className="dz-ep">{o.epithet}</div><div className="dz-meta">{o.locked && <span className="dz-tag">Em breve</span>}</div></div>
            </div>
            <p className="dz-cdesc">{o.desc}</p>
            {!o.locked && (<>
              {o.style && <div className="dz-chips"><span className="dz-chip">{o.style}</span></div>}
              <div className="dz-dockhead"><span>Seu deck</span><button className="dz-editlink" onClick={onEditDecks}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#f6e3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M4 20l1-4L16 5l3 3L8 19z" /><path d="M14 7l3 3" /></svg>Editar decks</button></div>
              <div className="dz-decks">
                {decks.map(d => {
                  if (d.count === 0) return <div key={d.id} className="dz-dk empty" onClick={() => pickDeck(d)}><span className="dz-plus">+</span><small>Montar {d.name}</small></div>;
                  const ok = !d.problem, gen = opponents.find(x => x.id === d.deckId);
                  return (
                    <div key={d.id} className={`dz-dk${ok ? '' : ' bad'}${d.id === deckId ? ' sel' : ''}`} onClick={() => pickDeck(d)}>
                      <div className="dz-th" style={{ backgroundImage: `url('${PLACES[gen?.id ?? d.deckId]?.img ?? ''}')` }} />
                      <div className="dz-tx"><b>{PLACES[d.deckId]?.lbl ?? d.name}</b><small><span className={`dz-ck${ok ? '' : ' no'}`}>{ok ? '✓' : '!'}</span>{d.count} cartas</small></div>
                    </div>
                  );
                })}
              </div>
            </>)}
            {o.locked && <div className="dz-lockbox">🔒 <b>Ainda não está disponível.</b> Este general chega numa próxima atualização.</div>}
            <button className={`dz-fight${canFight ? '' : ' off'}`} onClick={() => { if (canFight && deck) onStart(deck.id, o.id); }}>{o.locked ? 'Em breve' : 'Batalha'}</button>
            <div className={`dz-why${!o.locked && !canFight ? ' warn' : ''}`}>{why}</div>
          </>)}
        </div>
      </div>
    </div>
  );
};
