/* @meta {"id":"2ac-air-modele","level":"2","order":99,"theme":"Matière et environnement","title":"L'air qui nous entoure (modèle pilote)","ar":"الهواء من حولنا","lead":"On peut encore gonfler un ballon déjà rond : l'air est un mélange de gaz, compressible et expansible."} */
/* MODÈLE PILOTE du club de révision (2AC, premiers cours) : hors mouvement/lessons, donc jamais publié.
   Cibles : « l'air, c'est rien », « l'air = oxygène », « comprimer fait disparaître ou rétrécir les particules », et le calcul d'un pourcentage. */
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
    for (var i = 0; i < N; i++) ps.push({ u: Math.random(), w: Math.random(), du: (Math.random() - .5) * .02, dw: (Math.random() - .5) * .02, c: S('circle', { r: 4, fill: 'var(--acc)' }, g) });
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
    id: '2ac-air-modele',
    objectif: {
      fr: 'Connaître la composition de l\'air, calculer un volume de gaz à partir d\'un pourcentage et expliquer pourquoi l\'air est compressible et expansible.',
      ar: 'معرفة مكونات الهواء، وحساب حجم غاز انطلاقا من نسبة مئوية، وتفسير قابلية الهواء للانضغاط والتمدد.'
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
        { cap: 'Un ballon de foot est déjà bien **rond**.', ar: 'كرة القدم مستديرة ومنفوخة أصلا.', hud: { b: ['rond'], a: '–', q: '–' }, run: function (e) { e.ballon.setAttribute('r', 70); } },
        { cap: 'Pourtant, avec la pompe, on fait **entrer encore de l\'air**.', ar: 'ومع ذلك نستطيع بالمضخة إدخال هواء إضافي.', on: ['pompe'], hud: { b: 'rond', a: ['+ air'], q: '–' }, run: function (e) { e.ballon.setAttribute('r', 72); } },
        { cap: 'Il devient plus **dur**, mais garde presque la même taille. **Devine** : où va cet air ? On répond à la fin.', ar: 'تصبح أصلب لكن حجمها يكاد لا يتغير. خمّن: أين يذهب هذا الهواء؟', on: ['pompe', 'q'], hud: { b: ['dur'], a: '+ air', q: ['?'] }, run: function (e) { e.ballon.setAttribute('r', 72); } }
      ]
    },

    // la première affirmation est un pari ; les suivantes testent « l'air est de la matière » et « un mélange »
    prepare: [
      ['Je parie : si on pousse le piston d\'une seringue bouchée, le nombre de particules d\'air diminue.', false, 'La seringue est bouchée : aucune particule ne peut sortir. Ce qui change, c\'est la distance entre elles. La scène suivante le montre.'],
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
        { cap: 'L\'air est un **mélange** de gaz. Sur 100 particules :', ar: 'الهواء خليط من عدة غازات. من بين 100 دقيقة:', on: ['compo'], hud: { v: '–', n: '100', p: '–' } },
        { cap: 'environ **78** de diazote, **21** de dioxygène et 1 d\'autres gaz.', ar: 'حوالي 78 من ثنائي الأزوت و 21 من ثنائي الأوكسجين و 1 من غازات أخرى.', on: ['compo'], hud: { v: '–', n: ['78 + 21 + 1'], p: '–' } },
        { cap: 'Dans une seringue **bouchée**, les particules d\'air bougent sans arrêt.', ar: 'في محقنة مسدودة تتحرك دقائق الهواء باستمرار.', on: ['ser', 'mano'], hud: { v: ['40 mL'], n: '24', p: '1 bar' }, run: function (e) { e.ser.vol(40); e.mano.p(1); } },
        { cap: 'On pousse le piston : le volume diminue. L\'air est **compressible**.', ar: 'ندفع المكبس فيصغر الحجم: الهواء قابل للانضغاط.', on: ['ser', 'mano'], hud: { v: ['20 mL'], n: '24', p: ['2 bar'] }, run: function (e) { e.ser.vol(20); e.mano.p(2); } },
        { cap: 'Même nombre de particules, mais **plus serrées** : la pression augmente.', ar: 'نفس عدد الدقائق لكنها تتقارب، فيرتفع الضغط.', on: ['ser', 'mano'], hud: { v: '20 mL', n: ['24'], p: ['2 bar'] }, run: function (e) { e.ser.vol(20); e.mano.p(2); } },
        { cap: 'On tire le piston : l\'air occupe plus de place. Il est **expansible**.', ar: 'نسحب المكبس فيشغل الهواء حجما أكبر: الهواء قابل للتمدد.', on: ['ser', 'mano'], hud: { v: ['60 mL'], n: '24', p: ['0,7 bar'] }, run: function (e) { e.ser.vol(60); e.mano.p(0.67); } },
        { cap: 'Les particules ne grossissent pas : c\'est l\'**espace entre elles** qui change.', ar: 'الدقائق لا يتغير حجمها، بل المسافة بينها هي التي تتغير.', on: ['ser', 'mano'], hud: { v: '60 mL', n: '24', p: '0,7 bar' }, run: function (e) { e.ser.vol(60); e.mano.p(0.67); } }
      ]
    },

    faisons: [
      { title: 'J\'explore', intro: 'Déplace le piston de la seringue bouchée. Observe la pression et les particules.',
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
          MV.guide(c, [
            { type: 'opt', q: 'Tu tires le piston : le volume augmente. La pression de l\'air :', shuffle: true, o: ['diminue', 'augmente', 'ne change pas'], a: 0,
              why: [null, 'C\'est l\'effet inverse : quand on comprime, la pression augmente. Ici l\'air a plus de place.', 'Regarde le manomètre : l\'aiguille bouge quand le volume change.'],
              e: 'Les particules sont plus écartées : la pression diminue.' }
          ], done);
        } },

      { title: 'J\'explique la compression', intro: 'Explique ce qui se passe quand on comprime l\'air d\'une seringue bouchée.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Quand on pousse le piston, le nombre de particules d\'air :', shuffle: true, o: ['augmente', 'reste le même', 'diminue'], a: 1,
              why: ['La seringue est bouchée : aucune particule ne peut entrer, donc le nombre n\'augmente pas.', null, 'La seringue est bouchée : aucune particule ne peut sortir, donc le nombre ne diminue pas.'],
              e: 'La seringue est bouchée : aucune particule n\'entre ni ne sort.' },
            { type: 'opt', q: 'Étape 2. Ce qui change, c\'est :', shuffle: true, o: ['la taille des particules', 'la distance entre les particules', 'la couleur de l\'air'], a: 1,
              why: [ 'Les particules ne rétrécissent pas : elles restent les mêmes.', null, 'L\'air n\'a pas de couleur qui change : c\'est un phénomène physique, pas visuel.'], e: 'Les particules se rapprochent.' },
            { type: 'opt', q: 'Étape 3. Quand les particules se rapprochent, elles se heurtent plus souvent aux parois. La pression :', shuffle: true, o: ['augmente', 'diminue', 'ne change pas'], a: 0,
              why: [null, 'Plus de chocs sur la paroi : la pression augmente, elle ne diminue pas.', 'Le manomètre montre bien un changement quand on pousse le piston.'], e: 'Plus de chocs sur les parois : la pression augmente.' }
          ], done);
        } },

      { title: 'Je calcule un volume de gaz', intro: 'Dans 200 L d\'air, quel volume de diazote (78 %) ?',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. 78 % veut dire :', shuffle: true, o: ['78 sur 100', '78 fois plus', '78 de plus'], a: 0,
              why: [null, 'Un pourcentage n\'est pas une multiplication par 78 : c\'est une fraction de 100.', 'Un pourcentage ne s\'ajoute pas : c\'est une fraction de 100.'], e: '78 % = 78/100.' },
            { q: 'Étape 2. Écris 78 % comme un nombre décimal.', a: 0.78, hint: '78/100 = 0,78.',
              diag: [{ v: 78, msg: '78 est le pourcentage. Pour obtenir le décimal, on divise par 100 : 0,78.' }, { v: 7.8, msg: 'Divise par 100, pas par 10 : 78/100 = 0,78.' }], ok: '78 % = 0,78.' },
            { q: 'Étape 3. Volume de diazote dans 200 L d\'air : 0,78 × 200 = ?', a: 156, unit: 'L', hint: '0,78 × 200 = 78 × 2.',
              diag: [{ v: 15600, msg: 'Tu as multiplié 200 par 78 sans diviser par 100. Utilise 0,78.' }, { v: 1.56, msg: 'Tu as trop décalé la virgule : 0,78 × 200 = 156.' }, { v: 122, msg: 'Tu as soustrait (200 − 78). Pour un pourcentage, on multiplie : 0,78 × 200.' }], ok: '0,78 × 200 = 156 L de diazote.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le gaz le plus abondant dans l\'air est :', o: ['le dioxygène', 'le diazote', 'le dioxyde de carbone'], a: 1, shuffle: true,
        why: ['On respire le dioxygène, mais il ne représente qu\'environ 21 % de l\'air.', null, 'Le dioxyde de carbone est présent en très petite quantité : bien moins de 1 %.'], e: 'Environ 78 % de l\'air.' },
      { lvl: 'Niveau 2', q: 'On tire le piston d\'une seringue bouchée. La pression de l\'air :', o: ['augmente', 'diminue', 'ne change pas'], a: 1, shuffle: true,
        why: ['C\'est l\'effet de la compression. Ici le volume augmente : les particules s\'écartent.', null, 'La pression change : les particules sont plus écartées, donc elles heurtent moins souvent la paroi.'], e: 'Les particules s\'écartent : la pression diminue.' },
      { lvl: 'Niveau 3', q: 'Une salle contient 200 m³ d\'air. Quel volume de dioxygène (21 %) environ ?', a: 42, unit: 'm³', hint: '21 % de 200 = 0,21 × 200.',
        diag: [{ v: 4200, msg: 'Tu as multiplié 200 par 21 sans diviser par 100. 21 % = 0,21.' }, { v: 4.2, msg: 'Tu as trop décalé la virgule : 0,21 × 200 = 42.' }, { v: 179, msg: 'Tu as soustrait (200 − 21). Pour un pourcentage, on multiplie : 0,21 × 200.' }, { v: 221, msg: 'Tu as additionné. Pour un pourcentage, on multiplie : 0,21 × 200.' }], ok: '0,21 × 200 = 42 m³.' },
      { lvl: 'Niveau 4', q: 'Pourquoi peut-on comprimer l\'air ?', o: ['Les particules d\'air rétrécissent.', 'Il y a beaucoup d\'espace vide entre les particules d\'air.', 'L\'air disparaît quand on le comprime.'], a: 1, shuffle: true,
        why: ['Les particules gardent la même taille : ce sont les distances qui changent.', null, 'Rien ne disparaît : la seringue est bouchée et le nombre de particules est le même.'], e: 'Le modèle particulaire explique la compressibilité.' }
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
        { cap: 'Retour au ballon. Avant : des particules d\'air, assez **écartées**.', ar: 'نعود إلى الكرة: قبل الضخ، دقائق الهواء متباعدة نسبيا.', on: ['peu'], hud: { n: ['18'], v: 'presque le même', p: '–' } },
        { cap: 'La pompe ajoute des particules dans **presque le même volume**.', ar: 'تضيف المضخة دقائق في حجم يكاد يبقى نفسه.', on: ['peu', 'bcp'], hud: { n: ['40'], v: ['presque le même'], p: '–' } },
        { cap: 'Elles sont plus **serrées** : la pression augmente, le ballon devient dur. C\'est ta réponse ?', ar: 'الدقائق تتقارب فيرتفع الضغط وتصبح الكرة صلبة. هل هذا جوابك؟', on: ['peu', 'bcp'], hud: { n: '40', v: 'presque le même', p: ['augmente'] } }
      ]
    },

    defi: [
      { q: 'Dans 500 L d\'air, quel volume de dioxygène (21 %) environ ?', unit: 'L', a: 105, diag: [{ v: 10500, msg: 'Tu as multiplié 500 par 21 sans diviser par 100. 21 % = 0,21.' }, { v: 10.5, msg: 'Tu as trop décalé la virgule : 0,21 × 500 = 105.' }, { v: 479, msg: 'Tu as soustrait (500 − 21). Pour un pourcentage, on multiplie.' }] },
      { q: 'Dans 50 L d\'air, quel volume de diazote (78 %) environ ?', unit: 'L', a: 39, diag: [{ v: 3900, msg: 'Tu as multiplié 50 par 78 sans diviser par 100. 78 % = 0,78.' }, { v: 3.9, msg: 'Tu as trop décalé la virgule : 0,78 × 50 = 39.' }] },
      { q: 'Un ballon gonflé à la pompe est posé sur une balance, puis dégonflé. La balance indique :', o: ['une masse plus grande quand il est gonflé', 'la même masse', 'une masse plus petite quand il est gonflé'], a: 0, shuffle: true,
        why: [null, 'L\'air est de la matière : il a une masse, donc l\'air ajouté se voit sur la balance.', 'C\'est l\'inverse : en ajoutant de l\'air, on ajoute de la matière.'], e: 'L\'air a une masse : le ballon gonflé est un peu plus lourd.' }
    ],

    retenir: [
      'L\'air est un <b>mélange</b> de gaz : environ 78 % de diazote, 21 % de dioxygène et 1 % d\'autres gaz. L\'air est de la matière : il a une masse.',
      'L\'air est <b>compressible</b> et <b>expansible</b> : le nombre de particules ne change pas, c\'est la distance entre elles qui change, donc la pression.',
      'Pour trouver le volume d\'un gaz dans l\'air : volume de gaz = pourcentage (en décimal) × volume d\'air. Exemple : 21 % de 200 L = 0,21 × 200 = 42 L.'
    ],
    retenirAr: 'الهواء خليط من الغازات: حوالي 78% ثنائي الأزوت و 21% ثنائي الأوكسجين و 1% غازات أخرى، والهواء مادة لها كتلة. الهواء قابل للانضغاط والتمدد: عدد الدقائق ثابت وتتغير المسافة بينها فيتغير الضغط. حجم الغاز = النسبة (عددا عشريا) × حجم الهواء: [[21% × 200 L = 0,21 × 200 = 42 L]].',
    voc: [['le diazote', 'ثنائي الأزوت'], ['le dioxygène', 'ثنائي الأوكسجين'], ['compressible', 'قابل للانضغاط'], ['expansible', 'قابل للتمدد'], ['la pression', 'الضغط'], ['la particule', 'الدقيقة'], ['un mélange', 'خليط']]
  });
})();
