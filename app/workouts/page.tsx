'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadActivePlan, saveActivePlan, clearActivePlan } from '@/lib/active-plan';
import { PLANS, type WorkoutPlan } from '@/lib/plans';

/* ─── Config ─────────────────────────────────────────────────────────────── */
const CATEGORY_STYLE: Record<string, string> = {
  PPL:        'bg-orange-500/10 text-orange-400 border border-orange-500/25',
  'Full Body':'bg-green-500/10  text-green-400  border border-green-500/25',
  Forță:      'bg-red-500/10   text-red-400    border border-red-500/25',
  Izolat:     'bg-blue-500/10  text-blue-400   border border-blue-500/25',
};

const MUSCLE_COLOR: Record<string, string> = {
  Chest:'text-orange-400', Back:'text-sky-400', Legs:'text-green-400',
  Shoulders:'text-purple-400', Biceps:'text-yellow-400', Triceps:'text-pink-400',
  Core:'text-cyan-400', Calves:'text-emerald-400',
};

function difficultyInfo(d: number) {
  if (d <= 2) return { label: 'Beginner',    cls: 'text-green-400 border-green-500/30 bg-green-500/8'  };
  if (d <= 3) return { label: 'Intermediar', cls: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/8' };
  return       { label: 'Avansat',     cls: 'text-red-400   border-red-500/30   bg-red-500/8'    };
}

const DURATION_FILTERS = [
  { label: 'Toate duratele', fn: () => true },
  { label: '< 60 min',      fn: (p: WorkoutPlan) => p.durationMin < 60  },
  { label: '60–90 min',     fn: (p: WorkoutPlan) => p.durationMin >= 60 && p.durationMin <= 90 },
  { label: '90+ min',       fn: (p: WorkoutPlan) => p.durationMin > 90  },
];

const CATEGORIES = ['Toate', 'PPL', 'Full Body', 'Forță', 'Izolat'] as const;

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden animate-pulse">
          <div className="h-36 bg-zinc-900" />
          <div className="p-6 space-y-3">
            <div className="h-3 bg-zinc-800 rounded w-1/3" />
            <div className="h-6 bg-zinc-800 rounded w-2/3" />
            <div className="h-3 bg-zinc-800 rounded w-1/2" />
            <div className="h-2 bg-zinc-900 rounded-full mt-4" />
            <div className="space-y-2 mt-3">
              {[1,2,3].map(j => <div key={j} className="h-2.5 bg-zinc-900 rounded w-full" />)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Plan Card ──────────────────────────────────────────────────────────── */
function PlanCard({ plan, isActive, onOpen, onActivate }:
  { plan: WorkoutPlan; isActive: boolean; onOpen: () => void; onActivate: () => void }) {
  const diff = difficultyInfo(plan.difficulty);
  const totalSets = plan.exercises.reduce((a, e) => a + e.sets, 0);

  return (
    <div className={`group relative bg-zinc-950 border overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${
      isActive ? 'border-ember/50 shadow-[0_0_30px_rgba(249,115,22,0.08)] notch' : 'border-zinc-800/80 hover:border-zinc-700'
    }`}>

      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img src={plan.image} alt={plan.name}
          className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-zinc-950" />

        {/* Badges top row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${diff.cls}`}>
            {diff.label}
          </span>
          {isActive && (
            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-orange-500 text-black">
              ✓ ACTIV
            </span>
          )}
        </div>

        {/* Category + duration in image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className={`text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full ${CATEGORY_STYLE[plan.category]}`}>
            {plan.category.toUpperCase()}
          </span>
          <span className="text-[10px] text-zinc-400 font-black">{plan.durationMin} min</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display uppercase text-xl tracking-wide leading-tight mb-0.5 group-hover:text-orange-400 transition-colors">
          {plan.name}
        </h3>
        <p className="text-zinc-500 text-xs mb-4">{plan.subtitle}</p>

        {/* Difficulty dots + sets count */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`w-1.5 h-1.5 rounded-full ${i < plan.difficulty ? 'bg-orange-500' : 'bg-zinc-800'}`} />
            ))}
          </div>
          <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
            {plan.exercises.length} exerciții · {totalSets} seturi
          </span>
        </div>

        {/* Exercise preview with muscle tooltip */}
        <div className="space-y-1.5 mb-5 flex-1">
          {plan.exercises.slice(0, 3).map((ex, i) => (
            <div key={i} className="flex items-center gap-2 group/ex">
              <span className="w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
              <span className="text-zinc-500 text-xs truncate flex-1">{ex.name}</span>
              <span className={`text-[9px] font-black shrink-0 ${MUSCLE_COLOR[ex.muscle] ?? 'text-zinc-600'}`}>
                {ex.muscle}
              </span>
            </div>
          ))}
          {plan.exercises.length > 3 && (
            <p className="text-zinc-700 text-[10px] pl-3">+{plan.exercises.length - 3} exerciții</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button onClick={onOpen}
            className="flex-1 py-2.5 bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
            DETALII
          </button>
          <button onClick={onActivate}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
              isActive
                ? 'bg-ember/15 border border-ember/40 text-orange-400'
                : 'bg-ember text-black hover:bg-orange-400 chamfer-sm'
            }`}>
            {isActive ? '✓ ACTIV' : 'ÎNCEPE'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Plan Modal ─────────────────────────────────────────────────────────── */
function PlanModal({ plan, isActive, onClose, onActivate }:
  { plan: WorkoutPlan; isActive: boolean; onClose: () => void; onActivate: () => void }) {
  const diff = difficultyInfo(plan.difficulty);
  const totalSets = plan.exercises.reduce((a, e) => a + e.sets, 0);
  const totalVol = plan.exercises.reduce((a, e) => a + e.sets * parseInt(e.reps.split('-').pop() || '0'), 0);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#0a0a0a] border border-zinc-800 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl">

        {/* Image header */}
        <div className="relative h-48 overflow-hidden rounded-t-[2rem]">
          <img src={plan.image} alt={plan.name}
            className="w-full h-full object-cover grayscale opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
          <div className="absolute bottom-5 left-8 right-8 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${diff.cls}`}>
                  {diff.label}
                </span>
                <span className={`text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full ${CATEGORY_STYLE[plan.category]}`}>
                  {plan.category}
                </span>
                {isActive && (
                  <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-orange-500 text-black">✓ ACTIV</span>
                )}
              </div>
              <h2 className="font-display italic uppercase text-4xl leading-none">{plan.name}</h2>
              <p className="text-zinc-500 text-sm mt-1">{plan.subtitle}</p>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shrink-0">
              ✕
            </button>
          </div>
        </div>

        {/* Body — 2 columns */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">

          {/* Left — exercise list */}
          <div>
            <p className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase mb-4">// EXERCIȚII</p>
            <div className="space-y-2">
              {plan.exercises.map((ex, i) => (
                <div key={i} className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl px-4 py-3.5 hover:border-zinc-700 hover:bg-zinc-900 transition-all">
                  <span className="text-orange-500 font-black italic text-sm w-6 shrink-0 text-center">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm leading-tight">{ex.name}</p>
                    {ex.notes && <p className="text-zinc-600 text-xs mt-0.5 italic">{ex.notes}</p>}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider w-16 text-right shrink-0 ${MUSCLE_COLOR[ex.muscle] ?? 'text-zinc-600'}`}>
                    {ex.muscle}
                  </span>
                  <div className="text-center w-14 shrink-0">
                    <p className="text-white font-black text-sm">{ex.sets}×{ex.reps}</p>
                    <p className="text-zinc-700 text-[9px]">seturi</p>
                  </div>
                  <div className="text-center w-10 shrink-0">
                    <p className="text-zinc-500 font-bold text-xs">{ex.rest}</p>
                    <p className="text-zinc-700 text-[9px]">pauză</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — overview */}
          <div className="space-y-4">
            {/* Description */}
            <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-4">
              <p className="text-zinc-400 text-xs leading-relaxed">{plan.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Durată',    val: `${plan.durationMin} min` },
                { label: 'Exerciții', val: plan.exercises.length.toString() },
                { label: 'Seturi',    val: totalSets.toString() },
                { label: 'Rep max',   val: totalVol.toString() },
              ].map(s => (
                <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-center">
                  <p className="text-lg font-black italic text-white">{s.val}</p>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-black">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Difficulty */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-black mb-2">Dificultate</p>
              <div className="flex gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full ${i < plan.difficulty ? 'bg-orange-500' : 'bg-zinc-800'}`} />
                ))}
              </div>
              <p className={`text-[10px] font-black mt-1.5 ${diff.cls.split(' ')[0]}`}>{diff.label}</p>
            </div>

            {/* Actions */}
            <button onClick={onActivate}
              className={`w-full py-3 text-xs font-black uppercase tracking-widest transition-all ${
                isActive
                  ? 'bg-ember/15 border border-ember/40 text-orange-400'
                  : 'bg-ember text-black hover:bg-orange-400 chamfer-sm'
              }`}>
              {isActive ? '✓ PLAN ACTIV' : 'MARCHEAZĂ CA ACTIV'}
            </button>

            <Link
              href={`/workout?plan=${plan.id}`}
              className="block w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-white hover:border-zinc-700 transition-all text-center">
              ▶ ÎNCEPE SESIUNEA →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function WorkoutsPage() {
  const [mounted, setMounted] = useState(false);
  const [catFilter, setCatFilter] = useState('Toate');
  const [durFilter, setDurFilter] = useState(0);
  const [selected, setSelected] = useState<WorkoutPlan | null>(null);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setActivePlanId(loadActivePlan()?.id ?? null);
    setTimeout(() => setMounted(true), 300);
  }, []);

  function activatePlan(id: string) {
    const next = activePlanId === id ? null : id;
    setActivePlanId(next);
    if (next) saveActivePlan({ id: next, name: PLANS.find(p => p.id === next)?.name });
    else clearActivePlan();
  }

  function changeFilter(cat: string) {
    setVisible(false);
    setTimeout(() => { setCatFilter(cat); setVisible(true); }, 150);
  }

  function changeDur(idx: number) {
    setVisible(false);
    setTimeout(() => { setDurFilter(idx); setVisible(true); }, 150);
  }

  const activePlan = PLANS.find(p => p.id === activePlanId);

  const filtered = PLANS.filter(p => {
    const catOk = catFilter === 'Toate' || p.category === catFilter;
    const durOk = DURATION_FILTERS[durFilter].fn(p);
    return catOk && durOk;
  });

  return (
    <div className="min-h-screen bg-void text-white">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-0"/>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-ember font-black text-[10px] tracking-[0.5em] uppercase mb-3 flex items-center gap-3">
            <span className="w-6 h-[3px] stripes inline-block" />
            ARSENAL DE ANTRENAMENTE
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-display italic uppercase text-5xl md:text-7xl leading-none rise">
              PLANURI <span className="text-ember">DE ANTRENAMENT</span>
            </h1>
            <span className="hidden md:block text-zinc-700 font-black text-sm shrink-0 mb-1">
              {PLANS.length} planuri
            </span>
          </div>
          <p className="text-zinc-600 text-sm mt-3 max-w-xl">
            Programe structurate pentru fiecare obiectiv — PPL, Full Body, Forță sau focus pe o grupă musculară specifică.
          </p>
        </div>

        {/* Active plan banner */}
        {activePlan && (
          <div className="mb-8 bg-zinc-950 border border-ember/30 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden notch rise">
            <div className="absolute inset-0 bg-gradient-to-r from-ember/5 to-transparent pointer-events-none" />
            <div className="w-2 h-12 bg-ember chamfer-sm shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black tracking-[0.4em] text-ember uppercase mb-1">// PLANUL TĂU ACTIV</p>
              <p className="font-display text-xl uppercase tracking-wide">{activePlan.name}</p>
              <p className="text-zinc-500 text-xs">{activePlan.subtitle} · {activePlan.durationMin} min · {activePlan.exercises.length} exerciții</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/workout?plan=${activePlan.id}&exercises=${encodeURIComponent(activePlan.exercises.map(e => e.name).join(','))}`}
                className="px-5 py-2.5 bg-ember text-black font-black text-[10px] uppercase tracking-widest hover:bg-orange-400 transition-all chamfer-sm">
                LOGHEAZĂ AZI →
              </Link>
              <button onClick={() => activatePlan(activePlan.id)}
                className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:border-zinc-700 hover:text-white transition-all">
                DEZACTIVEAZĂ
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Category */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => changeFilter(cat)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  catFilter === cat
                    ? 'bg-ember text-black chamfer-sm scale-105'
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden sm:block w-px bg-zinc-800 self-stretch" />

          {/* Duration */}
          <div className="flex flex-wrap gap-2">
            {DURATION_FILTERS.map((f, i) => (
              <button key={i} onClick={() => changeDur(i)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  durFilter === i
                    ? 'bg-zinc-700 text-white chamfer-sm'
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {!mounted ? <Skeleton /> : (
          <>
            <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest mb-5">
              {filtered.length} plan{filtered.length !== 1 ? 'uri' : ''} afișate
            </p>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-150"
              style={{ opacity: visible ? 1 : 0 }}>
              {filtered.map(plan => (
                <PlanCard key={plan.id} plan={plan}
                  isActive={plan.id === activePlanId}
                  onOpen={() => setSelected(plan)}
                  onActivate={() => activatePlan(plan.id)} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20 text-zinc-700">
                <p className="font-black uppercase tracking-widest text-sm">Niciun plan pentru aceste filtre.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <PlanModal plan={selected} isActive={selected.id === activePlanId}
          onClose={() => setSelected(null)}
          onActivate={() => activatePlan(selected.id)} />
      )}
    </div>
  );
}
