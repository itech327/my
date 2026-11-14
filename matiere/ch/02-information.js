/* ===================================================== 2. CHAÎNE D’INFORMATION : ACQUÉRIR */
function grandeurSignal(el) {
  var svg = ui.stage(el, 400, 250, 'Capteur et détecteur : signal analogique et signal logique'), g = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el), verd = ui.verdict(el);
  txt(g, 200, 18, 'Grandeur physique : la température', 'rgba(255,255,255,.7)', 'middle', 12);
  block(g, 20, 40, 100, 52, 'Capteur de\ntempérature', P, 12);
  block(g, 20, 150, 100, 52, 'Détecteur\nde seuil', L, 12);
  arrow(g, 120, 66, 170, 66, P); arrow(g, 120, 176, 170, 176, L);
  rect(g, 174, 50, 200, 32, 'rgba(255,255,255,1)', .06, 8, 1.5);
  var bar = S('rect', { x: 178, y: 54, width: 10, height: 24, rx: 5, style: 'fill:' + P }, g);
  var vtxt = txt(g, 274, 104, '', P, 'middle', 13, true);
  txt(g, 274, 124, 'signal analogique (varie de façon continue)', 'rgba(255,255,255,.6)', 'middle', 10.5);
  var lamp = circ(g, 230, 176, 20, L, .2, 3);
  var ltxt = txt(g, 230, 181, '0', INK, 'middle', 16, true);
  txt(g, 312, 172, 'signal logique', L, 'middle', 12);
  txt(g, 312, 190, '(0 ou 1, tout ou rien)', 'rgba(255,255,255,.6)', 'middle', 10.5);
  var sl = ui.slider(el, { label: 'Température', min: 0, max: 40, value: 18, step: 1, color: P, fmt: function (v) { return v + ' °C'; } }, draw);
  var sc = ui.slider(el, { label: 'Seuil du détecteur', min: 10, max: 35, value: 25, step: 1, color: L, fmt: function (v) { return v + ' °C'; } }, draw);
  function draw() {
    var T0 = sl.get(), s = sc.get(), v = 5 * T0 / 40, on = T0 >= s;
    bar.setAttribute('width', Math.max(10, 192 * T0 / 40));
    vtxt.textContent = fm(v, 2) + ' V';
    lamp.setAttribute('style', 'fill:' + L + ';fill-opacity:' + (on ? .85 : .15) + ';stroke:' + L + ';stroke-width:3');
    ltxt.textContent = on ? '1' : '0';
    chips.set(ui.chip('U = ' + fm(v, 2) + ' V', P) + ui.chip('Détecteur : ' + (on ? '1' : '0'), L));
    info.set('Le <b>capteur</b> donne une tension qui suit la grandeur (ici 0 V à 5 V pour 0 °C à 40 °C). Le <b>détecteur</b> compare la grandeur à un seuil et ne donne que 0 ou 1.');
    verd.set(on ? 'Température ≥ seuil : le détecteur envoie 1.' : 'Température < seuil : le détecteur envoie 0.', on ? 'ok' : '');
  }
  draw();
}

