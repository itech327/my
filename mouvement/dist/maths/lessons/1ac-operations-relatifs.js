/* @meta {"id":"1ac-operations-relatifs","level":"1","order":4,"theme":"Nombres et calcul","title":"Additionner et soustraire des relatifs","ar":"جمع وطرح الأعداد النسبية","lead":"Le matin il fait −3 °C, à midi la température monte de 5 degrés : on avance sur la droite pour calculer."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 180, U = 22;
  function m(n) { return String(n).replace('-', '−'); }
  function sg(n) { return n > 0 ? '+' + n : m(n); }

  function droite(svg, y) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('line', { x1: 8, y1: y, x2: 352, y2: y, stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    for (var k = -7; k <= 7; k++) { S('line', { x1: X0 + k * U, y1: y - 6, x2: X0 + k * U, y2: y + 6, stroke: '#9aa0a8', 'stroke-width': k ? 1.2 : 3 }, g); if (k % 2 === 0) T(g, X0 + k * U, y + 24, m(k), 'tag'); }
    return g;
  }
  function saut(svg, y) {
    var g = S('g', { 'data-keep': 1 }, svg), dep = S('circle', { r: 6, fill: '#7fb2ff' }, g), p = S('path', { fill: 'none', stroke: 'var(--acc)', 'stroke-width': 3 }, g), h = S('path', { fill: 'var(--acc)' }, g), t = T(g, 0, 0, '', 'lbl acc'), arr = S('circle', { r: 7, fill: 'var(--acc)', stroke: '#fff', 'stroke-width': 2 }, g);
    g.set = function (a, b) {
      var x1 = X0 + a * U, x2 = X0 + (a + b) * U, mid = (x1 + x2) / 2, top = y - 26 - Math.abs(x2 - x1) / 4;
      dep.setAttribute('cx', x1); dep.setAttribute('cy', y); arr.setAttribute('cx', x2); arr.setAttribute('cy', y);
      if (b === 0) { p.setAttribute('d', ''); h.setAttribute('d', ''); t.textContent = ''; return; }
      p.setAttribute('d', 'M' + x1 + ' ' + y + ' Q' + mid + ' ' + top + ' ' + x2 + ' ' + (y - 6));
      var dir = x2 > x1 ? -1 : 1; h.setAttribute('d', 'M' + x2 + ' ' + (y - 4) + ' l' + (dir * 8) + ' -10 l' + (-dir * 3) + ' 11 z');
      t.setAttribute('x', mid); t.setAttribute('y', top + 6); t.textContent = sg(b);
    };
    return g;
  }

  MV.lesson({
    id: '1ac-operations-relatifs',
    objectif: {
      fr: 'Additionner deux nombres relatifs et soustraire un nombre relatif en ajoutant son opposé.',
      ar: 'جمع عددين نسبيين وطرح عدد نسبي بإضافة مقابله.'
    },

    ouverture: {
      vb: '0 0 360 180', label: 'Une température qui monte',
      hud: [['m', 'matin'], ['v', 'variation'], ['q', 'midi']],
      draw: function (svg) { var e = {}; droite(svg, 120); e.s = saut(svg, 120); return e; },
      steps: [
        { cap: 'À Midelt, le matin, il fait **−3 °C**.', hud: { m: ['−3 °C'], v: '–', q: '–' }, run: function (e) { e.s.set(-3, 0); } },
        { cap: 'À midi, la température **monte de 5 degrés**.', hud: { m: '−3 °C', v: ['+5'], q: '–' }, run: function (e) { e.s.set(-3, 5); } },
        { cap: 'Combien fait-il à midi ? Comment **calculer** (−3) + 5 ? On le saura à la fin.', hud: { m: '−3 °C', v: '+5', q: ['?'] }, run: function (e) { e.s.set(-3, 5); } }
      ]
    },

    prepare: [
      ['L\'opposé de −4 est 4.', true, 'Ils sont à la même distance de zéro.'],
      ['Sur la droite, ajouter un nombre positif fait avancer vers la droite.', true, 'Ajouter un négatif fait reculer vers la gauche.'],
      ['−6 > −2', false, '−6 est plus à gauche : −6 < −2.']
    ],

    regarde: {
      vb: '0 0 360 180', label: 'Des sauts sur la droite graduée',
      hud: [['c', 'calcul'], ['r', 'règle'], ['v', 'résultat']],
      draw: function (svg) { var e = {}; droite(svg, 120); e.s = saut(svg, 120); return e; },
      steps: [
        { cap: 'Additionner, c\'est **sauter** depuis le premier nombre. (+2) + (+3) = +5.', ar: 'الجمع قفزة على المستقيم انطلاقا من العدد الأول.', hud: { c: '(+2) + (+3)', r: ['même signe'], v: ['+5'] }, run: function (e) { e.s.set(2, 3); } },
        { cap: 'Deux négatifs : on recule. (−2) + (−3) = **−5**. On ajoute les distances, on garde le signe.', ar: 'عددان سالبان: نجمع المسافتين ونحتفظ بالإشارة.', hud: { c: '(−2) + (−3)', r: ['même signe'], v: ['−5'] }, run: function (e) { e.s.set(-2, -3); } },
        { cap: 'Signes contraires : (−2) + (+5) = **+3**. On soustrait les distances.', ar: 'إشارتان مختلفتان: نطرح المسافتين.', hud: { c: '(−2) + (+5)', r: ['signes contraires'], v: ['+3'] }, run: function (e) { e.s.set(-2, 5); } },
        { cap: 'Le signe est celui du nombre le **plus loin de zéro**. (+2) + (−6) = −4.', ar: 'الإشارة هي إشارة العدد الأبعد عن الصفر.', hud: { c: '(+2) + (−6)', r: 'signes contraires', v: ['−4'] }, run: function (e) { e.s.set(2, -6); } },
        { cap: 'Soustraire, c\'est **ajouter l\'opposé** : (+1) − (+4) = (+1) + (−4) = −3.', ar: 'طرح عدد هو إضافة مقابله.', hud: { c: '(+1) − (+4)', r: ['+ l\'opposé'], v: ['−3'] }, run: function (e) { e.s.set(1, -4); } },
        { cap: 'Et (−2) − (−5) = (−2) + (+5) = **+3**.', ar: 'و [[(−2) − (−5) = (−2) + (+5) = +3]].', hud: { c: '(−2) − (−5)', r: '+ l\'opposé', v: ['+3'] }, run: function (e) { e.s.set(-2, 5); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis le point de départ et le saut. Lis le résultat.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 160', role: 'img', 'aria-label': 'Addition sur la droite' }, st);
          droite(svg, 110); var s = saut(svg, 110), a = -3, b = 5, set = MV.hud(c, [['c', 'calcul'], ['v', 'résultat', 1]]);
          function upd() { var r = a + b; if (r < -7 || r > 7) { b = Math.max(-7 - a, Math.min(7 - a, b)); r = a + b; } s.set(a, b); set('c', '(' + sg(a) + ') + (' + sg(b) + ')'); set('v', sg(r)); }
          MV.slider(c, { label: 'départ', min: -7, max: 7, value: -3, fmt: sg }, function (v) { a = v; upd(); });
          MV.slider(c, { label: 'saut', min: -7, max: 7, value: 5, fmt: sg }, function (v) { b = v; upd(); });
          upd(); done();
        } },
      { title: 'Résolvons ensemble', intro: 'Calcule A = (−7) − (−3).',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Soustraire −3, c\'est :', o: ['ajouter −3', 'ajouter +3'], a: 1, e: 'On ajoute l\'opposé.' },
            { type: 'opt', q: 'Étape 2. A = (−7) + (+3). Les signes sont :', o: ['les mêmes', 'contraires'], a: 1 },
            { q: 'Étape 3. A = ? (avec le signe)', a: -4, ok: '7 − 3 = 4, signe de −7 : A = −4.', hint: 'Différence des distances, signe du plus loin de zéro.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Calcule (−4) + (−5).', a: -9 },
      { lvl: 'Niveau 2', q: 'Calcule (+8) + (−11).', a: -3 },
      { lvl: 'Niveau 3', q: 'Calcule (−6) − (−9).', a: 3, hint: '(−6) + (+9).' },
      { lvl: 'Niveau 4', q: 'Un plongeur est à −12 m. Il remonte de 7 m. À quelle profondeur est-il ? (nombre relatif)', a: -5, unit: 'm' }
    ],

    bilan: {
      vb: '0 0 360 180', label: 'La température de midi',
      hud: [['c', 'calcul'], ['v', 'résultat'], ['r', 'réponse']],
      draw: function (svg) { var e = {}; droite(svg, 120); e.s = saut(svg, 120); return e; },
      steps: [
        { cap: '(−3) + (+5) : signes contraires, on soustrait les distances : 5 − 3 = **2**.', hud: { c: ['(−3) + (+5)'], v: '–', r: '–' }, run: function (e) { e.s.set(-3, 5); } },
        { cap: 'Le signe de +5, le plus loin de zéro : il fait **+2 °C** à midi.', ar: 'الحرارة عند الزوال [[+2 °C]].', hud: { c: '(−3) + (+5)', v: ['+2'], r: ['2 °C'] }, run: function (e) { e.s.set(-3, 5); } }
      ]
    },

    retenir: [
      'Même signe : on <b>ajoute les distances à zéro</b> et on garde le signe. Signes contraires : on <b>soustrait</b> les distances et on prend le signe du nombre le plus loin de zéro.',
      'Soustraire un nombre, c\'est <b>ajouter son opposé</b> : a − b = a + (−b).'
    ],
    retenirAr: 'إذا كان للعددين نفس الإشارة نجمع المسافتين ونحتفظ بالإشارة. إذا اختلفت الإشارتان نطرح المسافتين ونأخذ إشارة العدد الأبعد عن الصفر. طرح عدد هو إضافة مقابله.',
    voc: [['la somme', 'المجموع'], ['la différence', 'الفرق'], ['l\'opposé', 'المقابل'], ['ajouter', 'يضيف']]
  });
})();
