/* @meta {"id":"2ac-heredite","level":"2","order":5,"theme":"Reproduction","title":"L'hérédité chez l'Homme","ar":"الوراثة عند الإنسان","lead":"Fille ou garçon : qui le décide ? On suit les chromosomes du père et de la mère jusqu'à la cellule-œuf."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* une cellule avec son nombre de chromosomes et la paire sexuelle */
  function cellule(svg, x, y, r, col) {
    var g = S('g', {}, svg);
    S('circle', { cx: x, cy: y, r: r, fill: 'rgba(233,233,234,.08)', stroke: col || '#e9e9ea', 'stroke-width': 2 }, g);
    g.n = T(g, x, y - 2, '', 'lbl big'); g.s = T(g, x, y + 20, '', 'lbl acc');
    g.set = function (n, s) { g.n.textContent = n; g.s.textContent = s || ''; };
    return g;
  }

  MV.lesson({
    id: '2ac-heredite',
    objectif: {
      fr: 'Savoir que les caractères héréditaires sont portés par les chromosomes, et expliquer la transmission des chromosomes et la détermination du sexe.',
      ar: 'معرفة أن الصفات الوراثية محمولة على الصبغيات، وتفسير انتقال الصبغيات وتحديد الجنس.'
    },

    prerequis: {
      fr: 'Cellule et noyau ; reproduction sexuée vue en 1AC.',
      ar: 'الخلية والنواة والتوالد الجنسي.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Fille ou garçon ?',
      hud: [['p', 'père'], ['m', 'mère'], ['q', 'qui décide ?']],
      draw: function (svg) {
        var e = {};
        e.p = cellule(svg, 80, 90, 48, '#7fb2ff'); e.p.setAttribute('data-keep', 1); e.p.set('papa');
        e.m = cellule(svg, 280, 90, 48, '#f29bb4'); e.m.setAttribute('data-keep', 1); e.m.set('maman');
        e.q = T(svg, 180, 96, '?', 'lbl big acc'); e.q.style.fontSize = '40px';
        return e;
      },
      steps: [
        { cap: 'Un enfant ressemble souvent à son **père** et à sa **mère**.', hud: { p: ['traits'], m: ['traits'], q: '–' } },
        { cap: 'Ces ressemblances sont **héréditaires** : elles se transmettent.', hud: { p: 'traits', m: 'traits', q: '–' } },
        { cap: 'Et le sexe de l\'enfant, **qui** le décide ? On le saura à la fin.', on: ['q'], hud: { p: 'traits', m: 'traits', q: ['?'] } }
      ]
    },

    predire: {
      q: "Qui décide du sexe d'un enfant ?",
      ar: "من الذي يحدّد جنس الطفل؟",
      o: ["Uniquement la mère", "Le spermatozoïde qui féconde l'ovule", "Ce que mange la mère pendant la grossesse"],
      a: 1,
      e: "Tous les ovules portent un chromosome X. Un spermatozoïde porte soit X (fille, XX), soit Y (garçon, XY). C'est donc le spermatozoïde qui détermine le sexe.",
      ear: "كل البويضات تحمل [[X]]، والحيوان المنوي يحمل [[X]] (بنت [[XX]]) أو [[Y]] (ولد [[XY]]). إذن الحيوان المنوي هو الذي يحدّد الجنس."
    },

    prepare: [
      ['Une cellule possède un noyau.', true, 'Le noyau contient l\'information héréditaire.'],
      ['Le spermatozoïde vient de la mère.', false, 'Il est produit par le père ; l\'ovule vient de la mère.'],
      ['La fécondation donne une cellule-œuf.', true, 'Elle se divise pour former l\'embryon.']
    ],

    regarde: {
      vb: '0 0 360 220', label: 'Les chromosomes de génération en génération',
      hud: [['c', 'cellule'], ['n', 'chromosomes'], ['s', 'paire sexuelle']],
      draw: function (svg) {
        var e = {};
        e.a = cellule(svg, 180, 100, 60); e.a.setAttribute('data-keep', 1);
        e.sp = cellule(svg, 70, 100, 36, '#7fb2ff'); e.ov = cellule(svg, 290, 100, 44, '#f29bb4');
        e.ar = S('path', { d: 'M108 100 h22 M252 100 h-22', stroke: 'var(--acc)', 'stroke-width': 3 }, svg);
        return e;
      },
      steps: [
        { cap: 'Dans le **noyau** de nos cellules : des **chromosomes**. Ils portent les caractères héréditaires.', ar: 'في نواة خلايانا صبغيات تحمل الصفات الوراثية.', hud: { c: ['cellule du corps'], n: '–', s: '–' }, run: function (e) { e.a.set('noyau'); } },
        { cap: 'Chaque cellule du corps en a **46**, soit **23 paires**.', ar: 'كل خلية من خلايا الجسم تحتوي على 46 صبغيا، أي 23 زوجا.', hud: { c: 'cellule du corps', n: ['46'], s: '–' }, run: function (e) { e.a.set('46'); } },
        { cap: 'Une paire décide du sexe : **XX** chez la femme, **XY** chez l\'homme.', ar: 'زوج واحد يحدد الجنس: XX عند المرأة و XY عند الرجل.', hud: { c: 'cellule du corps', n: '23 paires', s: ['XX ou XY'] }, run: function (e) { e.a.set('46', 'XX / XY'); } },
        { cap: 'Les **gamètes** n\'en ont que **23**. L\'ovule porte X ; le spermatozoïde porte X **ou** Y.', ar: 'الأمشاج تحتوي على 23 صبغيا فقط: البويضة تحمل X، والحيوان المنوي يحمل X أو Y.', on: ['sp', 'ov'], hud: { c: ['gamètes'], n: ['23'], s: 'X ; X ou Y' }, run: function (e) { e.a.set(''); e.sp.set('23', 'X / Y'); e.ov.set('23', 'X'); } },
        { cap: 'À la **fécondation** : 23 + 23 = **46**. La cellule-œuf reçoit la moitié de chaque parent.', ar: 'عند الإخصاب: [[23 + 23 = 46]]، وتأخذ البيضة نصف صبغياتها من كل أب.', on: ['sp', 'ov', 'ar'], hud: { c: ['cellule-œuf'], n: ['46'], s: 'XX ou XY' }, run: function (e) { e.sp.set('23', 'X / Y'); e.ov.set('23', 'X'); e.a.set('46', 'XX / XY'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis le spermatozoïde qui féconde l\'ovule.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Fécondation' }, st);
          var sp = cellule(svg, 70, 100, 36, '#7fb2ff'), ov = cellule(svg, 180, 100, 44, '#f29bb4'), oe = cellule(svg, 300, 100, 50);
          ov.set('23', 'X'); sp.set('23', '?'); oe.set('46', '?');
          var set = MV.hud(c, [['s', 'spermatozoïde'], ['o', 'cellule-œuf', 1], ['e', 'enfant', 1]]), row = MV.H('div', 'row', '', c), vu = {};
          [['X', 'XX', 'fille'], ['Y', 'XY', 'garçon']].forEach(function (x) { var b = MV.H('button', 'btn', 'Spermatozoïde ' + x[0], row); b.onclick = function () { sp.set('23', x[0]); oe.set('46', x[1]); set('s', x[0]); set('o', x[1]); set('e', x[2]); vu[x[0]] = 1; if (vu.X && vu.Y) done(); }; });
          MV.H('p', 'small', 'Essaie les deux.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Compte les chromosomes.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Une cellule de la peau contient combien de chromosomes ?', a: 46 },
            { q: 'Étape 2. Un ovule en contient :', a: 23 },
            { type: 'opt', q: 'Étape 3. Le sexe de l\'enfant dépend du gamète :', o: ['du père', 'de la mère'], a: 0, e: 'Seul le spermatozoïde peut porter Y.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Les caractères héréditaires sont portés par :', o: ['les chromosomes', 'le sang'], a: 0 },
      { lvl: 'Niveau 2', q: 'Combien de paires de chromosomes dans une cellule du corps ?', a: 23 },
      { lvl: 'Niveau 3', q: 'Une cellule-œuf XY donnera :', o: ['un garçon', 'une fille'], a: 0 },
      { lvl: 'Niveau 4', q: 'Sur 2 spermatozoïdes, un porte X et l\'autre Y. Chance d\'avoir une fille, en % ?', a: 50, unit: '%' }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'Qui décide ?',
      hud: [['m', 'ovule'], ['p', 'spermatozoïde'], ['r', 'réponse']],
      draw: function (svg) { var e = {}; e.sp = cellule(svg, 90, 100, 44, '#7fb2ff'); e.sp.setAttribute('data-keep', 1); e.ov = cellule(svg, 270, 100, 44, '#f29bb4'); e.ov.setAttribute('data-keep', 1); return e; },
      steps: [
        { cap: 'L\'ovule apporte toujours un **X**.', hud: { m: ['X'], p: '–', r: '–' }, run: function (e) { e.ov.set('23', 'X'); e.sp.set('23', ''); } },
        { cap: 'Le spermatozoïde apporte **X ou Y** : c\'est lui qui décide, **par hasard**.', ar: 'الحيوان المنوي يحمل X أو Y، فهو الذي يحدد جنس المولود بالصدفة.', hud: { m: 'X', p: ['X ou Y'], r: ['le père, par hasard'] }, run: function (e) { e.ov.set('23', 'X'); e.sp.set('23', 'X / Y'); } }
      ]
    },

    retenir: [
      'Les caractères héréditaires sont portés par les <b>chromosomes</b> du noyau. Une cellule du corps en a <b>46</b> (23 paires) ; un <b>gamète</b> en a <b>23</b>.',
      'La <b>fécondation</b> rétablit 46 chromosomes. Le sexe dépend de la paire <b>XX</b> (fille) ou <b>XY</b> (garçon), donc du spermatozoïde.'
    ],
    retenirAr: 'الصفات الوراثية تحملها الصبغيات. خلية الجسم فيها 46 صبغيا، والمشيج فيه 23. الإخصاب يعيد العدد إلى 46، والجنس يحدده الزوج XX للأنثى أو XY للذكر.',
    voc: [['un chromosome', 'صبغي'], ['héréditaire', 'وراثي'], ['un gamète', 'مشيج'], ['la cellule-œuf', 'البيضة'], ['la fécondation', 'الإخصاب']]
  });
})();
