/* @meta {"id":"3ac-solaire","level":"3","order":13,"theme":"Énergies renouvelables","title":"L’énergie solaire","ar":"الطاقة الشمسية","lead":"Sur un toit, des panneaux bleus ; près de Ouarzazate, des milliers de miroirs à Noor. Les deux utilisent le soleil, mais pas de la même façon."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, ELEV = 60, PMAX = 300;

  function pv(b) { return Math.round(PMAX * Math.cos(Math.abs(ELEV - (90 - b)) * Math.PI / 180)); }
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function soleil(x, y) {
      S('circle', { cx: x, cy: y, r: 14, fill: '#f2c14e' }, dyn);
      var r = S('g', {}, dyn);
      for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; S('line', { x1: x + 19 * Math.cos(a), y1: y + 19 * Math.sin(a), x2: x + 25 * Math.cos(a), y2: y + 25 * Math.sin(a), stroke: '#f2c14e', 'stroke-width': 2 }, r); }
      S('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 ' + x + ' ' + y, to: '360 ' + x + ' ' + y, dur: '12s', repeatCount: 'indefinite' }, r);
    }
    function panneau(b) {
      var px = 210, py = 140, L = 90, a = b * Math.PI / 180;
      var x1 = px - L / 2 * Math.cos(a), y1 = py + L / 2 * Math.sin(a), x2 = px + L / 2 * Math.cos(a), y2 = py - L / 2 * Math.sin(a);
      // le panneau penche vers le soleil (à gauche) : le côté gauche est plus bas
      S('line', { x1: 0, y1: 186, x2: 360, y2: 186, stroke: '#5b6068', 'stroke-width': 2 }, dyn);
      S('path', { d: 'M' + px + ' 186V' + py, stroke: '#9aa0a8', 'stroke-width': 3 }, dyn);
      S('line', { x1: x1.toFixed(1), y1: y1.toFixed(1), x2: x2.toFixed(1), y2: y2.toFixed(1), stroke: '#7fb2ff', 'stroke-width': 7, 'stroke-linecap': 'round' }, dyn);
      var e = ELEV * Math.PI / 180, sx = px - 120 * Math.cos(e), sy = py - 120 * Math.sin(e);
      soleil(sx, sy);
      for (var i = -1; i <= 1; i++) {
        var ox = i * 22 * Math.sin(e), oy = -i * 22 * Math.cos(e), path = 'M' + (sx + ox + 20 * Math.cos(e)).toFixed(1) + ' ' + (sy + oy + 20 * Math.sin(e)).toFixed(1) + 'L' + (px + ox * .6).toFixed(1) + ' ' + (py + oy * .6).toFixed(1);
        S('path', { d: path, stroke: '#f2c14e', 'stroke-width': 1, 'stroke-dasharray': '3 4', opacity: .6 }, dyn);
        var d = S('circle', { r: 3, fill: '#f2c14e' }, dyn); S('animateMotion', { dur: '1.4s', begin: (i + 1) * .3 + 's', repeatCount: 'indefinite', path: path }, d);
      }
      T(dyn, 330, 200, 'inclinaison ' + b + '°', 'tag', 'end');
      T(dyn, 334, 40, 'P = ' + pv(b) + ' W', 'lbl', 'end');
    }
    function chaine(k) {
      var B = [['panneaux', 'continu'], ['onduleur', 'continu → alternatif'], ['maison, réseau', 'alternatif 230 V']];
      soleil(40, 40);
      B.forEach(function (b, i) {
        var x = 20 + i * 116, on = i === k;
        S('rect', { x: x, y: 96, width: 98, height: 40, rx: 6, fill: on ? 'var(--acc-bg)' : '#1d1f22', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 2 }, dyn);
        T(dyn, x + 49, 121, b[0], 'tag');
        T(dyn, x + 49, 156, b[1], 'tag').style.fontSize = '9px';
        if (i < 2) S('path', { d: 'M' + (x + 98) + ' 116H' + (x + 116), stroke: '#f2c14e', 'stroke-width': 2 }, dyn);
      });
      var e = S('circle', { r: 4, fill: '#f2c14e' }, dyn); S('animateMotion', { dur: '2s', repeatCount: 'indefinite', path: 'M60 60L69 86H252' }, e);
    }
    function noor() {
      soleil(40, 34);
      for (var i = 0; i < 3; i++) {
        var x = 50 + i * 100;
        S('path', { d: 'M' + x + ' 130Q' + (x + 35) + ' 170 ' + (x + 70) + ' 130', stroke: '#e9e9ea', 'stroke-width': 4, fill: 'none' }, dyn);
        S('circle', { cx: x + 35, cy: 138, r: 4, fill: '#e5484d' }, dyn);
        S('path', { d: 'M' + (x + 5) + ' 70L' + (x + 8) + ' 134L' + (x + 35) + ' 138M' + (x + 65) + ' 70L' + (x + 62) + ' 134L' + (x + 35) + ' 138', stroke: '#f2c14e', 'stroke-width': 1, opacity: .7, fill: 'none' }, dyn);
      }
      T(dyn, 180, 198, 'miroirs → chaleur → vapeur → turbine', 'tag');
      T(dyn, 212, 40, 'Noor Ouarzazate : I 160, II 200, III 150 MW', 'tag');
      S('rect', { x: 300, y: 150, width: 50, height: 34, rx: 6, fill: '#2a1e17', stroke: '#e5484d', 'stroke-width': 2 }, dyn);
      T(dyn, 325, 165, 'sels', 'tag'); T(dyn, 325, 178, 'chauds', 'tag');
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.b != null) panneau(o.b); else if (o.chain != null) chaine(o.chain); else if (o.noor) noor();
    };
    return g;
  }

  MV.lesson({
    id: '3ac-solaire',
    objectif: {
      fr: 'Distinguer le solaire photovoltaïque et le solaire thermique à concentration, orienter un panneau, et calculer une puissance et une énergie solaires.',
      ar: 'التمييز بين الطاقة الشمسية الكهروضوئية والحرارية المركزة، وتوجيه لوح شمسي، وحساب قدرة وطاقة شمسيتين.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Panneaux et miroirs',
      hud: [['o', 'objet'], ['p', 'produit'], ['q', 'comment ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Sur le toit, un **panneau** reçoit la lumière du soleil.', hud: { o: ['panneau'], p: '?', q: '–' }, run: function (e) { e.s.set({ b: 10 }); } },
        { cap: 'À **Noor**, près de Ouarzazate, des **miroirs** concentrent la chaleur.', hud: { o: ['miroirs'], p: '?', q: '–' }, run: function (e) { e.s.set({ noor: 1 }); } },
        { cap: 'Le panneau est mal orienté : il donne peu. Quel angle choisir ?', hud: { o: 'panneau', p: ['peu'], q: ['angle ?'] }, run: function (e) { e.s.set({ b: 70 }); } }
      ]
    },

    prepare: [
      ['Une calculatrice solaire fonctionne grâce à une petite cellule photovoltaïque.', true, 'Elle transforme la lumière en électricité.'],
      ['Une loupe peut concentrer la chaleur du soleil.', true, 'Comme les miroirs d’une centrale thermique.'],
      ['Un panneau donne la même puissance quelle que soit son orientation.', false, 'Il donne le plus quand les rayons arrivent perpendiculairement.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Photovoltaïque et thermique',
      hud: [['t', 'technique'], ['r', 'règle'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Photovoltaïque** : la cellule transforme directement la **lumière** en électricité, en courant **continu**.', ar: 'الكهروضوئية: الخلية تحول الضوء مباشرة إلى كهرباء بتيار مستمر.', hud: { t: ['photovoltaïque'], r: 'lumière → électrique', v: 'continu' }, run: function (e) { e.s.set({ chain: 0 }); } },
        { cap: 'L’**onduleur** transforme le continu en **alternatif** 230 V pour la maison ou le réseau.', ar: 'المموج يحول التيار المستمر إلى متناوب [[230 V]] للمنزل أو للشبكة.', hud: { t: 'photovoltaïque', r: ['onduleur'], v: ['230 V ~'] }, run: function (e) { e.s.set({ chain: 1 }); } },
        { cap: 'Le panneau donne le **maximum** quand les rayons arrivent **perpendiculairement**.', ar: 'يعطي اللوح أقصى قدرة عندما تسقط الأشعة عموديا عليه.', hud: { t: 'orientation', r: ['rayons ⟂ panneau'], v: ['300 W'] }, run: function (e) { e.s.set({ b: 30 }); } },
        { cap: 'Mal incliné, il reçoit les rayons de biais et produit **moins**.', ar: 'إذا كان ميله سيئا يتلقى الأشعة بشكل مائل فينتج أقل.', hud: { t: 'orientation', r: 'rayons de biais', v: ['moins'] }, run: function (e) { e.s.set({ b: 75 }); } },
        { cap: '**Thermique à concentration** : des miroirs chauffent un fluide, la vapeur fait tourner une **turbine**.', ar: 'الحرارية المركزة: مرايا تسخن سائلا، والبخار يدير عنفة.', hud: { t: ['thermique'], r: 'chaleur → vapeur → turbine', v: 'Noor' }, run: function (e) { e.s.set({ noor: 1 }); } },
        { cap: 'Des **sels fondus** gardent la chaleur : Noor produit aussi **la nuit**. Noor I, II, III : **510 MW**.', ar: 'الأملاح المنصهرة تخزن الحرارة فتنتج نور ليلا أيضا. نور 1 و2 و3: [[510 MW]].', hud: { t: 'thermique', r: ['stockage'], v: ['510 MW'] }, run: function (e) { e.s.set({ noor: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Incline le panneau. Trouve l’angle qui donne la puissance maximale.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Orientation d’un panneau solaire' }, st);
          var s = scene(svg), set = MV.hud(c, [['b', 'inclinaison'], ['p', 'puissance', 1]]);
          MV.slider(c, { label: 'angle', min: 0, max: 90, step: 5, value: 70, fmt: function (v) { return v + '°'; } }, function (b) { s.set({ b: b }); set('b', b + '°'); set('p', pv(b) + ' W'); if (b === 30) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Panneau de 300 W ; le soleil est à 60° au-dessus de l’horizon.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Une école installe des panneaux de 300 W.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. 10 panneaux de 300 W. Puissance totale (W) ?', a: 3000 },
            { type: 'opt', q: 'Étape 2. Les panneaux donnent du continu. Pour les prises de l’école, on ajoute :', o: ['un onduleur', 'un redresseur'], a: 0 },
            { q: 'Étape 3. Noor I, II et III : 160 + 200 + 150. Total (MW) ?', a: 510 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un panneau photovoltaïque transforme la lumière en énergie :', o: ['électrique', 'mécanique'], a: 0 },
      { lvl: 'Niveau 2', q: 'L’onduleur transforme :', o: ['le continu en alternatif', 'l’alternatif en continu'], a: 0 },
      { lvl: 'Niveau 3', q: 'Une centrale solaire thermique peut produire la nuit grâce :', o: ['au stockage de chaleur dans des sels fondus', 'à la lumière de la lune'], a: 0 },
      { lvl: 'Niveau 4', q: 'Panneau de 300 W, 5 h de plein soleil par jour. Énergie par jour (Wh) ?', a: 1500, hint: 'E = P × t' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Deux façons',
      hud: [['o', 'objet'], ['p', 'produit'], ['q', 'comment']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Panneau incliné à **30°** : rayons perpendiculaires, **300 W**.', hud: { o: 'panneau', p: ['300 W'], q: ['lumière → électricité'] }, run: function (e) { e.s.set({ b: 30 }); } },
        { cap: 'À Noor, les miroirs donnent de la **chaleur**, puis de la vapeur et de l’électricité, même la nuit.', ar: 'في نور تعطي المرايا حرارة ثم بخارا ثم كهرباء، حتى في الليل.', hud: { o: 'miroirs', p: '510 MW', q: ['chaleur → vapeur'] }, run: function (e) { e.s.set({ noor: 1 }); } }
      ]
    },

    retenir: [
      '<b>Photovoltaïque</b> : lumière → électricité en courant continu ; l’<b>onduleur</b> donne de l’alternatif. Puissance maximale quand les rayons sont <b>perpendiculaires</b> au panneau. <b class="mono">E = P × t</b>.',
      '<b>Thermique à concentration</b> (Noor Ouarzazate, 510 MW) : miroirs → chaleur → vapeur → turbine → alternateur ; les <b>sels fondus</b> stockent la chaleur pour la nuit.'
    ],
    retenirAr: 'الكهروضوئية: الضوء يتحول إلى كهرباء مستمرة، والمموج يعطي التيار المتناوب، والقدرة قصوى عندما تكون الأشعة عمودية. الحرارية المركزة بنور: مرايا ثم حرارة ثم بخار ثم عنفة، والأملاح المنصهرة تخزن الحرارة.',
    voc: [['photovoltaïque', 'كهروضوئي'], ['un onduleur', 'مموج'], ['une cellule solaire', 'خلية شمسية'], ['concentrer', 'تركيز'], ['l’inclinaison', 'الميل']]
  });
})();
