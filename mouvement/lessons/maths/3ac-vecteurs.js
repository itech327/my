/* @meta {"id":"3ac-vecteurs","level":"3","order":10,"theme":"Géométrie","title":"Vecteurs et translation","ar":"المتجهات والإزاحة","lead":"Un téléphérique glisse le long de son câble : chaque point de la cabine fait exactement le même déplacement. Ce déplacement, c'est un vecteur."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, U = 24, X0 = 36, Y0 = 186; // une unité = 24 px

  function px(p) { return [X0 + p[0] * U, Y0 - p[1] * U]; }
  function fleche(g, a, b, col, w) {
    var P = px(a), Q = px(b), dx = Q[0] - P[0], dy = Q[1] - P[1], n = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / n, uy = dy / n;
    S('line', { x1: P[0], y1: P[1], x2: Q[0] - ux * 8, y2: Q[1] - uy * 8, stroke: col, 'stroke-width': w || 3 }, g);
    S('path', { d: 'M' + Q[0] + ' ' + Q[1] + ' L' + (Q[0] - ux * 12 - uy * 6) + ' ' + (Q[1] - uy * 12 + ux * 6) + ' L' + (Q[0] - ux * 12 + uy * 6) + ' ' + (Q[1] - uy * 12 - ux * 6) + ' Z', fill: col }, g);
  }

  /* quadrillage, une figure F, sa translatée F', et le vecteur u */
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    for (var i = 0; i <= 12; i++) S('line', { x1: X0 + i * U, y1: Y0, x2: X0 + i * U, y2: Y0 - 7 * U, stroke: 'rgba(255,255,255,.07)' }, g);
    for (var j = 0; j <= 7; j++) S('line', { x1: X0, y1: Y0 - j * U, x2: X0 + 12 * U, y2: Y0 - j * U, stroke: 'rgba(255,255,255,.07)' }, g);
    var F = [[1, 1], [3, 1], [1, 3]];
    g.set = function (v, o) { // v = [vx, vy] ; o.img, o.all (vecteurs sur chaque sommet), o.chasles
      o = o || {};
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var poly = function (pts, f, s) { S('path', { d: 'M' + pts.map(function (p) { return px(p).join(' '); }).join(' L') + ' Z', fill: f, stroke: s, 'stroke-width': 2.5 }, dyn); };
      poly(F, 'rgba(255,122,47,.25)', 'var(--acc)');
      var G = F.map(function (p) { return [p[0] + v[0], p[1] + v[1]]; });
      if (o.img) poly(G, 'rgba(127,178,255,.2)', '#7fb2ff');
      (o.all ? F : [F[0]]).forEach(function (p, k) { fleche(dyn, p, G[k], '#e9e9ea', 2); });
      T(dyn, px(F[0])[0] - 10, px(F[0])[1] + 16, 'A', 'tag'); if (o.img) T(dyn, px(G[0])[0] + 4, px(G[0])[1] + 16, 'A\'', 'tag', 'start');
      if (o.chasles) { var B = [F[0][0] + 4, F[0][1]], C = [B[0], B[1] + 3]; fleche(dyn, F[0], B, '#f2c14e'); fleche(dyn, B, C, '#56d07f'); fleche(dyn, F[0], C, 'var(--acc)'); T(dyn, px(B)[0] + 6, px(B)[1] + 14, 'B', 'tag', 'start'); T(dyn, px(C)[0] + 6, px(C)[1], 'C', 'tag', 'start'); }
    };
    return g;
  }

  MV.lesson({
    id: '3ac-vecteurs',
    objectif: {
      fr: 'Caractériser un vecteur (direction, sens, longueur), construire l\'image d\'une figure par une translation et utiliser la relation de Chasles.',
      ar: 'تحديد متجهة (الاتجاه، المنحى، المنظم)، وإنشاء صورة شكل بإزاحة، واستعمال علاقة شال.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Une cabine de téléphérique',
      hud: [['c', 'cabine'], ['d', 'déplacement'], ['q', 'comment le décrire ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Une **cabine** de téléphérique en bas de la ligne.', hud: { c: ['départ'], d: '–', q: '–' }, run: function (e) { e.s.set([0, 0]); } },
        { cap: 'Elle monte le long du câble : **chaque point** fait le même déplacement.', hud: { c: ['arrivée'], d: ['identique pour tous'], q: '–' }, run: function (e) { e.s.set([6, 3], { img: 1, all: 1 }); } },
        { cap: 'Comment décrire ce déplacement avec précision ? On le saura à la fin.', hud: { c: 'arrivée', d: 'identique pour tous', q: ['?'] }, run: function (e) { e.s.set([6, 3], { img: 1, all: 1 }); } }
      ]
    },

    prepare: [
      ['Les côtés opposés d\'un parallélogramme sont parallèles et de même longueur.', true, 'C\'est une propriété clé ici.'],
      ['Aller de A à B, c\'est la même chose qu\'aller de B à A.', false, 'Le sens est opposé.'],
      ['Une translation fait tourner les figures.', false, 'Elle les fait glisser, sans tourner.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'Le vecteur et la translation',
      hud: [['n', 'notion'], ['c', 'caractéristique'], ['e', 'exemple']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le **vecteur** AA\' a une **direction** (la droite), un **sens** (de A vers A\') et une **longueur**.', ar: 'للمتجهة اتجاه ومنحى ومنظم.', hud: { n: ['vecteur'], c: ['direction, sens, longueur'], e: 'AA\'' }, run: function (e) { e.s.set([6, 3], {}); } },
        { cap: 'La **translation** de vecteur AA\' fait glisser **tous les points** du même vecteur.', ar: 'الإزاحة ذات المتجهة [[AA\']] تنقل جميع النقط بنفس المتجهة.', hud: { n: ['translation'], c: 'même vecteur partout', e: ['F → F\''] }, run: function (e) { e.s.set([6, 3], { img: 1, all: 1 }); } },
        { cap: 'Elle **conserve** longueurs, angles et aires : F\' est superposable à F.', ar: 'الإزاحة تحافظ على المسافات والزوايا والمساحات.', hud: { n: 'translation', c: ['conserve'], e: 'F\' superposable à F' }, run: function (e) { e.s.set([6, 3], { img: 1 }); } },
        { cap: 'Égalité : **AB = DC** (vecteurs) si et seulement si **ABCD est un parallélogramme**.', ar: 'تتساوى المتجهتان [[AB]] و [[DC]] إذا وفقط إذا كان ABCD متوازي أضلاع.', hud: { n: 'égalité', c: ['ABCD parallélogramme'], e: 'AB = DC' }, run: function (e) { e.s.set([6, 3], { img: 1, all: 1 }); } },
        { cap: '**Relation de Chasles** : AB + BC = **AC**. Deux déplacements à la suite valent un seul.', ar: 'علاقة شال: [[AB + BC = AC]].', hud: { n: ['Chasles'], c: 'enchaîner', e: ['AB + BC = AC'] }, run: function (e) { e.s.set([0, 0], { chasles: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Règle le vecteur u. Amène A sur le point (7 ; 4).',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Translation sur quadrillage' }, st);
          var s = scene(svg), v = [2, 1], set = MV.hud(c, [['u', 'vecteur u'], ['a', 'A\''], ['o', 'objectif', 1]]);
          function upd() { s.set(v, { img: 1, all: 1 }); set('u', '(' + v[0] + ' ; ' + v[1] + ')'); set('a', '(' + (1 + v[0]) + ' ; ' + (1 + v[1]) + ')'); var ok = v[0] === 6 && v[1] === 3; set('o', ok ? 'atteint' : '(7 ; 4)'); if (ok) done(); }
          MV.slider(c, { label: 'déplacement horizontal', min: 0, max: 8, value: 2 }, function (x) { v[0] = x; upd(); });
          MV.slider(c, { label: 'déplacement vertical', min: 0, max: 3, value: 1 }, function (y) { v[1] = y; upd(); });
          upd();
          MV.H('p', 'small', 'A est en (1 ; 1).', c);
        } },
      { title: 'Résolvons ensemble', intro: 'ABCD est un parallélogramme.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Le vecteur AB est égal au vecteur :', o: ['DC', 'CD', 'BC'], a: 0 },
            { type: 'opt', q: 'Étape 2. Par Chasles, AB + BC =', o: ['AC', 'CA', 'BD'], a: 0 },
            { type: 'opt', q: 'Étape 3. L\'image de D par la translation de vecteur AB est :', o: ['C', 'B', 'A'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un vecteur est défini par :', o: ['direction, sens, longueur', 'une seule longueur'], a: 0 },
      { lvl: 'Niveau 2', q: 'Par Chasles, MN + NP =', o: ['MP', 'PM', 'NM'], a: 0 },
      { lvl: 'Niveau 3', q: 'Une translation transforme un segment de 6 cm en un segment de ? cm', a: 6 },
      { lvl: 'Niveau 4', q: 'A(2 ; 1) et u(3 ; 4). L\'image A\' a pour abscisse ?', a: 5 }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'Le déplacement de la cabine',
      hud: [['v', 'vecteur'], ['t', 'transformation'], ['p', 'propriété']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le déplacement est un **vecteur** : direction du câble, sens de la montée, longueur parcourue.', hud: { v: ['direction, sens, longueur'], t: '–', p: '–' }, run: function (e) { e.s.set([6, 3], {}); } },
        { cap: 'La cabine subit une **translation** : tous ses points glissent du même vecteur.', ar: 'تخضع المقصورة لإزاحة: جميع نقطها تنتقل بنفس المتجهة.', hud: { v: 'u', t: ['translation'], p: ['même vecteur partout'] }, run: function (e) { e.s.set([6, 3], { img: 1, all: 1 }); } }
      ]
    },

    retenir: [
      'Un <b>vecteur</b> AB est défini par sa direction, son sens et sa longueur. <b class="mono">AB = DC</b> équivaut à : ABCD est un <b>parallélogramme</b>.',
      'La <b>translation</b> de vecteur u déplace chaque point du même vecteur et conserve longueurs, angles et aires. <b>Chasles</b> : <b class="mono">AB + BC = AC</b>.'
    ],
    retenirAr: 'المتجهة [[AB]] لها اتجاه ومنحى ومنظم. تساوي [[AB]] و [[DC]] يعني أن ABCD متوازي أضلاع. الإزاحة تنقل كل النقط بنفس المتجهة وتحافظ على المسافات والزوايا. علاقة شال: [[AB + BC = AC]].',
    voc: [['un vecteur', 'متجهة'], ['la direction', 'الاتجاه'], ['le sens', 'المنحى'], ['une translation', 'إزاحة'], ['la relation de Chasles', 'علاقة شال']]
  });
})();
