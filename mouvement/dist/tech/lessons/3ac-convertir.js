/* @meta {"id":"3ac-convertir","level":"3","order":7,"theme":"Chaîne d’énergie","title":"Convertir","ar":"التحويل","lead":"Le ventilateur a trois vitesses, la lampe éclaire et chauffe, le moteur tourne mais tiédit. Où va l’énergie électrique, et comment régler la vitesse d’un moteur ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, VMAX = 3000;
  var FORMES = [['moteur', 'mécanique', '#f2c14e'], ['lampe', 'lumineuse', '#fff3b0'], ['radiateur', 'thermique', '#e5484d'], ['haut-parleur', 'sonore', '#7fb2ff']];

  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function pwm(d) {
      S('rect', { x: 14, y: 12, width: 332, height: 80, rx: 8, fill: '#17181a', stroke: '#2c2f34' }, dyn);
      var p = 'M44 76', P = 40, hi = d / 100 * P;
      for (var i = 0; i < 7; i++) {
        var x = 44 + i * P;
        if (d === 0) p += 'H' + (x + P);
        else if (d === 100) p += 'V28H' + (x + P);
        else p += 'V28H' + (x + hi) + 'V76H' + (x + P);
      }
      S('path', { d: p, stroke: 'var(--acc)', 'stroke-width': 2.5, fill: 'none' }, dyn);
      T(dyn, 20, 32, '5 V', 'tag', 'start'); T(dyn, 20, 88, '0', 'tag', 'start');
      S('circle', { cx: 180, cy: 148, r: 26, fill: 'var(--acc-bg)', stroke: 'var(--acc)', 'stroke-width': 2.5 }, dyn);
      T(dyn, 180, 154, 'M', 'lbl big');
      if (d > 0) {
        var h = S('g', {}, dyn);
        S('path', { d: 'M180 116V126', stroke: '#fff', 'stroke-width': 3 }, h);
        S('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 180 148', to: '360 180 148', dur: (60 / (VMAX * d / 100) * 20).toFixed(2) + 's', repeatCount: 'indefinite' }, h);
      }
      T(dyn, 222, 140, 'PWM ' + d + ' %', 'tag', 'start');
      T(dyn, 222, 158, Math.round(VMAX * d / 100) + ' tr/min', 'lbl', 'start');
    }
    function sankey(pa, pu) {
      var k = 0.5, wa = pa * k, wu = pu * k, wp = wa - wu, top = 60;
      S('path', { d: 'M30 ' + (top + wa / 2) + 'H170', stroke: '#f2c14e', 'stroke-width': wa, fill: 'none' }, dyn);
      S('path', { d: 'M170 ' + (top + wu / 2) + 'H320', stroke: '#56d07f', 'stroke-width': wu, fill: 'none' }, dyn);
      S('path', { d: 'M170 ' + (top + wu + wp / 2) + 'H210Q240 ' + (top + wu + wp / 2) + ' 240 ' + (top + wu + wp / 2 + 40) + 'V182', stroke: '#e5484d', 'stroke-width': wp, fill: 'none' }, dyn);
      T(dyn, 100, top - 8, 'Pa = ' + pa + ' W (électrique)', 'tag');
      T(dyn, 300, top - 8, 'Pu = ' + pu + ' W', 'tag');
      T(dyn, 240, 198, 'pertes ' + (pa - pu) + ' W (chaleur)', 'tag');
      T(dyn, 300, top + wu + 18, 'η = ' + Math.round(100 * pu / pa) + ' %', 'lbl');
      var e = S('circle', { r: 4, fill: '#fff' }, dyn);
      S('animateMotion', { dur: '2s', repeatCount: 'indefinite', path: 'M30 ' + (top + wu / 2) + 'H320' }, e);
    }
    function formes(n) {
      FORMES.slice(0, n).forEach(function (f, i) {
        var y = 22 + i * 46;
        S('rect', { x: 30, y: y, width: 110, height: 34, rx: 6, fill: '#1d1f22', stroke: '#9aa0a8', 'stroke-width': 2 }, dyn);
        T(dyn, 85, y + 22, f[0], 'lbl');
        S('path', { d: 'M140 ' + (y + 17) + 'H206', stroke: f[2], 'stroke-width': 3 }, dyn);
        S('path', { d: 'M200 ' + (y + 11) + 'L210 ' + (y + 17) + 'L200 ' + (y + 23) + 'Z', fill: f[2] }, dyn);
        T(dyn, 218, y + 22, 'énergie ' + f[1], 'lbl', 'start');
      });
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.pwm != null) pwm(o.pwm);
      else if (o.pa) sankey(o.pa, o.pu);
      else if (o.formes) formes(o.formes);
    };
    return g;
  }

  MV.lesson({
    id: '3ac-convertir',
    objectif: {
      fr: 'Savoir que l’actionneur convertit l’énergie électrique en une autre forme, calculer un rendement, et régler la vitesse d’un moteur par le rapport cyclique (PWM).',
      ar: 'معرفة أن المنفذ يحول الطاقة الكهربائية إلى شكل آخر، وحساب المردود، وضبط سرعة محرك بالنسبة الدورية (PWM).'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Le ventilateur',
      hud: [['e', 'entre'], ['s', 'sort'], ['v', 'vitesse']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Un ventilateur reçoit de l’énergie **électrique**.', hud: { e: ['électrique'], s: '?', v: '–' }, run: function (e) { e.s.set({ pwm: 100 }); } },
        { cap: 'Il en sort du **mouvement**… et un peu de **chaleur** : le moteur tiédit.', hud: { e: 'électrique', s: ['mouvement + chaleur'], v: '–' }, run: function (e) { e.s.set({ pa: 60, pu: 42 }); } },
        { cap: 'Comment une carte de commande fait-elle tourner le moteur **plus lentement** ?', hud: { e: 'électrique', s: 'mouvement', v: ['?'] }, run: function (e) { e.s.set({ pwm: 50 }); } }
      ]
    },

    prepare: [
      ['Une lampe à incandescence chauffe en éclairant.', true, 'Une grande partie de son énergie devient de la chaleur.'],
      ['Un moteur transforme toute l’énergie reçue en mouvement.', false, 'Une partie se perd en chaleur : le moteur tiédit.'],
      ['La puissance se mesure en watts.', true, 'Symbole : W.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Convertir, rendement, PWM',
      hud: [['f', 'fonction'], ['r', 'règle'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Convertir**, c’est transformer l’énergie électrique en une forme **utile** : c’est le rôle de l’**actionneur**.', ar: 'التحويل هو تحويل الطاقة الكهربائية إلى شكل نافع، وهو دور المنفذ.', hud: { f: ['convertir'], r: 'actionneur', v: '–' }, run: function (e) { e.s.set({ formes: 1 }); } },
        { cap: 'Moteur : énergie **mécanique**. Lampe : **lumineuse**. Radiateur : **thermique**. Haut-parleur : **sonore**.', ar: 'المحرك: طاقة ميكانيكية. المصباح: ضوئية. المدفأة: حرارية. مكبر الصوت: صوتية.', hud: { f: 'convertir', r: ['4 formes'], v: '–' }, run: function (e) { e.s.set({ formes: 4 }); } },
        { cap: 'Une partie de l’énergie est **perdue**, surtout en chaleur.', ar: 'جزء من الطاقة يضيع، خاصة على شكل حرارة.', hud: { f: 'pertes', r: 'Pa = Pu + pertes', v: ['10 W perdus'] }, run: function (e) { e.s.set({ pa: 50, pu: 40 }); } },
        { cap: '**Rendement** : η = Pu ÷ Pa. Ici 40 ÷ 50 = **80 %**.', ar: 'المردود: [[η = Pu ÷ Pa]]، هنا [[40 ÷ 50 = 80 %]].', hud: { f: 'rendement', r: ['η = Pu ÷ Pa'], v: ['80 %'] }, run: function (e) { e.s.set({ pa: 50, pu: 40 }); } },
        { cap: '**PWM** : la carte allume et coupe très vite. Allumée **50 %** du temps, le moteur va à **mi-vitesse**.', ar: 'تقنية PWM: تشغل البطاقة وتطفئ بسرعة كبيرة. مشغلة نصف الوقت، يدور المحرك بنصف السرعة.', hud: { f: 'régler', r: ['rapport cyclique'], v: ['1500 tr/min'] }, run: function (e) { e.s.set({ pwm: 50 }); } },
        { cap: 'Rapport cyclique **25 %** : un quart de la vitesse.', ar: 'نسبة دورية 25 %: ربع السرعة.', hud: { f: 'régler', r: 'rapport cyclique', v: ['750 tr/min'] }, run: function (e) { e.s.set({ pwm: 25 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Règle le rapport cyclique. Fais tourner le moteur à 1500 tr/min.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Signal PWM et moteur' }, st);
          var s = scene(svg), set = MV.hud(c, [['d', 'rapport cyclique'], ['v', 'vitesse', 1]]);
          MV.slider(c, { label: 'PWM', min: 0, max: 100, step: 5, value: 20, fmt: function (v) { return v + ' %'; } }, function (d) {
            s.set({ pwm: d }); set('d', d + ' %'); set('v', Math.round(VMAX * d / 100) + ' tr/min'); if (d === 50) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'À 100 %, ce moteur tourne à 3000 tr/min.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Un moteur de ventilateur absorbe 50 W et tourne à 4000 tr/min à pleine puissance.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Rapport cyclique 25 %. Vitesse (tr/min) ?', a: 1000, hint: '4000 × 0,25' },
            { q: 'Étape 2. À pleine puissance, Pu = 40 W. Rendement (%) ?', a: 80 },
            { type: 'opt', q: 'Étape 3. Les 10 W perdus deviennent surtout :', o: ['de la chaleur', 'de la lumière'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un moteur convertit l’énergie électrique en énergie :', o: ['mécanique', 'chimique'], a: 0 },
      { lvl: 'Niveau 2', q: 'Une lampe convertit l’énergie électrique surtout en énergie :', o: ['lumineuse et thermique', 'mécanique et sonore'], a: 0 },
      { lvl: 'Niveau 3', q: 'Pa = 200 W et rendement 75 %. Pu (W) ?', a: 150, hint: '200 × 0,75' },
      { lvl: 'Niveau 4', q: 'PWM : 3 ms à 5 V puis 2 ms à 0 V, et ainsi de suite. Rapport cyclique (%) ?', a: 60, hint: '3 ÷ (3 + 2)' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Où va l’énergie',
      hud: [['e', 'entre'], ['s', 'sort'], ['v', 'vitesse']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'L’énergie électrique devient **mouvement** ; le reste part en **chaleur**. Rendement 70 %.', hud: { e: '60 W', s: ['42 W utiles'], v: '–' }, run: function (e) { e.s.set({ pa: 60, pu: 42 }); } },
        { cap: 'Pour ralentir, la carte réduit le **rapport cyclique** : à 50 %, mi-vitesse.', ar: 'لإبطاء المحرك تخفض البطاقة النسبة الدورية: عند 50 % نصف السرعة.', hud: { e: 'PWM 50 %', s: 'mouvement', v: ['1500 tr/min'] }, run: function (e) { e.s.set({ pwm: 50 }); } }
      ]
    },

    retenir: [
      '<b>Convertir</b> = transformer l’énergie électrique en énergie utile, par l’<b>actionneur</b> : moteur (mécanique), lampe (lumineuse), radiateur (thermique), haut-parleur (sonore). Une partie est perdue, surtout en chaleur.',
      'Rendement : <b class="mono">η = Pu ÷ Pa</b> (toujours moins de 100 %). Vitesse d’un moteur en <b>PWM</b> : proportionnelle au <b>rapport cyclique</b> (temps allumé ÷ période).'
    ],
    retenirAr: 'التحويل يقوم به المنفذ: يحول الطاقة الكهربائية إلى طاقة نافعة، ويضيع جزء منها على شكل حرارة. المردود [[η = Pu ÷ Pa]]. في تقنية PWM تتناسب سرعة المحرك مع النسبة الدورية.',
    voc: [['convertir', 'تحويل'], ['un actionneur', 'منفذ'], ['le rendement', 'المردود'], ['les pertes', 'الضياع'], ['le rapport cyclique', 'النسبة الدورية']]
  });
})();
