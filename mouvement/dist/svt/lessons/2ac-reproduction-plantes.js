/* @meta {"id":"2ac-reproduction-plantes","level":"2","order":8,"theme":"Reproduction","title":"La reproduction des plantes à fleurs","ar":"التوالد عند النباتات الزهرية","lead":"À Tafraout, les amandiers fleurissent en février et donnent des amandes en été : on suit le pollen, de la fleur au fruit."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* fleur en coupe ; f = 0 fleur, 1 fruit */
  function fleur(svg, cx, cy) {
    var e = { g: S('g', { 'data-keep': 1 }, svg) }, g = e.g;
    e.pet = S('g', {}, g);
    S('path', { d: 'M' + (cx - 10) + ' ' + cy + ' C ' + (cx - 90) + ' ' + (cy - 30) + ', ' + (cx - 80) + ' ' + (cy - 110) + ', ' + (cx - 20) + ' ' + (cy - 70) + ' Z', fill: '#f6c6d3' }, e.pet);
    S('path', { d: 'M' + (cx + 10) + ' ' + cy + ' C ' + (cx + 90) + ' ' + (cy - 30) + ', ' + (cx + 80) + ' ' + (cy - 110) + ', ' + (cx + 20) + ' ' + (cy - 70) + ' Z', fill: '#f6c6d3' }, e.pet);
    e.sep = S('path', { d: 'M' + (cx - 30) + ' ' + (cy + 4) + ' q30 20 60 0', fill: '#5fae5a' }, g);
    e.eta = S('g', {}, g);
    [-28, 28].forEach(function (dx) { S('line', { x1: cx + dx * 0.5, y1: cy - 4, x2: cx + dx, y2: cy - 70, stroke: '#e9e9ea', 'stroke-width': 2.5 }, e.eta); S('ellipse', { cx: cx + dx, cy: cy - 74, rx: 7, ry: 5, fill: '#f2c14e' }, e.eta); });
    e.pis = S('g', {}, g);
    e.ova = S('ellipse', { cx: cx, cy: cy - 12, rx: 13, ry: 14, fill: '#8fd07f' }, e.pis); e.ova.style.transition = 'all 1.2s';
    e.sty = S('line', { x1: cx, y1: cy - 26, x2: cx, y2: cy - 86, stroke: '#8fd07f', 'stroke-width': 4 }, e.pis);
    S('circle', { cx: cx, cy: cy - 88, r: 5, fill: '#8fd07f' }, e.pis);
    e.ovu = S('circle', { cx: cx, cy: cy - 12, r: 4, fill: '#fff' }, e.pis); e.ovu.style.transition = 'all 1.2s';
    e.pol = S('circle', { cx: cx + 28, cy: cy - 74, r: 4, fill: '#f2c14e', stroke: '#141517' }, g); e.pol.style.transition = 'all 1.2s';
    e.tube = S('line', { x1: cx, y1: cy - 86, x2: cx, y2: cy - 86, stroke: '#f2c14e', 'stroke-width': 2 }, g); e.tube.style.transition = 'all 1.2s';
    e.set = function (st) {
      // st : 'fleur', 'pollen', 'germe', 'fruit'
      e.pet.style.opacity = st === 'fruit' ? 0 : 1; e.eta.style.opacity = st === 'fruit' ? 0 : 1; e.sty.style.opacity = st === 'fruit' ? 0 : 1;
      e.pol.setAttribute('cx', st === 'fleur' ? cx + 28 : cx); e.pol.setAttribute('cy', st === 'fleur' ? cy - 74 : cy - 92); e.pol.style.opacity = st === 'fruit' ? 0 : 1;
      e.tube.setAttribute('y2', st === 'germe' ? cy - 14 : cy - 86); e.tube.style.opacity = st === 'germe' ? 1 : 0;
      e.ova.setAttribute('rx', st === 'fruit' ? 46 : 13); e.ova.setAttribute('ry', st === 'fruit' ? 34 : 14); e.ova.setAttribute('cy', st === 'fruit' ? cy - 30 : cy - 12);
      e.ova.setAttribute('fill', st === 'fruit' ? '#9ab973' : '#8fd07f');
      e.ovu.setAttribute('r', st === 'fruit' ? 14 : 4); e.ovu.setAttribute('cy', st === 'fruit' ? cy - 30 : cy - 12); e.ovu.setAttribute('fill', st === 'fruit' ? '#c9a35a' : '#fff');
    };
    e.set('fleur');
    return e;
  }

  MV.lesson({
    id: '2ac-reproduction-plantes',
    objectif: {
      fr: 'Nommer les organes de la fleur et décrire la pollinisation, la fécondation et la formation du fruit et de la graine.',
      ar: 'تسمية أعضاء الزهرة ووصف التأبير والإخصاب وتكون الثمرة والبذرة.'
    },

    prerequis: {
      fr: 'Parties d\'une fleur ; besoins des plantes vertes.',
      ar: 'أجزاء الزهرة وحاجيات النباتات الخضراء.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'Amandier en fleur',
      hud: [['m', 'février'], ['e', 'été'], ['q', 'comment ?']],
      draw: function (svg) { var e = fleur(svg, 180, 190); return { ctl: e }; },
      steps: [
        { cap: 'En février, les **amandiers** de Tafraout se couvrent de fleurs.', hud: { m: ['fleurs'], e: '–', q: '–' }, run: function (e) { e.ctl.set('fleur'); } },
        { cap: 'En été, à la place des fleurs, on récolte des **amandes**.', hud: { m: 'fleurs', e: ['amandes'], q: '–' }, run: function (e) { e.ctl.set('fruit'); } },
        { cap: 'Comment une fleur devient-elle un **fruit** ? On le saura à la fin.', hud: { m: 'fleurs', e: 'amandes', q: ['?'] }, run: function (e) { e.ctl.set('fleur'); } }
      ]
    },

    predire: {
      q: "En février, les amandiers sont en fleurs. En été, on récolte des amandes. Comment une fleur devient-elle un fruit ?",
      ar: "في فبراير تتفتح أزهار اللوز، وفي الصيف نجني اللوز. كيف تصير الزهرة ثمرة؟",
      o: ["Les pétales grossissent et deviennent le fruit", "Après la pollinisation et la fécondation, l'ovaire devient le fruit", "Le fruit pousse à côté de la fleur, sur une autre branche"],
      a: 1,
      e: "Le pollen doit arriver sur le pistil : c'est la pollinisation, faite par les insectes ou le vent. Après la fécondation, l'ovaire devient le fruit et l'ovule devient la graine.",
      ear: "ينتقل غبار الطلع إلى المدقّة (التلقيح)، وبعد الإخصاب يصير المبيض ثمرة وتصير البويضة بذرة."
    },

    prepare: [
      ['Une graine peut donner une nouvelle plante.', true, 'Elle germe dans de bonnes conditions.'],
      ['Toutes les fleurs deviennent des fruits.', false, 'Seules les fleurs fécondées donnent des fruits.'],
      ['Les abeilles visitent les fleurs.', true, 'Elles y cherchent du nectar et transportent du pollen.']
    ],

    regarde: {
      vb: '0 0 360 220', label: 'De la fleur au fruit',
      hud: [['o', 'organe'], ['p', 'phénomène'], ['r', 'résultat']],
      draw: function (svg) { var e = fleur(svg, 180, 200); return { ctl: e }; },
      steps: [
        { cap: 'Une fleur : sépales, pétales, **étamines** (organes mâles) et **pistil** (organe femelle).', ar: 'الزهرة: سبلات وبتلات وأسدية (أعضاء ذكرية) ومدقة (عضو أنثوي).', hud: { o: ['étamines + pistil'], p: '–', r: '–' }, run: function (e) { e.ctl.set('fleur'); } },
        { cap: 'Les étamines produisent le **pollen**. L\'ovaire du pistil contient des **ovules**.', ar: 'تنتج الأسدية حبوب اللقاح، ويحتوي مبيض المدقة على البويضات.', hud: { o: ['pollen, ovules'], p: '–', r: '–' }, run: function (e) { e.ctl.set('fleur'); } },
        { cap: 'Le pollen est transporté sur le pistil par les insectes ou le vent : la **pollinisation**.', ar: 'تنقل الحشرات أو الرياح حبوب اللقاح إلى المدقة: هذا هو التأبير.', hud: { o: 'pistil', p: ['pollinisation'], r: '–' }, run: function (e) { e.ctl.set('pollen'); } },
        { cap: 'Le pollen germe et rejoint l\'ovule : c\'est la **fécondation**.', ar: 'تنتش حبة اللقاح وتصل إلى البويضة: هذا هو الإخصاب.', hud: { o: 'ovule', p: ['fécondation'], r: '–' }, run: function (e) { e.ctl.set('germe'); } },
        { cap: 'Puis l\'ovaire devient le **fruit**, et l\'ovule devient la **graine**.', ar: 'ثم يتحول المبيض إلى ثمرة، والبويضة إلى بذرة.', hud: { o: 'ovaire → fruit', p: '–', r: ['fruit + graine'] }, run: function (e) { e.ctl.set('fruit'); } },
        { cap: 'La graine semée germe et donne une **nouvelle plante**.', ar: 'تنتش البذرة فتعطي نباتا جديدا.', hud: { o: 'graine', p: ['germination'], r: ['nouvelle plante'] }, run: function (e) { e.ctl.set('fruit'); } }
      ]
    },

    faisons: [
      { title: 'De la fleur au fruit', intro: 'Avance étape par étape.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 220', role: 'img', 'aria-label': 'Fleur qui devient fruit' }, st);
          var f = fleur(svg, 180, 200), set = MV.hud(c, [['e', 'étape'], ['x', 'ce qui se passe', 1]]);
          var ST = [['fleur', 'fleur', 'la fleur s\'ouvre'], ['pollen', 'pollinisation', 'le pollen arrive sur le pistil'], ['germe', 'fécondation', 'le tube pollinique atteint l\'ovule'], ['fruit', 'fruit', 'l\'ovaire grossit']];
          MV.slider(c, { label: 'étape', min: 0, max: 3, value: 0, fmt: function (v) { return ST[v][1]; } }, function (v) { f.set(ST[v][0]); set('e', ST[v][1]); set('x', ST[v][2]); if (v === 3) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'On enferme des fleurs de pommier dans un sac fin avant leur ouverture. Elles ne donnent pas de fruits.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Le sac empêche :', o: ['la lumière d\'arriver', 'les insectes d\'apporter le pollen'], a: 1, e: 'Le sac laisse passer la lumière.' },
            { type: 'opt', q: 'Étape 2. Sans pollen, pas de :', o: ['fécondation', 'pétales'], a: 0 },
            { type: 'opt', q: 'Étape 3. Conclusion : pour former un fruit, il faut :', o: ['la pollinisation puis la fécondation', 'seulement de l\'eau'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'L\'organe mâle de la fleur est :', o: ['le pistil', 'l\'étamine', 'le pétale'], a: 1 },
      { lvl: 'Niveau 2', q: 'Le transport du pollen jusqu\'au pistil s\'appelle :', o: ['la fécondation', 'la pollinisation', 'la germination'], a: 1 },
      { lvl: 'Niveau 3', q: 'Après la fécondation, l\'ovaire devient :', o: ['la graine', 'le fruit', 'la fleur'], a: 1 },
      { lvl: 'Niveau 4', q: 'Pourquoi des pesticides qui tuent les abeilles peuvent réduire la récolte d\'amandes ?', o: ['Les abeilles assurent la pollinisation.', 'Les abeilles mangent les amandes.'], a: 0 }
    ],

    bilan: {
      vb: '0 0 360 220', label: 'L\'amande',
      hud: [['f', 'fleur'], ['t', 'transformation'], ['a', 'amande']],
      draw: function (svg) { var e = fleur(svg, 180, 200); return { ctl: e }; },
      steps: [
        { cap: 'Les abeilles **pollinisent** les fleurs d\'amandier.', hud: { f: ['pollinisée'], t: '–', a: '–' }, run: function (e) { e.ctl.set('pollen'); } },
        { cap: 'Après la fécondation, l\'ovaire devient le fruit ; l\'**amande** que l\'on mange est la graine.', ar: 'بعد الإخصاب يصبح المبيض ثمرة، واللوز الذي نأكله هو البذرة.', hud: { f: 'fécondée', t: ['ovaire → fruit'], a: ['graine'] }, run: function (e) { e.ctl.set('fruit'); } }
      ]
    },

    retenir: [
      'La fleur porte des <b>étamines</b> (pollen) et un <b>pistil</b> (ovaire et ovules). La <b>pollinisation</b> est le transport du pollen sur le pistil, par les insectes ou le vent.',
      'Après la <b>fécondation</b>, l\'ovaire devient le <b>fruit</b> et l\'ovule devient la <b>graine</b>, qui peut germer et donner une nouvelle plante.'
    ],
    retenirAr: 'تحمل الزهرة أسدية تنتج حبوب اللقاح ومدقة تحتوي على مبيض وبويضات. التأبير هو نقل حبوب اللقاح إلى المدقة. بعد الإخصاب يتحول المبيض إلى ثمرة والبويضة إلى بذرة.',
    voc: [['l\'étamine', 'السداة'], ['le pistil', 'المدقة'], ['le pollen', 'حبوب اللقاح'], ['la pollinisation', 'التأبير'], ['l\'ovaire', 'المبيض'], ['la graine', 'البذرة']]
  });
})();
