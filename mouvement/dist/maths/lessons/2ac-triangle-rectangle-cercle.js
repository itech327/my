/* @meta {"id":"2ac-triangle-rectangle-cercle","level":"2","order":10,"theme":"Géométrie","title":"Triangle rectangle et cercle","ar":"المثلث القائم الزاوية والدائرة","lead":"On fait glisser le coin d'une équerre contre deux clous plantés dans une planche. Le coin dessine… un demi-cercle exactement."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, O = [180, 150], R = 120;

  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    var A = [O[0] - R, O[1]], B = [O[0] + R, O[1]];
    g.set = function (ang, o) { // ang : position de M sur le demi-cercle (degrés) ; o.cercle, o.mediane
      o = o || {};
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.cercle) S('path', { d: 'M' + A + ' A' + R + ' ' + R + ' 0 0 1 ' + B, fill: 'none', stroke: '#7fb2ff', 'stroke-width': 2, 'stroke-dasharray': '6 4' }, dyn);
      var M = [O[0] + R * Math.cos(ang * Math.PI / 180), O[1] - R * Math.sin(ang * Math.PI / 180)];
      S('path', { d: 'M' + A + ' L' + M + ' L' + B + ' Z', fill: 'rgba(255,122,47,.14)', stroke: 'var(--acc)', 'stroke-width': 3 }, dyn);
      // angle droit en M
      var u = [A[0] - M[0], A[1] - M[1]], v = [B[0] - M[0], B[1] - M[1]], nu = Math.hypot(u[0], u[1]), nv = Math.hypot(v[0], v[1]), k = 14;
      var p1 = [M[0] + u[0] / nu * k, M[1] + u[1] / nu * k], p2 = [M[0] + v[0] / nv * k, M[1] + v[1] / nv * k], p3 = [p1[0] + v[0] / nv * k, p1[1] + v[1] / nv * k];
      S('path', { d: 'M' + p1 + ' L' + p3 + ' L' + p2, fill: 'none', stroke: '#e9e9ea', 'stroke-width': 1.5 }, dyn);
      if (o.mediane) { S('line', { x1: O[0], y1: O[1], x2: M[0], y2: M[1], stroke: '#f2c14e', 'stroke-width': 3 }, dyn); T(dyn, (O[0] + M[0]) / 2 + 8, (O[1] + M[1]) / 2, 'OM', 'tag', 'start'); }
      S('circle', { cx: O[0], cy: O[1], r: 4, fill: '#fff' }, dyn); T(dyn, O[0], O[1] + 18, 'O', 'lbl');
      T(dyn, A[0] - 6, A[1] + 16, 'A', 'lbl'); T(dyn, B[0] + 6, B[1] + 16, 'B', 'lbl'); T(dyn, M[0], M[1] - 10, 'M', 'lbl');
    };
    return g;
  }

  MV.lesson({
    id: '2ac-triangle-rectangle-cercle',
    objectif: {
      fr: 'Savoir qu\'un triangle rectangle est inscrit dans le cercle de diamètre son hypoténuse, et utiliser la médiane relative à l\'hypoténuse et la réciproque.',
      ar: 'معرفة أن المثلث القائم الزاوية محاط بالدائرة التي قطرها وتره، واستعمال المتوسط المتعلق بالوتر والخاصية العكسية.'
    },

    ouverture: {
      vb: '0 0 360 190', label: 'L\'équerre et les deux clous',
      hud: [['c', 'clous'], ['e', 'coin de l\'équerre'], ['q', 'quelle courbe ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Deux **clous** A et B. On appuie les côtés d\'une **équerre** contre eux.', hud: { c: ['A et B'], e: 'angle droit en M', q: '–' }, run: function (e) { e.s.set(110); } },
        { cap: 'On fait **glisser** l\'équerre : le coin M se déplace.', hud: { c: 'A et B', e: ['se déplace'], q: '–' }, run: function (e) { e.s.set(60); } },
        { cap: 'Quelle courbe le coin M dessine-t-il ? On le saura à la fin.', hud: { c: 'A et B', e: 'se déplace', q: ['?'] }, run: function (e) { e.s.set(30); } }
      ]
    },

    prepare: [
      ['Dans un triangle rectangle, l\'hypoténuse est le côté opposé à l\'angle droit.', true, 'C\'est le plus long côté.'],
      ['Le centre d\'un cercle est le milieu de chaque diamètre.', true, 'Un diamètre passe par le centre.'],
      ['Tous les points d\'un cercle sont à des distances différentes du centre.', false, 'Ils sont tous à la même distance : le rayon.']
    ],

    regarde: {
      vb: '0 0 360 190', label: 'Le cercle de l\'hypoténuse',
      hud: [['h', 'si'], ['c', 'alors'], ['p', 'propriété']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'AMB est rectangle en M. Son hypoténuse est **[AB]**.', ar: 'المثلث AMB قائم الزاوية في M، ووتره [AB].', hud: { h: ['AMB rectangle en M'], c: '–', p: '–' }, run: function (e) { e.s.set(70); } },
        { cap: 'Alors M est sur le **cercle de diamètre [AB]** : le cercle circonscrit a pour centre le milieu O de l\'hypoténuse.', ar: 'إذن M تنتمي إلى الدائرة التي قطرها [AB]، ومركزها منتصف الوتر.', hud: { h: 'AMB rectangle en M', c: ['M sur le cercle de diamètre [AB]'], p: 'P1' }, run: function (e) { e.s.set(70, { cercle: 1 }); } },
        { cap: 'Donc **OM = OA = OB** : la médiane issue de l\'angle droit mesure la **moitié de l\'hypoténuse**.', ar: 'إذن [[OM = AB ÷ 2]]: المتوسط المتعلق بالوتر يساوي نصف الوتر.', hud: { h: 'AMB rectangle en M', c: ['OM = AB/2'], p: 'P2' }, run: function (e) { e.s.set(70, { cercle: 1, mediane: 1 }); } },
        { cap: 'Réciproque : si M est sur le cercle de diamètre [AB] (M ≠ A, B), alors **AMB est rectangle en M**.', ar: 'الخاصية العكسية: إذا كانت M على الدائرة التي قطرها [AB] فإن المثلث AMB قائم الزاوية في M.', hud: { h: ['M sur le cercle de diamètre [AB]'], c: ['angle AMB droit'], p: 'P3' }, run: function (e) { e.s.set(140, { cercle: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Déplace M sur le demi-cercle : l\'angle en M reste droit et OM = OA.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 190', role: 'img', 'aria-label': 'Triangle inscrit dans un demi-cercle' }, st);
          var s = scene(svg), set = MV.hud(c, [['p', 'position de M'], ['a', 'angle en M'], ['m', 'OM / AB', 1]]);
          MV.slider(c, { label: 'position de M (°)', min: 10, max: 170, value: 40, step: 10 }, function (a) { s.set(a, { cercle: 1, mediane: 1 }); set('p', a + '°'); set('a', '90°'); set('m', '1/2'); if (a === 90) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Place M au sommet du demi-cercle.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'EFG est rectangle en F et l\'hypoténuse [EG] mesure 10 cm. I est le milieu de [EG].',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Le centre du cercle circonscrit à EFG est :', o: ['I, milieu de [EG]', 'F'], a: 0 },
            { q: 'Étape 2. Rayon de ce cercle (cm) ?', a: 5 },
            { q: 'Étape 3. FI = ? cm', a: 5 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le cercle circonscrit à un triangle rectangle a pour diamètre :', o: ['l\'hypoténuse', 'le plus petit côté'], a: 0 },
      { lvl: 'Niveau 2', q: 'Hypoténuse 13 cm. Médiane relative à l\'hypoténuse (cm) ?', a: 6.5 },
      { lvl: 'Niveau 3', q: 'M est sur le cercle de diamètre [RS]. L\'angle RMS mesure ? °', a: 90 },
      { lvl: 'Niveau 4', q: 'Médiane relative à l\'hypoténuse : 4,5 cm. Hypoténuse (cm) ?', a: 9 }
    ],

    bilan: {
      vb: '0 0 360 190', label: 'La courbe du coin',
      hud: [['a', 'angle en M'], ['c', 'courbe'], ['r', 'raison']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le coin M fait toujours un **angle droit** avec A et B.', hud: { a: ['90°'], c: '–', r: '–' }, run: function (e) { e.s.set(50); } },
        { cap: 'Donc M est sur le **cercle de diamètre [AB]** : le coin dessine un **demi-cercle**.', ar: 'الزاوية في M قائمة دائما، إذن M تنتمي إلى الدائرة التي قطرها [AB].', hud: { a: '90°', c: ['demi-cercle'], r: ['diamètre [AB]'] }, run: function (e) { e.s.set(50, { cercle: 1 }); } }
      ]
    },

    retenir: [
      'Si un triangle est <b>rectangle</b>, il est inscrit dans le cercle dont un <b>diamètre</b> est son <b>hypoténuse</b> ; la médiane issue de l\'angle droit mesure la <b>moitié</b> de l\'hypoténuse.',
      '<b>Réciproque</b> : si M est sur le cercle de diamètre [AB] (M distinct de A et B), alors le triangle AMB est rectangle en M.'
    ],
    retenirAr: 'إذا كان مثلث قائم الزاوية فإنه محاط بالدائرة التي قطرها وتره، والمتوسط المتعلق بالوتر يساوي نصفه. وإذا كانت نقطة M على الدائرة التي قطرها [AB] فإن المثلث AMB قائم الزاوية في M.',
    voc: [['l\'hypoténuse', 'الوتر'], ['le cercle circonscrit', 'الدائرة المحيطة'], ['la médiane', 'المتوسط'], ['inscrit', 'محاط']]
  });
})();
