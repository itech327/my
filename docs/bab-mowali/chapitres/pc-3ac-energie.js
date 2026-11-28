/* Carte de chapitre « الباب الموالي » · PC 3AC · L'énergie (cinétique, puissance, énergie électrique).
   Les portes renvoient aux leçons Pro (pro.taalim.men/lecons/…), qui restent toujours ouvertes.
   Valeurs vérifiées par test/verif-pc-3ac-energie.mjs. */
window.BAB_CHAPTER = {
  id: 'pc-3ac-energie',
  storageKey: 'bab_mowali_pc3ac_energie_v1',
  title: 'La porte suivante', titleAr: 'الباب الموالي',
  kicker: 'PC · 3AC · L’énergie',
  kickerAr: 'الفيزياء والكيمياء · الثالثة إعدادي · الطاقة',
  levelLabel: 'Les 3APIC ensemble', levelLabelAr: 'تلاميذ الثالثة إعدادي معا',
  courseBase: 'https://pro.taalim.men/lecons/',
  chestCourse: '',
  endpoint: 'https://relay.taalim.men/api/bab',  /* actif seulement depuis une origine autorisée (pro.taalim.men…) avec ?cls=3APIC */
  sim: { donePct: [76, 48, 22], stuck: [1, 3, 0] },
  bonusAt: 70, alertMin: 3,
  ill: (function(){ var W='viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"',
    T=function(x,y,t){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="#aaa3bf" font-size="11" font-family="Figtree">'+t+'</text>'},
    car=function(x,c){return '<g transform="translate('+x+' 0)"><path d="M0 104 q2 -16 18 -18 l14 -14 h34 l16 14 q16 2 18 18 v8 h-100 z" fill="'+c+'"/><rect x="34" y="76" width="14" height="10" rx="2" fill="#161320"/><rect x="52" y="76" width="14" height="10" rx="2" fill="#161320"/><circle cx="22" cy="112" r="9" fill="#161320" stroke="#aaa3bf" stroke-width="2"/><circle cx="80" cy="112" r="9" fill="#161320" stroke="#aaa3bf" stroke-width="2"/></g>'};
    return {
 route:'<svg class="illu" '+W+'><rect x="0" y="120" width="320" height="40" fill="#1e1a2b"/>'+
  [0,1,2,3,4,5].map(function(i){return '<rect x="'+(8+i*54)+'" y="138" width="30" height="4" rx="2" fill="#2f2942"/>'}).join('')+
  car(20,'#6ccdb6')+'<rect x="122" y="118" width="40" height="3" rx="1.5" fill="#f2eff9" fill-opacity=".35"/>'+
  '<text x="72" y="62" text-anchor="middle" fill="#6ccdb6" font-size="13" font-weight="700" font-family="Figtree">50 km/h</text>'+
  '<rect x="122" y="128" width="168" height="3" rx="1.5" fill="#f27b60" fill-opacity=".7"/><text x="206" y="62" text-anchor="middle" fill="#f27b60" font-size="13" font-weight="700" font-family="Figtree">100 km/h</text>'+
  '<text x="142" y="112" text-anchor="middle" fill="#f2eff9" font-size="11" font-family="Figtree">×1</text><text x="290" y="112" text-anchor="middle" fill="#f27b60" font-size="12" font-weight="700" font-family="Figtree">×4 ?</text>'+
  T(160,156,'traces de freinage')+'</svg>',
 prise:'<svg class="illu" '+W+'><rect x="0" y="134" width="320" height="26" fill="#1e1a2b"/>'+
  '<rect x="40" y="108" width="240" height="22" rx="8" fill="#2f2942"/>'+[70,130,190,250].map(function(x){return '<circle cx="'+x+'" cy="119" r="6" fill="#161320"/>'}).join('')+
  '<path d="M70 108 V86 M130 108 V80 M190 108 V84" stroke="#aaa3bf" stroke-width="3"/>'+
  '<rect x="50" y="52" width="40" height="34" rx="8" fill="#9b92dc"/><path d="M90 60 q12 6 0 18" fill="none" stroke="#9b92dc" stroke-width="4"/>'+
  '<rect x="110" y="44" width="40" height="36" rx="4" fill="#f27b60" fill-opacity=".8"/>'+[118,126,134,142].map(function(x){return '<line x1="'+x+'" y1="50" x2="'+x+'" y2="74" stroke="#161320" stroke-width="2"/>'}).join('')+
  '<path d="M170 84 h40 l-6 -22 h-28 z" fill="#ffcf5c" fill-opacity=".8"/>'+
  '<path d="M236 40 l-10 18 h10 l-8 18" fill="none" stroke="#ffcf5c" stroke-width="4" stroke-linejoin="round"/>'+
  '<text x="70" y="44" text-anchor="middle" fill="#f2eff9" font-size="11" font-family="Figtree">2000 W</text><text x="130" y="36" text-anchor="middle" fill="#f2eff9" font-size="11" font-family="Figtree">2000 W</text><text x="190" y="56" text-anchor="middle" fill="#f2eff9" font-size="11" font-family="Figtree">1500 W</text>'+
  T(160,152,'une seule multiprise · disjoncteur 16 A')+'</svg>',
 compteur:'<svg class="illu" '+W+'><rect x="0" y="134" width="320" height="26" fill="#1e1a2b"/>'+
  '<path d="M44 130 h56 l-6 -52 h-44 z" fill="#9b92dc"/><path d="M94 88 q16 4 4 26" fill="none" stroke="#9b92dc" stroke-width="5"/><rect x="58" y="70" width="28" height="8" rx="3" fill="#2f2942"/>'+
  '<text x="72" y="58" text-anchor="middle" fill="#f2eff9" font-size="12" font-weight="700" font-family="Figtree">2000 W · 3 min</text>'+
  '<circle cx="236" cy="78" r="22" fill="#ffcf5c" fill-opacity=".85"/><rect x="226" y="98" width="20" height="16" rx="3" fill="#aaa3bf"/><line x1="236" y1="114" x2="236" y2="130" stroke="#aaa3bf" stroke-width="3"/>'+
  '<text x="236" y="44" text-anchor="middle" fill="#f2eff9" font-size="12" font-weight="700" font-family="Figtree">10 W · 10 h</text>'+
  '<text x="160" y="92" text-anchor="middle" fill="#f27b60" font-size="26" font-weight="700" font-family="Figtree">?</text>'+
  T(72,152,'bouilloire')+T(236,152,'lampe LED')+'</svg>',
 voiture:'<svg class="illu" '+W+'><rect x="0" y="120" width="320" height="40" fill="#1e1a2b"/>'+car(40,'#6ccdb6')+
  '<path d="M150 98 h18" stroke="#f2eff9" stroke-width="2" stroke-dasharray="3 4"/><text x="98" y="62" text-anchor="middle" fill="#6ccdb6" font-size="13" font-weight="700" font-family="Figtree">1500 kg · 72 km/h</text>'+
  '<rect x="214" y="56" width="44" height="64" rx="6" fill="#2f2942"/><rect x="222" y="66" width="28" height="16" rx="2" fill="#161320"/><text x="236" y="78" text-anchor="middle" fill="#ffcf5c" font-size="9" font-family="Figtree">2300 W</text>'+
  '<path d="M236 120 q0 14 -30 10 q-30 -4 -46 -18" fill="none" stroke="#ffcf5c" stroke-width="3"/>'+
  '<text x="236" y="104" text-anchor="middle" fill="#f27b60" font-size="22" font-weight="700" font-family="Figtree">?</text>'+T(160,152,'la borne de recharge')+'</svg>'
}; })(),
  doors: [
{id:'pc-3ac-energie-cinetique',title:'L’énergie cinétique',ar:'الطاقة الحركية',ill:'route',
 hook:'À 50 km/h, une voiture freine sur environ 14 m. À 100 km/h, ce n’est pas 28 m mais plus de 55 m. Pourquoi quatre fois plus et pas deux ?',
 hookAr:'بسرعة 50 km/h تتوقف السيارة بعد حوالي 14 m من الكبح. وبسرعة 100 km/h ليست 28 m بل أكثر من 55 m. لماذا أربع مرات وليس مرتين؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'L’énergie cinétique s’exprime en joules (J).',v:true,h:'Toutes les énergies se mesurent en joules dans le système international.'},
   {s:'Une voiture garée possède une énergie cinétique.',v:false,h:'Cinétique veut dire « liée au mouvement ». À l’arrêt, v = 0.'},
   {s:'L’énergie cinétique dépend de la masse et de la vitesse.',v:true,h:'Un camion et une moto à la même vitesse ne s’arrêtent pas pareil.'}]},
  {t:'num',title:'Exercice',q:'Une voiture de 1000 kg roule à 10 m/s. Calcule son énergie cinétique Ec = ½ · m · v² en joules.',
   ans:50000,tol:1,unit:'J',ph:'Ec en J',h:'Commence par v² = 10 × 10 = 100, puis ½ × 1000 × 100.'},
  {t:'qcm',title:'Je fais seul',q:'Si la vitesse d’une voiture double, son énergie cinétique est multipliée par :',
   o:['2','4','8'],a:1,h:'Dans Ec = ½ · m · v², la vitesse est au carré : (2v)² = 4v².'}],
 reveal:'Ec = ½ · m · v² : la vitesse compte au carré. À 100 km/h la voiture a 4 fois plus d’énergie qu’à 50 km/h, et les freins doivent dissiper 4 fois plus : la distance de freinage est environ 4 fois plus longue.',
 revealAr:'Ec = ½ · m · v²: السرعة مرفوعة إلى المربع. بسرعة 100 km/h تملك السيارة طاقة أكبر بأربع مرات منها بسرعة 50 km/h، والفرامل تبدد أربع مرات أكثر، فتصير مسافة الكبح أطول بحوالي أربع مرات.',
 cliff:'Bouilloire, radiateur et fer à repasser sur la même multiprise : pourquoi le disjoncteur saute-t-il d’un coup ?',
 cliffAr:'غلاية ومدفأة ومكواة على نفس المشترك: لماذا ينقطع التيار فجأة؟'},
{id:'pc-3ac-puissance-electrique',title:'La puissance électrique',ar:'القدرة الكهربائية',ill:'prise',
 key:{q:'Quelle formule donne l’énergie cinétique ?',o:['Ec = m · v','Ec = ½ · m · v²','Ec = 2 · m · v'],a:1,h:'La vitesse est au carré, et il y a un demi.'},
 hook:'Bouilloire 2000 W, radiateur 2000 W et fer 1500 W, tous sur une seule multiprise. Clac : le disjoncteur de 16 A coupe tout. Qu’est-ce qui l’a fait sauter ?',
 hookAr:'غلاية 2000 W ومدفأة 2000 W ومكواة 1500 W، كلها على مشترك واحد. فجأة يقطع القاطع ذو 16 A التيار. ما الذي جعله ينقطع؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'La puissance électrique s’exprime en watts (W).',v:true,h:'C’est le nombre écrit sur l’étiquette : 2000 W, 60 W…'},
   {s:'En courant continu ou pour un appareil chauffant : P = U × I.',v:true,h:'Puissance = tension × intensité.'},
   {s:'Une lampe de 10 W est plus puissante qu’un radiateur de 2000 W.',v:false,h:'Compare les nombres en watts : 10 contre 2000.'}]},
  {t:'sort',title:'Exercice',q:'Classe chaque appareil selon sa puissance habituelle. Touche un appareil, puis une catégorie.',
   bins:['Moins de 100 W','Plus de 1000 W'],items:[['Lampe LED',0],['Chargeur de téléphone',0],['Ordinateur portable',0],['Bouilloire',1],['Four électrique',1],['Radiateur',1]],
   h:'Les appareils qui chauffent sont les plus gourmands.'},
  {t:'num',title:'Je fais seul',q:'Une bouilloire de 2000 W est branchée sur 220 V. Calcule l’intensité I = P / U en ampères (arrondie au centième).',
   ans:9.09,tol:0.02,unit:'A',ph:'I en A',h:'Divise 2000 par 220.'}],
 reveal:'Les puissances s’additionnent : 2000 + 2000 + 1500 = 5500 W. Avec P = U × I, I = 5500 ÷ 220 = 25 A, plus que les 16 A du disjoncteur. Il coupe pour éviter que les fils chauffent.',
 revealAr:'القدرات تُجمع: 2000 + 2000 + 1500 = 5500 W. ومن P = U × I نجد I = 5500 ÷ 220 = 25 A، أكبر من 16 A التي يتحملها القاطع، فيقطع التيار حتى لا تسخن الأسلاك.',
 cliff:'La bouilloire est très puissante mais ne chauffe que 3 minutes. Consomme-t-elle plus que la lampe allumée toute la nuit ?',
 cliffAr:'الغلاية قوية جدا لكنها لا تشتغل إلا 3 دقائق. هل تستهلك أكثر من مصباح مشتعل طول الليل؟'},
{id:'pc-3ac-energie-electrique',title:'L’énergie électrique consommée',ar:'الطاقة الكهربائية المستهلكة',ill:'compteur',
 key:{q:'Quelle relation lie puissance, tension et intensité ?',o:['P = U × I','P = U / I','P = U + I'],a:0,h:'Tu as calculé 5500 ÷ 220 pour trouver I.'},
 hook:'Une bouilloire de 2000 W pendant 3 minutes, une lampe LED de 10 W pendant 10 heures. Laquelle fait le plus tourner le compteur ?',
 hookAr:'غلاية 2000 W لمدة 3 دقائق، ومصباح LED قدرته 10 W لمدة 10 ساعات. أيهما يجعل العداد يدور أكثر؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'L’énergie consommée se calcule par E = P × t.',v:true,h:'Plus l’appareil est puissant et plus il fonctionne longtemps, plus il consomme.'},
   {s:'Le kilowattheure (kWh) est une unité d’énergie.',v:true,h:'C’est l’unité du compteur et de la facture : 1 kWh = 1000 W pendant 1 h.'},
   {s:'Le watt (W) est une unité d’énergie.',v:false,h:'Le watt mesure une puissance, c’est-à-dire une énergie par seconde.'}]},
  {t:'num',title:'Exercice',q:'Un radiateur de 1500 W fonctionne pendant 2 heures. Calcule l’énergie consommée en kWh.',
   ans:3,tol:0.01,unit:'kWh',ph:'E en kWh',h:'1500 W = 1,5 kW, puis 1,5 × 2.'},
  {t:'qcm',title:'Je fais seul',q:'Bouilloire 2000 W pendant 3 min (0,05 h) et lampe 10 W pendant 10 h :',
   o:['la bouilloire consomme plus','la lampe consomme plus','elles consomment autant'],a:2,h:'Calcule E = P × t pour chacune, en Wh.'}],
 reveal:'Bouilloire : 2000 W × 0,05 h = 100 Wh. Lampe : 10 W × 10 h = 100 Wh. Autant ! La puissance dit à quelle vitesse on consomme, l’énergie E = P × t dit combien on a consommé au total. Le compteur compte l’énergie, en kWh.',
 revealAr:'الغلاية: 2000 W × 0,05 h = 100 Wh. المصباح: 10 W × 10 h = 100 Wh. نفس الاستهلاك! القدرة تقول بأي سرعة نستهلك، والطاقة E = P × t تقول كم استهلكنا في المجموع. والعداد يحسب الطاقة بالـ kWh.',
 cliff:'Une voiture électrique lancée sur la route : combien de temps de recharge vaut son énergie de mouvement ?',
 cliffAr:'سيارة كهربائية منطلقة على الطريق: كم من وقت الشحن تساوي طاقة حركتها؟'},
{id:'defi-regional',chest:true,title:'Coffre : le défi du régional',ar:'الصندوق: تحدي الامتحان الجهوي',ill:'voiture',
 key:{q:'Quelle unité trouve-t-on sur la facture d’électricité ?',o:['Le watt (W)','Le kilowattheure (kWh)','L’ampère (A)'],a:1,h:'C’est une unité d’énergie, pas de puissance.'},
 hook:'Une voiture électrique de 1500 kg roule à 72 km/h. Sa borne de recharge fournit 2300 W. Combien de temps de recharge faut-il pour lui rendre toute son énergie cinétique ? Indice : convertis d’abord la vitesse en m/s.',
 hookAr:'سيارة كهربائية كتلتها 1500 kg تسير بسرعة 72 km/h. نقطة الشحن تعطي 2300 W. كم من الوقت يلزم من الشحن لتعويض كل طاقتها الحركية؟ تلميح: حوّل السرعة أولا إلى m/s.'}
  ],
  audio: ['audio/pc3ac-bab1.mp3','audio/pc3ac-bab2.mp3','audio/pc3ac-bab3.mp3','audio/pc3ac-sandouq.mp3']
};
