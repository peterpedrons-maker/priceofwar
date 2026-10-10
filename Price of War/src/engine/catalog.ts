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
  { name: "Comandante Aurelion, Mestre da Formação", cardType: "General", atk: 0, hp: 30, cost: 0, isFullArt: true, effect: "**Fim do turno** Até 2 unidades que se moveram ganham +2/+1 no próximo combate. **Passiva** Relíquia e Terreno recebem -1 de dano.",
    faction: "ordem",
    abilities: [{ on: 'turn_end', do: [{ kind: 'buff_moved', count: 2, atk: 2, hp: 1 }] }],
    passives: [{ kind: 'aura', who: { side: 'own', slots: [10, 11] }, reduce: 1 }] },
  { name: "Soldado Tático", cardType: "Infantaria", atk: 3, hp: 3, cost: 2, effect: "No fim do turno, troca de lugar com um aliado ao lado.",
    abilities: [{ on: 'turn_end', do: [{ kind: 'swap_adjacent' }] }] },
  { name: "Escudeiro de Linha", trigger: "postura", cardType: "Infantaria", atk: 2, hp: 4, cost: 2, effect: "Recebe -1 de dano. Na Vanguarda, a carta atrás também recebe -1 de dano.",
    passives: [
      { kind: 'aura', who: { side: 'own', behind: true }, from: 'front', reduce: 1 },
      { kind: 'aura', who: { side: 'self' }, reduce: 1 },
    ] },
  { name: "Capitão de Formação", cardType: "Infantaria", atk: 3, hp: 4, cost: 3, isFullArt: true, trigger: "manobra", effect: "Aliados ao lado ganham +2 ATK até o próximo turno.",
    abilities: [{ on: 'move', do: [{ kind: 'buff_adjacent', atk: 2 }] }] },
  { name: "Batedor", cardType: "Infantaria", atk: 1, hp: 2, cost: 1, effect: "Depois de atacar, move-se 1 casa de graça e ganha +1 ATK para sempre.",
    abilities: [{ on: 'after_attack', do: [{ kind: 'free_move' }, { kind: 'buff', atk: 1 }] }] },
  { name: "Lanceiro de Controle", trigger: "postura", cardType: "Infantaria", atk: 3, hp: 2, cost: 2, effect: "O inimigo à frente tem -2 ATK.",
    passives: [{ kind: 'aura', who: { side: 'enemy', facing: true }, atk: -2 }] },
  { name: "Cavaleiro Tático", cardType: "Cavalaria", atk: 4, hp: 4, cost: 3, isFullArt: true, effect: "Troca de lugar com qualquer aliado da fileira. Ao se mover, aliados ao lado ganham +1 ATK até o próximo turno.",
    abilities: [{ on: 'move', do: [{ kind: 'buff_adjacent', atk: 1 }] }],
    passives: [{ kind: 'flag', flag: 'row_swap' }] },
  { name: "Veterano de Guerra", trigger: "postura", cardType: "Infantaria", atk: 4, hp: 3, cost: 3, isFullArt: true, effect: "+2 ATK na coluna central e +1 ATK na Vanguarda.",
    passives: [
      { kind: 'aura', who: { side: 'self' }, when: { col: 2 }, atk: 2 },
      { kind: 'aura', who: { side: 'self' }, from: 'front', atk: 1 },
    ] },
  { name: "Reformar Linhas", fx: 'reformar', cardType: "Tática", atk: 0, hp: 0, cost: 2, isFullArt: true, effect: "3 movimentos extras neste turno. Compre 1 carta.",
    abilities: [{ on: 'play', do: [{ kind: 'extra_moves', amount: 3 }, { kind: 'draw', amount: 1 }] }] },
  { name: "Avanço Coordenado", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "+3 ATK a uma unidade que se moveu neste turno.",
    abilities: [{ on: 'play', do: [
      { kind: 'buff', atk: 3, target: { ...OWN_UNIT, needs: 'moved', prompt: 'Escolha uma unidade sua que já se moveu neste turno.' } },
    ] }] },
  { name: "Reposicionamento Rápido", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Mova um inimigo para um espaço livre ao lado.",
    abilities: [{ on: 'play', do: [
      { kind: 'displace', target: { ...ENEMY_UNIT, prompt: 'Escolha uma unidade inimiga para deslocar.' } },
    ] }] },
  { name: "Linha Fechada", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "-2 de dano, para sempre, nos aliados ao lado da unidade escolhida.",
    abilities: [{ on: 'play', do: [
      { kind: 'guard_adjacent', amount: 2, target: { ...OWN_UNIT, prompt: 'Escolha uma unidade sua — os aliados ao lado dela recebem menos dano.' } },
    ] }] },
  { name: "Ordem de Retirada", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Mova uma unidade da Vanguarda para a Retaguarda: +2 HP.",
    abilities: [{ on: 'play', do: [
      { kind: 'retreat', heal: 2, target: { ...OWN_UNIT, where: 'front', prompt: 'Escolha uma unidade sua na Vanguarda.' } },
    ] }] },
  { name: "Bloqueio Instantâneo", cardType: "Emboscada", atk: 0, hp: 0, cost: 1, effect: "Cancela um ataque a uma unidade com aliado ao lado.",
    abilities: [{ on: 'ambush', do: [{ kind: 'cancel_attack', ifAdjacentAlly: true }] }] },
  { name: "Contra-Manobra", fx: 'contra', cardType: "Emboscada", atk: 0, hp: 0, cost: 3, isFullArt: true, effect: "Troca a unidade atacada com um aliado ao lado, que recebe o golpe.",
    abilities: [{ on: 'ambush', do: [{ kind: 'swap_defender' }] }] },
  { name: "Formação Quebrada", fx: 'formacao', cardType: "Emboscada", atk: 0, hp: 0, cost: 2, effect: "Move o atacante para um espaço livre aleatório. O ataque falha.",
    abilities: [{ on: 'ambush', do: [{ kind: 'displace_attacker' }] }] },
  { name: "Estandarte da Legião", fx: 'estandarte', cardType: "Relíquia", atk: 0, hp: 5, cost: 3, isFullArt: true, effect: "+1/+1 em combate às suas cartas em campo.",
    passives: [{ kind: 'aura', who: { side: 'own' }, atk: 1, combatHp: 1 }] },
  { name: "Fortaleza de Pedra", fx: 'muralha', cardType: "Terreno", atk: 0, hp: 8, cost: 3, isFullArt: true, effect: "Suas unidades na Retaguarda: -1 de dano de ataques.",
    passives: [{ kind: 'aura', who: { side: 'own', row: 'back' }, reduce: 1 }] },
  { name: "Pântano Maldito", fx: 'pantano', cardType: "Terreno", atk: 0, hp: 6, cost: 2, effect: "Inimigos na Vanguarda: -1 ATK.",
    passives: [{ kind: 'aura', who: { side: 'enemy', row: 'front' }, atk: -1 }] },
  // ── cardeal ──
  { name: "Cardeal Anselmo, Voz da Fé", trigger: "comando", cardType: "General", atk: 0, hp: 30, cost: 0, isFullArt: true, effect: "Uma vez por turno: +1 HP a uma unidade aliada.",
    faction: "fe",
    abilities: [{ on: 'ability', phases: ['preparacao', 'movimentacao'], once: true, do: [
      { kind: 'heal', amount: 1, target: { ...OWN_UNIT, prompt: 'Escolha um soldado aliado no campo.' } },
    ] }] },
  { name: "Cálice das Duas Bênçãos", fx: 'calice', cardType: "Relíquia", atk: 0, hp: 6, cost: 3, isFullArt: true, effect: "Seu General pode curar 2 vezes por turno.",
    passives: [{ kind: 'aura', who: { side: 'own', slots: [12] }, abilityUses: 1 }] },
  { name: "Penitente de Pedra", cardType: "Infantaria", atk: 0, hp: 4, cost: 1, effect: "" },
  { name: "Cambista do Dízimo", trigger: "comando", cardType: "Infantaria", atk: 1, hp: 2, cost: 1, effect: "Pague 1 de ouro: veja 2 cartas do topo do baralho, fique com 1 e mande a outra para o cemitério.",
    abilities: [{ on: 'ability', once: true, cost: 1, do: [{ kind: 'look_top', count: 2, keepMin: 1, keepMax: 1, rest: 'graveyard' }] }] },
  { name: "Confessor Silencioso", trigger: "postura", cardType: "Infantaria", atk: 1, hp: 3, cost: 1, effect: "Na Vanguarda, Emboscadas inimigas não ativam. Se seu General sofrer dano, ele fica sem habilidade no próximo turno.",
    passives: [
      { kind: 'flag', flag: 'blocks_ambush', from: 'front' },
      { kind: 'flag', flag: 'locks_general' },
    ] },
  { name: "Zeloso da Pira", cardType: "Infantaria", atk: 1, hp: 3, cost: 1, trigger: "ofensiva", effect: "+2 ATK contra General de facção oposta.",
    abilities: [{ on: 'attack', do: [{ kind: 'attack_bonus', amount: 2, ifEnemyGeneral: 'other_faction' }] }] },
  { name: "Noviço Renascido", cardType: "Infantaria", atk: 0, hp: 3, cost: 1, effect: "Quando é curado: +1 ATK para sempre.",
    abilities: [{ on: 'healed', do: [{ kind: 'buff', atk: 1 }] }] },
  { name: "Despenseiro do Mosteiro", trigger: "comando", cardType: "Infantaria", atk: 2, hp: 4, cost: 3, effect: "No início do turno, compre até ter 2 cartas na mão.",
    abilities: [{ on: 'turn_start', do: [{ kind: 'refill_hand', to: 2 }] }] },
  { name: "Sentinela do Claustro", fx: 'soldados', cardType: "Infantaria", atk: 2, hp: 5, cost: 3, trigger: "reforco", effect: "Se a da frente cair, desce e ganha Escudo 2.",
    abilities: [{ on: 'front_fell', do: [{ kind: 'reinforce', shield: 2 }] }] },
  { name: "Jorge, Lança Sagrada", cardType: "Cavalaria", atk: 3, hp: 6, cost: 4, isFullArt: true, trigger: "ofensiva", effect: "Ao atacar a Vanguarda, 2 de dano à carta atrás.",
    abilities: [{ on: 'attack', do: [{ kind: 'splash_behind', amount: 2 }] }] },
  { name: "Samaritano de Aço", fx: 'hospitalario', trigger: "comando", cardType: "Cavalaria", atk: 2, hp: 5, cost: 3, effect: "+2 HP a um aliado ferido e 1 de dano a um inimigo da Vanguarda.",
    abilities: [{ on: 'ability', phases: ['preparacao', 'movimentacao'], once: true, do: [
      { kind: 'heal', amount: 2, target: { ...OWN_UNIT, needs: 'damaged', optional: true, prompt: 'Toque em um aliado ferido.' } },
      { kind: 'damage', amount: 1, target: { ...ENEMY_UNIT, where: 'front', optional: true, prompt: 'Toque em um inimigo da Vanguarda.' } },
    ] }] },
  { name: "Barão da Procissão", fx: 'nobre', cardType: "Cavalaria", atk: 3, hp: 5, cost: 4, isFullArt: true, trigger: "convocacao", effect: "Acólitos Leais (1/2) nos espaços livres ao lado.",
    abilities: [{ on: 'place', do: [{ kind: 'summon_token', token: 'Acólito Leal' }] }] },
  { name: "Paladino do Alvorecer", cardType: "Cavalaria", atk: 3, hp: 5, cost: 4, isFullArt: true, effect: "Quando uma unidade ao lado é curada: +1 ATK até o seu próximo turno.",
    abilities: [{ on: 'ally_healed', do: [{ kind: 'buff_self_temp', atk: 1 }] }] },
  { name: "Marechal do Sol Poente", fx: 'comandante', trigger: "postura", cardType: "Cavalaria", atk: 4, hp: 5, cost: 4, isFullArt: true, effect: "Na Vanguarda, seus Infantaria e Arqueiros têm +1/+1 em combate.",
    passives: [{
      kind: 'aura', who: { side: 'own', types: ['Infantaria', 'Arqueiro'] }, from: 'front', atk: 1, combatHp: 1,
    }] },
  { name: "Arqueiro de Dois Sinos", cardType: "Arqueiro", atk: 1, hp: 4, cost: 3, effect: "Ataca 2 vezes por rodada.",
    passives: [{ kind: 'aura', who: { side: 'self' }, attacks: 1 }] },
  { name: "Vigia do Último Salmo", fx: 'atirador', cardType: "Arqueiro", atk: 1, hp: 4, cost: 3, trigger: "queda", effect: "Compre 2 cartas.",
    abilities: [{ on: 'destroyed', do: [{ kind: 'draw', amount: 2 }] }] },
  { name: "Trabuco da Trombeta Final", cardType: "Tática", atk: 0, hp: 0, cost: 3, isFullArt: true, effect: "2 de dano a todas as unidades inimigas e ao General.",
    abilities: [{ on: 'play', do: [{ kind: 'damage', amount: 2, all: 'enemy' }] }] },
  { name: "Catapulta do Dilúvio de Pedra", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "2 de dano a todas as unidades de uma fileira inimiga.",
    abilities: [{ on: 'play', do: [
      { kind: 'damage', amount: 2, target: { ...ENEMY_UNIT, area: 'row', prompt: 'Escolha uma fileira inimiga (clique em qualquer slot dela).' } },
    ] }] },
  { name: "Balestra da Penitência", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "3 de dano a uma unidade inimiga.",
    abilities: [{ on: 'play', do: [
      { kind: 'damage', amount: 3, target: { ...ENEMY_UNIT, prompt: 'Escolha uma unidade inimiga para causar 3 de dano.' } },
    ] }] },
  { name: "Couraça do Mártir", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Equipe uma Infantaria: +2 HP e Guarda (absorve o primeiro golpe inteiro).",
    abilities: [{ on: 'play', do: [
      { kind: 'equip', hp: 2, block: true, target: { ...OWN_UNIT, types: ['Infantaria'], prompt: 'Escolha uma Infantaria sua para equipar (+2 HP e Guarda).' } },
    ] }] },
  { name: "Gibão Bento", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Equipe uma Infantaria ou Arqueiro: +2 HP.",
    abilities: [{ on: 'play', do: [
      { kind: 'equip', hp: 2, target: { ...OWN_UNIT, types: ['Arqueiro', 'Infantaria'], prompt: 'Escolha um Arqueiro ou Infantaria sua para equipar (+2 HP).' } },
    ] }] },
  { name: "Setas de Cicuta", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Equipe um Arqueiro: +1 ATK.",
    abilities: [{ on: 'play', do: [
      { kind: 'equip', atk: 1, target: { ...OWN_UNIT, types: ['Arqueiro'], prompt: 'Escolha um Arqueiro seu para equipar (+1 ATK).' } },
    ] }] },
  { name: "Lâmina do Juramento", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Equipe uma Infantaria ou Cavalaria: +2 ATK.",
    abilities: [{ on: 'play', do: [
      { kind: 'equip', atk: 2, target: { ...OWN_UNIT, types: ['Cavalaria', 'Infantaria'], prompt: 'Escolha uma Cavalaria ou Infantaria sua para equipar (+2 ATK).' } },
    ] }] },
  { name: "Preces na Sombra", cardType: "Emboscada", atk: 0, hp: 0, cost: 1, effect: "A unidade atacada ganha +1 ATK e +3 HP até o fim do turno.",
    abilities: [{ on: 'ambush', do: [{ kind: 'buff_defender', atk: 1, hp: 3 }] }] },
  { name: "Chamado do Túmulo Santo", cardType: "Tática", atk: 0, hp: 0, cost: 1, isFullArt: true, effect: "Leve 1 soldado do cemitério para a mão.",
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'graveyard', filter: { types: SOLDIERS } }] }] },
  { name: "Peregrinação ao Graal", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Leve 1 Terreno ou Relíquia do baralho para a mão.",
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'deck', filter: { types: ['Terreno', 'Relíquia'] } }] }] },
  { name: "Sermão da Estratégia", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Leve 1 Tática do baralho para a mão.",
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'deck', filter: { types: ['Tática'] } }] }] },
  { name: "Alistamento do Púlpito", cardType: "Tática", atk: 0, hp: 0, cost: 1, effect: "Leve 1 soldado do baralho para a mão.",
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'deck', filter: { types: SOLDIERS } }] }] },
  { name: "Convocação dos Veteranos de Fé", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Veja 4 cartas do topo: fique com 1 ou 2, o resto vai para o fundo.",
    abilities: [{ on: 'play', do: [{ kind: 'look_top', count: 4, keepMin: 1, keepMax: 2 }] }] },
  { name: "Dízimo de Guerra", cardType: "Tática", atk: 0, hp: 0, cost: 0, effect: "+1 de ouro neste turno.",
    abilities: [{ on: 'play', do: [{ kind: 'gold', amount: 1 }] }] },
  { name: "Toque dos Sinos de Guerra", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Convoque até 2 soldados de 0 ATK do baralho para a Vanguarda. Embaralhe.",
    abilities: [{ on: 'play', do: [{ kind: 'summon_deck', max: 2, filter: { types: SOLDIERS, atk: 0 } }] }] },
  // ── mercenarios ── (deck novo: nenhuma carta é do Cardeal nem do Capitão; custos pela tabela de docs/balanceamento.md; proposta em docs/deck-mercenarios.md)
  { name: 'Brann Meia-Coroa, Comprador de Guerras', trigger: 'comando', cardType: 'General', atk: 0, hp: 30, cost: 0, isFullArt: true, faction: 'soldo',
    effect: 'Pague 3 de ouro: compre 1 carta.',
    abilities: [{ on: 'ability', phases: ['preparacao'], once: true, cost: 3, do: [{ kind: 'draw', amount: 1 }] }] },

  // ── mercenários (com manutenção) ──
  { name: 'Lanceiro Pés-de-Lama', cardType: 'Infantaria', atk: 2, hp: 2, cost: 1, upkeep: 1, effect: '**Manutenção 1.**' },
  { name: 'Besteiro Dedo-Ligeiro', cardType: 'Arqueiro', atk: 2, hp: 2, cost: 2, upkeep: 1, effect: '**Manutenção 1.**' },
  { name: 'Capa-Rota', cardType: 'Infantaria', atk: 4, hp: 4, cost: 1, upkeep: 3, effect: '**Manutenção 3.** Rescisão: você perde 3 de ouro.',
    abilities: [{ on: 'dismissed', do: [{ kind: 'lose_gold', amount: 3 }] }] },
  { name: 'Rato da Muralha', cardType: 'Infantaria', atk: 2, hp: 2, cost: 1, upkeep: 1, effect: '**Manutenção 1.** Rescisão: compre 1 carta.',
    abilities: [{ on: 'dismissed', do: [{ kind: 'draw', amount: 1 }] }] },
  { name: 'Capitão Barba-de-Corvo', isFullArt: true, trigger: 'postura', cardType: 'Infantaria', atk: 4, hp: 5, cost: 3, upkeep: 2, effect: '**Manutenção 2.** Na Vanguarda, seus Infantaria e Arqueiros têm +1 ATK. Rescisão: 2 de dano ao seu General.',
    abilities: [{ on: 'dismissed', do: [{ kind: 'hurt_own_general', amount: 2 }] }],
    passives: [{ kind: 'aura', who: { side: 'own', types: ['Infantaria', 'Arqueiro'] }, from: 'front', atk: 1 }] },
  { name: 'Cavaleiro do Escudo Raspado', isFullArt: true, cardType: 'Cavalaria', atk: 5, hp: 5, cost: 2, upkeep: 2, effect: '**Manutenção 2.** Rescisão: 2 de dano ao seu General.',
    abilities: [{ on: 'dismissed', do: [{ kind: 'hurt_own_general', amount: 2 }] }] },
  { name: 'Florete de Aposta', cardType: 'Infantaria', atk: 5, hp: 3, cost: 2, upkeep: 3, effect: '**Manutenção 3.** Rescisão: você perde 3 de ouro.',
    abilities: [{ on: 'dismissed', do: [{ kind: 'lose_gold', amount: 3 }] }] },
  { name: 'Boca-de-Fogo', cardType: 'Artilharia', atk: 4, hp: 3, cost: 2, upkeep: 2, effect: '**Manutenção 2.** Ataca à distância. Rescisão: você perde 2 de ouro.',
    abilities: [{ on: 'dismissed', do: [{ kind: 'lose_gold', amount: 2 }] }] },

  // ── sem manutenção ──
  { name: 'Vigia da Última Brasa', cardType: 'Infantaria', atk: 2, hp: 4, cost: 2, effect: '' },
  { name: 'Quillon Contamoedas', fx: 'moeda', trigger: 'comando', cardType: 'Infantaria', atk: 1, hp: 3, cost: 2, effect: 'No início do turno, ganhe 1 de ouro.',
    abilities: [{ on: 'turn_start', do: [{ kind: 'gold', amount: 1 }] }] },

  // ── táticas, equipamentos e emboscada próprios do deck (nenhuma carta é emprestada do Cardeal nem do Capitão) ──
  { name: 'Escriba do Códice', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Leve 1 Relíquia do baralho para a mão.',
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'deck', filter: { types: ['Relíquia'] } }] }] },
  { name: 'Tambor do Soldo Fácil', cardType: 'Tática', atk: 0, hp: 0, cost: 2, effect: 'Leve 1 soldado do baralho para a mão.',
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'deck', filter: { types: SOLDIERS } }] }] },
  { name: 'Ninguém Fica na Lama', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Leve 1 soldado do cemitério para a mão.',
    abilities: [{ on: 'play', do: [{ kind: 'search', zone: 'graveyard', filter: { types: SOLDIERS } }] }] },
  { name: 'Os Dois do Beco', cardType: 'Tática', atk: 0, hp: 0, cost: 3, effect: 'Compre 2 cartas.',
    abilities: [{ on: 'play', do: [{ kind: 'draw', amount: 2 }] }] },
  { name: 'Chuva de Ferro Barato', fx: 'chuva', cardType: 'Tática', atk: 0, hp: 0, cost: 2, effect: '2 de dano a todas as unidades de uma fileira inimiga.',
    abilities: [{ on: 'play', do: [
      { kind: 'damage', amount: 2, target: { side: 'enemy', area: 'row', prompt: 'Escolha uma fileira inimiga (clique em qualquer slot dela).' } },
    ] }] },
  { name: 'Pacto do Punhal Vermelho', fx: 'punhal', cardType: 'Tática', atk: 0, hp: 0, cost: 2, effect: '3 de dano a uma unidade inimiga.',
    abilities: [{ on: 'play', do: [
      { kind: 'damage', amount: 3, target: { side: 'enemy', area: 'unit', prompt: 'Escolha a unidade inimiga que o contrato elimina (3 de dano).' } },
    ] }] },
  { name: 'O Dia em que a Muralha Caiu', fx: 'muralha', isFullArt: true, cardType: 'Tática', atk: 0, hp: 0, cost: 3, effect: '2 de dano a todas as unidades inimigas e ao General.',
    abilities: [{ on: 'play', do: [{ kind: 'damage', amount: 2, all: 'enemy' }] }] },
  { name: 'Peitoral de Muitos Donos', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Equipe uma Infantaria: +2 HP.',
    abilities: [{ on: 'play', do: [
      { kind: 'equip', hp: 2, target: { side: 'own', area: 'unit', types: ['Infantaria'], prompt: 'Escolha uma Infantaria sua para equipar (+2 HP).' } },
    ] }] },
  { name: 'Espada de Mil Mãos', cardType: 'Tática', atk: 0, hp: 0, cost: 1, effect: 'Equipe uma Infantaria ou Cavalaria: +2 ATK.',
    abilities: [{ on: 'play', do: [
      { kind: 'equip', atk: 2, target: { side: 'own', area: 'unit', types: ['Cavalaria', 'Infantaria'], prompt: 'Escolha uma Cavalaria ou Infantaria sua para equipar (+2 ATK).' } },
    ] }] },
  { name: 'O Peso da Bolsa', fx: 'bolsa', cardType: 'Emboscada', atk: 0, hp: 0, cost: 2, effect: 'Cancela um ataque a uma de suas unidades.',
    abilities: [{ on: 'ambush', do: [{ kind: 'cancel_attack' }] }] },

  // ── a Relíquia do deck: três modos, o dono escolhe um no fim do turno (vale até o fim do turno seguinte) ──
  { name: 'Códice das Mil Dívidas', fx: 'codice', cardType: 'Relíquia', atk: 0, hp: 5, cost: 3, isFullArt: true,
    effect: 'Escolha 1 modo no fim do seu turno. Soldo em Dobro: cartas com manutenção têm +2 ATK. Saque: ao destruir uma unidade inimiga, compre 1 carta (máx. 1 por ciclo). Quitação: a manutenção de cada carta custa 1 a menos (mínimo 1).',
    modes: [
      { id: 'soldo', name: 'Soldo em Dobro', effect: 'Cartas com manutenção têm +2 ATK.', atk: 2 },
      { id: 'saque', name: 'Saque', effect: 'Ao destruir uma unidade inimiga, compre 1 carta (máx. 1 por ciclo).', loot: { draw: 1, cap: 1 } },
      { id: 'quitacao', name: 'Quitação', effect: 'A manutenção de cada carta custa 1 a menos (nunca menos de 1).', upkeepEach: 1 },
    ] },
];

