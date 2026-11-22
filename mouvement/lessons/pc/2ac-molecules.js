/* @meta {"id":"2ac-molecules","level":"2","order":2,"theme":"Matière et environnement","title":"Les molécules et les atomes","ar":"الجزيئات والذرات","lead":"L'eau et le dioxygène contiennent tous deux de l'oxygène : on assemble les atomes pour comprendre pourquoi ce sont des corps différents."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var COL = { H: '#f2f2f2', O: '#e5484d', C: '#3a3a3a', N: '#4c7bf2' }, R = { H: 11, O: 16, C: 16, N: 15 };

  /* une molécule : liste d'atomes [élément, dx, dy] autour de (x, y) */
  function mol(svg, x, y, atoms, s) {
    s = s || 1;
    var g = S('g', {}, svg);
    atoms.forEach(function (a) {
      S('circle', { cx: x + a[1] * s, cy: y + a[2] * s, r: R[a[0]] * s, fill: COL[a[0]], stroke: '#141517', 'stroke-width': 1.5 }, g);
      var t = T(g, x + a[1] * s, y + a[2] * s + 4, a[0], 'lbl'); t.style.fill = a[0] === 'H' ? '#141517' : '#fff';
    });
    return g;
  }
  var M = {
    H2O: [['O', 0, 0], ['H', -18, 14], ['H', 18, 14]],
    O2: [['O', -12, 0], ['O', 12, 0]],
    CO2: [['O', -26, 0], ['C', 0, 0], ['O', 26, 0]],
    N2: [['N', -11, 0], ['N', 11, 0]],
    H2: [['H', -8, 0], ['H', 8, 0]],
    CH4: [['C', 0, 0], ['H', -16, -14], ['H', 16, -14], ['H', -16, 14], ['H', 16, 14]]
  };

  MV.lesson({
    id: '2ac-molecules',
    objectif: {
      fr: 'Représenter une molécule par un modèle et une formule, et distinguer corps simple et corps composé.',
      ar: 'تمثيل جزيئة بنموذج وبصيغة، والتمييز بين الجسم البسيط والجسم المركب.'
    },

    prerequis: {
      fr: 'Corps purs et mélanges ; transformation physique et chimique.',
      ar: 'الأجسام الخالصة والخلائط والتحول الفيزيائي والكيميائي.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Eau et dioxygène',
      hud: [['e', 'eau'], ['o', 'dioxygène'], ['q', 'question']],
      draw: function (svg) {
        var e = {};
        e.eau = mol(svg, 100, 90, M.H2O, 1.6); e.o2 = mol(svg, 260, 90, M.O2, 1.6);
        T(svg, 100, 160, 'eau', 'tag'); T(svg, 260, 160, 'dioxygène', 'tag');
        return e;
      },
      steps: [
        { cap: 'On respire le **dioxygène** de l\'air.', on: ['o2'], hud: { e: '–', o: ['on le respire'], q: '–' } },
        { cap: 'L\'**eau** contient aussi de l\'oxygène… mais on ne peut pas la respirer.', on: ['o2', 'eau'], hud: { e: ['on la boit'], o: 'on le respire', q: '–' } },
        { cap: 'Même oxygène, corps **différents**. Pourquoi ? On le saura à la fin.', on: ['o2', 'eau'], hud: { e: 'on la boit', o: 'on le respire', q: ['?'] } }
      ]
    },

    predire: {
      q: "Le dioxygène de l'air et l'eau contiennent tous deux de l'oxygène, mais on respire l'un et pas l'autre. Pourquoi ?",
      ar: "ثنائي الأوكسجين والماء كلاهما يحتوي الأوكسجين، لكننا نتنفس الأول دون الثاني. لماذا؟",
      o: ["Les atomes d'oxygène ne sont pas les mêmes", "Les atomes sont assemblés différemment, et l'eau contient aussi de l'hydrogène", "L'eau est liquide, donc elle n'a pas d'oxygène"],
      a: 1,
      e: "Un corps dépend des atomes qui le forment et de leur assemblage. O₂ est un corps simple (2 atomes d'oxygène) ; H₂O est un corps composé (2 atomes d'hydrogène et 1 atome d'oxygène).",
      ear: "خصائص الجسم تتعلق بالذرات المكوّنة له وبطريقة ترابطها: [[O₂]] جسم بسيط و[[H₂O]] جسم مركّب."
    },

    prepare: [
      ['L\'air contient du dioxygène.', true, 'Environ 21 % de l\'air.'],
      ['On peut voir un atome à l\'œil nu.', false, 'Les atomes sont beaucoup trop petits.'],
      ['L\'eau est formée de très petites particules.', true, 'Ces particules s\'appellent des molécules.']
    ],

    regarde: {
      vb: '0 0 360 240', label: 'Des atomes aux molécules',
      hud: [['m', 'molécule'], ['f', 'formule'], ['a', 'atomes']],
      draw: function (svg) {
        var e = {};
        e.atomes = S('g', {}, svg);
        [['H', 60], ['O', 140], ['C', 220], ['N', 300]].forEach(function (a) { mol(e.atomes, a[1], 90, [[a[0], 0, 0]], 1.8); T(e.atomes, a[1], 150, { H: 'hydrogène', O: 'oxygène', C: 'carbone', N: 'azote' }[a[0]], 'tag'); });
        e.h2o = mol(svg, 180, 100, M.H2O, 2.2); e.o2 = mol(svg, 180, 100, M.O2, 2.2); e.co2 = mol(svg, 180, 100, M.CO2, 2.2);
        e.simple = S('g', {}, svg); mol(e.simple, 90, 100, M.O2, 1.5); mol(e.simple, 90, 170, M.N2, 1.5); T(e.simple, 90, 220, 'corps simples', 'lbl acc');
        e.comp = S('g', {}, svg); mol(e.comp, 270, 100, M.H2O, 1.5); mol(e.comp, 270, 170, M.CO2, 1.5); T(e.comp, 270, 220, 'corps composés', 'lbl');
        return e;
      },
      steps: [
        { cap: 'La matière est faite d\'**atomes**. Chacun a un symbole et une couleur de modèle.', ar: 'تتكون المادة من ذرات، لكل ذرة رمز.', on: ['atomes'], hud: { m: '–', f: 'H, O, C, N', a: '–' } },
        { cap: 'Des atomes liés forment une **molécule**. Voici la molécule d\'eau.', ar: 'تترابط الذرات فتكون جزيئة. هذه جزيئة الماء.', on: ['h2o'], hud: { m: ['eau'], f: '–', a: '–' } },
        { cap: 'Deux H et un O : sa **formule** est H₂O.', ar: 'ذرتا هيدروجين وذرة أوكسجين: صيغتها [[H₂O]].', on: ['h2o'], hud: { m: 'eau', f: ['H₂O'], a: ['2 H + 1 O'] } },
        { cap: 'Le chiffre en bas à droite donne le **nombre** d\'atomes. Pas de chiffre : 1.', ar: 'الرقم المكتوب أسفل الرمز يدل على عدد الذرات.', on: ['h2o'], hud: { m: 'eau', f: 'H₂O', a: ['3 atomes'] } },
        { cap: 'Le dioxygène : **O₂**, deux atomes d\'oxygène.', ar: 'ثنائي الأوكسجين: [[O₂]].', on: ['o2'], hud: { m: ['dioxygène'], f: ['O₂'], a: '2 O' } },
        { cap: 'Le dioxyde de carbone : **CO₂**.', ar: 'ثنائي أوكسيد الكربون: [[CO₂]].', on: ['co2'], hud: { m: ['dioxyde de carbone'], f: ['CO₂'], a: '1 C + 2 O' } },
        { cap: 'Une seule sorte d\'atome : **corps simple**. Plusieurs sortes : **corps composé**.', ar: 'نوع واحد من الذرات: جسم بسيط. عدة أنواع: جسم مركب.', on: ['simple', 'comp'], hud: { m: '–', f: 'O₂, N₂ | H₂O, CO₂', a: '–' } }
      ]
    },

    faisons: [
      { title: 'Construis une molécule', intro: 'Ajoute des atomes. Le site reconnaît H₂O, CO₂, O₂, N₂, H₂ et CH₄.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 160', role: 'img', 'aria-label': 'Molécule en construction' }, st);
          var cnt = { H: 0, O: 0, C: 0, N: 0 }, set = MV.hud(c, [['f', 'formule'], ['r', 'molécule', 1]]), row = MV.H('div', 'row', '', c), found = {};
          var NAMES = { 'H2O': 'eau', 'CO2': 'dioxyde de carbone', 'O2': 'dioxygène', 'N2': 'diazote', 'H2': 'dihydrogène', 'CH4': 'méthane' };
          function key() { var k = ''; ['C', 'H', 'N', 'O'].forEach(function (a) { if (cnt[a]) k += a + (cnt[a] > 1 ? cnt[a] : ''); }); return k; }
          function pretty(k) { return k.replace(/(\d)/g, function (d) { return '₀₁₂₃₄₅₆₇₈₉'[d]; }); }
          function draw() {
            while (svg.firstChild) svg.removeChild(svg.firstChild);
            var k = key(), x = 30;
            ['C', 'H', 'N', 'O'].forEach(function (a) { for (var i = 0; i < cnt[a]; i++) { mol(svg, x + 20, 80, [[a, 0, 0]], 1.4); x += 46; } });
            var name = NAMES[k] || (k ? 'inconnue ici' : '–');
            set('f', k ? pretty(k) : '–'); set('r', name);
            if (NAMES[k]) { found[k] = 1; if (Object.keys(found).length >= 2) done(); }
          }
          ['H', 'O', 'C', 'N'].forEach(function (a) { var b = MV.H('button', 'btn', '+ ' + a, row); b.onclick = function () { if (cnt.H + cnt.O + cnt.C + cnt.N < 6) { cnt[a]++; draw(); } }; });
          var z = MV.H('button', 'btn', 'Vider', row); z.onclick = function () { cnt = { H: 0, O: 0, C: 0, N: 0 }; draw(); };
          MV.H('p', 'small', 'Construis au moins deux molécules différentes.', c);
          draw();
        } },
      { title: 'Résolvons ensemble', intro: 'Étudions la molécule de dioxyde de carbone, CO₂.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Combien d\'atomes en tout dans une molécule de CO₂ ?', a: 3, hint: '1 carbone + 2 oxygènes.' },
            { type: 'opt', q: 'Étape 2. Le dioxyde de carbone est :', o: ['un corps simple', 'un corps composé'], a: 1, e: 'Deux sortes d\'atomes : C et O.' },
            { q: 'Étape 3. Combien d\'atomes d\'oxygène dans 3 molécules de CO₂ ?', a: 6, hint: '3 × 2.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Combien d\'atomes dans une molécule de méthane CH₄ ?', a: 5, hint: '1 + 4.' },
      { lvl: 'Niveau 2', q: 'Le diazote N₂ est :', o: ['un corps simple', 'un corps composé'], a: 0, e: 'Une seule sorte d\'atome.' },
      { lvl: 'Niveau 3', q: 'Lequel est un corps composé ?', o: ['O₂', 'H₂', 'H₂O'], a: 2, e: 'H₂O contient deux sortes d\'atomes.' },
      { lvl: 'Niveau 4', q: 'Combien d\'atomes d\'hydrogène dans 5 molécules d\'eau ?', a: 10, hint: '5 × 2.' }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'Eau et dioxygène comparés',
      hud: [['e', 'eau'], ['o', 'dioxygène'], ['d', 'différence']],
      draw: function (svg) { var e = {}; e.eau = mol(svg, 100, 90, M.H2O, 1.6); e.o2 = mol(svg, 260, 90, M.O2, 1.6); e.eau.setAttribute('data-keep', 1); e.o2.setAttribute('data-keep', 1); return e; },
      steps: [
        { cap: 'Eau : **H₂O**. Dioxygène : **O₂**.', hud: { e: ['H₂O'], o: ['O₂'], d: '–' } },
        { cap: 'Les molécules sont **différentes** : ce ne sont pas les mêmes atomes assemblés.', ar: 'الجزيئتان مختلفتان، لذلك الجسمان مختلفان رغم وجود الأوكسجين فيهما.', hud: { e: 'H₂O', o: 'O₂', d: ['molécules différentes'] } },
        { cap: 'Chaque corps pur a **sa** molécule. Un corps composé n\'a pas les propriétés de ses atomes séparés.', hud: { e: 'corps composé', o: 'corps simple', d: 'molécules différentes' } }
      ]
    },

    retenir: [
      'Une <b>molécule</b> est un assemblage d\'<b>atomes</b>. On la représente par un modèle et par une <b>formule</b> : H₂O contient 2 atomes d\'hydrogène et 1 atome d\'oxygène.',
      'Un <b>corps simple</b> est formé d\'une seule sorte d\'atome (O₂, N₂) ; un <b>corps composé</b> de plusieurs sortes (H₂O, CO₂).'
    ],
    retenirAr: 'الجزيئة تجمع من الذرات، نمثلها بنموذج وبصيغة. الجسم البسيط يتكون من نوع واحد من الذرات، والجسم المركب من عدة أنواع.',
    voc: [['un atome', 'ذرة'], ['une molécule', 'جزيئة'], ['une formule chimique', 'صيغة كيميائية'], ['un corps simple', 'جسم بسيط'], ['un corps composé', 'جسم مركب']]
  });
})();
