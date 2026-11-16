/* @meta {"id":"2ac-reproduction-animaux","level":"2","order":2,"theme":"Reproduction","title":"La reproduction chez les animaux","ar":"التوالد عند الحيوانات","lead":"Les têtards de la mare deviendront-ils des poissons ? On suit la fécondation puis le développement de la grenouille."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* stade de la grenouille selon la semaine (0 à 12) */
  function grenouille(svg, cx, cy) {
    var g = S('g', {}, svg);
    g.set = function (w) {
      while (g.firstChild) g.removeChild(g.firstChild);
      if (w < 1) { for (var i = 0; i < 9; i++) { var x = cx - 30 + (i % 3) * 30, y = cy - 20 + Math.floor(i / 3) * 20; S('circle', { cx: x, cy: y, r: 11, fill: 'rgba(233,233,234,.35)' }, g); S('circle', { cx: x, cy: y, r: 4, fill: '#141517' }, g); } return 'œufs'; }
      var legs = w >= 6, arms = w >= 9, tail = Math.max(0, 1 - Math.max(0, w - 9) / 3), adult = w >= 12;
      var body = S('ellipse', { cx: cx, cy: cy, rx: adult ? 34 : 22, ry: adult ? 22 : 16, fill: adult ? '#5fae5a' : '#4a4a3a' }, g);
      if (tail > 0) S('path', { d: 'M' + (cx + 18) + ' ' + cy + ' q' + 40 * tail + ' -14 ' + 70 * tail + ' 0 q' + (-30 * tail) + ' 14 ' + (-70 * tail) + ' 0', fill: '#4a4a3a' }, g);
      if (legs) S('path', { d: 'M' + (cx + 8) + ' ' + (cy + 12) + ' l18 18 l10 -2 M' + (cx - 8) + ' ' + (cy + 12) + ' l-18 18 l-10 -2', stroke: adult ? '#5fae5a' : '#6b6b55', 'stroke-width': 5, fill: 'none' }, g);
      if (arms) S('path', { d: 'M' + (cx - 14) + ' ' + (cy + 6) + ' l-12 14 M' + (cx - 4) + ' ' + (cy + 10) + ' l-4 16', stroke: adult ? '#5fae5a' : '#6b6b55', 'stroke-width': 4, fill: 'none' }, g);
      S('circle', { cx: cx - (adult ? 18 : 12), cy: cy - (adult ? 12 : 6), r: 4, fill: '#fff' }, g);
      if (!legs) S('path', { d: 'M' + (cx - 8) + ' ' + (cy - 14) + ' q-6 -8 -2 -14 M' + (cx) + ' ' + (cy - 15) + ' q0 -10 4 -14', stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, g); // branchies externes simplifiées
      return adult ? 'jeune grenouille' : arms ? 'têtard à 4 pattes' : legs ? 'têtard à pattes arrière' : 'têtard';
    };
    g.setAttribute('data-keep', 1);
    return g;
  }

  MV.lesson({
    id: '2ac-reproduction-animaux',
    objectif: {
      fr: 'Décrire la reproduction sexuée des animaux : gamètes, fécondation interne ou externe, développement direct ou avec métamorphose.',
      ar: 'وصف التوالد الجنسي عند الحيوانات: الأمشاج، الإخصاب الداخلي أو الخارجي، والنمو المباشر أو بالتحول.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'Des têtards dans une mare',
      hud: [['v', 'on voit'], ['r', 'ressemble à'], ['q', 'deviendra']],
      draw: function (svg) {
        var e = {};
        S('rect', { x: 0, y: 60, width: 360, height: 160, fill: '#1d3a52' }, svg);
        e.g = grenouille(svg, 180, 140);
        return e;
      },
      steps: [
        { cap: 'Au printemps, dans une mare près d\'Ifrane, des **têtards** nagent.', hud: { v: ['têtards'], r: '–', q: '–' }, run: function (e) { e.g.set(3); } },
        { cap: 'Avec leur queue, ils ressemblent à de **petits poissons**.', hud: { v: 'têtards', r: ['poissons ?'], q: '–' }, run: function (e) { e.g.set(3); } },
        { cap: 'Que vont-ils **devenir** ? On le saura à la fin.', hud: { v: 'têtards', r: 'poissons ?', q: ['?'] }, run: function (e) { e.g.set(3); } }
      ]
    },

    prepare: [
      ['Chez la plupart des animaux, il existe un mâle et une femelle.', true, 'La reproduction sexuée fait intervenir les deux.'],
      ['Tous les animaux pondent des œufs.', false, 'Les mammifères, par exemple, donnent naissance à des petits.'],
      ['Un poussin sort d\'un œuf.', true, 'La poule est ovipare.']
    ],

    regarde: {
      vb: '0 0 360 240', label: 'Gamètes, fécondation et développement',
      hud: [['g', 'gamètes'], ['f', 'fécondation'], ['d', 'développement']],
      draw: function (svg) {
        var e = {};
        e.ovule = S('circle', { cx: 210, cy: 110, r: 34, fill: '#e9c46a' }, svg);
        e.sperm = S('g', {}, svg);
        for (var i = 0; i < 4; i++) { var y = 80 + i * 20; S('ellipse', { cx: 60 + i * 6, cy: y, rx: 6, ry: 4, fill: '#e9e9ea' }, e.sperm); S('path', { d: 'M' + (54 + i * 6) + ' ' + y + ' q-14 -6 -26 0', stroke: '#e9e9ea', fill: 'none', 'stroke-width': 1.5 }, e.sperm); }
        e.sperm.style.transition = 'transform 1.4s ease-in';
        e.oeuf = S('circle', { cx: 210, cy: 110, r: 36, fill: 'none', stroke: 'var(--acc)', 'stroke-width': 4 }, svg);
        e.lab = T(svg, 180, 200, '', 'lbl'); e.lab.setAttribute('data-keep', 1);
        e.cyc = grenouille(svg, 180, 110); e.cyc.removeAttribute('data-keep');
        e.int = S('g', {}, svg); T(e.int, 90, 90, 'externe', 'lbl acc'); T(e.int, 90, 115, 'dans l\'eau', 'tag'); T(e.int, 90, 135, 'grenouille, poissons', 'tag');
        T(e.int, 270, 90, 'interne', 'lbl'); T(e.int, 270, 115, 'dans le corps de la femelle', 'tag'); T(e.int, 270, 135, 'oiseaux, mammifères', 'tag');
        return e;
      },
      steps: [
        { cap: 'Le mâle produit des **spermatozoïdes**, la femelle des **ovules** : ce sont les gamètes.', ar: 'ينتج الذكر الحيوانات المنوية وتنتج الأنثى البويضات: إنها الأمشاج.', on: ['ovule', 'sperm'], hud: { g: ['spermatozoïde + ovule'], f: '–', d: '–' }, run: function (e) { clearTimeout(e.tm); e.sperm.style.transform = 'none'; e.lab.textContent = ''; } },
        { cap: 'Un spermatozoïde s\'unit à l\'ovule : c\'est la **fécondation**.', ar: 'يتحد حيوان منوي بالبويضة: هذا هو الإخصاب.', on: ['ovule', 'sperm'], hud: { g: 'spermatozoïde + ovule', f: ['union'], d: '–' }, run: function (e) { clearTimeout(e.tm); e.sperm.style.transform = 'translate(110px,10px)'; e.lab.textContent = ''; } },
        { cap: 'Il se forme une **cellule-œuf** : le point de départ d\'un nouvel individu.', ar: 'تتكون بيضة ملقحة هي بداية فرد جديد.', on: ['ovule', 'oeuf'], hud: { g: '–', f: 'union', d: ['cellule-œuf'] }, run: function (e) { clearTimeout(e.tm); e.lab.textContent = 'cellule-œuf'; } },
        { cap: 'Fécondation **externe** dans l\'eau, ou **interne** dans le corps de la femelle.', ar: 'الإخصاب خارجي في الماء أو داخلي داخل جسم الأنثى.', on: ['int'], hud: { g: '–', f: ['externe ou interne'], d: '–' }, run: function (e) { clearTimeout(e.tm); e.lab.textContent = ''; } },
        { cap: 'Chez la grenouille, l\'œuf devient un **têtard** qui respire avec des branchies.', ar: 'عند الضفدع تصبح البيضة شرغوفا يتنفس بالغلاصم.', on: ['cyc'], hud: { g: '–', f: 'externe', d: ['têtard'] }, run: function (e) { clearTimeout(e.tm); e.cyc.set(0); e.tm = setTimeout(function () { e.lab.textContent = e.cyc.set(3); }, 700); } },
        { cap: 'Les pattes poussent, la queue régresse : c\'est la **métamorphose**.', ar: 'تنمو الأرجل ويتراجع الذيل: هذا هو التحول.', on: ['cyc'], hud: { g: '–', f: 'externe', d: ['métamorphose'] }, run: function (e) { clearTimeout(e.tm); e.lab.textContent = e.cyc.set(7); e.tm = setTimeout(function () { e.lab.textContent = e.cyc.set(10); }, 900); } },
        { cap: 'Chez le chat ou le poussin, le jeune ressemble déjà à l\'adulte : **développement direct**.', ar: 'عند القط أو الكتكوت يشبه الصغير الحيوان البالغ: نمو مباشر.', hud: { g: '–', f: 'interne', d: ['direct'] }, run: function (e) { clearTimeout(e.tm); e.lab.textContent = ''; } }
      ]
    },

    faisons: [
      { title: 'De l\'œuf à la grenouille', intro: 'Fais avancer les semaines (durées approximatives, elles dépendent de la température de l\'eau).',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Développement de la grenouille' }, st);
          S('rect', { x: 0, y: 0, width: 360, height: 200, fill: '#1d3a52' }, svg);
          var g = grenouille(svg, 160, 100), set = MV.hud(c, [['w', 'semaine'], ['s', 'stade', 1], ['r', 'respiration', 1]]), max = 0;
          MV.slider(c, { label: 'semaine', min: 0, max: 12, value: 0 }, function (w) {
            var s = g.set(w); set('w', w); set('s', s); set('r', w < 1 ? '–' : w < 10 ? 'branchies' : 'poumons'); max = Math.max(max, w); if (max === 12) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Va jusqu\'à la semaine 12.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Comparons la grenouille et la poule.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Chez la grenouille, la fécondation est :', o: ['externe', 'interne'], a: 0, e: 'Elle se fait dans l\'eau, hors du corps de la femelle.' },
            { type: 'opt', q: 'Étape 2. Chez la poule, la fécondation est :', o: ['externe', 'interne'], a: 1, e: 'Elle a lieu dans le corps de la poule, avant la ponte.' },
            { type: 'opt', q: 'Étape 3. Le poussin ressemble à l\'adulte à la naissance. Son développement est :', o: ['direct', 'avec métamorphose'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Les gamètes mâles s\'appellent :', o: ['les ovules', 'les spermatozoïdes', 'les têtards'], a: 1 },
      { lvl: 'Niveau 2', q: 'La fécondation, c\'est :', o: ['la ponte des œufs', 'l\'union d\'un spermatozoïde et d\'un ovule', 'la sortie du têtard'], a: 1 },
      { lvl: 'Niveau 3', q: 'Un animal qui pond des œufs est dit :', o: ['ovipare', 'vivipare'], a: 0, e: 'Un animal dont les petits naissent vivants est vivipare.' },
      { lvl: 'Niveau 4', q: 'Le têtard respire avec des branchies, la grenouille adulte surtout avec des poumons. Cela montre :', o: ['un développement direct', 'une métamorphose', 'une fécondation interne'], a: 1 }
    ],

    bilan: {
      vb: '0 0 360 220', label: 'Le têtard devient grenouille',
      hud: [['s', 'stade'], ['r', 'respire avec'], ['q', 'réponse']],
      draw: function (svg) { var e = {}; S('rect', { x: 0, y: 0, width: 360, height: 220, fill: '#1d3a52' }, svg); e.g = grenouille(svg, 170, 110); return e; },
      steps: [
        { cap: 'Le têtard grandit, ses **pattes** apparaissent.', hud: { s: ['têtard'], r: 'branchies', q: '–' }, run: function (e) { e.g.set(8); } },
        { cap: 'Sa queue régresse : il devient une **grenouille**. Ce n\'est pas un poisson.', ar: 'الشرغوف لا يصبح سمكة بل ضفدعا، بعد تحول.', hud: { s: ['grenouille'], r: ['poumons'], q: ['grenouille'] }, run: function (e) { e.g.set(12); } }
      ]
    },

    retenir: [
      'Dans la reproduction sexuée, un <b>spermatozoïde</b> (gamète mâle) et un <b>ovule</b> (gamète femelle) s\'unissent : c\'est la <b>fécondation</b>, qui donne une cellule-œuf. Elle est <b>externe</b> (grenouille, poissons) ou <b>interne</b> (oiseaux, mammifères).',
      'Le développement est <b>direct</b> si le jeune ressemble à l\'adulte, ou avec <b>métamorphose</b> comme chez la grenouille. Les animaux sont <b>ovipares</b> ou <b>vivipares</b>.'
    ],
    retenirAr: 'في التوالد الجنسي يتحد حيوان منوي ببويضة: هذا هو الإخصاب الذي يعطي بيضة ملقحة. يكون الإخصاب خارجيا أو داخليا، ويكون النمو مباشرا أو بتحول كما عند الضفدع.',
    voc: [['un gamète', 'مشيج'], ['un spermatozoïde', 'حيوان منوي'], ['un ovule', 'بويضة'], ['la fécondation', 'الإخصاب'], ['la métamorphose', 'التحول'], ['ovipare / vivipare', 'بيوض / ولود']]
  });
})();
