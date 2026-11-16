/* @meta {"id":"1ac-circuit-simple","level":"1","order":9,"theme":"Électricité","title":"Le circuit électrique simple","ar":"الدارة الكهربائية البسيطة","lead":"Une pile, une lampe, deux fils… et la lampe reste éteinte. Pour qu'elle brille, le courant doit pouvoir faire le tour complet."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var MAT = { 'clou en fer': 1, 'règle en plastique': 0, 'pièce de monnaie': 1, 'gomme': 0 };

  /* schéma normalisé : pile à gauche, lampe à droite, interrupteur en haut, un trou en bas pour tester un objet */
  function circuit(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('path', { d: 'M60 60 H150 M210 60 H300 V95 M300 135 V170 H215 M145 170 H60 V125 M60 95 V60', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 3 }, g);
    S('line', { x1: 44, y1: 95, x2: 76, y2: 95, stroke: '#e9e9ea', 'stroke-width': 3 }, g); S('line', { x1: 52, y1: 107, x2: 68, y2: 107, stroke: '#e9e9ea', 'stroke-width': 6 }, g);
    S('path', { d: 'M60 107 V125', stroke: '#e9e9ea', 'stroke-width': 3 }, g); T(g, 30, 104, 'pile', 'tag', 'end'); T(g, 82, 92, '+', 'tag', 'start');
    var lampe = S('circle', { cx: 300, cy: 115, r: 20, fill: '#1d1f23', stroke: '#e9e9ea', 'stroke-width': 3 }, g);
    S('path', { d: 'M286 101 L314 129 M314 101 L286 129', stroke: '#e9e9ea', 'stroke-width': 2.5 }, g); T(g, 308, 158, 'lampe', 'tag', 'start');
    var inter = S('line', { x1: 150, y1: 60, stroke: '#e9e9ea', 'stroke-width': 3 }, g); S('circle', { cx: 150, cy: 60, r: 3.5, fill: '#e9e9ea' }, g); S('circle', { cx: 210, cy: 60, r: 3.5, fill: '#e9e9ea' }, g); T(g, 180, 36, 'interrupteur', 'tag');
    var obj = S('rect', { x: 145, y: 163, width: 70, height: 14, rx: 4 }, g), to = T(g, 180, 198, '', 'tag');
    var flux = S('path', { d: 'M90 50 H140 M220 50 H290', stroke: '#f2c14e', 'stroke-width': 2, 'stroke-dasharray': '4 8', fill: 'none' }, g);
    g.set = function (ferme, mat) { // mat : objet dans le trou (null = fil)
      inter.setAttribute('x2', ferme ? 210 : 200); inter.setAttribute('y2', ferme ? 60 : 36);
      var cond = mat == null ? 1 : MAT[mat];
      obj.setAttribute('fill', mat == null ? '#e9e9ea' : cond ? '#9aa0a8' : '#d4a373'); obj.setAttribute('height', mat == null ? 3 : 14); obj.setAttribute('y', mat == null ? 168.5 : 163);
      to.textContent = mat || '';
      var on = ferme && cond; lampe.setAttribute('fill', on ? '#f2c14e' : '#1d1f23'); lampe.style.filter = on ? 'drop-shadow(0 0 10px #f2c14e)' : 'none'; flux.style.opacity = on ? 1 : 0;
      return on;
    };
    return g;
  }

  MV.lesson({
    id: '1ac-circuit-simple',
    objectif: {
      fr: 'Réaliser un circuit électrique simple fermé, le schématiser avec les symboles normalisés, et distinguer conducteurs et isolants.',
      ar: 'إنجاز دارة كهربائية بسيطة مغلقة وتمثيلها بالرموز الاصطلاحية، والتمييز بين الموصلات والعوازل.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'La lampe ne s\'allume pas',
      hud: [['m', 'matériel'], ['l', 'lampe'], ['q', 'pourquoi ?']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'Une **pile**, une **lampe**, des **fils** et un **interrupteur**.', hud: { m: ['pile, lampe, fils'], l: '–', q: '–' }, run: function (e) { e.c.set(0, null); } },
        { cap: 'On a tout branché… mais la lampe reste **éteinte**.', hud: { m: 'pile, lampe, fils', l: ['éteinte'], q: '–' }, run: function (e) { e.c.set(0, null); } },
        { cap: 'Que manque-t-il ? On le saura à la fin.', hud: { m: 'pile, lampe, fils', l: 'éteinte', q: ['?'] }, run: function (e) { e.c.set(0, null); } }
      ]
    },

    prepare: [
      ['Une pile a deux bornes : + et −.', true, 'Le courant sort par la borne + et revient par la borne −.'],
      ['Le plastique laisse passer le courant.', false, 'C\'est un isolant.'],
      ['Un interrupteur ouvert empêche la lampe de briller.', true, 'Le circuit est alors coupé.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Le circuit fermé',
      hud: [['e', 'état'], ['c', 'courant'], ['l', 'lampe']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'Chaque élément est représenté par un **symbole normalisé** : c\'est le **schéma** du circuit.', ar: 'نمثل كل عنصر برمز اصطلاحي: هذه هي تبيانة الدارة.', hud: { e: ['schéma'], c: '–', l: '–' }, run: function (e) { e.c.set(0, null); } },
        { cap: 'Interrupteur **ouvert** : le circuit est **ouvert**, le courant ne passe pas.', ar: 'قاطع التيار مفتوح: الدارة مفتوحة ولا يمر التيار.', hud: { e: ['ouvert'], c: ['ne passe pas'], l: 'éteinte' }, run: function (e) { e.c.set(0, null); } },
        { cap: 'Interrupteur **fermé** : une boucle complète, le circuit est **fermé**. La lampe brille.', ar: 'قاطع التيار مغلق: حلقة كاملة، الدارة مغلقة والمصباح يضيء.', hud: { e: ['fermé'], c: ['passe'], l: ['allumée'] }, run: function (e) { e.c.set(1, null); } },
        { cap: 'Un clou en fer dans le circuit : la lampe brille. Le fer est un **conducteur**.', ar: 'المسمار الحديدي يسمح بمرور التيار: الحديد موصل.', hud: { e: 'fermé', c: 'passe', l: ['allumée : conducteur'] }, run: function (e) { e.c.set(1, 'clou en fer'); } },
        { cap: 'Une règle en plastique : la lampe s\'éteint. Le plastique est un **isolant**.', ar: 'المسطرة البلاستيكية لا تسمح بمرور التيار: البلاستيك عازل.', hud: { e: 'fermé', c: ['bloqué'], l: ['éteinte : isolant'] }, run: function (e) { e.c.set(1, 'règle en plastique'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Ferme l\'interrupteur puis teste chaque objet. Lesquels sont conducteurs ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Circuit à tester' }, st);
          var ci = circuit(svg), fe = 0, mat = 'clou en fer', vu = {}, set = MV.hud(c, [['i', 'interrupteur'], ['o', 'objet'], ['r', 'résultat', 1]]);
          function upd() { var on = ci.set(fe, mat); set('i', fe ? 'fermé' : 'ouvert'); set('o', mat); set('r', on ? 'conducteur' : fe ? 'isolant' : 'circuit ouvert'); if (fe) vu[mat] = 1; if (Object.keys(vu).length === 4) done(); }
          var r1 = MV.H('div', 'row', '', c), bi = MV.H('button', 'btn', 'Ouvrir / fermer l\'interrupteur', r1); bi.onclick = function () { fe = 1 - fe; upd(); };
          var r2 = MV.H('div', 'row', '', c); Object.keys(MAT).forEach(function (k) { var b = MV.H('button', 'btn', k, r2); b.onclick = function () { mat = k; upd(); }; });
          upd();
          MV.H('p', 'small', 'Teste les quatre objets, interrupteur fermé.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Une lampe ne brille pas dans un circuit fermé.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. On vérifie d\'abord que la boucle est :', o: ['complète, sans coupure', 'ouverte'], a: 0 },
            { type: 'opt', q: 'Étape 2. Un bouchon en liège dans le circuit est :', o: ['un isolant', 'un conducteur'], a: 0 },
            { type: 'opt', q: 'Étape 3. Relier directement les deux bornes de la pile par un fil, c\'est :', o: ['un court-circuit, dangereux', 'sans effet'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Pour que la lampe brille, le circuit doit être :', o: ['fermé', 'ouvert'], a: 0 },
      { lvl: 'Niveau 2', q: 'Le cuivre des fils est :', o: ['un conducteur', 'un isolant'], a: 0 },
      { lvl: 'Niveau 3', q: 'Le verre est :', o: ['un isolant', 'un conducteur'], a: 0 },
      { lvl: 'Niveau 4', q: 'Combien de bornes possède une lampe ?', a: 2 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Ce qui manquait',
      hud: [['p', 'problème'], ['s', 'solution'], ['l', 'lampe']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'L\'interrupteur était **ouvert** : la boucle était coupée.', hud: { p: ['circuit ouvert'], s: '–', l: 'éteinte' }, run: function (e) { e.c.set(0, null); } },
        { cap: 'On le **ferme** : la boucle est complète, le courant passe, la lampe brille.', ar: 'كانت الدارة مفتوحة؛ عند إغلاقها تصبح الحلقة كاملة فيمر التيار ويضيء المصباح.', hud: { p: 'circuit ouvert', s: ['fermer'], l: ['allumée'] }, run: function (e) { e.c.set(1, null); } }
      ]
    },

    retenir: [
      'Un <b>circuit simple</b> est une boucle : pile, fils, lampe, interrupteur. La lampe brille seulement si le circuit est <b>fermé</b>. On le représente par un <b>schéma</b> avec des symboles normalisés.',
      'Les métaux sont <b>conducteurs</b> ; le plastique, le verre, le bois sec sont <b>isolants</b>. Ne jamais relier directement les bornes d\'une pile : <b>court-circuit</b>.'
    ],
    retenirAr: 'الدارة البسيطة حلقة تضم عمودا وأسلاكا ومصباحا وقاطعا للتيار، ولا يضيء المصباح إلا إذا كانت الدارة مغلقة. الفلزات موصلة، والبلاستيك والزجاج والخشب الجاف عوازل.',
    voc: [['un circuit fermé', 'دارة مغلقة'], ['un interrupteur', 'قاطع التيار'], ['un conducteur', 'موصل'], ['un isolant', 'عازل'], ['un court-circuit', 'دارة قصيرة']]
  });
})();
