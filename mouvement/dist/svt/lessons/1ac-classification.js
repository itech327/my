/* @meta {"id":"1ac-classification","level":"1","order":5,"theme":"Les êtres vivants","title":"Classer les êtres vivants","ar":"تصنيف الكائنات الحية","lead":"La chauve-souris vole comme un oiseau, mais ce n'est pas un oiseau. On classe d'après ce que les êtres vivants possèdent."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var GR = [ // groupe, attribut, exemples
    ['Mammifères', 'poils', 'chèvre, chauve-souris'],
    ['Oiseaux', 'plumes', 'cigogne, poule'],
    ['Reptiles', 'écailles sèches', 'lézard, tortue'],
    ['Poissons', 'écailles nageoires', 'sardine'],
    ['Amphibiens', 'peau nue', 'grenouille']
  ];

  /* une clé : vertébrés puis cinq boîtes selon le revêtement du corps */
  function cle(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), box = [];
    var top = S('g', {}, g); S('rect', { x: 110, y: 10, width: 140, height: 34, rx: 8, fill: 'rgba(86,208,127,.18)', stroke: 'var(--acc)' }, top); T(top, 180, 32, 'Vertébrés (squelette)', 'lbl');
    GR.forEach(function (gr, i) {
      var x = 8 + i * 70, b = S('g', {}, g);
      S('path', { d: 'M180 44 L' + (x + 32) + ' 78', stroke: '#9aa0a8', 'stroke-width': 1.5 }, b);
      var r = S('rect', { x: x, y: 80, width: 64, height: 90, rx: 8, fill: '#1d1f23', stroke: '#5b6068' }, b);
      var a1 = T(b, x + 32, 98, gr[1].split(' ')[0], 'tag'); a1.style.fontSize = '9px';
      if (gr[1].indexOf(' ') > 0) T(b, x + 32, 112, gr[1].slice(gr[1].indexOf(' ') + 1), 'tag').style.fontSize = '9px';
      var n = T(b, x + 32, 150, gr[0], 'tag'); n.style.fontWeight = 700; n.style.fontSize = '9px';
      b.style.transition = 'opacity .6s'; box.push({ g: b, r: r });
    });
    g.set = function (n, hot) { box.forEach(function (b, i) { b.g.style.opacity = i < n ? 1 : 0; b.r.setAttribute('stroke', i === hot ? 'var(--acc)' : '#5b6068'); b.r.setAttribute('stroke-width', i === hot ? 3 : 1); }); };
    return g;
  }

  MV.lesson({
    id: '1ac-classification',
    objectif: {
      fr: 'Classer des êtres vivants selon les caractères qu\'ils possèdent en commun, à l\'aide d\'une clé de classification.',
      ar: 'تصنيف الكائنات الحية حسب الصفات المشتركة التي تمتلكها، باستعمال مفتاح التصنيف.'
    },

    ouverture: {
      vb: '0 0 360 190', label: 'Une chauve-souris',
      hud: [['a', 'animal'], ['c', 'ce qu\'il fait'], ['q', 'groupe ?']],
      draw: function (svg) {
        var e = {};
        e.cs = S('path', { d: 'M180 90 q-30 -40 -90 -30 q20 10 15 30 q15 -10 30 5 q15 -15 45 -5 q30 -10 45 5 q15 -15 30 -5 q-5 -20 15 -30 q-60 -10 -90 30 z', fill: '#6b5a4a', stroke: '#141517', 'stroke-width': 2, 'data-keep': 1 }, svg);
        e.p = T(svg, 180, 150, 'poils, allaite ses petits', 'lbl acc');
        return e;
      },
      steps: [
        { cap: 'La **chauve-souris** vole la nuit avec des ailes.', hud: { a: ['chauve-souris'], c: ['vole'], q: '–' } },
        { cap: 'Mais son corps est couvert de **poils** et elle allaite ses petits.', on: ['p'], hud: { a: 'chauve-souris', c: 'vole', q: '–' } },
        { cap: 'Est-ce un oiseau ? Dans quel **groupe** la ranger ? On le saura à la fin.', on: ['p'], hud: { a: 'chauve-souris', c: 'vole', q: ['?'] } }
      ]
    },

    predire: {
      q: "La chauve-souris vole la nuit avec des ailes, mais son corps est couvert de poils et elle allaite ses petits. Dans quel groupe la ranger ?",
      ar: "الخفاش يطير ليلاً بجناحين، لكن جسمه مغطى بالشعر وهو يرضع صغاره. في أي مجموعة نصنّفه؟",
      o: ["Les oiseaux, car elle vole", "Les mammifères, car elle a des poils et allaite", "Un groupe à part"],
      a: 1,
      e: "On classe selon les caractères communs, pas selon ce que l'animal fait. Des poils et l'allaitement : c'est un mammifère, même s'il vole.",
      ear: "نصنّف حسب الصفات المشتركة لا حسب ما يفعله الحيوان: الشعر والإرضاع يجعلان الخفاش من الثدييات."
    },

    prepare: [
      ['Tous les animaux qui volent sont des oiseaux.', false, 'Les insectes et les chauves-souris volent aussi.'],
      ['La poule a des plumes.', true, 'Les plumes caractérisent les oiseaux.'],
      ['Le lézard a un squelette interne.', true, 'C\'est un vertébré.']
    ],

    regarde: {
      vb: '0 0 360 190', label: 'Une clé de classification',
      hud: [['c', 'caractère'], ['g', 'groupe'], ['x', 'exemples']],
      draw: function (svg) { var e = {}; e.k = cle(svg); return e; },
      steps: [
        { cap: 'On ne classe pas selon ce que l\'animal **fait**, mais selon ce qu\'il **possède**.', ar: 'لا نصنف حسب ما يفعله الحيوان، بل حسب ما يمتلكه من صفات.', hud: { c: ['ce qu\'il possède'], g: '–', x: '–' }, run: function (e) { e.k.set(0); } },
        { cap: 'Un **squelette interne** avec une colonne vertébrale : ce sont les **vertébrés**.', ar: 'الحيوانات ذات الهيكل العظمي الداخلي والعمود الفقري: الفقريات.', hud: { c: ['squelette'], g: ['vertébrés'], x: 'chèvre, sardine' }, run: function (e) { e.k.set(0); } },
        { cap: 'Puis on regarde le **revêtement du corps** : poils, plumes, écailles ou peau nue.', ar: 'ثم ننظر إلى غطاء الجسم: أوبار، ريش، حراشف أو جلد عار.', hud: { c: ['revêtement'], g: '5 groupes', x: '–' }, run: function (e) { e.k.set(5); } },
        { cap: '**Poils** : mammifères. **Plumes** : oiseaux.', ar: 'الأوبار: الثدييات. الريش: الطيور.', hud: { c: 'poils / plumes', g: ['mammifères, oiseaux'], x: 'chèvre, cigogne' }, run: function (e) { e.k.set(5, 0); } },
        { cap: '**Écailles** : reptiles et poissons (avec nageoires). **Peau nue** : amphibiens.', ar: 'الحراشف: الزواحف والأسماك. الجلد العاري الرطب: البرمائيات.', hud: { c: 'écailles / peau nue', g: ['reptiles, poissons, amphibiens'], x: 'lézard, sardine, grenouille' }, run: function (e) { e.k.set(5, 4); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Parcours les groupes : quel caractère les définit ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 190', role: 'img', 'aria-label': 'Clé de classification' }, st);
          var k = cle(svg), set = MV.hud(c, [['g', 'groupe'], ['c', 'caractère', 1], ['x', 'exemples']]);
          MV.slider(c, { label: 'groupe', min: 1, max: 5, value: 1 }, function (n) { var gr = GR[n - 1]; k.set(5, n - 1); set('g', gr[0]); set('c', gr[1]); set('x', gr[2]); if (n === 5) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Classe le hérisson : squelette interne, corps couvert de piquants qui sont des poils durcis.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Il a un squelette interne : c\'est un', o: ['vertébré', 'sans vertèbres'], a: 0 },
            { type: 'opt', q: 'Étape 2. Ses piquants sont des :', o: ['poils', 'plumes', 'écailles'], a: 0 },
            { type: 'opt', q: 'Étape 3. Le hérisson est un :', o: ['mammifère', 'reptile', 'oiseau'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un animal à plumes est un :', o: ['oiseau', 'mammifère'], a: 0 },
      { lvl: 'Niveau 2', q: 'La grenouille, à peau nue et humide, est un :', o: ['amphibien', 'reptile', 'poisson'], a: 0 },
      { lvl: 'Niveau 3', q: 'Le dauphin a des poils à la naissance et allaite : c\'est un', o: ['mammifère', 'poisson'], a: 0 },
      { lvl: 'Niveau 4', q: 'Dans la clé, combien de groupes de vertébrés distingue-t-on ?', a: 5 }
    ],

    bilan: {
      vb: '0 0 360 190', label: 'La chauve-souris',
      hud: [['c', 'caractère'], ['g', 'groupe'], ['p', 'piège']],
      draw: function (svg) { var e = {}; e.k = cle(svg); return e; },
      steps: [
        { cap: 'Squelette interne et **poils** : la chauve-souris est un **mammifère**.', hud: { c: ['poils'], g: ['mammifère'], p: '–' }, run: function (e) { e.k.set(5, 0); } },
        { cap: 'Voler n\'est pas un caractère de classement : on regarde ce qu\'elle **possède**.', ar: 'الخفاش ثديي لأنه يمتلك أوبارا، والطيران ليس صفة للتصنيف.', hud: { c: 'poils', g: 'mammifère', p: ['voler ≠ oiseau'] }, run: function (e) { e.k.set(5, 0); } }
      ]
    },

    retenir: [
      'On classe les êtres vivants selon les <b>caractères qu\'ils possèdent</b> en commun, pas selon ce qu\'ils font ni où ils vivent.',
      'Chez les <b>vertébrés</b>, le revêtement du corps aide à classer : poils (mammifères), plumes (oiseaux), écailles (reptiles, poissons), peau nue (amphibiens).'
    ],
    retenirAr: 'نصنف الكائنات الحية حسب الصفات المشتركة التي تمتلكها. عند الفقريات: الأوبار للثدييات، والريش للطيور، والحراشف للزواحف والأسماك، والجلد العاري للبرمائيات.',
    voc: [['classer', 'يصنف'], ['un caractère', 'صفة'], ['les vertébrés', 'الفقريات'], ['les mammifères', 'الثدييات'], ['les amphibiens', 'البرمائيات']]
  });
})();
