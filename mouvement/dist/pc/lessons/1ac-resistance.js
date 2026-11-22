/* @meta {"id":"1ac-resistance","level":"1","order":16,"theme":"Électricité","title":"Influence de la résistance sur l'intensité","ar":"تأثير المقاومة على شدة التيار","lead":"On ajoute une petite pièce, un « conducteur ohmique », dans le circuit d'une lampe : elle brille moins. Plus la résistance est grande, moins le courant passe."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, U = 6, RL = 20;

  function circuit(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('path', { d: 'M60 40 H300 V95 M300 125 V180 H60 V118 M60 104 V40', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 3 }, g);
    S('line', { x1: 44, y1: 104, x2: 76, y2: 104, stroke: '#e9e9ea', 'stroke-width': 3 }, g); S('line', { x1: 52, y1: 118, x2: 68, y2: 118, stroke: '#e9e9ea', 'stroke-width': 6 }, g); T(g, 30, 115, '6 V', 'tag', 'end');
    var dyn = S('g', {}, g);
    g.set = function (R) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var I = U / (RL + R), k = Math.min(1, I / 0.3);
      var lp = S('circle', { cx: 300, cy: 110, r: 16, fill: 'rgba(242,193,78,' + (0.1 + 0.9 * k) + ')', stroke: '#e9e9ea', 'stroke-width': 2.5 }, dyn); lp.style.filter = 'drop-shadow(0 0 ' + Math.round(14 * k) + 'px #f2c14e)';
      S('path', { d: 'M289 99 l22 22 M311 99 l-22 22', stroke: '#141517', 'stroke-width': 2 }, dyn);
      if (R > 0) { S('rect', { x: 150, y: 172, width: 60, height: 16, fill: '#1d1f23', stroke: 'var(--acc)', 'stroke-width': 2.5 }, dyn); T(dyn, 180, 202, 'R = ' + R + ' Ω', 'tag'); }
      S('circle', { cx: 180, cy: 40, r: 14, fill: '#1d1f23', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn); T(dyn, 180, 45, 'A', 'lbl');
      T(dyn, 180, 72, 'I = ' + Math.round(I * 1000) + ' mA', 'lbl acc');
      return I;
    };
    return g;
  }

  MV.lesson({
    id: '1ac-resistance',
    objectif: {
      fr: 'Savoir qu\'un conducteur ohmique ajouté en série diminue l\'intensité du courant, d\'autant plus que sa résistance (en ohms) est grande.',
      ar: 'معرفة أن إضافة موصل أومي على التوالي تنقص شدة التيار، وكلما كانت مقاومته (بالأوم) أكبر كان النقصان أكبر.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Une lampe qui faiblit',
      hud: [['l', 'lampe'], ['p', 'pièce ajoutée'], ['q', 'pourquoi ?']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'Une lampe brille normalement dans un circuit simple.', hud: { l: ['brille'], p: '–', q: '–' }, run: function (e) { e.c.set(0); } },
        { cap: 'On ajoute en série un petit composant : un **conducteur ohmique**. La lampe brille **moins**.', hud: { l: ['faible'], p: ['conducteur ohmique'], q: '–' }, run: function (e) { e.c.set(30); } },
        { cap: 'Que fait ce composant au courant ? On le saura à la fin.', hud: { l: 'faible', p: 'conducteur ohmique', q: ['?'] }, run: function (e) { e.c.set(30); } }
      ]
    },

    predire: {
      q: "Une lampe brille normalement. On ajoute en série un conducteur ohmique : elle brille moins. Que fait ce composant au courant ?",
      ar: "مصباح يضيء بشكل عادي. نضيف على التوالي موصلاً أومياً فيخفت الضوء. ماذا يفعل هذا المركّب بالتيار؟",
      o: ["Il augmente l'intensité", "Il ne change rien", "Il diminue l'intensité"],
      a: 2,
      e: "Un conducteur ohmique en série s'oppose au passage du courant. Plus sa résistance R est grande, plus l'intensité est petite, donc plus la lampe brille faiblement.",
      ear: "الموصل الأومي على التوالي يعيق مرور التيار: كلما كبرت [[R]] صغرت الشدة وخفت الإضاءة."
    },

    prepare: [
      ['L\'intensité se mesure avec un ampèremètre en série.', true, 'Vu dans une leçon précédente.'],
      ['Une lampe brille plus quand l\'intensité diminue.', false, 'Elle brille moins.'],
      ['La résistance s\'exprime en ohms (Ω).', true, 'Avec un ohmmètre.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'La résistance freine le courant',
      hud: [['r', 'résistance'], ['i', 'intensité'], ['l', 'lampe']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'Sans conducteur ohmique : I = **300 mA**, la lampe brille bien.', ar: 'بدون موصل أومي: شدة التيار 300 ملي أمبير.', hud: { r: '0 Ω', i: ['300 mA'], l: 'forte' }, run: function (e) { e.c.set(0); } },
        { cap: 'Avec R = **10 Ω** : I = **200 mA**, la lampe brille moins.', ar: 'مع مقاومة 10 أوم تنقص الشدة.', hud: { r: ['10 Ω'], i: ['200 mA'], l: 'moyenne' }, run: function (e) { e.c.set(10); } },
        { cap: 'Avec R = **40 Ω** : I = **100 mA**. Plus la **résistance** est grande, plus l\'**intensité** est petite.', ar: 'كلما كبرت المقاومة صغرت شدة التيار.', hud: { r: ['40 Ω'], i: ['100 mA'], l: 'faible' }, run: function (e) { e.c.set(40); } },
        { cap: 'La place du conducteur ohmique dans la boucle **n\'a pas d\'importance** : l\'effet est le même avant ou après la lampe.', ar: 'موضع الموصل الأومي في الدارة على التوالي لا يغير شيئا.', hud: { r: 'avant ou après', i: 'identique', l: '–' }, run: function (e) { e.c.set(40); } },
        { cap: 'Usage : protéger une **diode LED** qui grillerait avec un courant trop fort.', ar: 'نستعمله لحماية الصمام الثنائي المضيء من تيار قوي.', hud: { r: ['protection'], i: 'limitée', l: 'LED protégée' }, run: function (e) { e.c.set(100); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change la résistance. Obtiens une intensité de 50 mA.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Circuit avec conducteur ohmique' }, st);
          var ci = circuit(svg), set = MV.hud(c, [['r', 'R'], ['i', 'I', 1]]);
          MV.slider(c, { label: 'résistance R (Ω)', min: 0, max: 120, value: 10, step: 10 }, function (R) { var I = ci.set(R); set('r', R + ' Ω'); set('i', Math.round(I * 1000) + ' mA'); if (R === 100) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'On compare deux conducteurs ohmiques de 47 Ω et 220 Ω, branchés tour à tour avec la même lampe et la même pile.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. L\'intensité la plus grande est obtenue avec :', o: ['47 Ω', '220 Ω'], a: 0 },
            { type: 'opt', q: 'Étape 2. La lampe brille le moins avec :', o: ['220 Ω', '47 Ω'], a: 0 },
            { type: 'opt', q: 'Étape 3. Si on place le conducteur après la lampe au lieu d\'avant, l\'intensité :', o: ['ne change pas', 'double'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'L\'unité de la résistance est :', o: ['l\'ohm', 'l\'ampère'], a: 0 },
      { lvl: 'Niveau 2', q: 'Si on augmente la résistance du circuit, l\'intensité :', o: ['diminue', 'augmente'], a: 0 },
      { lvl: 'Niveau 3', q: 'Pour protéger une LED, on ajoute en série :', o: ['un conducteur ohmique', 'un fil sans résistance'], a: 0 },
      { lvl: 'Niveau 4', q: 'I passe de 300 mA à 100 mA. Elle a été divisée par ?', a: 3 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'La lampe faiblit',
      hud: [['s', 'sans R'], ['a', 'avec R'], ['r', 'raison']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'Sans conducteur ohmique : **300 mA**.', hud: { s: ['300 mA'], a: '–', r: '–' }, run: function (e) { e.c.set(0); } },
        { cap: 'Avec R = 30 Ω : **120 mA**. La résistance **freine** le courant : la lampe brille moins.', ar: 'الموصل الأومي يقاوم مرور التيار فتنقص الشدة ويضعف إضاءة المصباح.', hud: { s: '300 mA', a: ['120 mA'], r: ['la résistance freine'] }, run: function (e) { e.c.set(30); } }
      ]
    },

    retenir: [
      'Un <b>conducteur ohmique</b> est caractérisé par sa <b>résistance</b> R, en <b>ohms (Ω)</b>. Ajouté en série, il <b>diminue l\'intensité</b> du courant.',
      'Plus R est grande, plus l\'intensité est petite. Sa place dans le circuit en série n\'a pas d\'importance. On s\'en sert pour protéger les composants (LED…).'
    ],
    retenirAr: 'الموصل الأومي يتميز بمقاومته بالأوم، وعند إضافته على التوالي تنقص شدة التيار، وكلما كبرت المقاومة صغرت الشدة.',
    voc: [['un conducteur ohmique', 'موصل أومي'], ['la résistance', 'المقاومة'], ['l\'ohm', 'الأوم'], ['l\'intensité', 'الشدة']]
  });
})();
