/* @meta {"id":"2ac-quatre-operations","level":"2","order":6,"theme":"Numérique","title":"Les quatre opérations sur les nombres rationnels","ar":"العمليات الأربع على الأعداد الجذرية","lead":"Ahmed dépense le tiers de son argent, puis le quart de ce qui reste. Quelle fraction lui reste-t-il ? Une barre découpée et les priorités répondent."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X = 30, W = 300, Y = 70, H = 50;

  /* barre de l'argent d'Ahmed, en 12 parts */
  function barre(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (parts, lab) { // parts : liste [nb de douzièmes, couleur, texte]
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var x = X;
      parts.forEach(function (p) {
        var w = p[0] / 12 * W; S('rect', { x: x, y: Y, width: w, height: H, fill: p[1], stroke: '#141517', 'stroke-width': 2 }, dyn);
        if (p[2]) { var t = T(dyn, x + w / 2, Y + H / 2 + 5, p[2], 'lbl'); t.style.fill = '#141517'; }
        x += w;
      });
      for (var i = 1; i < 12; i++) S('line', { x1: X + i * W / 12, y1: Y, x2: X + i * W / 12, y2: Y + 8, stroke: 'rgba(0,0,0,.4)' }, dyn);
      if (lab) T(dyn, X + W / 2, Y + H + 34, lab, 'lbl acc');
    };
    return g;
  }
  var GRIS = '#5b6068', OR = 'var(--acc)', BL = '#7fb2ff', VE = '#56d07f';

  MV.lesson({
    id: '2ac-quatre-operations',
    objectif: {
      fr: 'Enchaîner les quatre opérations sur des nombres rationnels en respectant les priorités et les règles des signes.',
      ar: 'إنجاز سلسلة من العمليات الأربع على الأعداد الجذرية مع احترام الأولويات وقواعد الإشارات.'
    },

    ouverture: {
      vb: '0 0 360 180', label: 'L\'argent d\'Ahmed',
      hud: [['d1', '1re dépense'], ['d2', '2e dépense'], ['q', 'reste ?']],
      draw: function (svg) { var e = {}; e.b = barre(svg); return e; },
      steps: [
        { cap: 'Ahmed a une somme d\'argent : la **barre entière**.', hud: { d1: '–', d2: '–', q: '–' }, run: function (e) { e.b.set([[12, VE, '1']]); } },
        { cap: 'Il dépense le **tiers** de son argent au marché.', hud: { d1: ['1/3'], d2: '–', q: '–' }, run: function (e) { e.b.set([[4, GRIS, '1/3'], [8, VE, '']]); } },
        { cap: 'Puis le **quart de ce qui reste**. Quelle fraction lui reste-t-il ? On le saura à la fin.', hud: { d1: '1/3', d2: ['1/4 du reste'], q: ['?'] }, run: function (e) { e.b.set([[4, GRIS, '1/3'], [8, VE, 'reste']]); } }
      ]
    },

    prepare: [
      ['1/3 + 1/6 = 1/2', true, '2/6 + 1/6 = 3/6 = 1/2.'],
      ['(−2/3) × (−3/4) est négatif.', false, 'Deux facteurs négatifs : le produit est positif, 1/2.'],
      ['Dans 1 − 2 × 1/4, on calcule d\'abord la multiplication.', true, 'La multiplication est prioritaire sur la soustraction.']
    ],

    regarde: {
      vb: '0 0 360 180', label: 'Les priorités avec des fractions',
      hud: [['e', 'expression'], ['r', 'règle'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.b = barre(svg); return e; },
      steps: [
        { cap: 'Ce qui reste après la 1re dépense : **1 − 1/3 = 2/3**.', ar: 'الباقي بعد المصروف الأول: [[1 − 1/3 = 2/3]].', hud: { e: ['1 − 1/3'], r: 'même dénominateur', v: ['2/3'] }, run: function (e) { e.b.set([[4, GRIS, '1/3'], [8, VE, '2/3']]); } },
        { cap: 'Le quart du reste : **1/4 × 2/3 = 2/12 = 1/6**. « De » se traduit par une multiplication.', ar: 'ربع الباقي: [[1/4 × 2/3 = 1/6]].', hud: { e: ['1/4 × 2/3'], r: '« de » = ×', v: ['1/6'] }, run: function (e) { e.b.set([[4, GRIS, '1/3'], [2, OR, '1/6'], [6, VE, '']]); } },
        { cap: 'Tout en une expression : **1 − 1/3 − 1/4 × (1 − 1/3)**.', ar: 'نكتب كل شيء في تعبير واحد.', hud: { e: ['1 − 1/3 − 1/4 × (1 − 1/3)'], r: 'parenthèses d\'abord', v: '–' }, run: function (e) { e.b.set([[4, GRIS, '1/3'], [2, OR, '1/6'], [6, VE, '?']]); } },
        { cap: 'Priorités : **parenthèses**, puis **× et ÷**, puis **+ et −** de gauche à droite.', ar: 'الأولويات: الأقواس، ثم الضرب والقسمة، ثم الجمع والطرح من اليسار إلى اليمين.', hud: { e: '1 − 1/3 − 1/6', r: ['( ) puis × ÷ puis + −'], v: '–' }, run: function (e) { e.b.set([[4, GRIS, '1/3'], [2, OR, '1/6'], [6, VE, '?']]); } },
        { cap: '1 − 1/3 − 1/6 = 6/6 − 2/6 − 1/6 = **3/6 = 1/2**.', ar: 'نوحد المقامات: [[6/6 − 2/6 − 1/6 = 1/2]].', hud: { e: '6/6 − 2/6 − 1/6', r: 'même dénominateur', v: ['1/2'] }, run: function (e) { e.b.set([[4, GRIS, '1/3'], [2, OR, '1/6'], [6, VE, '1/2']]); } },
        { cap: 'Diviser par une fraction, c\'est **multiplier par son inverse** : (1/2) ÷ (3/4) = 1/2 × 4/3 = **2/3**.', ar: 'القسمة على كسر هي الضرب في مقلوبه.', hud: { e: ['(1/2) ÷ (3/4)'], r: ['× inverse'], v: ['2/3'] }, run: function (e) { e.b.set([[6, VE, '1/2'], [6, GRIS, '']]); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change la fraction de la 2e dépense (en douzièmes du total). Trouve celle qui laisse exactement la moitié.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 180', role: 'img', 'aria-label': 'Barre de fractions' }, st);
          var b = barre(svg), set = MV.hud(c, [['d', '2e dépense'], ['r', 'reste', 1]]);
          function f(n) { var a = n, d = 12; var p = function (x, y) { return y ? p(y, x % y) : x; }, k = p(a, d); return (a / k) + '/' + (d / k); }
          MV.slider(c, { label: '2e dépense (douzièmes)', min: 0, max: 8, value: 4 }, function (n) { b.set([[4, GRIS, '1/3'], [n, OR, n ? f(n) : ''], [8 - n, VE, 8 - n ? f(8 - n) : '']]); set('d', n ? f(n) : '0'); set('r', 8 - n ? f(8 - n) : '0'); if (n === 2) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Calcule A = 3/4 − 1/2 × 5/6.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. On calcule d\'abord :', o: ['1/2 × 5/6', '3/4 − 1/2'], a: 0 },
            { type: 'opt', q: 'Étape 2. 1/2 × 5/6 =', o: ['5/12', '6/8', '5/6'], a: 0 },
            { type: 'opt', q: 'Étape 3. A = 9/12 − 5/12 =', o: ['1/3', '4/24', '1/2'], a: 0, e: '4/12 = 1/3.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: '2/5 + 1/5 × 3 = ? (écris la fraction sous forme décimale)', a: 1 },
      { lvl: 'Niveau 2', q: '(−3/4) × (8/9) =', o: ['−2/3', '2/3', '−24/9'], a: 0 },
      { lvl: 'Niveau 3', q: '(2/3) ÷ (4/9) = ? (en décimal)', a: 1.5 },
      { lvl: 'Niveau 4', q: 'Un réservoir est plein aux 3/4. On utilise la moitié de ce contenu. Fraction du réservoir restante, en décimal ?', a: 0.375, hint: '3/4 × 1/2 = 3/8.' }
    ],

    bilan: {
      vb: '0 0 360 180', label: 'Ce qui reste à Ahmed',
      hud: [['e', 'expression'], ['c', 'calcul'], ['r', 'reste']],
      draw: function (svg) { var e = {}; e.b = barre(svg); return e; },
      steps: [
        { cap: 'Reste = 1 − 1/3 − 1/4 × 2/3 = 1 − 1/3 − 1/6.', hud: { e: ['1 − 1/3 − 1/4 × 2/3'], c: '1 − 1/3 − 1/6', r: '–' }, run: function (e) { e.b.set([[4, GRIS, '1/3'], [2, OR, '1/6'], [6, VE, '?']]); } },
        { cap: 'Il lui reste **la moitié** de son argent : 1/2.', ar: 'يبقى لأحمد نصف ماله.', hud: { e: '1 − 1/3 − 1/4 × 2/3', c: '6/6 − 2/6 − 1/6', r: ['1/2'] }, run: function (e) { e.b.set([[4, GRIS, '1/3'], [2, OR, '1/6'], [6, VE, '1/2']], 'il reste la moitié'); } }
      ]
    },

    retenir: [
      'Priorités : <b>parenthèses</b>, puis <b>× et ÷</b>, puis <b>+ et −</b> de gauche à droite. Pour + et −, on réduit au <b>même dénominateur</b>.',
      '<b class="mono">a/b × c/d = ac/bd</b> ; diviser par c/d, c\'est multiplier par <b class="mono">d/c</b>. Règle des signes : deux signes identiques donnent +, deux signes différents donnent −.'
    ],
    retenirAr: 'الأولويات: الأقواس ثم الضرب والقسمة ثم الجمع والطرح من اليسار إلى اليمين. للجمع والطرح نوحد المقامات، والقسمة على كسر هي الضرب في مقلوبه.',
    voc: [['un nombre rationnel', 'عدد جذري'], ['les priorités', 'الأولويات'], ['l\'inverse', 'المقلوب'], ['le dénominateur commun', 'المقام المشترك']]
  });
})();
