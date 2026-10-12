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

// ── Deck de Campo (experimental): equipamentos e Terrenos ────────────────────────────────────────────────────────────
const OWN_UNIT: TargetSpec = { side: 'own', area: 'unit' };
const equip = (stats: { atk?: number; hp?: number; block?: boolean }, types: CardDef['cardType'][], prompt: string) =>
  ({ on: 'play' as const, do: [{ kind: 'equip' as const, ...stats, target: { ...OWN_UNIT, types, prompt } }] });
const GRAVE_EQUIP = { kind: 'search', zone: 'graveyard', filter: { equipment: true } } as const;
const DECK_EQUIP = { kind: 'search', zone: 'deck', filter: { equipment: true } } as const;

export const CAMPO_DEFS: readonly CardDef[] = [
  { name: 'Margrave Osric, Senhor das Marcas', cardType: 'General', atk: 0, hp: 30, cost: 0, isFullArt: true, trigger: 'comando', faction: 'marca',
    effect: 'Pague 2 de ouro: leve 1 Equipamento do cemitério para a mão. **Passiva** Suas unidades armadas e a Relíquia recebem 1 de dano a menos por ataque.',
    abilities: [{ on: 'ability', once: true, cost: 2, do: [GRAVE_EQUIP] }],
    passives: [{ kind: 'aura', who: { side: 'own', armed: true }, reduce: 1 }, { kind: 'aura', who: { side: 'own', slots: [10] }, reduce: 1 }] },

  // núcleo
  { name: 'Escudeiro de Campanha', cardType: 'Infantaria', atk: 3, hp: 4, cost: 2, trigger: 'postura', effect: '+1 ATK por equipamento preso (máx. +2).',
    passives: [{ kind: 'aura', who: { side: 'self' }, from: 'front', atk: 1, perEquip: { cap: 2 } }] },
  { name: 'Cavaleiro da Marca', cardType: 'Cavalaria', atk: 3, hp: 4, cost: 3, trigger: 'postura', effect: 'Com Terreno em campo, +1 ATK.',
    passives: [{ kind: 'aura', who: { side: 'self' }, from: 'front', needs: 'terrain', atk: 1 }] },
  { name: 'Besteiro de Posto', cardType: 'Arqueiro', atk: 2, hp: 3, cost: 2, trigger: 'convocacao', effect: 'Leve 1 Equipamento do baralho para a mão.',
    abilities: [{ on: 'place', do: [DECK_EQUIP] }] },
  { name: 'Mapeador de Marchas', cardType: 'Arqueiro', atk: 1, hp: 3, cost: 1, trigger: 'convocacao', effect: 'Leve 1 Terreno do baralho para a mão.',
    abilities: [{ on: 'place', do: [{ kind: 'search', zone: 'deck', filter: { types: ['Terreno'] } }] }] },
  { name: 'Guarda de Fronteira', cardType: 'Infantaria', atk: 2, hp: 5, cost: 3, trigger: 'postura', effect: 'Com Terreno em campo, +1 HP em combate.',
    passives: [{ kind: 'aura', who: { side: 'self' }, from: 'front', needs: 'terrain', combatHp: 1 }] },

  // apoio
  { name: 'Armeiro de Campanha', cardType: 'Infantaria', atk: 2, hp: 4, cost: 2, trigger: 'queda', effect: 'Leve 1 Equipamento do cemitério para a mão.',
    abilities: [{ on: 'destroyed', do: [GRAVE_EQUIP] }] },
  { name: 'Lanceiro Montado', cardType: 'Cavalaria', atk: 3, hp: 5, cost: 3, trigger: 'ofensiva', effect: 'Se estiver armada, 2 de dano à carta atrás.',
    abilities: [{ on: 'attack', do: [{ kind: 'splash_behind', amount: 2, ifArmed: true }] }] },
  { name: 'Arqueiro de Colina', cardType: 'Arqueiro', atk: 2, hp: 4, cost: 3, trigger: 'postura', effect: 'Na Retaguarda, +1 ATK por equipamento preso (máx. +2).',
    passives: [{ kind: 'aura', who: { side: 'self' }, from: 'back', atk: 1, perEquip: { cap: 2 } }] },
  { name: 'Sargento de Marcha', cardType: 'Infantaria', atk: 2, hp: 4, cost: 3, trigger: 'convocacao', effect: 'Compre 1 carta.',
    abilities: [{ on: 'place', do: [{ kind: 'draw', amount: 1 }] }] },
  { name: 'Escudeiro Veterano', cardType: 'Infantaria', atk: 2, hp: 5, cost: 3, trigger: 'queda', effect: 'O equipamento preso volta para a sua mão.',
    passives: [{ kind: 'flag', flag: 'recover_equipment' }] },

  // únicas
  { name: 'Campeão da Marca', maxCopies: 1, cardType: 'Cavalaria', atk: 4, hp: 6, cost: 4, trigger: 'postura', effect: '+1/+1 em combate por equipamento preso (máx. +3).',
    passives: [{ kind: 'aura', who: { side: 'self' }, from: 'front', atk: 1, combatHp: 1, perEquip: { cap: 3 } }] },
  { name: 'Lorde das Campinas', maxCopies: 1, cardType: 'Cavalaria', atk: 3, hp: 5, cost: 4, trigger: 'postura', effect: 'Suas Cavalarias: +1 ATK.',
    passives: [{ kind: 'aura', who: { side: 'own', types: ['Cavalaria'] }, from: 'front', atk: 1 }] },
  { name: 'Mestre de Armas', maxCopies: 1, cardType: 'Infantaria', atk: 2, hp: 5, cost: 3, trigger: 'postura', effect: 'Suas unidades armadas: +1 ATK.',
    passives: [{ kind: 'aura', who: { side: 'own', armed: true }, from: 'front', atk: 1 }] },

  // equipamentos
  { name: 'Cota Remendada', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Equipe uma Infantaria ou Cavalaria: +1 ATK e +2 HP.',
    abilities: [equip({ atk: 1, hp: 2 }, ['Infantaria', 'Cavalaria'], 'Escolha uma Infantaria ou Cavalaria sua para equipar (+1 ATK e +2 HP).')] },
  { name: 'Escudo de Carvalho', maxCopies: 2, cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Equipe uma Infantaria ou Cavalaria: Guarda (absorve o primeiro golpe inteiro).',
    abilities: [equip({ block: true }, ['Infantaria', 'Cavalaria'], 'Escolha uma Infantaria ou Cavalaria sua para equipar (Guarda).')] },
  { name: 'Lança de Fresno', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Equipe uma Cavalaria: +2 ATK e +1 HP.',
    abilities: [equip({ atk: 2, hp: 1 }, ['Cavalaria'], 'Escolha uma Cavalaria sua para equipar (+2 ATK e +1 HP).')] },
  { name: 'Arco Longo de Teixo', maxCopies: 2, cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Equipe um Arqueiro: +2 ATK e +1 HP.',
    abilities: [equip({ atk: 2, hp: 1 }, ['Arqueiro'], 'Escolha um Arqueiro seu para equipar (+2 ATK e +1 HP).')] },
  { name: 'Machado de Guerra', maxCopies: 1, cardType: 'Tática', atk: 0, hp: 0, cost: 2, effect: 'Equipe uma Infantaria: +3 ATK.',
    abilities: [equip({ atk: 3 }, ['Infantaria'], 'Escolha uma Infantaria sua para equipar (+3 ATK).')] },
  { name: 'Sela Reforçada', maxCopies: 2, cardType: 'Tática', atk: 0, hp: 0, cost: 2, effect: 'Equipe uma Cavalaria: +2/+2.',
    abilities: [equip({ atk: 2, hp: 2 }, ['Cavalaria'], 'Escolha uma Cavalaria sua para equipar (+2/+2).')] },

  // Terrenos (sem vida: nenhum ataque os alcança; um só espaço, cada um troca o anterior)
  { name: 'Campina Aberta', maxCopies: 2, trigger: 'postura', cardType: 'Terreno', atk: 0, hp: 0, cost: 2, effect: 'Suas Cavalarias: +2 ATK. Inimigos de frente para elas: -2 ATK.',
    passives: [{ kind: 'aura', who: { side: 'own', types: ['Cavalaria'] }, atk: 2 }, { kind: 'aura', who: { side: 'enemy', facingOwn: ['Cavalaria'] }, atk: -2 }] },
  { name: 'Colina Fortificada', maxCopies: 2, trigger: 'postura', cardType: 'Terreno', atk: 0, hp: 0, cost: 2, effect: 'Suas Infantarias na Vanguarda: +2 HP em combate e 1 de dano a menos por ataque.',
    passives: [{ kind: 'aura', who: { side: 'own', row: 'front', types: ['Infantaria'] }, combatHp: 2, reduce: 1 }] },
  { name: 'Floresta Espessa', maxCopies: 1, trigger: 'postura', cardType: 'Terreno', atk: 0, hp: 0, cost: 2, effect: 'Seus Arqueiros: +2 HP em combate. Os da Retaguarda recebem 1 de dano a menos por ataque.',
    passives: [{ kind: 'aura', who: { side: 'own', types: ['Arqueiro'] }, combatHp: 2 }, { kind: 'aura', who: { side: 'own', row: 'back', types: ['Arqueiro'] }, reduce: 1 }] },
  { name: 'Forja de Campanha', maxCopies: 1, trigger: 'postura', cardType: 'Terreno', atk: 0, hp: 0, cost: 3, effect: 'Suas unidades armadas: +2 HP em combate.',
    passives: [{ kind: 'aura', who: { side: 'own', armed: true }, combatHp: 2 }] },

  // outras Táticas, Emboscadas e Relíquia
  { name: 'Intendência de Campanha', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Leve 1 Equipamento do baralho para a mão.',
    abilities: [{ on: 'play', do: [DECK_EQUIP] }] },
  { name: 'Reconhecimento do Terreno', cardType: 'Tática', atk: 0, hp: 0, cost: 2, effect: 'Leve 1 Equipamento ou Terreno do baralho para a mão.',
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'deck', filter: { types: ['Terreno'], equipment: true } }] }] },
  { name: 'Marcha Forçada', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: '2 movimentos extras neste turno.',
    abilities: [{ on: 'play', do: [{ kind: 'extra_moves', amount: 2 }] }] },
  { name: 'Contra-Carga', cardType: 'Emboscada', atk: 0, hp: 0, cost: 2, effect: 'A unidade atacada, se estiver armada, ganha +2 ATK e +1 HP até o fim do turno.',
    abilities: [{ on: 'ambush', do: [{ kind: 'buff_defender', atk: 2, hp: 1, ifArmed: true }] }] },
  { name: 'Cerca de Estacas', maxCopies: 1, cardType: 'Emboscada', atk: 0, hp: 0, cost: 2, effect: 'A unidade atacada ganha +3 HP até o fim do turno.',
    abilities: [{ on: 'ambush', do: [{ kind: 'buff_defender', atk: 0, hp: 3 }] }] },
  { name: 'Arsenal do Marquês', maxCopies: 2, trigger: 'postura', cardType: 'Relíquia', atk: 0, hp: 5, cost: 3, effect: 'Suas unidades armadas recebem 2 de dano a menos por ataque.',
    passives: [{ kind: 'aura', who: { side: 'own', armed: true }, reduce: 2 }] },
];

