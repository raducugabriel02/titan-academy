'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toLocalDateStr as toDateStr, localDayOf } from '@/lib/dates';

const GOALS = ['Masă musculară', 'Slăbit', 'Forță', 'Rezistență', 'Menținere'];
const GOAL_ICONS: Record<string, string> = {
  'Masă musculară': '💪', 'Slăbit': '🔥', 'Forță': '🏆', 'Rezistență': '⚡', 'Menținere': '⚖️',
};

// Volum pentru o intrare logată: seturi × media repetărilor × greutate
function entryVolume(w: { sets: number; reps: string | number; weight: number }) {
  const parts = String(w.reps).split('-').map(r => parseInt(r) || 0);
  const avgReps = parts.reduce((a, b) => a + b, 0) / parts.length;
  return w.sets * avgReps * w.weight;
}

// Activity heatmap — ultimele 12 săptămâni
function ActivityHeatmap({ workouts }: { workouts: { logged_at: string }[] }) {
  const weeks = 12;
  const today = new Date();
  const days: { date: string; count: number }[] = [];

  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = toDateStr(d);
    const count = workouts.filter(w => localDayOf(w.logged_at) === dateStr).length;
    days.push({ date: dateStr, count });
  }

  function getColor(count: number) {
    if (count === 0) return '#18181b';
    if (count <= 2) return '#7c2d12';
    if (count <= 5) return '#c2410c';
    return '#f97316';
  }

  const cols: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) cols.push(days.slice(i, i + 7));

  return (
    <div>
      <div className="flex gap-1">
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-1">
            {col.map((day, di) => (
              <div
                key={di}
                title={`${day.date}: ${day.count} seturi`}
                className="w-3 h-3 rounded-[2px] transition-all hover:scale-125 cursor-default"
                style={{ background: getColor(day.count) }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[9px] text-zinc-700 uppercase tracking-widest">Mai puțin</span>
        {[0, 2, 4, 6].map(v => (
          <div key={v} className="w-2.5 h-2.5 rounded-[2px]" style={{ background: getColor(v) }} />
        ))}
        <span className="text-[9px] text-zinc-700 uppercase tracking-widest">Mai mult</span>
      </div>
    </div>
  );
}

// Radial progress ring
function RingProgress({ value, max, label, color = '#f97316', size = 80 }: {
  value: number; max: number; label: string; color?: string; size?: number;
}) {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#27272a" strokeWidth="5" />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black italic">{Math.round(pct * 100)}%</span>
        </div>
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 text-center">{label}</span>
    </div>
  );
}

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Profile
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [goal, setGoal] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [memberSince, setMemberSince] = useState('');

  // Stats
  const [workoutsRaw, setWorkoutsRaw] = useState<any[]>([]);
  const [topMuscle, setTopMuscle] = useState('');
  const [totalVolume, setTotalVolume] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      setMemberSince(new Date(user.created_at).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' }));

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) {
        setUsername(profile.username ?? '');
        setFullName(profile.full_name ?? '');
        setGoal(profile.goal ?? '');
        setWeight(profile.weight ? String(profile.weight) : '');
        setHeight(profile.height ? String(profile.height) : '');
        setAge(profile.age ? String(profile.age) : '');
        setGender(profile.gender ?? '');
        setActivityLevel(profile.activity_level ?? '');
        setAvatarUrl(profile.avatar_url ?? '');
        setAvatarPreview(profile.avatar_url ?? '');
      }

      const { data: workouts } = await supabase
        .from('workouts')
        .select('sets, reps, weight, logged_at, exercises(primary_muscle)')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });

      if (workouts) {
        setWorkoutsRaw(workouts);

        // Volum total
        setTotalVolume(workouts.reduce((acc: number, w: any) => acc + entryVolume(w), 0));

        // Top muscle
        const muscleCounts: Record<string, number> = {};
        workouts.forEach((w: any) => {
          const m = w.exercises?.primary_muscle;
          if (m) muscleCounts[m] = (muscleCounts[m] || 0) + w.sets;
        });
        const top = Object.entries(muscleCounts).sort((a, b) => b[1] - a[1])[0];
        if (top) setTopMuscle(top[0]);

        // Streak (zile consecutive cu antrenament)
        const days = [...new Set(workouts.map((w: any) => localDayOf(w.logged_at)))].sort().reverse();
        let s = 0;
        const today = toDateStr(new Date());
        let check = today;
        for (const day of days) {
          if (day === check) {
            s++;
            const d = new Date(check + 'T12:00:00');
            d.setDate(d.getDate() - 1);
            check = toDateStr(d);
          } else break;
        }
        setStreak(s);
      }

      setLoading(false);
    }
    init();
  }, []);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;
      await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      setAvatarUrl(data.publicUrl + '?t=' + Date.now());
      setMessage({ type: 'success', text: '✓ Avatar actualizat!' });
    } catch {
      setMessage({ type: 'error', text: 'Eroare la upload.' });
      setAvatarPreview(avatarUrl);
    }
    setUploading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      username: username.trim() || null,
      full_name: fullName.trim() || null,
      goal: goal || null,
      weight: weight ? parseFloat(weight) : null,
      height: height ? parseFloat(height) : null,
      age: age ? parseInt(age) : null,
      gender: gender || null,
      activity_level: activityLevel || null,
      avatar_url: avatarUrl || null,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      setMessage({ type: 'error', text: 'Eroare la salvare.' });
    } else {
      setMessage({ type: 'success', text: '✓ Profil salvat!' });
      setEditMode(false);
    }
    setSaving(false);
  }

  const bmi = weight && height ? (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1) : null;
  const bmiColor = bmi
    ? parseFloat(bmi) < 18.5 ? '#60a5fa' : parseFloat(bmi) < 25 ? '#22c55e' : parseFloat(bmi) < 30 ? '#f97316' : '#ef4444'
    : '#71717a';
  const bmiLabel = bmi
    ? parseFloat(bmi) < 18.5 ? 'Subponderal' : parseFloat(bmi) < 25 ? 'Normal' : parseFloat(bmi) < 30 ? 'Supraponderal' : 'Obezitate'
    : null;

  const displayName = fullName || username || user?.email?.split('@')[0] || 'Athlete';
  const totalSets = workoutsRaw.reduce((a: number, w: any) => a + w.sets, 0);
  const activeDays = new Set(workoutsRaw.map((w: any) => localDayOf(w.logged_at))).size;

  // Obiective lunare — doar antrenamentele din luna curentă
  const monthPrefix = toDateStr(new Date()).slice(0, 7);
  const monthWorkouts = workoutsRaw.filter((w: any) => localDayOf(w.logged_at).startsWith(monthPrefix));
  const monthSets = monthWorkouts.reduce((a: number, w: any) => a + w.sets, 0);
  const monthDays = new Set(monthWorkouts.map((w: any) => localDayOf(w.logged_at))).size;
  const monthVolume = monthWorkouts.reduce((a: number, w: any) => a + entryVolume(w), 0);
  const monthName = new Date().toLocaleDateString('ro-RO', { month: 'long' });

  if (loading) return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-void text-white">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-6">

        {/* Hero card */}
        <div className="bg-zinc-950 border border-zinc-800 overflow-hidden rise">
          {/* Bandă hazard sus */}
          <div className="h-[3px] stripes" />

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black italic text-zinc-500">{displayName[0]?.toUpperCase()}</span>
                  )}
                </div>
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="absolute -bottom-2 -right-2 w-7 h-7 bg-orange-500 hover:bg-orange-400 rounded-xl flex items-center justify-center transition-all shadow-lg">
                  {uploading
                    ? <div className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />
                    : <span className="text-black text-xs font-black">✎</span>}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-display italic uppercase text-2xl md:text-3xl tracking-wide">{displayName.toUpperCase()}</h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mt-0.5">@{username || 'athlete'} · {user?.email}</p>
                    <p className="text-zinc-700 text-[10px] uppercase tracking-widest mt-1">Membru din {memberSince}</p>
                  </div>
                  <button onClick={() => setEditMode(v => !v)}
                    className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shrink-0 ${
                      editMode ? 'bg-zinc-800 text-zinc-400' : 'bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20'
                    }`}>
                    {editMode ? 'ANULEAZĂ' : '✎ EDITEAZĂ'}
                  </button>
                </div>

                {goal && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-[11px] font-black text-orange-400 uppercase tracking-widest">
                      {GOAL_ICONS[goal]} {goal}
                    </span>
                    {weight && height && bmi && (
                      <span className="px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest border"
                        style={{ background: bmiColor + '15', borderColor: bmiColor + '30', color: bmiColor }}>
                        IMC {bmi} · {bmiLabel}
                      </span>
                    )}
                    {streak > 0 && (
                      <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-[11px] font-black text-yellow-400 uppercase tracking-widest">
                        🔥 {streak} zile streak
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit form */}
        {editMode && (
          <form onSubmit={handleSave} className="bg-zinc-950 border border-zinc-800 p-6 notch space-y-5">
            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">EDITEAZĂ PROFILUL</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black tracking-widest text-zinc-600 uppercase block mb-2">Nume complet</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Alexandru Popescu"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest text-zinc-600 uppercase block mb-2">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm font-bold">@</span>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} placeholder="titan_athlete"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-all font-mono" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black tracking-widest text-zinc-600 uppercase block mb-3">Obiectiv</label>
              <div className="flex flex-wrap gap-2">
                {GOALS.map(g => (
                  <button key={g} type="button" onClick={() => setGoal(g)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      goal === g ? 'bg-orange-500/15 border border-orange-500/40 text-orange-400' : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white'
                    }`}>
                    {GOAL_ICONS[g]} {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-black tracking-widest text-zinc-600 uppercase block mb-2">Greutate</label>
                <div className="relative">
                  <input type="number" min="30" max="300" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="75"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-all font-mono" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 text-xs font-black">kg</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest text-zinc-600 uppercase block mb-2">Înălțime</label>
                <div className="relative">
                  <input type="number" min="100" max="250" value={height} onChange={e => setHeight(e.target.value)} placeholder="175"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-all font-mono" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 text-xs font-black">cm</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest text-zinc-600 uppercase block mb-2">Vârstă</label>
                <div className="relative">
                  <input type="number" min="10" max="100" value={age} onChange={e => setAge(e.target.value)} placeholder="25"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-all font-mono" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 text-xs font-black">ani</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest text-zinc-600 uppercase block mb-2">Sex</label>
                <div className="flex gap-2 h-[46px]">
                  {[{ val: 'm', label: '♂ Bărbat' }, { val: 'f', label: '♀ Femeie' }].map(g => (
                    <button key={g.val} type="button" onClick={() => setGender(g.val)}
                      className={`flex-1 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${gender === g.val ? 'bg-orange-500/15 border-orange-500/40 text-orange-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'}`}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black tracking-widest text-zinc-600 uppercase block mb-3">Nivel activitate fizică</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { val: 'sedentary', label: 'Sedentar', sub: 'birou, fără sport' },
                  { val: 'light', label: 'Ușor activ', sub: '1-3 zile/săpt' },
                  { val: 'moderate', label: 'Moderat activ', sub: '3-5 zile/săpt' },
                  { val: 'active', label: 'Activ', sub: '6-7 zile/săpt' },
                  { val: 'very_active', label: 'Foarte activ', sub: 'sport + muncă fizică' },
                ].map(a => (
                  <button key={a.val} type="button" onClick={() => setActivityLevel(a.val)}
                    className={`px-3 py-2.5 rounded-xl text-left transition-all border ${activityLevel === a.val ? 'bg-orange-500/15 border-orange-500/40' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                    <p className={`text-xs font-black uppercase tracking-wider ${activityLevel === a.val ? 'text-orange-400' : 'text-zinc-400'}`}>{a.label}</p>
                    <p className="text-[9px] text-zinc-600 mt-0.5">{a.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {message && (
              <div className={`px-4 py-3 rounded-xl text-xs font-bold border ${
                message.type === 'error' ? 'bg-red-500/5 border-red-500/20 text-red-400' : 'bg-green-500/5 border-green-500/20 text-green-400'
              }`}>{message.text}</div>
            )}

            <button type="submit" disabled={saving}
              className="w-full py-4 bg-ember text-black font-black italic uppercase tracking-tight hover:bg-orange-400 active:scale-[0.98] transition-all disabled:opacity-40 chamfer">
              {saving ? 'SE SALVEAZĂ...' : 'SALVEAZĂ →'}
            </button>
          </form>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Seturi totale', value: totalSets, suffix: '', color: '#f97316' },
            { label: 'Zile active', value: activeDays, suffix: '', color: '#22c55e' },
            { label: 'Volum total', value: Math.round(totalVolume).toLocaleString('ro-RO'), suffix: ' kg', color: '#60a5fa' },
            { label: 'Streak curent', value: streak, suffix: ' zile', color: '#eab308' },
          ].map(s => (
            <div key={s.label} className="bg-zinc-950 border border-zinc-800 p-5 relative overflow-hidden group hover:border-zinc-700 transition-all">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `radial-gradient(circle at 50% 0%, ${s.color}08, transparent 70%)` }} />
              <p className="font-display text-3xl leading-none" style={{ color: s.color }}>
                {s.value}{s.suffix}
              </p>
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-2">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Radial progress + top muscle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Rings */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 notch">
            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 mb-6">OBIECTIVE LUNARE — {monthName}</h3>
            <div className="flex justify-around">
              <RingProgress value={monthSets} max={100} label="Seturi / 100" color="#f97316" />
              <RingProgress value={monthDays} max={20} label="Zile / 20" color="#22c55e" />
              <RingProgress value={monthVolume} max={50000} label="Volum / 50.000 kg" color="#60a5fa" />
            </div>
          </div>

          {/* Top muscle */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 notch">
            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 mb-6">GRUPE MUSCULARE</h3>
            {workoutsRaw.length === 0 ? (
              <p className="text-zinc-600 text-xs text-center py-4">Niciun antrenament logat încă.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(
                  workoutsRaw.reduce((acc: Record<string, number>, w: any) => {
                    const m = w.exercises?.primary_muscle;
                    if (m) acc[m] = (acc[m] || 0) + w.sets;
                    return acc;
                  }, {})
                ).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([muscle, count]) => {
                  const maxCount = workoutsRaw.reduce((max: number, w: any) => {
                    const m = w.exercises?.primary_muscle;
                    return m === muscle ? Math.max(max, w.sets) : max;
                  }, 1);
                  const total = workoutsRaw.filter((w: any) => w.exercises?.primary_muscle === muscle)
                    .reduce((a: number, w: any) => a + w.sets, 0);
                  const pct = Math.min((total / (totalSets || 1)) * 100, 100);
                  return (
                    <div key={muscle}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-300">{muscle}</span>
                        <span className="text-xs font-black text-zinc-500">{total} seturi</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Activity heatmap */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 notch">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">ACTIVITATE — ULTIMELE 12 SĂPTĂMÂNI</h3>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{activeDays} zile active</span>
          </div>
          <ActivityHeatmap workouts={workoutsRaw} />
        </div>

      </div>
    </div>
  );
}