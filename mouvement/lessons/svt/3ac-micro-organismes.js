/* @meta {"id":"3ac-micro-organismes","level":"3","order":9,"theme":"Santé","title":"Les micro-organismes","ar":"الجراثيم","lead":"Le yaourt et la carie dentaire ont un point commun : des êtres vivants invisibles. Certains nous aident, d'autres nous rendent malades."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var TYPES = { 'bactérie': '#56d07f', 'virus': '#e5484d', 'levure': '#f2c14e' };

  /* boîte de culture : des micro-organismes dont on règle le nombre et le type */
  function boite(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), pop = S('g', {}, g);
    S('circle', { cx: 180, cy: 105, r: 90, fill: 'rgba(240,220,170,.12)', stroke: '#e9e9ea', 'stroke-width': 3 }, g);
    var tl = T(g, 180, 208, '', 'tag');
    g.set = function (n, type, lab) {
      while (pop.firstChild) pop.removeChild(pop.firstChild);
      var col = TYPES[type || 'bactérie'];
      for (var i = 0; i < n; i++) {
        var a = i * 2.39996, r = 8 + 78 * Math.sqrt((i + 0.5) / Math.max(n, 1)), x = 180 + r * Math.cos(a), y = 105 + r * Math.sin(a);
        if (type === 'virus') { S('circle', { cx: x, cy: y, r: 3, fill: col }, pop); }
        else if (type === 'levure') { S('ellipse', { cx: x, cy: y, rx: 5, ry: 4, fill: col }, pop); }
        else S('rect', { x: x - 5, y: y - 2.5, width: 10, height: 5, rx: 2.5, fill: col, transform: 'rotate(' + (i * 37 % 180) + ' ' + x + ' ' + y + ')' }, pop);
      }
      tl.textContent = lab || '';
    };
    return g;
  }
  function croissance(t) { return t <= 4 ? 1 : t >= 60 ? 0 : Math.round(Math.pow(2, 6 * Math.exp(-Math.pow((t - 37) / 14, 2)))); }

  MV.lesson({
    id: '3ac-micro-organismes',
    objectif: {
      fr: 'Connaître les principaux micro-organismes, leur multiplication, leurs rôles utiles ou pathogènes, et les moyens de s\'en protéger.',
      ar: 'معرفة أهم الجراثيم وتكاثرها وأدوارها النافعة أو الممرضة، ووسائل الوقاية منها.'
    },

    ouverture: {
      vb: '0 0 360 215', label: 'Le yaourt et la carie',
      hud: [['y', 'yaourt'], ['c', 'carie'], ['q', 'point commun ?']],
      draw: function (svg) { var e = {}; e.b = boite(svg); return e; },
      steps: [
        { cap: 'Le **yaourt** se fabrique en ajoutant au lait des bactéries utiles.', hud: { y: ['bactéries utiles'], c: '–', q: '–' }, run: function (e) { e.b.set(30, 'bactérie', 'bactéries du yaourt'); } },
        { cap: 'La **carie** est causée par des bactéries de la bouche qui attaquent les dents.', hud: { y: 'bactéries utiles', c: ['bactéries nuisibles'], q: '–' }, run: function (e) { e.b.set(30, 'bactérie', 'bactéries de la bouche'); } },
        { cap: 'Qui sont ces êtres invisibles, et comment s\'en protéger ? On le saura à la fin.', hud: { y: 'utiles', c: 'nuisibles', q: ['?'] }, run: function (e) { e.b.set(30, 'bactérie'); } }
      ]
    },

    prepare: [
      ['Les micro-organismes ne sont visibles qu\'au microscope.', true, 'Ils mesurent quelques micromètres, ou moins.'],
      ['Tous les microbes sont dangereux.', false, 'Beaucoup sont utiles : yaourt, pain, fromage.'],
      ['Se laver les mains limite la transmission des microbes.', true, 'C\'est un geste d\'hygiène essentiel.']
    ],

    regarde: {
      vb: '0 0 360 215', label: 'Le monde des micro-organismes',
      hud: [['t', 'type'], ['e', 'exemple'], ['r', 'rôle']],
      draw: function (svg) { var e = {}; e.b = boite(svg); return e; },
      steps: [
        { cap: 'Les **bactéries** sont des cellules simples, sans noyau.', ar: 'البكتيريا خلايا بسيطة بدون نواة.', hud: { t: ['bactérie'], e: 'bactérie du yaourt', r: 'utile ou pathogène' }, run: function (e) { e.b.set(25, 'bactérie', 'bactéries'); } },
        { cap: 'Les **virus**, bien plus petits, ne se multiplient qu\'**à l\'intérieur** d\'une cellule.', ar: 'الفيروسات أصغر بكثير ولا تتكاثر إلا داخل خلية.', hud: { t: ['virus'], e: 'virus de la grippe', r: 'pathogène' }, run: function (e) { e.b.set(60, 'virus', 'virus'); } },
        { cap: 'Les **levures** et moisissures sont des champignons microscopiques : la levure fait lever le pain.', ar: 'الخمائر فطريات مجهرية: الخميرة تجعل العجين ينتفخ.', hud: { t: ['champignon'], e: 'levure du pain', r: ['utile'] }, run: function (e) { e.b.set(25, 'levure', 'levures'); } },
        { cap: 'Un micro-organisme qui provoque une maladie est dit **pathogène**. Il entre par une **plaie** ou les **voies respiratoires et digestives**.', ar: 'الجرثومة المسببة للمرض تسمى ممرضة، وتدخل عبر جرح أو المسالك التنفسية والهضمية.', hud: { t: 'pathogène', e: 'infection', r: ['maladie'] }, run: function (e) { e.b.set(80, 'bactérie', 'infection'); } },
        { cap: 'Protection : **hygiène**, **antiseptiques** sur les plaies, **froid** pour les aliments. Les **antibiotiques** agissent sur les bactéries, **pas sur les virus**.', ar: 'الوقاية: النظافة، والمطهرات على الجروح، والتبريد للأغذية. المضادات الحيوية تؤثر في البكتيريا لا في الفيروسات.', hud: { t: 'protection', e: 'savon, froid', r: ['antibiotique ≠ virus'] }, run: function (e) { e.b.set(4, 'bactérie', 'après lavage'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Une heure dans une boîte de culture : règle la température. Où les bactéries se multiplient-elles le plus ?',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 215', role: 'img', 'aria-label': 'Boîte de culture' }, st);
          var b = boite(svg), set = MV.hud(c, [['t', 'température'], ['n', 'bactéries', 1], ['l', 'lieu']]);
          MV.slider(c, { label: 'température (°C)', min: 0, max: 70, value: 4, step: 1 }, function (t) { var n = croissance(t); b.set(Math.min(n, 64), 'bactérie'); set('t', t + ' °C'); set('n', n); set('l', t <= 5 ? 'réfrigérateur' : t >= 60 ? 'cuisson' : t >= 30 && t <= 40 ? 'corps humain' : 'pièce'); if (t === 37) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
          MV.H('p', 'small', 'Cherche la température du corps humain.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'Leila a la grippe, une maladie virale.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. La grippe est due à :', o: ['un virus', 'une bactérie'], a: 0 },
            { type: 'opt', q: 'Étape 2. Un antibiotique est-il efficace ?', o: ['non', 'oui'], a: 0, e: 'Les antibiotiques n\'agissent que sur les bactéries.' },
            { type: 'opt', q: 'Étape 3. Pour ne pas contaminer sa famille :', o: ['se laver les mains et tousser dans son coude', 'partager son verre'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Un micro-organisme qui provoque une maladie est :', o: ['pathogène', 'utile'], a: 0 },
      { lvl: 'Niveau 2', q: 'La levure sert à fabriquer :', o: ['le pain', 'le sel'], a: 0 },
      { lvl: 'Niveau 3', q: 'Les antibiotiques agissent sur :', o: ['les bactéries', 'les virus'], a: 0 },
      { lvl: 'Niveau 4', q: 'Une bactérie se divise toutes les 20 min. Combien de bactéries après 1 h à partir d\'une seule ?', a: 8 }
    ],

    bilan: {
      vb: '0 0 360 215', label: 'Utiles ou nuisibles',
      hud: [['u', 'utiles'], ['n', 'nuisibles'], ['p', 'protection']],
      draw: function (svg) { var e = {}; e.b = boite(svg); return e; },
      steps: [
        { cap: 'Les mêmes êtres invisibles : des bactéries **utiles** (yaourt) et **pathogènes** (carie).', hud: { u: ['yaourt, pain'], n: ['carie, infections'], p: '–' }, run: function (e) { e.b.set(30, 'bactérie'); } },
        { cap: 'Brossage des dents, lavage des mains, froid : on limite leur **multiplication**.', ar: 'بعض الجراثيم نافعة وبعضها ممرض، ونحد من تكاثرها بالنظافة والتبريد.', hud: { u: 'yaourt, pain', n: 'carie, infections', p: ['hygiène, froid'] }, run: function (e) { e.b.set(4, 'bactérie', 'après brossage'); } }
      ]
    },

    retenir: [
      'Les <b>micro-organismes</b> (bactéries, virus, champignons microscopiques) se multiplient très vite dans de bonnes conditions. Certains sont <b>utiles</b>, d\'autres <b>pathogènes</b>.',
      'On s\'en protège par l\'<b>hygiène</b>, les <b>antiseptiques</b> et le froid. Les <b>antibiotiques</b> agissent sur les bactéries, pas sur les virus.'
    ],
    retenirAr: 'الجراثيم (بكتيريا، فيروسات، فطريات مجهرية) تتكاثر بسرعة في الظروف الملائمة، بعضها نافع وبعضها ممرض. نقي أنفسنا منها بالنظافة والمطهرات والتبريد، والمضادات الحيوية تؤثر في البكتيريا لا في الفيروسات.',
    voc: [['un micro-organisme', 'جرثومة'], ['une bactérie', 'بكتيريا'], ['un virus', 'فيروس'], ['pathogène', 'ممرض'], ['un antiseptique', 'مطهر']]
  });
})();
