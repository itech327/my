/* @meta {"id":"1ac-masse-volumique","level":"1","order":3,"theme":"Matière et environnement","title":"Volume, masse et masse volumique","ar":"الحجم والكتلة والكتلة الحجمية","lead":"Dans une bouteille de vinaigrette, l'huile reste au-dessus de l'eau : on mesure volume et masse pour comprendre pourquoi."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var MAT = [['eau', 1, 'var(--acc)'], ['huile', 0.92, '#e9c46a'], ['aluminium', 2.7, '#d8dce2'], ['fer', 7.9, '#9aa0a8'], ['bois (pin)', 0.5, '#c9a35a']];

  /* éprouvette graduée : niveau en mL (0 à 100) */
  function eprouvette(svg, x, y) {
    var g = S('g', { 'data-keep': 1 }, svg), H = 160;
    S('rect', { x: x, y: y, width: 44, height: H, fill: 'none', stroke: '#cfd3d8', 'stroke-width': 2.5 }, g);
    for (var k = 0; k <= 10; k++) { S('line', { x1: x + 30, y1: y + H - k * H / 10, x2: x + 44, y2: y + H - k * H / 10, stroke: '#9aa0a8' }, g); if (k % 2 === 0) T(g, x + 52, y + H - k * H / 10 + 4, k * 10, 'tag', 'start'); }
    var liq = S('rect', { x: x + 2, y: y + H, width: 40, height: 0, fill: 'var(--acc)', opacity: .8 }, g); liq.style.transition = 'all 1s';
    var obj = S('rect', { x: x + 12, y: y - 40, width: 20, height: 20, rx: 3, fill: '#9aa0a8' }, g); obj.style.transition = 'all 1s';
    g.niv = function (ml) { liq.setAttribute('y', y + H - ml * H / 100); liq.setAttribute('height', ml * H / 100); };
    g.objet = function (dans, col) { obj.setAttribute('y', dans ? y + H - 24 : y - 40); obj.setAttribute('fill', col || '#9aa0a8'); obj.style.opacity = col === null ? 0 : 1; };
    g.niv(0); return g;
  }
  function balance(svg, x, y) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('rect', { x: x, y: y, width: 120, height: 40, rx: 8, fill: '#2b2e33', stroke: '#9aa0a8' }, g);
    S('rect', { x: x + 10, y: y - 8, width: 100, height: 8, fill: '#9aa0a8' }, g);
    var t = T(g, x + 60, y + 27, '0 g', 'lbl acc'); g.m = function (m) { t.textContent = m + ' g'; };
    return g;
  }

  MV.lesson({
    id: '1ac-masse-volumique',
    objectif: {
      fr: 'Mesurer un volume et une masse, puis calculer une masse volumique ρ = m / V.',
      ar: 'قياس الحجم والكتلة ثم حساب الكتلة الحجمية [[ρ = m / V]].'
    },

    ouverture: {
      vb: '0 0 360 230', label: 'Huile et eau dans une bouteille',
      hud: [['h', 'en haut'], ['b', 'en bas'], ['q', 'pourquoi ?']],
      draw: function (svg) {
        var e = {};
        S('path', { d: 'M150 20 h60 v30 l20 20 v140 h-100 v-140 l20 -20 z', fill: 'none', stroke: '#cfd3d8', 'stroke-width': 3 }, svg);
        e.eau = S('rect', { x: 132, y: 150, width: 96, height: 58, fill: 'var(--acc)', opacity: .85 }, svg);
        e.huile = S('rect', { x: 132, y: 110, width: 96, height: 40, fill: '#e9c46a', opacity: .9 }, svg);
        T(svg, 260, 135, 'huile', 'tag', 'start'); T(svg, 260, 185, 'eau', 'tag', 'start');
        e.melange = S('g', {}, svg); for (var i = 0; i < 14; i++) S('circle', { cx: 140 + (i * 37 % 80), cy: 120 + (i * 23 % 80), r: 5, fill: '#e9c46a' }, e.melange);
        return e;
      },
      steps: [
        { cap: 'On secoue une vinaigrette : l\'huile et l\'eau se **mélangent**.', on: ['eau', 'melange'], hud: { h: '–', b: '–', q: '–' } },
        { cap: 'Quelques minutes plus tard, l\'huile est **au-dessus**.', on: ['eau', 'huile'], hud: { h: ['huile'], b: ['eau'], q: '–' } },
        { cap: 'Pourquoi l\'huile **flotte** ? On le saura à la fin.', on: ['eau', 'huile'], hud: { h: 'huile', b: 'eau', q: ['?'] } }
      ]
    },

    prepare: [
      ['Le volume se mesure en litres ou en millilitres.', true, 'Ou en cm³ : 1 mL = 1 cm³.'],
      ['La masse se mesure avec une balance.', true, 'En grammes ou en kilogrammes.'],
      ['Un objet lourd a toujours un grand volume.', false, 'Une petite bille de fer peut être plus lourde qu\'un gros bouchon de liège.']
    ],

    regarde: {
      vb: '0 0 360 240', label: 'Éprouvette et balance',
      hud: [['v', 'volume'], ['m', 'masse'], ['r', 'ρ = m / V']],
      draw: function (svg) { var e = {}; e.ep = eprouvette(svg, 40, 40); e.ba = balance(svg, 210, 150); e.f = T(svg, 270, 70, 'ρ = m / V', 'lbl big acc'); return e; },
      steps: [
        { cap: 'On verse **50 mL** d\'eau dans une éprouvette graduée.', ar: 'نصب 50 mL من الماء في مخبار مدرج.', hud: { v: ['50 mL'], m: '–', r: '–' }, run: function (e) { e.ep.niv(50); e.ep.objet(false, null); e.ba.m(0); } },
        { cap: 'On plonge un cube de métal : le niveau monte à **60 mL**.', ar: 'نغمر مكعبا فلزيا فيرتفع المستوى إلى 60 mL.', hud: { v: '60 − 50', m: '–', r: '–' }, run: function (e) { e.ep.objet(true, '#d8dce2'); e.ep.niv(60); } },
        { cap: 'Volume du cube : 60 − 50 = **10 mL = 10 cm³**.', ar: 'حجم المكعب: [[60 − 50 = 10 cm³]].', hud: { v: ['10 cm³'], m: '–', r: '–' }, run: function (e) { e.ep.objet(true, '#d8dce2'); e.ep.niv(60); } },
        { cap: 'La balance indique sa masse : **27 g**.', ar: 'الميزان يشير إلى كتلته: 27 g.', hud: { v: '10 cm³', m: ['27 g'], r: '–' }, run: function (e) { e.ba.m(27); } },
        { cap: 'Masse volumique : ρ = m / V = 27 / 10 = **2,7 g/cm³**. C\'est de l\'aluminium.', ar: 'الكتلة الحجمية: [[ρ = 27 / 10 = 2,7 g/cm³]]. إنه الألومنيوم.', on: ['f'], hud: { v: '10 cm³', m: '27 g', r: ['2,7 g/cm³'] }, run: function (e) { e.ba.m(27); } },
        { cap: 'Pour l\'eau : 1 cm³ pèse 1 g. ρ(eau) = **1 g/cm³**. Un corps moins dense flotte sur l\'eau.', ar: 'الكتلة الحجمية للماء [[1 g/cm³]]. الجسم الأقل كتلة حجمية من الماء يطفو فوقه.', on: ['f'], hud: { v: '1 cm³', m: '1 g', r: ['1 g/cm³'] }, run: function (e) { e.ep.objet(false, null); e.ep.niv(50); e.ba.m(50); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis un matériau et un volume. Observe la masse et si le corps flotte sur l\'eau.',
        build: function (c, MV, done) {
          var set = MV.hud(c, [['m', 'masse', 1], ['r', 'ρ (g/cm³)'], ['f', 'sur l\'eau', 1]]), row = MV.H('div', 'row', '', c), cur = MAT[2], V = 10, seen = {};
          function upd() { var m = Math.round(cur[1] * V * 10) / 10; set('m', MV.fmt(m) + ' g'); set('r', MV.fmt(cur[1])); set('f', cur[1] < 1 ? 'flotte' : cur[1] > 1 ? 'coule' : '–'); seen[cur[0]] = 1; if (Object.keys(seen).length >= 3) done(); }
          MAT.forEach(function (m) { MV.H('button', 'btn', m[0], row).onclick = function () { cur = m; upd(); }; });
          MV.slider(c, { label: 'volume', min: 1, max: 100, value: 10, fmt: function (v) { return v + ' cm³'; } }, function (v) { V = v; upd(); });
          MV.H('p', 'small', 'Essaie au moins trois matériaux. Valeurs usuelles arrondies.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Une pierre de 60 g fait monter l\'eau d\'une éprouvette de 40 mL à 64 mL.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Volume de la pierre, en cm³ ?', a: 24, unit: 'cm³', hint: '64 − 40.' },
            { q: 'Étape 2. Masse volumique : 60 ÷ 24 = ?', a: 2.5, unit: 'g/cm³', hint: 'Divise la masse par le volume.' },
            { type: 'opt', q: 'Étape 3. Dans l\'eau, cette pierre :', o: ['flotte', 'coule'], a: 1, e: '2,5 g/cm³ > 1 g/cm³.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Combien de cm³ dans 250 mL ?', a: 250, unit: 'cm³' },
      { lvl: 'Niveau 2', q: 'Un objet de 79 g a un volume de 10 cm³. Sa masse volumique ?', a: 7.9, unit: 'g/cm³' },
      { lvl: 'Niveau 3', q: 'Quelle est la masse de 2 L d\'eau, en grammes ?', a: 2000, unit: 'g', hint: '1 L = 1 000 cm³ et 1 cm³ d\'eau = 1 g.' },
      { lvl: 'Niveau 4', q: 'Un bouchon de liège (ρ ≈ 0,24 g/cm³) dans l\'eau :', o: ['flotte', 'coule'], a: 0 }
    ],

    bilan: {
      vb: '0 0 360 230', label: 'L\'huile flotte',
      hud: [['h', 'ρ huile'], ['e', 'ρ eau'], ['r', 'réponse']],
      draw: function (svg) {
        var e = {};
        S('path', { d: 'M150 20 h60 v30 l20 20 v140 h-100 v-140 l20 -20 z', fill: 'none', stroke: '#cfd3d8', 'stroke-width': 3 }, svg);
        S('rect', { x: 132, y: 150, width: 96, height: 58, fill: 'var(--acc)', opacity: .85 }, svg);
        S('rect', { x: 132, y: 110, width: 96, height: 40, fill: '#e9c46a', opacity: .9 }, svg);
        return e;
      },
      steps: [
        { cap: 'Huile : environ **0,92 g/cm³**. Eau : **1 g/cm³**.', hud: { h: ['0,92'], e: ['1'], r: '–' } },
        { cap: 'L\'huile a une masse volumique **plus petite** : elle flotte sur l\'eau.', ar: 'الكتلة الحجمية للزيت أصغر من الكتلة الحجمية للماء، لذلك يطفو فوقه.', hud: { h: '0,92', e: '1', r: ['elle flotte'] } }
      ]
    },

    retenir: [
      'Le <b>volume</b> se mesure avec une éprouvette graduée (1 mL = 1 cm³) ; la <b>masse</b> avec une balance.',
      'La <b>masse volumique</b> est <b class="mono">ρ = m / V</b>, en g/cm³ par exemple. Pour l\'eau, ρ = 1 g/cm³. Un corps de masse volumique plus petite que celle d\'un liquide flotte sur ce liquide.'
    ],
    retenirAr: 'نقيس الحجم بمخبار مدرج والكتلة بميزان. الكتلة الحجمية هي [[ρ = m / V]]. للماء [[ρ = 1 g/cm³]]. الجسم الذي كتلته الحجمية أصغر من كتلة السائل الحجمية يطفو فوقه.',
    voc: [['le volume', 'الحجم'], ['la masse', 'الكتلة'], ['la masse volumique', 'الكتلة الحجمية'], ['une éprouvette graduée', 'مخبار مدرج'], ['flotter / couler', 'يطفو / يغوص']]
  });
})();
