/* ===================================================== 2AC · t2-4 ALIMENTATION */
function sources(el) {
  var svg = ui.stage(el, 400, 190, 'Sources d’énergie électrique'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el);
  var D = { pile: ['Pile', '1,5 V à 9 V', 'Non rechargeable', 'Télécommande, horloge.', 'On la jette quand elle est vide.'], accu: ['Accumulateur', '3,7 V (Li-ion)', 'Rechargeable', 'Téléphone, tablette.', 'On le recharge avec un chargeur.'], sect: ['Bloc secteur', '5 à 12 V continu', 'Branché au 230 V', 'Routeur, chargeur.', 'Il transforme 230 V alternatif en basse tension continue.'] };
  var key = 'pile', t = 0;
  ui.tabs(el, [['pile', 'Pile'], ['accu', 'Accumulateur'], ['sect', 'Bloc secteur']], function (k) { key = k; paint(); });
  function paint() { var d = D[key]; chips.set(ui.chip(d[1], AMBER) + ui.chip(d[2], BLUE) + ui.chip(d[3], BLUE)); info.set('<b>' + d[0] + '.</b> ' + d[4]); }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); t += dt; ring(dyn); sLamp(dyn, 270, 70, 1, '', 48); sRes(dyn, 170, 70, '', 48);
    if (key === 'pile') { sBat(dyn, 190, 170, '1,5 V', 40); }
    else if (key === 'accu') { sBat(dyn, 170, 170, '', 24); sBat(dyn, 210, 170, '3,7 V', 24); S('rect', { x: 150, y: 150, width: 80, height: 40, rx: 5, style: 'fill:none;stroke:' + GREEN + ';stroke-width:1.6;stroke-dasharray:4 3' }, dyn); txt(dyn, 190, 205, '↻ rechargeable', GREEN, 'middle', 9); }
    else { rect(dyn, 160, 150, 60, 40, AMBER, .1, 4, 2); txt(dyn, 190, 174, '230 V ~', '#fff', 'middle', 10, true); txt(dyn, 190, 205, '→ 9 V ⎓', AMBER, 'middle', 10); }
    flow(dyn, RING, (t * .3) % 1, 8, AMBER, 2.5);
  });
  paint();
}
function assocPiles(el) {
  var svg = ui.stage(el, 400, 210, 'Piles en série et ampoule de 6 V'), dyn = S('g', null, svg), info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el);
  var N = 2, burnt = false, t = 0, ctl = ui.controls(el), rep = ui.btn(ctl, 'Remplacer l’ampoule', function () { burnt = false; calc(); }); rep.hidden = true;
  ui.slider(el, { label: 'Piles de 1,5 V en série', min: 1, max: 6, value: 2, step: 1, color: AMBER, fmt: function (v) { return v + ' pile' + (v > 1 ? 's' : ''); } }, function (v) { N = v; burnt = false; calc(); });
  var V, br;
  function calc() {
    V = N * 1.5; if (V > 7.5) burnt = true; br = burnt ? 0 : Math.min(1.1, Math.pow(V / 6, 2)); rep.hidden = !burnt;
    chips.set(ui.chip('U = ' + V.toFixed(1) + ' V', burnt ? RED : AMBER) + ui.chip('Ampoule : 6 V', BLUE));
    if (burnt) { verd.set('Ampoule grillée : tension trop élevée.', ''); info.set('Plus de 7,5 V : le filament fond.'); }
    else if (V < 4) { verd.set('L’ampoule brille faiblement.', ''); info.set('Les tensions s’<b>additionnent</b> : ' + N + ' × 1,5 = ' + V.toFixed(1) + ' V.'); }
    else { verd.set('Bonne luminosité.', 'ok'); info.set('Les tensions s’<b>additionnent</b> : ' + N + ' × 1,5 = ' + V.toFixed(1) + ' V.'); }
  }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); t += dt; ring(dyn); ln(dyn, 194, 70, 246, 70, WIRE, 2);
    sLamp(dyn, 270, 70, br, burnt ? 'grillée' : '6 V', 48); if (burnt) { ln(dyn, 258, 58, 282, 82, RED, 3); ln(dyn, 282, 58, 258, 82, RED, 3); }
    ln(dyn, 146, 70, 194, 70, WIRE, 2);
    for (var k = 0; k < N; k++) sBat(dyn, 190 + (k - (N - 1) / 2) * 34, 170, '', 34);
    if (!burnt) flow(dyn, RING, (t * .3) % 1, 8, AMBER, 2.5);
  });
  calc();
}
function autonomieBatterie(el) {
  var svg = ui.stage(el, 400, 170, 'Autonomie d’une batterie'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el);
  var C = 2000, I = 100, t = 0;
  ui.slider(el, { label: 'Capacité C', min: 500, max: 5000, value: 2000, step: 100, color: AMBER, fmt: function (v) { return v + ' mAh'; } }, function (v) { C = v; calc(); });
  ui.slider(el, { label: 'Courant consommé I', min: 10, max: 500, value: 100, step: 10, color: BLUE, fmt: function (v) { return v + ' mA'; } }, function (v) { I = v; calc(); });
  function dur() { var h = C / I; return h >= 48 ? (h / 24).toFixed(1) + ' jours' : h.toFixed(1) + ' h'; }
  function calc() { chips.set(ui.chip('Autonomie = C / I = ' + dur(), AMBER)); info.set('<b>Autonomie = C / I</b> = ' + C + ' / ' + I + ' = ' + (C / I).toFixed(1) + ' h.'); }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); t += dt; var u = (t / 6) % 1, lvl = 1 - u;
    S('rect', { x: 100, y: 40, width: 190, height: 70, rx: 8, style: 'fill:none;stroke:' + WIRE + ';stroke-width:3' }, dyn); S('rect', { x: 290, y: 60, width: 14, height: 30, rx: 3, style: 'fill:' + WIRE }, dyn);
    S('rect', { x: 106, y: 46, width: 178 * lvl, height: 58, rx: 4, style: 'fill:' + (lvl > .25 ? GREEN : RED) + ';fill-opacity:.55' }, dyn);
    txt(dyn, 195, 82, Math.round(lvl * 100) + ' %', '#fff', 'middle', 16, true); txt(dyn, 195, 140, 'durée de fonctionnement : ' + dur(), AMBER, 'middle', 13, true); txt(dyn, 195, 28, C + ' mAh', '#9fb8cc', 'middle', 11);
  });
  calc();
}
PC.chapter({ id: 't2-4', lazy: true, eyebrow: EY2 + 'Module 2 · Fonctions techniques', title: 'La fonction « Alimentation »', ar: 'وظيفة التغذية',
  lessons: function () { return [
    { short: 'Sources', title: 'Sources d’énergie', intro: 'Pile, accumulateur ou bloc secteur ?', build: sources,
      retenir: ['La fonction <b>alimentation</b> fournit l’énergie électrique.', 'Pile : à jeter. Accumulateur : rechargeable. Bloc secteur : sur le 230 V.'],
      ar: { e: ['التغذية تمدّ الدارة بالطاقة: عمود، مركّم قابل للشحن، أو محوّل من الشبكة.'], u: 'اختر مصدرا.', w: [['pile', 'عمود'], ['accumulateur', 'مركّم']] } },
    { short: 'Piles en série', title: 'Associer des piles', intro: 'Combien de piles pour une ampoule de 6 V ?', build: assocPiles,
      retenir: ['En série, les <b>tensions s’additionnent</b>.', 'Trop de tension détruit l’ampoule.'],
      ar: { e: ['عند ربط الأعمدة على التوالي تُجمع التوترات.'], u: 'غيّر عدد الأعمدة.', w: [['en série', 'على التوالي'], ['tension', 'توتر']] } },
    { short: 'Autonomie', title: 'Autonomie', intro: 'Combien de temps tient la batterie ?', build: autonomieBatterie,
      retenir: ['<b>Autonomie = C / I</b> (heures).', 'C en mAh, I en mA.'],
      ar: { e: ['مدة التشغيل = السعة ÷ التيار المستهلك.'], u: 'حرّك المنزلقين.', w: [['autonomieBatterie', 'مدة التشغيل'], ['capacité', 'سعة']] } }
  ]; },
  quiz: [
    { q: 'Deux piles de 1,5 V en série donnent :', o: ['3 V', '1,5 V', '0 V'], a: 0, e: 'Les tensions s’additionnent.' },
    { q: 'Quelle source est rechargeable ?', o: ['l’accumulateur', 'la pile', 'aucune'], a: 0, e: 'On le recharge avec un chargeur.' },
    { q: 'Batterie 2 000 mAh, 100 mA consommés : autonomie ?', o: ['20 h', '200 h', '2 h'], a: 0, e: '2000 / 100 = 20 h.' },
    { q: 'Un bloc secteur transforme :', o: ['le 230 V en basse tension continue', 'la lumière en son', 'rien'], a: 0, e: 'Il alimente les appareils électroniques.' }
  ]
});
