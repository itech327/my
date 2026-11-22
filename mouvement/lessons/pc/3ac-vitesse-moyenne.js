/* @meta {"id":"3ac-vitesse-moyenne","level":"3","order":9,"theme":"Mécanique","title":"La vitesse moyenne","ar":"السرعة المتوسطة","lead":"Un car roule de Casablanca à Rabat : on suit la distance et le temps pour comprendre la vitesse moyenne."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var X0 = 30, X1 = 330, KM = (X1 - X0) / 90; // 90 km sur la route

  /* route, car, trace et horloge : partagés par l'ouverture, « je regarde » et le bilan */
  function route(svg, opts) {
    var e = {}, y = 200;
    S('rect', { x: 0, y: y + 8, width: 360, height: 60, fill: '#1b1c1f' }, svg);
    S('line', { x1: X0, y1: y + 4, x2: X1, y2: y + 4, stroke: '#3a3d42', 'stroke-width': 10, 'stroke-linecap': 'round' }, svg);
    S('line', { x1: X0, y1: y + 4, x2: X1, y2: y + 4, stroke: '#6b6f76', 'stroke-width': 1.5, 'stroke-dasharray': '8 8' }, svg);
    T(svg, X0, y + 34, 'Casablanca', 'tag'); T(svg, X1, y + 34, 'Rabat', 'tag');
    if (opts.ticks) {
      e.ticks = S('g', {}, svg);
      for (var k = 0; k <= 90; k += 15) {
        S('line', { x1: X0 + k * KM, y1: y + 14, x2: X0 + k * KM, y2: y + 20, stroke: '#6b6f76' }, e.ticks);
        T(e.ticks, X0 + k * KM, y + 52, k, 'tag');
      }
      T(e.ticks, X1 + 6, y + 64, 'km', 'tag', 'end');
    }
    e.peage = S('g', {}, svg);
    var px = X0 + 35 * KM;
    S('rect', { x: px - 10, y: y - 34, width: 20, height: 26, rx: 3, fill: 'none', stroke: '#9aa0a8', 'stroke-width': 2 }, e.peage);
    T(e.peage, px, y - 40, 'péage', 'tag');
    // trace parcourue
    e.trace = S('line', { x1: X0, y1: y + 4, x2: X0, y2: y + 4, stroke: 'var(--acc)', 'stroke-width': 4, 'stroke-linecap': 'round' }, svg);
    e.trace.style.opacity = 1;
    e.trace.style.transition = 'all 1.2s ease-in-out';
    // car
    var car = S('g', {}, svg);
    S('rect', { x: -20, y: y - 20, width: 40, height: 18, rx: 4, fill: '#d9dbe0' }, car);
    S('rect', { x: 8, y: y - 17, width: 9, height: 7, rx: 1.5, fill: '#5b6068' }, car);
    S('circle', { cx: -11, cy: y - 2, r: 4.5, fill: '#2a2c30', stroke: '#9aa0a8' }, car);
    S('circle', { cx: 11, cy: y - 2, r: 4.5, fill: '#2a2c30', stroke: '#9aa0a8' }, car);
    car.style.transition = 'transform 1.2s ease-in-out';
    e.car = car; car.style.opacity = 1;
    e.move = function (km) {
      var x = X0 + km * KM;
      car.style.transform = 'translate(' + x + 'px,0px)';
      e.trace.setAttribute('x2', x);
    };
    // horloge : 60 min = un tour
    var cx = 300, cy = 70;
    e.horloge = S('g', {}, svg);
    S('circle', { cx: cx, cy: cy, r: 30, fill: '#17181a', stroke: '#5b6068', 'stroke-width': 2 }, e.horloge);
    for (var m = 0; m < 12; m++) {
      var a = m * Math.PI / 6;
      S('line', { x1: cx + 25 * Math.sin(a), y1: cy - 25 * Math.cos(a), x2: cx + 29 * Math.sin(a), y2: cy - 29 * Math.cos(a), stroke: '#5b6068' }, e.horloge);
    }
    var hand = S('line', { x1: cx, y1: cy, x2: cx, y2: cy - 24, stroke: 'var(--acc)', 'stroke-width': 3, 'stroke-linecap': 'round' }, e.horloge);
    hand.style.cssText = 'transition:transform 1.2s ease-in-out;transform-box:view-box;transform-origin:' + cx + 'px ' + cy + 'px';
    e.tps = T(e.horloge, cx, cy + 46, '0 min', 'lbl');
    e.clock = function (min) { hand.style.transform = 'rotate(' + (min * 6) + 'deg)'; e.tps.textContent = min + ' min'; };
    return e;
  }
  function pick(e, names) { var o = {}; names.forEach(function (n) { o[n] = e[n]; }); return o; }

  MV.lesson({
    id: '3ac-vitesse-moyenne',
    objectif: {
      fr: 'Calculer une vitesse moyenne à partir d\'une distance et d\'une durée, et l\'exprimer en km/h ou en m/s.',
      ar: 'حساب السرعة المتوسطة انطلاقا من المسافة والمدة، والتعبير عنها بـ [[km/h]] أو [[m/s]].'
    },

    ouverture: {
      vb: '0 0 360 280', label: 'Un car entre Casablanca et Rabat',
      hud: [['h', 'heure'], ['d', 'distance'], ['v', 'vitesse moy.']],
      draw: function (svg) {
        var e = route(svg, {}); var vit = S('g', {}, svg);
        S('rect', { x: 120, y: 120, width: 120, height: 30, rx: 8, fill: '#17181a', stroke: '#5b6068' }, vit);
        T(vit, 180, 140, 'compteur : 100 km/h', 'lbl');
        var o = pick(e, ['peage', 'horloge']); o.compteur = vit; o.ctl = e; return o;
      },
      steps: [
        { cap: 'Un car quitte **Casablanca** à 8 h 00.', on: ['horloge'], hud: { h: ['8 h 00'], d: '0 km', v: '–' }, run: function (e) { e.ctl.move(0); e.ctl.clock(0); } },
        { cap: 'Il arrive à **Rabat** à 9 h 30, après environ 90 km.', on: ['horloge'], hud: { h: ['9 h 30'], d: ['90 km'], v: '–' }, run: function (e) { e.ctl.move(90); e.ctl.clock(90); } },
        { cap: 'Le compteur a parfois indiqué **100 km/h**. Et il s\'est arrêté au **péage**.', on: ['horloge', 'peage', 'compteur'], hud: { h: '9 h 30', d: '90 km', v: '–' }, run: function (e) { e.ctl.move(90); e.ctl.clock(90); } },
        { cap: 'Quelle est sa **vitesse moyenne** ? On le saura à la fin.', on: ['horloge', 'peage'], hud: { h: '9 h 30', d: '90 km', v: ['?'] }, run: function (e) { e.ctl.move(90); e.ctl.clock(90); } }
      ]
    },

    predire: {
      q: "Un car quitte Casablanca à 8 h 00 et arrive à Rabat à 9 h 30, après environ 90 km. Quelle est sa vitesse moyenne ?",
      ar: "حافلة تغادر الدار البيضاء على [[8 h 00]] وتصل الرباط على [[9 h 30]] بعد نحو [[90 km]]. ما سرعتها المتوسطة؟",
      o: ["100 km/h", "60 km/h", "90 km/h"],
      a: 1,
      e: "v = d ÷ t = 90 km ÷ 1,5 h = 60 km/h. Le compteur a parfois indiqué 100 km/h, mais la vitesse moyenne tient compte de toute la durée, arrêt au péage compris.",
      ear: "[[v = d ÷ t = 90 ÷ 1,5 = 60 km/h]]. السرعة المتوسطة تحتسب المدة كلها بما فيها التوقف."
    },

    prepare: [
      ['1 h 30 min = 1,30 h', false, '30 min, c\'est la moitié d\'une heure : 1 h 30 min = 1,5 h.'],
      ['1 km = 1 000 m', true, 'Le préfixe kilo signifie mille.'],
      ['Pour une même distance, celui qui met moins de temps va plus vite.', true, 'Moins de temps pour la même distance : la vitesse est plus grande.']
    ],

    regarde: {
      vb: '0 0 360 280', label: 'Le car avance et l\'horloge tourne',
      hud: [['d', 'distance'], ['t', 'durée'], ['v', 'vitesse moy.']],
      draw: function (svg) {
        var e = route(svg, { ticks: true }); var f = S('g', {}, svg);
        S('rect', { x: 30, y: 46, width: 200, height: 48, rx: 10, fill: '#17181a', stroke: 'var(--acc)' }, f);
        T(f, 130, 77, 'v = d ÷ t', 'lbl big');
        var conv = S('g', {}, svg);
        S('rect', { x: 30, y: 104, width: 200, height: 30, rx: 8, fill: '#17181a', stroke: '#5b6068' }, conv);
        T(conv, 130, 124, '1 h 30 min = 1,5 h', 'lbl');
        var o = pick(e, ['peage', 'horloge', 'ticks']); o.formule = f; o.conv = conv; o.ctl = e; return o;
      },
      steps: [
        { cap: 'Pour mesurer une vitesse, on suit une **distance** et une **durée**.', ar: 'لقياس السرعة نتتبع المسافة المقطوعة والمدة الزمنية.', on: ['ticks', 'horloge'], hud: { d: '0 km', t: '0 min', v: '–' }, run: function (e) { e.ctl.move(0); e.ctl.clock(0); } },
        { cap: 'En **30 min**, le car parcourt 35 km.', ar: 'في 30 دقيقة تقطع الحافلة 35 كيلومترا.', on: ['ticks', 'horloge', 'peage'], hud: { d: ['35 km'], t: ['30 min'], v: '–' }, run: function (e) { e.ctl.move(35); e.ctl.clock(30); } },
        { cap: 'Arrêt de **10 min** au péage : la durée augmente, la distance non.', ar: 'توقف 10 دقائق في محطة الأداء: المدة تزداد والمسافة لا تتغير.', on: ['ticks', 'horloge', 'peage'], hud: { d: '35 km', t: ['40 min'], v: '–' }, run: function (e) { e.ctl.move(35); e.ctl.clock(40); } },
        { cap: 'Puis **50 min** de route : il arrive, 90 km au total.', ar: 'ثم 50 دقيقة من السير حتى الوصول: [[90 km]] في المجموع.', on: ['ticks', 'horloge', 'peage'], hud: { d: ['90 km'], t: ['90 min'], v: '–' }, run: function (e) { e.ctl.move(90); e.ctl.clock(90); } },
        { cap: 'On divise la **distance totale** par la **durée totale**.', ar: 'نقسم المسافة الكلية على المدة الكلية.', on: ['ticks', 'horloge', 'formule'], hud: { d: '90 km', t: '90 min', v: '–' }, run: function (e) { e.ctl.move(90); e.ctl.clock(90); } },
        { cap: 'D\'abord, la durée en heures : 90 min = **1,5 h**.', ar: 'نحول المدة إلى الساعات: [[90 min = 1,5 h]].', on: ['ticks', 'horloge', 'formule', 'conv'], hud: { d: '90 km', t: ['1,5 h'], v: '–' }, run: function (e) { e.ctl.move(90); e.ctl.clock(90); } },
        { cap: 'v = 90 ÷ 1,5 = **60 km/h**.', ar: 'السرعة المتوسطة: [[v = 90 ÷ 1,5 = 60 km/h]].', on: ['ticks', 'horloge', 'formule', 'conv'], hud: { d: '90 km', t: '1,5 h', v: ['60 km/h'] }, run: function (e) { e.ctl.move(90); e.ctl.clock(90); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change la distance et la durée. Compare ton véhicule au véhicule gris qui roule à 60 km/h.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 150', role: 'img', 'aria-label': 'Deux véhicules qui roulent' }, st);
          [55, 115].forEach(function (y) { S('line', { x1: 10, y1: y, x2: 350, y2: y, stroke: '#3a3d42', 'stroke-width': 8, 'stroke-linecap': 'round' }, svg); });
          T(svg, 12, 38, 'référence · 60 km/h', 'tag', 'start'); T(svg, 12, 98, 'ton véhicule', 'tag', 'start');
          function veh(y, col) { var g = S('g', {}, svg); S('rect', { x: -14, y: y - 14, width: 28, height: 12, rx: 3, fill: col }, g); return g; }
          var ref = veh(55, '#9aa0a8'), me = veh(115, 'var(--acc)');
          var d = 120, t = 120, set, xr = 10, xm = 10, last = 0;
          function frame(ts) {
            var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts;
            var v = d / (t / 60);
            xr += 60 * 1.2 * dt; xm += v * 1.2 * dt;
            if (xr > 350) xr = 10; if (xm > 350) xm = 10;
            ref.setAttribute('transform', 'translate(' + xr + ',0)'); me.setAttribute('transform', 'translate(' + xm + ',0)');
            requestAnimationFrame(frame);
          }
          function upd() {
            var h = t / 60, v = d / h;
            if (set) { set('t', MV.fmt(h) + ' h'); set('v', MV.fmt(v, 1) + ' km/h'); set('ms', MV.fmt(v / 3.6, 1) + ' m/s'); }
          }
          MV.slider(c, { label: 'distance', min: 10, max: 300, step: 10, value: 120, fmt: function (v) { return v + ' km'; } }, function (v) { d = v; upd(); });
          MV.slider(c, { label: 'durée', min: 15, max: 300, step: 15, value: 120, fmt: function (v) { return v + ' min'; } }, function (v) { t = v; upd(); });
          set = MV.hud(c, [['t', 'durée en h'], ['v', 'vitesse', 1], ['ms', 'en m/s', 1]]);
          upd(); requestAnimationFrame(frame); done();
        } },
      { title: 'Résolvons ensemble', intro: 'Un cycliste parcourt 30 km en 1 h 30 min. Calcule sa vitesse moyenne.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. La durée en heures :', o: ['1,30 h', '1,5 h', '90 h'], a: 1, e: '30 min = 0,5 h, donc 1 h 30 min = 1,5 h.', ko: '30 minutes, c\'est une demi-heure.' },
            { type: 'opt', q: 'Étape 2. Quelle relation utiliser ?', o: ['v = d × t', 'v = d ÷ t', 'v = t ÷ d'], a: 1, e: 'On divise la distance par la durée.', ko: 'La vitesse est une distance par unité de temps.' },
            { q: 'Étape 3. v = 30 ÷ 1,5 = ?', a: 20, unit: 'km/h', ok: 'Le cycliste roule en moyenne à 20 km/h.', hint: 'Combien de fois 1,5 dans 30 ? Pense à 3 ÷ 0,15 ou à 60 ÷ 3.' },
            { q: 'Étape 4. En m/s : 20 ÷ 3,6 ≈ ? (au dixième)', a: 5.6, tol: 0.06, unit: 'm/s', ok: '20 km/h ≈ 5,6 m/s.', hint: '1 m/s = 3,6 km/h, donc on divise par 3,6.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Une voiture parcourt 120 km en 2 h. Calcule sa vitesse moyenne.', a: 60, unit: 'km/h', hint: 'v = 120 ÷ 2.' },
      { lvl: 'Niveau 2', q: 'Un élève court 100 m en 20 s. Calcule sa vitesse moyenne.', a: 5, unit: 'm/s', hint: 'v = 100 ÷ 20.' },
      { lvl: 'Niveau 3', q: 'Un train roule à 72 km/h. Convertis cette vitesse en m/s.', a: 20, unit: 'm/s', hint: 'On divise par 3,6 : 72 ÷ 3,6.' },
      { lvl: 'Niveau 4', q: 'Un car roule à 80 km/h de moyenne pendant 45 min. Quelle distance parcourt-il ?', a: 60, unit: 'km', hint: '45 min = 0,75 h et d = v × t = 80 × 0,75.' }
    ],

    bilan: {
      vb: '0 0 360 280', label: 'Le car est arrivé à Rabat',
      hud: [['d', 'distance'], ['t', 'durée'], ['v', 'vitesse moy.']],
      draw: function (svg) {
        var e = route(svg, { ticks: true }); var cpt = S('g', {}, svg);
        S('rect', { x: 30, y: 60, width: 210, height: 64, rx: 10, fill: '#17181a', stroke: '#5b6068' }, cpt);
        T(cpt, 135, 86, 'compteur max : 100 km/h', 'lbl'); T(cpt, 135, 110, 'moyenne : 60 km/h', 'lbl big acc');
        var o = pick(e, ['peage', 'horloge', 'ticks']); o.compteur = cpt; o.ctl = e; return o;
      },
      steps: [
        { cap: 'Retour au car : **90 km** en **1 h 30 min**.', on: ['ticks', 'horloge', 'peage'], hud: { d: ['90 km'], t: ['1,5 h'], v: '–' }, run: function (e) { e.ctl.move(90); e.ctl.clock(90); } },
        { cap: 'v = 90 ÷ 1,5 = **60 km/h**.', ar: 'السرعة المتوسطة للحافلة [[60 km/h]].', on: ['ticks', 'horloge'], hud: { d: '90 km', t: '1,5 h', v: ['60 km/h'] }, run: function (e) { e.ctl.move(90); e.ctl.clock(90); } },
        { cap: 'Le compteur montrait 100 km/h, mais la moyenne compte **aussi les arrêts**.', ar: 'السرعة المتوسطة أصغر من أكبر سرعة لأنها تحسب أيضا مدة التوقف.', on: ['ticks', 'horloge', 'peage', 'compteur'], hud: { d: '90 km', t: '1,5 h', v: ['60 km/h'] }, run: function (e) { e.ctl.move(90); e.ctl.clock(90); } }
      ]
    },

    retenir: [
      'Vitesse moyenne : <b class="mono">v = d ÷ t</b>, avec d la distance parcourue et t la durée du parcours.',
      'Unités : km/h ou m/s. Pour passer des km/h aux m/s, on divise par 3,6.'
    ],
    retenirAr: 'السرعة المتوسطة تساوي المسافة المقطوعة مقسومة على مدة قطعها: [[v = d ÷ t]]. للتحويل من [[km/h]] إلى [[m/s]] نقسم على [[3,6]].',
    voc: [['la vitesse moyenne', 'السرعة المتوسطة'], ['la distance parcourue', 'المسافة المقطوعة'], ['la durée', 'المدة الزمنية'], ['le mouvement', 'الحركة']]
  });
})();
