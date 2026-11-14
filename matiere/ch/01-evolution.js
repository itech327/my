/* ===================================================== 1. ÉVOLUTION DES SYSTÈMES TECHNIQUES */
var TYPES = {
  primitif: { t: 'Système primitif', c: P, en: 'Énergie musculaire', cm: 'Commande humaine', ex: 'la houe pour travailler la terre',
    d: 'L’énergie vient de l’être humain (sa force musculaire) et c’est lui qui commande chaque geste.', ep: 'Époque ancienne' },
  mecanise: { t: 'Système mécanisé', c: T, en: 'Énergie d’un moteur', cm: 'Commande humaine', ex: 'le tracteur conduit par l’agriculteur',
    d: 'Un moteur (thermique ou électrique) apporte l’énergie, mais l’être humain commande encore le système.', ep: 'XIXe et XXe siècles' },
  automatise: { t: 'Système automatisé', c: L, en: 'Énergie d’un moteur', cm: 'Commande automatique', ex: 'l’arrosage automatique',
    d: 'L’énergie vient d’un moteur et la commande se fait sans intervention humaine, grâce à des capteurs et à une unité de traitement.', ep: 'Seconde moitié du XXe siècle' },
  robotise: { t: 'Système robotisé', c: C, en: 'Énergie d’un moteur', cm: 'Commande programmée et adaptable', ex: 'le robot agricole qui désherbe',
    d: 'Un robot (bras articulé ou mobile) est programmable, polyvalent et s’adapte à son environnement grâce à ses capteurs.', ep: 'XXIe siècle' }
};
var TKEYS = ['primitif', 'mecanise', 'automatise', 'robotise'];

function quatreTypes(el) {
  var svg = ui.stage(el, 400, 230, 'Énergie et commande des quatre types de systèmes'), g = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el);
  function show(k) {
    var D = TYPES[k]; g.replaceChildren();
    block(g, 14, 22, 112, 54, 'Énergie\n' + D.en.replace('Énergie ', ''), D.c, 12);
    block(g, 14, 154, 112, 54, 'Commande\n' + D.cm.replace('Commande ', ''), D.c, 12);
    rect(g, 170, 56, 216, 118, D.c, .12, 14, 2);
    picto(g, k, 278, 114, 1.15);
    txt(g, 278, 194, D.t, D.c, 'middle', 14, true);
    arrow(g, 126, 52, 168, 90, D.c); arrow(g, 126, 180, 168, 140, D.c);
    chips.set(ui.chip(D.en, D.c) + ui.chip(D.cm, D.c));
    info.set('<b>' + D.t + '.</b> ' + D.d + ' Exemple : ' + D.ex + '.');
  }
  ui.tabs(el, TKEYS.map(function (k) { return [k, TYPES[k].t.replace('Système ', '')]; }), show);
  show('primitif');
}

function frise(el) {
  var svg = ui.stage(el, 400, 210, 'Frise chronologique : cultiver la terre'), g = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el);
  var xs = [52, 140, 228, 316];
  ln(g, 30, 138, 372, 138, 'rgba(255,255,255,.35)', 3);
  var dots = xs.map(function (x, i) {
    var d = circ(g, x, 138, 11, TYPES[TKEYS[i]].c, .3);
    d.style.cursor = 'pointer'; d.addEventListener('click', function () { sl.set(i + 1); show(i); }); return d;
  });
  var mark = S('g', null, svg), pic = S('g', null, svg), tl = S('g', null, svg);
  function show(i) {
    var k = TKEYS[i], D = TYPES[k];
    dots.forEach(function (d, j) { d.setAttribute('r', j === i ? 15 : 11); d.style.fillOpacity = j === i ? .9 : .3; });
    pic.replaceChildren(); picto(pic, k, 200, 66, 1.05);
    tl.replaceChildren();
    xs.forEach(function (x, j) { txt(tl, x, 168, TYPES[TKEYS[j]].t.replace('Système ', ''), j === i ? TYPES[TKEYS[j]].c : 'rgba(255,255,255,.55)', 'middle', 11, j === i); });
    txt(tl, 200, 196, D.ep, D.c, 'middle', 12);
    chips.set(ui.chip(D.en, D.c) + ui.chip(D.cm, D.c));
    info.set('<b>' + D.t + '</b> : ' + D.ex + '. ' + D.d);
  }
  var sl = ui.slider(el, { label: 'Étape', min: 1, max: 4, value: 1, step: 1, color: C, fmt: function (v) { return TYPES[TKEYS[v - 1]].t.replace('Système ', ''); } }, function (v) { show(v - 1); });
  show(0);
}

