// Decks em teste: cartas e receitas que AINDA NÃO fazem parte do jogo. Só o laboratório (tests/balance-merc.ts) as registra;
// o catálogo (CARD_DEFS), os boosters, o editor de decks e o servidor não conhecem nada daqui.
// Proposta e decisões: docs/deck-mercenarios.md.
import { registerCardDefs } from './catalog';
import type { CardDef, CardType } from './types';

const SOLDIERS: CardType[] = ['Infantaria', 'Cavalaria', 'Arqueiro', 'Artilharia'];

const GENERAL_NAME = 'Comandante Brann, Senhor da Companhia';

// Regra de bolso (ajustável no laboratório): mercenário custa 1 a menos para convocar do que uma carta normal do mesmo tamanho e cobra 1 de
// manutenção por turno (2 quando tem efeito forte). Cartas sem manutenção e geradoras de ouro equilibram a conta.
export const MERCENARIOS_DEFS: readonly CardDef[] = [
  { name: GENERAL_NAME, trigger: 'comando', cardType: 'General', atk: 0, hp: 30, cost: 0, isFullArt: true, faction: 'soldo',
    effect: 'Pague 3 de ouro: compre 1 carta.',
    abilities: [{ on: 'ability', phases: ['preparacao'], once: true, cost: 3, do: [{ kind: 'draw', amount: 1 }] }] },

  // ── mercenários (com manutenção) ──
  { name: 'Lanceiro de Aluguel', cardType: 'Infantaria', atk: 3, hp: 3, cost: 1, upkeep: 1, effect: '' },
  { name: 'Besteiro Contratado', cardType: 'Arqueiro', atk: 2, hp: 2, cost: 1, upkeep: 1, effect: '' },
  { name: 'Espadachim do Soldo', cardType: 'Infantaria', atk: 4, hp: 4, cost: 2, upkeep: 1, effect: '' },
  { name: 'Desertor', cardType: 'Infantaria', atk: 2, hp: 2, cost: 1, upkeep: 1, effect: 'Rescisão: compre 1 carta.',
    abilities: [{ on: 'dismissed', do: [{ kind: 'draw', amount: 1 }] }] },
  { name: 'Capitão da Companhia', trigger: 'postura', cardType: 'Infantaria', atk: 3, hp: 5, cost: 2, upkeep: 2, effect: 'Na Vanguarda, seus Infantaria e Arqueiros têm +1 ATK.',
    passives: [{ kind: 'aura', who: { side: 'own', types: ['Infantaria', 'Arqueiro'] }, from: 'front', atk: 1 }] },
  { name: 'Cavaleiro Errante', cardType: 'Cavalaria', atk: 4, hp: 5, cost: 3, upkeep: 1, dismiss: 'hand', effect: 'Se dispensado, volta para a mão.' },
  { name: 'Duelista Livre', cardType: 'Infantaria', atk: 5, hp: 3, cost: 2, upkeep: 1, dismiss: 'hand', effect: 'Se dispensado, volta para a mão.' },
  { name: 'Bombardeiro Contratado', cardType: 'Artilharia', atk: 3, hp: 2, cost: 2, upkeep: 1, effect: 'Ataca à distância.' },

  // ── sem manutenção ──
  { name: 'Sentinela Fiel', cardType: 'Infantaria', atk: 2, hp: 4, cost: 2, effect: '' },
  { name: 'Tesoureiro da Companhia', trigger: 'comando', cardType: 'Infantaria', atk: 1, hp: 3, cost: 2, effect: 'No início do turno, ganhe 1 de ouro.',
    abilities: [{ on: 'turn_start', do: [{ kind: 'gold', amount: 1 }] }] },

  // ── táticas, equipamentos e emboscada próprios do deck (nenhuma carta é emprestada do Cardeal nem do Capitão) ──
  { name: 'Escriba de Contratos', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Leve 1 Relíquia do baralho para a mão.',
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'deck', filter: { types: ['Relíquia'] } }] }] },
  { name: 'Agência de Recrutamento', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Leve 1 soldado do baralho para a mão.',
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'deck', filter: { types: SOLDIERS } }] }] },
  { name: 'Resgate de Mercenário', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Leve 1 soldado do cemitério para a mão.',
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'graveyard', filter: { types: SOLDIERS } }] }] },
  { name: 'Recrutamento de Rua', cardType: 'Tática', atk: 0, hp: 0, cost: 2, effect: 'Compre 2 cartas.',
    abilities: [{ on: 'play', do: [{ kind: 'draw', amount: 2 }] }] },
  { name: 'Salva de Besteiros', cardType: 'Tática', atk: 0, hp: 0, cost: 2, effect: '2 de dano a todas as unidades de uma fileira inimiga.',
    abilities: [{ on: 'play', do: [
      { kind: 'damage', amount: 2, target: { side: 'enemy', area: 'row', prompt: 'Escolha uma fileira inimiga (clique em qualquer slot dela).' } },
    ] }] },
  { name: 'Contrato de Execução', cardType: 'Tática', atk: 0, hp: 0, cost: 2, effect: '3 de dano a uma unidade inimiga.',
    abilities: [{ on: 'play', do: [
      { kind: 'damage', amount: 3, target: { side: 'enemy', area: 'unit', prompt: 'Escolha a unidade inimiga que o contrato elimina (3 de dano).' } },
    ] }] },
  { name: 'Carga de Pólvora', cardType: 'Tática', atk: 0, hp: 0, cost: 3, effect: '2 de dano a todas as unidades inimigas e ao General.',
    abilities: [{ on: 'play', do: [{ kind: 'damage', amount: 2, all: 'enemy' }] }] },
  { name: 'Armadura Alugada', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Equipe uma Infantaria: +2 HP.',
    abilities: [{ on: 'play', do: [
      { kind: 'equip', hp: 2, target: { side: 'own', area: 'unit', types: ['Infantaria'], prompt: 'Escolha uma Infantaria sua para equipar (+2 HP).' } },
    ] }] },
  { name: 'Espada de Aluguel', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Equipe uma Infantaria ou Cavalaria: +2 ATK.',
    abilities: [{ on: 'play', do: [
      { kind: 'equip', atk: 2, target: { side: 'own', area: 'unit', types: ['Cavalaria', 'Infantaria'], prompt: 'Escolha uma Cavalaria ou Infantaria sua para equipar (+2 ATK).' } },
    ] }] },
  { name: 'Suborno', cardType: 'Emboscada', atk: 0, hp: 0, cost: 2, effect: 'Cancela um ataque a uma de suas unidades.',
    abilities: [{ on: 'ambush', do: [{ kind: 'cancel_attack' }] }] },

  // ── a Relíquia do deck: três modos, o dono escolhe um no fim do turno (vale até o fim do turno seguinte) ──
  { name: 'Livro de Contratos', cardType: 'Relíquia', atk: 0, hp: 5, cost: 3, isFullArt: true,
    effect: 'Escolha 1 modo no fim do seu turno. Cofre de Guerra: manutenção total -2. Extorsão: +1 de ouro por unidade inimiga destruída (máx. 2 por ciclo). Soldo em Dobro: cartas com manutenção têm +1 ATK.',
    modes: [
      { id: 'cofre', name: 'Cofre de Guerra', effect: 'A manutenção total cai 2.', upkeepFlat: 2 },
      { id: 'extorsao', name: 'Extorsão', effect: '+1 de ouro por unidade inimiga destruída (máx. 2).', loot: { gold: 1, cap: 2 } },
      { id: 'soldo', name: 'Soldo em Dobro', effect: 'Cartas com manutenção têm +1 ATK.', atk: 1 },
    ] },
];

export const MERCENARIOS_RECIPE = {
  id: 'mercenarios', name: 'Deck Mercenários', general: GENERAL_NAME,
  cards: {
    // 31 mercenários e 7 sem manutenção
    'Lanceiro de Aluguel': 4, 'Besteiro Contratado': 4, 'Espadachim do Soldo': 4, 'Desertor': 4, 'Capitão da Companhia': 3,
    'Cavaleiro Errante': 3, 'Duelista Livre': 4, 'Bombardeiro Contratado': 4,
    'Sentinela Fiel': 4, 'Tesoureiro da Companhia': 4,
    // a Relíquia e quem a busca
    'Livro de Contratos': 3, 'Escriba de Contratos': 3,
    // táticas, equipamentos e emboscada próprios
    'Salva de Besteiros': 2, 'Contrato de Execução': 2, 'Carga de Pólvora': 1,
    'Armadura Alugada': 2, 'Espada de Aluguel': 2,
    'Agência de Recrutamento': 2, 'Resgate de Mercenário': 2, 'Recrutamento de Rua': 1, 'Suborno': 2,
  } as Record<string, number>,
};

export const registerMercenarios = () => { registerCardDefs(MERCENARIOS_DEFS); };
