/* @meta {"id":"2ac-marche","level":"2","order":11,"theme":"Entreprise","title":"Marché, offre et demande","ar":"السوق، العرض والطلب","lead":"Au souk, le prix des oranges baisse quand elles arrivent en masse et monte quand elles se font rares. Qui fixe le prix ? La rencontre de l’offre et de la demande."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  function dem(p) { return Math.max(0, 100 - p); }
  function off(p) { return p; }
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    var X0 = 60, Y0 = 176, K = 1.5;
    function X(q) { return X0 + q * 2.6; } function Y(p) { return Y0 - p * K; }
    function graphe(p) {
      S('path', { d: 'M' + X0 + ' ' + Y0 + 'H' + X(105) + 'M' + X0 + ' ' + Y0 + 'V' + Y(105), stroke: '#5b6068', 'stroke-width': 1.5 }, dyn);
      T(dyn, X0 - 6, Y(100) + 4, 'prix', 'tag', 'end'); T(dyn, X(105), Y0 + 18, 'quantité', 'tag', 'end');
      S('line', { x1: X(100), y1: Y(0), x2: X(0), y2: Y(100), stroke: '#7fb2ff', 'stroke-width': 3 }, dyn);
      S('line', { x1: X(0), y1: Y(0), x2: X(100), y2: Y(100), stroke: '#f2c14e', 'stroke-width': 3 }, dyn);
      T(dyn, X(96), Y(18), 'demande', 'tag', 'end'); T(dyn, X(96), Y(86), 'offre', 'tag', 'end');
      if (p == null) return;
      var d = dem(p), o = off(p);
      S('line', { x1: X0, y1: Y(p), x2: X(Math.max(d, o)), y2: Y(p), stroke: '#e9e9ea', 'stroke-width': 1, 'stroke-dasharray': '4 3' }, dyn);
      S('circle', { cx: X(d), cy: Y(p), r: 6, fill: '#7fb2ff' }, dyn);
      S('circle', { cx: X(o), cy: Y(p), r: 6, fill: '#f2c14e' }, dyn);
      T(dyn, X0 - 6, Y(p) + 4, p + ' DH', 'tag', 'end');
      var eq = d === o;
      T(dyn, 190, 14, eq ? 'équilibre : offre = demande' : d > o ? 'pénurie : le prix va monter' : 'surplus : le prix va baisser', 'tag');
      if (eq) S('circle', { cx: X(50), cy: Y(50), r: 12, fill: 'none', stroke: '#56d07f', 'stroke-width': 2.5 }, dyn);
    }
    function biens(hot) {
      [['bien', 'vélo, pain', 'il se touche'], ['service', 'transport, cours', 'il ne se stocke pas']].forEach(function (b, i) {
        var x = 14 + i * 174, on = hot === i;
        S('rect', { x: x, y: 24, width: 158, height: 80, rx: 10, fill: on ? 'var(--acc-bg)' : '#1d1f22', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 2 }, dyn);
        T(dyn, x + 79, 52, b[0], 'lbl'); T(dyn, x + 79, 74, b[1], 'tag'); T(dyn, x + 79, 92, b[2], 'tag');
      });
      [['client', 'il achète'], ['utilisateur', 'il s’en sert'], ['consommateur', 'il le consomme']].forEach(function (b, i) {
        var x = 14 + i * 116, on = hot === i + 2;
        S('rect', { x: x, y: 122, width: 104, height: 64, rx: 10, fill: on ? 'var(--acc-bg)' : '#1d1f22', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 2 }, dyn);
        T(dyn, x + 52, 150, b[0], 'lbl'); T(dyn, x + 52, 170, b[1], 'tag');
      });
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.b != null) biens(o.b); else graphe(o.p);
    };
    return g;
  }

  MV.lesson({
    id: '2ac-marche',
    objectif: {
      fr: 'Distinguer bien et service, client, utilisateur et consommateur ; comprendre comment l’offre et la demande fixent le prix d’équilibre d’un marché.',
      ar: 'التمييز بين السلعة والخدمة، وبين الزبون والمستعمل والمستهلك؛ وفهم كيف يحدد العرض والطلب سعر التوازن.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Au souk',
      hud: [['o', 'oranges'], ['p', 'prix']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Les oranges arrivent **en masse** au souk.', hud: { o: ['beaucoup'], p: ['baisse'] }, run: function (e) { e.s.set({ p: 70 }); } },
        { cap: 'Elles deviennent **rares** : le prix monte.', hud: { o: ['peu'], p: ['monte'] }, run: function (e) { e.s.set({ p: 30 }); } },
        { cap: 'Où le prix se **stabilise**-t-il ?', hud: { o: '?', p: '?' }, run: function (e) { e.s.set({}); } }
      ]
    },

    prepare: [
      ['Quand un produit devient plus cher, on en achète en général moins.', true, 'La demande diminue.'],
      ['Un cours de soutien est un bien qu’on peut stocker.', false, 'C’est un service.'],
      ['Le client et l’utilisateur peuvent être deux personnes différentes.', true, 'Un parent achète un jouet utilisé par son enfant.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Le marché',
      hud: [['n', 'notion'], ['v', 'exemple']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Un **bien** se touche et se stocke ; un **service** est une action rendue à quelqu’un.', ar: 'السلعة تلمس وتخزن، والخدمة عمل يقدم لشخص.', hud: { n: ['bien, service'], v: 'vélo / transport' }, run: function (e) { e.s.set({ b: 0 }); } },
        { cap: '**Client** : il achète. **Utilisateur** : il s’en sert. **Consommateur** : il le consomme.', ar: 'الزبون يشتري، والمستعمل يستعمل، والمستهلك يستهلك.', hud: { n: ['client, utilisateur'], v: 'parent / enfant' }, run: function (e) { e.s.set({ b: 2 }); } },
        { cap: 'La **demande** : ce que les clients veulent acheter. Elle **baisse** quand le prix monte.', ar: 'الطلب: ما يريد الزبناء شراءه، وينخفض عندما يرتفع السعر.', hud: { n: ['demande'], v: 'prix ↑ → demande ↓' }, run: function (e) { e.s.set({ p: 70 }); } },
        { cap: 'L’**offre** : ce que les vendeurs proposent. Elle **monte** avec le prix.', ar: 'العرض: ما يقترحه البائعون، ويرتفع مع السعر.', hud: { n: ['offre'], v: 'prix ↑ → offre ↑' }, run: function (e) { e.s.set({ p: 70 }); } },
        { cap: '**Équilibre** : l’offre égale la demande. Ici, **50 DH** pour 50 caisses.', ar: 'التوازن: العرض يساوي الطلب، هنا [[50 DH]].', hud: { n: ['équilibre'], v: ['50 DH'] }, run: function (e) { e.s.set({ p: 50 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change le prix d’une caisse d’oranges. Trouve le prix d’équilibre.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Offre et demande' }, st);
          var s = scene(svg), set = MV.hud(c, [['p', 'prix'], ['d', 'demande'], ['o', 'offre'], ['e', 'marché', 1]]);
          MV.slider(c, { label: 'prix', min: 10, max: 90, step: 5, value: 80, fmt: function (v) { return v + ' DH'; } }, function (p) {
            var d = dem(p), o = off(p); s.set({ p: p }); set('p', p + ' DH'); set('d', d + ' caisses'); set('o', o + ' caisses'); set('e', d === o ? 'équilibre' : d > o ? 'pénurie' : 'surplus'); if (d === o) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Demande = 100 − prix ; offre = prix.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Le marché des oranges.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Un cours de soutien est :', o: ['un service', 'un bien'], a: 0 },
            { type: 'opt', q: 'Étape 2. Si le prix monte, la demande :', o: ['diminue', 'augmente'], a: 0 },
            { q: 'Étape 3. Prix 30 DH, demande = 100 − 30. Demande (caisses) ?', a: 70 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un vélo est :', o: ['un bien', 'un service'], a: 0 },
      { lvl: 'Niveau 2', q: 'Un parent achète un jouet pour son enfant. Le client est :', o: ['le parent', 'l’enfant'], a: 0 },
      { lvl: 'Niveau 3', q: 'Quand l’offre dépasse la demande, le prix a tendance à :', o: ['baisser', 'monter'], a: 0 },
      { lvl: 'Niveau 4', q: 'Demande = 120 − p, offre = 2 × p. Prix d’équilibre (DH) ?', a: 40, hint: '120 − p = 2p' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le prix d’équilibre',
      hud: [['o', 'oranges'], ['p', 'prix']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Trop d’oranges : **surplus**, le prix baisse. Trop peu : **pénurie**, le prix monte.', hud: { o: 'surplus / pénurie', p: ['bouge'] }, run: function (e) { e.s.set({ p: 70 }); } },
        { cap: 'Le prix se stabilise à l’**équilibre** : offre = demande.', ar: 'يستقر السعر عند التوازن: العرض يساوي الطلب.', hud: { o: '50 caisses', p: ['50 DH'] }, run: function (e) { e.s.set({ p: 50 }); } }
      ]
    },

    retenir: [
      'Un <b>bien</b> est matériel, un <b>service</b> est une action. Le <b>client</b> achète, l’<b>utilisateur</b> se sert du produit, le <b>consommateur</b> le consomme.',
      'La <b>demande</b> baisse quand le prix monte ; l’<b>offre</b> monte avec le prix. Le <b>prix d’équilibre</b> est celui où l’offre égale la demande.'
    ],
    retenirAr: 'السلعة مادية والخدمة عمل. الطلب ينخفض عندما يرتفع السعر، والعرض يرتفع معه. سعر التوازن هو الذي يتساوى عنده العرض والطلب.',
    voc: [['un bien', 'سلعة'], ['un service', 'خدمة'], ['l’offre', 'العرض'], ['la demande', 'الطلب'], ['le prix d’équilibre', 'سعر التوازن']]
  });
})();
