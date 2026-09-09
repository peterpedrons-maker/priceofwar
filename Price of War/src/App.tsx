import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { X, Sword, Zap, Users, Library, Shield } from 'lucide-react';
import { playAiTurn, AiAction } from './services/aiService';
import { updateGameState, getGame } from './services/supabaseService';
import { DeckBuilder } from './components/DeckBuilder';
import { MultiplayerLobby } from './components/MultiplayerLobby';
import { AuthScreen } from './components/AuthScreen';
import { CardFace, ManaBadge, AtkBadge, HpBadge } from './components/CardFace';
import backplateImg from './assets/backplate.png';
import { audio } from './services/audioService';

// ── Arte das cartas ─────────────────────────────────────────────────────────
// Adicione arquivos em src/assets/cards/ com o nome base do id da carta.
// Formatos aceitos: .png, .jpg, .jpeg, .webp
// Exemplos:
//   gen1.png              → Comandante Aurelion
//   c_tactical_soldier.png → Soldado Tático (usado pelas 4 cópias)
//   c_line_squire.png      → Escudeiro de Linha
//   c_formation_captain.png
//   c_scout.png
//   c_control_lancer.png
//   c_tactical_knight.png
//   c_veteran.png
//   t_reform_lines.png
//   t_coordinated_advance.png
//   t_quick_reposition.png
//   t_closed_line.png
//   t_retreat_order.png
//   a_instant_block.png
//   a_counter_maneuver.png
//   a_broken_formation.png
const _cardArtModules = import.meta.glob('./assets/cards/*.{png,jpg,jpeg,webp}', { eager: true }) as Record<string, { default: string }>;
const _cardArtMap: Record<string, string> = {};
for (const [path, mod] of Object.entries(_cardArtModules)) {
  const filename = path.split('/').pop()!.replace(/\.[^.]+$/, ''); // strip extension
  _cardArtMap[filename] = mod.default;
}
/** Retorna a URL da arte da carta baseado na base do id (sem sufixo _N). */
function resolveCardArt(cardId: string): string {
  const base = cardId.replace(/_\d+$/, '');
  return _cardArtMap[base] ?? '';
}

export type CardType = 'Infantaria' | 'Cavalaria' | 'Artilharia' | 'Arqueiro' | 'Tática' | 'Lendário' | 'Suporte' | 'General' | 'Relíquia' | 'Terreno' | 'Plebeu' | 'Tática' | 'Armamento' | 'Emboscada';

export type CardData = {
  id: string;
  name: string;
  atk: number;
  hp: number;
  cost: number;
  art: string;
  effect: string;
  cardType?: CardType | string;
  isDestroyed?: boolean;
  effectKey?: string;        // identifies effect logic
  isSpell?: boolean;         // no board slot — resolves from hand
  isEquipment?: boolean;     // play from hand → target ally
  isAmbush?: boolean;        // can be activated during opponent's attack
  maxAtksPerTurn?: number;   // default 1  (Arqueiro Profissional = 2)
  bonusAtk?: number;         // permanent runtime ATK bonus
  bonusHp?: number;          // permanent runtime HP bonus
  tempBonusAtk?: number;     // expires at end of turn
  tempBonusHp?: number;      // expires at end of turn
};

