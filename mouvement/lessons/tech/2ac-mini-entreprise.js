/* @meta {"id":"2ac-mini-entreprise","level":"2","order":13,"theme":"Entreprise","title":"Monter sa mini-entreprise","ar":"إنشاء مقاولة مصغرة","lead":"La classe veut fabriquer et vendre des porte-clés en bois pour financer une sortie. Par où commencer, combien coûte un porte-clés, et à quel prix le vendre ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, CR = 15, NV = 50;
  var ETAPES = ['idée', 'étude de marché', 'prototype', 'organisation', 'production', 'vente', 'bilan'];

  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function etapes(k) {
      ETAPES.forEach(function (e, i) {
        var x = 10 + (i % 4) * 86, y = 30 + Math.floor(i / 4) * 80, on = i === k, done = i < k;
        S('rect', { x: x, y: y, width: 78, height: 50, rx: 10, fill: on ? 'var(--acc-bg)' : '#1d1f22', stroke: on ? 'var(--acc)' : done ? '#56d07f' : '#5b6068', 'stroke-width': 2 }, dyn);
        T(dyn, x + 39, y + 22, String(i + 1), 'lbl');
        var t = T(dyn, x + 39, y + 40, e, 'tag'); t.style.fontSize = '8px';
      });
      T(dyn, 180, 196, 'chacun a un rôle : production, vente, finance…', 'tag');
    }
    function cout(p) {
      var parts = [['matières', 8, '#c87533'], ['main-d’œuvre', 5, '#7fb2ff'], ['autres frais', 2, '#9aa0a8']], y = 160, s = 6;
      parts.forEach(function (q) {
        S('rect', { x: 60, y: y - q[1] * s, width: 60, height: q[1] * s, fill: q[2] }, dyn);
        T(dyn, 128, y - q[1] * s / 2 + 4, q[0] + ' ' + q[1] + ' DH', 'tag', 'start');
        y -= q[1] * s;
      });
      T(dyn, 90, 182, 'coût de revient 15 DH', 'tag');
      if (p) {
        var b = p - CR, col = b > 0 ? '#56d07f' : '#e5484d';
        S('rect', { x: 250, y: 160 - p * s, width: 60, height: p * s, fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2, 'stroke-dasharray': '4 3' }, dyn);
        S('rect', { x: 250, y: 160 - CR * s, width: 60, height: CR * s, fill: '#3a3d42' }, dyn);
        if (b > 0) S('rect', { x: 250, y: 160 - p * s, width: 60, height: b * s, fill: col }, dyn);
        T(dyn, 280, 182, 'prix de vente ' + p + ' DH', 'tag');
        var t = T(dyn, 280, Math.max(14, 160 - p * s - 6), (b >= 0 ? 'bénéfice ' : 'perte ') + Math.abs(b) + ' DH', 'tag'); t.style.fill = col;
      }
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.k != null) etapes(o.k); else cout(o.p);
    };
    return g;
  }

  MV.lesson({
    id: '2ac-mini-entreprise',
    objectif: {
      fr: 'Ordonner les étapes d’une mini-entreprise, calculer un coût de revient, fixer un prix de vente et calculer le bénéfice.',
      ar: 'ترتيب مراحل المقاولة المصغرة، وحساب سعر التكلفة، وتحديد سعر البيع، وحساب الربح.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Les porte-clés',
      hud: [['p', 'projet'], ['q', 'questions']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'La classe veut **fabriquer et vendre** des porte-clés en bois.', hud: { p: ['porte-clés'], q: '–' }, run: function (e) { e.s.set({ k: 0 }); } },
        { cap: 'Combien **coûte** un porte-clés ?', hud: { p: 'porte-clés', q: ['coût ?'] }, run: function (e) { e.s.set({}); } },
        { cap: 'À quel **prix** le vendre pour gagner de l’argent ?', hud: { p: 'porte-clés', q: ['prix ?'] }, run: function (e) { e.s.set({ p: 20 }); } }
      ]
    },

    prepare: [
      ['Avant de produire, on vérifie que des clients veulent le produit.', true, 'C’est l’étude de marché.'],
      ['Le bénéfice est le prix de vente.', false, 'Bénéfice = prix de vente − coût de revient.'],
      ['Dans une mini-entreprise, chaque élève a un rôle.', true, 'Production, vente, finance, communication…']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Étapes et calculs',
      hud: [['n', 'notion'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'On part d’une **idée**, puis l’**étude de marché** : qui achètera, à quel prix ?', ar: 'نبدأ بفكرة ثم دراسة السوق: من سيشتري وبأي ثمن؟', hud: { n: ['idée, marché'], v: 'étapes 1 et 2' }, run: function (e) { e.s.set({ k: 1 }); } },
        { cap: 'On fabrique un **prototype**, on répartit les **rôles**, puis on **produit**.', ar: 'نصنع نموذجا أوليا، ونوزع الأدوار، ثم ننتج.', hud: { n: ['prototype, rôles'], v: 'étapes 3 à 5' }, run: function (e) { e.s.set({ k: 4 }); } },
        { cap: 'On **vend**, puis on fait le **bilan** : a-t-on gagné de l’argent ?', ar: 'نبيع ثم نقوم بالحصيلة: هل ربحنا؟', hud: { n: ['vente, bilan'], v: 'étapes 6 et 7' }, run: function (e) { e.s.set({ k: 6 }); } },
        { cap: '**Coût de revient** = matières + main-d’œuvre + autres frais = 8 + 5 + 2 = **15 DH**.', ar: 'سعر التكلفة = المواد + اليد العاملة + مصاريف أخرى = [[15 DH]].', hud: { n: ['coût de revient'], v: ['15 DH'] }, run: function (e) { e.s.set({}); } },
        { cap: 'Vendu **20 DH** : **bénéfice** = 20 − 15 = **5 DH** par porte-clés.', ar: 'بسعر [[20 DH]]: الربح = [[20 − 15 = 5 DH]] للقطعة.', hud: { n: ['bénéfice'], v: ['5 DH'] }, run: function (e) { e.s.set({ p: 20 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis le prix de vente. Les 50 porte-clés doivent rapporter 250 DH de bénéfice.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Coût de revient et prix de vente' }, st);
          var s = scene(svg), set = MV.hud(c, [['p', 'prix'], ['u', 'par pièce'], ['b', 'bénéfice total', 1]]);
          MV.slider(c, { label: 'prix', min: 10, max: 26, value: 12, fmt: function (v) { return v + ' DH'; } }, function (p) {
            var b = p - CR; s.set({ p: p }); set('p', p + ' DH'); set('u', b + ' DH'); set('b', b * NV + ' DH'); if (b * NV === 250) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Coût de revient : 15 DH ; 50 porte-clés vendus.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Des marque-pages en carton.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Matières 8 DH, main-d’œuvre 5 DH, autres 2 DH. Coût de revient (DH) ?', a: 15 },
            { q: 'Étape 2. Prix de vente 20 DH. Bénéfice par pièce (DH) ?', a: 5 },
            { q: 'Étape 3. 60 pièces vendues. Bénéfice total (DH) ?', a: 300 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'La première étape d’une mini-entreprise est :', o: ['trouver une idée de produit', 'vendre le produit'], a: 0 },
      { lvl: 'Niveau 2', q: 'L’étude de marché sert à :', o: ['connaître les clients et les prix', 'fabriquer le produit'], a: 0 },
      { lvl: 'Niveau 3', q: 'Coût de revient 12 DH, prix de vente 18 DH, 40 pièces vendues. Bénéfice total (DH) ?', a: 240 },
      { lvl: 'Niveau 4', q: 'Le matériel a coûté 600 DH. On gagne 5 DH par pièce vendue. Combien de pièces pour rembourser le matériel ?', a: 120 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le projet de la classe',
      hud: [['p', 'projet'], ['q', 'résultat']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Sept étapes, de l’**idée** au **bilan**, chacun avec son rôle.', hud: { p: 'porte-clés', q: ['7 étapes'] }, run: function (e) { e.s.set({ k: 6 }); } },
        { cap: 'Coût de revient 15 DH, vente 20 DH : **250 DH** de bénéfice pour 50 porte-clés.', ar: 'سعر التكلفة 15 والبيع 20: ربح [[250 DH]] لخمسين قطعة.', hud: { p: '50 vendus', q: ['250 DH'] }, run: function (e) { e.s.set({ p: 20 }); } }
      ]
    },

    retenir: [
      'Étapes : <b>idée → étude de marché → prototype → organisation → production → vente → bilan</b>. Chaque membre a un rôle.',
      '<b class="mono">Coût de revient = matières + main-d’œuvre + autres frais</b>. <b class="mono">Bénéfice = prix de vente − coût de revient</b> (par pièce), multiplié par le nombre vendu.'
    ],
    retenirAr: 'مراحل المقاولة المصغرة: الفكرة، دراسة السوق، النموذج، التنظيم، الإنتاج، البيع، الحصيلة. سعر التكلفة = المواد + اليد العاملة + مصاريف أخرى، والربح = سعر البيع − سعر التكلفة.',
    voc: [['une mini-entreprise', 'مقاولة مصغرة'], ['l’étude de marché', 'دراسة السوق'], ['le coût de revient', 'سعر التكلفة'], ['le prix de vente', 'سعر البيع'], ['le bénéfice', 'الربح']]
  });
})();
