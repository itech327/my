/* @meta {"id":"3ac-energie-electrique","level":"3","order":16,"theme":"Électricité","title":"Puissance et énergie électriques","ar":"القدرة والطاقة الكهربائيتان","lead":"Une ampoule de 60 W et une lampe LED de 8 W éclairent presque autant. Laquelle fait grimper la facture, et de combien ? Puissance, durée, énergie."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var APP = { 'ampoule 60 W': 60, 'lampe LED 8 W': 8, 'téléviseur 100 W': 100, 'fer à repasser 1 000 W': 1000 };

  /* compteur : barre d'énergie en Wh */
  function compteur(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('rect', { x: 40, y: 150, width: 280, height: 24, rx: 6, fill: '#1d1f23', stroke: '#5b6068' }, g);
    var dyn = S('g', {}, g);
    T(g, 40, 194, '0', 'tag'); T(g, 320, 194, '2 kWh', 'tag');
    g.set = function (P, h, lab) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var E = P * h, w = Math.min(280, E / 2000 * 280);
      S('rect', { x: 40, y: 150, width: w, height: 24, rx: 6, fill: 'var(--acc)' }, dyn);
      var n = Math.min(10, Math.round(P / 20) + 1); for (var i = 0; i < n; i++) S('path', { d: 'M' + (90 + i * 22) + ' 120 l6 -14 h-5 l4 -12', stroke: '#f2c14e', 'stroke-width': 2.5, fill: 'none' }, dyn);
      T(dyn, 180, 60, lab || '', 'lbl'); T(dyn, 180, 140, P + ' W × ' + h + ' h = ' + E + ' Wh', 'lbl acc');
      return E;
    };
    return g;
  }

  MV.lesson({
    id: '3ac-energie-electrique',
    objectif: {
      fr: 'Connaître la puissance électrique (P = U × I, en watts) et l\'énergie consommée (E = P × t, en joules ou en kWh), et calculer le coût d\'une consommation.',
      ar: 'معرفة القدرة الكهربائية ([[P = U × I]] بالواط) والطاقة المستهلكة ([[E = P × t]] بالجول أو بالكيلوواط ساعة)، وحساب كلفة الاستهلاك.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Deux lampes',
      hud: [['a', 'ampoule'], ['l', 'LED'], ['q', 'quelle facture ?']],
      draw: function (svg) { var e = {}; e.c = compteur(svg); return e; },
      steps: [
        { cap: 'Une **ampoule de 60 W** reste allumée 5 heures.', hud: { a: ['60 W'], l: '–', q: '–' }, run: function (e) { e.c.set(60, 5, 'ampoule'); } },
        { cap: 'Une **lampe LED de 8 W** éclaire presque autant, 5 heures aussi.', hud: { a: '60 W', l: ['8 W'], q: '–' }, run: function (e) { e.c.set(8, 5, 'LED'); } },
        { cap: 'Laquelle consomme le plus, et combien de fois plus ? On le saura à la fin.', hud: { a: '60 W', l: '8 W', q: ['?'] }, run: function (e) { e.c.set(60, 5, 'ampoule'); } }
      ]
    },

    prepare: [
      ['La puissance s\'exprime en watts (W).', true, 'Elle est souvent écrite sur l\'appareil.'],
      ['Un appareil plus puissant consomme moins d\'énergie dans le même temps.', false, 'Il en consomme plus.'],
      ['1 kW = 1 000 W.', true, 'Kilo veut dire mille.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Puissance et énergie',
      hud: [['g', 'grandeur'], ['f', 'formule'], ['v', 'exemple']],
      draw: function (svg) { var e = {}; e.c = compteur(svg); return e; },
      steps: [
        { cap: 'La **puissance** P d\'un appareil se mesure en **watts (W)**. En courant continu : **P = U × I**.', ar: 'القدرة تقاس بالواط، و [[P = U × I]].', hud: { g: ['puissance'], f: ['P = U × I'], v: '230 V × 0,26 A ≈ 60 W' }, run: function (e) { e.c.set(60, 1, 'ampoule'); } },
        { cap: 'L\'**énergie** consommée dépend aussi de la **durée** : **E = P × t**.', ar: 'الطاقة المستهلكة تتعلق أيضا بالمدة: [[E = P × t]].', hud: { g: ['énergie'], f: ['E = P × t'], v: '60 W × 5 h = 300 Wh' }, run: function (e) { e.c.set(60, 5, 'ampoule'); } },
        { cap: 'Unités : **joule** (J) si t est en secondes ; **wattheure** (Wh) ou **kWh** si t est en heures. 1 kWh = 1 000 Wh.', ar: 'الوحدات: الجول إذا كانت المدة بالثانية، والواط ساعة أو الكيلوواط ساعة إذا كانت بالساعة.', hud: { g: 'unités', f: 'J, Wh, kWh', v: ['300 Wh = 0,3 kWh'] }, run: function (e) { e.c.set(60, 5, 'ampoule'); } },
        { cap: 'Le **compteur** mesure l\'énergie en kWh ; la facture = énergie × **prix du kWh**.', ar: 'العداد يقيس الطاقة بالكيلوواط ساعة، والفاتورة = الطاقة × ثمن الكيلوواط ساعة.', hud: { g: ['coût'], f: 'kWh × prix', v: '0,3 kWh × 1 DH = 0,3 DH' }, run: function (e) { e.c.set(60, 5, 'ampoule'); } },
        { cap: 'Un appareil **puissant** utilisé longtemps coûte cher : un fer de 1 000 W pendant 2 h = **2 kWh**.', ar: 'جهاز قوي يستعمل مدة طويلة يكلف كثيرا.', hud: { g: 'comparaison', f: 'E = P × t', v: ['2 000 Wh'] }, run: function (e) { e.c.set(1000, 2, 'fer à repasser'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis un appareil et une durée. Trouve ce qui consomme 1 000 Wh.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Compteur d\'énergie' }, st);
          var cp = compteur(svg), app = 'ampoule 60 W', h = 1, set = MV.hud(c, [['a', 'appareil'], ['e', 'énergie', 1], ['p', 'coût à 1 DH/kWh']]);
          function upd() { var E = cp.set(APP[app], h, app); set('a', app); set('e', E + ' Wh'); set('p', String(E / 1000).replace('.', ',') + ' DH'); if (E === 1000) done(); }
          var row = MV.H('div', 'row', '', c); Object.keys(APP).forEach(function (k) { var b = MV.H('button', 'btn', k, row); b.onclick = function () { app = k; upd(); }; });
          MV.slider(c, { label: 'durée (h)', min: 1, max: 10, value: 1 }, function (v) { h = v; upd(); });
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'Un téléviseur de 100 W fonctionne 4 h par jour pendant 30 jours. Le kWh coûte 1 DH.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Énergie par jour : 100 × 4 = ? Wh', a: 400 },
            { q: 'Étape 2. Sur 30 jours, en kWh ?', a: 12 },
            { q: 'Étape 3. Coût en DH ?', a: 12 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'L\'unité de la puissance est :', o: ['le watt (W)', 'le joule (J)'], a: 0 },
      { lvl: 'Niveau 2', q: 'U = 12 V, I = 2 A. P = ? W', a: 24 },
      { lvl: 'Niveau 3', q: 'Un appareil de 500 W fonctionne 3 h. E = ? kWh', a: 1.5 },
      { lvl: 'Niveau 4', q: 'Une lampe de 10 W fonctionne 100 s. Énergie en joules ?', a: 1000 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Ampoule ou LED',
      hud: [['a', 'ampoule'], ['l', 'LED'], ['r', 'rapport']],
      draw: function (svg) { var e = {}; e.c = compteur(svg); return e; },
      steps: [
        { cap: 'Ampoule : 60 × 5 = **300 Wh**. LED : 8 × 5 = **40 Wh**.', hud: { a: ['300 Wh'], l: ['40 Wh'], r: '–' }, run: function (e) { e.c.set(60, 5, 'ampoule'); } },
        { cap: 'L\'ampoule consomme **7,5 fois plus** : la LED fait baisser la facture.', ar: 'المصباح العادي يستهلك 300 واط ساعة والمصباح LED يستهلك 40 فقط، أي أقل بسبع مرات ونصف.', hud: { a: '300 Wh', l: '40 Wh', r: ['× 7,5'] }, run: function (e) { e.c.set(8, 5, 'LED'); } }
      ]
    },

    retenir: [
      'La <b>puissance</b> P (W) : <b class="mono">P = U × I</b>. L\'<b>énergie</b> consommée : <b class="mono">E = P × t</b>, en joules (t en s) ou en Wh, kWh (t en h).',
      'Le compteur mesure l\'énergie en <b>kWh</b>. Coût = énergie × prix du kWh. Économiser : appareils peu puissants, éteindre ce qui ne sert pas.'
    ],
    retenirAr: 'القدرة [[P = U × I]] بالواط، والطاقة المستهلكة [[E = P × t]] بالجول أو بالكيلوواط ساعة. العداد يقيس الطاقة بالكيلوواط ساعة، والكلفة = الطاقة × ثمن الكيلوواط ساعة.',
    voc: [['la puissance', 'القدرة'], ['l\'énergie', 'الطاقة'], ['le watt', 'الواط'], ['le kilowattheure', 'الكيلوواط ساعة'], ['le compteur', 'العداد']]
  });
})();
