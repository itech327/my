/* @meta {"id":"1ac-protection","level":"1","order":13,"theme":"Électricité","title":"Protection contre les dangers du courant","ar":"الوقاية من أخطار التيار الكهربائي","lead":"Une multiprise chauffe : radiateur, fer à repasser et bouilloire branchés ensemble. Avant l'incendie, un petit appareil coupe tout. Lequel, et pourquoi ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, CAL = 16; // calibre du fusible en A
  var APP = { 'lampe': 0.3, 'télévision': 0.5, 'radiateur': 9, 'fer à repasser': 5, 'bouilloire': 8 };

  function multiprise(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (liste, o) {
      o = o || {};
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var I = liste.reduce(function (s, k) { return s + APP[k]; }, 0), coupe = I > CAL, chaud = I > 12;
      S('rect', { x: 30, y: 30, width: 70, height: 40, rx: 6, fill: '#1d1f23', stroke: coupe ? '#e5484d' : '#56d07f', 'stroke-width': 3 }, dyn);
      T(dyn, 65, 54, coupe ? 'coupé' : CAL + ' A', 'lbl'); T(dyn, 65, 88, o.dis ? 'disjoncteur' : 'fusible', 'tag');
      S('path', { d: 'M100 50 H150 V110', stroke: coupe ? '#5b6068' : '#f2c14e', 'stroke-width': 4, fill: 'none' }, dyn);
      S('rect', { x: 110, y: 110, width: 230, height: 32, rx: 8, fill: chaud && !coupe ? 'rgba(229,72,77,.5)' : '#2a2d33', stroke: '#9aa0a8', 'stroke-width': 2 }, dyn);
      liste.forEach(function (k, i) { var x = 135 + i * 56; S('circle', { cx: x, cy: 126, r: 9, fill: '#141517', stroke: '#e9e9ea' }, dyn); S('line', { x1: x, y1: 135, x2: x, y2: 165, stroke: coupe ? '#5b6068' : '#e9e9ea', 'stroke-width': 3 }, dyn); T(dyn, x, i % 2 ? 194 : 180, k.split(' ')[0], 'tag'); });
      T(dyn, 340, 100, 'I = ' + String(Math.round(I * 10) / 10).replace('.', ',') + ' A', 'lbl acc', 'end');
      return [I, coupe];
    };
    return g;
  }

  MV.lesson({
    id: '1ac-protection',
    objectif: {
      fr: 'Connaître les dangers du courant électrique (électrocution, court-circuit, surcharge) et les moyens de protection : fusible, disjoncteur, prise de terre, règles de sécurité.',
      ar: 'معرفة أخطار التيار الكهربائي (الصعق، الدارة القصيرة، الحمولة الزائدة) ووسائل الوقاية: المصهر، الفاصل، المأخذ الأرضي، وقواعد السلامة.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'La multiprise surchargée',
      hud: [['a', 'appareils'], ['m', 'multiprise'], ['q', 'qui coupe ?']],
      draw: function (svg) { var e = {}; e.m = multiprise(svg); return e; },
      steps: [
        { cap: 'Un **radiateur** est branché sur une multiprise.', hud: { a: ['radiateur'], m: 'normale', q: '–' }, run: function (e) { e.m.set(['radiateur']); } },
        { cap: 'On ajoute un **fer à repasser** : la multiprise **chauffe**.', hud: { a: ['radiateur, fer'], m: ['chauffe'], q: '–' }, run: function (e) { e.m.set(['radiateur', 'fer à repasser']); } },
        { cap: 'Puis une **bouilloire**… Tout s\'éteint d\'un coup. Qui a coupé, et pourquoi ? On le saura à la fin.', hud: { a: '3 appareils', m: 'chauffe', q: ['?'] }, run: function (e) { e.m.set(['radiateur', 'fer à repasser', 'bouilloire']); } }
      ]
    },

    prepare: [
      ['Le courant du secteur (220 V) peut être mortel.', true, 'Il peut provoquer une électrocution.'],
      ['On peut toucher un appareil électrique avec les mains mouillées sans risque.', false, 'L\'eau rend le corps plus conducteur : c\'est très dangereux.'],
      ['Un fil qui chauffe trop peut provoquer un incendie.', true, 'C\'est le danger de la surcharge.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'Dangers et protections',
      hud: [['d', 'danger'], ['p', 'protection'], ['e', 'effet']],
      draw: function (svg) { var e = {}; e.m = multiprise(svg); return e; },
      steps: [
        { cap: 'Chaque appareil appelle un courant. Sur une multiprise, les intensités **s\'ajoutent**.', ar: 'كل جهاز يستهلك تيارا، وفي المشترك الكهربائي تضاف الشدات.', hud: { d: 'intensités ajoutées', p: '–', e: '14 A' }, run: function (e) { e.m.set(['radiateur', 'fer à repasser']); } },
        { cap: 'Trop d\'intensité : **surcharge**. Les fils chauffent : risque d\'**incendie**.', ar: 'الحمولة الزائدة تسخن الأسلاك وقد تسبب حريقا.', hud: { d: ['surcharge'], p: '–', e: ['échauffement'] }, run: function (e) { e.m.set(['radiateur', 'fer à repasser']); } },
        { cap: 'Le **fusible** fond, ou le **disjoncteur** déclenche, au-delà de son **calibre** (ici 16 A) : le courant est coupé.', ar: 'المصهر ينصهر أو الفاصل يفصل التيار عندما تتجاوز الشدة عياره.', hud: { d: 'surcharge', p: ['fusible, disjoncteur'], e: ['coupure'] }, run: function (e) { e.m.set(['radiateur', 'fer à repasser', 'bouilloire'], { dis: 1 }); } },
        { cap: 'Le **court-circuit** : deux fils se touchent directement. Le courant devient énorme ; le fusible coupe aussi.', ar: 'الدارة القصيرة: تلامس سلكين مباشرة، فتصبح الشدة كبيرة جدا.', hud: { d: ['court-circuit'], p: 'fusible', e: 'coupure' }, run: function (e) { e.m.set(['radiateur', 'fer à repasser', 'bouilloire']); } },
        { cap: 'Contre l\'**électrocution** : **prise de terre**, disjoncteur différentiel, pas d\'eau près des prises, ne jamais toucher un fil dénudé.', ar: 'ضد الصعق الكهربائي: المأخذ الأرضي، والفاصل التفاضلي، وإبعاد الماء عن المآخذ.', hud: { d: ['électrocution'], p: ['prise de terre'], e: 'protège les personnes' }, run: function (e) { e.m.set(['lampe', 'télévision']); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Branche des appareils sur la multiprise (fusible 16 A). Déclenche la coupure.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Multiprise et fusible' }, st);
          var m = multiprise(svg), liste = [], set = MV.hud(c, [['n', 'appareils'], ['i', 'intensité'], ['e', 'état', 1]]);
          function upd() { var r = m.set(liste); set('n', liste.length); set('i', String(Math.round(r[0] * 10) / 10).replace('.', ',') + ' A'); set('e', r[1] ? 'coupé : surcharge' : r[0] > 12 ? 'chauffe' : 'normal'); if (r[1]) done(); }
          var row = MV.H('div', 'row', '', c);
          Object.keys(APP).forEach(function (k) { var b = MV.H('button', 'btn', '+ ' + k, row); b.onclick = function () { if (liste.length < 4) liste.push(k); upd(); }; });
          var r2 = MV.H('div', 'row', '', c), bv = MV.H('button', 'btn', 'Tout débrancher', r2); bv.onclick = function () { liste = []; upd(); };
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'Un circuit est protégé par un fusible de 10 A.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. On branche 6 A et 3 A. Intensité totale (A) ?', a: 9 },
            { type: 'opt', q: 'Étape 2. Le fusible :', o: ['ne fond pas', 'fond'], a: 0 },
            { type: 'opt', q: 'Étape 3. On ajoute 2 A. Le fusible :', o: ['fond', 'tient'], a: 0, e: '11 A dépasse le calibre de 10 A.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'L\'appareil qui coupe le courant en cas de surcharge et peut se réarmer :', o: ['le disjoncteur', 'l\'interrupteur'], a: 0 },
      { lvl: 'Niveau 2', q: 'Deux fils qui se touchent directement provoquent :', o: ['un court-circuit', 'une économie'], a: 0 },
      { lvl: 'Niveau 3', q: 'La prise de terre protège surtout :', o: ['les personnes', 'les lampes'], a: 0 },
      { lvl: 'Niveau 4', q: 'Fusible de 16 A. On branche 9 A et 5 A. Combien d\'ampères peut-on encore ajouter au maximum ?', a: 2 }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'La coupure',
      hud: [['t', 'total'], ['c', 'calibre'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.m = multiprise(svg); return e; },
      steps: [
        { cap: 'Radiateur + fer + bouilloire : 9 + 5 + 8 = **22 A**.', hud: { t: ['22 A'], c: '16 A', r: '–' }, run: function (e) { e.m.set(['radiateur', 'fer à repasser', 'bouilloire']); } },
        { cap: 'Plus que le calibre du **disjoncteur** (16 A) : il **coupe** avant que les fils ne prennent feu.', ar: 'الشدة الإجمالية 22 أمبير تتجاوز عيار الفاصل 16 أمبير، فيقطع التيار قبل اشتعال الأسلاك.', hud: { t: '22 A', c: '16 A', r: ['coupure : surcharge'] }, run: function (e) { e.m.set(['radiateur', 'fer à repasser', 'bouilloire'], { dis: 1 }); } }
      ]
    },

    retenir: [
      'Dangers du courant : <b>électrocution</b> (pour les personnes), <b>surcharge</b> et <b>court-circuit</b> (échauffement, incendie).',
      'Protections : <b>fusible</b> et <b>disjoncteur</b> coupent le courant au-delà de leur calibre ; la <b>prise de terre</b> et le disjoncteur différentiel protègent les personnes. Jamais d\'eau près des prises, jamais de fil dénudé.'
    ],
    retenirAr: 'أخطار التيار: الصعق الكهربائي، والحمولة الزائدة، والدارة القصيرة. وسائل الوقاية: المصهر والفاصل يقطعان التيار عند تجاوز عيارهما، والمأخذ الأرضي يحمي الأشخاص.',
    voc: [['un fusible', 'مصهر'], ['un disjoncteur', 'فاصل'], ['un court-circuit', 'دارة قصيرة'], ['l\'électrocution', 'الصعق الكهربائي'], ['la prise de terre', 'المأخذ الأرضي']]
  });
})();
