/* ===================================================== 3AC · MODULE 3 · CHAÎNE D'ÉNERGIE */
function perceuseChaine(el) {
  var P5 = [['Alimenter', 'Batterie 18 V'], ['Distribuer', 'Interrupteur'], ['Convertir', 'Moteur'], ['Transmettre', 'Réducteur'], ['Agir', 'Foret']];
  narrated(el, 400, 220, 'Chaîne d’énergie d’une perceuse', [
    { t: 'Alimenter', d: 'La batterie stocke l’énergie électrique.' },
    { t: 'Distribuer', d: 'La gâchette dose l’énergie envoyée au moteur.' },
    { t: 'Convertir', d: 'Le moteur transforme l’énergie électrique en mouvement de rotation.' },
    { t: 'Transmettre', d: 'Le réducteur à engrenages baisse la vitesse et augmente la force.' },
    { t: 'Agir', d: 'Le foret tourne et perce le matériau.' }
  ], function (g, k, t, dt) {
    var X = [40, 120, 200, 280, 360], i;
    for (i = 0; i < 5; i++) {
      var on = i <= k, c = i === k ? AMBER : (on ? GREEN : '#37536b');
      if (i < 4) { ln(g, X[i] + 24, 70, X[i + 1] - 24, 70, i < k ? AMBER : '#2a4660', 2.4); if (i < k) { var u = (t * .8 + i * .2) % 1; circ(g, X[i] + 24 + u * (X[i + 1] - X[i] - 48), 70, 3, AMBER, 1, 0); } }
      S('rect', { x: X[i] - 28, y: 46, width: 56, height: 48, rx: 6, style: 'fill:' + c + ';fill-opacity:' + (i === k ? .25 : .07) + ';stroke:' + c + ';stroke-width:' + (i === k ? 3 : 1.6) }, g);
      txt(g, X[i], 66, P5[i][0], i === k ? '#fff' : '#9fb8cc', 'middle', 8.5, i === k); txt(g, X[i], 82, P5[i][1], on ? '#fff' : '#7e9bb2', 'middle', 8);
    }
    var by = 150;
    S('rect', { x: 20, y: by - 14, width: 40, height: 28, rx: 3, style: 'fill:' + (k >= 0 ? GREEN : WIRE) + ';fill-opacity:.25;stroke:' + GREEN + ';stroke-width:2' }, g); txt(g, 40, by + 4, '18 V', '#fff', 'middle', 10, true);
    ln(g, 60, by, 90, by, k >= 1 ? AMBER : '#2a4660', 3); S('rect', { x: 90, y: by - 8, width: 20, height: 16, style: 'fill:none;stroke:' + (k >= 1 ? AMBER : WIRE) + ';stroke-width:2' }, g);
    ln(g, 110, by, 140, by, k >= 2 ? AMBER : '#2a4660', 3); circ(g, 160, by, 18, k >= 2 ? AMBER : WIRE, .12, 2.4);
    for (var j = 0; j < 3; j++) { var a = (k >= 2 ? t * 12 : 0) + j * 2.094; ln(g, 160 + Math.cos(a) * 4, by + Math.sin(a) * 4, 160 + Math.cos(a) * 15, by + Math.sin(a) * 15, k >= 2 ? AMBER : WIRE, 2.4); }
    gear(g, 210, by, 10, 8, k >= 3 ? t * 6 : 0, k >= 3 ? BLUE : WIRE, 2); gear(g, 238, by, 18, 14, k >= 3 ? -t * 6 * 8 / 14 : 0, k >= 3 ? BLUE : WIRE, 3);
    ln(g, 256, by, 300, by, k >= 3 ? AMBER : '#2a4660', 3);
    var fx = 300, ro = k >= 4 ? t * 9 : 0; ln(g, fx, by, fx + 70, by, k >= 4 ? AMBER : WIRE, 5);
    for (var q = 0; q < 6; q++) { var xx = fx + 22 + q * 8; var off = Math.sin(ro + q * 1.3) * 3; ln(g, xx, by + off, xx + 6, by - off, k >= 4 ? AMBER : WIRE, 1.6); }
    S('rect', { x: 380, y: by - 30, width: 14, height: 60, style: 'fill:#37536b;stroke:#7e9bb2;stroke-width:2' }, g);
    txt(g, 40, by + 32, 'énergie électrique', GREEN, 'middle', 8.5); txt(g, 160, by + 32, 'rotation rapide', AMBER, 'middle', 8.5); txt(g, 330, by + 32, 'rotation lente, forte', AMBER, 'middle', 8.5);
    txt(g, 200, 200, k === 4 ? 'la chaîne d’énergie est complète' : 'chaque étape transmet l’énergie à la suivante', k === 4 ? GREEN : '#7e9bb2', 'middle', 10, k === 4);
  });
}
function packPiles(el) {
  var svg = ui.stage(el, 400, 230, 'Associer des piles : tension et capacité'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), ns = 2, np = 1, t = 0;
  ui.slider(el, { label: 'Piles en série', min: 1, max: 5, value: 2, step: 1, color: AMBER, fmt: function (v) { return v + ''; } }, function (v) { ns = v; paint(); });
  ui.slider(el, { label: 'Branches en parallèle', min: 1, max: 4, value: 1, step: 1, color: BLUE, fmt: function (v) { return v + ''; } }, function (v) { np = v; paint(); });
  function V() { return ns * 1.5; } function Ah() { return np * 2000; }
  function paint() { var ok = V() === 6, hi = V() > 6; chips.set(ui.chip(fm(V(), 1) + ' V', ok ? GREEN : RED) + ui.chip(Ah() + ' mAh', BLUE) + ui.chip('autonomie ≈ ' + fm(Ah() / 400, 0) + ' h', AMBER)); info.set('Le moteur demande <b>6 V</b> et <b>400 mA</b>. Série : les tensions s’<b>additionnent</b>. Parallèle : les capacités s’<b>additionnent</b>. ' + (ok ? '<b>Tension correcte.</b>' : (hi ? '<b>Trop de tension : danger.</b>' : '<b>Tension trop faible.</b>'))); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var x0 = 40, w = 52, gx = 58, rows = np, ystep = 44, y0 = 30, i, r;
    for (r = 0; r < rows; r++) {
      var y = y0 + r * ystep; ln(dyn, x0 - 12, y + 14, x0, y + 14, WIRE, 2.4);
      for (i = 0; i < ns; i++) { var x = x0 + i * gx; S('rect', { x: x, y: y, width: w, height: 28, rx: 3, style: 'fill:' + GREEN + ';fill-opacity:.18;stroke:' + GREEN + ';stroke-width:2' }, dyn); S('rect', { x: x + w, y: y + 9, width: 5, height: 10, style: 'fill:' + GREEN }, dyn); txt(dyn, x + 24, y + 18, '1,5 V', '#fff', 'middle', 9); if (i < ns - 1) ln(dyn, x + w + 5, y + 14, x + gx, y + 14, WIRE, 2.4); }
      ln(dyn, x0 + (ns - 1) * gx + w + 5, y + 14, x0 + ns * gx + 6, y + 14, WIRE, 2.4);
    }
    var xr = x0 + ns * gx + 6; ln(dyn, x0 - 12, y0 + 14, x0 - 12, y0 + (rows - 1) * ystep + 14, WIRE, 2.4); ln(dyn, xr, y0 + 14, xr, y0 + (rows - 1) * ystep + 14, WIRE, 2.4);
    var ym = y0 + ((rows - 1) * ystep) / 2 + 14, ok = V() === 6, hi = V() > 6, ang = t * (ok ? 12 : (hi ? 24 : V() * 2));
    ln(dyn, xr, ym, 350, ym, WIRE, 2.4); ln(dyn, x0 - 12, ym, x0 - 12, 214, WIRE, 2.4); ln(dyn, x0 - 12, 214, 350, 214, WIRE, 2.4); ln(dyn, 350, ym + 16, 350, 214, WIRE, 2.4);
    circ(dyn, 350, ym, 16, ok ? GREEN : (hi ? RED : AMBER), .15, 2.4); for (var j = 0; j < 3; j++) { var a = ang + j * 2.094; ln(dyn, 350 + Math.cos(a) * 4, ym + Math.sin(a) * 4, 350 + Math.cos(a) * 14, ym + Math.sin(a) * 14, ok ? GREEN : (hi ? RED : AMBER), 2.4); }
    txt(dyn, 350, ym - 24, 'moteur 6 V', '#9fb8cc', 'middle', 9);
    txt(dyn, 200, 224, ok ? 'tension correcte' : (hi ? 'surtension' : 'trop faible'), ok ? GREEN : (hi ? RED : AMBER), 'middle', 10, true);
  }); paint();
}
function chargeur(el) {
  var STG = [['Secteur', '220 V alternatif', 60, 0], ['Transformateur', 'tension réduite', 22, 0], ['Redresseur', 'une seule polarité', 22, 1], ['Filtre', 'courant presque continu', 22, 2]];
  narrated(el, 400, 240, 'Chargeur : du secteur au courant continu', [
    { t: 'Secteur', d: 'La prise donne 220 V alternatif, 50 Hz.' },
    { t: 'Transformateur', d: 'Il abaisse la tension, toujours alternative.' },
    { t: 'Redresseur', d: 'Les diodes ne laissent passer qu’un sens.' },
    { t: 'Filtre', d: 'Un condensateur lisse : le courant devient presque continu.' }
  ], function (g, k, t, dt) {
    var S0 = STG[k], i; for (i = 0; i < 4; i++) { var c = i === k ? AMBER : (i < k ? GREEN : '#37536b'); S('rect', { x: 8 + i * 98, y: 14, width: 92, height: 34, rx: 4, style: 'fill:' + c + ';fill-opacity:' + (i === k ? .25 : .06) + ';stroke:' + c + ';stroke-width:' + (i === k ? 2.6 : 1.4) }, g); txt(g, 54 + i * 98, 35, STG[i][0], i === k ? '#fff' : '#9fb8cc', 'middle', 9, i === k); }
    ln(g, 20, 190, 380, 190, '#2a4660', 1.4); ln(g, 20, 80, 20, 200, '#2a4660', 1.4); txt(g, 28, 76, 'tension', '#7e9bb2', 'start', 8.5); txt(g, 376, 204, 'temps', '#7e9bb2', 'end', 8.5);
    var pts = [], v = 0, A = S0[2], mode = S0[3], x;
    for (x = 0; x <= 350; x += 2) { var s = Math.sin((x - t * 90) / 22), y;
      if (mode === 0) y = 135 - A * s; else if (mode === 1) y = 190 - A * 1.6 * Math.abs(s);
      else { var ab = Math.abs(s); v = Math.max(ab, v * .93); y = 190 - A * 1.6 * v; }
      pts.push([26 + x, y]); }
    if (k < 2) ln(g, 20, 135, 380, 135, '#37536b', 1, '4 4'); wire(g, pts, AMBER, 2.6);
    txt(g, 200, 226, S0[1], k === 3 ? GREEN : AMBER, 'middle', 11, true);
  });
}
function sourcesContinu(el) {
  var d = function (n, s) { return function (g) { rect(g, 30, 28, 340, 80, GREEN, .08, 4, 1.8); txt(g, 200, 62, n, '#fff', 'middle', 15, true); txt(g, 200, 90, s, '#9fb8cc', 'middle', 11); }; };
  classify(el, 'Courant continu ou alternatif ?', [
    { name: 'Pile 1,5 V', cat: 0, why: 'La polarité ne change jamais.', draw: d('Pile 1,5 V', 'sens fixe') },
    { name: 'Batterie de téléphone', cat: 0, why: 'Elle délivre du courant continu.', draw: d('Batterie de téléphone', 'sens fixe') },
    { name: 'Panneau photovoltaïque', cat: 0, why: 'Il produit du continu (l’onduleur le convertit si besoin).', draw: d('Panneau photovoltaïque', 'sens fixe') },
    { name: 'Prise du mur au Maroc (220 V, 50 Hz)', cat: 1, why: 'Le sens s’inverse 100 fois par seconde.', draw: d('Prise murale · 220 V · 50 Hz', 'sens qui s’inverse') },
    { name: 'Groupe électrogène', cat: 1, why: 'Son alternateur produit de l’alternatif.', draw: d('Groupe électrogène', 'alternateur') },
    { name: 'Sortie USB 5 V d’un chargeur', cat: 0, why: 'Après redressement et filtrage : continu.', draw: d('Sortie USB 5 V', 'redressé et filtré') }
  ], ['Continu', 'Alternatif'], 'Le sens du courant change-t-il ?');
}
PC.chapter({ id: 't3-5', lazy: true, eyebrow: EY + 'Module 3 · Chaîne d’énergie', title: 'Alimenter', ar: 'التغذية بالطاقة',
  lessons: function () { return [
    { short: 'La chaîne', title: 'La chaîne d’énergie d’une perceuse', intro: 'Alimenter, distribuer, convertir, transmettre, agir.', build: perceuseChaine,
      retenir: ['Cinq fonctions : <b>alimenter, distribuer, convertir, transmettre, agir</b>.', 'L’énergie passe d’une fonction à la suivante.'],
      ar: { e: ['سلسلة الطاقة خمس وظائف: تغذية، توزيع، تحويل، نقل، فعل.'], u: 'تابع المراحل.', w: [['chaîne d’énergie', 'سلسلة الطاقة'], ['alimenter', 'تغذية']] } },
    { short: 'Associer des piles', title: 'Série et parallèle', intro: 'Trouve l’association qui donne 6 V.', build: packPiles,
      retenir: ['<b>Série</b> : les tensions s’additionnent.', '<b>Parallèle</b> : les capacités s’additionnent, la tension reste la même.', 'Autonomie ≈ capacité ÷ courant.'],
      ar: { e: ['على التوالي تجتمع التوترات، وعلى التوازي تجتمع السعات ويبقى التوتر ثابتا.'], u: 'غيّر الترتيب.', w: [['en série', 'على التوالي'], ['en parallèle', 'على التوازي'], ['capacité', 'سعة']] } },
    { short: 'Chargeur', title: 'Du secteur au continu', intro: 'Quatre étapes pour alimenter un appareil électronique.', build: chargeur,
      retenir: ['<b>Transformateur</b> : abaisse la tension.', '<b>Redresseur</b> : un seul sens.', '<b>Filtre</b> : lisse le signal.'],
      ar: { e: ['المحوّل يخفض التوتر، والمقوّم يجعل الاتجاه واحدا، والمرشّح يملّس الإشارة.'], u: 'تنقّل بين المراحل.', w: [['transformateur', 'محوّل'], ['redresseur', 'مقوّم']] } },
    { short: 'Continu / alternatif', title: 'Les sources', intro: 'Quel type de courant produit chaque source ?', build: sourcesContinu,
      retenir: ['Piles, batteries, panneaux : <b>continu</b>.', 'Secteur (220 V, 50 Hz) : <b>alternatif</b>.'],
      ar: { e: ['البطاريات والألواح الشمسية تعطي تيارا مستمرا، أما الكهرباء المنزلية فمتناوبة.'], u: 'صنّف.', w: [['courant continu', 'تيار مستمر'], ['courant alternatif', 'تيار متناوب']] } }
  ]; },
  quiz: [
    { q: 'Quatre piles de 1,5 V en série donnent :', o: ['6 V', '1,5 V', '3 V'], a: 0, e: '4 × 1,5 = 6 V.' },
    { q: 'Deux piles de 2000 mAh en parallèle donnent :', o: ['4000 mAh', '2000 mAh', '1000 mAh'], a: 0, e: 'Les capacités s’additionnent.' },
    { q: 'Un moteur de 400 mA et une batterie de 2000 mAh : l’autonomie est de :', o: ['5 h', '2 h', '20 h'], a: 0, e: '2000 ÷ 400 = 5.' },
    { q: 'Le secteur est :', o: ['alternatif', 'continu', 'nul'], a: 0, e: '220 V, 50 Hz.' }
  ]
});

