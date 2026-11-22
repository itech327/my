/* @meta {"id":"3ac-respiration-homme","level":"3","order":2,"theme":"Nutrition","title":"La respiration chez l'Homme","ar":"التنفس عند الإنسان","lead":"Pendant la course, on respire plus vite : on suit l'air jusqu'aux alvéoles, où le dioxygène passe dans le sang."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* thorax : poumons qui se gonflent, diaphragme qui descend */
  function thorax(svg0) {
    var e = {}, svg = S('g', {}, svg0); e.g = svg;
    S('path', { d: 'M180 20 v60', stroke: '#cfd3d8', 'stroke-width': 8 }, svg);                       // trachée
    S('path', { d: 'M180 80 l-30 30 M180 80 l30 30', stroke: '#cfd3d8', 'stroke-width': 6 }, svg);   // bronches
    e.pg = S('ellipse', { cx: 130, cy: 150, rx: 50, ry: 70, fill: '#d07a70' }, svg);
    e.pd = S('ellipse', { cx: 230, cy: 150, rx: 50, ry: 70, fill: '#d07a70' }, svg);
    e.dia = S('path', { d: 'M60 230 Q180 190 300 230', stroke: 'var(--acc)', 'stroke-width': 5, fill: 'none' }, svg);
    [e.pg, e.pd].forEach(function (p) { p.style.cssText = 'transition:all 1.2s ease-in-out;transform-box:fill-box;transform-origin:50% 0%'; });
    e.dia.style.transition = 'transform 1.2s ease-in-out';
    T(svg, 320, 225, 'diaphragme', 'tag', 'end'); T(svg, 196, 30, 'trachée', 'tag', 'start');
    e.breath = function (inspire) { var s = inspire ? 'scale(1.12,1.15)' : 'scale(1,1)'; e.pg.style.transform = s; e.pd.style.transform = s; e.dia.style.transform = inspire ? 'translate(0px,16px)' : 'none'; };
    return e;
  }
  /* alvéole et capillaire : O2 passe vers le sang, CO2 vers l'alvéole */
  function alveole(svg) {
    var g = S('g', {}, svg);
    S('circle', { cx: 180, cy: 110, r: 70, fill: '#2b2e33', stroke: '#d07a70', 'stroke-width': 4 }, g);
    T(g, 180, 60, 'alvéole (air)', 'tag');
    S('path', { d: 'M20 205 C 120 170, 240 170, 340 205', stroke: '#c95a5a', 'stroke-width': 26, fill: 'none', opacity: .8 }, g);
    T(g, 180, 235, 'capillaire sanguin', 'tag');
    var o = [], c = [];
    for (var i = 0; i < 4; i++) { o.push(S('circle', { r: 6, fill: 'var(--acc)' }, g)); c.push(S('circle', { r: 6, fill: '#e9e9ea' }, g)); }
    g.go = function (after) {
      o.forEach(function (d, i) { d.style.transition = 'all 1.4s'; d.setAttribute('cx', 140 + i * 25); d.setAttribute('cy', after ? 190 : 100); });
      c.forEach(function (d, i) { d.style.transition = 'all 1.4s'; d.setAttribute('cx', 150 + i * 25); d.setAttribute('cy', after ? 120 : 196); });
    };
    g.go(false);
    return g;
  }

  MV.lesson({
    id: '3ac-respiration-homme',
    objectif: {
      fr: 'Décrire le trajet de l\'air, les mouvements respiratoires et les échanges gazeux au niveau des alvéoles.',
      ar: 'وصف مسار الهواء والحركات التنفسية والتبادلات الغازية على مستوى الحويصلات الرئوية.'
    },

    ouverture: {
      vb: '0 0 360 240', label: 'Respirer en courant',
      hud: [['r', 'au repos'], ['c', 'en courant'], ['q', 'pourquoi ?']],
      draw: function (svg) { var e = thorax(svg); return { ctl: e }; },
      steps: [
        { cap: 'Au repos, on respire environ **15 fois** par minute.', hud: { r: ['≈ 15 / min'], c: '–', q: '–' }, run: function (e) { e.ctl.breath(true); setTimeout(function () { e.ctl.breath(false); }, 1300); } },
        { cap: 'Après une course, on respire **beaucoup plus vite**.', hud: { r: '≈ 15 / min', c: ['≈ 40 / min'], q: '–' }, run: function (e) { e.ctl.breath(true); setTimeout(function () { e.ctl.breath(false); }, 600); } },
        { cap: 'Pourquoi le corps a-t-il besoin de **plus d\'air** ? On le saura à la fin.', hud: { r: '≈ 15 / min', c: '≈ 40 / min', q: ['?'] } }
      ]
    },

    predire: {
      q: "Après une course, on respire beaucoup plus vite qu'au repos. Pourquoi le corps a-t-il besoin de plus d'air ?",
      ar: "بعد الجري نتنفس أسرع بكثير من الراحة. لماذا يحتاج الجسم إلى هواء أكثر؟",
      o: ["Parce que les poumons sont fatigués", "Les muscles qui travaillent consomment plus de dioxygène et produisent plus de dioxyde de carbone", "Pour avoir plus d'air dans l'estomac"],
      a: 1,
      e: "Les muscles qui travaillent consomment plus de dioxygène et rejettent plus de dioxyde de carbone. Le corps accélère la ventilation pour renouveler l'air des poumons.",
      ear: "العضلات العاملة تستهلك أكسجيناً أكثر وتطرح ثاني أكسيد الكربون أكثر، فيسرّع الجسم التهوية."
    },

    prepare: [
      ['L\'air entre par le nez ou la bouche.', true, 'Puis il descend par la trachée.'],
      ['L\'air que l\'on expire ne contient plus de dioxygène.', false, 'Il en contient encore, environ 16 %, contre 21 % dans l\'air inspiré.'],
      ['Le sang circule dans tout le corps.', true, 'Il transporte le dioxygène jusqu\'aux organes.']
    ],

    regarde: {
      vb: '0 0 360 250', label: 'Le trajet de l\'air et les échanges',
      hud: [['e', 'étape'], ['o', 'dioxygène'], ['c', 'dioxyde de carbone']],
      draw: function (svg) { var e = thorax(svg); var a = alveole(svg); return { th: e.g, alv: a, ctl: e }; },
      steps: [
        { cap: 'L\'air passe par le nez, la **trachée**, les bronches, puis les poumons.', ar: 'يمر الهواء عبر الأنف والقصبة الهوائية والقصبات ثم الرئتين.', on: ['th'], hud: { e: ['trajet de l\'air'], o: '–', c: '–' }, run: function (e) { e.ctl.breath(false); } },
        { cap: '**Inspiration** : le diaphragme descend, les poumons se gonflent.', ar: 'الشهيق: ينخفض الحجاب الحاجز وتنتفخ الرئتان.', on: ['th'], hud: { e: ['inspiration'], o: '–', c: '–' }, run: function (e) { e.ctl.breath(true); } },
        { cap: '**Expiration** : le diaphragme remonte, l\'air est chassé.', ar: 'الزفير: يرتفع الحجاب الحاجز ويطرد الهواء.', on: ['th'], hud: { e: ['expiration'], o: '–', c: '–' }, run: function (e) { e.ctl.breath(false); } },
        { cap: 'Au bout des bronches : des millions de petits sacs, les **alvéoles**, entourés de vaisseaux.', ar: 'في نهاية القصيبات توجد ملايين الحويصلات الرئوية المحاطة بالشعيرات الدموية.', on: ['alv'], hud: { e: ['alvéoles'], o: '–', c: '–' }, run: function (e) { e.alv.go(false); } },
        { cap: 'Le **dioxygène** passe de l\'air de l\'alvéole vers le sang.', ar: 'ينتقل ثنائي الأوكسجين من هواء الحويصلة إلى الدم.', on: ['alv'], hud: { e: 'échanges gazeux', o: ['air → sang'], c: '–' }, run: function (e) { e.alv.go(true); } },
        { cap: 'Le **dioxyde de carbone** fait le trajet inverse : du sang vers l\'air.', ar: 'وينتقل ثنائي أوكسيد الكربون في الاتجاه المعاكس: من الدم إلى الهواء.', on: ['alv'], hud: { e: 'échanges gazeux', o: 'air → sang', c: ['sang → air'] }, run: function (e) { e.alv.go(true); } },
        { cap: 'Air inspiré : 21 % de dioxygène. Air expiré : **environ 16 %**, et plus de CO₂.', ar: 'الهواء المستنشق يحتوي حوالي 21% من ثنائي الأوكسجين والهواء المزفور حوالي 16%.', on: ['alv'], hud: { e: 'bilan', o: ['21 % → 16 %'], c: ['0,04 % → 4 %'] }, run: function (e) { e.alv.go(true); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Fais varier l\'effort. Observe la fréquence respiratoire et le dioxygène consommé (valeurs approximatives).',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 250', role: 'img', 'aria-label': 'Poumons qui respirent' }, st);
          var th = thorax(svg), f = 15, on = true, set = MV.hud(c, [['e', 'effort'], ['f', 'respirations / min', 1], ['o', 'O₂ consommé', 1]]);
          (function cycle() { th.breath(on); on = !on; setTimeout(cycle, 30000 / f); })();
          MV.slider(c, { label: 'effort', min: 0, max: 3, value: 0, fmt: function (v) { return ['repos', 'marche', 'course', 'sprint'][v]; } }, function (v) {
            f = [15, 20, 35, 45][v]; set('e', ['repos', 'marche', 'course', 'sprint'][v]); set('f', '≈ ' + f); set('o', ['×1', '×2', '×6', '×10'][v]); if (v === 3) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Pousse l\'effort jusqu\'au sprint. Les muscles qui travaillent consomment plus de dioxygène.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Comparons l\'air inspiré et l\'air expiré.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. L\'air inspiré contient 21 % de dioxygène, l\'air expiré 16 %. Combien de points de pourcentage sont restés dans le corps ?', a: 5, unit: '%', hint: '21 − 16.' },
            { type: 'opt', q: 'Étape 2. Où ce dioxygène est-il passé dans le sang ?', o: ['dans la trachée', 'dans les alvéoles pulmonaires', 'dans l\'estomac'], a: 1 },
            { type: 'opt', q: 'Étape 3. L\'air expiré trouble davantage l\'eau de chaux car il contient plus de :', o: ['dioxygène', 'dioxyde de carbone', 'diazote'], a: 1 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Pendant l\'inspiration, le diaphragme :', o: ['descend', 'monte', 'ne bouge pas'], a: 0 },
      { lvl: 'Niveau 2', q: 'Les échanges gazeux respiratoires ont lieu :', o: ['dans la trachée', 'au niveau des alvéoles', 'dans le nez'], a: 1 },
      { lvl: 'Niveau 3', q: 'Une personne fait 15 respirations par minute. Combien en 10 minutes ?', a: 150, hint: '15 × 10.' },
      { lvl: 'Niveau 4', q: 'Pourquoi la paroi des alvéoles est-elle très fine ?', o: ['Pour faciliter le passage des gaz entre l\'air et le sang.', 'Pour retenir l\'air plus longtemps.', 'Pour filtrer la poussière.'], a: 0 }
    ],

    bilan: {
      vb: '0 0 360 250', label: 'Le dioxygène va aux muscles',
      hud: [['e', 'effort'], ['m', 'muscles'], ['r', 'respiration']],
      draw: function (svg) { var a = alveole(svg); return { alv: a }; },
      steps: [
        { cap: 'En courant, les **muscles** travaillent plus : ils consomment plus de dioxygène.', on: ['alv'], hud: { e: ['course'], m: ['+ O₂'], r: '–' }, run: function (e) { e.alv.go(false); } },
        { cap: 'On respire **plus vite et plus fort** : plus d\'air arrive aux alvéoles, plus d\'O₂ passe dans le sang.', ar: 'عند الجهد تزداد وتيرة التنفس فيصل إلى الدم مزيد من ثنائي الأوكسجين، ويطرح مزيد من ثنائي أوكسيد الكربون.', on: ['alv'], hud: { e: 'course', m: '+ O₂', r: ['plus rapide'] }, run: function (e) { e.alv.go(true); } }
      ]
    },

    retenir: [
      'L\'air passe par le nez, la trachée et les bronches jusqu\'aux <b>alvéoles</b> pulmonaires. L\'<b>inspiration</b> (le diaphragme descend) et l\'<b>expiration</b> (il remonte) renouvellent l\'air des poumons.',
      'Dans les alvéoles, le <b>dioxygène</b> passe de l\'air vers le sang et le <b>dioxyde de carbone</b> du sang vers l\'air : ce sont les échanges gazeux. Pendant l\'effort, ils augmentent.'
    ],
    retenirAr: 'يمر الهواء عبر الأنف والقصبة الهوائية والقصبات حتى الحويصلات الرئوية. في الحويصلات ينتقل ثنائي الأوكسجين من الهواء إلى الدم، وثنائي أوكسيد الكربون من الدم إلى الهواء. وتزداد هذه التبادلات أثناء الجهد.',
    voc: [['la trachée', 'القصبة الهوائية'], ['les bronches', 'القصبات'], ['une alvéole pulmonaire', 'حويصلة رئوية'], ['l\'inspiration', 'الشهيق'], ['l\'expiration', 'الزفير'], ['le diaphragme', 'الحجاب الحاجز']]
  });
})();