export type DeckId = 'capitao' | 'cardeal' | 'mercenarios';

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
      "Veterano de Guerra": 4,
      "Reformar Linhas": 3,
      "Avanço Coordenado": 4,
      "Reposicionamento Rápido": 1,
      "Linha Fechada": 4,
      "Ordem de Retirada": 4,
      "Catapulta do Dilúvio de Pedra": 2,
      "Balestra da Penitência": 2,
      "Trabuco da Trombeta Final": 1,
      "Bloqueio Instantâneo": 4,
      "Contra-Manobra": 2,
      "Formação Quebrada": 2,
      "Estandarte da Legião": 1,
      "Fortaleza de Pedra": 1,
      "Pântano Maldito": 1,
    },
  },
  cardeal: {
    id: 'cardeal', name: "Deck Cardeal Anselmo", description: "Fé e ferro — cura, convocações e emboscadas sagradas.", general: "Cardeal Anselmo, Voz da Fé",
    cards: {
      "Cálice das Duas Bênçãos": 1,
      "Penitente de Pedra": 4,
      "Cambista do Dízimo": 1,
      "Confessor Silencioso": 1,
      "Zeloso da Pira": 1,
      "Noviço Renascido": 4,
      "Despenseiro do Mosteiro": 3,
      "Sentinela do Claustro": 4,
      "Jorge, Lança Sagrada": 2,
      "Samaritano de Aço": 3,
      "Barão da Procissão": 2,
      "Paladino do Alvorecer": 3,
      "Marechal do Sol Poente": 1,
      "Arqueiro de Dois Sinos": 3,
      "Vigia do Último Salmo": 3,
      "Trabuco da Trombeta Final": 1,
      "Catapulta do Dilúvio de Pedra": 1,
      "Balestra da Penitência": 1,
      "Couraça do Mártir": 2,
      "Gibão Bento": 2,
      "Setas de Cicuta": 1,
      "Lâmina do Juramento": 2,
      "Preces na Sombra": 2,
      "Chamado do Túmulo Santo": 1,
      "Peregrinação ao Graal": 1,
      "Sermão da Estratégia": 3,
      "Alistamento do Púlpito": 2,
      "Convocação dos Veteranos de Fé": 1,
      "Dízimo de Guerra": 2,
      "Toque dos Sinos de Guerra": 2,
    },
  },
  mercenarios: {
    id: 'mercenarios', name: "Deck Mercenários", description: "Tropas de aluguel, manutenção e uma Relíquia de contratos.", general: "Brann Meia-Coroa, Comprador de Guerras",
    cards: {
      // 31 mercenários (com manutenção) e 7 sem manutenção
      "Lanceiro Pés-de-Lama": 4, "Besteiro Dedo-Ligeiro": 4, "Capa-Rota": 4, "Rato da Muralha": 4, "Capitão Barba-de-Corvo": 3,
      "Cavaleiro do Escudo Raspado": 3, "Florete de Aposta": 4, "Boca-de-Fogo": 4,
      "Vigia da Última Brasa": 4, "Quillon Contamoedas": 4,
      // a Relíquia e quem a busca
      "Códice das Mil Dívidas": 3, "Escriba do Códice": 3,
      // táticas, equipamentos e emboscada próprios
      "Chuva de Ferro Barato": 2, "Pacto do Punhal Vermelho": 2, "O Dia em que a Muralha Caiu": 1,
      "Peitoral de Muitos Donos": 3, "Espada de Mil Mãos": 2,
      "Tambor do Soldo Fácil": 1, "Ninguém Fica na Lama": 2, "Os Dois do Beco": 1, "O Peso da Bolsa": 2,
    },
  },
};

