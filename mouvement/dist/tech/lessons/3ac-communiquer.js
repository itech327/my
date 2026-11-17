/* @meta {"id":"3ac-communiquer","level":"3","order":4,"theme":"Chaîne d’information","title":"Communiquer l’information","ar":"تبليغ المعلومة","lead":"Tu appuies sur la télécommande, le téléviseur change de chaîne. Une information a voyagé sans fil. Sous quelle forme, et par quel chemin ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, W = [8, 4, 2, 1];

  function bits(n) { return W.map(function (w) { return n & w ? 1 : 0; }); }
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (o) { // o.mode : cable, ir, radio ; o.n : nombre codé ; o.sig : visuel, sonore
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      S('rect', { x: 18, y: 36, width: 72, height: 54, rx: 8, fill: '#1d1f22', stroke: '#9aa0a8', 'stroke-width': 2 }, dyn);
      T(dyn, 54, 67, 'émetteur', 'tag');
      S('rect', { x: 270, y: 36, width: 72, height: 54, rx: 8, fill: '#1d1f22', stroke: '#9aa0a8', 'stroke-width': 2 }, dyn);
      T(dyn, 306, 67, 'récepteur', 'tag');
      var path = 'M92 63H268';
      if (o.mode === 'cable') {
        S('path', { d: path, stroke: '#9aa0a8', 'stroke-width': 4 }, dyn);
        T(dyn, 180, 26, 'liaison câblée', 'lbl');
      } else if (o.mode === 'ir') {
        S('path', { d: path, stroke: '#e5484d', 'stroke-width': 1.5, 'stroke-dasharray': '6 5' }, dyn);
        T(dyn, 180, 26, 'infrarouge : il faut voir le récepteur', 'tag');
      } else if (o.mode === 'radio') {
        [0, .5, 1].forEach(function (b) {
          var c = S('circle', { cx: 92, cy: 63, r: 4, fill: 'none', stroke: '#7fb2ff', 'stroke-width': 2 }, dyn);
          S('animate', { attributeName: 'r', from: 4, to: 180, dur: '1.5s', begin: b + 's', repeatCount: 'indefinite' }, c);
          S('animate', { attributeName: 'opacity', from: 1, to: 0, dur: '1.5s', begin: b + 's', repeatCount: 'indefinite' }, c);
        });
        S('rect', { x: 196, y: 24, width: 10, height: 80, fill: '#5b6068' }, dyn);
        T(dyn, 201, 120, 'mur', 'tag');
        T(dyn, 130, 20, 'ondes radio', 'lbl');
      }
      if (o.mode === 'cable' || o.mode === 'ir') {
        [0, .4, .8].forEach(function (b) {
          var d = S('rect', { x: -5, y: -5, width: 10, height: 10, fill: o.mode === 'ir' ? '#e5484d' : 'var(--acc)' }, dyn);
          S('animateMotion', { dur: '1.2s', begin: b + 's', repeatCount: 'indefinite', path: path }, d);
        });
      }
      if (o.n != null) {
        var b = bits(o.n);
        b.forEach(function (v, i) {
          var x = 96 + i * 44;
          S('rect', { x: x, y: 138, width: 34, height: 34, rx: 6, fill: v ? 'var(--acc)' : '#26292d', stroke: v ? 'var(--acc)' : '#5b6068', 'stroke-width': 2 }, dyn);
          T(dyn, x + 17, 161, String(v), 'lbl big');
          T(dyn, x + 17, 190, String(W[i]), 'tag');
        });
        T(dyn, 278, 161, '= ' + o.n, 'lbl big', 'start');
        T(dyn, 60, 190, 'poids', 'tag');
      }
      if (o.sig === 'visuel') {
        S('circle', { cx: 306, cy: 106, r: 10, fill: '#56d07f' }, dyn);
        S('animate', { attributeName: 'opacity', values: '1;.2;1', dur: '1s', repeatCount: 'indefinite' }, dyn.lastChild);
        T(dyn, 354, 130, 'LED : signal visuel', 'tag', 'end');
      } else if (o.sig === 'sonore') {
        S('rect', { x: 284, y: 96, width: 28, height: 20, rx: 4, fill: '#26292d', stroke: '#f2c14e', 'stroke-width': 2 }, dyn);
        [12, 20].forEach(function (r) { S('path', { d: 'M' + (314 + r / 2) + ' ' + (106 - r / 2) + 'Q' + (318 + r) + ' 106 ' + (314 + r / 2) + ' ' + (106 + r / 2), stroke: '#f2c14e', 'stroke-width': 2, fill: 'none' }, dyn); });
        T(dyn, 354, 130, 'buzzer : signal sonore', 'tag', 'end');
      }
    };
    return g;
  }

  MV.lesson({
    id: '3ac-communiquer',
    objectif: {
      fr: 'Savoir que la fonction communiquer transmet l’information (câble, infrarouge, ondes radio), coder un nombre en binaire et distinguer signal visuel et signal sonore.',
      ar: 'معرفة أن وظيفة التبليغ تنقل المعلومة (سلك، أشعة تحت حمراء، موجات راديو)، وترميز عدد بالنظام الثنائي، والتمييز بين الإشارة المرئية والإشارة الصوتية.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'La télécommande',
      hud: [['c', 'chemin'], ['f', 'forme'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Tu appuies sur la touche **10** de la télécommande.', hud: { c: '?', f: '?', r: '–' }, run: function (e) { e.s.set({}); } },
        { cap: 'Une lumière **invisible** part vers le téléviseur.', hud: { c: ['infrarouge'], f: '?', r: '–' }, run: function (e) { e.s.set({ mode: 'ir' }); } },
        { cap: 'Elle transporte un message fait seulement de **0** et de **1**. Comment écrire 10 ainsi ?', hud: { c: 'infrarouge', f: ['0 et 1'], r: ['chaîne 10'] }, run: function (e) { e.s.set({ mode: 'ir', n: 10 }); } }
      ]
    },

    prepare: [
      ['Le Wi-Fi fonctionne sans fil.', true, 'Il utilise des ondes radio.'],
      ['Une télécommande infrarouge fonctionne à travers un mur.', false, 'L’infrarouge est arrêté par les obstacles.'],
      ['Un ordinateur travaille avec des 0 et des 1.', true, 'Ce sont des bits.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Transmettre et coder',
      hud: [['c', 'chemin'], ['e', 'exemple'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Communiquer**, c’est transmettre l’information à l’utilisateur ou à un autre système.', ar: 'التبليغ هو نقل المعلومة إلى المستعمل أو إلى نظام آخر.', hud: { c: ['câble'], e: 'clavier USB', v: '–' }, run: function (e) { e.s.set({ mode: 'cable' }); } },
        { cap: 'Par **infrarouge** : sans fil, mais l’émetteur doit **voir** le récepteur.', ar: 'بالأشعة تحت الحمراء: بدون سلك، لكن يجب أن يرى المرسل المستقبل.', hud: { c: ['infrarouge'], e: 'télécommande', v: '–' }, run: function (e) { e.s.set({ mode: 'ir' }); } },
        { cap: 'Par **ondes radio** : sans fil et à travers les murs.', ar: 'بالموجات الراديوية: بدون سلك ومن خلال الجدران.', hud: { c: ['radio'], e: 'Wi-Fi, Bluetooth', v: '–' }, run: function (e) { e.s.set({ mode: 'radio' }); } },
        { cap: 'L’information est **codée en bits**. 1010 : 8 + 2 = **10**.', ar: 'المعلومة مرمزة بالبتات: [[1010 = 8 + 2 = 10]].', hud: { c: 'infrarouge', e: '4 bits', v: ['10'] }, run: function (e) { e.s.set({ mode: 'ir', n: 10 }); } },
        { cap: 'Avec **4 bits**, on code 16 valeurs : de 0 à **15**.', ar: 'بأربع بتات نرمز 16 قيمة: من 0 إلى 15.', hud: { c: 'infrarouge', e: '1111', v: ['15'] }, run: function (e) { e.s.set({ mode: 'ir', n: 15 }); } },
        { cap: 'Pour l’humain : signal **visuel** (LED, écran) ou **sonore** (buzzer).', ar: 'بالنسبة للإنسان: إشارة مرئية (صمام، شاشة) أو صوتية (طنان).', hud: { c: 'câble', e: ['LED, buzzer'], v: '–' }, run: function (e) { e.s.set({ mode: 'cable', sig: 'sonore' }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis le nombre à envoyer et observe ses 4 bits. Envoie la chaîne 10.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Codage binaire' }, st);
          var s = scene(svg), set = MV.hud(c, [['n', 'nombre'], ['b', 'bits', 1]]);
          MV.slider(c, { label: 'nombre', min: 0, max: 15, value: 3 }, function (n) { s.set({ mode: 'ir', n: n }); set('n', n); set('b', bits(n).join('')); if (n === 10) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Une alarme envoie son état à un téléphone.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Combien de bits pour coder les nombres de 0 à 15 ?', a: 4 },
            { q: 'Étape 2. Le code reçu est 1101. Quel nombre ?', a: 13, hint: '8 + 4 + 1' },
            { type: 'opt', q: 'Étape 3. Le téléphone est dans une autre pièce. On choisit :', o: ['les ondes radio', 'l’infrarouge'], a: 0, e: 'La radio traverse les murs.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un buzzer donne un signal :', o: ['sonore', 'visuel'], a: 0 },
      { lvl: 'Niveau 2', q: 'La télécommande d’un téléviseur utilise le plus souvent :', o: ['l’infrarouge', 'un câble', 'le son'], a: 0 },
      { lvl: 'Niveau 3', q: 'Le code 0110 vaut en décimal :', a: 6, hint: '4 + 2' },
      { lvl: 'Niveau 4', q: 'Combien de valeurs différentes peut-on coder avec 8 bits ?', a: 256, hint: '2 multiplié 8 fois par lui-même.' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le message de la télécommande',
      hud: [['c', 'chemin'], ['f', 'forme'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'La touche 10 devient le code **1010** : 8 + 2.', hud: { c: 'infrarouge', f: ['1010'], r: '10' }, run: function (e) { e.s.set({ mode: 'ir', n: 10 }); } },
        { cap: 'Le code voyage par **infrarouge** ; le téléviseur le décode et affiche la **chaîne 10**.', ar: 'ينتقل الرمز بالأشعة تحت الحمراء، فيفك التلفاز الرمز ويعرض القناة 10.', hud: { c: ['infrarouge'], f: '1010', r: ['chaîne 10'] }, run: function (e) { e.s.set({ mode: 'ir', n: 10, sig: 'visuel' }); } }
      ]
    },

    retenir: [
      '<b>Communiquer</b> = transmettre l’information. Liaison <b>câblée</b> (USB, réseau), <b>infrarouge</b> (sans obstacle) ou <b>radio</b> (Wi-Fi, Bluetooth, à travers les murs). Pour l’utilisateur : signal <b>visuel</b> ou <b>sonore</b>.',
      'L’information est codée en <b>bits</b> (0 ou 1). Poids de 4 bits : <b class="mono">8, 4, 2, 1</b>. Avec n bits on code <b class="mono">2ⁿ</b> valeurs.'
    ],
    retenirAr: 'التبليغ هو نقل المعلومة بسلك أو بالأشعة تحت الحمراء أو بالموجات الراديوية. ترمز المعلومة ببتات 0 أو 1، وأوزان أربع بتات هي 8 و4 و2 و1.',
    voc: [['communiquer', 'تبليغ'], ['un bit', 'بت'], ['l’infrarouge', 'الأشعة تحت الحمراء'], ['les ondes radio', 'الموجات الراديوية'], ['un signal sonore', 'إشارة صوتية']]
  });
})();
