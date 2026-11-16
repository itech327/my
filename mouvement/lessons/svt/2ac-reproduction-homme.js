/* @meta {"id":"2ac-reproduction-homme","level":"2","order":4,"theme":"Reproduction","title":"La reproduction chez l'Homme","ar":"التوالد عند الإنسان","lead":"Un être humain commence par une seule cellule de 0,1 mm et naît neuf mois plus tard en mesurant environ 50 cm : on suit les étapes."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var TAILLE = [0.01, 0.5, 3, 9, 16, 25, 30, 37, 45, 50]; // cm, valeurs approchées par mois

  function etapes(svg) {
    var e = { g: S('g', { 'data-keep': 1 }, svg) }, g = e.g;
    var B = [['ovaire', 'ovule', 40, 60], ['trompe', 'fécondation', 150, 60], ['utérus', 'grossesse', 260, 60]];
    e.box = B.map(function (b) { var k = S('g', {}, g); S('rect', { x: b[2], y: b[3], width: 90, height: 56, rx: 10, fill: '#17181a', stroke: '#9aa0a8', 'stroke-width': 2 }, k); T(k, b[2] + 45, b[3] + 24, b[0], 'lbl'); T(k, b[2] + 45, b[3] + 42, b[1], 'tag'); return k; });
    S('path', { d: 'M130 88 h20 M240 88 h20', stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    e.cell = S('circle', { cx: 85, cy: 150, r: 9, fill: '#e9c46a', stroke: '#fff', 'stroke-width': 2 }, g); e.cell.style.transition = 'all 1.2s';
    e.sp = S('g', {}, g); for (var i = 0; i < 3; i++) { S('ellipse', { cx: 195 + i * 6, cy: 160 + i * 8, rx: 4, ry: 3, fill: '#e9e9ea' }, e.sp); S('path', { d: 'M' + (199 + i * 6) + ' ' + (160 + i * 8) + ' q10 4 18 0', stroke: '#e9e9ea', fill: 'none' }, e.sp); }
    e.sp.style.transition = 'opacity .8s';
    e.lab = T(g, 180, 210, '', 'lbl acc');
    e.set = function (k) {
      e.box.forEach(function (b, i) { b.querySelector('rect').setAttribute('stroke', i === k ? 'var(--acc)' : '#9aa0a8'); });
      var x = [85, 195, 305][Math.max(0, Math.min(2, k))]; e.cell.setAttribute('cx', x); e.cell.setAttribute('r', k >= 2 ? 14 : 9);
      e.sp.style.opacity = k === 1 ? 1 : 0;
      e.lab.textContent = ['ovule libéré', 'fécondation : cellule-œuf', 'nidation dans l\'utérus'][k] || '';
    };
    return e;
  }

  MV.lesson({
    id: '2ac-reproduction-homme',
    objectif: {
      fr: 'Connaître le rôle des appareils reproducteurs, les changements de la puberté, la fécondation et les grandes étapes de la grossesse.',
      ar: 'معرفة دور الجهازين التناسليين، وتغيرات البلوغ، والإخصاب، والمراحل الكبرى للحمل.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'D\'une cellule à un bébé',
      hud: [['d', 'départ'], ['a', 'arrivée'], ['q', 'comment ?']],
      draw: function (svg) {
        var e = {};
        e.c = S('circle', { cx: 80, cy: 110, r: 5, fill: '#e9c46a' }, svg); T(svg, 80, 150, '0,1 mm', 'tag');
        e.b = S('g', {}, svg); S('circle', { cx: 270, cy: 80, r: 22, fill: '#e7b99a' }, e.b); S('ellipse', { cx: 270, cy: 135, rx: 30, ry: 40, fill: '#e7b99a' }, e.b); T(e.b, 270, 195, '≈ 50 cm', 'tag');
        e.f = T(svg, 175, 115, '→ 9 mois →', 'lbl acc');
        return e;
      },
      steps: [
        { cap: 'Chaque être humain commence par **une seule cellule**, plus petite qu\'un grain de sable.', on: ['c'], hud: { d: ['0,1 mm'], a: '–', q: '–' } },
        { cap: 'Neuf mois plus tard naît un **bébé** d\'environ 50 cm.', on: ['c', 'f', 'b'], hud: { d: '0,1 mm', a: ['≈ 50 cm'], q: '–' } },
        { cap: 'D\'où vient cette première cellule, et comment **grandit**-elle ? On le saura à la fin.', on: ['c', 'f', 'b'], hud: { d: '0,1 mm', a: '≈ 50 cm', q: ['?'] } }
      ]
    },

    prepare: [
      ['La puberté est la période où le corps devient capable de se reproduire.', true, 'Elle commence en général entre 10 et 14 ans.'],
      ['Chez l\'Homme, la fécondation se fait hors du corps.', false, 'Elle est interne : dans les voies génitales de la femme.'],
      ['Les gamètes sont des cellules reproductrices.', true, 'Spermatozoïdes chez l\'homme, ovules chez la femme.']
    ],

    regarde: {
      vb: '0 0 360 230', label: 'Gamètes, fécondation, grossesse',
      hud: [['o', 'organe'], ['c', 'cellule'], ['p', 'phénomène']],
      draw: function (svg) {
        var e = etapes(svg);
        var pub = S('g', {}, svg); S('rect', { x: 20, y: 20, width: 320, height: 190, rx: 12, fill: '#17181a', stroke: 'var(--acc)' }, pub);
        T(pub, 180, 50, 'Puberté (vers 10 à 14 ans)', 'lbl acc');
        ['croissance rapide, poils', 'garçon : voix plus grave, production de spermatozoïdes', 'fille : poitrine, premières règles, ovulation', 'cause : les hormones'].forEach(function (t, i) { T(pub, 180, 85 + i * 28, t, 'tag'); });
        return { pub: pub, ctl: e };
      },
      steps: [
        { cap: 'À la **puberté**, le corps change et les organes reproducteurs deviennent fonctionnels.', ar: 'في البلوغ يتغير الجسم وتبدأ الأعضاء التناسلية في العمل.', on: ['pub'], hud: { o: 'tout le corps', c: '–', p: ['puberté'] }, run: function (e) { e.ctl.g.style.opacity = 0; } },
        { cap: 'Chez l\'homme, les **testicules** produisent des spermatozoïdes ; chez la femme, les **ovaires** libèrent des ovules.', ar: 'تنتج الخصيتان الحيوانات المنوية، ويحرر المبيضان البويضات.', hud: { o: ['testicules, ovaires'], c: ['gamètes'], p: '–' }, run: function (e) { e.ctl.g.style.opacity = 1; e.ctl.set(0); } },
        { cap: 'Environ une fois par mois, un ovaire libère un **ovule** : c\'est l\'ovulation.', ar: 'كل شهر تقريبا يحرر أحد المبيضين بويضة: هذه هي الإباضة.', hud: { o: ['ovaire'], c: 'ovule', p: ['ovulation'] }, run: function (e) { e.ctl.g.style.opacity = 1; e.ctl.set(0); } },
        { cap: 'Dans la trompe, un spermatozoïde s\'unit à l\'ovule : la **fécondation** donne une cellule-œuf.', ar: 'في قناة فالوب يتحد حيوان منوي بالبويضة: الإخصاب يعطي بيضة ملقحة.', hud: { o: ['trompe'], c: ['cellule-œuf'], p: ['fécondation'] }, run: function (e) { e.ctl.g.style.opacity = 1; e.ctl.set(1); } },
        { cap: 'La cellule-œuf se divise et s\'installe dans l\'**utérus** : c\'est la nidation.', ar: 'تنقسم البيضة الملقحة وتنغرس في الرحم: هذا هو التعشيش.', hud: { o: ['utérus'], c: 'embryon', p: ['nidation'] }, run: function (e) { e.ctl.g.style.opacity = 1; e.ctl.set(2); } },
        { cap: 'Pendant environ **9 mois**, l\'embryon puis le **fœtus** se développe, nourri par le placenta.', ar: 'خلال حوالي تسعة أشهر ينمو الجنين متغذيا عبر المشيمة.', hud: { o: 'utérus', c: ['embryon → fœtus'], p: ['grossesse'] }, run: function (e) { e.ctl.g.style.opacity = 1; e.ctl.set(2); } }
      ]
    },

    faisons: [
      { title: 'La grossesse mois par mois', intro: 'Fais avancer les mois. Tailles approximatives.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 180', role: 'img', 'aria-label': 'Taille au cours de la grossesse' }, st);
          S('line', { x1: 30, y1: 150, x2: 330, y2: 150, stroke: '#9aa0a8', 'stroke-width': 2 }, svg);
          for (var k = 0; k <= 50; k += 10) { S('line', { x1: 30 + k * 6, y1: 146, x2: 30 + k * 6, y2: 154, stroke: '#9aa0a8' }, svg); T(svg, 30 + k * 6, 172, k + ' cm', 'tag'); }
          var bar = S('rect', { x: 30, y: 110, width: 0, height: 30, rx: 6, fill: 'var(--acc)' }, svg); bar.style.transition = 'width .6s';
          var set = MV.hud(c, [['m', 'mois'], ['t', 'taille ≈', 1], ['s', 'stade', 1]]);
          MV.slider(c, { label: 'mois', min: 0, max: 9, value: 0 }, function (m) {
            bar.setAttribute('width', Math.max(2, TAILLE[m] * 6)); set('m', m); set('t', (TAILLE[m] < 1 ? MV.fmt(TAILLE[m] * 10, 1) + ' mm' : TAILLE[m] + ' cm')); set('s', m === 0 ? 'cellule-œuf' : m < 3 ? 'embryon' : m < 9 ? 'fœtus' : 'naissance'); if (m === 9) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Remettons les étapes dans l\'ordre.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Qu\'est-ce qui vient en premier ?', o: ['la nidation', 'l\'ovulation', 'la naissance'], a: 1 },
            { type: 'opt', q: 'Étape 2. Où se fait la fécondation ?', o: ['dans la trompe', 'dans l\'ovaire', 'dans l\'estomac'], a: 0 },
            { type: 'opt', q: 'Étape 3. Où se développe le fœtus ?', o: ['dans l\'utérus', 'dans la trompe'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Les spermatozoïdes sont produits par :', o: ['les testicules', 'les ovaires'], a: 0 },
      { lvl: 'Niveau 2', q: 'L\'union d\'un spermatozoïde et d\'un ovule s\'appelle :', o: ['l\'ovulation', 'la fécondation', 'la puberté'], a: 1 },
      { lvl: 'Niveau 3', q: 'Une grossesse dure environ combien de mois ?', a: 9, unit: 'mois' },
      { lvl: 'Niveau 4', q: 'Le fœtus reçoit sa nourriture et son dioxygène :', o: ['par le placenta, depuis le sang de la mère', 'en respirant de l\'air'], a: 0 }
    ],

    bilan: {
      vb: '0 0 360 230', label: 'La première cellule',
      hud: [['o', 'origine'], ['l', 'lieu'], ['d', 'durée']],
      draw: function (svg) { var e = etapes(svg); return { ctl: e }; },
      steps: [
        { cap: 'La première cellule est la **cellule-œuf**, issue de la fécondation.', hud: { o: ['ovule + spermatozoïde'], l: 'trompe', d: '–' }, run: function (e) { e.ctl.set(1); } },
        { cap: 'Elle se divise dans l\'**utérus** pendant environ 9 mois jusqu\'à la naissance.', ar: 'البيضة الملقحة تنتج عن الإخصاب، ثم تنمو في الرحم حوالي تسعة أشهر.', hud: { o: 'cellule-œuf', l: ['utérus'], d: ['≈ 9 mois'] }, run: function (e) { e.ctl.set(2); } }
      ]
    },

    retenir: [
      'À la <b>puberté</b>, les organes reproducteurs deviennent fonctionnels : les <b>testicules</b> produisent des spermatozoïdes, les <b>ovaires</b> libèrent des ovules.',
      'La <b>fécondation</b> (dans la trompe) donne une cellule-œuf, qui se fixe dans l\'<b>utérus</b> (nidation) et s\'y développe pendant environ <b>9 mois</b>, nourrie par le placenta.'
    ],
    retenirAr: 'في البلوغ تبدأ الأعضاء التناسلية في العمل: تنتج الخصيتان الحيوانات المنوية ويحرر المبيضان البويضات. يعطي الإخصاب بيضة ملقحة تنغرس في الرحم وتنمو فيه حوالي تسعة أشهر.',
    voc: [['la puberté', 'البلوغ'], ['l\'ovulation', 'الإباضة'], ['la fécondation', 'الإخصاب'], ['la nidation', 'التعشيش'], ['l\'utérus', 'الرحم'], ['le placenta', 'المشيمة']]
  });
})();