function symbole(g, kind, x, y) {
  var c = INK;
  if (kind === 'fdc') { ln(g, x - 34, y, x - 12, y, c, 2.5); ln(g, x - 12, y, x + 14, y - 16, c, 2.5); ln(g, x + 14, y, x + 34, y, c, 2.5); circ(g, x + 16, y - 16, 4, GOLD, .9, 1); }
  else if (kind === 'ldr') { ln(g, x - 40, y, x - 26, y, c, 2.5); S('rect', { x: x - 26, y: y - 10, width: 52, height: 20, style: 'fill:none;stroke:#fff;stroke-width:2.5' }, g); ln(g, x + 26, y, x + 40, y, c, 2.5); arrow(g, x - 20, y - 34, x - 6, y - 14, GOLD, 2); arrow(g, x - 4, y - 38, x + 10, y - 16, GOLD, 2); }
  else if (kind === 'ctn') { ln(g, x - 40, y, x - 26, y, c, 2.5); S('rect', { x: x - 26, y: y - 10, width: 52, height: 20, style: 'fill:none;stroke:#fff;stroke-width:2.5' }, g); ln(g, x + 26, y, x + 40, y, c, 2.5); ln(g, x - 18, y + 22, x - 4, y + 22, GOLD, 2.5); ln(g, x - 4, y + 22, x + 18, y - 22, GOLD, 2.5); txt(g, x + 30, y + 30, 't°', GOLD, 'middle', 12, true); }
  else { rect(g, x - 36, y - 24, 72, 48, GOLD, .15, 8, 2.5); txt(g, x, y + 4, kind === 'pir' ? 'PIR' : 'Ultrason', INK, 'middle', 12, true); }
}
var COMP = {
  fdc: { n: 'Fin de course', k: 'Détecteur', sig: 'logique', gr: 'Position d’une pièce', d: 'Un contact s’ouvre ou se ferme quand une pièce arrive en butée. Il donne 0 ou 1.', c: P },
  pir: { n: 'Détecteur de présence', k: 'Détecteur', sig: 'logique', gr: 'Rayonnement infrarouge du corps', d: 'Il détecte une personne en mouvement grâce à son rayonnement infrarouge. Il donne 0 ou 1.', c: L },
  ldr: { n: 'Photorésistance (LDR)', k: 'Capteur', sig: 'analogique', gr: 'Éclairement', d: 'Sa résistance diminue quand la lumière augmente. Le signal varie de façon continue.', c: T },
  ctn: { n: 'Thermistance (CTN)', k: 'Capteur', sig: 'analogique', gr: 'Température', d: 'Sa résistance diminue quand la température augmente. Le signal varie de façon continue.', c: C },
  us: { n: 'Capteur à ultrasons', k: 'Capteur', sig: 'analogique', gr: 'Distance d’un obstacle', d: 'Il mesure la durée de l’écho d’un son aigu pour en déduire une distance. Le signal varie avec la distance.', c: GOLD }
};
function composants(el) {
  var svg = ui.stage(el, 400, 200, 'Capteurs et détecteurs usuels'), g = S('g', null, svg);
  var wave = S('path', { fill: 'none', style: 'stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round' }, svg);
  var info = ui.info(el), chips = ui.chips(el), cur = COMP.fdc, key = 'fdc';
  function show(k) {
    key = k; cur = COMP[k]; g.replaceChildren();
    block(g, 10, 76, 84, 48, cur.gr.replace(/ (d’|de |du )/, '\n$1'), cur.c, 10.5);
    arrow(g, 94, 100, 118, 100, cur.c);
    symbole(g, k, 168, 104); arrow(g, 214, 100, 238, 100, cur.c);
    txt(g, 168, 40, cur.n, cur.c, 'middle', 13, true);
    txt(g, 318, 40, 'Signal ' + cur.sig, cur.c, 'middle', 12);
    wave.style.stroke = cur.c;
    chips.set(ui.chip(cur.k, cur.c) + ui.chip('Signal ' + cur.sig, cur.c));
    info.set('<b>' + cur.n + '</b> · ' + cur.k.toLowerCase() + ' de : ' + cur.gr.toLowerCase() + '. ' + cur.d);
  }
  ui.tabs(el, [['fdc', 'Fin de course'], ['pir', 'Présence'], ['ldr', 'LDR'], ['ctn', 'CTN'], ['us', 'Ultrasons']], show);
  show('fdc');
  PC.anim(svg, function (dt, t) {
    var pts = [], i;
    for (i = 0; i <= 60; i++) { var x = 244 + i * 2.4, tt = t * 2 + i * .12; pts.push([x, 100 + sigY(cur.sig, tt) * 30]); }
    wave.setAttribute('d', poly(pts));
  });
}

