/* @meta {"id":"1ac-chaines-alimentaires","level":"1","order":4,"theme":"Écologie","title":"Chaînes et réseaux alimentaires","ar":"السلاسل والشبكات الغذائية","lead":"On capture presque tous les lézards d'une plaine : l'année suivante, les criquets ravagent les champs. Les êtres vivants sont liés par ce qu'ils mangent."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var N = { herbe: [50, 200, '#5fae5a'], criquet: [140, 150, '#c9b45a'], lezard: [230, 100, '#8fa36b'], faucon: [310, 45, '#9a7b5a'], souris: [140, 230, '#9aa0a8'], couleuvre: [240, 200, '#6b8f6b'] };
  var NOMS = { herbe: 'herbe', criquet: 'criquet', lezard: 'lézard', faucon: 'faucon', souris: 'souris', couleuvre: 'couleuvre' };

  function reseau(svg) {
    var e = { g: S('g', { 'data-keep': 1 }, svg), node: {}, arr: {} };
    function fl(a, b) {
      var A = N[a], B = N[b], dx = B[0] - A[0], dy = B[1] - A[1], L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
      var x1 = A[0] + ux * 24, y1 = A[1] + uy * 24, x2 = B[0] - ux * 26, y2 = B[1] - uy * 26;
      var g = S('g', {}, e.g); S('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: 'var(--acc)', 'stroke-width': 3 }, g);
      S('path', { d: 'M' + x2 + ' ' + y2 + ' l' + (-ux * 10 - uy * 6) + ' ' + (-uy * 10 + ux * 6) + ' l' + (uy * 12) + ' ' + (-ux * 12) + ' z', fill: 'var(--acc)' }, g);
      g.style.transition = 'opacity .6s'; e.arr[a + '-' + b] = g;
    }
    [['herbe', 'criquet'], ['criquet', 'lezard'], ['lezard', 'faucon'], ['herbe', 'souris'], ['souris', 'couleuvre'], ['couleuvre', 'faucon'], ['criquet', 'couleuvre']].forEach(function (p) { fl(p[0], p[1]); });
    Object.keys(N).forEach(function (k) {
      var g = S('g', {}, e.g); S('circle', { cx: N[k][0], cy: N[k][1], r: 22, fill: N[k][2], stroke: '#141517', 'stroke-width': 2 }, g);
      T(g, N[k][0], N[k][1] + 4, NOMS[k], 'tag').style.fill = '#141517'; g.style.transition = 'opacity .6s'; e.node[k] = g;
    });
    e.show = function (nodes, arrows) {
      Object.keys(e.node).forEach(function (k) { e.node[k].style.opacity = nodes.indexOf(k) >= 0 ? 1 : 0.08; });
      Object.keys(e.arr).forEach(function (k) { e.arr[k].style.opacity = arrows.indexOf(k) >= 0 ? 1 : 0; });
    };
    return e;
  }
  var CH = ['herbe', 'criquet', 'lezard', 'faucon'], CHA = ['herbe-criquet', 'criquet-lezard', 'lezard-faucon'];
  var ALL = Object.keys(N), ALLA = ['herbe-criquet', 'criquet-lezard', 'lezard-faucon', 'herbe-souris', 'souris-couleuvre', 'couleuvre-faucon', 'criquet-couleuvre'];

  MV.lesson({
    id: '1ac-chaines-alimentaires',
    objectif: {
      fr: 'Construire une chaîne et un réseau alimentaires, et comprendre l\'équilibre naturel entre les êtres vivants.',
      ar: 'إنشاء سلسلة وشبكة غذائيتين، وفهم التوازن الطبيعي بين الكائنات الحية.'
    },

    ouverture: {
      vb: '0 0 360 260', label: 'Lézards et criquets',
      hud: [['f', 'lézards'], ['c', 'criquets'], ['q', 'lien ?']],
      draw: function (svg) { var e = reseau(svg); return { ctl: e }; },
      steps: [
        { cap: 'Dans une plaine vivent des **lézards** et des criquets.', hud: { f: ['nombreux'], c: 'limités', q: '–' }, run: function (e) { e.ctl.show(['criquet', 'lezard'], []); } },
        { cap: 'On capture presque tous les lézards. L\'année suivante, les **criquets** envahissent les champs.', hud: { f: ['capturés'], c: ['très nombreux'], q: '–' }, run: function (e) { e.ctl.show(['criquet', 'herbe'], []); } },
        { cap: 'Quel **lien** entre les lézards et les criquets ? On le saura à la fin.', hud: { f: 'capturés', c: 'très nombreux', q: ['?'] }, run: function (e) { e.ctl.show(['criquet', 'herbe', 'lezard'], []); } }
      ]
    },

    prepare: [
      ['Les plantes vertes fabriquent leur propre matière.', true, 'Ce sont des producteurs.'],
      ['Le lézard mange de l\'herbe.', false, 'Le lézard est carnivore : il mange des insectes.'],
      ['Un animal peut être mangé par un autre animal.', true, 'C\'est une relation alimentaire.']
    ],

    regarde: {
      vb: '0 0 360 260', label: 'De la chaîne au réseau',
      hud: [['r', 'rôle'], ['f', 'flèche'], ['n', 'niveau']],
      draw: function (svg) { var e = reseau(svg); return { ctl: e }; },
      steps: [
        { cap: 'L\'**herbe** fabrique sa matière avec la lumière : c\'est un **producteur**.', ar: 'العشب ينتج مادته بالضوء: إنه منتج.', hud: { r: ['producteur'], f: '–', n: '1' }, run: function (e) { e.ctl.show(['herbe'], []); } },
        { cap: 'Le criquet mange l\'herbe. La flèche veut dire « **est mangé par** ».', ar: 'السهم يعني «يؤكل من طرف».', hud: { r: 'consommateur', f: ['est mangé par'], n: '2' }, run: function (e) { e.ctl.show(['herbe', 'criquet'], ['herbe-criquet']); } },
        { cap: 'Herbe → criquet → lézard → faucon : une **chaîne alimentaire**.', ar: 'عشب ← جراد ← سحلية ← صقر: سلسلة غذائية.', hud: { r: 'consommateurs', f: 'est mangé par', n: ['4 maillons'] }, run: function (e) { e.ctl.show(CH, CHA); } },
        { cap: 'Le criquet est un consommateur **primaire**, le lézard **secondaire**, le faucon **tertiaire**.', ar: 'الجراد مستهلك أول، والسحلية مستهلك ثان، والصقر مستهلك ثالث.', hud: { r: ['I, II, III'], f: '–', n: '2, 3, 4' }, run: function (e) { e.ctl.show(CH, CHA); } },
        { cap: 'Plusieurs chaînes reliées forment un **réseau alimentaire**.', ar: 'عدة سلاسل مترابطة تكون شبكة غذائية.', hud: { r: '–', f: '–', n: ['réseau'] }, run: function (e) { e.ctl.show(ALL, ALLA); } },
        { cap: 'Chaque être vivant limite le nombre d\'un autre : c\'est l\'**équilibre naturel**.', ar: 'كل كائن يحد من عدد كائن آخر: هذا هو التوازن الطبيعي.', hud: { r: '–', f: '–', n: ['équilibre'] }, run: function (e) { e.ctl.show(ALL, ALLA); } }
      ]
    },

    faisons: [
      { title: 'Construis la chaîne', intro: 'Touche les êtres vivants dans l\'ordre de la chaîne, en commençant par le producteur.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 260', role: 'img', 'aria-label': 'Êtres vivants à relier' }, st);
          var e = reseau(svg), k = 0, fb = MV.H('div', 'fb', '', c); e.show(CH, []);
          CH.forEach(function (n) {
            var g = e.node[n]; g.style.cursor = 'pointer'; g.setAttribute('role', 'button'); g.setAttribute('tabindex', 0); g.setAttribute('aria-label', NOMS[n]);
            function pick() {
              if (k >= CH.length) return;
              if (n === CH[k]) { k++; e.show(CH, CHA.slice(0, k - 1)); fb.className = 'fb ok'; fb.textContent = k === 1 ? 'Juste : on commence par le producteur.' : 'Juste.'; if (k === CH.length) { fb.textContent = 'Bravo : herbe → criquet → lézard → faucon.'; done(); } }
              else { fb.className = 'fb ko'; fb.textContent = k === 0 ? 'Commence par celui qui fabrique sa matière.' : 'Qui mange ' + NOMS[CH[k - 1]] + ' ?'; }
            }
            g.addEventListener('click', pick); g.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(); } });
          });
        } },
      { title: 'Résolvons ensemble', intro: 'Dans le réseau, la couleuvre disparaît à cause d\'une maladie.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. La couleuvre mange :', o: ['des souris et des criquets', 'de l\'herbe'], a: 0 },
            { type: 'opt', q: 'Étape 2. Sans couleuvre, le nombre de souris :', o: ['augmente', 'diminue'], a: 0 },
            { type: 'opt', q: 'Étape 3. Plus de souris, donc l\'herbe :', o: ['est plus consommée', 'pousse mieux'], a: 0, e: 'Une disparition dérègle tout le réseau.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Dans une chaîne alimentaire, le premier maillon est toujours :', o: ['un producteur (plante verte)', 'un carnivore'], a: 0 },
      { lvl: 'Niveau 2', q: 'La flèche « herbe → criquet » signifie :', o: ['l\'herbe mange le criquet', 'l\'herbe est mangée par le criquet'], a: 1 },
      { lvl: 'Niveau 3', q: 'Dans « herbe → criquet → lézard → faucon », combien de consommateurs ?', a: 3 },
      { lvl: 'Niveau 4', q: 'Si on utilise un insecticide qui tue les criquets, les lézards risquent de :', o: ['diminuer', 'augmenter'], a: 0 }
    ],

    bilan: {
      vb: '0 0 360 260', label: 'Le lien lézard et criquet',
      hud: [['l', 'lézards'], ['c', 'criquets'], ['h', 'herbe']],
      draw: function (svg) { var e = reseau(svg); return { ctl: e }; },
      steps: [
        { cap: 'Les **lézards** mangeaient beaucoup de criquets.', hud: { l: ['nombreux'], c: 'limités', h: 'intacte' }, run: function (e) { e.ctl.show(['herbe', 'criquet', 'lezard'], ['herbe-criquet', 'criquet-lezard']); } },
        { cap: 'Sans lézards, les criquets ne sont plus limités : ils **pullulent** et ravagent les champs. L\'équilibre est rompu.', ar: 'بدون سحالي تكاثر الجراد وأتلف الحقول: اختل التوازن الطبيعي.', hud: { l: ['presque 0'], c: ['pullulent'], h: ['ravagée'] }, run: function (e) { e.ctl.show(['herbe', 'criquet'], ['herbe-criquet']); } }
      ]
    },

    retenir: [
      'Une <b>chaîne alimentaire</b> commence par un <b>producteur</b> (plante verte), suivi de <b>consommateurs</b>. La flèche signifie « est mangé par ».',
      'Plusieurs chaînes reliées forment un <b>réseau alimentaire</b>. La disparition d\'un maillon perturbe l\'<b>équilibre naturel</b>.'
    ],
    retenirAr: 'تبدأ السلسلة الغذائية بمنتج ثم مستهلكين، والسهم يعني «يؤكل من طرف». عدة سلاسل مترابطة تكون شبكة غذائية، واختفاء حلقة يخل بالتوازن الطبيعي.',
    voc: [['une chaîne alimentaire', 'سلسلة غذائية'], ['un réseau alimentaire', 'شبكة غذائية'], ['un producteur', 'منتج'], ['un consommateur', 'مستهلك'], ['l\'équilibre naturel', 'التوازن الطبيعي']]
  });
})();
