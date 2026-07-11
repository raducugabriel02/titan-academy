import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { NEW_EXERCISES } from './new-exercises-data.ts';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const EXERCISES = [
  // --- PIEPT (CHEST) ---
  {
    name: 'Barbell Bench Press',
    slug: 'bench-press',
    primary_muscle: 'Chest',
    equipment: 'Barbell',
    type: 'Compound',
    difficulty: 3,
    description: 'Regele exercițiilor pentru piept. Construiește forță și masă în zona pectoralilor cu o mișcare compusă fundamentală.',
    instructions: [
      'Culcă-te pe bancă cu ochii direct sub bară. Prinde bara cu o priză puțin mai lată decât lățimea umerilor, palmele spre tavan.',
      'Retrage activ omoplații și apasă-i în bancă, creând o boltă naturală a spatelui. Plantează ferm picioarele pe podea pentru stabilitate maximă.',
      'Inspiră adânc, deblochează bara din suport și ține-o deasupra pieptului cu brațele drepte. Acesta este punctul de start.',
      'Coboară bara controlat (2-3 secunde) pe o traiectorie ușor diagonală spre mijlocul pieptului (nivelul mameloanelor). Atinge pieptul fără a sări bara.',
      'Expiră exploziv și împinge bara înapoi sus, menținând omoplații retrași, până la extensia completă a brațelor.'
    ],
    tips: [
      'Menține omoplații retrași și compresi pe toată durata setului — aceasta protejează umerii și maximizează activarea pieptului.',
      'Nu ridica fundul de pe bancă sub nicio formă — pierzi stabilitatea și crești riscul de accidentare.',
      'Priza corectă aliniază antebrațele vertical față de podea în punctul de jos al mișcării.',
      'Folosește un spotter sau limitatoare de siguranță la greutăți mari — nu riști accidentarea singur.'
    ]
  },
  {
    name: 'Incline Dumbbell Press',
    slug: 'incline-db-press',
    primary_muscle: 'Chest',
    equipment: 'Dumbbell',
    type: 'Compound',
    difficulty: 3,
    description: 'Targetează pieptul superior pentru un aspect plin și rotund. Ganterele permit o amplitudine mai mare decât bara.',
    instructions: [
      'Reglează banca la 30-45 de grade. Ia ganterele sprijinindu-te pe coapse, culcă-te și ridică-le la nivelul umerilor, cu palmele spre înainte.',
      'Retrage omoplații și lipește-i de bancă. Asigură-te că picioarele sunt stabile pe podea, cu spatele în contact cu banca.',
      'Inspiră și coboară ganterele controlat (2-3 secunde), ducând coatele la 45-75° față de trunchi. Simte stretch-ul în pieptul superior.',
      'Expiră și împinge ganterele exploziv în sus și ușor spre interior, fără a le atinge între ele în punctul de sus.',
      'Menține o ușoară îndoire a coatelor în punctul de sus pentru a păstra tensiunea în pectoral și a nu stresa articulațiile.'
    ],
    tips: [
      'Un unghi de 30° activează pieptul superior mai eficient decât 45°, care recrutează prea mult deltoidul anterior.',
      'Coboară ganterele controlat pe 2-3 secunde — faza negativă construiește masa musculară la fel de mult ca cea pozitivă.',
      'Nu lăsa ganterele să fugă prea lateral — coatele depășind planul pieptului suprasolicită umerii și riscă accidentarea.'
    ]
  },
  {
    name: 'Chest Dips',
    slug: 'chest-dips',
    primary_muscle: 'Chest',
    equipment: 'Bodyweight',
    type: 'Compound',
    difficulty: 4,
    description: 'Excelent pentru pieptul inferior și densitate generală. Înclina trunchiului anterior muta focusul de la triceps la pectoral.',
    instructions: [
      'Prinde barele paralele cu o priză fermă, ridică-te și blochează brațele. Înclină trunchiul în față la 30-45° — această înclinare activează pieptul în detrimentul tricepsului.',
      'Inspiră și coboară corpul controlat, îndoind coatele spre exterior (nu spre corp), până simți un stretch pronunțat în zona inferioară a pieptului.',
      'Coboară până umerii sunt sub nivelul coatelor pentru amplitudine completă, dacă mobilitatea îți permite.',
      'Expiră și împinge-te exploziv în sus, menținând trunchiul înclinat înainte pe tot parcursul mișcării.',
      'Nu bloca complet coatele sus — menține o ușoară îndoire pentru a păstra tensiunea și a proteja articulațiile.'
    ],
    tips: [
      'Coatele spre exterior = activare piept; coatele spre corp = activare triceps. Alege în funcție de scopul antrenamentului.',
      'Dacă ești avansat, adaugă greutate cu o centură sau ținând o ganteră între genunchi pentru progresie.',
      'Dacă simți durere în umeri, verifică să nu cobori prea jos sau adaugă exerciții de mobilitate specifice umărului.'
    ]
  },
  {
    name: 'Pec Deck Machine',
    slug: 'pec-deck',
    primary_muscle: 'Chest',
    equipment: 'Machine',
    type: 'Isolation',
    difficulty: 1,
    description: 'Izolare maximă pentru definirea și conturarea pectoralilor. Ideal ca exercițiu finalizator pentru o pompare intensă.',
    instructions: [
      'Reglează scaunul astfel încât mânerele să fie la nivelul pieptului mijlociu când stai drept. Spatele complet lipit de spătar pe tot parcursul mișcării.',
      'Prinde mânerele sau plasează antebrațele pe pad-uri, cu coatele la 90°. Adoptă o curbură naturală a spatelui.',
      'Inspiră, apoi expiră și aduce brațele în față într-o mișcare de arc, imaginând că strângi un copac uriaș.',
      'Contractă pieptul intens în punctul de maximă apropiere a brațelor. Ține contracția 1-2 secunde pentru activare maximă.',
      'Revino lent (3 secunde) la poziția inițială, controlând greutatea și simțind stretch-ul complet al pectoralilor.'
    ],
    tips: [
      'Nu lăsa greutatea să îți tragă umerii prea mult înapoi — limitează amplitudinea dacă simți presiune sau disconfort la umeri.',
      'Mișcarea trebuie să fie circulară și fluidă, ca o îmbrățișare — nu de împingere dreaptă.',
      'Excelent ca exercițiu finalizator cu repetări mai multe (12-20) pentru pompare maximă și definiție.'
    ]
  },
  {
    name: 'Push-ups',
    slug: 'push-ups',
    primary_muscle: 'Chest',
    equipment: 'Bodyweight',
    type: 'Compound',
    difficulty: 1,
    description: 'Exercițiu fundamental de greutate proprie, accesibil oriunde. Construiește forță funcțională în piept, umeri și triceps.',
    instructions: [
      'Poziționează-te în plank cu mâinile ușor mai late decât umerii, degetele orientate ușor spre exterior. Corpul formează o linie dreaptă de la cap la călcâie.',
      'Activează abdomenul, fesele și cvadricepsul pentru a menține corpul rigid ca o scândură pe toată durata exercițiului.',
      'Inspiră și coboară pieptul spre podea, îndoind coatele la 45° față de trunchi (nu la 90°, care stresează umerii).',
      'Coboară până pieptul aproape atinge podeaua, menținând corpul complet rigid.',
      'Expiră și împinge-te exploziv în sus, menținând corpul drept. Nu lăsa bazinul să cadă sau să se ridice.'
    ],
    tips: [
      'Priza mai lată activează mai mult pieptul; priza mai îngustă (diamond push-ups) activează mai mult tricepsul.',
      'Pentru a crește dificultatea: picioarele elevate, vestă cu greutăți sau execuție pe inele de gimnastică.',
      'Menține gâtul neutru — nu împinge bărbia în față sau nu cobori capul spre podea.'
    ]
  },
  {
    name: 'Cable Flyes (High-to-Low)',
    slug: 'high-to-low-cables',
    primary_muscle: 'Chest',
    equipment: 'Cable',
    type: 'Isolation',
    difficulty: 2,
    description: 'Targetează pieptul inferior și creează separarea vizuală dorită. Cablurile mențin tensiune constantă pe tot arcul mișcării.',
    instructions: [
      'Setează scripetele la înălțimea maximă pe ambele turnuri. Stai în centru și prinde câte un mâner în fiecare mână cu o priză fermă.',
      'Fă un pas mic în față pentru stabilitate. Apleacă-te ușor în față (15-20°) și blochează această poziție a trunchiului.',
      'Cu coatele ușor îndoite și fixate în acea poziție, expiră și trage cablurile în jos și spre interior, spre șolduri, urmând un arc larg.',
      'Contractă puternic pieptul inferior când mâinile se apropie în fața șoldurilor. Poți încrucișa ușor mâinile pentru activare maximă.',
      'Inspiră și revino lent (3 secunde) la poziția inițială, controlând cablurile pe tot parcursul și simțind stretch-ul în pieptul superior.'
    ],
    tips: [
      'Coatele rămân ușor îndoite și fixe — mișcarea vine exclusiv din articulația umărului, nu din cot.',
      'Pentru pieptul superior: setează scripetele jos și trage de jos în sus (low-to-high flyes).',
      'Traiectoria mâinilor urmărește un arc — nu o linie dreaptă. Imaginează că îmbrățișezi un butoi uriaș.'
    ]
  },

  // --- SPATE (BACK) ---
  {
    name: 'Deadlift (Conventional)',
    slug: 'deadlift',
    primary_muscle: 'Back',
    equipment: 'Barbell',
    type: 'Compound',
    difficulty: 5,
    description: 'Regele tuturor exercițiilor compuse. Solicită practic fiecare mușchi al corpului și construiește forță brută de la podea.',
    instructions: [
      'Plasează bara pe podea și stai cu tălpile la lățimea șoldurilor, bara deasupra mijlocului piciorului (~2.5 cm de tibie). Degetele ușor depărtate spre exterior.',
      'Îndoaie genunchii și prinde bara cu priză dublă sau mixtă, la lățimea umerilor. Brațele complet drepte, în afara genunchilor.',
      'Inspiră adânc (manevra Valsalva), activează abdomenul ca și cum ai primi o lovitură. Ridică pieptul și creează o curbură naturală în lombar — spatele rigid și drept.',
      'Împinge podeaua cu picioarele (gândește-te la leg press, nu la o tracțiune), ținând bara lipită de tibie pe tot parcursul ridicării.',
      'Blochează șoldurile și genunchii simultan în punctul de sus. Coboară bara inversând mișcarea: șold înapoi întâi, genunchi se îndoaie când bara trece de ei.'
    ],
    tips: [
      'Nu rotunji niciodată spatele lombar — aceasta este cauza principală de accidentare gravă la deadlift.',
      'Nu trage cu brațele — ele sunt cârlige; forța vine din picioare și extensia șoldului.',
      'Încălzire progresivă obligatorie cu seturi de 50%, 70%, 85% din greutatea de lucru înainte de setul maxim.',
      'Coapsa nu trebuie să fie paralelă cu solul la start — genunchii se îndoaie doar atât cât e nevoie să apuci bara.'
    ]
  },
  {
    name: 'Pull-Ups',
    slug: 'pull-ups',
    primary_muscle: 'Back',
    equipment: 'Bodyweight',
    type: 'Compound',
    difficulty: 4,
    description: 'Cel mai bun exercițiu pentru lățimea spatelui. Tracțiunile construiesc un V-taper impresionant folosind propria greutate.',
    instructions: [
      'Atârnă de bară cu priză pronată (palmele spre bară, tracțiuni clasice) sau supinată (chin-ups), mai lată decât umerii.',
      'Activează omoplații înainte de a trage — retrage-i ușor și coboară-i în jos. Aceasta protejează umerii și pregătește spatele.',
      'Expiră și trage-te în sus, inițiind mișcarea din coate (imaginează că tragi coatele spre podea, nu că ridici mâinile spre bară).',
      'Urcă până bărbia depășește bara sau pieptul atinge bara pentru amplitudine completă și contracție maximă.',
      'Inspiră și coboară lent (2-3 secunde), extinzând complet brațele și simțind stretch-ul în latissimus înainte de următoarea repetare.'
    ],
    tips: [
      'Inițiază mișcarea din spate (omoplați și latissimus), nu din bicepși — bicepsul este auxiliar.',
      'Legănatul reduce eficiența; menține controlul corpului și evită elanul.',
      'Dacă nu poți face repetări complete, folosește un elastic de asistență sau aparatul cu contragreutate.',
      'Prizia supinată (chin-ups) activează mai mult bicepsul; priza pronată activează mai mult spatele.'
    ]
  },
  {
    name: 'Lat Pulldown (Wide Grip)',
    slug: 'lat-pulldown',
    primary_muscle: 'Back',
    equipment: 'Cable',
    type: 'Compound',
    difficulty: 2,
    description: 'Alternativa perfectă la tracțiuni pentru volum mare. Permite controlul precis al greutății și o amplitudine completă.',
    instructions: [
      'Setează bara largă. Poziționează-te cu coapsele blocate sub perna de stabilizare. Prinde bara cu priză pronată, mai lată decât umerii.',
      'Apleacă-te ușor pe spate (15-20°). Retrage omoplații și coboară-i — aceasta este mișcarea de inițiere și protejează umerii.',
      'Expiră și trage bara spre pieptul superior/claviculă, conducând mișcarea cu coatele. Imaginează că coatele se duc spre șolduri.',
      'Strânge omoplații în punctul de jos. Bara atinge sau se apropie de claviculă pentru amplitudine completă.',
      'Inspiră și revino lent (3 secunde) la poziția inițială, extinzând complet brațele și simțind stretch-ul în latissimus dorsi.'
    ],
    tips: [
      'Nu te legăna mult pe spate — transformi exercițiul în rowing și pierzi activarea corectă a latissimus-ului.',
      'Priza prea largă limitează amplitudinea; o priză la lățimea umerilor spre puțin mai lată este de fapt optimă.',
      'Concentrează-te pe a simți spatele, nu bicepsul — dacă bicepsul obosește primul, reduce greutatea.'
    ]
  },
  {
    name: 'Bent Over Barbell Row',
    slug: 'bb-row',
    primary_muscle: 'Back',
    equipment: 'Barbell',
    type: 'Compound',
    difficulty: 4,
    description: 'Exercițiul definitiv pentru grosimea și masa spatelui mijlociu. Romboizii, trapezul și latissimus-ul lucrează simultan la intensitate maximă.',
    instructions: [
      'Prinde bara la lățimea umerilor cu priză pronată. Îndoaie ușor genunchii și înclină trunchiul la ~45° față de podea cu spatele drept și capul neutru.',
      'Bara atârnă sub umeri. Activează abdomenul și spatele lombar pentru stabilizare rigidă a trunchiului.',
      'Inspiră și activează spatele. Expiră și trage bara spre buric/abdomenul inferior, conducând din coate și nu din mâini.',
      'Coatele depășesc ușor nivelul spatelui în punctul de sus. Contractă puternic romboizii și trapezul mijlociu.',
      'Coboară bara lent (2-3 secunde) până la extensia completă a brațelor, simțind stretch-ul complet în spate.'
    ],
    tips: [
      'Spatele rămâne rigid pe tot parcursul — nu rotunji lombar-ul sub oboseală. Reduce greutatea dacă forma se deteriorează.',
      'Trage bara spre buric = activare grosime spate (romboizi). Trage bara spre piept = activare latissimus.',
      'Priza supinată (palmele spre tine) activează mai mult bicepsul și permite o priză mai puternică pe greutăți mari.'
    ]
  },
  {
    name: 'Seated Cable Row',
    slug: 'seated-row',
    primary_muscle: 'Back',
    equipment: 'Cable',
    type: 'Compound',
    difficulty: 2,
    description: 'Focus pe romboizi, postura și grosimea spatelui mijlociu. Cablul menține tensiune constantă pe tot parcursul mișcării.',
    instructions: [
      'Stai cu picioarele ușor îndoite, tălpile pe platformă. Prinde mânerul V sau bara dreaptă cu ambele mâini.',
      'Drepte spatele complet — ridică pieptul și activează extensia spinală. Nu sta aplecat înainte ca pe scaun.',
      'Inspiră. Expiră și trage mânerul spre abdomenul inferior, conducând din coate, nu din mâini.',
      'Când mânerul atinge abdomenul, contractă intens omoplații și ține contracția 1-2 secunde.',
      'Revino lent (2-3 secunde), permițând omoplații să se depărteze și simțind stretch-ul complet în spate.'
    ],
    tips: [
      'Nu te balansa înainte-înapoi cu trunchiul — un ușor balans (10-15°) este acceptabil, nu mai mult.',
      'Umerii rămân jos și departe de urechi pe tot parcursul mișcării — nu ridica trapezel.',
      'Mânerul V (priză pronată-supinată) permite o amplitudine mai mare și o contracție mai bună a spatelui.'
    ]
  },
  {
    name: 'T-Bar Row',
    slug: 't-bar-row',
    primary_muscle: 'Back',
    equipment: 'Barbell',
    type: 'Compound',
    difficulty: 3,
    description: 'Clasic pentru masă și grosimea spatelui. Permite utilizarea greutăților mari cu o formă relativ stabilă.',
    instructions: [
      'Setează bara T sau utilizează un capăt de bară fixat în colț cu un mâner V. Prinde mânerul cu ambele mâini.',
      'Picioarele la lățimea umerilor, genunchii ușor îndoiți. Înclină trunchiul la ~45°, cu spatele drept și capul neutru.',
      'Inspiră și activează abdomenul pentru stabilizare. Expiră și trage greutatea spre piept, ducând coatele spre spate.',
      'Contractă puternic spatele în punctul de sus — omoplații se apropie și se coboară.',
      'Coboară lent (2-3 secunde) până la extensia completă a brațelor, simțind stretch-ul în latissimus.'
    ],
    tips: [
      'Coatele aproape de corp activează mai mult latissimus-ul; coatele depărtate activează mai mult romboizii.',
      'Nu rotunji spatele sub oboseală — reduce greutatea dacă forma se deteriorează.',
      'Ideal ca exercițiu de masă combinat cu deadlift sau tracțiuni în același antrenament de spate.'
    ]
  },
  {
    name: 'Straight Arm Pulldown',
    slug: 'straight-arm-pulldown',
    primary_muscle: 'Back',
    equipment: 'Cable',
    type: 'Isolation',
    difficulty: 2,
    description: 'Izolare pură pentru latissimus dorsi. Ideal ca exercițiu de activare sau finalizator pentru a simți spatele.',
    instructions: [
      'Setează scripetelul sus și prinde bara dreaptă sau frânghia. Fă un pas înapoi de la aparat, aplecă-te ușor în față la 15-20°.',
      'Brațele aproape complet drepte, cu o ușoară îndoire la coate (blocată). Priza la lățimea umerilor.',
      'Inspiră. Expiră și trage bara în jos și spre coapse, menținând brațele drepte pe tot parcursul mișcării.',
      'Contractă intens latissimus-ul în punctul de jos, când bara ajunge lângă coapse.',
      'Revino lent (3 secunde), lăsând brațele să urce la nivelul capului/umerilor și simțind stretch-ul profund în axile și spate.'
    ],
    tips: [
      'Nu îndoi coatele — mișcarea vine exclusiv din articulația umărului. Coatele îndoite transformă mișcarea în pulldown.',
      'Excelent ca exercițiu de activare/încălzire înainte de tracțiuni sau lat pulldown pentru a "conecta" cu spatele.',
      'Greutatea nu trebuie să fie mare — prioritatea este contracția maximă și stretch-ul complet al latissimus-ului.'
    ]
  },

  // --- PICIOARE (LEGS) ---
  {
    name: 'Barbell Back Squat',
    slug: 'squat',
    primary_muscle: 'Legs',
    equipment: 'Barbell',
    type: 'Compound',
    difficulty: 5,
    description: 'Constructorul suprem de picioare și forță totală. Squat-ul cu bara solicită cvadricepsul, femuralii, fesele și întregul lanț posterior.',
    instructions: [
      'Poziționează bara pe trapez (sub al 7-lea vertebre cervicale), nu pe gât. Prinde bara cu priză puțin mai lată decât umerii. Picioarele la lățimea umerilor, degetele depărtate la 15-30°.',
      'Inspiră adânc, activează abdomenul și pieptul sus. Fă un pas înapoi din rack, verificând echilibrul și poziția.',
      'Începe coborârea împingând genunchii în direcția degetelor și șoldul în spate simultan. Menține trunchiul cât mai vertical posibil.',
      'Coboară până coapsa este paralelă cu podeaua sau sub paralel (full squat). Genunchii nu cad spre interior și nu depășesc mult vârful picioarelor.',
      'Expiră și împinge exploziv prin toată talpa (accent pe călcâie), extinzând genunchii și șoldurile simultan până la poziția de start.'
    ],
    tips: [
      'Privirea înainte sau ușor în sus — nu în jos — menține coloana dreaptă și spatele solid.',
      'Activează abdomenul ca o centură naturală pe tot parcursul mișcării — nu relaxa niciodată mijlocul.',
      'Genunchii nu cad niciodată spre interior (valgus) — activează fesele și apasă activ genunchii spre exterior.',
      'Inițial antrenează-te fără greutate sau cu bara goală timp de săptămâni până stăpânești perfect tehnica.'
    ]
  },
  {
    name: 'Romanian Deadlift',
    slug: 'rdl',
    primary_muscle: 'Legs',
    equipment: 'Barbell',
    type: 'Compound',
    difficulty: 3,
    description: 'Exercițiul suprem pentru bicepșii femurali și fese. RDL construiește lanțul posterior cu o mișcare elegantă de balama a șoldului.',
    instructions: [
      'Ține bara la lățimea umerilor, stai drept cu picioarele la lățimea șoldurilor. Genunchii ușor îndoiți și fixați în acea poziție pe tot parcursul mișcării.',
      'Menține pieptul sus și coloana dreaptă (neutră). Activează abdomenul ca o centură de stabilizare.',
      'Inspiră și împinge șoldurile în spate (nu coborî genunchii), lăsând trunchiul și bara să coboare pe lângă tibie.',
      'Simte stretch-ul intens în bicepșii femurali. Coboară bara până la mijlocul tibiei sau până când flexibilitatea nu mai permite forma corectă.',
      'Expiră și împinge șoldurile înainte, contractând femuralii și fesele, revenind la poziția verticală de start.'
    ],
    tips: [
      'Nu rotunji niciodată spatele lombar — aceasta pune o presiune enormă pe discurile vertebrale. Forma primează.',
      'Bara rămâne aproape de corp pe tot parcursul mișcării — nu o lăsa să se depărteze de tibie.',
      'Dacă nu simți stretch-ul în femuralii, cobori probabil genunchii în loc să împingi șoldul înapoi.'
    ]
  },
  {
    name: 'Leg Press',
    slug: 'leg-press',
    primary_muscle: 'Legs',
    equipment: 'Machine',
    type: 'Compound',
    difficulty: 2,
    description: 'Volum mare de lucru fără stresul compresiei axiale pe coloană. Permite supraîncărcarea cvadricepsului și feselor în siguranță.',
    instructions: [
      'Aşează-te pe aparat și plasează picioarele pe platforma la lățimea umerilor, la mijlocul sau ușor sus pe platformă. Spatele și bazinul lipit de spătar.',
      'Deblochează siguranțele și pornește cu genunchii ușor îndoiți (nu extindere completă la start).',
      'Inspiră și coboară platforma controlat (3 secunde), îndoind genunchii spre piept fără a ridica bazinul de pe spătar.',
      'Coboară până genunchii sunt la 90° sau ușor mai puțin, fără ca bazinul să se încovoaie sau să ridice.',
      'Expiră și împinge platforma exploziv până aproape de extensie completă — nu bloca genunchii în extensia maximă.'
    ],
    tips: [
      'Picioarele sus pe platformă activează mai mult femuralii și fesele; picioarele jos activează mai mult cvadricepsul.',
      'Nu ridica bazinul de pe spătar — riscul de hernie de disc crește exponențial.',
      'Nu bloca genunchii în extensie completă — menține o ușoară îndoire pentru a proteja articulațiile.'
    ]
  },
  {
    name: 'Bulgarian Split Squat',
    slug: 'bulgarian',
    primary_muscle: 'Legs',
    equipment: 'Dumbbell',
    type: 'Compound',
    difficulty: 4,
    description: 'Cel mai eficient exercițiu unilateral pentru picioare. Echilibrează forța între membre și activează cvadricepsul și fesele la maxim.',
    instructions: [
      'Stai în fața unei bănci la 60-90 cm distanță. Plasează dosul piciorului din spate pe bancă (laba piciorului sau vârfurile degetelor).',
      'Ține o ganteră în fiecare mână sau bara pe umeri. Piciorul din față plantat ferm, la aproximativ un pas mare distanță față de bancă.',
      'Inspiră și coboară vertical, îndoind genunchiul din față și coborând genunchiul din spate spre podea.',
      'Coboară până coapsa din față este paralelă cu podeaua sau genunchiul din spate aproape atinge podeaua.',
      'Expiră și împinge prin călcâiul piciorului din față, extinzând genunchiul, revenind la poziția de sus.'
    ],
    tips: [
      'Menține trunchiul drept și vertical — nu te apleca excesiv în față, deoarece muta focusul de la cvadriceps la femuralii.',
      'Genunchiul din față nu cade spre interior — apasă activ spre exterior pentru activare fese.',
      'Distanța corectă față de bancă: la coborâre, tibia piciorului din față rămâne verticală sau ușor în față.',
      'Este normal să simți disconfort inițial în stabilizare — practică fără greutate până stăpânești echilibrul.'
    ]
  },
  {
    name: 'Leg Extension',
    slug: 'leg-ext',
    primary_muscle: 'Legs',
    equipment: 'Machine',
    type: 'Isolation',
    difficulty: 1,
    description: 'Izolare pură pentru cvadriceps. Ideal pentru a finisa antrenamentul de picioare sau pentru activare pre-squat.',
    instructions: [
      'Reglează aparatul astfel încât axa de rotație să se alinieze cu articulația genunchiului. Spatele drept pe scaun, coapsele complet sprijinite pe pernă.',
      'Plasează pad-ul pe treimea inferioară a tibiei, deasupra gleznei — nu direct pe gleznă.',
      'Inspiră. Expiră și extinde picioarele complet, contractând puternic cvadricepsul.',
      'Ține contracția 1-2 secunde în extensie completă (degetele orientate spre tavan maximizează activarea).',
      'Revino lent (3 secunde) la poziția de start — negativul controlat este la fel de important ca faza pozitivă.'
    ],
    tips: [
      'Nu folosi un elan cu spatele sau o balansare pentru a ridica greutatea — reduce greutatea și executa strict.',
      'Degetele orientate spre tavan (nu spre exterior sau interior) maximizează activarea cvadricepsului.',
      'Excelent ca exercițiu de pre-obosire înainte de squaturi sau ca finalizator pentru o pompare maximă.'
    ]
  },
  {
    name: 'Lying Leg Curl',
    slug: 'leg-curl',
    primary_muscle: 'Legs',
    equipment: 'Machine',
    type: 'Isolation',
    difficulty: 1,
    description: 'Izolare pură pentru bicepșii femurali. Esențial pentru echilibrul muscular al coapsei și prevenirea accidentărilor.',
    instructions: [
      'Culcă-te pe burtă pe aparat. Reglează pad-ul la nivelul tendonului lui Ahile, ușor deasupra călcâielor.',
      'Șoldurile lipite de bancă pe tot parcursul mișcării. Prinde mânerele pentru stabilitate și pentru a nu ridica bazinul.',
      'Inspiră. Expiră și îndoaie picioarele, trăgând pad-ul spre fese cu o contracție puternică a femuralilor.',
      'Flexează complet genunchii dacă mobilitatea permite. Ține contracția 1-2 secunde în punctul de sus.',
      'Revino lent (3 secunde) la extensia completă a picioarelor, simțind stretch-ul profund în femuralii.'
    ],
    tips: [
      'Șoldurile rămân pe bancă — ridicarea bazinului reduce amplitudinea mișcării și activarea femuralilor.',
      'O ușoară rotire a picioarelor spre exterior activează capul medial al femuralilor mai intens.',
      'Controlul negativului (coborârea lentă) este esențial pentru hipertrofia femuralilor.'
    ]
  },
  {
    name: 'Hack Squat',
    slug: 'hack-squat',
    primary_muscle: 'Legs',
    equipment: 'Machine',
    type: 'Compound',
    difficulty: 3,
    description: 'Variație excelentă a squat-ului cu focus pe cvadriceps. Aparatul stabilizează spatele, permițând volume mari în siguranță.',
    instructions: [
      'Intră în aparat și plasează umerii sub pernele de susținere. Spatele lipit complet de suportul înclinat.',
      'Picioarele la lățimea umerilor sau ușor mai late pe platformă, degetele ușor depărtate la 15-30°.',
      'Deblochează siguranțele. Inspiră adânc și activează abdomenul pentru a stabiliza coloana.',
      'Coboară controlat prin îndoirea genunchilor, menținând spatele pe suport. Nu lăsa genunchii să cadă spre interior.',
      'Coboară sub paralel pentru amplitudine completă. Expiră și împinge prin toată talpa, revenind sus fără a bloca genunchii.'
    ],
    tips: [
      'Picioarele jos pe platformă (aproape de baza) activează mai mult cvadricepsul; picioarele sus activează femuralii și fesele.',
      'Nu bloca genunchii în extensie completă — menține mereu o ușoară îndoire.',
      'Față de squat liber, hack squat permite un volum mai mare fără stresul compresiei axiale pe coloana vertebrală.'
    ]
  },

  // --- UMERI (SHOULDERS) ---
  {
    name: 'Overhead Press',
    slug: 'ohp',
    primary_muscle: 'Shoulders',
    equipment: 'Barbell',
    type: 'Compound',
    difficulty: 4,
    description: 'Exercițiul suprem pentru forța și masa umerilor. OHP construiește deltoidul anterior și lateral, plus tricepsul.',
    instructions: [
      'Prinde bara cu priză la lățimea umerilor sau ușor mai lată. Bara la nivelul claviculei/gâtului, coatele ușor în față (nu complet sub bară).',
      'Picioarele la lățimea umerilor, activează fesele și abdomenul. Menține coloana neutră — nu arcui excesiv lombar.',
      'Inspiră adânc. Expiră și împinge bara vertical, mutând capul ușor înapoi pentru a lăsa bara să treacă.',
      'Bara urcă în linie aproape verticală. Sus, bara este deasupra și ușor în spatele capului, umerii complet blocați în extensie.',
      'Coboară bara controlat spre claviculă, mutând capul ușor în față pentru a-i face loc. Menține tensiunea pe tot drumul jos.'
    ],
    tips: [
      'Incordează fesele și abdomenul activ — previne arcuirea excesivă a spatelui și protejează coloana.',
      'Bara trebuie să fie deasupra capului (și ușor în spate) la extensia completă, nu în fața capului.',
      'Nu îndoi trunchiul pe spate pentru a "ajuta" bara — aceea este o presă militară inclinată, nu OHP.'
    ]
  },
  {
    name: 'Dumbbell Lateral Raise',
    slug: 'lat-raise',
    primary_muscle: 'Shoulders',
    equipment: 'Dumbbell',
    type: 'Isolation',
    difficulty: 2,
    description: 'Exercițiul definitiv pentru lățimea umerilor și deltoidul lateral. Construiește acel aspect larg, impunător al umerilor.',
    instructions: [
      'Stai drept cu o ganteră în fiecare mână, palmele spre corp. Coatele ușor îndoite și fixate în acea poziție.',
      'Activează abdomenul. Aplecă-te ușor în față (5-10°) pentru o mai bună aliniere biomechanică cu deltoidul lateral.',
      'Expiră și ridică ganterele lateral, depărtând brațele de corp. Coatele conduc mișcarea, nu mâinile.',
      'Ridică până brațele sunt paralele cu podeaua (la nivelul umerilor). Imaginează că torni lichid din cești.',
      'Coboară lent (3 secunde), rezistând gravitației. Ganterele revin la coapse fără a atinge corpul, menținând tensiunea.'
    ],
    tips: [
      'Nu folosi elan sau balans pentru a ridica ganterele — reduce greutatea și executa strict pentru activare maximă.',
      'Coatele conduc mișcarea, nu mâinile. Mâinile puțin mai jos decât coatele (ca și cum ai turna apă din cești).',
      'Ridicarea deasupra nivelului umerilor nu activează mai mult deltoidul lateral — oprește-te la paralel cu podeaua.'
    ]
  },
  {
    name: 'Face Pulls',
    slug: 'face-pulls',
    primary_muscle: 'Shoulders',
    equipment: 'Cable',
    type: 'Isolation',
    difficulty: 2,
    description: 'Esențial pentru sănătatea umărului și deltoidul posterior. Contrabalansează pressingul excesiv și previne accidentările la umăr.',
    instructions: [
      'Setează scripetelul la înălțimea ochilor sau ușor mai sus. Atașează frânghia și prinde-o cu ambele mâini, palmele în jos.',
      'Fă un pas înapoi, brațele extinse în față, tensionând ușor cablul. Stabilizează trunchiul.',
      'Inspiră. Expiră și trage frânghia spre față, ducând mâinile în dreptul urechilor sau tâmplelor.',
      'Separă capetele frânghiei activ în punctul de sus — coatele rămân la înălțimea umerilor sau mai sus pe tot parcursul.',
      'Ține contracția 1-2 secunde, simțind squeeze-ul în deltoidul posterior și romboizi. Revino lent (3 secunde).'
    ],
    tips: [
      'Coatele trebuie să rămână sus pe tot parcursul — coatele coborâte transformă mișcarea într-un rowing, nu face pulls.',
      'Esențial pentru sănătatea umărului și contrabalansarea pressingului excesiv. Include în fiecare antrenament de piept sau umeri.',
      'Nu folosi greutate mare — accentul este pe activare și control, nu pe forță brută.'
    ]
  },
  {
    name: 'Arnold Press',
    slug: 'arnold-press',
    primary_muscle: 'Shoulders',
    equipment: 'Dumbbell',
    type: 'Compound',
    difficulty: 3,
    description: 'Variație completă pentru toți cei trei capete ai deltoidului. Rotația adăugată activează mai mulți fibre musculare decât pressing-ul clasic.',
    instructions: [
      'Stai pe o bancă dreaptă cu o ganteră în fiecare mână la nivelul umerilor, palmele spre tine (spre față), ca la finalul unui curl.',
      'Inspiră. Începe să împingi ganterele în sus și simultan rotește palmele spre exterior (spre față, departe de tine).',
      'Continuă mișcarea de împingere cu rotația fluidă — ganterele urcă lateral și în sus simultan.',
      'Sus, palmele sunt complet spre înainte, ganterele deasupra capului la extensia completă (nu bloca complet coatele).',
      'Coboară inversând complet mișcarea — rotire internă a palmelor spre tine pe măsură ce cobori ganterele la umeri.'
    ],
    tips: [
      'Rotirea palmelor trebuie să fie fluidă și integrată cu împingerea — nu o mișcare separată sau bruscă.',
      'Arnold Press activează mai mulți capete ale deltoidului decât pressing-ul clasic datorită mișcării de rotație suplimentare.',
      'Greutatea va fi mai mică față de press-ul normal datorită complexității mișcării — aceasta este normală.'
    ]
  },
  {
    name: 'Front Raise',
    slug: 'front-raise',
    primary_muscle: 'Shoulders',
    equipment: 'Dumbbell',
    type: 'Isolation',
    difficulty: 2,
    description: 'Focus pe deltoidul anterior pentru umeri rotunzi și complet dezvoltați. Completează lateral raise și face pulls.',
    instructions: [
      'Stai drept, o ganteră în fiecare mână, palmele spre corp sau spre sol. Coatele ușor îndoite și fixate.',
      'Activează abdomenul și fixează trunchiul. Umerii depărtați de urechi.',
      'Expiră și ridică ganterele în față cu brațele ușor îndoite, până la nivelul umerilor (nu mai sus).',
      'Ține contracția 1-2 secunde în punctul de sus, simțind activarea deltoidului anterior.',
      'Coboară lent (3 secunde), rezistând gravitației, până brațele sunt aproape de corp.'
    ],
    tips: [
      'Nu balansa spatele pentru a ridica ganterele — reduce greutatea și mișcă strict din articulația umărului.',
      'Deltoidul anterior este deja solicitatat intens de pressing; nu exagera cu front raises pentru a evita suprasolicitarea.',
      'Cu bara — mai puțin solicitant per umăr; cu gantere — mai multă independență și amplitudine per braț.'
    ]
  },

  // --- BICEPS ---
  {
    name: 'Barbell Curl',
    slug: 'bb-curl',
    primary_muscle: 'Biceps',
    equipment: 'Barbell',
    type: 'Isolation',
    difficulty: 2,
    description: 'Clasicul absolut pentru bicepși. Bara permite supraîncărcarea progresivă maximă pentru masă și forță în biceps.',
    instructions: [
      'Stai drept cu bara în față, priză supinată (palmele în sus) la lățimea umerilor sau ușor mai lată. Coatele lipite de corp și fixate.',
      'Activează abdomenul. Umerii depărtați de urechi și ținuți jos pe tot parcursul mișcării.',
      'Expiră și flexează bara spre umeri, ducând-o pe un arc natural, menținând coatele fixe (nu le proiecta în față).',
      'Ridică bara până bicepsul este complet contractat. Ține 1-2 secunde în punctul de sus pentru a maximiza contracția.',
      'Inspiră și coboară bara lent (3 secunde) până la extensia completă a brațelor. Nu "cădea" bara — controlează tot drumul.'
    ],
    tips: [
      'Nu mișca umerii sau nu te legăna pentru a ridica bara — trișatul reduce tensiunea pe biceps și riscă accidentarea coloanei.',
      'Bara EZ (cu curburi) reduce stresul pe articulațiile încheieturilor și coatelor față de bara dreaptă.',
      'Extensia completă la baza mișcării (brațe drepte) este esențială pentru creșterea maximă a bicepsului.'
    ]
  },
  {
    name: 'Dumbbell Hammer Curl',
    slug: 'hammer-curl',
    primary_muscle: 'Biceps',
    equipment: 'Dumbbell',
    type: 'Isolation',
    difficulty: 2,
    description: 'Pentru grosimea brațului — activează brahialis-ul și brahioradialis-ul care dau acel aspect plin și dens al brațului.',
    instructions: [
      'Stai drept cu o ganteră în fiecare mână, priză neutră (palmele față în față, ca și cum ții un ciocan). Coatele lipite de corp și fixe.',
      'Activează abdomenul. Umerii jos și depărtați de urechi.',
      'Expiră și ridică ganterele spre umeri, menținând priza neutră pe tot parcursul — nu roti palmele spre sus.',
      'Urcă până bicepsul și brahialis-ul sunt complet contractați. Ține 1-2 secunde în vârf.',
      'Coboară lent (3 secunde) la extensia completă a brațelor, menținând priza neutră pe tot drumul.'
    ],
    tips: [
      'Priza neutră activează brahialis-ul (sub biceps) și brahioradialis-ul (antebraț), dând grosime și lățime brațului.',
      'Poți executa alternativ (un braț, apoi celălalt) sau simultan — ambele variante sunt eficiente.',
      'Nu roti palmele în sus la ridicare — păstrează orientarea neutră pe toată amplitudinea mișcării.'
    ]
  },
  {
    name: 'Preacher Curl',
    slug: 'preacher-curl',
    primary_muscle: 'Biceps',
    equipment: 'Machine',
    type: 'Isolation',
    difficulty: 2,
    description: 'Izolare totală, fără posibilitate de trișat. Aparatul preacher elimină orice ajutor al umerilor și punii focusul pur pe biceps.',
    instructions: [
      'Reglează înălțimea scaunului astfel încât axilele să fie aproape de marginea superioară a pernei. Brațele complet sprijinite pe pernă.',
      'Prinde bara EZ sau ganterele cu priză supinată (palmele în sus).',
      'Inspiră. Expiră și flexează bara/ganterele spre umeri, menținând brațele sprijinite pe pernă pe tot parcursul.',
      'Urcă până bicepsul este complet contractat — nu ridica umerii sau corpul pentru a ajuta.',
      'Coboară lent (3 secunde) la extensia completă. Oprește-te ușor înainte de blocat complet pentru a proteja tendonul distal.'
    ],
    tips: [
      'Aparatul preacher elimină posibilitatea de trișat — forța vine exclusiv din biceps, fără ajutorul umerilor.',
      'Nu bloca complet coatele la extensie — poate tensiona tendonul bicepsului la nivelul inserției distale.',
      'Varianta cu ganteră pe un singur braț (One-Arm Preacher Curl) îți permite focus total și mai multă amplitudine.'
    ]
  },
  {
    name: 'Concentration Curl',
    slug: 'concentration-curl',
    primary_muscle: 'Biceps',
    equipment: 'Dumbbell',
    type: 'Isolation',
    difficulty: 2,
    description: 'Exercițiul pentru vârful și "peakul" bicepsului. Contracția maximă izolată construiește bicepsul înalt și rotund.',
    instructions: [
      'Stai pe o bancă cu picioarele depărtate. Ține o ganteră în mâna dreaptă și sprijină cotul drept pe fața interioară a coapsei drepte.',
      'Mâna liberă pe coapsa opusă pentru stabilitate. Trunchiul ușor aplecat în față, stabil pe toată durata setului.',
      'Expiră și flexează gantera spre umăr, menținând cotul fix pe coapsă pe tot parcursul mișcării.',
      'Rotează ușor palma spre exterior (supinație completă) la urcarea ganterelor pentru contracție maximă a bicepsului.',
      'Coboară lent (3 secunde) la extensia completă, simțind stretch-ul în biceps.'
    ],
    tips: [
      'Contracție maximă la vârf — ține 1-2 secunde și strânge bicepsul cât de tare poți.',
      'Supinația (rotirea palmei spre exterior) la ridicare maximizează contracția capului scurt al bicepsului.',
      'Excelent ca exercițiu de finalizare la finalul antrenamentului de biceps pentru un burn intens și pompare maximă.'
    ]
  },

  // --- TRICEPS ---
  {
    name: 'Skull Crushers',
    slug: 'skull-crushers',
    primary_muscle: 'Triceps',
    equipment: 'Barbell',
    type: 'Isolation',
    difficulty: 3,
    description: 'Masa tricepsului la maxim. Skull crushers construiesc capul lung al tricepsului cu o amplitudine completă și tensiune maximă.',
    instructions: [
      'Culcă-te pe o bancă orizontală. Ține bara EZ (recomandat) sau bara dreaptă cu priză pronată, brațele drepte deasupra pieptului superior.',
      'Coatele la lățimea umerilor, fixate și îndreptate spre tavan — nu le lăsa să se depărteze lateral.',
      'Inspiră și coboară bara spre frunte sau ușor în spatele capului, îndoind coatele. Numai antebrațele se mișcă, coatele rămân fixe.',
      'Coboară bara până antebrațele sunt paralele cu solul sau ușor mai jos (spre frunte sau lângă urechi pentru stretch maxim).',
      'Expiră și extinde coatele, împingând bara sus la poziția inițială. Contractă tricepsul intens în extensia completă.'
    ],
    tips: [
      'Bara EZ reduce stresul pe articulațiile coatelor și încheieturilor față de bara dreaptă — preferă-o.',
      'Coatele rămân fixe pe tot parcursul — coatele care se depărtează lateral sau "fug" spre față reduc eficiența.',
      'Varianta cu gantere permite o amplitudine ușor mai mare și reduce stresul articular, putând coborî mai jos de urechi.'
    ]
  },
  {
    name: 'Tricep Pushdown (Rope)',
    slug: 'tricep-pushdown',
    primary_muscle: 'Triceps',
    equipment: 'Cable',
    type: 'Isolation',
    difficulty: 1,
    description: 'Pompare și definire pentru triceps. Frânghia permite separarea capetelor pentru o contracție maximă a tuturor celor trei capete.',
    instructions: [
      'Setează scripetelul sus și atașează frânghia. Stai față în față cu aparatul la 30-40 cm distanță.',
      'Prinde câte un capăt al frânghiei în fiecare mână. Aplecă-te ușor în față. Coatele lipite de corp și fixate în acea poziție.',
      'Inspiră. Expiră și apasă frânghia în jos, extinzând coatele complet.',
      'Separă capetele frânghiei spre exterior în punctul de jos pentru contracție maximă a tuturor capetelor tricepsului.',
      'Ține contracția 1-2 secunde. Revino lent (2-3 secunde), lăsând frânghia să urce și simțind stretch-ul în triceps.'
    ],
    tips: [
      'Separarea capetelor frânghiei la coborâre maximizează contracția celor trei capete ale tricepsului simultan.',
      'Coatele fixe lângă corp pe tot parcursul — coatele care se mișcă înainte-înapoi reduc izolarea tricepsului.',
      'Umerii depărtați de urechi — nu tensiona trapezul. Mișcarea vine exclusiv din extensia cotului.'
    ]
  },
  {
    name: 'Dips between benches',
    slug: 'bench-dips',
    primary_muscle: 'Triceps',
    equipment: 'Bodyweight',
    type: 'Compound',
    difficulty: 2,
    description: 'Exercițiu clasic de triceps cu greutatea corpului. Accesibil, eficient și perfect pentru antrenamentele la domiciliu.',
    instructions: [
      'Stai cu spatele la o bancă. Plasează mâinile pe marginea băncii, la lățimea umerilor, cu degetele spre înainte.',
      'Picioarele întinse în față pe o altă bancă, cutie sau podea. Corpul este suspendat cu brațele extinse.',
      'Inspiră și coboară corpul prin îndoirea coatelor, apropiind fesele de podea. Spatele rămâne vertical și aproape de bancă.',
      'Coboară până coatele sunt la 90° — nu mai jos, deoarece stresul pe umeri crește semnificativ.',
      'Expiră și împinge-te sus extindând coatele, revenind la poziția inițială cu brațele aproape drepte.'
    ],
    tips: [
      'Menține spatele aproape de bancă — corpul prea depărtat de bancă stresează umerii și reduce activarea tricepsului.',
      'Picioarele ridicate pe o bancă sau platformă măresc dificultatea. O greutate pe genunchi adaugă rezistență suplimentară.',
      'Dacă simți durere la umeri, nu coborî mai jos de 90° la coate sau treci la dips la barele paralele.'
    ]
  },
  {
    name: 'Overhead Cable Extension',
    slug: 'overhead-tricep-ext',
    primary_muscle: 'Triceps',
    equipment: 'Cable',
    type: 'Isolation',
    difficulty: 2,
    description: 'Stretch maxim pentru capul lung al tricepsului. Cel mai eficient exercițiu pentru hipertrofia tricepsului datorită stretch-ului complet.',
    instructions: [
      'Setează scripetelul sus sau la înălțimea capului. Atașează frânghia sau mânerul. Întoarce spatele spre aparat.',
      'Prinde frânghia cu ambele mâini deasupra capului, coatele îndoite la aproximativ 90°, ținute aproape de cap.',
      'Fă un pas în față pentru a crea tensiune în cablu. Aplecă-te ușor în față pentru echilibru și o mai bună aliniere.',
      'Expiră și extinde coatele, împingând frânghia în față și ușor în jos. Coatele rămân fixe lângă cap pe tot parcursul.',
      'Extinde complet coatele. Ține contracția 1-2 secunde. Revino lent (3 secunde), simțind un stretch adânc în triceps.'
    ],
    tips: [
      'Stretch-ul maxim al capului lung al tricepsului face acest exercițiu extrem de valoros pentru hipertrofie — nu îl sări.',
      'Coatele fixe lângă cap pe tot parcursul — nu le lăsa să se depărteze sau să se miște spre exterior.',
      'Aplecarea ușoară a trunchiului spre înainte ajută la menținerea echilibrului și la o mai bună amplitudine.'
    ]
  },

  // --- CORE ---
  {
    name: 'Plank',
    slug: 'plank',
    primary_muscle: 'Core',
    equipment: 'Bodyweight',
    type: 'Isolation',
    difficulty: 2,
    description: 'Exercițiul suprem de stabilitate a trunchiului. Plank-ul activează toți mușchii stabilizatori ai abdomenului și coloanei.',
    instructions: [
      'Sprijină-te pe antebrațe și degetele de la picioare. Coatele direct sub umeri, antebrațele paralele sau ușor spre exterior.',
      'Activează abdomenul trăgând buricul spre coloană. Activează simultan fesele și cvadricepsul.',
      'Corpul formează o linie dreaptă de la cap la călcâie — bazinul nu cade în jos și nu se ridică.',
      'Menține respirația regulată și controlată pe tot parcursul hold-ului. Nu ține respirația.',
      'Crește progresiv durata — de la 20-30 secunde inițial la 60-120 secunde pe măsură ce te consolidezi.'
    ],
    tips: [
      'Nu ține respirația — respiră continuu și ritmic pentru a menține activarea musculară corectă.',
      'Dacă șoldul cade sau apare durere lombară, scurtează durata sau execută pe genunchi pentru a progresa gradual.',
      'Variante avansate: plank cu ridicare de picior, plank lateral, plank pe inele sau plank cu mișcare de "rollout".'
    ]
  },
  {
    name: 'Hanging Leg Raise',
    slug: 'hanging-leg-raise',
    primary_muscle: 'Core',
    equipment: 'Bodyweight',
    type: 'Isolation',
    difficulty: 4,
    description: 'Exercițiul de top pentru abdomenul inferior și flexorii șoldului. Complet și extrem de eficient pentru definirea zonei abdominale joase.',
    instructions: [
      'Atârnă de o bară cu priză pronată, mâinile la lățimea umerilor. Brațele complet extinse, corpul stabil înainte de a începe.',
      'Activează abdomenul, stabilizând coloana. Elimină orice balans inițial înainte de a executa prima repetare.',
      'Expiră și ridică picioarele (genunchii îndoiți pentru varianta ușoară, drepte pentru varianta dificilă) spre piept sau horizontal.',
      'Contractă abdomenul inferior intens în punctul de sus. Ține 1-2 secunde pentru activare maximă.',
      'Revino lent la poziția de start fără a te lăsa să balansezi. Controlul negativului este esențial.'
    ],
    tips: [
      'Nu te legăna — folosește benzile elastice sau aparatul cu suport pentru brațe dacă nu poți controla balansul.',
      'Ridică genunchii la 90° (mai ușor) înainte de a progresa la picioarele drepte sau la ridicare verticală.',
      'Contracția abdomenului inferior (nu a flexorilor șoldului) trebuie să inițieze mișcarea — gândești rotunjire a bazinului.'
    ]
  },
  {
    name: 'Cable Crunch',
    slug: 'cable-crunch',
    primary_muscle: 'Core',
    equipment: 'Cable',
    type: 'Isolation',
    difficulty: 2,
    description: 'Adaugă rezistență progresivă exercițiilor abdominale pentru hipertrofie reală. Ideal pentru a construi abdomen vizibil.',
    instructions: [
      'Atașează frânghia la scripetelul de sus. Îngenunchează la baza aparatului, față sau lateral față de aparat.',
      'Prinde capetele frânghiei lângă față sau urechi. Activează abdomenul și stabilizează bazinul.',
      'Inspiră. Expiră și rulează trunchiul în jos spre podea, contractând abdomenul. Mișcarea vine din flexia coloanei, nu din balans.',
      'Rotunjește coloana complet (flexie lombară și toracică) pentru a comprima abdomenul maxim în punctul de jos.',
      'Ține contracția 1-2 secunde, revino controlat simțind rezistența cablului pe toată faza negativă.'
    ],
    tips: [
      'Mișcarea vine din abdomen (flexia coloanei), nu din brațe sau flexia șoldului — brațele rămân fixe față de cap.',
      'Nu "aruncă" frânghia în jos cu forța brațelor — aceasta elimină activarea abdominală.',
      'Excelent pentru adăugarea de rezistență progresivă la exercițiile abdominale, esential pentru hipertrofie reală.'
    ]
  },

  // --- GAMBE (CALVES) ---
  {
    name: 'Standing Calf Raise',
    slug: 'standing-calf',
    primary_muscle: 'Calves',
    equipment: 'Machine',
    type: 'Isolation',
    difficulty: 1,
    description: 'Masa și definiția gambelor superioare (gastrocnemius). Amplitudinea completă este cheia pentru gambe bine dezvoltate.',
    instructions: [
      'Stai pe marginea unei platforme sau a treptei, cu vârfurile picioarelor pe platformă și călcâiele în aer, fără sprijin.',
      'Reglează pernele aparatului pe umeri (dacă există) sau ține gantere pentru rezistență. Picioarele la lățimea șoldurilor.',
      'Coboară călcâiele cât mai jos posibil, simțind un stretch profund și complet în gambă și tendonul lui Ahile.',
      'Expiră și ridică-te pe vârfuri cât mai sus posibil, contractând intens gastrocnemius (musculatura superioară a gambei).',
      'Ține contracția sus 1-2 secunde, coboară lent (3 secunde) la stretch complet.'
    ],
    tips: [
      'Stretch-ul complet la baza mișcării este absolut critic — gambaele răspund prost la amplitudine redusă.',
      'Repetări mai multe (15-25) funcționează mai bine pentru gambe datorită fibrelor musculare de tip 1 predominante.',
      'Variații de poziție a degetelor: degetele depărtate (activare medial/intern), degetele spre interior (activare lateral/extern), picior unic pentru intensitate maximă.'
    ]
  },
  {
    name: 'Seated Calf Raise',
    slug: 'seated-calf',
    primary_muscle: 'Calves',
    equipment: 'Machine',
    type: 'Isolation',
    difficulty: 1,
    description: 'Targetează solearul (mușchiul adânc al gambei). Soleararul este ignorat de mulți, dar esențial pentru gambe complete și groase.',
    instructions: [
      'Stai pe aparat cu genunchii îndoiți la 90° și coapsele sub pad-ul de rezistență. Vârfurile pe platformă, călcâiele atârnând liber.',
      'Coboară călcâiele complet pentru un stretch maxim al soleusului — acesta este momentul cheie al mișcării.',
      'Expiră și ridică-te pe vârfuri cât mai sus, contractând intens gambele.',
      'Ține contracția 1-2 secunde în punctul de sus pentru activare maximă.',
      'Coboară lent (3 secunde) la stretch complet. Repetă fără a pierde tensiunea musculară.'
    ],
    tips: [
      'Seated calf raise targetează soleusul mai mult decât gastrocnemius — nu îl înlocui cu standing, combină-le.',
      'Soleararul are un raport ridicat de fibre de rezistență — repetări multe (15-30) cu pauze scurte sunt mai eficiente.',
      'Combină obligatoriu seated și standing calf raise în același antrenament pentru dezvoltarea completă a gambei.'
    ]
  },
  ...NEW_EXERCISES
];

async function seed() {
  console.log('🚀 TITAN ACADEMY: Instalăm arsenalul COMPLET cu instrucțiuni detaliate...');
  await supabase.from('exercises').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error } = await supabase.from('exercises').insert(EXERCISES);
  if (error) console.error('❌ Eroare Seed:', error.message);
  else console.log('✅ Baza de date actualizată cu succes! Toate exercițiile au instrucțiuni complete.');
}
seed();
