/* @meta {"id":"2ac-translation","level":"2","order":14,"theme":"Géométrie","title":"Vecteurs et translations","ar":"المتجهات والإزاحات","lead":"Dans un jeu vidéo, un personnage glisse de 4 cases vers la droite et 2 vers le haut. Chaque point de son dessin bouge de la même façon : c'est une translation."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, U = 24, X0 = 36, Y0 = 186;

  function px(p) { return [X0 + p[0] * U, Y0 - p[1] * U]; }
  function grille(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    for (var i = 0; i <= 12; i++) S('line', { x1: X0 + i * U, y1: Y0, x2: X0 + i * U, y2: Y0 - 7 * U, stroke: 'rgba(255,255,255,.08)' }, g);
    for (var j = 0; j <= 7; j++) S('line', { x1: X0, y1: Y0 - j * U, x2: X0 + 12 * U, y2: Y0 - j * U, stroke: 'rgba(255,255,255,.08)' }, g);
    var dyn = S('g', {}, g);
    var F = [[1, 1], [3, 1], [3, 2], [2, 3], [1, 2]];
    function fl(a, b, col, w) { var P = px(a), Q = px(b), dx = Q[0] - P[0], dy = Q[1] - P[1], n = Math.hypot(dx, dy) || 1, ux = dx / n, uy = dy / n; S('line', { x1: P[0], y1: P[1], x2: Q[0] - ux * 7, y2: Q[1] - uy * 7, stroke: col, 'stroke-width': w || 2.5 }, dyn); S('path', { d: 'M' + Q[0] + ' ' + Q[1] + ' l' + (-ux * 11 - uy * 6) + ' ' + (-uy * 11 + ux * 6) + ' l' + (uy * 12) + ' ' + (-ux * 12) + ' Z', fill: col }, dyn); }
    g.set = function (v, o) { // o.img, o.toutes, o.cible
      o = o || {};
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var poly = function (pts, f, s, d) { S('path', { d: 'M' + pts.map(function (p) { return px(p).join(' '); }).join(' L') + ' Z', fill: f, stroke: s, 'stroke-width': 2.5, 'stroke-dasharray': d || '' }, dyn); };
      if (o.cible) poly(F.map(function (p) { return [p[0] + o.cible[0], p[1] + o.cible[1]]; }), 'none', '#56d07f', '5 4');
      poly(F, 'rgba(255,122,47,.3)', 'var(--acc)');
      var G = F.map(function (p) { return [p[0] + v[0], p[1] + v[1]]; });
      if (o.img) poly(G, 'rgba(127,178,255,.3)', '#7fb2ff');
      (o.toutes ? F : [F[0]]).forEach(function (p, k) { if (v[0] || v[1]) fl(p, G[k], '#e9e9ea', 2); });
      T(dyn, px(F[0])[0] - 8, px(F[0])[1] + 14, 'A', 'tag', 'end'); if (o.img) T(dyn, px(G[0])[0] + 4, px(G[0])[1] + 14, 'A\'', 'tag', 'start');
    };
    return g;
  }

  MV.lesson({
    id: '2ac-translation',
    objectif: {
      fr: 'Construire l\'image d\'une figure par une translation, reconnaître des vecteurs égaux et utiliser le lien avec le parallélogramme.',
      ar: 'إنشاء صورة شكل بإزاحة، والتعرف على المتجهات المتساوية، واستعمال علاقتها بمتوازي الأضلاع.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Le personnage du jeu',
      hud: [['d', 'droite'], ['h', 'haut'], ['q', 'comment le décrire ?']],
      draw: function (svg) { var e = {}; e.g = grille(svg); return e; },
      steps: [
        { cap: 'Un **personnage** de jeu vidéo sur une grille.', hud: { d: '–', h: '–', q: '–' }, run: function (e) { e.g.set([0, 0]); } },
        { cap: 'Il glisse de **4 cases vers la droite** et **2 vers le haut**, sans tourner.', hud: { d: ['4'], h: ['2'], q: '–' }, run: function (e) { e.g.set([4, 2], { img: 1, toutes: 1 }); } },
        { cap: 'Comment décrire ce mouvement en une seule flèche ? On le saura à la fin.', hud: { d: '4', h: '2', q: ['?'] }, run: function (e) { e.g.set([4, 2], { img: 1 }); } }
      ]
    },

    predire: {
      q: "Un personnage glisse de 4 cases vers la droite et 2 vers le haut. S'il refait exactement le même déplacement, où arrive-t-il ?",
      ar: "شخصية تنزلق [[4]] خانات يميناً و[[2]] إلى الأعلى. إن كرّرت الحركة نفسها، أين تصل؟",
      o: ["À sa case de départ", "8 cases à droite et 4 vers le haut de sa position de départ", "6 cases à droite, sur la même ligne"],
      a: 1,
      e: "Une translation est un déplacement décrit par une seule flèche : le vecteur, avec sa direction, son sens et sa longueur. Le répéter double le déplacement : 8 cases à droite et 4 vers le haut.",
      ear: "الإزاحة سهم واحد (متجهة) له اتجاه ومنحى وطول. تكرارها يضاعف الانتقال: [[8]] يميناً و[[4]] إلى الأعلى."
    },

    prepare: [
      ['Dans une translation, la figure tourne.', false, 'Elle glisse sans tourner.'],
      ['Les côtés opposés d\'un parallélogramme sont parallèles et de même longueur.', true, 'On en aura besoin.'],
      ['Une translation conserve les longueurs.', true, 'La figure image est superposable.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'La translation de vecteur AA\'',
      hud: [['n', 'notion'], ['d', 'description'], ['p', 'propriété']],
      draw: function (svg) { var e = {}; e.g = grille(svg); return e; },
      steps: [
        { cap: 'La flèche de A vers A\' est le **vecteur** AA\' : une **direction**, un **sens**, une **longueur**.', ar: 'السهم من A نحو A\' هو المتجهة [[AA\']]: اتجاه ومنحى ومنظم.', hud: { n: ['vecteur'], d: 'direction, sens, longueur', p: '–' }, run: function (e) { e.g.set([4, 2], {}); } },
        { cap: 'La **translation** de vecteur AA\' déplace **chaque point** du même vecteur.', ar: 'الإزاحة ذات المتجهة [[AA\']] تنقل كل نقطة بنفس المتجهة.', hud: { n: ['translation'], d: 'même flèche partout', p: '–' }, run: function (e) { e.g.set([4, 2], { img: 1, toutes: 1 }); } },
        { cap: 'Toutes ces flèches sont des **vecteurs égaux** : même direction, même sens, même longueur.', ar: 'كل هذه الأسهم متجهات متساوية.', hud: { n: ['vecteurs égaux'], d: 'mêmes caractéristiques', p: '–' }, run: function (e) { e.g.set([4, 2], { img: 1, toutes: 1 }); } },
        { cap: 'Si **AB = DC** (vecteurs), alors **ABCD est un parallélogramme**, et réciproquement.', ar: 'تتساوى المتجهتان [[AB]] و [[DC]] إذا وفقط إذا كان ABCD متوازي أضلاع.', hud: { n: 'parallélogramme', d: 'AB = DC', p: ['ABCD parallélogramme'] }, run: function (e) { e.g.set([4, 2], { img: 1, toutes: 1 }); } },
        { cap: 'La translation **conserve** les longueurs, les angles, l\'alignement et les aires.', ar: 'الإزاحة تحافظ على المسافات والزوايا والاستقامية والمساحات.', hud: { n: 'propriétés', d: 'figure superposable', p: ['conserve tout'] }, run: function (e) { e.g.set([4, 2], { img: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Règle le vecteur pour amener la figure exactement sur le cadre vert.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Translation sur grille' }, st);
          var g = grille(svg), v = [1, 0], cible = [7, 3], set = MV.hud(c, [['v', 'vecteur'], ['o', 'sur la cible ?', 1]]);
          function upd() { g.set(v, { img: 1, toutes: 1, cible: cible }); set('v', v[0] + ' → ; ' + v[1] + ' ↑'); var ok = v[0] === cible[0] && v[1] === cible[1]; set('o', ok ? 'oui' : 'non'); if (ok) done(); }
          MV.slider(c, { label: 'cases vers la droite', min: 0, max: 8, value: 1 }, function (x) { v[0] = x; upd(); });
          MV.slider(c, { label: 'cases vers le haut', min: 0, max: 4, value: 0 }, function (y) { v[1] = y; upd(); });
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'ABCD est un parallélogramme.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Le vecteur AB est égal au vecteur :', o: ['DC', 'CD', 'BC'], a: 0 },
            { type: 'opt', q: 'Étape 2. Par la translation de vecteur AB, l\'image de D est :', o: ['C', 'B'], a: 0 },
            { q: 'Étape 3. AB = 5 cm. Longueur de DC (cm) ?', a: 5 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Une translation fait :', o: ['glisser une figure', 'tourner une figure'], a: 0 },
      { lvl: 'Niveau 2', q: 'Deux vecteurs égaux ont la même direction, le même sens et :', o: ['la même longueur', 'des longueurs différentes'], a: 0 },
      { lvl: 'Niveau 3', q: 'Un segment de 7 cm a pour image par une translation un segment de ? cm', a: 7 },
      { lvl: 'Niveau 4', q: 'On déplace un point de 3 cases à droite puis de 4 vers le haut. Longueur du vecteur (en cases) ?', a: 5, hint: 'Pythagore : 3² + 4² = 25.' }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'Le déplacement du personnage',
      hud: [['v', 'vecteur'], ['t', 'transformation'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.g = grille(svg); return e; },
      steps: [
        { cap: 'Le mouvement est décrit par **un vecteur** : 4 vers la droite, 2 vers le haut.', hud: { v: ['(4 → ; 2 ↑)'], t: '–', r: '–' }, run: function (e) { e.g.set([4, 2], {}); } },
        { cap: 'C\'est une **translation** : chaque point glisse du même vecteur, la forme ne change pas.', ar: 'حركة الشخصية إزاحة: تنتقل كل نقطة بنفس المتجهة ولا يتغير الشكل.', hud: { v: '(4 → ; 2 ↑)', t: ['translation'], r: ['figure superposable'] }, run: function (e) { e.g.set([4, 2], { img: 1, toutes: 1 }); } }
      ]
    },

    retenir: [
      'Un <b>vecteur</b> a une direction, un sens et une longueur. La <b>translation</b> de vecteur u déplace chaque point du même vecteur u.',
      '<b class="mono">AB = DC</b> (vecteurs) équivaut à : ABCD est un <b>parallélogramme</b>. La translation conserve longueurs, angles, alignement et aires.'
    ],
    retenirAr: 'للمتجهة اتجاه ومنحى ومنظم. الإزاحة ذات المتجهة u تنقل كل نقطة بنفس المتجهة. تساوي [[AB]] و [[DC]] يعني أن ABCD متوازي أضلاع.',
    voc: [['un vecteur', 'متجهة'], ['une translation', 'إزاحة'], ['des vecteurs égaux', 'متجهات متساوية'], ['la direction', 'الاتجاه'], ['le sens', 'المنحى']]
  });
})();
