'use client';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toLocalDateStr as toDateStr, localDayOf } from '@/lib/dates';
import { calcTargets, loadSavedTargets, type Profile } from '@/lib/nutrition';
import { loadActivePlan, type ActivePlan } from '@/lib/active-plan';

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface WorkoutEntry {
  id: string;
  sets: number;
  reps: string;
  weight: number;
  logged_at: string;
  exercise_id: string;
  exercises: { name: string; primary_muscle: string } | null;
}

interface NutritionToday {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water_glasses: number;
}

/* ─── Constants ──────────────────────────────────────────────────────────── */
const MUSCLE_COLOR: Record<string, string> = {
  Chest: 'text-orange-400', Back: 'text-sky-400', Legs: 'text-green-400',
  Shoulders: 'text-purple-400', Biceps: 'text-yellow-400', Triceps: 'text-pink-400',
  Core: 'text-cyan-400', Calves: 'text-emerald-400',
};
const MUSCLE_BAR: Record<string, string> = {
  Chest: 'bg-orange-500', Back: 'bg-sky-500', Legs: 'bg-green-500',
  Shoulders: 'bg-purple-500', Biceps: 'bg-yellow-500', Triceps: 'bg-pink-500',
  Core: 'bg-cyan-500', Calves: 'bg-emerald-500',
};
const MUSCLE_BG: Record<string, string> = {
  Chest: 'bg-orange-500/10', Back: 'bg-sky-500/10', Legs: 'bg-green-500/10',
  Shoulders: 'bg-purple-500/10', Biceps: 'bg-yellow-500/10', Triceps: 'bg-pink-500/10',
  Core: 'bg-cyan-500/10', Calves: 'bg-emerald-500/10',
};

const DAYS_RO = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'AZI';
  if (d.toDateString() === yesterday.toDateString()) return 'IERI';
  return d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' }).toUpperCase();
}

function formatVolume(kg: number) {
  return `${Math.round(kg).toLocaleString('ro-RO')} kg`;
}

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="min-h-screen bg-void text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-8">
        <div className="space-y-3">
          <div className="h-4 w-32 bg-zinc-900 rounded-lg animate-pulse" />
          <div className="h-14 w-80 bg-zinc-900 rounded-2xl animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-zinc-900 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-40 bg-zinc-900 rounded-3xl animate-pulse" />
            <div className="h-64 bg-zinc-900 rounded-3xl animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-zinc-900 rounded-3xl animate-pulse" />
            <div className="h-48 bg-zinc-900 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Weekly chart ───────────────────────────────────────────────────────── */
