/* @meta {"id":"3ac-materiaux","level":"3","order":1,"theme":"Les matériaux","title":"Les matériaux de la vie quotidienne","ar":"المواد في حياتنا اليومية","lead":"Au centre de tri, un aimant sépare les canettes en fer des canettes en aluminium : on identifie les matériaux par des tests simples."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  // objets : nom, matériau, famille, attiré par l'aimant, conduit le courant, couleur
  var OBJ = [
    ['canette de sardines', 'fer (acier)', 'métal', true, true, '#9aa0a8'],
    ['canette de soda', 'aluminium', 'métal', false, true, '#d8dce2'],
    ['fil électrique (âme)', 'cuivre', 'métal', false, true, '#c87533'],
    ['bouteille d\'eau', 'plastique', 'matière plastique', false, false, '#7fb2ff'],
    ['bocal', 'verre', 'verre', false, false, '#a8e0d0']
  ];

  function tapis(svg) {
    var e = {}, y = 190;
    S('rect', { x: 10, y: y, width: 340, height: 14, rx: 7, fill: '#3a3d42' }, svg);
    e.aimant = S('g', {}, svg);
    S('path', { d: 'M150 70 v40 a30 30 0 0 0 60 0 v-40 h-18 v40 a12 12 0 0 1 -24 0 v-40 z', fill: '#e5484d' }, e.aimant);
    S('rect', { x: 150, y: 70, width: 18, height: 14, fill: '#cfd3d8' }, e.aimant); S('rect', { x: 192, y: 70, width: 18, height: 14, fill: '#cfd3d8' }, e.aimant);
    T(e.aimant, 180, 60, 'aimant', 'tag');
    e.cans = [];
    for (var i = 0; i < 4; i++) {
      var fer = i % 2 === 0, g = S('g', {}, svg);
      S('rect', { x: -12, y: -30, width: 24, height: 30, rx: 4, fill: fer ? '#9aa0a8' : '#e9e9ea', stroke: '#141517' }, g);
      T(g, 0, -10, fer ? 'Fe' : 'Al', 'tag').style.fill = '#141517';
      g.style.transition = 'transform 1.2s ease-in-out';
      g.fer = fer; e.cans.push(g);
    }
    e.place = function (st) { e.cans.forEach(function (g, i) { var x = st === 0 ? 40 + i * 30 : st === 1 ? 160 + i * 14 : (g.fer ? 180 : 290 + i * 10), y = (st === 2 && g.fer) ? 140 : 190; g.style.transform = 'translate(' + x + 'px,' + y + 'px)'; }); };
    e.place(0);
    return e;
  }

  MV.lesson({
    id: '3ac-materiaux',
    objectif: {
      fr: 'Reconnaître les grandes familles de matériaux et identifier quelques métaux par des tests simples.',
      ar: 'التعرف على أصناف المواد الكبرى وتمييز بعض الفلزات بتجارب بسيطة.'
    },

    ouverture: {
      vb: '0 0 360 240', label: 'Un tapis de tri',
      hud: [['o', 'objets'], ['t', 'tri'], ['q', 'comment ?']],
      draw: function (svg) { var e = tapis(svg); return { aimant: e.aimant, ctl: e }; },
      steps: [
        { cap: 'Au centre de tri, des **canettes** arrivent mélangées.', hud: { o: ['canettes'], t: '–', q: '–' }, run: function (e) { e.ctl.place(0); } },
        { cap: 'Certaines sont en **fer**, d\'autres en **aluminium**. Elles se ressemblent.', hud: { o: 'fer et aluminium', t: '–', q: '–' }, run: function (e) { e.ctl.place(1); } },
        { cap: 'Comment les **séparer** vite pour les recycler ? On le saura à la fin.', on: ['aimant'], hud: { o: 'fer et aluminium', t: ['?'], q: ['?'] }, run: function (e) { e.ctl.place(1); } }
      ]
    },

    predire: {
      q: "Au centre de tri, des canettes en fer et en aluminium arrivent mélangées. Comment les séparer vite ?",
      ar: "في مركز الفرز تصل علب معدنية من الحديد والألومنيوم مختلطة. كيف نفصلها بسرعة؟",
      o: ["En les lavant à l'eau", "Avec un aimant : seul le fer est attiré", "En les regardant de près"],
      a: 1,
      e: "Seul le fer, et l'acier, est attiré par un aimant. Un aimant sépare donc très vite les canettes en fer de celles en aluminium.",
      ear: "الحديد والفولاذ وحدهما ينجذبان إلى المغناطيس، فيفصل المغناطيس العلب الحديدية عن علب الألومنيوم."
    },

    prepare: [
      ['Une casserole en métal conduit la chaleur.', true, 'C\'est pour cela que son manche est souvent en bois ou en plastique.'],
      ['Tous les métaux sont attirés par un aimant.', false, 'Seuls quelques-uns, comme le fer. L\'aluminium et le cuivre ne le sont pas.'],
      ['Le verre laisse passer le courant électrique.', false, 'Le verre est un isolant électrique.']
    ],

    regarde: {
      vb: '0 0 360 260', label: 'Familles de matériaux et tests',
      hud: [['m', 'matériau'], ['a', 'aimant'], ['c', 'courant']],
      draw: function (svg) {
        var e = {};
        e.fam = S('g', {}, svg);
        [['métaux', '#9aa0a8', 'fer, aluminium, cuivre'], ['plastiques', '#7fb2ff', 'bouteilles, sacs'], ['verre', '#a8e0d0', 'bocaux, vitres'], ['naturels', '#c9a35a', 'bois, papier, coton']].forEach(function (f, i) {
          S('rect', { x: 20 + (i % 2) * 170, y: 20 + Math.floor(i / 2) * 90, width: 150, height: 74, rx: 10, fill: '#17181a', stroke: f[1], 'stroke-width': 2 }, e.fam);
          T(e.fam, 95 + (i % 2) * 170, 52 + Math.floor(i / 2) * 90, f[0], 'lbl'); T(e.fam, 95 + (i % 2) * 170, 74 + Math.floor(i / 2) * 90, f[2], 'tag');
        });
        e.obj = S('rect', { x: 160, y: 150, width: 40, height: 50, rx: 6, fill: '#9aa0a8', stroke: '#141517' }, svg);
        e.mag = S('path', { d: 'M150 40 v40 a30 30 0 0 0 60 0 v-40 h-18 v40 a12 12 0 0 1 -24 0 v-40 z', fill: '#e5484d' }, svg);
        e.mag.style.transition = 'transform .8s';
        e.circ = S('g', {}, svg);
        S('path', { d: 'M60 175 H160 M200 175 H300 V120 H60 V175', fill: 'none', stroke: '#cfd3d8', 'stroke-width': 3 }, e.circ);
        S('rect', { x: 50, y: 130, width: 20, height: 34, fill: '#6b6f76' }, e.circ); T(e.circ, 60, 190, 'pile', 'tag');
        e.lamp = S('circle', { cx: 180, cy: 120, r: 13, fill: '#3a3d42', stroke: '#cfd3d8', 'stroke-width': 2, 'data-keep': 1 }, e.circ);
        e.set = function (col, attire, conduit) { e.obj.setAttribute('fill', col); e.mag.style.transform = attire ? 'translate(0px,55px)' : 'none'; e.lamp.setAttribute('fill', conduit ? '#f2c14e' : '#3a3d42'); };
        return e;
      },
      steps: [
        { cap: 'Les objets sont faits de **matériaux** : métaux, plastiques, verre, matériaux naturels…', ar: 'تصنع الأشياء من مواد: فلزات، بلاستيك، زجاج، مواد طبيعية.', on: ['fam'], hud: { m: '–', a: '–', c: '–' } },
        { cap: 'Test 1 : l\'**aimant**. Une boîte en fer est attirée.', ar: 'التجربة الأولى: المغناطيس يجذب الحديد.', on: ['obj', 'mag'], hud: { m: ['fer'], a: ['attiré'], c: '–' }, run: function (e) { e.set('#9aa0a8', true, false); } },
        { cap: 'Une canette en **aluminium** n\'est pas attirée.', ar: 'الألومنيوم لا ينجذب إلى المغناطيس.', on: ['obj', 'mag'], hud: { m: ['aluminium'], a: ['non'], c: '–' }, run: function (e) { e.set('#d8dce2', false, false); } },
        { cap: 'Test 2 : le **circuit**. Les métaux conduisent le courant : la lampe brille.', ar: 'التجربة الثانية: الفلزات موصلة للتيار الكهربائي فيضيء المصباح.', on: ['obj', 'circ'], hud: { m: 'aluminium', a: 'non', c: ['conduit'] }, run: function (e) { e.set('#d8dce2', false, true); } },
        { cap: 'Le plastique et le verre **ne conduisent pas** : ce sont des isolants.', ar: 'البلاستيك والزجاج عازلان.', on: ['obj', 'circ'], hud: { m: ['plastique'], a: 'non', c: ['isolant'] }, run: function (e) { e.set('#7fb2ff', false, false); } },
        { cap: 'Le **cuivre** se reconnaît à sa couleur rouge-orangé ; il conduit très bien.', ar: 'يعرف النحاس بلونه الأحمر البرتقالي، وهو موصل جيد.', on: ['obj', 'circ'], hud: { m: ['cuivre'], a: 'non', c: ['conduit'] }, run: function (e) { e.set('#c87533', false, true); } }
      ]
    },

    faisons: [
      { title: 'Le banc d\'essai', intro: 'Choisis un objet, puis fais les deux tests.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 120', role: 'img', 'aria-label': 'Objet testé' }, st);
          var ob = S('rect', { x: 150, y: 30, width: 60, height: 70, rx: 8, fill: '#3a3d42' }, svg), lab = T(svg, 180, 20, '', 'tag');
          var set = MV.hud(c, [['o', 'objet'], ['a', 'aimant', 1], ['c', 'courant', 1], ['m', 'matériau', 1]]), cur = null;
          var r1 = MV.H('div', 'row', '', c), r2 = MV.H('div', 'row', '', c);
          var fa = false, fc = false, seen = {};
          OBJ.forEach(function (o) { var b = MV.H('button', 'btn', o[0], r1); b.onclick = function () { cur = o; fa = fc = false; ob.setAttribute('fill', o[5]); lab.textContent = o[0]; set('o', o[0]); set('a', '?'); set('c', '?'); set('m', '?'); }; });
          function check() { if (fa && fc) { set('m', cur[1]); seen[cur[0]] = 1; if (Object.keys(seen).length >= 3) done(); } }
          MV.H('button', 'btn pri', 'Test aimant', r2).onclick = function () { if (!cur) return; set('a', cur[3] ? 'attiré' : 'non attiré'); fa = true; check(); };
          MV.H('button', 'btn pri', 'Test courant', r2).onclick = function () { if (!cur) return; set('c', cur[4] ? 'conduit' : 'isolant'); fc = true; check(); };
          MV.H('p', 'small', 'Identifie au moins trois objets.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Une plaque grise conduit le courant mais n\'est pas attirée par l\'aimant.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Elle conduit le courant. C\'est donc :', o: ['un métal', 'du plastique', 'du verre'], a: 0, e: 'Parmi ces matériaux, seuls les métaux conduisent.' },
            { type: 'opt', q: 'Étape 2. Elle n\'est pas attirée par l\'aimant. Ce n\'est donc pas :', o: ['du fer', 'de l\'aluminium'], a: 0, e: 'Le fer serait attiré.' },
            { type: 'opt', q: 'Étape 3. Elle est grise. C\'est probablement :', o: ['du cuivre', 'de l\'aluminium'], a: 1, e: 'Le cuivre est rouge-orangé.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Lequel est attiré par un aimant ?', o: ['le fer', 'le cuivre', 'l\'aluminium'], a: 0, e: 'Le fer et l\'acier.' },
      { lvl: 'Niveau 2', q: 'Une bouteille d\'eau minérale est généralement en :', o: ['métal', 'matière plastique', 'verre ou plastique, selon la bouteille'], a: 2, e: 'Les deux existent : on reconnaît le plastique à sa légèreté et sa souplesse.' },
      { lvl: 'Niveau 3', q: 'Pourquoi les fils électriques sont-ils en cuivre entouré de plastique ?', o: ['Le cuivre conduit, le plastique isole.', 'Le plastique conduit, le cuivre isole.', 'Pour la couleur.'], a: 0, e: 'Le courant passe dans le cuivre ; le plastique protège.' },
      { lvl: 'Niveau 4', q: 'Un objet n\'est pas attiré par l\'aimant et ne conduit pas le courant. Il peut être en :', o: ['fer', 'aluminium', 'verre'], a: 2, e: 'Les deux métaux conduisent le courant.' }
    ],

    bilan: {
      vb: '0 0 360 240', label: 'Le tri par aimant',
      hud: [['f', 'fer'], ['a', 'aluminium'], ['r', 'recyclage']],
      draw: function (svg) { var e = tapis(svg); return { aimant: e.aimant, ctl: e }; },
      steps: [
        { cap: 'Un gros **aimant** passe au-dessus du tapis.', on: ['aimant'], hud: { f: '–', a: '–', r: '–' }, run: function (e) { e.ctl.place(1); } },
        { cap: 'Les canettes en **fer** sont attirées, l\'aluminium continue.', ar: 'المغناطيس يجذب علب الحديد، وتمر علب الألومنيوم.', on: ['aimant'], hud: { f: ['attiré'], a: ['continue'], r: '–' }, run: function (e) { e.ctl.place(2); } },
        { cap: 'Chaque métal est **recyclé** séparément : on économise matière et énergie.', ar: 'يعاد تدوير كل فلز على حدة، فنقتصد في المادة والطاقة.', on: ['aimant'], hud: { f: 'attiré', a: 'continue', r: ['séparé'] }, run: function (e) { e.ctl.place(2); } }
      ]
    },

    retenir: [
      'Les objets sont fabriqués avec différents <b>matériaux</b> : métaux, matières plastiques, verre, matériaux naturels (bois, papier…).',
      'Les <b>métaux</b> conduisent le courant électrique ; seul le <b>fer</b> (et l\'acier) est attiré par un aimant parmi le fer, l\'aluminium et le cuivre. Le plastique et le verre sont des <b>isolants</b>.'
    ],
    retenirAr: 'تصنع الأشياء من مواد مختلفة: فلزات وبلاستيك وزجاج ومواد طبيعية. الفلزات موصلة للتيار الكهربائي، والحديد وحده من بين الحديد والألومنيوم والنحاس ينجذب إلى المغناطيس. البلاستيك والزجاج عازلان.',
    voc: [['un matériau', 'مادة'], ['un métal', 'فلز'], ['le fer', 'الحديد'], ['l\'aluminium', 'الألومنيوم'], ['le cuivre', 'النحاس'], ['un isolant', 'عازل'], ['recycler', 'يعيد التدوير']]
  });
})();
