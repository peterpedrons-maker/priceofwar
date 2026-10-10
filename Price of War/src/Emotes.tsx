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
const SHOW_MS = 3200;

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

// TESTE: `local` = contra a IA, sem servidor: a mensagem aparece só no seu aparelho e a IA "responde" com uma mensagem sorteada, para testar o menu,
// os balões e o Silenciar sem precisar de duas pessoas. Remover junto com TEST_EMOTES_VS_AI no App.tsx.
export const Emotes = ({ matchId, enabled, myGeneral, opponentGeneral, local = false }: { matchId: string; enabled: boolean; myGeneral: string; opponentGeneral: string; local?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [waitUntil, setWaitUntil] = useState(0);
  const [, tick] = useState(0);
  const sinceRef = useRef(0);
  const mutedRef = useRef(false);
  mutedRef.current = muted;
  const seen = useRef(new Set<number>());
  const localId = useRef(0);

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
    if (!enabled || local) return;
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
    if (local) {
      const id = ++localId.current;
      absorb([{ id, from: 0, code }], false);
      window.setTimeout(() => {
        const codes = [...PHRASES, ...EMOJIS].map(x => x.code);
        absorb([{ id: ++localId.current, from: 1, code: codes[Math.floor(Math.random() * codes.length)] }], false);
      }, 1300);
      return;
    }
    const r = await sendEmote(matchId, code, sinceRef.current);
    if (r.ok) absorb(r.emotes, false);
  };

  const pos = (side: 'me' | 'foe') => {
    const el = document.getElementById(side === 'me' ? 'player-12' : 'npc-12');
    const r = el?.getBoundingClientRect();
    return r ? { left: Math.min(window.innerWidth - 210, r.right + 14), top: side === 'me' ? r.top - 18 : r.top + 8 } : { left: 150, top: side === 'me' ? 500 : 120 };
  };
  const serif = "'Cinzel', serif";

  return (
    <>
      <AnimatePresence>
        {bubbles.map(b => {
          const p = pos(b.side), icon = iconOf(b.code), text = phraseText(b.code, b.side === 'me' ? myGeneral : opponentGeneral);
          return (
            <motion.div key={b.key} initial={{ opacity: 0, scale: 0.7, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}
              style={{ position: 'fixed', pointerEvents: 'none', left: p.left, top: p.top, zIndex: 236, maxWidth: 200 }}>
              <div style={text
                ? { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px 6px 6px', borderRadius: 18, background: b.side === 'me' ? 'linear-gradient(#f6ecd2,#e2cf9f)' : 'linear-gradient(#e7dbe9,#c9b5cf)', boxShadow: '0 4px 14px rgba(0,0,0,.65), inset 0 0 0 2px #b88a2e', color: '#2a1d0a' }
                : { display: 'flex', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.7))' }}>
                {icon && <img src={icon} alt="" style={{ width: text ? 34 : 54, height: text ? 34 : 54 }} draggable={false} />}
                {text && <span style={{ fontFamily: serif, fontWeight: 800, fontSize: 13, lineHeight: 1.15 }}>{text}</span>}
              </div>
              {b.side === 'foe' && (
                <button onClick={() => { setMuted(true); setBubbles(x => x.filter(y => y.side !== 'foe')); }}
                  style={{ pointerEvents: 'auto', cursor: 'pointer', marginTop: 4, fontFamily: serif, fontWeight: 700, fontSize: 9, letterSpacing: '0.1em', color: '#e9d8ad', background: 'rgba(10,8,5,.82)', border: '1px solid #8a6a28', borderRadius: 10, padding: '3px 9px' }}>
                  Silenciar
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {open && <div style={{ position: 'fixed', inset: 0, zIndex: 237, background: 'rgba(6,4,2,0.5)' }} onClick={() => setOpen(false)} />}
      {open && (
        <div style={{ position: 'fixed', left: 12, right: 12, bottom: 196, zIndex: 238 }} onClick={e => e.stopPropagation()}>
          <div style={{ fontFamily: serif, fontWeight: 900, fontSize: 11, letterSpacing: '0.2em', color: '#d9b45a', textShadow: '0 1px 2px #000', marginBottom: 6 }}>FRASES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'space-between' }}>
            {PHRASES.map(p => (
              <button key={p.code} onClick={() => say(p.code)} style={{ border: 'none', cursor: 'pointer', width: 'calc(50% - 3px)', height: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', background: `url(${p.code === 'p1' ? kitPrimary : kitSecondary}) 0 0/100% 100% no-repeat`, color: p.code === 'p1' ? '#2a1a05' : '#ecdcb8', fontFamily: serif, fontWeight: 700, fontSize: 12, letterSpacing: '0.02em', textAlign: 'left' }}>
                <img src={p.icon} alt="" style={{ width: 28, height: 28 }} draggable={false} />{phraseText(p.code, myGeneral)}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12, justifyContent: 'center' }}>
            {EMOJIS.map(e => (
              <button key={e.code} onClick={() => say(e.code)} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', width: 44, height: 44, flex: '0 0 44px' }}><img src={e.icon} alt="" style={{ width: '100%', height: '100%' }} draggable={false} /></button>
            ))}
          </div>
        </div>
      )}
      <button onClick={() => (muted ? setMuted(false) : setOpen(o => !o))} disabled={waiting && !muted}
        style={{ position: 'fixed', border: 'none', cursor: 'pointer', left: 10, bottom: 146, width: 44, height: 44, zIndex: 239, background: `url(${kitIconBtn}) 0 0/100% 100% no-repeat`, display: 'grid', placeItems: 'center', opacity: waiting && !muted ? 0.55 : 1, filter: 'drop-shadow(0 2px 4px #000)' }}
        aria-label={muted ? 'Mensagens silenciadas (toque para ativar)' : 'Frases e emojis'}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f6e3a3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H11l-5 4v-4H4z" fill="rgba(230,195,106,.25)" />{muted ? <path d="M3 3l18 18" stroke="#ff9a8a" /> : <path d="M8 9.5h8M8 12.5h5" />}</svg>
      </button>
    </>
  );
};
