/* ===================================================== 3AC · MODULE 1 · ÉVOLUTION DES SYSTÈMES TECHNIQUES */
var MX = { en: 'hum', co: 'hum' };
function personne(g, x, y, s, col, lean) {
  circ(g, x, y - 38 * s, 7 * s, col, .25, 2); ln(g, x, y - 31 * s, x + lean, y - 8 * s, col, 3); ln(g, x + lean, y - 8 * s, x - 7 * s, y + 14 * s, col, 3); ln(g, x + lean, y - 8 * s, x + 9 * s, y + 14 * s, col, 3);
}
function picSysteme(g, cls, t) {
  var cx = 110, cy = 110;
  if (cls === 'primitif') {
    var a = Math.sin(t * 3) * .5; personne(g, cx - 20, cy + 25, 1.2, AMBER, 8 + 6 * Math.sin(t * 3)); ln(g, cx - 12, cy - 10, cx + 28 + Math.cos(a) * 14, cy + 20 + Math.sin(a) * 22, WIRE, 4); ln(g, cx + 28 + Math.cos(a) * 14, cy + 20 + Math.sin(a) * 22, cx + 42 + Math.cos(a) * 14, cy + 28 + Math.sin(a) * 22, WIRE, 4);
    txt(g, cx, 190, 'la houe', '#9fb8cc', 'middle', 11);
  } else if (cls === 'mecanise') {
    S('rect', { x: cx - 50, y: cy - 6, width: 70, height: 36, rx: 5, style: 'fill:' + AMBER + ';fill-opacity:.2;stroke:' + AMBER + ';stroke-width:2.2' }, g); S('rect', { x: cx - 10, y: cy - 34, width: 36, height: 30, rx: 3, style: 'fill:none;stroke:' + AMBER + ';stroke-width:2.2' }, g);
    [[cx - 30, cy + 34, 17], [cx + 28, cy + 38, 11]].forEach(function (w) { circ(g, w[0], w[1], w[2], WIRE, .1, 2.4); for (var i = 0; i < 4; i++) { var b = t * 4 + i * 1.57; ln(g, w[0], w[1], w[0] + Math.cos(b) * w[2], w[1] + Math.sin(b) * w[2], WIRE, 1.6); } });
    personne(g, cx + 8, cy - 4, .6, BLUE, 0); for (var k = 0; k < 3; k++) { var u = (t * .8 + k / 3) % 1; circ(g, cx - 46 - u * 8, cy - 12 - u * 24, 2 + u * 4, WIRE, .4 * (1 - u), 0); }
    txt(g, cx, 190, 'le tracteur', '#9fb8cc', 'middle', 11);
  } else if (cls === 'automatise') {
    ln(g, cx - 40, cy + 40, cx - 40, cy - 20, WIRE, 4); S('path', { d: 'M' + (cx - 40) + ' ' + (cy - 20) + 'L' + (cx + 40) + ' ' + (cy - 30), style: 'stroke:' + WIRE + ';stroke-width:4;fill:none' }, g);
    for (var j = 0; j < 8; j++) { var q = (t * 1.2 + j / 8) % 1; circ(g, cx + 40 + q * 22 * Math.cos(j), cy - 30 + q * q * 70, 2.4, BLUE, .8 * (1 - q), 0); }
    ln(g, cx + 70, cy + 40, cx + 70, cy + 10, GREEN, 3); circ(g, cx + 70, cy + 6, 5, GREEN, .5, 2); S('path', { d: 'M' + (cx + 70) + ' ' + (cy + 6) + 'Q' + (cx + 20) + ' ' + (cy - 14) + ' ' + (cx - 38) + ' ' + (cy - 14), style: 'stroke:' + AMBER + ';stroke-width:1.5;stroke-dasharray:4 3;fill:none' }, g);
    txt(g, cx, 190, 'arrosage automatique', '#9fb8cc', 'middle', 11);
  } else {
    var a1 = -.9 + Math.sin(t * 1.4) * .5, a2 = .8 + Math.sin(t * 1.9) * .6, x1 = cx - 30 + Math.cos(a1) * 54, y1 = cy + 34 + Math.sin(a1) * 54, x2 = x1 + Math.cos(a1 + a2) * 44, y2 = y1 + Math.sin(a1 + a2) * 44;
    S('rect', { x: cx - 50, y: cy + 34, width: 40, height: 14, style: 'fill:' + AMBER + ';fill-opacity:.25;stroke:' + AMBER + ';stroke-width:2' }, g); ln(g, cx - 30, cy + 34, x1, y1, AMBER, 7); ln(g, x1, y1, x2, y2, AMBER, 5); circ(g, x1, y1, 6, WIRE, 1, 0); circ(g, x2, y2, 5, GREEN, .8, 0);
    circ(g, cx + 50, cy - 10, 8, BLUE, .3, 2); ln(g, cx + 50, cy - 2, cx + 50, cy + 48, WIRE, 2); txt(g, cx + 50, cy - 22, 'caméra', BLUE, 'middle', 9);
    txt(g, cx, 190, 'bras robotisé programmable', '#9fb8cc', 'middle', 11);
  }
}
var CLS = {
  primitif: ['Système primitif', 'Énergie : <b>humaine</b>. Commande : <b>humaine</b>. Exemple : la houe.'],
  mecanise: ['Système mécanisé', 'Énergie : <b>moteur</b>. Commande : <b>humaine</b>. Exemple : le tracteur.'],
  automatise: ['Système automatisé', 'Énergie : <b>moteur</b>. Commande : <b>automatique</b> (capteurs). Exemple : l’arrosage automatique.'],
  robotise: ['Système robotisé', 'Énergie : <b>moteur</b>. Commande : <b>programmable</b> et adaptable. Exemple : un bras de robot.'],
  x: ['Combinaison non étudiée', 'Une énergie humaine avec une commande automatique n’est pas un cas du programme.']
};
function matriceSysteme(el) {
  var svg = ui.stage(el, 400, 200, 'Énergie et commande : quel type de système ?'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), t = 0;
  MX.en = 'hum'; MX.co = 'hum';
  function cls() { return MX.en === 'hum' ? (MX.co === 'hum' ? 'primitif' : 'x') : (MX.co === 'hum' ? 'mecanise' : (MX.co === 'auto' ? 'automatise' : 'robotise')); }
  ui.tabs(el, [['hum', 'Énergie humaine'], ['mot', 'Énergie : moteur']], function (k) { MX.en = k; paint(); });
  ui.tabs(el, [['hum', 'Commande humaine'], ['auto', 'Automatique'], ['prog', 'Programmable']], function (k) { MX.co = k; paint(); });
  function paint() { var c = CLS[cls()]; chips.set(ui.chip(c[0], cls() === 'x' ? RED : AMBER)); info.set(c[1]); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var c = cls();
    if (c !== 'x') picSysteme(dyn, c, t); else txt(dyn, 110, 110, '?', RED, 'middle', 60, true);
    rect(dyn, 220, 30, 160, 40, MX.en === 'hum' ? AMBER : BLUE, .1, 4, 1.8); txt(dyn, 300, 55, MX.en === 'hum' ? 'Énergie musculaire' : 'Énergie : moteur', '#fff', 'middle', 11, true);
    rect(dyn, 220, 130, 160, 40, MX.co === 'hum' ? AMBER : (MX.co === 'auto' ? GREEN : BLUE), .1, 4, 1.8); txt(dyn, 300, 155, MX.co === 'hum' ? 'Commande humaine' : (MX.co === 'auto' ? 'Commande automatique' : 'Commande programmée'), '#fff', 'middle', 10.5, true);
    rect(dyn, 240, 80, 120, 40, WIRE, .06, 4, 1.8); txt(dyn, 300, 105, c === 'x' ? '—' : CLS[c][0].replace('Système ', ''), AMBER, 'middle', 13, true);
    arrow(dyn, 300, 71, 300, 79, WIRE, 1.4); arrow(dyn, 300, 129, 300, 121, WIRE, 1.4);
  });
  paint();
}
function classerSystemes(el) {
  var d = function (name, sub) { return function (g) { rect(g, 40, 30, 320, 70, AMBER, .08, 4, 1.8); txt(g, 200, 62, name, '#fff', 'middle', 16, true); txt(g, 200, 86, sub, '#9fb8cc', 'middle', 11); }; };
  classify(el, 'Classer des systèmes techniques', [
    { name: 'Une pelle', cat: 0, why: 'Force musculaire et commande humaine.', draw: d('Une pelle', 'creuser') },
    { name: 'Une brouette', cat: 0, why: 'Force musculaire : primitif.', draw: d('Une brouette', 'transporter') },
    { name: 'Une perceuse électrique', cat: 1, why: 'Un moteur ; la personne guide l’outil.', draw: d('Une perceuse électrique', 'percer') },
    { name: 'Un tracteur', cat: 1, why: 'Moteur et conducteur : mécanisé.', draw: d('Un tracteur', 'labourer') },
    { name: 'Une porte de garage à détecteur', cat: 2, why: 'Un capteur déclenche l’ouverture seule.', draw: d('Une porte de garage à détecteur', 'ouvrir') },
    { name: 'Un lave-linge', cat: 2, why: 'Un programme fixe se déroule seul.', draw: d('Un lave-linge', 'laver') },
    { name: 'Un robot aspirateur', cat: 3, why: 'Programmable, il s’adapte à la pièce grâce à ses capteurs.', draw: d('Un robot aspirateur', 'nettoyer') },
    { name: 'Un bras de chaîne de montage', cat: 3, why: 'Programmable et polyvalent : robotisé.', draw: d('Un bras de chaîne de montage', 'assembler') }
  ], ['Primitif', 'Mécanisé', 'Automatisé', 'Robotisé'], 'Énergie ? Commande ? Choisis le type.');
}

