/* @meta {"id":"2ac-droite-milieux","level":"2","order":5,"theme":"Géométrie","title":"Triangle et parallèles : la droite des milieux","ar":"المثلث والمستقيمات المتوازية: مستقيم المنتصفين","lead":"Une barre relie le milieu des deux montants d'un portique triangulaire. Elle est parallèle au sol, et sa longueur est la moitié de la base. Pourquoi ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var B = [50, 190], C = [310, 190];

  function figure(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (A, k, show) { // A sommet ; k position de M sur [AB] (0,5 = milieu) ; show : montre MN
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      S('path', { d: 'M' + A + ' L' + B + ' L' + C + ' Z', fill: 'rgba(255,255,255,.04)', stroke: '#9aa0a8', 'stroke-width': 2 }, dyn);
      var M = [A[0] + k * (B[0] - A[0]), A[1] + k * (B[1] - A[1])], N = [A[0] + 0.5 * (C[0] - A[0]), A[1] + 0.5 * (C[1] - A[1])];
      S('line', { x1: B[0], y1: B[1], x2: C[0], y2: C[1], stroke: '#7fb2ff', 'stroke-width': 4 }, dyn);
      if (show) S('line', { x1: M[0], y1: M[1], x2: N[0], y2: N[1], stroke: 'var(--acc)', 'stroke-width': 4 }, dyn);
      [[M, 'M'], [N, 'N']].forEach(function (p) { S('circle', { cx: p[0][0], cy: p[0][1], r: 5, fill: 'var(--acc)' }, dyn); });
      T(dyn, M[0] - 12, M[1], 'M', 'lbl', 'end'); T(dyn, N[0] + 12, N[1], 'N', 'lbl', 'start');
      T(dyn, A[0], A[1] - 10, 'A', 'lbl'); T(dyn, B[0] - 6, B[1] + 18, 'B', 'lbl'); T(dyn, C[0] + 6, C[1] + 18, 'C', 'lbl');
      // marques de milieu
      [[A, B], [A, C]].forEach(function (s, i) { if (i === 0 && k !== 0.5) return; [0.25, 0.75].forEach(function (t) { var P = [s[0][0] + t * (s[1][0] - s[0][0]), s[0][1] + t * (s[1][1] - s[0][1])]; S('circle', { cx: P[0], cy: P[1], r: 2.5, fill: '#e9e9ea' }, dyn); }); });
      var MN = Math.hypot(N[0] - M[0], N[1] - M[1]), BC = C[0] - B[0];
      return [MN, BC, Math.abs(N[1] - M[1]) < 0.5];
    };
    return g;
  }

  MV.lesson({
    id: '2ac-droite-milieux',
    objectif: {
      fr: 'Utiliser les propriétés de la droite des milieux dans un triangle : parallélisme, longueur moitié, et la réciproque.',
      ar: 'استعمال خاصيات مستقيم منتصفي ضلعين في مثلث: التوازي، ونصف الطول، والخاصية العكسية.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Un portique triangulaire',
      hud: [['b', 'base'], ['m', 'barre'], ['q', 'pourquoi ?']],
      draw: function (svg) { var e = {}; e.f = figure(svg); return e; },
      steps: [
        { cap: 'Un portique en forme de **triangle** ; sa base mesure **4 m**.', hud: { b: ['4 m'], m: '–', q: '–' }, run: function (e) { e.f.set([150, 30], 0.5, 0); } },
        { cap: 'Une barre relie les **milieux** des deux montants.', hud: { b: '4 m', m: ['entre les milieux'], q: '–' }, run: function (e) { e.f.set([150, 30], 0.5, 1); } },
        { cap: 'Elle est parallèle au sol et mesure **2 m**. Pourquoi ? On le saura à la fin.', hud: { b: '4 m', m: '2 m', q: ['?'] }, run: function (e) { e.f.set([150, 30], 0.5, 1); } }
      ]
    },

    predire: {
      q: "Dans un triangle, la base mesure 12 cm. On relie les milieux des deux autres côtés. Que mesure ce segment ?",
      ar: "في مثلث قاعدته [[12 cm]] نصل منتصفي الضلعين الآخرين. كم يقيس هذا القطعة؟",
      o: ["4 cm", "6 cm", "8 cm"],
      a: 1,
      e: "Le segment qui joint les milieux de deux côtés mesure la moitié du troisième côté : 12 ÷ 2 = 6 cm. Il est aussi parallèle à ce troisième côté.",
      ear: "القطعة الواصلة بين منتصفي ضلعين تساوي نصف الضلع الثالث [[12 ÷ 2 = 6 cm]] وتوازيه."
    },

    prepare: [
      ['Le milieu d\'un segment le partage en deux longueurs égales.', true, 'Par définition.'],
      ['Deux droites parallèles se coupent.', false, 'Elles ne se coupent jamais.'],
      ['La moitié de 9 cm est 4,5 cm.', true, '9 ÷ 2 = 4,5.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'La droite des milieux',
      hud: [['h', 'si'], ['c', 'alors'], ['p', 'propriété']],
      draw: function (svg) { var e = {}; e.f = figure(svg); return e; },
      steps: [
        { cap: 'Triangle ABC : **M** est le milieu de [AB], **N** le milieu de [AC].', ar: 'M منتصف [AB] و N منتصف [AC].', hud: { h: ['M, N milieux'], c: '–', p: '–' }, run: function (e) { e.f.set([150, 30], 0.5, 0); } },
        { cap: 'Alors **(MN) // (BC)** : la droite des milieux est parallèle au troisième côté.', ar: 'إذن [[(MN) // (BC)]].', hud: { h: 'M, N milieux', c: ['(MN) // (BC)'], p: 'P1' }, run: function (e) { e.f.set([150, 30], 0.5, 1); } },
        { cap: 'Et **MN = BC ÷ 2** : sa longueur est la moitié du troisième côté.', ar: 'و [[MN = BC ÷ 2]].', hud: { h: 'M, N milieux', c: ['MN = BC/2'], p: 'P2' }, run: function (e) { e.f.set([100, 40], 0.5, 1); } },
        { cap: 'Réciproque : si M est le milieu de [AB] et si la parallèle à (BC) passant par M coupe [AC] en N, alors **N est le milieu** de [AC].', ar: 'الخاصية العكسية: المستقيم المار من منتصف ضلع والموازي لضلع ثان يمر من منتصف الضلع الثالث.', hud: { h: ['M milieu, (MN) // (BC)'], c: ['N milieu de [AC]'], p: 'P3' }, run: function (e) { e.f.set([230, 50], 0.5, 1); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Déplace M sur [AB] (N reste au milieu de [AC]). Quand (MN) est-elle parallèle à (BC) ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Triangle et droite des milieux' }, st);
          var f = figure(svg), set = MV.hud(c, [['m', 'AM / AB'], ['p', '(MN) // (BC) ?', 1], ['l', 'MN / BC']]);
          MV.slider(c, { label: 'position de M (%)', min: 20, max: 80, value: 30, step: 10 }, function (p) { var r = f.set([150, 30], p / 100, 1); set('m', (p / 100).toString().replace('.', ',')); set('p', r[2] ? 'oui' : 'non'); set('l', r[2] ? '0,5' : '–'); if (p === 50) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Dans ABC, M et N sont les milieux de [AB] et [AC], et BC = 12 cm.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Que peut-on dire de (MN) et (BC) ?', o: ['elles sont parallèles', 'elles sont perpendiculaires'], a: 0 },
            { q: 'Étape 2. MN = ? cm', a: 6 },
            { q: 'Étape 3. Si MN = 7,5 cm dans un autre triangle, BC = ? cm', a: 15 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'La droite qui joint les milieux de deux côtés est :', o: ['parallèle au troisième côté', 'perpendiculaire au troisième côté'], a: 0 },
      { lvl: 'Niveau 2', q: 'BC = 10 cm. MN = ? cm', a: 5 },
      { lvl: 'Niveau 3', q: 'MN = 3,5 cm. BC = ? cm', a: 7 },
      { lvl: 'Niveau 4', q: 'Les milieux des trois côtés d\'un triangle de côtés 6, 8 et 10 cm forment un petit triangle. Son périmètre (cm) ?', a: 12 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'La barre du portique',
      hud: [['p', 'position'], ['d', 'direction'], ['l', 'longueur']],
      draw: function (svg) { var e = {}; e.f = figure(svg); return e; },
      steps: [
        { cap: 'La barre joint les **milieux** de deux côtés du triangle.', hud: { p: ['milieux'], d: '–', l: '–' }, run: function (e) { e.f.set([150, 30], 0.5, 1); } },
        { cap: 'Donc elle est **parallèle** à la base et mesure **4 ÷ 2 = 2 m**.', ar: 'العارضة تصل منتصفي ضلعين، فهي موازية للقاعدة وطولها نصف طولها.', hud: { p: 'milieux', d: ['parallèle au sol'], l: ['2 m'] }, run: function (e) { e.f.set([150, 30], 0.5, 1); } }
      ]
    },

    retenir: [
      'Dans un triangle, la droite qui passe par les <b>milieux de deux côtés</b> est <b>parallèle</b> au troisième côté, et le segment qui joint ces milieux mesure la <b>moitié</b> du troisième côté.',
      '<b>Réciproque</b> : la parallèle à un côté passant par le milieu d\'un deuxième côté coupe le troisième côté en son milieu.'
    ],
    retenirAr: 'في مثلث، المستقيم المار من منتصفي ضلعين يوازي الضلع الثالث، وطول القطعة الواصلة بين المنتصفين يساوي نصف طول الضلع الثالث. والمستقيم المار من منتصف ضلع والموازي لضلع ثان يمر من منتصف الضلع الثالث.',
    voc: [['le milieu', 'المنتصف'], ['la droite des milieux', 'مستقيم المنتصفين'], ['parallèle', 'مواز'], ['la réciproque', 'الخاصية العكسية']]
  });
})();
