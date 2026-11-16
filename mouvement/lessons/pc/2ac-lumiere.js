/* @meta {"id":"2ac-lumiere","level":"2","order":7,"theme":"La lumière","title":"La lumière autour de nous","ar":"الضوء من حولنا","lead":"La Lune brille la nuit, mais elle ne produit aucune lumière. Pour voir un objet, il faut qu'une lumière venue de lui entre dans notre œil."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var MAT = { verre: [1, 'transparent'], 'papier calque': [0.45, 'translucide'], carton: [0, 'opaque'] };

  /* source, objet ou écran, œil, et les rayons */
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    var sol = S('circle', { cx: 50, cy: 70, r: 26, fill: '#f2c14e' }, g); T(g, 50, 116, 'Soleil', 'tag');
    var lune = S('circle', { cx: 190, cy: 60, r: 18, fill: '#d9dde2' }, g); var tl = T(g, 190, 96, 'Lune', 'tag');
    var oeil = S('g', {}, g); S('path', { d: 'M300 150 q22 -18 44 0 q-22 18 -44 0 z', fill: '#e9e9ea' }, oeil); S('circle', { cx: 322, cy: 150, r: 7, fill: '#3d6f96' }, oeil); T(oeil, 322, 182, 'œil', 'tag');
    var r1 = S('path', { d: 'M76 66 L170 60', stroke: '#f2c14e', 'stroke-width': 3 }, g), r2 = S('path', { d: 'M206 70 L300 145', stroke: '#f2c14e', 'stroke-width': 3 }, g);
    var ecran = S('rect', { x: 180, y: 110, width: 12, height: 80, rx: 2 }, g), te = T(g, 186, 204, '', 'tag');
    var r3 = S('path', { d: 'M76 80 L180 150', stroke: '#f2c14e', 'stroke-width': 3 }, g), r4 = S('path', { d: 'M192 152 L300 152', stroke: '#f2c14e', 'stroke-width': 3 }, g);
    g.set = function (mode, mat) { // mode : 'lune' ou 'ecran'
      var l = mode === 'lune';
      [lune, tl, r1, r2].forEach(function (x) { x.style.opacity = l ? 1 : 0; });
      [ecran, te, r3, r4].forEach(function (x) { x.style.opacity = l ? 0 : 1; });
      if (!l) { var m = MAT[mat]; ecran.setAttribute('fill', m[0] === 1 ? 'rgba(170,220,255,.35)' : m[0] > 0 ? 'rgba(240,240,240,.7)' : '#8a6a45'); te.textContent = mat; r4.style.opacity = m[0]; r4.style.strokeWidth = m[0] === 1 ? 3 : 6; return m; }
    };
    return g;
  }

  MV.lesson({
    id: '2ac-lumiere',
    objectif: {
      fr: 'Distinguer source primaire et objet diffusant, et classer les milieux en transparents, translucides et opaques.',
      ar: 'التمييز بين المنبع الضوئي الأولي والجسم المضاء، وتصنيف الأوساط إلى شفافة وشبه شفافة وغير شفافة.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'La Lune brille',
      hud: [['o', 'objet'], ['v', 'on le voit ?'], ['q', 'produit sa lumière ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'La nuit, la **Lune** brille dans le ciel.', hud: { o: ['Lune'], v: ['oui'], q: '–' }, run: function (e) { e.s.set('lune'); } },
        { cap: 'Pourtant, elle ne produit **aucune lumière**.', hud: { o: 'Lune', v: 'oui', q: ['non'] }, run: function (e) { e.s.set('lune'); } },
        { cap: 'Alors comment la voit-on ? On le saura à la fin.', hud: { o: 'Lune', v: 'oui', q: ['?'] }, run: function (e) { e.s.set('lune'); } }
      ]
    },

    prepare: [
      ['Une lampe allumée produit de la lumière.', true, 'C\'est une source de lumière.'],
      ['On voit un objet même dans le noir complet.', false, 'Sans lumière qui entre dans l\'œil, on ne voit rien.'],
      ['La lumière traverse une vitre.', true, 'Le verre est transparent.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Sources et milieux',
      hud: [['t', 'type'], ['x', 'exemple'], ['r', 'rôle']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Une **source primaire** produit sa propre lumière : Soleil, lampe, flamme.', ar: 'المنبع الضوئي الأولي ينتج ضوءه: الشمس، المصباح، اللهب.', hud: { t: ['source primaire'], x: 'Soleil, lampe', r: 'produit' }, run: function (e) { e.s.set('lune'); } },
        { cap: 'Un **objet diffusant** renvoie la lumière qu\'il reçoit : la Lune, un livre, un mur.', ar: 'الجسم المضاء ينشر الضوء الذي يتلقاه: القمر، كتاب، جدار.', hud: { t: ['objet diffusant'], x: 'Lune, livre', r: ['renvoie'] }, run: function (e) { e.s.set('lune'); } },
        { cap: 'On voit un objet quand sa lumière **entre dans l\'œil**.', ar: 'نرى جسما عندما يدخل ضوءه إلى العين.', hud: { t: 'vision', x: 'Lune → œil', r: ['entrer dans l\'œil'] }, run: function (e) { e.s.set('lune'); } },
        { cap: 'Le **verre** laisse passer la lumière : on voit nettement à travers. Il est **transparent**.', ar: 'الزجاج وسط شفاف.', hud: { t: ['transparent'], x: 'verre, eau, air', r: 'laisse passer' }, run: function (e) { e.s.set('ecran', 'verre'); } },
        { cap: 'Le **papier calque** laisse passer un peu de lumière, sans image nette : **translucide**.', ar: 'الورق الشفاف وسط شبه شفاف.', hud: { t: ['translucide'], x: 'calque, verre dépoli', r: 'un peu' }, run: function (e) { e.s.set('ecran', 'papier calque'); } },
        { cap: 'Le **carton** arrête la lumière : **opaque**.', ar: 'الورق المقوى وسط غير شفاف.', hud: { t: ['opaque'], x: 'carton, bois, mur', r: 'arrête' }, run: function (e) { e.s.set('ecran', 'carton'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Place chaque matériau devant la lumière.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Écran devant la lumière' }, st);
          var s = scene(svg), vu = {}, set = MV.hud(c, [['m', 'matériau'], ['t', 'milieu', 1]]), row = MV.H('div', 'row', '', c);
          Object.keys(MAT).forEach(function (k) { var b = MV.H('button', 'btn', k, row); b.onclick = function () { var m = s.set('ecran', k); set('m', k); set('t', m[1]); vu[k] = 1; if (Object.keys(vu).length === 3) done(); }; });
          s.set('ecran', 'verre'); set('m', 'verre'); set('t', 'transparent');
        } },
      { title: 'Résolvons ensemble', intro: 'Classe chaque objet.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Une bougie allumée est :', o: ['une source primaire', 'un objet diffusant'], a: 0 },
            { type: 'opt', q: 'Étape 2. Un tableau éclairé est :', o: ['un objet diffusant', 'une source primaire'], a: 0 },
            { type: 'opt', q: 'Étape 3. Une porte en bois est :', o: ['opaque', 'translucide'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le Soleil est :', o: ['une source primaire', 'un objet diffusant'], a: 0 },
      { lvl: 'Niveau 2', q: 'Un verre dépoli est :', o: ['translucide', 'opaque'], a: 0 },
      { lvl: 'Niveau 3', q: 'Pour voir un objet, il faut :', o: ['que sa lumière entre dans l\'œil', 'que l\'œil envoie de la lumière'], a: 0 },
      { lvl: 'Niveau 4', q: 'La lumière va à 300 000 km/s. La Lune est à 384 000 km. Durée du trajet arrondie à l\'unité (s) ?', a: 1, tol: 0.5 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Voir la Lune',
      hud: [['s', 'source'], ['l', 'Lune'], ['o', 'œil']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le **Soleil** éclaire la Lune.', hud: { s: ['Soleil'], l: 'éclairée', o: '–' }, run: function (e) { e.s.set('lune'); } },
        { cap: 'La Lune **diffuse** cette lumière vers notre **œil** : c\'est ainsi qu\'on la voit.', ar: 'القمر جسم مضاء ينشر ضوء الشمس نحو أعيننا.', hud: { s: 'Soleil', l: ['objet diffusant'], o: ['reçoit la lumière'] }, run: function (e) { e.s.set('lune'); } }
      ]
    },

    retenir: [
      'Une <b>source primaire</b> produit sa lumière ; un <b>objet diffusant</b> renvoie la lumière reçue. On voit un objet si sa lumière <b>entre dans l\'œil</b>.',
      'Un milieu est <b>transparent</b> (verre), <b>translucide</b> (papier calque) ou <b>opaque</b> (carton).'
    ],
    retenirAr: 'المنبع الأولي ينتج ضوءه، والجسم المضاء ينشر الضوء الذي يتلقاه. نرى جسما إذا دخل ضوءه إلى العين. الأوساط شفافة أو شبه شفافة أو غير شفافة.',
    voc: [['une source primaire', 'منبع ضوئي أولي'], ['un objet diffusant', 'جسم مضاء'], ['transparent', 'شفاف'], ['translucide', 'شبه شفاف'], ['opaque', 'غير شفاف']]
  });
})();