var PUITS = { lvl: .3, pump: false, rov: 0, dry: [1, 1, 0, 1, 0, 1] };
function frisePuits(el) {
  var Z = PUITS; Z.lvl = .3; Z.pump = false; Z.rov = 0; Z.dry = [1, 1, 0, 1, 0, 1];
  var ERA = ['Primitif', 'Mécanisé', 'Automatisé', 'Robotisé'];
  narrated(el, 400, 240, 'Frise : amener l’eau aux plantes', [
    { t: 'Primitif', d: 'Un puits et un seau : l’énergie et la commande sont humaines.' },
    { t: 'Mécanisé', d: 'Une pompe à moteur remplace la force ; la personne commande.' },
    { t: 'Automatisé', d: 'Un capteur de niveau déclenche la pompe sans l’humain.' },
    { t: 'Robotisé', d: 'Un robot programmable arrose seulement les plantes sèches.' }
  ], function (g, k, t, dt) {
    ERA.forEach(function (e, i) { var x = 50 + i * 100; ln(g, x + 8, 22, x + 92, 22, i < k ? AMBER : '#2a4660', 2); circ(g, x, 22, 8, i === k ? AMBER : (i < k ? AMBER : '#37536b'), i === k ? .9 : .3, 0); txt(g, x, 46, e, i === k ? '#fff' : '#7e9bb2', 'middle', 9.5, i === k); });
    ln(g, 0, 205, 400, 205, '#37536b', 2);
    if (k === 0) {
      S('rect', { x: 70, y: 150, width: 80, height: 55, style: 'fill:#04080c;stroke:' + WIRE + ';stroke-width:2.4' }, g); ln(g, 76, 150, 76, 90, WIRE, 4); ln(g, 144, 150, 144, 90, WIRE, 4); ln(g, 70, 90, 150, 90, WIRE, 4);
      var u = (Math.sin(t * 1.6) + 1) / 2, by = 100 + u * 80; ln(g, 110, 90, 110, by, WIRE, 1.6); S('rect', { x: 102, y: by, width: 16, height: 14, rx: 2, style: 'fill:' + BLUE + ';fill-opacity:.5;stroke:' + BLUE + ';stroke-width:2' }, g);
      personne(g, 230 + Math.sin(t * 1.6) * 6, 190, 1.1, AMBER, -6); ln(g, 226 + Math.sin(t * 1.6) * 6, 168, 110, 90, '#ffffff55', 1.4, '3 3'); txt(g, 270, 130, 'force musculaire', AMBER, 'start', 10);
    } else if (k === 1) {
      S('rect', { x: 250, y: 100, width: 80, height: 105, rx: 4, style: 'fill:#04080c;stroke:' + WIRE + ';stroke-width:2.4' }, g); S('rect', { x: 253, y: 160, width: 74, height: 42, style: 'fill:' + BLUE + ';fill-opacity:.35' }, g);
      circ(g, 160, 180, 18, AMBER, .15, 2.4); for (var i = 0; i < 3; i++) { var b = t * 8 + i * 2.1; ln(g, 160 + Math.cos(b) * 3, 180 + Math.sin(b) * 3, 160 + Math.cos(b) * 15, 180 + Math.sin(b) * 15, AMBER, 2.4); }
      wire(g, [[60, 195], [140, 195], [140, 180]], BLUE, 3); wire(g, [[178, 180], [215, 180], [215, 120], [250, 120]], BLUE, 3); flow(g, [[60, 195], [140, 195], [140, 180], [178, 180], [215, 180], [215, 120], [250, 120]], (t * .35) % 1, 8, BLUE, 2.6);
      S('rect', { x: 20, y: 130, width: 40, height: 74, style: 'fill:#04080c;stroke:' + WIRE + ';stroke-width:2' }, g); personne(g, 100, 190, 1, AMBER, 0); S('rect', { x: 130, y: 150, width: 12, height: 12, rx: 2, style: 'fill:' + RED }, g); txt(g, 136, 144, 'marche', RED, 'middle', 8.5); txt(g, 160, 215, 'moteur', AMBER, 'middle', 9.5);
    } else if (k === 2) {
      var Zn = Z; if (Zn.lvl < .38) Zn.pump = true; if (Zn.lvl > .88) Zn.pump = false; Zn.lvl += (Zn.pump ? .16 : -.07) * dt;
      S('rect', { x: 250, y: 90, width: 80, height: 115, rx: 4, style: 'fill:#04080c;stroke:' + WIRE + ';stroke-width:2.4' }, g); var h = 105 * Zn.lvl; S('rect', { x: 253, y: 202 - h, width: 74, height: h, style: 'fill:' + BLUE + ';fill-opacity:.4' }, g);
      circ(g, 290, 202 - h, 7, AMBER, .8, 2); txt(g, 340, 202 - h + 3, 'capteur', AMBER, 'start', 9.5); ln(g, 244, 118, 250, 118, GREEN, 3); ln(g, 244, 118, 244, 190, '#37536b', 1.2, '2 2'); txt(g, 258, 100, '< seuil haut', '#7e9bb2', 'start', 8);
      circ(g, 150, 180, 18, Zn.pump ? AMBER : WIRE, .15, 2.4); for (var j = 0; j < 3; j++) { var c2 = Zn.pump ? t * 8 + j * 2.1 : j * 2.1; ln(g, 150 + Math.cos(c2) * 3, 180 + Math.sin(c2) * 3, 150 + Math.cos(c2) * 15, 180 + Math.sin(c2) * 15, Zn.pump ? AMBER : WIRE, 2.4); }
      wire(g, [[40, 195], [130, 195], [130, 180]], BLUE, 3); wire(g, [[168, 180], [215, 180], [215, 120], [250, 120]], BLUE, 3); if (Zn.pump) flow(g, [[40, 195], [130, 195], [130, 180], [168, 180], [215, 180], [215, 120], [250, 120]], (t * .35) % 1, 8, BLUE, 2.6);
      block(g, 160, 110, 50, 28, 'Commande', GREEN, 8.5); wire(g, [[290, 202 - h], [290, 76], [185, 76], [185, 110]], AMBER, 1.5); txt(g, 160, 215, Zn.pump ? 'pompe : marche' : 'pompe : arrêt', Zn.pump ? AMBER : '#7e9bb2', 'middle', 9.5);
    } else {
      for (var r = 0; r < 6; r++) { var px = 60 + r * 52; ln(g, px, 150, px, 188, GREEN, 3); circ(g, px, 144, 9, Z.dry[r] ? '#a3743a' : GREEN, .7, 2); }
      Z.rov += dt * 38; if (Z.rov > 340) { Z.rov = 0; Z.dry = [1, 0, 1, 1, 0, 1]; } var rx = 40 + Z.rov;
      for (var m = 0; m < 6; m++) { var pxx = 60 + m * 52; if (Math.abs(rx - pxx) < 4 && Z.dry[m]) Z.dry[m] = 0; if (Math.abs(rx - pxx) < 22 && Z.dry[m]) { ln(g, rx, 128, pxx, 138, AMBER, 1.4, '2 2'); } }
      S('rect', { x: rx - 16, y: 112, width: 32, height: 18, rx: 4, style: 'fill:' + AMBER + ';fill-opacity:.3;stroke:' + AMBER + ';stroke-width:2' }, g); circ(g, rx - 9, 134, 5, WIRE, .5, 1.8); circ(g, rx + 9, 134, 5, WIRE, .5, 1.8); ln(g, rx, 112, rx, 100, BLUE, 2); circ(g, rx, 97, 4, BLUE, .8, 0);
      var onw = Z.dry.some(function (d, i) { return d && Math.abs(rx - (60 + i * 52)) < 22; }); if (onw) for (var q = 0; q < 4; q++) { var uu = (t * 2 + q / 4) % 1; circ(g, rx + 4 + q, 130 + uu * 8, 1.8, BLUE, 1 - uu, 0); }
      txt(g, 200, 90, 'capteur d’humidité · trajet programmé', BLUE, 'middle', 10);
    }
  });
}

