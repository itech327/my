/* @meta {"id":"3ac-metaux-acides","level":"3","order":5,"theme":"Les matériaux","title":"Métaux, acides et bases","ar":"الفلزات والمحاليل الحمضية والقاعدية","lead":"Pourquoi déconseille-t-on de garder du vinaigre ou un produit à la soude dans un récipient en aluminium ? On plonge des métaux dans un acide et une base."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  // métal -> [attaqué par l'acide chlorhydrique, attaqué par la soude]
  var REA = { fer: [1, 0], zinc: [1, 1], aluminium: [1, 1], cuivre: [0, 0] };
  var COLM = { fer: '#8c8f96', zinc: '#b9c2c9', aluminium: '#d9dde2', cuivre: '#c8794a' };

  /* tube à essai avec un morceau de métal ; bulles si réaction */
  function tube(svg, x, lab) {
    var g = S('g', { 'data-keep': 1 }, svg);
    var liq = S('path', { d: 'M' + (x - 18) + ' 90 V170 a18 18 0 0 0 36 0 V90 Z', fill: 'rgba(127,178,255,.3)' }, g);
    S('path', { d: 'M' + (x - 20) + ' 40 V170 a20 20 0 0 0 40 0 V40', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 2.5 }, g);
    var met = S('rect', { x: x - 10, y: 166, width: 20, height: 14, rx: 2 }, g), bul = S('g', {}, g);
    var t = T(g, x, 214, lab || '', 'tag'), m = T(g, x, 30, '', 'tag');
    g.set = function (metal, sol) { // sol : 0 acide, 1 base
      while (bul.firstChild) bul.removeChild(bul.firstChild);
      met.setAttribute('fill', COLM[metal]); m.textContent = metal; t.textContent = sol ? 'soude' : 'acide (HCl)';
      liq.setAttribute('fill', sol ? 'rgba(180,140,255,.3)' : 'rgba(255,170,110,.3)');
      if (REA[metal][sol]) for (var i = 0; i < 9; i++) S('circle', { cx: x - 9 + (i * 7) % 18, cy: 100 + (i * 17) % 62, r: 2 + (i % 3), fill: 'none', stroke: '#fff', 'stroke-width': 1.2 }, bul);
      return REA[metal][sol];
    };
    return g;
  }

  MV.lesson({
    id: '3ac-metaux-acides',
    objectif: {
      fr: 'Connaître l\'action de l\'acide chlorhydrique et de la soude sur le fer, le zinc, l\'aluminium et le cuivre, et identifier le dihydrogène formé.',
      ar: 'معرفة تأثير محلول حمض الكلوريدريك ومحلول الصودا على الحديد والزنك والألومنيوم والنحاس، والكشف عن غاز ثنائي الهيدروجين الناتج.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'Un récipient en aluminium',
      hud: [['r', 'récipient'], ['p', 'produit'], ['q', 'pourquoi ?']],
      draw: function (svg) { var e = {}; e.a = tube(svg, 180); return e; },
      steps: [
        { cap: 'Une casserole en **aluminium**.', hud: { r: ['aluminium'], p: '–', q: '–' }, run: function (e) { e.a.set('aluminium', 1); } },
        { cap: 'L\'étiquette d\'un déboucheur à la soude dit : **« ne pas utiliser sur l\'aluminium »**.', hud: { r: 'aluminium', p: ['soude'], q: '–' }, run: function (e) { e.a.set('aluminium', 1); } },
        { cap: '**Pourquoi** ? On le saura à la fin.', hud: { r: 'aluminium', p: 'soude', q: ['?'] }, run: function (e) { e.a.set('aluminium', 1); } }
      ]
    },

    predire: {
      q: "Un déboucheur à la soude porte l'inscription « ne pas utiliser sur l'aluminium ». Pourquoi ?",
      ar: "على مُزيل الانسداد المحتوي على الصودا عبارة «لا يُستعمل على الألومنيوم». لماذا؟",
      o: ["L'aluminium fond à froid", "La soude colle sur le métal et ne part plus", "La soude réagit avec l'aluminium et libère du dihydrogène, un gaz inflammable"],
      a: 2,
      e: "La soude attaque l'aluminium et le zinc, mais pas le fer ni le cuivre. La réaction produit du dihydrogène H₂, qui détone près d'une flamme.",
      ear: "الصودا تتفاعل مع الألومنيوم فتُنتج غاز الهيدروجين [[H₂]] الذي ينفجر قرب اللهب."
    },

    prepare: [
      ['L\'acide chlorhydrique est une solution acide.', true, 'Son pH est inférieur à 7.'],
      ['La soude est une solution acide.', false, 'La solution de soude est basique.'],
      ['Des bulles dans un liquide signalent un gaz.', true, 'Ici, souvent un gaz produit par une réaction.']
    ],

    regarde: {
      vb: '0 0 360 220', label: 'Des métaux dans l\'acide et dans la soude',
      hud: [['t', 'test'], ['o', 'observation'], ['c', 'conclusion']],
      draw: function (svg) { var e = {}; e.a = tube(svg, 70); e.b = tube(svg, 180); e.c = tube(svg, 290); return e; },
      steps: [
        { cap: 'Dans l\'**acide chlorhydrique** : le fer, le zinc et l\'aluminium sont attaqués, des **bulles** se forment.', ar: 'في محلول حمض الكلوريدريك يتفاعل الحديد والزنك والألومنيوم وتتكون فقاعات.', hud: { t: ['acide'], o: ['bulles'], c: 'réaction' }, run: function (e) { e.a.set('fer', 0); e.b.set('zinc', 0); e.c.set('aluminium', 0); } },
        { cap: 'Le gaz détone à l\'approche d\'une flamme : c\'est du **dihydrogène H₂**.', ar: 'يحدث الغاز فرقعة عند تقريب لهب: إنه ثنائي الهيدروجين [[H₂]].', hud: { t: 'flamme', o: ['détonation'], c: ['H₂'] }, run: function (e) { e.a.set('fer', 0); e.b.set('zinc', 0); e.c.set('aluminium', 0); } },
        { cap: 'Le **cuivre** ne réagit pas avec l\'acide chlorhydrique.', ar: 'النحاس لا يتفاعل مع محلول حمض الكلوريدريك.', hud: { t: 'acide', o: ['rien'], c: ['cuivre non attaqué'] }, run: function (e) { e.a.set('fer', 0); e.b.set('cuivre', 0); e.c.set('aluminium', 0); } },
        { cap: 'Exemple : **Fe + 2 H⁺ → Fe²⁺ + H₂**. Le fer devient des ions fer II.', ar: 'مثال: [[Fe + 2 H⁺ → Fe²⁺ + H₂]].', hud: { t: 'équation', o: '–', c: ['Fe²⁺ et H₂'] }, run: function (e) { e.a.set('fer', 0); e.b.set('cuivre', 0); e.c.set('aluminium', 0); } },
        { cap: 'Dans la **soude** : seuls le **zinc** et l\'**aluminium** réagissent. Fer et cuivre, non.', ar: 'في محلول الصودا لا يتفاعل إلا الزنك والألومنيوم.', hud: { t: ['soude'], o: 'bulles sur Zn et Al', c: ['Zn, Al attaqués'] }, run: function (e) { e.a.set('fer', 1); e.b.set('zinc', 1); e.c.set('aluminium', 1); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis un métal et une solution. Teste les huit cas.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 220', role: 'img', 'aria-label': 'Tube à essai' }, st);
          var tb = tube(svg, 180), met = 'fer', sol = 0, vu = {}, set = MV.hud(c, [['m', 'métal'], ['s', 'solution'], ['r', 'réaction ?', 1]]);
          function upd() { var r = tb.set(met, sol); set('m', met); set('s', sol ? 'soude' : 'acide'); set('r', r ? 'oui, H₂' : 'non'); vu[met + sol] = 1; if (Object.keys(vu).length === 8) done(); }
          var r1 = MV.H('div', 'row', '', c); Object.keys(REA).forEach(function (m) { var b = MV.H('button', 'btn', m, r1); b.onclick = function () { met = m; upd(); }; });
          var r2 = MV.H('div', 'row', '', c); [['Acide', 0], ['Soude', 1]].forEach(function (x) { var b = MV.H('button', 'btn', x[0], r2); b.onclick = function () { sol = x[1]; upd(); }; });
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'On plonge du zinc dans l\'acide chlorhydrique.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. On observe :', o: ['des bulles', 'aucun changement'], a: 0 },
            { type: 'opt', q: 'Étape 2. Le gaz est :', o: ['le dihydrogène', 'le dioxygène'], a: 0 },
            { type: 'opt', q: 'Étape 3. L\'ion formé est :', o: ['Zn²⁺', 'Cl⁻'], a: 0, e: 'Zn + 2 H⁺ → Zn²⁺ + H₂.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Quel métal ne réagit pas avec l\'acide chlorhydrique ?', o: ['le cuivre', 'le fer', 'le zinc'], a: 0 },
      { lvl: 'Niveau 2', q: 'Quels métaux réagissent avec la soude ?', o: ['zinc et aluminium', 'fer et cuivre'], a: 0 },
      { lvl: 'Niveau 3', q: 'Le gaz qui détone près d\'une flamme est :', o: ['H₂', 'CO₂'], a: 0 },
      { lvl: 'Niveau 4', q: 'Fe + 2 H⁺ → Fe²⁺ + H₂ : combien d\'ions H⁺ pour 1 atome de fer ?', a: 2 }
    ],

    bilan: {
      vb: '0 0 360 220', label: 'L\'aluminium et la soude',
      hud: [['m', 'métal'], ['s', 'solution'], ['r', 'réponse']],
      draw: function (svg) { var e = {}; e.a = tube(svg, 180); return e; },
      steps: [
        { cap: 'L\'aluminium est **attaqué** par la soude : il se forme du H₂.', hud: { m: ['aluminium'], s: ['soude'], r: '–' }, run: function (e) { e.a.set('aluminium', 1); } },
        { cap: 'La soude **abîme** la casserole. L\'acide aussi : on évite d\'y garder du vinaigre.', ar: 'الصودا والأحماض تتفاعل مع الألومنيوم فتتلف الأواني.', hud: { m: 'aluminium', s: 'soude ou acide', r: ['récipient abîmé'] }, run: function (e) { e.a.set('aluminium', 0); } }
      ]
    },

    retenir: [
      'L\'<b>acide chlorhydrique</b> réagit avec le fer, le zinc et l\'aluminium, mais pas avec le cuivre. La <b>soude</b> réagit avec le zinc et l\'aluminium seulement.',
      'Ces réactions produisent du <b>dihydrogène H₂</b>, qui détone près d\'une flamme. Exemple : <b class="mono">Fe + 2 H⁺ → Fe²⁺ + H₂</b>.'
    ],
    retenirAr: 'محلول حمض الكلوريدريك يتفاعل مع الحديد والزنك والألومنيوم ولا يتفاعل مع النحاس. محلول الصودا يتفاعل مع الزنك والألومنيوم فقط. ينتج عن هذه التفاعلات غاز ثنائي الهيدروجين.',
    voc: [['l\'acide chlorhydrique', 'حمض الكلوريدريك'], ['la soude', 'الصودا'], ['le dihydrogène', 'ثنائي الهيدروجين'], ['un ion', 'أيون'], ['attaquer', 'يتفاعل مع']]
  });
})();
