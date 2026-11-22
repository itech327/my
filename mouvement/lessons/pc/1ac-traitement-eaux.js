/* @meta {"id":"1ac-traitement-eaux","level":"1","order":7,"theme":"Matière et environnement","title":"Le traitement des eaux","ar":"معالجة المياه","lead":"L'eau du barrage est trouble et pleine de microbes, pourtant celle du robinet est potable. On suit l'eau dans la station de traitement."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var ETAPES = [['dégrillage', 'grille'], ['décantation', 'bassin'], ['filtration', 'sable'], ['désinfection', 'chlore']];

  /* chaîne de traitement : quatre bassins et l'eau qui s'éclaircit */
  function station(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), box = [], eau = [];
    var cols = ['rgba(150,110,60,.75)', 'rgba(150,120,80,.6)', 'rgba(140,150,150,.5)', 'rgba(127,178,255,.45)', 'rgba(127,178,255,.45)'];
    ETAPES.forEach(function (et, i) {
      var x = 14 + i * 86;
      S('path', { d: 'M' + x + ' 80 V160 H' + (x + 70) + ' V80', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2 }, g);
      var w = S('rect', { x: x + 2, y: 100, width: 66, height: 58, fill: cols[i] }, g); w.style.transition = 'fill .8s'; eau.push(w);
      var b = S('rect', { x: x - 2, y: 76, width: 78, height: 88, rx: 6, fill: 'none', stroke: 'var(--acc)', 'stroke-width': 3 }, g); b.style.opacity = 0; box.push(b);
      T(g, x + 35, 186, et[0], 'tag'); T(g, x + 35, 70, et[1], 'tag');
      if (i < 3) S('path', { d: 'M' + (x + 72) + ' 120 h12 l-5 -4 m5 4 l-5 4', stroke: '#9aa0a8', fill: 'none', 'stroke-width': 2 }, g);
    });
    var mic = S('g', {}, g); for (var k = 0; k < 6; k++) S('circle', { cx: 290 + (k * 11) % 50, cy: 112 + (k * 17) % 40, r: 3, fill: '#5fae5a' }, mic);
    g.set = function (n, hot) { // n étapes déjà faites
      eau.forEach(function (w, i) { w.setAttribute('fill', cols[Math.min(i, n)]); });
      box.forEach(function (b, i) { b.style.opacity = i === hot ? 1 : 0; });
      mic.style.opacity = n >= 4 ? 0 : 1;
    };
    return g;
  }

  MV.lesson({
    id: '1ac-traitement-eaux',
    objectif: {
      fr: 'Décrire les étapes de la production d\'eau potable et le rôle de l\'épuration des eaux usées.',
      ar: 'وصف مراحل إنتاج الماء الشروب ودور تصفية المياه العادمة.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Du barrage au robinet',
      hud: [['b', 'eau du barrage'], ['r', 'eau du robinet'], ['q', 'comment ?']],
      draw: function (svg) { var e = {}; e.s = station(svg); return e; },
      steps: [
        { cap: 'L\'eau du **barrage** est trouble : feuilles, terre, microbes.', hud: { b: ['trouble'], r: '–', q: '–' }, run: function (e) { e.s.set(0); } },
        { cap: 'Celle du **robinet** est limpide et **potable**.', hud: { b: 'trouble', r: ['potable'], q: '–' }, run: function (e) { e.s.set(0); } },
        { cap: 'Que se passe-t-il entre les deux ? On le saura à la fin.', hud: { b: 'trouble', r: 'potable', q: ['?'] }, run: function (e) { e.s.set(0); } }
      ]
    },

    predire: {
      q: "L'eau du barrage est trouble, celle du robinet est limpide et potable. Que se passe-t-il entre les deux ?",
      ar: "ماء السد عكر وماء الصنبور رائق وصالح للشرب. ماذا يحدث بينهما؟",
      o: ["On ajoute seulement du chlore", "On fait bouillir toute l'eau du barrage", "On retire les déchets, on décante, on filtre, puis on désinfecte"],
      a: 2,
      e: "Une station fait un dégrillage, une décantation, une filtration, puis une désinfection au chlore ou à l'ozone. Le chlore seul n'enlève ni la terre ni les feuilles.",
      ear: "المحطة تُزيل الشوائب الكبيرة ثم تُرسّب وترشّح ثم تعقّم بالكلور أو الأوزون. الكلور وحده لا يزيل التراب."
    },

    prepare: [
      ['Une eau limpide est toujours potable.', false, 'Elle peut contenir des microbes invisibles.'],
      ['La décantation laisse les particules lourdes tomber au fond.', true, 'Vu dans la leçon sur les mélanges.'],
      ['Le sable peut servir de filtre.', true, 'Il retient les fines particules.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'La station de traitement',
      hud: [['e', 'étape'], ['r', 'retire'], ['q', 'qualité']],
      draw: function (svg) { var e = {}; e.s = station(svg); return e; },
      steps: [
        { cap: '**Dégrillage** : une grille arrête les gros déchets (branches, plastiques).', ar: 'إزالة الشوائب الكبيرة بواسطة شبكة.', hud: { e: ['dégrillage'], r: 'gros déchets', q: 'trouble' }, run: function (e) { e.s.set(1, 0); } },
        { cap: '**Décantation** : dans un grand bassin, la terre tombe au fond.', ar: 'التصفيق: تترسب الأتربة في قعر حوض كبير.', hud: { e: ['décantation'], r: 'terre, boue', q: 'moins trouble' }, run: function (e) { e.s.set(2, 1); } },
        { cap: '**Filtration** sur du sable : l\'eau devient **limpide**.', ar: 'الترشيح عبر الرمل: يصبح الماء رائقا.', hud: { e: ['filtration'], r: 'fines particules', q: ['limpide'] }, run: function (e) { e.s.set(3, 2); } },
        { cap: '**Désinfection** au chlore ou à l\'ozone : les **microbes** sont tués. L\'eau est **potable**.', ar: 'التعقيم بالكلور أو الأوزون يقتل الميكروبات فيصبح الماء شروبا.', hud: { e: ['désinfection'], r: ['microbes'], q: ['potable'] }, run: function (e) { e.s.set(4, 3); } },
        { cap: 'Après usage, les **eaux usées** vont à une **station d\'épuration** avant de retourner à la nature.', ar: 'بعد الاستعمال تذهب المياه العادمة إلى محطة التصفية قبل إرجاعها إلى الطبيعة.', hud: { e: 'épuration', r: 'pollution', q: 'rejet propre' }, run: function (e) { e.s.set(4); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Fais passer l\'eau dans chaque étape de la station.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Station de traitement' }, st);
          var s = station(svg), set = MV.hud(c, [['e', 'dernière étape'], ['q', 'potable ?', 1]]);
          MV.slider(c, { label: 'étapes', min: 0, max: 4, value: 0 }, function (n) { s.set(n, n - 1); set('e', n ? ETAPES[n - 1][0] : '–'); set('q', n === 4 ? 'oui' : 'non'); if (n === 4) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Remets les étapes dans l\'ordre.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. La première étape est :', o: ['le dégrillage', 'la désinfection'], a: 0 },
            { type: 'opt', q: 'Étape 2. L\'étape qui rend l\'eau limpide :', o: ['la filtration', 'le dégrillage'], a: 0 },
            { type: 'opt', q: 'Étape 3. L\'étape qui tue les microbes :', o: ['la désinfection', 'la décantation'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Une eau potable est une eau :', o: ['qu\'on peut boire sans danger', 'simplement limpide'], a: 0 },
      { lvl: 'Niveau 2', q: 'Le chlore sert à :', o: ['tuer les microbes', 'retirer la terre'], a: 0 },
      { lvl: 'Niveau 3', q: 'Les eaux usées sont traitées dans :', o: ['une station d\'épuration', 'un barrage'], a: 0 },
      { lvl: 'Niveau 4', q: 'Une famille utilise 120 L d\'eau par jour. Combien en une semaine (L) ?', a: 840, unit: 'L' }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'Du barrage au robinet',
      hud: [['1', 'retirer'], ['2', 'éclaircir'], ['3', 'désinfecter']],
      draw: function (svg) { var e = {}; e.s = station(svg); return e; },
      steps: [
        { cap: 'Dégrillage et décantation retirent les déchets ; la filtration rend l\'eau **limpide**.', hud: { 1: ['dégrillage, décantation'], 2: ['filtration'], 3: '–' }, run: function (e) { e.s.set(3, 2); } },
        { cap: 'La **désinfection** la rend **potable**. Économisons-la : elle demande beaucoup de travail.', ar: 'المحطة تزيل الشوائب ثم ترشح الماء ثم تعقمه فيصبح شروبا.', hud: { 1: 'dégrillage, décantation', 2: 'filtration', 3: ['désinfection'] }, run: function (e) { e.s.set(4, 3); } }
      ]
    },

    retenir: [
      'Pour produire de l\'eau <b>potable</b> : <b>dégrillage</b>, <b>décantation</b>, <b>filtration</b>, puis <b>désinfection</b> (chlore, ozone).',
      'Les <b>eaux usées</b> sont nettoyées dans une <b>station d\'épuration</b> avant d\'être rejetées. L\'eau est précieuse : on l\'économise.'
    ],
    retenirAr: 'لإنتاج الماء الشروب: إزالة الشوائب الكبيرة، ثم التصفيق، ثم الترشيح، ثم التعقيم. المياه العادمة تعالج في محطة التصفية قبل إرجاعها إلى الطبيعة.',
    voc: [['l\'eau potable', 'الماء الشروب'], ['la désinfection', 'التعقيم'], ['les eaux usées', 'المياه العادمة'], ['une station d\'épuration', 'محطة التصفية']]
  });
})();
