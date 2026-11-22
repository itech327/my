/* @meta {"id":"3ac-mouvement","level":"3","order":17,"theme":"Mécanique","title":"Trajectoire et types de mouvement","ar":"المسار وأنواع الحركة","lead":"Assise dans le bus, Salma est immobile… pour son voisin. Pour un passant sur le trottoir, elle roule à 40 km/h. Tout mouvement dépend d'une référence."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  // chronophotographie : positions toutes les 0,1 s
  var TYPES = {
    'uniforme': function (k) { return 20 + k * 36; },
    'accéléré': function (k) { return 20 + k * k * 4; },
    'ralenti': function (k) { return 20 + 288 - (8 - k) * (8 - k) * 4.5; }
  };
  var TRAJ = {
    'rectiligne': function (k, x) { return [x, 100]; },
    'circulaire': function (k, x) { var a = (x - 20) / 288 * Math.PI * 1.6 - Math.PI / 2; return [180 + 70 * Math.cos(a), 105 + 70 * Math.sin(a)]; },
    'curviligne': function (k, x) { return [x, 140 - 60 * Math.sin((x - 20) / 288 * Math.PI)]; }
  };

  function chrono(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (type, traj) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var pts = [];
      for (var k = 0; k <= 8; k++) pts.push(TRAJ[traj](k, TYPES[type](k)));
      S('path', { d: 'M' + pts.map(function (p) { return p.join(' '); }).join(' L'), fill: 'none', stroke: 'rgba(255,255,255,.2)', 'stroke-width': 2 }, dyn);
      pts.forEach(function (p, k) { S('circle', { cx: p[0], cy: p[1], r: 6, fill: 'var(--acc)', opacity: 0.35 + k * 0.08 }, dyn); T(dyn, p[0], p[1] + 20, k, 'tag'); });
      T(dyn, 350, 207, 'une position toutes les 0,1 s', 'tag', 'end');
    };
    return g;
  }

  MV.lesson({
    id: '3ac-mouvement',
    objectif: {
      fr: 'Savoir que le mouvement dépend du référentiel, décrire une trajectoire (rectiligne, circulaire, curviligne) et reconnaître un mouvement uniforme, accéléré ou ralenti.',
      ar: 'معرفة أن الحركة تتعلق بالجسم المرجعي، ووصف المسار (مستقيمي، دائري، منحني)، والتعرف على الحركة المنتظمة والمتسارعة والمتباطئة.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Salma dans le bus',
      hud: [['v', 'pour son voisin'], ['p', 'pour un passant'], ['q', 'qui a raison ?']],
      draw: function (svg) { var e = {}; e.c = chrono(svg); return e; },
      steps: [
        { cap: 'Salma est assise dans le **bus**. Pour son voisin, elle ne bouge pas.', hud: { v: ['immobile'], p: '–', q: '–' }, run: function (e) { e.c.set('uniforme', 'rectiligne'); } },
        { cap: 'Pour un **passant** sur le trottoir, elle avance à 40 km/h.', hud: { v: 'immobile', p: ['en mouvement'], q: '–' }, run: function (e) { e.c.set('uniforme', 'rectiligne'); } },
        { cap: 'Qui a raison ? On le saura à la fin.', hud: { v: 'immobile', p: 'en mouvement', q: ['?'] }, run: function (e) { e.c.set('uniforme', 'rectiligne'); } }
      ]
    },

    predire: {
      q: "Salma est assise dans un bus. Pour son voisin elle ne bouge pas, pour un passant elle avance à 40 km/h. Qui a raison ?",
      ar: "سلمى جالسة في حافلة. بالنسبة لجارها هي ساكنة، وبالنسبة لمارّ على الرصيف تتحرك بـ [[40 km/h]]. من على صواب؟",
      o: ["Le voisin : elle ne bouge pas", "Le passant : elle avance à 40 km/h", "Les deux, selon le référentiel choisi"],
      a: 2,
      e: "Le mouvement et le repos sont relatifs : on les décrit par rapport à un référentiel. Par rapport au bus, Salma est au repos ; par rapport au trottoir, elle avance à 40 km/h.",
      ear: "الحركة والسكون نسبيان: يُوصفان بالنسبة إلى مرجع. بالنسبة للحافلة هي ساكنة وبالنسبة للرصيف هي متحركة."
    },

    prepare: [
      ['Un objet peut être en mouvement pour un observateur et immobile pour un autre.', true, 'Tout dépend de la référence choisie.'],
      ['Si un objet parcourt des distances égales en des durées égales, sa vitesse change.', false, 'Sa vitesse est constante : le mouvement est uniforme.'],
      ['La trajectoire d\'une roue de vélo vue de côté est circulaire pour le cycliste.', true, 'Par rapport au vélo, un point de la roue tourne en rond.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Trajectoires et vitesses',
      hud: [['n', 'notion'], ['o', 'observation'], ['c', 'conclusion']],
      draw: function (svg) { var e = {}; e.c = chrono(svg); return e; },
      steps: [
        { cap: 'Le **référentiel** est l\'objet par rapport auquel on étudie le mouvement : le bus, le trottoir…', ar: 'الجسم المرجعي هو الجسم الذي ندرس الحركة بالنسبة إليه.', hud: { n: ['référentiel'], o: 'bus ou trottoir', c: 'mouvement relatif' }, run: function (e) { e.c.set('uniforme', 'rectiligne'); } },
        { cap: 'La **trajectoire** est la ligne formée par les positions successives : **rectiligne**, **circulaire** ou **curviligne**.', ar: 'المسار هو الخط الذي تكونه المواضع المتتالية: مستقيمي أو دائري أو منحني.', hud: { n: ['trajectoire'], o: 'forme de la ligne', c: ['circulaire'] }, run: function (e) { e.c.set('uniforme', 'circulaire'); } },
        { cap: 'Points **également espacés** pendant des durées égales : mouvement **uniforme**, vitesse constante.', ar: 'نقط متساوية التباعد: حركة منتظمة.', hud: { n: 'vitesse', o: ['écarts égaux'], c: ['uniforme'] }, run: function (e) { e.c.set('uniforme', 'rectiligne'); } },
        { cap: 'Écarts de **plus en plus grands** : mouvement **accéléré**.', ar: 'تباعد يزداد: حركة متسارعة.', hud: { n: 'vitesse', o: ['écarts croissants'], c: ['accéléré'] }, run: function (e) { e.c.set('accéléré', 'rectiligne'); } },
        { cap: 'Écarts de **plus en plus petits** : mouvement **ralenti** (décéléré).', ar: 'تباعد يتناقص: حركة متباطئة.', hud: { n: 'vitesse', o: ['écarts décroissants'], c: ['ralenti'] }, run: function (e) { e.c.set('ralenti', 'rectiligne'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Combine une trajectoire et un type de vitesse. Trouve le mouvement circulaire uniforme.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Chronophotographie' }, st);
          var ch = chrono(svg), ty = 'accéléré', tr = 'rectiligne', set = MV.hud(c, [['t', 'trajectoire'], ['v', 'vitesse'], ['m', 'mouvement', 1]]);
          function upd() { ch.set(ty, tr); set('t', tr); set('v', ty); set('m', tr + ' ' + ty); if (ty === 'uniforme' && tr === 'circulaire') done(); }
          var r1 = MV.H('div', 'row', '', c); Object.keys(TRAJ).forEach(function (k) { var b = MV.H('button', 'btn', 'Trajectoire ' + k, r1); b.onclick = function () { tr = k; upd(); }; });
          var r2 = MV.H('div', 'row', '', c); Object.keys(TYPES).forEach(function (k) { var b = MV.H('button', 'btn', 'Vitesse : ' + k, r2); b.onclick = function () { ty = k; upd(); }; });
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'Une voiture freine en ligne droite devant un feu rouge.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Sa trajectoire est :', o: ['rectiligne', 'circulaire'], a: 0 },
            { type: 'opt', q: 'Étape 2. Son mouvement est :', o: ['ralenti', 'accéléré', 'uniforme'], a: 0 },
            { type: 'opt', q: 'Étape 3. Pour le conducteur, son volant est :', o: ['immobile', 'en mouvement rectiligne'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'La trajectoire d\'une pierre lâchée verticalement est :', o: ['rectiligne', 'circulaire'], a: 0 },
      { lvl: 'Niveau 2', q: 'Un point du bout d\'une aiguille de montre a une trajectoire :', o: ['circulaire', 'rectiligne'], a: 0 },
      { lvl: 'Niveau 3', q: 'Écarts : 2 cm, 2 cm, 2 cm, 2 cm. Le mouvement est :', o: ['uniforme', 'accéléré', 'ralenti'], a: 0 },
      { lvl: 'Niveau 4', q: 'Écarts égaux de 3 cm toutes les 0,1 s. Vitesse en cm/s ?', a: 30 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Qui a raison ?',
      hud: [['v', 'référentiel bus'], ['p', 'référentiel trottoir'], ['r', 'réponse']],
      draw: function (svg) { var e = {}; e.c = chrono(svg); return e; },
      steps: [
        { cap: 'Par rapport au **bus**, Salma est **immobile**.', hud: { v: ['immobile'], p: '–', r: '–' }, run: function (e) { e.c.set('uniforme', 'rectiligne'); } },
        { cap: 'Par rapport au **trottoir**, elle est **en mouvement**. Les deux ont raison : il faut préciser le **référentiel**.', ar: 'كلاهما على حق: الحركة والسكون نسبيان ويتعلقان بالجسم المرجعي.', hud: { v: 'immobile', p: ['en mouvement'], r: ['tout dépend du référentiel'] }, run: function (e) { e.c.set('uniforme', 'rectiligne'); } }
      ]
    },

    retenir: [
      'Le mouvement et le repos sont <b>relatifs</b> : on les décrit par rapport à un <b>référentiel</b>. La <b>trajectoire</b> peut être rectiligne, circulaire ou curviligne.',
      'Sur une chronophotographie, des écarts égaux indiquent un mouvement <b>uniforme</b> ; des écarts croissants, un mouvement <b>accéléré</b> ; décroissants, <b>ralenti</b>.'
    ],
    retenirAr: 'الحركة والسكون نسبيان ويحددان بالنسبة لجسم مرجعي. المسار قد يكون مستقيميا أو دائريا أو منحنيا. تباعد متساو يدل على حركة منتظمة، ومتزايد على حركة متسارعة، ومتناقص على حركة متباطئة.',
    voc: [['le référentiel', 'الجسم المرجعي'], ['la trajectoire', 'المسار'], ['uniforme', 'منتظمة'], ['accéléré', 'متسارعة'], ['ralenti', 'متباطئة']]
  });
})();