function cablee(el) {
  var svg = ui.stage(el, 400, 250, 'Technologie câblée et technologie programmée'), g = S('g', null, svg);
  var info = ui.info(el), verd = ui.verdict(el);
  var mode = 'cable', changed = false;
  function draw() {
    g.replaceChildren();
    var col = mode === 'cable' ? GOLD : T;
    block(g, 14, 92, 72, 56, 'Capteur\n(bouton)', P, 12);
    block(g, 314, 92, 72, 56, 'Lampe', C, 12);
    if (mode === 'cable') {
      rect(g, 120, 40, 160, 160, GOLD, .08, 14, 2);
      txt(g, 200, 58, 'Circuit câblé', GOLD, 'middle', 12, true);
      block(g, 138, 74, 56, 34, 'Relais', GOLD, 11); block(g, 206, 74, 56, 34, 'Porte', GOLD, 11);
      ln(g, 166, 108, 166, 128, GOLD, 2.5); ln(g, 166, 128, 234, 128, GOLD, 2.5); ln(g, 234, 128, 234, 108, GOLD, 2.5);
      if (changed) { block(g, 150, 148, 100, 36, 'Temporisation\najoutée', C, 11); ln(g, 200, 128, 200, 148, C, 2.5); }
    } else {
      rect(g, 120, 40, 160, 160, T, .08, 14, 2);
      txt(g, 200, 58, 'Carte programmable', T, 'middle', 12, true);
      var code = changed ? ['si bouton alors', '  allumer lampe', '  attendre 5 s', '  éteindre lampe'] : ['si bouton alors', '  allumer lampe', 'sinon', '  éteindre lampe'];
      code.forEach(function (s, i) { txt(g, 138, 90 + i * 20, s, changed && i === 2 ? C : INK, 'start', 12); });
      txt(g, 200, 186, changed ? 'Nouveau programme téléversé' : 'Programme', changed ? C : 'rgba(255,255,255,.6)', 'middle', 11);
    }
    arrow(g, 86, 120, 118, 120, col); arrow(g, 282, 120, 312, 120, col);
    if (changed) {
      info.set(mode === 'cable' ? 'Pour ajouter une temporisation, il faut <b>modifier le câblage</b> : ajouter un composant et refaire des liaisons.' : 'Pour ajouter la temporisation, il suffit de <b>modifier le programme</b> puis de le téléverser. Aucun fil n’est changé.');
      verd.set(mode === 'cable' ? 'Câblée : modification matérielle.' : 'Programmée : modification logicielle.', mode === 'cable' ? '' : 'ok');
    } else {
      info.set(mode === 'cable' ? '<b>Technologie câblée</b> : la logique de fonctionnement est réalisée par des composants reliés par des fils. Le comportement est fixé par le câblage.' : '<b>Technologie programmée</b> : la logique est écrite dans un programme exécuté par une carte électronique. Le comportement dépend du programme.');
      verd.set('', '');
    }
  }
  ui.tabs(el, [['cable', 'Câblée'], ['prog', 'Programmée']], function (k) { mode = k; changed = false; draw(); });
  var ctl = ui.controls(el);
  ui.btn(ctl, 'Garder la lampe allumée 5 s', function () { changed = !changed; draw(); });
  draw();
}

