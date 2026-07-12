'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import LogoMark from '@/components/logo-mark';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  const links = [
    { href: '/exercises', label: 'EXERCIȚII' },
    { href: '/workouts', label: 'PLANURI' },
    { href: '/dashboard', label: 'DASHBOARD' },
    { href: '/workout', label: 'TRACKER' },
    { href: '/progress', label: 'PROGRES' },
    { href: '/nutrition', label: 'NUTRIȚIE' },
    { href: '/profile', label: 'PROFIL' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-void/85 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Bandă hazard — semnătura de sus a paginii */}
      <div className="h-[3px] stripes" />

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <LogoMark className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="font-display text-xl tracking-wide select-none leading-none uppercase">
            <span className="text-white">TITAN</span>
            <span className="text-ember"> ACADEMY</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5 h-full">
          {links.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative h-full flex items-center px-4 text-[11px] font-black tracking-[0.2em] transition-colors ${
                  active ? 'text-ember' : 'text-zinc-500 hover:text-white'
                }`}
              >
                {label}
                <span
                  className={`absolute bottom-0 left-3 right-3 h-[2px] bg-ember transition-transform origin-left ${
                    active ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-[11px] font-bold text-zinc-600 tracking-wider max-w-[160px] truncate">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-[11px] font-black tracking-[0.2em] text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 transition-all"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 text-[11px] font-black tracking-[0.2em] bg-ember text-black hover:bg-orange-400 transition-all chamfer-sm"
            >
              AUTENTIFICARE
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="md:hidden flex flex-col gap-[5px] p-2"
          aria-label="Meniu"
        >
          <span className={`block w-5 h-[2px] bg-white transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-[2px] bg-white transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[2px] bg-white transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-void px-6 py-4 flex flex-col gap-1">
          {links.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 text-[11px] font-black tracking-[0.2em] border-l-2 transition-all ${
                  active
                    ? 'text-ember border-ember bg-ember/5'
                    : 'text-zinc-400 border-transparent hover:text-white hover:border-zinc-700'
                }`}
              >
                {label}
              </Link>
            );
          })}
          <div className="border-t border-white/5 mt-2 pt-4">
            {user ? (
              <>
                <p className="text-[10px] text-zinc-600 font-bold tracking-wider mb-3 truncate">{user.email}</p>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full px-4 py-3 text-[11px] font-black tracking-[0.2em] text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 transition-all text-left"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-[11px] font-black tracking-[0.2em] bg-ember text-black hover:bg-orange-400 transition-all text-center chamfer-sm"
              >
                AUTENTIFICARE
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
