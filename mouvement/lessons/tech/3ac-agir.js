/* @meta {"id":"3ac-agir","level":"3","order":9,"theme":"Chaîne d’énergie","title":"Agir","ar":"التأثير","lead":"Sur une chaîne d’emballage, un bras pousse chaque boîte vers le carton. Ce bras est un vérin qui sort et rentre plusieurs fois par minute. Comment l’air le fait-il bouger ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var CHAIN = [['Alimenter', 'compresseur'], ['Distribuer', 'distributeur'], ['Convertir', 'vérin'], ['Transmettre', 'tige'], ['Agir', 'pousser']];

  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function verin(o) {
      var out = o.tige === 'out', px = out ? 166 : 66, simple = o.simple;
      S('rect', { x: 60, y: 70, width: 120, height: 44, rx: 4, fill: '#1d1f22', stroke: '#e9e9ea', 'stroke-width': 2.5 }, dyn);
      if (out || !simple) S('rect', { x: 62, y: 72, width: px - 62, height: 40, fill: out ? 'rgba(127,178,255,.25)' : 'none' }, dyn);
      if (!out && !simple) S('rect', { x: px + 10, y: 72, width: 178 - px - 10, height: 40, fill: 'rgba(127,178,255,.25)' }, dyn);
      if (simple) {
        var d = 'M' + (px + 10) + ' 92', n = 8, w = (178 - px - 10) / n;
        for (var i = 1; i <= n; i++) d += 'L' + (px + 10 + i * w - w / 2) + ' ' + (i % 2 ? 76 : 108) + 'L' + (px + 10 + i * w) + ' 92';
        S('path', { d: d, stroke: '#f2c14e', 'stroke-width': 2, fill: 'none' }, dyn);
        T(dyn, 150, 62, 'ressort', 'tag');
      }
      S('rect', { x: px, y: 72, width: 10, height: 40, fill: 'var(--acc)' }, dyn);
      S('rect', { x: px + 10, y: 87, width: 100, height: 10, fill: '#9aa0a8' }, dyn);
      S('rect', { x: px + 110, y: 78, width: 8, height: 28, fill: '#9aa0a8' }, dyn);
      S('rect', { x: out ? px + 120 : 300, y: 76, width: 26, height: 26, fill: '#f2c14e' }, dyn); T(dyn, out ? px + 133 : 313, 120, 'boîte', 'tag');
      // distributeur et arrivées d’air
      S('rect', { x: 90, y: 150, width: 100, height: 30, rx: 4, fill: '#1d1f22', stroke: '#56d07f', 'stroke-width': 2 }, dyn);
      T(dyn, 140, 170, 'distributeur', 'tag');
      S('path', { d: 'M110 150V130H70V114', stroke: out ? '#7fb2ff' : '#5b6068', 'stroke-width': 3, fill: 'none' }, dyn);
      if (!simple) S('path', { d: 'M170 150V130H174V114', stroke: out ? '#5b6068' : '#7fb2ff', 'stroke-width': 3, fill: 'none' }, dyn);
      if (o.tige) {
        var p = out ? 'M110 150V130H70V116' : simple ? null : 'M170 150V130H174V116';
        if (p) [0, .4].forEach(function (b) { var c = S('circle', { r: 3.5, fill: '#7fb2ff' }, dyn); S('animateMotion', { dur: '.8s', begin: b + 's', repeatCount: 'indefinite', path: p }, c); });
      }
      T(dyn, 40, 196, 'air comprimé', 'tag', 'start');
      S('path', { d: 'M140 196V180', stroke: '#7fb2ff', 'stroke-width': 3 }, dyn);
      T(dyn, 120, 40, simple ? 'vérin simple effet' : 'vérin double effet', 'lbl');
    }
    function chaine(k) {
      CHAIN.forEach(function (c, i) {
        var x = 4 + i * 71, on = i <= k;
        S('rect', { x: x, y: 60, width: 64, height: 40, rx: 6, fill: on ? 'var(--acc-bg)' : '#1d1f22', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 2 }, dyn);
        T(dyn, x + 32, 78, c[0], 'tag').style.fontSize = '8.5px';
        T(dyn, x + 32, 92, c[1], 'tag').style.fontSize = '8px';
        if (i < 4) S('path', { d: 'M' + (x + 64) + ' 80H' + (x + 71), stroke: '#9aa0a8', 'stroke-width': 2 }, dyn);
      });
      var e = S('circle', { r: 4, fill: '#f2c14e' }, dyn);
      S('animateMotion', { dur: '2.5s', repeatCount: 'indefinite', path: 'M10 116H' + (10 + (k + 1) * 71 - 10) }, e);
      T(dyn, 180, 140, 'énergie : air comprimé → mouvement de la boîte', 'tag');
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.chain != null) chaine(o.chain); else verin(o);
    };
    return g;
  }

  MV.lesson({
    id: '3ac-agir',
    objectif: {
      fr: 'Savoir que la fonction agir produit l’effet voulu sur la matière d’œuvre, décrire le fonctionnement d’un vérin pneumatique simple et double effet, et ordonner la chaîne d’énergie.',
      ar: 'معرفة أن وظيفة التأثير تحدث الأثر المطلوب على مادة العمل، ووصف اشتغال الدافعة الهوائية بأثر بسيط وبأثر مزدوج، وترتيب سلسلة الطاقة.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Le bras qui pousse',
      hud: [['b', 'bras'], ['e', 'énergie'], ['q', 'comment ?']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Une boîte arrive devant le bras.', hud: { b: 'rentré', e: '–', q: '–' }, run: function (e) { e.s.set({ tige: 'in' }); } },
        { cap: 'De l’**air comprimé** entre : la tige **sort** et pousse la boîte.', hud: { b: ['sorti'], e: ['air comprimé'], q: '–' }, run: function (e) { e.s.set({ tige: 'out' }); } },
        { cap: 'Puis la tige **rentre**. Qu’est-ce qui la ramène ?', hud: { b: ['rentré'], e: 'air comprimé', q: ['?'] }, run: function (e) { e.s.set({ tige: 'in' }); } }
      ]
    },

    prepare: [
      ['Quand on gonfle un ballon, l’air sous pression pousse sa paroi.', true, 'L’air comprimé peut produire une force.'],
      ['Un vérin produit un mouvement de rotation.', false, 'Il produit une translation : la tige sort et rentre.'],
      ['Un ressort comprimé reprend sa forme quand on le lâche.', true, 'Il peut ramener une pièce.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Le vérin et la chaîne d’énergie',
      hud: [['f', 'fonction'], ['o', 'organe'], ['m', 'mouvement']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Agir**, c’est produire l’**effet** voulu sur la matière d’œuvre : ici, pousser la boîte.', ar: 'التأثير هو إحداث الأثر المطلوب على مادة العمل: هنا دفع العلبة.', hud: { f: ['agir'], o: 'effecteur', m: 'pousser' }, run: function (e) { e.s.set({ tige: 'out' }); } },
        { cap: 'Toute la chaîne : alimenter, distribuer, convertir, transmettre, **agir**.', ar: 'السلسلة كاملة: تغذية، توزيع، تحويل، نقل، تأثير.', hud: { f: 'chaîne d’énergie', o: ['5 fonctions'], m: '–' }, run: function (e) { e.s.set({ chain: 4 }); } },
        { cap: 'Vérin **double effet** : l’air fait **sortir** la tige par un côté…', ar: 'الدافعة بأثر مزدوج: الهواء يخرج الذراع من جهة…', hud: { f: 'convertir', o: ['double effet'], m: ['sortie'] }, run: function (e) { e.s.set({ tige: 'out' }); } },
        { cap: '…et la fait **rentrer** par l’autre côté. Le **distributeur** choisit le côté.', ar: '…ويدخلها من الجهة الأخرى. الموزع هو من يختار الجهة.', hud: { f: 'distribuer', o: ['distributeur'], m: ['rentrée'] }, run: function (e) { e.s.set({ tige: 'in' }); } },
        { cap: 'Vérin **simple effet** : l’air fait sortir la tige, un **ressort** la fait rentrer.', ar: 'الدافعة بأثر بسيط: الهواء يخرج الذراع والنابض يعيده.', hud: { f: 'convertir', o: ['simple effet'], m: ['ressort'] }, run: function (e) { e.s.set({ tige: 'in', simple: 1 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Commande le distributeur : fais sortir puis rentrer la tige.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Vérin double effet' }, st);
          var s = scene(svg), set = MV.hud(c, [['t', 'tige', 1], ['a', 'air entre']]), vu = {};
          var row = MV.H('div', 'row', '', c);
          function go(t) { s.set({ tige: t }); vu[t] = 1; set('t', t === 'out' ? 'sortie' : 'rentrée'); set('a', t === 'out' ? 'à gauche' : 'à droite'); if (vu.out && vu.in) done(); }
          MV.H('button', 'btn', 'Sortir la tige', row).onclick = function () { go('out'); };
          MV.H('button', 'btn', 'Rentrer la tige', row).onclick = function () { go('in'); };
          s.set({}); set('t', 'rentrée'); set('a', '–');
        } },
      { title: 'Résolvons ensemble', intro: 'Le vérin de la chaîne d’emballage a une course de 200 mm.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Ce vérin est alimenté par :', o: ['de l’air comprimé', 'un courant de 230 V'], a: 0 },
            { q: 'Étape 2. La tige sort en 2 s. Vitesse de la tige (mm/s) ?', a: 100, hint: '200 ÷ 2' },
            { type: 'opt', q: 'Étape 3. Après convertir, la chaîne d’énergie continue par :', o: ['transmettre puis agir', 'agir puis transmettre'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un vérin produit un mouvement de :', o: ['translation', 'rotation'], a: 0 },
      { lvl: 'Niveau 2', q: 'Dans un vérin simple effet, la tige rentre grâce à :', o: ['un ressort', 'l’air comprimé'], a: 0 },
      { lvl: 'Niveau 3', q: 'La dernière fonction de la chaîne d’énergie est :', o: ['agir', 'alimenter', 'distribuer'], a: 0 },
      { lvl: 'Niveau 4', q: 'Course 150 mm, sortie en 0,5 s. Vitesse de la tige (mm/s) ?', a: 300 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Ce qui ramène la tige',
      hud: [['b', 'bras'], ['e', 'énergie'], ['q', 'retour']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Dans un vérin **double effet**, c’est encore l’**air**, envoyé de l’autre côté par le distributeur.', hud: { b: 'rentré', e: 'air comprimé', q: ['air, autre côté'] }, run: function (e) { e.s.set({ tige: 'in' }); } },
        { cap: 'Le vérin et sa tige **agissent** sur la boîte : c’est la dernière fonction de la chaîne d’énergie.', ar: 'الدافعة وذراعها تؤثران على العلبة: إنها آخر وظيفة في سلسلة الطاقة.', hud: { b: 'sorti', e: 'air comprimé', q: ['agir'] }, run: function (e) { e.s.set({ chain: 4 }); } }
      ]
    },

    retenir: [
      '<b>Agir</b> = produire l’effet voulu sur la matière d’œuvre (pousser, serrer, lever…). Chaîne d’énergie : <b>alimenter → distribuer → convertir → transmettre → agir</b>.',
      'Vérin pneumatique : l’air comprimé donne une <b>translation</b>. <b>Double effet</b> : sortie et rentrée par l’air. <b>Simple effet</b> : rentrée par un ressort. <b class="mono">vitesse = course ÷ durée</b>.'
    ],
    retenirAr: 'التأثير هو إحداث الأثر المطلوب على مادة العمل. الدافعة الهوائية تعطي حركة انسحاب: بأثر مزدوج يخرج الذراع ويدخل بالهواء، وبأثر بسيط يعيده نابض.',
    voc: [['agir', 'تأثير'], ['un vérin', 'دافعة'], ['la tige', 'الذراع'], ['l’air comprimé', 'الهواء المضغوط'], ['un ressort', 'نابض']]
  });
})();
