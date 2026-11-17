/* @meta {"id":"2ac-circuit-imprime","level":"2","order":10,"theme":"Fabrication","title":"Du schéma au circuit imprimé","ar":"من التصميم إلى الدارة المطبوعة","lead":"Le schéma de la veilleuse est prêt. Pour la fabriquer en série, on remplace les fils par des pistes de cuivre sur une plaque : le circuit imprimé."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var ETAPES = [['schéma', 'dessiner le circuit'], ['typon', 'dessiner les pistes'], ['insolation', 'lumière UV à travers le typon'], ['révélation', 'faire apparaître les pistes'], ['gravure', 'enlever le cuivre en trop'], ['perçage', 'percer les trous'], ['soudure', 'souder les composants'], ['test', 'vérifier le fonctionnement']];

  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function plaque(k) {
      // plaque : 100 × 64 unités, dessinée de x 150 à 330
      var x = 160, y = 46, w = 170, h = 110;
      var cuivre = k < 4 ? '#c87533' : '#2e6b3a';
      S('rect', { x: x, y: y, width: w, height: h, rx: 4, fill: k >= 4 ? '#2e6b3a' : '#c87533', stroke: '#e9e9ea', 'stroke-width': 1.5 }, dyn);
      if (k === 2) { S('rect', { x: x, y: y, width: w, height: h, fill: 'rgba(160,120,255,.35)' }, dyn); for (var i = 0; i < 4; i++) S('path', { d: 'M' + (x + 20 + i * 40) + ' 14L' + (x + 30 + i * 40) + ' 40', stroke: '#b48cff', 'stroke-width': 2 }, dyn); }
      var pistes = 'M' + (x + 20) + ' ' + (y + 30) + 'H' + (x + 90) + 'V' + (y + 80) + 'H' + (x + 150) + 'M' + (x + 20) + ' ' + (y + 90) + 'H' + (x + 60);
      if (k >= 1) S('path', { d: pistes, stroke: k === 1 ? '#111' : k >= 4 ? '#e8a35c' : '#7a3f13', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, dyn);
      if (k >= 5) [[20, 30], [90, 30], [90, 80], [150, 80], [20, 90], [60, 90]].forEach(function (p) { S('circle', { cx: x + p[0], cy: y + p[1], r: 2.5, fill: '#141517' }, dyn); });
      if (k >= 6) {
        S('rect', { x: x + 98, y: y + 70, width: 46, height: 18, rx: 6, fill: '#d9c08f' }, dyn);
        S('circle', { cx: x + 40, cy: y + 30, r: 9, fill: '#ff5a5a' }, dyn);
        [[90, 30], [150, 80], [20, 90]].forEach(function (p) { S('circle', { cx: x + p[0], cy: y + p[1], r: 5, fill: '#cfd3d8' }, dyn); });
      }
      if (k === 7) { S('circle', { cx: x + 40, cy: y + 30, r: 18, fill: 'rgba(255,90,90,.35)' }, dyn); T(dyn, x + w / 2, y + h + 22, '✓ la LED s’allume', 'lbl'); }
      if (k === 4) { S('rect', { x: x - 10, y: y + h - 30, width: w + 20, height: 44, rx: 6, fill: 'rgba(90,60,30,.55)' }, dyn); T(dyn, x + w / 2, y + h + 26, 'gants et lunettes', 'tag'); }
      void cuivre;
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var k = o.k || 0;
      ETAPES.forEach(function (e, i) {
        var y = 14 + i * 23, on = i === k, done = i < k;
        S('rect', { x: 8, y: y, width: 130, height: 19, rx: 5, fill: on ? 'var(--acc-bg)' : '#1d1f22', stroke: on ? 'var(--acc)' : done ? '#56d07f' : '#2c2f34', 'stroke-width': 1.5 }, dyn);
        var t = T(dyn, 16, y + 14, (i + 1) + '. ' + e[0], 'tag', 'start'); t.style.fontSize = '10px';
      });
      if (k === 0) {
        S('path', { d: 'M180 60H300V140H180Z', stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, dyn);
        S('rect', { x: 230, y: 52, width: 30, height: 16, fill: '#141517', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
        S('path', { d: 'M232 132L250 140L232 148Z', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2 }, dyn);
        T(dyn, 240, 180, 'le schéma de la veilleuse', 'tag');
      } else plaque(k);
      T(dyn, 245, 204, ETAPES[k][1], 'tag');
    };
    return g;
  }

  MV.lesson({
    id: '2ac-circuit-imprime',
    objectif: {
      fr: 'Ordonner les étapes de fabrication d’un circuit imprimé (typon, insolation, révélation, gravure, perçage, soudure, test) et respecter les règles de sécurité et de recyclage.',
      ar: 'ترتيب مراحل صنع دارة مطبوعة، واحترام قواعد السلامة وإعادة التدوير.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Fabriquer la veilleuse',
      hud: [['e', 'étape'], ['q', 'question']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le **schéma** de la veilleuse est prêt.', hud: { e: ['schéma'], q: '–' }, run: function (e) { e.s.set({ k: 0 }); } },
        { cap: 'Sur la plaque, les fils sont remplacés par des **pistes de cuivre**.', hud: { e: 'plaque', q: '–' }, run: function (e) { e.s.set({ k: 5 }); } },
        { cap: 'Huit étapes pour passer du dessin à l’objet qui fonctionne. Dans quel **ordre** ?', hud: { e: ['8 étapes'], q: ['ordre ?'] }, run: function (e) { e.s.set({ k: 7 }); } }
      ]
    },

    prepare: [
      ['Le cuivre conduit très bien le courant électrique.', true, 'C’est pourquoi les pistes sont en cuivre.'],
      ['On peut jeter le perchlorure de fer dans l’évier.', false, 'Il est polluant : bidon de récupération.'],
      ['Un fer à souder chauffe à plus de 300 °C.', true, 'On le pose toujours sur son support.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Les étapes',
      hud: [['e', 'étape'], ['r', 'rôle']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le **typon** : le dessin des pistes, en noir sur un film transparent.', ar: 'الطيبون: رسم المسالك بالأسود على ورق شفاف.', hud: { e: ['typon'], r: 'dessin des pistes' }, run: function (e) { e.s.set({ k: 1 }); } },
        { cap: '**Insolation** : la lumière UV traverse le typon, sauf sous les pistes noires.', ar: 'التعريض للأشعة: تمر الأشعة فوق البنفسجية عبر الطيبون إلا تحت المسالك السوداء.', hud: { e: ['insolation'], r: 'UV' }, run: function (e) { e.s.set({ k: 2 }); } },
        { cap: '**Révélation**, puis **gravure** : le cuivre non protégé disparaît, seules les pistes restent.', ar: 'الإظهار ثم الحفر: يزول النحاس غير المحمي وتبقى المسالك.', hud: { e: ['gravure'], r: ['gants, lunettes'] }, run: function (e) { e.s.set({ k: 4 }); } },
        { cap: '**Perçage** des trous, puis **soudure** des composants.', ar: 'ثقب الثقوب ثم لحام المكونات.', hud: { e: ['perçage, soudure'], r: 'monter' }, run: function (e) { e.s.set({ k: 6 }); } },
        { cap: '**Test** : la veilleuse fonctionne. Les déchets vont au **recyclage**.', ar: 'الاختبار: المصباح يشتغل، والنفايات تذهب لإعادة التدوير.', hud: { e: ['test'], r: ['recycler'] }, run: function (e) { e.s.set({ k: 7 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Avance étape par étape jusqu’au test de la veilleuse.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Fabrication d’un circuit imprimé' }, st);
          var s = scene(svg), set = MV.hud(c, [['e', 'étape', 1], ['r', 'rôle']]), k = 0;
          var row = MV.H('div', 'row', '', c);
          function paint() { s.set({ k: k }); set('e', (k + 1) + '. ' + ETAPES[k][0]); set('r', ETAPES[k][1]); if (k === 7) done(); }
          MV.H('button', 'btn', 'Étape suivante', row).onclick = function () { if (k < 7) k++; paint(); };
          MV.H('button', 'btn', 'Recommencer', row).onclick = function () { k = 0; paint(); };
          paint();
        } },
      { title: 'Résolvons ensemble', intro: 'Préparer la fabrication.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. La gravure enlève :', o: ['le cuivre non protégé', 'les pistes'], a: 0 },
            { type: 'opt', q: 'Étape 2. Pour manipuler le perchlorure de fer, on porte :', o: ['gants et lunettes', 'rien de spécial'], a: 0 },
            { q: 'Étape 3. Plaque de 100 mm × 80 mm. Surface (cm²) ?', a: 80, hint: '10 cm × 8 cm' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le typon représente :', o: ['le dessin des pistes', 'la liste des prix'], a: 0 },
      { lvl: 'Niveau 2', q: 'Juste après la gravure, on :', o: ['perce les trous', 'redessine le schéma'], a: 0 },
      { lvl: 'Niveau 3', q: 'Le perchlorure de fer usagé :', o: ['va dans un bidon de récupération', 'va dans l’évier'], a: 0 },
      { lvl: 'Niveau 4', q: 'Un circuit a 12 composants à 2 pattes et 1 composant à 8 pattes. Nombre de trous à percer ?', a: 32 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'La veilleuse fabriquée',
      hud: [['e', 'étape'], ['q', 'ordre']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Schéma, typon, insolation, révélation, gravure, perçage, soudure, **test**.', hud: { e: '8 étapes', q: ['dans l’ordre'] }, run: function (e) { e.s.set({ k: 7 }); } },
        { cap: 'Avec **gants et lunettes**, et le perchlorure au **recyclage**.', ar: 'بالقفازات والنظارات، والسائل الكيميائي إلى إعادة التدوير.', hud: { e: 'sécurité', q: ['recyclage'] }, run: function (e) { e.s.set({ k: 4 }); } }
      ]
    },

    retenir: [
      'Étapes : <b>schéma → typon → insolation → révélation → gravure → perçage → soudure → test</b>. Les pistes de cuivre remplacent les fils.',
      'Sécurité : gants et lunettes pour les produits chimiques, fer à souder sur son support, pièce aérée. Le perchlorure usagé va au <b>recyclage</b>.'
    ],
    retenirAr: 'مراحل الدارة المطبوعة: التصميم، الطيبون، التعريض، الإظهار، الحفر، الثقب، اللحام، الاختبار. السلامة: القفازات والنظارات، وإعادة تدوير المواد الكيميائية.',
    voc: [['un circuit imprimé', 'دارة مطبوعة'], ['une piste', 'مسلك'], ['la gravure', 'الحفر'], ['souder', 'لحام'], ['le typon', 'الطيبون']]
  });
})();
