/* @meta {"id":"2ac-pollution-air","level":"2","order":6,"theme":"Matière et environnement","title":"La pollution de l'air","ar":"تلوث الهواء","lead":"Un matin d'hiver, un voile gris couvre la ville. D'où vient-il, et que peut-on faire ? On suit les fumées des combustions."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* ville : voitures, usine, nuage de polluants */
  function ville(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), car = [], pol = S('g', {}, g);
    S('rect', { x: 0, y: 180, width: 360, height: 30, fill: '#2a2d33' }, g);
    [[20, 90, 40], [70, 60, 30], [250, 100, 36], [300, 70, 44]].forEach(function (b) { S('rect', { x: b[0], y: 180 - b[1], width: b[2], height: b[1], fill: '#3a3e46' }, g); });
    var us = S('g', {}, g); S('rect', { x: 150, y: 120, width: 70, height: 60, fill: '#4a4f58' }, us); S('rect', { x: 196, y: 80, width: 12, height: 40, fill: '#4a4f58' }, us);
    for (var i = 0; i < 6; i++) { var c = S('rect', { x: 20 + i * 55, y: 186, width: 34, height: 14, rx: 4, fill: 'var(--acc)' }, g); car.push(c); }
    var fil = S('rect', { x: 192, y: 74, width: 20, height: 8, fill: '#56d07f' }, g);
    g.set = function (nv, usine, filtre) { // nv voitures (0 à 6), usine 0/1, filtre 0/1
      car.forEach(function (c, i) { c.style.opacity = i < nv ? 1 : 0; });
      fil.style.opacity = filtre ? 1 : 0;
      while (pol.firstChild) pol.removeChild(pol.firstChild);
      var n = nv * 6 + (usine ? (filtre ? 4 : 24) : 0);
      for (var k = 0; k < n; k++) S('circle', { cx: 10 + (k * 67) % 340, cy: 20 + (k * 41) % 120, r: 4 + (k % 3) * 2, fill: 'rgba(150,150,150,.45)' }, pol);
      return n;
    };
    return g;
  }

  MV.lesson({
    id: '2ac-pollution-air',
    objectif: {
      fr: 'Identifier les principaux polluants de l\'air et leurs sources, leurs effets sur la santé et l\'environnement, et des moyens de les réduire.',
      ar: 'تعرف أهم ملوثات الهواء ومصادرها، وآثارها على الصحة والبيئة، ووسائل الحد منها.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Un voile sur la ville',
      hud: [['h', 'heure'], ['c', 'ciel'], ['q', 'origine ?']],
      draw: function (svg) { var e = {}; e.v = ville(svg); return e; },
      steps: [
        { cap: 'Tôt le matin, la ville est **calme** et le ciel clair.', hud: { h: ['6 h'], c: ['clair'], q: '–' }, run: function (e) { e.v.set(0, 0, 0); } },
        { cap: 'À 8 h, voitures et usine démarrent : un **voile gris** apparaît.', hud: { h: ['8 h'], c: ['gris'], q: '–' }, run: function (e) { e.v.set(6, 1, 0); } },
        { cap: 'D\'où vient ce voile, et comment le réduire ? On le saura à la fin.', hud: { h: '8 h', c: 'gris', q: ['?'] }, run: function (e) { e.v.set(6, 1, 0); } }
      ]
    },

    prepare: [
      ['La combustion du carburant produit du dioxyde de carbone.', true, 'Et de l\'eau, comme toute combustion d\'hydrocarbure.'],
      ['Une combustion incomplète peut produire du monoxyde de carbone.', true, 'C\'est un gaz toxique, sans odeur.'],
      ['L\'air pollué n\'a aucun effet sur la santé.', false, 'Il irrite les poumons et aggrave l\'asthme.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Polluants, effets, solutions',
      hud: [['p', 'polluant'], ['s', 'source'], ['e', 'effet']],
      draw: function (svg) { var e = {}; e.v = ville(svg); return e; },
      steps: [
        { cap: 'Un **polluant** est une substance qui rend l\'air nuisible aux êtres vivants.', ar: 'الملوث مادة تجعل الهواء ضارا بالكائنات الحية.', hud: { p: ['polluant'], s: '–', e: '–' }, run: function (e) { e.v.set(6, 1, 0); } },
        { cap: 'Les **combustions** des moteurs : CO₂, **CO** toxique, fumées et particules.', ar: 'احتراقات المحركات تطرح [[CO₂]] و [[CO]] السام والدخان والدقائق.', hud: { p: ['CO₂, CO, particules'], s: ['transport'], e: 'poumons' }, run: function (e) { e.v.set(6, 0, 0); } },
        { cap: 'Les **usines** rejettent aussi du dioxyde de soufre **SO₂** : il donne des **pluies acides**.', ar: 'المصانع تطرح ثنائي أكسيد الكبريت [[SO₂]] المسبب للأمطار الحمضية.', hud: { p: ['SO₂'], s: ['industrie'], e: ['pluies acides'] }, run: function (e) { e.v.set(0, 1, 0); } },
        { cap: 'Trop de CO₂ renforce l\'**effet de serre** : la Terre se réchauffe.', ar: 'كثرة [[CO₂]] تزيد من الاحتباس الحراري.', hud: { p: 'CO₂', s: 'combustions', e: ['réchauffement'] }, run: function (e) { e.v.set(6, 1, 0); } },
        { cap: 'Solutions : **filtres** d\'usine, transports en commun, vélo, énergies propres.', ar: 'الحلول: مصافي المصانع، والنقل العمومي، والدراجة، والطاقات النظيفة.', hud: { p: 'moins de polluants', s: 'usine filtrée', e: ['air plus pur'] }, run: function (e) { e.v.set(2, 1, 1); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Réduis le nombre de voitures et équipe l\'usine d\'un filtre.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Ville polluée' }, st);
          var v = ville(svg), nv = 6, fl = 0, set = MV.hud(c, [['v', 'voitures'], ['f', 'filtre'], ['p', 'particules', 1]]);
          function upd() { var n = v.set(nv, 1, fl); set('v', nv); set('f', fl ? 'oui' : 'non'); set('p', n); if (n <= 16) done(); }
          MV.slider(c, { label: 'voitures', min: 0, max: 6, value: 6 }, function (x) { nv = x; upd(); });
          var row = MV.H('div', 'row', '', c), b = MV.H('button', 'btn', 'Filtre sur l\'usine', row); b.onclick = function () { fl = 1 - fl; upd(); };
          upd();
          MV.H('p', 'small', 'Objectif : 16 particules ou moins.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Une voiture rejette environ 120 g de CO₂ par kilomètre.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Pour un trajet de 10 km, masse de CO₂ (g) ?', a: 1200 },
            { q: 'Étape 2. Quatre amis font ce trajet chacun dans sa voiture. Total (g) ?', a: 4800 },
            { q: 'Étape 3. Ils partagent une seule voiture. Masse évitée (g) ?', a: 3600 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le gaz toxique produit par une combustion incomplète est :', o: ['le monoxyde de carbone CO', 'le dioxygène O₂'], a: 0 },
      { lvl: 'Niveau 2', q: 'Les pluies acides sont surtout dues à :', o: ['SO₂', 'O₂', 'N₂'], a: 0 },
      { lvl: 'Niveau 3', q: 'Quel geste réduit la pollution ?', o: ['prendre le bus', 'brûler les déchets'], a: 0 },
      { lvl: 'Niveau 4', q: 'Un bus de 40 personnes remplace 30 voitures de 120 g de CO₂ par km. Sur 1 km, le bus rejette 900 g. Masse évitée (g) ?', a: 2700 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le voile gris',
      hud: [['o', 'origine'], ['p', 'polluants'], ['s', 'solutions']],
      draw: function (svg) { var e = {}; e.v = ville(svg); return e; },
      steps: [
        { cap: 'Le voile vient des **combustions** : moteurs et usines.', hud: { o: ['combustions'], p: ['CO, SO₂, particules'], s: '–' }, run: function (e) { e.v.set(6, 1, 0); } },
        { cap: 'Moins de voitures et des **filtres** : l\'air redevient plus pur.', ar: 'مصدر التلوث هو الاحتراقات، ونحد منه بتقليل السيارات واستعمال المصافي.', hud: { o: 'combustions', p: 'en baisse', s: ['bus, vélo, filtres'] }, run: function (e) { e.v.set(1, 1, 1); } }
      ]
    },

    retenir: [
      'Les principaux <b>polluants</b> de l\'air viennent des <b>combustions</b> : CO₂ (effet de serre), CO (toxique), SO₂ (pluies acides), fumées et particules.',
      'Ils nuisent à la <b>santé</b> et à l\'<b>environnement</b>. On les réduit : transports en commun, filtres, énergies propres.'
    ],
    retenirAr: 'أهم ملوثات الهواء مصدرها الاحتراقات: [[CO₂]] و [[CO]] و [[SO₂]] والدقائق. تضر بالصحة والبيئة، ونحد منها بالنقل العمومي والمصافي والطاقات النظيفة.',
    voc: [['un polluant', 'ملوث'], ['le monoxyde de carbone', 'أحادي أكسيد الكربون'], ['les pluies acides', 'الأمطار الحمضية'], ['l\'effet de serre', 'الاحتباس الحراري']]
  });
})();
