'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { localDayOf } from '@/lib/dates';
import { MUSCLE_COLOR } from '@/lib/exercise-media';

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface Entry {
  sets: number;
  reps: string;
  weight: number;
  logged_at: string;
}

interface ExerciseProgress {
  id: string;
  name: string;
  slug: string;
  muscle: string;
  entries: Entry[]; // descrescător după logged_at
}

interface SessionPoint {
  day: string;       // zi locală YYYY-MM-DD
  maxWeight: number;
  volume: number;
  e1rm: number;
  sets: number;
}

type Metric = 'weight' | 'e1rm' | 'volume';

const METRICS: { key: Metric; label: string; unit: string }[] = [
  { key: 'weight', label: 'GREUTATE MAX', unit: 'kg' },
  { key: 'e1rm',   label: '1RM ESTIMAT',  unit: 'kg' },
  { key: 'volume', label: 'VOLUM',        unit: 'kg' },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function avgReps(r: string): number {
  if (r.includes('-')) {
    const [a, b] = r.split('-');
    return (parseInt(a) + parseInt(b)) / 2;
  }
  return parseFloat(r) || 0;
}

// Formula Epley: 1RM ≈ greutate × (1 + repetări / 30)
function epley(weight: number, reps: number): number {
  return weight * (1 + reps / 30);
}

function formatDay(day: string, withYear = false): string {
  return new Date(day + 'T12:00:00').toLocaleDateString('ro-RO', {
    day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}),
  });
}

function buildSessions(entries: Entry[]): SessionPoint[] {
  const byDay = new Map<string, Entry[]>();
  entries.forEach(e => {
    const day = localDayOf(e.logged_at);
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(e);
  });
  return [...byDay.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([day, list]) => ({
      day,
      maxWeight: Math.max(...list.map(e => e.weight)),
      volume: list.reduce((s, e) => s + e.sets * avgReps(e.reps) * e.weight, 0),
      e1rm: Math.max(...list.map(e => epley(e.weight, avgReps(e.reps)))),
      sets: list.reduce((s, e) => s + e.sets, 0),
    }));
}

