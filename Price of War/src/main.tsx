import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { lazy, Suspense, useState } from 'react';
import { CARD_DEFS } from './engine/catalog';
import { Component, type ReactNode } from 'react';
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
// Se algo quebrar durante o jogo, em vez de tela preta aparece o erro (e dá para recarregar ou copiar o texto para mandar ao criador).
class Boundary extends Component<{ children: ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  componentDidCatch(err: Error, info: { componentStack?: string }) { console.error('crash', err, info.componentStack); }
  render() {
    const e = this.state.err;
    if (!e) return this.props.children;
    const text = `${e.name}: ${e.message}\n${(e.stack ?? '').split('\n').slice(1, 5).join('\n')}`;
    return (
      <div data-no-i18n style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24, background: '#0c0906', color: '#f3e7c6', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Algo deu errado · Something went wrong</div>
        <pre style={{ maxWidth: '92vw', maxHeight: '38vh', overflow: 'auto', fontSize: 11, textAlign: 'left', background: 'rgba(0,0,0,.5)', border: '1px solid #6b5420', borderRadius: 8, padding: 10, whiteSpace: 'pre-wrap' }}>{text}</pre>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={() => location.reload()} style={{ padding: '12px 20px', borderRadius: 10, border: '2px solid #e8c766', background: '#b98a2c', color: '#2a1a06', fontWeight: 900 }}>Recarregar · Reload</button>
          <button type="button" onClick={() => { try { void navigator.clipboard.writeText(text); } catch { /* sem área de transferência */ } }} style={{ padding: '12px 20px', borderRadius: 10, border: '2px solid #6b5420', background: 'transparent', color: '#e8c766', fontWeight: 700 }}>Copiar erro · Copy</button>
        </div>
      </div>
    );
  }
}
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
    <Boundary><Root /></Boundary>
  </StrictMode>,
);

// A registered service worker is what makes Chrome/Android treat this page as an
// installable app (see the in-game install prompt in App.tsx).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
