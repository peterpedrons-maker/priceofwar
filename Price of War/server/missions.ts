// Missões no servidor: sorteio por dia/semana/temporada, contagem pelos eventos da partida, coleta e troca. Os dados (o que cada missão pede e paga) ficam em src/engine/missions.ts.
// O estado de cada período é uma linha JSON (tabela `missions`, SQL 12) com versão: toda escrita é "só se ninguém mudou antes", então coletar duas vezes não paga duas vezes.
import { LEAGUES, leagueIndex } from '../src/engine/ranked';
import { MISSIONS, REROLLS_PER_DAY, missionsOf, slotsFor, type MissionDef, type MissionMode } from '../src/engine/missions';
import { dayKey } from './types';
import type { Db } from './types';

export interface MissionItem { id: string; progress: number; claimed: boolean; gens?: string[] }
export interface MissionState { items: MissionItem[]; rerolls: number }
export interface MissionView { key: string; id: string; title: string; desc: string; reward: number; target: number; progress: number; claimed: boolean; mode: MissionMode; metric: string; reroll: boolean }
export interface MissionsBoard {
  daily: MissionView[]; weekly: MissionView[]; season: MissionView[];
  rerollsLeft: number; dayEndsAt: number; weekEndsAt: number; claimable: number;
}

const BR = 3 * 3600e3;   // Brasília = UTC-3
export const weekStart = (ms: number): string => { const d = new Date(ms - BR); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d.toISOString().slice(0, 10); };
export const dayEndsAt = (ms: number) => Date.parse(`${dayKey(ms)}T00:00:00Z`) + 86400e3 + BR;
export const weekEndsAt = (ms: number) => Date.parse(`${weekStart(ms)}T00:00:00Z`) + 7 * 86400e3 + BR;

// Sorteio repetível (mesmo jogador + mesmo período = mesmas missões, mesmo se a linha for recriada).
const seedOf = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const rngOf = (seed: number) => () => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const shuffled = <T,>(a: T[], rand: () => number): T[] => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

export const drawMissions = (kind: 'daily' | 'weekly' | 'season', userId: string, key: string, rankedOn: boolean): MissionItem[] => {
  if (kind === 'season') return missionsOf('season', rankedOn).map(m => ({ id: m.id, progress: 0, claimed: false }));
  const rand = rngOf(seedOf(`${userId}|${key}`)), slots = slotsFor(kind, rankedOn), out: MissionItem[] = [];
  for (const mode of ['ia', 'free', 'ranked'] as MissionMode[]) {
    const pool = shuffled(missionsOf(kind, rankedOn).filter(m => m.mode === mode), rand);
    pool.slice(0, slots[mode]).forEach(m => out.push({ id: m.id, progress: 0, claimed: false }));
  }
  return out;
};

const defOf = (id: string): MissionDef | undefined => MISSIONS.find(m => m.id === id);
const kindOfKey = (key: string): 'daily' | 'weekly' | 'season' | null => key.startsWith('d:') ? 'daily' : key.startsWith('w:') ? 'weekly' : key.startsWith('s:') ? 'season' : null;

// Lê o estado de um período, criando (sorteando) se ainda não existe. Lança se a tabela não está disponível.
const load = async (db: Db, userId: string, key: string, rankedOn: boolean): Promise<{ data: MissionState; version: number }> => {
  const kind = kindOfKey(key)!;
  let row = await db.missionsGet(userId, key);
  if (!row) {
    await db.missionsPut(userId, key, { items: drawMissions(kind, userId, key, rankedOn), rerolls: 0 }, 0);
    row = await db.missionsGet(userId, key);
    if (!row) throw new Error('missions unavailable');
  }
  return row;
};
// Muda um período com tentativas (outra requisição pode ter escrito no meio).
const mutate = async (db: Db, userId: string, key: string, rankedOn: boolean, fn: (s: MissionState) => string | null): Promise<string | null> => {
  for (let i = 0; i < 4; i++) {
    const row = await load(db, userId, key, rankedOn), s: MissionState = JSON.parse(JSON.stringify(row.data));
    const err = fn(s);
    if (err) return err;
    if (await db.missionsPut(userId, key, s, row.version)) return null;
  }
  return 'Tente de novo.';
};

export const keysAt = (now: number, season: number) => ({ daily: `d:${dayKey(now)}`, weekly: `w:${weekStart(now)}`, season: `s:${season}` });

export interface MatchFacts { vsBot: boolean; ranked: boolean; won: boolean; general: string; tactic: number; summon: number; equip: number }
// Conta uma partida válida (paga uma vez só, na hora do prêmio) nas missões do dia, da semana e da temporada.
export const countMatch = async (db: Db, userId: string, now: number, season: number, f: MatchFacts, rankedOn: boolean) => {
  const keys = keysAt(now, season);
  for (const key of [keys.daily, keys.weekly, ...(rankedOn ? [keys.season] : [])]) {
    await mutate(db, userId, key, rankedOn, s => {
      for (const it of s.items) {
        const d = defOf(it.id); if (!d || it.claimed || it.progress >= d.target) continue;
        if ((d.mode === 'ia' && !f.vsBot) || (d.mode === 'ranked' && !f.ranked)) continue;
        if (d.metric === 'win') it.progress += f.won ? 1 : 0;
        else if (d.metric === 'play') it.progress += 1;
        else if (d.metric === 'tactic') it.progress += f.tactic;
        else if (d.metric === 'summon') it.progress += f.summon;
        else if (d.metric === 'equip') it.progress += f.equip;
        else if (d.metric === 'win_generals' && f.won) { it.gens = it.gens ?? []; if (!it.gens.includes(f.general)) it.gens.push(f.general); it.progress = it.gens.length; }
        it.progress = Math.min(it.progress, d.target);
      }
      return null;
    }).catch(() => null);
  }
};

