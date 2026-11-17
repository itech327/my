/* @meta {"id":"2ac-temporisation","level":"2","order":8,"theme":"Fonctions électroniques","title":"La fonction « Temporisation »","ar":"وظيفة التأخير الزمني","lead":"Dans l’immeuble, on appuie sur le bouton : la lumière de l’escalier reste allumée un moment puis s’éteint seule. Qui compte le temps ? Une résistance et un condensateur."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, R = 100;
  var CS = [10, 22, 47, 100, 220, 470];

  function tau(r, c) { return r * c / 1000; } // kΩ × µF = ms, donc ÷ 1000 pour des secondes
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    var X0 = 50, Y0 = 170, W = 290, H = 130, TMAX = 60;
    function X(t) { return X0 + t / TMAX * W; }
    function Y(u) { return Y0 - u * H; }
    g.set = function (o) { // o.tau en secondes ; o.mark : montrer τ
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      S('path', { d: 'M' + X0 + ' ' + Y0 + 'H' + (X0 + W) + 'M' + X0 + ' ' + Y0 + 'V' + (Y0 - H - 10), stroke: '#5b6068', 'stroke-width': 1.5 }, dyn);
      T(dyn, X0 - 6, Y(1) + 4, '9 V', 'tag', 'end'); T(dyn, X0 + W, Y0 + 32, 'temps (s)', 'tag', 'end');
      [0, 20, 40, 60].forEach(function (t) { T(dyn, X(t), Y0 + 18, String(t), 'tag'); });
      S('path', { d: 'M' + X0 + ' ' + Y(1) + 'H' + (X0 + W), stroke: '#2c2f34', 'stroke-dasharray': '4 4' }, dyn);
      if (!o.tau) return;
      var d = 'M' + X0 + ' ' + Y0;
      for (var t = 0; t <= TMAX; t += 0.5) d += 'L' + X(t).toFixed(1) + ' ' + Y(1 - Math.exp(-t / o.tau)).toFixed(1);
      var p = S('path', { d: d, stroke: 'var(--acc)', 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '700', 'stroke-dashoffset': '700' }, dyn);
      S('animate', { attributeName: 'stroke-dashoffset', from: 700, to: 0, dur: '2.5s', fill: 'freeze' }, p);
      if (o.mark && o.tau <= TMAX) {
        S('path', { d: 'M' + X(o.tau) + ' ' + Y0 + 'V' + Y(0.63) + 'H' + X0, stroke: '#f2c14e', 'stroke-width': 1.5, 'stroke-dasharray': '4 3', fill: 'none' }, dyn);
        T(dyn, X(o.tau) + 6, Y0 - 8, 'τ = ' + MV.fmt(o.tau, 1) + ' s', 'tag', 'start');
        T(dyn, X0 + 6, Y(0.63) - 6, '63 %', 'tag', 'start');
      }
      T(dyn, 196, 22, 'charge du condensateur', 'tag');
    };
    return g;
  }

  MV.lesson({
    id: '2ac-temporisation',
    objectif: {
      fr: 'Savoir qu’un circuit RC fixe une durée : le condensateur se charge à travers la résistance ; calculer τ = R × C et régler la durée en changeant R ou C.',
      ar: 'معرفة أن الدارة RC تحدد مدة زمنية: يشحن المكثف عبر المقاومة؛ حساب [[τ = R × C]] وضبط المدة بتغيير R أو C.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'La minuterie de l’escalier',
      hud: [['b', 'bouton'], ['l', 'lumière'], ['d', 'durée']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'On appuie sur le bouton de la **minuterie** : la lumière s’allume.', hud: { b: ['appuyé'], l: ['allumée'], d: '?' }, run: function (e) { e.s.set({}); } },
        { cap: 'Elle reste allumée un moment puis s’**éteint seule**.', hud: { b: '–', l: 'allumée', d: ['quelques secondes'] }, run: function (e) { e.s.set({ tau: 10 }); } },
        { cap: 'Une **résistance** et un **condensateur** comptent le temps. Comment ?', hud: { b: '–', l: 'éteinte', d: ['R et C'] }, run: function (e) { e.s.set({ tau: 10, mark: 1 }); } }
      ]
    },

    prepare: [
      ['Un condensateur peut stocker des charges électriques.', true, 'Comme un petit réservoir.'],
      ['Un réservoir se remplit plus vite avec un gros tuyau.', true, 'De même, le condensateur se charge plus vite avec une petite résistance.'],
      ['La capacité d’un condensateur se mesure en ohms.', false, 'En farads ; on utilise souvent le microfarad (µF).']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Charge RC',
      hud: [['n', 'notion'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Temporiser**, c’est attendre une **durée** avant d’agir.', ar: 'التأخير الزمني هو انتظار مدة قبل التأثير.', hud: { n: ['temporiser'], v: 'durée' }, run: function (e) { e.s.set({}); } },
        { cap: 'Le condensateur se **charge** à travers R : sa tension monte vite, puis de plus en plus lentement.', ar: 'يشحن المكثف عبر المقاومة: يرتفع التوتر بسرعة ثم ببطء.', hud: { n: ['charge'], v: 'courbe' }, run: function (e) { e.s.set({ tau: 10 }); } },
        { cap: '**Constante de temps** τ = R × C. 100 kΩ × 100 µF = **10 s**. À τ, il est chargé à 63 %.', ar: 'ثابتة الزمن [[τ = R × C]]: [[100 kΩ × 100 µF = 10 s]]، وعندها يكون الشحن 63 %.', hud: { n: ['τ = R × C'], v: ['10 s'] }, run: function (e) { e.s.set({ tau: 10, mark: 1 }); } },
        { cap: 'Plus grand **C** (ou plus grande **R**) : la charge est **plus lente**, la durée plus longue.', ar: 'كلما كبرت C أو R كان الشحن أبطأ والمدة أطول.', hud: { n: 'régler', v: ['220 µF → 22 s'] }, run: function (e) { e.s.set({ tau: 22, mark: 1 }); } },
        { cap: 'Plus petit C : **plus rapide**. 47 µF → 4,7 s.', ar: 'كلما صغرت C كان الشحن أسرع.', hud: { n: 'régler', v: ['47 µF → 4,7 s'] }, run: function (e) { e.s.set({ tau: 4.7, mark: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'R = 100 kΩ. Choisis le condensateur pour une minuterie de 10 s.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Charge d’un condensateur' }, st);
          var s = scene(svg), set = MV.hud(c, [['c', 'C'], ['t', 'τ = R × C', 1]]);
          MV.slider(c, { label: 'C', min: 0, max: 5, value: 0, fmt: function (k) { return CS[k] + ' µF'; } }, function (k) {
            var t = tau(R, CS[k]); s.set({ tau: t, mark: 1 }); set('c', CS[k] + ' µF'); set('t', MV.fmt(t, 1) + ' s'); if (CS[k] === 100) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Calcule τ = R × C (R en kΩ, C en µF : le résultat en ms, puis ÷ 1000).',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. R = 47 kΩ, C = 100 µF. τ (s) ?', a: 4.7, tol: 0.01 },
            { q: 'Étape 2. R = 100 kΩ, C = 220 µF. τ (s) ?', a: 22 },
            { type: 'opt', q: 'Étape 3. Pour une durée plus longue, on :', o: ['augmente R ou C', 'diminue R et C'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le condensateur :', o: ['stocke des charges électriques', 'produit de la lumière'], a: 0 },
      { lvl: 'Niveau 2', q: 'Après une durée τ = R × C, le condensateur est chargé à environ :', o: ['63 %', '10 %'], a: 0 },
      { lvl: 'Niveau 3', q: 'R = 10 kΩ, C = 470 µF. τ (s) ?', a: 4.7, tol: 0.01 },
      { lvl: 'Niveau 4', q: 'On veut τ = 33 s avec C = 330 µF. R (kΩ) ?', a: 100, hint: '33 000 ms ÷ 330' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Qui compte le temps',
      hud: [['b', 'R'], ['l', 'C'], ['d', 'durée']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le condensateur se charge à travers la résistance : c’est cette **lenteur** qui compte le temps.', hud: { b: '100 kΩ', l: '100 µF', d: ['τ = 10 s'] }, run: function (e) { e.s.set({ tau: 10, mark: 1 }); } },
        { cap: 'Pour une minuterie plus longue, on prend un **C** ou une **R** plus grands.', ar: 'لمؤقت أطول نأخذ C أو R أكبر.', hud: { b: '100 kΩ', l: ['220 µF'], d: ['22 s'] }, run: function (e) { e.s.set({ tau: 22, mark: 1 }); } }
      ]
    },

    retenir: [
      '<b>Temporiser</b> = attendre une durée avant d’agir. Dans un circuit <b>RC</b>, le condensateur se charge à travers la résistance.',
      '<b class="mono">τ = R × C</b> (kΩ × µF = ms). À τ, la charge atteint environ 63 %. Plus R ou C sont grands, plus la durée est <b>longue</b>.'
    ],
    retenirAr: 'التأخير الزمني هو انتظار مدة قبل التأثير. في الدارة RC يشحن المكثف عبر المقاومة، و[[τ = R × C]]. كلما كبرت R أو C طالت المدة.',
    voc: [['temporiser', 'التأخير الزمني'], ['un condensateur', 'مكثف'], ['la charge', 'الشحن'], ['la constante de temps', 'ثابتة الزمن'], ['une minuterie', 'مؤقت']]
  });
})();
