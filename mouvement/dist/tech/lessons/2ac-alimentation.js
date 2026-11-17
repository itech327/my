/* @meta {"id":"2ac-alimentation","level":"2","order":4,"theme":"Fonctions électroniques","title":"La fonction « Alimentation »","ar":"وظيفة التغذية","lead":"La lampe de poche s’éteint au milieu de la nuit : la batterie est vide. Quelle source choisir, comment associer les piles, et combien de temps tiendra-t-elle ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, CAP = 2000;

  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    function sources(hot) {
      [['pile', '1,5 V', 'jetable'], ['batterie', '3,7 V', 'rechargeable'], ['adaptateur secteur', '230 V → 5 V', 'branché'], ['panneau solaire', '6 V', 'au soleil']].forEach(function (s, i) {
        var x = 14 + (i % 2) * 174, y = 18 + Math.floor(i / 2) * 92, on = hot === i;
        S('rect', { x: x, y: y, width: 158, height: 78, rx: 10, fill: on ? 'var(--acc-bg)' : '#1d1f22', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 2 }, dyn);
        T(dyn, x + 79, y + 28, s[0], 'lbl'); T(dyn, x + 79, y + 48, s[1], 'tag'); T(dyn, x + 79, y + 66, s[2], 'tag');
      });
    }
    function piles(n) {
      for (var i = 0; i < n; i++) {
        var x = 30 + i * 52;
        S('rect', { x: x, y: 70, width: 44, height: 26, rx: 4, fill: '#26292d', stroke: '#f2c14e', 'stroke-width': 2 }, dyn);
        S('rect', { x: x + 44, y: 78, width: 5, height: 10, fill: '#f2c14e' }, dyn);
        T(dyn, x + 22, 88, '1,5 V', 'tag');
      }
      S('path', { d: 'M30 110V130H' + (30 + n * 52 - 3) + 'V110', stroke: '#9aa0a8', 'stroke-width': 1.5, fill: 'none' }, dyn);
      T(dyn, 30 + n * 26, 152, n + ' × 1,5 V = ' + MV.fmt(n * 1.5, 1) + ' V', 'lbl');
      T(dyn, 180, 40, 'en série : les tensions s’ajoutent', 'tag');
    }
    function batterie(i) {
      var h = CAP / i, pct = Math.min(1, 10 / h);
      S('rect', { x: 40, y: 50, width: 110, height: 120, rx: 10, fill: '#1d1f22', stroke: '#e9e9ea', 'stroke-width': 2.5 }, dyn);
      S('rect', { x: 78, y: 40, width: 34, height: 10, rx: 3, fill: '#e9e9ea' }, dyn);
      var lvl = S('rect', { x: 48, y: 58, width: 94, height: 104, rx: 6, fill: '#56d07f' }, dyn);
      S('animate', { attributeName: 'height', values: '104;0;104', dur: Math.max(1.5, h / 4).toFixed(1) + 's', repeatCount: 'indefinite' }, lvl);
      S('animate', { attributeName: 'y', values: '58;162;58', dur: Math.max(1.5, h / 4).toFixed(1) + 's', repeatCount: 'indefinite' }, lvl);
      T(dyn, 95, 192, CAP + ' mAh', 'tag');
      T(dyn, 250, 70, 'courant : ' + i + ' mA', 'lbl');
      T(dyn, 250, 110, 'autonomie = C ÷ I', 'tag');
      T(dyn, 250, 140, MV.fmt(h, 1) + ' h', 'lbl big');
      void pct;
    }
    g.set = function (o) {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.n) piles(o.n); else if (o.i) batterie(o.i); else sources(o.hot);
    };
    return g;
  }

  MV.lesson({
    id: '2ac-alimentation',
    objectif: {
      fr: 'Citer les sources qui alimentent un objet, calculer la tension de piles en série et l’autonomie d’une batterie (autonomie = capacité ÷ courant).',
      ar: 'ذكر مصادر تغذية جهاز، وحساب توتر أعمدة على التوالي ومدة اشتغال بطارية (المدة = السعة ÷ التيار).'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'La lampe de poche',
      hud: [['s', 'source'], ['d', 'durée']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'La lampe de poche s’éteint : sa **batterie** est vide.', hud: { s: ['batterie'], d: ['vide'] }, run: function (e) { e.s.set({ i: 400 }); } },
        { cap: 'Quelles **sources** peuvent alimenter un objet ?', hud: { s: '?', d: '–' }, run: function (e) { e.s.set({}); } },
        { cap: 'Et combien de **temps** tient une batterie ?', hud: { s: 'batterie', d: ['?'] }, run: function (e) { e.s.set({ i: 200 }); } }
      ]
    },

    prepare: [
      ['Une pile transforme de l’énergie chimique en énergie électrique.', true, 'Les réactifs s’épuisent peu à peu.'],
      ['Une pile ordinaire peut se recharger.', false, 'Seules les batteries (accumulateurs) se rechargent.'],
      ['Les piles usagées vont dans un bac de collecte.', true, 'Elles contiennent des métaux polluants.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Sources, piles, autonomie',
      hud: [['n', 'notion'], ['v', 'valeur']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: '**Alimenter** : fournir l’énergie électrique. Pile, batterie, adaptateur secteur, panneau solaire.', ar: 'التغذية: تزويد الجهاز بالطاقة الكهربائية.', hud: { n: ['sources'], v: '4' }, run: function (e) { e.s.set({}); } },
        { cap: 'La **batterie** se recharge ; l’**adaptateur** abaisse les 230 V du secteur.', ar: 'البطارية تشحن من جديد، والمحول يخفض [[230 V]].', hud: { n: 'batterie, adaptateur', v: ['rechargeable'] }, run: function (e) { e.s.set({ hot: 1 }); } },
        { cap: 'Piles **en série** : les tensions s’**ajoutent**. 3 × 1,5 V = **4,5 V**.', ar: 'الأعمدة على التوالي تُجمع توتراتها: [[3 × 1,5 = 4,5 V]].', hud: { n: ['série'], v: ['4,5 V'] }, run: function (e) { e.s.set({ n: 3 }); } },
        { cap: '**Autonomie** = capacité ÷ courant. 2000 mAh ÷ 200 mA = **10 h**.', ar: 'مدة الاشتغال = السعة ÷ التيار: [[2000 ÷ 200 = 10 h]].', hud: { n: ['autonomie'], v: ['10 h'] }, run: function (e) { e.s.set({ i: 200 }); } },
        { cap: 'Plus l’objet consomme, **moins** la batterie dure : 400 mA → 5 h.', ar: 'كلما زاد الاستهلاك قلت المدة: 400 mA تعطي 5 h.', hud: { n: 'autonomie', v: ['5 h'] }, run: function (e) { e.s.set({ i: 400 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Règle le courant consommé par la lampe. Fais-la tenir exactement 10 heures.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Autonomie d’une batterie' }, st);
          var s = scene(svg), set = MV.hud(c, [['i', 'courant'], ['h', 'autonomie', 1]]);
          MV.slider(c, { label: 'courant', min: 50, max: 500, step: 50, value: 500, fmt: function (v) { return v + ' mA'; } }, function (i) { s.set({ i: i }); set('i', i + ' mA'); set('h', MV.fmt(CAP / i, 1) + ' h'); if (i === 200) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Batterie de 2000 mAh.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Une petite radio.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Trois piles de 1,5 V en série. Tension (V) ?', a: 4.5 },
            { q: 'Étape 2. Batterie 1500 mAh, radio 300 mA. Autonomie (h) ?', a: 5 },
            { type: 'opt', q: 'Étape 3. Une batterie se distingue d’une pile car elle est :', o: ['rechargeable', 'plus petite'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un adaptateur secteur sert à :', o: ['abaisser la tension du secteur', 'augmenter la tension'], a: 0 },
      { lvl: 'Niveau 2', q: 'Quatre piles de 1,5 V en série. Tension (V) ?', a: 6 },
      { lvl: 'Niveau 3', q: 'Batterie 3000 mAh, appareil 250 mA. Autonomie (h) ?', a: 12 },
      { lvl: 'Niveau 4', q: 'Batterie 2400 mAh. On veut 8 h d’autonomie. Courant maximal (mA) ?', a: 300, hint: '2400 ÷ 8' }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Bien alimenter',
      hud: [['s', 'source'], ['d', 'durée']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Une **batterie** rechargeable de 2000 mAh à 200 mA tient **10 h**.', hud: { s: 'batterie', d: ['10 h'] }, run: function (e) { e.s.set({ i: 200 }); } },
        { cap: 'Pour une tension plus grande, on met des piles **en série**.', ar: 'للحصول على توتر أكبر نركب الأعمدة على التوالي.', hud: { s: ['série'], d: '–' }, run: function (e) { e.s.set({ n: 4 }); } }
      ]
    },

    retenir: [
      '<b>Alimenter</b> = fournir l’énergie électrique : pile, batterie (rechargeable), adaptateur secteur (230 V abaissés), panneau solaire. Piles <b>en série</b> : les tensions s’ajoutent.',
      '<b class="mono">Autonomie (h) = capacité (mAh) ÷ courant (mA)</b>. Plus l’appareil consomme, moins il tient.'
    ],
    retenirAr: 'التغذية هي تزويد الجهاز بالطاقة الكهربائية. على التوالي تُجمع التوترات. مدة الاشتغال بالساعات = السعة ÷ التيار.',
    voc: [['une pile', 'عمود'], ['une batterie', 'بطارية'], ['un adaptateur', 'محول'], ['la capacité', 'السعة'], ['l’autonomie', 'مدة الاشتغال']]
  });
})();
