'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({
            email,
            password,
          })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold">
          {mode === 'login' ? 'Вход' : 'Регистрация'}
        </h1>

        <p className="mt-2 text-sm text-neutral-400">
          Войди, чтобы управлять своими сайтами.
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-white"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-white py-3 font-medium text-black disabled:opacity-60"
        >
          {loading
            ? 'Подождите...'
            : mode === 'login'
              ? 'Войти'
              : 'Создать аккаунт'}
        </button>

        <button
          type="button"
          onClick={() =>
            setMode((current) => (current === 'login' ? 'register' : 'login'))
          }
          className="mt-5 w-full text-sm text-neutral-400 hover:text-white"
        >
          {mode === 'login'
            ? 'Нет аккаунта? Зарегистрироваться'
            : 'Уже есть аккаунт? Войти'}
        </button>
      </form>
    </main>
  );
}