PC.chapter({ id: 't3-2', lazy: true, eyebrow: EY + 'Module 2 · Chaîne d’information', title: 'La fonction « Acquérir »', ar: 'الوظيفة «اكتساب المعلومة»',
  lessons: function () { return [
    { short: 'Capteur et détecteur', title: 'De la grandeur au signal', intro: 'Change la température. Compare le capteur, qui suit la grandeur, et le détecteur, qui compare à un seuil.', build: grandeurSignal,
      retenir: ['La fonction <b>Acquérir</b> prélève une information sur le système ou sur son environnement.', 'Un <b>capteur</b> fournit un signal qui varie avec la grandeur : <b>signal analogique</b>.', 'Un <b>détecteur</b> fournit un signal à deux états, 0 ou 1 : <b>signal logique</b>.'],
      ar: { e: ['وظيفة الاكتساب هي أخذ معلومة عن النظام أو عن محيطه. اللاقط يعطي إشارة تتغيّر مع المقدار المقاس (إشارة تماثلية)، أما الكاشف فيقارن المقدار بعتبة ويعطي إشارة من حالتين فقط، 0 أو 1 (إشارة منطقية).'], u: 'غيّر درجة الحرارة والعتبة، ولاحظ الفرق بين الإشارتين.', w: [['acquérir', 'اكتساب'], ['capteur', 'لاقط'], ['détecteur', 'كاشف'], ['signal analogique', 'إشارة تماثلية'], ['signal logique', 'إشارة منطقية']] } },
    { short: 'Composants', title: 'Capteurs et détecteurs usuels', intro: 'Choisis un composant : regarde son symbole, la grandeur qu’il surveille et la forme de son signal.', build: composants,
      retenir: ['Fin de course, détecteur de présence : <b>détecteurs</b>, signal logique.', 'Photorésistance, thermistance, capteur à ultrasons : <b>capteurs</b>, signal analogique.', 'On choisit le composant à partir d’une documentation technique.'],
      ar: { e: ['الكواشف مثل نهاية المسار وكاشف الحضور تعطي إشارة منطقية، واللواقط مثل المقاومة الضوئية والمقاومة الحرارية ولاقط الموجات فوق الصوتية تعطي إشارة تماثلية.'], u: 'اضغط على مكوّن لترى رمزه ونوع إشارته.', w: [['fin de course', 'نهاية المسار'], ['photorésistance', 'مقاومة ضوئية'], ['thermistance', 'مقاومة حرارية'], ['ultrasons', 'موجات فوق صوتية']] } }
  ]; },
  quiz: [
    { q: 'Un capteur de température fournit :', o: ['un signal analogique', 'seulement 0 ou 1', 'aucun signal'], a: 0, e: 'Son signal suit la température de façon continue.' },
    { q: 'Un détecteur de présence fournit un signal :', o: ['logique', 'analogique continu', 'sonore'], a: 0, e: 'Il y a une présence (1) ou non (0).' },
    { q: 'Quel composant mesure l’éclairement ?', o: ['la photorésistance', 'le fin de course', 'le relais'], a: 0, e: 'Sa résistance change avec la lumière.' },
    { q: 'La fonction « Acquérir » consiste à :', o: ['prélever une information', 'produire du mouvement', 'stocker de l’énergie'], a: 0, e: 'Elle est assurée par des capteurs et des détecteurs.' }
  ]
});

/* ===================================================== 3. TRAITER */
function organigramme(el) {
  var svg = ui.stage(el, 400, 340, 'Organigramme : éclairage automatique'), g = S('g', null, svg);
  var edges = [
    [[200, 38], [200, 62]], [[200, 94], [200, 118]],
    [[130, 150], [90, 150], [90, 221]], [[270, 150], [310, 150], [310, 221]],
    [[90, 259], [90, 300], [380, 300], [380, 78], [272, 78]], [[310, 259], [310, 300]]
  ];
  edges.forEach(function (e) { pathd(g, poly(e), 'rgba(255,255,255,.4)', 2); });
  txt(g, 108, 143, 'oui', T, 'start', 12, true); txt(g, 292, 143, 'non', C, 'end', 12, true);
  var N = {
    debut: fcNode(g, 'oval', 200, 24, 90, 28, 'Début', L),
    lire: fcNode(g, 'io', 200, 78, 150, 32, 'Lire L', P),
    test: fcNode(g, 'test', 200, 150, 140, 64, 'L < 40 ?', GOLD),
    on: fcNode(g, 'rect', 90, 240, 120, 38, 'Allumer\nla lampe', T),
    off: fcNode(g, 'rect', 310, 240, 120, 38, 'Éteindre\nla lampe', C)
  };
  var tok = S('circle', { r: 8, style: 'fill:#fff;stroke:var(--pink);stroke-width:3' }, svg);
  var info = ui.info(el), chips = ui.chips(el);
  var D = {
    debut: 'Le programme démarre.', lire: 'On lit la valeur du capteur de lumière : c’est la variable <b>L</b>.',
    test: 'On teste la condition : la luminosité L est-elle inférieure au seuil de 40 ?', on: 'Condition vraie : on allume la lampe.', off: 'Condition fausse : on éteint la lampe.'
  };
  var sl = ui.slider(el, { label: 'Luminosité L', min: 0, max: 100, value: 20, step: 1, color: GOLD, fmt: function (v) { return v + ' %'; } }, function () { });
  var st = { phase: 'A', p: 0, play: true, hold: 0, cur: 'debut', branch: 'on' };
  var A = follower([[200, 24], [200, 78], [200, 150]]);
  var YES = follower([[200, 150], [90, 150], [90, 221]]), NO = follower([[200, 150], [310, 150], [310, 221]]);
  var LOOPY = follower([[90, 221], [90, 300], [380, 300], [380, 78], [200, 78], [200, 150]]), LOOPN = follower([[310, 221], [310, 300], [380, 300], [380, 78], [200, 78], [200, 150]]);
  function paint() {
    Object.keys(N).forEach(function (k) { N[k].on(k === st.cur); });
    var L0 = sl.get();
    chips.set(ui.chip('L = ' + L0 + ' %', GOLD) + ui.chip('L < 40 : ' + (L0 < 40 ? 'vrai' : 'faux'), L0 < 40 ? T : C));
    info.set(D[st.cur]);
  }
  function nodeAt(pt) {
    var best = st.cur, bd = 30;
    Object.keys(N).forEach(function (k) { var d = Math.hypot(pt.x - N[k].cx, pt.y - N[k].cy); if (d < bd) { bd = d; best = k; } });
    return best;
  }
  var ctl = ui.controls(el), pb = ui.btn(ctl, 'Pause', function () { st.play = !st.play; pb.textContent = st.play ? 'Pause' : 'Lecture'; });
  PC.anim(svg, function (dt) {
    if (!st.play) return;
    if (st.hold > 0) { st.hold -= dt; return; }
    var sp = dt * 120, path;
    path = st.phase === 'A' ? A : (st.phase === 'B' ? (st.branch === 'on' ? YES : NO) : (st.branch === 'on' ? LOOPY : LOOPN));
    st.p += sp / path.total;
    var pt = path.at(st.p);
    tok.setAttribute('cx', pt.x); tok.setAttribute('cy', pt.y);
    var n = nodeAt(pt); if (n !== st.cur) { st.cur = n; paint(); if (n === 'lire' || n === 'test' || n === 'on' || n === 'off') st.hold = .25; }
    if (st.p >= 1) {
      st.p = 0;
      if (st.phase === 'A' || st.phase === 'C') { st.branch = sl.get() < 40 ? 'on' : 'off'; st.phase = 'B'; st.hold = .5; }
      else { st.phase = 'C'; st.hold = .6; }
    }
  });
  paint();
}

