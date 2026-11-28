/* Carte de chapitre « الباب الموالي » · SVT 3AC · Digestion et respiration (le voyage du pain).
   Les portes renvoient aux leçons Pro (pro.taalim.men/lecons/…), toujours ouvertes.
   Valeurs vérifiées par test/verif-svt-3ac-nutrition.mjs (mêmes pourcentages que la leçon « Échanges gazeux »). */
window.BAB_CHAPTER = {
  id: 'svt-3ac-nutrition',
  storageKey: 'bab_mowali_svt3ac_nutrition_v1',
  title: 'La porte suivante', titleAr: 'الباب الموالي',
  kicker: 'SVT · 3AC · Digestion et respiration',
  kickerAr: 'علوم الحياة والأرض · الثالثة إعدادي · الهضم والتنفس',
  levelLabel: 'Les 3APIC ensemble', levelLabelAr: 'تلاميذ الثالثة إعدادي معا',
  courseBase: 'https://pro.taalim.men/lecons/',
  chestCourse: '',
  endpoint: 'https://relay.taalim.men/api/bab',  /* actif seulement depuis une origine autorisée (pro.taalim.men…) avec ?cls=3APIC */
  sim: { donePct: [79, 50, 24], stuck: [1, 3, 0] },
  bonusAt: 70, alertMin: 3,
  ill: (function(){ var W='viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"',
    T=function(x,y,t,c,s,w){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="'+(c||'#aaa3bf')+'" font-size="'+(s||11)+'"'+(w?' font-weight="700"':'')+' font-family="Figtree">'+t+'</text>'},
    tube=function(x,fill,op,lab){return '<rect x="'+x+'" y="40" width="40" height="92" rx="18" fill="#2f2942"/><rect x="'+(x+4)+'" y="74" width="32" height="54" rx="14" fill="'+fill+'" fill-opacity="'+op+'"/>'+T(x+20,150,lab,'#f2eff9',11,1)};
    return {
 pain:'<svg class="illu" '+W+'><rect x="0" y="136" width="320" height="24" fill="#1e1a2b"/>'+
  '<path d="M40 128 v-52 q0 -26 30 -26 h40 q30 0 30 26 v52 z" fill="#ffcf5c" fill-opacity=".85"/><path d="M52 120 v-40 q0 -16 18 -16 h40 q18 0 18 16 v40 z" fill="#f2eff9" fill-opacity=".25"/>'+
  T(90,30,'pain : presque pas de sucre','#f2eff9',11,1)+'<path d="M156 92 h46" stroke="#6ccdb6" stroke-width="2.5"/><path d="M202 86 l10 6 l-10 6 z" fill="#6ccdb6"/>'+T(180,82,'2 min','#6ccdb6',12,1)+T(180,112,'mâché','#aaa3bf',11)+
  '<rect x="228" y="70" width="22" height="22" rx="3" fill="#f2eff9" fill-opacity=".9"/><rect x="254" y="70" width="22" height="22" rx="3" fill="#f2eff9" fill-opacity=".9"/><rect x="241" y="46" width="22" height="22" rx="3" fill="#f2eff9" fill-opacity=".9"/>'+
  T(252,120,'goût sucré ?','#f27b60',13,1)+'</svg>',
 voyage:'<svg class="illu" '+W+'>'+
  '<rect x="18" y="62" width="64" height="12" rx="6" fill="#ffcf5c"/><rect x="20" y="74" width="60" height="9" fill="#f27b60" fill-opacity=".8"/><rect x="18" y="83" width="64" height="12" rx="6" fill="#ffcf5c"/>'+T(50,112,'sandwich','#f2eff9',11,1)+
  '<path d="M92 78 C 130 30, 170 130, 210 78" fill="none" stroke="#9b92dc" stroke-width="3" stroke-dasharray="6 6"/><path d="M208 70 l10 8 l-12 4 z" fill="#9b92dc"/>'+
  T(150,40,'? ? ?','#f27b60',16,1)+
  '<path d="M232 100 q20 -50 52 -26 q14 12 0 30 q-26 22 -52 -4 z" fill="#f27b60" fill-opacity=".75"/>'+T(258,128,'muscle','#f2eff9',11,1)+T(160,150,'quelques heures plus tard…')+'</svg>',
 chaux:'<svg class="illu" '+W+'><rect x="0" y="136" width="320" height="24" fill="#1e1a2b"/>'+
  tube(70,'#f2eff9','.85','souffle')+tube(210,'#9b92dc','.25','air de la classe')+
  '<path d="M90 18 v70" stroke="#ffcf5c" stroke-width="4"/>'+[0,1,2,3].map(function(k){return '<circle cx="'+(84+k*4)+'" cy="'+(96+k*7)+'" r="3" fill="#f2eff9"/>'}).join('')+
  T(90,62,'trouble','#161320',10,1)+T(230,62,'claire','#9b92dc',11,1)+T(160,30,'eau de chaux','#f2eff9',12,1)+T(160,96,'?','#f27b60',22,1)+'</svg>',
 coureur:'<svg class="illu" '+W+'><rect x="0" y="134" width="320" height="26" fill="#1e1a2b"/>'+
  '<rect x="30" y="58" width="56" height="10" rx="5" fill="#ffcf5c"/><rect x="32" y="68" width="52" height="8" fill="#f27b60" fill-opacity=".8"/><rect x="30" y="76" width="56" height="10" rx="5" fill="#ffcf5c"/>'+
  '<path d="M96 72 h28" stroke="#aaa3bf" stroke-width="2"/><path d="M124 67 l8 5 l-8 5 z" fill="#aaa3bf"/>'+
  '<circle cx="176" cy="44" r="10" fill="#6ccdb6"/><path d="M176 56 l-6 34 M170 90 l-16 26 M170 90 l18 24 M174 64 l-20 12 M174 64 l20 -6" stroke="#6ccdb6" stroke-width="6" stroke-linecap="round" fill="none"/>'+
  '<path d="M196 40 q14 -4 22 4 M198 50 q16 0 22 8" fill="none" stroke="#f2eff9" stroke-width="2" stroke-dasharray="3 4"/>'+
  T(262,62,'20 min de course','#f2eff9',12,1)+T(262,84,'du pain au souffle :','#aaa3bf',11)+T(262,102,'5 étapes ?','#f27b60',14,1)+'</svg>'
}; })(),
  doors: [
{id:'svt-3ac-amylase',title:'L’amylase salivaire',ar:'الأميلاز اللعابي',ill:'pain',
 hook:'Mâche un morceau de pain pendant deux minutes sans l’avaler : il devient sucré. Pourtant, le pain ne contient presque pas de sucre. D’où vient ce goût ?',
 hookAr:'امضغ قطعة خبز لمدة دقيقتين دون أن تبتلعها: يصبح طعمها حلوا. ومع ذلك فالخبز لا يحتوي تقريبا على السكر. من أين يأتي هذا الطعم؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'L’eau iodée devient bleu-noir en présence d’amidon.',v:true,h:'C’est le test de l’amidon : bleu-noir = amidon présent.'},
   {s:'L’amylase salivaire transforme l’amidon en un sucre plus simple, le maltose.',v:true,h:'C’est une enzyme : elle découpe les grosses molécules.'},
   {s:'L’amylase agit mieux à 0 °C qu’à 37 °C.',v:false,h:'Elle agit le mieux à la température du corps, 37 °C.'}]},
  {t:'sort',title:'Exercice',q:'Après 10 minutes, on ajoute de l’eau iodée dans chaque tube. Classe les tubes selon la couleur obtenue. Touche un tube, puis une couleur.',
   bins:['Bleu-noir (amidon présent)','Pas de bleu-noir (amidon digéré)'],
   items:[['Amidon + eau, 37 °C',0],['Amidon + salive, 37 °C',1],['Amidon + salive, 0 °C',0],['Amidon + salive bouillie, 37 °C',0]],
   h:'Il faut à la fois la salive (l’enzyme), une enzyme intacte et une température proche de 37 °C.'},
  {t:'qcm',title:'Je fais seul',q:'Le tube « amidon + salive bouillie » reste bleu-noir. C’est parce que :',
   o:['la chaleur a détruit l’amylase','la salive bouillie contient plus d’amidon','l’eau iodée ne fonctionne pas à chaud'],a:0,h:'Une enzyme est une protéine : l’ébullition la détruit.'}],
 reveal:'La salive contient une enzyme, l’amylase salivaire. À 37 °C, elle découpe l’amidon du pain en maltose, un sucre : d’où le goût sucré. C’est la première étape de la digestion, une simplification des molécules.',
 revealAr:'يحتوي اللعاب على أنزيم هو الأميلاز اللعابي. عند 37 °C يفكك نشا الخبز إلى مالتوز، وهو سكر: لهذا يصبح الطعم حلوا. إنها أول مرحلة من الهضم، أي تبسيط الجزيئات.',
 cliff:'Le maltose est encore trop gros pour passer dans le sang. Où et comment le pain devient-il assez petit ?',
 cliffAr:'المالتوز ما زال كبيرا جدا ليمر إلى الدم. أين وكيف يصبح الخبز صغيرا بما يكفي؟'},
{id:'svt-3ac-digestion',title:'La digestion et l’absorption',ar:'الهضم والامتصاص',ill:'voyage',
 key:{q:'L’enzyme de la salive qui digère l’amidon s’appelle :',o:['la pepsine','l’amylase','la bile'],a:1,h:'C’est elle qui a rendu le pain sucré.'},
 hook:'Un sandwich (pain, fromage, huile d’olive) entre dans la bouche. Quelques heures plus tard, rien n’en est reconnaissable, et pourtant tes muscles l’utilisent. Par où est-il passé, et en quoi s’est-il transformé ?',
 hookAr:'شطيرة (خبز وجبن وزيت زيتون) تدخل الفم. بعد بضع ساعات لا يبقى منها شيء يُعرف، ومع ذلك تستعملها عضلاتك. من أين مرت؟ وإلى ماذا تحولت؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'L’intestin grêle est le lieu principal de l’absorption des nutriments.',v:true,h:'Sa paroi très repliée (villosités) offre une immense surface.'},
   {s:'Le foie fait partie du tube digestif.',v:false,h:'Le foie est une glande annexe : les aliments ne passent pas dedans.'},
   {s:'Les protéines sont transformées en acides aminés.',v:true,h:'Chaque grosse molécule donne des nutriments plus petits.'}]},
  {t:'order',title:'Exercice',q:'Range les organes dans l’ordre où passent les aliments.',
   items:['Bouche','Œsophage','Estomac','Intestin grêle'],h:'L’œsophage relie la bouche à l’estomac.'},
  {t:'sort',title:'Je fais seul',q:'Classe chaque aliment selon le nutriment qu’il donne à la fin de la digestion. Touche un aliment, puis un nutriment.',
   bins:['Glucose','Acides aminés','Acides gras et glycérol'],
   items:[['Amidon du pain',0],['Protéines du fromage',1],['Huile d’olive',2],['Protéines des lentilles',1],['Beurre',2],['Maltose',0]],
   h:'Glucides → glucose ; protéines → acides aminés ; lipides → acides gras et glycérol.'}],
 reveal:'Bouche, œsophage, estomac, intestin grêle : les enzymes simplifient les aliments en nutriments (glucose, acides aminés, acides gras et glycérol). Ces petites molécules traversent la paroi de l’intestin grêle et passent dans le sang, qui les apporte aux muscles.',
 revealAr:'الفم ثم المريء ثم المعدة ثم المعي الدقيق: تبسّط الأنزيمات الأغذية إلى مغذيات (غلوكوز، أحماض أمينية، أحماض دهنية وغليسرول). تعبر هذه الجزيئات الصغيرة جدار المعي الدقيق وتمر إلى الدم الذي ينقلها إلى العضلات.',
 cliff:'Le glucose arrive au muscle. Mais sans un gaz de l’air, il ne libère presque pas d’énergie. Lequel ? Et que rejette-t-on en échange ?',
 cliffAr:'يصل الغلوكوز إلى العضلة. لكن دون غاز من الهواء لا يحرر تقريبا أي طاقة. ما هو؟ وماذا نطرح في المقابل؟'},
{id:'svt-3ac-echanges-gazeux',title:'Les échanges gazeux respiratoires',ar:'التبادلات الغازية التنفسية',ill:'chaux',
 key:{q:'Où les nutriments passent-ils dans le sang ?',o:['Dans l’estomac','Dans l’intestin grêle','Dans la bouche'],a:1,h:'C’est l’organe aux villosités.'},
 hook:'Souffle avec une paille dans de l’eau de chaux : elle se trouble. Fais passer l’air de la classe : elle reste claire. Que contient ton souffle que l’air de la classe n’a presque pas ?',
 hookAr:'انفخ بقصبة في ماء الجير: يتعكر. مرّر هواء القسم: يبقى صافيا. ماذا يحتوي نفَسك ولا يكاد يوجد في هواء القسم؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'L’eau de chaux se trouble en présence de dioxyde de carbone.',v:true,h:'C’est le test du CO2.'},
   {s:'L’air expiré contient plus de dioxygène que l’air inspiré.',v:false,h:'Le corps garde une partie du dioxygène : l’air expiré en contient moins.'},
   {s:'Les échanges gazeux se font au niveau des alvéoles pulmonaires.',v:true,h:'Leur paroi très fine touche les capillaires sanguins.'}]},
  {t:'num',title:'Exercice',q:'L’air inspiré contient 0,04 % de CO2, l’air expiré environ 4 %. Combien de fois plus de CO2 y a-t-il dans l’air expiré ?',
   ans:100,tol:0.01,unit:'',ph:'… fois',h:'Divise 4 par 0,04.'},
  {t:'qcm',title:'Je fais seul',q:'Pendant un effort, on respire plus vite parce que les muscles :',
   o:['consomment plus de dioxygène et rejettent plus de CO2','ont besoin de moins d’énergie','fabriquent du dioxygène'],a:0,h:'Plus d’effort, plus d’énergie, donc plus d’échanges gazeux.'}],
 reveal:'L’air expiré contient environ 4 % de CO2, contre 0,04 % dans l’air inspiré, et moins de dioxygène (16 % au lieu de 21 %). Dans les alvéoles, le dioxygène passe dans le sang et le CO2 en sort. Les cellules utilisent le dioxygène pour tirer l’énergie du glucose, et rejettent le CO2.',
 revealAr:'يحتوي الهواء الزفيري على حوالي 4 % من CO2 مقابل 0,04 % في الهواء الشهيقي، وعلى أكسجين أقل (16 % بدل 21 %). في الحويصلات الرئوية يمر الأكسجين إلى الدم ويخرج منه CO2. تستعمل الخلايا الأكسجين لاستخراج الطاقة من الغلوكوز، وتطرح CO2.',
 cliff:'Du pain jusqu’au souffle : saurais-tu raconter tout le voyage d’un seul trait ?',
 cliffAr:'من الخبز إلى النفَس: هل تستطيع أن تحكي الرحلة كلها دفعة واحدة؟'},
{id:'defi-regional',chest:true,title:'Coffre : le défi du régional',ar:'الصندوق: تحدي الامتحان الجهوي',ill:'coureur',
 key:{q:'Quel gaz trouble l’eau de chaux ?',o:['Le dioxygène','Le dioxyde de carbone','La vapeur d’eau'],a:1,h:'C’est celui que ton souffle contient 100 fois plus que l’air.'},
 hook:'Ahmed mange un sandwich, puis court 20 minutes. Explique en 5 étapes comment l’amidon du pain devient de l’énergie pour ses muscles, et pourquoi il souffle plus fort. Utilise : amylase, glucose, intestin grêle, sang, alvéoles, dioxygène, dioxyde de carbone.',
 hookAr:'أحمد يأكل شطيرة ثم يجري 20 دقيقة. اشرح في 5 مراحل كيف يصبح نشا الخبز طاقة لعضلاته، ولماذا يتنفس بقوة أكبر. استعمل: الأميلاز، الغلوكوز، المعي الدقيق، الدم، الحويصلات، الأكسجين، ثنائي أكسيد الكربون.'}
  ],
  audio: ['audio/s3ac-bab1.mp3','audio/s3ac-bab2.mp3','audio/s3ac-bab3.mp3','audio/s3ac-sandouq.mp3']
};
