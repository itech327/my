/* ===================================================== 2AC · t2-9 TRANSMISSION DE MOUVEMENT */
function poulies(el) {
  var svg = ui.stage(el, 400, 200, 'Poulies et courroie'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el);
  var d1 = 40, d2 = 80, t = 0, N1 = 600;
  ui.slider(el, { label: 'Poulie motrice d1', min: 20, max: 80, value: 40, step: 5, color: AMBER, fmt: function (v) { return v + ' mm'; } }, function (v) { d1 = v; calc(); });
  ui.slider(el, { label: 'Poulie réceptrice d2', min: 20, max: 80, value: 80, step: 5, color: BLUE, fmt: function (v) { return v + ' mm'; } }, function (v) { d2 = v; calc(); });
  function N2() { return N1 * d1 / d2; }
  function calc() { var r = N2() / N1; chips.set(ui.chip('N1 = ' + N1 + ' tr/min', AMBER) + ui.chip('N2 = N1 × d1 / d2 = ' + Math.round(N2()) + ' tr/min', BLUE)); info.set(r < 1 ? '<b>Réducteur</b> : la poulie réceptrice tourne plus lentement.' : (r > 1 ? '<b>Multiplicateur</b> : elle tourne plus vite.' : 'Même vitesse.')); }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); t += dt; var r1 = d1 * .85, r2 = d2 * .85 * .5 * 1, k = 1;
    r1 = d1 * .55; r2 = d2 * .55; var c1 = 100, c2 = 100 + r1 + r2 + 60, cy = 100, D = c2 - c1, ph = Math.asin((r1 - r2) / D), cs = Math.cos(ph), sn = Math.sin(ph);
    var a1 = t * 2.4, a2 = a1 * r1 / r2;
    var P1 = [c1 + r1 * sn, cy - r1 * cs], P2 = [c2 + r2 * sn, cy - r2 * cs], Q2 = [c2 + r2 * sn, cy + r2 * cs], Q1 = [c1 + r1 * sn, cy + r1 * cs];
    var belt = S('path', { d: 'M' + P1 + 'L' + P2 + 'A' + r2 + ' ' + r2 + ' 0 0 1 ' + Q2 + 'L' + Q1 + 'A' + r1 + ' ' + r1 + ' 0 0 1 ' + P1, style: 'fill:none;stroke:' + WIRE + ';stroke-width:4;stroke-dasharray:10 6;stroke-dashoffset:' + (-(t * 40) % 16) }, dyn);
    [[c1, r1, a1, AMBER], [c2, r2, a2, BLUE]].forEach(function (p) { circ(dyn, p[0], cy, p[1] - 3, p[3], .2, 2.5); ln(dyn, p[0], cy, p[0] + Math.cos(p[2]) * (p[1] - 6), cy + Math.sin(p[2]) * (p[1] - 6), p[3], 3); circ(dyn, p[0], cy, 3, p[3], 1, 0); });
    txt(dyn, c1, cy + r1 + 22, 'motrice', AMBER, 'middle', 10); txt(dyn, c2, cy + r2 + 22, 'réceptrice', BLUE, 'middle', 10);
    S('path', { d: 'M' + (c1 - 14) + ' 22A14 14 0 1 1 ' + (c1 + 14) + ' 22', style: 'fill:none;stroke:' + AMBER + ';stroke-width:2' }, dyn); S('path', { d: 'M' + (c2 - 14) + ' 22A14 14 0 1 1 ' + (c2 + 14) + ' 22', style: 'fill:none;stroke:' + BLUE + ';stroke-width:2' }, dyn);
    txt(dyn, (c1 + c2) / 2, 14, 'même sens', '#9fb8cc', 'middle', 10);
  });
  calc();
}
function engrenages(el) {
  var svg = ui.stage(el, 400, 220, 'Engrenages'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el);
  var z1 = 12, z2 = 24, t = 0, N1 = 600;
  ui.slider(el, { label: 'Dents roue motrice z1', min: 10, max: 36, value: 12, step: 2, color: AMBER, fmt: function (v) { return v + ' dents'; } }, function (v) { z1 = v; calc(); });
  ui.slider(el, { label: 'Dents roue réceptrice z2', min: 10, max: 36, value: 24, step: 2, color: BLUE, fmt: function (v) { return v + ' dents'; } }, function (v) { z2 = v; calc(); });
  function calc() { chips.set(ui.chip('N2 = N1 × z1 / z2 = ' + Math.round(N1 * z1 / z2) + ' tr/min', BLUE) + ui.chip('sens inverse', GREEN)); info.set('Le rapport de vitesse ne dépend que du <b>nombre de dents</b> : N2 / N1 = z1 / z2.'); }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); t += dt; var m = 3.3, r1 = z1 * m / 2, r2 = z2 * m / 2, D = r1 + r2, c1 = 200 - D / 2, c2 = c1 + D, a1 = t * 1.6, a2 = -a1 * z1 / z2 + Math.PI / z2;
    gear(dyn, c1, 110, r1, z1, a1, AMBER, 5); gear(dyn, c2, 110, r2, z2, a2, BLUE, 5);
    txt(dyn, c1, 200, 'z1 = ' + z1, AMBER, 'middle', 11, true); txt(dyn, c2, 200, 'z2 = ' + z2, BLUE, 'middle', 11, true);
    S('path', { d: 'M' + (c1 - 12) + ' 22A12 12 0 1 1 ' + (c1 + 12) + ' 22', style: 'fill:none;stroke:' + AMBER + ';stroke-width:2' }, dyn); S('path', { d: 'M' + (c2 + 12) + ' 22A12 12 0 1 0 ' + (c2 - 12) + ' 22', style: 'fill:none;stroke:' + BLUE + ';stroke-width:2' }, dyn);
  });
  calc();
}
function senRotation(el) {
  classify(el, 'Sens de rotation', [
    { name: 'Deux engrenages en contact', cat: 1, why: 'Les dents s’opposent : sens inverse.' },
    { name: 'Poulies et courroie', cat: 0, why: 'La courroie entraîne dans le même sens.' },
    { name: 'Chaîne et pignons', cat: 0, why: 'La chaîne garde le sens.' },
    { name: 'Trois engrenages alignés', cat: 0, why: 'Le premier et le dernier tournent dans le même sens.' },
    { name: 'Courroie croisée', cat: 1, why: 'Croisée en 8, elle inverse le sens.' }
  ], ['Même sens', 'Sens inverse'], 'Dans quel sens tourne la roue réceptrice ?');
}
PC.chapter({ id: 't2-9', lazy: true, eyebrow: EY2 + 'Module 2 · Fonctions techniques', title: 'Transmission de mouvement', ar: 'نقل الحركة',
  lessons: function () { return [
    { short: 'Poulies', title: 'Poulies et courroie', intro: 'Change les diamètres.', build: poulies,
      retenir: ['La courroie transmet le mouvement : <b>même sens</b>.', '<b>N2 = N1 × d1 / d2</b>.'],
      ar: { e: ['الحزام ينقل الحركة في الاتجاه نفسه: N2 = N1 × d1 / d2.'], u: 'غيّر القطرين.', w: [['poulie', 'بكرة'], ['courroie', 'حزام']] } },
    { short: 'Engrenages', title: 'Engrenages', intro: 'Change le nombre de dents.', build: engrenages,
      retenir: ['Deux roues dentées : <b>sens inverse</b>.', '<b>N2 = N1 × z1 / z2</b>.'],
      ar: { e: ['عجلتان مسنّنتان تدوران في اتجاهين متعاكسين: N2 = N1 × z1 / z2.'], u: 'غيّر الأسنان.', w: [['engrenage', 'مسنّنات'], ['dents', 'أسنان']] } },
    { short: 'Sens', title: 'Sens de rotation', intro: 'Même sens ou sens inverse ?', build: senRotation,
      retenir: ['Courroie et chaîne : même sens.', 'Deux engrenages : sens inverse.'],
      ar: { e: ['الحزام والسلسلة: الاتجاه نفسه. المسنّنان: اتجاه معاكس.'], u: 'صنّف الحالة.', w: [['sens inverse', 'اتجاه معاكس']] } }
  ]; },
  quiz: [
    { q: 'd1 = 40 mm, d2 = 80 mm, N1 = 600 tr/min. N2 vaut :', o: ['300 tr/min', '1 200 tr/min', '600 tr/min'], a: 0, e: '600 × 40 / 80 = 300.' },
    { q: 'z1 = 12, z2 = 24 : la roue réceptrice tourne :', o: ['deux fois moins vite', 'deux fois plus vite', 'à la même vitesse'], a: 0, e: 'N2 / N1 = 12 / 24.' },
    { q: 'Deux engrenages en contact tournent :', o: ['en sens inverse', 'dans le même sens', 'ne tournent pas'], a: 0, e: 'Les dents s’opposent.' },
    { q: 'Un système qui ralentit est un :', o: ['réducteur', 'multiplicateur', 'capteur'], a: 0, e: 'N2 < N1.' }
  ]
});
