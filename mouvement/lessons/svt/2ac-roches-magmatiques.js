/* @meta {"id":"2ac-roches-magmatiques","level":"2","order":4,"theme":"Géologie","title":"Les roches magmatiques","ar":"الصخور الصهارية","lead":"Le granite rose de Tafraout et le basalte noir d'Azrou viennent tous deux d'un magma. Pourquoi sont-ils si différents ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* loupe : cristaux dont la taille dépend de la durée du refroidissement. lent = 0 (très rapide) à 1 (très lent) */
  function loupe(svg, cx, cy, R) {
    var e = {}, g = S('g', {}, svg), seed = 7;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var clip = 'lp' + Math.round(cx);
    var defs = S('defs', {}, svg), cp = S('clipPath', { id: clip }, defs);
    S('circle', { cx: cx, cy: cy, r: R }, cp);
    S('circle', { cx: cx, cy: cy, r: R, fill: '#2a2d31' }, g);
    var inner = S('g', { 'clip-path': 'url(#' + clip + ')' }, g);
    S('circle', { cx: cx, cy: cy, r: R + 4, fill: 'none', stroke: '#c9ccd1', 'stroke-width': 6 }, g);
    var cols = ['#f2f2f2', '#e9a6a0', '#1c1d20'];   // quartz, feldspath, mica
    e.set = function (lent) {
      seed = 7;
      while (inner.firstChild) inner.removeChild(inner.firstChild);
      if (lent < 0.3) {
        // structure microlitique : verre sombre et minuscules baguettes
        S('rect', { x: cx - R, y: cy - R, width: 2 * R, height: 2 * R, fill: '#22252a' }, inner);
        for (var i = 0; i < 160; i++) {
          var x = cx + (rnd() * 2 - 1) * R, y = cy + (rnd() * 2 - 1) * R, s = 3 + lent * 12 + rnd() * 3;
          S('rect', { x: x, y: y, width: s, height: 1.4, fill: '#8a8d92', transform: 'rotate(' + Math.round(rnd() * 180) + ' ' + x + ' ' + y + ')' }, inner);
        }
        return;
      }
      // structure grenue : cristaux jointifs, de plus en plus gros
      S('rect', { x: cx - R, y: cy - R, width: 2 * R, height: 2 * R, fill: '#e9a6a0' }, inner);
      var s = 6 + lent * 22;
      for (var gy = cy - R; gy < cy + R; gy += s * 0.8) {
        for (var gx = cx - R; gx < cx + R; gx += s * 0.8) {
          var w = s * (0.7 + rnd() * 0.5), hh = s * (0.5 + rnd() * 0.4), px = gx + rnd() * s * 0.3, py = gy + rnd() * s * 0.3;
          S('rect', { x: px, y: py, width: w, height: hh, fill: cols[Math.floor(rnd() * 3)], stroke: '#141517', 'stroke-width': .4, transform: 'rotate(' + Math.round(rnd() * 60 - 30) + ' ' + px + ' ' + py + ')' }, inner);
        }
      }
    };
    e.g = g;
    return e;
  }

  /* coupe : magma en profondeur (granite) et lave en surface (basalte) */
  function coupe(svg) {
    var e = {};
    S('rect', { x: 0, y: 0, width: 360, height: 80, fill: '#1b2430' }, svg);
    S('rect', { x: 0, y: 80, width: 360, height: 220, fill: '#5a4428' }, svg);
    T(svg, 8, 96, 'surface', 'tag', 'start');
    e.prof = S('g', {}, svg);
    S('ellipse', { cx: 110, cy: 230, rx: 75, ry: 40, fill: '#c8452f' }, e.prof);
    e.prof.appendChild(T(svg, 110, 234, 'magma : refroidit lentement', 'tag'));
    e.prof.appendChild(T(svg, 110, 290, '→ granite', 'lbl acc'));
    e.surf = S('g', {}, svg);
    S('path', { d: 'M220 80 L250 40 L270 40 L300 80 Z', fill: '#3a3d42' }, e.surf);
    S('path', { d: 'M268 46 Q300 70 350 78 L350 80 L270 80 Z', fill: '#ff8a3d' }, e.surf);
    e.surf.appendChild(T(svg, 110, 30, 'lave en surface : refroidit vite', 'tag'));
    e.surf.appendChild(T(svg, 110, 56, 'basalte →', 'lbl acc'));
    e.dyke = S('rect', { x: 255, y: 80, width: 10, height: 150, fill: '#c8452f' }, svg);
    return e;
  }

  MV.lesson({
    id: '2ac-roches-magmatiques',
    objectif: {
      fr: 'Relier la structure d\'une roche magmatique, grenue ou microlitique, à la vitesse de refroidissement du magma.',
      ar: 'ربط بنية الصخرة الصهارية، محببة أو ميكروليتية، بسرعة تبرد الصهارة.'
    },

    prerequis: {
      fr: 'Le magma, la lave et les éruptions volcaniques.',
      ar: 'الصهارة واللابة والثوران البركاني.'
    },

    ouverture: {
      vb: '0 0 360 300', label: 'Granite et basalte',
      hud: [['r', 'roche'], ['c', 'couleur'], ['x', 'cristaux']],
      draw: function (svg) {
        var e = {};
        e.gra = S('g', {}, svg);
        S('path', { d: 'M20 220 Q40 120 110 110 Q170 120 160 220 Z', fill: '#d9a39a' }, e.gra);
        [[60, 170], [90, 150], [120, 190], [80, 200], [130, 150], [100, 175]].forEach(function (p, i) { S('rect', { x: p[0], y: p[1], width: 12, height: 8, fill: ['#f2f2f2', '#1c1d20', '#e9a6a0'][i % 3] }, e.gra); });
        e.gra.appendChild(T(svg, 90, 250, 'granite, Tafraout', 'tag'));
        e.bas = S('g', {}, svg);
        S('path', { d: 'M200 220 Q215 130 270 125 Q335 135 330 220 Z', fill: '#26282c' }, e.bas);
        e.bas.appendChild(T(svg, 265, 250, 'basalte, Azrou', 'tag'));
        e.q = T(svg, 180, 50, 'même origine ?', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'À **Tafraout**, dans l\'Anti-Atlas, de gros rochers roses : du **granite**.', on: ['gra'], hud: { r: ['granite'], c: 'rose clair', x: '–' } },
        { cap: 'De près, on voit des **cristaux** à l\'œil nu : blancs, roses et noirs.', on: ['gra'], hud: { r: 'granite', c: 'rose clair', x: ['visibles'] } },
        { cap: 'Près d\'**Azrou**, du **basalte** noir : presque aucun cristal visible.', on: ['gra', 'bas'], hud: { r: ['basalte'], c: 'noir', x: ['invisibles'] } },
        { cap: 'Les deux viennent d\'un **magma**. Alors pourquoi sont-ils si différents ?', on: ['gra', 'bas', 'q'], hud: { r: 'les deux', c: '–', x: ['?'] } }
      ]
    },

    predire: {
      q: 'Un magma refroidit très lentement, pendant des milliers d\'années, en profondeur. À quoi ressemblera la roche ?',
      ar: 'صهارة تبرد ببطء شديد لآلاف السنين في العمق. كيف ستكون الصخرة؟',
      o: ['De gros cristaux bien visibles', 'Presque pas de cristaux, comme du verre', 'Une roche pleine de fossiles'],
      a: 0,
      e: 'Plus le refroidissement est lent, plus les cristaux ont le temps de grandir. C\'est le cas du granite.',
      ear: 'كلما كان التبرد بطيئا كان للبلورات وقت أطول لتكبر، وهذا حال الغرانيت.'
    },

    prepare: [
      ['Le magma est une roche fondue.', true, 'Il est très chaud, plus de 700 °C.'],
      ['Un cristal est un solide aux formes régulières, comme le sel ou le sucre.', true, 'Les roches magmatiques sont faites de cristaux appelés minéraux.'],
      ['Une roche magmatique contient souvent des fossiles.', false, 'Elle vient d\'un magma très chaud : les fossiles se trouvent dans les roches sédimentaires.']
    ],

    regarde: {
      vb: '0 0 360 300', label: 'Où refroidit le magma ?',
      hud: [['l', 'lieu'], ['v', 'refroidissement'], ['s', 'structure']],
      draw: function (svg) { var e = coupe(svg); return { prof: e.prof, surf: e.surf, dyke: e.dyke }; },
      steps: [
        { cap: 'Le **magma** se forme en profondeur, par fusion de roches. En refroidissant, il donne une **roche magmatique**.', ar: 'تتكون الصهارة في العمق، وعندما تبرد تعطي صخرة صهارية.', on: ['prof'], hud: { l: 'profondeur', v: '–', s: '–' } },
        { cap: 'Resté **en profondeur**, il refroidit très **lentement** : les cristaux grandissent.', ar: 'إذا بقيت في العمق تبرد ببطء شديد فتكبر البلورات.', on: ['prof'], hud: { l: ['profondeur'], v: ['lent'], s: '–' } },
        { cap: 'On obtient une structure **grenue** : tous les cristaux sont visibles à l\'œil nu. Exemple : le **granite**.', ar: 'نحصل على بنية محببة، كل بلوراتها مرئية بالعين المجردة، مثل الغرانيت.', on: ['prof'], hud: { l: 'profondeur', v: 'lent', s: ['grenue'] } },
        { cap: 'Le granite contient trois minéraux : **quartz** gris clair, **feldspath** rose ou blanc, **mica** noir et brillant.', ar: 'يحتوي الغرانيت على ثلاثة معادن: الكوارتز والفلدسبات والميكا.', on: ['prof'], hud: { l: 'profondeur', v: 'lent', s: 'quartz, feldspath, mica' } },
        { cap: 'Arrivée **en surface**, la lave refroidit très **vite**, au contact de l\'air ou de l\'eau.', ar: 'عندما تصل إلى السطح تبرد اللابة بسرعة عند ملامستها للهواء أو الماء.', on: ['prof', 'dyke', 'surf'], hud: { l: ['surface'], v: ['rapide'], s: '–' } },
        { cap: 'On obtient une structure **microlitique** : du verre et de minuscules cristaux. Exemple : le **basalte**.', ar: 'نحصل على بنية ميكروليتية من زجاج وبلورات دقيقة، مثل البازلت.', on: ['prof', 'dyke', 'surf'], hud: { l: 'surface', v: 'rapide', s: ['microlitique'] } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis la durée du refroidissement et regarde la roche à la loupe.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 220', role: 'img', 'aria-label': 'Cristaux vus à la loupe selon la vitesse de refroidissement' }, st);
          var lp = loupe(svg, 180, 110, 95);
          var set = MV.hud(c, [['l', 'lieu'], ['x', 'cristaux', 1], ['s', 'structure', 1]]), vu = {};
          var dur = ['quelques heures', 'quelques jours', 'quelques mois', 'quelques années', 'des siècles', 'des milliers d\'années', 'des centaines de milliers d\'années'];
          MV.slider(c, { label: 'durée du refroidissement', min: 0, max: 6, value: 0, fmt: function (v) { return dur[v]; } }, function (v) {
            var x = v / 6; lp.set(x);
            var gr = v >= 4; vu[gr ? 'g' : 'm'] = 1;
            set('l', v <= 1 ? 'surface' : v <= 3 ? 'peu profond' : 'profondeur');
            set('x', v <= 1 ? 'invisibles' : v <= 3 ? 'petits' : 'visibles'); set('s', gr ? 'grenue' : v <= 1 ? 'microlitique' : 'entre les deux');
            if (vu.g && vu.m) done();
          });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Durées indicatives. Structure grenue : granite ; microlitique : basalte. Blanc : quartz ; rose : feldspath ; noir : mica.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'On compte les cristaux d\'un granite vu à la loupe.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. Sur 50 cristaux comptés, 15 sont du quartz. Quel pourcentage de quartz ?', a: 30, unit: '%', hint: '15 ÷ 50 × 100.' },
            { q: 'Étape 2. Le feldspath représente 60 %. Le reste est du mica. Quel pourcentage de mica ?', a: 10, unit: '%', hint: '100 − 30 − 60.' },
            { type: 'opt', q: 'Étape 3. Ce granite, aux cristaux bien visibles, s\'est formé :', o: ['en surface, par refroidissement rapide', 'en profondeur, par refroidissement lent'], a: 1, e: 'Structure grenue : refroidissement lent en profondeur.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le granite a une structure :', o: ['grenue', 'microlitique'], a: 0, e: 'Tous ses cristaux sont visibles à l\'œil nu.' },
      { lvl: 'Niveau 2', q: 'Le basalte s\'est formé :', o: ['par refroidissement rapide de la lave en surface', 'par refroidissement lent du magma en profondeur'], a: 0, e: 'Sa structure est microlitique.' },
      { lvl: 'Niveau 3', q: 'Un granite contient 35 % de quartz et 55 % de feldspath. Le reste est du mica. Quel pourcentage de mica ?', a: 10, unit: '%', hint: '100 − 35 − 55.' },
      { lvl: 'Niveau 4', q: 'Le gabbro a la même composition que le basalte, mais avec de gros cristaux visibles. Il s\'est donc formé :', o: ['en profondeur, par refroidissement lent', 'en surface, par refroidissement rapide'], a: 0, e: 'C\'est la vitesse de refroidissement qui fixe la taille des cristaux.' }
    ],

    bilan: {
      vb: '0 0 360 300', label: 'Même magma, deux roches',
      hud: [['l', 'lieu'], ['v', 'refroidissement'], ['r', 'roche']],
      draw: function (svg) { var e = coupe(svg); return { prof: e.prof, surf: e.surf, dyke: e.dyke }; },
      steps: [
        { cap: 'En **profondeur** : refroidissement **lent**, gros cristaux, structure **grenue** : le **granite**.', on: ['prof'], hud: { l: ['profondeur'], v: 'lent', r: ['granite'] } },
        { cap: 'En **surface** : refroidissement **rapide**, verre et microlites, structure **microlitique** : le **basalte**.', on: ['prof', 'dyke', 'surf'], hud: { l: ['surface'], v: 'rapide', r: ['basalte'] } },
        { cap: 'La taille des cristaux raconte **où** et **à quelle vitesse** le magma a refroidi.', ar: 'حجم البلورات يخبرنا أين وبأي سرعة بردت الصهارة.', on: ['prof', 'dyke', 'surf'], hud: { l: 'les deux', v: ['vitesse'], r: 'les deux' } }
      ]
    },

    retenir: [
      'Une <b>roche magmatique</b> se forme par refroidissement d\'un <b>magma</b>. Elle est faite de cristaux appelés <b>minéraux</b>.',
      'Refroidissement <b>lent en profondeur</b> : structure <b>grenue</b>, cristaux visibles, comme le <b>granite</b> (quartz, feldspath, mica). Refroidissement <b>rapide en surface</b> : structure <b>microlitique</b>, verre et microlites, comme le <b>basalte</b>.'
    ],
    retenirAr: 'تتكون الصخرة الصهارية عند تبرد الصهارة، وهي مكونة من بلورات تسمى معادن. التبرد البطيء في العمق يعطي بنية محببة مثل الغرانيت، والتبرد السريع في السطح يعطي بنية ميكروليتية مثل البازلت.',
    voc: [['une roche magmatique', 'صخرة صهارية'], ['un cristal', 'بلورة'], ['un minéral', 'معدن'], ['le granite', 'الغرانيت'], ['le basalte', 'البازلت'], ['une structure grenue', 'بنية محببة'], ['une structure microlitique', 'بنية ميكروليتية'], ['le refroidissement', 'التبرد']]
  });
})();
