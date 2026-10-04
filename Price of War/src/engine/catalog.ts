// The one card catalog: every card's rules-relevant data (stats, type, rules text) keyed by NAME, plus
// the two prebuilt deck lists. No artwork lives here on purpose — the engine runs anywhere (browser,
// server, tests) and the client attaches the art by name. Changing a number here changes it for
// every player, the opponent AI and (later) the online server alike.
import type { CardDef, CardType, TargetSpec } from './types';

// Pedaços reutilizados nas descrições de efeito abaixo (alvos que se repetem).
const SOLDIERS: CardType[] = ['Infantaria', 'Cavalaria', 'Arqueiro', 'Artilharia'];
const OWN_UNIT: TargetSpec = { side: 'own', area: 'unit' };
const ENEMY_UNIT: TargetSpec = { side: 'enemy', area: 'unit' };

export const CARD_DEFS: readonly CardDef[] = [
  // ── capitao ──
  { name: "Comandante Aurelion, Mestre da Formação", cardType: "General", atk: 0, hp: 20, cost: 0, isFullArt: true, effect: "Após Remanejamento: até 2 unidades que se moveram ganham +1/+1 no próximo combate. Passiva: unidades adjacentes recebem -1 de dano.",
    faction: "ordem",
    abilities: [{ on: 'turn_end', do: [{ kind: 'buff_moved', count: 2, atk: 1, hp: 1 }] }],
    passives: [{ kind: 'aura', who: { side: 'own', slots: [10, 11] }, reduce: 1 }] },
  { name: "Soldado Tático", cardType: "Infantaria", atk: 3, hp: 3, cost: 2, effect: "Troca com aliado adjacente no fim do turno.",
    abilities: [{ on: 'turn_end', do: [{ kind: 'swap_adjacent' }] }] },
  { name: "Escudeiro de Linha", trigger: "postura", cardType: "Infantaria", atk: 2, hp: 4, cost: 2, effect: "Na Vanguarda: a unidade logo atrás dele, na mesma coluna, recebe -1 de dano.",
    passives: [{ kind: 'aura', who: { side: 'own', behind: true }, from: 'front', reduce: 1 }] },
  { name: "Capitão de Formação", cardType: "Infantaria", atk: 3, hp: 4, cost: 3, isFullArt: true, trigger: "manobra", effect: "Adjacentes ganham +1 ATK.",
    abilities: [{ on: 'move', do: [{ kind: 'buff_adjacent', atk: 1 }] }] },
  { name: "Batedor", cardType: "Infantaria", atk: 1, hp: 2, cost: 1, effect: "Move após combate.",
    abilities: [{ on: 'after_attack', do: [{ kind: 'free_move' }] }] },
  { name: "Lanceiro de Controle", trigger: "postura", cardType: "Infantaria", atk: 3, hp: 2, cost: 2, effect: "Inimigo à sua frente recebe -1 ATK.",
    passives: [{ kind: 'aura', who: { side: 'enemy', facing: true }, atk: -1 }] },
  { name: "Cavaleiro Tático", cardType: "Cavalaria", atk: 4, hp: 4, cost: 3, isFullArt: true, effect: "Troca com qualquer aliado na linha.",
    passives: [{ kind: 'flag', flag: 'row_swap' }] },
  { name: "Veterano de Guerra", trigger: "postura", cardType: "Infantaria", atk: 4, hp: 3, cost: 3, isFullArt: true, effect: "+2 ATK na coluna 3.",
    passives: [{ kind: 'aura', who: { side: 'self' }, when: { col: 2 }, atk: 2 }] },
  { name: "Reformar Linhas", cardType: "Tática", atk: 0, hp: 0, cost: 2, isFullArt: true, effect: "Reorganiza até 3 unidades.",
    abilities: [{ on: 'play', do: [{ kind: 'extra_moves', amount: 3 }] }] },
  { name: "Avanço Coordenado", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Após mover: +2 ATK.",
    abilities: [{ on: 'play', do: [
      { kind: 'buff', atk: 2, target: { ...OWN_UNIT, needs: 'moved', prompt: 'Escolha uma unidade sua que já se moveu neste turno.' } },
    ] }] },
  { name: "Reposicionamento Rápido", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Move inimigo 1 slot.",
    abilities: [{ on: 'play', do: [
      { kind: 'displace', target: { ...ENEMY_UNIT, prompt: 'Escolha uma unidade inimiga para deslocar.' } },
    ] }] },
  { name: "Linha Fechada", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Adjacentes recebem menos dano.",
    abilities: [{ on: 'play', do: [
      { kind: 'guard_adjacent', amount: 1, target: { ...OWN_UNIT, prompt: 'Escolha uma unidade sua — os aliados ao lado dela recebem menos dano.' } },
    ] }] },
  { name: "Ordem de Retirada", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Move para a Retaguarda + cura.",
    abilities: [{ on: 'play', do: [
      { kind: 'retreat', heal: 2, target: { ...OWN_UNIT, where: 'front', prompt: 'Escolha uma unidade sua na Vanguarda.' } },
    ] }] },
  { name: "Bloqueio Instantâneo", cardType: "Emboscada", atk: 0, hp: 0, cost: 2, effect: "Cancela ataque se houver adjacente.",
    abilities: [{ on: 'ambush', do: [{ kind: 'cancel_attack', ifAdjacentAlly: true }] }] },
  { name: "Contra-Manobra", cardType: "Emboscada", atk: 0, hp: 0, cost: 3, isFullArt: true, effect: "Troca posições durante o ataque.",
    abilities: [{ on: 'ambush', do: [{ kind: 'swap_defender' }] }] },
  { name: "Formação Quebrada", cardType: "Emboscada", atk: 0, hp: 0, cost: 2, effect: "Move inimigo aleatoriamente.",
    abilities: [{ on: 'ambush', do: [{ kind: 'displace_attacker' }] }] },
  { name: "Estandarte da Legião", cardType: "Relíquia", atk: 0, hp: 5, cost: 3, isFullArt: true, effect: "Permanente. Todas as unidades aliadas ganham +1 ATK enquanto esta relíquia estiver no campo.",
    passives: [{ kind: 'aura', who: { side: 'own' }, atk: 1 }] },
  { name: "Fortaleza de Pedra", cardType: "Terreno", atk: 0, hp: 8, cost: 3, isFullArt: true, effect: "Permanente. Unidades aliadas na Retaguarda recebem -1 de dano de ataques inimigos.",
    passives: [{ kind: 'aura', who: { side: 'own', row: 'back' }, reduce: 1 }] },
  { name: "Pântano Maldito", cardType: "Terreno", atk: 0, hp: 6, cost: 2, effect: "Permanente. Unidades inimigas na Vanguarda sofrem -1 ATK enquanto este terreno estiver no campo.",
    passives: [{ kind: 'aura', who: { side: 'enemy', row: 'front' }, atk: -1 }] },
  // ── cardeal ──
  { name: "Cardeal Pedro, Voz da Fé", cardType: "General", atk: 0, hp: 20, cost: 0, isFullArt: true, effect: "Fase Principal: pague 2 ouro para curar 1 HP em um soldado aliado, mesmo com HP cheio.",
    faction: "fe",
    abilities: [{ on: 'ability', phases: ['preparacao', 'movimentacao'], once: true, cost: 2, do: [
      { kind: 'heal', amount: 1, withAuras: true, target: { ...OWN_UNIT, prompt: 'Escolha um soldado aliado no campo.' } },
    ] }] },
  { name: "Cálice da Graça", cardType: "Relíquia", atk: 0, hp: 5, cost: 3, isFullArt: true, effect: "Permanente. A cura do General Cardeal Pedro aumenta de 1 para 2 HP.",
    passives: [{ kind: 'aura', who: { side: 'own', slots: [12] }, healBonus: 1 }] },
  { name: "Devotos da Cruzada", cardType: "Infantaria", atk: 0, hp: 3, cost: 1, effect: "—" },
  { name: "Mercador da Cruzada", trigger: "comando", cardType: "Infantaria", atk: 1, hp: 1, cost: 1, effect: "Uma vez por turno: veja as 2 cartas do topo do deck. Adicione 1 à mão e coloque a outra no fundo.",
    abilities: [{ on: 'ability', once: true, do: [{ kind: 'look_top', count: 2, keepMin: 1, keepMax: 1 }] }] },
  { name: "Infiltrado da Ordem", trigger: "postura", cardType: "Infantaria", atk: 1, hp: 2, cost: 1, effect: "Na Vanguarda: impede Emboscadas inimigas. Se o General aliado receber dano, no próximo turno não poderá usar sua habilidade.",
    passives: [
      { kind: 'flag', flag: 'blocks_ambush', from: 'front' },
      { kind: 'flag', flag: 'locks_general' },
    ] },
  { name: "Fanático da Cruzada", cardType: "Infantaria", atk: 1, hp: 2, cost: 1, trigger: "ofensiva", effect: "Se o General inimigo for de tipo oposto, ganha +2 ATK.",
    abilities: [{ on: 'attack', do: [{ kind: 'attack_bonus', amount: 2, ifEnemyGeneral: 'other_faction' }] }] },
  { name: "Recruta Devoto", cardType: "Infantaria", atk: 0, hp: 2, cost: 1, effect: "Ao ser curado: recebe +1 ATK permanente.",
    abilities: [{ on: 'healed', do: [{ kind: 'buff', atk: 1 }] }] },
  { name: "Intendente do Exército", trigger: "comando", cardType: "Infantaria", atk: 2, hp: 3, cost: 2, effect: "Uma vez por turno: se você tiver menos de 2 cartas na mão, compre até ficar com 2.",
    abilities: [{ on: 'turn_start', do: [{ kind: 'refill_hand', to: 2 }] }] },
  { name: "Soldados da Ordem", cardType: "Infantaria", atk: 3, hp: 4, cost: 2, trigger: "reforco", effect: "Se a carta da frente da coluna cair, esta desce e ganha Escudo 2.",
    abilities: [{ on: 'front_fell', do: [{ kind: 'reinforce', shield: 2 }] }] },
  { name: "Jorge, Lança Sagrada", cardType: "Cavalaria", atk: 4, hp: 6, cost: 3, isFullArt: true, trigger: "ofensiva", effect: "Contra a Vanguarda, causa 2 de dano à unidade na Retaguarda da mesma coluna.",
    abilities: [{ on: 'attack', do: [{ kind: 'splash_behind', amount: 2 }] }] },
  { name: "Cavaleiro Hospitalário", trigger: "comando", cardType: "Cavalaria", atk: 2, hp: 3, cost: 2, effect: "Uma vez por turno: cure 1 HP de um aliado e cause 1 de dano a um inimigo na Vanguarda.",
    abilities: [{ on: 'ability', phases: ['preparacao', 'movimentacao'], once: true, do: [
      { kind: 'heal', amount: 1, target: { ...OWN_UNIT, needs: 'damaged', optional: true, prompt: 'Toque em um aliado ferido para curar 1 HP.' } },
      { kind: 'damage', amount: 1, target: { ...ENEMY_UNIT, where: 'front', optional: true, prompt: 'Toque em um inimigo da Vanguarda para causar 1 de dano.' } },
    ] }] },
  { name: "Nobre da Cruzada", cardType: "Cavalaria", atk: 4, hp: 5, cost: 3, isFullArt: true, trigger: "convocacao", effect: "Convoca Soldados Leais (1 ATK / 1 HP) nos slots adjacentes livres da mesma fileira.",
    abilities: [{ on: 'place', do: [{ kind: 'summon_token', token: 'Soldado Leal' }] }] },
  { name: "Cavaleiro da Luz", cardType: "Cavalaria", atk: 4, hp: 5, cost: 3, isFullArt: true, effect: "—" },
  { name: "Comandante da Ordem", trigger: "postura", cardType: "Cavalaria", atk: 5, hp: 5, cost: 3, isFullArt: true, effect: "Na Vanguarda: Infantaria e Arqueiros aliados ganham +1 ATK e +1 HP durante o combate.",
    passives: [{
      kind: 'aura', who: { side: 'own', types: ['Infantaria', 'Arqueiro'] }, from: 'front', atk: 1, combatHp: 1,
    }] },
  { name: "Arqueiro da Ordem", cardType: "Arqueiro", atk: 1, hp: 4, cost: 2, effect: "Pode atacar duas vezes por rodada.",
    passives: [{ kind: 'aura', who: { side: 'self' }, attacks: 1 }] },
  { name: "Atirador da Cruzada", cardType: "Arqueiro", atk: 1, hp: 3, cost: 2, trigger: "queda", effect: "Compre 2 cartas.",
    abilities: [{ on: 'destroyed', do: [{ kind: 'draw', amount: 2 }] }] },
  { name: "Trabuco de Cerco", cardType: "Tática", atk: 0, hp: 0, cost: 3, isFullArt: true, effect: "Causa 2 de dano a TODAS as unidades inimigas.",
    abilities: [{ on: 'play', do: [{ kind: 'damage', amount: 2, all: 'enemy' }] }] },
  { name: "Catapulta de Guerra", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Escolha uma fileira inimiga. Todas as unidades naquela fileira recebem 2 de dano.",
    abilities: [{ on: 'play', do: [
      { kind: 'damage', amount: 2, target: { ...ENEMY_UNIT, area: 'row', prompt: 'Escolha uma fileira inimiga (clique em qualquer slot dela).' } },
    ] }] },
  { name: "Balestra de Precisão", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Causa 3 de dano a uma unidade inimiga à sua escolha.",
    abilities: [{ on: 'play', do: [
      { kind: 'damage', amount: 3, target: { ...ENEMY_UNIT, prompt: 'Escolha uma unidade inimiga para causar 3 de dano.' } },
    ] }] },
  { name: "Armadura de Guerra", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Infantaria equipada recebe +2 HP.",
    abilities: [{ on: 'play', do: [
      { kind: 'equip', hp: 2, target: { ...OWN_UNIT, types: ['Infantaria'], prompt: 'Escolha uma Infantaria sua para equipar (+2 HP).' } },
    ] }] },
  { name: "Couraça Reforçada", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Arqueiro, Plebeu ou Infantaria equipada recebe +1 HP.",
    abilities: [{ on: 'play', do: [
      { kind: 'equip', hp: 1, target: { ...OWN_UNIT, types: ['Arqueiro', 'Infantaria'], prompt: 'Escolha um Arqueiro ou Infantaria sua para equipar (+1 HP).' } },
    ] }] },
  { name: "Flechas Venenosas", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Arqueiro equipado recebe +1 ATK.",
    abilities: [{ on: 'play', do: [
      { kind: 'equip', atk: 1, target: { ...OWN_UNIT, types: ['Arqueiro'], prompt: 'Escolha um Arqueiro seu para equipar (+1 ATK).' } },
    ] }] },
  { name: "Espada Longa", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Cavalaria, Infantaria ou Plebeu equipado recebe +2 ATK.",
    abilities: [{ on: 'play', do: [
      { kind: 'equip', atk: 2, target: { ...OWN_UNIT, types: ['Cavalaria', 'Infantaria'], prompt: 'Escolha uma Cavalaria ou Infantaria sua para equipar (+2 ATK).' } },
    ] }] },
  { name: "Reforços Ocultos", cardType: "Emboscada", atk: 0, hp: 0, cost: 1, effect: "Durante um ataque inimigo: um soldado aliado recebe +2 ATK e +1 HP até o fim do turno.",
    abilities: [{ on: 'ambush', do: [{ kind: 'buff_defender', atk: 2, hp: 1 }] }] },
  { name: "Retorno do Soldado", cardType: "Tática", atk: 0, hp: 0, cost: 1, isFullArt: true, effect: "Adicione um soldado do cemitério à sua mão.",
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'graveyard', filter: { types: SOLDIERS } }] }] },
  { name: "Graal da Dádiva", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Adicione uma carta de Terreno ou Relíquia do deck à sua mão.",
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'deck', filter: { types: ['Terreno', 'Relíquia'] } }] }] },
  { name: "Doutrina Renovada", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Adicione uma carta de Tática do deck à sua mão.",
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'deck', filter: { types: ['Tática'] } }] }] },
  { name: "Recrutamento Seletivo", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Adicione um soldado do deck à sua mão.",
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'deck', filter: { types: SOLDIERS } }] }] },
  { name: "Recrutar Veteranos", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Veja as 4 cartas do topo. Adicione 2 à mão e coloque 2 no fundo do deck.",
    abilities: [{ on: 'play', do: [{ kind: 'look_top', count: 4, keepMin: 1, keepMax: 2 }] }] },
  { name: "Tributo de Guerra", cardType: "Tática", atk: 0, hp: 0, cost: 0, effect: "Ganhe 1 ouro adicional neste turno.",
    abilities: [{ on: 'play', do: [{ kind: 'gold', amount: 1 }] }] },
  { name: "Chamado às Armas", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Convoque do deck até 2 soldados com 0 ATK para slots livres na Vanguarda. Embaralhe o deck.",
    abilities: [{ on: 'play', do: [{ kind: 'summon_deck', max: 2, filter: { types: SOLDIERS, atk: 0 } }] }] },
];

