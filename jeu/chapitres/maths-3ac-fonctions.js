/* Carte de chapitre « الباب الموالي » · Maths 3AC · Les fonctions (linéaire, affine, systèmes).
   Les portes renvoient aux leçons Pro (pro.taalim.men/lecons/…), toujours ouvertes.
   Valeurs vérifiées par test/verif-maths-3ac-fonctions.mjs. Réponses numériques positives (clavier décimal du téléphone sans signe moins). */
window.BAB_CHAPTER = {
  id: 'maths-3ac-fonctions',
  storageKey: 'bab_mowali_maths3ac_fonctions_v1',
  title: 'La porte suivante', titleAr: 'الباب الموالي',
  kicker: 'Maths · 3AC · Les fonctions',
  kickerAr: 'الرياضيات · الثالثة إعدادي · الدوال',
  levelLabel: 'Les 3APIC ensemble', levelLabelAr: 'تلاميذ الثالثة إعدادي معا',
  courseBase: 'https://pro.taalim.men/lecons/',
  chestCourse: '',
  endpoint: 'https://relay.taalim.men/api/bab',  /* actif seulement depuis une origine autorisée (pro.taalim.men…) avec ?cls=3APIC */
  sim: { donePct: [80, 52, 27], stuck: [0, 3, 1] },
  bonusAt: 70, alertMin: 3,
  ill: (function(){ var W='viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"',
    T=function(x,y,t,c,s,w){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="'+(c||'#aaa3bf')+'" font-size="'+(s||11)+'"'+(w?' font-weight="700"':'')+' font-family="Figtree">'+t+'</text>'};
    return {
 souk:'<svg class="illu" '+W+'><rect x="0" y="128" width="320" height="32" fill="#1e1a2b"/><rect x="30" y="104" width="260" height="24" rx="4" fill="#2f2942"/>'+
  [[70,3],[160,6],[250,1.5]].map(function(p){var n=p[1]===1.5?2:p[1]===3?3:5,s='';for(var k=0;k<n;k++)s+='<circle cx="'+(p[0]-((n-1)*7)+k*14)+'" cy="92" r="8" fill="#ffcf5c" fill-opacity=".9"/>';
   return s+T(p[0],66,String(p[1]).replace('.',',')+' kg','#f2eff9',12,1)}).join('')+
  T(70,48,'18 DH','#6ccdb6',13,1)+T(160,48,'36 DH','#6ccdb6',13,1)+T(250,48,'9 DH','#6ccdb6',13,1)+
  T(160,150,'sans calculatrice ?')+'</svg>',
 taxi:'<svg class="illu" '+W+'><rect x="0" y="122" width="320" height="38" fill="#1e1a2b"/>'+
  '<g transform="translate(36 0)"><path d="M0 108 q2 -16 18 -18 l14 -14 h40 l16 14 q16 2 18 18 v8 h-106 z" fill="#ffcf5c" fill-opacity=".85"/><rect x="40" y="62" width="26" height="10" rx="2" fill="#f27b60"/>'+
  '<circle cx="24" cy="116" r="9" fill="#161320" stroke="#aaa3bf" stroke-width="2"/><circle cx="84" cy="116" r="9" fill="#161320" stroke="#aaa3bf" stroke-width="2"/></g>'+
  '<rect x="184" y="40" width="108" height="64" rx="8" fill="#2f2942"/>'+T(238,62,'2 km → 13 DH','#f2eff9',12,1)+T(238,82,'4 km → 21 DH','#f2eff9',12,1)+T(238,98,'pas 26 ?','#f27b60',11,1)+
  T(160,150,'5 DH à la montée, puis 4 DH par km')+'</svg>',
 droites:'<svg class="illu" '+W+'><rect x="0" y="0" width="320" height="160" fill="none"/>'+
  '<line x1="40" y1="140" x2="300" y2="140" stroke="#aaa3bf" stroke-width="1.5"/><line x1="40" y1="140" x2="40" y2="14" stroke="#aaa3bf" stroke-width="1.5"/>'+
  '<line x1="40" y1="118" x2="290" y2="22" stroke="#ffcf5c" stroke-width="3"/><line x1="40" y1="98" x2="290" y2="34" stroke="#6ccdb6" stroke-width="3"/>'+
  T(276,18,'A','#ffcf5c',13,1)+T(296,48,'B','#6ccdb6',13,1)+'<circle cx="180" cy="62" r="7" fill="none" stroke="#f27b60" stroke-width="2.5"/>'+T(180,46,'?','#f27b60',18,1)+
  T(170,156,'km')+T(24,20,'DH')+'</svg>',
 cinema:'<svg class="illu" '+W+'><rect x="0" y="130" width="320" height="30" fill="#1e1a2b"/>'+
  [[34,'#9b92dc','adulte'],[76,'#9b92dc','adulte'],[118,'#9b92dc','adulte'],[176,'#6ccdb6','enfant'],[218,'#6ccdb6','enfant']].map(function(t){return '<g transform="translate('+t[0]+' 46) rotate(-6)"><rect width="36" height="56" rx="5" fill="'+t[1]+'" fill-opacity=".85"/><circle cx="18" cy="0" r="5" fill="#161320"/>'+'<text x="18" y="34" text-anchor="middle" fill="#161320" font-size="9" font-weight="700" font-family="Figtree">'+t[2]+'</text></g>'}).join('')+
  T(278,74,'= 130 DH','#f2eff9',14,1)+T(160,124,'et 2 adultes + 4 enfants = 140 DH','#f2eff9',12)+T(160,152,'prix de chaque ticket ?','#f27b60',12,1)+'</svg>'
}; })(),
  doors: [
{id:'maths-3ac-fonction-lineaire',title:'La fonction linéaire',ar:'الدالة الخطية',ill:'souk',
 hook:'Au souk, 3 kg d’oranges coûtent 18 DH. Le vendeur annonce aussitôt : 6 kg, 36 DH ; 1,5 kg, 9 DH. Sans calculatrice. Quel est son secret ?',
 hookAr:'في السوق، 3 kg من البرتقال بـ 18 DH. يقول البائع فورا: 6 kg بـ 36 DH، و 1,5 kg بـ 9 DH، دون آلة حاسبة. ما سره؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'Une fonction linéaire s’écrit f(x) = a × x.',v:true,h:'Un seul nombre a, qu’on multiplie par x.'},
   {s:'La droite d’une fonction linéaire passe par l’origine du repère.',v:true,h:'f(0) = a × 0 = 0.'},
   {s:'f(x) = 2x + 1 est une fonction linéaire.',v:false,h:'Le « + 1 » empêche f(0) de valoir 0.'}]},
  {t:'num',title:'Exercice',q:'f est une fonction linéaire et f(4) = 10. Calcule son coefficient a.',
   ans:2.5,tol:0.001,unit:'',ph:'a = …',h:'f(4) = a × 4 = 10, donc a = 10 ÷ 4.'},
  {t:'qcm',title:'Je fais seul',q:'Pour f(x) = −3x, l’image de −2 est :',
   o:['6','−6','−5'],a:0,h:'(−3) × (−2) : deux nombres négatifs donnent un produit positif.'}],
 reveal:'Le prix est f(x) = 6x : une fonction linéaire de coefficient 6, le prix d’un kilo (18 ÷ 3). Masse doublée, prix doublé ; f(0) = 0, sa droite passe par l’origine.',
 revealAr:'الثمن هو f(x) = 6x: دالة خطية معاملها 6، أي ثمن الكيلوغرام (18 ÷ 3). إذا تضاعفت الكتلة تضاعف الثمن، و f(0) = 0 فمستقيمها يمر من أصل المعلم.',
 cliff:'Un taxi : 5 DH à la montée, puis 4 DH par km. 2 km, 13 DH ; 4 km, 21 DH et non 26. Pourquoi le double de kilomètres ne double-t-il plus le prix ?',
 cliffAr:'طاكسي: 5 DH عند الركوب، ثم 4 DH لكل km. مسافة 2 km بـ 13 DH، و 4 km بـ 21 DH وليس 26. لماذا لم يعد ضعف المسافة يضاعف الثمن؟'},
{id:'maths-3ac-fonction-affine',title:'La fonction affine',ar:'الدالة التآلفية',ill:'taxi',
 key:{q:'Une fonction linéaire s’écrit :',o:['f(x) = a × x + b','f(x) = a × x','f(x) = x + a'],a:1,h:'Pas de nombre ajouté : le prix des oranges était 6 × masse.'},
 hook:'Au compteur du taxi : 5 DH dès la montée, puis 4 DH par kilomètre. 2 km coûtent 13 DH, mais 4 km coûtent 21 DH, pas 26. Où est passée la proportionnalité ?',
 hookAr:'في عداد الطاكسي: 5 DH منذ الركوب، ثم 4 DH لكل كيلومتر. 2 km بـ 13 DH، لكن 4 km بـ 21 DH وليس 26. أين ذهبت التناسبية؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'Une fonction affine s’écrit f(x) = a × x + b.',v:true,h:'a multiplie x, puis on ajoute b.'},
   {s:'Une fonction linéaire est une fonction affine avec b = 0.',v:true,h:'f(x) = a × x + 0.'},
   {s:'Pour toute fonction affine, f(2x) = 2 × f(x).',v:false,h:'Essaie avec le taxi : f(4) = 21, mais 2 × f(2) = 26.'}]},
  {t:'num',title:'Exercice',q:'f est affine, f(1) = 7 et f(3) = 13. Calcule son coefficient a.',
   ans:3,tol:0.001,unit:'',ph:'a = …',h:'a = (13 − 7) ÷ (3 − 1).'},
  {t:'qcm',title:'Je fais seul',q:'Pour f(x) = 4x + 5, quel nombre x a pour image 25 ?',
   o:['5','7,5','4'],a:0,h:'Résous 4x + 5 = 25 : 4x = 20.'}],
 reveal:'Le prix est f(x) = 4x + 5 : une fonction affine, a = 4 (prix d’un km), b = 5 (la prise en charge). Les 5 DH ne se doublent pas : 2 × 13 = 26, mais f(4) = 21. Et a = (21 − 13) ÷ (4 − 2) = 4.',
 revealAr:'الثمن هو f(x) = 4x + 5: دالة تآلفية، a = 4 (ثمن الكيلومتر) و b = 5 (ثمن الركوب). الـ 5 DH لا تتضاعف: 2 × 13 = 26 بينما f(4) = 21. و a = (21 − 13) ÷ (4 − 2) = 4.',
 cliff:'Deux taxis : A prend 5 DH + 4 DH/km, B prend 11 DH + 3 DH/km. À partir de combien de kilomètres B devient-il le moins cher ?',
 cliffAr:'طاكسيان: A يأخذ 5 DH + 4 DH لكل km، و B يأخذ 11 DH + 3 DH لكل km. ابتداء من كم كيلومترا يصبح B أرخص؟'},
{id:'maths-3ac-systemes',title:'Les systèmes de deux équations',ar:'نظمة معادلتين',ill:'droites',
 key:{q:'Pour f(x) = 4x + 5, le nombre 5 est :',o:['le coefficient','l’ordonnée à l’origine','le prix d’un km'],a:1,h:'C’est f(0) : le prix avant le premier kilomètre.'},
 hook:'Taxi A : 5 DH + 4 DH par km. Taxi B : 11 DH + 3 DH par km. Pour un court trajet A gagne, pour un long trajet B gagne. À quelle distance coûtent-ils exactement pareil ?',
 hookAr:'الطاكسي A: 5 DH + 4 DH لكل km. الطاكسي B: 11 DH + 3 DH لكل km. في مسافة قصيرة A أرخص، وفي مسافة طويلة B أرخص. في أي مسافة يتساوى الثمنان بالضبط؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'Résoudre un système de deux équations, c’est trouver le couple (x ; y) qui vérifie les deux.',v:true,h:'Les deux équations doivent être vraies en même temps.'},
   {s:'Graphiquement, la solution est le point d’intersection des deux droites.',v:true,h:'Le point commun aux deux droites vérifie les deux équations.'},
   {s:'Deux droites parallèles donnent toujours une solution.',v:false,h:'Des droites parallèles distinctes ne se croisent jamais.'}]},
  {t:'order',title:'Exercice',q:'Range les étapes de la méthode par substitution.',
   items:['Isoler y dans une équation','Remplacer y dans l’autre équation','Résoudre l’équation en x','Calculer y avec la valeur de x'],
   h:'On ne peut calculer y qu’après avoir trouvé x.'},
  {t:'num',title:'Je fais seul',q:'Résous le système y = 4x + 5 et y = 3x + 11. Donne la valeur de x.',
   ans:6,tol:0.001,unit:'',ph:'x = …',h:'Les deux y sont égaux : 4x + 5 = 3x + 11.'}],
 reveal:'4x + 5 = 3x + 11 donne x = 6, puis y = 4 × 6 + 5 = 29. À 6 km, les deux taxis coûtent 29 DH : c’est le point d’intersection (6 ; 29) des deux droites. Au-delà, B, dont la pente est plus faible, devient le moins cher.',
 revealAr:'4x + 5 = 3x + 11 تعطي x = 6، ثم y = 4 × 6 + 5 = 29. في 6 km يكلف الطاكسيان 29 DH: هذه نقطة تقاطع المستقيمين (6 ; 29). وبعدها يصبح B أرخص لأن ميله أصغر.',
 cliff:'Et quand deux prix inconnus se cachent dans un même problème de tickets de cinéma ?',
 cliffAr:'وماذا لو اختبأ ثمنان مجهولان في نفس مسألة تذاكر السينما؟'},
{id:'defi-regional',chest:true,title:'Coffre : le défi du régional',ar:'الصندوق: تحدي الامتحان الجهوي',ill:'cinema',
 key:{q:'La solution graphique d’un système de deux équations est :',o:['l’origine du repère','le point d’intersection des deux droites','la pente la plus forte'],a:1,h:'C’est là que les deux taxis coûtaient 29 DH.'},
 hook:'Au cinéma, 3 tickets adultes et 2 tickets enfants coûtent 130 DH. 2 tickets adultes et 4 tickets enfants coûtent 140 DH. Combien coûte chaque ticket ? Indice : appelle a et e les deux prix, puis isole a dans la deuxième équation.',
 hookAr:'في السينما، 3 تذاكر للكبار و 2 للأطفال بـ 130 DH. و 2 تذاكر للكبار و 4 للأطفال بـ 140 DH. كم ثمن كل تذكرة؟ تلميح: سمّ الثمنين a و e، ثم اعزل a في المعادلة الثانية.'}
  ],
  audio: ['audio/m3ac-bab1.mp3','audio/m3ac-bab2.mp3','audio/m3ac-bab3.mp3','audio/m3ac-sandouq.mp3']
};
