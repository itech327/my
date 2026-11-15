/* ===================================================== 2AC · MODULE 2 · SIGNALISATION (LED, résistance, buzzer) */
var E12 = [0, 100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820, 1000];
var ULED = 2, IMAX = 25, INOM = 20;
function fmtR(r) { return r === 0 ? 'aucune (fil)' : (r >= 1000 ? (r / 1000) + ' kΩ' : r + ' Ω'); }
var LOOP = [[170, 170], [30, 170], [30, 70], [146, 70], [194, 70], [246, 70], [294, 70], [340, 70], [340, 170], [210, 170]];

function ledCircuit(el) {
  var svg = ui.stage(el, 370, 230, 'Circuit LED et résistance de protection'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el);
  var E = 5, ri = 7, burnt = false, t = 0, I = 0;
  ui.slider(el, { label: 'Tension de la pile E', min: 3, max: 9, value: 5, step: .5, color: AMBER, fmt: function (v) { return v.toFixed(1) + ' V'; } }, function (v) { E = v; calc(); });
  ui.slider(el, { label: 'Résistance R (série E12)', min: 0, max: E12.length - 1, value: 7, step: 1, color: BLUE, fmt: function (v) { return fmtR(E12[v]); } }, function (v) { ri = v; calc(); });
  var ctl = ui.controls(el), rep = ui.btn(ctl, 'Remplacer la LED', function () { burnt = false; calc(); }); rep.hidden = true;
  function calc() {
    var R = E12[ri];
    if (burnt) { I = 0; } else {
      var Rt = Math.max(R, 1e-3); I = Math.max(0, (E - ULED) / (R === 0 ? 0.5 : Rt)) * 1000; /* mA, fil : 0,5 Ω de fil */
      if (I > IMAX) { burnt = true; I = 0; }
    }
    rep.hidden = !burnt;
    var UR = I / 1000 * R;
    chips.set(ui.chip('I = ' + I.toFixed(1) + ' mA', burnt ? RED : AMBER) + ui.chip('UR = ' + UR.toFixed(2) + ' V', BLUE) + ui.chip('ULED ≈ ' + (burnt ? '—' : ULED + ' V'), BLUE));
    if (burnt) { verd.set('LED grillée : le courant a dépassé 25 mA.', ''); info.set('Trop de courant. Augmente R, puis remplace la LED.'); }
    else if (I < 3) { verd.set('LED presque éteinte : R trop grande.', ''); info.set('<b>I = (E − ULED) / R</b> = (' + E.toFixed(1) + ' − 2) / ' + R + ' = ' + I.toFixed(1) + ' mA. Trop faible.'); }
    else if (I <= INOM) { verd.set('Bon réglage : 3 à 20 mA.', 'ok'); info.set('<b>I = (E − ULED) / R</b> = (' + E.toFixed(1) + ' − 2) / ' + R + ' = ' + I.toFixed(1) + ' mA.'); }
    else { verd.set('Attention : proche du maximum (25 mA).', ''); info.set('Trop proche du maximum. Augmente R.'); }
  }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); t += dt;
    wire(dyn, LOOP.slice(0, 4), WIRE, 2); wire(dyn, LOOP.slice(4), WIRE, 2); ln(dyn, 194, 70, 246, 70, WIRE, 2);
    sBat(dyn, 190, 170, E.toFixed(1) + ' V', 40); sRes(dyn, 170, 70, fmtR(E12[ri]), 48);
    var glow = burnt ? 0 : Math.min(1.1, I / INOM);
    sLed(dyn, 270, 70, glow, burnt ? 'LED grillée' : 'LED rouge', RED, 48);
    if (burnt) { ln(dyn, 258, 58, 282, 82, RED, 3); ln(dyn, 282, 58, 258, 82, RED, 3); }
    if (I > 0.5) flow(dyn, LOOP, -t * 0 + (t * Math.min(1.2, .12 + I / 40)) % 1, 8, AMBER, 2.6);
    dim(dyn, 146, 194, 100, fmtR(E12[ri]), BLUE);
  });
  calc();
}

function calculR(el) {
  var svg = ui.stage(el, 370, 200, 'Calcul de la résistance de protection'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el);
  var E = 9, It = 15;
  ui.slider(el, { label: 'Tension de la pile E', min: 3, max: 12, value: 9, step: 1, color: AMBER, fmt: function (v) { return v + ' V'; } }, function (v) { E = v; paint(); });
  ui.slider(el, { label: 'Courant voulu I', min: 5, max: 20, value: 15, step: 1, color: BLUE, fmt: function (v) { return v + ' mA'; } }, function (v) { It = v; paint(); });
  var SERIE = []; [1, 10, 100, 1000].forEach(function (d) { [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82].forEach(function (m) { SERIE.push(m * d / 10); }); });
  function paint() {
    var Rc = (E - ULED) / (It / 1000), Rn = SERIE.filter(function (r) { return r >= Rc; })[0], Ir = (E - ULED) / Rn * 1000;
    dyn.replaceChildren();
    rect(dyn, 10, 14, 350, 50, BLUE, .06, 4, 1.6); txt(dyn, 185, 36, 'R = (E − ULED) / I', '#fff', 'middle', 17, true);
    txt(dyn, 185, 56, '= (' + E + ' − 2) / ' + (It / 1000).toFixed(3) + ' = ' + Rc.toFixed(0) + ' Ω', AMBER, 'middle', 12.5, true);
    var lo = 0, span = 1000; /* échelle log pour la barre E12 */
    ln(dyn, 20, 130, 350, 130, '#2a4660', 2);
    SERIE.filter(function (r) { return r <= 10000; }).forEach(function (r) {
      var x = 20 + 330 * (Math.log10(r) - 1) / 3; var on = r === Rn, bw = Rc <= r;
      ln(dyn, x, 130 - (on ? 22 : 8), x, 130, on ? GREEN : (bw ? BLUE : '#37536b'), on ? 3 : 1.6);
    });
    var xc = 20 + 330 * (Math.log10(Math.max(Rc, 10)) - 1) / 3; ln(dyn, xc, 94, xc, 134, AMBER, 2, '3 3'); txt(dyn, xc, 90, 'calculée', AMBER, 'middle', 9);
    var xn = 20 + 330 * (Math.log10(Rn) - 1) / 3; txt(dyn, xn, 152, 'choisie ' + fmtR(Rn), GREEN, 'middle', 10, true);
    txt(dyn, 20, 172, '10 Ω', '#7e9bb2', 'start', 9); txt(dyn, 350, 172, '10 kΩ', '#7e9bb2', 'end', 9); txt(dyn, 185, 172, 'série E12 (échelle logarithmique)', '#7e9bb2', 'middle', 9);
    chips.set(ui.chip('R calculée ' + Rc.toFixed(0) + ' Ω', AMBER) + ui.chip('E12 : ' + fmtR(Rn), GREEN) + ui.chip('I réel ' + Ir.toFixed(1) + ' mA', BLUE));
    info.set('Valeur E12 <b>juste au-dessus</b> : le courant réel est un peu plus faible.');
  }
  paint();
}

