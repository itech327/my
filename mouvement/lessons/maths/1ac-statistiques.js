/* @meta {"id":"1ac-statistiques","level":"1","order":17,"theme":"Organisation de données","title":"Statistiques","ar":"الإحصاء","lead":"Le professeur d'EPS demande à 30 élèves leur sport préféré. Comment présenter les réponses pour que tout le monde comprenne d'un coup d'œil ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var SPORTS = ['football', 'basket', 'athlétisme', 'handball'], COLS = ['var(--acc)', '#7fb2ff', '#56d07f', '#f2c14e'];

  /* diagramme en bâtons ou circulaire */
  function diag(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (eff, type, hot) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var N = eff.reduce(function (a, b) { return a + b; }, 0);
      if (type === 'cercle') {
        var a0 = -Math.PI / 2;
        eff.forEach(function (e, i) {
          if (!e) return; var a1 = a0 + e / N * 2 * Math.PI, big = e / N > 0.5 ? 1 : 0, cx = 180, cy = 105, r = 80;
          S('path', { d: 'M' + cx + ' ' + cy + ' L' + (cx + r * Math.cos(a0)) + ' ' + (cy + r * Math.sin(a0)) + ' A' + r + ' ' + r + ' 0 ' + big + ' 1 ' + (cx + r * Math.cos(a1)) + ' ' + (cy + r * Math.sin(a1)) + ' Z', fill: COLS[i], stroke: '#141517', 'stroke-width': 2 }, dyn);
          var m = (a0 + a1) / 2; T(dyn, cx + 100 * Math.cos(m), cy + 100 * Math.sin(m) + 4, Math.round(e / N * 360) + '°', 'tag');
          a0 = a1;
        });
      } else {
        S('path', { d: 'M40 15 V180 H340', stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, dyn);
        [0, 5, 10, 15].forEach(function (y) { T(dyn, 34, 184 - y * 10, y, 'tag', 'end'); });
        eff.forEach(function (e, i) {
          var x = 70 + i * 72, h = e * 10;
          S('rect', { x: x, y: 180 - h, width: 40, height: h, fill: COLS[i], stroke: hot === i ? '#fff' : 'none', 'stroke-width': 3 }, dyn);
          T(dyn, x + 20, 196, SPORTS[i], 'tag'); T(dyn, x + 20, 174 - h, e, 'lbl');
        });
      }
    };
    return g;
  }
  var EFF = [12, 6, 8, 4];

  MV.lesson({
    id: '1ac-statistiques',
    objectif: {
      fr: 'Organiser des données dans un tableau d\'effectifs, calculer des fréquences et représenter les données par un diagramme en bâtons ou circulaire.',
      ar: 'تنظيم المعطيات في جدول الحصيصات، وحساب الترددات، وتمثيلها بمخطط بالعصي أو بمخطط دائري.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Le sport préféré',
      hud: [['n', 'élèves'], ['r', 'réponses'], ['q', 'comment présenter ?']],
      draw: function (svg) { var e = {}; e.d = diag(svg); return e; },
      steps: [
        { cap: 'Le professeur d\'EPS interroge **30 élèves** sur leur sport préféré.', hud: { n: ['30'], r: '–', q: '–' }, run: function (e) { e.d.set([0, 0, 0, 0]); } },
        { cap: 'Il obtient une longue liste : football, basket, football, handball…', hud: { n: '30', r: ['liste en vrac'], q: '–' }, run: function (e) { e.d.set([0, 0, 0, 0]); } },
        { cap: 'Comment la rendre lisible d\'un coup d\'œil ? On le saura à la fin.', hud: { n: '30', r: 'liste en vrac', q: ['?'] }, run: function (e) { e.d.set([0, 0, 0, 0]); } }
      ]
    },

    predire: {
      q: "Dans une classe de 30 élèves, 12 préfèrent le football. Quelle est la fréquence du football ?",
      ar: "في قسم من [[30]] تلميذاً يفضّل [[12]] كرة القدم. ما تواتر كرة القدم؟",
      o: ["12 %", "40 %", "60 %"],
      a: 1,
      e: "Fréquence = effectif ÷ effectif total = 12 ÷ 30 = 0,4 = 40 %. Le nombre 12 est un effectif, pas un pourcentage.",
      ear: "التواتر [[= 12 ÷ 30 = 0,4 = 40 %]]. العدد [[12]] هو التكرار وليس نسبة."
    },

    prepare: [
      ['L\'effectif d\'une valeur est le nombre de fois où elle apparaît.', true, 'On compte.'],
      ['La somme des effectifs est l\'effectif total.', true, 'Ici, 30 élèves.'],
      ['Une fréquence peut être supérieure à 1.', false, 'Une fréquence est comprise entre 0 et 1 (ou 0 % et 100 %).']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Du tableau au diagramme',
      hud: [['n', 'notion'], ['c', 'calcul'], ['v', 'exemple']],
      draw: function (svg) { var e = {}; e.d = diag(svg); return e; },
      steps: [
        { cap: 'On **compte** chaque sport : ce sont les **effectifs**. Football 12, basket 6, athlétisme 8, handball 4.', ar: 'نحسب عدد مرات تكرار كل قيمة: هذه هي الحصيصات.', hud: { n: ['effectifs'], c: '12 + 6 + 8 + 4', v: 'total 30' }, run: function (e) { e.d.set(EFF, 'batons'); } },
        { cap: 'Le **diagramme en bâtons** : la hauteur de chaque bâton est l\'effectif.', ar: 'المخطط بالعصي: ارتفاع كل عصا يساوي الحصيص.', hud: { n: ['diagramme en bâtons'], c: 'hauteur = effectif', v: 'football : 12' }, run: function (e) { e.d.set(EFF, 'batons', 0); } },
        { cap: 'La **fréquence** = effectif ÷ effectif total. Football : 12 ÷ 30 = **0,4 = 40 %**.', ar: 'التردد = الحصيص ÷ الحصيص الإجمالي.', hud: { n: ['fréquence'], c: '12 ÷ 30', v: ['40 %'] }, run: function (e) { e.d.set(EFF, 'batons', 0); } },
        { cap: 'Le **diagramme circulaire** : angle = fréquence × 360°. Football : 0,4 × 360 = **144°**.', ar: 'المخطط الدائري: الزاوية = التردد × 360°.', hud: { n: ['diagramme circulaire'], c: 'fréquence × 360°', v: ['144°'] }, run: function (e) { e.d.set(EFF, 'cercle'); } },
        { cap: 'Le **mode** est la valeur de plus grand effectif : ici le **football**.', ar: 'المنوال هو القيمة ذات أكبر حصيص.', hud: { n: ['mode'], c: 'plus grand effectif', v: ['football'] }, run: function (e) { e.d.set(EFF, 'batons', 0); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change l\'effectif du basket. Pour quelle valeur basket et football ont-ils la même fréquence ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Diagramme en bâtons' }, st);
          var d = diag(svg), type = 'batons', b = 6, set = MV.hud(c, [['t', 'total'], ['f', 'fréquence du basket', 1]]);
          function upd() { var e = [12, b, 8, 4], N = 24 + b; d.set(e, type); set('t', N); set('f', Math.round(b / N * 100) + ' %'); if (b === 12) done(); }
          MV.slider(c, { label: 'effectif du basket', min: 0, max: 15, value: 6 }, function (v) { b = v; upd(); });
          var row = MV.H('div', 'row', '', c); [['Bâtons', 'batons'], ['Circulaire', 'cercle']].forEach(function (x) { var bt = MV.H('button', 'btn', x[0], row); bt.onclick = function () { type = x[1]; upd(); }; });
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'Dans une classe de 25 élèves, 10 viennent à pied.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Fréquence (en décimal) : 10 ÷ 25 = ?', a: 0.4 },
            { q: 'Étape 2. En pourcentage ?', a: 40 },
            { q: 'Étape 3. Angle dans un diagramme circulaire (°) ?', a: 144 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Notes : 12, 15, 12, 10, 12. Effectif de la note 12 ?', a: 3 },
      { lvl: 'Niveau 2', q: 'Le mode de cette série est :', o: ['12', '15', '10'], a: 0 },
      { lvl: 'Niveau 3', q: 'Effectif 6 sur un total de 24. Fréquence en % ?', a: 25 },
      { lvl: 'Niveau 4', q: 'Une fréquence de 0,25 correspond à un angle de ? °', a: 90 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Les réponses des 30 élèves',
      hud: [['t', 'tableau'], ['d', 'diagramme'], ['m', 'mode']],
      draw: function (svg) { var e = {}; e.d = diag(svg); return e; },
      steps: [
        { cap: 'Un **tableau d\'effectifs**, puis un **diagramme en bâtons** : tout se lit d\'un coup d\'œil.', hud: { t: ['12, 6, 8, 4'], d: ['bâtons'], m: '–' }, run: function (e) { e.d.set(EFF, 'batons'); } },
        { cap: 'Ou un **diagramme circulaire** pour voir les parts. Le sport préféré est le **football** (40 %).', ar: 'نرتب المعطيات في جدول حصيصات ثم نمثلها بمخطط، والمنوال هو كرة القدم.', hud: { t: '12, 6, 8, 4', d: ['circulaire'], m: ['football'] }, run: function (e) { e.d.set(EFF, 'cercle'); } }
      ]
    },

    retenir: [
      'L\'<b>effectif</b> d\'une valeur est le nombre de fois où elle apparaît ; la <b>fréquence</b> = effectif ÷ effectif total (entre 0 et 1, ou en %).',
      'On représente les données par un <b>diagramme en bâtons</b> (hauteur = effectif) ou un <b>diagramme circulaire</b> (angle = fréquence × 360°). Le <b>mode</b> est la valeur de plus grand effectif.'
    ],
    retenirAr: 'الحصيص عدد مرات تكرار قيمة، والتردد = الحصيص ÷ الحصيص الإجمالي. نمثل المعطيات بمخطط بالعصي أو بمخطط دائري، والمنوال هو القيمة ذات أكبر حصيص.',
    voc: [['l\'effectif', 'الحصيص'], ['la fréquence', 'التردد'], ['le mode', 'المنوال'], ['un diagramme en bâtons', 'مخطط بالعصي'], ['un diagramme circulaire', 'مخطط دائري']]
  });
})();
