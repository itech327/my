/* @meta {"id":"1ac-lois-circuits","level":"1","order":12,"theme":"Électricité","title":"Loi des nœuds et additivité des tensions","ar":"قانون العقد وقانون إضافية التوترات","lead":"Dans une maison, quand une lampe grille, les autres restent allumées. Elles sont branchées en dérivation, et le courant se partage aux nœuds."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  function lampe(g, x, y, on) { S('circle', { cx: x, cy: y, r: 14, fill: on ? '#f2c14e' : '#1d1f23', stroke: '#e9e9ea', 'stroke-width': 2.5 }, g); S('path', { d: 'M' + (x - 10) + ' ' + (y - 10) + ' l20 20 M' + (x + 10) + ' ' + (y - 10) + ' l-20 20', stroke: on ? '#141517' : '#e9e9ea', 'stroke-width': 2 }, g); }
  function pile(g) { S('line', { x1: 34, y1: 98, x2: 66, y2: 98, stroke: '#e9e9ea', 'stroke-width': 3 }, g); S('line', { x1: 42, y1: 112, x2: 58, y2: 112, stroke: '#e9e9ea', 'stroke-width': 6 }, g); T(g, 24, 109, 'G', 'lbl', 'end'); }

  function circuit(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (mode, o) { // mode 'serie' ou 'derivation' ; o : valeurs
      o = o || {};
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      pile(dyn);
      if (mode === 'serie') {
        S('path', { d: 'M50 98 V40 H310 V180 H50 V112', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 3 }, dyn);
        lampe(dyn, 150, 40, 1); lampe(dyn, 250, 40, 1);
        T(dyn, 150, 74, 'U₁ = ' + (o.u1 || '3,5') + ' V', 'tag acc'); T(dyn, 250, 74, 'U₂ = ' + (o.u2 || '2,5') + ' V', 'tag acc');
        T(dyn, 180, 160, 'U = ' + (o.u || '6') + ' V (générateur)', 'lbl');
      } else {
        S('path', { d: 'M50 98 V40 H130 M130 40 H300 V70 M300 110 V180 H130 M130 180 H50 V112 M130 40 V70 M130 110 V180', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 3 }, dyn);
        lampe(dyn, 130, 90, o.l1 !== 0); lampe(dyn, 300, 90, 1);
        S('circle', { cx: 130, cy: 40, r: 5, fill: 'var(--acc)' }, dyn); S('circle', { cx: 130, cy: 180, r: 5, fill: 'var(--acc)' }, dyn); T(dyn, 138, 30, 'nœud', 'tag', 'start');
        T(dyn, 62, 30, 'I = ' + o.i + ' A', 'tag acc', 'start'); T(dyn, 140, 128, 'I₁ = ' + o.i1 + ' A', 'tag acc', 'start'); T(dyn, 290, 152, 'I₂ = ' + o.i2 + ' A', 'tag acc', 'end');
      }
    };
    return g;
  }
  function fr(v) { return (Math.round(v * 100) / 100).toString().replace('.', ','); }

  MV.lesson({
    id: '1ac-lois-circuits',
    objectif: {
      fr: 'Distinguer montage en série et en dérivation, appliquer la loi des nœuds (I = I₁ + I₂) et l\'additivité des tensions en série (U = U₁ + U₂).',
      ar: 'التمييز بين التركيب على التوالي والتركيب على التوازي، وتطبيق قانون العقد [[I = I₁ + I₂]] وقانون إضافية التوترات [[U = U₁ + U₂]].'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Une lampe grillée',
      hud: [['l1', 'lampe 1'], ['l2', 'lampe 2'], ['q', 'pourquoi ?']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'Deux lampes d\'une maison sont allumées.', hud: { l1: ['allumée'], l2: ['allumée'], q: '–' }, run: function (e) { e.c.set('derivation', { i: '0,5', i1: '0,2', i2: '0,3' }); } },
        { cap: 'La lampe 1 **grille**… et la lampe 2 **reste allumée**.', hud: { l1: ['grillée'], l2: 'allumée', q: '–' }, run: function (e) { e.c.set('derivation', { l1: 0, i: '0,3', i1: '0', i2: '0,3' }); } },
        { cap: 'Comment sont-elles branchées, et que devient le courant ? On le saura à la fin.', hud: { l1: 'grillée', l2: 'allumée', q: ['?'] }, run: function (e) { e.c.set('derivation', { l1: 0, i: '0,3', i1: '0', i2: '0,3' }); } }
      ]
    },

    predire: {
      q: "Dans une maison, la lampe 1 grille mais la lampe 2 reste allumée. Comment sont-elles branchées ?",
      ar: "في بيت احترق المصباح [[1]] وبقي المصباح [[2]] مضيئاً. كيف هما موصولان؟",
      o: ["En série", "En dérivation", "On ne peut pas savoir"],
      a: 1,
      e: "En dérivation, chaque lampe a sa propre branche : si l'une grille, l'autre reste allumée. En série, il n'y a qu'une boucle, et si une lampe grille, tout s'éteint.",
      ear: "في التفرع لكل مصباح فرعه، فإن احترق أحدهما بقي الآخر مضيئاً. أما في التوالي فتنطفئ الدارة كلها."
    },

    prepare: [
      ['Un voltmètre se branche en dérivation.', true, 'Ses bornes aux bornes du dipôle.'],
      ['Dans un circuit en série, si une lampe grille, les autres restent allumées.', false, 'Le circuit est ouvert : toutes s\'éteignent.'],
      ['Un nœud est un point où se rejoignent au moins trois fils.', true, 'Le courant s\'y partage.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Série et dérivation',
      hud: [['m', 'montage'], ['l', 'loi'], ['v', 'valeurs']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: '**En série** : une seule boucle. Les tensions **s\'ajoutent** : U = U₁ + U₂.', ar: 'على التوالي: حلقة واحدة، والتوترات تضاف: [[U = U₁ + U₂]].', hud: { m: ['série'], l: ['U = U₁ + U₂'], v: '3,5 + 2,5 = 6 V' }, run: function (e) { e.c.set('serie'); } },
        { cap: '**En dérivation** : plusieurs branches entre deux **nœuds**.', ar: 'على التوازي: عدة فروع بين عقدتين.', hud: { m: ['dérivation'], l: '–', v: '–' }, run: function (e) { e.c.set('derivation', { i: '0,5', i1: '0,2', i2: '0,3' }); } },
        { cap: '**Loi des nœuds** : le courant qui arrive se **partage** : I = I₁ + I₂.', ar: 'قانون العقد: [[I = I₁ + I₂]].', hud: { m: 'dérivation', l: ['I = I₁ + I₂'], v: ['0,2 + 0,3 = 0,5 A'] }, run: function (e) { e.c.set('derivation', { i: '0,5', i1: '0,2', i2: '0,3' }); } },
        { cap: 'En dérivation, chaque branche a la **même tension** que le générateur ; chaque lampe fonctionne **indépendamment**.', ar: 'في التركيب على التوازي لكل فرع نفس توتر المولد، ويعمل كل مصباح باستقلال.', hud: { m: 'dérivation', l: 'même tension', v: ['indépendantes'] }, run: function (e) { e.c.set('derivation', { l1: 0, i: '0,3', i1: '0', i2: '0,3' }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'En dérivation, règle le courant dans chaque branche. Obtiens I = 0,8 A au nœud.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Montage en dérivation' }, st);
          var ci = circuit(svg), i1 = 0.2, i2 = 0.3, set = MV.hud(c, [['a', 'I₁'], ['b', 'I₂'], ['i', 'I = I₁ + I₂', 1]]);
          function upd() { ci.set('derivation', { i: fr(i1 + i2), i1: fr(i1), i2: fr(i2) }); set('a', fr(i1) + ' A'); set('b', fr(i2) + ' A'); set('i', fr(i1 + i2) + ' A'); if (Math.abs(i1 + i2 - 0.8) < 1e-9) done(); }
          MV.slider(c, { label: 'I₁ (×0,1 A)', min: 1, max: 5, value: 2 }, function (v) { i1 = v / 10; upd(); });
          MV.slider(c, { label: 'I₂ (×0,1 A)', min: 1, max: 5, value: 3 }, function (v) { i2 = v / 10; upd(); });
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'Deux lampes en série sur une pile de 4,5 V. On mesure 2 V aux bornes de la première.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. On applique :', o: ['l\'additivité des tensions', 'la loi des nœuds'], a: 0 },
            { q: 'Étape 2. Tension aux bornes de la deuxième lampe (V) ?', a: 2.5 },
            { type: 'opt', q: 'Étape 3. Si une lampe grille dans ce montage :', o: ['les deux s\'éteignent', 'l\'autre reste allumée'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Dans une maison, les lampes sont branchées :', o: ['en dérivation', 'en série'], a: 0 },
      { lvl: 'Niveau 2', q: 'I₁ = 0,4 A et I₂ = 0,25 A. I = ? A', a: 0.65 },
      { lvl: 'Niveau 3', q: 'U = 12 V, U₁ = 7 V en série. U₂ = ? V', a: 5 },
      { lvl: 'Niveau 4', q: 'I = 1,2 A arrive à un nœud ; une branche prend 0,5 A. L\'autre (A) ?', a: 0.7 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'La lampe grillée',
      hud: [['m', 'montage'], ['c', 'courant'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'Les lampes de la maison sont **en dérivation** : chacune a sa propre branche.', hud: { m: ['dérivation'], c: 'I = I₁ + I₂', r: '–' }, run: function (e) { e.c.set('derivation', { i: '0,5', i1: '0,2', i2: '0,3' }); } },
        { cap: 'Une lampe grille : I₁ = 0, mais **I₂ continue** de passer. L\'autre lampe reste allumée.', ar: 'المصابيح مركبة على التوازي، فإذا احترق أحدها يستمر التيار في الفرع الآخر.', hud: { m: 'dérivation', c: ['I = 0 + 0,3'], r: ['l\'autre reste allumée'] }, run: function (e) { e.c.set('derivation', { l1: 0, i: '0,3', i1: '0', i2: '0,3' }); } }
      ]
    },

    retenir: [
      '<b>En série</b> : une seule boucle, même intensité partout, et les tensions s\'ajoutent : <b class="mono">U = U₁ + U₂</b>.',
      '<b>En dérivation</b> : même tension aux bornes de chaque branche ; au nœud, les intensités s\'ajoutent : <b class="mono">I = I₁ + I₂</b> (loi des nœuds).'
    ],
    retenirAr: 'على التوالي: حلقة واحدة ونفس الشدة، والتوترات تضاف [[U = U₁ + U₂]]. على التوازي: نفس التوتر بين مربطي كل فرع، والشدات تضاف عند العقدة [[I = I₁ + I₂]].',
    voc: [['en série', 'على التوالي'], ['en dérivation', 'على التوازي'], ['un nœud', 'عقدة'], ['la tension', 'التوتر'], ['un voltmètre', 'فولطمتر']]
  });
})();