function structures(el) {
  var svg = ui.stage(el, 400, 250, 'Les trois structures algorithmiques'), g = S('g', null, svg);
  var info = ui.info(el), code = h('pre', { 'class': 'px-cap', style: 'white-space:pre-wrap;margin:8px 0 0;font:600 13px/1.5 ui-monospace,Menlo,monospace;color:var(--fg);direction:ltr;text-align:left' });
  var cur = 'lin', step = -1, tm = 0, run = false, nodes = [];
  var S3 = {
    lin: { t: 'Structure linéaire', ex: 'Ouvrir la porte : les actions se suivent dans l’ordre, une seule fois.', code: ['démarrer le moteur', 'attendre 5 secondes', 'arrêter le moteur'] },
    cond: { t: 'Structure conditionnelle', ex: 'Si un obstacle est détecté, on arrête le moteur, sinon on continue.', code: ['si obstacle alors', '  arrêter le moteur', 'sinon', '  continuer'] },
    rep: { t: 'Structure répétitive', ex: 'Faire clignoter une lampe 3 fois : on répète les mêmes actions tant que la condition est vraie.', code: ['n ← 0', 'tant que n < 3 faire', '  allumer, attendre, éteindre', '  n ← n + 1'] }
  };
  function draw() {
    g.replaceChildren(); nodes = [];
    var D = S3[cur];
    if (cur === 'lin') {
      [['oval', 'Début', 28], ['rect', 'Démarrer le moteur', 80], ['rect', 'Attendre 5 s', 132], ['rect', 'Arrêter le moteur', 184]].forEach(function (a, i) {
        if (i) arrow(g, 200, a[2] - 38, 200, a[2] - 16, 'rgba(255,255,255,.5)', 2);
        nodes.push(fcNode(g, a[0], 200, a[2], a[0] === 'oval' ? 90 : 170, 30, a[1], a[0] === 'oval' ? L : P));
      });
      arrow(g, 200, 200, 200, 214, 'rgba(255,255,255,.5)', 2); nodes.push(fcNode(g, 'oval', 200, 232, 90, 26, 'Fin', L));
      nodes = [nodes[0], nodes[1], nodes[2], nodes[3], nodes[4]];
    } else if (cur === 'cond') {
      nodes.push(fcNode(g, 'oval', 200, 22, 90, 26, 'Début', L)); arrow(g, 200, 36, 200, 62, 'rgba(255,255,255,.5)', 2);
      nodes.push(fcNode(g, 'test', 200, 96, 150, 64, 'Obstacle ?', GOLD));
      pathd(g, 'M125 96L80 96L80 150', 'rgba(255,255,255,.5)', 2); pathd(g, 'M275 96L320 96L320 150', 'rgba(255,255,255,.5)', 2);
      txt(g, 100, 90, 'oui', T, 'start', 12, true); txt(g, 300, 90, 'non', C, 'end', 12, true);
      nodes.push(fcNode(g, 'rect', 80, 168, 130, 36, 'Arrêter\nle moteur', T)); nodes.push(fcNode(g, 'rect', 320, 168, 130, 36, 'Continuer', C));
      pathd(g, 'M80 186L80 222L200 222', 'rgba(255,255,255,.5)', 2); pathd(g, 'M320 186L320 222L200 222', 'rgba(255,255,255,.5)', 2);
      nodes.push(fcNode(g, 'oval', 200, 232, 90, 26, 'Fin', L));
    } else {
      nodes.push(fcNode(g, 'oval', 200, 20, 90, 24, 'Début', L)); arrow(g, 200, 32, 200, 46, 'rgba(255,255,255,.5)', 2);
      nodes.push(fcNode(g, 'rect', 200, 62, 120, 26, 'n ← 0', P)); arrow(g, 200, 76, 200, 94, 'rgba(255,255,255,.5)', 2);
      nodes.push(fcNode(g, 'test', 200, 120, 150, 54, 'n < 3 ?', GOLD)); txt(g, 214, 158, 'oui', T, 'start', 12, true);
      arrow(g, 200, 147, 200, 168, 'rgba(255,255,255,.5)', 2);
      nodes.push(fcNode(g, 'rect', 200, 184, 190, 30, 'Allumer, attendre, éteindre', T)); arrow(g, 200, 199, 200, 214, 'rgba(255,255,255,.5)', 2);
      nodes.push(fcNode(g, 'rect', 200, 228, 120, 26, 'n ← n + 1', P));
      pathd(g, 'M140 228L40 228L40 120L125 120', 'rgba(255,255,255,.5)', 2); arrow(g, 118, 120, 126, 120, 'rgba(255,255,255,.5)', 2);
      pathd(g, 'M275 120L350 120L350 217', 'rgba(255,255,255,.5)', 2); txt(g, 292, 114, 'non', C, 'start', 12, true);
      nodes.push(fcNode(g, 'oval', 350, 228, 60, 22, 'Fin', L));
    }
    code.textContent = D.code.map(function (s, i) { return (i === step ? '▶ ' : '  ') + s; }).join('\n');
    info.set('<b>' + D.t + '.</b> ' + D.ex);
    nodes.forEach(function (n) { n.on(false); });
  }
  var ORDER = { lin: [0, 1, 2, 3, 4], cond: [0, 1, 2, 4], rep: [0, 1, 2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 5] };
  ui.tabs(el, [['lin', 'Linéaire'], ['cond', 'Conditionnelle'], ['rep', 'Répétitive']], function (k) { cur = k; run = false; step = -1; draw(); });
  el.appendChild(code);
  var ctl = ui.controls(el);
  ui.btn(ctl, 'Exécuter', function () { run = true; seq = 0; step = -1; tm = 0; nodes.forEach(function (n) { n.on(false); }); });
  var seq = 0;
  PC.anim(svg, function (dt) {
    if (!run) return;
    tm -= dt; if (tm > 0) return; tm = .7;
    var ord = ORDER[cur];
    if (seq >= ord.length) { run = false; seq = 0; nodes.forEach(function (n) { n.on(false); }); return; }
    nodes.forEach(function (n, i) { n.on(i === ord[seq]); });
    seq++;
  });
  draw();
}

