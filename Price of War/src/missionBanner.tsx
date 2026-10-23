// Aviso "Missão completa" no topo da tela: aparece quando uma missão fica pronta durante a sessão (por exemplo, ao terminar uma partida) e some sozinho.
// Vive numa raiz própria (fora da árvore do App), então aparece em qualquer tela: tela de fim de partida, menu, loja...
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'motion/react';
import { fetchMissions, type MissionsBoard } from './services/online';
import { playRewardSfx } from './rewardSfx';

interface Item { id: number; title: string; reward: number }
const known = new Set<string>();   // missões prontas (cumpridas) já vistas nesta sessão
let started = false;               // o primeiro quadro só semeia: não anuncia o que já estava pronto antes
let seq = 0;
const listeners = new Set<(i: Item) => void>();

// Registra o quadro; devolve as missões que ficaram prontas desde o último registro.
export const noteMissions = (board: MissionsBoard, announce: boolean) => {
  const fresh: Item[] = [];
  [...board.daily, ...board.weekly, ...board.season].forEach(m => {
    if (m.claimed || m.progress < m.target) return;
    const k = `${m.key}|${m.id}`;
    if (known.has(k)) return;
    known.add(k);
    if (announce && started) fresh.push({ id: ++seq, title: m.title, reward: m.reward });
  });
  started = true;
  fresh.forEach(i => listeners.forEach(l => l(i)));
  return fresh;
};
// Depois de uma partida: confere o quadro e anuncia o que ficou pronto.
export const checkMissionBanners = () => { void fetchMissions().then(r => { if (r.ok === true) { if (noteMissions(r.board, true).length) playRewardSfx(false); window.dispatchEvent(new CustomEvent('pow-missions-claimable', { detail: r.board.claimable })); } }); };

const Banner = () => {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    const on = (i: Item) => { setItems(a => [...a, i].slice(-3)); window.setTimeout(() => setItems(a => a.filter(x => x.id !== i.id)), 4200); };
    listeners.add(on); return () => { listeners.delete(on); };
  }, []);
  return (
    <div style={{ position: 'fixed', top: 'max(8px, env(safe-area-inset-top))', left: 0, right: 0, zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, pointerEvents: 'none' }}>
      <AnimatePresence>
        {items.map(i => (
          <motion.div key={i.id} initial={{ y: -70, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -40, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={{ width: 'min(92vw, 380px)', pointerEvents: 'auto', borderRadius: 12, padding: '10px 14px', background: 'linear-gradient(180deg,#3a2a12,#1f160a)', border: '2px solid #e8c766', boxShadow: '0 6px 18px rgba(0,0,0,.6), 0 0 14px rgba(232,199,102,.35)', color: '#fff3d4', fontFamily: "'Cinzel', serif" }}
            onClick={() => setItems(a => a.filter(x => x.id !== i.id))}>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', color: '#e8c766', fontWeight: 800 }}>✓ MISSÃO COMPLETA</div>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.25, marginTop: 2 }}>{i.title}</div>
            <div style={{ fontSize: 12, color: '#ecdfbf', marginTop: 2 }}>+{i.reward} coroas · colete no Quadro de Missões</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
let mounted = false;
export const mountMissionBanner = () => {
  if (mounted || typeof document === 'undefined') return;
  mounted = true;
  const host = document.createElement('div'); host.id = 'pow-mission-banner'; document.body.appendChild(host);
  createRoot(host).render(<Banner />);
};
