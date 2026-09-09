import React, { useState } from 'react';
import { loginWithEmail, registerWithEmail, loginWithGoogle, resetPassword } from '../services/authService';

export const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email to reset password.');
      return;
    }
    try {
      await resetPassword(email);
      setMessage('Password reset email sent!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 text-white p-4">
      <h1 className="text-4xl font-bold mb-8 text-indigo-400">
        {isLogin ? 'Login' : 'Register'}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 bg-zinc-800 rounded border border-zinc-600"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 bg-zinc-800 rounded border border-zinc-600"
          required
        />
        <button type="submit" className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded font-bold">
          {isLogin ? 'Login' : 'Register'}
        </button>
        <button type="button" onClick={handleGoogleLogin} className="p-3 bg-white text-black hover:bg-zinc-200 rounded font-bold">
          Login with Google
        </button>
        {isLogin && (
          <button type="button" onClick={handleResetPassword} className="text-sm text-indigo-400 hover:underline">
            Forgot Password?
          </button>
        )}
        <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-zinc-400 hover:underline">
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
};
