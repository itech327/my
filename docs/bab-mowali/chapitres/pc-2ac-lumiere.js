/* Carte de chapitre « الباب الموالي » · PC 2AC · La lumière (propagation, lentilles, l’œil).
   Porte 2 : leçon Pro « Lentilles minces ». Portes 1 et 3, et coffre : leçons du site public pc.taalim.men, via « url ».
   Valeurs vérifiées par test/verif-pc-2ac-lumiere.mjs. Consigne de sécurité : ne jamais regarder le Soleil, même à travers une loupe. */
window.BAB_CHAPTER = {
  id: 'pc-2ac-lumiere',
  storageKey: 'bab_mowali_pc2ac_lumiere_v1',
  title: 'La porte suivante', titleAr: 'الباب الموالي',
  kicker: 'PC · 2AC · La lumière',
  kickerAr: 'الفيزياء والكيمياء · الثانية إعدادي · الضوء',
  levelLabel: 'Les 2APIC ensemble', levelLabelAr: 'تلاميذ الثانية إعدادي معا',
  courseBase: 'https://pro.taalim.men/lecons/',
  chestCourse: 'Le courant alternatif',
  endpoint: 'https://relay.taalim.men/api/bab',  /* actif seulement depuis une origine autorisée (pro.taalim.men…) avec ?cls=2APIC */
  sim: { donePct: [82, 53, 27], stuck: [0, 3, 1] },
  bonusAt: 70, alertMin: 3,
  ill: (function(){ var W='viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"',
    T=function(x,y,t,c,s,w){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="'+(c||'#aaa3bf')+'" font-size="'+(s||11)+'"'+(w?' font-weight="700"':'')+' font-family="Figtree">'+t+'</text>'};
    return {
 eclipse:'<svg class="illu" '+W+'>'+
  '<circle cx="40" cy="80" r="34" fill="#ffcf5c"/><circle cx="168" cy="80" r="8" fill="#aaa3bf"/><circle cx="292" cy="80" r="22" fill="#4c7bf2" fill-opacity=".8"/>'+
  '<path d="M40 46 L292 74 M40 114 L292 86" stroke="#ffcf5c" stroke-width="1" stroke-opacity=".5"/><path d="M168 72 L282 78 L282 82 L168 88 z" fill="#161320" fill-opacity=".8"/>'+
  T(40,134,'Soleil','#f2eff9',11,1)+T(168,104,'Lune','#f2eff9',11,1)+T(292,120,'Terre','#f2eff9',11,1)+T(160,26,'400 fois plus petite… et le cache ?','#f27b60',12,1)+'</svg>',
 loupe:'<svg class="illu" '+W+'>'+
  [40,62,84,106,128].map(function(y){return '<line x1="10" y1="'+y+'" x2="130" y2="'+y+'" stroke="#ffcf5c" stroke-width="2"/><line x1="140" y1="'+y+'" x2="226" y2="84" stroke="#ffcf5c" stroke-width="2"/>'}).join('')+
  '<ellipse cx="136" cy="84" rx="10" ry="56" fill="#9bd0ff" fill-opacity=".45" stroke="#9bd0ff" stroke-width="2"/>'+
  '<rect x="226" y="40" width="6" height="96" fill="#f2eff9" fill-opacity=".8"/><circle cx="226" cy="84" r="6" fill="#f27b60"/>'+
  T(226,30,'feuille','#f2eff9',11,1)+T(226,150,'un point brûlant ?','#f27b60',12,1)+T(60,150,'Soleil','#aaa3bf',11)+'</svg>',
 oeil:'<svg class="illu" '+W+'>'+
  '<ellipse cx="200" cy="80" rx="70" ry="52" fill="#f2eff9" fill-opacity=".12" stroke="#f2eff9" stroke-width="2"/><ellipse cx="140" cy="80" rx="8" ry="22" fill="#9bd0ff" fill-opacity=".6"/>'+
  '<path d="M262 40 q16 40 0 80" fill="none" stroke="#f27b60" stroke-width="4"/>'+
  '<path d="M20 60 L140 66 L230 80 M20 100 L140 94 L230 80" fill="none" stroke="#ffcf5c" stroke-width="2"/><circle cx="230" cy="80" r="4" fill="#ffcf5c"/>'+
  T(252,140,'rétine','#f27b60',11,1)+T(230,64,'image ici ?','#ffcf5c',11,1)+T(60,40,'tableau, au loin','#f2eff9',11,1)+T(140,124,'cristallin','#9bd0ff',11)+'</svg>',
 prise:'<svg class="illu" '+W+'>'+
  '<rect x="34" y="40" width="80" height="80" rx="16" fill="#2f2942"/><circle cx="60" cy="80" r="7" fill="#161320"/><circle cx="88" cy="80" r="7" fill="#161320"/>'+T(74,136,'220 V · 50 Hz','#f2eff9',12,1)+
  '<path d="M140 80 '+(function(){var d='';for(var i=0;i<=60;i++){var x=140+i*2.6,y=80-34*Math.sin(i/60*Math.PI*6);d+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' '}return d})()+'" fill="none" stroke="#6ccdb6" stroke-width="2.5"/>'+
  '<line x1="140" y1="80" x2="300" y2="80" stroke="#aaa3bf" stroke-width="1"/>'+T(220,30,'change de sens 100 fois par seconde','#f2eff9',11,1)+T(220,140,'et la lampe ne clignote pas ?','#f27b60',12,1)+'</svg>'
}; })(),
  doors: [
{id:'2ac-propagation',url:'https://pc.taalim.men/2ac-propagation/',title:'La propagation de la lumière',ar:'انتشار الضوء',ill:'eclipse',
 hook:'Lors d’une éclipse totale de Soleil, la Lune, environ 400 fois plus petite que le Soleil, arrive à le cacher entièrement. Comment est-ce possible ?',
 hookAr:'أثناء كسوف كلي للشمس، يستطيع القمر، وهو أصغر من الشمس بحوالي 400 مرة، أن يحجبها كليا. كيف يمكن ذلك؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'Dans un milieu transparent et homogène, la lumière se propage en ligne droite.',v:true,h:'C’est pour cela qu’on représente un rayon par une droite.'},
   {s:'Dans le vide, la lumière va à environ 300 000 km par seconde.',v:true,h:'C’est la vitesse la plus grande qui existe.'},
   {s:'Un objet opaque laisse passer la lumière.',v:false,h:'Opaque : la lumière ne passe pas, il y a une ombre derrière.'}]},
  {t:'num',title:'Exercice',q:'La lumière du Soleil met environ 500 s pour arriver sur Terre, à 300 000 km/s. Quelle distance parcourt-elle, en millions de km ?',
   ans:150,tol:0.5,unit:'millions de km',ph:'en millions de km',h:'300 000 × 500 = 150 000 000 km.'},
  {t:'qcm',title:'Je fais seul',q:'L’ombre portée d’un objet éclairé se forme :',
   o:['derrière l’objet, du côté opposé à la source','du côté de la source','tout autour de l’objet'],a:0,h:'La lumière va tout droit : l’objet bloque les rayons qui le touchent.'}],
 reveal:'La lumière va tout droit. Le Soleil est environ 400 fois plus large que la Lune, mais aussi environ 400 fois plus loin : vus de la Terre, les deux disques paraissent de la même taille. Quand ils sont alignés, la Lune bloque les rayons et son ombre tombe sur la Terre.',
 revealAr:'الضوء ينتشر في خط مستقيم. الشمس أعرض من القمر بحوالي 400 مرة، لكنها أبعد منه أيضا بحوالي 400 مرة: من الأرض يبدو القرصان بنفس الحجم. وحين يصطفان يحجب القمر الأشعة ويقع ظله على الأرض.',
 cliff:'Avec une loupe, on concentre la lumière du Soleil en un point si brillant qu’il peut chauffer une feuille. Que se passe-t-il en ce point ?',
 cliffAr:'بواسطة مكبرة نركز ضوء الشمس في نقطة لامعة إلى حد أنها تُسخّن ورقة. ماذا يحدث في هذه النقطة؟'},
{id:'pc-2ac-lentilles',title:'Les lentilles minces',ar:'العدسات الرقيقة',ill:'loupe',
 key:{q:'Dans un milieu transparent et homogène, la lumière se propage :',o:['en zigzag','en ligne droite','en cercle'],a:1,h:'C’est ce qui explique l’ombre et l’éclipse.'},
 hook:'Une loupe concentre la lumière du Soleil en un point si brillant qu’il chauffe une feuille. Un autre verre, lui, étale la lumière au lieu de la concentrer. Qu’est-ce qui les distingue ?',
 hookAr:'مكبرة تركز ضوء الشمس في نقطة لامعة تُسخّن ورقة. وزجاج آخر ينشر الضوء بدل أن يركزه. ما الذي يميز بينهما؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'Une lentille convergente a des bords plus minces que son centre.',v:true,h:'La loupe est bombée au milieu.'},
   {s:'Une lentille divergente concentre les rayons en un foyer.',v:false,h:'Divergente : elle écarte les rayons.'},
   {s:'Plus la distance focale est courte, plus la lentille est convergente.',v:true,h:'Les rayons se rejoignent plus près de la lentille.'}]},
  {t:'sort',title:'Exercice',q:'Classe chaque lentille. Touche une lentille, puis une catégorie.',
   bins:['Convergente','Divergente'],
   items:[['Loupe',0],['Bords minces, centre épais',0],['Objectif d’un projecteur',0],['Bords épais, centre mince',1],['Écarte un faisceau parallèle',1],['Verre de lunettes pour myope',1]],
   h:'Convergente : elle rassemble la lumière. Divergente : elle l’étale.'},
  {t:'qcm',title:'Je fais seul',q:'Un faisceau parallèle traverse une loupe et se concentre à 10 cm d’elle. Ces 10 cm sont :',
   o:['la distance focale','le rayon de la loupe','le diamètre de la loupe'],a:0,h:'C’est la distance entre le centre de la lentille et son foyer.'}],
 reveal:'La loupe est une lentille convergente : ses bords sont minces. Elle dévie les rayons parallèles vers un même point, le foyer image. Toute la lumière y est concentrée et la feuille chauffe. La distance entre le centre et le foyer est la distance focale. Attention : ne regarde jamais le Soleil, même à travers une loupe.',
 revealAr:'المكبرة عدسة مُجمِّعة: حافتاها رقيقتان. تحرف الأشعة المتوازية نحو نقطة واحدة هي البؤرة الصورة. يتركز فيها كل الضوء فتسخن الورقة. المسافة بين المركز والبؤرة هي المسافة البؤرية. تنبيه: لا تنظر أبدا إلى الشمس، ولو عبر مكبرة.',
 cliff:'Depuis le fond de la classe, Samir voit flou le tableau. Son œil contient une lentille. Quelles lunettes lui faut-il ?',
 cliffAr:'من آخر القسم يرى سمير السبورة ضبابية. عينه تحتوي على عدسة. أي نظارات يحتاج؟'},
{id:'2ac-loupe-oeil',url:'https://pc.taalim.men/2ac-loupe-oeil/',title:'La loupe et l’œil',ar:'المكبرة والعين',ill:'oeil',
 key:{q:'Après une loupe, les rayons parallèles se rejoignent :',o:['au foyer','au centre de la loupe','nulle part'],a:0,h:'C’est là que la feuille chauffait.'},
 hook:'Depuis le fond de la classe, Samir voit flou le tableau, mais il lit très bien son cahier. Son œil fonctionne comme une lentille. Que se passe-t-il, et quelles lunettes lui rendront une image nette ?',
 hookAr:'من آخر القسم يرى سمير السبورة ضبابية، لكنه يقرأ دفتره جيدا. عينه تعمل مثل عدسة. ماذا يحدث؟ وأي نظارات ستعيد له صورة واضحة؟',
 frags:[
  {t:'vf',title:'Je me prépare',items:[
   {s:'Le cristallin de l’œil se comporte comme une lentille convergente.',v:true,h:'Il forme l’image sur le fond de l’œil.'},
   {s:'Pour un œil normal, l’image d’un objet lointain se forme sur la rétine.',v:true,h:'La rétine est l’écran de l’œil.'},
   {s:'Un œil myope voit flou de près.',v:false,h:'Le myope voit bien de près et flou de loin.'}]},
  {t:'order',title:'Exercice',q:'Range les parties de l’œil dans l’ordre où la lumière les traverse.',
   items:['Cornée','Pupille','Cristallin','Rétine'],h:'La rétine est tout au fond : c’est l’écran.'},
  {t:'qcm',title:'Je fais seul',q:'Chez un œil myope, l’image d’un objet lointain se forme :',
   o:['devant la rétine','derrière la rétine','exactement sur la rétine'],a:0,h:'L’œil myope est trop convergent : les rayons se rejoignent trop tôt.'}],
 reveal:'L’œil de Samir est trop convergent : l’image du tableau se forme devant la rétine, d’où le flou. Une lentille divergente placée devant l’œil écarte un peu les rayons, et l’image revient sur la rétine. Ce sont des lunettes de myope.',
 revealAr:'عين سمير مُجمِّعة أكثر من اللازم: صورة السبورة تتكون أمام الشبكية، لذلك يرى ضبابا. عدسة مُفرِّقة أمام العين تُبعد الأشعة قليلا فتعود الصورة إلى الشبكية. إنها نظارات قصر النظر.',
 cliff:'Sur la prise de la maison, il est écrit 220 V et 50 Hz. Que signifient ces nombres ?',
 cliffAr:'على مأخذ التيار في المنزل كُتب 220 V و 50 Hz. ماذا يعني هذان العددان؟'},
{id:'2ac-courant-alternatif',url:'https://pc.taalim.men/2ac-courant-alternatif/',chest:true,title:'Chapitre suivant : le courant alternatif',ar:'الفصل الموالي: التيار المتناوب',ill:'prise',
 key:{q:'Quel type de lentille corrige la myopie ?',o:['une lentille convergente','une lentille divergente','aucune lentille'],a:1,h:'L’œil myope est trop convergent : il faut écarter un peu les rayons.'},
 hook:'Sur la prise de la maison : 220 V, 50 Hz. Le courant y change de sens 100 fois par seconde. Pourtant, la lampe ne clignote pas. Comment est-ce possible ?',
 hookAr:'على مأخذ التيار في المنزل: 220 V و 50 Hz. التيار يغير منحاه 100 مرة في الثانية. ومع ذلك لا يومض المصباح. كيف يمكن ذلك؟'}
  ],
  audio: ['audio/l2ac-bab1.mp3','audio/l2ac-bab2.mp3','audio/l2ac-bab3.mp3','audio/l2ac-sandouq.mp3']
};
