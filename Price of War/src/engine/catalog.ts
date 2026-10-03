// The one card catalog: every card's rules-relevant data (stats, type, rules text) keyed by NAME, plus
// the two prebuilt deck lists. No artwork lives here on purpose — the engine runs anywhere (browser,
// server, tests) and the client attaches the art by name. Changing a number here changes it for
// every player, the opponent AI and (later) the online server alike.
import type { CardDef } from './types';

export const CARD_DEFS: readonly CardDef[] = [
  // ── capitao ──
  { name: "Comandante Aurelion, Mestre da Formação", cardType: "General", atk: 0, hp: 20, cost: 0, isFullArt: true, effect: "Após Remanejamento: até 2 unidades que se moveram ganham +1/+1 no próximo combate. Passiva: unidades adjacentes recebem -1 de dano." },
  { name: "Soldado Tático", cardType: "Infantaria", atk: 3, hp: 3, cost: 2, effect: "Troca com aliado adjacente no fim do turno." },
  { name: "Escudeiro de Linha", trigger: "postura", cardType: "Infantaria", atk: 2, hp: 4, cost: 2, effect: "Protege unidades atrás." },
  { name: "Capitão de Formação", cardType: "Infantaria", atk: 3, hp: 4, cost: 3, isFullArt: true, trigger: "manobra", effect: "Adjacentes ganham +1 ATK." },
  { name: "Batedor", cardType: "Infantaria", atk: 1, hp: 2, cost: 1, effect: "Move após combate." },
  { name: "Lanceiro de Controle", trigger: "postura", cardType: "Infantaria", atk: 3, hp: 2, cost: 2, effect: "Inimigo à sua frente recebe -1 ATK." },
  { name: "Cavaleiro Tático", cardType: "Cavalaria", atk: 4, hp: 4, cost: 3, isFullArt: true, effect: "Troca com qualquer aliado na linha." },
  { name: "Veterano de Guerra", trigger: "postura", cardType: "Infantaria", atk: 4, hp: 3, cost: 3, isFullArt: true, effect: "+2 ATK na coluna 3." },
  { name: "Reformar Linhas", cardType: "Tática", atk: 0, hp: 0, cost: 2, isFullArt: true, effect: "Reorganiza até 3 unidades." },
  { name: "Avanço Coordenado", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Após mover: +2 ATK." },
  { name: "Reposicionamento Rápido", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Move inimigo 1 slot." },
  { name: "Linha Fechada", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Adjacentes recebem menos dano." },
  { name: "Ordem de Retirada", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Move para a Retaguarda + cura." },
  { name: "Bloqueio Instantâneo", cardType: "Emboscada", atk: 0, hp: 0, cost: 2, effect: "Cancela ataque se houver adjacente." },
  { name: "Contra-Manobra", cardType: "Emboscada", atk: 0, hp: 0, cost: 3, isFullArt: true, effect: "Troca posições durante o ataque." },
  { name: "Formação Quebrada", cardType: "Emboscada", atk: 0, hp: 0, cost: 2, effect: "Move inimigo aleatoriamente." },
  { name: "Estandarte da Legião", cardType: "Relíquia", atk: 0, hp: 5, cost: 3, isFullArt: true, effect: "Permanente. Todas as unidades aliadas ganham +1 ATK enquanto esta relíquia estiver no campo." },
  { name: "Fortaleza de Pedra", cardType: "Terreno", atk: 0, hp: 8, cost: 3, isFullArt: true, effect: "Permanente. Unidades aliadas na Retaguarda recebem -1 de dano de ataques inimigos." },
  { name: "Pântano Maldito", cardType: "Terreno", atk: 0, hp: 6, cost: 2, effect: "Permanente. Unidades inimigas na Vanguarda sofrem -1 ATK enquanto este terreno estiver no campo." },
  // ── cardeal ──
  { name: "Cardeal Pedro, Voz da Fé", cardType: "General", atk: 0, hp: 20, cost: 0, isFullArt: true, effect: "Fase Principal: pague 2 ouro para curar 1 HP em um soldado aliado, mesmo com HP cheio." },
  { name: "Cálice da Graça", cardType: "Relíquia", atk: 0, hp: 5, cost: 3, isFullArt: true, effect: "Permanente. A cura do General Cardeal Pedro aumenta de 1 para 2 HP." },
  { name: "Devotos da Cruzada", cardType: "Infantaria", atk: 0, hp: 3, cost: 1, effect: "—" },
  { name: "Mercador da Cruzada", trigger: "comando", cardType: "Infantaria", atk: 1, hp: 1, cost: 1, effect: "Uma vez por turno: veja as 2 cartas do topo do deck. Adicione 1 à mão e coloque a outra no fundo." },
  { name: "Infiltrado da Ordem", trigger: "postura", cardType: "Infantaria", atk: 1, hp: 2, cost: 1, effect: "Na Vanguarda: impede Emboscadas inimigas. Se o General aliado receber dano, no próximo turno não poderá usar sua habilidade." },
  { name: "Fanático da Cruzada", cardType: "Infantaria", atk: 1, hp: 2, cost: 1, trigger: "ofensiva", effect: "Se o General inimigo for de tipo oposto, ganha +2 ATK." },
  { name: "Recruta Devoto", cardType: "Infantaria", atk: 0, hp: 2, cost: 1, effect: "Ao ser curado: recebe +1 ATK permanente." },
  { name: "Intendente do Exército", trigger: "comando", cardType: "Infantaria", atk: 2, hp: 3, cost: 2, effect: "Uma vez por turno: se você tiver menos de 2 cartas na mão, compre até ficar com 2." },
  { name: "Soldados da Ordem", cardType: "Infantaria", atk: 3, hp: 4, cost: 2, effect: "—" },
  { name: "Jorge, Lança Sagrada", cardType: "Cavalaria", atk: 4, hp: 6, cost: 3, isFullArt: true, trigger: "ofensiva", effect: "Contra a Vanguarda, causa 2 de dano à unidade na Retaguarda da mesma coluna." },
  { name: "Cavaleiro Hospitalário", trigger: "comando", cardType: "Cavalaria", atk: 2, hp: 3, cost: 2, effect: "Uma vez por turno: cure 1 HP de um aliado e cause 1 de dano a um inimigo na Vanguarda." },
  { name: "Nobre da Cruzada", cardType: "Cavalaria", atk: 4, hp: 5, cost: 3, isFullArt: true, trigger: "convocacao", effect: "Convoca Soldados Leais (1 ATK / 1 HP) nos slots adjacentes livres da mesma fileira." },
  { name: "Cavaleiro da Luz", cardType: "Cavalaria", atk: 4, hp: 5, cost: 3, isFullArt: true, effect: "—" },
  { name: "Comandante da Ordem", trigger: "postura", cardType: "Cavalaria", atk: 5, hp: 5, cost: 3, isFullArt: true, effect: "Na Vanguarda: Infantaria e Arqueiros aliados ganham +1 ATK e +1 HP durante o combate." },
  { name: "Arqueiro da Ordem", cardType: "Arqueiro", atk: 1, hp: 4, cost: 2, effect: "Pode atacar duas vezes por rodada." },
  { name: "Atirador da Cruzada", cardType: "Arqueiro", atk: 1, hp: 3, cost: 2, trigger: "queda", effect: "Compre 2 cartas." },
  { name: "Trabuco de Cerco", cardType: "Tática", atk: 0, hp: 0, cost: 3, isFullArt: true, effect: "Causa 2 de dano a TODAS as unidades inimigas." },
  { name: "Catapulta de Guerra", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Escolha uma fileira inimiga. Todas as unidades naquela fileira recebem 2 de dano." },
  { name: "Balestra de Precisão", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Causa 3 de dano a uma unidade inimiga à sua escolha." },
  { name: "Armadura de Guerra", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Infantaria equipada recebe +2 HP." },
  { name: "Couraça Reforçada", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Arqueiro, Plebeu ou Infantaria equipada recebe +1 HP." },
  { name: "Flechas Venenosas", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Arqueiro equipado recebe +1 ATK." },
  { name: "Espada Longa", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Cavalaria, Infantaria ou Plebeu equipado recebe +2 ATK." },
  { name: "Reforços Ocultos", cardType: "Emboscada", atk: 0, hp: 0, cost: 1, effect: "Durante um ataque inimigo: um soldado aliado recebe +2 ATK e +1 HP até o fim do turno." },
  { name: "Retorno do Soldado", cardType: "Tática", atk: 0, hp: 0, cost: 1, isFullArt: true, effect: "Adicione um soldado do cemitério à sua mão." },
  { name: "Graal da Dádiva", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Adicione uma carta de Terreno ou Relíquia do deck à sua mão." },
  { name: "Doutrina Renovada", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Adicione uma carta de Tática do deck à sua mão." },
  { name: "Recrutamento Seletivo", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Adicione um soldado do deck à sua mão." },
  { name: "Recrutar Veteranos", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Veja as 4 cartas do topo. Adicione 2 à mão e coloque 2 no fundo do deck." },
  { name: "Tributo de Guerra", cardType: "Tática", atk: 0, hp: 0, cost: 0, effect: "Ganhe 1 ouro adicional neste turno." },
  { name: "Chamado às Armas", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Convoque do deck até 2 soldados com 0 ATK para slots livres na Vanguarda. Embaralhe o deck." },
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
      "Reformar Linhas": 4,
      "Avanço Coordenado": 4,
      "Reposicionamento Rápido": 4,
      "Linha Fechada": 4,
      "Ordem de Retirada": 4,
      "Bloqueio Instantâneo": 4,
      "Contra-Manobra": 4,
      "Formação Quebrada": 4,
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
