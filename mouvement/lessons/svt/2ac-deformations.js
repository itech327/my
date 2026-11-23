/* @meta {"id":"2ac-deformations","level":"2","order":5,"theme":"Géologie","title":"Les plis et les failles","ar":"الطيات والصدوع","lead":"Dans les gorges du Haut Atlas, les couches de roche dessinent des vagues ou sont coupées net. Quelles forces les ont déformées ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  var COLS = ['#d8bf7a', '#a8884b', '#c9a35a', '#8a6a3a'];

  /* bloc de couches. mode 'pli' (f de 0 à 1), 'normale' ou 'inverse' (f = rejet de 0 à 1) */
  function bloc(svg) {
    var e = {}, X0 = 30, X1 = 330, Y0 = 120, H = 30;
    S('rect', { x: 0, y: 0, width: 360, height: 300, fill: '#1b2430' }, svg);
    var couches = [];
    for (var k = 0; k < 4; k++) couches.push([S('path', { fill: COLS[k], stroke: '#141517', 'stroke-width': .6 }, svg), S('path', { fill: COLS[k], stroke: '#141517', 'stroke-width': .6 }, svg)]);
    e.trait = S('path', { stroke: '#ff5c5c', 'stroke-width': 3, fill: 'none' }, svg);
    e.fl = S('g', {}, svg);
    e.fg = S('path', { stroke: 'var(--acc)', 'stroke-width': 3, fill: 'none' }, e.fl);
    e.fd = S('path', { stroke: 'var(--acc)', 'stroke-width': 3, fill: 'none' }, e.fl);
    e.lab = T(svg, 180, 290, '', 'lbl acc');
    e.ant = T(svg, 180, 40, 'anticlinal', 'tag'); e.syn1 = T(svg, 75, 40, 'synclinal', 'tag'); e.syn2 = T(svg, 285, 40, 'synclinal', 'tag');
    function fx(y) { return 160 + (y - Y0 + 40) * 0.5; }
    function fleches(sens) {   // +1 compression, -1 distension
      var a = sens > 0 ? 'M8 230 h34 l-8 -6 m8 6 l-8 6' : 'M42 230 h-34 l8 -6 m-8 6 l8 6';
      var b = sens > 0 ? 'M352 230 h-34 l8 -6 m-8 6 l8 6' : 'M318 230 h34 l-8 -6 m8 6 l-8 6';
      e.fg.setAttribute('d', a); e.fd.setAttribute('d', b);
    }
    e.set = function (mode, f) {
      var showFold = mode === 'pli';
      [e.ant, e.syn1, e.syn2].forEach(function (t) { t.style.opacity = showFold && f > 0.5 ? 1 : 0; });
      for (var k = 0; k < 4; k++) {
        var top = Y0 + k * H, bot = top + H;
        if (showFold) {
          var up = [], dn = [];
          for (var x = X0; x <= X1; x += 6) {
            var w = f * 55 * Math.cos((x - 180) / 300 * 2 * Math.PI);
            up.push([x, top - w]); dn.push([x, bot - w]);
          }
          var d = 'M' + up.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L') + ' L' + dn.reverse().map(function (p) { return p[0] + ' ' + p[1]; }).join(' L') + ' Z';
          couches[k][0].setAttribute('d', d); couches[k][1].setAttribute('d', '');
        } else {
          // faille inclinée : x = 160 + (y - Y0) * 0.5 ; le bloc de droite (au-dessus du plan) bouge
          var r = f * 45 * (mode === 'normale' ? 1 : -1);
          couches[k][0].setAttribute('d', 'M' + X0 + ' ' + top + ' L' + fx(top) + ' ' + top + ' L' + fx(bot) + ' ' + bot + ' L' + X0 + ' ' + bot + ' Z');
          var t2 = top + r, b2 = bot + r;
          couches[k][1].setAttribute('d', 'M' + (fx(top) + r * 0.5) + ' ' + t2 + ' L' + X1 + ' ' + t2 + ' L' + X1 + ' ' + b2 + ' L' + (fx(bot) + r * 0.5) + ' ' + b2 + ' Z');
        }
      }
      e.trait.setAttribute('d', showFold ? '' : 'M' + (160 - 0) + ' ' + (Y0 - 40) + ' L' + (160 + 0.5 * 200) + ' ' + (Y0 + 160));
      if (mode === 'pli') fleches(f > 0 ? 1 : 0); else fleches(mode === 'normale' ? -1 : 1);
      e.fl.style.opacity = f > 0 ? 1 : 0;
      e.lab.textContent = mode === 'pli' ? (f > 0 ? 'compression : pli' : 'couches horizontales') : mode === 'normale' ? 'distension : faille normale' : 'compression : faille inverse';
    };
    e.set('pli', 0);
    return e;
  }

  MV.lesson({
    id: '2ac-deformations',
    objectif: {
      fr: 'Reconnaître les plis et les failles, et les relier aux forces de compression ou de distension dues au mouvement des plaques.',
      ar: 'التعرف على الطيات والصدوع، وربطها بقوى الانضغاط أو التمدد الناتجة عن حركة الصفائح.'
    },

    prerequis: {
      fr: 'Les couches sédimentaires se déposent à l\'horizontale ; les plaques bougent.',
      ar: 'تترسب الطبقات الرسوبية أفقيا، والصفائح تتحرك.'
    },

    ouverture: {
      vb: '0 0 360 300', label: 'Des couches déformées',
      hud: [['d', 'dépôt'], ['a', 'aujourd\'hui'], ['f', 'force']],
      draw: function (svg) {
        var e = {};
        e.horiz = S('g', {}, svg);
        for (var k = 0; k < 4; k++) S('rect', { x: 20, y: 60 + k * 18, width: 140, height: 18, fill: COLS[k] }, e.horiz);
        e.horiz.appendChild(T(svg, 90, 150, 'au dépôt', 'tag'));
        e.ondu = S('g', {}, svg);
        for (var j = 0; j < 4; j++) S('path', { d: 'M200 ' + (100 + j * 18) + ' Q240 ' + (40 + j * 18) + ' 270 ' + (100 + j * 18) + ' T340 ' + (100 + j * 18) + ' v18 Q310 ' + (178 + j * 18) + ' 270 ' + (118 + j * 18) + ' Q240 ' + (58 + j * 18) + ' 200 ' + (118 + j * 18) + ' Z', fill: COLS[j] }, e.ondu);
        e.ondu.appendChild(T(svg, 270, 200, 'dans la montagne', 'tag'));
        e.q = T(svg, 180, 260, 'qui les a pliées ?', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'Les sédiments se déposent au fond de l\'eau en **couches horizontales**.', on: ['horiz'], hud: { d: ['à plat'], a: '–', f: '–' } },
        { cap: 'Dans les gorges du **Haut Atlas**, on voit pourtant des couches **en vagues**.', on: ['horiz', 'ondu'], hud: { d: 'à plat', a: ['ondulées'], f: '–' } },
        { cap: 'Ailleurs, des couches sont **coupées net** et décalées.', on: ['horiz', 'ondu'], hud: { d: 'à plat', a: ['décalées'], f: '–' } },
        { cap: 'Quelles **forces** peuvent plier ou casser des roches si dures ?', on: ['horiz', 'ondu', 'q'], hud: { d: 'à plat', a: 'déformées', f: ['?'] } }
      ]
    },

    predire: {
      q: 'On pousse lentement les deux bords d\'une pile de couches l\'un vers l\'autre. Que deviennent les couches ?',
      ar: 'ندفع ببطء طرفي مجموعة من الطبقات الواحد نحو الآخر. ماذا يحدث للطبقات؟',
      o: ['Elles restent planes', 'Elles se plissent, et peuvent casser si la force est trop grande', 'Elles s\'écartent et laissent un trou'],
      a: 1,
      e: 'La compression raccourcit les couches : elles forment des plis. Si les roches sont trop rigides, elles cassent : c\'est une faille.',
      ear: 'الانضغاط يقلص الطبقات فتتكون طيات، وإذا كانت الصخور صلبة جدا تنكسر فيتكون صدع.'
    },

    prepare: [
      ['Les couches sédimentaires se déposent à l\'horizontale.', true, 'C\'est le principe d\'horizontalité.'],
      ['Une roche dure ne peut jamais se plier.', false, 'Poussée lentement pendant très longtemps, en profondeur, elle peut se plier.'],
      ['Les plaques exercent des forces sur les roches.', true, 'Elles se rapprochent ou s\'écartent.']
    ],

    regarde: {
      vb: '0 0 360 300', label: 'Plis et failles',
      hud: [['f', 'force'], ['r', 'réaction'], ['n', 'nom']],
      draw: function (svg) { var e = bloc(svg); return { ctl: e }; },
      steps: [
        { cap: 'Au départ, les couches sont **horizontales**.', ar: 'في البداية تكون الطبقات أفقية.', hud: { f: '–', r: '–', n: '–' }, run: function (e) { e.ctl.set('pli', 0); } },
        { cap: 'Les plaques se rapprochent : c\'est une **compression**. Les couches se raccourcissent.', ar: 'تتقارب الصفائح فيحدث انضغاط وتتقلص الطبقات.', hud: { f: ['compression'], r: 'souple', n: '–' }, run: function (e) { e.ctl.set('pli', 0.4); } },
        { cap: 'Elles forment un **pli**. La partie bombée vers le haut est un **anticlinal**, la partie en creux un **synclinal**.', ar: 'تتكون طية: الجزء المحدب نحو الأعلى طية محدبة، والجزء المقعر طية مقعرة.', hud: { f: 'compression', r: 'souple', n: ['pli'] }, run: function (e) { e.ctl.set('pli', 1); } },
        { cap: 'Si les roches sont **rigides**, elles cassent : c\'est une **faille**. Les deux blocs glissent l\'un par rapport à l\'autre.', ar: 'إذا كانت الصخور صلبة تنكسر فيتكون صدع وينزلق الجزءان أحدهما بالنسبة للآخر.', hud: { f: 'compression', r: ['cassant'], n: ['faille'] }, run: function (e) { e.ctl.set('inverse', 0.4); } },
        { cap: 'Sous **compression**, le bloc du dessus **monte** le long de la faille : **faille inverse**.', ar: 'تحت الانضغاط يصعد الجزء العلوي على طول الصدع: صدع معكوس.', hud: { f: 'compression', r: 'cassant', n: ['faille inverse'] }, run: function (e) { e.ctl.set('inverse', 1); } },
        { cap: 'Quand les plaques **s\'écartent** (distension), le bloc du dessus **descend** : **faille normale**.', ar: 'عندما تتباعد الصفائح يحدث تمدد وينزل الجزء العلوي: صدع عادي.', hud: { f: ['distension'], r: 'cassant', n: ['faille normale'] }, run: function (e) { e.ctl.set('normale', 1); } },
        { cap: 'Le **décalage** d\'une couche de part et d\'autre de la faille s\'appelle le **rejet**.', ar: 'الإزاحة بين جزأي الطبقة على جانبي الصدع تسمى الرمية.', hud: { f: 'distension', r: 'cassant', n: ['rejet'] }, run: function (e) { e.ctl.set('normale', 1); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Applique une force et observe les couches.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 300', role: 'img', 'aria-label': 'Couches soumises à une compression ou à une distension' }, st);
          var e = bloc(svg), vu = {};
          var set = MV.hud(c, [['f', 'force'], ['r', 'roches', 1], ['d', 'déformation', 1]]), row = MV.H('div', 'row', '', c);
          [['Comprimer des roches souples', 'pli', 'compression', 'souples', 'pli'], ['Comprimer des roches rigides', 'inverse', 'compression', 'rigides', 'faille inverse'], ['Étirer des roches rigides', 'normale', 'distension', 'rigides', 'faille normale']].forEach(function (x) {
            var b = MV.H('button', 'btn', x[0], row);
            b.onclick = function () {
              var k = 0; e.set(x[1], 0);
              var id = setInterval(function () { k += 0.1; e.set(x[1], Math.min(1, k)); if (k >= 1) clearInterval(id); }, 60);
              set('f', x[2]); set('r', x[3]); set('d', x[4]); vu[x[1]] = 1;
              if (vu.pli && vu.inverse && vu.normale) done();
            };
          });
          MV.H('p', 'small', 'Essaie les trois. Dans la nature, cela prend des millions d\'années.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Mesurons une faille et nommons les déformations.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Une couche est décalée de 3 m de part et d\'autre d\'une faille. Combien de centimètres de rejet ?', a: 300, unit: 'cm', hint: '1 m = 100 cm.' },
            { type: 'opt', q: 'Étape 2. Le bloc du dessus est descendu le long de la faille. C\'est :', o: ['une faille normale, due à une distension', 'une faille inverse, due à une compression'], a: 0, e: 'L\'étirement fait descendre le bloc du dessus.' },
            { type: 'opt', q: 'Étape 3. Un pli bombé vers le haut s\'appelle :', o: ['un synclinal', 'un anticlinal'], a: 1, e: 'Le synclinal est en creux.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Une cassure des roches avec déplacement des deux blocs s\'appelle :', o: ['une faille', 'un pli', 'un fossile'], a: 0, e: 'Le pli est une déformation souple, sans cassure.' },
      { lvl: 'Niveau 2', q: 'Un pli en creux s\'appelle :', o: ['un synclinal', 'un anticlinal'], a: 0, e: 'L\'anticlinal est bombé vers le haut.' },
      { lvl: 'Niveau 3', q: 'Une faille a un rejet total de 2 m, produit par 4 séismes de même taille. Quel déplacement par séisme, en centimètres ?', a: 50, unit: 'cm', hint: '200 cm ÷ 4.' },
      { lvl: 'Niveau 4', q: 'Une région montre des plis et des failles inverses. Les roches ont subi :', o: ['une compression', 'une distension'], a: 0, e: 'Les plaques se sont rapprochées.' }
    ],

    bilan: {
      vb: '0 0 360 300', label: 'Deux façons de se déformer',
      hud: [['f', 'force'], ['d', 'déformation']],
      draw: function (svg) { var e = bloc(svg); return { ctl: e }; },
      steps: [
        { cap: '**Compression** sur des roches souples : des **plis**, anticlinaux et synclinaux.', hud: { f: ['compression'], d: ['plis'] }, run: function (e) { e.ctl.set('pli', 1); } },
        { cap: '**Compression** sur des roches rigides : une **faille inverse**.', hud: { f: 'compression', d: ['faille inverse'] }, run: function (e) { e.ctl.set('inverse', 1); } },
        { cap: '**Distension** : une **faille normale**. Ces déformations sont dues au mouvement des plaques.', ar: 'الانضغاط يعطي طيات وصدوعا معكوسة، والتمدد يعطي صدوعا عادية، وكلها ناتجة عن حركة الصفائح.', hud: { f: ['distension'], d: ['faille normale'] }, run: function (e) { e.ctl.set('normale', 1); } }
      ]
    },

    retenir: [
      'Les <b>forces de compression</b>, quand les plaques se rapprochent, plissent les couches : elles forment des <b>plis</b>, bombés (<b>anticlinal</b>) ou en creux (<b>synclinal</b>).',
      'Une <b>faille</b> est une cassure avec déplacement des blocs ; le décalage est le <b>rejet</b>. Compression : <b>faille inverse</b>, le bloc du dessus monte. Distension : <b>faille normale</b>, il descend.'
    ],
    retenirAr: 'قوى الانضغاط الناتجة عن تقارب الصفائح تطوي الطبقات فتتكون طيات محدبة ومقعرة. الصدع انكسار مع انزلاق الجزأين، والإزاحة تسمى الرمية. الانضغاط يعطي صدعا معكوسا، والتمدد يعطي صدعا عاديا.',
    voc: [['un pli', 'طية'], ['un anticlinal', 'طية محدبة'], ['un synclinal', 'طية مقعرة'], ['une faille', 'صدع'], ['une faille normale', 'صدع عادي'], ['une faille inverse', 'صدع معكوس'], ['la compression', 'الانضغاط'], ['la distension', 'التمدد']]
  });
})();
