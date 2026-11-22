/* @meta {"id":"1ac-sedimentation","level":"1","order":6,"theme":"Géologie","title":"Le cycle sédimentaire et les fossiles","ar":"الدورة الرسوبية والأحافير","lead":"Un coquillage pétrifié dans une roche de l'Atlas, loin de la mer : comment est-il arrivé là ? On suit les grains de roche de la montagne à la mer."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var COUL = ['#c9a36b', '#a98552', '#d8c08f', '#8f7046', '#bfa27a'];

  /* coupe : montagne à gauche, mer à droite, couches qui s'empilent au fond */
  function coupe(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), lay = S('g', {}, g), gr = S('g', {}, g);
    S('path', { d: 'M0 200 L0 70 L40 40 L80 80 L120 120 L150 200 Z', fill: '#6b5a4a' }, g);
    var mer = S('path', { d: 'M150 100 H360 V200 H150 Z', fill: 'rgba(80,140,220,.35)' }, g);
    S('path', { d: 'M120 120 L150 100', stroke: '#7fb2ff', 'stroke-width': 3 }, g);
    var coq = S('path', { d: 'M0 0 q8 -12 16 0 z', fill: '#f2e3c4', stroke: '#141517' }, g);
    g.set = function (n, grains, fossile) { // n couches, grains en transport, coquillage
      while (lay.firstChild) lay.removeChild(lay.firstChild); while (gr.firstChild) gr.removeChild(gr.firstChild);
      for (var i = 0; i < n; i++) S('rect', { x: 150, y: 192 - (i + 1) * 14, width: 210, height: 14, fill: COUL[i % 5], stroke: '#141517', 'stroke-width': .6 }, lay);
      for (var k = 0; k < grains; k++) S('circle', { cx: 60 + k * 14, cy: 70 + k * 6, r: 3, fill: '#c9a36b' }, gr);
      coq.style.opacity = fossile ? 1 : 0; coq.setAttribute('transform', 'translate(260,' + (192 - 14 * Math.max(1, Math.min(n, 1)) + 4) + ')');
    };
    return g;
  }

  MV.lesson({
    id: '1ac-sedimentation',
    objectif: {
      fr: 'Décrire les étapes du cycle sédimentaire (érosion, transport, sédimentation) et expliquer la formation des fossiles et la superposition des couches.',
      ar: 'وصف مراحل الدورة الرسوبية (التعرية، النقل، الترسب)، وتفسير تكون الأحافير وتراكب الطبقات.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Un coquillage dans la montagne',
      hud: [['l', 'lieu'], ['t', 'trouvaille'], ['q', 'comment ?']],
      draw: function (svg) { var e = {}; e.c = coupe(svg); return e; },
      steps: [
        { cap: 'Dans une falaise de l\'**Atlas**, on trouve un coquillage devenu **pierre**.', hud: { l: ['Atlas'], t: ['coquillage en pierre'], q: '–' }, run: function (e) { e.c.set(5, 0, 1); } },
        { cap: 'Pourtant la mer est **loin**, à des centaines de kilomètres.', hud: { l: 'Atlas', t: 'coquillage en pierre', q: '–' }, run: function (e) { e.c.set(5, 0, 1); } },
        { cap: 'Comment est-il arrivé là ? On le saura à la fin.', hud: { l: 'Atlas', t: 'coquillage en pierre', q: ['?'] }, run: function (e) { e.c.set(5, 0, 1); } }
      ]
    },

    predire: {
      q: "Dans une falaise de l'Atlas, on trouve un coquillage devenu pierre, alors que la mer est à des centaines de kilomètres. Comment est-il arrivé là ?",
      ar: "في جرف بالأطلس نجد صدفة تحجّرت، والبحر يبعد مئات الكيلومترات. كيف وصلت إلى هناك؟",
      o: ["Un oiseau l'a apporté", "Il a poussé dans la roche", "Il vivait dans une mer qui recouvrait la région, puis les sédiments sont devenus roche"],
      a: 2,
      e: "Autrefois, la mer recouvrait la région. Le coquillage s'est enfoui dans des sédiments déposés en couches, qui se sont transformés en roche sédimentaire. Le coquillage est devenu un fossile.",
      ear: "كان البحر يغطي المنطقة قديماً، فدُفنت الصدفة في رواسب تحوّلت إلى صخر رسوبي وصارت أحفورة."
    },

    prepare: [
      ['La pluie et le vent usent lentement les roches.', true, 'C\'est l\'érosion.'],
      ['Les rivières transportent du sable et de la boue.', true, 'Jusqu\'aux lacs et aux mers.'],
      ['Une couche déposée en dernier se trouve en bas.', false, 'Elle se dépose au-dessus des autres.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Le cycle sédimentaire',
      hud: [['e', 'étape'], ['a', 'agent'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.c = coupe(svg); return e; },
      steps: [
        { cap: '**Érosion** : la pluie, le vent et le gel détachent des grains de la montagne.', ar: 'التعرية: المطر والرياح والصقيع تقتلع حبيبات من الجبل.', hud: { e: ['érosion'], a: 'pluie, vent, gel', r: 'grains' }, run: function (e) { e.c.set(0, 2, 0); } },
        { cap: '**Transport** : les cours d\'eau emportent les grains vers la mer.', ar: 'النقل: المجاري المائية تحمل الحبيبات نحو البحر.', hud: { e: ['transport'], a: ['rivières'], r: 'vers la mer' }, run: function (e) { e.c.set(0, 6, 0); } },
        { cap: '**Sédimentation** : les grains se déposent au fond, en **couches** horizontales.', ar: 'الترسب: تتوضع الحبيبات في القعر على شكل طبقات أفقية.', hud: { e: ['sédimentation'], a: 'eau calme', r: ['couches'] }, run: function (e) { e.c.set(3, 0, 0); } },
        { cap: 'Un coquillage mort est **enfoui** dans une couche : il devient un **fossile**.', ar: 'صدفة ميتة تدفن داخل طبقة فتصبح أحفورة.', hud: { e: ['fossilisation'], a: 'enfouissement', r: ['fossile'] }, run: function (e) { e.c.set(4, 0, 1); } },
        { cap: 'Les couches durcissent en **roches sédimentaires**. La plus **basse** est la plus **ancienne**.', ar: 'تتصلب الطبقات وتصبح صخورا رسوبية، والطبقة السفلى هي الأقدم.', hud: { e: 'superposition', a: 'temps', r: ['bas = ancien'] }, run: function (e) { e.c.set(5, 0, 1); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Fais passer le temps : les couches s\'empilent au fond de la mer.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Couches de sédiments' }, st);
          var cp = coupe(svg), set = MV.hud(c, [['n', 'couches'], ['h', 'épaisseur'], ['a', 'la plus ancienne', 1]]);
          MV.slider(c, { label: 'temps', min: 0, max: 5, value: 0 }, function (n) { cp.set(n, n < 5 ? 3 : 0, n >= 1); set('n', n); set('h', n * 2 + ' m'); set('a', n ? 'couche du bas' : '–'); if (n === 5) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Repère le coquillage : il est dans la couche la plus ancienne.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Une falaise montre trois couches : A en bas, B au milieu, C en haut.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. La couche la plus ancienne est :', o: ['couche A', 'couche B', 'couche C'], a: 0 },
            { type: 'opt', q: 'Étape 2. La plus récente est :', o: ['couche C', 'couche A'], a: 0 },
            { type: 'opt', q: 'Étape 3. Un fossile de poisson dans B indique que B s\'est formée :', o: ['dans l\'eau', 'sur la terre ferme'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'L\'usure des roches par la pluie et le vent s\'appelle :', o: ['l\'érosion', 'la sédimentation'], a: 0 },
      { lvl: 'Niveau 2', q: 'Le dépôt des grains au fond de l\'eau s\'appelle :', o: ['la sédimentation', 'le transport'], a: 0 },
      { lvl: 'Niveau 3', q: 'Dans une série de couches non déformées, la couche du haut est :', o: ['la plus récente', 'la plus ancienne'], a: 0 },
      { lvl: 'Niveau 4', q: 'Une couche de 3 m s\'est déposée à 1 cm par siècle. Combien de siècles ?', a: 300, hint: '3 m = 300 cm.' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le coquillage de l\'Atlas',
      hud: [['p', 'passé'], ['e', 'ensuite'], ['r', 'aujourd\'hui']],
      draw: function (svg) { var e = {}; e.c = coupe(svg); return e; },
      steps: [
        { cap: 'Autrefois, la **mer** recouvrait cette région : le coquillage y est enfoui dans les sédiments.', hud: { p: ['mer'], e: '–', r: '–' }, run: function (e) { e.c.set(4, 0, 1); } },
        { cap: 'Les couches sont devenues roches, puis ont été **soulevées** en montagne. Le fossile témoigne de l\'ancienne mer.', ar: 'كانت المنطقة بحرا، ثم تصلبت الطبقات وارتفعت جبالا، والأحفورة دليل على البحر القديم.', hud: { p: 'mer', e: ['roches soulevées'], r: ['fossile dans l\'Atlas'] }, run: function (e) { e.c.set(5, 0, 1); } }
      ]
    },

    retenir: [
      'Le <b>cycle sédimentaire</b> : <b>érosion</b> des roches, <b>transport</b> des débris par l\'eau et le vent, <b>sédimentation</b> en couches, puis transformation en roches sédimentaires.',
      'Un <b>fossile</b> est un reste ou une trace d\'être vivant conservé dans une roche. Dans des couches non déformées, la plus basse est la plus <b>ancienne</b>.'
    ],
    retenirAr: 'الدورة الرسوبية: تعرية الصخور، ثم نقل المواد، ثم ترسبها على شكل طبقات تتحول إلى صخور رسوبية. الأحفورة بقايا أو أثر كائن حي محفوظ في صخرة، والطبقة السفلى هي الأقدم.',
    voc: [['l\'érosion', 'التعرية'], ['le transport', 'النقل'], ['la sédimentation', 'الترسب'], ['une couche', 'طبقة'], ['un fossile', 'أحفورة']]
  });
})();
