/* ===================================================== 3AC · NOUVELLES LEÇONS : modules 1 et 2 (systèmes et chaîne d'information) */
var BAR_STATE = { car: -60, arm: 0, mot: 0 };
function barriereAuto(el) {
  var S0 = BAR_STATE; S0.car = -60; S0.arm = 0; S0.mot = 0;
  var BOX = [['Acquérir', 0], ['Traiter', 0], ['Distribuer', 1], ['Convertir', 1], ['Transmettre', 1], ['Agir', 1]];
  narrated(el, 400, 240, 'Barrière automatique : de la détection à l’action', [
    { t: 'Acquérir', d: 'Le capteur détecte la voiture devant la barrière.' },
    { t: 'Traiter', d: 'L’unité de commande décide d’ouvrir.' },
    { t: 'Distribuer', d: 'Le relais envoie l’énergie vers le moteur.' },
    { t: 'Convertir', d: 'Le moteur transforme l’énergie électrique en rotation.' },
    { t: 'Transmettre', d: 'Le réducteur ralentit la rotation et augmente la force.' },
    { t: 'Agir', d: 'La barrière se lève : la voiture passe.' }
  ], function (g, k, t, dt) {
    var tgtCar = k < 5 ? 112 : 360, tgtArm = k >= 4 ? (k === 4 ? 40 : 82) : 0, e = Math.min(1, dt * (k === 5 ? 1.8 : 2.5));
    if (k === 0 && S0.car > 200) { S0.car = -60; S0.arm = 0; }
    if (k === 0 && S0.car < 112) tgtCar = 112;
    S0.car += (tgtCar - S0.car) * Math.min(1, dt * (k === 5 ? 1.2 : 2)); S0.arm += (tgtArm - S0.arm) * e; if (k >= 3) S0.mot += dt * (k === 3 ? 6 : 9);
    BOX.forEach(function (b, i) {
      var x = 8 + i * 64, on = i === k, c = b[1] ? AMBER : BLUE;
      S('rect', { x: x, y: 40, width: 58, height: 30, rx: 4, style: 'fill:' + c + ';fill-opacity:' + (on ? .3 : .06) + ';stroke:' + c + ';stroke-width:' + (on ? 3 : 1.4) }, g);
      txt(g, x + 29, 59, b[0], '#fff', 'middle', 8.5, on); if (i < 5) arrow(g, x + 59, 55, x + 63, 55, 'rgba(255,255,255,.4)', 1.2);
    });
    txt(g, 8, 84, 'chaîne d’information', BLUE, 'start', 8.5); txt(g, 392, 84, 'chaîne d’énergie', AMBER, 'end', 8.5);
    ln(g, 0, 198, 400, 198, '#37536b', 2); for (var m = 0; m < 400; m += 40) ln(g, m, 198, m + 20, 198, '#1d3448', 4);
    S('rect', { x: 240, y: 150, width: 28, height: 48, style: 'fill:#0d1620;stroke:' + WIRE + ';stroke-width:2' }, g);
    var cx = 254, cy = 160, L = 104, a = S0.arm * Math.PI / 180, ex = cx - L * Math.cos(a), ey = cy - L * Math.sin(a);
    ln(g, cx, cy, ex, ey, '#e8f1f8', 7); ln(g, cx, cy, ex, ey, RED, 7, '10 12'); circ(g, cx, cy, 6, WIRE, 1, 0);
    var car = S0.car; S('rect', { x: car, y: 170, width: 54, height: 20, rx: 5, style: 'fill:' + BLUE + ';fill-opacity:.45;stroke:' + BLUE + ';stroke-width:2' }, g); S('rect', { x: car + 14, y: 160, width: 28, height: 12, rx: 3, style: 'fill:' + BLUE + ';fill-opacity:.3;stroke:' + BLUE + ';stroke-width:2' }, g);
    [car + 12, car + 42].forEach(function (x) { circ(g, x, 192, 6, WIRE, .8, 1.5); });
    ln(g, 172, 150, 172, 198, WIRE, 3); S('rect', { x: 166, y: 146, width: 12, height: 12, style: 'fill:' + (k === 0 ? AMBER : WIRE) }, g);
    if (k === 0) { ln(g, 172, 152, 110, 152, AMBER, 1.5, '4 3'); txt(g, 172, 138, 'capteur', AMBER, 'middle', 9); }
    if (k >= 3) { circ(g, 254, 182, 11, AMBER, .15, 1.6); for (var q = 0; q < 3; q++) { var b = S0.mot + q * 2.094; ln(g, 254 + Math.cos(b) * 3, 182 + Math.sin(b) * 3, 254 + Math.cos(b) * 10, 182 + Math.sin(b) * 10, AMBER, 2); } }
    if (k === 1) txt(g, 254, 142, 'unité de commande', BLUE, 'middle', 8.5); if (k === 2) txt(g, 254, 142, 'relais', AMBER, 'middle', 9);
    if (k === 4) txt(g, 300, 182, '÷ réducteur', AMBER, 'start', 9);
  });
}

