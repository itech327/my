/* @meta {"id":"3ac-equilibre-forces","level":"3","order":12,"theme":"Mécanique","title":"Équilibre d'un solide soumis à deux forces","ar":"توازن جسم صلب خاضع لقوتين","lead":"Au tir à la corde, deux équipes tirent de toutes leurs forces et la corde ne bouge pas. Que faut-il pour que deux forces s'annulent ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, RAD = Math.PI / 180, C = [180, 105], K = 8; // 1 N = 8 px

  function fleche(g, A, ang, F, col, lab) {
    var L = F * K, B = [A[0] + L * Math.cos(ang * RAD), A[1] - L * Math.sin(ang * RAD)], ux = Math.cos(ang * RAD), uy = -Math.sin(ang * RAD);
    S('line', { x1: A[0], y1: A[1], x2: B[0] - ux * 8, y2: B[1] - uy * 8, stroke: col, 'stroke-width': 4 }, g);
    S('path', { d: 'M' + B[0] + ' ' + B[1] + ' L' + (B[0] - ux * 13 - uy * 7) + ' ' + (B[1] - uy * 13 + ux * 7) + ' L' + (B[0] - ux * 13 + uy * 7) + ' ' + (B[1] - uy * 13 - ux * 7) + ' Z', fill: col }, g);
    T(g, B[0] + ux * 14, B[1] + uy * 14 + 4, lab, 'lbl');
  }

  /* un anneau tiré par deux forces F1 (vers la gauche) et F2 (angle réglable) */
  function anneau(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (f1, f2, a2, ligne) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (ligne) S('line', { x1: 10, y1: C[1], x2: 350, y2: C[1], stroke: 'rgba(255,255,255,.25)', 'stroke-dasharray': '6 5' }, dyn);
      var eq = f1 === f2 && a2 === 0, dx = eq ? 0 : (f2 * Math.cos(a2 * RAD) - f1) * 2, dy = eq ? 0 : -f2 * Math.sin(a2 * RAD) * 2, P = [C[0] + Math.max(-40, Math.min(40, dx)), C[1] + Math.max(-30, Math.min(30, dy))];
      fleche(dyn, P, 180, f1, '#f28c28', 'F₁'); if (f2 > 0.5) fleche(dyn, P, a2, f2, '#7fb2ff', 'F₂');
      S('circle', { cx: P[0], cy: P[1], r: 12, fill: 'none', stroke: '#e9e9ea', 'stroke-width': 4 }, dyn);
      return eq;
    };
    return g;
  }

  MV.lesson({
    id: '3ac-equilibre-forces',
    objectif: {
      fr: 'Caractériser une force (point d\'application, droite d\'action, sens, intensité) et énoncer la condition d\'équilibre d\'un solide soumis à deux forces.',
      ar: 'تحديد مميزات قوة (نقطة التأثير، خط التأثير، المنحى، الشدة) وصياغة شرط توازن جسم صلب خاضع لقوتين.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Le tir à la corde',
      hud: [['a', 'équipe A'], ['b', 'équipe B'], ['q', 'pourquoi rien ne bouge ?']],
      draw: function (svg) { var e = {}; e.a = anneau(svg); return e; },
      steps: [
        { cap: 'L\'équipe A tire la corde vers la **gauche**.', hud: { a: ['tire à gauche'], b: '–', q: '–' }, run: function (e) { e.a.set(12, 0, 0); } },
        { cap: 'L\'équipe B tire vers la **droite**, aussi fort.', hud: { a: 'tire à gauche', b: ['tire à droite'], q: '–' }, run: function (e) { e.a.set(12, 12, 0); } },
        { cap: 'La corde reste **immobile**. Quelles conditions faut-il ? On le saura à la fin.', hud: { a: 'tire à gauche', b: 'tire à droite', q: ['?'] }, run: function (e) { e.a.set(12, 12, 0, 1); } }
      ]
    },

    predire: {
      q: "Deux équipes tirent sur une corde en sens contraires, et la corde reste immobile. Quelles conditions les deux forces doivent-elles remplir ?",
      ar: "فريقان يشدّان حبلاً في اتجاهين متعاكسين فيبقى ساكناً. ما شروط القوتين؟",
      o: ["Même sens et même intensité", "Même droite d'action, sens opposés et même intensité", "Seulement la même intensité"],
      a: 1,
      e: "Un solide soumis à deux forces est en équilibre si elles ont la même droite d'action, des sens opposés et la même intensité.",
      ear: "يكون الجسم متوازناً تحت قوتين إذا كان لهما خط التأثير نفسه ومنحيان متعاكسان وشدة واحدة."
    },

    prepare: [
      ['Une force se mesure en newtons (N).', true, 'Avec un dynamomètre.'],
      ['Une force n\'a pas de sens.', false, 'Une force a un sens : on tire ou on pousse dans une direction précise.'],
      ['Un objet posé sur une table subit au moins deux forces.', true, 'Son poids et l\'action de la table.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'La condition d\'équilibre',
      hud: [['c', 'caractéristique'], ['f', 'F₁ et F₂'], ['e', 'équilibre ?']],
      draw: function (svg) { var e = {}; e.a = anneau(svg); return e; },
      steps: [
        { cap: 'Une force a un **point d\'application**, une **droite d\'action**, un **sens** et une **intensité** en N.', ar: 'للقوة نقطة تأثير وخط تأثير ومنحى وشدة بالنيوتن.', hud: { c: ['4 caractéristiques'], f: '–', e: '–' }, run: function (e) { e.a.set(10, 0, 0, 1); } },
        { cap: 'Mêmes droite d\'action et intensité, sens **opposés** : l\'anneau est en **équilibre**.', ar: 'نفس خط التأثير ونفس الشدة ومنحيان متعاكسان: الجسم في توازن.', hud: { c: 'même droite', f: ['10 N et 10 N'], e: ['oui'] }, run: function (e) { e.a.set(10, 10, 0, 1); } },
        { cap: 'Si F₂ est **plus forte**, l\'anneau part vers la droite : pas d\'équilibre.', ar: 'إذا كانت F₂ أكبر يتحرك الجسم: لا توازن.', hud: { c: 'intensités différentes', f: ['10 N et 14 N'], e: ['non'] }, run: function (e) { e.a.set(10, 14, 0, 1); } },
        { cap: 'Mêmes intensités mais droites **différentes** : l\'anneau bouge aussi.', ar: 'نفس الشدة لكن خطا التأثير مختلفان: لا توازن.', hud: { c: 'droites différentes', f: '10 N et 10 N', e: ['non'] }, run: function (e) { e.a.set(10, 10, 30, 1); } },
        { cap: 'Condition : **même droite d\'action**, **sens opposés**, **même intensité**.', ar: 'شرط التوازن: نفس خط التأثير، منحيان متعاكسان، نفس الشدة.', hud: { c: ['3 conditions'], f: 'F₁ = F₂', e: ['oui'] }, run: function (e) { e.a.set(10, 10, 0, 1); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Règle F₂ (intensité et direction) pour mettre l\'anneau en équilibre. F₁ vaut 12 N vers la gauche.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Anneau et deux forces' }, st);
          var an = anneau(svg), f2 = 8, a2 = 30, set = MV.hud(c, [['f', 'F₂'], ['a', 'angle de F₂'], ['e', 'équilibre ?', 1]]);
          function upd() { var eq = an.set(12, f2, a2, 1); set('f', f2 + ' N'); set('a', a2 + '°'); set('e', eq ? 'oui' : 'non'); if (eq) done(); }
          MV.slider(c, { label: 'F₂ (N)', min: 2, max: 16, value: 8, step: 2 }, function (v) { f2 = v; upd(); });
          MV.slider(c, { label: 'angle de F₂ (°)', min: 0, max: 60, value: 30, step: 10 }, function (v) { a2 = v; upd(); });
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'Une lampe de poids 6 N est suspendue à un fil, immobile.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Les deux forces sont :', o: ['le poids et la tension du fil', 'le poids seul'], a: 0 },
            { type: 'opt', q: 'Étape 2. La tension du fil est dirigée :', o: ['vers le haut', 'vers le bas'], a: 0 },
            { q: 'Étape 3. Intensité de la tension (N) ?', a: 6 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'On mesure une force avec :', o: ['un dynamomètre', 'une balance'], a: 0 },
      { lvl: 'Niveau 2', q: 'Deux forces en équilibre ont des sens :', o: ['opposés', 'identiques'], a: 0 },
      { lvl: 'Niveau 3', q: 'Un livre de poids 4 N est posé sur une table. La table exerce une force de ? N', a: 4 },
      { lvl: 'Niveau 4', q: 'Sur un dessin, 1 cm représente 2 N. Une force de 7 N mesure ? cm', a: 3.5 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'La corde immobile',
      hud: [['d', 'droite'], ['s', 'sens'], ['i', 'intensité']],
      draw: function (svg) { var e = {}; e.a = anneau(svg); return e; },
      steps: [
        { cap: 'Les deux équipes tirent sur la **même droite**, en **sens opposés**.', hud: { d: ['la corde'], s: ['opposés'], i: '–' }, run: function (e) { e.a.set(12, 12, 0, 1); } },
        { cap: 'Avec la **même intensité**, les forces se compensent : la corde reste immobile.', ar: 'قوتان لهما نفس خط التأثير ومنحيان متعاكسان ونفس الشدة: الحبل في توازن.', hud: { d: 'la corde', s: 'opposés', i: ['égales'] }, run: function (e) { e.a.set(12, 12, 0, 1); } }
      ]
    },

    retenir: [
      'Une <b>force</b> est caractérisée par son point d\'application, sa droite d\'action, son sens et son <b>intensité</b> en newtons (N), mesurée au <b>dynamomètre</b>.',
      'Un solide soumis à deux forces est en <b>équilibre</b> si elles ont la <b>même droite d\'action</b>, des <b>sens opposés</b> et la <b>même intensité</b>.'
    ],
    retenirAr: 'للقوة نقطة تأثير وخط تأثير ومنحى وشدة تقاس بالنيوتن بواسطة الدينامومتر. يكون جسم خاضع لقوتين في توازن إذا كان لهما نفس خط التأثير ومنحيان متعاكسان ونفس الشدة.',
    voc: [['une force', 'قوة'], ['l\'intensité', 'الشدة'], ['la droite d\'action', 'خط التأثير'], ['un dynamomètre', 'دينامومتر'], ['l\'équilibre', 'التوازن']]
  });
})();