// ── Balance ─────────────────────────────────────────────────────────────────
// Numbers tuned after play-testing can live here, apart from the card definitions, so the base stats stay readable and the rules tests
// (which set `globalThis.__POW_RAW_STATS__` before loading this file) keep running on the untouched ones. Empty for now: a +2 ATK / +1 HP
// buff on the Capitão units was tried and taken back (too much); see docs/balanceamento.md.
export const BALANCE: Record<string, { atk?: number; hp?: number; cost?: number }> = {};
if (!(globalThis as { __POW_RAW_STATS__?: boolean }).__POW_RAW_STATS__) {
  CARD_DEFS.forEach(c => {
    const d = BALANCE[c.name];
    if (!d) return;
    const def = c as { atk: number; hp: number; cost: number };
    def.atk += d.atk ?? 0; def.hp += d.hp ?? 0; def.cost += d.cost ?? 0;
  });
}

// The prebuilt lists as a player can use them: a deck holds at most 60 cards (see deck.ts). Both recipes have exactly 60 now, so nothing is trimmed;
// the hook stays for a recipe that grows past the limit (the AI would still play the full recipe).
const STARTER_TRIM: Partial<Record<DeckId, Record<string, number>>> = {};
export const starterDeckCards = (id: DeckId): Record<string, number> => {
  const cards = { ...DECK_RECIPES[id].cards };
  Object.entries(STARTER_TRIM[id] ?? {}).forEach(([name, n]) => { cards[name] = Math.max(0, (cards[name] ?? 0) - n); if (cards[name] === 0) delete cards[name]; });
  return cards;
};

