/* @meta {"id":"1ac-ressources-eau","level":"1","order":7,"theme":"Géologie","title":"Les ressources en eau","ar":"الموارد المائية","lead":"Le puits du village baisse chaque été. D'où vient son eau, et pourquoi faut-il l'économiser ? On suit le cycle de l'eau jusqu'à la nappe."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var ETAPES = ['ev', 'co', 'pr', 'ru', 'in'];

  /* cycle de l'eau : mer, nuage, montagne, sol, nappe, puits */
  function cycle(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), fl = {};
    S('path', { d: 'M0 150 H120 V210 H0 Z', fill: 'rgba(80,140,220,.45)' }, g); T(g, 50, 172, 'mer', 'tag');
    S('path', { d: 'M120 150 L190 70 L250 150 H360 V210 H120 Z', fill: '#6b5a4a' }, g);
    var nappe = S('rect', { x: 200, y: 182, width: 160, height: 18, fill: 'rgba(80,140,220,.6)' }, g); nappe.style.transition = 'height .8s, y .8s'; T(g, 280, 196, 'nappe', 'tag');
    S('rect', { x: 318, y: 120, width: 12, height: 70, fill: '#2a2d33', stroke: '#9aa0a8' }, g); T(g, 324, 112, 'puits', 'tag');
    var nuage = S('path', { d: 'M110 50 a14 14 0 0 1 26 -8 a16 16 0 0 1 30 4 a12 12 0 0 1 -4 22 h-48 a10 10 0 0 1 -4 -18 z', fill: '#d9dde2' }, g);
    var A = function (k, d, lab, lx, ly) { var p = S('g', {}, g); S('path', { d: d, stroke: '#7fb2ff', 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '6 4' }, p); T(p, lx, ly, lab, 'tag'); fl[k] = p; };
    A('ev', 'M50 140 V70', 'évaporation', 52, 60);
    A('co', 'M60 64 Q90 40 110 54', 'condensation', 98, 28);
    A('pr', 'M170 75 V110 M182 75 V105 M194 75 V110', 'précipitations', 230, 70);
    A('ru', 'M200 100 Q160 130 125 148', 'ruissellement', 140, 120);
    A('in', 'M230 150 V178', 'infiltration', 262, 166);
    g.set = function (on, nap) {
      Object.keys(fl).forEach(function (k) { fl[k].style.opacity = on.indexOf(k) >= 0 ? 1 : 0.12; });
      var h = nap == null ? 18 : nap; nappe.setAttribute('y', 200 - h); nappe.setAttribute('height', h);
      nuage.style.opacity = on.indexOf('co') >= 0 || on.indexOf('pr') >= 0 ? 1 : 0.35;
    };
    return g;
  }

  MV.lesson({
    id: '1ac-ressources-eau',
    objectif: {
      fr: 'Décrire le cycle de l\'eau, distinguer eaux de surface et eaux souterraines, et proposer des gestes pour préserver la ressource.',
      ar: 'وصف دورة الماء، والتمييز بين المياه السطحية والمياه الجوفية، واقتراح سلوكات للمحافظة على هذه الموارد.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Le puits du village',
      hud: [['s', 'saison'], ['n', 'niveau du puits'], ['q', 'd\'où vient l\'eau ?']],
      draw: function (svg) { var e = {}; e.c = cycle(svg); return e; },
      steps: [
        { cap: 'En hiver, le **puits** du village est bien rempli.', hud: { s: ['hiver'], n: ['haut'], q: '–' }, run: function (e) { e.c.set([], 18); } },
        { cap: 'À la fin de l\'été, son niveau a **beaucoup baissé**.', hud: { s: ['été'], n: ['bas'], q: '–' }, run: function (e) { e.c.set([], 5); } },
        { cap: 'D\'où vient l\'eau du puits ? On le saura à la fin.', hud: { s: 'été', n: 'bas', q: ['?'] }, run: function (e) { e.c.set([], 5); } }
      ]
    },

    prepare: [
      ['L\'eau de mer est salée.', true, 'On ne peut pas la boire sans la dessaler.'],
      ['Toute l\'eau de pluie reste à la surface du sol.', false, 'Une partie s\'infiltre dans le sol.'],
      ['Le Maroc connaît des périodes de sécheresse.', true, 'L\'eau douce y est précieuse.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Le cycle de l\'eau',
      hud: [['e', 'étape'], ['d', 'description'], ['r', 'réserve']],
      draw: function (svg) { var e = {}; e.c = cycle(svg); return e; },
      steps: [
        { cap: '**Évaporation** : le Soleil chauffe la mer, l\'eau devient vapeur.', ar: 'التبخر: تسخن الشمس البحر فيتحول الماء إلى بخار.', hud: { e: ['évaporation'], d: 'liquide → vapeur', r: 'mer' }, run: function (e) { e.c.set(['ev']); } },
        { cap: '**Condensation** : en altitude, la vapeur forme des **nuages**.', ar: 'التكاثف: في الأعالي يكون البخار السحب.', hud: { e: ['condensation'], d: 'vapeur → gouttelettes', r: 'nuages' }, run: function (e) { e.c.set(['ev', 'co']); } },
        { cap: '**Précipitations** : pluie et neige tombent sur les montagnes.', ar: 'التساقطات: الأمطار والثلوج.', hud: { e: ['précipitations'], d: 'pluie, neige', r: 'sol' }, run: function (e) { e.c.set(['co', 'pr']); } },
        { cap: '**Ruissellement** : une partie coule vers les rivières, les barrages et la mer. Ce sont les **eaux de surface**.', ar: 'الجريان السطحي: يتجه جزء من الماء نحو الأنهار والسدود والبحر، وهذه هي المياه السطحية.', hud: { e: ['ruissellement'], d: 'eaux de surface', r: ['rivières, barrages'] }, run: function (e) { e.c.set(['pr', 'ru']); } },
        { cap: '**Infiltration** : l\'autre partie traverse le sol et remplit la **nappe phréatique** : les **eaux souterraines**.', ar: 'التسرب: الجزء الآخر يتسرب في التربة ويملأ الفرشة المائية، وهذه هي المياه الجوفية.', hud: { e: ['infiltration'], d: 'eaux souterraines', r: ['nappe'] }, run: function (e) { e.c.set(['pr', 'in'], 18); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Règle la pluie de l\'hiver et le pompage de l\'été : la nappe se recharge-t-elle ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Cycle de l\'eau et nappe' }, st);
          var cy = cycle(svg), pluie = 4, pompe = 8, set = MV.hud(c, [['p', 'recharge'], ['m', 'pompage'], ['b', 'bilan', 1]]);
          function upd() { var b = pluie - pompe; cy.set(['pr', 'in'], Math.max(2, Math.min(18, 10 + b * 1.5))); set('p', pluie); set('m', pompe); set('b', b >= 0 ? 'nappe stable' : 'nappe qui baisse'); if (b >= 0) done(); }
          MV.slider(c, { label: 'pluie', min: 0, max: 10, value: 4 }, function (v) { pluie = v; upd(); });
          MV.slider(c, { label: 'pompage', min: 0, max: 10, value: 8 }, function (v) { pompe = v; upd(); });
          upd();
          MV.H('p', 'small', 'La nappe reste stable si on ne pompe pas plus que ce qui s\'infiltre.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Associe chaque réserve à son type.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Un barrage contient des eaux :', o: ['de surface', 'souterraines'], a: 0 },
            { type: 'opt', q: 'Étape 2. Un puits puise des eaux :', o: ['souterraines', 'de surface'], a: 0 },
            { type: 'opt', q: 'Étape 3. Un geste pour économiser l\'eau :', o: ['fermer le robinet en se brossant les dents', 'arroser à midi en été'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'La transformation de l\'eau liquide en vapeur s\'appelle :', o: ['l\'évaporation', 'la condensation'], a: 0 },
      { lvl: 'Niveau 2', q: 'L\'eau qui pénètre dans le sol :', o: ['s\'infiltre', 'ruisselle'], a: 0 },
      { lvl: 'Niveau 3', q: 'Une nappe phréatique est une réserve d\'eau :', o: ['souterraine', 'de surface'], a: 0 },
      { lvl: 'Niveau 4', q: 'Un robinet qui fuit perd 5 L par heure. Combien de litres par jour ?', a: 120, unit: 'L' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'L\'eau du puits',
      hud: [['o', 'origine'], ['p', 'problème'], ['g', 'geste']],
      draw: function (svg) { var e = {}; e.c = cycle(svg); return e; },
      steps: [
        { cap: 'L\'eau du puits vient de la **nappe**, rechargée par l\'**infiltration** de la pluie.', hud: { o: ['nappe phréatique'], p: '–', g: '–' }, run: function (e) { e.c.set(['pr', 'in'], 18); } },
        { cap: 'En été, on pompe plus qu\'il ne pleut : la nappe baisse. Il faut **économiser** l\'eau.', ar: 'ماء البئر من الفرشة المائية التي يغذيها تسرب الأمطار، والضخ المفرط يخفضها، لذا يجب ترشيد استهلاك الماء.', hud: { o: 'nappe phréatique', p: ['pompage > recharge'], g: ['économiser'] }, run: function (e) { e.c.set([], 4); } }
      ]
    },

    retenir: [
      'Le <b>cycle de l\'eau</b> : évaporation, condensation, précipitations, puis <b>ruissellement</b> (eaux de surface) ou <b>infiltration</b> (eaux souterraines, nappes).',
      'L\'eau douce est <b>limitée</b> ; on la préserve en évitant le gaspillage et la pollution.'
    ],
    retenirAr: 'دورة الماء: تبخر ثم تكاثف ثم تساقطات، ثم جريان سطحي نحو المياه السطحية أو تسرب نحو المياه الجوفية. الماء العذب محدود، فنحافظ عليه بتجنب التبذير والتلوث.',
    voc: [['l\'évaporation', 'التبخر'], ['la condensation', 'التكاثف'], ['l\'infiltration', 'التسرب'], ['la nappe phréatique', 'الفرشة المائية'], ['le ruissellement', 'الجريان السطحي']]
  });
})();