function variable(el) {
  var svg = ui.stage(el, 400, 220, 'Une variable qui compte les passages'), g = S('g', null, svg);
  var info = ui.info(el), code = h('pre', { 'class': 'px-cap', style: 'white-space:pre-wrap;margin:8px 0 0;font:600 13px/1.5 ui-monospace,Menlo,monospace;color:var(--fg);direction:ltr;text-align:left' });
  var n = 0, hl = -1;
  var LINES = ['n ← 0', 'à chaque passage détecté :', '  n ← n + 1', '  si n ≥ 5 alors', '    déclencher l’alarme'];
  block(g, 16, 80, 100, 52, 'Capteur\nde passage', P, 12); arrow(g, 116, 106, 150, 106, P);
  rect(g, 154, 66, 100, 80, GOLD, .15, 12, 2.5); txt(g, 204, 86, 'variable n', GOLD, 'middle', 12, true);
  var val = txt(g, 204, 128, '0', INK, 'middle', 34, true);
  arrow(g, 254, 106, 290, 106, C);
  var alarm = circ(g, 330, 106, 30, C, .15, 3); txt(g, 330, 160, 'Alarme', C, 'middle', 12, true);
  function paint() {
    val.textContent = n;
    alarm.setAttribute('style', 'fill:' + C + ';fill-opacity:' + (n >= 5 ? .85 : .15) + ';stroke:' + C + ';stroke-width:3');
    code.textContent = LINES.map(function (s, i) { return (i === hl ? '▶ ' : '  ') + s; }).join('\n');
    info.set(n >= 5 ? 'La valeur de <b>n</b> a atteint 5 : la condition est vraie, l’alarme se déclenche.' : 'Une <b>variable</b> est une case mémoire qui porte un nom et dont la valeur peut changer. Ici, <b>n</b> compte les passages.');
  }
  el.appendChild(code);
  var ctl = ui.controls(el);
  ui.btn(ctl, 'Détecter un passage', function () { n++; hl = n >= 5 ? 4 : 2; paint(); });
  ui.btn(ctl, 'Recommencer', function () { n = 0; hl = 0; paint(); });
  paint();
}

