/* @meta {"id":"3ac-hydro-eolien","level":"3","order":12,"theme":"Énergies renouvelables","title":"Hydroélectricité et éolien","ar":"الطاقة الكهرومائية والريحية","lead":"Le barrage retient l’eau en hauteur ; à Tarfaya, 131 éoliennes tournent face à l’océan. Dans les deux cas, un mouvement devient de l’électricité. Comment ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  function puissance(v) { return v < 3 || v > 25 ? 0 : v >= 12 ? 2.3 : 2.3 * (v * v * v - 27) / (1728 - 27); }
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function flux(path, col, n, dur) { for (var i = 0; i < n; i++) { var c = S('circle', { r: 3.5, fill: col }, dyn); S('animateMotion', { dur: dur, begin: (i * 0.3) + 's', repeatCount: 'indefinite', path: path }, c); } }
    function hydro(o) {
      S('path', { d: 'M10 60H110V150H10Z', fill: '#1d3550' }, dyn);
      S('path', { d: 'M110 40L130 40L150 170L110 170Z', fill: '#26292d', stroke: '#9aa0a8', 'stroke-width': 2 }, dyn);
      T(dyn, 60, 52, 'réservoir', 'tag');
      S('path', { d: 'M100 140L210 170', stroke: '#9aa0a8', 'stroke-width': 6, fill: 'none' }, dyn);
      S('circle', { cx: 222, cy: 172, r: 14, fill: 'var(--acc-bg)', stroke: 'var(--acc)', 'stroke-width': 2.5 }, dyn);
      var t = S('path', { d: 'M222 160V184M210 172H234', stroke: '#fff', 'stroke-width': 2.5 }, dyn);
      S('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 222 172', to: (o.step ? -360 : 360) + ' 222 172', dur: '1s', repeatCount: 'indefinite' }, t);
      T(dyn, 222, 200, o.step ? 'pompe' : 'turbine', 'tag');
      S('rect', { x: 250, y: 160, width: 34, height: 24, rx: 4, fill: '#1d1f22', stroke: '#56d07f', 'stroke-width': 2 }, dyn);
      T(dyn, 267, 176, 'G', 'lbl');
      S('path', { d: 'M284 170H300V60H330', stroke: '#f2c14e', 'stroke-width': 2, fill: 'none' }, dyn);
      T(dyn, 316, 52, 'réseau', 'tag');
      S('path', { d: 'M236 172H250', stroke: '#9aa0a8', 'stroke-width': 4 }, dyn);
      if (o.step) { flux('M210 170L100 140', '#7fb2ff', 3, '1.2s'); T(dyn, 210, 28, 'la nuit : on remonte l’eau', 'tag'); flux('M330 60H300V170H284', '#f2c14e', 2, '1.2s'); }
      else { flux('M100 140L210 170', '#7fb2ff', 3, '1.2s'); flux('M284 170H300V60H330', '#f2c14e', 2, '1.2s'); }
      if (o.h) { S('path', { d: 'M170 62V170M164 62H176M164 170H176', stroke: '#9aa0a8', 'stroke-width': 1.2 }, dyn); T(dyn, 178, 110, 'hauteur de chute', 'tag', 'start'); }
    }
    function eolienne(v, courbe) {
      var cx = courbe ? 70 : 150, cy = 70, p = puissance(v);
      S('path', { d: 'M' + (cx - 5) + ' 196L' + (cx - 2) + ' ' + cy + 'H' + (cx + 2) + 'L' + (cx + 5) + ' 196Z', fill: '#9aa0a8' }, dyn);
      S('rect', { x: cx - 4, y: cy - 8, width: 34, height: 16, rx: 5, fill: '#26292d', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
      var rot = S('g', {}, dyn);
      [0, 120, 240].forEach(function (a) { S('path', { d: 'M' + cx + ' ' + cy + 'L' + (cx - 5) + ' ' + (cy - 54) + 'Q' + cx + ' ' + (cy - 60) + ' ' + (cx + 4) + ' ' + (cy - 54) + 'Z', fill: '#e9e9ea', transform: 'rotate(' + a + ' ' + cx + ' ' + cy + ')' }, rot); });
      S('circle', { cx: cx, cy: cy, r: 5, fill: 'var(--acc)' }, rot);
      if (p > 0) S('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 ' + cx + ' ' + cy, to: '360 ' + cx + ' ' + cy, dur: (8 / Math.max(v, 3)).toFixed(2) + 's', repeatCount: 'indefinite' }, rot);
      if (v > 0) for (var i = 0; i < 3; i++) {
        var w = S('path', { d: 'M0 0H18', stroke: '#7fb2ff', 'stroke-width': 2 }, dyn);
        S('animateMotion', { dur: (30 / Math.max(v, 2)).toFixed(2) + 's', begin: (i * .4) + 's', repeatCount: 'indefinite', path: 'M-20 ' + (40 + i * 30) + 'H' + (cx - 30) }, w);
      }
      if (!courbe) {
        T(dyn, cx + 36, cy + 4, 'nacelle', 'tag', 'start');
        T(dyn, cx - 60, cy + 70, 'pales', 'tag');
        return;
      }
      // courbe de puissance
      var X = function (u) { return 150 + u * 6.4; }, Y = function (q) { return 170 - q * 50; }, d = 'M' + X(0) + ' ' + Y(0);
      for (var u = 0; u <= 30; u += .5) d += 'L' + X(u).toFixed(1) + ' ' + Y(puissance(u)).toFixed(1);
      S('path', { d: 'M150 170H346M150 170V44', stroke: '#5b6068', 'stroke-width': 1.5 }, dyn);
      S('path', { d: d, stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, dyn);
      S('circle', { cx: X(Math.min(v, 30)), cy: Y(p), r: 6, fill: 'var(--acc)' }, dyn);
      T(dyn, 152, 38, 'P (MW)', 'tag', 'start'); T(dyn, 346, 204, 'vent (m/s)', 'tag', 'end');
      T(dyn, X(12), Y(2.3) - 10, '2,3', 'tag'); T(dyn, X(3), 186, '3', 'tag'); T(dyn, X(12), 186, '12', 'tag'); T(dyn, X(25), 186, '25', 'tag');
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.v != null) eolienne(o.v, o.courbe); else hydro(o);
    };
    return g;
  }

  MV.lesson({
    id: '3ac-hydro-eolien',
    objectif: {
      fr: 'Décrire la conversion d’énergie dans une centrale hydraulique et dans une éolienne, comprendre le stockage par pompage (STEP), et calculer une puissance et une énergie.',
      ar: 'وصف تحويل الطاقة في محطة كهرومائية وفي عنفة ريحية، وفهم التخزين بالضخ، وحساب القدرة والطاقة.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Eau et vent',
      hud: [['s', 'source'], ['m', 'mouvement'], ['e', 'électricité']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'L’eau du barrage descend et fait **tourner** une roue.', hud: { s: ['eau'], m: ['rotation'], e: '?' }, run: function (e) { e.s.set({}); } },
        { cap: 'Le vent fait **tourner** les pales d’une éolienne.', hud: { s: ['vent'], m: ['rotation'], e: '?' }, run: function (e) { e.s.set({ v: 10 }); } },
        { cap: 'Dans les deux cas, une **rotation** devient de l’électricité. Par quelle machine ?', hud: { s: 'eau, vent', m: 'rotation', e: ['?'] }, run: function (e) { e.s.set({ v: 12 }); } }
      ]
    },

    prepare: [
      ['Une dynamo de vélo produit du courant quand la roue tourne.', true, 'C’est un petit alternateur.'],
      ['L’eau d’un barrage ne peut servir qu’une seule fois.', false, 'On peut la remonter et la réutiliser : c’est la STEP.'],
      ['Plus le vent est fort, plus une éolienne peut produire, jusqu’à une limite.', true, 'Au-delà d’un vent trop fort, elle s’arrête.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Centrale hydraulique et éolienne',
      hud: [['m', 'machine'], ['c', 'conversion'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'L’eau stockée **en hauteur** possède de l’énergie. Plus la chute est haute, plus elle en a.', ar: 'الماء المخزن في الأعلى يملك طاقة، وكلما كان السقوط أعلى كانت أكبر.', hud: { m: 'barrage', c: ['énergie de position'], v: 'hauteur' }, run: function (e) { e.s.set({ h: 1 }); } },
        { cap: 'Elle descend par la conduite forcée, fait tourner la **turbine** ; l’**alternateur** G produit l’électricité.', ar: 'ينزل الماء عبر الأنبوب فيدير العنفة، والمولد ينتج الكهرباء.', hud: { m: ['turbine + alternateur'], c: ['mécanique → électrique'], v: '–' }, run: function (e) { e.s.set({}); } },
        { cap: '**STEP** : la nuit, quand on consomme peu, on **pompe** l’eau vers le haut pour la réutiliser. Exemple : Afourer.', ar: 'محطة التحويل بالضخ: ليلا نضخ الماء إلى الأعلى لإعادة استعماله، مثل محطة أفورار.', hud: { m: ['pompe'], c: 'stocker', v: 'Afourer' }, run: function (e) { e.s.set({ step: 1 }); } },
        { cap: 'Éolienne : le vent fait tourner les **pales** ; le **multiplicateur** accélère, l’**alternateur** produit.', ar: 'العنفة الريحية: الرياح تدير الشفرات، والمضاعف يسرع الدوران، والمولد ينتج الكهرباء.', hud: { m: ['pales, multiplicateur'], c: ['vent → électrique'], v: '–' }, run: function (e) { e.s.set({ v: 10 }); } },
        { cap: 'Elle démarre vers **3 m/s**, atteint sa puissance nominale vers **12 m/s**, s’arrête au-delà de **25 m/s**.', ar: 'تبدأ عند حوالي 3 m/s، وتبلغ قدرتها الاسمية عند 12 m/s، وتتوقف فوق 25 m/s.', hud: { m: 'éolienne', c: 'courbe de puissance', v: ['2,3 MW'] }, run: function (e) { e.s.set({ v: 14, courbe: 1 }); } },
        { cap: 'Tarfaya : **131** éoliennes de **2,3 MW**, soit environ **301 MW**.', ar: 'طرفاية: 131 عنفة بقدرة 2,3 MW، أي حوالي 301 MW.', hud: { m: 'parc de Tarfaya', c: ['131 × 2,3'], v: ['≈ 301 MW'] }, run: function (e) { e.s.set({ v: 12 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Règle la vitesse du vent. Amène l’éolienne à sa puissance nominale.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Éolienne et courbe de puissance' }, st);
          var s = scene(svg), set = MV.hud(c, [['v', 'vent'], ['p', 'puissance', 1], ['e', 'état']]);
          MV.slider(c, { label: 'vent', min: 0, max: 30, value: 2, fmt: function (v) { return v + ' m/s'; } }, function (v) {
            var p = puissance(v); s.set({ v: v, courbe: 1 }); set('v', v + ' m/s'); set('p', MV.fmt(p, 2) + ' MW');
            set('e', v < 3 ? 'trop faible' : v > 25 ? 'arrêt de sécurité' : p >= 2.3 ? 'nominale' : 'en marche');
            if (v >= 12 && v <= 25) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Le parc éolien de Tarfaya.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. 131 éoliennes de 2,3 MW. Puissance totale (MW) ? Arrondis à l’unité.', a: 301, tol: 1 },
            { q: 'Étape 2. Une éolienne de 2 MW tourne à pleine puissance pendant 10 h. Énergie (MWh) ?', a: 20, hint: 'E = P × t' },
            { type: 'opt', q: 'Étape 3. Le vent souffle à 30 m/s. L’éolienne :', o: ['se met en sécurité et s’arrête', 'produit encore plus'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Dans une centrale hydraulique, l’eau fait tourner :', o: ['une turbine', 'un panneau solaire'], a: 0 },
      { lvl: 'Niveau 2', q: 'Dans une éolienne, le multiplicateur :', o: ['augmente la vitesse de rotation', 'stocke l’électricité'], a: 0 },
      { lvl: 'Niveau 3', q: '3 MW pendant 4 h. Énergie (MWh) ?', a: 12 },
      { lvl: 'Niveau 4', q: 'Une STEP utilise 100 MWh la nuit pour pomper et rend 75 MWh le jour. Rendement (%) ?', a: 75 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'L’alternateur',
      hud: [['s', 'source'], ['m', 'mouvement'], ['e', 'électricité']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'L’eau fait tourner la turbine, qui entraîne l’**alternateur**.', hud: { s: 'eau', m: 'turbine', e: ['alternateur'] }, run: function (e) { e.s.set({}); } },
        { cap: 'Le vent fait tourner les pales ; le multiplicateur entraîne aussi un **alternateur**.', ar: 'الرياح تدير الشفرات، والمضاعف يدير بدوره مولدا.', hud: { s: 'vent', m: 'pales', e: ['alternateur'] }, run: function (e) { e.s.set({ v: 12 }); } }
      ]
    },

    retenir: [
      'Centrale hydraulique : eau en hauteur → <b>turbine</b> → <b>alternateur</b> → électricité. La <b>STEP</b> remonte l’eau par pompage quand on consomme peu, pour stocker l’énergie.',
      'Éolienne : vent → <b>pales</b> → <b>multiplicateur</b> → <b>alternateur</b>. Elle démarre vers 3 m/s et s’arrête au-delà de 25 m/s. Énergie : <b class="mono">E = P × t</b> (MW × h = MWh).'
    ],
    retenirAr: 'المحطة الكهرومائية: ماء في الأعلى ثم عنفة ثم مولد. محطة الضخ تعيد رفع الماء لتخزين الطاقة. العنفة الريحية: رياح ثم شفرات ثم مضاعف ثم مولد. الطاقة [[E = P × t]].',
    voc: [['une turbine', 'عنفة'], ['un alternateur', 'مولد'], ['une éolienne', 'عنفة ريحية'], ['un barrage', 'سد'], ['le multiplicateur', 'المضاعف']]
  });
})();
