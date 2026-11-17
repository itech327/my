/* @meta {"id":"2ac-besoin","level":"2","order":1,"theme":"Analyse fonctionnelle","title":"Besoin, objet technique, système technique","ar":"الحاجة، الشيء التقني، النظام التقني","lead":"Pour lire le soir, Salma a besoin de lumière sur son bureau. Une lampe répond à ce besoin. À qui rend-elle service, sur quoi agit-elle, et dans quel but ?"} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var Q = [['À qui rend-il service ?', 'à l’utilisateur : Salma'], ['Sur quoi agit-il ?', 'sur le bureau à éclairer'], ['Dans quel but ?', 'éclairer pour lire le soir']];

  function boite(g, x, y, w, h, t, on, t2) {
    S('rect', { x: x, y: y, width: w, height: h, rx: 10, fill: on ? 'var(--acc-bg)' : '#1d1f22', stroke: on ? 'var(--acc)' : '#5b6068', 'stroke-width': 2 }, g);
    T(g, x + w / 2, y + (t2 ? h / 2 - 2 : h / 2 + 5), t, 'lbl');
    if (t2) T(g, x + w / 2, y + h / 2 + 14, t2, 'tag');
  }
  function scene(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    g.set = function (o) { // o.k : nombre de réponses ; o.sys : comparer objet et système
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      if (o.sys) {
        boite(dyn, 14, 30, 150, 66, 'objet technique', o.sys === 1, 'une règle, une lampe');
        boite(dyn, 196, 30, 150, 66, 'système technique', o.sys === 2, 'portail automatique');
        T(dyn, 89, 124, 'fait pour un besoin', 'tag');
        T(dyn, 271, 124, 'éléments liés', 'tag');
        T(dyn, 271, 142, 'énergie + commande', 'tag');
        if (o.sys === 2) { var d = S('circle', { r: 4, fill: '#f2c14e' }, dyn); S('animateMotion', { dur: '2s', repeatCount: 'indefinite', path: 'M210 170H330' }, d); T(dyn, 271, 190, 'énergie → mouvement', 'tag'); }
        return;
      }
      // bête à cornes
      var k = o.k || 0;
      S('ellipse', { cx: 180, cy: 104, rx: 58, ry: 26, fill: '#1d1f22', stroke: '#e9e9ea', 'stroke-width': 2.5 }, dyn);
      T(dyn, 180, 109, 'la lampe', 'lbl');
      S('path', { d: 'M110 52Q180 0 250 52', stroke: '#9aa0a8', 'stroke-width': 2, fill: 'none' }, dyn);
      boite(dyn, 14, 34, 120, 40, k > 0 ? 'Salma' : '?', k > 0);
      boite(dyn, 226, 34, 120, 40, k > 1 ? 'le bureau' : '?', k > 1);
      S('path', { d: 'M180 130V150', stroke: '#9aa0a8', 'stroke-width': 2 }, dyn);
      boite(dyn, 60, 150, 240, 40, k > 2 ? 'éclairer pour lire' : 'fonction d’usage ?', k > 2);
      T(dyn, 74, 92, 'utilisateur', 'tag'); T(dyn, 286, 92, 'matière d’œuvre', 'tag');
    };
    return g;
  }

  MV.lesson({
    id: '2ac-besoin',
    objectif: {
      fr: 'Exprimer le besoin auquel répond un objet avec la « bête à cornes », et distinguer un objet technique d’un système technique.',
      ar: 'التعبير عن الحاجة التي يلبيها شيء تقني بمخطط «الثور»، والتمييز بين الشيء التقني والنظام التقني.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'La lampe de Salma',
      hud: [['b', 'besoin'], ['o', 'objet'], ['q', 'question']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le soir, Salma veut **lire** à son bureau.', hud: { b: ['lumière'], o: '?', q: '–' }, run: function (e) { e.s.set({ k: 0 }); } },
        { cap: 'Une **lampe de bureau** répond à ce besoin.', hud: { b: 'lumière', o: ['lampe'], q: '–' }, run: function (e) { e.s.set({ k: 0 }); } },
        { cap: 'Pour bien décrire un objet, on se pose **trois questions**. Lesquelles ?', hud: { b: 'lumière', o: 'lampe', q: ['3 questions'] }, run: function (e) { e.s.set({ k: 0 }); } }
      ]
    },

    prepare: [
      ['Un objet technique est fabriqué par l’homme.', true, 'Il n’existe pas dans la nature.'],
      ['Un caillou est un objet technique.', false, 'Il est naturel, personne ne l’a fabriqué.'],
      ['Un même besoin peut être satisfait par plusieurs objets.', true, 'Pour s’éclairer : lampe, bougie, lampe de poche…']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'La bête à cornes',
      hud: [['q', 'question'], ['r', 'réponse']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'Le **besoin** : ce qui est nécessaire ou souhaité par quelqu’un.', ar: 'الحاجة هي ما يحتاجه شخص أو يرغب فيه.', hud: { q: 'besoin', r: ['lire le soir'] }, run: function (e) { e.s.set({ k: 0 }); } },
        { cap: '**À qui** rend-il service ? À l’**utilisateur** : Salma.', ar: 'لمن يقدم الخدمة؟ للمستعمل.', hud: { q: ['à qui ?'], r: ['Salma'] }, run: function (e) { e.s.set({ k: 1 }); } },
        { cap: '**Sur quoi** agit-il ? Sur la **matière d’œuvre** : le bureau à éclairer.', ar: 'على ماذا يؤثر؟ على مادة العمل.', hud: { q: ['sur quoi ?'], r: ['le bureau'] }, run: function (e) { e.s.set({ k: 2 }); } },
        { cap: '**Dans quel but** ? La **fonction d’usage** : éclairer pour lire.', ar: 'لأي هدف؟ وظيفة الاستعمال: الإنارة للقراءة.', hud: { q: ['dans quel but ?'], r: ['éclairer'] }, run: function (e) { e.s.set({ k: 3 }); } },
        { cap: 'Un **objet technique** est fabriqué pour un besoin.', ar: 'الشيء التقني مصنوع لتلبية حاجة.', hud: { q: 'objet', r: ['lampe, règle'] }, run: function (e) { e.s.set({ sys: 1 }); } },
        { cap: 'Un **système technique** : plusieurs éléments qui agissent **ensemble**, avec énergie et commande.', ar: 'النظام التقني: عناصر تشتغل معا بطاقة وتحكم.', hud: { q: 'système', r: ['portail automatique'] }, run: function (e) { e.s.set({ sys: 2 }); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Pose les trois questions de la bête à cornes pour la lampe.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Bête à cornes' }, st);
          var s = scene(svg), set = MV.hud(c, [['q', 'question'], ['r', 'réponse', 1]]), vu = [0, 0, 0];
          var row = MV.H('div', 'row', '', c);
          Q.forEach(function (q, i) {
            MV.H('button', 'btn', q[0], row).onclick = function () {
              vu[i] = 1; var k = vu[0] ? (vu[1] ? (vu[2] ? 3 : 2) : 1) : 0;
              s.set({ k: k }); set('q', q[0]); set('r', q[1]); if (k === 3) done();
            };
          });
          s.set({ k: 0 }); set('q', 'dans l’ordre'); set('r', '–');
        } },
      { title: 'Résolvons ensemble', intro: 'Une trousse d’écolier.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. À qui rend-elle service ?', o: ['à l’élève', 'aux stylos'], a: 0 },
            { type: 'opt', q: 'Étape 2. Sur quoi agit-elle ?', o: ['sur les stylos et crayons', 'sur le professeur'], a: 0 },
            { type: 'opt', q: 'Étape 3. La trousse est :', o: ['un objet technique', 'un système technique'], a: 0, e: 'Pas d’énergie ni de commande.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un objet technique est fabriqué pour :', o: ['répondre à un besoin', 'décorer la nature'], a: 0 },
      { lvl: 'Niveau 2', q: 'Dans la bête à cornes, « Sur quoi agit-il ? » désigne :', o: ['la matière d’œuvre', 'l’utilisateur'], a: 0 },
      { lvl: 'Niveau 3', q: 'Un portail automatique avec moteur et télécommande est :', o: ['un système technique', 'un objet sans énergie'], a: 0 },
      { lvl: 'Niveau 4', q: 'Le cahier des charges d’une lampe a 3 fonctions et 5 contraintes. Combien d’exigences en tout ?', a: 8 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Les trois questions',
      hud: [['b', 'besoin'], ['o', 'objet'], ['q', 'questions']],
      draw: function (svg) { var e = {}; e.s = scene(svg); return e; },
      steps: [
        { cap: 'À qui ? **Salma**. Sur quoi ? **le bureau**. Dans quel but ? **éclairer pour lire**.', hud: { b: 'lire', o: 'lampe', q: ['bête à cornes'] }, run: function (e) { e.s.set({ k: 3 }); } },
        { cap: 'La lampe est un **objet technique** ; un portail automatique est un **système technique**.', ar: 'المصباح شيء تقني، والباب الآلي نظام تقني.', hud: { b: 'lire', o: 'lampe', q: ['objet / système'] }, run: function (e) { e.s.set({ sys: 2 }); } }
      ]
    },

    retenir: [
      'Un <b>objet technique</b> est fabriqué par l’homme pour répondre à un <b>besoin</b>. La <b>bête à cornes</b> pose trois questions : à qui rend-il service (<b>utilisateur</b>) ? sur quoi agit-il (<b>matière d’œuvre</b>) ? dans quel but (<b>fonction d’usage</b>) ?',
      'Un <b>système technique</b> réunit plusieurs éléments qui agissent ensemble, avec de l’énergie et une commande.'
    ],
    retenirAr: 'الشيء التقني يصنعه الإنسان لتلبية حاجة. مخطط «الثور» يطرح ثلاثة أسئلة: لمن يقدم الخدمة؟ على ماذا يؤثر؟ لأي هدف؟ النظام التقني عناصر تشتغل معا بطاقة وتحكم.',
    voc: [['le besoin', 'الحاجة'], ['un objet technique', 'شيء تقني'], ['la matière d’œuvre', 'مادة العمل'], ['la fonction d’usage', 'وظيفة الاستعمال'], ['un système technique', 'نظام تقني']]
  });
})();