function televerser(el) {
  var svg = ui.stage(el, 400, 150, 'Du programme à la carte électronique'), g = S('g', null, svg);
  var info = ui.info(el), verd = ui.verdict(el);
  var STEPS = [['Saisir', 'Écrire le programme sur l’ordinateur (en blocs ou en texte).'], ['Vérifier', 'L’ordinateur vérifie le programme et le traduit pour la carte.'], ['Téléverser', 'Le programme est envoyé dans la mémoire de la carte, par un câble.'], ['Tester', 'Le système technique fonctionne : on vérifie qu’il se comporte comme prévu.']];
  var boxes = STEPS.map(function (s, i) { var b = fcNode(g, 'rect', 52 + i * 99, 60, 88, 44, s[0], i === 2 ? T : L); if (i) arrow(g, 52 + i * 99 - 52, 60, 52 + i * 99 - 46, 60, 'rgba(255,255,255,.5)', 2); return b; });
  var bar = S('rect', { x: 20, y: 120, width: 0, height: 10, rx: 5, style: 'fill:' + T }, svg);
  S('rect', { x: 20, y: 120, width: 360, height: 10, rx: 5, style: 'fill:none;stroke:rgba(255,255,255,.3);stroke-width:1.5' }, svg);
  var k = -1;
  function paint() { boxes.forEach(function (b, i) { b.on(i === k); }); info.set(k < 0 ? 'Avance étape par étape.' : '<b>' + STEPS[k][0] + '.</b> ' + STEPS[k][1]); bar.setAttribute('width', k < 0 ? 0 : 360 * (k + 1) / 4); verd.set(k === 3 ? 'Le système fonctionne : le programme est exécuté par la carte.' : '', k === 3 ? 'ok' : ''); }
  var ctl = ui.controls(el);
  ui.btn(ctl, 'Étape suivante', function () { k = k >= 3 ? -1 : k + 1; paint(); });
  paint();
}

