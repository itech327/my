/* @meta {"id":"1ac-intensite","level":"1","order":11,"theme":"Électricité","title":"Mesure de l'intensité du courant","ar":"قياس شدة التيار الكهربائي","lead":"La lampe « consomme »-t-elle le courant ? On mesure avant et après elle avec un ampèremètre… et on trouve exactement la même valeur."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, I = 0.18; // intensité en A
  var POS = { 'avant la lampe': [180, 40], 'après la lampe': [180, 180], 'près de la pile': [60, 150] };

  function circuit(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn;
    S('path', { d: 'M60 40 H300 V90 M300 130 V180 H60 V118 M60 104 V40', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 3 }, g);
    S('line', { x1: 44, y1: 104, x2: 76, y2: 104, stroke: '#e9e9ea', 'stroke-width': 3 }, g); S('line', { x1: 52, y1: 118, x2: 68, y2: 118, stroke: '#e9e9ea', 'stroke-width': 6 }, g); T(g, 30, 115, 'pile', 'tag', 'end');
    S('circle', { cx: 300, cy: 110, r: 20, fill: '#f2c14e', stroke: '#e9e9ea', 'stroke-width': 3 }, g); S('path', { d: 'M286 96 L314 124 M314 96 L286 124', stroke: '#141517', 'stroke-width': 2.5 }, g); T(g, 328, 114, 'lampe', 'tag', 'start');
    dyn = S('g', {}, g);
    g.set = function (pos, cal) { // cal en A ; renvoie la lecture
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var p = POS[pos]; S('circle', { cx: p[0], cy: p[1], r: 18, fill: '#1d1f23', stroke: 'var(--acc)', 'stroke-width': 3 }, dyn); T(dyn, p[0], p[1] + 6, 'A', 'lbl');
      var lec = cal == null ? I : I > cal ? 'dépassé' : I;
      var txt = cal == null ? '0,18 A' : I > cal ? '1 _ _ _ (calibre trop petit)' : (cal >= 1 ? '0,18 A' : '180 mA');
      T(dyn, p[0], p[1] + (p[1] > 150 ? -26 : 36), txt, 'tag acc');
      return lec;
    };
    return g;
  }

  MV.lesson({
    id: '1ac-intensite',
    objectif: {
      fr: 'Mesurer l\'intensité du courant avec un ampèremètre branché en série, choisir le calibre, et savoir que l\'intensité est la même en tout point d\'un circuit en série.',
      ar: 'قياس شدة التيار بأمبيرمتر مركب على التوالي، واختيار العيار، ومعرفة أن الشدة هي نفسها في جميع نقط دارة على التوالي.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Le courant est-il consommé ?',
      hud: [['a', 'avant la lampe'], ['p', 'après la lampe'], ['q', 'différence ?']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'Une pile alimente une **lampe**. Beaucoup pensent que la lampe **use** le courant.', hud: { a: '?', p: '?', q: '–' }, run: function (e) { e.c.set('avant la lampe'); } },
        { cap: 'On mesure le courant **avant** la lampe : **0,18 A**.', hud: { a: ['0,18 A'], p: '?', q: '–' }, run: function (e) { e.c.set('avant la lampe'); } },
        { cap: 'Et **après** la lampe ? On le saura à la fin.', hud: { a: '0,18 A', p: '?', q: ['?'] }, run: function (e) { e.c.set('après la lampe'); } }
      ]
    },

    prepare: [
      ['L\'intensité du courant se mesure en ampères (A).', true, 'Symbole A.'],
      ['1 A = 100 mA.', false, '1 A = 1 000 mA.'],
      ['Un voltmètre et un ampèremètre se branchent de la même façon.', false, 'L\'ampèremètre se branche en série, le voltmètre en dérivation.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'L\'ampèremètre',
      hud: [['b', 'branchement'], ['u', 'unité'], ['m', 'mesure']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'L\'**intensité** I mesure le débit du courant. Unité : l\'**ampère (A)** ; 1 A = 1 000 mA.', ar: 'شدة التيار تقاس بالأمبير، و [[1 A = 1000 mA]].', hud: { b: '–', u: ['A, mA'], m: '–' }, run: function (e) { e.c.set('avant la lampe'); } },
        { cap: 'L\'**ampèremètre** se branche **en série** : on ouvre le circuit et on l\'insère dans la boucle.', ar: 'يركب الأمبيرمتر على التوالي في الدارة.', hud: { b: ['en série'], u: 'A', m: '0,18 A' }, run: function (e) { e.c.set('avant la lampe'); } },
        { cap: 'Le courant entre par la borne **mA** ou **A**, et sort par la borne **COM**.', ar: 'يدخل التيار من المربط A أو mA ويخرج من المربط COM.', hud: { b: 'mA ou A → COM', u: 'A', m: '0,18 A' }, run: function (e) { e.c.set('avant la lampe'); } },
        { cap: 'On commence par le **plus grand calibre**, puis on descend. Un calibre trop petit affiche « 1 » à gauche.', ar: 'نبدأ بأكبر عيار ثم ننزل تدريجيا.', hud: { b: 'calibre', u: '10 A → 200 mA', m: ['180 mA'] }, run: function (e) { e.c.set('avant la lampe', 0.2); } },
        { cap: 'Dans un circuit **en série**, l\'intensité est **la même partout** : la lampe n\'use pas le courant.', ar: 'في دارة على التوالي تكون الشدة هي نفسها في جميع النقط.', hud: { b: 'partout', u: 'A', m: ['0,18 A partout'] }, run: function (e) { e.c.set('près de la pile'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Place l\'ampèremètre à trois endroits, puis choisis un calibre qui convient.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Circuit avec ampèremètre' }, st);
          var ci = circuit(svg), pos = 'avant la lampe', cal = 10, vu = {}, okc = 0, set = MV.hud(c, [['p', 'position'], ['c', 'calibre'], ['m', 'mesure', 1]]);
          function upd() { var l = ci.set(pos, cal); set('p', pos); set('c', cal >= 1 ? cal + ' A' : cal * 1000 + ' mA'); set('m', l === 'dépassé' ? 'calibre trop petit' : (cal < 1 ? '180 mA' : '0,18 A')); vu[pos] = 1; if (cal === 0.2) okc = 1; if (Object.keys(vu).length === 3 && okc) done(); }
          var r1 = MV.H('div', 'row', '', c); Object.keys(POS).forEach(function (k) { var b = MV.H('button', 'btn', k, r1); b.onclick = function () { pos = k; upd(); }; });
          var r2 = MV.H('div', 'row', '', c); [[10, '10 A'], [0.2, '200 mA'], [0.02, '20 mA']].forEach(function (x) { var b = MV.H('button', 'btn', 'Calibre ' + x[1], r2); b.onclick = function () { cal = x[0]; upd(); }; });
          upd();
          MV.H('p', 'small', 'Le meilleur calibre est le plus petit qui dépasse la valeur mesurée.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Un ampèremètre indique 0,35 A.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. En mA : 0,35 A = ? mA', a: 350 },
            { type: 'opt', q: 'Étape 2. Calibres : 20 mA, 200 mA, 2 A, 10 A. Le meilleur :', o: ['2 A', '200 mA', '10 A'], a: 0 },
            { type: 'opt', q: 'Étape 3. Après le moteur du même circuit en série, on mesure :', o: ['toujours 0,35 A', 'moins de 0,35 A'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'L\'ampèremètre se branche :', o: ['en série', 'en dérivation'], a: 0 },
      { lvl: 'Niveau 2', q: '250 mA = ? A', a: 0.25 },
      { lvl: 'Niveau 3', q: 'Dans un circuit en série, on mesure 0,2 A avant une lampe. Après elle :', o: ['0,2 A', '0 A'], a: 0 },
      { lvl: 'Niveau 4', q: '1,2 A = ? mA', a: 1200 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Avant et après la lampe',
      hud: [['a', 'avant'], ['p', 'après'], ['c', 'conclusion']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'Avant la lampe : **0,18 A**. Après la lampe : **0,18 A**.', hud: { a: ['0,18 A'], p: ['0,18 A'], c: '–' }, run: function (e) { e.c.set('après la lampe'); } },
        { cap: 'L\'intensité est la **même partout** en série : la lampe ne « consomme » pas le courant.', ar: 'الشدة هي نفسها قبل المصباح وبعده: المصباح لا يستهلك التيار.', hud: { a: '0,18 A', p: '0,18 A', c: ['même intensité'] }, run: function (e) { e.c.set('près de la pile'); } }
      ]
    },

    retenir: [
      'L\'<b>intensité</b> I se mesure en <b>ampères</b> (A) avec un <b>ampèremètre</b> branché <b>en série</b> ; 1 A = 1 000 mA. On commence par le plus grand calibre.',
      'Dans un circuit <b>en série</b>, l\'intensité est <b>la même en tout point</b>.'
    ],
    retenirAr: 'تقاس شدة التيار بالأمبير بواسطة أمبيرمتر يركب على التوالي، و [[1 A = 1000 mA]]. في دارة على التوالي تكون الشدة هي نفسها في جميع النقط.',
    voc: [['l\'intensité', 'الشدة'], ['un ampèremètre', 'أمبيرمتر'], ['en série', 'على التوالي'], ['le calibre', 'العيار'], ['l\'ampère', 'الأمبير']]
  });
})();
