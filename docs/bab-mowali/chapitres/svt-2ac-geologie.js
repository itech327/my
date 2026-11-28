/* Carte de chapitre « الباب الموالي » · SVT 2AC · La géologie (plaques, séismes, plis et failles).
   Porte 2 : leçon Pro « Séismes ». Portes 1 et 3, et coffre : leçons du site public svt.taalim.men, via « url ».
   Valeurs vérifiées par test/verif-svt-2ac-geologie.mjs. Séisme d’Al Haouz (8 septembre 2023) évoqué sobrement, sans chiffre de victimes. */
window.BAB_CHAPTER = {
  id: 'svt-2ac-geologie',
  storageKey: 'bab_mowali_svt2ac_geologie_v1',
  title: 'La porte suivante', titleAr: 'الباب الموالي',
  kicker: 'SVT · 2AC · La géologie',
  kickerAr: 'علوم الحياة والأرض · الثانية إعدادي · الجيولوجيا',
  levelLabel: 'Les 2APIC ensemble', levelLabelAr: 'تلاميذ الثانية إعدادي معا',
  courseBase: 'https://pro.taalim.men/lecons/',
  chestCourse: 'La formation des chaînes de montagnes',
  endpoint: 'https://relay.taalim.men/api/bab',  /* actif seulement depuis une origine autorisée (pro.taalim.men…) avec ?cls=2APIC */
  sim: { donePct: [78, 49, 25], stuck: [1, 3, 0] },
  bonusAt: 70, alertMin: 3,
  ill: (function(){ var W='viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"',
    T=function(x,y,t,c,s,w){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="'+(c||'#aaa3bf')+'" font-size="'+(s||11)+'"'+(w?' font-weight="700"':'')+' font-family="Figtree">'+t+'</text>'};
    return {
 fossile:'<svg class="illu" '+W+'>'+
  '<path d="M0 140 L70 70 L110 96 L170 30 L230 88 L270 62 L320 120 L320 160 L0 160 z" fill="#2f2942"/><path d="M150 50 L170 30 L190 50 z" fill="#f2eff9" fill-opacity=".8"/>'+
  '<g transform="translate(170 62)"><path d="M-12 8 q12 -24 24 0 z" fill="#ffcf5c"/><path d="M-6 6 l4 -12 M0 6 v-14 M6 6 l-4 -12" stroke="#2f2942" stroke-width="1.5"/></g>'+
  T(230,24,'2000 m d’altitude','#f2eff9',12,1)+T(170,100,'coquillage marin','#ffcf5c',11,1)+T(60,152,'comment est-il monté ?','#f27b60',11,1)+'</svg>',
 seisme:'<svg class="illu" '+W+'>'+
  '<rect x="0" y="40" width="320" height="120" fill="#2f2942"/><rect x="0" y="40" width="320" height="6" fill="#6ccdb6" fill-opacity=".6"/>'+
  [24,44,64].map(function(r){return '<circle cx="110" cy="120" r="'+r+'" fill="none" stroke="#ffcf5c" stroke-width="2" stroke-opacity="'+(1-r/90)+'"/>'}).join('')+
  '<circle cx="110" cy="120" r="6" fill="#f27b60"/>'+T(110,150,'foyer','#f27b60',11,1)+'<line x1="110" y1="46" x2="110" y2="112" stroke="#f27b60" stroke-dasharray="3 4"/>'+T(110,34,'épicentre','#f27b60',11,1)+
  '<rect x="238" y="22" width="18" height="18" fill="#aaa3bf"/><rect x="262" y="16" width="22" height="24" fill="#aaa3bf"/>'+T(262,12,'à ~70 km','#f2eff9',11,1)+'</svg>',
 plis:'<svg class="illu" '+W+'>'+
  [0,1,2,3].map(function(k){return '<path d="M10 '+(60+k*18)+' q35 -30 70 0 t70 0" fill="none" stroke="'+['#ffcf5c','#9b92dc','#6ccdb6','#f27b60'][k]+'" stroke-width="12" stroke-opacity=".7"/>'}).join('')+
  [0,1,2,3].map(function(k){var c=['#ffcf5c','#9b92dc','#6ccdb6','#f27b60'][k];return '<rect x="180" y="'+(40+k*18)+'" width="54" height="12" fill="'+c+'" fill-opacity=".7"/><rect x="240" y="'+(58+k*18)+'" width="64" height="12" fill="'+c+'" fill-opacity=".7"/>'}).join('')+
  '<line x1="242" y1="30" x2="232" y2="132" stroke="#f2eff9" stroke-width="2.5"/>'+T(80,148,'des vagues ?','#f2eff9',12,1)+T(242,148,'coupées net ?','#f2eff9',12,1)+'</svg>',
 montagnes:'<svg class="illu" '+W+'><rect x="0" y="130" width="320" height="30" fill="#1e1a2b"/>'+
  '<path d="M10 130 L50 70 L80 100 L110 56 L150 130 z" fill="#2f2942"/><path d="M104 62 l6 -8 l6 8 z" fill="#f27b60"/><path d="M110 50 q-4 -10 2 -18 q4 8 -2 18" fill="#f27b60" fill-opacity=".8"/>'+
  '<path d="M170 130 L210 60 L240 90 L270 40 L310 130 z" fill="#2f2942"/><path d="M262 52 L270 40 L278 52 z" fill="#f2eff9" fill-opacity=".85"/>'+
  T(80,148,'Andes : volcans','#f2eff9',12,1)+T(240,148,'Himalaya : presque pas','#f2eff9',12,1)+T(160,24,'pourquoi ?','#f27b60',14,1)+'</svg>'
}; })(),
  doors: [
{id:'2ac-tectonique',url:'https://svt.taalim.men/2ac-tectonique/',title:'Les plaques bougent',ar:'الصفائح تتحرك',ill:'fossile',
 hook:'En haut de l’Atlas, à plus de 2000 m d’altitude, on trouve des fossiles d’animaux marins. Comment des coquillages sont-ils arrivés si haut ?',
 hookAr:'في أعالي الأطلس، على ارتفاع يفوق 2000 m، نجد أحافير حيوانات بحرية. كيف وصلت هذه الأصداف إلى هذا العلو؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'La surface de la Terre est découpée en plaques.',v:true,h:'Une douzaine de grandes plaques couvrent le globe.'},
   {s:'Les plaques sont immobiles.',v:false,h:'Elles bougent de quelques centimètres par an, comme tes ongles poussent.'},
   {s:'Le Maroc est proche de la limite entre la plaque africaine et la plaque eurasienne.',v:true,h:'Le détroit de Gibraltar n’est pas loin de cette limite.'}]},
  {t:'num',title:'Exercice',q:'Une plaque avance de 2 cm par an. Combien de mètres parcourt-elle en 1000 ans ?',
   ans:20,tol:0.01,unit:'m',ph:'en m',h:'2 × 1000 = 2000 cm, puis convertis en mètres.'},
  {t:'qcm',title:'Je fais seul',q:'Quand deux plaques se rapprochent, on parle de :',
   o:['convergence','divergence','coulissage'],a:0,h:'Converger : aller vers le même point.'}],
 reveal:'Ces roches se sont formées au fond d’une mer. Les plaques africaine et eurasienne se rapprochent lentement. En des millions d’années, ce rapprochement a plissé et soulevé les couches, jusqu’à construire l’Atlas avec ses fossiles marins.',
 revealAr:'تكونت هذه الصخور في قاع بحر. الصفيحتان الإفريقية والأوراسية تقتربان ببطء. وعبر ملايين السنين طوى هذا الاقتراب الطبقات ورفعها حتى تكوّن الأطلس بأحافيره البحرية.',
 cliff:'Si les plaques bougent sans cesse, pourquoi le sol tremble-t-il d’un coup, comme à Al Haouz en septembre 2023 ?',
 cliffAr:'إذا كانت الصفائح تتحرك باستمرار، فلماذا تهتز الأرض فجأة، كما في الحوز في شتنبر 2023؟'},
{id:'svt-2ac-seismes',title:'Les séismes',ar:'الزلازل',ill:'seisme',
 key:{q:'Quand deux plaques se rapprochent, c’est une :',o:['divergence','convergence','érosion'],a:1,h:'C’est ce qui a soulevé l’Atlas.'},
 hook:'Une nuit de septembre 2023, à plusieurs kilomètres sous la région d’Al Haouz, une roche casse. Le sol tremble jusqu’à Marrakech, à environ 70 km. Comment une cassure si profonde secoue-t-elle des villes si loin ?',
 hookAr:'في ليلة من شتنبر 2023، على عمق كيلومترات تحت منطقة الحوز، انكسرت صخرة. اهتزت الأرض حتى مراكش على بعد حوالي 70 km. كيف يهز انكسار عميق مدنا بعيدة إلى هذا الحد؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'Le foyer est le lieu en profondeur où la roche se rompt.',v:true,h:'C’est là que le séisme naît.'},
   {s:'L’épicentre est le point de la surface situé à la verticale du foyer.',v:true,h:'C’est souvent là que les secousses sont les plus fortes.'},
   {s:'Les ondes sismiques ne se propagent que vers le haut.',v:false,h:'Elles partent du foyer dans toutes les directions.'}]},
  {t:'num',title:'Exercice',q:'Des ondes sismiques avancent à 6 km par seconde. Combien de secondes mettent-elles pour parcourir 72 km ?',
   ans:12,tol:0.01,unit:'s',ph:'en s',h:'Temps = distance ÷ vitesse : 72 ÷ 6.'},
  {t:'qcm',title:'Je fais seul',q:'Quel appareil enregistre les ondes sismiques ?',
   o:['le sismographe','le baromètre','le thermomètre'],a:0,h:'« Sismo » comme séisme, « graphe » comme écrire.'}],
 reveal:'Le mouvement des plaques accumule des contraintes dans les roches, jusqu’à la rupture au foyer. L’énergie libérée part en ondes sismiques dans toutes les directions. En quelques secondes, elles atteignent la surface et secouent le sol loin de l’épicentre. Le sismographe les enregistre.',
 revealAr:'حركة الصفائح تراكم إجهادات في الصخور حتى تنكسر في البؤرة. تنطلق الطاقة المحررة على شكل موجات زلزالية في كل الاتجاهات. في بضع ثوان تصل إلى السطح وتهز الأرض بعيدا عن المركز السطحي. ويسجلها جهاز قياس الزلازل.',
 cliff:'Dans les gorges du Haut Atlas, les couches de roche dessinent des vagues, ou sont coupées net. Quelles forces les ont déformées ?',
 cliffAr:'في مضايق الأطلس الكبير، ترسم طبقات الصخور أمواجا، أو تبدو مقطوعة فجأة. ما القوى التي شوّهتها؟'},
{id:'2ac-deformations',url:'https://svt.taalim.men/2ac-deformations/',title:'Les plis et les failles',ar:'الطيات والصدوع',ill:'plis',
 key:{q:'Le point de la surface situé au-dessus du foyer s’appelle :',o:['l’épicentre','le sismographe','la faille'],a:0,h:'« Épi » veut dire « au-dessus ».'},
 hook:'Dans les gorges du Haut Atlas, certaines couches de roche dessinent des vagues. D’autres sont coupées net et décalées. Quelles forces ont pu tordre ou casser la pierre ?',
 hookAr:'في مضايق الأطلس الكبير، بعض طبقات الصخور ترسم أمواجا، وأخرى مقطوعة فجأة ومزاحة. ما القوى التي استطاعت أن تلوي الحجر أو تكسره؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'Un pli est une déformation souple des couches, sans cassure.',v:true,h:'Comme un tapis qu’on pousse.'},
   {s:'Une faille est une cassure avec déplacement des deux blocs.',v:true,h:'Les couches ne se raccordent plus de part et d’autre.'},
   {s:'Les plis se forment quand les roches sont étirées.',v:false,h:'Les plis viennent d’une compression : les roches sont serrées.'}]},
  {t:'sort',title:'Exercice',q:'Classe chaque observation. Touche une observation, puis une catégorie.',
   bins:['Pli (déformation souple)','Faille (cassure)'],
   items:[['Couches courbées en vagues',0],['Couches décalées de part et d’autre d’une cassure',1],['Roche tordue sans casser',0],['Rupture brutale qui provoque un séisme',1]],
   h:'Pli : ça se courbe. Faille : ça casse et ça glisse.'},
  {t:'qcm',title:'Je fais seul',q:'Les plis du Haut Atlas montrent que les roches ont subi :',
   o:['une compression','un étirement','un refroidissement'],a:0,h:'Les plaques se rapprochent : elles serrent les couches.'}],
 reveal:'Le rapprochement des plaques comprime les roches. Les couches qui se déforment lentement se plissent (plis). Celles qui sont cassantes se brisent et se décalent (failles). Une faille qui rejoue brutalement provoque un séisme.',
 revealAr:'اقتراب الصفائح يضغط الصخور. الطبقات التي تتشوه ببطء تنطوي (طيات)، والطبقات الهشة تنكسر وتنزاح (صدوع). وإذا تحرك صدع فجأة نتج عنه زلزال.',
 cliff:'Les Andes sont pleines de volcans, l’Himalaya presque pas. Pourquoi deux chaînes de montagnes si différentes ?',
 cliffAr:'جبال الأنديز مليئة بالبراكين، والهيمالايا تكاد تخلو منها. لماذا هاتان السلسلتان الجبليتان مختلفتان إلى هذا الحد؟'},
{id:'2ac-chaines-montagnes',url:'https://svt.taalim.men/2ac-chaines-montagnes/',chest:true,title:'Chapitre suivant : les chaînes de montagnes',ar:'الفصل الموالي: تكون السلاسل الجبلية',ill:'montagnes',
 key:{q:'Une couche de roche cassée puis décalée, c’est :',o:['un pli','une faille','un fossile'],a:1,h:'Ça casse et ça glisse.'},
 hook:'Les Andes sont pleines de volcans, l’Himalaya presque pas. Pourtant, dans les deux cas, des plaques se rapprochent. Il existe donc deux façons de construire une montagne. Lesquelles ?',
 hookAr:'جبال الأنديز مليئة بالبراكين، والهيمالايا تكاد تخلو منها. ومع ذلك ففي الحالتين تقترب صفائح. توجد إذن طريقتان لبناء جبل. ما هما؟'}
  ],
  audio: ['audio/s2ac-bab1.mp3','audio/s2ac-bab2.mp3','audio/s2ac-bab3.mp3','audio/s2ac-sandouq.mp3']
};
