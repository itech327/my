/* Carte de chapitre « الباب الموالي » · PC 2AC · Les réactions chimiques (molécules, combustions, conservation de la masse).
   Portes 2 et 3 : leçons Pro. Porte 1 et coffre : leçons du site public pc.taalim.men (pas encore de leçon Pro), via « url ».
   Valeurs vérifiées par test/verif-pc-2ac-reactions.mjs. */
window.BAB_CHAPTER = {
  id: 'pc-2ac-reactions',
  storageKey: 'bab_mowali_pc2ac_reactions_v1',
  title: 'La porte suivante', titleAr: 'الباب الموالي',
  kicker: 'PC · 2AC · Les réactions chimiques',
  kickerAr: 'الفيزياء والكيمياء · الثانية إعدادي · التفاعلات الكيميائية',
  levelLabel: 'Les 2APIC ensemble', levelLabelAr: 'تلاميذ الثانية إعدادي معا',
  courseBase: 'https://pro.taalim.men/lecons/',
  chestCourse: 'La pollution de l’air',
  endpoint: 'https://relay.taalim.men/api/bab',  /* actif seulement depuis une origine autorisée (pro.taalim.men…) avec ?cls=2APIC */
  sim: { donePct: [81, 54, 28], stuck: [0, 3, 1] },
  bonusAt: 70, alertMin: 3,
  ill: (function(){ var W='viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"',
    T=function(x,y,t,c,s,w){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="'+(c||'#aaa3bf')+'" font-size="'+(s||11)+'"'+(w?' font-weight="700"':'')+' font-family="Figtree">'+t+'</text>'},
    at=function(x,y,r,c){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'"/><circle cx="'+(x-r/3)+'" cy="'+(y-r/3)+'" r="'+(r/3)+'" fill="#fff" fill-opacity=".25"/>'};
    return {
 molecules:'<svg class="illu" '+W+'><rect x="0" y="136" width="320" height="24" fill="#1e1a2b"/>'+
  at(70,84,22,'#e5484d')+at(48,104,13,'#f2eff9')+at(92,104,13,'#f2eff9')+T(70,134,'H₂O · on la boit','#f2eff9',12,1)+
  at(230,84,22,'#e5484d')+at(266,84,22,'#e5484d')+T(248,134,'O₂ · on le respire','#f2eff9',12,1)+
  T(160,40,'même atome O','#f27b60',13,1)+T(160,58,'?','#f27b60',20,1)+'</svg>',
 flamme:'<svg class="illu" '+W+'><rect x="0" y="136" width="320" height="24" fill="#1e1a2b"/>'+
  '<rect x="120" y="106" width="80" height="30" rx="6" fill="#2f2942"/><rect x="152" y="96" width="16" height="12" fill="#aaa3bf"/>'+
  '<path d="M160 96 q-16 -18 0 -44 q16 26 0 44 z" fill="#4c7bf2" fill-opacity=".85"/><path d="M160 92 q-7 -10 0 -24 q7 14 0 24 z" fill="#9bd0ff" fill-opacity=".8"/>'+
  '<ellipse cx="160" cy="34" rx="60" ry="8" fill="#f2eff9" fill-opacity=".85"/>'+[0,1,2,3,4].map(function(k){return '<circle cx="'+(122+k*19)+'" cy="44" r="2.5" fill="#9bd0ff"/>'}).join('')+
  T(160,20,'assiette froide : buée','#f2eff9',11,1)+T(60,100,'butane','#aaa3bf',12)+
  '<rect x="244" y="72" width="30" height="60" rx="12" fill="#2f2942"/><rect x="247" y="94" width="24" height="36" rx="10" fill="#f2eff9" fill-opacity=".85"/>'+T(259,66,'eau de chaux','#f2eff9',10,1)+T(259,150,'trouble ?','#f27b60',11,1)+'</svg>',
 balance:'<svg class="illu" '+W+'><rect x="0" y="136" width="320" height="24" fill="#1e1a2b"/>'+
  '<rect x="90" y="116" width="140" height="20" rx="4" fill="#2f2942"/><rect x="128" y="120" width="64" height="12" rx="2" fill="#161320"/>'+T(160,130,'??? g','#6ccdb6',11,1)+
  '<path d="M126 116 v-56 q0 -16 16 -16 h36 q16 0 16 16 v56 z" fill="#9b92dc" fill-opacity=".3" stroke="#9b92dc" stroke-width="2"/><rect x="148" y="34" width="24" height="10" rx="2" fill="#aaa3bf"/>'+
  at(160,96,10,'#3a3a3a')+'<path d="M160 84 q-6 -10 0 -18 q6 8 0 18 z" fill="#f27b60"/>'+
  T(64,70,'flacon fermé','#f2eff9',12,1)+T(64,88,'charbon qui brûle','#aaa3bf',11)+T(262,80,'avant / après','#f27b60',12,1)+'</svg>',
 ville:'<svg class="illu" '+W+'><rect x="0" y="0" width="320" height="160" fill="#9b92dc" fill-opacity=".12"/>'+
  [[20,70,30],[56,50,26],[88,82,34],[128,40,28],[162,64,30],[198,56,26],[230,76,34],[270,46,30]].map(function(b){return '<rect x="'+b[0]+'" y="'+b[1]+'" width="'+b[2]+'" height="'+(136-b[1])+'" fill="#2f2942"/>'}).join('')+
  '<rect x="0" y="40" width="320" height="56" fill="#aaa3bf" fill-opacity=".28"/><rect x="0" y="136" width="320" height="24" fill="#1e1a2b"/>'+
  T(160,26,'un voile gris, sans nuage','#f2eff9',12,1)+T(160,152,'d’où vient-il ?','#f27b60',12,1)+'</svg>'
}; })(),
  doors: [
{id:'2ac-molecules',url:'https://pc.taalim.men/2ac-molecules/',title:'Les molécules et les atomes',ar:'الجزيئات والذرات',ill:'molecules',
 hook:'L’eau (H₂O) et le dioxygène (O₂) contiennent tous les deux de l’oxygène. Pourtant on boit l’une et on respire l’autre. Comment le même atome peut-il donner des corps si différents ?',
 hookAr:'الماء (H₂O) وثنائي الأكسجين (O₂) يحتويان كلاهما على الأكسجين. ومع ذلك نشرب الأول ونتنفس الثاني. كيف تعطي نفس الذرة أجساما مختلفة إلى هذا الحد؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'Une molécule est formée d’atomes liés entre eux.',v:true,h:'Les atomes sont les briques, la molécule est l’assemblage.'},
   {s:'La molécule d’eau H₂O contient 2 atomes d’hydrogène et 1 atome d’oxygène.',v:true,h:'Le petit 2 après H compte les atomes d’hydrogène.'},
   {s:'Le dioxygène O₂ est un corps composé.',v:false,h:'O₂ ne contient qu’une sorte d’atome : c’est un corps simple.'}]},
  {t:'num',title:'Exercice',q:'Combien d’atomes y a-t-il au total dans 4 molécules d’eau H₂O ?',
   ans:12,tol:0.01,unit:'',ph:'… atomes',h:'Une molécule H₂O = 3 atomes. Puis multiplie par 4.'},
  {t:'sort',title:'Je fais seul',q:'Classe chaque corps. Touche un corps, puis une catégorie.',
   bins:['Corps simple (une seule sorte d’atome)','Corps composé (plusieurs sortes)'],
   items:[['O₂',0],['H₂',0],['N₂',0],['H₂O',1],['CO₂',1],['CH₄',1]],
   h:'Regarde combien de lettres différentes il y a dans la formule.'}],
 reveal:'Ce qui compte, c’est l’assemblage. O₂ est fait de deux atomes d’oxygène : un corps simple. H₂O assemble deux atomes d’hydrogène et un d’oxygène : un corps composé. Atomes différents ou nombres différents, et la molécule change, avec ses propriétés.',
 revealAr:'المهم هو طريقة التجميع. O₂ مكوّن من ذرتي أكسجين: جسم بسيط. و H₂O يجمع ذرتي هيدروجين وذرة أكسجين: جسم مركب. إذا اختلفت الذرات أو عددها تغيرت الجزيئة وتغيرت خصائصها.',
 cliff:'Quand le butane brûle dans la cuisinière, ses atomes disparaissent-ils dans la flamme ?',
 cliffAr:'حين يحترق غاز البوتان في الموقد، هل تختفي ذراته في اللهب؟'},
{id:'pc-2ac-combustions',title:'Les combustions',ar:'الاحتراقات',ill:'flamme',
 key:{q:'La formule de la molécule d’eau est :',o:['HO₂','H₂O','H₂O₂'],a:1,h:'Deux hydrogènes, un oxygène.'},
 hook:'Tiens une assiette froide au-dessus de la flamme du butane : elle se couvre de buée. Fais passer les gaz dans l’eau de chaux : elle se trouble. D’où viennent cette eau et ce gaz ?',
 hookAr:'أمسك صحنا باردا فوق لهب البوتان: يتغطى بالبخار المتكاثف. مرّر الغازات في ماء الجير: يتعكر. من أين يأتي هذا الماء وهذا الغاز؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'Une combustion a besoin d’un combustible et d’un comburant, le dioxygène.',v:true,h:'Sans dioxygène, la flamme s’éteint.'},
   {s:'La combustion complète du butane produit du dioxyde de carbone et de l’eau.',v:true,h:'L’eau de chaux et la buée le montrent.'},
   {s:'Une flamme jaune qui noircit le fond de la casserole indique une combustion complète.',v:false,h:'Jaune et noir de fumée : combustion incomplète, elle produit du carbone et du monoxyde de carbone.'}]},
  {t:'sort',title:'Exercice',q:'Combustion du butane : classe chaque corps. Touche un corps, puis une catégorie.',
   bins:['Réactifs (disparaissent)','Produits (apparaissent)'],
   items:[['Butane',0],['Dioxygène',0],['Dioxyde de carbone',1],['Eau',1]],
   h:'Les réactifs sont là au début, les produits à la fin.'},
  {t:'qcm',title:'Je fais seul',q:'Pour montrer qu’une combustion produit de l’eau, on utilise :',
   o:['le sulfate de cuivre anhydre, qui bleuit','l’eau de chaux, qui se trouble','le papier pH'],a:0,h:'L’eau de chaux sert pour le dioxyde de carbone.'}],
 reveal:'Le butane réagit avec le dioxygène de l’air. Ses atomes de carbone et d’hydrogène se réassemblent avec l’oxygène : dioxyde de carbone (il trouble l’eau de chaux) et eau (la buée, qui bleuit le sulfate de cuivre anhydre). Flamme bleue : combustion complète. Flamme jaune : incomplète, avec du monoxyde de carbone, un gaz dangereux.',
 revealAr:'يتفاعل البوتان مع ثنائي أكسجين الهواء. تعيد ذرات الكربون والهيدروجين تجمعها مع الأكسجين: ثنائي أكسيد الكربون (يعكّر ماء الجير) والماء (البخار الذي يزرّق كبريتات النحاس اللامائية). لهب أزرق: احتراق كامل. لهب أصفر: احتراق غير كامل يُنتج أحادي أكسيد الكربون، وهو غاز خطير.',
 cliff:'Les gaz de la flamme s’envolent. La masse totale a-t-elle diminué pour autant ?',
 cliffAr:'غازات اللهب تتطاير. هل نقصت الكتلة الإجمالية فعلا؟'},
{id:'pc-2ac-conservation-masse',title:'La conservation de la masse',ar:'انحفاظ الكتلة',ill:'balance',
 key:{q:'Quel test met en évidence le dioxyde de carbone ?',o:['Le sulfate de cuivre anhydre','L’eau de chaux','La flamme d’une allumette'],a:1,h:'Elle se trouble.'},
 hook:'On brûle un morceau de charbon dans un flacon fermé, posé sur une balance. Le charbon disparaît presque entièrement. Que montre la balance à la fin ?',
 hookAr:'نحرق قطعة فحم داخل قارورة مغلقة موضوعة فوق ميزان. يكاد الفحم يختفي كليا. ماذا يشير الميزان في النهاية؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'Au cours d’une réaction chimique, les atomes se conservent.',v:true,h:'Ils se réarrangent, ils ne disparaissent pas.'},
   {s:'La masse des réactifs disparus est égale à la masse des produits formés.',v:true,h:'C’est la loi de conservation de la masse.'},
   {s:'Dans un flacon ouvert, la balance indique toujours la même masse.',v:false,h:'Un gaz produit peut s’échapper : la balance baisse.'}]},
  {t:'num',title:'Exercice',q:'12 g de carbone réagissent avec 32 g de dioxygène. Quelle masse de dioxyde de carbone se forme, en grammes ?',
   ans:44,tol:0.01,unit:'g',ph:'en g',h:'Masse des produits = masse des réactifs : 12 + 32.'},
  {t:'qcm',title:'Je fais seul',q:'Dans C + O₂ → CO₂, combien d’atomes d’oxygène y a-t-il de chaque côté de la flèche ?',
   o:['2','1','4'],a:0,h:'O₂ en a deux ; CO₂ aussi.'}],
 reveal:'La balance n’a pas bougé : la masse se conserve. Les atomes de carbone et d’oxygène ne disparaissent pas, ils se réarrangent : C + O₂ → CO₂, et 12 g + 32 g = 44 g. Dans un flacon ouvert, le gaz s’échappe et la balance baisse, mais la matière n’a pas disparu.',
 revealAr:'لم يتحرك الميزان: الكتلة تنحفظ. ذرات الكربون والأكسجين لا تختفي بل تعيد ترتيبها: C + O₂ → CO₂، و 12 g + 32 g = 44 g. في قارورة مفتوحة يتسرب الغاز فينقص ما يشير إليه الميزان، لكن المادة لم تختف.',
 cliff:'Ce dioxyde de carbone et ces fumées, où vont-ils une fois sortis des cheminées et des pots d’échappement ?',
 cliffAr:'ثنائي أكسيد الكربون هذا وهذه الأدخنة، أين تذهب بعد خروجها من المداخن وعوادم السيارات؟'},
{id:'2ac-pollution-air',url:'https://pc.taalim.men/2ac-pollution-air/',chest:true,title:'Chapitre suivant : la pollution de l’air',ar:'الفصل الموالي: تلوث الهواء',ill:'ville',
 key:{q:'12 g de carbone brûlent avec 32 g de dioxygène. Ils donnent :',o:['20 g de dioxyde de carbone','44 g de dioxyde de carbone','12 g de dioxyde de carbone'],a:1,h:'La masse se conserve : 12 + 32.'},
 hook:'Un matin d’hiver, un voile gris couvre la ville, sans un seul nuage. D’où vient-il ? Et pourquoi un pot catalytique ou un filtre change-t-il les choses ?',
 hookAr:'في صباح شتوي يغطي حجاب رمادي المدينة، دون أي سحابة. من أين يأتي؟ ولماذا يغيّر المحفز في عادم السيارة أو المصفاة شيئا؟'}
  ],
  audio: ['audio/p2ac-bab1.mp3','audio/p2ac-bab2.mp3','audio/p2ac-bab3.mp3','audio/p2ac-sandouq.mp3']
};
