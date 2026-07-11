'use client';
import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { toLocalDateStr, localDayOf } from '@/lib/dates';
import { PLANS } from '@/lib/plans';
import { MUSCLE_COLOR } from '@/lib/exercise-media';
import {
  loadSession, saveSession, clearSession, startSession, type WorkoutSession,
} from '@/lib/workout-session';

/* ─── Rest Timer ─────────────────────────────────────────────────────────── */
function playBeep() {
  try {
    const ctx = new AudioContext();
    [0, 0.15, 0.3].forEach(offset => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.4, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.12);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.12);
    });
  } catch {}
}

const PRESETS = [60, 90, 120, 180];

function RestTimer({ onClose }: { onClose: () => void }) {
  const [total, setTotal] = useState(90);
  const [left, setLeft] = useState(90);
  const [running, setRunning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback((secs: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTotal(secs);
    setLeft(secs);
    setRunning(true);
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const size = 100;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = left / total;
  const done = left === 0;
  const mins = Math.floor(left / 60);
  const secs = left % 60;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 bg-zinc-950 border border-zinc-800 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] notch rise">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase">// PAUZĂ ÎNTRE SETURI</span>
        <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors text-lg leading-none">✕</button>
      </div>

      {/* Ring + countdown */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#18181b" strokeWidth={stroke} />
            <circle cx={size/2} cy={size/2} r={r} fill="none"
              stroke={done ? '#22c55e' : '#f97316'} strokeWidth={stroke}
              strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {done
              ? <span className="text-green-400 text-xl font-black">✓</span>
              : <span className="text-white font-black text-xl font-mono tracking-tighter">
                  {mins}:{secs.toString().padStart(2, '0')}
                </span>
            }
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {done
            ? <p className="text-green-400 font-black text-sm uppercase tracking-wide">Gata! Urmează setul!</p>
            : <p className="text-zinc-400 text-xs font-bold">{running ? 'Pauza curge...' : 'Pauză oprită'}</p>
          }
          <div className="flex gap-2">
            {!done && (
              <button onClick={() => setRunning(r => !r)}
                className="flex-1 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-black text-zinc-300 hover:border-zinc-700 hover:text-white transition-all">
                {running ? '⏸ STOP' : '▶ START'}
              </button>
            )}
            <button onClick={() => reset(total)}
              className="flex-1 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-black text-zinc-300 hover:border-zinc-700 hover:text-white transition-all">
              ↺ RESET
            </button>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="flex gap-2 mt-4">
        {PRESETS.map(s => (
          <button key={s} onClick={() => reset(s)}
            className={`flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all border ${
              total === s && !done
                ? 'bg-orange-500/15 border-orange-500/40 text-orange-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
            }`}>
            {s < 60 ? `${s}s` : `${s/60}m${s%60 ? s%60+'s' : ''}`}
          </button>
        ))}
      </div>
    </div>
  );
}

type Exercise = { id: string; name: string; primary_muscle: string };
type Workout = {
  id: string;
  exercise_id: string;
  sets: number;
  reps: string;
  weight: number;
  notes: string;
  logged_at: string;
  exercises: { name: string; primary_muscle: string };
};

function toDateInputValue(date: Date) {
  return toLocalDateStr(date);
}

function WorkoutContent() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<any>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success' | 'pr'; text: string } | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [timerAvailable, setTimerAvailable] = useState(false);

  // Sesiune activă pornită dintr-un plan
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  function updateSession(next: WorkoutSession | null) {
    setSession(next);
    if (next) saveSession(next);
    else clearSession();
  }

  function toggleSessionItem(i: number) {
    if (!session) return;
    const items = session.items.map((it, idx) => (idx === i ? { ...it, done: !it.done } : it));
    updateSession({ ...session, items });
  }

  // Form state
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false);
  const exerciseInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [sets, setSets] = useState('3');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(toDateInputValue(new Date()));

  // Câte un rând (repetări + greutate) pentru fiecare set
  const [setRows, setSetRows] = useState<{ reps: string; weight: string }[]>([
    { reps: '10', weight: '' }, { reps: '10', weight: '' }, { reps: '10', weight: '' },
  ]);

  // Ultima sesiune la exercițiul selectat (pentru afișare + precompletare)
  // și recordul de greutate de până acum (pentru detectarea PR-ului).
  const [lastSession, setLastSession] = useState<{ day: string; rows: { reps: string; weight: string }[] } | null>(null);
  const [prevMax, setPrevMax] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedExercise || !user) {
      setLastSession(null);
      setPrevMax(null);
      return;
    }
    let cancelled = false;
    async function fetchHistory() {
      const [lastRes, maxRes] = await Promise.all([
        supabase
          .from('workouts')
          .select('sets, reps, weight, logged_at')
          .eq('user_id', user.id)
          .eq('exercise_id', selectedExercise)
          .order('logged_at', { ascending: false })
          .limit(20),
        supabase
          .from('workouts')
          .select('weight')
          .eq('user_id', user.id)
          .eq('exercise_id', selectedExercise)
          .order('weight', { ascending: false })
          .limit(1),
      ]);
      if (cancelled) return;

      const entries = lastRes.data ?? [];
      if (entries.length > 0) {
        // Doar intrările din ziua celei mai recente sesiuni
        const day = localDayOf(entries[0].logged_at);
        const dayEntries = entries.filter(e => localDayOf(e.logged_at) === day);
        // Un rând din DB = `sets` seturi identice; le desfacem cronologic
        const rows: { reps: string; weight: string }[] = [];
        [...dayEntries].reverse().forEach(e => {
          for (let k = 0; k < e.sets && rows.length < 20; k++) {
            rows.push({ reps: e.reps, weight: String(e.weight) });
          }
        });
        setLastSession({ day, rows });
        // Precompletăm formularul cu sesiunea precedentă
        setSets(String(rows.length));
        setSetRows(rows.map(r => ({ ...r })));
      } else {
        setLastSession(null);
      }
      setPrevMax(maxRes.data?.[0]?.weight ?? null);
    }
    fetchHistory();
    return () => { cancelled = true; };
  }, [selectedExercise, user]);

  useEffect(() => {
    const n = Math.max(1, Math.min(20, parseInt(sets) || 1));
    setSetRows(rows => {
      const next = rows.slice(0, n);
      while (next.length < n) {
        const last = next[next.length - 1];
        next.push({ reps: last?.reps ?? '10', weight: last?.weight ?? '' });
      }
      return next;
    });
  }, [sets]);

  function updateRow(i: number, patch: Partial<{ reps: string; weight: string }>) {
    setSetRows(rows => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        exerciseInputRef.current && !exerciseInputRef.current.contains(e.target as Node)
      ) {
        setShowExerciseDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);

      const [{ data: exData }, { data: wData }] = await Promise.all([
        supabase.from('exercises').select('id, name, primary_muscle').order('name'),
        supabase
          .from('workouts')
          .select('*, exercises(name, primary_muscle)')
          .eq('user_id', user.id)
          .order('logged_at', { ascending: false })
          .limit(50),
      ]);

      if (exData) {
        setExercises(exData);

        const selectByName = (name: string) => {
          const match = exData.find(ex => ex.name.toLowerCase() === name.toLowerCase());
          if (match) {
            setSelectedExercise(match.id);
            setExerciseSearch(match.name);
          }
        };

        const planId = searchParams.get('plan');
        const plan = planId ? PLANS.find(p => p.id === planId) : undefined;
        const existing = loadSession();

        if (plan) {
          // Reluăm sesiunea dacă e același plan, altfel pornim una nouă
          const s = existing && existing.planId === plan.id ? existing : startSession(plan);
          setSession(s);
          const next = s.items.find(it => !it.done) ?? s.items[0];
          if (next) selectByName(next.name);
        } else if (existing) {
          // Sesiune neterminată — o reluăm și fără parametru în URL
          setSession(existing);
          const next = existing.items.find(it => !it.done);
          if (next) selectByName(next.name);
        } else {
          const planExercises = searchParams.get('exercises');
          if (planExercises) selectByName(planExercises.split(',')[0].trim());
        }
      }
      if (wData) setWorkouts(wData as Workout[]);
      setLoading(false);
    }
    init();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedExercise) {
      setMessage({ type: 'error', text: 'Selectează un exercițiu din listă.' });
      return;
    }

    // Validare repetări — acceptă "10", "10-12", "8-12" etc.
    const repsOk = (r: string) => /^\d+(-\d+)?$/.test(r.trim());
    const bad = setRows.findIndex(r => !repsOk(r.reps) || r.weight === '');
    if (bad !== -1) {
      setMessage({ type: 'error', text: `Setul ${bad + 1}: completează repetările (ex: 10 sau 8-12) și greutatea.` });
      return;
    }

    setSaving(true);
    setMessage(null);

    // Combinăm data aleasă cu ora curentă
    const baseTime = new Date(`${date}T${new Date().toTimeString().slice(0, 8)}`);

    // Seturile consecutive identice se comasează într-un singur rând
    const merged: { sets: number; reps: string; weight: number }[] = [];
    setRows.forEach(r => {
      const w = parseFloat(r.weight);
      const last = merged[merged.length - 1];
      if (last && last.reps === r.reps.trim() && last.weight === w) last.sets++;
      else merged.push({ sets: 1, reps: r.reps.trim(), weight: w });
    });

    const rowsToInsert = merged.map((m, i) => ({
      user_id: user.id,
      exercise_id: selectedExercise,
      sets: m.sets,
      reps: m.reps,
      weight: m.weight,
      notes: i === 0 ? notes.trim() || null : null,
      // +i secunde ca ordinea seturilor să se păstreze la sortare
      logged_at: new Date(baseTime.getTime() + i * 1000).toISOString(),
    }));

    const { data, error } = await supabase
      .from('workouts')
      .insert(rowsToInsert)
      .select('*, exercises(name, primary_muscle)');

    if (error || !data) {
      setMessage({ type: 'error', text: 'Eroare la salvare. Încearcă din nou.' });
    } else {
      // Inserăm în lista și re-sortăm
      const updated = [...(data as Workout[]), ...workouts].sort(
        (a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
      );
      setWorkouts(updated);
      const nSets = merged.reduce((a, m) => a + m.sets, 0);
      const maxSaved = Math.max(...merged.map(m => m.weight));
      const isPr = prevMax !== null && maxSaved > prevMax;
      if (isPr) {
        setMessage({ type: 'pr', text: `🏆 PR NOU: ${maxSaved}kg! Recordul anterior era ${prevMax}kg.` });
      } else {
        setMessage({ type: 'success', text: `✓ ${nSets === 1 ? 'Set salvat' : nSets + ' seturi salvate'}! Timerul de pauză a pornit.` });
      }
      if (prevMax === null || maxSaved > prevMax) setPrevMax(maxSaved);

      // Progres în sesiunea activă: bifează exercițiul și avansează la următorul
      if (session) {
        const exName = exercises.find(ex => ex.id === selectedExercise)?.name.toLowerCase();
        const idx = session.items.findIndex(it => !it.done && it.name.toLowerCase() === exName);
        const avgReps = (r: string) => r.includes('-')
          ? (parseInt(r.split('-')[0]) + parseInt(r.split('-')[1])) / 2
          : parseFloat(r) || 0;
        const savedVolume = merged.reduce((a, m) => a + m.sets * avgReps(m.reps) * m.weight, 0);
        const items = idx === -1
          ? session.items
          : session.items.map((it, i) => (i === idx ? { ...it, done: true } : it));
        updateSession({
          ...session,
          items,
          totalSets: session.totalSets + nSets,
          volume: session.volume + savedVolume,
          prs: session.prs + (isPr ? 1 : 0),
        });
        if (idx !== -1) {
          const upcoming = items.find(it => !it.done);
          if (upcoming) {
            const match = exercises.find(ex => ex.name.toLowerCase() === upcoming.name.toLowerCase());
            if (match) {
              setSelectedExercise(match.id);
              setExerciseSearch(match.name);
            }
          } else {
            setShowSummary(true);
          }
        }
      }

      setNotes('');
      setSetRows(rows => rows.map(r => ({ ...r, weight: '' })));
      setShowTimer(true);
      setTimerAvailable(true);
    }
    setSaving(false);
  }

  // Ștergerea cere un al doilea tap de confirmare (nu există undo).
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!confirmDeleteId) return;
    const t = setTimeout(() => setConfirmDeleteId(null), 3000);
    return () => clearTimeout(t);
  }, [confirmDeleteId]);

  async function handleDelete(id: string) {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setConfirmDeleteId(null);
    await supabase.from('workouts').delete().eq('id', id);
    setWorkouts(workouts.filter(w => w.id !== id));
  }

  // ── Editare inline în istoric ──
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSets, setEditSets] = useState('1');
  const [editReps, setEditReps] = useState('10');
  const [editWeight, setEditWeight] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const editValid = /^\d+(-\d+)?$/.test(editReps.trim()) && editWeight !== '' && parseInt(editSets) >= 1;

  function startEdit(w: Workout) {
    setEditingId(w.id);
    setEditSets(String(w.sets));
    setEditReps(w.reps);
    setEditWeight(String(w.weight));
  }

  async function handleEditSave(id: string) {
    if (!editValid) return;
    setEditSaving(true);
    const { data, error } = await supabase
      .from('workouts')
      .update({ sets: parseInt(editSets), reps: editReps.trim(), weight: parseFloat(editWeight) })
      .eq('id', id)
      .select('*, exercises(name, primary_muscle)')
      .single();
    if (!error && data) {
      setWorkouts(ws => ws.map(w => (w.id === id ? (data as Workout) : w)));
      setEditingId(null);
    }
    setEditSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <p className="font-display italic text-ember text-2xl uppercase animate-pulse">SE ÎNCARCĂ...</p>
      </div>
    );
  }

  // Grupează pe dată
  const grouped = workouts.reduce((acc, w) => {
    const day = new Date(w.logged_at).toLocaleDateString('ro-RO', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    if (!acc[day]) acc[day] = [];
    acc[day].push(w);
    return acc;
  }, {} as Record<string, Workout[]>);

  const today = toDateInputValue(new Date());
  const isToday = date === today;
  const isFuture = date > today;

  const doneCount = session ? session.items.filter(it => it.done).length : 0;
  const sessionMinutes = session
    ? Math.max(1, Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000))
    : 0;
  const durationText = sessionMinutes >= 60
    ? `${Math.floor(sessionMinutes / 60)}h ${sessionMinutes % 60}m`
    : `${sessionMinutes} min`;

  function selectSessionExercise(name: string) {
    const match = exercises.find(ex => ex.name.toLowerCase() === name.toLowerCase());
    if (match) {
      setSelectedExercise(match.id);
      setExerciseSearch(match.name);
      setShowExerciseDropdown(false);
    }
  }

  return (
    <div className="min-h-screen bg-void text-white">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-12">
          <p className="text-ember font-black text-xs tracking-[0.4em] uppercase mb-3 flex items-center gap-3">
            <span className="w-6 h-[3px] stripes inline-block" />
            JURNAL
          </p>
          <h1 className="font-display italic uppercase text-5xl md:text-7xl leading-none rise">
            WORKOUT <span className="text-ember">TRACKER</span>
          </h1>
          <p className="text-zinc-600 text-sm font-bold tracking-widest uppercase mt-3">
            {workouts.length} antrenamente înregistrate
          </p>
        </div>

        {/* ── Sesiune activă din plan ── */}
        {session && (
          <div className="mb-10 bg-zinc-950 border border-orange-500/25 p-6 notch rise">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-[10px] font-black tracking-[0.4em] text-orange-500 uppercase mb-1.5">
                  ⚡ SESIUNE ACTIVĂ · {durationText}
                </p>
                <p className="font-display italic uppercase text-2xl leading-none">{session.planName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-1">
                  {doneCount}/{session.items.length} exerciții
                </span>
                <button
                  onClick={() => setShowSummary(true)}
                  className="px-4 py-2 bg-ember text-black text-[10px] font-black uppercase tracking-widest chamfer-sm hover:bg-orange-400 transition-all"
                >
                  ÎNCHEIE
                </button>
                <button
                  onClick={() => updateSession(null)}
                  title="Abandonează sesiunea (fără rezumat)"
                  className="px-2 py-2 text-zinc-600 hover:text-red-500 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${(doneCount / session.items.length) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {session.items.map((it, i) => {
                const isCurrent = !it.done && exerciseSearch.toLowerCase() === it.name.toLowerCase();
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                      it.done
                        ? 'bg-zinc-900/30 border-zinc-900 opacity-60'
                        : isCurrent
                        ? 'bg-orange-500/10 border-orange-500/40'
                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSessionItem(i)}
                      title={it.done ? 'Demarchează' : 'Marchează făcut (skip)'}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${
                        it.done
                          ? 'bg-green-500/20 border-green-500/50 text-green-400'
                          : 'border-zinc-700 text-zinc-600 hover:border-orange-500/60 hover:text-orange-400'
                      }`}
                    >
                      {it.done ? '✓' : i + 1}
                    </button>
                    <button
                      type="button"
                      onClick={() => selectSessionExercise(it.name)}
                      className="flex-1 min-w-0 text-left"
                    >
                      <p className={`text-sm font-bold truncate ${it.done ? 'text-zinc-600 line-through' : 'text-white'}`}>
                        {it.name}
                      </p>
                      <p className="text-[10px] text-zinc-600 font-bold">
                        <span className={MUSCLE_COLOR[it.muscle] ?? ''}>{it.muscle}</span>
                        {' '}· țintă {it.sets}×{it.reps} · pauză {it.rest}
                      </p>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-950 border border-zinc-900 p-8 sticky top-24 notch">
              <h2 className="text-sm font-black tracking-[0.3em] uppercase mb-8 flex items-center gap-3">
                <span className="w-2 h-5 bg-orange-500 rounded-full"></span>
                LOGHEAZĂ SET
              </h2>

              <form onSubmit={handleSave} className="space-y-5">

                {/* Data */}
                <div>
                  <label className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase block mb-2">
                    Data antrenamentului
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/60 transition-all font-mono [color-scheme:dark]"
                    />
                    {(isToday || isFuture) && (
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest ${isFuture ? 'text-orange-500' : 'text-green-500'}`}>
                        {isFuture ? 'PLANIFICAT' : 'AZI'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Exercițiu */}
                <div className="relative">
                  <label className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase block mb-2">
                    Exercițiu
                  </label>
                  <input
                    ref={exerciseInputRef}
                    type="text"
                    value={exerciseSearch}
                    onChange={e => {
                      setExerciseSearch(e.target.value);
                      setSelectedExercise('');
                      setShowExerciseDropdown(true);
                    }}
                    onFocus={() => setShowExerciseDropdown(true)}
                    placeholder="Caută exercițiu..."
                    autoComplete="off"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/60 transition-all"
                  />
                  {selectedExercise && (
                    <span className="absolute right-3 top-[calc(50%+6px)] -translate-y-1/2 text-green-500 text-sm font-black">✓</span>
                  )}
                  {showExerciseDropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-50 mt-1 w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl"
                    >
                      <div className="max-h-56 overflow-y-auto">
                        {exercises
                          .filter(ex =>
                            ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
                            ex.primary_muscle.toLowerCase().includes(exerciseSearch.toLowerCase())
                          )
                          .map(ex => (
                            <button
                              key={ex.id}
                              type="button"
                              onMouseDown={() => {
                                setSelectedExercise(ex.id);
                                setExerciseSearch(ex.name);
                                setShowExerciseDropdown(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-zinc-800 active:bg-zinc-700 transition-colors flex items-center justify-between gap-3 border-b border-zinc-800/50 last:border-0"
                            >
                              <span className="text-sm text-white font-bold">{ex.name}</span>
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest shrink-0">{ex.primary_muscle}</span>
                            </button>
                          ))}
                        {exercises.filter(ex =>
                          ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
                          ex.primary_muscle.toLowerCase().includes(exerciseSearch.toLowerCase())
                        ).length === 0 && (
                          <p className="text-zinc-600 text-xs text-center py-4 uppercase tracking-widest">Niciun rezultat</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ultima sesiune la exercițiul selectat */}
                {selectedExercise && lastSession && (
                  <div className="px-4 py-3 bg-sky-500/5 border border-sky-500/20 rounded-xl">
                    <p className="text-[9px] font-black tracking-[0.3em] text-sky-400 uppercase mb-1.5">
                      Ultima dată · {new Date(lastSession.day + 'T12:00:00').toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
                      {prevMax !== null && <span className="text-yellow-500/80 ml-2">🏆 record {prevMax}kg</span>}
                    </p>
                    <p className="text-xs text-zinc-400 font-mono">
                      {lastSession.rows.map(r => `${r.weight}kg×${r.reps}`).join(' · ')}
                    </p>
                    <p className="text-[9px] text-zinc-600 mt-1">seturile de mai jos sunt precompletate cu sesiunea asta</p>
                  </div>
                )}

                {/* Seturi */}
                <div>
                  <label className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase block mb-2">
                    Seturi
                  </label>
                  <input
                    type="number"
                    min="1" max="20"
                    value={sets}
                    onChange={e => setSets(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/60 transition-all font-mono text-center"
                  />
                </div>

                {/* Rând pentru fiecare set: repetări + greutate */}
                <div className="space-y-2">
                  {setRows.map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest w-11 shrink-0">
                        Set {i + 1}
                      </span>
                      <input
                        type="text"
                        value={r.reps}
                        onChange={e => updateRow(i, { reps: e.target.value })}
                        placeholder="10"
                        title="Repetări (ex: 10 sau 8-12)"
                        className="flex-1 min-w-0 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500/60 transition-all font-mono text-center"
                      />
                      <span className="text-[10px] text-zinc-600 font-bold shrink-0">rep</span>
                      <input
                        type="number"
                        min="0" step="0.5"
                        value={r.weight}
                        onChange={e => updateRow(i, { weight: e.target.value })}
                        placeholder="80"
                        className="flex-1 min-w-0 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500/60 transition-all font-mono text-center"
                      />
                      <span className="text-[10px] text-zinc-600 font-bold shrink-0">kg</span>
                    </div>
                  ))}
                  <p className="text-[9px] text-zinc-700 tracking-wider">repetări: număr (10) sau interval (8-12)</p>
                </div>

                {/* Note */}
                <div>
                  <label className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase block mb-2">
                    Note (opțional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="ex: formă bună, greutate nouă..."
                    rows={2}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500/60 transition-all resize-none"
                  />
                </div>

                {/* Message */}
                {message && (
                  <div className={`px-4 py-3 rounded-xl text-xs font-bold border ${
                    message.type === 'error'
                      ? 'bg-red-500/5 border-red-500/20 text-red-400'
                      : message.type === 'pr'
                      ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-300'
                      : 'bg-green-500/5 border-green-500/20 text-green-400'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-4 bg-ember text-black font-black italic uppercase tracking-tight hover:bg-orange-400 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed chamfer"
                >
                  {saving ? 'SE SALVEAZĂ...' : 'SALVEAZĂ SETUL →'}
                </button>
              </form>
            </div>
          </div>

          {/* Istoric */}
          <div className="lg:col-span-3">
            <h2 className="text-sm font-black tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
              <span className="w-2 h-5 bg-zinc-700 rounded-full"></span>
              ISTORIC ANTRENAMENTE
            </h2>

            {workouts.length === 0 ? (
              <div className="bg-zinc-950 border border-zinc-900 p-12 text-center notch">
                <p className="text-5xl mb-4">🏋️</p>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">
                  Niciun antrenament înregistrat încă.
                </p>
                <p className="text-zinc-700 text-xs mt-2">Loghează primul set din stânga!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(grouped).map(([day, items]) => {
                  const dayDate = toDateInputValue(new Date(items[0].logged_at));
                  const isPlanned = dayDate > today;
                  return (
                    <div key={day}>
                      <div className="flex items-center gap-3 mb-3">
                        <p className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase capitalize">
                          {day}
                        </p>
                        {isPlanned && (
                          <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 border border-orange-500/30 px-2 py-0.5 rounded-full">
                            PLANIFICAT
                          </span>
                        )}
                      </div>
                      <div className="space-y-3">
                        {/* Grupăm intrările zilei pe exercițiu, păstrând ordinea */}
                        {items.reduce((acc: { key: string; entries: Workout[] }[], w) => {
                          const g = acc.find(g => g.key === w.exercise_id);
                          if (g) g.entries.push(w); else acc.push({ key: w.exercise_id, entries: [w] });
                          return acc;
                        }, []).map(({ key, entries }) => {
                          const first = entries[0];
                          const totalSets = entries.reduce((a, e) => a + e.sets, 0);
                          return (
                            <div
                              key={key}
                              className="bg-zinc-950 border border-zinc-900 px-6 py-5 hover:border-zinc-700 transition-all"
                            >
                              <div className="flex items-center justify-between gap-4 mb-3">
                                <div className="min-w-0">
                                  <p className="font-display uppercase text-base leading-none tracking-wide mb-1">
                                    {first.exercises?.name}
                                  </p>
                                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                                    {first.exercises?.primary_muscle}
                                  </p>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 shrink-0">
                                  {totalSets} {totalSets === 1 ? 'set' : 'seturi'}
                                </p>
                              </div>

                              <div className="space-y-1.5">
                                {/* cronologic: setul 1 primul */}
                                {[...entries].reverse().map(w => editingId === w.id ? (
                                  <div
                                    key={w.id}
                                    className="flex items-center gap-2 bg-zinc-900/70 border border-orange-500/30 rounded-xl px-3 py-2"
                                  >
                                    <input
                                      type="number" min="1" max="20" value={editSets}
                                      onChange={e => setEditSets(e.target.value)}
                                      className="w-12 bg-zinc-950 border border-zinc-800 rounded-lg px-1 py-1.5 text-sm text-white font-mono text-center focus:outline-none focus:border-orange-500/60"
                                    />
                                    <span className="text-xs text-zinc-600 shrink-0">×</span>
                                    <input
                                      type="text" value={editReps}
                                      onChange={e => setEditReps(e.target.value)}
                                      className="w-14 bg-zinc-950 border border-zinc-800 rounded-lg px-1 py-1.5 text-sm text-white font-mono text-center focus:outline-none focus:border-orange-500/60"
                                    />
                                    <span className="text-xs text-zinc-600 shrink-0">rep</span>
                                    <input
                                      type="number" min="0" step="0.5" value={editWeight}
                                      onChange={e => setEditWeight(e.target.value)}
                                      className="w-16 bg-zinc-950 border border-zinc-800 rounded-lg px-1 py-1.5 text-sm text-white font-mono text-center focus:outline-none focus:border-orange-500/60"
                                    />
                                    <span className="text-xs text-zinc-600 shrink-0">kg</span>
                                    <div className="ml-auto flex items-center gap-1 shrink-0">
                                      <button
                                        onClick={() => handleEditSave(w.id)}
                                        disabled={!editValid || editSaving}
                                        className="px-2.5 py-1.5 bg-orange-500 text-black rounded-lg text-xs font-black hover:bg-orange-400 transition-all disabled:opacity-40"
                                        title="Salvează"
                                      >
                                        ✓
                                      </button>
                                      <button
                                        onClick={() => setEditingId(null)}
                                        className="px-2 py-1.5 text-zinc-500 hover:text-white transition-all text-sm"
                                        title="Anulează"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    key={w.id}
                                    className="group/set flex items-center gap-4 bg-zinc-900/40 rounded-xl px-4 py-2.5"
                                  >
                                    <p className="font-display text-base leading-none shrink-0">
                                      <span className="text-ember">{w.sets}</span>
                                      <span className="text-xs text-zinc-600 mx-1">×</span>
                                      {w.reps}
                                      <span className="text-xs text-zinc-600 ml-1 mr-2">rep</span>
                                      {w.weight}<span className="text-xs text-zinc-600">kg</span>
                                    </p>
                                    {w.notes && (
                                      <p className="text-[11px] text-zinc-500 italic truncate flex-1 min-w-0">"{w.notes}"</p>
                                    )}
                                    <div className="ml-auto flex items-center gap-2 shrink-0">
                                      <button
                                        onClick={() => startEdit(w)}
                                        className="opacity-0 group-hover/set:opacity-100 [@media(hover:none)]:opacity-100 text-zinc-700 hover:text-orange-400 transition-all text-sm"
                                        title="Editează"
                                      >
                                        ✎
                                      </button>
                                      <button
                                        onClick={() => handleDelete(w.id)}
                                        className={confirmDeleteId === w.id
                                          ? 'text-red-500 text-[10px] font-black uppercase tracking-wider bg-red-500/10 border border-red-500/30 rounded-lg px-2 py-1 transition-all'
                                          : 'opacity-0 group-hover/set:opacity-100 [@media(hover:none)]:opacity-100 text-zinc-700 hover:text-red-500 active:text-red-500 transition-all text-sm'}
                                        title={confirmDeleteId === w.id ? 'Apasă din nou pentru a șterge' : 'Șterge'}
                                      >
                                        {confirmDeleteId === w.id ? 'Sigur?' : '✕'}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rezumatul sesiunii */}
      {showSummary && session && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-md"
          onClick={e => { if (e.target === e.currentTarget) setShowSummary(false); }}
        >
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md p-8 notch rise">
            <p className="text-[10px] font-black tracking-[0.4em] text-orange-500 uppercase mb-2">
              // SESIUNE ÎNCHEIATĂ
            </p>
            <h2 className="font-display italic uppercase text-3xl leading-none mb-6">{session.planName}</h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'DURATĂ', value: durationText },
                { label: 'SETURI', value: String(session.totalSets) },
                { label: 'VOLUM', value: `${Math.round(session.volume).toLocaleString('ro-RO')} kg` },
                { label: 'PR-URI', value: session.prs > 0 ? `🏆 ${session.prs}` : '—' },
              ].map(s => (
                <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                  <p className="font-display text-2xl text-white mb-1">{s.value}</p>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.25em]">{s.label}</p>
                </div>
              ))}
            </div>

            <p className="text-zinc-500 text-xs mb-6">
              {doneCount}/{session.items.length} exerciții finalizate
              {doneCount === session.items.length ? ' — antrenament complet! 💪' : ''}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => { updateSession(null); setShowSummary(false); }}
                className="flex-1 py-3 bg-ember text-black font-black text-xs uppercase tracking-widest chamfer-sm hover:bg-orange-400 transition-all"
              >
                ÎNCHEIE SESIUNEA
              </button>
              <button
                onClick={() => setShowSummary(false)}
                className="flex-1 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 font-black text-xs uppercase tracking-widest hover:text-white transition-all"
              >
                MAI CONTINUI
              </button>
            </div>
          </div>
        </div>
      )}

      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}
      {!showTimer && timerAvailable && (
        <button
          onClick={() => setShowTimer(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-orange-500/40 transition-all group"
        >
          <span className="text-base">⏱</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-orange-400 transition-colors">TIMER PAUZĂ</span>
        </button>
      )}
    </div>
  );
}
export default function WorkoutPage() {
  return (
    <Suspense>
      <WorkoutContent />
    </Suspense>
  );
}
