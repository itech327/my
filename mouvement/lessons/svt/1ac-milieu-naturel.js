/* @meta {"id":"1ac-milieu-naturel","level":"1","order":1,"theme":"Écologie","title":"Le milieu naturel et ses facteurs","ar":"الوسط الطبيعي وعوامله","lead":"Dans la forêt d'Ifrane, les mousses poussent à l'ombre des cèdres, les herbes dans la clairière : le milieu décide."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  function cedre(svg, x, y, s) {
    var g = S('g', {}, svg);
    S('rect', { x: x - 4 * s, y: y - 10 * s, width: 8 * s, height: 30 * s, fill: '#6b4f3a' }, g);
    [[0, 34, 30], [-12, 22, 22], [-24, 14, 16]].forEach(function (l) { S('path', { d: 'M' + (x - l[1] * s) + ' ' + (y + l[0] * s) + ' L' + x + ' ' + (y + (l[0] - 22) * s) + ' L' + (x + l[1] * s) + ' ' + (y + l[0] * s) + ' Z', fill: '#2f5d43' }, g); });
    return g;
  }
  function foret(svg) {
    var e = {};
    S('rect', { x: 0, y: 200, width: 360, height: 100, fill: '#2a2620' }, svg);
    S('circle', { cx: 300, cy: 40, r: 20, fill: '#f2c14e' }, svg);
    e.ombre = S('rect', { x: 0, y: 200, width: 170, height: 30, fill: 'rgba(0,0,0,.35)' }, svg);     cedre(svg, 50, 120, 1.6); cedre(svg, 130, 110, 1.9);
    e.mousses = S('g', {}, svg);
    for (var i = 0; i < 9; i++) S('ellipse', { cx: 20 + i * 16, cy: 206, rx: 8, ry: 5, fill: '#5fae5a' }, e.mousses);
    T(e.mousses, 85, 250, 'mousses, fougères', 'tag');
    e.herbes = S('g', {}, svg);
    for (i = 0; i < 12; i++) S('path', { d: 'M' + (200 + i * 12) + ' 204 l-4 -18 M' + (200 + i * 12) + ' 204 l4 -16', stroke: '#c9b45a', 'stroke-width': 2 }, e.herbes);
    T(e.herbes, 270, 250, 'graminées', 'tag');
    e.herisson = S('g', {}, svg);
    S('ellipse', { cx: 180, cy: 196, rx: 14, ry: 8, fill: '#7a6a5a' }, e.herisson); S('circle', { cx: 193, cy: 196, r: 3, fill: '#3a2f25' }, e.herisson);
    e.instr = S('g', {}, svg);
    [['thermomètre', 60, 280], ['luxmètre', 180, 280], ['hygromètre', 300, 280]].forEach(function (k) { S('rect', { x: k[1] - 44, y: k[2] - 16, width: 88, height: 22, rx: 6, fill: '#17181a', stroke: 'var(--acc)' }, e.instr); T(e.instr, k[1], k[2], k[0], 'tag'); });
    e.bio = S('g', {}, svg);
    S('rect', { x: 10, y: 10, width: 150, height: 54, rx: 10, fill: '#17181a', stroke: 'var(--acc)' }, e.bio);
    T(e.bio, 85, 32, 'biocénose', 'lbl acc'); T(e.bio, 85, 52, 'les êtres vivants', 'tag');
    e.biot = S('g', {}, svg);
    S('rect', { x: 150, y: 76, width: 205, height: 54, rx: 10, fill: '#17181a', stroke: '#e9e9ea' }, e.biot);
    T(e.biot, 252, 98, 'biotope', 'lbl'); T(e.biot, 252, 118, 'sol, eau, lumière, température', 'tag');
    return e;
  }

  MV.lesson({
    id: '1ac-milieu-naturel',
    objectif: {
      fr: 'Distinguer les êtres vivants et les facteurs du milieu, et montrer que la répartition des êtres vivants dépend de ces facteurs.',
      ar: 'التمييز بين الكائنات الحية وعوامل الوسط، وبيان أن توزيع الكائنات الحية يتأثر بهذه العوامل.'
    },

    ouverture: {
      vb: '0 0 360 300', label: 'La forêt d\'Ifrane',
      hud: [['o', 'à l\'ombre'], ['s', 'au soleil'], ['q', 'pourquoi ?']],
      draw: function (svg) { return foret(svg); },
      steps: [
        { cap: 'Une forêt de **cèdres** près d\'Ifrane, avec une clairière.', on: ['ombre'], hud: { o: '–', s: '–', q: '–' } },
        { cap: 'À l\'ombre des arbres, le sol est couvert de **mousses**.', on: ['ombre', 'mousses'], hud: { o: ['mousses'], s: '–', q: '–' } },
        { cap: 'Dans la clairière ensoleillée poussent surtout des **herbes**.', on: ['ombre', 'mousses', 'herbes'], hud: { o: 'mousses', s: ['herbes'], q: '–' } },
        { cap: 'Pourquoi pas les mêmes plantes **partout** ? On le saura à la fin.', on: ['ombre', 'mousses', 'herbes'], hud: { o: 'mousses', s: 'herbes', q: ['?'] } }
      ]
    },

    prepare: [
      ['Une pierre est un être vivant.', false, 'Une pierre ne se nourrit pas, ne respire pas, ne se reproduit pas.'],
      ['Les plantes ont besoin de lumière.', true, 'Les plantes vertes utilisent la lumière pour fabriquer leur matière.'],
      ['Il fait souvent plus frais à l\'ombre qu\'au soleil.', true, 'L\'ombre reçoit moins de lumière et de chaleur.']
    ],

    regarde: {
      vb: '0 0 360 300', label: 'Les composantes du milieu',
      hud: [['l', 'lumière'], ['h', 'humidité'], ['t', 'température']],
      draw: function (svg) { return foret(svg); },
      steps: [
        { cap: 'Un milieu naturel contient des **êtres vivants** : plantes et animaux.', ar: 'يضم الوسط الطبيعي كائنات حية: نباتات وحيوانات.', on: ['mousses', 'herbes', 'herisson', 'ombre'], hud: { l: '–', h: '–', t: '–' } },
        { cap: 'Leur ensemble s\'appelle la **biocénose**.', ar: 'مجموع الكائنات الحية في الوسط يسمى الجماعة الإحيائية.', on: ['mousses', 'herbes', 'herisson', 'bio', 'ombre'], hud: { l: '–', h: '–', t: '–' } },
        { cap: 'Le milieu a aussi des **facteurs physiques** : sol, eau, lumière, température. C\'est le **biotope**.', ar: 'وللوسط عوامل فيزيائية: التربة والماء والضوء والحرارة، وهي تكون الوسط الحيوي.', on: ['bio', 'biot', 'ombre', 'mousses', 'herbes'], hud: { l: '?', h: '?', t: '?' } },
        { cap: 'Biotope + biocénose + leurs relations = un **écosystème**.', ar: 'الوسط الحيوي مع الجماعة الإحيائية والعلاقات بينهما يكونان نظاما بيئيا.', on: ['bio', 'biot', 'ombre', 'mousses', 'herbes', 'herisson'], hud: { l: '–', h: '–', t: '–' } },
        { cap: 'On **mesure** les facteurs avec des instruments.', ar: 'نقيس عوامل الوسط بأدوات: محرار، مقياس الضوء، مقياس الرطوبة.', on: ['instr', 'ombre', 'mousses', 'herbes'], hud: { l: ['luxmètre'], h: ['hygromètre'], t: ['thermomètre'] } },
        { cap: 'À l\'ombre : **peu de lumière**, plus d\'humidité, plus frais. Les mousses y vivent.', ar: 'في الظل: ضوء قليل ورطوبة أكبر وحرارة أقل، فتعيش الحزازيات.', on: ['ombre', 'mousses', 'instr'], hot: ['mousses'], hud: { l: ['faible'], h: ['forte'], t: ['basse'] } },
        { cap: 'Au soleil : **beaucoup de lumière**, sol plus sec, plus chaud. Les herbes y vivent.', ar: 'في الشمس: ضوء كثير وتربة جافة وحرارة أعلى، فتعيش النجيليات.', on: ['ombre', 'herbes', 'instr'], hud: { l: ['forte'], h: ['faible'], t: ['élevée'] } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Fais varier l\'éclairement du sol. Observe les plantes qui se développent (simulation simplifiée).',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 160', role: 'img', 'aria-label': 'Sol plus ou moins éclairé' }, st);
          var bg = S('rect', { x: 0, y: 0, width: 360, height: 160, fill: '#000' }, svg);
          S('rect', { x: 0, y: 110, width: 360, height: 50, fill: '#2a2620' }, svg);
          var mo = S('g', {}, svg), he = S('g', {}, svg);
          for (var i = 0; i < 14; i++) S('ellipse', { cx: 14 + i * 25, cy: 112, rx: 9, ry: 6, fill: '#5fae5a' }, mo);
          for (i = 0; i < 14; i++) S('path', { d: 'M' + (24 + i * 25) + ' 110 l-5 -26 M' + (24 + i * 25) + ' 110 l5 -22', stroke: '#c9b45a', 'stroke-width': 2.5 }, he);
          var set = MV.hud(c, [['l', 'lumière'], ['h', 'humidité'], ['p', 'plantes', 1]]);
          MV.slider(c, { label: 'lumière', min: 0, max: 100, step: 10, value: 50, fmt: function (v) { return v + ' %'; } }, function (v) {
            bg.setAttribute('opacity', 0.75 - v / 160); mo.style.opacity = Math.max(0.05, 1 - v / 70); he.style.opacity = Math.max(0.05, (v - 30) / 60);
            set('l', v + ' %'); set('h', v < 40 ? 'forte' : v < 70 ? 'moyenne' : 'faible');
            set('p', v < 40 ? 'mousses' : v < 70 ? 'mélange' : 'graminées');
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          done();
        } },
      { title: 'Résolvons ensemble', intro: 'Classe les éléments du milieu.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Le sol fait partie :', o: ['de la biocénose', 'du biotope'], a: 1, e: 'Le sol n\'est pas vivant : c\'est un facteur physique du milieu.' },
            { type: 'opt', q: 'Étape 2. Le hérisson fait partie :', o: ['de la biocénose', 'du biotope'], a: 0, e: 'C\'est un être vivant.' },
            { type: 'opt', q: 'Étape 3. Pour mesurer l\'humidité de l\'air, on utilise :', o: ['un thermomètre', 'un hygromètre', 'un luxmètre'], a: 1, e: 'Le luxmètre mesure la lumière, le thermomètre la température.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Lequel est un facteur physique du milieu ?', o: ['la température', 'le champignon', 'le lézard'], a: 0, e: 'Les deux autres sont des êtres vivants.' },
      { lvl: 'Niveau 2', q: 'Un écosystème est formé :', o: ['des seuls animaux', 'du biotope et de la biocénose', 'des seules plantes'], a: 1, e: 'Avec les relations entre eux.' },
      { lvl: 'Niveau 3', q: 'On mesure 200 lux à l\'ombre et 40 000 lux au soleil. Où trouve-t-on surtout les mousses ?', o: ['à 200 lux', 'à 40 000 lux'], a: 0, e: 'Les mousses préfèrent les endroits peu éclairés et humides.' },
      { lvl: 'Niveau 4', q: 'On coupe les cèdres d\'une partie de la forêt. Que devient le sol de cette partie ?', o: ['plus éclairé et plus sec', 'plus sombre et plus humide', 'il ne change pas'], a: 0, e: 'Les arbres faisaient de l\'ombre : les mousses risquent de reculer.' }
    ],

    bilan: {
      vb: '0 0 360 300', label: 'Pourquoi les mousses sont à l\'ombre',
      hud: [['f', 'facteur'], ['o', 'ombre'], ['s', 'soleil']],
      draw: function (svg) { return foret(svg); },
      steps: [
        { cap: 'L\'ombre et le soleil n\'ont pas les mêmes **facteurs physiques**.', on: ['ombre', 'instr'], hud: { f: ['lumière'], o: 'faible', s: 'forte' } },
        { cap: 'Les mousses ont besoin d\'**humidité** : elles vivent à l\'ombre.', on: ['ombre', 'mousses'], hud: { f: ['humidité'], o: ['forte'], s: 'faible' } },
        { cap: 'La **répartition** des êtres vivants dépend des facteurs du milieu.', ar: 'يتأثر توزيع الكائنات الحية بعوامل الوسط.', on: ['ombre', 'mousses', 'herbes'], hud: { f: 'les facteurs', o: ['mousses'], s: ['herbes'] } }
      ]
    },

    retenir: [
      'Un <b>écosystème</b> est formé d\'un <b>biotope</b> (le milieu physique : sol, eau, lumière, température, humidité) et d\'une <b>biocénose</b> (l\'ensemble des êtres vivants), en relation.',
      'La <b>répartition</b> des êtres vivants dans un milieu dépend des facteurs du milieu, qu\'on mesure avec des instruments.'
    ],
    retenirAr: 'يتكون النظام البيئي من وسط حيوي (التربة والماء والضوء والحرارة والرطوبة) ومن جماعة إحيائية (مجموع الكائنات الحية) تربطهما علاقات. ويتأثر توزيع الكائنات الحية بعوامل الوسط.',
    voc: [['le milieu naturel', 'الوسط الطبيعي'], ['l\'écosystème', 'النظام البيئي'], ['le biotope', 'الوسط الحيوي'], ['la biocénose', 'الجماعة الإحيائية'], ['l\'humidité', 'الرطوبة'], ['l\'éclairement', 'الإضاءة']]
  });
})();
