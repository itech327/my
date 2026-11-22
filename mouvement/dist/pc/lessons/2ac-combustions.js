/* @meta {"id":"2ac-combustions","level":"2","order":3,"theme":"Matière et environnement","title":"Les combustions","ar":"الاحتراقات","lead":"Le chauffe-eau à butane d'une salle de bain fermée peut être dangereux : on suit les atomes pour comprendre la combustion."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var COL = { C: '#3a3a3a', O: '#e5484d', H: '#f2f2f2' };

  function atome(g, x, y, el, r) { S('circle', { cx: x, cy: y, r: r || 10, fill: COL[el], stroke: '#141517', 'stroke-width': 1.2 }, g); }
  /* flamme : couleur selon l'apport d'air (0 à 1) */
  function flamme(svg, x, y) {
    var g = S('g', { 'data-keep': 1 }, svg);
    var f = S('path', { d: 'M' + x + ' ' + y + ' q-22 -30 0 -70 q22 40 0 70', fill: '#4c7bf2' }, g);
    var s = S('g', {}, g); for (var i = 0; i < 8; i++) S('circle', { cx: x - 12 + (i * 7 % 24), cy: y - 80 - (i * 11 % 30), r: 3, fill: '#2a2a2a' }, s);
    S('rect', { x: x - 20, y: y, width: 40, height: 40, rx: 6, fill: '#e5484d' }, g); T(g, x, y + 25, 'butane', 'tag').style.fill = '#fff';
    g.air = function (a) { f.setAttribute('fill', a > 0.6 ? '#4c7bf2' : a > 0.3 ? '#f2a23c' : '#f2c14e'); s.style.opacity = a > 0.6 ? 0 : 1 - a; };
    return g;
  }

  MV.lesson({
    id: '2ac-combustions',
    objectif: {
      fr: 'Identifier les réactifs et les produits d\'une combustion, et connaître le danger d\'une combustion incomplète.',
      ar: 'تحديد المتفاعلات والنواتج في احتراق، ومعرفة خطر الاحتراق غير الكامل.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'Un chauffe-eau dans une salle de bain',
      hud: [['l', 'lieu'], ['a', 'air'], ['q', 'danger ?']],
      draw: function (svg) {
        var e = {};
        S('rect', { x: 40, y: 20, width: 280, height: 180, fill: 'none', stroke: '#5b6068', 'stroke-width': 3 }, svg);
        e.fen = S('rect', { x: 250, y: 40, width: 50, height: 40, fill: '#1d3a52', stroke: '#9aa0a8', 'stroke-width': 2 }, svg);
        e.fl = flamme(svg, 110, 150);
        e.q = T(svg, 220, 140, 'danger ?', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'Un **chauffe-eau à butane** chauffe l\'eau de la douche.', on: ['fen'], hud: { l: ['salle de bain'], a: 'aérée', q: '–' }, run: function (e) { e.fl.air(1); } },
        { cap: 'On ferme la fenêtre en hiver : l\'air se **renouvelle mal**.', hud: { l: 'salle de bain', a: ['fermée'], q: '–' }, run: function (e) { e.fl.air(0.2); } },
        { cap: 'Pourquoi est-ce **dangereux** ? On le saura à la fin.', on: ['q'], hud: { l: 'salle de bain', a: 'fermée', q: ['?'] }, run: function (e) { e.fl.air(0.2); } }
      ]
    },

    predire: {
      q: "Un chauffe-eau à butane fonctionne fenêtre fermée en hiver. Pourquoi est-ce dangereux ?",
      ar: "سخّان غاز بوتان يشتغل والنافذة مغلقة في الشتاء. لماذا هذا خطير؟",
      o: ["Le butane devient plus explosif quand l'air est froid", "Faute de dioxygène, la combustion est incomplète et produit un gaz toxique", "Le chauffe-eau chauffe trop et brûle les mains"],
      a: 1,
      e: "Sans assez d'air, la combustion est incomplète : elle forme du monoxyde de carbone (CO), un gaz toxique, incolore et sans odeur. C'est pourquoi il faut toujours aérer la pièce.",
      ear: "عند نقص الهواء يكون الاحتراق غير تام فيتكوّن أحادي أكسيد الكربون [[CO]] السام عديم اللون والرائحة. لذلك يجب تهوية الغرفة."
    },

    prepare: [
      ['Un feu a besoin d\'air pour brûler.', true, 'Il consomme le dioxygène de l\'air.'],
      ['Le dioxyde de carbone trouble l\'eau de chaux.', true, 'C\'est son test d\'identification.'],
      ['Pendant une combustion, la matière disparaît.', false, 'Les atomes ne disparaissent pas : ils se réarrangent en de nouveaux corps.']
    ],

    regarde: {
      vb: '0 0 360 230', label: 'Combustion du carbone',
      hud: [['r', 'réactifs'], ['p', 'produits'], ['t', 'test']],
      draw: function (svg) {
        var e = {};
        e.react = S('g', {}, svg); atome(e.react, 70, 110, 'C', 14); atome(e.react, 140, 110, 'O'); atome(e.react, 160, 110, 'O');
        T(e.react, 70, 145, 'carbone', 'tag'); T(e.react, 150, 145, 'dioxygène', 'tag');
        e.fleche = T(svg, 205, 116, '→', 'lbl big acc');
        e.prod = S('g', {}, svg); atome(e.prod, 270, 110, 'C', 14); atome(e.prod, 246, 110, 'O'); atome(e.prod, 294, 110, 'O');
        T(e.prod, 270, 145, 'dioxyde de carbone', 'tag');
        e.chaux = S('g', {}, svg); S('rect', { x: 240, y: 160, width: 60, height: 50, rx: 6, fill: '#e9e9ea', opacity: .8 }, e.chaux); T(e.chaux, 270, 225, 'eau de chaux troublée', 'tag');
        e.bu = S('g', {}, svg);
        T(e.bu, 180, 50, 'butane + dioxygène', 'lbl'); T(e.bu, 180, 74, '→ dioxyde de carbone + eau', 'lbl');
        e.inc = S('g', {}, svg);
        T(e.inc, 180, 178, 'manque d\'air :', 'tag').style.fill = '#ff5c5c'; T(e.inc, 180, 196, 'monoxyde de carbone (CO) + carbone (suie)', 'tag').style.fill = '#ff5c5c';
        return e;
      },
      steps: [
        { cap: 'Le charbon brûle : le **carbone** réagit avec le **dioxygène** de l\'air.', ar: 'يحترق الفحم: يتفاعل الكربون مع ثنائي الأوكسجين.', on: ['react'], hud: { r: ['carbone + dioxygène'], p: '–', t: '–' } },
        { cap: 'Les atomes se **réarrangent** : il se forme du dioxyde de carbone.', ar: 'تترتب الذرات من جديد فيتكون ثنائي أوكسيد الكربون.', on: ['react', 'fleche', 'prod'], hud: { r: 'C + O₂', p: ['CO₂'], t: '–' } },
        { cap: 'Les corps qui disparaissent sont les **réactifs**, ceux qui apparaissent les **produits**.', ar: 'الأجسام التي تختفي هي المتفاعلات، والتي تظهر هي النواتج.', on: ['react', 'fleche', 'prod'], hud: { r: ['réactifs'], p: ['produits'], t: '–' } },
        { cap: 'Le produit trouble l\'**eau de chaux** : c\'est bien du dioxyde de carbone.', ar: 'الناتج يعكر ماء الجير: إنه ثنائي أوكسيد الكربون.', on: ['react', 'fleche', 'prod', 'chaux'], hud: { r: 'C + O₂', p: 'CO₂', t: ['eau de chaux'] } },
        { cap: 'Le butane brûle en donnant du **dioxyde de carbone** et de l\'**eau**.', ar: 'يحترق البوتان فينتج ثنائي أوكسيد الكربون والماء.', on: ['bu'], hud: { r: ['butane + O₂'], p: ['CO₂ + eau'], t: 'buée, eau de chaux' } },
        { cap: 'Sans assez d\'air, la combustion est **incomplète** : du monoxyde de carbone, toxique et sans odeur.', ar: 'عند نقص الهواء يكون الاحتراق غير كامل وينتج أحادي أوكسيد الكربون السام وعديم الرائحة.', on: ['bu', 'inc'], hud: { r: 'butane + peu d\'O₂', p: ['CO + suie'], t: ['danger'] } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Règle l\'arrivée d\'air du brûleur. Observe la flamme et les produits.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 200', role: 'img', 'aria-label': 'Flamme de butane' }, st);
          var f = flamme(svg, 180, 150), set = MV.hud(c, [['f', 'flamme', 1], ['p', 'produits', 1], ['d', 'danger', 1]]), low = false, high = false;
          MV.slider(c, { label: 'air', min: 0, max: 10, value: 10, fmt: function (v) { return v * 10 + ' %'; } }, function (v) {
            var a = v / 10; f.air(a); set('f', a > 0.6 ? 'bleue' : 'jaune'); set('p', a > 0.6 ? 'CO₂ + eau' : 'CO + suie + CO₂ + eau'); set('d', a > 0.6 ? 'faible' : 'élevé');
            if (a > 0.6) high = true; else low = true; if (low && high) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Essaie peu d\'air puis beaucoup d\'air.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'On brûle du soufre dans un flacon de dioxygène. Il se forme du dioxyde de soufre.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Les réactifs sont :', o: ['soufre et dioxygène', 'dioxyde de soufre', 'soufre seul'], a: 0 },
            { type: 'opt', q: 'Étape 2. Le produit est :', o: ['le dioxygène', 'le dioxyde de soufre'], a: 1 },
            { type: 'opt', q: 'Étape 3. Le bilan s\'écrit :', o: ['soufre + dioxygène → dioxyde de soufre', 'dioxyde de soufre → soufre + dioxygène'], a: 0, e: 'Réactifs à gauche de la flèche, produits à droite.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'La combustion du carbone produit :', o: ['du dioxygène', 'du dioxyde de carbone', 'de l\'azote'], a: 1 },
      { lvl: 'Niveau 2', q: 'Dans « carbone + dioxygène → dioxyde de carbone », les réactifs sont :', o: ['carbone et dioxygène', 'dioxyde de carbone'], a: 0 },
      { lvl: 'Niveau 3', q: 'Une flamme jaune qui noircit la casserole indique :', o: ['une combustion complète', 'une combustion incomplète'], a: 1, e: 'La suie est du carbone non brûlé.' },
      { lvl: 'Niveau 4', q: 'Pour éviter l\'intoxication au monoxyde de carbone, il faut :', o: ['fermer les fenêtres', 'aérer et installer le chauffe-eau hors de la salle de bain', 'augmenter la flamme'], a: 1 }
    ],

    bilan: {
      vb: '0 0 360 220', label: 'Le danger expliqué',
      hud: [['a', 'air'], ['p', 'produit'], ['r', 'réponse']],
      draw: function (svg) { var e = {}; e.fl = flamme(svg, 110, 150); e.co = T(svg, 240, 100, 'CO', 'lbl big'); e.co.style.fill = '#ff5c5c'; return e; },
      steps: [
        { cap: 'Pièce fermée : peu de dioxygène, combustion **incomplète**.', hud: { a: ['peu'], p: '–', r: '–' }, run: function (e) { e.fl.air(0.2); } },
        { cap: 'Il se forme du **monoxyde de carbone** : invisible, sans odeur, mortel. Il faut aérer.', ar: 'يتكون أحادي أوكسيد الكربون: غاز سام لا لون له ولا رائحة. يجب التهوية.', on: ['co'], hud: { a: 'peu', p: ['CO'], r: ['aérer'] }, run: function (e) { e.fl.air(0.2); } }
      ]
    },

    retenir: [
      'Une <b>combustion</b> est une réaction chimique : des <b>réactifs</b> (le combustible et le dioxygène) disparaissent et des <b>produits</b> apparaissent. Carbone + dioxygène → dioxyde de carbone ; butane + dioxygène → dioxyde de carbone + eau.',
      'Sans assez d\'air, la combustion est <b>incomplète</b> et produit du <b>monoxyde de carbone</b>, gaz toxique. Il faut toujours aérer.'
    ],
    retenirAr: 'الاحتراق تفاعل كيميائي تختفي فيه المتفاعلات وتظهر النواتج. احتراق البوتان ينتج ثنائي أوكسيد الكربون والماء. عند نقص الهواء يكون الاحتراق غير كامل وينتج أحادي أوكسيد الكربون السام، لذلك يجب التهوية.',
    voc: [['une combustion', 'احتراق'], ['un réactif', 'متفاعل'], ['un produit', 'ناتج'], ['le monoxyde de carbone', 'أحادي أوكسيد الكربون'], ['aérer', 'يهوي']]
  });
})();
