/* @meta {"id":"1ac-regimes-alimentaires","level":"1","order":3,"theme":"Les êtres vivants","title":"Les régimes alimentaires des animaux","ar":"الأنظمة الغذائية عند الحيوانات","lead":"Le mouton broute, le chat chasse, le sanglier mange de tout : leurs dents racontent ce qu'ils mangent."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* mâchoire schématique : incisives, canines, molaires selon le régime */
  function machoire(svg, cx, cy) {
    var g = S('g', { 'data-keep': 1 }, svg);
    g.set = function (type) {
      while (g.firstChild) g.removeChild(g.firstChild);
      S('path', { d: 'M' + (cx - 120) + ' ' + cy + ' Q' + cx + ' ' + (cy + 70) + ' ' + (cx + 120) + ' ' + cy, fill: 'none', stroke: '#d07a70', 'stroke-width': 18, 'stroke-linecap': 'round' }, g);
      var dents = [];
      for (var i = 0; i < 9; i++) {
        var t = i / 8, x = cx - 110 + t * 220, y = cy + 45 * (1 - Math.pow(2 * t - 1, 2)) - 8, kind = i === 4 ? 'i' : (i === 3 || i === 5) ? 'c' : 'm';
        var w = 14, h = 16, col = '#f2f2f2';
        if (type === 'herbivore') { if (kind === 'c') continue; if (kind === 'm') { w = 22; h = 14; } }
        if (type === 'carnivore') { if (kind === 'c') { h = 34; } if (kind === 'm') { h = 22; } }
        if (type === 'omnivore') { if (kind === 'c') h = 24; if (kind === 'm') w = 18; }
        var d = kind === 'c' || (type === 'carnivore' && kind === 'm') ? 'M' + (x - w / 2) + ' ' + y + ' L' + x + ' ' + (y - h) + ' L' + (x + w / 2) + ' ' + y + ' Z' : 'M' + (x - w / 2) + ' ' + y + ' h' + w + ' v' + (-h) + ' h' + (-w) + ' Z';
        S('path', { d: d, fill: col, stroke: '#141517', 'stroke-width': 1 }, g);
      }
      if (type === 'herbivore') { S('rect', { x: cx - 50, y: cy - 30, width: 30, height: 14, fill: 'none' }, g); }
    };
    return g;
  }

  MV.lesson({
    id: '1ac-regimes-alimentaires',
    objectif: {
      fr: 'Classer les animaux selon leur régime alimentaire et relier la forme des dents à ce régime.',
      ar: 'تصنيف الحيوانات حسب نظامها الغذائي وربط شكل الأسنان بهذا النظام.'
    },

    ouverture: {
      vb: '0 0 360 200', label: 'Trois animaux, trois repas',
      hud: [['a', 'mouton'], ['b', 'chat'], ['c', 'sanglier']],
      draw: function (svg) {
        var e = {};
        [['mouton', 'herbe', 60], ['chat', 'souris', 180], ['sanglier', 'glands, vers, racines', 300]].forEach(function (a, i) {
          var g = S('g', {}, svg); S('circle', { cx: a[2], cy: 80, r: 34, fill: ['#e9e9ea', '#f2a23c', '#6b4f3a'][i] }, g);
          T(g, a[2], 135, a[0], 'lbl'); T(g, a[2], 155, a[1], 'tag'); e['a' + i] = g;
        });
        return e;
      },
      steps: [
        { cap: 'Le **mouton** broute l\'herbe des prairies de l\'Atlas.', on: ['a0'], hud: { a: ['herbe'], b: '–', c: '–' } },
        { cap: 'Le **chat** chasse les souris.', on: ['a0', 'a1'], hud: { a: 'herbe', b: ['souris'], c: '–' } },
        { cap: 'Le **sanglier** mange des glands, des racines et des vers. Comment le savoir **sans les observer** ? On le saura à la fin.', on: ['a0', 'a1', 'a2'], hud: { a: 'herbe', b: 'souris', c: ['de tout'] } }
      ]
    },

    predire: {
      q: "Comment savoir si un animal est herbivore ou carnivore sans l'observer manger ?",
      ar: "كيف نعرف إن كان الحيوان عاشب أو لاحماً دون أن نراه يأكل؟",
      o: ["Grâce à sa couleur", "Grâce à sa taille", "Grâce à la forme de ses dents"],
      a: 2,
      e: "La forme des dents est adaptée au régime : molaires larges chez l'herbivore, canines longues chez le carnivore, et les deux chez l'omnivore.",
      ear: "شكل الأسنان يناسب نوع التغذية: أضراس عريضة عند العواشب وأنياب طويلة عند اللواحم."
    },

    prepare: [
      ['Tous les animaux mangent la même nourriture.', false, 'Chaque espèce a son régime alimentaire.'],
      ['Les plantes vertes fabriquent leur propre matière.', true, 'Elles n\'ont pas besoin de manger d\'autres êtres vivants.'],
      ['Les dents servent à couper et broyer les aliments.', true, 'Leur forme dépend de ce que l\'animal mange.']
    ],

    regarde: {
      vb: '0 0 360 220', label: 'Les dents selon le régime',
      hud: [['r', 'régime'], ['n', 'nourriture'], ['d', 'dents']],
      draw: function (svg) { var e = {}; e.m = machoire(svg, 180, 90); return e; },
      steps: [
        { cap: 'Un **herbivore** mange des végétaux : mouton, chèvre, lapin.', ar: 'العاشب يتغذى على النباتات.', hud: { r: ['herbivore'], n: 'végétaux', d: '–' }, run: function (e) { e.m.set('herbivore'); } },
        { cap: 'Ses **molaires larges** broient l\'herbe. Pas de canines pointues.', ar: 'أضراسه عريضة لطحن العشب، وليس له أنياب حادة.', hud: { r: 'herbivore', n: 'végétaux', d: ['molaires larges'] }, run: function (e) { e.m.set('herbivore'); } },
        { cap: 'Un **carnivore** mange d\'autres animaux : chat, faucon, renard.', ar: 'اللاحم يتغذى على حيوانات أخرى.', hud: { r: ['carnivore'], n: 'animaux', d: '–' }, run: function (e) { e.m.set('carnivore'); } },
        { cap: 'Ses **canines longues** attrapent et percent ; ses molaires sont pointues.', ar: 'أنيابه طويلة للإمساك بالفريسة، وأضراسه حادة.', hud: { r: 'carnivore', n: 'animaux', d: ['canines longues'] }, run: function (e) { e.m.set('carnivore'); } },
        { cap: 'Un **omnivore** mange des végétaux et des animaux : sanglier, Homme.', ar: 'القارت يتغذى على النباتات والحيوانات.', hud: { r: ['omnivore'], n: 'les deux', d: ['dents variées'] }, run: function (e) { e.m.set('omnivore'); } },
        { cap: 'Le régime peut **changer** : le têtard mange des algues, la grenouille des insectes.', ar: 'قد يتغير النظام الغذائي حسب العمر أو الفصل.', hud: { r: 'herbivore → carnivore', n: 'algues → insectes', d: '–' }, run: function (e) { e.m.set('omnivore'); } }
      ]
    },

    faisons: [
      { title: 'Classe les animaux', intro: 'Choisis un animal pour voir son régime et sa mâchoire.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 160', role: 'img', 'aria-label': 'Mâchoire de l\'animal choisi' }, st);
          var m = machoire(svg, 180, 60), set = MV.hud(c, [['a', 'animal'], ['r', 'régime', 1]]), row = MV.H('div', 'row', '', c), seen = {};
          [['chèvre', 'herbivore'], ['renard', 'carnivore'], ['Homme', 'omnivore'], ['lapin', 'herbivore'], ['faucon', 'carnivore']].forEach(function (a) {
            MV.H('button', 'btn', a[0], row).onclick = function () { m.set(a[1]); set('a', a[0]); set('r', a[1]); seen[a[1]] = 1; if (Object.keys(seen).length === 3) done(); };
          });
          MV.H('p', 'small', 'Trouve un exemple de chaque régime.', c);
          m.set('omnivore');
        } },
      { title: 'Résolvons ensemble', intro: 'On trouve un crâne avec de longues canines pointues.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Les longues canines servent à :', o: ['broyer l\'herbe', 'attraper et percer des proies'], a: 1 },
            { type: 'opt', q: 'Étape 2. Cet animal est probablement :', o: ['herbivore', 'carnivore'], a: 1 },
            { type: 'opt', q: 'Étape 3. Parmi ces animaux, lequel pourrait-il être ?', o: ['un mouton', 'un chacal', 'un lapin'], a: 1 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un animal qui mange seulement des végétaux est :', o: ['herbivore', 'carnivore', 'omnivore'], a: 0 },
      { lvl: 'Niveau 2', q: 'L\'Homme est :', o: ['herbivore', 'carnivore', 'omnivore'], a: 2 },
      { lvl: 'Niveau 3', q: 'Des molaires larges et plates indiquent un régime :', o: ['herbivore', 'carnivore'], a: 0 },
      { lvl: 'Niveau 4', q: 'Le têtard mange des algues, la grenouille adulte des insectes. On dit que le régime :', o: ['change avec l\'âge', 'ne change jamais'], a: 0 }
    ],

    bilan: {
      vb: '0 0 360 220', label: 'Le sanglier, un omnivore',
      hud: [['d', 'dents'], ['r', 'régime'], ['q', 'réponse']],
      draw: function (svg) { var e = {}; e.m = machoire(svg, 180, 90); return e; },
      steps: [
        { cap: 'On regarde les **dents** du sanglier : canines et molaires.', hud: { d: ['variées'], r: '–', q: '–' }, run: function (e) { e.m.set('omnivore'); } },
        { cap: 'Des dents **variées** : c\'est un omnivore. Les dents renseignent sur le régime.', ar: 'تدل الأسنان على النظام الغذائي: الخنزير البري قارت.', hud: { d: 'variées', r: ['omnivore'], q: ['les dents'] }, run: function (e) { e.m.set('omnivore'); } }
      ]
    },

    retenir: [
      'Selon ce qu\'ils mangent, les animaux sont <b>herbivores</b> (végétaux), <b>carnivores</b> (animaux) ou <b>omnivores</b> (les deux).',
      'La forme des <b>dents</b> est adaptée au régime : molaires larges chez l\'herbivore, canines longues chez le carnivore. Le régime peut changer avec l\'âge ou la saison.'
    ],
    retenirAr: 'تكون الحيوانات عاشبة أو لاحمة أو قارتة حسب غذائها. شكل الأسنان ملائم للنظام الغذائي. وقد يتغير النظام الغذائي حسب العمر أو الفصل.',
    voc: [['herbivore', 'عاشب'], ['carnivore', 'لاحم'], ['omnivore', 'قارت'], ['le régime alimentaire', 'النظام الغذائي'], ['la canine', 'الناب'], ['la molaire', 'الضرس']]
  });
})();
