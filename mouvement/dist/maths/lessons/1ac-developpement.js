/* @meta {"id":"1ac-developpement","level":"1","order":5,"theme":"Calcul littéral","title":"Développer et factoriser","ar":"النشر والتعميل","lead":"7 × 98 de tête ? Un rectangle coupé en deux montre que k × (a + b) = k × a + k × b."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* rectangle k × (a + b) coupé en deux */
  function rect(svg, X, Y) {
    var g = S('g', { 'data-keep': 1 }, svg);
    g.set = function (k, a, b, u, lab) {
      while (g.firstChild) g.removeChild(g.firstChild);
      lab = lab || {};
      var H = k * u, A = a * u, B = b * u;
      S('rect', { x: X, y: Y, width: A, height: H, fill: 'var(--acc)', stroke: '#141517', 'stroke-width': 2 }, g);
      S('rect', { x: X + A, y: Y, width: B, height: H, fill: '#3d6f96', stroke: '#141517', 'stroke-width': 2 }, g);
      function L(n, d) { return n in lab ? lab[n] : d; }
      T(g, X + A / 2, Y - 8, L('a', a), 'lbl'); T(g, X + A + B / 2, Y - 8, L('b', b), 'lbl'); T(g, X - 8, Y + H / 2 + 4, L('k', k), 'lbl', 'end');
      if (lab.in !== false) { T(g, X + A / 2, Y + H / 2 + 5, lab.ka || (k + ' × ' + a), 'lbl').style.fill = '#141517'; if (B > 30) T(g, X + A + B / 2, Y + H / 2 + 5, lab.kb || (k + ' × ' + b), 'lbl').style.fill = '#fff'; }
    };
    return g;
  }

  MV.lesson({
    id: '1ac-developpement',
    objectif: {
      fr: 'Utiliser la distributivité pour développer k(a + b) et factoriser ka + kb, et calculer astucieusement.',
      ar: 'استعمال خاصية التوزيع لنشر [[k(a + b)]] وتعميل [[ka + kb]] والحساب بذكاء.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Un calcul astucieux',
      hud: [['c', 'calcul'], ['m', 'méthode'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.t = T(svg, 180, 100, '7 × 98 = ?', 'lbl big'); e.t.style.fontSize = '38px'; e.t.setAttribute('data-keep', 1); e.s = T(svg, 180, 150, '98 = 100 − 2', 'lbl acc'); return e; },
      steps: [
        { cap: 'Calcule **7 × 98** de tête.', hud: { c: ['7 × 98'], m: '–', r: '–' } },
        { cap: 'Astuce : 98, c\'est **100 − 2**.', on: ['s'], hud: { c: '7 × 98', m: ['100 − 2'], r: '–' } },
        { cap: 'Comment utiliser cette astuce ? On le saura à la fin.', on: ['s'], hud: { c: '7 × 98', m: '100 − 2', r: ['?'] } }
      ]
    },

    predire: {
      q: "Sans calculatrice, combien font 7 × 98 ?",
      ar: "بدون آلة حاسبة، كم يساوي [[7 × 98]]؟",
      o: ["686", "696", "716"],
      a: 0,
      e: "98 = 100 − 2, donc 7 × 98 = 7 × 100 − 7 × 2 = 700 − 14 = 686. C'est la distributivité : k(a − b) = ka − kb.",
      ear: "[[98 = 100 − 2]] إذن [[7 × 98 = 700 − 14 = 686]]. هذه خاصية التوزيع."
    },

    prepare: [
      ['L\'aire d\'un rectangle est longueur × largeur.', true, 'Par exemple 3 × 5 = 15.'],
      ['3 × 4 + 3 × 6 = 3 × 10', true, '12 + 18 = 30 = 3 × 10.'],
      ['2 × (5 + 1) = 2 × 5 + 1', false, '2 × 6 = 12 mais 2 × 5 + 1 = 11 : il faut multiplier aussi le 1.']
    ],

    regarde: {
      vb: '0 0 360 230', label: 'Un rectangle coupé en deux',
      hud: [['e', 'expression'], ['a', 'aire'], ['n', 'nom']],
      draw: function (svg) { var e = {}; e.r = rect(svg, 70, 40); return e; },
      steps: [
        { cap: 'Un rectangle de largeur **3** et de longueur **5 + 2**.', ar: 'مستطيل عرضه 3 وطوله [[5 + 2]].', hud: { e: ['3 × (5 + 2)'], a: '21', n: '–' }, run: function (e) { e.r.set(3, 5, 2, 30, { in: false }); } },
        { cap: 'On le coupe : deux rectangles, **3 × 5** et **3 × 2**.', ar: 'نقسمه إلى مستطيلين: [[3 × 5]] و [[3 × 2]].', hud: { e: '3 × 5 + 3 × 2', a: ['15 + 6'], n: '–' }, run: function (e) { e.r.set(3, 5, 2, 30); } },
        { cap: 'Même aire : **3 × (5 + 2) = 3 × 5 + 3 × 2**. C\'est la distributivité.', ar: 'نفس المساحة: هذه خاصية التوزيع.', hud: { e: ['3(5 + 2) = 3 × 5 + 3 × 2'], a: '21', n: ['distributivité'] }, run: function (e) { e.r.set(3, 5, 2, 30); } },
        { cap: 'Avec des lettres : **k(a + b) = ka + kb**. De gauche à droite, on **développe**.', ar: 'بالحروف: [[k(a + b) = ka + kb]]. من اليسار إلى اليمين ننشر.', hud: { e: ['k(a + b) = ka + kb'], a: '–', n: ['développer'] }, run: function (e) { e.r.set(3, 5, 2, 30, { k: 'k', a: 'a', b: 'b', ka: 'ka', kb: 'kb' }); } },
        { cap: 'De droite à gauche : 4x + 4 × 3 = 4(x + 3). On **factorise**.', ar: 'من اليمين إلى اليسار نعمل: [[4x + 12 = 4(x + 3)]].', hud: { e: ['4x + 12 = 4(x + 3)'], a: '–', n: ['factoriser'] }, run: function (e) { e.r.set(3, 5, 2, 30, { k: '4', a: 'x', b: '3', ka: '4x', kb: '12' }); } },
        { cap: 'Ça marche aussi avec une soustraction : k(a − b) = ka − kb.', ar: 'وكذلك مع الطرح: [[k(a − b) = ka − kb]].', hud: { e: ['k(a − b) = ka − kb'], a: '–', n: 'développer' }, run: function (e) { e.r.set(3, 5, 2, 30, { k: 'k', a: 'a − b', b: 'b', ka: 'k(a − b)', kb: 'kb' }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change k, a et b. Les deux calculs donnent toujours la même aire.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Rectangle découpé' }, st);
          var r = rect(svg, 60, 30), k = 3, a = 5, b = 2, set = MV.hud(c, [['d', 'k(a + b)'], ['s', 'ka + kb', 1]]);
          function upd() { var u = Math.min(260 / (a + b), 160 / k); r.set(k, a, b, u); set('d', k + ' × ' + (a + b) + ' = ' + k * (a + b)); set('s', k * a + ' + ' + k * b + ' = ' + (k * a + k * b)); }
          MV.slider(c, { label: 'k', min: 1, max: 6, value: 3 }, function (v) { k = v; upd(); });
          MV.slider(c, { label: 'a', min: 1, max: 9, value: 5 }, function (v) { a = v; upd(); });
          MV.slider(c, { label: 'b', min: 1, max: 9, value: 2 }, function (v) { b = v; upd(); });
          upd(); done();
        } },
      { title: 'Résolvons ensemble', intro: 'Développe A = 5(2x + 3), puis factorise B = 6y + 18.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. 5 × 2x = ?x (donne le coefficient)', a: 10 },
            { q: 'Étape 2. 5 × 3 = ? Donc A = 10x + ?', a: 15 },
            { type: 'opt', q: 'Étape 3. B = 6y + 18 = ?', o: ['6(y + 3)', '6(y + 18)', '18(y + 6)'], a: 0, e: '18 = 6 × 3.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Développe 4(x + 5) = 4x + ?', a: 20 },
      { lvl: 'Niveau 2', q: 'Calcule 9 × 102 avec 9 × 100 + 9 × 2.', a: 918 },
      { lvl: 'Niveau 3', q: 'Factorise 7a + 7b :', o: ['7(a + b)', '7a(b)', '14(a + b)'], a: 0 },
      { lvl: 'Niveau 4', q: 'Calcule 13 × 27 + 13 × 73 astucieusement.', a: 1300, hint: '13 × (27 + 73).' }
    ],

    bilan: {
      vb: '0 0 360 230', label: '7 × 98',
      hud: [['c', 'calcul'], ['d', 'développement'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.r = rect(svg, 60, 40); return e; },
      steps: [
        { cap: '7 × 98 = 7 × (100 − 2) = **7 × 100 − 7 × 2**.', hud: { c: ['7 × (100 − 2)'], d: '700 − 14', r: '–' }, run: function (e) { e.r.set(7, 100, 2, 2.3, { in: false, a: '100 − 2', b: '' }); } },
        { cap: '700 − 14 = **686**. La distributivité rend le calcul facile.', ar: 'نحسب ذهنيا: [[7 × 98 = 700 − 14 = 686]].', hud: { c: '7 × (100 − 2)', d: '700 − 14', r: ['686'] }, run: function (e) { e.r.set(7, 100, 2, 2.3, { in: false, a: '100 − 2', b: '' }); } }
      ]
    },

    retenir: [
      '<b>Développer</b> : <b class="mono">k(a + b) = ka + kb</b> et <b class="mono">k(a − b) = ka − kb</b>.',
      '<b>Factoriser</b>, c\'est faire l\'inverse : <b class="mono">ka + kb = k(a + b)</b>. La distributivité aide aussi à calculer de tête.'
    ],
    retenirAr: 'النشر: [[k(a + b) = ka + kb]]. التعميل هو العكس: [[ka + kb = k(a + b)]]. خاصية التوزيع تساعد أيضا على الحساب الذهني.',
    voc: [['développer', 'ينشر'], ['factoriser', 'يعمل'], ['la distributivité', 'خاصية التوزيع'], ['un facteur commun', 'عامل مشترك']]
  });
})();
