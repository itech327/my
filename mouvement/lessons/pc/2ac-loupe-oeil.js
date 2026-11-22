/* @meta {"id":"2ac-loupe-oeil","level":"2","order":11,"theme":"La lumière","title":"La loupe et l'œil","ar":"المكبرة والعين","lead":"Samir voit flou le tableau depuis le fond de la classe. Son œil fonctionne comme une lentille, et des lunettes bien choisies remettent l'image à sa place."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, AY = 105, CX = 150, RET = 290;
  // cas -> [position du point de convergence, lentille correctrice]
  var CAS = { 'œil normal': [RET, null], 'œil myope': [250, null], 'myope + lunettes': [RET, 'divergente'], 'œil hypermétrope': [330, null], 'hypermétrope + lunettes': [RET, 'convergente'] };

  function oeil(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    S('ellipse', { cx: 225, cy: AY, rx: 85, ry: 70, fill: 'rgba(255,255,255,.04)', stroke: '#e9e9ea', 'stroke-width': 2.5 }, g);
    S('path', { d: 'M' + RET + ' 55 Q312 ' + AY + ' ' + RET + ' 155', fill: 'none', stroke: '#e5484d', 'stroke-width': 5 }, g); T(g, 318, 168, 'rétine', 'tag');
    S('ellipse', { cx: CX + 10, cy: AY, rx: 10, ry: 34, fill: 'rgba(170,220,255,.35)', stroke: '#e9e9ea', 'stroke-width': 2 }, g); T(g, CX + 10, 158, 'cristallin', 'tag');
    g.set = function (cas) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var c = CAS[cas], F = c[0], L = c[1];
      if (L) S('path', { d: L === 'divergente' ? 'M84 60 H100 Q92 ' + AY + ' 100 150 H84 Q92 ' + AY + ' 84 60 Z' : 'M92 60 Q104 ' + AY + ' 92 150 Q80 ' + AY + ' 92 60 Z', fill: 'rgba(242,193,78,.35)', stroke: '#f2c14e', 'stroke-width': 2 }, dyn);
      [-26, 26].forEach(function (h) {
        S('line', { x1: 10, y1: AY + h, x2: L ? 92 : CX + 10, y2: AY + h, stroke: '#f2c14e', 'stroke-width': 2 }, dyn);
        if (L) S('line', { x1: 92, y1: AY + h, x2: CX + 10, y2: AY + h * (L === 'divergente' ? 1.25 : 0.8), stroke: '#f2c14e', 'stroke-width': 2 }, dyn);
        var y0 = L ? AY + h * (L === 'divergente' ? 1.25 : 0.8) : AY + h, xe = Math.min(F, RET + 6);
        S('line', { x1: CX + 10, y1: y0, x2: xe, y2: AY + (y0 - AY) * (1 - (xe - CX - 10) / (F - CX - 10)), stroke: '#f2c14e', 'stroke-width': 2 }, dyn);
        if (F < RET) S('line', { x1: F, y1: AY, x2: RET, y2: AY - (y0 - AY) * (RET - F) / (F - CX - 10), stroke: '#f2c14e', 'stroke-width': 2, opacity: 0.6 }, dyn);
      });
      var net = F === RET;
      S('circle', { cx: F, cy: AY, r: 4, fill: net ? '#56d07f' : '#e5484d' }, dyn);
      return net ? 'image nette sur la rétine' : F < RET ? 'image avant la rétine : flou' : 'image derrière la rétine : flou';
    };
    return g;
  }

  MV.lesson({
    id: '2ac-loupe-oeil',
    objectif: {
      fr: 'Comprendre le rôle de la loupe, modéliser l\'œil par une lentille convergente et un écran, et expliquer la correction de la myopie et de l\'hypermétropie.',
      ar: 'فهم دور المكبرة، ونمذجة العين بعدسة مجمعة وشاشة، وتفسير تصحيح قصر البصر وطول البصر.'
    },

    prerequis: {
      fr: 'Lentille convergente ; image réelle et image virtuelle.',
      ar: 'العدسة المجمعة والصورة الحقيقية والصورة الوهمية.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Le tableau flou',
      hud: [['s', 'Samir'], ['v', 'vision de loin'], ['q', 'pourquoi ?']],
      draw: function (svg) { var e = {}; e.o = oeil(svg); return e; },
      steps: [
        { cap: 'Samir lit bien son cahier, de **près**.', hud: { s: ['près : net'], v: '–', q: '–' }, run: function (e) { e.o.set('œil normal'); } },
        { cap: 'Mais depuis le fond de la classe, le **tableau** est **flou**.', hud: { s: 'près : net', v: ['loin : flou'], q: '–' }, run: function (e) { e.o.set('œil myope'); } },
        { cap: 'Que se passe-t-il dans son œil ? On le saura à la fin.', hud: { s: 'près : net', v: 'loin : flou', q: ['?'] }, run: function (e) { e.o.set('œil myope'); } }
      ]
    },

    predire: {
      q: "Samir voit bien de près mais le tableau est flou depuis le fond de la classe. Où se forme l'image du tableau dans son œil ?",
      ar: "سمير يرى جيداً عن قرب لكن السبورة غير واضحة من آخر القسم. أين تتكوّن صورة السبورة في عينه؟",
      o: ["Exactement sur la rétine", "Avant la rétine", "Après la rétine"],
      a: 1,
      e: "Samir est myope : pour un objet lointain, son œil forme l'image avant la rétine, donc elle est floue. Des lunettes à lentille divergente corrigent ce défaut.",
      ear: "سمير قصير النظر: الصورة تتكوّن أمام الشبكية فتبدو غير واضحة، وتصحّحها عدسة مفرّقة."
    },

    prepare: [
      ['Une loupe est une lentille convergente.', true, 'Elle a les bords minces.'],
      ['Avec une loupe, l\'objet doit être placé loin, au-delà du foyer.', false, 'On le place entre la loupe et son foyer pour voir une image agrandie.'],
      ['La rétine est au fond de l\'œil.', true, 'C\'est là que se forme l\'image.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'L\'œil, une lentille et un écran',
      hud: [['c', 'cas'], ['i', 'image'], ['r', 'remède']],
      draw: function (svg) { var e = {}; e.o = oeil(svg); return e; },
      steps: [
        { cap: 'La **loupe** : objet placé **entre la lentille et son foyer** ; on voit une image **droite et agrandie**.', ar: 'المكبرة: نضع الجسم بين العدسة وبؤرتها فنرى صورة مكبرة ومستقيمة.', hud: { c: ['loupe'], i: 'droite, agrandie', r: '–' }, run: function (e) { e.o.set('œil normal'); } },
        { cap: 'L\'**œil** : le **cristallin** joue le rôle d\'une lentille convergente, la **rétine** celui d\'un écran.', ar: 'العين: الجسم البلوري عدسة مجمعة والشبكية شاشة.', hud: { c: ['œil normal'], i: ['nette sur la rétine'], r: '–' }, run: function (e) { e.o.set('œil normal'); } },
        { cap: 'Œil **myope** : l\'image se forme **avant** la rétine. Il voit flou de loin.', ar: 'العين المصابة بقصر البصر: تتكون الصورة أمام الشبكية.', hud: { c: ['myope'], i: ['avant la rétine'], r: '?' }, run: function (e) { e.o.set('œil myope'); } },
        { cap: 'Correction : une lentille **divergente** recule l\'image sur la rétine.', ar: 'يصحح قصر البصر بعدسة مفرقة.', hud: { c: 'myope', i: 'sur la rétine', r: ['lentille divergente'] }, run: function (e) { e.o.set('myope + lunettes'); } },
        { cap: 'Œil **hypermétrope** : image **derrière** la rétine ; correction par une lentille **convergente**.', ar: 'العين المصابة بطول البصر: تتكون الصورة خلف الشبكية، وتصحح بعدسة مجمعة.', hud: { c: ['hypermétrope'], i: 'derrière la rétine', r: ['lentille convergente'] }, run: function (e) { e.o.set('hypermétrope + lunettes'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Teste chaque œil. Trouve les deux cas corrigés par des lunettes.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Modèle de l\'œil' }, st);
          var o = oeil(svg), vu = {}, set = MV.hud(c, [['c', 'cas'], ['i', 'image', 1]]), row = MV.H('div', 'row', '', c);
          Object.keys(CAS).forEach(function (k) { var b = MV.H('button', 'btn', k, row); b.onclick = function () { set('c', k); set('i', o.set(k)); if (CAS[k][1]) vu[k] = 1; if (Object.keys(vu).length === 2) done(); }; });
          set('c', 'œil normal'); set('i', o.set('œil normal'));
        } },
      { title: 'Résolvons ensemble', intro: 'Une grand-mère voit mal de près ; l\'image se forme derrière sa rétine.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Son œil est :', o: ['hypermétrope', 'myope'], a: 0 },
            { type: 'opt', q: 'Étape 2. Ses lunettes ont des lentilles :', o: ['convergentes', 'divergentes'], a: 0 },
            { type: 'opt', q: 'Étape 3. Ces lentilles ont les bords :', o: ['minces', 'épais'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Dans l\'œil, le rôle de l\'écran est joué par :', o: ['la rétine', 'le cristallin'], a: 0 },
      { lvl: 'Niveau 2', q: 'Un myope se corrige avec une lentille :', o: ['divergente', 'convergente'], a: 0 },
      { lvl: 'Niveau 3', q: 'Pour utiliser une loupe, l\'objet est placé :', o: ['entre la loupe et son foyer', 'très loin'], a: 0 },
      { lvl: 'Niveau 4', q: 'Une loupe a une vergence de 8 δ. Sa distance focale, en cm ?', a: 12.5 }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'Les lunettes de Samir',
      hud: [['d', 'diagnostic'], ['l', 'lunettes'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.o = oeil(svg); return e; },
      steps: [
        { cap: 'L\'image du tableau se forme **avant** la rétine : Samir est **myope**.', hud: { d: ['myope'], l: '–', r: 'flou' }, run: function (e) { e.o.set('œil myope'); } },
        { cap: 'Des lunettes à lentilles **divergentes** ramènent l\'image **sur la rétine** : le tableau est net.', ar: 'سمير مصاب بقصر البصر، والنظارات ذات العدسات المفرقة تعيد الصورة إلى الشبكية.', hud: { d: 'myope', l: ['divergentes'], r: ['net'] }, run: function (e) { e.o.set('myope + lunettes'); } }
      ]
    },

    retenir: [
      'La <b>loupe</b> est une lentille convergente : un objet placé entre la loupe et son foyer donne une image <b>agrandie</b> et droite. L\'<b>œil</b> se modélise par une lentille convergente (cristallin) et un écran (<b>rétine</b>).',
      '<b>Myopie</b> : image avant la rétine, corrigée par une lentille <b>divergente</b>. <b>Hypermétropie</b> : image derrière la rétine, corrigée par une lentille <b>convergente</b>.'
    ],
    retenirAr: 'المكبرة عدسة مجمعة. تنمذج العين بعدسة مجمعة (الجسم البلوري) وشاشة (الشبكية). قصر البصر يصحح بعدسة مفرقة، وطول البصر يصحح بعدسة مجمعة.',
    voc: [['une loupe', 'مكبرة'], ['la rétine', 'الشبكية'], ['le cristallin', 'الجسم البلوري'], ['la myopie', 'قصر البصر'], ['l\'hypermétropie', 'طول البصر']]
  });
})();
