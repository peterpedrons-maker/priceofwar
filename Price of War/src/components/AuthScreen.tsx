import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { signIn, signUp, upsertProfile, getProfile } from '../services/supabaseService';

interface AuthScreenProps {
  onAuthenticated: (user: { id: string; username: string; email: string }) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!username.trim()) throw new Error('Nome de usuário obrigatório');
        if (username.length < 3) throw new Error('Nome de usuário deve ter pelo menos 3 caracteres');
        const data = await signUp(email, password, username.trim());
        // If no session → email confirmation is still enabled in Supabase dashboard
        if (!data.session) {
          setError('❌ Confirmação de email está ativada no Supabase. Desative em: Authentication → Settings → Email → "Enable email confirmations" (OFF).');
          setLoading(false);
          return;
        }
        if (data.user) {
          // Profile is auto-created by the DB trigger (handle_new_user).
          // Attempt upsert only as a fallback if trigger hasn't run yet.
          try { await upsertProfile(data.user.id, username.trim()); } catch (_) { /* trigger already ran */ }
          onAuthenticated({ id: data.user.id, username: username.trim(), email });
        }
      } else {
        const data = await signIn(email, password);
        if (data.user) {
          const profile = await getProfile(data.user.id);
          const uname = profile?.username ?? email.split('@')[0];
          onAuthenticated({ id: data.user.id, username: uname, email });
        }
      }
    } catch (err: any) {
      const msg = err.message || 'Erro desconhecido';
      if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
        setError('Email ou senha incorretos.');
      } else if (msg.includes('Email not confirmed')) {
        setError('❌ Email não confirmado. Desative confirmação de email no Supabase: Authentication → Settings → Email → OFF.');
      } else if (msg.includes('already registered') || msg.includes('User already registered')) {
        setError('Email já cadastrado. Faça login.');
      } else if (msg.includes('relation') && msg.includes('does not exist')) {
        setError('❌ Tabela não encontrada. Execute o SQL em sql/schema.sql no Supabase SQL Editor.');
      } else if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setError('❌ Sem conexão com o Supabase. Verifique a URL no .env.local.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center z-[999] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(49,46,129,0.25)_0%,transparent_70%)] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative w-full max-w-sm"
      >
        <div className="bg-[#0e0b06] border border-[#8c7a5f]/40 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.1)]">
          <h1 className="text-3xl font-black text-center mb-1 text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 uppercase tracking-widest">Price of War</h1>
          <p className="text-[#8c7a5f] text-center text-xs mb-8 uppercase tracking-widest">Multiplayer Online</p>
          <div className="flex gap-1 mb-6 bg-black/30 p-1 rounded-xl">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${m === mode ? 'bg-[#8c7a5f]/40 text-[#d4af37]' : 'text-[#8c7a5f] hover:text-[#d4af37]'}`}>
                {m === 'login' ? 'Entrar' : 'Cadastrar'}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div key="username" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <input type="text" placeholder="Nome de usuário" value={username} onChange={e => setUsername(e.target.value)}
                    maxLength={20} className="w-full px-4 py-3 bg-[#1a1209] border border-[#8c7a5f]/30 rounded-xl text-[#d4af37] placeholder-[#8c7a5f]/50 focus:outline-none focus:border-[#d4af37]/60 text-sm" required />
                </motion.div>
              )}
            </AnimatePresence>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1209] border border-[#8c7a5f]/30 rounded-xl text-[#d4af37] placeholder-[#8c7a5f]/50 focus:outline-none focus:border-[#d4af37]/60 text-sm" required />
            <input type="password" placeholder="Senha (mín. 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)}
              minLength={6} className="w-full px-4 py-3 bg-[#1a1209] border border-[#8c7a5f]/30 rounded-xl text-[#d4af37] placeholder-[#8c7a5f]/50 focus:outline-none focus:border-[#d4af37]/60 text-sm" required />
            <AnimatePresence>
              {error && (<motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs text-center">{error}</motion.p>)}
            </AnimatePresence>
            <button type="submit" disabled={loading}
              className="py-3 bg-gradient-to-b from-[#d4af37] to-[#a07c1e] text-[#1a0b00] font-black uppercase tracking-widest rounded-xl hover:from-[#ffe066] hover:to-[#c49624] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_15px_rgba(212,175,55,0.3)]">
              {loading ? '...' : mode === 'login' ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>
          <p className="text-[#8c7a5f]/50 text-center text-xs mt-6">Sem confirmação de email - acesso imediato.</p>
        </div>
      </motion.div>
    </div>
  );
};
