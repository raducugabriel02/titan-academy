'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toLocalDateStr as dateStr } from '@/lib/dates';
import { ACTIVITY, calcTDEE, calcTargets, loadSavedTargets, targetsKey, type Profile } from '@/lib/nutrition';

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface DayData {
  id?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water_glasses: number;
  notes: string;
}

interface WeekDay { date: string; calories: number }

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function CalorieRing({ consumed, target }: { consumed: number; target: number }) {
  const size = 220;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = target > 0 ? Math.min(consumed / target, 1) : 0;
  const over = consumed > target;
  const remaining = Math.max(0, target - consumed);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#18181b" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke={over ? '#ef4444' : '#f97316'} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display text-4xl leading-none" style={{ color: over ? '#ef4444' : 'white' }}>
            {consumed.toLocaleString()}
          </span>
          <span className="text-xs text-zinc-500 font-bold mt-1">din {target.toLocaleString()} kcal</span>
          {over
            ? <span className="text-[10px] text-red-400 font-black uppercase tracking-widest mt-1">+{(consumed-target).toLocaleString()} DEPĂȘIT</span>
            : <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-1">{remaining.toLocaleString()} rămase</span>
          }
        </div>
      </div>
    </div>
  );
}

function MacroBar({ label, value, target, color, unit = 'g', onChange, onTargetChange }:
  { label: string; value: number; target: number; color: string; unit?: string; onChange: (v: number) => void; onTargetChange: (v: number) => void }) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0;
  const over = value > target;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-widest" style={{ color }}>{label}</span>
        <div className="flex items-center gap-1 text-xs font-black">
          <input type="number" min="0" value={value || ''}
            onChange={e => onChange(parseInt(e.target.value) || 0)}
            className="w-14 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-white text-center font-mono focus:outline-none focus:border-orange-500/60 transition-all"
          />
          <span className="text-zinc-600">/</span>
          <input type="number" min="0" value={target || ''}
            onChange={e => onTargetChange(parseInt(e.target.value) || 0)}
            className="w-14 bg-zinc-900/50 border border-zinc-800/50 rounded-lg px-2 py-1 text-zinc-500 text-center font-mono focus:outline-none focus:border-zinc-600 transition-all"
          />
          <span className="text-zinc-600 text-[10px]">{unit}</span>
        </div>
      </div>
      <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: over ? '#ef4444' : color }} />
      </div>
      <div className="flex justify-between text-[10px] text-zinc-700 font-bold">
        <span>{Math.round(pct)}%</span>
        <span style={{ color: over ? '#ef4444' : undefined }}>{over ? `+${value - target}g depășit` : `${target - value}g rămase`}</span>
      </div>
    </div>
  );
}

function WaterGlass({ filled, onClick }: { filled: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="relative w-10 h-14 rounded-b-lg border-2 transition-all duration-300 overflow-hidden group"
      style={{ borderColor: filled ? '#38bdf8' : '#27272a', background: '#09090b' }}>
      <div className="absolute bottom-0 left-0 right-0 transition-all duration-500 rounded-b-md"
        style={{ height: filled ? '100%' : '0%', background: 'linear-gradient(to top, #0ea5e9, #38bdf8)' }} />
      {!filled && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
        </div>
      )}
    </button>
  );
}

