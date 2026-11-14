/* SVT en mouvement : 1re, 2e et 3e années du collège.
   Même cadre que « Physique-Chimie en mouvement » (PC.chapter, PC.ui). */
(function () {
  'use strict';
  var PC = window.PC, ui = PC.ui, S = PC.S, h = PC.h, fmt = PC.fmt, clamp = PC.clamp, ease = PC.ease;
  var EY = '3<sup>e</sup> année · ';
  var APPRO = '<span class="appro" title="Hors du programme allégé 2023-2024">Approfondissement · تعمّق</span>';
  var T = 'var(--teal)', P = 'var(--pink)', C = 'var(--coral)', L = 'var(--lav)';
  var BLUE = '#6f8cff', RED = '#f27b60';
  function lerp(a, b, t) { return a + (b - a) * t; }
  function fm(x, d) { return fmt(x, d === undefined ? 1 : d); }

  /* suit une ligne brisée : renvoie le point à la proportion p (0..1) */
  function follower(pts) {
    var cum = [0], i, tot = 0;
    for (i = 1; i < pts.length; i++) { tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); cum.push(tot); }
    return {
      total: tot, cum: cum,
      at: function (p) {
        p = ((p % 1) + 1) % 1; var d = p * tot, k = 1;
        while (k < cum.length - 1 && cum[k] < d) k++;
        var a = pts[k - 1], b = pts[k], s = (d - cum[k - 1]) / ((cum[k] - cum[k - 1]) || 1);
        return { x: lerp(a[0], b[0], s), y: lerp(a[1], b[1], s) };
      },
      frac: function (k) { return cum[k] / tot; }
    };
  }
  function poly(pts) { return 'M' + pts.map(function (p) { return p[0] + ' ' + p[1]; }).join('L'); }
  function label(g, x, y, t, c, anchor, size) {
    return S('text', { x: x, y: y, 'class': 'note', text: t, style: 'fill:' + (c || '#fff') + ';text-anchor:' + (anchor || 'middle') + (size ? ';font-size:' + size + 'px' : '') }, g);
  }

  /* ===================================================== 1. DIGESTION */
  function trajet(el) {
    var svg = ui.stage(el, 400, 410, 'Le tube digestif : trajet d’une bouchée');
    var org = [
      { id: 'bouche', t: 'Bouche', c: P, d: 'On coupe et on broie les aliments (digestion mécanique). La salive contient l’amylase salivaire : elle commence à transformer l’amidon en maltose.' },
      { id: 'oeso', t: 'Œsophage', c: L, d: 'Un tube musclé qui pousse le bol alimentaire vers l’estomac par des contractions (péristaltisme).' },
      { id: 'estomac', t: 'Estomac', c: C, d: 'Le suc gastrique, acide, contient de l’acide chlorhydrique et une enzyme, la pepsine. Elle commence la digestion des protéines.' },
      { id: 'grele', t: 'Intestin grêle', c: T, d: 'La bile (fabriquée par le foie), le suc pancréatique et le suc intestinal achèvent la digestion. Les aliments deviennent des nutriments, qui passent dans le sang et la lymphe : c’est l’absorption intestinale.' },
      { id: 'gros', t: 'Gros intestin', c: '#e9b84a', d: 'Il absorbe surtout de l’eau. Les déchets non digérés forment les excréments (fèces), évacués par l’anus.' }
    ];
    var g0 = S('g', null, svg);
    var shapes = {};
    shapes.gros = S('path', { d: 'M290 345L290 232L125 232L125 345', fill: 'none', 'stroke-width': 20, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g0);
    shapes.grele = S('path', { d: poly([[215, 215], [170, 238], [250, 252], [160, 274], [250, 292], [165, 312], [240, 330]]), fill: 'none', 'stroke-width': 13, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g0);
    shapes.estomac = S('path', { d: 'M190 126C146 130 148 204 200 218C248 228 268 190 242 160C228 136 216 126 190 126Z', 'stroke-width': 3 }, g0);
    shapes.oeso = S('path', { d: 'M200 58L200 130', fill: 'none', 'stroke-width': 14, 'stroke-linecap': 'round' }, g0);
    shapes.bouche = S('ellipse', { cx: 200, cy: 40, rx: 36, ry: 20, 'stroke-width': 3 }, g0);
    S('path', { d: 'M125 345L150 378', fill: 'none', stroke: '#e9b84a', 'stroke-width': 16, 'stroke-linecap': 'round', opacity: .5 }, g0);
    label(g0, 262, 44, 'bouche', '#fff', 'start', 13); label(g0, 214, 96, 'œsophage', '#fff', 'start', 13);
    label(g0, 262, 172, 'estomac', '#fff', 'start', 13); label(g0, 296, 270, 'gros intestin', '#fff', 'start', 13);
    label(g0, 90, 276, 'intestin grêle', '#fff', 'end', 13); label(g0, 150, 400, 'anus', '#fff', 'middle', 13);
    var path = [[200, 40], [200, 130], [212, 175], [215, 215], [170, 238], [250, 252], [160, 274], [250, 292], [165, 312], [240, 330], [290, 345], [290, 232], [125, 232], [125, 345], [150, 380]];
    var f = follower(path);
    var bounds = [0, f.frac(1), f.frac(3), f.frac(9), f.frac(14), 1];
    var bolus = S('circle', { r: 9, style: 'fill:#fff;stroke:var(--pink);stroke-width:3' }, svg);
    var st = { p: 0, play: true, hold: -1 }, info = ui.info(el), chips = ui.chips(el);
    function oi(p) { var i = 0; while (i < 4 && p >= bounds[i + 1]) i++; return i; }
    function draw() {
      var pt = f.at(st.p), cur = oi(st.p);
      bolus.setAttribute('cx', pt.x); bolus.setAttribute('cy', pt.y);
      org.forEach(function (o, i) {
        var sh = shapes[o.id], on = i === cur;
        sh.setAttribute('style', 'stroke:' + o.c + ';fill:' + (sh.getAttribute('fill') === 'none' ? 'none' : o.c) + ';fill-opacity:' + (on ? .55 : .15) + ';stroke-opacity:' + (on ? 1 : .55));
        if (shapes[o.id].tagName === 'path' && (o.id === 'oeso' || o.id === 'gros' || o.id === 'grele')) sh.setAttribute('style', 'stroke:' + o.c + ';fill:none;stroke-opacity:' + (on ? 1 : .4));
      });
      info.set('<h4>' + org[cur].t + '</h4><p>' + org[cur].d + '</p>');
    }
    var ctl = ui.controls(el), pb = ui.btn(ctl, 'Pause', function () { st.play = !st.play; pb.textContent = st.play ? 'Pause' : 'Lecture'; });
    org.forEach(function (o, i) { ui.btn(ctl, o.t, function () { st.p = bounds[i] + .002; st.play = false; pb.textContent = 'Lecture'; draw(); }); });
    PC.anim(svg, function (dt) { if (st.play) { st.p = (st.p + dt * .045) % 1; draw(); } });
    draw();
    chips.set('<span class="chip plain">Durée réelle : de 24 à 72 h</span><span class="chip plain">Longueur du tube digestif : environ 8 m</span>');
  }

  function enzymes(el) {
    var chains = {
      amidon: { n: 'Amidon (glucide)', s: [['Aliment', 'Amidon', '#e9b84a'], ['Amylase (salive, suc pancréatique)', 'Maltose', P], ['Maltase (suc intestinal)', 'Glucose', T]], end: 'Le glucose est un nutriment : il passe dans le sang.' },
      prot: { n: 'Protéines', s: [['Aliment', 'Protéines', C], ['Pepsine (estomac), puis enzymes du suc pancréatique', 'Peptides', P], ['Enzymes du suc intestinal', 'Acides aminés', T]], end: 'Les acides aminés sont des nutriments : ils passent dans le sang.' },
      lip: { n: 'Lipides', s: [['Aliment', 'Gouttes de graisse', '#ffcf5c'], ['Bile : émulsion (fines gouttelettes)', 'Gouttelettes émulsionnées', P], ['Lipase (suc pancréatique)', 'Acides gras + glycérol', T]], end: 'Les acides gras et le glycérol passent surtout dans la lymphe.' }
    };
    var cur = 'amidon', k = 0;
    var svg = ui.stage(el, 400, 170, 'Les étapes de la digestion chimique'), g = S('g', null, svg), cap = h('p', { 'class': 'px-cap' });
    ui.tabs(el, [['amidon', 'Amidon'], ['prot', 'Protéines'], ['lip', 'Lipides']], function (v) { cur = v; k = 0; draw(); });
    el.appendChild(cap);
    var ctl = ui.controls(el), nb = ui.btn(ctl, 'Étape suivante', function () { var ch = chains[cur]; if (k >= ch.s.length - 1) { k = 0; } else k++; draw(); });
    function draw() {
      g.replaceChildren(); var ch = chains[cur];
      ch.s.forEach(function (s, i) {
        var x = 20 + i * 130, on = i <= k;
        S('rect', { x: x, y: 50, width: 110, height: 64, rx: 12, style: 'fill:' + s[2] + ';fill-opacity:' + (on ? .55 : .1) + ';stroke:' + s[2] + ';stroke-width:2' }, g);
        label(g, x + 55, 86, s[1], '#fff', 'middle', 12);
        if (i > 0) { S('path', { d: 'M' + (x - 18) + ' 82H' + (x - 2), 'class': 'ln', style: 'stroke:#fff;opacity:' + (on ? 1 : .3) }, g); S('path', { d: 'M' + (x - 8) + ' 76L' + (x - 2) + ' 82L' + (x - 8) + ' 88', 'class': 'ln', style: 'stroke:#fff;opacity:' + (on ? 1 : .3) }, g); }
      });
      cap.innerHTML = k === 0 ? 'Départ : <b>' + ch.n + '</b>.' : '<b>' + ch.s[k][0] + '</b> transforme en <b>' + ch.s[k][1] + '</b>.' + (k === ch.s.length - 1 ? ' ' + ch.end : '');
    }
    draw();
  }

  function villosites(el) {
    var svg = ui.stage(el, 400, 250, 'Une villosité intestinale et l’absorption'), g = S('g', null, svg);
    S('path', { d: 'M200 230C150 230 150 90 200 40C250 90 250 230 200 230Z', style: 'fill:var(--pink);fill-opacity:.15;stroke:var(--pink);stroke-width:3' }, g);
    S('path', { d: 'M185 220L185 70', fill: 'none', style: 'stroke:#6f8cff;stroke-width:6;stroke-linecap:round' }, g);
    S('path', { d: 'M215 220L215 60', fill: 'none', style: 'stroke:#ffcf5c;stroke-width:6;stroke-linecap:round' }, g);
    label(g, 120, 130, 'capillaire sanguin', '#6f8cff', 'end', 13); label(g, 280, 110, 'vaisseau lymphatique', '#ffcf5c', 'start', 13);
    label(g, 200, 244, 'villosité (paroi de l’intestin grêle)', '#fff', 'middle', 12);
    var dots = [], i;
    for (i = 0; i < 6; i++) dots.push({ c: S('circle', { r: 5, style: 'fill:var(--teal)' }, svg), kind: 0, o: i / 6 });
    for (i = 0; i < 4; i++) dots.push({ c: S('circle', { r: 5, style: 'fill:#ffcf5c' }, svg), kind: 1, o: i / 4 });
    var st = { t: 0 };
    PC.anim(svg, function (dt) {
      st.t += dt * .2;
      dots.forEach(function (d) {
        var p = (st.t + d.o) % 1, x0 = d.kind ? 262 : 138, x1 = d.kind ? 215 : 185, y = 40 + (1 - p) * 180;
        d.c.setAttribute('cx', lerp(x0, x1, clamp(p * 1.6, 0, 1))); d.c.setAttribute('cy', 100 + 120 * (1 - p));
      });
    });
    ui.chips(el).set('<span class="chip plain" style="border-color:var(--teal)">Glucose, acides aminés, eau, sels : vers le sang</span><span class="chip plain" style="border-color:#ffcf5c">Acides gras, glycérol : surtout vers la lymphe</span>');
  }

  PC.chapter({ id: 's3-1', lazy: true, eyebrow: EY + 'Nutrition', title: 'La digestion et l’absorption intestinale', ar: 'الهضم والامتصاص المعوي',
    lessons: function () { return [
      { short: 'Le trajet', title: 'Le trajet d’une bouchée', intro: 'Suis la bouchée dans le tube digestif. Choisis un organe pour lire son rôle.', build: trajet,
        retenir: ['Le tube digestif va de la bouche à l’anus : bouche, œsophage, estomac, intestin grêle, gros intestin.', 'La <b>digestion</b> transforme les aliments en <b>nutriments</b> assez petits pour passer dans le sang.'],
        ar: { e: ['الجهاز الهضمي أنبوب طويل يمرّ فيه الغذاء من الفم إلى الشرج. في كل عضو يحدث جزء من الهضم: ميكانيكي (مضغ، تقليب) وكيميائي (بواسطة الأنزيمات).', 'في الأمعاء الدقيقة ينتهي الهضم وتنتقل المغذّيات إلى الدم واللمف.'], u: 'يتحرك كتلة الطعام تلقائيًا. اضغط على اسم العضو لتنتقل إليه، أو اضغط «Pause» لإيقاف الحركة.', w: [['digestion', 'الهضم'], ['nutriment', 'مغذّي (مادة بسيطة قابلة للامتصاص)'], ['enzyme', 'أنزيم'], ['suc gastrique', 'العصير المعدي'], ['bile', 'الصفراء'], ['absorption intestinale', 'الامتصاص المعوي']] } },
      { short: 'Enzymes', title: 'Enzymes et nutriments', intro: 'Choisis un aliment et avance étape par étape : chaque enzyme coupe les grosses molécules.', build: enzymes,
        retenir: ['Amidon → maltose → <b>glucose</b>.', 'Protéines → peptides → <b>acides aminés</b>.', 'Lipides → (bile : émulsion) → <b>acides gras et glycérol</b>.', 'Les enzymes sont spécifiques : chacune agit sur un type d’aliment.'],
        ar: { e: ['الأنزيمات مواد تفكّك الجزيئات الكبيرة إلى جزيئات صغيرة. كل أنزيم متخصّص: الأميلاز يفكّك النشا، والببسين يفكّك البروتينات، واللّيباز يفكّك الدسم.', 'الصفراء لا تحتوي على أنزيمات، لكنها تُحوّل الدسم إلى قطيرات صغيرة (استحلاب) فيسهل عمل اللّيباز.'], u: 'اختر نوع الغذاء من الأعلى ثم اضغط «Étape suivante» لترى كل مرحلة.', w: [['amidon', 'النشا'], ['protéines', 'البروتينات'], ['lipides', 'الدهون (الدسم)'], ['glucose', 'الغلوكوز'], ['acides aminés', 'الأحماض الأمينية'], ['émulsion', 'استحلاب']] } },
      { short: 'Absorption', title: 'L’absorption intestinale', intro: 'Les nutriments traversent la paroi de l’intestin grêle grâce aux villosités.', build: villosites,
        retenir: ['La paroi de l’intestin grêle forme des <b>villosités</b> : elles augmentent beaucoup la surface d’échange.', 'Les nutriments passent dans les capillaires sanguins et dans les vaisseaux lymphatiques.'],
        ar: { e: ['جدار الأمعاء الدقيقة مغطّى بزغابات معوية كثيرة تزيد مساحة الامتصاص. تعبر المغذّيات جدار الزغابة إلى الشعيرات الدموية وإلى الأوعية اللمفاوية.'], w: [['villosité', 'زغابة معوية'], ['capillaire sanguin', 'شعيرة دموية'], ['lymphe', 'اللمف']] } }
    ]; },
    quiz: [
      { q: 'Quelle enzyme agit dans la bouche ?', o: ['La pepsine', 'L’amylase salivaire', 'La lipase'], a: 1, e: 'L’amylase salivaire commence la transformation de l’amidon en maltose.' },
      { q: 'La bile contient :', o: ['des enzymes qui digèrent les protéines', 'aucune enzyme : elle émulsionne les lipides', 'de l’acide chlorhydrique'], a: 1, e: 'La bile émulsionne les graisses en fines gouttelettes.' },
      { q: 'La digestion des protéines donne :', o: ['du glucose', 'des acides aminés', 'des acides gras'], a: 1, e: 'Protéines → peptides → acides aminés.' }
    ] });

  /* ===================================================== 2. RESPIRATION */
  function ventilation(el) {
    var svg = ui.stage(el, 400, 300, 'Ventilation : diaphragme et cage thoracique'), g = S('g', null, svg);
    var st = { fr: 16, phase: 0, t: 0, run: true };
    var cage = S('path', { fill: 'none', 'stroke-width': 4, style: 'stroke:#fff;stroke-opacity:.6' }, g);
    var lung = S('path', { style: 'fill:var(--pink);fill-opacity:.35;stroke:var(--pink);stroke-width:3' }, g);
    var dia = S('path', { fill: 'none', 'stroke-width': 7, 'stroke-linecap': 'round', style: 'stroke:var(--teal)' }, g);
    var air = S('path', { fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round', style: 'stroke:#fff' }, g);
    label(g, 200, 24, 'trachée', '#fff', 'middle', 13); label(g, 200, 290, 'diaphragme', T, 'middle', 13);
    S('path', { d: 'M200 36L200 84', style: 'stroke:#fff;stroke-width:8;stroke-linecap:round;opacity:.6', fill: 'none' }, g);
    var chips = ui.chips(el), verd = ui.verdict(el);
    function draw() {
      var e = (1 - Math.cos(st.phase * Math.PI * 2)) / 2; // 0 expiration .. 1 inspiration
      var w = 108 + 22 * e, top = 90 - 6 * e, bot = 230 + 8 * e - 26 * e * 0, dy = 36 * e;
      cage.setAttribute('d', 'M' + (200 - w - 14) + ' ' + top + 'Q' + (200 - w - 28) + ' 170 ' + (200 - w) + ' ' + (226 + 0) + 'M' + (200 + w + 14) + ' ' + top + 'Q' + (200 + w + 28) + ' 170 ' + (200 + w) + ' 226');
      lung.setAttribute('d', 'M200 90C' + (200 - w) + ' 84 ' + (200 - w - 4) + ' 190 ' + (200 - w + 10) + ' ' + (232 + dy * .0) + 'L' + (200 + w - 10) + ' ' + (232) + 'C' + (200 + w + 4) + ' 190 ' + (200 + w) + ' 84 200 90Z');
      dia.setAttribute('d', 'M' + (200 - w) + ' 232Q200 ' + (214 + 46 * e) + ' ' + (200 + w) + ' 232');
      lung.setAttribute('transform', 'translate(0 ' + (-6 * (1 - e)) + ')');
      var ay = 44 + (st.phase < .5 ? 1 : -1) * 0, dir = st.phase < .5 ? 1 : -1;
      air.setAttribute('d', 'M200 52L200 82M' + (190) + ' ' + (dir > 0 ? 70 : 62) + 'L200 ' + (dir > 0 ? 82 : 52) + 'L210 ' + (dir > 0 ? 70 : 62));
      verd.set(st.phase < .5 ? 'Inspiration : le diaphragme s’abaisse, les côtes se soulèvent, le volume du thorax augmente et l’air entre.' : 'Expiration : le diaphragme remonte, les côtes s’abaissent, le volume du thorax diminue et l’air sort.', st.phase < .5 ? 'ok' : 'flat');
      var vt = 0.5, q = st.fr * vt;
      chips.set('<span class="chip plain">Fréquence : <b>' + st.fr + '</b> mouvements / min</span><span class="chip plain">Volume courant : <b>0,5 L</b></span><span class="chip plain">Débit ventilatoire : <b>' + fm(q, 1) + ' L/min</b></span>');
    }
    ui.slider(el, { label: 'Fréquence respiratoire', min: 10, max: 40, value: 16, fmt: function (v) { return v + ' / min'; } }, function (v) { st.fr = v; draw(); });
    var ctl = ui.controls(el), pb = ui.btn(ctl, 'Pause', function () { st.run = !st.run; pb.textContent = st.run ? 'Pause' : 'Lecture'; });
    PC.anim(svg, function (dt) { if (st.run) { st.phase = (st.phase + dt * st.fr / 60) % 1; draw(); } });
    draw();
  }

  function echanges(el) {
    var svg = ui.stage(el, 400, 250, 'Échanges gazeux entre l’alvéole pulmonaire et le sang'), g = S('g', null, svg);
    S('circle', { cx: 120, cy: 125, r: 85, style: 'fill:var(--pink);fill-opacity:.12;stroke:var(--pink);stroke-width:3' }, g);
    S('path', { d: 'M205 70C260 70 300 180 360 180', fill: 'none', style: 'stroke:#6f8cff;stroke-width:22;stroke-linecap:round;opacity:.35' }, g);
    S('path', { d: 'M205 70C260 70 300 180 360 180', fill: 'none', style: 'stroke:#6f8cff;stroke-width:3;stroke-dasharray:5 6;opacity:.8' }, g);
    label(g, 120, 130, 'alvéole', P, 'middle', 14); label(g, 300, 120, 'capillaire', '#6f8cff', 'middle', 14);
    var parts = [], i;
    for (i = 0; i < 5; i++) parts.push({ el: S('circle', { r: 6, style: 'fill:var(--teal)' }, svg), o2: true, o: i / 5 });
    for (i = 0; i < 4; i++) parts.push({ el: S('circle', { r: 6, style: 'fill:var(--coral)' }, svg), o2: false, o: i / 4 });
    var t = 0;
    PC.anim(svg, function (dt) {
      t += dt * .35;
      parts.forEach(function (p) {
        var s = (t + p.o) % 1, a = ease(clamp(s * 1.4, 0, 1));
        var A = p.o2 ? [150 + 20 * Math.sin(p.o * 9), 110 + 30 * Math.cos(p.o * 7)] : [215, 82], B = p.o2 ? [215, 82] : [150 + 20 * Math.sin(p.o * 9), 110 + 30 * Math.cos(p.o * 7)];
        p.el.setAttribute('cx', lerp(A[0], B[0], a)); p.el.setAttribute('cy', lerp(A[1], B[1], a));
      });
    });
    S('circle', { cx: 24, cy: 200, r: 6, style: 'fill:var(--teal)' }, svg); label(svg, 36, 204, 'dioxygène O₂ : de l’alvéole vers le sang', '#fff', 'start', 12);
    S('circle', { cx: 24, cy: 226, r: 6, style: 'fill:var(--coral)' }, svg); label(svg, 36, 230, 'dioxyde de carbone CO₂ : du sang vers l’alvéole', '#fff', 'start', 12);
    var box = h('div', { 'class': 'scroll-x' }, '<table class="tbl"><tr><th></th><th>O₂</th><th>CO₂</th></tr><tr><th>Air inspiré</th><td>≈ 21 %</td><td>≈ 0,04 %</td></tr><tr><th>Air expiré</th><td>≈ 16 %</td><td>≈ 4 %</td></tr></table>');
    el.appendChild(box); ui.text(el, 'Valeurs approximatives : l’air expiré contient moins de O₂ et beaucoup plus de CO₂ que l’air inspiré. Le diazote (≈ 78 %) ne change presque pas.', 'px-cap');
  }

  PC.chapter({ id: 's3-2', lazy: true, eyebrow: EY + 'Nutrition', title: 'La respiration chez l’Homme', ar: 'التنفّس عند الإنسان',
    lessons: function () { return [
      { short: 'Ventilation', title: 'Les mouvements respiratoires', intro: 'Observe le thorax. Change la fréquence respiratoire et lis le débit ventilatoire.', build: ventilation,
        retenir: ['À l’inspiration, le diaphragme s’abaisse et les côtes se soulèvent : le volume du thorax augmente.', 'À l’expiration, le diaphragme remonte et les côtes s’abaissent.', 'Débit ventilatoire = fréquence × volume courant.'],
        ar: { e: ['عند الشهيق ينخفض الحجاب الحاجز وترتفع الأضلاع فيزداد حجم القفص الصدري ويدخل الهواء. عند الزفير يرتفع الحجاب وتنخفض الأضلاع فيقلّ الحجم ويخرج الهواء.', 'التدفّق التهويّ = عدد الحركات التنفسية في الدقيقة × الحجم الجاري.'], u: 'حرّك المنزلق لتغيير عدد مرات التنفس في الدقيقة وشاهد التدفّق التهويّ.', w: [['inspiration', 'شهيق'], ['expiration', 'زفير'], ['diaphragme', 'الحجاب الحاجز'], ['volume courant', 'الحجم الجاري'], ['fréquence respiratoire', 'التواتر التنفسي']] } },
      { short: 'Échanges gazeux', title: 'Les échanges gazeux', intro: 'Dans l’alvéole, le dioxygène passe vers le sang et le dioxyde de carbone en sort.', build: echanges,
        retenir: ['Les échanges se font entre l’air des <b>alvéoles</b> et le sang des capillaires.', 'Le sang <b>gagne du O₂</b> et <b>perd du CO₂</b>.'],
        ar: { e: ['في الحويصلات الرئوية يعبر غاز الأوكسجين من الهواء إلى الدم، ويعبر غاز ثنائي أكسيد الكربون من الدم إلى الهواء. لذلك يحتوي هواء الزفير على أوكسجين أقل وثنائي أكسيد كربون أكثر.'], w: [['alvéole pulmonaire', 'حويصلة رئوية'], ['dioxygène', 'ثنائي الأوكسجين'], ['dioxyde de carbone', 'ثنائي أكسيد الكربون'], ['capillaire', 'شعيرة دموية']] } }
    ]; },
    quiz: [
      { q: 'À l’inspiration, le diaphragme :', o: ['remonte', 's’abaisse', 'ne bouge pas'], a: 1, e: 'Il s’abaisse et le volume du thorax augmente.' },
      { q: 'L’air expiré contient, par rapport à l’air inspiré :', o: ['plus de O₂ et moins de CO₂', 'moins de O₂ et plus de CO₂', 'autant de O₂ et de CO₂'], a: 1, e: 'Le sang a pris du O₂ et rejeté du CO₂.' },
      { q: 'Un débit ventilatoire de 8 L/min avec un volume courant de 0,5 L correspond à une fréquence de :', o: ['4 par min', '16 par min', '40 par min'], a: 1, e: '8 ÷ 0,5 = 16.' }
    ] });

  /* ===================================================== 3. CIRCULATION */
  function sang(el) {
    var svg = ui.stage(el, 400, 270, 'Composition du sang après centrifugation'), g = S('g', null, svg);
    var st = { p: 0, busy: false };
    var cells = [], i, tx = 150, tw = 70, ty = 24, th = 220;
    S('rect', { x: tx, y: ty, width: tw, height: th, rx: 14, style: 'fill:none;stroke:#fff;stroke-width:3;opacity:.7' }, g);
    var plasma = S('rect', { x: tx + 3, y: ty + 3, width: tw - 6, height: th - 6, rx: 11, style: 'fill:#ffcf5c;fill-opacity:.25' }, g);
    var white = S('rect', { x: tx + 3, width: tw - 6, height: 5, style: 'fill:#fff' }, g);
    var red = S('rect', { x: tx + 3, width: tw - 6, rx: 6, style: 'fill:var(--coral);fill-opacity:.8' }, g);
    var seed = [];
    for (i = 0; i < 40; i++) seed.push({ x: tx + 12 + Math.random() * (tw - 24), y: ty + 14 + Math.random() * (th - 28), c: S('circle', { r: 4, style: 'fill:' + (i % 14 === 0 ? '#fff' : 'var(--coral)') }, g), w: i % 14 === 0 });
    var lbl = [label(g, 250, 90, 'plasma', '#ffcf5c', 'start', 14), label(g, 250, 190, 'globules rouges', C, 'start', 14), label(g, 250, 168, 'globules blancs, plaquettes', '#fff', 'start', 12)];
    var chips = ui.chips(el);
    function draw() {
      var e = ease(st.p), redTop = lerp(ty + 20, ty + th - 3 - 0.45 * (th - 6), e), whiteY = redTop - 5;
      red.setAttribute('y', redTop); red.setAttribute('height', ty + th - 3 - redTop);
      white.setAttribute('y', whiteY); white.setAttribute('opacity', e);
      seed.forEach(function (s) {
        var ny = s.w ? whiteY + 2 : lerp(s.y, redTop + 6 + (s.y - ty) / th * (ty + th - 10 - redTop - 6), e);
        s.c.setAttribute('cx', s.x); s.c.setAttribute('cy', ny);
      });
      lbl[0].setAttribute('y', ty + 60); lbl[1].setAttribute('y', (redTop + ty + th) / 2); lbl[2].setAttribute('y', whiteY - 6); lbl[2].setAttribute('opacity', e);
      chips.set(e > .95 ? '<span class="chip plain">Plasma ≈ 55 %</span><span class="chip plain">Globules rouges ≈ 45 %</span><span class="chip plain">Globules blancs et plaquettes : moins de 1 %</span>' : '<span class="chip plain">Sang total : mélange de cellules dans le plasma</span>');
    }
    var ctl = ui.controls(el), b = ui.btn(ctl, 'Centrifuger', function () {
      if (st.busy) return; st.busy = true; var from = st.p, to = from > .5 ? 0 : 1;
      PC.run(1800, function (p) { st.p = lerp(from, to, p); draw(); }, function () { st.busy = false; b.textContent = to ? 'Remélanger' : 'Centrifuger'; });
    });
    draw();
  }

  function coeur(el) {
    var svg = ui.stage(el, 400, 300, 'Le cœur et la double circulation'), g = S('g', null, svg);
    var st = { mode: 'both', bpm: 70, t: 0 };
    // chambres : OD (gauche de l'image), VD, OG, VG (schéma vu de face : cœur droit à gauche)
    function room(x, y, w, hh, name, col) { S('rect', { x: x, y: y, width: w, height: hh, rx: 16, style: 'fill:' + col + ';fill-opacity:.25;stroke:' + col + ';stroke-width:3' }, g); label(g, x + w / 2, y + hh / 2 + 4, name, '#fff', 'middle', 13); }
    room(130, 110, 60, 50, 'OD', BLUE); room(130, 170, 60, 70, 'VD', BLUE); room(210, 110, 60, 50, 'OG', RED); room(210, 170, 60, 70, 'VG', RED);
    label(g, 200, 262, 'cœur (vu de face)', '#aaa3bf', 'middle', 12);
    // circuits
    var petit = [[160, 170], [100, 150], [70, 70], [60, 30], [120, 30], [240, 30], [330, 30], [330, 70], [260, 110]];
    // petite circulation : VD -> poumons (haut) -> OG (sens: du bas du VD vers poumons puis OG)
    petit = [[160, 240], [160, 280], [40, 280], [40, 60], [100, 38], [180, 38], [330, 38], [350, 60], [250, 120], [240, 135]];
    var grande = [[240, 240], [240, 285], [380, 285], [380, 150], [330, 90], [260, 90], [200, 90], [160, 95], [160, 110], [160, 135]];
    // simplification : chemins lisibles
    petit = [[150, 190], [90, 190], [60, 150], [60, 60], [120, 36], [300, 36], [345, 60], [290, 120], [250, 135]];
    grande = [[250, 200], [330, 200], [360, 240], [350, 285], [60, 285], [40, 240], [60, 200], [100, 120], [160, 135]];
    var fP = follower(petit), fG = follower(grande);
    function pathEl(pts, col) { return S('path', { d: poly(pts), fill: 'none', style: 'stroke:' + col + ';stroke-width:8;stroke-linecap:round;stroke-linejoin:round;opacity:.22' }, g); }
    var pg = S('path', { d: poly(petit.slice(0, 5)), fill: 'none', style: 'stroke:' + BLUE + ';stroke-width:8;opacity:.22' }, g); pg.remove();
    pathEl(petit.slice(0, 5), BLUE); pathEl(petit.slice(4), RED); pathEl(grande.slice(0, 5), RED); pathEl(grande.slice(4), BLUE);
    label(g, 205, 24, 'poumons', P, 'middle', 13); label(g, 205, 300, 'organes', C, 'middle', 13);
    var dots = [], i;
    for (i = 0; i < 10; i++) { dots.push({ f: fP, o: i / 10, grand: false, el: S('circle', { r: 5 }, svg) }); dots.push({ f: fG, o: i / 10, grand: true, el: S('circle', { r: 5 }, svg) }); }
    var chips = ui.chips(el), info = ui.info(el);
    ui.tabs(el, [['both', 'Les deux'], ['petit', 'Petite circulation'], ['grand', 'Grande circulation']], function (v) { st.mode = v; draw(); });
    ui.slider(el, { label: 'Fréquence cardiaque', min: 50, max: 180, value: 70, fmt: function (v) { return v + ' battements/min'; } }, function (v) { st.bpm = v; draw(); });
    function draw() {
      var q = st.bpm * 70 / 1000;
      chips.set('<span class="chip plain">Volume d’éjection : <b>≈ 70 mL</b></span><span class="chip plain">Débit cardiaque : <b>' + fm(q, 1) + ' L/min</b></span>');
      info.set(st.mode === 'petit' ? '<h4>Petite circulation</h4><p>Cœur droit → poumons → cœur gauche. Le sang chargé de CO₂ (bleu) devient riche en O₂ (rouge).</p>' : (st.mode === 'grand' ? '<h4>Grande circulation</h4><p>Cœur gauche → organes → cœur droit. Le sang riche en O₂ (rouge) cède son O₂ aux organes.</p>' : '<h4>Double circulation</h4><p>Le sang passe deux fois par le cœur : c’est une circulation <b>double</b> et <b>fermée</b>. Le sang rouge est riche en O₂, le sang bleu est riche en CO₂.</p>'));
    }
    PC.anim(svg, function (dt) {
      st.t += dt * st.bpm / 60 * .12;
      dots.forEach(function (d) {
        var on = st.mode === 'both' || (st.mode === 'petit' && !d.grand) || (st.mode === 'grand' && d.grand);
        d.el.style.display = on ? '' : 'none'; if (!on) return;
        var p = (st.t + d.o) % 1, pt = d.f.at(p);
        var blue = d.grand ? p > .5 : p < .5;
        d.el.setAttribute('cx', pt.x); d.el.setAttribute('cy', pt.y); d.el.style.fill = blue ? BLUE : RED;
      });
    });
    draw();
  }

  PC.chapter({ id: 's3-3', lazy: true, eyebrow: EY + 'Nutrition', title: 'Le sang et la circulation sanguine', ar: 'الدم والدورة الدموية',
    lessons: function () { return [
      { short: 'Le sang', title: 'La composition du sang', intro: 'Centrifuge le sang pour séparer ses constituants.', build: sang,
        retenir: ['Le sang contient du <b>plasma</b> et des cellules : globules rouges, globules blancs et plaquettes.', 'Les globules rouges transportent le dioxygène, les globules blancs défendent l’organisme, les plaquettes participent à la coagulation.'],
        ar: { e: ['الدم سائل يتكوّن من البلازما والخلايا الدموية: الكريات الحمراء تنقل الأوكسجين، الكريات البيضاء تدافع عن الجسم، والصفائح الدموية تساهم في التخثّر.'], u: 'اضغط «Centrifuger» لفصل مكوّنات الدم كما يحدث في المختبر.', w: [['plasma', 'البلازما'], ['globule rouge', 'كرية حمراء'], ['globule blanc', 'كرية بيضاء'], ['plaquette', 'صفيحة دموية'], ['centrifugation', 'الطرد المركزي']] } },
      { label: 'Leçon 2 · ' + APPRO, short: 'Cœur', title: 'Le cœur et la double circulation', intro: 'Suis le sang dans la petite et la grande circulation. Change la fréquence cardiaque.', build: coeur,
        retenir: ['Le cœur a quatre cavités : deux oreillettes et deux ventricules.', '<b>Petite circulation</b> : cœur droit → poumons → cœur gauche.', '<b>Grande circulation</b> : cœur gauche → organes → cœur droit.', 'Débit cardiaque = fréquence cardiaque × volume d’éjection systolique.'],
        ar: { e: ['للقلب أربع حجرات: أذينان وبُطينان. الدورة الدموية عند الإنسان مزدوجة ومغلقة: الدورة الصغرى (القلب الأيمن ← الرئتان ← القلب الأيسر) والدورة الكبرى (القلب الأيسر ← الأعضاء ← القلب الأيمن).', 'التدفّق القلبي = التواتر القلبي × حجم الدفع الانقباضي.'], u: 'اختر نوع الدورة من الأعلى. حرّك المنزلق لتغيير عدد نبضات القلب وشاهد التدفّق القلبي.', w: [['oreillette', 'أذين'], ['ventricule', 'بطين'], ['artère', 'شريان'], ['veine', 'وريد'], ['débit cardiaque', 'التدفّق القلبي'], ['fréquence cardiaque', 'التواتر القلبي']] } }
    ]; },
    quiz: [
      { q: 'Quelles cellules transportent le dioxygène ?', o: ['Les globules blancs', 'Les globules rouges', 'Les plaquettes'], a: 1, e: 'Les globules rouges contiennent l’hémoglobine.' },
      { q: 'La petite circulation relie :', o: ['le cœur gauche aux organes', 'le cœur droit aux poumons puis au cœur gauche', 'les poumons aux reins'], a: 1, e: 'Cœur droit → poumons → cœur gauche.' },
      { q: 'À 70 battements/min avec 70 mL par battement, le débit cardiaque est :', o: ['4,9 L/min', '49 L/min', '0,49 L/min'], a: 0, e: '70 × 70 = 4 900 mL/min = 4,9 L/min.' }
    ] });

  /* ===================================================== 4. EXCRETION */
  function appareil(el) {
    var svg = ui.stage(el, 400, 310, 'L’appareil urinaire'), g = S('g', null, svg);
    function kid(x, side) {
      S('ellipse', { cx: x, cy: 112, rx: 24, ry: 44, transform: 'rotate(' + (side * 10) + ' ' + x + ' 112)', style: 'fill:var(--coral);fill-opacity:.35;stroke:var(--coral);stroke-width:3' }, g);
      S('circle', { cx: x + side * 22, cy: 118, r: 8, style: 'fill:var(--bg);stroke:var(--coral);stroke-width:2' }, g);
    }
    kid(150, 1); kid(250, -1);
    S('path', { d: 'M156 120L190 220M244 120L210 220', fill: 'none', style: 'stroke:var(--lav);stroke-width:5;stroke-linecap:round' }, g);
    S('ellipse', { cx: 200, cy: 240, rx: 34, ry: 28, style: 'fill:#ffcf5c;fill-opacity:.25;stroke:#ffcf5c;stroke-width:3' }, g);
    S('path', { d: 'M200 268L200 300', fill: 'none', style: 'stroke:#ffcf5c;stroke-width:6;stroke-linecap:round' }, g);
    label(g, 108, 112, 'rein', C, 'end', 14); label(g, 292, 112, 'rein', C, 'start', 14); label(g, 112, 190, 'uretère', L, 'end', 13);
    label(g, 250, 244, 'vessie', '#ffcf5c', 'start', 14); label(g, 214, 296, 'urètre', '#ffcf5c', 'start', 13);
    S('path', { d: 'M200 20L200 110', fill: 'none', style: 'stroke:' + RED + ';stroke-width:5;opacity:.5' }, g); label(g, 206, 34, 'artère rénale : sang riche en urée', RED, 'start', 11);
    var drops = [], i;
    for (i = 0; i < 6; i++) drops.push({ el: S('circle', { r: 4, style: 'fill:#ffcf5c' }, svg), o: i / 6, side: i % 2 });
    var t = 0;
    PC.anim(svg, function (dt) {
      t += dt * .22;
      drops.forEach(function (d) {
        var p = (t + d.o) % 1, a = d.side ? [244, 120] : [156, 120], b = [200, 220];
        var x, y;
        if (p < .6) { var s = p / .6; x = lerp(a[0], b[0], s); y = lerp(a[1], b[1], s); } else { x = 200; y = lerp(220, 262, (p - .6) / .4); }
        d.el.setAttribute('cx', x); d.el.setAttribute('cy', y);
      });
    });
    ui.chips(el).set('<span class="chip plain">Les reins filtrent le sang</span><span class="chip plain">L’urine descend par les uretères, s’accumule dans la vessie, puis sort par l’urètre</span>');
  }
  function urine(el) {
    var st = { eau: 1.5, sueur: 0 }, bars = h('div'), chips = ui.chips(el);
    var rows = [['Eau', '90 à 96 %', '≈ 91 %', 'g'], ['Urée', '0,3 g/L', '≈ 20 g/L', 'u'], ['Glucose', '≈ 1 g/L', '0 g/L', 'g'], ['Protéines', '≈ 70 g/L', '0 g/L', 'p']];
    var box = h('div', { 'class': 'scroll-x' }, '<table class="tbl"><tr><th></th><th>Plasma</th><th>Urine normale</th></tr><tr><th>Urée</th><td>0,3 g/L</td><td>≈ 20 g/L</td></tr><tr><th>Glucose</th><td>≈ 1 g/L</td><td>0 g/L</td></tr><tr><th>Protéines</th><td>≈ 70 g/L</td><td>0 g/L</td></tr></table>');
    el.appendChild(box);
    ui.text(el, 'Valeurs indicatives. L’urée est très concentrée dans l’urine : le rein <b>élimine</b> les déchets. Glucose et protéines n’apparaissent normalement pas dans l’urine.', 'px-cap');
    var svg = ui.stage(el, 400, 130, 'Volume d’urine selon l’eau bue'), g = S('g', null, svg);
    function draw() {
      g.replaceChildren();
      var vol = clamp(0.6 + (st.eau - 0.5) * 0.7 - st.sueur * 0.004, 0.3, 3), conc = 20 * 1.5 / Math.max(.4, vol);
      S('rect', { x: 40, y: 40, width: 320, height: 22, rx: 11, style: 'fill:var(--surface-2)' }, g);
      S('rect', { x: 40, y: 40, width: 320 * clamp(vol / 3, 0, 1), height: 22, rx: 11, style: 'fill:#ffcf5c;fill-opacity:.8' }, g);
      label(g, 200, 30, 'volume d’urine par jour ≈ ' + fm(vol, 1) + ' L', '#fff', 'middle', 13);
      S('rect', { x: 40, y: 92, width: 320, height: 22, rx: 11, style: 'fill:var(--surface-2)' }, g);
      S('rect', { x: 40, y: 92, width: 320 * clamp(conc / 70, 0, 1), height: 22, rx: 11, style: 'fill:var(--coral);fill-opacity:.8' }, g);
      label(g, 200, 84, 'concentration de l’urine ≈ ' + fm(conc, 0) + ' g/L d’urée', '#fff', 'middle', 13);
      chips.set(st.eau > 2.2 ? '<span class="chip plain">Urine abondante et diluée</span>' : (st.eau < 1 || st.sueur > 20 ? '<span class="chip plain">Urine peu abondante et concentrée</span>' : '<span class="chip plain">Urine normale</span>'));
    }
    ui.slider(el, { label: 'Eau bue par jour', min: 0.5, max: 3, step: 0.1, value: 1.5, fmt: function (v) { return fm(v, 1) + ' L'; } }, function (v) { st.eau = v; draw(); });
    ui.slider(el, { label: 'Transpiration (effort, chaleur)', min: 0, max: 60, step: 5, value: 0, fmt: function (v) { return v + ' %'; } }, function (v) { st.sueur = v; draw(); });
    ui.text(el, 'Le modèle est qualitatif : le rein ajuste le volume et la concentration pour garder l’eau du corps constante.', 'px-cap');
    draw();
  }
  PC.chapter({ id: 's3-4', lazy: true, eyebrow: EY + 'Nutrition · ' + APPRO, title: 'L’excrétion urinaire chez l’Homme', ar: 'الإبراز البولي عند الإنسان',
    lessons: function () { return [
      { short: 'Appareil urinaire', title: 'L’appareil urinaire', intro: 'Suis le trajet de l’urine, du rein jusqu’à l’extérieur.', build: appareil,
        retenir: ['L’appareil urinaire comprend : deux reins, deux uretères, la vessie et l’urètre.', 'Le sang arrive au rein par l’<b>artère rénale</b> et repart par la <b>veine rénale</b>, appauvri en urée.'],
        ar: { e: ['يتكوّن الجهاز البولي من كليتين وحالبين ومثانة ومجرى البول. تُصفّي الكلية الدم فتُطرح الفضلات في البول: يصل الدم إلى الكلية عبر الشريان الكلوي غنيًا باليوريا ويغادرها عبر الوريد الكلوي فقيرًا باليوريا.'], w: [['rein', 'كلية'], ['uretère', 'حالب'], ['vessie', 'مثانة'], ['urètre', 'مجرى البول'], ['urée', 'اليوريا'], ['excrétion', 'إطراح']] } },
      { short: 'Urine', title: 'Composition de l’urine', intro: 'Compare le plasma et l’urine. Fais varier l’eau bue.', build: urine,
        retenir: ['L’urine contient de l’eau, de l’<b>urée</b> et des sels minéraux.', 'Normalement, l’urine ne contient ni glucose ni protéines.', 'Le rein maintient la composition du sang et l’équilibre en eau.'],
        ar: { e: ['البول يحتوي على الماء واليوريا والأملاح المعدنية. في الحالة العادية لا يحتوي على الغلوكوز ولا على البروتينات. وجود الغلوكوز في البول يدلّ على مرض السكري، ووجود البروتينات يدلّ على خلل في الكلية.'], w: [['urine', 'البول'], ['plasma', 'البلازما'], ['glucose', 'الغلوكوز'], ['protéines', 'البروتينات'], ['glycosurie', 'وجود الغلوكوز في البول']] } }
    ]; },
    quiz: [
      { q: 'Quel organe filtre le sang et fabrique l’urine ?', o: ['La vessie', 'Le rein', 'Le foie'], a: 1, e: 'Le rein filtre le sang et forme l’urine.' },
      { q: 'Le sang qui sort du rein par la veine rénale est :', o: ['plus riche en urée', 'plus pauvre en urée', 'sans eau'], a: 1, e: 'Le rein a éliminé une partie de l’urée.' },
      { q: 'La présence de glucose dans l’urine est :', o: ['normale', 'anormale', 'toujours due à une infection'], a: 1, e: 'Elle peut indiquer un diabète.' }
    ] });

  /* ===================================================== 5. IMMUNITE */
  function phago(el) {
    var steps = ['Un microbe pénètre dans l’organisme.', 'Le phagocyte détecte le microbe et s’en approche.', 'Il l’entoure avec ses prolongements (pseudopodes) : c’est l’ingestion.', 'Le microbe est enfermé dans une vacuole.', 'Il est digéré : le phagocyte l’a détruit.'];
    var svg = ui.stage(el, 400, 220, 'Phagocytose d’un microbe'), g = S('g', null, svg), k = 0, cap = h('p', { 'class': 'px-cap' });
    el.appendChild(cap);
    function draw() {
      g.replaceChildren();
      var px = 200, py = 110, mx = [330, 250, 215, 200, 200][k], my = [60, 100, 108, 110, 110][k];
      var spread = [0, 0, 1, 1, 1][k];
      S('circle', { cx: px, cy: py, r: 52, style: 'fill:#fff;fill-opacity:.12;stroke:#fff;stroke-width:3' }, g);
      S('circle', { cx: px - 12, cy: py - 8, r: 16, style: 'fill:var(--lav);fill-opacity:.7' }, g);
      label(g, px, py + 78, 'phagocyte', '#fff', 'middle', 13);
      if (spread) { S('path', { d: 'M165 70C190 50 230 50 245 75M165 150C190 170 230 170 245 145', fill: 'none', style: 'stroke:#fff;stroke-width:5;stroke-linecap:round;opacity:.8' }, g); }
      if (k < 4) { S('path', { d: 'M' + (mx - 8) + ' ' + my + 'l16 0M' + mx + ' ' + (my - 8) + 'l0 16', style: 'stroke:var(--coral);stroke-width:3;opacity:.0' }, g); }
      S('ellipse', { cx: mx, cy: my, rx: k === 4 ? 6 : 14, ry: k === 4 ? 4 : 9, style: 'fill:var(--coral);fill-opacity:' + (k === 4 ? .35 : .9) }, g);
      if (k === 3) S('circle', { cx: mx, cy: my, r: 20, style: 'fill:none;stroke:var(--teal);stroke-width:3;stroke-dasharray:4 4' }, g);
      label(g, 330, 40, 'microbe', C, 'middle', 13);
      cap.innerHTML = '<b>Étape ' + (k + 1) + ' / 5.</b> ' + steps[k];
    }
    var ctl = ui.controls(el); ui.btn(ctl, 'Étape suivante', function () { k = (k + 1) % 5; draw(); });
    draw();
  }
  function anticorps(el) {
    var ag = [{ n: 'Antigène 1', s: 'tri', c: C }, { n: 'Antigène 2', s: 'sq', c: T }, { n: 'Antigène 3', s: 'ci', c: P }];
    var ab = ag.map(function (a) { return a.s; }), order = PC.shuffle([0, 1, 2]);
    var svg = ui.stage(el, 400, 200, 'Complémentarité entre un antigène et un anticorps'), g = S('g', null, svg), sel = 0, picked = null, fb = ui.verdict(el);
    function shape(s, x, y, c, inv, op) {
      var st = 'fill:' + c + ';fill-opacity:' + (op || .55) + ';stroke:' + c + ';stroke-width:3';
      if (s === 'tri') return S('path', { d: inv ? 'M' + (x - 24) + ' ' + (y + 24) + 'L' + x + ' ' + (y - 22) + 'L' + (x + 24) + ' ' + (y + 24) + 'Z' : 'M' + (x - 24) + ' ' + (y - 24) + 'L' + (x + 24) + ' ' + (y - 24) + 'L' + x + ' ' + (y + 22) + 'Z', style: st }, g);
      if (s === 'sq') return S('rect', { x: x - 20, y: y - 20, width: 40, height: 40, rx: 4, style: st }, g);
      return S('circle', { cx: x, cy: y, r: 22, style: st }, g);
    }
    function draw() {
      g.replaceChildren();
      label(g, 70, 28, 'Antigène', '#fff', 'middle', 13); shape(ag[sel].s, 70, 90, ag[sel].c, false, .9);
      label(g, 70, 150, ag[sel].n, ag[sel].c, 'middle', 12);
      label(g, 270, 28, 'Choisis l’anticorps complémentaire', '#fff', 'middle', 13);
      order.forEach(function (idx, i) {
        var x = 190 + i * 70; var a = ag[idx];
        var s = shape(a.s, x + 15, 100, 'var(--lav)', true, picked === idx ? .95 : .45); s.style.cursor = 'pointer'; s.setAttribute('tabindex', '0'); s.setAttribute('role', 'button'); s.setAttribute('aria-label', 'Anticorps ' + (i + 1));
        function pick() { picked = idx; var ok = idx === sel; fb.set(ok ? 'Exact : l’anticorps s’ajuste à l’antigène, comme une clé dans une serrure.' : 'Non : cet anticorps ne s’ajuste pas à cet antigène.', ok ? 'ok' : 'bad'); draw(); }
        s.addEventListener('click', pick); s.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      });
      if (picked !== null && picked === sel) { S('path', { d: 'M96 90L176 100', style: 'stroke:var(--teal);stroke-width:3;stroke-dasharray:4 4' }, g); }
    }
    var ctl = ui.controls(el); ui.btn(ctl, 'Autre antigène', function () { sel = (sel + 1) % 3; picked = null; order = PC.shuffle([0, 1, 2]); fb.set('', ''); draw(); });
    draw();
  }
  function vaccin(el) {
    var svg = ui.stage(el, 400, 240, 'Concentration d’anticorps après une injection'), g = S('g', null, svg);
    var st = { two: true };
    ui.tabs(el, [[true, 'Deux injections (vaccin + rappel)'], [false, 'Une injection']], function (v) { st.two = v; draw(); });
    var chips = ui.chips(el);
    function curve(day, t0, peak, rise, decay) { if (day < t0) return 0; var d = day - t0; return peak * (1 - Math.exp(-d / rise)) * Math.exp(-d / decay); }
    function draw() {
      g.replaceChildren();
      S('path', { d: 'M40 200H380M40 200V30', 'class': 'ln', style: 'stroke:#fff;opacity:.6' }, g);
      label(g, 210, 232, 'temps (jours)', '#fff', 'middle', 12); label(g, 14, 120, 'anticorps', '#fff', 'middle', 12).setAttribute('transform', 'rotate(-90 14 120)');
      var pts = [], x;
      for (x = 0; x <= 340; x += 4) {
        var day = x / 340 * 60, v = curve(day, 0, 28 * 2.6, 6, 9) + (st.two ? curve(day, 28, 150 * 1.9, 3, 18) : 0);
        pts.push([40 + x, 200 - v]);
      }
      S('path', { d: poly(pts), fill: 'none', style: 'stroke:var(--teal);stroke-width:4;stroke-linejoin:round' }, g);
      [0].concat(st.two ? [28] : []).forEach(function (d, i) { var xx = 40 + d / 60 * 340; S('path', { d: 'M' + xx + ' 200V190', style: 'stroke:var(--pink);stroke-width:3' }, g); label(g, xx, 184, i ? '2e injection' : '1re injection', P, 'middle', 11); });
      chips.set(st.two ? '<span class="chip plain">Réponse secondaire : plus rapide, plus forte, plus durable</span>' : '<span class="chip plain">Réponse primaire : lente et faible</span>');
    }
    draw();
    ui.text(el, 'Courbe schématique (qualitative). La mémoire immunitaire explique pourquoi le rappel est plus efficace.', 'px-cap');
  }
  PC.chapter({ id: 's3-5', lazy: true, eyebrow: EY + 'Santé', title: 'L’immunité', ar: 'المناعة',
    lessons: function () { return [
      { short: 'Phagocytose', title: 'Les défenses de l’organisme', intro: 'Observe comment un phagocyte détruit un microbe.', build: phago,
        retenir: ['La peau et les muqueuses sont des barrières naturelles.', 'Les <b>phagocytes</b> (globules blancs) ingèrent et digèrent les microbes : c’est la <b>phagocytose</b>.'],
        ar: { e: ['الجلد والأغشية المخاطية حواجز طبيعية تمنع دخول الجراثيم. إذا دخل ميكروب إلى الجسم تلتهمه الخلايا البلعمية (نوع من الكريات البيضاء) وتهضمه: هذه هي الالتهام (phagocytose).'], u: 'اضغط «Étape suivante» لتشاهد خطوات الالتهام واحدة بعد أخرى.', w: [['microbe', 'ميكروب'], ['phagocyte', 'خلية بلعمية'], ['phagocytose', 'الالتهام'], ['immunité', 'المناعة']] } },
      { short: 'Anticorps', title: 'Antigènes et anticorps', intro: 'Un anticorps est spécifique : il s’ajuste à un seul antigène.', build: anticorps,
        retenir: ['Un <b>antigène</b> est une molécule étrangère reconnue par l’organisme.', 'Les lymphocytes fabriquent des <b>anticorps</b> spécifiques de l’antigène.'],
        ar: { e: ['المستضدّ (antigène) جزيء غريب يتعرّف عليه الجسم. تُنتج الخلايا اللمفاوية أجسامًا مضادّة (anticorps) خاصة بكل مستضدّ، تتّحد معه كما يتّحد المفتاح بقفله.'], u: 'اختر الجسم المضاد الذي ينطبق شكله على المستضدّ.', w: [['antigène', 'مستضدّ'], ['anticorps', 'جسم مضاد'], ['lymphocyte', 'خلية لمفاوية'], ['spécifique', 'نوعي (خاص)']] } },
      { short: 'Vaccin', title: 'Vaccination et sérothérapie', intro: 'Compare une injection et deux injections.', build: vaccin,
        retenir: ['Le <b>vaccin</b> contient un antigène inoffensif : l’organisme fabrique ses anticorps et garde une mémoire. Protection durable.', 'La <b>sérothérapie</b> apporte des anticorps déjà prêts : protection immédiate mais temporaire.'],
        ar: { e: ['اللقاح يحتوي على مستضدّ غير ضارّ فيصنع الجسم أجسامه المضادّة ويحتفظ بذاكرة مناعية، والحماية طويلة الأمد. أمّا العلاج المصلي فيمنح أجسامًا مضادّة جاهزة: حماية فورية لكنها مؤقّتة.'], w: [['vaccin', 'لقاح'], ['sérothérapie', 'العلاج المصلي'], ['rappel', 'جرعة تذكيرية'], ['mémoire immunitaire', 'الذاكرة المناعية']] } }
    ]; },
    quiz: [
      { q: 'Quelle cellule ingère les microbes ?', o: ['Le phagocyte', 'Le globule rouge', 'La plaquette'], a: 0, e: 'C’est la phagocytose.' },
      { q: 'Un anticorps est :', o: ['actif contre tous les microbes', 'spécifique d’un antigène', 'un microbe affaibli'], a: 1, e: 'Il ne reconnaît qu’un seul antigène.' },
      { q: 'La protection immédiate mais temporaire est assurée par :', o: ['la vaccination', 'la sérothérapie', 'la phagocytose seulement'], a: 1, e: 'Le sérum apporte des anticorps déjà fabriqués.' }
    ] });

  /* ===================================================== outils communs (chapitres de relation et d’éducation) */
  /* schéma de noeuds reliés, mis en évidence étape par étape */
  function stepper(el, o) {
    var svg = ui.stage(el, o.w || 400, o.h || 230, o.label), g = S('g', null, svg), k = 0, cap = h('p', { 'class': 'px-cap' }), byId = {};
    el.appendChild(cap);
    o.nodes.forEach(function (n) { byId[n.id] = n; });
    function draw() {
      g.replaceChildren();
      var st = o.steps[k], on = {};
      (st.on || []).forEach(function (id) { on[id] = 1; });
      (o.links || []).forEach(function (l) {
        var a = byId[l[0]], b = byId[l[1]], act = on[l[0]] && on[l[1]];
        S('path', { d: 'M' + a.x + ' ' + a.y + 'L' + b.x + ' ' + b.y, style: 'fill:none;stroke:' + (act ? 'var(--pink)' : '#fff') + ';stroke-width:' + (act ? 5 : 2) + ';opacity:' + (act ? 1 : .25) + ';stroke-linecap:round' }, g);
      });
      o.nodes.forEach(function (n) {
        var a = on[n.id], r = n.r || 20;
        S('circle', { cx: n.x, cy: n.y, r: r, style: 'fill:' + (n.c || L) + ';fill-opacity:' + (a ? .95 : .22) + ';stroke:' + (a ? '#fff' : 'transparent') + ';stroke-width:3' }, g);
        label(g, n.x, n.y + r + 15 + (n.row ? 15 : 0), n.t, '#fff', 'middle', 12);
      });
      cap.innerHTML = '<b>Étape ' + (k + 1) + ' / ' + o.steps.length + '.</b> ' + st.t;
    }
    var ctl = ui.controls(el); ui.btn(ctl, 'Étape suivante', function () { k = (k + 1) % o.steps.length; draw(); });
    draw();
  }
  /* onglets : un clic affiche la fiche de l’élément */
  function explorer(el, items) {
    var by = {};
    items.forEach(function (it) { by[it.id] = it; });
    ui.tabs(el, items.map(function (it) { return [it.id, it.t]; }), show);
    var info = ui.info(el);
    function show(id) { var it = by[id]; info.set('<b style="color:' + (it.c || T) + '">' + it.t + '</b><br>' + it.d); }
    show(items[0].id);
  }

  /* ===================================================== 6. ÉDUCATION NUTRITIONNELLE */
  function groupes(el) {
    explorer(el, [
      { id: 'en', t: 'Énergétiques', c: C, d: 'Riches en <b>glucides</b> et en <b>lipides</b> : pain, pâtes, riz, pommes de terre, sucre, huile, beurre. Ils fournissent l’énergie dont les organes ont besoin pour fonctionner.' },
      { id: 'co', t: 'Constructeurs', c: P, d: 'Riches en <b>protéines</b> : viande, poisson, œufs, lait, légumes secs (lentilles, pois chiches). Ils servent à construire et à réparer les organes. Ils sont indispensables pendant la croissance.' },
      { id: 'pr', t: 'Protecteurs', c: T, d: 'Riches en <b>vitamines</b> et en <b>sels minéraux</b> : fruits et légumes. Ils protègent l’organisme et règlent son fonctionnement.' },
      { id: 'ea', t: 'L’eau', c: BLUE, d: 'L’eau est le constituant le plus abondant du corps. On la trouve dans toutes les boissons et dans presque tous les aliments. Il faut boire régulièrement.' }
    ]);
  }
  function carences(el) {
    explorer(el, [
      { id: 'c', t: 'Vitamine C', c: C, d: '<b>Scorbut</b> : fatigue, gencives qui saignent, cicatrisation lente. À manger : agrumes, poivrons, légumes frais.' },
      { id: 'd', t: 'Vitamine D', c: P, d: '<b>Rachitisme</b> chez l’enfant : os mous et déformés. À manger : poissons gras, œufs. Le soleil aide la peau à fabriquer la vitamine D. Le calcium est aussi nécessaire.' },
      { id: 'fe', t: 'Fer', c: RED, d: '<b>Anémie</b> : peu de globules rouges ou d’hémoglobine, donc pâleur et fatigue. À manger : viande, foie, lentilles.' },
      { id: 'i', t: 'Iode', c: T, d: '<b>Goitre</b> : gonflement du cou dû à la glande thyroïde. À manger : poissons de mer, sel iodé.' },
      { id: 'pt', t: 'Protéines', c: L, d: '<b>Retard de croissance</b> et fonte des muscles. À manger : viande, poisson, œufs, lait, légumes secs.' }
    ]);
  }
  function ration(el) {
    var prof = [['el', 'Élève du collège', 10500], ['ad', 'Adulte peu actif', 9500], ['sp', 'Sportif', 14000]], cur = 0;
    ui.tabs(el, prof.map(function (p) { return [p[0], p[1]]; }), function (id) { prof.forEach(function (p, i) { if (p[0] === id) cur = i; }); draw(); });
    var svg = ui.stage(el, 400, 120, 'Énergie de la ration comparée au besoin'), g = S('g', null, svg);
    var kj = function (v) { return v + ' g'; };
    var sg = ui.slider(el, { label: 'Glucides', min: 0, max: 600, step: 10, value: 330, color: C, fmt: kj }, function () { draw(); });
    var sl = ui.slider(el, { label: 'Lipides', min: 0, max: 200, step: 5, value: 85, color: '#e9b84a', fmt: kj }, function () { draw(); });
    var sp = ui.slider(el, { label: 'Protéines', min: 0, max: 200, step: 5, value: 90, color: P, fmt: kj }, function () { draw(); });
    var info = ui.info(el);
    function draw() {
      var G = sg.get(), Lp = sl.get(), Pr = sp.get(), e = G * 17 + Lp * 38 + Pr * 17, need = prof[cur][2];
      var W = 360, max = need * 1.6, r = e / need;
      g.replaceChildren();
      S('rect', { x: 20, y: 46, width: W, height: 28, rx: 14, style: 'fill:#fff;fill-opacity:.12' }, g);
      S('rect', { x: 20, y: 46, width: Math.max(2, Math.min(W, W * e / max)), height: 28, rx: 14, style: 'fill:' + (r < .9 ? C : (r > 1.1 ? P : T)) + ';fill-opacity:.9' }, g);
      var mx = 20 + W * need / max;
      S('path', { d: 'M' + mx + ' 36L' + mx + ' 84', style: 'stroke:#fff;stroke-width:3' }, g);
      label(g, mx, 28, 'besoin : ' + need + ' kJ', '#fff', 'middle', 12);
      label(g, 20, 106, 'ration : ' + e + ' kJ', '#fff', 'start', 13);
      var v = r < .9 ? 'Ration insuffisante : à la longue, fatigue et perte de masse.' : (r > 1.1 ? 'Ration excessive : l’excès d’énergie est stocké sous forme de graisses.' : 'Ration adaptée au besoin en énergie.');
      var pc = function (x) { return e ? Math.round(x / e * 100) : 0; };
      info.set('<b>' + v + '</b><br>Part de l’énergie : glucides ' + pc(G * 17) + ' %, lipides ' + pc(Lp * 38) + ' %, protéines ' + pc(Pr * 17) + ' %. Repères habituels : environ 50 à 55 %, 30 % et 15 %.<br><small>Énergie : 17 kJ par g de glucides ou de protéines, 38 kJ par g de lipides. Besoins indicatifs.</small>');
    }
    draw();
  }
  PC.chapter({ id: 's3-6', lazy: true, eyebrow: EY + 'Nutrition', title: 'L’éducation nutritionnelle', ar: 'التربية الغذائية',
    lessons: function () { return [
      { short: 'Groupes d’aliments', title: 'Les groupes d’aliments', intro: 'Touche chaque onglet : on classe les aliments d’après leur rôle dans l’organisme.', build: groupes,
        retenir: ['Les aliments sont classés d’après leur rôle : <b>énergétiques</b>, <b>constructeurs</b> et <b>protecteurs</b>.', 'Aucun aliment ne contient tout : il faut <b>varier</b> l’alimentation.'],
        ar: { e: ['تُصنَّف الأغذية حسب دورها في الجسم: أغذية طاقية غنية بالسكريات والدهون، وأغذية بانية غنية بالبروتيدات، وأغذية واقية غنية بالفيتامينات والأملاح المعدنية. لا يوجد غذاء واحد يحتوي على كل شيء، لذلك يجب تنويع الغذاء.'], u: 'اضغط على كل لسان لتقرأ دور المجموعة وأمثلتها.', w: [['aliment énergétique', 'غذاء طاقي'], ['aliment constructeur', 'غذاء بانٍ'], ['aliment protecteur', 'غذاء واقٍ'], ['glucides', 'السكريات'], ['lipides', 'الدهون'], ['protéines', 'البروتيدات']] } },
      { short: 'Carences', title: 'Les carences alimentaires', intro: 'Une carence est un apport insuffisant en un nutriment. Choisis un nutriment pour voir la maladie qui en résulte.', build: carences,
        retenir: ['Une <b>carence</b> est un apport insuffisant en un nutriment. Elle provoque une <b>maladie de carence</b>.', 'Scorbut (vitamine C), rachitisme (vitamine D), anémie (fer), goitre (iode).'],
        ar: { e: ['الخصاص الغذائي هو نقص كمية مادة غذائية في الغذاء، وينتج عنه مرض. مثلًا: نقص فيتامين C يسبب الإسقربوط، ونقص فيتامين D يسبب الكساح عند الطفل، ونقص الحديد يسبب فقر الدم، ونقص اليود يسبب الدّراق (تضخم الغدة الدرقية).'], u: 'اضغط على المادة الغذائية لتعرف المرض والأغذية التي تقي منه.', w: [['carence', 'خصاص'], ['scorbut', 'الإسقربوط'], ['rachitisme', 'الكساح'], ['anémie', 'فقر الدم'], ['goitre', 'الدّراق']] } },
      { short: 'Ration', title: 'La ration alimentaire', intro: 'Règle les quantités. Compare l’énergie de la ration au besoin de la personne.', build: ration,
        retenir: ['La <b>ration alimentaire</b> est la quantité d’aliments consommée en 24 heures.', 'Elle doit couvrir les besoins en énergie et en nutriments. Elle dépend de l’âge, de l’activité et du sexe.', 'Énergie : 17 kJ/g pour glucides et protéines, 38 kJ/g pour les lipides.'],
        ar: { e: ['الحصة الغذائية هي كمية الأغذية التي يتناولها الشخص خلال 24 ساعة. يجب أن تغطي حاجيات الجسم من الطاقة والمواد الغذائية، وتختلف حسب السن والنشاط والجنس. الرياضي يحتاج إلى طاقة أكثر من الشخص قليل الحركة. الطاقة التي يوفرها الغرام الواحد: 17 كيلوجول للسكريات والبروتيدات و38 كيلوجول للدهون.'], u: 'حرّك المنزلقات لتغيير كمية السكريات والدهون والبروتيدات، ثم قارن طاقة الحصة بحاجة الشخص.', w: [['ration alimentaire', 'الحصة الغذائية'], ['besoin énergétique', 'الحاجة الطاقية'], ['kilojoule (kJ)', 'كيلوجول']] } }
    ]; },
    quiz: [
      { q: 'Quels aliments sont surtout constructeurs ?', o: ['Lait, œufs, viande', 'Huile, sucre', 'Fruits seulement'], a: 0, e: 'Ils sont riches en protéines.' },
      { q: 'La carence en iode provoque :', o: ['le goitre', 'le scorbut', 'le rachitisme'], a: 0, e: 'L’iode est nécessaire à la thyroïde.' },
      { q: 'Une ration équilibrée :', o: ['couvre les besoins en énergie et en nutriments', 'contient un seul type d’aliment', 'est la même pour tout le monde'], a: 0, e: 'Elle est variée et adaptée à la personne.' }
    ] });

  /* ===================================================== 7. SYSTÈME NERVEUX */
  function trajetSensitif(el) {
    stepper(el, { label: 'Trajet du message nerveux sensitif', h: 190, nodes: [
      { id: 'st', x: 40, y: 80, t: 'Stimulus', c: C }, { id: 're', x: 120, y: 80, t: 'Récepteur', c: P, row: 1 }, { id: 'ns', x: 200, y: 80, t: 'Nerf sensitif', c: L },
      { id: 'mo', x: 280, y: 80, t: 'Moelle épinière', c: T, row: 1 }, { id: 'ce', x: 360, y: 80, t: 'Cerveau', c: '#e9b84a' }
    ], links: [['st', 're'], ['re', 'ns'], ['ns', 'mo'], ['mo', 'ce']], steps: [
      { on: ['st'], t: 'Un stimulus agit sur l’organisme (une piqûre, de la lumière, un son).' },
      { on: ['st', 're'], t: 'Les récepteurs (peau, œil, oreille...) le transforment en message nerveux.' },
      { on: ['re', 'ns'], t: 'Les nerfs sensitifs conduisent le message nerveux vers les centres nerveux.' },
      { on: ['ns', 'mo'], t: 'Le message passe par la moelle épinière.' },
      { on: ['mo', 'ce'], t: 'Il arrive au cerveau, qui produit la sensation consciente : on sent la piqûre.' }
    ] });
  }
  function voies(el) {
    var box = h('div'), modes = {
      vol: { label: 'Mouvement volontaire', nodes: [{ id: 'ce', x: 50, y: 80, t: 'Cerveau', c: '#e9b84a', r: 24 }, { id: 'mo', x: 150, y: 80, t: 'Moelle épinière', c: T, r: 24 }, { id: 'nm', x: 250, y: 80, t: 'Nerf moteur', c: L, r: 24 }, { id: 'mu', x: 350, y: 80, t: 'Muscle', c: P, r: 24 }],
        links: [['ce', 'mo'], ['mo', 'nm'], ['nm', 'mu']], steps: [
          { on: ['ce'], t: 'Le cerveau décide du mouvement : c’est la commande volontaire.' },
          { on: ['ce', 'mo'], t: 'Le message nerveux moteur descend par la moelle épinière.' },
          { on: ['mo', 'nm'], t: 'Il est conduit par un nerf moteur.' },
          { on: ['nm', 'mu'], t: 'Le muscle se contracte : le mouvement est réalisé.' }] },
      ref: { label: 'Réflexe', nodes: [{ id: 're', x: 35, y: 110, t: 'Récepteur', c: P, r: 17 }, { id: 'ns', x: 105, y: 110, t: 'Nerf sensitif', c: L, r: 17, row: 1 }, { id: 'mo', x: 190, y: 110, t: 'Moelle épinière', c: T, r: 17 }, { id: 'nm', x: 275, y: 110, t: 'Nerf moteur', c: L, r: 17, row: 1 }, { id: 'mu', x: 360, y: 110, t: 'Muscle', c: P, r: 17 }, { id: 'ce', x: 190, y: 35, t: 'Cerveau', c: '#e9b84a', r: 17 }],
        links: [['re', 'ns'], ['ns', 'mo'], ['mo', 'nm'], ['nm', 'mu'], ['mo', 'ce']], steps: [
          { on: ['re'], t: 'Un stimulus brusque (main sur une plaque chaude) excite les récepteurs de la peau.' },
          { on: ['re', 'ns'], t: 'Le message nerveux est conduit par un nerf sensitif.' },
          { on: ['ns', 'mo'], t: 'La moelle épinière, centre nerveux du réflexe, traite le message sans attendre le cerveau.' },
          { on: ['mo', 'nm', 'mu'], t: 'Elle envoie l’ordre par un nerf moteur : le muscle retire la main. C’est involontaire et très rapide.' },
          { on: ['mo', 'ce'], t: 'Le cerveau est informé juste après : on sent la douleur une fois la main retirée.' }] }
    };
    ui.tabs(el, [['vol', 'Volontaire'], ['ref', 'Réflexe']], function (id) { load(id); });
    el.appendChild(box);
    function load(id) { box.replaceChildren(); stepper(box, { label: modes[id].label, h: 190, nodes: modes[id].nodes, links: modes[id].links, steps: modes[id].steps }); }
    load('vol');
  }
  function hygieneNerveux(el) {
    explorer(el, [
      { id: 'so', t: 'Sommeil', c: L, d: 'Dormir assez (environ 8 à 10 heures à l’adolescence) permet aux centres nerveux de récupérer. Le manque de sommeil diminue l’attention et la mémoire.' },
      { id: 'to', t: 'Toxiques', c: C, d: 'L’alcool, le tabac et les drogues perturbent le fonctionnement des neurones : troubles de l’attention, du comportement et dépendance. Il faut les éviter.' },
      { id: 'br', t: 'Bruit', c: P, d: 'Un bruit trop fort et prolongé abîme les récepteurs de l’oreille. Baisse le volume du casque.' },
      { id: 'pr', t: 'Protection', c: T, d: 'Un casque protège la tête (vélo, moto). Une alimentation variée, une activité physique régulière et des temps de repos aident aussi le système nerveux.' }
    ]);
  }
  PC.chapter({ id: 's3-7', lazy: true, eyebrow: EY + 'Relation', title: 'Le système nerveux', ar: 'الجهاز العصبي',
    lessons: function () { return [
      { short: 'Message nerveux', title: 'Le trajet du message nerveux sensitif', intro: 'Avance étape par étape : du stimulus à la sensation consciente.', build: trajetSensitif,
        retenir: ['Les <b>récepteurs</b> transforment un stimulus en <b>message nerveux</b>.', 'Les <b>nerfs sensitifs</b> le conduisent vers les <b>centres nerveux</b> (moelle épinière et cerveau).', 'La <b>sensation consciente</b> se produit dans le cerveau.'],
        ar: { e: ['عندما يؤثر منبّه على الجسم تحوّله المستقبِلات الحسية (الجلد، العين، الأذن...) إلى سيالة عصبية. تنقلها الأعصاب الحسية نحو المراكز العصبية: النخاع الشوكي ثم الدماغ. في الدماغ يحدث الإحساس الواعي، مثل الإحساس بالألم.'], u: 'اضغط «Étape suivante» لتتبع مسار السيالة العصبية.', w: [['stimulus', 'منبّه'], ['récepteur', 'مستقبِل'], ['message nerveux', 'سيالة عصبية'], ['nerf sensitif', 'عصب حسي'], ['moelle épinière', 'النخاع الشوكي'], ['cerveau', 'الدماغ']] } },
      { short: 'Volontaire et réflexe', title: 'Mouvement volontaire et réflexe', intro: 'Compare les deux trajets. Dans le réflexe, qui commande le muscle ?', build: voies,
        retenir: ['Le mouvement <b>volontaire</b> est commandé par le <b>cerveau</b>.', 'Le <b>réflexe</b> est involontaire et rapide : le centre nerveux est la <b>moelle épinière</b>.', 'Trajet du réflexe : <b>arc réflexe</b> (récepteur, nerf sensitif, centre nerveux, nerf moteur, muscle).'],
        ar: { e: ['الحركة الإرادية يأمر بها الدماغ، فتنتقل السيالة الحركية عبر النخاع الشوكي والعصب الحركي إلى العضلة. أما الفعل المنعكس فهو لا إرادي وسريع، ومركزه العصبي هو النخاع الشوكي، ويُعلَم الدماغ بعد ذلك فقط. مسار الفعل المنعكس يسمى القوس الانعكاسية.'], u: 'اختر «Volontaire» أو «Réflexe» ثم اضغط «Étape suivante».', w: [['mouvement volontaire', 'حركة إرادية'], ['réflexe', 'فعل منعكس'], ['arc réflexe', 'القوس الانعكاسية'], ['nerf moteur', 'عصب حركي']] } },
      { short: 'Hygiène', title: 'L’hygiène du système nerveux', intro: 'Touche chaque onglet pour connaître les bons gestes.', build: hygieneNerveux,
        retenir: ['Dormir assez, éviter alcool, tabac et drogues, éviter le bruit excessif et se protéger la tête.'],
        ar: { e: ['للمحافظة على الجهاز العصبي: النوم الكافي، وتجنب الكحول والتدخين والمخدرات، وتجنب الضجيج المفرط، وحماية الرأس بالخوذة، مع تغذية متوازنة وممارسة الرياضة.'], w: [['hygiène', 'الوقاية والنظافة'], ['neurone', 'خلية عصبية']] } }
    ]; },
    quiz: [
      { q: 'Quel est le centre nerveux d’un réflexe ?', o: ['La moelle épinière', 'Le muscle', 'Le récepteur'], a: 0, e: 'Le cerveau est informé ensuite.' },
      { q: 'Un nerf moteur conduit le message :', o: ['du centre nerveux vers un muscle', 'du récepteur vers le centre nerveux', 'du cœur vers les poumons'], a: 0, e: 'Il commande l’effecteur, par exemple un muscle.' },
      { q: 'La sensation consciente se forme dans :', o: ['le cerveau', 'la peau', 'le nerf moteur'], a: 0, e: 'Les récepteurs seulement élaborent le message nerveux.' }
    ] });

  /* ===================================================== 8. SYSTÈME MUSCULAIRE */
  function proprietes(el) {
    explorer(el, [
      { id: 'ex', t: 'Excitabilité', c: P, d: 'Le muscle <b>réagit à une stimulation</b> (message nerveux, courant électrique faible) : il se contracte.' },
      { id: 'co', t: 'Contractilité', c: T, d: 'Le muscle <b>se raccourcit et s’épaissit</b> quand il se contracte. Il tire alors sur l’os grâce aux tendons.' },
      { id: 'el', t: 'Élasticité', c: L, d: 'Après la contraction, le muscle <b>reprend sa longueur</b> et sa forme de départ.' }
    ]);
  }
  function energieMuscle(el) {
    stepper(el, { label: 'Le muscle qui se contracte', h: 230, nodes: [
      { id: 'ne', x: 60, y: 175, t: 'Nerf moteur', c: L }, { id: 'sa', x: 60, y: 60, t: 'Sang', c: RED }, { id: 'mu', x: 200, y: 118, t: 'Muscle', c: P, r: 26 },
      { id: 'tr', x: 340, y: 40, t: 'Mouvement', c: T }, { id: 'ch', x: 340, y: 118, t: 'Chaleur', c: C }, { id: 'de', x: 340, y: 196, t: 'CO₂ et déchets', c: '#e9b84a' }
    ], links: [['ne', 'mu'], ['sa', 'mu'], ['mu', 'tr'], ['mu', 'ch'], ['mu', 'de']], steps: [
      { on: ['ne', 'mu'], t: 'Un message nerveux arrive au muscle par le nerf moteur.' },
      { on: ['sa', 'mu'], t: 'Le sang apporte au muscle du glucose et du dioxygène.' },
      { on: ['mu'], t: 'Le muscle utilise ces substances : il libère de l’énergie.' },
      { on: ['mu', 'tr'], t: 'Une partie de cette énergie permet la contraction, donc le mouvement.' },
      { on: ['mu', 'ch'], t: 'Une autre partie est libérée sous forme de chaleur : le corps se réchauffe pendant l’effort.' },
      { on: ['mu', 'de'], t: 'Le muscle rejette du dioxyde de carbone et des déchets dans le sang. Si l’effort est trop long, ils s’accumulent : c’est la fatigue.' }
    ] });
  }
  function hygieneMuscle(el) {
    explorer(el, [
      { id: 'ex', t: 'Exercice', c: T, d: 'Une activité physique régulière développe et entretient les muscles. Un échauffement avant l’effort prévient les blessures.' },
      { id: 'al', t: 'Alimentation', c: P, d: 'Les muscles ont besoin de protéines pour se construire et de glucides pour fournir l’énergie. Il faut aussi boire de l’eau.' },
      { id: 'po', t: 'Posture', c: L, d: 'Se tenir droit, répartir la charge du cartable sur les deux épaules, ne pas porter trop lourd : cela protège les muscles et la colonne vertébrale.' },
      { id: 're', t: 'Repos', c: C, d: 'Après un effort, le repos permet aux muscles de récupérer et d’éliminer les déchets. Un effort excessif provoque crampes et courbatures.' }
    ]);
  }
  PC.chapter({ id: 's3-8', lazy: true, eyebrow: EY + 'Relation', title: 'Le système musculaire', ar: 'الجهاز العضلي',
    lessons: function () { return [
      { label: 'Leçon 1 · ' + APPRO, short: 'Propriétés', title: 'Les propriétés du muscle', intro: 'Trois propriétés expliquent le fonctionnement d’un muscle squelettique.', build: proprietes,
        retenir: ['Le muscle squelettique est <b>excitable</b>, <b>contractile</b> et <b>élastique</b>.', 'Les muscles sont reliés aux os par des <b>tendons</b>.'],
        ar: { e: ['العضلة الهيكلية لها ثلاث خاصيات: القابلية للتنبّه (تستجيب للتنبيه)، والانقباضية (تقصر وتتسمّك عند الانقباض)، والمرونة (ترجع إلى طولها الأصلي بعد الانقباض). ترتبط العضلات بالعظام بواسطة الأوتار.'], u: 'اضغط على كل خاصية لتقرأ تعريفها.', w: [['excitabilité', 'القابلية للتنبّه'], ['contractilité', 'الانقباضية'], ['élasticité', 'المرونة'], ['tendon', 'وتر']] } },
      { short: 'Énergie', title: 'La contraction et l’énergie du muscle', intro: 'Suis ce que reçoit et ce que rejette un muscle qui travaille.', build: energieMuscle,
        retenir: ['Le muscle reçoit du <b>glucose</b> et du <b>dioxygène</b> par le sang.', 'Il libère de l’énergie : <b>mouvement</b> et <b>chaleur</b>. Il rejette du <b>CO₂</b> et des déchets.', 'Un effort trop long provoque la <b>fatigue musculaire</b>.'],
        ar: { e: ['تحصل العضلة من الدم على الغلوكوز وثنائي الأوكسجين. تستعملهما لتحرير الطاقة، فتُستعمل جزء منها في الانقباض (الحركة) ويتحرر جزء آخر على شكل حرارة. تطرح العضلة ثنائي أوكسيد الكربون وفضلات. إذا طال المجهود تتراكم الفضلات فيحدث التعب العضلي.'], u: 'اضغط «Étape suivante» لتتبع ما يحدث داخل العضلة.', w: [['glucose', 'الغلوكوز'], ['dioxygène', 'ثنائي الأوكسجين'], ['fatigue musculaire', 'التعب العضلي'], ['chaleur', 'الحرارة']] } },
      { short: 'Hygiène', title: 'L’hygiène de l’appareil musculaire', intro: 'Touche chaque onglet pour connaître les bons gestes.', build: hygieneMuscle,
        retenir: ['Exercice régulier avec échauffement, alimentation variée, bonne posture et repos.'],
        ar: { e: ['للمحافظة على العضلات: ممارسة الرياضة بانتظام مع الإحماء قبل المجهود، وتغذية متنوعة غنية بالبروتيدات، واتخاذ وضعية جيدة للجسم وتوزيع ثقل المحفظة على الكتفين، وأخذ قسط من الراحة بعد المجهود.'], w: [['échauffement', 'الإحماء'], ['posture', 'وضعية الجسم'], ['courbature', 'آلام عضلية']] } }
    ]; },
    quiz: [
      { q: 'Quand un muscle se contracte, il :', o: ['se raccourcit et s’épaissit', 's’allonge', 'reste identique'], a: 0, e: 'C’est la contractilité.' },
      { q: 'Le muscle reçoit glucose et dioxygène par :', o: ['le sang', 'le tendon', 'la salive'], a: 0, e: 'Le sang apporte les substances nécessaires.' },
      { q: 'Un échauffement avant l’effort :', o: ['prépare les muscles et évite des blessures', 'fatigue le muscle', 'remplace l’alimentation'], a: 0, e: 'Il fait partie de l’hygiène musculaire.' }
    ] });

  /* ===================================================== 9. LES MICROBES */
  function diversite(el) {
    explorer(el, [
      { id: 'ba', t: 'Bactéries', c: T, d: 'Êtres <b>unicellulaires</b> sans noyau, visibles au microscope. Elles se multiplient très vite. Certaines sont utiles (bactéries du yaourt), d’autres provoquent des maladies : angine à streptocoques, tuberculose, choléra.' },
      { id: 'vi', t: 'Virus', c: C, d: 'Bien plus petits que les bactéries. Ils n’ont <b>pas de structure cellulaire</b> et ne se multiplient qu’à l’intérieur d’une cellule vivante. Exemples : grippe, rougeole, rage, VIH.' },
      { id: 'ch', t: 'Champignons', c: P, d: 'Les champignons microscopiques sont des levures ou des moisissures. Les levures font lever le pain. D’autres causent des <b>mycoses</b> de la peau ou des ongles.' },
      { id: 'pr', t: 'Protozoaires', c: L, d: 'Êtres <b>unicellulaires avec noyau</b>, parasites. Exemples : l’agent du paludisme et celui de l’amibiase.' }
    ]);
  }
  function danger(el) {
    stepper(el, { label: 'Comment un microbe pathogène rend malade', h: 190, nodes: [
      { id: 'mi', x: 40, y: 80, t: 'Microbe', c: C }, { id: 'en', x: 120, y: 80, t: 'Entrée', c: P, row: 1 }, { id: 'mu', x: 200, y: 80, t: 'Multiplication', c: L },
      { id: 'to', x: 280, y: 80, t: 'Toxines', c: '#e9b84a', row: 1 }, { id: 'ma', x: 360, y: 80, t: 'Maladie', c: RED }
    ], links: [['mi', 'en'], ['en', 'mu'], ['mu', 'to'], ['to', 'ma']], steps: [
      { on: ['mi'], t: 'Un microbe pathogène est présent dans l’air, l’eau, un aliment ou sur un objet.' },
      { on: ['mi', 'en'], t: 'Il entre dans l’organisme : par le nez, la bouche, une plaie ou le sang.' },
      { on: ['en', 'mu'], t: 'Il se multiplie rapidement, parfois en quelques heures.' },
      { on: ['mu', 'to'], t: 'Il peut libérer des substances toxiques (toxines) et détruire des cellules.' },
      { on: ['to', 'ma'], t: 'Les symptômes apparaissent : fièvre, douleur, fatigue. La maladie peut se transmettre à d’autres personnes : c’est la contagion.' }
    ] });
  }
  function proteger(el) {
    explorer(el, [
      { id: 'ma', t: 'Mains', c: T, d: 'Se laver les mains au savon avant de manger et après les toilettes. C’est le geste le plus efficace contre beaucoup de microbes.' },
      { id: 'al', t: 'Aliments et eau', c: P, d: 'Laver les fruits et légumes, bien cuire la viande, garder les aliments au froid, boire une eau potable.' },
      { id: 'pl', t: 'Plaies', c: C, d: 'Nettoyer une plaie à l’eau et au savon puis la désinfecter et la protéger : la peau abîmée est une porte d’entrée.' },
      { id: 'va', t: 'Vaccins', c: L, d: 'Les vaccins préparent le système immunitaire avant la rencontre avec le microbe.' },
      { id: 'an', t: 'Antibiotiques', c: '#e9b84a', d: 'Les antibiotiques agissent seulement contre les <b>bactéries</b>, pas contre les virus. On les prend sur ordonnance, sans arrêter le traitement trop tôt.' }
    ]);
  }
  PC.chapter({ id: 's3-9', lazy: true, eyebrow: EY + 'Santé', title: 'Les micro-organismes', ar: 'الجراثيم',
    lessons: function () { return [
      { short: 'Diversité', title: 'La diversité des microorganismes', intro: 'Touche chaque onglet pour découvrir les grands groupes de microbes.', build: diversite,
        retenir: ['Les microbes sont des êtres <b>microscopiques</b> : bactéries, virus, champignons microscopiques et protozoaires.', 'Certains sont utiles, d’autres sont <b>pathogènes</b> : ils provoquent des maladies.'],
        ar: { e: ['الجراثيم كائنات مجهرية لا تُرى بالعين المجردة: البكتيريا، والفيروسات، والفطريات المجهرية، والأوليات. بعضها نافع، مثل بكتيريا اللبن وخميرة الخبز، وبعضها ممرض يسبب الأمراض. الفيروسات أصغر من البكتيريا وليس لها بنية خلوية، ولا تتكاثر إلا داخل خلية حية.'], u: 'اضغط على كل لسان لتتعرف على المجموعة وأمثلتها.', w: [['microbe', 'ميكروب'], ['bactérie', 'بكتيريا'], ['virus', 'فيروس'], ['champignon', 'فطر'], ['protozoaire', 'أولي'], ['pathogène', 'ممرض']] } },
      { short: 'Dangers', title: 'Les dangers des microbes pathogènes', intro: 'Suis les étapes : de l’entrée du microbe à la maladie.', build: danger,
        retenir: ['Un microbe pathogène <b>entre</b> dans l’organisme, <b>se multiplie</b>, puis peut libérer des <b>toxines</b>.', 'Les maladies infectieuses peuvent être <b>contagieuses</b>.'],
        ar: { e: ['يدخل الجرثوم الممرض إلى الجسم عبر الأنف أو الفم أو جرح أو الدم، ثم يتكاثر بسرعة، وقد يفرز سموما تُتلف الخلايا. تظهر الأعراض مثل الحمى والألم والتعب. ويمكن أن تنتقل بعض الأمراض من شخص إلى آخر، وهذا هو العدوى.'], u: 'اضغط «Étape suivante» لتتبع مراحل الإصابة.', w: [['toxine', 'سمّ ميكروبي'], ['contagion', 'عدوى'], ['maladie infectieuse', 'مرض معدٍ']] } },
      { short: 'Se protéger', title: 'Se protéger des microbes', intro: 'Quels gestes limitent les infections ?', build: proteger,
        retenir: ['Hygiène des mains, des aliments et de l’eau, soin des plaies et vaccination protègent des microbes.', 'Les <b>antibiotiques</b> sont inefficaces contre les virus.'],
        ar: { e: ['للوقاية من الجراثيم: غسل اليدين بالصابون، وغسل الخضر والفواكه وطهي اللحم جيدا وشرب ماء صالح للشرب، وتنظيف الجروح وتعقيمها، والتلقيح. المضادات الحيوية تؤثر في البكتيريا فقط ولا تؤثر في الفيروسات، ويجب أخذها بوصفة الطبيب.'], w: [['antibiotique', 'مضاد حيوي'], ['vaccin', 'لقاح'], ['désinfecter', 'عقّم']] } }
    ]; },
    quiz: [
      { q: 'Quel microbe n’a pas de structure cellulaire ?', o: ['Le virus', 'La bactérie', 'Le protozoaire'], a: 0, e: 'Un virus se multiplie seulement dans une cellule vivante.' },
      { q: 'Les antibiotiques sont efficaces contre :', o: ['les bactéries', 'les virus', 'tous les microbes'], a: 0, e: 'Ils sont inefficaces contre les virus.' },
      { q: 'Quel geste limite le plus la transmission des microbes ?', o: ['Se laver les mains au savon', 'Partager sa bouteille', 'Ne jamais se couvrir'], a: 0, e: 'L’hygiène des mains protège contre beaucoup d’infections.' }
    ] });

  /* ===================================================== 10. RÉPONSES IMMUNITAIRES SPÉCIFIQUES */
  function nonSpec(el) {
    stepper(el, { label: 'La réponse immunitaire non spécifique', h: 190, nodes: [
      { id: 'mi', x: 40, y: 80, t: 'Microbes', c: C }, { id: 'pe', x: 120, y: 80, t: 'Peau lésée', c: P, row: 1 }, { id: 'in', x: 200, y: 80, t: 'Inflammation', c: '#e9b84a' },
      { id: 'ph', x: 280, y: 80, t: 'Phagocytes', c: T, row: 1 }, { id: 'de', x: 360, y: 80, t: 'Destruction', c: L }
    ], links: [['mi', 'pe'], ['pe', 'in'], ['in', 'ph'], ['ph', 'de']], steps: [
      { on: ['mi'], t: 'Des microbes sont présents sur la peau.' },
      { on: ['mi', 'pe'], t: 'Une blessure ouvre la barrière de la peau : les microbes entrent.' },
      { on: ['pe', 'in'], t: 'Réaction inflammatoire : la zone devient rouge, chaude, gonflée et douloureuse.' },
      { on: ['in', 'ph'], t: 'Des phagocytes sortent des vaisseaux sanguins et arrivent sur place.' },
      { on: ['ph', 'de'], t: 'Ils ingèrent et détruisent les microbes. Cette réponse est la même pour tous les microbes : elle est non spécifique.' }
    ] });
  }
  function humorale(el) {
    stepper(el, { label: 'La réponse immunitaire à médiation humorale', h: 210, nodes: [
      { id: 'ag', x: 40, y: 80, t: 'Antigène', c: C }, { id: 'lb', x: 120, y: 80, t: 'Lymphocyte B', c: P, row: 1 }, { id: 'pl', x: 200, y: 80, t: 'Plasmocytes', c: L },
      { id: 'ac', x: 280, y: 80, t: 'Anticorps', c: T, row: 1 }, { id: 'de', x: 360, y: 80, t: 'Élimination', c: '#e9b84a' }
    ], links: [['ag', 'lb'], ['lb', 'pl'], ['pl', 'ac'], ['ac', 'de']], steps: [
      { on: ['ag'], t: 'Un antigène (microbe ou toxine) pénètre dans l’organisme.' },
      { on: ['ag', 'lb'], t: 'Un lymphocyte B reconnaît cet antigène précis. Les lymphocytes T4 l’aident à s’activer.' },
      { on: ['lb', 'pl'], t: 'Le lymphocyte B se multiplie et se transforme en plasmocytes.' },
      { on: ['pl', 'ac'], t: 'Les plasmocytes fabriquent des anticorps spécifiques de l’antigène. Ils passent dans le sang : on parle de médiation humorale.' },
      { on: ['ac', 'de'], t: 'Les anticorps se fixent sur l’antigène. Les phagocytes détruisent ensuite le complexe formé.' }
    ] });
  }
  function cellulaire(el) {
    stepper(el, { label: 'La réponse immunitaire à médiation cellulaire', h: 210, nodes: [
      { id: 'ci', x: 40, y: 80, t: 'Cellule infectée', c: C }, { id: 'lt', x: 130, y: 80, t: 'Lymphocyte T8', c: P, row: 1 }, { id: 'mu', x: 220, y: 80, t: 'Multiplication', c: L },
      { id: 'tc', x: 310, y: 80, t: 'LT cytotoxiques', c: T, row: 1 }, { id: 'de', x: 375, y: 140, t: 'Destruction', c: '#e9b84a' }
    ], links: [['ci', 'lt'], ['lt', 'mu'], ['mu', 'tc'], ['tc', 'de']], steps: [
      { on: ['ci'], t: 'Un virus a infecté une cellule de l’organisme.' },
      { on: ['ci', 'lt'], t: 'Un lymphocyte T8 reconnaît les antigènes du virus à la surface de la cellule infectée.' },
      { on: ['lt', 'mu'], t: 'Le lymphocyte T8 se multiplie, avec l’aide des lymphocytes T4.' },
      { on: ['mu', 'tc'], t: 'Il se transforme en lymphocytes T cytotoxiques.' },
      { on: ['tc', 'de'], t: 'Ces cellules se fixent sur les cellules infectées et les détruisent : on parle de médiation cellulaire.' }
    ] });
  }
  function organes(el) {
    explorer(el, [
      { id: 'mo', t: 'Moelle osseuse', c: RED, d: 'Dans les os. Tous les lymphocytes y naissent. Les lymphocytes B y mûrissent.' },
      { id: 'th', t: 'Thymus', c: P, d: 'Glande située derrière le sternum. Les lymphocytes T y mûrissent. Elle est très active pendant l’enfance.' },
      { id: 'ga', t: 'Ganglions', c: T, d: 'Petits renflements sur les vaisseaux lymphatiques (cou, aisselle, aine). Ils filtrent la lymphe et les lymphocytes y rencontrent les antigènes. Ils gonflent en cas d’infection.' },
      { id: 'ra', t: 'Rate', c: L, d: 'Elle filtre le sang et héberge des lymphocytes : elle réagit aux antigènes présents dans le sang.' },
      { id: 'co', t: 'Coopération', c: '#e9b84a', d: 'Les <b>lymphocytes T4</b> (auxiliaires) aident les lymphocytes B et T8 à se multiplier et à agir. Sans eux, la défense devient très faible.' }
    ]);
  }
  PC.chapter({ id: 's3-10', lazy: true, eyebrow: EY + 'Santé', title: 'Les réponses immunitaires', ar: 'الاستجابات المناعية',
    lessons: function () { return [
      { short: 'Non spécifique', title: 'La réponse immunitaire non spécifique', intro: 'Avance étape par étape : de la blessure à la destruction des microbes.', build: nonSpec,
        retenir: ['La <b>réponse non spécifique</b> est immédiate et identique pour tous les microbes.', 'Elle comprend les barrières (peau), l’<b>inflammation</b> et la <b>phagocytose</b>.'],
        ar: { e: ['الاستجابة المناعية غير النوعية فورية وتكون نفسها تجاه كل الجراثيم. تبدأ بالحواجز الطبيعية مثل الجلد، فإذا دخل الجرثوم يحدث التهاب: احمرار وحرارة وانتفاخ وألم، ثم تأتي الخلايا البلعمية وتلتهم الجراثيم.'], u: 'اضغط «Étape suivante» لتتبع مراحل الاستجابة.', w: [['réponse non spécifique', 'استجابة غير نوعية'], ['inflammation', 'التهاب'], ['phagocyte', 'خلية بلعمية'], ['phagocytose', 'الالتهام']] } },
      { short: 'Humorale', title: 'La réponse spécifique à médiation humorale', intro: 'Les anticorps circulent dans le sang : suis leur fabrication.', build: humorale,
        retenir: ['Un <b>lymphocyte B</b> reconnaît un antigène, se multiplie et donne des <b>plasmocytes</b>.', 'Les plasmocytes fabriquent des <b>anticorps</b> spécifiques, libérés dans le sang.'],
        ar: { e: ['في الاستجابة النوعية ذات الوسيط الخلطي تتعرف اللمفاويات B على المستضد، وتتكاثر وتتحول إلى خلايا بلازمية (بلازموسيت). تصنع هذه الخلايا أجساما مضادة نوعية تنتقل في الدم وتتثبت على المستضد، ثم تلتهم الخلايا البلعمية المعقد المتكون.'], u: 'اضغط «Étape suivante» لتتبع تصنيع الأجسام المضادة.', w: [['lymphocyte B', 'لمفاوية B'], ['plasmocyte', 'خلية بلازمية'], ['anticorps', 'جسم مضاد'], ['antigène', 'مستضد']] } },
      { short: 'Cellulaire', title: 'La réponse spécifique à médiation cellulaire', intro: 'Contre les cellules infectées, ce sont des cellules qui agissent.', build: cellulaire,
        retenir: ['Les <b>lymphocytes T8</b> deviennent cytotoxiques et <b>détruisent les cellules infectées</b>.', 'Les anticorps agissent dans le sang, les lymphocytes T cytotoxiques agissent au contact des cellules.'],
        ar: { e: ['في الاستجابة النوعية ذات الوسيط الخلوي تتعرف اللمفاويات T8 على مستضدات الفيروس على سطح الخلية المصابة، فتتكاثر وتتحول إلى لمفاويات T سامة للخلايا. تتثبت على الخلايا المصابة وتدمرها. هنا لا تؤدي الأجسام المضادة الدور الرئيسي، بل الخلايا نفسها.'], u: 'اضغط «Étape suivante» لتتبع مراحل الاستجابة.', w: [['lymphocyte T8', 'لمفاوية T8'], ['cytotoxique', 'سامّة للخلايا'], ['cellule infectée', 'خلية مصابة']] } },
      { short: 'Organes', title: 'Les organes lymphoïdes et la coopération cellulaire', intro: 'Où naissent et où agissent les lymphocytes ?', build: organes,
        retenir: ['La <b>moelle osseuse</b> et le <b>thymus</b> fabriquent et font mûrir les lymphocytes.', 'Les <b>ganglions</b> et la <b>rate</b> sont des lieux de rencontre avec les antigènes.', 'Les <b>lymphocytes T4</b> coordonnent la réponse immunitaire.'],
        ar: { e: ['تتكون اللمفاويات في نخاع العظم، وتنضج اللمفاويات B فيه، أما اللمفاويات T فتنضج في الغدة السعترية (التيموس). العقد اللمفاوية والطحال أماكن تلتقي فيها اللمفاويات بالمستضدات. وتساعد اللمفاويات T4 باقي اللمفاويات على التكاثر والعمل، لذلك تسمى المساعِدة.'], u: 'اضغط على كل عضو لتقرأ دوره.', w: [['moelle osseuse', 'نخاع العظم'], ['thymus', 'الغدة السعترية'], ['ganglion', 'عقدة لمفاوية'], ['rate', 'الطحال'], ['lymphocyte T4', 'لمفاوية T4']] } }
    ]; },
    quiz: [
      { q: 'Quelles cellules fabriquent les anticorps ?', o: ['Les plasmocytes', 'Les globules rouges', 'Les plaquettes'], a: 0, e: 'Ils dérivent des lymphocytes B.' },
      { q: 'Contre une cellule infectée par un virus, agissent surtout :', o: ['les lymphocytes T cytotoxiques', 'les globules rouges', 'les plaquettes'], a: 0, e: 'C’est la médiation cellulaire.' },
      { q: 'Où les lymphocytes T mûrissent-ils ?', o: ['Dans le thymus', 'Dans le foie', 'Dans l’estomac'], a: 0, e: 'Le thymus est un organe lymphoïde.' }
    ] });

  /* ===================================================== 11. DYSFONCTIONNEMENTS DU SYSTÈME IMMUNITAIRE */
  function sida(el) {
    stepper(el, { label: 'Le VIH et le système immunitaire', h: 210, nodes: [
      { id: 'vi', x: 40, y: 80, t: 'VIH', c: C }, { id: 'l4', x: 125, y: 80, t: 'Lymphocytes T4', c: P, row: 1 }, { id: 'de', x: 210, y: 80, t: 'T4 détruits', c: L },
      { id: 'af', x: 295, y: 80, t: 'Défenses faibles', c: '#e9b84a', row: 1 }, { id: 'ma', x: 365, y: 140, t: 'SIDA', c: RED }
    ], links: [['vi', 'l4'], ['l4', 'de'], ['de', 'af'], ['af', 'ma']], steps: [
      { on: ['vi'], t: 'Le virus de l’immunodéficience humaine (VIH) entre dans l’organisme.' },
      { on: ['vi', 'l4'], t: 'Il infecte les lymphocytes T4 qui coordonnent la défense.' },
      { on: ['l4', 'de'], t: 'Il s’y multiplie et détruit peu à peu ces lymphocytes.' },
      { on: ['de', 'af'], t: 'Sans assez de T4, les défenses de l’organisme s’affaiblissent.' },
      { on: ['af', 'ma'], t: 'Des maladies que l’organisme repoussait d’habitude se déclarent : c’est le stade SIDA (syndrome d’immunodéficience acquise).' }
    ] });
  }
  function sidaTransmission(el) {
    explorer(el, [
      { id: 'tr', t: 'Transmission', c: C, d: 'Le VIH se transmet par le <b>sang</b>, par des <b>rapports sexuels non protégés</b> et de la <b>mère à l’enfant</b> (grossesse, accouchement, allaitement).' },
      { id: 'no', t: 'Pas de transmission', c: T, d: 'Il ne se transmet <b>pas</b> par une poignée de main, un baiser, un verre partagé, un moustique ou la vie en classe.' },
      { id: 'pr', t: 'Prévention', c: L, d: 'Préservatif, seringues et objets coupants à usage unique, dépistage. Des médicaments contrôlent le virus mais ne le font pas disparaître.' }
    ]);
  }
  function allergie(el) {
    stepper(el, { label: 'Le mécanisme d’une allergie', h: 210, nodes: [
      { id: 'a1', x: 40, y: 80, t: '1er contact', c: C }, { id: 'ig', x: 125, y: 80, t: 'Anticorps IgE', c: P, row: 1 }, { id: 'ma', x: 210, y: 80, t: 'Cellules', c: L },
      { id: 'a2', x: 295, y: 80, t: '2e contact', c: '#e9b84a', row: 1 }, { id: 'hi', x: 365, y: 140, t: 'Histamine', c: RED }
    ], links: [['a1', 'ig'], ['ig', 'ma'], ['ma', 'a2'], ['a2', 'hi']], steps: [
      { on: ['a1'], t: 'Premier contact avec un allergène (pollen, acarien, aliment...) : aucun signe.' },
      { on: ['a1', 'ig'], t: 'L’organisme fabrique des anticorps (IgE) contre cet allergène.' },
      { on: ['ig', 'ma'], t: 'Ces anticorps se fixent sur certaines cellules (sensibilisation).' },
      { on: ['ma', 'a2'], t: 'Deuxième contact avec le même allergène : il se fixe sur ces anticorps.' },
      { on: ['a2', 'hi'], t: 'Les cellules libèrent de l’histamine : éternuements, démangeaisons, gonflement. Cette réponse rapide est une hypersensibilité immédiate.' }
    ] });
  }
  function transfusion(el) {
    var G = ['A', 'B', 'AB', 'O'], AG = { A: ['A'], B: ['B'], AB: ['A', 'B'], O: [] }, AC = { A: ['anti-B'], B: ['anti-A'], AB: [], O: ['anti-A', 'anti-B'] }, don = 'O', rec = 'A';
    ui.text(el, '<b>Donneur</b>');
    ui.tabs(el, G.map(function (x) { return [x, x]; }), function (v) { don = v; draw(); });
    ui.text(el, '<b>Receveur</b>');
    ui.tabs(el, G.map(function (x) { return [x, x]; }), function (v) { rec = v; draw(); });
    var svg = ui.stage(el, 400, 170, 'Compatibilité entre un donneur et un receveur'), g = S('g', null, svg), info = ui.info(el);
    function draw() {
      g.replaceChildren();
      var ok = AG[don].every(function (a) { return AG[rec].indexOf(a) >= 0; });
      S('circle', { cx: 80, cy: 70, r: 46, style: 'fill:' + RED + ';fill-opacity:.35;stroke:' + RED + ';stroke-width:3' }, g);
      label(g, 80, 74, 'groupe ' + don, '#fff', 'middle', 16);
      label(g, 80, 140, 'antigènes : ' + (AG[don].join(' et ') || 'aucun'), '#fff', 'middle', 12);
      S('circle', { cx: 320, cy: 70, r: 46, style: 'fill:' + L + ';fill-opacity:.3;stroke:' + L + ';stroke-width:3' }, g);
      label(g, 320, 74, 'groupe ' + rec, '#fff', 'middle', 16);
      label(g, 320, 140, 'anticorps : ' + (AC[rec].join(' et ') || 'aucun'), '#fff', 'middle', 12);
      S('path', { d: 'M135 70L265 70', style: 'fill:none;stroke:' + (ok ? T : C) + ';stroke-width:5;stroke-linecap:round' }, g);
      label(g, 200, 56, ok ? 'compatible' : 'incompatible', ok ? T : C, 'middle', 14);
      info.set(ok ? '<b>Transfusion possible.</b> Le receveur n’a pas d’anticorps contre les antigènes du donneur.' : '<b>Transfusion dangereuse.</b> Les anticorps du receveur se fixent sur les antigènes des globules rouges du donneur : ils s’agglutinent (agglutination) et obstruent les vaisseaux.');
    }
    draw();
  }
  function hygieneRepro(el) {
    explorer(el, [
      { id: 'to', t: 'Toilette', c: T, d: 'Une toilette quotidienne à l’eau et au savon doux. Changer régulièrement de sous-vêtements, de préférence en coton.' },
      { id: 'me', t: 'Médecin', c: P, d: 'Consulter un médecin ou un infirmier en cas de douleur, de démangeaison ou d’écoulement inhabituel. Ne pas se soigner seul.' },
      { id: 'is', t: 'Infections', c: C, d: 'Les infections sexuellement transmissibles (IST) se préviennent. Le préservatif protège. Dépister et soigner tôt évite les complications.' }
    ]);
  }
  PC.chapter({ id: 's3-11', lazy: true, eyebrow: EY + 'Santé · ' + APPRO, title: 'Les dysfonctionnements du système immunitaire', ar: 'اضطرابات جهاز المناعة',
    lessons: function () { return [
      { short: 'SIDA', title: 'Le SIDA', intro: 'Comment le VIH affaiblit les défenses de l’organisme ?', build: sida,
        retenir: ['Le <b>VIH</b> infecte et détruit les <b>lymphocytes T4</b>.', 'Le <b>SIDA</b> est le stade où l’organisme ne se défend plus correctement : des maladies graves apparaissent.'],
        ar: { e: ['فيروس نقص المناعة المكتسب (VIH) يصيب اللمفاويات T4 التي تنسق الدفاع عن الجسم ويدمرها تدريجيا. فيضعف الجهاز المناعي وتظهر أمراض خطيرة كان الجسم يقاومها عادة. هذه هي مرحلة السيدا (متلازمة نقص المناعة المكتسبة).'], u: 'اضغط «Étape suivante» لتتبع تأثير الفيروس.', w: [['VIH', 'فيروس نقص المناعة المكتسب'], ['SIDA', 'السيدا'], ['immunodéficience', 'نقص المناعة']] } },
      { short: 'Transmission', title: 'Transmission et prévention du SIDA', intro: 'Ce qui transmet le virus, ce qui ne le transmet pas.', build: sidaTransmission,
        retenir: ['Voies de transmission : <b>sang</b>, <b>rapports sexuels non protégés</b>, <b>mère-enfant</b>.', 'Le VIH ne se transmet pas par le contact de la vie quotidienne.'],
        ar: { e: ['ينتقل الفيروس عبر الدم، والعلاقات الجنسية غير المحمية، ومن الأم إلى طفلها أثناء الحمل أو الولادة أو الرضاعة. ولا ينتقل بالمصافحة ولا بالتقبيل ولا بالأكواب ولا بلسعة البعوض ولا بالعيش مع المصاب. للوقاية: الواقي الذكري، وأدوات حادة تُستعمل مرة واحدة، والكشف المبكر.'], u: 'اضغط على كل لسان لتقرأ المعلومة.', w: [['transmission', 'انتقال العدوى'], ['dépistage', 'الكشف'], ['préservatif', 'الواقي الذكري']] } },
      { short: 'Allergie', title: 'L’allergie', intro: 'Une réponse exagérée à une substance normalement inoffensive.', build: allergie,
        retenir: ['Une <b>allergie</b> est une réponse immunitaire excessive à un <b>allergène</b> inoffensif.', 'Elle apparaît au <b>deuxième contact</b> avec l’allergène, par libération d’<b>histamine</b>.'],
        ar: { e: ['الحساسية استجابة مناعية مبالغ فيها تجاه مادة غير ضارة تسمى المُحسِّس (allergène). في الاتصال الأول يصنع الجسم أجساما مضادة تتثبت على بعض الخلايا، وفي الاتصال الثاني تتحرر مادة الهيستامين فتظهر أعراض سريعة: عطاس، حكة، انتفاخ. وقد تكون الحالة خطيرة وتتطلب الاستعجال الطبي.'], u: 'اضغط «Étape suivante» لتتبع آلية الحساسية.', w: [['allergie', 'الحساسية'], ['allergène', 'مُحسِّس'], ['histamine', 'الهيستامين']] } },
      { short: 'Transfusion', title: 'Les problèmes liés à la transfusion sanguine', intro: 'Choisis un donneur et un receveur : la transfusion est-elle possible ?', build: transfusion,
        retenir: ['Les globules rouges portent des <b>antigènes</b> A et/ou B selon le groupe sanguin (A, B, AB, O).', 'Le plasma contient les <b>anticorps</b> contre les antigènes absents.', 'Un mélange incompatible provoque une <b>agglutination</b>. On tient aussi compte du facteur <b>Rhésus</b>.'],
        ar: { e: ['تحمل الكريات الحمراء مستضدات A أو B أو الاثنين معا حسب فصيلة الدم (A وB وAB وO). ويحتوي البلازما على أجسام مضادة ضد المستضدات الغائبة عن الكريات الحمراء للشخص. إذا نُقل دم غير متوافق تتثبت الأجسام المضادة للمتلقي على كريات المعطي فتتراص وتسد الأوعية. ويُراعى كذلك العامل الريزوسي.'], u: 'اختر فصيلة المعطي ثم فصيلة المتلقي لترى هل النقل ممكن.', w: [['groupe sanguin', 'فصيلة الدم'], ['agglutination', 'تراص'], ['donneur', 'معطٍ'], ['receveur', 'متلقٍّ'], ['Rhésus', 'العامل الريزوسي']] } },
      { short: 'Hygiène', title: 'Hygiène de l’appareil reproducteur', intro: 'Quelques règles simples de santé.', build: hygieneRepro,
        retenir: ['Toilette quotidienne, consultation médicale en cas de signe inhabituel et prévention des <b>IST</b>.'],
        ar: { e: ['للمحافظة على سلامة الجهاز التناسلي: نظافة يومية بالماء والصابون الخفيف، وتغيير الملابس الداخلية بانتظام، واستشارة الطبيب عند ظهور ألم أو حكة أو إفرازات غير عادية، والوقاية من الأمراض المنقولة جنسيا.'], w: [['hygiène', 'النظافة'], ['IST', 'الأمراض المنقولة جنسيا']] } }
    ]; },
    quiz: [
      { q: 'Le VIH détruit surtout :', o: ['les lymphocytes T4', 'les globules rouges', 'les plaquettes'], a: 0, e: 'Les défenses de l’organisme s’affaiblissent.' },
      { q: 'Le VIH peut se transmettre par :', o: ['des rapports sexuels non protégés', 'une poignée de main', 'un moustique'], a: 0, e: 'Aussi par le sang et de la mère à l’enfant.' },
      { q: 'Une personne du groupe O donne à une personne du groupe A : la transfusion est :', o: ['possible (O donne aux autres groupes)', 'impossible', 'possible seulement au groupe B'], a: 0, e: 'Les globules rouges O n’ont pas d’antigène A ni B.' }
    ] });

  /* ===================================================== 2e ANNÉE · 1. TECTONIQUE DES PLAQUES */
  var EY1 = '1<sup>re</sup> année · ', EY2 = '2<sup>e</sup> année · ';
  function terre(el) {
    explorer(el, [
      { id: 'cr', t: 'Croûte', c: P, d: 'La couche la plus mince et la plus externe. Elle est plus fine sous les océans que sous les continents. Elle est solide et on y vit.' },
      { id: 'ma', t: 'Manteau', c: C, d: 'Couche épaisse, d’environ 2 900 km. Elle est solide mais très chaude. À l’échelle de millions d’années, la roche du manteau s’écoule très lentement.' },
      { id: 'ne', t: 'Noyau externe', c: '#e9b84a', d: 'Fer et nickel à l’état <b>liquide</b>. Il est très chaud.' },
      { id: 'ni', t: 'Noyau interne', c: RED, d: 'Une boule de fer et de nickel <b>solide</b> au centre de la Terre, malgré une température très élevée.' },
      { id: 'li', t: 'Lithosphère', c: T, d: 'La croûte et la partie supérieure du manteau forment une couche rigide d’une centaine de kilomètres : la lithosphère. Elle est découpée en <b>plaques</b>.' }
    ]);
  }
  function derive(el) {
    explorer(el, [
      { id: 'co', t: 'Côtes', c: P, d: 'Les côtes de l’Amérique du Sud et de l’Afrique s’emboîtent comme les pièces d’un puzzle.' },
      { id: 'fo', t: 'Fossiles', c: C, d: 'On trouve les mêmes fossiles (le reptile d’eau douce <i>Mesosaurus</i>, la plante <i>Glossopteris</i>) en Amérique du Sud et en Afrique, alors qu’un océan les sépare.' },
      { id: 'ro', t: 'Roches', c: L, d: 'Des roches de même âge et de même nature, et des chaînes de montagnes, se prolongent d’un continent à l’autre.' },
      { id: 'gl', t: 'Glaciers', c: BLUE, d: 'Des traces d’anciens glaciers existent sur des continents aujourd’hui éloignés et situés sous des climats chauds.' },
      { id: 'we', t: 'Wegener', c: T, d: 'En 1912, Alfred Wegener propose que les continents se déplacent : c’est la <b>dérive des continents</b>. Il ne sait pas expliquer la force qui les déplace. L’idée est confirmée dans les années 1960 avec l’étude des fonds océaniques.' }
    ]);
  }
  function limites(el) {
    var types = [['div', 'Divergente'], ['con', 'Convergente'], ['tra', 'Transformante']], cur = 'div';
    ui.tabs(el, types, function (v) { cur = v; draw(); });
    var svg = ui.stage(el, 400, 210, 'Les trois types de limites entre plaques'), g = S('g', null, svg), info = ui.info(el);
    function arrow(x1, y1, x2, y2) {
      S('path', { d: 'M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2, style: 'stroke:#fff;stroke-width:4;stroke-linecap:round;fill:none' }, g);
      var a = Math.atan2(y2 - y1, x2 - x1), s = 9;
      S('path', { d: 'M' + x2 + ' ' + y2 + 'L' + (x2 - s * Math.cos(a - .5)) + ' ' + (y2 - s * Math.sin(a - .5)) + 'M' + x2 + ' ' + y2 + 'L' + (x2 - s * Math.cos(a + .5)) + ' ' + (y2 - s * Math.sin(a + .5)), style: 'stroke:#fff;stroke-width:4;stroke-linecap:round;fill:none' }, g);
    }
    function draw() {
      g.replaceChildren();
      var T1 = 'fill:' + T + ';fill-opacity:.55;stroke:' + T + ';stroke-width:2', P1 = 'fill:' + P + ';fill-opacity:.5;stroke:' + P + ';stroke-width:2', M1 = 'fill:' + C + ';fill-opacity:.7;stroke:' + C + ';stroke-width:2';
      if (cur === 'div') {
        S('path', { d: 'M180 190L180 100L220 100L220 190Z', style: M1 }, g);
        S('path', { d: 'M20 100L180 100L180 140L20 140Z', style: T1 }, g);
        S('path', { d: 'M220 100L380 100L380 140L220 140Z', style: T1 }, g);
        arrow(160, 80, 100, 80); arrow(240, 80, 300, 80);
        label(g, 200, 40, 'dorsale : du magma monte', '#fff', 'middle', 13); label(g, 200, 195, 'magma', '#fff', 'middle', 12);
        info.set('<b>Limite divergente.</b> Deux plaques s’écartent. Du magma monte et se solidifie : il se forme de la nouvelle lithosphère océanique. L’océan s’élargit.');
      } else if (cur === 'con') {
        S('path', { d: 'M20 100L190 100L270 175L270 195L185 125L20 125Z', style: T1 }, g);
        S('path', { d: 'M195 85L380 85L380 150L235 150L195 118Z', style: P1 }, g);
        S('path', { d: 'M300 85L322 58L344 85Z', style: M1 }, g);
        arrow(40, 80, 110, 80);
        label(g, 120, 160, 'plaque qui plonge', '#fff', 'middle', 12); label(g, 320, 125, 'plaque chevauchante', '#fff', 'middle', 12); label(g, 322, 48, 'volcan', '#fff', 'middle', 12);
        info.set('<b>Limite convergente.</b> Deux plaques se rapprochent. La plus dense plonge sous l’autre : c’est la <b>subduction</b>. On y trouve des séismes, des volcans et des chaînes de montagnes.');
      } else {
        S('path', { d: 'M20 30L190 30L190 190L20 190Z', style: T1 }, g);
        S('path', { d: 'M210 30L380 30L380 190L210 190Z', style: P1 }, g);
        S('path', { d: 'M200 30L200 190', style: 'stroke:#fff;stroke-width:2;stroke-dasharray:6 6;fill:none' }, g);
        arrow(105, 150, 105, 70); arrow(295, 70, 295, 150);
        label(g, 200, 20, 'faille', '#fff', 'middle', 12);
        info.set('<b>Limite transformante.</b> Deux plaques glissent l’une contre l’autre, sans que de la lithosphère soit créée ou détruite. Les frottements provoquent de nombreux séismes.');
      }
    }
    draw();
  }
  function seisme(el) {
    stepper(el, { label: 'Comment naît un séisme', h: 200, nodes: [
      { id: 'pl', x: 40, y: 80, t: 'Plaques', c: T }, { id: 'co', x: 125, y: 80, t: 'Contraintes', c: '#e9b84a', row: 1 }, { id: 'ru', x: 210, y: 80, t: 'Rupture', c: RED },
      { id: 'on', x: 295, y: 80, t: 'Ondes', c: L, row: 1 }, { id: 'se', x: 375, y: 80, t: 'Secousse', c: C }
    ], links: [['pl', 'co'], ['co', 'ru'], ['ru', 'on'], ['on', 'se']], steps: [
      { on: ['pl'], t: 'Les plaques bougent lentement, de quelques centimètres par an.' },
      { on: ['pl', 'co'], t: 'Les roches se déforment et accumulent de l’énergie : ce sont les contraintes.' },
      { on: ['co', 'ru'], t: 'Quand la limite de résistance est dépassée, les roches se cassent d’un coup. Le point de rupture est le <b>foyer</b>.' },
      { on: ['ru', 'on'], t: 'Des ondes sismiques partent du foyer dans toutes les directions.' },
      { on: ['on', 'se'], t: 'Elles arrivent en surface. Le point situé juste au-dessus du foyer est l’<b>épicentre</b> : c’est là que la secousse est la plus forte.' }
    ] });
  }
  function seismeRisque(el) {
    explorer(el, [
      { id: 'me', t: 'Mesurer', c: T, d: 'Le <b>sismographe</b> enregistre les ondes. La <b>magnitude</b> mesure l’énergie libérée (échelle de Richter). L’<b>intensité</b> décrit les effets en un lieu (dégâts, ressenti).' },
      { id: 'lo', t: 'Où ?', c: P, d: 'Les séismes sont nombreux le long des limites de plaques. Le nord du Maroc est près de la limite entre les plaques africaine et eurasienne. Le séisme d’Al Hoceima (2004) et celui d’Al Haouz (2023) l’ont montré.' },
      { id: 'av', t: 'Avant', c: C, d: 'Construire selon les normes parasismiques. Préparer un plan familial et un lieu de rassemblement. Fixer les meubles lourds.' },
      { id: 'pe', t: 'Pendant', c: RED, d: 'Se mettre à l’abri sous un meuble solide ou contre un mur porteur. S’éloigner des fenêtres. Ne pas utiliser l’ascenseur.' },
      { id: 'ap', t: 'Après', c: L, d: 'Sortir calmement par les escaliers. Rejoindre un endroit dégagé, loin des bâtiments. Rester attentif aux répliques.' }
    ]);
  }
  function volcan(el) {
    stepper(el, { label: 'Une éruption volcanique', h: 200, nodes: [
      { id: 'ch', x: 40, y: 80, t: 'Chambre magmatique', c: RED }, { id: 'cm', x: 125, y: 80, t: 'Cheminée', c: C, row: 1 }, { id: 'cr', x: 210, y: 80, t: 'Cratère', c: '#e9b84a' },
      { id: 'pr', x: 295, y: 80, t: 'Projections', c: L, row: 1 }, { id: 'co', x: 375, y: 80, t: 'Coulée', c: P }
    ], links: [['ch', 'cm'], ['cm', 'cr'], ['cr', 'pr'], ['pr', 'co']], steps: [
      { on: ['ch'], t: 'Du magma (roche fondue) s’accumule en profondeur dans une chambre magmatique.' },
      { on: ['ch', 'cm'], t: 'Les gaz poussent le magma vers le haut par la cheminée.' },
      { on: ['cm', 'cr'], t: 'Le magma arrive en surface par le cratère.' },
      { on: ['cr', 'pr'], t: 'Des gaz, des cendres et des blocs sont projetés dans l’air.' },
      { on: ['pr', 'co'], t: 'Le magma qui sort s’appelle <b>lave</b>. Elle coule, refroidit et se solidifie. En s’accumulant, elle construit le cône du volcan.' }
    ] });
  }
  function volcanTypes(el) {
    explorer(el, [
      { id: 'ef', t: 'Effusif', c: C, d: 'Lave fluide qui coule en longues coulées. Éruption peu violente. Exemple : le Piton de la Fournaise (La Réunion).' },
      { id: 'ex', t: 'Explosif', c: RED, d: 'Lave visqueuse et riche en gaz. Éruption violente, avec cendres et nuées ardentes. Exemple : le Vésuve.' },
      { id: 'lo', t: 'Où sont-ils ?', c: P, d: 'Surtout le long des limites de plaques (la « ceinture de feu » du Pacifique) et au-dessus de zones très chaudes du manteau appelées points chauds (Hawaï). Le Maroc n’a pas de volcan actif.' },
      { id: 'ri', t: 'Risques', c: L, d: 'Coulées, cendres, gaz toxiques. Les volcans fertilisent aussi les sols. On surveille les volcans actifs pour évacuer à temps.' }
    ]);
  }
  function montagnes(el) {
    stepper(el, { label: 'Comment naît une chaîne de montagnes', h: 200, nodes: [
      { id: 'pl', x: 40, y: 80, t: 'Deux plaques', c: T }, { id: 'ra', x: 125, y: 80, t: 'Rapprochement', c: C, row: 1 }, { id: 'co', x: 210, y: 80, t: 'Compression', c: '#e9b84a' },
      { id: 'pf', x: 295, y: 80, t: 'Plis et failles', c: L, row: 1 }, { id: 'ch', x: 375, y: 80, t: 'Chaîne', c: P }
    ], links: [['pl', 'ra'], ['ra', 'co'], ['co', 'pf'], ['pf', 'ch']], steps: [
      { on: ['pl'], t: 'Deux plaques continentales sont séparées par un océan ou une mer.' },
      { on: ['pl', 'ra'], t: 'Elles se rapprochent. L’océan se referme peu à peu.' },
      { on: ['ra', 'co'], t: 'Les roches et les sédiments sont comprimés entre les deux continents.' },
      { on: ['co', 'pf'], t: 'Les roches se plient (plis) et se cassent (failles). Des couches se superposent.' },
      { on: ['pf', 'ch'], t: 'La croûte s’épaissit et se soulève : une chaîne de montagnes apparaît. Exemples : l’Himalaya (Inde et Asie) ; l’Atlas résulte en partie du rapprochement de l’Afrique et de l’Europe.' }
    ] });
  }
  PC.chapter({ id: 's2-1', lazy: true, eyebrow: EY2 + 'Géologie', title: 'La tectonique des plaques', ar: 'تكتونية الصفائح',
    lessons: function () { return [
      { label: 'Leçon 1 · ' + APPRO, short: 'La Terre', title: 'La structure interne de la Terre', intro: 'Touche chaque couche pour découvrir sa nature.', build: terre,
        retenir: ['La Terre comprend la <b>croûte</b>, le <b>manteau</b> et le <b>noyau</b>.', 'La <b>lithosphère</b> rigide (croûte et haut du manteau) est découpée en plaques.'],
        ar: { e: ['تتكون الأرض من القشرة والجبة والنواة. القشرة أرق طبقة، والجبة صخور ساخنة سميكة، والنواة الخارجية سائلة من الحديد والنيكل، والنواة الداخلية صلبة. القشرة وجزء من الجبة العليا يكوّنان الغلاف الصخري الصلب، وهو مقسّم إلى صفائح.'], u: 'اضغط على كل طبقة لتقرأ خصائصها.', w: [['croûte', 'القشرة'], ['manteau', 'الجبة'], ['noyau', 'النواة'], ['lithosphère', 'الغلاف الصخري']] } },
      { short: 'Dérive', title: 'La dérive des continents', intro: 'Quels arguments ont convaincu Wegener ?', build: derive,
        retenir: ['Wegener propose en 1912 que les continents se déplacent.', 'Arguments : emboîtement des côtes, fossiles identiques, roches et montagnes continues, traces de glaciers.'],
        ar: { e: ['اقترح فيغنر سنة 1912 أن القارات تتحرك. من حججه: تطابق سواحل أمريكا الجنوبية وإفريقيا، وتشابه الأحافير على قارتين يفصل بينهما محيط، واستمرار الصخور وسلاسل الجبال من قارة إلى أخرى، وآثار جليدية قديمة. لم يعرف فيغنر القوة المحركة، وتأكدت فكرته في الستينيات بدراسة قاع المحيطات.'], u: 'اضغط على كل حجة لتقرأها.', w: [['dérive des continents', 'زحزحة القارات'], ['fossile', 'أحفورة'], ['emboîtement', 'تطابق']] } },
      { short: 'Plaques', title: 'Les plaques et leurs limites', intro: 'Choisis un type de limite pour voir le mouvement des plaques.', build: limites,
        retenir: ['Limite <b>divergente</b> : les plaques s’écartent, de la lithosphère se crée.', 'Limite <b>convergente</b> : les plaques se rapprochent (subduction ou collision).', 'Limite <b>transformante</b> : les plaques coulissent.'],
        ar: { e: ['الصفائح تتحرك ببطء، بضعة سنتيمترات في السنة. عند الحدود التباعدية تتباعد صفيحتان فيصعد صهارة ويتكون غلاف صخري جديد. عند الحدود التقاربية تتقارب صفيحتان، فتغوص إحداهما تحت الأخرى (اندساس) أو تتصادمان. عند الحدود التحويلية تنزلق صفيحتان بجانب بعضهما، وتحدث زلازل كثيرة.'], u: 'اختر نوع الحد لترى حركة الصفيحتين.', w: [['plaque', 'صفيحة'], ['subduction', 'اندساس'], ['dorsale', 'ظهر محيطي'], ['faille', 'صدع']] } },
      { short: 'Séismes', title: 'Les séismes', intro: 'Suis les étapes d’un séisme, puis lis les conseils de protection.', build: function (el) { seisme(el); seismeRisque(el); },
        retenir: ['Un séisme est une rupture brutale des roches. Le <b>foyer</b> est en profondeur, l’<b>épicentre</b> en surface au-dessus.', 'Se mettre à l’abri, loin des fenêtres, et ne pas utiliser l’ascenseur.'],
        ar: { e: ['الزلزال انكسار مفاجئ للصخور بعد تراكم الإجهادات. نقطة الانكسار في العمق هي البؤرة، والنقطة التي فوقها على سطح الأرض هي مركز الزلزال السطحي. تُسجَّل الأمواج الزلزالية بجهاز تسجيل الزلازل، ويقيس قدر الزلزال الطاقة المحررة. أثناء الزلزال: احتمِ تحت أثاث متين وابتعد عن النوافذ ولا تستعمل المصعد.'], u: 'اضغط «Étape suivante» ثم اقرأ نصائح الوقاية.', w: [['séisme', 'زلزال'], ['foyer', 'بؤرة'], ['épicentre', 'مركز سطحي'], ['magnitude', 'قدر الزلزال']] } },
      { short: 'Volcans', title: 'Les volcans', intro: 'De la chambre magmatique à la coulée de lave.', build: function (el) { volcan(el); volcanTypes(el); },
        retenir: ['Un volcan rejette du <b>magma</b> (appelé lave en surface), des gaz et des cendres.', 'Les volcans sont surtout situés aux limites de plaques et aux points chauds.'],
        ar: { e: ['البركان فتحة في القشرة يخرج منها الصهارة، وتسمى حمما عند وصولها إلى السطح، مع غازات ورماد. تتراكم الصهارة في غرفة صهارية ثم تصعد عبر المدخنة وتخرج من الفوهة. من البراكين ما هو دفقي حممه سائلة، ومنها ما هو انفجاري عنيف. توجد البراكين غالبا عند حدود الصفائح وفوق النقاط الساخنة. لا يوجد بركان نشط في المغرب.'], u: 'اضغط «Étape suivante» ثم اختر نوع البركان.', w: [['volcan', 'بركان'], ['magma', 'صهارة'], ['lave', 'حمم'], ['cratère', 'فوهة']] } },
      { label: 'Leçon 6 · ' + APPRO, short: 'Montagnes', title: 'La formation des chaînes de montagnes', intro: 'Avance étape par étape pour voir naître une chaîne.', build: montagnes,
        retenir: ['Les chaînes de montagnes se forment à la <b>convergence</b> de plaques.', 'Les roches se plient (plis) et se cassent (failles).'],
        ar: { e: ['تتكون سلاسل الجبال عند تقارب صفيحتين قاريتين. تنضغط الصخور والرواسب بينهما فتنثني (طيّات) وتنكسر (صدوع)، ثم تتسمك القشرة وترتفع فتظهر سلسلة جبلية. من الأمثلة جبال الهيمالايا، وجبال الأطلس التي نتجت جزئيا عن تقارب إفريقيا وأوروبا.'], u: 'اضغط «Étape suivante» لتتبع تكوّن الجبال.', w: [['chaîne de montagnes', 'سلسلة جبلية'], ['pli', 'طية'], ['compression', 'انضغاط']] } }
    ]; },
    quiz: [
      { q: 'La partie rigide formée par la croûte et le haut du manteau est :', o: ['la lithosphère', 'le noyau', 'l’atmosphère'], a: 0, e: 'Elle est découpée en plaques.' },
      { q: 'Quand deux plaques s’écartent, la limite est :', o: ['divergente', 'convergente', 'transformante'], a: 0, e: 'De la nouvelle lithosphère se forme.' },
      { q: 'Le point en surface situé juste au-dessus du foyer d’un séisme est :', o: ['l’épicentre', 'le cratère', 'la dorsale'], a: 0, e: 'C’est là que la secousse est la plus forte.' }
    ] });

  /* ===================================================== 2e ANNÉE · 2. REPRODUCTION CHEZ LES ANIMAUX */
  function typesRepro(el) {
    explorer(el, [
      { id: 'ov', t: 'Ovipares', c: C, d: 'Les petits se développent dans un <b>œuf pondu</b> hors du corps de la mère : poule, tortue, crocodile, poissons, grenouille. Le jeune sort de l’œuf à l’éclosion.' },
      { id: 'vi', t: 'Vivipares', c: P, d: 'Le petit se développe <b>dans le corps de la mère</b> et naît déjà formé : chat, vache, chèvre, dauphin, être humain.' },
      { id: 'fi', t: 'Fécondation interne', c: L, d: 'Les gamètes se rencontrent à l’intérieur du corps de la femelle : oiseaux, reptiles, mammifères.' },
      { id: 'fe', t: 'Fécondation externe', c: BLUE, d: 'Les gamètes sont lâchés dans l’eau et se rencontrent dehors : beaucoup de poissons, grenouilles. Il y a beaucoup d’œufs car beaucoup sont perdus.' }
    ]);
  }
  function fecondation(el) {
    stepper(el, { label: 'De la fécondation au jeune animal', h: 200, nodes: [
      { id: 'ga', x: 40, y: 80, t: 'Gamètes', c: T }, { id: 'fe', x: 125, y: 80, t: 'Fécondation', c: P, row: 1 }, { id: 'oe', x: 210, y: 80, t: 'Œuf', c: '#e9b84a' },
      { id: 'em', x: 295, y: 80, t: 'Embryon', c: L, row: 1 }, { id: 'je', x: 375, y: 80, t: 'Jeune', c: C }
    ], links: [['ga', 'fe'], ['fe', 'oe'], ['oe', 'em'], ['em', 'je']], steps: [
      { on: ['ga'], t: 'Le mâle fabrique des spermatozoïdes (dans les testicules). La femelle fabrique des ovules (dans les ovaires).' },
      { on: ['ga', 'fe'], t: 'Fécondation : un spermatozoïde pénètre dans un ovule et leurs noyaux fusionnent.' },
      { on: ['fe', 'oe'], t: 'Il se forme une cellule-œuf, qui contient l’information des deux parents.' },
      { on: ['oe', 'em'], t: 'La cellule-œuf se divise de nombreuses fois et forme l’embryon.' },
      { on: ['em', 'je'], t: 'L’embryon devient un jeune. Chez certains animaux, une métamorphose a lieu : le têtard devient grenouille.' }
    ] });
  }
  PC.chapter({ id: 's2-2', lazy: true, eyebrow: EY2 + 'Reproduction', title: 'La reproduction chez les animaux', ar: 'التوالد عند الحيوانات',
    lessons: function () { return [
      { short: 'Types', title: 'Ovipares, vivipares et fécondation', intro: 'Touche chaque onglet pour comparer les modes de reproduction.', build: typesRepro,
        retenir: ['Les animaux <b>ovipares</b> pondent des œufs. Les <b>vivipares</b> gardent le petit dans leur corps.', 'La fécondation peut être <b>interne</b> ou <b>externe</b>.'],
        ar: { e: ['الحيوانات البيوضة تضع بيضا ينمو فيه الجنين خارج جسم الأم، مثل الدجاجة والسلحفاة. الحيوانات الولودة ينمو الجنين داخل جسم الأم، مثل القطة والبقرة والإنسان. الإخصاب داخلي حين يلتقي الأمشاج داخل جسم الأنثى، وخارجي حين تُطرح الأمشاج في الماء كما عند الضفدعة وكثير من الأسماك.'], u: 'اضغط على كل لسان لتقرأ المعلومة.', w: [['ovipare', 'بيوض'], ['vivipare', 'ولود'], ['fécondation', 'إخصاب'], ['gamète', 'مشيج']] } },
      { short: 'Cycle', title: 'De la fécondation au jeune', intro: 'Suis les étapes du développement.', build: fecondation,
        retenir: ['La <b>fécondation</b> est la fusion d’un spermatozoïde et d’un ovule : elle donne une <b>cellule-œuf</b>.', 'La cellule-œuf se divise et forme l’embryon.'],
        ar: { e: ['يصنع الذكر الحيوانات المنوية في الخصيتين، وتصنع الأنثى البويضات في المبيضين. الإخصاب اندماج حيوان منوي ببويضة، وينتج عنه بيضة (لاقحة) تنقسم مرات كثيرة لتكوّن الجنين. عند بعض الحيوانات تحدث استحالة، مثل تحول الشرغوف إلى ضفدع. وبيض الدجاج الذي نأكله غير مخصب ولا يعطي صوصا.'], u: 'اضغط «Étape suivante» لتتبع مراحل النمو.', w: [['spermatozoïde', 'حيوان منوي'], ['ovule', 'بويضة'], ['embryon', 'جنين'], ['métamorphose', 'استحالة']] } }
    ]; },
    quiz: [
      { q: 'Un animal qui pond des œufs est :', o: ['ovipare', 'vivipare', 'herbivore'], a: 0, e: 'Les ovipares se développent dans un œuf.' },
      { q: 'Où a lieu la fécondation chez la grenouille ?', o: ['Dans l’eau, hors du corps', 'Dans l’utérus', 'Dans l’estomac'], a: 0, e: 'C’est une fécondation externe.' },
      { q: 'La fusion d’un spermatozoïde et d’un ovule s’appelle :', o: ['la fécondation', 'la digestion', 'la germination'], a: 0, e: 'Elle donne une cellule-œuf.' }
    ] });

  /* ===================================================== 2e ANNÉE · 3. REPRODUCTION CHEZ LES PLANTES À FLEURS */
  function fleur(el) {
    var svg = ui.stage(el, 400, 250, 'Schéma d’une fleur'), g = S('g', null, svg);
    var parts = [
      { id: 'se', t: 'Sépales', c: T, d: 'Petites feuilles vertes à la base de la fleur. Elles protègent le bouton floral.' },
      { id: 'pe', t: 'Pétales', c: P, d: 'Souvent colorés et parfumés. Ils attirent les insectes pollinisateurs.' },
      { id: 'et', t: 'Étamines', c: '#e9b84a', d: 'Organes mâles. L’<b>anthère</b>, portée par un filet, contient les grains de <b>pollen</b>.' },
      { id: 'pi', t: 'Pistil', c: RED, d: 'Organe femelle. Il comprend le <b>stigmate</b> (qui reçoit le pollen), le <b>style</b> et l’<b>ovaire</b> qui contient les ovules.' }
    ];
    S('path', { d: 'M200 230L200 150', style: 'stroke:#6ccdb6;stroke-width:8;stroke-linecap:round;fill:none' }, g);
    S('ellipse', { cx: 150, cy: 140, rx: 45, ry: 14, style: 'fill:#6ccdb6;fill-opacity:.55', transform: 'rotate(18 150 140)' }, g);
    S('ellipse', { cx: 250, cy: 140, rx: 45, ry: 14, style: 'fill:#6ccdb6;fill-opacity:.55', transform: 'rotate(-18 250 140)' }, g);
    [[-60, 30], [60, 30], [-35, -10], [35, -10]].forEach(function (p) {
      S('ellipse', { cx: 200 + p[0], cy: 90 + p[1] / 2, rx: 26, ry: 40, style: 'fill:' + P + ';fill-opacity:.55;stroke:' + P + ';stroke-width:2', transform: 'rotate(' + (p[0] * .6) + ' ' + (200 + p[0]) + ' ' + (90 + p[1] / 2) + ')' }, g);
    });
    S('path', { d: 'M200 150L200 70', style: 'stroke:' + RED + ';stroke-width:6;stroke-linecap:round;fill:none' }, g);
    S('circle', { cx: 200, cy: 66, r: 8, style: 'fill:' + RED }, g);
    S('ellipse', { cx: 200, cy: 150, rx: 12, ry: 16, style: 'fill:' + RED + ';fill-opacity:.8' }, g);
    [[-24, 90], [24, 90]].forEach(function (p) {
      S('path', { d: 'M200 150L' + (200 + p[0]) + ' ' + p[1], style: 'stroke:#e9b84a;stroke-width:3;fill:none' }, g);
      S('ellipse', { cx: 200 + p[0], cy: p[1] - 4, rx: 8, ry: 6, style: 'fill:#e9b84a' }, g);
    });
    label(g, 128, 170, 'sépale', '#fff', 'end', 12); label(g, 150, 60, 'pétale', '#fff', 'end', 12);
    label(g, 235, 82, 'anthère', '#fff', 'start', 12); label(g, 215, 66, 'stigmate', '#fff', 'start', 12); label(g, 218, 155, 'ovaire', '#fff', 'start', 12);
    explorer(el, parts);
  }
  function pollin(el) {
    stepper(el, { label: 'De la fleur au fruit', h: 200, nodes: [
      { id: 'po', x: 40, y: 80, t: 'Pollinisation', c: '#e9b84a' }, { id: 'tu', x: 125, y: 80, t: 'Tube pollinique', c: P, row: 1 }, { id: 'fe', x: 210, y: 80, t: 'Fécondation', c: L },
      { id: 'gr', x: 295, y: 80, t: 'Graine et fruit', c: C, row: 1 }, { id: 'ge', x: 375, y: 80, t: 'Germination', c: T }
    ], links: [['po', 'tu'], ['tu', 'fe'], ['fe', 'gr'], ['gr', 'ge']], steps: [
      { on: ['po'], t: 'Le pollen de l’anthère est transporté jusqu’au stigmate par le vent, les insectes ou les oiseaux : c’est la pollinisation.' },
      { on: ['po', 'tu'], t: 'Le grain de pollen germe sur le stigmate et forme un tube qui descend dans le style.' },
      { on: ['tu', 'fe'], t: 'Le tube arrive à l’ovule. Un gamète mâle fusionne avec le gamète femelle de l’ovule : c’est la fécondation.' },
      { on: ['fe', 'gr'], t: 'L’ovule devient une <b>graine</b>. L’ovaire devient un <b>fruit</b> qui protège les graines. La fleur se fane.' },
      { on: ['gr', 'ge'], t: 'La graine tombe sur un sol humide. Avec de l’eau, de l’air et une température convenable, elle germe et donne une nouvelle plante.' }
    ] });
  }
  PC.chapter({ id: 's2-3', lazy: true, eyebrow: EY2 + 'Reproduction', title: 'La reproduction chez les plantes à fleurs', ar: 'التوالد عند النباتات الزهرية',
    lessons: function () { return [
      { short: 'La fleur', title: 'Les organes de la fleur', intro: 'Touche une partie de la fleur pour voir son rôle.', build: fleur,
        retenir: ['Les <b>étamines</b> (organes mâles) portent le pollen.', 'Le <b>pistil</b> (organe femelle) contient les ovules dans l’ovaire.'],
        ar: { e: ['تتكون الزهرة من السبلات التي تحمي البرعم، والبتلات الملونة التي تجذب الحشرات، والأسدية وهي العضو المذكر وتحمل الأسدية المتك الذي يحتوي حبوب اللقاح، والمدقّة وهي العضو المؤنث وتتكون من الميسم والقلم والمبيض الذي يحتوي البويضات.'], u: 'اضغط على كل جزء من الزهرة لتقرأ دوره.', w: [['étamine', 'سداة'], ['pistil', 'مدقة'], ['pollen', 'غبار الطلع'], ['ovule', 'بويضة'], ['stigmate', 'ميسم']] } },
      { short: 'Fécondation', title: 'De la pollinisation à la graine', intro: 'Avance étape par étape jusqu’à la germination.', build: pollin,
        retenir: ['<b>Pollinisation</b> : transport du pollen vers le stigmate.', 'Après la fécondation, l’ovule devient <b>graine</b> et l’ovaire devient <b>fruit</b>.', 'La germination demande de l’eau, de l’air et une température convenable.'],
        ar: { e: ['التلقيح هو انتقال حبوب اللقاح من المتك إلى الميسم بواسطة الرياح أو الحشرات. تنبت حبة اللقاح فتكوّن أنبوبا يصل إلى البويضة فيحدث الإخصاب. بعد الإخصاب تتحول البويضة إلى بذرة ويتحول المبيض إلى ثمرة. وتحتاج البذرة للإنبات إلى الماء والهواء وحرارة مناسبة.'], u: 'اضغط «Étape suivante» لتتبع المراحل.', w: [['pollinisation', 'تلقيح'], ['graine', 'بذرة'], ['fruit', 'ثمرة'], ['germination', 'إنبات']] } }
    ]; },
    quiz: [
      { q: 'Quel organe de la fleur contient le pollen ?', o: ['L’anthère', 'L’ovaire', 'Le stigmate'], a: 0, e: 'L’anthère fait partie de l’étamine.' },
      { q: 'Après la fécondation, l’ovaire devient :', o: ['un fruit', 'une racine', 'un pétale'], a: 0, e: 'Le fruit protège les graines.' },
      { q: 'La pollinisation est :', o: ['le transport du pollen vers le stigmate', 'la sortie de la plantule', 'la chute des pétales'], a: 0, e: 'Les insectes et le vent y participent.' }
    ] });

  /* ===================================================== 2e ANNÉE · 4. REPRODUCTION CHEZ L’HOMME */
  function appareils(el) {
    explorer(el, [
      { id: 'te', t: 'Testicules', c: T, d: 'Chez l’homme, ils fabriquent les <b>spermatozoïdes</b> à partir de la puberté, ainsi qu’une hormone, la testostérone.' },
      { id: 'vo', t: 'Voies masculines', c: C, d: 'Canaux déférents, vésicules séminales et prostate ajoutent un liquide aux spermatozoïdes pour former le <b>sperme</b>, évacué par l’urètre.' },
      { id: 'ov', t: 'Ovaires', c: P, d: 'Chez la femme, ils contiennent des cellules qui deviennent des <b>ovules</b>. Un ovule est libéré environ une fois par mois : c’est l’ovulation.' },
      { id: 'tr', t: 'Trompes', c: L, d: 'Deux tubes qui recueillent l’ovule. C’est là que se produit en général la <b>fécondation</b>.' },
      { id: 'ut', t: 'Utérus', c: RED, d: 'Un organe musclé dont la paroi s’épaissit chaque mois. Il accueille l’embryon et le fœtus pendant la grossesse.' }
    ]);
  }
  function grossesse(el) {
    stepper(el, { label: 'De la fécondation à la naissance', h: 200, nodes: [
      { id: 'fe', x: 40, y: 80, t: 'Fécondation', c: P }, { id: 'di', x: 125, y: 80, t: 'Divisions', c: '#e9b84a', row: 1 }, { id: 'ni', x: 210, y: 80, t: 'Nidation', c: C },
      { id: 'fo', x: 295, y: 80, t: 'Développement', c: L, row: 1 }, { id: 'na', x: 375, y: 80, t: 'Naissance', c: T }
    ], links: [['fe', 'di'], ['di', 'ni'], ['ni', 'fo'], ['fo', 'na']], steps: [
      { on: ['fe'], t: 'Dans la trompe, un spermatozoïde féconde l’ovule : une cellule-œuf se forme.' },
      { on: ['fe', 'di'], t: 'La cellule-œuf se divise tout en glissant vers l’utérus.' },
      { on: ['di', 'ni'], t: 'Environ une semaine plus tard, l’embryon s’installe dans la paroi de l’utérus : c’est la <b>nidation</b>.' },
      { on: ['ni', 'fo'], t: 'Le placenta et le cordon ombilical apportent dioxygène et nutriments et évacuent les déchets. L’embryon devient un fœtus.' },
      { on: ['fo', 'na'], t: 'Après environ neuf mois, l’accouchement a lieu. Le nouveau-né est ensuite nourri par l’allaitement.' }
    ] });
  }
  function contraception(el) {
    explorer(el, [
      { id: 'pr', t: 'Pourquoi ?', c: T, d: 'Choisir le moment d’avoir un enfant protège la santé de la mère et de l’enfant. C’est le rôle de la <b>régulation des naissances</b> (planning familial).' },
      { id: 'pf', t: 'Préservatif', c: P, d: 'Il empêche la rencontre des spermatozoïdes et de l’ovule. C’est le seul moyen de contraception qui protège aussi contre les infections sexuellement transmissibles.' },
      { id: 'me', t: 'Méthodes médicales', c: C, d: 'Pilule, stérilet (dispositif intra-utérin), implant, injection : ils se prescrivent. Il faut demander conseil à un médecin ou à un centre de planification familiale.' },
      { id: 'av', t: 'Santé', c: L, d: 'Un suivi médical pendant la grossesse (consultations prénatales) et après la naissance protège la mère et l’enfant.' }
    ]);
  }
  PC.chapter({ id: 's2-4', lazy: true, eyebrow: EY2 + 'Reproduction', title: 'La reproduction chez l’Homme', ar: 'التوالد عند الإنسان',
    lessons: function () { return [
      { short: 'Organes', title: 'Les appareils reproducteurs', intro: 'Touche un organe pour lire son rôle.', build: appareils,
        retenir: ['Les <b>testicules</b> fabriquent les spermatozoïdes. Les <b>ovaires</b> libèrent les ovules.', 'La fécondation a lieu dans la <b>trompe</b>. L’embryon se développe dans l’<b>utérus</b>.'],
        ar: { e: ['عند الرجل تصنع الخصيتان الحيوانات المنوية، وتضاف إليها سوائل من الحويصلات المنوية والبروستات لتكوّن المني. عند المرأة تحتوي المبيضان البويضات، وتنطلق بويضة تقريبا مرة كل شهر. تلتقط البوقان البويضة وفيهما يحدث الإخصاب عادة، ويستقبل الرحم الجنين.'], u: 'اضغط على كل عضو لتقرأ دوره.', w: [['testicule', 'خصية'], ['ovaire', 'مبيض'], ['trompe', 'بوق'], ['utérus', 'رحم'], ['ovulation', 'إباضة']] } },
      { short: 'Grossesse', title: 'Fécondation, grossesse et naissance', intro: 'De la rencontre des gamètes à la naissance.', build: grossesse,
        retenir: ['La <b>nidation</b> a lieu dans l’utérus environ une semaine après la fécondation.', 'Le <b>placenta</b> assure les échanges entre la mère et le fœtus.', 'La grossesse dure environ neuf mois.'],
        ar: { e: ['يحدث الإخصاب في البوق فتتكون بيضة تنقسم أثناء انتقالها إلى الرحم. بعد نحو أسبوع يلتصق الجنين بجدار الرحم، وهذا هو الانغراس. تنقل المشيمة والحبل السري الأكسجين والمغذيات إلى الجنين وتأخذ منه الفضلات. بعد نحو تسعة أشهر تحدث الولادة، ثم يتغذى المولود بالرضاعة.'], u: 'اضغط «Étape suivante» لتتبع مراحل الحمل.', w: [['nidation', 'انغراس'], ['placenta', 'مشيمة'], ['fœtus', 'جنين متقدم'], ['allaitement', 'رضاعة']] } },
      { short: 'Naissances', title: 'La régulation des naissances', intro: 'Pourquoi et comment, avec l’aide d’un médecin.', build: contraception,
        retenir: ['La <b>régulation des naissances</b> permet de choisir le moment d’avoir un enfant.', 'Le <b>préservatif</b> protège aussi des IST. Les autres méthodes se choisissent avec un médecin.'],
        ar: { e: ['تنظيم النسل يسمح باختيار وقت إنجاب الطفل ويحمي صحة الأم والطفل. الواقي الذكري يمنع التقاء الحيوانات المنوية بالبويضة ويحمي أيضا من الأمراض المنقولة جنسيا. وتوجد وسائل أخرى توصف بعد استشارة الطبيب أو مركز تنظيم الأسرة. ومتابعة الحمل طبيا مهمة لصحة الأم والجنين.'], u: 'اضغط على كل لسان لتقرأ المعلومة.', w: [['régulation des naissances', 'تنظيم النسل'], ['contraception', 'منع الحمل'], ['IST', 'الأمراض المنقولة جنسيا']] } }
    ]; },
    quiz: [
      { q: 'Où a lieu en général la fécondation ?', o: ['Dans la trompe', 'Dans le vagin', 'Dans l’estomac'], a: 0, e: 'L’œuf descend ensuite vers l’utérus.' },
      { q: 'La nidation est :', o: ['l’installation de l’embryon dans l’utérus', 'la naissance du bébé', 'la libération de l’ovule'], a: 0, e: 'Elle a lieu environ une semaine après la fécondation.' },
      { q: 'Quel organe assure les échanges entre la mère et le fœtus ?', o: ['Le placenta', 'Le foie', 'Le diaphragme'], a: 0, e: 'Il est relié au fœtus par le cordon ombilical.' }
    ] });

  /* ===================================================== 2e ANNÉE · 5. HÉRÉDITÉ CHEZ L’HOMME */
  function chromos(el) {
    explorer(el, [
      { id: 'ch', t: 'Chromosomes', c: P, d: 'Dans le noyau de chaque cellule humaine, il y a <b>46 chromosomes</b>. Ils portent l’information héréditaire.' },
      { id: 'ca', t: 'Caryotype', c: T, d: 'Le <b>caryotype</b> est la photo des chromosomes rangés par paires : 23 paires. Il sert à détecter des anomalies.' },
      { id: 'ga', t: 'Gamètes', c: C, d: 'Un spermatozoïde et un ovule ont chacun <b>23 chromosomes</b>. À la fécondation, la cellule-œuf retrouve 46 chromosomes : 23 du père et 23 de la mère.' },
      { id: 't21', t: 'Trisomie 21', c: L, d: 'Une personne a trois chromosomes 21 au lieu de deux. Dans la grande majorité des cas, elle n’est pas transmise par les parents.' }
    ]);
  }
  function sexe(el) {
    var cur = 'X', n = 0, nf = 0, mem = '';
    ui.text(el, '<b>Le spermatozoïde qui féconde l’ovule porte :</b>');
    ui.tabs(el, [['X', 'Un X'], ['Y', 'Un Y']], function (v) { cur = v; draw(); });
    var svg = ui.stage(el, 400, 170, 'Détermination du sexe de l’enfant'), g = S('g', null, svg), info = ui.info(el);
    function draw() {
      g.replaceChildren();
      var girl = cur === 'X';
      S('circle', { cx: 70, cy: 70, r: 36, style: 'fill:' + P + ';fill-opacity:.4;stroke:' + P + ';stroke-width:3' }, g);
      label(g, 70, 76, 'X', '#fff', 'middle', 22); label(g, 70, 125, 'ovule', '#fff', 'middle', 12);
      S('circle', { cx: 200, cy: 70, r: 36, style: 'fill:' + T + ';fill-opacity:.4;stroke:' + T + ';stroke-width:3' }, g);
      label(g, 200, 76, cur, '#fff', 'middle', 22); label(g, 200, 125, 'spermatozoïde', '#fff', 'middle', 12);
      S('path', { d: 'M250 70L290 70', style: 'stroke:#fff;stroke-width:4;stroke-linecap:round;fill:none' }, g);
      S('circle', { cx: 335, cy: 70, r: 40, style: 'fill:' + (girl ? P : C) + ';fill-opacity:.5;stroke:#fff;stroke-width:3' }, g);
      label(g, 335, 76, 'X' + cur, '#fff', 'middle', 22); label(g, 335, 130, girl ? 'fille' : 'garçon', '#fff', 'middle', 13);
      info.set((girl ? '<b>XX : une fille.</b> ' : '<b>XY : un garçon.</b> ') + 'L’ovule porte toujours un X. Le sexe dépend donc du spermatozoïde : X ou Y, avec une chance sur deux chacun.' + mem);
    }
    var ctl = ui.controls(el);
    ui.btn(ctl, 'Simuler 20 naissances', function () {
      var f = 0, i; for (i = 0; i < 20; i++) if (Math.random() < .5) f++;
      n += 20; nf += f; mem = '<br>Dernier tirage : ' + f + ' filles et ' + (20 - f) + ' garçons. Au total : ' + nf + ' filles et ' + (n - nf) + ' garçons sur ' + n + '. Le hasard fait varier chaque tirage mais le total se rapproche de la moitié.'; draw();
    });
    draw();
  }
  function maladies(el) {
    explorer(el, [
      { id: 'ca', t: 'Caractères', c: T, d: 'Couleur des yeux, forme des cheveux, groupe sanguin : ce sont des <b>caractères héréditaires</b>, transmis des parents aux enfants.' },
      { id: 'ma', t: 'Maladies', c: C, d: 'Certaines maladies se transmettent : l’<b>hémophilie</b> (le sang coagule mal), le <b>daltonisme</b> (confusion de couleurs), la <b>drépanocytose</b> (globules rouges déformés).' },
      { id: 'pr', t: 'Prévention', c: P, d: 'Le <b>conseil génétique</b> informe les couples sur les risques. Le dépistage et le suivi médical aident à mieux vivre avec la maladie. Le mariage entre proches parents augmente le risque de certaines maladies rares.' },
      { id: 'at', t: 'Attitude', c: L, d: 'Une maladie héréditaire n’est ni une faute ni une contagion. Les personnes touchées méritent respect et soutien.' }
    ]);
  }
  PC.chapter({ id: 's2-5', lazy: true, eyebrow: EY2 + 'Hérédité', title: 'L’hérédité chez l’Homme', ar: 'الوراثة عند الإنسان',
    lessons: function () { return [
      { short: 'Chromosomes', title: 'Les chromosomes et le caryotype', intro: 'Touche chaque onglet pour découvrir où se trouve l’information héréditaire.', build: chromos,
        retenir: ['Une cellule humaine contient <b>46 chromosomes</b> (23 paires). Les gamètes en ont 23.', 'Le <b>caryotype</b> classe les chromosomes par paires.'],
        ar: { e: ['تحتوي كل خلية بشرية على 46 صبغيا، أي 23 زوجا، توجد في النواة وتحمل المعلومات الوراثية. الخريطة الصبغية صورة للصبغيات مرتبة في أزواج. يحمل الحيوان المنوي والبويضة 23 صبغيا لكل منهما، فتستعيد البيضة 46 صبغيا: 23 من الأب و23 من الأم.'], u: 'اضغط على كل لسان لتقرأ المعلومة.', w: [['chromosome', 'صبغي'], ['caryotype', 'خريطة صبغية'], ['trisomie', 'تثلث صبغي']] } },
      { short: 'Sexe', title: 'La transmission du sexe', intro: 'Choisis le spermatozoïde et regarde le sexe de l’enfant.', build: sexe,
        retenir: ['La femme a deux chromosomes sexuels <b>XX</b>, l’homme <b>XY</b>.', 'L’ovule porte toujours X. Le sexe dépend du spermatozoïde : une chance sur deux.'],
        ar: { e: ['المرأة لها صبغيان جنسيان XX، والرجل XY. تحمل البويضة دائما الصبغي X، أما الحيوان المنوي فيحمل X أو Y. إذا أخصب حيوان منوي يحمل X البويضة وُلدت بنت XX، وإذا أخصبها حيوان منوي يحمل Y وُلد ولد XY. فاحتمال كل منهما واحد من اثنين، وليس للأم دور في تحديد جنس الطفل.'], u: 'اختر الحيوان المنوي ثم جرّب المحاكاة.', w: [['chromosome sexuel', 'صبغي جنسي'], ['fille', 'بنت'], ['garçon', 'ولد']] } },
      { short: 'Maladies', title: 'Caractères et maladies héréditaires', intro: 'Ce que les parents transmettent et comment se protéger.', build: maladies,
        retenir: ['Des <b>caractères</b> et certaines <b>maladies</b> sont héréditaires.', 'Le conseil génétique et le dépistage aident à prévenir les risques.'],
        ar: { e: ['ينتقل من الآباء إلى الأبناء عدد من الصفات مثل لون العينين وشكل الشعر وفصيلة الدم، وتنتقل أيضا بعض الأمراض الوراثية مثل الهيموفيليا وعمى الألوان والخلايا المنجلية. الاستشارة الوراثية والكشف المبكر يساعدان على الوقاية. والمرض الوراثي ليس ذنبا ولا عدوى، ويستحق المصاب الاحترام والدعم.'], w: [['hérédité', 'وراثة'], ['hémophilie', 'الهيموفيليا'], ['daltonisme', 'عمى الألوان'], ['conseil génétique', 'استشارة وراثية']] } }
    ]; },
    quiz: [
      { q: 'Combien de chromosomes a une cellule humaine ?', o: ['46', '23', '92'], a: 0, e: 'Cela fait 23 paires.' },
      { q: 'Un enfant XY est :', o: ['un garçon', 'une fille', 'cela dépend de la mère'], a: 0, e: 'Il a reçu un Y de son père.' },
      { q: 'Le caryotype sert à :', o: ['classer les chromosomes par paires', 'mesurer la tension', 'compter les globules'], a: 0, e: 'On y repère des anomalies de nombre.' }
    ] });

  /* ===================================================== 1re ANNÉE · 1. LE MILIEU NATUREL */
  function milieu(el) {
    explorer(el, [
      { id: 'bi', t: 'Êtres vivants', c: T, d: 'Animaux, plantes, champignons, microbes : ce sont les composantes <b>biotiques</b> du milieu.' },
      { id: 'ab', t: 'Composantes non vivantes', c: C, d: 'L’eau, l’air, le sol, la lumière et la température sont les composantes <b>abiotiques</b>. Elles déterminent qui peut vivre dans le milieu.' },
      { id: 'di', t: 'Diversité', c: P, d: 'Un désert, une forêt, une rivière ou un littoral n’abritent pas les mêmes espèces. Chaque milieu a des conditions particulières.' },
      { id: 'in', t: 'Interactions', c: L, d: 'Les êtres vivants dépendent les uns des autres et de leur milieu : ils s’y nourrissent, s’y abritent et s’y reproduisent.' }
    ]);
  }
  function cellule(el) {
    var cur = 'an';
    ui.tabs(el, [['an', 'Cellule animale'], ['ve', 'Cellule végétale']], function (v) { cur = v; draw(); });
    var svg = ui.stage(el, 400, 220, 'Cellule animale et cellule végétale'), g = S('g', null, svg), info = ui.info(el);
    function draw() {
      g.replaceChildren();
      if (cur === 'an') {
        S('ellipse', { cx: 200, cy: 105, rx: 150, ry: 85, style: 'fill:' + P + ';fill-opacity:.2;stroke:' + P + ';stroke-width:4' }, g);
        S('circle', { cx: 210, cy: 100, r: 34, style: 'fill:' + L + ';fill-opacity:.6;stroke:' + L + ';stroke-width:2' }, g);
        [[130, 80], [150, 140], [270, 130], [285, 80], [180, 160]].forEach(function (p) { S('circle', { cx: p[0], cy: p[1], r: 5, style: 'fill:#fff;fill-opacity:.5' }, g); });
        label(g, 210, 105, 'noyau', '#fff', 'middle', 13); label(g, 200, 24, 'membrane', '#fff', 'middle', 12); label(g, 150, 118, 'cytoplasme', '#fff', 'middle', 12);
        info.set('<b>Cellule animale.</b> Une <b>membrane</b> entoure le <b>cytoplasme</b>, où se trouve le <b>noyau</b> qui contrôle la cellule.');
      } else {
        S('rect', { x: 50, y: 20, width: 300, height: 170, rx: 14, style: 'fill:none;stroke:' + T + ';stroke-width:8' }, g);
        S('rect', { x: 58, y: 28, width: 284, height: 154, rx: 10, style: 'fill:' + T + ';fill-opacity:.12;stroke:' + P + ';stroke-width:2' }, g);
        S('ellipse', { cx: 255, cy: 105, rx: 55, ry: 50, style: 'fill:' + BLUE + ';fill-opacity:.25;stroke:' + BLUE + ';stroke-width:2' }, g);
        S('circle', { cx: 120, cy: 75, r: 26, style: 'fill:' + L + ';fill-opacity:.6;stroke:' + L + ';stroke-width:2' }, g);
        [[110, 140], [160, 150], [150, 110]].forEach(function (p) { S('ellipse', { cx: p[0], cy: p[1], rx: 14, ry: 8, style: 'fill:#3fb36b;fill-opacity:.9' }, g); });
        label(g, 120, 79, 'noyau', '#fff', 'middle', 12); label(g, 255, 109, 'vacuole', '#fff', 'middle', 12); label(g, 200, 12, 'paroi', '#fff', 'middle', 12); label(g, 130, 172, 'chloroplastes', '#fff', 'middle', 12);
        info.set('<b>Cellule végétale.</b> Elle a, en plus, une <b>paroi</b> rigide, de grandes <b>vacuoles</b> et des <b>chloroplastes</b> verts qui permettent la photosynthèse.');
      }
    }
    draw();
  }
  function microscopique(el) {
    explorer(el, [
      { id: 'mi', t: 'Microscope', c: T, d: 'Il permet de voir ce que l’œil ne voit pas. Le grossissement total est le produit du grossissement de l’oculaire par celui de l’objectif.' },
      { id: 'un', t: 'Unicellulaires', c: P, d: 'Certains êtres vivants n’ont qu’<b>une seule cellule</b> : bactéries, levures, paramécie.' },
      { id: 'pl', t: 'Pluricellulaires', c: C, d: 'Les plantes et les animaux sont formés de <b>millions de cellules</b>. La cellule est l’unité de base du vivant.' }
    ]);
  }
  PC.chapter({ id: 's1-1', lazy: true, eyebrow: EY1 + 'Le milieu', title: 'Le milieu naturel et la cellule', ar: 'الوسط الطبيعي والخلية',
    lessons: function () { return [
      { short: 'Milieu', title: 'Les composantes du milieu naturel', intro: 'Touche chaque onglet pour explorer un milieu naturel.', build: milieu,
        retenir: ['Un milieu comprend des composantes <b>vivantes</b> et <b>non vivantes</b>.', 'Chaque milieu abrite des espèces adaptées à ses conditions.'],
        ar: { e: ['يتكون الوسط الطبيعي من مكونات حية (حيوانات ونباتات وفطريات وميكروبات) ومكونات غير حية (الماء والهواء والتربة والضوء والحرارة). تختلف الأوساط الطبيعية، فالغابة غير الصحراء وغير النهر، ولكل وسط كائنات تلائم ظروفه.'], u: 'اضغط على كل لسان لتقرأ المعلومة.', w: [['milieu', 'وسط'], ['biotique', 'حيّ'], ['abiotique', 'غير حيّ'], ['espèce', 'نوع']] } },
      { short: 'Microscope', title: 'Les êtres microscopiques', intro: 'Qu’est-ce qu’on voit au microscope ?', build: microscopique,
        retenir: ['Le microscope agrandit les objets très petits.', 'Certains êtres sont <b>unicellulaires</b>, d’autres <b>pluricellulaires</b>.'],
        ar: { e: ['المجهر يكبّر الأشياء الصغيرة جدا فنرى ما لا تراه العين. بعض الكائنات تتكون من خلية واحدة، مثل البكتيريا والخمائر، وبعضها يتكون من ملايين الخلايا مثل النباتات والحيوانات. والخلية هي الوحدة الأساسية للكائن الحي.'], w: [['microscope', 'مجهر'], ['unicellulaire', 'وحيد الخلية'], ['pluricellulaire', 'متعدد الخلايا'], ['cellule', 'خلية']] } },
      { short: 'Cellule', title: 'La cellule animale et la cellule végétale', intro: 'Compare les deux cellules avec les onglets.', build: cellule,
        retenir: ['Toute cellule a une <b>membrane</b>, un <b>cytoplasme</b> et un <b>noyau</b>.', 'La cellule végétale a en plus une <b>paroi</b>, des <b>vacuoles</b> et des <b>chloroplastes</b>.'],
        ar: { e: ['كل خلية لها غشاء وهيولى (سيتوبلازم) ونواة. تتميز الخلية النباتية بجدار هيكلي صلب، وفجوات كبيرة، وصانعات خضراء تقوم بالتركيب الضوئي. أما الخلية الحيوانية فلا جدار فيها ولا صانعات خضراء.'], u: 'اختر نوع الخلية لترى مكوناتها.', w: [['membrane', 'غشاء'], ['cytoplasme', 'هيولى'], ['noyau', 'نواة'], ['paroi', 'جدار'], ['chloroplaste', 'صانعة خضراء']] } }
    ]; },
    quiz: [
      { q: 'Quelle structure existe seulement dans la cellule végétale ?', o: ['La paroi', 'Le noyau', 'La membrane'], a: 0, e: 'La paroi rigide entoure la cellule végétale.' },
      { q: 'Les composantes non vivantes d’un milieu sont dites :', o: ['abiotiques', 'biotiques', 'unicellulaires'], a: 0, e: 'Exemples : eau, air, sol, lumière.' },
      { q: 'Quel être vivant est unicellulaire ?', o: ['La bactérie', 'Le chat', 'Le chêne'], a: 0, e: 'Il n’a qu’une seule cellule.' }
    ] });

  /* ===================================================== 1re ANNÉE · 2. LA RESPIRATION */
  function respAnim(el) {
    explorer(el, [
      { id: 'po', t: 'Poisson', c: BLUE, d: 'Il respire dans l’eau avec des <b>branchies</b>, très riches en vaisseaux sanguins. Elles prennent le dioxygène dissous dans l’eau.' },
      { id: 'ma', t: 'Mammifères et oiseaux', c: P, d: 'Ils respirent l’air avec des <b>poumons</b>. L’air entre par le nez ou le bec.' },
      { id: 'in', t: 'Insecte', c: C, d: 'L’air entre par de petits trous sur le corps (stigmates) et circule dans des tubes : les <b>trachées</b>.' },
      { id: 'ver', t: 'Ver de terre', c: '#e9b84a', d: 'Il respire par la <b>peau</b>, qui doit rester humide. C’est pourquoi il sort quand la terre est inondée ou après la pluie.' },
      { id: 'gr', t: 'Grenouille', c: T, d: 'Elle respire par la peau humide et par des poumons. Le têtard, lui, respire par des branchies.' }
    ]);
  }
  function respPlante(el) {
    explorer(el, [
      { id: 'st', t: 'Stomates', c: T, d: 'De minuscules pores, surtout sur la face inférieure des feuilles. Les gaz (dioxygène, dioxyde de carbone, vapeur d’eau) entrent et sortent par les stomates.' },
      { id: 'nu', t: 'Jour et nuit', c: P, d: 'Les plantes respirent <b>jour et nuit</b> : elles consomment du dioxygène et rejettent du dioxyde de carbone.' },
      { id: 'ph', t: 'Photosynthèse', c: C, d: 'À la lumière, les parties vertes font aussi la <b>photosynthèse</b> : elles consomment du dioxyde de carbone et rejettent du dioxygène, souvent en plus grande quantité que la respiration.' }
    ]);
  }
  PC.chapter({ id: 's1-2', lazy: true, eyebrow: EY1 + 'Respiration', title: 'La respiration chez les êtres vivants', ar: 'التنفس في أوساط مختلفة',
    lessons: function () { return [
      { short: 'Animaux', title: 'La respiration des animaux', intro: 'Dans l’eau ou dans l’air : quel organe pour quel milieu ?', build: respAnim,
        retenir: ['Les poissons respirent par des <b>branchies</b>, les mammifères et les oiseaux par des <b>poumons</b>.', 'Les insectes utilisent des <b>trachées</b>, le ver de terre sa <b>peau</b>.'],
        ar: { e: ['يتنفس السمك في الماء بواسطة الخياشيم، وتتنفس الثدييات والطيور بواسطة الرئتين. تتنفس الحشرات بقصبات هوائية يدخل إليها الهواء من ثقوب صغيرة، وتتنفس دودة الأرض بجلدها الرطب. وتتنفس الضفدعة بالجلد وبالرئتين، أما الشرغوف فيتنفس بالخياشيم.'], u: 'اضغط على كل حيوان لتعرف عضو التنفس عنده.', w: [['branchie', 'خيشوم'], ['poumon', 'رئة'], ['trachée', 'قصبة هوائية'], ['respiration', 'تنفس']] } },
      { short: 'Plantes', title: 'La respiration des plantes', intro: 'Les plantes respirent aussi : comment ?', build: respPlante,
        retenir: ['Les plantes respirent <b>jour et nuit</b> par les stomates.', 'À la lumière, la photosynthèse rejette du dioxygène.'],
        ar: { e: ['تتنفس النباتات ليلا ونهارا، فتستهلك الأكسجين وتطرح ثنائي أكسيد الكربون، وتتم المبادلات الغازية عبر الثغور (الفتيحات). وفي الضوء تقوم الأجزاء الخضراء أيضا بالتركيب الضوئي فتستهلك ثنائي أكسيد الكربون وتطرح الأكسجين.'], w: [['stomate', 'ثغر'], ['photosynthèse', 'تركيب ضوئي'], ['dioxygène', 'أكسجين']] } }
    ]; },
    quiz: [
      { q: 'Quel organe permet au poisson de respirer dans l’eau ?', o: ['Les branchies', 'Les poumons', 'Les trachées'], a: 0, e: 'Elles prennent le dioxygène dissous.' },
      { q: 'Le ver de terre respire par :', o: ['la peau', 'des poumons', 'des branchies'], a: 0, e: 'Sa peau doit rester humide.' },
      { q: 'Les plantes respirent :', o: ['jour et nuit', 'seulement la nuit', 'seulement le jour'], a: 0, e: 'Elles respirent en permanence.' }
    ] });

  /* ===================================================== 1re ANNÉE · 3. LA NUTRITION */
  function regimeHomme(el) {
    explorer(el, [
      { id: 'om', t: 'Omnivore', c: P, d: 'L’être humain mange des aliments d’origine animale et végétale : son régime est <b>omnivore</b>. Les dents sont de trois sortes (incisives, canines, molaires).' },
      { id: 'va', t: 'Varié', c: T, d: 'Aucun aliment ne contient tout ce dont le corps a besoin. Un régime équilibré mélange des aliments de plusieurs groupes.' },
      { id: 'be', t: 'Besoins', c: C, d: 'Les besoins changent avec l’âge, l’activité physique, le sexe, et l’état de santé. Un adolescent ou un sportif a besoin de plus d’énergie.' },
      { id: 'ea', t: 'Eau', c: BLUE, d: 'On boit de l’eau tous les jours. Sans eau, l’organisme tient beaucoup moins longtemps que sans nourriture.' }
    ]);
  }
  function nutriVeg(el) {
    stepper(el, { label: 'La nutrition d’une plante verte', h: 200, nodes: [
      { id: 'ra', x: 40, y: 80, t: 'Racines', c: P }, { id: 'sb', x: 125, y: 80, t: 'Sève brute', c: BLUE, row: 1 }, { id: 'fe', x: 210, y: 80, t: 'Feuilles', c: T },
      { id: 'ps', x: 295, y: 80, t: 'Photosynthèse', c: '#e9b84a', row: 1 }, { id: 'se', x: 375, y: 80, t: 'Sève élaborée', c: C }
    ], links: [['ra', 'sb'], ['sb', 'fe'], ['fe', 'ps'], ['ps', 'se']], steps: [
      { on: ['ra'], t: 'Les racines absorbent l’eau et les sels minéraux du sol.' },
      { on: ['ra', 'sb'], t: 'L’eau et les sels minéraux forment la sève brute, qui monte dans la tige.' },
      { on: ['sb', 'fe'], t: 'La sève brute arrive aux feuilles. Elles absorbent aussi le dioxyde de carbone de l’air par les stomates.' },
      { on: ['fe', 'ps'], t: 'Grâce à la lumière et à la chlorophylle, la plante fabrique de la matière organique : c’est la <b>photosynthèse</b>. Elle rejette du dioxygène.' },
      { on: ['ps', 'se'], t: 'Les substances fabriquées (comme le glucose et l’amidon) forment la sève élaborée, distribuée à toute la plante ou stockée dans les graines, les tubercules et les fruits.' }
    ] });
  }
  function regimeAnim(el) {
    explorer(el, [
      { id: 'ca', t: 'Carnivore', c: RED, d: 'Il mange surtout de la chair d’autres animaux : lion, loup, aigle. Dents pointues et tranchantes (canines, carnassières), souvent des griffes ou un bec crochu.' },
      { id: 'he', t: 'Herbivore', c: T, d: 'Il mange des végétaux : vache, mouton, chèvre, lapin. Incisives pour couper, molaires larges et plates pour broyer. Son tube digestif est long.' },
      { id: 'om', t: 'Omnivore', c: P, d: 'Il mange des aliments animaux et végétaux : ours, sanglier, homme.' }
    ]);
  }
  PC.chapter({ id: 's1-3', lazy: true, eyebrow: EY1 + 'Nutrition', title: 'La nutrition et les régimes alimentaires', ar: 'التغذية والأنظمة الغذائية',
    lessons: function () { return [
      { short: 'Homme', title: 'Le régime alimentaire de l’Homme', intro: 'Pourquoi varier les aliments ?', build: regimeHomme,
        retenir: ['L’Homme a un régime <b>omnivore</b> et doit manger varié.', 'Les besoins dépendent de l’âge et de l’activité.'],
        ar: { e: ['الإنسان كائن يأكل اللحوم والنباتات، فنظامه الغذائي متنوع. لا يوجد غذاء واحد يحتوي على كل ما يحتاجه الجسم، لذلك يجب التنويع. وتتغير الحاجات حسب السن والنشاط البدني والحالة الصحية. ويجب شرب الماء كل يوم.'], u: 'اضغط على كل لسان لتقرأ المعلومة.', w: [['omnivore', 'قارت'], ['régime alimentaire', 'نظام غذائي'], ['besoin', 'حاجة']] } },
      { short: 'Plantes', title: 'La nutrition des plantes vertes', intro: 'Suis le trajet de l’eau et du dioxyde de carbone dans la plante.', build: nutriVeg,
        retenir: ['Les racines absorbent l’<b>eau</b> et les <b>sels minéraux</b> (sève brute).', 'Les feuilles fabriquent de la matière organique par <b>photosynthèse</b> (sève élaborée).'],
        ar: { e: ['تمتص الجذور الماء والأملاح المعدنية فتكوّن العصارة الخام التي تصعد في الساق إلى الأوراق. تمتص الأوراق ثنائي أكسيد الكربون من الهواء. وبفضل الضوء واليخضور تصنع النبتة مادة عضوية، وهذا هو التركيب الضوئي، وتطرح الأكسجين. تتوزع المواد المصنّعة في العصارة المنتشرة (العصارة المُصنَّعة) أو تُخزّن في البذور والدرنات والثمار.'], u: 'اضغط «Étape suivante» لتتبع التغذية.', w: [['sève brute', 'عصارة خام'], ['sève élaborée', 'عصارة مُصنَّعة'], ['chlorophylle', 'يخضور'], ['sels minéraux', 'أملاح معدنية']] } },
      { label: 'Leçon 3 · ' + APPRO, short: 'Animaux', title: 'Les régimes alimentaires des animaux', intro: 'Les dents et le régime : quel lien ?', build: regimeAnim,
        retenir: ['Le <b>carnivore</b> mange de la chair, l’<b>herbivore</b> des végétaux, l’<b>omnivore</b> les deux.', 'Les dents sont adaptées au régime.'],
        ar: { e: ['الحيوان آكل اللحوم له أسنان مدببة وقاطعة، والحيوان آكل الأعشاب له قواطع وأضراس عريضة مسطحة لطحن النباتات وجهازه الهضمي طويل، والحيوان القارت يأكل اللحوم والنباتات معا. شكل الأسنان يتلاءم مع النظام الغذائي.'], w: [['carnivore', 'آكل اللحوم'], ['herbivore', 'آكل الأعشاب'], ['dent', 'سن']] } }
    ]; },
    quiz: [
      { q: 'Le processus par lequel une plante verte fabrique sa matière organique est :', o: ['la photosynthèse', 'la digestion', 'la germination'], a: 0, e: 'Il exige de la lumière et de la chlorophylle.' },
      { q: 'La sève brute contient :', o: ['de l’eau et des sels minéraux', 'du glucose et de l’amidon', 'du dioxygène seulement'], a: 0, e: 'Elle monte des racines vers les feuilles.' },
      { q: 'Un animal à molaires larges et plates est probablement :', o: ['herbivore', 'carnivore', 'insectivore'], a: 0, e: 'Elles servent à broyer les végétaux.' }
    ] });

  /* ===================================================== 1re ANNÉE · 4. CHAÎNES ALIMENTAIRES ET ÉQUILIBRES */
  function chaine(el) {
    stepper(el, { label: 'Une chaîne alimentaire', h: 200, nodes: [
      { id: 'so', x: 40, y: 80, t: 'Soleil', c: '#e9b84a' }, { id: 'he', x: 125, y: 80, t: 'Herbe', c: T, row: 1 }, { id: 'sa', x: 210, y: 80, t: 'Sauterelle', c: P },
      { id: 'gr', x: 295, y: 80, t: 'Grenouille', c: C, row: 1 }, { id: 'se', x: 375, y: 80, t: 'Serpent', c: RED }
    ], links: [['so', 'he'], ['he', 'sa'], ['sa', 'gr'], ['gr', 'se']], steps: [
      { on: ['so'], t: 'L’énergie vient du Soleil.' },
      { on: ['so', 'he'], t: 'Les plantes sont les <b>producteurs</b> : elles fabriquent leur matière avec la lumière.' },
      { on: ['he', 'sa'], t: 'Le <b>consommateur de premier ordre</b> mange le producteur : c’est un herbivore.' },
      { on: ['sa', 'gr'], t: 'Le <b>consommateur de deuxième ordre</b> mange l’herbivore : c’est un carnivore.' },
      { on: ['gr', 'se'], t: 'Le consommateur suivant mange le carnivore. À la mort des êtres vivants, les <b>décomposeurs</b> (bactéries, champignons) transforment la matière en éléments minéraux réutilisés par les plantes.' }
    ] });
  }
  function disparition(el) {
    ui.text(el, 'Que se passe-t-il si une espèce disparaît de la chaîne herbe, sauterelle, grenouille, serpent ?');
    explorer(el, [
      { id: 'he', t: 'Plus d’herbe', c: T, d: 'Les sauterelles n’ont plus rien à manger et disparaissent. Puis les grenouilles et les serpents manquent de nourriture. Toute la chaîne s’effondre.' },
      { id: 'sa', t: 'Plus de sauterelles', c: P, d: 'L’herbe est moins mangée et se développe. Les grenouilles manquent de nourriture et diminuent. Le serpent diminue ensuite.' },
      { id: 'gr', t: 'Plus de grenouilles', c: C, d: 'Les sauterelles ne sont plus mangées par les grenouilles : elles se multiplient et mangent plus d’herbe. Le serpent manque de nourriture.' },
      { id: 'se', t: 'Plus de serpents', c: RED, d: 'Les grenouilles ne sont plus chassées et se multiplient. Elles mangent plus de sauterelles. L’équilibre est modifié.' }
    ]);
  }
  function equilibre(el) {
    explorer(el, [
      { id: 'eq', t: 'Équilibre', c: T, d: 'Dans un milieu naturel stable, le nombre de chaque espèce varie peu : c’est l’<b>équilibre naturel</b>.' },
      { id: 'ru', t: 'Ruptures', c: RED, d: 'Incendies de forêt, chasse ou pêche excessive, pollution, déforestation et introduction d’une espèce étrangère peuvent rompre l’équilibre.' },
      { id: 'pr', t: 'Protection', c: P, d: 'Des parcs nationaux protègent la nature. Au Maroc, le parc national de Souss-Massa protège par exemple l’ibis chauve. Chacun peut agir : ne pas jeter de déchets, économiser l’eau, respecter les plantes et les animaux.' }
    ]);
  }
  PC.chapter({ id: 's1-4', lazy: true, eyebrow: EY1 + 'Équilibres', title: 'Chaînes alimentaires et équilibres naturels', ar: 'السلاسل الغذائية والتوازنات الطبيعية',
    lessons: function () { return [
      { short: 'Chaîne', title: 'Les chaînes alimentaires', intro: 'Avance étape par étape dans la chaîne.', build: chaine,
        retenir: ['Une chaîne alimentaire relie les êtres vivants qui se mangent : <b>producteur</b>, <b>consommateurs</b>, <b>décomposeurs</b>.', 'Tout commence par la lumière du Soleil et les plantes vertes.'],
        ar: { e: ['السلسلة الغذائية تربط بين كائنات حية يأكل بعضها بعضا. تبدأ بالمنتِج وهو النبات الأخضر الذي يصنع مادته بالضوء، ثم المستهلك من الدرجة الأولى وهو آكل أعشاب، ثم المستهلك من الدرجة الثانية وهو آكل لحوم. وعند موت الكائنات تحلل المحلِّلات (البكتيريا والفطريات) المادة العضوية إلى أملاح معدنية تستعملها النباتات.'], u: 'اضغط «Étape suivante» لتتبع السلسلة.', w: [['chaîne alimentaire', 'سلسلة غذائية'], ['producteur', 'منتِج'], ['consommateur', 'مستهلك'], ['décomposeur', 'محلِّل']] } },
      { short: 'Disparition', title: 'Quand une espèce disparaît', intro: 'Choisis une espèce et lis les conséquences.', build: disparition,
        retenir: ['Dans une chaîne, les espèces dépendent les unes des autres.', 'La disparition d’une espèce déséquilibre toute la chaîne.'],
        ar: { e: ['تعتمد الأنواع على بعضها في السلسلة الغذائية، فاختفاء نوع واحد يؤثر في الباقين. إذا اختفى النبات جاعت كل الحيوانات بعده، وإذا اختفى المفترس تكاثر فريسته أكثر من اللازم وأكل مزيدا من الغذاء.'], u: 'اختر نوعا لترى النتيجة.', w: [['espèce', 'نوع'], ['proie', 'فريسة'], ['prédateur', 'مفترس']] } },
      { short: 'Équilibres', title: 'Les équilibres naturels', intro: 'Ce qui les maintient, ce qui les menace.', build: equilibre,
        retenir: ['L’<b>équilibre naturel</b> est une situation stable où chaque espèce garde un effectif voisin.', 'L’Homme peut le rompre mais aussi le protéger.'],
        ar: { e: ['التوازن الطبيعي حالة استقرار يبقى فيها عدد كل نوع قريبا من قيمة ثابتة. يمكن أن يختل بسبب الحرائق والصيد المفرط والتلوث وقطع الغابات وإدخال أنواع غريبة. وتحمي المحميات والحدائق الوطنية الطبيعة، مثل المنتزه الوطني لسوس ماسة الذي يحمي أبو منجل الأصلع.'], w: [['équilibre naturel', 'توازن طبيعي'], ['pollution', 'تلوث'], ['protection', 'حماية']] } }
    ]; },
    quiz: [
      { q: 'Dans une chaîne alimentaire, le producteur est :', o: ['la plante verte', 'le lion', 'la bactérie'], a: 0, e: 'Il fabrique sa matière organique.' },
      { q: 'Les décomposeurs sont surtout :', o: ['des bactéries et des champignons', 'des insectes volants', 'des herbivores'], a: 0, e: 'Ils transforment la matière morte en éléments minéraux.' },
      { q: 'Quelle action peut rompre un équilibre naturel ?', o: ['Une pêche excessive', 'Une pluie normale', 'Une nuit d’été'], a: 0, e: 'Une espèce devient trop rare.' }
    ] });

  /* ===================================================== 1re ANNÉE · 5. CLASSIFICATION */
  function vertebres(el) {
    explorer(el, [
      { id: 'ma', t: 'Mammifères', c: P, d: 'Corps couvert de <b>poils</b>, <b>mamelles</b> qui produisent du lait, la plupart sont vivipares. Température du corps constante. Exemples : chat, vache, dauphin, chauve-souris.' },
      { id: 'oi', t: 'Oiseaux', c: C, d: 'Corps couvert de <b>plumes</b>, un <b>bec</b>, des ailes. Ovipares. Température constante. Exemples : poule, aigle, autruche.' },
      { id: 're', t: 'Reptiles', c: T, d: 'Peau couverte d’<b>écailles</b> sèches. Ovipares, pour la plupart. Température du corps variable. Exemples : tortue, lézard, serpent.' },
      { id: 'am', t: 'Amphibiens', c: BLUE, d: '<b>Peau nue et humide</b>. Les œufs sont pondus dans l’eau. La larve (têtard) respire par des branchies puis subit une métamorphose. Exemples : grenouille, triton.' },
      { id: 'po', t: 'Poissons', c: L, d: 'Corps souvent couvert d’<b>écailles</b>, avec des <b>nageoires</b> et des <b>branchies</b>. Ils vivent dans l’eau. Exemples : sardine, thon, truite.' }
    ]);
  }
  function invertebres(el) {
    explorer(el, [
      { id: 'in', t: 'Insectes', c: C, d: 'Un corps en trois parties (tête, thorax, abdomen), <b>six pattes</b>, souvent des ailes et deux antennes. Exemples : abeille, fourmi, mouche.' },
      { id: 'ar', t: 'Arachnides', c: RED, d: '<b>Huit pattes</b>, pas d’antennes. Exemples : araignée, scorpion.' },
      { id: 'cr', t: 'Crustacés', c: P, d: 'Un corps recouvert d’une carapace, <b>deux paires d’antennes</b>, vivent surtout dans l’eau. Exemples : crevette, crabe.' },
      { id: 'mo', t: 'Mollusques', c: L, d: 'Corps mou, souvent protégé par une coquille. Exemples : escargot, moule, poulpe.' },
      { id: 've', t: 'Vers', c: T, d: 'Corps mou et allongé, sans pattes. Exemples : ver de terre.' }
    ]);
  }
  PC.chapter({ id: 's1-5', lazy: true, eyebrow: EY1 + 'Classification', title: 'La classification des êtres vivants', ar: 'تصنيف الكائنات الحية',
    lessons: function () { return [
      { short: 'Vertébrés', title: 'Les cinq classes de vertébrés', intro: 'Observe les critères de chaque classe.', build: vertebres,
        retenir: ['Les vertébrés ont un <b>squelette interne</b> avec une colonne vertébrale.', 'Cinq classes : mammifères, oiseaux, reptiles, amphibiens, poissons.'],
        ar: { e: ['الفقاريات حيوانات لها هيكل داخلي وعمود فقري. وتنقسم إلى خمسة أصناف: الثدييات (شعر وغدد ثديية)، والطيور (ريش ومنقار)، والزواحف (حراشف جافة)، والبرمائيات (جلد عارٍ رطب واستحالة)، والأسماك (حراشف وزعانف وخياشيم).'], u: 'اضغط على كل صنف لتقرأ مميزاته.', w: [['vertébré', 'فقاري'], ['mammifère', 'ثديي'], ['reptile', 'زاحف'], ['amphibien', 'برمائي']] } },
      { short: 'Invertébrés', title: 'Quelques groupes d’invertébrés', intro: 'Combien de pattes ? Quelle carapace ?', build: invertebres,
        retenir: ['Les invertébrés n’ont <b>pas de colonne vertébrale</b>.', 'Insectes : 6 pattes. Arachnides : 8 pattes.'],
        ar: { e: ['اللافقاريات حيوانات بلا عمود فقري. للحشرات ست أرجل وجسمها من ثلاثة أجزاء، وللعناكب ثماني أرجل، والقشريات لها هيكل صلب وزوجان من اللواقط، والرخويات جسمها لين وغالبا تحميه صدفة، والديدان جسمها لين وطويل بلا أرجل.'], w: [['invertébré', 'لافقاري'], ['insecte', 'حشرة'], ['arachnide', 'عنكبوتي'], ['crustacé', 'قشري']] } }
    ]; },
    quiz: [
      { q: 'Un animal à poils et à mamelles est :', o: ['un mammifère', 'un reptile', 'un poisson'], a: 0, e: 'Les mamelles produisent du lait.' },
      { q: 'Combien de pattes a un insecte ?', o: ['6', '8', '10'], a: 0, e: 'L’araignée, elle, a 8 pattes.' },
      { q: 'La grenouille est :', o: ['un amphibien', 'un reptile', 'un mammifère'], a: 0, e: 'Sa peau est nue et humide.' }
    ] });

  /* ===================================================== 1re ANNÉE · 6. LE CYCLE SÉDIMENTAIRE */
  function cycleSed(el) {
    stepper(el, { label: 'Du relief à la roche sédimentaire', h: 200, nodes: [
      { id: 'er', x: 40, y: 80, t: 'Érosion', c: C }, { id: 'tr', x: 125, y: 80, t: 'Transport', c: BLUE, row: 1 }, { id: 'de', x: 210, y: 80, t: 'Dépôt', c: P },
      { id: 'co', x: 295, y: 80, t: 'Compaction', c: '#e9b84a', row: 1 }, { id: 'ro', x: 375, y: 80, t: 'Roche', c: L }
    ], links: [['er', 'tr'], ['tr', 'de'], ['de', 'co'], ['co', 'ro']], steps: [
      { on: ['er'], t: 'L’eau, le vent, la glace et les variations de température détruisent les roches : c’est l’<b>érosion</b>.' },
      { on: ['er', 'tr'], t: 'Les fragments sont emportés par l’eau, le vent ou la glace : c’est le <b>transport</b>.' },
      { on: ['tr', 'de'], t: 'Quand le courant faiblit, les particules se déposent en couches : c’est la <b>sédimentation</b>. Les plus lourdes se déposent d’abord.' },
      { on: ['de', 'co'], t: 'Les couches s’empilent. Sous leur poids, l’eau est chassée (compaction) et les grains sont collés (cimentation).' },
      { on: ['co', 'ro'], t: 'Les sédiments deviennent une <b>roche sédimentaire</b>. Plus tard, elle peut remonter à la surface et être érodée à son tour : le cycle recommence.' }
    ] });
  }
  function rochesSed(el) {
    explorer(el, [
      { id: 'de', t: 'Détritiques', c: C, d: 'Formées de fragments d’autres roches collés ensemble : <b>grès</b> (grains de sable), <b>conglomérat</b> (galets), <b>argilite</b> (argile).' },
      { id: 'ca', t: 'Calcaires', c: P, d: 'Le <b>calcaire</b> est formé de carbonate de calcium, souvent issu de coquilles. Une goutte d’acide chlorhydrique dilué fait <b>effervescence</b> sur le calcaire.' },
      { id: 'ev', t: 'Évaporites', c: L, d: 'Elles se forment quand l’eau d’une mer ou d’un lac s’évapore : <b>sel gemme</b> et <b>gypse</b>.' },
      { id: 'us', t: 'Usages', c: T, d: 'Construction, ciment, verre et routes utilisent des roches sédimentaires.' }
    ]);
  }
  function fossiles(el) {
    explorer(el, [
      { id: 'su', t: 'Superposition', c: T, d: 'Quand les couches n’ont pas été déformées, la couche du <b>bas</b> est la plus ancienne et celle du <b>haut</b> la plus récente.' },
      { id: 'fo', t: 'Fossile', c: P, d: 'Un <b>fossile</b> est le reste ou la trace d’un être vivant conservé dans une roche sédimentaire (coquille, os, empreinte).' },
      { id: 'st', t: 'Fossile stratigraphique', c: C, d: 'Un fossile d’une espèce qui a vécu peu de temps et dans de nombreux endroits (comme les trilobites ou les ammonites) permet de <b>dater</b> et de comparer des couches.' },
      { id: 'ec', t: 'Échelle des temps', c: L, d: 'L’histoire de la Terre est découpée en ères : Primaire, Secondaire, Tertiaire et Quaternaire, d’après les fossiles trouvés.' }
    ]);
  }
  PC.chapter({ id: 's1-6', lazy: true, eyebrow: EY1 + 'Géologie', title: 'Le cycle sédimentaire et les fossiles', ar: 'الدورة الرسوبية والأحافير',
    lessons: function () { return [
      { short: 'Cycle', title: 'Le cycle sédimentaire', intro: 'Du relief à la roche : suis chaque étape.', build: cycleSed,
        retenir: ['Cycle : <b>érosion</b>, <b>transport</b>, <b>sédimentation</b>, compaction et cimentation.', 'Il forme les <b>roches sédimentaires</b>.'],
        ar: { e: ['الدورة الرسوبية: تحطم العوامل الجوية (الماء والرياح والجليد) الصخور وهذا هو التعرية، ثم تنقل المياه والرياح الشظايا، ثم تترسب في طبقات عندما يضعف التيار، وتتراص الطبقات وتتماسك حباتها فتتكون صخرة رسوبية. قد تصعد هذه الصخرة لاحقا إلى السطح وتتعرى من جديد.'], u: 'اضغط «Étape suivante» لتتبع مراحل الدورة.', w: [['érosion', 'تعرية'], ['transport', 'نقل'], ['sédimentation', 'ترسيب'], ['roche sédimentaire', 'صخرة رسوبية']] } },
      { short: 'Roches', title: 'Quelques roches sédimentaires', intro: 'Touche chaque famille de roches.', build: rochesSed,
        retenir: ['Roches <b>détritiques</b> (grès, conglomérat), <b>calcaires</b>, et <b>évaporites</b> (sel, gypse).', 'Le calcaire fait effervescence avec un acide.'],
        ar: { e: ['من الصخور الرسوبية: الصخور الفتاتية المكونة من فتات صخور أخرى مثل الحجر الرملي والكونغلوميرا، والصخور الكلسية المتكونة من كربونات الكالسيوم، وتُحدث فورانا عند صب حمض الهيدروكلوريك المخفف عليها، وصخور التبخر مثل الملح الصخري والجبس.'], w: [['grès', 'حجر رملي'], ['calcaire', 'كلس'], ['gypse', 'جبس']] } },
      { short: 'Fossiles', title: 'Les fossiles et l’âge des couches', intro: 'Comment lire l’histoire de la Terre dans les roches ?', build: fossiles,
        retenir: ['Si les couches ne sont pas déformées, la couche du <b>bas</b> est la plus <b>ancienne</b>.', 'Les <b>fossiles</b> permettent de dater les couches.'],
        ar: { e: ['إذا لم تتعرض الطبقات للتشوه فالطبقة السفلى هي الأقدم والعليا الأحدث. الأحفورة بقايا أو أثر لكائن حي محفوظ في صخرة رسوبية. الأحافير المميِّزة، لأن نوعها عاش مدة قصيرة وانتشر في أماكن كثيرة، تساعد على تحديد عمر الطبقات ومقارنتها. ويُقسَّم تاريخ الأرض إلى أزمنة: الأول والثاني والثالث والرابع.'], w: [['fossile', 'أحفورة'], ['couche', 'طبقة'], ['stratigraphique', 'طبقي']] } }
    ]; },
    quiz: [
      { q: 'Dans des couches non déformées, la couche la plus ancienne est :', o: ['celle du bas', 'celle du haut', 'celle du milieu'], a: 0, e: 'Les nouvelles couches se déposent sur les anciennes.' },
      { q: 'Quelle roche fait effervescence avec un acide ?', o: ['Le calcaire', 'Le grès', 'Le sel gemme'], a: 0, e: 'C’est le test du calcaire.' },
      { q: 'Quel est l’ordre exact des étapes ?', o: ['Érosion, transport, dépôt, compaction', 'Dépôt, érosion, compaction, transport', 'Compaction, transport, érosion, dépôt'], a: 0, e: 'Ensuite se forme la roche sédimentaire.' }
    ] });

  /* ===================================================== 1re ANNÉE · 7. LES RESSOURCES EN EAU */
  function cycleEau(el) {
    stepper(el, { label: 'Le trajet de l’eau', h: 200, nodes: [
      { id: 'pl', x: 40, y: 80, t: 'Pluie', c: BLUE }, { id: 'ru', x: 125, y: 80, t: 'Ruissellement', c: C, row: 1 }, { id: 'in', x: 210, y: 80, t: 'Infiltration', c: P },
      { id: 'na', x: 295, y: 80, t: 'Nappe', c: T, row: 1 }, { id: 'so', x: 375, y: 80, t: 'Source', c: L }
    ], links: [['pl', 'ru'], ['ru', 'in'], ['in', 'na'], ['na', 'so']], steps: [
      { on: ['pl'], t: 'Les précipitations arrivent sur le sol.' },
      { on: ['pl', 'ru'], t: 'Une partie ruisselle vers les rivières et les barrages.' },
      { on: ['ru', 'in'], t: 'Une autre partie s’infiltre dans les roches <b>perméables</b>.' },
      { on: ['in', 'na'], t: 'L’eau s’accumule au-dessus d’une couche <b>imperméable</b> : c’est une nappe d’eau souterraine.' },
      { on: ['na', 'so'], t: 'La nappe alimente les sources, les puits et les forages. Le <b>bassin versant</b> est la zone qui draine l’eau vers un même cours d’eau.' }
    ] });
  }
  function risquesEau(el) {
    explorer(el, [
      { id: 'po', t: 'Pollution', c: RED, d: 'Eaux usées, déchets, engrais, pesticides et produits industriels rendent l’eau impropre à la consommation et nuisent aux êtres vivants.' },
      { id: 'su', t: 'Surexploitation', c: C, d: 'Pomper plus d’eau que la nappe n’en reçoit fait baisser son niveau. Le gaspillage aggrave la rareté de l’eau.' },
      { id: 'se', t: 'Sécheresse', c: '#e9b84a', d: 'Le Maroc connaît un <b>stress hydrique</b> : les pluies sont irrégulières et la demande en eau augmente.' },
      { id: 'mo', t: 'Que faire ?', c: T, d: 'Construire des barrages, épurer les eaux usées, réutiliser l’eau, irriguer au goutte-à-goutte, réparer les fuites et fermer les robinets.' }
    ]);
  }
  PC.chapter({ id: 's1-7', lazy: true, eyebrow: EY1 + 'Géologie', title: 'Les ressources en eau', ar: 'الموارد المائية',
    lessons: function () { return [
      { short: 'Trajet', title: 'Le trajet de l’eau et les nappes', intro: 'Suis l’eau de la pluie à la source.', build: cycleEau,
        retenir: ['L’eau de pluie ruisselle ou s’<b>infiltre</b> dans les roches perméables.', 'Elle forme des <b>nappes</b> sur une couche imperméable.'],
        ar: { e: ['ماء المطر يجري على السطح نحو الأنهار والسدود، وجزء منه يتسرب في الصخور النفوذة، ويتجمع فوق طبقة غير نفوذة فيكوّن فرشة مائية جوفية تغذي العيون والآبار. الحوض المائي هو المنطقة التي تصرّف مياهها نحو مجرى مائي واحد.'], u: 'اضغط «Étape suivante» لتتبع الماء.', w: [['bassin versant', 'حوض مائي'], ['nappe', 'فرشة مائية'], ['perméable', 'نفوذ'], ['imperméable', 'غير نفوذ']] } },
      { short: 'Protéger', title: 'Menaces et protection de l’eau', intro: 'Pourquoi économiser et protéger l’eau ?', build: risquesEau,
        retenir: ['La <b>pollution</b>, la <b>surexploitation</b> et la sécheresse menacent l’eau.', 'Barrages, épuration, économies d’eau et goutte-à-goutte aident à la préserver.'],
        ar: { e: ['تتهدد الموارد المائية بالتلوث (مياه عادمة وأسمدة ومبيدات) والاستغلال المفرط والجفاف. يعيش المغرب إجهادا مائيا لأن الأمطار غير منتظمة والطلب يرتفع. من الحلول: بناء السدود، ومعالجة المياه العادمة، وإعادة استعمال الماء، والسقي بالتنقيط، وإصلاح التسربات وإغلاق الصنابير.'], w: [['pollution', 'تلوث'], ['surexploitation', 'استغلال مفرط'], ['sécheresse', 'جفاف'], ['épuration', 'معالجة']] } }
    ]; },
    quiz: [
      { q: 'Une roche qui laisse passer l’eau est :', o: ['perméable', 'imperméable', 'sédimentaire'], a: 0, e: 'L’eau peut s’y infiltrer.' },
      { q: 'La zone qui draine l’eau vers un même cours d’eau est :', o: ['le bassin versant', 'la nappe', 'la source'], a: 0, e: 'Elle alimente la rivière.' },
      { q: 'Quelle action économise l’eau ?', o: ['Le goutte-à-goutte', 'Arroser en plein midi', 'Laisser un robinet ouvert'], a: 0, e: 'Il apporte l’eau directement aux racines.' }
    ] });

  /* ===================================================== accueil */
  var LV = [
    ['1', '1<sup>re</sup> année', 'السنة الأولى'], ['2', '2<sup>e</sup> année', 'السنة الثانية'], ['3', '3<sup>e</sup> année', 'السنة الثالثة']
  ];
  var CH = [
    ['s1-1', 'Le milieu naturel et la cellule', 'الوسط الطبيعي والخلية', 'Le milieu', '1'],
    ['s1-2', 'La respiration chez les êtres vivants', 'التنفس في أوساط مختلفة', 'Respiration', '1'],
    ['s1-3', 'La nutrition et les régimes alimentaires', 'التغذية والأنظمة الغذائية', 'Nutrition', '1'],
    ['s1-4', 'Chaînes alimentaires et équilibres naturels', 'السلاسل الغذائية والتوازنات الطبيعية', 'Équilibres', '1'],
    ['s1-5', 'La classification des êtres vivants', 'تصنيف الكائنات الحية', 'Classification', '1'],
    ['s1-6', 'Le cycle sédimentaire et les fossiles', 'الدورة الرسوبية والأحافير', 'Géologie', '1'],
    ['s1-7', 'Les ressources en eau', 'الموارد المائية', 'Géologie', '1'],
    ['s2-1', 'La tectonique des plaques', 'تكتونية الصفائح', 'Géologie', '2'],
    ['s2-2', 'La reproduction chez les animaux', 'التوالد عند الحيوانات', 'Reproduction', '2'],
    ['s2-3', 'La reproduction chez les plantes à fleurs', 'التوالد عند النباتات الزهرية', 'Reproduction', '2'],
    ['s2-4', 'La reproduction chez l’Homme', 'التوالد عند الإنسان', 'Reproduction', '2'],
    ['s2-5', 'L’hérédité chez l’Homme', 'الوراثة عند الإنسان', 'Hérédité', '2'],
    ['s3-1', 'La digestion et l’absorption intestinale', 'الهضم والامتصاص المعوي', 'Nutrition', '3'],
    ['s3-6', 'L’éducation nutritionnelle', 'التربية الغذائية', 'Nutrition', '3'],
    ['s3-2', 'La respiration chez l’Homme', 'التنفّس عند الإنسان', 'Nutrition', '3'],
    ['s3-3', 'Le sang et la circulation sanguine', 'الدم والدورة الدموية', 'Nutrition', '3'],
    ['s3-4', 'L’excrétion urinaire chez l’Homme', 'الإبراز البولي عند الإنسان', 'Nutrition', '3'],
    ['s3-7', 'Le système nerveux', 'الجهاز العصبي', 'Relation', '3'],
    ['s3-8', 'Le système musculaire', 'الجهاز العضلي', 'Relation', '3'],
    ['s3-9', 'Les micro-organismes', 'الجراثيم', 'Santé', '3'],
    ['s3-5', 'L’immunité', 'المناعة', 'Santé', '3'],
    ['s3-10', 'Les réponses immunitaires', 'الاستجابات المناعية', 'Santé', '3'],
    ['s3-11', 'Les dysfonctionnements du système immunitaire', 'اضطرابات جهاز المناعة', 'Santé', '3']
  ];
  var APPROS = { 's3-4': 1, 's3-11': 1 };
  function home() {
    var box = PC.$('#chapters'); if (!box) return; box.replaceChildren();
    LV.forEach(function (lv) {
      var list = CH.filter(function (c) { return c[4] === lv[0]; });
      box.appendChild(h('h2', { 'class': 'lvl' }, lv[1] + ' · <span dir="rtl" lang="ar">' + lv[2] + '</span>'));
      var grid = h('div', { 'class': 'chap-grid' });
      list.forEach(function (c, i) {
        var a = h('a', { 'class': 'chap', href: '#' + c[0] });
        a.innerHTML = '<strong>' + (i + 1) + '. ' + c[1] + '</strong><span class="ar-t" dir="rtl" lang="ar">' + c[2] + '</span><small>Disponible · ' + c[3] + (APPROS[c[0]] ? ' · <span class="appro">Approfondissement</span>' : '') + '</small>';
        grid.appendChild(a);
      });
      box.appendChild(grid);
    });
    var REF = [
      ['1<sup>re</sup> année', 'الأولى', ['La relation entre les êtres vivants et leurs interactions avec le milieu naturel', 'Les phénomènes géologiques externes'], ['العلاقات بين الكائنات الحية وتفاعلها مع الوسط', 'الظواهر الجيولوجية الخارجية'],
        'Comparaison des régimes carnivore et herbivore ; production de matière et flux d’énergie ; rappels sur les états de l’eau et le cycle de l’eau.', 'الدراسة المقارنة للنظام الغذائي اللاحم والعاشب ؛ إنتاج المادة وتدفق الطاقة ؛ تذكير بحالات الماء ودورته.'],
      ['2<sup>e</sup> année', 'الثانية', ['Les phénomènes géologiques internes', 'La reproduction des êtres vivants et la transmission des caractères héréditaires chez l’Homme'], ['الظواهر الجيولوجية الباطنية', 'التوالد عند الكائنات الحية وانتقال الصفات الوراثية عند الإنسان'],
        'Modèle de structure interne du globe ; métamorphisme ; formation des chaînes de montagnes ; reproduction asexuée chez les végétaux.', 'نموذج البنية الداخلية للكرة الأرضية ؛ التحول ؛ تكوّن السلاسل الجبلية ؛ التوالد اللاجنسي عند النباتات.'],
      ['3<sup>e</sup> année', 'الثالثة', ['Les fonctions de nutrition chez l’Homme et éducation nutritionnelle', 'Les fonctions de relation chez l’Homme et immunologie'], ['وظائف الاقتيات والتربية الغذائية', 'وظائف الربط وعلم المناعة'],
        'Circulation sanguine ; excrétion urinaire ; caractéristiques du muscle squelettique ; dysfonctionnement du système immunitaire (allergie, SIDA) ; problèmes liés à la transfusion sanguine.', 'الدوران الدموي ؛ الإبراز البولي ؛ خاصيات العضلة الهيكلية ؛ اضطرابات جهاز المناعة (الحساسية، السيدا) ؛ المشاكل المتعلقة بنقل الدم.']
    ];
    var det = h('details', { 'class': 'lab-note appro-note' });
    det.innerHTML = '<summary><b>Repères du programme officiel · مراجع البرنامج الرسمي</b></summary>' + REF.map(function (r) {
      return '<p><b>' + r[0] + ' · <span dir="rtl" lang="ar">' + r[1] + '</span></b><br>' + r[2].map(function (x, i) { return 'Unité ' + (i + 1) + ' : ' + x + ' <span dir="rtl" lang="ar" style="display:block">الوحدة ' + (i + 1) + ': ' + r[3][i] + '</span>'; }).join('') +
        '<em>Contenus supprimés du programme allégé : </em>' + r[4] + ' <span dir="rtl" lang="ar" style="display:block"><em>المضامين المحذوفة: </em>' + r[5] + '</span></p>';
    }).join('') + '<p>Source : « Document de référence relatif à l’adaptation des programmes scolaires », ministère de l’Éducation nationale, du Préscolaire et des Sports, direction des curricula, janvier 2024. Document publié sur le site du ministère, men.gov.ma.<span dir="rtl" lang="ar" style="display:block">المصدر: وثيقة مرجعية في شأن تكييف البرامج الدراسية، وزارة التربية الوطنية والتعليم الأولي والرياضة، مديرية المناهج، يناير 2024. منشورة على موقع الوزارة men.gov.ma.</span></p>';
    box.appendChild(h('p', { 'class': 'lab-note appro-note' }, 'Repère : ces chapitres s’appuient sur le programme officiel de SVT du collège (version adaptée 2023-2024 du ministère). « Approfondissement » signale un chapitre hors de ce programme allégé, utile pour aller plus loin. <span dir="rtl" lang="ar" style="display:block;margin-top:4px">تستند الفصول إلى برنامج علوم الحياة والأرض الرسمي (النسخة المتكيفة 2023-2024). وسم «تعمّق» يعني فصلا خارج هذا البرنامج المخفف.</span>'));
    box.appendChild(det);
  }
  PC.onHome = home; home();
  window.addEventListener('load', function () { PC.route(); });
})();
