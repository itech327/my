/* @meta {"id":"2ac-volcans","level":"2","order":3,"theme":"Géologie","title":"Les volcans","ar":"البراكين","lead":"Près d'Azrou, des collines rondes et des pierres noires : d'anciens volcans du Moyen Atlas. Pourquoi certains coulent et d'autres explosent ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* coupe d'un volcan. v = viscosité 0 (fluide) à 1 (très visqueuse) ; a = activité 0 à 1 */
  function volcan(svg) {
    var e = {};
    S('rect', { x: 0, y: 0, width: 360, height: 300, fill: '#1b2430' }, svg);
    S('rect', { x: 0, y: 210, width: 360, height: 90, fill: '#4a3822' }, svg);
    e.cone = S('path', { fill: '#3a3d42' }, svg);
    e.chambre = S('ellipse', { cx: 180, cy: 270, rx: 70, ry: 20, fill: '#c8452f' }, svg);
    e.chem = S('rect', { x: 174, y: 110, width: 12, height: 160, fill: '#e2672f' }, svg);
    e.coulee = S('path', { fill: 'none', stroke: '#ff8a3d', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    e.panache = S('g', {}, svg);
    [[180, 70, 22], [160, 45, 26], [200, 35, 28], [175, 15, 30]].forEach(function (p) { S('circle', { cx: p[0], cy: p[1], r: p[2], fill: '#8a8d92', opacity: 0.85 }, e.panache); });
    e.bombes = S('g', {}, svg);
    [[120, 60], [245, 50], [95, 95], [270, 85]].forEach(function (p) { S('circle', { cx: p[0], cy: p[1], r: 5, fill: '#141517', stroke: '#ff8a3d', 'stroke-width': 2 }, e.bombes); });
    e.lch = T(svg, 180, 274, 'chambre magmatique', 'tag');
    e.lchem = T(svg, 166, 190, 'cheminée', 'tag', 'end');
    e.crat = T(svg, 180, 92, 'cratère', 'tag');
    e.set = function (v, a) {
      var h = 110 - v * 30, w = 150 - v * 60;   // fluide : cône large et plat ; visqueuse : cône raide
      e.cone.setAttribute('d', 'M' + (180 - w) + ' 210 L172 ' + h + ' L188 ' + h + ' L' + (180 + w) + ' 210 Z');
      e.chem.setAttribute('y', h); e.chem.setAttribute('height', 270 - h);
      e.crat.setAttribute('y', h - 8);
      // la coulée descend le flanc droit puis s'étale au sol ; on n'en montre qu'une fraction p
      var p = a * (1 - v), fx = 180 + w, sol = 340 - fx;
      var l1 = Math.hypot(fx - 188, 210 - h), tot = l1 + sol;
      e.coulee.setAttribute('d', 'M188 ' + (h + 3) + ' L' + fx + ' 207 L340 207');
      e.coulee.setAttribute('stroke-dasharray', tot.toFixed(1) + ' ' + tot.toFixed(1));
      e.coulee.setAttribute('stroke-dashoffset', (tot * (1 - p)).toFixed(1));
      e.coulee.style.opacity = p > 0.03 ? 1 : 0;
      e.panache.style.opacity = (a * v).toFixed(2);
      e.bombes.style.opacity = a * v > 0.5 ? 1 : 0;
    };
    e.set(0.2, 0);
    return e;
  }

  function type(v) { return v < 0.35 ? 'effusive' : v < 0.65 ? 'mixte' : 'explosive'; }

  MV.lesson({
    id: '2ac-volcans',
    objectif: {
      fr: 'Décrire un volcan, et relier le type d\'éruption, effusive ou explosive, à la viscosité de la lave et à ses gaz.',
      ar: 'وصف البركان، وربط نوع الثوران، انسيابي أو انفجاري، بلزوجة اللابة وغازاتها.'
    },

    prerequis: {
      fr: 'La surface de la Terre est formée de plaques ; sous la croûte, les roches sont très chaudes.',
      ar: 'سطح الأرض مكون من صفائح، وتحت القشرة تكون الصخور شديدة الحرارة.'
    },

    ouverture: {
      vb: '0 0 360 300', label: 'Des volcans dans le Moyen Atlas',
      hud: [['l', 'lieu'], ['r', 'roche'], ['a', 'activité']],
      draw: function (svg) {
        var e = {};
        S('rect', { x: 0, y: 200, width: 360, height: 100, fill: '#6f7a3a' }, svg).setAttribute('data-keep', 1);
        e.c1 = S('path', { d: 'M40 200 Q90 120 140 200 Z', fill: '#4a3a32' }, svg);
        e.c2 = S('path', { d: 'M180 200 Q240 100 300 200 Z', fill: '#4a3a32' }, svg);
        S('path', { d: 'M226 132 Q240 124 254 132', stroke: '#141517', 'stroke-width': 4, fill: 'none' }, e.c2);
        e.roche = S('g', {}, svg);
        [[60, 250], [120, 262], [200, 255], [280, 248], [320, 266]].forEach(function (p) { S('ellipse', { cx: p[0], cy: p[1], rx: 14, ry: 8, fill: '#1c1d20' }, e.roche); });
        T(svg, 180, 290, 'Azrou, Moyen Atlas', 'tag');
        e.q = T(svg, 180, 50, 'coulée ou explosion ?', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'Près d\'**Azrou**, dans le Moyen Atlas, on voit des collines rondes avec un creux au sommet.', on: ['c1', 'c2'], hud: { l: ['Moyen Atlas'], r: '–', a: '–' } },
        { cap: 'Autour, des **pierres noires** et légères, pleines de petits trous.', on: ['c1', 'c2', 'roche'], hud: { l: 'Moyen Atlas', r: ['noire'], a: '–' } },
        { cap: 'Ce sont d\'anciens **volcans**, éteints aujourd\'hui. Les pierres sont de la lave refroidie.', on: ['c1', 'c2', 'roche'], hud: { l: 'Moyen Atlas', r: ['lave figée'], a: ['éteints'] } },
        { cap: 'Certains volcans laissent **couler** leur lave, d\'autres **explosent**. Pourquoi ?', on: ['c1', 'c2', 'roche', 'q'], hud: { l: 'Moyen Atlas', r: 'lave figée', a: ['?'] } }
      ]
    },

    predire: {
      q: 'Une lave est très épaisse, comme du miel froid, et pleine de gaz. Quel type d\'éruption attends-tu ?',
      ar: 'لابة كثيفة جدا مثل العسل البارد ومليئة بالغازات. ما نوع الثوران الذي تتوقعه؟',
      o: ['Une lave qui coule calmement sur des kilomètres', 'Une explosion avec des cendres et des blocs projetés', 'Aucune éruption'],
      a: 1,
      e: 'Dans une lave visqueuse, les gaz restent piégés. La pression monte, puis tout est projeté d\'un coup : l\'éruption est explosive.',
      ear: 'في اللابة اللزجة تبقى الغازات محبوسة فيرتفع الضغط ثم تنفجر دفعة واحدة، فيكون الثوران انفجاريا.'
    },

    prepare: [
      ['Le miel froid coule plus lentement que l\'eau.', true, 'On dit qu\'il est plus visqueux.'],
      ['Une bouteille de boisson gazeuse secouée peut jaillir à l\'ouverture.', true, 'Les gaz s\'échappent brutalement : c\'est la même idée dans un volcan explosif.'],
      ['Tous les volcans du Maroc sont en activité.', false, 'Les volcans du Moyen Atlas et du Siroua sont éteints.']
    ],

    regarde: {
      vb: '0 0 360 300', label: 'Coupe d\'un volcan',
      hud: [['p', 'partie'], ['l', 'lave'], ['t', 'éruption']],
      draw: function (svg) { var e = volcan(svg); return { chambre: e.chambre, lch: e.lch, chem: e.chem, lchem: e.lchem, crat: e.crat, ctl: e }; },
      steps: [
        { cap: 'En profondeur, des roches fondent : c\'est le **magma**. Il s\'accumule dans une **chambre magmatique**.', ar: 'في العمق تنصهر الصخور فتتكون الصهارة وتتجمع في الخزان الصهاري.', on: ['chambre', 'lch'], hud: { p: ['chambre'], l: 'magma', t: '–' }, run: function (e) { e.ctl.set(0.2, 0); } },
        { cap: 'Le magma monte par la **cheminée** et sort par le **cratère**.', ar: 'تصعد الصهارة عبر المدخنة وتخرج من الفوهة.', on: ['chambre', 'chem', 'lchem', 'crat'], hud: { p: ['cheminée', 'cratère'], l: 'magma', t: '–' }, run: function (e) { e.ctl.set(0.2, 0.3); } },
        { cap: 'En surface, le magma qui a perdu une partie de ses gaz s\'appelle la **lave**.', ar: 'عندما تصل الصهارة إلى السطح وتفقد جزءا من غازاتها تسمى اللابة.', on: ['chem', 'crat'], hud: { p: 'cratère', l: ['lave'], t: '–' }, run: function (e) { e.ctl.set(0.2, 0.6); } },
        { cap: 'Lave **fluide**, gaz qui s\'échappent facilement : elle coule en longues **coulées**. Éruption **effusive**.', ar: 'لابة مائعة وغازات تخرج بسهولة: تسيل في شكل سيول طويلة. ثوران انسيابي.', on: ['chem', 'crat'], hud: { p: 'coulée', l: ['fluide'], t: ['effusive'] }, run: function (e) { e.ctl.set(0.1, 1); } },
        { cap: 'Lave **visqueuse**, gaz piégés : la pression monte puis tout explose. **Cendres** et **bombes** volcaniques. Éruption **explosive**.', ar: 'لابة لزجة وغازات محبوسة: يرتفع الضغط ثم يحدث انفجار مع رماد وقذائف. ثوران انفجاري.', on: ['chem', 'crat'], hud: { p: 'panache', l: ['visqueuse'], t: ['explosive'] }, run: function (e) { e.ctl.set(0.95, 1); } },
        { cap: 'Les volcans se trouvent surtout aux **limites des plaques** : là où elles s\'écartent et là où l\'une plonge sous l\'autre.', ar: 'توجد البراكين غالبا عند حدود الصفائح، حيث تتباعد أو حيث تنغرز إحداها تحت الأخرى.', on: ['chambre', 'chem'], hud: { p: 'limites', l: '–', t: '–' }, run: function (e) { e.ctl.set(0.5, 0.5); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change la viscosité de la lave et observe l\'éruption.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 300', role: 'img', 'aria-label': 'Volcan dont l\'éruption dépend de la viscosité' }, st);
          var e = volcan(svg);
          var set = MV.hud(c, [['v', 'viscosité'], ['g', 'gaz', 1], ['t', 'éruption', 1]]), vu = {};
          MV.slider(c, { label: 'viscosité de la lave', min: 0, max: 10, value: 1, fmt: function (v) { return v + ' / 10'; } }, function (v) {
            var x = v / 10, t = type(x); e.set(x, 1); vu[t] = 1;
            set('v', v); set('g', x < 0.35 ? 'libres' : x < 0.65 ? 'en partie' : 'piégés'); set('t', t);
            if (vu.effusive && vu.explosive) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Viscosité de 0 à 10. Essaie une lave fluide, puis une lave très visqueuse. Remarque aussi la forme du cône : large et plat, ou raide. Schéma simplifié.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Une coulée de lave et le vocabulaire du volcan.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Une coulée de lave fluide avance de 3 km par heure. Quelle distance parcourt-elle en 4 heures ?', a: 12, unit: 'km', hint: '3 × 4.' },
            { type: 'opt', q: 'Étape 2. Le magma qui arrive en surface s\'appelle :', o: ['la cendre', 'la lave', 'la chambre magmatique'], a: 1, e: 'Magma en profondeur, lave en surface.' },
            { type: 'opt', q: 'Étape 3. Une lave très visqueuse et riche en gaz donne une éruption :', o: ['effusive, avec de longues coulées', 'explosive, avec des cendres et des bombes'], a: 1, e: 'Les gaz piégés s\'échappent brutalement.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le conduit par lequel monte le magma s\'appelle :', o: ['la cheminée', 'la coulée', 'la cendre'], a: 0, e: 'Il relie la chambre magmatique au cratère.' },
      { lvl: 'Niveau 2', q: 'Une lave fluide donne une éruption :', o: ['effusive', 'explosive'], a: 0, e: 'Les gaz s\'échappent facilement, la lave coule.' },
      { lvl: 'Niveau 3', q: 'Une lave sort à 1 150 °C et se solidifie vers 700 °C. De combien de degrés a-t-elle refroidi ?', a: 450, unit: '°C', hint: '1 150 − 700.' },
      { lvl: 'Niveau 4', q: 'Pourquoi une lave visqueuse rend-elle l\'éruption dangereuse ?', o: ['Elle coule plus vite que l\'eau.', 'Ses gaz restent piégés puis s\'échappent d\'un coup.', 'Elle ne contient aucun gaz.'], a: 1, e: 'La pression des gaz monte jusqu\'à l\'explosion.' }
    ],

    bilan: {
      vb: '0 0 360 300', label: 'Deux types d\'éruption',
      hud: [['l', 'lave'], ['g', 'gaz'], ['t', 'éruption']],
      draw: function (svg) { var e = volcan(svg); return { chambre: e.chambre, chem: e.chem, crat: e.crat, ctl: e }; },
      steps: [
        { cap: 'Le **magma** monte de la chambre par la cheminée.', on: ['chambre', 'chem'], hud: { l: 'magma', g: 'dissous', t: '–' }, run: function (e) { e.ctl.set(0.5, 0); } },
        { cap: 'Lave **fluide** : les gaz s\'échappent, la lave coule. Éruption **effusive**.', on: ['chambre', 'chem', 'crat'], hud: { l: ['fluide'], g: 's\'échappent', t: ['effusive'] }, run: function (e) { e.ctl.set(0.1, 1); } },
        { cap: 'Lave **visqueuse** : les gaz sont piégés et tout explose. Éruption **explosive**.', ar: 'اللابة المائعة تعطي ثورانا انسيابيا، واللابة اللزجة تعطي ثورانا انفجاريا.', on: ['chambre', 'chem', 'crat'], hud: { l: ['visqueuse'], g: 'piégés', t: ['explosive'] }, run: function (e) { e.ctl.set(0.95, 1); } }
      ]
    },

    retenir: [
      'Un <b>volcan</b> est formé d\'une <b>chambre magmatique</b>, d\'une <b>cheminée</b> et d\'un <b>cratère</b>. Le <b>magma</b> qui sort en surface s\'appelle la <b>lave</b>.',
      'Une lave <b>fluide</b> laisse échapper ses gaz et coule : éruption <b>effusive</b>. Une lave <b>visqueuse</b> piège ses gaz et explose : éruption <b>explosive</b>. Les volcans se trouvent surtout aux <b>limites des plaques</b>.'
    ],
    retenirAr: 'يتكون البركان من خزان صهاري ومدخنة وفوهة، والصهارة التي تخرج إلى السطح تسمى اللابة. اللابة المائعة تعطي ثورانا انسيابيا، واللابة اللزجة الغنية بالغازات تعطي ثورانا انفجاريا. توجد البراكين غالبا عند حدود الصفائح.',
    voc: [['un volcan', 'بركان'], ['le magma', 'الصهارة'], ['la lave', 'اللابة'], ['la cheminée', 'المدخنة'], ['le cratère', 'الفوهة'], ['une éruption effusive', 'ثوران انسيابي'], ['une éruption explosive', 'ثوران انفجاري'], ['visqueux', 'لزج']]
  });
})();