function WeeklyChart({ workouts }: { workouts: WorkoutEntry[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { label: DAYS_RO[d.getDay()], dateStr: toDateStr(d), isToday: i === 6 };
  });

  const setsPerDay: Record<string, number> = {};
  workouts.forEach(w => {
    const day = localDayOf(w.logged_at);
    setsPerDay[day] = (setsPerDay[day] ?? 0) + w.sets;
  });

  const maxSets = Math.max(...days.map(d => setsPerDay[d.dateStr] ?? 0), 1);

  return (
    <div className="bg-zinc-950 border border-zinc-900 p-6 notch">
      <h2 className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase mb-6 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-orange-500 rounded-sm" />
        ACTIVITATE SĂPTĂMÂNĂ
      </h2>
      <div className="flex items-end gap-2 h-24">
        {days.map(({ label, dateStr, isToday }) => {
          const sets = setsPerDay[dateStr] ?? 0;
          const pct = Math.max(sets > 0 ? 15 : 4, (sets / maxSets) * 100);
          return (
            <div key={dateStr} className="flex-1 flex flex-col items-center gap-2">
              {sets > 0 && (
                <span className="text-[9px] font-bold text-zinc-500">{sets}</span>
              )}
              <div
                className={`w-full rounded-t-lg transition-all ${
                  sets > 0
                    ? isToday ? 'bg-orange-500' : 'bg-orange-500/40'
                    : 'bg-zinc-900'
                }`}
                style={{ height: `${pct}%` }}
              />
              <span className={`text-[9px] font-black tracking-wider uppercase ${isToday ? 'text-orange-500' : 'text-zinc-600'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [nutrition, setNutrition] = useState<NutritionToday | null>(null);
  const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActivePlan(loadActivePlan());
  }, []);

  useEffect(() => {
    // Toate workout-urile, în pagini de câte 1000 (Supabase limitează un
    // singur request) — statisticile "totale" trebuie să acopere tot istoricul.
    async function fetchAllWorkouts(uid: string): Promise<WorkoutEntry[]> {
      const PAGE = 1000;
      const all: WorkoutEntry[] = [];
      for (let from = 0; ; from += PAGE) {
        const { data } = await supabase
          .from('workouts')
          .select('id, sets, reps, weight, logged_at, exercise_id, exercises(name, primary_muscle)')
          .eq('user_id', uid)
          .order('logged_at', { ascending: false })
          .range(from, from + PAGE - 1);
        const batch = (data as unknown as WorkoutEntry[]) ?? [];
        all.push(...batch);
        if (batch.length < PAGE) return all;
      }
    }

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);

      const today = toDateStr(new Date());

      const [allWorkouts, nutritionRes, profileRes] = await Promise.all([
        fetchAllWorkouts(user.id),
        supabase
          .from('nutrition')
          .select('calories, protein, carbs, fat, water_glasses')
          .eq('user_id', user.id)
          .eq('date', today)
          .single(),
        supabase
          .from('profiles')
          .select('weight,height,age,gender,activity_level,goal')
          .eq('id', user.id)
          .single(),
      ]);

      setWorkouts(allWorkouts);
      if (nutritionRes.data) setNutrition(nutritionRes.data);

      // Aceeași țintă ca în pagina de nutriție: cea editată manual, altfel calculată din profil.
      const saved = loadSavedTargets(user.id);
      if (saved?.calories) setCalorieTarget(saved.calories);
      else if (profileRes.data) setCalorieTarget(calcTargets(profileRes.data as Profile).calories);

      setLoading(false);
    }
    load();
  }, []);

  /* ── Computed stats ── */
  const stats = useMemo(() => {
    if (!workouts.length) return {
      sessions: 0, totalSets: 0, streak: 0, volume: 0,
      topMuscle: null as string | null,
      muscleDistribution: [] as { muscle: string; sets: number; pct: number }[],
      prs: [] as { name: string; weight: number; muscle: string }[],
      thisWeekSessions: 0,
    };

    const uniqueDates = new Set(workouts.map(w => localDayOf(w.logged_at)));
    const totalSets = workouts.reduce((s, w) => s + w.sets, 0);

    const totalVolume = workouts.reduce((s, w) => {
      const repsStr = w.reps ?? '10';
      const avgReps = repsStr.includes('-')
        ? (parseInt(repsStr.split('-')[0]) + parseInt(repsStr.split('-')[1])) / 2
        : parseFloat(repsStr) || 10;
      return s + w.sets * avgReps * (w.weight || 0);
    }, 0);

    /* streak */
    const sortedDates = [...uniqueDates].sort().reverse();
    let streak = 0;
    const today = toDateStr(new Date());
    let check = today;
    for (const d of sortedDates) {
      if (d === check) {
        streak++;
        const prev = new Date(check + 'T12:00:00');
        prev.setDate(prev.getDate() - 1);
        check = toDateStr(prev);
      } else break;
    }

    /* this week sessions */
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    const weekAgoStr = toDateStr(weekAgo);
    const thisWeekSessions = [...uniqueDates].filter(d => d >= weekAgoStr).length;

    /* muscle distribution */
    const muscleSets: Record<string, number> = {};
    workouts.forEach(w => {
      const m = w.exercises?.primary_muscle;
      if (m) muscleSets[m] = (muscleSets[m] ?? 0) + w.sets;
    });
    const totalMuscleSets = Object.values(muscleSets).reduce((a, b) => a + b, 0);
    const muscleDistribution = Object.entries(muscleSets)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([muscle, sets]) => ({ muscle, sets, pct: Math.round((sets / totalMuscleSets) * 100) }));

    const topMuscle = muscleDistribution[0]?.muscle ?? null;

    /* PRs — max weight per exercise */
    const prMap: Record<string, { weight: number; muscle: string }> = {};
    workouts.forEach(w => {
      const name = w.exercises?.name;
      const muscle = w.exercises?.primary_muscle ?? '';
      if (!name) return;
      if (!prMap[name] || w.weight > prMap[name].weight) {
        prMap[name] = { weight: w.weight, muscle };
      }
    });
    const prs = Object.entries(prMap)
      .sort((a, b) => b[1].weight - a[1].weight)
      .slice(0, 5)
      .map(([name, { weight, muscle }]) => ({ name, weight, muscle }));

    return { sessions: uniqueDates.size, totalSets, streak, volume: totalVolume, topMuscle, muscleDistribution, prs, thisWeekSessions };
  }, [workouts]);

  if (loading) return <Skeleton />;

  const username = user?.email?.split('@')[0]?.toUpperCase() ?? 'CAMPION';
  const memberSince = new Date(user?.created_at).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });
  const hasWorkouts = workouts.length > 0;
  const recentWorkouts = workouts.slice(0, 8);

  const caloriePct = nutrition && calorieTarget > 0 ? Math.min(100, Math.round((nutrition.calories / calorieTarget) * 100)) : 0;

  return (
    <div className="min-h-screen bg-void text-white">
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-10">

        {/* ── Greeting ── */}
        <div className="mb-10">
          <p className="text-ember font-black text-[10px] tracking-[0.4em] uppercase mb-3 flex items-center gap-3">
            <span className="w-6 h-[3px] stripes inline-block" />
            BINE AI REVENIT
          </p>
          <h1 className="font-display italic uppercase text-5xl md:text-7xl leading-none mb-3 rise">
            SALUT, <span className="text-ember">{username}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-zinc-600 tracking-widest uppercase">
            <span>Membru din {memberSince}</span>
            {stats.streak > 0 && (
              <span className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                🔥 {stats.streak} {stats.streak === 1 ? 'zi' : 'zile'} consecutiv
              </span>
            )}
            {stats.thisWeekSessions > 0 && (
              <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded-full">
                ✓ {stats.thisWeekSessions} sesiuni săptămâna asta
              </span>
            )}
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            {
              value: hasWorkouts ? String(stats.sessions) : '—',
              label: 'SESIUNI TOTALE',
              sub: 'antrenamente complete',
              color: 'border-orange-500/20 hover:border-orange-500/40',
              accent: 'text-orange-500',
            },
            {
              value: hasWorkouts ? String(stats.totalSets) : '—',
              label: 'SETURI TOTALE',
              sub: 'seturi executate',
              color: 'border-sky-500/20 hover:border-sky-500/40',
              accent: 'text-sky-400',
            },
            {
              value: hasWorkouts ? formatVolume(stats.volume) : '—',
              label: 'VOLUM TOTAL',
              sub: 'tone ridicate',
              color: 'border-green-500/20 hover:border-green-500/40',
              accent: 'text-green-400',
            },
            {
              value: stats.prs[0] ? `${stats.prs[0].weight}kg` : '—',
              label: 'CEL MAI MARE PR',
              sub: stats.prs[0]?.name ?? 'niciun log',
              color: 'border-yellow-500/20 hover:border-yellow-500/40',
              accent: 'text-yellow-400',
            },
          ].map((s, i) => (
            <div key={s.label} className={`bg-zinc-950 border ${s.color} p-5 transition-all rise`} style={{ '--rise-delay': `${i * 60}ms` } as React.CSSProperties}>
              <p className={`font-display text-3xl md:text-4xl ${s.accent} mb-1`}>{s.value}</p>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.25em]">{s.label}</p>
              <p className="text-[10px] text-zinc-700 mt-0.5 truncate">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* Left — 2 cols */}
          <div className="md:col-span-2 space-y-5">

            {/* Weekly chart */}
            <WeeklyChart workouts={workouts} />

            {/* Recent activity */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 notch">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-sky-500 rounded-sm" />
                  ACTIVITATE RECENTĂ
                </h2>
                {hasWorkouts && (
                  <Link href="/workout" className="text-[10px] font-black text-orange-500 tracking-widest hover:text-orange-400 transition-colors">
                    TOT ISTORICUL →
                  </Link>
                )}
              </div>

              {!hasWorkouts ? (
                <div className="text-center py-8">
                  <p className="text-zinc-600 text-sm mb-5">Nu ai înregistrat niciun antrenament încă.</p>
                  <Link href="/workout" className="inline-block px-6 py-3 bg-ember text-black font-black text-xs tracking-widest hover:bg-orange-400 transition-all chamfer-sm">
                    ÎNCEPE PRIMUL ANTRENAMENT →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentWorkouts.map(w => {
                    const muscle = w.exercises?.primary_muscle ?? '';
                    return (
                      <div key={w.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-900/60 transition-all">
                        <div className={`w-9 h-9 rounded-xl ${MUSCLE_BG[muscle] ?? 'bg-zinc-900'} flex items-center justify-center shrink-0`}>
                          <span className={`text-[10px] font-black ${MUSCLE_COLOR[muscle] ?? 'text-zinc-500'}`}>
                            {muscle.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-sm truncate">{w.exercises?.name ?? 'Exercițiu'}</p>
                          <p className="text-zinc-600 text-[10px]">
                            {w.sets} × {w.reps}{w.weight ? ` · ${w.weight}kg` : ''}
                          </p>
                        </div>
                        <span className="text-[9px] font-black text-zinc-700 shrink-0 tracking-wider">{formatDate(w.logged_at)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right — 1 col */}
          <div className="space-y-5">

            {/* Plan activ */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 notch">
              <h2 className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-500 rounded-sm" />
                PLAN ACTIV
              </h2>
              {activePlan ? (
                <div>
                  <p className="font-display text-white uppercase text-lg leading-tight tracking-wide mb-1">{activePlan.name ?? activePlan.id.replace(/-/g, ' ')}</p>
                  <p className="text-zinc-600 text-xs mb-4">Plan curent de antrenament</p>
                  <Link
                    href="/workout"
                    className="block w-full text-center bg-ember hover:bg-orange-400 text-black font-black text-xs tracking-[0.2em] uppercase py-2.5 transition-all chamfer-sm"
                  >
                    CONTINUĂ →
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-zinc-600 text-xs mb-4">Nu ai ales un plan încă.</p>
                  <Link
                    href="/workouts"
                    className="block w-full text-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 font-black text-xs tracking-[0.2em] uppercase py-2.5 rounded-xl transition-all"
                  >
                    ALEGE UN PLAN →
                  </Link>
                </div>
              )}
            </div>

            {/* Nutriție azi */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 notch">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-green-500 rounded-sm" />
                  NUTRIȚIE AZI
                </h2>
                <Link href="/nutrition" className="text-[10px] font-black text-orange-500 tracking-widest hover:text-orange-400 transition-colors">
                  DETALII →
                </Link>
              </div>

              {nutrition ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-2xl font-black italic text-white">{nutrition.calories}</span>
                      <span className="text-[10px] text-zinc-600 font-bold">/ {calorieTarget} kcal</span>
                    </div>
                    <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${caloriePct >= 100 ? 'bg-red-500' : 'bg-orange-500'}`}
                        style={{ width: `${caloriePct}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{caloriePct}% din țintă</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { label: 'P', value: nutrition.protein, color: 'text-sky-400' },
                      { label: 'C', value: nutrition.carbs, color: 'text-yellow-400' },
                      { label: 'G', value: nutrition.fat, color: 'text-orange-400' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-zinc-900 rounded-xl p-2 text-center">
                        <p className={`text-base font-black ${color}`}>{value}g</p>
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex gap-1">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-sm transition-all ${i < (nutrition.water_glasses ?? 0) ? 'bg-sky-500' : 'bg-zinc-800'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] text-zinc-600 font-bold">{nutrition.water_glasses ?? 0}/8 pahare</span>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-zinc-600 text-xs mb-3">Nu ai logat nimic azi.</p>
                  <Link href="/nutrition" className="block text-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 font-black text-xs tracking-[0.2em] uppercase py-2.5 rounded-xl transition-all">
                    LOGHEAZĂ →
                  </Link>
                </div>
              )}
            </div>

            {/* Acces rapid */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 notch">
              <h2 className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-orange-500 rounded-sm" />
                ACCES RAPID
              </h2>
              <div className="space-y-2">
                {[
                  { href: '/workout', label: 'LOGHEAZĂ ANTRENAMENT', icon: '⚡' },
                  { href: '/progress', label: 'PROGRES', icon: '📈' },
                  { href: '/workouts', label: 'PLANURI', icon: '📋' },
                  { href: '/exercises', label: 'EXERCIȚII', icon: '🏋️' },
                  { href: '/profile', label: 'PROFIL', icon: '👤' },
                ].map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all group"
                  >
                    <span className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                    <span className="text-xs font-black text-zinc-400 group-hover:text-white uppercase tracking-wider transition-colors">{item.label}</span>
                    <span className="ml-auto text-zinc-700 group-hover:text-orange-500 transition-colors text-sm">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom row ── */}
        {hasWorkouts && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Muscle distribution */}
            {stats.muscleDistribution.length > 0 && (
              <div className="bg-zinc-950 border border-zinc-900 p-6 notch">
                <h2 className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-pink-500 rounded-sm" />
                  DISTRIBUȚIE GRUPE MUSCULARE
                </h2>
                <div className="space-y-3">
                  {stats.muscleDistribution.map(({ muscle, sets, pct }) => (
                    <div key={muscle}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[11px] font-black uppercase tracking-widest ${MUSCLE_COLOR[muscle] ?? 'text-zinc-400'}`}>
                          {muscle}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-600">{sets} seturi · {pct}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${MUSCLE_BAR[muscle] ?? 'bg-orange-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PR board */}
            {stats.prs.length > 0 && (
              <div className="bg-zinc-950 border border-zinc-900 p-6 notch">
                <h2 className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-yellow-500 rounded-sm" />
                  RECORDURI PERSONALE 🏆
                </h2>
                <div className="space-y-3">
                  {stats.prs.map(({ name, weight, muscle }, i) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className={`text-sm font-black w-5 shrink-0 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-zinc-400' : i === 2 ? 'text-orange-700' : 'text-zinc-700'}`}>
                        #{i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-bold truncate">{name}</p>
                        <p className={`text-[10px] font-bold ${MUSCLE_COLOR[muscle] ?? 'text-zinc-500'}`}>{muscle}</p>
                      </div>
                      <span className="text-orange-500 font-black text-base shrink-0">{weight}kg</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTA first time */}
        {!hasWorkouts && (
          <div className="bg-zinc-950 border border-zinc-900 p-8 md:p-10 notch">
            <p className="text-[10px] font-black tracking-[0.4em] text-ember/60 uppercase mb-2">// PRIMUL PAS</p>
            <h3 className="font-display italic uppercase text-2xl md:text-3xl mb-3">
              ALEGE UN PLAN DE ANTRENAMENT
            </h3>
            <p className="text-zinc-500 text-sm max-w-lg mb-6">
              Browsează planurile noastre structurate — PPL, Full Body sau focus pe o grupă musculară.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/workouts" className="px-6 py-3 bg-ember text-black font-black text-xs tracking-widest hover:bg-orange-400 transition-all chamfer-sm">
                VEZI PLANURILE →
              </Link>
              <Link href="/exercises" className="px-6 py-3 bg-zinc-900 text-zinc-400 font-black text-xs tracking-widest rounded-xl hover:bg-zinc-800 transition-all">
                EXPLOREAZĂ EXERCIȚII
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
