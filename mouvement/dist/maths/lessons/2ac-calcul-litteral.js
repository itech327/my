/* @meta {"id":"2ac-calcul-litteral","level":"2","order":9,"theme":"Numérique","title":"Calcul littéral","ar":"الحساب الحرفي","lead":"Un jardin carré de côté x est agrandi de 3 m d'un côté et de 2 m de l'autre. Quatre rectangles donnent son aire : (x + 3)(x + 2)."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* rectangle (a + b)(c + d) coupé en quatre */
  function grille(svg, X, Y) {
    var g = S('g', { 'data-keep': 1 }, svg);
    g.set = function (A, B, C, D, lab, n) { // longueurs en px ; lab = [a,b,c,d, aires...] ; n = nombre de morceaux colorés
      while (g.firstChild) g.removeChild(g.firstChild);
      var cols = ['var(--acc)', '#3d6f96', '#7fb2ff', '#e9b949'], R = [[X, Y, A, C], [X + A, Y, B, C], [X, Y + C, A, D], [X + A, Y + C, B, D]];
      R.forEach(function (r, i) {
        S('rect', { x: r[0], y: r[1], width: r[2], height: r[3], fill: i < n ? cols[i] : 'rgba(255,255,255,.06)', stroke: '#141517', 'stroke-width': 2 }, g);
        if (i < n && lab[4 + i]) { var t = T(g, r[0] + r[2] / 2, r[1] + r[3] / 2 + 5, lab[4 + i], 'lbl'); t.style.fill = '#141517'; }
      });
      T(g, X + A / 2, Y - 8, lab[0], 'lbl'); T(g, X + A + B / 2, Y - 8, lab[1], 'lbl');
      T(g, X - 8, Y + C / 2 + 4, lab[2], 'lbl', 'end'); T(g, X - 8, Y + C + D / 2 + 4, lab[3], 'lbl', 'end');
    };
    return g;
  }
  var JARDIN = ['x', '3', 'x', '2', 'x²', '3x', '2x', '6'];

  MV.lesson({
    id: '2ac-calcul-litteral',
    objectif: {
      fr: 'Réduire une expression, développer avec la double distributivité (a + b)(c + d), et factoriser avec un facteur commun.',
      ar: 'اختزال تعبير، والنشر بخاصية التوزيع المزدوجة [[(a + b)(c + d)]]، والتعميل بعامل مشترك.'
    },

    prerequis: {
      fr: 'Remplacer une lettre par un nombre ; règles de priorité des opérations.',
      ar: 'تعويض حرف بعدد وأولويات العمليات الحسابية.'
    },

    ouverture: {
      vb: '0 0 360 230', label: 'Un jardin agrandi',
      hud: [['c', 'côtés'], ['a', 'aire'], ['q', 'développée ?']],
      draw: function (svg) { var e = {}; e.g = grille(svg, 80, 30); return e; },
      steps: [
        { cap: 'Un jardin **carré** de côté x mètres.', hud: { c: ['x et x'], a: ['x²'], q: '–' }, run: function (e) { e.g.set(130, 0, 130, 0, ['x', '', 'x', '', 'x²'], 1); } },
        { cap: 'On l\'agrandit : **+ 3 m** en longueur, **+ 2 m** en largeur.', hud: { c: ['x + 3 et x + 2'], a: '(x + 3)(x + 2)', q: '–' }, run: function (e) { e.g.set(130, 60, 130, 45, JARDIN, 0); } },
        { cap: 'Comment écrire cette aire **sans parenthèses** ? On le saura à la fin.', hud: { c: 'x + 3 et x + 2', a: '(x + 3)(x + 2)', q: ['?'] }, run: function (e) { e.g.set(130, 60, 130, 45, JARDIN, 0); } }
      ]
    },

    predire: {
      q: "Un jardin carré de côté x m est agrandi de 3 m en longueur et de 2 m en largeur. Quelle est la nouvelle aire ?",
      ar: "حديقة مربعة ضلعها [[x]] متر، زيدت [[3 m]] في الطول و[[2 m]] في العرض. ما مساحتها الجديدة؟",
      o: ["x² + 6", "x² + 5x + 6", "x² + 5"],
      a: 1,
      e: "L'aire est (x + 3)(x + 2). Chaque terme de la première parenthèse multiplie chaque terme de la seconde : x² + 2x + 3x + 6 = x² + 5x + 6. L'erreur courante, x² + 6, oublie les deux produits croisés.",
      ear: "المساحة [[(x + 3)(x + 2) = x² + 5x + 6]]. ننشر بضرب كل حدّ في كل حدّ."
    },

    prepare: [
      ['3x + 5x = 8x', true, 'On ajoute les coefficients des termes semblables.'],
      ['2x + 3 = 5x', false, '2x et 3 ne sont pas semblables : on ne peut pas réduire.'],
      ['x × x = x²', true, 'Le carré de x.']
    ],

    regarde: {
      vb: '0 0 360 230', label: 'La double distributivité',
      hud: [['e', 'expression'], ['m', 'morceau'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.g = grille(svg, 80, 30); return e; },
      steps: [
        { cap: '**Réduire** : on regroupe les termes semblables. 4x + 7 + 2x − 3 = **6x + 4**.', ar: 'الاختزال: نجمع الحدود المتشابهة. [[4x + 7 + 2x − 3 = 6x + 4]].', hud: { e: ['4x + 7 + 2x − 3'], m: '–', r: ['6x + 4'] }, run: function (e) { e.g.set(130, 60, 130, 45, JARDIN, 0); } },
        { cap: 'Le grand rectangle (x + 3)(x + 2) se coupe en **quatre** morceaux.', ar: 'المستطيل الكبير ينقسم إلى أربعة أجزاء.', hud: { e: ['(x + 3)(x + 2)'], m: '4 morceaux', r: '–' }, run: function (e) { e.g.set(130, 60, 130, 45, JARDIN, 2); } },
        { cap: 'x × x = **x²**, 3 × x = **3x**, x × 2 = **2x**, 3 × 2 = **6**.', ar: 'نضرب كل حد من القوس الأول في كل حد من القوس الثاني.', hud: { e: '(x + 3)(x + 2)', m: ['x², 3x, 2x, 6'], r: 'x² + 3x + 2x + 6' }, run: function (e) { e.g.set(130, 60, 130, 45, JARDIN, 4); } },
        { cap: 'On réduit : (x + 3)(x + 2) = **x² + 5x + 6**.', ar: 'نختزل: [[(x + 3)(x + 2) = x² + 5x + 6]].', hud: { e: '(x + 3)(x + 2)', m: '3x + 2x = 5x', r: ['x² + 5x + 6'] }, run: function (e) { e.g.set(130, 60, 130, 45, JARDIN, 4); } },
        { cap: 'Règle : **(a + b)(c + d) = ac + ad + bc + bd**.', ar: 'القاعدة: [[(a + b)(c + d) = ac + ad + bc + bd]].', hud: { e: ['(a + b)(c + d)'], m: '4 produits', r: ['ac + ad + bc + bd'] }, run: function (e) { e.g.set(110, 80, 110, 60, ['a', 'b', 'c', 'd', 'ac', 'bc', 'ad', 'bd'], 4); } },
        { cap: '**Factoriser** : 6x + 9 = 3 × 2x + 3 × 3 = **3(2x + 3)**.', ar: 'التعميل: نبحث عن عامل مشترك، [[6x + 9 = 3(2x + 3)]].', hud: { e: ['6x + 9'], m: 'facteur commun 3', r: ['3(2x + 3)'] }, run: function (e) { e.g.set(110, 80, 110, 60, ['a', 'b', 'c', 'd', 'ac', 'bc', 'ad', 'bd'], 4); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change x : l\'aire calculée des deux façons reste la même.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 230', role: 'img', 'aria-label': 'Jardin' }, st);
          var gr = grille(svg, 80, 30), set = MV.hud(c, [['p', '(x + 3)(x + 2)'], ['d', 'x² + 5x + 6', 1]]);
          MV.slider(c, { label: 'x', min: 1, max: 10, value: 4 }, function (x) {
            var u = 190 / (x + 5); gr.set(x * u, 3 * u, x * u, 2 * u, ['x', '3', 'x', '2', '', '', '', ''], 4);
            set('p', (x + 3) + ' × ' + (x + 2) + ' = ' + (x + 3) * (x + 2)); set('d', x * x + ' + ' + 5 * x + ' + 6 = ' + (x * x + 5 * x + 6)); if (x === 10) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Va jusqu\'à x = 10.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Développe et réduis A = (x + 5)(x − 1).',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Les quatre produits sont :', o: ['x², −x, 5x, −5', 'x², x, 5x, 5', 'x², −5'], a: 0 },
            { q: 'Étape 2. −x + 5x = ?x (donne le coefficient)', a: 4 },
            { type: 'opt', q: 'Étape 3. A = ?', o: ['x² + 4x − 5', 'x² + 6x + 5', 'x² − 5'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Réduis 7a + 2 − 3a + 5 = ?a + 7. Coefficient ?', a: 4 },
      { lvl: 'Niveau 2', q: 'Développe (x + 1)(x + 4) :', o: ['x² + 5x + 4', 'x² + 4', 'x² + 4x + 5'], a: 0 },
      { lvl: 'Niveau 3', q: 'Factorise 10y − 15 :', o: ['5(2y − 3)', '5(2y − 15)', '10(y − 5)'], a: 0 },
      { lvl: 'Niveau 4', q: 'Pour x = 3, combien vaut (x + 3)(x + 2) ?', a: 30 }
    ],

    bilan: {
      vb: '0 0 360 230', label: 'L\'aire du jardin',
      hud: [['f', 'forme produit'], ['d', 'forme développée'], ['x', 'pour x = 10']],
      draw: function (svg) { var e = {}; e.g = grille(svg, 80, 30); return e; },
      steps: [
        { cap: 'Aire = (x + 3)(x + 2) = **x² + 5x + 6**.', hud: { f: ['(x + 3)(x + 2)'], d: ['x² + 5x + 6'], x: '–' }, run: function (e) { e.g.set(130, 60, 130, 45, JARDIN, 4); } },
        { cap: 'Pour x = 10 m : 13 × 12 = 100 + 50 + 6 = **156 m²**.', ar: 'مساحة الحديقة [[x² + 5x + 6]]، أي 156 مترا مربعا عندما [[x = 10]].', hud: { f: '(x + 3)(x + 2)', d: 'x² + 5x + 6', x: ['156 m²'] }, run: function (e) { e.g.set(130, 60, 130, 45, JARDIN, 4); } }
      ]
    },

    retenir: [
      '<b>Réduire</b> : regrouper les termes semblables. <b>Développer</b> : <b class="mono">(a + b)(c + d) = ac + ad + bc + bd</b>.',
      '<b>Factoriser</b> : écrire une somme comme un produit, avec un <b>facteur commun</b> : <b class="mono">ka + kb = k(a + b)</b>.'
    ],
    retenirAr: 'الاختزال تجميع الحدود المتشابهة. النشر: [[(a + b)(c + d) = ac + ad + bc + bd]]. التعميل كتابة مجموع على شكل جداء باستعمال عامل مشترك.',
    voc: [['réduire', 'يختزل'], ['des termes semblables', 'حدود متشابهة'], ['la double distributivité', 'خاصية التوزيع المزدوجة'], ['factoriser', 'يعمل']]
  });
})();
