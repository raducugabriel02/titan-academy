'use client';
import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Mode = 'login' | 'register' | 'forgot';

function LoginContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(
    searchParams.get('error') === 'oauth'
      ? { type: 'error', text: 'Autentificarea cu Google a eșuat. Încearcă din nou.' }
      : null
  );

  function switchMode(next: Mode) {
    setMode(next);
    setMessage(null);
    setPassword('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setMessage(
        error
          ? { type: 'error', text: 'Nu am putut trimite emailul. Încearcă din nou.' }
          : { type: 'success', text: 'Email trimis! Verifică inbox-ul pentru link-ul de resetare.' }
      );
      setLoading(false);
      return;
    }

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: 'error', text: 'Email sau parolă incorectă. Încearcă din nou.' });
      } else {
        window.location.href = '/dashboard';
      }
    } else {
      if (password.length < 8) {
        setMessage({ type: 'error', text: 'Parola trebuie să aibă cel puțin 8 caractere.' });
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: '✓ Cont creat! Verifică emailul pentru confirmare.' });
      }
    }

    setLoading(false);
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: 'select_account' },
      },
    });
    if (error) {
      setMessage({ type: 'error', text: 'Nu am putut porni autentificarea cu Google. Încearcă din nou.' });
    }
  }

  const strength =
    password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#ef4444', '#f97316', '#22c55e'];
  const strengthLabels = ['', 'Slabă', 'Medie', 'Puternică'];

  return (
    <div className="relative min-h-screen bg-void text-white overflow-hidden flex items-center justify-center px-6">

      <div
        className="absolute inset-0 z-0 opacity-10 bg-cover bg-center grayscale scale-110"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-void via-void/80 to-void" />
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.025] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-orange-500/40 to-transparent z-20 pointer-events-none" />

      <Link
        href="/"
        className="absolute top-8 left-8 z-30 text-[10px] font-black tracking-[0.4em] text-zinc-600 hover:text-orange-500 transition-colors uppercase flex items-center gap-2"
      >
        ← ACASĂ
      </Link>

      <div className="relative z-30 w-full max-w-[420px] py-16">

        <div className="text-center mb-10">
          <h1 className="font-display italic uppercase text-5xl leading-none select-none rise">
            <span className="text-white">TITAN</span>{' '}
            <span className="text-ember">ACADEMY</span>
          </h1>
          <p className="text-zinc-600 text-[10px] font-black tracking-[0.5em] uppercase mt-3">
            {mode === 'login' && 'Bine ai revenit, campion'}
            {mode === 'register' && 'Începe-ți transformarea'}
            {mode === 'forgot' && 'Resetare parolă'}
          </p>
        </div>

        {mode !== 'forgot' && (
          <div className="flex bg-zinc-950 border border-zinc-900 p-1 mb-8">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                  mode === m
                    ? 'bg-ember text-black chamfer-sm'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Autentificare' : 'Cont Nou'}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="tu@exemplu.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500/60 focus:bg-zinc-900/80 transition-all font-mono"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">
                  Parolă
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-[10px] font-black text-zinc-600 hover:text-orange-500 transition-colors uppercase tracking-wider"
                  >
                    Ai uitat parola?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 pr-20 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500/60 focus:bg-zinc-900/80 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black tracking-widest uppercase text-zinc-600 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? 'ASCUNDE' : 'ARATĂ'}
                </button>
              </div>

              {mode === 'register' && password.length > 0 && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="h-[3px] flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? strengthColors[strength] : '#27272a' }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-[9px] font-black uppercase tracking-widest"
                    style={{ color: strengthColors[strength] }}
                  >
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>
          )}

          {message && (
            <div className={`px-4 py-3 rounded-xl text-xs font-bold border ${
              message.type === 'error'
                ? 'bg-red-500/5 border-red-500/20 text-red-400'
                : 'bg-green-500/5 border-green-500/20 text-green-400'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-ember text-black font-black text-base italic uppercase tracking-tight hover:bg-orange-400 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 mt-1 chamfer"
          >
            {loading
              ? 'SE PROCESEAZĂ...'
              : mode === 'login'
              ? 'INTRĂ ÎN ARENĂ →'
              : mode === 'register'
              ? 'CREEAZĂ CONTUL →'
              : 'TRIMITE LINK DE RESETARE →'}
          </button>

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="w-full py-3 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
            >
              ← Înapoi la autentificare
            </button>
          )}
        </form>

        {mode !== 'forgot' && (
          <>
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-zinc-900" />
              <span className="text-[10px] font-black text-zinc-700 tracking-widest uppercase">sau</span>
              <div className="flex-1 h-[1px] bg-zinc-900" />
            </div>
            <button
              onClick={handleGoogle}
              className="w-full py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:border-zinc-700 hover:text-white transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuă cu Google
            </button>
          </>
        )}

        <p className="text-center text-[10px] text-zinc-800 font-black tracking-wider uppercase mt-10">
          © 2026 TITAN ACADEMY
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}