PC.chapter({ id: 't3-3', lazy: true, eyebrow: EY + 'Module 2 · Chaîne d’information', title: 'La fonction « Traiter »', ar: 'الوظيفة «معالجة المعلومة»',
  lessons: function () { return [
    { short: 'Organigramme', title: 'Un algorithme et son organigramme', intro: 'Règle la luminosité et suis le trajet dans l’organigramme de l’éclairage automatique.', build: organigramme,
      retenir: ['Un <b>algorithme</b> est la suite ordonnée des opérations à réaliser pour résoudre un problème.', 'Un <b>organigramme</b> représente l’algorithme avec des symboles : ovale (début, fin), parallélogramme (lecture), losange (test), rectangle (action).'],
      ar: { e: ['الخوارزمية هي تسلسل مرتب من العمليات لحلّ مشكلة. المنظّمة المبيانية (organigramme) تمثّلها برموز: بيضاوي للبداية والنهاية، متوازي أضلاع للقراءة، معيّن للاختبار، ومستطيل للفعل.'], u: 'حرّك منزلق الإضاءة وتابع مسار الكرة داخل المخطط.', w: [['algorithme', 'خوارزمية'], ['organigramme', 'مخطط انسيابي'], ['condition', 'شرط']] } },
    { short: 'Structures', title: 'Les trois structures algorithmiques', intro: 'Choisis une structure puis appuie sur Exécuter pour voir l’ordre des étapes.', build: structures,
      retenir: ['<b>Linéaire</b> : les actions se suivent dans l’ordre.', '<b>Conditionnelle</b> : le choix de l’action dépend d’une condition (si … alors … sinon).', '<b>Répétitive</b> : des actions sont répétées (tant que …).'],
      ar: { e: ['البنية الخطية: الأفعال تتتابع بالترتيب. البنية الشرطية: اختيار الفعل يتوقف على شرط (إذا … فإن … وإلا). البنية التكرارية: تُكرَّر أفعال ما دام الشرط محقَّقا.'], u: 'اختر بنية ثم اضغط «Exécuter».', w: [['structure linéaire', 'بنية خطية'], ['structure conditionnelle', 'بنية شرطية'], ['structure répétitive', 'بنية تكرارية']] } },
    { short: 'Variable', title: 'La variable et le programme', intro: 'Appuie sur le bouton : le capteur détecte un passage et la variable n augmente.', build: variable,
      retenir: ['Une <b>variable</b> mémorise une valeur qui peut changer pendant l’exécution.', 'Un <b>programme</b> traduit l’algorithme dans un langage que la carte comprend.'],
      ar: { e: ['المتغيّر خانة ذاكرة لها اسم وقيمتها قابلة للتغيّر أثناء التنفيذ. البرنامج هو ترجمة الخوارزمية إلى لغة تفهمها البطاقة الإلكترونية.'], u: 'اضغط على الزر لتزيد قيمة المتغيّر n.', w: [['variable', 'متغيّر'], ['programme', 'برنامج']] } },
    { short: 'Carte', title: 'Saisir, vérifier, téléverser, tester', intro: 'Suis les quatre étapes qui mènent du programme au système qui fonctionne.', build: televerser,
      retenir: ['<b>Saisir</b> le programme, le <b>vérifier</b>, le <b>téléverser</b> dans la carte électronique, puis <b>tester</b> le système.'],
      ar: { e: ['ندخل البرنامج ثم نتحقق منه ثم نرفعه إلى البطاقة الإلكترونية (téléverser) ثم نختبر اشتغال النظام.'], u: 'اضغط على الزر للانتقال من مرحلة إلى أخرى.', w: [['téléverser', 'رفع البرنامج إلى البطاقة'], ['carte électronique', 'بطاقة إلكترونية']] } }
  ]; },
  quiz: [
    { q: 'Quel symbole représente un test dans un organigramme ?', o: ['le losange', 'l’ovale', 'le rectangle'], a: 0, e: 'Le losange pose une question à deux réponses : oui ou non.' },
    { q: 'La structure « tant que … faire » est :', o: ['répétitive', 'linéaire', 'conditionnelle'], a: 0, e: 'Elle répète des actions tant que la condition est vraie.' },
    { q: 'Une variable sert à :', o: ['mémoriser une valeur qui peut changer', 'alimenter la carte', 'dessiner l’organigramme'], a: 0, e: 'C’est une case mémoire nommée.' },
    { q: 'Téléverser un programme, c’est :', o: ['l’envoyer dans la mémoire de la carte', 'le supprimer', 'le dessiner'], a: 0, e: 'Il est transféré de l’ordinateur vers la carte électronique.' },
    { q: 'Dans « si obstacle alors arrêter sinon avancer », la structure est :', o: ['conditionnelle', 'répétitive', 'linéaire'], a: 0, e: 'Le choix dépend d’une condition.' }
  ]
});

