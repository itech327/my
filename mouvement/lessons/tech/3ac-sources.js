/* @meta {"id":"3ac-sources","level":"3","order":11,"theme":"Énergies renouvelables","title":"Sources d’énergie et mix du Maroc","ar":"مصادر الطاقة والمزيج الطاقي بالمغرب","lead":"Le Maroc importe presque tout son pétrole, son gaz et son charbon. Pourtant il a du soleil, du vent et des barrages. Quelles sources sont renouvelables, et où en est le pays ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var SRC = { 'Soleil': 1, 'Vent': 1, 'Eau des barrages': 1, 'Charbon': 0, 'Gaz naturel': 0, 'Pétrole': 0 };
  var MIX = [['éolien', 2452, '#7fb2ff'], ['hydraulique', 1306, '#56d07f'], ['solaire', 1086, '#f2c14e']];

  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function colonnes(list, hot) {
      [[20, 'renouvelables', 1], [190, 'non renouvelables', 0]].forEach(function (c) {
        S('rect', { x: c[0], y: 14, width: 150, height: 182, rx: 10, fill: '#17181a', stroke: c[2] ? '#56d07f' : '#e5484d', 'stroke-width': 2 }, dyn);
        T(dyn, c[0] + 75, 36, c[1], 'lbl');
        var k = 0;
        list.forEach(function (n) {
          if (SRC[n] !== c[2]) return;
          var y = 50 + k++ * 34, on = n === hot;
          S('rect', { x: c[0] + 12, y: y, width: 126, height: 26, rx: 6, fill: on ? 'var(--acc-bg)' : '#26292d', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 2 }, dyn);
          T(dyn, c[0] + 75, y + 18, n, 'tag');
        });
      });
    }
    function barres(hot) {
      T(dyn, 180, 22, 'Maroc fin 2025, MW renouvelables (IRENA)', 'tag');
      MIX.forEach(function (m, i) {
        var y = 44 + i * 44, w = m[1] / 2452 * 160, on = hot === i;
        T(dyn, 100, y + 20, m[0], 'lbl', 'end');
        S('rect', { x: 110, y: y, width: 0, height: 28, rx: 4, fill: m[2], opacity: on || hot == null ? 1 : .45 }, dyn);
        S('animate', { attributeName: 'width', from: 0, to: w.toFixed(1), dur: '.8s', fill: 'freeze' }, dyn.lastChild);
        T(dyn, 116 + w, y + 20, m[1] + ' MW', 'tag', 'start');
      });
      T(dyn, 180, 196, 'total ≈ 4851 MW', 'lbl');
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.mix) barres(o.hot); else colonnes(o.list || [], o.hot);
    };
    return g;
  }

  MV.lesson({
    id: '3ac-sources',
    objectif: {
      fr: 'Classer les sources d’énergie en renouvelables et non renouvelables, citer leurs effets sur l’environnement, et lire le mix renouvelable du Maroc.',
      ar: 'تصنيف مصادر الطاقة إلى متجددة وغير متجددة، وذكر آثارها على البيئة، وقراءة المزيج المتجدد بالمغرب.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Les sources du Maroc',
      hud: [['i', 'importé'], ['l', 'local'], ['q', 'renouvelable ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le Maroc **importe** pétrole, gaz et charbon.', hud: { i: ['fossiles'], l: '–', q: '?' }, run: function (e) { e.s.set({ list: ['Charbon', 'Gaz naturel', 'Pétrole'] }); } },
        { cap: 'Mais il a beaucoup de **soleil**, de **vent** et des **barrages**.', hud: { i: 'fossiles', l: ['soleil, vent, eau'], q: '?' }, run: function (e) { e.s.set({ list: ['Soleil', 'Vent', 'Eau des barrages', 'Charbon', 'Gaz naturel', 'Pétrole'] }); } },
        { cap: 'Quelles sources ne s’épuisent pas ? Et où en est le pays ?', hud: { i: 'fossiles', l: 'soleil, vent, eau', q: ['?'] }, run: function (e) { e.s.set({ mix: 1 }); } }
      ]
    },

    prepare: [
      ['Le pétrole s’est formé en des millions d’années.', true, 'On le consomme bien plus vite qu’il ne se forme.'],
      ['Le soleil sera épuisé dans quelques années.', false, 'C’est une source renouvelable à l’échelle humaine.'],
      ['Brûler du charbon rejette du dioxyde de carbone.', true, 'Ce gaz renforce l’effet de serre.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Renouvelables et mix',
      hud: [['s', 'source'], ['t', 'type'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Source **renouvelable** : elle se reconstitue vite. Soleil, vent, eau.', ar: 'المصدر المتجدد يتجدد بسرعة: الشمس، الرياح، الماء.', hud: { s: ['soleil, vent, eau'], t: ['renouvelable'], v: '–' }, run: function (e) { e.s.set({ list: ['Soleil', 'Vent', 'Eau des barrages'] }); } },
        { cap: 'Source **non renouvelable** : stock limité qui s’épuise. Charbon, gaz, pétrole.', ar: 'المصدر غير المتجدد مخزون محدود ينفد: الفحم، الغاز، البترول.', hud: { s: ['fossiles'], t: ['non renouvelable'], v: '–' }, run: function (e) { e.s.set({ list: ['Soleil', 'Vent', 'Eau des barrages', 'Charbon', 'Gaz naturel', 'Pétrole'] }); } },
        { cap: 'Les fossiles rejettent du **CO₂** et polluent l’air ; le pays dépend de leurs **importations**.', ar: 'الوقود الأحفوري يطرح ثنائي أكسيد الكربون ويلوث الهواء، ويجعل البلد تابعا للاستيراد.', hud: { s: 'charbon', t: 'non renouvelable', v: ['CO₂'] }, run: function (e) { e.s.set({ list: ['Soleil', 'Vent', 'Eau des barrages', 'Charbon', 'Gaz naturel', 'Pétrole'], hot: 'Charbon' }); } },
        { cap: 'Fin 2025, le Maroc a environ **4851 MW** renouvelables. L’**éolien** arrive en tête.', ar: 'في نهاية 2025 يتوفر المغرب على حوالي [[4851 MW]] متجددة، والريحية في المقدمة.', hud: { s: ['éolien'], t: 'renouvelable', v: ['2452 MW'] }, run: function (e) { e.s.set({ mix: 1, hot: 0 }); } },
        { cap: 'Puis l’**hydraulique** et le **solaire**. Le pays vise **52 %** de puissance renouvelable en 2030.', ar: 'ثم الطاقة الكهرومائية والشمسية. يهدف البلد إلى 52 % من القدرة المتجددة سنة 2030.', hud: { s: 'hydraulique, solaire', t: 'renouvelable', v: ['objectif 52 %'] }, run: function (e) { e.s.set({ mix: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Touche chaque source pour la ranger. Trouve les trois sources renouvelables.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Classer les sources' }, st);
          var s = scene(svg), set = MV.hud(c, [['s', 'source'], ['t', 'type', 1], ['n', 'renouvelables trouvées']]), list = [];
          var row = MV.H('div', 'row', '', c);
          Object.keys(SRC).forEach(function (n) {
            MV.H('button', 'btn', n, row).onclick = function () {
              if (list.indexOf(n) < 0) list.push(n);
              var k = list.filter(function (x) { return SRC[x]; }).length;
              s.set({ list: list, hot: n }); set('s', n); set('t', SRC[n] ? 'renouvelable' : 'non renouvelable'); set('n', k + ' / 3');
              if (k === 3) done();
            };
          });
          s.set({ list: [] }); set('n', '0 / 3');
        } },
      { title: 'Résolvons ensemble', intro: 'Lis le graphique : éolien 2452 MW, hydraulique 1306 MW, solaire 1086 MW, total 4851 MW.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Éolien et solaire ensemble (MW) ?', a: 3538 },
            { q: 'Étape 2. Part de l’éolien dans le total (%) ? Arrondis à l’unité.', a: 51, tol: 1, hint: '2452 ÷ 4851 × 100' },
            { type: 'opt', q: 'Étape 3. Le charbon est une source :', o: ['non renouvelable', 'renouvelable'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le vent est une source d’énergie :', o: ['renouvelable', 'non renouvelable'], a: 0 },
      { lvl: 'Niveau 2', q: 'Quelle source rejette le plus de CO₂ ?', o: ['le charbon', 'le soleil', 'le vent'], a: 0 },
      { lvl: 'Niveau 3', q: 'Hydraulique 1306 MW et solaire 1086 MW : total (MW) ?', a: 2392 },
      { lvl: 'Niveau 4', q: 'Objectif : 52 % de puissance renouvelable. Sur 20 000 MW installés, combien de MW renouvelables ?', a: 10400, hint: '20 000 × 0,52' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le bon choix',
      hud: [['i', 'importé'], ['l', 'local'], ['q', 'renouvelable']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Soleil, vent et eau sont **renouvelables** et **locaux** ; les fossiles sont importés et polluent.', hud: { i: 'fossiles', l: ['soleil, vent, eau'], q: ['oui'] }, run: function (e) { e.s.set({ list: ['Soleil', 'Vent', 'Eau des barrages', 'Charbon', 'Gaz naturel', 'Pétrole'] }); } },
        { cap: 'Le Maroc développe surtout l’**éolien**, puis l’**hydraulique** et le **solaire**.', ar: 'يطور المغرب خاصة الطاقة الريحية، ثم الكهرومائية والشمسية.', hud: { i: 'fossiles', l: '4851 MW', q: ['éolien en tête'] }, run: function (e) { e.s.set({ mix: 1 }); } }
      ]
    },

    retenir: [
      'Source <b>renouvelable</b> : se reconstitue rapidement (soleil, vent, eau, biomasse). Source <b>non renouvelable</b> : stock limité (charbon, pétrole, gaz, uranium), souvent polluante et émettrice de CO₂.',
      'Maroc, fin 2025 : environ <b>4851 MW</b> renouvelables, dont l’éolien (2452 MW), l’hydraulique (1306 MW) et le solaire (1086 MW). Objectif : <b>52 %</b> de la puissance installée en 2030.'
    ],
    retenirAr: 'المصدر المتجدد يتجدد بسرعة: الشمس والرياح والماء. المصدر غير المتجدد مخزون محدود وملوث: الفحم والبترول والغاز. في المغرب نهاية 2025 حوالي [[4851 MW]] متجددة، والهدف 52 % سنة 2030.',
    voc: [['renouvelable', 'متجدد'], ['une source d’énergie', 'مصدر طاقة'], ['les combustibles fossiles', 'الوقود الأحفوري'], ['le mix énergétique', 'المزيج الطاقي'], ['l’éolien', 'الطاقة الريحية']]
  });
})();
