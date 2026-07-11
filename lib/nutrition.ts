// Calcul TDEE (Mifflin-St Jeor) și ținte de calorii/macro — folosit atât în
// pagina de nutriție cât și în dashboard, ca ținta afișată să fie aceeași.

export interface Profile {
  weight: number | null;
  height: number | null;
  age: number | null;
  gender: string | null;
  activity_level: string | null;
  goal: string | null;
}

export interface Targets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const ACTIVITY: Record<string, { label: string; mult: number }> = {
  sedentary:  { label: 'Sedentar',       mult: 1.2   },
  light:      { label: 'Ușor activ',     mult: 1.375 },
  moderate:   { label: 'Moderat activ',  mult: 1.55  },
  active:     { label: 'Foarte activ',   mult: 1.725 },
  very_active:{ label: 'Extrem activ',   mult: 1.9   },
};

export function calcTDEE(p: Profile): { bmr: number; tdee: number } | null {
  if (!p.weight || !p.height || !p.age || !p.gender || !p.activity_level) return null;
  const bmr = p.gender === 'm'
    ? 10 * p.weight + 6.25 * p.height - 5 * p.age + 5
    : 10 * p.weight + 6.25 * p.height - 5 * p.age - 161;
  const mult = ACTIVITY[p.activity_level]?.mult ?? 1.55;
  return { bmr: Math.round(bmr), tdee: Math.round(bmr * mult) };
}

export function calcTargets(p: Profile): Targets {
  const base = calcTDEE(p);
  const w = p.weight ?? 75;
  let calories = base?.tdee ?? 2000;
  if (p.goal === 'Masă musculară' || p.goal === 'Forță') calories += 300;
  else if (p.goal === 'Slăbit') calories -= 400;
  const protein = Math.round(p.goal === 'Slăbit' ? w * 2.2 : w * 2);
  const fat     = Math.round(w * (p.goal === 'Slăbit' ? 0.8 : 1));
  const carbs   = Math.max(50, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { calories, protein, carbs, fat };
}

// Țintele editate manual (pagina de nutriție) — au prioritate față de calcul.
export function targetsKey(userId: string) {
  return `titan-targets-${userId}`;
}

export function loadSavedTargets(userId: string): Targets | null {
  const raw = localStorage.getItem(targetsKey(userId));
  if (!raw) return null;
  try { return JSON.parse(raw) as Targets; } catch { return null; }
}
