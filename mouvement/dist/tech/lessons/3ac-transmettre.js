/* @meta {"id":"3ac-transmettre","level":"3","order":8,"theme":"Chaîne d’énergie","title":"Transmettre","ar":"النقل","lead":"Le moteur d’un portail tourne à 1200 tours par minute, mais le portail doit bouger lentement et avec force. Entre les deux, des roues dentées, une courroie ou une vis font le travail."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, Z1 = 12, N1 = 1200;

  function roue(g, cx, cy, z, col, dur, sens) {
    var r = z * 1.6, d = '', n = z * 2;
    for (var i = 0; i <= n; i++) {
      var a = i / n * 2 * Math.PI, rr = i % 2 ? r - 3 : r + 3;
      d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1);
    }
    var w = S('g', {}, g);
    S('path', { d: d + 'Z', fill: '#1d1f22', stroke: col, 'stroke-width': 2 }, w);
    S('line', { x1: cx, y1: cy, x2: cx + r - 6, y2: cy, stroke: col, 'stroke-width': 3 }, w);
    S('circle', { cx: cx, cy: cy, r: 4, fill: col }, w);
    S('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 ' + cx + ' ' + cy, to: (sens * 360) + ' ' + cx + ' ' + cy, dur: dur.toFixed(2) + 's', repeatCount: 'indefinite' }, w);
    return r;
  }
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (o) { // o.z2 : engrenages ; o.d2 : poulies ; o.vis : tours
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.z2) {
        var r1 = Z1 * 1.6, r2 = o.z2 * 1.6, x2 = 70 + r1 + r2 + 1;
        roue(dyn, 70, 100, Z1, 'var(--acc)', 1.2, 1);
        roue(dyn, x2, 100, o.z2, '#7fb2ff', 1.2 * o.z2 / Z1, -1);
        T(dyn, 70, 172, 'menante Z1 = ' + Z1, 'tag');
        T(dyn, Math.min(x2, 300), 196, 'menée Z2 = ' + o.z2, 'tag');
        T(dyn, 70, 30, 'moteur', 'tag');
      } else if (o.d2) {
        var a = 30, b = o.d2 / 2, xa = 80, xb = 250;
        S('path', { d: 'M' + xa + ' ' + (100 - a) + 'L' + xb + ' ' + (100 - b) + 'M' + xa + ' ' + (100 + a) + 'L' + xb + ' ' + (100 + b), stroke: '#9aa0a8', 'stroke-width': 4 }, dyn);
        [[xa, a, 'var(--acc)', 1.2], [xb, b, '#7fb2ff', 1.2 * b / a]].forEach(function (p) {
          var w = S('g', {}, dyn);
          S('circle', { cx: p[0], cy: 100, r: p[1], fill: '#1d1f22', stroke: p[2], 'stroke-width': 3 }, w);
          S('line', { x1: p[0], y1: 100, x2: p[0] + p[1] - 4, y2: 100, stroke: p[2], 'stroke-width': 3 }, w);
          S('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 ' + p[0] + ' 100', to: '360 ' + p[0] + ' 100', dur: p[3].toFixed(2) + 's', repeatCount: 'indefinite' }, w);
        });
        T(dyn, xa, 182, 'poulie motrice D1 = 60', 'tag');
        T(dyn, xb, 196, 'poulie réceptrice D2 = ' + o.d2, 'tag');
        T(dyn, 165, 40, 'courroie : même sens', 'tag');
      } else if (o.vis) {
        S('rect', { x: 30, y: 92, width: 300, height: 16, fill: '#26292d', stroke: '#9aa0a8', 'stroke-width': 2 }, dyn);
        for (var x = 34; x < 326; x += 10) S('line', { x1: x, y1: 92, x2: x + 6, y2: 108, stroke: '#9aa0a8', 'stroke-width': 1.5 }, dyn);
        var nut = S('g', {}, dyn);
        S('rect', { x: 40, y: 78, width: 30, height: 44, rx: 4, fill: 'var(--acc-bg)', stroke: 'var(--acc)', 'stroke-width': 2.5 }, nut);
        T(nut, 55, 72, 'écrou', 'tag');
        S('animateTransform', { attributeName: 'transform', type: 'translate', values: '0 0;' + (o.vis * 4) + ' 0;0 0', dur: '4s', repeatCount: 'indefinite' }, nut);
        T(dyn, 180, 150, 'pas = 4 mm : un tour avance l’écrou de 4 mm', 'tag');
        T(dyn, 180, 172, o.vis + ' tours → ' + o.vis * 4 + ' mm', 'lbl');
        T(dyn, 18, 104, '↻', 'lbl');
      }
    };
    return g;
  }
  function n2(z2) { return Math.round(N1 * Z1 / z2); }

  MV.lesson({
    id: '3ac-transmettre',
    objectif: {
      fr: 'Savoir que la fonction transmettre adapte le mouvement entre l’actionneur et l’effecteur, calculer une vitesse avec des engrenages ou des poulies, et le déplacement d’un système vis-écrou.',
      ar: 'معرفة أن وظيفة النقل تكيف الحركة بين المنفذ والمؤثر، وحساب سرعة الدوران بالمسننات أو البكرات، وانتقال نظام لولب وصامولة.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Le moteur du portail',
      hud: [['m', 'moteur'], ['p', 'portail'], ['q', 'entre les deux']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le moteur tourne **vite** : 1200 tours par minute.', hud: { m: ['1200 tr/min'], p: '?', q: '–' }, run: function (e) { e.s.set({ z2: 12 }); } },
        { cap: 'Le portail doit avancer **lentement** et avec **force**.', hud: { m: '1200 tr/min', p: ['lent et fort'], q: '?' }, run: function (e) { e.s.set({ z2: 36 }); } },
        { cap: 'Une petite roue dentée en entraîne une **grande**. Que devient la vitesse ?', hud: { m: '1200 tr/min', p: 'lent', q: ['engrenage'] }, run: function (e) { e.s.set({ z2: 36 }); } }
      ]
    },

    prepare: [
      ['Sur un vélo, le pédalier entraîne la roue arrière par une chaîne.', true, 'C’est une transmission par chaîne.'],
      ['Deux roues dentées en contact tournent dans le même sens.', false, 'Elles tournent en sens inverse.'],
      ['Tourner une vis dans un écrou fait avancer l’écrou.', true, 'La rotation devient une translation.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Engrenages, poulies, vis-écrou',
      hud: [['f', 'fonction'], ['r', 'règle'], ['v', 'vitesse']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Transmettre**, c’est conduire le mouvement de l’actionneur vers l’effecteur, en l’**adaptant**.', ar: 'النقل هو إيصال الحركة من المنفذ إلى المؤثر مع تكييفها.', hud: { f: ['transmettre'], r: 'adapter', v: '–' }, run: function (e) { e.s.set({ z2: 24 }); } },
        { cap: '**Engrenage** : la roue menée tourne en **sens inverse**.', ar: 'المسننات: العجلة المقودة تدور في الاتجاه المعاكس.', hud: { f: 'engrenage', r: ['sens inverse'], v: '–' }, run: function (e) { e.s.set({ z2: 24 }); } },
        { cap: 'Grande roue menée : **plus lente**. N2 = N1 × Z1 ÷ Z2 = 1200 × 12 ÷ 24 = **600 tr/min**.', ar: 'العجلة المقودة الكبيرة أبطأ: [[N2 = N1 × Z1 ÷ Z2 = 600 tr/min]].', hud: { f: 'engrenage', r: ['N2 = N1 × Z1 ÷ Z2'], v: ['600 tr/min'] }, run: function (e) { e.s.set({ z2: 24 }); } },
        { cap: '**Poulies et courroie** : même sens. N2 = N1 × D1 ÷ D2.', ar: 'البكرات والسير: نفس الاتجاه، [[N2 = N1 × D1 ÷ D2]].', hud: { f: 'poulies', r: ['N2 = N1 × D1 ÷ D2'], v: '600 tr/min' }, run: function (e) { e.s.set({ d2: 120 }); } },
        { cap: '**Vis-écrou** : la rotation devient une **translation**. Un tour = un **pas**.', ar: 'اللولب والصامولة: يتحول الدوران إلى انسحاب، والدورة الواحدة تساوي خطوة.', hud: { f: 'vis-écrou', r: ['déplacement = pas × tours'], v: '10 tours → 40 mm' }, run: function (e) { e.s.set({ vis: 10 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis le nombre de dents de la roue menée. Fais tourner le portail à 400 tr/min.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Engrenage' }, st);
          var s = scene(svg), set = MV.hud(c, [['z', 'Z2'], ['n', 'N2', 1]]);
          MV.slider(c, { label: 'Z2', min: 12, max: 48, step: 6, value: 12 }, function (z) { s.set({ z2: z }); set('z', z + ' dents'); set('n', n2(z) + ' tr/min'); if (z === 36) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Roue menante : 12 dents, 1200 tr/min.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Une perceuse à colonne : poulie moteur D1 = 50 mm à 1500 tr/min.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Poulie réceptrice D2 = 150 mm. Vitesse du foret (tr/min) ?', a: 500, hint: '1500 × 50 ÷ 150' },
            { type: 'opt', q: 'Étape 2. Les deux poulies tournent :', o: ['dans le même sens', 'en sens inverse'], a: 0 },
            { q: 'Étape 3. Le plateau monte par une vis de pas 2 mm. Pour 15 tours, il monte de (mm) ?', a: 30 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Deux roues dentées en contact tournent :', o: ['en sens inverse', 'dans le même sens'], a: 0 },
      { lvl: 'Niveau 2', q: 'Z1 = 10, Z2 = 40, N1 = 800 tr/min. N2 (tr/min) ?', a: 200 },
      { lvl: 'Niveau 3', q: 'Le système vis-écrou transforme :', o: ['une rotation en translation', 'une translation en lumière'], a: 0 },
      { lvl: 'Niveau 4', q: 'N1 = 1000 tr/min, D1 = 40 mm. On veut N2 = 250 tr/min. D2 (mm) ?', a: 160, hint: 'D2 = N1 × D1 ÷ N2' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Lent et fort',
      hud: [['m', 'moteur'], ['p', 'portail'], ['q', 'entre les deux']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Roue de 12 dents vers roue de 36 dents : la vitesse est **divisée par 3**.', hud: { m: '1200 tr/min', p: ['400 tr/min'], q: 'Z1 = 12, Z2 = 36' }, run: function (e) { e.s.set({ z2: 36 }); } },
        { cap: 'Le mouvement est **adapté** : plus lent, avec plus de force. C’est la fonction **transmettre**.', ar: 'تم تكييف الحركة: أبطأ وبقوة أكبر. هذه وظيفة النقل.', hud: { m: '1200 tr/min', p: '400 tr/min', q: ['transmettre'] }, run: function (e) { e.s.set({ z2: 36 }); } }
      ]
    },

    retenir: [
      '<b>Transmettre</b> = conduire le mouvement vers l’effecteur en l’adaptant. Engrenage : sens inverse, <b class="mono">N2 = N1 × Z1 ÷ Z2</b>. Poulies et courroie : même sens, <b class="mono">N2 = N1 × D1 ÷ D2</b>.',
      'Vis-écrou : rotation → translation, <b class="mono">déplacement = pas × nombre de tours</b>.'
    ],
    retenirAr: 'النقل هو إيصال الحركة إلى المؤثر مع تكييفها. المسننات: اتجاه معاكس و[[N2 = N1 × Z1 ÷ Z2]]. البكرات: نفس الاتجاه و[[N2 = N1 × D1 ÷ D2]]. اللولب والصامولة: الانتقال = الخطوة × عدد الدورات.',
    voc: [['transmettre', 'نقل'], ['un engrenage', 'مسننة'], ['une poulie', 'بكرة'], ['une courroie', 'سير'], ['le pas', 'الخطوة']]
  });
})();