function buzzerCircuit(el) {
  var svg = ui.stage(el, 370, 220, 'Circuit avec interrupteur et buzzer'), dyn = S('g', null, svg);
  var info = ui.info(el), verd = ui.verdict(el), closed = false, t = 0;
  var ctl = ui.controls(el), b = ui.btn(ctl, 'Fermer l’interrupteur', function () { closed = !closed; b.textContent = closed ? 'Ouvrir l’interrupteur' : 'Fermer l’interrupteur'; paint(); });
  var P = [[170, 170], [30, 170], [30, 70], [146, 70], [194, 70], [246, 70], [294, 70], [340, 70], [340, 170], [210, 170]];
  function paint() {
    verd.set(closed ? 'Fermé : le buzzer sonne.' : 'Ouvert : silence.', closed ? 'ok' : '');
    info.set(closed ? 'L’énergie électrique devient du <b>son</b>.' : 'Boucle coupée : pas de courant.');
  }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); t += dt;
    wire(dyn, P.slice(0, 4), WIRE, 2); wire(dyn, P.slice(4), WIRE, 2); ln(dyn, 194, 70, 246, 70, WIRE, 2);
    sBat(dyn, 190, 170, '6 V', 40); sSwitch(dyn, 170, 70, closed, 'interrupteur', 48); sBuzzer(dyn, 270, 70, closed, t, 'buzzer', 48);
    if (closed) flow(dyn, P, (t * .35) % 1, 8, AMBER, 2.6);
  });
  paint();
}

PC.chapter({ id: 't2-5', lazy: true, eyebrow: EY2 + 'Module 2 · Fonctions techniques', title: 'La fonction « Signalisation »', ar: 'وظيفة الإشارة',
  lessons: function () { return [
    { short: 'LED', title: 'La LED et sa résistance', intro: 'Allume la LED sans la détruire.', build: ledCircuit,
      retenir: ['La LED laisse passer le courant dans un seul sens.', 'Résistance de protection en série : <b>I = (E − ULED) / R</b>.'],
      ar: { e: ['نضع مقاومة حماية مع الصمام الضوئي: I = (E − ULED) / R.'], u: 'غيّر التوتر والمقاومة.', w: [['LED', 'صمام ضوئي'], ['résistance', 'مقاومة']] } },
    { short: 'Calcul de R', title: 'Calculer R', intro: 'Calcule R, puis choisis dans la série E12.', build: calculR,
      retenir: ['<b>R = (E − ULED) / I</b>, avec ULED ≈ 2 V.', 'On prend la valeur E12 juste au-dessus.'],
      ar: { e: ['R = (E − ULED) / I ثم نختار أقرب قيمة معيارية أكبر منها.'], u: 'حرّك المنزلقين.', w: [['série E12', 'سلسلة E12']] } },
    { short: 'Buzzer', title: 'Le buzzer', intro: 'Ferme l’interrupteur.', build: buzzerCircuit,
      retenir: ['Signalisation <b>lumineuse</b> (LED) ou <b>sonore</b> (buzzer).', 'Le courant circule si la boucle est <b>fermée</b>.'],
      ar: { e: ['الإشارة ضوئية أو صوتية، ولا يمرّ التيار إلا في دارة مغلقة.'], u: 'أغلق القاطع.', w: [['buzzer', 'صفارة'], ['circuit fermé', 'دارة مغلقة']] } }
  ]; },
  quiz: [
    { q: 'Pourquoi place-t-on une résistance en série avec une LED ?', o: ['pour limiter le courant', 'pour faire de la lumière', 'pour changer la couleur'], a: 0, e: 'Sans elle, le courant détruit la LED.' },
    { q: 'E = 9 V, ULED = 2 V, I = 14 mA. R vaut :', o: ['500 Ω', '63 Ω', '1 kΩ'], a: 0, e: 'R = 7 / 0,014 = 500 Ω ; on prendrait 560 Ω en E12.' },
    { q: 'La valeur E12 à choisir pour 500 Ω calculés :', o: ['560 Ω', '470 Ω', '330 Ω'], a: 0, e: 'Valeur normalisée immédiatement supérieure.' },
    { q: 'Un buzzer est un moyen de signalisation :', o: ['sonore', 'lumineuse', 'mécanique'], a: 0, e: 'Il convertit l’énergie électrique en son.' }
  ]
});

