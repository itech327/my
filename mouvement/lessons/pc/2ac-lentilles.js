/* @meta {"id":"2ac-lentilles","level":"2","order":10,"theme":"La lumière","title":"Les lentilles minces","ar":"العدسات الرقيقة","lead":"Une loupe concentre la lumière du Soleil en un point si brillant qu'il peut chauffer une feuille. Ce point a un nom : le foyer."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, LX = 160, AY = 110;

  /* axe optique, lentille, rayons parallèles venus de la gauche */
  function banc(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    S('line', { x1: 10, y1: AY, x2: 350, y2: AY, stroke: '#9aa0a8', 'stroke-dasharray': '6 4' }, g); T(g, 14, AY + 16, 'axe optique', 'tag', 'start');
    g.set = function (type, f) { // type 'convergente' ou 'divergente' ; f distance focale en px
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var conv = type === 'convergente';
      S('path', { d: conv ? 'M' + LX + ' 40 Q' + (LX + 18) + ' ' + AY + ' ' + LX + ' 180 Q' + (LX - 18) + ' ' + AY + ' ' + LX + ' 40 Z' : 'M' + (LX - 10) + ' 40 H' + (LX + 10) + ' Q' + (LX + 2) + ' ' + AY + ' ' + (LX + 10) + ' 180 H' + (LX - 10) + ' Q' + (LX - 2) + ' ' + AY + ' ' + (LX - 10) + ' 40 Z', fill: 'rgba(170,220,255,.3)', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
      [-50, -25, 25, 50].forEach(function (h) {
        S('line', { x1: 20, y1: AY + h, x2: LX, y2: AY + h, stroke: '#f2c14e', 'stroke-width': 2 }, dyn);
        if (conv) { var t = (340 - LX) / f; S('line', { x1: LX, y1: AY + h, x2: 340, y2: AY + h - h * t, stroke: '#f2c14e', 'stroke-width': 2 }, dyn); }
        else { var k = (340 - LX) / f; S('line', { x1: LX, y1: AY + h, x2: 340, y2: AY + h + h * k, stroke: '#f2c14e', 'stroke-width': 2 }, dyn); S('line', { x1: LX - f, y1: AY, x2: LX, y2: AY + h, stroke: '#f2c14e', 'stroke-width': 1, 'stroke-dasharray': '3 4' }, dyn); }
      });
      var Fx = conv ? LX + f : LX - f;
      S('circle', { cx: Fx, cy: AY, r: 5, fill: 'var(--acc)' }, dyn); T(dyn, Fx, AY + 22, conv ? 'F\' (foyer)' : 'F\' (foyer virtuel)', 'tag');
      S('circle', { cx: LX, cy: AY, r: 3, fill: '#fff' }, dyn); T(dyn, LX + 6, AY - 8, 'O', 'tag', 'start');
      if (conv) { S('line', { x1: LX, y1: AY + 34, x2: Fx, y2: AY + 34, stroke: '#7fb2ff', 'stroke-width': 2 }, dyn); T(dyn, (LX + Fx) / 2, AY + 48, 'f', 'lbl'); }
    };
    return g;
  }

  MV.lesson({
    id: '2ac-lentilles',
    objectif: {
      fr: 'Distinguer lentilles convergentes et divergentes, connaître le foyer et la distance focale, et calculer la vergence C = 1/f.',
      ar: 'التمييز بين العدسات المجمعة والمفرقة، ومعرفة البؤرة والمسافة البؤرية، وحساب القوة [[C = 1/f]].'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'La loupe et le Soleil',
      hud: [['l', 'lumière'], ['p', 'après la loupe'], ['q', 'ce point ?']],
      draw: function (svg) { var e = {}; e.b = banc(svg); return e; },
      steps: [
        { cap: 'Les rayons du **Soleil** arrivent **parallèles** sur une loupe.', hud: { l: ['parallèle'], p: '–', q: '–' }, run: function (e) { e.b.set('convergente', 110); } },
        { cap: 'Derrière la loupe, ils se **rejoignent** en un point très brillant.', hud: { l: 'parallèle', p: ['un point'], q: '–' }, run: function (e) { e.b.set('convergente', 110); } },
        { cap: 'Comment s\'appelle ce point, et à quelle distance est-il ? On le saura à la fin.', hud: { l: 'parallèle', p: 'un point', q: ['?'] }, run: function (e) { e.b.set('convergente', 110); } }
      ]
    },

    predire: {
      q: "Les rayons parallèles du Soleil traversent une loupe. Que deviennent-ils derrière elle ?",
      ar: "تعبر أشعة الشمس المتوازية عدسة مكبّرة. ماذا يحدث لها خلفها؟",
      o: ["Ils restent parallèles", "Ils s'écartent les uns des autres", "Ils se rejoignent en un seul point"],
      a: 2,
      e: "Une loupe est une lentille convergente : elle rassemble les rayons parallèles en un point très brillant, le foyer image F'. La distance de ce point à la lentille est la distance focale f.",
      ear: "العدسة المكبّرة عدسة مجمّعة: تجمع الأشعة المتوازية في نقطة شديدة السطوع هي البؤرة الصورة [[F']]."
    },

    prepare: [
      ['Une lentille est un objet transparent qui dévie la lumière.', true, 'Ses faces sont courbes.'],
      ['Une loupe a les bords plus épais que le centre.', false, 'Une loupe a les bords minces : c\'est une lentille convergente.'],
      ['Il ne faut jamais regarder le Soleil à travers une loupe.', true, 'Cela brûle l\'œil.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Convergente ou divergente',
      hud: [['t', 'type'], ['f', 'forme'], ['e', 'effet']],
      draw: function (svg) { var e = {}; e.b = banc(svg); return e; },
      steps: [
        { cap: 'Lentille à **bords minces** : elle est **convergente**, elle rassemble les rayons.', ar: 'العدسة ذات الحافة الرقيقة عدسة مجمعة.', hud: { t: ['convergente'], f: 'bords minces', e: ['rassemble'] }, run: function (e) { e.b.set('convergente', 110); } },
        { cap: 'Des rayons parallèles à l\'axe convergent au **foyer image F\'**.', ar: 'الأشعة الموازية للمحور البصري تتجمع في البؤرة الصورة F\'.', hud: { t: 'convergente', f: '–', e: ['foyer F\''] }, run: function (e) { e.b.set('convergente', 110); } },
        { cap: 'La distance OF\' est la **distance focale f**. Plus f est petite, plus la lentille est puissante.', ar: 'المسافة OF\' هي المسافة البؤرية f.', hud: { t: 'convergente', f: ['f = OF\''], e: 'f courte : puissante' }, run: function (e) { e.b.set('convergente', 70); } },
        { cap: 'La **vergence** : **C = 1/f**, en **dioptries** (δ) si f est en mètres. f = 0,25 m donne C = 4 δ.', ar: 'القوة [[C = 1/f]] بالديوبتري إذا كانت f بالمتر.', hud: { t: 'vergence', f: ['C = 1/f'], e: ['4 δ'] }, run: function (e) { e.b.set('convergente', 70); } },
        { cap: 'Lentille à **bords épais** : **divergente**, elle écarte les rayons.', ar: 'العدسة ذات الحافة السميكة عدسة مفرقة.', hud: { t: ['divergente'], f: 'bords épais', e: ['écarte'] }, run: function (e) { e.b.set('divergente', 90); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change le type de lentille et la distance focale. Place le foyer à 60 px de la lentille.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Lentille et rayons' }, st);
          var b = banc(svg), type = 'convergente', f = 120, set = MV.hud(c, [['t', 'lentille'], ['f', 'f'], ['p', 'puissance', 1]]);
          function upd() { b.set(type, f); set('t', type); set('f', f + ' px'); set('p', f <= 80 ? 'forte' : f <= 120 ? 'moyenne' : 'faible'); if (type === 'convergente' && f === 60) done(); }
          var row = MV.H('div', 'row', '', c); ['convergente', 'divergente'].forEach(function (k) { var bt = MV.H('button', 'btn', 'Lentille ' + k, row); bt.onclick = function () { type = k; upd(); }; });
          MV.slider(c, { label: 'distance focale', min: 60, max: 160, value: 120, step: 20 }, function (v) { f = v; upd(); });
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'Une loupe a une distance focale f = 10 cm.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. f en mètres ?', a: 0.1 },
            { q: 'Étape 2. C = 1/f = ? δ', a: 10 },
            { type: 'opt', q: 'Étape 3. Cette loupe est :', o: ['convergente', 'divergente'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Une lentille à bords minces est :', o: ['convergente', 'divergente'], a: 0 },
      { lvl: 'Niveau 2', q: 'Le point où convergent les rayons parallèles à l\'axe est :', o: ['le foyer image', 'le centre optique'], a: 0 },
      { lvl: 'Niveau 3', q: 'f = 0,5 m. C = ? δ', a: 2 },
      { lvl: 'Niveau 4', q: 'C = 5 δ. f = ? cm', a: 20 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le point brillant',
      hud: [['n', 'nom'], ['d', 'distance'], ['p', 'prudence']],
      draw: function (svg) { var e = {}; e.b = banc(svg); return e; },
      steps: [
        { cap: 'Le point brillant est le **foyer image F\'** de la loupe, lentille convergente.', hud: { n: ['foyer F\''], d: '–', p: '–' }, run: function (e) { e.b.set('convergente', 110); } },
        { cap: 'Il se trouve à la **distance focale** f de la lentille. La lumière concentrée y chauffe fort : prudence.', ar: 'النقطة اللامعة هي البؤرة الصورة، وتوجد على المسافة البؤرية من العدسة.', hud: { n: 'foyer F\'', d: ['f = OF\''], p: ['ne jamais viser l\'œil'] }, run: function (e) { e.b.set('convergente', 110); } }
      ]
    },

    retenir: [
      'Une lentille à <b>bords minces</b> est <b>convergente</b> ; à <b>bords épais</b>, <b>divergente</b>. Les rayons parallèles à l\'axe convergent au <b>foyer image F\'</b>.',
      'La <b>distance focale</b> est f = OF\'. La <b>vergence</b> <b class="mono">C = 1/f</b> s\'exprime en dioptries (δ), f en mètres.'
    ],
    retenirAr: 'العدسة ذات الحافة الرقيقة مجمعة، وذات الحافة السميكة مفرقة. الأشعة الموازية للمحور البصري تتجمع في البؤرة الصورة. المسافة البؤرية [[f = OF\']] والقوة [[C = 1/f]] بالديوبتري.',
    voc: [['une lentille convergente', 'عدسة مجمعة'], ['une lentille divergente', 'عدسة مفرقة'], ['le foyer', 'البؤرة'], ['la distance focale', 'المسافة البؤرية'], ['la vergence', 'قوة العدسة']]
  });
})();
