/* @meta {"id":"2ac-matieres","level":"2","order":5,"theme":"Matière et environnement","title":"Matières naturelles et synthétiques","ar":"المواد الطبيعية والمواد المصنعة","lead":"Un maillot de sport fabriqué avec des bouteilles en plastique ? On trie les matières selon leur origine."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var ITEMS = [ // nom, origine, colonne (0 naturelle, 1 synthétique)
    ['coton', 'plante', 0], ['laine', 'animal', 0], ['bois', 'plante', 0], ['sel', 'minéral', 0],
    ['nylon', 'pétrole', 1], ['polyester', 'pétrole', 1], ['PVC', 'pétrole', 1], ['aspirine', 'usine', 1]
  ];

  /* deux colonnes et des étiquettes à ranger */
  function tri(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), lab = [];
    S('rect', { x: 20, y: 30, width: 150, height: 180, rx: 10, fill: 'rgba(86,208,127,.12)', stroke: '#56d07f' }, g);
    S('rect', { x: 190, y: 30, width: 150, height: 180, rx: 10, fill: 'rgba(56,182,255,.12)', stroke: 'var(--acc)' }, g);
    T(g, 95, 22, 'naturelles', 'lbl'); T(g, 265, 22, 'synthétiques', 'lbl');
    ITEMS.forEach(function (it, i) { var t = T(g, 180, 120, it[0], 'lbl'); t.style.transition = 'all .9s'; t.style.opacity = 0; lab.push(t); });
    g.set = function (n, orig) { // range les n premières étiquettes
      var c = [0, 0];
      ITEMS.forEach(function (it, i) {
        var t = lab[i]; if (i >= n) { t.style.opacity = 0; return; }
        var k = c[it[2]]++; t.style.opacity = 1;
        t.setAttribute('x', it[2] ? 265 : 95); t.setAttribute('y', 60 + k * 40);
        t.textContent = orig ? it[0] + ' · ' + it[1] : it[0];
      });
    };
    return g;
  }

  MV.lesson({
    id: '2ac-matieres',
    objectif: {
      fr: 'Classer des matières selon leur origine (naturelle ou synthétique) et comprendre l\'intérêt du recyclage.',
      ar: 'تصنيف المواد حسب أصلها (طبيعية أو مصنعة) وفهم أهمية إعادة التدوير.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'Un maillot et des bouteilles',
      hud: [['o', 'objet'], ['m', 'matière'], ['q', 'origine ?']],
      draw: function (svg) {
        var e = {};
        e.bt = S('g', { 'data-keep': 1 }, svg); for (var i = 0; i < 5; i++) { S('rect', { x: 30 + i * 22, y: 90, width: 16, height: 60, rx: 5, fill: 'rgba(127,178,255,.5)', stroke: '#e9e9ea' }, e.bt); S('rect', { x: 34 + i * 22, y: 82, width: 8, height: 9, fill: '#56d07f' }, e.bt); }
        e.ar = S('path', { d: 'M160 120 h40 l-10 -8 m10 8 l-10 8', stroke: 'var(--acc)', 'stroke-width': 3, fill: 'none' }, svg);
        e.m = S('path', { d: 'M230 70 l25 -12 h30 l25 12 l-10 25 h-10 v70 h-60 v-70 h-10 z', fill: 'var(--acc)', stroke: '#141517', 'stroke-width': 2 }, svg);
        return e;
      },
      steps: [
        { cap: 'Des **bouteilles en plastique** usagées.', hud: { o: ['bouteilles'], m: 'plastique', q: '–' } },
        { cap: 'Recyclées, elles deviennent un **maillot de sport**.', on: ['ar', 'm'], hud: { o: ['maillot'], m: ['polyester'], q: '–' } },
        { cap: 'Le polyester vient-il de la **nature** ? On le saura à la fin.', on: ['ar', 'm'], hud: { o: 'maillot', m: 'polyester', q: ['?'] } }
      ]
    },

    prepare: [
      ['La laine vient du mouton.', true, 'C\'est une matière d\'origine animale.'],
      ['Le plastique pousse dans la nature.', false, 'Il est fabriqué en usine, surtout à partir du pétrole.'],
      ['Le coton vient d\'une plante.', true, 'Les fibres entourent les graines du cotonnier.']
    ],

    regarde: {
      vb: '0 0 360 220', label: 'Trier les matières',
      hud: [['m', 'matière'], ['o', 'origine'], ['c', 'catégorie']],
      draw: function (svg) { var e = {}; e.t = tri(svg); return e; },
      steps: [
        { cap: 'Une matière **naturelle** existe dans la nature : végétale, animale ou minérale.', ar: 'المادة الطبيعية توجد في الطبيعة: نباتية أو حيوانية أو معدنية.', hud: { m: ['coton, laine, bois, sel'], o: 'nature', c: ['naturelle'] }, run: function (e) { e.t.set(4); } },
        { cap: 'Une matière **synthétique** est fabriquée par l\'Homme par des réactions chimiques.', ar: 'المادة المصنعة يصنعها الإنسان بواسطة تفاعلات كيميائية.', hud: { m: ['nylon, polyester, PVC'], o: 'usine', c: ['synthétique'] }, run: function (e) { e.t.set(8); } },
        { cap: 'Beaucoup de matières synthétiques viennent du **pétrole**.', ar: 'كثير من المواد المصنعة مصدرها البترول.', hud: { m: 'plastiques', o: ['pétrole'], c: 'synthétique' }, run: function (e) { e.t.set(8, true); } },
        { cap: 'Elles se dégradent **très lentement** : il faut les trier et les **recycler**.', ar: 'تتحلل ببطء شديد، لذا يجب فرزها وإعادة تدويرها.', hud: { m: 'plastiques', o: 'pétrole', c: ['recycler'] }, run: function (e) { e.t.set(8, true); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Ajoute les matières une à une et regarde où elles se rangent.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 220', role: 'img', 'aria-label': 'Tri des matières' }, st);
          var t = tri(svg), set = MV.hud(c, [['m', 'dernière matière'], ['o', 'origine', 1]]);
          MV.slider(c, { label: 'matières', min: 0, max: 8, value: 0 }, function (n) { t.set(n, true); set('m', n ? ITEMS[n - 1][0] : '–'); set('o', n ? ITEMS[n - 1][1] : '–'); if (n === 8) done(); });
          t.set(0);
        } },
      { title: 'Résolvons ensemble', intro: 'Classe chaque matière.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. La soie (fil du ver à soie) est :', o: ['naturelle', 'synthétique'], a: 0 },
            { type: 'opt', q: 'Étape 2. Le sac en polyéthylène est :', o: ['naturel', 'synthétique'], a: 1 },
            { type: 'opt', q: 'Étape 3. Le polyéthylène est fabriqué à partir :', o: ['du pétrole', 'du sable'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le bois est une matière :', o: ['naturelle', 'synthétique'], a: 0 },
      { lvl: 'Niveau 2', q: 'Le nylon est une matière :', o: ['synthétique', 'naturelle'], a: 0 },
      { lvl: 'Niveau 3', q: 'Le sel de cuisine est d\'origine :', o: ['minérale', 'animale', 'végétale'], a: 0 },
      { lvl: 'Niveau 4', q: 'Un maillot demande 8 bouteilles recyclées. Combien de maillots avec 200 bouteilles ?', a: 25 }
    ],

    bilan: {
      vb: '0 0 360 220', label: 'Le maillot',
      hud: [['m', 'matière'], ['c', 'catégorie'], ['g', 'geste']],
      draw: function (svg) { var e = {}; e.t = tri(svg); return e; },
      steps: [
        { cap: 'Le polyester est **synthétique** : fabriqué à partir du **pétrole**.', hud: { m: ['polyester'], c: ['synthétique'], g: '–' }, run: function (e) { e.t.set(8, true); } },
        { cap: 'Le **recycler** en maillot évite de nouveaux déchets.', ar: 'البوليستر مادة مصنعة من البترول، وإعادة تدويره تقلل النفايات.', hud: { m: 'polyester', c: 'synthétique', g: ['recycler'] }, run: function (e) { e.t.set(8, true); } }
      ]
    },

    retenir: [
      'Une matière <b>naturelle</b> existe dans la nature (origine végétale, animale ou minérale). Une matière <b>synthétique</b> est fabriquée par l\'Homme, souvent à partir du <b>pétrole</b>.',
      'Les plastiques se dégradent très lentement : on les <b>trie</b> et on les <b>recycle</b>.'
    ],
    retenirAr: 'المادة الطبيعية توجد في الطبيعة ومصدرها نباتي أو حيواني أو معدني. المادة المصنعة يصنعها الإنسان، وغالبا من البترول. نفرز البلاستيك ونعيد تدويره لأنه يتحلل ببطء.',
    voc: [['une matière naturelle', 'مادة طبيعية'], ['une matière synthétique', 'مادة مصنعة'], ['le pétrole', 'البترول'], ['recycler', 'يعيد التدوير']]
  });
})();
