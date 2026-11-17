/* @meta {"id":"3ac-dessin","level":"3","order":10,"theme":"Dessin technique","title":"Dessin technique : vues, traits, échelle","ar":"الرسم التقني: المساقط، الخطوط، السلم","lead":"Un menuisier doit fabriquer une cale en forme de L à partir d’un plan. Une seule image en perspective ne suffit pas : il lui faut des vues, des traits et des dimensions sans ambiguïté."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, K = 1.2;
  // cale en L : longueur 60, hauteur 40, profondeur 30 ; partie haute de 25 mm de long
  var VUES = {
    face: { x: 176, y: 22, w: 60, h: 40, nom: 'face' },
    dessus: { x: 176, y: 100, w: 60, h: 30, nom: 'dessus' },
    gauche: { x: 270, y: 22, w: 30, h: 40, nom: 'gauche' }
  };

  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function fort(d, col) { S('path', { d: d, stroke: col || '#e9e9ea', 'stroke-width': 2.5, fill: 'none', 'stroke-linejoin': 'round' }, dyn); }
    function cache(d) { S('path', { d: d, stroke: '#9aa0a8', 'stroke-width': 1.2, 'stroke-dasharray': '5 3', fill: 'none' }, dyn); }
    function P(v, x, y) { return (v.x + x * K).toFixed(1) + ' ' + (v.y + y * K).toFixed(1); }
    function vue(n, hot) {
      var v = VUES[n], col = hot ? 'var(--acc)' : '#e9e9ea';
      if (n === 'face') fort('M' + P(v, 0, 0) + 'L' + P(v, 25, 0) + 'L' + P(v, 25, 20) + 'L' + P(v, 60, 20) + 'L' + P(v, 60, 40) + 'L' + P(v, 0, 40) + 'Z', col);
      if (n === 'dessus') { fort('M' + P(v, 0, 0) + 'H' + (v.x + 60 * K) + 'V' + (v.y + 30 * K) + 'H' + v.x + 'Z', col); fort('M' + P(v, 25, 0) + 'V' + (v.y + 30 * K), col); }
      if (n === 'gauche') { fort('M' + P(v, 0, 0) + 'H' + (v.x + 30 * K) + 'V' + (v.y + 40 * K) + 'H' + v.x + 'Z', col); cache('M' + P(v, 0, 20) + 'H' + (v.x + 30 * K)); }
      T(dyn, v.x + v.w * K / 2, v.y + v.h * K + 14, v.nom, 'tag');
    }
    function perspective(hot) {
      var ox = 24, oy = 150, dx = 18, dy = -18;
      function p(x, y, z) { return (ox + x * 1.5 + z * dx / 30).toFixed(1) + ' ' + (oy - y * 1.5 + z * dy / 30).toFixed(1); }
      var front = [[0, 0], [60, 0], [60, 20], [25, 20], [25, 40], [0, 40]];
      S('path', { d: 'M' + front.map(function (q) { return p(q[0], q[1], 0); }).join('L') + 'Z', fill: hot ? 'var(--acc-bg)' : '#1d1f22', stroke: hot ? 'var(--acc)' : '#e9e9ea', 'stroke-width': 2.5 }, dyn);
      fort('M' + p(0, 40, 0) + 'L' + p(0, 40, 30) + 'L' + p(25, 40, 30) + 'L' + p(25, 40, 0));
      fort('M' + p(25, 40, 30) + 'L' + p(25, 20, 30) + 'L' + p(60, 20, 30) + 'L' + p(60, 20, 0));
      fort('M' + p(60, 20, 30) + 'L' + p(60, 0, 30) + 'L' + p(60, 0, 0));
      T(dyn, 80, 186, 'perspective', 'tag');
    }
    function echelle() {
      fort('M30 70H246V130H30Z'); T(dyn, 138, 104, 'pièce réelle : 80 mm × 30 mm', 'tag');
      S('rect', { x: 30, y: 150, width: 108, height: 30, fill: 'var(--acc-bg)', stroke: 'var(--acc)', 'stroke-width': 2.5 }, dyn);
      T(dyn, 84, 170, 'dessin 1:2', 'tag');
      S('path', { d: 'M30 196H138M30 190V200M138 190V200', stroke: '#9aa0a8', 'stroke-width': 1.2 }, dyn);
      T(dyn, 152, 170, 'on écrit la cote réelle : 80', 'tag', 'start').style.fontSize = '10px';
      T(dyn, 180, 52, 'échelle 1:2 : dessin 2 fois plus petit', 'tag');
    }
    g.set = function (o) { // o.vues : liste, o.hot, o.persp, o.echelle
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.echelle) { echelle(); return; }
      if (o.persp) perspective(o.hot === 'face');
      (o.vues || []).forEach(function (n) { vue(n, o.hot === n); });
    };
    return g;
  }

  MV.lesson({
    id: '3ac-dessin',
    objectif: {
      fr: 'Placer les vues de face, de dessus et de gauche, utiliser les traits normalisés (continu fort, interrompu fin) et appliquer une échelle.',
      ar: 'وضع المسقط الأمامي والعلوي والجانبي الأيسر، واستعمال الخطوط المعيارية (متصل غليظ، متقطع رقيق) وتطبيق السلم.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'La cale en L',
      hud: [['p', 'perspective'], ['v', 'vues'], ['q', 'suffisant ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Voici la **cale en L** dessinée en perspective.', hud: { p: ['oui'], v: '0', q: '?' }, run: function (e) { e.s.set({ persp: 1 }); } },
        { cap: 'Mais la perspective **déforme** les angles et les longueurs.', hud: { p: 'oui', v: '0', q: ['non'] }, run: function (e) { e.s.set({ persp: 1, hot: 'face' }); } },
        { cap: 'Le fabricant a besoin de **vues** exactes. Lesquelles, et où les placer ?', hud: { p: 'oui', v: ['3'], q: '?' }, run: function (e) { e.s.set({ persp: 1, vues: ['face', 'dessus', 'gauche'] }); } }
      ]
    },

    prepare: [
      ['Une photo d’un objet montre toutes ses faces en même temps.', false, 'On ne voit jamais les faces cachées.'],
      ['Une carte routière est un dessin à échelle réduite.', true, 'Les distances y sont plus petites que dans la réalité.'],
      ['Sur un plan, les dimensions écrites sont les dimensions réelles.', true, 'Quelle que soit l’échelle.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Vues, traits et échelle',
      hud: [['v', 'vue'], ['r', 'règle'], ['t', 'trait']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'La **vue de face** : on regarde la pièce de face, sans perspective.', ar: 'المسقط الأمامي: ننظر إلى القطعة من الأمام بدون منظور.', hud: { v: ['face'], r: 'vue principale', t: 'continu fort' }, run: function (e) { e.s.set({ persp: 1, vues: ['face'], hot: 'face' }); } },
        { cap: 'La **vue de dessus** se place **sous** la vue de face.', ar: 'المسقط العلوي يوضع تحت المسقط الأمامي.', hud: { v: ['dessus'], r: ['sous la face'], t: 'continu fort' }, run: function (e) { e.s.set({ persp: 1, vues: ['face', 'dessus'], hot: 'dessus' }); } },
        { cap: 'La **vue de gauche** se place **à droite** de la vue de face.', ar: 'المسقط الجانبي الأيسر يوضع على يمين المسقط الأمامي.', hud: { v: ['gauche'], r: ['à droite de la face'], t: 'continu fort' }, run: function (e) { e.s.set({ persp: 1, vues: ['face', 'dessus', 'gauche'], hot: 'gauche' }); } },
        { cap: 'Arête visible : trait **continu fort**. Arête cachée : trait **interrompu fin**.', ar: 'الحافة المرئية: خط متصل غليظ. الحافة المخفية: خط متقطع رقيق.', hud: { v: 'gauche', r: 'traits normalisés', t: ['interrompu fin'] }, run: function (e) { e.s.set({ vues: ['face', 'dessus', 'gauche'], hot: 'gauche' }); } },
        { cap: '**Échelle 1:2** : le dessin est deux fois plus petit, mais la **cote** reste la dimension **réelle**.', ar: 'السلم 1:2: الرسم أصغر مرتين، لكن البعد المكتوب هو البعد الحقيقي.', hud: { v: '–', r: ['dessin = réel ÷ 2'], t: '–' }, run: function (e) { e.s.set({ echelle: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Fais apparaître les trois vues de la cale et observe leur place.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Vues de la cale' }, st);
          var s = scene(svg), set = MV.hud(c, [['n', 'vues'], ['p', 'place', 1]]), vues = [];
          var row = MV.H('div', 'row', '', c);
          var PLACE = { face: 'en haut à gauche', dessus: 'sous la face', gauche: 'à droite de la face' };
          [['Vue de face', 'face'], ['Vue de dessus', 'dessus'], ['Vue de gauche', 'gauche']].forEach(function (b) {
            MV.H('button', 'btn', b[0], row).onclick = function () {
              if (vues.indexOf(b[1]) < 0) vues.push(b[1]);
              s.set({ persp: 1, vues: vues, hot: b[1] }); set('n', vues.length + ' / 3'); set('p', PLACE[b[1]]);
              if (vues.length === 3) done();
            };
          });
          s.set({ persp: 1 }); set('n', '0 / 3'); set('p', '–');
        } },
      { title: 'Résolvons ensemble', intro: 'On dessine une pièce sur une feuille A4.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Échelle 1:2. Une longueur réelle de 80 mm est dessinée (mm) ?', a: 40 },
            { q: 'Étape 2. Échelle 2:1. Une pièce de 15 mm est dessinée (mm) ?', a: 30, hint: 'Le dessin est 2 fois plus grand.' },
            { type: 'opt', q: 'Étape 3. Une arête cachée se dessine en trait :', o: ['interrompu fin', 'continu fort'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'La vue de dessus se place :', o: ['sous la vue de face', 'à gauche de la vue de face'], a: 0 },
      { lvl: 'Niveau 2', q: 'Un contour visible se dessine en trait :', o: ['continu fort', 'mixte fin'], a: 0 },
      { lvl: 'Niveau 3', q: 'Échelle 1:5. Longueur réelle 250 mm. Longueur dessinée (mm) ?', a: 50 },
      { lvl: 'Niveau 4', q: 'Échelle 1:2. Un trait mesure 35 mm sur le papier. Quelle valeur écrit-on sur la cote (mm) ?', a: 70, hint: 'La cote donne la dimension réelle.' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le plan de la cale',
      hud: [['p', 'perspective'], ['v', 'vues'], ['q', 'suffisant ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Trois vues bien placées : **face**, **dessus** dessous, **gauche** à droite.', hud: { p: 'aide', v: ['3'], q: 'presque' }, run: function (e) { e.s.set({ persp: 1, vues: ['face', 'dessus', 'gauche'] }); } },
        { cap: 'Avec les **traits normalisés** et les **cotes réelles**, le menuisier peut fabriquer la cale sans erreur.', ar: 'بالخطوط المعيارية والأبعاد الحقيقية يستطيع النجار صنع القطعة دون خطأ.', hud: { p: 'aide', v: '3', q: ['oui'] }, run: function (e) { e.s.set({ vues: ['face', 'dessus', 'gauche'], hot: 'gauche' }); } }
      ]
    },

    retenir: [
      'Disposition des vues : la <b>vue de dessus</b> sous la vue de face, la <b>vue de gauche</b> à droite de la vue de face. Arête visible : trait <b>continu fort</b> ; arête cachée : trait <b>interrompu fin</b> ; axe : trait <b>mixte fin</b>.',
      'Échelle : <b class="mono">dimension dessinée = dimension réelle × échelle</b> (1:2 réduit, 2:1 agrandit). Les cotes indiquent toujours la dimension <b>réelle</b> en mm.'
    ],
    retenirAr: 'المسقط العلوي تحت الأمامي، والجانبي الأيسر على يمين الأمامي. الحافة المرئية بخط متصل غليظ، والمخفية بخط متقطع رقيق. البعد المرسوم = البعد الحقيقي × السلم، والأبعاد المكتوبة حقيقية.',
    voc: [['une vue de face', 'مسقط أمامي'], ['une vue de dessus', 'مسقط علوي'], ['un trait interrompu', 'خط متقطع'], ['l’échelle', 'السلم'], ['une cote', 'بعد']]
  });
})();
