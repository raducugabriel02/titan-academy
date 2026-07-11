// Exercițiile adăugate peste seed-ul inițial. Importat de seed.ts (re-seed complet)
// și de add-exercises.ts (inserare incrementală, fără a atinge exercițiile existente).
export const NEW_EXERCISES = [
  // --- PIEPT (CHEST) ---
  {
    name: 'Dumbbell Bench Press',
    slug: 'db-bench-press',
    primary_muscle: 'Chest',
    equipment: 'Dumbbell',
    type: 'Compound',
    difficulty: 2,
    description: 'Varianta cu gantere a bench press-ului. Amplitudine mai mare, activare superioară a pectoralilor și corectarea dezechilibrelor stânga-dreapta.',
    instructions: [
      'Așază-te pe bancă cu ganterele sprijinite pe coapse. Culcă-te pe spate împingând ganterele cu genunchii, aducându-le la nivelul pieptului.',
      'Retrage omoplații și lipește-i de bancă. Picioarele ferm pe podea, priză neutră sau cu palmele spre înainte.',
      'Inspiră și coboară ganterele controlat (2-3 secunde) lateral față de piept, cu coatele la 45-70° față de trunchi.',
      'Coboară până simți un stretch pronunțat în pectorali — mai jos decât ai putea cu bara.',
      'Expiră și împinge ganterele exploziv în sus și ușor spre interior, fără a le ciocni în punctul de sus.'
    ],
    tips: [
      'Ganterele forțează fiecare parte să lucreze independent — excelent pentru corectarea asimetriilor de forță.',
      'Nu lăsa ganterele să devieze spre cap sau abdomen — traiectoria rămâne deasupra pieptului mijlociu.',
      'La final de set, nu arunca ganterele lateral — adu genunchii la piept și rostogolește-te controlat sau cere ajutor.'
    ]
  },
  // --- SPATE (BACK) ---
  {
    name: 'One-Arm Dumbbell Row',
    slug: 'one-arm-db-row',
    primary_muscle: 'Back',
    equipment: 'Dumbbell',
    type: 'Compound',
    difficulty: 2,
    description: 'Ramat unilateral cu sprijin pe bancă. Izolează fiecare parte a spatelui, permite greutăți mari și corectează dezechilibrele.',
    instructions: [
      'Plasează genunchiul și palma de aceeași parte pe bancă. Piciorul opus ferm pe podea, trunchiul paralel cu solul.',
      'Prinde gantera cu brațul liber, complet întins, spatele neutru — nu rotunjit, nu hiperextins.',
      'Expiră și trage gantera spre șold (nu spre umăr), conducând mișcarea din cot, aproape de corp.',
      'Contractă omoplatul spre coloană în punctul de sus și ține 1 secundă.',
      'Coboară controlat (2-3 secunde) până la extensia completă a brațului, lăsând omoplatul să se întindă natural.'
    ],
    tips: [
      'Trage spre șold, nu spre piept — traiectoria diagonală activează latissimus, nu trapezul.',
      'Nu roti trunchiul pentru a ridica gantera mai sus — rotația transferă lucrul pe lombari și pierde tensiunea din spate.',
      'Începe întotdeauna cu partea mai slabă și egalează repetările pe partea puternică.'
    ]
  },
  {
    name: 'Barbell Shrugs',
    slug: 'bb-shrugs',
    primary_muscle: 'Back',
    equipment: 'Barbell',
    type: 'Isolation',
    difficulty: 1,
    description: 'Exercițiul principal pentru trapezul superior. Simplu, dar aproape toată lumea îl face greșit — cheia este pauza în contracție.',
    instructions: [
      'Stai drept cu bara în fața coapselor, priză puțin mai lată decât umerii, brațele complet întinse.',
      'Piept sus, umerii trași ușor înapoi, genunchii foarte ușor flexați, abdomenul activat.',
      'Expiră și ridică umerii vertical spre urechi, cât de sus poți — fără a îndoi coatele.',
      'Ține contracția maximă 1-2 secunde în punctul de sus. Aici se face diferența.',
      'Coboară lent (2-3 secunde) până la stretch-ul complet al trapezului. Repetă fără elan.'
    ],
    tips: [
      'Nu roti umerii în cerc — mișcarea este strict verticală, sus și jos. Rotația nu adaugă nimic și stresează articulația.',
      'Coatele rămân întinse tot setul — dacă se îndoaie, biceps-ul fură din lucrul trapezului.',
      'Mai bine greutate moderată cu pauză sus decât greutate uriașă cu jumătăți de repetări.'
    ]
  },
  // --- PICIOARE (LEGS) ---
  {
    name: 'Walking Lunges',
    slug: 'walking-lunges',
    primary_muscle: 'Legs',
    equipment: 'Dumbbell',
    type: 'Compound',
    difficulty: 3,
    description: 'Fandări în mers cu gantere. Construiește cvadriceps, fesieri și echilibru — un exercițiu funcțional complet pentru picioare.',
    instructions: [
      'Stai drept cu câte o ganteră în fiecare mână, brațele relaxate pe lângă corp, privirea înainte.',
      'Pășește amplu în față cu un picior și coboară controlat până ambii genunchi ajung la 90°.',
      'Genunchiul din spate coboară aproape de podea fără să o atingă; genunchiul din față rămâne deasupra gleznei.',
      'Împinge prin călcâiul piciorului din față și adu piciorul din spate în față, direct în următoarea fandare.',
      'Continuă alternând picioarele, menținând trunchiul vertical și pașii stabili.'
    ],
    tips: [
      'Pas mai lung = accent pe fesieri și femurali; pas mai scurt = accent pe cvadriceps.',
      'Nu lăsa genunchiul din față să cadă spre interior — ține-l aliniat cu vârful piciorului.',
      'Dacă echilibrul e problema, începe fără greutate sau cu fandări statice înainte de varianta în mers.'
    ]
  },
  {
    name: 'Barbell Hip Thrust',
    slug: 'hip-thrust',
    primary_muscle: 'Legs',
    equipment: 'Barbell',
    type: 'Compound',
    difficulty: 2,
    description: 'Cel mai eficient exercițiu pentru fesieri, cu activare maximă demonstrată. Fundamental pentru forța de extensie a șoldului.',
    instructions: [
      'Sprijină partea superioară a spatelui (sub omoplați) pe o bancă stabilă. Bara pe șolduri, ideal cu un pad de protecție.',
      'Picioarele la lățimea umerilor, tălpile ferm pe podea, genunchii îndoiți la aproximativ 90° în poziția de sus.',
      'Bărbia în piept, privirea înainte — nu lăsa capul pe spate în timpul mișcării.',
      'Expiră și împinge șoldurile în sus prin călcâie, până trunchiul și coapsele formează o linie dreaptă.',
      'Contractă fesierii puternic sus 1-2 secunde, apoi coboară controlat fără a atinge podeaua cu greutatea.'
    ],
    tips: [
      'În punctul de sus, gambele trebuie să fie verticale — dacă genunchii trec mult peste vârfuri, mută tălpile mai în față.',
      'Nu hiperextinde lombarul sus — mișcarea se termină când șoldul e complet extins, nu când spatele se arcuiește.',
      'Fesierii răspund excelent atât la greutăți mari (6-8 repetări) cât și la seturi lungi (15-20) — variază.'
    ]
  },
  {
    name: 'Front Squat',
    slug: 'front-squat',
    primary_muscle: 'Legs',
    equipment: 'Barbell',
    type: 'Compound',
    difficulty: 4,
    description: 'Genuflexiune cu bara în față. Accent maxim pe cvadriceps și core, cu stres lombar redus față de back squat.',
    instructions: [
      'Poziționează bara pe deltoidul anterior, cu coatele ridicate sus și brațele paralele cu podeaua (priză olimpică sau încrucișată).',
      'Picioarele la lățimea umerilor, vârfurile ușor spre exterior. Piept sus, coatele sus — bara stă pe umeri, nu în mâini.',
      'Inspiră, activează core-ul și coboară controlat, ținând trunchiul cât mai vertical posibil.',
      'Coboară până coapsele trec sub paralelă, cu genunchii pe direcția vârfurilor.',
      'Împinge prin mijlocul tălpii și revino exploziv, menținând coatele sus pe tot parcursul urcării.'
    ],
    tips: [
      'Coatele sus este regula de aur — dacă ele cad, bara alunecă și trunchiul se apleacă în față.',
      'Mobilitatea încheieturilor limitează priza olimpică — folosește priza încrucișată sau chingi până se îmbunătățește.',
      'Greutatea la front squat este ~80-85% din back squat — nu compara cifrele, compară execuția.'
    ]
  },
  // --- UMERI (SHOULDERS) ---
  {
    name: 'Reverse Pec Deck',
    slug: 'reverse-pec-deck',
    primary_muscle: 'Shoulders',
    equipment: 'Machine',
    type: 'Isolation',
    difficulty: 1,
    description: 'Izolare pentru deltoidul posterior — capul umărului cel mai neglijat. Esențial pentru umeri 3D și postură echilibrată.',
    instructions: [
      'Reglează scaunul astfel încât mânerele să fie la nivelul umerilor. Așază-te cu pieptul lipit de spătar.',
      'Prinde mânerele cu brațele întinse în față, cu o îndoire foarte ușoară a coatelor menținută constant.',
      'Expiră și deschide brațele în arc spre spate, conducând mișcarea din deltoidul posterior, nu din trapez.',
      'Oprește-te când brațele ajung în linie cu umerii și ține contracția 1-2 secunde.',
      'Revino lent (3 secunde) fără a lăsa plăcile să se atingă — păstrează tensiunea continuă.'
    ],
    tips: [
      'Nu strânge omoplații complet — retracția transferă lucrul pe trapezul mijlociu; deltoidul posterior lucrează cu omoplații stabili.',
      'Greutate mică, execuție perfectă — deltoidul posterior e mic și orice elan îl scoate din lucru.',
      'Combinat cu face pulls, echilibrează volumul mare de împins și protejează sănătatea umărului pe termen lung.'
    ]
  },
  {
    name: 'Seated Dumbbell Shoulder Press',
    slug: 'seated-db-press',
    primary_muscle: 'Shoulders',
    equipment: 'Dumbbell',
    type: 'Compound',
    difficulty: 2,
    description: 'Presă deasupra capului cu gantere, din șezut. Amplitudine mai naturală decât bara și lucru independent al fiecărui umăr.',
    instructions: [
      'Setează spătarul aproape vertical (80-85°). Ridică ganterele la nivelul umerilor, cu palmele spre înainte.',
      'Spatele lipit de spătar, picioarele ferm pe podea, abdomenul activat — fără arcuire excesivă a lombarului.',
      'Expiră și împinge ganterele vertical în sus, apropiindu-le ușor deasupra capului fără a le ciocni.',
      'Extinde brațele complet fără a bloca agresiv coatele, cu ganterele deasupra umerilor, nu în fața lor.',
      'Coboară controlat (2-3 secunde) până ganterele ajung la nivelul urechilor sau puțin mai jos.'
    ],
    tips: [
      'Nu coborî excesiv de jos — sub nivelul urechilor stretch-ul suplimentar aduce risc, nu câștig, pentru majoritatea.',
      'Dacă lombarul se arcuiește ca să împingi, greutatea e prea mare — umerii lucrează, nu spatele.',
      'Varianta cu palmele față în față (priză neutră) este mai blândă cu umerii dacă simți disconfort.'
    ]
  },
  // --- BICEPS ---
  {
    name: 'Incline Dumbbell Curl',
    slug: 'incline-db-curl',
    primary_muscle: 'Biceps',
    equipment: 'Dumbbell',
    type: 'Isolation',
    difficulty: 2,
    description: 'Flexii pe bancă înclinată — stretch maxim pe capul lung al bicepsului. Exercițiul suprem pentru vârful bicepsului.',
    instructions: [
      'Setează banca la 45-60° și așază-te cu spatele complet lipit, cu câte o ganteră în fiecare mână.',
      'Lasă brațele să atârne vertical spre podea, în spatele planului trunchiului — aici e stretch-ul unic al exercițiului.',
      'Expiră și flexează ganterele fără a mișca coatele înainte — ele rămân fixe, ușor în spatele corpului.',
      'Contractă bicepsul complet sus, cu o supinație ușoară (rotește degetul mic spre exterior).',
      'Coboară lent (3 secunde) până la extensia completă a brațelor. Stretch-ul de jos este esența exercițiului.'
    ],
    tips: [
      'Nu ridica umerii sau coatele când obosești — mai bine scazi greutatea decât să pierzi poziția.',
      'Poziția înclinată face exercițiul mult mai greu decât curl-ul normal — folosește gantere cu 20-30% mai ușoare.',
      'Extensia completă jos, de fiecare dată — jumătățile de repetări anulează exact avantajul acestui exercițiu.'
    ]
  },
  // --- TRICEPS ---
  {
    name: 'Close-Grip Bench Press',
    slug: 'close-grip-bench',
    primary_muscle: 'Triceps',
    equipment: 'Barbell',
    type: 'Compound',
    difficulty: 3,
    description: 'Presă cu priză îngustă — cel mai bun exercițiu compus pentru masa tricepsului, cu transfer direct în forța de împins.',
    instructions: [
      'Culcă-te pe bancă precum la bench press, dar prinde bara la lățimea umerilor (nu mai îngust).',
      'Retrage omoplații, picioarele ferm pe podea, încheieturile drepte deasupra antebrațelor.',
      'Inspiră și coboară bara controlat spre pieptul inferior, cu coatele aproape de corp (la ~30° față de trunchi).',
      'Atinge ușor pieptul fără a sări bara, menținând coatele deasupra încheieturilor.',
      'Expiră și împinge exploziv în sus, concentrându-te pe extensia din triceps, până la întinderea completă.'
    ],
    tips: [
      'Priza la lățimea umerilor, nu mai îngustă — prizele foarte înguste stresează încheieturile fără activare suplimentară.',
      'Coatele aproape de corp pe toată mișcarea — dacă se depărtează, exercițiul redevine unul de piept.',
      'Excelent ca primul exercițiu de triceps în zi de împins — greutăți mari, 6-10 repetări.'
    ]
  },
  // --- CORE ---
  {
    name: 'Ab Wheel Rollout',
    slug: 'ab-wheel',
    primary_muscle: 'Core',
    equipment: 'Bodyweight',
    type: 'Compound',
    difficulty: 4,
    description: 'Unul dintre cele mai grele și eficiente exerciții de core — anti-extensie pură, cu activare abdominală maximă.',
    instructions: [
      'Îngenunchează pe o saltea cu roata în fața genunchilor, brațele întinse, umerii deasupra roții.',
      'Activează abdomenul și fesierii, cu bazinul ușor înclinat posterior — lombarul nu trebuie să se arcuiască niciodată.',
      'Inspiră și rulează roata înainte lent, extinzând corpul cât poți controla, cu brațele întinse.',
      'Oprește-te înainte ca lombarul să cedeze în extensie — acesta este limita ta de forță actuală.',
      'Expiră și trage-te înapoi din abdomen (nu din brațe), rulând roata spre genunchi.'
    ],
    tips: [
      'Amplitudinea crește în săptămâni, nu în zile — extinde-te doar cât poți menține bazinul stabil.',
      'Dacă simți lucrul în lombar în loc de abdomen, te extinzi prea mult — scurtează mișcarea imediat.',
      'Progresie: rollout pe genunchi → rollout spre perete → rollout complet din picioare (elită).'
    ]
  },
  {
    name: 'Russian Twist',
    slug: 'russian-twist',
    primary_muscle: 'Core',
    equipment: 'Bodyweight',
    type: 'Isolation',
    difficulty: 2,
    description: 'Rotații de trunchi din șezut pentru oblici. Adaugă greutate progresivă pentru un core puternic în plan de rotație.',
    instructions: [
      'Așază-te pe podea cu genunchii îndoiți și călcâiele sprijinite ușor (sau ridicate, pentru dificultate maximă).',
      'Înclină trunchiul pe spate la ~45°, cu spatele drept și pieptul sus — poziția de V menținută tot setul.',
      'Ține greutatea (disc, ganteră sau minge medicinală) cu ambele mâini în fața pieptului.',
      'Rotește trunchiul controlat spre o parte, ducând greutatea lângă șold — rotația vine din trunchi, nu din brațe.',
      'Revino prin centru și rotește spre partea opusă. O rotație stânga + dreapta = o repetare.'
    ],
    tips: [
      'Rotește umerii, nu doar brațele — dacă doar mâinile se plimbă stânga-dreapta, oblicii nu lucrează.',
      'Spatele rămâne drept — rotunjirea lombarului sub oboseală este semnalul să oprești setul.',
      'Începe fără greutate până stăpânești poziția, apoi progresează cu disc sau ganteră.'
    ]
  },
];
