/* @meta {"id":"2ac-proportionnalite","level":"2","order":16,"theme":"Organisation de données","title":"Proportionnalité : échelles et vitesse","ar":"التناسبية: السلم والسرعة","lead":"Sur une carte au 1/500 000, Fès et Meknès sont à 12 cm. Quelle distance réelle ? Et en 45 min de route, à quelle vitesse roule-t-on ? Deux tableaux de proportionnalité."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  function carte(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('rect', { x: 20, y: 20, width: 320, height: 130, rx: 10, fill: 'rgba(86,208,127,.08)', stroke: '#5b6068' }, g);
    var dyn = S('g', {}, g);
    g.set = function (cm, o) { // cm sur la carte (1 cm = 20 px)
      o = o || {};
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var x1 = 50, x2 = 50 + cm * 20;
      S('line', { x1: x1, y1: 85, x2: x2, y2: 85, stroke: 'var(--acc)', 'stroke-width': 3, 'stroke-dasharray': '6 4' }, dyn);
      S('circle', { cx: x1, cy: 85, r: 6, fill: '#e9e9ea' }, dyn); T(dyn, x1, 70, 'a' in o ? o.a : 'Meknès', 'lbl');
      S('circle', { cx: x2, cy: 85, r: 6, fill: '#e9e9ea' }, dyn); T(dyn, x2, 70, 'b' in o ? o.b : 'Fès', 'lbl');
      T(dyn, (x1 + x2) / 2, 106, cm + ' cm sur la carte', 'tag');
      for (var i = 0; i <= 5; i++) S('line', { x1: 40 + i * 20, y1: 175, x2: 40 + i * 20, y2: 183, stroke: '#9aa0a8' }, dyn);
      S('line', { x1: 40, y1: 179, x2: 140, y2: 179, stroke: '#9aa0a8', 'stroke-width': 2 }, dyn); T(dyn, 150, 183, '1 cm ↔ 5 km', 'tag', 'start');
      if (o.km) T(dyn, 340, 140, '= ' + cm * 5 + ' km', 'lbl acc', 'end');
    };
    return g;
  }

  MV.lesson({
    id: '2ac-proportionnalite',
    objectif: {
      fr: 'Utiliser la proportionnalité pour les échelles (distance sur le plan / distance réelle) et la vitesse moyenne (v = d ÷ t).',
      ar: 'استعمال التناسبية في السلم (المسافة على التصميم / المسافة الحقيقية) وفي السرعة المتوسطة [[v = d ÷ t]].'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'De Meknès à Fès',
      hud: [['c', 'sur la carte'], ['e', 'échelle'], ['q', 'distance réelle ?']],
      draw: function (svg) { var e = {}; e.c = carte(svg); return e; },
      steps: [
        { cap: 'Sur une carte, Meknès et Fès sont à **12 cm**.', hud: { c: ['12 cm'], e: '–', q: '–' }, run: function (e) { e.c.set(12); } },
        { cap: 'L\'échelle est **1/500 000** : 1 cm sur la carte représente 500 000 cm en vrai.', hud: { c: '12 cm', e: ['1/500 000'], q: '–' }, run: function (e) { e.c.set(12); } },
        { cap: 'Quelle est la distance réelle, et à quelle vitesse roule un car qui la parcourt en 45 min ? On le saura à la fin.', hud: { c: '12 cm', e: '1/500 000', q: ['?'] }, run: function (e) { e.c.set(12); } }
      ]
    },

    prepare: [
      ['500 000 cm = 5 km.', true, '100 000 cm = 1 km.'],
      ['Une échelle de 1/100 signifie que 1 cm représente 100 m.', false, '1 cm représente 100 cm, soit 1 m.'],
      ['45 min = 0,75 h.', true, '45 ÷ 60 = 0,75.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'Échelle et vitesse',
      hud: [['g', 'grandeurs'], ['r', 'relation'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.c = carte(svg); return e; },
      steps: [
        { cap: 'L\'**échelle** est le coefficient : distance sur la carte ÷ distance réelle (même unité).', ar: 'السلم = المسافة على التصميم ÷ المسافة الحقيقية بنفس الوحدة.', hud: { g: ['carte / réel'], r: 'échelle = 1/500 000', v: '–' }, run: function (e) { e.c.set(12); } },
        { cap: '1 cm ↔ 500 000 cm = **5 km**. Les distances sont **proportionnelles**.', ar: '1 سنتيمتر على الخريطة يمثل 5 كيلومترات.', hud: { g: 'carte → réel', r: ['× 500 000'], v: '1 cm ↔ 5 km' }, run: function (e) { e.c.set(1, { km: 1, a: '', b: '' }); } },
        { cap: '12 cm ↔ 12 × 5 = **60 km**.', ar: '12 سنتيمترا تمثل 60 كيلومترا.', hud: { g: 'carte → réel', r: '× 5 km par cm', v: ['60 km'] }, run: function (e) { e.c.set(12, { km: 1 }); } },
        { cap: 'À **vitesse constante**, la distance est proportionnelle à la durée. La **vitesse moyenne** est le coefficient : **v = d ÷ t**.', ar: 'السرعة المتوسطة [[v = d ÷ t]].', hud: { g: ['distance / durée'], r: ['v = d ÷ t'], v: '–' }, run: function (e) { e.c.set(12, { km: 1 }); } },
        { cap: 'Durée 45 min = **0,75 h** : v = 60 ÷ 0,75 = **80 km/h**.', ar: '[[v = 60 ÷ 0,75 = 80 km/h]].', hud: { g: 'vitesse', r: '60 km ÷ 0,75 h', v: ['80 km/h'] }, run: function (e) { e.c.set(12, { km: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change la distance sur la carte. Trouve celle qui représente 70 km.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Carte et échelle' }, st);
          var cp = carte(svg), set = MV.hud(c, [['c', 'sur la carte'], ['r', 'réel', 1]]);
          MV.slider(c, { label: 'distance sur la carte (cm)', min: 1, max: 14, value: 4 }, function (v) { cp.set(v, { km: 1, a: 'A', b: 'B' }); set('c', v + ' cm'); set('r', v * 5 + ' km'); if (v === 14) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Un cycliste parcourt 36 km en 1 h 30 min.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. 1 h 30 min = ? h', a: 1.5 },
            { q: 'Étape 2. v = 36 ÷ 1,5 = ? km/h', a: 24 },
            { q: 'Étape 3. À cette vitesse, distance en 2 h (km) ?', a: 48 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Échelle 1/100 000. 3 cm sur la carte = ? km', a: 3 },
      { lvl: 'Niveau 2', q: 'Un plan au 1/50 : un mur de 4 cm sur le plan mesure ? m', a: 2 },
      { lvl: 'Niveau 3', q: 'd = 150 km, t = 2 h. v = ? km/h', a: 75 },
      { lvl: 'Niveau 4', q: 'v = 90 km/h. Durée pour 45 km, en minutes ?', a: 30 }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'Le trajet Meknès – Fès',
      hud: [['d', 'distance réelle'], ['t', 'durée'], ['v', 'vitesse moyenne']],
      draw: function (svg) { var e = {}; e.c = carte(svg); return e; },
      steps: [
        { cap: '12 cm au 1/500 000 : **60 km**.', hud: { d: ['60 km'], t: '–', v: '–' }, run: function (e) { e.c.set(12, { km: 1 }); } },
        { cap: 'En 45 min, soit 0,75 h : v = 60 ÷ 0,75 = **80 km/h**.', ar: 'المسافة الحقيقية 60 كيلومترا، والسرعة المتوسطة 80 كيلومترا في الساعة.', hud: { d: '60 km', t: ['0,75 h'], v: ['80 km/h'] }, run: function (e) { e.c.set(12, { km: 1 }); } }
      ]
    },

    retenir: [
      'L\'<b>échelle</b> d\'un plan ou d\'une carte est le coefficient de proportionnalité : <b class="mono">échelle = distance sur le plan ÷ distance réelle</b> (même unité).',
      'À vitesse constante, la distance est proportionnelle à la durée : <b class="mono">v = d ÷ t</b>, <b class="mono">d = v × t</b>, <b class="mono">t = d ÷ v</b>.'
    ],
    retenirAr: 'السلم = المسافة على التصميم ÷ المسافة الحقيقية بنفس الوحدة. السرعة المتوسطة [[v = d ÷ t]]، ومنه [[d = v × t]] و [[t = d ÷ v]].',
    voc: [['l\'échelle', 'السلم'], ['la distance réelle', 'المسافة الحقيقية'], ['la vitesse moyenne', 'السرعة المتوسطة'], ['la durée', 'المدة']]
  });
})();
