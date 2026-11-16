/* @meta {"id":"3ac-tests-ions","level":"3","order":6,"theme":"Les matériaux","title":"Tests d'identification de quelques ions","ar":"الكشف عن بعض الأيونات","lead":"Trois flacons sans étiquette, une seule goutte de réactif, et chaque solution trahit ses ions par la couleur de son précipité."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  // ion -> [réactif, couleur du précipité, nom de la couleur]
  var ION = {
    'Cu²⁺': ['soude', '#3d8fd6', 'bleu'], 'Fe²⁺': ['soude', '#5f8f4a', 'vert'], 'Fe³⁺': ['soude', '#b5622a', 'rouille'],
    'Zn²⁺': ['soude', '#f2f2f2', 'blanc'], 'Cl⁻': ['nitrate d\'argent', '#e9e9ea', 'blanc, noircit à la lumière']
  };

  function tube(svg, x) {
    var g = S('g', { 'data-keep': 1 }, svg);
    var liq = S('path', { d: 'M' + (x - 18) + ' 90 V170 a18 18 0 0 0 36 0 V90 Z', fill: 'rgba(127,178,255,.25)' }, g);
    S('path', { d: 'M' + (x - 20) + ' 40 V170 a20 20 0 0 0 40 0 V40', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2.5 }, g);
    var pr = S('g', {}, g), goutte = S('path', { d: 'M' + x + ' 18 q-6 10 0 14 q6 -4 0 -14 z', fill: '#e9e9ea' }, g);
    var ti = T(g, x, 212, '', 'tag'); goutte.style.opacity = 0;
    g.set = function (ion, react) { // react : réactif ajouté ou null
      while (pr.firstChild) pr.removeChild(pr.firstChild);
      ti.textContent = ion || ''; goutte.style.opacity = react ? 1 : 0;
      var ok = ion && react && ION[ion][0] === react;
      if (ok) for (var i = 0; i < 22; i++) S('circle', { cx: x - 14 + (i * 13) % 28, cy: 135 + (i * 7) % 48, r: 3.2, fill: ION[ion][1] }, pr);
      liq.setAttribute('fill', ion === 'Cu²⁺' ? 'rgba(80,150,230,.35)' : ion === 'Fe³⁺' ? 'rgba(220,170,80,.35)' : ion === 'Fe²⁺' ? 'rgba(150,200,140,.3)' : 'rgba(127,178,255,.2)');
      return ok;
    };
    return g;
  }

  MV.lesson({
    id: '3ac-tests-ions',
    objectif: {
      fr: 'Identifier les ions Cu²⁺, Fe²⁺, Fe³⁺, Zn²⁺ avec la soude et l\'ion Cl⁻ avec le nitrate d\'argent, par la couleur du précipité.',
      ar: 'الكشف عن الأيونات [[Cu²⁺]] و [[Fe²⁺]] و [[Fe³⁺]] و [[Zn²⁺]] بمحلول الصودا، وعن الأيون [[Cl⁻]] بمحلول نترات الفضة، بواسطة لون الراسب.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'Trois flacons sans étiquette',
      hud: [['f', 'flacons'], ['i', 'indice'], ['q', 'quels ions ?']],
      draw: function (svg) { var e = {}; e.a = tube(svg, 80); e.b = tube(svg, 180); e.c = tube(svg, 280); return e; },
      steps: [
        { cap: 'Trois **flacons** ont perdu leur étiquette.', hud: { f: ['3'], i: '–', q: '–' }, run: function (e) { e.a.set(null); e.b.set(null); e.c.set(null); } },
        { cap: 'On sait qu\'ils contiennent des ions **cuivre**, **fer III** et **zinc**.', hud: { f: '3', i: ['Cu²⁺, Fe³⁺, Zn²⁺'], q: '–' }, run: function (e) { e.a.set(null); e.b.set(null); e.c.set(null); } },
        { cap: 'Comment savoir lequel est lequel ? On le saura à la fin.', hud: { f: '3', i: 'Cu²⁺, Fe³⁺, Zn²⁺', q: ['?'] }, run: function (e) { e.a.set(null); e.b.set(null); e.c.set(null); } }
      ]
    },

    prepare: [
      ['Un ion est un atome ou un groupe d\'atomes qui porte une charge.', true, 'Positive (cation) ou négative (anion).'],
      ['Une solution ionique est toujours colorée.', false, 'Beaucoup sont incolores, comme l\'eau salée.'],
      ['Un précipité est un solide qui se forme dans une solution.', true, 'Il trouble la solution.']
    ],

    regarde: {
      vb: '0 0 360 220', label: 'Les tests',
      hud: [['i', 'ion'], ['r', 'réactif'], ['p', 'précipité']],
      draw: function (svg) { var e = {}; e.t = tube(svg, 180); return e; },
      steps: [
        { cap: 'On ajoute quelques gouttes de **soude** à une solution d\'ions **Cu²⁺** : précipité **bleu**.', ar: 'نضيف قطرات من محلول الصودا إلى محلول أيونات النحاس فيتكون راسب أزرق.', hud: { i: ['Cu²⁺'], r: 'soude', p: ['bleu'] }, run: function (e) { e.t.set('Cu²⁺', 'soude'); } },
        { cap: 'Avec les ions **Fe²⁺** : précipité **vert**.', ar: 'مع أيونات الحديد II: راسب أخضر.', hud: { i: ['Fe²⁺'], r: 'soude', p: ['vert'] }, run: function (e) { e.t.set('Fe²⁺', 'soude'); } },
        { cap: 'Avec les ions **Fe³⁺** : précipité **rouille**.', ar: 'مع أيونات الحديد III: راسب بني.', hud: { i: ['Fe³⁺'], r: 'soude', p: ['rouille'] }, run: function (e) { e.t.set('Fe³⁺', 'soude'); } },
        { cap: 'Avec les ions **Zn²⁺** : précipité **blanc**.', ar: 'مع أيونات الزنك: راسب أبيض.', hud: { i: ['Zn²⁺'], r: 'soude', p: ['blanc'] }, run: function (e) { e.t.set('Zn²⁺', 'soude'); } },
        { cap: 'L\'ion **chlorure Cl⁻** se repère avec le **nitrate d\'argent** : précipité blanc qui **noircit** à la lumière.', ar: 'نكشف عن أيون الكلورور بنترات الفضة: راسب أبيض يسود في الضوء.', hud: { i: ['Cl⁻'], r: ['nitrate d\'argent'], p: 'blanc, noircit' }, run: function (e) { e.t.set('Cl⁻', 'nitrate d\'argent'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis un ion, puis un réactif. Repère les couleurs.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 220', role: 'img', 'aria-label': 'Tube à essai' }, st);
          var t = tube(svg, 180), ion = 'Cu²⁺', vu = {}, set = MV.hud(c, [['i', 'ion'], ['r', 'réactif'], ['p', 'précipité', 1]]);
          var r1 = MV.H('div', 'row', '', c), r2 = MV.H('div', 'row', '', c);
          Object.keys(ION).forEach(function (k) { var b = MV.H('button', 'btn', k, r1); b.onclick = function () { ion = k; t.set(ion, null); set('i', ion); set('r', '–'); set('p', '–'); }; });
          ['soude', 'nitrate d\'argent'].forEach(function (r) { var b = MV.H('button', 'btn', 'Ajouter ' + r, r2); b.onclick = function () { var ok = t.set(ion, r); set('r', r); set('p', ok ? ION[ion][2] : 'rien'); if (ok) vu[ion] = 1; if (Object.keys(vu).length >= 3) done(); }; });
          t.set(ion, null); set('i', ion);
          MV.H('p', 'small', 'Obtiens au moins trois précipités différents.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Une solution donne un précipité rouille avec la soude, et un précipité blanc qui noircit avec le nitrate d\'argent.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Le précipité rouille révèle :', o: ['Fe³⁺', 'Cu²⁺', 'Zn²⁺'], a: 0 },
            { type: 'opt', q: 'Étape 2. Le second test révèle :', o: ['Cl⁻', 'Fe²⁺'], a: 0 },
            { type: 'opt', q: 'Étape 3. La solution contient donc :', o: ['du chlorure de fer III', 'du chlorure de cuivre'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Précipité bleu avec la soude :', o: ['Cu²⁺', 'Fe²⁺', 'Zn²⁺'], a: 0 },
      { lvl: 'Niveau 2', q: 'Précipité vert avec la soude :', o: ['Fe²⁺', 'Fe³⁺'], a: 0 },
      { lvl: 'Niveau 3', q: 'Pour détecter l\'ion chlorure, on utilise :', o: ['le nitrate d\'argent', 'la soude'], a: 0 },
      { lvl: 'Niveau 4', q: 'Un ion Fe³⁺ a perdu combien d\'électrons par rapport à l\'atome de fer ?', a: 3 }
    ],

    bilan: {
      vb: '0 0 360 220', label: 'Les trois flacons',
      hud: [['a', 'flacon 1'], ['b', 'flacon 2'], ['c', 'flacon 3']],
      draw: function (svg) { var e = {}; e.a = tube(svg, 80); e.b = tube(svg, 180); e.c = tube(svg, 280); return e; },
      steps: [
        { cap: 'Une goutte de **soude** dans chaque flacon.', hud: { a: '?', b: '?', c: '?' }, run: function (e) { e.a.set('Cu²⁺', 'soude'); e.b.set('Fe³⁺', 'soude'); e.c.set('Zn²⁺', 'soude'); } },
        { cap: 'Bleu : **Cu²⁺**. Rouille : **Fe³⁺**. Blanc : **Zn²⁺**. Les flacons sont identifiés.', ar: 'الأزرق للنحاس، والبني للحديد III، والأبيض للزنك.', hud: { a: ['Cu²⁺'], b: ['Fe³⁺'], c: ['Zn²⁺'] }, run: function (e) { e.a.set('Cu²⁺', 'soude'); e.b.set('Fe³⁺', 'soude'); e.c.set('Zn²⁺', 'soude'); } }
      ]
    },

    retenir: [
      'Avec la <b>soude</b> : Cu²⁺ donne un précipité <b>bleu</b>, Fe²⁺ <b>vert</b>, Fe³⁺ <b>rouille</b>, Zn²⁺ <b>blanc</b>.',
      'Avec le <b>nitrate d\'argent</b> : Cl⁻ donne un précipité <b>blanc qui noircit</b> à la lumière.'
    ],
    retenirAr: 'مع محلول الصودا: النحاس II يعطي راسبا أزرق، والحديد II أخضر، والحديد III بنيا، والزنك أبيض. مع نترات الفضة: الكلورور يعطي راسبا أبيض يسود في الضوء.',
    voc: [['un ion', 'أيون'], ['un précipité', 'راسب'], ['un réactif', 'كاشف'], ['le nitrate d\'argent', 'نترات الفضة']]
  });
})();
