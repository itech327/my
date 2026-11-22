/* @meta {"id":"3ac-systeme-musculaire","level":"3","order":8,"theme":"Relation","title":"Le système musculaire","ar":"الجهاز العضلي","lead":"Pour soulever un cartable, le bras se plie ; pour le reposer, il se tend. Un muscle ne sait que tirer : il en faut deux qui travaillent à tour de rôle."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, RAD = Math.PI / 180;
  var E = [170, 120]; // coude ; épaule en (40, 120), bras horizontal

  /* bras : humérus fixe, avant-bras qui tourne au coude ; biceps au-dessus, triceps au-dessous */
  function bras(svg) {
    var g = S('g', { 'data-keep': 1 }, svg);
    S('line', { x1: 40, y1: E[1], x2: E[0], y2: E[1], stroke: '#e9e9ea', 'stroke-width': 10, 'stroke-linecap': 'round' }, g);
    var av = S('line', { x1: E[0], y1: E[1], stroke: '#e9e9ea', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    var bi = S('path', { fill: 'rgba(229,72,77,.8)', stroke: '#141517' }, g), tri = S('path', { fill: 'rgba(229,72,77,.45)', stroke: '#141517' }, g);
    T(g, 110, E[1] + 44, 'triceps (derrière)', 'tag');
    var tb = T(g, 0, 0, 'biceps', 'tag');
    g.set = function (ang) { // angle du coude entre 40° (plié) et 170° (tendu)
      var th = (180 - ang) * RAD, L = 110, H = [E[0] + L * Math.cos(th), E[1] - L * Math.sin(th)];
      av.setAttribute('x2', H[0]); av.setAttribute('y2', H[1]);
      var ins = [E[0] + 26 * Math.cos(th), E[1] - 6 - 26 * Math.sin(th)], k = (170 - ang) / 130; // k : 0 tendu, 1 plié
      var bw = 8 + 26 * k, mx = (60 + ins[0]) / 2, my = (E[1] - 6 + ins[1]) / 2 - bw;
      bi.setAttribute('d', 'M60 ' + (E[1] - 6) + ' Q' + mx + ' ' + (my - bw * 0.6) + ' ' + ins[0] + ' ' + ins[1] + ' Q' + mx + ' ' + (my + bw) + ' 60 ' + (E[1] - 6) + ' Z');
      var tw = 26 - 18 * k;
      tri.setAttribute('d', 'M60 ' + (E[1] + 6) + ' Q115 ' + (E[1] + 6 + tw) + ' ' + (E[0] + 8) + ' ' + (E[1] + 6) + ' Q115 ' + (E[1] + 6 + tw / 3) + ' 60 ' + (E[1] + 6) + ' Z');
      tb.setAttribute('x', 80); tb.setAttribute('y', Math.min(E[1] - 14, my - bw * 0.3));
      return k;
    };
    return g;
  }

  MV.lesson({
    id: '3ac-systeme-musculaire',
    objectif: {
      fr: 'Expliquer comment deux muscles antagonistes font bouger une articulation, et connaître les besoins et l\'hygiène du muscle.',
      ar: 'تفسير كيف تحرك عضلتان متضادتان مفصلا، ومعرفة حاجيات العضلة وقواعد الحفاظ عليها.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'Soulever un cartable',
      hud: [['m', 'mouvement'], ['a', 'angle du coude'], ['q', 'quel muscle ?']],
      draw: function (svg) { var e = {}; e.b = bras(svg); return e; },
      steps: [
        { cap: 'Le bras est **tendu**, le cartable posé.', hud: { m: ['repos'], a: ['170°'], q: '–' }, run: function (e) { e.b.set(170); } },
        { cap: 'On **plie** le coude pour soulever le cartable.', hud: { m: ['flexion'], a: ['50°'], q: '–' }, run: function (e) { e.b.set(50); } },
        { cap: 'Quel muscle plie le bras, et lequel le tend ? On le saura à la fin.', hud: { m: 'flexion', a: '50°', q: ['?'] }, run: function (e) { e.b.set(50); } }
      ]
    },

    predire: {
      q: "Pour plier le coude et soulever un cartable, quel muscle se contracte ?",
      ar: "لثني المرفق ورفع حقيبة، أي عضلة تتقلص؟",
      o: ["Le triceps", "Le biceps", "Les deux en même temps"],
      a: 1,
      e: "Pour plier le coude, le biceps se contracte, c'est-à-dire qu'il raccourcit, pendant que le triceps se relâche. Pour tendre le bras, c'est l'inverse : ce sont des muscles antagonistes.",
      ear: "لثني المرفق تتقلص العضلة ذات الرأسين وترتخي ثلاثية الرؤوس، وللبسط يحدث العكس: عضلتان متضادتان."
    },

    prepare: [
      ['Les muscles sont attachés aux os par des tendons.', true, 'Ce sont des cordons solides.'],
      ['Un muscle peut pousser un os.', false, 'Un muscle ne fait que tirer en se contractant.'],
      ['Le coude est une articulation.', true, 'Il relie le bras et l\'avant-bras.']
    ],

    regarde: {
      vb: '0 0 360 220', label: 'Deux muscles antagonistes',
      hud: [['b', 'biceps'], ['t', 'triceps'], ['m', 'mouvement']],
      draw: function (svg) { var e = {}; e.b = bras(svg); return e; },
      steps: [
        { cap: 'Le **biceps** est devant le bras, le **triceps** derrière. Tous deux sont fixés aux os par des **tendons**.', ar: 'العضلة ذات الرأسين في الأمام، والعضلة ذات الثلاثة رؤوس في الخلف، وتثبتان بالعظام بواسطة أوتار.', hud: { b: 'devant', t: 'derrière', m: '–' }, run: function (e) { e.b.set(140); } },
        { cap: 'Le biceps **se contracte** : il raccourcit et grossit. L\'avant-bras se **plie** : **flexion**.', ar: 'تتقلص ذات الرأسين فتقصر وتنتفخ، فينثني الساعد.', hud: { b: ['contracté'], t: 'relâché', m: ['flexion'] }, run: function (e) { e.b.set(50); } },
        { cap: 'Le triceps se contracte, le biceps se relâche : le bras se **tend** : **extension**.', ar: 'تتقلص ذات الثلاثة رؤوس وترتخي ذات الرأسين فيمتد الساعد.', hud: { b: 'relâché', t: ['contracté'], m: ['extension'] }, run: function (e) { e.b.set(165); } },
        { cap: 'Ils agissent en sens contraires : ce sont des muscles **antagonistes**.', ar: 'تعملان في اتجاهين متعاكسين: إنهما عضلتان متضادتان.', hud: { b: 'antagoniste', t: 'antagoniste', m: ['à tour de rôle'] }, run: function (e) { e.b.set(100); } },
        { cap: 'Pour se contracter, le muscle reçoit un **message nerveux** et consomme **glucose et dioxygène**.', ar: 'تتقلص العضلة بأمر عصبي، وتستهلك الكليكوز وثنائي الأكسجين.', hud: { b: 'message nerveux', t: 'énergie', m: ['glucose + O₂'] }, run: function (e) { e.b.set(60); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Plie et tends le bras. Quel muscle se contracte ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 220', role: 'img', 'aria-label': 'Bras et muscles' }, st);
          var b = bras(svg), set = MV.hud(c, [['a', 'angle'], ['c', 'muscle contracté', 1]]), lo = 0, hi = 0;
          MV.slider(c, { label: 'angle du coude', min: 40, max: 170, value: 170, step: 10 }, function (a) { b.set(a); set('a', a + '°'); set('c', a < 110 ? 'biceps' : 'triceps'); if (a <= 60) lo = 1; if (a >= 160) hi = 1; if (lo && hi) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Plie complètement le bras, puis tends-le.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Un élève fait des tractions pendant le cours d\'EPS.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. En montant, il plie les bras. Le muscle contracté :', o: ['le biceps', 'le triceps'], a: 0 },
            { type: 'opt', q: 'Étape 2. Ses muscles consomment davantage :', o: ['de dioxygène et de glucose', 'de calcium seulement'], a: 0 },
            { type: 'opt', q: 'Étape 3. Avant l\'effort, il doit :', o: ['s\'échauffer', 'rester immobile'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un muscle qui se contracte :', o: ['raccourcit et grossit', 's\'allonge'], a: 0 },
      { lvl: 'Niveau 2', q: 'Le muscle qui tend l\'avant-bras :', o: ['le triceps', 'le biceps'], a: 0 },
      { lvl: 'Niveau 3', q: 'Deux muscles qui agissent en sens contraires sont :', o: ['antagonistes', 'identiques'], a: 0 },
      { lvl: 'Niveau 4', q: 'Le corps humain compte environ 600 muscles. Si 40 % sont dans les membres, combien cela fait-il ?', a: 240 }
    ],

    bilan: {
      vb: '0 0 360 220', label: 'Le cartable',
      hud: [['f', 'flexion'], ['e', 'extension'], ['r', 'règle']],
      draw: function (svg) { var e = {}; e.b = bras(svg); return e; },
      steps: [
        { cap: 'Pour **soulever** : le **biceps** se contracte, le bras se plie.', hud: { f: ['biceps'], e: '–', r: '–' }, run: function (e) { e.b.set(50); } },
        { cap: 'Pour **reposer** : le **triceps** se contracte. Un muscle ne fait que **tirer**.', ar: 'ذات الرأسين تثني الذراع وذات الثلاثة رؤوس تمده، والعضلة لا تقوم إلا بالشد.', hud: { f: 'biceps', e: ['triceps'], r: ['muscles antagonistes'] }, run: function (e) { e.b.set(165); } }
      ]
    },

    retenir: [
      'Un muscle <b>se contracte</b> (raccourcit, grossit) et tire sur l\'os grâce aux <b>tendons</b>. Deux muscles <b>antagonistes</b>, comme le biceps et le triceps, font plier puis tendre une articulation.',
      'Le muscle obéit à un <b>message nerveux</b> et consomme <b>glucose</b> et <b>dioxygène</b>. Échauffement, sport régulier et repos le protègent.'
    ],
    retenirAr: 'العضلة تتقلص فتشد العظم بواسطة الأوتار. عضلتان متضادتان كذات الرأسين وذات الثلاثة رؤوس تثنيان المفصل ثم تمدانه. العضلة تتقلص بأمر عصبي وتستهلك الكليكوز وثنائي الأكسجين.',
    voc: [['un muscle', 'عضلة'], ['se contracter', 'يتقلص'], ['un tendon', 'وتر'], ['antagonistes', 'متضادة'], ['une articulation', 'مفصل']]
  });
})();
