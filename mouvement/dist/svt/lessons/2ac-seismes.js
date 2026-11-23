/* @meta {"id":"2ac-seismes","level":"2","order":2,"theme":"Géologie","title":"Les séismes","ar":"الزلازل","lead":"Al Haouz, septembre 2023 : une roche casse à des kilomètres sous terre, et le sol tremble jusqu'à Marrakech."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* coupe : surface, couches, faille, foyer, épicentre, ondes. t = 0 (avant) à 1 (ondes en surface) */
  function coupe(svg) {
    var e = {};
    S('rect', { x: 0, y: 0, width: 360, height: 90, fill: '#1d3a52' }, svg);
    var cols = ['#8a6a3a', '#6f5530', '#5a4428', '#4a3822'];
    for (var k = 0; k < 4; k++) S('rect', { x: 0, y: 90 + k * 52, width: 360, height: 52, fill: cols[k] }, svg);
    T(svg, 350, 84, 'surface', 'tag', 'end');
    e.faille = S('path', { d: 'M150 90 L230 298', stroke: '#141517', 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '6 4' }, svg);
    e.lf = T(svg, 238, 280, 'faille', 'tag', 'start');
    e.ondes = S('g', {}, svg);
    e.cercles = [0, 1, 2].map(function () { return S('circle', { cx: 196, cy: 210, r: 0, fill: 'none', stroke: '#ff5c5c', 'stroke-width': 2 }, e.ondes); });
    e.foyer = S('g', {}, svg);
    S('path', { d: 'M196 198 l4 8 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1 Z', fill: '#ffd166' }, e.foyer);
    e.foyer.appendChild(T(svg, 182, 214, 'foyer', 'lbl', 'end'));
    e.epi = S('g', {}, svg);
    S('path', { d: 'M196 90 v-26', stroke: '#ffd166', 'stroke-width': 2, 'stroke-dasharray': '3 3' }, e.epi);
    S('circle', { cx: 196, cy: 90, r: 5, fill: '#ffd166' }, e.epi);
    e.epi.appendChild(T(svg, 204, 60, 'épicentre', 'lbl', 'start'));
    e.vert = S('path', { d: 'M196 98 V196', stroke: '#ffd166', 'stroke-width': 1.5, 'stroke-dasharray': '2 4' }, svg);
    e.set = function (t) {
      e.cercles.forEach(function (c, i) {
        var r = Math.max(0, t * 150 - i * 35);
        c.setAttribute('r', r); c.style.opacity = r > 0 ? (1 - r / 190).toFixed(2) : 0;
      });
    };
    e.set(0);
    return e;
  }

  /* carte vue de dessus : zones d'intensité autour de l'épicentre et un village déplaçable */
  function carte(svg) {
    var e = {};
    S('rect', { x: 0, y: 0, width: 360, height: 220, fill: '#2a2d31' }, svg);
    // limites des zones d'intensité du modèle (≥ 8, ≥ 6, ≥ 4), à l'échelle de 1,5 pixel par kilomètre
    [[300, '#4a3f2a'], [129, '#7a5a2a'], [53, '#a5612c'], [15, '#c8452f']].forEach(function (z) {
      S('circle', { cx: 40, cy: 110, r: z[0], fill: z[1], opacity: 0.9 }, svg);
    });
    S('circle', { cx: 40, cy: 110, r: 6, fill: '#ffd166' }, svg);
    T(svg, 40, 136, 'épicentre', 'tag');
    e.vil = S('g', {}, svg);
    S('path', { d: 'M-9 6 V-4 L0 -12 L9 -4 V6 Z', fill: '#fff' }, e.vil);
    e.lv = T(svg, 0, 26, 'village', 'tag');
    e.vil.appendChild(e.lv);
    e.set = function (d) { e.vil.setAttribute('transform', 'translate(' + (40 + d * 1.5) + ',110)'); };
    return e;
  }

  function intensite(d) { return Math.max(1, Math.round(9 - 2 * Math.log(1 + d / 15) / Math.LN2)); }
  function effet(i) { return i >= 8 ? 'destructions' : i >= 6 ? 'dégâts' : i >= 4 ? 'ressenti' : 'faible'; }

  MV.lesson({
    id: '2ac-seismes',
    objectif: {
      fr: 'Expliquer qu\'un séisme naît de la rupture brutale des roches en profondeur, distinguer foyer et épicentre, magnitude et intensité.',
      ar: 'تفسير أن الزلزال ينتج عن تكسر مفاجئ للصخور في العمق، والتمييز بين البؤرة والمركز السطحي، وبين القوة والشدة.'
    },

    prerequis: {
      fr: 'La surface de la Terre est formée de plaques qui bougent.',
      ar: 'سطح الأرض مكون من صفائح تتحرك.'
    },

    ouverture: {
      vb: '0 0 360 300', label: 'Le séisme d\'Al Haouz',
      hud: [['q', 'quand'], ['o', 'où'], ['r', 'ressenti']],
      draw: function (svg) {
        var e = {};
        S('path', { d: 'M0 230 L70 150 L120 180 L190 90 L250 160 L300 120 L360 170 V300 H0 Z', fill: '#3a3d42' }, svg).setAttribute('data-keep', 1);
        T(svg, 190, 80, 'Haut Atlas', 'tag');
        e.ville = S('g', {}, svg);
        S('rect', { x: 290, y: 236, width: 40, height: 30, fill: '#d8bf7a' }, e.ville); S('rect', { x: 300, y: 220, width: 8, height: 16, fill: '#d8bf7a' }, e.ville);
        T(svg, 310, 284, 'Marrakech', 'tag');
        e.ondes = S('g', {}, svg);
        [20, 50, 90, 140].forEach(function (r) { S('circle', { cx: 150, cy: 210, r: r, fill: 'none', stroke: '#ff5c5c', 'stroke-width': 2, opacity: 0.8 }, e.ondes); });
        e.q = T(svg, 120, 40, 'pourquoi le sol tremble ?', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'Le **8 septembre 2023**, vers 23 h, le sol tremble dans la province d\'**Al Haouz**.', hud: { q: ['2023'], o: '–', r: '–' } },
        { cap: 'La secousse part du **Haut Atlas** et se propage dans toutes les directions.', on: ['ondes'], hud: { q: '2023', o: ['Haut Atlas'], r: '–' } },
        { cap: 'On la ressent jusqu\'à **Marrakech** et bien plus loin. Des villages sont détruits.', on: ['ondes', 'ville'], hud: { q: '2023', o: 'Haut Atlas', r: ['très loin'] } },
        { cap: 'Que se passe-t-il **sous terre** ? Et pourquoi les dégâts sont-ils plus forts près de la montagne ?', on: ['ondes', 'ville', 'q'], hud: { q: '2023', o: 'Haut Atlas', r: ['?'] } }
      ]
    },

    predire: {
      q: 'Deux villages sentent le même séisme : l\'un à 10 km de l\'épicentre, l\'autre à 150 km. Que se passe-t-il ?',
      ar: 'قريتان تحسان بنفس الزلزال: الأولى على بعد 10 كلم من المركز السطحي والثانية على بعد 150 كلم. ماذا يحدث؟',
      o: ['Les deux subissent les mêmes dégâts', 'Le village proche subit plus de dégâts', 'Le village lointain subit plus de dégâts'],
      a: 1,
      e: 'Le séisme a une seule magnitude, mais son intensité, c\'est-à-dire ses effets, diminue quand on s\'éloigne de l\'épicentre.',
      ear: 'للزلزال قوة واحدة، لكن شدته أي آثاره تنقص كلما ابتعدنا عن المركز السطحي.'
    },

    prepare: [
      ['Les roches sous nos pieds peuvent se casser.', true, 'Quand les forces sont trop grandes, elles cassent brusquement.'],
      ['Un séisme ne se produit qu\'au bord de la mer.', false, 'Il peut se produire en montagne, comme dans le Haut Atlas.'],
      ['Une onde se propage, comme les ronds dans l\'eau.', true, 'Elle part d\'un point et s\'éloigne dans toutes les directions.']
    ],

    regarde: {
      vb: '0 0 360 300', label: 'Coupe : du foyer à la surface',
      hud: [['l', 'lieu'], ['p', 'phénomène'], ['s', 'mesure']],
      draw: function (svg) { var e = coupe(svg); return { faille: e.faille, lf: e.lf, foyer: e.foyer, epi: e.epi, ondes: e.ondes, vert: e.vert, ctl: e }; },
      steps: [
        { cap: 'Les plaques poussent les roches. Les forces s\'accumulent le long d\'une **faille**, pendant des années.', ar: 'تدفع الصفائح الصخور فتتراكم القوى على طول صدع لسنوات.', on: ['faille', 'lf'], hud: { l: 'faille', p: ['forces'], s: '–' }, run: function (e) { e.ctl.set(0); } },
        { cap: 'D\'un coup, les roches **cassent** et glissent. Le point de départ en profondeur est le **foyer**.', ar: 'فجأة تتكسر الصخور وتنزلق، ونقطة الانطلاق في العمق هي البؤرة.', on: ['faille', 'foyer'], hud: { l: ['foyer'], p: ['rupture'], s: '–' }, run: function (e) { e.ctl.set(0); } },
        { cap: 'L\'énergie libérée part en **ondes sismiques** dans toutes les directions.', ar: 'تنتشر الطاقة المحررة على شكل موجات زلزالية في كل الاتجاهات.', on: ['faille', 'foyer', 'ondes'], hud: { l: 'foyer', p: ['ondes'], s: '–' }, run: function (e) { e.ctl.set(0.6); } },
        { cap: 'Le point de la surface juste **au-dessus** du foyer est l\'**épicentre** : c\'est là que ça secoue le plus.', ar: 'النقطة السطحية الواقعة فوق البؤرة مباشرة هي المركز السطحي، وفيها تكون الهزة أقوى.', on: ['foyer', 'ondes', 'epi', 'vert'], hud: { l: ['épicentre'], p: 'ondes', s: '–' }, run: function (e) { e.ctl.set(1); } },
        { cap: 'Le **sismographe** enregistre les ondes. La **magnitude** mesure l\'énergie du séisme : une seule valeur.', ar: 'يسجل جهاز رسم الزلازل الموجات، والقوة تقيس طاقة الزلزال وهي قيمة واحدة.', on: ['foyer', 'ondes', 'epi'], hud: { l: 'épicentre', p: 'ondes', s: ['magnitude'] }, run: function (e) { e.ctl.set(1); } },
        { cap: 'L\'**intensité** mesure les effets en un lieu : elle diminue quand on s\'éloigne de l\'épicentre.', ar: 'الشدة تقيس الآثار في مكان معين، وتنقص بالابتعاد عن المركز السطحي.', on: ['epi', 'ondes'], hud: { l: 'épicentre', p: 'ondes', s: ['intensité'] }, run: function (e) { e.ctl.set(1); } },
        { cap: 'La plupart des séismes se produisent aux **limites des plaques**, là où les roches frottent et cassent.', ar: 'تقع معظم الزلازل عند حدود الصفائح حيث تحتك الصخور وتتكسر.', on: ['faille', 'foyer'], hud: { l: ['limites'], p: 'rupture', s: '–' }, run: function (e) { e.ctl.set(0); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Déplace le village. Le séisme reste le même : magnitude 6,8.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 220', role: 'img', 'aria-label': 'Zones d\'intensité autour de l\'épicentre' }, st);
          var e = carte(svg);
          var set = MV.hud(c, [['d', 'distance'], ['i', 'intensité', 1], ['f', 'effets', 1]]);
          MV.slider(c, { label: 'distance à l\'épicentre', min: 0, max: 200, step: 5, value: 0, fmt: function (v) { return v + ' km'; } }, function (v) {
            var i = intensite(v); e.set(v); set('d', v + ' km'); set('i', i); set('f', effet(i)); if (v >= 20) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Échelle d\'intensité simplifiée, de 1 à 9. La magnitude ne change pas : c\'est la même énergie libérée au foyer.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Les ondes voyagent vite, mais pas instantanément.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Une onde sismique parcourt environ 6 km par seconde. Quelle distance en 10 secondes ?', a: 60, unit: 'km', hint: '6 × 10.' },
            { q: 'Étape 2. Une station est à 120 km de l\'épicentre. En combien de secondes l\'onde y arrive-t-elle ?', a: 20, unit: 's', hint: '120 ÷ 6.' },
            { type: 'opt', q: 'Étape 3. L\'épicentre est :', o: ['le point de rupture en profondeur', 'le point de la surface situé à la verticale du foyer', 'l\'appareil qui enregistre les ondes'], a: 1, e: 'Le foyer est en profondeur ; l\'épicentre est juste au-dessus, en surface.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le point en profondeur où les roches cassent s\'appelle :', o: ['le foyer', 'l\'épicentre', 'le sismographe'], a: 0, e: 'L\'épicentre est en surface, au-dessus du foyer.' },
      { lvl: 'Niveau 2', q: 'Quand on s\'éloigne de l\'épicentre, l\'intensité :', o: ['diminue', 'augmente', 'reste la même'], a: 0, e: 'Les effets sont plus faibles loin de l\'épicentre.' },
      { lvl: 'Niveau 3', q: 'Une onde parcourt 5 km par seconde. Elle atteint une station située à 150 km. En combien de secondes ?', a: 30, unit: 's', hint: '150 ÷ 5.' },
      { lvl: 'Niveau 4', q: 'Pourquoi la plupart des séismes se produisent-ils aux limites des plaques ?', o: ['Il y fait plus chaud.', 'Les plaques s\'y frottent et les roches finissent par casser.', 'La mer y est plus profonde.'], a: 1, e: 'Les forces dues au mouvement des plaques s\'y accumulent.' }
    ],

    bilan: {
      vb: '0 0 360 300', label: 'Du foyer à l\'épicentre',
      hud: [['e', 'étape'], ['l', 'lieu'], ['m', 'mesure']],
      draw: function (svg) { var e = coupe(svg); return { faille: e.faille, foyer: e.foyer, epi: e.epi, ondes: e.ondes, ctl: e }; },
      steps: [
        { cap: 'Les forces s\'accumulent, puis les roches **cassent** au **foyer**.', on: ['faille', 'foyer'], hud: { e: ['rupture'], l: 'foyer', m: '–' }, run: function (e) { e.ctl.set(0); } },
        { cap: 'Les **ondes** partent dans toutes les directions et arrivent à l\'**épicentre**.', on: ['foyer', 'ondes', 'epi'], hud: { e: ['ondes'], l: 'épicentre', m: 'magnitude' }, run: function (e) { e.ctl.set(1); } },
        { cap: 'Une seule **magnitude**, mais une **intensité** qui diminue avec la distance.', ar: 'للزلزال قوة واحدة، وشدة تنقص بالابتعاد عن المركز السطحي.', on: ['foyer', 'ondes', 'epi'], hud: { e: 'effets', l: 'partout', m: ['intensité'] }, run: function (e) { e.ctl.set(1); } }
      ]
    },

    retenir: [
      'Un <b>séisme</b> est une secousse du sol due à la <b>rupture brutale des roches</b> en profondeur, le long d\'une faille. Le point de rupture est le <b>foyer</b> ; le point de la surface juste au-dessus est l\'<b>épicentre</b>.',
      'La <b>magnitude</b> mesure l\'énergie libérée : une seule valeur par séisme. L\'<b>intensité</b> mesure les effets en un lieu et <b>diminue</b> avec la distance. Les séismes se produisent surtout aux <b>limites des plaques</b>.'
    ],
    retenirAr: 'الزلزال اهتزاز للأرض ناتج عن تكسر مفاجئ للصخور في العمق. نقطة التكسر هي البؤرة، والنقطة السطحية فوقها هي المركز السطحي. القوة تقيس الطاقة المحررة، والشدة تقيس الآثار وتنقص بالابتعاد. تقع الزلازل غالبا عند حدود الصفائح.',
    voc: [['un séisme', 'زلزال'], ['le foyer', 'البؤرة'], ['l\'épicentre', 'المركز السطحي'], ['une onde sismique', 'موجة زلزالية'], ['la magnitude', 'القوة'], ['l\'intensité', 'الشدة'], ['une faille', 'صدع'], ['un sismographe', 'جهاز رسم الزلازل']]
  });
})();
