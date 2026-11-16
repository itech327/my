/* @meta {"id":"1ac-repere","level":"1","order":14,"theme":"Géométrie","title":"Droite graduée et repère dans le plan","ar":"المستقيم المدرج والمعلم في المستوى","lead":"Une carte au trésor dit : « 3 pas vers l'est, puis 2 pas vers le sud ». Deux nombres suffisent pour repérer un point : ses coordonnées."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 180, Y0 = 110, U = 26; // origine au centre, 1 unité = 26 px

  function px(x, y) { return [X0 + x * U, Y0 - y * U]; }
  function plan(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    for (var i = -6; i <= 6; i++) { S('line', { x1: X0 + i * U, y1: Y0 - 4 * U, x2: X0 + i * U, y2: Y0 + 4 * U, stroke: 'rgba(255,255,255,.07)' }, g); if (i) T(g, X0 + i * U, Y0 + 14, i < 0 ? '−' + (-i) : i, 'tag'); }
    for (var j = -4; j <= 4; j++) { S('line', { x1: X0 - 6 * U, y1: Y0 - j * U, x2: X0 + 6 * U, y2: Y0 - j * U, stroke: 'rgba(255,255,255,.07)' }, g); if (j) T(g, X0 - 6, Y0 - j * U + 4, j < 0 ? '−' + (-j) : j, 'tag', 'end'); }
    var axeY = S('line', { x1: X0, y1: Y0 - 4 * U, x2: X0, y2: Y0 + 4 * U, stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    S('line', { x1: X0 - 6 * U, y1: Y0, x2: X0 + 6 * U, y2: Y0, stroke: '#9aa0a8', 'stroke-width': 2 }, g); T(g, X0 - 8, Y0 + 14, 'O', 'tag', 'end');
    g.set = function (pts, o) { // pts : [[x, y, nom]] ; o.droite : seulement l'axe horizontal ; o.guides
      o = o || {};
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      axeY.style.opacity = o.droite ? 0.15 : 1;
      pts.forEach(function (p) {
        var q = px(p[0], o.droite ? 0 : p[1]);
        if (o.guides && !o.droite) S('path', { d: 'M' + q[0] + ' ' + Y0 + ' V' + q[1] + ' H' + X0, stroke: '#f2c14e', 'stroke-dasharray': '4 4', fill: 'none', 'stroke-width': 1.5 }, dyn);
        S('circle', { cx: q[0], cy: q[1], r: 6, fill: 'var(--acc)' }, dyn);
        T(dyn, q[0] + 8, q[1] - 8, p[2] + (o.droite ? '(' + p[0] + ')' : '(' + p[0] + ' ; ' + p[1] + ')'), 'lbl', 'start');
      });
    };
    return g;
  }

  MV.lesson({
    id: '1ac-repere',
    objectif: {
      fr: 'Lire et placer un point sur une droite graduée (abscisse) et dans un repère du plan (abscisse, ordonnée).',
      ar: 'قراءة وتمثيل نقطة على مستقيم مدرج (الأفصول) وفي معلم في المستوى (الأفصول والأرتوب).'
    },

    ouverture: {
      vb: '0 0 360 225', label: 'La carte au trésor',
      hud: [['e', 'vers l\'est'], ['s', 'vers le sud'], ['q', 'comment le noter ?']],
      draw: function (svg) { var e = {}; e.p = plan(svg); return e; },
      steps: [
        { cap: 'On part du **puits O**, au centre de la carte.', hud: { e: '–', s: '–', q: '–' }, run: function (e) { e.p.set([]); } },
        { cap: '« **3 pas vers l\'est**, puis **2 pas vers le sud** » : voilà le trésor.', hud: { e: ['3'], s: ['2'], q: '–' }, run: function (e) { e.p.set([[3, -2, 'T']], { guides: 1 }); } },
        { cap: 'Comment noter cette position avec deux nombres ? On le saura à la fin.', hud: { e: '3', s: '2', q: ['?'] }, run: function (e) { e.p.set([[3, -2, '?']], { guides: 1 }); } }
      ]
    },

    prepare: [
      ['Sur une droite graduée, −3 est à gauche de 0.', true, 'Les nombres négatifs sont à gauche de l\'origine.'],
      ['Le point (2 ; 5) et le point (5 ; 2) sont le même point.', false, 'L\'ordre compte : abscisse d\'abord, ordonnée ensuite.'],
      ['L\'origine O a pour coordonnées (0 ; 0).', true, 'C\'est le point de départ.']
    ],

    regarde: {
      vb: '0 0 360 225', label: 'De la droite au plan',
      hud: [['n', 'notion'], ['l', 'lecture'], ['v', 'exemple']],
      draw: function (svg) { var e = {}; e.p = plan(svg); return e; },
      steps: [
        { cap: 'Sur une **droite graduée**, chaque point a un nombre : son **abscisse**.', ar: 'على المستقيم المدرج لكل نقطة عدد هو أفصولها.', hud: { n: ['abscisse'], l: 'un nombre', v: 'A(4), B(−3)' }, run: function (e) { e.p.set([[4, 0, 'A'], [-3, 0, 'B']], { droite: 1 }); } },
        { cap: 'La distance AB se calcule : 4 − (−3) = **7**.', ar: 'المسافة [[AB = 4 − (−3) = 7]].', hud: { n: 'distance', l: 'grande − petite', v: ['AB = 7'] }, run: function (e) { e.p.set([[4, 0, 'A'], [-3, 0, 'B']], { droite: 1 }); } },
        { cap: 'Dans le plan, deux axes perpendiculaires forment un **repère**. Un point a deux **coordonnées**.', ar: 'في المستوى يكون محوران متعامدان معلما، ولكل نقطة زوج إحداثيات.', hud: { n: ['repère'], l: '(abscisse ; ordonnée)', v: '–' }, run: function (e) { e.p.set([]); } },
        { cap: 'On lit d\'abord l\'**abscisse** (horizontal), puis l\'**ordonnée** (vertical) : **M(2 ; 3)**.', ar: 'نقرأ أولا الأفصول ثم الأرتوب.', hud: { n: 'coordonnées', l: ['horizontal, puis vertical'], v: ['M(2 ; 3)'] }, run: function (e) { e.p.set([[2, 3, 'M']], { guides: 1 }); } },
        { cap: 'Les coordonnées peuvent être **négatives** : N(−4 ; −1) est en bas à gauche.', ar: 'قد تكون الإحداثيات سالبة.', hud: { n: 'signes', l: 'gauche : x < 0 ; bas : y < 0', v: ['N(−4 ; −1)'] }, run: function (e) { e.p.set([[2, 3, 'M'], [-4, -1, 'N']], { guides: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Déplace le point P. Amène-le en (−3 ; 2).',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 225', role: 'img', 'aria-label': 'Repère du plan' }, st);
          var p = plan(svg), x = 1, y = 1, set = MV.hud(c, [['c', 'P'], ['o', 'objectif', 1]]);
          function upd() { p.set([[x, y, 'P']], { guides: 1 }); set('c', '(' + x + ' ; ' + y + ')'); var ok = x === -3 && y === 2; set('o', ok ? 'atteint' : '(−3 ; 2)'); if (ok) done(); }
          MV.slider(c, { label: 'abscisse', min: -6, max: 6, value: 1 }, function (v) { x = v; upd(); });
          MV.slider(c, { label: 'ordonnée', min: -4, max: 4, value: 1 }, function (v) { y = v; upd(); });
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'Sur une droite graduée, E a pour abscisse −2 et F a pour abscisse 5.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. EF = 5 − (−2) = ?', a: 7 },
            { q: 'Étape 2. Abscisse du milieu de [EF] ? (−2 + 5) ÷ 2 =', a: 1.5 },
            { type: 'opt', q: 'Étape 3. Le point G(0 ; −3) est sur :', o: ['l\'axe des ordonnées', 'l\'axe des abscisses'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Dans R(5 ; −2), l\'abscisse est :', o: ['5', '−2'], a: 0 },
      { lvl: 'Niveau 2', q: 'A(−1) et B(6) sur une droite graduée. AB = ?', a: 7 },
      { lvl: 'Niveau 3', q: 'Un point d\'ordonnée négative est situé :', o: ['sous l\'axe des abscisses', 'au-dessus'], a: 0 },
      { lvl: 'Niveau 4', q: 'On part de (2 ; 1), on fait 4 pas à gauche. Nouvelle abscisse ?', a: -2 }
    ],

    bilan: {
      vb: '0 0 360 225', label: 'Le trésor',
      hud: [['x', 'abscisse'], ['y', 'ordonnée'], ['c', 'coordonnées']],
      draw: function (svg) { var e = {}; e.p = plan(svg); return e; },
      steps: [
        { cap: '3 pas vers l\'est : abscisse **3**. 2 pas vers le sud : ordonnée **−2**.', hud: { x: ['3'], y: ['−2'], c: '–' }, run: function (e) { e.p.set([[3, -2, 'T']], { guides: 1 }); } },
        { cap: 'Le trésor est en **T(3 ; −2)**.', ar: 'الكنز في النقطة [[T(3 ; −2)]].', hud: { x: '3', y: '−2', c: ['T(3 ; −2)'] }, run: function (e) { e.p.set([[3, -2, 'T']], { guides: 1 }); } }
      ]
    },

    retenir: [
      'Sur une <b>droite graduée</b>, chaque point a une <b>abscisse</b>. La distance entre deux points est la différence entre la plus grande et la plus petite abscisse.',
      'Dans un <b>repère</b> du plan, un point a deux <b>coordonnées</b> : <b class="mono">(abscisse ; ordonnée)</b>, dans cet ordre. L\'origine est O(0 ; 0).'
    ],
    retenirAr: 'على المستقيم المدرج لكل نقطة أفصول. في معلم المستوى لكل نقطة إحداثيتان: الأفصول ثم الأرتوب، والأصل [[O(0 ; 0)]].',
    voc: [['une droite graduée', 'مستقيم مدرج'], ['l\'abscisse', 'الأفصول'], ['l\'ordonnée', 'الأرتوب'], ['un repère', 'معلم'], ['l\'origine', 'الأصل']]
  });
})();
