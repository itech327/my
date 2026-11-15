/* ===================================================== 2AC · t2-3 SCHÉMA ÉLECTRONIQUE ET FONCTION TECHNIQUE */
function chaineLampe(el) {
  var svg = ui.stage(el, 400, 190, 'Fonctions techniques d’une lampe automatique'), g = S('g', null, svg);
  var F = [['Alimenter', 'Alimentation', 'Pile', 'Elle fournit l’énergie.', 'alim'], ['Détecter', 'Détection', 'Photorésistance', 'Elle détecte la lumière.', 'det'], ['Temporiser', 'Temporisation', 'Condensateur', 'Il retarde l’extinction.', 'tmp'], ['Commuter', 'Commutation', 'Transistor', 'Il ferme le circuit de la lampe.', 'com'], ['Signaler', 'Signalisation', 'LED', 'Elle éclaire : signal lumineux.', 'sig']];
  var zones = [], items = [];
  F.forEach(function (f, i) {
    var x = 6 + i * 79, r = rect(g, x, 60, 70, 60, BLUE, .08, 4, 1.8);
    txt(g, x + 35, 86, f[1], '#fff', 'middle', 9.5, true); txt(g, x + 35, 102, 'fonction', '#7e9bb2', 'middle', 8.5);
    if (i < 4) arrow(g, x + 71, 90, x + 78, 90, 'rgba(255,255,255,.4)', 1.4);
    zones.push({ key: f[4], title: f[1], el: S('rect', { x: x, y: 60, width: 70, height: 60, style: 'fill:transparent' }, g), mark: function (m) { r.style.stroke = m === 2 ? GREEN : (m ? AMBER : BLUE); r.style.strokeWidth = m ? 3.5 : 1.8; } });
    items.push({ name: f[2], key: f[4], why: f[3] });
  });
  txt(g, 200, 30, 'Chaîne d’une lampe qui s’allume la nuit', '#9fb8cc', 'middle', 11);
  matchGame(el, svg, { items: items, zones: zones, intro: 'Touche une fonction technique pour voir son composant.' });
}

var SYMS = [
  ['Pile', function (g, x, y) { sBat(g, x, y, '', 60); }, 'Elle fournit l’énergie.'],
  ['Résistance', function (g, x, y) { sRes(g, x, y, '', 60); }, 'Elle limite le courant.'],
  ['LED', function (g, x, y) { sLed(g, x, y, .6, '', RED, 60); }, 'Elle émet de la lumière.'],
  ['Interrupteur', function (g, x, y) { sSwitch(g, x, y, false, '', 60); }, 'Il ouvre ou ferme le circuit.'],
  ['Buzzer', function (g, x, y) { sBuzzer(g, x, y, false, 0, '', 60); }, 'Il émet un son.'],
  ['Moteur', function (g, x, y) { sMotor(g, x, y, 0, '', 60); }, 'Il fait tourner un axe.'],
  ['Photorésistance', function (g, x, y) { sLdr(g, x, y, '', 60); }, 'Sa résistance dépend de la lumière.'],
  ['Condensateur', function (g, x, y) { sCap(g, x, y, 0, '', 60); }, 'Il stocke de l’énergie.']
];
function reconnaitre(el) {
  var svg = ui.stage(el, 400, 150, 'Reconnaître un symbole'), dyn = S('g', null, svg);
  var info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el), ctl = ui.controls(el);
  var order = PC.shuffle(SYMS.map(function (_, i) { return i; })), cur = 0, score = 0, locked = false, btns = [];
  for (var i = 0; i < 4; i++) (function (i) { btns.push(ui.btn(ctl, '', function () { answer(i); })); })(i);
  var rs = ui.btn(ctl, 'Recommencer', function () { order = PC.shuffle(order); cur = 0; score = 0; rs.hidden = true; show(); }); rs.hidden = true;
  var opts = [];
  function show() {
    verd.set('', ''); locked = false; dyn.replaceChildren(); btns.forEach(function (b) { b.hidden = false; });
    if (cur >= order.length) { chips.set(ui.chip('Score ' + score + ' / ' + order.length, AMBER)); verd.set('Terminé : ' + score + ' / ' + order.length + '.', score >= 6 ? 'ok' : ''); btns.forEach(function (b) { b.hidden = true; }); rs.hidden = false; return; }
    var s = SYMS[order[cur]]; s[1](dyn, 200, 75); circ(dyn, 200, 75, 0, '#000', 0, 0);
    var wrong = PC.shuffle(SYMS.map(function (_, i) { return i; }).filter(function (i) { return i !== order[cur]; })).slice(0, 3);
    opts = PC.shuffle([order[cur]].concat(wrong)); btns.forEach(function (b, i) { b.textContent = SYMS[opts[i]][0]; });
    chips.set(ui.chip((cur + 1) + ' / ' + order.length, BLUE) + ui.chip('Score ' + score, AMBER)); info.set('Quel est ce composant ?');
  }
  function answer(i) {
    if (locked) return; locked = true; var ok = opts[i] === order[cur]; if (ok) score++; verd.set(ok ? 'Exact.' : 'Non : ' + SYMS[order[cur]][0] + '.', ok ? 'ok' : ''); info.set('<b>' + SYMS[order[cur]][0] + '</b> : ' + SYMS[order[cur]][2]); cur++; setTimeout(show, 1300);
  }
  show();
}

