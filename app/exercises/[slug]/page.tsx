'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { localDayOf } from '@/lib/dates';
import {
  BASE_GYM_IMAGE, MUSCLE_OVERLAY, MUSCLE_COLOR, MUSCLE_BORDER,
  EXERCISE_VIDEO, getYouTubeSearch, exerciseImage, exerciseThumb,
} from '@/lib/exercise-media';

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface Exercise {
  id: string;
  name: string;
  slug: string;
  primary_muscle: string;
  equipment: string;
  type: string;
  instructions: string[];
  tips: string[];
  description: string;
  youtube_id?: string;
}

interface WorkoutLog {
  id: string;
  sets: number;
  reps: string;
  weight: number;
  logged_at: string;
}

interface SimilarEx {
  id: string;
  name: string;
  slug: string;
  primary_muscle: string;
  equipment: string;
  type: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function difficultyStars(type: string, equipment: string): number {
  if (type === 'Compound') return 4;
  if (equipment === 'Bodyweight') return 2;
  return 3;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
}

/* ─── Mini Bar Chart ─────────────────────────────────────────────────────── */
function MiniBarChart({ weights }: { weights: number[] }) {
  const max = Math.max(...weights);
  const min = Math.min(...weights);
  const range = max - min || 1;
  const trend = weights[weights.length - 1] >= weights[0];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] font-black tracking-[0.3em] text-zinc-500 uppercase">TREND</span>
        <span className={`text-sm font-black ${trend ? 'text-green-400' : 'text-red-400'}`}>
          {trend ? '↑' : '↓'}
        </span>
        <span className={`text-[10px] font-bold ${trend ? 'text-green-400' : 'text-red-400'}`}>
          {trend ? 'în creștere' : 'în scădere'}
        </span>
      </div>
      <div className="flex items-end gap-1.5 h-20">
        {weights.map((w, i) => {
          const pct = Math.max(15, ((w - min) / range) * 100);
          const isLast = i === weights.length - 1;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[8px] text-zinc-600 font-bold">{w}</span>
              <div
                className={`w-full rounded-t-md transition-all ${isLast ? 'bg-orange-500' : 'bg-zinc-700'}`}
                style={{ height: `${pct}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[8px] text-zinc-700">-5 sesiuni</span>
        <span className="text-[8px] text-zinc-700">acum</span>
      </div>
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="min-h-screen bg-void text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-10">
        <div className="h-5 w-20 bg-zinc-900 rounded-lg mb-8 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-5">
            <div className="h-80 bg-zinc-900 rounded-3xl animate-pulse" />
            <div className="h-10 w-2/3 bg-zinc-900 rounded-2xl animate-pulse" />
            <div className="h-12 bg-zinc-900 rounded-2xl animate-pulse" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-zinc-900 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-zinc-900 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ExerciseDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const router = useRouter();
  const supabase = createClient();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [pr, setPr] = useState<number | null>(null);
  const [similar, setSimilar] = useState<SimilarEx[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showYoutube, setShowYoutube] = useState(false);

  /* form — per-set, ca în tracker: câte un rând (repetări + greutate) pentru fiecare set */
  const [formSets, setFormSets] = useState('3');
  const [formRows, setFormRows] = useState<{ reps: string; weight: string }[]>([
    { reps: '10', weight: '' }, { reps: '10', weight: '' }, { reps: '10', weight: '' },
  ]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    const n = Math.max(1, Math.min(20, parseInt(formSets) || 1));
    setFormRows(rows => {
      const next = rows.slice(0, n);
      while (next.length < n) {
        const last = next[next.length - 1];
        next.push({ reps: last?.reps ?? '10', weight: last?.weight ?? '' });
      }
      return next;
    });
  }, [formSets]);

  function updateFormRow(i: number, patch: Partial<{ reps: string; weight: string }>) {
    setFormRows(rows => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  useEffect(() => {
    if (!slug) return;
    async function load() {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace(`/login?redirectedFrom=/exercises/${slug}`);
        return;
      }

      const { data: ex, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !ex) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setExercise(ex);

      const [logsRes, simRes] = await Promise.all([
        supabase
          .from('workouts')
          .select('id, sets, reps, weight, logged_at')
          .eq('user_id', user.id)
          .eq('exercise_id', ex.id)
          .order('logged_at', { ascending: false })
          .limit(10),
        supabase
          .from('exercises')
          .select('id, name, slug, primary_muscle, equipment, type')
          .eq('primary_muscle', ex.primary_muscle)
          .neq('id', ex.id)
          .limit(3),
      ]);

      const logsData: WorkoutLog[] = logsRes.data ?? [];
      setLogs(logsData);
      setSimilar(simRes.data ?? []);

      if (logsData.length > 0) {
        setPr(Math.max(...logsData.map(l => l.weight)));
        // Precompletăm cu seturile din cea mai recentă sesiune, în ordine cronologică
        const day = localDayOf(logsData[0].logged_at);
        const dayEntries = logsData.filter(l => localDayOf(l.logged_at) === day);
        const rows: { reps: string; weight: string }[] = [];
        [...dayEntries].reverse().forEach(l => {
          for (let k = 0; k < l.sets && rows.length < 20; k++) {
            rows.push({ reps: l.reps, weight: String(l.weight) });
          }
        });
        setFormSets(String(rows.length));
        setFormRows(rows);
      }

      setLoading(false);
    }
    load();
  }, [slug]);

  async function handleLog(e: React.FormEvent) {
    e.preventDefault();
    if (!exercise) return;

    const repsOk = (r: string) => /^\d+(-\d+)?$/.test(r.trim());
    const bad = formRows.findIndex(r => !repsOk(r.reps) || r.weight === '');
    if (bad !== -1) {
      setSaveMsg({ type: 'err', text: `Setul ${bad + 1}: completează repetările (ex: 10 sau 8-12) și greutatea.` });
      return;
    }
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    // Seturile consecutive identice se comasează într-un singur rând (ca în tracker)
    const merged: { sets: number; reps: string; weight: number }[] = [];
    formRows.forEach(r => {
      const w = parseFloat(r.weight);
      const last = merged[merged.length - 1];
      if (last && last.reps === r.reps.trim() && last.weight === w) last.sets++;
      else merged.push({ sets: 1, reps: r.reps.trim(), weight: w });
    });

    const now = Date.now();
    const rowsToInsert = merged.map((m, i) => ({
      user_id: user.id,
      exercise_id: exercise.id,
      sets: m.sets,
      reps: m.reps,
      weight: m.weight,
      // +i secunde ca ordinea seturilor să se păstreze la sortare
      logged_at: new Date(now + i * 1000).toISOString(),
    }));

    const { data, error } = await supabase
      .from('workouts')
      .insert(rowsToInsert)
      .select('id, sets, reps, weight, logged_at');

    if (error || !data) {
      setSaveMsg({ type: 'err', text: 'Eroare la salvare.' });
    } else {
      const fresh = (data as WorkoutLog[]).sort(
        (a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
      );
      setLogs([...fresh, ...logs]);
      const maxSaved = Math.max(...merged.map(m => m.weight));
      const nSets = merged.reduce((a, m) => a + m.sets, 0);
      const isPr = pr !== null && maxSaved > pr;
      if (pr === null || maxSaved > pr) setPr(maxSaved);
      setSaveMsg({
        type: 'ok',
        text: isPr
          ? `🏆 PR NOU: ${maxSaved}kg!`
          : `✓ ${nSets === 1 ? 'Set salvat' : nSets + ' seturi salvate'}!`,
      });
      setTimeout(() => setSaveMsg(null), isPr ? 5000 : 2500);
    }
    setSaving(false);
  }

  /* ── States ── */
  if (loading) return <Skeleton />;

  if (notFound) {
    return (
      <div className="min-h-screen bg-void text-white flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-500 font-black text-sm uppercase tracking-[0.3em]">Exercițiu negăsit</p>
        <Link href="/exercises" className="text-orange-500 font-black text-xs tracking-[0.2em] hover:underline">
          ← ÎNAPOI LA EXERCIȚII
        </Link>
      </div>
    );
  }

  if (!exercise) return null;

  const stars = difficultyStars(exercise.type, exercise.equipment);
  const videoId = EXERCISE_VIDEO[exercise.slug] ?? exercise.youtube_id ?? null;
  const heroThumb = exerciseImage(exercise.slug) ?? exerciseThumb(exercise.slug, 'maxres', exercise.youtube_id);
  const heroFallback = exerciseThumb(exercise.slug, 'hq', exercise.youtube_id);
  const chartWeights = [...logs].slice(0, 6).map(l => l.weight).reverse();

  return (
    <div className="min-h-screen bg-void text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-10">

        {/* Back */}
        <Link
          href="/exercises"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-[11px] font-black tracking-[0.25em] uppercase transition-colors mb-8 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> ÎNAPOI LA EXERCIȚII
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ══════════════════════════════════════════
              LEFT COLUMN — 60%
          ══════════════════════════════════════════ */}
          <div className="lg:col-span-3 space-y-6">

            {/* Hero */}
            <div className={`relative h-72 md:h-96 overflow-hidden border border-zinc-800 rise ${MUSCLE_BORDER[exercise.primary_muscle] ?? ''}`}>
              <img
                src={heroThumb ?? BASE_GYM_IMAGE}
                alt={exercise.name}
                onError={e => {
                  // poza locală lipsă sau maxresdefault inexistent → thumbnail hq
                  if (heroFallback && e.currentTarget.src !== heroFallback) e.currentTarget.src = heroFallback;
                }}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 ${MUSCLE_OVERLAY[exercise.primary_muscle] ?? 'bg-zinc-500/40'} mix-blend-multiply ${heroThumb ? 'opacity-50' : ''}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-black/20 to-transparent" />

              {/* Top badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-black/70 backdrop-blur-sm border border-white/10 ${MUSCLE_COLOR[exercise.primary_muscle] ?? 'text-orange-400'}`}>
                  {exercise.primary_muscle}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-black/70 backdrop-blur-sm border border-white/10 text-zinc-300">
                  {exercise.equipment}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest bg-black/70 backdrop-blur-sm border border-white/10 text-yellow-400">
                  {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                </span>
              </div>

              {/* PR badge */}
              {pr !== null && (
                <div className="absolute top-4 right-4 bg-ember text-black px-3 py-1.5 text-[11px] font-black tracking-widest shadow-lg chamfer-sm">
                  🏆 PR: {pr}kg
                </div>
              )}

              {/* Bottom label */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className={`text-[10px] font-black tracking-[0.4em] uppercase ${MUSCLE_COLOR[exercise.primary_muscle] ?? 'text-orange-400'}`}>
                  // {exercise.primary_muscle} · {exercise.type}
                </span>
              </div>
            </div>

            {/* Title + description */}
            <div>
              <h1 className="font-display italic uppercase text-5xl md:text-6xl leading-none">
                {exercise.name}
              </h1>
              {exercise.description && (
                <p className="text-zinc-500 text-sm mt-3 italic leading-relaxed max-w-xl">
                  "{exercise.description}"
                </p>
              )}
            </div>

            {/* Watch tutorial */}
            {videoId ? (
              <button
                onClick={() => setShowYoutube(true)}
                className="flex items-center gap-4 w-full bg-zinc-900 border border-zinc-800 hover:border-red-500/50 rounded-2xl px-6 py-4 transition-all group text-left"
              >
                <div className="w-10 h-10 bg-red-600 group-hover:bg-red-500 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                  <svg className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-black text-sm uppercase italic tracking-wider">▶ WATCH TUTORIAL</p>
                  <p className="text-zinc-600 text-[10px] mt-0.5">Video demonstrativ · {exercise.name}</p>
                </div>
              </button>
            ) : (
              <a
                href={getYouTubeSearch(exercise.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 w-full bg-zinc-900 border border-zinc-800 hover:border-red-500/50 rounded-2xl px-6 py-4 transition-all group"
              >
                <div className="w-10 h-10 bg-red-600/70 group-hover:bg-red-600 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                  <svg className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-black text-sm uppercase italic tracking-wider">CAUTĂ TUTORIAL PE YOUTUBE</p>
                  <p className="text-zinc-600 text-[10px] mt-0.5">Deschide căutarea în tab nou</p>
                </div>
              </a>
            )}

            {/* Technique */}
            <div>
              <h2 className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase mb-5 flex items-center gap-3">
                <span className="w-2 h-5 bg-orange-500 rounded-sm" />
                TEHNICĂ EXECUȚIE
              </h2>
              <div className="space-y-3">
                {exercise.instructions.map((step, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-zinc-900/60 rounded-2xl border border-zinc-900 hover:border-zinc-800 transition-colors">
                    <span className="text-orange-500 font-black italic text-xl leading-none shrink-0 w-8">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-zinc-300 text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Elite tips */}
            {exercise.tips?.length > 0 && (
              <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
                <h2 className="text-orange-500 font-black mb-4 uppercase tracking-[0.2em] text-xs">
                  ⭐ SFATURI DE ELITĂ
                </h2>
                <ul className="space-y-3">
                  {exercise.tips.map((tip, i) => (
                    <li key={i} className="text-zinc-300 text-sm italic leading-relaxed flex gap-2">
                      <span className="text-orange-500 shrink-0 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════
              RIGHT COLUMN — 40% sticky
          ══════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24 lg:self-start">

            {/* Log form */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 notch">
              <h3 className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase mb-5 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-orange-500 rounded-sm" />
                LOGHEAZĂ ACEST EXERCIȚIU
              </h3>
              <form onSubmit={handleLog} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black tracking-[0.3em] text-zinc-600 uppercase mb-1.5">
                    SETURI
                  </label>
                  <input
                    type="number"
                    min="1" max="20"
                    value={formSets}
                    onChange={e => setFormSets(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white text-center font-bold focus:outline-none focus:border-orange-500/60 transition-all"
                  />
                </div>

                {/* Rând pentru fiecare set: repetări + greutate (ca în tracker) */}
                <div className="space-y-2">
                  {formRows.map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest w-11 shrink-0">
                        Set {i + 1}
                      </span>
                      <input
                        type="text"
                        value={r.reps}
                        onChange={e => updateFormRow(i, { reps: e.target.value })}
                        placeholder="10"
                        title="Repetări (ex: 10 sau 8-12)"
                        className="flex-1 min-w-0 bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-2 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500/60 transition-all font-mono text-center"
                      />
                      <span className="text-[10px] text-zinc-600 font-bold shrink-0">rep</span>
                      <input
                        type="number"
                        min="0" step="0.5"
                        value={r.weight}
                        onChange={e => updateFormRow(i, { weight: e.target.value })}
                        placeholder="80"
                        className="flex-1 min-w-0 bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-2 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500/60 transition-all font-mono text-center"
                      />
                      <span className="text-[10px] text-zinc-600 font-bold shrink-0">kg</span>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-ember hover:bg-orange-400 disabled:opacity-50 text-black font-black text-xs tracking-[0.25em] uppercase py-3 transition-all chamfer-sm"
                >
                  {saving ? 'SALVEZ...' : '+ SALVEAZĂ SETURILE'}
                </button>
                {saveMsg && (
                  <p className={`text-center text-xs font-black tracking-wider ${saveMsg.type === 'ok' ? 'text-green-400' : 'text-red-400'}`}>
                    {saveMsg.text}
                  </p>
                )}
              </form>
            </div>

            {/* History */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 notch">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-sky-500 rounded-sm" />
                  ISTORICUL TĂU
                </h3>
                {logs.length > 0 && (
                  <Link
                    href={`/progress?ex=${exercise.slug}`}
                    className="text-[10px] font-black text-orange-500 tracking-widest hover:text-orange-400 transition-colors"
                  >
                    📈 PROGRES →
                  </Link>
                )}
              </div>
              {logs.length === 0 ? (
                <p className="text-zinc-700 text-xs italic">Niciun set logat încă. Fii primul!</p>
              ) : (
                <div className="space-y-1">
                  {logs.slice(0, 5).map((log, i) => (
                    <div
                      key={log.id}
                      className={`flex items-center justify-between py-2.5 ${i < Math.min(logs.length, 5) - 1 ? 'border-b border-zinc-900' : ''}`}
                    >
                      <span className="text-white text-sm font-bold">
                        {log.sets} × {log.reps}{' '}
                        <span className="text-zinc-500">@</span>{' '}
                        <span className="text-orange-500">{log.weight}kg</span>
                      </span>
                      <span className="text-zinc-600 text-[10px] font-medium">{formatDate(log.logged_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress chart */}
            {chartWeights.length >= 2 && (
              <div className="bg-zinc-950 border border-zinc-800 p-6 notch">
                <h3 className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-green-500 rounded-sm" />
                  PROGRES GREUTATE
                </h3>
                <MiniBarChart weights={chartWeights} />
              </div>
            )}

            {/* Similar exercises */}
            {similar.length > 0 && (
              <div className="bg-zinc-950 border border-zinc-800 p-6 notch">
                <h3 className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-purple-500 rounded-sm" />
                  EXERCIȚII SIMILARE
                </h3>
                <div className="space-y-2">
                  {similar.map(s => (
                    <Link
                      key={s.id}
                      href={`/exercises/${s.slug}`}
                      className="flex items-center gap-3 p-3 bg-zinc-900 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 rounded-2xl transition-all group"
                    >
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={exerciseImage(s.slug) ?? exerciseThumb(s.slug, 'mq') ?? BASE_GYM_IMAGE}
                          alt={s.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 ${MUSCLE_OVERLAY[s.primary_muscle] ?? ''} mix-blend-multiply opacity-50`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-xs font-black uppercase italic truncate">{s.name}</p>
                        <p className={`text-[10px] font-bold mt-0.5 ${MUSCLE_COLOR[s.primary_muscle] ?? 'text-zinc-500'}`}>
                          {s.equipment}
                        </p>
                      </div>
                      <span className="text-zinc-600 group-hover:text-orange-500 transition-colors text-sm shrink-0">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* YouTube modal */}
      {showYoutube && videoId && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={e => { if (e.target === e.currentTarget) setShowYoutube(false); }}
        >
          <div className="w-full max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black italic uppercase tracking-tight">{exercise.name}</h2>
              <button
                onClick={() => setShowYoutube(false)}
                className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>
            <div className="relative w-full rounded-2xl overflow-hidden bg-zinc-900" style={{ paddingBottom: '56.25%' }}>
              {/* www.youtube.com în loc de youtube-nocookie.com — domeniul nocookie e
                  refuzat de Brave/adblockere și de unele filtre de rețea */}
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&playsinline=1`}
                title={`Tutorial ${exercise.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="flex items-center justify-center gap-4 mt-3">
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-ember text-[10px] font-black tracking-widest uppercase transition-colors"
              >
                ▶ Deschide pe YouTube
              </a>
              <span className="text-zinc-800">·</span>
              <a
                href={getYouTubeSearch(exercise.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-zinc-400 text-[10px] tracking-widest uppercase transition-colors"
              >
                Caută alt tutorial →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