/* ---------- Distribuer ---------- */
function limitePuissance(el) {
  var svg = ui.stage(el, 400, 240, 'Commande et puissance : pourquoi un pré-actionneur ?'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), t = 0, I = 300, via = false;
  ui.tabs(el, [['d', 'Direct sur la broche'], ['t', 'Avec transistor']], function (k) { via = k === 't'; paint(); });
  ui.slider(el, { label: 'Courant du moteur', min: 10, max: 800, value: 300, step: 10, color: AMBER, fmt: function (v) { return v + ' mA'; } }, function (v) { I = v; paint(); });
  function pin() { return via ? I / 100 : I; }
  function paint() { var p = pin(), bad = p > 40; chips.set(ui.chip('broche : ' + fm(p, 1) + ' mA', p > 40 ? RED : (p > 20 ? AMBER : GREEN)) + ui.chip('limite ≈ 20 mA', BLUE)); info.set(via ? 'Le transistor commande un courant <b>100 fois plus grand</b> que celui de sa base. La broche ne fournit qu’un petit courant.' : 'Une broche de carte supporte environ <b>20 mA</b>. Au-delà, elle chauffe et peut être <b>détruite</b>.'); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var p = pin(), bad = p > 40, warn = p > 20;
    S('rect', { x: 14, y: 70, width: 84, height: 80, rx: 6, style: 'fill:' + (bad ? RED : BLUE) + ';fill-opacity:.12;stroke:' + (bad ? RED : BLUE) + ';stroke-width:2.4' }, dyn); txt(dyn, 56, 94, 'carte', '#fff', 'middle', 11, true); txt(dyn, 56, 108, 'programmable', '#9fb8cc', 'middle', 8.5); txt(dyn, 56, 138, 'broche 13', bad ? RED : '#9fb8cc', 'middle', 9);
    if (bad) { for (var i = 0; i < 3; i++) { var u = (t * 1.4 + i / 3) % 1; circ(dyn, 40 + i * 14, 66 - u * 28, 3 + u * 3, RED, .6 * (1 - u), 0); } txt(dyn, 56, 56, 'surchauffe !', RED, 'middle', 9.5, true); }
    var ang = t * (via || I <= 40 ? I / 40 : 0);
    if (via) {
      wire(dyn, [[98, 120], [180, 120]], BLUE, 2); flow(dyn, [[98, 120], [180, 120]], (t * .6) % 1, 2, BLUE, 2); txt(dyn, 138, 112, fm(p, 1) + ' mA', BLUE, 'middle', 9);
      S('rect', { x: 180, y: 96, width: 56, height: 48, rx: 4, style: 'fill:' + GREEN + ';fill-opacity:.15;stroke:' + GREEN + ';stroke-width:2.4' }, dyn); txt(dyn, 208, 116, 'transistor', '#fff', 'middle', 9, true); txt(dyn, 208, 130, 'pré-actionneur', '#9fb8cc', 'middle', 7.5);
      S('rect', { x: 150, y: 190, width: 90, height: 26, rx: 4, style: 'fill:' + AMBER + ';fill-opacity:.18;stroke:' + AMBER + ';stroke-width:2' }, dyn); txt(dyn, 195, 207, 'alim. 9 V', '#fff', 'middle', 9.5, true);
      var path = [[240, 202], [330, 202], [330, 160]]; wire(dyn, path, AMBER, 3.4); flow(dyn, path, (t * .5) % 1, 5, AMBER, 2.6);
      wire(dyn, [[330, 100], [330, 70], [208, 70], [208, 96]], AMBER, 2); txt(dyn, 270, 64, fm(I, 0) + ' mA', AMBER, 'middle', 9);
      circ(dyn, 330, 130, 20, GREEN, .15, 2.4); for (var j = 0; j < 3; j++) { var a = ang + j * 2.094; ln(dyn, 330 + Math.cos(a) * 4, 130 + Math.sin(a) * 4, 330 + Math.cos(a) * 17, 130 + Math.sin(a) * 17, GREEN, 2.4); }
      txt(dyn, 330, 168, 'moteur : tourne', GREEN, 'middle', 9.5, true);
    } else {
      var path2 = [[98, 120], [300, 120]]; wire(dyn, path2, bad ? RED : AMBER, bad ? 4 : 3); flow(dyn, path2, (t * (.2 + p / 400)) % 1, 4 + Math.round(p / 100), bad ? RED : AMBER, 2.6); txt(dyn, 200, 108, fm(p, 0) + ' mA', bad ? RED : AMBER, 'middle', 10, true);
      circ(dyn, 330, 120, 20, bad ? RED : AMBER, .15, 2.4); for (var q = 0; q < 3; q++) { var a2 = ang + q * 2.094; ln(dyn, 330 + Math.cos(a2) * 4, 120 + Math.sin(a2) * 4, 330 + Math.cos(a2) * 17, 120 + Math.sin(a2) * 17, bad ? RED : AMBER, 2.4); }
      txt(dyn, 330, 158, bad ? 'moteur arrêté : broche HS' : (warn ? 'trop proche de la limite' : 'moteur : tourne'), bad ? RED : (warn ? AMBER : GREEN), 'middle', 9.5, true);
    }
  }); paint();
}
var HB = { s: [0, 0, 0, 0] };
function pontEnH(el) {
  var Z = HB, svg = ui.stage(el, 400, 240, 'Pont en H : inverser le sens du moteur'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), ctl = ui.controls(el), t = 0;
  Z.s = [0, 0, 0, 0];
  function set(a) { Z.s = a; paint(); }
  ui.btn(ctl, 'Avant', function () { set([1, 0, 0, 1]); }); ui.btn(ctl, 'Arrière', function () { set([0, 1, 1, 0]); }); ui.btn(ctl, 'Arrêt', function () { set([0, 0, 0, 0]); }); ui.btn(ctl, 'Frein', function () { set([0, 0, 1, 1]); });
  ['S1', 'S2', 'S3', 'S4'].forEach(function (n, i) { ui.btn(ctl, 'Basculer ' + n, function () { Z.s[i] ^= 1; paint(); }); });
  function state() { var s = Z.s; if ((s[0] && s[2]) || (s[1] && s[3])) return 'court'; if (s[0] && s[3]) return 'av'; if (s[1] && s[2]) return 'ar'; if ((s[2] && s[3]) || (s[0] && s[1])) return 'frein'; return 'stop'; }
  var TX = { av: ['Avant', 'Le courant traverse le moteur de gauche à droite.'], ar: ['Arrière', 'Le courant traverse le moteur de droite à gauche : le sens s’inverse.'], stop: ['Arrêt', 'Aucun chemin : le moteur n’est pas alimenté.'], frein: ['Frein', 'Les bornes du moteur sont reliées entre elles : il ralentit vite.'], court: ['COURT-CIRCUIT', 'Deux interrupteurs du même côté fermés : la batterie est court-circuitée. Interdit !'] };
  function paint() { var s = state(); chips.set(ui.chip(TX[s][0], s === 'court' ? RED : (s === 'stop' ? WIRE : GREEN))); info.set(TX[s][1]); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var s = state(), L = 120, R = 280, Y1 = 40, Y2 = 200, M = 120;
    txt(dyn, 200, 24, '+ batterie', AMBER, 'middle', 10, true); ln(dyn, L, Y1, R, Y1, AMBER, 3); txt(dyn, 200, 224, '0 V', '#9fb8cc', 'middle', 10, true); ln(dyn, L, Y2, R, Y2, WIRE, 3);
    function sw(x, ya, yb, on, name, col) { var y1 = ya, y2 = yb; ln(dyn, x, y1, x, y1 + 14, on ? col : WIRE, 2.6); ln(dyn, x, y2 - 14, x, y2, on ? col : WIRE, 2.6); if (on) ln(dyn, x, y1 + 14, x, y2 - 14, col, 3.2); else ln(dyn, x, y1 + 14, x + 12, y2 - 18, WIRE, 2.6); circ(dyn, x, y1 + 14, 3, on ? col : WIRE, 1, 0); circ(dyn, x, y2 - 14, 3, on ? col : WIRE, 1, 0); txt(dyn, x - 14, (y1 + y2) / 2 + 3, name, '#fff', 'end', 10, true); }
    var cc = s === 'court' ? RED : AMBER;
    sw(L, Y1, M, Z.s[0], 'S1', cc); sw(R, Y1, M, Z.s[1], 'S2', cc); sw(L, M, Y2 - 0, Z.s[2], 'S3', cc); sw(R, M, Y2, Z.s[3], 'S4', cc);
    ln(dyn, L, M, 175, M, '#37536b', 2); ln(dyn, 225, M, R, M, '#37536b', 2);
    var ang = s === 'av' ? t * 9 : (s === 'ar' ? -t * 9 : (s === 'frein' ? t * 1 : 0)); circ(dyn, 200, M, 25, s === 'av' || s === 'ar' ? GREEN : WIRE, .12, 2.6); txt(dyn, 200, M + 4, 'M', '#fff', 'middle', 14, true);
    for (var j = 0; j < 3; j++) { var a = ang + j * 2.094; ln(dyn, 200 + Math.cos(a) * 12, M + Math.sin(a) * 12, 200 + Math.cos(a) * 22, M + Math.sin(a) * 22, GREEN, 2.4); }
    var path = null; if (s === 'av') path = [[L, Y1], [L, M], [R, M], [R, Y2]]; if (s === 'ar') path = [[R, Y1], [R, M], [L, M], [L, Y2]]; if (s === 'court') path = Z.s[0] && Z.s[2] ? [[L, Y1], [L, Y2]] : [[R, Y1], [R, Y2]];
    if (path) { wire(dyn, path, s === 'court' ? RED : AMBER, 3.6); flow(dyn, path, (t * .45) % 1, 7, s === 'court' ? RED : AMBER, 3); }
    if (s === 'court') txt(dyn, 330, 120, 'COURT-CIRCUIT', RED, 'middle', 11, true);
  }); paint();
}
function choixPreact(el) {
  var d = function (n, s) { return function (g) { rect(g, 30, 28, 340, 80, GREEN, .08, 4, 1.8); txt(g, 200, 62, n, '#fff', 'middle', 14, true); txt(g, 200, 90, s, '#9fb8cc', 'middle', 11); }; };
  classify(el, 'Quel pré-actionneur choisir ?', [
    { name: 'Allumer la lampe de jardin 220 V', cat: 0, why: 'Tension secteur : le relais isole la carte du danger.', draw: d('Lampe de jardin 220 V', 'tout ou rien') },
    { name: 'Robot qui avance et recule', cat: 2, why: 'Il faut inverser le sens du moteur : pont en H.', draw: d('Robot qui avance et recule', 'deux sens') },
    { name: 'Faire varier la vitesse d’un ventilateur 5 V', cat: 1, why: 'Un transistor commandé en PWM dose la puissance.', draw: d('Ventilateur 5 V', 'vitesse variable') },
    { name: 'Allumer une LED avec résistance', cat: 3, why: 'Le courant est petit : la broche suffit.', draw: d('LED + résistance', '10 mA') },
    { name: 'Porte coulissante : ouvrir / fermer', cat: 2, why: 'Moteur à deux sens : pont en H.', draw: d('Porte coulissante', 'ouvrir / fermer') },
    { name: 'Commander un radiateur électrique', cat: 0, why: 'Puissance forte sur le secteur : relais.', draw: d('Radiateur électrique', '220 V') }
  ], ['Relais', 'Transistor', 'Pont en H', 'Aucun'], 'Tension ? Courant ? Un ou deux sens ?');
}
PC.chapter({ id: 't3-6', lazy: true, eyebrow: EY + 'Module 3 · Chaîne d’énergie', title: 'Distribuer', ar: 'توزيع الطاقة',
  lessons: function () { return [
    { short: 'Pourquoi ?', title: 'Commande faible, puissance forte', intro: 'Augmente le courant du moteur : la broche tient-elle ?', build: limitePuissance,
      retenir: ['La carte commande de <b>petits courants</b> (≈ 20 mA par broche).', 'Le <b>pré-actionneur</b> commande la puissance à sa place.'],
      ar: { e: ['البطاقة تعطي تيارا صغيرا، فنستعمل مُسبِّقا للمنفّذ لتوزيع الطاقة الكبيرة.'], u: 'غيّر شدة التيار.', w: [['pré-actionneur', 'مسبّق المنفّذ'], ['broche', 'طرف']] } },
    { short: 'Pont en H', title: 'Inverser le sens', intro: 'Ferme deux interrupteurs en diagonale.', build: pontEnH,
      retenir: ['Le <b>pont en H</b> inverse le sens du moteur.', 'Deux interrupteurs du même côté fermés = <b>court-circuit</b>.'],
      ar: { e: ['القنطرة H تعكس اتجاه المحرك، وإغلاق مفتاحين في نفس الجهة يسبب دارة قصيرة.'], u: 'جرّب الاتجاهين.', w: [['court-circuit', 'دارة قصيرة']] } },
    { short: 'Choisir', title: 'Choisir le pré-actionneur', intro: 'Relais, transistor, pont en H ou rien ?', build: choixPreact,
      retenir: ['<b>Relais</b> : tout ou rien, secteur.', '<b>Transistor</b> : tout ou rien ou PWM.', '<b>Pont en H</b> : deux sens.'],
      ar: { e: ['المرحّل: تشغيل/إيقاف وتيار قوي، الترانزستور: تحكم أو PWM، قنطرة H: اتجاهان.'], u: 'اختر.', w: [['relais', 'مرحّل']] } }
  ]; },
  quiz: [
    { q: 'Une broche de carte supporte environ :', o: ['20 mA', '2 A', '20 A'], a: 0, e: 'Au-delà, elle chauffe.' },
    { q: 'Pour inverser le sens d’un moteur, on utilise :', o: ['un pont en H', 'une LED', 'un fusible'], a: 0, e: 'Il inverse la polarité.' },
    { q: 'Pour commander un appareil sur le secteur, on choisit :', o: ['un relais', 'une résistance', 'un condensateur'], a: 0, e: 'Le relais isole.' },
    { q: 'Dans un pont en H, S1 et S3 fermés provoquent :', o: ['un court-circuit', 'le sens avant', 'le frein'], a: 0, e: 'La batterie est court-circuitée.' }
  ]
});

