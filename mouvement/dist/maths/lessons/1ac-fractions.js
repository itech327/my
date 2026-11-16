/* @meta {"id":"1ac-fractions","level":"1","order":2,"theme":"Nombres et calcul","title":"Les fractions : égalité et comparaison","ar":"الكسور: التساوي والمقارنة","lead":"Deux sœurs mangent 1/2 et 2/4 d'une galette : ont-elles mangé autant ? On coupe, on regroupe, on compare."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* disque partagé en d parts, n parts colorées */
  function disque(svg, cx, cy, r) {
    var g = S('g', {}, svg);
    g.set = function (n, d, col) {
      while (g.firstChild) g.removeChild(g.firstChild);
      S('circle', { cx: cx, cy: cy, r: r, fill: '#2b2e33' }, g);
      for (var i = 0; i < d; i++) {
        var a0 = -Math.PI / 2 + i * 2 * Math.PI / d, a1 = a0 + 2 * Math.PI / d, big = d === 1 ? 1 : 0;
        var p = d === 1 ? 'M' + (cx - r) + ' ' + cy + ' a' + r + ' ' + r + ' 0 1 1 ' + (2 * r) + ' 0 a' + r + ' ' + r + ' 0 1 1 ' + (-2 * r) + ' 0'
          : 'M' + cx + ' ' + cy + ' L' + (cx + r * Math.cos(a0)) + ' ' + (cy + r * Math.sin(a0)) + ' A' + r + ' ' + r + ' 0 ' + big + ' 1 ' + (cx + r * Math.cos(a1)) + ' ' + (cy + r * Math.sin(a1)) + ' Z';
        S('path', { d: p, fill: i < n ? (col || 'var(--acc)') : 'transparent', stroke: '#141517', 'stroke-width': 2 }, g);
      }
      S('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    };
    return g;
  }

  MV.lesson({
    id: '1ac-fractions',
    objectif: {
      fr: 'Reconnaître des fractions égales, simplifier une fraction et comparer deux fractions.',
      ar: 'التعرف على الكسور المتساوية، واختزال كسر، ومقارنة كسرين.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'Deux galettes partagées',
      hud: [['a', 'Hiba'], ['b', 'Nour'], ['q', 'autant ?']],
      draw: function (svg) {
        var e = {}; e.g1 = disque(svg, 90, 100, 70); e.g2 = disque(svg, 270, 100, 70);
        e.g1.setAttribute('data-keep', 1); e.g2.setAttribute('data-keep', 1);
        T(svg, 90, 200, 'Hiba', 'lbl'); T(svg, 270, 200, 'Nour', 'lbl');
        return e;
      },
      steps: [
        { cap: 'Deux sœurs ont chacune une **galette** de même taille.', hud: { a: '–', b: '–', q: '–' }, run: function (e) { e.g1.set(0, 1); e.g2.set(0, 1); } },
        { cap: 'Hiba coupe la sienne en 2 et mange **1 part** : 1/2.', hud: { a: ['1/2'], b: '–', q: '–' }, run: function (e) { e.g1.set(1, 2); e.g2.set(0, 1); } },
        { cap: 'Nour coupe la sienne en 4 et mange **2 parts** : 2/4.', hud: { a: '1/2', b: ['2/4'], q: '–' }, run: function (e) { e.g1.set(1, 2); e.g2.set(2, 4); } },
        { cap: 'Ont-elles mangé **autant** ? On le saura à la fin.', hud: { a: '1/2', b: '2/4', q: ['?'] }, run: function (e) { e.g1.set(1, 2); e.g2.set(2, 4); } }
      ]
    },

    prepare: [
      ['Dans 3/4, le dénominateur est 4.', true, 'Le dénominateur, en bas, dit en combien de parts égales on partage.'],
      ['3/4 veut dire : on prend 4 parts sur 3.', false, 'On partage en 4 parts égales et on en prend 3.'],
      ['12 et 18 sont divisibles par 6.', true, '12 = 6 × 2 et 18 = 6 × 3.']
    ],

    regarde: {
      vb: '0 0 360 260', label: 'Couper plus finement',
      hud: [['f', 'fraction'], ['r', 'règle'], ['v', 'résultat']],
      draw: function (svg) {
        var e = {}; e.d1 = disque(svg, 95, 110, 75); e.d2 = disque(svg, 265, 110, 75);
        e.d1.setAttribute('data-keep', 1); e.d2.setAttribute('data-keep', 1);
        e.t1 = T(svg, 95, 220, '', 'lbl big'); e.t2 = T(svg, 265, 220, '', 'lbl big');
        e.t1.setAttribute('data-keep', 1); e.t2.setAttribute('data-keep', 1);
        e.eg = T(svg, 180, 118, '=', 'lbl big acc');
        e.set = function (a, b, c, d, ta, tb) { e.d1.set(a, b); e.d2.set(c, d); e.t1.textContent = ta; e.t2.textContent = tb; };
        return e;
      },
      steps: [
        { cap: 'Une **moitié** de galette : 1 part sur 2.', ar: 'نصف الخبزة: جزء واحد من جزأين.', hud: { f: ['1/2'], r: '–', v: '–' }, run: function (e) { e.set(1, 2, 0, 1, '1/2', ''); } },
        { cap: 'Coupons chaque part en 2 : **2 parts sur 4**. La quantité ne change pas.', ar: 'نقسم كل جزء إلى جزأين: نحصل على 2 من 4، والكمية لم تتغير.', on: ['eg'], hud: { f: '2/4', r: ['× 2 en haut et en bas'], v: ['1/2 = 2/4'] }, run: function (e) { e.set(1, 2, 2, 4, '1/2', '2/4'); } },
        { cap: 'Encore une fois : **4/8**. Toujours une moitié.', ar: 'ومرة أخرى: [[4/8]]، دائما نصف.', on: ['eg'], hud: { f: '4/8', r: '× 2', v: ['1/2 = 2/4 = 4/8'] }, run: function (e) { e.set(1, 2, 4, 8, '1/2', '4/8'); } },
        { cap: 'On peut **multiplier** ou **diviser** le haut et le bas par le même nombre.', ar: 'يمكن ضرب أو قسمة البسط والمقام على نفس العدد غير المنعدم.', on: ['eg'], hud: { f: '6/8', r: ['÷ 2 en haut et en bas'], v: ['6/8 = 3/4'] }, run: function (e) { e.set(6, 8, 3, 4, '6/8', '3/4'); } },
        { cap: 'Diviser rend la fraction plus simple : c\'est **simplifier**. 6/8 = 3/4.', ar: 'القسمة تجعل الكسر أبسط: هذا هو الاختزال.', on: ['eg'], hud: { f: '6/8', r: 'simplifier', v: ['3/4'] }, run: function (e) { e.set(6, 8, 3, 4, '6/8', '3/4'); } },
        { cap: 'Même dénominateur : la plus grande a le plus grand **numérateur**. 3/8 < 5/8.', ar: 'إذا كان للكسرين نفس المقام فأكبرهما هو الذي له أكبر بسط.', hud: { f: '3/8 et 5/8', r: ['même dénominateur'], v: ['3/8 < 5/8'] }, run: function (e) { e.set(3, 8, 5, 8, '3/8', '5/8'); } },
        { cap: '3/4 ou 5/8 ? On écrit 3/4 = **6/8**, puis on compare : 6/8 > 5/8.', ar: 'نوحد المقامين: [[3/4 = 6/8]] ثم نقارن.', hud: { f: '3/4 et 5/8', r: 'même dénominateur', v: ['3/4 > 5/8'] }, run: function (e) { e.set(6, 8, 5, 8, '3/4 = 6/8', '5/8'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis le numérateur et le dénominateur. Observe la forme la plus simple.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Fraction d\'un disque' }, st);
          var d = disque(svg, 180, 100, 85), n = 6, den = 8, set;
          function pg(a, b) { return b ? pg(b, a % b) : a; }
          function upd() { var k = Math.min(n, den); d.set(k, den); var g = pg(k, den); if (set) { set('f', k + '/' + den); set('s', (k / g) + '/' + (den / g)); set('v', MV.fmt(k / den)); } }
          MV.slider(c, { label: 'numérateur', min: 0, max: 12, value: 6 }, function (v) { n = v; upd(); });
          MV.slider(c, { label: 'dénominateur', min: 1, max: 12, value: 8 }, function (v) { den = v; upd(); });
          set = MV.hud(c, [['f', 'fraction'], ['s', 'simplifiée', 1], ['v', 'valeur']]);
          MV.H('p', 'small', 'Si le numérateur dépasse le dénominateur, le disque est limité à une galette entière.', c);
          upd(); done();
        } },
      { title: 'Résolvons ensemble', intro: 'Simplifie la fraction 12/18.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Par quel nombre peut-on diviser 12 et 18 en même temps, le plus grand possible ?', o: ['4', '6', '12'], a: 1, e: '12 = 6 × 2 et 18 = 6 × 3.', ko: 'Ce nombre doit diviser 12 et aussi 18.' },
            { q: 'Étape 2. 12 ÷ 6 = ?', a: 2 },
            { q: 'Étape 3. 18 ÷ 6 = ? (donc 12/18 = 2/?)', a: 3, ok: '12/18 = 2/3.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Complète : 15/20 = 3/…', a: 4, hint: 'On a divisé 15 par 5 ; fais de même avec 20.' },
      { lvl: 'Niveau 2', q: 'Laquelle est la plus grande ?', o: ['5/9', '7/9', 'elles sont égales'], a: 1, e: 'Même dénominateur : 7 > 5.' },
      { lvl: 'Niveau 3', q: 'Compare 2/3 et 5/6.', o: ['2/3 < 5/6', '2/3 > 5/6', '2/3 = 5/6'], a: 0, e: '2/3 = 4/6 et 4/6 < 5/6.' },
      { lvl: 'Niveau 4', q: 'Salma a lu 3/8 d\'un livre, Amine 1/2 du même livre. Qui a lu le plus ?', o: ['Salma', 'Amine', 'autant'], a: 1, e: '1/2 = 4/8 et 4/8 > 3/8.' }
    ],

    bilan: {
      vb: '0 0 360 220', label: 'Les deux galettes comparées',
      hud: [['a', 'Hiba'], ['b', 'Nour'], ['q', 'autant ?']],
      draw: function (svg) {
        var e = {}; e.g1 = disque(svg, 90, 100, 70); e.g2 = disque(svg, 270, 100, 70);
        e.g1.setAttribute('data-keep', 1); e.g2.setAttribute('data-keep', 1); e.eg = T(svg, 180, 108, '=', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'Hiba : 1/2. Nour : 2/4.', hud: { a: '1/2', b: '2/4', q: '–' }, run: function (e) { e.g1.set(1, 2); e.g2.set(2, 4); } },
        { cap: 'Coupons la part de Hiba en deux : 1/2 = **2/4**.', on: ['eg'], hud: { a: ['2/4'], b: '2/4', q: '–' }, run: function (e) { e.g1.set(2, 4); e.g2.set(2, 4); } },
        { cap: 'Elles ont mangé **autant** : 1/2 = 2/4.', ar: 'أكلتا نفس الكمية لأن [[1/2 = 2/4]].', on: ['eg'], hud: { a: '1/2', b: '2/4', q: ['oui'] }, run: function (e) { e.g1.set(2, 4); e.g2.set(2, 4); } }
      ]
    },

    retenir: [
      'On ne change pas une fraction en <b>multipliant</b> ou en <b>divisant</b> son numérateur et son dénominateur par un même nombre non nul. Diviser permet de <b>simplifier</b>.',
      'Pour <b>comparer</b> deux fractions, on les écrit avec le même dénominateur : la plus grande est celle qui a le plus grand numérateur.'
    ],
    retenirAr: 'لا يتغير الكسر إذا ضربنا أو قسمنا بسطه ومقامه على نفس العدد غير المنعدم. لمقارنة كسرين نوحد مقاميهما، فيكون أكبرهما صاحب البسط الأكبر.',
    voc: [['le numérateur', 'البسط'], ['le dénominateur', 'المقام'], ['simplifier', 'يختزل'], ['comparer', 'يقارن'], ['des fractions égales', 'كسور متساوية']]
  });
})();