const SlashEffect = () => (
  <motion.div
    initial={{ scale: 0, opacity: 1, rotateZ: -45 }}
    animate={{ scale: [0, 3, 3.5], opacity: [1, 1, 0] }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
  >
    <div className="w-[300%] h-6 bg-white shadow-[0_0_60px_rgba(255,255,255,1)] rounded-full absolute" style={{ filter: 'blur(1px)' }} />
    <div className="w-[200%] h-3 bg-[#ff2a00] shadow-[0_0_40px_rgba(239,68,68,1)] rounded-full absolute" />
    
    {/* Slash cruzado para mais impacto */}
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute w-[150%] h-2 bg-yellow-400 rotate-90 rounded-full blur-sm"
    />
  </motion.div>
);

const ImpactEffect = () => (
  <motion.div
    initial={{ scale: 0.5, opacity: 1 }}
    animate={{ scale: 4.5, opacity: 0 }}
    transition={{ duration: 0.45, ease: "easeOut" }}
    className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
  >
    {/* Explosão radial */}
    <div className="absolute w-40 h-40 bg-orange-500 rounded-full blur-[30px] mix-blend-screen" />
    <div className="absolute w-28 h-28 bg-yellow-300 rounded-full blur-2xl mix-blend-screen" />
    <div className="absolute w-12 h-12 bg-white rounded-full blur-md mix-blend-screen" />
    {/* Shockwave circular */}
    <motion.div 
      initial={{ scale: 0, opacity: 1, borderWidth: '10px' }}
      animate={{ scale: 1.5, opacity: 0, borderWidth: '0px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="absolute w-32 h-32 rounded-full border-white mix-blend-overlay"
    />
    {/* Raios de impacto (mais pronunciados) */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1.5 h-24 bg-yellow-100 rounded-full blur-sm mix-blend-screen"
        style={{
          transform: `rotate(${i * 30}deg) translateY(-40px)`,
          transformOrigin: 'center center'
        }}
        initial={{ scaleY: 0, opacity: 1 }}
        animate={{ scaleY: 1.5, opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
    ))}
  </motion.div>
);

const ExplosionEffect = () => (
  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
    {/* Explosion */}
    <motion.div
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{ scale: 3, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="absolute flex items-center justify-center"
    >
      <div className="w-32 h-32 bg-orange-500 rounded-full blur-xl mix-blend-screen" />
      <div className="absolute w-24 h-24 bg-yellow-300 rounded-full blur-lg mix-blend-screen" />
      <div className="absolute w-16 h-16 bg-white rounded-full blur-md mix-blend-screen" />
    </motion.div>
    {/* Particles */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{ 
          x: (Math.random() - 0.5) * 300, 
          y: (Math.random() - 0.5) * 300,
          scale: 0,
          opacity: 0
        }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      />
    ))}
  </div>
);

const DECK_1: CardData[] = [
  // General (1)
  { id: 'gen1', name: 'Comandante Aurelion, Mestre da Formação', atk: 0, hp: 20, cost: 0, art: resolveCardArt('gen1'), effect: 'Após Remanejamento: até 2 unidades que se moveram ganham +1/+1 no próximo combate. Passiva: unidades adjacentes recebem -1 de dano', cardType: 'General' },
  
  // Criaturas (27)
  ...Array(4).fill(null).map((_, i) => ({ id: `c_tactical_soldier_${i}`, name: 'Soldado Tático', atk: 3, hp: 3, cost: 2, art: resolveCardArt(`c_tactical_soldier_${i}`), effect: 'Troca com aliado adjacente no fim do turno', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i) => ({ id: `c_line_squire_${i}`, name: 'Escudeiro de Linha', atk: 2, hp: 4, cost: 2, art: resolveCardArt(`c_line_squire_${i}`), effect: 'Protege unidades atrás', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i) => ({ id: `c_formation_captain_${i}`, name: 'Capitão de Formação', atk: 3, hp: 4, cost: 3, art: resolveCardArt(`c_formation_captain_${i}`), effect: 'Ao mover: adjacentes +1 ATK', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i) => ({ id: `c_scout_${i}`, name: 'Batedor', atk: 1, hp: 2, cost: 1, art: resolveCardArt(`c_scout_${i}`), effect: 'Move após combate', cardType: 'Leve' })),
  ...Array(4).fill(null).map((_, i) => ({ id: `c_control_lancer_${i}`, name: 'Lanceiro de Controle', atk: 3, hp: 2, cost: 2, art: resolveCardArt(`c_control_lancer_${i}`), effect: 'Inimigos adjacentes -1 ATK', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i) => ({ id: `c_tactical_knight_${i}`, name: 'Cavaleiro Tático', atk: 4, hp: 4, cost: 3, art: resolveCardArt(`c_tactical_knight_${i}`), effect: 'Troca com qualquer aliado na linha', cardType: 'Cavalaria' })),
  ...Array(3).fill(null).map((_, i) => ({ id: `c_veteran_${i}`, name: 'Veterano de Guerra', atk: 4, hp: 3, cost: 3, art: resolveCardArt(`c_veteran_${i}`), effect: '+2 ATK na coluna 3', cardType: 'Infantaria' })),
  
  // Táticas (20)
  ...Array(4).fill(null).map((_, i) => ({ id: `t_reform_lines_${i}`, name: 'Reformar Linhas', atk: 0, hp: 0, cost: 2, art: resolveCardArt(`t_reform_lines_${i}`), effect: 'Reorganiza até 3 unidades', cardType: 'Tática' })),
  ...Array(4).fill(null).map((_, i) => ({ id: `t_coordinated_advance_${i}`, name: 'Avanço Coordenado', atk: 0, hp: 0, cost: 2, art: resolveCardArt(`t_coordinated_advance_${i}`), effect: 'Após mover: +2 ATK', cardType: 'Tática' })),
  ...Array(4).fill(null).map((_, i) => ({ id: `t_quick_reposition_${i}`, name: 'Reposicionamento Rápido', atk: 0, hp: 0, cost: 1, art: resolveCardArt(`t_quick_reposition_${i}`), effect: 'Move inimigo 1 slot', cardType: 'Tática' })),
  ...Array(4).fill(null).map((_, i) => ({ id: `t_closed_line_${i}`, name: 'Linha Fechada', atk: 0, hp: 0, cost: 2, art: resolveCardArt(`t_closed_line_${i}`), effect: 'Adjacentes recebem menos dano', cardType: 'Tática' })),
  ...Array(4).fill(null).map((_, i) => ({ id: `t_retreat_order_${i}`, name: 'Ordem de Retirada', atk: 0, hp: 0, cost: 2, art: resolveCardArt(`t_retreat_order_${i}`), effect: 'Move para backline + cura', cardType: 'Tática' })),
  
  // Emboscadas (12)
  ...Array(4).fill(null).map((_, i) => ({ id: `a_instant_block_${i}`, name: 'Bloqueio Instantâneo', atk: 0, hp: 0, cost: 2, art: resolveCardArt(`a_instant_block_${i}`), effect: 'Cancela ataque se houver adjacente', cardType: 'Emboscada' })),
  ...Array(4).fill(null).map((_, i) => ({ id: `a_counter_maneuver_${i}`, name: 'Contra-Manobra', atk: 0, hp: 0, cost: 3, art: resolveCardArt(`a_counter_maneuver_${i}`), effect: 'Troca posições durante ataque', cardType: 'Emboscada' })),
  ...Array(4).fill(null).map((_, i) => ({ id: `a_broken_formation_${i}`, name: 'Formação Quebrada', atk: 0, hp: 0, cost: 2, art: resolveCardArt(`a_broken_formation_${i}`), effect: 'Move inimigo aleatoriamente', cardType: 'Emboscada' })),

  // Relíquias (1 — limite 1 por deck; posição: slot esquerdo do General)
  { id: 'relic_banner_0', name: 'Estandarte da Legião', atk: 0, hp: 5, cost: 3, art: resolveCardArt('relic_banner_0'), effect: 'Permanente. Todas as unidades aliadas ganham +1 ATK enquanto esta relíquia estiver no campo.', cardType: 'Relíquia' },

  // Terrenos (2 — posição: slot direito do General)
  { id: 'terrain_fortress_0', name: 'Fortaleza de Pedra', atk: 0, hp: 8, cost: 3, art: resolveCardArt('terrain_fortress_0'), effect: 'Permanente. Unidades aliadas na fileira de trás recebem -1 de dano de ataques inimigos.', cardType: 'Terreno' },
  { id: 'terrain_swamp_0', name: 'Pântano Maldito', atk: 0, hp: 6, cost: 2, art: resolveCardArt('terrain_swamp_0'), effect: 'Permanente. Unidades inimigas na fileira da frente sofrem -1 ATK enquanto este terreno estiver no campo.', cardType: 'Terreno' }
];

// ── DECK CARDEAL PEDRO ─────────────────────────────────────────────────────
const DECK_CARDEAL: CardData[] = [
  // General
  { id: 'cardeal_gen', name: 'Cardeal Pedro', atk: 0, hp: 20, cost: 0, art: '', effect: 'Fase Principal: cure 1 HP em um soldado aliado. Pague 1 ouro para curar 3 HP em vez disso.', cardType: 'General', effectKey: 'general_cardeal' },
  // Relíquia
  { id: 'cardeal_relic', name: 'Cálice da Vida', atk: 0, hp: 5, cost: 3, art: '', effect: 'Permanente. Permite que o General Cardeal Pedro use sua habilidade duas vezes por turno.', cardType: 'Relíquia', effectKey: 'calice_vida' },
  // Plebeus
  ...Array(4).fill(null).map((_, i) => ({ id: `cardeal_fiel_${i}`, name: 'Multidão de Fiéis', atk: 0, hp: 3, cost: 1, art: '', effect: '—', cardType: 'Plebeu' } as CardData)),
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_comerciante_${i}`, name: 'Comerciante das Cruzadas', atk: 1, hp: 1, cost: 1, art: '', effect: 'Uma vez por turno: veja as 2 cartas do topo do deck. Adicione 1 à mão e coloque a outra no fundo.', cardType: 'Plebeu', effectKey: 'comerciante' } as CardData)),
  // Infantaria
  { id: 'cardeal_espiao', name: 'Espião Sabotador', atk: 1, hp: 2, cost: 1, art: '', effect: 'Na Vanguarda: impede Emboscadas inimigas. Se o General aliado receber dano, no próximo turno não poderá usar sua habilidade.', cardType: 'Infantaria', effectKey: 'espiao_sabotador' },
  { id: 'cardeal_fanatico', name: 'Soldado Fanático', atk: 1, hp: 2, cost: 1, art: '', effect: 'Ao atacar: se o General inimigo for de tipo oposto, ganha +2 ATK.', cardType: 'Infantaria', effectKey: 'soldado_fanatico' },
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_aprendiz_${i}`, name: 'Aprendiz de Infantaria', atk: 0, hp: 2, cost: 1, art: '', effect: 'Ao ser curado: recebe +1 ATK permanente.', cardType: 'Infantaria', effectKey: 'aprendiz_infantaria' } as CardData)),
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_vigia_${i}`, name: 'Vigia de Mantimentos', atk: 2, hp: 3, cost: 2, art: '', effect: 'Uma vez por turno: se você tiver menos de 2 cartas na mão, compre até ficar com 2.', cardType: 'Infantaria', effectKey: 'vigia_mantimentos' } as CardData)),
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_inf_treinada_${i}`, name: 'Infantaria Treinada', atk: 3, hp: 5, cost: 2, art: '', effect: '—', cardType: 'Infantaria' } as CardData)),
  // Cavaleiros
  ...Array(3).fill(null).map((_, i) => ({ id: `cardeal_jorge_${i}`, name: 'Jorge, o Lanceiro', atk: 4, hp: 6, cost: 3, art: '', effect: 'Ao atacar a Vanguarda: causa 2 de dano à unidade na Retaguarda da mesma coluna.', cardType: 'Cavalaria', effectKey: 'jorge_lanceiro' } as CardData)),
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_hosp_${i}`, name: 'Hospitalário', atk: 2, hp: 4, cost: 2, art: '', effect: 'Uma vez por turno: cure 1 HP de um aliado E cause 1 de dano a um inimigo na Vanguarda.', cardType: 'Cavalaria', effectKey: 'hospitalario' } as CardData)),
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_nobre_${i}`, name: 'Nobre Religioso', atk: 4, hp: 5, cost: 3, art: '', effect: 'Ao entrar em campo: invoca Soldados Leais (1 ATK / 2 HP) nos slots adjacentes livres da mesma fileira.', cardType: 'Cavalaria', effectKey: 'nobre_religioso' } as CardData)),
  ...Array(4).fill(null).map((_, i) => ({ id: `cardeal_cavaleiro_${i}`, name: 'Cavaleiro Branco', atk: 5, hp: 7, cost: 3, art: '', effect: '—', cardType: 'Cavalaria' } as CardData)),
  { id: 'cardeal_lider', name: 'Líder de Esquadrão', atk: 5, hp: 5, cost: 3, art: '', effect: 'Na Vanguarda: Infantaria e Arqueiros aliados ganham +1 ATK e +1 HP durante o combate.', cardType: 'Cavalaria', effectKey: 'lider_esquadrao' },
  // Arqueiros
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_arq_pro_${i}`, name: 'Arqueiro Profissional', atk: 1, hp: 4, cost: 2, art: '', effect: 'Pode atacar duas vezes por rodada.', cardType: 'Arqueiro', effectKey: 'arqueiro_profissional', maxAtksPerTurn: 2 } as CardData)),
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_atirador_${i}`, name: 'Atirador Influente', atk: 1, hp: 3, cost: 2, art: '', effect: 'Ao ir ao cemitério: compre 3 cartas.', cardType: 'Arqueiro', effectKey: 'atirador_influente' } as CardData)),
  // Táticas de Dano
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_trabuco_${i}`, name: 'Trabuco', atk: 0, hp: 0, cost: 3, art: '', effect: 'Causa 2 de dano a TODAS as unidades inimigas.', cardType: 'Tática', effectKey: 'trabuco', isSpell: true } as CardData)),
  ...Array(3).fill(null).map((_, i) => ({ id: `cardeal_catapulta_${i}`, name: 'Catapulta', atk: 0, hp: 0, cost: 2, art: '', effect: 'Escolha uma fileira inimiga. Todas as unidades naquela fileira recebem 2 de dano.', cardType: 'Tática', effectKey: 'catapulta', isSpell: true } as CardData)),
  { id: 'cardeal_balesta', name: 'Balesta', atk: 0, hp: 0, cost: 1, art: '', effect: 'Causa 3 de dano a uma unidade inimiga à sua escolha.', cardType: 'Tática', effectKey: 'balesta', isSpell: true },
  // Armamentos (equipment)
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_armadura_${i}`, name: 'Armadura Pesada', atk: 0, hp: 0, cost: 1, art: '', effect: 'Infantaria equipada recebe +2 HP.', cardType: 'Armamento', effectKey: 'armadura_pesada', isSpell: true, isEquipment: true } as CardData)),
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_corcelete_${i}`, name: 'Corcelete', atk: 0, hp: 0, cost: 1, art: '', effect: 'Arqueiro, Plebeu ou Infantaria equipada recebe +1 HP.', cardType: 'Armamento', effectKey: 'corcelete', isSpell: true, isEquipment: true } as CardData)),
  { id: 'cardeal_flecha', name: 'Flecha Envenenada', atk: 0, hp: 0, cost: 1, art: '', effect: 'Arqueiro equipado recebe +1 ATK.', cardType: 'Armamento', effectKey: 'flecha_envenenada', isSpell: true, isEquipment: true },
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_espada_${i}`, name: 'Espada Longa', atk: 0, hp: 0, cost: 1, art: '', effect: 'Cavalaria, Infantaria ou Plebeu equipado recebe +2 ATK.', cardType: 'Armamento', effectKey: 'espada_longa', isSpell: true, isEquipment: true } as CardData)),
  // Emboscadas
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_forcas_${i}`, name: 'Forças Secretas', atk: 0, hp: 0, cost: 1, art: '', effect: '⚡ EMBOSCADA: Durante um ataque inimigo, um soldado aliado recebe +2 ATK e +1 HP até o fim do turno.', cardType: 'Emboscada', effectKey: 'forcas_secretas', isSpell: true, isAmbush: true } as CardData)),
  // Táticas
  { id: 'cardeal_soldado_retorna', name: 'O Soldado Retorna', atk: 0, hp: 0, cost: 1, art: '', effect: 'Adicione um soldado do cemitério à sua mão.', cardType: 'Tática', effectKey: 'soldado_retorna', isSpell: true },
  { id: 'cardeal_busca_graal', name: 'Busca pelo Santo Graal', atk: 0, hp: 0, cost: 1, art: '', effect: 'Adicione uma carta de Terreno ou Relíquia do deck à sua mão.', cardType: 'Tática', effectKey: 'busca_graal', isSpell: true },
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_nova_tatica_${i}`, name: 'Nova Tática', atk: 0, hp: 0, cost: 1, art: '', effect: 'Adicione uma carta de Tática do deck à sua mão.', cardType: 'Tática', effectKey: 'nova_tatica', isSpell: true } as CardData)),
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_esc_dedo_${i}`, name: 'Escolher a Dedo', atk: 0, hp: 0, cost: 1, art: '', effect: 'Adicione um soldado do deck à sua mão.', cardType: 'Tática', effectKey: 'escolher_dedo', isSpell: true } as CardData)),
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_esc_tropas_${i}`, name: 'Escolher Tropas', atk: 0, hp: 0, cost: 1, art: '', effect: 'Veja as 4 cartas do topo. Adicione 2 à mão e coloque 2 no fundo do deck.', cardType: 'Tática', effectKey: 'escolher_tropas', isSpell: true } as CardData)),
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_impostos_${i}`, name: 'Aumento de Impostos', atk: 0, hp: 0, cost: 0, art: '', effect: 'Ganhe 1 ouro adicional neste turno.', cardType: 'Tática', effectKey: 'aumento_impostos', isSpell: true } as CardData)),
  ...Array(2).fill(null).map((_, i) => ({ id: `cardeal_reuniao_${i}`, name: 'Reunião de Fiéis', atk: 0, hp: 0, cost: 2, art: '', effect: 'Invoque do deck até 2 soldados com 0 ATK para slots livres na Vanguarda. Embaralhe o deck.', cardType: 'Tática', effectKey: 'reuniao_fieis', isSpell: true } as CardData)),
];

const MOCK_DECK: CardData[] = DECK_1.filter(c => c.cardType !== 'General');
const MOCK_DECK_CARDEAL: CardData[] = DECK_CARDEAL.filter(c => c.cardType !== 'General');

const generateHand = (count: number, sourceDeck: CardData[]) => {
  const pool = sourceDeck.length > 0 ? sourceDeck.filter(c => c.cardType !== 'General') : MOCK_DECK;
  return Array(count).fill(null).map((_, i) => ({
    ...pool[Math.floor(Math.random() * pool.length)],
    id: `hand_${Date.now()}_${i}`
  }));
};

const MainMenu = ({ onSelectMode }: { onSelectMode: (mode: string) => void }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [-500, 500], [-20, 20]);
  const bgY = useTransform(mouseY, [-500, 500], [-20, 20]);

  const icons = {
    'Campaign': Sword,
    'Quick Match': Zap,
    'Multiplayer': Users,
    'My Deck': Library
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onMouseMove={(e) => {
        mouseX.set(e.clientX - window.innerWidth / 2);
        mouseY.set(e.clientY - window.innerHeight / 2);
      }}
      className="flex flex-col items-center justify-center w-full h-full bg-zinc-950 text-white relative overflow-hidden"
    >
      {/* Animated Background with Parallax */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        className="absolute -inset-20 bg-[radial-gradient(circle_at_center,rgba(49,46,129,0.3)_0%,rgba(0,0,0,1)_100%)] z-0"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.h1 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-7xl font-black mb-16 text-transparent bg-clip-text bg-gradient-to-b from-indigo-300 to-indigo-600 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10"
      >
        CARD BATTLE
      </motion.h1>

      <div className="flex flex-col gap-6 relative z-10">
        {['Campaign', 'Quick Match', 'Multiplayer', 'My Deck'].map((mode, i) => {
          const Icon = icons[mode as keyof typeof icons];
          return (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              animate={{ boxShadow: ["0 0 10px rgba(99, 102, 241, 0.3)", "0 0 20px rgba(99, 102, 241, 0.6)", "0 0 10px rgba(99, 102, 241, 0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={(e) => { e.stopPropagation(); onSelectMode(mode); }}
              className="px-10 py-5 bg-zinc-900/80 hover:bg-indigo-950 rounded-xl text-2xl font-bold transition-all border-2 border-zinc-700 hover:border-indigo-500 shadow-lg flex items-center gap-4"
            >
              <Icon className="w-8 h-8" />
              {mode}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

// ── EFFECT / AMBUSH TYPES ─────────────────────────────────────────────────
type EffectMode =
  | 'target_enemy'      // click enemy unit slot
  | 'target_ally'       // click allied unit slot
  | 'equip_ally'        // click valid allied unit to equip
  | 'choose_row'        // row selector overlay (0=front,1=mid)
  | 'graveyard_pick'    // show graveyard picker
  | 'deck_search'       // search deck for specific cardType categories
  | 'deck_top4'         // peek top 4 cards
  | 'summon_0atk'       // place 0-ATK units from deck into empty front slots
  | 'general_heal'      // click ally to heal (General ability)
  | 'hosp_step1'        // Hospitalário: click ally to heal
  | 'hosp_step2';       // Hospitalário: click enemy to damage

type PendingEffectState = {
  card: CardData;
  handIndex: number;
  mode: EffectMode;
  validTypes?: string[];       // for equip: valid unit cardType targets
  deckSearchTypes?: string[];  // deck_search: which cardType list to search
  step?: number;               // multi-step effects
  partialTarget?: number;      // slot selected in step 0
  generatorSlot?: number;      // which unit has the activated ability
};

type PendingAmbushState = {
  attackerSlot: number;
  targetSlot: number | 'avatar';
  ambushCards: Array<{ card: CardData; handIndex: number }>;
};

// ── DECK SELECT SCREEN ────────────────────────────────────────────────────
const DeckSelectScreen = ({ customDeck, onSelect, onBack }: { customDeck: CardData[]; onSelect: (deckId: 'custom' | 'deck1' | 'cardeal') => void; onBack?: () => void }) => {
  const decks = [
    { id: 'deck1' as const, name: 'Deck Capitão', desc: 'O deck padrão. Infantaria disciplinada e reformação tática.', general: 'Comandante Aurelion', color: 'indigo' },
    { id: 'cardeal' as const, name: 'Deck Cardeal', desc: 'Fe e ferro. Cura, invocações e emboscadas sagradas.', general: 'Cardeal Pedro', color: 'amber' },
    ...(customDeck.length > 0 ? [{ id: 'custom' as const, name: 'Meu Deck', desc: `${customDeck.length} cartas personalizadas.`, general: customDeck.find(c => c.cardType === 'General')?.name ?? 'General', color: 'emerald' }] : []),
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-6 pointer-events-auto">
      <motion.h2 initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
        Escolha seu Deck
      </motion.h2>
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-zinc-400 hover:text-white uppercase font-bold tracking-widest transition-colors flex items-center gap-2 z-50"
        >
          ← Voltar
        </button>
      )}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">
        {decks.map((d, idx) => (
          <motion.button
            key={d.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(d.id)}
            className={`flex-1 flex flex-col items-center gap-3 bg-zinc-900/80 border-2 rounded-2xl px-6 py-8 transition-all ${
              d.color === 'amber' ? 'border-amber-600 hover:border-amber-400' :
              d.color === 'indigo' ? 'border-indigo-600 hover:border-indigo-400' :
              'border-emerald-600 hover:border-emerald-400'
            }`}
          >
            <span className={`text-xl font-black uppercase tracking-widest ${
              d.color === 'amber' ? 'text-amber-300' :
              d.color === 'indigo' ? 'text-indigo-300' : 'text-emerald-300'
            }`}>{d.name}</span>
            <span className="text-zinc-400 text-sm text-center leading-relaxed">{d.desc}</span>
            <span className="text-zinc-500 text-xs uppercase tracking-widest">General: {d.general}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [deck, setDeck] = useState<CardData[]>(() => {
    try {
      const saved = localStorage.getItem('price-of-war-deck');
      return saved ? JSON.parse(saved) : [...MOCK_DECK];
    } catch {
      return [...MOCK_DECK];
    }
  });

  const handleSaveDeck = (newDeck: CardData[]) => {
    setDeck(newDeck);
    localStorage.setItem('price-of-war-deck', JSON.stringify(newDeck));
  };

  const [gameMode, setGameMode] = useState<string | null>(null);
  const [startupPhase, setStartupPhase] = useState<'jokenpo' | 'drawing' | 'playing'>('jokenpo');
  const [jokenpoChoice, setJokenpoChoice] = useState<'pedra' | 'papel' | 'tesoura' | null>(null);
  const [jokenpoNpcChoice, setJokenpoNpcChoice] = useState<'pedra' | 'papel' | 'tesoura' | null>(null);
  const [jokenpoResult, setJokenpoResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [jokenpoPhase, setJokenpoPhase] = useState<'choosing' | 'revealing' | 'revealed'>('choosing');

  // ── Deck selection ──────────────────────────────────────────────────────
  const [selectedDeckId, setSelectedDeckId] = useState<'custom' | 'deck1' | 'cardeal' | null>(null);
  const [deckSelectOpen, setDeckSelectOpen] = useState(false);
  
  const [viewState, setViewState] = useState<'hand' | 'field' | 'draw'>('hand');
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [justPlacedSlot, setJustPlacedSlot] = useState<number | null>(null);
  const [justPlacedNpcSlot, setJustPlacedNpcSlot] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'npc'>('player');
  const [turnNumber, setTurnNumber] = useState(1);

  const [playerHp, setPlayerHp] = useState(20);
  const [npcHp, setNpcHp] = useState(20);
  const [playerMana, setPlayerMana] = useState(12);
  const [npcMana, setNpcMana] = useState(12);

  const [hand, setHand] = useState<CardData[]>([]);
  const [npcHand, setNpcHand] = useState<CardData[]>([]);
  const [playerSlots, setPlayerSlots] = useState<(CardData | null)[]>(Array(13).fill(null));
  const [npcSlots, setNpcSlots] = useState<(CardData | null)[]>(Array(13).fill(null));
  const [playerClassCard, setPlayerClassCard] = useState<CardData | null>(null);
  const [npcClassCard, setNpcClassCard] = useState<CardData | null>(null);

  // ── Effect / Graveyard / Ambush state ───────────────────────────────────
  const [graveyard, setGraveyard] = useState<CardData[]>([]);
  const [playerDeck, setPlayerDeck] = useState<CardData[]>([]);
  const [pendingEffect, setPendingEffect] = useState<PendingEffectState | null>(null);
  const [pendingAmbush, setPendingAmbush] = useState<PendingAmbushState | null>(null);
  const pendingAmbushResolveRef = React.useRef<null | ((activated: boolean, handIdx?: number, targetSlot?: number) => void)>(null);
  const [generalAbilityUsedCount, setGeneralAbilityUsedCount] = useState(0);
  const [unitAbilityUsed, setUnitAbilityUsed] = useState<Set<string>>(new Set());
  const [attackCountThisTurn, setAttackCountThisTurn] = useState<Record<number, number>>({});
  const [generalAbilityBlocked, setGeneralAbilityBlocked] = useState(false); // Espião effect
  const [showGraveyardPicker, setShowGraveyardPicker] = useState(false);
  const [showDeckTop4, setShowDeckTop4] = useState(false);
  const [deckTop4Cards, setDeckTop4Cards] = useState<CardData[]>([]);
  const [showSummonPicker, setShowSummonPicker] = useState(false);
  const [summonSourceCards, setSummonSourceCards] = useState<CardData[]>([]); // cards available to summon
  const [summonSlotsChosen, setSummonSlotsChosen] = useState<number[]>([]); // slots player chose for summon
  // ── Generic Card Picker (deck/graveyard search) ──────────────────────────
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [cardPickerCards, setCardPickerCards] = useState<CardData[]>([]);
  const [cardPickerSelected, setCardPickerSelected] = useState<number[]>([]);
  const [cardPickerConfig, setCardPickerConfig] = useState<{
    max: number; title: string; subtitle: string; source: 'deck' | 'graveyard' | 'deck_top4';
  } | null>(null);
  const [pendingSpellHandIndex, setPendingSpellHandIndex] = useState<number | null>(null);
  const [tacticaDisplayCard, setTacticaDisplayCard] = useState<CardData | null>(null);

  const handCardRefs = React.useRef<(HTMLElement | null)[]>([]);
  // ── TÁTICA ACTION BUTTONS (overlay ao lado da carta selecionada) ── 
  // Posição calculada matematicamente baseada em targetX do getSelectedCardX
  const getTacticaButtonsPosition = () => {
    if (selectedCardIndex === null || !handCardRefs.current[selectedCardIndex]) {
      return { left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${isMobile ? 0.8 : 1})` };
    }
    const el = handCardRefs.current[selectedCardIndex]!;
    const rect = el.getBoundingClientRect();
    
    // Position buttons explicitly hovering directly slightly above the card right from where it sat
    const cx = rect.left + rect.width / 2;
    const cy = rect.top - 20;

    return {
      left: `${cx}px`,
      top: `${cy}px`,
      transform: `translate(-50%, -100%) scale(${isMobile ? 0.8 : 1})`
    };
  };

  // ── Multiplayer (Supabase) ────────────────────────────────────────────────
  const [onlineUser, setOnlineUser] = useState<{ id: string; username: string; email: string } | null>(null);
  const [multiplayerGameId, setMultiplayerGameId] = useState<string | null>(null);
  const [isP1, setIsP1] = useState(false);
  const [opponentUsername, setOpponentUsername] = useState('');
  const [onlineOpponentDeckId, setOnlineOpponentDeckId] = useState<string>('deck1');
  // Tracks whether we've already pushed the current player turn to the DB
  const onlineTurnPushedRef = React.useRef(false);



  // Tracks the last action_id we received from the opponent (to avoid re-animating)
  const lastProcessedActionIdRef = React.useRef<string | null>(null);

  const [selectedAttackerIndex, setSelectedAttackerIndex] = useState<number | null>(null);
  const [detailedCard, setDetailedCard] = useState<CardData | null>(null);

  // ── Turn Phase System ───────────────────────────────────────────────────
  // Phases: 'draw' (handled by viewState) | 'reposition' | 'command' | 'battle'
  type TurnPhase = 'draw' | 'reposition' | 'command' | 'battle';
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('command');
  // Repositioning: index of the card on the field the player is moving
  const [repositionSource, setRepositionSource] = useState<number | null>(null);
  // Slots that already moved this turn (each card can move once; swap counts both)
  const [movedSlots, setMovedSlots] = useState<Set<number>>(new Set());
  // Battle phase: slots that already attacked this turn
  const [attackedSlots, setAttackedSlots] = useState<Set<number>>(new Set());
  const [hoveredBoardSlot, setHoveredBoardSlot] = useState<{type: 'player'|'npc', index: number} | null>(null);

  const [isImpacting, setIsImpacting] = useState(false);
  const [attackAnim, setAttackAnim] = useState<{ attackerIndex: number, targetIndex: number | 'avatar', isPlayerAttacking: boolean, deltaX?: number, deltaY?: number } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [phaseAnnouncement, setPhaseAnnouncement] = useState<TurnPhase | null>(null);
  const [swapAnim, setSwapAnim] = useState<{ a: number; b: number } | null>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [sourcePos, setSourcePos] = useState<{ x: number, y: number } | null>(null);
  const [floatingCard, setFloatingCard] = useState<{ from: {x:number,y:number}; to: {x:number,y:number}; isNpc: boolean; key: number } | null>(null);

  useEffect(() => {
    const activeIndex = selectedAttackerIndex !== null ? selectedAttackerIndex : repositionSource;
    if (activeIndex !== null) {
      const el = document.getElementById(`player_slot_${activeIndex}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        setSourcePos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    } else if (selectedCardIndex !== null && handCardRefs.current[selectedCardIndex]) {
      const el = handCardRefs.current[selectedCardIndex];
      if (el) {
        const rect = el.getBoundingClientRect();
        setSourcePos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    } else {
      setSourcePos(null);
    }
  }, [selectedAttackerIndex, repositionSource, selectedCardIndex]);

  useEffect(() => {
    // Para que as setas acompanhem fluidamente, até mesmo durante as animações de popup, guardamos a ref global
    const handleMove = (e: PointerEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Update floating card location constantly so arrows always originate correctly in case it moves/animates
      if (selectedCardIndex !== null && handCardRefs.current[selectedCardIndex]) {
        const el = handCardRefs.current[selectedCardIndex]!;
        const rect = el.getBoundingClientRect();
        setSourcePos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    };
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [selectedCardIndex]);

  const isFrontline = (slotIndex: number) => slotIndex >= 0 && slotIndex <= 4;
  const isBackline = (slotIndex: number) => slotIndex >= 5 && slotIndex <= 9;
  
  const getCol = (slotIndex: number) => {
    if (isFrontline(slotIndex)) return slotIndex;
    if (isBackline(slotIndex)) return slotIndex - 5;
    return -1; // General tem regra especial
  };

  const getRow = (idx: number): number => idx <= 4 ? 0 : idx <= 9 ? 1 : 2;
  const getColFull = (idx: number): number => {
    if (idx <= 4) return idx;
    if (idx <= 9) return idx - 5;
    if (idx === 10) return 1;
    if (idx === 11) return 3;
    return 2;
  };

  const getValidAttackTargets = (attackerIndex: number, slots: (CardData | null)[], enemySlots: (CardData | null)[]) => {
    const validTargets = new Set<number | 'avatar'>();
    const attacker = slots[attackerIndex];
    if (!attacker) return validTargets;

    // A lógica de depends do isBackline / getCol que devem ser definidas antes
    const attackerType = attacker.cardType;

    if (!attackerType) return validTargets;

    // Regra: Infantaria na Backline não ataca ninguem.
    if (attackerType === 'Infantaria' && isBackline(attackerIndex)) {
      return validTargets; 
    }

    const attackerCol = getCol(attackerIndex);

    // Ranged units (Arqueiro / Artilharia) ignore direct-front blocking
    const isRanged = attackerType === 'Arqueiro' || attackerType === 'Artilharia';

    // If a non-ranged attacker has an enemy card DIRECTLY in front (same column,
    // enemy frontline), it is FORCED to target only that card — no diagonal or
    // backline attacks are allowed.
    const directFrontalEnemy = !isRanged && !!enemySlots[attackerCol];

    const scanCols = directFrontalEnemy
      ? [attackerCol]
      : [attackerCol - 1, attackerCol, attackerCol + 1].filter(c => c >= 0 && c <= 4);

    scanCols.forEach(col => {
      const enemyFrontIndex = col;
      const enemyBackIndex = col + 5;
      const hasFrontEnemy = !!enemySlots[enemyFrontIndex];
      const hasBackEnemy = !!enemySlots[enemyBackIndex];
      if (hasFrontEnemy) {
        validTargets.add(enemyFrontIndex);
      } else if (hasBackEnemy) {
        validTargets.add(enemyBackIndex);
      }
    });

    // Third row LOS — slot 10 sits at column 1 (0-indexed), Avatar/Classe at column 2,
    // slot 11 at column 3. Each is reachable only when:
    //   1. The attacker's scanCols includes the target's column (LOS angle)
    //   2. The entire column leading to it (frontline + backline) is clear (no blocker)
    const thirdRow: { col: number; target: number | 'avatar'; exists: boolean }[] = [
      { col: 1, target: 10,       exists: !!enemySlots[10] },
      { col: 2, target: enemySlots[12] ? 12 : 'avatar', exists: true },
      { col: 3, target: 11,       exists: !!enemySlots[11] },
    ];
    thirdRow.forEach(({ col, target, exists }) => {
      if (!exists) return;
      if (!scanCols.includes(col)) return; // attacker's angle doesn't reach this column
      const isPathClear = !enemySlots[col] && !enemySlots[col + 5];
      if (isPathClear) validTargets.add(target);
    });
    return validTargets;
  };

  const validTargets = useMemo(() => {
    if (selectedAttackerIndex === null) return new Set<number | 'avatar'>();
    return getValidAttackTargets(selectedAttackerIndex, playerSlots, npcSlots);
  }, [selectedAttackerIndex, playerSlots, npcSlots]);

  const validRepositionTargets = useMemo(() => {
    const targets = new Set<number>();
    if (repositionSource === null || turnPhase !== 'reposition') return targets;
    for (let i = 0; i < 12; i++) {
        if (i === repositionSource) continue;
        const rowDiff = Math.abs(getRow(repositionSource) - getRow(i));
        const colDiff = Math.abs(getColFull(repositionSource) - getColFull(i));
        if (rowDiff + colDiff === 1) {
            const dstCard = playerSlots[i];
            if (dstCard && movedSlots.has(i)) continue;
            targets.add(i);
        }
    }
    return targets;
  }, [repositionSource, turnPhase, playerSlots, movedSlots]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (startupPhase === 'drawing' && gameMode && selectedDeckId) {
        // Resolve active deck pool based on selection
        const activeDeckPool = selectedDeckId === 'cardeal' ? DECK_CARDEAL
          : selectedDeckId === 'deck1' ? DECK_1
          : deck.length > 0 ? deck : DECK_1;

        // Opponent deck pool (only used in Multiplayer)
        const oppDeckPool = onlineOpponentDeckId === 'cardeal' ? DECK_CARDEAL
          : onlineOpponentDeckId === 'deck1' ? DECK_1
          : DECK_1;

        // Build ordered playerDeck (no General/Relic/Terrain — they go to fixed slots)
        const deckForDraw = activeDeckPool.filter(c => c.cardType !== 'General');
        const shuffled = [...deckForDraw].sort(() => Math.random() - 0.5);
        setPlayerDeck(shuffled);
        setGraveyard([]);
        setGeneralAbilityUsedCount(0);
        setUnitAbilityUsed(new Set());
        setAttackCountThisTurn({});
        setGeneralAbilityBlocked(false);

        const pSlots = Array(13).fill(null);
        const nSlots = Array(13).fill(null);
        pSlots[12] = activeDeckPool.find(c => c.cardType === 'General') || DECK_1.find(c => c.cardType === 'General') || null;
        // Opponent slot 12 uses opponent's deck general (for Multiplayer)
        nSlots[12] = (gameMode === 'Multiplayer' ? oppDeckPool : DECK_1).find(c => c.cardType === 'General') || null;
        setPlayerSlots(pSlots);
        setNpcSlots(nSlots);

      setHand([]);
      setNpcHand([]);
      let draws = 0;
      const npcDeckForDraw = gameMode === 'Multiplayer' ? oppDeckPool : DECK_1;
      const interval = setInterval(() => {
        setHand(prev => [...prev, generateHand(1, activeDeckPool)[0]]);
        // In Multiplayer we don’t draw for the opponent — their hand is private
        if (gameMode !== 'Multiplayer') {
          setNpcHand(prev => [...prev, generateHand(1, npcDeckForDraw)[0]]);
        }
        draws++;
        if (draws >= 10) {
          clearInterval(interval);
          setTimeout(() => setStartupPhase('playing'), 800);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [startupPhase, gameMode, selectedDeckId]);

  useEffect(() => {
    if (startupPhase !== 'playing') return;
    
    if (currentTurn === 'player') {
      if (turnNumber >= 3) {
        setPlayerMana(prev => prev + 4);
      }
      setMovedSlots(new Set());
      setAttackedSlots(new Set());
      setAttackCountThisTurn({});
      setRepositionSource(null);
      setSelectedAttackerIndex(null);
      setSelectedCardIndex(null);
      setPendingEffect(null);
      setGeneralAbilityUsedCount(0);
      setUnitAbilityUsed(new Set());
      // Expire temp bonuses on player units (moved back to where it was)
      setPlayerSlots(prev => prev.map(c => {
        if (!c) return null;
        const updated = { ...c };
        if (c.tempBonusAtk) { updated.atk = Math.max(0, c.atk - c.tempBonusAtk); delete updated.tempBonusAtk; }
        if (c.tempBonusHp) { updated.hp = Math.max(1, c.hp - c.tempBonusHp); delete updated.tempBonusHp; }
        return updated;
      }));

      if (turnNumber > 1) {
        setTurnPhase('draw');
        setTimeout(() => {
          setHand(prev => {
            const activeDeckPool = (selectedDeckId === 'cardeal' ? DECK_CARDEAL
              : selectedDeckId === 'deck1' ? DECK_1
              : deck.length > 0 ? deck : DECK_1).filter(c => c.cardType !== 'General');
            if (prev.length < 10) {
              const newCard = {
                ...activeDeckPool[Math.floor(Math.random() * activeDeckPool.length)],
                id: `hand_${Date.now()}_${Math.random()}`
              };
              return [...prev, newCard];
            }
            return prev;
          });
          
          // NPC uses the same draw timings... wait, no we are inside currentTurn === 'player'. So player draws.
          const hasVigia = playerSlots.some(c => c?.effectKey === 'vigia_mantimentos');
          if (hasVigia) {
            setHand(prev => {
              if (prev.length < 2) {
                const vigiaPool = (selectedDeckId === 'cardeal' ? DECK_CARDEAL : selectedDeckId === 'deck1' ? DECK_1 : deck.length > 0 ? deck : DECK_1).filter(c => c.cardType !== 'General');
                const draws: CardData[] = [];
                while (prev.length + draws.length < 2) {
                  draws.push({ ...vigiaPool[Math.floor(Math.random() * vigiaPool.length)], id: `hand_vigia_${Date.now()}_${draws.length}` });
                }
                return [...prev, ...draws];
              }
              return prev;
            });
          }
          setTurnPhase('reposition');
          setViewState('hand');
        }, 400);
      } else {
        setTurnPhase('command');
      }
    } else {
      if (turnNumber >= 3) {
        setNpcMana(prev => prev + 4);
      }
      
      // AI draws a card at start of their turn too!
      if (turnNumber > 1 && gameMode === 'Quick Match') {
        const aiDeckPool = DECK_1.filter(c => c.cardType !== 'General');
        const aiDrawnCard = {
          ...aiDeckPool[Math.floor(Math.random() * aiDeckPool.length)],
          id: `npc_hand_${Date.now()}_${Math.random()}`
        };
        setNpcHand(prev => [...prev, aiDrawnCard]);
      }
      
      setViewState('field');
    }
  }, [currentTurn, turnNumber, startupPhase]);

  // ── Multiplayer: push my turn state when I end my turn ─────────────────────
  useEffect(() => {
    if (gameMode !== 'Multiplayer' || !multiplayerGameId || startupPhase !== 'playing') return;
    if (currentTurn !== 'npc') {
      // Reset push flag when it's our turn again
      onlineTurnPushedRef.current = false;
      return;
    }
    if (onlineTurnPushedRef.current) return;
    onlineTurnPushedRef.current = true;

    const mySlotKey  = isP1 ? 'p1_slots'    : 'p2_slots';
    const myHpKey    = isP1 ? 'p1_hp'       : 'p2_hp';
    const myManaKey  = isP1 ? 'p1_mana'     : 'p2_mana';
    const myHandKey  = isP1 ? 'p1_hand_count': 'p2_hand_count';
    const myGravKey  = isP1 ? 'p1_graveyard': 'p2_graveyard';
    const oppSlotsKey = isP1 ? 'p2_slots'   : 'p1_slots';
    const oppHpKeyPush = isP1 ? 'p2_hp'     : 'p1_hp';
    const activeVal  = isP1 ? 'p2'           : 'p1'; // after pushing, it's opponent's turn

    updateGameState(multiplayerGameId, {
      [mySlotKey]:    playerSlots,
      [myHpKey]:      playerHp,
      [myManaKey]:    playerMana,
      [myHandKey]:    hand.length,
      [myGravKey]:    graveyard,
      [oppSlotsKey]:  npcSlots,   // damage we dealt to opponent's field
      [oppHpKeyPush]: npcHp,      // opponent HP after our attacks
      active_player: activeVal,
      turn_number:   turnNumber,
    } as any).catch(() => {});
  }, [currentTurn, gameMode, multiplayerGameId, isP1, startupPhase]);

  // ── Multiplayer: poll opponent state and animate each action in real-time ──
  useEffect(() => {
    if (gameMode !== 'Multiplayer' || !multiplayerGameId || startupPhase !== 'playing') return;
    if (currentTurn !== 'npc') return;

    let cancelled = false;
    const poll = async () => {
      while (!cancelled) {
        await new Promise(r => setTimeout(r, 1200));
        if (cancelled) break;
        const game = await getGame(multiplayerGameId);
        if (!game || cancelled) break;

        const myKey         = isP1 ? 'p1'      : 'p2';
        const oppSlotsKey   = isP1 ? 'p2_slots' : 'p1_slots';
        const oppHpKey      = isP1 ? 'p2_hp'    : 'p1_hp';
        const oppManaKey    = isP1 ? 'p2_mana'  : 'p1_mana';
        const myHpKeyPoll   = isP1 ? 'p1_hp'    : 'p2_hp';
        const mySlotKeyPoll = isP1 ? 'p1_slots' : 'p2_slots';

        const actionId = game.last_action?.action_id as string | undefined;
        const isNewAction = !!actionId && actionId !== lastProcessedActionIdRef.current;

        if (isNewAction) {
          lastProcessedActionIdRef.current = actionId!;
          const action = game.last_action;

          if (action.type === 'attack_slot' || action.type === 'attack_avatar') {
            // Show attack animation BEFORE applying post-attack board state
            const attackerEl = document.getElementById(`npc_slot_${action.attackerIndex}`);
            const targetEl = action.type === 'attack_slot'
              ? document.getElementById(`player_slot_${action.targetIndex}`)
              : document.getElementById('player_avatar');
            let deltaX = 0, deltaY = 600;
            if (attackerEl && targetEl) {
              const aRect = attackerEl.getBoundingClientRect();
              const dRect = targetEl.getBoundingClientRect();
              deltaX = dRect.left - aRect.left + dRect.width / 2 - aRect.width / 2;
              deltaY = dRect.top  - aRect.top  + dRect.height / 2 - aRect.height / 2;
            }
            audio.playAttack();
        setAttackAnim({
              attackerIndex: action.attackerIndex as number,
              targetIndex: action.type === 'attack_avatar' ? 'avatar' : action.targetIndex as number,
              isPlayerAttacking: false,
              deltaX,
              deltaY,
            });
            await new Promise(r => setTimeout(r, 350));
            if (cancelled) break;
            setIsImpacting(true);
            await new Promise(r => setTimeout(r, 300));
            setIsImpacting(false);
            await new Promise(r => setTimeout(r, 380));
            setAttackAnim(null);
          }

          // Apply resulting board state after the action
          setNpcSlots(game[oppSlotsKey] ?? Array(13).fill(null));
          setNpcHp(game[oppHpKey] ?? 20);
          setNpcMana(game[oppManaKey] ?? 15);
          if (game[myHpKeyPoll] !== undefined) setPlayerHp(game[myHpKeyPoll]);
          if (game[mySlotKeyPoll]) setPlayerSlots(game[mySlotKeyPoll]);
        }

        // Check if opponent ended their turn
        if (game.active_player === myKey) {
          if (!isNewAction) {
            // Apply final end-of-turn state if no new action was processed this tick
            setNpcSlots(game[oppSlotsKey] ?? Array(13).fill(null));
            setNpcHp(game[oppHpKey] ?? 20);
            setNpcMana(game[oppManaKey] ?? 15);
            if (game[myHpKeyPoll] !== undefined) setPlayerHp(game[myHpKeyPoll]);
            if (game[mySlotKeyPoll]) setPlayerSlots(game[mySlotKeyPoll]);
          }
          if (game.status === 'finished') { cancelled = true; break; }
          setCurrentTurn('player');
          setTurnNumber(game.turn_number ?? (turnNumber + 1));
          break;
        }
      }
    };
    poll();
    return () => { cancelled = true; };
  }, [currentTurn, gameMode, multiplayerGameId, isP1, startupPhase]);

  useEffect(() => {
    if (currentTurn === 'npc' && gameMode === 'Quick Match' && !isAnimating && startupPhase === 'playing') {
      const runAiTurn = async () => {
        setIsAnimating(true);
const { actions } = playAiTurn(npcSlots, playerSlots, npcMana, npcHand, getValidAttackTargets, turnPhase === 'battle');
        
        let currentNpcSlots = [...npcSlots];
        let currentPlayerSlots = [...playerSlots];
        let currentNpcMana = npcMana;
        let currentPlayerHp = playerHp;

        // NPC draws a card animation
        const npcDeckPos = { x: window.innerWidth * 0.85 - 45, y: window.innerHeight * 0.22 - 64 };
        const npcHandPos = { x: window.innerWidth * 0.5 - 45, y: -10 };
        
        // Wait randomly before deciding to do anything (Human-like pause)
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));

        setFloatingCard({ from: npcDeckPos, to: npcHandPos, isNpc: true, key: Date.now() });
        await new Promise(r => setTimeout(r, 680));
        setFloatingCard(null);
        await new Promise(r => setTimeout(r, 420 + Math.random() * 600));

        for (const action of actions) {
          if (action.type === 'play_card') {
            // NPC plays card from hand to field
            
            // Remove the card from NPC hand in state
            setNpcHand(prev => {
              const next = [...prev];
              // using handIndex provided by AiService or fallback
              if ('handIndex' in action && action.handIndex >= 0) {
                // we have a precise index! But indices shift if we play multiple. 
                // A better way is to find by ID
                const toRemove = next.findIndex(c => c.id === action.card.id);
                if (toRemove !== -1) next.splice(toRemove, 1);
              } else {
                const toRemove = next.findIndex(c => c.id === action.card.id);
                if (toRemove !== -1) next.splice(toRemove, 1);
              }
              return next;
            });

            const col = action.slotIndex % 5;
            const row = action.slotIndex < 5 ? 0 : (action.slotIndex < 10 ? 1 : 2);
            const slotX = window.innerWidth * 0.5 + (col - 2) * 110 - 45;
            const slotY = window.innerHeight * (0.5 - row * 0.1) - 64;
            setFloatingCard({ from: { ...npcHandPos }, to: { x: slotX, y: slotY }, isNpc: true, key: Date.now() });
            
            // Human-like pause while AI decides and card "travels"
            await new Promise(r => setTimeout(r, 680 + Math.random() * 400));
            setFloatingCard(null);
            
            // Apply card to slot and deduct mana
            currentNpcSlots[action.slotIndex] = action.card;
            currentNpcMana -= action.card.cost;
            setNpcSlots([...currentNpcSlots]);
            setNpcMana(currentNpcMana);
            
            // Trigger AAA placement animation for NPC
            audio.playPlayCard();
            setJustPlacedNpcSlot(action.slotIndex);
            
            // More human-like pause between plays to let the effect shine
            await new Promise(resolve => setTimeout(resolve, 1400 + Math.random() * 800));
            setJustPlacedNpcSlot(null);
            
          } else if (action.type === 'attack') {
              // ── AMBUSH INTERRUPT CHECK ──────────────────────────────
              const currentHandSnap = [...hand];
              const ambushInHand = currentHandSnap.filter(c => c.isAmbush);
              const espiaoBocking = currentPlayerSlots.some((c, i) => c?.effectKey === 'espiao_sabotador' && i >= 0 && i <= 4);
              if (ambushInHand.length > 0 && !espiaoBocking) {
                const ambushEntries = ambushInHand.map(c => ({ card: c, handIndex: currentHandSnap.findIndex(h => h.id === c.id) }));
                const decision = await new Promise<{ activated: boolean; handIdx?: number; targetSlot?: number }>(resolve => {
                  pendingAmbushResolveRef.current = resolve;
                  setPendingAmbush({ attackerSlot: action.attackerSlot, targetSlot: action.targetSlot, ambushCards: ambushEntries });
                });
                pendingAmbushResolveRef.current = null;
                setPendingAmbush(null);
                if (decision.activated && decision.handIdx !== undefined && decision.handIdx >= 0) {
                  // Apply Forças Secretas: +2 ATK/+1 HP temp on target slot
                  const ambushCard = currentHandSnap[decision.handIdx];
                  if (ambushCard?.effectKey === 'forcas_secretas' && typeof decision.targetSlot === 'number') {
                    const tSlot = decision.targetSlot;
                    if (currentPlayerSlots[tSlot]) {
                      const targetCard = currentPlayerSlots[tSlot]!;
                      currentPlayerSlots[tSlot] = {
                        ...targetCard,
                        atk: targetCard.atk + 2,
                        hp: targetCard.hp + 1,
                        tempBonusAtk: (targetCard.tempBonusAtk || 0) + 2,
                        tempBonusHp: (targetCard.tempBonusHp || 0) + 1,
                      };
                    }
                    setPlayerSlots([...currentPlayerSlots]);
                  }
                  // Remove ambush card from hand and deduct cost
                  const newHand = currentHandSnap.filter((_, i) => i !== decision.handIdx);
                  setHand(newHand);
                  if (ambushCard) setPlayerMana(prev => Math.max(0, prev - ambushCard.cost));
                  showToast(`⚡ EMBOSCADA! ${ambushCard?.name ?? 'Carta'} ativada!`);
                }
              }
              // ────────────────────────────────────────────────────────

              const attackerEl = document.getElementById(`npc_slot_${action.attackerSlot}`);
              const defenderEl = action.targetSlot === 'avatar' ? document.getElementById(`player_avatar`) : document.getElementById(`player_slot_${action.targetSlot}`);

              let deltaX = 0;
              let deltaY = 600;

              if (attackerEl && defenderEl) {
                const aRect = attackerEl.getBoundingClientRect();
                const dRect = defenderEl.getBoundingClientRect();
                deltaX = dRect.left - aRect.left + (dRect.width / 2) - (aRect.width / 2);
                deltaY = dRect.top - aRect.top + (dRect.height / 2) - (aRect.height / 2);
              }

              // Human-like pause before launching attack
              await new Promise(r => setTimeout(r, 600 + Math.random() * 500));

              audio.playAttack();
        setAttackAnim({
                attackerIndex: action.attackerSlot,
                targetIndex: action.targetSlot,
                isPlayerAttacking: false,
                deltaX,
                deltaY
              });
            
            setIsImpacting(true);
            await new Promise(resolve => setTimeout(resolve, 200));
            setIsImpacting(false);

            const attacker = currentNpcSlots[action.attackerSlot];
            if (!attacker) continue;

            let hasDestroyed = false;

            if (action.targetSlot === 'avatar') {
              currentPlayerHp = Math.max(0, currentPlayerHp - attacker.atk);
              setPlayerHp(currentPlayerHp);
            } else {
              const targetSlotIdx = action.targetSlot as number;
              const defender = currentPlayerSlots[targetSlotIdx];
              if (defender) {
                const updatedAttacker = { ...attacker, hp: attacker.hp - defender.atk };
                const updatedDefender = { ...defender, hp: defender.hp - attacker.atk };
                
                if (updatedAttacker.hp <= 0) {
                  currentNpcSlots[action.attackerSlot] = { ...updatedAttacker, isDestroyed: true };
                  hasDestroyed = true;
                } else {
                  currentNpcSlots[action.attackerSlot] = updatedAttacker;
                }

                if (updatedDefender.hp <= 0) {
                  currentPlayerSlots[targetSlotIdx] = { ...updatedDefender, isDestroyed: true };
                  hasDestroyed = true;
                  // Death effect: Atirador Influente draws 3
                  if (updatedDefender.effectKey === 'atirador_influente') {
                    const pool = getActiveDeckPool();
                    const draws = Array.from({ length: 3 }, () => ({ ...pool[Math.floor(Math.random() * pool.length)], id: `draw_ai_${Date.now()}_${Math.random()}` }));
                    setHand(prev => [...prev, ...draws]);
                    showToast('Atirador Influente: compre 3 cartas!');
                  }
                  setGraveyard(prev => [...prev, updatedDefender]);
                } else {
                  currentPlayerSlots[targetSlotIdx] = updatedDefender;
                }
                
                setNpcSlots([...currentNpcSlots]);
                setPlayerSlots([...currentPlayerSlots]);
              }
            }
            
            setAttackAnim(null);
            
            if (hasDestroyed) {
              await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
              currentNpcSlots = currentNpcSlots.map(c => c?.isDestroyed ? null : c);
              currentPlayerSlots = currentPlayerSlots.map(c => c?.isDestroyed ? null : c);
              setNpcSlots([...currentNpcSlots]);
              setPlayerSlots([...currentPlayerSlots]);
            } else {
              await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
            }
          }
        }
        
        setCurrentTurn('player');
        setTurnNumber(prev => prev + 1);
        setIsAnimating(false);
      };
      
      const timer = setTimeout(runAiTurn, 1000 + Math.random() * 1000); // Base pause before doing anything
      return () => clearTimeout(timer);
    }
  }, [currentTurn, gameMode, startupPhase]);

  useEffect(() => {
    if (currentTurn !== 'player' || turnPhase === 'draw') {
      setPhaseAnnouncement(null);
      return;
    }
    setPhaseAnnouncement(turnPhase);
    const t = setTimeout(() => setPhaseAnnouncement(null), 2400);
    return () => clearTimeout(t);
  }, [turnPhase, currentTurn]);

  if (gameMode === 'My Deck') {
    return (
      <DeckBuilder
        deck={deck}
        defaultDeck={MOCK_DECK}
        onSave={handleSaveDeck}
        onBack={() => setGameMode(null)}
      />
    );
  }

  if (gameMode === 'Multiplayer') {
    // Step 1: authenticate
    if (!onlineUser) {
      return <AuthScreen onAuthenticated={setOnlineUser} />;
    }
    // Step 2: lobby / deck select → then game starts
    if (!multiplayerGameId) {
      return (
        <MultiplayerLobby
          user={onlineUser}
          customDeck={deck}
          onGameStart={({ gameId, isP1: p1, opponentUsername: opp, myDeck, opponentDeck }) => {
            setMultiplayerGameId(gameId);
            setIsP1(p1);
            setOpponentUsername(opp);
            setSelectedDeckId(myDeck);
            setOnlineOpponentDeckId(opponentDeck ?? 'deck1');
            onlineTurnPushedRef.current = false;
            lastProcessedActionIdRef.current = null;
            // P1 always starts; jokenpo is skipped in multiplayer
            setCurrentTurn(p1 ? 'player' : 'npc');
            setStartupPhase('drawing');
          }}
          onBack={() => setGameMode(null)}
        />
      );
    }
  }

  if (!gameMode) {
    return (
      <div className="relative w-full h-screen bg-zinc-950 text-white">
        <MainMenu onSelectMode={setGameMode} />
      </div>
    );
  }

  if ((gameMode === 'Quick Match' || gameMode === 'Campaign') && !selectedDeckId) {
    return (
      <div className="relative w-full h-screen bg-zinc-950 text-white">
        <DeckSelectScreen
          customDeck={deck}
          onSelect={(id) => {
            setSelectedDeckId(id);
          }}
          onBack={() => setGameMode(null)}
        />
      </div>
    );
  }

  const handleJokenpo = (choice: 'pedra' | 'papel' | 'tesoura') => {
    audio.init();
    audio.playClick();
    if (jokenpoChoice) return; // prevent double-click during reveal
    setJokenpoChoice(choice);
    setJokenpoPhase('revealing');
    const options: ('pedra'|'papel'|'tesoura')[] = ['pedra', 'papel', 'tesoura'];
    const npcChoice = options[Math.floor(Math.random() * 3)];

    setTimeout(() => {
      setJokenpoNpcChoice(npcChoice);
      setJokenpoPhase('revealed');

      const playerWins =
        (choice === 'pedra'   && npcChoice === 'tesoura') ||
        (choice === 'papel'   && npcChoice === 'pedra')   ||
        (choice === 'tesoura' && npcChoice === 'papel');
      const isDraw = choice === npcChoice;

      if (isDraw) {
        setJokenpoResult('draw');
        setTimeout(() => {
          setJokenpoChoice(null);
          setJokenpoNpcChoice(null);
          setJokenpoResult(null);
          setJokenpoPhase('choosing');
        }, 2200);
      } else if (playerWins) {
        setJokenpoResult('win'); audio.playVictory();
        setCurrentTurn('player');
        setTimeout(() => setStartupPhase('drawing'), 2800);
      } else {
        setJokenpoResult('lose'); audio.playDefeat();
        setCurrentTurn('npc');
        setTimeout(() => setStartupPhase('drawing'), 2800);
      }
    }, 1100);
  };

  const isMobile = windowSize.width < 768;
  const boardScale = isMobile ? Math.min((windowSize.width - 20) / 1000, windowSize.height / 1400) : Math.min(windowSize.width / 1800, windowSize.height / 1400, 0.7) * 0.82;

  const getSlotGridPos = (slot: number) => {
    if (slot <= 4) return { row: 0, col: slot };
    if (slot <= 9) return { row: 1, col: slot - 5 };
    if (slot === 12) return { row: 2, col: 2 };
    return { row: 2, col: slot === 10 ? 0 : 4 };
  };
  const getSwapFrom = (i: number) => {
    if (!swapAnim) return { x: 0, y: 0 };
    const isA = swapAnim.a === i;
    const isB = swapAnim.b === i;
    if (!isA && !isB) return { x: 0, y: 0 };
    const posThis = getSlotGridPos(i);
    const posOther = getSlotGridPos(isA ? swapAnim.b : swapAnim.a);
    const colStep = isMobile ? 114 : 159;
    const rowStep = isMobile ? 152 : 216;
    return {
      x: (posOther.col - posThis.col) * colStep,
      y: (posOther.row - posThis.row) * rowStep,
    };
  };
  const handScale = isMobile 
    ? Math.min(0.85, (windowSize.width / (Math.max(4, hand.length) * 230)) * 0.95) 
    : 1;

  // ── EFFECT RESOLUTION HELPERS ─────────────────────────────────────────
  const getActiveDeckPool = () =>
    selectedDeckId === 'cardeal' ? DECK_CARDEAL
    : selectedDeckId === 'deck1' ? DECK_1
    : deck.length > 0 ? deck : DECK_1;

  // Draw cards from pool into hand
  const drawCards = (count: number) => {
    audio.playDrawCard();
    setPlayerDeck(prevDeck => {
      let currentDeck = [...prevDeck];
      // If deck is empty, reshape it from active pool (but no Generals)
      if (currentDeck.length === 0) {
        currentDeck = getActiveDeckPool().filter(c => c.cardType !== 'General').sort(() => Math.random() - 0.5);
      }
      const draws: CardData[] = [];
      let drawnCount = 0;
      while (drawnCount < count && currentDeck.length > 0) {
        draws.push({ ...currentDeck.shift()!, id: `drawn_${Date.now()}_${drawnCount}` });
        drawnCount++;
      }
      setHand(prevHand => {
        if (prevHand.length >= 10) return prevHand;
        const actualDraws = draws.slice(0, 10 - prevHand.length);
        return [...prevHand, ...actualDraws];
      });
      return currentDeck;
    });
  };

  // Remove card from hand by index and add cost
  const consumeHandCard = (handIndex: number, card: CardData) => {
    const newHand = [...hand];
    newHand.splice(handIndex, 1);
    setHand(newHand);
    setPlayerMana(prev => prev - card.cost);
  };

  // Apply damage to NPC slots and handle destruction
  const applyDamageToNpcSlot = (slotIndex: number, damage: number, slots: (CardData | null)[]) => {
    const card = slots[slotIndex];
    if (!card) return slots;
    const updated = { ...card, hp: card.hp - damage };
    const result = [...slots];
    result[slotIndex] = updated.hp <= 0 ? { ...updated, isDestroyed: true } : updated;
    return result;
  };

  // Handle on-death effects
  const handleDeathEffects = (deadCard: CardData, isPlayerCard: boolean) => {
    if (!isPlayerCard) return;
    setGraveyard(prev => [...prev, deadCard]);
    if (deadCard.effectKey === 'atirador_influente') {
      showToast(`${deadCard.name}: compre 3 cartas!`);
      drawCards(3);
    }
  };

  // Resolve on-entry effects (unit placed on board)
  const handleOnEntryEffect = (card: CardData, slotIndex: number, newPlayerSlots: (CardData | null)[]) => {
    if (card.effectKey !== 'nobre_religioso') return newPlayerSlots;
    const row = getRow(slotIndex);
    const col = getColFull(slotIndex);
    const leftNeighbor = row === 0 ? col - 1 : (row === 1 ? col - 1 + 5 : -1);
    const rightNeighbor = row === 0 ? col + 1 : (row === 1 ? col + 1 + 5 : -1);
    const summonCard = (): CardData => ({ id: `soldado_leal_${Date.now()}_${Math.random()}`, name: 'Soldado Leal', atk: 1, hp: 2, cost: 0, art: '', effect: 'Invocado por Nobre Religioso.', cardType: 'Infantaria' });
    let updated = [...newPlayerSlots];
    if (leftNeighbor >= 0 && leftNeighbor < 13 && !updated[leftNeighbor] && col > 0) {
      updated[leftNeighbor] = summonCard();
      showToast('Soldado Leal invocado à esquerda!');
    }
    if (rightNeighbor >= 0 && rightNeighbor < 13 && !updated[rightNeighbor] && col < 4) {
      updated[rightNeighbor] = summonCard();
      showToast('Soldado Leal invocado à direita!');
    }
    return updated;
  };

  // Apply equipment buff to a unit
  const applyEquipToBoardSlot = (equipCard: CardData, targetSlot: number) => {
    setPlayerSlots(prev => {
      const target = prev[targetSlot];
      if (!target) return prev;
      let updated = { ...target };
      switch (equipCard.effectKey) {
        case 'armadura_pesada':
          if (target.cardType === 'Infantaria') { updated.hp += 2; updated.bonusHp = (updated.bonusHp || 0) + 2; }
          else { showToast('Armadura Pesada só equipa Infantaria!'); return prev; }
          break;
        case 'corcelete':
          if (['Arqueiro','Plebeu','Infantaria'].includes(target.cardType as string)) { updated.hp += 1; updated.bonusHp = (updated.bonusHp || 0) + 1; }
          else { showToast('Corcelete: alvo inválido!'); return prev; }
          break;
        case 'flecha_envenenada':
          if (target.cardType === 'Arqueiro') { updated.atk += 1; updated.bonusAtk = (updated.bonusAtk || 0) + 1; }
          else { showToast('Flecha só equipa Arqueiros!'); return prev; }
          break;
        case 'espada_longa':
          if (['Cavalaria','Infantaria','Plebeu'].includes(target.cardType as string)) { updated.atk += 2; updated.bonusAtk = (updated.bonusAtk || 0) + 2; }
          else { showToast('Espada Longa: alvo inválido!'); return prev; }
          break;
        default: return prev;
      }
      const result = [...prev];
      result[targetSlot] = updated;
      showToast(`${equipCard.name} equipada em ${target.name}!`);
      return result;
    });
  };

  // Resolve a spell/tactic effect
  const resolveSpellEffect = (card: CardData, handIndex: number, target?: { slot?: number; row?: number }) => {
    consumeHandCard(handIndex, card);
    
    switch (card.effectKey) {
      case 'trabuco': {
        let newNpc = [...npcSlots];
        let destroyed: number[] = [];
        newNpc = newNpc.map((c, i) => {
          if (!c || c.cardType === 'General') return c;
          const updated = { ...c, hp: c.hp - 2 };
          if (updated.hp <= 0) { destroyed.push(i); return { ...updated, isDestroyed: true }; }
          return updated;
        });
        setNpcSlots(newNpc);
        showToast('Trabuco! 2 de dano a todas as unidades inimigas!');
        if (destroyed.length) setTimeout(() => setNpcSlots(prev => prev.map(c => c?.isDestroyed ? null : c)), 800);
        break;
      }
      case 'catapulta': {
        const row = target?.row ?? 0;
        let newNpc = [...npcSlots];
        const startIdx = row * 5;
        const endIdx = startIdx + 5;
        let destroyed: number[] = [];
        for (let i = startIdx; i < endIdx; i++) {
          const c = newNpc[i];
          if (!c || c.cardType === 'General') continue;
          const updated = { ...c, hp: c.hp - 2 };
          if (updated.hp <= 0) { destroyed.push(i); newNpc[i] = { ...updated, isDestroyed: true }; }
          else newNpc[i] = updated;
        }
        setNpcSlots(newNpc);
        showToast(`Catapulta! 2 de dano em todas as unidades da ${row === 0 ? 'Vanguarda' : 'Retaguarda'}!`);
        if (destroyed.length) setTimeout(() => setNpcSlots(prev => prev.map(c => c?.isDestroyed ? null : c)), 800);
        break;
      }
      case 'balesta': {
        const slot = target?.slot ?? -1;
        if (slot < 0 || !npcSlots[slot]) { showToast('Alvo inválido!'); return; }
        let newNpc = [...npcSlots];
        newNpc = applyDamageToNpcSlot(slot, 3, newNpc);
        setNpcSlots(newNpc);
        showToast('Balesta! 3 de dano no alvo!');
        if (newNpc[slot]?.isDestroyed) setTimeout(() => setNpcSlots(prev => prev.map(c => c?.isDestroyed ? null : c)), 800);
        break;
      }
      case 'aumento_impostos':
        setPlayerMana(prev => prev + 1);
        showToast('+1 ouro este turno!');
        break;
      case 'soldado_retorna': {
        const soldiers = graveyard.filter(c => !c.isSpell && c.cardType !== 'General' && c.cardType !== 'Relíquia' && c.cardType !== 'Terreno');
        if (soldiers.length === 0) { showToast('Cemitério vazio!'); return; }
        setCardPickerCards(soldiers);
        setCardPickerSelected([]);
        setCardPickerConfig({ max: 1, title: 'Soldado Retorna', subtitle: 'Escolha 1 soldado do Cemitério para retornar à mão.', source: 'graveyard' });
        setShowCardPicker(true);
        return;
      }
      case 'nova_tatica': {
        const strategies = playerDeck.filter(c => c.cardType === 'Tática');
        if (strategies.length === 0) { showToast('Nenhuma Tática restante no deck!'); return; }
        setCardPickerCards(strategies);
        setCardPickerSelected([]);
        setCardPickerConfig({ max: 1, title: 'Nova Tática', subtitle: 'Escolha 1 carta de Tática do seu deck para adicionar à mão.', source: 'deck' });
        setShowCardPicker(true);
        return;
      }
      case 'escolher_dedo': {
        const deckSoldiers = playerDeck.filter(c => !c.isSpell && c.cardType !== 'General' && c.cardType !== 'Relíquia' && c.cardType !== 'Terreno');
        if (deckSoldiers.length === 0) { showToast('Nenhum Soldado/Criatura restante no deck!'); return; }
        setCardPickerCards(deckSoldiers);
        setCardPickerSelected([]);
        setCardPickerConfig({ max: 1, title: 'Escolher a Dedo', subtitle: 'Escolha 1 Soldado ou Criatura do seu deck para adicionar à mão.', source: 'deck' });
        setShowCardPicker(true);
        return;
      }
      case 'busca_graal': {
        const special = playerDeck.filter(c => c.cardType === 'Terreno' || c.cardType === 'Relíquia');
        if (special.length === 0) { showToast('Nenhuma Relíquia/Terreno no deck!'); return; }
        setCardPickerCards(special);
        setCardPickerSelected([]);
        setCardPickerConfig({ max: 1, title: 'Busca pelo Santo Graal', subtitle: 'Escolha 1 Relíquia ou Terreno do seu deck para adicionar à mão.', source: 'deck' });
        setShowCardPicker(true);
        return;
      }
      case 'escolher_tropas': {
        // Pega EXATAMENTE as 4 cartas do topo do deck
        const top4 = playerDeck.slice(0, 4);
        if (top4.length === 0) { showToast('Deck vazio!'); return; }
        setCardPickerCards(top4);
        setCardPickerSelected([]);
        setCardPickerConfig({ max: 2, title: 'Escolher Tropas', subtitle: `Veja as ${top4.length} cartas do topo. Escolha 2 para a mão — as demais vão ao fundo do deck.`, source: 'deck_top4' });
        setShowCardPicker(true);
        return;
      }
      case 'reuniao_fieis': {
        const pool = getActiveDeckPool();
        const zeroAtk = pool.filter(c => c.atk === 0 && !c.isSpell && c.cardType !== 'General');
        if (zeroAtk.length === 0) { showToast('Nenhum soldado 0 ATK no deck!'); return; }
        setSummonSourceCards(zeroAtk);
        setSummonSlotsChosen([]);
        setShowSummonPicker(true);
        return; // handled by summon-slot picker
      }
      default:
        showToast(`${card.name} ativada!`);
        break;
    }
    setPendingEffect(null);
  };

  const handleCardPickerConfirm = (indices: number[]) => {
    if (!cardPickerConfig) return;
    const chosen = indices.map(idx => cardPickerCards[idx]);
    const newHandCards = chosen.map((c, ci) => ({ ...c, id: `picked_${Date.now()}_${ci}` }));
    setHand(prev => [...prev, ...newHandCards]);

    if (cardPickerConfig.source === 'deck_top4') {
      // Remove all 4 top-of-deck cards, then push the unchosen ones to the bottom
      const unchosen = cardPickerCards.filter((_, i) => !indices.includes(i));
      setPlayerDeck(prev => {
        // Remove the top4 cards from the front
        const rest = prev.slice(cardPickerCards.length);
        // Unchosen go to the bottom
        return [...rest, ...unchosen];
      });
    } else if (cardPickerConfig.source === 'deck') {
      setPlayerDeck(prev => {
        const next = [...prev];
        for (const c of chosen) { const i = next.findIndex(d => d.id === c.id); if (i >= 0) next.splice(i, 1); }
        return next;
      });
    } else if (cardPickerConfig.source === 'graveyard') {
      setGraveyard(prev => {
        const next = [...prev];
        for (const c of chosen) { const i = next.findIndex(d => d.id === c.id); if (i >= 0) next.splice(i, 1); }
        return next;
      });
    }
    setShowCardPicker(false); setCardPickerCards([]); setCardPickerSelected([]); setCardPickerConfig(null); setPendingEffect(null);
    showToast(`${newHandCards.map(c => c.name).join(', ')} adicionada${newHandCards.length > 1 ? 's' : ''} à mão!`);
  };
  const handleCardPickerClose = () => {
    setShowCardPicker(false); setCardPickerCards([]); setCardPickerSelected([]); setCardPickerConfig(null); setPendingEffect(null);
  };

  // Resolve General Cardeal Pedro ability
  const resolveGeneralAbility = (targetSlot: number, paid: boolean) => {
    const maxUses = playerSlots[10]?.effectKey === 'calice_vida' || playerSlots[11]?.effectKey === 'calice_vida' ? 2 : 1;
    if (generalAbilityUsedCount >= maxUses) { showToast('Habilidade já usada neste turno!'); return; }
    if (generalAbilityBlocked) { showToast('General impossibilitado de usar habilidade!'); return; }
    const healCost = paid ? 1 : 0;
    if (paid && playerMana < 1) { showToast('Mana insuficiente!'); return; }
    const healAmount = paid ? 3 : 1;
    const target = playerSlots[targetSlot];
    if (!target) { showToast('Sem unidade neste slot!'); return; }
    const newSlots = [...playerSlots];
    newSlots[targetSlot] = { ...target, hp: target.hp + healAmount };
    // Aprendiz de Infantaria: +1 ATK when healed
    if (target.effectKey === 'aprendiz_infantaria') {
      newSlots[targetSlot] = { ...newSlots[targetSlot]!, atk: newSlots[targetSlot]!.atk + 1 };
      showToast('Aprendiz de Infantaria: +1 ATK!');
    }
    setPlayerSlots(newSlots);
    if (paid) setPlayerMana(prev => prev - 1);
    setGeneralAbilityUsedCount(prev => prev + 1);
    showToast(`Cardeal Pedro: curou ${healAmount} HP em ${target.name}!`);
    setPendingEffect(null);
  };

  // Assess attack modifiers (passive effects at fight time)
  const getEffectiveAtk = (attacker: CardData, attackerSlot: number, defenderGeneral: CardData | null) => {
    let atk = attacker.atk;
    // Soldado Fanático: +2 ATK if enemy general is different type
    if (attacker.effectKey === 'soldado_fanatico' && defenderGeneral && defenderGeneral.cardType !== attacker.cardType) {
      atk += 2;
    }
    // Líder de Esquadrão: buff adjacent Infantaria/Arqueiros if in vanguarda
    if (!isFrontline(attackerSlot)) return atk;
    const liderInFront = playerSlots.some((c, i) => c?.effectKey === 'lider_esquadrao' && isFrontline(i));
    if (liderInFront && (attacker.cardType === 'Infantaria' || attacker.cardType === 'Arqueiro')) {
      atk += 1;
    }
    return atk;
  };

  // Funções Utilitárias para Regras de Tabuleiro
  const handleCardClick = (index: number) => {
    audio.playClick();
    if (pendingAmbush) return; // Don't allow hand interaction during ambush window
    if (turnPhase !== 'command') {
      showToast("Você só pode jogar cartas na Fase de Comando!");
      return;
    }
    const card = hand[index];
    if (selectedCardIndex === index) {
      setSelectedCardIndex(null);
      setPendingEffect(null);
      setViewState('hand');
      return;
    }
    // Check affordability
    if (playerMana < card.cost) {
      showToast("Ouro insuficiente!");
      return;
    }
    // Spell / Equipment / Ambush: don't enter board view, start effect mode
    if (card.isSpell || card.isEquipment) {
      // If ambush card, explain that it activates during opponent's attack
      if (card.isAmbush) {
        showToast(`⚡ ${card.name} ficará disponível para ativar quando o oponente atacar!`);
        return; // Ambush cards are NOT played proactively from hand
      }
      // Tática: require at least one free non-special field slot
      if (card.cardType === 'Tática') {
        const hasFreeSlot = playerSlots.slice(0, 10).some(s => s === null);
        if (!hasFreeSlot) {
          showToast('Precisas de um slot livre no campo para jogar uma Tática!');
          return;
        }
      }

      if (card.cardType === 'Armamento') {
        setPendingEffect({ type: 'equipment', cardIndex: index });
        setSelectedCardIndex(null);
        setViewState('field');
        showToast(`${card.name}: clique em uma unidade aliada para equipar!`);
        return;
      }

      setSelectedCardIndex(index);
      // Just select the card to show "Ativar/Cancelar" UI
      return;
    }
    setSelectedCardIndex(index);
    setViewState('field');
    setSelectedAttackerIndex(null);
  };

  // ── Multiplayer: push board state + action descriptor after each player action ──
  const pushMultiplayerState = (
    action: Record<string, unknown>,
    overrides: {
      playerSlots?: (CardData | null)[];
      npcSlots?: (CardData | null)[];
      playerHp?: number;
      npcHp?: number;
      playerMana?: number;
    } = {}
  ) => {
    if (gameMode !== 'Multiplayer' || !multiplayerGameId || startupPhase !== 'playing') return;
    const mySlotKey   = isP1 ? 'p1_slots' : 'p2_slots';
    const oppSlotsKey = isP1 ? 'p2_slots' : 'p1_slots';
    const myHpKey     = isP1 ? 'p1_hp'    : 'p2_hp';
    const oppHpKey    = isP1 ? 'p2_hp'    : 'p1_hp';
    const myManaKey   = isP1 ? 'p1_mana'  : 'p2_mana';
    updateGameState(multiplayerGameId, {
      [mySlotKey]:   overrides.playerSlots ?? playerSlots,
      [myHpKey]:     overrides.playerHp    ?? playerHp,
      [myManaKey]:   overrides.playerMana  ?? playerMana,
      [oppSlotsKey]: overrides.npcSlots    ?? npcSlots,
      [oppHpKey]:    overrides.npcHp       ?? npcHp,
      last_action: { ...action, action_id: `${Date.now()}_${Math.random()}` },
    } as any).catch(() => {});
  };

  const handleSlotClick = (slotIndex: number) => {
    // ── REPOSITION PHASE ────────────────────────────────────────────────
    if (turnPhase === 'reposition') {
      if (repositionSource === null) {
        // First click: select a card to move (must not have moved yet)
        if (playerSlots[slotIndex] && !movedSlots.has(slotIndex)) {
          setRepositionSource(slotIndex);
          showToast("Selecione o destino para mover a carta.");
        } else if (movedSlots.has(slotIndex)) {
          showToast("Esta carta já se moveu neste turno!");
        }
      } else {
        // Second click: pick destination
        if (slotIndex === repositionSource) {
          // Cancel selection
          setRepositionSource(null);
          return;
        }
        const src = repositionSource;

        // Adjacency check — max 1 square in any direction
        const rowDiff = Math.abs(getRow(src) - getRow(slotIndex));
        const colDiff = Math.abs(getColFull(src) - getColFull(slotIndex));
        if (rowDiff + colDiff !== 1) {
          showToast("Só é possível mover 1 quadrado (sem diagonal)!");
          setRepositionSource(null);
          return;
        }

        const srcCard = playerSlots[src];
        const dstCard = playerSlots[slotIndex];

        if (!srcCard) { setRepositionSource(null); return; }

        const newSlots = [...playerSlots];
        if (dstCard) {
          // Swap — both cards count as moved
          if (movedSlots.has(slotIndex)) {
            showToast("A carta destino já se moveu neste turno!");
            return;
          }
          newSlots[slotIndex] = srcCard;
          newSlots[src] = dstCard;
          setMovedSlots(prev => { const s = new Set(prev); s.add(src); s.add(slotIndex); return s; });
          setSwapAnim({ a: src, b: slotIndex });
          setTimeout(() => setSwapAnim(null), 700);
          showToast("Swap realizado! Ambas as cartas foram movidas.");
        } else {
          // Move to empty slot
          newSlots[slotIndex] = srcCard;
          newSlots[src] = null;
          setMovedSlots(prev => { const s = new Set(prev); s.add(slotIndex); return s; });
          showToast("Carta movida!");
        }
        setPlayerSlots(newSlots);
        pushMultiplayerState({ type: 'reposition' }, { playerSlots: newSlots });
        setRepositionSource(null);
      }
      return;
    }

    // ── COMMAND PHASE: play card from hand ───────────────────────────────
    if (turnPhase === 'command') {
      // ── PENDING EFFECT: ally targeting (equip, heal, hospitalario) ────
      if (pendingEffect && (pendingEffect.mode === 'equip_ally' || pendingEffect.mode === 'target_ally' || pendingEffect.mode === 'general_heal' || pendingEffect.mode === 'hosp_step1')) {
        if (playerSlots[slotIndex]) {
          if (pendingEffect.mode === 'equip_ally') {
            applyEquipToBoardSlot(pendingEffect.card, slotIndex);
            if (pendingEffect.handIndex >= 0) consumeHandCard(pendingEffect.handIndex, pendingEffect.card);
            setSelectedCardIndex(null);
            setPendingEffect(null);
          } else if (pendingEffect.mode === 'general_heal') {
            resolveGeneralAbility(slotIndex, pendingEffect.card.effectKey === 'general_heal_paid');
            setSelectedCardIndex(null);
            setPendingEffect(null);
          } else {
            // Hospitalário step 1: heal ally
            const target = playerSlots[slotIndex];
            if (target) {
              const newSlots = [...playerSlots];
              newSlots[slotIndex] = { ...target, hp: target.hp + 1 };
              if (target.effectKey === 'aprendiz_infantaria') newSlots[slotIndex] = { ...newSlots[slotIndex]!, atk: newSlots[slotIndex]!.atk + 1 };
              setPlayerSlots(newSlots);
              showToast(`Hospitalário: curou 1 HP em ${target.name}!`);
              setPendingEffect({ ...pendingEffect, mode: 'hosp_step2', partialTarget: slotIndex });
              showToast('Agora clique em uma unidade inimiga na Vanguarda para causar 1 de dano!');
            }
          }
          return;
        }
        return;
      }

      if (selectedCardIndex !== null && !playerSlots[slotIndex]) {
        const cardToPlay = hand[selectedCardIndex];

        // Slot-type restrictions: slot 10 = Relíquia only, slot 11 = Terreno only
        if (slotIndex === 10 && cardToPlay.cardType !== 'Relíquia') {
          showToast("Apenas cartas do tipo Relíquia podem ser posicionadas neste slot!");
          return;
        }
        if (slotIndex === 11 && cardToPlay.cardType !== 'Terreno') {
          showToast("Apenas cartas do tipo Terreno podem ser posicionadas neste slot!");
          return;
        }
        if ((slotIndex <= 9 || slotIndex === 12) && (cardToPlay.cardType === 'Relíquia' || cardToPlay.cardType === 'Terreno')) {
          showToast("Esta carta só pode ser posicionada nos slots especiais ao lado do General!");
          return;
        }

        if (playerMana >= cardToPlay.cost) {
          setPlayerMana(prev => prev - cardToPlay.cost);
          const newHand = [...hand];
          newHand.splice(selectedCardIndex, 1);
          setHand(newHand);
          let newSlots = [...playerSlots];
          newSlots[slotIndex] = cardToPlay;
          // On-entry effects
          newSlots = handleOnEntryEffect(cardToPlay, slotIndex, newSlots);
          setPlayerSlots(newSlots);
          pushMultiplayerState({ type: 'play_card', slotIndex, cardName: cardToPlay.name }, { playerSlots: newSlots });
          setJustPlacedSlot(slotIndex);
          setTimeout(() => setJustPlacedSlot(null), 1200);
          setSelectedCardIndex(null);
          setPendingEffect(null);
          setViewState('hand');
        } else {
          showToast("Ouro insuficiente!");
        }
      } else if (selectedCardIndex === null && playerSlots[slotIndex]) {
        // Select attacker (will be used only if we switch to battle phase)
        if (selectedAttackerIndex === slotIndex) {
          setSelectedAttackerIndex(null);
        } else {
          setSelectedAttackerIndex(slotIndex);
        }
      }
      return;
    }

    // ── BATTLE PHASE: select attacker ────────────────────────────────────
    if (turnPhase === 'battle') {
      if (playerSlots[slotIndex]) {
        if (attackedSlots.has(slotIndex)) {
          showToast("Esta carta já atacou neste turno!");
          return;
        }
        const cardType = playerSlots[slotIndex]?.cardType;
        if (cardType === 'Relíquia' || cardType === 'Terreno') {
          showToast("Cartas permanentes não podem atacar!");
          return;
        }
        if (selectedAttackerIndex === slotIndex) {
          setSelectedAttackerIndex(null);
        } else {
          setSelectedAttackerIndex(slotIndex);
        }
      }
    }
  };

  const handleNpcSlotClick = async (slotIndex: number) => {
    // ── PENDING EFFECT: enemy targeting ──────────────────────────────────
    if (pendingEffect && pendingEffect.mode === 'target_enemy' && npcSlots[slotIndex]) {
      resolveSpellEffect(pendingEffect.card, pendingEffect.handIndex, { slot: slotIndex });
      setSelectedCardIndex(null);
      setPendingEffect(null);
      return;
    }
    // Hospitalário step 2: deal 1 damage to enemy front
    if (pendingEffect && pendingEffect.mode === 'hosp_step2' && npcSlots[slotIndex] && isFrontline(slotIndex)) {
      const target = npcSlots[slotIndex]!;
      let newNpc = [...npcSlots];
      newNpc = applyDamageToNpcSlot(slotIndex, 1, newNpc);
      setNpcSlots(newNpc);
      showToast(`Hospitalário: 1 de dano em ${target.name}!`);
      if (newNpc[slotIndex]?.isDestroyed) setTimeout(() => setNpcSlots(prev => prev.map(c => c?.isDestroyed ? null : c)), 800);
      // Mark ability used
      if (pendingEffect.generatorSlot !== undefined) {
        setUnitAbilityUsed(prev => { const s = new Set(prev); s.add(playerSlots[pendingEffect.generatorSlot!]?.id ?? ''); return s; });
      }
      // Only consume from hand if it was actually a hand card (handIndex >= 0)
      if (pendingEffect.handIndex >= 0) consumeHandCard(pendingEffect.handIndex, pendingEffect.card);
      setSelectedCardIndex(null);
      setPendingEffect(null);
      return;
    }

    if (turnPhase !== 'battle') {
      showToast("Você só pode atacar na Fase de Batalha!");
      return;
    }
    if (selectedAttackerIndex !== null && npcSlots[slotIndex] && !isAnimating) {
      if (attackedSlots.has(selectedAttackerIndex)) {
        showToast("Esta carta já atacou neste turno!");
        return;
      }
      
      const validTargets = getValidAttackTargets(selectedAttackerIndex, playerSlots, npcSlots);
      if (!validTargets.has(slotIndex)) {
        showToast("Invalid target! Blocked or out of range.");
        return;
      }

      setIsAnimating(true);
      
      const attackerEl = document.getElementById(`player_slot_${selectedAttackerIndex}`);
      const defenderEl = document.getElementById(`npc_slot_${slotIndex}`);
      
      let deltaX = 0;
      let deltaY = -450;
      
      if (attackerEl && defenderEl) {
        const aRect = attackerEl.getBoundingClientRect();
        const dRect = defenderEl.getBoundingClientRect();
        deltaX = dRect.left - aRect.left;
        deltaY = dRect.top - aRect.top;
      }

      audio.playAttack();
        setAttackAnim({ 
        attackerIndex: selectedAttackerIndex, 
        targetIndex: slotIndex, 
        isPlayerAttacking: true, 
        deltaX, 
        deltaY 
      });

      // Wait for card to travel to target
      await new Promise(resolve => setTimeout(resolve, 350));
      setIsImpacting(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsImpacting(false);
      // Wait for card to snap back
      await new Promise(resolve => setTimeout(resolve, 380));

      const attacker = playerSlots[selectedAttackerIndex];
      const defender = npcSlots[slotIndex];
      const attackerIdx = selectedAttackerIndex;
      
      if (attacker && defender) {
        const effectiveAtk = getEffectiveAtk(attacker, attackerIdx, npcSlots[12] ?? null);
        const updatedAttacker = { ...attacker, hp: attacker.hp - defender.atk };
        const updatedDefender = { ...defender, hp: defender.hp - effectiveAtk };
        
        const newPlayerSlots = [...playerSlots];
        const newNpcSlots = [...npcSlots];
        
        let hasDestroyed = false;

        if (updatedAttacker.hp <= 0) {
           newPlayerSlots[attackerIdx] = { ...updatedAttacker, isDestroyed: true };
           hasDestroyed = true;
           // Death effect: Atirador Influente draws 3
           if (updatedAttacker.effectKey === 'atirador_influente') {
             const pool = getActiveDeckPool();
             const draws = Array.from({ length: 3 }, () => ({ ...pool[Math.floor(Math.random() * pool.length)], id: `draw_ai_${Date.now()}_${Math.random()}` }));
             setHand(prev => [...prev, ...draws]);
             showToast('Atirador Influente: compre 3 cartas!');
           }
           setGraveyard(prev => [...prev, updatedAttacker]);
        } else {
           newPlayerSlots[attackerIdx] = updatedAttacker;
        }

        if (updatedDefender.hp <= 0) {
           newNpcSlots[slotIndex] = { ...updatedDefender, isDestroyed: true };
           hasDestroyed = true;
           setGraveyard(prev => [...prev, updatedDefender]);
        } else {
           newNpcSlots[slotIndex] = updatedDefender;
        }

        // Jorge, o Lanceiro: pierce 2 damage to backline in same column
        if (attacker.effectKey === 'jorge_lanceiro' && slotIndex <= 4) {
          const backlineSlot = slotIndex + 5;
          const backlineCard = newNpcSlots[backlineSlot];
          if (backlineCard && backlineCard.cardType !== 'General') {
            const pierced = { ...backlineCard, hp: backlineCard.hp - 2 };
            newNpcSlots[backlineSlot] = pierced.hp <= 0 ? { ...pierced, isDestroyed: true } : pierced;
            if (pierced.hp <= 0) { hasDestroyed = true; setGraveyard(prev => [...prev, pierced]); }
            showToast('Jorge, o Lanceiro: 2 de dano na Retaguarda!');
          }
        }
        
        setPlayerSlots(newPlayerSlots);
        setNpcSlots(newNpcSlots);
        setSelectedAttackerIndex(null);
        setAttackAnim(null);

        // Double-attack (Arqueiro Profissional): only exhaust when maxAtksPerTurn reached
        const maxAtks = attacker.maxAtksPerTurn ?? 1;
        const newCount = (attackCountThisTurn[attackerIdx] ?? 0) + 1;
        setAttackCountThisTurn(prev => ({ ...prev, [attackerIdx]: newCount }));
        if (newCount >= maxAtks) {
          setAttackedSlots(prev => { const s = new Set(prev); s.add(attackerIdx); return s; });
        }

        if (hasDestroyed) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const cleanPlayerSlots = newPlayerSlots.map(c => c?.isDestroyed ? null : c);
          const cleanNpcSlots = newNpcSlots.map(c => c?.isDestroyed ? null : c);
          setPlayerSlots(cleanPlayerSlots);
          setNpcSlots(cleanNpcSlots);
          pushMultiplayerState(
            { type: 'attack_slot', attackerIndex: attackerIdx, targetIndex: slotIndex },
            { playerSlots: cleanPlayerSlots, npcSlots: cleanNpcSlots }
          );
        } else {
          pushMultiplayerState(
            { type: 'attack_slot', attackerIndex: attackerIdx, targetIndex: slotIndex },
            { playerSlots: newPlayerSlots, npcSlots: newNpcSlots }
          );
        }
      }
      setIsAnimating(false);
    }
  };

  const handlePlayerClassSlotClick = () => {
    if (selectedCardIndex !== null && !playerClassCard) {
      const cardToPlay = hand[selectedCardIndex];
      if (playerMana >= cardToPlay.cost) {
        setPlayerMana(prev => prev - cardToPlay.cost);
        const newHand = [...hand];
        newHand.splice(selectedCardIndex, 1);
        setHand(newHand);
        setPlayerClassCard(cardToPlay);
        setSelectedCardIndex(null);
        setViewState('hand');
      } else {
        showToast("Not enough mana!");
      }
    }
  };

  const handleNpcAvatarClick = async () => {
    if (turnPhase !== 'battle') {
      showToast("Você só pode atacar na Fase de Batalha!");
      return;
    }
    if (selectedAttackerIndex !== null && !isAnimating) {
      if (attackedSlots.has(selectedAttackerIndex)) {
        showToast("Esta carta já atacou neste turno!");
        return;
      }
      const validTargets = getValidAttackTargets(selectedAttackerIndex, playerSlots, npcSlots);
      if (!validTargets.has('avatar')) {
        showToast("Alvo inválido! Bloqueado ou fora de alcance.");
        return;
      }

      setIsAnimating(true);
      
      const attackerEl = document.getElementById(`player_slot_${selectedAttackerIndex}`);
      const defenderEl = document.getElementById(`npc_avatar`);
      
      let deltaX = 0;
      let deltaY = -600;
      
      if (attackerEl && defenderEl) {
        const aRect = attackerEl.getBoundingClientRect();
        const dRect = defenderEl.getBoundingClientRect();
        deltaX = dRect.left - aRect.left + (dRect.width / 2) - (aRect.width / 2);
        deltaY = dRect.top - aRect.top + (dRect.height / 2) - (aRect.height / 2);
      }

      audio.playAttack();
        setAttackAnim({ 
        attackerIndex: selectedAttackerIndex, 
        targetIndex: 'avatar', 
        isPlayerAttacking: true,
        deltaX,
        deltaY
      });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setIsImpacting(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsImpacting(false);
      await new Promise(resolve => setTimeout(resolve, 380));
      
      const attacker = playerSlots[selectedAttackerIndex];
      if (attacker) {
        const newNpcHpVal = Math.max(0, npcHp - attacker.atk);
        setNpcHp(newNpcHpVal);
        const attackerIdx = selectedAttackerIndex;
        setSelectedAttackerIndex(null);
        setAttackAnim(null);
        setAttackedSlots(prev => { const s = new Set(prev); s.add(attackerIdx); return s; });
        pushMultiplayerState(
          { type: 'attack_avatar', attackerIndex: attackerIdx },
          { npcHp: newNpcHpVal }
        );
      }
      setIsAnimating(false);
    }
  };

  const handleBackgroundClick = () => {
    if (turnPhase === 'battle') return;
    if (viewState === 'field') {
      setSelectedCardIndex(null);
      setViewState('hand');
    }
  };

  const getSelectedCardX = (index: number) => {
    const cardWidth = 224; // w-56 = 14rem = 224px
    const gap = isMobile ? 8 : 12; 
    const totalWidth = hand.length * cardWidth + (hand.length - 1) * gap;
    const startX = -totalWidth / 2 + cardWidth / 2;
    const cardX = startX + index * (cardWidth + gap);
    // On mobile move to bottom right, on desktop move it to the left to see the board
    const targetX = isMobile ? (windowSize.width / 2 - 120) : (300 - windowSize.width / 2);
    return targetX - cardX;
  };

  const getBoardAnimation = () => {
    const baseAnim = {
      // Menor inclinação para ficar bem flat e estender o campo de forma que acompanhe as cartas na base
      rotateX: viewState === 'draw' ? 25 : (isMobile ? 32 : 38),
      rotateZ: viewState === 'draw' ? -5 : 0,
      // Deslocado para que o centro do campo fique bem visível acima da mão
      y: viewState === 'draw' ? -400 : (isMobile ? -windowSize.height * 0.15 : -100),
      x: viewState === 'draw' ? -350 : 0,
      z: viewState === 'draw' ? 300 : (isMobile ? -200 : -250),
      // Scale reduzido um pouco mais para caber a mão + campo confortavelmente em telas menores
      scale: viewState === 'draw' ? 1.1 * boardScale : (isMobile ? 1.05 : 0.72) * boardScale,
    };

    if (attackAnim) {
      const isPlayer = attackAnim.isPlayerAttacking;
      // Câmera — jogador ataca: zoom frontal; NPC ataca: foca no topo do campo
      // O zoom agora é calculado em cima da base scale
      const targetRotateX = isPlayer ? baseAnim.rotateX - 30 : 15;
      const targetY      = isPlayer ? baseAnim.y + (isMobile ? 220 : 320) : (isMobile ? 120 : 350);
      const targetZ      = isPlayer ? baseAnim.z + (isMobile ? 350 : 450) : baseAnim.z + 100;
      const targetScale  = baseAnim.scale * (isPlayer ? (isMobile ? 1.4 : 1.6) : 1.4);
      if (isImpacting) {
        return {
          ...baseAnim,
          // Efeito de shakecam intenso durante o impacto
          rotateX: [targetRotateX, targetRotateX + 12, targetRotateX - 10, targetRotateX + 8, targetRotateX - 6, targetRotateX],
          rotateZ: [baseAnim.rotateZ, baseAnim.rotateZ - 10, baseAnim.rotateZ + 10, baseAnim.rotateZ - 6, baseAnim.rotateZ + 6, baseAnim.rotateZ],
          x: [baseAnim.x, baseAnim.x - 60, baseAnim.x + 60, baseAnim.x - 30, baseAnim.x + 30, baseAnim.x],
          y: [targetY, targetY - 40, targetY + 40, targetY - 20, targetY + 20, targetY],
          z: [targetZ, targetZ + 120, targetZ, targetZ + 60, targetZ, targetZ],
          scale: [targetScale, targetScale * 1.15, targetScale * 0.9, targetScale * 1.05, targetScale],
          transition: { duration: 0.5, ease: "easeOut" }
        };
      }

      return {
        ...baseAnim,
        rotateX: targetRotateX,
        y: targetY,
        z: targetZ,
        scale: targetScale,
        transition: { duration: 0.5, ease: "easeInOut" }
      };
    }

    return baseAnim;
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center touch-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-zinc-950 to-black"
      style={{ perspective: '1200px' }}
      onClick={handleBackgroundClick}
    >
      {/* ── CENÁRIO DE FUNDO ── */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-50"
        style={{ 
          // Nova imagem de fundo medieval/fantasia de alta qualidade (Castelo/Ruínas na névoa)
          backgroundImage: 'url("https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=2560")',
          filter: 'contrast(1.2) saturate(1.1)'
        }}
      />
      {/* Background ambient light / Vinheta escura para manter foco no tabuleiro */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,15,10,0.3)_0%,rgba(0,0,0,0.95)_90%)] pointer-events-none" />

      {startupPhase === 'jokenpo' && (() => {
        const ICONS: Record<string, string> = { pedra: '✊', papel: '🖐️', tesoura: '✌️' };
        const LABELS: Record<string, string> = { pedra: 'Pedra', papel: 'Papel', tesoura: 'Tesoura' };
        const resultColor = jokenpoResult === 'win' ? 'text-green-400' : jokenpoResult === 'lose' ? 'text-red-400' : 'text-yellow-300';
        const resultMsg = jokenpoResult === 'win' ? '⚔️ Vitória! Você começa primeiro!' : jokenpoResult === 'lose' ? '⚡ Derrota! Oponente começa primeiro!' : '🔄 Empate! Tentem novamente.';
        return (
          <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.2, 0.85, 0.4, 1] }}
              className="flex flex-col items-center gap-8 w-full max-w-2xl px-6"
            >
              {/* Title */}
              <div className="text-center">
                <p className="text-[#8c7a5f] text-xs uppercase tracking-[0.3em] mb-1">Pedra, Papel ou Tesoura</p>
                <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#f0d060] to-[#a06010] uppercase tracking-widest drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">Quem Começa?</h2>
              </div>

              {/* VS Panel — shows after choice */}
              {jokenpoPhase !== 'choosing' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex items-center justify-center gap-4 md:gap-8"
                >
                  {/* Player side */}
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <p className="text-[#8c7a5f] text-xs uppercase tracking-widest">Você</p>
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 flex flex-col items-center justify-center gap-1
                        ${ jokenpoResult === 'win' ? 'border-green-400 bg-green-900/40 shadow-[0_0_30px_rgba(74,222,128,0.5)]'
                         : jokenpoResult === 'lose' ? 'border-red-500 bg-red-900/30'
                         : jokenpoResult === 'draw' ? 'border-yellow-400 bg-yellow-900/30'
                         : 'border-[#d4af37] bg-[#2a1a0f]'}`}
                    >
                      <span className="text-4xl md:text-5xl">{ICONS[jokenpoChoice!]}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">{LABELS[jokenpoChoice!]}</span>
                    </motion.div>
                  </div>

                  {/* VS */}
                  <div className="shrink-0 flex flex-col items-center">
                    <span className="text-[#5a4030] font-black text-3xl tracking-widest">VS</span>
                  </div>

                  {/* NPC side */}
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <p className="text-[#8c7a5f] text-xs uppercase tracking-widest">Oponente</p>
                    {jokenpoPhase === 'revealing' ? (
                      <motion.div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-[#8c7a5f]/40 bg-[#1a0f0a] flex items-center justify-center">
                        <motion.span
                          className="text-4xl"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 0.4, repeat: Infinity }}
                        >❓</motion.span>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 flex flex-col items-center justify-center gap-1
                          ${ jokenpoResult === 'lose' ? 'border-green-400 bg-green-900/40 shadow-[0_0_30px_rgba(74,222,128,0.5)]'
                           : jokenpoResult === 'win' ? 'border-red-500 bg-red-900/30'
                           : jokenpoResult === 'draw' ? 'border-yellow-400 bg-yellow-900/30'
                           : 'border-[#d4af37] bg-[#2a1a0f]'}`}
                      >
                        <span className="text-4xl md:text-5xl">{ICONS[jokenpoNpcChoice!]}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">{LABELS[jokenpoNpcChoice!]}</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Result banner */}
              <AnimatePresence>
                {jokenpoResult && (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className={`text-2xl md:text-3xl font-black text-center tracking-wide ${resultColor}`}
                    style={{ textShadow: '0 0 20px currentColor' }}
                  >
                    {resultMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Choice buttons — only shown when choosing */}
              {jokenpoPhase === 'choosing' && (
                <div className="flex gap-4 md:gap-6">
                  {(['pedra', 'papel', 'tesoura'] as const).map((c) => (
                    <motion.button
                      key={c}
                      whileHover={{ scale: 1.1, y: -6 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJokenpo(c)}
                      className="w-28 h-28 md:w-36 md:h-36 rounded-2xl flex flex-col items-center justify-center gap-2 bg-[#1e1208] border-2 border-[#8c7a5f]/50 hover:border-[#d4af37] hover:bg-[#2a1a0f] hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-all duration-200"
                    >
                      <span className="text-4xl md:text-5xl">{ICONS[c]}</span>
                      <span className="text-xs font-black uppercase tracking-widest text-[#8c7a5f]">{LABELS[c]}</span>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        );
      })()}

      {/* 3D Board */}
      <motion.div
        className="w-[1400px] md:w-[1600px] h-[1800px] md:h-[2650px] grid grid-rows-2 gap-[10rem] md:gap-[16rem] p-12 relative"
        animate={getBoardAnimation()}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        onClick={(e) => {
          e.stopPropagation();
          if (selectedCardIndex !== null) {
            setSelectedCardIndex(null);
            if (turnPhase !== 'battle') setViewState('hand');
          }
          if (selectedAttackerIndex !== null) {
            setSelectedAttackerIndex(null);
          }
        }}
      >
        {/* NOVA MESA DE TABULEIRO - MAGICAL NEON GRID */}
        <div
          className="absolute inset-0 rounded-[4rem] pointer-events-none overflow-hidden bg-black border-[4px] border-[#d4af37]/40 shadow-[0_0_120px_rgba(212,175,55,0.15)]"
          style={{ transform: 'translateZ(-1px)' }}
        >
          {/* Fundo Estelar Mágico e Nebulosa */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,20,10,1)_0%,rgba(0,0,0,1)_80%)]" />
          <div className="absolute inset-0 opacity-[0.25] mix-blend-screen" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop")', backgroundSize: 'cover' }} />

          {/* Grid Cibernético / Etéreo */}
          <div 
             className="absolute inset-0 opacity-40" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(212,175,55,0.2) 2px, transparent 2px), linear-gradient(90deg, rgba(212,175,55,0.2) 2px, transparent 2px)', 
               backgroundSize: '150px 150px',
               transform: 'perspective(500px) rotateX(20deg) scale(1.5)',
               transformOrigin: 'top center'
             }} 
          />

          {/* Luzes Radiantes Douradas - Zonas de Batalha (Player e NPC) */}
          <div className="absolute top-[20%] left-1/4 right-1/4 h-[30%] bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.1)_0%,transparent_70%)] blur-2xl" />
          <div className="absolute bottom-[20%] left-1/4 right-1/4 h-[30%] bg-[radial-gradient(ellipse_at_center,rgba(0,100,255,0.1)_0%,transparent_70%)] blur-2xl" />

          {/* Central Divider - Linha de Colisão Mágica */}
          <div className="absolute top-1/2 left-0 right-0 z-0 h-[4px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_30px_rgba(212,175,55,1)] -translate-y-1/2">
             {/* Efeito Pulsante no Centro */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#d4af37] opacity-20 blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
             <div className="absolute w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/80 to-transparent shadow-[0_0_10px_rgba(212,175,55,0.8)] -translate-y-[15px] left-1/2 -translate-x-1/2" />
             <div className="absolute w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/80 to-transparent shadow-[0_0_10px_rgba(212,175,55,0.8)] translate-y-[15px] left-1/2 -translate-x-1/2" />
          </div>

          {/* Runas Elegantes Flutuantes e Contorno da Mesa */}
          <div className="absolute inset-6 border-[2px] border-[#d4af37]/20 rounded-3xl" />
          <div className="absolute inset-10 border-[1px] border-[#d4af37]/10 rounded-2xl" />
          <div className="absolute top-12 left-12 text-[#d4af37]/60 text-4xl drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] font-serif">A</div>
          <div className="absolute bottom-12 right-12 text-[#d4af37]/60 text-4xl drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] font-serif">Ω</div>
        </div>
        
        {/* O Divider antigo será removido já que integramos ele de forma mais mágica diretamente na base visual acima */}
          
          {/* NPC Field */}
          <div className="flex flex-col gap-10 md:gap-14 justify-start pt-4 pointer-events-auto">
            {/* Row 3 NPC (Back Row) */}
            <div className="grid grid-cols-5 gap-x-12 md:gap-x-16 gap-y-8 justify-center items-center w-full justify-items-center">
              
              {/* NPC AVATAR */}
              <div id="npc_avatar" className="col-start-3 row-start-1 relative" style={{ zIndex: 10 }}>
                <CardSlot
                  slotId="npc_slot_12"
                  card={npcSlots[12]}
                  onClick={() => handleNpcSlotClick(12)}
                  onMouseEnter={() => setHoveredBoardSlot({ type: 'npc', index: 12 })}
                  onMouseLeave={() => setHoveredBoardSlot(null)}
                  isHovered={hoveredBoardSlot?.type === 'npc' && hoveredBoardSlot.index === 12}
                  onInfoClick={setDetailedCard}
                  isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 12}
                  isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === 12}
                  attackDirection="down"
                  isNpcCard={true}
                  isJustPlaced={justPlacedNpcSlot === 12}
                  attackDeltaX={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 12 ? (attackAnim.deltaX ?? 0) : 0}
                  attackDeltaY={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 12 ? (attackAnim.deltaY ?? 450) : 450}
                  isValidTarget={validTargets.has(12)}
                />
                <HpBadge value={npcHp} className="absolute -top-4 -right-4 w-10 h-10 md:w-14 md:h-14 text-lg md:text-2xl z-20 pointer-events-none" />
                <ManaBadge value={npcMana} className="absolute -top-4 -left-4 w-10 h-10 md:w-14 md:h-14 text-lg md:text-2xl z-20 pointer-events-none" />
                {gameMode === 'Multiplayer' && opponentUsername && (
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/70 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-red-300 border border-red-700/40 pointer-events-none">
                    {opponentUsername}
                  </div>
                )}
              </div>

              <div className="col-start-2">
                <CardSlot
                slotId="npc_slot_10"
                card={npcSlots[10]}
                onClick={() => handleNpcSlotClick(10)}
                onMouseEnter={() => setHoveredBoardSlot({ type: 'npc', index: 10 })}
                onMouseLeave={() => setHoveredBoardSlot(null)}
                isHovered={hoveredBoardSlot?.type === 'npc' && hoveredBoardSlot.index === 10}
                onInfoClick={setDetailedCard}
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 10}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === 10}
                attackDirection="down"
                isNpcCard={true}
                isJustPlaced={justPlacedNpcSlot === 10}
                attackDeltaX={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 10 ? (attackAnim.deltaX ?? 0) : 0}
                attackDeltaY={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 10 ? (attackAnim.deltaY ?? 450) : 450}
                isValidTarget={validTargets.has(10)}
                />
              </div>
            <div className="col-start-4">
              <CardSlot 
              slotId="npc_slot_11"
              card={npcSlots[11]} 
              onClick={() => handleNpcSlotClick(11)} 
              onMouseEnter={() => setHoveredBoardSlot({ type: 'npc', index: 11 })}
              onMouseLeave={() => setHoveredBoardSlot(null)}
              isHovered={hoveredBoardSlot?.type === 'npc' && hoveredBoardSlot.index === 11}
              onInfoClick={setDetailedCard} 
              isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 11}
              isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === 11}
              attackDirection="down"
              isNpcCard={true}
              isJustPlaced={justPlacedNpcSlot === 11}
              attackDeltaX={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 11 ? (attackAnim.deltaX ?? 0) : 0}
              attackDeltaY={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 11 ? (attackAnim.deltaY ?? 450) : 450}
              isValidTarget={validTargets.has(11)}
              isInvalidTarget={selectedAttackerIndex !== null && !validTargets.has(11) && !!npcSlots[11]}
            />
            </div>
          </div>
          {/* Row 2 NPC (Middle Row) */}
          <div className="grid grid-cols-5 gap-x-12 md:gap-x-16 gap-y-8 justify-center items-center w-full justify-items-center">
            {[5, 6, 7, 8, 9].map((i) => (
              <CardSlot 
                key={i}
                slotId={`npc_slot_${i}`}
                card={npcSlots[i]} 
                onClick={() => handleNpcSlotClick(i)} 
                onMouseEnter={() => setHoveredBoardSlot({ type: 'npc', index: i })}
                onMouseLeave={() => setHoveredBoardSlot(null)}
                isHovered={hoveredBoardSlot?.type === 'npc' && hoveredBoardSlot.index === i}
                onInfoClick={setDetailedCard} 
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === i}
                attackDirection="down"
                isNpcCard={true}
                isJustPlaced={justPlacedNpcSlot === i}
                attackDeltaX={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i ? (attackAnim.deltaX ?? 0) : 0}
                attackDeltaY={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i ? (attackAnim.deltaY ?? 450) : 450}
                isValidTarget={validTargets.has(i)}
                isInvalidTarget={selectedAttackerIndex !== null && !validTargets.has(i) && !!npcSlots[i]}
              />
            ))}
          </div>
          {/* Row 1 NPC (Front Row) */}
          <div className="grid grid-cols-5 gap-x-12 md:gap-x-16 gap-y-8 justify-center items-center w-full justify-items-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <CardSlot 
                key={i}
                slotId={`npc_slot_${i}`}
                card={npcSlots[i]} 
                onClick={() => handleNpcSlotClick(i)} 
                onMouseEnter={() => setHoveredBoardSlot({ type: 'npc', index: i })}
                onMouseLeave={() => setHoveredBoardSlot(null)}
                isHovered={hoveredBoardSlot?.type === 'npc' && hoveredBoardSlot.index === i}
                onInfoClick={setDetailedCard} 
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === i}
                attackDirection="down"
                isNpcCard={true}
                isJustPlaced={justPlacedNpcSlot === i}
                attackDeltaX={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i ? (attackAnim.deltaX ?? 0) : 0}
                attackDeltaY={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i ? (attackAnim.deltaY ?? 450) : 450}
                isValidTarget={validTargets.has(i)}
                isInvalidTarget={selectedAttackerIndex !== null && !validTargets.has(i) && !!npcSlots[i]}
              />
            ))}
          </div>
        </div>

        {/* Player Field */}
        <div className="flex flex-col gap-10 md:gap-14 justify-end pb-4 pointer-events-auto">
          {/* Row 1 Player (Front Row) */}
          <div className="grid grid-cols-5 gap-x-12 md:gap-x-16 gap-y-8 justify-center items-center w-full justify-items-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <CardSlot 
                key={i}
                slotId={`player_slot_${i}`}
                card={playerSlots[i]} 
                onClick={() => handleSlotClick(i)} 
                onMouseEnter={() => setHoveredBoardSlot({ type: 'player', index: i })}
                onMouseLeave={() => setHoveredBoardSlot(null)}
                isHovered={(hoveredBoardSlot?.type === 'player' && hoveredBoardSlot.index === i) || (selectedAttackerIndex === i && hoveredBoardSlot?.type === 'npc')}
                isSelected={selectedAttackerIndex === i} 
                onInfoClick={setDetailedCard} 
                isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i}
                attackDeltaX={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i ? (attackAnim.deltaX ?? 0) : 0}
                attackDeltaY={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i ? (attackAnim.deltaY ?? -450) : -450}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === i}
                attackDirection="up"
                isRepositionSource={repositionSource === i}
                isAttackExhausted={turnPhase === 'battle' && attackedSlots.has(i)}
                isSwapping={swapAnim !== null && (swapAnim.a === i || swapAnim.b === i)}
                swapFromX={getSwapFrom(i).x}
                swapFromY={getSwapFrom(i).y}
                isValidRepositionTarget={validRepositionTargets.has(i)}
                isJustPlaced={justPlacedSlot === i}
              />
            ))}
          </div>
          {/* Row 2 Player (Middle Row) */}
          <div className="grid grid-cols-5 gap-x-12 md:gap-x-16 gap-y-8 justify-center items-center w-full justify-items-center">
            {[5, 6, 7, 8, 9].map((i) => (
              <CardSlot 
                key={i}
                slotId={`player_slot_${i}`}
                card={playerSlots[i]} 
                onClick={() => handleSlotClick(i)} 
                onMouseEnter={() => setHoveredBoardSlot({ type: 'player', index: i })}
                onMouseLeave={() => setHoveredBoardSlot(null)}
                isHovered={(hoveredBoardSlot?.type === 'player' && hoveredBoardSlot.index === i) || (selectedAttackerIndex === i && hoveredBoardSlot?.type === 'npc')}
                isSelected={selectedAttackerIndex === i} 
                onInfoClick={setDetailedCard} 
                isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i}
                attackDeltaX={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i ? (attackAnim.deltaX ?? 0) : 0}
                attackDeltaY={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i ? (attackAnim.deltaY ?? -450) : -450}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === i}
                attackDirection="up"
                isRepositionSource={repositionSource === i}
                isAttackExhausted={turnPhase === 'battle' && attackedSlots.has(i)}
                isSwapping={swapAnim !== null && (swapAnim.a === i || swapAnim.b === i)}
                swapFromX={getSwapFrom(i).x}
                swapFromY={getSwapFrom(i).y}
                isValidRepositionTarget={validRepositionTargets.has(i)}
                isJustPlaced={justPlacedSlot === i}
              />
            ))}
          </div>
          {/* Row 3 Player (Back Row) */}
          <div className="grid grid-cols-5 gap-x-12 md:gap-x-16 gap-y-8 justify-center items-center w-full justify-items-center">
            <div className="col-start-2">
              <CardSlot 
              slotId="player_slot_10"
              card={playerSlots[10]} 
              onClick={() => handleSlotClick(10)} 
              onMouseEnter={() => setHoveredBoardSlot({ type: 'player', index: 10 })}
              onMouseLeave={() => setHoveredBoardSlot(null)}
              isHovered={(hoveredBoardSlot?.type === 'player' && hoveredBoardSlot.index === 10) || (selectedAttackerIndex === 10 && hoveredBoardSlot?.type === 'npc')}
              isSelected={selectedAttackerIndex === 10} 
              onInfoClick={setDetailedCard} 
              isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 10}
              attackDeltaX={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 10 ? (attackAnim.deltaX ?? 0) : 0}
              attackDeltaY={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 10 ? (attackAnim.deltaY ?? -450) : -450}
              isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 10}
              attackDirection="up"
              isRepositionSource={repositionSource === 10}
              isAttackExhausted={turnPhase === 'battle' && attackedSlots.has(10)}
              isSwapping={swapAnim !== null && (swapAnim.a === 10 || swapAnim.b === 10)}
              swapFromX={getSwapFrom(10).x}
              swapFromY={getSwapFrom(10).y}
              isJustPlaced={justPlacedSlot === 10}
            />
            </div>
            <div className="col-start-3">
              <div
                id="player_avatar"
                className="relative cursor-pointer pointer-events-auto"
              >
                  <CardSlot
                    slotId="player_slot_12"
                    card={playerSlots[12]}
                    onClick={() => handleSlotClick(12)}
                    onMouseEnter={() => setHoveredBoardSlot({ type: 'player', index: 12 })}
                    onMouseLeave={() => setHoveredBoardSlot(null)}
                    isHovered={(hoveredBoardSlot?.type === 'player' && hoveredBoardSlot.index === 12) || (selectedAttackerIndex === 12 && hoveredBoardSlot?.type === 'npc')}
                    isSelected={selectedAttackerIndex === 12}
                    onInfoClick={setDetailedCard}
                    isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 12}
                    attackDeltaX={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 12 ? (attackAnim.deltaX ?? 0) : 0}
                    attackDeltaY={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 12 ? (attackAnim.deltaY ?? -450) : -450}
                    isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 12}
                    attackDirection="up"
                    isRepositionSource={repositionSource === 12}
                    isAttackExhausted={turnPhase === 'battle' && attackedSlots.has(12)}
                    isSwapping={swapAnim !== null && (swapAnim.a === 12 || swapAnim.b === 12)}
                    swapFromX={getSwapFrom(12).x}
                    swapFromY={getSwapFrom(12).y}
                    isValidRepositionTarget={validRepositionTargets.has(12)}
                  />
                  {!playerSlots[12] && (
                    <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-[#8c7a5f]/60 bg-black/30 flex flex-col items-center justify-center gap-1 z-0">
                      <Shield className="w-5 h-5 text-blue-400/50" />
                      <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-widest text-blue-300/50">Classe</span>
                    </div>
                  )}
                  {isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 'avatar' && <SlashEffect />}

                <HpBadge value={playerHp} className="absolute -bottom-4 -right-4 w-10 h-10 md:w-14 md:h-14 text-lg md:text-2xl z-20 pointer-events-none" />
                <ManaBadge value={playerMana} className="absolute -bottom-4 -left-4 w-10 h-10 md:w-14 md:h-14 text-lg md:text-2xl z-20 pointer-events-none" />
              </div>
              </div>
              <div className="col-start-4">
              <CardSlot 
              slotId="player_slot_11"
              card={playerSlots[11]} 
              onClick={() => handleSlotClick(11)} 
              onMouseEnter={() => setHoveredBoardSlot({ type: 'player', index: 11 })}
              onMouseLeave={() => setHoveredBoardSlot(null)}
              isHovered={(hoveredBoardSlot?.type === 'player' && hoveredBoardSlot.index === 11) || (selectedAttackerIndex === 11 && hoveredBoardSlot?.type === 'npc')}
              isSelected={selectedAttackerIndex === 11} 
              onInfoClick={setDetailedCard}  
              isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 11}
              attackDeltaX={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 11 ? (attackAnim.deltaX ?? 0) : 0}
              attackDeltaY={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 11 ? (attackAnim.deltaY ?? -450) : -450}
              isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 11}
              attackDirection="up"
              isRepositionSource={repositionSource === 11}
              isAttackExhausted={turnPhase === 'battle' && attackedSlots.has(11)}
              isSwapping={swapAnim !== null && (swapAnim.a === 11 || swapAnim.b === 11)}
              swapFromX={getSwapFrom(11).x}
              swapFromY={getSwapFrom(11).y}
              isJustPlaced={justPlacedSlot === 11}
            />
          </div>
        </div>
        </div><div className="absolute -right-40 md:-right-64 top-12 flex flex-col gap-6 items-center z-40 pointer-events-none">
          {/* Deck */}
          <div className="h-48 md:h-[290px] aspect-[905/1287] rounded-lg shadow-[0_15px_35px_rgba(0,0,0,0.7),0_0_30px_rgba(212,175,55,0.2)] relative" style={{ perspective: '1000px', transform: 'rotateX(180deg)' }}>
            <div className="absolute inset-0 translate-x-[1px] translate-y-[1px] bg-[#1a0b00] rounded-lg -z-10 shadow-[1px_1px_3px_rgba(0,0,0,0.8)]" />
            <div className="absolute inset-0 translate-x-[2px] translate-y-[2px] bg-[#2a1b0c] rounded-lg -z-20 shadow-[2px_2px_5px_rgba(0,0,0,0.7)]" />
            <div className="absolute inset-0 translate-x-[3px] translate-y-[3px] bg-[#3a2b1c] rounded-lg -z-30 shadow-[3px_3px_7px_rgba(0,0,0,0.6)]" />
            <div className="absolute inset-0 translate-x-[4px] translate-y-[4px] bg-[#4a3b2c] rounded-lg -z-40 shadow-[4px_4px_10px_rgba(0,0,0,0.5)]" />
            <img src={backplateImg} alt="Card Back" className="w-full h-full object-contain scale-[1.12] drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]" />
          </div>
          {/* Graveyard */}
          <div className="h-48 md:h-[290px] aspect-[905/1287] rounded-lg bg-black/40 flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.8)] border border-zinc-500/20">
            <span className="text-zinc-600 font-mono text-[8px] md:text-[10px] uppercase tracking-widest rotate-90 opacity-40">Cemitério</span>
          </div>
        </div>
      </motion.div>

      <div className="absolute -top-[6rem] md:-top-[9rem] inset-x-0 w-full flex flex-col justify-center items-center pointer-events-none z-[100] gap-2">
        <div className="flex -space-x-12 md:-space-x-16">
          {npcHand.map((card, i) => {
            const mid = (npcHand.length - 1) / 2;
            const offset = i - mid;
            return (
            <motion.div
              key={`npc-hand-${card.id}`}
              className="h-36 md:h-48 aspect-[905/1287] shrink-0 relative"
              style={{
                transformOrigin: 'center bottom',
                y: Math.abs(offset) * 3,
                rotateZ: offset * -6 // espelhado para fa inverso ou igual
              }}
              initial={{ y: -150, opacity: 0, rotateZ: offset * -6 }}
              animate={{ y: Math.abs(offset) * 3, opacity: 1, rotateZ: offset * -6 }}
              transition={{ duration: 0.55, ease: [0.2, 0.85, 0.4, 1] }}
            >
              {/* inner float loop */}
              <motion.div
                className="w-full h-full"
                animate={{ y: [0, 5, 0] }}
                transition={{ y: { duration: 3 + i * 0.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.22 } }}
              >
                <img src={backplateImg} alt="Card Back" className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl scale-[1.12] rotate-180" />
              </motion.div>
            </motion.div>
          )})}
        </div>
        {npcHand.length > 0 && (
          <div className="bg-black/80 px-3 py-1 rounded-full text-xs font-bold text-red-500 border border-red-900/50 shadow-[0_0_10px_rgba(255,0,0,0.3)] pointer-events-auto">
            {npcHand.length} CARTAS
          </div>
        )}
      </div>

      {/* Hand UI */}
      <motion.div 
        className="absolute inset-0 w-full h-full flex justify-center items-end pb-0 pointer-events-none z-50"
        animate={{
          y: isMobile ? 20 : 0
        }}
      >
        <div className="flex gap-4 justify-center flex-1 mx-auto relative h-[260px]">
          <AnimatePresence>
            {hand.map((card, i) => {
              const mid = (hand.length - 1) / 2;
              const offset = i - mid;
              
              return (
              <motion.div
                layoutId={card.id}
                key={card.id}
                ref={(el) => { handCardRefs.current[i] = el as HTMLElement | null; }}
                className={`absolute bottom-0 h-[220px] md:h-[260px] aspect-[905/1287] shrink-0 bg-transparent rounded-xl flex flex-col group border-0 pointer-events-auto ${selectedCardIndex === i ? 'cursor-default' : 'cursor-pointer'}`}
                style={{ 
                  transformOrigin: 'center bottom',
                  zIndex: selectedCardIndex === i ? 200 : (hand.length - Math.abs(offset))
                }}
                initial={{ 
                  opacity: 0, 
                  y: 400 
                }}
                animate={{
                  opacity: selectedCardIndex !== null && selectedCardIndex !== i ? 0.3 : 1,
                  // Restrict horizontal spread dynamically to avoid cutting off
                  x: offset * Math.min(isMobile ? 45 : 75, (isMobile ? window.innerWidth - 64 : Math.min(600, window.innerWidth * 0.6)) / Math.max(1, hand.length)),
                  y: selectedCardIndex === i 
                    ? -120 // Se selecionada, sobe bastante
                    : Math.pow(Math.abs(offset), 1.4) * (isMobile ? 12 : 18) + (isMobile ? 10 : 0), // Arco do leque suave
                  scale: selectedCardIndex === i 
                    ? (isMobile ? 1.25 : 1.4) 
                    : 1,
                  rotateZ: selectedCardIndex === i ? 0 : offset * (isMobile ? 5 : 8), // Rotação do leque
                  filter: selectedCardIndex === i 
                    ? "drop-shadow(0 0 35px rgba(212, 175, 55, 1)) drop-shadow(0 0 60px rgba(212, 175, 55, 0.6)) grayscale(0)" 
                    : selectedCardIndex !== null ? "grayscale(0.6) brightness(0.6)" : "drop-shadow(0 12px 24px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))"
                }}
                whileHover={
                    selectedCardIndex === i 
                      ? {} 
                      : selectedCardIndex !== null
                        ? {}
                        : {
                            y: Math.pow(Math.abs(offset), 1.4) * (isMobile ? 12 : 18) - (isMobile ? 40 : 60), // Leva a carta para cima no arco
                            scale: 1.15,
                            rotateZ: offset * (isMobile ? 2 : 4), // Menos rotação no hover
                            zIndex: 150,
                            filter: "drop-shadow(0 12px 28px rgba(212, 175, 55, 0.6)) drop-shadow(0 0 30px rgba(212, 175, 55, 0.5))"
                          }
                  }
                whileTap={{ scale: 0.95 }}
                transition={{ 
                  duration: 0.35, 
                  ease: "easeOut"
                }}
                onClick={(e) => {
                  // Se estamos com os botões na tela (Tática), NÃO fazemos nada ao clicar na carta em si, 
                  // forçando o jogador a usar os botões, resolvendo o bug do 'flicker' onde a carta cancela/ativa junta.
                  if (selectedCardIndex === i && card.cardType === 'Tática') {
                    e.stopPropagation();
                    return;
                  }
                  
                  e.stopPropagation();
                  handleCardClick(i);
                }}
              >
                <CardFace
                  variant="hand"
                  card={card}
                  onInfoClick={setDetailedCard}
                  isSelected={selectedCardIndex === i}
                />
              </motion.div>
            )})}
          </AnimatePresence>
        </div>
      </motion.div>



      {/* ── TÁTICA ACTION BUTTONS (overlay ao lado da carta selecionada) ── */}
      <AnimatePresence>
        {selectedCardIndex !== null && hand[selectedCardIndex]?.cardType === 'Tática' && (() => {
          const tacCard = hand[selectedCardIndex];
          const tacIdx  = selectedCardIndex;
          const pos = getTacticaButtonsPosition();
          return (
            <motion.div
              key="tatica-buttons"
              initial={{ opacity: 0, scale: 0.85, x: isMobile ? 20 : -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2, ease: 'easeOut', delay: 0.15 }}
              className="fixed flex flex-col gap-4 z-[250] pointer-events-auto"
              style={{
                left: pos.left,
                top: pos.top,
                transform: pos.transform
              }}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (tacCard.effectKey === 'catapulta') {
                    setPendingEffect({ card: tacCard, handIndex: tacIdx, mode: 'choose_row' });
                    showToast('Catapulta: clique em "Vanguarda" ou "Retaguarda" inimiga!');
                    return;
                  } else if (tacCard.effectKey === 'balesta') {
                    setPendingEffect({ card: tacCard, handIndex: tacIdx, mode: 'target_enemy' });
                    showToast('Balesta: clique em uma unidade inimiga!');
                    return;
                  } else if (tacCard.isEquipment) {
                    setPendingEffect({ card: tacCard, handIndex: tacIdx, mode: 'equip_ally' });
                    showToast(`${tacCard.name}: clique em uma unidade aliada para equipar!`);
                    return;
                  }
                  setTacticaDisplayCard(tacCard);
                  const capturedCard = tacCard;
                  const capturedIndex = tacIdx;
                  setTimeout(() => {
                    setTacticaDisplayCard(null);
                    setSelectedCardIndex(null);
                    setPendingEffect(null);
                    resolveSpellEffect(capturedCard, capturedIndex);
                  }, 1600);
                }}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-800 border-[3px] border-green-400 rounded-2xl text-white font-black tracking-widest uppercase shadow-[0_0_30px_rgba(74,222,128,0.8)] hover:scale-110 active:scale-95 transition-transform text-lg"
              >
                Ativar
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedCardIndex(null);
                }}
                className="px-8 py-4 bg-gradient-to-r from-red-800 to-red-950 border-[3px] border-red-500 rounded-2xl text-white font-black tracking-widest uppercase shadow-[0_0_20px_rgba(239,68,68,0.6)] hover:scale-110 active:scale-95 transition-transform text-lg"
              >
                Cancelar
              </button>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── HEARTHSTONE-STYLE HUD ── */}
      {(() => {
        const PHASE_META: Record<string, { label: string; short: string; color: string; borderRaw: string; glow: string; }> = {
          draw:       { label: 'Fase de Compra',        short: 'COMPRA',     color: 'text-sky-300',     borderRaw: '#38bdf8', glow: 'rgba(56,189,248,0.8)' },
          reposition: { label: 'Fase de Remanejamento', short: 'REMANEJO',   color: 'text-violet-300',  borderRaw: '#a78bfa', glow: 'rgba(167,139,250,0.8)' },
          command:    { label: 'Fase de Comando',       short: 'COMANDO',    color: 'text-amber-300',   borderRaw: '#fbbf24', glow: 'rgba(251,191,36,0.8)' },
          battle:     { label: 'Fase de Batalha',       short: 'BATALHA',    color: 'text-red-300',     borderRaw: '#ef4444', glow: 'rgba(239,68,68,0.8)' },
        };
        const PHASE_ORDER = turnNumber >= 3 ? ['draw', 'reposition', 'command', 'battle'] as const : ['draw', 'reposition', 'command'] as const;
        const currentPhaseIdx = PHASE_ORDER.findIndex(p => p === turnPhase);
        const currentPhaseInfo = PHASE_META[turnPhase] ?? PHASE_META.command;

        const advancePhase = () => {
          audio.playPhaseChange();
          if (currentTurn !== 'player') return;
          const nextIdx = currentPhaseIdx + 1;
          if (nextIdx < PHASE_ORDER.length) {
            const next = PHASE_ORDER[nextIdx] as TurnPhase;
            setTurnPhase(next);
            setRepositionSource(null);
            setSelectedAttackerIndex(null);
            setSelectedCardIndex(null);
            if (next === 'reposition') setViewState('hand');
            if (next === 'command') setViewState('hand');
            if (next === 'battle') setViewState('field');
          } else {
            setCurrentTurn('npc');
            setTurnNumber(prev => prev + 1);
          }
        };

        const isLastPhase = currentPhaseIdx === PHASE_ORDER.length - 1;
        const isPlayerTurn = currentTurn === 'player';
        const nextMeta = PHASE_ORDER[currentPhaseIdx + 1] ? PHASE_META[PHASE_ORDER[currentPhaseIdx + 1]] : null;

        return (
          <>
            {/* END TURN BUTTON (hearthstone-style centered right) */}
            <div className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center z-50 pointer-events-none">
              <motion.button
                disabled={!isPlayerTurn}
                onClick={(e) => { e.stopPropagation(); advancePhase(); }}
                className={`pointer-events-auto relative w-20 h-32 md:w-28 md:h-40 rounded-[2rem] flex flex-col items-center justify-center font-black text-xs md:text-sm tracking-wider uppercase transition-all duration-300 ${
                  isPlayerTurn 
                    ? isLastPhase 
                      ? 'bg-amber-500 text-stone-900 border-[4px] border-yellow-200 hover:bg-yellow-400 shadow-[0_0_30px_rgba(251,191,36,0.6)]' 
                      : 'bg-emerald-600 text-green-50 border-[4px] border-emerald-300 hover:bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                    : 'bg-zinc-700 text-zinc-400 border-[4px] border-zinc-600 grayscale'
                }`}
                whileHover={isPlayerTurn ? { scale: 1.05 } : {}}
                whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
              >
                <div className="absolute top-2 w-full h-1/2 bg-white/20 rounded-t-[1.5rem] opacity-50 pointer-events-none"></div>
                
                <span className="relative z-10 text-center leading-tight drop-shadow-md px-2">
                  {isPlayerTurn ? (isLastPhase ? "FIM DE\nTURNO" : `PRÓX:\n${nextMeta?.short || ''}`) : "TURNO\nINIMIGO"}
                </span>

                {isPlayerTurn && (
                  <motion.div 
                    className="absolute -top-4 bg-black/80 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-amber-400 border border-amber-500/50 whitespace-nowrap"
                    animate={{ opacity: [0.8, 1, 0.8], y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {currentPhaseInfo.label}
                  </motion.div>
                )}
              </motion.button>
            </div>

            {/* PLAYER GOLD TRAY (bottom-right) */}
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-40 bg-zinc-900/80 backdrop-blur-md px-4 py-3 rounded-xl border-2 border-amber-700/80 shadow-[0_4px_15px_rgba(0,0,0,0.8)] pointer-events-none flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black tracking-widest uppercase text-amber-200/70">Ouro</span>
                <span className="font-mono text-3xl md:text-4xl font-bold text-white drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">{playerMana}</span>
              </div>
              <svg width="40" height="40" viewBox="0 0 32 32" className="drop-shadow-[0_0_10px_rgba(212,175,55,0.8)] animate-[pulse_3s_ease-in-out_infinite]">
                <circle cx="16" cy="16" r="15" fill="url(#gHudGold1)" stroke="#7a4a00" strokeWidth="1.5"/>
                <circle cx="16" cy="16" r="12" fill="none" stroke="#FFD700" strokeWidth="0.8" opacity="0.6"/>
                <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="900" fill="#2a1000" fontFamily="Georgia,serif">G</text>
                <defs>
                  <radialGradient id="gHudGold1" cx="38%" cy="32%">
                    <stop offset="0%" stopColor="#FFF5AA"/>
                    <stop offset="48%" stopColor="#D4A017"/>
                    <stop offset="100%" stopColor="#5a2a00"/>
                  </radialGradient>
                </defs>
              </svg>
            </div>

            {/* ENEMY GOLD TRAY (upper-right) */}
            <div className="absolute top-4 right-4 md:top-8 md:right-8 z-40 bg-zinc-900/80 backdrop-blur-md px-3 py-2 rounded-xl border-2 border-red-700/80 shadow-[0_4px_15px_rgba(0,0,0,0.8)] pointer-events-none flex items-center gap-2 transform origin-top-right scale-85 md:scale-100">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black tracking-widest uppercase text-red-200/70">
                  {gameMode === 'Multiplayer' && opponentUsername ? opponentUsername : 'Inimigo'}
                </span>
                <span className="font-mono text-2xl md:text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">{npcHp} <span className="text-xs text-red-300/70">HP</span></span>
              </div>
              <svg width="32" height="32" viewBox="0 0 32 32" className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                <circle cx="16" cy="16" r="15" fill="url(#gHudEnemyGold1)" stroke="#4a0f00" strokeWidth="1.5"/>
                <circle cx="16" cy="16" r="12" fill="none" stroke="#FF8C00" strokeWidth="0.8" opacity="0.6"/>
                <text x="16" y="21" textAnchor="middle" fontSize="13" fontWeight="900" fill="#2a0000" fontFamily="Georgia,serif">G</text>
                <defs>
                  <radialGradient id="gHudEnemyGold1" cx="38%" cy="32%">
                    <stop offset="0%" stopColor="#FFB347"/>
                    <stop offset="48%" stopColor="#B85E00"/>
                    <stop offset="100%" stopColor="#4a0f00"/>
                  </radialGradient>
                </defs>
              </svg>
            </div>

// Button removed to keep board fully visible always
          </>
        );
      })()}

      {/* Floating Card (draw / play animation) */}
      <AnimatePresence>
        {floatingCard && (
          <motion.div
            key={floatingCard.key}
            className="fixed z-[180] pointer-events-none"
            style={{ width: 92, height: 128, top: 0, left: 0 }}
            initial={{ x: floatingCard.from.x, y: floatingCard.from.y, scale: 0.55, opacity: 0, rotateZ: floatingCard.isNpc ? 10 : -10 }}
            animate={{ x: floatingCard.to.x, y: floatingCard.to.y, scale: 1, opacity: 1, rotateZ: 0 }}
            exit={{ scale: 0.3, opacity: 0, rotateZ: floatingCard.isNpc ? -8 : 8 }}
            transition={{ duration: 0.55, ease: [0.2, 0.85, 0.35, 1.0] }}
          >
            <div className="relative w-full h-full">
              <img src={backplateImg} alt="" className="w-full h-full object-cover rounded-lg" />
              {/* glow trail */}
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                animate={{ opacity: [0.9, 0] }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                style={{ boxShadow: '0 0 30px 10px rgba(212,175,55,0.85)', borderRadius: 8 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Target Arrows — one per valid target, always visible AND hand deployment hint */}
      {sourcePos && (() => {
        const sx = sourcePos.x;
        const sy = sourcePos.y;

        // If placing a card from hand
        if (selectedCardIndex !== null && turnPhase === 'command') {
          let tx = mousePos.x;
          let ty = mousePos.y;
          let isHoveringValid = false;

          if (hoveredBoardSlot && hoveredBoardSlot.type === 'player') {
            const hId = hoveredBoardSlot.index;
            const elId = `player_slot_${hId}`;
            const el = document.getElementById(elId);
            if (el) {
              const r = el.getBoundingClientRect();
              tx = r.left + r.width / 2;
              ty = r.top + r.height / 2;
              isHoveringValid = true;
            }
          }

          const dist = Math.hypot(tx - sx, ty - sy);
          const bend = Math.min(dist * 0.3, 120);
          const path = `M ${sx} ${sy} C ${sx} ${sy - bend} ${tx} ${ty - bend * 0.3} ${tx} ${ty}`;
          const color = isHoveringValid ? '#34d399' : '#94a3b8'; // Green when snapping, subtle gray otherwise
          
          return (
            <svg className="fixed inset-0 w-full h-full pointer-events-none z-[150]" style={{ overflow: 'visible' }}>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <marker id="tipDeployHover" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                  <path d="M 0 1 L 4 4 L 0 7" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
              </defs>
              
              <g opacity={1}>
                {/* glow behind */}
                <path d={path} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" filter="url(#glow)" opacity="0.35" />
                {/* main line */}
                <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#tipDeployHover)" />
                {/* animated energy dots */}
                <path d={path} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 22" opacity={0.9}>
                  <animate attributeName="stroke-dashoffset" values="0;-27" dur="0.35s" repeatCount="indefinite" />
                </path>
              </g>
            </svg>
          );
        }

        // Regular attack / reposition arrows
        if (validTargets.size === 0 && (!validRepositionTargets || validRepositionTargets.size === 0)) return null;
        
        const isReposition = turnPhase === 'reposition' && repositionSource !== null;
        const currentTargets = isReposition ? validRepositionTargets : validTargets;

        const hoveredTarget = Array.from(currentTargets).find((tid) => {
          const elId = isReposition 
            ? `player_slot_${tid}` 
            : (tid === 'avatar' ? 'npc_avatar' : `npc_slot_${tid}`);
          const el = document.getElementById(elId);
          if (!el) return false;
          const r = el.getBoundingClientRect();
          return mousePos.x >= r.left && mousePos.x <= r.right && mousePos.y >= r.top && mousePos.y <= r.bottom;
        });

        return (
          <svg className="fixed inset-0 w-full h-full pointer-events-none z-[150]" style={{ overflow: 'visible' }}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <marker id="tip" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M 0 1 L 4 4 L 0 7" fill="none" stroke={isReposition ? "#60a5fa" : "#facc15"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
              <marker id="tipHover" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M 0 1 L 4 4 L 0 7" fill="none" stroke={isReposition ? "#c084fc" : "#ef4444"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>

            {Array.from(currentTargets).map((tid) => {
              const elId = isReposition 
                ? `player_slot_${tid}` 
                : (tid === 'avatar' ? 'npc_avatar' : `npc_slot_${tid}`);
              const el = document.getElementById(elId);
              if (!el) return null;
              const r = el.getBoundingClientRect();
              const tx = r.left + r.width / 2;
              const ty = r.top + r.height / 2;
              const dist = Math.hypot(tx - sx, ty - sy);
              const bend = Math.min(dist * 0.3, 120);
              const path = `M ${sx} ${sy} C ${sx} ${sy - bend} ${tx} ${ty - bend * 0.3} ${tx} ${ty}`;
              const isHovered = tid === hoveredTarget;
              const baseColor = isReposition ? '#60a5fa' : '#facc15';
              const hoverColor = isReposition ? '#c084fc' : '#ef4444';
              const color = isHovered ? hoverColor : baseColor;
              const opacity = isHovered ? 1 : 0.6;
              const key = String(tid);

              return (
                <g key={key} opacity={opacity}>
                  {/* glow behind */}
                  <path d={path} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" filter="url(#glow)" opacity="0.35" />
                  {/* main line */}
                  <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" markerEnd={isHovered ? 'url(#tipHover)' : 'url(#tip)'} />
                  {/* animated energy dots */}
                  <path d={path} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 22" opacity={isHovered ? 0.9 : 0.55}>
                    <animate attributeName="stroke-dashoffset" values="0;-27" dur={isHovered ? '0.35s' : '0.55s'} repeatCount="indefinite" />
                  </path>
                </g>
              );
            })}
          </svg>
        );
      })()}

      {/* ── PHASE ANNOUNCEMENT — Yugioh style ── */}
      <AnimatePresence mode="wait">
        {phaseAnnouncement && (() => {
          const ANN: Record<string, { label: string; sub: string; color: string; glow: string; icon: string; bg: string }> = {
            draw:       { label: 'FASE DE COMPRA',        sub: 'Receba uma carta do seu baralho!',         color: '#38bdf8', glow: 'rgba(56,189,248,0.9)',  icon: '🃏', bg: 'rgba(5,25,50,0.94)'  },
            reposition: { label: 'FASE DE REMANEJAMENTO', sub: 'Mova suas tropas pelo campo!',             color: '#a78bfa', glow: 'rgba(139,92,246,0.9)',  icon: '⇄',  bg: 'rgba(15,5,40,0.94)'  },
            command:    { label: 'FASE DE COMANDO',        sub: 'Invoque cartas para o campo de batalha!', color: '#fbbf24', glow: 'rgba(251,191,36,0.9)',  icon: '⚔',  bg: 'rgba(35,20,0,0.94)'  },
            battle:     { label: 'FASE DE BATALHA',        sub: 'Ataque as forças inimigas!',              color: '#ef4444', glow: 'rgba(239,68,68,0.9)',   icon: '🗡',  bg: 'rgba(40,3,3,0.94)'   },
          };
          const cfg = ANN[phaseAnnouncement];
          if (!cfg) return null;
          return (
            <motion.div
              key={`ann-${phaseAnnouncement}`}
              className="fixed inset-0 z-[165] flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <motion.div
                className="relative w-full flex flex-col items-center justify-center py-8 overflow-hidden"
                style={{ background: `linear-gradient(90deg, transparent 0%, ${cfg.bg} 14%, ${cfg.bg} 86%, transparent 100%)` }}
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                exit={{ clipPath: 'inset(0 0% 0 100%)' }}
                transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Top glow border */}
                <div className="absolute top-0 inset-x-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`, boxShadow: `0 0 24px 5px ${cfg.glow}` }} />
                {/* Bottom glow border */}
                <div className="absolute bottom-0 inset-x-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`, boxShadow: `0 0 24px 5px ${cfg.glow}` }} />
                {/* Watermark crest */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] select-none text-[260px]" style={{ color: cfg.color, lineHeight: 1 }}>⚔</div>
                {/* Top divider */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-24 h-px" style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}80)` }} />
                  <span className="text-[9px] font-bold tracking-[0.45em] uppercase" style={{ color: cfg.color, opacity: 0.6 }}>Price of War</span>
                  <div className="w-24 h-px" style={{ background: `linear-gradient(90deg, ${cfg.color}80, transparent)` }} />
                </div>
                {/* Phase label */}
                <motion.div
                  className="flex items-center gap-5"
                  initial={{ scale: 0.78, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.13, duration: 0.34, ease: [0.2, 0, 0.1, 1.45] }}
                >
                  <span className="text-4xl select-none drop-shadow-lg">{cfg.icon}</span>
                  <h2
                    className="font-black tracking-[0.2em] uppercase text-4xl md:text-5xl select-none"
                    style={{ color: cfg.color, textShadow: `0 0 36px ${cfg.glow}, 0 0 80px ${cfg.glow}40, 0 2px 0 rgba(0,0,0,0.95)` }}
                  >
                    {cfg.label}
                  </h2>
                  <span className="text-4xl select-none drop-shadow-lg">{cfg.icon}</span>
                </motion.div>
                {/* Sub label */}
                <motion.p
                  className="mt-3 text-sm md:text-base font-semibold tracking-[0.25em] uppercase select-none"
                  style={{ color: cfg.color, textShadow: `0 0 16px ${cfg.glow}` }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={{ delay: 0.27, duration: 0.28 }}
                >
                  {cfg.sub}
                </motion.p>
                {/* Bottom divider */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-24 h-px" style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}80)` }} />
                  <span className="text-[10px]" style={{ color: cfg.color, opacity: 0.45 }}>◆◆◆</span>
                  <div className="w-24 h-px" style={{ background: `linear-gradient(90deg, ${cfg.color}80, transparent)` }} />
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── TÁTICA BROADCAST ANIMATION — Hearthstone style ── */}
      <AnimatePresence>
        {tacticaDisplayCard && (
          <motion.div
            key={`tatica-broadcast-${tacticaDisplayCard.id}`}
            className="fixed inset-0 z-[195] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
            <motion.div
              className="relative flex flex-col items-center gap-4"
              initial={{ scale: 0.4, y: -60, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.15, y: -40, opacity: 0, rotate: 4 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.05 }}
            >
              <motion.span
                className="text-yellow-300 font-black text-2xl tracking-[0.3em] uppercase select-none"
                style={{ textShadow: '0 0 24px rgba(251,191,36,0.9), 0 2px 0 rgba(0,0,0,1)' }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {tacticaDisplayCard?.isAmbush ? '⚡ EMBOSCADA!' : '⚡ TÁTICA!'}
              </motion.span>
              <div className="relative" style={{ height: '200px', aspectRatio: '905/1287' }}>
                <CardFace variant="hand" card={tacticaDisplayCard} />
              </div>
              <motion.span
                className="text-[#d4af37] font-bold text-base tracking-widest uppercase select-none"
                style={{ textShadow: '0 0 12px rgba(212,175,55,0.7)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.35 }}
              >
                {tacticaDisplayCard.name}
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-red-600/90 text-white font-bold rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] border-2 border-red-400 pointer-events-none"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DECK SELECT OVERLAY ────────────────────────────────────────────── */}
      {deckSelectOpen && (
        <DeckSelectScreen customDeck={deck} onSelect={(id) => {
          setSelectedDeckId(id);
          setDeckSelectOpen(false);
          setStartupPhase('drawing');
        }} />
      )}

      {/* ── PENDING EFFECT: choose row (Catapulta) ────────────────────────── */}
      {pendingEffect?.mode === 'choose_row' && (
        <div className="fixed inset-0 z-[160] flex items-end justify-center pb-40 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 pointer-events-auto"
          >
            <button
              onClick={() => { resolveSpellEffect(pendingEffect.card, pendingEffect.handIndex, { row: 0 }); setSelectedCardIndex(null); setPendingEffect(null); }}
              className="px-6 py-3 bg-orange-700/90 hover:bg-orange-600 text-white font-bold rounded-xl border-2 border-orange-400 shadow-lg shadow-orange-900/60"
            >Vanguarda Inimiga</button>
            <button
              onClick={() => { resolveSpellEffect(pendingEffect.card, pendingEffect.handIndex, { row: 1 }); setSelectedCardIndex(null); setPendingEffect(null); }}
              className="px-6 py-3 bg-orange-700/90 hover:bg-orange-600 text-white font-bold rounded-xl border-2 border-orange-400 shadow-lg shadow-orange-900/60"
            >Retaguarda Inimiga</button>
            <button
              onClick={() => { setSelectedCardIndex(null); setPendingEffect(null); }}
              className="px-4 py-3 bg-gray-700/90 hover:bg-gray-600 text-white font-bold rounded-xl border-2 border-gray-500"
            >Cancelar</button>
          </motion.div>
        </div>
      )}

      {/* ── GRAVEYARD PICKER ─────────────────────────────────────────────── */}
      {showGraveyardPicker && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={() => setShowGraveyardPicker(false)}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#1a1209] border-2 border-[#8c7a5f]/40 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-[#d4af37] font-bold text-xl mb-4 text-center">Cemitério — Escolha um Soldado</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {graveyard.filter(c => !c.isSpell && c.cardType !== 'General' && c.cardType !== 'Relíquia' && c.cardType !== 'Terreno').map((c, i) => (
                <div key={i} className="relative w-36 aspect-[905/1287] cursor-pointer group hover:z-10" onClick={() => {
                  setHand(prev => [...prev, { ...c, id: `gv_return_${Date.now()}` }]);
                  setGraveyard(prev => { const a = [...prev]; const idx = a.findIndex(g => g.id === c.id); if (idx >= 0) a.splice(idx, 1); return a; });
                  setShowGraveyardPicker(false);
                  setPendingEffect(null);
                  showToast(`${c.name} retornou da cruzada!`);
                }}>
                  <motion.div whileHover={{ scale: 1.1, translateY: -10 }} className="w-full h-full">
                    <CardFace variant="preview" card={c} />
                    {/* Hover glow e overlay interativo */}
                    <div className="absolute inset-0 rounded-xl bg-green-500/0 group-hover:bg-green-500/20 border-2 border-transparent group-hover:border-green-400 transition-colors pointer-events-none" />
                  </motion.div>
                </div>
              ))}
            </div>
            <button onClick={() => { setShowGraveyardPicker(false); setPendingEffect(null); }}
              className="mt-4 w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold">Cancelar</button>
          </motion.div>
        </div>
      )}

      {/* ── DECK TOP-4 PICKER ────────────────────────────────────────────── */}
      {showDeckTop4 && deckTop4Cards.length > 0 && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={() => setShowDeckTop4(false)}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#1a1209] border-2 border-[#8c7a5f]/40 rounded-2xl p-6 max-w-2xl w-full mx-4"
          >
            <h2 className="text-[#d4af37] font-bold text-xl mb-2 text-center">Escolher Tropas — Pegue 2 cartas</h2>
            <p className="text-[#a89060] text-sm text-center mb-6">Clique em 2 cartas para adicionar à mão. As outras vão ao fundo do deck.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              {deckTop4Cards.map((c, i) => {
                const isSelected = summonSlotsChosen.includes(i);
                return (
                <div key={i} className="relative w-36 aspect-[905/1287] cursor-pointer group hover:z-10" onClick={() => {
                  if (isSelected) return;
                  const newPicked = [...summonSlotsChosen, i];
                  setSummonSlotsChosen(newPicked);
                  if (newPicked.length >= 2) {
                    const chosen = newPicked.map(idx => ({ ...deckTop4Cards[idx], id: `chosen_top4_${Date.now()}_${idx}` }));
                    setHand(prev => [...prev, ...chosen]);
                    setShowDeckTop4(false);
                    setSummonSlotsChosen([]);
                    setDeckTop4Cards([]);
                    setPendingEffect(null);
                    showToast(`${chosen.map(c => c.name).join(', ')} adicionadas!`);
                  }
                }}>
                  <motion.div whileHover={isSelected ? {} : { scale: 1.1, translateY: -10 }} className="w-full h-full relative">
                    <CardFace variant="preview" card={c} />
                    {/* Hover and Selected state overlays */}
                    <div className={`absolute inset-0 rounded-[0.8rem] border-2 pointer-events-none transition-colors ${
                      isSelected 
                        ? 'bg-green-500/40 border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]' 
                        : 'bg-transparent border-transparent group-hover:border-green-400 group-hover:bg-green-500/10'
                    }`} />
                  </motion.div>
                </div>
              )})}
            </div>
            <button onClick={() => { setShowDeckTop4(false); setSummonSlotsChosen([]); setDeckTop4Cards([]); setPendingEffect(null); }}
              className="mt-4 w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold">Cancelar</button>
          </motion.div>
        </div>
      )}

      {/* ── SUMMON PICKER (Reunião de Fiéis) ─────────────────────────────── */}
      {showSummonPicker && summonSourceCards.length > 0 && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={() => setShowSummonPicker(false)}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#1a1209] border-2 border-[#8c7a5f]/40 rounded-2xl p-6 max-w-2xl w-full mx-4"
          >
            <h2 className="text-[#d4af37] font-bold text-xl mb-2 text-center">Reunião de Fiéis — Invoque até 2</h2>
            <p className="text-[#a89060] text-sm text-center mb-6">Escolha um slot de campo livre (clique no tabuleiro) para cada soldado. Clique nas cartas abaixo primeiro.</p>
            <div className="flex gap-4 justify-center flex-wrap mb-4">
              {summonSourceCards.slice(0, 6).map((c, i) => {
                const isSelected = summonSlotsChosen.includes(i);
                return (
                <div key={i} className="relative w-36 aspect-[905/1287] cursor-pointer group hover:z-10" onClick={() => {
                  if (isSelected) return;
                  // Find first free frontline slot
                  const freeSlots = playerSlots.map((s, idx) => idx < 10 && !s ? idx : -1).filter(idx => idx >= 0);
                  if (freeSlots.length === 0) { showToast('Sem slots livres!'); return; }
                  const targetSlot = freeSlots[0];
                  const newSlots = [...playerSlots];
                  newSlots[targetSlot] = { ...c, id: `summoned_rf_${Date.now()}_${i}` };
                  setPlayerSlots(newSlots);
                  const remaining = summonSourceCards.filter((_, si) => si !== i).slice(0, 5);
                  const newChosen = [...summonSlotsChosen, i];
                  setSummonSlotsChosen(newChosen);
                  if (newChosen.length >= 2) {
                    setShowSummonPicker(false);
                    setSummonSourceCards([]);
                    setSummonSlotsChosen([]);
                    setPendingEffect(null);
                    showToast(`${c.name} invocado! (2/2)`);
                  } else {
                    setSummonSourceCards(remaining);
                    showToast(`${c.name} invocado! Escolha mais 1.`);
                  }
                }}>
                  <motion.div whileHover={isSelected ? {} : { scale: 1.1, translateY: -10 }} className="w-full h-full relative">
                    <CardFace variant="preview" card={c} />
                    {/* Hover and Selected state overlays */}
                    <div className={`absolute inset-[2px] rounded-[0.9rem] border-2 pointer-events-none transition-colors ${
                      isSelected 
                        ? 'bg-blue-500/40 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
                        : 'bg-transparent border-transparent group-hover:border-blue-400 group-hover:bg-blue-500/10'
                    }`} />
                  </motion.div>
                </div>
              )})}
            </div>
            <button onClick={() => { setShowSummonPicker(false); setSummonSourceCards([]); setSummonSlotsChosen([]); setPendingEffect(null); }}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold">Fechar</button>
          </motion.div>
        </div>
      )}

      {/* ── GENERIC CARD PICKER (deck / graveyard search) ────────────────── */}
      {showCardPicker && cardPickerConfig && cardPickerCards.length > 0 && (
        <div className="fixed inset-0 z-[175] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={handleCardPickerClose}>
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#1a1209] border-2 border-[#8c7a5f]/40 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[88vh] flex flex-col gap-4"
          >
            {/* Header */}
            <div className="text-center shrink-0">
              <h2 className="text-[#d4af37] font-black text-xl tracking-wide">{cardPickerConfig.title}</h2>
              <p className="text-[#a89060] text-sm mt-1">{cardPickerConfig.subtitle}</p>
              <p className="text-white/50 text-xs mt-1 font-mono">
                {cardPickerSelected.length} / {cardPickerConfig.max} selecionada{cardPickerConfig.max > 1 ? 's' : ''}
              </p>
            </div>

            {/* Card grid */}
            <div className="flex flex-wrap gap-3 justify-center overflow-y-auto flex-1 py-2 pr-1">
              {cardPickerCards.map((c, i) => {
                const isSelected = cardPickerSelected.includes(i);
                const maxReached = cardPickerSelected.length >= cardPickerConfig.max;
                const disabled = !isSelected && maxReached;
                return (
                  <div
                    key={c.id + i}
                    className={`relative w-24 md:w-32 aspect-[905/1287] group ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:z-10'}`}
                    onClick={() => {
                      if (disabled) return;
                      if (isSelected) {
                        setCardPickerSelected(prev => prev.filter(idx => idx !== i));
                        return;
                      }
                      const newSel = [...cardPickerSelected, i];
                      setCardPickerSelected(newSel);
                      if (newSel.length >= cardPickerConfig.max) {
                        handleCardPickerConfirm(newSel);
                      }
                    }}
                  >
                    <motion.div whileHover={disabled ? {} : { scale: 1.08, translateY: -8 }} className="w-full h-full relative">
                      <CardFace variant="preview" card={c} />
                      <div className={`absolute inset-0 rounded-[0.8rem] border-2 pointer-events-none transition-colors ${
                        isSelected
                          ? 'bg-yellow-500/30 border-yellow-400 shadow-[0_0_18px_rgba(234,179,8,0.55)]'
                          : disabled
                            ? 'border-transparent bg-black/20'
                            : 'border-transparent group-hover:border-green-400 group-hover:bg-green-500/10'
                      }`} />
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-yellow-400 text-black rounded-full w-6 h-6 flex items-center justify-center font-black text-sm z-10 shadow-lg">✓</div>
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Footer buttons */}
            <div className="flex gap-3 pt-2 border-t border-[#8c7a5f]/20 shrink-0">
              {cardPickerSelected.length > 0 && cardPickerSelected.length < cardPickerConfig.max && (
                <button
                  onClick={() => handleCardPickerConfirm(cardPickerSelected)}
                  className="flex-1 py-3 bg-yellow-700/80 hover:bg-yellow-600 text-white rounded-xl font-bold border-2 border-yellow-500/50 transition-colors uppercase tracking-widest text-sm"
                >
                  Confirmar ({cardPickerSelected.length})
                </button>
              )}
              <button
                onClick={handleCardPickerClose}
                className={`${cardPickerSelected.length > 0 && cardPickerSelected.length < cardPickerConfig.max ? '' : 'flex-1'} py-3 px-8 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-colors uppercase tracking-widest text-sm`}
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── AMBUSH INTERRUPT MODAL ───────────────────────────────────────── */}
      {pendingAmbush && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: -40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="bg-[#1a0f05] border-2 border-yellow-500/70 rounded-2xl p-6 max-w-md w-full mx-4 shadow-[0_0_60px_rgba(234,179,8,0.4)]"
          >
            <div className="text-center mb-4">
              <span className="text-yellow-400 font-black text-2xl tracking-widest">⚡ EMBOSCADA!</span>
              <p className="text-[#a89060] text-sm mt-2">O inimigo está atacando! Ative uma Emboscada?</p>
            </div>
            <div className="flex gap-3 justify-center mb-5 flex-wrap">
              {pendingAmbush.ambushCards.map(({ card, handIndex }, i) => (
                <button key={i} onClick={() => {
                  // Show broadcast animation, then resolve after it plays
                  setTacticaDisplayCard(card);
                  const capturedResolve = pendingAmbushResolveRef.current;
                  const capturedSlot = pendingAmbush.targetSlot as number;
                  setTimeout(() => {
                    setTacticaDisplayCard(null);
                    if (capturedResolve) capturedResolve(true, handIndex, capturedSlot);
                  }, 1600);
                }}
                  className="w-28 bg-[#2a1810] border-2 border-yellow-500/60 rounded-xl p-3 hover:border-yellow-400 hover:bg-[#3a2418] transition-colors text-center flex flex-col gap-1"
                >
                  <span className="text-yellow-300 font-bold text-sm leading-tight">{card.name}</span>
                  <span className="text-[#a89060] text-xs">{card.cardType}</span>
                  <span className="text-yellow-500 text-xs">💰{card.cost}</span>
                  <span className="text-[#c8a870] text-[10px] leading-tight">{card.effect}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { if (pendingAmbushResolveRef.current) pendingAmbushResolveRef.current(false); }}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl border border-gray-500"
              >Não Ativar</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── GENERAL ABILITY BUTTONS ──────────────────────────────────────── */}
      {turnPhase === 'command' && playerSlots[12]?.effectKey === 'general_cardeal' && !pendingEffect && (
        <div className="fixed bottom-[13rem] right-4 z-[90] flex flex-col gap-2 pointer-events-auto">
          <button
            disabled={generalAbilityUsedCount >= (playerSlots[10]?.effectKey === 'calice_vida' || playerSlots[11]?.effectKey === 'calice_vida' ? 2 : 1) || generalAbilityBlocked}
            onClick={() => { setPendingEffect({ card: playerSlots[12]!, handIndex: -1, mode: 'general_heal' }); showToast('Cardeal Pedro: clique em um aliado para curar 1 HP (grátis)'); }}
            className="px-4 py-2 bg-emerald-700/90 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl border-2 border-emerald-400/60 shadow-lg shadow-emerald-900/50 whitespace-nowrap"
          >✨ Curar 1 HP</button>
          <button
            disabled={generalAbilityUsedCount >= (playerSlots[10]?.effectKey === 'calice_vida' || playerSlots[11]?.effectKey === 'calice_vida' ? 2 : 1) || generalAbilityBlocked || playerMana < 1}
            onClick={() => { setPendingEffect({ card: { ...playerSlots[12]!, effectKey: 'general_heal_paid' }, handIndex: -1, mode: 'general_heal' }); showToast('Cardeal Pedro: clique em um aliado para curar 3 HP (-1 💰)'); }}
            className="px-4 py-2 bg-emerald-800/90 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl border-2 border-emerald-600/60 shadow-lg shadow-emerald-900/50 whitespace-nowrap"
          >💎 Curar 3 HP (-1💰)</button>
        </div>
      )}

      {/* ── HOSPITALÁRIO ABILITY BUTTON ───────────────────────────────────── */}
      {turnPhase === 'command' && !pendingEffect && playerSlots.map((card, slotIdx) => 
        card?.effectKey === 'hospitalario' && !unitAbilityUsed.has(card.id) ? (
          <div key={`hosp_btn_${slotIdx}`} className="fixed z-[90] pointer-events-auto"
            style={{ bottom: `${13 + slotIdx * 0.5}rem`, left: '0.75rem' }}>
            <button
              onClick={() => {
                setPendingEffect({ card, handIndex: -1, mode: 'hosp_step1', generatorSlot: slotIdx } as any);
                showToast(`Hospitalário: clique em um aliado para curar 1 HP!`);
              }}
              className="px-3 py-1.5 bg-teal-700/90 hover:bg-teal-600 text-white text-xs font-bold rounded-xl border-2 border-teal-400/60 shadow-lg whitespace-nowrap"
            >🏥 {card.name}</button>
          </div>
        ) : null
      )}

      {/* Floating Hover Preview */}
      <AnimatePresence>
        {hoveredBoardSlot && (hoveredBoardSlot.type === 'player' ? playerSlots[hoveredBoardSlot.index] : npcSlots[hoveredBoardSlot.index]) && (
          <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`fixed top-1/2 -translate-y-1/2 z-[90] pointer-events-none w-64 md:w-80 aspect-[905/1287] drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] ${isMobile ? 'right-4' : 'right-12'}`}
          >
            <CardFace variant="modal" card={hoveredBoardSlot.type === 'player' ? playerSlots[hoveredBoardSlot.index]! : npcSlots[hoveredBoardSlot.index]!} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Card Modal */}
      <AnimatePresence>
        {detailedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto"
            onClick={() => setDetailedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm aspect-[905/1287] bg-transparent flex flex-col border-0 drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            >
              <button
                onClick={() => setDetailedCard(null)}
                className="absolute -top-4 -left-4 w-10 h-10 bg-red-600 rounded-full border-2 border-red-900 flex items-center justify-center shadow-lg z-30 hover:bg-red-500 transition-colors pointer-events-auto"
              >
                <X className="text-white w-6 h-6" />
              </button>

              <CardFace variant="modal" card={detailedCard} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CardSlot = ({ 
  onClick, onInfoClick, onMouseEnter, onMouseLeave, card, isSelected = false, isValidTarget = false, isHovered = false,
  isAttacking = false, isImpactingTarget = false, attackDirection = 'up', 
  isNpcCard = false, slotId, isInvalidTarget = false,
  attackDeltaX = 0, attackDeltaY = -450,
  isRepositionSource = false, isAttackExhausted = false, isSwapping = false,
  swapFromX = 0, swapFromY = 0, isValidRepositionTarget = false, isJustPlaced = false
}: { 
  onClick?: () => void, onInfoClick?: (card: CardData) => void, onMouseEnter?: () => void, onMouseLeave?: () => void, card?: CardData | null, 
  isSelected?: boolean, isValidTarget?: boolean, isHovered?: boolean, isAttacking?: boolean, isImpactingTarget?: boolean, 
  attackDirection?: 'up' | 'down', isNpcCard?: boolean, slotId?: string, key?: React.Key,
  isInvalidTarget?: boolean, attackDeltaX?: number, attackDeltaY?: number,
  isRepositionSource?: boolean, isAttackExhausted?: boolean, isSwapping?: boolean,
  swapFromX?: number, swapFromY?: number, isValidRepositionTarget?: boolean, hasCard?: boolean, isJustPlaced?: boolean
}) => {
  return (
    <motion.div 
      id={slotId}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`h-48 md:h-[290px] aspect-[905/1287] shrink-0 relative group ${onClick ? 'cursor-pointer pointer-events-auto' : ''}`}
      style={{ zIndex: isSelected ? 50 : 1 }}
    >
      {!card && (
          <div className="absolute inset-0 rounded-[10px] border border-[#8c7a5f]/15 bg-black/40 group-hover:bg-black/20 transition-all duration-300 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-sm flex items-center justify-center overflow-hidden">
            <div className="w-[50%] h-[50%] rounded-full border border-[#d4af37]/5 opacity-20 group-hover:opacity-100 group-hover:border-[#d4af37]/40 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-500 ease-out" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        )}

      {/* Valid target pulsing ring */}
      {card && !card.isDestroyed && isValidTarget && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.06, 1] }}
          transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-1 rounded-xl border-2 border-yellow-400 pointer-events-none z-20"
          style={{ boxShadow: '0 0 20px rgba(234,179,8,0.9), inset 0 0 12px rgba(234,179,8,0.25)' }}
        />
      )}

      {/* Reposition target pulsing ring & overlay text (Hover only) */}
      {isValidRepositionTarget && (
        <>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.04, 1] }}
            transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute -inset-1 rounded-xl border-2 pointer-events-none z-20 ${card ? 'border-purple-400' : 'border-blue-400'}`}
            style={{ boxShadow: card ? '0 0 20px rgba(192,132,252,0.7), inset 0 0 12px rgba(192,132,252,0.2)' : '0 0 20px rgba(96,165,250,0.7), inset 0 0 12px rgba(96,165,250,0.2)' }}
          />
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-black/80 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl shadow-xl flex items-center justify-center">
                 <span className={`text-sm md:text-base font-black tracking-widest uppercase drop-shadow-md ${card ? 'text-purple-300' : 'text-blue-300'}`}>{card ? 'SWAP' : 'MOVER'}</span>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Invalid target blocked overlay */}
      {card && !card.isDestroyed && isInvalidTarget && (
        <motion.div
          animate={{ opacity: [0.55, 0.75, 0.55] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="absolute inset-0 rounded-lg z-20 pointer-events-none flex items-center justify-center"
          style={{ background: 'radial-gradient(circle, rgba(120,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)' }}
        >
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-full border-2 border-red-700/80" />
            <div className="absolute top-1/2 left-1/2 w-5 h-0.5 bg-red-600/90 -translate-x-1/2 -translate-y-1/2 rotate-45" />
            <div className="absolute top-1/2 left-1/2 w-5 h-0.5 bg-red-600/90 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
          </div>
        </motion.div>
      )}

      {/* Reposition source — violet pulsing ring */}
      {card && !card.isDestroyed && isRepositionSource && (
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.07, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
          className="absolute -inset-1 rounded-xl border-2 border-violet-400 pointer-events-none z-20"
          style={{ boxShadow: '0 0 18px rgba(167,139,250,0.9), inset 0 0 10px rgba(167,139,250,0.2)' }}
        />
      )}

      {/* Swap aura */}
      <AnimatePresence>
        {isSwapping && (
          <motion.div
            key="swap-aura"
            className="absolute -inset-1 rounded-xl pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{ boxShadow: '0 0 28px 6px rgba(167,139,250,0.85)', border: '2px solid rgba(167,139,250,0.7)' }}
          />
        )}
      </AnimatePresence>

      {/* Attack exhausted overlay — dimmed with ZZZ */}
      {card && !card.isDestroyed && isAttackExhausted && (
        <div className="absolute inset-0 rounded-lg z-20 pointer-events-none flex items-end justify-center pb-1"
          style={{ background: 'rgba(0,0,0,0.45)' }}>
          <span className="text-[9px] font-black text-zinc-400 tracking-widest uppercase opacity-70">esgotada</span>
        </div>
      )}

      {card && !card.isDestroyed && (
        <motion.div
          layoutId={card.id}
          initial={isJustPlaced ? { scale: 2.2, y: isNpcCard ? 200 : -200, z: 500, rotateX: isNpcCard ? 45 : -45, rotateZ: isNpcCard ? -10 : -10, opacity: 0, filter: "drop-shadow(0 0 100px rgba(255,255,255,1)) brightness(3)" } : undefined}
          animate={{
            x: isSwapping ? [swapFromX, swapFromX * 0.3, 0] : isAttacking ? attackDeltaX : isJustPlaced ? [isNpcCard ? -20 : 20, 0, 0] : 0,
            y: isSwapping ? [swapFromY, swapFromY * 0.5 - 55, 0] : isAttacking ? attackDeltaY : isJustPlaced ? [isNpcCard ? 150 : -150, isNpcCard ? 15 : -15, 0] : 0,
            z: isSwapping ? [0, 120, 0] : isAttacking ? 120 : isJustPlaced ? [400, -30, 0] : 0,
            scale: isSwapping ? [1, 1.18, 1] : isAttacking ? 1.35 : isSelected ? 1.05 : isJustPlaced ? [2.2, 0.95, 1] : 1,
            rotateX: isSwapping ? [0, -15, 0] : isAttacking ? (attackDirection === 'up' ? 22 : -22) : isJustPlaced ? [isNpcCard ? 40 : -40, isNpcCard ? -5 : 5, 0] : 0,
            rotateZ: isSwapping ? [0, (swapFromX > 0 ? 12 : -12), 0] : isAttacking ? (attackDirection === 'up' ? -6 : 6) : isJustPlaced ? [isNpcCard ? -10 : -10, isNpcCard ? 3 : 3, 0] : 0,
            opacity: isJustPlaced ? [0, 1, 1] : 1,
            filter: isSwapping
              ? [
                  "drop-shadow(0 8px 16px rgba(0,0,0,0.6))",
                  "drop-shadow(0 0 30px rgba(167,139,250,0.9)) drop-shadow(0 0 60px rgba(109,40,217,0.6)) brightness(1.25)",
                  "drop-shadow(0 8px 16px rgba(0,0,0,0.6))"
                ]
              : isAttacking
                ? "drop-shadow(0 0 45px rgba(255,100,0,1)) drop-shadow(0 0 90px rgba(255,40,0,0.9)) brightness(1.55) contrast(1.1)"
                : isSelected 
                  ? "drop-shadow(0 0 25px rgba(239, 68, 68, 0.9)) drop-shadow(0 0 40px rgba(239, 68, 68, 0.5))" 
                  : isRepositionSource
                    ? "drop-shadow(0 0 22px rgba(167,139,250,0.95)) drop-shadow(0 0 44px rgba(167,139,250,0.5)) brightness(1.15)"
                    : isValidTarget
                      ? "drop-shadow(0 0 28px rgba(234,179,8,0.95)) drop-shadow(0 0 55px rgba(234,179,8,0.6)) brightness(1.25)"
                      : isInvalidTarget
                        ? "brightness(0.45) saturate(0.2)"
                        : isAttackExhausted
                          ? "brightness(0.5) saturate(0.3)"
                          : isJustPlaced
                            ? [
                                "drop-shadow(0 0 100px rgba(255,255,255,1)) brightness(3) blur(4px)",
                                "drop-shadow(0 0 40px rgba(255,215,0,0.9)) brightness(1.8) blur(0px)",
                                "drop-shadow(0 0 20px rgba(212,175,55,0.7)) brightness(1.15)"
                              ]
                            : "drop-shadow(0 8px 16px rgba(0,0,0,0.6)) drop-shadow(0 0 12px rgba(212, 175, 55, 0.3))"
          }}
          transition={{ 
            x: { duration: isJustPlaced ? 0.6 : isSwapping ? 0.55 : isAttacking ? 0.28 : 0.32, ease: isJustPlaced ? [0.22, 1, 0.36, 1] : isSwapping ? [0.25, 0.1, 0.25, 1] : isAttacking ? [0.55, 0, 0.85, 0.5] : [0.15, 0.85, 0.3, 1] },
            y: { duration: isJustPlaced ? 0.6 : isSwapping ? 0.55 : isAttacking ? 0.28 : 0.32, ease: isJustPlaced ? [0.22, 1, 0.36, 1] : isSwapping ? 'easeInOut' : isAttacking ? [0.55, 0, 0.85, 0.5] : [0.15, 0.85, 0.3, 1] },
            z: { duration: isJustPlaced ? 0.6 : 0.4, ease: isJustPlaced ? [0.22, 1, 0.36, 1] : 'easeOut' },
            scale: { duration: isJustPlaced ? 0.6 : isSwapping ? 0.55 : 0.22, ease: isJustPlaced ? [0.22, 1, 0.36, 1] : 'easeOut' },
            rotateX: { duration: isJustPlaced ? 0.6 : isSwapping ? 0.55 : 0.28, ease: isJustPlaced ? [0.22, 1, 0.36, 1] : 'easeOut' },
            rotateZ: { duration: isJustPlaced ? 0.6 : isSwapping ? 0.55 : 0.22, ease: isJustPlaced ? [0.22, 1, 0.36, 1] : 'easeOut' },
            opacity: { duration: isJustPlaced ? 0.4 : 0.2 },
            filter: { duration: isJustPlaced ? 0.8 : isSwapping ? 0.55 : 0.25 },
            default: { duration: 0.3, ease: "easeOut" }
          }}
          style={{ transformStyle: 'preserve-3d', zIndex: isJustPlaced ? 200 : isSwapping ? 150 : isAttacking ? 100 : 'auto' }}
          className="w-full h-full relative"
        >
          {/* Card Thickness Layers */}
          <div className="absolute inset-0 bg-[#2a1b0c] rounded-xl pointer-events-none" style={{ transform: 'translateZ(-1px)' }} />
          <div className="absolute inset-0 bg-[#1a0f05] rounded-xl pointer-events-none" style={{ transform: 'translateZ(-2px)' }} />
          <div className="absolute inset-0 bg-[#0c0602] rounded-xl pointer-events-none shadow-[0_15px_25px_rgba(0,0,0,0.8)]" style={{ transform: 'translateZ(-3px)' }} />

          {/* Placement AAA Burst and Shockwave */}
          {isJustPlaced && (
            <>
              {/* Outer Shockwave Ripple */}
              <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: [0.5, 3.5, 4.5], opacity: [1, 0.8, 0] }}
                transition={{ duration: 0.7, ease: "easeOut", times: [0, 0.4, 1] }}
                className="absolute inset-0 rounded-2xl pointer-events-none -z-10"
                style={{ 
                  border: '2px solid rgba(255,215,0,0.5)',
                  background: 'radial-gradient(circle, rgba(234,179,8,0.4) 0%, rgba(234,179,8,0) 70%)',
                  boxShadow: '0 0 60px 20px rgba(255,215,0,0.6)'
                }}
              />
              
              {/* Inner Bright Ring / Flash */}
              <motion.div
                initial={{ scale: 0.8, opacity: 1, borderWidth: '12px' }}
                animate={{ scale: 1.5, opacity: 0, borderWidth: '0px' }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 rounded-xl pointer-events-none z-50 border-[#FFF]"
                style={{ filter: "drop-shadow(0 0 30px #FFF) drop-shadow(0 0 50px #FFD700)" }}
              />

              {/* Magical Dust/Particles (simulated with radial dots) */}
              <motion.div
                initial={{ opacity: 1, scale: 0.5, rotate: 0 }}
                animate={{ opacity: 0, scale: 2, rotate: 45 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 pointer-events-none z-40"
                style={{ 
                  backgroundImage: 'radial-gradient(circle at 50% 50%, white 2px, transparent 3px), radial-gradient(circle at 20% 80%, #FFD700 2px, transparent 3px), radial-gradient(circle at 80% 20%, white 3px, transparent 4px), radial-gradient(circle at 80% 80%, #FFD700 2px, transparent 3px), radial-gradient(circle at 20% 20%, #FFF 2px, transparent 3px)',
                  backgroundSize: '150% 150%',
                  backgroundPosition: 'center',
                  filter: 'drop-shadow(0 0 10px #FFD700) drop-shadow(0 0 20px #FFF)'
                }}
              />

              {/* Vertical Beams / Light Pillar */}
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: [0, 1.5, 0], opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.6, ease: "easeIn" }}
                className="absolute inset-x-4 -top-32 -bottom-32 pointer-events-none z-40 bg-gradient-to-b from-transparent via-yellow-200 to-transparent"
                style={{ filter: "blur(12px) drop-shadow(0 0 20px #FFD700)", transformOrigin: 'bottom' }}
              />
            </>
          )}

          <CardFace variant="field" card={card} onInfoClick={onInfoClick}>
            {isImpactingTarget && <ImpactEffect />}
            {isImpactingTarget && <SlashEffect />}
          </CardFace>
        </motion.div>
      )}
      {card && card.isDestroyed && (
        <>
          <motion.div
            initial={{ scale: 1, opacity: 1, rotateZ: 0 }}
            animate={{ 
              scale: [1, 1.1, 0.8, 0], 
              opacity: [1, 1, 0.5, 0], 
              rotateZ: [0, -5, 5, -10, 10, 0],
              filter: ["brightness(1)", "brightness(2)", "brightness(0.5)", "brightness(0)"]
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-40 pointer-events-none"
          >
            <div className="w-full h-full bg-transparent border-0 drop-shadow-lg grayscale">
               {card.art ? (
                 <img src={card.art} className="w-full h-full object-cover opacity-50 rounded-lg" />
               ) : (
                 <div className="w-full h-full bg-[#1a0b00] rounded-lg" />
               )}
            </div>
          </motion.div>
          <ExplosionEffect />
        </>
      )}
    </motion.div>
  );
};

const Avatar = ({ name, isPlayer = false, isActive = false, hp = 30, mana = 10, isMobile = false }: { name: string, isPlayer?: boolean, isActive?: boolean, hp?: number, mana?: number, isMobile?: boolean, key?: React.Key }) => (
  <motion.div 
    className={`relative flex flex-col items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-950 border-4 ${isActive ? (isPlayer ? 'border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.8)]' : 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.8)]') : 'border-zinc-700 shadow-2xl'} rounded-t-full rounded-b-2xl ${isMobile ? 'w-24 h-32' : 'w-36 h-48'} transition-all`}
  >
    {/* Portrait Area */}
    <div className="absolute inset-2 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-t-full rounded-b-xl overflow-hidden flex items-center justify-center border-2 border-zinc-600/50 shadow-inner">
      <span className={`${isPlayer ? 'text-blue-300' : 'text-red-300'} font-black tracking-widest text-sm md:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase text-center leading-tight`}>{name}</span>
    </div>
    
    {/* Name Plate */}
    <div className="absolute -bottom-3 bg-gradient-to-b from-zinc-800 to-black border-2 border-zinc-500 px-4 py-1 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.8)] z-10">
      <span className="text-white font-black tracking-widest text-[8px] md:text-[10px] uppercase">{isPlayer ? 'HERÓI' : 'INIMIGO'}</span>
    </div>

    {/* HP Badge */}
    <HpBadge value={hp} className="absolute -bottom-6 -right-6 w-12 h-12 md:w-16 md:h-16 text-xl md:text-3xl z-20 shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
    
    {/* Mana Badge */}
    <ManaBadge value={mana} className="absolute -bottom-6 -left-6 w-12 h-12 md:w-16 md:h-16 text-xl md:text-3xl z-20 shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
  </motion.div>
);

