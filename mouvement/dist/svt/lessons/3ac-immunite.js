/* @meta {"id":"3ac-immunite","level":"3","order":5,"theme":"Santé","title":"L'immunité","ar":"المناعة","lead":"Une écharde dans le doigt : la peau rougit et gonfle, puis guérit. On suit les défenses du corps, jusqu'à la vaccination."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* phagocytose : un globule blanc qui englobe des microbes */
  function phago(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), m = [];
    var gb = S('circle', { cx: 80, cy: 120, r: 30, fill: 'rgba(233,233,234,.25)', stroke: '#e9e9ea', 'stroke-width': 2 }, g); gb.style.transition = 'all 1.2s';
    var noy = S('ellipse', { cx: 80, cy: 120, rx: 12, ry: 8, fill: '#7f6fd1' }, g); noy.style.transition = 'all 1.2s';
    for (var i = 0; i < 4; i++) { var b = S('rect', { x: 220 + (i % 2) * 30, y: 90 + Math.floor(i / 2) * 40, width: 16, height: 9, rx: 4, fill: '#5fae5a' }, g); b.style.transition = 'all 1.2s'; m.push(b); }
    g.set = function (k) { // 0 libre, 1 approche, 2 englobé, 3 digéré
      var x = k >= 1 ? 230 : 80; gb.setAttribute('cx', x); noy.setAttribute('cx', x - 8); gb.setAttribute('r', k >= 2 ? 44 : 30);
      m.forEach(function (b, i) { b.setAttribute('x', k >= 2 ? 222 + (i % 2) * 14 : 220 + (i % 2) * 30); b.setAttribute('y', k >= 2 ? 108 + Math.floor(i / 2) * 14 : 90 + Math.floor(i / 2) * 40); b.style.opacity = k >= 3 ? 0 : 1; });
    };
    return g;
  }
  /* courbes : quantité d'anticorps après 1er et 2e contact */
  function courbes(svg) {
    var g = S('g', {}, svg);
    S('path', { d: 'M30 190 H340 M30 190 V30', stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, g);
    T(g, 335, 208, 'temps', 'tag', 'end'); T(g, 34, 26, 'anticorps', 'tag', 'start');
    g.p1 = S('path', { d: 'M40 188 C 80 188, 100 150, 120 150 C 140 150, 150 175, 170 182', fill: 'none', stroke: '#7fb2ff', 'stroke-width': 3 }, g);
    g.p2 = S('path', { d: 'M200 182 C 215 182, 225 50, 250 50 C 275 50, 300 90, 330 110', fill: 'none', stroke: 'var(--acc)', 'stroke-width': 3 }, g);
    T(g, 110, 140, '1er contact (ou vaccin)', 'tag'); g.t2 = T(g, 265, 40, '2e contact : rapide et fort', 'tag');
    return g;
  }

  MV.lesson({
    id: '3ac-immunite',
    objectif: {
      fr: 'Décrire les défenses de l\'organisme (barrières, phagocytose, anticorps) et expliquer le principe de la vaccination.',
      ar: 'وصف دفاعات الجسم (الحواجز، البلعمة، مضادات الأجسام) وتفسير مبدأ التلقيح.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'Une écharde dans le doigt',
      hud: [['j', 'jour'], ['o', 'on observe'], ['q', 'qui défend ?']],
      draw: function (svg) {
        var e = {};
        S('path', { d: 'M60 60 h200 a40 40 0 0 1 0 80 h-200 z', fill: '#e7b99a' }, svg);
        e.ech = S('line', { x1: 210, y1: 80, x2: 250, y2: 105, stroke: '#6b4f3a', 'stroke-width': 4 }, svg); e.ech.setAttribute('data-keep', 1);
        e.rouge = S('circle', { cx: 240, cy: 100, r: 26, fill: 'rgba(229,72,77,.35)' }, svg);
        return e;
      },
      steps: [
        { cap: 'Une **écharde** traverse la peau du doigt.', hud: { j: ['jour 1'], o: 'piqûre', q: '–' } },
        { cap: 'Le lendemain, la zone est **rouge, chaude et gonflée**.', on: ['rouge'], hud: { j: ['jour 2'], o: ['rougeur, gonflement'], q: '–' } },
        { cap: 'Puis tout guérit. **Qui** a combattu les microbes ? On le saura à la fin.', on: ['rouge'], hud: { j: 'jour 5', o: 'guérison', q: ['?'] } }
      ]
    },

    predire: {
      q: "Une écharde traverse la peau du doigt. Le lendemain, la zone est rouge, chaude et gonflée, puis tout guérit. Qui a combattu les microbes ?",
      ar: "شظية تخترق جلد الإصبع. في اليوم التالي تصبح المنطقة حمراء ساخنة منتفخة ثم تشفى. من الذي حارب الجراثيم؟",
      o: ["Les microbes ont disparu seuls", "Les globules blancs, des cellules de défense de l'organisme", "La peau, en cicatrisant seulement"],
      a: 1,
      e: "Les phagocytes, des globules blancs, arrivent vite et détruisent les microbes : c'est la phagocytose. La zone rouge, chaude et gonflée est le signe de cette réaction.",
      ear: "البلعميات، وهي كريات بيضاء، تصل بسرعة وتلتهم الجراثيم: إنها البلعمة، والاحمرار والسخونة علامة على هذا التفاعل."
    },

    prepare: [
      ['Les microbes sont des êtres vivants très petits, comme les bactéries.', true, 'Certains provoquent des maladies.'],
      ['La peau laisse entrer facilement tous les microbes.', false, 'La peau intacte est une barrière efficace.'],
      ['Les globules blancs font partie du sang.', true, 'Ils participent à la défense de l\'organisme.']
    ],

    regarde: {
      vb: '0 0 360 220', label: 'Les défenses du corps',
      hud: [['l', 'ligne de défense'], ['a', 'acteur'], ['r', 'rôle']],
      draw: function (svg) {
        var e = {}; e.ph = phago(svg); e.ph.removeAttribute('data-keep');
        e.bar = S('g', {}, svg); S('rect', { x: 20, y: 140, width: 320, height: 26, fill: '#e7b99a' }, e.bar); T(e.bar, 180, 158, 'peau et muqueuses', 'tag').style.fill = '#141517';
        for (var i = 0; i < 5; i++) S('rect', { x: 50 + i * 60, y: 120, width: 16, height: 9, rx: 4, fill: '#5fae5a' }, e.bar);
        e.ac = S('g', {}, svg);
        for (i = 0; i < 4; i++) { var x = 80 + i * 60; S('rect', { x: x, y: 100, width: 16, height: 9, rx: 4, fill: '#5fae5a' }, e.ac); S('path', { d: 'M' + (x + 8) + ' 80 v12 m0 0 l-8 -8 m8 8 l8 -8', stroke: 'var(--acc)', 'stroke-width': 3, fill: 'none' }, e.ac); }
        T(e.ac, 180, 150, 'anticorps (en Y) fixés sur les microbes', 'tag');
        e.cb = courbes(svg);
        return e;
      },
      steps: [
        { cap: 'Première défense : la **peau** et les muqueuses empêchent les microbes d\'entrer.', ar: 'خط الدفاع الأول: الجلد والأغشية المخاطية تمنع دخول الميكروبات.', on: ['bar'], hud: { l: ['barrières'], a: 'peau', r: 'bloquer' } },
        { cap: 'Si les microbes entrent, des **globules blancs** arrivent sur place : c\'est l\'inflammation.', ar: 'إذا دخلت الميكروبات تتجه إليها الكريات البيضاء: هذا هو الالتهاب.', on: ['ph'], hud: { l: ['réaction rapide'], a: 'phagocyte', r: 'arriver' }, run: function (e) { e.ph.set(0); setTimeout(function () { e.ph.set(1); }, 300); } },
        { cap: 'Le phagocyte **englobe** les microbes et les digère : c\'est la **phagocytose**.', ar: 'تبتلع البلعمية الميكروبات وتهضمها: هذه هي البلعمة.', on: ['ph'], hud: { l: 'réaction rapide', a: ['phagocyte'], r: ['phagocytose'] }, run: function (e) { e.ph.set(2); setTimeout(function () { e.ph.set(3); }, 1300); } },
        { cap: 'Puis des **lymphocytes** fabriquent des **anticorps**, spécifiques de chaque microbe.', ar: 'ثم تنتج اللمفاويات مضادات أجسام خاصة بكل ميكروب.', on: ['ac'], hud: { l: ['réaction spécifique'], a: ['lymphocytes'], r: ['anticorps'] } },
        { cap: 'Le corps garde une **mémoire** : au 2e contact, la réponse est plus rapide et plus forte.', ar: 'يحتفظ الجسم بذاكرة: عند الاتصال الثاني تكون الاستجابة أسرع وأقوى.', on: ['cb'], hud: { l: 'mémoire', a: 'lymphocytes', r: ['réponse rapide'] } },
        { cap: 'Le **vaccin** crée ce premier contact sans danger, avec un microbe affaibli ou tué.', ar: 'يحدث اللقاح هذا الاتصال الأول دون خطر بميكروب مضعف أو ميت.', on: ['cb'], hud: { l: ['vaccination'], a: 'vaccin', r: ['prévenir'] } }
      ]
    },

    faisons: [
      { title: 'Phagocytose', intro: 'Fais avancer le phagocyte vers les microbes.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 220', role: 'img', 'aria-label': 'Phagocytose' }, st);
          var p = phago(svg), set = MV.hud(c, [['e', 'étape'], ['m', 'microbes', 1]]), N = ['repos', 'approche', 'englobement', 'digestion'];
          MV.slider(c, { label: 'étape', min: 0, max: 3, value: 0, fmt: function (v) { return N[v]; } }, function (v) { p.set(v); set('e', N[v]); set('m', v >= 3 ? 'détruits' : 'vivants'); if (v === 3) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Un enfant vacciné contre la rougeole rencontre le virus de la rougeole.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Le vaccin lui a permis de :', o: ['fabriquer une mémoire contre ce virus', 'tuer tous les microbes du monde'], a: 0 },
            { type: 'opt', q: 'Étape 2. Au contact du virus, ses anticorps sont produits :', o: ['lentement et faiblement', 'vite et en grande quantité'], a: 1 },
            { type: 'opt', q: 'Étape 3. Ce vaccin protège-t-il aussi contre la grippe ?', o: ['oui', 'non, la réponse est spécifique'], a: 1 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'La première barrière contre les microbes est :', o: ['la peau', 'le cœur'], a: 0 },
      { lvl: 'Niveau 2', q: 'La phagocytose est réalisée par :', o: ['des globules blancs', 'des globules rouges'], a: 0 },
      { lvl: 'Niveau 3', q: 'Les anticorps sont produits par :', o: ['les lymphocytes', 'les plaquettes'], a: 0 },
      { lvl: 'Niveau 4', q: 'Pourquoi fait-on souvent un rappel de vaccin ?', o: ['pour entretenir la mémoire immunitaire', 'pour soigner une fracture'], a: 0 }
    ],

    bilan: {
      vb: '0 0 360 220', label: 'L\'écharde expliquée',
      hud: [['r', 'rougeur'], ['d', 'défenseurs'], ['g', 'guérison']],
      draw: function (svg) { var e = {}; e.ph = phago(svg); return e; },
      steps: [
        { cap: 'Rougeur et gonflement : les **globules blancs** arrivent dans la zone blessée.', hud: { r: ['inflammation'], d: 'globules blancs', g: '–' }, run: function (e) { e.ph.set(1); } },
        { cap: 'Ils **phagocytent** les microbes : le doigt guérit.', ar: 'تبتلع الكريات البيضاء الميكروبات فيشفى الأصبع.', hud: { r: 'inflammation', d: ['phagocytes'], g: ['oui'] }, run: function (e) { e.ph.set(3); } }
      ]
    },

    retenir: [
      'L\'organisme se défend : <b>barrières</b> (peau, muqueuses), réaction rapide des <b>phagocytes</b> (phagocytose), puis réaction spécifique des <b>lymphocytes</b> qui produisent des <b>anticorps</b>.',
      'Le corps garde une <b>mémoire</b> immunitaire. La <b>vaccination</b> provoque un premier contact sans danger ; au vrai contact, la réponse est rapide et forte.'
    ],
    retenirAr: 'يدافع الجسم عن نفسه بالحواجز (الجلد والأغشية المخاطية)، ثم بالبلعمة، ثم باللمفاويات التي تنتج مضادات الأجسام. ويحتفظ بذاكرة مناعية، والتلقيح يحدث اتصالا أول دون خطر.',
    voc: [['l\'immunité', 'المناعة'], ['la phagocytose', 'البلعمة'], ['un anticorps', 'مضاد الأجسام'], ['un lymphocyte', 'خلية لمفاوية'], ['le vaccin', 'اللقاح'], ['un microbe', 'ميكروب']]
  });
})();
