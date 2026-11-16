/* @meta {"id":"1ac-eau-nature","level":"1","order":1,"theme":"Matière et environnement","title":"L'eau dans la nature","ar":"الماء في الطبيعة","lead":"La pluie qui tombe sur l'Atlas vient de la mer : on suit une goutte tout au long du cycle de l'eau."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  // positions de la goutte à chaque étape du cycle
  var P = { mer: [70, 232], vapeur: [110, 120], nuage: [205, 62], pluie: [262, 128], neige: [300, 108], oued: [214, 214], nappe: [250, 262], retour: [70, 232] };

  function paysage(svg) {
    var e = {};
    S('rect', { x: 0, y: 220, width: 150, height: 80, fill: '#1d3a52' }, svg);            // mer
    T(svg, 70, 290, 'mer', 'tag');
    S('path', { d: 'M150 220 L240 120 L300 80 L350 140 L360 150 V300 H150 Z', fill: '#2b2e33' }, svg);   // relief
    S('path', { d: 'M282 92 L300 80 L318 101 Z', fill: '#e9e9ea' }, svg);                // neige au sommet
    T(svg, 320, 70, 'Atlas', 'tag');
    S('path', { d: 'M150 238 H360 V300 H150 Z', fill: '#1f2125' }, svg);                // sous-sol
    e.nappeZ = S('rect', { x: 190, y: 252, width: 170, height: 22, rx: 6, fill: '#1d3a52', opacity: .8 }, svg); e.nappeZ.style.opacity = 1;
    T(svg, 280, 292, 'nappe souterraine', 'tag');
    S('path', { d: 'M262 140 C 240 180, 220 200, 150 222', fill: 'none', stroke: '#3d6f96', 'stroke-width': 5 }, svg); // oued
    S('circle', { cx: 40, cy: 40, r: 18, fill: '#f2c14e' }, svg);                      // soleil
    e.nuage = S('g', {}, svg);
    [[180, 62, 22], [205, 52, 26], [232, 62, 22]].forEach(function (c) { S('circle', { cx: c[0], cy: c[1], r: c[2], fill: '#cfd3d8' }, e.nuage); });
    e.evap = S('g', {}, svg);
    [60, 85, 110].forEach(function (x) { S('path', { d: 'M' + x + ' 210 q-6 -15 0 -30 q6 -15 0 -30', fill: 'none', stroke: 'var(--acc)', 'stroke-width': 2, 'stroke-dasharray': '3 4' }, e.evap); });
    T(e.evap, 92, 140, 'vapeur invisible', 'tag');
    e.pluie = S('g', {}, svg);
    for (var i = 0; i < 6; i++) S('line', { x1: 235 + i * 9, y1: 90, x2: 230 + i * 9, y2: 104, stroke: 'var(--acc)', 'stroke-width': 2 }, e.pluie);
    e.infil = S('path', { d: 'M232 182 V250', stroke: 'var(--acc)', 'stroke-width': 2, 'stroke-dasharray': '4 4', fill: 'none' }, svg);
    // la goutte
    var g = S('circle', { cx: 0, cy: 0, r: 8, fill: 'var(--acc)', stroke: '#fff', 'stroke-width': 2 }, svg);
    g.style.cssText = 'transition:transform 1.2s ease-in-out;transform-box:view-box';
    e.goutte = g; g.go = function (k) { var p = P[k]; g.style.transform = 'translate(' + p[0] + 'px,' + p[1] + 'px)'; };
    return e;
  }

  MV.lesson({
    id: '1ac-eau-nature',
    objectif: {
      fr: 'Décrire le cycle de l\'eau et nommer les changements d\'état qui s\'y produisent.',
      ar: 'وصف دورة الماء في الطبيعة وتسمية تحولات الحالة التي تحدث خلالها.'
    },

    ouverture: {
      vb: '0 0 360 300', label: 'La mer, les nuages et l\'Atlas',
      hud: [['l', 'lieu'], ['e', 'état de l\'eau'], ['q', 'question']],
      draw: function (svg) { var e = paysage(svg); return { nuage: e.nuage, pluie: e.pluie, goutte: e.goutte, ctl: e }; },
      steps: [
        { cap: 'En hiver, il **neige** sur l\'Atlas et il pleut dans les plaines.', on: ['nuage', 'pluie'], hud: { l: ['Atlas'], e: 'solide, liquide', q: '–' }, run: function (e) { e.ctl.goutte.go('pluie'); } },
        { cap: 'Cette eau coule ensuite dans les **oueds** jusqu\'à la mer.', on: ['nuage', 'goutte'], hud: { l: ['oued'], e: 'liquide', q: '–' }, run: function (e) { e.ctl.goutte.go('oued'); } },
        { cap: 'Mais d\'où vient l\'eau des **nuages** ? On le saura à la fin.', on: ['nuage', 'goutte'], hud: { l: 'nuage', e: '–', q: ['?'] }, run: function (e) { e.ctl.goutte.go('nuage'); } }
      ]
    },

    prepare: [
      ['L\'eau existe sous trois états : solide, liquide et gazeux.', true, 'Glace, eau liquide et vapeur d\'eau.'],
      ['On voit la vapeur d\'eau.', false, 'La vapeur d\'eau est invisible. Ce qu\'on voit au-dessus d\'une casserole, ce sont de fines gouttelettes.'],
      ['La glace fond quand on la chauffe.', true, 'Elle passe de l\'état solide à l\'état liquide : c\'est la fusion.']
    ],

    regarde: {
      vb: '0 0 360 300', label: 'Le cycle de l\'eau',
      hud: [['p', 'phénomène'], ['e', 'état'], ['c', 'changement']],
      draw: function (svg) { var e = paysage(svg); return { nuage: e.nuage, pluie: e.pluie, evap: e.evap, infil: e.infil, goutte: e.goutte, ctl: e }; },
      steps: [
        { cap: 'Le **soleil** chauffe la mer : l\'eau s\'évapore.', ar: 'الشمس تسخن البحر فيتبخر الماء.', on: ['goutte', 'evap'], hud: { p: ['évaporation'], e: 'liquide → gaz', c: ['vaporisation'] }, run: function (e) { e.ctl.goutte.go('mer'); setTimeout(function () { e.ctl.goutte.go('vapeur'); }, 400); } },
        { cap: 'En montant, la vapeur se refroidit : elle forme des **gouttelettes**. C\'est un nuage.', ar: 'عندما يبرد بخار الماء يتكاثف إلى قطيرات صغيرة تكون السحب.', on: ['goutte', 'nuage'], hud: { p: ['condensation'], e: 'gaz → liquide', c: ['liquéfaction'] }, run: function (e) { e.ctl.goutte.go('nuage'); } },
        { cap: 'Les gouttelettes grossissent et tombent : ce sont les **précipitations**.', ar: 'تكبر القطيرات فتسقط: هذه هي التساقطات.', on: ['goutte', 'nuage', 'pluie'], hud: { p: ['pluie'], e: 'liquide', c: '–' }, run: function (e) { e.ctl.goutte.go('pluie'); } },
        { cap: 'Sur les sommets froids, l\'eau tombe en **neige** : de l\'eau solide.', ar: 'في القمم الباردة يسقط الماء ثلجا، أي ماء في الحالة الصلبة.', on: ['goutte', 'nuage'], hud: { p: ['neige'], e: ['solide'], c: '–' }, run: function (e) { e.ctl.goutte.go('neige'); } },
        { cap: 'Au printemps, la neige **fond** et l\'eau ruisselle dans les oueds.', ar: 'في الربيع ينصهر الثلج ويجري الماء في الأودية.', on: ['goutte'], hud: { p: ['ruissellement'], e: 'liquide', c: ['fusion'] }, run: function (e) { e.ctl.goutte.go('oued'); } },
        { cap: 'Une partie **s\'infiltre** dans le sol et remplit les nappes souterraines.', ar: 'جزء من الماء يتسرب في التربة ويغذي الفرشة المائية.', on: ['goutte', 'infil'], hud: { p: ['infiltration'], e: 'liquide', c: '–' }, run: function (e) { e.ctl.goutte.go('nappe'); } },
        { cap: 'Et l\'eau revient à la mer. Le cycle **recommence** sans fin.', ar: 'ثم يعود الماء إلى البحر، وتتكرر الدورة باستمرار.', on: ['goutte', 'evap', 'nuage', 'pluie', 'infil'], hud: { p: ['cycle'], e: 'tous', c: '–' }, run: function (e) { e.ctl.goutte.go('retour'); } }
      ]
    },

    faisons: [
      { title: 'Toute l\'eau de la Terre', intro: 'Imagine toute l\'eau de la Terre dans 100 bouteilles. Touche un type d\'eau pour voir sa part.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Cent bouteilles d\'eau' }, st);
          var cells = [], kinds = [['salée (mers et océans)', 97, '#3d6f96'], ['douce gelée (glaciers)', 2, '#cfd3d8'], ['douce liquide (nappes, lacs, oueds)', 1, 'var(--acc)']];
          for (var i = 0; i < 100; i++) {
            var x = 20 + (i % 20) * 16, y = 20 + Math.floor(i / 20) * 34;
            var b = S('rect', { x: x, y: y, width: 11, height: 26, rx: 3, fill: '#3a3d42' }, svg); cells.push(b);
          }
          var set = MV.hud(c, [['k', 'type'], ['n', 'bouteilles', 1]]), row = MV.H('div', 'row', '', c), seen = 0;
          kinds.forEach(function (k, j) {
            var bt = MV.H('button', 'btn', k[0].split(' (')[0], row);
            bt.onclick = function () {
              var from = kinds.slice(0, j).reduce(function (s, x) { return s + x[1]; }, 0);
              cells.forEach(function (r, n) { r.setAttribute('fill', n >= from && n < from + k[1] ? k[2] : '#3a3d42'); });
              set('k', k[0]); set('n', k[1] + ' sur 100');
              if (!bt.dataset.seen) { bt.dataset.seen = 1; if (++seen === kinds.length) done(); }
            };
          });
          MV.H('p', 'small', 'Valeurs arrondies. L\'eau douce liquide facile à utiliser est donc très rare : il faut l\'économiser.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Retrouve les étapes du cycle sur le schéma.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 300', role: 'img', 'aria-label': 'Schéma du cycle de l\'eau' }, st);
          var e = paysage(svg); e.goutte.style.opacity = 0;
          var mer = S('rect', { x: 0, y: 220, width: 150, height: 60, fill: 'transparent' }, svg);
          var nu = S('rect', { x: 150, y: 24, width: 110, height: 64, fill: 'transparent' }, svg);
          var na = S('rect', { x: 190, y: 248, width: 170, height: 30, fill: 'transparent' }, svg);
          MV.guide(c, [
            { type: 'tap', q: 'Étape 1. Touche l\'endroit où l\'eau s\'évapore le plus.', targets: { mer: mer, nuage: nu, nappe: na }, good: 'mer', ok: 'La mer, chauffée par le soleil.', ko: 'Cherche une grande surface d\'eau chauffée par le soleil.' },
            { type: 'opt', q: 'Étape 2. Un nuage est formé de :', o: ['vapeur d\'eau invisible', 'fines gouttelettes d\'eau liquide', 'fumée'], a: 1, e: 'On voit les nuages parce que ce sont des gouttelettes, pas de la vapeur.', ko: 'Rappel : la vapeur d\'eau est invisible.' },
            { type: 'opt', q: 'Étape 3. La neige de l\'Atlas, c\'est de l\'eau à l\'état :', o: ['solide', 'liquide', 'gazeux'], a: 0, e: 'Elle fondra au printemps : fusion.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'L\'évaporation, c\'est le passage de l\'eau :', o: ['de l\'état liquide à l\'état gazeux', 'de l\'état solide à l\'état liquide', 'de l\'état gazeux à l\'état liquide'], a: 0, e: 'Liquide → gaz.' },
      { lvl: 'Niveau 2', q: 'Quelle est la source d\'énergie du cycle de l\'eau ?', o: ['la Lune', 'le Soleil', 'le vent'], a: 1, e: 'Le Soleil chauffe l\'eau et provoque l\'évaporation.' },
      { lvl: 'Niveau 3', q: 'Range dans l\'ordre :', o: ['précipitations, évaporation, condensation', 'évaporation, condensation, précipitations', 'condensation, précipitations, évaporation'], a: 1, e: 'La vapeur se forme, se condense en nuage, puis tombe.' },
      { lvl: 'Niveau 4', q: 'Sur 100 bouteilles représentant l\'eau de la Terre, combien environ contiennent de l\'eau salée ?', a: 97, unit: 'bouteilles', hint: 'Repense à l\'activité des 100 bouteilles.' }
    ],

    bilan: {
      vb: '0 0 360 300', label: 'D\'où vient la pluie de l\'Atlas',
      hud: [['d', 'départ'], ['p', 'passage'], ['a', 'arrivée']],
      draw: function (svg) { var e = paysage(svg); return { nuage: e.nuage, pluie: e.pluie, evap: e.evap, goutte: e.goutte, ctl: e }; },
      steps: [
        { cap: 'L\'eau des nuages vient surtout de la **mer**, chauffée par le soleil.', on: ['goutte', 'evap'], hud: { d: ['mer'], p: '–', a: '–' }, run: function (e) { e.ctl.goutte.go('mer'); } },
        { cap: 'Elle monte en **vapeur**, puis se condense en nuage.', on: ['goutte', 'evap', 'nuage'], hud: { d: 'mer', p: ['nuage'], a: '–' }, run: function (e) { e.ctl.goutte.go('nuage'); } },
        { cap: 'Le vent pousse le nuage vers l\'Atlas : il **neige**. La boucle est fermée.', ar: 'تحمل الرياح السحب نحو الأطلس فيتساقط الثلج، ثم يعود الماء إلى البحر.', on: ['goutte', 'nuage', 'pluie'], hud: { d: 'mer', p: 'nuage', a: ['Atlas'] }, run: function (e) { e.ctl.goutte.go('neige'); } }
      ]
    },

    retenir: [
      'Dans la nature, l\'eau circule sans cesse : <b>évaporation</b>, <b>condensation</b> en nuages, <b>précipitations</b>, puis <b>ruissellement</b> et <b>infiltration</b>. C\'est le cycle de l\'eau, entretenu par l\'énergie du Soleil.',
      'L\'eau change d\'état au cours du cycle. L\'eau douce liquide utilisable est rare : il faut la protéger et l\'économiser.'
    ],
    retenirAr: 'يدور الماء في الطبيعة باستمرار: تبخر، ثم تكاثف في السحب، ثم تساقطات، ثم جريان وتسرب. هذه هي دورة الماء وتحركها طاقة الشمس. الماء العذب الصالح للاستعمال قليل، فيجب الحفاظ عليه.',
    voc: [['l\'évaporation', 'التبخر'], ['la condensation', 'التكاثف'], ['les précipitations', 'التساقطات'], ['le ruissellement', 'الجريان السطحي'], ['l\'infiltration', 'التسرب'], ['la nappe souterraine', 'الفرشة المائية']]
  });
})();
