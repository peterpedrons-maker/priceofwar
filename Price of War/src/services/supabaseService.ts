import { supabase } from '../lib/supabase';

// ── Auth ────────────────────────────────────────────────────────────────────

export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export function subscribeToAuthChanges(cb: (user: any) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(session?.user ?? null);
  });
  return data.subscription.unsubscribe;
}

// ── Profiles ─────────────────────────────────────────────────────────────────

export async function getProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) return null;
  return data;
}

export async function upsertProfile(userId: string, username: string) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, username }, { onConflict: 'id' });
  if (error) throw error;
}

// ── Lobby ────────────────────────────────────────────────────────────────────

export async function joinLobby(userId: string, username: string, selectedDeck: string) {
  const { error } = await supabase.from('lobby').upsert(
    { user_id: userId, username, selected_deck: selectedDeck, status: 'available', updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );
  if (error) throw error;
}

export async function leaveLobby(userId: string) {
  await supabase.from('lobby').delete().eq('user_id', userId);
}

export async function getLobbyPlayers() {
  const { data, error } = await supabase
    .from('lobby')
    .select('*')
    .eq('status', 'available')
    .order('updated_at', { ascending: false });
  if (error) return [];
  return data;
}

export function subscribeLobby(cb: (players: any[]) => void) {
  const channel = supabase
    .channel('lobby-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'lobby' }, async () => {
      const players = await getLobbyPlayers();
      cb(players);
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}

// ── Challenges ────────────────────────────────────────────────────────────────

export async function sendChallenge(
  challengerId: string, challengerUsername: string, challengerDeck: string,
  challengedId: string, challengedUsername: string
) {
  const { data, error } = await supabase.from('challenges').insert({
    challenger_id: challengerId,
    challenger_username: challengerUsername,
    challenger_deck: challengerDeck,
    challenged_id: challengedId,
    challenged_username: challengedUsername,
    status: 'pending',
  }).select().single();
  if (error) throw error;
  return data;
}

export async function respondToChallenge(challengeId: string, accept: boolean) {
  const { error } = await supabase.from('challenges')
    .update({ status: accept ? 'accepted' : 'declined' })
    .eq('id', challengeId);
  if (error) throw error;
}

export async function getChallengeById(challengeId: string) {
  const { data } = await supabase.from('challenges').select('*').eq('id', challengeId).maybeSingle();
  return data;
}

export async function getIncomingPendingChallenge(userId: string) {
  const { data } = await supabase
    .from('challenges')
    .select('*')
    .eq('challenged_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getActiveGameForUser(userId: string) {
  const { data } = await supabase
    .from('games')
    .select('*')
    .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export function subscribeToChallenge(userId: string, cb: (challenge: any) => void) {
  // Unique channel name to avoid duplicate subscription conflicts
  const channelName = `challenges-${userId}-${Math.random().toString(36).slice(2)}`;
  const channel = supabase
    .channel(channelName)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'challenges',
      filter: `challenged_id=eq.${userId}`,
    }, (payload) => cb(payload.new))
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'challenges',
      filter: `challenger_id=eq.${userId}`,
    }, (payload) => cb(payload.new))
    .subscribe();
  return () => supabase.removeChannel(channel);
}

// ── Games ─────────────────────────────────────────────────────────────────────

export interface OnlineGameState {
  p1_slots: any[];
  p2_slots: any[];
  p1_hp: number;
  p2_hp: number;
  p1_mana: number;
  p2_mana: number;
  p1_hand_count: number;
  p2_hand_count: number;
  p1_graveyard: any[];
  p2_graveyard: any[];
  active_player: 'p1' | 'p2';
  turn_phase: string;
  turn_number: number;
  last_action?: any;
  status?: string;
  winner_id?: string | null;
}

export async function createGame(
  p1Id: string, p1Username: string, p1Deck: string,
  p2Id: string, p2Username: string, p2Deck: string
) {
  const { data, error } = await supabase.from('games').insert({
    player1_id: p1Id,
    player2_id: p2Id,
    player1_username: p1Username,
    player2_username: p2Username,
    player1_deck: p1Deck,
    player2_deck: p2Deck,
    p1_slots: Array(13).fill(null),
    p2_slots: Array(13).fill(null),
    p1_hp: 20,
    p2_hp: 20,
    p1_mana: 15,
    p2_mana: 15,
    p1_hand_count: 0,
    p2_hand_count: 0,
    p1_graveyard: [],
    p2_graveyard: [],
    active_player: 'p1',
    turn_phase: 'command',
    turn_number: 1,
    status: 'active',
  }).select().single();
  if (error) throw error;
  return data;
}

export async function updateGameState(gameId: string, state: Partial<OnlineGameState>) {
  const { error } = await supabase.from('games')
    .update({ ...state, updated_at: new Date().toISOString() })
    .eq('id', gameId);
  if (error) throw error;
}

export async function getGame(gameId: string) {
  const { data, error } = await supabase.from('games').select('*').eq('id', gameId).single();
  if (error) return null;
  return data;
}

export function subscribeToGame(gameId: string, cb: (state: any) => void) {
  const channel = supabase
    .channel(`game-${gameId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'games',
      filter: `id=eq.${gameId}`,
    }, (payload) => cb(payload.new))
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function setLobbyStatus(userId: string, status: string) {
  await supabase.from('lobby').update({ status, updated_at: new Date().toISOString() }).eq('user_id', userId);
}

export async function findAvailableOpponent(userId: string) {
  const { data } = await supabase
    .from('lobby')
    .select('*')
    .eq('status', 'available')
    .neq('user_id', userId)
    .order('updated_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  return data;
}
