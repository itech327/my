/* @meta {"id":"2ac-ordre","level":"2","order":15,"theme":"Numérique","title":"Ordre des nombres rationnels et opérations","ar":"الترتيب والعمليات على الأعداد الجذرية","lead":"À Ifrane il fait −3 °C, à Midelt −7 °C. Où fait-il le plus froid ? Et si on multiplie deux nombres par −1, leur ordre se retourne !"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 180, U = 22;

  function px(x) { return X0 + x * U; }
  function droite(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('line', { x1: 10, y1: 110, x2: 350, y2: 110, stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    for (var i = -7; i <= 7; i++) { S('line', { x1: px(i), y1: 104, x2: px(i), y2: 116, stroke: '#9aa0a8' }, g); T(g, px(i), 134, i < 0 ? '−' + (-i) : i, 'tag'); }
    var dyn = S('g', {}, g);
    g.set = function (a, b, o) { // o.fleche : montrer la transformation depuis (a0, b0)
      o = o || {};
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.de) [[o.de[0], a], [o.de[1], b]].forEach(function (p, i) { S('path', { d: 'M' + px(p[0]) + ' 100 Q' + (px(p[0]) + px(p[1])) / 2 + ' ' + (i ? 40 : 60) + ' ' + px(p[1]) + ' 100', fill: 'none', stroke: '#e9e9ea', 'stroke-dasharray': '4 4' }, dyn); });
      var close = Math.abs(a - b) < 2.5;
      [[a, 'a', 'var(--acc)', 160], [b, 'b', '#7fb2ff', close ? 176 : 160]].forEach(function (p) { S('circle', { cx: px(p[0]), cy: 110, r: 7, fill: p[2] }, dyn); T(dyn, px(p[0]), p[3], p[1] + ' = ' + String(p[0]).replace('-', '−').replace('.', ','), 'lbl'); });
      var s = a < b ? 'a < b' : a > b ? 'a > b' : 'a = b'; T(dyn, 180, 200, s, 'lbl big acc');
    };
    return g;
  }

  MV.lesson({
    id: '2ac-ordre',
    objectif: {
      fr: 'Comparer des nombres rationnels et connaître l\'effet de l\'addition et de la multiplication sur l\'ordre.',
      ar: 'مقارنة الأعداد الجذرية ومعرفة تأثير الجمع والضرب على الترتيب.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Ifrane et Midelt',
      hud: [['i', 'Ifrane'], ['m', 'Midelt'], ['q', 'plus froid ?']],
      draw: function (svg) { var e = {}; e.d = droite(svg); return e; },
      steps: [
        { cap: 'Un matin d\'hiver : **−3 °C** à Ifrane.', hud: { i: ['−3 °C'], m: '–', q: '–' }, run: function (e) { e.d.set(-3, -3); } },
        { cap: 'Et **−7 °C** à Midelt.', hud: { i: '−3 °C', m: ['−7 °C'], q: '–' }, run: function (e) { e.d.set(-3, -7); } },
        { cap: 'Où fait-il le plus froid ? 7 est plus grand que 3… alors ? On le saura à la fin.', hud: { i: '−3 °C', m: '−7 °C', q: ['?'] }, run: function (e) { e.d.set(-3, -7); } }
      ]
    },

    predire: {
      q: "On compare −7 et −3. Lequel est le plus petit ?",
      ar: "قارن [[−7]] و[[−3]]. أيهما الأصغر؟",
      o: ["−3, car 3 est plus petit que 7", "−7, car il est plus à gauche sur la droite graduée", "Ils sont égaux"],
      a: 1,
      e: "Sur la droite graduée, le plus petit est le plus à gauche : −7 < −3. Avec les nombres négatifs, celui qui a le plus grand chiffre est le plus petit : −7 °C est plus froid que −3 °C.",
      ear: "الأصغر هو الأبعد يساراً على المستقيم المدرّج: [[−7 < −3]]."
    },

    prepare: [
      ['Sur une droite graduée, le plus petit nombre est à gauche.', true, 'Les nombres croissent vers la droite.'],
      ['−5 > −2', false, '−5 est à gauche de −2 : −5 < −2.'],
      ['Tout nombre positif est plus grand que tout nombre négatif.', true, 'Les positifs sont à droite de 0.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'L\'ordre et les opérations',
      hud: [['o', 'opération'], ['r', 'règle'], ['e', 'exemple']],
      draw: function (svg) { var e = {}; e.d = droite(svg); return e; },
      steps: [
        { cap: 'Sur la droite graduée, le plus à **gauche** est le plus **petit** : −7 < −3.', ar: 'العدد الموجود على اليسار هو الأصغر: [[−7 < −3]].', hud: { o: 'comparer', r: ['gauche = plus petit'], e: '−7 < −3' }, run: function (e) { e.d.set(-7, -3); } },
        { cap: 'On **ajoute** le même nombre aux deux : l\'ordre **ne change pas**. Si a < b, alors a + c < b + c.', ar: 'إذا كان [[a < b]] فإن [[a + c < b + c]].', hud: { o: ['+ 5'], r: ['ordre conservé'], e: '−2 < 2' }, run: function (e) { e.d.set(-2, 2, { de: [-7, -3] }); } },
        { cap: 'On **multiplie** par un nombre **positif** : l\'ordre est **conservé**. −2 < 1 donne −4 < 2.', ar: 'الضرب في عدد موجب يحافظ على الترتيب.', hud: { o: ['× 2'], r: ['ordre conservé'], e: '−4 < 2' }, run: function (e) { e.d.set(-4, 2, { de: [-2, 1] }); } },
        { cap: 'On multiplie par un nombre **négatif** : l\'ordre **s\'inverse**. −2 < 1 donne 4 > −2.', ar: 'الضرب في عدد سالب يعكس الترتيب.', hud: { o: ['× (−2)'], r: ['ordre inversé'], e: ['4 > −2'] }, run: function (e) { e.d.set(4, -2, { de: [-2, 1] }); } },
        { cap: 'Pour comparer deux fractions : même **dénominateur positif**, puis on compare les numérateurs. 3/4 > 2/3 car 9/12 > 8/12.', ar: 'لمقارنة كسرين نوحد المقامات ثم نقارن البسطين.', hud: { o: 'fractions', r: 'même dénominateur', e: ['9/12 > 8/12'] }, run: function (e) { e.d.set(0.75, 0.67); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'a = −2 et b = 3. Multiplie les deux par k. Pour quelles valeurs de k l\'ordre s\'inverse-t-il ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Droite graduée' }, st);
          var d = droite(svg), set = MV.hud(c, [['k', 'k'], ['p', 'k·a et k·b'], ['o', 'ordre', 1]]);
          MV.slider(c, { label: 'k', min: -2, max: 2, value: 1 }, function (k) { var a = -2 * k, b = 3 * k; d.set(a, b, { de: [-2, 3] }); set('k', k); set('p', a + ' et ' + b); set('o', k > 0 ? 'conservé' : k < 0 ? 'inversé' : 'égalité'); if (k === -2) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'On sait que x < 5.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. x + 3 < ?', o: ['8', '2'], a: 0 },
            { type: 'opt', q: 'Étape 2. 4x … 20', o: ['<', '>'], a: 0 },
            { type: 'opt', q: 'Étape 3. −2x … −10', o: ['>', '<'], a: 0, e: 'On multiplie par un négatif : l\'ordre s\'inverse.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le plus grand : −4 ou −9 ?', o: ['−4', '−9'], a: 0 },
      { lvl: 'Niveau 2', q: 'a < b. Alors a − 6 … b − 6', o: ['<', '>'], a: 0 },
      { lvl: 'Niveau 3', q: 'a < b. Alors −3a … −3b', o: ['>', '<'], a: 0 },
      { lvl: 'Niveau 4', q: 'Le plus grand : 5/6 ou 7/9 ? (1 pour 5/6, 2 pour 7/9)', a: 1, hint: '15/18 et 14/18.' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le plus froid',
      hud: [['c', 'comparaison'], ['f', 'plus froid'], ['r', 'raison']],
      draw: function (svg) { var e = {}; e.d = droite(svg); return e; },
      steps: [
        { cap: '−7 est **à gauche** de −3 sur la droite graduée.', hud: { c: ['−7 < −3'], f: '–', r: '–' }, run: function (e) { e.d.set(-7, -3); } },
        { cap: 'Il fait plus froid à **Midelt**. Chez les négatifs, le plus éloigné de 0 est le plus petit.', ar: '[[−7 < −3]] إذن ميدلت أبرد.', hud: { c: '−7 < −3', f: ['Midelt'], r: ['plus loin de 0 à gauche'] }, run: function (e) { e.d.set(-7, -3); } }
      ]
    },

    retenir: [
      'Le plus petit de deux nombres est le plus à gauche sur la droite graduée. Si <b class="mono">a &lt; b</b>, alors <b class="mono">a + c &lt; b + c</b> pour tout c.',
      'Multiplier par un nombre <b>positif</b> conserve l\'ordre ; par un nombre <b>négatif</b>, l\'ordre <b>s\'inverse</b> : si a &lt; b et k &lt; 0, alors <b class="mono">ka &gt; kb</b>.'
    ],
    retenirAr: 'إذا كان [[a < b]] فإن [[a + c < b + c]]. الضرب في عدد موجب يحافظ على الترتيب، والضرب في عدد سالب يعكسه.',
    voc: [['comparer', 'يقارن'], ['inférieur à', 'أصغر من'], ['supérieur à', 'أكبر من'], ['l\'ordre', 'الترتيب']]
  });
})();
