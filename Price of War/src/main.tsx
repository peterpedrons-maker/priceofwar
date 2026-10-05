import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { lazy, Suspense, useState } from 'react';
import { CARD_DEFS } from './engine/catalog';
import './index.css';
import './fonts.css';

// ?3d opens the 3D card viewer on its own (no login, no menus): every card of the catalog, drag to turn it in any direction.
const CardViewer3D = lazy(() => import('./CardViewer3D'));
const Viewer3DPage = () => {
  const cards = CARD_DEFS.map(d => ({ name: d.name, type: d.cardType, full: !!d.isFullArt }));
  const [i, setI] = useState(Math.max(0, Math.min(cards.length - 1, Number(new URLSearchParams(location.search).get('card')) || 0)));
  return <Suspense fallback={null}><CardViewer3D cards={cards} index={i} onIndex={setI} onClose={() => { location.href = location.pathname; }} /></Suspense>;
};
const only3d = new URLSearchParams(location.search).has('3d');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {only3d ? <Viewer3DPage /> : <App />}
  </StrictMode>,
);

// A registered service worker is what makes Chrome/Android treat this page as an
// installable app (see the in-game install prompt in App.tsx).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
