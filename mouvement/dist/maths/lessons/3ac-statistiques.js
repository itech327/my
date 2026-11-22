/* @meta {"id":"3ac-statistiques","level":"3","order":15,"theme":"Organisation de données","title":"Statistiques : moyenne et médiane","ar":"الإحصاء: المعدل والقيمة الوسطية","lead":"Dans un petit atelier, quatre ouvriers gagnent 3 000 DH et le patron 20 000 DH. « Salaire moyen : 6 400 DH ! » annonce l'affiche. Est-ce honnête ? La médiane répond."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 30, W = 300, MAX = 25000;

  function px(v) { return X0 + v / MAX * W; }
  function axe(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('line', { x1: X0, y1: 130, x2: X0 + W, y2: 130, stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    [0, 5000, 10000, 15000, 20000, 25000].forEach(function (v) { S('line', { x1: px(v), y1: 125, x2: px(v), y2: 135, stroke: '#9aa0a8' }, g); T(g, px(v), 150, v / 1000 + ' k', 'tag'); });
    var dyn = S('g', {}, g);
    g.set = function (vals, o) {
      o = o || {};
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var tri = vals.slice().sort(function (a, b) { return a - b; }), n = tri.length, moy = vals.reduce(function (a, b) { return a + b; }, 0) / n;
      var med = n % 2 ? tri[(n - 1) / 2] : (tri[n / 2 - 1] + tri[n / 2]) / 2, cnt = {};
      tri.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; S('circle', { cx: px(v), cy: 120 - (cnt[v] - 1) * 14, r: 6, fill: '#e9e9ea' }, dyn); });
      if (o.moy) { S('line', { x1: px(moy), y1: 40, x2: px(moy), y2: 140, stroke: 'var(--acc)', 'stroke-width': 3 }, dyn); T(dyn, px(moy) + 4, 52, 'moyenne ' + Math.round(moy), 'tag', 'start'); }
      if (o.med) { S('line', { x1: px(med), y1: 60, x2: px(med), y2: 140, stroke: '#7fb2ff', 'stroke-width': 3, 'stroke-dasharray': '6 4' }, dyn); T(dyn, px(med) + 4, 74, 'médiane ' + med, 'tag', 'start'); }
      return [moy, med];
    };
    return g;
  }
  var SAL = [3000, 3000, 3000, 3000, 20000];

  MV.lesson({
    id: '3ac-statistiques',
    objectif: {
      fr: 'Calculer la moyenne et la médiane d\'une série statistique, et choisir l\'indicateur le plus représentatif.',
      ar: 'حساب المعدل والقيمة الوسطية لمتسلسلة إحصائية، واختيار المؤشر الأكثر تمثيلا.'
    },

    ouverture: {
      vb: '0 0 360 170', label: 'Le salaire moyen',
      hud: [['o', 'ouvriers'], ['p', 'patron'], ['q', 'honnête ?']],
      draw: function (svg) { var e = {}; e.a = axe(svg); return e; },
      steps: [
        { cap: 'Quatre ouvriers gagnent **3 000 DH** chacun.', hud: { o: ['4 × 3 000'], p: '–', q: '–' }, run: function (e) { e.a.set([3000, 3000, 3000, 3000]); } },
        { cap: 'Le patron gagne **20 000 DH**. L\'affiche annonce : « salaire moyen 6 400 DH ».', hud: { o: '4 × 3 000', p: ['20 000'], q: '–' }, run: function (e) { e.a.set(SAL, { moy: 1 }); } },
        { cap: 'Aucun ouvrier ne gagne 6 400 DH. Ce chiffre est-il honnête ? On le saura à la fin.', hud: { o: '4 × 3 000', p: '20 000', q: ['?'] }, run: function (e) { e.a.set(SAL, { moy: 1 }); } }
      ]
    },

    predire: {
      q: "Quatre ouvriers gagnent 3 000 DH et le patron 20 000 DH. Quel indicateur décrit le mieux un salaire typique ?",
      ar: "أربعة عمال يتقاضون [[3 000 DH]] والمدير [[20 000 DH]]. أي مؤشر يصف الأجر المعتاد أفضل؟",
      o: ["La moyenne, 6 400 DH", "La médiane, 3 000 DH", "Le salaire maximal, 20 000 DH"],
      a: 1,
      e: "La moyenne, 6 400 DH, est tirée vers le haut par une valeur extrême. La médiane, 3 000 DH, est la valeur du milieu de la série : elle décrit mieux le salaire typique.",
      ear: "المتوسط [[6 400 DH]] يرفعه الأجر الاستثنائي، أما الوسيط [[3 000 DH]] فيصف الأجر المعتاد."
    },

    prepare: [
      ['La moyenne de 2, 4, 9 est 5.', true, '15 ÷ 3 = 5.'],
      ['Une valeur très grande peut tirer la moyenne vers le haut.', true, 'La moyenne est sensible aux valeurs extrêmes.'],
      ['Pour trouver la médiane, on n\'a pas besoin de ranger les valeurs.', false, 'Il faut d\'abord les ranger dans l\'ordre.']
    ],

    regarde: {
      vb: '0 0 360 170', label: 'Moyenne et médiane',
      hud: [['n', 'indicateur'], ['c', 'calcul'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.a = axe(svg); return e; },
      steps: [
        { cap: 'La **moyenne** : (4 × 3 000 + 20 000) ÷ 5 = **6 400 DH**.', ar: 'المعدل: [[(4 × 3000 + 20000) ÷ 5 = 6400]].', hud: { n: ['moyenne'], c: '32 000 ÷ 5', v: ['6 400'] }, run: function (e) { e.a.set(SAL, { moy: 1 }); } },
        { cap: 'La **médiane** : on **range** les valeurs, et on prend celle **du milieu**. Ici la 3e sur 5 : **3 000 DH**.', ar: 'القيمة الوسطية: نرتب القيم ونأخذ القيمة التي في الوسط.', hud: { n: ['médiane'], c: 'valeur du milieu', v: ['3 000'] }, run: function (e) { e.a.set(SAL, { moy: 1, med: 1 }); } },
        { cap: 'La médiane partage la série en **deux moitiés** : autant de valeurs en dessous qu\'au-dessus.', ar: 'القيمة الوسطية تقسم المتسلسلة إلى نصفين.', hud: { n: 'médiane', c: '50 % / 50 %', v: '3 000' }, run: function (e) { e.a.set(SAL, { med: 1 }); } },
        { cap: 'Avec un nombre **pair** de valeurs : moyenne des deux du milieu. 2, 5, 7, 10 : médiane (5 + 7) ÷ 2 = **6**.', ar: 'إذا كان عدد القيم زوجيا نأخذ معدل القيمتين الوسطيتين.', hud: { n: 'effectif pair', c: '(5 + 7) ÷ 2', v: ['6'] }, run: function (e) { e.a.set([2000, 5000, 7000, 10000], { med: 1 }); } },
        { cap: 'La médiane résiste aux **valeurs extrêmes** ; la moyenne, non.', ar: 'القيمة الوسطية لا تتأثر بالقيم المتطرفة، عكس المعدل.', hud: { n: 'comparaison', c: 'valeur extrême', v: ['médiane stable'] }, run: function (e) { e.a.set(SAL, { moy: 1, med: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change le salaire du patron. Que deviennent la moyenne et la médiane ? Fais monter la moyenne à 7 000 DH.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 170', role: 'img', 'aria-label': 'Salaires sur un axe' }, st);
          var a = axe(svg), set = MV.hud(c, [['p', 'patron'], ['m', 'moyenne', 1], ['d', 'médiane']]);
          MV.slider(c, { label: 'salaire du patron (DH)', min: 3000, max: 25000, value: 20000, step: 1000 }, function (p) { var r = a.set([3000, 3000, 3000, 3000, p], { moy: 1, med: 1 }); set('p', p); set('m', Math.round(r[0])); set('d', r[1]); if (Math.round(r[0]) === 7000) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Série : 12, 7, 15, 9, 10, 11.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Série rangée :', o: ['7, 9, 10, 11, 12, 15', '12, 7, 15, 9, 10, 11'], a: 0 },
            { q: 'Étape 2. Médiane : (10 + 11) ÷ 2 = ?', a: 10.5 },
            { q: 'Étape 3. Moyenne : 64 ÷ 6 ≈ ? (arrondi au dixième)', a: 10.7, tol: 0.05 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Médiane de 3, 8, 5, 1, 9 ?', a: 5 },
      { lvl: 'Niveau 2', q: 'Médiane de 4, 6, 8, 20 ?', a: 7 },
      { lvl: 'Niveau 3', q: 'Moyenne de 4, 6, 8, 20 ?', a: 9.5 },
      { lvl: 'Niveau 4', q: 'Quel indicateur est le moins influencé par une valeur extrême ?', o: ['la médiane', 'la moyenne'], a: 0 }
    ],

    bilan: {
      vb: '0 0 360 170', label: 'Honnête ou pas ?',
      hud: [['m', 'moyenne'], ['d', 'médiane'], ['c', 'conclusion']],
      draw: function (svg) { var e = {}; e.a = axe(svg); return e; },
      steps: [
        { cap: 'Moyenne : **6 400 DH**, tirée vers le haut par le seul salaire du patron.', hud: { m: ['6 400'], d: '–', c: '–' }, run: function (e) { e.a.set(SAL, { moy: 1 }); } },
        { cap: 'Médiane : **3 000 DH**. Elle décrit mieux le salaire d\'un ouvrier : l\'affiche est **trompeuse**.', ar: 'المعدل 6400 درهم يرفعه أجر صاحب الورشة، أما القيمة الوسطية 3000 درهم فتمثل أجر العمال أحسن.', hud: { m: '6 400', d: ['3 000'], c: ['l\'affiche trompe'] }, run: function (e) { e.a.set(SAL, { moy: 1, med: 1 }); } }
      ]
    },

    retenir: [
      'La <b>moyenne</b> = somme des valeurs ÷ effectif total ; elle est sensible aux <b>valeurs extrêmes</b>.',
      'La <b>médiane</b> : on range les valeurs ; c\'est la valeur du milieu (ou la moyenne des deux valeurs du milieu si l\'effectif est pair). Elle partage la série en deux moitiés.'
    ],
    retenirAr: 'المعدل = مجموع القيم ÷ الحصيص الإجمالي، ويتأثر بالقيم المتطرفة. القيمة الوسطية هي القيمة التي توجد في وسط المتسلسلة بعد ترتيبها، وتقسمها إلى نصفين.',
    voc: [['la moyenne', 'المعدل'], ['la médiane', 'القيمة الوسطية'], ['une série statistique', 'متسلسلة إحصائية'], ['une valeur extrême', 'قيمة متطرفة']]
  });
})();
