/* @meta {"id":"2ac-symetrie","level":"2","order":3,"theme":"Géométrie","title":"La symétrie axiale","ar":"التماثل المحوري","lead":"On plie une feuille tachée d'encre encore fraîche : la tache se dédouble. Où se trouve exactement la copie de chaque point ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, AX = 180;

  /* axe vertical x = 180, triangle ABC à gauche et son image A'B'C' à droite */
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('line', { x1: AX, y1: 10, x2: AX, y2: 200, stroke: '#e9e9ea', 'stroke-width': 2, 'stroke-dasharray': '8 5' }, g); T(g, AX + 6, 22, '(Δ)', 'tag', 'start');
    var tri = S('path', { fill: 'rgba(255,122,47,.25)', stroke: 'var(--acc)', 'stroke-width': 3 }, g), img = S('path', { fill: 'rgba(127,178,255,.2)', stroke: '#7fb2ff', 'stroke-width': 3 }, g);
    var seg = S('line', { stroke: '#e9e9ea', 'stroke-width': 1.5 }, g), mk = S('path', { fill: 'none', stroke: '#e9e9ea', 'stroke-width': 1.5 }, g);
    var t1 = T(g, 0, 0, 'A', 'lbl'), t2 = T(g, 0, 0, 'A\'', 'lbl'), tm = T(g, 0, 0, '', 'tag');
    g.set = function (A, opts) { // A : sommet mobile [x, y] ; opts.img image visible, opts.seg segment [AA'] marqué
      opts = opts || {};
      var B = [120, 170], C = [60, 150], P = [A, B, C], Q = P.map(function (p) { return [2 * AX - p[0], p[1]]; });
      tri.setAttribute('d', 'M' + P.map(function (p) { return p.join(' '); }).join(' L') + ' Z');
      img.setAttribute('d', 'M' + Q.map(function (p) { return p.join(' '); }).join(' L') + ' Z'); img.style.opacity = opts.img ? 1 : 0; t2.style.opacity = opts.img ? 1 : 0;
      t1.setAttribute('x', A[0] - 12); t1.setAttribute('y', A[1] - 6); t2.setAttribute('x', Q[0][0] + 12); t2.setAttribute('y', Q[0][1] - 6);
      seg.setAttribute('x1', A[0]); seg.setAttribute('y1', A[1]); seg.setAttribute('x2', Q[0][0]); seg.setAttribute('y2', Q[0][1]);
      mk.setAttribute('d', 'M' + (AX - 10) + ' ' + A[1] + ' v-10 h10 M' + ((A[0] + AX) / 2) + ' ' + (A[1] - 5) + ' v10 M' + ((Q[0][0] + AX) / 2) + ' ' + (A[1] - 5) + ' v10');
      seg.style.opacity = mk.style.opacity = opts.seg ? 1 : 0;
      tm.textContent = opts.seg ? 'd = ' + (AX - A[0]) : ''; tm.setAttribute('x', (A[0] + AX) / 2); tm.setAttribute('y', A[1] + 20);
    };
    return g;
  }

  MV.lesson({
    id: '2ac-symetrie',
    objectif: {
      fr: 'Construire le symétrique d\'un point et d\'une figure par rapport à une droite, et utiliser la conservation des longueurs, des angles et de l\'alignement.',
      ar: 'إنشاء مماثل نقطة وشكل بالنسبة لمستقيم، واستعمال حفاظ التماثل المحوري على المسافات والزوايا والاستقامية.'
    },

    prerequis: {
      fr: 'Droite, médiatrice et perpendiculaire ; usage de l\'équerre.',
      ar: 'المستقيم والواسط والعمود واستعمال الكوس.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Une tache d\'encre pliée',
      hud: [['a', 'avant'], ['p', 'après pliage'], ['q', 'où va chaque point ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Une **tache d\'encre** fraîche d\'un côté de la feuille.', hud: { a: ['1 tache'], p: '–', q: '–' }, run: function (e) { e.s.set([90, 60]); } },
        { cap: 'On **plie** la feuille le long du trait, puis on la déplie : la tache s\'est **dédoublée**.', hud: { a: '1 tache', p: ['2 taches'], q: '–' }, run: function (e) { e.s.set([90, 60], { img: 1 }); } },
        { cap: 'Où se trouve exactement la copie de chaque point ? On le saura à la fin.', hud: { a: '1 tache', p: '2 taches', q: ['?'] }, run: function (e) { e.s.set([90, 60], { img: 1 }); } }
      ]
    },

    predire: {
      q: "Une tache d'encre est de l'autre côté du pli. Après pliage puis dépliage, où se trouve la copie d'un point A de la tache ?",
      ar: "بقعة حبر على أحد جانبي الطيّة. بعد الطيّ والفتح، أين توجد نسخة النقطة [[A]]؟",
      o: ["Sur la perpendiculaire au pli passant par A, à la même distance du pli", "À côté de A, parallèlement au pli", "N'importe où, on ne peut pas savoir"],
      a: 0,
      e: "Le pli est la médiatrice de [AA'] : A' est sur la perpendiculaire au pli qui passe par A, de l'autre côté, à la même distance du pli que A.",
      ear: "الطيّة هي واسطة القطعة [[[AA']]]: النقطة [[A']] على العمودي على الطيّة المار من [[A]] وبنفس البعد."
    },

    prepare: [
      ['La médiatrice d\'un segment passe par son milieu.', true, 'Et elle lui est perpendiculaire.'],
      ['Un point situé sur l\'axe a pour symétrique lui-même.', true, 'Il ne bouge pas au pliage.'],
      ['La symétrie axiale agrandit les figures.', false, 'Elle conserve les longueurs : la figure garde sa taille.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Le symétrique d\'un point',
      hud: [['r', 'règle'], ['m', 'mesure'], ['c', 'conserve']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'A\' est le **symétrique** de A par rapport à la droite (Δ).', ar: 'النقطة A\' مماثلة A بالنسبة للمستقيم (Δ).', hud: { r: ['A → A\''], m: '–', c: '–' }, run: function (e) { e.s.set([90, 60], { img: 1 }); } },
        { cap: '(Δ) est **perpendiculaire** à [AA\'] et passe par son **milieu** : c\'est sa **médiatrice**.', ar: 'المستقيم (Δ) واسط القطعة [AA\'].', hud: { r: ['(Δ) médiatrice de [AA\']'], m: ['même distance'], c: '–' }, run: function (e) { e.s.set([90, 60], { img: 1, seg: 1 }); } },
        { cap: 'Plus A est loin de l\'axe, plus A\' l\'est aussi, **à la même distance**.', ar: 'كلما ابتعدت A عن المحور ابتعدت A\' بنفس المسافة.', hud: { r: 'même distance', m: ['d = 140'], c: '–' }, run: function (e) { e.s.set([40, 60], { img: 1, seg: 1 }); } },
        { cap: 'L\'image d\'un triangle est un triangle **superposable** : mêmes longueurs, mêmes angles.', ar: 'التماثل المحوري يحافظ على المسافات وقياسات الزوايا.', hud: { r: 'figure', m: 'AB = A\'B\'', c: ['longueurs, angles'] }, run: function (e) { e.s.set([90, 60], { img: 1 }); } },
        { cap: 'Il conserve aussi l\'**alignement** et les **aires**. L\'image d\'une droite est une droite.', ar: 'ويحافظ أيضا على الاستقامية والمساحات.', hud: { r: 'figure', m: 'aire égale', c: ['alignement, aires'] }, run: function (e) { e.s.set([90, 60], { img: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Déplace A. Son symétrique A\' suit, toujours à la même distance de l\'axe. Amène A sur l\'axe.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Symétrie axiale' }, st);
          var s = scene(svg), x = 80, set = MV.hud(c, [['d', 'distance à l\'axe'], ['p', 'A\' = A ?', 1]]);
          MV.slider(c, { label: 'position de A', min: 30, max: 180, value: 80, step: 10 }, function (v) { x = v; s.set([x, 60], { img: 1, seg: 1 }); set('d', AX - x); set('p', x === AX ? 'oui, A est sur l\'axe' : 'non'); if (x === AX) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'A\' est le symétrique de A par rapport à (Δ), et AA\' = 8 cm.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. La droite (Δ) est :', o: ['la médiatrice de [AA\']', 'parallèle à (AA\')'], a: 0 },
            { q: 'Étape 2. Distance de A à (Δ) en cm ?', a: 4 },
            { q: 'Étape 3. L\'angle entre (Δ) et (AA\') mesure ? °', a: 90 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le symétrique d\'un point de l\'axe est :', o: ['lui-même', 'un autre point'], a: 0 },
      { lvl: 'Niveau 2', q: 'AB = 5 cm. Son symétrique A\'B\' mesure ? cm', a: 5 },
      { lvl: 'Niveau 3', q: 'Un angle de 35° a pour symétrique un angle de ? °', a: 35 },
      { lvl: 'Niveau 4', q: 'Combien d\'axes de symétrie a un carré ?', a: 4 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'La copie de la tache',
      hud: [['p', 'position'], ['d', 'distance'], ['f', 'forme']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Chaque point se retrouve de l\'autre côté du pli, **à la même distance**.', hud: { p: ['de l\'autre côté'], d: ['égale'], f: '–' }, run: function (e) { e.s.set([90, 60], { img: 1, seg: 1 }); } },
        { cap: 'Le pli est la **médiatrice** de chaque segment [MM\'] : la copie est superposable.', ar: 'خط الطي واسط كل قطعة [MM\']، والشكل المماثل قابل للتطابق مع الشكل الأصلي.', hud: { p: 'de l\'autre côté', d: 'égale', f: ['superposable'] }, run: function (e) { e.s.set([90, 60], { img: 1 }); } }
      ]
    },

    retenir: [
      'A\' est le <b>symétrique</b> de A par rapport à (Δ) si (Δ) est la <b>médiatrice</b> de [AA\']. Un point de (Δ) est son propre symétrique.',
      'La symétrie axiale <b>conserve</b> les longueurs, les angles, l\'alignement et les aires : la figure image est superposable.'
    ],
    retenirAr: 'تكون A\' مماثلة A بالنسبة للمستقيم (Δ) إذا كان (Δ) واسط [AA\']. التماثل المحوري يحافظ على المسافات والزوايا والاستقامية والمساحات.',
    voc: [['la symétrie axiale', 'التماثل المحوري'], ['le symétrique', 'المماثل'], ['la médiatrice', 'الواسط'], ['un axe de symétrie', 'محور تماثل'], ['superposable', 'قابل للتطابق']]
  });
})();
