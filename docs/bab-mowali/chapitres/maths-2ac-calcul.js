/* Carte de chapitre « الباب الموالي » · Maths 2AC · Le calcul (puissances, calcul littéral, équations).
   Portes 1 et 3 : leçons Pro. Porte 2 et coffre : leçons du site public maths.taalim.men (pas encore de leçon Pro), via « url ».
   Valeurs vérifiées par test/verif-maths-2ac-calcul.mjs. Réponses numériques positives. */
window.BAB_CHAPTER = {
  id: 'maths-2ac-calcul',
  storageKey: 'bab_mowali_maths2ac_calcul_v1',
  title: 'La porte suivante', titleAr: 'الباب الموالي',
  kicker: 'Maths · 2AC · Le calcul',
  kickerAr: 'الرياضيات · الثانية إعدادي · الحساب',
  levelLabel: 'Les 2APIC ensemble', levelLabelAr: 'تلاميذ الثانية إعدادي معا',
  courseBase: 'https://pro.taalim.men/lecons/',
  chestCourse: 'La proportionnalité',
  endpoint: 'https://relay.taalim.men/api/bab',  /* actif seulement depuis une origine autorisée (pro.taalim.men…) avec ?cls=2APIC */
  sim: { donePct: [83, 51, 26], stuck: [0, 3, 0] },
  bonusAt: 70, alertMin: 3,
  ill: (function(){ var W='viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"',
    T=function(x,y,t,c,s,w){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="'+(c||'#aaa3bf')+'" font-size="'+(s||11)+'"'+(w?' font-weight="700"':'')+' font-family="Figtree">'+t+'</text>'};
    return {
 bacteries:'<svg class="illu" '+W+'>'+
  [[1,40],[2,90],[4,140],[8,190]].map(function(c,k){var s='';for(var i=0;i<c[0];i++){var y=80+(i-(c[0]-1)/2)*10.5;s+='<ellipse cx="'+c[1]+'" cy="'+y+'" rx="8" ry="4.5" fill="#6ccdb6" fill-opacity=".85"/>'}return s+T(c[1],140,k*20+' min','#aaa3bf',10)}).join('')+
  T(240,84,'…','#f2eff9',22,1)+T(282,74,'3 h','#f2eff9',13,1)+T(282,96,'? bactéries','#f27b60',13,1)+T(160,18,'chaque bactérie se divise en deux toutes les 20 min','#f2eff9',11)+'</svg>',
 jardin:'<svg class="illu" '+W+'>'+
  '<rect x="90" y="30" width="80" height="80" fill="#6ccdb6" fill-opacity=".55" stroke="#6ccdb6" stroke-width="2"/>'+T(130,74,'x²','#161320',16,1)+
  '<rect x="170" y="30" width="44" height="80" fill="#9b92dc" fill-opacity=".45" stroke="#9b92dc" stroke-width="2"/>'+
  '<rect x="90" y="110" width="80" height="30" fill="#ffcf5c" fill-opacity=".45" stroke="#ffcf5c" stroke-width="2"/>'+
  '<rect x="170" y="110" width="44" height="30" fill="#f27b60" fill-opacity=".45" stroke="#f27b60" stroke-width="2"/>'+
  T(130,22,'x','#f2eff9',12,1)+T(192,22,'3','#f2eff9',12,1)+T(78,74,'x','#f2eff9',12,1)+T(78,130,'2','#f2eff9',12,1)+T(266,84,'aire = ?','#f27b60',14,1)+'</svg>',
 velos:'<svg class="illu" '+W+'><rect x="0" y="134" width="320" height="26" fill="#1e1a2b"/>'+
  [[70,'#ffcf5c','A'],[230,'#6ccdb6','B']].map(function(v){var x=v[0];return '<circle cx="'+(x-22)+'" cy="112" r="16" fill="none" stroke="'+v[1]+'" stroke-width="3"/><circle cx="'+(x+22)+'" cy="112" r="16" fill="none" stroke="'+v[1]+'" stroke-width="3"/><path d="M'+(x-22)+' 112 L'+(x-4)+' 88 L'+(x+16)+' 88 L'+(x+22)+' 112 M'+(x-4)+' 88 L'+x+' 112 L'+(x-22)+' 112" fill="none" stroke="'+v[1]+'" stroke-width="3"/>'+T(x,70,v[2],v[1],16,1)}).join('')+
  T(70,40,'10 DH + 4 DH/h','#f2eff9',12,1)+T(230,40,'25 DH + 1 DH/h','#f2eff9',12,1)+T(150,92,'= ?','#f27b60',16,1)+'</svg>',
 recette:'<svg class="illu" '+W+'><rect x="0" y="136" width="320" height="24" fill="#1e1a2b"/>'+
  '<path d="M60 96 h80 q-6 38 -40 38 q-34 0 -40 -38 z" fill="#9b92dc" fill-opacity=".8"/><ellipse cx="100" cy="96" rx="40" ry="8" fill="#f2eff9" fill-opacity=".8"/>'+
  T(100,72,'4 personnes : 300 g','#f2eff9',12,1)+'<path d="M160 100 h36" stroke="#aaa3bf" stroke-width="2"/><path d="M196 95 l8 5 l-8 5 z" fill="#aaa3bf"/>'+
  T(256,78,'6 personnes','#f2eff9',13,1)+T(256,100,'302 g ? 450 g ?','#f27b60',13,1)+'</svg>'
}; })(),
  doors: [
{id:'maths-2ac-puissances',title:'Les puissances',ar:'القوى',ill:'bacteries',
 hook:'Une bactérie se divise en deux toutes les 20 minutes. On part d’une seule bactérie. Combien sont-elles au bout de 3 heures ?',
 hookAr:'بكتيريا تنقسم إلى اثنتين كل 20 دقيقة. ننطلق من بكتيريا واحدة. كم يصبح عددها بعد 3 ساعات؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'2⁵ = 2 × 5.',v:false,h:'2⁵ = 2 × 2 × 2 × 2 × 2 = 32.'},
   {s:'a³ × a² = a⁵.',v:true,h:'On ajoute les exposants : 3 + 2.'},
   {s:'10⁻² = 0,01.',v:true,h:'10⁻² = 1 ÷ 10² = 1 ÷ 100.'}]},
  {t:'num',title:'Exercice',q:'Calcule 3⁴.',
   ans:81,tol:0.01,unit:'',ph:'3⁴ = …',h:'3 × 3 × 3 × 3.'},
  {t:'qcm',title:'Je fais seul',q:'10³ × 10⁴ est égal à :',
   o:['10⁷','10¹²','100⁷'],a:0,h:'Même base 10 : on ajoute les exposants.'}],
 reveal:'3 heures = 180 minutes = 9 périodes de 20 minutes. À chaque période, le nombre double : 2 × 2 × … neuf fois, soit 2⁹ = 512 bactéries. Une puissance compte une multiplication répétée.',
 revealAr:'3 ساعات = 180 دقيقة = 9 فترات من 20 دقيقة. في كل فترة يتضاعف العدد: 2 × 2 × … تسع مرات، أي 2⁹ = 512 بكتيريا. القوة تحسب ضربا متكررا.',
 cliff:'Un jardin carré de côté x est agrandi de 3 m d’un côté et de 2 m de l’autre. Comment écrire sa nouvelle aire sans connaître x ?',
 cliffAr:'حديقة مربعة طول ضلعها x كُبّرت بـ 3 m من جهة و 2 m من الجهة الأخرى. كيف نكتب مساحتها الجديدة دون معرفة x؟'},
{id:'2ac-calcul-litteral',url:'https://maths.taalim.men/2ac-calcul-litteral/',title:'Le calcul littéral',ar:'الحساب الحرفي',ill:'jardin',
 key:{q:'2⁹ est égal à :',o:['18','512','81'],a:1,h:'Le nombre de bactéries après 3 heures.'},
 hook:'Un jardin carré de côté x mètres est agrandi de 3 m d’un côté et de 2 m de l’autre. Quatre rectangles forment le nouveau jardin. Comment écrire son aire, pour n’importe quel x ?',
 hookAr:'حديقة مربعة طول ضلعها x مترا كُبّرت بـ 3 m من جهة و 2 m من الجهة الأخرى. أربعة مستطيلات تكوّن الحديقة الجديدة. كيف نكتب مساحتها مهما كان x؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'k(a + b) = ka + kb.',v:true,h:'C’est la distributivité : k multiplie chaque terme.'},
   {s:'(x + 3)(x + 2) = x² + 5x + 6.',v:true,h:'x² + 2x + 3x + 6.'},
   {s:'3x + 2x = 5x².',v:false,h:'On additionne des x : 3x + 2x = 5x.'}]},
  {t:'num',title:'Exercice',q:'Pour x = 4, calcule l’aire (x + 3)(x + 2), en m².',
   ans:42,tol:0.01,unit:'m²',ph:'en m²',h:'(4 + 3) × (4 + 2) = 7 × 6.'},
  {t:'qcm',title:'Je fais seul',q:'Développe 4(x − 2) :',
   o:['4x − 8','4x − 2','x − 8'],a:0,h:'4 multiplie x et aussi 2.'}],
 reveal:'Aire = (x + 3)(x + 2) = x² + 2x + 3x + 6 = x² + 5x + 6. Ce sont les quatre rectangles : x², 2x, 3x et 6. Pour x = 4 : 16 + 20 + 6 = 42 m², comme 7 × 6.',
 revealAr:'المساحة = (x + 3)(x + 2) = x² + 2x + 3x + 6 = x² + 5x + 6. إنها المستطيلات الأربعة: x² و 2x و 3x و 6. من أجل x = 4: 16 + 20 + 6 = 42 m²، مثل 7 × 6.',
 cliff:'Location de vélos : A demande 10 DH + 4 DH par heure, B demande 25 DH + 1 DH par heure. Pour combien d’heures paie-t-on la même chose ?',
 cliffAr:'كراء الدراجات: A يطلب 10 DH + 4 DH للساعة، و B يطلب 25 DH + 1 DH للساعة. لكم ساعة ندفع نفس الثمن؟'},
{id:'maths-2ac-equations',title:'Les équations du premier degré',ar:'المعادلات من الدرجة الأولى',ill:'velos',
 key:{q:'3x + 2x est égal à :',o:['5x²','6x','5x'],a:2,h:'On ajoute des x, comme 3 pommes + 2 pommes.'},
 hook:'Location de vélos : A coûte 10 DH + 4 DH par heure, B coûte 25 DH + 1 DH par heure. Pour une courte balade A est moins cher, pour une longue B. Pour combien d’heures paie-t-on exactement pareil ?',
 hookAr:'كراء الدراجات: A بـ 10 DH + 4 DH للساعة، و B بـ 25 DH + 1 DH للساعة. في نزهة قصيرة A أرخص، وفي نزهة طويلة B أرخص. لكم ساعة ندفع نفس الثمن بالضبط؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'On peut ajouter le même nombre aux deux membres d’une équation.',v:true,h:'Comme poser le même poids des deux côtés d’une balance.'},
   {s:'On peut multiplier les deux membres par 0.',v:false,h:'Par un même nombre NON nul : avec 0, tout devient 0 = 0.'},
   {s:'x = 3 est solution de 2x + 1 = 7.',v:true,h:'2 × 3 + 1 = 7.'}]},
  {t:'order',title:'Exercice',q:'Range les étapes pour résoudre 10 + 4x = 25 + x.',
   items:['Retirer x des deux membres : 10 + 3x = 25','Retirer 10 des deux membres : 3x = 15','Diviser par 3 : x = 5','Vérifier : 10 + 4 × 5 = 30 et 25 + 5 = 30'],
   h:'On regroupe d’abord les x d’un seul côté.'},
  {t:'num',title:'Je fais seul',q:'Résous 5x − 7 = 33. Donne x.',
   ans:8,tol:0.001,unit:'',ph:'x = …',h:'Ajoute 7 aux deux membres : 5x = 40.'}],
 reveal:'10 + 4x = 25 + x donne 3x = 15, donc x = 5. À 5 heures, les deux locations coûtent 30 DH. Moins de 5 heures : A est moins cher ; plus de 5 heures : B.',
 revealAr:'10 + 4x = 25 + x تعطي 3x = 15، إذن x = 5. في 5 ساعات يكلف الكراءان 30 DH. أقل من 5 ساعات: A أرخص؛ أكثر من 5 ساعات: B أرخص.',
 cliff:'Une recette pour 4 personnes demande 300 g de farine. Pour 6 personnes, faut-il 302 g ? Ou bien 450 g ?',
 cliffAr:'وصفة لـ 4 أشخاص تتطلب 300 g من الدقيق. لـ 6 أشخاص، هل نحتاج 302 g؟ أم 450 g؟'},
{id:'2ac-proportionnalite',url:'https://maths.taalim.men/2ac-proportionnalite/',chest:true,title:'Chapitre suivant : la proportionnalité',ar:'الفصل الموالي: التناسبية',ill:'recette',
 key:{q:'La solution de 3x = 15 est :',o:['x = 45','x = 5','x = 12'],a:1,h:'Divise les deux membres par 3.'},
 hook:'Une recette pour 4 personnes demande 300 g de farine. Pour 6 personnes, faut-il ajouter 2 g, parce qu’il y a 2 personnes de plus ? Ou faut-il autre chose ? Et pour 10 personnes ?',
 hookAr:'وصفة لـ 4 أشخاص تتطلب 300 g من الدقيق. لـ 6 أشخاص، هل نضيف 2 g لأن هناك شخصين إضافيين؟ أم يلزم شيء آخر؟ وماذا عن 10 أشخاص؟'}
  ],
  audio: ['audio/m2ac-bab1.mp3','audio/m2ac-bab2.mp3','audio/m2ac-bab3.mp3','audio/m2ac-sandouq.mp3']
};
