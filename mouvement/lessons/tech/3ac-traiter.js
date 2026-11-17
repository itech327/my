/* @meta {"id":"3ac-traiter","level":"3","order":3,"theme":"Chaîne d’information","title":"Traiter l’information","ar":"معالجة المعلومة","lead":"La barrière ne doit s’ouvrir que si une voiture est là et que le ticket est valide. Qui prend cette décision, et comment ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var GATES = { ET: function (a, b) { return a & b; }, OU: function (a, b) { return a | b; }, NON: function (a) { return 1 - a; } };
  var ALGO = ['Début', 'Si voiture ET ticket valide', '   ouvrir la barrière', '   attendre 10 s', '   fermer la barrière', 'Fin'];

  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function wire(d, on) { S('path', { d: d, stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 3, fill: 'none' }, dyn); }
    function entree(y, v, nom) {
      S('circle', { cx: 40, cy: y, r: 13, fill: v ? 'var(--acc)' : '#26292d', stroke: v ? 'var(--acc)' : '#9aa0a8', 'stroke-width': 2 }, dyn);
      T(dyn, 40, y + 5, String(v), 'lbl');
      T(dyn, 40, y - 20, nom, 'tag');
    }
    g.set = function (o) { // o.gate, o.a, o.b, o.algo (ligne surlignée)
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.algo != null) {
        S('rect', { x: 40, y: 14, width: 280, height: 182, rx: 10, fill: '#17181a', stroke: '#2c2f34' }, dyn);
        ALGO.forEach(function (l, i) {
          var on = i === o.algo;
          if (on) S('rect', { x: 50, y: 26 + i * 28, width: 260, height: 24, rx: 5, fill: 'var(--acc-bg)', stroke: 'var(--acc)' }, dyn);
          T(dyn, l.charAt(0) === ' ' ? 90 : 62, 43 + i * 28, l.trim(), 'lbl', 'start');
        });
        return;
      }
      var one = o.gate === 'NON', s = one ? GATES.NON(o.a) : GATES[o.gate](o.a, o.b);
      entree(one ? 95 : 60, o.a, 'A : voiture');
      if (!one) entree(140, o.b, 'B : ticket');
      wire(one ? 'M53 95H130' : 'M53 60H95V80H130', o.a);
      if (!one) wire('M53 140H95V110H130', o.b);
      S('rect', { x: 130, y: 65, width: 60, height: 60, rx: 6, fill: '#1d1f22', stroke: '#e9e9ea', 'stroke-width': 2.5 }, dyn);
      T(dyn, 160, 102, one ? '1' : o.gate === 'ET' ? '&' : '≥1', 'lbl big');
      T(dyn, 160, 146, 'porte ' + o.gate, 'tag');
      if (one) S('circle', { cx: 195, cy: 95, r: 5, fill: '#141517', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
      wire('M' + (one ? 200 : 190) + ' 95H262', s);
      T(dyn, 232, 86, 'S = ' + s, 'lbl');
      // barrière : bras qui se lève quand S = 1
      S('rect', { x: 262, y: 88, width: 16, height: 74, rx: 3, fill: '#26292d', stroke: '#9aa0a8', 'stroke-width': 2 }, dyn);
      var arm = S('g', { transform: 'rotate(' + (s ? -70 : 0) + ' 270 96)' }, dyn);
      S('rect', { x: 270, y: 92, width: 84, height: 8, rx: 3, fill: s ? '#56d07f' : '#e5484d' }, arm);
      T(dyn, 300, 182, s ? 'barrière ouverte' : 'barrière fermée', 'tag');
    };
    return g;
  }

  MV.lesson({
    id: '3ac-traiter',
    objectif: {
      fr: 'Savoir que la fonction traiter prend une décision à partir des informations, utiliser les portes logiques ET, OU, NON et lire un algorithme simple.',
      ar: 'معرفة أن وظيفة المعالجة تتخذ قرارا انطلاقا من المعلومات، واستعمال البوابات المنطقية و، أو، لا، وقراءة خوارزمية بسيطة.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'La barrière décide',
      hud: [['a', 'voiture'], ['b', 'ticket'], ['s', 'barrière']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Deux informations arrivent : une **voiture** est là, le **ticket** est valide ou non.', hud: { a: ['1'], b: ['0'], s: '?' }, run: function (e) { e.s.set({ gate: 'ET', a: 1, b: 0 }); } },
        { cap: 'Voiture sans ticket valide : la barrière reste **fermée**.', hud: { a: '1', b: '0', s: ['fermée'] }, run: function (e) { e.s.set({ gate: 'ET', a: 1, b: 0 }); } },
        { cap: 'Voiture et ticket valide : elle **s’ouvre**. Qui a décidé ?', hud: { a: '1', b: ['1'], s: ['ouverte'] }, run: function (e) { e.s.set({ gate: 'ET', a: 1, b: 1 }); } }
      ]
    },

    prepare: [
      ['En logique, 1 veut dire « oui » et 0 veut dire « non ».', true, 'Présent : 1. Absent : 0.'],
      ['Une recette de cuisine est une suite d’étapes dans un ordre précis.', true, 'Comme un algorithme.'],
      ['L’ordre des instructions d’un programme n’a aucune importance.', false, 'Ouvrir puis attendre n’est pas la même chose qu’attendre puis ouvrir.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Portes logiques et algorithme',
      hud: [['p', 'porte'], ['r', 'règle'], ['s', 'sortie S']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Traiter**, c’est **décider** à partir des informations reçues.', ar: 'المعالجة هي اتخاذ القرار انطلاقا من المعلومات المستقبلة.', hud: { p: '–', r: 'décider', s: '–' }, run: function (e) { e.s.set({ gate: 'ET', a: 0, b: 0 }); } },
        { cap: 'Porte **ET** : S = 1 seulement si A **et** B valent 1.', ar: 'البوابة "و": المخرج 1 فقط إذا كان A و B يساويان 1.', hud: { p: ['ET'], r: 'A et B', s: ['1'] }, run: function (e) { e.s.set({ gate: 'ET', a: 1, b: 1 }); } },
        { cap: 'Porte **OU** : S = 1 si **au moins une** entrée vaut 1.', ar: 'البوابة "أو": المخرج 1 إذا كان أحد المدخلين على الأقل 1.', hud: { p: ['OU'], r: 'A ou B', s: ['1'] }, run: function (e) { e.s.set({ gate: 'OU', a: 0, b: 1 }); } },
        { cap: 'Porte **NON** : elle **inverse**. Entrée 1, sortie 0.', ar: 'البوابة "لا": تعكس الحالة، المدخل 1 يعطي 0.', hud: { p: ['NON'], r: 'inverse', s: ['0'] }, run: function (e) { e.s.set({ gate: 'NON', a: 1 }); } },
        { cap: 'Un **algorithme** est une suite **ordonnée** d’instructions. La carte de commande l’exécute ligne par ligne.', ar: 'الخوارزمية متتالية مرتبة من التعليمات، تنفذها بطاقة التحكم سطرا بسطر.', hud: { p: 'algorithme', r: ['ligne 2'], s: '–' }, run: function (e) { e.s.set({ algo: 1 }); } },
        { cap: 'La condition est vraie : on **ouvre**, on **attend**, puis on **ferme**, dans cet ordre.', ar: 'الشرط صحيح: نفتح ثم ننتظر ثم نغلق، بهذا الترتيب.', hud: { p: 'algorithme', r: ['ligne 4'], s: '–' }, run: function (e) { e.s.set({ algo: 3 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change les entrées A et B de la porte ET. Ouvre la barrière.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Porte ET et barrière' }, st);
          var s = scene(svg), set = MV.hud(c, [['a', 'A'], ['b', 'B'], ['s', 'S = A ET B', 1]]), v = { a: 0, b: 0 };
          var row = MV.H('div', 'row', '', c);
          function paint() { var r = v.a & v.b; s.set({ gate: 'ET', a: v.a, b: v.b }); set('a', v.a); set('b', v.b); set('s', r); if (r) done(); }
          MV.H('button', 'btn', 'Basculer A', row).onclick = function () { v.a = 1 - v.a; paint(); };
          MV.H('button', 'btn', 'Basculer B', row).onclick = function () { v.b = 1 - v.b; paint(); };
          paint();
        } },
      { title: 'Résolvons ensemble', intro: 'Une lampe d’escalier s’allume depuis le bouton du bas ou celui du haut.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Quelle porte faut-il ?', o: ['la porte OU', 'la porte ET', 'la porte NON'], a: 0, e: 'Un seul bouton suffit.' },
            { q: 'Étape 2. Porte OU, A = 0 et B = 1. Valeur de S ?', a: 1 },
            { q: 'Étape 3. On ajoute une porte NON après. Nouvelle valeur de S ?', a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Porte ET, A = 1 et B = 0. Valeur de S ?', a: 0 },
      { lvl: 'Niveau 2', q: 'Un algorithme est :', o: ['une suite ordonnée d’instructions', 'un capteur de position', 'un moteur programmable'], a: 0 },
      { lvl: 'Niveau 3', q: 'A passe par une porte NON, puis entre dans une porte ET avec B = 1. Si A = 0, S = ?', a: 1, hint: 'NON(0) = 1, puis 1 ET 1.' },
      { lvl: 'Niveau 4', q: 'Combien de combinaisons d’entrées différentes pour une porte à 3 entrées ?', a: 8, hint: '2 × 2 × 2' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Qui décide',
      hud: [['a', 'voiture'], ['b', 'ticket'], ['s', 'barrière']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'C’est une **porte ET** qui décide : voiture **et** ticket valide.', hud: { a: '1', b: '1', s: ['ouverte'] }, run: function (e) { e.s.set({ gate: 'ET', a: 1, b: 1 }); } },
        { cap: 'Dans la vraie barrière, une **carte programmée** suit l’algorithme : décider, ouvrir, attendre, fermer.', ar: 'في الحاجز الحقيقي تتبع بطاقة مبرمجة الخوارزمية: تقرر، تفتح، تنتظر، تغلق.', hud: { a: '1', b: '1', s: ['algorithme'] }, run: function (e) { e.s.set({ algo: 2 }); } }
      ]
    },

    retenir: [
      '<b>Traiter</b> = décider à partir des informations. Porte <b>ET</b> : S = 1 si A et B valent 1. Porte <b>OU</b> : S = 1 si au moins une entrée vaut 1. Porte <b>NON</b> : S est l’inverse de A.',
      'Un <b>algorithme</b> est une suite ordonnée d’instructions ; la carte de commande (par exemple Arduino) l’exécute dans l’ordre.'
    ],
    retenirAr: 'المعالجة هي اتخاذ القرار انطلاقا من المعلومات. البوابة "و" تعطي 1 إذا كان المدخلان 1، و"أو" تعطي 1 إذا كان أحدهما 1، و"لا" تعكس المدخل. الخوارزمية متتالية مرتبة من التعليمات.',
    voc: [['traiter', 'معالجة'], ['une porte logique', 'بوابة منطقية'], ['ET / OU / NON', 'و / أو / لا'], ['un algorithme', 'خوارزمية'], ['une instruction', 'تعليمة']]
  });
})();
