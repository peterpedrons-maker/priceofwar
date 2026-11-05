// Missões (dados): o que o jogo pede, quanto paga e em que modo vale. Só dados: o servidor sorteia, conta e paga (ainda não ligado; ver docs/economia-proposta.md).
// Decisão do dono (rodada 26): missões de vitória e de jogo valem contra a IA (Desafios) ou em qualquer modo ("livre"); as missões RANQUEADAS já existem aqui,
// mas ficam DESLIGADAS até o dono ligar a chave `RANKED_MISSIONS_ON` (poucos jogadores no começo: missão ranqueada seria impossível de cumprir).
export type MissionKind = 'daily' | 'weekly' | 'season';
export type MissionMode = 'ia' | 'free' | 'ranked';   // ia: partida contra a IA nos Desafios · free: vale em qualquer modo · ranked: só partida ranqueada
// O que o servidor conta (a partir dos eventos da partida): vitórias, cartas Táticas jogadas, unidades convocadas, armas equipadas, vitórias com Generais diferentes, liga atingida, partidas jogadas.
export type MissionMetric = 'win' | 'play' | 'tactic' | 'summon' | 'equip' | 'win_generals' | 'reach_league';
export interface MissionDef {
  id: string; kind: MissionKind; mode: MissionMode; metric: MissionMetric; target: number; reward: number;
  title: string; desc: string;
  league?: string;   // 'reach_league': a liga que precisa ser atingida (chave de src/engine/ranked.ts)
}

// LIGA (a chave): ligue quando houver gente para a fila ranqueada e o ranqueado estiver liberado. Desligado, nenhuma missão ranqueada é sorteada nem aparece.
export const RANKED_MISSIONS_ON = false;

export const MISSIONS: MissionDef[] = [
  // ── Diárias (renovam à meia-noite de Brasília) ─────────────────────────────
  { id: 'd-ia-win1', kind: 'daily', mode: 'ia', metric: 'win', target: 1, reward: 10, title: 'Primeira vitória', desc: 'Vença 1 partida nos Desafios.' },
  { id: 'd-ia-win3', kind: 'daily', mode: 'ia', metric: 'win', target: 3, reward: 15, title: 'Em sequência', desc: 'Vença 3 partidas nos Desafios.' },
  { id: 'd-ia-play3', kind: 'daily', mode: 'ia', metric: 'play', target: 3, reward: 10, title: 'Treino do dia', desc: 'Jogue 3 partidas nos Desafios.' },
  { id: 'd-free-tactic5', kind: 'daily', mode: 'free', metric: 'tactic', target: 5, reward: 20, title: 'Mão de Tática', desc: 'Jogue 5 cartas Táticas.' },
  { id: 'd-free-summon8', kind: 'daily', mode: 'free', metric: 'summon', target: 8, reward: 20, title: 'Exército em campo', desc: 'Convoque 8 unidades.' },
  { id: 'd-free-equip3', kind: 'daily', mode: 'free', metric: 'equip', target: 3, reward: 20, title: 'Bem armados', desc: 'Equipe 3 cartas com armas.' },
  { id: 'd-rk-win1', kind: 'daily', mode: 'ranked', metric: 'win', target: 1, reward: 25, title: 'Subir na vida', desc: 'Vença 1 partida ranqueada.' },
  { id: 'd-rk-win3', kind: 'daily', mode: 'ranked', metric: 'win', target: 3, reward: 35, title: 'Dia de glória', desc: 'Vença 3 partidas ranqueadas.' },
  // ── Semanais (renovam na segunda-feira) ────────────────────────────────────
  { id: 'w-ia-win10', kind: 'weekly', mode: 'ia', metric: 'win', target: 10, reward: 60, title: 'Semana de guerra', desc: 'Vença 10 partidas nos Desafios.' },
  { id: 'w-ia-generals', kind: 'weekly', mode: 'ia', metric: 'win_generals', target: 3, reward: 80, title: 'Três bandeiras', desc: 'Vença com cada um dos 3 Generais.' },
  { id: 'w-free-equip10', kind: 'weekly', mode: 'free', metric: 'equip', target: 10, reward: 60, title: 'Arsenal', desc: 'Equipe 10 cartas com armas.' },
  { id: 'w-free-tactic20', kind: 'weekly', mode: 'free', metric: 'tactic', target: 20, reward: 60, title: 'Estratégia', desc: 'Jogue 20 cartas Táticas.' },
  { id: 'w-rk-win10', kind: 'weekly', mode: 'ranked', metric: 'win', target: 10, reward: 100, title: 'Escalada', desc: 'Vença 10 partidas ranqueadas.' },
  // ── De temporada (renovam com o ranqueado, 60 dias; o prêmio some e volta a cada temporada) ──
  { id: 's-ouro', kind: 'season', mode: 'ranked', metric: 'reach_league', target: 1, reward: 50, league: 'ouro', title: 'Chegue ao Ouro', desc: 'Alcance a liga Ouro.' },
  { id: 's-diamante', kind: 'season', mode: 'ranked', metric: 'reach_league', target: 1, reward: 100, league: 'diamante', title: 'Chegue ao Diamante', desc: 'Alcance a liga Diamante.' },
  { id: 's-senhor', kind: 'season', mode: 'ranked', metric: 'reach_league', target: 1, reward: 200, league: 'senhor-da-guerra', title: 'Senhor da Guerra', desc: 'Alcance a liga de topo.' },
  { id: 's-veterano', kind: 'season', mode: 'ranked', metric: 'play', target: 30, reward: 40, title: 'Veterano', desc: 'Jogue 30 partidas ranqueadas.' },
];

// Quantas missões de cada modo aparecem por dia (o sorteio acontece no servidor). Com as ranqueadas desligadas, a vaga ranqueada vira uma vaga "livre".
export const DAILY_SLOTS: Record<MissionMode, number> = { ia: 2, free: 2, ranked: 1 };
export const WEEKLY_SLOTS: Record<MissionMode, number> = { ia: 1, free: 1, ranked: 1 };
export const REROLLS_PER_DAY = 1;   // o jogador pode trocar 1 missão por dia
// Bônus único por divisão nova na temporada (a subida de liga é paga pelas missões de temporada acima).
export const DIVISION_BONUS = 10;

// Missões que valem agora: as ranqueadas só entram com a chave ligada.
export const missionsOf = (kind: MissionKind, rankedOn = RANKED_MISSIONS_ON): MissionDef[] => MISSIONS.filter(m => m.kind === kind && (m.mode !== 'ranked' || rankedOn));
// Vagas por modo, com a vaga ranqueada passando para "livre" quando as ranqueadas estão desligadas.
export const slotsFor = (kind: 'daily' | 'weekly', rankedOn = RANKED_MISSIONS_ON): Record<MissionMode, number> => {
  const s = { ...(kind === 'daily' ? DAILY_SLOTS : WEEKLY_SLOTS) };
  if (!rankedOn) { s.free += s.ranked; s.ranked = 0; }
  return s;
};
