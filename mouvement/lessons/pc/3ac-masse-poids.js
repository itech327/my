/* @meta {"id":"3ac-masse-poids","level":"3","order":13,"theme":"Mécanique","title":"Masse et poids","ar":"الكتلة والوزن","lead":"Un astronaute de 80 kg saute bien plus haut sur la Lune. A-t-il perdu de la masse ? Non : c'est son poids qui a changé."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var G = { Terre: 9.8, Lune: 1.6 };

  /* dynamomètre avec un objet suspendu ; le ressort s'allonge avec le poids */
  function dyna(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('rect', { x: 150, y: 14, width: 60, height: 8, fill: '#9aa0a8' }, g);
    var res = S('path', { fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2.5 }, g), crochet = S('g', {}, g);
    var corps = S('rect', { x: 155, width: 50, height: 40, rx: 6, fill: 'var(--acc)' }, crochet), tm = T(crochet, 180, 0, '', 'lbl');
    var fl = S('g', {}, g), tp = T(g, 260, 0, '', 'lbl', 'start');
    for (var k = 0; k <= 10; k++) { S('line', { x1: 120, y1: 30 + k * 15, x2: 130, y2: 30 + k * 15, stroke: '#9aa0a8' }, g); if (k % 2 === 0) T(g, 114, 34 + k * 15, k * 100, 'tag', 'end'); }
    T(g, 114, 20, 'N', 'tag', 'end');
    g.set = function (m, lieu) { // m en kg
      var P = m * G[lieu], L = Math.min(128, P * 0.15), y = 22 + 12 + L;
      var d = 'M180 22 V30'; for (var i = 0; i < 8; i++) d += ' L' + (i % 2 ? 168 : 192) + ' ' + (30 + (L + 4) * (i + 0.5) / 8); d += ' L180 ' + (34 + L);
      res.setAttribute('d', d);
      corps.setAttribute('y', y); tm.setAttribute('y', y + 26); tm.textContent = m + ' kg'; tm.style.fill = '#141517';
      while (fl.firstChild) fl.removeChild(fl.firstChild);
      var a = Math.max(20, Math.min(60, P * 0.06)); S('line', { x1: 230, y1: y + 20, x2: 230, y2: y + 20 + a, stroke: '#e5484d', 'stroke-width': 4 }, fl); S('path', { d: 'M222 ' + (y + 14 + a) + ' L230 ' + (y + 28 + a) + ' L238 ' + (y + 14 + a) + ' Z', fill: '#e5484d' }, fl);
      tp.setAttribute('y', y + 28); tp.textContent = 'P ≈ ' + Math.round(P) + ' N';
      return Math.round(P);
    };
    return g;
  }

  MV.lesson({
    id: '3ac-masse-poids',
    objectif: {
      fr: 'Distinguer la masse (kg, invariable) et le poids (N, force qui dépend du lieu), et utiliser la relation P = m × g.',
      ar: 'التمييز بين الكتلة (kg، لا تتغير) والوزن (N، قوة تتعلق بالمكان)، واستعمال العلاقة [[P = m × g]].'
    },

    ouverture: {
      vb: '0 0 360 215', label: 'Un astronaute sur la Lune',
      hud: [['m', 'masse'], ['l', 'lieu'], ['q', 'qu\'est-ce qui change ?']],
      draw: function (svg) { var e = {}; e.d = dyna(svg); return e; },
      steps: [
        { cap: 'Sur Terre, l\'astronaute a une masse de **80 kg**.', hud: { m: ['80 kg'], l: ['Terre'], q: '–' }, run: function (e) { e.d.set(80, 'Terre'); } },
        { cap: 'Sur la **Lune**, il saute six fois plus haut.', hud: { m: '80 kg', l: ['Lune'], q: '–' }, run: function (e) { e.d.set(80, 'Lune'); } },
        { cap: 'A-t-il maigri ? Qu\'est-ce qui a changé ? On le saura à la fin.', hud: { m: '80 kg ?', l: 'Lune', q: ['?'] }, run: function (e) { e.d.set(80, 'Lune'); } }
      ]
    },

    predire: {
      q: "Un astronaute de 80 kg sur Terre part sur la Lune. Quelle est sa masse là-bas ?",
      ar: "رائد فضاء كتلته [[80 kg]] على الأرض يذهب إلى القمر. كم تصبح كتلته هناك؟",
      o: ["Environ 13 kg", "80 kg", "0 kg"],
      a: 1,
      e: "La masse ne dépend pas du lieu : 80 kg partout. C'est le poids qui change : P = m × g = 80 × 1,6 = 128 N sur la Lune, contre 80 × 9,8 = 784 N sur Terre.",
      ear: "الكتلة لا تتغير بتغير المكان: [[80 kg]]. الذي يتغير هو الوزن: [[P = m × g = 128 N]] على القمر."
    },

    prepare: [
      ['La masse se mesure avec une balance.', true, 'En kilogrammes (kg).'],
      ['Le poids et la masse, c\'est la même chose.', false, 'Le poids est une force, en newtons.'],
      ['Un objet lâché tombe vers le sol.', true, 'Il est attiré par la Terre.']
    ],

    regarde: {
      vb: '0 0 360 215', label: 'Deux grandeurs différentes',
      hud: [['g', 'grandeur'], ['u', 'unité, instrument'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.d = dyna(svg); return e; },
      steps: [
        { cap: 'La **masse** mesure la quantité de matière. Elle se mesure en **kg** avec une **balance** et ne dépend pas du lieu.', ar: 'الكتلة مقدار المادة، تقاس بالكيلوغرام بواسطة الميزان، ولا تتغير بتغير المكان.', hud: { g: ['masse'], u: 'kg, balance', v: '10 kg' }, run: function (e) { e.d.set(10, 'Terre'); } },
        { cap: 'Le **poids** est la force d\'attraction de la Terre sur l\'objet. Il se mesure en **N** avec un **dynamomètre**.', ar: 'الوزن قوة جذب الأرض للجسم، يقاس بالنيوتن بواسطة الدينامومتر.', hud: { g: ['poids'], u: ['N, dynamomètre'], v: '≈ 98 N' }, run: function (e) { e.d.set(10, 'Terre'); } },
        { cap: 'Le poids est **vertical**, vers le **bas**, appliqué au centre de gravité.', ar: 'الوزن رأسي ومتجه نحو الأسفل، ونقطة تأثيره مركز ثقل الجسم.', hud: { g: 'poids', u: 'force', v: ['vertical, vers le bas'] }, run: function (e) { e.d.set(30, 'Terre'); } },
        { cap: 'Relation : **P = m × g**. Sur Terre, g ≈ **9,8 N/kg**.', ar: 'العلاقة: [[P = m × g]]، وعلى الأرض [[g ≈ 9,8 N/kg]].', hud: { g: 'relation', u: 'P = m × g', v: ['30 × 9,8 ≈ 294 N'] }, run: function (e) { e.d.set(30, 'Terre'); } },
        { cap: 'Sur la Lune, g ≈ **1,6 N/kg** : le poids est environ **six fois plus petit**, la masse est la même.', ar: 'على القمر [[g ≈ 1,6 N/kg]]: يصغر الوزن ست مرات تقريبا، وتبقى الكتلة نفسها.', hud: { g: 'Lune', u: 'g ≈ 1,6 N/kg', v: ['30 × 1,6 = 48 N'] }, run: function (e) { e.d.set(30, 'Lune'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis une masse et un lieu. Trouve la masse dont le poids lunaire vaut 160 N.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 215', role: 'img', 'aria-label': 'Dynamomètre' }, st);
          var d = dyna(svg), m = 20, lieu = 'Terre', set = MV.hud(c, [['m', 'masse'], ['l', 'lieu'], ['p', 'poids', 1]]);
          function upd() { var P = d.set(m, lieu); set('m', m + ' kg'); set('l', lieu + ' (g = ' + String(G[lieu]).replace('.', ',') + ')'); set('p', P + ' N'); if (lieu === 'Lune' && m === 100) done(); }
          MV.slider(c, { label: 'masse (kg)', min: 10, max: 100, value: 20, step: 10 }, function (v) { m = v; upd(); });
          var row = MV.H('div', 'row', '', c); Object.keys(G).forEach(function (k) { var b = MV.H('button', 'btn', 'Sur la ' + k, row); b.onclick = function () { lieu = k; upd(); }; });
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'Un cartable a une masse de 5 kg. Prends g = 10 N/kg sur Terre.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Son poids sur Terre (N) ?', a: 50 },
            { q: 'Étape 2. Sa masse sur la Lune (kg) ?', a: 5 },
            { q: 'Étape 3. Son poids sur la Lune avec g = 1,6 N/kg (N) ?', a: 8 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'L\'unité du poids est :', o: ['le newton (N)', 'le kilogramme (kg)'], a: 0 },
      { lvl: 'Niveau 2', q: 'La masse d\'un objet sur la Lune :', o: ['reste la même', 'diminue'], a: 0 },
      { lvl: 'Niveau 3', q: 'm = 2 kg, g = 9,8 N/kg. P = ? N', a: 19.6 },
      { lvl: 'Niveau 4', q: 'Un objet pèse 147 N sur Terre (g = 9,8 N/kg). Sa masse (kg) ?', a: 15 }
    ],

    bilan: {
      vb: '0 0 360 215', label: 'L\'astronaute',
      hud: [['m', 'masse'], ['t', 'poids sur Terre'], ['l', 'poids sur la Lune']],
      draw: function (svg) { var e = {}; e.d = dyna(svg); return e; },
      steps: [
        { cap: 'Sa masse reste **80 kg** partout. Sur Terre : P ≈ 80 × 9,8 ≈ **784 N**.', hud: { m: ['80 kg'], t: ['≈ 784 N'], l: '–' }, run: function (e) { e.d.set(80, 'Terre'); } },
        { cap: 'Sur la Lune : P = 80 × 1,6 = **128 N**. Moins de poids, d\'où les grands sauts.', ar: 'الكتلة ثابتة 80 kg، أما الوزن فينتقل من حوالي 784 N على الأرض إلى 128 N على القمر.', hud: { m: '80 kg', t: '≈ 784 N', l: ['128 N'] }, run: function (e) { e.d.set(80, 'Lune'); } }
      ]
    },

    retenir: [
      'La <b>masse</b> m (kg, balance) ne dépend pas du lieu. Le <b>poids</b> P (N, dynamomètre) est une force verticale vers le bas, qui dépend du lieu.',
      '<b class="mono">P = m × g</b>, avec g ≈ 9,8 N/kg sur Terre et g ≈ 1,6 N/kg sur la Lune.'
    ],
    retenirAr: 'الكتلة m تقاس بالكيلوغرام ولا تتعلق بالمكان. الوزن P قوة رأسية نحو الأسفل تقاس بالنيوتن وتتعلق بالمكان. [[P = m × g]] مع [[g ≈ 9,8 N/kg]] على الأرض.',
    voc: [['la masse', 'الكتلة'], ['le poids', 'الوزن'], ['l\'intensité de la pesanteur', 'شدة الثقالة'], ['le newton', 'النيوتن'], ['un dynamomètre', 'دينامومتر']]
  });
})();
