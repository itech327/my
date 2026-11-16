/* @meta {"id":"1ac-respiration","level":"1","order":2,"theme":"Les êtres vivants","title":"La respiration chez les êtres vivants","ar":"التنفس عند الكائنات الحية","lead":"Un poisson sorti de l'eau s'asphyxie alors que l'air contient du dioxygène : chaque animal respire avec l'organe adapté à son milieu."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var O2 = 'var(--acc)', CO2 = '#e9e9ea';

  /* des points qui entrent (O2) et sortent (CO2) d'un organe en (x, y) */
  function flux(svg, x, y) {
    var g = S('g', {}, svg), dots = [];
    for (var i = 0; i < 6; i++) dots.push(S('circle', { r: 5, fill: i % 2 ? CO2 : O2 }, g));
    var t0 = null, run = true;
    function tick(ts) {
      if (!t0) t0 = ts; var p = ((ts - t0) / 2200) % 1;
      dots.forEach(function (d, i) {
        var q = (p + i / 6) % 1, inn = i % 2 === 0, k = inn ? q : 1 - q;
        d.setAttribute('cx', x - 120 + k * 110); d.setAttribute('cy', y + (i % 3 - 1) * 14);
      });
      if (run) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    return g;
  }

  MV.lesson({
    id: '1ac-respiration',
    objectif: {
      fr: 'Savoir que les êtres vivants respirent en prenant du dioxygène et en rejetant du dioxyde de carbone, avec des organes adaptés à leur milieu.',
      ar: 'معرفة أن الكائنات الحية تتنفس بأخذ ثنائي الأوكسجين وطرح ثنائي أوكسيد الكربون، بأعضاء ملائمة لوسط عيشها.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'Un poisson hors de l\'eau',
      hud: [['m', 'milieu'], ['o', 'dioxygène'], ['q', 'question']],
      draw: function (svg) {
        var e = {};
        e.eau = S('rect', { x: 0, y: 110, width: 360, height: 110, fill: '#1d3a52' }, svg); e.eau.style.transition = 'opacity .8s';
        e.fish = S('g', {}, svg);
        S('ellipse', { cx: 0, cy: 0, rx: 34, ry: 16, fill: '#e9a35a' }, e.fish); S('path', { d: 'M30 0 l18 -12 v24 z', fill: '#e9a35a' }, e.fish); S('circle', { cx: -20, cy: -4, r: 3, fill: '#141517' }, e.fish);
        e.fish.style.transition = 'transform 1.2s'; e.fish.setAttribute('data-keep', 1);
        e.q = T(svg, 180, 60, 'pourquoi ?', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'Dans l\'eau de l\'oued, un poisson **respire** sans problème.', on: ['eau'], hud: { m: ['eau'], o: 'dissous', q: '–' }, run: function (e) { e.fish.style.transform = 'translate(180px,165px)'; } },
        { cap: 'Hors de l\'eau, il **s\'asphyxie**, alors que l\'air contient beaucoup de dioxygène.', hud: { m: ['air'], o: ['21 %'], q: '–' }, run: function (e) { e.fish.style.transform = 'translate(180px,130px)'; } },
        { cap: 'Pourquoi ? On le saura à la fin.', on: ['q'], hud: { m: 'air', o: '21 %', q: ['?'] }, run: function (e) { e.fish.style.transform = 'translate(180px,130px)'; } }
      ]
    },

    prepare: [
      ['Les animaux ont besoin de dioxygène pour vivre.', true, 'Ils le prennent dans l\'air ou dans l\'eau.'],
      ['L\'eau d\'une rivière ne contient pas de dioxygène.', false, 'Le dioxygène y est dissous : les poissons l\'utilisent.'],
      ['Les plantes respirent aussi.', true, 'Comme tous les êtres vivants, jour et nuit.']
    ],

    regarde: {
      vb: '0 0 360 260', label: 'Échanges gazeux respiratoires',
      hud: [['a', 'être vivant'], ['o', 'organe'], ['m', 'milieu']],
      draw: function (svg) {
        var e = {};
        e.flux = flux(svg, 300, 110);
        T(svg, 120, 40, 'entrée : dioxygène', 'tag').style.fill = 'var(--acc)';
        T(svg, 120, 190, 'sortie : dioxyde de carbone', 'tag');
        e.org = S('g', {}, svg);
        e.poumon = S('path', { d: 'M270 70 q-30 0 -30 50 q0 40 25 40 q15 0 15 -30 z M300 70 q30 0 30 50 q0 40 -25 40 q-15 0 -15 -30 z', fill: '#d07a70' }, svg);
        e.branchie = S('g', {}, svg);
        for (var i = 0; i < 6; i++) S('path', { d: 'M260 ' + (70 + i * 16) + ' q40 -8 70 0', stroke: '#e5484d', 'stroke-width': 6, fill: 'none' }, e.branchie);
        e.trachee = S('g', {}, svg);
        S('path', { d: 'M285 60 v120 M285 90 h40 M285 120 h-40 M285 150 h40 M325 90 v30 M245 120 v30', stroke: '#cfd3d8', 'stroke-width': 4, fill: 'none' }, e.trachee);
        e.chaux = S('g', {}, svg);
        S('rect', { x: 250, y: 70, width: 70, height: 110, rx: 6, fill: 'none', stroke: '#cfd3d8', 'stroke-width': 3 }, e.chaux);
        e.trouble = S('rect', { x: 253, y: 110, width: 64, height: 67, fill: '#e9e9ea' }, e.chaux); e.trouble.style.transition = 'opacity 1.5s';
        T(e.chaux, 285, 200, 'eau de chaux', 'tag');
        return e;
      },
      steps: [
        { cap: 'Respirer, c\'est **prendre du dioxygène** et **rejeter du dioxyde de carbone**.', ar: 'التنفس هو أخذ ثنائي الأوكسجين وطرح ثنائي أوكسيد الكربون.', on: ['flux'], hud: { a: 'tous', o: '–', m: '–' } },
        { cap: 'L\'**eau de chaux** se trouble en présence de dioxyde de carbone.', ar: 'ماء الجير يتعكر بوجود ثنائي أوكسيد الكربون.', on: ['chaux'], hud: { a: 'test', o: ['eau de chaux'], m: ['se trouble'] }, run: function (e) { e.trouble.style.opacity = 0; setTimeout(function () { e.trouble.style.opacity = 0.75; }, 300); } },
        { cap: 'L\'Homme et le chat respirent avec des **poumons**, dans l\'air.', ar: 'الإنسان والقط يتنفسان برئتين في الهواء.', on: ['flux', 'poumon'], hud: { a: ['Homme, chat'], o: ['poumons'], m: ['air'] } },
        { cap: 'Le poisson respire avec des **branchies**, le dioxygène dissous dans l\'eau.', ar: 'السمك يتنفس بالغلاصم الأوكسجين المذاب في الماء.', on: ['flux', 'branchie'], hud: { a: ['poisson'], o: ['branchies'], m: ['eau'] } },
        { cap: 'Le criquet respire par des **trachées** : de petits tubes qui apportent l\'air.', ar: 'الجراد يتنفس بالقصيبات الهوائية.', on: ['flux', 'trachee'], hud: { a: ['criquet'], o: ['trachées'], m: ['air'] } },
        { cap: 'La grenouille respire aussi par sa **peau** humide, en plus de ses poumons.', ar: 'الضفدع يتنفس أيضا عبر جلده الرطب إضافة إلى رئتيه.', on: ['flux', 'poumon'], hud: { a: ['grenouille'], o: ['poumons + peau'], m: 'air et eau' } }
      ]
    },

    faisons: [
      { title: 'Qui respire comment ?', intro: 'Touche un être vivant pour voir son organe respiratoire et son milieu.',
        build: function (c, MV, done) {
          var set = MV.hud(c, [['a', 'être vivant'], ['o', 'organe', 1], ['m', 'milieu', 1]]), row = MV.H('div', 'row', '', c), seen = 0;
          [['Homme', 'poumons', 'air'], ['poisson', 'branchies', 'eau'], ['criquet', 'trachées', 'air'], ['grenouille', 'poumons et peau', 'air et eau'], ['têtard', 'branchies', 'eau']].forEach(function (a) {
            var b = MV.H('button', 'btn', a[0], row);
            b.onclick = function () { set('a', a[0]); set('o', a[1]); set('m', a[2]); if (!b.dataset.s) { b.dataset.s = 1; if (++seen >= 4) done(); } };
          });
          MV.H('p', 'small', 'Touche au moins quatre êtres vivants.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'On place une souris dans un bocal avec de l\'eau de chaux. Après un moment, l\'eau de chaux se trouble.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. L\'eau de chaux se trouble à cause :', o: ['du dioxygène', 'du dioxyde de carbone', 'de la vapeur d\'eau'], a: 1, e: 'C\'est le test du dioxyde de carbone.' },
            { type: 'opt', q: 'Étape 2. D\'où vient ce gaz ?', o: ['de la respiration de la souris', 'de l\'eau de chaux elle-même'], a: 0, e: 'La souris rejette du dioxyde de carbone.' },
            { type: 'opt', q: 'Étape 3. Conclusion : la souris…', o: ['rejette du dioxyde de carbone en respirant', 'ne respire pas'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'En respirant, un être vivant rejette :', o: ['du dioxygène', 'du dioxyde de carbone', 'de l\'azote'], a: 1 },
      { lvl: 'Niveau 2', q: 'L\'organe respiratoire du poisson est :', o: ['les poumons', 'les branchies', 'les trachées'], a: 1 },
      { lvl: 'Niveau 3', q: 'Un bocal fermé avec une plante, à l\'obscurité : l\'eau de chaux se trouble. Pourquoi ?', o: ['La plante respire et rejette du dioxyde de carbone.', 'La plante ne respire pas.', 'L\'obscurité trouble l\'eau de chaux.'], a: 0, e: 'Les plantes respirent aussi.' },
      { lvl: 'Niveau 4', q: 'Le têtard vit dans l\'eau, la grenouille adulte surtout dans l\'air. Leurs organes respiratoires :', o: ['sont les mêmes', 'changent : branchies puis poumons', 'n\'existent pas'], a: 1, e: 'L\'organe respiratoire est adapté au milieu de vie.' }
    ],

    bilan: {
      vb: '0 0 360 220', label: 'Le poisson et ses branchies',
      hud: [['o', 'organe'], ['m', 'milieu'], ['r', 'réponse']],
      draw: function (svg) {
        var e = {};
        e.ok = S('g', {}, svg); for (var i = 0; i < 6; i++) S('path', { d: 'M80 ' + (60 + i * 18) + ' q50 -10 100 0', stroke: '#e5484d', 'stroke-width': 7, fill: 'none' }, e.ok);
        T(e.ok, 130, 190, 'dans l\'eau : lamelles écartées', 'tag');
        e.ko = S('g', {}, svg); for (i = 0; i < 6; i++) S('path', { d: 'M240 ' + (110 + i * 4) + ' q40 -4 80 0', stroke: '#a8584f', 'stroke-width': 7, fill: 'none' }, e.ko);
        T(e.ko, 280, 190, 'dans l\'air : collées', 'tag');
        return e;
      },
      steps: [
        { cap: 'Le poisson respire avec des **branchies**, faites pour l\'eau.', on: ['ok'], hud: { o: ['branchies'], m: ['eau'], r: '–' } },
        { cap: 'Hors de l\'eau, les lamelles des branchies **se collent** : les échanges gazeux deviennent presque impossibles.', ar: 'خارج الماء تلتصق صفائح الغلاصم فيتعذر تبادل الغازات.', on: ['ok', 'ko'], hud: { o: 'branchies', m: ['air'], r: ['asphyxie'] } },
        { cap: 'Chaque organe respiratoire est **adapté** au milieu de vie.', ar: 'كل عضو تنفسي ملائم لوسط عيش الكائن.', on: ['ok', 'ko'], hud: { o: 'branchies', m: 'eau', r: ['adaptation'] } }
      ]
    },

    retenir: [
      'Tous les êtres vivants <b>respirent</b> : ils absorbent du <b>dioxygène</b> et rejettent du <b>dioxyde de carbone</b>, qui trouble l\'eau de chaux.',
      'L\'organe respiratoire est adapté au milieu : <b>poumons</b> (air), <b>branchies</b> (eau), <b>trachées</b> (insectes), <b>peau</b> (grenouille, en plus des poumons).'
    ],
    retenirAr: 'تتنفس جميع الكائنات الحية: تمتص ثنائي الأوكسجين وتطرح ثنائي أوكسيد الكربون الذي يعكر ماء الجير. العضو التنفسي ملائم لوسط العيش: الرئتان في الهواء، والغلاصم في الماء، والقصيبات الهوائية عند الحشرات.',
    voc: [['la respiration', 'التنفس'], ['les poumons', 'الرئتان'], ['les branchies', 'الغلاصم'], ['les trachées', 'القصيبات الهوائية'], ['l\'eau de chaux', 'ماء الجير']]
  });
})();
