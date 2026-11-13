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

  /* ===================================================== accueil */
  var CH = [
    ['s3-1', 'La digestion et l’absorption intestinale', 'الهضم والامتصاص المعوي', 'Nutrition'],
    ['s3-2', 'La respiration chez l’Homme', 'التنفّس عند الإنسان', 'Nutrition'],
    ['s3-3', 'Le sang et la circulation sanguine', 'الدم والدورة الدموية', 'Nutrition'],
    ['s3-4', 'L’excrétion urinaire chez l’Homme', 'الإطراح البولي عند الإنسان', 'Nutrition'],
    ['s3-5', 'L’immunité', 'المناعة', 'Santé']
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
