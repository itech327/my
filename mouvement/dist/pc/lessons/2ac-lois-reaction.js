/* @meta {"id":"2ac-lois-reaction","level":"2","order":4,"theme":"Matière et environnement","title":"La réaction chimique et ses lois","ar":"التفاعل الكيميائي وقوانينه","lead":"Le charbon brûlé semble disparaître : en flacon fermé, la balance montre que la masse se conserve, car les atomes se conservent."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var COL = { C: '#3a3a3a', O: '#e5484d', H: '#f2f2f2' };
  function at(g, x, y, el, r) { S('circle', { cx: x, cy: y, r: r || 9, fill: COL[el], stroke: '#141517', 'stroke-width': 1.2 }, g); }
  function draw(g, x, y, mol) { var M = { CH4: [['C', 0, 0, 11], ['H', -12, -10], ['H', 12, -10], ['H', -12, 10], ['H', 12, 10]], O2: [['O', -8, 0], ['O', 8, 0]], CO2: [['O', -17, 0], ['C', 0, 0, 11], ['O', 17, 0]], H2O: [['O', 0, 0], ['H', -12, 9, 7], ['H', 12, 9, 7]] }[mol]; M.forEach(function (a) { at(g, x + a[1], y + a[2], a[0], a[3] || (a[0] === 'H' ? 7 : 9)); }); }

  /* balance avec un flacon fermé */
  function balance(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('rect', { x: 110, y: 190, width: 140, height: 30, rx: 6, fill: '#2b2e33', stroke: '#9aa0a8' }, g);
    var t = T(g, 180, 211, '', 'lbl big acc');
    S('path', { d: 'M150 80 h60 v20 l20 30 v60 h-100 v-60 l20 -30 z', fill: 'rgba(127,178,255,.12)', stroke: '#cfd3d8', 'stroke-width': 2.5 }, g);
    S('rect', { x: 165, y: 70, width: 30, height: 12, fill: '#6b6f76' }, g);
    var inn = S('g', {}, g);
    g.set = function (etat, m) {
      while (inn.firstChild) inn.removeChild(inn.firstChild);
      if (etat === 0) { at(inn, 180, 175, 'C', 14); draw(inn, 155, 135, 'O2'); draw(inn, 205, 140, 'O2'); draw(inn, 180, 115, 'O2'); }
      else { draw(inn, 160, 150, 'CO2'); draw(inn, 205, 135, 'O2'); draw(inn, 180, 115, 'O2'); }
      t.textContent = m;
    };
    return g;
  }

  MV.lesson({
    id: '2ac-lois-reaction',
    objectif: {
      fr: 'Savoir qu\'au cours d\'une réaction chimique la masse et les atomes se conservent, et écrire une équation équilibrée.',
      ar: 'معرفة أن الكتلة والذرات تنحفظ خلال التفاعل الكيميائي، وكتابة معادلة متوازنة.'
    },

    ouverture: {
      vb: '0 0 360 240', label: 'Le charbon disparaît-il ?',
      hud: [['a', 'avant'], ['p', 'après'], ['q', 'question']],
      draw: function (svg) {
        var e = {};
        e.braise = S('g', {}, svg); for (var i = 0; i < 6; i++) S('circle', { cx: 130 + i * 20, cy: 170, r: 12, fill: i % 2 ? '#3a3a3a' : '#f2a23c' }, e.braise);
        e.cendre = S('g', {}, svg); S('ellipse', { cx: 180, cy: 175, rx: 40, ry: 6, fill: '#9aa0a8' }, e.cendre);
        S('rect', { x: 100, y: 180, width: 160, height: 14, rx: 4, fill: '#6b6f76' }, svg); T(svg, 180, 215, 'kanoun', 'tag');
        return e;
      },
      steps: [
        { cap: 'Dans le **kanoun**, on met 1 kg de charbon.', on: ['braise'], hud: { a: ['1 kg'], p: '–', q: '–' } },
        { cap: 'Après la cuisson, il ne reste qu\'un **peu de cendre**.', on: ['cendre'], hud: { a: '1 kg', p: ['presque rien'], q: '–' } },
        { cap: 'La matière a-t-elle **disparu** ? On le saura à la fin.', on: ['cendre'], hud: { a: '1 kg', p: 'presque rien', q: ['?'] } }
      ]
    },

    prepare: [
      ['La combustion du carbone produit du dioxyde de carbone, un gaz.', true, 'Ce gaz s\'échappe dans l\'air.'],
      ['Un atome peut se transformer en un autre atome dans une combustion.', false, 'Les atomes se conservent : ils se réarrangent seulement.'],
      ['La formule CO₂ contient 3 atomes.', true, '1 carbone et 2 oxygènes.']
    ],

    regarde: {
      vb: '0 0 360 240', label: 'Conservation de la masse et des atomes',
      hud: [['m', 'masse'], ['a', 'atomes'], ['e', 'équation']],
      draw: function (svg) {
        var e = {}; e.bal = balance(svg);
        e.eq = S('g', {}, svg);
        draw(e.eq, 40, 60, 'CH4'); T(e.eq, 70, 64, '+', 'lbl'); draw(e.eq, 95, 60, 'O2'); draw(e.eq, 125, 60, 'O2');
        T(e.eq, 160, 64, '→', 'lbl big acc'); draw(e.eq, 200, 60, 'CO2'); T(e.eq, 230, 64, '+', 'lbl'); draw(e.eq, 260, 60, 'H2O'); draw(e.eq, 300, 60, 'H2O');
        e.eqt = T(e.eq, 180, 110, 'CH₄ + 2 O₂ → CO₂ + 2 H₂O', 'lbl big');
        e.cpt = T(e.eq, 180, 140, 'C : 1 = 1   H : 4 = 4   O : 4 = 4', 'tag');
        return e;
      },
      steps: [
        { cap: 'On brûle du charbon dans un **flacon fermé** posé sur une balance.', ar: 'نحرق الفحم داخل قارورة مغلقة فوق ميزان.', hud: { m: ['85,0 g'], a: '–', e: '–' }, run: function (e) { e.bal.style.opacity = 1; e.bal.set(0, '85,0 g'); } },
        { cap: 'Après la réaction, le carbone a disparu… mais la balance indique **la même masse**.', ar: 'بعد التفاعل اختفى الكربون، لكن الكتلة بقيت نفسها.', hud: { m: ['85,0 g'], a: '–', e: '–' }, run: function (e) { e.bal.style.opacity = 1; e.bal.set(1, '85,0 g'); } },
        { cap: 'C\'est la **loi de conservation de la masse** (Lavoisier).', ar: 'هذا هو قانون انحفاظ الكتلة (لافوازيي).', hud: { m: ['conservée'], a: '–', e: 'C + O₂ → CO₂' }, run: function (e) { e.bal.style.opacity = 1; e.bal.set(1, '85,0 g'); } },
        { cap: 'Pourquoi ? Les **atomes** ne disparaissent pas : ils changent seulement de partenaires.', ar: 'لأن الذرات لا تختفي، بل تتغير الروابط بينها فقط.', on: ['eq'], hud: { m: 'conservée', a: ['conservés'], e: '–' }, run: function (e) { e.bal.style.opacity = 0; } },
        { cap: 'Le méthane brûle : il faut **2 O₂** pour avoir autant d\'atomes de chaque côté.', ar: 'يحترق الميثان: نحتاج [[2 O₂]] ليكون عدد الذرات متساويا في الطرفين.', on: ['eq'], hud: { m: '–', a: ['C 1 · H 4 · O 4'], e: ['CH₄ + 2 O₂ → CO₂ + 2 H₂O'] }, run: function (e) { e.bal.style.opacity = 0; } },
        { cap: 'Une équation est **équilibrée** quand chaque sorte d\'atome est en même nombre des deux côtés.', ar: 'تكون المعادلة متوازنة عندما يتساوى عدد كل نوع من الذرات في الطرفين.', on: ['eq'], hud: { m: '–', a: 'autant de chaque côté', e: ['équilibrée'] }, run: function (e) { e.bal.style.opacity = 0; } }
      ]
    },

    faisons: [
      { title: 'Équilibre l\'équation', intro: 'Règle les nombres devant O₂, CO₂ et H₂O pour la combustion du méthane CH₄.',
        build: function (c, MV, done) {
          var co = { a: 1, b: 1, c: 1 }, set = MV.hud(c, [['e', 'équation'], ['g', 'à gauche'], ['d', 'à droite'], ['r', 'équilibrée ?', 1]]);
          function upd() {
            var gC = 1, gH = 4, gO = 2 * co.a, dC = co.b, dH = 2 * co.c, dO = 2 * co.b + co.c;
            set('e', 'CH₄ + ' + co.a + ' O₂ → ' + co.b + ' CO₂ + ' + co.c + ' H₂O');
            set('g', 'C' + gC + ' H' + gH + ' O' + gO); set('d', 'C' + dC + ' H' + dH + ' O' + dO);
            var ok = gC === dC && gH === dH && gO === dO; set('r', ok ? 'oui' : 'non'); if (ok) done();
          }
          MV.slider(c, { label: 'O₂', min: 1, max: 4, value: 1 }, function (v) { co.a = v; upd(); });
          MV.slider(c, { label: 'CO₂', min: 1, max: 4, value: 1 }, function (v) { co.b = v; upd(); });
          MV.slider(c, { label: 'H₂O', min: 1, max: 4, value: 1 }, function (v) { co.c = v; upd(); });
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'On brûle 12 g de carbone avec 32 g de dioxygène. Tout réagit.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Le produit formé est :', o: ['du dioxyde de carbone', 'du méthane'], a: 0 },
            { q: 'Étape 2. Masse de dioxyde de carbone formée, en g ?', a: 44, unit: 'g', hint: 'La masse se conserve : 12 + 32.' },
            { type: 'opt', q: 'Étape 3. L\'équation C + O₂ → CO₂ est-elle équilibrée ?', o: ['oui', 'non'], a: 0, e: '1 C et 2 O de chaque côté.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Au cours d\'une réaction chimique, la masse totale :', o: ['diminue', 'se conserve', 'augmente'], a: 1 },
      { lvl: 'Niveau 2', q: 'Dans 2 H₂O, combien d\'atomes d\'hydrogène ?', a: 4 },
      { lvl: 'Niveau 3', q: 'Équilibre : 2 H₂ + O₂ → … H₂O. Quel nombre devant H₂O ?', a: 2 },
      { lvl: 'Niveau 4', q: 'On brûle 6 g de carbone dans 16 g de dioxygène (réaction totale). Masse de CO₂ obtenue ?', a: 22, unit: 'g' }
    ],

    bilan: {
      vb: '0 0 360 240', label: 'Le charbon expliqué',
      hud: [['c', 'carbone'], ['g', 'gaz formé'], ['r', 'réponse']],
      draw: function (svg) { var e = {}; e.bal = balance(svg); return e; },
      steps: [
        { cap: 'Le carbone du charbon s\'unit au dioxygène de l\'air.', hud: { c: ['réactif'], g: '–', r: '–' }, run: function (e) { e.bal.set(0, ''); } },
        { cap: 'Il devient du **dioxyde de carbone**, un gaz qui part dans l\'air. La matière n\'a pas disparu.', ar: 'تحول الكربون إلى ثنائي أوكسيد الكربون، وهو غاز انتشر في الهواء. المادة لم تختف.', hud: { c: 'réactif', g: ['CO₂'], r: ['conservée'] }, run: function (e) { e.bal.set(1, ''); } }
      ]
    },

    retenir: [
      'Au cours d\'une réaction chimique, la <b>masse totale se conserve</b> : masse des réactifs consommés = masse des produits formés.',
      'Les <b>atomes se conservent</b> : ils se réarrangent. Une équation est <b>équilibrée</b> quand chaque sorte d\'atome est en même nombre des deux côtés : CH₄ + 2 O₂ → CO₂ + 2 H₂O.'
    ],
    retenirAr: 'خلال التفاعل الكيميائي تنحفظ الكتلة الكلية: كتلة المتفاعلات المستهلكة تساوي كتلة النواتج المتكونة. وتنحفظ الذرات أيضا، لذلك نوازن المعادلة.',
    voc: [['la conservation de la masse', 'انحفاظ الكتلة'], ['une équation chimique', 'معادلة كيميائية'], ['équilibrer', 'يوازن'], ['un coefficient', 'معامل']]
  });
})();
