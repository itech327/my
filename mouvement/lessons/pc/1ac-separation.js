/* @meta {"id":"1ac-separation","level":"1","order":6,"theme":"Matière et environnement","title":"Dissoudre et récupérer : séparer un mélange","ar":"فصل مكونات خليط","lead":"Dans les salines de la côte atlantique, on récupère le sel de l'eau de mer. Le sel dissous traverse le filtre : comment le retrouver ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, SOL = 36; // g de sel dans 100 mL d'eau, environ, à 20 °C

  /* bécher de 100 mL d'eau, sel ajouté, dépôt si saturation, évaporation */
  function becher(svg, X) {
    var g = S('g', { 'data-keep': 1 }, svg);
    var eau = S('rect', { x: X + 4, y: 70, width: 92, height: 106, fill: 'rgba(127,178,255,.35)' }, g);
    var grains = S('g', {}, g), dep = S('rect', { x: X + 4, y: 176, width: 92, height: 0, fill: '#f2f2f2' }, g);
    S('path', { d: 'M' + X + ' 50 V180 H' + (X + 100) + ' V50', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 3 }, g);
    eau.style.transition = dep.style.transition = 'all 1s';
    g.set = function (m, ev) { // m grammes de sel ajoutés ; ev fraction d'eau évaporée (0 à 1)
      while (grains.firstChild) grains.removeChild(grains.firstChild);
      var h = 106 * (1 - (ev || 0)), cap = SOL * (1 - (ev || 0)), trop = Math.max(0, m - cap);
      eau.setAttribute('y', 176 - h); eau.setAttribute('height', h);
      var d = Math.min(30, trop * 0.6); dep.setAttribute('y', 176 - d); dep.setAttribute('height', d);
      for (var i = 0; i < Math.min(30, m - trop) / 1.5; i++) S('circle', { cx: X + 12 + (i * 37) % 76, cy: 176 - h * ((i * 53 % 90) / 100), r: 1.6, fill: 'rgba(255,255,255,.55)' }, grains);
    };
    return g;
  }

  MV.lesson({
    id: '1ac-separation',
    objectif: {
      fr: 'Comprendre la dissolution, la solubilité et la saturation, et récupérer un solide dissous par évaporation.',
      ar: 'فهم الذوبان والذوبانية والإشباع، واسترجاع جسم صلب ذائب بالتبخير.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Le sel de la mer',
      hud: [['m', 'eau de mer'], ['f', 'après filtre'], ['q', 'le sel ?']],
      draw: function (svg) { var e = {}; e.b = becher(svg, 130); return e; },
      steps: [
        { cap: 'L\'eau de mer est **limpide**, et pourtant elle est salée.', hud: { m: ['limpide, salée'], f: '–', q: '–' }, run: function (e) { e.b.set(4); } },
        { cap: 'On la **filtre** : elle reste salée. Le sel passe à travers le filtre.', hud: { m: 'limpide, salée', f: ['toujours salée'], q: '–' }, run: function (e) { e.b.set(4); } },
        { cap: 'Comment les salines **récupèrent** le sel ? On le saura à la fin.', hud: { m: 'limpide, salée', f: 'toujours salée', q: ['?'] }, run: function (e) { e.b.set(4); } }
      ]
    },

    prepare: [
      ['Le sucre disparaît dans le thé chaud.', true, 'Il se dissout : il est toujours là, mais invisible.'],
      ['On peut dissoudre une quantité illimitée de sel dans un verre d\'eau.', false, 'Au-delà d\'une certaine masse, le sel ne se dissout plus.'],
      ['Quand l\'eau s\'évapore, le sel dissous reste.', true, 'C\'est le principe des salines.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Dissoudre, saturer, évaporer',
      hud: [['s', 'sel ajouté'], ['e', 'état'], ['m', 'mot clé']],
      draw: function (svg) { var e = {}; e.b = becher(svg, 130); return e; },
      steps: [
        { cap: 'On verse 10 g de sel dans 100 mL d\'eau : il **se dissout**. On obtient une **solution**.', ar: 'نضيف 10 g من الملح إلى 100 mL من الماء فيذوب، ونحصل على محلول.', hud: { s: ['10 g'], e: 'tout dissous', m: ['dissolution'] }, run: function (e) { e.b.set(10); } },
        { cap: 'L\'eau est le **solvant**, le sel est le **soluté**.', ar: 'الماء هو المذيب، والملح هو المذاب.', hud: { s: '10 g', e: 'solution', m: ['solvant, soluté'] }, run: function (e) { e.b.set(10); } },
        { cap: 'À 36 g environ, plus rien ne se dissout : la solution est **saturée**, un dépôt apparaît.', ar: 'عند حوالي 36 g لا يذوب المزيد: المحلول مشبع ويظهر راسب.', hud: { s: ['45 g'], e: ['dépôt au fond'], m: ['saturée'] }, run: function (e) { e.b.set(45); } },
        { cap: 'La masse maximale qu\'on peut dissoudre est la **solubilité** : environ 36 g pour 100 mL à 20 °C.', ar: 'أكبر كتلة يمكن إذابتها هي الذوبانية: حوالي 36 g في 100 mL عند 20 °C.', hud: { s: '45 g', e: 'saturée', m: ['solubilité'] }, run: function (e) { e.b.set(45); } },
        { cap: 'On **évapore** l\'eau : le sel réapparaît, en cristaux. C\'est l\'**évaporation**.', ar: 'نبخر الماء فيظهر الملح من جديد على شكل بلورات: هذا هو التبخير.', hud: { s: '10 g', e: ['cristaux'], m: ['évaporation'] }, run: function (e) { e.b.set(10, 0.6); setTimeout(function () { e.b.set(10, 0.95); }, 1000); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Ajoute du sel dans 100 mL d\'eau. À partir de quelle masse la solution est-elle saturée ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Bécher de sel' }, st);
          var b = becher(svg, 130), set = MV.hud(c, [['m', 'sel ajouté'], ['d', 'dissous'], ['e', 'état', 1]]);
          MV.slider(c, { label: 'sel (g)', min: 0, max: 50, value: 0, step: 2 }, function (m) { b.set(m); set('m', m + ' g'); set('d', Math.min(m, SOL) + ' g'); set('e', m > SOL ? 'saturée, dépôt' : 'non saturée'); if (m > SOL) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'On dissout du sel dans 200 mL d\'eau, à 20 °C.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Deux fois plus d\'eau : on peut dissoudre au plus ? g', a: 72 },
            { type: 'opt', q: 'Étape 2. On ajoute 80 g de sel. La solution est :', o: ['saturée', 'tout se dissout'], a: 0 },
            { q: 'Étape 3. Masse du dépôt (g) ?', a: 8 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Dans l\'eau sucrée, le sucre est :', o: ['le soluté', 'le solvant'], a: 0 },
      { lvl: 'Niveau 2', q: 'Pour récupérer le sel dissous, on utilise :', o: ['l\'évaporation', 'la filtration', 'la décantation'], a: 0 },
      { lvl: 'Niveau 3', q: 'Une solution qui ne peut plus dissoudre de soluté est :', o: ['saturée', 'diluée'], a: 0 },
      { lvl: 'Niveau 4', q: '1 L d\'eau de mer contient environ 35 g de sel. Combien de grammes dans 4 L ?', a: 140, unit: 'g' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Les salines',
      hud: [['e', 'étape'], ['p', 'phénomène'], ['r', 'résultat']],
      draw: function (svg) { var e = {}; e.b = becher(svg, 130); return e; },
      steps: [
        { cap: 'Le sel est **dissous** : le filtre ne peut pas le retenir.', hud: { e: ['filtrer'], p: 'dissolution', r: ['échec'] }, run: function (e) { e.b.set(10); } },
        { cap: 'Dans les bassins, le soleil et le vent **évaporent** l\'eau : le sel se dépose.', ar: 'في الملاحات تبخر الشمس والرياح الماء فيترسب الملح.', hud: { e: ['évaporer'], p: ['évaporation'], r: ['sel récupéré'] }, run: function (e) { e.b.set(10, 0.95); } }
      ]
    },

    retenir: [
      'Un solide qui se <b>dissout</b> dans un liquide forme une <b>solution</b> : le liquide est le <b>solvant</b>, le solide le <b>soluté</b>. Au-delà de la <b>solubilité</b>, la solution est <b>saturée</b>.',
      'Un soluté traverse le filtre. On le récupère par <b>évaporation</b> du solvant.'
    ],
    retenirAr: 'عندما يذوب جسم صلب في سائل نحصل على محلول: السائل مذيب والصلب مذاب. فوق الذوبانية يصبح المحلول مشبعا. نسترجع المذاب بتبخير المذيب.',
    voc: [['la dissolution', 'الذوبان'], ['le solvant', 'المذيب'], ['le soluté', 'المذاب'], ['saturée', 'مشبع'], ['l\'évaporation', 'التبخير']]
  });
})();
