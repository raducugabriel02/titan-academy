import Link from 'next/link';
import LogoMark from '@/components/logo-mark';

function IconDumbbell({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 5v14M18 5v14M6 12h12M3 8h3M3 16h3M18 8h3M18 16h3" />
    </svg>
  );
}

function IconChart({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 3v18h18" />
      <path d="M7 16v-3M11 16V8m4 8v-5" />
    </svg>
  );
}

function IconTarget({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconArrow({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

const stats = [
  { value: '200+', label: 'Exerciții' },
  { value: '50+', label: 'Categorii' },
  { value: '24/7', label: 'Acces' },
  { value: '100%', label: 'Gratuit' },
];

const features = [
  {
    Icon: IconDumbbell,
    index: '01',
    title: 'Arsenal de Exerciții',
    description: 'Bibliotecă completă clasificată pe grupe musculare, echipament și nivel de dificultate. Tot ce ai nevoie într-un singur loc.',
    href: '/exercises',
    tag: 'Exerciții',
  },
  {
    Icon: IconChart,
    index: '02',
    title: 'Workout Tracker',
    description: 'Înregistrează fiecare set, repetiție și greutate. Urmărește-ți evoluția și doboară recorduri personale.',
    href: '/workout',
    tag: 'Tracker',
  },
  {
    Icon: IconTarget,
    index: '03',
    title: 'Dashboard Pro',
    description: 'Vizualizează statisticile, analizează tendințele și optimizează-ți programul bazat pe date reale.',
    href: '/dashboard',
    tag: 'Analiză',
  },
];

const MARQUEE_WORDS = ['DISCIPLINĂ', 'PUTERE', 'CONSECVENȚĂ', 'PROGRES', 'FORȚĂ', 'FOCUS'];

export default function Home() {
  return (
    <div className="bg-void text-white">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col overflow-hidden">

        {/* Background image */}
        <div
          className="absolute inset-0 z-0 opacity-[0.14] bg-cover bg-center grayscale"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-void/60 via-transparent to-void" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-void/70 via-transparent to-void/70" />

        {/* Ghost mega text în fundal */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
          <span className="font-display text-ghost uppercase leading-none text-[38vw] md:text-[30vw] tracking-tight translate-y-[-6%]">
            TITAN
          </span>
        </div>

        {/* Left decoration */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2 opacity-25 z-20">
          <div className="flex items-end gap-1 h-20">
            {[30, 80, 45, 100, 70, 90, 50].map((h, i) => (
              <div key={i} style={{ height: `${h}%` }} className="w-1.5 bg-ember" />
            ))}
          </div>
          <p className="text-[9px] font-black tracking-widest text-zinc-600 uppercase">Power Output</p>
        </div>

        {/* Right decoration */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 opacity-25 z-20 text-right">
          <div>
            <p className="font-display text-3xl leading-none">40+</p>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">Ghiduri Pro</p>
          </div>
          <div className="h-px w-10 bg-zinc-800 ml-auto" />
          <div>
            <p className="font-display text-3xl leading-none">24/7</p>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">Acces Arenă</p>
          </div>
        </div>

        {/* Hero content */}
        <main className="relative z-30 flex-1 flex flex-col items-center justify-center text-center px-6 py-24">

          {/* Badge */}
          <div className="mb-8 rise" style={{ '--rise-delay': '0ms' } as React.CSSProperties}>
            <span className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 border border-ember/25 bg-ember/5 text-[10px] sm:text-[11px] font-black tracking-[0.2em] sm:tracking-[0.4em] text-orange-400 uppercase chamfer-sm whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-ember shrink-0" />
              Antrenament · Nutriție · Progres
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display italic uppercase leading-[0.9] mb-8 rise" style={{ '--rise-delay': '90ms' } as React.CSSProperties}>
            <span className="text-white block text-7xl md:text-[130px]">TITAN</span>
            <span className="text-ember block text-7xl md:text-[130px]">ACADEMY</span>
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-400 max-w-md mx-auto text-sm md:text-base font-semibold uppercase tracking-[0.18em] mb-10 leading-relaxed rise" style={{ '--rise-delay': '180ms' } as React.CSSProperties}>
            Arsenalul tău digital pentru{' '}
            <span className="text-white border-b-2 border-ember/70">performanță maximă</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm sm:max-w-none sm:w-auto rise" style={{ '--rise-delay': '270ms' } as React.CSSProperties}>
            <Link
              href="/exercises"
              className="w-full sm:w-auto px-10 py-5 bg-ember text-black font-black text-sm italic uppercase tracking-tight hover:bg-orange-400 transition-all hover:scale-[1.03] active:scale-95 whitespace-nowrap chamfer"
            >
              EXPLOREAZĂ ARSENALUL
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-10 py-5 bg-zinc-900/70 border border-zinc-800 backdrop-blur-sm text-white font-black text-sm italic uppercase tracking-tight hover:bg-zinc-800/80 hover:border-zinc-700 transition-all flex items-center justify-center gap-3 group whitespace-nowrap"
            >
              CONTUL MEU
              <IconArrow className="w-4 h-4 text-ember group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-25">
            <div className="w-px h-10 bg-gradient-to-b from-transparent to-zinc-400" />
            <div className="w-px h-2 bg-zinc-400" />
          </div>
        </main>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────── */}
      <div className="relative border-y border-white/[0.06] bg-[#0a0a0a] overflow-hidden py-4 select-none" aria-hidden>
        <div className="flex w-max animate-marquee">
          {[0, 1].map(copy => (
            <div key={copy} className="flex shrink-0 items-center">
              {MARQUEE_WORDS.map(word => (
                <span key={`${copy}-${word}`} className="flex items-center gap-6 mx-6">
                  <span className="font-display uppercase text-2xl text-zinc-800">{word}</span>
                  <span className="w-2 h-2 bg-ember/60 rotate-45 shrink-0" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS STRIP ──────────────────────────────────────────── */}
      <div className="border-b border-white/[0.06] bg-zinc-950/80">
        <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }, i) => (
            <div key={label} className={`text-center ${i < stats.length - 1 ? 'md:border-r md:border-white/[0.06]' : ''}`}>
              <p className="font-display text-3xl md:text-4xl text-white">{value}</p>
              <p className="text-[10px] font-black tracking-[0.35em] text-zinc-600 uppercase mt-2">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-[10px] font-black tracking-[0.5em] text-ember uppercase mb-4">
            Tot ce ai nevoie
          </p>
          <h2 className="font-display italic uppercase text-3xl md:text-5xl leading-tight pb-1">
            Echipamentul tău <span className="text-ember">digital</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {features.map(({ Icon, index, title, description, href, tag }) => (
            <Link
              key={href}
              href={href}
              className="group relative p-8 bg-zinc-950 border border-zinc-900 hover:border-ember/30 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col notch overflow-hidden"
            >
              {/* Ghost index */}
              <span className="absolute -top-3 -right-2 font-display text-7xl text-ghost group-hover:text-ghost-ember transition-all select-none" aria-hidden>
                {index}
              </span>

              {/* Tag */}
              <span className="absolute bottom-8 right-8 text-[9px] font-black tracking-[0.3em] text-zinc-700 uppercase group-hover:text-ember/50 transition-colors">
                {tag}
              </span>

              {/* Icon */}
              <div className="w-11 h-11 bg-ember/10 border border-ember/15 flex items-center justify-center text-ember mb-6 group-hover:bg-ember/15 group-hover:border-ember/30 transition-all chamfer-sm">
                <Icon />
              </div>

              {/* Text */}
              <h3 className="font-display uppercase text-lg tracking-wide mb-3">
                {title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed flex-1">
                {description}
              </p>

              {/* Link */}
              <div className="mt-6 flex items-center gap-2 text-[11px] font-black tracking-wider text-zinc-700 uppercase group-hover:text-ember transition-colors">
                Accesează
                <IconArrow className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto bg-zinc-950 border border-zinc-900 px-6 py-14 md:px-20 md:py-20 text-center relative notch">
          {/* Bandă hazard jos */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] stripes opacity-60" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-px bg-gradient-to-r from-transparent via-ember/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-ember/[0.04] via-transparent to-transparent" />
          </div>

          <p className="relative z-10 text-[10px] font-black tracking-[0.5em] text-ember uppercase mb-4">
            Acces Gratuit
          </p>
          <h2 className="relative z-10 font-display italic uppercase text-2xl sm:text-3xl md:text-5xl leading-tight mb-6">
            <span className="block">Începe transformarea</span>
            <span className="text-ember block">astăzi</span>
          </h2>
          <p className="relative z-10 text-zinc-500 text-sm mb-10 max-w-xs mx-auto leading-relaxed">
            Înregistrare gratuită. Acces instant la toate instrumentele de antrenament.
          </p>
          <Link
            href="/login"
            className="relative z-10 inline-flex items-center gap-3 px-12 py-5 bg-ember text-black font-black text-sm italic uppercase tracking-tight hover:bg-orange-400 transition-all hover:scale-[1.03] active:scale-95 chamfer"
          >
            CREEAZĂ CONT GRATUIT
            <IconArrow className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <span className="flex items-center gap-2.5 select-none">
            <LogoMark className="w-5 h-5" />
            <span className="font-display text-lg uppercase leading-none">
              <span className="text-white">TITAN</span>
              <span className="text-ember"> ACADEMY</span>
            </span>
          </span>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {['Exerciții', 'Dashboard', 'Tracker', 'Profil'].map((item) => (
              <span key={item} className="text-[10px] font-black text-zinc-600 hover:text-ember cursor-pointer transition-colors uppercase tracking-widest">
                {item}
              </span>
            ))}
          </div>

          <div className="text-[10px] font-black text-zinc-700 tracking-[0.3em] uppercase">
            © 2026 Titan Academy
          </div>
        </div>
      </footer>

    </div>
  );
}
