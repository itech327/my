/* @meta {"id":"3ac-efficacite","level":"3","order":14,"theme":"Énergies renouvelables","title":"Efficacité énergétique et projets","ar":"النجاعة الطاقية والمشاريع","lead":"Deux lampes éclairent autant l’une que l’autre, mais l’une consomme sept fois plus. Produire de l’énergie propre, c’est bien ; en gaspiller moins, c’est aussi important."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, CL = ['A', 'B', 'C', 'D', 'E', 'F', 'G'], COL = ['#1a9850', '#66bd63', '#a6d96a', '#fee08b', '#fdae61', '#f46d43', '#d73027'];

  function kwh(p, h) { return p * h * 30 / 1000; }
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function etiquette(k) {
      CL.forEach(function (c, i) {
        var y = 16 + i * 25, w = 70 + i * 22;
        S('path', { d: 'M40 ' + y + 'H' + (40 + w) + 'L' + (52 + w) + ' ' + (y + 10) + 'L' + (40 + w) + ' ' + (y + 20) + 'H40Z', fill: COL[i] }, dyn);
        T(dyn, 50, y + 15, c, 'lbl', 'start').style.fill = '#141517';
        if (i === k) {
          S('path', { d: 'M330 ' + y + 'H282L270 ' + (y + 10) + 'L282 ' + (y + 20) + 'H330Z', fill: '#e9e9ea' }, dyn);
          T(dyn, 304, y + 15, c, 'lbl').style.fill = '#141517';
        }
      });
      T(dyn, 40, 204, 'plus économe', 'tag', 'start'); T(dyn, 330, 204, 'plus gourmand', 'tag', 'end');
    }
    function lampes(h) {
      [[90, 'incandescence 75 W', 75, '#f2c14e'], [270, 'LED 10 W', 10, '#7fb2ff']].forEach(function (l) {
        var x = l[0];
        S('circle', { cx: x, cy: 50, r: 22, fill: '#fff3b0', opacity: .9 }, dyn);
        S('rect', { x: x - 9, y: 70, width: 18, height: 12, fill: '#9aa0a8' }, dyn);
        if (l[2] > 20) { var hot = S('circle', { cx: x, cy: 50, r: 30, fill: 'none', stroke: '#e5484d', 'stroke-width': 2, 'stroke-dasharray': '4 4' }, dyn); S('animate', { attributeName: 'r', values: '28;36;28', dur: '1.5s', repeatCount: 'indefinite' }, hot); }
        T(dyn, x, 100, l[1], 'tag');
        if (h) {
          var e = kwh(l[2], h), H = Math.min(80, e * 6);
          S('rect', { x: x - 20, y: 190 - H, width: 40, height: H, fill: l[3] }, dyn);
          T(dyn, x + 26, 186, MV.fmt(e, 2) + ' kWh', 'tag', 'start');
        }
      });
      if (h) T(dyn, 180, 120, h + ' h/jour, 30 jours', 'tag');
      else T(dyn, 180, 150, 'même lumière', 'lbl');
    }
    function gestes() {
      ['éteindre les appareils en veille', 'choisir la classe A et les LED', 'isoler toits et fenêtres', 'projet : lampe solaire automatique'].forEach(function (t, i) {
        var y = 24 + i * 44;
        S('rect', { x: 30, y: y, width: 300, height: 34, rx: 8, fill: '#1d1f22', stroke: i === 3 ? 'var(--acc)' : '#56d07f', 'stroke-width': 2 }, dyn);
        T(dyn, 48, y + 22, (i === 3 ? '★ ' : '✓ ') + t, 'lbl', 'start');
      });
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.classe != null) etiquette(o.classe); else if (o.lampes) lampes(o.h); else if (o.gestes) gestes();
    };
    return g;
  }

  MV.lesson({
    id: '3ac-efficacite',
    objectif: {
      fr: 'Définir l’efficacité énergétique, lire une étiquette énergie, calculer et comparer des consommations avec E = P × t, et proposer des gestes et un projet pour économiser l’énergie.',
      ar: 'تعريف النجاعة الطاقية، وقراءة ملصق الطاقة، وحساب الاستهلاك ومقارنته بالعلاقة [[E = P × t]]، واقتراح سلوكات ومشروع لاقتصاد الطاقة.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Deux lampes',
      hud: [['l', 'lumière'], ['p', 'puissance'], ['q', 'différence ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Deux lampes donnent **la même lumière**.', hud: { l: ['identique'], p: '?', q: '–' }, run: function (e) { e.s.set({ lampes: 1 }); } },
        { cap: 'L’une consomme **75 W**, l’autre **10 W**. La première chauffe beaucoup.', hud: { l: 'identique', p: ['75 W et 10 W'], q: '?' }, run: function (e) { e.s.set({ lampes: 1 }); } },
        { cap: 'Sur un mois, quelle est la **différence** ?', hud: { l: 'identique', p: '75 W et 10 W', q: ['?'] }, run: function (e) { e.s.set({ lampes: 1, h: 5 }); } }
      ]
    },

    prepare: [
      ['Un appareil en veille consomme encore de l’électricité.', true, 'Peu à la fois, mais toute la journée.'],
      ['Une lampe LED consomme plus qu’une lampe à incandescence pour la même lumière.', false, 'Elle consomme environ 7 fois moins.'],
      ['Le kilowattheure (kWh) est une unité d’énergie.', true, '1 kWh = 1000 Wh.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Consommer moins',
      hud: [['n', 'notion'], ['r', 'règle'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Efficacité énergétique** : rendre le **même service** avec **moins** d’énergie.', ar: 'النجاعة الطاقية: تقديم نفس الخدمة بطاقة أقل.', hud: { n: ['efficacité'], r: 'même service', v: 'moins d’énergie' }, run: function (e) { e.s.set({ lampes: 1 }); } },
        { cap: 'L’**étiquette énergie** classe les appareils de **A** (économe) à **G** (gourmand).', ar: 'ملصق الطاقة يصنف الأجهزة من A (اقتصادي) إلى G (مستهلك كثيرا).', hud: { n: ['étiquette'], r: 'A → G', v: ['classe A'] }, run: function (e) { e.s.set({ classe: 0 }); } },
        { cap: 'Un vieux réfrigérateur classé **F** consomme bien plus qu’un neuf classé A.', ar: 'ثلاجة قديمة من صنف F تستهلك أكثر بكثير من ثلاجة جديدة من صنف A.', hud: { n: 'étiquette', r: 'A → G', v: ['classe F'] }, run: function (e) { e.s.set({ classe: 5 }); } },
        { cap: 'Énergie : **E = P × t**. LED 10 W, 5 h par jour, 30 jours : **1,5 kWh**.', ar: 'الطاقة [[E = P × t]]: صمام 10 W خلال 5 ساعات يوميا لمدة 30 يوما يعطي [[1,5 kWh]].', hud: { n: 'énergie', r: ['E = P × t'], v: ['1,5 kWh'] }, run: function (e) { e.s.set({ lampes: 1, h: 5 }); } },
        { cap: 'Des **gestes** et des **projets** simples réduisent la facture et le CO₂.', ar: 'سلوكات ومشاريع بسيطة تخفض الفاتورة وثنائي أكسيد الكربون.', hud: { n: ['gestes, projets'], r: 'éteindre, isoler, choisir', v: '–' }, run: function (e) { e.s.set({ gestes: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Règle la durée d’éclairage par jour et compare sur 30 jours. Place-toi sur 5 h par jour.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Comparer deux lampes' }, st);
          var s = scene(svg), set = MV.hud(c, [['h', 'durée'], ['i', 'incandescence'], ['l', 'LED'], ['e', 'économie', 1]]);
          MV.slider(c, { label: 'h/jour', min: 1, max: 10, value: 2 }, function (h) {
            s.set({ lampes: 1, h: h }); set('h', h + ' h'); set('i', MV.fmt(kwh(75, h), 2) + ' kWh'); set('l', MV.fmt(kwh(10, h), 2) + ' kWh'); set('e', MV.fmt(kwh(65, h), 2) + ' kWh');
            if (h === 5) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Une lampe allumée 5 h par jour pendant 30 jours.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. LED de 10 W. Énergie (kWh) ?', a: 1.5, hint: '10 × 5 × 30 = 1500 Wh' },
            { q: 'Étape 2. Lampe à incandescence de 75 W. Énergie (kWh) ?', a: 11.25 },
            { q: 'Étape 3. Énergie économisée avec la LED (kWh) ?', a: 9.75 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Sur une étiquette énergie, l’appareil le plus économe est en :', o: ['classe A', 'classe G'], a: 0 },
      { lvl: 'Niveau 2', q: 'Pour économiser l’énergie, on :', o: ['éteint les appareils en veille', 'laisse les chargeurs branchés'], a: 0 },
      { lvl: 'Niveau 3', q: 'Un réfrigérateur de 150 W fonctionne 10 h par jour. Énergie par jour (kWh) ?', a: 1.5 },
      { lvl: 'Niveau 4', q: 'On remplace 6 lampes de 60 W par 6 LED de 8 W, allumées 4 h par jour. Économie par jour (Wh) ?', a: 1248, hint: '6 × (60 − 8) × 4' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'La différence',
      hud: [['l', 'lumière'], ['p', 'consommation'], ['q', 'différence']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '5 h par jour pendant un mois : **11,25 kWh** contre **1,5 kWh**.', hud: { l: 'identique', p: ['11,25 / 1,5 kWh'], q: ['9,75 kWh'] }, run: function (e) { e.s.set({ lampes: 1, h: 5 }); } },
        { cap: 'Même lumière, **7 fois moins** d’énergie : c’est l’**efficacité énergétique**.', ar: 'نفس الإنارة بطاقة أقل بسبع مرات: هذه هي النجاعة الطاقية.', hud: { l: 'identique', p: 'LED', q: ['efficacité'] }, run: function (e) { e.s.set({ gestes: 1 }); } }
      ]
    },

    retenir: [
      '<b>Efficacité énergétique</b> : même service avec moins d’énergie. L’<b>étiquette énergie</b> classe de <b>A</b> (économe) à <b>G</b> (gourmand). Une LED consomme environ 7 fois moins qu’une lampe à incandescence.',
      'Énergie consommée : <b class="mono">E = P × t</b> (W × h = Wh ; 1 kWh = 1000 Wh). Gestes : éteindre la veille, isoler, choisir la classe A ; projets : éclairage solaire, arrosage automatique.'
    ],
    retenirAr: 'النجاعة الطاقية: نفس الخدمة بطاقة أقل. ملصق الطاقة من A الاقتصادي إلى G. الطاقة المستهلكة [[E = P × t]] و[[1 kWh = 1000 Wh]]. نطفئ الأجهزة في وضع الانتظار ونعزل ونختار الصنف A.',
    voc: [['l’efficacité énergétique', 'النجاعة الطاقية'], ['l’étiquette énergie', 'ملصق الطاقة'], ['la veille', 'وضع الانتظار'], ['le kilowattheure', 'الكيلوواط ساعة'], ['isoler', 'عزل']]
  });
})();
