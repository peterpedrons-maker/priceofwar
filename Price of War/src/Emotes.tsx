// Quick messages in an online match: a balloon button, a menu of ready-made phrases and emojis (never free text),
// a balloon by the General of whoever spoke, a pause between messages and "Silenciar". Mockup: docs/janelas/emocoes-lado-a-lado.png.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DECK_RECIPES } from './engine/catalog';
import { fetchEmotes, sendEmote } from './services/online';
import joinha from './assets/emotes/joinha.webp';
import palmas from './assets/emotes/palmas.webp';
import prece from './assets/emotes/prece.webp';
import aperto from './assets/emotes/aperto.webp';
import surpresa from './assets/emotes/surpresa.webp';
import pensativo from './assets/emotes/pensativo.webp';
import ops from './assets/emotes/ops.webp';
import trofeu from './assets/emotes/trofeu.webp';
import kitIconBtn from './assets/kit/icon-btn.png';
import kitSecondary from './assets/kit/btn-secondary.png';
import kitPrimary from './assets/kit/btn-primary.png';

// The pause between two of my messages (the server enforces 2.5 s; this shows it).
const GAP_MS = 2600;
// How long a balloon stays (appearing included) before it fades out.
const SHOW_MS = 3500;

// Phrase 1 is the deck's own (by the sender's General); the others are the same for everyone.
const DECK_PHRASE: Record<string, string> = { cardeal: 'Que a fé o guie!', capitao: 'Em formação!', mercenarios: 'O preço subiu.' };
const deckOfGeneral = (general: string): string => {
  const hit = (Object.keys(DECK_RECIPES) as (keyof typeof DECK_RECIPES)[]).find(id => DECK_RECIPES[id].general === general);
  return hit ?? 'cardeal';
};
const PHRASES: { code: string; icon: string; text?: string }[] = [
  { code: 'p1', icon: prece }, { code: 'p2', icon: palmas, text: 'Bela jogada!' }, { code: 'p3', icon: aperto, text: 'Obrigado.' },
  { code: 'p4', icon: pensativo, text: 'Pense bem...' }, { code: 'p5', icon: ops, text: 'Ops!' }, { code: 'p6', icon: trofeu, text: 'Boa partida!' },
];
const EMOJIS: { code: string; icon: string }[] = [
  { code: 'e1', icon: joinha }, { code: 'e2', icon: palmas }, { code: 'e3', icon: prece }, { code: 'e4', icon: surpresa }, { code: 'e5', icon: pensativo }, { code: 'e6', icon: aperto },
];
const phraseText = (code: string, senderGeneral: string): string | undefined => code === 'p1' ? DECK_PHRASE[deckOfGeneral(senderGeneral)] : PHRASES.find(p => p.code === code)?.text;
const iconOf = (code: string): string | undefined => PHRASES.find(p => p.code === code)?.icon ?? EMOJIS.find(e => e.code === code)?.icon;

type Bubble = { key: number; side: 'me' | 'foe'; code: string };

// A small cloud of smoke that blooms and fades where the balloon appears.
const PUFFS = [{ x: -22, y: -8, s: 30, d: 0 }, { x: 20, y: -10, s: 34, d: 0.03 }, { x: -8, y: 14, s: 36, d: 0.05 }, { x: 24, y: 12, s: 28, d: 0.02 }, { x: 0, y: -18, s: 32, d: 0.06 }, { x: -26, y: 10, s: 26, d: 0.04 }];
const Puff = () => (
  <div aria-hidden style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none', zIndex: 2 }}>
    {PUFFS.map((c, i) => (
      <motion.span key={i} initial={{ opacity: 0.8, scale: 0.3, x: 0, y: 0 }} animate={{ opacity: 0, scale: 1.7, x: c.x, y: c.y }} transition={{ duration: 0.7, delay: c.d, ease: 'easeOut' }}
        style={{ position: 'absolute', left: -c.s / 2, top: -c.s / 2, width: c.s, height: c.s, borderRadius: '50%', background: 'radial-gradient(circle, rgba(246,236,212,.85) 0%, rgba(246,236,212,.45) 45%, rgba(246,236,212,0) 72%)' }} />
    ))}
  </div>
);

