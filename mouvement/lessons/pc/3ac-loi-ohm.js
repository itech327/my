/* @meta {"id":"3ac-loi-ohm","level":"3","order":14,"theme":"Électricité","title":"Résistance électrique et loi d'Ohm","ar":"المقاومة الكهربائية وقانون أوم","lead":"On double la tension aux bornes d'un conducteur ohmique : l'intensité double aussi. Tension et intensité sont proportionnelles, et le coefficient s'appelle la résistance."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 50, Y0 = 185, WX = 280, HY = 160; // graphe : I (0 à 0,12 A) en abscisse, U (0 à 12 V) en ordonnée

  function px(I, U) { return [X0 + I / 0.12 * WX, Y0 - U / 12 * HY]; }
  function graphe(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    S('path', { d: 'M' + X0 + ' ' + (Y0 - HY - 6) + ' V' + Y0 + ' H' + (X0 + WX + 6), stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, g);
    T(g, X0 + WX + 6, Y0 - 8, 'I (A)', 'tag', 'end'); T(g, X0 - 6, Y0 - HY - 8, 'U (V)', 'tag', 'start');
    [0, 0.04, 0.08, 0.12].forEach(function (i) { T(g, px(i, 0)[0], Y0 + 14, String(i).replace('.', ','), 'tag'); });
    [0, 4, 8, 12].forEach(function (u) { T(g, X0 - 8, px(0, u)[1] + 4, u, 'tag', 'end'); });
    g.set = function (R, pts, droite, cur) { // pts : liste de U ; droite : afficher la caractéristique ; cur : point courant U
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (droite) { var p = px(0, 0), q = px(Math.min(0.12, 12 / R), Math.min(12, 0.12 * R)); S('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: 'var(--acc)', 'stroke-width': 3 }, dyn); }
      (pts || []).forEach(function (U) { var P = px(U / R, U); S('circle', { cx: P[0], cy: P[1], r: 5, fill: '#e9e9ea' }, dyn); });
      if (cur != null) { var C = px(cur / R, cur); S('path', { d: 'M' + C[0] + ' ' + Y0 + ' V' + C[1] + ' H' + X0, stroke: '#f2c14e', 'stroke-dasharray': '4 4', fill: 'none' }, dyn); S('circle', { cx: C[0], cy: C[1], r: 7, fill: '#f2c14e' }, dyn); }
    };
    return g;
  }
  function f(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toString().replace('.', ','); }

  MV.lesson({
    id: '3ac-loi-ohm',
    objectif: {
      fr: 'Mesurer une résistance, tracer la caractéristique d\'un conducteur ohmique et utiliser la loi d\'Ohm U = R × I.',
      ar: 'قياس مقاومة، ورسم مميزة موصل أومي، واستعمال قانون أوم [[U = R × I]].'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Doubler la tension',
      hud: [['u', 'tension'], ['i', 'intensité'], ['q', 'quel lien ?']],
      draw: function (svg) { var e = {}; e.g = graphe(svg); return e; },
      steps: [
        { cap: 'On applique **3 V** aux bornes d\'un conducteur ohmique : l\'ampèremètre indique **0,03 A**.', hud: { u: ['3 V'], i: ['0,03 A'], q: '–' }, run: function (e) { e.g.set(100, [3], 0, 3); } },
        { cap: 'On passe à **6 V** : l\'intensité devient **0,06 A**.', hud: { u: ['6 V'], i: ['0,06 A'], q: '–' }, run: function (e) { e.g.set(100, [3, 6], 0, 6); } },
        { cap: 'Quel est le lien entre U et I ? On le saura à la fin.', hud: { u: '6 V', i: '0,06 A', q: ['?'] }, run: function (e) { e.g.set(100, [3, 6], 0); } }
      ]
    },

    prepare: [
      ['La tension se mesure en volts avec un voltmètre.', true, 'Branché en dérivation.'],
      ['L\'intensité se mesure en ohms.', false, 'Elle se mesure en ampères (A) ; l\'ohm (Ω) est l\'unité de résistance.'],
      ['Deux grandeurs proportionnelles donnent une droite passant par l\'origine.', true, 'C\'est la clé de la loi d\'Ohm.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'La caractéristique',
      hud: [['n', 'notion'], ['f', 'formule'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.g = graphe(svg); return e; },
      steps: [
        { cap: 'La **résistance** R d\'un conducteur s\'oppose au passage du courant. Elle se mesure en **ohms (Ω)** avec un **ohmmètre**.', ar: 'المقاومة تعيق مرور التيار، وتقاس بالأوم بواسطة الأوممتر.', hud: { n: ['résistance'], f: 'unité : Ω', v: 'R = 100 Ω' }, run: function (e) { e.g.set(100, []); } },
        { cap: 'On mesure U et I pour plusieurs tensions : les points sont **alignés**.', ar: 'نقيس U و I لعدة قيم: النقط مستقيمية.', hud: { n: 'mesures', f: '–', v: '3, 6, 9, 12 V' }, run: function (e) { e.g.set(100, [3, 6, 9, 12]); } },
        { cap: 'La droite passe par l\'origine : U et I sont **proportionnels**. C\'est la **caractéristique** du conducteur ohmique.', ar: 'المستقيم يمر من الأصل: U و I متناسبان. هذه مميزة الموصل الأومي.', hud: { n: ['caractéristique'], f: 'droite par l\'origine', v: 'proportionnels' }, run: function (e) { e.g.set(100, [3, 6, 9, 12], 1); } },
        { cap: '**Loi d\'Ohm** : **U = R × I**. Ici 12 = R × 0,12, donc **R = 100 Ω**.', ar: 'قانون أوم: [[U = R × I]].', hud: { n: ['loi d\'Ohm'], f: ['U = R × I'], v: ['R = 100 Ω'] }, run: function (e) { e.g.set(100, [3, 6, 9, 12], 1, 12); } },
        { cap: 'Plus R est **grande**, plus l\'intensité est **petite** pour une même tension.', ar: 'كلما كبرت المقاومة صغرت شدة التيار بالنسبة لنفس التوتر.', hud: { n: 'comparaison', f: 'I = U / R', v: ['R = 200 Ω : I divisée par 2'] }, run: function (e) { e.g.set(200, [3, 6, 9, 12], 1); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis R et règle U. Obtiens une intensité de 0,06 A avec R = 200 Ω.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Caractéristique U(I)' }, st);
          var g = graphe(svg), R = 100, U = 4, set = MV.hud(c, [['r', 'R'], ['u', 'U'], ['i', 'I = U / R', 1]]);
          function upd() { g.set(R, [], 1, U); set('r', R + ' Ω'); set('u', U + ' V'); set('i', f(U / R, 3) + ' A'); if (R === 200 && U === 12) done(); }
          var row = MV.H('div', 'row', '', c); [100, 200].forEach(function (r) { var b = MV.H('button', 'btn', 'R = ' + r + ' Ω', row); b.onclick = function () { R = r; upd(); }; });
          MV.slider(c, { label: 'tension U (V)', min: 0, max: 12, value: 4 }, function (v) { U = v; upd(); });
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'Un conducteur ohmique de 220 Ω est traversé par un courant de 0,05 A.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. On utilise :', o: ['U = R × I', 'U = R + I'], a: 0 },
            { q: 'Étape 2. U = 220 × 0,05 = ? V', a: 11 },
            { q: 'Étape 3. Sous 22 V, l\'intensité vaudrait ? A', a: 0.1 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'L\'unité de la résistance est :', o: ['l\'ohm (Ω)', 'le volt (V)'], a: 0 },
      { lvl: 'Niveau 2', q: 'R = 50 Ω, I = 0,2 A. U = ? V', a: 10 },
      { lvl: 'Niveau 3', q: 'U = 9 V, R = 300 Ω. I = ? A', a: 0.03 },
      { lvl: 'Niveau 4', q: 'U = 4,5 V, I = 0,015 A. R = ? Ω', a: 300 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le lien entre U et I',
      hud: [['l', 'lien'], ['c', 'coefficient'], ['f', 'formule']],
      draw: function (svg) { var e = {}; e.g = graphe(svg); return e; },
      steps: [
        { cap: 'Tension doublée, intensité doublée : U et I sont **proportionnels**.', hud: { l: ['proportionnels'], c: '–', f: '–' }, run: function (e) { e.g.set(100, [3, 6], 1); } },
        { cap: 'Le coefficient est la **résistance** : U = R × I, avec R = 3 ÷ 0,03 = **100 Ω**.', ar: 'التوتر والشدة متناسبان، ومعامل التناسب هو المقاومة: [[U = R × I]].', hud: { l: 'proportionnels', c: ['R = 100 Ω'], f: ['U = R × I'] }, run: function (e) { e.g.set(100, [3, 6, 9, 12], 1); } }
      ]
    },

    retenir: [
      'La <b>résistance</b> R se mesure en <b>ohms (Ω)</b> avec un ohmmètre. Pour un <b>conducteur ohmique</b>, la caractéristique U(I) est une droite passant par l\'origine.',
      '<b>Loi d\'Ohm</b> : <b class="mono">U = R × I</b> (U en V, R en Ω, I en A). Donc <b class="mono">I = U / R</b> et <b class="mono">R = U / I</b>.'
    ],
    retenirAr: 'المقاومة تقاس بالأوم بواسطة الأوممتر. مميزة الموصل الأومي مستقيم يمر من الأصل. قانون أوم: [[U = R × I]] حيث U بالفولط و R بالأوم و I بالأمبير.',
    voc: [['la résistance', 'المقاومة'], ['un conducteur ohmique', 'موصل أومي'], ['la caractéristique', 'المميزة'], ['un ohmmètre', 'أوممتر'], ['la loi d\'Ohm', 'قانون أوم']]
  });
})();
