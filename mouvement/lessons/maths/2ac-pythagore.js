/* @meta {"id":"2ac-pythagore","level":"2","order":17,"theme":"Géométrie","title":"Le théorème de Pythagore","ar":"مبرهنة فيتاغورس","lead":"Les carrés construits sur les côtés d'un triangle rectangle se déplacent et remplissent le carré de l'hypoténuse."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* cadre de porte du menuisier, partagé par l'ouverture et le bilan */
  function porte(svg) {
    S('line', { x1: 0, y1: 262, x2: 360, y2: 262, stroke: '#3a3d42', 'stroke-width': 2 }, svg);
    S('rect', { x: 90, y: 60, width: 180, height: 200, fill: 'none', stroke: '#9aa0a8', 'stroke-width': 10 }, svg);
    return { x: 90, y: 260 };
  }

  MV.lesson({
    id: '2ac-pythagore',
    objectif: {
      fr: 'Calculer la longueur d\'un côté d\'un triangle rectangle quand on connaît les deux autres.',
      ar: 'حساب طول ضلع في مثلث قائم الزاوية إذا عرفنا طولي الضلعين الآخرين.'
    },

    ouverture: {
      vb: '0 0 360 300', label: 'Un cadre de porte et sa diagonale',
      hud: [['h', 'montant'], ['l', 'traverse'], ['d', 'diagonale']],
      draw: function (svg) {
        var o = porte(svg), e = {};
        e.coin = S('circle', { cx: o.x, cy: o.y, r: 16, fill: 'none', stroke: 'var(--acc)', 'stroke-width': 3 }, svg);
        e.q = T(svg, o.x + 40, o.y - 24, '90° ?', 'lbl big acc', 'start');
        e.mesures = S('g', {}, svg);
        S('line', { x1: o.x, y1: o.y, x2: o.x, y2: o.y - 120, stroke: 'var(--acc)', 'stroke-width': 4 }, e.mesures);
        S('line', { x1: o.x, y1: o.y, x2: o.x + 160, y2: o.y, stroke: 'var(--acc)', 'stroke-width': 4 }, e.mesures);
        T(e.mesures, o.x - 12, o.y - 60, '60 cm', 'lbl', 'end'); T(e.mesures, o.x + 80, o.y + 20, '80 cm');
        e.diag = S('g', {}, svg);
        S('line', { x1: o.x, y1: o.y - 120, x2: o.x + 160, y2: o.y, stroke: '#fff', 'stroke-width': 3, 'stroke-dasharray': '6 5' }, e.diag);
        T(e.diag, o.x + 96, o.y - 70, '? cm', 'lbl big');
        return e;
      },
      steps: [
        { cap: 'Un menuisier de Fès pose un **cadre de porte**.', hud: { h: '–', l: '–', d: '–' } },
        { cap: 'Le coin doit faire un **angle droit**. Il n\'a pas d\'équerre.', on: ['coin', 'q'], hud: { h: '–', l: '–', d: '–' } },
        { cap: 'Il mesure **60 cm** sur le montant et **80 cm** sur la traverse.', on: ['coin', 'mesures'], hud: { h: ['60'], l: ['80'], d: '–' } },
        { cap: 'Quelle **diagonale** doit-il trouver ? On le saura à la fin.', on: ['coin', 'mesures', 'diag'], hud: { h: '60', l: '80', d: ['?'] } }
      ]
    },

    prepare: [
      ['3² = 6', false, '3² = 3 × 3 = 9. Ce n\'est pas 3 × 2.'],
      ['Dans un triangle rectangle, l\'hypoténuse est le plus long côté.', true, 'Elle est en face de l\'angle droit, le plus grand angle du triangle.'],
      ['√25 = 5', true, 'Car 5 × 5 = 25.']
    ],

    regarde: {
      vb: '0 0 360 330', label: 'Les carrés construits sur les côtés du triangle',
      hud: [['ab', 'AB²'], ['ac', 'AC²'], ['bc', 'BC²']],
      draw: function (svg) {
        var u = 24, A = [150, 206], B = [150, 206 - 3 * u], C = [150 + 4 * u, 206];
        var e1 = [(C[0] - B[0]) / 5, (C[1] - B[1]) / 5], e2 = [e1[1], -e1[0]];
        var ang = Math.atan2(e1[1], e1[0]) * 180 / Math.PI, e = {};
        function poly(pts, attrs) { attrs.points = pts.map(function (p) { return p.join(','); }).join(' '); return S('polygon', attrs, svg); }
        var dash = { fill: 'none', stroke: '#5b6068', 'stroke-dasharray': '4 4' };
        e.sqAB = poly([[B[0] - 3 * u, B[1]], B, A, [A[0] - 3 * u, A[1]]], Object.assign({}, dash));
        e.sqAC = poly([A, C, [C[0], C[1] + 4 * u], [A[0], A[1] + 4 * u]], Object.assign({}, dash));
        e.sqBC = poly([B, C, [C[0] + 5 * e2[0], C[1] + 5 * e2[1]], [B[0] + 5 * e2[0], B[1] + 5 * e2[1]]], { fill: 'none', stroke: 'var(--acc)', 'stroke-width': 1.5, 'stroke-dasharray': '4 4' });
        // 25 cases : 9 bleues sur AB, 16 dorées sur AC ; cible = grand carré pivoté
        var home = [], target = [], cells = [];
        for (var j = 0; j < 3; j++) for (var i = 0; i < 3; i++) home.push([B[0] - 3 * u + i * u, B[1] + j * u, 0, '#6c8fd1']);
        for (j = 0; j < 4; j++) for (i = 0; i < 4; i++) home.push([A[0] + i * u, A[1] + j * u, 0, '#c9a35a']);
        for (j = 0; j < 5; j++) for (i = 0; i < 5; i++) target.push([B[0] + i * e1[0] + (j + 1) * e2[0], B[1] + i * e1[1] + (j + 1) * e2[1], ang]);
        e.cases = S('g', {}, svg);
        home.forEach(function (h, n) {
          var r = S('rect', { x: 1, y: 1, width: u - 2, height: u - 2, rx: 3, fill: h[3] }, e.cases);
          r.style.cssText = 'transition:transform .9s cubic-bezier(.6,.05,.3,1);transform-box:view-box;transform-origin:0 0;transition-delay:' + (n * 28) + 'ms';
          cells.push(r);
        });
        e.cases.place = function (to) {
          cells.forEach(function (r, n) { var p = to ? target[n] : home[n]; r.style.transform = 'translate(' + p[0] + 'px,' + p[1] + 'px) rotate(' + p[2] + 'deg)'; });
        };
        e.cases.place(false);
        S('line', { x1: A[0], y1: A[1], x2: B[0], y2: B[1], 'class': 'side' }, svg);
        S('line', { x1: A[0], y1: A[1], x2: C[0], y2: C[1], 'class': 'side' }, svg);
        e.bc = S('line', { x1: B[0], y1: B[1], x2: C[0], y2: C[1], 'class': 'side' }, svg);
        e.bc.style.opacity = 1;
        S('path', { d: 'M' + A[0] + ' ' + (A[1] - 12) + 'h12v12', fill: 'none', stroke: '#cfd3d8', 'stroke-width': 1.5 }, svg);
        T(svg, A[0] - 8, A[1] + 16, 'A'); T(svg, B[0] - 8, B[1] - 6, 'B'); T(svg, C[0] + 12, C[1] + 4, 'C');
        T(svg, A[0] + 10, (A[1] + B[1]) / 2 + 4, '3', 'lbl', 'start'); T(svg, (A[0] + C[0]) / 2, A[1] - 8, '4');
        e.hyp = S('g', {}, svg);
        S('line', { x1: (B[0] + C[0]) / 2, y1: (B[1] + C[1]) / 2, x2: 268, y2: 40, stroke: '#8b8f96', 'stroke-width': 1 }, e.hyp);
        T(e.hyp, 268, 32, 'hypoténuse · en face de l\'angle droit', 'tag', 'end');
        e.n9 = T(svg, B[0] - 3 * u / 2, B[1] + 3 * u / 2 + 5, '9', 'lbl big');
        e.n16 = T(svg, A[0] + 2 * u, A[1] + 2 * u + 5, '16', 'lbl big');
        e.n25 = T(svg, B[0] + 2.5 * e1[0] + 2.5 * e2[0], B[1] + 2.5 * e1[1] + 2.5 * e2[1] + 6, '25', 'lbl big');
        e.n25.style.fill = '#fff';
        return e;
      },
      steps: [
        { cap: 'ABC est un triangle **rectangle** en A.', ar: 'المثلث [[ABC]] قائم الزاوية في [[A]].', on: ['bc'], hud: { ab: '–', ac: '–', bc: '–' }, run: function (e) { e.cases.place(false); } },
        { cap: 'Le côté en face de l\'angle droit s\'appelle l\'**hypoténuse**.', ar: 'الضلع المقابل للزاوية القائمة يسمى الوتر، وهو أطول الأضلاع.', on: ['bc', 'hyp'], hot: ['bc'], hud: { ab: '–', ac: '–', bc: '–' }, run: function (e) { e.cases.place(false); } },
        { cap: 'Sur chaque côté, on construit un **carré**.', ar: 'نبني مربعا على كل ضلع.', on: ['bc', 'sqAB', 'sqAC', 'sqBC'], hot: ['bc'], hud: { ab: '–', ac: '–', bc: '–' }, run: function (e) { e.cases.place(false); } },
        { cap: 'AB = 3 : son carré contient **9** cases. AC = 4 : **16** cases.', ar: 'مربع الضلع [[AB]] فيه 9 خانات، ومربع [[AC]] فيه 16 خانة.', on: ['bc', 'sqAB', 'sqAC', 'sqBC', 'cases', 'n9', 'n16'], hot: ['bc'], hud: { ab: ['9'], ac: ['16'], bc: '–' }, run: function (e) { e.cases.place(false); } },
        { cap: 'Déplaçons toutes les cases vers le **grand carré**…', ar: 'ننقل كل الخانات إلى المربع الكبير.', on: ['bc', 'sqAB', 'sqAC', 'sqBC', 'cases'], hot: ['bc'], hud: { ab: '9', ac: '16', bc: ['?'] }, run: function (e) { e.cases.place(true); } },
        { cap: 'Elles le remplissent **exactement** : 9 + 16 = 25.', ar: 'تملؤه تماما: [[9 + 16 = 25]].', on: ['bc', 'sqAB', 'sqAC', 'sqBC', 'cases', 'n25'], hot: ['bc'], hud: { ab: '9', ac: '16', bc: ['25'] }, run: function (e) { e.cases.place(true); } },
        { cap: 'Donc **BC² = AB² + AC²**. Et BC = √25 = 5.', ar: 'إذن مربع الوتر يساوي مجموع مربعي الضلعين الآخرين، و [[BC = 5]].', on: ['bc', 'sqBC', 'n25', 'hyp'], hot: ['bc'], hud: { ab: '9', ac: '16', bc: ['25'] }, run: function (e) { e.cases.place(true); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change les deux côtés de l\'angle droit. Regarde l\'hypoténuse.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 260', role: 'img', 'aria-label': 'Triangle rectangle modifiable' }, st);
          var tri = S('polygon', { fill: 'var(--acc-bg)' }, svg);
          var l1 = S('line', { 'class': 'side' }, svg), l2 = S('line', { 'class': 'side' }, svg), l3 = S('line', { 'class': 'side hot' }, svg);
          var ra = S('path', { fill: 'none', stroke: '#cfd3d8', 'stroke-width': 1.5 }, svg);
          var ta = T(svg, 0, 0, '', 'lbl', 'end'), tb = T(svg, 0, 0, ''), tc = T(svg, 0, 0, '', 'lbl big acc', 'start');
          var a = 3, b = 4, set;
          function L(l, p, q) { l.setAttribute('x1', p[0]); l.setAttribute('y1', p[1]); l.setAttribute('x2', q[0]); l.setAttribute('y2', q[1]); }
          function draw() {
            var k = Math.min(200 / a, 290 / b, 26), A = [40, 230], B = [40, 230 - a * k], C = [40 + b * k, 230], cc = Math.sqrt(a * a + b * b);
            tri.setAttribute('points', [A, B, C].map(function (p) { return p.join(','); }).join(' '));
            L(l1, A, B); L(l2, A, C); L(l3, B, C); ra.setAttribute('d', 'M' + A[0] + ' ' + (A[1] - 12) + 'h12v12');
            ta.setAttribute('x', A[0] - 6); ta.setAttribute('y', (A[1] + B[1]) / 2); ta.textContent = a;
            tb.setAttribute('x', (A[0] + C[0]) / 2); tb.setAttribute('y', A[1] + 18); tb.textContent = b;
            tc.setAttribute('x', (B[0] + C[0]) / 2 + 14); tc.setAttribute('y', (B[1] + C[1]) / 2 - 8); tc.textContent = MV.fmt(cc);
            if (set) { set('s', (a * a) + '+' + (b * b)); set('c2', a * a + b * b); set('c', (Number.isInteger(cc) ? '' : '≈') + MV.fmt(cc)); }
          }
          MV.slider(c, { label: 'AB', min: 1, max: 9, value: 3 }, function (v) { a = v; draw(); });
          MV.slider(c, { label: 'AC', min: 1, max: 9, value: 4 }, function (v) { b = v; draw(); });
          set = MV.hud(c, [['s', 'AB²+AC²'], ['c2', 'BC²', 1], ['c', 'BC', 1]]);
          draw(); done();
        } },
      { title: 'Résolvons ensemble', intro: 'DEF est rectangle en E. DE = 5 cm et EF = 12 cm. Calcule DF.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 220', role: 'img', 'aria-label': 'Triangle DEF rectangle en E' }, st);
          var E = [70, 190], D = [70, 125], F = [310, 190];
          S('line', { x1: E[0], y1: E[1], x2: D[0], y2: D[1], 'class': 'side' }, svg);
          S('line', { x1: E[0], y1: E[1], x2: F[0], y2: F[1], 'class': 'side' }, svg);
          var df = S('line', { x1: D[0], y1: D[1], x2: F[0], y2: F[1], 'class': 'side' }, svg);
          S('path', { d: 'M' + E[0] + ' ' + (E[1] - 12) + 'h12v12', fill: 'none', stroke: '#cfd3d8', 'stroke-width': 1.5 }, svg);
          T(svg, E[0] - 10, E[1] + 16, 'E'); T(svg, D[0] - 10, D[1] - 4, 'D'); T(svg, F[0] + 10, F[1] + 4, 'F');
          T(svg, E[0] - 8, 162, '5', 'lbl', 'end'); T(svg, 190, E[1] + 18, '12');
          var tq = T(svg, 196, 148, '?', 'lbl big acc', 'start');
          function hit(p, q) { return S('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: 'transparent', 'stroke-width': 26 }, svg); }
          MV.guide(c, [
            { type: 'tap', q: 'Étape 1. Touche l\'hypoténuse sur la figure.', targets: { DE: hit(E, D), EF: hit(E, F), DF: hit(D, F) }, good: 'DF',
              ok: 'DF est en face de l\'angle droit E.', ko: 'Non : ce côté touche l\'angle droit. Cherche celui qui est en face.', onGood: function () { df.classList.add('hot'); } },
            { type: 'opt', q: 'Étape 2. Quelle égalité écrire ?', o: ['DE² = DF² + EF²', 'DF² = DE² + EF²', 'EF² = DE² + DF²'], a: 1,
              e: 'L\'hypoténuse DF est seule d\'un côté de l\'égalité.', ko: 'L\'hypoténuse doit être seule d\'un côté.' },
            { q: 'Étape 3. Remplace et calcule : DF² = 5² + 12² = ?', a: 169, ok: '25 + 144 = 169.', hint: '5² = 25 et 12² = 144.' },
            { q: 'Étape 4. DF = √169 = ?', a: 13, unit: 'cm', ok: 'Car 13 × 13 = 169.', hint: 'Cherche le nombre qui, multiplié par lui-même, donne 169.', after: function () { tq.textContent = '13'; } }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'RST est rectangle en S. RS = 6 cm et ST = 8 cm. Calcule RT.', a: 10, unit: 'cm', hint: 'RT² = 6² + 8² = 36 + 64.' },
      { lvl: 'Niveau 2', q: 'KLM est rectangle en L. KL = 9 cm et LM = 12 cm. Calcule KM.', a: 15, unit: 'cm', hint: 'KM² = 81 + 144 = 225.' },
      { lvl: 'Niveau 3', q: 'UVW est rectangle en V. UW = 10 cm et UV = 6 cm. Calcule VW.', a: 8, unit: 'cm', hint: 'On cherche un côté de l\'angle droit : VW² = UW² − UV² = 100 − 36.' },
      { lvl: 'Niveau 4', q: 'Une échelle de 5 m est posée contre un mur. Son pied est à 3 m du mur. À quelle hauteur touche-t-elle le mur ?', a: 4, unit: 'm', hint: 'L\'échelle est l\'hypoténuse : h² = 5² − 3² = 25 − 9.' }
    ],

    bilan: {
      vb: '0 0 360 300', label: 'Vérification du cadre de porte',
      hud: [['a', '60²+80²'], ['c', 'diagonale²'], ['d', 'diagonale']],
      draw: function (svg) {
        var o = porte(svg), e = {};
        S('line', { x1: o.x, y1: o.y, x2: o.x, y2: o.y - 120, stroke: '#cfd3d8', 'stroke-width': 4 }, svg);
        S('line', { x1: o.x, y1: o.y, x2: o.x + 160, y2: o.y, stroke: '#cfd3d8', 'stroke-width': 4 }, svg);
        T(svg, o.x - 12, o.y - 60, '60', 'lbl', 'end'); T(svg, o.x + 80, o.y + 20, '80');
        S('line', { x1: o.x, y1: o.y - 120, x2: o.x + 160, y2: o.y, stroke: 'var(--acc)', 'stroke-width': 4 }, svg);
        e.cent = T(svg, o.x + 100, o.y - 70, '100 cm', 'lbl big acc');
        e.droit = S('path', { d: 'M' + (o.x + 4) + ' ' + (o.y - 18) + 'h14v14', fill: 'none', stroke: 'var(--ok)', 'stroke-width': 3 }, svg);
        e.faux = T(svg, o.x + 100, o.y - 70, '98 cm', 'lbl big'); e.faux.style.fill = 'var(--bad)';
        return e;
      },
      steps: [
        { cap: 'Retour chez le menuisier : le coin est un **angle droit** si…', hud: { a: '–', c: '–', d: '–' } },
        { cap: 'diagonale² = 60² + 80² = **10 000**.', hud: { a: ['10000'], c: ['10000'], d: '–' } },
        { cap: 'La diagonale doit mesurer **100 cm**.', ar: 'يجب أن يكون طول القطر [[100 cm]].', on: ['cent', 'droit'], hud: { a: '10000', c: '10000', d: ['100'] } },
        { cap: 'S\'il trouve 98 cm, le coin **n\'est pas** droit : il faut corriger.', ar: 'إذا وجد [[98 cm]] فالزاوية ليست قائمة ويجب التصحيح.', on: ['faux'], hud: { a: '10000', c: '9604', d: ['98'] } }
      ]
    },

    retenir: [
      'Si ABC est rectangle en A, alors <b class="mono">BC² = AB² + AC²</b>.',
      'L\'hypoténuse est le côté opposé à l\'angle droit. C\'est le plus long côté.'
    ],
    retenirAr: 'إذا كان المثلث [[ABC]] قائم الزاوية في [[A]]، فإن مربع الوتر [[BC]] يساوي مجموع مربعي الضلعين [[AB]] و [[AC]].',
    voc: [['l\'hypoténuse', 'الوتر'], ['l\'angle droit', 'الزاوية القائمة'], ['le carré d\'un nombre', 'مربع عدد'], ['la racine carrée', 'الجذر المربع']]
  });
})();
