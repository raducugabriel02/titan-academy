'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Parolele nu coincid.' });
      return;
    }
    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Parola trebuie să aibă cel puțin 8 caractere.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage({ type: 'error', text: 'Nu am putut actualiza parola. Link-ul poate fi expirat.' });
    } else {
      setMessage({ type: 'success', text: '✓ Parolă actualizată! Te redirecționăm...' });
      setTimeout(() => router.push('/dashboard'), 2000);
    }

    setLoading(false);
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
        href="/login"
        className="absolute top-8 left-8 z-30 text-[10px] font-black tracking-[0.4em] text-zinc-600 hover:text-orange-500 transition-colors uppercase flex items-center gap-2"
      >
        ← AUTENTIFICARE
      </Link>

      <div className="relative z-30 w-full max-w-[420px] py-16">

        <div className="text-center mb-10">
          <h1 className="font-display italic uppercase text-5xl leading-none select-none rise">
            <span className="text-white">TITAN</span>{' '}
            <span className="text-ember">ACADEMY</span>
          </h1>
          <p className="text-zinc-600 text-[10px] font-black tracking-[0.5em] uppercase mt-3">
            Setează o parolă nouă
          </p>
        </div>

        {!sessionReady ? (
          <div className="text-center space-y-6">
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <p className="text-zinc-400 text-sm leading-relaxed">
                Așteptăm confirmarea link-ului din email...
              </p>
              <p className="text-zinc-600 text-xs mt-3">
                Dacă ai ajuns aici direct, accesează link-ul din emailul de resetare.
              </p>
            </div>
            <Link
              href="/login"
              className="block w-full py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-zinc-700 transition-all text-center"
            >
              ← Înapoi la autentificare
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">
                  Parolă nouă
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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
              {password.length > 0 && (
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

            <div>
              <label className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase block mb-2">
                Confirmă parola
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full bg-zinc-950 border rounded-xl px-5 py-4 text-sm text-white placeholder-zinc-700 focus:outline-none transition-all font-mono ${
                  confirmPassword.length > 0 && confirmPassword !== password
                    ? 'border-red-500/40 focus:border-red-500/60'
                    : 'border-zinc-800 focus:border-orange-500/60 focus:bg-zinc-900/80'
                }`}
              />
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <p className="text-[10px] text-red-400 font-bold mt-1 tracking-wider">Parolele nu coincid</p>
              )}
            </div>

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
              disabled={loading || (confirmPassword.length > 0 && confirmPassword !== password)}
              className="w-full py-5 bg-ember text-black font-black text-base italic uppercase tracking-tight hover:bg-orange-400 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 mt-1 chamfer"
            >
              {loading ? 'SE PROCESEAZĂ...' : 'SALVEAZĂ PAROLA NOUĂ →'}
            </button>
          </form>
        )}

        <p className="text-center text-[10px] text-zinc-800 font-black tracking-wider uppercase mt-10">
          © 2026 TITAN ACADEMY
        </p>
      </div>
    </div>
  );
}
