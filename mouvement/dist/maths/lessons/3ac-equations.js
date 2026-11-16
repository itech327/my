/* @meta {"id":"3ac-equations","level":"3","order":4,"theme":"Algèbre","title":"Équations et inéquations","ar":"المعادلات والمتراجحات","lead":"Trois sacs identiques et 2 kg équilibrent 14 kg : une balance qui reste en équilibre montre comment résoudre."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* balance : plateau gauche (n sacs x + k poids), plateau droit (r poids) */
  function balance(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('path', { d: 'M180 200 l-30 20 h60 z', fill: '#6b6f76' }, g); S('line', { x1: 180, y1: 70, x2: 180, y2: 200, stroke: '#6b6f76', 'stroke-width': 6 }, g);
    var fl = S('g', {}, g); fl.style.transition = 'transform .8s'; fl.style.transformOrigin = '180px 70px';
    S('line', { x1: 50, y1: 70, x2: 310, y2: 70, stroke: '#cfd3d8', 'stroke-width': 6 }, fl);
    var L = S('g', {}, fl), R = S('g', {}, fl);
    S('path', { d: 'M40 120 h100', stroke: '#cfd3d8', 'stroke-width': 4 }, fl); S('path', { d: 'M220 120 h100', stroke: '#cfd3d8', 'stroke-width': 4 }, fl);
    S('path', { d: 'M90 70 v50 M270 70 v50', stroke: '#9aa0a8', 'stroke-width': 1.5 }, fl);
    function sacs(par, x0, n, lab, col) { for (var i = 0; i < n; i++) { var x = x0 + (i % 4) * 24, y = 100 - Math.floor(i / 4) * 22; S('rect', { x: x, y: y, width: 22, height: 20, rx: 4, fill: col }, par); T(par, x + 11, y + 14, lab, 'tag').style.fill = '#141517'; } }
    g.set = function (n, k, r, lab) {
      while (L.firstChild) L.removeChild(L.firstChild); while (R.firstChild) R.removeChild(R.firstChild);
      sacs(L, 44, n, 'x', 'var(--acc)'); sacs(L, 44 + Math.min(n, 4) * 24, k, '1', '#e9e9ea');
      sacs(R, 224, r, '1', '#e9e9ea');
      fl.style.transform = 'rotate(' + ((lab === 'tilt') ? -6 : 0) + 'deg)';
    };
    return g;
  }
  function demi(svg, y) {
    var g = S('g', {}, svg), X0 = 180, U = 26;
    S('line', { x1: 10, y1: y, x2: 350, y2: y, stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    for (var k = -6; k <= 6; k++) { S('line', { x1: X0 + k * U, y1: y - 5, x2: X0 + k * U, y2: y + 5, stroke: '#9aa0a8' }, g); if (k % 2 === 0) T(g, X0 + k * U, y + 22, String(k).replace('-', '−'), 'tag'); }
    var ray = S('line', { y1: y, y2: y, stroke: 'var(--acc)', 'stroke-width': 6 }, g), dot = S('circle', { cy: y, r: 7, fill: '#141517', stroke: 'var(--acc)', 'stroke-width': 3 }, g);
    g.set = function (a, dir) { var x = X0 + a * U; ray.setAttribute('x1', x); ray.setAttribute('x2', dir < 0 ? 10 : 350); dot.setAttribute('cx', x); };
    return g;
  }

  MV.lesson({
    id: '3ac-equations',
    objectif: {
      fr: 'Résoudre une équation du premier degré et une inéquation, en gardant l\'égalité ou en inversant le sens si l\'on multiplie par un négatif.',
      ar: 'حل معادلة من الدرجة الأولى ومتراجحة، مع قلب الترتيب عند الضرب في عدد سالب.'
    },

    ouverture: {
      vb: '0 0 360 240', label: 'Une balance en équilibre',
      hud: [['g', 'à gauche'], ['d', 'à droite'], ['q', 'un sac']],
      draw: function (svg) { var e = {}; e.b = balance(svg); return e; },
      steps: [
        { cap: 'À gauche : **3 sacs** de farine identiques et 2 poids de 1 kg.', hud: { g: ['3x + 2'], d: '–', q: '–' }, run: function (e) { e.b.set(3, 2, 0, 'tilt'); } },
        { cap: 'À droite : **14 kg**. La balance est en équilibre.', hud: { g: '3x + 2', d: ['14'], q: '–' }, run: function (e) { e.b.set(3, 2, 14, ''); } },
        { cap: 'Combien pèse **un sac** ? On le saura à la fin.', hud: { g: '3x + 2', d: '14', q: ['?'] }, run: function (e) { e.b.set(3, 2, 14, ''); } }
      ]
    },

    prepare: [
      ['Si 3x = 12, alors x = 4.', true, '3 × 4 = 12.'],
      ['On peut ajouter un nombre d\'un seul côté d\'une égalité sans la changer.', false, 'Il faut faire la même opération des deux côtés.'],
      ['Si a < b, alors −a > −b.', true, 'Multiplier par un négatif inverse l\'ordre.']
    ],

    regarde: {
      vb: '0 0 360 240', label: 'Résoudre en gardant l\'équilibre',
      hud: [['e', 'équation'], ['o', 'opération'], ['s', 'solution']],
      draw: function (svg) { var e = {}; e.b = balance(svg); e.d = demi(svg, 200); return e; },
      steps: [
        { cap: 'L\'équation : **3x + 2 = 14**.', ar: 'المعادلة: [[3x + 2 = 14]].', hud: { e: ['3x + 2 = 14'], o: '–', s: '–' }, run: function (e) { e.b.style.opacity = 1; e.b.set(3, 2, 14, ''); } },
        { cap: 'On **retire 2** des deux côtés : 3x = 12. L\'équilibre reste.', ar: 'نطرح 2 من الطرفين: [[3x = 12]].', hud: { e: '3x = 12', o: ['− 2 des deux côtés'], s: '–' }, run: function (e) { e.b.set(3, 0, 12, ''); } },
        { cap: 'On **divise par 3** des deux côtés : x = 4.', ar: 'نقسم الطرفين على 3: [[x = 4]].', hud: { e: 'x = 4', o: ['÷ 3 des deux côtés'], s: ['x = 4'] }, run: function (e) { e.b.set(1, 0, 4, ''); } },
        { cap: 'On **vérifie** : 3 × 4 + 2 = 14. ✔', ar: 'نتحقق: [[3 × 4 + 2 = 14]].', hud: { e: '3 × 4 + 2', o: 'vérifier', s: ['4 est solution'] }, run: function (e) { e.b.set(3, 2, 14, ''); } },
        { cap: 'Inéquation : **−2x + 1 < 7** devient −2x < 6.', ar: 'متراجحة: [[−2x + 1 < 7]] تصبح [[−2x < 6]].', on: ['d'], hud: { e: ['−2x < 6'], o: '− 1', s: '–' }, run: function (e) { e.b.style.opacity = 0; e.d.set(-3, 1); } },
        { cap: 'On divise par −2 (négatif) : on **inverse le sens**. x > −3.', ar: 'نقسم على −2 وهو سالب فنقلب الترتيب: [[x > −3]].', on: ['d'], hud: { e: 'x > −3', o: ['÷ (−2) : sens inversé'], s: ['x > −3'] }, run: function (e) { e.b.style.opacity = 0; e.d.set(-3, 1); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis une valeur de x et teste-la dans 3x + 2 = 14.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 240', role: 'img', 'aria-label': 'Balance' }, st);
          var b = balance(svg), set = MV.hud(c, [['g', '3x + 2'], ['d', 'droite'], ['r', 'équilibre ?', 1]]);
          MV.slider(c, { label: 'x', min: 0, max: 8, value: 2 }, function (x) {
            var l = 3 * x + 2; set('g', l); set('d', 14); set('r', l === 14 ? 'oui : solution' : l < 14 ? 'non, trop léger' : 'non, trop lourd');
            b.set(3, 2, 14, ''); b.firstChild && 0; svg.querySelector('g g').style.transform = 'rotate(' + Math.max(-12, Math.min(12, (14 - l) * 1.5)) + 'deg)';
            if (l === 14) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Cherche la valeur qui équilibre la balance.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Résous 5x − 7 = 2x + 8.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. On regroupe les x à gauche :', o: ['3x − 7 = 8', '7x − 7 = 8', '3x + 7 = 8'], a: 0, e: 'On retire 2x des deux côtés.' },
            { q: 'Étape 2. On ajoute 7 : 3x = ?', a: 15 },
            { q: 'Étape 3. x = ?', a: 5, ok: 'Vérification : 5 × 5 − 7 = 18 et 2 × 5 + 8 = 18.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Résous 4x = 28. x = ?', a: 7 },
      { lvl: 'Niveau 2', q: 'Résous 2x − 9 = 5. x = ?', a: 7 },
      { lvl: 'Niveau 3', q: 'Résous −3x > 12.', o: ['x > −4', 'x < −4', 'x < 4'], a: 1, e: 'On divise par −3 : le sens s\'inverse.' },
      { lvl: 'Niveau 4', q: 'Un taxi demande 7 DH de prise en charge plus 4 DH par km. La course coûte 39 DH. Combien de km ?', a: 8, unit: 'km', hint: '7 + 4x = 39.' }
    ],

    bilan: {
      vb: '0 0 360 240', label: 'Le poids d\'un sac',
      hud: [['e', 'équation'], ['s', 'solution'], ['r', 'réponse']],
      draw: function (svg) { var e = {}; e.b = balance(svg); return e; },
      steps: [
        { cap: '3x + 2 = 14, donc 3x = 12, donc **x = 4**.', hud: { e: ['3x + 2 = 14'], s: ['x = 4'], r: '–' }, run: function (e) { e.b.set(3, 2, 14, ''); } },
        { cap: 'Chaque sac pèse **4 kg**.', ar: 'كل كيس يزن [[4 kg]].', hud: { e: '3x + 2 = 14', s: 'x = 4', r: ['4 kg'] }, run: function (e) { e.b.set(1, 0, 4, ''); } }
      ]
    },

    retenir: [
      'Pour résoudre une équation, on fait la <b>même opération des deux côtés</b> : ajouter, retrancher, multiplier ou diviser par un nombre non nul. On vérifie la solution.',
      'Pour une <b>inéquation</b>, même méthode ; mais si l\'on multiplie ou divise par un nombre <b>négatif</b>, on <b>inverse le sens</b> de l\'inégalité.'
    ],
    retenirAr: 'لحل معادلة نجري نفس العملية على الطرفين ثم نتحقق من الحل. في المتراجحة نفس الطريقة، لكن إذا ضربنا أو قسمنا على عدد سالب نقلب منحى المتفاوتة.',
    voc: [['une équation', 'معادلة'], ['une inéquation', 'متراجحة'], ['l\'inconnue', 'المجهول'], ['la solution', 'الحل'], ['vérifier', 'يتحقق']]
  });
})();
