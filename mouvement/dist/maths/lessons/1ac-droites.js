/* @meta {"id":"1ac-droites","level":"1","order":7,"theme":"Géométrie","title":"Droites parallèles et perpendiculaires","ar":"المستقيمات المتوازية والمتعامدة","lead":"Les deux rails du tramway ne se croisent jamais, et chaque traverse leur est perpendiculaire. Trois propriétés suffisent pour tout expliquer."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, RAD = Math.PI / 180;

  /* droite passant par (cx, cy) avec un angle donné, longue */
  function droite(g, cx, cy, ang, col, w) {
    var dx = Math.cos(ang * RAD) * 400, dy = -Math.sin(ang * RAD) * 400;
    return S('line', { x1: cx - dx, y1: cy - dy, x2: cx + dx, y2: cy + dy, stroke: col, 'stroke-width': w || 3 }, g);
  }
  function equerre(g, x, y, ang) { // petit carré d'angle droit tourné
    var r = S('path', { d: 'M0 0 h12 v-12 h-12', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 1.5 }, g);
    r.setAttribute('transform', 'translate(' + x + ',' + y + ') rotate(' + (-ang) + ')'); return r;
  }

  /* scène : deux droites d1, d2 et une sécante d */
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), inner = S('g', {}, g);
    g.set = function (a1, a2, sec, marks) { // angles de d1 et d2 ; angle de la sécante (null : absente)
      while (inner.firstChild) inner.removeChild(inner.firstChild);
      droite(inner, 180, 70, a1, 'var(--acc)'); droite(inner, 180, 150, a2, '#7fb2ff');
      T(inner, 20, 70 - Math.tan(a1 * RAD) * -160 - 8, '(d₁)', 'tag', 'start'); T(inner, 20, 150 - Math.tan(a2 * RAD) * -160 - 8, '(d₂)', 'tag', 'start');
      if (sec != null) { droite(inner, 180, 110, sec, '#e9e9ea', 2); T(inner, 196, 26, '(d)', 'tag', 'start'); }
      if (marks) { equerre(inner, 180, 70, a1); if (marks > 1) equerre(inner, 180, 150, a2); }
    };
    return g;
  }

  MV.lesson({
    id: '1ac-droites',
    objectif: {
      fr: 'Reconnaître des droites parallèles et perpendiculaires et utiliser les trois propriétés qui les relient.',
      ar: 'التعرف على المستقيمات المتوازية والمتعامدة واستعمال الخاصيات الثلاث التي تربط بينها.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Les rails du tramway',
      hud: [['r', 'rails'], ['t', 'traverses'], ['q', 'pourquoi ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Deux **rails** de tramway : ils ne se rencontrent jamais.', hud: { r: ['parallèles'], t: '–', q: '–' }, run: function (e) { e.s.set(0, 0, null); } },
        { cap: 'Une **traverse** coupe les deux rails à angle droit.', hud: { r: 'parallèles', t: ['perpendiculaire'], q: '–' }, run: function (e) { e.s.set(0, 0, 90, 2); } },
        { cap: 'Pourquoi une traverse perpendiculaire à un rail l\'est-elle aussi à l\'autre ? On le saura à la fin.', hud: { r: 'parallèles', t: 'perpendiculaire', q: ['?'] }, run: function (e) { e.s.set(0, 0, 90, 1); } }
      ]
    },

    predire: {
      q: "Deux rails sont parallèles. Une traverse est perpendiculaire à l'un des rails. Est-elle perpendiculaire à l'autre ?",
      ar: "سكتان متوازيتان. عارضة عمودية على إحداهما. هل هي عمودية على الأخرى؟",
      o: ["Non, seulement si elle est plus courte", "On ne peut pas savoir", "Oui, toujours"],
      a: 2,
      e: "Si deux droites sont parallèles, toute droite perpendiculaire à l'une est perpendiculaire à l'autre. La longueur de la traverse n'a aucune importance.",
      ear: "إذا توازى مستقيمان فكل مستقيم عمودي على أحدهما يكون عمودياً على الآخر، مهما كان طوله."
    },

    prepare: [
      ['Deux droites perpendiculaires forment un angle droit.', true, 'Un angle de 90°.'],
      ['Deux droites parallèles se coupent en un point.', false, 'Elles ne se coupent jamais.'],
      ['On vérifie un angle droit avec une équerre.', true, 'C\'est l\'outil adapté.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Trois propriétés',
      hud: [['h', 'si'], ['c', 'alors'], ['n', 'propriété']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '(d₁) et (d₂) ne se coupent pas : elles sont **parallèles**. On écrit (d₁) // (d₂).', ar: 'المستقيمان لا يتقاطعان: إنهما متوازيان.', hud: { h: '–', c: ['(d₁) // (d₂)'], n: 'parallèles' }, run: function (e) { e.s.set(15, 15, null); } },
        { cap: 'P1 : si deux droites sont **perpendiculaires à une même droite**, elles sont parallèles.', ar: 'إذا كان مستقيمان عموديين على نفس المستقيم فإنهما متوازيان.', hud: { h: ['(d₁) ⊥ (d) et (d₂) ⊥ (d)'], c: ['(d₁) // (d₂)'], n: 'P1' }, run: function (e) { e.s.set(0, 0, 90, 2); } },
        { cap: 'P2 : si deux droites sont parallèles, **toute perpendiculaire à l\'une** est perpendiculaire à l\'autre.', ar: 'إذا كان مستقيمان متوازيين فكل مستقيم عمودي على أحدهما يكون عموديا على الآخر.', hud: { h: ['(d₁) // (d₂) et (d) ⊥ (d₁)'], c: ['(d) ⊥ (d₂)'], n: 'P2' }, run: function (e) { e.s.set(0, 0, 90, 1); setTimeout(function () { e.s.set(0, 0, 90, 2); }, 900); } },
        { cap: 'P3 : si deux droites sont **parallèles à une même droite**, elles sont parallèles entre elles.', ar: 'إذا كان مستقيمان موازيين لنفس المستقيم فإنهما متوازيان.', hud: { h: ['(d₁) // (d) et (d₂) // (d)'], c: ['(d₁) // (d₂)'], n: 'P3' }, run: function (e) { e.s.set(20, 20, 20); } },
        { cap: 'Si les angles diffèrent, les droites finissent par se **couper** : elles sont **sécantes**.', ar: 'إذا اختلف الميل فإن المستقيمين يتقاطعان: إنهما متقاطعان.', hud: { h: 'pentes différentes', c: ['sécantes'], n: '–' }, run: function (e) { e.s.set(10, -15, null); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Tourne (d₂). Quand est-elle parallèle à (d₁) ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Deux droites' }, st);
          var s = scene(svg), set = MV.hud(c, [['a', 'angle de (d₂)'], ['p', 'position', 1]]);
          MV.slider(c, { label: 'angle (°)', min: -30, max: 30, value: -20, step: 5 }, function (a) { s.set(10, a, null); set('a', a + '°'); set('p', a === 10 ? 'parallèles' : 'sécantes'); if (a === 10) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', '(d₁) a un angle de 10°.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'On sait : (d₁) // (d₂) et (d) ⊥ (d₁). Que dire de (d) et (d₂) ?',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. On utilise la propriété :', o: ['P2', 'P1', 'P3'], a: 0 },
            { type: 'opt', q: 'Étape 2. Conclusion :', o: ['(d) ⊥ (d₂)', '(d) // (d₂)'], a: 0 },
            { q: 'Étape 3. L\'angle entre (d) et (d₂) mesure ? °', a: 90 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Deux droites qui ne se coupent jamais sont :', o: ['parallèles', 'perpendiculaires'], a: 0 },
      { lvl: 'Niveau 2', q: '(a) ⊥ (c) et (b) ⊥ (c). Alors :', o: ['(a) // (b)', '(a) ⊥ (b)'], a: 0 },
      { lvl: 'Niveau 3', q: '(a) // (c) et (b) // (c). Alors :', o: ['(a) // (b)', '(a) ⊥ (b)'], a: 0 },
      { lvl: 'Niveau 4', q: 'Une échelle de 8 barreaux parallèles. Une barre verticale est perpendiculaire au 1er barreau. À combien de barreaux est-elle perpendiculaire ?', a: 8 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'La traverse',
      hud: [['d', 'données'], ['p', 'propriété'], ['c', 'conclusion']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Les rails sont **parallèles** et la traverse est perpendiculaire au premier.', hud: { d: ['rails // ; traverse ⊥ rail 1'], p: '–', c: '–' }, run: function (e) { e.s.set(0, 0, 90, 1); } },
        { cap: 'Par **P2**, elle est perpendiculaire au second rail.', ar: 'حسب الخاصية الثانية، العارضة عمودية على السكة الثانية.', hud: { d: 'rails // ; traverse ⊥ rail 1', p: ['P2'], c: ['traverse ⊥ rail 2'] }, run: function (e) { e.s.set(0, 0, 90, 2); } }
      ]
    },

    retenir: [
      '<b>P1</b> : deux droites perpendiculaires à une même droite sont parallèles. <b>P2</b> : si deux droites sont parallèles, toute perpendiculaire à l\'une est perpendiculaire à l\'autre.',
      '<b>P3</b> : deux droites parallèles à une même droite sont parallèles. Notations : <b class="mono">//</b> parallèles, <b class="mono">⊥</b> perpendiculaires.'
    ],
    retenirAr: 'مستقيمان عموديان على نفس المستقيم متوازيان. إذا توازى مستقيمان فكل عمودي على أحدهما عمودي على الآخر. مستقيمان موازيان لنفس المستقيم متوازيان.',
    voc: [['parallèles', 'متوازيان'], ['perpendiculaires', 'متعامدان'], ['sécantes', 'متقاطعان'], ['une équerre', 'مزواة']]
  });
})();
