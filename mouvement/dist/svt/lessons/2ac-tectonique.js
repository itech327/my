/* @meta {"id":"2ac-tectonique","level":"2","order":1,"theme":"Géologie","title":"Les plaques bougent","ar":"الصفائح تتحرك","lead":"Des fossiles d'animaux marins en haut de l'Atlas : les plaques qui se rapprochent ont soulevé le fond de la mer."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* coupe : deux plaques, des couches de sédiments marins entre elles. f = 0 (calme) à 1 (plissement fort) */
  function coupe(svg) {
    var e = {}, Y = 200;
    S('rect', { x: 0, y: Y + 20, width: 360, height: 80, fill: '#5a2a1e' }, svg);                // manteau
    T(svg, 340, 290, 'manteau', 'tag', 'end');
    e.mer = S('rect', { x: 0, y: 70, width: 360, height: Y - 70, fill: '#1d3a52' }, svg); e.mer.style.transition = 'opacity .8s';
    var pg = S('rect', { x: 0, y: Y, width: 150, height: 20, fill: '#3a3d42' }, svg), pd = S('rect', { x: 210, y: Y, width: 150, height: 20, fill: '#3a3d42' }, svg);
    var lab1 = T(svg, 70, Y + 15, 'plaque A', 'tag'), lab2 = T(svg, 290, Y + 15, 'plaque B', 'tag');
    var couches = [], cols = ['#c9a35a', '#a8884b', '#d8bf7a'];
    for (var k = 0; k < 3; k++) couches.push(S('path', { fill: cols[k], stroke: '#141517', 'stroke-width': .5 }, svg));
    var amm = S('g', {}, svg);
    S('circle', { cx: 0, cy: 0, r: 6, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, amm); S('circle', { cx: 0, cy: 0, r: 2.5, fill: '#fff' }, amm);
    e.ammo = T(svg, 0, 0, 'ammonite', 'tag', 'start'); e.ammo.style.transition = 'all .8s';
    e.fl = S('g', {}, svg);
    S('path', { d: 'M40 240 h50 l-8 -6 m8 6 l-8 6', stroke: 'var(--acc)', 'stroke-width': 3, fill: 'none' }, e.fl);
    S('path', { d: 'M320 240 h-50 l8 -6 m-8 6 l8 6', stroke: 'var(--acc)', 'stroke-width': 3, fill: 'none' }, e.fl);
    e.seisme = S('g', {}, svg);
    [10, 18, 26].forEach(function (r) { S('circle', { cx: 180, cy: Y + 10, r: r, fill: 'none', stroke: '#ff5c5c', 'stroke-width': 2 }, e.seisme); });
    e.set = function (f) {
      var gap = 60 * (1 - f);
      // les plaques se rapprochent
      pg.setAttribute('width', 150 + (60 - gap) / 2);
      pd.setAttribute('x', 210 - (60 - gap) / 2); pd.setAttribute('width', 150 + (60 - gap) / 2);
      // couches : ondulation qui grandit avec f, soulevée au centre
      for (var k = 0; k < 3; k++) {
        var base = Y - k * 12, d = 'M0 ' + base, top = [];
        for (var x = 0; x <= 360; x += 10) {
          var dx = (x - 180) / 180, hump = f * 120 * Math.exp(-dx * dx * 6), wave = f * 14 * Math.sin(x / 18);
          top.push([x, base - 12 - hump - wave]);
        }
        d = 'M0 ' + base + ' ' + top.map(function (p) { return 'L' + p[0] + ' ' + p[1]; }).join(' ') + ' L360 ' + base + ' Z';
        couches[k].setAttribute('d', d);
      }
      var hy = Y - 30 - f * 120;
      amm.setAttribute('transform', 'translate(180,' + hy + ')');
      e.ammo.setAttribute('x', 196); e.ammo.setAttribute('y', hy + 4);
      e.mer.style.opacity = 1 - f * 0.85;
    };
    e.set(0);
    return e;
  }

  MV.lesson({
    id: '2ac-tectonique',
    objectif: {
      fr: 'Savoir que la surface de la Terre est formée de plaques qui bougent, et relier leurs mouvements aux montagnes et aux séismes.',
      ar: 'معرفة أن سطح الأرض مكون من صفائح تتحرك، وربط حركتها بتكون الجبال وحدوث الزلازل.'
    },

    ouverture: {
      vb: '0 0 360 300', label: 'Une ammonite dans l\'Atlas',
      hud: [['f', 'fossile'], ['v', 'il vivait'], ['t', 'trouvé']],
      draw: function (svg) {
        var e = {};
        e.mont = S('path', { d: 'M0 280 L90 160 L150 200 L220 60 L290 170 L360 120 V300 H0 Z', fill: '#3a3d42' }, svg);
        e.mont.setAttribute('data-keep', 1);
        T(svg, 220, 50, 'Haut Atlas', 'tag');
        e.amm = S('g', {}, svg);
        S('circle', { cx: 210, cy: 110, r: 16, fill: 'none', stroke: 'var(--acc)', 'stroke-width': 4 }, e.amm);
        S('path', { d: 'M210 110 m-9 0 a9 9 0 1 1 9 9 a5 5 0 1 1 -5 -5', fill: 'none', stroke: 'var(--acc)', 'stroke-width': 2 }, e.amm);
        e.q = T(svg, 100, 110, 'un animal marin ici ?', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'Dans le **Haut Atlas**, loin de la mer et très haut.', hud: { f: '–', v: '–', t: ['montagne'] } },
        { cap: 'On y trouve des **ammonites** fossiles.', on: ['amm'], hud: { f: ['ammonite'], v: '–', t: 'montagne' } },
        { cap: 'Or les ammonites vivaient dans **la mer**.', on: ['amm'], hud: { f: 'ammonite', v: ['mer'], t: 'montagne' } },
        { cap: 'Comment le fond de la mer est-il **monté** si haut ? On le saura à la fin.', on: ['amm', 'q'], hud: { f: 'ammonite', v: 'mer', t: ['?'] } }
      ]
    },

    predire: {
      q: "On trouve des fossiles marins (ammonites) très haut dans le Haut Atlas. Comment sont-ils arrivés là ?",
      ar: "نجد أحافير بحرية (أمونيت) في أعلى الأطلس الكبير. كيف وصلت إلى هناك؟",
      o: ["La mer s'est vidée d'un seul coup", "Les plaques ont bougé lentement et le fond de la mer a été soulevé", "Des animaux ont porté les fossiles en montagne"],
      a: 1,
      e: "Les plaques bougent de quelques millimètres à quelques centimètres par an. Quand deux plaques se rapprochent, les roches se plissent et se soulèvent : elles forment des montagnes, et des séismes se produisent.",
      ear: "الصفائح تتحرك ببطء، وعندما تقترب إحداهما من الأخرى تنطوي الصخور وترتفع فتتكوّن الجبال وتحدث الزلازل."
    },

    prepare: [
      ['Un fossile est un reste ou une trace d\'un être vivant ancien.', true, 'Conservé dans les roches.'],
      ['Le sol sous nos pieds ne bouge jamais.', false, 'Il bouge très lentement, de quelques millimètres à quelques centimètres par an.'],
      ['Les séismes sont des secousses du sol.', true, 'En arabe : الزلازل.']
    ],

    regarde: {
      vb: '0 0 360 300', label: 'Deux plaques qui se rapprochent',
      hud: [['m', 'mouvement'], ['c', 'conséquence'], ['v', 'vitesse']],
      draw: function (svg) { var e = coupe(svg); return { fl: e.fl, seisme: e.seisme, ammo: e.ammo, ctl: e }; },
      steps: [
        { cap: 'La surface de la Terre est découpée en **plaques**, comme les morceaux d\'une coquille.', ar: 'سطح الأرض مقسم إلى صفائح.', on: ['ammo'], hud: { m: '–', c: '–', v: '–' }, run: function (e) { e.ctl.set(0); } },
        { cap: 'Au fond de la mer, des **sédiments** se déposent en couches, avec des coquilles.', ar: 'في قاع البحر تترسب الرسوبيات على شكل طبقات مع بقايا الكائنات.', on: ['ammo'], hud: { m: '–', c: ['sédimentation'], v: '–' }, run: function (e) { e.ctl.set(0); } },
        { cap: 'Les plaques **bougent** très lentement : quelques centimètres par an.', ar: 'تتحرك الصفائح ببطء شديد: بضعة سنتيمترات في السنة.', on: ['ammo', 'fl'], hud: { m: ['convergence'], c: '–', v: ['cm/an'] }, run: function (e) { e.ctl.set(0.15); } },
        { cap: 'Quand deux plaques se **rapprochent**, les couches se plissent et se soulèvent.', ar: 'عندما تتقارب صفيحتان تنطوي الطبقات وترتفع.', on: ['ammo', 'fl'], hud: { m: 'convergence', c: ['plis'], v: 'cm/an' }, run: function (e) { e.ctl.set(0.55); } },
        { cap: 'En **millions d\'années**, elles forment des montagnes. Les fossiles montent avec elles.', ar: 'خلال ملايين السنين تتكون الجبال وترتفع معها المستحاثات.', on: ['ammo', 'fl'], hud: { m: 'convergence', c: ['montagne'], v: 'cm/an' }, run: function (e) { e.ctl.set(1); } },
        { cap: 'Les roches cassent brusquement : ce sont les **séismes**.', ar: 'تتكسر الصخور فجأة فتحدث الزلازل.', on: ['ammo', 'seisme'], hud: { m: 'convergence', c: ['séisme'], v: '–' }, run: function (e) { e.ctl.set(1); } },
        { cap: 'Ailleurs, les plaques s\'**écartent** : un océan s\'ouvre, comme l\'Atlantique.', ar: 'وفي أماكن أخرى تتباعد الصفائح فيتسع المحيط، مثل المحيط الأطلسي.', hud: { m: ['divergence'], c: 'océan', v: '≈ 2 cm/an' }, run: function (e) { e.ctl.set(0); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Fais passer le temps. Deux plaques se rapprochent de 1 cm par an.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 300', role: 'img', 'aria-label': 'Plissement des couches avec le temps' }, st);
          var e = coupe(svg); e.fl.style.opacity = 0.6; e.seisme.style.opacity = 0;
          var set = MV.hud(c, [['t', 'temps'], ['d', 'rapprochement', 1], ['h', 'relief', 1]]);
          MV.slider(c, { label: 'temps', min: 0, max: 20, value: 0, fmt: function (v) { return v + ' Ma'; } }, function (v) {
            e.set(v / 20); set('t', v + ' Ma'); set('d', (v * 10) + ' km'); set('h', v < 4 ? 'fond de mer' : v < 12 ? 'collines' : 'montagne');
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Ma = million d\'années. 1 cm par an pendant 1 million d\'années, cela fait 10 km. Relief simplifié.', c);
          done();
        } },
      { title: 'Résolvons ensemble', intro: 'Calculons le déplacement d\'une plaque, puis relions-le aux montagnes.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Une plaque avance de 2 cm par an. Combien de centimètres en 100 ans ?', a: 200, unit: 'cm', hint: '2 × 100.' },
            { q: 'Étape 2. Et en mètres ?', a: 2, unit: 'm', hint: '100 cm = 1 m.' },
            { type: 'opt', q: 'Étape 3. Les montagnes de l\'Atlas se sont formées surtout par :', o: ['l\'écartement de deux plaques', 'le rapprochement de deux plaques', 'l\'érosion par la pluie'], a: 1, e: 'Le rapprochement de l\'Afrique et de l\'Europe a plissé et soulevé les roches.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'La surface de la Terre est formée :', o: ['d\'un seul bloc immobile', 'de plaques qui bougent', 'de plaques qui bougent de plusieurs mètres par jour'], a: 1, e: 'Elles bougent de quelques centimètres par an.' },
      { lvl: 'Niveau 2', q: 'Deux plaques qui se rapprochent provoquent :', o: ['l\'ouverture d\'un océan', 'la formation de montagnes et des séismes', 'aucun effet'], a: 1, e: 'C\'est la convergence.' },
      { lvl: 'Niveau 3', q: 'L\'Atlantique s\'élargit d\'environ 2 cm par an. De combien de kilomètres en 1 million d\'années ?', a: 20, unit: 'km', hint: '2 cm × 1 000 000 = 2 000 000 cm = 20 km.' },
      { lvl: 'Niveau 4', q: 'Pourquoi trouve-t-on des fossiles marins dans l\'Atlas ?', o: ['La mer montait jusqu\'aux sommets.', 'Des roches formées au fond de la mer ont été plissées et soulevées.', 'Des oiseaux les ont transportés.'], a: 1, e: 'Les sédiments marins ont été soulevés par le rapprochement des plaques.' }
    ],

    bilan: {
      vb: '0 0 360 300', label: 'L\'ammonite monte',
      hud: [['e', 'étape'], ['a', 'ammonite'], ['d', 'durée']],
      draw: function (svg) { var e = coupe(svg); return { fl: e.fl, ammo: e.ammo, ctl: e }; },
      steps: [
        { cap: 'L\'ammonite meurt et se dépose au **fond de la mer**, dans les sédiments.', on: ['ammo'], hud: { e: ['sédimentation'], a: 'fond de mer', d: '–' }, run: function (e) { e.ctl.set(0); } },
        { cap: 'Les plaques se **rapprochent** : les couches se plissent.', on: ['ammo', 'fl'], hud: { e: ['convergence'], a: 'monte', d: 'millions d\'années' }, run: function (e) { e.ctl.set(0.5); } },
        { cap: 'Les couches forment une **montagne** : l\'ammonite est en haut de l\'Atlas.', ar: 'تكونت الجبال من رسوبيات بحرية مطوية ومرفوعة، فصارت المستحاثة في قمة الأطلس.', on: ['ammo', 'fl'], hud: { e: 'montagne', a: ['en altitude'], d: ['millions d\'années'] }, run: function (e) { e.ctl.set(1); } }
      ]
    },

    retenir: [
      'La surface de la Terre est formée de <b>plaques</b> qui bougent lentement, de quelques millimètres à quelques centimètres par an.',
      'Quand deux plaques se <b>rapprochent</b>, les roches se plissent et forment des <b>montagnes</b> ; des <b>séismes</b> se produisent. Quand elles s\'<b>écartent</b>, un océan s\'ouvre.'
    ],
    retenirAr: 'سطح الأرض مكون من صفائح تتحرك ببطء. عندما تتقارب صفيحتان تنطوي الصخور وتتكون الجبال وتحدث الزلازل، وعندما تتباعدان يتسع المحيط.',
    voc: [['une plaque', 'صفيحة'], ['un séisme', 'زلزال'], ['un fossile', 'مستحاثة'], ['un pli', 'طية'], ['les sédiments', 'الرسوبيات'], ['se rapprocher', 'تتقارب']]
  });
})();
