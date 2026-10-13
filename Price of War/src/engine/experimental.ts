// Mercenários: hoje as cartas e a receita ficam no catálogo (src/engine/catalog.ts), como as dos outros decks.
// Este arquivo mantém os nomes que o laboratório (tests/balance-merc.ts, tools/mercenarios-tabela.ts) já usava e
// guarda o deck EXPERIMENTAL de Campo (Equipamento + Terreno), que ainda não faz parte do jogo: só o laboratório e os testes o registram.
// Proposta e decisões: docs/deck-mercenarios.md e docs/deck-campo.md.
import { CARD_DEFS, DECK_RECIPES, registerCardDefs } from './catalog';
import type { CardDef, TargetSpec } from './types';

const names = new Set(Object.keys(DECK_RECIPES.mercenarios.cards).concat(DECK_RECIPES.mercenarios.general));
export const MERCENARIOS_DEFS: readonly CardDef[] = CARD_DEFS.filter(c => names.has(c.name));
export const MERCENARIOS_RECIPE = DECK_RECIPES.mercenarios;
export const registerMercenarios = () => { /* já no catálogo */ };

// ── Deck de Campo (experimental): soldados ARMADOS, de qualquer tipo ────────────────────────────────────────────────
// Identidade (rodada 24): "Armada" = a unidade tem pelo menos 1 equipamento preso. Os Terrenos têm modos escolhidos no fim do turno
// (como o Códice dos Mercenários). Efeitos gerais (busca, Comando, Manobra, compra) entram em menor escala.
const OWN_UNIT: TargetSpec = { side: 'own', area: 'unit' };
const equip = (stats: { atk?: number; hp?: number; block?: boolean }, prompt: string) =>
  ({ on: 'play' as const, do: [{ kind: 'equip' as const, ...stats, target: { ...OWN_UNIT, prompt } }] });
const GRAVE_EQUIP = { kind: 'search', zone: 'graveyard', filter: { equipment: true } } as const;
const DECK_EQUIP = { kind: 'search', zone: 'deck', filter: { equipment: true } } as const;
const ARMED = { side: 'own', armed: true } as const;

