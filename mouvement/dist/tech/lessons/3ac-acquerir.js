/* @meta {"id":"3ac-acquerir","level":"3","order":2,"theme":"Chaîne d’information","title":"Acquérir l’information","ar":"اكتساب المعلومة","lead":"Une voiture approche de la barrière d’un parking. Comment la barrière sait-elle qu’une voiture est là, et à quelle distance ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, SX = 306; // position du capteur à ultrasons

  function echo(d) { return Math.round(2 * d / 34 * 10) / 10; } // ms, son : 34 cm par ms
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('line', { x1: 0, y1: 160, x2: 360, y2: 160, stroke: '#5b6068', 'stroke-width': 2 }, g);
    // capteur à ultrasons sur son poteau
    S('rect', { x: SX + 4, y: 100, width: 6, height: 60, fill: '#5b6068' }, g);
    S('rect', { x: SX - 6, y: 120, width: 16, height: 22, rx: 3, fill: '#1d1f22', stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    S('circle', { cx: SX - 6, cy: 126, r: 3, fill: '#9aa0a8' }, g); S('circle', { cx: SX - 6, cy: 136, r: 3, fill: '#9aa0a8' }, g);
    var dyn = S('g', {}, g);
    g.set = function (o) { // o.d distance en cm, o.ondes, o.det, o.sig
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var front = SX - 12 - o.d * 2.1;
      var car = S('g', {}, dyn);
      S('path', { d: 'M' + (front - 70) + ' 150V132L' + (front - 52) + ' 118H' + (front - 18) + 'L' + front + ' 132V150Z', fill: '#26292d', stroke: '#e9e9ea', 'stroke-width': 2 }, car);
      S('circle', { cx: front - 54, cy: 152, r: 8, fill: '#141517', stroke: '#e9e9ea', 'stroke-width': 2 }, car);
      S('circle', { cx: front - 16, cy: 152, r: 8, fill: '#141517', stroke: '#e9e9ea', 'stroke-width': 2 }, car);
      if (o.ondes && o.d > 0) {
        var p = 'M' + (SX - 10) + ' 131H' + (front + 2) + 'H' + (SX - 10);
        [0, .45].forEach(function (b) {
          var w = S('path', { d: 'M-3 -9Q3 0 -3 9', stroke: 'var(--acc)', 'stroke-width': 2.5, fill: 'none' }, dyn);
          S('animateMotion', { dur: '1.2s', begin: b + 's', repeatCount: 'indefinite', path: p }, w);
        });
        S('line', { x1: front, y1: 172, x2: SX - 6, y2: 172, stroke: '#9aa0a8', 'stroke-width': 1.2, 'stroke-dasharray': '3 3' }, dyn);
        T(dyn, (front + SX) / 2, 190, 'd = ' + o.d + ' cm', 'tag');
      }
      if (o.det) {
        var on = o.d <= 30;
        S('rect', { x: 16, y: 24, width: 140, height: 40, rx: 8, fill: '#1d1f22', stroke: on ? '#56d07f' : '#5b6068', 'stroke-width': 2 }, dyn);
        S('circle', { cx: 42, cy: 44, r: 9, fill: on ? '#56d07f' : '#2c2f34' }, dyn);
        T(dyn, 58, 49, 'détecteur : ' + (on ? '1' : '0'), 'lbl', 'start');
        S('line', { x1: SX - 72, y1: 160, x2: SX - 32, y2: 160, stroke: on ? '#56d07f' : '#9aa0a8', 'stroke-width': 5 }, dyn);
        T(dyn, SX - 52, 110, 'zone 30 cm', 'tag');
      }
      if (o.sig) { // allure des deux signaux
        S('rect', { x: 170, y: 14, width: 170, height: 70, rx: 8, fill: '#17181a', stroke: '#2c2f34' }, dyn);
        if (o.sig === 'log') {
          S('path', { d: 'M180 70H230V30H280V70H330', stroke: '#56d07f', 'stroke-width': 2.5, fill: 'none' }, dyn);
          T(dyn, 255, 26, 'logique : 0 ou 1', 'tag');
        } else {
          S('path', { d: 'M180 70C210 70 220 30 250 40S300 66 330 28', stroke: '#7fb2ff', 'stroke-width': 2.5, fill: 'none' }, dyn);
          T(dyn, 255, 26, 'analogique : toutes les valeurs', 'tag');
        }
      }
    };
    return g;
  }

  MV.lesson({
    id: '3ac-acquerir',
    objectif: {
      fr: 'Savoir que la fonction acquérir prélève une information, distinguer détecteur (signal logique) et capteur (signal analogique), et calculer une distance avec un capteur à ultrasons.',
      ar: 'معرفة أن وظيفة الاكتساب تأخذ معلومة، والتمييز بين الكاشف (إشارة منطقية) واللاقط (إشارة تناظرية)، وحساب مسافة بلاقط فوق صوتي.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Une voiture approche',
      hud: [['d', 'distance'], ['t', 'écho'], ['b', 'barrière']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Une voiture approche de la **barrière** du parking.', hud: { d: '?', t: '–', b: 'fermée' }, run: function (e) { e.s.set({ d: 90 }); } },
        { cap: 'Le boîtier envoie un **son inaudible** et écoute son retour.', hud: { d: '?', t: ['écoute…'], b: 'fermée' }, run: function (e) { e.s.set({ d: 60, ondes: 1 }); } },
        { cap: 'Grâce à cet **écho**, il connaît la distance. Comment ?', hud: { d: ['34 cm'], t: ['2 ms'], b: '?' }, run: function (e) { e.s.set({ d: 34, ondes: 1 }); } }
      ]
    },

    prepare: [
      ['Le son met du temps pour parcourir une distance.', true, 'Dans l’air, environ 340 m par seconde.'],
      ['Un écho est un son qui revient après avoir rencontré un obstacle.', true, 'Il fait un aller et un retour.'],
      ['Un interrupteur peut mesurer une température.', false, 'Il donne seulement deux états : ouvert ou fermé.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Détecteur et capteur',
      hud: [['f', 'fonction'], ['s', 'signal'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Acquérir**, c’est prélever une information sur le système ou son environnement.', ar: 'الاكتساب هو أخذ معلومة عن النظام أو محيطه.', hud: { f: ['acquérir'], s: '–', v: '–' }, run: function (e) { e.s.set({ d: 70 }); } },
        { cap: 'Un **détecteur** répond seulement oui ou non : signal **logique**, 0 ou 1.', ar: 'الكاشف يجيب بنعم أو لا فقط: إشارة منطقية 0 أو 1.', hud: { f: 'détecter', s: ['logique'], v: '0' }, run: function (e) { e.s.set({ d: 50, det: 1, sig: 'log' }); } },
        { cap: 'La voiture entre dans la zone : le détecteur passe à **1**.', ar: 'تدخل السيارة المنطقة فيصبح الكاشف 1.', hud: { f: 'détecter', s: 'logique', v: ['1'] }, run: function (e) { e.s.set({ d: 20, det: 1, sig: 'log' }); } },
        { cap: 'Un **capteur** donne une **valeur** qui varie : signal **analogique**.', ar: 'اللاقط يعطي قيمة متغيرة: إشارة تناظرية.', hud: { f: 'mesurer', s: ['analogique'], v: '34 cm' }, run: function (e) { e.s.set({ d: 34, ondes: 1, sig: 'ana' }); } },
        { cap: 'Ultrasons : le son fait **l’aller et le retour**. Distance = 34 cm par ms × durée ÷ 2.', ar: 'الموجات فوق الصوتية تذهب وتعود: المسافة = [[34 × t ÷ 2]] بالسنتيمتر.', hud: { f: 'mesurer', s: 'analogique', v: ['2 ms → 34 cm'] }, run: function (e) { e.s.set({ d: 34, ondes: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Rapproche la voiture. Observe l’écho et le détecteur, puis fais entrer la voiture dans la zone de 30 cm.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Voiture et capteur à ultrasons' }, st);
          var s = scene(svg), set = MV.hud(c, [['d', 'distance'], ['t', 'écho', 1], ['b', 'détecteur']]);
          MV.slider(c, { label: 'distance', min: 10, max: 100, step: 2, value: 80, fmt: function (v) { return v + ' cm'; } }, function (d) {
            s.set({ d: d, ondes: 1, det: 1 }); set('d', d + ' cm'); set('t', MV.fmt(echo(d), 1) + ' ms'); set('b', d <= 30 ? '1' : '0'); if (d <= 30) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Un capteur reçoit l’écho 4 ms après l’émission. Le son parcourt 34 cm par ms.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Distance parcourue par le son, aller et retour (cm) ?', a: 136, hint: '34 × 4' },
            { q: 'Étape 2. Distance de l’obstacle (cm) ?', a: 68, hint: 'Le son a fait deux fois le trajet.' },
            { type: 'opt', q: 'Étape 3. Ce capteur donne une valeur qui varie. Son signal est :', o: ['analogique', 'tout ou rien'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un interrupteur de fin de course donne un signal :', o: ['logique (0 ou 1)', 'analogique (valeurs continues)'], a: 0 },
      { lvl: 'Niveau 2', q: 'Pour mesurer la température d’une serre, on utilise :', o: ['un capteur de température', 'un bouton poussoir'], a: 0 },
      { lvl: 'Niveau 3', q: 'Un détecteur ILS se ferme à l’approche :', o: ['d’un aimant', 'de la lumière', 'de la chaleur'], a: 0 },
      { lvl: 'Niveau 4', q: 'Obstacle à 170 cm. Durée de l’écho (ms) ? (son : 34 cm par ms)', a: 10, hint: 'Aller et retour : 340 cm.' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'La barrière sait',
      hud: [['d', 'distance'], ['t', 'écho'], ['b', 'détecteur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'L’écho revient en **2 ms** : le son a fait 68 cm aller et retour, la voiture est à **34 cm**.', hud: { d: ['34 cm'], t: ['2 ms'], b: '0' }, run: function (e) { e.s.set({ d: 34, ondes: 1, det: 1 }); } },
        { cap: 'Dans la zone de 30 cm, le **détecteur** passe à 1 : la barrière peut s’ouvrir.', ar: 'داخل منطقة 30 سم يصبح الكاشف 1 فيمكن للحاجز أن يفتح.', hud: { d: '20 cm', t: '1,2 ms', b: ['1'] }, run: function (e) { e.s.set({ d: 20, ondes: 1, det: 1 }); } }
      ]
    },

    retenir: [
      '<b>Acquérir</b> = prélever une information. Un <b>détecteur</b> (fin de course, ILS, détecteur de présence) donne un signal <b>logique</b> : 0 ou 1. Un <b>capteur</b> (température, distance, lumière) donne un signal <b>analogique</b> qui varie.',
      'Capteur à ultrasons : <b class="mono">distance = vitesse du son × durée ÷ 2</b>, car le son fait l’aller et le retour.'
    ],
    retenirAr: 'الاكتساب هو أخذ معلومة. الكاشف يعطي إشارة منطقية 0 أو 1، واللاقط يعطي إشارة تناظرية متغيرة. لاقط الموجات فوق الصوتية: المسافة = سرعة الصوت × المدة ÷ 2.',
    voc: [['acquérir', 'اكتساب'], ['un capteur', 'لاقط'], ['un détecteur', 'كاشف'], ['un signal logique', 'إشارة منطقية'], ['un signal analogique', 'إشارة تناظرية']]
  });
})();
