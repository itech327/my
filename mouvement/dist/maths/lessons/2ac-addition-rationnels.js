/* @meta {"id":"2ac-addition-rationnels","level":"2","order":2,"theme":"Nombres et calcul","title":"Additionner et soustraire des rationnels","ar":"جمع وطرح الأعداد الجذرية","lead":"Le niveau d'un puits monte de 3/4 m puis baisse de 5/4 m : on suit les sauts sur la droite pour additionner."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 180, U = 70; // une unité = 70 px

  function droite(svg, y) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('line', { x1: 8, y1: y, x2: 352, y2: y, stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    for (var k = -9; k <= 9; k++) { var x = X0 + k * U / 4; if (x < 8 || x > 352) continue; S('line', { x1: x, y1: y - (k % 4 ? 4 : 8), x2: x, y2: y + (k % 4 ? 4 : 8), stroke: '#9aa0a8', 'stroke-width': k % 4 ? 1 : 2 }, g); if (k % 4 === 0) T(g, x, y + 24, k / 4, 'tag'); }
    return g;
  }
  function saut(svg, y) {
    var g = S('g', {}, svg), p = S('path', { fill: 'none', stroke: 'var(--acc)', 'stroke-width': 3 }, g), h = S('path', { fill: 'var(--acc)' }, g), t = T(g, 0, 0, '', 'lbl acc');
    g.set = function (a, b, lab) {
      var x1 = X0 + a * U, x2 = X0 + b * U, mid = (x1 + x2) / 2, top = y - 30 - Math.abs(x2 - x1) / 5;
      p.setAttribute('d', 'M' + x1 + ' ' + y + ' Q' + mid + ' ' + top + ' ' + x2 + ' ' + (y - 4));
      var dir = x2 > x1 ? -1 : 1; h.setAttribute('d', 'M' + x2 + ' ' + (y - 2) + ' l' + (dir * 8) + ' -10 l' + (-dir * 3) + ' 11 z');
      t.setAttribute('x', mid); t.setAttribute('y', top + 8); t.textContent = lab;
    };
    return g;
  }

  MV.lesson({
    id: '2ac-addition-rationnels',
    objectif: {
      fr: 'Additionner et soustraire deux nombres rationnels, avec le même dénominateur ou en réduisant au même dénominateur.',
      ar: 'جمع وطرح عددين جذريين لهما نفس المقام أو بعد توحيد المقامات.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Le niveau d\'un puits',
      hud: [['a', 'variation 1'], ['b', 'variation 2'], ['t', 'total']],
      draw: function (svg) { var e = {}; droite(svg, 140); e.s1 = saut(svg, 140); e.s2 = saut(svg, 140); return e; },
      steps: [
        { cap: 'Après la pluie, le niveau d\'un puits **monte de 3/4 m**.', on: ['s1'], hud: { a: ['+3/4'], b: '–', t: '–' }, run: function (e) { e.s1.set(0, 0.75, '+3/4'); } },
        { cap: 'Puis, avec l\'arrosage, il **baisse de 5/4 m**.', on: ['s1', 's2'], hud: { a: '+3/4', b: ['−5/4'], t: '–' }, run: function (e) { e.s1.set(0, 0.75, '+3/4'); e.s2.set(0.75, -0.5, '−5/4'); } },
        { cap: 'Au total, a-t-il **monté ou baissé** ? De combien ? On le saura à la fin.', on: ['s1', 's2'], hud: { a: '+3/4', b: '−5/4', t: ['?'] }, run: function (e) { e.s1.set(0, 0.75, '+3/4'); e.s2.set(0.75, -0.5, '−5/4'); } }
      ]
    },

    predire: {
      q: "Un puits monte de 3/4 m après la pluie, puis baisse de 5/4 m avec l'arrosage. Que s'est-il passé au total ?",
      ar: "ارتفع ماء بئر بـ [[3/4 m]] ثم انخفض بـ [[5/4 m]]. ماذا حدث في المجموع؟",
      o: ["Il a monté de 2 m", "Il a baissé de 1/2 m", "Il a monté de 1/2 m"],
      a: 1,
      e: "Il baisse plus qu'il ne monte. Comme les dénominateurs sont égaux, on calcule avec les numérateurs : 3 − 5 = −2, donc 3/4 − 5/4 = −2/4 = −1/2.",
      ear: "انخفض المستوى بـ [[1/2 m]]: [[3/4 − 5/4 = −2/4 = −1/2]]."
    },

    prepare: [
      ['3/4 = 6/8', true, 'On multiplie le haut et le bas par 2.'],
      ['(−5) + 3 = −2', true, 'On part de −5 et on avance de 3.'],
      ['1/2 + 1/3 = 2/5', false, 'On n\'additionne pas les dénominateurs : 1/2 + 1/3 = 3/6 + 2/6 = 5/6.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'Des sauts sur la droite',
      hud: [['c', 'calcul'], ['r', 'règle'], ['v', 'résultat']],
      draw: function (svg) { var e = {}; droite(svg, 140); e.s1 = saut(svg, 140); e.s2 = saut(svg, 140); return e; },
      steps: [
        { cap: 'Même dénominateur : on **additionne les numérateurs**. 1/4 + 2/4 = 3/4.', ar: 'إذا كان للعددين نفس المقام نجمع البسطين ونحتفظ بالمقام.', on: ['s1', 's2'], hud: { c: '1/4 + 2/4', r: ['(a + c)/b'], v: ['3/4'] }, run: function (e) { e.s1.set(0, 0.25, '1/4'); e.s2.set(0.25, 0.75, '+2/4'); } },
        { cap: 'Avec des signes : −5/4 + 3/4 = **−2/4** = −1/2.', ar: 'مع الإشارات: [[−5/4 + 3/4 = −2/4 = −1/2]].', on: ['s1', 's2'], hud: { c: '−5/4 + 3/4', r: '(a + c)/b', v: ['−1/2'] }, run: function (e) { e.s1.set(0, -1.25, '−5/4'); e.s2.set(-1.25, -0.5, '+3/4'); } },
        { cap: 'Soustraire, c\'est **ajouter l\'opposé** : 1/4 − 3/4 = 1/4 + (−3/4).', ar: 'طرح عدد هو إضافة مقابله.', on: ['s1', 's2'], hud: { c: '1/4 − 3/4', r: ['+ l\'opposé'], v: ['−2/4'] }, run: function (e) { e.s1.set(0, 0.25, '1/4'); e.s2.set(0.25, -0.5, '−3/4'); } },
        { cap: 'Dénominateurs différents : on les rend **égaux** d\'abord. 1/2 = 2/4.', ar: 'إذا اختلف المقامان نوحدهما أولا.', on: ['s1'], hud: { c: '1/2 + 1/4', r: ['même dénominateur'], v: '2/4 + 1/4' }, run: function (e) { e.s1.set(0, 0.5, '1/2 = 2/4'); } },
        { cap: 'Puis on additionne : 2/4 + 1/4 = **3/4**.', ar: 'ثم نجمع: [[2/4 + 1/4 = 3/4]].', on: ['s1', 's2'], hud: { c: '1/2 + 1/4', r: 'même dénominateur', v: ['3/4'] }, run: function (e) { e.s1.set(0, 0.5, '2/4'); e.s2.set(0.5, 0.75, '+1/4'); } },
        { cap: 'Autre exemple : −2/3 + 1/6 = −4/6 + 1/6 = **−3/6 = −1/2**.', ar: 'مثال: [[−2/3 + 1/6 = −4/6 + 1/6 = −1/2]].', on: ['s1', 's2'], hud: { c: '−2/3 + 1/6', r: '× 2 pour 3 → 6', v: ['−1/2'] }, run: function (e) { e.s1.set(0, -0.667, '−4/6'); e.s2.set(-0.667, -0.5, '+1/6'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis deux nombres en quarts. Regarde les sauts et le résultat.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 180', role: 'img', 'aria-label': 'Addition sur une droite' }, st);
          droite(svg, 130); var s1 = saut(svg, 130), s2 = saut(svg, 130), a = 3, b = -5, set = MV.hud(c, [['c', 'calcul'], ['v', 'résultat', 1]]);
          function f(n) { return (n < 0 ? '−' : '') + Math.abs(n) + '/4'; }
          function upd() { s1.set(0, a / 4, f(a)); s2.set(a / 4, (a + b) / 4, (b < 0 ? '' : '+') + f(b)); set('c', f(a) + ' + (' + f(b) + ')'); set('v', f(a + b)); }
          MV.slider(c, { label: 'a (en 1/4)', min: -8, max: 8, value: 3 }, function (v) { a = v; upd(); });
          MV.slider(c, { label: 'b (en 1/4)', min: -8, max: 8, value: -5 }, function (v) { b = v; upd(); });
          upd(); done();
        } },
      { title: 'Résolvons ensemble', intro: 'Calcule A = 3/5 − 7/10.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Quel dénominateur commun choisir ?', o: ['5', '10', '15'], a: 1, e: '10 est un multiple de 5.' },
            { q: 'Étape 2. 3/5 = ?/10', a: 6, hint: 'On multiplie le haut et le bas par 2.' },
            { q: 'Étape 3. A = 6/10 − 7/10 = ?/10 (numérateur avec son signe)', a: -1, ok: 'A = −1/10.', hint: '6 − 7.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Calcule 2/7 + 3/7 = ?/7', a: 5 },
      { lvl: 'Niveau 2', q: 'Calcule −4/9 + 1/9 = ?/9 (avec le signe)', a: -3 },
      { lvl: 'Niveau 3', q: 'Calcule 1/2 − 3/4 = ?/4 (avec le signe)', a: -1, hint: '1/2 = 2/4.' },
      { lvl: 'Niveau 4', q: 'Un réservoir est rempli aux 5/6. On utilise 1/3 du réservoir. Quelle fraction reste-t-il ? Donne le numérateur sur 6.', a: 3, unit: '/6', hint: '1/3 = 2/6 ; 5/6 − 2/6.' }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'Le puits, au total',
      hud: [['c', 'calcul'], ['v', 'total'], ['s', 'sens']],
      draw: function (svg) { var e = {}; droite(svg, 140); e.s1 = saut(svg, 140); e.s2 = saut(svg, 140); e.s1.setAttribute('data-keep', 1); e.s2.setAttribute('data-keep', 1); return e; },
      steps: [
        { cap: '3/4 + (−5/4) : même dénominateur.', hud: { c: ['3/4 + (−5/4)'], v: '–', s: '–' }, run: function (e) { e.s1.set(0, 0.75, '+3/4'); e.s2.set(0.75, -0.5, '−5/4'); } },
        { cap: '(3 − 5)/4 = −2/4 = **−1/2** : le niveau a baissé d\'un demi-mètre.', ar: 'المستوى انخفض بنصف متر: [[3/4 − 5/4 = −1/2]].', hud: { c: '3/4 − 5/4', v: ['−1/2 m'], s: ['baisse'] }, run: function (e) { e.s1.set(0, 0.75, '+3/4'); e.s2.set(0.75, -0.5, '−5/4'); } }
      ]
    },

    retenir: [
      'Même dénominateur : <b class="mono">a/b + c/b = (a + c)/b</b>. Soustraire un nombre, c\'est <b>ajouter son opposé</b>.',
      'Dénominateurs différents : on écrit d\'abord les deux nombres avec un <b>même dénominateur</b>, puis on additionne les numérateurs.'
    ],
    retenirAr: 'إذا كان للعددين نفس المقام: [[a/b + c/b = (a + c)/b]]. طرح عدد هو إضافة مقابله. إذا اختلف المقامان نوحدهما أولا.',
    voc: [['additionner', 'يجمع'], ['soustraire', 'يطرح'], ['un dénominateur commun', 'مقام مشترك'], ['l\'opposé', 'المقابل']]
  });
})();
