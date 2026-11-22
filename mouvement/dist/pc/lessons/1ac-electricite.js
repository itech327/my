/* @meta {"id":"1ac-electricite","level":"1","order":8,"theme":"Électricité","title":"L'électricité autour de nous","ar":"الكهرباء من حولنا","lead":"Coupure de courant un soir : la télévision s'éteint, mais la lampe de poche fonctionne encore. Chaque appareil a besoin d'une source, et toutes ne se valent pas."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  // appareil -> [source, ce qu'il produit, branché au secteur ?]
  var APP = {
    'télévision': ['secteur 220 V', 'lumière et son', 1], 'lampe de poche': ['piles', 'lumière', 0],
    'téléphone': ['batterie', 'lumière et son', 0], 'ventilateur': ['secteur 220 V', 'mouvement', 1], 'radiateur': ['secteur 220 V', 'chaleur', 1]
  };

  /* source → appareil → effet, et un éclair si le secteur est coupé */
  function chaine(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), boxes = [];
    ['source', 'récepteur', 'effet'].forEach(function (n, i) {
      var x = 12 + i * 118, r = S('rect', { x: x, y: 70, width: 108, height: 64, rx: 10, fill: '#1d1f23', stroke: '#5b6068', 'stroke-width': 2 }, g);
      T(g, x + 54, 60, n, 'tag'); var t = T(g, x + 54, 106, '', 'lbl'); t.style.fontSize = '11px'; boxes.push({ r: r, t: t });
      if (i < 2) S('path', { d: 'M' + (x + 109) + ' 102 h8 l-4 -4 m4 4 l-4 4', stroke: '#9aa0a8', fill: 'none', 'stroke-width': 2 }, g);
    });
    var cut = S('path', { d: 'M60 150 l10 18 h-8 l8 18', stroke: '#e5484d', 'stroke-width': 3, fill: 'none' }, g), tc = T(g, 76, 190, 'coupure', 'tag', 'start');
    g.set = function (app, coupure) {
      var a = APP[app], marche = !(coupure && a[2]);
      boxes[0].t.textContent = a[0]; boxes[1].t.textContent = app; boxes[2].t.textContent = marche ? a[1] : 'rien';
      boxes.forEach(function (b, i) { b.r.setAttribute('stroke', marche ? 'var(--acc)' : (i === 0 ? '#e5484d' : '#5b6068')); });
      cut.style.opacity = tc.style.opacity = coupure ? 1 : 0;
      return marche;
    };
    return g;
  }

  MV.lesson({
    id: '1ac-electricite',
    objectif: {
      fr: 'Distinguer les sources d\'électricité (piles, batteries, secteur) et les récepteurs, connaître leurs effets et le danger du secteur.',
      ar: 'التمييز بين منابع الكهرباء (الأعمدة، البطاريات، الشبكة الكهربائية) والمستقبلات، ومعرفة مفعولاتها وخطر التيار القطاعي.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Une coupure de courant',
      hud: [['t', 'télévision'], ['l', 'lampe de poche'], ['q', 'pourquoi ?']],
      draw: function (svg) { var e = {}; e.c = chaine(svg); return e; },
      steps: [
        { cap: 'Le soir, on regarde la **télévision**.', hud: { t: ['allumée'], l: '–', q: '–' }, run: function (e) { e.c.set('télévision', 0); } },
        { cap: '**Coupure** de courant : la télévision s\'éteint.', hud: { t: ['éteinte'], l: '–', q: '–' }, run: function (e) { e.c.set('télévision', 1); } },
        { cap: 'Mais la **lampe de poche** marche encore. Pourquoi ? On le saura à la fin.', hud: { t: 'éteinte', l: ['allumée'], q: ['?'] }, run: function (e) { e.c.set('lampe de poche', 1); } }
      ]
    },

    predire: {
      q: "Pendant une coupure de courant, la télévision s'éteint mais la lampe de poche marche encore. Pourquoi ?",
      ar: "أثناء انقطاع الكهرباء ينطفئ التلفاز لكن المصباح اليدوي يشتغل. لماذا؟",
      o: ["La lampe de poche n'a pas besoin d'électricité", "La lampe de poche a sa propre source, une pile", "La télévision consomme trop"],
      a: 1,
      e: "Un récepteur a besoin d'une source. La télévision utilise le secteur, qui est coupé. La lampe de poche utilise sa propre pile.",
      ear: "كل جهاز يحتاج مصدراً: التلفاز يعتمد على القطاع المنقطع، أما المصباح اليدوي ففيه عموده الخاص."
    },

    prepare: [
      ['Une pile fournit de l\'électricité.', true, 'C\'est une source portable.'],
      ['Une lampe produit de l\'électricité.', false, 'Elle en consomme : c\'est un récepteur.'],
      ['Il est dangereux de toucher les fils d\'une prise.', true, 'La tension du secteur est de 220 V.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'Sources et récepteurs',
      hud: [['s', 'source'], ['r', 'récepteur'], ['e', 'effet']],
      draw: function (svg) { var e = {}; e.c = chaine(svg); return e; },
      steps: [
        { cap: 'Une **source** fournit l\'électricité : pile, batterie, ou **secteur** (la prise).', ar: 'المنبع يزود بالكهرباء: عمود، بطارية، أو الشبكة الكهربائية.', hud: { s: ['pile, batterie, secteur'], r: '–', e: '–' }, run: function (e) { e.c.set('lampe de poche', 0); } },
        { cap: 'Un **récepteur** utilise l\'électricité pour produire un effet.', ar: 'المستقبل يستعمل الكهرباء لإحداث مفعول.', hud: { s: 'piles', r: ['lampe de poche'], e: ['lumière'] }, run: function (e) { e.c.set('lampe de poche', 0); } },
        { cap: 'Effets : **lumière**, **chaleur**, **mouvement**, **son**.', ar: 'المفعولات: ضوئي، حراري، حركي، صوتي.', hud: { s: 'secteur', r: 'radiateur', e: ['chaleur'] }, run: function (e) { e.c.set('radiateur', 0); } },
        { cap: 'Un ventilateur transforme l\'électricité en **mouvement** grâce à son moteur.', ar: 'المروحة تحول الكهرباء إلى حركة بواسطة محركها.', hud: { s: 'secteur', r: 'ventilateur', e: ['mouvement'] }, run: function (e) { e.c.set('ventilateur', 0); } },
        { cap: 'Une pile : **1,5 V** ou 4,5 V, sans danger. Le secteur : **220 V**, **dangereux**.', ar: 'العمود: [[1,5 V]] أو [[4,5 V]] بلا خطر. الشبكة: [[220 V]]، خطيرة.', hud: { s: ['220 V'], r: '–', e: ['danger'] }, run: function (e) { e.c.set('télévision', 0); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Coupe le courant et teste chaque appareil. Lesquels marchent encore ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Source, récepteur, effet' }, st);
          var ch = chaine(svg), app = 'télévision', cp = 0, vu = {}, set = MV.hud(c, [['a', 'appareil'], ['c', 'courant'], ['m', 'fonctionne ?', 1]]);
          function upd() { var m = ch.set(app, cp); set('a', app); set('c', cp ? 'coupé' : 'normal'); set('m', m ? 'oui' : 'non'); if (cp) vu[app] = 1; if (Object.keys(vu).length >= 3) done(); }
          var r1 = MV.H('div', 'row', '', c); Object.keys(APP).forEach(function (k) { var b = MV.H('button', 'btn', k, r1); b.onclick = function () { app = k; upd(); }; });
          var r2 = MV.H('div', 'row', '', c), bc = MV.H('button', 'btn', 'Couper / rétablir le courant', r2); bc.onclick = function () { cp = 1 - cp; upd(); };
          upd();
          MV.H('p', 'small', 'Teste au moins trois appareils pendant la coupure.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Classe les éléments d\'une lampe de chevet.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. La prise murale est :', o: ['une source', 'un récepteur'], a: 0 },
            { type: 'opt', q: 'Étape 2. L\'ampoule est :', o: ['un récepteur', 'une source'], a: 0 },
            { type: 'opt', q: 'Étape 3. On change l\'ampoule :', o: ['après avoir débranché', 'lampe branchée'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Une batterie de téléphone est :', o: ['une source', 'un récepteur'], a: 0 },
      { lvl: 'Niveau 2', q: 'Un fer à repasser transforme l\'électricité surtout en :', o: ['chaleur', 'mouvement'], a: 0 },
      { lvl: 'Niveau 3', q: 'La tension du secteur au Maroc est de :', o: ['220 V', '4,5 V'], a: 0 },
      { lvl: 'Niveau 4', q: 'Une lampe de poche utilise 3 piles de 1,5 V en série. Tension totale (V) ?', a: 4.5, unit: 'V' }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'La coupure',
      hud: [['t', 'télévision'], ['l', 'lampe de poche'], ['r', 'raison']],
      draw: function (svg) { var e = {}; e.c = chaine(svg); return e; },
      steps: [
        { cap: 'La télévision dépend du **secteur** : coupé, elle s\'arrête.', hud: { t: ['secteur'], l: '–', r: '–' }, run: function (e) { e.c.set('télévision', 1); } },
        { cap: 'La lampe de poche a sa propre source : des **piles**.', ar: 'التلفاز يعمل بالشبكة الكهربائية، أما المصباح اليدوي فله منبعه الخاص: الأعمدة.', hud: { t: 'secteur', l: ['piles'], r: ['sources différentes'] }, run: function (e) { e.c.set('lampe de poche', 1); } }
      ]
    },

    retenir: [
      'Une <b>source</b> fournit l\'électricité (pile, batterie, secteur) ; un <b>récepteur</b> l\'utilise pour produire lumière, chaleur, mouvement ou son.',
      'Une pile délivre une faible tension (1,5 V, 4,5 V). Le <b>secteur</b> (220 V) est <b>dangereux</b> : on ne touche jamais une prise ou un fil dénudé.'
    ],
    retenirAr: 'المنبع يزود بالكهرباء (عمود، بطارية، الشبكة) والمستقبل يستعملها لإنتاج الضوء أو الحرارة أو الحركة أو الصوت. التيار القطاعي [[220 V]] خطير.',
    voc: [['une source', 'منبع'], ['un récepteur', 'مستقبل'], ['une pile', 'عمود'], ['le secteur', 'الشبكة الكهربائية'], ['la tension', 'التوتر']]
  });
})();
