/* @meta {"id":"2ac-pyramides-cones","level":"2","order":18,"theme":"Géométrie","title":"Pyramides et cônes de révolution","ar":"الهرم ومخروط الدوران","lead":"On remplit une pyramide d'eau et on la verse dans un prisme de même base et même hauteur. Il faut trois pyramides pour remplir le prisme !"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* prisme (ou cylindre) transparent avec un niveau d'eau, et pyramide (ou cône) à côté */
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (forme, verses) { // forme 'pyramide' ou 'cone' ; verses : nombre de pyramides versées (0 à 3)
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var bx = 200, by = 170, w = 110, h = 120, d = 30, eau = Math.min(3, verses) / 3 * h;
      if (forme === 'cone') {
        S('rect', { x: bx, y: by - eau, width: w, height: eau, fill: 'rgba(127,178,255,.5)' }, dyn);
        S('ellipse', { cx: bx + w / 2, cy: by - h, rx: w / 2, ry: 12, fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
        S('path', { d: 'M' + bx + ' ' + (by - h) + ' V' + by + ' A' + w / 2 + ' 12 0 0 0 ' + (bx + w) + ' ' + by + ' V' + (by - h), fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
        S('path', { d: 'M40 170 A45 10 0 0 0 130 170 L85 50 Z', fill: 'rgba(255,122,47,.35)', stroke: 'var(--acc)', 'stroke-width': 2.5 }, dyn);
        T(dyn, 85, 196, 'cône', 'tag'); T(dyn, bx + w / 2, 196, 'cylindre', 'tag');
      } else {
        S('path', { d: 'M' + bx + ' ' + by + ' h' + w + ' l' + d + ' -' + d + ' v-' + eau + ' l-' + d + ' ' + d + ' h-' + w + ' Z', fill: 'rgba(127,178,255,.5)' }, dyn);
        S('path', { d: 'M' + bx + ' ' + by + ' h' + w + ' v-' + h + ' h-' + w + ' Z M' + (bx + w) + ' ' + by + ' l' + d + ' -' + d + ' v-' + h + ' l-' + d + ' ' + d + ' M' + bx + ' ' + (by - h) + ' l' + d + ' -' + d + ' h' + w, fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
        S('path', { d: 'M30 170 H120 L145 145 M30 170 L85 50 L120 170 M85 50 L145 145', fill: 'rgba(255,122,47,.25)', stroke: 'var(--acc)', 'stroke-width': 2.5 }, dyn);
        S('path', { d: 'M30 170 L55 145 H145 M55 145 L85 50', fill: 'none', stroke: 'var(--acc)', 'stroke-width': 1.5, 'stroke-dasharray': '4 4' }, dyn);
        T(dyn, 88, 196, 'pyramide', 'tag'); T(dyn, bx + w / 2, 196, 'prisme', 'tag');
      }
      T(dyn, 85, 30, verses + ' versée' + (verses > 1 ? 's' : '') + ' sur 3', 'lbl acc');
    };
    return g;
  }

  MV.lesson({
    id: '2ac-pyramides-cones',
    objectif: {
      fr: 'Reconnaître pyramides et cônes de révolution et calculer leur volume V = (B × h) ÷ 3.',
      ar: 'التعرف على الهرم ومخروط الدوران وحساب حجمهما [[V = (B × h) ÷ 3]].'
    },

    ouverture: {
      vb: '0 0 360 205', label: 'Pyramide et prisme',
      hud: [['p', 'pyramide'], ['r', 'prisme'], ['q', 'combien de fois ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Une **pyramide** et un **prisme** de **même base** et de **même hauteur**.', hud: { p: ['même base'], r: ['même hauteur'], q: '–' }, run: function (e) { e.s.set('pyramide', 0); } },
        { cap: 'On remplit la pyramide d\'eau et on la verse dans le prisme.', hud: { p: 'même base', r: 'même hauteur', q: '–' }, run: function (e) { e.s.set('pyramide', 1); } },
        { cap: 'Combien de pyramides faut-il pour remplir le prisme ? On le saura à la fin.', hud: { p: 'même base', r: 'même hauteur', q: ['?'] }, run: function (e) { e.s.set('pyramide', 1); } }
      ]
    },

    prepare: [
      ['Le volume d\'un prisme droit est aire de la base × hauteur.', true, 'V = B × h.'],
      ['Une pyramide a deux bases.', false, 'Elle a une base et un sommet.'],
      ['Un cône de révolution a une base en forme de disque.', true, 'Et un sommet.']
    ],

    regarde: {
      vb: '0 0 360 205', label: 'Le tiers',
      hud: [['s', 'solide'], ['d', 'description'], ['v', 'volume']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Une **pyramide** : une base polygonale, des faces latérales **triangulaires** qui se rejoignent au **sommet**.', ar: 'الهرم: قاعدة مضلعة وأوجه جانبية مثلثة تلتقي في الرأس.', hud: { s: ['pyramide'], d: 'base + faces triangulaires', v: '–' }, run: function (e) { e.s.set('pyramide', 0); } },
        { cap: 'Trois pyramides versées remplissent le prisme : **V = (B × h) ÷ 3**.', ar: 'ثلاثة أهرام تملأ الموشور: [[V = (B × h) ÷ 3]].', hud: { s: 'pyramide', d: '1/3 du prisme', v: ['(B × h) ÷ 3'] }, run: function (e) { e.s.set('pyramide', 3); } },
        { cap: 'Un **cône de révolution** : base en **disque**, sommet au-dessus du centre.', ar: 'مخروط الدوران: قاعدته قرص ورأسه فوق المركز.', hud: { s: ['cône'], d: 'base disque', v: '–' }, run: function (e) { e.s.set('cone', 0); } },
        { cap: 'Même règle : le cône est **le tiers** du cylindre : **V = (π × r² × h) ÷ 3**.', ar: 'حجم المخروط ثلث حجم الأسطوانة: [[V = (π × r² × h) ÷ 3]].', hud: { s: 'cône', d: '1/3 du cylindre', v: ['(π r² h) ÷ 3'] }, run: function (e) { e.s.set('cone', 3); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Verse des pyramides dans le prisme. Combien pour le remplir ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 205', role: 'img', 'aria-label': 'Pyramide et prisme' }, st);
          var s = scene(svg), f = 'pyramide', set = MV.hud(c, [['n', 'versées'], ['r', 'rempli', 1]]), n = 0;
          function upd() { s.set(f, n); set('n', n); set('r', Math.round(n / 3 * 100) + ' %'); if (n === 3) done(); }
          MV.slider(c, { label: 'nombre versé', min: 0, max: 3, value: 0 }, function (v) { n = v; upd(); });
          var row = MV.H('div', 'row', '', c); [['Pyramide et prisme', 'pyramide'], ['Cône et cylindre', 'cone']].forEach(function (x) { var b = MV.H('button', 'btn', x[0], row); b.onclick = function () { f = x[1]; upd(); }; });
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'Une pyramide a une base carrée de 6 cm de côté et une hauteur de 10 cm.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Aire de la base B (cm²) ?', a: 36 },
            { q: 'Étape 2. B × h = ? cm³', a: 360 },
            { q: 'Étape 3. Volume de la pyramide (cm³) ?', a: 120 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'B = 30 cm², h = 5 cm. Volume de la pyramide (cm³) ?', a: 50 },
      { lvl: 'Niveau 2', q: 'Un prisme a un volume de 90 cm³. La pyramide de même base et hauteur (cm³) ?', a: 30 },
      { lvl: 'Niveau 3', q: 'Cône : r = 3 cm, h = 4 cm, π ≈ 3,14. Volume (cm³) ?', a: 37.68, tol: 0.1 },
      { lvl: 'Niveau 4', q: 'Combien de faces latérales a une pyramide à base hexagonale ?', a: 6 }
    ],

    bilan: {
      vb: '0 0 360 205', label: 'Trois pyramides',
      hud: [['n', 'versées'], ['r', 'rapport'], ['f', 'formule']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Il faut **3 pyramides** pour remplir le prisme.', hud: { n: ['3'], r: ['1/3'], f: '–' }, run: function (e) { e.s.set('pyramide', 3); } },
        { cap: 'Le volume d\'une pyramide ou d\'un cône est **le tiers** de celui du prisme ou du cylindre : **V = (B × h) ÷ 3**.', ar: 'حجم الهرم أو المخروط يساوي ثلث حجم الموشور أو الأسطوانة.', hud: { n: '3', r: '1/3', f: ['V = (B × h) ÷ 3'] }, run: function (e) { e.s.set('cone', 3); } }
      ]
    },

    retenir: [
      'Une <b>pyramide</b> a une base polygonale et des faces latérales triangulaires ; un <b>cône de révolution</b> a une base en disque.',
      'Leur volume est le tiers de celui du prisme (ou du cylindre) de même base et même hauteur : <b class="mono">V = (B × h) ÷ 3</b> ; pour le cône, <b class="mono">B = π × r²</b>.'
    ],
    retenirAr: 'للهرم قاعدة مضلعة وأوجه جانبية مثلثة، ولمخروط الدوران قاعدة على شكل قرص. حجمهما [[V = (B × h) ÷ 3]]، ومساحة قاعدة المخروط [[B = π × r²]].',
    voc: [['une pyramide', 'هرم'], ['un cône de révolution', 'مخروط الدوران'], ['le sommet', 'الرأس'], ['la base', 'القاعدة'], ['le volume', 'الحجم']]
  });
})();
