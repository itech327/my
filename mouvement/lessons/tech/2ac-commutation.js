/* @meta {"id":"2ac-commutation","level":"2","order":6,"theme":"Fonctions électroniques","title":"La fonction « Commutation »","ar":"وظيفة التبديل","lead":"Dans un couloir, on allume la lampe en bas de l’escalier et on l’éteint en haut. Un seul interrupteur n’y suffit pas. Quels composants ouvrent et ferment un circuit ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function lampe(x, y, on) {
      if (on) S('circle', { cx: x, cy: y, r: 22, fill: 'rgba(255,230,120,.35)' }, dyn);
      S('circle', { cx: x, cy: y, r: 12, fill: on ? '#fff3b0' : '#141517', stroke: '#e9e9ea', 'stroke-width': 2.5 }, dyn);
      S('path', { d: 'M' + (x - 8) + ' ' + (y - 8) + 'L' + (x + 8) + ' ' + (y + 8) + 'M' + (x + 8) + ' ' + (y - 8) + 'L' + (x - 8) + ' ' + (y + 8), stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
    }
    function vav(a, b) {
      // deux inverseurs reliés par deux fils (haut et bas)
      var on = a === b;
      S('path', { d: 'M90 70H270M90 130H270', stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, dyn);
      S('path', { d: 'M60 100H40V180H180M240 180H330V100H300', stroke: on ? '#f2c14e' : '#9aa0a8', 'stroke-width': 2, fill: 'none' }, dyn);
      [[60, a, 'inverseur en bas'], [300, b, 'inverseur en haut']].forEach(function (k, i) {
        var x = k[0], tx = i ? x - 30 : x + 30, ty = k[1] ? 70 : 130;
        S('circle', { cx: x, cy: 100, r: 4, fill: '#e9e9ea' }, dyn);
        S('line', { x1: x, y1: 100, x2: tx, y2: ty, stroke: 'var(--acc)', 'stroke-width': 3.5 }, dyn);
        S('path', { d: 'M' + (i ? x - 30 : x + 30) + ' 70H' + (i ? 270 : 90) + 'M' + (i ? x - 30 : x + 30) + ' 130H' + (i ? 270 : 90), stroke: '#9aa0a8', 'stroke-width': 2 }, dyn);
        T(dyn, x, 30, k[2], 'tag');
      });
      lampe(210, 180, on);
      S('rect', { x: 118, y: 172, width: 16, height: 16, fill: '#141517' }, dyn);
      S('path', { d: 'M120 172V188M132 176V184', stroke: '#f2c14e', 'stroke-width': 3 }, dyn);
      T(dyn, 135, 204, 'pile', 'tag');
      if (on) { var d = S('circle', { r: 3, fill: '#f2c14e' }, dyn); S('animateMotion', { dur: '2s', repeatCount: 'indefinite', path: 'M60 100L' + (a ? '90 70H270' : '90 130H270') + 'L300 100H330V180H40V100Z' }, d); }
    }
    function relais(on) {
      S('rect', { x: 20, y: 60, width: 80, height: 60, rx: 8, fill: '#1d1f22', stroke: '#56d07f', 'stroke-width': 2 }, dyn);
      T(dyn, 60, 86, 'petit', 'tag'); T(dyn, 60, 102, 'courant', 'tag');
      S('path', { d: 'M100 80H130M100 100H130', stroke: on ? '#56d07f' : '#5b6068', 'stroke-width': 2 }, dyn);
      S('rect', { x: 130, y: 70, width: 40, height: 40, rx: 4, fill: on ? '#15281c' : '#1d1f22', stroke: '#56d07f', 'stroke-width': 2 }, dyn);
      T(dyn, 150, 130, 'bobine', 'tag');
      S('path', { d: 'M196 40H340V170H196V120M196 80V40', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 3, fill: 'none' }, dyn);
      S('line', { x1: 196, y1: 120, x2: on ? 196 : 212, y2: 80, stroke: on ? 'var(--acc)' : '#e9e9ea', 'stroke-width': 3 }, dyn);
      T(dyn, 220, 104, 'contact', 'tag', 'start');
      S('circle', { cx: 340, cy: 105, r: 16, fill: 'var(--acc-bg)', stroke: 'var(--acc)', 'stroke-width': 2.5 }, dyn); T(dyn, 340, 111, 'M', 'lbl');
      T(dyn, 268, 30, 'gros courant', 'tag');
    }
    function transistor(on) {
      S('circle', { cx: 200, cy: 110, r: 26, fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
      S('path', { d: 'M190 94V126M150 110H190M190 102L212 86V50M190 118L212 134V170', stroke: '#e9e9ea', 'stroke-width': 2.5, fill: 'none' }, dyn);
      S('path', { d: 'M206 130L212 134L205 136', stroke: '#e9e9ea', 'stroke-width': 2, fill: 'none' }, dyn);
      T(dyn, 140, 104, 'base', 'tag', 'end'); T(dyn, 222, 60, 'collecteur', 'tag', 'start'); T(dyn, 222, 166, 'émetteur', 'tag', 'start');
      S('path', { d: 'M60 110H150', stroke: on ? '#56d07f' : '#5b6068', 'stroke-width': 2 }, dyn);
      S('rect', { x: 20, y: 96, width: 40, height: 28, rx: 6, fill: '#1d1f22', stroke: '#56d07f', 'stroke-width': 2 }, dyn);
      T(dyn, 40, 114, on ? '1' : '0', 'lbl');
      S('circle', { cx: 300, cy: 50, r: 16, fill: 'var(--acc-bg)', stroke: 'var(--acc)', 'stroke-width': 2.5 }, dyn); T(dyn, 300, 56, 'M', 'lbl');
      S('path', { d: 'M212 50H284M316 50H340V190H212V170', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 2.5, fill: 'none' }, dyn);
      if (on) { var h = S('path', { d: 'M300 36V42', stroke: '#fff', 'stroke-width': 3 }, dyn); S('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 300 50', to: '360 300 50', dur: '.6s', repeatCount: 'indefinite' }, h); }
      T(dyn, 290, 120, on ? 'moteur en marche' : 'moteur arrêté', 'tag');
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.rel != null) relais(o.rel); else if (o.tr != null) transistor(o.tr); else vav(o.a, o.b);
    };
    return g;
  }

  MV.lesson({
    id: '2ac-commutation',
    objectif: {
      fr: 'Savoir que commuter, c’est ouvrir ou fermer un circuit ; utiliser interrupteur, bouton poussoir, inverseurs en va-et-vient, relais et transistor.',
      ar: 'معرفة أن التبديل هو فتح الدارة أو غلقها، واستعمال قاطع التيار، والزر الضاغط، والمبدلين في تركيب ذهاب وإياب، والمرحل، والترانزستور.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Le couloir',
      hud: [['b', 'en bas'], ['h', 'en haut'], ['l', 'lampe']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'En bas de l’escalier, on **allume**.', hud: { b: ['basculé'], h: '–', l: ['allumée'] }, run: function (e) { e.s.set({ a: 1, b: 1 }); } },
        { cap: 'En haut, on veut **éteindre** avec un autre interrupteur.', hud: { b: 'basculé', h: ['basculé'], l: ['éteinte'] }, run: function (e) { e.s.set({ a: 1, b: 0 }); } },
        { cap: 'Comment deux interrupteurs commandent-ils la **même** lampe ?', hud: { b: '?', h: '?', l: '?' }, run: function (e) { e.s.set({ a: 0, b: 0 }); } }
      ]
    },

    prepare: [
      ['Un interrupteur ouvert coupe le courant.', true, 'Le circuit n’est plus fermé.'],
      ['Un bouton de sonnette reste enfoncé quand on le lâche.', false, 'C’est un bouton poussoir : il revient seul.'],
      ['Un même circuit peut avoir plusieurs interrupteurs.', true, 'Par exemple dans un couloir ou une voiture.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Commuter',
      hud: [['c', 'composant'], ['r', 'rôle']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Commuter**, c’est ouvrir ou fermer un circuit. Un **inverseur** envoie le courant vers l’un ou l’autre fil.', ar: 'التبديل هو فتح الدارة أو غلقها. المبدل يوجه التيار نحو أحد السلكين.', hud: { c: ['inverseur'], r: '2 positions' }, run: function (e) { e.s.set({ a: 0, b: 1 }); } },
        { cap: '**Va-et-vient** : les deux inverseurs du même côté, la lampe **s’allume**.', ar: 'ذهاب وإياب: المبدلان في نفس الجهة فيشتعل المصباح.', hud: { c: 'va-et-vient', r: ['allumée'] }, run: function (e) { e.s.set({ a: 1, b: 1 }); } },
        { cap: 'On bascule l’un des deux : la lampe **s’éteint**, quel que soit l’endroit.', ar: 'نقلب أحدهما فينطفئ المصباح من أي مكان.', hud: { c: 'va-et-vient', r: ['éteinte'] }, run: function (e) { e.s.set({ a: 0, b: 1 }); } },
        { cap: 'Le **relais** : un petit courant dans la **bobine** ferme un **contact** pour un gros courant.', ar: 'المرحل: تيار صغير في الوشيعة يغلق تماسا لتيار كبير.', hud: { c: ['relais'], r: 'commande à distance' }, run: function (e) { e.s.set({ rel: 1 }); } },
        { cap: 'Le **transistor** : un interrupteur **électronique**. Courant dans la **base** : le moteur tourne.', ar: 'الترانزستور: قاطع إلكتروني. تيار في القاعدة فيدور المحرك.', hud: { c: ['transistor'], r: ['interrupteur commandé'] }, run: function (e) { e.s.set({ tr: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Commande la lampe du couloir depuis chacun des deux inverseurs.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Montage va-et-vient' }, st);
          var s = scene(svg), set = MV.hud(c, [['l', 'lampe', 1], ['n', 'commandée depuis']]), v = { a: 0, b: 1 }, vu = {};
          var row = MV.H('div', 'row', '', c);
          function paint() { s.set(v); set('l', v.a === v.b ? 'allumée' : 'éteinte'); set('n', Object.keys(vu).length + ' / 2 endroits'); if (vu.a && vu.b) done(); }
          MV.H('button', 'btn', 'Basculer en bas', row).onclick = function () { v.a = 1 - v.a; vu.a = 1; paint(); };
          MV.H('button', 'btn', 'Basculer en haut', row).onclick = function () { v.b = 1 - v.b; vu.b = 1; paint(); };
          paint();
        } },
      { title: 'Résolvons ensemble', intro: 'Choisis le bon composant de commutation.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Un bouton poussoir reste fermé :', o: ['tant qu’on appuie', 'après qu’on a relâché'], a: 0 },
            { type: 'opt', q: 'Étape 2. Une carte électronique commande un moteur. Le transistor sert de :', o: ['interrupteur commandé', 'source d’énergie'], a: 0 },
            { type: 'opt', q: 'Étape 3. Le relais permet de commander :', o: ['un circuit puissant avec un petit courant', 'une pile avec un aimant'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un interrupteur fermé :', o: ['laisse passer le courant', 'bloque le courant'], a: 0 },
      { lvl: 'Niveau 2', q: 'Pour allumer un couloir depuis deux endroits, on utilise :', o: ['deux inverseurs en va-et-vient', 'un seul bouton poussoir'], a: 0 },
      { lvl: 'Niveau 3', q: 'Si la base du transistor ne reçoit pas de courant, le moteur :', o: ['est arrêté', 'tourne'], a: 0 },
      { lvl: 'Niveau 4', q: 'Va-et-vient : lampe allumée. On bascule les deux inverseurs. La lampe est allumée ? (1 = oui, 0 = non)', a: 1, hint: 'Ils restent du même côté.' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le couloir',
      hud: [['b', 'en bas'], ['h', 'en haut'], ['l', 'lampe']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Deux **inverseurs** reliés par deux fils : chacun peut allumer ou éteindre.', hud: { b: 'inverseur', h: 'inverseur', l: ['va-et-vient'] }, run: function (e) { e.s.set({ a: 1, b: 1 }); } },
        { cap: 'Pour un gros courant, on commute avec un **relais** ou un **transistor**.', ar: 'لتيار كبير نبدل بمرحل أو بترانزستور.', hud: { b: '–', h: '–', l: ['relais, transistor'] }, run: function (e) { e.s.set({ rel: 1 }); } }
      ]
    },

    retenir: [
      '<b>Commuter</b> = ouvrir ou fermer un circuit. Interrupteur (reste dans sa position), <b>bouton poussoir</b> (revient seul), <b>inverseur</b> (deux sorties) ; deux inverseurs font un <b>va-et-vient</b>.',
      '<b>Relais</b> : un petit courant dans la bobine ferme un contact. <b>Transistor</b> : interrupteur électronique commandé par sa base.'
    ],
    retenirAr: 'التبديل هو فتح الدارة أو غلقها: قاطع، زر ضاغط، مبدل، وتركيب ذهاب وإياب بمبدلين. المرحل يغلق تماسا بتيار صغير، والترانزستور قاطع إلكتروني تتحكم فيه القاعدة.',
    voc: [['commuter', 'التبديل'], ['un interrupteur', 'قاطع التيار'], ['un bouton poussoir', 'زر ضاغط'], ['un inverseur', 'مبدل'], ['un transistor', 'ترانزستور']]
  });
})();
