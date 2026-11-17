/* @meta {"id":"2ac-installation-domestique","level":"2","order":13,"theme":"Électricité","title":"L'installation électrique domestique","ar":"التركيب الكهربائي المنزلي","lead":"L'électricien pose son tournevis testeur dans une prise : il s'allume dans un trou, pas dans l'autre. Les deux fils d'une prise ne sont donc pas pareils."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* schéma : compteur, disjoncteur, phase (rouge), neutre (bleu), terre (vert-jaune), appareils en dérivation */
  function maison(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('rect', { x: 14, y: 30, width: 44, height: 40, rx: 4, fill: '#1d1f23', stroke: '#9aa0a8' }, g); T(g, 36, 86, 'compteur', 'tag');
    S('rect', { x: 70, y: 30, width: 34, height: 40, rx: 4, fill: '#1d1f23', stroke: '#9aa0a8' }, g); T(g, 87, 100, 'disjoncteur', 'tag');
    S('line', { x1: 104, y1: 40, x2: 345, y2: 40, stroke: '#e5484d', 'stroke-width': 3 }, g); T(g, 345, 32, 'phase', 'tag', 'end');
    S('line', { x1: 104, y1: 60, x2: 345, y2: 60, stroke: '#3d8fd6', 'stroke-width': 3 }, g); T(g, 345, 74, 'neutre', 'tag', 'end');
    S('line', { x1: 104, y1: 190, x2: 345, y2: 190, stroke: '#9bc53d', 'stroke-width': 3, 'stroke-dasharray': '8 4' }, g); T(g, 345, 204, 'terre', 'tag', 'end');
    [[150, 'lampe'], [225, 'prise'], [300, 'machine']].forEach(function (a) {
      S('line', { x1: a[0] - 8, y1: 40, x2: a[0] - 8, y2: 120, stroke: '#e5484d', 'stroke-width': 2 }, g); S('line', { x1: a[0] + 8, y1: 60, x2: a[0] + 8, y2: 120, stroke: '#3d8fd6', 'stroke-width': 2 }, g);
      S('rect', { x: a[0] - 22, y: 120, width: 44, height: 34, rx: 6, fill: '#2a2d33', stroke: '#e9e9ea' }, g); T(g, a[0], 172, a[1], 'tag');
      if (a[1] !== 'lampe') S('line', { x1: a[0], y1: 154, x2: a[0], y2: 190, stroke: '#9bc53d', 'stroke-width': 2, 'stroke-dasharray': '4 3' }, g);
    });
    S('circle', { cx: 142, cy: 90, r: 5, fill: '#f2c14e' }, g); T(g, 14, 120, 'interrupteur', 'tag', 'start');
    var dyn = S('g', {}, g);
    g.set = function (o) { // o.test : 'phase' ou 'neutre' ; o.hot : liste d'éléments mis en avant
      o = o || {};
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.test) { var y = o.test === 'phase' ? 40 : 60, on = o.test === 'phase'; S('path', { d: 'M236 ' + (y - 22) + ' l-6 22', stroke: '#e9e9ea', 'stroke-width': 3, fill: 'none' }, dyn); S('circle', { cx: 237, cy: y - 26, r: 5, fill: on ? '#f2c14e' : '#3a3e46', stroke: '#e9e9ea' }, dyn); T(dyn, 246, y - 22, on ? 'allumé' : 'éteint', 'tag acc', 'start'); }
      return o.test === 'phase';
    };
    return g;
  }

  MV.lesson({
    id: '2ac-installation-domestique',
    objectif: {
      fr: 'Décrire l\'installation électrique d\'une maison : phase, neutre, terre, compteur, disjoncteur, appareils en dérivation, et les règles de sécurité.',
      ar: 'وصف التركيب الكهربائي المنزلي: الطور، المحايد، الأرضي، العداد، الفاصل، الأجهزة المركبة على التوازي، وقواعد السلامة.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Le tournevis testeur',
      hud: [['t1', 'trou 1'], ['t2', 'trou 2'], ['q', 'pourquoi ?']],
      draw: function (svg) { var e = {}; e.m = maison(svg); return e; },
      steps: [
        { cap: 'Un électricien teste une **prise** avec un **tournevis testeur**.', hud: { t1: '–', t2: '–', q: '–' }, run: function (e) { e.m.set({}); } },
        { cap: 'Dans un trou, le testeur **s\'allume** ; dans l\'autre, il reste **éteint**.', hud: { t1: ['allumé'], t2: ['éteint'], q: '–' }, run: function (e) { e.m.set({ test: 'phase' }); } },
        { cap: 'Pourquoi les deux fils ne se comportent-ils pas pareil ? On le saura à la fin.', hud: { t1: 'allumé', t2: 'éteint', q: ['?'] }, run: function (e) { e.m.set({ test: 'neutre' }); } }
      ]
    },

    prepare: [
      ['Les appareils d\'une maison sont branchés en dérivation.', true, 'Chacun fonctionne indépendamment.'],
      ['La tension du secteur est de 4,5 V.', false, 'Elle est de 220 V : elle est dangereuse.'],
      ['Le compteur mesure l\'énergie consommée.', true, 'En kilowattheures.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Le schéma de la maison',
      hud: [['e', 'élément'], ['r', 'rôle'], ['s', 'sécurité']],
      draw: function (svg) { var e = {}; e.m = maison(svg); return e; },
      steps: [
        { cap: 'L\'électricité arrive par le **compteur** (énergie consommée) puis le **disjoncteur général** (protection).', ar: 'يصل التيار عبر العداد ثم الفاصل العام.', hud: { e: ['compteur, disjoncteur'], r: 'mesurer, protéger', s: '–' }, run: function (e) { e.m.set({}); } },
        { cap: 'Deux fils : la **phase** (dangereuse, 220 V par rapport à la terre) et le **neutre** (environ 0 V).', ar: 'سلكان: الطور وهو خطير، والمحايد.', hud: { e: ['phase, neutre'], r: '220 V entre eux', s: ['phase dangereuse'] }, run: function (e) { e.m.set({ test: 'phase' }); } },
        { cap: 'Le tournevis testeur ne s\'allume que sur la **phase**.', ar: 'المفك الكاشف لا يضيء إلا على الطور.', hud: { e: 'testeur', r: ['repère la phase'], s: 'phase = allumé' }, run: function (e) { e.m.set({ test: 'phase' }); } },
        { cap: 'Les appareils sont **en dérivation** entre phase et neutre ; l\'**interrupteur** se place sur la **phase**.', ar: 'الأجهزة مركبة على التوازي بين الطور والمحايد، وقاطع التيار يوضع على الطور.', hud: { e: ['dérivation'], r: 'indépendants', s: ['interrupteur sur la phase'] }, run: function (e) { e.m.set({}); } },
        { cap: 'Le **fil de terre** (vert et jaune) relie les carcasses métalliques au sol : il protège des **électrocutions**.', ar: 'السلك الأرضي (أخضر وأصفر) يربط الهياكل المعدنية بالأرض ويحمي من الصعق.', hud: { e: ['terre'], r: 'évacuer les fuites', s: ['protège les personnes'] }, run: function (e) { e.m.set({}); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Teste les deux bornes de la prise. Repère la phase.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Installation domestique' }, st);
          var m = maison(svg), vu = {}, set = MV.hud(c, [['b', 'borne testée'], ['t', 'testeur', 1], ['f', 'fil']]), row = MV.H('div', 'row', '', c);
          [['Tester la borne rouge', 'phase'], ['Tester la borne bleue', 'neutre']].forEach(function (x) { var b = MV.H('button', 'btn', x[0], row); b.onclick = function () { var on = m.set({ test: x[1] }); set('b', x[1]); set('t', on ? 'allumé' : 'éteint'); set('f', on ? 'phase : danger' : 'neutre'); vu[x[1]] = 1; if (vu.phase && vu.neutre) done(); }; });
          m.set({}); set('b', '–'); set('t', '–'); set('f', '–');
        } },
      { title: 'Résolvons ensemble', intro: 'On installe une nouvelle lampe dans une chambre.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. On la branche :', o: ['en dérivation', 'en série avec les autres'], a: 0 },
            { type: 'opt', q: 'Étape 2. L\'interrupteur est placé sur :', o: ['la phase', 'le neutre'], a: 0, e: 'Interrupteur ouvert : la lampe n\'est plus reliée à la phase.' },
            { type: 'opt', q: 'Étape 3. Avant de travailler, on :', o: ['coupe le disjoncteur', 'garde le courant'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le fil dangereux d\'une installation est :', o: ['la phase', 'le neutre'], a: 0 },
      { lvl: 'Niveau 2', q: 'Le fil de terre a pour couleur :', o: ['vert et jaune', 'rouge'], a: 0 },
      { lvl: 'Niveau 3', q: 'Dans une maison, les appareils sont branchés :', o: ['en dérivation', 'en série'], a: 0 },
      { lvl: 'Niveau 4', q: 'Une maison consomme 150 kWh en un mois, à 1 DH le kWh. Montant (DH) ?', a: 150 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Les deux trous de la prise',
      hud: [['p', 'trou allumé'], ['n', 'trou éteint'], ['r', 'raison']],
      draw: function (svg) { var e = {}; e.m = maison(svg); return e; },
      steps: [
        { cap: 'Le trou où le testeur s\'allume est relié à la **phase**.', hud: { p: ['phase'], n: '–', r: '–' }, run: function (e) { e.m.set({ test: 'phase' }); } },
        { cap: 'L\'autre est relié au **neutre**. Seule la phase présente une tension dangereuse par rapport à la terre.', ar: 'أحد الثقبين مرتبط بالطور والآخر بالمحايد، والطور وحده خطير بالنسبة للأرض.', hud: { p: 'phase', n: ['neutre'], r: ['seule la phase est dangereuse'] }, run: function (e) { e.m.set({ test: 'neutre' }); } }
      ]
    },

    retenir: [
      'L\'installation domestique comprend : <b>compteur</b>, <b>disjoncteur</b>, et trois fils : <b>phase</b> (dangereuse), <b>neutre</b> et <b>terre</b> (vert et jaune). Les appareils sont branchés <b>en dérivation</b>.',
      'L\'<b>interrupteur</b> se place sur la phase ; le <b>tournevis testeur</b> repère la phase ; la <b>prise de terre</b> protège des électrocutions. Toujours couper le courant avant d\'intervenir.'
    ],
    retenirAr: 'يتكون التركيب المنزلي من العداد والفاصل وثلاثة أسلاك: الطور (خطير)، والمحايد، والأرضي (أخضر وأصفر). الأجهزة مركبة على التوازي، وقاطع التيار يوضع على الطور.',
    voc: [['la phase', 'الطور'], ['le neutre', 'المحايد'], ['la terre', 'الأرضي'], ['le compteur', 'العداد'], ['un tournevis testeur', 'مفك كاشف']]
  });
})();
