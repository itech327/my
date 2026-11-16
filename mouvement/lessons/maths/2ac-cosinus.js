/* @meta {"id":"2ac-cosinus","level":"2","order":12,"theme":"Géométrie","title":"Cosinus d'un angle aigu","ar":"جيب تمام زاوية حادة","lead":"Une rampe d'accès de 6 m de long monte avec un angle de 60°. Quelle place prend-elle au sol ? Un seul rapport suffit : le cosinus."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, RAD = Math.PI / 180, A = [40, 175], L = 260;

  function f2(v) { return (Math.round(v * 100) / 100).toString().replace('.', ','); }
  function rampe(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (ang, hot) { // hot : 'cos' met en valeur adjacent et hypoténuse
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var Lp = Math.min(L, 150 / Math.sin(ang * RAD)), B = [A[0] + Lp * Math.cos(ang * RAD), A[1] - Lp * Math.sin(ang * RAD)], C = [B[0], A[1]];
      S('path', { d: 'M' + A + ' L' + C + ' L' + B + ' Z', fill: 'rgba(255,255,255,.04)' }, dyn);
      S('line', { x1: A[0], y1: A[1], x2: C[0], y2: C[1], stroke: hot ? '#7fb2ff' : '#9aa0a8', 'stroke-width': hot ? 5 : 3 }, dyn);
      S('line', { x1: C[0], y1: C[1], x2: B[0], y2: B[1], stroke: '#9aa0a8', 'stroke-width': 3 }, dyn);
      S('line', { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: 'var(--acc)', 'stroke-width': hot ? 5 : 3 }, dyn);
      S('path', { d: 'M' + (C[0] - 12) + ' ' + C[1] + ' v-12 h12', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 1.5 }, dyn);
      S('path', { d: 'M' + (A[0] + 36) + ' ' + A[1] + ' A36 36 0 0 0 ' + (A[0] + 36 * Math.cos(ang * RAD)) + ' ' + (A[1] - 36 * Math.sin(ang * RAD)), fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
      T(dyn, A[0] + 48, A[1] - 8, ang + '°', 'tag', 'start');
      T(dyn, (A[0] + C[0]) / 2, A[1] + 18, 'adjacent', 'tag'); T(dyn, (A[0] + B[0]) / 2 - 10, (A[1] + B[1]) / 2 - 8, 'hypoténuse', 'tag', 'end');
      T(dyn, A[0] - 8, A[1] + 4, 'A', 'lbl', 'end'); T(dyn, B[0] + 8, B[1], 'B', 'lbl', 'start'); T(dyn, C[0] + 8, C[1] + 4, 'C', 'lbl', 'start');
    };
    return g;
  }

  MV.lesson({
    id: '2ac-cosinus',
    objectif: {
      fr: 'Définir le cosinus d\'un angle aigu dans un triangle rectangle et l\'utiliser pour calculer une longueur ou un angle.',
      ar: 'تعريف جيب تمام زاوية حادة في مثلث قائم الزاوية واستعماله لحساب طول أو زاوية.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Une rampe d\'accès',
      hud: [['l', 'longueur'], ['a', 'angle'], ['q', 'place au sol ?']],
      draw: function (svg) { var e = {}; e.r = rampe(svg); return e; },
      steps: [
        { cap: 'Une **rampe** de **6 m** permet aux fauteuils roulants d\'accéder à une estrade.', hud: { l: ['6 m'], a: '–', q: '–' }, run: function (e) { e.r.set(60); } },
        { cap: 'Elle fait un angle de **60°** avec le sol.', hud: { l: '6 m', a: ['60°'], q: '–' }, run: function (e) { e.r.set(60); } },
        { cap: 'Quelle longueur prend-elle **au sol** ? On le saura à la fin.', hud: { l: '6 m', a: '60°', q: ['?'] }, run: function (e) { e.r.set(60, 'cos'); } }
      ]
    },

    prepare: [
      ['L\'hypoténuse est le plus long côté d\'un triangle rectangle.', true, 'Elle est opposée à l\'angle droit.'],
      ['Le côté adjacent à un angle aigu touche cet angle et n\'est pas l\'hypoténuse.', true, 'C\'est le côté de l\'angle autre que l\'hypoténuse.'],
      ['Un rapport d\'un côté sur l\'hypoténuse peut dépasser 1.', false, 'L\'hypoténuse est le plus grand côté : le rapport est inférieur à 1.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'Le cosinus',
      hud: [['d', 'définition'], ['c', 'calcul'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.r = rampe(svg); return e; },
      steps: [
        { cap: 'Dans le triangle ABC rectangle en C, l\'angle A est **aigu**.', ar: 'في المثلث ABC القائم الزاوية في C، الزاوية A حادة.', hud: { d: 'angle aigu A', c: '–', v: '–' }, run: function (e) { e.r.set(50); } },
        { cap: '**cos A = côté adjacent ÷ hypoténuse = AC ÷ AB**.', ar: '[[cos A]] = الضلع المجاور ÷ الوتر = [[AC ÷ AB]].', hud: { d: ['adjacent ÷ hypoténuse'], c: 'AC ÷ AB', v: '–' }, run: function (e) { e.r.set(50, 'cos'); } },
        { cap: 'Le cosinus ne dépend que de l\'angle : cos 60° = **0,5**, quelle que soit la taille du triangle.', ar: 'جيب التمام لا يتعلق إلا بالزاوية: [[cos 60° = 0,5]].', hud: { d: 'dépend de l\'angle', c: 'cos 60°', v: ['0,5'] }, run: function (e) { e.r.set(60, 'cos'); } },
        { cap: 'Plus l\'angle **grandit**, plus le cosinus **diminue**. Toujours 0 < cos A < 1.', ar: 'كلما كبرت الزاوية صغر جيب تمامها، وهو دائما بين 0 و 1.', hud: { d: 'cos décroît', c: 'cos 30° ≈ 0,87', v: ['0 < cos < 1'] }, run: function (e) { e.r.set(30, 'cos'); } },
        { cap: 'Calculer un côté : **AC = AB × cos A**. Trouver un angle : la touche **cos⁻¹** de la calculatrice.', ar: 'لحساب الضلع المجاور: [[AC = AB × cos A]]، ولإيجاد الزاوية نستعمل الآلة الحاسبة.', hud: { d: 'utilisation', c: ['AC = AB × cos A'], v: 'cos⁻¹' }, run: function (e) { e.r.set(45, 'cos'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change l\'angle et observe le cosinus. Trouve l\'angle dont le cosinus vaut 0,5.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Triangle rectangle' }, st);
          var r = rampe(svg), set = MV.hud(c, [['a', 'angle A'], ['c', 'cos A', 1]]);
          MV.slider(c, { label: 'angle A (°)', min: 20, max: 80, value: 30, step: 5 }, function (a) { r.set(a, 'cos'); set('a', a + '°'); set('c', f2(Math.cos(a * RAD))); if (a === 60) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Triangle EFG rectangle en G, EF = 10 cm (hypoténuse) et l\'angle E mesure 60°.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Le côté adjacent à E est :', o: ['EG', 'FG'], a: 0 },
            { type: 'opt', q: 'Étape 2. On écrit :', o: ['EG = EF × cos 60°', 'EG = EF ÷ cos 60°'], a: 0 },
            { q: 'Étape 3. EG = 10 × 0,5 = ? cm', a: 5 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'cos A =', o: ['adjacent ÷ hypoténuse', 'hypoténuse ÷ adjacent'], a: 0 },
      { lvl: 'Niveau 2', q: 'Adjacent 4 cm, hypoténuse 5 cm. cos A = ?', a: 0.8 },
      { lvl: 'Niveau 3', q: 'Hypoténuse 12 cm, cos A = 0,25. Côté adjacent (cm) ?', a: 3 },
      { lvl: 'Niveau 4', q: 'Quel angle est le plus grand : celui de cosinus 0,9 ou celui de cosinus 0,2 ?', o: ['cosinus 0,2', 'cosinus 0,9'], a: 0 }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'La rampe au sol',
      hud: [['f', 'formule'], ['c', 'calcul'], ['r', 'au sol']],
      draw: function (svg) { var e = {}; e.r = rampe(svg); return e; },
      steps: [
        { cap: 'Au sol, c\'est le côté **adjacent** : AC = AB × cos 60°.', hud: { f: ['AC = AB × cos A'], c: '6 × 0,5', r: '–' }, run: function (e) { e.r.set(60, 'cos'); } },
        { cap: 'AC = 6 × 0,5 = **3 m**.', ar: 'الطول على الأرض [[AC = 6 × cos 60° = 3 m]].', hud: { f: 'AC = AB × cos A', c: '6 × 0,5', r: ['3 m'] }, run: function (e) { e.r.set(60, 'cos'); } }
      ]
    },

    retenir: [
      'Dans un triangle rectangle, pour un angle aigu A : <b class="mono">cos A = côté adjacent ÷ hypoténuse</b>. Le cosinus ne dépend que de l\'angle et vérifie <b class="mono">0 &lt; cos A &lt; 1</b>.',
      'On calcule un côté avec <b class="mono">adjacent = hypoténuse × cos A</b>, et un angle avec la touche <b>cos⁻¹</b> de la calculatrice.'
    ],
    retenirAr: 'في مثلث قائم الزاوية، جيب تمام زاوية حادة يساوي الضلع المجاور مقسوما على الوتر، وهو محصور بين 0 و 1 ولا يتعلق إلا بالزاوية.',
    voc: [['le cosinus', 'جيب التمام'], ['un angle aigu', 'زاوية حادة'], ['le côté adjacent', 'الضلع المجاور'], ['l\'hypoténuse', 'الوتر']]
  });
})();