function WeekChart({ data, today, target }: { data: WeekDay[]; today: string; target: number }) {
  const max = Math.max(...data.map(d => d.calories), target, 1);
  const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((d, i) => {
        const pct = (d.calories / max) * 100;
        const isToday = d.date === today;
        const overTarget = d.calories > target;
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end" style={{ height: 80 }}>
              <div className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${Math.max(pct, 2)}%`,
                  background: isToday ? '#f97316' : overTarget ? '#7f1d1d' : '#27272a',
                  border: isToday ? '1px solid #fb923c' : 'none',
                }} />
            </div>
            <span className="text-[9px] font-black" style={{ color: isToday ? '#f97316' : '#52525b' }}>
              {days[new Date(d.date + 'T12:00:00').getDay()]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function addDays(s: string, n: number) {
  const d = new Date(s + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return dateStr(d);
}
function formatDate(s: string) {
  return new Date(s + 'T12:00:00').toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' });
}

const EMPTY: DayData = { calories: 0, protein: 0, carbs: 0, fat: 0, water_glasses: 0, notes: '' };

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function NutritionPage() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const [profile, setProfile] = useState<Profile>({ weight: null, height: null, age: null, gender: null, activity_level: null, goal: null });
  const [targets, setTargets] = useState({ calories: 2000, protein: 150, carbs: 200, fat: 70 });
  const tdee = calcTDEE(profile);

  // Țintele rămân consistente între ele: editarea unui macro recalculează
  // caloriile, iar editarea caloriilor ajustează carbohidrații (restul caloric).
  function setMacroTarget(key: 'protein' | 'carbs' | 'fat', v: number) {
    setTargets(prev => {
      const next = { ...prev, [key]: v };
      return { ...next, calories: next.protein * 4 + next.carbs * 4 + next.fat * 9 };
    });
  }
  function setCalorieTarget(v: number) {
    setTargets(prev => ({
      ...prev,
      calories: v,
      carbs: Math.max(0, Math.round((v - prev.protein * 4 - prev.fat * 9) / 4)),
    }));
  }

  const [date, setDate] = useState(dateStr(new Date()));
  const [data, setData] = useState<DayData>(EMPTY);
  const [weekData, setWeekData] = useState<WeekDay[]>([]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const today = dateStr(new Date());

  // ── Fetch day ──────────────────────────────────────────────────────────
  const fetchDay = useCallback(async (uid: string, d: string) => {
    const { data: row } = await supabase.from('nutrition').select('*').eq('user_id', uid).eq('date', d).single();
    setData(row ? { calories: row.calories, protein: row.protein, carbs: row.carbs, fat: row.fat, water_glasses: row.water_glasses, notes: row.notes ?? '' } : EMPTY);
  }, []);

  const fetchWeek = useCallback(async (uid: string, currentDate: string) => {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) days.push(addDays(currentDate, -i));
    const { data: rows } = await supabase.from('nutrition').select('date,calories').eq('user_id', uid).in('date', days);
    setWeekData(days.map(d => ({ date: d, calories: (rows ?? []).find((r: any) => r.date === d)?.calories ?? 0 })));
  }, []);

  // ── Init ───────────────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);

      const { data: prof } = await supabase.from('profiles')
        .select('weight,height,age,gender,activity_level,goal').eq('id', user.id).single();
      if (prof) {
        const p = prof as Profile;
        setProfile(p);
        setTargets(calcTargets(p));
      }

      // Țintele editate manual au prioritate față de cele calculate din profil.
      const saved = loadSavedTargets(user.id);
      if (saved) setTargets(saved);

      await Promise.all([fetchDay(user.id, date), fetchWeek(user.id, date)]);
      setLoading(false);
    }
    init();
  }, []);

  // ── Change date ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    fetchDay(user.id, date);
    fetchWeek(user.id, date);
  }, [date, user]);

  // ── Persist targets ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && user) localStorage.setItem(targetsKey(user.id), JSON.stringify(targets));
  }, [targets, loading, user]);

  // ── Auto-save ──────────────────────────────────────────────────────────
  const save = useCallback(async (d: DayData, uid: string, dt: string) => {
    const calories = d.protein * 4 + d.carbs * 4 + Math.round(d.fat * 9);
    setSaveStatus('saving');
    await supabase.from('nutrition').upsert({
      user_id: uid, date: dt,
      calories, protein: d.protein, carbs: d.carbs, fat: d.fat,
      water_glasses: d.water_glasses, notes: d.notes,
    }, { onConflict: 'user_id,date' });
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
    setWeekData(prev => prev.map(w => w.date === dt ? { ...w, calories } : w));
  }, []);

  function update(patch: Partial<DayData>) {
    const next = { ...data, ...patch };
    setData(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save(next, user.id, date), 800);
  }

  // ── Quick add ──────────────────────────────────────────────────────────
  function quickAdd(kcal: number) {
    const totalTarget = targets.protein * 4 + targets.carbs * 4 + targets.fat * 9 || 1;
    const p = Math.round((targets.protein * 4 / totalTarget) * kcal / 4);
    const f = Math.round((targets.fat * 9 / totalTarget) * kcal / 9);
    const c = Math.round((kcal - p * 4 - f * 9) / 4);
    update({ protein: data.protein + p, carbs: data.carbs + c, fat: data.fat + f });
  }

  const calories = data.protein * 4 + data.carbs * 4 + Math.round(data.fat * 9);
  const profileOk = profile.weight && profile.height && profile.age && profile.gender && profile.activity_level;

  if (loading) return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-void text-white">
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: 'linear-gradient(rgba(18,16,16,0) 50%,rgba(0,0,0,0.3) 50%)', backgroundSize: '100% 4px' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-10">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-ember font-black text-[10px] tracking-[0.5em] uppercase mb-3 flex items-center gap-3">
              <span className="w-6 h-[3px] stripes inline-block" />
              NUTRIȚIE
            </p>
            <h1 className="font-display italic uppercase text-4xl md:text-5xl leading-none rise">
              NUTRITION <span className="text-ember">TRACKER</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {saveStatus === 'saving' && <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest animate-pulse">Se salvează...</span>}
            {saveStatus === 'saved'  && <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">✓ Salvat</span>}

            <button onClick={() => setDate(addDays(date, -1))}
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all font-black">‹</button>

            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-tight capitalize">{formatDate(date)}</p>
              {date !== today && (
                <button onClick={() => setDate(today)}
                  className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline">AZI</button>
              )}
            </div>

            <button onClick={() => setDate(addDays(date, 1))} disabled={date >= today}
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all font-black disabled:opacity-30">›</button>
          </div>
        </div>

        {/* ── 3-column grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ══ STÂNGA — TDEE + Targets ════════════════════════════════ */}
          <div className="space-y-5">

            {/* TDEE Card */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 hover:border-zinc-700 transition-all notch">
              <p className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase mb-5">// TDEE CALCULATOR</p>

              {!profileOk ? (
                <div className="text-center py-4">
                  <p className="text-zinc-500 text-xs mb-3">Completează profilul pentru calcul automat.</p>
                  <a href="/profile" className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-500/20 transition-all">
                    COMPLETEAZĂ PROFILUL →
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Greutate', value: `${profile.weight} kg` },
                      { label: 'Înălțime', value: `${profile.height} cm` },
                      { label: 'Vârstă', value: `${profile.age} ani` },
                      { label: 'Sex', value: profile.gender === 'm' ? 'Bărbat' : 'Femeie' },
                    ].map(f => (
                      <div key={f.label} className="bg-zinc-900/60 rounded-2xl px-3 py-2.5">
                        <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">{f.label}</p>
                        <p className="text-sm font-black text-white mt-0.5">{f.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-zinc-800" />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Metabolism bazal</p>
                        <p className="text-[9px] text-zinc-700 font-bold mt-0.5">calorii arse fără nicio mișcare</p>
                      </div>
                      <span className="text-sm font-black text-zinc-300">{tdee?.bmr.toLocaleString()} kcal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Nivel activitate</p>
                        <p className="text-[9px] text-zinc-700 font-bold mt-0.5">{ACTIVITY[profile.activity_level!]?.label ?? '—'}</p>
                      </div>
                      <span className="text-sm font-black text-zinc-300">{ACTIVITY[profile.activity_level!]?.mult}×</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
                      <div>
                        <p className="text-[10px] text-orange-500 uppercase font-black tracking-widest">Necesar caloric zilnic</p>
                        <p className="text-[9px] text-orange-500/40 font-bold mt-0.5">calorii de consumat pe zi</p>
                      </div>
                      <span className="text-lg font-black text-orange-500">{tdee?.tdee.toLocaleString()} kcal</span>
                    </div>
                  </div>

                  {profile.goal && (
                    <div className="px-3 py-2 bg-orange-500/5 border border-orange-500/15 rounded-xl">
                      <p className="text-[9px] text-orange-500/60 uppercase font-black tracking-widest">Obiectiv</p>
                      <p className="text-xs font-black text-orange-400 mt-0.5">{profile.goal}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Targets Card */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 hover:border-zinc-700 transition-all notch">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase">// ȚINTE ZILNICE</p>
                {profileOk && (
                  <button onClick={() => setTargets(calcTargets(profile))}
                    className="text-[9px] font-black text-orange-500/60 hover:text-orange-500 uppercase tracking-widest transition-colors">
                    ↺ AUTO
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Calorii', key: 'calories', unit: 'kcal', color: '#f97316' },
                  { label: 'Proteine', key: 'protein', unit: 'g', color: '#22c55e' },
                  { label: 'Carbohidrați', key: 'carbs', unit: 'g', color: '#60a5fa' },
                  { label: 'Grăsimi', key: 'fat', unit: 'g', color: '#a78bfa' },
                ].map(f => (
                  <div key={f.key} className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: f.color }}>{f.label}</span>
                    <div className="flex items-center gap-1">
                      <input type="number" min="0"
                        value={(targets as any)[f.key] || ''}
                        onChange={e => {
                          const v = parseInt(e.target.value) || 0;
                          if (f.key === 'calories') setCalorieTarget(v);
                          else setMacroTarget(f.key as 'protein' | 'carbs' | 'fat', v);
                        }}
                        className="w-20 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-mono text-center focus:outline-none focus:border-orange-500/60 transition-all" />
                      <span className="text-[10px] text-zinc-600 font-bold">{f.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 hover:border-zinc-700 transition-all notch">
              <p className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase mb-4">// NOTE</p>
              <textarea value={data.notes} onChange={e => update({ notes: e.target.value })}
                placeholder="Cum te-ai simțit azi, ce ai mâncat special..."
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/60 transition-all resize-none" />
            </div>
          </div>

          {/* ══ CENTRU — Calorii + Macros ══════════════════════════════ */}
          <div className="space-y-5">

            {/* Calorie ring */}
            <div className="bg-zinc-950 border border-zinc-800 p-8 flex flex-col items-center hover:border-zinc-700 transition-all notch">
              <div className="flex items-center justify-between w-full mb-6">
                <p className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase">// CALORII AZI</p>
                <button
                  onClick={() => {
                    if (confirm('Resetezi toate valorile de azi la 0?')) {
                      update({ protein: 0, carbs: 0, fat: 0, water_glasses: 0, notes: '' });
                    }
                  }}
                  className="text-[9px] font-black text-zinc-600 hover:text-red-400 uppercase tracking-widest transition-colors border border-zinc-800 hover:border-red-500/30 px-2.5 py-1.5 rounded-lg">
                  ↺ RESETEAZĂ ZIUA
                </button>
              </div>
              <CalorieRing consumed={calories} target={targets.calories} />
              <div className="mt-6 grid grid-cols-3 gap-3 w-full">
                {[150, 300, 500].map(n => (
                  <button key={n} onClick={() => quickAdd(n)}
                    className="py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-black text-zinc-400 hover:border-orange-500/40 hover:text-orange-400 transition-all">
                    +{n} kcal
                  </button>
                ))}
              </div>
            </div>

            {/* Macros */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 hover:border-zinc-700 transition-all notch">
              <p className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase mb-6">// MACRONUTRIENȚI</p>
              <div className="space-y-6">
                <MacroBar label="Proteine" value={data.protein} target={targets.protein} color="#22c55e"
                  onChange={v => update({ protein: v })} onTargetChange={v => setMacroTarget('protein', v)} />
                <MacroBar label="Carbohidrați" value={data.carbs} target={targets.carbs} color="#60a5fa"
                  onChange={v => update({ carbs: v })} onTargetChange={v => setMacroTarget('carbs', v)} />
                <MacroBar label="Grăsimi" value={data.fat} target={targets.fat} color="#a78bfa"
                  onChange={v => update({ fat: v })} onTargetChange={v => setMacroTarget('fat', v)} />
              </div>

              {/* Macro breakdown */}
              <div className="mt-6 pt-5 border-t border-zinc-800 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Proteină', kcal: data.protein * 4, color: '#22c55e' },
                  { label: 'Carbohidrați', kcal: data.carbs * 4, color: '#60a5fa' },
                  { label: 'Grăsimi', kcal: Math.round(data.fat * 9), color: '#a78bfa' },
                ].map(m => (
                  <div key={m.label} className="bg-zinc-900/50 rounded-2xl px-2 py-3">
                    <p className="text-base font-black italic" style={{ color: m.color }}>{m.kcal}</p>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold mt-0.5">{m.label}</p>
                    <p className="text-[9px] text-zinc-700 font-bold">kcal</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══ DREAPTA — Hidratare + Rezumat ══════════════════════════ */}
          <div className="space-y-5">

            {/* Water */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 hover:border-zinc-700 transition-all notch">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase">// HIDRATARE</p>
                <span className="text-sm font-black text-sky-400">{data.water_glasses} / 8 pahare</span>
              </div>
              <div className="flex justify-between gap-2 mb-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <WaterGlass key={i} filled={i < data.water_glasses}
                    onClick={() => update({ water_glasses: i < data.water_glasses ? i : i + 1 })} />
                ))}
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden mt-3">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(data.water_glasses / 8) * 100}%`, background: 'linear-gradient(to right, #0284c7, #38bdf8)' }} />
              </div>
              <p className="text-[10px] text-zinc-600 font-bold mt-2 text-center">
                {data.water_glasses >= 8 ? '✓ Obiectiv atins!' : `Mai ${8 - data.water_glasses} pahar${8 - data.water_glasses === 1 ? '' : 'e'} până la obiectiv`}
              </p>
            </div>

            {/* Weekly chart */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 hover:border-zinc-700 transition-all notch">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase">// REZUMAT SĂPTĂMÂNAL</p>
                <span className="text-[10px] text-zinc-600 font-bold">{targets.calories} kcal/zi</span>
              </div>
              <WeekChart data={weekData} today={date} target={targets.calories} />
              <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="font-display text-xl text-ember">
                    {weekData.length > 0 ? Math.round(weekData.reduce((a, d) => a + d.calories, 0) / weekData.filter(d => d.calories > 0).length || 0) : 0}
                  </p>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">medie kcal/zi</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-xl text-green-400">
                    {weekData.filter(d => d.calories >= targets.calories * 0.8 && d.calories <= targets.calories * 1.2).length}
                  </p>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">zile în țintă</p>
                </div>
              </div>
            </div>

            {/* Daily summary card */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 hover:border-zinc-700 transition-all notch">
              <p className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase mb-5">// SUMAR ZI</p>
              <div className="space-y-3">
                {[
                  { label: 'Calorii consumate', value: `${calories} / ${targets.calories} kcal`, pct: targets.calories > 0 ? calories / targets.calories : 0, color: '#f97316' },
                  { label: 'Proteină', value: `${data.protein} / ${targets.protein}g`, pct: targets.protein > 0 ? data.protein / targets.protein : 0, color: '#22c55e' },
                  { label: 'Carbohidrați', value: `${data.carbs} / ${targets.carbs}g`, pct: targets.carbs > 0 ? data.carbs / targets.carbs : 0, color: '#60a5fa' },
                  { label: 'Grăsimi', value: `${data.fat} / ${targets.fat}g`, pct: targets.fat > 0 ? data.fat / targets.fat : 0, color: '#a78bfa' },
                  { label: 'Apă', value: `${data.water_glasses} / 8 pahare`, pct: data.water_glasses / 8, color: '#38bdf8' },
                ].map(row => (
                  <div key={row.label} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: row.color }} />
                    <span className="text-[10px] text-zinc-500 font-bold flex-1">{row.label}</span>
                    <span className="text-[10px] font-black text-zinc-300">{row.value}</span>
                    <span className="text-[10px] font-black w-8 text-right" style={{ color: row.pct >= 1 ? '#22c55e' : row.color }}>
                      {Math.round(Math.min(row.pct * 100, 100))}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
