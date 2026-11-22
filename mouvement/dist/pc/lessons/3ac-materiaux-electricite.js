/* @meta {"id":"3ac-materiaux-electricite","level":"3","order":2,"theme":"Les matériaux","title":"Matériaux et électricité","ar":"المواد والكهرباء","lead":"La mine d'un crayon allume une lampe, une règle en plastique non : on teste les matériaux et on regarde les électrons libres."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var MAT = [['cuivre', true, '#c87533'], ['aluminium', true, '#d8dce2'], ['mine de crayon (graphite)', true, '#3a3a3a'], ['plastique', false, '#7fb2ff'], ['verre', false, '#a8e0d0'], ['bois sec', false, '#c9a35a']];

  function circuit(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('path', { d: 'M60 180 H140 M220 180 H300 V70 H60 V180', fill: 'none', stroke: '#cfd3d8', 'stroke-width': 3 }, g);
    S('rect', { x: 50, y: 110, width: 20, height: 40, fill: '#6b6f76' }, g); T(g, 40, 135, 'pile', 'tag', 'end');
    var lamp = S('circle', { cx: 180, cy: 70, r: 15, fill: '#3a3d42', stroke: '#cfd3d8', 'stroke-width': 2 }, g);
    var halo = S('circle', { cx: 180, cy: 70, r: 28, fill: '#f2c14e', opacity: 0 }, g); halo.style.transition = 'opacity .5s';
    var ech = S('rect', { x: 140, y: 172, width: 80, height: 16, rx: 4, fill: '#3a3d42' }, g), lab = T(g, 180, 210, 'échantillon', 'tag');
    var dots = []; for (var i = 0; i < 10; i++) dots.push(S('circle', { r: 3, fill: '#4c9bf2', opacity: 0 }, g));
    var on = false, t0 = 0;
    function tick(ts) {
      if (!t0) t0 = ts; var p = ((ts - t0) / 4000) % 1;
      dots.forEach(function (d, i) {
        var q = (p + i / 10) % 1, L = 80 + 80 + 110 + 240 + 110, s = q * L, x, y;
        // trajet : du bas gauche vers la droite, le haut, retour à gauche
        if (s < 240) { x = 60 + s; y = 180; } else if (s < 350) { x = 300; y = 180 - (s - 240); } else if (s < 590) { x = 300 - (s - 350); y = 70; } else { x = 60; y = 70 + (s - 590); }
        d.setAttribute('cx', x); d.setAttribute('cy', y); d.setAttribute('opacity', on ? 1 : 0);
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    g.test = function (m) { ech.setAttribute('fill', m ? m[2] : '#3a3d42'); lab.textContent = m ? m[0] : 'échantillon'; on = !!(m && m[1]); lamp.setAttribute('fill', on ? '#f2c14e' : '#3a3d42'); halo.setAttribute('opacity', on ? .35 : 0); };
    return g;
  }

  MV.lesson({
    id: '3ac-materiaux-electricite',
    objectif: {
      fr: 'Classer les matériaux en conducteurs et isolants électriques, et expliquer la conduction des métaux par les électrons libres.',
      ar: 'تصنيف المواد إلى موصلة وعازلة للكهرباء، وتفسير توصيل الفلزات بالإلكترونات الحرة.'
    },

    ouverture: {
      vb: '0 0 360 230', label: 'Un crayon dans un circuit',
      hud: [['m', 'matériau'], ['l', 'lampe'], ['q', 'pourquoi ?']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'Un circuit ouvert : on place un objet entre les deux pinces.', hud: { m: '–', l: 'éteinte', q: '–' }, run: function (e) { e.c.test(null); } },
        { cap: 'Avec la **mine d\'un crayon**, la lampe brille !', hud: { m: ['graphite'], l: ['allumée'], q: '–' }, run: function (e) { e.c.test(MAT[2]); } },
        { cap: 'Avec une règle en **plastique**, rien. Pourquoi ? On le saura à la fin.', hud: { m: ['plastique'], l: ['éteinte'], q: ['?'] }, run: function (e) { e.c.test(MAT[3]); } }
      ]
    },

    predire: {
      q: "Entre les pinces d'un circuit ouvert, la mine d'un crayon fait briller la lampe, mais une règle en plastique non. Pourquoi ?",
      ar: "بين طرفي دارة مفتوحة، قلم الرصاص يجعل المصباح يضيء لكن المسطرة البلاستيكية لا. لماذا؟",
      o: ["La mine est plus lourde que la règle", "La mine conduit le courant, le plastique est isolant", "La règle est trop longue"],
      a: 1,
      e: "La mine est en graphite, un conducteur : des électrons libres peuvent s'y déplacer. Le plastique est un isolant : il ne laisse pas passer le courant électrique.",
      ear: "سنّ القلم من الغرافيت وهو موصل تتحرك فيه إلكترونات حرة، أما البلاستيك فعازل لا يمرّر التيار."
    },

    prepare: [
      ['Les fils électriques sont en cuivre.', true, 'Le cuivre conduit très bien le courant.'],
      ['Le plastique conduit le courant.', false, 'C\'est un isolant : on l\'utilise pour la gaine des fils.'],
      ['Toute matière est faite d\'atomes.', true, 'Un atome contient un noyau et des électrons.']
    ],

    regarde: {
      vb: '0 0 360 230', label: 'Conducteurs, isolants, électrons libres',
      hud: [['m', 'matériau'], ['c', 'classe'], ['e', 'électrons libres']],
      draw: function (svg) {
        var e = {}; e.c = circuit(svg);
        e.zoom = S('g', {}, svg);
        S('rect', { x: 20, y: 20, width: 320, height: 190, rx: 12, fill: '#17181a', stroke: 'var(--acc)' }, e.zoom);
        for (var i = 0; i < 5; i++) for (var j = 0; j < 3; j++) S('circle', { cx: 60 + i * 60, cy: 70 + j * 50, r: 12, fill: '#c87533' }, e.zoom);
        e.libres = S('g', {}, e.zoom); for (i = 0; i < 12; i++) S('circle', { cx: 50 + (i * 53 % 260), cy: 50 + (i * 37 % 140), r: 4, fill: '#4c9bf2' }, e.libres);
        e.libres.style.transition = 'transform 2s linear';
        T(e.zoom, 180, 200, 'métal vu de très près : électrons libres (bleu)', 'tag');
        return e;
      },
      steps: [
        { cap: 'Le **cuivre** laisse passer le courant : la lampe brille. C\'est un **conducteur**.', ar: 'النحاس يسمح بمرور التيار: إنه موصل.', hud: { m: ['cuivre'], c: ['conducteur'], e: '–' }, run: function (e) { e.c.test(MAT[0]); } },
        { cap: 'L\'**aluminium** et tous les métaux sont conducteurs. Le graphite aussi.', ar: 'الألومنيوم وكل الفلزات موصلة، والغرافيت أيضا.', hud: { m: ['aluminium'], c: 'conducteur', e: '–' }, run: function (e) { e.c.test(MAT[1]); } },
        { cap: 'Le **verre** ne laisse pas passer le courant : c\'est un **isolant**.', ar: 'الزجاج لا يسمح بمرور التيار: إنه عازل.', hud: { m: ['verre'], c: ['isolant'], e: '–' }, run: function (e) { e.c.test(MAT[4]); } },
        { cap: 'Dans un métal, certains électrons sont **libres** de se déplacer d\'atome en atome.', ar: 'في الفلز توجد إلكترونات حرة تستطيع التنقل بين الذرات.', on: ['zoom'], hud: { m: 'métal', c: 'conducteur', e: ['oui'] }, run: function (e) { e.libres.style.transform = 'none'; } },
        { cap: 'Avec une pile, ils avancent tous dans le même sens : c\'est le **courant électrique**.', ar: 'عند ربطه بعمود تتحرك الإلكترونات الحرة في نفس الاتجاه: هذا هو التيار الكهربائي.', on: ['zoom'], hud: { m: 'métal', c: 'conducteur', e: ['mouvement d\'ensemble'] }, run: function (e) { e.libres.style.transform = 'translate(30px,0)'; } },
        { cap: 'Dans un isolant, **pas d\'électrons libres** : le courant ne passe pas.', ar: 'في العازل لا توجد إلكترونات حرة، فلا يمر التيار.', hud: { m: ['plastique'], c: ['isolant'], e: ['non'] }, run: function (e) { e.c.test(MAT[3]); } }
      ]
    },

    faisons: [
      { title: 'Le testeur', intro: 'Place chaque matériau dans le circuit. Observe la lampe.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 230', role: 'img', 'aria-label': 'Testeur de conduction' }, st);
          var ci = circuit(svg), set = MV.hud(c, [['m', 'matériau'], ['c', 'classe', 1]]), row = MV.H('div', 'row', '', c), seen = {};
          MAT.forEach(function (m) { MV.H('button', 'btn', m[0], row).onclick = function () { ci.test(m); set('m', m[0]); set('c', m[1] ? 'conducteur' : 'isolant'); seen[m[0]] = 1; if (Object.keys(seen).length >= 4) done(); }; });
          MV.H('p', 'small', 'Teste au moins quatre matériaux.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Un câble électrique : une âme en cuivre et une gaine en plastique.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Le cuivre est :', o: ['un conducteur', 'un isolant'], a: 0 },
            { type: 'opt', q: 'Étape 2. Le rôle de la gaine en plastique est :', o: ['conduire le courant', 'isoler et protéger l\'utilisateur'], a: 1 },
            { type: 'opt', q: 'Étape 3. Le cuivre conduit parce qu\'il contient :', o: ['des électrons libres', 'de l\'air', 'de l\'eau'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Lequel est un isolant électrique ?', o: ['le fer', 'le verre', 'l\'aluminium'], a: 1 },
      { lvl: 'Niveau 2', q: 'Le graphite d\'une mine de crayon est :', o: ['conducteur', 'isolant'], a: 0 },
      { lvl: 'Niveau 3', q: 'Le courant électrique dans un métal est un déplacement :', o: ['d\'atomes', 'd\'électrons libres', 'de noyaux'], a: 1 },
      { lvl: 'Niveau 4', q: 'Pourquoi les manches des tournevis d\'électricien sont-ils en plastique ?', o: ['pour être plus légers', 'parce que le plastique est un isolant qui protège la main', 'pour la couleur'], a: 1 }
    ],

    bilan: {
      vb: '0 0 360 230', label: 'Graphite et plastique',
      hud: [['g', 'graphite'], ['p', 'plastique'], ['r', 'réponse']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'Le graphite possède des **électrons libres** : la lampe brille.', hud: { g: ['conducteur'], p: '–', r: '–' }, run: function (e) { e.c.test(MAT[2]); } },
        { cap: 'Le plastique **n\'en a pas** : c\'est un isolant, la lampe reste éteinte.', ar: 'الغرافيت موصل لأنه يحتوي على إلكترونات حرة، والبلاستيك عازل.', hud: { g: 'conducteur', p: ['isolant'], r: ['électrons libres'] }, run: function (e) { e.c.test(MAT[3]); } }
      ]
    },

    retenir: [
      'Les <b>conducteurs</b> (métaux, graphite) laissent passer le courant électrique ; les <b>isolants</b> (plastique, verre, bois sec) ne le laissent pas passer.',
      'Dans un métal, des <b>électrons libres</b> peuvent se déplacer ; le courant électrique est leur déplacement d\'ensemble. Les isolants n\'ont pas d\'électrons libres.'
    ],
    retenirAr: 'المواد الموصلة كالفلزات والغرافيت تسمح بمرور التيار الكهربائي، والمواد العازلة كالبلاستيك والزجاج والخشب الجاف لا تسمح بمروره. في الفلزات إلكترونات حرة، والتيار الكهربائي هو انتقالها الإجمالي.',
    voc: [['un conducteur', 'موصل'], ['un isolant', 'عازل'], ['un électron libre', 'إلكترون حر'], ['le courant électrique', 'التيار الكهربائي']]
  });
})();