export type DeckId = 'capitao' | 'cardeal';

export type DeckRecipe = { id: DeckId; name: string; description: string; general: string; cards: Record<string, number> };

export const DECK_RECIPES: Record<DeckId, DeckRecipe> = {
  capitao: {
    id: 'capitao', name: "Deck Capitão", description: "Infantaria disciplinada e reformação tática.", general: "Comandante Aurelion, Mestre da Formação",
    cards: {
      "Soldado Tático": 4,
      "Escudeiro de Linha": 4,
      "Capitão de Formação": 4,
      "Batedor": 4,
      "Lanceiro de Controle": 4,
      "Cavaleiro Tático": 4,
      "Veterano de Guerra": 3,
      "Reformar Linhas": 2,
      "Avanço Coordenado": 2,
      "Reposicionamento Rápido": 2,
      "Linha Fechada": 2,
      "Ordem de Retirada": 2,
      "Bloqueio Instantâneo": 3,
      "Contra-Manobra": 3,
      "Formação Quebrada": 3,
      "Estandarte da Legião": 1,
      "Fortaleza de Pedra": 1,
      "Pântano Maldito": 1,
    },
  },
  cardeal: {
    id: 'cardeal', name: "Deck Cardeal Pedro", description: "Fé e ferro — cura, convocações e emboscadas sagradas.", general: "Cardeal Pedro, Voz da Fé",
    cards: {
      "Cálice da Graça": 1,
      "Devotos da Cruzada": 4,
      "Mercador da Cruzada": 2,
      "Infiltrado da Ordem": 1,
      "Fanático da Cruzada": 1,
      "Recruta Devoto": 2,
      "Intendente do Exército": 2,
      "Soldados da Ordem": 2,
      "Jorge, Lança Sagrada": 3,
      "Cavaleiro Hospitalário": 2,
      "Nobre da Cruzada": 2,
      "Cavaleiro da Luz": 4,
      "Comandante da Ordem": 1,
      "Arqueiro da Ordem": 2,
      "Atirador da Cruzada": 2,
      "Trabuco de Cerco": 2,
      "Catapulta de Guerra": 3,
      "Balestra de Precisão": 1,
      "Armadura de Guerra": 2,
      "Couraça Reforçada": 2,
      "Flechas Venenosas": 1,
      "Espada Longa": 2,
      "Reforços Ocultos": 2,
      "Retorno do Soldado": 1,
      "Graal da Dádiva": 1,
      "Doutrina Renovada": 2,
      "Recrutamento Seletivo": 2,
      "Recrutar Veteranos": 2,
      "Tributo de Guerra": 2,
      "Chamado às Armas": 2,
    },
  },
};

