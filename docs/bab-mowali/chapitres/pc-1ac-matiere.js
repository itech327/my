/* Carte de chapitre pour le moteur « الباب الموالي » (bab.js).
   Un chapitre = 3 portes + 1 coffre qui ouvre le chapitre suivant. Aucun code ici : seulement des données.
   Champs d'une porte : id, title, ar, ill, hook, hookAr, frags[3], reveal, revealAr, cliff, cliffAr, key (sauf porte 1).
   Types de fragments : vf (vrai/faux), qcm, order (4 étapes), sort (classer dans 2-3 bacs), num (calcul : ans, tol, unit, ph = texte du champ).
   chestCourse vide : pas de lien de cours dans le coffre. */
window.BAB_CHAPTER = {
  id: 'pc-1ac-matiere',
  storageKey: 'bab_mowali_pc1ac_v0',
  title: 'La porte suivante', titleAr: 'الباب الموالي',
  kicker: 'PC · 1AC · Matière et environnement',
  kickerAr: 'الفيزياء والكيمياء · السنة الأولى إعدادي · المادة والبيئة',
  levelLabel: 'Les 1APIC ensemble', levelLabelAr: 'تلاميذ الأولى إعدادي معا',
  courseBase: 'https://taalim.men/physique-chimie.html#',
  chestCourse: 'Pression et pression atmosphérique',
  /* production : adresse du Worker pour les événements anonymes (vide = prototype local) */
  endpoint: '',
  /* prototype : valeurs de classe simulées, remplacées en production par le Worker */
  sim: { donePct: [82, 57, 31], stuck: [0, 2, 1] },
  bonusAt: 70, alertMin: 3,
  ill: (function(){ var W='viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"'; return {
 flaque:'<svg class="illu" '+W+'><circle cx="270" cy="38" r="18" fill="#ffcf5c"/>'+
  [0,1,2,3,4,5,6,7].map(function(i){var a=i*.785;return '<line x1="'+(270+Math.cos(a)*24)+'" y1="'+(38+Math.sin(a)*24)+'" x2="'+(270+Math.cos(a)*31)+'" y2="'+(38+Math.sin(a)*31)+'" stroke="#ffcf5c" stroke-width="2.5" stroke-linecap="round"/>'}).join('')+
  '<rect x="0" y="122" width="320" height="38" fill="#1e1a2b"/><line x1="0" y1="122" x2="320" y2="122" stroke="#2f2942" stroke-width="2"/>'+
  '<rect x="34" y="62" width="70" height="60" fill="#2f2942"/><polygon points="28,64 69,36 110,64" fill="#9b92dc"/><rect x="60" y="92" width="18" height="30" fill="#161320"/>'+
  '<ellipse cx="190" cy="132" rx="62" ry="10" fill="#6ccdb6" fill-opacity=".55"/>'+
  [170,190,210].map(function(x,i){return '<path d="M'+x+' 116 q-7 -12 0 -24 t0 -24" fill="none" stroke="#f2eff9" stroke-opacity=".35" stroke-width="2.5" stroke-dasharray="4 6" stroke-linecap="round"><animate attributeName="stroke-dashoffset" from="0" to="-40" dur="'+(2+i*.4)+'s" repeatCount="indefinite"/></path>'}).join('')+
  '<text x="190" y="155" text-anchor="middle" fill="#aaa3bf" font-size="11" font-family="Figtree">la flaque</text></svg>',
 etats:'<svg class="illu" '+W+'><rect x="0" y="128" width="320" height="32" fill="#1e1a2b"/>'+
  '<path d="M48 128 V70 q0 -10 10 -14 V40 h16 v16 q10 4 10 14 V128 Z" fill="none" stroke="#f2eff9" stroke-width="2.5"/><path d="M50 128 V90 h32 V128 Z" fill="#6ccdb6" fill-opacity=".6"/><rect x="56" y="32" width="20" height="8" rx="2" fill="#9b92dc"/>'+
  '<polygon points="130,128 140,104 166,98 184,112 180,128" fill="#aaa3bf"/><polygon points="140,104 166,98 160,110" fill="#f2eff9" fill-opacity=".3"/>'+
  '<ellipse cx="252" cy="70" rx="30" ry="36" fill="#e371cb" fill-opacity=".75"/><path d="M252 106 l-5 7 h10 z" fill="#e371cb"/><path d="M252 113 q-8 8 0 15" fill="none" stroke="#f2eff9" stroke-width="1.5"/>'+
  '<text x="66" y="150" text-anchor="middle" fill="#aaa3bf" font-size="11" font-family="Figtree">eau</text><text x="158" y="150" text-anchor="middle" fill="#aaa3bf" font-size="11" font-family="Figtree">caillou</text><text x="252" y="150" text-anchor="middle" fill="#aaa3bf" font-size="11" font-family="Figtree">air</text></svg>',
 balance:'<svg class="illu" '+W+'><rect x="0" y="136" width="320" height="24" fill="#1e1a2b"/><polygon points="160,58 140,136 180,136" fill="#2f2942"/>'+
  '<g transform="rotate(-7 160 58)"><line x1="60" y1="58" x2="260" y2="58" stroke="#f2eff9" stroke-width="4" stroke-linecap="round"/>'+
  '<line x1="70" y1="58" x2="70" y2="96" stroke="#aaa3bf"/><line x1="250" y1="58" x2="250" y2="96" stroke="#aaa3bf"/>'+
  '<rect x="45" y="96" width="50" height="6" rx="3" fill="#9b92dc"/><rect x="225" y="96" width="50" height="6" rx="3" fill="#9b92dc"/>'+
  '<rect x="56" y="58" width="28" height="38" rx="5" fill="#ffcf5c" fill-opacity=".8"/><rect x="236" y="58" width="28" height="38" rx="5" fill="#6ccdb6" fill-opacity=".8"/>'+
  '<text x="70" y="82" text-anchor="middle" font-size="11" font-weight="700" fill="#241a00" font-family="Figtree">1 L</text><text x="250" y="82" text-anchor="middle" font-size="11" font-weight="700" fill="#0d2a24" font-family="Figtree">1 L</text></g>'+
  '<text x="70" y="128" text-anchor="middle" fill="#aaa3bf" font-size="11" font-family="Figtree">huile</text><text x="250" y="128" text-anchor="middle" fill="#aaa3bf" font-size="11" font-family="Figtree">eau</text></svg>',
 paille:'<svg class="illu" '+W+'><rect x="0" y="136" width="320" height="24" fill="#1e1a2b"/>'+
  '<path d="M60 50 L70 136 H120 L130 50" fill="none" stroke="#f2eff9" stroke-width="2.5"/><path d="M64 84 L70 136 H120 L126 84 Z" fill="#f27b60" fill-opacity=".55"/>'+
  '<line x1="108" y1="128" x2="142" y2="20" stroke="#e371cb" stroke-width="7" stroke-linecap="round"/><line x1="108" y1="128" x2="119" y2="94" stroke="#f27b60" stroke-width="5" stroke-linecap="round"/>'+
  '<rect x="178" y="74" width="96" height="26" rx="4" fill="none" stroke="#f2eff9" stroke-width="2.5"/><rect x="180" y="76" width="54" height="22" fill="#6ccdb6" fill-opacity=".25"/>'+
  '<line x1="234" y1="72" x2="234" y2="102" stroke="#9b92dc" stroke-width="5"/><line x1="234" y1="87" x2="300" y2="87" stroke="#9b92dc" stroke-width="4"/><line x1="300" y1="76" x2="300" y2="98" stroke="#9b92dc" stroke-width="5"/>'+
  '<circle cx="174" cy="87" r="5" fill="#f27b60"/>'+
  '<text x="95" y="152" text-anchor="middle" fill="#aaa3bf" font-size="11" font-family="Figtree">paille</text><text x="236" y="124" text-anchor="middle" fill="#aaa3bf" font-size="11" font-family="Figtree">seringue bouchée</text></svg>'
}; })(),
  doors: [
{id:'c1-1',title:'L’eau dans la nature',ar:'الماء في الطبيعة',ill:'flaque',
 hook:'Après la pluie, la flaque devant l’école disparaît en une journée. Où est partie l’eau ?',
 hookAr:'بعد المطر تختفي البركة أمام المدرسة في يوم واحد. أين ذهب الماء؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'La vapeur d’eau est visible.',v:false,h:'Regarde l’air au-dessus d’une casserole avant la «fumée» : on ne voit rien. La vapeur d’eau est invisible.'},
   {s:'Les nuages sont formés de petites gouttes d’eau liquide.',v:true,h:'En altitude, la vapeur se refroidit et se condense en gouttelettes.'},
   {s:'La neige est de l’eau à l’état solide.',v:true,h:'Neige, glace, grêle : c’est l’eau solide.'}]},
  {t:'order',title:'Exercice',q:'Remets les étapes du cycle de l’eau dans l’ordre, en partant de la mer.',
   items:['Évaporation','Condensation','Précipitations','Ruissellement'],h:'Le Soleil chauffe d’abord la mer. Ensuite la vapeur monte et se refroidit…'},
  {t:'qcm',title:'Je fais seul',q:'La flaque a disparu parce que son eau…',
   o:['n’existe plus du tout','s’est transformée en vapeur d’eau invisible','est devenue un nuage juste au-dessus de la flaque'],a:1,
   h:'L’eau ne disparaît jamais : elle change d’état. Quel état est invisible ?'}],
 reveal:'L’eau de la flaque ne disparaît pas : elle s’évapore et devient vapeur d’eau, un gaz invisible. Une partie s’infiltre aussi dans le sol.',
 revealAr:'ماء البركة لا يختفي: إنه يتبخر ويصبح بخار ماء، وهو غاز لا يُرى. وجزء منه يتسرب إلى التربة.',
 cliff:'Mais pourquoi la vapeur s’étale partout, alors que le caillou garde sa forme ?',
 cliffAr:'لكن لماذا ينتشر البخار في كل مكان، بينما يحافظ الحجر على شكله؟'},
{id:'c1-2',title:'Les trois états de la matière',ar:'الحالات الفيزيائية الثلاث للمادة',ill:'etats',
 key:{q:'Comment s’appelle le passage de l’eau liquide à la vapeur, vu à la porte 1 ?',o:['La condensation','L’évaporation','La solidification'],a:1,h:'Pense à la flaque au soleil.'},
 hook:'L’eau prend la forme de la bouteille. Le caillou garde la sienne. Et l’air du ballon ?',
 hookAr:'يأخذ الماء شكل القارورة، والحجر يحافظ على شكله. فماذا عن هواء البالون؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'Un solide a une forme propre.',v:true,h:'Le caillou garde sa forme, quel que soit le récipient.'},
   {s:'Un liquide a une forme propre.',v:false,h:'L’eau prend la forme du verre, puis celle de l’assiette.'},
   {s:'Un gaz occupe tout le volume qui lui est offert.',v:true,h:'Le parfum ouvert dans un coin finit par remplir la classe.'}]},
  {t:'sort',title:'Exercice',q:'Range chaque matière dans son état. Touche une matière, puis un état.',
   bins:['Solide','Liquide','Gaz'],items:[['Glaçon',0],['Huile',1],['Vapeur d’eau',2],['Craie',0],['Lait',1],['Air',2]],
   h:'Demande-toi : a-t-il une forme propre ? Peut-on le verser ? Remplit-il tout l’espace ?'},
  {t:'qcm',title:'Je fais seul',q:'Au repos, la surface libre d’un liquide est :',
   o:['inclinée comme le récipient','plane et horizontale','toujours bombée'],a:1,h:'Penche un verre d’eau et regarde la surface : elle reste…'}],
 reveal:'L’air est un gaz : il n’a ni forme propre ni volume propre, il occupe tout l’espace. Le liquide n’a pas de forme propre mais garde son volume. Le solide garde les deux.',
 revealAr:'الهواء غاز: ليس له شكل خاص ولا حجم خاص، ويشغل كل الحيز. السائل ليس له شكل خاص لكنه يحافظ على حجمه. والصلب يحافظ على الاثنين.',
 cliff:'Un litre d’huile et un litre d’eau sur une balance : lequel l’emporte ?',
 cliffAr:'لتر من الزيت ولتر من الماء على ميزان: أيهما يرجح؟'},
{id:'c1-3',title:'Volume, masse et masse volumique',ar:'الحجم والكتلة والكتلة الحجمية',ill:'balance',
 key:{q:'Quel état n’a ni forme propre ni volume propre ?',o:['L’état solide','L’état liquide','L’état gazeux'],a:2,h:'Le ballon, le parfum dans la classe…'},
 hook:'Même volume, 1 L chacun. L’huile et l’eau ont-elles la même masse ?',
 hookAr:'نفس الحجم، لتر لكل منهما. هل للزيت والماء نفس الكتلة؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'Le volume peut s’exprimer en litres ou en m³.',v:true,h:'L, mL, m³, cm³ : ce sont des unités de volume.'},
   {s:'On mesure une masse avec une éprouvette graduée.',v:false,h:'L’éprouvette mesure un volume. La masse se mesure avec une balance.'},
   {s:'1 L = 1000 mL.',v:true,h:'Le préfixe milli veut dire un millième.'}]},
  {t:'num',title:'Exercice',q:'100 mL d’huile ont une masse de 92 g. Calcule sa masse volumique ρ = m / V en g/mL.',
   ans:0.92,tol:0.005,unit:'g/mL',ph:'ρ en g/mL',h:'Divise la masse par le volume : 92 ÷ 100.'},
  {t:'qcm',title:'Je fais seul',q:'ρ de l’eau = 1 g/mL et ρ de l’huile = 0,92 g/mL. Pour 1 L de chacun :',
   o:['l’huile est plus légère','l’eau est plus légère','ils ont la même masse'],a:0,h:'Calcule m = ρ × V avec V = 1000 mL pour chacun.'}],
 reveal:'1 L d’eau a une masse de 1000 g, 1 L d’huile seulement 920 g. Même volume, masses différentes : c’est la masse volumique. Voilà pourquoi l’huile flotte sur l’eau.',
 revealAr:'كتلة لتر من الماء 1000 غ، وكتلة لتر من الزيت 920 غ فقط. نفس الحجم وكتل مختلفة: هذه هي الكتلة الحجمية. لهذا يطفو الزيت فوق الماء.',
 cliff:'Quand tu aspires dans une paille, qui pousse vraiment le jus vers ta bouche ?',
 cliffAr:'حين تمتص بالقصبة، من الذي يدفع العصير فعلا نحو فمك؟'},
{id:'c1-4',chest:true,title:'Chapitre suivant : la pression',ar:'الفصل الموالي: الضغط',ill:'paille',
 key:{q:'Quelle formule donne la masse volumique ?',o:['ρ = m × V','ρ = m / V','ρ = V / m'],a:1,h:'Tu as divisé 92 g par 100 mL.'},
 hook:'Bouche une seringue pleine d’air : tu peux enfoncer le piston. Pleine d’eau : impossible. Pourquoi ?',
 hookAr:'سد محقنة مملوءة بالهواء: يمكنك دفع المكبس. ومملوءة بالماء: مستحيل. لماذا؟'}
  ],
  audio: ['audio/bab1.mp3','audio/bab2.mp3','audio/bab3.mp3','audio/sandouq.mp3']
};
