/* @meta {"id":"2ac-equations","level":"2","order":13,"theme":"Numérique","title":"Équations du premier degré","ar":"المعادلات من الدرجة الأولى","lead":"Deux tarifs de taxi : 10 DH + 4 DH par km, ou 25 DH + 1 DH par km. Pour quelle distance coûtent-ils pareil ? Une équation répond."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* deux barres de prix pour une distance x */
  function barres(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), K = 5.2;
    T(g, 20, 60, 'A', 'lbl big'); T(g, 20, 130, 'B', 'lbl big');
    var a0 = S('rect', { x: 40, y: 42, height: 26, fill: '#9a5a2b' }, g), a1 = S('rect', { y: 42, height: 26, fill: 'var(--acc)' }, g);
    var b0 = S('rect', { x: 40, y: 112, height: 26, fill: '#2f5c80' }, g), b1 = S('rect', { y: 112, height: 26, fill: '#7fb2ff' }, g);
    var ta = T(g, 0, 90, '', 'tag', 'start'), tb = T(g, 0, 160, '', 'tag', 'start');
    [a0, a1, b0, b1].forEach(function (r) { r.style.transition = 'all .5s'; });
    g.set = function (x) {
      var A = 10 + 4 * x, B = 25 + x;
      a0.setAttribute('width', 10 * K); a1.setAttribute('x', 40 + 10 * K); a1.setAttribute('width', 4 * x * K);
      b0.setAttribute('width', 25 * K); b1.setAttribute('x', 40 + 25 * K); b1.setAttribute('width', x * K);
      ta.setAttribute('x', 40); ta.textContent = '10 + 4 × ' + x + ' = ' + A + ' DH';
      tb.setAttribute('x', 40); tb.textContent = '25 + 1 × ' + x + ' = ' + B + ' DH';
      return [A, B];
    };
    return g;
  }

  MV.lesson({
    id: '2ac-equations',
    objectif: {
      fr: 'Résoudre une équation du premier degré à une inconnue du type ax + b = cx + d, et mettre un problème en équation.',
      ar: 'حل معادلة من الدرجة الأولى بمجهول واحد من نوع [[ax + b = cx + d]]، وترييض مسألة.'
    },

    prerequis: {
      fr: 'Calcul littéral simple ; opérations sur les nombres relatifs.',
      ar: 'الحساب الحرفي البسيط والعمليات على الأعداد النسبية.'
    },

    ouverture: {
      vb: '0 0 360 190', label: 'Deux tarifs de taxi',
      hud: [['a', 'tarif A'], ['b', 'tarif B'], ['q', 'égaux pour ?']],
      draw: function (svg) { var e = {}; e.b = barres(svg); return e; },
      steps: [
        { cap: 'Tarif **A** : 10 DH au départ, puis **4 DH par km**.', hud: { a: ['10 + 4x'], b: '–', q: '–' }, run: function (e) { e.b.set(2); } },
        { cap: 'Tarif **B** : 25 DH au départ, puis **1 DH par km**.', hud: { a: '10 + 4x', b: ['25 + x'], q: '–' }, run: function (e) { e.b.set(2); } },
        { cap: 'Pour quelle **distance** paie-t-on la même chose ? On le saura à la fin.', hud: { a: '10 + 4x', b: '25 + x', q: ['?'] }, run: function (e) { e.b.set(2); } }
      ]
    },

    predire: {
      q: "Tarif A : 10 DH + 4 DH par km. Tarif B : 25 DH + 1 DH par km. Pour combien de km paie-t-on la même chose ?",
      ar: "التعريفة A: [[10 DH]] + [[4 DH]] لكل كيلومتر. التعريفة B: [[25 DH]] + [[1 DH]] لكل كيلومتر. بعد كم كيلومتراً يتساوى الثمنان؟",
      o: ["3 km", "5 km", "15 km"],
      a: 1,
      e: "On résout 10 + 4x = 25 + x : 3x = 15, donc x = 5. Vérification à 5 km : A paie 10 + 20 = 30 DH et B paie 25 + 5 = 30 DH.",
      ear: "[[10 + 4x = 25 + x]] تعطي [[3x = 15]] إذن [[x = 5 km]]، والثمن [[30 DH]] في الحالتين."
    },

    prepare: [
      ['Si x + 7 = 10, alors x = 3.', true, '10 − 7 = 3.'],
      ['On peut ajouter un même nombre aux deux membres d\'une équation.', true, 'L\'égalité est conservée.'],
      ['Dans 4x = x + 15, on peut diviser seulement le membre de gauche par 4.', false, 'Une opération se fait toujours sur les deux membres.']
    ],

    regarde: {
      vb: '0 0 360 190', label: 'Résoudre ax + b = cx + d',
      hud: [['e', 'équation'], ['a', 'action'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.b = barres(svg); return e; },
      steps: [
        { cap: 'Égalité des prix : **10 + 4x = 25 + x**.', ar: 'تساوي الثمنين: [[10 + 4x = 25 + x]].', hud: { e: ['10 + 4x = 25 + x'], a: 'mise en équation', r: '–' }, run: function (e) { e.b.set(3); } },
        { cap: 'On **retire x** des deux membres : les x passent du même côté.', ar: 'نطرح x من الطرفين لنجمع المجاهيل في طرف واحد.', hud: { e: '10 + 3x = 25', a: ['− x'], r: '–' }, run: function (e) { e.b.set(3); } },
        { cap: 'On **retire 10** des deux membres : **3x = 15**.', ar: 'نطرح 10 من الطرفين: [[3x = 15]].', hud: { e: ['3x = 15'], a: ['− 10'], r: '–' }, run: function (e) { e.b.set(4); } },
        { cap: 'On **divise par 3** : **x = 5**.', ar: 'نقسم على 3: [[x = 5]].', hud: { e: 'x = 5', a: ['÷ 3'], r: ['5'] }, run: function (e) { e.b.set(5); } },
        { cap: 'On **vérifie** : 10 + 20 = 30 et 25 + 5 = 30. ✓', ar: 'نتحقق: [[10 + 4 × 5 = 25 + 5 = 30]].', hud: { e: 'x = 5', a: 'vérifier', r: ['30 = 30'] }, run: function (e) { e.b.set(5); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change la distance. Quand les deux barres ont-elles la même longueur ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 190', role: 'img', 'aria-label': 'Prix de deux taxis' }, st);
          var b = barres(svg), set = MV.hud(c, [['a', 'A'], ['b', 'B'], ['m', 'moins cher', 1]]);
          MV.slider(c, { label: 'km', min: 0, max: 9, value: 1 }, function (x) { var p = b.set(x); set('a', p[0] + ' DH'); set('b', p[1] + ' DH'); set('m', p[0] < p[1] ? 'A' : p[0] > p[1] ? 'B' : 'égalité'); if (x === 5) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Résous 7x − 4 = 2x + 11.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. On retire 2x des deux membres :', o: ['5x − 4 = 11', '9x − 4 = 11', '5x − 4 = 13x'], a: 0 },
            { q: 'Étape 2. On ajoute 4 : 5x = ?', a: 15 },
            { q: 'Étape 3. x = ?', a: 3 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Résous 3x + 2 = 17. x = ?', a: 5 },
      { lvl: 'Niveau 2', q: 'Résous 6x − 1 = 4x + 9. x = ?', a: 5 },
      { lvl: 'Niveau 3', q: 'Résous 2(x + 3) = 20. x = ?', a: 7, hint: 'Développe d\'abord.' },
      { lvl: 'Niveau 4', q: 'Karim a 3 fois l\'âge de sa sœur. Ensemble, ils ont 48 ans. Âge de la sœur ?', a: 12, hint: 'x + 3x = 48.' }
    ],

    bilan: {
      vb: '0 0 360 190', label: 'Les deux taxis',
      hud: [['x', 'distance'], ['p', 'prix'], ['c', 'conseil']],
      draw: function (svg) { var e = {}; e.b = barres(svg); return e; },
      steps: [
        { cap: 'Pour **5 km**, les deux tarifs coûtent **30 DH**.', hud: { x: ['5 km'], p: ['30 DH'], c: '–' }, run: function (e) { e.b.set(5); } },
        { cap: 'En dessous de 5 km, A est moins cher ; au-dessus, c\'est **B**.', ar: 'عند 5 كيلومترات يتساوى الثمنان، وبعدها تصبح التسعيرة B أرخص.', hud: { x: '5 km', p: '30 DH', c: ['< 5 km : A ; > 5 km : B'] }, run: function (e) { e.b.set(8); } }
      ]
    },

    retenir: [
      'Pour résoudre <b class="mono">ax + b = cx + d</b> : on regroupe les termes en x d\'un côté, les nombres de l\'autre, en faisant la <b>même opération</b> sur les deux membres.',
      'On divise par le coefficient de x, puis on <b>vérifie</b>. Pour un problème : choisir l\'inconnue, mettre en équation, résoudre, conclure.'
    ],
    retenirAr: 'لحل [[ax + b = cx + d]] نجمع الحدود التي فيها x في طرف والأعداد في الطرف الآخر، بإجراء نفس العملية على الطرفين، ثم نقسم على معامل x ونتحقق.',
    voc: [['une équation', 'معادلة'], ['un membre', 'طرف'], ['mettre en équation', 'ترييض'], ['vérifier', 'يتحقق']]
  });
})();
