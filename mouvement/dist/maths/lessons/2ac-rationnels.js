/* @meta {"id":"2ac-rationnels","level":"2","order":1,"theme":"Nombres et calcul","title":"Les nombres rationnels","ar":"الأعداد الجذرية","lead":"La température baisse de 7 °C en 2 heures : −7/2 par heure. Un quotient de relatifs se place sur la droite graduée."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 180, U = 36; // 0 au centre, 1 unité = 36 px

  function droite(svg, y) {
    var g = S('g', {}, svg);
    S('line', { x1: 10, y1: y, x2: 350, y2: y, stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    for (var k = -4; k <= 4; k++) { S('line', { x1: X0 + k * U, y1: y - 7, x2: X0 + k * U, y2: y + 7, stroke: '#9aa0a8', 'stroke-width': k ? 1.5 : 3 }, g); T(g, X0 + k * U, y + 26, k, 'lbl'); }
    g.setAttribute('data-keep', 1);
    return g;
  }
  function point(svg, y) {
    var g = S('g', {}, svg), c = S('circle', { cx: 0, cy: y, r: 8, fill: 'var(--acc)', stroke: '#fff', 'stroke-width': 2 }, g), t = T(g, 0, y - 18, '', 'lbl big acc');
    g.style.transition = 'transform .9s ease-in-out';
    g.at = function (v, lab) { g.style.transform = 'translate(' + (X0 + v * U) + 'px,0)'; t.textContent = lab; };
    return g;
  }

  MV.lesson({
    id: '2ac-rationnels',
    objectif: {
      fr: 'Écrire un quotient de deux nombres relatifs, trouver son signe et le placer sur une droite graduée.',
      ar: 'كتابة خارج عددين نسبيين، وتحديد إشارته، وتمثيله على مستقيم مدرج.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'Une température qui baisse',
      hud: [['d', 'départ'], ['a', 'arrivée'], ['h', 'par heure']],
      draw: function (svg) {
        var e = {};
        S('rect', { x: 166, y: 20, width: 28, height: 170, rx: 14, fill: '#2b2e33', stroke: '#9aa0a8', 'stroke-width': 2 }, svg);
        for (var k = 0; k <= 8; k++) { S('line', { x1: 194, y1: 40 + k * 16, x2: 204, y2: 40 + k * 16, stroke: '#9aa0a8' }, svg); T(svg, 214, 44 + k * 16, 4 - k, 'tag', 'start'); }
        var m = S('rect', { x: 174, y: 0, width: 12, height: 0, rx: 6, fill: 'var(--acc)' }, svg);
        m.style.transition = 'all 1s'; e.m = m; m.setAttribute('data-keep', 1);
        e.lv = function (t) { var y = 40 + (4 - t) * 16; m.setAttribute('y', y); m.setAttribute('height', 182 - y); };
        T(svg, 90, 60, 'Ifrane, une nuit d\'hiver', 'tag');
        return e;
      },
      steps: [
        { cap: 'À Ifrane, à 20 h, il fait **3 °C**.', hud: { d: ['3 °C'], a: '–', h: '–' }, run: function (e) { e.lv(3); } },
        { cap: 'À 22 h, il fait **−4 °C** : la température a baissé de 7 °C en 2 heures.', hud: { d: '3 °C', a: ['−4 °C'], h: '–' }, run: function (e) { e.lv(-4); } },
        { cap: 'Baisse par heure : **−7 ÷ 2**. Quel nombre est-ce ? On le saura à la fin.', hud: { d: '3 °C', a: '−4 °C', h: ['−7/2 ?'] }, run: function (e) { e.lv(-4); } }
      ]
    },

    prepare: [
      ['(−6) × 2 = −12', true, 'Signes contraires : produit négatif.'],
      ['(−6) ÷ (−2) = −3', false, 'Même signe : le quotient est positif. (−6) ÷ (−2) = 3.'],
      ['Sur une droite graduée, −2 est à gauche de −1.', true, 'Plus un nombre est petit, plus il est à gauche.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'Des quotients sur la droite graduée',
      hud: [['q', 'quotient'], ['s', 'signe'], ['v', 'valeur']],
      draw: function (svg) {
        var e = {}; droite(svg, 120); e.p = point(svg, 120); e.p.setAttribute('data-keep', 1);
        e.p2 = point(svg, 120);
        return e;
      },
      steps: [
        { cap: 'Un **nombre rationnel** s\'écrit a/b, avec a et b relatifs et b ≠ 0.', ar: 'العدد الجذري يكتب على شكل [[a/b]] حيث [[a]] و [[b]] عددان نسبيان و [[b ≠ 0]].', hud: { q: '3/2', s: '+', v: ['1,5'] }, run: function (e) { e.p.at(1.5, '3/2'); } },
        { cap: 'Signes contraires : le quotient est **négatif**. −6/3 = −2.', ar: 'إذا اختلفت الإشارتان فالخارج سالب.', hud: { q: '−6/3', s: ['−'], v: ['−2'] }, run: function (e) { e.p.at(-2, '−6/3'); } },
        { cap: 'Et 6/(−3) = **−2** aussi : le signe moins peut être en haut ou en bas.', ar: 'ونفس الشيء: [[6/(−3) = −6/3 = −2]].', hud: { q: '6/(−3)', s: '−', v: ['−2'] }, run: function (e) { e.p.at(-2, '6/(−3)'); } },
        { cap: 'Même signe : le quotient est **positif**. (−6)/(−3) = 2.', ar: 'إذا تشابهت الإشارتان فالخارج موجب.', hud: { q: '(−6)/(−3)', s: ['+'], v: ['2'] }, run: function (e) { e.p.at(2, '(−6)/(−3)'); } },
        { cap: '−7/2 : on coupe chaque unité en 2, on compte **7 moitiés** vers la gauche.', ar: 'لتمثيل [[−7/2]] نقسم الوحدة إلى نصفين ونعد 7 أنصاف نحو اليسار.', hud: { q: '−7/2', s: '−', v: ['−3,5'] }, run: function (e) { e.p.at(-3.5, '−7/2'); } },
        { cap: 'Comme pour les fractions : −2/3 = **−4/6**. Même point de la droite.', ar: 'كما في الكسور: [[−2/3 = −4/6]].', on: ['p2'], hud: { q: '−2/3 = −4/6', s: '−', v: ['≈ −0,67'] }, run: function (e) { e.p.at(-0.667, '−2/3'); e.p2.at(-0.667, ''); } },
        { cap: 'Pour comparer, on regarde la droite : **−7/2 < −1/2**.', ar: 'العدد الموجود على اليسار هو الأصغر: [[−7/2 < −1/2]].', on: ['p2'], hud: { q: '−7/2 et −1/2', s: '−', v: ['−3,5 < −0,5'] }, run: function (e) { e.p.at(-3.5, '−7/2'); e.p2.at(-0.5, '−1/2'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change le numérateur et le dénominateur. Regarde où le point se place.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 140', role: 'img', 'aria-label': 'Droite graduée' }, st);
          droite(svg, 80); var p = point(svg, 80), a = -7, b = 2, set;
          function upd() { var v = a / b, x = Math.max(-4.6, Math.min(4.6, v)); p.at(x, a + '/' + (b < 0 ? '(' + b + ')' : b)); if (set) { set('q', a + '/' + b); set('s', v > 0 ? '+' : v < 0 ? '−' : '0'); set('v', MV.fmt(Math.round(v * 100) / 100)); } }
          MV.slider(c, { label: 'a', min: -10, max: 10, value: -7 }, function (v) { a = v; upd(); });
          MV.slider(c, { label: 'b', min: -5, max: 5, value: 2 }, function (v) { b = v === 0 ? 1 : v; upd(); });
          set = MV.hud(c, [['q', 'a/b'], ['s', 'signe', 1], ['v', 'valeur', 1]]);
          MV.H('p', 'small', 'b = 0 est interdit : le curseur prend alors b = 1.', c);
          upd(); done();
        } },
      { title: 'Résolvons ensemble', intro: 'Simplifie −18/24 et place-le sur la droite.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Le signe de −18/24 est :', o: ['positif', 'négatif'], a: 1, e: 'Un seul signe moins : négatif.' },
            { q: 'Étape 2. On divise 18 et 24 par 6. −18/24 = ?/4 (écris le numérateur avec son signe)', a: -3, ok: '−18/24 = −3/4.', hint: '18 ÷ 6 = 3, et on garde le signe moins.' },
            { type: 'opt', q: 'Étape 3. −3/4 se trouve entre :', o: ['−1 et 0', '0 et 1', '−2 et −1'], a: 0, e: '−3/4 = −0,75.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Calcule −15/5.', a: -3, hint: '15 ÷ 5 = 3, signes contraires.' },
      { lvl: 'Niveau 2', q: 'Le signe de 7/(−2) est :', o: ['positif', 'négatif'], a: 1, e: 'Signes contraires.' },
      { lvl: 'Niveau 3', q: 'Compare −3/4 et −1/2.', o: ['−3/4 < −1/2', '−3/4 > −1/2', 'égaux'], a: 0, e: '−0,75 est à gauche de −0,5.' },
      { lvl: 'Niveau 4', q: 'Une citerne perd 9 L en 4 heures. Quelle variation par heure, en litres ? (nombre décimal)', a: -2.25, unit: 'L', hint: '−9/4.' }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'La baisse par heure',
      hud: [['q', 'quotient'], ['v', 'valeur'], ['s', 'sens']],
      draw: function (svg) { var e = {}; droite(svg, 120); e.p = point(svg, 120); e.p.setAttribute('data-keep', 1); return e; },
      steps: [
        { cap: 'Baisse de 7 °C en 2 h : **−7/2** °C par heure.', hud: { q: ['−7/2'], v: '–', s: '–' }, run: function (e) { e.p.at(0, ''); } },
        { cap: '−7/2 = **−3,5** : la température baisse de 3,5 °C par heure.', ar: 'تنخفض الحرارة ب [[3,5 °C]] في كل ساعة: [[−7/2 = −3,5]].', hud: { q: '−7/2', v: ['−3,5'], s: ['baisse'] }, run: function (e) { e.p.at(-3.5, '−7/2'); } }
      ]
    },

    retenir: [
      'Un <b>nombre rationnel</b> s\'écrit a/b avec a et b relatifs, b ≠ 0. Même signe : quotient <b>positif</b> ; signes contraires : quotient <b>négatif</b>.',
      'On ne change pas a/b en multipliant ou divisant a et b par un même nombre non nul. Sur la droite graduée, le plus petit est à gauche.'
    ],
    retenirAr: 'العدد الجذري يكتب [[a/b]] حيث [[a]] و [[b]] نسبيان و [[b ≠ 0]]. إذا تشابهت إشارتاهما فالخارج موجب، وإذا اختلفتا فهو سالب.',
    voc: [['un nombre rationnel', 'عدد جذري'], ['le quotient', 'الخارج'], ['le signe', 'الإشارة'], ['la droite graduée', 'المستقيم المدرج']]
  });
})();
