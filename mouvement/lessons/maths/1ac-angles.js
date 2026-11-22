/* @meta {"id":"1ac-angles","level":"1","order":12,"theme":"Géométrie","title":"Angles et parallèles","ar":"الزوايا والمستقيمات المتوازية","lead":"Une route coupe deux rails parallèles. On mesure un seul angle au carrefour… et on connaît les sept autres sans rapporteur."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, RAD = Math.PI / 180, Y1 = 70, Y2 = 150, XC = 180;

  /* deux parallèles horizontales et une sécante d'angle a ; huit angles numérotés */
  function figure(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    S('line', { x1: 10, y1: Y1, x2: 350, y2: Y1, stroke: 'var(--acc)', 'stroke-width': 3 }, g); T(g, 16, Y1 - 8, '(d₁)', 'tag', 'start');
    S('line', { x1: 10, y1: Y2, x2: 350, y2: Y2, stroke: 'var(--acc)', 'stroke-width': 3 }, g); T(g, 16, Y2 - 8, '(d₂)', 'tag', 'start');
    g.set = function (a, hot) { // hot : liste de numéros d'angles à colorer (1 à 8)
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var k = 1 / Math.tan(a * RAD), x1 = XC + (Y2 - Y1) / 2 * k, x2 = XC - (Y2 - Y1) / 2 * k;
      S('line', { x1: XC + 100 * k, y1: 10, x2: XC - 100 * k, y2: 210, stroke: '#e9e9ea', 'stroke-width': 2.5 }, dyn);
      [[x1, Y1, 0], [x2, Y2, 4]].forEach(function (P) {
        // secteurs : 1 haut-droite (a), 2 haut-gauche (180-a), 3 bas-gauche (a), 4 bas-droite (180-a)
        var secs = [[0, a], [a, 180], [180, 180 + a], [180 + a, 360]];
        secs.forEach(function (s, i) {
          var n = P[2] + i + 1, on = hot && hot.indexOf(n) >= 0, r = 20, m = (s[0] + s[1]) / 2;
          if (on) S('path', { d: 'M' + P[0] + ' ' + P[1] + ' L' + (P[0] + r * Math.cos(s[0] * RAD)) + ' ' + (P[1] - r * Math.sin(s[0] * RAD)) + ' A' + r + ' ' + r + ' 0 0 0 ' + (P[0] + r * Math.cos(s[1] * RAD)) + ' ' + (P[1] - r * Math.sin(s[1] * RAD)) + ' Z', fill: 'rgba(242,193,78,.55)' }, dyn);
          T(dyn, P[0] + 30 * Math.cos(m * RAD), P[1] - 30 * Math.sin(m * RAD) + 4, n, 'tag');
        });
      });
    };
    return g;
  }

  MV.lesson({
    id: '1ac-angles',
    objectif: {
      fr: 'Reconnaître des angles opposés par le sommet, alternes-internes et correspondants, et utiliser leurs égalités quand les droites sont parallèles.',
      ar: 'التعرف على الزوايا المتقابلة بالرأس والمتبادلة داخليا والمتناظرة، واستعمال تقايسها عندما يكون المستقيمان متوازيين.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'Une route coupe deux rails',
      hud: [['m', 'angle mesuré'], ['a', 'autres angles'], ['q', 'comment ?']],
      draw: function (svg) { var e = {}; e.f = figure(svg); return e; },
      steps: [
        { cap: 'Deux **rails parallèles** et une route qui les coupe.', hud: { m: '–', a: '–', q: '–' }, run: function (e) { e.f.set(60); } },
        { cap: 'On mesure un seul angle : **60°**.', hud: { m: ['angle 1 = 60°'], a: '–', q: '–' }, run: function (e) { e.f.set(60, [1]); } },
        { cap: 'Peut-on connaître les **sept autres** sans rapporteur ? On le saura à la fin.', hud: { m: 'angle 1 = 60°', a: ['7 angles'], q: ['?'] }, run: function (e) { e.f.set(60, [1]); } }
      ]
    },

    predire: {
      q: "Deux rails parallèles sont coupés par une route. Un des huit angles mesure 60°. Combien de ces huit angles mesurent aussi 60° ?",
      ar: "سكتان متوازيتان يقطعهما طريق. أحد الزوايا الثماني يقيس [[60°]]. كم زاوية من الثماني تقيس [[60°]] أيضاً؟",
      o: ["2", "4", "8"],
      a: 1,
      e: "Les huit angles ne prennent que deux valeurs : quatre mesurent 60° et quatre mesurent 120°. Les angles opposés par le sommet, alternes-internes et correspondants sont égaux, et deux angles côte à côte sur une droite font 180°.",
      ear: "الزوايا الثماني لها قيمتان فقط: أربع زوايا [[60°]] وأربع [[120°]]، لأن [[60° + 120° = 180°]]."
    },

    prepare: [
      ['Deux angles supplémentaires font 180° ensemble.', true, 'Comme deux angles qui forment un angle plat.'],
      ['Deux angles complémentaires font 180°.', false, 'Ils font 90°.'],
      ['Un angle plat mesure 180°.', true, 'Ses côtés forment une droite.']
    ],

    regarde: {
      vb: '0 0 360 220', label: 'Les paires d\'angles',
      hud: [['p', 'paire'], ['n', 'nom'], ['r', 'relation']],
      draw: function (svg) { var e = {}; e.f = figure(svg); return e; },
      steps: [
        { cap: 'Les angles 1 et 3 sont **opposés par le sommet** : ils sont **égaux**.', ar: 'الزاويتان 1 و 3 متقابلتان بالرأس فهما متقايستان.', hud: { p: ['1 et 3'], n: ['opposés par le sommet'], r: 'égaux' }, run: function (e) { e.f.set(60, [1, 3]); } },
        { cap: 'Les angles 1 et 2 sont **adjacents** et forment un angle plat : ils sont **supplémentaires**.', ar: 'الزاويتان 1 و 2 متحاذيتان ومتكاملتان: مجموعهما 180°.', hud: { p: ['1 et 2'], n: 'supplémentaires', r: ['1 + 2 = 180°'] }, run: function (e) { e.f.set(60, [1, 2]); } },
        { cap: 'Les angles 3 et 5 sont **alternes-internes** : entre les deux droites, de part et d\'autre de la sécante.', ar: 'الزاويتان 3 و 5 متبادلتان داخليا.', hud: { p: ['3 et 5'], n: ['alternes-internes'], r: '?' }, run: function (e) { e.f.set(60, [3, 5]); } },
        { cap: 'Si (d₁) // (d₂), deux angles alternes-internes sont **égaux**.', ar: 'إذا كان المستقيمان متوازيين فإن الزاويتين المتبادلتين داخليا متقايستان.', hud: { p: '3 et 5', n: 'alternes-internes', r: ['égaux'] }, run: function (e) { e.f.set(60, [3, 5]); } },
        { cap: 'Les angles 1 et 5 sont **correspondants** : même position à chaque carrefour. Avec des parallèles, ils sont **égaux**.', ar: 'الزاويتان 1 و 5 متناظرتان، وهما متقايستان عندما يكون المستقيمان متوازيين.', hud: { p: ['1 et 5'], n: ['correspondants'], r: ['égaux'] }, run: function (e) { e.f.set(60, [1, 5]); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Tourne la route. Les angles 1, 3, 5 et 7 restent toujours égaux.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 220', role: 'img', 'aria-label': 'Deux parallèles et une sécante' }, st);
          var f = figure(svg), set = MV.hud(c, [['a', 'angles 1, 3, 5, 7'], ['b', 'angles 2, 4, 6, 8', 1]]);
          MV.slider(c, { label: 'angle 1 (°)', min: 30, max: 150, value: 60, step: 5 }, function (a) { f.set(a, [1, 3, 5, 7]); set('a', a + '°'); set('b', (180 - a) + '°'); if (a === 90) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Pour quelle valeur les huit angles sont-ils égaux ?', c);
        } },
      { title: 'Résolvons ensemble', intro: '(d₁) // (d₂) et l\'angle 1 mesure 70°.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. L\'angle 3, opposé par le sommet, mesure ? °', a: 70 },
            { q: 'Étape 2. L\'angle 5, alterne-interne avec 3, mesure ? °', a: 70 },
            { q: 'Étape 3. L\'angle 6, supplémentaire de 5, mesure ? °', a: 110 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Deux angles opposés par le sommet sont :', o: ['égaux', 'supplémentaires'], a: 0 },
      { lvl: 'Niveau 2', q: 'Le supplémentaire d\'un angle de 125° mesure ? °', a: 55 },
      { lvl: 'Niveau 3', q: 'Le complémentaire d\'un angle de 35° mesure ? °', a: 55 },
      { lvl: 'Niveau 4', q: 'Deux angles correspondants mesurent 72° et 75°. Les droites sont-elles parallèles ?', o: ['non', 'oui'], a: 0 }
    ],

    bilan: {
      vb: '0 0 360 220', label: 'Les huit angles',
      hud: [['a', 'angles 1, 3, 5, 7'], ['b', 'angles 2, 4, 6, 8'], ['r', 'raison']],
      draw: function (svg) { var e = {}; e.f = figure(svg); return e; },
      steps: [
        { cap: 'Opposés par le sommet, alternes-internes, correspondants : 1, 3, 5, 7 font **60°**.', hud: { a: ['60°'], b: '–', r: 'égalités' }, run: function (e) { e.f.set(60, [1, 3, 5, 7]); } },
        { cap: 'Les autres sont supplémentaires : **120°**. Un seul angle suffisait.', ar: 'الزوايا 1 و 3 و 5 و 7 قياسها 60°، والزوايا الأخرى قياسها 120°.', hud: { a: '60°', b: ['120°'], r: ['parallèles'] }, run: function (e) { e.f.set(60, [2, 4, 6, 8]); } }
      ]
    },

    retenir: [
      'Deux angles <b>opposés par le sommet</b> sont égaux. Deux angles <b>supplémentaires</b> font 180° ; deux angles <b>complémentaires</b>, 90°.',
      'Si deux droites parallèles sont coupées par une sécante, les angles <b>alternes-internes</b> sont égaux et les angles <b>correspondants</b> sont égaux.'
    ],
    retenirAr: 'الزاويتان المتقابلتان بالرأس متقايستان. إذا قطع مستقيم مستقيمين متوازيين فإن الزوايا المتبادلة داخليا متقايسة والزوايا المتناظرة متقايسة.',
    voc: [['opposés par le sommet', 'متقابلتان بالرأس'], ['alternes-internes', 'متبادلتان داخليا'], ['correspondants', 'متناظرتان'], ['supplémentaires', 'متكاملتان'], ['complémentaires', 'متتامتان']]
  });
})();
