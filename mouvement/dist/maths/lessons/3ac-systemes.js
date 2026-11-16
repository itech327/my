/* @meta {"id":"3ac-systemes","level":"3","order":5,"theme":"Algèbre","title":"Systèmes de deux équations","ar":"نظمات معادلتين","lead":"Au souk, 2 kg de pommes et 1 kg de bananes coûtent 32 DH ; 1 kg de pommes et 3 kg de bananes, 46 DH. Deux droites se croisent sur la réponse."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, OX = 40, OY = 210, K = 9; // repère : 1 unité = 9 px

  function repere(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('path', { d: 'M' + OX + ' ' + OY + ' H350 M' + OX + ' ' + OY + ' V10', stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, g);
    for (var k = 5; k <= 30; k += 5) { T(g, OX + k * K, OY + 16, k, 'tag'); T(g, OX - 6, OY - k * K + 4, k, 'tag', 'end'); S('line', { x1: OX + k * K, y1: OY - 3, x2: OX + k * K, y2: OY + 3, stroke: '#9aa0a8' }, g); S('line', { x1: OX - 3, y1: OY - k * K, x2: OX + 3, y2: OY - k * K, stroke: '#9aa0a8' }, g); }
    T(g, 345, OY - 6, 'x (pommes)', 'tag', 'end'); T(g, OX + 130, 18, 'y (bananes)', 'tag', 'start');
    return g;
  }
  function droite(svg, a, b, c, col) { // ax + by = c
    var p = [], x, y;
    for (x = 0; x <= 34; x += 34) { y = (c - a * x) / b; p.push([OX + x * K, OY - y * K]); }
    return S('line', { x1: p[0][0], y1: p[0][1], x2: p[1][0], y2: p[1][1], stroke: col, 'stroke-width': 3 }, svg);
  }

  MV.lesson({
    id: '3ac-systemes',
    objectif: {
      fr: 'Résoudre un système de deux équations à deux inconnues par substitution ou combinaison, et l\'interpréter graphiquement.',
      ar: 'حل نظمة معادلتين بمجهولين بالتعويض أو بالتأليفة الخطية، وتأويلها مبيانيا.'
    },

    ouverture: {
      vb: '0 0 360 230', label: 'Deux achats au souk',
      hud: [['a', 'achat 1'], ['b', 'achat 2'], ['q', 'prix ?']],
      draw: function (svg) {
        var e = {};
        e.t1 = T(svg, 180, 80, '2 kg pommes + 1 kg bananes = 32 DH', 'lbl');
        e.t2 = T(svg, 180, 120, '1 kg pommes + 3 kg bananes = 46 DH', 'lbl');
        e.q = T(svg, 180, 170, 'prix d\'un kg de chaque ?', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'Salma achète **2 kg de pommes et 1 kg de bananes** : 32 DH.', on: ['t1'], hud: { a: ['32 DH'], b: '–', q: '–' } },
        { cap: 'Hamza achète **1 kg de pommes et 3 kg de bananes** : 46 DH.', on: ['t1', 't2'], hud: { a: '32 DH', b: ['46 DH'], q: '–' } },
        { cap: 'Quel est le **prix** d\'un kilo de chaque fruit ? On le saura à la fin.', on: ['t1', 't2', 'q'], hud: { a: '32 DH', b: '46 DH', q: ['?'] } }
      ]
    },

    prepare: [
      ['Si y = 32 − 2x et x = 10, alors y = 12.', true, '32 − 20 = 12.'],
      ['Une équation à deux inconnues a une seule solution.', false, 'Elle en a une infinité : il faut une deuxième équation.'],
      ['2x + y = 32 peut s\'écrire y = 32 − 2x.', true, 'On retire 2x des deux côtés.']
    ],

    regarde: {
      vb: '0 0 360 230', label: 'Substitution et lecture graphique',
      hud: [['s', 'système'], ['m', 'méthode'], ['r', 'résultat']],
      draw: function (svg) {
        var e = {}; repere(svg);
        e.d1 = droite(svg, 2, 1, 32, 'var(--acc)'); e.d2 = droite(svg, 1, 3, 46, '#7fb2ff');
        e.pt = S('g', {}, svg); S('circle', { cx: OX + 10 * K, cy: OY - 12 * K, r: 7, fill: '#fff', stroke: '#141517', 'stroke-width': 2 }, e.pt); T(e.pt, OX + 10 * K + 12, OY - 12 * K - 10, '(10 ; 12)', 'lbl', 'start');
        return e;
      },
      steps: [
        { cap: 'On pose x le prix des pommes, y celui des bananes : **2x + y = 32** et **x + 3y = 46**.', ar: 'نضع x ثمن التفاح و y ثمن الموز.', hud: { s: ['2x + y = 32 ; x + 3y = 46'], m: '–', r: '–' } },
        { cap: 'De la 1re équation : **y = 32 − 2x**.', ar: 'من المعادلة الأولى: [[y = 32 − 2x]].', on: ['d1'], hud: { s: 'y = 32 − 2x', m: ['substitution'], r: '–' } },
        { cap: 'On remplace dans la 2e : x + 3(32 − 2x) = 46, soit −5x = −50, donc **x = 10**.', ar: 'نعوض في الثانية: [[x + 3(32 − 2x) = 46]] إذن [[x = 10]].', on: ['d1'], hud: { s: 'x + 96 − 6x = 46', m: 'substitution', r: ['x = 10'] } },
        { cap: 'Puis y = 32 − 2 × 10 = **12**. La solution est le couple (10 ; 12).', ar: 'ثم [[y = 32 − 20 = 12]]. الحل هو الزوج (10 ; 12).', on: ['d1'], hud: { s: '–', m: 'substitution', r: ['(10 ; 12)'] } },
        { cap: 'Chaque équation est une **droite**. Leur point commun est la solution.', ar: 'كل معادلة يمثلها مستقيم، ونقطة تقاطعهما هي الحل.', on: ['d1', 'd2', 'pt'], hud: { s: '2 droites', m: ['lecture graphique'], r: ['(10 ; 12)'] } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Propose un couple (x ; y) : il doit vérifier les deux équations.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 230', role: 'img', 'aria-label': 'Deux droites et un point' }, st);
          repere(svg); droite(svg, 2, 1, 32, 'var(--acc)'); droite(svg, 1, 3, 46, '#7fb2ff');
          var p = S('circle', { r: 7, fill: '#fff', stroke: '#141517', 'stroke-width': 2 }, svg), x = 4, y = 8, set = MV.hud(c, [['e1', '2x + y'], ['e2', 'x + 3y'], ['r', 'solution ?', 1]]);
          function upd() { p.setAttribute('cx', OX + x * K); p.setAttribute('cy', OY - y * K); var a = 2 * x + y, b = x + 3 * y; set('e1', a + (a === 32 ? ' ✓' : ' ≠ 32')); set('e2', b + (b === 46 ? ' ✓' : ' ≠ 46')); var ok = a === 32 && b === 46; set('r', ok ? 'oui' : 'non'); if (ok) done(); }
          MV.slider(c, { label: 'x', min: 0, max: 20, value: 4 }, function (v) { x = v; upd(); });
          MV.slider(c, { label: 'y', min: 0, max: 20, value: 8 }, function (v) { y = v; upd(); });
          upd();
          MV.H('p', 'small', 'Le point doit être sur les deux droites à la fois.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Résous par combinaison : x + y = 10 et x − y = 4.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. On additionne les deux équations :', o: ['2x = 14', '2y = 14', '2x = 6'], a: 0, e: 'Les y s\'éliminent.' },
            { q: 'Étape 2. x = ?', a: 7 },
            { q: 'Étape 3. y = 10 − x = ?', a: 3, ok: 'Solution (7 ; 3).' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le couple (2 ; 3) vérifie-t-il x + y = 5 et 2x − y = 1 ?', o: ['oui', 'non'], a: 0 },
      { lvl: 'Niveau 2', q: 'Résous y = 2x et x + y = 9. x = ?', a: 3 },
      { lvl: 'Niveau 3', q: 'Résous x + y = 20 et x − y = 6. y = ?', a: 7 },
      { lvl: 'Niveau 4', q: 'Une classe de 30 élèves compte 6 filles de plus que de garçons. Combien de filles ?', a: 18, hint: 'f + g = 30 et f − g = 6.' }
    ],

    bilan: {
      vb: '0 0 360 230', label: 'Les prix au souk',
      hud: [['p', 'pommes'], ['b', 'bananes'], ['v', 'vérification']],
      draw: function (svg) { var e = {}; repere(svg); droite(svg, 2, 1, 32, 'var(--acc)'); droite(svg, 1, 3, 46, '#7fb2ff'); S('circle', { cx: OX + 10 * K, cy: OY - 12 * K, r: 7, fill: '#fff', stroke: '#141517', 'stroke-width': 2 }, svg); return e; },
      steps: [
        { cap: 'Pommes : **10 DH** le kg. Bananes : **12 DH** le kg.', hud: { p: ['10 DH'], b: ['12 DH'], v: '–' } },
        { cap: 'Vérification : 2 × 10 + 12 = 32 et 10 + 3 × 12 = 46. ✓', ar: 'ثمن الكيلوغرام: التفاح 10 دراهم والموز 12 درهما.', hud: { p: '10 DH', b: '12 DH', v: ['32 et 46'] } }
      ]
    },

    retenir: [
      'Résoudre un système de deux équations à deux inconnues, c\'est trouver le <b>couple</b> (x ; y) qui vérifie les deux équations. Méthodes : <b>substitution</b> ou <b>combinaison</b>.',
      'Graphiquement, chaque équation est une <b>droite</b> ; la solution est le point d\'<b>intersection</b>. On vérifie toujours.'
    ],
    retenirAr: 'حل نظمة معادلتين بمجهولين هو إيجاد الزوج الذي يحقق المعادلتين معا، بطريقة التعويض أو التأليفة الخطية. مبيانيا، الحل هو نقطة تقاطع المستقيمين.',
    voc: [['un système', 'نظمة'], ['la substitution', 'التعويض'], ['la combinaison', 'التأليفة الخطية'], ['un couple', 'زوج'], ['l\'intersection', 'التقاطع']]
  });
})();
