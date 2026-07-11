// Imagine confirmată că există — folosită în login page
export const BASE_GYM_IMAGE =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&auto=format&fit=crop&q=80';

// Overlay colorat per grupă — aplicat peste imaginea de bază
export const MUSCLE_OVERLAY: Record<string, string> = {
  Chest:     'bg-orange-500/50',
  Back:      'bg-sky-500/50',
  Legs:      'bg-green-500/50',
  Shoulders: 'bg-purple-500/50',
  Biceps:    'bg-yellow-500/50',
  Triceps:   'bg-pink-500/50',
  Core:      'bg-cyan-500/50',
  Calves:    'bg-emerald-500/50',
};

export const MUSCLE_COLOR: Record<string, string> = {
  Chest:     'text-orange-400',
  Back:      'text-sky-400',
  Legs:      'text-green-400',
  Shoulders: 'text-purple-400',
  Biceps:    'text-yellow-400',
  Triceps:   'text-pink-400',
  Core:      'text-cyan-400',
  Calves:    'text-emerald-400',
};

export const MUSCLE_BORDER: Record<string, string> = {
  Chest:     'hover:border-orange-500/50',
  Back:      'hover:border-sky-500/50',
  Legs:      'hover:border-green-500/50',
  Shoulders: 'hover:border-purple-500/50',
  Biceps:    'hover:border-yellow-500/50',
  Triceps:   'hover:border-pink-500/50',
  Core:      'hover:border-cyan-500/50',
  Calves:    'hover:border-emerald-500/50',
};

// Toate ID-urile sunt verificate prin YouTube oEmbed: există și permit embedding.
export const EXERCISE_VIDEO: Record<string, string> = {
  // CHEST
  'bench-press':           'SCVCLChPQFY',
  'db-bench-press':        '1V3vpcaxRYQ',
  'incline-db-press':      '8fXfwG4ftaQ',
  'chest-dips':            'yN6Q1UI_xkE',
  'pec-deck':              'Z57CtFmRMxA',
  'push-ups':              'IODxDxX7oi4',
  'high-to-low-cables':    'taI4XduLpTk',
  // BACK
  'deadlift':              'op9kVnSso6Q',
  'pull-ups':              'eGo4IYlbE5g',
  'lat-pulldown':          'CAwf7n6Luuc',
  'bb-row':                'G8l_8chR5BE',
  'seated-row':            'GZbfZ033f74',
  't-bar-row':             'TyLoy3n_a10',
  'straight-arm-pulldown': 'hAMcfubonDc',
  'one-arm-db-row':        'gfUg6qWohTk',
  'bb-shrugs':             'MlqHEfydPpE',
  // LEGS
  'squat':                 'ultWZbUMPL8',
  'front-squat':           'nmUof3vszxM',
  'rdl':                   'JCXUYuzwNrM',
  'leg-press':             'IZxyjW7MPJQ',
  'bulgarian':             'uODWo4YqbT8',
  'walking-lunges':        '1cS-6KsJW9g',
  'hip-thrust':            'W86oVlnLqY4',
  'leg-ext':               'YyvSfVjQeL0',
  'leg-curl':              '1Tq3QdYUuHs',
  'hack-squat':            '0tn5K9NlCfo',
  // SHOULDERS
  'ohp':                   'CnBmiBqp-AI',
  'lat-raise':             '3VcKaXpzqRo',
  'face-pulls':            'rep-qVOkqgk',
  'arnold-press':          '6Z15_WdXmVw',
  'front-raise':           '-t7fuZ0KhDA',
  'reverse-pec-deck':      '-TKqxK7-ehc',
  'seated-db-press':       'E9ShwbwZ1zw',
  // BICEPS
  'bb-curl':               'kwG2ipFRgfo',
  'hammer-curl':           'TwD-YGVP4Bk',
  'preacher-curl':         'fIWP-FRFNU0',
  'concentration-curl':    'Jvj2wV0vOYU',
  'incline-db-curl':       'uCUaRFlA9vE',
  // TRICEPS
  'close-grip-bench':      'xXd7sddHGa0',
  'skull-crushers':        'd_KZxkY_0cM',
  'tricep-pushdown':       '2-LAMcpzODU',
  'bench-dips':            '6kALZikXxLc',
  'overhead-tricep-ext':   '_gsUck-7M74',
  // CORE
  'plank':                 'ASdvN_XEl_c',
  'hanging-leg-raise':     'hdng3Nm1x_E',
  'cable-crunch':          'dkGwcfo9zto',
  'ab-wheel':              'MinlHnG7j4k',
  'russian-twist':         'wkD8rjkodUI',
  // CALVES
  'standing-calf':         'baEXLy09Ncc',
  'seated-calf':           'JbyjNymZOt0',
};

// Poze demo self-hosted în public/exercises/<slug>.jpg — fotografii reale de
// execuție din free-exercise-db (github.com/yuhonas/free-exercise-db, domeniu
// public). Fiind same-origin, sunt cache-uite de service worker → merg offline.
// Acoperă exact slug-urile din EXERCISE_VIDEO — dacă adaugi un video nou,
// descarcă și poza corespunzătoare în public/exercises/.
const EXERCISE_IMAGE_SLUGS = new Set(Object.keys(EXERCISE_VIDEO));

export function exerciseImage(slug: string): string | null {
  return EXERCISE_IMAGE_SLUGS.has(slug) ? `/exercises/${slug}.jpg` : null;
}

// Fallback pentru exerciții fără poză locală: thumbnail-ul video-ului YouTube
// (i.ytimg.com e imagine statică, nu embed). 'mq' 320×180 (16:9, fără bare
// negre — bun pentru thumb-uri mici), 'hq' 480×360 (garantat există),
// 'maxres' 1280×720 (doar la video HD — cere fallback onError către 'hq').
export function exerciseThumb(
  slug: string,
  quality: 'mq' | 'hq' | 'maxres' = 'hq',
  youtubeId?: string | null
): string | null {
  const id = EXERCISE_VIDEO[slug] ?? youtubeId ?? null;
  if (!id) return null;
  const file = quality === 'maxres' ? 'maxresdefault' : quality === 'hq' ? 'hqdefault' : 'mqdefault';
  return `https://i.ytimg.com/vi/${id}/${file}.jpg`;
}

export function getYouTubeSearch(exerciseName: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    exerciseName + ' tutorial form technique'
  )}`;
}
