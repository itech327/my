/* @meta {"id":"2ac-air","level":"2","order":1,"theme":"Matière et environnement","title":"L'air qui nous entoure","ar":"الهواء من حولنا","lead":"On peut encore gonfler un ballon déjà rond : l'air est un mélange de gaz, compressible et expansible."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* seringue bouchée avec des particules qui s'agitent ; v = volume en mL (20 à 60) */
  function seringue(svg, y0, opts) {
    opts = opts || {};
    var g = S('g', {}, svg), X0 = 40, K = 4.5, N = opts.n || 24; // 1 mL = 4,5 px
    S('rect', { x: X0 - 8, y: y0 - 2, width: 8, height: 64, fill: '#9aa0a8' }, g);                 // bouchon
    S('rect', { x: X0, y: y0, width: 60 * K + 10, height: 60, fill: 'none', stroke: '#9aa0a8', 'stroke-width': 3 }, g);
    var air = S('rect', { x: X0, y: y0 + 2, width: 0, height: 56, fill: 'var(--acc-bg)' }, g);
    var pist = S('g', {}, g);
    S('rect', { x: 0, y: y0 + 2, width: 8, height: 56, fill: '#cfd3d8' }, pist);
    S('rect', { x: 8, y: y0 + 26, width: 70, height: 8, fill: '#6b6f76' }, pist);
    var ps = [];
    for (var i = 0; i < N; i++) ps.push({ u: Math.random(), w: Math.random(), du: (Math.random() - .5) * .02, dw: (Math.random() - .5) * .02, c: S('circle', { r: 4, fill: opts.mix && i % 5 === 0 ? '#e9e9ea' : 'var(--acc)' }, g) });
    var v = 40, run = true;
    g.vol = function (nv) { v = nv; air.setAttribute('width', v * K); pist.setAttribute('transform', 'translate(' + (X0 + v * K) + ',0)'); };
    function tick() {
      ps.forEach(function (p) {
        p.u += p.du; p.w += p.dw;
        if (p.u < 0 || p.u > 1) { p.du = -p.du; p.u = Math.max(0, Math.min(1, p.u)); }
        if (p.w < 0 || p.w > 1) { p.dw = -p.dw; p.w = Math.max(0, Math.min(1, p.w)); }
        p.c.setAttribute('cx', X0 + 6 + p.u * (v * K - 12)); p.c.setAttribute('cy', y0 + 8 + p.w * 44);
      });
      if (run) requestAnimationFrame(tick);
    }
    g.vol(40); requestAnimationFrame(tick);
    return g;
  }
  /* manomètre : aiguille selon la pression (en bar, 0 à 3) */
  function mano(svg, cx, cy) {
    var g = S('g', {}, svg);
    S('circle', { cx: cx, cy: cy, r: 34, fill: '#17181a', stroke: '#5b6068', 'stroke-width': 2 }, g);
    for (var k = 0; k <= 3; k++) { var a = (-120 + k * 80) * Math.PI / 180; T(g, cx + 24 * Math.sin(a), cy - 24 * Math.cos(a) + 4, k, 'tag'); }
    var h = S('line', { x1: cx, y1: cy, x2: cx, y2: cy - 26, stroke: 'var(--acc)', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    h.style.cssText = 'transition:transform .6s;transform-box:view-box;transform-origin:' + cx + 'px ' + cy + 'px';
    T(g, cx, cy + 50, 'pression (bar)', 'tag');
    g.p = function (p) { h.style.transform = 'rotate(' + (-120 + Math.min(3, p) * 80) + 'deg)'; };
    g.p(1);
    return g;
  }

  MV.lesson({
    id: '2ac-air',
    objectif: {
      fr: 'Connaître la composition de l\'air et expliquer qu\'il est compressible et expansible.',
      ar: 'معرفة مكونات الهواء وتفسير قابليته للانضغاط والتمدد.'
    },

    ouverture: {
      vb: '0 0 360 240', label: 'Un ballon qu\'on gonfle',
      hud: [['b', 'ballon'], ['a', 'air'], ['q', 'question']],
      draw: function (svg) {
        var e = {};
        e.ballon = S('circle', { cx: 180, cy: 110, r: 70, fill: '#e9e9ea', stroke: '#9aa0a8', 'stroke-width': 3 }, svg);
        e.ballon.setAttribute('data-keep', 1); e.ballon.style.transition = 'r .8s, fill .8s';
        e.pompe = S('g', {}, svg);
        S('rect', { x: 290, y: 150, width: 24, height: 70, rx: 4, fill: '#6b6f76' }, e.pompe);
        S('path', { d: 'M302 150 C 302 120, 270 110, 248 110', fill: 'none', stroke: '#9aa0a8', 'stroke-width': 4 }, e.pompe);
        e.q = T(svg, 180, 225, 'Où se met l\'air en plus ?', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'Un ballon de foot est déjà bien **rond**.', hud: { b: ['rond'], a: '–', q: '–' }, run: function (e) { e.ballon.setAttribute('r', 70); } },
        { cap: 'Pourtant, avec la pompe, on fait **entrer encore de l\'air**.', on: ['pompe'], hud: { b: 'rond', a: ['+ air'], q: '–' }, run: function (e) { e.ballon.setAttribute('r', 72); } },
        { cap: 'Il devient plus **dur**, mais garde presque la même taille. **Où** va cet air ?', on: ['pompe', 'q'], hud: { b: ['dur'], a: '+ air', q: ['?'] }, run: function (e) { e.ballon.setAttribute('r', 72); } }
      ]
    },

    prepare: [
      ['L\'air est de la matière.', true, 'Il a une masse et il occupe un volume, même s\'il est invisible.'],
      ['L\'air est un seul gaz : l\'oxygène.', false, 'L\'air est un mélange de plusieurs gaz.'],
      ['Un gaz occupe tout l\'espace qui lui est offert.', true, 'Il n\'a ni forme propre ni volume propre.']
    ],

    regarde: {
      vb: '0 0 360 300', label: 'L\'air dans une seringue bouchée',
      hud: [['v', 'volume'], ['n', 'particules'], ['p', 'pression']],
      draw: function (svg) {
        var e = {};
        e.compo = S('g', {}, svg);
        var cols = [['diazote', 78, 'var(--acc)'], ['dioxygène', 21, '#e9e9ea'], ['autres gaz', 1, '#f2c14e']], n = 0;
        cols.forEach(function (c, j) { for (var i = 0; i < c[1]; i++, n++) S('circle', { cx: 30 + (n % 20) * 15, cy: 30 + Math.floor(n / 20) * 15, r: 5, fill: c[2] }, e.compo); T(e.compo, 40 + j * 110, 120, c[0] + ' ' + c[1] + ' %', 'tag', 'start'); });
        e.ser = seringue(svg, 160); e.mano = mano(svg, 300, 70);
        return e;
      },
      steps: [
        { cap: 'L\'air est un **mélange** de gaz. Sur 100 particules :', ar: 'الهواء خليط من عدة غازات.', on: ['compo'], hud: { v: '–', n: '100', p: '–' } },
        { cap: 'environ **78** de diazote, **21** de dioxygène et 1 d\'autres gaz.', ar: 'حوالي 78% ثنائي الأزوت و 21% ثنائي الأوكسجين و 1% غازات أخرى.', on: ['compo'], hud: { v: '–', n: ['78 + 21 + 1'], p: '–' } },
        { cap: 'Dans une seringue **bouchée**, les particules d\'air bougent sans arrêt.', ar: 'في محقنة مسدودة تتحرك دقائق الهواء باستمرار.', on: ['ser', 'mano'], hud: { v: ['40 mL'], n: '24', p: '1 bar' }, run: function (e) { e.ser.vol(40); e.mano.p(1); } },
        { cap: 'On pousse le piston : le volume diminue. L\'air est **compressible**.', ar: 'ندفع المكبس فيصغر الحجم: الهواء قابل للانضغاط.', on: ['ser', 'mano'], hud: { v: ['20 mL'], n: '24', p: ['2 bar'] }, run: function (e) { e.ser.vol(20); e.mano.p(2); } },
        { cap: 'Même nombre de particules, mais **plus serrées** : la pression augmente.', ar: 'نفس عدد الدقائق لكنها تتقارب، فيرتفع الضغط.', on: ['ser', 'mano'], hud: { v: '20 mL', n: ['24'], p: ['2 bar'] }, run: function (e) { e.ser.vol(20); e.mano.p(2); } },
        { cap: 'On tire le piston : l\'air occupe plus de place. Il est **expansible**.', ar: 'نسحب المكبس فيشغل الهواء حجما أكبر: الهواء قابل للتمدد.', on: ['ser', 'mano'], hud: { v: ['60 mL'], n: '24', p: ['0,7 bar'] }, run: function (e) { e.ser.vol(60); e.mano.p(0.67); } },
        { cap: 'Les particules ne grossissent pas : c\'est l\'**espace entre elles** qui change.', ar: 'الدقائق لا يتغير حجمها، بل المسافة بينها هي التي تتغير.', on: ['ser', 'mano'], hud: { v: '60 mL', n: '24', p: '0,7 bar' }, run: function (e) { e.ser.vol(60); e.mano.p(0.67); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Déplace le piston de la seringue bouchée. Observe la pression et les particules.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Seringue bouchée et manomètre' }, st);
          var s = seringue(svg, 110), m = mano(svg, 300, 50), set;
          MV.slider(c, { label: 'volume', min: 20, max: 60, step: 5, value: 40, fmt: function (v) { return v + ' mL'; } }, function (v) {
            var p = 40 / v; s.vol(v); m.p(p);
            if (set) { set('v', v + ' mL'); set('p', MV.fmt(p, 1) + ' bar'); set('n', '24'); }
          });
          set = MV.hud(c, [['v', 'volume'], ['n', 'particules'], ['p', 'pression', 1]]);
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Valeurs de pression indicatives, à température constante.', c);
          done();
        } },
      { title: 'Résolvons ensemble', intro: 'Explique ce qui se passe quand on comprime l\'air.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Quand on pousse le piston, le nombre de particules d\'air :', o: ['augmente', 'reste le même', 'diminue'], a: 1, e: 'La seringue est bouchée : aucune particule n\'entre ni ne sort.' },
            { type: 'opt', q: 'Étape 2. Ce qui change, c\'est :', o: ['la taille des particules', 'la distance entre les particules', 'la couleur de l\'air'], a: 1, e: 'Les particules se rapprochent.' },
            { q: 'Étape 3. Dans 100 L d\'air, combien de litres de dioxygène environ ?', a: 21, unit: 'L', hint: 'Le dioxygène représente environ 21 % de l\'air.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le gaz le plus abondant dans l\'air est :', o: ['le dioxygène', 'le diazote', 'le dioxyde de carbone'], a: 1, e: 'Environ 78 % de l\'air.' },
      { lvl: 'Niveau 2', q: 'On tire le piston d\'une seringue bouchée. La pression de l\'air :', o: ['augmente', 'diminue', 'ne change pas'], a: 1, e: 'Les particules s\'écartent : la pression diminue.' },
      { lvl: 'Niveau 3', q: 'Une salle contient 200 m³ d\'air. Quel volume de dioxygène environ ?', a: 42, unit: 'm³', hint: '21 % de 200 = 0,21 × 200.' },
      { lvl: 'Niveau 4', q: 'Pourquoi peut-on comprimer l\'air ?', o: ['Les particules d\'air rétrécissent.', 'Il y a beaucoup d\'espace vide entre les particules d\'air.', 'L\'air disparaît quand on le comprime.'], a: 1, e: 'Le modèle particulaire explique la compressibilité.' }
    ],

    bilan: {
      vb: '0 0 360 240', label: 'Le ballon s\'explique',
      hud: [['n', 'particules'], ['v', 'volume'], ['p', 'pression']],
      draw: function (svg) {
        var e = {};
        S('circle', { cx: 180, cy: 110, r: 80, fill: 'none', stroke: '#9aa0a8', 'stroke-width': 3 }, svg);
        e.peu = S('g', {}, svg); e.bcp = S('g', {}, svg);
        for (var i = 0; i < 40; i++) {
          var a = i * 2.39996, r = 68 * Math.sqrt((i + 0.5) / 40);
          S('circle', { cx: 180 + r * Math.cos(a), cy: 110 + r * Math.sin(a), r: 4, fill: 'var(--acc)' }, (i * 7) % 40 < 18 ? e.peu : e.bcp);
        }
        return e;
      },
      steps: [
        { cap: 'Avant : des particules d\'air dans le ballon, assez **écartées**.', on: ['peu'], hud: { n: ['18'], v: 'même', p: '–' } },
        { cap: 'La pompe ajoute des particules dans **le même volume**.', on: ['peu', 'bcp'], hud: { n: ['40'], v: ['même'], p: '–' } },
        { cap: 'Elles sont plus **serrées** : la pression augmente, le ballon devient dur.', ar: 'الدقائق تتقارب فيرتفع الضغط وتصبح الكرة صلبة.', on: ['peu', 'bcp'], hud: { n: '40', v: 'même', p: ['augmente'] } }
      ]
    },

    retenir: [
      'L\'air est un <b>mélange</b> de gaz : environ 78 % de diazote, 21 % de dioxygène et 1 % d\'autres gaz.',
      'L\'air est <b>compressible</b> et <b>expansible</b> : le nombre de particules ne change pas, c\'est la distance entre elles qui change, et donc la pression.'
    ],
    retenirAr: 'الهواء خليط من الغازات: حوالي 78% ثنائي الأزوت و 21% ثنائي الأوكسجين و 1% غازات أخرى. الهواء قابل للانضغاط والتمدد: عدد الدقائق ثابت وتتغير المسافة بينها فيتغير الضغط.',
    voc: [['le diazote', 'ثنائي الأزوت'], ['le dioxygène', 'ثنائي الأوكسجين'], ['compressible', 'قابل للانضغاط'], ['expansible', 'قابل للتمدد'], ['la pression', 'الضغط'], ['la particule', 'الدقيقة']]
  });
})();
