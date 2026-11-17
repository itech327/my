/* @meta {"id":"3ac-alimenter","level":"3","order":5,"theme":"Chaîne d’énergie","title":"Alimenter","ar":"التغذية","lead":"Une perceuse sans fil, un chargeur de téléphone, une voiture télécommandée : tous ont besoin d’énergie électrique au bon niveau. Comment l’obtenir ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var CHAIN = ['Alimenter', 'Distribuer', 'Convertir', 'Transmettre', 'Agir'];
  var CHARGE = [['Secteur', '230 V ~'], ['Transformateur', 'abaisse'], ['Redresseur', 'un seul sens'], ['Filtre', 'lisse']];

  function etat(u) { return u < 6 ? 'trop faible' : u > 6 ? 'trop forte' : 'correcte'; }
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function pile(x, y) {
      S('rect', { x: x, y: y, width: 34, height: 22, rx: 3, fill: '#26292d', stroke: '#f2c14e', 'stroke-width': 2 }, dyn);
      S('rect', { x: x + 34, y: y + 7, width: 4, height: 8, fill: '#f2c14e' }, dyn);
      T(dyn, x + 17, y + 15, '1,5', 'tag');
    }
    function moteur(u) {
      S('circle', { cx: 316, cy: 112, r: 22, fill: 'var(--acc-bg)', stroke: 'var(--acc)', 'stroke-width': 2.5 }, dyn);
      T(dyn, 316, 118, 'M', 'lbl big');
      if (u > 0) {
        var h = S('g', {}, dyn);
        S('path', { d: 'M316 84V92', stroke: '#fff', 'stroke-width': 3 }, h);
        S('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 316 112', to: '360 316 112', dur: (3 / u).toFixed(2) + 's', repeatCount: 'indefinite' }, h);
      }
      T(dyn, 316, 152, 'moteur 6 V', 'tag');
    }
    g.set = function (o) { // o.chain : bloc surligné ; o.n, o.par : piles ; o.charge : étape du chargeur
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.chain != null) {
        CHAIN.forEach(function (n, i) {
          var x = 4 + i * 71, on = i === o.chain;
          S('rect', { x: x, y: 16, width: 64, height: 34, rx: 6, fill: on ? 'var(--acc-bg)' : '#1d1f22', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 2 }, dyn);
          T(dyn, x + 32, 37, n, 'tag').style.fontSize = '9px';
          if (i < 4) S('path', { d: 'M' + (x + 64) + ' 33H' + (x + 71), stroke: '#9aa0a8', 'stroke-width': 2 }, dyn);
        });
        var e = S('circle', { r: 4, fill: '#f2c14e' }, dyn);
        S('animateMotion', { dur: '2.5s', repeatCount: 'indefinite', path: 'M10 58H350' }, e);
        T(dyn, 180, 72, 'énergie', 'tag');
      }
      if (o.n) {
        var u = o.par ? 1.5 : o.n * 1.5;
        if (o.par) {
          for (var k = 0; k < o.n; k++) pile(60, 92 + k * 32);
          S('path', { d: 'M56 103H44V' + (103 + (o.n - 1) * 32) + 'M98 103H112V' + (103 + (o.n - 1) * 32), stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, dyn);
          S('path', { d: 'M112 112H294', stroke: '#9aa0a8', 'stroke-width': 2 }, dyn);
          T(dyn, 78, 86, 'en parallèle', 'tag');
        } else {
          for (var j = 0; j < o.n; j++) pile(14 + j * 42, 101);
          S('path', { d: 'M' + (14 + o.n * 42 - 4) + ' 112H294', stroke: '#9aa0a8', 'stroke-width': 2 }, dyn);
          T(dyn, 14 + o.n * 21, 92, 'en série', 'tag');
        }
        T(dyn, 140, 160, 'U = ' + MV.fmt(u, 1) + ' V', 'lbl');
        moteur(u);
        T(dyn, 354, 176, 'tension ' + etat(u), 'tag', 'end');
      }
      if (o.charge != null) {
        CHARGE.forEach(function (c, i) {
          var x = 6 + i * 89, on = i === o.charge;
          S('rect', { x: x, y: 90, width: 80, height: 34, rx: 6, fill: on ? 'var(--acc-bg)' : '#1d1f22', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 2 }, dyn);
          T(dyn, x + 40, 104, c[0], 'tag').style.fontSize = '9px'; T(dyn, x + 40, 118, c[1], 'tag').style.fontSize = '9px';
          if (i < 3) S('path', { d: 'M' + (x + 80) + ' 107H' + (x + 89), stroke: '#9aa0a8', 'stroke-width': 2 }, dyn);
          if (i > o.charge) return;
          var y0 = 165, a = i === 0 ? 26 : 12, d = 'M' + (x + 6) + ' ' + y0;
          for (var t = 0; t <= 68; t += 2) {
            var v = Math.sin(t / 68 * 4 * Math.PI);
            if (i === 2) v = Math.abs(v);
            if (i === 3) v = 0.85 + 0.08 * Math.abs(Math.sin(t / 68 * 4 * Math.PI));
            d += 'L' + (x + 6 + t) + ' ' + (y0 - v * a);
          }
          S('path', { d: 'M' + (x + 4) + ' ' + y0 + 'H' + (x + 76), stroke: '#2c2f34' }, dyn);
          S('path', { d: d, stroke: on ? 'var(--acc)' : '#9aa0a8', 'stroke-width': 2, fill: 'none' }, dyn);
        });
      }
    };
    return g;
  }

  MV.lesson({
    id: '3ac-alimenter',
    objectif: {
      fr: 'Situer la fonction alimenter dans la chaîne d’énergie, calculer la tension de piles en série et en parallèle, et décrire les étapes d’un chargeur (transformateur, redresseur, filtre).',
      ar: 'تحديد موقع وظيفة التغذية في سلسلة الطاقة، وحساب توتر أعمدة مركبة على التوالي وعلى التوازي، ووصف مراحل الشاحن (محول، مقوم، مرشح).'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Une voiture télécommandée',
      hud: [['m', 'moteur'], ['u', 'tension'], ['q', 'piles ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le moteur d’une voiture télécommandée demande **6 V**.', hud: { m: '6 V', u: '–', q: '?' }, run: function (e) { e.s.set({ chain: 0 }); } },
        { cap: 'Une seule pile donne **1,5 V** : le moteur tourne à peine.', hud: { m: '6 V', u: ['1,5 V'], q: '1' }, run: function (e) { e.s.set({ n: 1 }); } },
        { cap: 'Combien de piles faut-il, et **comment** les relier ?', hud: { m: '6 V', u: '?', q: ['?'] }, run: function (e) { e.s.set({ n: 2 }); } }
      ]
    },

    prepare: [
      ['Une pile transforme de l’énergie chimique en énergie électrique.', true, 'C’est une source d’énergie.'],
      ['La prise du secteur au Maroc donne 230 V.', true, 'Tension alternative de 50 Hz.'],
      ['Un téléphone se recharge directement en 230 V.', false, 'Le chargeur abaisse la tension à environ 5 V continu.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'La chaîne d’énergie et les sources',
      hud: [['f', 'fonction'], ['r', 'règle'], ['u', 'tension']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'La **chaîne d’énergie** : alimenter, distribuer, convertir, transmettre, agir.', ar: 'سلسلة الطاقة: تغذية، توزيع، تحويل، نقل، تأثير.', hud: { f: ['chaîne d’énergie'], r: '5 fonctions', u: '–' }, run: function (e) { e.s.set({ chain: 0 }); } },
        { cap: '**Alimenter**, c’est fournir l’énergie au système : pile, batterie, secteur, panneau solaire.', ar: 'التغذية هي تزويد النظام بالطاقة: عمود، بطارية، القطاع، لوح شمسي.', hud: { f: ['alimenter'], r: 'source', u: '–' }, run: function (e) { e.s.set({ chain: 0 }); } },
        { cap: 'Piles **en série** : les tensions **s’ajoutent**. 4 × 1,5 V = 6 V.', ar: 'الأعمدة على التوالي: تُجمع التوترات. [[4 × 1,5 = 6 V]].', hud: { f: 'série', r: ['U = n × 1,5'], u: ['6 V'] }, run: function (e) { e.s.set({ n: 4 }); } },
        { cap: 'Piles **en parallèle** : même tension, mais **plus d’autonomie**.', ar: 'الأعمدة على التوازي: نفس التوتر لكن مدة اشتغال أطول.', hud: { f: 'parallèle', r: ['U = 1,5 V'], u: '1,5 V' }, run: function (e) { e.s.set({ n: 2, par: 1 }); } },
        { cap: 'Un **chargeur** part du secteur : 230 V **alternatif**.', ar: 'ينطلق الشاحن من القطاع: [[230 V]] متناوب.', hud: { f: 'chargeur', r: 'alternatif', u: ['230 V ~'] }, run: function (e) { e.s.set({ charge: 0 }); } },
        { cap: 'Le **transformateur** abaisse la tension, le **redresseur** la met dans un seul sens.', ar: 'المحول يخفض التوتر، والمقوم يجعله في اتجاه واحد.', hud: { f: 'chargeur', r: ['abaisser, redresser'], u: '≈ 5 V' }, run: function (e) { e.s.set({ charge: 2 }); } },
        { cap: 'Le **filtre** la lisse : on obtient une tension **continue**.', ar: 'المرشح يملسه: نحصل على توتر مستمر.', hud: { f: 'chargeur', r: ['filtrer'], u: ['5 V continu'] }, run: function (e) { e.s.set({ charge: 3 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Ajoute des piles de 1,5 V en série. Donne au moteur exactement sa tension.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Piles en série et moteur' }, st);
          var s = scene(svg), set = MV.hud(c, [['n', 'piles'], ['u', 'tension', 1], ['e', 'pour le moteur']]);
          MV.slider(c, { label: 'piles', min: 1, max: 6, value: 1 }, function (n) { s.set({ n: n }); set('n', n); set('u', MV.fmt(n * 1.5, 1) + ' V'); set('e', etat(n * 1.5)); if (n === 4) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Une lampe de poche contient des piles de 1,5 V.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Trois piles en série. Tension (V) ?', a: 4.5 },
            { q: 'Étape 2. Deux piles en parallèle. Tension (V) ?', a: 1.5 },
            { type: 'opt', q: 'Étape 3. Dans un chargeur, le redresseur transforme :', o: ['l’alternatif en continu', 'le continu en alternatif'], a: 0, e: 'Le courant ne circule plus que dans un sens.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'La première fonction de la chaîne d’énergie est :', o: ['alimenter', 'agir', 'transmettre'], a: 0 },
      { lvl: 'Niveau 2', q: 'Combien de piles de 1,5 V en série pour obtenir 9 V ?', a: 6 },
      { lvl: 'Niveau 3', q: 'Dans un chargeur, le transformateur :', o: ['abaisse la tension du secteur', 'redresse le courant', 'lisse la tension'], a: 0 },
      { lvl: 'Niveau 4', q: 'Batterie de perceuse 18 V faite d’éléments de 3,6 V en série. Nombre d’éléments ?', a: 5, hint: '18 ÷ 3,6' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le moteur tourne',
      hud: [['m', 'moteur'], ['u', 'tension'], ['q', 'piles']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Quatre piles en série** : 4 × 1,5 V = **6 V**.', hud: { m: '6 V', u: ['6 V'], q: ['4 en série'] }, run: function (e) { e.s.set({ n: 4 }); } },
        { cap: 'La tension est **correcte** : l’énergie entre dans la chaîne par la fonction **alimenter**.', ar: 'التوتر مناسب: تدخل الطاقة إلى السلسلة عبر وظيفة التغذية.', hud: { m: ['tourne'], u: '6 V', q: '4 en série' }, run: function (e) { e.s.set({ chain: 0 }); } }
      ]
    },

    retenir: [
      '<b>Alimenter</b> est la première fonction de la chaîne d’énergie (alimenter, distribuer, convertir, transmettre, agir). Sources : pile, batterie, secteur 230 V, panneau solaire.',
      'Piles <b>en série</b> : <b class="mono">U = U₁ + U₂ + …</b> Piles <b>en parallèle</b> : même tension, plus d’autonomie. Un chargeur : <b>transformateur</b> (abaisse), <b>redresseur</b> (un seul sens), <b>filtre</b> (lisse).'
    ],
    retenirAr: 'التغذية أول وظيفة في سلسلة الطاقة. الأعمدة على التوالي تُجمع توتراتها، وعلى التوازي نفس التوتر ومدة أطول. الشاحن: محول يخفض، مقوم يجعل التيار في اتجاه واحد، مرشح يملس.',
    voc: [['alimenter', 'تغذية'], ['la chaîne d’énergie', 'سلسلة الطاقة'], ['en série', 'على التوالي'], ['en parallèle', 'على التوازي'], ['un redresseur', 'مقوم']]
  });
})();
