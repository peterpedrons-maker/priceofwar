// Accounts. Two interchangeable back ends behind one small API, so the screens never care which one
// is active:
//  - "supabase": real accounts (Google, Discord, e-mail, anonymous guest). Used as soon as
//    VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY exist at build time.
//  - "local": no server yet. Only a guest session that lives in this browser, so the whole flow
//    (login -> profile -> menu) can be built and tried before the project is configured.
// The Supabase library is imported lazily, so a local-mode build never loads it.

export type AuthProvider = 'google' | 'discord' | 'email' | 'guest';
export type Session = { userId: string; provider: AuthProvider; email?: string; guest: boolean };
export type OAuthProvider = 'google' | 'discord';

const URL = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;
export const authMode: 'supabase' | 'local' = URL && KEY ? 'supabase' : 'local';

const LOCAL_SESSION_KEY = 'pow_session_v1';

let clientPromise: Promise<any> | null = null;
const client = () => {
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(URL!, KEY!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }));
  }
  return clientPromise;
};

const fromUser = (user: any): Session => {
  const provider = (user?.is_anonymous ? 'guest' : (user?.app_metadata?.provider ?? 'email')) as AuthProvider;
  return { userId: user.id, provider: ['google', 'discord', 'guest'].includes(provider) ? provider : 'email', email: user.email ?? undefined, guest: !!user.is_anonymous };
};

const readLocal = (): Session | null => {
  try { const raw = localStorage.getItem(LOCAL_SESSION_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
};
const writeLocal = (s: Session | null) => {
  try { if (s) localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(s)); else localStorage.removeItem(LOCAL_SESSION_KEY); } catch { /* storage blocked */ }
};
const localListeners = new Set<(s: Session | null) => void>();
const emitLocal = (s: Session | null) => localListeners.forEach(cb => cb(s));

export const getSession = async (): Promise<Session | null> => {
  if (authMode === 'local') return readLocal();
  const { data } = await (await client()).auth.getSession();
  return data.session?.user ? fromUser(data.session.user) : null;
};

// Calls back on every sign-in / sign-out (including the return from Google/Discord). Returns an unsubscribe.
export const onSessionChange = (cb: (s: Session | null) => void): (() => void) => {
  if (authMode === 'local') { localListeners.add(cb); return () => { localListeners.delete(cb); }; }
  let off = () => {};
  let cancelled = false;
  client().then(c => {
    if (cancelled) return;
    const { data } = c.auth.onAuthStateChange((_event: string, session: any) => cb(session?.user ? fromUser(session.user) : null));
    off = () => data.subscription.unsubscribe();
  });
  return () => { cancelled = true; off(); };
};

// Friendly Portuguese text for the errors people actually hit.
export const authErrorText = (err: any): string => {
  const msg = String(err?.message ?? err ?? '').toLowerCase();
  if (msg.includes('invalid login')) return 'E-mail ou senha incorretos.';
  if (msg.includes('already registered') || msg.includes('already been registered')) return 'Este e-mail já tem uma conta. Toque em "Entrar".';
  if (msg.includes('password') && msg.includes('6')) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (msg.includes('valid email') || msg.includes('invalid email')) return 'Digite um e-mail válido.';
  if (msg.includes('rate limit') || msg.includes('too many')) return 'Muitas tentativas. Espere um pouco e tente de novo.';
  if (msg.includes('anonymous') && msg.includes('disabled')) return 'O modo convidado está desligado no servidor.';
  if (msg.includes('provider') && msg.includes('not enabled')) return 'Esse login ainda não foi ativado no servidor.';
  if (msg.includes('failed to fetch') || msg.includes('network')) return 'Sem conexão com o servidor. Verifique sua internet.';
  return 'Não foi possível entrar. Tente de novo.';
};

export const signInOAuth = async (provider: OAuthProvider): Promise<void> => {
  if (authMode === 'local') throw new Error('provider not enabled');
  const redirectTo = `${window.location.origin}${(import.meta as any).env?.BASE_URL ?? '/'}`;
  const { error } = await (await client()).auth.signInWithOAuth({ provider, options: { redirectTo } });
  if (error) throw error;
};

export const signInEmail = async (email: string, password: string, mode: 'signin' | 'signup'): Promise<{ needsConfirmation: boolean }> => {
  if (authMode === 'local') throw new Error('provider not enabled');
  const c = await client();
  if (mode === 'signup') {
    const { data, error } = await c.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}${(import.meta as any).env?.BASE_URL ?? '/'}` } });
    if (error) throw error;
    return { needsConfirmation: !data.session };
  }
  const { error } = await c.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { needsConfirmation: false };
};

export const signInGuest = async (): Promise<void> => {
  if (authMode === 'local') {
    const s: Session = { userId: `local-${Math.random().toString(36).slice(2, 10)}`, provider: 'guest', guest: true };
    writeLocal(s);
    emitLocal(s);
    return;
  }
  const { error } = await (await client()).auth.signInAnonymously();
  if (error) throw error;
};

export const signOut = async (): Promise<void> => {
  if (authMode === 'local') { writeLocal(null); emitLocal(null); return; }
  await (await client()).auth.signOut();
};
