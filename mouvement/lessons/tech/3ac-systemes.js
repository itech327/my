/* @meta {"id":"3ac-systemes","level":"3","order":1,"theme":"Systèmes techniques","title":"Évolution des systèmes techniques","ar":"تطور الأنظمة التقنية","lead":"Pour arroser un champ, on a d’abord porté des seaux, puis utilisé une pompe à moteur, puis laissé un capteur décider. Qui fournit l’énergie, qui commande ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, NOMS = ['', 'primitif', 'mécanisé', 'automatisé', 'robotisé'];

  function personne(g, x, y, col) {
    S('circle', { cx: x, cy: y - 34, r: 7, fill: 'none', stroke: col, 'stroke-width': 2.5 }, g);
    S('path', { d: 'M' + x + ' ' + (y - 27) + 'V' + (y - 8) + 'M' + x + ' ' + (y - 8) + 'L' + (x - 7) + ' ' + y + 'M' + x + ' ' + (y - 8) + 'L' + (x + 7) + ' ' + y + 'M' + (x - 9) + ' ' + (y - 20) + 'H' + (x + 9), stroke: col, 'stroke-width': 2.5, fill: 'none' }, g);
  }
  function goutte(g, d, dur, delay) {
    var c = S('circle', { r: 3.5, fill: '#7fb2ff' }, g);
    S('animateMotion', { dur: dur, begin: delay || '0s', repeatCount: 'indefinite', path: d }, c);
  }

  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    // décor fixe : sol, puits, champ
    S('line', { x1: 0, y1: 176, x2: 360, y2: 176, stroke: '#5b6068', 'stroke-width': 2 }, g);
    S('rect', { x: 18, y: 140, width: 40, height: 36, fill: '#1d3550', stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    T(g, 38, 196, 'puits', 'tag');
    for (var i = 0; i < 5; i++) {
      var px = 236 + i * 24;
      S('path', { d: 'M' + px + ' 176V160M' + px + ' 166L' + (px - 7) + ' 159M' + px + ' 163L' + (px + 7) + ' 156', stroke: '#56d07f', 'stroke-width': 2.5, fill: 'none' }, g);
    }
    T(g, 284, 196, 'champ', 'tag');
    var dyn = S('g', {}, g);
    g.set = function (k) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (!k) return;
      if (k === 1) {
        var w = S('g', {}, dyn);
        personne(w, 0, 174, '#f2c14e');
        S('rect', { x: 10, y: 138, width: 14, height: 14, rx: 2, fill: '#1d3550', stroke: '#7fb2ff', 'stroke-width': 2 }, w);
        S('animateTransform', { attributeName: 'transform', type: 'translate', values: '80 0;210 0;80 0', dur: '4s', repeatCount: 'indefinite' }, w);
        T(dyn, 150, 40, 'des seaux portés à la main', 'tag');
        return;
      }
      // pompe à moteur et tuyau
      S('rect', { x: 64, y: 118, width: 46, height: 34, rx: 6, fill: 'var(--acc-bg)', stroke: 'var(--acc)', 'stroke-width': 2.5 }, dyn);
      T(dyn, 87, 140, 'M', 'lbl big');
      S('path', { d: 'M38 140V128H64M110 128H226V150', stroke: '#9aa0a8', 'stroke-width': 4, fill: 'none' }, dyn);
      goutte(dyn, 'M38 140V128H64', '1s'); goutte(dyn, 'M110 128H226V156', '1.4s'); goutte(dyn, 'M110 128H226V156', '1.4s', '.7s');
      var hub = S('g', { transform: 'translate(87 113)' }, dyn);
      S('path', { d: 'M-8 0H8M0 -8V8', stroke: '#fff', 'stroke-width': 2.5 }, hub);
      S('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 0 0', to: '360 0 0', dur: '.8s', repeatCount: 'indefinite', additive: 'sum' }, hub);
      if (k === 2) {
        personne(dyn, 150, 174, '#f2c14e');
        S('path', { d: 'M159 154L118 140', stroke: '#f2c14e', 'stroke-width': 2.5 }, dyn);
        T(dyn, 150, 96, 'une personne appuie sur l’interrupteur', 'tag');
        return;
      }
      // capteur d’humidité dans le sol et boîtier de commande
      S('path', { d: 'M318 186V160', stroke: '#e5484d', 'stroke-width': 3 }, dyn);
      T(dyn, 312, 150, 'capteur', 'tag', 'end');
      S('rect', { x: 140, y: 30, width: 104, height: 40, rx: 8, fill: '#1d1f22', stroke: '#56d07f', 'stroke-width': 2 }, dyn);
      T(dyn, 192, 54, k === 3 ? 'commande auto' : 'carte programmée', 'tag');
      S('path', { d: 'M318 160V50H244M140 50H87V112', stroke: '#56d07f', 'stroke-width': 1.5, 'stroke-dasharray': '4 3', fill: 'none' }, dyn);
      var sig = S('circle', { r: 3, fill: '#56d07f' }, dyn);
      S('animateMotion', { dur: '2s', repeatCount: 'indefinite', path: 'M318 160V50H244M140 50H87V112' }, sig);
      if (k === 4) {
        T(dyn, 166, 18, 'si sol sec et pas de pluie prévue : arroser', 'tag');
        S('rect', { x: 318, y: 6, width: 38, height: 22, rx: 4, fill: 'none', stroke: '#7fb2ff', 'stroke-width': 2 }, dyn);
        T(dyn, 337, 21, 'Wi-Fi', 'tag');
      } else T(dyn, 192, 18, 'le capteur décide seul', 'tag');
    };
    return g;
  }
  function info(k) {
    return [null, ['humaine', 'humaine'], ['moteur', 'humaine'], ['moteur', 'automatique'], ['moteur', 'programmable']][k];
  }

  MV.lesson({
    id: '3ac-systemes',
    objectif: {
      fr: 'Classer un système technique (primitif, mécanisé, automatisé, robotisé) selon qui fournit l’énergie et qui commande, et distinguer commande câblée et commande programmée.',
      ar: 'تصنيف نظام تقني (بدائي، ممكنن، آلي، مُرَوْبَت) حسب مصدر الطاقة ومن يتحكم فيه، والتمييز بين التحكم الموصول والتحكم المبرمج.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Arroser un champ',
      hud: [['e', 'énergie'], ['c', 'commande'], ['s', 'système']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Il faut **arroser un champ** avec l’eau du puits.', hud: { e: '–', c: '–', s: '–' }, run: function (e) { e.s.set(0); } },
        { cap: 'Autrefois, on portait des **seaux** : l’humain fournit la force et décide.', hud: { e: ['humaine'], c: ['humaine'], s: '?' }, run: function (e) { e.s.set(1); } },
        { cap: 'Aujourd’hui, une pompe démarre **toute seule** quand le sol est sec. Qu’est-ce qui a changé ?', hud: { e: ['moteur'], c: ['automatique'], s: '?' }, run: function (e) { e.s.set(3); } }
      ]
    },

    prepare: [
      ['Une pompe électrique transforme l’énergie électrique en mouvement.', true, 'Son moteur fait tourner la pompe qui pousse l’eau.'],
      ['Un capteur permet à une machine de « savoir » ce qui se passe.', true, 'Il donne une information : sol sec, voiture présente, porte ouverte…'],
      ['Une brouette fonctionne avec un moteur.', false, 'C’est l’humain qui la pousse : énergie musculaire.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Les quatre types de systèmes',
      hud: [['e', 'énergie'], ['c', 'commande'], ['s', 'système']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Système **primitif** : l’énergie est **humaine** et la commande est **humaine**.', ar: 'النظام البدائي: الطاقة بشرية والتحكم بشري.', hud: { e: ['humaine'], c: ['humaine'], s: ['primitif'] }, run: function (e) { e.s.set(1); } },
        { cap: 'Système **mécanisé** : un **moteur** fournit l’énergie, mais une **personne** commande.', ar: 'النظام الممكنن: المحرك يوفر الطاقة، لكن الإنسان هو من يتحكم.', hud: { e: ['moteur'], c: 'humaine', s: ['mécanisé'] }, run: function (e) { e.s.set(2); } },
        { cap: 'Système **automatisé** : un **capteur** donne l’information et la machine **décide seule**.', ar: 'النظام الآلي: لاقط يعطي المعلومة والآلة تقرر وحدها.', hud: { e: 'moteur', c: ['automatique'], s: ['automatisé'] }, run: function (e) { e.s.set(3); } },
        { cap: 'Système **robotisé** : la commande est **programmable**. On change le programme, le système change de tâche.', ar: 'النظام المُرَوْبَت: التحكم قابل للبرمجة، نغير البرنامج فتتغير المهمة.', hud: { e: 'moteur', c: ['programmable'], s: ['robotisé'] }, run: function (e) { e.s.set(4); } },
        { cap: 'Commande **câblée** : la logique est dans les fils. Commande **programmée** : elle est dans un programme.', ar: 'التحكم الموصول: المنطق في الأسلاك. التحكم المبرمج: المنطق في برنامج.', hud: { e: 'moteur', c: ['câblée / programmée'], s: '–' }, run: function (e) { e.s.set(4); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Fais évoluer le système d’arrosage, étape par étape, jusqu’au système automatisé.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Système d’arrosage' }, st);
          var s = scene(svg), set = MV.hud(c, [['e', 'énergie'], ['c', 'commande'], ['s', 'système', 1]]);
          MV.slider(c, { label: 'étape', min: 1, max: 4, value: 1 }, function (k) { s.set(k); set('e', info(k)[0]); set('c', info(k)[1]); set('s', NOMS[k]); if (k === 3) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Classe ces trois objets.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Une houe pour retourner la terre :', o: ['système primitif', 'système mécanisé', 'système automatisé'], a: 0, e: 'Force et décision humaines.' },
            { type: 'opt', q: 'Étape 2. Un tracteur conduit par un agriculteur :', o: ['système primitif', 'système mécanisé', 'système automatisé'], a: 1, e: 'Le moteur travaille, le conducteur commande.' },
            { type: 'opt', q: 'Étape 3. Un lave-linge qui suit son cycle seul :', o: ['système primitif', 'système mécanisé', 'système automatisé'], a: 2, e: 'Moteur, capteurs et cycle fixe : automatisé.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Dans un système mécanisé, l’énergie est fournie par :', o: ['un moteur', 'l’utilisateur'], a: 0 },
      { lvl: 'Niveau 2', q: 'Une barrière de parking qui s’ouvre seule quand une voiture arrive est :', o: ['automatisée', 'mécanisée', 'primitive'], a: 0 },
      { lvl: 'Niveau 3', q: 'On change le fonctionnement d’un système en modifiant un programme. Sa commande est :', o: ['programmée', 'câblée'], a: 0 },
      { lvl: 'Niveau 4', q: 'Une barrière s’ouvre en 4 s, reste ouverte 10 s puis se ferme en 4 s. Durée du cycle (s) ?', a: 18, hint: 'Additionne les trois phases.' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Ce qui a changé',
      hud: [['e', 'énergie'], ['c', 'commande'], ['s', 'système']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Du seau à la pompe : c’est l’**énergie** qui a changé, l’humain ne force plus.', hud: { e: ['moteur'], c: 'humaine', s: 'mécanisé' }, run: function (e) { e.s.set(2); } },
        { cap: 'De la pompe au capteur : c’est la **commande** qui a changé. Le système est **automatisé**.', ar: 'من المضخة إلى اللاقط: تغير التحكم، فأصبح النظام آليا.', hud: { e: 'moteur', c: ['automatique'], s: ['automatisé'] }, run: function (e) { e.s.set(3); } }
      ]
    },

    retenir: [
      'On classe un système selon deux questions : <b>qui fournit l’énergie ?</b> et <b>qui commande ?</b> Primitif : humain et humain. Mécanisé : moteur et humain. Automatisé : moteur et commande automatique. Robotisé : moteur et commande programmable.',
      'Une commande <b>câblée</b> est fixée par les fils ; une commande <b>programmée</b> se modifie en changeant le programme.'
    ],
    retenirAr: 'نصنف النظام بسؤالين: من يوفر الطاقة؟ ومن يتحكم؟ البدائي: الإنسان والإنسان. الممكنن: محرك وإنسان. الآلي: محرك وتحكم آلي. المُرَوْبَت: محرك وتحكم قابل للبرمجة.',
    voc: [['un système technique', 'نظام تقني'], ['mécanisé', 'ممكنن'], ['automatisé', 'آلي'], ['programmable', 'قابل للبرمجة'], ['la commande', 'التحكم']]
  });
})();
