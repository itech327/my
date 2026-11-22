/* @meta {"id":"1ac-temperature-chaleur","level":"1","order":14,"theme":"La matière","title":"Température et chaleur","ar":"درجة الحرارة والحرارة","lead":"On verse un verre d'eau à 80 °C dans un verre d'eau à 20 °C. La température finale n'est pas 100 °C ! La chaleur passe du chaud vers le froid jusqu'à l'équilibre."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  function couleur(t) { var k = Math.max(0, Math.min(1, t / 100)); return 'rgb(' + Math.round(80 + 175 * k) + ',' + Math.round(140 - 60 * k) + ',' + Math.round(230 - 180 * k) + ')'; }
  function thermo(g, x, t, lab) {
    S('rect', { x: x - 6, y: 30, width: 12, height: 120, rx: 6, fill: '#1d1f23', stroke: '#e9e9ea', 'stroke-width': 1.5 }, g);
    S('circle', { cx: x, cy: 158, r: 11, fill: couleur(t), stroke: '#e9e9ea', 'stroke-width': 1.5 }, g);
    var h = t / 100 * 110; S('rect', { x: x - 3, y: 148 - h, width: 6, height: h + 4, fill: couleur(t) }, g);
    T(g, x, 186, Math.round(t) + ' °C', 'lbl'); if (lab) T(g, x, 22, lab, 'tag');
  }
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (m1, t1, m2, t2, o) { // o.melange : afficher le mélange
      o = o || {};
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (!o.melange) {
        [[80, t1, m1, 'A'], [190, t2, m2, 'B']].forEach(function (v) { S('rect', { x: v[0] - 30, y: 150 - v[2] * 0.5, width: 60, height: v[2] * 0.5, fill: couleur(v[1]), opacity: 0.7 }, dyn); S('path', { d: 'M' + (v[0] - 32) + ' 60 V152 H' + (v[0] + 32) + ' V60', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn); T(dyn, v[0], 180, v[3] + ' : ' + v[2] + ' g', 'tag'); });
        thermo(dyn, 300, Math.max(t1, t2), 'plus chaud');
      } else {
        var tf = (m1 * t1 + m2 * t2) / (m1 + m2);
        S('rect', { x: 100, y: 150 - (m1 + m2) * 0.16, width: 110, height: (m1 + m2) * 0.16, fill: couleur(tf), opacity: 0.75 }, dyn);
        S('path', { d: 'M98 50 V152 H212 V50', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn); T(dyn, 155, 180, 'mélange : ' + (m1 + m2) + ' g', 'tag');
        thermo(dyn, 300, tf, 'équilibre');
        return tf;
      }
    };
    return g;
  }

  MV.lesson({
    id: '1ac-temperature-chaleur',
    objectif: {
      fr: 'Distinguer température (mesurée au thermomètre, en °C) et chaleur (énergie transférée du chaud vers le froid), et prévoir l\'équilibre thermique.',
      ar: 'التمييز بين درجة الحرارة (تقاس بالمحرار بالدرجة سيلسيوس) والحرارة (طاقة تنتقل من الساخن إلى البارد)، وتوقع التوازن الحراري.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Eau chaude et eau froide',
      hud: [['a', 'verre A'], ['b', 'verre B'], ['q', 'après mélange ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Un verre de **200 g** d\'eau à **80 °C**.', hud: { a: ['80 °C'], b: '–', q: '–' }, run: function (e) { e.s.set(200, 80, 200, 20); } },
        { cap: 'Un autre verre de **200 g** d\'eau à **20 °C**.', hud: { a: '80 °C', b: ['20 °C'], q: '–' }, run: function (e) { e.s.set(200, 80, 200, 20); } },
        { cap: 'On les mélange. 80 + 20 = 100 °C ? On le saura à la fin.', hud: { a: '80 °C', b: '20 °C', q: ['?'] }, run: function (e) { e.s.set(200, 80, 200, 20); } }
      ]
    },

    predire: {
      q: "On mélange 200 g d'eau à 80 °C et 200 g d'eau à 20 °C. Quelle est la température du mélange, en supposant qu'il n'y a pas de perte ?",
      ar: "نخلط [[200 g]] ماء عند [[80 °C]] و[[200 g]] ماء عند [[20 °C]]. ما حرارة الخليط دون ضياع للحرارة؟",
      o: ["100 °C", "50 °C", "60 °C"],
      a: 1,
      e: "La chaleur passe du corps chaud au corps froid jusqu'à l'équilibre thermique. Avec des masses égales, la température finale est la moyenne : (80 + 20) ÷ 2 = 50 °C. Les températures ne s'additionnent pas.",
      ear: "تنتقل الحرارة من الساخن إلى البارد حتى التوازن الحراري: [[(80 + 20) ÷ 2 = 50 °C]]."
    },

    prepare: [
      ['La température se mesure avec un thermomètre.', true, 'En degrés Celsius (°C).'],
      ['La chaleur passe toujours du froid vers le chaud.', false, 'Elle passe du corps chaud vers le corps froid.'],
      ['Pendant l\'ébullition de l\'eau pure, la température reste à 100 °C.', true, 'Sous la pression normale.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'Vers l\'équilibre',
      hud: [['n', 'notion'], ['d', 'description'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'La **température** indique si un corps est chaud ou froid. On la mesure au **thermomètre**, en **°C**.', ar: 'درجة الحرارة تقاس بالمحرار بالدرجة سيلسيوس.', hud: { n: ['température'], d: 'thermomètre', v: '80 °C et 20 °C' }, run: function (e) { e.s.set(200, 80, 200, 20); } },
        { cap: 'La **chaleur** est une énergie qui **passe** du corps chaud vers le corps froid.', ar: 'الحرارة طاقة تنتقل من الجسم الساخن إلى الجسم البارد.', hud: { n: ['chaleur'], d: ['chaud → froid'], v: 'énergie' }, run: function (e) { e.s.set(200, 80, 200, 20); } },
        { cap: 'L\'eau chaude **cède** de la chaleur et refroidit ; l\'eau froide en **reçoit** et se réchauffe.', ar: 'الماء الساخن يفقد حرارة فيبرد، والماء البارد يكتسبها فيسخن.', hud: { n: 'échange', d: 'cède / reçoit', v: '–' }, run: function (e) { e.s.set(200, 80, 200, 20, { melange: 1 }); } },
        { cap: 'Les échanges s\'arrêtent quand les températures sont **égales** : c\'est l\'**équilibre thermique**. Ici **50 °C**.', ar: 'تتوقف التبادلات عند تساوي درجتي الحرارة: التوازن الحراري.', hud: { n: ['équilibre thermique'], d: 'même température', v: ['50 °C'] }, run: function (e) { e.s.set(200, 80, 200, 20, { melange: 1 }); } },
        { cap: 'La température ne s\'**ajoute** pas : la température d\'équilibre est **entre** les deux températures de départ.', ar: 'درجات الحرارة لا تجمع، ودرجة التوازن تقع بين الدرجتين الأوليين.', hud: { n: 'piège', d: 'pas d\'addition', v: ['20 < 50 < 80'] }, run: function (e) { e.s.set(200, 80, 200, 20, { melange: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change la masse d\'eau froide à 20 °C mélangée avec 200 g d\'eau à 80 °C. Obtiens 40 °C.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Mélange d\'eau' }, st);
          var s = scene(svg), set = MV.hud(c, [['m', 'eau froide'], ['t', 'équilibre', 1]]);
          MV.slider(c, { label: 'masse d\'eau froide (g)', min: 100, max: 400, value: 200, step: 50 }, function (m) { var tf = s.set(200, 80, m, 20, { melange: 1 }); set('m', m + ' g'); set('t', String(Math.round(tf * 10) / 10).replace('.', ',') + ' °C'); if (Math.round(tf) === 40) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Plus il y a d\'eau froide, plus l\'équilibre est bas.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Une canette à 5 °C est posée dans une pièce à 25 °C.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. La chaleur passe :', o: ['de l\'air vers la canette', 'de la canette vers l\'air'], a: 0 },
            { type: 'opt', q: 'Étape 2. La canette :', o: ['se réchauffe', 'se refroidit'], a: 0 },
            { q: 'Étape 3. Après longtemps, sa température (°C) ?', a: 25 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'L\'instrument qui mesure la température :', o: ['le thermomètre', 'le dynamomètre'], a: 0 },
      { lvl: 'Niveau 2', q: 'La chaleur passe :', o: ['du chaud vers le froid', 'du froid vers le chaud'], a: 0 },
      { lvl: 'Niveau 3', q: 'On mélange 100 g à 60 °C et 100 g à 20 °C. Équilibre (°C) ?', a: 40 },
      { lvl: 'Niveau 4', q: 'Une température passe de −5 °C à 12 °C. Variation (°C) ?', a: 17 }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'Le mélange',
      hud: [['c', 'chaud'], ['f', 'froid'], ['e', 'équilibre']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'L\'eau à 80 °C cède de la chaleur à l\'eau à 20 °C.', hud: { c: ['cède'], f: ['reçoit'], e: '–' }, run: function (e) { e.s.set(200, 80, 200, 20); } },
        { cap: 'Mêmes masses : équilibre à mi-chemin, **50 °C**, et non 100 °C.', ar: 'الماء الساخن يفقد حرارة والماء البارد يكتسبها حتى يتساويا عند 50 درجة.', hud: { c: 'cède', f: 'reçoit', e: ['50 °C'] }, run: function (e) { e.s.set(200, 80, 200, 20, { melange: 1 }); } }
      ]
    },

    retenir: [
      'La <b>température</b> se mesure au thermomètre en <b>°C</b>. La <b>chaleur</b> est une énergie qui passe spontanément du corps <b>chaud</b> vers le corps <b>froid</b>.',
      'Les échanges cessent à l\'<b>équilibre thermique</b>, quand les températures sont égales. La température finale est comprise entre les températures de départ.'
    ],
    retenirAr: 'درجة الحرارة تقاس بالمحرار بالدرجة سيلسيوس. الحرارة طاقة تنتقل تلقائيا من الجسم الساخن إلى الجسم البارد حتى التوازن الحراري.',
    voc: [['la température', 'درجة الحرارة'], ['la chaleur', 'الحرارة'], ['un thermomètre', 'محرار'], ['l\'équilibre thermique', 'التوازن الحراري']]
  });
})();
