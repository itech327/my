/* @meta {"id":"2ac-statistique","level":"2","order":17,"theme":"Organisation de données","title":"Statistique : moyenne et effectifs cumulés","ar":"الإحصاء: المعدل والحصيصات المتراكمة","lead":"Au contrôle, Nora a eu 8, 14, 12 et 10. Que lui faut-il au dernier devoir pour avoir 12 de moyenne ? La moyenne, c'est l'égalisation des bâtons."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, Y0 = 175, K = 7; // 1 point = 7 px

  function batons(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('line', { x1: 30, y1: Y0, x2: 340, y2: Y0, stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    var dyn = S('g', {}, g);
    g.set = function (notes, o) { // o.moy : trait de moyenne ; o.egal : bâtons égalisés
      o = o || {};
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var m = notes.reduce(function (a, b) { return a + b; }, 0) / notes.length;
      notes.forEach(function (n, i) {
        var h = (o.egal ? m : n) * K, x = 50 + i * 58;
        S('rect', { x: x, y: Y0 - h, width: 38, height: h, rx: 3, fill: i === notes.length - 1 && o.der ? '#f2c14e' : 'var(--acc)' }, dyn);
        T(dyn, x + 19, Y0 - h - 6, String(Math.round((o.egal ? m : n) * 10) / 10).replace('.', ','), 'lbl'); T(dyn, x + 19, Y0 + 16, 'D' + (i + 1), 'tag');
      });
      if (o.moy) { S('line', { x1: 40, y1: Y0 - m * K, x2: 330, y2: Y0 - m * K, stroke: '#7fb2ff', 'stroke-width': 2.5, 'stroke-dasharray': '6 4' }, dyn); T(dyn, 336, Y0 - m * K - 6, 'moyenne', 'tag', 'end'); }
      return m;
    };
    return g;
  }

  MV.lesson({
    id: '2ac-statistique',
    objectif: {
      fr: 'Calculer la moyenne arithmétique d\'une série (simple ou avec effectifs), déterminer le mode et les effectifs cumulés.',
      ar: 'حساب المعدل الحسابي لمتسلسلة (بسيطة أو بالحصيصات)، وتحديد المنوال والحصيصات المتراكمة.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Les notes de Nora',
      hud: [['n', 'notes'], ['o', 'objectif'], ['q', 'dernier devoir ?']],
      draw: function (svg) { var e = {}; e.b = batons(svg); return e; },
      steps: [
        { cap: 'Les quatre premières notes de Nora : **8, 14, 12, 10**.', hud: { n: ['8, 14, 12, 10'], o: '–', q: '–' }, run: function (e) { e.b.set([8, 14, 12, 10]); } },
        { cap: 'Elle veut **12 de moyenne** après cinq devoirs.', hud: { n: '8, 14, 12, 10', o: ['12'], q: '–' }, run: function (e) { e.b.set([8, 14, 12, 10]); } },
        { cap: 'Quelle note lui faut-il au cinquième ? On le saura à la fin.', hud: { n: '8, 14, 12, 10', o: '12', q: ['?'] }, run: function (e) { e.b.set([8, 14, 12, 10, 0], { der: 1 }); } }
      ]
    },

    predire: {
      q: "Nora a eu 8, 14, 12 et 10. Quelle note doit-elle avoir au cinquième devoir pour une moyenne de 12 ?",
      ar: "نقط نورة: [[8]] و[[14]] و[[12]] و[[10]]. ما النقطة اللازمة في الفرض الخامس لتبلغ المعدل [[12]]؟",
      o: ["12", "14", "16"],
      a: 2,
      e: "Pour 12 de moyenne sur 5 notes, il faut un total de 5 × 12 = 60. Elle a déjà 8 + 14 + 12 + 10 = 44. Il lui faut donc 60 − 44 = 16. Avoir 12 ne suffit pas : ses notes précédentes valent 11 de moyenne.",
      ear: "المجموع اللازم [[5 × 12 = 60]] ولديها [[44]]، إذن تحتاج [[60 − 44 = 16]]."
    },

    prepare: [
      ['La moyenne de 10 et 14 est 12.', true, '(10 + 14) ÷ 2 = 12.'],
      ['La moyenne est toujours une des valeurs de la série.', false, 'La moyenne de 1 et 2 est 1,5.'],
      ['Le mode est la valeur la plus fréquente.', true, 'Celle de plus grand effectif.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'La moyenne',
      hud: [['n', 'notion'], ['c', 'calcul'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.b = batons(svg); return e; },
      steps: [
        { cap: 'La **moyenne** = somme des valeurs ÷ nombre de valeurs : (8 + 14 + 12 + 10) ÷ 4 = **11**.', ar: 'المعدل = مجموع القيم ÷ عددها.', hud: { n: ['moyenne'], c: '44 ÷ 4', v: ['11'] }, run: function (e) { e.b.set([8, 14, 12, 10], { moy: 1 }); } },
        { cap: 'C\'est la hauteur commune si on **égalise** tous les bâtons.', ar: 'المعدل هو الارتفاع المشترك عندما نسوي جميع الأعمدة.', hud: { n: 'égalisation', c: 'même total', v: '11 partout' }, run: function (e) { e.b.set([8, 14, 12, 10], { moy: 1, egal: 1 }); } },
        { cap: 'Avec des **effectifs** : notes 10 (×3) et 15 (×2) : (10 × 3 + 15 × 2) ÷ 5 = **12**.', ar: 'المعدل المرجح بالحصيصات: [[(10 × 3 + 15 × 2) ÷ 5 = 12]].', hud: { n: ['moyenne pondérée'], c: '(30 + 30) ÷ 5', v: ['12'] }, run: function (e) { e.b.set([10, 10, 10, 15, 15], { moy: 1 }); } },
        { cap: 'Les **effectifs cumulés** : nombre de valeurs **inférieures ou égales** à chaque valeur. Ici 3 notes ≤ 10, puis 5 notes ≤ 15.', ar: 'الحصيص المتراكم: عدد القيم الأصغر من أو تساوي قيمة معينة.', hud: { n: ['effectifs cumulés'], c: '3 ; 3 + 2', v: '3 ; 5' }, run: function (e) { e.b.set([10, 10, 10, 15, 15]); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis la note du cinquième devoir. Obtiens exactement 12 de moyenne.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Notes en bâtons' }, st);
          var b = batons(svg), set = MV.hud(c, [['n', 'note D5'], ['m', 'moyenne', 1]]);
          MV.slider(c, { label: 'note du 5e devoir', min: 0, max: 20, value: 10 }, function (n) { var m = b.set([8, 14, 12, 10, n], { moy: 1, der: 1 }); set('n', n); set('m', String(Math.round(m * 10) / 10).replace('.', ',')); if (m === 12) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Âges d\'une équipe : 13 ans (4 joueurs), 14 ans (5 joueurs), 15 ans (1 joueur).',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Effectif total ?', a: 10 },
            { q: 'Étape 2. Moyenne : (13 × 4 + 14 × 5 + 15) ÷ 10 = ?', a: 13.7 },
            { q: 'Étape 3. Le mode (âge) ?', a: 14 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Moyenne de 6, 9, 12 ?', a: 9 },
      { lvl: 'Niveau 2', q: 'Moyenne de 10 (×2) et 16 (×1) ?', a: 12 },
      { lvl: 'Niveau 3', q: 'Série 2, 5, 5, 7, 5, 9. Mode ?', a: 5 },
      { lvl: 'Niveau 4', q: 'Effectifs : 4, 6, 5. Effectif cumulé de la 2e valeur ?', a: 10 }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'La note nécessaire',
      hud: [['t', 'total voulu'], ['a', 'déjà obtenu'], ['n', 'note D5']],
      draw: function (svg) { var e = {}; e.b = batons(svg); return e; },
      steps: [
        { cap: 'Pour 12 de moyenne sur 5 devoirs, il faut **60 points** au total. Elle en a **44**.', hud: { t: ['60'], a: ['44'], n: '–' }, run: function (e) { e.b.set([8, 14, 12, 10, 16], { moy: 1, der: 1 }); } },
        { cap: 'Il lui faut **60 − 44 = 16** au dernier devoir.', ar: 'تحتاج نورة إلى 16 في الفرض الأخير.', hud: { t: '60', a: '44', n: ['16'] }, run: function (e) { e.b.set([8, 14, 12, 10, 16], { moy: 1, der: 1 }); } }
      ]
    },

    retenir: [
      'La <b>moyenne</b> d\'une série est la somme des valeurs divisée par l\'effectif total. Avec des effectifs : <b class="mono">(x₁n₁ + x₂n₂ + …) ÷ N</b>.',
      'Le <b>mode</b> est la valeur de plus grand effectif. L\'<b>effectif cumulé</b> d\'une valeur est le nombre de données inférieures ou égales à cette valeur.'
    ],
    retenirAr: 'المعدل = مجموع القيم ÷ الحصيص الإجمالي، ومع الحصيصات [[(x₁n₁ + x₂n₂ + …) ÷ N]]. المنوال هو القيمة ذات أكبر حصيص، والحصيص المتراكم عدد القيم الأصغر من أو تساوي قيمة معينة.',
    voc: [['la moyenne', 'المعدل'], ['l\'effectif total', 'الحصيص الإجمالي'], ['l\'effectif cumulé', 'الحصيص المتراكم'], ['le mode', 'المنوال']]
  });
})();
