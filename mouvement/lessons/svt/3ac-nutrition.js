/* @meta {"id":"3ac-nutrition","level":"3","order":6,"theme":"Santé","title":"L'éducation nutritionnelle","ar":"التربية الغذائية","lead":"Un soda et un croissant au petit-déjeuner : assez d'énergie, mais est-ce équilibré ? On compose une ration variée."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var GRP = [ // groupe, rôle, couleur
    ['céréales, pain', 'énergie', '#e9b949'],
    ['fruits, légumes', 'vitamines, fibres', '#56d07f'],
    ['lait, laitages', 'calcium', '#e9e9ea'],
    ['viande, œufs, lentilles', 'protéines', '#e5484d'],
    ['matières grasses, sucres', 'avec modération', '#b07fd1']
  ];

  /* une assiette en cinq secteurs, allumés ou non */
  function assiette(svg, cx, cy, r) {
    var g = S('g', { 'data-keep': 1 }, svg), sec = [], parts = [0.3, 0.3, 0.15, 0.15, 0.1], a0 = -Math.PI / 2;
    S('circle', { cx: cx, cy: cy, r: r + 8, fill: 'none', stroke: '#5b6068', 'stroke-width': 3 }, g);
    parts.forEach(function (p, i) {
      var a1 = a0 + p * 2 * Math.PI, big = p > 0.5 ? 1 : 0;
      var d = 'M' + cx + ' ' + cy + ' L' + (cx + r * Math.cos(a0)) + ' ' + (cy + r * Math.sin(a0)) + ' A' + r + ' ' + r + ' 0 ' + big + ' 1 ' + (cx + r * Math.cos(a1)) + ' ' + (cy + r * Math.sin(a1)) + ' Z';
      var s = S('path', { d: d, fill: GRP[i][2], stroke: '#141517', 'stroke-width': 2 }, g); s.style.transition = 'opacity .6s'; sec.push(s); a0 = a1;
    });
    g.set = function (on) { sec.forEach(function (s, i) { s.style.opacity = on[i] ? 1 : 0.12; }); };
    return g;
  }
  function legende(svg, x) {
    var g = S('g', { 'data-keep': 1 }, svg);
    GRP.forEach(function (gr, i) { S('rect', { x: x, y: 40 + i * 30, width: 14, height: 14, rx: 3, fill: gr[2] }, g); T(g, x + 20, 52 + i * 30, gr[0], 'tag', 'start'); });
    return g;
  }

  MV.lesson({
    id: '3ac-nutrition',
    objectif: {
      fr: 'Composer une ration alimentaire équilibrée à partir des groupes d\'aliments et connaître les risques d\'une alimentation déséquilibrée.',
      ar: 'تكوين حصة غذائية متوازنة انطلاقا من مجموعات الأغذية، ومعرفة مخاطر التغذية غير المتوازنة.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Un petit-déjeuner pressé',
      hud: [['r', 'repas'], ['e', 'énergie'], ['q', 'équilibré ?']],
      draw: function (svg) { var e = {}; e.a = assiette(svg, 100, 105, 70); legende(svg, 182); return e; },
      steps: [
        { cap: 'Yassine part au collège avec un **soda** et un **croissant**.', hud: { r: ['soda + croissant'], e: '–', q: '–' }, run: function (e) { e.a.set([1, 0, 0, 0, 1]); } },
        { cap: 'Beaucoup d\'**énergie** : sucre et matières grasses.', hud: { r: 'soda + croissant', e: ['élevée'], q: '–' }, run: function (e) { e.a.set([1, 0, 0, 0, 1]); } },
        { cap: 'Mais est-ce **équilibré** ? On le saura à la fin.', hud: { r: 'soda + croissant', e: 'élevée', q: ['?'] }, run: function (e) { e.a.set([1, 0, 0, 0, 1]); } }
      ]
    },

    predire: {
      q: "Yassine part au collège avec un soda et un croissant. Ce petit-déjeuner est-il équilibré ?",
      ar: "يذهب ياسين إلى المدرسة بمشروب غازي وكرواسون. هل هذه الوجبة متوازنة؟",
      o: ["Oui, il donne beaucoup d'énergie", "Non, il est riche en sucre et en graisse mais manque de fruits, de laitage et de protéines", "Oui, le sucre est un nutriment essentiel"],
      a: 1,
      e: "Une ration équilibrée contient tous les groupes d'aliments. Le soda et le croissant apportent du sucre et de la graisse, mais pas assez de vitamines, de fibres, de calcium ni de protéines.",
      ear: "الوجبة المتوازنة تضم كل مجموعات الأغذية. المشروب الغازي والكرواسون غنيان بالسكر والدهون وفقيران بالفيتامينات والكالسيوم والبروتينات."
    },

    prepare: [
      ['Les aliments apportent de l\'énergie au corps.', true, 'Surtout les glucides et les lipides.'],
      ['Un seul aliment suffit pour être en bonne santé.', false, 'Aucun aliment ne contient tout : il faut varier.'],
      ['Le lait est riche en calcium.', true, 'Le calcium construit les os.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Les groupes d\'aliments',
      hud: [['g', 'groupe'], ['r', 'rôle'], ['c', 'conseil']],
      draw: function (svg) { var e = {}; e.a = assiette(svg, 100, 105, 70); legende(svg, 182); return e; },
      steps: [
        { cap: 'On classe les aliments en **groupes** selon ce qu\'ils apportent.', ar: 'نصنف الأغذية في مجموعات حسب ما تمنحه للجسم.', hud: { g: ['5 groupes'], r: '–', c: '–' }, run: function (e) { e.a.set([1, 1, 1, 1, 1]); } },
        { cap: '**Céréales et pain** : l\'énergie. **Fruits et légumes** : vitamines et fibres.', ar: 'الحبوب والخبز للطاقة، والفواكه والخضر للفيتامينات والألياف.', hud: { g: 'céréales, fruits', r: ['énergie, vitamines'], c: 'à chaque repas' }, run: function (e) { e.a.set([1, 1, 0, 0, 0]); } },
        { cap: '**Laitages** : calcium. **Viande, œufs, légumineuses** : protéines pour construire.', ar: 'الحليب ومشتقاته للكالسيوم، واللحوم والبيض والقطاني للبروتينات.', hud: { g: 'laitages, protéines', r: ['os, muscles'], c: 'chaque jour' }, run: function (e) { e.a.set([0, 0, 1, 1, 0]); } },
        { cap: '**Gras et sucres** : un peu seulement. En excès : obésité, diabète, caries.', ar: 'الدهون والسكريات بكمية قليلة، فالإفراط فيها يسبب السمنة والسكري وتسوس الأسنان.', hud: { g: 'gras, sucres', r: 'énergie', c: ['modération'] }, run: function (e) { e.a.set([0, 0, 0, 0, 1]); } },
        { cap: 'Une ration **équilibrée** contient tous les groupes, en bonnes proportions.', ar: 'الحصة المتوازنة تضم جميع المجموعات بنسب مناسبة.', hud: { g: 'tous', r: 'besoins couverts', c: ['varier'] }, run: function (e) { e.a.set([1, 1, 1, 1, 1]); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Compose un petit-déjeuner : ajoute des aliments jusqu\'à couvrir tous les groupes.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Assiette' }, st);
          var a = assiette(svg, 100, 105, 70), on = [0, 0, 0, 0, 0], set = MV.hud(c, [['n', 'groupes'], ['v', 'verdict', 1]]), row = MV.H('div', 'row', '', c);
          legende(svg, 182);
          function upd() { a.set(on); var n = on.reduce(function (s, x) { return s + x; }, 0); set('n', n + ' / 5'); set('v', n === 5 ? 'équilibré' : 'incomplet'); if (n === 5) done(); }
          [['Pain', 0], ['Orange', 1], ['Lait', 2], ['Œuf', 3], ['Huile d\'olive', 4]].forEach(function (x) { var b = MV.H('button', 'btn', x[0], row); b.onclick = function () { on[x[1]] = 1; upd(); }; });
          upd();
        } },
      { title: 'Résolvons ensemble', intro: '1 g de glucides ou de protéines libère 17 kJ ; 1 g de lipides, 38 kJ.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Un croissant contient 20 g de lipides. Énergie (kJ) ?', a: 760 },
            { q: 'Étape 2. Un soda contient 35 g de sucres (glucides). Énergie (kJ) ?', a: 595 },
            { type: 'opt', q: 'Étape 3. Ce repas apporte des vitamines ou du calcium ?', o: ['presque pas', 'beaucoup'], a: 0, e: 'Beaucoup d\'énergie, peu d\'éléments utiles.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Les lentilles apportent surtout :', o: ['des protéines', 'du calcium'], a: 0 },
      { lvl: 'Niveau 2', q: 'Un excès de sucres peut provoquer :', o: ['des caries et l\'obésité', 'une carence en sucre'], a: 0 },
      { lvl: 'Niveau 3', q: 'Lequel est le plus équilibré ?', o: ['pain, lait, orange, œuf', 'soda, croissant', 'chips, jus sucré'], a: 0 },
      { lvl: 'Niveau 4', q: 'Énergie de 10 g de lipides, en kJ ?', a: 380, unit: 'kJ' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le petit-déjeuner de Yassine',
      hud: [['a', 'avant'], ['m', 'il manque'], ['p', 'proposition']],
      draw: function (svg) { var e = {}; e.a = assiette(svg, 100, 105, 70); legende(svg, 182); return e; },
      steps: [
        { cap: 'Soda + croissant : beaucoup d\'énergie mais **déséquilibré**.', hud: { a: ['déséquilibré'], m: ['fruits, laitages, protéines'], p: '–' }, run: function (e) { e.a.set([1, 0, 0, 0, 1]); } },
        { cap: 'Mieux : **pain, lait, une orange et un œuf**. Tous les groupes sont là.', ar: 'الفطور المتوازن: خبز وحليب وبرتقالة وبيضة.', hud: { a: 'déséquilibré', m: '–', p: ['pain, lait, orange, œuf'] }, run: function (e) { e.a.set([1, 1, 1, 1, 1]); } }
      ]
    },

    retenir: [
      'Les aliments se classent en <b>groupes</b> : céréales (énergie), fruits et légumes (vitamines, fibres), laitages (calcium), viande, œufs et légumineuses (protéines), gras et sucres (avec modération).',
      'Une ration <b>équilibrée</b> contient tous les groupes en bonnes proportions. Le déséquilibre entraîne des <b>carences</b> ou des <b>excès</b> (obésité, diabète).'
    ],
    retenirAr: 'تصنف الأغذية في مجموعات. الحصة الغذائية المتوازنة تضم جميع المجموعات بنسب مناسبة، وعدم التوازن يؤدي إلى النقص أو الإفراط كالسمنة والسكري.',
    voc: [['une ration alimentaire', 'حصة غذائية'], ['équilibré', 'متوازن'], ['une carence', 'نقص'], ['les protéines', 'البروتينات'], ['les lipides', 'الدهنيات']]
  });
})();
