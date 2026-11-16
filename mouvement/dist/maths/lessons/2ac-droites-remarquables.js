/* @meta {"id":"2ac-droites-remarquables","level":"2","order":7,"theme":"Géométrie","title":"Droites remarquables dans un triangle","ar":"المستقيمات الهامة في مثلث","lead":"Trois villages veulent creuser un puits commun, à la même distance de chacun. Où le placer ? Trois droites du triangle se croisent exactement au bon endroit."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var A = [90, 40], B = [40, 180], C = [320, 170];

  function sub(p, q) { return [p[0] - q[0], p[1] - q[1]]; }
  function mid(p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }
  function inter(p, u, q, v) { var d = u[0] * v[1] - u[1] * v[0], w = sub(q, p), t = (w[0] * v[1] - w[1] * v[0]) / d; return [p[0] + t * u[0], p[1] + t * u[1]]; }
  function len(u) { return Math.sqrt(u[0] * u[0] + u[1] * u[1]); }
  function perp(u) { return [-u[1], u[0]]; }
  function ligne(g, p, u, col) { var n = len(u), k = 400 / n; S('line', { x1: p[0] - u[0] * k, y1: p[1] - u[1] * k, x2: p[0] + u[0] * k, y2: p[1] + u[1] * k, stroke: col, 'stroke-width': 1.8 }, g); }

  var F = { // famille -> [nom du point, calcul, couleur]
    'médiatrices': ['centre du cercle circonscrit', function (g, col) {
      var P = [[A, B], [B, C], [C, A]].map(function (s) { var m = mid(s[0], s[1]), u = perp(sub(s[1], s[0])); ligne(g, m, u, col); return [m, u]; });
      var O = inter(P[0][0], P[0][1], P[1][0], P[1][1]); S('circle', { cx: O[0], cy: O[1], r: len(sub(A, O)), fill: 'none', stroke: col, 'stroke-dasharray': '5 4' }, g); return O; }],
    'hauteurs': ['orthocentre', function (g, col) {
      var P = [[A, B, C], [B, C, A], [C, A, B]].map(function (s) { var u = perp(sub(s[2], s[1])); ligne(g, s[0], u, col); return [s[0], u]; });
      return inter(P[0][0], P[0][1], P[1][0], P[1][1]); }],
    'médianes': ['centre de gravité', function (g, col) {
      [[A, B, C], [B, C, A], [C, A, B]].forEach(function (s) { var m = mid(s[1], s[2]); S('line', { x1: s[0][0], y1: s[0][1], x2: m[0], y2: m[1], stroke: col, 'stroke-width': 1.8 }, g); });
      return [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3]; }],
    'bissectrices': ['centre du cercle inscrit', function (g, col) {
      var a = len(sub(B, C)), b = len(sub(C, A)), c = len(sub(A, B)), s = a + b + c, I = [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s];
      [A, B, C].forEach(function (p) { S('line', { x1: p[0], y1: p[1], x2: I[0] + (I[0] - p[0]) * 0.3, y2: I[1] + (I[1] - p[1]) * 0.3, stroke: col, 'stroke-width': 1.8 }, g); });
      var u = sub(C, B), r = Math.abs(u[0] * (I[1] - B[1]) - u[1] * (I[0] - B[0])) / len(u); S('circle', { cx: I[0], cy: I[1], r: r, fill: 'none', stroke: col, 'stroke-dasharray': '5 4' }, g); return I; }]
  };
  var COL = { 'médiatrices': 'var(--acc)', 'hauteurs': '#7fb2ff', 'médianes': '#56d07f', 'bissectrices': '#f2c14e' };

  function figure(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (fam) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (fam) { var P = F[fam][1](dyn, COL[fam]); S('circle', { cx: P[0], cy: P[1], r: 5, fill: '#fff', stroke: '#141517' }, dyn); }
      S('path', { d: 'M' + A + ' L' + B + ' L' + C + ' Z', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 3 }, dyn);
      T(dyn, A[0] - 4, A[1] - 8, 'A', 'lbl'); T(dyn, B[0] - 10, B[1] + 14, 'B', 'lbl'); T(dyn, C[0] + 10, C[1] + 6, 'C', 'lbl');
      return fam ? F[fam][0] : '';
    };
    return g;
  }

  MV.lesson({
    id: '2ac-droites-remarquables',
    objectif: {
      fr: 'Connaître les médiatrices, hauteurs, médianes et bissectrices d\'un triangle et leurs points de concours.',
      ar: 'معرفة واسطات المثلث وارتفاعاته ومتوسطاته ومنصفات زواياه ونقط تلاقيها.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'Trois villages et un puits',
      hud: [['v', 'villages'], ['c', 'condition'], ['q', 'où ?']],
      draw: function (svg) { var e = {}; e.f = figure(svg); return e; },
      steps: [
        { cap: 'Trois villages : **A**, **B** et **C**.', hud: { v: ['A, B, C'], c: '–', q: '–' }, run: function (e) { e.f.set(null); } },
        { cap: 'Ils veulent un puits **à la même distance** de chacun.', hud: { v: 'A, B, C', c: ['PA = PB = PC'], q: '–' }, run: function (e) { e.f.set(null); } },
        { cap: 'Où creuser ? On le saura à la fin.', hud: { v: 'A, B, C', c: 'PA = PB = PC', q: ['?'] }, run: function (e) { e.f.set(null); } }
      ]
    },

    prepare: [
      ['La médiatrice d\'un segment est perpendiculaire à ce segment en son milieu.', true, 'Ses points sont à égale distance des extrémités.'],
      ['Une hauteur passe toujours par le milieu d\'un côté.', false, 'C\'est la médiane qui passe par le milieu.'],
      ['La bissectrice partage un angle en deux angles égaux.', true, 'Par définition.']
    ],

    regarde: {
      vb: '0 0 360 220', label: 'Quatre familles de droites',
      hud: [['f', 'droites'], ['d', 'définition'], ['p', 'point de concours']],
      draw: function (svg) { var e = {}; e.f = figure(svg); return e; },
      steps: [
        { cap: 'Les trois **médiatrices** se coupent en un point, **centre du cercle circonscrit** au triangle.', ar: 'واسطات المثلث تتلاقى في مركز الدائرة المحيطة به.', hud: { f: ['médiatrices'], d: '⊥ au côté en son milieu', p: ['centre du cercle circonscrit'] }, run: function (e) { e.f.set('médiatrices'); } },
        { cap: 'Les trois **hauteurs** (d\'un sommet, perpendiculaires au côté opposé) se coupent en l\'**orthocentre**.', ar: 'ارتفاعات المثلث تتلاقى في مركز تعامده.', hud: { f: ['hauteurs'], d: 'sommet, ⊥ côté opposé', p: ['orthocentre'] }, run: function (e) { e.f.set('hauteurs'); } },
        { cap: 'Les trois **médianes** (d\'un sommet au milieu du côté opposé) se coupent au **centre de gravité**, aux 2/3 de chaque médiane.', ar: 'متوسطات المثلث تتلاقى في مركز ثقله، الذي يوجد في ثلثي كل متوسط انطلاقا من الرأس.', hud: { f: ['médianes'], d: 'sommet → milieu opposé', p: ['centre de gravité'] }, run: function (e) { e.f.set('médianes'); } },
        { cap: 'Les trois **bissectrices** se coupent au **centre du cercle inscrit**.', ar: 'منصفات زوايا المثلث تتلاقى في مركز الدائرة المحاطة به.', hud: { f: ['bissectrices'], d: 'partage l\'angle en deux', p: ['centre du cercle inscrit'] }, run: function (e) { e.f.set('bissectrices'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Affiche chaque famille de droites et repère son point de concours.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 220', role: 'img', 'aria-label': 'Triangle et droites remarquables' }, st);
          var f = figure(svg), vu = {}, set = MV.hud(c, [['f', 'droites'], ['p', 'point de concours', 1]]), row = MV.H('div', 'row', '', c);
          Object.keys(F).forEach(function (k) { var b = MV.H('button', 'btn', k, row); b.onclick = function () { set('f', k); set('p', f.set(k)); vu[k] = 1; if (Object.keys(vu).length === 4) done(); }; });
          f.set(null); set('f', '–'); set('p', '–');
          MV.H('p', 'small', 'Essaie les quatre familles.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'G est le centre de gravité de ABC, et la médiane [AM] mesure 9 cm.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. G est le point de concours des :', o: ['médianes', 'hauteurs'], a: 0 },
            { q: 'Étape 2. AG = 2/3 × 9 = ? cm', a: 6 },
            { q: 'Étape 3. GM = ? cm', a: 3 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Les médiatrices se coupent au centre du cercle :', o: ['circonscrit', 'inscrit'], a: 0 },
      { lvl: 'Niveau 2', q: 'Les hauteurs se coupent en :', o: ['l\'orthocentre', 'le centre de gravité'], a: 0 },
      { lvl: 'Niveau 3', q: 'Une médiane passe par un sommet et :', o: ['le milieu du côté opposé', 'perpendiculairement au côté opposé'], a: 0 },
      { lvl: 'Niveau 4', q: 'Médiane de 12 cm. Distance du sommet au centre de gravité (cm) ?', a: 8 }
    ],

    bilan: {
      vb: '0 0 360 220', label: 'Le puits',
      hud: [['c', 'condition'], ['d', 'droites'], ['p', 'emplacement']],
      draw: function (svg) { var e = {}; e.f = figure(svg); return e; },
      steps: [
        { cap: 'À égale distance de A et B : sur la **médiatrice** de [AB]. Pareil pour [BC] et [CA].', hud: { c: ['PA = PB = PC'], d: ['médiatrices'], p: '–' }, run: function (e) { e.f.set('médiatrices'); } },
        { cap: 'Le puits se creuse au **centre du cercle circonscrit** : les trois villages sont sur ce cercle.', ar: 'يحفر البئر في مركز الدائرة المحيطة بالمثلث، أي نقطة تلاقي الواسطات.', hud: { c: 'PA = PB = PC', d: 'médiatrices', p: ['centre du cercle circonscrit'] }, run: function (e) { e.f.set('médiatrices'); } }
      ]
    },

    retenir: [
      '<b>Médiatrices</b> → centre du cercle circonscrit. <b>Hauteurs</b> → orthocentre. <b>Médianes</b> → centre de gravité, situé aux <b>2/3</b> de chaque médiane depuis le sommet.',
      '<b>Bissectrices</b> → centre du cercle inscrit. Dans chaque famille, les trois droites sont <b>concourantes</b>.'
    ],
    retenirAr: 'الواسطات تتلاقى في مركز الدائرة المحيطة، والارتفاعات في مركز التعامد، والمتوسطات في مركز الثقل الموجود في ثلثي كل متوسط انطلاقا من الرأس، ومنصفات الزوايا في مركز الدائرة المحاطة.',
    voc: [['la médiatrice', 'الواسط'], ['la hauteur', 'الارتفاع'], ['la médiane', 'المتوسط'], ['la bissectrice', 'منصف الزاوية'], ['concourantes', 'متلاقية']]
  });
})();
