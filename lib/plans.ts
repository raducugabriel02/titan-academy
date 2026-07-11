// Planurile de antrenament — folosite de pagina de planuri (/workouts) și de
// modul „sesiune activă" din tracker (/workout?plan=<id>).

export interface PlanExercise {
  name: string; muscle: string; sets: number; reps: string; rest: string; notes?: string;
}
export interface WorkoutPlan {
  id: string; name: string; subtitle: string;
  category: 'PPL' | 'Full Body' | 'Forță' | 'Izolat';
  difficulty: number; durationMin: number; description: string;
  exercises: PlanExercise[]; image: string;
}

export const PLANS: WorkoutPlan[] = [
  {
    id: 'push-hypertrophy', name: 'Push Day', subtitle: 'Piept · Umeri · Triceps',
    category: 'PPL', difficulty: 3, durationMin: 70,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
    description: 'Antrenamentul complet de împingere pentru hipertrofie maximă. Combină pressingul greu (bench, OHP) cu izolarea pentru un volum optim.',
    exercises: [
      { name: 'Barbell Bench Press',      muscle: 'Chest',     sets: 4, reps: '6-8',   rest: '3 min', notes: 'Exercițiu principal — greutate progresivă' },
      { name: 'Overhead Press',           muscle: 'Shoulders', sets: 3, reps: '8-10',  rest: '2 min' },
      { name: 'Incline Dumbbell Press',   muscle: 'Chest',     sets: 3, reps: '10-12', rest: '90s',   notes: 'Banca la 30-45°' },
      { name: 'Dumbbell Lateral Raise',   muscle: 'Shoulders', sets: 4, reps: '12-15', rest: '60s',   notes: 'Strict, fără elan' },
      { name: 'Tricep Pushdown (Rope)',   muscle: 'Triceps',   sets: 3, reps: '12-15', rest: '60s' },
      { name: 'Overhead Cable Extension', muscle: 'Triceps',   sets: 3, reps: '12-15', rest: '60s',   notes: 'Stretch maxim la fiecare rep' },
    ],
  },
  {
    id: 'pull-hypertrophy', name: 'Pull Day', subtitle: 'Spate · Biceps',
    category: 'PPL', difficulty: 4, durationMin: 75,
    image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=600&auto=format&fit=crop&q=80',
    description: 'Antrenamentul de tragere pentru lățime și grosime de spate. Deadlift-ul ca fundație, tracțiuni pentru V-taper, rowing pentru masă.',
    exercises: [
      { name: 'Deadlift (Conventional)',  muscle: 'Back',    sets: 4, reps: '4-6',   rest: '4 min', notes: 'Warmup obligatoriu — 50%, 70%, 85%' },
      { name: 'Pull-Ups',                 muscle: 'Back',    sets: 4, reps: '8-10',  rest: '2 min' },
      { name: 'Bent Over Barbell Row',    muscle: 'Back',    sets: 3, reps: '8-10',  rest: '2 min' },
      { name: 'Seated Cable Row',         muscle: 'Back',    sets: 3, reps: '12',    rest: '90s' },
      { name: 'Barbell Curl',             muscle: 'Biceps',  sets: 3, reps: '10-12', rest: '90s' },
      { name: 'Dumbbell Hammer Curl',     muscle: 'Biceps',  sets: 3, reps: '12-15', rest: '60s' },
    ],
  },
  {
    id: 'leg-day-complete', name: 'Leg Day', subtitle: 'Cvadriceps · Femuralii · Fese · Gambe',
    category: 'PPL', difficulty: 5, durationMin: 90,
    image: 'https://images.unsplash.com/photo-1770664612843-b44e26070024?w=600&auto=format&fit=crop&q=80',
    description: 'Cel mai greu antrenament al săptămânii. Squatul ca fundație, urmat de volume ridicat pentru toate componentele piciorului.',
    exercises: [
      { name: 'Barbell Back Squat', muscle: 'Legs',   sets: 4, reps: '6-8',   rest: '4 min', notes: 'Exercițiul rege — tot timpul și atenția' },
      { name: 'Romanian Deadlift',  muscle: 'Legs',   sets: 3, reps: '10-12', rest: '2 min' },
      { name: 'Hack Squat',         muscle: 'Legs',   sets: 3, reps: '10-12', rest: '2 min' },
      { name: 'Leg Press',          muscle: 'Legs',   sets: 3, reps: '12-15', rest: '90s' },
      { name: 'Leg Extension',      muscle: 'Legs',   sets: 3, reps: '15-20', rest: '60s',   notes: 'Drop set la ultimul set' },
      { name: 'Lying Leg Curl',     muscle: 'Legs',   sets: 3, reps: '12-15', rest: '60s' },
      { name: 'Standing Calf Raise',muscle: 'Calves', sets: 4, reps: '20-25', rest: '60s',   notes: 'Stretch complet la fiecare rep' },
    ],
  },
  {
    id: 'full-body-a', name: 'Full Body A', subtitle: 'Antrenament Complet · Sesiunea 1',
    category: 'Full Body', difficulty: 4, durationMin: 75,
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&auto=format&fit=crop&q=80',
    description: 'Prima sesiune din split-ul full body. Mișcări compuse majore (squat, bench, row) care solicită tot corpul eficient.',
    exercises: [
      { name: 'Barbell Back Squat',    muscle: 'Legs',      sets: 4, reps: '6-8',  rest: '3 min' },
      { name: 'Barbell Bench Press',   muscle: 'Chest',     sets: 4, reps: '6-8',  rest: '3 min' },
      { name: 'Bent Over Barbell Row', muscle: 'Back',      sets: 4, reps: '8-10', rest: '2 min' },
      { name: 'Overhead Press',        muscle: 'Shoulders', sets: 3, reps: '10',   rest: '2 min' },
      { name: 'Romanian Deadlift',     muscle: 'Legs',      sets: 3, reps: '10-12',rest: '90s' },
      { name: 'Barbell Curl',          muscle: 'Biceps',    sets: 3, reps: '12',   rest: '60s' },
    ],
  },
  {
    id: 'full-body-b', name: 'Full Body B', subtitle: 'Antrenament Complet · Sesiunea 2',
    category: 'Full Body', difficulty: 4, durationMin: 75,
    image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=600&auto=format&fit=crop&q=80',
    description: 'Al doilea antrenament full body. Deadlift și tracțiuni ca mișcări principale pentru spate și picioare.',
    exercises: [
      { name: 'Deadlift (Conventional)',  muscle: 'Back',      sets: 4, reps: '4-5',  rest: '4 min', notes: 'Greutate maximă cu formă perfectă' },
      { name: 'Pull-Ups',                 muscle: 'Back',      sets: 4, reps: '8-10', rest: '2 min' },
      { name: 'Bulgarian Split Squat',    muscle: 'Legs',      sets: 3, reps: '10',   rest: '2 min', notes: 'Per picior, cu gantere' },
      { name: 'Incline Dumbbell Press',   muscle: 'Chest',     sets: 3, reps: '10-12',rest: '2 min' },
      { name: 'Face Pulls',               muscle: 'Shoulders', sets: 3, reps: '15',   rest: '60s',   notes: 'Sănătatea umărului — nu sări!' },
      { name: 'Skull Crushers',           muscle: 'Triceps',   sets: 3, reps: '10-12',rest: '90s' },
    ],
  },
  {
    id: 'upper-strength', name: 'Upper Body — Forță', subtitle: 'Piept · Spate · Umeri · Brațe',
    category: 'Forță', difficulty: 4, durationMin: 70,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
    description: 'Sesiune de forță pentru treimea superioară. Greutăți mari, repetări puține, pauze lungi. 5×5 pe mișcările principale.',
    exercises: [
      { name: 'Barbell Bench Press',   muscle: 'Chest',     sets: 5, reps: '5',   rest: '4 min', notes: '5×5 — greutate progresivă săptămânal' },
      { name: 'Bent Over Barbell Row', muscle: 'Back',      sets: 5, reps: '5',   rest: '4 min', notes: 'Greutate maximă cu formă corectă' },
      { name: 'Overhead Press',        muscle: 'Shoulders', sets: 4, reps: '5',   rest: '3 min' },
      { name: 'Pull-Ups',              muscle: 'Back',      sets: 4, reps: '6-8', rest: '2 min', notes: 'Adaugă greutate cu centură dacă poți' },
      { name: 'Skull Crushers',        muscle: 'Triceps',   sets: 3, reps: '8',   rest: '2 min' },
      { name: 'Barbell Curl',          muscle: 'Biceps',    sets: 3, reps: '8',   rest: '90s' },
    ],
  },
  {
    id: 'lower-strength', name: 'Lower Body — Forță', subtitle: 'Cvadriceps · Femuralii · Fese',
    category: 'Forță', difficulty: 5, durationMin: 75,
    image: 'https://images.unsplash.com/photo-1758875568582-ec8a4229c2b0?w=600&auto=format&fit=crop&q=80',
    description: 'Sesiune de forță pentru treimea inferioară. Squat și deadlift la greutăți maxime. Cel mai solicitant antrenament din program.',
    exercises: [
      { name: 'Barbell Back Squat',       muscle: 'Legs', sets: 5, reps: '5',    rest: '5 min', notes: '5×5 — greutate maximă gestionabilă' },
      { name: 'Deadlift (Conventional)',  muscle: 'Back', sets: 3, reps: '3-4',  rest: '5 min', notes: 'Seturi grele post-squat' },
      { name: 'Leg Press',                muscle: 'Legs', sets: 4, reps: '8-10', rest: '2 min' },
      { name: 'Bulgarian Split Squat',    muscle: 'Legs', sets: 3, reps: '8',    rest: '2 min', notes: 'Per picior, cu gantere grele' },
      { name: 'Lying Leg Curl',           muscle: 'Legs', sets: 4, reps: '8-10', rest: '90s' },
    ],
  },
  {
    id: 'chest-focus', name: 'Chest Day', subtitle: 'Focus Total pe Piept',
    category: 'Izolat', difficulty: 3, durationMin: 55,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
    description: 'Antrenament dedicat exclusiv pieptului. Toate unghiurile: plat, inclinat, declinat. Volum mare pentru masă maximă.',
    exercises: [
      { name: 'Barbell Bench Press',       muscle: 'Chest', sets: 4, reps: '8-10', rest: '3 min', notes: 'Exercițiu principal de forță' },
      { name: 'Incline Dumbbell Press',    muscle: 'Chest', sets: 4, reps: '10-12',rest: '2 min', notes: 'Banca la 30-45°' },
      { name: 'Chest Dips',                muscle: 'Chest', sets: 3, reps: '12-15',rest: '90s',   notes: 'Înclină trunchiul în față' },
      { name: 'Cable Flyes (High-to-Low)', muscle: 'Chest', sets: 3, reps: '15',   rest: '60s' },
      { name: 'Pec Deck Machine',          muscle: 'Chest', sets: 3, reps: '15-20',rest: '60s',   notes: 'Drop set la ultimul set' },
    ],
  },
  {
    id: 'back-width', name: 'Back Day — Lățime', subtitle: 'Latissimus Dorsi · V-Taper',
    category: 'Izolat', difficulty: 4, durationMin: 60,
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80',
    description: 'Antrenament orientat pe lățimea spatelui pentru un V-taper impresionant. Tracțiuni și pulldown-uri ca focus principal.',
    exercises: [
      { name: 'Deadlift (Conventional)',   muscle: 'Back', sets: 3, reps: '5',    rest: '4 min', notes: 'Activare și forță generală de spate' },
      { name: 'Pull-Ups',                  muscle: 'Back', sets: 4, reps: '8-10', rest: '2 min' },
      { name: 'Lat Pulldown (Wide Grip)',  muscle: 'Back', sets: 4, reps: '10-12',rest: '90s' },
      { name: 'Straight Arm Pulldown',     muscle: 'Back', sets: 3, reps: '12-15',rest: '60s',   notes: 'Izolare latissimus — simte fiecare rep' },
      { name: 'Seated Cable Row',          muscle: 'Back', sets: 3, reps: '12',   rest: '90s' },
    ],
  },
  {
    id: 'shoulder-sculptor', name: 'Shoulder Day', subtitle: 'Deltoid Complet · Lățime · Sănătate',
    category: 'Izolat', difficulty: 3, durationMin: 55,
    image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=600&auto=format&fit=crop&q=80',
    description: 'Antrenament complet pentru umeri — toate cele 3 capete ale deltoidului plus exerciții esențiale pentru sănătatea rotatorilor.',
    exercises: [
      { name: 'Overhead Press',        muscle: 'Shoulders', sets: 4, reps: '8-10', rest: '3 min', notes: 'Exercițiu principal de forță' },
      { name: 'Dumbbell Lateral Raise',muscle: 'Shoulders', sets: 4, reps: '12-15',rest: '60s',   notes: 'Strict, fără elan — reduce greutatea!' },
      { name: 'Arnold Press',          muscle: 'Shoulders', sets: 3, reps: '10-12',rest: '90s' },
      { name: 'Face Pulls',            muscle: 'Shoulders', sets: 4, reps: '15-20',rest: '60s',   notes: 'Sănătatea umărului — obligatoriu!' },
      { name: 'Front Raise',           muscle: 'Shoulders', sets: 3, reps: '12',   rest: '60s' },
    ],
  },
  {
    id: 'arm-day', name: 'Arm Day', subtitle: 'Biceps · Triceps',
    category: 'Izolat', difficulty: 2, durationMin: 55,
    image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=600&auto=format&fit=crop&q=80',
    description: 'Zi dedicată brațelor. Volum mare, pompare maximă. Alternează exercițiile de biceps și triceps pentru pompare optimă.',
    exercises: [
      { name: 'Skull Crushers',           muscle: 'Triceps', sets: 4, reps: '10-12',rest: '2 min', notes: 'Exercițiu principal triceps' },
      { name: 'Barbell Curl',             muscle: 'Biceps',  sets: 4, reps: '10-12',rest: '90s',   notes: 'Exercițiu principal biceps' },
      { name: 'Overhead Cable Extension', muscle: 'Triceps', sets: 3, reps: '12-15',rest: '60s',   notes: 'Stretch maxim — capul lung' },
      { name: 'Preacher Curl',            muscle: 'Biceps',  sets: 3, reps: '10-12',rest: '90s',   notes: 'Fără trișat posibil' },
      { name: 'Tricep Pushdown (Rope)',   muscle: 'Triceps', sets: 3, reps: '15',   rest: '60s' },
      { name: 'Dumbbell Hammer Curl',     muscle: 'Biceps',  sets: 3, reps: '12',   rest: '60s' },
      { name: 'Concentration Curl',       muscle: 'Biceps',  sets: 2, reps: '12-15',rest: '60s',   notes: 'Finalizator — squeeze maxim' },
    ],
  },
  {
    id: 'quad-focus', name: 'Quad Focus', subtitle: 'Cvadriceps · Explozie · Volum',
    category: 'Izolat', difficulty: 4, durationMin: 60,
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
    description: 'Antrenament specializat pentru cvadriceps. Hack squat și leg press pentru izolarea cvadricepsului fără stresul squat-ului liber.',
    exercises: [
      { name: 'Barbell Back Squat',    muscle: 'Legs',   sets: 4, reps: '8-10', rest: '3 min' },
      { name: 'Hack Squat',            muscle: 'Legs',   sets: 4, reps: '10-12',rest: '2 min', notes: 'Picioarele jos pe platformă' },
      { name: 'Leg Press',             muscle: 'Legs',   sets: 4, reps: '12-15',rest: '2 min', notes: 'Picioarele jos pe platformă' },
      { name: 'Bulgarian Split Squat', muscle: 'Legs',   sets: 3, reps: '12',   rest: '90s',   notes: 'Per picior' },
      { name: 'Leg Extension',         muscle: 'Legs',   sets: 3, reps: '15-20',rest: '60s',   notes: 'Drop set la ultimul set' },
      { name: 'Seated Calf Raise',     muscle: 'Calves', sets: 4, reps: '20-25',rest: '60s' },
    ],
  },
  {
    id: 'core-day', name: 'Core Day', subtitle: 'Abdomen · Stabilitate · Rezistență',
    category: 'Izolat', difficulty: 3, durationMin: 35,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80',
    description: 'Antrenament dedicat core-ului cu rezistență progresivă pentru hipertrofie reală, nu doar burnout fără rezultate.',
    exercises: [
      { name: 'Hanging Leg Raise', muscle: 'Core', sets: 4, reps: '10-15',rest: '90s', notes: 'Fără balans — control total' },
      { name: 'Cable Crunch',      muscle: 'Core', sets: 4, reps: '15-20',rest: '60s', notes: 'Rezistență progresivă — mărește greutatea' },
      { name: 'Plank',             muscle: 'Core', sets: 4, reps: '60s',  rest: '60s', notes: 'Corp perfect drept, nu ține respirația' },
    ],
  },
];
