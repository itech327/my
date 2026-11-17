/* @meta {"id":"2ac-entreprise","level":"2","order":12,"theme":"Entreprise","title":"L’entreprise et ses secteurs","ar":"المقاولة وقطاعاتها","lead":"La sardine pêchée à Agadir est mise en boîte dans une usine, puis vendue dans une épicerie. Trois entreprises, trois secteurs d’activité. Et dans chaque entreprise, plusieurs services."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var SECT = [['primaire', 'prendre à la nature'], ['secondaire', 'transformer'], ['tertiaire', 'rendre un service']];
  var ACT = { 'Pêche à Agadir': 0, 'Extraction des phosphates': 0, 'Usine automobile à Tanger': 1, 'Conserverie de sardines': 1, 'Banque': 2, 'Épicerie': 2 };
  var FONC = [['production', 'fabriquer'], ['commerciale', 'acheter, vendre'], ['financière', 'payer, compter'], ['ressources humaines', 'embaucher']];

  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function secteurs(list, hot) {
      SECT.forEach(function (s, i) {
        var x = 8 + i * 118;
        S('rect', { x: x, y: 12, width: 110, height: 186, rx: 10, fill: '#17181a', stroke: ['#56d07f', '#f2c14e', '#7fb2ff'][i], 'stroke-width': 2 }, dyn);
        T(dyn, x + 55, 34, s[0], 'lbl'); T(dyn, x + 55, 52, s[1], 'tag').style.fontSize = '9px';
        var k = 0;
        list.forEach(function (a) {
          if (ACT[a] !== i) return;
          var y = 64 + k++ * 40, on = a === hot;
          S('rect', { x: x + 6, y: y, width: 98, height: 32, rx: 6, fill: on ? 'var(--acc-bg)' : '#26292d', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 1.5 }, dyn);
          var w = a.split(' '), l1 = w.slice(0, Math.ceil(w.length / 2)).join(' '), l2 = w.slice(Math.ceil(w.length / 2)).join(' ');
          var t1 = T(dyn, x + 55, y + (l2 ? 14 : 20), l1, 'tag'); t1.style.fontSize = '9px';
          if (l2) { var t2 = T(dyn, x + 55, y + 26, l2, 'tag'); t2.style.fontSize = '9px'; }
        });
      });
    }
    function fonctions(hot) {
      S('rect', { x: 130, y: 14, width: 100, height: 34, rx: 8, fill: '#1d1f22', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
      T(dyn, 180, 36, 'direction', 'lbl');
      S('path', { d: 'M180 48V66M47 66H313M47 66V80M136 66V80M224 66V80M313 66V80', stroke: '#9aa0a8', 'stroke-width': 1.5, fill: 'none' }, dyn);
      FONC.forEach(function (f, i) {
        var x = 4 + i * 88, on = hot === i;
        S('rect', { x: x, y: 80, width: 84, height: 70, rx: 8, fill: on ? 'var(--acc-bg)' : '#1d1f22', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 2 }, dyn);
        var w = f[0].split(' ');
        T(dyn, x + 42, 104, w[0], 'tag'); if (w[1]) T(dyn, x + 42, 118, w[1], 'tag');
        var t = T(dyn, x + 42, 140, f[1], 'tag'); t.style.fontSize = '9px';
      });
      T(dyn, 180, 180, 'des fonctions qui travaillent ensemble', 'tag');
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.f != null) fonctions(o.f); else secteurs(o.list || [], o.hot);
    };
    return g;
  }

  MV.lesson({
    id: '2ac-entreprise',
    objectif: {
      fr: 'Classer une entreprise dans le secteur primaire, secondaire ou tertiaire, et citer les principales fonctions d’une entreprise (production, commerciale, financière, ressources humaines).',
      ar: 'تصنيف مقاولة في القطاع الأول أو الثاني أو الثالث، وذكر الوظائف الرئيسية للمقاولة.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Le voyage de la sardine',
      hud: [['e', 'étape'], ['s', 'secteur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'La sardine est **pêchée** à Agadir.', hud: { e: ['pêche'], s: '?' }, run: function (e) { e.s.set({ list: ['Pêche à Agadir'] }); } },
        { cap: 'Elle est mise en boîte dans une **conserverie**.', hud: { e: ['usine'], s: '?' }, run: function (e) { e.s.set({ list: ['Pêche à Agadir', 'Conserverie de sardines'] }); } },
        { cap: 'Puis **vendue** à l’épicerie. Trois entreprises, trois **secteurs**.', hud: { e: ['vente'], s: ['3 secteurs'] }, run: function (e) { e.s.set({ list: ['Pêche à Agadir', 'Conserverie de sardines', 'Épicerie'] }); } }
      ]
    },

    prepare: [
      ['Une entreprise produit des biens ou des services.', true, 'Pour les vendre à des clients.'],
      ['Un agriculteur travaille dans le secteur tertiaire.', false, 'Il prend à la nature : secteur primaire.'],
      ['Dans une entreprise, tout le monde fait le même travail.', false, 'Les tâches sont réparties entre plusieurs fonctions.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Secteurs et fonctions',
      hud: [['n', 'notion'], ['v', 'exemple']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Secteur **primaire** : prendre les ressources à la **nature** (pêche, agriculture, mines).', ar: 'القطاع الأول: استغلال موارد الطبيعة.', hud: { n: ['primaire'], v: 'pêche, phosphates' }, run: function (e) { e.s.set({ list: ['Pêche à Agadir', 'Extraction des phosphates'] }); } },
        { cap: 'Secteur **secondaire** : **transformer** en produits (industrie).', ar: 'القطاع الثاني: تحويل المواد إلى منتجات.', hud: { n: ['secondaire'], v: 'usine automobile' }, run: function (e) { e.s.set({ list: ['Pêche à Agadir', 'Extraction des phosphates', 'Usine automobile à Tanger', 'Conserverie de sardines'] }); } },
        { cap: 'Secteur **tertiaire** : rendre des **services** (commerce, banque, santé, transport).', ar: 'القطاع الثالث: تقديم الخدمات.', hud: { n: ['tertiaire'], v: 'banque, épicerie' }, run: function (e) { e.s.set({ list: Object.keys(ACT) }); } },
        { cap: 'Dans l’entreprise : **production** fabrique, la fonction **commerciale** achète et vend.', ar: 'داخل المقاولة: الإنتاج يصنع، والوظيفة التجارية تشتري وتبيع.', hud: { n: ['fonctions'], v: 'production, commerciale' }, run: function (e) { e.s.set({ f: 1 }); } },
        { cap: 'La fonction **financière** paie et compte ; les **ressources humaines** embauchent et forment.', ar: 'الوظيفة المالية تؤدي وتحسب، والموارد البشرية توظف وتكون.', hud: { n: 'fonctions', v: ['finance, RH'] }, run: function (e) { e.s.set({ f: 3 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Range chaque entreprise dans son secteur.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Secteurs d’activité' }, st);
          var s = scene(svg), set = MV.hud(c, [['a', 'entreprise'], ['s', 'secteur', 1], ['n', 'rangées']]), list = [];
          var row = MV.H('div', 'row', '', c), CH = ['Pêche à Agadir', 'Usine automobile à Tanger', 'Banque', 'Extraction des phosphates'];
          CH.forEach(function (a) {
            MV.H('button', 'btn', a, row).onclick = function () {
              if (list.indexOf(a) < 0) list.push(a);
              s.set({ list: list, hot: a }); set('a', a); set('s', SECT[ACT[a]][0]); set('n', list.length + ' / 4'); if (list.length === 4) done();
            };
          });
          s.set({ list: [] }); set('n', '0 / 4');
        } },
      { title: 'Résolvons ensemble', intro: 'Une conserverie de sardines à Safi.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. La conserverie appartient au secteur :', o: ['secondaire', 'primaire', 'tertiaire'], a: 0 },
            { type: 'opt', q: 'Étape 2. Le service qui vend et fait la publicité :', o: ['la fonction commerciale', 'la fonction production'], a: 0 },
            { type: 'opt', q: 'Étape 3. Le service qui embauche les ouvriers :', o: ['les ressources humaines', 'la production'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'L’agriculture appartient au secteur :', o: ['primaire', 'tertiaire'], a: 0 },
      { lvl: 'Niveau 2', q: 'Un hôpital appartient au secteur :', o: ['tertiaire', 'secondaire'], a: 0 },
      { lvl: 'Niveau 3', q: 'Payer les salaires et les fournisseurs relève de la fonction :', o: ['financière', 'production'], a: 0 },
      { lvl: 'Niveau 4', q: 'Une entreprise de 40 employés : 25 en production, 6 au commercial, 5 en finance, le reste aux ressources humaines. Combien aux ressources humaines ?', a: 4 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Trois secteurs',
      hud: [['e', 'étape'], ['s', 'secteur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Pêche : **primaire**. Conserverie : **secondaire**. Épicerie : **tertiaire**.', hud: { e: 'sardine', s: ['3 secteurs'] }, run: function (e) { e.s.set({ list: ['Pêche à Agadir', 'Conserverie de sardines', 'Épicerie'] }); } },
        { cap: 'Dans chacune : production, commercial, finance, ressources humaines.', ar: 'وفي كل واحدة: الإنتاج، التجارة، المالية، الموارد البشرية.', hud: { e: 'entreprise', s: ['4 fonctions'] }, run: function (e) { e.s.set({ f: 0 }); } }
      ]
    },

    retenir: [
      'Secteur <b>primaire</b> : ressources de la nature (pêche, agriculture, mines). <b>Secondaire</b> : transformation (industrie). <b>Tertiaire</b> : services (commerce, banque, santé, transport).',
      'Fonctions de l’entreprise : <b>production</b>, <b>commerciale</b>, <b>financière</b>, <b>ressources humaines</b>, coordonnées par la direction.'
    ],
    retenirAr: 'القطاع الأول: موارد الطبيعة. القطاع الثاني: التحويل. القطاع الثالث: الخدمات. وظائف المقاولة: الإنتاج، التجارية، المالية، الموارد البشرية.',
    voc: [['une entreprise', 'مقاولة'], ['le secteur primaire', 'القطاع الأول'], ['le secteur secondaire', 'القطاع الثاني'], ['le secteur tertiaire', 'القطاع الثالث'], ['les ressources humaines', 'الموارد البشرية']]
  });
})();
