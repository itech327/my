/* @meta {"id":"1ac-equations","level":"1","order":6,"theme":"Numérique","title":"Les équations","ar":"المعادلات","lead":"Une balance en équilibre cache un poids inconnu x. En retirant la même chose des deux côtés, on trouve x."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* balance : boîte x à gauche + blocs, blocs à droite */
  function balance(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('path', { d: 'M180 190 L165 215 H195 Z', fill: '#9aa0a8' }, g);
    var bras = S('g', {}, g); bras.style.transition = 'transform .8s'; bras.style.transformOrigin = '180px 190px';
    S('line', { x1: 40, y1: 190, x2: 320, y2: 190, stroke: '#e9e9ea', 'stroke-width': 4 }, bras);
    var L = S('g', {}, bras), R = S('g', {}, bras);
    function blocs(grp, x0, n, col) { for (var i = 0; i < n; i++) S('rect', { x: x0 + (i % 5) * 20, y: 170 - Math.floor(i / 5) * 20, width: 18, height: 18, rx: 3, fill: col || '#7fb2ff', stroke: '#141517' }, grp); }
    g.set = function (k, a, b, xv) { // k boîtes x et a blocs à gauche ; b blocs à droite ; xv valeur de x (pour l'inclinaison)
      while (L.firstChild) L.removeChild(L.firstChild); while (R.firstChild) R.removeChild(R.firstChild);
      for (var i = 0; i < k; i++) { S('rect', { x: 46 + i * 30, y: 158 - (a > 5 ? 20 : 0), width: 28, height: 30, rx: 4, fill: 'var(--acc)', stroke: '#141517' }, L); T(L, 60 + i * 30, 178 - (a > 5 ? 20 : 0), 'x', 'lbl').style.fill = '#141517'; }
      blocs(L, 46 + k * 30 + 4, a); blocs(R, 214, b);
      var d = xv == null ? 0 : (k * xv + a) - b; bras.style.transform = 'rotate(' + Math.max(-12, Math.min(12, -d * 2)) + 'deg)';
    };
    return g;
  }

  MV.lesson({
    id: '1ac-equations',
    objectif: {
      fr: 'Tester si un nombre est solution d\'une équation, et résoudre des équations du type x + a = b et ax = b.',
      ar: 'التحقق من أن عددا حل لمعادلة، وحل معادلات من نوع [[x + a = b]] و [[ax = b]].'
    },

    ouverture: {
      vb: '0 0 360 230', label: 'Une balance en équilibre',
      hud: [['g', 'à gauche'], ['d', 'à droite'], ['q', 'x = ?']],
      draw: function (svg) { var e = {}; e.b = balance(svg); return e; },
      steps: [
        { cap: 'À gauche : une boîte de masse **inconnue x** et 3 blocs de 1 kg.', hud: { g: ['x + 3'], d: '–', q: '–' }, run: function (e) { e.b.set(1, 3, 0); } },
        { cap: 'À droite : 8 blocs. La balance est en **équilibre**.', hud: { g: 'x + 3', d: ['8'], q: '–' }, run: function (e) { e.b.set(1, 3, 8, 5); } },
        { cap: 'Combien pèse la boîte ? On le saura à la fin.', hud: { g: 'x + 3', d: '8', q: ['?'] }, run: function (e) { e.b.set(1, 3, 8, 5); } }
      ]
    },

    predire: {
      q: "Une balance est en équilibre : à gauche une boîte de masse inconnue x et 3 blocs de 1 kg, à droite 8 blocs de 1 kg. Combien pèse la boîte ?",
      ar: "ميزان متوازن: على اليسار علبة كتلتها المجهولة [[x]] و[[3]] قطع كل منها [[1 kg]]، وعلى اليمين [[8]] قطع. كم تزن العلبة؟",
      o: ["3 kg", "5 kg", "11 kg"],
      a: 1,
      e: "L'équilibre donne x + 3 = 8. On enlève 3 kg des deux côtés : x = 8 − 3 = 5 kg. Pour garder l'équilibre, on fait toujours la même opération des deux côtés.",
      ear: "التوازن يعطي [[x + 3 = 8]]، نطرح [[3]] من الطرفين فنجد [[x = 5 kg]]."
    },

    prepare: [
      ['Si 5 + ? = 12, alors ? = 7.', true, '12 − 5 = 7.'],
      ['Si 4 × ? = 20, alors ? = 16.', false, '20 ÷ 4 = 5.'],
      ['Une balance reste en équilibre si on retire la même masse des deux côtés.', true, 'C\'est l\'idée clé de cette leçon.']
    ],

    regarde: {
      vb: '0 0 360 230', label: 'Résoudre comme une balance',
      hud: [['e', 'équation'], ['a', 'action'], ['s', 'solution']],
      draw: function (svg) { var e = {}; e.b = balance(svg); return e; },
      steps: [
        { cap: 'L\'équilibre s\'écrit **x + 3 = 8**. C\'est une **équation**, x est l\'**inconnue**.', ar: 'نكتب التوازن على شكل معادلة: [[x + 3 = 8]]، و x هو المجهول.', hud: { e: ['x + 3 = 8'], a: '–', s: '–' }, run: function (e) { e.b.set(1, 3, 8, 5); } },
        { cap: 'On retire **3 des deux côtés** : la balance reste en équilibre.', ar: 'نطرح 3 من الطرفين فيبقى التوازن.', hud: { e: 'x + 3 − 3 = 8 − 3', a: ['− 3 des deux côtés'], s: '–' }, run: function (e) { e.b.set(1, 0, 5, 5); } },
        { cap: 'Il reste **x = 5**. Vérification : 5 + 3 = 8. ✓', ar: 'نجد [[x = 5]]، ونتحقق: [[5 + 3 = 8]].', hud: { e: 'x = 5', a: 'vérifier', s: ['5'] }, run: function (e) { e.b.set(1, 0, 5, 5); } },
        { cap: 'Autre cas : **3x = 12**. Trois boîtes pèsent 12.', ar: 'حالة أخرى: [[3x = 12]].', hud: { e: ['3x = 12'], a: '–', s: '–' }, run: function (e) { e.b.set(3, 0, 12, 4); } },
        { cap: 'On **divise par 3** des deux côtés : x = 12 ÷ 3 = **4**.', ar: 'نقسم الطرفين على 3: [[x = 12 ÷ 3 = 4]].', hud: { e: '3x ÷ 3 = 12 ÷ 3', a: ['÷ 3 des deux côtés'], s: ['4'] }, run: function (e) { e.b.set(1, 0, 4, 4); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Essaie des valeurs de x pour x + 3 = 8 : quand la balance est-elle droite ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 230', role: 'img', 'aria-label': 'Balance' }, st);
          var b = balance(svg), set = MV.hud(c, [['g', 'x + 3'], ['d', '8'], ['v', 'équilibre ?', 1]]);
          MV.slider(c, { label: 'x', min: 0, max: 10, value: 1 }, function (x) { b.set(1, 3, 8, x); set('g', x + 3); set('d', 8); set('v', x + 3 === 8 ? 'oui' : x + 3 < 8 ? 'non, trop léger' : 'non, trop lourd'); if (x === 5) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Résous x − 4 = 9, puis 5x = 35.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Pour isoler x dans x − 4 = 9, on :', o: ['ajoute 4 des deux côtés', 'retire 4 des deux côtés'], a: 0 },
            { q: 'Étape 2. x = ?', a: 13 },
            { q: 'Étape 3. 5x = 35, donc x = ?', a: 7 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le nombre 6 est-il solution de x + 4 = 10 ?', o: ['oui', 'non'], a: 0 },
      { lvl: 'Niveau 2', q: 'Résous x + 12 = 30. x = ?', a: 18 },
      { lvl: 'Niveau 3', q: 'Résous 4x = 28. x = ?', a: 7 },
      { lvl: 'Niveau 4', q: 'Le triple d\'un nombre vaut 45. Ce nombre ?', a: 15, hint: '3x = 45.' }
    ],

    bilan: {
      vb: '0 0 360 230', label: 'La boîte',
      hud: [['e', 'équation'], ['s', 'solution'], ['v', 'vérification']],
      draw: function (svg) { var e = {}; e.b = balance(svg); return e; },
      steps: [
        { cap: 'x + 3 = 8 : on retire 3 des deux côtés, **x = 5**.', hud: { e: ['x + 3 = 8'], s: ['5 kg'], v: '–' }, run: function (e) { e.b.set(1, 3, 8, 5); } },
        { cap: 'La boîte pèse **5 kg** : 5 + 3 = 8. ✓', ar: 'كتلة العلبة 5 كيلوغرامات.', hud: { e: 'x + 3 = 8', s: '5 kg', v: ['5 + 3 = 8'] }, run: function (e) { e.b.set(1, 0, 5, 5); } }
      ]
    },

    retenir: [
      'Une <b>équation</b> est une égalité avec une inconnue. Une <b>solution</b> est un nombre qui rend l\'égalité vraie.',
      'Pour résoudre : <b class="mono">x + a = b</b> donne <b class="mono">x = b − a</b> ; <b class="mono">ax = b</b> donne <b class="mono">x = b ÷ a</b> (a ≠ 0). On fait la même opération des deux côtés, puis on vérifie.'
    ],
    retenirAr: 'المعادلة متساوية تتضمن مجهولا، والحل عدد يجعل المتساوية صحيحة. نجري نفس العملية على الطرفين ثم نتحقق.',
    voc: [['une équation', 'معادلة'], ['l\'inconnue', 'المجهول'], ['une solution', 'حل'], ['vérifier', 'يتحقق']]
  });
})();
