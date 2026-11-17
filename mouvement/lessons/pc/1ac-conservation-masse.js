/* @meta {"id":"1ac-conservation-masse","level":"1","order":15,"theme":"La matière","title":"Conservation de la masse lors des transformations physiques","ar":"انحفاظ الكتلة خلال التحولات الفيزيائية","lead":"Une bouteille d'eau oubliée au congélateur a éclaté. L'eau a pris plus de place… mais pèse-t-elle plus lourd ? On pèse avant et après."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* balance électronique avec un récipient ; contenu : 'eau', 'glace', 'sucre+eau', 'solution' */
  function balance(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('rect', { x: 90, y: 160, width: 180, height: 30, rx: 6, fill: '#2a2d33', stroke: '#9aa0a8' }, g);
    var dyn = S('g', {}, g);
    g.set = function (etat, masse, vol) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      S('rect', { x: 110, y: 166, width: 70, height: 18, rx: 3, fill: '#0f1a14' }, dyn); T(dyn, 145, 180, masse + ' g', 'lbl acc');
      var h = vol * 0.4;
      if (etat === 'glace') S('rect', { x: 150, y: 158 - h, width: 60, height: h, fill: 'rgba(220,240,255,.7)', stroke: '#e9e9ea' }, dyn);
      else S('rect', { x: 150, y: 158 - h, width: 60, height: h, fill: etat === 'solution' ? 'rgba(200,220,255,.45)' : 'rgba(127,178,255,.45)' }, dyn);
      S('path', { d: 'M148 60 V158 H212 V60', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
      if (etat === 'sucre+eau') { S('rect', { x: 230, y: 140, width: 26, height: 18, fill: '#f2f2f2' }, dyn); T(dyn, 243, 132, 'sucre', 'tag'); }
      T(dyn, 300, 100, 'V = ' + vol + ' mL', 'tag', 'end');
      T(dyn, 300, 80, etat === 'glace' ? 'glace' : etat === 'solution' ? 'eau sucrée' : 'eau liquide', 'lbl', 'end');
    };
    return g;
  }

  MV.lesson({
    id: '1ac-conservation-masse',
    objectif: {
      fr: 'Savoir que la masse se conserve lors d\'un changement d\'état ou d\'une dissolution, alors que le volume peut varier.',
      ar: 'معرفة أن الكتلة تنحفظ خلال تغير الحالة أو الذوبان، بينما قد يتغير الحجم.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'La bouteille éclatée',
      hud: [['a', 'avant'], ['p', 'après'], ['q', 'plus lourde ?']],
      draw: function (svg) { var e = {}; e.b = balance(svg); return e; },
      steps: [
        { cap: 'On met une bouteille pleine d\'eau liquide au **congélateur**.', hud: { a: ['eau liquide'], p: '–', q: '–' }, run: function (e) { e.b.set('eau', 200, 200); } },
        { cap: 'Le lendemain, la glace a fait **éclater** la bouteille : elle prend plus de place.', hud: { a: 'eau liquide', p: ['glace, plus de volume'], q: '–' }, run: function (e) { e.b.set('glace', 200, 218); } },
        { cap: 'La glace pèse-t-elle plus lourd que l\'eau de départ ? On le saura à la fin.', hud: { a: 'eau liquide', p: 'glace', q: ['?'] }, run: function (e) { e.b.set('glace', '?', 218); } }
      ]
    },

    prepare: [
      ['Le volume s\'exprime en litres ou en mL.', true, 'Et la masse en grammes ou en kilogrammes.'],
      ['La glace flotte sur l\'eau.', true, 'Pour la même masse, elle occupe plus de volume.'],
      ['Quand le sucre se dissout, il disparaît et ne pèse plus rien.', false, 'Il est toujours là : la masse se conserve.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'On pèse',
      hud: [['t', 'transformation'], ['m', 'masse'], ['v', 'volume']],
      draw: function (svg) { var e = {}; e.b = balance(svg); return e; },
      steps: [
        { cap: '200 g d\'eau liquide occupent **200 mL**.', ar: '200 غرام من الماء السائل تشغل 200 ملليلتر.', hud: { t: 'liquide', m: '200 g', v: '200 mL' }, run: function (e) { e.b.set('eau', 200, 200); } },
        { cap: 'Après **solidification** : la masse reste **200 g**, mais le volume passe à **218 mL** environ.', ar: 'بعد التجمد تبقى الكتلة 200 غرام ويزداد الحجم.', hud: { t: ['solidification'], m: ['200 g'], v: ['≈ 218 mL'] }, run: function (e) { e.b.set('glace', 200, 218); } },
        { cap: 'Après **fusion**, on retrouve 200 g et 200 mL. La **masse se conserve** lors d\'un changement d\'état.', ar: 'تنحفظ الكتلة خلال تغير الحالة الفيزيائية.', hud: { t: ['fusion'], m: '200 g', v: '200 mL' }, run: function (e) { e.b.set('eau', 200, 200); } },
        { cap: '**Dissolution** : 200 g d\'eau + 20 g de sucre pesés ensemble = **220 g**.', ar: 'الذوبان: 200 غرام من الماء و20 غراما من السكر.', hud: { t: ['avant dissolution'], m: '220 g', v: '–' }, run: function (e) { e.b.set('sucre+eau', 220, 200); } },
        { cap: 'Après dissolution, la balance indique toujours **220 g** : le sucre est invisible mais toujours là.', ar: 'بعد الذوبان تبقى الكتلة 220 غراما: الكتلة تنحفظ.', hud: { t: ['après dissolution'], m: ['220 g'], v: 'à peine changé' }, run: function (e) { e.b.set('solution', 220, 212); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Fais passer l\'eau d\'un état à l\'autre et lis la balance.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Balance et récipient' }, st);
          var b = balance(svg), vu = {}, set = MV.hud(c, [['e', 'état'], ['m', 'masse', 1], ['v', 'volume']]), row = MV.H('div', 'row', '', c);
          [['Congeler', 'glace', 218], ['Faire fondre', 'eau', 200]].forEach(function (x) { var bt = MV.H('button', 'btn', x[0], row); bt.onclick = function () { b.set(x[1], 200, x[2]); set('e', x[1] === 'glace' ? 'solide' : 'liquide'); set('m', '200 g'); set('v', x[2] + ' mL'); vu[x[1]] = 1; if (vu.glace && vu.eau) done(); }; });
          b.set('eau', 200, 200); set('e', 'liquide'); set('m', '200 g'); set('v', '200 mL');
        } },
      { title: 'Résolvons ensemble', intro: 'On dissout 15 g de sel dans 250 g d\'eau.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Masse de la solution (g) ?', a: 265 },
            { type: 'opt', q: 'Étape 2. Le sel dissous :', o: ['est toujours présent', 'a disparu'], a: 0 },
            { type: 'opt', q: 'Étape 3. On fait geler 250 g d\'eau. La glace pèse :', o: ['exactement 250 g', 'plus de 250 g'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Lors d\'un changement d\'état, la masse :', o: ['se conserve', 'augmente'], a: 0 },
      { lvl: 'Niveau 2', q: 'Lors de la solidification de l\'eau, le volume :', o: ['augmente', 'diminue'], a: 0 },
      { lvl: 'Niveau 3', q: '300 g d\'eau et 25 g de sucre. Masse de l\'eau sucrée (g) ?', a: 325 },
      { lvl: 'Niveau 4', q: '1 L d\'eau donne environ 1,09 L de glace. Volume de glace pour 2 L d\'eau (L) ?', a: 2.18 }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'La glace pèse-t-elle plus ?',
      hud: [['m', 'masse'], ['v', 'volume'], ['c', 'conclusion']],
      draw: function (svg) { var e = {}; e.b = balance(svg); return e; },
      steps: [
        { cap: 'La balance indique **200 g** avant et après congélation.', hud: { m: ['200 g'], v: '–', c: '–' }, run: function (e) { e.b.set('glace', 200, 218); } },
        { cap: 'La masse est **conservée** ; seul le **volume** a augmenté, assez pour faire éclater la bouteille.', ar: 'الكتلة انحفظت، أما الحجم فقد ازداد بما يكفي لتنكسر القارورة.', hud: { m: '200 g', v: ['augmente'], c: ['masse conservée'] }, run: function (e) { e.b.set('glace', 200, 218); } }
      ]
    },

    retenir: [
      'Lors d\'un <b>changement d\'état</b> (fusion, solidification, vaporisation…) ou d\'une <b>dissolution</b>, la <b>masse se conserve</b>.',
      'Le <b>volume</b>, lui, peut varier : l\'eau qui gèle occupe un volume plus grand (environ 9 % de plus).'
    ],
    retenirAr: 'خلال تغير الحالة الفيزيائية أو الذوبان تنحفظ الكتلة، أما الحجم فقد يتغير: الماء عندما يتجمد يشغل حجما أكبر.',
    voc: [['la masse', 'الكتلة'], ['le volume', 'الحجم'], ['la conservation', 'الانحفاظ'], ['la solidification', 'التجمد'], ['la dissolution', 'الذوبان']]
  });
})();