const viewOf = (key: string, it: MissionItem, canReroll: boolean): MissionView | null => {
  const d = defOf(it.id); if (!d) return null;
  return { key, id: d.id, title: d.title, desc: d.desc, reward: d.reward, target: d.target, progress: it.progress, claimed: it.claimed, mode: d.mode, metric: d.metric, reroll: canReroll && !it.claimed && it.progress < d.target };
};

// A liga mais alta da temporada vale para as missões "chegue à liga X".
const syncSeason = async (db: Db, userId: string, key: string, peakPoints: number, rankedOn: boolean) => {
  if (!rankedOn) return;
  const have = leagueIndex(peakPoints);
  await mutate(db, userId, key, rankedOn, s => {
    let changed = false;
    for (const it of s.items) { const d = defOf(it.id); if (d?.metric === 'reach_league' && !it.claimed && it.progress < 1) { const want = d.league === 'senhor-da-guerra' ? LEAGUES.length - 1 : LEAGUES.indexOf(d.league as any); if (have >= want) { it.progress = 1; changed = true; } } }
    return changed ? null : 'sem mudança';
  });
};

export const board = async (db: Db, userId: string, now: number, season: number, peakPoints: number, rankedOn: boolean): Promise<MissionsBoard> => {
  const keys = keysAt(now, season);
  if (rankedOn) await syncSeason(db, userId, keys.season, peakPoints, rankedOn);
  const d = await load(db, userId, keys.daily, rankedOn), w = await load(db, userId, keys.weekly, rankedOn);
  const s = rankedOn ? await load(db, userId, keys.season, rankedOn) : null;
  const left = Math.max(0, REROLLS_PER_DAY - d.data.rerolls);
  const daily = d.data.items.map(i => viewOf(keys.daily, i, left > 0)).filter((x): x is MissionView => !!x);
  const weekly = w.data.items.map(i => viewOf(keys.weekly, i, false)).filter((x): x is MissionView => !!x);
  const season_ = (s?.data.items ?? []).map(i => viewOf(keys.season, i, false)).filter((x): x is MissionView => !!x);
  const claimable = [...daily, ...weekly, ...season_].filter(m => !m.claimed && m.progress >= m.target).length;
  return { daily, weekly, season: season_, rerollsLeft: left, dayEndsAt: dayEndsAt(now), weekEndsAt: weekEndsAt(now), claimable };
};

// Coleta: marca como paga (só se ninguém mudou antes) e depois credita. Devolve as coroas pagas.
export const claim = async (db: Db, userId: string, now: number, season: number, key: string, id: string, rankedOn: boolean): Promise<{ paid: number; coroas_after: number } | string> => {
  const keys = keysAt(now, season);
  if (![keys.daily, keys.weekly, keys.season].includes(key)) return 'Essa missão já expirou.';
  let paid = 0;
  const err = await mutate(db, userId, key, rankedOn, s => {
    const it = s.items.find(x => x.id === id), d = defOf(id);
    if (!it || !d) return 'Missão não encontrada.';
    if (it.claimed) return 'Essa missão já foi coletada.';
    if (it.progress < d.target) return 'Essa missão ainda não foi cumprida.';
    it.claimed = true; paid = d.reward; return null;
  });
  if (err) return err;
  const after = await db.grantCoroas(userId, paid);
  if (after === null) return 'Não foi possível pagar agora.';
  return { paid, coroas_after: after };
};

// Troca: só missão diária ainda não cumprida, 1 por dia; a nova vem do mesmo modo e não repete as que já estão no quadro.
export const reroll = async (db: Db, userId: string, now: number, season: number, id: string, rankedOn: boolean): Promise<string | null> => {
  const key = keysAt(now, season).daily;
  return mutate(db, userId, key, rankedOn, s => {
    if (s.rerolls >= REROLLS_PER_DAY) return 'Você já trocou uma missão hoje.';
    const i = s.items.findIndex(x => x.id === id), old = i >= 0 ? defOf(id) : undefined;
    if (i < 0 || !old) return 'Missão não encontrada.';
    if (s.items[i].claimed || s.items[i].progress >= old.target) return 'Só dá para trocar missões ainda não cumpridas.';
    const have = new Set(s.items.map(x => x.id));
    const pool = shuffled(missionsOf('daily', rankedOn).filter(m => m.mode === old.mode && !have.has(m.id)), rngOf(seedOf(`${userId}|${key}|${s.rerolls}`)));
    if (!pool.length) return 'Não há outra missão desse tipo para trocar.';
    s.items[i] = { id: pool[0].id, progress: 0, claimed: false }; s.rerolls += 1; return null;
  });
};
