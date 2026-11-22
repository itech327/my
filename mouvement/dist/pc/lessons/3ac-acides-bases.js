/* @meta {"id":"3ac-acides-bases","level":"3","order":4,"theme":"Les réactions chimiques","title":"Solutions acides et basiques","ar":"المحاليل الحمضية والقاعدية","lead":"Jus de citron, eau du robinet, eau de Javel : le pH les range sur une même échelle de 0 à 14."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 30, W = 300;
  function col(p) { return p < 7 ? 'hsl(' + (p * 8) + ',75%,55%)' : p > 7 ? 'hsl(' + (200 + (p - 7) * 10) + ',65%,55%)' : '#6fcf6f'; }

  /* échelle de pH et curseur */
  function echelle(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    for (var p = 0; p < 14; p++) S('rect', { x: X0 + p * W / 14, y: 110, width: W / 14 + 0.5, height: 30, fill: col(p + 0.5) }, g);
    for (p = 0; p <= 14; p += 7) T(g, X0 + p * W / 14, 158, p, 'tag');
    T(g, X0 + W * 0.22, 178, 'acide', 'lbl'); T(g, X0 + W / 2, 178, 'neutre', 'lbl'); T(g, X0 + W * 0.78, 178, 'basique', 'lbl');
    var cur = S('g', {}, g); S('path', { d: 'M0 0 l-8 -14 h16 z', fill: '#fff' }, cur); var lb = T(cur, 0, -22, '', 'lbl');
    cur.style.transition = 'transform 1s';
    g.set = function (p, nom) { cur.setAttribute('transform', 'translate(' + (X0 + p * W / 14) + ',106)'); lb.textContent = nom ? nom + ' · pH ' + String(p).replace('.', ',') : 'pH ' + String(p).replace('.', ','); };
    return g;
  }

  MV.lesson({
    id: '3ac-acides-bases',
    objectif: {
      fr: 'Utiliser le pH pour classer une solution (acide, neutre, basique), connaître l\'effet de la dilution et les règles de sécurité.',
      ar: 'استعمال pH لتصنيف محلول (حمضي، محايد، قاعدي)، ومعرفة تأثير التخفيف وقواعد السلامة.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Trois liquides de la maison',
      hud: [['l', 'liquide'], ['p', 'pH'], ['q', 'classement ?']],
      draw: function (svg) { var e = {}; e.e = echelle(svg); return e; },
      steps: [
        { cap: 'Du **jus de citron** : il pique la langue.', hud: { l: ['citron'], p: '–', q: '–' }, run: function (e) { e.e.set(2.4, 'citron'); } },
        { cap: 'De l\'**eau de Javel** : elle est dangereuse pour la peau.', hud: { l: ['eau de Javel'], p: '–', q: '–' }, run: function (e) { e.e.set(11.5, 'Javel'); } },
        { cap: 'Comment les **classer** ? On le saura à la fin.', hud: { l: 'citron, Javel', p: ['?'], q: ['?'] }, run: function (e) { e.e.set(7); } }
      ]
    },

    predire: {
      q: "Le jus de citron pique la langue et l'eau de Javel est dangereuse pour la peau. Quel pH peut-on attendre ?",
      ar: "عصير الليمون يلسع اللسان وماء جافيل يضرّ بالجلد. ما الرقم الهيدروجيني المتوقع؟",
      o: ["Citron : pH inférieur à 7 ; Javel : pH supérieur à 7", "Citron : pH supérieur à 7 ; Javel : pH inférieur à 7", "Les deux ont un pH égal à 7"],
      a: 0,
      e: "Le citron est acide (pH inférieur à 7) et l'eau de Javel est basique (pH supérieur à 7). Concentrés, acides et bases sont corrosifs : il faut se protéger.",
      ear: "الليمون حمضي ([[pH < 7]]) وماء جافيل قاعدي ([[pH > 7]]). المحاليل المركّزة آكلة فيجب الحذر."
    },

    prepare: [
      ['L\'eau pure a un pH égal à 7.', true, 'Elle est neutre.'],
      ['Le jus de citron est basique.', false, 'Il est acide.'],
      ['On peut goûter un produit pour savoir s\'il est acide.', false, 'Jamais : on utilise du papier pH ou un pH-mètre.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'L\'échelle de pH',
      hud: [['s', 'solution'], ['p', 'pH'], ['n', 'nature']],
      draw: function (svg) { var e = {}; e.e = echelle(svg); return e; },
      steps: [
        { cap: 'On mesure le pH avec du **papier pH** ou un **pH-mètre**. Il va de 0 à 14.', ar: 'نقيس pH بورق pH أو بجهاز pH-mètre، وقيمته بين 0 و 14.', hud: { s: '–', p: ['0 à 14'], n: '–' }, run: function (e) { e.e.set(7); } },
        { cap: 'pH = 7 : solution **neutre**, comme l\'eau pure.', ar: 'إذا كان [[pH = 7]] فالمحلول محايد.', hud: { s: ['eau pure'], p: ['7'], n: ['neutre'] }, run: function (e) { e.e.set(7, 'eau pure'); } },
        { cap: 'pH < 7 : solution **acide**. Plus le pH est petit, plus elle est acide.', ar: 'إذا كان [[pH < 7]] فالمحلول حمضي.', hud: { s: ['vinaigre'], p: ['3'], n: ['acide'] }, run: function (e) { e.e.set(3, 'vinaigre'); } },
        { cap: 'pH > 7 : solution **basique**, comme l\'eau savonneuse.', ar: 'إذا كان [[pH > 7]] فالمحلول قاعدي.', hud: { s: ['eau savonneuse'], p: ['10'], n: ['basique'] }, run: function (e) { e.e.set(10, 'savon'); } },
        { cap: 'Ajouter de l\'eau (**diluer**) rapproche le pH de 7.', ar: 'التخفيف بالماء يقرب pH من 7.', hud: { s: 'vinaigre dilué', p: ['3 → 4'], n: ['moins acide'] }, run: function (e) { e.e.set(3, 'vinaigre'); setTimeout(function () { e.e.set(4, 'dilué'); }, 900); } },
        { cap: 'Acides et bases concentrés sont **corrosifs** : gants, lunettes, et on verse l\'acide dans l\'eau.', ar: 'الأحماض والقواعد المركزة أكالة: نلبس القفازات والنظارات ونصب الحمض في الماء.', hud: { s: 'produit concentré', p: '–', n: ['corrosif'] }, run: function (e) { e.e.set(1, 'concentré'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Dilue une solution acide ou basique : vers où va le pH ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Échelle de pH' }, st);
          var e = echelle(svg), base = 2, d = 0, set = MV.hud(c, [['p', 'pH'], ['n', 'nature', 1]]), row = MV.H('div', 'row', '', c);
          function upd() { var p = base < 7 ? Math.min(6.9, base + d) : Math.max(7.1, base - d); e.set(p); set('p', String(p).replace('.', ',')); set('n', p < 7 ? 'acide' : 'basique'); }
          [['Acide pH 2', 2], ['Base pH 12', 12]].forEach(function (x) { var b = MV.H('button', 'btn', x[0], row); b.onclick = function () { base = x[1]; upd(); }; });
          MV.slider(c, { label: 'dilution', min: 0, max: 4, value: 0 }, function (v) { d = v; upd(); if (v === 4) done(); });
          upd();
          MV.H('p', 'small', 'Le pH s\'approche de 7 sans le dépasser.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Une boisson gazeuse a un pH de 2,5.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Elle est :', o: ['acide', 'neutre', 'basique'], a: 0 },
            { type: 'opt', q: 'Étape 2. Si on la dilue, son pH :', o: ['augmente vers 7', 'diminue'], a: 0 },
            { type: 'opt', q: 'Étape 3. Peut-il dépasser 7 par dilution ?', o: ['non', 'oui'], a: 0, e: 'La solution reste acide, de moins en moins.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'pH = 12 : la solution est', o: ['basique', 'acide', 'neutre'], a: 0 },
      { lvl: 'Niveau 2', q: 'Lequel est le plus acide ?', o: ['pH 2', 'pH 5', 'pH 9'], a: 0 },
      { lvl: 'Niveau 3', q: 'Une solution de pH 4 est diluée. Son pH peut devenir :', o: ['5', '3', '9'], a: 0 },
      { lvl: 'Niveau 4', q: 'Le pH d\'une solution passe de 3 à 6. De combien d\'unités a-t-il augmenté ?', a: 3 }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'Le classement',
      hud: [['c', 'citron'], ['e', 'eau'], ['j', 'Javel']],
      draw: function (svg) { var e = {}; e.e = echelle(svg); return e; },
      steps: [
        { cap: 'Citron : pH ≈ 2,4, **acide**. Eau du robinet : pH ≈ 7, presque neutre.', hud: { c: ['acide'], e: ['≈ neutre'], j: '–' }, run: function (e) { e.e.set(2.4, 'citron'); } },
        { cap: 'Eau de Javel : pH ≈ 11,5, **basique** et corrosive.', ar: 'عصير الليمون حمضي، والماء تقريبا محايد، وماء جافيل قاعدي.', hud: { c: 'acide', e: '≈ neutre', j: ['basique'] }, run: function (e) { e.e.set(11.5, 'Javel'); } }
      ]
    },

    retenir: [
      'Le <b>pH</b> se mesure au papier pH ou au pH-mètre. <b>pH &lt; 7</b> : acide ; <b>pH = 7</b> : neutre ; <b>pH &gt; 7</b> : basique.',
      'La <b>dilution</b> rapproche le pH de 7. Les solutions concentrées sont <b>corrosives</b> : on se protège.'
    ],
    retenirAr: 'نقيس pH بورق pH أو بجهاز pH-mètre. إذا كان أصغر من 7 فالمحلول حمضي، وإذا ساوى 7 فهو محايد، وإذا كان أكبر من 7 فهو قاعدي. التخفيف يقرب pH من 7.',
    voc: [['une solution acide', 'محلول حمضي'], ['une solution basique', 'محلول قاعدي'], ['neutre', 'محايد'], ['diluer', 'يخفف'], ['corrosif', 'أكال']]
  });
})();
