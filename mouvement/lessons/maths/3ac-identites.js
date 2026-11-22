/* @meta {"id":"3ac-identites","level":"3","order":2,"theme":"Calcul littéral","title":"Les identités remarquables","ar":"المتطابقات الهامة","lead":"Calculer 101² de tête : un carré découpé en quatre morceaux donne la formule (a + b)²."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* carré de côté a + b découpé : a² (accent), deux rectangles ab, b² */
  function decoupe(svg, X, Y) {
    var g = S('g', {}, svg);
    g.set = function (a, b, k, opts) {
      opts = opts || {};
      while (g.firstChild) g.removeChild(g.firstChild);
      var A = a * k, B = b * k;
      function r(x, y, w, h, fill, lab, show) { S('rect', { x: x, y: y, width: w, height: h, fill: fill, stroke: '#141517', 'stroke-width': 2 }, g); if (show !== false && w > 20 && h > 16) T(g, x + w / 2, y + h / 2 + 5, lab, 'lbl').style.fill = '#fff'; }
      r(X, Y, A, A, 'var(--acc)', opts.la || 'a²');
      if (!opts.only) {
        r(X + A, Y, B, A, '#3d6f96', opts.lab || 'ab'); r(X, Y + A, A, B, '#3d6f96', opts.lab || 'ab'); r(X + A, Y + A, B, B, '#6b6f76', opts.lb || 'b²');
      }
      T(g, X + A / 2, Y - 8, opts.ta || 'a', 'tag'); if (!opts.only) T(g, X + A + B / 2, Y - 8, opts.tb || 'b', 'tag');
      T(g, X - 10, Y + A / 2, opts.ta || 'a', 'tag', 'end'); if (!opts.only) T(g, X - 10, Y + A + B / 2, opts.tb || 'b', 'tag', 'end');
    };
    g.setAttribute('data-keep', 1);
    return g;
  }

  MV.lesson({
    id: '3ac-identites',
    objectif: {
      fr: 'Comprendre et utiliser les identités remarquables pour développer, factoriser et calculer.',
      ar: 'فهم المتطابقات الهامة واستعمالها في النشر والتعميل والحساب.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Un calcul de tête',
      hud: [['c', 'calcul'], ['m', 'méthode'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.t = T(svg, 180, 90, '101² = ?', 'lbl big'); e.t.style.fontSize = '40px'; e.t.setAttribute('data-keep', 1); e.c = T(svg, 180, 150, 'sans calculatrice', 'lbl acc'); return e; },
      steps: [
        { cap: 'Le professeur demande : combien font **101²** ?', hud: { c: ['101 × 101'], m: '–', r: '–' } },
        { cap: 'Sans calculatrice, et en **moins de 10 secondes**.', on: ['c'], hud: { c: '101 × 101', m: ['?'], r: '–' } },
        { cap: 'Une formule le permet. **Laquelle** ? On le saura à la fin.', on: ['c'], hud: { c: '101 × 101', m: '?', r: ['?'] } }
      ]
    },

    predire: {
      q: "Sans calculatrice, combien font 101² ?",
      ar: "بدون آلة حاسبة، كم يساوي [[101²]]؟",
      o: ["10 001", "10 201", "10 101"],
      a: 1,
      e: "101² = (100 + 1)² = 100² + 2 × 100 × 1 + 1² = 10 000 + 200 + 1 = 10 201. L'erreur 10 001 oublie le double produit 2ab.",
      ear: "[[101² = (100 + 1)² = 10 000 + 200 + 1 = 10 201]]."
    },

    prepare: [
      ['L\'aire d\'un rectangle de côtés a et b est a × b.', true, 'Longueur × largeur.'],
      ['(a + b)² = a² + b²', false, 'C\'est l\'erreur classique : il manque le terme 2ab. On va le voir.'],
      ['3x × 2 = 6x', true, 'On multiplie les nombres : 3 × 2 = 6.']
    ],

    regarde: {
      vb: '0 0 360 300', label: 'Le carré de côté a + b',
      hud: [['a', 'morceaux'], ['f', 'formule'], ['x', 'exemple']],
      draw: function (svg) { var e = {}; e.q = decoupe(svg, 70, 30); return e; },
      steps: [
        { cap: 'Un carré de côté **a + b**. Son aire est (a + b)².', ar: 'مربع طول ضلعه [[a + b]] ومساحته [[(a + b)²]].', hud: { a: '–', f: ['(a + b)²'], x: '–' }, run: function (e) { e.q.set(5, 3, 30, { la: '', lab: '', lb: '' }); } },
        { cap: 'On le découpe : un carré **a²**…', ar: 'نقسمه: مربع مساحته [[a²]]…', hud: { a: ['a²'], f: '(a + b)²', x: '–' }, run: function (e) { e.q.set(5, 3, 30, { lab: '', lb: '' }); } },
        { cap: '… **deux rectangles** ab, et un petit carré b².', ar: '… ومستطيلان مساحة كل منهما [[ab]]، ومربع صغير مساحته [[b²]].', hud: { a: ['a² + ab + ab + b²'], f: '(a + b)²', x: '–' }, run: function (e) { e.q.set(5, 3, 30); } },
        { cap: 'Donc **(a + b)² = a² + 2ab + b²**. Les deux rectangles font 2ab.', ar: 'إذن [[(a + b)² = a² + 2ab + b²]].', hud: { a: 'a² + 2ab + b²', f: ['(a + b)² = a² + 2ab + b²'], x: '–' }, run: function (e) { e.q.set(5, 3, 30); } },
        { cap: 'Exemple : (x + 3)² = x² + **6x** + 9.', ar: 'مثال: [[(x + 3)² = x² + 6x + 9]].', hud: { a: 'x², 3x, 3x, 9', f: '(a + b)²', x: ['x² + 6x + 9'] }, run: function (e) { e.q.set(5, 3, 30, { ta: 'x', tb: '3', la: 'x²', lab: '3x', lb: '9' }); } },
        { cap: 'De même : **(a − b)² = a² − 2ab + b²**.', ar: 'وبالمثل: [[(a − b)² = a² − 2ab + b²]].', hud: { a: '–', f: ['(a − b)²'], x: '(x − 3)² = x² − 6x + 9' }, run: function (e) { e.q.set(5, 3, 30, { la: '(a−b)²', lab: '', lb: '' }); } },
        { cap: 'Et **(a + b)(a − b) = a² − b²** : utile pour factoriser.', ar: 'و [[(a + b)(a − b) = a² − b²]].', hud: { a: '–', f: ['(a + b)(a − b) = a² − b²'], x: 'x² − 9 = (x − 3)(x + 3)' }, run: function (e) { e.q.set(5, 3, 30, { only: true }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change a et b. Vérifie que les quatre morceaux remplissent toujours le grand carré.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 280', role: 'img', 'aria-label': 'Carré découpé' }, st);
          var q = decoupe(svg, 80, 30), a = 5, b = 3, set;
          function upd() { var k = 220 / (a + b); q.set(a, b, k, { la: (a * a) + '', lab: (a * b) + '', lb: (b * b) + '' }); if (set) { set('s', a * a + ' + ' + 2 * a * b + ' + ' + b * b); set('t', (a + b) * (a + b)); set('f', '(' + a + '+' + b + ')² = ' + (a + b) * (a + b)); } }
          MV.slider(c, { label: 'a', min: 1, max: 10, value: 5 }, function (v) { a = v; upd(); });
          MV.slider(c, { label: 'b', min: 1, max: 10, value: 3 }, function (v) { b = v; upd(); });
          set = MV.hud(c, [['s', 'a² + 2ab + b²'], ['t', 'total', 1], ['f', '(a + b)²', 1]]);
          upd(); done();
        } },
      { title: 'Résolvons ensemble', intro: 'Développe (2x + 5)².',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Quelle identité utiliser ?', o: ['(a + b)² = a² + 2ab + b²', '(a − b)² = a² − 2ab + b²', '(a + b)(a − b) = a² − b²'], a: 0, e: 'Ici a = 2x et b = 5.' },
            { type: 'opt', q: 'Étape 2. a² = (2x)² = ?', o: ['2x²', '4x²', '4x'], a: 1, e: '(2x)² = 2x × 2x = 4x².', ko: 'Le 2 aussi est au carré.' },
            { q: 'Étape 3. 2ab = 2 × 2x × 5 = ?x. Donne le coefficient.', a: 20, hint: '2 × 2 × 5.' },
            { q: 'Étape 4. b² = ? (le terme constant)', a: 25, ok: '(2x + 5)² = 4x² + 20x + 25.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Calcule 21² avec (20 + 1)².', a: 441, hint: '400 + 40 + 1.' },
      { lvl: 'Niveau 2', q: 'Dans (x − 5)², quel est le terme constant ?', a: 25, hint: 'b² avec b = 5.' },
      { lvl: 'Niveau 3', q: 'Calcule 99 × 101 avec (100 − 1)(100 + 1).', a: 9999, hint: '100² − 1².' },
      { lvl: 'Niveau 4', q: 'Factorise x² − 49.', o: ['(x − 7)²', '(x − 7)(x + 7)', '(x − 49)(x + 1)'], a: 1, e: 'a² − b² = (a − b)(a + b) avec a = x, b = 7.' }
    ],

    bilan: {
      vb: '0 0 360 300', label: '101² découpé',
      hud: [['a', 'a²'], ['m', '2ab'], ['b', 'b²']],
      draw: function (svg) { var e = {}; e.q = decoupe(svg, 50, 30); return e; },
      steps: [
        { cap: '101 = 100 + 1 : on découpe le carré en **100² , 2 × 100, 1²**.', hud: { a: ['10 000'], m: ['200'], b: ['1'] }, run: function (e) { e.q.set(100, 18, 2.2, { ta: '100', tb: '1', la: '10 000', lab: '100', lb: '1' }); } },
        { cap: '101² = 10 000 + 200 + 1 = **10 201**.', ar: 'نحسب ذهنيا: [[101² = 10000 + 200 + 1 = 10201]].', hud: { a: '10 000', m: '200', b: '1' }, run: function (e) { e.q.set(100, 18, 2.2, { ta: '100', tb: '1', la: '10 201', lab: '', lb: '' }); } }
      ]
    },

    retenir: [
      '<b class="mono">(a + b)² = a² + 2ab + b²</b> ; <b class="mono">(a − b)² = a² − 2ab + b²</b> ; <b class="mono">(a + b)(a − b) = a² − b²</b>.',
      'De gauche à droite, on <b>développe</b> ; de droite à gauche, on <b>factorise</b>. Attention : (a + b)² n\'est pas égal à a² + b².'
    ],
    retenirAr: 'المتطابقات الهامة: [[(a + b)² = a² + 2ab + b²]] و [[(a − b)² = a² − 2ab + b²]] و [[(a + b)(a − b) = a² − b²]]. نستعملها للنشر وللتعميل.',
    voc: [['une identité remarquable', 'متطابقة هامة'], ['développer', 'ينشر'], ['factoriser', 'يعمل'], ['le terme', 'الحد']]
  });
})();