// The starter lists as they were before each balance pass (docs/balanceamento.md): a saved deck that is still exactly one of these was never edited
// by the player, so it is replaced by the new list.
export const LEGACY_STARTERS: Record<DeckId, Record<string, number>[]> = {
  // O Mercenários nasceu depois dos ajustes: só tem a lista atual (a mesma da receita).
  mercenarios: [DECK_RECIPES.mercenarios.cards],
  // The first list of each deck is also the faction's own set of cards (what its boosters can hold).
  capitao: [
    {"Soldado Tático":4,"Escudeiro de Linha":4,"Capitão de Formação":4,"Batedor":4,"Lanceiro de Controle":4,"Cavaleiro Tático":4,"Veterano de Guerra":3,"Reformar Linhas":3,"Avanço Coordenado":4,"Reposicionamento Rápido":3,"Linha Fechada":4,"Ordem de Retirada":4,"Bloqueio Instantâneo":4,"Contra-Manobra":4,"Formação Quebrada":4,"Estandarte da Legião":1,"Fortaleza de Pedra":1,"Pântano Maldito":1},
    // the version of the first balance pass (borrowed tactics, Veterano x4), before the effect changes
    {"Soldado Tático":4,"Escudeiro de Linha":4,"Capitão de Formação":4,"Batedor":4,"Lanceiro de Controle":4,"Cavaleiro Tático":4,"Veterano de Guerra":4,"Reformar Linhas":1,"Avanço Coordenado":4,"Reposicionamento Rápido":2,"Ordem de Retirada":2,"Bloqueio Instantâneo":2,"Contra-Manobra":1,"Formação Quebrada":2,"Estandarte da Legião":1,"Pântano Maldito":1,"Catapulta do Dilúvio de Pedra":4,"Balestra da Penitência":4,"Couraça do Mártir":4,"Trabuco da Trombeta Final":2,"Alistamento do Púlpito":2},
  ],
  cardeal: [
    {"Cálice das Duas Bênçãos":1,"Penitente de Pedra":4,"Cambista do Dízimo":2,"Confessor Silencioso":1,"Zeloso da Pira":1,"Noviço Renascido":2,"Despenseiro do Mosteiro":2,"Sentinela do Claustro":2,"Jorge, Lança Sagrada":3,"Samaritano de Aço":2,"Barão da Procissão":2,"Paladino do Alvorecer":4,"Marechal do Sol Poente":1,"Arqueiro de Dois Sinos":2,"Vigia do Último Salmo":2,"Trabuco da Trombeta Final":2,"Catapulta do Dilúvio de Pedra":3,"Balestra da Penitência":1,"Couraça do Mártir":2,"Gibão Bento":2,"Setas de Cicuta":1,"Lâmina do Juramento":2,"Preces na Sombra":2,"Chamado do Túmulo Santo":1,"Peregrinação ao Graal":1,"Sermão da Estratégia":2,"Alistamento do Púlpito":2,"Convocação dos Veteranos de Fé":2,"Dízimo de Guerra":2,"Toque dos Sinos de Guerra":2},
  ],
};

