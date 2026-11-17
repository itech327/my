/* @meta {"id":"2ac-sysml","level":"2","order":2,"theme":"Analyse fonctionnelle","title":"Lire les diagrammes SysML : le portail","ar":"قراءة مخططات SysML: الباب الآلي","lead":"Avant de fabriquer un portail automatique, l’ingénieur le décrit avec des diagrammes : qui l’utilise, avec quoi il est en relation, et ce qu’il doit respecter."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  function acteur(g, x, y, nom) {
    S('circle', { cx: x, cy: y, r: 7, fill: 'none', stroke: '#f2c14e', 'stroke-width': 2 }, g);
    S('path', { d: 'M' + x + ' ' + (y + 7) + 'V' + (y + 26) + 'M' + (x - 10) + ' ' + (y + 14) + 'H' + (x + 10) + 'M' + x + ' ' + (y + 26) + 'L' + (x - 8) + ' ' + (y + 38) + 'M' + x + ' ' + (y + 26) + 'L' + (x + 8) + ' ' + (y + 38), stroke: '#f2c14e', 'stroke-width': 2, fill: 'none' }, g);
    T(g, x, y + 54, nom, 'tag');
  }
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function cadre(titre) { S('rect', { x: 100, y: 22, width: 180, height: 168, rx: 6, fill: 'none', stroke: '#9aa0a8', 'stroke-width': 1.5 }, dyn); T(dyn, 190, 16, titre, 'tag'); }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.d === 'uc') {
        cadre('cas d’utilisation : portail automatique');
        acteur(dyn, 44, 70, 'utilisateur');
        [['ouvrir le portail', 64], ['fermer le portail', 112], ['signaler le mouvement', 160]].forEach(function (u, i) {
          var on = o.hot === i;
          S('ellipse', { cx: 190, cy: u[1], rx: 80, ry: 18, fill: on ? 'var(--acc-bg)' : '#1d1f22', stroke: on ? 'var(--acc)' : '#e9e9ea', 'stroke-width': 2 }, dyn);
          T(dyn, 190, u[1] + 4, u[0], 'tag');
          if (i < 2) S('line', { x1: 56, y1: 92, x2: 110, y2: u[1], stroke: '#9aa0a8', 'stroke-width': 1.5 }, dyn);
        });
        acteur(dyn, 322, 120, 'passant');
        S('line', { x1: 310, y1: 140, x2: 270, y2: 160, stroke: '#9aa0a8', 'stroke-width': 1.5 }, dyn);
      } else if (o.d === 'ctx') {
        S('rect', { x: 130, y: 82, width: 100, height: 46, rx: 8, fill: 'var(--acc-bg)', stroke: 'var(--acc)', 'stroke-width': 2.5 }, dyn);
        T(dyn, 180, 110, 'portail', 'lbl');
        [['utilisateur', 50, 40], ['voiture', 310, 40], ['énergie 230 V', 50, 176], ['vent, pluie', 310, 176]].forEach(function (e, i) {
          var on = o.hot === i;
          S('rect', { x: e[1] - 46, y: e[2] - 16, width: 92, height: 30, rx: 6, fill: on ? 'var(--acc-bg)' : '#1d1f22', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 2 }, dyn);
          T(dyn, e[1], e[2] + 4, e[0], 'tag');
          S('line', { x1: e[1] < 180 ? e[1] + 46 : e[1] - 46, y1: e[2], x2: e[1] < 180 ? 130 : 230, y2: e[2] < 100 ? 92 : 118, stroke: '#9aa0a8', 'stroke-width': 1.5 }, dyn);
        });
        T(dyn, 180, 16, 'contexte : les éléments extérieurs', 'tag');
      } else if (o.d === 'req') {
        T(dyn, 180, 16, 'exigences : ce que le portail doit respecter', 'tag');
        [['Id 1', 'ouvrir en moins de 15 s'], ['Id 2', 's’arrêter devant un obstacle'], ['Id 3', 'fonctionner de −10 °C à 50 °C']].forEach(function (r, i) {
          var y = 30 + i * 58, on = o.hot === i;
          S('rect', { x: 40, y: y, width: 280, height: 46, rx: 6, fill: on ? 'var(--acc-bg)' : '#1d1f22', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 2 }, dyn);
          T(dyn, 52, y + 18, '«requirement» ' + r[0], 'tag', 'start');
          T(dyn, 52, y + 36, r[1], 'lbl', 'start');
        });
      }
    };
    return g;
  }
  var NOMS = { uc: 'cas d’utilisation', ctx: 'contexte', req: 'exigences' };

  MV.lesson({
    id: '2ac-sysml',
    objectif: {
      fr: 'Lire trois diagrammes SysML d’un portail automatique : cas d’utilisation (acteurs et services), contexte (éléments extérieurs) et exigences.',
      ar: 'قراءة ثلاثة مخططات SysML لباب آلي: حالات الاستعمال، والسياق، والمتطلبات.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Décrire le portail',
      hud: [['q', 'question'], ['d', 'diagramme']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Qui utilise le portail et pour faire quoi ?', hud: { q: ['qui ? quoi ?'], d: '?' }, run: function (e) { e.s.set({ d: 'uc' }); } },
        { cap: 'Avec quoi est-il en relation : voiture, électricité, pluie ?', hud: { q: ['avec quoi ?'], d: '?' }, run: function (e) { e.s.set({ d: 'ctx' }); } },
        { cap: 'Qu’est-ce qu’il **doit** respecter ? Chaque question a son **diagramme**.', hud: { q: ['quelles règles ?'], d: ['3 diagrammes'] }, run: function (e) { e.s.set({ d: 'req' }); } }
      ]
    },

    prepare: [
      ['Un plan aide à fabriquer un objet sans erreur.', true, 'Les diagrammes SysML sont des plans du fonctionnement.'],
      ['Le portail automatique doit pouvoir fonctionner sous la pluie.', true, 'C’est une contrainte de son environnement.'],
      ['Un diagramme SysML est une photo du portail.', false, 'C’est une représentation codée, avec des formes normalisées.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Trois diagrammes',
      hud: [['d', 'diagramme'], ['m', 'montre']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Diagramme des **cas d’utilisation** : les **acteurs** (bonshommes) et les services rendus (ovales).', ar: 'مخطط حالات الاستعمال: الفاعلون والخدمات المقدمة.', hud: { d: ['cas d’utilisation'], m: 'acteurs, services' }, run: function (e) { e.s.set({ d: 'uc' }); } },
        { cap: 'L’utilisateur peut **ouvrir** et **fermer** ; le portail **signale** son mouvement au passant.', ar: 'المستعمل يفتح ويغلق، والباب ينبه المار إلى حركته.', hud: { d: 'cas d’utilisation', m: ['ouvrir, fermer, signaler'] }, run: function (e) { e.s.set({ d: 'uc', hot: 0 }); } },
        { cap: 'Diagramme de **contexte** : les éléments **extérieurs** en relation avec le portail.', ar: 'مخطط السياق: العناصر الخارجية المرتبطة بالباب.', hud: { d: ['contexte'], m: 'éléments extérieurs' }, run: function (e) { e.s.set({ d: 'ctx' }); } },
        { cap: 'Diagramme des **exigences** : ce que le portail doit respecter, souvent avec une **valeur**.', ar: 'مخطط المتطلبات: ما يجب أن يحترمه الباب، غالبا بقيمة محددة.', hud: { d: ['exigences'], m: ['moins de 15 s'] }, run: function (e) { e.s.set({ d: 'req', hot: 0 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Ouvre les trois diagrammes du portail.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Diagrammes SysML' }, st);
          var s = scene(svg), set = MV.hud(c, [['d', 'diagramme', 1], ['n', 'vus']]), vu = {};
          var row = MV.H('div', 'row', '', c);
          [['Cas d’utilisation', 'uc'], ['Contexte', 'ctx'], ['Exigences', 'req']].forEach(function (b) {
            MV.H('button', 'btn', b[0], row).onclick = function () { vu[b[1]] = 1; s.set({ d: b[1] }); set('d', NOMS[b[1]]); var n = Object.keys(vu).length; set('n', n + ' / 3'); if (n === 3) done(); };
          });
          s.set({ d: 'uc' }); set('d', 'cas d’utilisation'); set('n', '0 / 3');
        } },
      { title: 'Résolvons ensemble', intro: 'Lis les diagrammes du portail.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Le bonhomme dessiné représente :', o: ['un acteur', 'une exigence'], a: 0 },
            { type: 'opt', q: 'Étape 2. « Voiture, énergie 230 V, pluie » se lisent sur le diagramme :', o: ['de contexte', 'des exigences'], a: 0 },
            { q: 'Étape 3. Le portail s’ouvre en 12 s ; l’exigence demande moins de 15 s. Marge (s) ?', a: 3 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Dans un diagramme de cas d’utilisation, un ovale représente :', o: ['un service rendu', 'un acteur'], a: 0 },
      { lvl: 'Niveau 2', q: 'Le diagramme qui montre ce que le système doit respecter est le diagramme :', o: ['des exigences', 'de contexte'], a: 0 },
      { lvl: 'Niveau 3', q: '« Fonctionner de −10 °C à 50 °C » est :', o: ['une exigence', 'un acteur', 'un cas d’utilisation'], a: 0 },
      { lvl: 'Niveau 4', q: 'Exigence : moins de 15 s. Le portail parcourt 3 m à 0,25 m/s. Durée (s) ?', a: 12, hint: '3 ÷ 0,25' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le portail décrit',
      hud: [['q', 'question'], ['d', 'diagramme']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Qui et pour quoi : **cas d’utilisation**. Avec quoi : **contexte**.', hud: { q: 'qui ? avec quoi ?', d: ['cas d’utilisation, contexte'] }, run: function (e) { e.s.set({ d: 'ctx' }); } },
        { cap: 'Ce qu’il doit respecter : **exigences**, avec des valeurs mesurables.', ar: 'ما يجب احترامه: المتطلبات، بقيم قابلة للقياس.', hud: { q: 'quelles règles ?', d: ['exigences'] }, run: function (e) { e.s.set({ d: 'req' }); } }
      ]
    },

    retenir: [
      '<b>Cas d’utilisation</b> : les acteurs (bonshommes) et les services rendus (ovales). <b>Contexte</b> : les éléments extérieurs en relation avec le système.',
      '<b>Exigences</b> : ce que le système doit respecter, avec un identifiant et souvent une valeur mesurable (durée, température…).'
    ],
    retenirAr: 'مخطط حالات الاستعمال يبين الفاعلين والخدمات، ومخطط السياق يبين العناصر الخارجية، ومخطط المتطلبات يبين ما يجب احترامه بقيم قابلة للقياس.',
    voc: [['un acteur', 'فاعل'], ['un cas d’utilisation', 'حالة استعمال'], ['le contexte', 'السياق'], ['une exigence', 'متطلب'], ['un diagramme', 'مخطط']]
  });
})();
