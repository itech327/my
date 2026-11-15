/* ===================================================== 2AC · t2-8 TEMPORISATION */
var ETENSION = 6, SEUIL = 3;
function rcCircuit(el) {
  var svg = ui.stage(el, 400, 250, 'Charge d’un condensateur à travers une résistance'), dyn = S('g', null, svg), info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el);
  var R = 47, C = 100, t = 0, run = false, ctl = ui.controls(el), TMAX = 20;
  ui.slider(el, { label: 'Résistance R', min: 1, max: 100, value: 47, step: 1, color: BLUE, fmt: function (v) { return v + ' kΩ'; } }, function (v) { R = v; t = 0; calc(); });
  ui.slider(el, { label: 'Condensateur C', min: 10, max: 470, value: 100, step: 10, color: AMBER, fmt: function (v) { return v + ' µF'; } }, function (v) { C = v; t = 0; calc(); });
  ui.btn(ctl, 'Fermer l’interrupteur', function () { t = 0; run = true; });
  ui.btn(ctl, 'Remettre à zéro', function () { t = 0; run = false; });
  function tau() { return R * C / 1000; } function td() { return tau() * Math.log(ETENSION / (ETENSION - SEUIL)); }
  function uc(x) { return ETENSION * (1 - Math.exp(-x / tau())); }
  function calc() { chips.set(ui.chip('τ = R × C = ' + tau().toFixed(1) + ' s', AMBER) + ui.chip('délai ≈ ' + td().toFixed(1) + ' s', GREEN)); info.set('La LED s’allume quand UC atteint <b>' + SEUIL + ' V</b>. Une grande R ou une grande C <b>rallonge</b> le délai.'); }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); if (run) { t += dt; if (t > TMAX) { run = false; } }
    var u = uc(t), on = u >= SEUIL && (run || t > 0);
    wire(dyn, [[30, 28], [30, 96], [140, 96]], WIRE, 1.8); wire(dyn, [[260, 96], [370, 96], [370, 28], [30, 28]], WIRE, 1.8);
    S('rect', { x: 90, y: 16, width: 40, height: 24, style: 'fill:#0d1620' }, dyn); sSwitch(dyn, 100, 28, run, '', 44);
    S('rect', { x: 160, y: 16, width: 60, height: 24, style: 'fill:#0d1620' }, dyn); sRes(dyn, 190, 28, '', 56); txt(dyn, 190, 16, fmtR(R * 1000), BLUE, 'middle', 9.5);
    S('rect', { x: 280, y: 16, width: 50, height: 24, style: 'fill:#0d1620' }, dyn); sCap(dyn, 300, 28, u / ETENSION, '', 40); txt(dyn, 300, 12, C + ' µF', AMBER, 'middle', 9.5);
    sBat(dyn, 200, 96, ETENSION + ' V', 50); sLed(dyn, 300, 62, 0, '', GREEN, 0); S('circle', { cx: 345, cy: 62, r: 14 + 10 * (on ? 1 : 0), style: 'fill:' + GREEN + ';opacity:' + (on ? .6 : .1) }, dyn); txt(dyn, 345, 66, on ? 'ON' : 'off', '#fff', 'middle', 10, true);
    var X0 = 40, Y0 = 232, W = 330, H = 100; ln(dyn, X0, Y0, X0 + W, Y0, WIRE, 1.8); ln(dyn, X0, Y0, X0, Y0 - H - 4, WIRE, 1.8);
    ln(dyn, X0, Y0 - H * SEUIL / ETENSION, X0 + W, Y0 - H * SEUIL / ETENSION, RED, 1.2, '4 3'); txt(dyn, X0 + W, Y0 - H * SEUIL / ETENSION - 4, 'seuil ' + SEUIL + ' V', RED, 'end', 9);
    var pts = []; for (var i = 0; i <= 80; i++) { var x = TMAX * i / 80; pts.push([X0 + W * x / TMAX, Y0 - H * uc(x) / ETENSION]); } wire(dyn, pts, 'rgba(255,255,255,.28)', 1.6);
    var shown = []; for (var j = 0; j <= 80; j++) { var xx = TMAX * j / 80; if (xx > t) break; shown.push([X0 + W * xx / TMAX, Y0 - H * uc(xx) / ETENSION]); } if (shown.length > 1) wire(dyn, shown, AMBER, 2.6);
    circ(dyn, X0 + W * Math.min(t, TMAX) / TMAX, Y0 - H * u / ETENSION, 4, AMBER, 1, 0); txt(dyn, X0 + W / 2, 248, 'temps (s) — UC = ' + u.toFixed(1) + ' V', '#7e9bb2', 'middle', 9.5); txt(dyn, X0 - 4, Y0 - H, ETENSION + ' V', '#7e9bb2', 'end', 9);
    if (td() < TMAX) { ln(dyn, X0 + W * td() / TMAX, Y0, X0 + W * td() / TMAX, Y0 - H * SEUIL / ETENSION, GREEN, 1.4, '3 3'); }
    verd.set(!run && t === 0 ? 'Ferme l’interrupteur pour lancer la charge.' : (on ? 'Seuil atteint : la LED s’allume.' : 'Le condensateur se charge…'), on ? 'ok' : '');
  });
  calc();
}
function visezDelai(el) {
  var svg = ui.stage(el, 400, 150, 'Régler une durée'), dyn = S('g', null, svg), info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el);
  var R = 47, C = 100, target = 5, ctl = ui.controls(el);
  ui.slider(el, { label: 'Résistance R', min: 1, max: 100, value: 47, step: 1, color: BLUE, fmt: function (v) { return v + ' kΩ'; } }, function (v) { R = v; calc(); });
  ui.slider(el, { label: 'Condensateur C', min: 10, max: 470, value: 100, step: 10, color: AMBER, fmt: function (v) { return v + ' µF'; } }, function (v) { C = v; calc(); });
  ui.btn(ctl, 'Nouvel objectif', function () { target = [2, 3, 5, 8, 10][Math.floor(Math.random() * 5)]; calc(); });
  function calc() {
    var d = R * C / 1000 * Math.log(2), ok = Math.abs(d - target) <= target * .1; dyn.replaceChildren();
    var X0 = 30, W = 340; ln(dyn, X0, 90, X0 + W, 90, WIRE, 2); for (var s = 0; s <= 15; s += 5) { ln(dyn, X0 + W * s / 15, 84, X0 + W * s / 15, 96, WIRE, 1.5); txt(dyn, X0 + W * s / 15, 112, s + ' s', '#7e9bb2', 'middle', 9.5); }
    S('rect', { x: X0 + W * target * .9 / 15, y: 70, width: W * target * .2 / 15, height: 40, style: 'fill:' + GREEN + ';fill-opacity:.25;stroke:' + GREEN }, dyn); txt(dyn, X0 + W * target / 15, 60, 'objectif ' + target + ' s', GREEN, 'middle', 10.5, true);
    var x = X0 + W * Math.min(d, 15) / 15; ln(dyn, x, 64, x, 116, ok ? GREEN : AMBER, 3); txt(dyn, x, 134, d.toFixed(1) + ' s', ok ? GREEN : AMBER, 'middle', 11, true);
    chips.set(ui.chip('délai ≈ 0,69 × R × C = ' + d.toFixed(1) + ' s', ok ? GREEN : AMBER)); verd.set(ok ? 'Objectif atteint (à 10 % près).' : 'Règle R et C pour viser ' + target + ' s.', ok ? 'ok' : '');
    info.set('Délai ≈ <b>0,69 × R × C</b> (R en kΩ, C en µF, résultat en ms ÷ 1000).');
  }
  calc();
}
PC.chapter({ id: 't2-8', lazy: true, eyebrow: EY2 + 'Module 2 · Fonctions techniques', title: 'La fonction « Temporisation »', ar: 'وظيفة التأخير',
  lessons: function () { return [
    { short: 'Charge RC', title: 'Résistance et condensateur', intro: 'Lance la charge et observe la courbe.', build: rcCircuit,
      retenir: ['La <b>temporisation</b> retarde une action.', 'Elle utilise une résistance et un condensateur : <b>τ = R × C</b>.'],
      ar: { e: ['التأخير يؤخّر حدثا باستعمال مقاومة ومكثف: τ = R × C.'], u: 'أغلق القاطع.', w: [['condensateur', 'مكثف'], ['temporisation', 'تأخير']] } },
    { short: 'Régler', title: 'Régler la durée', intro: 'Trouve R et C pour le délai demandé.', build: visezDelai,
      retenir: ['Plus R ou C est grand, plus le délai est <b>long</b>.', 'Délai ≈ 0,69 × R × C.'],
      ar: { e: ['كلما كبرت R أو C طال التأخير.'], u: 'اضبط R و C.', w: [['délai', 'مدة التأخير']] } }
  ]; },
  quiz: [
    { q: 'Pour allonger le délai, on peut :', o: ['augmenter R ou C', 'diminuer R et C', 'changer la LED'], a: 0, e: 'τ = R × C augmente.' },
    { q: 'R = 10 kΩ, C = 100 µF : τ vaut :', o: ['1 s', '10 s', '0,1 s'], a: 0, e: '10 000 × 0,0001 = 1 s.' },
    { q: 'Quel composant stocke l’énergie électrique ?', o: ['le condensateur', 'la résistance', 'la LED'], a: 0, e: 'Il se charge progressivement.' },
    { q: 'La temporisation sert à :', o: ['retarder une action', 'mesurer la lumière', 'transformer le courant'], a: 0, e: 'Exemple : éclairage d’escalier.' }
  ]
});
