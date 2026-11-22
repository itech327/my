/* @meta {"id":"1ac-etats-matiere","level":"1","order":2,"theme":"Matière et environnement","title":"Les trois états de la matière","ar":"حالات المادة الثلاث","lead":"Un glaçon, de l'eau, de la vapeur : on les change de récipient et on penche le verre pour voir ce qui garde sa forme."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* découpe d'un polygone par le demi-plan y ≥ h (l'eau occupe le bas) */
  function clip(poly, h) {
    var out = [];
    for (var i = 0; i < poly.length; i++) {
      var p = poly[i], q = poly[(i + 1) % poly.length], pin = p[1] >= h, qin = q[1] >= h;
      if (pin) out.push(p);
      if (pin !== qin) { var t = (h - p[1]) / (q[1] - p[1]); out.push([p[0] + t * (q[0] - p[0]), h]); }
    }
    return out;
  }
  function aire(p) { var s = 0; for (var i = 0; i < p.length; i++) { var a = p[i], b = p[(i + 1) % p.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; }
  /* verre penché : rectangle w × h posé en (cx, base), tourné de ang degrés autour du bas ; volume d'eau = fraction f */
  function verre(svg, cx, base, w, hh) {
    var g = S('g', {}, svg), eau = S('polygon', { fill: 'var(--acc)', opacity: .85 }, g), bord = S('polygon', { fill: 'none', stroke: '#cfd3d8', 'stroke-width': 3 }, g);
    var surf = S('line', { stroke: '#fff', 'stroke-width': 2, 'stroke-dasharray': '5 4' }, g);
    g.set = function (ang, f) {
      var a = ang * Math.PI / 180, co = Math.cos(a), si = Math.sin(a);
      var loc = [[-w / 2, 0], [w / 2, 0], [w / 2, -hh], [-w / 2, -hh]];
      var P = loc.map(function (p) { return [cx + p[0] * co - p[1] * si, base + p[0] * si + p[1] * co]; });
      bord.setAttribute('points', P.map(function (p) { return p.join(','); }).join(' '));
      var target = f * w * hh, lo = Math.min.apply(null, P.map(function (p) { return p[1]; })), hi = Math.max.apply(null, P.map(function (p) { return p[1]; }));
      for (var k = 0; k < 40; k++) { var mid = (lo + hi) / 2; if (aire(clip(P, mid)) > target) lo = mid; else hi = mid; }
      var W = clip(P, lo);
      eau.setAttribute('points', W.map(function (p) { return p.join(','); }).join(' '));
      var xs = W.filter(function (p) { return Math.abs(p[1] - lo) < 0.5; }).map(function (p) { return p[0]; });
      if (xs.length > 1) { surf.setAttribute('x1', Math.min.apply(null, xs) - 14); surf.setAttribute('x2', Math.max.apply(null, xs) + 14); surf.setAttribute('y1', lo); surf.setAttribute('y2', lo); }
    };
    return g;
  }

  MV.lesson({
    id: '1ac-etats-matiere',
    objectif: {
      fr: 'Distinguer les états solide, liquide et gazeux par leur forme et leur volume.',
      ar: 'التمييز بين الحالات الصلبة والسائلة والغازية بشكلها وحجمها.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'Glaçon, eau et vapeur',
      hud: [['s', 'glaçon'], ['l', 'eau'], ['g', 'vapeur']],
      draw: function (svg) {
        var e = {};
        e.glace = S('rect', { x: 40, y: 110, width: 60, height: 60, rx: 6, fill: '#cfe6f7', stroke: '#fff', 'stroke-width': 2 }, svg);
        e.eau = S('path', { d: 'M140 120 h80 v60 h-80 z', fill: 'var(--acc)' }, svg);
        S('path', { d: 'M136 100 v84 h88 v-84', fill: 'none', stroke: '#cfd3d8', 'stroke-width': 3 }, svg);
        e.vap = S('g', {}, svg);
        [270, 290, 310].forEach(function (x) { S('path', { d: 'M' + x + ' 180 q-8 -20 0 -40 q8 -20 0 -40', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2, 'stroke-dasharray': '3 4' }, e.vap); });
        T(svg, 70, 200, 'solide', 'tag'); T(svg, 180, 200, 'liquide', 'tag'); T(svg, 290, 200, 'gaz', 'tag');
        return e;
      },
      steps: [
        { cap: 'Un **glaçon**, de l\'eau liquide, de la vapeur : c\'est toujours de l\'eau.', on: ['glace', 'eau', 'vap'], hud: { s: ['solide'], l: ['liquide'], g: ['gaz'] } },
        { cap: 'Pourtant, elles ne se comportent **pas pareil**.', on: ['glace', 'eau', 'vap'], hud: { s: 'solide', l: 'liquide', g: 'gaz' } },
        { cap: 'Qu\'est-ce qui les **distingue** ? On le saura à la fin.', on: ['glace', 'eau', 'vap'], hud: { s: '?', l: '?', g: '?' } }
      ]
    },

    predire: {
      q: "Un glaçon, de l'eau liquide et de la vapeur sont toujours de l'eau. Qu'est-ce qui les distingue ?",
      ar: "قطعة جليد وماء سائل وبخار كلها ماء. ما الذي يميّزها؟",
      o: ["Leur substance : ce sont trois corps différents", "Leur façon d'occuper l'espace : forme et volume propres ou non", "Leur couleur"],
      a: 1,
      e: "C'est la même substance dans trois états. Un solide a une forme et un volume propres. Un liquide a un volume propre et prend la forme du récipient. Un gaz n'a ni forme ni volume propres.",
      ear: "المادة واحدة بثلاث حالات: الصلب له شكل وحجم خاصان، والسائل له حجم خاص ويأخذ شكل الإناء، والغاز لا شكل له ولا حجم."
    },

    prepare: [
      ['Le lait est un liquide.', true, 'Il coule et prend la forme du récipient.'],
      ['Une pierre change de forme quand on la met dans une boîte.', false, 'Un solide garde sa propre forme.'],
      ['L\'air remplit tout le ballon dans lequel il se trouve.', true, 'Un gaz occupe tout l\'espace disponible.']
    ],

    regarde: {
      vb: '0 0 360 260', label: 'Changer de récipient, pencher le verre',
      hud: [['f', 'forme propre'], ['v', 'volume propre'], ['e', 'état']],
      draw: function (svg) {
        var e = {};
        e.cube = S('rect', { x: 0, y: 0, width: 50, height: 50, rx: 6, fill: '#cfe6f7', stroke: '#fff', 'stroke-width': 2 }, svg);
        e.cube.style.cssText = 'transition:transform 1s;transform-box:view-box';
        e.r1 = S('path', { d: 'M40 120 v120 h70 v-120', fill: 'none', stroke: '#cfd3d8', 'stroke-width': 3 }, svg);
        e.r2 = S('path', { d: 'M200 190 v50 h140 v-50', fill: 'none', stroke: '#cfd3d8', 'stroke-width': 3 }, svg);
        e.l1 = S('rect', { x: 42, y: 160, width: 66, height: 78, fill: 'var(--acc)' }, svg);
        e.l2 = S('rect', { x: 202, y: 201, width: 136, height: 37, fill: 'var(--acc)' }, svg);
        e.verre = verre(svg, 180, 230, 80, 150);
        e.gaz = S('g', {}, svg);
        S('rect', { x: 110, y: 40, width: 140, height: 200, rx: 8, fill: 'none', stroke: '#cfd3d8', 'stroke-width': 3 }, e.gaz);
        e.gaz.pts = [];
        for (var i = 0; i < 26; i++) e.gaz.pts.push(S('circle', { cx: 0, cy: 0, r: 4, fill: '#e9e9ea' }, e.gaz));
        e.gaz.spread = function (full) { e.gaz.pts.forEach(function (c, i) { var x = full ? 122 + (i * 53 % 116) : 160 + (i % 5) * 8, y = full ? 52 + (i * 71 % 176) : 210 + Math.floor(i / 5) * 5; c.style.transition = 'all 1.2s'; c.setAttribute('cx', x); c.setAttribute('cy', y); }); };
        e.ml = T(svg, 180, 30, '200 mL', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'Un glaçon dans un verre étroit : il garde **sa forme**.', ar: 'قطعة الجليد تحتفظ بشكلها.', on: ['cube', 'r1', 'r2'], hud: { f: ['oui'], v: 'oui', e: ['solide'] }, run: function (e) { e.cube.style.transform = 'translate(50px,188px)'; } },
        { cap: 'Dans un récipient large : **même forme**. Un solide a une forme propre.', ar: 'في إناء واسع: نفس الشكل. للجسم الصلب شكل خاص به.', on: ['cube', 'r1', 'r2'], hud: { f: ['oui'], v: 'oui', e: 'solide' }, run: function (e) { e.cube.style.transform = 'translate(245px,188px)'; } },
        { cap: '200 mL d\'eau dans le verre étroit : l\'eau prend **sa forme**.', ar: 'الماء يأخذ شكل الإناء.', on: ['r1', 'r2', 'l1', 'ml'], hud: { f: ['non'], v: '200 mL', e: ['liquide'] } },
        { cap: 'Versée dans le récipient large : autre forme, **même volume**.', ar: 'نفس الحجم بشكل مختلف: للسائل حجم خاص به وليس له شكل خاص.', on: ['r1', 'r2', 'l2', 'ml'], hud: { f: 'non', v: ['200 mL'], e: 'liquide' } },
        { cap: 'On penche le verre : la surface de l\'eau reste **horizontale**.', ar: 'نميل الكأس: يبقى السطح الحر للسائل أفقيا.', on: ['verre'], hud: { f: 'non', v: 'oui', e: ['surface libre plane et horizontale'] }, run: function (e) { e.verre.set(0, 0.45); setTimeout(function () { e.verre.set(25, 0.45); }, 700); } },
        { cap: 'Un gaz occupe **tout** le récipient : ni forme propre, ni volume propre.', ar: 'الغاز يشغل كل الإناء: ليس له شكل خاص ولا حجم خاص.', on: ['gaz'], hud: { f: ['non'], v: ['non'], e: ['gaz'] }, run: function (e) { e.gaz.spread(false); setTimeout(function () { e.gaz.spread(true); }, 300); } }
      ]
    },

    faisons: [
      { title: 'Penche le verre', intro: 'Incline le verre. Observe la surface de l\'eau.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 260', role: 'img', 'aria-label': 'Verre d\'eau incliné' }, st);
          var v = verre(svg, 180, 230, 80, 150), set = MV.hud(c, [['a', 'inclinaison'], ['s', 'surface libre', 1]]);
          MV.slider(c, { label: 'angle', min: -40, max: 40, step: 5, value: 0, fmt: function (x) { return x + '°'; } }, function (x) { v.set(x, 0.45); set('a', x + '°'); set('s', 'horizontale'); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          done();
        } },
      { title: 'Résolvons ensemble', intro: 'Classe ces corps selon leur état.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Un clou en fer est :', o: ['solide', 'liquide', 'gazeux'], a: 0, e: 'Il garde sa forme.' },
            { type: 'opt', q: 'Étape 2. L\'huile d\'olive est :', o: ['solide', 'liquide', 'gazeux'], a: 1, e: 'Elle coule et prend la forme de la bouteille.' },
            { q: 'Étape 3. On verse 250 mL de jus d\'un verre dans une carafe. Quel volume dans la carafe ?', a: 250, unit: 'mL', ok: 'Le volume d\'un liquide ne change pas.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un gaz a :', o: ['une forme propre', 'un volume propre', 'ni forme propre ni volume propre'], a: 2, e: 'Il occupe tout l\'espace offert.' },
      { lvl: 'Niveau 2', q: 'La surface libre d\'un liquide au repos est :', o: ['penchée comme le récipient', 'plane et horizontale', 'toujours courbée'], a: 1, e: 'Même si on penche le récipient.' },
      { lvl: 'Niveau 3', q: 'On transvase 1,5 L d\'eau d\'une bouteille dans une casserole. Combien de mL dans la casserole ?', a: 1500, unit: 'mL', hint: '1 L = 1 000 mL.' },
      { lvl: 'Niveau 4', q: 'Le sable « coule » dans un sablier. C\'est :', o: ['un liquide', 'un solide en petits grains', 'un gaz'], a: 1, e: 'Chaque grain garde sa forme : c\'est un solide divisé.' }
    ],

    bilan: {
      vb: '0 0 360 220', label: 'Les trois états',
      hud: [['s', 'solide'], ['l', 'liquide'], ['g', 'gaz']],
      draw: function (svg) {
        var e = {};
        S('rect', { x: 40, y: 110, width: 60, height: 60, rx: 6, fill: '#cfe6f7' }, svg);
        S('path', { d: 'M140 120 h80 v60 h-80 z', fill: 'var(--acc)' }, svg);
        S('path', { d: 'M136 100 v84 h88 v-84', fill: 'none', stroke: '#cfd3d8', 'stroke-width': 3 }, svg);
        S('rect', { x: 250, y: 90, width: 80, height: 90, rx: 6, fill: 'none', stroke: '#cfd3d8', 'stroke-width': 3 }, svg);
        for (var i = 0; i < 14; i++) S('circle', { cx: 258 + (i * 29 % 64), cy: 98 + (i * 37 % 74), r: 3.5, fill: '#e9e9ea' }, svg);
        return e;
      },
      steps: [
        { cap: 'Le solide a une **forme propre** et un volume propre.', hud: { s: ['forme + volume'], l: '–', g: '–' } },
        { cap: 'Le liquide a un **volume propre**, mais prend la forme du récipient.', hud: { s: 'forme + volume', l: ['volume'], g: '–' } },
        { cap: 'Le gaz n\'a **ni l\'un ni l\'autre** : il occupe tout l\'espace.', ar: 'الصلب له شكل وحجم خاصان، والسائل له حجم خاص فقط، والغاز ليس له شكل ولا حجم خاصان.', hud: { s: 'forme + volume', l: 'volume', g: ['ni l\'un ni l\'autre'] } }
      ]
    },

    retenir: [
      'Un <b>solide</b> a une forme propre et un volume propre. Un <b>liquide</b> a un volume propre mais prend la forme du récipient ; sa surface libre au repos est <b>plane et horizontale</b>.',
      'Un <b>gaz</b> n\'a ni forme propre ni volume propre : il occupe tout l\'espace qui lui est offert.'
    ],
    retenirAr: 'الجسم الصلب له شكل خاص وحجم خاص. السائل له حجم خاص ويأخذ شكل الإناء، وسطحه الحر في حالة سكون مستو وأفقي. الغاز ليس له شكل خاص ولا حجم خاص.',
    voc: [['l\'état solide', 'الحالة الصلبة'], ['l\'état liquide', 'الحالة السائلة'], ['l\'état gazeux', 'الحالة الغازية'], ['la surface libre', 'السطح الحر'], ['le volume', 'الحجم']]
  });
})();