/* ─── Line chart (SVG) ───────────────────────────────────────────────────── */
function LineChart({ points, unit }: { points: { day: string; value: number }[]; unit: string }) {
  const W = 640, H = 230, PX = 14, PT = 26, PB = 30;
  const ys = points.map(p => p.value);
  let min = Math.min(...ys);
  let max = Math.max(...ys);
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.15;
  min -= pad; max += pad;

  const xAt = (i: number) => points.length === 1 ? W / 2 : PX + (i * (W - PX * 2)) / (points.length - 1);
  const yAt = (v: number) => PT + (1 - (v - min) / (max - min)) * (H - PT - PB);

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${xAt(i).toFixed(1)},${yAt(p.value).toFixed(1)}`).join(' ');
  const area = `${line} L${xAt(points.length - 1).toFixed(1)},${H - PB} L${xAt(0).toFixed(1)},${H - PB} Z`;
  const maxIdx = ys.indexOf(Math.max(...ys));
  const showAllLabels = points.length <= 10;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* gridlines */}
      {[0.25, 0.5, 0.75].map(f => (
        <line key={f} x1={PX} x2={W - PX} y1={PT + f * (H - PT - PB)} y2={PT + f * (H - PT - PB)}
          stroke="#27272a" strokeWidth="1" strokeDasharray="3 5" />
      ))}

      <path d={area} fill="rgba(249,115,22,0.07)" />
      <path d={line} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((p, i) => {
        const isMax = i === maxIdx;
        const showLabel = showAllLabels || isMax || i === 0 || i === points.length - 1;
        return (
          <g key={p.day + i}>
            <circle cx={xAt(i)} cy={yAt(p.value)} r={isMax ? 5 : 3.5}
              fill={isMax ? '#eab308' : '#09090b'} stroke={isMax ? '#eab308' : '#f97316'} strokeWidth="2" />
            {showLabel && (
              <text x={xAt(i)} y={yAt(p.value) - 10} textAnchor="middle"
                fill={isMax ? '#eab308' : '#a1a1aa'} fontSize="11" fontWeight="700" fontFamily="monospace">
                {Math.round(p.value).toLocaleString('ro-RO')}
              </text>
            )}
          </g>
        );
      })}

      {/* x labels: prima și ultima sesiune */}
      <text x={PX} y={H - 8} fill="#52525b" fontSize="10" fontWeight="700">
        {formatDay(points[0].day)}
      </text>
      <text x={W - PX} y={H - 8} textAnchor="end" fill="#52525b" fontSize="10" fontWeight="700">
        {formatDay(points[points.length - 1].day)}
      </text>
      <text x={W - PX} y={PT - 10} textAnchor="end" fill="#3f3f46" fontSize="10" fontWeight="700">
        {unit}
      </text>
    </svg>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="min-h-screen bg-void text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-8">
        <div className="h-14 w-72 bg-zinc-900 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="h-96 bg-zinc-900 rounded-3xl animate-pulse" />
          <div className="lg:col-span-3 space-y-4">
            <div className="h-24 bg-zinc-900 rounded-3xl animate-pulse" />
            <div className="h-64 bg-zinc-900 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
function ProgressContent() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [byExercise, setByExercise] = useState<ExerciseProgress[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [metric, setMetric] = useState<Metric>('weight');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login?redirectedFrom=/progress'); return; }

      // Tot istoricul, paginat (Supabase limitează un request la 1000 de rânduri)
      const PAGE = 1000;
      const all: (Entry & { exercise_id: string; exercises: { name: string; slug: string; primary_muscle: string } | null })[] = [];
      for (let from = 0; ; from += PAGE) {
        const { data } = await supabase
          .from('workouts')
          .select('sets, reps, weight, logged_at, exercise_id, exercises(name, slug, primary_muscle)')
          .eq('user_id', user.id)
          .order('logged_at', { ascending: false })
          .range(from, from + PAGE - 1);
        const batch = (data as unknown as typeof all) ?? [];
        all.push(...batch);
        if (batch.length < PAGE) break;
      }

      // Indexăm pe exercițiu
      const map = new Map<string, ExerciseProgress>();
      all.forEach(w => {
        if (!w.exercises) return;
        if (!map.has(w.exercise_id)) {
          map.set(w.exercise_id, {
            id: w.exercise_id,
            name: w.exercises.name,
            slug: w.exercises.slug,
            muscle: w.exercises.primary_muscle,
            entries: [],
          });
        }
        map.get(w.exercise_id)!.entries.push({ sets: w.sets, reps: w.reps, weight: w.weight, logged_at: w.logged_at });
      });

      // Sortăm după activitatea cea mai recentă
      const list = [...map.values()].sort((a, b) =>
        new Date(b.entries[0].logged_at).getTime() - new Date(a.entries[0].logged_at).getTime()
      );
      setByExercise(list);

      const param = searchParams.get('ex');
      const initial = (param && list.find(e => e.slug === param)) ?? list[0];
      if (initial) setSelectedSlug(initial.slug);

      setLoading(false);
    }
    load();
  }, []);

  const selected = byExercise.find(e => e.slug === selectedSlug) ?? null;

  const sessions = useMemo(() => (selected ? buildSessions(selected.entries) : []), [selected]);

  const stats = useMemo(() => {
    if (!selected || sessions.length === 0) return null;
    return {
      pr: Math.max(...sessions.map(s => s.maxWeight)),
      e1rm: Math.max(...sessions.map(s => s.e1rm)),
      sessions: sessions.length,
      volume: sessions.reduce((s, p) => s + p.volume, 0),
      totalSets: sessions.reduce((s, p) => s + p.sets, 0),
    };
  }, [selected, sessions]);

  // Ultimele 30 de sesiuni în grafic, ca să rămână lizibil
  const chartPoints = sessions.slice(-30).map(s => ({
    day: s.day,
    value: metric === 'weight' ? s.maxWeight : metric === 'e1rm' ? s.e1rm : s.volume,
  }));

  function selectExercise(slug: string) {
    setSelectedSlug(slug);
    router.replace(`/progress?ex=${slug}`, { scroll: false });
  }

  if (loading) return <Skeleton />;

  return (
    <div className="min-h-screen bg-void text-white">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-ember font-black text-[10px] tracking-[0.4em] uppercase mb-3 flex items-center gap-3">
            <span className="w-6 h-[3px] stripes inline-block" />
            EVOLUȚIE
          </p>
          <h1 className="font-display italic uppercase text-5xl md:text-7xl leading-none rise">
            PROGRES <span className="text-ember">EXERCIȚII</span>
          </h1>
        </div>

        {byExercise.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-900 p-12 text-center notch">
            <p className="text-5xl mb-4">📈</p>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm mb-2">
              Niciun antrenament logat încă.
            </p>
            <p className="text-zinc-700 text-xs mb-6">Progresul apare după ce loghezi seturi în tracker.</p>
            <Link href="/workout" className="inline-block px-6 py-3 bg-ember text-black font-black text-xs tracking-widest hover:bg-orange-400 transition-all chamfer-sm">
              ÎNCEPE SĂ LOGHEZI →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* ── Lista exercițiilor logate ── */}
            <div className="bg-zinc-950 border border-zinc-900 p-4 notch lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
              <h2 className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase mb-3 px-2 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-orange-500 rounded-sm" />
                EXERCIȚIILE TALE
              </h2>
              <div className="space-y-1">
                {byExercise.map(ex => {
                  const active = ex.slug === selectedSlug;
                  const pr = Math.max(...ex.entries.map(e => e.weight));
                  return (
                    <button
                      key={ex.id}
                      onClick={() => selectExercise(ex.slug)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${
                        active
                          ? 'bg-orange-500/10 border-orange-500/40'
                          : 'border-transparent hover:bg-zinc-900 hover:border-zinc-800'
                      }`}
                    >
                      <p className={`text-sm font-bold truncate ${active ? 'text-white' : 'text-zinc-300'}`}>
                        {ex.name}
                      </p>
                      <p className="text-[10px] text-zinc-600 font-bold">
                        <span className={MUSCLE_COLOR[ex.muscle] ?? ''}>{ex.muscle}</span>
                        {' '}· PR {pr}kg
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Detaliu exercițiu ── */}
            {selected && stats && (
              <div className="lg:col-span-3 space-y-5">

                {/* Titlu + link ghid */}
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="font-display italic uppercase text-3xl md:text-4xl leading-none">
                      {selected.name}
                    </h2>
                    <p className={`text-[11px] font-black uppercase tracking-widest mt-2 ${MUSCLE_COLOR[selected.muscle] ?? 'text-zinc-500'}`}>
                      {selected.muscle}
                    </p>
                  </div>
                  <Link
                    href={`/exercises/${selected.slug}`}
                    className="text-[10px] font-black text-orange-500 tracking-widest hover:text-orange-400 transition-colors"
                  >
                    DESCHIDE GHIDUL →
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'RECORD (PR)', value: `${stats.pr}kg`, accent: 'text-yellow-400', border: 'border-yellow-500/20' },
                    { label: '1RM ESTIMAT', value: `${Math.round(stats.e1rm)}kg`, accent: 'text-orange-500', border: 'border-orange-500/20', sub: 'formula Epley' },
                    { label: 'SESIUNI', value: String(stats.sessions), accent: 'text-sky-400', border: 'border-sky-500/20', sub: `${stats.totalSets} seturi` },
                    { label: 'VOLUM TOTAL', value: `${Math.round(stats.volume).toLocaleString('ro-RO')} kg`, accent: 'text-green-400', border: 'border-green-500/20' },
                  ].map(s => (
                    <div key={s.label} className={`bg-zinc-950 border ${s.border} p-4`}>
                      <p className={`font-display text-2xl md:text-3xl ${s.accent} mb-1`}>{s.value}</p>
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.25em]">{s.label}</p>
                      {s.sub && <p className="text-[10px] text-zinc-700 mt-0.5">{s.sub}</p>}
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="bg-zinc-950 border border-zinc-900 p-6 notch">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <h3 className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-orange-500 rounded-sm" />
                      EVOLUȚIE PE SESIUNI
                      {sessions.length > 30 && (
                        <span className="text-zinc-700 normal-case tracking-normal">(ultimele 30)</span>
                      )}
                    </h3>
                    <div className="flex gap-1.5">
                      {METRICS.map(m => (
                        <button
                          key={m.key}
                          onClick={() => setMetric(m.key)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                            metric === m.key
                              ? 'bg-orange-500/15 border-orange-500/40 text-orange-400'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {chartPoints.length >= 2 ? (
                    <LineChart points={chartPoints} unit={METRICS.find(m => m.key === metric)!.unit} />
                  ) : (
                    <p className="text-zinc-600 text-xs text-center py-10">
                      O singură sesiune logată — graficul apare de la a doua sesiune. Continuă! 💪
                    </p>
                  )}
                </div>

                {/* Istoric sesiuni */}
                <div className="bg-zinc-950 border border-zinc-900 p-6 notch">
                  <h3 className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-sky-500 rounded-sm" />
                    ISTORIC SESIUNI
                  </h3>
                  <div className="space-y-1">
                    {[...sessions].reverse().slice(0, 10).map((s, i) => (
                      <div
                        key={s.day}
                        className={`flex items-center justify-between gap-4 py-2.5 ${i < Math.min(sessions.length, 10) - 1 ? 'border-b border-zinc-900' : ''}`}
                      >
                        <span className="text-zinc-400 text-xs font-bold w-24 shrink-0 capitalize">
                          {formatDay(s.day, true)}
                        </span>
                        <span className="text-white text-sm font-bold flex-1">
                          {s.sets} {s.sets === 1 ? 'set' : 'seturi'}
                          <span className="text-zinc-600"> · max </span>
                          <span className="text-orange-500">{s.maxWeight}kg</span>
                        </span>
                        <span className="text-zinc-600 text-[11px] font-bold shrink-0">
                          {Math.round(s.volume).toLocaleString('ro-RO')} kg volum
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <ProgressContent />
    </Suspense>
  );
}
