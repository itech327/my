/* @meta {"id":"3ac-agrandissement","level":"3","order":13,"theme":"Géométrie","title":"Volumes, agrandissement et réduction","ar":"الحجوم والتكبير والتصغير","lead":"Un aquarium deux fois plus long, plus large et plus haut contient-il deux fois plus d'eau ? Non : huit fois plus. Le coefficient se met au cube."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* pavé en perspective cavalière, d'arête a (en unités), avec ses petits cubes */
  function cube(g, x, y, n, u, col) {
    var d = u * 0.5, w = n * u, h = n * u, p = n * d;
    S('path', { d: 'M' + x + ' ' + y + ' h' + w + ' v-' + h + ' h-' + w + ' Z', fill: col, stroke: '#141517', 'stroke-width': 1.5 }, g);
    S('path', { d: 'M' + x + ' ' + (y - h) + ' l' + p + ' -' + p + ' h' + w + ' l-' + p + ' ' + p + ' Z', fill: col, opacity: 0.75, stroke: '#141517', 'stroke-width': 1.5 }, g);
    S('path', { d: 'M' + (x + w) + ' ' + y + ' l' + p + ' -' + p + ' v-' + h + ' l-' + p + ' ' + p + ' Z', fill: col, opacity: 0.55, stroke: '#141517', 'stroke-width': 1.5 }, g);
    for (var i = 1; i < n; i++) { S('line', { x1: x + i * u, y1: y, x2: x + i * u, y2: y - h, stroke: 'rgba(0,0,0,.35)' }, g); S('line', { x1: x, y1: y - i * u, x2: x + w, y2: y - i * u, stroke: 'rgba(0,0,0,.35)' }, g); }
  }
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (k, petit) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (petit !== false) { cube(dyn, 30, 180, 1, 32, '#7fb2ff'); T(dyn, 46, 200, 'k = 1', 'tag'); }
      if (k > 1) { var u = k >= 4 ? 26 : 32; cube(dyn, 120, 180, k, u, 'var(--acc)'); T(dyn, 120 + k * u / 2, 200, 'k = ' + k, 'tag'); }
    };
    return g;
  }

  MV.lesson({
    id: '3ac-agrandissement',
    objectif: {
      fr: 'Savoir que dans un agrandissement ou une réduction de rapport k, les longueurs sont multipliées par k, les aires par k² et les volumes par k³.',
      ar: 'معرفة أنه في تكبير أو تصغير نسبته k، تضرب الأطوال في k والمساحات في [[k²]] والحجوم في [[k³]].'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Deux aquariums',
      hud: [['d', 'dimensions'], ['e', 'eau'], ['q', 'combien de fois plus ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Un petit aquarium cubique contient **10 L** d\'eau.', hud: { d: ['×1'], e: ['10 L'], q: '–' }, run: function (e) { e.s.set(1); } },
        { cap: 'On en fabrique un **deux fois plus** long, large et haut.', hud: { d: ['×2'], e: '?', q: '–' }, run: function (e) { e.s.set(2); } },
        { cap: 'Contient-il 20 L ? On le saura à la fin.', hud: { d: '×2', e: '?', q: ['?'] }, run: function (e) { e.s.set(2); } }
      ]
    },

    predire: {
      q: "Un aquarium cubique contient 10 L. On en fabrique un deux fois plus long, plus large et plus haut. Combien de litres contient-il ?",
      ar: "حوض مكعب يسع [[10 L]]. نصنع حوضاً أطول وأعرض وأعلى بمرتين. كم لتراً يسع؟",
      o: ["20 L", "40 L", "80 L"],
      a: 2,
      e: "Les longueurs sont multipliées par 2, les aires par 2² = 4 et les volumes par 2³ = 8. Le nouvel aquarium contient 10 × 8 = 80 L, et non 20 L.",
      ear: "الأطوال ×[[2]]، والمساحات ×[[4]]، والحجوم ×[[8]]: [[10 × 8 = 80 L]]."
    },

    prepare: [
      ['Le volume d\'un cube d\'arête a est a³.', true, 'a × a × a.'],
      ['Un carré de côté doublé a une aire doublée.', false, 'L\'aire est multipliée par 4 : (2a)² = 4a².'],
      ['Dans une réduction, le coefficient k est compris entre 0 et 1.', true, 'Les longueurs diminuent.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Longueurs, aires, volumes',
      hud: [['l', 'longueurs'], ['a', 'aires'], ['v', 'volumes']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Agrandissement de rapport **k = 2** : chaque **longueur** est multipliée par **2**.', ar: 'في تكبير نسبته 2 يضرب كل طول في 2.', hud: { l: ['× 2'], a: '–', v: '–' }, run: function (e) { e.s.set(2); } },
        { cap: 'Une face contient **4** petits carrés : les **aires** sont multipliées par **k² = 4**.', ar: 'تضرب المساحات في [[k² = 4]].', hud: { l: '× 2', a: ['× 4'], v: '–' }, run: function (e) { e.s.set(2); } },
        { cap: 'Le grand cube contient **8** petits cubes : les **volumes** sont multipliés par **k³ = 8**.', ar: 'تضرب الحجوم في [[k³ = 8]].', hud: { l: '× 2', a: '× 4', v: ['× 8'] }, run: function (e) { e.s.set(2); } },
        { cap: 'Avec **k = 3** : longueurs × 3, aires × 9, volumes × **27**.', ar: 'إذا كان [[k = 3]]: الأطوال × 3، المساحات × 9، الحجوم × 27.', hud: { l: '× 3', a: '× 9', v: ['× 27'] }, run: function (e) { e.s.set(3); } },
        { cap: '**Réduction** : 0 < k < 1. Avec k = 1/2, les volumes sont divisés par **8**.', ar: 'في التصغير يكون k بين 0 و 1.', hud: { l: '× 1/2', a: '× 1/4', v: ['× 1/8'] }, run: function (e) { e.s.set(2); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change le rapport k et compte les petits cubes. Trouve k pour 64 petits cubes.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Cubes agrandis' }, st);
          var s = scene(svg), set = MV.hud(c, [['k', 'k'], ['a', 'aire × k²'], ['v', 'volume × k³', 1]]);
          MV.slider(c, { label: 'rapport k', min: 1, max: 4, value: 2 }, function (k) { s.set(k, k < 4); set('k', k); set('a', k * k); set('v', k * k * k); if (k === 4) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Une maquette de pyramide est une réduction de rapport 1/100. Son volume est 0,5 dm³.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Pour passer de la maquette au réel, k =', o: ['100 (agrandissement)', '1/100'], a: 0 },
            { q: 'Étape 2. Les volumes sont multipliés par 100³ = ?', a: 1000000 },
            { q: 'Étape 3. Volume réel : 0,5 × 1 000 000 = ? dm³', a: 500000 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'k = 3. Une longueur de 4 cm devient ? cm', a: 12 },
      { lvl: 'Niveau 2', q: 'k = 3. Une aire de 5 cm² devient ? cm²', a: 45 },
      { lvl: 'Niveau 3', q: 'k = 2. Un volume de 7 cm³ devient ? cm³', a: 56 },
      { lvl: 'Niveau 4', q: 'Réduction k = 1/2 d\'un solide de 40 cm³. Nouveau volume (cm³) ?', a: 5 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le grand aquarium',
      hud: [['k', 'rapport'], ['v', 'volume × k³'], ['e', 'eau']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'k = 2 : le volume est multiplié par **2³ = 8**.', hud: { k: ['2'], v: ['× 8'], e: '–' }, run: function (e) { e.s.set(2); } },
        { cap: 'Le grand aquarium contient **80 L**, pas 20 L.', ar: 'الحوض الكبير يسع 80 لترا، أي ثمانية أضعاف.', hud: { k: '2', v: '× 8', e: ['80 L'] }, run: function (e) { e.s.set(2); } }
      ]
    },

    retenir: [
      'Dans un <b>agrandissement</b> (k &gt; 1) ou une <b>réduction</b> (0 &lt; k &lt; 1) de rapport k : les longueurs sont multipliées par <b>k</b>, les aires par <b>k²</b>, les volumes par <b>k³</b>.',
      'Les angles et la forme sont conservés.'
    ],
    retenirAr: 'في تكبير أو تصغير نسبته k: تضرب الأطوال في k والمساحات في [[k²]] والحجوم في [[k³]]، وتحفظ الزوايا والشكل.',
    voc: [['un agrandissement', 'تكبير'], ['une réduction', 'تصغير'], ['le rapport', 'النسبة'], ['le volume', 'الحجم'], ['l\'aire', 'المساحة']]
  });
})();
