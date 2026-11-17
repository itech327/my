/* @meta {"id":"2ac-detection","level":"2","order":7,"theme":"Fonctions électroniques","title":"La fonction « Détection »","ar":"وظيفة الكشف","lead":"Le soir, l’éclairage du jardin s’allume tout seul ; le ventilateur démarre quand il fait chaud. Un composant « sent » la lumière ou la chaleur. Lequel ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, SEUIL = 30;

  function rLdr(l) { return 100 * Math.pow(0.01, l / 100); } // kΩ : 100 dans le noir, 1 en plein jour
  function rCtn(t) { return 10 * Math.pow(0.5, (t - 25) / 15); } // kΩ, thermistance CTN
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function soleil(l) {
      S('rect', { x: 0, y: 0, width: 360, height: 210, fill: '#0b1422', opacity: (1 - l / 100) * 0.6 }, dyn);
      S('circle', { cx: 50, cy: 46, r: 18, fill: l > SEUIL ? '#f2c14e' : '#c9ced6', opacity: 0.4 + 0.6 * l / 100 }, dyn);
      T(dyn, 50, 86, l > SEUIL ? 'jour' : 'nuit', 'tag');
    }
    function ldr(l) {
      soleil(l);
      var r = rLdr(l), on = l < SEUIL;
      S('rect', { x: 120, y: 80, width: 60, height: 24, rx: 12, fill: '#c0392b', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
      S('path', { d: 'M126 92Q133 84 140 92T154 92T168 92', stroke: '#f2c14e', 'stroke-width': 2, fill: 'none' }, dyn);
      T(dyn, 150, 128, 'LDR : ' + (r >= 10 ? Math.round(r) : MV.fmt(r, 1)) + ' kΩ', 'lbl');
      S('path', { d: 'M150 104V150H250', stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, dyn);
      if (on) S('circle', { cx: 280, cy: 80, r: 34, fill: 'rgba(255,230,120,.3)' }, dyn);
      S('circle', { cx: 280, cy: 80, r: 16, fill: on ? '#fff3b0' : '#26292d', stroke: '#e9e9ea', 'stroke-width': 2.5 }, dyn);
      S('path', { d: 'M280 96V150H250', stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, dyn);
      T(dyn, 280, 180, on ? 'lampe de jardin allumée' : 'lampe éteinte', 'tag');
      T(dyn, 180, 30, 'lumière : ' + l + ' %', 'lbl');
    }
    function ctn(t) {
      var r = rCtn(t), on = t >= 30;
      S('rect', { x: 40, y: 40, width: 22, height: 120, rx: 11, fill: '#1d1f22', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
      var h = Math.max(6, Math.min(110, (t - 10) * 3.4));
      S('rect', { x: 46, y: 155 - h, width: 10, height: h, rx: 5, fill: '#e5484d' }, dyn);
      T(dyn, 51, 182, t + ' °C', 'lbl');
      S('rect', { x: 120, y: 82, width: 60, height: 20, fill: '#1d1f22', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
      S('path', { d: 'M114 112L186 72M180 72H186V78', stroke: '#e9e9ea', 'stroke-width': 1.5, fill: 'none' }, dyn);
      T(dyn, 150, 128, 'CTN : ' + MV.fmt(r, 1) + ' kΩ', 'lbl');
      var f = S('g', {}, dyn);
      [0, 120, 240].forEach(function (a) { S('ellipse', { cx: 280, cy: 70, rx: 7, ry: 22, fill: '#9aa0a8', transform: 'rotate(' + a + ' 280 92)' }, f); });
      if (on) S('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 280 92', to: '360 280 92', dur: '.5s', repeatCount: 'indefinite' }, f);
      T(dyn, 280, 140, on ? 'ventilateur en marche' : 'ventilateur arrêté', 'tag');
    }
    function types(hot) {
      [['LDR', 'lumière'], ['thermistance', 'température'], ['ILS', 'aimant'], ['fin de course', 'contact'], ['PIR', 'présence'], ['humidité', 'eau']].forEach(function (c, i) {
        var x = 14 + (i % 3) * 114, y = 22 + Math.floor(i / 3) * 90, on = hot === i;
        S('rect', { x: x, y: y, width: 104, height: 74, rx: 10, fill: on ? 'var(--acc-bg)' : '#1d1f22', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 2 }, dyn);
        T(dyn, x + 52, y + 32, c[0], 'lbl'); T(dyn, x + 52, y + 54, c[1], 'tag');
      });
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.l != null) ldr(o.l); else if (o.t != null) ctn(o.t); else types(o.hot);
    };
    return g;
  }

  MV.lesson({
    id: '2ac-detection',
    objectif: {
      fr: 'Savoir que détecter, c’est prélever une information ; utiliser la photorésistance (LDR) et la thermistance (CTN), et choisir un détecteur selon ce qu’on veut détecter.',
      ar: 'معرفة أن الكشف هو أخذ معلومة، واستعمال المقاومة الضوئية والمقاومة الحرارية، واختيار كاشف حسب ما نريد كشفه.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'L’éclairage du jardin',
      hud: [['l', 'lumière'], ['e', 'éclairage']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'En plein jour, l’éclairage du jardin reste **éteint**.', hud: { l: ['90 %'], e: 'éteint' }, run: function (e) { e.s.set({ l: 90 }); } },
        { cap: 'Le soir tombe : il s’**allume tout seul**.', hud: { l: ['15 %'], e: ['allumé'] }, run: function (e) { e.s.set({ l: 15 }); } },
        { cap: 'Quel composant « **sent** » la lumière ?', hud: { l: '15 %', e: 'allumé' }, run: function (e) { e.s.set({ l: 15 }); } }
      ]
    },

    prepare: [
      ['Une résistance peut changer de valeur selon la lumière.', true, 'C’est la photorésistance (LDR).'],
      ['Un détecteur donne une information au système.', true, 'Il renseigne sur l’état ou l’environnement.'],
      ['Un détecteur de présence fonctionne avec un aimant.', false, 'Le PIR détecte la chaleur d’un corps qui bouge.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Détecteurs',
      hud: [['c', 'composant'], ['r', 'règle']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Détecter**, c’est prélever une **information** : lumière, température, présence…', ar: 'الكشف هو أخذ معلومة: الضوء، الحرارة، الحضور…', hud: { c: ['détecteurs'], r: 'informer' }, run: function (e) { e.s.set({}); } },
        { cap: '**LDR** : en plein jour, sa résistance est **faible**.', ar: 'المقاومة الضوئية: في النهار تكون قيمتها ضعيفة.', hud: { c: ['LDR'], r: ['lumière ↑ → R ↓'] }, run: function (e) { e.s.set({ l: 90 }); } },
        { cap: 'La nuit, sa résistance devient **grande** : le circuit allume la lampe.', ar: 'في الليل تصبح قيمتها كبيرة فتشتعل اللمبة.', hud: { c: 'LDR', r: ['nuit → R grande'] }, run: function (e) { e.s.set({ l: 10 }); } },
        { cap: '**Thermistance CTN** : quand il fait plus **chaud**, sa résistance **diminue**.', ar: 'المقاومة الحرارية CTN: عندما ترتفع الحرارة تنخفض مقاومتها.', hud: { c: ['CTN'], r: ['chaleur ↑ → R ↓'] }, run: function (e) { e.s.set({ t: 35 }); } },
        { cap: 'Autres détecteurs : **ILS** (aimant), **fin de course** (contact), **PIR** (présence).', ar: 'كواشف أخرى: ILS بالمغناطيس، نهاية الشوط بالتماس، PIR للحضور.', hud: { c: ['ILS, PIR…'], r: 'choisir selon le besoin' }, run: function (e) { e.s.set({ hot: 4 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Fais baisser la lumière. Observe la résistance de la LDR et allume l’éclairage du jardin.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Photorésistance' }, st);
          var s = scene(svg), set = MV.hud(c, [['l', 'lumière'], ['r', 'R de la LDR', 1], ['e', 'éclairage']]);
          MV.slider(c, { label: 'lumière', min: 0, max: 100, step: 5, value: 80, fmt: function (v) { return v + ' %'; } }, function (l) {
            var r = rLdr(l); s.set({ l: l }); set('l', l + ' %'); set('r', (r >= 10 ? Math.round(r) : MV.fmt(r, 1)) + ' kΩ'); set('e', l < SEUIL ? 'allumé' : 'éteint'); if (l < SEUIL) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Choisis le bon détecteur.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Quand la lumière augmente, la résistance d’une LDR :', o: ['diminue', 'augmente'], a: 0 },
            { type: 'opt', q: 'Étape 2. Pour un thermostat de chauffe-eau, on utilise :', o: ['une thermistance', 'une LDR'], a: 0 },
            { type: 'opt', q: 'Étape 3. Pour savoir si une fenêtre est ouverte, avec un aimant :', o: ['un ILS', 'un PIR'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Une LDR détecte :', o: ['la lumière', 'le son'], a: 0 },
      { lvl: 'Niveau 2', q: 'Un détecteur PIR détecte :', o: ['la chaleur d’une personne qui bouge', 'la couleur d’un objet'], a: 0 },
      { lvl: 'Niveau 3', q: 'Thermistance CTN : quand il fait plus chaud, sa résistance :', o: ['diminue', 'augmente'], a: 0 },
      { lvl: 'Niveau 4', q: 'LDR : 80 kΩ dans le noir, 2 kΩ en plein jour. Combien de fois plus grande dans le noir ?', a: 40 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le composant qui sent',
      hud: [['l', 'lumière'], ['e', 'éclairage']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'C’est la **LDR** : la nuit, sa résistance devient grande et le circuit allume la lampe.', hud: { l: '15 %', e: ['allumé'] }, run: function (e) { e.s.set({ l: 15 }); } },
        { cap: 'Pour la chaleur, la **thermistance** fait démarrer le ventilateur.', ar: 'بالنسبة للحرارة، المقاومة الحرارية تشغل المروحة.', hud: { l: '–', e: ['ventilateur'] }, run: function (e) { e.s.set({ t: 35 }); } }
      ]
    },

    retenir: [
      '<b>Détecter</b> = prélever une information sur l’environnement. <b>LDR</b> (photorésistance) : sa résistance <b>diminue</b> quand la lumière augmente. <b>CTN</b> (thermistance) : sa résistance <b>diminue</b> quand la température augmente.',
      'On choisit le détecteur selon l’information : ILS (aimant), fin de course (contact), PIR (présence), capteur d’humidité (eau).'
    ],
    retenirAr: 'الكشف هو أخذ معلومة من المحيط. المقاومة الضوئية تنخفض قيمتها كلما زاد الضوء، والمقاومة الحرارية CTN تنخفض قيمتها كلما ارتفعت الحرارة.',
    voc: [['détecter', 'الكشف'], ['une photorésistance', 'مقاومة ضوئية'], ['une thermistance', 'مقاومة حرارية'], ['un détecteur de présence', 'كاشف الحضور'], ['un capteur', 'لاقط']]
  });
})();