/* ===================================================== 4. COMMUNIQUER */
function communiquer(el) {
  var svg = ui.stage(el, 400, 220, 'Les quatre types de communication'), g = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el);
  var D = {
    vis: { t: 'Communication visuelle', c: P, who: 'Être humain', ex: 'voyant, afficheur LCD, écran', d: 'Le système informe l’utilisateur par la lumière ou par un texte affiché.' },
    son: { t: 'Communication sonore', c: GOLD, who: 'Être humain', ex: 'buzzer, haut-parleur, sonnerie', d: 'Le système informe l’utilisateur par un son.' },
    cab: { t: 'Communication câblée', c: T, who: 'Autre système', ex: 'câble USB, liaison série, fils', d: 'L’information circule dans un câble entre deux systèmes.' },
    sf: { t: 'Communication sans fil', c: L, who: 'Autre système', ex: 'Bluetooth, Wi-Fi, infrarouge', d: 'L’information voyage par ondes, sans câble entre les deux systèmes.' }
  };
  var cur = 'vis', anim = S('g', null, svg);
  function show(k) {
    cur = k; var d = D[k]; g.replaceChildren();
    block(g, 12, 70, 96, 64, 'Système\nqui émet', d.c, 12);
    block(g, 292, 70, 96, 64, d.who + '\nqui reçoit', d.c, 12);
    if (k === 'cab') { ln(g, 108, 102, 292, 102, d.c, 4); }
    else ln(g, 108, 102, 292, 102, 'rgba(255,255,255,.12)', 2, '4 6');
    txt(g, 200, 40, d.t, d.c, 'middle', 14, true); txt(g, 200, 190, d.ex, 'rgba(255,255,255,.7)', 'middle', 12);
    chips.set(ui.chip(d.who, d.c) + ui.chip(k === 'vis' || k === 'son' ? 'Vers l’utilisateur' : 'Entre systèmes', d.c));
    info.set('<b>' + d.t + '.</b> ' + d.d + ' Exemples : ' + d.ex + '.');
  }
  ui.tabs(el, [['vis', 'Visuelle'], ['son', 'Sonore'], ['cab', 'Câblée'], ['sf', 'Sans fil']], show);
  show('vis');
  PC.anim(svg, function (dt, t) {
    anim.replaceChildren(); var d = D[cur], i;
    if (cur === 'cab') { for (i = 0; i < 4; i++) { var p = (t * .5 + i / 4) % 1; circ(anim, 108 + p * 184, 102, 5, INK, .9, 0); } }
    else if (cur === 'vis') { var on = Math.sin(t * 4) > 0; for (i = 0; i < 5; i++) { var a = -.5 + i * .25; ln(anim, 116, 102, 116 + Math.cos(a) * 60, 102 + Math.sin(a) * 60, d.c, on ? 3 : .8); } }
    else { for (i = 0; i < 3; i++) { var q = (t * .6 + i / 3) % 1; S('path', { d: 'M' + (116 + q * 150) + ' ' + (102 - 12 - q * 30) + 'A' + (14 + q * 30) + ' ' + (14 + q * 30) + ' 0 0 1 ' + (116 + q * 150) + ' ' + (102 + 12 + q * 30), fill: 'none', style: 'stroke:' + d.c + ';stroke-width:3;stroke-opacity:' + (1 - q) + (cur === 'sf' ? ';stroke-dasharray:5 4' : '') }, anim); } }
  });
}
PC.chapter({ id: 't3-4', lazy: true, eyebrow: EY + 'Module 2 · Chaîne d’information', title: 'La fonction « Communiquer »', ar: 'الوظيفة «تبليغ المعلومة»',
  lessons: function () { return [
    { short: 'Quatre types', title: 'Visuelle, sonore, câblée, sans fil', intro: 'Choisis un type : regarde qui reçoit l’information et comment elle circule.', build: communiquer,
      retenir: ['La fonction <b>Communiquer</b> transmet l’information vers l’utilisateur ou vers un autre système.', 'Communication <b>visuelle</b> et <b>sonore</b> : vers l’utilisateur. Communication <b>câblée</b> et <b>sans fil</b> : entre systèmes.'],
      ar: { e: ['وظيفة التبليغ تنقل المعلومة إلى المستعمل أو إلى نظام آخر. التبليغ البصري والصوتي موجّه إلى المستعمل، والتبليغ السلكي واللاسلكي يكون بين الأنظمة.'], u: 'اختر نوع التبليغ من التبويبات.', w: [['communication visuelle', 'تبليغ بصري'], ['communication sonore', 'تبليغ صوتي'], ['communication câblée', 'تبليغ سلكي'], ['communication sans fil', 'تبليغ لاسلكي']] } }
  ]; },
  quiz: [
    { q: 'Un voyant lumineux est une communication :', o: ['visuelle', 'sonore', 'câblée'], a: 0, e: 'Il informe par la lumière.' },
    { q: 'Le Bluetooth est une communication :', o: ['sans fil', 'câblée', 'sonore'], a: 0, e: 'L’information voyage par ondes.' },
    { q: 'Un buzzer assure une communication :', o: ['sonore', 'visuelle', 'sans fil'], a: 0, e: 'Il émet un son pour avertir.' },
    { q: 'Un câble USB entre une carte et un ordinateur relève de la communication :', o: ['câblée', 'visuelle', 'sonore'], a: 0, e: 'L’information circule dans un câble.' }
  ]
});