function cableOuProgramme(el) {
  var svg = ui.stage(el, 400, 240, 'Modifier un système : câblé ou programmé'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), ctl = ui.controls(el);
  var tech = 'cab', p = 0, run = false;
  ui.tabs(el, [['cab', 'Technologie câblée'], ['prog', 'Technologie programmée']], function (k) { tech = k; p = 0; run = false; paint(); });
  ui.btn(ctl, 'Ajouter : garder la lampe 5 s', function () { p = 0; run = true; });
  ui.btn(ctl, 'Annuler la modification', function () { p = 0; run = false; paint(); });
  function paint() { chips.set(tech === 'cab' ? ui.chip('logique = composants + fils', BLUE) : ui.chip('logique = programme', AMBER)); info.set(tech === 'cab' ? 'Pour changer le comportement, on <b>change le câblage</b>.' : 'Pour changer le comportement, on <b>change le programme</b>.'); }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); if (run) { p = Math.min(1, p + dt / 3.2); }
    block(dyn, 14, 90, 60, 40, 'Bouton', BLUE, 10); block(dyn, 326, 90, 60, 40, 'Lampe', AMBER, 10);
    if (tech === 'cab') {
      block(dyn, 130, 40, 100, 100, '', BLUE, 10); txt(dyn, 180, 56, 'circuit câblé', '#9fb8cc', 'middle', 9.5); block(dyn, 142, 80, 76, 20, 'relais', WIRE, 9);
      wire(dyn, [[74, 110], [130, 110]], WIRE, 2.4); wire(dyn, [[230, 110], [326, 110]], WIRE, 2.4);
      if (p > 0) { var q = Math.min(1, p * 1.6); block(dyn, 142 + 0, 108, 36, 20, 'R', AMBER, 9); S('rect', { x: 182, y: 108, width: 36, height: 20, rx: 3, style: 'fill:' + AMBER + ';fill-opacity:.3;stroke:' + AMBER + ';stroke-width:2;opacity:' + q }, dyn); txt(dyn, 200, 122, 'C', '#fff', 'middle', 9, true); wire(dyn, [[160, 128], [160, 160], [200, 160], [200, 128]], AMBER, 2.2 * q); txt(dyn, 180, 176, '+ composants, + fils, + soudures', AMBER, 'middle', 10); }
      ln(dyn, 20, 205, 380, 205, '#2a4660', 6); ln(dyn, 20, 205, 20 + 360 * p, 205, AMBER, 6); txt(dyn, 200, 228, p >= 1 ? 'terminé : environ 30 minutes de travail' : 'démontage, soudure, test…', p >= 1 ? AMBER : '#9fb8cc', 'middle', 10.5, p >= 1);
    } else {
      block(dyn, 118, 30, 130, 130, '', AMBER, 10); txt(dyn, 183, 46, 'carte programmable', '#9fb8cc', 'middle', 9.5);
      var L = ['si bouton = 1 :', '  lampe = 1', 'sinon :', '  lampe = 0']; if (p > 0) L = ['si bouton = 1 :', '  lampe = 1', '  attendre(5000)', 'sinon :', '  lampe = 0'];
      L.forEach(function (l, i) { var neu = p > 0 && i === 2; if (neu) S('rect', { x: 124, y: 56 + i * 18, width: 118, height: 17, style: 'fill:' + GREEN + ';fill-opacity:.25' }, dyn); txt(dyn, 130, 69 + i * 18, neu ? l.slice(0, Math.max(2, Math.floor(l.length * Math.min(1, p * 2)))) : l, neu ? '#fff' : '#9fb8cc', 'start', 10.5, neu); });
      wire(dyn, [[74, 110], [118, 110]], WIRE, 2.4); wire(dyn, [[248, 110], [326, 110]], WIRE, 2.4);
      ln(dyn, 20, 205, 380, 205, '#2a4660', 6); ln(dyn, 20, 205, 20 + 360 * Math.min(1, p * 8), 205, GREEN, 6); txt(dyn, 200, 228, p > .12 ? 'terminé : aucun fil changé, environ 1 minute' : 'modifier la ligne, téléverser…', p > .12 ? GREEN : '#9fb8cc', 'middle', 10.5, p > .12);
    }
  });
  paint();
}

