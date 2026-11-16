/* @meta {"id":"3ac-reactions-air","level":"3","order":3,"theme":"Les matériaux","title":"Réactions de quelques matériaux avec l'air","ar":"تفاعل بعض المواد مع الهواء","lead":"Les balcons en fer d'une ville au bord de la mer rouillent vite, les fenêtres en aluminium non : l'air n'attaque pas tous les métaux de la même façon."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* trois tubes avec un clou : air sec / eau sans air / eau + air */
  function tubes(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), clous = [];
    [['air sec', false, false], ['eau bouillie + huile', true, false], ['eau + air', true, true]].forEach(function (t, i) {
      var x = 60 + i * 120;
      S('rect', { x: x - 22, y: 40, width: 44, height: 150, rx: 18, fill: 'none', stroke: '#cfd3d8', 'stroke-width': 2.5 }, g);
      if (t[1]) S('rect', { x: x - 20, y: 100, width: 40, height: 88, rx: 16, fill: 'rgba(76,155,242,.35)' }, g);
      if (i === 1) S('rect', { x: x - 20, y: 92, width: 40, height: 10, fill: '#e9c46a' }, g);
      if (i === 0) for (var k = 0; k < 4; k++) S('circle', { cx: x - 10 + k * 7, cy: 178, r: 3, fill: '#e9e9ea' }, g);
      var c = S('rect', { x: x - 3, y: 70, width: 6, height: 100, fill: '#9aa0a8' }, g); c.style.transition = 'fill 1.5s'; clous.push(c);
      T(g, x, 214, t[0], 'tag');
    });
    g.set = function (r) { clous.forEach(function (c, i) { c.setAttribute('fill', r && i === 2 ? '#a0522d' : '#9aa0a8'); }); };
    return g;
  }

  MV.lesson({
    id: '3ac-reactions-air',
    objectif: {
      fr: 'Expliquer la corrosion du fer par l\'air humide, comparer avec l\'aluminium et le cuivre, et connaître des moyens de protection.',
      ar: 'تفسير تأكسد الحديد في الهواء الرطب، ومقارنته بالألومنيوم والنحاس، ومعرفة طرق الحماية.'
    },

    ouverture: {
      vb: '0 0 360 230', label: 'Balcon en fer et fenêtre en aluminium',
      hud: [['f', 'fer'], ['a', 'aluminium'], ['q', 'pourquoi ?']],
      draw: function (svg) {
        var e = {};
        S('rect', { x: 30, y: 40, width: 300, height: 170, fill: '#2b2e33' }, svg);
        e.balc = S('g', {}, svg); for (var i = 0; i < 8; i++) S('rect', { x: 50 + i * 16, y: 120, width: 5, height: 70, fill: '#9aa0a8' }, e.balc);
        S('rect', { x: 45, y: 115, width: 130, height: 6, fill: '#9aa0a8' }, e.balc);
        e.rouille = S('g', {}, svg); for (i = 0; i < 8; i++) S('rect', { x: 50 + i * 16, y: 150 + (i % 3) * 8, width: 5, height: 18, fill: '#a0522d' }, e.rouille);
        e.fen = S('rect', { x: 220, y: 70, width: 80, height: 90, fill: 'none', stroke: '#d8dce2', 'stroke-width': 6 }, svg);
        e.fen.setAttribute('data-keep', 1);
        return e;
      },
      steps: [
        { cap: 'Dans une ville au bord de la mer, un **balcon en fer** et une **fenêtre en aluminium**.', on: ['balc'], hud: { f: 'neuf', a: 'neuve', q: '–' } },
        { cap: 'Quelques années plus tard : le fer est **rouillé**, l\'aluminium semble intact.', on: ['balc', 'rouille'], hud: { f: ['rouillé'], a: ['intacte'], q: '–' } },
        { cap: 'Pourquoi cette **différence** ? On le saura à la fin.', on: ['balc', 'rouille'], hud: { f: 'rouillé', a: 'intacte', q: ['?'] } }
      ]
    },

    prepare: [
      ['L\'air contient du dioxygène et de la vapeur d\'eau.', true, 'Ce sont les deux acteurs de la rouille.'],
      ['La rouille protège le fer.', false, 'La rouille est poreuse : elle laisse l\'air atteindre le fer en dessous.'],
      ['Le fer, l\'aluminium et le cuivre sont des métaux.', true, 'Ils réagissent différemment avec l\'air.']
    ],

    regarde: {
      vb: '0 0 360 230', label: 'L\'expérience des trois tubes',
      hud: [['c', 'conditions'], ['r', 'résultat'], ['e', 'équation']],
      draw: function (svg) {
        var e = {}; e.t = tubes(svg);
        e.eqs = S('g', {}, svg); S('rect', { x: 10, y: 10, width: 340, height: 34, rx: 8, fill: '#17181a', stroke: 'var(--acc)' }, e.eqs);
        e.eq = T(e.eqs, 180, 32, '', 'lbl');
        return e;
      },
      steps: [
        { cap: 'Trois clous en fer : dans l\'air **sec**, dans de l\'eau **sans air**, dans l\'eau **avec air**.', ar: 'ثلاثة مسامير: في هواء جاف، في ماء بدون هواء، في ماء مع هواء.', hud: { c: '3 tubes', r: '–', e: '–' }, run: function (e) { e.t.set(false); } },
        { cap: 'Une semaine plus tard : **seul** le clou dans l\'eau avec de l\'air a rouillé.', ar: 'بعد أسبوع: صدئ فقط المسمار الموجود في الماء مع الهواء.', hud: { c: 'eau + air', r: ['rouille'], e: '–' }, run: function (e) { e.t.set(true); } },
        { cap: 'La rouille se forme avec **le dioxygène et l\'eau**. Le sel de la mer l\'accélère.', ar: 'يتكون الصدأ بوجود ثنائي الأوكسجين والماء، والملح يسرعه.', hud: { c: ['O₂ + eau'], r: 'rouille', e: '–' }, run: function (e) { e.t.set(true); } },
        { cap: 'La rouille est **poreuse** : le fer continue à rouiller en profondeur.', ar: 'الصدأ مسامي فيستمر تآكل الحديد في العمق.', on: ['eqs'], hud: { c: 'O₂ + eau', r: ['poreuse'], e: '–' }, run: function (e) { e.t.set(true); e.eq.textContent = '4 Fe + 3 O₂ → 2 Fe₂O₃ (rouille, simplifiée)'; } },
        { cap: 'L\'aluminium se couvre d\'une fine couche d\'**alumine** imperméable qui le protège.', ar: 'يتغطى الألومنيوم بطبقة رقيقة من الألومين غير منفذة تحميه.', on: ['eqs'], hud: { c: 'aluminium', r: ['couche protectrice'], e: ['4 Al + 3 O₂ → 2 Al₂O₃'] }, run: function (e) { e.t.set(true); e.eq.textContent = '4 Al + 3 O₂ → 2 Al₂O₃ (alumine)'; } },
        { cap: 'Le cuivre noircit en surface (oxyde de cuivre), puis verdit avec le temps.', ar: 'يسود سطح النحاس بأوكسيد النحاس ثم يخضر مع الزمن.', on: ['eqs'], hud: { c: 'cuivre', r: ['couche en surface'], e: ['2 Cu + O₂ → 2 CuO'] }, run: function (e) { e.t.set(true); e.eq.textContent = '2 Cu + O₂ → 2 CuO'; } }
      ]
    },

    faisons: [
      { title: 'Le laboratoire de la rouille', intro: 'Choisis les conditions et fais passer les jours.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 120', role: 'img', 'aria-label': 'Clou en fer' }, st);
          var clou = S('rect', { x: 60, y: 50, width: 240, height: 20, rx: 4, fill: '#9aa0a8' }, svg);
          var cond = { air: true, eau: false, sel: false, peint: false }, j = 0, set = MV.hud(c, [['c', 'conditions'], ['r', 'rouille', 1]]), row = MV.H('div', 'row', '', c), seen = false;
          function upd() {
            var v = cond.peint ? 0 : (cond.air && cond.eau ? 1 : 0) * (cond.sel ? 2 : 1) * j / 30;
            clou.setAttribute('fill', v > 0.66 ? '#8b3a1a' : v > 0.2 ? '#a0522d' : '#9aa0a8');
            set('c', Object.keys(cond).filter(function (k) { return cond[k]; }).join(', ') || 'aucune'); set('r', v > 0.66 ? 'forte' : v > 0.2 ? 'visible' : 'aucune');
            if (v > 0.66) seen = true; if (seen && cond.peint) done();
          }
          ['air', 'eau', 'sel', 'peint'].forEach(function (k) { var b = MV.H('button', 'btn', k === 'peint' ? 'peinture' : k, row); b.onclick = function () { cond[k] = !cond[k]; b.classList.toggle('pri', cond[k]); upd(); }; if (cond[k]) b.classList.add('pri'); });
          MV.slider(c, { label: 'jours', min: 0, max: 30, value: 0 }, function (v) { j = v; upd(); });
          MV.H('p', 'small', 'Obtiens une forte rouille, puis protège le clou avec la peinture.', c);
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'Pourquoi peint-on les bateaux de pêche et les grilles en fer ?',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. La rouille a besoin de :', o: ['dioxygène et eau', 'lumière seulement'], a: 0 },
            { type: 'opt', q: 'Étape 2. La peinture :', o: ['empêche l\'air et l\'eau d\'atteindre le fer', 'ajoute du dioxygène'], a: 0 },
            { type: 'opt', q: 'Étape 3. Un autre moyen de protéger le fer :', o: ['le couvrir d\'une couche de zinc (galvanisation)', 'le laisser au bord de la mer'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le fer rouille en présence de :', o: ['dioxygène et eau', 'diazote seul'], a: 0 },
      { lvl: 'Niveau 2', q: 'Pourquoi l\'aluminium ne se détruit-il pas comme le fer ?', o: ['Sa couche d\'alumine est imperméable et le protège.', 'Il ne réagit jamais avec l\'air.'], a: 0 },
      { lvl: 'Niveau 3', q: 'Dans 2 Fe₂O₃, combien d\'atomes d\'oxygène ?', a: 6 },
      { lvl: 'Niveau 4', q: 'Équilibre : 2 Cu + O₂ → … CuO. Quel nombre devant CuO ?', a: 2 }
    ],

    bilan: {
      vb: '0 0 360 230', label: 'Fer et aluminium',
      hud: [['f', 'fer'], ['a', 'aluminium'], ['r', 'réponse']],
      draw: function (svg) {
        var e = {};
        S('rect', { x: 40, y: 80, width: 120, height: 60, fill: '#9aa0a8' }, svg); e.rf = S('g', {}, svg); for (var i = 0; i < 9; i++) S('rect', { x: 40 + i * 13, y: 70 + (i % 3) * 4, width: 11, height: 26, fill: '#a0522d' }, e.rf);
        T(svg, 100, 170, 'fer : rouille poreuse', 'tag');
        S('rect', { x: 200, y: 80, width: 120, height: 60, fill: '#d8dce2' }, svg); e.al = S('rect', { x: 200, y: 76, width: 120, height: 5, fill: 'var(--acc)' }, svg);
        T(svg, 260, 170, 'aluminium : couche fine et étanche', 'tag');
        return e;
      },
      steps: [
        { cap: 'Le fer : sa rouille est **poreuse**, l\'air humide et salé continue de l\'attaquer.', on: ['rf'], hud: { f: ['rouille'], a: '–', r: '–' } },
        { cap: 'L\'aluminium : sa couche d\'**alumine** est étanche et le protège.', ar: 'طبقة الألومين تحمي الألومنيوم، أما صدأ الحديد فمسامي.', on: ['rf', 'al'], hud: { f: 'rouille', a: ['alumine'], r: ['couche protectrice'] } }
      ]
    },

    retenir: [
      'Le <b>fer</b> rouille en présence de <b>dioxygène et d\'eau</b> ; le sel accélère la corrosion. La rouille est poreuse : la corrosion continue en profondeur.',
      'L\'<b>aluminium</b> se couvre d\'une couche d\'<b>alumine</b> qui le protège ; le <b>cuivre</b> se couvre d\'oxyde. On protège le fer par la peinture, la graisse ou une couche de zinc.'
    ],
    retenirAr: 'يصدأ الحديد بوجود ثنائي الأوكسجين والماء، والملح يسرع ذلك، والصدأ مسامي. يتغطى الألومنيوم بطبقة واقية من الألومين. نحمي الحديد بالطلاء أو الشحم أو بطبقة من الزنك.',
    voc: [['la rouille', 'الصدأ'], ['la corrosion', 'التآكل'], ['l\'alumine', 'الألومين'], ['l\'oxyde de cuivre', 'أوكسيد النحاس'], ['protéger', 'يحمي']]
  });
})();
