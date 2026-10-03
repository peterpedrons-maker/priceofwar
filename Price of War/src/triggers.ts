// Gatilhos de carta no cliente: ícone (bronze, sem aro), cores do brilho e o gatilho que o catálogo definiu para cada nome de carta.
import { useSyncExternalStore } from 'react';
import { getCardDef } from './engine/catalog';
import { TRIGGER_LABEL, type Trigger } from './engine/types';
import iconConvocacao from './assets/trigger-convocacao.webp';
import iconOfensiva from './assets/trigger-ofensiva.webp';
import iconQueda from './assets/trigger-queda.webp';
import iconManobra from './assets/trigger-manobra.webp';
import iconComando from './assets/trigger-comando.webp';
import iconPostura from './assets/trigger-postura.webp';
import iconReforco from './assets/trigger-reforco.webp';

export const TRIGGER_ICON: Record<Trigger, string> = {
  convocacao: iconConvocacao, ofensiva: iconOfensiva, queda: iconQueda, manobra: iconManobra,
  comando: iconComando, postura: iconPostura, reforco: iconReforco,
};

// Cor do brilho de cada gatilho: c1 = brilho/lavagem, c2 = o fio claro (contorno, faixa de luz, faíscas).
export const TRIGGER_FX: Record<Trigger, { c1: string; c2: string }> = {
  convocacao: { c1: '#ffc94d', c2: '#fff3c4' },
  ofensiva: { c1: '#ff4b3a', c2: '#ffdcd3' },
  queda: { c1: '#a35fff', c2: '#ecdcff' },
  manobra: { c1: '#5aa9ff', c2: '#d9edff' },
  comando: { c1: '#ffc94d', c2: '#fff3c4' },
  postura: { c1: '#9fb4c8', c2: '#eef4fa' },
  reforco: { c1: '#2fd0b5', c2: '#d9fff6' },
};

export const triggerKeyOf = (cardName: string): Trigger | undefined => getCardDef(cardName)?.trigger;

// Rótulo + ícone do gatilho da carta com este nome, ou null se ela não tem nenhum.
export const triggerOf = (cardName: string): { key: Trigger; label: string; icon: string } | null => {
  const t = triggerKeyOf(cardName);
  return t ? { key: t, label: TRIGGER_LABEL[t], icon: TRIGGER_ICON[t] } : null;
};

// Quando o efeito de uma carta dispara, o ícone dela (onde ele aparece: carta aberta ou em destaque) também brilha.
// Pequena loja fora do React para qualquer carta desenhada saber que "esta carta está disparando agora".
const pulsing = new Map<string, Trigger>();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());
export const pulseCard = (cardId: string, trigger: Trigger, ms = 1700) => {
  pulsing.set(cardId, trigger); emit();
  window.setTimeout(() => { if (pulsing.get(cardId) === trigger) { pulsing.delete(cardId); emit(); } }, ms);
};
export const usePulse = (cardId: string): Trigger | undefined =>
  useSyncExternalStore(cb => { listeners.add(cb); return () => { listeners.delete(cb); }; }, () => pulsing.get(cardId), () => undefined);
