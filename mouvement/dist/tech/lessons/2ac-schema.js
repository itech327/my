/* @meta {"id":"2ac-schema","level":"2","order":3,"theme":"Fonctions électroniques","title":"Schéma électronique et symboles","ar":"التصميم الإلكتروني والرموز","lead":"Une veilleuse contient une pile, un interrupteur, une résistance et une LED. Pour la fabriquer partout dans le monde de la même façon, on la dessine avec des symboles normalisés."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var E12 = [100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820];
  var COUL = [['noir', '#111'], ['marron', '#7b4a21'], ['rouge', '#d73027'], ['orange', '#f28c28'], ['jaune', '#f2d22e'], ['vert', '#2e9d4f'], ['bleu', '#2f6fd6'], ['violet', '#8e44ad'], ['gris', '#8a8f96'], ['blanc', '#f4f4f4']];

  function bandes(r) { var e = String(r).length - 2, d = String(r); return [+d[0], +d[1], e]; }
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g), dyn0 = dyn;
    function symb(n, x, y, on, par) {
      var dyn = par || dyn0, c = on ? 'var(--acc)' : '#e9e9ea', w = 2.5;
      if (n === 'pile') { S('path', { d: 'M' + (x - 20) + ' ' + y + 'H' + (x - 4) + 'M' + (x + 4) + ' ' + y + 'H' + (x + 20) + 'M' + (x - 4) + ' ' + (y - 14) + 'V' + (y + 14) + 'M' + (x + 4) + ' ' + (y - 7) + 'V' + (y + 7), stroke: c, 'stroke-width': w }, dyn); }
      if (n === 'lampe') { S('circle', { cx: x, cy: y, r: 12, fill: 'none', stroke: c, 'stroke-width': w }, dyn); S('path', { d: 'M' + (x - 8) + ' ' + (y - 8) + 'L' + (x + 8) + ' ' + (y + 8) + 'M' + (x + 8) + ' ' + (y - 8) + 'L' + (x - 8) + ' ' + (y + 8) + 'M' + (x - 26) + ' ' + y + 'H' + (x - 12) + 'M' + (x + 12) + ' ' + y + 'H' + (x + 26), stroke: c, 'stroke-width': w }, dyn); }
      if (n === 'inter') { S('path', { d: 'M' + (x - 24) + ' ' + y + 'H' + (x - 10) + 'L' + (x + 10) + ' ' + (y - 12) + 'M' + (x + 10) + ' ' + y + 'H' + (x + 24), stroke: c, 'stroke-width': w, fill: 'none' }, dyn); }
      if (n === 'res') { S('rect', { x: x - 16, y: y - 7, width: 32, height: 14, fill: 'none', stroke: c, 'stroke-width': w }, dyn); S('path', { d: 'M' + (x - 28) + ' ' + y + 'H' + (x - 16) + 'M' + (x + 16) + ' ' + y + 'H' + (x + 28), stroke: c, 'stroke-width': w }, dyn); }
      if (n === 'led') {
        S('path', { d: 'M' + (x - 10) + ' ' + (y - 10) + 'L' + (x + 8) + ' ' + y + 'L' + (x - 10) + ' ' + (y + 10) + 'Z', fill: 'none', stroke: c, 'stroke-width': w }, dyn);
        S('path', { d: 'M' + (x + 8) + ' ' + (y - 10) + 'V' + (y + 10) + 'M' + (x - 24) + ' ' + y + 'H' + (x - 10) + 'M' + (x + 8) + ' ' + y + 'H' + (x + 22) + 'M' + (x + 2) + ' ' + (y - 14) + 'L' + (x + 10) + ' ' + (y - 22) + 'M' + (x + 8) + ' ' + (y - 12) + 'L' + (x + 16) + ' ' + (y - 20), stroke: c, 'stroke-width': 2, fill: 'none' }, dyn);
      }
      if (n === 'moteur') { S('circle', { cx: x, cy: y, r: 12, fill: 'none', stroke: c, 'stroke-width': w }, dyn); T(dyn, x, y + 5, 'M', 'lbl'); S('path', { d: 'M' + (x - 26) + ' ' + y + 'H' + (x - 12) + 'M' + (x + 12) + ' ' + y + 'H' + (x + 26), stroke: c, 'stroke-width': w }, dyn); }
    }
    function catalogue(hot) {
      [['pile', 'pile'], ['inter', 'interrupteur'], ['res', 'résistance'], ['led', 'LED'], ['lampe', 'lampe'], ['moteur', 'moteur']].forEach(function (s, i) {
        var x = 64 + (i % 3) * 116, y = 54 + Math.floor(i / 3) * 90;
        S('rect', { x: x - 50, y: y - 34, width: 100, height: 76, rx: 8, fill: hot === s[0] ? 'var(--acc-bg)' : '#1d1f22', stroke: hot === s[0] ? 'var(--acc)' : '#2c2f34', 'stroke-width': 2 }, dyn);
        symb(s[0], x, y - 4, hot === s[0]); T(dyn, x, y + 32, s[1], 'tag');
      });
    }
    function schema(on) {
      S('path', { d: 'M40 60H96M144 60H192M248 60H320V150H244M196 150H122M78 150H40V60', stroke: on ? '#f2c14e' : '#9aa0a8', 'stroke-width': 2, fill: 'none' }, dyn);
      symb('pile', 100, 150, false); symb('inter', 120, 60, false); symb('res', 220, 60, false);
      symb('led', 220, 150, false, S('g', { transform: 'translate(440 0) scale(-1 1)' }, dyn));
      T(dyn, 100, 180, 'pile 9 V', 'tag'); T(dyn, 120, 36, 'K', 'tag'); T(dyn, 220, 40, 'R', 'tag'); T(dyn, 220, 186, 'D (LED)', 'tag');
      if (on) {
        S('line', { x1: 110, y1: 60, x2: 130, y2: 60, stroke: '#f2c14e', 'stroke-width': 2.5 }, dyn);
        var d = S('circle', { r: 3.5, fill: '#f2c14e' }, dyn); S('animateMotion', { dur: '2.4s', repeatCount: 'indefinite', path: 'M40 60H320V150H40V60' }, d);
        S('circle', { cx: 216, cy: 150, r: 18, fill: 'rgba(255,90,90,.25)' }, dyn);
      }
    }
    function resistance(r) {
      var b = bandes(r);
      S('path', { d: 'M20 100H90M270 100H340', stroke: '#9aa0a8', 'stroke-width': 4 }, dyn);
      S('rect', { x: 90, y: 74, width: 180, height: 52, rx: 24, fill: '#d9c08f' }, dyn);
      b.concat([10]).forEach(function (v, i) {
        var col = i === 3 ? '#c9a227' : COUL[v][1];
        S('rect', { x: [118, 148, 178, 236][i], y: 74, width: 14, height: 52, fill: col }, dyn);
      });
      T(dyn, 180, 160, COUL[b[0]][0] + ' ' + b[0] + ' · ' + COUL[b[1]][0] + ' ' + b[1] + ' · ' + COUL[b[2]][0] + ' ' + ['×1', '×10', '×100', '×1000'][b[2]], 'tag');
      T(dyn, 180, 50, 'R = ' + r + ' Ω', 'lbl big');
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.r) resistance(o.r); else if (o.sch != null) schema(o.sch); else catalogue(o.hot);
    };
    return g;
  }

  MV.lesson({
    id: '2ac-schema',
    objectif: {
      fr: 'Reconnaître les symboles normalisés (pile, interrupteur, résistance, LED, lampe, moteur), lire un schéma électronique et trouver la valeur d’une résistance avec le code des couleurs.',
      ar: 'التعرف على الرموز المعيارية، وقراءة تصميم إلكتروني، وإيجاد قيمة مقاومة بسنن الألوان.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'La veilleuse',
      hud: [['c', 'composants'], ['d', 'dessin']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Une veilleuse : pile, interrupteur, résistance, LED.', hud: { c: ['4'], d: '?' }, run: function (e) { e.s.set({ hot: 'led' }); } },
        { cap: 'On la dessine avec des **symboles** que tout le monde comprend.', hud: { c: '4', d: ['schéma'] }, run: function (e) { e.s.set({ sch: 0 }); } },
        { cap: 'Et sur la résistance, des **anneaux de couleur**. Que disent-ils ?', hud: { c: '4', d: ['code couleur ?'] }, run: function (e) { e.s.set({ r: 470 }); } }
      ]
    },

    prepare: [
      ['Un circuit doit être fermé pour que le courant passe.', true, 'Une boucle complète.'],
      ['La résistance se mesure en ohms (Ω).', true, 'Symbole de l’unité : Ω.'],
      ['Chaque pays dessine ses propres symboles électriques.', false, 'Ils sont normalisés au niveau international.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Symboles, schéma, couleurs',
      hud: [['n', 'notion'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Chaque composant a un **symbole normalisé**.', ar: 'لكل مكون رمز معياري.', hud: { n: ['symboles'], v: '6' }, run: function (e) { e.s.set({}); } },
        { cap: 'La **LED** : un triangle, un trait et deux flèches qui **sortent** (elle émet de la lumière).', ar: 'الصمام الضوئي: مثلث وخط وسهمان خارجان.', hud: { n: 'LED', v: ['flèches sortantes'] }, run: function (e) { e.s.set({ hot: 'led' }); } },
        { cap: 'Le **schéma** relie les symboles par des traits : c’est le plan du circuit.', ar: 'التصميم يربط الرموز بخطوط: إنه مخطط الدارة.', hud: { n: ['schéma'], v: 'K ouvert' }, run: function (e) { e.s.set({ sch: 0 }); } },
        { cap: 'On ferme **K** : le courant circule, la LED s’allume. **Fonction technique** : signaler.', ar: 'نغلق K فيمر التيار ويشتعل الصمام. الوظيفة التقنية: الإشارة.', hud: { n: 'fonction technique', v: ['signaler'] }, run: function (e) { e.s.set({ sch: 1 }); } },
        { cap: 'Code des couleurs : 1er anneau, 2e anneau, puis le **multiplicateur**. Jaune 4, violet 7, marron ×10 : **470 Ω**.', ar: 'سنن الألوان: الحلقة 1 ثم 2 ثم المضاعف. أصفر 4، بنفسجي 7، بني ×10: [[470 Ω]].', hud: { n: ['code couleur'], v: ['470 Ω'] }, run: function (e) { e.s.set({ r: 470 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis une résistance et lis ses anneaux. Trouve celle de 470 Ω.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Code des couleurs' }, st);
          var s = scene(svg), set = MV.hud(c, [['r', 'valeur', 1], ['b', 'anneaux']]);
          MV.slider(c, { label: 'R', min: 0, max: 11, value: 0, fmt: function (i) { return E12[i] + ' Ω'; } }, function (i) {
            var r = E12[i], b = bandes(r); s.set({ r: r }); set('r', r + ' Ω'); set('b', COUL[b[0]][0] + ', ' + COUL[b[1]][0] + ', ' + COUL[b[2]][0]); if (r === 470) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'noir 0 · marron 1 · rouge 2 · orange 3 · jaune 4 · vert 5 · bleu 6 · violet 7 · gris 8 · blanc 9', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Lis ces résistances.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Rouge, rouge, marron. Valeur (Ω) ?', a: 220, hint: '2, 2, puis ×10' },
            { q: 'Étape 2. Marron, noir, rouge. Valeur (Ω) ?', a: 1000, hint: '1, 0, puis ×100' },
            { type: 'opt', q: 'Étape 3. Le symbole de la LED a :', o: ['deux flèches qui sortent', 'une croix dans un cercle'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un cercle avec une croix représente :', o: ['une lampe', 'un moteur'], a: 0 },
      { lvl: 'Niveau 2', q: 'Un schéma électronique sert à :', o: ['représenter le circuit avec des symboles', 'décorer le boîtier'], a: 0 },
      { lvl: 'Niveau 3', q: 'Jaune, violet, rouge. Valeur (Ω) ?', a: 4700 },
      { lvl: 'Niveau 4', q: 'Orange, orange, marron. Valeur (Ω) ?', a: 330 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le plan de la veilleuse',
      hud: [['c', 'composants'], ['d', 'dessin']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le **schéma** dit comment relier pile, K, R et LED, avec des symboles normalisés.', hud: { c: '4', d: ['schéma'] }, run: function (e) { e.s.set({ sch: 1 }); } },
        { cap: 'Les anneaux jaune, violet, marron disent : **470 Ω**.', ar: 'الحلقات أصفر، بنفسجي، بني تعني [[470 Ω]].', hud: { c: '4', d: ['470 Ω'] }, run: function (e) { e.s.set({ r: 470 }); } }
      ]
    },

    retenir: [
      'Un <b>schéma électronique</b> représente un circuit avec des <b>symboles normalisés</b> reliés par des traits. Chaque partie du circuit réalise une <b>fonction technique</b> (alimenter, commuter, signaler…).',
      'Code des couleurs : 1er anneau = 1er chiffre, 2e anneau = 2e chiffre, 3e anneau = <b>multiplicateur</b> (nombre de zéros). Jaune, violet, marron = <b class="mono">470 Ω</b>.'
    ],
    retenirAr: 'التصميم الإلكتروني يمثل الدارة برموز معيارية. سنن الألوان: الحلقة الأولى الرقم الأول، والثانية الرقم الثاني، والثالثة عدد الأصفار.',
    voc: [['un schéma', 'تصميم'], ['un symbole', 'رمز'], ['une résistance', 'مقاومة'], ['le code des couleurs', 'سنن الألوان'], ['une fonction technique', 'وظيفة تقنية']]
  });
})();
