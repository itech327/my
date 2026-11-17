/* @meta {"id":"2ac-signalisation","level":"2","order":5,"theme":"Fonctions électroniques","title":"La fonction « Signalisation »","ar":"وظيفة الإشارة","lead":"Le voyant rouge d’un chargeur, le bip d’un four : ce sont des signaux. Une LED branchée seule sur une pile de 9 V grille aussitôt. Comment la protéger ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, U = 9, UL = 2;
  var E12 = [100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820];

  function courant(r) { return (U - UL) / r * 1000; } // mA
  function etat(i) { return i > 30 ? 'trop de courant : elle grille' : i >= 15 ? 'bien éclairée' : 'faible'; }
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function led(x, y, i, flip) {
      var on = i > 1, burn = i > 30, a = Math.min(1, i / 20);
      if (on && !burn) S('circle', { cx: x, cy: y, r: 22, fill: 'rgba(255,80,80,' + (0.15 + 0.35 * a).toFixed(2) + ')' }, dyn);
      S('path', { d: flip ? 'M' + (x + 10) + ' ' + (y - 10) + 'L' + (x - 8) + ' ' + y + 'L' + (x + 10) + ' ' + (y + 10) + 'Z' : 'M' + (x - 10) + ' ' + (y - 10) + 'L' + (x + 8) + ' ' + y + 'L' + (x - 10) + ' ' + (y + 10) + 'Z', fill: burn ? '#3a2a2a' : on ? '#ff5a5a' : 'none', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
      S('path', { d: 'M' + (flip ? x - 8 : x + 8) + ' ' + (y - 10) + 'V' + (y + 10), stroke: '#e9e9ea', 'stroke-width': 2.5 }, dyn);
      if (burn) { var t = T(dyn, x, y - 26, 'grillée !', 'lbl'); t.style.fill = '#e5484d'; }
    }
    function circuit(r, buzzer) {
      var i = r ? courant(r) : 350;
      S('path', { d: 'M40 50H150M210 50H320V160H40V50', stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, dyn);
      S('path', { d: 'M26 98H54M33 106H47', stroke: '#f2c14e', 'stroke-width': 3 }, dyn);
      S('rect', { x: 34, y: 90, width: 12, height: 24, fill: '#141517' }, dyn);
      S('path', { d: 'M26 98H54M33 106H47', stroke: '#f2c14e', 'stroke-width': 3 }, dyn);
      T(dyn, 62, 106, '9 V', 'tag', 'start');
      if (r) { S('rect', { x: 150, y: 42, width: 60, height: 16, fill: '#141517', stroke: 'var(--acc)', 'stroke-width': 2.5 }, dyn); T(dyn, 180, 32, 'R = ' + r + ' Ω', 'lbl'); }
      else { S('path', { d: 'M150 50H210', stroke: '#9aa0a8', 'stroke-width': 2 }, dyn); T(dyn, 180, 32, 'sans résistance', 'tag'); }
      if (buzzer) {
        S('rect', { x: 166, y: 146, width: 28, height: 28, rx: 14, fill: '#26292d', stroke: '#f2c14e', 'stroke-width': 2 }, dyn);
        [8, 15].forEach(function (k) { var w = S('path', { d: 'M' + (200 + k / 2) + ' ' + (160 - k) + 'Q' + (206 + k) + ' 160 ' + (200 + k / 2) + ' ' + (160 + k), stroke: '#f2c14e', 'stroke-width': 2, fill: 'none' }, dyn); S('animate', { attributeName: 'opacity', values: '1;.1;1', dur: '.5s', repeatCount: 'indefinite' }, w); });
        T(dyn, 180, 196, 'buzzer : signal sonore', 'tag');
      } else {
        S('rect', { x: 166, y: 150, width: 30, height: 20, fill: '#141517' }, dyn);
        led(180, 160, Math.min(i, 400), true);
        T(dyn, 180, 196, 'LED : signal lumineux', 'tag');
      }
      if (i > 0 && !(i > 30 && !buzzer)) { var d = S('circle', { r: 3, fill: '#f2c14e' }, dyn); S('animateMotion', { dur: Math.max(0.6, 40 / Math.min(i, 60)).toFixed(2) + 's', repeatCount: 'indefinite', path: 'M40 50H320V160H40Z' }, d); }
      T(dyn, 300, 106, 'I = ' + (r ? MV.fmt(i, 1) : '> 300') + ' mA', 'lbl', 'end');
    }
    g.set = function (o) { while (dyn.firstChild) dyn.removeChild(dyn.firstChild); circuit(o.r, o.buzzer); };
    return g;
  }

  MV.lesson({
    id: '2ac-signalisation',
    objectif: {
      fr: 'Brancher une LED dans le bon sens avec une résistance de protection, calculer R = (U − 2 V) ÷ I, choisir une valeur normalisée, et distinguer signal lumineux et signal sonore.',
      ar: 'تركيب صمام ضوئي في الاتجاه الصحيح مع مقاومة حماية، وحساب [[R = (U − 2) ÷ I]]، واختيار قيمة معيارية، والتمييز بين الإشارة الضوئية والصوتية.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'La LED grille',
      hud: [['r', 'résistance'], ['i', 'courant'], ['e', 'LED']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Une LED branchée **directement** sur 9 V…', hud: { r: 'aucune', i: ['trop grand'], e: '?' }, run: function (e) { e.s.set({}); } },
        { cap: '…grille aussitôt : le **courant** est beaucoup trop grand.', hud: { r: 'aucune', i: '> 300 mA', e: ['grillée'] }, run: function (e) { e.s.set({}); } },
        { cap: 'Avec une **résistance** en série, elle éclaire sans danger. Quelle valeur choisir ?', hud: { r: ['?'], i: '20 mA', e: ['éclaire'] }, run: function (e) { e.s.set({ r: 390 }); } }
      ]
    },

    prepare: [
      ['Une LED ne s’allume que dans un sens.', true, 'C’est une diode : le courant passe de l’anode à la cathode.'],
      ['Une LED consomme plus qu’une lampe à incandescence.', false, 'Elle consomme beaucoup moins pour la même lumière.'],
      ['Une résistance limite le courant dans un circuit.', true, 'Plus R est grande, plus le courant est petit.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Protéger la LED',
      hud: [['n', 'notion'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Signaler** : informer l’utilisateur par un signal **lumineux** (LED) ou **sonore** (buzzer).', ar: 'الإشارة: إخبار المستعمل بإشارة ضوئية أو صوتية.', hud: { n: ['signaler'], v: 'LED, buzzer' }, run: function (e) { e.s.set({ r: 390 }); } },
        { cap: 'La LED a besoin d’environ **2 V** et de **20 mA**. La résistance prend le reste de la tension.', ar: 'يحتاج الصمام حوالي [[2 V]] و[[20 mA]]، والمقاومة تأخذ باقي التوتر.', hud: { n: 'LED', v: ['2 V, 20 mA'] }, run: function (e) { e.s.set({ r: 390 }); } },
        { cap: 'Calcul : R = (9 − 2) ÷ 0,02 = **350 Ω**.', ar: 'الحساب: [[R = (9 − 2) ÷ 0,02 = 350 Ω]].', hud: { n: ['R = (U − 2) ÷ I'], v: ['350 Ω'] }, run: function (e) { e.s.set({ r: 330 }); } },
        { cap: '350 Ω n’est pas vendue : on prend la valeur **normalisée** juste au-dessus, **390 Ω**.', ar: 'القيمة 350 غير متوفرة، فنأخذ القيمة المعيارية الأعلى مباشرة: [[390 Ω]].', hud: { n: ['série E12'], v: ['390 Ω'] }, run: function (e) { e.s.set({ r: 390 }); } },
        { cap: 'Le **buzzer** donne un signal **sonore** : utile quand on ne regarde pas.', ar: 'الطنان يعطي إشارة صوتية مفيدة عندما لا ننظر.', hud: { n: ['buzzer'], v: 'sonore' }, run: function (e) { e.s.set({ r: 390, buzzer: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis la résistance. La LED doit être bien éclairée sans griller.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'LED et résistance' }, st);
          var s = scene(svg), set = MV.hud(c, [['r', 'R'], ['i', 'courant', 1], ['e', 'LED']]);
          MV.slider(c, { label: 'R', min: 0, max: 11, value: 0, fmt: function (k) { return E12[k] + ' Ω'; } }, function (k) {
            var r = E12[k], i = courant(r); s.set({ r: r }); set('r', r + ' Ω'); set('i', MV.fmt(i, 1) + ' mA'); set('e', etat(i)); if (i >= 15 && i <= 22) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Pile 9 V, LED 2 V ; courant idéal : environ 20 mA.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Une LED sur une alimentation de 5 V.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Tension aux bornes de la résistance (V) ?', a: 3, hint: '5 − 2' },
            { q: 'Étape 2. Pour 20 mA (0,02 A) : R (Ω) ?', a: 150 },
            { type: 'opt', q: 'Étape 3. Sans résistance, la LED :', o: ['risque de griller', 'éclaire mieux longtemps'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Une LED s’allume seulement si elle est branchée :', o: ['dans le bon sens', 'dans les deux sens'], a: 0 },
      { lvl: 'Niveau 2', q: 'Un buzzer donne un signal :', o: ['sonore', 'lumineux'], a: 0 },
      { lvl: 'Niveau 3', q: 'Pile 9 V, LED 2 V, R = 350 Ω. Courant (mA) ?', a: 20, hint: '7 ÷ 350 = 0,02 A' },
      { lvl: 'Niveau 4', q: 'Alimentation 12 V, LED 2 V, courant 20 mA. R (Ω) ?', a: 500 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'LED protégée',
      hud: [['r', 'résistance'], ['i', 'courant'], ['e', 'LED']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Avec **390 Ω**, le courant vaut environ **18 mA** : la LED éclaire sans risque.', hud: { r: '390 Ω', i: ['18 mA'], e: ['éclaire'] }, run: function (e) { e.s.set({ r: 390 }); } },
        { cap: 'La **résistance série** protège la LED. Le buzzer, lui, signale par le son.', ar: 'المقاومة على التوالي تحمي الصمام، والطنان يشير بالصوت.', hud: { r: '390 Ω', i: '18 mA', e: ['protégée'] }, run: function (e) { e.s.set({ r: 390, buzzer: 1 }); } }
      ]
    },

    retenir: [
      '<b>Signaler</b> = informer par la lumière (LED, voyant) ou le son (buzzer). La LED se branche dans le <b>bon sens</b> et toujours avec une <b>résistance en série</b>.',
      '<b class="mono">R = (U − 2 V) ÷ I</b> avec I ≈ 0,02 A, puis on prend la valeur normalisée <b>juste au-dessus</b> (série E12 : 330, 390, 470…).'
    ],
    retenirAr: 'الإشارة تكون بالضوء أو بالصوت. يركب الصمام الضوئي في الاتجاه الصحيح مع مقاومة على التوالي: [[R = (U − 2) ÷ I]]، ثم نأخذ القيمة المعيارية الأعلى مباشرة.',
    voc: [['signaler', 'الإشارة'], ['une LED', 'صمام ثنائي باعث للضوء'], ['un buzzer', 'طنان'], ['une résistance de protection', 'مقاومة الحماية'], ['une valeur normalisée', 'قيمة معيارية']]
  });
})();
