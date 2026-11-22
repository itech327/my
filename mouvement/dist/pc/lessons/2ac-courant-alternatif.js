/* @meta {"id":"2ac-courant-alternatif","level":"2","order":12,"theme":"Électricité","title":"Le courant alternatif sinusoïdal","ar":"التيار الكهربائي المتناوب الجيبي","lead":"Sur un chargeur, on lit « 220 V ~ 50 Hz ». Le petit « ~ » cache une tension qui change de sens 100 fois par seconde. L'oscilloscope la rend visible."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 30, Y0 = 105, W = 300, H = 160, DIV = 30; // 10 divisions horizontales, ±(H/2)

  function ecran(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('rect', { x: X0, y: Y0 - H / 2, width: W, height: H, rx: 6, fill: '#0f1a14', stroke: '#5b6068' }, g);
    for (var i = 1; i < 10; i++) S('line', { x1: X0 + i * DIV, y1: Y0 - H / 2, x2: X0 + i * DIV, y2: Y0 + H / 2, stroke: 'rgba(120,200,140,.18)' }, g);
    for (var j = -2; j <= 2; j++) S('line', { x1: X0, y1: Y0 + j * DIV, x2: X0 + W, y2: Y0 + j * DIV, stroke: j ? 'rgba(120,200,140,.18)' : 'rgba(120,200,140,.4)' }, g);
    var dyn = S('g', {}, g);
    g.set = function (f, umax, o) { // f en Hz ; umax en V ; balayage 5 ms/div, sensibilité 200 V/div
      o = o || {};
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (f === 0) { var yc = Y0 - DIV * 1.5; S('line', { x1: X0, y1: yc, x2: X0 + W, y2: yc, stroke: '#56d07f', 'stroke-width': 2.5 }, dyn); return; }
      var d = '';
      for (var x = 0; x <= W; x += 2) { var t = x / DIV * 5e-3, y = Y0 - umax * Math.sin(2 * Math.PI * f * t) / 200 * DIV; d += (d ? ' L' : 'M') + (X0 + x) + ' ' + y.toFixed(1); }
      S('path', { d: d, fill: 'none', stroke: '#56d07f', 'stroke-width': 2.5 }, dyn);
      if (o.T) { var tx = 1 / f / 5e-3 * DIV; S('path', { d: 'M' + X0 + ' ' + (Y0 + H / 2 - 10) + ' h' + tx, stroke: '#f2c14e', 'stroke-width': 2.5 }, dyn); T(dyn, X0 + tx / 2, Y0 + H / 2 - 16, 'T', 'lbl'); }
      if (o.max) { var ym = Y0 - umax / 200 * DIV; S('line', { x1: X0, y1: ym, x2: X0 + W, y2: ym, stroke: '#e5484d', 'stroke-dasharray': '4 4' }, dyn); T(dyn, X0 + W - 4, ym - 6, 'Umax', 'tag', 'end'); }
    };
    return g;
  }

  MV.lesson({
    id: '2ac-courant-alternatif',
    objectif: {
      fr: 'Distinguer tension continue et alternative, lire à l\'oscilloscope la période et la tension maximale, et calculer la fréquence f = 1/T et la tension efficace.',
      ar: 'التمييز بين التوتر المستمر والمتناوب، وقراءة الدور والتوتر القصوي على راسم التذبذب، وحساب التردد [[f = 1/T]] والتوتر الفعال.'
    },

    prerequis: {
      fr: 'Circuit électrique simple ; tension et intensité vues en 1AC.',
      ar: 'الدارة الكهربائية البسيطة والتوتر وشدة التيار.'
    },

    ouverture: {
      vb: '0 0 360 210', label: '220 V ~ 50 Hz',
      hud: [['p', 'pile'], ['s', 'prise'], ['q', 'que signifie « ~ » ?']],
      draw: function (svg) { var e = {}; e.e = ecran(svg); return e; },
      steps: [
        { cap: 'Une **pile** de 4,5 V donne une tension **constante** : un trait plat à l\'oscilloscope.', hud: { p: ['continue'], s: '–', q: '–' }, run: function (e) { e.e.set(0, 45); } },
        { cap: 'Sur un chargeur, on lit **« 220 V ~ 50 Hz »**.', hud: { p: 'continue', s: ['220 V ~ 50 Hz'], q: '–' }, run: function (e) { e.e.set(0, 45); } },
        { cap: 'Que signifie ce « ~ » ? On le saura à la fin.', hud: { p: 'continue', s: '220 V ~ 50 Hz', q: ['?'] }, run: function (e) { e.e.set(50, 311); } }
      ]
    },

    predire: {
      q: "Sur un chargeur, on lit « 220 V ~ 50 Hz ». Que signifie 50 Hz pour la tension du secteur ?",
      ar: "على شاحن نقرأ [[220 V ~ 50 Hz]]. ماذا يعني [[50 Hz]] بالنسبة لتوتر القطاع؟",
      o: ["Elle vaut 50 volts", "Elle fait 50 cycles complets par seconde", "Elle dure 50 secondes"],
      a: 1,
      e: "La fréquence est le nombre de cycles par seconde. 50 Hz, c'est 50 cycles par seconde, donc une période T = 1 ÷ 50 = 0,02 s. Le symbole ~ indique une tension alternative.",
      ear: "التردد هو عدد الدورات في الثانية: [[50 Hz]] تعني [[50]] دورة في الثانية، أي الدور [[T = 1 ÷ 50 = 0,02 s]]."
    },

    prepare: [
      ['Une pile fournit une tension continue.', true, 'Elle garde toujours le même signe.'],
      ['La tension du secteur au Maroc est de 220 V.', true, 'Avec une fréquence de 50 Hz.'],
      ['Une tension alternative garde toujours le même signe.', false, 'Elle est tantôt positive, tantôt négative.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'À l\'oscilloscope',
      hud: [['g', 'grandeur'], ['l', 'lecture'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.e = ecran(svg); return e; },
      steps: [
        { cap: 'La tension du secteur est **alternative** : tantôt positive, tantôt négative. Sa courbe est une **sinusoïde**.', ar: 'توتر القطاع متناوب، ومنحناه جيبي.', hud: { g: ['alternative sinusoïdale'], l: '–', v: '–' }, run: function (e) { e.e.set(50, 311); } },
        { cap: 'La **période T** : durée d\'un motif. Ici 4 divisions × 5 ms = **20 ms**.', ar: 'الدور T هو مدة نمط واحد: [[T = 20 ms]].', hud: { g: ['période T'], l: '4 div × 5 ms', v: ['20 ms'] }, run: function (e) { e.e.set(50, 311, { T: 1 }); } },
        { cap: 'La **fréquence** : nombre de motifs par seconde, **f = 1/T** = 1 ÷ 0,02 = **50 Hz**.', ar: 'التردد [[f = 1/T = 50 Hz]].', hud: { g: ['fréquence'], l: 'f = 1/T', v: ['50 Hz'] }, run: function (e) { e.e.set(50, 311, { T: 1 }); } },
        { cap: 'La **tension maximale** Umax ≈ **311 V** (environ 1,5 division de 200 V).', ar: 'التوتر القصوي [[Umax ≈ 311 V]].', hud: { g: ['Umax'], l: '≈ 1,55 div × 200 V', v: ['311 V'] }, run: function (e) { e.e.set(50, 311, { max: 1 }); } },
        { cap: 'Le voltmètre affiche la **tension efficace** : **Ueff = Umax ÷ √2** ≈ 311 ÷ 1,41 ≈ **220 V**.', ar: 'الفولطمتر يشير إلى التوتر الفعال: [[Ueff = Umax ÷ √2 ≈ 220 V]].', hud: { g: ['Ueff'], l: 'Umax ÷ √2', v: ['220 V'] }, run: function (e) { e.e.set(50, 311, { max: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Règle la fréquence du générateur. Combien de motifs vois-tu sur l\'écran (50 ms) ? Obtiens 100 Hz.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Écran d\'oscilloscope' }, st);
          var ec = ecran(svg), set = MV.hud(c, [['f', 'fréquence'], ['t', 'période T', 1], ['m', 'motifs à l\'écran']]);
          MV.slider(c, { label: 'fréquence (Hz)', min: 20, max: 200, value: 50, step: 10 }, function (f) { ec.set(f, 200, { T: 1 }); set('f', f + ' Hz'); set('t', String(Math.round(1000 / f * 10) / 10).replace('.', ',') + ' ms'); set('m', String(f * 0.05).replace('.', ',')); if (f === 100) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Un oscillogramme montre un motif sur 5 divisions, avec un balayage de 2 ms/div. La courbe monte à 2 divisions de 5 V.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. T = 5 × 2 = ? ms', a: 10 },
            { q: 'Étape 2. f = 1 ÷ 0,01 = ? Hz', a: 100 },
            { q: 'Étape 3. Umax = 2 × 5 = ? V', a: 10 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'La fréquence du secteur au Maroc est :', o: ['50 Hz', '220 Hz'], a: 0 },
      { lvl: 'Niveau 2', q: 'T = 0,05 s. f = ? Hz', a: 20 },
      { lvl: 'Niveau 3', q: 'f = 25 Hz. T = ? ms', a: 40 },
      { lvl: 'Niveau 4', q: 'Umax = 14,1 V. Ueff ≈ ? V (√2 ≈ 1,41)', a: 10, tol: 0.1 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le « ~ »',
      hud: [['s', 'symbole'], ['f', 'fréquence'], ['t', 'tension']],
      draw: function (svg) { var e = {}; e.e = ecran(svg); return e; },
      steps: [
        { cap: '« ~ » signifie **tension alternative** : elle change de sens à chaque demi-période.', hud: { s: ['alternative'], f: '–', t: '–' }, run: function (e) { e.e.set(50, 311); } },
        { cap: '50 Hz : 50 motifs par seconde, donc **100 changements de sens**. 220 V est la valeur **efficace** ; Umax ≈ 311 V.', ar: 'الرمز ~ يعني توترا متناوبا ترددُه 50 هرتز وتوتره الفعال 220 فولط.', hud: { s: 'alternative', f: ['50 Hz'], t: ['Ueff 220 V ; Umax 311 V'] }, run: function (e) { e.e.set(50, 311, { T: 1, max: 1 }); } }
      ]
    },

    retenir: [
      'Une tension <b>alternative sinusoïdale</b> change périodiquement de signe. À l\'oscilloscope, on lit sa <b>période T</b> et sa <b>tension maximale Umax</b>.',
      '<b class="mono">f = 1/T</b> (Hz si T en s). Le voltmètre indique la <b>tension efficace</b> : <b class="mono">Ueff = Umax ÷ √2</b>. Secteur marocain : 220 V, 50 Hz.'
    ],
    retenirAr: 'التوتر المتناوب الجيبي يغير إشارته دوريا. نقرأ على راسم التذبذب الدور T والتوتر القصوي. [[f = 1/T]] والتوتر الفعال [[Ueff = Umax ÷ √2]]. القطاع بالمغرب: 220 فولط و 50 هرتز.',
    voc: [['une tension alternative', 'توتر متناوب'], ['la période', 'الدور'], ['la fréquence', 'التردد'], ['la tension efficace', 'التوتر الفعال'], ['un oscilloscope', 'راسم التذبذب']]
  });
})();
