/* @meta {"id":"1ac-parallelogrammes","level":"1","order":11,"theme":"Géométrie","title":"Parallélogrammes et quadrilatères particuliers","ar":"متوازي الأضلاع والرباعيات الخاصة","lead":"Deux baguettes croisées en leur milieu suffisent pour fabriquer un cerf-volant… ou un parallélogramme. Tout se lit sur les diagonales."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, RAD = Math.PI / 180, O = [180, 105];

  /* quadrilatère ABCD construit à partir de ses diagonales [AC] et [BD], qui se coupent en leur milieu O */
  function quad(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    var fig = S('path', { fill: 'rgba(255,122,47,.14)', stroke: 'var(--acc)', 'stroke-width': 3 }, g);
    var d1 = S('line', { stroke: '#7fb2ff', 'stroke-width': 2, 'stroke-dasharray': '6 4' }, g), d2 = S('line', { stroke: '#7fb2ff', 'stroke-width': 2, 'stroke-dasharray': '6 4' }, g);
    S('circle', { cx: O[0], cy: O[1], r: 4, fill: '#fff' }, g); T(g, O[0] + 8, O[1] + 16, 'O', 'tag', 'start');
    var lab = ['A', 'B', 'C', 'D'].map(function (n) { return T(g, 0, 0, n, 'lbl'); });
    g.set = function (a, b, ang) { // demi-diagonales a (AC) et b (BD), angle entre elles
      var u = [Math.cos(0), Math.sin(0)], v = [Math.cos(ang * RAD), -Math.sin(ang * RAD)];
      var P = [[O[0] - a * u[0], O[1] - a * u[1]], [O[0] - b * v[0], O[1] - b * v[1]], [O[0] + a * u[0], O[1] + a * u[1]], [O[0] + b * v[0], O[1] + b * v[1]]];
      fig.setAttribute('d', 'M' + P.map(function (p) { return p.join(' '); }).join(' L') + ' Z');
      d1.setAttribute('x1', P[0][0]); d1.setAttribute('y1', P[0][1]); d1.setAttribute('x2', P[2][0]); d1.setAttribute('y2', P[2][1]);
      d2.setAttribute('x1', P[1][0]); d2.setAttribute('y1', P[1][1]); d2.setAttribute('x2', P[3][0]); d2.setAttribute('y2', P[3][1]);
      P.forEach(function (p, i) { var dx = p[0] - O[0], dy = p[1] - O[1], n = Math.sqrt(dx * dx + dy * dy) || 1; lab[i].setAttribute('x', p[0] + dx / n * 14); lab[i].setAttribute('y', p[1] + dy / n * 14 + 5); });
    };
    return g;
  }
  function nature(a, b, ang) {
    var eg = a === b, pe = ang === 90;
    return eg && pe ? 'carré' : eg ? 'rectangle' : pe ? 'losange' : 'parallélogramme';
  }

  MV.lesson({
    id: '1ac-parallelogrammes',
    objectif: {
      fr: 'Reconnaître un parallélogramme et les quadrilatères particuliers (rectangle, losange, carré) grâce à leurs côtés et à leurs diagonales.',
      ar: 'التعرف على متوازي الأضلاع والرباعيات الخاصة (المستطيل، المعين، المربع) بواسطة أضلاعها وقطريها.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Deux baguettes croisées',
      hud: [['b', 'baguettes'], ['m', 'croisées en'], ['q', 'quelle forme ?']],
      draw: function (svg) { var e = {}; e.q = quad(svg); return e; },
      steps: [
        { cap: 'Deux **baguettes** de longueurs différentes, croisées en leur **milieu**.', hud: { b: ['160 et 120'], m: ['milieu'], q: '–' }, run: function (e) { e.q.set(80, 60, 60); } },
        { cap: 'On relie les quatre bouts : on obtient un **quadrilatère**.', hud: { b: '160 et 120', m: 'milieu', q: '–' }, run: function (e) { e.q.set(80, 60, 60); } },
        { cap: 'Quelle forme obtient-on, et comment la changer en **carré** ? On le saura à la fin.', hud: { b: '160 et 120', m: 'milieu', q: ['?'] }, run: function (e) { e.q.set(80, 60, 60); } }
      ]
    },

    predire: {
      q: "Deux baguettes de longueurs différentes se croisent en leur milieu. Quelle figure forment leurs quatre extrémités ?",
      ar: "عودان مختلفا الطول يتقاطعان في منتصفيهما. ما الشكل الذي تكوّنه رؤوسهما الأربعة؟",
      o: ["Un rectangle", "Un parallélogramme", "Un cerf-volant"],
      a: 1,
      e: "Un quadrilatère dont les diagonales se coupent en leur milieu est un parallélogramme. Pour obtenir un carré, il faut en plus des diagonales de même longueur et perpendiculaires.",
      ear: "الرباعي الذي يتقاطع قطراه في منتصفيهما متوازي أضلاع. ولكي يصير مربعاً يلزم أن يتساوى القطران ويتعامدا."
    },

    prepare: [
      ['Un quadrilatère a quatre côtés.', true, 'Et quatre sommets.'],
      ['Les diagonales d\'un quadrilatère relient deux sommets voisins.', false, 'Elles relient deux sommets opposés.'],
      ['Un carré a quatre angles droits.', true, 'Et quatre côtés égaux.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Tout se lit sur les diagonales',
      hud: [['d', 'diagonales'], ['p', 'propriété'], ['n', 'nature']],
      draw: function (svg) { var e = {}; e.q = quad(svg); return e; },
      steps: [
        { cap: 'Les diagonales ont le **même milieu** O : ABCD est un **parallélogramme**.', ar: 'للقطرين نفس المنتصف: الرباعي متوازي أضلاع.', hud: { d: ['même milieu'], p: 'côtés opposés // et égaux', n: ['parallélogramme'] }, run: function (e) { e.q.set(80, 60, 60); } },
        { cap: 'Ses côtés opposés sont **parallèles** et de **même longueur**.', ar: 'أضلاعه المتقابلة متوازية ولها نفس الطول.', hud: { d: 'même milieu', p: ['(AB) // (CD), AB = CD'], n: 'parallélogramme' }, run: function (e) { e.q.set(80, 60, 60); } },
        { cap: 'Diagonales de **même longueur** : c\'est un **rectangle**.', ar: 'إذا كان للقطرين نفس الطول فهو مستطيل.', hud: { d: ['même longueur'], p: '4 angles droits', n: ['rectangle'] }, run: function (e) { e.q.set(80, 80, 50); } },
        { cap: 'Diagonales **perpendiculaires** : c\'est un **losange**.', ar: 'إذا كان القطران متعامدين فهو معين.', hud: { d: ['perpendiculaires'], p: '4 côtés égaux', n: ['losange'] }, run: function (e) { e.q.set(90, 55, 90); } },
        { cap: 'Les deux à la fois : c\'est un **carré**.', ar: 'إذا اجتمعت الخاصيتان فهو مربع.', hud: { d: ['même longueur et ⊥'], p: '4 côtés égaux, 4 angles droits', n: ['carré'] }, run: function (e) { e.q.set(75, 75, 90); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Règle les diagonales et observe la nature du quadrilatère. Obtiens un carré.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Quadrilatère et diagonales' }, st);
          var q = quad(svg), a = 80, b = 60, ang = 60, set = MV.hud(c, [['l', 'AC et BD'], ['g', 'angle'], ['n', 'nature', 1]]);
          function upd() { q.set(a, b, ang); set('l', 2 * a + ' et ' + 2 * b); set('g', ang + '°'); var n = nature(a, b, ang); set('n', n); if (n === 'carré') done(); }
          MV.slider(c, { label: 'demi-diagonale BD', min: 30, max: 80, value: 60, step: 10 }, function (v) { b = v; upd(); });
          MV.slider(c, { label: 'angle des diagonales (°)', min: 30, max: 90, value: 60, step: 10 }, function (v) { ang = v; upd(); });
          upd();
          MV.H('p', 'small', 'La demi-diagonale [OA] mesure 80.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'ABCD est un parallélogramme. Ses diagonales mesurent toutes deux 10 cm.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Diagonales de même longueur : ABCD est', o: ['un rectangle', 'un losange'], a: 0 },
            { q: 'Étape 2. O est le milieu de [AC]. OA = ? cm', a: 5 },
            { type: 'opt', q: 'Étape 3. Si en plus les diagonales sont perpendiculaires, ABCD est', o: ['un carré', 'un trapèze'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Les diagonales d\'un parallélogramme :', o: ['ont le même milieu', 'sont toujours égales'], a: 0 },
      { lvl: 'Niveau 2', q: 'Un parallélogramme à diagonales perpendiculaires est :', o: ['un losange', 'un rectangle'], a: 0 },
      { lvl: 'Niveau 3', q: 'ABCD parallélogramme, AB = 7 cm. CD = ? cm', a: 7 },
      { lvl: 'Niveau 4', q: 'Un losange a un côté de 6 cm. Son périmètre (cm) ?', a: 24 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Fabriquer un carré',
      hud: [['l', 'longueurs'], ['a', 'angle'], ['n', 'nature']],
      draw: function (svg) { var e = {}; e.q = quad(svg); return e; },
      steps: [
        { cap: 'Baguettes différentes, angle quelconque : un **parallélogramme**.', hud: { l: ['différentes'], a: '60°', n: ['parallélogramme'] }, run: function (e) { e.q.set(80, 60, 60); } },
        { cap: 'Pour un **carré** : deux baguettes de **même longueur**, croisées à **angle droit**.', ar: 'للحصول على مربع: قطران متساويان ومتعامدان ولهما نفس المنتصف.', hud: { l: ['égales'], a: ['90°'], n: ['carré'] }, run: function (e) { e.q.set(75, 75, 90); } }
      ]
    },

    retenir: [
      'Un <b>parallélogramme</b> a ses côtés opposés parallèles et de même longueur ; ses <b>diagonales ont le même milieu</b>.',
      'Diagonales de même longueur : <b>rectangle</b>. Diagonales perpendiculaires : <b>losange</b>. Les deux : <b>carré</b>.'
    ],
    retenirAr: 'متوازي الأضلاع أضلاعه المتقابلة متوازية ومتقايسة، وقطراه لهما نفس المنتصف. القطران المتقايسان: مستطيل. القطران المتعامدان: معين. الخاصيتان معا: مربع.',
    voc: [['un parallélogramme', 'متوازي الأضلاع'], ['un losange', 'معين'], ['un rectangle', 'مستطيل'], ['une diagonale', 'قطر'], ['le milieu', 'المنتصف']]
  });
})();
