/* @meta {"id":"2ac-chaines-montagnes","level":"2","order":6,"theme":"Géologie","title":"La formation des chaînes de montagnes","ar":"تكون السلاسل الجبلية","lead":"Les Andes sont pleines de volcans, l'Himalaya presque pas. Deux façons de construire une montagne quand les plaques se rapprochent."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* coupe : mode 'sub' (subduction) ou 'col' (collision), t = avancement 0 à 1 */
  function coupe(svg) {
    var e = {};
    S('rect', { x: 0, y: 0, width: 360, height: 300, fill: '#1b2430' }, svg);
    S('rect', { x: 0, y: 200, width: 360, height: 100, fill: '#5a2a1e' }, svg);
    T(svg, 350, 292, 'manteau', 'tag', 'end');
    e.mer = S('rect', { x: 0, y: 110, width: 360, height: 30, fill: '#1d3a52' }, svg);
    e.oc = S('path', { fill: '#2f3a44', stroke: '#141517' }, svg);           // plaque océanique
    e.cg = S('path', { fill: '#b59a6a', stroke: '#141517' }, svg);           // continent de gauche (collision)
    e.cd = S('path', { fill: '#c9a35a', stroke: '#141517' }, svg);           // continent de droite
    e.sed = S('path', { fill: '#d8bf7a', stroke: '#141517', 'stroke-width': .6 }, svg);
    e.volc = S('g', {}, svg);
    [[250, 0], [290, 0]].forEach(function (p) { S('path', { d: 'M' + (p[0] - 14) + ' 0 L' + p[0] + ' -26 L' + (p[0] + 14) + ' 0 Z', fill: '#4a3a32' }, e.volc); S('circle', { cx: p[0], cy: -30, r: 4, fill: '#ff8a3d' }, e.volc); });
    e.magma = S('path', { d: 'M200 190 Q230 160 250 120', stroke: '#ff8a3d', 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '6 5' }, svg);
    e.fosse = T(svg, 160, 100, 'fosse', 'tag');
    e.seis = S('g', {}, svg);
    [[175, 150], [200, 175], [225, 200], [250, 225]].forEach(function (p) { S('circle', { cx: p[0], cy: p[1], r: 4, fill: '#ff5c5c' }, e.seis); });
    e.fl = S('g', {}, svg);
    S('path', { d: 'M20 80 h44 l-8 -6 m8 6 l-8 6', stroke: 'var(--acc)', 'stroke-width': 3, fill: 'none' }, e.fl);
    S('path', { d: 'M340 80 h-44 l8 -6 m-8 6 l8 6', stroke: 'var(--acc)', 'stroke-width': 3, fill: 'none' }, e.fl);
    e.lab = T(svg, 180, 30, '', 'lbl acc');
    e.set = function (mode, t) {
      var sub = mode === 'sub';
      e.mer.style.opacity = sub ? 1 : Math.max(0, 1 - t * 1.4);
      if (sub) {
        // l'océan (à gauche) plonge sous le continent (à droite)
        var hd = 140 - t * 60;   // relief du continent
        e.oc.setAttribute('d', 'M0 140 L150 140 Q175 145 280 260 L260 270 Q170 165 150 160 L0 160 Z');
        e.cg.setAttribute('d', '');
        e.cd.setAttribute('d', 'M170 140 Q200 ' + hd + ' 240 ' + (hd - 10) + ' Q280 ' + (hd - 20) + ' 320 ' + hd + ' L360 140 L360 200 L250 200 Q210 170 175 145 Z');
        e.sed.setAttribute('d', '');
        e.volc.setAttribute('transform', 'translate(0,' + (hd - 6) + ')');
        e.volc.style.opacity = t > 0.4 ? 1 : 0; e.magma.style.opacity = t > 0.4 ? 1 : 0;
        e.fosse.style.opacity = 1; e.seis.style.opacity = t > 0.2 ? 1 : 0;
        e.lab.textContent = 'subduction : chaîne de type Andes';
      } else {
        // deux continents se rapprochent, l'océan et ses sédiments se ferment, puis la croûte s'épaissit
        var gap = 140 * Math.max(0, 1 - t / 0.75), xg = 180 - gap / 2, xd = 180 + gap / 2, h = t > 0.75 ? (t - 0.75) * 4 : 0;
        e.oc.setAttribute('d', gap > 2 ? 'M' + xg + ' 140 L' + xd + ' 140 L' + xd + ' 160 L' + xg + ' 160 Z' : '');
        var rac = 200 + h * 70;   // racine : la croûte s'épaissit vers le bas
        e.cg.setAttribute('d', 'M0 140 L' + xg + ' 140 L' + xg + ' ' + rac + ' Q' + (xg - 60) + ' 200 0 200 Z');
        e.cd.setAttribute('d', 'M' + xd + ' 140 L360 140 L360 200 Q' + (xd + 60) + ' 200 ' + xd + ' ' + rac + ' Z');
        if (h > 0) {
          var pk = [[80, 0], [105, .45], [125, .3], [150, .8], [170, .6], [185, 1], [205, .7], [225, .85], [245, .4], [265, .5], [290, 0]];
          e.sed.setAttribute('d', 'M' + pk.map(function (q) { return q[0] + ' ' + (140 - q[1] * h * 120); }).join(' L') + ' Z');
        } else e.sed.setAttribute('d', gap > 2 ? 'M' + xg + ' 140 L' + xd + ' 140 L' + xd + ' 133 L' + xg + ' 133 Z' : '');
        e.volc.style.opacity = 0; e.magma.style.opacity = 0; e.fosse.style.opacity = 0;
        e.seis.style.opacity = 0;
        e.lab.textContent = 'collision : chaîne de type Himalaya';
      }
      e.fl.style.opacity = t > 0 ? 1 : 0;
    };
    e.set('sub', 0);
    return e;
  }

  MV.lesson({
    id: '2ac-chaines-montagnes',
    objectif: {
      fr: 'Distinguer une chaîne de subduction et une chaîne de collision, et expliquer leur formation par le rapprochement des plaques.',
      ar: 'التمييز بين سلسلة الانغراز وسلسلة الاصطدام، وتفسير تكونهما بتقارب الصفائح.'
    },

    prerequis: {
      fr: 'Les plaques, les séismes, les volcans, les plis et les failles.',
      ar: 'الصفائح والزلازل والبراكين والطيات والصدوع.'
    },

    ouverture: {
      vb: '0 0 360 300', label: 'Andes et Himalaya',
      hud: [['c', 'chaîne'], ['v', 'volcans'], ['r', 'roches']],
      draw: function (svg) {
        var e = {};
        e.andes = S('g', {}, svg);
        S('path', { d: 'M10 220 L50 140 L70 170 L100 110 L130 170 L160 220 Z', fill: '#4a3a32' }, e.andes);
        [[50, 140], [100, 110]].forEach(function (p) { S('circle', { cx: p[0], cy: p[1] - 8, r: 6, fill: '#ff8a3d' }, e.andes); });
        e.andes.appendChild(T(svg, 85, 245, 'Andes', 'tag'));
        e.him = S('g', {}, svg);
        S('path', { d: 'M190 220 L230 120 L260 160 L290 70 L320 150 L350 220 Z', fill: '#d8bf7a' }, e.him);
        S('path', { d: 'M283 86 L290 70 L297 86 Z', fill: '#fff' }, e.him);
        e.him.appendChild(T(svg, 270, 245, 'Himalaya', 'tag'));
        e.q = T(svg, 180, 40, 'pourquoi si différentes ?', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'Les **Andes**, en Amérique du Sud, longent l\'océan Pacifique.', on: ['andes'], hud: { c: ['Andes'], v: '–', r: '–' } },
        { cap: 'On y trouve beaucoup de **volcans** actifs et de forts séismes.', on: ['andes'], hud: { c: 'Andes', v: ['nombreux'], r: 'volcaniques' } },
        { cap: 'L\'**Himalaya**, en Asie, a les plus hauts sommets du monde, mais presque pas de volcans.', on: ['andes', 'him'], hud: { c: ['Himalaya'], v: ['presque pas'], r: 'plissées' } },
        { cap: 'Deux chaînes de montagnes, deux histoires. Laquelle est née de la **fermeture d\'un océan** ?', on: ['andes', 'him', 'q'], hud: { c: 'les deux', v: '–', r: ['?'] } }
      ]
    },

    predire: {
      q: 'Une plaque océanique, lourde, rencontre un continent. Que fait-elle ?',
      ar: 'صفيحة محيطية ثقيلة تلتقي بقارة. ماذا تفعل؟',
      o: ['Elle s\'arrête net', 'Elle plonge sous le continent, dans le manteau', 'Elle passe par-dessus le continent'],
      a: 1,
      e: 'La lithosphère océanique est plus dense : elle s\'enfonce sous le continent. C\'est la subduction. Elle s\'accompagne d\'une fosse, de séismes et de volcans.',
      ear: 'الغلاف الصخري المحيطي أكثف فينغرز تحت القارة، وهذا هو الانغراز، وترافقه خندق وزلازل وبراكين.'
    },

    prepare: [
      ['Deux plaques peuvent se rapprocher.', true, 'On parle de convergence.'],
      ['Une plaque océanique est plus légère qu\'un continent.', false, 'Elle est plus dense, donc plus lourde à volume égal.'],
      ['Les plis et les failles inverses sont dus à une compression.', true, 'On les trouve dans les chaînes de montagnes.']
    ],

    regarde: {
      vb: '0 0 360 300', label: 'Subduction puis collision',
      hud: [['m', 'mécanisme'], ['i', 'indices'], ['e', 'exemple']],
      draw: function (svg) { var e = coupe(svg); return { ctl: e }; },
      steps: [
        { cap: 'Une plaque **océanique** se rapproche d\'une plaque **continentale**.', ar: 'تتقارب صفيحة محيطية وصفيحة قارية.', hud: { m: 'convergence', i: '–', e: '–' }, run: function (e) { e.ctl.set('sub', 0.1); } },
        { cap: 'Plus dense, la plaque océanique **plonge** sous le continent : c\'est la **subduction**. Une **fosse** océanique se creuse.', ar: 'الصفيحة المحيطية الأكثف تنغرز تحت القارة: إنه الانغراز، ويتكون خندق محيطي.', hud: { m: ['subduction'], i: ['fosse'], e: '–' }, run: function (e) { e.ctl.set('sub', 0.3); } },
        { cap: 'Le frottement provoque des **séismes** de plus en plus profonds sous le continent.', ar: 'يسبب الاحتكاك زلازل تزداد عمقا تحت القارة.', hud: { m: 'subduction', i: ['séismes'], e: '–' }, run: function (e) { e.ctl.set('sub', 0.5); } },
        { cap: 'En profondeur, du **magma** se forme et monte : des **volcans** apparaissent sur le continent, qui se plisse et s\'élève.', ar: 'في العمق تتكون صهارة تصعد فتظهر براكين فوق القارة التي تنطوي وترتفع.', hud: { m: 'subduction', i: ['volcans'], e: ['Andes'] }, run: function (e) { e.ctl.set('sub', 1); } },
        { cap: 'Si la subduction fait disparaître tout l\'océan, deux **continents** se retrouvent face à face.', ar: 'إذا اختفى المحيط كله بالانغراز تلتقي قارتان وجها لوجه.', hud: { m: 'fermeture', i: 'plus d\'océan', e: '–' }, run: function (e) { e.ctl.set('col', 0.6); } },
        { cap: 'Trop légers pour plonger, ils se **heurtent** : c\'est la **collision**. Les roches se plissent, se cassent et s\'empilent.', ar: 'لأنهما خفيفتان لا تنغرزان فتصطدمان: إنه الاصطدام، فتنطوي الصخور وتنكسر وتتراكم.', hud: { m: ['collision'], i: ['plis'], e: '–' }, run: function (e) { e.ctl.set('col', 0.85); } },
        { cap: 'La croûte s\'épaissit et forme de très hautes montagnes, avec des **sédiments marins** de l\'ancien océan : l\'**Himalaya**.', ar: 'تزداد القشرة سمكا وتتكون جبال شاهقة تحمل رسوبيات بحرية من المحيط القديم: الهيمالايا.', hud: { m: 'collision', i: ['sédiments'], e: ['Himalaya'] }, run: function (e) { e.ctl.set('col', 1); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis le type de rencontre, puis fais avancer les plaques.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 300', role: 'img', 'aria-label': 'Formation d\'une chaîne de subduction ou de collision' }, st);
          var e = coupe(svg), mode = 'sub', t = 0, vu = {};
          var set = MV.hud(c, [['m', 'arrive'], ['i', 'on observe', 1], ['e', 'exemple', 1]]), row = MV.H('div', 'row', '', c);
          function maj() {
            e.set(mode, t);
            if (mode === 'sub') { set('m', 'océan'); set('i', t < 0.3 ? 'fosse' : t < 0.6 ? '+ séismes' : '+ volcans'); set('e', t >= 0.6 ? 'Andes' : '–'); }
            else { set('m', 'continent'); set('i', t < 1 ? 'fermeture' : 'plis, failles'); set('e', t >= 1 ? 'Himalaya' : '–'); }
            if (t >= 1) vu[mode] = 1;
            if (vu.sub && vu.col) done();
          }
          var btns = [['Océan contre continent', 'sub'], ['Continent contre continent', 'col']].map(function (x) {
            var b = MV.H('button', 'btn', x[0], row); b.onclick = function () { mode = x[1]; t = 0; maj(); }; return b;
          });
          var go = MV.H('button', 'btn', 'Faire avancer', row);
          go.onclick = function () { t = Math.min(1, Math.round((t + 0.25) * 100) / 100); maj(); };
          maj();
          MV.H('p', 'small', 'Pour chaque rencontre, fais avancer jusqu\'au bout. Coupe simplifiée.', c);
        } },
      { title: 'Résolvons ensemble', intro: 'La vitesse de l\'Inde et les indices des deux chaînes.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Étape 1. L\'Inde avance vers l\'Asie d\'environ 5 cm par an. De combien de kilomètres en 1 million d\'années ?', a: 50, unit: 'km', hint: '5 cm × 1 000 000 = 5 000 000 cm = 50 km.' },
            { type: 'opt', q: 'Étape 2. Dans les Andes, la plaque qui plonge est :', o: ['la plaque océanique', 'la plaque continentale'], a: 0, e: 'Plus dense, elle s\'enfonce dans le manteau.' },
            { type: 'opt', q: 'Étape 3. Des sédiments marins plissés au sommet d\'une chaîne sans volcans indiquent :', o: ['une chaîne de subduction', 'une chaîne de collision'], a: 1, e: 'Un océan s\'est fermé entre deux continents.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le plongement d\'une plaque océanique sous une autre plaque s\'appelle :', o: ['la subduction', 'la collision', 'l\'érosion'], a: 0, e: 'Elle forme une fosse océanique.' },
      { lvl: 'Niveau 2', q: 'Une fosse océanique et de nombreux volcans caractérisent :', o: ['une chaîne de subduction', 'une chaîne de collision'], a: 0, e: 'Exemple : les Andes.' },
      { lvl: 'Niveau 3', q: 'Une plaque avance de 4 cm par an pendant 2 millions d\'années. De combien de kilomètres ?', a: 80, unit: 'km', hint: '4 cm × 2 000 000 = 8 000 000 cm = 80 km.' },
      { lvl: 'Niveau 4', q: 'Pourquoi trouve-t-on des fossiles marins au sommet de l\'Himalaya ?', o: ['La mer recouvrait l\'Himalaya il y a cent ans.', 'Un océan s\'est fermé et ses sédiments ont été plissés et soulevés.', 'Des oiseaux les ont apportés.'], a: 1, e: 'C\'est la trace de l\'océan qui séparait l\'Inde de l\'Asie.' }
    ],

    bilan: {
      vb: '0 0 360 300', label: 'Deux types de chaînes',
      hud: [['m', 'mécanisme'], ['i', 'indices'], ['e', 'exemple']],
      draw: function (svg) { var e = coupe(svg); return { ctl: e }; },
      steps: [
        { cap: '**Subduction** : l\'océan plonge sous le continent. Fosse, séismes, **volcans**.', hud: { m: ['subduction'], i: 'volcans', e: ['Andes'] }, run: function (e) { e.ctl.set('sub', 1); } },
        { cap: '**Collision** : l\'océan a disparu, deux continents se heurtent. Plis, failles, **sédiments marins** en altitude.', hud: { m: ['collision'], i: 'plis', e: ['Himalaya'] }, run: function (e) { e.ctl.set('col', 1); } },
        { cap: 'Dans les deux cas, ce sont des plaques qui se **rapprochent** : une **convergence**.', ar: 'في الحالتين تتقارب الصفائح: سلسلة انغراز مثل الأنديز، وسلسلة اصطدام مثل الهيمالايا.', hud: { m: ['convergence'], i: '–', e: 'les deux' }, run: function (e) { e.ctl.set('col', 1); } }
      ]
    },

    retenir: [
      'Une <b>chaîne de subduction</b> se forme quand une plaque <b>océanique</b> plonge sous une plaque continentale : fosse océanique, séismes, <b>volcans</b>. Exemple : les <b>Andes</b>.',
      'Une <b>chaîne de collision</b> se forme quand deux <b>continents</b> se heurtent après la fermeture d\'un océan : plis, failles, <b>sédiments marins</b> en altitude, presque pas de volcans. Exemple : l\'<b>Himalaya</b>.'
    ],
    retenirAr: 'تتكون سلسلة الانغراز عندما تنغرز صفيحة محيطية تحت صفيحة قارية، مع خندق وزلازل وبراكين، مثل الأنديز. وتتكون سلسلة الاصطدام عندما تصطدم قارتان بعد انغلاق محيط، مع طيات وصدوع ورسوبيات بحرية في القمم، مثل الهيمالايا.',
    voc: [['une chaîne de montagnes', 'سلسلة جبلية'], ['la subduction', 'الانغراز'], ['la collision', 'الاصطدام'], ['une fosse océanique', 'خندق محيطي'], ['la convergence', 'التقارب'], ['la plaque océanique', 'الصفيحة المحيطية'], ['la plaque continentale', 'الصفيحة القارية']]
  });
})();
