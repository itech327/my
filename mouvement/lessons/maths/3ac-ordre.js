/* @meta {"id":"3ac-ordre","level":"3","order":3,"theme":"Nombres et calcul","title":"Ordre et opérations","ar":"الترتيب والعمليات","lead":"Si a < b, a-t-on toujours −a < −b ? On déplace deux points sur la droite : ajouter garde l'ordre, multiplier par un négatif l'inverse."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 180, U = 22;

  function droite(svg, y) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('line', { x1: 8, y1: y, x2: 352, y2: y, stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    for (var k = -7; k <= 7; k++) { S('line', { x1: X0 + k * U, y1: y - 5, x2: X0 + k * U, y2: y + 5, stroke: '#9aa0a8', 'stroke-width': k ? 1 : 2.5 }, g); if (k % 2 === 0) T(g, X0 + k * U, y + 22, k, 'tag'); }
    return g;
  }
  function pt(svg, y, col, name) {
    var g = S('g', { 'data-keep': 1 }, svg); S('circle', { cx: 0, cy: y, r: 7, fill: col, stroke: '#fff', 'stroke-width': 2 }, g);
    var t = T(g, 0, y - 15, name, 'lbl'); g.style.transition = 'transform .9s ease-in-out';
    g.at = function (v, lab) { g.style.transform = 'translate(' + (X0 + Math.max(-7.5, Math.min(7.5, v)) * U) + 'px,0)'; if (lab) t.textContent = lab; };
    return g;
  }

  MV.lesson({
    id: '3ac-ordre',
    objectif: {
      fr: 'Savoir comment l\'ordre se conserve ou change quand on ajoute un nombre ou qu\'on multiplie par un nombre, et encadrer une expression.',
      ar: 'معرفة كيف يحفظ الترتيب أو يتغير عند إضافة عدد أو الضرب في عدد، وتأطير تعبير.'
    },

    ouverture: {
      vb: '0 0 360 180', label: 'Deux nombres a et b',
      hud: [['o', 'a < b'], ['m', '−a et −b'], ['q', 'question']],
      draw: function (svg) { var e = {}; droite(svg, 110); e.a = pt(svg, 110, 'var(--acc)', 'a'); e.b = pt(svg, 110, '#7fb2ff', 'b'); return e; },
      steps: [
        { cap: 'Deux nombres : **a = 2** et **b = 5**. On a a < b.', hud: { o: ['2 < 5'], m: '–', q: '–' }, run: function (e) { e.a.at(2, 'a'); e.b.at(5, 'b'); } },
        { cap: 'Et leurs opposés : −2 et −5. A-t-on **−a < −b** ?', hud: { o: '2 < 5', m: ['−2 ? −5'], q: '–' }, run: function (e) { e.a.at(2, 'a'); e.b.at(5, 'b'); } },
        { cap: 'L\'ordre est-il **toujours** conservé ? On le saura à la fin.', hud: { o: '2 < 5', m: '−2 ? −5', q: ['?'] }, run: function (e) { e.a.at(2, 'a'); e.b.at(5, 'b'); } }
      ]
    },

    prepare: [
      ['−3 < −1', true, '−3 est plus à gauche.'],
      ['Si x > 4, alors x peut valoir 4.', false, 'x > 4 : x est strictement plus grand que 4.'],
      ['2 ≤ 2', true, '≤ signifie « inférieur ou égal ».']
    ],

    regarde: {
      vb: '0 0 360 180', label: 'Opérations et ordre',
      hud: [['op', 'opération'], ['v', 'valeurs'], ['o', 'ordre']],
      draw: function (svg) { var e = {}; droite(svg, 110); e.a = pt(svg, 110, 'var(--acc)', 'a'); e.b = pt(svg, 110, '#7fb2ff', 'b'); return e; },
      steps: [
        { cap: 'Au départ : a = 1 et b = 3, donc **a < b**.', ar: 'في البداية [[a < b]].', hud: { op: '–', v: '1 et 3', o: ['a < b'] }, run: function (e) { e.a.at(1, 'a'); e.b.at(3, 'b'); } },
        { cap: 'On **ajoute 2** aux deux : les points glissent ensemble. L\'ordre est conservé.', ar: 'نضيف نفس العدد إلى الطرفين: يحفظ الترتيب.', hud: { op: ['+ 2'], v: '3 et 5', o: ['a + 2 < b + 2'] }, run: function (e) { e.a.at(3, 'a+2'); e.b.at(5, 'b+2'); } },
        { cap: 'On **retire 4** : l\'ordre est encore conservé.', ar: 'نطرح نفس العدد: يحفظ الترتيب.', hud: { op: ['− 4'], v: '−3 et −1', o: ['a − 4 < b − 4'] }, run: function (e) { e.a.at(-3, 'a−4'); e.b.at(-1, 'b−4'); } },
        { cap: 'On **multiplie par 2** (positif) : les écarts grandissent, l\'ordre est conservé.', ar: 'نضرب في عدد موجب: يحفظ الترتيب.', hud: { op: ['× 2'], v: '2 et 6', o: ['2a < 2b'] }, run: function (e) { e.a.at(2, '2a'); e.b.at(6, '2b'); } },
        { cap: 'On **multiplie par −1** : la droite se retourne autour de 0. L\'ordre **s\'inverse**.', ar: 'نضرب في عدد سالب: ينعكس الترتيب.', hud: { op: ['× (−1)'], v: '−1 et −3', o: ['−a > −b'] }, run: function (e) { e.a.at(-1, '−a'); e.b.at(-3, '−b'); } },
        { cap: 'Encadrer : si 1 ≤ x ≤ 3, alors **3 ≤ x + 2 ≤ 5**.', ar: 'التأطير: إذا كان [[1 ≤ x ≤ 3]] فإن [[3 ≤ x + 2 ≤ 5]].', hud: { op: '+ 2', v: '[3 ; 5]', o: ['3 ≤ x + 2 ≤ 5'] }, run: function (e) { e.a.at(3, '3'); e.b.at(5, '5'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis a, b et un multiplicateur k. Observe si l\'ordre reste le même.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 150', role: 'img', 'aria-label': 'Ordre de ka et kb' }, st);
          droite(svg, 90); var pa = pt(svg, 90, 'var(--acc)', 'ka'), pb = pt(svg, 90, '#7fb2ff', 'kb'), a = 1, b = 3, k = 2, set = MV.hud(c, [['v', 'ka et kb'], ['o', 'ordre', 1]]);
          function upd() { pa.at(k * a); pb.at(k * b); set('v', (k * a) + ' et ' + (k * b)); set('o', k * a < k * b ? 'ka < kb' : k * a > k * b ? 'ka > kb (inversé)' : 'égaux'); }
          MV.slider(c, { label: 'a', min: -3, max: 3, value: 1 }, function (v) { a = v; if (a >= b) { b = a + 1; } upd(); });
          MV.slider(c, { label: 'b', min: -3, max: 4, value: 3 }, function (v) { b = Math.max(v, a + 1); upd(); });
          MV.slider(c, { label: 'k', min: -2, max: 2, value: 2 }, function (v) { k = v; upd(); });
          MV.H('p', 'small', 'Le site garde toujours a < b. Essaie k négatif.', c);
          upd(); done();
        } },
      { title: 'Résolvons ensemble', intro: 'On sait que 2 ≤ x ≤ 5. Encadre 3x − 1.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. On multiplie par 3 (positif) :', o: ['6 ≤ 3x ≤ 15', '15 ≤ 3x ≤ 6', '5 ≤ 3x ≤ 8'], a: 0, e: '3 est positif : l\'ordre est conservé.' },
            { q: 'Étape 2. On retire 1 : borne inférieure de 3x − 1 ?', a: 5, hint: '6 − 1.' },
            { q: 'Étape 3. Borne supérieure de 3x − 1 ?', a: 14, ok: '5 ≤ 3x − 1 ≤ 14.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Si a < b, alors a + 7 … b + 7', o: ['<', '>'], a: 0 },
      { lvl: 'Niveau 2', q: 'Si a < b, alors −3a … −3b', o: ['<', '>'], a: 1, e: 'On multiplie par un négatif : l\'ordre s\'inverse.' },
      { lvl: 'Niveau 3', q: 'Si 1 ≤ x ≤ 4, quelle est la borne supérieure de 2x + 3 ?', a: 11, hint: '2 × 4 + 3.' },
      { lvl: 'Niveau 4', q: 'Si 1 ≤ x ≤ 4, quelle est la borne inférieure de −x ?', a: -4, hint: '−x est entre −4 et −1 : l\'ordre s\'inverse.' }
    ],

    bilan: {
      vb: '0 0 360 180', label: 'Les opposés',
      hud: [['o', 'a < b'], ['m', 'opposés'], ['r', 'réponse']],
      draw: function (svg) { var e = {}; droite(svg, 110); e.a = pt(svg, 110, 'var(--acc)', 'a'); e.b = pt(svg, 110, '#7fb2ff', 'b'); return e; },
      steps: [
        { cap: 'a = 2 et b = 5 : **2 < 5**.', hud: { o: ['2 < 5'], m: '–', r: '–' }, run: function (e) { e.a.at(2, 'a'); e.b.at(5, 'b'); } },
        { cap: 'Multiplier par −1 retourne la droite : **−2 > −5**. L\'ordre n\'est pas toujours conservé.', ar: 'الضرب في عدد سالب يعكس الترتيب: [[−2 > −5]].', hud: { o: '2 < 5', m: ['−2 > −5'], r: ['inversé'] }, run: function (e) { e.a.at(-2, '−a'); e.b.at(-5, '−b'); } }
      ]
    },

    retenir: [
      'On ne change pas l\'ordre en <b>ajoutant</b> ou en <b>retranchant</b> un même nombre, ni en <b>multipliant</b> par un même nombre <b>positif</b>.',
      'Multiplier par un nombre <b>négatif</b> <b>inverse</b> l\'ordre : si a < b, alors −a > −b.'
    ],
    retenirAr: 'لا يتغير الترتيب عند إضافة أو طرح نفس العدد، ولا عند الضرب في نفس العدد الموجب. الضرب في عدد سالب يعكس الترتيب.',
    voc: [['l\'ordre', 'الترتيب'], ['inférieur ou égal', 'أصغر من أو يساوي'], ['encadrer', 'يؤطر'], ['inverser', 'يعكس']]
  });
})();
