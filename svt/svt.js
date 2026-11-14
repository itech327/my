/* SVT en mouvement : 3e année du collège (3AC), nutrition et immunité.
   Même cadre que « Physique-Chimie en mouvement » (PC.chapter, PC.ui). */
(function () {
  'use strict';
  var PC = window.PC, ui = PC.ui, S = PC.S, h = PC.h, fmt = PC.fmt, clamp = PC.clamp, ease = PC.ease;
  var EY = '3<sup>e</sup> année · ';
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
      { short: 'Cœur', title: 'Le cœur et la double circulation', intro: 'Suis le sang dans la petite et la grande circulation. Change la fréquence cardiaque.', build: coeur,
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
  PC.chapter({ id: 's3-4', lazy: true, eyebrow: EY + 'Nutrition', title: 'L’excrétion urinaire chez l’Homme', ar: 'الإطراح البولي عند الإنسان',
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
        ar: { e: ['الجلد والأغشية المخاطية حواجز طبيعية تمنع دخول الميكروبات. إذا دخل ميكروب إلى الجسم تلتهمه الخلايا البلعمية (نوع من الكريات البيضاء) وتهضمه: هذه هي الالتهام (phagocytose).'], u: 'اضغط «Étape suivante» لتشاهد خطوات الالتهام واحدة بعد أخرى.', w: [['microbe', 'ميكروب'], ['phagocyte', 'خلية بلعمية'], ['phagocytose', 'الالتهام'], ['immunité', 'المناعة']] } },
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
      { short: 'Propriétés', title: 'Les propriétés du muscle', intro: 'Trois propriétés expliquent le fonctionnement d’un muscle squelettique.', build: proprietes,
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
  PC.chapter({ id: 's3-9', lazy: true, eyebrow: EY + 'Santé', title: 'Les microbes', ar: 'الميكروبات',
    lessons: function () { return [
      { short: 'Diversité', title: 'La diversité des microorganismes', intro: 'Touche chaque onglet pour découvrir les grands groupes de microbes.', build: diversite,
        retenir: ['Les microbes sont des êtres <b>microscopiques</b> : bactéries, virus, champignons microscopiques et protozoaires.', 'Certains sont utiles, d’autres sont <b>pathogènes</b> : ils provoquent des maladies.'],
        ar: { e: ['الميكروبات كائنات مجهرية لا تُرى بالعين المجردة: البكتيريا، والفيروسات، والفطريات المجهرية، والأوليات. بعضها نافع، مثل بكتيريا اللبن وخميرة الخبز، وبعضها ممرض يسبب الأمراض. الفيروسات أصغر من البكتيريا وليس لها بنية خلوية، ولا تتكاثر إلا داخل خلية حية.'], u: 'اضغط على كل لسان لتتعرف على المجموعة وأمثلتها.', w: [['microbe', 'ميكروب'], ['bactérie', 'بكتيريا'], ['virus', 'فيروس'], ['champignon', 'فطر'], ['protozoaire', 'أولي'], ['pathogène', 'ممرض']] } },
      { short: 'Dangers', title: 'Les dangers des microbes pathogènes', intro: 'Suis les étapes : de l’entrée du microbe à la maladie.', build: danger,
        retenir: ['Un microbe pathogène <b>entre</b> dans l’organisme, <b>se multiplie</b>, puis peut libérer des <b>toxines</b>.', 'Les maladies infectieuses peuvent être <b>contagieuses</b>.'],
        ar: { e: ['يدخل الميكروب الممرض إلى الجسم عبر الأنف أو الفم أو جرح أو الدم، ثم يتكاثر بسرعة، وقد يفرز سموما تُتلف الخلايا. تظهر الأعراض مثل الحمى والألم والتعب. ويمكن أن تنتقل بعض الأمراض من شخص إلى آخر، وهذا هو العدوى.'], u: 'اضغط «Étape suivante» لتتبع مراحل الإصابة.', w: [['toxine', 'سمّ ميكروبي'], ['contagion', 'عدوى'], ['maladie infectieuse', 'مرض معدٍ']] } },
      { short: 'Se protéger', title: 'Se protéger des microbes', intro: 'Quels gestes limitent les infections ?', build: proteger,
        retenir: ['Hygiène des mains, des aliments et de l’eau, soin des plaies et vaccination protègent des microbes.', 'Les <b>antibiotiques</b> sont inefficaces contre les virus.'],
        ar: { e: ['للوقاية من الميكروبات: غسل اليدين بالصابون، وغسل الخضر والفواكه وطهي اللحم جيدا وشرب ماء صالح للشرب، وتنظيف الجروح وتعقيمها، والتلقيح. المضادات الحيوية تؤثر في البكتيريا فقط ولا تؤثر في الفيروسات، ويجب أخذها بوصفة الطبيب.'], w: [['antibiotique', 'مضاد حيوي'], ['vaccin', 'لقاح'], ['désinfecter', 'عقّم']] } }
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
        ar: { e: ['الاستجابة المناعية غير النوعية فورية وتكون نفسها تجاه كل الميكروبات. تبدأ بالحواجز الطبيعية مثل الجلد، فإذا دخل الميكروب يحدث التهاب: احمرار وحرارة وانتفاخ وألم، ثم تأتي الخلايا البلعمية وتلتهم الميكروبات.'], u: 'اضغط «Étape suivante» لتتبع مراحل الاستجابة.', w: [['réponse non spécifique', 'استجابة غير نوعية'], ['inflammation', 'التهاب'], ['phagocyte', 'خلية بلعمية'], ['phagocytose', 'الالتهام']] } },
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
  PC.chapter({ id: 's3-11', lazy: true, eyebrow: EY + 'Santé', title: 'Les dysfonctionnements du système immunitaire', ar: 'اختلالات الجهاز المناعي',
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

  /* ===================================================== accueil */
  var CH = [
    ['s3-1', 'La digestion et l’absorption intestinale', 'الهضم والامتصاص المعوي', 'Nutrition'],
    ['s3-6', 'L’éducation nutritionnelle', 'التربية الغذائية', 'Nutrition'],
    ['s3-2', 'La respiration chez l’Homme', 'التنفّس عند الإنسان', 'Nutrition'],
    ['s3-3', 'Le sang et la circulation sanguine', 'الدم والدورة الدموية', 'Nutrition'],
    ['s3-4', 'L’excrétion urinaire chez l’Homme', 'الإطراح البولي عند الإنسان', 'Nutrition'],
    ['s3-7', 'Le système nerveux', 'الجهاز العصبي', 'Relation'],
    ['s3-8', 'Le système musculaire', 'الجهاز العضلي', 'Relation'],
    ['s3-9', 'Les microbes', 'الميكروبات', 'Santé'],
    ['s3-5', 'L’immunité', 'المناعة', 'Santé'],
    ['s3-10', 'Les réponses immunitaires', 'الاستجابات المناعية', 'Santé'],
    ['s3-11', 'Les dysfonctionnements du système immunitaire', 'اختلالات الجهاز المناعي', 'Santé']
  ];
  function home() {
    var box = PC.$('#chapters'); if (!box) return; box.replaceChildren();
    CH.forEach(function (c, i) {
      var a = h('a', { 'class': 'chap', href: '#' + c[0] });
      a.innerHTML = '<strong>' + (i + 1) + '. ' + c[1] + '</strong><span class="ar-t" dir="rtl" lang="ar">' + c[2] + '</span><small>Disponible · ' + c[3] + '</small>';
      box.appendChild(a);
    });
  }
  PC.onHome = home; home();
  window.addEventListener('load', function () { PC.route(); });
})();
