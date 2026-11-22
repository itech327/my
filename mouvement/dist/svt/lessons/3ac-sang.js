/* @meta {"id":"3ac-sang","level":"3","order":3,"theme":"Nutrition","title":"Le sang et la circulation","ar":"الدم والدورة الدموية","lead":"Le glucose absorbé dans l'intestin et le dioxygène des poumons arrivent jusqu'au muscle : le sang les transporte."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* tube de sang : avant/après centrifugation */
  function tube(svg, x, y) {
    var g = S('g', { 'data-keep': 1 }, svg), H = 150;
    S('rect', { x: x, y: y, width: 40, height: H, rx: 12, fill: 'none', stroke: '#cfd3d8', 'stroke-width': 2.5 }, g);
    var mix = S('rect', { x: x + 2, y: y + 20, width: 36, height: H - 22, rx: 10, fill: '#a33a3a' }, g);
    var pl = S('rect', { x: x + 2, y: y + 20, width: 36, height: 70, fill: '#f2d27a' }, g), gb = S('rect', { x: x + 2, y: y + 90, width: 36, height: 4, fill: '#f2f2f2' }, g), gr = S('rect', { x: x + 2, y: y + 94, width: 36, height: 54, rx: 10, fill: '#a33a3a' }, g);
    [pl, gb, gr].forEach(function (r) { r.style.transition = 'opacity 1.2s'; }); mix.style.transition = 'opacity 1.2s';
    var labs = S('g', {}, g); T(labs, x + 50, y + 58, 'plasma ≈ 55 %', 'tag', 'start'); T(labs, x + 50, y + 95, 'globules blancs et plaquettes', 'tag', 'start'); T(labs, x + 50, y + 125, 'globules rouges ≈ 45 %', 'tag', 'start');
    labs.style.transition = 'opacity 1.2s';
    g.sep = function (s) { mix.style.opacity = s ? 0 : 1; [pl, gb, gr, labs].forEach(function (r) { r.style.opacity = s ? 1 : 0; }); };
    g.sep(false); return g;
  }
  /* trajet : poumons et intestin → cœur → muscle, avec des particules */
  function trajet(svg) {
    var g = S('g', {}, svg);
    var p = 'M60 60 C 120 60, 140 120, 180 120 C 220 120, 240 180, 300 180';
    S('path', { d: p, fill: 'none', stroke: '#c95a5a', 'stroke-width': 14, 'stroke-linecap': 'round', opacity: .8 }, g);
    S('path', { d: 'M60 180 C 120 180, 140 120, 180 120', fill: 'none', stroke: '#c95a5a', 'stroke-width': 14, 'stroke-linecap': 'round', opacity: .8 }, g);
    S('ellipse', { cx: 50, cy: 60, rx: 34, ry: 22, fill: '#d07a70' }, g); T(g, 50, 30, 'poumons', 'tag');
    S('path', { d: 'M24 180 q14 -16 26 0 t26 0', stroke: '#c9a35a', 'stroke-width': 10, fill: 'none' }, g); T(g, 50, 210, 'intestin grêle', 'tag');
    S('path', { d: 'M180 104 c-14 -16 -34 0 -16 18 l16 16 l16 -16 c18 -18 -2 -34 -16 -18 z', fill: '#e5484d' }, g); T(g, 180, 150, 'cœur', 'tag');
    S('ellipse', { cx: 310, cy: 180, rx: 34, ry: 18, fill: '#a8584f' }, g); T(g, 310, 214, 'muscle', 'tag');
    var o2 = [], gl = [];
    for (var i = 0; i < 4; i++) { o2.push(S('circle', { r: 4, fill: 'var(--acc)' }, g)); gl.push(S('circle', { r: 4, fill: '#f2c14e' }, g)); }
    var pa = document.createElementNS('http://www.w3.org/2000/svg', 'path'); pa.setAttribute('d', p); var len;
    var pb = document.createElementNS('http://www.w3.org/2000/svg', 'path'); pb.setAttribute('d', 'M60 180 C 120 180, 140 120, 180 120 C 220 120, 240 180, 300 180');
    g.appendChild(pa); g.appendChild(pb); pa.style.display = 'none'; pb.style.display = 'none';
    var t0 = 0;
    function tick(ts) {
      if (!t0) t0 = ts; if (!len) { try { len = [pa.getTotalLength(), pb.getTotalLength()]; } catch (e) { len = null; } }
      if (len && len[0]) {
        var q = ((ts - t0) / 5000) % 1;
        o2.forEach(function (d, i) { var pt = pa.getPointAtLength(((q + i / 4) % 1) * len[0]); d.setAttribute('cx', pt.x); d.setAttribute('cy', pt.y); });
        gl.forEach(function (d, i) { var pt = pb.getPointAtLength(((q + i / 4 + 0.12) % 1) * len[1]); d.setAttribute('cx', pt.x); d.setAttribute('cy', pt.y); });
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    return g;
  }

  MV.lesson({
    id: '3ac-sang',
    objectif: {
      fr: 'Connaître la composition du sang et son rôle de transport entre les organes.',
      ar: 'معرفة مكونات الدم ودوره في النقل بين الأعضاء.'
    },

    ouverture: {
      vb: '0 0 360 230', label: 'Du poumon et de l\'intestin au muscle',
      hud: [['o', 'dioxygène'], ['g', 'glucose'], ['q', 'transport ?']],
      draw: function (svg) { var e = {}; e.t = trajet(svg); e.t.setAttribute('data-keep', 1); return e; },
      steps: [
        { cap: 'Le **dioxygène** entre dans le corps par les poumons.', hud: { o: ['poumons'], g: '–', q: '–' } },
        { cap: 'Le **glucose** est absorbé dans l\'intestin grêle.', hud: { o: 'poumons', g: ['intestin'], q: '–' } },
        { cap: 'Le muscle de la jambe en a besoin. **Qui les transporte** ? On le saura à la fin.', hud: { o: 'poumons', g: 'intestin', q: ['?'] } }
      ]
    },

    predire: {
      q: "Quelles cellules du sang transportent le dioxygène des poumons vers les muscles ?",
      ar: "أي خلايا الدم تنقل ثنائي الأكسجين من الرئتين إلى العضلات؟",
      o: ["Les globules blancs", "Les globules rouges", "Les plaquettes"],
      a: 1,
      e: "Le sang est formé de plasma et de cellules : les globules rouges transportent le dioxygène, les globules blancs défendent l'organisme et les plaquettes servent à la coagulation. Le glucose est transporté par le plasma.",
      ear: "الكريات الحمراء تنقل ثنائي الأكسجين، والبيضاء تدافع عن الجسم، والصفائح تساهم في التخثر، والبلازما تنقل الغلوكوز."
    },

    prepare: [
      ['Le sang est rouge à cause des globules rouges.', true, 'Ils contiennent une substance rouge, l\'hémoglobine.'],
      ['Le sang reste immobile dans les vaisseaux.', false, 'Il circule sans arrêt, poussé par le cœur.'],
      ['Le cœur est un muscle.', true, 'Il se contracte et pousse le sang.']
    ],

    regarde: {
      vb: '0 0 360 230', label: 'Composition et circulation du sang',
      hud: [['c', 'constituant'], ['r', 'rôle'], ['v', 'où']],
      draw: function (svg) { var e = {}; e.tube = tube(svg, 60, 40); e.tube.removeAttribute('data-keep'); e.tr = trajet(svg); return e; },
      steps: [
        { cap: 'On **centrifuge** du sang : il se sépare en couches.', ar: 'نضع الدم في جهاز الطرد المركزي فينفصل إلى طبقات.', on: ['tube'], hud: { c: '–', r: '–', v: 'tube' }, run: function (e) { e.tube.sep(false); setTimeout(function () { e.tube.sep(true); }, 600); } },
        { cap: 'Le **plasma**, liquide jaune, transporte le glucose et les déchets.', ar: 'البلازما سائل أصفر ينقل الكليكوز والفضلات.', on: ['tube'], hud: { c: ['plasma'], r: ['transport'], v: '≈ 55 %' }, run: function (e) { e.tube.sep(true); } },
        { cap: 'Les **globules rouges** transportent le dioxygène.', ar: 'الكريات الحمراء تنقل ثنائي الأوكسجين.', on: ['tube'], hud: { c: ['globules rouges'], r: ['dioxygène'], v: '≈ 45 %' }, run: function (e) { e.tube.sep(true); } },
        { cap: 'Les **globules blancs** défendent le corps ; les **plaquettes** arrêtent les saignements.', ar: 'الكريات البيضاء تدافع عن الجسم، والصفائح الدموية توقف النزيف.', on: ['tube'], hud: { c: ['blancs, plaquettes'], r: ['défense, coagulation'], v: 'fine couche' }, run: function (e) { e.tube.sep(true); } },
        { cap: 'Le **cœur** pousse le sang dans des vaisseaux : artères, veines, capillaires.', ar: 'يدفع القلب الدم في الأوعية: الشرايين والأوردة والشعيرات.', on: ['tr'], hud: { c: 'sang', r: ['circulation'], v: 'tout le corps' } },
        { cap: 'Le sang apporte **dioxygène et glucose** aux organes et emporte le dioxyde de carbone et les déchets.', ar: 'يحمل الدم ثنائي الأوكسجين والكليكوز إلى الأعضاء ويأخذ منها ثنائي أوكسيد الكربون والفضلات.', on: ['tr'], hud: { c: 'sang', r: ['apporte et emporte'], v: 'capillaires' } }
      ]
    },

    faisons: [
      { title: 'Centrifugeuse', intro: 'Lance la centrifugation et touche chaque couche.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 220', role: 'img', 'aria-label': 'Tube de sang' }, st);
          var t = tube(svg, 60, 40), set = MV.hud(c, [['c', 'constituant'], ['r', 'rôle', 1]]), row = MV.H('div', 'row', '', c), seen = {};
          MV.H('button', 'btn pri', 'Centrifuger', row).onclick = function () { t.sep(true); };
          [['plasma', 'transporte glucose, sels, déchets'], ['globules rouges', 'transportent le dioxygène'], ['globules blancs', 'défendent l\'organisme'], ['plaquettes', 'coagulation du sang']].forEach(function (k) {
            MV.H('button', 'btn', k[0], row).onclick = function () { set('c', k[0]); set('r', k[1]); seen[k[0]] = 1; if (Object.keys(seen).length === 4) done(); };
          });
          MV.H('p', 'small', 'Découvre le rôle des quatre constituants.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Une analyse montre un nombre de globules rouges trop faible (anémie).',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Les globules rouges transportent :', o: ['le glucose', 'le dioxygène', 'les anticorps'], a: 1 },
            { type: 'opt', q: 'Étape 2. Avec moins de globules rouges, les muscles reçoivent :', o: ['plus de dioxygène', 'moins de dioxygène'], a: 1 },
            { type: 'opt', q: 'Étape 3. La personne risque donc d\'être :', o: ['vite fatiguée à l\'effort', 'plus rapide à la course'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Quel constituant du sang défend l\'organisme ?', o: ['les globules blancs', 'les plaquettes', 'le plasma'], a: 0 },
      { lvl: 'Niveau 2', q: 'Le glucose est transporté surtout par :', o: ['les globules rouges', 'le plasma'], a: 1 },
      { lvl: 'Niveau 3', q: 'Après centrifugation, le plasma occupe environ 55 % d\'un tube de 10 mL. Quel volume de plasma ?', a: 5.5, unit: 'mL', hint: '55 % de 10.' },
      { lvl: 'Niveau 4', q: 'Les échanges entre le sang et les cellules se font au niveau :', o: ['des capillaires', 'du cœur', 'des grosses artères'], a: 0, e: 'Leur paroi très fine permet les échanges.' }
    ],

    bilan: {
      vb: '0 0 360 230', label: 'Le sang transporte',
      hud: [['o', 'dioxygène'], ['g', 'glucose'], ['r', 'réponse']],
      draw: function (svg) { var e = {}; e.t = trajet(svg); e.t.setAttribute('data-keep', 1); return e; },
      steps: [
        { cap: 'Le dioxygène voyage dans les **globules rouges**.', hud: { o: ['globules rouges'], g: '–', r: '–' } },
        { cap: 'Le glucose voyage dans le **plasma**. Le cœur pousse le sang jusqu\'au muscle.', ar: 'الدم هو الذي ينقل ثنائي الأوكسجين والكليكوز إلى العضلة.', hud: { o: 'globules rouges', g: ['plasma'], r: ['le sang'] } }
      ]
    },

    retenir: [
      'Le sang est formé de <b>plasma</b> et de cellules : <b>globules rouges</b> (transport du dioxygène), <b>globules blancs</b> (défense) et <b>plaquettes</b> (coagulation).',
      'Poussé par le <b>cœur</b> dans les vaisseaux, le sang apporte dioxygène et nutriments aux organes et emporte le dioxyde de carbone et les déchets. Les échanges se font au niveau des <b>capillaires</b>.'
    ],
    retenirAr: 'يتكون الدم من البلازما والكريات الحمراء والكريات البيضاء والصفائح الدموية. يدفعه القلب في الأوعية فيحمل ثنائي الأوكسجين والمغذيات إلى الأعضاء ويأخذ منها ثنائي أوكسيد الكربون والفضلات.',
    voc: [['le plasma', 'البلازما'], ['un globule rouge', 'كرية حمراء'], ['un globule blanc', 'كرية بيضاء'], ['les plaquettes', 'الصفائح الدموية'], ['un capillaire', 'شعيرة دموية'], ['le cœur', 'القلب']]
  });
})();
