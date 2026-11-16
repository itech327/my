/* @meta {"id":"1ac-pression","level":"1","order":4,"theme":"Matière et environnement","title":"Pression et pression atmosphérique","ar":"الضغط والضغط الجوي","lead":"Une bouteille fermée à l'Oukaïmeden arrive écrasée à Marrakech : l'air pousse plus fort en bas qu'en haut."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  function patm(h) { return Math.round(1013 * Math.exp(-h / 8400)); }

  /* bouteille : écrasement selon le rapport des pressions */
  function bouteille(svg, x, y) {
    var g = S('g', { 'data-keep': 1 }, svg), b = S('path', { fill: '#7fb2ff', opacity: .55, stroke: '#cfd3d8', 'stroke-width': 2.5 }, g);
    S('rect', { x: x - 9, y: y - 104, width: 18, height: 12, rx: 2, fill: '#e5484d' }, g);
    g.set = function (k) { // k = 1 normale, < 1 écrasée
      var w = 34 * k, p = 'M' + (x - 8) + ' ' + (y - 92) + ' L' + (x - 8) + ' ' + (y - 80) + ' C' + (x - 34) + ' ' + (y - 70) + ' ' + (x - w) + ' ' + (y - 60) + ' ' + (x - w) + ' ' + (y - 40) +
        ' Q' + (x - w * (0.6 + 0.4 * k)) + ' ' + (y - 20) + ' ' + (x - w) + ' ' + y + ' H' + (x + w) + ' Q' + (x + w * (0.6 + 0.4 * k)) + ' ' + (y - 20) + ' ' + (x + w) + ' ' + (y - 40) +
        ' C' + (x + w) + ' ' + (y - 60) + ' ' + (x + 34) + ' ' + (y - 70) + ' ' + (x + 8) + ' ' + (y - 80) + ' L' + (x + 8) + ' ' + (y - 92) + ' Z';
      b.setAttribute('d', p);
    };
    g.set(1); return g;
  }
  function montagne(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('path', { d: 'M0 230 L120 230 L240 60 L360 230 Z', fill: '#2b2e33' }, g); S('path', { d: 'M220 88 L240 60 L262 92 Z', fill: '#e9e9ea' }, g);
    T(g, 60, 222, 'Marrakech 460 m', 'tag'); T(g, 300, 40, 'Oukaïmeden 2 600 m', 'tag');
    return g;
  }

  MV.lesson({
    id: '1ac-pression',
    objectif: {
      fr: 'Savoir qu\'un gaz exerce une pression, la mesurer avec un manomètre, et connaître la pression atmosphérique et ses variations avec l\'altitude.',
      ar: 'معرفة أن الغاز يحدث ضغطا وقياسه بمانومتر، ومعرفة الضغط الجوي وتغيره مع الارتفاع.'
    },

    ouverture: {
      vb: '0 0 360 240', label: 'Une bouteille qui s\'écrase',
      hud: [['l', 'lieu'], ['b', 'bouteille'], ['q', 'pourquoi ?']],
      draw: function (svg) { var e = {}; montagne(svg); e.b = bouteille(svg, 180, 200); return e; },
      steps: [
        { cap: 'Au sommet de l\'**Oukaïmeden**, on boit et on referme la bouteille vide.', hud: { l: ['2 600 m'], b: 'normale', q: '–' }, run: function (e) { e.b.set(1); } },
        { cap: 'Arrivée à **Marrakech**, la bouteille est **écrasée** !', hud: { l: ['460 m'], b: ['écrasée'], q: '–' }, run: function (e) { e.b.set(0.75); } },
        { cap: 'Personne ne l\'a touchée. Qui l\'a écrasée ? On le saura à la fin.', hud: { l: '460 m', b: 'écrasée', q: ['?'] }, run: function (e) { e.b.set(0.75); } }
      ]
    },

    prepare: [
      ['L\'air est de la matière.', true, 'Il a une masse et occupe un volume.'],
      ['L\'air ne pousse sur rien.', false, 'L\'air exerce une pression sur toutes les surfaces.'],
      ['Plus on monte en montagne, moins il y a d\'air au-dessus de nous.', true, 'La couche d\'air au-dessus est moins épaisse.']
    ],

    regarde: {
      vb: '0 0 360 240', label: 'Pression d\'un gaz et pression atmosphérique',
      hud: [['p', 'pression'], ['u', 'unité'], ['i', 'instrument']],
      draw: function (svg) {
        var e = {};
        e.mano = S('g', {}, svg);
        S('circle', { cx: 120, cy: 110, r: 50, fill: '#17181a', stroke: '#9aa0a8', 'stroke-width': 3 }, e.mano);
        e.aig = S('line', { x1: 120, y1: 110, x2: 120, y2: 70, stroke: 'var(--acc)', 'stroke-width': 3, 'data-keep': 1 }, e.mano); e.aig.style.cssText = 'transition:transform .8s;transform-box:view-box;transform-origin:120px 110px';
        T(e.mano, 120, 180, 'manomètre', 'tag');
        S('path', { d: 'M170 110 h60 v-30 h70 v60 h-70 v-30', fill: 'none', stroke: '#cfd3d8', 'stroke-width': 3 }, e.mano); T(e.mano, 265, 160, 'ballon d\'air', 'tag');
        e.col = S('g', {}, svg);
        for (var i = 0; i < 6; i++) S('rect', { x: 60, y: 20 + i * 30, width: 240, height: 28, fill: 'rgba(127,178,255,' + (0.08 + i * 0.06) + ')' }, e.col);
        T(e.col, 180, 225, 'plus d\'air au-dessus en bas : pression plus forte', 'tag');
        e.alt = S('g', {}, svg); montagne(e.alt).removeAttribute('data-keep');
        return e;
      },
      steps: [
        { cap: 'Un gaz enfermé pousse sur les parois : il exerce une **pression**.', ar: 'الغاز المحصور يضغط على جدران الإناء: إنه يحدث ضغطا.', on: ['mano'], hud: { p: '–', u: '–', i: '–' }, run: function (e) { e.aig.style.transform = 'rotate(-30deg)'; } },
        { cap: 'On la mesure avec un **manomètre**, en pascals (Pa), hectopascals (hPa) ou bars.', ar: 'نقيسه بالمانومتر بوحدة الباسكال أو الهيكتوباسكال أو البار.', on: ['mano'], hud: { p: '?', u: ['Pa, hPa, bar'], i: ['manomètre'] }, run: function (e) { e.aig.style.transform = 'rotate(-30deg)'; } },
        { cap: 'On gonfle le ballon : plus d\'air, la pression **augmente**.', ar: 'ننفخ الكرة: يزداد الضغط.', on: ['mano'], hud: { p: ['augmente'], u: 'bar', i: 'manomètre' }, run: function (e) { e.aig.style.transform = 'rotate(40deg)'; } },
        { cap: 'L\'air de l\'atmosphère pousse sur tout : c\'est la **pression atmosphérique**.', ar: 'هواء الغلاف الجوي يضغط على كل شيء: هذا هو الضغط الجوي.', on: ['col'], hud: { p: ['≈ 1 013 hPa'], u: 'hPa', i: ['baromètre'] } },
        { cap: 'Au niveau de la mer, elle vaut environ **1 013 hPa**. On la mesure avec un baromètre.', ar: 'عند مستوى سطح البحر يساوي حوالي [[1013 hPa]]، ونقيسه بالبارومتر.', on: ['col'], hud: { p: '1 013 hPa', u: 'hPa', i: ['baromètre'] } },
        { cap: 'En montagne, il y a moins d\'air au-dessus : la pression **diminue** avec l\'altitude.', ar: 'في الجبل يقل الهواء فوقنا فينخفض الضغط الجوي مع الارتفاع.', on: ['alt'], hud: { p: ['≈ 740 hPa à 2 600 m'], u: 'hPa', i: 'baromètre' } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change l\'altitude. Observe la pression atmosphérique (valeurs approchées).',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 240', role: 'img', 'aria-label': 'Bouteille selon l\'altitude' }, st);
          var b = bouteille(svg, 180, 210), set = MV.hud(c, [['h', 'altitude'], ['p', 'pression', 1], ['b', 'bouteille fermée à 2 600 m', 1]]);
          MV.slider(c, { label: 'altitude', min: 0, max: 4200, step: 200, value: 2600, fmt: function (v) { return v + ' m'; } }, function (h) {
            var p = patm(h), k = Math.min(1, Math.max(0.6, Math.pow(patm(2600) / p, 1.2))); b.set(k); set('h', h + ' m'); set('p', p + ' hPa'); set('b', k > 0.97 ? 'normale' : 'écrasée');
            if (h <= 600) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Descends jusqu\'à Marrakech (moins de 600 m), puis monte au Toubkal (plus de 4 000 m).', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Un manomètre indique 2,2 bar dans un pneu de vélo. On rajoute de l\'air.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. La pression dans le pneu :', o: ['augmente', 'diminue'], a: 0 },
            { q: 'Étape 2. 1 bar ≈ 1 000 hPa. Combien de hPa pour 2,2 bar ?', a: 2200, unit: 'hPa' },
            { type: 'opt', q: 'Étape 3. Quel instrument mesure la pression atmosphérique ?', o: ['le baromètre', 'le thermomètre', 'la balance'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'La pression d\'un gaz enfermé se mesure avec :', o: ['un manomètre', 'un thermomètre'], a: 0 },
      { lvl: 'Niveau 2', q: 'La pression atmosphérique au niveau de la mer vaut environ :', o: ['1 013 hPa', '100 hPa', '10 000 hPa'], a: 0 },
      { lvl: 'Niveau 3', q: 'Quand on monte en altitude, la pression atmosphérique :', o: ['augmente', 'diminue'], a: 1 },
      { lvl: 'Niveau 4', q: 'Écart de pression entre 1 013 hPa à la mer et 740 hPa à l\'Oukaïmeden, en hPa ?', a: 273, unit: 'hPa' }
    ],

    bilan: {
      vb: '0 0 360 240', label: 'La bouteille expliquée',
      hud: [['i', 'dedans'], ['o', 'dehors'], ['r', 'réponse']],
      draw: function (svg) { var e = {}; montagne(svg); e.b = bouteille(svg, 180, 200); return e; },
      steps: [
        { cap: 'Fermée en haut : dedans, l\'air est à environ **740 hPa**.', hud: { i: ['740 hPa'], o: '740 hPa', r: '–' }, run: function (e) { e.b.set(1); } },
        { cap: 'En bas, l\'air extérieur pousse à environ **960 hPa** : plus fort que l\'air dedans. Il écrase la bouteille.', ar: 'في الأسفل يكون الضغط الجوي الخارجي أكبر من ضغط الهواء داخل القارورة فيسحقها.', hud: { i: '740 hPa', o: ['960 hPa'], r: ['la pression atmosphérique'] }, run: function (e) { e.b.set(0.75); } }
      ]
    },

    retenir: [
      'Un gaz exerce une <b>pression</b> sur les parois. On la mesure avec un <b>manomètre</b> ; unités : pascal (Pa), hectopascal (hPa), bar (1 bar ≈ 1 000 hPa).',
      'L\'air de l\'atmosphère exerce la <b>pression atmosphérique</b>, mesurée avec un <b>baromètre</b> : environ 1 013 hPa au niveau de la mer. Elle <b>diminue</b> quand l\'altitude augmente.'
    ],
    retenirAr: 'يحدث الغاز ضغطا على الجدران، نقيسه بالمانومتر بوحدة الباسكال أو البار. الهواء يحدث الضغط الجوي الذي نقيسه بالبارومتر، وهو حوالي [[1013 hPa]] عند سطح البحر وينخفض كلما ارتفعنا.',
    voc: [['la pression', 'الضغط'], ['la pression atmosphérique', 'الضغط الجوي'], ['le manomètre', 'المانومتر'], ['le baromètre', 'البارومتر'], ['l\'altitude', 'الارتفاع']]
  });
})();
