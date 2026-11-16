/* @meta {"id":"1ac-melanges","level":"1","order":5,"theme":"La matière","title":"Les mélanges","ar":"الخلائط","lead":"Une eau boueuse après l'orage : comment la rendre limpide ? Décantation, filtration, puis distillation pour l'eau pure."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* un bécher : eau, boue en suspension, dépôt au fond */
  function becher(svg, X) {
    var g = S('g', { 'data-keep': 1 }, svg);
    var eau = S('rect', { x: X + 4, y: 70, width: 92, height: 106, fill: 'rgba(127,178,255,.35)' }, g);
    var boue = S('g', {}, g), dep = S('rect', { x: X + 4, y: 176, width: 92, height: 0, fill: '#8a6a45' }, g);
    for (var i = 0; i < 26; i++) S('circle', { cx: X + 10 + (i * 37) % 80, cy: 80 + (i * 53) % 90, r: 3, fill: '#8a6a45' }, boue);
    S('path', { d: 'M' + X + ' 50 V180 H' + (X + 100) + ' V50', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 3 }, g);
    eau.style.transition = boue.style.transition = dep.style.transition = 'all 1.2s';
    g.set = function (k) { // 0 trouble, 1 décanté, 2 limpide (filtré)
      boue.style.opacity = k === 0 ? 1 : 0;
      dep.setAttribute('y', k === 1 ? 162 : 176); dep.setAttribute('height', k === 1 ? 14 : 0);
      eau.setAttribute('fill', k === 0 ? 'rgba(160,130,90,.55)' : k === 1 ? 'rgba(150,170,200,.4)' : 'rgba(127,178,255,.35)');
    };
    return g;
  }

  MV.lesson({
    id: '1ac-melanges',
    objectif: {
      fr: 'Distinguer mélange homogène et hétérogène, et séparer les constituants par décantation, filtration et distillation.',
      ar: 'التمييز بين الخليط المتجانس وغير المتجانس، وفصل المكونات بالتصفيق والترشيح والتقطير.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Une eau boueuse',
      hud: [['a', 'aspect'], ['t', 'type'], ['q', 'la rendre limpide ?']],
      draw: function (svg) { var e = {}; e.b = becher(svg, 130); return e; },
      steps: [
        { cap: 'Après l\'orage, on recueille l\'eau d\'une **flaque**.', hud: { a: ['trouble'], t: '–', q: '–' }, run: function (e) { e.b.set(0); } },
        { cap: 'On voit des **grains de terre** dans l\'eau : c\'est un mélange.', hud: { a: 'trouble', t: ['mélange'], q: '–' }, run: function (e) { e.b.set(0); } },
        { cap: 'Comment la rendre **limpide**, puis pure ? On le saura à la fin.', hud: { a: 'trouble', t: 'mélange', q: ['?'] }, run: function (e) { e.b.set(0); } }
      ]
    },

    prepare: [
      ['L\'eau salée est un mélange.', true, 'Elle contient de l\'eau et du sel.'],
      ['Dans l\'eau sucrée, on voit les grains de sucre.', false, 'Le sucre est dissous : on ne le voit plus.'],
      ['Un filtre retient les grosses particules.', true, 'Comme le filtre à café.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Séparer les constituants',
      hud: [['m', 'mélange'], ['t', 'technique'], ['r', 'résultat']],
      draw: function (svg) {
        var e = {}; e.b = becher(svg, 40);
        e.f = S('g', {}, svg); S('path', { d: 'M220 60 L320 60 L280 110 L260 110 Z', fill: '#e9e9ea' }, e.f); S('rect', { x: 265, y: 110, width: 10, height: 30, fill: '#e9e9ea' }, e.f); T(e.f, 270, 50, 'filtre', 'tag');
        e.dist = S('g', {}, svg); S('circle', { cx: 250, cy: 150, r: 26, fill: 'rgba(160,130,90,.55)', stroke: '#e9e9ea', 'stroke-width': 2 }, e.dist); S('path', { d: 'M262 128 L320 80 V150', fill: 'none', stroke: '#7fb2ff', 'stroke-width': 4 }, e.dist); T(e.dist, 250, 196, 'chauffage', 'tag'); T(e.dist, 322, 166, 'eau pure', 'tag');
        return e;
      },
      steps: [
        { cap: 'On distingue les grains à l\'œil nu : mélange **hétérogène**.', ar: 'نميز المكونات بالعين المجردة: خليط غير متجانس.', hud: { m: ['hétérogène'], t: '–', r: 'trouble' }, run: function (e) { e.b.set(0); } },
        { cap: 'On attend : la terre tombe au fond. C\'est la **décantation**.', ar: 'ننتظر فتترسب الأتربة في القعر: هذا هو التصفيق.', hud: { m: 'hétérogène', t: ['décantation'], r: 'dépôt au fond' }, run: function (e) { e.b.set(1); } },
        { cap: 'On verse l\'eau sur un **filtre** : il retient les fines particules. C\'est la **filtration**.', ar: 'نصب الماء على ورق الترشيح فيحتجز الدقائق: هذا هو الترشيح.', on: ['f'], hud: { m: 'hétérogène', t: ['filtration'], r: ['limpide'] }, run: function (e) { e.b.set(2); } },
        { cap: 'L\'eau limpide contient encore des sels dissous : mélange **homogène**.', ar: 'الماء الرائق ما زال يحتوي على أملاح ذائبة: خليط متجانس.', on: ['f'], hud: { m: ['homogène'], t: 'filtration', r: 'limpide, pas pure' }, run: function (e) { e.b.set(2); } },
        { cap: 'On chauffe : la vapeur se condense en **eau pure**. C\'est la **distillation**.', ar: 'نسخن فيتكثف البخار ماء خالصا: هذا هو التقطير.', on: ['dist'], hud: { m: 'homogène', t: ['distillation'], r: ['eau pure'] }, run: function (e) { e.b.set(2); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Applique les techniques dans l\'ordre et regarde l\'eau changer.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Bécher' }, st);
          var b = becher(svg, 130), set = MV.hud(c, [['t', 'technique'], ['a', 'aspect', 1]]), row = MV.H('div', 'row', '', c);
          b.set(0); set('t', '–'); set('a', 'trouble');
          var bt = [['Décanter', 1, 'dépôt au fond'], ['Filtrer', 2, 'limpide']];
          bt.forEach(function (x) { var k = MV.H('button', 'btn', x[0], row); k.onclick = function () { b.set(x[1]); set('t', x[0].toLowerCase()); set('a', x[2]); if (x[1] === 2) done(); }; });
        } },
      { title: 'Résolvons ensemble', intro: 'Choisis la technique adaptée à chaque mélange.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Eau et sable : sable au fond. On sépare par :', o: ['décantation', 'distillation'], a: 0 },
            { type: 'opt', q: 'Étape 2. Thé et feuilles : on utilise :', o: ['un filtre', 'un aimant'], a: 0 },
            { type: 'opt', q: 'Étape 3. Récupérer l\'eau pure de l\'eau salée :', o: ['filtration', 'distillation'], a: 1, e: 'Le sel dissous traverse le filtre.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'L\'huile et l\'eau forment un mélange :', o: ['hétérogène', 'homogène'], a: 0 },
      { lvl: 'Niveau 2', q: 'Le sirop de menthe dans l\'eau est un mélange :', o: ['homogène', 'hétérogène'], a: 0 },
      { lvl: 'Niveau 3', q: 'Après filtration, l\'eau boueuse est :', o: ['limpide mais pas pure', 'pure'], a: 0 },
      { lvl: 'Niveau 4', q: 'On distille 250 mL d\'eau salée et on récupère 240 mL d\'eau. Volume perdu (mL) ?', a: 10, unit: 'mL' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Rendre l\'eau limpide',
      hud: [['1', 'étape 1'], ['2', 'étape 2'], ['3', 'étape 3']],
      draw: function (svg) { var e = {}; e.b = becher(svg, 130); return e; },
      steps: [
        { cap: '**Décantation** puis **filtration** : l\'eau devient limpide.', hud: { 1: ['décantation'], 2: ['filtration'], 3: '–' }, run: function (e) { e.b.set(1); setTimeout(function () { e.b.set(2); }, 1300); } },
        { cap: 'Pour l\'eau **pure**, il faut la **distillation**. L\'eau du robinet, elle, est traitée en usine.', ar: 'الماء الرائق ليس خالصا؛ للحصول على ماء خالص نلجأ إلى التقطير.', hud: { 1: 'décantation', 2: 'filtration', 3: ['distillation'] }, run: function (e) { e.b.set(2); } }
      ]
    },

    retenir: [
      'Mélange <b>hétérogène</b> : on distingue au moins deux constituants à l\'œil nu. Mélange <b>homogène</b> : on n\'en distingue qu\'un.',
      'On sépare par <b>décantation</b> et <b>filtration</b> (mélanges hétérogènes), puis par <b>distillation</b> pour obtenir une eau pure.'
    ],
    retenirAr: 'الخليط غير المتجانس نميز فيه مكونين على الأقل بالعين المجردة، والخليط المتجانس لا نميز فيه إلا مكونا واحدا. نفصل المكونات بالتصفيق والترشيح، ونحصل على الماء الخالص بالتقطير.',
    voc: [['un mélange homogène', 'خليط متجانس'], ['un mélange hétérogène', 'خليط غير متجانس'], ['la décantation', 'التصفيق'], ['la filtration', 'الترشيح'], ['la distillation', 'التقطير']]
  });
})();