// ── Balance ─────────────────────────────────────────────────────────────────
// Numbers tuned after play-testing live here, apart from the card definitions, so the base stats stay readable and the rules tests
// (which set `globalThis.__POW_RAW_STATS__` before loading this file) keep running on the untouched ones.
//  - Capitão: its units (a positional deck that needs strong bodies) gain +2 ATK / +1 HP. Measured over AI-vs-AI matches (tests/ai-arena.ts
//    and docs/balanceamento.md): the deck won about 2% of its matches against the Cardeal before, about 45% with this.
export const BALANCE: Record<string, { atk?: number; hp?: number; cost?: number }> = {
  "Soldado Tático": { atk: 2, hp: 1 }, "Escudeiro de Linha": { atk: 2, hp: 1 }, "Capitão de Formação": { atk: 2, hp: 1 }, "Batedor": { atk: 2, hp: 1 },
  "Lanceiro de Controle": { atk: 2, hp: 1 }, "Cavaleiro Tático": { atk: 2, hp: 1 }, "Veterano de Guerra": { atk: 2, hp: 1 },
};
if (!(globalThis as { __POW_RAW_STATS__?: boolean }).__POW_RAW_STATS__) {
  CARD_DEFS.forEach(c => {
    const d = BALANCE[c.name];
    if (!d) return;
    const def = c as { atk: number; hp: number; cost: number };
    def.atk += d.atk ?? 0; def.hp += d.hp ?? 0; def.cost += d.cost ?? 0;
  });
}

const BY_NAME: Record<string, CardDef> = {};
CARD_DEFS.forEach(c => { BY_NAME[c.name] = c; });

export const getCardDef = (name: string): CardDef | undefined => BY_NAME[name];
export const requireCardDef = (name: string): CardDef => {
  const def = BY_NAME[name];
  if (!def) throw new Error(`Unknown card: ${name}`);
  return def;
};
export const isGeneralName = (name: string) => BY_NAME[name]?.cardType === 'General';

// Soldado Leal — the token Nobre da Cruzada summons. Not a deck card, so it is not in CARD_DEFS' lists
// of any recipe, but the art/UI still needs to find it by name.
export const TOKEN_DEFS: readonly CardDef[] = [
  { name: 'Soldado Leal', cardType: 'Infantaria', atk: 1, hp: 1, cost: 0, effect: '' },
];
TOKEN_DEFS.forEach(c => { BY_NAME[c.name] = c; });
