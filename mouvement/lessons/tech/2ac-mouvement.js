/* @meta {"id":"2ac-mouvement","level":"2","order":9,"theme":"Fonctions électroniques","title":"Transmission de mouvement","ar":"نقل الحركة","lead":"Le moteur d’une machine à coudre tourne très vite, l’aiguille doit aller moins vite. Une courroie et deux poulies de tailles différentes règlent la vitesse."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, D1 = 40, N1 = 1000;

  function roue(g, cx, cy, z, col, dur, sens) {
    var r = z * 1.6, d = '', n = z * 2;
    for (var i = 0; i <= n; i++) { var a = i / n * 2 * Math.PI, rr = i % 2 ? r - 3 : r + 3; d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1); }
    var w = S('g', {}, g);
    S('path', { d: d + 'Z', fill: '#1d1f22', stroke: col, 'stroke-width': 2 }, w);
    S('line', { x1: cx, y1: cy, x2: cx + r - 6, y2: cy, stroke: col, 'stroke-width': 3 }, w);
    S('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 ' + cx + ' ' + cy, to: (sens * 360) + ' ' + cx + ' ' + cy, dur: dur.toFixed(2) + 's', repeatCount: 'indefinite' }, w);
    T(g, cx, cy + r + 22, sens > 0 ? '↻' : '↺', 'lbl');
  }
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function poulies(d2, cross) {
      var a = D1 / 2, b = d2 / 2, xa = 90, xb = 250, y = 96;
      if (cross) S('path', { d: 'M' + xa + ' ' + (y - a) + 'L' + xb + ' ' + (y + b) + 'M' + xa + ' ' + (y + a) + 'L' + xb + ' ' + (y - b), stroke: '#9aa0a8', 'stroke-width': 4 }, dyn);
      else S('path', { d: 'M' + xa + ' ' + (y - a) + 'L' + xb + ' ' + (y - b) + 'M' + xa + ' ' + (y + a) + 'L' + xb + ' ' + (y + b), stroke: '#9aa0a8', 'stroke-width': 4 }, dyn);
      [[xa, a, 'var(--acc)', 1.2, 1], [xb, b, '#7fb2ff', 1.2 * b / a, cross ? -1 : 1]].forEach(function (p) {
        var w = S('g', {}, dyn);
        S('circle', { cx: p[0], cy: y, r: p[1], fill: '#1d1f22', stroke: p[2], 'stroke-width': 3 }, w);
        S('line', { x1: p[0], y1: y, x2: p[0] + p[1] - 4, y2: y, stroke: p[2], 'stroke-width': 3 }, w);
        S('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 ' + p[0] + ' ' + y, to: (p[4] * 360) + ' ' + p[0] + ' ' + y, dur: p[3].toFixed(2) + 's', repeatCount: 'indefinite' }, w);
        T(dyn, p[0], y + Math.max(p[1], 20) + 22, p[4] > 0 ? '↻' : '↺', 'lbl');
      });
      T(dyn, xa, 196, 'moteur D1 = 40 mm', 'tag');
      T(dyn, 352, 196, 'D2 = ' + d2 + ' mm', 'tag', 'end');
      if (cross) T(dyn, 170, 22, 'courroie croisée', 'tag');
    }
    function engrenages(n) {
      var zs = [12, 20, 12], x = 60;
      for (var i = 0; i < n; i++) {
        var z = zs[i], r = z * 1.6;
        if (i) x += zs[i - 1] * 1.6 + r + 1;
        roue(dyn, x, 92, z, i ? '#7fb2ff' : 'var(--acc)', 1.2 * z / 12, i % 2 ? -1 : 1);
      }
      T(dyn, 180, 196, n === 3 ? 'roues 1 et 3 : même sens' : 'deux roues : sens inverse', 'tag');
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.gears) engrenages(o.gears); else poulies(o.d2 || 40, o.cross);
    };
    return g;
  }
  function n2(d2) { return Math.round(N1 * D1 / d2); }

  MV.lesson({
    id: '2ac-mouvement',
    objectif: {
      fr: 'Transmettre un mouvement de rotation par poulies et courroie ou par engrenages, calculer la vitesse de sortie et prévoir le sens de rotation.',
      ar: 'نقل حركة دوران بالبكرات والسير أو بالمسننات، وحساب سرعة الخروج وتوقع اتجاه الدوران.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'La machine à coudre',
      hud: [['m', 'moteur'], ['s', 'sortie']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le moteur tourne vite : **1000 tr/min**.', hud: { m: ['1000 tr/min'], s: '?' }, run: function (e) { e.s.set({ d2: 40 }); } },
        { cap: 'Une **courroie** l’entraîne vers une poulie **plus grande**.', hud: { m: '1000 tr/min', s: ['plus lent'] }, run: function (e) { e.s.set({ d2: 120 }); } },
        { cap: 'De combien la vitesse a-t-elle baissé ? Et dans quel **sens** tourne la sortie ?', hud: { m: '1000 tr/min', s: ['?'] }, run: function (e) { e.s.set({ d2: 120 }); } }
      ]
    },

    prepare: [
      ['Sur un vélo, la chaîne relie le pédalier à la roue arrière.', true, 'C’est une transmission par chaîne.'],
      ['Une grande poulie entraînée tourne plus vite qu’une petite poulie motrice.', false, 'Elle tourne moins vite.'],
      ['Deux roues dentées en contact tournent en sens inverse.', true, 'Leurs dents se poussent l’une l’autre.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Poulies et engrenages',
      hud: [['n', 'notion'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Poulies et courroie** : les deux poulies tournent dans le **même sens**.', ar: 'البكرات والسير: تدور البكرتان في نفس الاتجاه.', hud: { n: ['poulies'], v: 'même sens' }, run: function (e) { e.s.set({ d2: 80 }); } },
        { cap: 'Poulie menée **deux fois plus grande** : vitesse **divisée par 2**. N2 = N1 × D1 ÷ D2.', ar: 'البكرة المقودة أكبر مرتين: تقسم السرعة على 2. [[N2 = N1 × D1 ÷ D2]].', hud: { n: ['N2 = N1 × D1 ÷ D2'], v: ['500 tr/min'] }, run: function (e) { e.s.set({ d2: 80 }); } },
        { cap: 'Courroie **croisée** : la poulie menée tourne en **sens inverse**.', ar: 'السير المتقاطع: البكرة المقودة تدور في الاتجاه المعاكس.', hud: { n: 'courroie croisée', v: ['sens inverse'] }, run: function (e) { e.s.set({ d2: 80, cross: 1 }); } },
        { cap: '**Engrenage** : deux roues dentées tournent en **sens inverse**.', ar: 'المسننات: عجلتان مسننتان تدوران في اتجاهين متعاكسين.', hud: { n: ['engrenage'], v: 'sens inverse' }, run: function (e) { e.s.set({ gears: 2 }); } },
        { cap: 'Avec une troisième roue, la 1re et la 3e tournent dans le **même sens**.', ar: 'بعجلة ثالثة تدور الأولى والثالثة في نفس الاتجاه.', hud: { n: '3 roues', v: ['1 et 3 : même sens'] }, run: function (e) { e.s.set({ gears: 3 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis le diamètre de la poulie menée. Fais tourner la sortie à 500 tr/min.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Poulies et courroie' }, st);
          var s = scene(svg), set = MV.hud(c, [['d', 'D2'], ['n', 'N2', 1]]);
          MV.slider(c, { label: 'D2', min: 20, max: 140, step: 20, value: 20, fmt: function (v) { return v + ' mm'; } }, function (d) { s.set({ d2: d }); set('d', d + ' mm'); set('n', n2(d) + ' tr/min'); if (d === 80) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Poulie motrice : 40 mm, 1000 tr/min.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Un engrenage et des roues en ligne.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Z1 = 20 dents à 600 tr/min, Z2 = 40 dents. N2 (tr/min) ?', a: 300, hint: '600 × 20 ÷ 40' },
            { type: 'opt', q: 'Étape 2. Trois roues dentées en ligne : la 1re et la 3e tournent :', o: ['dans le même sens', 'en sens inverse'], a: 0 },
            { type: 'opt', q: 'Étape 3. Une courroie croisée fait tourner les poulies :', o: ['en sens inverse', 'dans le même sens'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Une grande poulie menée tourne :', o: ['moins vite que la motrice', 'plus vite que la motrice'], a: 0 },
      { lvl: 'Niveau 2', q: 'D1 = 30 mm, D2 = 90 mm, N1 = 900 tr/min. N2 (tr/min) ?', a: 300 },
      { lvl: 'Niveau 3', q: 'Sur un vélo, le pédalier et la roue arrière tournent :', o: ['dans le même sens', 'en sens inverse'], a: 0 },
      { lvl: 'Niveau 4', q: 'Z1 = 12 dents à 1200 tr/min. On veut 300 tr/min. Z2 ?', a: 48, hint: 'Z2 = N1 × Z1 ÷ N2' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Vitesse et sens',
      hud: [['m', 'moteur'], ['s', 'sortie']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Poulie de 120 mm : 1000 × 40 ÷ 120 ≈ **333 tr/min**, dans le **même sens**.', hud: { m: '1000 tr/min', s: ['333 tr/min'] }, run: function (e) { e.s.set({ d2: 120 }); } },
        { cap: 'Grande roue menée = **plus lent** ; engrenage = **sens inverse**.', ar: 'العجلة المقودة الكبيرة أبطأ، والمسننات تعكس الاتجاه.', hud: { m: '–', s: ['plus lent, sens'] }, run: function (e) { e.s.set({ gears: 2 }); } }
      ]
    },

    retenir: [
      '<b>Poulies et courroie</b> : même sens (sens inverse si la courroie est croisée), <b class="mono">N2 = N1 × D1 ÷ D2</b>. <b>Engrenage</b> : sens inverse, <b class="mono">N2 = N1 × Z1 ÷ Z2</b>.',
      'Une roue menée plus grande tourne <b>moins vite</b> mais avec plus de force.'
    ],
    retenirAr: 'البكرات والسير: نفس الاتجاه و[[N2 = N1 × D1 ÷ D2]]. المسننات: اتجاه معاكس و[[N2 = N1 × Z1 ÷ Z2]]. العجلة المقودة الكبيرة أبطأ وأقوى.',
    voc: [['une poulie', 'بكرة'], ['une courroie', 'سير'], ['un engrenage', 'مسننة'], ['le sens de rotation', 'اتجاه الدوران'], ['la vitesse de rotation', 'سرعة الدوران']]
  });
})();