export const CAMPO_DEFS: readonly CardDef[] = [
  { name: 'Margrave Osric, Senhor das Marcas', cardType: 'General', atk: 0, hp: 30, cost: 0, isFullArt: true, trigger: 'comando', faction: 'marca',
    effect: 'Pague 2 de ouro: leve 1 Equipamento do cemitério para a mão. **Passiva** Suas Armadas e a Relíquia recebem 1 de dano a menos por ataque.',
    abilities: [{ on: 'ability', once: true, cost: 2, do: [GRAVE_EQUIP] }],
    passives: [{ kind: 'aura', who: ARMED, reduce: 1 }, { kind: 'aura', who: { side: 'own', slots: [10] }, reduce: 1 }] },

  // núcleo (identidade: armada)
  { name: 'Escudeiro de Campanha', cardType: 'Infantaria', atk: 2, hp: 4, cost: 2, trigger: 'postura', effect: '+1 ATK por equipamento preso (máx. +2).',
    passives: [{ kind: 'aura', who: { side: 'self' }, from: 'front', atk: 1, perEquip: { cap: 2 } }] },
  { name: 'Cavaleiro da Marca', cardType: 'Cavalaria', atk: 3, hp: 4, cost: 3, trigger: 'postura', effect: '**Armada:** +1 ATK.',
    passives: [{ kind: 'aura', who: { side: 'self' }, from: 'front', needs: 'armed', atk: 1 }] },
  { name: 'Guarda de Fronteira', cardType: 'Infantaria', atk: 2, hp: 4, cost: 3, trigger: 'postura', effect: '**Armada:** +1 HP em combate.',
    passives: [{ kind: 'aura', who: { side: 'self' }, from: 'front', needs: 'armed', combatHp: 1 }] },
  { name: 'Lanceiro Montado', cardType: 'Cavalaria', atk: 3, hp: 4, cost: 3, trigger: 'ofensiva', effect: '**Armada:** 2 de dano à carta atrás.',
    abilities: [{ on: 'attack', do: [{ kind: 'splash_behind', amount: 2, ifArmed: true }] }] },
  { name: 'Arqueiro de Colina', cardType: 'Arqueiro', atk: 2, hp: 3, cost: 3, trigger: 'postura', effect: 'Na Retaguarda, +1 ATK por equipamento preso (máx. +2).',
    passives: [{ kind: 'aura', who: { side: 'self' }, from: 'back', atk: 1, perEquip: { cap: 2 } }] },
  { name: 'Besteiro de Posto', cardType: 'Arqueiro', atk: 1, hp: 3, cost: 2, trigger: 'convocacao', effect: 'Leve 1 Equipamento do baralho para a mão.',
    abilities: [{ on: 'place', do: [DECK_EQUIP] }] },
  { name: 'Armeiro de Campanha', cardType: 'Infantaria', atk: 1, hp: 4, cost: 2, trigger: 'queda', effect: 'Leve 1 Equipamento do cemitério para a mão.',
    abilities: [{ on: 'destroyed', do: [GRAVE_EQUIP] }] },
  { name: 'Escudeiro Veterano', cardType: 'Infantaria', atk: 2, hp: 4, cost: 3, trigger: 'queda', effect: 'O equipamento preso volta para a sua mão.',
    passives: [{ kind: 'flag', flag: 'recover_equipment' }] },
  { name: 'Mapeador de Marchas', cardType: 'Arqueiro', atk: 1, hp: 3, cost: 1, trigger: 'convocacao', effect: 'Leve 1 Terreno do baralho para a mão.',
    abilities: [{ on: 'place', do: [{ kind: 'search', zone: 'deck', filter: { types: ['Terreno'] } }] }] },

  // efeitos gerais, em menor escala
  { name: 'Sargento de Marcha', cardType: 'Infantaria', atk: 2, hp: 3, cost: 3, trigger: 'convocacao', effect: 'Compre 1 carta.',
    abilities: [{ on: 'place', do: [{ kind: 'draw', amount: 1 }] }] },
  { name: 'Intendente de Marcha', cardType: 'Infantaria', atk: 2, hp: 3, cost: 3, trigger: 'comando', effect: 'Pague 1 de ouro: compre 1 carta.',
    abilities: [{ on: 'ability', once: true, cost: 1, do: [{ kind: 'draw', amount: 1 }] }] },
  { name: 'Cavaleiro Batedor', cardType: 'Cavalaria', atk: 2, hp: 3, cost: 2, trigger: 'manobra', effect: '+1 ATK até o próximo turno.',
    abilities: [{ on: 'move', do: [{ kind: 'buff_self_temp', atk: 1 }] }] },

  // únicas
  { name: 'Campeão da Marca', maxCopies: 1, cardType: 'Cavalaria', atk: 3, hp: 5, cost: 4, trigger: 'postura', effect: '+1/+1 em combate por equipamento preso (máx. +3).',
    passives: [{ kind: 'aura', who: { side: 'self' }, from: 'front', atk: 1, combatHp: 1, perEquip: { cap: 3 } }] },
  { name: 'Mestre de Armas', maxCopies: 1, cardType: 'Infantaria', atk: 2, hp: 4, cost: 3, trigger: 'postura', effect: 'Suas **Armadas:** +1 ATK.',
    passives: [{ kind: 'aura', who: ARMED, from: 'front', atk: 1 }] },

  // equipamentos (qualquer unidade; toda unidade equipada fica Armada)
  { name: 'Cota Remendada', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Equipe uma unidade: +1 ATK e +2 HP. Ela fica **Armada**',
    abilities: [equip({ atk: 1, hp: 2 }, 'Escolha uma unidade sua para equipar (+1 ATK e +2 HP).')] },
  { name: 'Escudo de Carvalho', maxCopies: 2, cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Equipe uma unidade: Guarda (absorve o primeiro golpe inteiro). Ela fica **Armada**',
    abilities: [equip({ block: true }, 'Escolha uma unidade sua para equipar (Guarda).')] },
  { name: 'Espada de Posto', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Equipe uma unidade: +2 ATK. Ela fica **Armada**',
    abilities: [equip({ atk: 2 }, 'Escolha uma unidade sua para equipar (+2 ATK).')] },
  { name: 'Elmo Ferrado', maxCopies: 2, cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Equipe uma unidade: +3 HP. Ela fica **Armada**',
    abilities: [equip({ hp: 3 }, 'Escolha uma unidade sua para equipar (+3 HP).')] },
  { name: 'Machado de Guerra', maxCopies: 1, cardType: 'Tática', atk: 0, hp: 0, cost: 2, effect: 'Equipe uma unidade: +3 ATK. Ela fica **Armada**',
    abilities: [equip({ atk: 3 }, 'Escolha uma unidade sua para equipar (+3 ATK).')] },
  { name: 'Armadura de Placas', maxCopies: 2, cardType: 'Tática', atk: 0, hp: 0, cost: 2, effect: 'Equipe uma unidade: +2 ATK e +1 HP. Ela fica **Armada**',
    abilities: [equip({ atk: 2, hp: 1 }, 'Escolha uma unidade sua para equipar (+2 ATK e +1 HP).')] },

  // Terrenos com modos (sem vida; o dono escolhe o modo no fim do turno e ele vale até o fim do turno seguinte)
  { name: 'Forja de Campanha', maxCopies: 2, cardType: 'Terreno', atk: 0, hp: 0, cost: 3,
    effect: 'Escolha 1 modo no fim do seu turno. Muralha: suas Armadas têm +2 HP em combate. Afiação: suas Armadas têm +2 ATK.',
    modes: [
      { id: 'muralha', name: 'Muralha', effect: 'Suas Armadas têm +2 HP em combate.', passives: [{ kind: 'aura', who: ARMED, combatHp: 2 }] },
      { id: 'afiacao', name: 'Afiação', effect: 'Suas Armadas têm +2 ATK.', passives: [{ kind: 'aura', who: ARMED, atk: 2 }] },
    ] },
  { name: 'Posto de Marcha', maxCopies: 2, cardType: 'Terreno', atk: 0, hp: 0, cost: 2,
    effect: 'Escolha 1 modo no fim do seu turno. Trincheira: suas Armadas recebem 1 de dano a menos por ataque. Saque: ao destruir uma unidade inimiga, compre 1 carta (máx. 1 por ciclo).',
    modes: [
      { id: 'trincheira', name: 'Trincheira', effect: 'Suas Armadas recebem 1 de dano a menos por ataque.', passives: [{ kind: 'aura', who: ARMED, reduce: 1 }] },
      { id: 'saque', name: 'Saque', effect: 'Ao destruir uma unidade inimiga, compre 1 carta (máx. 1 por ciclo).', loot: { draw: 1, cap: 1 } },
    ] },

  // outras Táticas, Emboscadas e Relíquia
  { name: 'Intendência de Campanha', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Leve 1 Equipamento do baralho para a mão.',
    abilities: [{ on: 'play', do: [DECK_EQUIP] }] },
  { name: 'Reconhecimento do Terreno', cardType: 'Tática', atk: 0, hp: 0, cost: 2, effect: 'Leve 1 Equipamento ou Terreno do baralho para a mão.',
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'deck', filter: { types: ['Terreno'], equipment: true } }] }] },
  { name: 'Reforços da Marca', cardType: 'Tática', atk: 0, hp: 0, cost: 2, effect: 'Leve 1 soldado do baralho para a mão.',
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'deck', filter: { types: ['Infantaria', 'Cavalaria', 'Arqueiro', 'Artilharia'] } }] }] },
  { name: 'Marcha Forçada', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: '2 movimentos extras neste turno.',
    abilities: [{ on: 'play', do: [{ kind: 'extra_moves', amount: 2 }] }] },
  { name: 'Contra-Carga', cardType: 'Emboscada', atk: 0, hp: 0, cost: 2, effect: '**Armada:** a unidade atacada ganha +2 ATK e +1 HP até o fim do turno.',
    abilities: [{ on: 'ambush', do: [{ kind: 'buff_defender', atk: 2, hp: 1, ifArmed: true }] }] },
  { name: 'Cerca de Estacas', maxCopies: 1, cardType: 'Emboscada', atk: 0, hp: 0, cost: 2, effect: 'A unidade atacada ganha +3 HP até o fim do turno.',
    abilities: [{ on: 'ambush', do: [{ kind: 'buff_defender', atk: 0, hp: 3 }] }] },
  { name: 'Arsenal do Marquês', maxCopies: 2, trigger: 'postura', cardType: 'Relíquia', atk: 0, hp: 5, cost: 3, effect: 'Suas **Armadas** recebem 2 de dano a menos por ataque.',
    passives: [{ kind: 'aura', who: ARMED, reduce: 2 }] },
];