export const CAMPO_RECIPE = {
  id: 'campo', name: 'Deck de Campo', description: 'Equipamentos e Terrenos: quem está armado e em bom campo vence.', general: 'Margrave Osric, Senhor das Marcas',
  cards: {
    'Escudeiro de Campanha': 3, 'Cavaleiro da Marca': 3, 'Besteiro de Posto': 3, 'Mapeador de Marchas': 3, 'Guarda de Fronteira': 3,
    'Armeiro de Campanha': 2, 'Lanceiro Montado': 2, 'Arqueiro de Colina': 3, 'Sargento de Marcha': 3, 'Escudeiro Veterano': 2,
    'Campeão da Marca': 1, 'Lorde das Campinas': 1, 'Mestre de Armas': 1,
    'Cota Remendada': 3, 'Escudo de Carvalho': 2, 'Lança de Fresno': 3, 'Arco Longo de Teixo': 2, 'Machado de Guerra': 1, 'Sela Reforçada': 2,
    'Campina Aberta': 2, 'Colina Fortificada': 2, 'Floresta Espessa': 1, 'Forja de Campanha': 1,
    'Intendência de Campanha': 2, 'Reconhecimento do Terreno': 2, 'Marcha Forçada': 2,
    'Contra-Carga': 2, 'Cerca de Estacas': 1, 'Arsenal do Marquês': 2,
  } as Record<string, number>,
};
export const registerCampo = () => registerCardDefs(CAMPO_DEFS);
