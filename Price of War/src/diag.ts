// Diagnóstico leve: guarda os últimos erros do navegador para ir junto de um "reportar problema" (nada sai do aparelho sozinho).
declare const __BUILD__: string;
export const BUILD_ID: string = typeof __BUILD__ === 'string' ? __BUILD__ : 'dev';
const recent: string[] = [];
const keep = (m: string) => { recent.push(m.slice(0, 160)); if (recent.length > 5) recent.shift(); };
if (typeof window !== 'undefined') {
  window.addEventListener('error', e => keep(`${e.message || 'erro'} @${(e.filename || '').split('/').pop()}:${e.lineno || 0}`));
  window.addEventListener('unhandledrejection', e => keep(`promessa: ${String((e.reason && (e.reason.message ?? e.reason)) ?? '')}`));
}
export const recentErrors = () => [...recent];
