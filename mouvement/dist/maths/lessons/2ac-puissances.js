/* @meta {"id":"2ac-puissances","level":"2","order":8,"theme":"Nombres et calcul","title":"Les puissances","ar":"القوى","lead":"Une bactérie se divise en deux toutes les 20 minutes : après 3 heures, combien sont-elles ? Les puissances comptent les doublements."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* 2^n points rangés en grille */
  function points(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    g.set = function (n) {
      while (g.firstChild) g.removeChild(g.firstChild);
      var N = Math.pow(2, n), cols = Math.ceil(Math.sqrt(N * 1.6)), r = Math.max(2, Math.min(14, 120 / cols)), gap = r * 2.4;
      for (var i = 0; i < N; i++) { var x = 180 - (cols - 1) * gap / 2 + (i % cols) * gap, y = 40 + Math.floor(i / cols) * gap; S('circle', { cx: x, cy: y, r: r, fill: 'var(--acc)' }, g); }
    };
    return g;
  }

  MV.lesson({
    id: '2ac-puissances',
    objectif: {
      fr: 'Écrire et calculer des puissances, utiliser les règles de calcul et les puissances de 10.',
      ar: 'كتابة وحساب القوى، واستعمال قواعد الحساب وقوى العدد 10.'
    },

    prerequis: {
      fr: 'Multiplication de nombres relatifs ; écriture d\'un produit de facteurs égaux.',
      ar: 'ضرب الأعداد النسبية وكتابة جداء عوامل متساوية.'
    },

    ouverture: {
      vb: '0 0 360 240', label: 'Des bactéries qui doublent',
      hud: [['t', 'temps'], ['n', 'bactéries'], ['q', 'après 3 h']],
      draw: function (svg) { var e = {}; e.p = points(svg); return e; },
      steps: [
        { cap: 'Une **bactérie** dans un verre de lait laissé au chaud.', hud: { t: ['0 min'], n: ['1'], q: '–' }, run: function (e) { e.p.set(0); } },
        { cap: 'Toutes les 20 minutes, chaque bactérie se **divise en deux**.', hud: { t: '20 min', n: ['2'], q: '–' }, run: function (e) { e.p.set(1); setTimeout(function () { e.p.set(2); }, 900); } },
        { cap: 'Après 1 h : 2 × 2 × 2 = **8**. Après 3 h ? On le saura à la fin.', hud: { t: '1 h', n: ['8'], q: ['?'] }, run: function (e) { e.p.set(3); } }
      ]
    },

    predire: {
      q: "Une bactérie se divise en deux toutes les 20 minutes. Combien y en a-t-il après 3 heures ?",
      ar: "تنقسم بكتيريا إلى اثنتين كل [[20]] دقيقة. كم يصبح عددها بعد [[3]] ساعات؟",
      o: ["18", "64", "512"],
      a: 2,
      e: "En 3 heures, il y a 9 divisions de 20 minutes. Le nombre double 9 fois : 2⁹ = 512. Il augmente bien plus vite que 2 × 9 = 18, c'est la croissance par puissances.",
      ear: "في 3 ساعات تحدث 9 انقسامات، فيتضاعف العدد 9 مرات: [[2⁹ = 512]]."
    },

    prepare: [
      ['2 × 2 × 2 = 6', false, '2 × 2 × 2 = 8. On multiplie, on n\'additionne pas.'],
      ['10 × 10 × 10 = 1 000', true, 'Trois facteurs 10 : trois zéros.'],
      ['(−3) × (−3) est positif.', true, 'Même signe : produit positif.']
    ],

    regarde: {
      vb: '0 0 360 240', label: 'Doublements et puissances',
      hud: [['e', 'écriture'], ['s', 'sens'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.p = points(svg); return e; },
      steps: [
        { cap: '2 × 2 × 2 × 2 s\'écrit **2⁴** : « 2 puissance 4 ». 4 est l\'**exposant**.', ar: 'نكتب [[2 × 2 × 2 × 2 = 2⁴]]، و 4 هو الأس.', hud: { e: ['2⁴'], s: '4 facteurs 2', v: ['16'] }, run: function (e) { e.p.set(4); } },
        { cap: 'Multiplier : **2³ × 2² = 2⁵**. On ajoute les exposants.', ar: 'عند الضرب نجمع الأسس: [[2³ × 2² = 2⁵]].', hud: { e: ['aⁿ × aᵐ = aⁿ⁺ᵐ'], s: '3 + 2', v: ['32'] }, run: function (e) { e.p.set(5); } },
        { cap: 'Diviser : **2⁵ ÷ 2² = 2³**. On soustrait les exposants.', ar: 'عند القسمة نطرح الأسس: [[2⁵ ÷ 2² = 2³]].', hud: { e: ['aⁿ ÷ aᵐ = aⁿ⁻ᵐ'], s: '5 − 2', v: ['8'] }, run: function (e) { e.p.set(3); } },
        { cap: 'Par convention, **a⁰ = 1** et **a⁻ⁿ = 1/aⁿ**. 2⁻³ = 1/8.', ar: 'اصطلاحا [[a⁰ = 1]] و [[a⁻ⁿ = 1/aⁿ]].', hud: { e: ['2⁰ = 1, 2⁻³ = 1/8'], s: 'convention', v: '1/8' }, run: function (e) { e.p.set(0); } },
        { cap: 'Puissance de puissance : **(2²)³ = 2⁶**. On multiplie les exposants.', ar: 'قوة قوة: [[(2²)³ = 2⁶]]، نضرب الأسس.', hud: { e: ['(aⁿ)ᵐ = aⁿˣᵐ'], s: '2 × 3', v: ['64'] }, run: function (e) { e.p.set(6); } },
        { cap: 'Puissances de 10 : **10⁶** = 1 000 000 (6 zéros) ; 10⁻³ = 0,001.', ar: 'قوى العدد 10: [[10⁶ = 1 000 000]] و [[10⁻³ = 0,001]].', hud: { e: ['10ⁿ'], s: 'n zéros', v: ['1 000 000'] }, run: function (e) { e.p.set(6); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Fais passer le temps : chaque étape, les bactéries doublent.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 240', role: 'img', 'aria-label': 'Bactéries' }, st);
          var p = points(svg), set = MV.hud(c, [['t', 'temps'], ['e', 'puissance', 1], ['v', 'nombre', 1]]);
          MV.slider(c, { label: 'doublements', min: 0, max: 9, value: 0 }, function (n) { p.set(n); set('t', (n * 20) + ' min'); set('e', '2' + '⁰¹²³⁴⁵⁶⁷⁸⁹'[n]); set('v', Math.pow(2, n)); if (n === 9) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Va jusqu\'à 9 doublements, soit 3 heures.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Simplifie A = 3⁴ × 3⁻² ÷ 3.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. 3⁴ × 3⁻² = 3^? (donne l\'exposant)', a: 2, hint: '4 + (−2).' },
            { q: 'Étape 2. 3² ÷ 3¹ = 3^?', a: 1 },
            { q: 'Étape 3. A = ?', a: 3 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Calcule 5³.', a: 125 },
      { lvl: 'Niveau 2', q: 'Écris 7² × 7⁵ sous la forme 7ⁿ. n = ?', a: 7 },
      { lvl: 'Niveau 3', q: 'Calcule (−2)³.', a: -8, hint: 'Trois facteurs négatifs : produit négatif.' },
      { lvl: 'Niveau 4', q: 'Écris 0,0001 sous la forme 10ⁿ. n = ?', a: -4 }
    ],

    bilan: {
      vb: '0 0 360 240', label: 'Après 3 heures',
      hud: [['d', 'doublements'], ['e', 'puissance'], ['v', 'bactéries']],
      draw: function (svg) { var e = {}; e.p = points(svg); return e; },
      steps: [
        { cap: '3 heures = 9 périodes de 20 min : **9 doublements**.', hud: { d: ['9'], e: '2⁹', v: '–' }, run: function (e) { e.p.set(9); } },
        { cap: '2⁹ = **512** bactéries. D\'où l\'intérêt de garder le lait au frais.', ar: 'بعد ثلاث ساعات: [[2⁹ = 512]] بكتيريا.', hud: { d: '9', e: ['2⁹'], v: ['512'] }, run: function (e) { e.p.set(9); } }
      ]
    },

    retenir: [
      '<b class="mono">aⁿ</b> est le produit de n facteurs égaux à a. <b class="mono">aⁿ × aᵐ = aⁿ⁺ᵐ</b> ; <b class="mono">aⁿ ÷ aᵐ = aⁿ⁻ᵐ</b> ; <b class="mono">(aⁿ)ᵐ = aⁿˣᵐ</b> ; a⁰ = 1 ; a⁻ⁿ = 1/aⁿ (a ≠ 0).',
      '<b>10ⁿ</b> s\'écrit avec un 1 suivi de n zéros ; 10⁻ⁿ = 0,0…01 avec n chiffres après la virgule.'
    ],
    retenirAr: 'القوة [[aⁿ]] جداء n عوامل كلها تساوي a. [[aⁿ × aᵐ = aⁿ⁺ᵐ]] و [[aⁿ ÷ aᵐ = aⁿ⁻ᵐ]] و [[(aⁿ)ᵐ = aⁿˣᵐ]].',
    voc: [['une puissance', 'قوة'], ['l\'exposant', 'الأس'], ['la base', 'الأساس'], ['une puissance de 10', 'قوة العدد 10']]
  });
})();