/* ---------- Convertir ---------- */
function pwmLesson(el) {
  var svg = ui.stage(el, 400, 230, 'Signal PWM : régler la puissance'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), d = 50, t = 0, ang = 0;
  ui.slider(el, { label: 'Rapport cyclique', min: 0, max: 100, value: 50, step: 5, color: AMBER, fmt: function (v) { return v + ' %'; } }, function (v) { d = v; paint(); });
  function paint() { chips.set(ui.chip('moyenne = ' + fm(5 * d / 100, 2) + ' V', AMBER) + ui.chip('analogWrite(' + Math.round(255 * d / 100) + ')', BLUE)); info.set('Le signal alterne <b>5 V</b> et <b>0 V</b> très vite. Plus il reste longtemps à 5 V, plus la <b>moyenne</b> est grande : le moteur tourne vite, la LED brille fort.'); }
  PC.anim(svg, function (dt) {
    t += dt; ang += dt * (d / 100) * 14; dyn.replaceChildren(); var pts = [], per = 60, x, n = 6;
    for (var i = 0; i < n; i++) { var x0 = 20 + i * per, hi = per * d / 100; pts.push([x0, 160]); if (d > 0) { pts.push([x0, 80]); pts.push([x0 + hi, 80]); pts.push([x0 + hi, 160]); } pts.push([x0 + per, 160]); }
    ln(dyn, 20, 160, 380, 160, '#2a4660', 1); ln(dyn, 20, 80, 380, 80, '#2a4660', 1, '3 3'); txt(dyn, 16, 84, '5 V', '#9fb8cc', 'end', 8.5); txt(dyn, 16, 164, '0', '#9fb8cc', 'end', 8.5); wire(dyn, pts, BLUE, 2.6);
    var ym = 160 - 80 * d / 100; ln(dyn, 20, ym, 380, ym, AMBER, 1.8, '6 3'); txt(dyn, 378, ym - 4, 'moyenne', AMBER, 'end', 9);
    S('circle', { cx: 80, cy: 38, r: 16, style: 'fill:' + AMBER + ';fill-opacity:' + (.1 + .8 * d / 100) + ';stroke:' + AMBER + ';stroke-width:2.2' }, dyn); txt(dyn, 80, 66, 'LED', '#9fb8cc', 'middle', 9);
    circ(dyn, 320, 38, 16, BLUE, .12, 2.4); for (var j = 0; j < 3; j++) { var a = ang + j * 2.094; ln(dyn, 320 + Math.cos(a) * 4, 38 + Math.sin(a) * 4, 320 + Math.cos(a) * 14, 38 + Math.sin(a) * 14, BLUE, 2.4); } txt(dyn, 320, 66, 'moteur', '#9fb8cc', 'middle', 9);
    txt(dyn, 200, 200, 'période ≈ 2 ms (≈ 490 Hz)', '#7e9bb2', 'middle', 10);
  }); paint();
}
function servoImpulsion(el) {
  var svg = ui.stage(el, 400, 230, 'Servomoteur : la largeur d’impulsion donne l’angle'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), w = 1.5, t = 0;
  ui.slider(el, { label: 'Largeur d’impulsion', min: 1, max: 2, value: 1.5, step: .1, color: AMBER, fmt: function (v) { return fm(v, 1) + ' ms'; } }, function (v) { w = v; paint(); });
  function ang() { return (w - 1) * 180; }
  function paint() { chips.set(ui.chip('angle = ' + Math.round(ang()) + '°', AMBER) + ui.chip('période 20 ms', BLUE)); info.set('Toutes les 20 ms, la carte envoie une impulsion de <b>1 à 2 ms</b>. 1 ms → 0°, 1,5 ms → 90°, 2 ms → 180°.'); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var pts = [[20, 190]], k;
    for (k = 0; k < 3; k++) { var x0 = 30 + k * 115; pts.push([x0, 190], [x0, 140], [x0 + w * 23, 140], [x0 + w * 23, 190]); } pts.push([380, 190]); wire(dyn, pts, BLUE, 2.6); txt(dyn, 30, 206, 'impulsion ' + fm(w, 1) + ' ms', BLUE, 'start', 10); txt(dyn, 300, 206, 'tous les 20 ms', '#7e9bb2', 'middle', 9.5);
    var cx = 200, cy = 100, r = 60, a = ang(); S('path', { d: 'M' + (cx - r) + ' ' + cy + 'A' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy, style: 'fill:none;stroke:#2a4660;stroke-width:2' }, dyn);
    for (var m = 0; m <= 180; m += 45) { var am = Math.PI - m * Math.PI / 180; ln(dyn, cx + Math.cos(am) * (r - 4), cy - Math.sin(am) * (r - 4), cx + Math.cos(am) * (r + 6), cy - Math.sin(am) * (r + 6), '#37536b', 1.6); txt(dyn, cx + Math.cos(am) * (r + 18), cy - Math.sin(am) * (r + 18) + 3, m + '°', '#7e9bb2', 'middle', 8.5); }
    S('rect', { x: cx - 24, y: cy - 10, width: 48, height: 34, rx: 4, style: 'fill:' + AMBER + ';fill-opacity:.18;stroke:' + AMBER + ';stroke-width:2.2' }, dyn);
    var ar = Math.PI - a * Math.PI / 180; ln(dyn, cx, cy, cx + Math.cos(ar) * (r - 6), cy - Math.sin(ar) * (r - 6), AMBER, 5); circ(dyn, cx, cy, 6, '#fff', .9, 0);
  }); paint();
}
function rendementMoteur(el) {
  var svg = ui.stage(el, 400, 220, 'Conversion d’énergie et pertes'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), P = 30, eta = 70, t = 0;
  ui.slider(el, { label: 'Puissance électrique', min: 5, max: 50, value: 30, step: 5, color: AMBER, fmt: function (v) { return v + ' W'; } }, function (v) { P = v; paint(); });
  ui.slider(el, { label: 'Rendement', min: 30, max: 95, value: 70, step: 5, color: GREEN, fmt: function (v) { return v + ' %'; } }, function (v) { eta = v; paint(); });
  function paint() { chips.set(ui.chip('utile : ' + fm(P * eta / 100, 1) + ' W', GREEN) + ui.chip('pertes : ' + fm(P * (100 - eta) / 100, 1) + ' W', RED)); info.set('Rendement η = puissance utile ÷ puissance absorbée. Le reste est perdu en <b>chaleur</b>. Sur 1 h, le moteur perd ' + fm(P * (100 - eta) / 100, 1) + ' Wh.'); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var k = 3, hin = P * k * .55, hu = hin * eta / 100, hl = hin - hu, yc = 110;
    S('path', { d: 'M20 ' + (yc - hin / 2) + 'L150 ' + (yc - hin / 2) + 'L150 ' + (yc + hin / 2) + 'L20 ' + (yc + hin / 2) + 'Z', style: 'fill:' + AMBER + ';fill-opacity:.3;stroke:' + AMBER + ';stroke-width:1.4' }, dyn);
    S('rect', { x: 150, y: yc - 40, width: 100, height: 80, rx: 8, style: 'fill:' + BLUE + ';fill-opacity:.12;stroke:' + BLUE + ';stroke-width:2.4' }, dyn); txt(dyn, 200, yc - 4, 'moteur', '#fff', 'middle', 12, true); txt(dyn, 200, yc + 14, 'électrique → mécanique', '#9fb8cc', 'middle', 7.5);
    S('path', { d: 'M250 ' + (yc - hin / 2) + 'L380 ' + (yc - hin / 2) + 'L380 ' + (yc - hin / 2 + hu) + 'L250 ' + (yc - hin / 2 + hu) + 'Z', style: 'fill:' + GREEN + ';fill-opacity:.35;stroke:' + GREEN + ';stroke-width:1.4' }, dyn);
    S('path', { d: 'M215 ' + (yc + 40) + 'Q215 ' + (yc + 80 + hl / 2) + ' 260 ' + (yc + 90) + 'L' + (260) + ' ' + (yc + 90 + Math.max(2, hl)) + 'Q200 ' + (yc + 80) + ' ' + (215 - Math.max(2, hl)) + ' ' + (yc + 40) + 'Z', style: 'fill:' + RED + ';fill-opacity:.35;stroke:' + RED + ';stroke-width:1.4' }, dyn);
    txt(dyn, 85, yc + 4, P + ' W', '#fff', 'middle', 11, true); txt(dyn, 330, yc - hin / 2 + hu / 2 + 4, fm(P * eta / 100, 1) + ' W utiles', '#fff', 'middle', 10, true); txt(dyn, 300, yc + 98 + hl, fm(P * (100 - eta) / 100, 1) + ' W de chaleur', RED, 'start', 9.5, true);
    for (var i = 0; i < 3; i++) { var u = (t * .6 + i / 3) % 1; circ(dyn, 215 + u * 40, yc + 50 + u * 30, 2 + u * 2, RED, .7 * (1 - u), 0); }
  }); paint();
}
function sortieEnergie(el) {
  var d = function (n, s) { return function (g) { rect(g, 30, 28, 340, 80, AMBER, .08, 4, 1.8); txt(g, 200, 62, n, '#fff', 'middle', 15, true); txt(g, 200, 90, s, '#9fb8cc', 'middle', 11); }; };
  classify(el, 'Quelle énergie en sortie ?', [
    { name: 'Moteur électrique', cat: 0, why: 'Il fournit un mouvement.', draw: d('Moteur électrique', 'rotation') },
    { name: 'LED', cat: 1, why: 'Elle émet de la lumière.', draw: d('LED', 'lumière') },
    { name: 'Résistance chauffante', cat: 2, why: 'Elle produit de la chaleur.', draw: d('Résistance chauffante', 'chaleur') },
    { name: 'Buzzer', cat: 3, why: 'Il produit un son.', draw: d('Buzzer', 'son') },
    { name: 'Ventilateur', cat: 0, why: 'Ses pales tournent : mécanique.', draw: d('Ventilateur', 'rotation') },
    { name: 'Fer à repasser', cat: 2, why: 'Énergie thermique.', draw: d('Fer à repasser', 'chaleur') },
    { name: 'Haut-parleur', cat: 3, why: 'Il fait vibrer l’air : son.', draw: d('Haut-parleur', 'son') },
    { name: 'Lampe de poche', cat: 1, why: 'Énergie lumineuse.', draw: d('Lampe de poche', 'lumière') }
  ], ['Mécanique', 'Lumineuse', 'Thermique', 'Sonore'], 'Que produit l’appareil ?');
}
PC.chapter({ id: 't3-7', lazy: true, eyebrow: EY + 'Module 3 · Chaîne d’énergie', title: 'Convertir', ar: 'تحويل الطاقة',
  lessons: function () { return [
    { short: 'PWM', title: 'Régler la puissance : PWM', intro: 'Change le rapport cyclique et regarde la moyenne.', build: pwmLesson,
      retenir: ['La <b>PWM</b> alterne 5 V et 0 V très vite.', 'Le <b>rapport cyclique</b> règle la tension moyenne.'],
      ar: { e: ['تعديل عرض النبضة يغيّر التوتر المتوسط فتتغير سرعة المحرك وشدة الإضاءة.'], u: 'غيّر النسبة.', w: [['rapport cyclique', 'نسبة دورية']] } },
    { short: 'Servomoteur', title: 'Servomoteur et impulsion', intro: 'Une impulsion de 1 à 2 ms donne un angle.', build: servoImpulsion,
      retenir: ['Un <b>servomoteur</b> tourne jusqu’à un angle précis.', 'L’angle dépend de la largeur de l’impulsion.'],
      ar: { e: ['المحرك المؤازر يدور إلى زاوية محددة حسب عرض النبضة.'], u: 'حرّك المنزلق.', w: [['servomoteur', 'محرك مؤازر']] } },
    { short: 'Rendement', title: 'Rendement et pertes', intro: 'Où passe l’énergie qui n’est pas utile ?', build: rendementMoteur,
      retenir: ['η = puissance utile ÷ puissance absorbée.', 'La différence est perdue, surtout en <b>chaleur</b>.'],
      ar: { e: ['المردود هو النسبة بين القدرة المفيدة والقدرة المستهلكة، والباقي يضيع حرارة.'], u: 'غيّر المردود.', w: [['rendement', 'مردود']] } },
    { short: 'Formes d’énergie', title: 'L’énergie en sortie', intro: 'Mécanique, lumineuse, thermique ou sonore ?', build: sortieEnergie,
      retenir: ['Un convertisseur change la <b>forme</b> de l’énergie.', 'Moteur : mécanique. LED : lumineuse. Résistance : thermique.'],
      ar: { e: ['المحوّل يغيّر شكل الطاقة: ميكانيكية، ضوئية، حرارية، صوتية.'], u: 'صنّف.', w: [['énergie', 'طاقة']] } }
  ]; },
  quiz: [
    { q: 'Un rapport cyclique de 50 % donne une moyenne de (sous 5 V) :', o: ['2,5 V', '5 V', '0 V'], a: 0, e: '50 % de 5 V.' },
    { q: 'Un servomoteur reçoit une impulsion de 1,5 ms. Son angle est :', o: ['90°', '0°', '180°'], a: 0, e: '1 ms 0°, 2 ms 180°.' },
    { q: 'Un moteur absorbe 40 W et fournit 30 W. Son rendement vaut :', o: ['75 %', '25 %', '133 %'], a: 0, e: '30 ÷ 40 = 0,75.' },
    { q: 'Une résistance chauffante convertit l’énergie électrique en :', o: ['chaleur', 'son', 'mouvement'], a: 0, e: 'Énergie thermique.' }
  ]
});

