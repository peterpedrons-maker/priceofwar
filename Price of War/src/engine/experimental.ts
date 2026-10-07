// Decks em teste: cartas e receitas que AINDA NÃO fazem parte do jogo. Só o laboratório (tests/balance-merc.ts) as registra;
// o catálogo (CARD_DEFS), os boosters, o editor de decks e o servidor não conhecem nada daqui.
// Proposta e decisões: docs/deck-mercenarios.md.
import { registerCardDefs } from './catalog';
import type { CardDef } from './types';

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
    // 28 mercenários + 7 sem manutenção
    'Lanceiro de Aluguel': 4, 'Besteiro Contratado': 4, 'Espadachim do Soldo': 4, 'Desertor': 4, 'Capitão da Companhia': 2,
    'Cavaleiro Errante': 3, 'Duelista Livre': 4, 'Bombardeiro Contratado': 3,
    'Sentinela Fiel': 4, 'Tesoureiro da Companhia': 3,
    // a Relíquia e quem a busca
    'Livro de Contratos': 3, 'Graal da Dádiva': 3,
    // táticas que já existem (universais)
    'Catapulta de Guerra': 2, 'Balestra de Precisão': 2, 'Trabuco de Cerco': 1,
    'Armadura de Guerra': 2, 'Couraça Reforçada': 2, 'Espada Longa': 2, 'Flechas Venenosas': 1,
    'Recrutamento Seletivo': 2, 'Retorno do Soldado': 1, 'Reforços Ocultos': 2, 'Tributo de Guerra': 2,
  } as Record<string, number>,
};

export const registerMercenarios = () => { registerCardDefs(MERCENARIOS_DEFS); };
