/* Carte de chapitre « الباب الموالي » · Maths 3AC · La géométrie (Pythagore, trigonométrie, agrandissement-réduction).
   Les portes renvoient aux leçons Pro (pro.taalim.men/lecons/…), toujours ouvertes.
   Valeurs vérifiées par test/verif-maths-3ac-geometrie.mjs. Réponses numériques positives. */
window.BAB_CHAPTER = {
  id: 'maths-3ac-geometrie',
  storageKey: 'bab_mowali_maths3ac_geometrie_v1',
  title: 'La porte suivante', titleAr: 'الباب الموالي',
  kicker: 'Maths · 3AC · La géométrie',
  kickerAr: 'الرياضيات · الثالثة إعدادي · الهندسة',
  levelLabel: 'Les 3APIC ensemble', levelLabelAr: 'تلاميذ الثالثة إعدادي معا',
  courseBase: 'https://pro.taalim.men/lecons/',
  chestCourse: '',
  endpoint: 'https://relay.taalim.men/api/bab',  /* actif seulement depuis une origine autorisée (pro.taalim.men…) avec ?cls=3APIC */
  sim: { donePct: [84, 55, 30], stuck: [0, 3, 0] },
  bonusAt: 70, alertMin: 3,
  ill: (function(){ var W='viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"',
    T=function(x,y,t,c,s,w){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="'+(c||'#aaa3bf')+'" font-size="'+(s||11)+'"'+(w?' font-weight="700"':'')+' font-family="Figtree">'+t+'</text>'},
    ladder=function(x0,y0,x1,y1){var s='<line x1="'+x0+'" y1="'+y0+'" x2="'+x1+'" y2="'+y1+'" stroke="#ffcf5c" stroke-width="4" stroke-linecap="round"/>',dx=(x1-x0),dy=(y1-y0);
      for(var k=1;k<8;k++){var px=x0+dx*k/8,py=y0+dy*k/8;s+='<line x1="'+(px-6)+'" y1="'+(py-3)+'" x2="'+(px+6)+'" y2="'+(py+3)+'" stroke="#ffcf5c" stroke-width="2" opacity=".7"/>'}return s};
    return {
 echelle:'<svg class="illu" '+W+'><rect x="0" y="136" width="320" height="24" fill="#1e1a2b"/><rect x="230" y="20" width="22" height="116" fill="#2f2942"/>'+
  ladder(140,136,230,40)+'<path d="M218 136 v-12 h12" fill="none" stroke="#aaa3bf" stroke-width="1.5"/>'+
  T(172,80,'5 m','#ffcf5c',14,1)+T(185,152,'3 m','#6ccdb6',13,1)+T(270,92,'? m','#f27b60',15,1)+T(80,60,'« 5 − 3 = 2 m »','#f2eff9',12)+'</svg>',
 angle:'<svg class="illu" '+W+'><rect x="0" y="136" width="320" height="24" fill="#1e1a2b"/><rect x="230" y="20" width="22" height="116" fill="#2f2942"/>'+
  ladder(140,136,230,40)+'<path d="M166 136 A26 26 0 0 0 158 117" fill="none" stroke="#f27b60" stroke-width="2.5"/>'+T(178,128,'α','#f27b60',15,1)+
  T(172,80,'5 m','#ffcf5c',14,1)+T(185,152,'3 m','#6ccdb6',13,1)+T(84,62,'conseillé : 75°','#f2eff9',12,1)+T(84,80,'et celle-ci ?','#aaa3bf',12)+'</svg>',
 photo:'<svg class="illu" '+W+'><rect x="0" y="140" width="320" height="20" fill="#1e1a2b"/>'+
  '<rect x="34" y="78" width="40" height="60" rx="3" fill="#9b92dc" fill-opacity=".85"/><circle cx="54" cy="100" r="9" fill="#ffcf5c" fill-opacity=".8"/>'+
  '<rect x="130" y="18" width="80" height="120" rx="4" fill="#9b92dc" fill-opacity=".85"/><circle cx="170" cy="62" r="18" fill="#ffcf5c" fill-opacity=".8"/>'+
  T(54,70,'10 × 15','#f2eff9',11,1)+T(170,12,'20 × 30','#f2eff9',11,1)+'<path d="M82 108 h40" stroke="#6ccdb6" stroke-width="2.5"/>'+T(102,100,'k = 2','#6ccdb6',12,1)+
  T(266,70,'prix au cm²','#f2eff9',12,1)+T(266,92,'× 2 ou × 4 ?','#f27b60',14,1)+'</svg>',
 minaret:'<svg class="illu" '+W+'><rect x="0" y="130" width="320" height="30" fill="#1e1a2b"/>'+
  '<rect x="70" y="40" width="24" height="90" fill="#6ccdb6" fill-opacity=".85"/><rect x="66" y="32" width="32" height="10" fill="#6ccdb6"/><path d="M74 32 l8 -14 l8 14 z" fill="#6ccdb6"/>'+
  '<rect x="94" y="128" width="76" height="5" fill="#2f2942"/>'+
  '<circle cx="270" cy="36" r="14" fill="#ffcf5c"/><line x1="258" y1="44" x2="94" y2="40" stroke="#ffcf5c" stroke-width="1.5" stroke-dasharray="4 4"/><line x1="170" y1="130" x2="94" y2="40" stroke="#ffcf5c" stroke-width="2"/>'+
  '<path d="M148 130 A22 22 0 0 1 155.8 113.2" fill="none" stroke="#f27b60" stroke-width="2.5"/>'+T(136,122,'50°','#f27b60',12,1)+
  T(132,150,'ombre ?','#f27b60',12,1)+T(40,90,'maquette','#aaa3bf',11)+T(40,104,'30 cm · 1/100','#f2eff9',11,1)+'</svg>'
}; })(),
  doors: [
{id:'maths-3ac-pythagore',title:'Le théorème de Pythagore',ar:'مبرهنة فيثاغورس',ill:'echelle',
 hook:'Une échelle de 5 m est posée contre un mur, son pied à 3 m du mur. Le peintre annonce : « Elle touche le mur à 5 − 3 = 2 m. » Il se trompe. À quelle hauteur touche-t-elle vraiment ?',
 hookAr:'سُلّم طوله 5 m مسنود إلى حائط، وقدمه على بعد 3 m من الحائط. يقول الصبّاغ: «يلمس الحائط على ارتفاع 5 − 3 = 2 m». إنه مخطئ. على أي ارتفاع يلمس الحائط فعلا؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'Le théorème de Pythagore s’applique dans un triangle rectangle.',v:true,h:'Il faut un angle droit : ici, entre le mur et le sol.'},
   {s:'L’hypoténuse est le côté opposé à l’angle droit, le plus long.',v:true,h:'C’est l’échelle elle-même.'},
   {s:'Dans tout triangle, a² + b² = c².',v:false,h:'Seulement si le triangle est rectangle.'}]},
  {t:'num',title:'Exercice',q:'Un triangle est rectangle. Les côtés de l’angle droit mesurent 6 cm et 8 cm. Calcule l’hypoténuse en cm.',
   ans:10,tol:0.01,unit:'cm',ph:'en cm',h:'6² + 8² = 36 + 64 = 100, puis la racine carrée.'},
  {t:'qcm',title:'Je fais seul',q:'Un triangle a des côtés de 5 cm, 12 cm et 13 cm. Est-il rectangle ?',
   o:['Oui, car 5² + 12² = 13²','Non, il faudrait 5 + 12 = 13','On ne peut pas savoir sans rapporteur'],a:0,h:'25 + 144 = 169 = 13² : c’est la réciproque du théorème.'}],
 reveal:'3² + h² = 5², donc h² = 25 − 9 = 16 et h = 4 m. On ne soustrait pas les longueurs : on soustrait leurs carrés, puis on prend la racine.',
 revealAr:'3² + h² = 5²، إذن h² = 25 − 9 = 16 و h = 4 m. لا نطرح الأطوال، بل نطرح مربعاتها ثم نأخذ الجذر المربع.',
 cliff:'Cette échelle penche-t-elle trop ? Peut-on connaître son angle avec le sol sans rapporteur ?',
 cliffAr:'هل هذا السلم مائل أكثر من اللازم؟ هل يمكن معرفة زاويته مع الأرض دون منقلة؟'},
{id:'maths-3ac-trigonometrie-3d',title:'La trigonométrie',ar:'حساب المثلثات',ill:'angle',
 key:{q:'Dans un triangle rectangle, l’hypoténuse c vérifie :',o:['c = a + b','c² = a² + b²','c² = a² − b²'],a:1,h:'Tu as calculé 3² + h² = 5².'},
 hook:'Pour être sûre, une échelle doit faire environ 75° avec le sol. Celle-ci mesure 5 m et son pied est à 3 m du mur. Est-elle sûre, sans rapporteur ?',
 hookAr:'ليكون السلم آمنا، يجب أن يصنع زاوية حوالي 75° مع الأرض. هذا السلم طوله 5 m وقدمه على بعد 3 m من الحائط. هل هو آمن؟ دون منقلة.',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'cos α = côté adjacent ÷ hypoténuse.',v:true,h:'Le côté adjacent touche l’angle α, l’hypoténuse est en face de l’angle droit.'},
   {s:'sin α = côté opposé ÷ hypoténuse.',v:true,h:'Le côté opposé est en face de α.'},
   {s:'tan α = hypoténuse ÷ côté adjacent.',v:false,h:'tan α = côté opposé ÷ côté adjacent.'}]},
  {t:'num',title:'Exercice',q:'ABC est rectangle en B, avec AB = 4 cm et AC = 5 cm. Calcule cos Â.',
   ans:0.8,tol:0.001,unit:'',ph:'cos Â = …',h:'Pour l’angle Â, le côté adjacent est AB et l’hypoténuse AC : 4 ÷ 5.'},
  {t:'qcm',title:'Je fais seul',q:'Une échelle de 5 m fait 60° avec le sol. La distance de son pied au mur est :',
   o:['2,5 m','4,33 m','10 m'],a:0,h:'Distance = 5 × cos 60° = 5 × 0,5.'}],
 reveal:'cos α = 3 ÷ 5 = 0,6, donc α ≈ 53°. Loin des 75° conseillés : l’échelle risque de glisser. Pour 75°, il faut placer le pied à 5 × cos 75° ≈ 1,3 m du mur.',
 revealAr:'cos α = 3 ÷ 5 = 0,6، إذن α ≈ 53°. بعيدة عن 75° الموصى بها: قد ينزلق السلم. للحصول على 75° يجب وضع قدمه على بعد 5 × cos 75° ≈ 1,3 m من الحائط.',
 cliff:'Le photographe double la largeur et la hauteur d’une photo. Il annonce un prix quatre fois plus cher. A-t-il raison ?',
 cliffAr:'المصوّر يضاعف عرض الصورة وطولها، ويعلن ثمنا أغلى بأربع مرات. هل هو محق؟'},
{id:'maths-3ac-agrandissement-3d',title:'Agrandissement et réduction',ar:'التكبير والتصغير',ill:'photo',
 key:{q:'Dans un triangle rectangle, cos α est égal à :',o:['opposé ÷ hypoténuse','adjacent ÷ hypoténuse','opposé ÷ adjacent'],a:1,h:'Tu as calculé 3 ÷ 5 pour l’échelle.'},
 hook:'Une photo de 10 cm × 15 cm est agrandie : chaque longueur est multipliée par 2. Le papier se paie au cm². Le photographe demande quatre fois le prix. Pourquoi pas deux fois ?',
 hookAr:'صورة أبعادها 10 cm × 15 cm تُكبَّر: كل طول يُضرب في 2. الورق يُؤدّى ثمنه حسب cm². يطلب المصوّر أربعة أضعاف الثمن. لماذا ليس ضعفين؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'Dans un agrandissement de rapport k, les longueurs sont multipliées par k.',v:true,h:'C’est la définition du rapport k.'},
   {s:'Les aires sont multipliées par k².',v:true,h:'Une aire, c’est une longueur fois une longueur : k × k.'},
   {s:'Les volumes sont multipliés par k².',v:false,h:'Un volume a trois dimensions : k × k × k = k³.'}]},
  {t:'num',title:'Exercice',q:'Un cube de 2 cm d’arête est agrandi avec k = 3. Calcule le volume du grand cube en cm³.',
   ans:216,tol:0.01,unit:'cm³',ph:'en cm³',h:'Volume initial 2³ = 8 cm³, puis × 3³ = × 27.'},
  {t:'qcm',title:'Je fais seul',q:'Une réduction de rapport k = 0,5 divise l’aire par :',
   o:['2','4','8'],a:1,h:'L’aire est multipliée par 0,5² = 0,25, c’est-à-dire divisée par 4.'}],
 reveal:'Avant : 10 × 15 = 150 cm². Après : 20 × 30 = 600 cm², soit 4 × 150. Longueurs × 2, aire × 2² = 4 : le photographe a raison. Un volume, lui, serait multiplié par 2³ = 8.',
 revealAr:'قبل: 10 × 15 = 150 cm². بعد: 20 × 30 = 600 cm²، أي 4 × 150. الأطوال × 2، والمساحة × 2² = 4: المصوّر محق. أما الحجم فيُضرب في 2³ = 8.',
 cliff:'Une maquette, une ombre au soleil et un volume : les trois portes dans un seul problème.',
 cliffAr:'مجسّم وظل تحت الشمس وحجم: الأبواب الثلاثة في مسألة واحدة.'},
{id:'defi-regional',chest:true,title:'Coffre : le défi du régional',ar:'الصندوق: تحدي الامتحان الجهوي',ill:'minaret',
 key:{q:'Une réduction de rapport k multiplie les volumes par :',o:['k','k²','k³'],a:2,h:'Trois dimensions : k × k × k.'},
 hook:'La maquette d’un minaret est une réduction de rapport 1/100 et mesure 30 cm de haut. 1) Quelle est la hauteur réelle ? 2) Le soleil fait 50° avec le sol : quelle est la longueur de l’ombre du vrai minaret ? 3) Le volume de la maquette est 1,2 dm³ : quel est le volume réel ?',
 hookAr:'مجسّم صومعة هو تصغير بنسبة 1/100 وارتفاعه 30 cm. 1) ما الارتفاع الحقيقي؟ 2) أشعة الشمس تصنع 50° مع الأرض: ما طول ظل الصومعة الحقيقية؟ 3) حجم المجسّم 1,2 dm³: ما الحجم الحقيقي؟'}
  ],
  audio: ['audio/g3ac-bab1.mp3','audio/g3ac-bab2.mp3','audio/g3ac-bab3.mp3','audio/g3ac-sandouq.mp3']
};