var COL = [['noir', '#1a1a1a'], ['marron', '#8b5a2b'], ['rouge', '#e04040'], ['orange', '#f08a24'], ['jaune', '#f2d03b'], ['vert', '#3bb273'], ['bleu', '#3b82e0'], ['violet', '#8e5bd9'], ['gris', '#9aa4ad'], ['blanc', '#f2f2f2']];
function codeCouleurs(el) {
  var svg = ui.stage(el, 400, 170, 'Code des couleurs d’une résistance'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el);
  var b = [4, 7, 2];
  function val() { return (b[0] * 10 + b[1]) * Math.pow(10, b[2]); }
  function draw() {
    dyn.replaceChildren(); ln(dyn, 30, 85, 100, 85, WIRE, 3); ln(dyn, 300, 85, 370, 85, WIRE, 3);
    S('rect', { x: 100, y: 55, width: 200, height: 60, rx: 22, style: 'fill:#c9a97a;stroke:#e8d3b0;stroke-width:2' }, dyn);
    [120, 160, 200].forEach(function (x, i) { S('rect', { x: x, y: 55, width: 16, height: 60, style: 'fill:' + COL[b[i]][1] + ';stroke:rgba(0,0,0,.4)' }, dyn); txt(dyn, x + 8, 140, ['1er chiffre', '2e chiffre', 'multiplicateur'][i], '#9fb8cc', 'middle', 8.5); });
    S('rect', { x: 262, y: 55, width: 12, height: 60, style: 'fill:#d4af37' }, dyn);
    var v = val(); txt(dyn, 200, 36, 'R = ' + b[0] + b[1] + ' × 10' + (b[2] ? '^' + b[2] : '⁰') + ' = ' + fmtR(v), AMBER, 'middle', 14, true);
    chips.set(ui.chip(COL[b[0]][0] + ' · ' + COL[b[1]][0] + ' · ' + COL[b[2]][0], BLUE));
  }
  [['1er chiffre', 0, 1], ['2e chiffre', 1, 0], ['Multiplicateur', 2, 0]].forEach(function (c) {
    ui.slider(el, { label: c[0], min: c[2], max: c[0] === 'Multiplicateur' ? 6 : 9, value: b[c[1]], step: 1, color: BLUE, fmt: function (v) { return COL[v][0]; } }, function (v) { b[c[1]] = v; draw(); });
  });
  info.set('Les deux premières bandes donnent les chiffres, la troisième le nombre de zéros. La bande dorée : précision 5 %.');
  draw();
}

PC.chapter({ id: 't2-3', lazy: true, eyebrow: EY2 + 'Module 2 · Fonctions techniques', title: 'Schéma électronique et fonction technique', ar: 'المخطط الإلكتروني والوظيفة التقنية',
  lessons: function () { return [
    { short: 'Fonction technique', title: 'Fonction technique', intro: 'Quel composant remplit quelle fonction ?', build: chaineLampe,
      retenir: ['Une <b>fonction technique</b> est une action réalisée par un composant.', 'Alimenter, détecter, temporiser, commuter, signaler.'],
      ar: { e: ['الوظيفة التقنية فعل ينجزه مكوّن: التغذية، الكشف، التأخير، التبديل، الإشارة.'], u: 'المس وظيفة.', w: [['fonction technique', 'وظيفة تقنية'], ['composant', 'مكوّن']] } },
    { short: 'Symboles', title: 'Symboles normalisés', intro: 'Reconnais huit symboles.', build: reconnaitre,
      retenir: ['Un <b>schéma électronique</b> utilise des symboles normalisés.', 'Chaque composant a le sien.'],
      ar: { e: ['المخطط الإلكتروني يستعمل رموزا معيارية، ولكل مكوّن رمزه.'], u: 'تعرّف على الرمز.', w: [['symbole', 'رمز'], ['schéma', 'مخطط']] } },
    { short: 'Couleurs', title: 'Lire une résistance', intro: 'Règle les trois bandes.', build: codeCouleurs,
      retenir: ['Bande 1 et 2 : <b>chiffres</b>. Bande 3 : <b>zéros</b>.', 'Exemple : jaune, violet, rouge = 4 700 Ω.'],
      ar: { e: ['نقرأ المقاومة من ألوانها: رقمان ثم عدد الأصفار.'], u: 'اضبط الألوان.', w: [['bande', 'حلقة لونية'], ['résistance', 'مقاومة']] } }
  ]; },
  quiz: [
    { q: 'Quelle fonction réalise une LED ?', o: ['signalisation', 'alimentation', 'détection'], a: 0, e: 'Elle signale par la lumière.' },
    { q: 'Quelle fonction réalise une photorésistance ?', o: ['détection', 'commutation', 'alimentation'], a: 0, e: 'Elle détecte la lumière.' },
    { q: 'Jaune, violet, rouge valent :', o: ['4 700 Ω', '470 Ω', '47 Ω'], a: 0, e: '47 suivi de deux zéros.' },
    { q: 'Un schéma électronique utilise :', o: ['des symboles normalisés', 'des photos', 'des dessins libres'], a: 0, e: 'Chaque composant a un symbole.' }
  ]
});
