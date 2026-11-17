/* @meta {"id":"3ac-distribuer","level":"3","order":6,"theme":"Chaîne d’énergie","title":"Distribuer","ar":"التوزيع","lead":"Une carte de commande ne fournit que quelques milliampères, mais le moteur d’un portail en demande beaucoup plus, et il doit tourner dans les deux sens. Qui fait le lien ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  // pont en H : K1 haut gauche, K3 bas gauche, K2 haut droite, K4 bas droite
  var SW = { K1: [120, 40, 105], K3: [120, 105, 170], K2: [260, 40, 105], K4: [260, 105, 170] };

  function sens(k) {
    if ((k.K1 && k.K3) || (k.K2 && k.K4)) return 'court-circuit';
    if (k.K1 && k.K4) return 'avant';
    if (k.K2 && k.K3) return 'arrière';
    return 'arrêt';
  }
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function inter(name, on) {
      var p = SW[name], x = p[0], y1 = p[1], y2 = p[2], m = (y1 + y2) / 2;
      S('path', { d: 'M' + x + ' ' + y1 + 'V' + (m - 12) + 'M' + x + ' ' + (m + 12) + 'V' + y2, stroke: '#9aa0a8', 'stroke-width': 2.5 }, dyn);
      S('line', { x1: x, y1: m + 12, x2: on ? x : x + 14, y2: m - 12, stroke: on ? 'var(--acc)' : '#e9e9ea', 'stroke-width': 3 }, dyn);
      T(dyn, x + (x < 190 ? -10 : 10), m + 4, name, 'lbl', x < 190 ? 'end' : 'start');
    }
    function pont(k) {
      S('path', { d: 'M40 40H260M40 170H260M40 40V92M40 118V170M120 105H170M210 105H260', stroke: '#9aa0a8', 'stroke-width': 2.5, fill: 'none' }, dyn);
      S('path', { d: 'M26 92H54M33 100H47', stroke: '#f2c14e', 'stroke-width': 3 }, dyn);
      S('path', { d: 'M40 100V118', stroke: '#9aa0a8', 'stroke-width': 2.5 }, dyn);
      T(dyn, 22, 86, '+', 'lbl'); T(dyn, 22, 128, '12 V', 'tag');
      Object.keys(SW).forEach(function (n) { inter(n, k[n]); });
      var r = sens(k);
      S('circle', { cx: 190, cy: 105, r: 20, fill: 'var(--acc-bg)', stroke: 'var(--acc)', 'stroke-width': 2.5 }, dyn);
      T(dyn, 190, 111, 'M', 'lbl big');
      if (r === 'avant' || r === 'arrière') {
        var h = S('g', {}, dyn);
        S('path', { d: 'M190 78V86', stroke: '#fff', 'stroke-width': 3 }, h);
        S('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 190 105', to: (r === 'avant' ? 360 : -360) + ' 190 105', dur: '1s', repeatCount: 'indefinite' }, h);
        var path = r === 'avant' ? 'M40 40H120V105H260V170H40' : 'M40 40H260V105H120V170H40';
        [0, .5, 1].forEach(function (b) {
          var d = S('circle', { r: 3.5, fill: '#f2c14e' }, dyn);
          S('animateMotion', { dur: '1.6s', begin: b + 's', repeatCount: 'indefinite', path: path }, d);
        });
        T(dyn, 190, 140, r === 'avant' ? 'sens horaire' : 'sens inverse', 'tag');
      } else if (r === 'court-circuit') {
        var w = T(dyn, 190, 140, 'COURT-CIRCUIT !', 'lbl');
        w.style.fill = '#e5484d';
        S('animate', { attributeName: 'opacity', values: '1;.2;1', dur: '.6s', repeatCount: 'indefinite' }, w);
      }
    }
    function relais(on) {
      // petit circuit de commande
      S('rect', { x: 14, y: 70, width: 70, height: 56, rx: 8, fill: '#1d1f22', stroke: '#56d07f', 'stroke-width': 2 }, dyn);
      T(dyn, 49, 95, 'carte', 'tag'); T(dyn, 49, 110, '5 V, 20 mA', 'tag');
      S('path', { d: 'M84 90H120M84 110H120', stroke: on ? '#56d07f' : '#5b6068', 'stroke-width': 2 }, dyn);
      S('rect', { x: 120, y: 80, width: 34, height: 40, rx: 4, fill: on ? '#15281c' : '#1d1f22', stroke: '#56d07f', 'stroke-width': 2 }, dyn);
      T(dyn, 137, 140, 'bobine', 'tag');
      S('path', { d: 'M154 100H190', stroke: '#5b6068', 'stroke-width': 1.5, 'stroke-dasharray': '3 3' }, dyn);
      // circuit de puissance
      S('path', { d: 'M196 40H340V170H196V120M196 80V40', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 3, fill: 'none' }, dyn);
      S('line', { x1: 196, y1: 120, x2: on ? 196 : 212, y2: 80, stroke: on ? 'var(--acc)' : '#e9e9ea', 'stroke-width': 3 }, dyn);
      T(dyn, 222, 104, 'contact', 'tag', 'start');
      S('circle', { cx: 340, cy: 105, r: 18, fill: 'var(--acc-bg)', stroke: 'var(--acc)', 'stroke-width': 2.5 }, dyn);
      T(dyn, 340, 111, 'M', 'lbl big');
      T(dyn, 268, 30, 'moteur 230 V, 3 A', 'tag');
      if (on) {
        var d = S('circle', { r: 3.5, fill: '#f2c14e' }, dyn);
        S('animateMotion', { dur: '1.6s', repeatCount: 'indefinite', path: 'M196 120V80V40H340V170H196V120' }, d);
      }
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.relais != null) relais(o.relais); else pont(o.k || {});
    };
    return g;
  }

  MV.lesson({
    id: '3ac-distribuer',
    objectif: {
      fr: 'Savoir que le pré-actionneur distribue l’énergie à l’actionneur sur ordre de la commande (relais, transistor, contacteur, distributeur), et inverser le sens d’un moteur avec un pont en H.',
      ar: 'معرفة أن المنفذ المسبق يوزع الطاقة على المنفذ بأمر من التحكم (مرحل، ترانزستور، ملامس، موزع)، وعكس اتجاه دوران محرك بقنطرة H.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Le moteur du portail',
      hud: [['c', 'commande'], ['m', 'moteur'], ['q', 'lien ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'La **carte de commande** donne 5 V et seulement **20 mA**.', hud: { c: ['20 mA'], m: '–', q: '?' }, run: function (e) { e.s.set({ relais: 0 }); } },
        { cap: 'Le **moteur** du portail demande 230 V et **3 A**, 150 fois plus.', hud: { c: '20 mA', m: ['3 A'], q: '?' }, run: function (e) { e.s.set({ relais: 0 }); } },
        { cap: 'Et le portail doit **s’ouvrir et se fermer** : deux sens de rotation. Qui fait le lien ?', hud: { c: '20 mA', m: '3 A', q: ['?'] }, run: function (e) { e.s.set({ k: { K1: 1, K4: 1 } }); } }
      ]
    },

    prepare: [
      ['Un interrupteur ouvert empêche le courant de passer.', true, 'Le circuit est coupé.'],
      ['Si on inverse les bornes d’un petit moteur à courant continu, il tourne dans l’autre sens.', true, 'Le sens du courant fixe le sens de rotation.'],
      ['Relier directement les deux bornes d’une pile est sans danger.', false, 'C’est un court-circuit : la pile chauffe.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Pré-actionneurs et pont en H',
      hud: [['f', 'fonction'], ['o', 'organe'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Distribuer**, c’est laisser passer ou non l’énergie vers l’actionneur, **sur ordre** de la commande.', ar: 'التوزيع هو تمرير الطاقة أو منعها نحو المنفذ، بأمر من التحكم.', hud: { f: ['distribuer'], o: 'pré-actionneur', r: '–' }, run: function (e) { e.s.set({ relais: 0 }); } },
        { cap: 'Le **relais** : un petit courant dans la **bobine** ferme un **contact** qui laisse passer un grand courant.', ar: 'المرحل: تيار صغير في الوشيعة يغلق تماسا يمرر تيارا كبيرا.', hud: { f: 'distribuer', o: ['relais'], r: ['moteur en marche'] }, run: function (e) { e.s.set({ relais: 1 }); } },
        { cap: 'Autres pré-actionneurs : **transistor**, **contacteur**, et **distributeur** pour un vérin pneumatique.', ar: 'منفذات مسبقة أخرى: الترانزستور، الملامس، والموزع للدافعة الهوائية.', hud: { f: 'distribuer', o: ['transistor, distributeur'], r: '–' }, run: function (e) { e.s.set({ relais: 1 }); } },
        { cap: '**Pont en H** : on ferme **K1 et K4**, le courant traverse le moteur dans un sens.', ar: 'قنطرة H: نغلق K1 و K4 فيمر التيار في المحرك في اتجاه.', hud: { f: 'pont en H', o: ['K1 + K4'], r: ['sens horaire'] }, run: function (e) { e.s.set({ k: { K1: 1, K4: 1 } }); } },
        { cap: 'On ferme **K2 et K3** : le courant s’inverse, le moteur tourne **dans l’autre sens**.', ar: 'نغلق K2 و K3 فينعكس التيار ويدور المحرك في الاتجاه الآخر.', hud: { f: 'pont en H', o: ['K2 + K3'], r: ['sens inverse'] }, run: function (e) { e.s.set({ k: { K2: 1, K3: 1 } }); } },
        { cap: 'Jamais **K1 et K3** ensemble : c’est un **court-circuit**.', ar: 'لا نغلق أبدا K1 و K3 معا: إنها دارة قصيرة.', hud: { f: 'pont en H', o: ['K1 + K3'], r: ['danger'] }, run: function (e) { e.s.set({ k: { K1: 1, K3: 1 } }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Fais tourner le moteur dans un sens, puis dans l’autre.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Pont en H' }, st);
          var s = scene(svg), set = MV.hud(c, [['k', 'fermés'], ['r', 'moteur', 1]]), vu = {};
          var row = MV.H('div', 'row', '', c);
          function paint(k, txt) { s.set({ k: k }); var r = sens(k); set('k', txt); set('r', r); vu[r] = 1; if (vu.avant && vu['arrière']) done(); }
          MV.H('button', 'btn', 'Fermer K1 et K4', row).onclick = function () { paint({ K1: 1, K4: 1 }, 'K1, K4'); };
          MV.H('button', 'btn', 'Fermer K2 et K3', row).onclick = function () { paint({ K2: 1, K3: 1 }, 'K2, K3'); };
          MV.H('button', 'btn', 'Tout ouvrir', row).onclick = function () { paint({}, 'aucun'); };
          paint({}, 'aucun');
        } },
      { title: 'Résolvons ensemble', intro: 'Le portail est commandé par une carte Arduino.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Un relais permet à un petit courant de commander :', o: ['un grand courant', 'une pile plus petite'], a: 0 },
            { type: 'opt', q: 'Étape 2. Pour inverser le sens d’un moteur à courant continu, on inverse :', o: ['le sens du courant', 'la longueur des fils'], a: 0 },
            { type: 'opt', q: 'Étape 3. Pour un vérin pneumatique, le pré-actionneur est :', o: ['un distributeur', 'un relais thermique'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le pré-actionneur se place entre :', o: ['la commande et l’actionneur', 'la pile et le capteur'], a: 0 },
      { lvl: 'Niveau 2', q: 'Un moteur de 230 V est commandé par une carte de 5 V. On utilise :', o: ['un relais', 'une LED', 'un capteur'], a: 0 },
      { lvl: 'Niveau 3', q: 'Dans un pont en H, fermer K1 et K3 du même côté provoque :', o: ['un court-circuit', 'la rotation du moteur'], a: 0 },
      { lvl: 'Niveau 4', q: 'Un transistor multiplie par 100 le courant de commande. Commande : 2 mA. Courant dans le moteur (mA) ?', a: 200 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le lien',
      hud: [['c', 'commande'], ['m', 'moteur'], ['q', 'lien']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le **relais** fait le lien : 20 mA dans la bobine commandent 3 A dans le moteur.', hud: { c: '20 mA', m: '3 A', q: ['relais'] }, run: function (e) { e.s.set({ relais: 1 }); } },
        { cap: 'Le **pont en H** choisit le sens : K1 et K4 pour ouvrir, K2 et K3 pour fermer.', ar: 'قنطرة H تختار الاتجاه: K1 و K4 للفتح، و K2 و K3 للإغلاق.', hud: { c: 'carte', m: ['deux sens'], q: ['pont en H'] }, run: function (e) { e.s.set({ k: { K2: 1, K3: 1 } }); } }
      ]
    },

    retenir: [
      '<b>Distribuer</b> = faire passer l’énergie vers l’actionneur sur ordre de la commande. Le <b>pré-actionneur</b> se place entre la commande et l’actionneur : relais, transistor, contacteur, distributeur pneumatique.',
      'Un <b>pont en H</b> inverse le sens d’un moteur : K1 et K4 dans un sens, K2 et K3 dans l’autre. Jamais deux interrupteurs du même côté : court-circuit.'
    ],
    retenirAr: 'التوزيع هو تمرير الطاقة نحو المنفذ بأمر من التحكم. المنفذ المسبق بين التحكم والمنفذ: مرحل، ترانزستور، ملامس، موزع. قنطرة H تعكس اتجاه دوران المحرك.',
    voc: [['distribuer', 'توزيع'], ['un pré-actionneur', 'منفذ مسبق'], ['un relais', 'مرحل'], ['une bobine', 'وشيعة'], ['un pont en H', 'قنطرة H']]
  });
})();