function oscilloscope(el) {
  var svg = ui.stage(el, 400, 240, 'Signal analogique et signal logique'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el);
  var seuil = 25, t = 0;
  ui.slider(el, { label: 'Seuil du détecteur', min: 15, max: 35, value: 25, step: 1, color: RED, fmt: function (v) { return v + ' °C'; } }, function (v) { seuil = v; });
  info.set('Le <b>capteur</b> suit la température. Le <b>détecteur</b> compare au seuil : 0 ou 1.');
  function f(x) { return 24 + 9 * Math.sin(x / 38) + 2.5 * Math.sin(x / 11 + 1); }
  PC.anim(svg, function (dt) {
    t += dt * 40; dyn.replaceChildren();
    S('rect', { x: 20, y: 10, width: 360, height: 220, rx: 8, style: 'fill:#04080c;stroke:#2a4660;stroke-width:2' }, dyn);
    for (var i = 1; i < 9; i++) ln(dyn, 20 + i * 45, 10, 20 + i * 45, 230, '#10222f', 1); for (var j = 1; j < 6; j++) ln(dyn, 20, 10 + j * 37, 380, 10 + j * 37, '#10222f', 1);
    var Y = function (T) { return 120 - (T - 14) * 4.6; }, pts = [], dg = [];
    for (var x = 0; x <= 360; x += 3) { var T = f(x + t); pts.push([20 + x, Y(T)]); dg.push([20 + x, T > seuil ? 150 : 205]); }
    ln(dyn, 20, Y(seuil), 380, Y(seuil), RED, 1.6, '5 4'); txt(dyn, 376, Y(seuil) - 4, 'seuil ' + seuil + ' °C', RED, 'end', 9.5);
    txt(dyn, 26, 24, 'capteur : signal analogique (°C)', AMBER, 'start', 9.5); wire(dyn, pts, AMBER, 2.4);
    var sq = [], prev = null; dg.forEach(function (p) { if (prev !== null && prev !== p[1]) sq.push([p[0], prev]); sq.push(p); prev = p[1]; }); wire(dyn, sq, BLUE, 2.6);
    txt(dyn, 26, 142, 'détecteur : signal logique', BLUE, 'start', 9.5); txt(dyn, 376, 154, '1', BLUE, 'end', 10, true); txt(dyn, 376, 209, '0', BLUE, 'end', 10, true);
    var Tn = f(t + 360); circ(dyn, 380, Y(Tn), 4, AMBER, 1, 0);
    chips.set(ui.chip('T = ' + Tn.toFixed(1) + ' °C', AMBER) + ui.chip('détecteur : ' + (Tn > seuil ? '1' : '0'), BLUE));
  });
}

function chronogramme(el) {
  var svg = ui.stage(el, 400, 250, 'Programme Arduino et chronogramme'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el);
  var D = 500, t = 0;
  ui.slider(el, { label: 'delay(…) en ms', min: 100, max: 1000, value: 500, step: 50, color: AMBER, fmt: function (v) { return v + ' ms'; } }, function (v) { D = v; calc(); });
  function calc() { chips.set(ui.chip('période = ' + 2 * D + ' ms', AMBER) + ui.chip('fréquence = ' + (1000 / (2 * D)).toFixed(2) + ' Hz', BLUE)); info.set('La LED est <b>HIGH</b> pendant delay, puis <b>LOW</b> pendant delay.'); }
  var CODE = ['void loop() {', '  digitalWrite(13, HIGH);', '  delay(' + 'D' + ');', '  digitalWrite(13, LOW);', '  delay(' + 'D' + ');', '}'];
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var ph = (t * 1000) % (2 * D), hi = ph < D;
    rect(dyn, 10, 10, 190, 100, BLUE, .05, 4, 1.4);
    CODE.forEach(function (l, i) { var on = (hi && i === 2) || (!hi && i === 4); if (on) S('rect', { x: 12, y: 20 + i * 15, width: 186, height: 15, style: 'fill:' + AMBER + ';fill-opacity:.28' }, dyn); txt(dyn, 18, 32 + i * 15, l.replace('D', D), on ? '#fff' : '#9fb8cc', 'start', 10.5, on); });
    sLed(dyn, 290, 60, hi ? 1 : 0, 'LED pin 13', RED, 50); txt(dyn, 290, 100, hi ? 'HIGH · 5 V' : 'LOW · 0 V', hi ? AMBER : '#7e9bb2', 'middle', 11, true);
    ln(dyn, 20, 205, 385, 205, WIRE, 1.6); ln(dyn, 20, 205, 20, 130, WIRE, 1.6); txt(dyn, 24, 138, '5 V', '#7e9bb2', 'start', 9); txt(dyn, 24, 202, '0', '#7e9bb2', 'start', 9);
    var W = 360, win = 4000, pts = [], last = null;
    for (var x = 0; x <= W; x += 2) { var tm = (t * 1000 - (W - x) / W * win), h = ((tm % (2 * D)) + 2 * D) % (2 * D) < D, y = h ? 140 : 200; if (last !== null && last !== y) pts.push([20 + x, last]); pts.push([20 + x, y]); last = y; }
    wire(dyn, pts, hi ? AMBER : BLUE, 2.6); ln(dyn, 380, 120, 380, 215, AMBER, 1.5, '3 3'); txt(dyn, 200, 232, 'temps (fenêtre de 4 s)', '#7e9bb2', 'middle', 9.5);
  });
  calc();
}

