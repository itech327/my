/* @meta {"id":"3ac-thales","level":"3","order":7,"theme":"Géométrie","title":"Le théorème de Thalès","ar":"مبرهنة طاليس","lead":"Un bâton de 1,5 m fait une ombre de 2 m ; au même moment, l'ombre d'un palmier mesure 12 m. Sans grimper, quelle est sa hauteur ? Thalès répond."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var A = [40, 190], B = [320, 190], C = [320, 40]; // triangle ABC rectangle en B (sol AB, palmier BC)

  function figure(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('path', { d: 'M' + A + ' L' + B + ' L' + C + ' Z', fill: 'rgba(255,255,255,.04)', stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    var mn = S('line', { stroke: 'var(--acc)', 'stroke-width': 4 }, g), mp = S('circle', { r: 5, fill: 'var(--acc)' }, g), np = S('circle', { r: 5, fill: 'var(--acc)' }, g);
    var bc = S('line', { x1: B[0], y1: B[1], x2: C[0], y2: C[1], stroke: '#56d07f', 'stroke-width': 4 }, g);
    T(g, A[0] - 6, A[1] + 16, 'A', 'lbl'); T(g, B[0] + 4, B[1] + 16, 'B', 'lbl'); T(g, C[0] + 12, C[1] + 4, 'C', 'lbl');
    var tm = T(g, 0, 0, 'M', 'lbl'), tn = T(g, 0, 0, 'N', 'lbl', 'end');
    g.set = function (k) { // k = AM / AB
      var M = [A[0] + k * (B[0] - A[0]), A[1]], N = [A[0] + k * (C[0] - A[0]), A[1] + k * (C[1] - A[1])];
      mn.setAttribute('x1', M[0]); mn.setAttribute('y1', M[1]); mn.setAttribute('x2', N[0]); mn.setAttribute('y2', N[1]);
      mp.setAttribute('cx', M[0]); mp.setAttribute('cy', M[1]); np.setAttribute('cx', N[0]); np.setAttribute('cy', N[1]);
      tm.setAttribute('x', M[0]); tm.setAttribute('y', M[1] + 18); tn.setAttribute('x', N[0] - 8); tn.setAttribute('y', N[1] - 6);
    };
    return g;
  }

  MV.lesson({
    id: '3ac-thales',
    objectif: {
      fr: 'Utiliser le théorème de Thalès pour calculer une longueur, et sa réciproque pour démontrer que deux droites sont parallèles.',
      ar: 'استعمال مبرهنة طاليس لحساب طول، واستعمال المبرهنة العكسية لإثبات توازي مستقيمين.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'L\'ombre du palmier',
      hud: [['b', 'bâton'], ['p', 'palmier'], ['q', 'hauteur ?']],
      draw: function (svg) { var e = {}; e.f = figure(svg); return e; },
      steps: [
        { cap: 'Un **bâton** de 1,5 m projette une ombre de 2 m.', hud: { b: ['1,5 m ; ombre 2 m'], p: '–', q: '–' }, run: function (e) { e.f.set(1 / 6); } },
        { cap: 'Au même moment, l\'ombre du **palmier** mesure 12 m.', hud: { b: '1,5 m ; ombre 2 m', p: ['ombre 12 m'], q: '–' }, run: function (e) { e.f.set(1 / 6); } },
        { cap: 'Quelle est la **hauteur** du palmier ? On le saura à la fin.', hud: { b: '1,5 m ; ombre 2 m', p: 'ombre 12 m', q: ['?'] }, run: function (e) { e.f.set(1 / 6); } }
      ]
    },

    predire: {
      q: "Un bâton de 1,5 m projette une ombre de 2 m. Au même moment, l'ombre d'un palmier mesure 12 m. Quelle est la hauteur du palmier ?",
      ar: "عصا طولها [[1,5 m]] ظلها [[2 m]]. في اللحظة نفسها ظل نخلة [[12 m]]. ما ارتفاع النخلة؟",
      o: ["6 m", "9 m", "10,5 m"],
      a: 1,
      e: "À la même heure, les rapports hauteur ÷ ombre sont égaux : 1,5 ÷ 2 = h ÷ 12, donc h = 1,5 × 12 ÷ 2 = 9 m. C'est le théorème de Thalès.",
      ear: "[[1,5 ÷ 2 = h ÷ 12]] إذن [[h = 9 m]]. هذه مبرهنة طالس."
    },

    prepare: [
      ['Les rayons du soleil sont parallèles entre eux.', true, 'C\'est ce qui rend la méthode possible.'],
      ['Si 2/3 = x/12, alors x = 8.', true, 'x = 2 × 12 ÷ 3.'],
      ['Dans un agrandissement, les longueurs sont multipliées par des nombres différents.', false, 'Toutes par le même coefficient.']
    ],

    regarde: {
      vb: '0 0 360 220', label: 'Le théorème de Thalès',
      hud: [['h', 'hypothèse'], ['r', 'rapports'], ['c', 'conclusion']],
      draw: function (svg) { var e = {}; e.f = figure(svg); return e; },
      steps: [
        { cap: 'Triangle ABC. **M** est sur [AB], **N** sur [AC], et **(MN) // (BC)**.', ar: 'مثلث ABC، النقطة M من [AB] و N من [AC]، و [[(MN) // (BC)]].', hud: { h: ['(MN) // (BC)'], r: '–', c: '–' }, run: function (e) { e.f.set(0.5); } },
        { cap: 'Alors **AM/AB = AN/AC = MN/BC**. Le petit triangle est une réduction du grand.', ar: 'إذن [[AM/AB = AN/AC = MN/BC]].', hud: { h: '(MN) // (BC)', r: ['AM/AB = AN/AC = MN/BC'], c: 'Thalès' }, run: function (e) { e.f.set(0.5); } },
        { cap: 'Si M est au tiers de [AB], MN vaut le tiers de BC.', ar: 'إذا كانت M في ثلث [AB] فإن MN يساوي ثلث BC.', hud: { h: 'AM/AB = 1/3', r: ['MN/BC = 1/3'], c: ['MN = BC ÷ 3'] }, run: function (e) { e.f.set(1 / 3); } },
        { cap: '**Réciproque** : si AM/AB = AN/AC (points dans le même ordre), alors **(MN) // (BC)**.', ar: 'المبرهنة العكسية: إذا كان [[AM/AB = AN/AC]] والنقط بنفس الترتيب فإن [[(MN) // (BC)]].', hud: { h: ['AM/AB = AN/AC'], r: 'égaux', c: ['(MN) // (BC)'] }, run: function (e) { e.f.set(0.7); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Déplace M : le rapport MN/BC suit toujours AM/AB.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 220', role: 'img', 'aria-label': 'Triangle de Thalès' }, st);
          var f = figure(svg), set = MV.hud(c, [['a', 'AM/AB'], ['n', 'AN/AC'], ['m', 'MN/BC', 1]]);
          MV.slider(c, { label: 'AM/AB (%)', min: 10, max: 90, value: 30, step: 10 }, function (p) { f.set(p / 100); var v = (p / 100).toString().replace('.', ','); set('a', v); set('n', v); set('m', v); if (p === 50) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Place M au milieu de [AB].', c);
        } },
      { title: 'Résolvons ensemble', intro: 'AB = 10, AM = 4, BC = 15 et (MN) // (BC). Calcule MN.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. On écrit :', o: ['AM/AB = MN/BC', 'AM/AB = BC/MN'], a: 0 },
            { type: 'opt', q: 'Étape 2. Donc 4/10 = MN/15, et MN =', o: ['4 × 15 ÷ 10', '10 × 15 ÷ 4'], a: 0 },
            { q: 'Étape 3. MN = ?', a: 6 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le théorème de Thalès demande que (MN) et (BC) soient :', o: ['parallèles', 'perpendiculaires'], a: 0 },
      { lvl: 'Niveau 2', q: 'AM/AB = 1/2 et BC = 18. MN = ?', a: 9 },
      { lvl: 'Niveau 3', q: 'AM = 3, AB = 9, AN = 4, AC = 12. Que dire de (MN) et (BC) ?', o: ['parallèles', 'on ne peut rien dire'], a: 0, e: '3/9 = 4/12 = 1/3.' },
      { lvl: 'Niveau 4', q: 'AN = 6, AC = 8, BC = 20 et (MN) // (BC). MN = ?', a: 15 }
    ],

    bilan: {
      vb: '0 0 360 220', label: 'La hauteur du palmier',
      hud: [['e', 'égalité'], ['c', 'calcul'], ['h', 'hauteur']],
      draw: function (svg) { var e = {}; e.f = figure(svg); return e; },
      steps: [
        { cap: 'Rayons parallèles : **1,5/h = 2/12**.', hud: { e: ['1,5/h = 2/12'], c: '–', h: '–' }, run: function (e) { e.f.set(1 / 6); } },
        { cap: 'h = 1,5 × 12 ÷ 2 = **9 m**.', ar: 'ارتفاع النخلة [[h = 1,5 × 12 ÷ 2 = 9 m]].', hud: { e: '1,5/h = 2/12', c: ['1,5 × 12 ÷ 2'], h: ['9 m'] }, run: function (e) { e.f.set(1 / 6); } }
      ]
    },

    retenir: [
      '<b>Thalès</b> : si M ∈ [AB], N ∈ [AC] et <b class="mono">(MN) // (BC)</b>, alors <b class="mono">AM/AB = AN/AC = MN/BC</b>.',
      '<b>Réciproque</b> : si A, M, B et A, N, C sont alignés dans le même ordre et <b class="mono">AM/AB = AN/AC</b>, alors (MN) // (BC).'
    ],
    retenirAr: 'مبرهنة طاليس: إذا كان [[(MN) // (BC)]] فإن [[AM/AB = AN/AC = MN/BC]]. المبرهنة العكسية: إذا تساوت النسبتان والنقط بنفس الترتيب فإن المستقيمين متوازيان.',
    voc: [['le théorème de Thalès', 'مبرهنة طاليس'], ['la réciproque', 'المبرهنة العكسية'], ['un rapport', 'نسبة'], ['proportionnel', 'متناسب']]
  });
})();
