/* @meta {"id":"3ac-trigonometrie","level":"3","order":6,"theme":"Géométrie","title":"Trigonométrie dans le triangle rectangle","ar":"حساب المثلثات في المثلث القائم","lead":"Une échelle de 5 m posée contre un mur fait un angle de 60° avec le sol. À quelle hauteur touche-t-elle le mur ? Le cosinus et le sinus répondent."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, RAD = Math.PI / 180;
  function f2(v) { return (Math.round(v * 100) / 100).toString().replace('.', ','); }

  /* triangle rectangle : angle α en A (au sol), hypoténuse fixe */
  function tri(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), Ax = 50, Ay = 205, L = 190;
    var mur = S('line', { stroke: '#5b6068', 'stroke-width': 6 }, g);
    var adj = S('line', { stroke: '#7fb2ff', 'stroke-width': 4 }, g), opp = S('line', { stroke: '#56d07f', 'stroke-width': 4 }, g), hyp = S('line', { stroke: 'var(--acc)', 'stroke-width': 5 }, g);
    var arc = S('path', { fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2 }, g), dr = S('path', { fill: 'none', stroke: '#e9e9ea', 'stroke-width': 1.5 }, g);
    var ta = T(g, 0, 0, 'α', 'lbl'), tadj = T(g, 0, 0, 'adjacent', 'tag'), topp = T(g, 0, 0, 'opposé', 'tag', 'start'), thyp = T(g, 0, 0, 'hypoténuse', 'tag', 'end');
    g.set = function (a, hot) {
      var Bx = Ax + L * Math.cos(a * RAD), By = Ay - L * Math.sin(a * RAD);
      mur.setAttribute('x1', Bx + 3); mur.setAttribute('y1', 20); mur.setAttribute('x2', Bx + 3); mur.setAttribute('y2', Ay);
      [[adj, Ax, Ay, Bx, Ay], [opp, Bx, Ay, Bx, By], [hyp, Ax, Ay, Bx, By]].forEach(function (l) { l[0].setAttribute('x1', l[1]); l[0].setAttribute('y1', l[2]); l[0].setAttribute('x2', l[3]); l[0].setAttribute('y2', l[4]); });
      arc.setAttribute('d', 'M' + (Ax + 34) + ' ' + Ay + ' A34 34 0 0 0 ' + (Ax + 34 * Math.cos(a * RAD)) + ' ' + (Ay - 34 * Math.sin(a * RAD)));
      dr.setAttribute('d', 'M' + (Bx - 12) + ' ' + Ay + ' V' + (Ay - 12) + ' H' + Bx);
      ta.setAttribute('x', Ax + 46); ta.setAttribute('y', Ay - 8);
      tadj.setAttribute('x', (Ax + Bx) / 2); tadj.setAttribute('y', Ay + 18);
      topp.setAttribute('x', Bx + 10); topp.setAttribute('y', (Ay + By) / 2);
      thyp.setAttribute('x', (Ax + Bx) / 2 - 8); thyp.setAttribute('y', (Ay + By) / 2 - 8);
      [[adj, tadj, 'a'], [opp, topp, 'o'], [hyp, thyp, 'h']].forEach(function (p) { var on = !hot || hot.indexOf(p[2]) >= 0; p[0].style.opacity = on ? 1 : 0.25; p[1].style.opacity = on ? 1 : 0.3; });
    };
    return g;
  }

  MV.lesson({
    id: '3ac-trigonometrie',
    objectif: {
      fr: 'Utiliser le cosinus, le sinus et la tangente d\'un angle aigu dans un triangle rectangle pour calculer une longueur.',
      ar: 'استعمال جيب التمام والجيب والظل لزاوية حادة في مثلث قائم لحساب طول.'
    },

    ouverture: {
      vb: '0 0 360 230', label: 'Une échelle contre un mur',
      hud: [['l', 'échelle'], ['a', 'angle'], ['q', 'hauteur ?']],
      draw: function (svg) { var e = {}; e.t = tri(svg); return e; },
      steps: [
        { cap: 'Une **échelle de 5 m** est posée contre un mur.', hud: { l: ['5 m'], a: '–', q: '–' }, run: function (e) { e.t.set(60, ['h']); } },
        { cap: 'Elle fait un angle de **60°** avec le sol.', hud: { l: '5 m', a: ['60°'], q: '–' }, run: function (e) { e.t.set(60, ['h']); } },
        { cap: 'À quelle **hauteur** touche-t-elle le mur ? On le saura à la fin.', hud: { l: '5 m', a: '60°', q: ['?'] }, run: function (e) { e.t.set(60, ['h', 'o']); } }
      ]
    },

    prepare: [
      ['L\'hypoténuse est le côté opposé à l\'angle droit.', true, 'C\'est le plus long côté.'],
      ['Dans un triangle rectangle, les deux angles aigus font 90° ensemble.', true, '180° − 90° = 90°.'],
      ['Le cosinus d\'un angle aigu peut valoir 2.', false, 'Le côté adjacent est plus court que l\'hypoténuse : cos α < 1.']
    ],

    regarde: {
      vb: '0 0 360 230', label: 'Cosinus, sinus, tangente',
      hud: [['r', 'rapport'], ['f', 'formule'], ['v', 'pour 60°']],
      draw: function (svg) { var e = {}; e.t = tri(svg); return e; },
      steps: [
        { cap: 'Pour l\'angle α : un côté **adjacent**, un côté **opposé**, et l\'**hypoténuse**.', ar: 'بالنسبة للزاوية α: ضلع مجاور، وضلع مقابل، والوتر.', hud: { r: '–', f: '–', v: '–' }, run: function (e) { e.t.set(60); } },
        { cap: '**cos α = adjacent ÷ hypoténuse**.', ar: '[[cos α]] = المجاور ÷ الوتر.', hud: { r: ['cosinus'], f: 'adj ÷ hyp', v: ['0,5'] }, run: function (e) { e.t.set(60, ['a', 'h']); } },
        { cap: '**sin α = opposé ÷ hypoténuse**.', ar: '[[sin α]] = المقابل ÷ الوتر.', hud: { r: ['sinus'], f: 'opp ÷ hyp', v: ['≈ 0,87'] }, run: function (e) { e.t.set(60, ['o', 'h']); } },
        { cap: '**tan α = opposé ÷ adjacent**.', ar: '[[tan α]] = المقابل ÷ المجاور.', hud: { r: ['tangente'], f: 'opp ÷ adj', v: ['≈ 1,73'] }, run: function (e) { e.t.set(60, ['o', 'a']); } },
        { cap: 'Ces rapports ne dépendent **que de l\'angle**, pas de la taille du triangle. Et **cos²α + sin²α = 1**.', ar: 'هذه النسب لا تتعلق إلا بالزاوية، و [[cos²α + sin²α = 1]].', hud: { r: 'propriété', f: ['cos²α + sin²α = 1'], v: '0,25 + 0,75 = 1' }, run: function (e) { e.t.set(60); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Change l\'angle α et observe les trois rapports.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 230', role: 'img', 'aria-label': 'Triangle rectangle' }, st);
          var t = tri(svg), set = MV.hud(c, [['c', 'cos α'], ['s', 'sin α'], ['t', 'tan α', 1]]);
          MV.slider(c, { label: 'α (°)', min: 10, max: 80, value: 30, step: 5 }, function (a) { t.set(a); set('c', f2(Math.cos(a * RAD))); set('s', f2(Math.sin(a * RAD))); set('t', f2(Math.tan(a * RAD))); if (a === 45) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Cherche l\'angle où sinus et cosinus sont égaux.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Triangle ABC rectangle en B, AC = 10 cm, angle A = 30°. On cherche BC (opposé à A).',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. On connaît l\'hypoténuse et on cherche l\'opposé : on utilise', o: ['le sinus', 'le cosinus', 'la tangente'], a: 0 },
            { type: 'opt', q: 'Étape 2. BC = ?', o: ['AC × sin 30°', 'AC ÷ sin 30°', 'AC × cos 30°'], a: 0 },
            { q: 'Étape 3. sin 30° = 0,5, donc BC = ? cm', a: 5 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'cos α = ?', o: ['adjacent ÷ hypoténuse', 'opposé ÷ hypoténuse', 'opposé ÷ adjacent'], a: 0 },
      { lvl: 'Niveau 2', q: 'Si cos α = 0,6, alors cos²α + sin²α = ?', a: 1 },
      { lvl: 'Niveau 3', q: 'Si cos α = 0,6, alors sin α = ?', a: 0.8, hint: 'sin²α = 1 − 0,36.' },
      { lvl: 'Niveau 4', q: 'Hypoténuse 8 cm, angle 60°, cos 60° = 0,5. Côté adjacent (cm) ?', a: 4 }
    ],

    bilan: {
      vb: '0 0 360 230', label: 'La hauteur',
      hud: [['r', 'rapport'], ['c', 'calcul'], ['h', 'hauteur']],
      draw: function (svg) { var e = {}; e.t = tri(svg); return e; },
      steps: [
        { cap: 'Hauteur = opposé : on utilise le **sinus**. h = 5 × sin 60°.', hud: { r: ['sinus'], c: '5 × sin 60°', h: '–' }, run: function (e) { e.t.set(60, ['o', 'h']); } },
        { cap: 'sin 60° ≈ 0,87, donc h ≈ **4,33 m**.', ar: 'الارتفاع [[h = 5 × sin 60° ≈ 4,33 m]].', hud: { r: 'sinus', c: '5 × 0,87', h: ['≈ 4,33 m'] }, run: function (e) { e.t.set(60, ['o', 'h']); } }
      ]
    },

    retenir: [
      'Dans un triangle rectangle, pour un angle aigu α : <b class="mono">cos α = adj ÷ hyp</b> ; <b class="mono">sin α = opp ÷ hyp</b> ; <b class="mono">tan α = opp ÷ adj</b>.',
      '0 &lt; cos α &lt; 1, 0 &lt; sin α &lt; 1, et <b class="mono">cos²α + sin²α = 1</b> ; <b class="mono">tan α = sin α ÷ cos α</b>.'
    ],
    retenirAr: 'في مثلث قائم، بالنسبة لزاوية حادة α: جيب التمام = المجاور ÷ الوتر، والجيب = المقابل ÷ الوتر، والظل = المقابل ÷ المجاور. و [[cos²α + sin²α = 1]].',
    voc: [['le cosinus', 'جيب التمام'], ['le sinus', 'الجيب'], ['la tangente', 'الظل'], ['l\'hypoténuse', 'الوتر'], ['le côté adjacent', 'الضلع المجاور']]
  });
})();
