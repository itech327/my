/* @meta {"id":"3ac-repere","level":"3","order":11,"theme":"Géométrie","title":"Repère dans le plan","ar":"المعلم في المستوى","lead":"Sur le plan quadrillé du quartier, la maison est en (1 ; 1) et le collège en (7 ; 9). À vol d'oiseau, quelle distance ? Où se retrouver à mi-chemin ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, U = 18, X0 = 40, Y0 = 196; // 1 unité = 18 px, origine en bas à gauche

  function px(p) { return [X0 + p[0] * U, Y0 - p[1] * U]; }
  function plan(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    for (var i = 0; i <= 16; i++) S('line', { x1: X0 + i * U, y1: Y0, x2: X0 + i * U, y2: Y0 - 10 * U, stroke: 'rgba(255,255,255,.07)' }, g);
    for (var j = 0; j <= 10; j++) S('line', { x1: X0, y1: Y0 - j * U, x2: X0 + 16 * U, y2: Y0 - j * U, stroke: 'rgba(255,255,255,.07)' }, g);
    S('path', { d: 'M' + X0 + ' ' + Y0 + ' H' + (X0 + 16 * U) + ' M' + X0 + ' ' + Y0 + ' V' + (Y0 - 10 * U), stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    T(g, X0 - 6, Y0 + 14, 'O', 'tag', 'end'); T(g, X0 + U, Y0 + 14, '1', 'tag'); T(g, X0 - 8, Y0 - U + 4, '1', 'tag', 'end');
    g.set = function (A, B, o) { // o.tri : triangle rectangle ; o.mil : milieu ; o.seg : segment
      o = o || {};
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var a = px(A), b = px(B);
      if (o.tri) { var c = px([B[0], A[1]]); S('path', { d: 'M' + a + ' L' + c + ' L' + b, fill: 'none', stroke: '#f2c14e', 'stroke-width': 2.5, 'stroke-dasharray': '6 4' }, dyn); T(dyn, (a[0] + c[0]) / 2, a[1] + 16, (B[0] - A[0]), 'tag'); T(dyn, c[0] + 8, (c[1] + b[1]) / 2, (B[1] - A[1]), 'tag', 'start'); }
      if (o.seg) S('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: 'var(--acc)', 'stroke-width': 3 }, dyn);
      [[a, 'A', A, 10, 18, 'start'], [b, 'B', B, -8, -8, 'end']].forEach(function (p) { S('circle', { cx: p[0][0], cy: p[0][1], r: 5, fill: '#e9e9ea' }, dyn); T(dyn, p[0][0] + p[3], p[0][1] + p[4], p[1] + '(' + p[2][0] + ' ; ' + p[2][1] + ')', 'tag', p[5]); });
      if (o.mil) { var M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], m = px(M); S('circle', { cx: m[0], cy: m[1], r: 6, fill: 'var(--acc)' }, dyn); T(dyn, m[0] + 10, m[1] + 4, 'M(' + String(M[0]).replace('.', ',') + ' ; ' + String(M[1]).replace('.', ',') + ')', 'tag', 'start'); }
    };
    return g;
  }
  function dist(A, B) { return Math.sqrt(Math.pow(B[0] - A[0], 2) + Math.pow(B[1] - A[1], 2)); }

  MV.lesson({
    id: '3ac-repere',
    objectif: {
      fr: 'Lire les coordonnées d\'un point, calculer les coordonnées du milieu d\'un segment et la distance entre deux points dans un repère orthonormé.',
      ar: 'قراءة إحداثيتي نقطة، وحساب إحداثيتي منتصف قطعة والمسافة بين نقطتين في معلم متعامد ممنظم.'
    },

    ouverture: {
      vb: '0 0 360 215', label: 'Le plan du quartier',
      hud: [['m', 'maison'], ['c', 'collège'], ['q', 'distance ?']],
      draw: function (svg) { var e = {}; e.p = plan(svg); return e; },
      steps: [
        { cap: 'Sur le plan quadrillé, la **maison** est en A(1 ; 1).', hud: { m: ['(1 ; 1)'], c: '–', q: '–' }, run: function (e) { e.p.set([1, 1], [7, 9]); } },
        { cap: 'Le **collège** est en B(7 ; 9). Une unité représente 100 m.', hud: { m: '(1 ; 1)', c: ['(7 ; 9)'], q: '–' }, run: function (e) { e.p.set([1, 1], [7, 9]); } },
        { cap: 'Quelle distance à vol d\'oiseau ? Où se retrouver à **mi-chemin** ? On le saura à la fin.', hud: { m: '(1 ; 1)', c: '(7 ; 9)', q: ['?'] }, run: function (e) { e.p.set([1, 1], [7, 9], { seg: 1 }); } }
      ]
    },

    predire: {
      q: "Dans un repère orthonormé, la maison est en A(1 ; 1) et le collège en B(7 ; 9), une unité valant 100 m. Quelle est la distance à vol d'oiseau ?",
      ar: "في معلم متعامد ممنظم، البيت في [[A(1 ; 1)]] والمدرسة في [[B(7 ; 9)]] والوحدة [[100 m]]. ما المسافة على خط مستقيم؟",
      o: ["1 400 m", "1 000 m", "800 m"],
      a: 1,
      e: "Le déplacement est de 6 unités en abscisse et de 8 en ordonnée. AB = √(6² + 8²) = √100 = 10 unités, soit 1 000 m. Les 14 unités de l'erreur 1 400 m sont le chemin le long des rues.",
      ear: "[[AB = √(6² + 8²) = √100 = 10]] وحدات، أي [[1 000 m]]."
    },

    prepare: [
      ['Dans A(3 ; 5), 3 est l\'abscisse.', true, 'L\'abscisse se lit sur l\'axe horizontal.'],
      ['Dans un triangle rectangle, l\'hypoténuse² = somme des carrés des deux autres côtés.', true, 'C\'est le théorème de Pythagore.'],
      ['Le milieu de [AB] a pour abscisse xA + xB.', false, 'C\'est la moyenne : (xA + xB) ÷ 2.']
    ],

    regarde: {
      vb: '0 0 360 215', label: 'Coordonnées, milieu, distance',
      hud: [['n', 'notion'], ['f', 'formule'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.p = plan(svg); return e; },
      steps: [
        { cap: 'Un point a une **abscisse** (lue en horizontal) et une **ordonnée** (lue en vertical) : A(1 ; 1), B(7 ; 9).', ar: 'لكل نقطة أفصول وأرتوب.', hud: { n: ['coordonnées'], f: '(x ; y)', r: 'A(1 ; 1), B(7 ; 9)' }, run: function (e) { e.p.set([1, 1], [7, 9]); } },
        { cap: 'Le **milieu** M a pour coordonnées les **moyennes** : ((1 + 7) ÷ 2 ; (1 + 9) ÷ 2) = **(4 ; 5)**.', ar: 'إحداثيتا المنتصف هما معدلا الإحداثيات: [[M(4 ; 5)]].', hud: { n: ['milieu'], f: '((xA + xB)/2 ; (yA + yB)/2)', r: ['M(4 ; 5)'] }, run: function (e) { e.p.set([1, 1], [7, 9], { seg: 1, mil: 1 }); } },
        { cap: 'Pour la **distance**, on trace un triangle rectangle : côtés 7 − 1 = **6** et 9 − 1 = **8**.', ar: 'نرسم مثلثا قائما ضلعاه 6 و 8.', hud: { n: ['distance'], f: 'Pythagore', r: '6 et 8' }, run: function (e) { e.p.set([1, 1], [7, 9], { seg: 1, tri: 1 }); } },
        { cap: 'AB² = 6² + 8² = 100, donc **AB = 10**. En général : AB = √((xB − xA)² + (yB − yA)²).', ar: '[[AB = √((xB − xA)² + (yB − yA)²)]].', hud: { n: 'distance', f: ['√((xB − xA)² + (yB − yA)²)'], r: ['AB = 10'] }, run: function (e) { e.p.set([1, 1], [7, 9], { seg: 1, tri: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Déplace B et lis la distance AB et le milieu M. Trouve B tel que AB = 5 avec B(4 ; ?).',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 215', role: 'img', 'aria-label': 'Repère et deux points' }, st);
          var p = plan(svg), A = [1, 1], B = [4, 2], set = MV.hud(c, [['b', 'B'], ['m', 'milieu M'], ['d', 'AB', 1]]);
          function upd() { p.set(A, B, { seg: 1, tri: 1, mil: 1 }); var d = dist(A, B); set('b', '(' + B[0] + ' ; ' + B[1] + ')'); set('m', '(' + String((A[0] + B[0]) / 2).replace('.', ',') + ' ; ' + String((A[1] + B[1]) / 2).replace('.', ',') + ')'); set('d', (Math.round(d * 100) / 100).toString().replace('.', ',')); if (B[0] === 4 && B[1] === 5) done(); }
          MV.slider(c, { label: 'ordonnée de B', min: 1, max: 9, value: 2 }, function (y) { B[1] = y; upd(); });
          upd();
          MV.H('p', 'small', 'B a pour abscisse 4. Indice : 3² + 4² = 5².', c);
        } },
      { title: 'Résolvons ensemble', intro: 'E(−2 ; 3) et F(4 ; −5).',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Abscisse du milieu de [EF] ?', a: 1 },
            { q: 'Étape 2. Ordonnée du milieu de [EF] ?', a: -1 },
            { q: 'Étape 3. EF = √(6² + 8²) = ?', a: 10 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Dans P(−3 ; 7), l\'ordonnée est :', o: ['7', '−3'], a: 0 },
      { lvl: 'Niveau 2', q: 'A(2 ; 4), B(6 ; 8). Abscisse du milieu ?', a: 4 },
      { lvl: 'Niveau 3', q: 'A(0 ; 0), B(3 ; 4). AB = ?', a: 5 },
      { lvl: 'Niveau 4', q: 'A(1 ; 2), B(13 ; 7). AB = ?', a: 13, hint: '12² + 5² = 169.' }
    ],

    bilan: {
      vb: '0 0 360 215', label: 'Maison et collège',
      hud: [['d', 'distance'], ['r', 'en mètres'], ['m', 'mi-chemin']],
      draw: function (svg) { var e = {}; e.p = plan(svg); return e; },
      steps: [
        { cap: 'AB = √(6² + 8²) = **10** unités, soit **1 000 m** à vol d\'oiseau.', hud: { d: ['10'], r: ['1 000 m'], m: '–' }, run: function (e) { e.p.set([1, 1], [7, 9], { seg: 1, tri: 1 }); } },
        { cap: 'Le point de rendez-vous à mi-chemin est **M(4 ; 5)**.', ar: 'المسافة 10 وحدات أي 1000 متر، ونقطة منتصف الطريق هي [[M(4 ; 5)]].', hud: { d: '10', r: '1 000 m', m: ['M(4 ; 5)'] }, run: function (e) { e.p.set([1, 1], [7, 9], { seg: 1, mil: 1 }); } }
      ]
    },

    retenir: [
      'Dans un repère, un point a une <b>abscisse</b> et une <b>ordonnée</b>. Le <b>milieu</b> de [AB] a pour coordonnées <b class="mono">((xA + xB)/2 ; (yA + yB)/2)</b>.',
      'Dans un repère <b>orthonormé</b> : <b class="mono">AB = √((xB − xA)² + (yB − yA)²)</b>, grâce au théorème de Pythagore.'
    ],
    retenirAr: 'لكل نقطة في معلم أفصول وأرتوب. إحداثيتا منتصف [AB] هما [[((xA + xB)/2 ; (yA + yB)/2)]]. في معلم متعامد ممنظم: [[AB = √((xB − xA)² + (yB − yA)²)]].',
    voc: [['un repère', 'معلم'], ['l\'abscisse', 'الأفصول'], ['l\'ordonnée', 'الأرتوب'], ['orthonormé', 'متعامد ممنظم'], ['le milieu', 'المنتصف']]
  });
})();