/* ---------- Transmettre ---------- */
function trainEngrenages(el) {
  var svg = ui.stage(el, 400, 220, 'Train d’engrenages'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), z1 = 12, z2 = 18, z3 = 24, t = 0, N1 = 600;
  ui.slider(el, { label: 'Roue motrice z1', min: 10, max: 24, value: 12, step: 2, color: AMBER, fmt: function (v) { return v + ' dents'; } }, function (v) { z1 = v; paint(); });
  ui.slider(el, { label: 'Roue intermédiaire z2', min: 10, max: 24, value: 18, step: 2, color: GREEN, fmt: function (v) { return v + ' dents'; } }, function (v) { z2 = v; paint(); });
  ui.slider(el, { label: 'Roue de sortie z3', min: 10, max: 24, value: 24, step: 2, color: BLUE, fmt: function (v) { return v + ' dents'; } }, function (v) { z3 = v; paint(); });
  function paint() { chips.set(ui.chip('N3 = ' + Math.round(N1 * z1 / z3) + ' tr/min', BLUE) + ui.chip('rapport z1/z3 = ' + fm(z1 / z3, 2), AMBER) + ui.chip('sens : identique', GREEN)); info.set('La roue <b>intermédiaire</b> change le sens mais <b>pas</b> la vitesse. Seul compte z1 ÷ z3. ' + (z1 < z3 ? 'La sortie tourne <b>plus lentement</b>.' : (z1 > z3 ? 'La sortie tourne <b>plus vite</b>.' : 'Même vitesse.'))); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var m = 3, r1 = z1 * m / 2, r2 = z2 * m / 2, r3 = z3 * m / 2, tot = 2 * (r1 + r2 + r3), c1 = 200 - tot / 2 + r1, c2 = c1 + r1 + r2, c3 = c2 + r2 + r3, a1 = t * 1.2;
    gear(dyn, c1, 100, r1, z1, a1, AMBER, 4); gear(dyn, c2, 100, r2, z2, -a1 * z1 / z2 + Math.PI / z2, GREEN, 4); gear(dyn, c3, 100, r3, z3, a1 * z1 / z3 + Math.PI / z3 + Math.PI / z2 * 0, BLUE, 4);
    txt(dyn, c1, 190, 'z1=' + z1, AMBER, 'middle', 10, true); txt(dyn, c2, 190, 'z2=' + z2, GREEN, 'middle', 10, true); txt(dyn, c3, 190, 'z3=' + z3, BLUE, 'middle', 10, true);
    txt(dyn, c1, 24, 'entrée ' + N1 + ' tr/min', AMBER, 'middle', 9.5); txt(dyn, c3, 24, 'sortie ' + Math.round(N1 * z1 / z3), BLUE, 'middle', 9.5);
  }); paint();
}
function visEcrou(el) {
  var svg = ui.stage(el, 400, 200, 'Vis et écrou : transformer la rotation en translation'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), pas = 2, t = 0, N = 60;
  ui.slider(el, { label: 'Pas de la vis', min: 1, max: 5, value: 2, step: 1, color: AMBER, fmt: function (v) { return v + ' mm'; } }, function (v) { pas = v; paint(); });
  function paint() { chips.set(ui.chip('1 tour → ' + pas + ' mm', AMBER) + ui.chip('vitesse = ' + fm(pas * N / 60, 1) + ' mm/s à ' + N + ' tr/min', BLUE)); info.set('À chaque <b>tour</b>, l’écrou avance d’une longueur égale au <b>pas</b>. Un pas petit : mouvement lent mais précis et fort.'); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var x0 = 40, L = 300, tour = (t * N / 60), pos = (tour * pas * 4) % (L - 60);
    S('rect', { x: x0, y: 86, width: L, height: 28, rx: 3, style: 'fill:#04080c;stroke:' + WIRE + ';stroke-width:2' }, dyn);
    var sp = 10 + pas * 3; for (var x = x0 - sp; x < x0 + L + sp; x += sp) { var xx = x + ((t * N / 60 * sp) % sp); if (xx > x0 && xx < x0 + L) ln(dyn, xx, 86, xx + sp * .5, 114, WIRE, 1.4); }
    S('rect', { x: x0 + pos, y: 74, width: 40, height: 52, rx: 4, style: 'fill:' + AMBER + ';fill-opacity:.3;stroke:' + AMBER + ';stroke-width:2.4' }, dyn); txt(dyn, x0 + pos + 20, 104, 'écrou', '#fff', 'middle', 9);
    S('rect', { x: 12, y: 80, width: 26, height: 40, rx: 4, style: 'fill:' + BLUE + ';fill-opacity:.2;stroke:' + BLUE + ';stroke-width:2' }, dyn); txt(dyn, 25, 74, 'moteur', BLUE, 'middle', 8.5);
    ln(dyn, x0, 168, x0 + pos, 168, AMBER, 2); txt(dyn, x0 + pos / 2 + 2, 186, 'déplacement ≈ ' + Math.round(pos / 4) + ' mm', AMBER, 'middle', 10, true);
  }); paint();
}
function courroie(el) {
  var svg = ui.stage(el, 400, 220, 'Poulies et courroie'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), d1 = 40, d2 = 80, t = 0, N1 = 600;
  ui.slider(el, { label: 'Diamètre poulie motrice', min: 20, max: 80, value: 40, step: 10, color: AMBER, fmt: function (v) { return v + ' mm'; } }, function (v) { d1 = v; paint(); });
  ui.slider(el, { label: 'Diamètre poulie réceptrice', min: 20, max: 80, value: 80, step: 10, color: BLUE, fmt: function (v) { return v + ' mm'; } }, function (v) { d2 = v; paint(); });
  function paint() { chips.set(ui.chip('N2 = ' + Math.round(N1 * d1 / d2) + ' tr/min', BLUE) + ui.chip('sens : identique', GREEN)); info.set('La courroie transmet le mouvement à distance, dans le <b>même sens</b>. La plus grande poulie tourne <b>plus lentement</b>. Elle glisse si elle est surchargée.'); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var r1 = d1 * .9, r2 = d2 * .9, c1 = 100, c2 = 300, y = 110; r1 = r1 / 2 + 10; r2 = r2 / 2 + 10;
    ln(dyn, c1, y - r1, c2, y - r2, AMBER, 3); ln(dyn, c1, y + r1, c2, y + r2, AMBER, 3);
    S('path', { d: 'M' + c1 + ' ' + (y - r1) + 'A' + r1 + ' ' + r1 + ' 0 0 0 ' + c1 + ' ' + (y + r1), style: 'fill:none;stroke:' + AMBER + ';stroke-width:3' }, dyn); S('path', { d: 'M' + c2 + ' ' + (y - r2) + 'A' + r2 + ' ' + r2 + ' 0 0 1 ' + c2 + ' ' + (y + r2), style: 'fill:none;stroke:' + AMBER + ';stroke-width:3' }, dyn);
    var a1 = t * 2, a2 = a1 * d1 / d2; [[c1, r1 - 3, a1, AMBER], [c2, r2 - 3, a2, BLUE]].forEach(function (p) { circ(dyn, p[0], y, p[1], p[3], .12, 2); for (var i = 0; i < 4; i++) { var a = p[2] + i * 1.571; ln(dyn, p[0], y, p[0] + Math.cos(a) * (p[1] - 3), y + Math.sin(a) * (p[1] - 3), p[3], 2); } });
    txt(dyn, c1, 200, 'Ø' + d1, AMBER, 'middle', 10, true); txt(dyn, c2, 200, 'Ø' + d2, BLUE, 'middle', 10, true);
  }); paint();
}
function choixTransmission(el) {
  var d = function (n, s) { return function (g) { rect(g, 30, 28, 340, 80, BLUE, .08, 4, 1.8); txt(g, 200, 62, n, '#fff', 'middle', 15, true); txt(g, 200, 90, s, '#9fb8cc', 'middle', 11); }; };
  classify(el, 'Quel système de transmission ?', [
    { name: 'Boîte de vitesses', cat: 0, why: 'Des roues dentées en contact : engrenages.', draw: d('Boîte de vitesses', 'roues dentées') },
    { name: 'Courroie d’alternateur', cat: 1, why: 'Une courroie entre deux poulies.', draw: d('Courroie d’alternateur', 'courroie') },
    { name: 'Chaîne de vélo', cat: 2, why: 'Une chaîne entraîne les pignons.', draw: d('Chaîne de vélo', 'chaîne') },
    { name: 'Étau d’atelier', cat: 3, why: 'Une vis transforme la rotation en translation.', draw: d('Étau d’atelier', 'vis') },
    { name: 'Mécanisme d’horloge', cat: 0, why: 'Engrenages précis.', draw: d('Mécanisme d’horloge', 'roues dentées') },
    { name: 'Tapis de course', cat: 1, why: 'Une courroie entraîne le tapis.', draw: d('Tapis de course', 'courroie') },
    { name: 'Moto', cat: 2, why: 'Chaîne entre pignon et roue.', draw: d('Moto', 'chaîne') },
    { name: 'Presse d’atelier', cat: 3, why: 'Vis et écrou : grande force.', draw: d('Presse d’atelier', 'vis') }
  ], ['Engrenages', 'Courroie', 'Chaîne', 'Vis-écrou'], 'Dents ? Courroie ? Chaîne ? Vis ?');
}
PC.chapter({ id: 't3-8', lazy: true, eyebrow: EY + 'Module 3 · Chaîne d’énergie', title: 'Transmettre', ar: 'نقل الحركة',
  lessons: function () { return [
    { short: 'Engrenages', title: 'Train d’engrenages', intro: 'Change les dents : vitesse et sens de la sortie.', build: trainEngrenages,
      retenir: ['N3 = N1 × z1 ÷ z3.', 'Une roue intermédiaire inverse le sens sans changer la vitesse.'],
      ar: { e: ['سرعة الخرج تتعلق بعدد أسنان العجلة الأولى والأخيرة فقط.'], u: 'غيّر الأسنان.', w: [['engrenage', 'مسنّنات'], ['dents', 'أسنان']] } },
    { short: 'Courroie', title: 'Poulies et courroie', intro: 'Une grande poulie tourne plus lentement.', build: courroie,
      retenir: ['Poulies-courroie : transmission à distance.', 'N2 = N1 × d1 ÷ d2, même sens.'],
      ar: { e: ['البكرات والسير تنقل الحركة عن بعد وفي نفس الاتجاه.'], u: 'غيّر القطرين.', w: [['poulie', 'بكرة'], ['courroie', 'سير']] } },
    { short: 'Vis-écrou', title: 'Vis et écrou', intro: 'Tourner pour avancer : le pas fait la distance.', build: visEcrou,
      retenir: ['1 tour de vis = 1 <b>pas</b> d’avance.', 'Rotation → translation.'],
      ar: { e: ['كل دورة للبرغي تحرك الصامولة بمقدار الخطوة.'], u: 'غيّر الخطوة.', w: [['pas', 'خطوة'], ['vis', 'برغي']] } },
    { short: 'Choisir', title: 'Choisir la transmission', intro: 'Engrenages, courroie, chaîne ou vis ?', build: choixTransmission,
      retenir: ['Engrenages : précis. Courroie : silencieuse. Chaîne : robuste. Vis : grande force.'],
      ar: { e: ['لكل نظام نقل ميزته: المسنّنات دقيقة والسير هادئ والسلسلة متينة والبرغي قوي.'], u: 'اختر.', w: [['chaîne', 'سلسلة']] } }
  ]; },
  quiz: [
    { q: 'z1 = 12, z3 = 24, N1 = 600 tr/min. N3 vaut :', o: ['300 tr/min', '1200 tr/min', '600 tr/min'], a: 0, e: '600 × 12 ÷ 24.' },
    { q: 'Une roue intermédiaire modifie :', o: ['le sens de rotation', 'le rapport de vitesse', 'rien'], a: 0, e: 'Pas le rapport z1/z3.' },
    { q: 'Vis de pas 2 mm, 10 tours : l’écrou avance de :', o: ['20 mm', '5 mm', '12 mm'], a: 0, e: '10 × 2.' },
    { q: 'Pour entraîner une roue de vélo, on utilise :', o: ['une chaîne', 'une vis', 'une pile'], a: 0, e: 'Chaîne et pignons.' }
  ]
});

