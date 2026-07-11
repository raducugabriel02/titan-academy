// Planul activ de antrenament — persistat în localStorage ca JSON {id, name}.
// Ambele pagini (workouts, dashboard) trec prin helper-ele astea; formatul vechi
// (doar id-ul ca string simplu) e încă citit corect pentru datele existente.

export interface ActivePlan {
  id: string;
  name?: string;
}

const KEY = 'titan_active_plan';

export function loadActivePlan(): ActivePlan | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && typeof parsed.id === 'string') return parsed;
  } catch {
    // format vechi: doar id-ul, nesalvat ca JSON
  }
  return { id: raw };
}

export function saveActivePlan(plan: ActivePlan) {
  localStorage.setItem(KEY, JSON.stringify(plan));
}

export function clearActivePlan() {
  localStorage.removeItem(KEY);
}