export const Emotes = ({ matchId, enabled, myGeneral, opponentGeneral }: { matchId: string; enabled: boolean; myGeneral: string; opponentGeneral: string }) => {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [waitUntil, setWaitUntil] = useState(0);
  const [, tick] = useState(0);
  const sinceRef = useRef(0);
  const mutedRef = useRef(false);
  mutedRef.current = muted;
  const seen = useRef(new Set<number>());

  const show = (side: 'me' | 'foe', code: string, id: number) => {
    if (seen.current.has(id)) return;
    seen.current.add(id);
    const key = id;
    // one balloon per side at a time: the newest replaces the old
    setBubbles(b => [...b.filter(x => x.side !== side), { key, side, code }]);
    window.setTimeout(() => setBubbles(b => b.filter(x => x.key !== key)), SHOW_MS);
  };
  const absorb = (emotes: { id: number; from: 0 | 1; code: string }[], quiet: boolean) => {
    emotes.forEach(e => {
      sinceRef.current = Math.max(sinceRef.current, e.id);
      if (quiet) { seen.current.add(e.id); return; }
      if (e.from === 1 && mutedRef.current) { seen.current.add(e.id); return; }
      show(e.from === 0 ? 'me' : 'foe', e.code, e.id);
    });
  };

  // The messages of the opponent arrive by a light poll (the first answer is history: shown by nobody).
  useEffect(() => {
    if (!enabled) return;
    let stopped = false, timer = 0, first = true;
    const poll = async () => {
      const r = await fetchEmotes(matchId, sinceRef.current);
      if (stopped) return;
      if (r.ok) { absorb(r.emotes, first); first = false; }
      timer = window.setTimeout(poll, 2500);
    };
    timer = window.setTimeout(poll, 1200);
    return () => { stopped = true; window.clearTimeout(timer); };
  }, [matchId, enabled]);

  // the countdown on the button
  useEffect(() => {
    if (waitUntil <= Date.now()) return;
    const t = window.setInterval(() => { tick(n => n + 1); if (Date.now() >= waitUntil) window.clearInterval(t); }, 500);
    return () => window.clearInterval(t);
  }, [waitUntil]);

  if (!enabled) return null;
  const waiting = waitUntil > Date.now();
  const say = async (code: string) => {
    if (waiting) return;
    setOpen(false);
    setWaitUntil(Date.now() + GAP_MS);
    const r = await sendEmote(matchId, code, sinceRef.current);
    if (r.ok) absorb(r.emotes, false);
  };

  // Where each balloon sits: mine under my General (between him and my hand), the opponent's above his General (over his hand).
  const pos = (side: 'me' | 'foe') => {
    const el = document.getElementById(side === 'me' ? 'player-12' : 'npc-12');
    const r = el?.getBoundingClientRect();
    const cx = r ? r.left + r.width / 2 : window.innerWidth / 2;
    return side === 'me'
      ? { left: cx, top: r ? r.bottom + 12 : 640, up: false }
      : { left: cx, top: r ? r.top - 12 : 140, up: true };
  };
  const serif = "'Cinzel', serif";

  return (
    <>
      <AnimatePresence>
        {bubbles.map(b => {
          const p = pos(b.side), icon = iconOf(b.code), text = phraseText(b.code, b.side === 'me' ? myGeneral : opponentGeneral);
          const edge = b.side === 'me' ? '#d9b45a' : '#b9746a';
          const box = text
            ? { position: 'relative' as const, display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px 7px 8px', borderRadius: 14, background: 'linear-gradient(#2a1d12,#150e08)', border: `2px solid ${edge}`, boxShadow: '0 4px 14px rgba(0,0,0,.7)', color: '#f3e3bd', maxWidth: 230 }
            : { position: 'relative' as const, display: 'flex', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.7))' };
          return (
            <motion.div key={b.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } }} transition={{ duration: 0.15 }}
              style={{ position: 'fixed', pointerEvents: 'none', left: p.left, top: p.top, width: 0, height: 0, zIndex: 236 }}>
              <div style={{ transform: `translate(-50%, ${p.up ? '-100%' : '0'})`, display: 'flex', flexDirection: p.up ? 'column-reverse' : 'column', alignItems: 'center', gap: 4, width: 'max-content' }}>
                {b.side === 'foe' && (
                  <button onClick={() => { setMuted(true); setBubbles(x => x.filter(y => y.side !== 'foe')); }}
                    style={{ pointerEvents: 'auto', cursor: 'pointer', fontFamily: serif, fontWeight: 700, fontSize: 9, letterSpacing: '0.1em', color: '#e9d8ad', background: 'rgba(10,8,5,.82)', border: '1px solid #8a6a28', borderRadius: 10, padding: '3px 9px' }}>
                    Silenciar
                  </button>
                )}
                {/* "Pluf": it materializes out of nothing (small, blurred and transparent, then sharp and whole) inside a puff of smoke. */}
                <motion.div initial={{ scale: 0.35, opacity: 0, filter: 'blur(10px)' }} animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.5, ease: [0.2, 0.8, 0.25, 1] }} style={{ position: 'relative' }}>
                  <div style={box}>
                    {text && <span style={{ position: 'absolute', left: '50%', [p.up ? 'bottom' : 'top']: -8, width: 12, height: 12, marginLeft: -6, transform: 'rotate(45deg)', background: p.up ? '#150e08' : '#2a1d12',
                      [p.up ? 'borderRight' : 'borderLeft']: `2px solid ${edge}`, [p.up ? 'borderBottom' : 'borderTop']: `2px solid ${edge}` }} />}
                    {icon && <img src={icon} alt="" style={{ width: text ? 34 : 54, height: text ? 34 : 54 }} draggable={false} />}
                    {text && <span style={{ fontFamily: serif, fontWeight: 800, fontSize: 13, lineHeight: 1.15, color: '#f3e3bd', textShadow: '0 1px 2px #000' }}>{text}</span>}
                  </div>
                  <Puff />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
      {open && <motion.div key="emote-dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ position: 'fixed', inset: 0, zIndex: 237, background: 'rgba(6,4,2,0.5)' }} onClick={() => setOpen(false)} />}
      {open && (
        <motion.div key="emote-menu" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.28, ease: 'easeOut' }} style={{ position: 'fixed', left: 12, right: 12, bottom: 196, zIndex: 238 }} onClick={e => e.stopPropagation()}>
          <div style={{ fontFamily: serif, fontWeight: 900, fontSize: 11, letterSpacing: '0.2em', color: '#d9b45a', textShadow: '0 1px 2px #000', marginBottom: 6 }}>FRASES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'space-between' }}>
            {PHRASES.map((p, i) => (
              <motion.button key={p.code} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i, duration: 0.22, ease: 'easeOut' }} whileTap={{ scale: 0.96 }} onClick={() => say(p.code)} style={{ border: 'none', cursor: 'pointer', width: 'calc(50% - 3px)', height: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', background: `url(${p.code === 'p1' ? kitPrimary : kitSecondary}) 0 0/100% 100% no-repeat`, color: p.code === 'p1' ? '#2a1a05' : '#ecdcb8', fontFamily: serif, fontWeight: 700, fontSize: 12, letterSpacing: '0.02em', textAlign: 'left' }}>
                <img src={p.icon} alt="" style={{ width: 28, height: 28 }} draggable={false} />{phraseText(p.code, myGeneral)}
              </motion.button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12, justifyContent: 'center' }}>
            {EMOJIS.map((e, i) => (
              <motion.button key={e.code} initial={{ opacity: 0, scale: 0.5, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.045, type: 'spring', stiffness: 320, damping: 18 }} whileTap={{ scale: 0.88 }} onClick={() => say(e.code)} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', width: 44, height: 44, flex: '0 0 44px' }}><img src={e.icon} alt="" style={{ width: '100%', height: '100%' }} draggable={false} /></motion.button>
            ))}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
      <button onClick={() => (muted ? setMuted(false) : setOpen(o => !o))} disabled={waiting && !muted}
        style={{ position: 'fixed', border: 'none', cursor: 'pointer', left: 10, bottom: 146, width: 44, height: 44, zIndex: 239, background: `url(${kitIconBtn}) 0 0/100% 100% no-repeat`, display: 'grid', placeItems: 'center', opacity: waiting && !muted ? 0.55 : 1, filter: 'drop-shadow(0 2px 4px #000)' }}
        aria-label={muted ? 'Mensagens silenciadas (toque para ativar)' : 'Frases e emojis'}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f6e3a3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H11l-5 4v-4H4z" fill="rgba(230,195,106,.25)" />{muted ? <path d="M3 3l18 18" stroke="#ff9a8a" /> : <path d="M8 9.5h8M8 12.5h5" />}</svg>
      </button>
    </>
  );
};
