/* @meta {"id":"1ac-proportionnalite","level":"1","order":16,"theme":"Organisation de données","title":"La proportionnalité","ar":"التناسبية","lead":"2 kg d'oranges coûtent 14 DH. Combien pour 5 kg ? Et 3 kg de tomates à 4 DH le kilo plus 2 DH de sac, est-ce proportionnel ? Un coefficient répond."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 40, Y0 = 185, UX = 30, UY = 3.6; // graphe : masse 0 à 10 kg, prix 0 à 45 DH

  function px(x, y) { return [X0 + x * UX, Y0 - y * UY]; }
  function graphe(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    S('path', { d: 'M' + X0 + ' 15 V' + Y0 + ' H' + (X0 + 10 * UX + 6), stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, g);
    T(g, X0 + 10 * UX, Y0 + 16, 'kg', 'tag', 'end'); T(g, X0 + 6, 20, 'DH', 'tag', 'start');
    [0, 2, 4, 6, 8, 10].forEach(function (x) { T(g, px(x, 0)[0], Y0 + 16, x, 'tag'); });
    [10, 20, 30, 40].forEach(function (y) { T(g, X0 - 6, px(0, y)[1] + 4, y, 'tag', 'end'); });
    dyn = S('g', {}, g);
    g.set = function (series) { // [[k, b, couleur, points]]
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      series.forEach(function (s) {
        var p = px(0, s[1]), q = px(Math.min(10, (45 - s[1]) / s[0]), Math.min(45, s[0] * 10 + s[1]));
        S('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: s[2], 'stroke-width': 3 }, dyn);
        (s[3] || []).forEach(function (x) { var c = px(x, s[0] * x + s[1]); S('circle', { cx: c[0], cy: c[1], r: 5, fill: '#e9e9ea' }, dyn); });
      });
    };
    return g;
  }
  var OR = 'var(--acc)', BL = '#7fb2ff';

  MV.lesson({
    id: '1ac-proportionnalite',
    objectif: {
      fr: 'Reconnaître une situation de proportionnalité, calculer le coefficient et une quatrième proportionnelle, et utiliser les pourcentages.',
      ar: 'التعرف على وضعية تناسبية، وحساب معامل التناسب والرابع المتناسب، واستعمال النسب المئوية.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Au marché',
      hud: [['o', 'oranges'], ['t', 'tomates'], ['q', 'proportionnel ?']],
      draw: function (svg) { var e = {}; e.g = graphe(svg); return e; },
      steps: [
        { cap: '**2 kg** d\'oranges coûtent **14 DH**. Combien pour 5 kg ?', hud: { o: ['2 kg → 14 DH'], t: '–', q: '–' }, run: function (e) { e.g.set([[7, 0, OR, [2]]]); } },
        { cap: 'Les tomates : **4 DH le kilo**, plus **2 DH** pour le sac.', hud: { o: '2 kg → 14 DH', t: ['4x + 2'], q: '–' }, run: function (e) { e.g.set([[7, 0, OR, [2]], [4, 2, BL, [3]]]); } },
        { cap: 'Lequel des deux prix est **proportionnel** à la masse ? On le saura à la fin.', hud: { o: '2 kg → 14 DH', t: '4x + 2', q: ['?'] }, run: function (e) { e.g.set([[7, 0, OR, [2]], [4, 2, BL, [3]]]); } }
      ]
    },

    predire: {
      q: "Les tomates coûtent 4 DH le kilo, plus 2 DH pour le sac. Le prix est-il proportionnel à la masse ?",
      ar: "الطماطم [[4 DH]] للكيلوغرام زائد [[2 DH]] ثمن الكيس. هل الثمن متناسب مع الكتلة؟",
      o: ["Oui, 2 kg coûtent le double de 1 kg", "Non, 2 kg ne coûtent pas le double de 1 kg", "On ne peut pas savoir"],
      a: 1,
      e: "1 kg coûte 4 + 2 = 6 DH et 2 kg coûtent 8 + 2 = 10 DH, pas 12 DH. Les 2 DH du sac cassent la proportionnalité. Pour les oranges, au contraire, 5 kg coûtent 5 × 7 = 35 DH.",
      ear: "[[1 kg = 6 DH]] و[[2 kg = 10 DH]] وليس [[12 DH]]، فثمن الكيس يُفسد التناسب."
    },

    prepare: [
      ['Si 1 cahier coûte 6 DH, 3 cahiers coûtent 18 DH.', true, '3 × 6 = 18.'],
      ['L\'âge et la taille d\'un enfant sont proportionnels.', false, 'La taille n\'est pas multipliée par 2 quand l\'âge double.'],
      ['25 % signifie 25 sur 100.', true, 'C\'est le quart.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Le coefficient de proportionnalité',
      hud: [['t', 'tableau'], ['c', 'coefficient'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.g = graphe(svg); return e; },
      steps: [
        { cap: 'Oranges : 2 kg → 14 DH, 4 kg → 28 DH, 6 kg → 42 DH. On multiplie toujours par **7**.', ar: 'نضرب دائما في 7: هذا جدول تناسبية.', hud: { t: ['2 → 14 ; 4 → 28 ; 6 → 42'], c: ['× 7'], r: 'proportionnel' }, run: function (e) { e.g.set([[7, 0, OR, [2, 4, 6]]]); } },
        { cap: '7 est le **coefficient de proportionnalité** : le prix d\'un kilo.', ar: '7 هو معامل التناسب.', hud: { t: 'prix = 7 × masse', c: ['7'], r: '–' }, run: function (e) { e.g.set([[7, 0, OR, [1, 2, 4, 6]]]); } },
        { cap: '**Quatrième proportionnelle** : 5 kg → 5 × 7 = **35 DH**.', ar: 'الرابع المتناسب: [[5 × 7 = 35]] درهما.', hud: { t: '5 kg → ?', c: '× 7', r: ['35 DH'] }, run: function (e) { e.g.set([[7, 0, OR, [2, 5]]]); } },
        { cap: 'Graphiquement, une situation proportionnelle donne des points **alignés avec l\'origine**.', ar: 'تمثيل وضعية تناسبية نقط مستقيمية مع أصل المعلم.', hud: { t: 'graphique', c: 'droite par O', r: ['proportionnel'] }, run: function (e) { e.g.set([[7, 0, OR, [1, 2, 3, 4, 5, 6]]]); } },
        { cap: 'Tomates : 1 kg → 6 DH, 2 kg → 10 DH. 6/1 ≠ 10/2 : **pas proportionnel** ; la droite ne passe pas par l\'origine.', ar: 'الطماطم: [[6 ÷ 1 ≠ 10 ÷ 2]]، إذن ليست وضعية تناسبية.', hud: { t: ['1 → 6 ; 2 → 10'], c: 'pas constant', r: ['non proportionnel'] }, run: function (e) { e.g.set([[4, 2, BL, [1, 2, 3]]]); } },
        { cap: '**Pourcentage** : 20 % de 150 DH = 150 × 20 ÷ 100 = **30 DH**.', ar: 'النسبة المئوية: 20% من 150 درهما تساوي 30 درهما.', hud: { t: '20 %', c: '× 20/100', r: ['30 DH'] }, run: function (e) { e.g.set([[7, 0, OR, []]]); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change la masse d\'oranges. Trouve la masse qui coûte 42 DH.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Prix et masse' }, st);
          var g = graphe(svg), set = MV.hud(c, [['m', 'masse'], ['p', 'prix = 7 × masse', 1]]);
          MV.slider(c, { label: 'masse (kg)', min: 1, max: 6, value: 2 }, function (m) { g.set([[7, 0, OR, [m]]]); set('m', m + ' kg'); set('p', 7 * m + ' DH'); if (m === 6) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: '3 stylos coûtent 12 DH. Le prix est proportionnel au nombre de stylos.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Prix d\'un stylo (DH) ?', a: 4 },
            { q: 'Étape 2. Prix de 8 stylos (DH) ?', a: 32 },
            { q: 'Étape 3. Avec une réduction de 25 % sur 32 DH, on économise ? DH', a: 8 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: '4 kg → 20 DH. Coefficient (prix d\'un kg) ?', a: 5 },
      { lvl: 'Niveau 2', q: '5 L d\'essence coûtent 70 DH. Prix de 8 L (DH) ?', a: 112 },
      { lvl: 'Niveau 3', q: '10 % de 240 = ?', a: 24 },
      { lvl: 'Niveau 4', q: 'Un tableau 2 → 9 ; 4 → 18 ; 6 → 28. Est-il proportionnel ?', o: ['non', 'oui'], a: 0, hint: '6 × 4,5 = 27, pas 28.' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Oranges et tomates',
      hud: [['o', 'oranges'], ['t', 'tomates'], ['r', 'réponse']],
      draw: function (svg) { var e = {}; e.g = graphe(svg); return e; },
      steps: [
        { cap: 'Oranges : coefficient **7**, droite par l\'origine : **proportionnel**. 5 kg → **35 DH**.', hud: { o: ['× 7 : 35 DH'], t: '–', r: '–' }, run: function (e) { e.g.set([[7, 0, OR, [2, 5]]]); } },
        { cap: 'Tomates : le sac ajoute 2 DH, la droite ne passe pas par O : **non proportionnel**.', ar: 'ثمن البرتقال متناسب مع الكتلة، أما ثمن الطماطم فلا، بسبب ثمن الكيس.', hud: { o: '× 7 : 35 DH', t: ['non proportionnel'], r: ['oranges seulement'] }, run: function (e) { e.g.set([[7, 0, OR, [2, 5]], [4, 2, BL, [1, 2, 3]]]); } }
      ]
    },

    retenir: [
      'Deux grandeurs sont <b>proportionnelles</b> si on passe de l\'une à l\'autre en multipliant toujours par le même nombre : le <b>coefficient de proportionnalité</b>. Leur graphique est une droite passant par l\'origine.',
      'Pour trouver une <b>quatrième proportionnelle</b>, on utilise le coefficient. <b>t %</b> d\'une quantité Q : <b class="mono">Q × t ÷ 100</b>.'
    ],
    retenirAr: 'تكون مقداران متناسبين إذا انتقلنا من أحدهما إلى الآخر بالضرب دائما في نفس العدد، وهو معامل التناسب، ويكون تمثيلهما نقطا مستقيمية مع الأصل. t% من Q تساوي [[Q × t ÷ 100]].',
    voc: [['proportionnel', 'متناسب'], ['le coefficient de proportionnalité', 'معامل التناسب'], ['la quatrième proportionnelle', 'الرابع المتناسب'], ['un pourcentage', 'نسبة مئوية']]
  });
})();
