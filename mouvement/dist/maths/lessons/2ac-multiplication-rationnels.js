/* @meta {"id":"2ac-multiplication-rationnels","level":"2","order":4,"theme":"Nombres et calcul","title":"Multiplier et diviser des rationnels","ar":"ضرب وقسمة الأعداد الجذرية","lead":"Les 2/3 des 3/4 d'un terrain sont plantés d'oliviers : un rectangle quadrillé montre que c'est la moitié."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* rectangle unité : colonnes b (fraction a/b), lignes d (fraction c/d) */
  function grille(svg, X, Y, W, H) {
    var g = S('g', { 'data-keep': 1 }, svg);
    g.set = function (a, b, c, d, mode) {
      while (g.firstChild) g.removeChild(g.firstChild);
      S('rect', { x: X, y: Y, width: W, height: H, fill: '#2b2e33', stroke: '#9aa0a8', 'stroke-width': 2 }, g);
      var cw = W / b, rh = H / d;
      if (mode >= 1) S('rect', { x: X, y: Y, width: a * cw, height: H, fill: '#3d6f96' }, g);
      if (mode >= 2) S('rect', { x: X, y: Y, width: W, height: c * rh, fill: 'rgba(242,193,78,.35)' }, g);
      if (mode >= 3) S('rect', { x: X, y: Y, width: a * cw, height: c * rh, fill: 'var(--acc)' }, g);
      for (var i = 1; i < b; i++) S('line', { x1: X + i * cw, y1: Y, x2: X + i * cw, y2: Y + H, stroke: '#141517', 'stroke-width': 2 }, g);
      if (mode >= 2) for (var j = 1; j < d; j++) S('line', { x1: X, y1: Y + j * rh, x2: X + W, y2: Y + j * rh, stroke: '#141517', 'stroke-width': 2 }, g);
    };
    return g;
  }

  MV.lesson({
    id: '2ac-multiplication-rationnels',
    objectif: {
      fr: 'Multiplier deux nombres rationnels, appliquer la règle des signes et diviser en multipliant par l\'inverse.',
      ar: 'ضرب عددين جذريين، وتطبيق قاعدة الإشارات، والقسمة بالضرب في المقلوب.'
    },

    prerequis: {
      fr: 'Multiplier des entiers relatifs ; simplifier une fraction.',
      ar: 'ضرب الأعداد الصحيحة النسبية واختزال كسر.'
    },

    ouverture: {
      vb: '0 0 360 230', label: 'Un terrain partagé',
      hud: [['a', 'cultivé'], ['b', 'oliviers'], ['q', 'part du terrain']],
      draw: function (svg) { var e = {}; e.g = grille(svg, 60, 20, 240, 180); return e; },
      steps: [
        { cap: 'Un terrain près de Meknès : les **3/4** sont cultivés.', hud: { a: ['3/4'], b: '–', q: '–' }, run: function (e) { e.g.set(3, 4, 0, 3, 1); } },
        { cap: 'Sur la partie cultivée, les **2/3** sont plantés d\'oliviers.', hud: { a: '3/4', b: ['2/3 de 3/4'], q: '–' }, run: function (e) { e.g.set(3, 4, 2, 3, 3); } },
        { cap: 'Quelle part du **terrain entier** ? On le saura à la fin.', hud: { a: '3/4', b: '2/3 de 3/4', q: ['?'] }, run: function (e) { e.g.set(3, 4, 2, 3, 3); } }
      ]
    },

    predire: {
      q: "Les 3/4 d'un terrain sont cultivés, et les 2/3 de la partie cultivée sont plantés d'oliviers. Quelle part du terrain entier est plantée d'oliviers ?",
      ar: "زُرع [[3/4]] من أرض، وغُرس [[2/3]] من الجزء المزروع زيتوناً. ما حصة الزيتون من الأرض كلها؟",
      o: ["5/7", "2/3", "1/2"],
      a: 2,
      e: "Prendre les 2/3 des 3/4, c'est multiplier : 2/3 × 3/4 = (2 × 3)/(3 × 4) = 6/12 = 1/2. La moitié du terrain est plantée d'oliviers.",
      ear: "[[2/3 × 3/4 = 6/12 = 1/2]]: نصف الأرض مغروس زيتوناً."
    },

    prepare: [
      ['(−2) × (−5) = 10', true, 'Même signe : produit positif.'],
      ['« Les 2/3 de 12 » se calcule 2/3 × 12.', true, '2/3 × 12 = 8.'],
      ['L\'inverse de 4/5 est −4/5.', false, 'L\'inverse de 4/5 est 5/4 : 4/5 × 5/4 = 1.']
    ],

    regarde: {
      vb: '0 0 360 230', label: 'Produit de deux fractions',
      hud: [['c', 'calcul'], ['r', 'règle'], ['v', 'résultat']],
      draw: function (svg) { var e = {}; e.g = grille(svg, 60, 20, 240, 180); return e; },
      steps: [
        { cap: 'Pour 2/3 × 3/4 : on colorie **3/4** du rectangle (3 colonnes sur 4).', ar: 'نلون [[3/4]] من المستطيل.', hud: { c: '2/3 × 3/4', r: '–', v: '–' }, run: function (e) { e.g.set(3, 4, 0, 3, 1); } },
        { cap: 'On coupe en 3 lignes et on prend **2/3** de cette partie.', ar: 'نقسم إلى 3 صفوف ونأخذ [[2/3]].', hud: { c: '2/3 × 3/4', r: '–', v: '–' }, run: function (e) { e.g.set(3, 4, 2, 3, 3); } },
        { cap: '6 cases sur 12 : 2/3 × 3/4 = **6/12**. Haut × haut, bas × bas.', ar: 'نضرب البسطين ونضرب المقامين: [[2/3 × 3/4 = 6/12]].', hud: { c: '(2 × 3)/(3 × 4)', r: ['a/b × c/d = (a × c)/(b × d)'], v: ['6/12'] }, run: function (e) { e.g.set(3, 4, 2, 3, 3); } },
        { cap: 'On simplifie : 6/12 = **1/2**.', ar: 'نختزل: [[6/12 = 1/2]].', hud: { c: '6/12', r: 'simplifier', v: ['1/2'] }, run: function (e) { e.g.set(3, 4, 2, 3, 3); } },
        { cap: 'Signes : (−2/3) × 3/4 = **−1/2**. Même règle que pour les relatifs.', ar: 'قاعدة الإشارات: إشارتان مختلفتان تعطيان جداء سالبا.', hud: { c: '(−2/3) × 3/4', r: ['− × + = −'], v: ['−1/2'] }, run: function (e) { e.g.set(3, 4, 2, 3, 3); } },
        { cap: 'Diviser par 3/4, c\'est **multiplier par son inverse** 4/3.', ar: 'القسمة على [[3/4]] هي الضرب في مقلوبه [[4/3]].', hud: { c: '1/2 ÷ 3/4', r: ['× l\'inverse'], v: ['1/2 × 4/3 = 2/3'] }, run: function (e) { e.g.set(3, 4, 2, 3, 3); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis les deux fractions. Compte les cases orange.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 220', role: 'img', 'aria-label': 'Produit de fractions' }, st);
          var g = grille(svg, 60, 20, 240, 180), a = 3, b = 4, cc = 2, d = 3, set = MV.hud(c, [['c', 'calcul'], ['v', 'produit', 1]]);
          function pg(x, y) { return y ? pg(y, x % y) : x; }
          function upd() { a = Math.min(a, b); cc = Math.min(cc, d); g.set(a, b, cc, d, 3); var n = a * cc, m = b * d, k = pg(n, m) || 1; set('c', cc + '/' + d + ' × ' + a + '/' + b); set('v', n + '/' + m + (k > 1 ? ' = ' + (n / k) + '/' + (m / k) : '')); }
          MV.slider(c, { label: 'a', min: 1, max: 6, value: 3 }, function (v) { a = v; upd(); });
          MV.slider(c, { label: 'b', min: 1, max: 6, value: 4 }, function (v) { b = v; upd(); });
          MV.slider(c, { label: 'c', min: 1, max: 6, value: 2 }, function (v) { cc = v; upd(); });
          MV.slider(c, { label: 'd', min: 1, max: 6, value: 3 }, function (v) { d = v; upd(); });
          MV.H('p', 'small', 'Colonnes : a/b. Lignes : c/d. Le numérateur ne dépasse pas le dénominateur.', c);
          upd(); done();
        } },
      { title: 'Résolvons ensemble', intro: 'Calcule A = (−5/6) ÷ (10/3).',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Diviser par 10/3, c\'est multiplier par :', o: ['3/10', '−10/3', '10/3'], a: 0 },
            { type: 'opt', q: 'Étape 2. Le signe du résultat est :', o: ['positif', 'négatif'], a: 1, e: 'Un seul facteur négatif.' },
            { q: 'Étape 3. A = −(5 × 3)/(6 × 10) = −15/60 = −1/? (donne le dénominateur)', a: 4, ok: 'A = −1/4.', hint: '15/60 se simplifie par 15.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: '3/5 × 2/7 = ?/35', a: 6 },
      { lvl: 'Niveau 2', q: 'Le signe de (−3/4) × (−8/9) est :', o: ['positif', 'négatif'], a: 0 },
      { lvl: 'Niveau 3', q: '2/3 ÷ 4/9 = 3/? (simplifié)', a: 2, hint: '2/3 × 9/4 = 18/12.' },
      { lvl: 'Niveau 4', q: 'Un réservoir de 600 L est rempli aux 3/4. On en utilise les 2/5. Combien de litres utilise-t-on ?', a: 180, unit: 'L', hint: '2/5 × 3/4 × 600.' }
    ],

    bilan: {
      vb: '0 0 360 230', label: 'Les oliviers',
      hud: [['c', 'calcul'], ['v', 'part'], ['r', 'réponse']],
      draw: function (svg) { var e = {}; e.g = grille(svg, 60, 20, 240, 180); return e; },
      steps: [
        { cap: '2/3 des 3/4 : 2/3 × 3/4 = **6/12**.', hud: { c: ['2/3 × 3/4'], v: '6/12', r: '–' }, run: function (e) { e.g.set(3, 4, 2, 3, 3); } },
        { cap: '6/12 = **1/2** : les oliviers couvrent la moitié du terrain.', ar: 'تغطي أشجار الزيتون نصف الأرض: [[2/3 × 3/4 = 1/2]].', hud: { c: '2/3 × 3/4', v: ['1/2'], r: ['la moitié'] }, run: function (e) { e.g.set(3, 4, 2, 3, 3); } }
      ]
    },

    retenir: [
      '<b class="mono">a/b × c/d = (a × c)/(b × d)</b>. Le signe suit la règle des relatifs : même signe, produit positif ; signes contraires, produit négatif.',
      'Pour <b>diviser</b> par un rationnel non nul, on multiplie par son <b>inverse</b> : a/b ÷ c/d = a/b × d/c.'
    ],
    retenirAr: 'لضرب عددين جذريين نضرب البسطين ونضرب المقامين. القسمة على عدد جذري غير منعدم هي الضرب في مقلوبه.',
    voc: [['le produit', 'الجداء'], ['l\'inverse', 'المقلوب'], ['le quotient', 'الخارج'], ['la règle des signes', 'قاعدة الإشارات']]
  });
})();
