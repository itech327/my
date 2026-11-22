/* @meta {"id":"1ac-relatifs","level":"1","order":3,"theme":"Nombres et calcul","title":"Les nombres relatifs","ar":"الأعداد النسبية","lead":"Un matin d'hiver : −6 °C à Ifrane, 2 °C à Fès. On place les températures sur une droite pour les comparer."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 180, U = 22; // 0 au centre, une unité = 22 px

  function droite(svg, y) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('line', { x1: 8, y1: y, x2: 352, y2: y, stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    S('path', { d: 'M352 ' + y + ' l-8 -5 v10 z', fill: '#9aa0a8' }, g);
    for (var k = -7; k <= 7; k++) { S('line', { x1: X0 + k * U, y1: y - 6, x2: X0 + k * U, y2: y + 6, stroke: '#9aa0a8', 'stroke-width': k ? 1.2 : 3 }, g); if (k % 2 === 0 || Math.abs(k) === 7) T(g, X0 + k * U, y + 24, k, 'tag'); }
    return g;
  }
  function pt(svg, y, col) {
    var g = S('g', {}, svg); S('circle', { cx: 0, cy: y, r: 7, fill: col || 'var(--acc)', stroke: '#fff', 'stroke-width': 2 }, g);
    var t = T(g, 0, y - 16, '', 'lbl'); g.style.transition = 'transform .9s ease-in-out';
    g.at = function (v, lab) { g.style.transform = 'translate(' + (X0 + v * U) + 'px,0)'; t.textContent = lab; };
    return g;
  }

  MV.lesson({
    id: '1ac-relatifs',
    objectif: {
      fr: 'Repérer un nombre relatif sur une droite graduée, trouver son opposé et comparer deux nombres relatifs.',
      ar: 'تمثيل عدد نسبي على مستقيم مدرج، وتحديد مقابله، ومقارنة عددين نسبيين.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Températures du matin',
      hud: [['i', 'Ifrane'], ['f', 'Fès'], ['q', 'plus froid ?']],
      draw: function (svg) { var e = {}; droite(svg, 120); e.i = pt(svg, 120, 'var(--acc)'); e.f = pt(svg, 120, '#7fb2ff'); return e; },
      steps: [
        { cap: 'Un matin d\'hiver, il fait **2 °C** à Fès.', on: ['f'], hud: { i: '–', f: ['2 °C'], q: '–' }, run: function (e) { e.f.at(2, 'Fès'); e.i.at(0, ''); } },
        { cap: 'À Ifrane, il fait **−6 °C** : six degrés sous zéro.', on: ['f', 'i'], hud: { i: ['−6 °C'], f: '2 °C', q: '–' }, run: function (e) { e.f.at(2, 'Fès'); e.i.at(-6, 'Ifrane'); } },
        { cap: 'Comment écrire et **comparer** ces nombres ? On le saura à la fin.', on: ['f', 'i'], hud: { i: '−6 °C', f: '2 °C', q: ['?'] }, run: function (e) { e.f.at(2, 'Fès'); e.i.at(-6, 'Ifrane'); } }
      ]
    },

    predire: {
      q: "Il fait 2 °C à Fès et −6 °C à Ifrane. Combien de degrés les séparent ?",
      ar: "الحرارة [[2 °C]] في فاس و[[−6 °C]] في إفران. كم درجة تفصل بينهما؟",
      o: ["4 degrés", "8 degrés", "−4 degrés"],
      a: 1,
      e: "Sur la droite graduée, de −6 à 0 il y a 6 degrés, puis de 0 à 2 il y en a 2 : 6 + 2 = 8 degrés d'écart. On ne soustrait pas 6 de 2 en oubliant le signe.",
      ear: "من [[−6]] إلى [[0]] ست درجات ومن [[0]] إلى [[2]] درجتان: الفرق [[8]] درجات."
    },

    prepare: [
      ['0 °C est la température où l\'eau gèle.', true, 'En dessous, on utilise des nombres négatifs.'],
      ['−3 se lit « moins trois ».', true, 'Le signe − indique un nombre négatif.'],
      ['−5 est plus grand que −2.', false, '−5 est plus loin sous zéro : −5 < −2.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'La droite graduée',
      hud: [['n', 'nombre'], ['o', 'opposé'], ['d', 'distance à zéro']],
      draw: function (svg) { var e = {}; droite(svg, 120); e.a = pt(svg, 120); e.b = pt(svg, 120, '#7fb2ff'); e.a.setAttribute('data-keep', 1); return e; },
      steps: [
        { cap: 'À droite de 0 : les nombres **positifs**. À gauche : les nombres **négatifs**.', ar: 'على يمين الصفر الأعداد الموجبة، وعلى يساره الأعداد السالبة.', hud: { n: '+4', o: '–', d: '–' }, run: function (e) { e.a.at(4, '+4'); } },
        { cap: 'Chaque point a une **abscisse**. Le point A a pour abscisse −3.', ar: 'لكل نقطة أفصول. أفصول النقطة A هو −3.', hud: { n: ['−3'], o: '–', d: '–' }, run: function (e) { e.a.at(-3, 'A(−3)'); } },
        { cap: '−3 et 3 sont à la même distance de 0 : ce sont des nombres **opposés**.', ar: 'العددان −3 و 3 متقابلان: لهما نفس المسافة إلى الصفر.', on: ['b'], hud: { n: '−3', o: ['3'], d: '–' }, run: function (e) { e.a.at(-3, '−3'); e.b.at(3, '3'); } },
        { cap: 'Cette distance à zéro vaut **3**. On l\'appelle la distance à zéro.', ar: 'المسافة إلى الصفر هي 3.', on: ['b'], hud: { n: '−3', o: '3', d: ['3'] }, run: function (e) { e.a.at(-3, '−3'); e.b.at(3, '3'); } },
        { cap: 'Sur la droite, le plus **grand** est toujours à droite. 2 > −6.', ar: 'العدد الأكبر يوجد دائما على اليمين.', on: ['b'], hud: { n: ['2 > −6'], o: '–', d: '–' }, run: function (e) { e.a.at(-6, '−6'); e.b.at(2, '2'); } },
        { cap: 'Deux négatifs : le plus grand est le plus **proche de 0**. −2 > −5.', ar: 'بين عددين سالبين، الأكبر هو الأقرب إلى الصفر.', on: ['b'], hud: { n: ['−2 > −5'], o: '–', d: '2 et 5' }, run: function (e) { e.a.at(-5, '−5'); e.b.at(-2, '−2'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Déplace le point. Observe son opposé et sa distance à zéro.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 140', role: 'img', 'aria-label': 'Point sur une droite graduée' }, st);
          droite(svg, 80); var p = pt(svg, 80), q = pt(svg, 80, '#7fb2ff'), set = MV.hud(c, [['n', 'nombre'], ['o', 'opposé', 1], ['d', 'distance à 0', 1]]);
          MV.slider(c, { label: 'nombre', min: -7, max: 7, value: -4 }, function (v) { p.at(v, String(v).replace('-', '−')); q.at(-v, String(-v).replace('-', '−')); set('n', String(v).replace('-', '−')); set('o', String(-v).replace('-', '−')); set('d', Math.abs(v)); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          done();
        } },
      { title: 'Résolvons ensemble', intro: 'Range dans l\'ordre croissant : 3 ; −7 ; 0 ; −1.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Quel est le plus petit nombre ?', o: ['−1', '−7', '0'], a: 1, e: 'C\'est le plus à gauche sur la droite.' },
            { type: 'opt', q: 'Étape 2. Entre −1 et 0, lequel est le plus petit ?', o: ['−1', '0'], a: 0 },
            { type: 'opt', q: 'Étape 3. L\'ordre croissant est :', o: ['−1 < −7 < 0 < 3', '−7 < −1 < 0 < 3', '0 < −1 < 3 < −7'], a: 1 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Quel est l\'opposé de −8 ?', a: 8 },
      { lvl: 'Niveau 2', q: 'Compare −4 et −9.', o: ['−4 < −9', '−4 > −9'], a: 1, e: '−4 est plus proche de 0.' },
      { lvl: 'Niveau 3', q: 'Quelle est la distance à zéro de −12 ?', a: 12 },
      { lvl: 'Niveau 4', q: 'À Midelt il fait −3 °C, à Azrou −5 °C. Où fait-il le plus froid ?', o: ['Midelt', 'Azrou'], a: 1, e: '−5 < −3.' }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'Comparer les températures',
      hud: [['i', 'Ifrane'], ['f', 'Fès'], ['r', 'réponse']],
      draw: function (svg) { var e = {}; droite(svg, 120); e.i = pt(svg, 120); e.f = pt(svg, 120, '#7fb2ff'); e.i.setAttribute('data-keep', 1); e.f.setAttribute('data-keep', 1); return e; },
      steps: [
        { cap: 'Ifrane : **−6**, à gauche. Fès : **2**, à droite.', hud: { i: ['−6'], f: ['2'], r: '–' }, run: function (e) { e.i.at(-6, 'Ifrane'); e.f.at(2, 'Fès'); } },
        { cap: '−6 < 2 : il fait **plus froid à Ifrane**, de 8 degrés.', ar: 'الحرارة في إفران أقل: [[−6 < 2]].', hud: { i: '−6', f: '2', r: ['Ifrane'] }, run: function (e) { e.i.at(-6, 'Ifrane'); e.f.at(2, 'Fès'); } }
      ]
    },

    retenir: [
      'Un nombre relatif est <b>positif</b> ou <b>négatif</b>. Sur une droite graduée, chaque point a une <b>abscisse</b>. Deux nombres <b>opposés</b> (−3 et 3) ont la même distance à zéro.',
      'Le plus grand de deux nombres est le plus à <b>droite</b>. Entre deux négatifs, le plus grand est le plus proche de zéro.'
    ],
    retenirAr: 'العدد النسبي موجب أو سالب. لكل نقطة من مستقيم مدرج أفصول. العددان المتقابلان لهما نفس المسافة إلى الصفر. أكبر عددين هو الذي يوجد على اليمين.',
    voc: [['un nombre relatif', 'عدد نسبي'], ['positif / négatif', 'موجب / سالب'], ['l\'abscisse', 'الأفصول'], ['l\'opposé', 'المقابل'], ['la distance à zéro', 'المسافة إلى الصفر']]
  });
})();
