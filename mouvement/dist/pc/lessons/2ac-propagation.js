/* @meta {"id":"2ac-propagation","level":"2","order":9,"theme":"La lumière","title":"Propagation de la lumière","ar":"انتشار الضوء","lead":"Le jour d'une éclipse, la Lune cache le Soleil. La lumière va tout droit : une petite Lune bien placée suffit à faire de l'ombre sur la Terre."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, SX = 30, SY = 105, EX = 330; // source ponctuelle, écran

  /* source, balle opaque à la distance d, écran ; rayons limites et ombre */
  function banc(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    S('circle', { cx: SX, cy: SY, r: 7, fill: '#f2c14e' }, g); T(g, SX, SY + 26, 'source', 'tag');
    S('line', { x1: EX, y1: 15, x2: EX, y2: 195, stroke: '#e9e9ea', 'stroke-width': 4 }, g); T(g, EX - 4, 210, 'écran', 'tag', 'end');
    g.set = function (d, r) { // d : abscisse du centre de la balle ; r : rayon
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var h = r * (EX - SX) / (d - SX); // demi-hauteur de l'ombre portée
      S('path', { d: 'M' + SX + ' ' + SY + ' L' + EX + ' ' + (SY - h) + ' L' + EX + ' ' + (SY + h) + ' Z', fill: 'rgba(0,0,0,.35)' }, dyn);
      S('path', { d: 'M' + SX + ' ' + SY + ' L' + EX + ' ' + Math.max(15, SY - h - 60) + ' L' + EX + ' ' + (SY - h) + ' Z M' + SX + ' ' + SY + ' L' + EX + ' ' + (SY + h) + ' L' + EX + ' ' + Math.min(195, SY + h + 60) + ' Z', fill: 'rgba(242,193,78,.18)' }, dyn);
      [-1, 1].forEach(function (s) { S('line', { x1: SX, y1: SY, x2: EX, y2: SY + s * h, stroke: '#f2c14e', 'stroke-width': 1.5 }, dyn); });
      S('circle', { cx: d, cy: SY, r: r, fill: '#3a3027', stroke: '#141517' }, dyn); S('path', { d: 'M' + d + ' ' + (SY - r) + ' A' + r + ' ' + r + ' 0 0 0 ' + d + ' ' + (SY + r) + ' Z', fill: '#d9b98a' }, dyn);
      S('line', { x1: EX, y1: Math.max(15, SY - h), x2: EX, y2: Math.min(195, SY + h), stroke: '#141517', 'stroke-width': 6 }, dyn);
      T(dyn, EX - 8, SY + 4, 'ombre portée', 'tag', 'end');
      return Math.round(2 * h);
    };
    return g;
  }

  MV.lesson({
    id: '2ac-propagation',
    objectif: {
      fr: 'Savoir que la lumière se propage en ligne droite dans un milieu transparent et homogène, et expliquer l\'ombre propre, l\'ombre portée et les éclipses.',
      ar: 'معرفة أن الضوء ينتشر وفق خط مستقيم في وسط شفاف ومتجانس، وتفسير الظل الذاتي والظل المحمول والكسوف.'
    },

    prerequis: {
      fr: 'Source de lumière, milieux transparents et opaques.',
      ar: 'المصدر الضوئي والأوساط الشفافة والمعتمة.'
    },

    ouverture: {
      vb: '0 0 360 215', label: 'Une éclipse de Soleil',
      hud: [['s', 'Soleil'], ['l', 'Lune'], ['q', 'comment ?']],
      draw: function (svg) { var e = {}; e.b = banc(svg); return e; },
      steps: [
        { cap: 'Le **Soleil** éclaire la Terre.', hud: { s: ['source'], l: '–', q: '–' }, run: function (e) { e.b.set(200, 10); } },
        { cap: 'La **Lune** passe entre le Soleil et la Terre : il fait sombre en plein jour.', hud: { s: 'source', l: ['entre les deux'], q: '–' }, run: function (e) { e.b.set(200, 10); } },
        { cap: 'Comment une Lune si petite peut-elle cacher le Soleil ? On le saura à la fin.', hud: { s: 'source', l: 'entre les deux', q: ['?'] }, run: function (e) { e.b.set(200, 10); } }
      ]
    },

    predire: {
      q: "La Lune est bien plus petite que le Soleil. Comment peut-elle le cacher lors d'une éclipse ?",
      ar: "القمر أصغر بكثير من الشمس. كيف يمكنه إخفاؤها أثناء الكسوف؟",
      o: ["La Lune est plus grosse que le Soleil", "La Lune produit sa propre ombre", "La lumière va en ligne droite et la Lune est beaucoup plus proche"],
      a: 2,
      e: "Le Soleil est environ 400 fois plus large que la Lune, mais aussi environ 400 fois plus loin. Comme la lumière se propage en ligne droite, la Lune alignée avec le Soleil et la Terre peut le cacher.",
      ear: "الضوء ينتشر في خط مستقيم والقمر أقرب بكثير إلى الأرض، فإذا اصطفّ بين الشمس والأرض حجبها."
    },

    prepare: [
      ['Dans l\'air, la lumière se propage en ligne droite.', true, 'Comme le faisceau d\'une lampe dans la poussière.'],
      ['Un objet transparent produit une ombre bien noire.', false, 'Il laisse passer la lumière.'],
      ['L\'ombre d\'un objet est du côté opposé à la source.', true, 'La lumière arrive de la source.']
    ],

    regarde: {
      vb: '0 0 360 215', label: 'Lumière en ligne droite',
      hud: [['n', 'notion'], ['d', 'description'], ['h', 'taille de l\'ombre']],
      draw: function (svg) { var e = {}; e.b = banc(svg); return e; },
      steps: [
        { cap: 'Dans un milieu **transparent** et **homogène**, la lumière va en **ligne droite**. On la représente par des **rayons**.', ar: 'في وسط شفاف ومتجانس ينتشر الضوء وفق خط مستقيم، ونمثله بأشعة.', hud: { n: ['propagation rectiligne'], d: 'rayon = droite fléchée', h: '–' }, run: function (e) { e.b.set(180, 16); } },
        { cap: 'La face éclairée de la balle est claire ; l\'autre face, sombre : c\'est l\'**ombre propre**.', ar: 'الوجه غير المضاء من الكرة هو الظل الذاتي.', hud: { n: ['ombre propre'], d: 'sur l\'objet', h: '–' }, run: function (e) { e.b.set(180, 16); } },
        { cap: 'Sur l\'écran, la zone non éclairée est l\'**ombre portée**.', ar: 'المنطقة غير المضاءة على الشاشة هي الظل المحمول.', hud: { n: ['ombre portée'], d: 'sur l\'écran', h: ['64'] }, run: function (e) { e.b.set(180, 16); } },
        { cap: 'Plus l\'objet est **près de la source**, plus son ombre portée est **grande**.', ar: 'كلما اقترب الجسم من المنبع كبر ظله المحمول.', hud: { n: 'ombre portée', d: 'objet près de la source', h: ['137'] }, run: function (e) { e.b.set(100, 16); } },
        { cap: 'La lumière est très rapide : environ **300 000 km/s** dans le vide.', ar: 'سرعة الضوء في الفراغ حوالي [[300 000 km/s]].', hud: { n: ['vitesse'], d: '300 000 km/s', h: '–' }, run: function (e) { e.b.set(260, 16); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Rapproche la balle de la source. Obtiens une ombre portée qui couvre tout l\'écran.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 215', role: 'img', 'aria-label': 'Source, balle et écran' }, st);
          var b = banc(svg), set = MV.hud(c, [['d', 'distance source-balle'], ['h', 'hauteur de l\'ombre', 1]]);
          MV.slider(c, { label: 'position de la balle', min: 70, max: 290, value: 230, step: 20 }, function (x) { var h = b.set(x, 16); set('d', x - SX); set('h', h > 180 ? 'tout l\'écran' : h); if (h > 180) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'La lumière du Soleil met environ 500 s pour atteindre la Terre.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. La lumière va :', o: ['en ligne droite', 'en zigzag'], a: 0 },
            { q: 'Étape 2. 500 s, c\'est environ combien de minutes (arrondi) ?', a: 8, tol: 0.5 },
            { type: 'opt', q: 'Étape 3. Pendant une éclipse de Soleil, la Terre est dans :', o: ['l\'ombre de la Lune', 'l\'ombre du Soleil'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Dans un milieu homogène et transparent, la lumière se propage :', o: ['en ligne droite', 'en courbe'], a: 0 },
      { lvl: 'Niveau 2', q: 'La partie non éclairée d\'un objet est :', o: ['son ombre propre', 'son ombre portée'], a: 0 },
      { lvl: 'Niveau 3', q: 'Si on éloigne l\'objet de la source, son ombre portée :', o: ['diminue', 'augmente'], a: 0 },
      { lvl: 'Niveau 4', q: 'À 300 000 km/s, combien de km la lumière parcourt-elle en 2 s ?', a: 600000 }
    ],

    bilan: {
      vb: '0 0 360 215', label: 'L\'éclipse',
      hud: [['p', 'propagation'], ['l', 'Lune'], ['t', 'Terre']],
      draw: function (svg) { var e = {}; e.b = banc(svg); return e; },
      steps: [
        { cap: 'La lumière du Soleil va **en ligne droite** : la Lune l\'arrête.', hud: { p: ['ligne droite'], l: ['objet opaque'], t: '–' }, run: function (e) { e.b.set(200, 10); } },
        { cap: 'Une partie de la Terre se trouve dans l\'**ombre portée** de la Lune : c\'est l\'éclipse.', ar: 'الضوء ينتشر وفق خط مستقيم، فيقع جزء من الأرض في الظل المحمول للقمر: إنه الكسوف.', hud: { p: 'ligne droite', l: 'objet opaque', t: ['dans l\'ombre'] }, run: function (e) { e.b.set(200, 10); } }
      ]
    },

    retenir: [
      'Dans un milieu <b>transparent et homogène</b>, la lumière se propage <b>en ligne droite</b>, à environ 300 000 km/s dans le vide. On la représente par des <b>rayons</b>.',
      'Un objet opaque éclairé a une <b>ombre propre</b> (sur lui) et une <b>ombre portée</b> (derrière lui). Les <b>éclipses</b> s\'expliquent ainsi.'
    ],
    retenirAr: 'في وسط شفاف ومتجانس ينتشر الضوء وفق خط مستقيم بسرعة حوالي 300000 كيلومتر في الثانية في الفراغ. للجسم المعتم المضاء ظل ذاتي وظل محمول، وبهذا يفسر الكسوف والخسوف.',
    voc: [['la propagation rectiligne', 'الانتشار المستقيمي'], ['un rayon lumineux', 'شعاع ضوئي'], ['l\'ombre propre', 'الظل الذاتي'], ['l\'ombre portée', 'الظل المحمول'], ['une éclipse', 'كسوف أو خسوف']]
  });
})();