export const CAMPO_RECIPE = {
  id: 'campo', name: 'Deck de Campo', description: 'Soldados armados, de qualquer tipo: equipamentos, Terrenos com modos e busca.', general: 'Margrave Osric, Senhor das Marcas',
  cards: {
    'Escudeiro de Campanha': 3, 'Cavaleiro da Marca': 3, 'Guarda de Fronteira': 3, 'Lanceiro Montado': 3, 'Arqueiro de Colina': 2,
    'Besteiro de Posto': 3, 'Armeiro de Campanha': 3, 'Escudeiro Veterano': 2, 'Mapeador de Marchas': 2,
    'Sargento de Marcha': 2, 'Intendente de Marcha': 2, 'Cavaleiro Batedor': 2,
    'Campeão da Marca': 1, 'Mestre de Armas': 1,
    'Cota Remendada': 3, 'Escudo de Carvalho': 2, 'Espada de Posto': 3, 'Elmo Ferrado': 2, 'Machado de Guerra': 1, 'Armadura de Placas': 2,
    'Forja de Campanha': 2, 'Posto de Marcha': 2,
    'Intendência de Campanha': 2, 'Reconhecimento do Terreno': 2, 'Reforços da Marca': 1, 'Marcha Forçada': 1,
    'Contra-Carga': 2, 'Cerca de Estacas': 1, 'Arsenal do Marquês': 2,
  } as Record<string, number>,
};
export const registerCampo = () => registerCardDefs(CAMPO_DEFS);
