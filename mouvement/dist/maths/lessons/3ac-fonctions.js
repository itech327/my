/* @meta {"id":"3ac-fonctions","level":"3","order":14,"theme":"Organisation de données","title":"Fonctions linéaires et fonctions affines","ar":"الدوال الخطية والدوال التآلفية","lead":"Forfait A : 3 DH la minute. Forfait B : 20 DH d'abonnement puis 1 DH la minute. Lequel choisir ? Deux fonctions, deux droites, un point de croisement."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 40, Y0 = 185, UX = 14, UY = 2.4; // x : 0 à 20 min ; y : 0 à 60 DH

  function px(x, y) { return [X0 + x * UX, Y0 - y * UY]; }
  function graphe(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('path', { d: 'M' + X0 + ' 25 V' + Y0 + ' H' + (X0 + 20 * UX + 8), stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, g);
    [0, 5, 10, 15, 20].forEach(function (x) { T(g, px(x, 0)[0], Y0 + 16, x, 'tag'); });
    [20, 40, 60].forEach(function (y) { T(g, X0 - 6, px(0, y)[1] + 4, y, 'tag', 'end'); });
    T(g, X0 + 20 * UX + 6, Y0 - 6, 'min', 'tag', 'end'); T(g, X0 + 6, 22, 'DH', 'tag', 'start');
    var dyn = S('g', {}, g);
    g.set = function (fs, x) { // fs : [[a, b, couleur, nom]] ; x : point courant
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      fs.forEach(function (f) {
        var xe = Math.min(20, (60 - f[1]) / f[0]), p = px(0, f[1]), q = px(xe, f[0] * xe + f[1]);
        S('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: f[2], 'stroke-width': 3 }, dyn);
        T(dyn, q[0] + 4, q[1] + 2, f[3], 'lbl', 'start');
        if (x != null && f[0] * x + f[1] <= 60) { var c = px(x, f[0] * x + f[1]); S('circle', { cx: c[0], cy: c[1], r: 6, fill: f[2], stroke: '#141517' }, dyn); }
      });
      if (x != null) { var b = px(x, 0); S('line', { x1: b[0], y1: Y0, x2: b[0], y2: 25, stroke: '#e9e9ea', 'stroke-dasharray': '3 4' }, dyn); }
    };
    return g;
  }
  var A = [3, 0, 'var(--acc)', 'A'], B = [1, 20, '#7fb2ff', 'B'];

  MV.lesson({
    id: '3ac-fonctions',
    objectif: {
      fr: 'Reconnaître une fonction linéaire f(x) = ax et une fonction affine g(x) = ax + b, calculer images et antécédents, et lire leurs représentations graphiques.',
      ar: 'التعرف على الدالة الخطية [[f(x) = ax]] والدالة التآلفية [[g(x) = ax + b]]، وحساب الصور والسوابق، وقراءة تمثيلاتها المبيانية.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Deux forfaits',
      hud: [['a', 'forfait A'], ['b', 'forfait B'], ['q', 'lequel ?']],
      draw: function (svg) { var e = {}; e.g = graphe(svg); return e; },
      steps: [
        { cap: 'Forfait **A** : **3 DH** par minute, sans abonnement.', hud: { a: ['3x'], b: '–', q: '–' }, run: function (e) { e.g.set([A]); } },
        { cap: 'Forfait **B** : **20 DH** d\'abonnement, puis **1 DH** par minute.', hud: { a: '3x', b: ['x + 20'], q: '–' }, run: function (e) { e.g.set([A, B]); } },
        { cap: 'Lequel est le moins cher ? Ça dépend… de quoi ? On le saura à la fin.', hud: { a: '3x', b: 'x + 20', q: ['?'] }, run: function (e) { e.g.set([A, B]); } }
      ]
    },

    prepare: [
      ['Si f(x) = 3x, alors f(4) = 12.', true, '3 × 4 = 12.'],
      ['Une situation proportionnelle donne une droite passant par l\'origine.', true, 'C\'est le cas d\'une fonction linéaire.'],
      ['La droite de g(x) = x + 20 passe par l\'origine.', false, 'Elle coupe l\'axe vertical en 20.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Linéaire ou affine',
      hud: [['f', 'fonction'], ['c', 'calcul'], ['g', 'graphique']],
      draw: function (svg) { var e = {}; e.g = graphe(svg); return e; },
      steps: [
        { cap: 'Forfait A : **f(x) = 3x**. C\'est une **fonction linéaire** de coefficient 3.', ar: 'الدالة [[f(x) = 3x]] دالة خطية معاملها 3.', hud: { f: ['linéaire f(x) = 3x'], c: '–', g: ['droite par O'] }, run: function (e) { e.g.set([A]); } },
        { cap: '**Image** de 10 : f(10) = 30. **Antécédent** de 45 : 3x = 45, donc x = 15.', ar: 'صورة 10 هي 30، وسابق 45 هو 15.', hud: { f: 'f(x) = 3x', c: ['f(10) = 30 ; f(15) = 45'], g: 'lecture' }, run: function (e) { e.g.set([A], 10); } },
        { cap: 'Forfait B : **g(x) = x + 20**. C\'est une **fonction affine** : g(x) = ax + b avec a = 1, b = 20.', ar: 'الدالة [[g(x) = x + 20]] دالة تآلفية.', hud: { f: ['affine g(x) = x + 20'], c: 'a = 1, b = 20', g: ['coupe l\'axe en 20'] }, run: function (e) { e.g.set([B]); } },
        { cap: 'a est le **coefficient directeur** (pente), b l\'**ordonnée à l\'origine**. Une fonction linéaire est une affine avec b = 0.', ar: 'a هو المعامل الموجه و b هو الأرتوب عند الأصل.', hud: { f: 'ax + b', c: ['a : pente ; b : départ'], g: '–' }, run: function (e) { e.g.set([A, B]); } },
        { cap: 'Les droites se croisent quand **3x = x + 20**, soit **x = 10** : les deux forfaits coûtent 30 DH.', ar: 'يتقاطع المستقيمان عندما [[3x = x + 20]] أي [[x = 10]].', hud: { f: 'f(x) = g(x)', c: ['x = 10'], g: ['croisement : 30 DH'] }, run: function (e) { e.g.set([A, B], 10); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change la durée d\'appel. À partir de quand le forfait B devient-il moins cher ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Deux droites' }, st);
          var g = graphe(svg), set = MV.hud(c, [['a', 'A = 3x'], ['b', 'B = x + 20'], ['m', 'moins cher', 1]]);
          MV.slider(c, { label: 'minutes', min: 0, max: 20, value: 4 }, function (x) { g.set([A, B], x); var a = 3 * x, b = x + 20; set('a', a + ' DH'); set('b', b + ' DH'); set('m', a < b ? 'A' : a > b ? 'B' : 'égalité'); if (x === 11) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Trouve la première minute où B est strictement moins cher.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'g est la fonction affine telle que g(x) = 2x − 5.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. g(4) = ?', a: 3 },
            { q: 'Étape 2. Antécédent de 9 : 2x − 5 = 9, x = ?', a: 7 },
            { type: 'opt', q: 'Étape 3. g est :', o: ['affine, non linéaire', 'linéaire'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'f(x) = 5x. f(3) = ?', a: 15 },
      { lvl: 'Niveau 2', q: 'f(x) = 4x. Antécédent de 28 ?', a: 7 },
      { lvl: 'Niveau 3', q: 'h(x) = −2x + 6. h(1) = ?', a: 4 },
      { lvl: 'Niveau 4', q: 'Fonction linéaire f avec f(2) = 14. Coefficient ?', a: 7 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Quel forfait ?',
      hud: [['m', 'moins de 10 min'], ['e', '10 min'], ['p', 'plus de 10 min']],
      draw: function (svg) { var e = {}; e.g = graphe(svg); return e; },
      steps: [
        { cap: 'Avant 10 min, la droite de A est **en dessous** : A est moins cher.', hud: { m: ['A'], e: '–', p: '–' }, run: function (e) { e.g.set([A, B], 5); } },
        { cap: 'À 10 min, égalité (30 DH). Au-delà, **B** est moins cher. Tout dépend du temps d\'appel.', ar: 'قبل 10 دقائق التسعيرة A أرخص، وعند 10 دقائق يتساويان، وبعدها التسعيرة B أرخص.', hud: { m: 'A', e: ['égalité 30 DH'], p: ['B'] }, run: function (e) { e.g.set([A, B], 15); } }
      ]
    },

    retenir: [
      'Une <b>fonction linéaire</b> s\'écrit <b class="mono">f(x) = ax</b> ; sa représentation est une droite passant par l\'origine. Une <b>fonction affine</b> s\'écrit <b class="mono">g(x) = ax + b</b> ; sa droite coupe l\'axe des ordonnées en b.',
      'L\'<b>image</b> de x est f(x) ; un <b>antécédent</b> de y est un x tel que f(x) = y. Pour comparer deux fonctions, on cherche où leurs droites se croisent.'
    ],
    retenirAr: 'الدالة الخطية [[f(x) = ax]] يمثلها مستقيم يمر من الأصل، والدالة التآلفية [[g(x) = ax + b]] يقطع مستقيمها محور الأراتيب في b. صورة x هي f(x)، وسابق y هو x يحقق [[f(x) = y]].',
    voc: [['une fonction linéaire', 'دالة خطية'], ['une fonction affine', 'دالة تآلفية'], ['l\'image', 'الصورة'], ['un antécédent', 'سابق'], ['le coefficient', 'المعامل']]
  });
})();
