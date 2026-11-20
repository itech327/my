/* @meta {"id":"2ac-pythagore-modele","level":"2","order":99,"theme":"Géométrie","title":"Le théorème de Pythagore (modèle pilote)","ar":"مبرهنة فيتاغورس","lead":"Un carré, quatre triangles identiques : on compte les cases pour découvrir le théorème, puis on l'utilise."} */
/* MODÈLE PILOTE de la phase 0 : cette leçon n'est PAS dans mouvement/lessons, donc jamais publiée.
   Elle sert à vérifier les 21 garde-fous du registre (docs/registre-erreurs-et-garde-fous.md). */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var U = 30, OX = 75, OY = 36;           // une case = 30 unités ; le grand carré (7 × 7 cases) commence en (75, 36)

  /* ---------- échelle contre un mur : ouverture et bilan ---------- */
  function echelle(svg, fin) {
    var e = {}, gx = 250, gy = 262, k = 36, foot = gx - 3 * k, top = gy - 4 * k;
    e.mur = S('g', {}, svg);
    S('rect', { x: gx, y: 40, width: 16, height: gy - 40, fill: '#3a3d42' }, e.mur);
    S('line', { x1: 0, y1: gy, x2: 360, y2: gy, stroke: '#3a3d42', 'stroke-width': 2 }, e.mur);
    e.echelle = S('g', {}, svg);
    S('line', { x1: foot, y1: gy, x2: gx, y2: top, stroke: 'var(--acc)', 'stroke-width': 5, 'stroke-linecap': 'round' }, e.echelle);
    for (var i = 1; i < 6; i++) S('line', { x1: foot + (gx - foot) * i / 6 - 7, y1: gy + (top - gy) * i / 6 - 5, x2: foot + (gx - foot) * i / 6 + 7, y2: gy + (top - gy) * i / 6 + 5, stroke: 'var(--acc)', 'stroke-width': 2 }, e.echelle);
    e.len = T(svg, (foot + gx) / 2 - 22, (gy + top) / 2 - 6, '5 m', 'lbl big acc', 'end');
    e.pied = S('g', {}, svg);
    S('line', { x1: foot, y1: gy + 16, x2: gx, y2: gy + 16, stroke: '#cfd3d8', 'stroke-width': 1.5 }, e.pied);
    T(e.pied, (foot + gx) / 2, gy + 32, '3 m');
    e.coin = S('path', { d: 'M' + (gx - 14) + ' ' + gy + 'v-14h14', fill: 'none', stroke: '#cfd3d8', 'stroke-width': 1.5 }, svg);
    e.haut = S('g', {}, svg);
    S('line', { x1: gx - 16, y1: gy, x2: gx - 16, y2: top, stroke: '#fff', 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, e.haut);
    T(e.haut, gx - 24, (gy + top) / 2 + 6, fin ? '4 m' : '? m', 'lbl big', 'end');
    return e;
  }
  var ECH = [['e', 'échelle'], ['p', 'pied'], ['h', 'hauteur']];

  /* ---------- le grand carré 7 × 7 : mêmes quatre triangles, deux rangements ---------- */
  function P(x, y) { return [OX + x * U, OY + y * U]; }
  function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
  // sommets d'un triangle dans l'ordre canonique : angle droit, bout du petit côté (3), bout du grand côté (4)
  function canon(t) {
    var best = null;
    [[0, 1, 2], [1, 0, 2], [2, 0, 1]].forEach(function (p) {          // l'angle droit est le sommet opposé à la plus grande longueur
      var r = t[p[0]], a = t[p[1]], b = t[p[2]];
      if (Math.abs(dist(r, a) * dist(r, a) + dist(r, b) * dist(r, b) - dist(a, b) * dist(a, b)) < 1e-6) best = dist(r, a) < dist(r, b) ? [r, a, b] : [r, b, a];
    });
    return best;
  }
  function ori(c) { return Math.sign((c[1][0] - c[0][0]) * (c[2][1] - c[0][1]) - (c[1][1] - c[0][1]) * (c[2][0] - c[0][0])); }
  // les deux rangements : sources = en moulinet (carré incliné au centre) ; cibles = deux rectangles 4×3 et 3×4 coupés en deux
  var SRC = [[P(0, 0), P(3, 0), P(0, 4)], [P(3, 0), P(7, 0), P(7, 3)], [P(7, 3), P(7, 7), P(4, 7)], [P(4, 7), P(0, 7), P(0, 4)]].map(canon);
  var TILTED = [P(3, 0), P(7, 3), P(4, 7), P(0, 4)];
  function halves(x0, y0, x1, y1) {                                      // les deux façons de couper un rectangle : 2 + 2 triangles
    var a = P(x0, y0), b = P(x1, y0), c = P(x1, y1), d = P(x0, y1);
    return [[canon([a, b, c]), canon([a, c, d])], [canon([a, b, d]), canon([b, c, d])]];
  }
  var DST = (function () {                                              // on garde, pour chaque rectangle, la coupe de même sens que les sources
    var out = [], sense = ori(SRC[0]);
    [halves(0, 0, 4, 3), halves(4, 3, 7, 7)].forEach(function (cuts) {
      cuts.forEach(function (c) { if (ori(c[0]) === sense && ori(c[1]) === sense) out.push(c[0], c[1]); });
    });
    return out;
  })();
  function mouvement(i, rangee2) {                                       // rotation + translation qui amène SRC[i] sur DST[i]
    var s = SRC[i], d = DST[i];
    var th = Math.atan2(d[1][1] - d[0][1], d[1][0] - d[0][0]) - Math.atan2(s[1][1] - s[0][1], s[1][0] - s[0][0]);
    var deg = Math.round(th * 180 / Math.PI / 90) * 90;                  // les côtés sont horizontaux ou verticaux : multiples de 90°
    return 'translate(' + (rangee2 ? d[0][0] : s[0][0]) + 'px,' + (rangee2 ? d[0][1] : s[0][1]) + 'px) rotate(' + (rangee2 ? deg : 0) + 'deg) translate(' + (-s[0][0]) + 'px,' + (-s[0][1]) + 'px)';
  }
  function pts(a) { return a.map(function (p) { return p.join(','); }).join(' '); }

  MV.lesson({
    id: '2ac-pythagore-modele',
    objectif: {
      fr: 'Calculer la longueur d\'un côté d\'un triangle rectangle quand on connaît les deux autres, et savoir si un triangle est rectangle.',
      ar: 'حساب طول ضلع في مثلث قائم الزاوية إذا عرفنا طولي الضلعين الآخرين، ومعرفة هل مثلث ما قائم الزاوية.'
    },

    ouverture: {
      vb: '0 0 360 300', label: 'Une échelle de 5 mètres posée contre un mur',
      hud: ECH,
      draw: function (svg) { return echelle(svg, false); },
      steps: [
        { cap: 'Un pompier pose une **échelle de 5 m** contre un mur.', ar: 'يسند رجل إطفاء سلما طوله [[5 m]] إلى جدار.', on: ['mur', 'echelle', 'len'], hud: { e: ['5 m'], p: '–', h: '–' } },
        { cap: 'Le pied est à **3 m** du mur. Le sol et le mur font un **angle droit**.', ar: 'قاعدة السلم على بعد [[3 m]] من الجدار، والأرض والجدار يكوّنان زاوية قائمة.', on: ['mur', 'echelle', 'len', 'pied', 'coin'], hud: { e: '5 m', p: ['3 m'], h: '–' } },
        { cap: 'À quelle **hauteur** touche-t-elle le mur ? **Devine** avant de continuer : plus de 3 m ? moins de 5 m ?', ar: 'على أي ارتفاع يلمس السلم الجدار؟ خمّن قبل أن تتابع.', on: ['mur', 'echelle', 'len', 'pied', 'coin', 'haut'], hud: { e: '5 m', p: '3 m', h: ['?'] } }
      ]
    },

    // la première affirmation est une prédiction : on parie avant de voir la réponse
    prepare: [
      ['Je parie : un triangle rectangle a des côtés de l\'angle droit de 3 cm et 4 cm. Son hypoténuse mesure 7 cm.', false, 'Le chemin direct est plus court que le détour : l\'hypoténuse est plus petite que 3 + 4. La scène suivante donne sa vraie valeur.'],
      ['Dans un triangle rectangle, l\'hypoténuse est le plus long côté.', true, 'Elle est en face de l\'angle droit, le plus grand angle du triangle.'],
      ['5² = 10', false, '5² = 5 × 5 = 25. Mettre au carré, ce n\'est pas doubler.'],
      ['√49 = 7', true, 'Car 7 × 7 = 49. La racine carrée est l\'opération inverse du carré.']
    ],

    regarde: {
      vb: '0 0 360 300', label: 'Un carré de 7 cases de côté, quatre triangles identiques, deux rangements',
      hud: [['tot', 'grand carré'], ['tri', '4 triangles'], ['rest', 'reste blanc']],
      draw: function (svg) {
        var e = {}, i, j;
        e.blanc1 = S('polygon', { points: pts(TILTED), fill: 'rgba(255,255,255,.14)', stroke: 'var(--acc)', 'stroke-width': 2 }, svg);
        e.blanc2 = S('g', {}, svg);
        S('rect', { x: OX + 4 * U, y: OY, width: 3 * U, height: 3 * U, fill: 'rgba(108,143,209,.22)', stroke: '#6c8fd1', 'stroke-width': 2 }, e.blanc2);
        S('rect', { x: OX, y: OY + 3 * U, width: 4 * U, height: 4 * U, fill: 'rgba(201,163,90,.22)', stroke: '#c9a35a', 'stroke-width': 2 }, e.blanc2);
        e.tris = S('g', {}, svg);
        var tr = SRC.map(function (t, n) {
          var p = S('polygon', { points: pts(t), fill: '#6c8fd1', 'fill-opacity': .85, stroke: '#fff', 'stroke-width': 1.5 }, e.tris);
          p.setAttribute('data-tri', n);
          p.style.cssText = 'transition:transform 1.1s cubic-bezier(.6,.05,.3,1);transform-box:view-box;transform-origin:0 0;transform:' + mouvement(n, false);
          return p;
        });
        e.tris.place = function (r2) { tr.forEach(function (p, n) { p.style.transform = mouvement(n, r2); }); };
        e.grille = S('g', {}, svg);
        for (i = 0; i <= 7; i++) {
          S('line', { x1: OX + i * U, y1: OY, x2: OX + i * U, y2: OY + 7 * U, stroke: '#cfd3d8', 'stroke-opacity': .35, 'stroke-width': 1 }, e.grille);
          S('line', { x1: OX, y1: OY + i * U, x2: OX + 7 * U, y2: OY + i * U, stroke: '#cfd3d8', 'stroke-opacity': .35, 'stroke-width': 1 }, e.grille);
        }
        S('rect', { x: OX, y: OY, width: 7 * U, height: 7 * U, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, e.grille);
        e.cote = T(svg, OX + 3.5 * U, OY - 10, '3 + 4 = 7 cases', 'lbl');
        e.lab34 = S('g', {}, svg);
        T(e.lab34, OX + 1.5 * U, OY + 0.6 * U, '3', 'lbl'); T(e.lab34, OX + 0.4 * U, OY + 2.2 * U, '4', 'lbl');
        e.nc = T(svg, OX + 3.5 * U, OY + 3.5 * U + 6, 'c²', 'lbl big acc');
        e.n9 = T(svg, OX + 5.5 * U, OY + 1.5 * U + 6, '9', 'lbl big');
        e.n16 = T(svg, OX + 2 * U, OY + 5 * U + 6, '16', 'lbl big');
        e.note = T(svg, OX + 3.5 * U, OY + 7 * U + 26, '1 triangle = la moitié de 3 × 4 = 6 cases', 'tag');
        return e;
      },
      steps: [
        { cap: 'On construit un grand carré de côté **3 + 4 = 7** : il contient **49** cases.', ar: 'نبني مربعا ضلعه [[3 + 4 = 7]]، فيه 49 خانة.', on: ['grille', 'cote'], hud: { tot: ['49'], tri: '–', rest: '–' }, run: function (e) { e.tris.place(false); } },
        { cap: 'On y place **4 triangles rectangles** identiques. Chacun couvre la moitié de 3 × 4, soit **6** cases : 24 cases.', ar: 'نضع أربعة مثلثات قائمة متطابقة، كل مثلث يغطي 6 خانات، أي 24 خانة.', on: ['grille', 'tris', 'lab34', 'note'], hud: { tot: '49', tri: ['24'], rest: '–' }, run: function (e) { e.tris.place(false); } },
        { cap: 'Il reste un **carré blanc incliné**. Son côté est l\'**hypoténuse** c, donc son aire est c². On compte : 49 − 24 = **25** cases.', ar: 'يبقى مربع أبيض مائل ضلعه هو الوتر [[c]]، ومساحته [[c²]]. نعدّ: [[49 − 24 = 25]].', on: ['blanc1', 'grille', 'tris', 'nc'], hot: ['blanc1'], hud: { tot: '49', tri: '24', rest: ['25'] }, run: function (e) { e.tris.place(false); } },
        { cap: 'On garde les **mêmes 4 triangles** et on les déplace.', ar: 'نحتفظ بالمثلثات الأربعة نفسها ونحرّكها.', on: ['grille', 'tris'], hud: { tot: '49', tri: '24', rest: ['?'] }, run: function (e) { e.tris.place(true); } },
        { cap: 'Le blanc devient **deux carrés** : 3 × 3 = **9** cases et 4 × 4 = **16** cases.', ar: 'يصبح الجزء الأبيض مربعين: [[3 × 3 = 9]] و [[4 × 4 = 16]].', on: ['blanc2', 'grille', 'tris', 'n9', 'n16'], hud: { tot: '49', tri: '24', rest: ['9 + 16'] }, run: function (e) { e.tris.place(true); } },
        { cap: 'Même grand carré, mêmes triangles : le blanc a la même aire. Donc **c² = 9 + 16 = 25**, et c = √25 = **5**.', ar: 'المساحة البيضاء نفسها في الحالتين، إذن [[c² = 9 + 16 = 25]] و [[c = 5]].', on: ['blanc2', 'grille', 'tris', 'n9', 'n16'], hud: { tot: '49', tri: '24', rest: ['25'] }, run: function (e) { e.tris.place(true); } }
      ]
    },

    faisons: [
      { title: 'J\'explore', intro: 'Change les deux côtés de l\'angle droit. Observe a², b² et c².',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 260', role: 'img', 'aria-label': 'Triangle rectangle modifiable' }, st);
          var tri = S('polygon', { fill: 'var(--acc-bg)' }, svg);
          var l1 = S('line', { 'class': 'side' }, svg), l2 = S('line', { 'class': 'side' }, svg), l3 = S('line', { 'class': 'side hot' }, svg);
          var ra = S('path', { fill: 'none', stroke: '#cfd3d8', 'stroke-width': 1.5 }, svg);
          var ta = T(svg, 0, 0, '', 'lbl', 'end'), tb = T(svg, 0, 0, ''), tc = T(svg, 0, 0, '', 'lbl big acc', 'start');
          var a = 3, b = 4, hud = MV.hud(c, [['a2', 'a²'], ['b2', 'b²'], ['s', 'a² + b²'], ['c', 'c', true]]);
          function L(l, p, q) { l.setAttribute('x1', p[0]); l.setAttribute('y1', p[1]); l.setAttribute('x2', q[0]); l.setAttribute('y2', q[1]); }
          function draw() {
            var k = Math.min(190 / a, 280 / b, 26), A = [40, 230], B = [40, 230 - a * k], C = [40 + b * k, 230], cc = Math.sqrt(a * a + b * b);
            tri.setAttribute('points', [A, B, C].map(function (p) { return p.join(','); }).join(' '));
            L(l1, A, B); L(l2, A, C); L(l3, B, C); ra.setAttribute('d', 'M' + A[0] + ' ' + (A[1] - 12) + 'h12v12');
            ta.setAttribute('x', A[0] - 6); ta.setAttribute('y', (A[1] + B[1]) / 2); ta.textContent = a;
            tb.setAttribute('x', (A[0] + C[0]) / 2); tb.setAttribute('y', A[1] + 18); tb.textContent = b;
            tc.setAttribute('x', (B[0] + C[0]) / 2 + 14); tc.setAttribute('y', (B[1] + C[1]) / 2 - 8); tc.textContent = MV.fmt(cc);
            hud('a2', a * a); hud('b2', b * b); hud('s', a * a + b * b); hud('c', MV.fmt(cc));
          }
          var sa = MV.slider(c, { label: 'Côté a', min: 1, max: 12, value: 3, fmt: function (v) { return v + ' cm'; } }, function (v) { a = v; draw(); });
          var sb = MV.slider(c, { label: 'Côté b', min: 1, max: 12, value: 4, fmt: function (v) { return v + ' cm'; } }, function (v) { b = v; draw(); });
          sa.update(); sb.update();
          MV.guide(c, [
            { q: 'Pour a = 6 et b = 8, que vaut a² + b² ?', a: 100, hint: '6² = 36 et 8² = 64.',
              diag: [{ v: 14, msg: 'Tu as additionné les côtés (6 + 8). Il faut additionner leurs carrés : 6² + 8².' }, { v: 48, msg: '6 × 8 = 48 est un produit. Calcule 6² puis 8², et additionne.' }], ok: 'a² + b² = 100, donc c = √100 = 10.' },
            { type: 'opt', q: 'Que remarques-tu sur c² et a² + b² quand tu bouges les curseurs ?', shuffle: true,
              o: ['c² est toujours égal à a² + b²', 'c est toujours égal à a + b', 'c² est toujours plus petit que a² + b²', 'ça dépend de a et de b'], a: 0,
              why: [null, 'Regarde a = 3, b = 4 : a + b = 7 mais c = 5. L\'hypoténuse est plus courte que le détour a + b.', 'Compare les deux cases du bandeau : elles sont égales, jamais l\'une plus petite.', 'Essaie plusieurs valeurs : la relation reste la même, seul c change.'],
              e: 'Cette égalité est le théorème de Pythagore : c² = a² + b².' }
          ], done);
        } },

      { title: 'Je cherche l\'hypoténuse', intro: 'DEF est rectangle en D, avec DE = 8 cm et DF = 15 cm.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 240', role: 'group', 'aria-label': 'Triangle DEF rectangle en D : touche un côté' }, st);
          var D = [50, 205], E = [50, 205 - 72], F = [50 + 135, 205];
          S('polygon', { points: pts([D, E, F]), fill: 'var(--acc-bg)' }, svg);
          var de = S('line', { x1: D[0], y1: D[1], x2: E[0], y2: E[1], 'class': 'side' }, svg), df = S('line', { x1: D[0], y1: D[1], x2: F[0], y2: F[1], 'class': 'side' }, svg), ef = S('line', { x1: E[0], y1: E[1], x2: F[0], y2: F[1], 'class': 'side' }, svg);
          S('path', { d: 'M' + D[0] + ' ' + (D[1] - 12) + 'h12v12', fill: 'none', stroke: '#cfd3d8', 'stroke-width': 1.5 }, svg);
          T(svg, D[0] - 10, D[1] + 4, 'D', 'lbl', 'end'); T(svg, E[0] - 10, E[1] - 4, 'E', 'lbl', 'end'); T(svg, F[0] + 10, F[1] + 4, 'F', 'lbl', 'start');
          T(svg, D[0] - 10, (D[1] + E[1]) / 2 + 4, '8', 'lbl', 'end'); T(svg, (D[0] + F[0]) / 2, D[1] + 22, '15');
          function zone(l) { var z = S('line', { x1: l.getAttribute('x1'), y1: l.getAttribute('y1'), x2: l.getAttribute('x2'), y2: l.getAttribute('y2'), stroke: 'rgba(0,0,0,0)', 'stroke-width': 22 }, svg); return z; }
          var hit = { 'côté DE': zone(de), 'côté DF': zone(df), 'côté EF': zone(ef) };
          MV.guide(c, [
            { type: 'tap', q: 'Touche l\'hypoténuse (le côté en face de l\'angle droit).', targets: hit, good: 'côté EF', ok: 'EF est en face de l\'angle droit D.', ko: 'L\'hypoténuse est en face de l\'angle droit, pas à côté de lui.', onGood: function () { ef.classList.add('hot'); } },
            { q: 'EF² = DE² + DF² = 8² + 15². Calcule 8² + 15².', a: 289, hint: '8² = 64 et 15² = 225.',
              diag: [{ v: 23, msg: 'Tu as additionné les côtés (8 + 15). Il faut additionner leurs carrés : 64 + 225.' }, { v: 120, msg: '8 × 15 = 120 est un produit. Calcule 8² puis 15².' }] },
            { q: 'EF² = 289. Donc EF = √289 = ?', unit: 'cm', a: 17, hint: 'Cherche un nombre qui, multiplié par lui-même, donne 289.',
              diag: [{ v: 289, msg: '289 est EF², pas EF. Il reste la racine carrée.' }, { v: 144.5, msg: 'Diviser par 2 ne donne pas la racine carrée. Cherche n tel que n × n = 289.' }], ok: 'EF = 17 cm.' }
          ], done);
        } },

      { title: 'Je cherche un côté de l\'angle droit', intro: 'Dans un triangle rectangle, l\'hypoténuse mesure 26 cm et un côté de l\'angle droit mesure 10 cm. Quel est l\'autre côté ?',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'L\'hypoténuse est connue. Pour trouver l\'autre côté, on…', shuffle: true,
              o: ['soustrait les carrés : 26² − 10²', 'additionne les carrés : 26² + 10²', 'soustrait les côtés : 26 − 10', 'additionne les côtés : 26 + 10'], a: 0,
              why: [null, 'L\'hypoténuse est déjà « la somme » : c² = a² + b². Pour retrouver b², on enlève a² à c².', 'On soustrait bien, mais les carrés, pas les côtés. Le théorème parle de carrés.', 'L\'hypoténuse est le plus long côté : le résultat ne peut pas dépasser 26.'],
              e: 'b² = c² − a².' },
            { q: 'Calcule 26² − 10².', a: 576, hint: '26² = 676 et 10² = 100.',
              diag: [{ v: 776, msg: 'Tu as additionné. L\'hypoténuse est connue : on soustrait 100 à 676.' }, { v: 16, msg: 'Tu as soustrait les côtés (26 − 10). Il faut soustraire leurs carrés.' }] },
            { q: 'b² = 576. Donc b = ?', unit: 'cm', a: 24, hint: '24 × 24 = ?',
              diag: [{ v: 576, msg: '576 est b², pas b. Il reste la racine carrée.' }], ok: 'b = 24 cm.' }
          ], done);
        } },

      { title: 'Je vérifie si un triangle est rectangle', intro: 'Un triangle a pour côtés 7 cm, 24 cm et 25 cm. Est-il rectangle ? (réciproque du théorème)',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Quel côté faut-il mettre au carré tout seul ?', shuffle: true,
              o: ['le plus grand : 25', 'le plus petit : 7', 'le côté du milieu : 24', 'peu importe'], a: 0,
              why: [null, 'Le plus petit côté ne peut pas être l\'hypoténuse.', 'Si le triangle est rectangle, l\'hypoténuse est le plus long côté, pas celui du milieu.', 'Si : l\'hypoténuse est toujours le plus grand côté, c\'est lui qu\'on met seul d\'un côté de l\'égalité.'], e: 'On teste si 25² = 7² + 24².' },
            { q: 'Calcule 25².', a: 625, diag: [{ v: 50, msg: '25² = 25 × 25, pas 25 × 2.' }] },
            { q: 'Calcule 7² + 24².', a: 625, hint: '7² = 49 et 24² = 576.', diag: [{ v: 31, msg: 'Tu as additionné les côtés. Il faut additionner leurs carrés.' }] },
            { type: 'opt', q: 'Que conclure ?', shuffle: true,
              o: ['25² = 7² + 24² : le triangle est rectangle', '25² ≠ 7² + 24² : le triangle n\'est pas rectangle', '7 + 24 > 25 : le triangle est rectangle', 'On ne peut pas conclure'], a: 0,
              why: [null, 'Les deux nombres sont égaux (625 et 625), ils ne sont pas différents.', 'Cette inégalité est vraie pour tout triangle, elle ne prouve pas l\'angle droit.', 'On peut conclure : l\'égalité est vérifiée.'],
              e: 'Réciproque : si c² = a² + b², le triangle est rectangle (angle droit en face de c).' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1 · hypoténuse', q: 'Un écran rectangulaire mesure 16 cm sur 12 cm. Quelle est la longueur de sa diagonale ?', unit: 'cm', a: 20, hint: 'La diagonale est l\'hypoténuse du triangle formé avec deux côtés : 16² + 12².',
        diag: [{ v: 28, msg: 'Tu as additionné les côtés (16 + 12). Additionne leurs carrés puis prends la racine carrée.' }, { v: 400, msg: '400 est le carré de la diagonale. Il reste la racine carrée.' }, { v: 4, msg: 'Tu as soustrait. La diagonale est l\'hypoténuse : on additionne les carrés.' }], ok: '16² + 12² = 400 et √400 = 20.' },
      { lvl: 'Niveau 2 · un côté de l\'angle droit', q: 'Un triangle est rectangle. Son hypoténuse mesure 41 cm et un côté de l\'angle droit 9 cm. Quelle est la longueur de l\'autre côté ?', unit: 'cm', a: 40, hint: 'L\'hypoténuse est connue : 41² − 9².',
        diag: [{ v: 1600, msg: '1600 est le carré du côté cherché. Il reste la racine carrée.' }, { v: 1762, msg: 'Tu as additionné. L\'hypoténuse est connue : on soustrait.' }, { v: 32, msg: 'Tu as soustrait les côtés (41 − 9). Soustrais leurs carrés.' }, { v: 50, msg: 'Tu as additionné les côtés. L\'hypoténuse est le plus long côté : 50 > 41 est impossible.' }], ok: '41² − 9² = 1600 et √1600 = 40.' },
      { lvl: 'Niveau 3 · réciproque', q: 'Un triangle a pour côtés 5 cm, 6 cm et 8 cm. Que peut-on dire ?', o: [
        'Il n\'est pas rectangle : 5² + 6² = 61 et 8² = 64',
        'Il est rectangle : 5 + 6 > 8',
        'Il est rectangle : 61 est proche de 64',
        'Il n\'est pas rectangle : 8 est trop grand'], a: 0, shuffle: true,
        why: [null, 'Cette inégalité est vraie pour tout triangle. Pour l\'angle droit, il faut une égalité de carrés.', 'Proche ne suffit pas : l\'égalité doit être exacte.', 'La longueur seule ne décide pas. On compare 8² avec 5² + 6².'],
        e: '61 ≠ 64, donc le triangle n\'est pas rectangle.' },
      { lvl: 'Niveau 4 · problème', q: 'Un bateau part d\'un port, navigue 12 km vers l\'est, puis 5 km vers le nord. À quelle distance, en ligne droite, est-il du port ?', unit: 'km', a: 13, hint: 'Est et nord font un angle droit. La distance cherchée est l\'hypoténuse.',
        diag: [{ v: 17, msg: 'Tu as additionné les distances (12 + 5), c\'est la longueur du trajet, pas la distance en ligne droite.' }, { v: 169, msg: '169 est le carré de la distance. Il reste la racine carrée.' }, { v: 7, msg: 'Tu as soustrait. Ici on cherche l\'hypoténuse : on additionne les carrés.' }], ok: '12² + 5² = 169 et √169 = 13.' }
    ],

    bilan: {
      vb: '0 0 360 300', label: 'La hauteur atteinte par l\'échelle',
      hud: ECH,
      draw: function (svg) { return echelle(svg, true); },
      steps: [
        { cap: 'Retour à l\'échelle. Elle est l\'**hypoténuse** : 5 m. Le pied est à 3 m.', ar: 'نعود إلى السلم: هو الوتر ([[5 m]])، وقاعدته على بعد [[3 m]].', on: ['mur', 'echelle', 'len', 'pied', 'coin'], hot: ['echelle'], hud: { e: ['5 m'], p: '3 m', h: '–' } },
        { cap: 'On cherche un côté de l\'angle droit : on **soustrait**. h² = 5² − 3² = 25 − 9 = **16**.', ar: 'نبحث عن ضلع الزاوية القائمة، إذن نطرح: [[h² = 5² − 3² = 16]].', on: ['mur', 'echelle', 'len', 'pied', 'coin'], hud: { e: '5 m', p: '3 m', h: ['h² = 16'] } },
        { cap: 'Donc h = √16 = **4 m**. Ta prévision était-elle proche ?', ar: 'إذن [[h = 4 m]]. هل كان تخمينك قريبا؟', on: ['mur', 'echelle', 'len', 'pied', 'coin', 'haut'], hot: ['haut'], hud: { e: '5 m', p: '3 m', h: ['4 m'] } },
        { cap: 'Retiens : **c² = a² + b²** pour l\'hypoténuse, **b² = c² − a²** pour un côté de l\'angle droit.', ar: 'الوتر: [[c² = a² + b²]]. ضلع الزاوية القائمة: [[b² = c² − a²]].', on: ['mur', 'echelle', 'len', 'pied', 'coin', 'haut'], hud: { e: '5 m', p: '3 m', h: '4 m' } }
      ]
    },

    defi: [
      { q: 'Les deux côtés de l\'angle droit mesurent 1 cm et 1 cm. Quelle est la longueur de l\'hypoténuse ? Arrondis au centième.', unit: 'cm', a: 1.41, tol: 0.006, hint: 'c² = 1² + 1² = 2, puis √2 à la calculatrice.',
        diag: [{ v: 2, msg: '2 est c², pas c. Il reste la racine carrée.' }, { v: 1, msg: 'c ne peut pas être égal à un côté de l\'angle droit : l\'hypoténuse est plus longue.' }] },
      { q: 'Côtés de l\'angle droit : 20 cm et 21 cm. Hypoténuse ?', unit: 'cm', a: 29, diag: [{ v: 41, msg: 'Tu as additionné les côtés. Additionne leurs carrés puis prends la racine carrée.' }, { v: 841, msg: '841 est c². Il reste la racine carrée.' }] },
      { q: 'Hypoténuse : 15 cm ; un côté de l\'angle droit : 12 cm. Autre côté ?', unit: 'cm', a: 9, diag: [{ v: 81, msg: '81 est le carré du côté cherché. Il reste la racine carrée.' }, { v: 3, msg: 'Soustrais les carrés (225 − 144), pas les côtés.' }, { v: 369, msg: 'Tu as additionné. L\'hypoténuse est connue : on soustrait.' }] }
    ],

    retenir: [
      'Dans un triangle rectangle, le carré de l\'hypoténuse est égal à la somme des carrés des deux autres côtés : <b>c² = a² + b²</b>.',
      'On cherche l\'hypoténuse : on <b>additionne</b> les carrés, puis on prend la racine carrée.',
      'On cherche un côté de l\'angle droit : on <b>soustrait</b> les carrés, puis on prend la racine carrée.',
      'Réciproque : si le carré du plus grand côté est égal à la somme des carrés des deux autres, le triangle est rectangle.'
    ],
    retenirAr: 'مبرهنة فيتاغورس: في مثلث قائم الزاوية، مربع الوتر يساوي مجموع مربعي الضلعين الآخرين: [[c² = a² + b²]]. لحساب الوتر نجمع المربعين ثم نأخذ الجذر المربع، ولحساب ضلع الزاوية القائمة نطرح ثم نأخذ الجذر المربع. العكسية: إذا كان مربع أكبر ضلع يساوي مجموع مربعي الضلعين الآخرين فالمثلث قائم الزاوية.',
    voc: [['hypoténuse', 'الوتر'], ['côté de l\'angle droit', 'ضلع الزاوية القائمة'], ['carré', 'مربع'], ['racine carrée', 'الجذر المربع'], ['réciproque', 'العكسية']]
  });
})();
