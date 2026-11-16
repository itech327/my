/* @meta {"id":"2ac-couleurs","level":"2","order":8,"theme":"La lumière","title":"Lumière et couleurs","ar":"الضوء والألوان","lead":"Après la pluie, un arc-en-ciel. La lumière du Soleil, qui paraît blanche, cache donc des couleurs. Et une pomme rouge peut paraître noire !"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var SPEC = ['#e5484d', '#f28c28', '#f2d14e', '#56d07f', '#3d8fd6', '#4b4fd1', '#8b4fd1'];
  var FILT = { blanche: 'rgba(255,255,255,.9)', rouge: '#e5484d', verte: '#56d07f', bleue: '#3d8fd6' };

  /* prisme et spectre */
  function prisme(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), sp = S('g', {}, g);
    S('line', { x1: 20, y1: 110, x2: 140, y2: 100, stroke: '#fff', 'stroke-width': 5 }, g); T(g, 60, 92, 'lumière blanche', 'tag');
    S('path', { d: 'M140 50 L200 160 H80 Z', fill: 'rgba(170,220,255,.25)', stroke: '#e9e9ea', 'stroke-width': 2 }, g); T(g, 140, 180, 'prisme', 'tag');
    SPEC.forEach(function (c, i) { S('line', { x1: 160, y1: 104, x2: 340, y2: 60 + i * 16, stroke: c, 'stroke-width': 5 }, sp); });
    g.set = function (on) { sp.style.opacity = on ? 1 : 0; };
    return g;
  }
  /* lampe, filtre, pomme rouge */
  function pomme(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('circle', { cx: 40, cy: 100, r: 18, fill: '#f2f2f2' }, g); T(g, 40, 136, 'lampe', 'tag');
    var f1 = S('line', { x1: 60, y1: 100, x2: 140, y2: 100, stroke: '#fff', 'stroke-width': 8 }, g);
    var fi = S('rect', { x: 140, y: 60, width: 14, height: 80, rx: 3 }, g), tf = T(g, 147, 156, '', 'tag');
    var f2 = S('line', { x1: 156, y1: 100, x2: 240, y2: 100, 'stroke-width': 8 }, g);
    var ap = S('circle', { cx: 280, cy: 100, r: 30 }, g); S('path', { d: 'M280 70 q4 -12 12 -14', stroke: '#6b5a4a', 'stroke-width': 3, fill: 'none' }, g); T(g, 280, 150, 'pomme rouge', 'tag');
    g.set = function (f) {
      fi.setAttribute('fill', f === 'blanche' ? 'rgba(255,255,255,.1)' : FILT[f]); fi.style.opacity = f === 'blanche' ? 0.3 : 0.85; tf.textContent = f === 'blanche' ? 'sans filtre' : 'filtre ' + f;
      f2.setAttribute('stroke', FILT[f]);
      var vis = f === 'blanche' || f === 'rouge'; ap.setAttribute('fill', vis ? '#d93a3a' : '#151515'); ap.setAttribute('stroke', vis ? '#141517' : '#444');
      return vis ? 'rouge' : 'noire';
    };
    return g;
  }

  MV.lesson({
    id: '2ac-couleurs',
    objectif: {
      fr: 'Savoir que la lumière blanche est composée de lumières colorées, expliquer le rôle d\'un filtre et la couleur d\'un objet.',
      ar: 'معرفة أن الضوء الأبيض مكون من أضواء ملونة، وتفسير دور المرشح ولون الجسم.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'L\'arc-en-ciel',
      hud: [['l', 'lumière du Soleil'], ['a', 'arc-en-ciel'], ['q', 'd\'où viennent les couleurs ?']],
      draw: function (svg) { var e = {}; e.p = prisme(svg); return e; },
      steps: [
        { cap: 'La lumière du Soleil paraît **blanche**.', hud: { l: ['blanche'], a: '–', q: '–' }, run: function (e) { e.p.set(0); } },
        { cap: 'Après la pluie, elle traverse des gouttes d\'eau : un **arc-en-ciel** apparaît.', hud: { l: 'blanche', a: ['7 couleurs'], q: '–' }, run: function (e) { e.p.set(1); } },
        { cap: 'D\'où viennent ces couleurs ? On le saura à la fin.', hud: { l: 'blanche', a: '7 couleurs', q: ['?'] }, run: function (e) { e.p.set(1); } }
      ]
    },

    prepare: [
      ['La lumière blanche est faite d\'une seule couleur.', false, 'Elle contient toutes les couleurs de l\'arc-en-ciel.'],
      ['Un vitrail coloré ne laisse passer qu\'une partie de la lumière.', true, 'Il agit comme un filtre.'],
      ['Dans le noir complet, on voit encore la couleur des objets.', false, 'Sans lumière, on ne voit rien.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'Décomposer la lumière',
      hud: [['e', 'expérience'], ['o', 'observation'], ['c', 'conclusion']],
      draw: function (svg) { var e = {}; e.p = prisme(svg); return e; },
      steps: [
        { cap: 'Un **prisme** dévie la lumière blanche et la **décompose**.', ar: 'الموشور يحرف الضوء الأبيض ويحلله.', hud: { e: ['prisme'], o: '–', c: '–' }, run: function (e) { e.p.set(0); } },
        { cap: 'On obtient un **spectre** : du rouge au violet, comme l\'arc-en-ciel.', ar: 'نحصل على طيف من الأحمر إلى البنفسجي.', hud: { e: 'prisme', o: ['spectre'], c: '–' }, run: function (e) { e.p.set(1); } },
        { cap: 'La lumière blanche est un **mélange de lumières colorées**. Les gouttes de pluie agissent comme des prismes.', ar: 'الضوء الأبيض خليط من أضواء ملونة، وقطرات المطر تلعب دور الموشور.', hud: { e: 'prisme', o: 'spectre', c: ['mélange de couleurs'] }, run: function (e) { e.p.set(1); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Éclaire la pomme rouge à travers différents filtres.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Filtre et pomme' }, st);
          var p = pomme(svg), vu = {}, set = MV.hud(c, [['f', 'lumière reçue'], ['a', 'la pomme paraît', 1]]), row = MV.H('div', 'row', '', c);
          ['blanche', 'rouge', 'verte', 'bleue'].forEach(function (f) { var b = MV.H('button', 'btn', 'Lumière ' + f, row); b.onclick = function () { var r = p.set(f); set('f', f); set('a', r); vu[f] = 1; if (Object.keys(vu).length === 4) done(); }; });
          p.set('blanche'); set('f', 'blanche'); set('a', 'rouge');
          MV.H('p', 'small', 'Essaie les quatre lumières.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Un filtre vert est éclairé en lumière blanche.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Le filtre vert laisse passer :', o: ['surtout la lumière verte', 'toutes les couleurs'], a: 0 },
            { type: 'opt', q: 'Étape 2. Une feuille blanche éclairée en vert paraît :', o: ['verte', 'blanche'], a: 0, e: 'Un objet blanc diffuse toutes les couleurs qu\'il reçoit.' },
            { type: 'opt', q: 'Étape 3. Une pomme rouge éclairée en vert paraît :', o: ['noire', 'rouge'], a: 0, e: 'Elle ne diffuse que le rouge, absent ici.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'L\'instrument qui décompose la lumière blanche :', o: ['le prisme', 'le miroir'], a: 0 },
      { lvl: 'Niveau 2', q: 'Un objet rouge éclairé en lumière blanche paraît :', o: ['rouge', 'noir'], a: 0 },
      { lvl: 'Niveau 3', q: 'Un objet rouge éclairé en lumière bleue paraît :', o: ['noir', 'bleu'], a: 0 },
      { lvl: 'Niveau 4', q: 'Combien de couleurs distingue-t-on traditionnellement dans l\'arc-en-ciel ?', a: 7 }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'Les couleurs de la lumière',
      hud: [['a', 'arc-en-ciel'], ['o', 'couleur d\'un objet'], ['r', 'règle']],
      draw: function (svg) { var e = {}; e.p = prisme(svg); return e; },
      steps: [
        { cap: 'Les gouttes de pluie **décomposent** la lumière blanche : l\'arc-en-ciel.', hud: { a: ['décomposition'], o: '–', r: '–' }, run: function (e) { e.p.set(1); } },
        { cap: 'Un objet n\'a de couleur que s\'il **reçoit** cette couleur : la pomme rouge paraît **noire** en lumière verte.', ar: 'قطرات المطر تحلل الضوء الأبيض، ولون الجسم هو لون الضوء الذي ينشره.', hud: { a: 'décomposition', o: ['lumière diffusée'], r: ['sans lumière rouge : noire'] }, run: function (e) { e.p.set(1); } }
      ]
    },

    retenir: [
      'La lumière <b>blanche</b> est un mélange de lumières colorées ; un <b>prisme</b> la décompose en un <b>spectre</b>, du rouge au violet.',
      'Un <b>filtre</b> coloré ne laisse passer que sa couleur. Un objet diffuse sa couleur s\'il la reçoit ; sinon il paraît <b>noir</b>.'
    ],
    retenirAr: 'الضوء الأبيض خليط من أضواء ملونة، والموشور يحلله إلى طيف من الأحمر إلى البنفسجي. المرشح الملون لا يمرر إلا لونه، والجسم ينشر لونه إذا تلقاه وإلا ظهر أسود.',
    voc: [['un prisme', 'موشور'], ['le spectre', 'الطيف'], ['un filtre', 'مرشح'], ['décomposer', 'يحلل'], ['diffuser', 'ينشر']]
  });
})();
