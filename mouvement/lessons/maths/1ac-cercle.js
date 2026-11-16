/* @meta {"id":"1ac-cercle","level":"1","order":13,"theme":"Géométrie","title":"Le cercle","ar":"الدائرة","lead":"Une chèvre attachée à un piquet par une corde de 5 m broute l'herbe autour d'elle. La limite de son pré a une forme bien précise : un cercle."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, O = [180, 105], K = 16; // 1 m = 16 px ; rayon 5 m

  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (o) { // o.disque, o.cercle, o.rayon, o.diam, o.corde, o.p : [distance, angle]
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var R = 5 * K;
      if (o.disque) S('circle', { cx: O[0], cy: O[1], r: R, fill: 'rgba(86,208,127,.18)' }, dyn);
      if (o.cercle) S('circle', { cx: O[0], cy: O[1], r: R, fill: 'none', stroke: 'var(--acc)', 'stroke-width': 3 }, dyn);
      S('circle', { cx: O[0], cy: O[1], r: 4, fill: '#e9e9ea' }, dyn); T(dyn, O[0] - 8, O[1] + 16, 'O', 'lbl', 'end');
      if (o.rayon) { S('line', { x1: O[0], y1: O[1], x2: O[0] + R * 0.8, y2: O[1] - R * 0.6, stroke: '#f2c14e', 'stroke-width': 3 }, dyn); T(dyn, O[0] + 40, O[1] - 36, 'r = 5', 'tag'); }
      if (o.diam) { S('line', { x1: O[0] - R, y1: O[1], x2: O[0] + R, y2: O[1], stroke: '#7fb2ff', 'stroke-width': 3 }, dyn); T(dyn, O[0] - R - 6, O[1] + 4, 'A', 'lbl', 'end'); T(dyn, O[0] + R + 6, O[1] + 4, 'B', 'lbl', 'start'); T(dyn, O[0] + 40, O[1] + 18, 'AB = 10', 'tag'); }
      if (o.corde) { var a1 = 200 * Math.PI / 180, a2 = 300 * Math.PI / 180; S('line', { x1: O[0] + R * Math.cos(a1), y1: O[1] - R * Math.sin(a1), x2: O[0] + R * Math.cos(a2), y2: O[1] - R * Math.sin(a2), stroke: '#e5484d', 'stroke-width': 3 }, dyn); T(dyn, O[0] + 6, O[1] + R - 14, 'corde [CD]', 'tag'); }
      if (o.p) { var d = o.p[0] * K, an = o.p[1] * Math.PI / 180, P = [O[0] + d * Math.cos(an), O[1] - d * Math.sin(an)];
        S('line', { x1: O[0], y1: O[1], x2: P[0], y2: P[1], stroke: '#e9e9ea', 'stroke-dasharray': '4 4' }, dyn);
        S('circle', { cx: P[0], cy: P[1], r: 6, fill: '#e9e9ea' }, dyn); T(dyn, P[0] + 10, P[1] - 6, 'M', 'lbl', 'start'); }
    };
    return g;
  }
  function position(d) { return d < 5 ? 'à l\'intérieur' : d === 5 ? 'sur le cercle' : 'à l\'extérieur'; }

  MV.lesson({
    id: '1ac-cercle',
    objectif: {
      fr: 'Connaître le vocabulaire du cercle (centre, rayon, diamètre, corde), la relation d = 2r, et situer un point par rapport à un cercle.',
      ar: 'معرفة مفردات الدائرة (المركز، الشعاع، القطر، الوتر)، والعلاقة [[d = 2r]]، وتحديد موضع نقطة بالنسبة لدائرة.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'La chèvre et le piquet',
      hud: [['c', 'corde'], ['z', 'zone broutée'], ['q', 'forme de la limite ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Une chèvre est attachée au **piquet O** par une corde de **5 m**.', hud: { c: ['5 m'], z: '–', q: '–' }, run: function (e) { e.s.set({ rayon: 1 }); } },
        { cap: 'Elle broute tout ce qu\'elle peut atteindre.', hud: { c: '5 m', z: ['un disque'], q: '–' }, run: function (e) { e.s.set({ rayon: 1, disque: 1 }); } },
        { cap: 'Quelle est la forme exacte de la **limite** de son pré ? On le saura à la fin.', hud: { c: '5 m', z: 'un disque', q: ['?'] }, run: function (e) { e.s.set({ disque: 1 }); } }
      ]
    },

    prepare: [
      ['On trace un cercle avec un compas.', true, 'La pointe sur le centre, l\'écartement égal au rayon.'],
      ['Tous les points d\'un cercle sont à la même distance du centre.', true, 'Cette distance est le rayon.'],
      ['Le diamètre est la moitié du rayon.', false, 'Le diamètre est le double du rayon.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Le vocabulaire du cercle',
      hud: [['m', 'mot'], ['d', 'définition'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le **cercle** de centre O et de rayon 5 : tous les points situés **à 5 de O**.', ar: 'الدائرة التي مركزها O وشعاعها 5: جميع النقط التي تبعد عن O بالمسافة 5.', hud: { m: ['cercle'], d: 'points à distance r de O', v: 'r = 5' }, run: function (e) { e.s.set({ cercle: 1 }); } },
        { cap: 'Un **rayon** relie le centre à un point du cercle.', ar: 'الشعاع قطعة تصل المركز بنقطة من الدائرة.', hud: { m: ['rayon'], d: 'centre → cercle', v: '5' }, run: function (e) { e.s.set({ cercle: 1, rayon: 1 }); } },
        { cap: 'Un **diamètre** passe par le centre : **d = 2 × r**.', ar: 'القطر يمر من المركز: [[d = 2 × r]].', hud: { m: ['diamètre'], d: 'corde passant par O', v: ['10'] }, run: function (e) { e.s.set({ cercle: 1, diam: 1 }); } },
        { cap: 'Une **corde** relie deux points du cercle. Le diamètre est la plus longue des cordes.', ar: 'الوتر قطعة تصل نقطتين من الدائرة، والقطر أطول الأوتار.', hud: { m: ['corde'], d: 'deux points du cercle', v: '≤ 10' }, run: function (e) { e.s.set({ cercle: 1, diam: 1, corde: 1 }); } },
        { cap: 'Un point M est **à l\'intérieur** si OM < r, **sur** le cercle si OM = r, **à l\'extérieur** si OM > r.', ar: 'تكون النقطة داخل الدائرة إذا كان [[OM < r]]، وعليها إذا كان [[OM = r]]، وخارجها إذا كان [[OM > r]].', hud: { m: ['position'], d: 'comparer OM et r', v: 'OM = 7 : extérieur' }, run: function (e) { e.s.set({ cercle: 1, p: [7, 30] }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Éloigne le point M du centre. Place-le exactement sur le cercle.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Cercle et point M' }, st);
          var s = scene(svg), set = MV.hud(c, [['d', 'OM'], ['p', 'position', 1]]);
          MV.slider(c, { label: 'OM', min: 1, max: 6, value: 2 }, function (d) { s.set({ cercle: 1, disque: 1, p: [d, 40] }); set('d', d); set('p', position(d)); if (d === 5) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Le rayon du cercle vaut 5.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Un cercle a un diamètre de 14 cm.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Son rayon (cm) ?', a: 7 },
            { type: 'opt', q: 'Étape 2. Un point M avec OM = 9 cm est :', o: ['à l\'extérieur', 'à l\'intérieur'], a: 0 },
            { type: 'opt', q: 'Étape 3. Une corde de ce cercle peut-elle mesurer 16 cm ?', o: ['non', 'oui'], a: 0, e: 'La plus longue corde est le diamètre : 14 cm.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Rayon 6 cm. Diamètre (cm) ?', a: 12 },
      { lvl: 'Niveau 2', q: 'Diamètre 9 cm. Rayon (cm) ?', a: 4.5 },
      { lvl: 'Niveau 3', q: 'r = 4 cm et OM = 3 cm. M est :', o: ['à l\'intérieur', 'sur le cercle', 'à l\'extérieur'], a: 0 },
      { lvl: 'Niveau 4', q: 'La plus longue corde d\'un cercle de rayon 8 cm mesure ? cm', a: 16 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le pré de la chèvre',
      hud: [['c', 'centre'], ['r', 'rayon'], ['l', 'limite']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Les points les plus loin qu\'elle atteint sont tous **à 5 m du piquet**.', hud: { c: ['piquet O'], r: ['5 m'], l: '–' }, run: function (e) { e.s.set({ disque: 1, rayon: 1 }); } },
        { cap: 'La limite est le **cercle de centre O et de rayon 5 m** ; le pré est le **disque**.', ar: 'حدود المرعى دائرة مركزها الوتد وشعاعها 5 أمتار، والمرعى هو القرص.', hud: { c: 'piquet O', r: '5 m', l: ['cercle'] }, run: function (e) { e.s.set({ disque: 1, cercle: 1, rayon: 1 }); } }
      ]
    },

    retenir: [
      'Le <b>cercle</b> de centre O et de rayon r est l\'ensemble des points situés à la distance r de O. Le <b>diamètre</b> mesure <b class="mono">d = 2r</b> ; c\'est la plus longue <b>corde</b>.',
      'Un point M est à l\'intérieur si <b class="mono">OM &lt; r</b>, sur le cercle si <b class="mono">OM = r</b>, à l\'extérieur si <b class="mono">OM &gt; r</b>.'
    ],
    retenirAr: 'الدائرة التي مركزها O وشعاعها r هي مجموعة النقط التي تبعد عن O بالمسافة r. القطر [[d = 2r]] وهو أطول وتر.',
    voc: [['un cercle', 'دائرة'], ['le centre', 'المركز'], ['le rayon', 'الشعاع'], ['le diamètre', 'القطر'], ['une corde', 'وتر']]
  });
})();
