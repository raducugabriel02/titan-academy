// Sesiunea activă de antrenament (pornită dintr-un plan) — persistată în
// localStorage ca să supraviețuiască refresh-ului sau închiderii telefonului
// între seturi. O singură sesiune poate fi activă la un moment dat.

import type { WorkoutPlan } from './plans';

export interface SessionItem {
  name: string;
  muscle: string;
  sets: number;
  reps: string;
  rest: string;
  done: boolean;
}

export interface WorkoutSession {
  planId: string;
  planName: string;
  startedAt: string; // ISO
  items: SessionItem[];
  // Acumulate pe parcursul sesiunii, la fiecare salvare de seturi
  totalSets: number;
  volume: number;
  prs: number;
}

const KEY = 'titan_session';

export function loadSession(): WorkoutSession | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const s = JSON.parse(raw);
    if (s && typeof s === 'object' && Array.isArray(s.items)) return s as WorkoutSession;
  } catch { /* date corupte — sesiunea se pierde */ }
  return null;
}

export function saveSession(s: WorkoutSession) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export function startSession(plan: WorkoutPlan): WorkoutSession {
  const s: WorkoutSession = {
    planId: plan.id,
    planName: plan.name,
    startedAt: new Date().toISOString(),
    items: plan.exercises.map(e => ({
      name: e.name, muscle: e.muscle, sets: e.sets, reps: e.reps, rest: e.rest, done: false,
    })),
    totalSets: 0,
    volume: 0,
    prs: 0,
  };
  saveSession(s);
  return s;
}