function propagationMessage(el) {
  var svg = ui.stage(el, 400, 220, 'Transmission d’une information'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el);
  var key = 'fil', dist = 5, wall = false, t = 0, ctl = ui.controls(el);
  ui.tabs(el, [['fil', 'Câblée'], ['ir', 'Infrarouge'], ['radio', 'Radio']], function (k) { key = k; paint(); });
  ui.slider(el, { label: 'Distance', min: 1, max: 30, value: 5, step: 1, color: AMBER, fmt: function (v) { return v + ' m'; } }, function (v) { dist = v; paint(); });
  ui.btn(ctl, 'Ajouter / retirer un mur', function () { wall = !wall; paint(); });
  var D = { fil: 'Fiable et insensible aux obstacles, mais on ne peut pas se déplacer.', ir: 'Demande une vue directe et porte peu (télécommande).', radio: 'Traverse les murs ; le signal faiblit avec la distance (Bluetooth, Wi-Fi).' };
  function strength() { if (key === 'fil') return 100; if (key === 'ir') return wall || dist > 8 ? 0 : Math.max(20, 100 - dist * 8); var s = 100 - dist * 3 - (wall ? 35 : 0); return Math.max(0, s); }
  function paint() { var s = strength(); chips.set(ui.chip('signal ' + Math.round(s) + ' %', s >= 30 ? GREEN : RED) + ui.chip(s >= 30 ? 'message reçu' : 'message perdu', s >= 30 ? GREEN : RED)); info.set(D[key]); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var s = strength(), X1 = 60, X2 = 340, y = 100;
    block(dyn, 10, 70, 56, 60, 'Émetteur', BLUE, 10); block(dyn, 334, 70, 56, 60, 'Récepteur', AMBER, 10);
    if (key === 'fil') { wire(dyn, [[66, y], [334, y]], WIRE, 3); }
    else if (key === 'ir') { S('path', { d: 'M66 ' + y + 'L334 ' + (y - 24) + 'L334 ' + (y + 24) + 'Z', style: 'fill:' + RED + ';fill-opacity:' + (wall ? .04 : .1) + ';stroke:' + RED + ';stroke-width:1;stroke-dasharray:4 3' }, dyn); }
    else { for (var r = 1; r <= 4; r++) { var q = ((t * .5 + r / 4) % 1); S('path', { d: 'M' + (66 + q * 150) + ' ' + (y - 30 * q - 6) + 'Q' + (90 + q * 150) + ' ' + y + ' ' + (66 + q * 150) + ' ' + (y + 30 * q + 6), style: 'fill:none;stroke:' + BLUE + ';stroke-width:2;opacity:' + (1 - q) * Math.max(.2, s / 100) }, dyn); } }
    if (wall) { S('rect', { x: 190, y: 30, width: 16, height: 140, style: 'fill:#37536b;stroke:#7e9bb2;stroke-width:2' }, dyn); txt(dyn, 198, 186, 'mur', '#9fb8cc', 'middle', 10); }
    for (var i = 0; i < 4; i++) { var u = (t * .6 + i / 4) % 1, px = X1 + 8 + u * 266; var pass = wall && key === 'ir' ? px < 190 : true; if (key === 'radio' && wall && px > 198 && (i % 2)) pass = false; if (pass && s > 0) S('rect', { x: px - 5, y: y - 5, width: 10, height: 10, rx: 2, style: 'fill:' + AMBER + ';opacity:' + Math.max(.3, s / 100) }, dyn); }
    for (var b = 0; b < 5; b++) S('rect', { x: 345 + b * 8, y: 150 - b * 5, width: 6, height: 8 + b * 5, style: 'fill:' + (s >= (b + 1) * 20 - 10 ? GREEN : '#1d3448') }, dyn);
  });
  paint();
}
