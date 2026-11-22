/* @meta {"id":"3ac-equation-droite","level":"3","order":12,"theme":"Géométrie","title":"Équation d'une droite","ar":"معادلة مستقيم","lead":"Un seau contient 1 L et un robinet ajoute 2 L par minute. Les points (minutes ; litres) sont alignés : leur droite a pour équation y = 2x + 1."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 180, Y0 = 115, U = 14; // origine au centre ; 1 unité = 14 px

  function px(x, y) { return [X0 + x * U, Y0 - y * U]; }
  function repere(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    for (var i = -12; i <= 12; i++) S('line', { x1: X0 + i * U, y1: 10, x2: X0 + i * U, y2: 220, stroke: 'rgba(255,255,255,.06)' }, g);
    for (var j = -7; j <= 7; j++) S('line', { x1: 10, y1: Y0 + j * U, x2: 350, y2: Y0 + j * U, stroke: 'rgba(255,255,255,.06)' }, g);
    S('path', { d: 'M10 ' + Y0 + ' H350 M' + X0 + ' 10 V220', stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    T(g, X0 - 6, Y0 + 14, 'O', 'tag', 'end'); T(g, X0 + U, Y0 + 14, '1', 'tag'); T(g, X0 - 8, Y0 - U + 4, '1', 'tag', 'end');
    g.set = function (droites, pts, tri) { // droites : [[a, b, couleur]] ; pts : [[x, y]] ; tri : [a, b] triangle de pente
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      droites.forEach(function (d) { var p = px(-13, d[0] * -13 + d[1]), q = px(13, d[0] * 13 + d[1]); S('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: d[2], 'stroke-width': 3 }, dyn); });
      (pts || []).forEach(function (p) { var q = px(p[0], p[1]); S('circle', { cx: q[0], cy: q[1], r: 5, fill: '#e9e9ea' }, dyn); });
      if (tri) { var a = px(0, tri[1]), b = px(1, tri[1]), c = px(1, tri[0] + tri[1]); S('path', { d: 'M' + a + ' L' + b + ' L' + c, fill: 'none', stroke: '#f2c14e', 'stroke-width': 2.5, 'stroke-dasharray': '4 3' }, dyn); T(dyn, (a[0] + b[0]) / 2, a[1] + 14, '1', 'tag'); T(dyn, b[0] + 6, (b[1] + c[1]) / 2 + 4, 'a', 'tag', 'start'); S('circle', { cx: a[0], cy: a[1], r: 5, fill: '#f2c14e' }, dyn); T(dyn, a[0] - 8, a[1] - 6, 'b', 'tag', 'end'); }
    };
    return g;
  }
  var OR = 'var(--acc)', BL = '#7fb2ff';

  MV.lesson({
    id: '3ac-equation-droite',
    objectif: {
      fr: 'Reconnaître l\'équation réduite y = ax + b d\'une droite, interpréter la pente et l\'ordonnée à l\'origine, et déterminer l\'équation d\'une droite passant par deux points.',
      ar: 'التعرف على المعادلة المختصرة [[y = ax + b]] لمستقيم، وتأويل المعامل الموجه والأرتوب عند الأصل، وتحديد معادلة مستقيم مار من نقطتين.'
    },

    ouverture: {
      vb: '0 0 360 230', label: 'Un seau qui se remplit',
      hud: [['d', 'au départ'], ['k', 'par minute'], ['q', 'les points ?']],
      draw: function (svg) { var e = {}; e.r = repere(svg); return e; },
      steps: [
        { cap: 'Un seau contient **1 L** d\'eau au départ.', hud: { d: ['1 L'], k: '–', q: '–' }, run: function (e) { e.r.set([], [[0, 1]]); } },
        { cap: 'Le robinet ajoute **2 L par minute** : 3 L, puis 5 L, puis 7 L.', hud: { d: '1 L', k: ['2 L'], q: '–' }, run: function (e) { e.r.set([], [[0, 1], [1, 3], [2, 5], [3, 7]]); } },
        { cap: 'Les points (minutes ; litres) sont **alignés**. Quelle est l\'équation de leur droite ? On le saura à la fin.', hud: { d: '1 L', k: '2 L', q: ['?'] }, run: function (e) { e.r.set([], [[0, 1], [1, 3], [2, 5], [3, 7]]); } }
      ]
    },

    predire: {
      q: "Un seau contient 1 L au départ et le robinet ajoute 2 L par minute. Quelle est l'équation de la droite qui donne les litres y en fonction des minutes x ?",
      ar: "دلو فيه [[1 L]] في البداية والصنبور يضيف [[2 L]] كل دقيقة. ما معادلة المستقيم التي تعطي اللترات [[y]] بدلالة الدقائق [[x]]؟",
      o: ["y = x + 2", "y = 2x + 1", "y = 3x"],
      a: 1,
      e: "La pente est 2 (2 L de plus chaque minute) et l'ordonnée à l'origine est 1 (1 L au départ). L'équation est donc y = 2x + 1. Après 3 minutes : 2 × 3 + 1 = 7 L.",
      ear: "الميل [[2]] والترتيب عند الأصل [[1]]: [[y = 2x + 1]]."
    },

    prepare: [
      ['Le point (0 ; 3) est sur l\'axe des ordonnées.', true, 'Son abscisse est nulle.'],
      ['Pour y = 2x + 1, si x = 3 alors y = 7.', true, '2 × 3 + 1 = 7.'],
      ['Deux droites parallèles ont des pentes différentes.', false, 'Elles ont la même pente.']
    ],

    regarde: {
      vb: '0 0 360 230', label: 'Pente et ordonnée à l\'origine',
      hud: [['e', 'équation'], ['s', 'sens'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.r = repere(svg); return e; },
      steps: [
        { cap: 'Une droite non verticale a une **équation réduite** : **y = ax + b**.', ar: 'كل مستقيم غير مواز لمحور الأراتيب له معادلة مختصرة [[y = ax + b]].', hud: { e: ['y = ax + b'], s: '–', v: '–' }, run: function (e) { e.r.set([[2, 1, OR]]); } },
        { cap: '**b** est l\'**ordonnée à l\'origine** : la droite coupe l\'axe vertical en (0 ; b).', ar: 'b هو الأرتوب عند الأصل.', hud: { e: 'y = 2x + 1', s: ['ordonnée à l\'origine'], v: ['b = 1'] }, run: function (e) { e.r.set([[2, 1, OR]], null, [2, 1]); } },
        { cap: '**a** est la **pente** : quand x augmente de 1, y augmente de a.', ar: 'a هو المعامل الموجه: عندما يزداد x بواحد يزداد y بالعدد a.', hud: { e: 'y = 2x + 1', s: ['pente'], v: ['a = 2'] }, run: function (e) { e.r.set([[2, 1, OR]], null, [2, 1]); } },
        { cap: 'Pente négative : la droite **descend**. Exemple y = −x + 3.', ar: 'إذا كان المعامل الموجه سالبا فالمستقيم نازل.', hud: { e: ['y = −x + 3'], s: 'pente négative', v: 'a = −1' }, run: function (e) { e.r.set([[-1, 3, BL]], null, [-1, 3]); } },
        { cap: 'Deux droites sont **parallèles** si elles ont la **même pente** : y = 2x + 1 et y = 2x − 3.', ar: 'يكون مستقيمان متوازيين إذا كان لهما نفس المعامل الموجه.', hud: { e: ['y = 2x + 1 ; y = 2x − 3'], s: 'même pente', v: ['parallèles'] }, run: function (e) { e.r.set([[2, 1, OR], [2, -3, BL]]); } },
        { cap: 'Par A(1 ; 3) et B(3 ; 7) : **a = (7 − 3) ÷ (3 − 1) = 2**, puis 3 = 2 × 1 + b donne **b = 1**.', ar: 'المعامل الموجه [[a = (yB − yA) ÷ (xB − xA)]].', hud: { e: ['y = 2x + 1'], s: 'a = (yB − yA)/(xB − xA)', v: 'a = 2, b = 1' }, run: function (e) { e.r.set([[2, 1, OR]], [[1, 3], [3, 7]]); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Règle a et b. Fais passer la droite par A(2 ; 5) et B(−2 ; −3).',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 230', role: 'img', 'aria-label': 'Droite dans un repère' }, st);
          var r = repere(svg), a = 1, b = 0, set = MV.hud(c, [['e', 'équation'], ['o', 'passe par A et B ?', 1]]);
          function upd() { r.set([[a, b, OR]], [[2, 5], [-2, -3]], [a, b]); set('e', 'y = ' + (a === 1 ? '' : a === -1 ? '−' : String(a).replace('-', '−')) + 'x ' + (b < 0 ? '− ' + (-b) : '+ ' + b)); var ok = 2 * a + b === 5 && -2 * a + b === -3; set('o', ok ? 'oui' : 'non'); if (ok) done(); }
          MV.slider(c, { label: 'pente a', min: -3, max: 3, value: 1 }, function (v) { a = v; upd(); });
          MV.slider(c, { label: 'ordonnée à l\'origine b', min: -4, max: 4, value: 0 }, function (v) { b = v; upd(); });
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'Trouve l\'équation de la droite passant par C(2 ; 1) et D(4 ; 7).',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. a = (7 − 1) ÷ (4 − 2) = ?', a: 3 },
            { q: 'Étape 2. 1 = 3 × 2 + b, donc b = ?', a: -5 },
            { type: 'opt', q: 'Étape 3. L\'équation est :', o: ['y = 3x − 5', 'y = 5x − 3', 'y = 3x + 5'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Pente de y = −4x + 2 ?', a: -4 },
      { lvl: 'Niveau 2', q: 'Ordonnée à l\'origine de y = 5x − 3 ?', a: -3 },
      { lvl: 'Niveau 3', q: 'Une droite parallèle à y = 3x + 1 a pour pente :', o: ['3', '1', '−3'], a: 0 },
      { lvl: 'Niveau 4', q: 'Pente de la droite passant par (0 ; 2) et (4 ; 10) ?', a: 2 }
    ],

    bilan: {
      vb: '0 0 360 230', label: 'Le seau',
      hud: [['b', 'b'], ['a', 'a'], ['e', 'équation']],
      draw: function (svg) { var e = {}; e.r = repere(svg); return e; },
      steps: [
        { cap: 'Au départ : **b = 1**. Chaque minute : **a = 2**.', hud: { b: ['1'], a: ['2'], e: '–' }, run: function (e) { e.r.set([[2, 1, OR]], [[0, 1], [1, 3], [2, 5], [3, 7]], [2, 1]); } },
        { cap: 'Les points sont sur la droite **y = 2x + 1**. Après 10 min : 2 × 10 + 1 = 21 L.', ar: 'النقط تنتمي إلى المستقيم [[y = 2x + 1]].', hud: { b: '1', a: '2', e: ['y = 2x + 1'] }, run: function (e) { e.r.set([[2, 1, OR]], [[0, 1], [1, 3], [2, 5], [3, 7]]); } }
      ]
    },

    retenir: [
      'Une droite non parallèle à l\'axe des ordonnées a une équation <b class="mono">y = ax + b</b> : <b>a</b> est la <b>pente</b> (coefficient directeur), <b>b</b> l\'<b>ordonnée à l\'origine</b>.',
      'Par A et B : <b class="mono">a = (yB − yA) ÷ (xB − xA)</b>, puis on trouve b avec un point. Deux droites sont parallèles si elles ont la <b>même pente</b>.'
    ],
    retenirAr: 'كل مستقيم غير مواز لمحور الأراتيب له معادلة [[y = ax + b]]، حيث a المعامل الموجه و b الأرتوب عند الأصل. يتوازى مستقيمان إذا كان لهما نفس المعامل الموجه.',
    voc: [['l\'équation réduite', 'المعادلة المختصرة'], ['la pente', 'المعامل الموجه'], ['l\'ordonnée à l\'origine', 'الأرتوب عند الأصل'], ['alignés', 'مستقيمية']]
  });
})();