const BY_NAME: Record<string, CardDef> = {};
CARD_DEFS.forEach(c => { BY_NAME[c.name] = c; });

export const getCardDef = (name: string): CardDef | undefined => BY_NAME[name];
// Laboratório: registra cartas que ainda não fazem parte do jogo (decks em teste, ver src/engine/experimental.ts). Não entram em CARD_DEFS.
export const registerCardDefs = (defs: readonly CardDef[]) => { defs.forEach(d => { BY_NAME[d.name] = d; }); };
export const requireCardDef = (name: string): CardDef => {
  const def = BY_NAME[name];
  if (!def) throw new Error(`Unknown card: ${name}`);
  return def;
};
// Nomes antigos dos Mercenários (renomeados na rodada 18). Decks e coleções já salvos (aparelho, nuvem, servidor) podem ter os nomes velhos:
// quem lê um save passa o nome por `currentCardName`.
export const LEGACY_CARD_NAMES: Readonly<Record<string, string>> = {
  'Comandante Brann, Senhor da Companhia': 'Brann Meia-Coroa, Comprador de Guerras',
  'Lanceiro de Aluguel': 'Lanceiro Pés-de-Lama',
  'Besteiro Contratado': 'Besteiro Dedo-Ligeiro',
  'Espadachim do Soldo': 'Capa-Rota',
  'Desertor': 'Rato da Muralha',
  'Capitão da Companhia': 'Capitão Barba-de-Corvo',
  'Cavaleiro Errante': 'Cavaleiro do Escudo Raspado',
  'Duelista Livre': 'Florete de Aposta',
  'Bombardeiro Contratado': 'Boca-de-Fogo',
  'Sentinela Fiel': 'Vigia da Última Brasa',
  'Tesoureiro da Companhia': 'Quillon Contamoedas',
  'Livro de Contratos': 'Códice das Mil Dívidas',
  'Escriba de Contratos': 'Escriba do Códice',
  'Salva de Besteiros': 'Chuva de Ferro Barato',
  'Contrato de Execução': 'Pacto do Punhal Vermelho',
  'Carga de Pólvora': 'O Dia em que a Muralha Caiu',
  'Armadura Alugada': 'Peitoral de Muitos Donos',
  'Espada de Aluguel': 'Espada de Mil Mãos',
  'Agência de Recrutamento': 'Tambor do Soldo Fácil',
  'Resgate de Mercenário': 'Ninguém Fica na Lama',
  'Recrutamento de Rua': 'Os Dois do Beco',
  'Suborno': 'O Peso da Bolsa',
  // Cardeal (renomeado na rodada 20)
  'Cardeal Pedro, Voz da Fé': 'Cardeal Anselmo, Voz da Fé',
  'Cálice da Graça': 'Cálice das Duas Bênçãos',
  'Devotos da Cruzada': 'Penitente de Pedra',
  'Recruta Devoto': 'Noviço Renascido',
  'Mercador da Cruzada': 'Cambista do Dízimo',
  'Infiltrado da Ordem': 'Confessor Silencioso',
  'Fanático da Cruzada': 'Zeloso da Pira',
  'Intendente do Exército': 'Despenseiro do Mosteiro',
  'Soldados da Ordem': 'Sentinela do Claustro',
  'Cavaleiro Hospitalário': 'Samaritano de Aço',
  'Cavaleiro da Luz': 'Paladino do Alvorecer',
  'Nobre da Cruzada': 'Barão da Procissão',
  'Comandante da Ordem': 'Marechal do Sol Poente',
  'Soldado Leal': 'Acólito Leal',
  'Arqueiro da Ordem': 'Arqueiro de Dois Sinos',
  'Atirador da Cruzada': 'Vigia do Último Salmo',
  'Armadura de Guerra': 'Couraça do Mártir',
  'Couraça Reforçada': 'Gibão Bento',
  'Flechas Venenosas': 'Setas de Cicuta',
  'Espada Longa': 'Lâmina do Juramento',
  'Reforços Ocultos': 'Preces na Sombra',
  'Trabuco de Cerco': 'Trabuco da Trombeta Final',
  'Catapulta de Guerra': 'Catapulta do Dilúvio de Pedra',
  'Balestra de Precisão': 'Balestra da Penitência',
  'Retorno do Soldado': 'Chamado do Túmulo Santo',
  'Graal da Dádiva': 'Peregrinação ao Graal',
  'Doutrina Renovada': 'Sermão da Estratégia',
  'Recrutamento Seletivo': 'Alistamento do Púlpito',
  'Recrutar Veteranos': 'Convocação dos Veteranos de Fé',
  'Tributo de Guerra': 'Dízimo de Guerra',
  'Chamado às Armas': 'Toque dos Sinos de Guerra',
};
export const currentCardName = (name: string): string => LEGACY_CARD_NAMES[name] ?? name;
/** Passa as chaves de um mapa nome→quantidade (coleção, cartas de um deck) pelos nomes atuais; se os dois nomes existirem, soma. */
export const currentNames = (m: Record<string, number>): Record<string, number> => {
  const out: Record<string, number> = {};
  Object.entries(m ?? {}).forEach(([n, c]) => { const k = currentCardName(n); out[k] = (out[k] ?? 0) + c; });
  return out;
};
export const isGeneralName = (name: string) => BY_NAME[name]?.cardType === 'General';

// Acólito Leal — the token Barão da Procissão summons. Not a deck card, so it is not in CARD_DEFS' lists
// of any recipe, but the art/UI still needs to find it by name.
export const TOKEN_DEFS: readonly CardDef[] = [
  { name: 'Acólito Leal', cardType: 'Infantaria', atk: 1, hp: 2, cost: 0, effect: '' },
];
TOKEN_DEFS.forEach(c => { BY_NAME[c.name] = c; });