PC.chapter({ id: 't3-1', lazy: true, eyebrow: EY + 'Module 1', title: 'Évolution des systèmes techniques', ar: 'تطوّر الأنظمة التقنية',
  lessons: function () { return [
    { short: 'Quatre types', title: 'Primitif, mécanisé, automatisé, robotisé', intro: 'Choisis un type de système. Compare la source d’énergie et le type de commande.', build: quatreTypes,
      retenir: ['Un <b>objet technique</b> répond à un besoin. Un <b>système technique</b> est un ensemble d’éléments qui travaillent ensemble pour réaliser une action.', 'Pour caractériser un système, on regarde la <b>forme d’énergie</b> et le <b>type de commande</b>.', '<b>Primitif</b> : énergie et commande humaines. <b>Mécanisé</b> : moteur, commande humaine. <b>Automatisé</b> : moteur, commande automatique. <b>Robotisé</b> : programmable, polyvalent, capteurs.'],
      ar: { e: ['الشيء التقني يلبّي حاجة. النظام التقني مجموعة عناصر تشتغل معا لإنجاز فعل معيّن.', 'لتصنيف نظام تقني ننظر إلى شكل الطاقة ونوع التحكم: في النظام البدائي الطاقة عضلية والتحكم بشري، وفي الممكنن محرك والتحكم بشري، وفي الآلي محرك وتحكم آلي بواسطة لواقط ووحدة معالجة، وفي الروبوتي نظام قابل للبرمجة ومتعدد الاستعمال يتكيّف مع محيطه.'], u: 'اختر نوعا من التبويبات وقارن مصدر الطاقة ونوع التحكم.',
        w: [['système primitif', 'نظام بدائي'], ['système mécanisé', 'نظام ممكنن'], ['système automatisé', 'نظام آلي'], ['système robotisé', 'نظام روبوتي'], ['commande', 'تحكم']] } },
    { short: 'Frise', title: 'Une frise chronologique', intro: 'Avance sur la frise : le même besoin, cultiver la terre, est satisfait par des systèmes de plus en plus évolués.', build: frise,
      retenir: ['Un même besoin peut être satisfait par des systèmes de natures différentes.', 'L’évolution va de la <b>force humaine</b> vers la <b>commande automatique</b> puis vers les <b>robots</b>.'],
      ar: { e: ['يمكن تلبية الحاجة نفسها بأنظمة مختلفة تتطوّر عبر الزمن: من القوة البشرية إلى الآلات ثم التحكم الآلي ثم الروبوتات.'], u: 'حرّك المنزلق أو اضغط على نقطة من الخط الزمني.', w: [['frise chronologique', 'خط زمني']] } },
    { short: 'Câblée ou programmée', title: 'Technologie câblée et technologie programmée', intro: 'Compare les deux technologies, puis modifie le fonctionnement pour voir la différence.', build: cablee,
      retenir: ['<b>Câblée</b> : la logique est dans le câblage. Changer le fonctionnement, c’est changer des composants ou des liaisons.', '<b>Programmée</b> : la logique est dans un programme. Changer le fonctionnement, c’est modifier le programme.'],
      ar: { e: ['في التقنية المسلَّكة (câblée) يتحدد سلوك النظام بالمكوّنات والأسلاك، وتعديله يتطلب تغيير التركيب. في التقنية المبرمجة يتحدد السلوك ببرنامج تنفّذه بطاقة إلكترونية، وتعديله يكون بتغيير البرنامج.'], u: 'بدّل بين التبويبين ثم اضغط على الزر.', w: [['technologie câblée', 'تقنية مسلّكة'], ['technologie programmée', 'تقنية مبرمجة'], ['programme', 'برنامج']] } }
  ]; },
  quiz: [
    { q: 'Un tracteur conduit par un agriculteur est un système :', o: ['primitif', 'mécanisé', 'automatisé', 'robotisé'], a: 1, e: 'Un moteur apporte l’énergie, mais la commande reste humaine.' },
    { q: 'Un arrosage qui démarre seul quand le sol est sec est un système :', o: ['primitif', 'mécanisé', 'automatisé', 'robotisé'], a: 2, e: 'Des capteurs et une unité de traitement assurent la commande sans intervention humaine.' },
    { q: 'Dans un système primitif, l’énergie est :', o: ['électrique', 'musculaire', 'solaire'], a: 1, e: 'C’est la force de l’être humain.' },
    { q: 'Pour changer le fonctionnement d’un système à technologie programmée, on :', o: ['modifie le programme', 'change tous les fils', 'remplace le moteur'], a: 0, e: 'Le comportement dépend du programme.' },
    { q: 'Un circuit où la logique est réalisée par des composants reliés par des fils relève de la technologie :', o: ['câblée', 'programmée', 'primitive'], a: 0, e: 'Le fonctionnement est fixé par le câblage.' }
  ]
});
