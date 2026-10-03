// Gatilhos de carta no cliente: ícone (bronze, sem aro) e o gatilho que o catálogo definiu para cada nome de carta.
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

// Rótulo + ícone do gatilho da carta com este nome, ou null se ela não tem nenhum.
export const triggerOf = (cardName: string): { label: string; icon: string } | null => {
  const t = getCardDef(cardName)?.trigger;
  return t ? { label: TRIGGER_LABEL[t], icon: TRIGGER_ICON[t] } : null;
};