PC.chapter({ id: 't3-1', lazy: true, eyebrow: EY + 'Module 1 · Évolution des systèmes techniques', title: 'Évolution des systèmes techniques', ar: 'تطوّر الأنظمة التقنية',
  lessons: function () { return [
    { short: 'Énergie et commande', title: 'Énergie et commande', intro: 'Combine énergie et commande : quel système obtiens-tu ?', build: matriceSysteme,
      retenir: ['Un type de système se reconnaît à son <b>énergie</b> et à sa <b>commande</b>.', 'Primitif, mécanisé, automatisé, robotisé.'],
      ar: { e: ['نصنّف النظام التقني بنوع الطاقة ونوع التحكم: بدائي، ممكنن، آلي، روبوتي.'], u: 'غيّر الطاقة والتحكم.', w: [['système primitif', 'نظام بدائي'], ['système mécanisé', 'نظام ممكنن'], ['système automatisé', 'نظام آلي'], ['système robotisé', 'نظام روبوتي']] } },
    { short: 'Classer', title: 'Classer huit systèmes', intro: 'Énergie ? Commande ?', build: classerSystemes,
      retenir: ['Moteur + capteur + commande seule : <b>automatisé</b>.', 'Programmable et adaptable : <b>robotisé</b>.'],
      ar: { e: ['الآلي يعمل وحده بلواقط، والروبوتي قابل للبرمجة ويتكيّف.'], u: 'صنّف الأنظمة.', w: [['commande', 'تحكم'], ['énergie', 'طاقة']] } },
    { short: 'Frise', title: 'Frise : amener l’eau', intro: 'Le même besoin à quatre époques.', build: frisePuits,
      retenir: ['Une <b>frise chronologique</b> range les étapes d’un système dans le temps.', 'On passe de la force humaine aux capteurs puis aux robots.'],
      ar: { e: ['الجدول الزمني يرتّب مراحل تطور النظام: من القوة البشرية إلى اللواقط ثم الروبوتات.'], u: 'تنقّل بين الحقب.', w: [['frise chronologique', 'جدول زمني']] } },
    { short: 'Câblé ou programmé', title: 'Câblée ou programmée', intro: 'Ajoute une temporisation et compare l’effort.', build: cableOuProgramme,
      retenir: ['<b>Câblée</b> : la logique est dans les composants et les fils.', '<b>Programmée</b> : la logique est dans le programme.'],
      ar: { e: ['في التقنية المسلَّكة المنطق في المكوّنات والأسلاك، وفي المبرمجة المنطق في البرنامج.'], u: 'أضف التأخير.', w: [['technologie câblée', 'تقنية مسلَّكة'], ['technologie programmée', 'تقنية مبرمجة']] } },
    { short: 'Barrière', title: 'Un système automatisé en action', intro: 'Suis l’information puis l’énergie.', build: barriereAuto,
      retenir: ['<b>Information</b> : acquérir, traiter.', '<b>Énergie</b> : distribuer, convertir, transmettre, agir.'],
      ar: { e: ['سلسلة المعلومات: اكتساب ومعالجة. سلسلة الطاقة: توزيع وتحويل ونقل وفعل.'], u: 'تابع المراحل.', w: [['chaîne d’information', 'سلسلة المعلومات'], ['chaîne d’énergie', 'سلسلة الطاقة']] } }
  ]; },
  quiz: [
    { q: 'Un tracteur conduit par un agriculteur est un système :', o: ['mécanisé', 'primitif', 'robotisé'], a: 0, e: 'Moteur et commande humaine.' },
    { q: 'Un arrosage qui démarre seul quand le sol est sec est :', o: ['automatisé', 'mécanisé', 'primitif'], a: 0, e: 'Un capteur commande le moteur.' },
    { q: 'Un système programmable et polyvalent, avec capteurs, est :', o: ['robotisé', 'primitif', 'mécanisé'], a: 0, e: 'Il s’adapte à son environnement.' },
    { q: 'Pour ajouter une temporisation dans un circuit câblé, on :', o: ['modifie le câblage', 'modifie seulement un programme', 'ne change rien'], a: 0, e: 'Composants et fils en plus.' },
    { q: 'La technologie programmée se modifie en :', o: ['changeant le programme', 'ressoudant des fils', 'changeant la pile'], a: 0, e: 'On téléverse le nouveau programme.' }
  ]
});
