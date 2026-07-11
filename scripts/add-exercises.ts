// Adaugă exercițiile noi FĂRĂ să atingă cele existente (păstrează id-urile
// la care sunt legate log-urile din `workouts`).
// Rulare: node scripts/add-exercises.ts
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { NEW_EXERCISES } from './new-exercises-data.ts';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function addExercises() {
  console.log('🚀 TITAN ACADEMY: Adăugăm exerciții noi (fără a atinge cele existente)...');

  const { data: existing, error: fetchErr } = await supabase.from('exercises').select('slug');
  if (fetchErr) {
    console.error('❌ Nu am putut citi exercițiile existente:', fetchErr.message);
    process.exit(1);
  }

  const existingSlugs = new Set((existing ?? []).map(e => e.slug));
  const toInsert = NEW_EXERCISES.filter(e => !existingSlugs.has(e.slug));

  if (toInsert.length === 0) {
    console.log('✅ Toate exercițiile noi există deja. Nimic de făcut.');
    return;
  }

  const { error } = await supabase.from('exercises').insert(toInsert);
  if (error) {
    console.error('❌ Eroare la inserare:', error.message);
    process.exit(1);
  }
  console.log(`✅ Am adăugat ${toInsert.length} exerciții noi:`);
  toInsert.forEach(e => console.log(`   + ${e.name} (${e.primary_muscle})`));
}

addExercises();
