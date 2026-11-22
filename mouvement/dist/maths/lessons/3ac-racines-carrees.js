/* @meta {"id":"3ac-racines-carrees","level":"3","order":1,"theme":"Nombres et calcul","title":"La racine carrée","ar":"الجذر المربع","lead":"Un jardin carré de 49 m² : la racine carrée donne la longueur de son côté. Et s'il mesure 50 m² ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* carré quadrillé : n × n cases de taille u, coin haut-gauche (x, y) */
  function carre(svg) {
    var g = S('g', {}, svg);
    g.set = function (n, u, x, y, opts) {
      while (g.firstChild) g.removeChild(g.firstChild);
      opts = opts || {};
      S('rect', { x: x, y: y, width: n * u, height: n * u, fill: 'var(--acc-bg)', stroke: 'var(--acc)', 'stroke-width': 2 }, g);
      if (opts.grid !== false && Number.isInteger(n)) for (var i = 1; i < n; i++) {
        S('line', { x1: x + i * u, y1: y, x2: x + i * u, y2: y + n * u, stroke: '#5b6068', 'stroke-width': opts.bloc && i % opts.bloc ? 0.6 : 1.2 }, g);
        S('line', { x1: x, y1: y + i * u, x2: x + n * u, y2: y + i * u, stroke: '#5b6068', 'stroke-width': opts.bloc && i % opts.bloc ? 0.6 : 1.2 }, g);
      }
      if (opts.side) { var t = T(g, x + n * u / 2, y + n * u + 22, opts.side, 'lbl big acc'); }
      if (opts.area) T(g, x + n * u / 2, y + n * u / 2 + 6, opts.area, 'lbl big').style.fill = '#fff';
    };
    return g;
  }

  MV.lesson({
    id: '3ac-racines-carrees',
    objectif: {
      fr: 'Comprendre la racine carrée comme le côté d\'un carré d\'aire connue, et calculer avec les racines carrées.',
      ar: 'فهم الجذر المربع كطول ضلع مربع مساحته معلومة، والحساب بالجذور المربعة.'
    },

    ouverture: {
      vb: '0 0 360 280', label: 'Un jardin carré',
      hud: [['a', 'aire'], ['c', 'côté'], ['q', 'et 50 m² ?']],
      draw: function (svg) {
        var e = {}; e.jardin = carre(svg); e.jardin.setAttribute('data-keep', 1);
        e.q = T(svg, 300, 140, '? m', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'Un jardin **carré** de 49 m² à Meknès.', hud: { a: ['49 m²'], c: '–', q: '–' }, run: function (e) { e.jardin.set(7, 28, 82, 20, { area: '49 m²', grid: false }); } },
        { cap: 'On veut une clôture : quelle est la longueur d\'un **côté** ?', on: ['q'], hud: { a: '49 m²', c: ['?'], q: '–' }, run: function (e) { e.jardin.set(7, 28, 82, 20, { area: '49 m²', grid: false }); } },
        { cap: 'Facile : 7 × 7 = 49, donc **7 m**. Mais pour un jardin de 50 m² ?', hud: { a: '49 m²', c: ['7 m'], q: ['?'] }, run: function (e) { e.jardin.set(7, 28, 82, 20, { area: '49 m²', side: '7 m' }); } }
      ]
    },

    predire: {
      q: "Un jardin carré a une aire de 50 m². Que peut-on dire de la longueur de son côté ?",
      ar: "حديقة مربعة مساحتها [[50 m²]]. ماذا نقول عن طول ضلعها؟",
      o: ["Elle vaut exactement 7 m", "Elle vaut 25 m", "Elle est comprise entre 7 m et 8 m"],
      a: 2,
      e: "7² = 49 et 8² = 64, donc le côté est entre 7 et 8 m. C'est exactement √50, soit environ 7,07 m : la racine carrée sert à nommer le côté d'un carré d'aire donnée.",
      ear: "[[7² = 49]] و[[8² = 64]] إذن الضلع بين [[7]] و[[8]] أمتار: إنه [[√50 ≈ 7,07 m]]."
    },

    prepare: [
      ['7² = 49', true, '7² = 7 × 7 = 49.'],
      ['Le carré d\'un nombre négatif est négatif.', false, '(−3)² = (−3) × (−3) = 9 : un carré est toujours positif ou nul.'],
      ['L\'aire d\'un carré de côté c est c × c.', true, 'Aire = c × c = c².']
    ],

    regarde: {
      vb: '0 0 360 300', label: 'Des carrés et leurs côtés',
      hud: [['a', 'aire'], ['c', 'côté'], ['r', 'écriture']],
      draw: function (svg) { var e = {}; e.sq = carre(svg); e.sq.setAttribute('data-keep', 1); e.note = T(svg, 180, 290, '', 'tag'); e.note.setAttribute('data-keep', 1); return e; },
      steps: [
        { cap: 'Un carré d\'aire **25** : 5 cases sur chaque côté.', ar: 'مربع مساحته 25 طول ضلعه 5.', hud: { a: ['25'], c: ['5'], r: '–' }, run: function (e) { e.sq.set(5, 40, 80, 20, { side: '5' }); e.note.textContent = ''; } },
        { cap: 'On écrit **√25 = 5** : « racine carrée de 25 ».', ar: 'نكتب [[√25 = 5]] ونقرأ: الجذر المربع لـ 25.', hud: { a: '25', c: '5', r: ['√25 = 5'] }, run: function (e) { e.sq.set(5, 40, 80, 20, { side: '√25 = 5' }); } },
        { cap: '√a est le nombre **positif** dont le carré est a.', ar: 'الجذر المربع لعدد موجب [[a]] هو العدد الموجب الذي مربعه [[a]].', hud: { a: 'a ≥ 0', c: '√a ≥ 0', r: ['(√a)² = a'] }, run: function (e) { e.sq.set(5, 40, 80, 20, { side: '√a', area: 'a', grid: false }); e.note.textContent = ''; } },
        { cap: 'Aire **2** : le côté est entre 1 et 2. √2 ≈ 1,414.', ar: 'مربع مساحته 2: ضلعه بين 1 و 2، و [[√2 ≈ 1,414]].', hud: { a: ['2'], c: ['≈ 1,414'], r: '√2' }, run: function (e) { e.sq.set(1.414, 120, 95, 30, { side: '√2 ≈ 1,414', grid: false }); e.note.textContent = '1,414 × 1,414 ≈ 2'; } },
        { cap: 'Aire **−4** ? Aucun carré n\'a une aire négative : √(−4) **n\'existe pas**.', ar: 'لا يوجد مربع مساحته سالبة: [[√(−4)]] غير موجود.', hud: { a: ['−4'], c: ['impossible'], r: '–' }, run: function (e) { e.sq.set(0, 1, 180, 140, { grid: false }); e.note.textContent = 'un carré est toujours positif ou nul'; } },
        { cap: '36 = 4 × 9 : neuf blocs de 2 × 2. Le côté vaut **2 × 3 = 6**.', ar: 'المربع 36 مكون من 9 مربعات مساحة كل منها 4: [[√36 = √4 × √9 = 2 × 3]].', hud: { a: '4 × 9', c: ['6'], r: ['√4 × √9'] }, run: function (e) { e.sq.set(6, 36, 72, 20, { bloc: 2, side: '√(4 × 9) = √4 × √9 = 6' }); e.note.textContent = ''; } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change l\'aire du carré. Repère les aires dont la racine est un entier.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 250', role: 'img', 'aria-label': 'Carré d\'aire variable' }, st);
          var q = carre(svg), set;
          MV.slider(c, { label: 'aire', min: 0, max: 100, value: 50 }, function (a) {
            var r = Math.sqrt(a), u = 200 / 10;
            q.set(r, u, 180 - r * u / 2, 10, { grid: Number.isInteger(r), side: '√' + a + (Number.isInteger(r) ? ' = ' + r : ' ≈ ' + MV.fmt(r)) });
            if (set) { set('a', a); set('r', (Number.isInteger(r) ? '' : '≈ ') + MV.fmt(r)); set('p', Number.isInteger(r) ? 'oui' : 'non'); }
          });
          set = MV.hud(c, [['a', 'aire'], ['r', '√aire', 1], ['p', 'carré parfait ?', 1]]);
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          done();
        } },
      { title: 'Résolvons ensemble', intro: 'Simplifie √50.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Écris 50 comme un produit avec un carré parfait :', o: ['50 = 10 × 5', '50 = 25 × 2', '50 = 49 + 1'], a: 1, e: '25 = 5² est un carré parfait.', ko: 'Cherche un facteur qui est un carré : 4, 9, 16, 25…' },
            { type: 'opt', q: 'Étape 2. √(25 × 2) = ?', o: ['√25 + √2', '√25 × √2', '25 × √2'], a: 1, e: 'La racine d\'un produit est le produit des racines.', ko: 'Attention : c\'est un produit, pas une somme.' },
            { q: 'Étape 3. √50 = a√2. Que vaut a ?', a: 5, ok: '√50 = 5√2.', hint: '√25 = ?' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Calcule √81.', a: 9, hint: 'Quel nombre positif multiplié par lui-même donne 81 ?' },
      { lvl: 'Niveau 2', q: 'Calcule √0,16.', a: 0.4, hint: '0,4 × 0,4 = ?' },
      { lvl: 'Niveau 3', q: 'Calcule (√7)².', a: 7, hint: '(√a)² = a pour a ≥ 0.' },
      { lvl: 'Niveau 4', q: 'Simplifie √12 sous la forme a√3. Que vaut a ?', a: 2, hint: '12 = 4 × 3.' }
    ],

    bilan: {
      vb: '0 0 360 280', label: 'Le jardin de 50 m²',
      hud: [['a', 'aire'], ['c', 'côté exact'], ['v', 'valeur approchée']],
      draw: function (svg) { var e = {}; e.j = carre(svg); e.j.setAttribute('data-keep', 1); return e; },
      steps: [
        { cap: 'Jardin de 50 m² : le côté est **√50** mètres.', hud: { a: ['50 m²'], c: ['√50'], v: '–' }, run: function (e) { e.j.set(7.07, 28, 81, 20, { area: '50 m²', side: '√50', grid: false }); } },
        { cap: '√50 = √(25 × 2) = **5√2**.', ar: 'نبسط: [[√50 = 5√2]].', hud: { a: '50 m²', c: ['5√2'], v: '–' }, run: function (e) { e.j.set(7.07, 28, 81, 20, { area: '50 m²', side: '5√2', grid: false }); } },
        { cap: 'Soit environ **7,07 m** : un peu plus que 7 m.', ar: 'أي حوالي [[7,07 m]].', hud: { a: '50 m²', c: '5√2', v: ['≈ 7,07 m'] }, run: function (e) { e.j.set(7.07, 28, 81, 20, { area: '50 m²', side: '≈ 7,07 m', grid: false }); } }
      ]
    },

    retenir: [
      'Pour a ≥ 0, <b class="mono">√a</b> est le nombre positif dont le carré est a : <span class="mono">(√a)² = a</span>. La racine carrée d\'un nombre négatif n\'existe pas.',
      'Pour a ≥ 0 et b ≥ 0 : <b class="mono">√(a × b) = √a × √b</b>, et pour b > 0 : <span class="mono">√(a ÷ b) = √a ÷ √b</span>.'
    ],
    retenirAr: 'الجذر المربع لعدد موجب [[a]] هو العدد الموجب الذي مربعه [[a]]. لا يوجد جذر مربع لعدد سالب. [[√(a × b) = √a × √b]].',
    voc: [['la racine carrée', 'الجذر المربع'], ['un carré parfait', 'مربع كامل'], ['une valeur approchée', 'قيمة مقربة'], ['simplifier', 'يبسط']]
  });
})();
