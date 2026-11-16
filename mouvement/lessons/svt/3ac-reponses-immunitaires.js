/* @meta {"id":"3ac-reponses-immunitaires","level":"3","order":10,"theme":"Santé","title":"Les réponses immunitaires","ar":"الاستجابات المناعية","lead":"Une plaie profonde chez une personne non vaccinée contre le tétanos : le médecin injecte un sérum, et non un vaccin. Pourquoi ? Tout se lit sur la courbe des anticorps."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 44, Y0 = 180, W = 300, H = 150; // axes : temps 0 à 60 jours, anticorps 0 à 100

  function px(t, a) { return [X0 + t / 60 * W, Y0 - a / 100 * H]; }
  function primaire(t, t0) { var u = t - t0; return u < 0 ? 0 : 30 * Math.exp(-Math.pow((u - 14) / (u < 14 ? 5 : 8), 2)); }
  function secondaire(t, t0) { var u = t - t0; return u < 0 ? 0 : 95 * Math.exp(-Math.pow((u - 9) / (u < 9 ? 3 : 18), 2)); }
  function serum(t, t0) { var u = t - t0; return u < 0 ? 0 : 70 * Math.exp(-u / 8); }

  function graphe(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    S('path', { d: 'M' + X0 + ' ' + (Y0 - H - 6) + ' V' + Y0 + ' H' + (X0 + W + 6), stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, g);
    T(g, X0 + W, Y0 - 6, 'jours', 'tag', 'end'); T(g, X0 + 4, Y0 - H - 10, 'anticorps', 'tag', 'start');
    [0, 20, 40, 60].forEach(function (t) { T(g, px(t, 0)[0], Y0 + 16, t, 'tag'); });
    g.set = function (courbes) { // liste de [fonction, t0, couleur, étiquette]
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      courbes.forEach(function (cb) {
        var d = '';
        for (var t = 0; t <= 60; t += 0.5) { var p = px(t, cb[0](t, cb[1])); d += (d ? ' L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
        S('path', { d: d, fill: 'none', stroke: cb[2], 'stroke-width': 3 }, dyn);
        var m = px(cb[1], 0); S('line', { x1: m[0], y1: Y0, x2: m[0], y2: Y0 - H, stroke: cb[2], 'stroke-dasharray': '3 4', 'stroke-width': 1.2 }, dyn);
        T(dyn, m[0] + 4, Y0 - H + 12, cb[3], 'tag', 'start');
      });
    };
    return g;
  }
  var P1 = [primaire, 2, 'var(--acc)', '1er contact'], P2 = [secondaire, 32, '#7fb2ff', '2e contact'], SR = [serum, 10, '#f2c14e', 'sérum'];

  MV.lesson({
    id: '3ac-reponses-immunitaires',
    objectif: {
      fr: 'Distinguer réponse non spécifique et réponses spécifiques (anticorps, lymphocytes T), la réponse primaire et secondaire, et comparer vaccination et sérothérapie.',
      ar: 'التمييز بين الاستجابة غير النوعية والاستجابات النوعية (المضادات الجسمية، اللمفاويات T)، وبين الاستجابة الأولية والثانوية، والمقارنة بين التلقيح والاستمصال.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Une plaie et le tétanos',
      hud: [['s', 'situation'], ['d', 'décision'], ['q', 'pourquoi ?']],
      draw: function (svg) { var e = {}; e.g = graphe(svg); return e; },
      steps: [
        { cap: 'Une plaie profonde, souillée de terre : risque de **tétanos**.', hud: { s: ['plaie souillée'], d: '–', q: '–' }, run: function (e) { e.g.set([]); } },
        { cap: 'La personne n\'est **pas vaccinée**. Le médecin injecte un **sérum**.', hud: { s: 'non vaccinée', d: ['sérum'], q: '–' }, run: function (e) { e.g.set([]); } },
        { cap: 'Pourquoi un sérum et pas un vaccin ? On le saura à la fin.', hud: { s: 'non vaccinée', d: 'sérum', q: ['?'] }, run: function (e) { e.g.set([]); } }
      ]
    },

    prepare: [
      ['La phagocytose est une défense qui agit contre tous les microbes.', true, 'Elle n\'est pas spécifique.'],
      ['Un anticorps agit contre n\'importe quel microbe.', false, 'Chaque anticorps est spécifique d\'un antigène.'],
      ['Les lymphocytes sont des globules blancs.', true, 'Ils assurent la réponse spécifique.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'La mémoire immunitaire',
      hud: [['r', 'réponse'], ['a', 'acteurs'], ['c', 'caractère']],
      draw: function (svg) { var e = {}; e.g = graphe(svg); return e; },
      steps: [
        { cap: 'Réponse **non spécifique** : la **phagocytose**, rapide, contre tout intrus.', ar: 'الاستجابة غير النوعية: البلعمة، سريعة وموجهة ضد كل دخيل.', hud: { r: ['non spécifique'], a: 'phagocytes', c: 'immédiate' }, run: function (e) { e.g.set([]); } },
        { cap: 'Réponse **spécifique humorale** : les **lymphocytes B** produisent des **anticorps** qui neutralisent l\'**antigène**.', ar: 'الاستجابة النوعية الخلطية: اللمفاويات B تنتج مضادات أجسام تبطل مفعول مولد المضاد.', hud: { r: ['spécifique humorale'], a: ['lymphocytes B, anticorps'], c: 'un antigène précis' }, run: function (e) { e.g.set([P1]); } },
        { cap: 'Réponse **spécifique cellulaire** : les **lymphocytes T** détruisent les cellules infectées.', ar: 'الاستجابة النوعية الخلوية: اللمفاويات T تدمر الخلايا المصابة.', hud: { r: ['spécifique cellulaire'], a: ['lymphocytes T'], c: 'cellules infectées' }, run: function (e) { e.g.set([P1]); } },
        { cap: 'Au **1er contact**, la réponse est **lente et faible** (réponse primaire).', ar: 'عند الاتصال الأول تكون الاستجابة بطيئة وضعيفة.', hud: { r: ['primaire'], a: 'anticorps', c: 'lente, faible' }, run: function (e) { e.g.set([P1]); } },
        { cap: 'Au **2e contact**, grâce à la **mémoire**, elle est **rapide et forte** (réponse secondaire). C\'est le principe du **vaccin**.', ar: 'عند الاتصال الثاني، وبفضل الذاكرة المناعية، تكون الاستجابة سريعة وقوية: هذا مبدأ التلقيح.', hud: { r: ['secondaire'], a: 'cellules mémoire', c: ['rapide, forte'] }, run: function (e) { e.g.set([P1, P2]); } },
        { cap: 'Le **sérum** apporte des anticorps **tout faits** : effet **immédiat** mais **de courte durée**, sans mémoire.', ar: 'المصل يمنح مضادات أجسام جاهزة: مفعوله فوري لكنه قصير المدة وبدون ذاكرة.', hud: { r: ['sérothérapie'], a: 'anticorps tout faits', c: ['immédiat, court'] }, run: function (e) { e.g.set([SR]); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Compare : vaccin au jour 2 puis infection au jour 32, ou sérum au jour 10.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Courbes d\'anticorps' }, st);
          var gr = graphe(svg), vu = {}, set = MV.hud(c, [['m', 'méthode'], ['e', 'effet'], ['d', 'durée', 1]]), row = MV.H('div', 'row', '', c);
          var M = { 'Vaccin': [[P1, P2], 'protège avant l\'infection', 'longue (mémoire)'], 'Sérum': [[SR], 'soigne tout de suite', 'courte'] };
          Object.keys(M).forEach(function (k) { var b = MV.H('button', 'btn', k, row); b.onclick = function () { gr.set(M[k][0]); set('m', k); set('e', M[k][1]); set('d', M[k][2]); vu[k] = 1; if (vu.Vaccin && vu['Sérum']) done(); }; });
          gr.set([]); set('m', '–'); set('e', '–'); set('d', '–');
          MV.H('p', 'small', 'Essaie les deux.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Choisis la bonne méthode.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Pour protéger un bébé contre la rougeole pendant des années :', o: ['le vaccin', 'le sérum'], a: 0 },
            { type: 'opt', q: 'Étape 2. Après une morsure de serpent, il faut agir vite :', o: ['le sérum', 'le vaccin'], a: 0 },
            { type: 'opt', q: 'Étape 3. Le vaccin est efficace longtemps grâce :', o: ['aux cellules mémoire', 'aux anticorps injectés'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Les anticorps sont produits par :', o: ['les lymphocytes B', 'les globules rouges'], a: 0 },
      { lvl: 'Niveau 2', q: 'La réponse au 2e contact avec le même antigène est :', o: ['plus rapide et plus forte', 'plus lente'], a: 0 },
      { lvl: 'Niveau 3', q: 'La sérothérapie est :', o: ['curative et de courte durée', 'préventive et durable'], a: 0 },
      { lvl: 'Niveau 4', q: 'Sur le graphe, le 1er contact a lieu au jour 2 et le pic au jour 16. Combien de jours d\'attente ?', a: 14 }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'Sérum ou vaccin ?',
      hud: [['v', 'vaccin'], ['s', 'sérum'], ['c', 'choix']],
      draw: function (svg) { var e = {}; e.g = graphe(svg); return e; },
      steps: [
        { cap: 'Sans vaccin, une réponse primaire serait **trop lente** face au tétanos.', hud: { v: ['trop lent ici'], s: '–', c: '–' }, run: function (e) { e.g.set([P1]); } },
        { cap: 'Le **sérum** donne des anticorps **immédiatement**. On vaccinera ensuite pour une protection durable.', ar: 'المصل يمنح حماية فورية، ثم نلقح الشخص لحماية دائمة.', hud: { v: 'plus tard', s: ['immédiat'], c: ['sérum puis vaccin'] }, run: function (e) { e.g.set([SR]); } }
      ]
    },

    retenir: [
      'Réponse <b>non spécifique</b> : phagocytose. Réponses <b>spécifiques</b> : <b>humorale</b> (lymphocytes B, anticorps) et <b>cellulaire</b> (lymphocytes T). Au 2e contact, la <b>mémoire</b> rend la réponse rapide et forte.',
      '<b>Vaccination</b> : préventive, durable (mémoire). <b>Sérothérapie</b> : curative, immédiate, de courte durée (anticorps tout faits).'
    ],
    retenirAr: 'الاستجابة غير النوعية هي البلعمة. الاستجابات النوعية خلطية بواسطة اللمفاويات B ومضادات الأجسام، وخلوية بواسطة اللمفاويات T. التلقيح وقائي ودائم بفضل الذاكرة، والاستمصال علاجي وفوري وقصير المدة.',
    voc: [['un antigène', 'مولد المضاد'], ['un anticorps', 'مضاد الأجسام'], ['un lymphocyte', 'لمفاوية'], ['la vaccination', 'التلقيح'], ['la sérothérapie', 'الاستمصال']]
  });
})();