/* ---------- Agir ---------- */
function verinPneu(el) {
  var svg = ui.stage(el, 400, 230, 'Vérin pneumatique : F = P × S'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), P = 6, Dm = 50, M = 80, t = 0, ext = 0;
  ui.slider(el, { label: 'Pression', min: 1, max: 8, value: 6, step: 1, color: BLUE, fmt: function (v) { return v + ' bar'; } }, function (v) { P = v; paint(); });
  ui.slider(el, { label: 'Diamètre du piston', min: 20, max: 80, value: 50, step: 10, color: AMBER, fmt: function (v) { return v + ' mm'; } }, function (v) { Dm = v; paint(); });
  ui.slider(el, { label: 'Masse à lever', min: 10, max: 200, value: 80, step: 10, color: RED, fmt: function (v) { return v + ' kg'; } }, function (v) { M = v; paint(); });
  function F() { return .1 * P * Math.PI * Dm * Dm / 4; }
  function ok() { return F() >= M * 9.81; }
  function paint() { chips.set(ui.chip('S = ' + Math.round(Math.PI * Dm * Dm / 4) + ' mm²', BLUE) + ui.chip('F = ' + Math.round(F()) + ' N', AMBER) + ui.chip('poids = ' + Math.round(M * 9.81) + ' N', ok() ? GREEN : RED)); info.set('F (N) = P (bar) × 0,1 × S (mm²). ' + (ok() ? '<b>La force suffit</b> : la charge monte.' : '<b>Force insuffisante</b> : augmente la pression ou le diamètre.')); }
  PC.anim(svg, function (dt) {
    t += dt; ext += ((ok() ? 1 : 0) - ext) * Math.min(1, dt * 1.6); dyn.replaceChildren(); var cyH = 20 + Dm * .45, cy = 150;
    S('rect', { x: 24, y: cy - cyH / 2, width: 170, height: cyH, rx: 4, style: 'fill:#04080c;stroke:' + WIRE + ';stroke-width:2.4' }, dyn);
    var px = 34 + ext * 80; S('rect', { x: 34, y: cy - cyH / 2 + 3, width: Math.max(4, px - 34), height: cyH - 6, style: 'fill:' + BLUE + ';fill-opacity:' + (.1 + P * .05) }, dyn); S('rect', { x: px, y: cy - cyH / 2 + 3, width: 10, height: cyH - 6, style: 'fill:' + AMBER + ';fill-opacity:.7' }, dyn);
    ln(dyn, px + 10, cy, 194 + ext * 80 + 60, cy, WIRE, 6); wire(dyn, [[8, cy], [24, cy]], BLUE, 3); txt(dyn, 14, cy - 12, P + ' bar', BLUE, 'middle', 9, true);
    var bx = 254 + ext * 80, by = 188, ws = 30 + M * .12; S('rect', { x: bx, y: by - ws, width: ws, height: ws, rx: 3, style: 'fill:' + (ok() ? GREEN : RED) + ';fill-opacity:.25;stroke:' + (ok() ? GREEN : RED) + ';stroke-width:2.4' }, dyn); txt(dyn, bx + ws / 2, by - ws / 2 + 4, M + ' kg', '#fff', 'middle', 10, true);
    ln(dyn, 20, by, 380, by, '#37536b', 2); txt(dyn, 100, 40, ok() ? 'la tige sort' : 'la tige ne sort pas', ok() ? GREEN : RED, 'middle', 11, true);
    for (var i = 0; i < 4; i++) { var u = (t * .8 + i / 4) % 1; circ(dyn, 40 + u * (px - 40), cy + Math.sin(i * 3 + t * 5) * (cyH / 4), 2, BLUE, .8, 0); }
  }); paint();
}
function actionneurEffet(el) {
  var d = function (n, s) { return function (g) { rect(g, 30, 28, 340, 80, GREEN, .08, 4, 1.8); txt(g, 200, 62, n, '#fff', 'middle', 15, true); txt(g, 200, 90, s, '#9fb8cc', 'middle', 11); }; };
  classify(el, 'Quel effet produit l’actionneur ?', [
    { name: 'Moteur de ventilateur', cat: 0, why: 'Il crée un mouvement.', draw: d('Moteur de ventilateur', 'mouvement') },
    { name: 'Vérin pneumatique', cat: 0, why: 'Il pousse et tire : mouvement.', draw: d('Vérin pneumatique', 'mouvement') },
    { name: 'Lampe', cat: 1, why: 'Effet lumineux.', draw: d('Lampe', 'lumière') },
    { name: 'Écran de contrôle', cat: 1, why: 'Il éclaire et affiche : effet lumineux.', draw: d('Écran de contrôle', 'lumière') },
    { name: 'Sirène', cat: 2, why: 'Effet sonore.', draw: d('Sirène', 'son') },
    { name: 'Buzzer', cat: 2, why: 'Effet sonore.', draw: d('Buzzer', 'son') },
    { name: 'Radiateur', cat: 3, why: 'Effet thermique.', draw: d('Radiateur', 'chaleur') },
    { name: 'Plaque de cuisson', cat: 3, why: 'Elle chauffe.', draw: d('Plaque de cuisson', 'chaleur') }
  ], ['Mouvement', 'Lumière', 'Son', 'Chaleur'], 'Que fait-il à l’environnement ?');
}
function ordreEnergie(el) {
  ordering(el, 'Les fonctions de la chaîne d’énergie dans l’ordre', ['Alimenter', 'Distribuer', 'Convertir', 'Transmettre', 'Agir'], 'Par quoi commence la chaîne d’énergie ?');
}
PC.chapter({ id: 't3-9', lazy: true, eyebrow: EY + 'Module 3 · Chaîne d’énergie', title: 'Agir', ar: 'الفعل على الوسط',
  lessons: function () { return [
    { short: 'Vérin', title: 'Vérin pneumatique', intro: 'Pression, diamètre, masse : le vérin soulève-t-il ?', build: verinPneu,
      retenir: ['F = P × S, avec 1 bar = 0,1 N/mm².', 'Un piston plus grand donne <b>plus de force</b>.'],
      ar: { e: ['القوة تساوي الضغط في المساحة، وكلما كبر المكبس زادت القوة.'], u: 'غيّر القيم.', w: [['vérin', 'رافعة'], ['pression', 'ضغط']] } },
    { short: 'Effets', title: 'Les effets d’un actionneur', intro: 'Mouvement, lumière, son ou chaleur ?', build: actionneurEffet,
      retenir: ['Un <b>actionneur</b> agit sur l’environnement.', 'Ses effets : mouvement, lumière, son, chaleur.'],
      ar: { e: ['المنفّذ يؤثر في الوسط: حركة أو ضوء أو صوت أو حرارة.'], u: 'صنّف.', w: [['actionneur', 'منفّذ']] } },
    { short: 'L’ordre', title: 'Ordonner la chaîne', intro: 'Remets les cinq fonctions dans l’ordre.', build: ordreEnergie,
      retenir: ['Alimenter → distribuer → convertir → transmettre → agir.'],
      ar: { e: ['الترتيب: تغذية، توزيع، تحويل، نقل، فعل.'], u: 'رتّب.', w: [['agir', 'فعل']] } }
  ]; },
  quiz: [
    { q: 'Piston de 50 mm (S ≈ 1963 mm²) à 6 bar. La force vaut environ :', o: ['1178 N', '118 N', '11 780 N'], a: 0, e: '6 × 0,1 × 1963.' },
    { q: 'Un buzzer est un actionneur :', o: ['sonore', 'thermique', 'mécanique'], a: 0, e: 'Il produit du son.' },
    { q: 'La fonction « Agir » vient :', o: ['en dernier', 'en premier', 'au milieu'], a: 0, e: 'Après transmettre.' },
    { q: 'Doubler le diamètre du piston multiplie la force par :', o: ['4', '2', '8'], a: 0, e: 'S dépend du carré du diamètre.' }
  ]
});
