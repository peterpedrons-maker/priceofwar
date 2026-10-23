import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { lazy, Suspense, useState } from 'react';
import { CARD_DEFS } from './engine/catalog';
import { LanguageGate } from './i18n/LanguageGate';
import { getLang, hasChosenLang, setLang, startTranslator } from './i18n';
import './index.css';
import './fonts.css';

// ?3d opens the 3D card viewer on its own (no login, no menus): every card of the catalog, drag to turn it in any direction.
const CardViewer3D = lazy(() => import('./CardViewer3D'));
const Viewer3DPage = () => {
  const cards = CARD_DEFS.map(d => ({ name: d.name, type: d.cardType, full: !!d.isFullArt }));
  const [i, setI] = useState(Math.max(0, Math.min(cards.length - 1, Number(new URLSearchParams(location.search).get('card')) || 0)));
  return <Suspense fallback={null}><CardViewer3D cards={cards} index={i} onIndex={setI} onClose={() => { if (new URLSearchParams(location.search).has('embed')) parent.postMessage('close3d', '*'); else location.href = location.pathname; }} /></Suspense>;
};
const only3d = new URLSearchParams(location.search).has('3d');
// Inglês: o tradutor de tela liga antes de o jogo aparecer. A primeira abertura pergunta o idioma.
if (getLang() === 'en') startTranslator();
const Root = () => {
  const [chosen, setChosen] = useState(() => hasChosenLang() || only3d);
  if (!chosen) return <LanguageGate onPick={l => { setLang(l); if (l === 'en') startTranslator(); setChosen(true); }} />;
  return only3d ? <Viewer3DPage /> : <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);

// A registered service worker is what makes Chrome/Android treat this page as an
// installable app (see the in-game install prompt in App.tsx).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
