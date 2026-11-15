/* ===================================================== 2AC · t2-6 COMMUTATION */
function interrupteurs(el) {
  var svg = ui.stage(el, 400, 200, 'Interrupteur, bouton-poussoir, inverseur'), dyn = S('g', null, svg), info = ui.info(el), verd = ui.verdict(el);
  var key = 'inter', on = false, pos = 0, t = 0, ctl = ui.controls(el), b, held = false;
  ui.tabs(el, [['inter', 'Interrupteur'], ['bp', 'Poussoir'], ['inv', 'Inverseur']], function (k) { key = k; on = false; held = false; pos = 0; setup(); });
  b = ui.btn(ctl, 'Basculer', function () { if (key === 'inter') on = !on; else if (key === 'inv') pos = 1 - pos; paint(); });
  function down() { if (key === 'bp') { held = true; paint(); } } function up() { if (key === 'bp') { held = false; paint(); } }
  b.addEventListener('pointerdown', down); ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (e) { b.addEventListener(e, up); });
  b.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); down(); } }); b.addEventListener('keyup', up);
  function setup() { b.textContent = key === 'bp' ? 'Appuyer (maintenir)' : (key === 'inv' ? 'Changer de voie' : 'Basculer'); paint(); }
  function paint() {
    if (key === 'inter') { verd.set(on ? 'Fermé : la lampe reste allumée.' : 'Ouvert : lampe éteinte.', on ? 'ok' : ''); info.set('Il garde sa position tant qu’on ne le change pas.'); }
    else if (key === 'bp') { verd.set(held ? 'Appuyé : la lampe brille.' : 'Relâché : lampe éteinte.', held ? 'ok' : ''); info.set('Il ne ferme le circuit que pendant l’appui.'); }
    else { verd.set(pos ? 'Voie B : lampe B allumée.' : 'Voie A : lampe A allumée.', 'ok'); info.set('Il envoie le courant vers une voie <b>ou</b> l’autre.'); }
  }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); t += dt;
    if (key !== 'inv') {
      var cl = key === 'inter' ? on : held; ring(dyn); sBat(dyn, 190, 170, '6 V', 40); sSwitch(dyn, 170, 70, cl, key === 'inter' ? 'interrupteur' : 'poussoir', 48); sLamp(dyn, 270, 70, cl ? 1 : 0, '', 48);
      if (cl) flow(dyn, RING, (t * .3) % 1, 8, AMBER, 2.5);
    } else {
      var A = [[60, 100], [120, 60], [200, 60]], B = [[60, 100], [120, 140], [200, 140]];
      ln(dyn, 60, 100, 60, 180, WIRE, 2); ln(dyn, 60, 180, 150, 180, WIRE, 2); sBat(dyn, 190, 180, '6 V', 80); ln(dyn, 230, 180, 330, 180, WIRE, 2); ln(dyn, 330, 60, 330, 180, WIRE, 2); ln(dyn, 330, 60, 270, 60, WIRE, 2); ln(dyn, 330, 140, 270, 140, WIRE, 2);
      circ(dyn, 120, 60, 3, WIRE, 1, 1); circ(dyn, 120, 140, 3, WIRE, 1, 1); ln(dyn, 120, 60, 168, 60, WIRE, 2); ln(dyn, 120, 140, 168, 140, WIRE, 2);
      sLamp(dyn, 220, 60, pos ? 0 : 1, 'A', 96); sLamp(dyn, 220, 140, pos ? 1 : 0, 'B', 96);
      ln(dyn, 60, 100, pos ? 118 : 118, pos ? 138 : 62, WIRE, 3); circ(dyn, 60, 100, 4, WIRE, 1, 1);
      flow(dyn, pos ? [[190, 180], [230, 180], [330, 180], [330, 140], [270, 140], [168, 140], [120, 140], [60, 100], [60, 180], [150, 180]] : [[190, 180], [230, 180], [330, 180], [330, 60], [270, 60], [168, 60], [120, 60], [60, 100], [60, 180], [150, 180]], (t * .3) % 1, 9, AMBER, 2.5);
    }
  });
  setup();
}

function relaisCommande(el) {
  var svg = ui.stage(el, 400, 230, 'Relais : petit courant, grand courant'), dyn = S('g', null, svg), info = ui.info(el), verd = ui.verdict(el);
  var on = false, t = 0, ang = 0, ctl = ui.controls(el);
  ui.btn(ctl, 'Fermer / ouvrir la commande', function () { on = !on; paint(); });
  function paint() { verd.set(on ? 'Bobine alimentée : le contact se ferme, le moteur tourne.' : 'Commande ouverte : le moteur est arrêté.', on ? 'ok' : ''); info.set('Un <b>petit courant</b> (5 V) commande un <b>gros courant</b> (12 V) : les deux circuits sont séparés.'); }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); t += dt; if (on) ang += dt * 9;
    txt(dyn, 90, 18, 'Commande 5 V', BLUE, 'middle', 11, true); txt(dyn, 310, 18, 'Puissance 12 V', AMBER, 'middle', 11, true);
    var C = [[20, 40], [20, 200], [160, 200], [160, 40], [20, 40]], P = [[240, 40], [240, 200], [380, 200], [380, 40], [240, 40]];
    wire(dyn, C, BLUE, 1.8); wire(dyn, P, AMBER, 1.8);
    S('rect', { x: 90, y: 28, width: 50, height: 24, style: 'fill:#0d1620;stroke:none' }, dyn); sSwitch(dyn, 90, 40, on, '', 60);
    S('rect', { x: 70, y: 188, width: 40, height: 24, style: 'fill:#0d1620;stroke:none' }, dyn); sBat(dyn, 90, 200, '5 V', 40);
    S('rect', { x: 145, y: 90, width: 30, height: 70, rx: 3, style: 'fill:' + (on ? BLUE : '#0d1620') + ';fill-opacity:' + (on ? .35 : 1) + ';stroke:' + BLUE + ';stroke-width:2' }, dyn);
    for (var i = 0; i < 5; i++) ln(dyn, 148, 100 + i * 12, 172, 106 + i * 12, BLUE, 1.6);
    txt(dyn, 160, 178, 'bobine', BLUE, 'middle', 9);
    if (on) for (var k = 0; k < 3; k++) { var a = (t * 1.2 + k / 3) % 1; ln(dyn, 176 + a * 40, 125, 184 + a * 40, 125, BLUE, 2, '3 3'); }
    S('rect', { x: 295, y: 28, width: 50, height: 24, style: 'fill:#0d1620;stroke:none' }, dyn); sSwitch(dyn, 290, 40, on, 'contact', 60); S('rect', { x: 300, y: 80, width: 0, height: 0 }, dyn);
    sMotor(dyn, 310, 200, ang, '', 56);
    S('rect', { x: 366, y: 98, width: 28, height: 44, style: 'fill:#0d1620;stroke:none' }, dyn); sBat(S('g', { transform: 'rotate(90 380 120)' }, dyn), 380, 120, '', 40); txt(dyn, 366, 124, '12 V', AMBER, 'end', 10);
    if (on) { flow(dyn, C, (t * .3) % 1, 7, BLUE, 2.3); flow(dyn, P, (t * .35) % 1, 9, AMBER, 2.5); }
  });
  paint();
}

function transistorCommande(el) {
  var svg = ui.stage(el, 400, 230, 'Transistor NPN en commutation'), dyn = S('g', null, svg), info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el);
  var Vb = 0, t = 0;
  ui.slider(el, { label: 'Tension de base VB', min: 0, max: 2, value: 0, step: .05, color: BLUE, fmt: function (v) { return v.toFixed(2) + ' V'; } }, function (v) { Vb = v; calc(); });
  var on, lvl;
  function calc() {
    lvl = Math.max(0, Math.min(1, (Vb - .6) / .15)); on = lvl > 0;
    chips.set(ui.chip('VB = ' + Vb.toFixed(2) + ' V', BLUE) + ui.chip(on ? 'saturé : interrupteur fermé' : 'bloqué : interrupteur ouvert', on ? GREEN : RED));
    verd.set(on ? 'La LED s’allume.' : 'Le transistor est bloqué : la LED est éteinte.', on ? 'ok' : '');
    info.set('Seuil ≈ <b>0,6 V</b>. Au-dessus, un petit courant de base laisse passer un grand courant de collecteur.');
  }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); t += dt;
    txt(dyn, 210, 10, '+ 9 V', AMBER, 'middle', 11, true); ln(dyn, 210, 14, 210, 20, WIRE, 2);
    var g1 = S('g', { transform: 'rotate(90 210 44)' }, dyn); sRes(g1, 210, 44, '', 48); var g2 = S('g', { transform: 'rotate(90 210 96)' }, dyn); sLed(g2, 210, 96, lvl, '', GREEN, 48);
    ln(dyn, 210, 120, 210, 126, WIRE, 2); sNpn(dyn, 200, 160, on, ''); sGround(dyn, 210, 194);
    ln(dyn, 90, 160, 176, 160, BLUE, 2); circ(dyn, 90, 160, 3, BLUE, 1, 1); txt(dyn, 90, 148, 'VB = ' + Vb.toFixed(2) + ' V', BLUE, 'middle', 10.5); txt(dyn, 250, 44, 'R', '#9fb8cc', 'start', 10);
    if (on) { flow(dyn, [[210, 14], [210, 126], [210, 194]], (t * .45) % 1, 6, AMBER, 2.5); flow(dyn, [[90, 160], [176, 160]], (t * .6) % 1, 3, BLUE, 2); }
  });
  calc();
}
PC.chapter({ id: 't2-6', lazy: true, eyebrow: EY2 + 'Module 2 · Fonctions techniques', title: 'La fonction « Commutation »', ar: 'وظيفة التبديل',
  lessons: function () { return [
    { short: 'Interrupteurs', title: 'Interrupteurs', intro: 'Essaie les trois types.', build: interrupteurs,
      retenir: ['<b>Commuter</b> : ouvrir ou fermer un circuit.', 'Interrupteur : garde sa position. Poussoir : pendant l’appui. Inverseur : choisit une voie.'],
      ar: { e: ['التبديل هو فتح الدارة أو إغلاقها. القاطع يحافظ على وضعه، والزر أثناء الضغط، والمبدّل يختار مسلكا.'], u: 'جرّب الأنواع الثلاثة.', w: [['interrupteur', 'قاطع'], ['inverseur', 'مبدّل']] } },
    { short: 'Relais', title: 'Le relais', intro: 'Commande un moteur de 12 V avec 5 V.', build: relaisCommande,
      retenir: ['Le <b>relais</b> commute un gros courant avec un petit.', 'Commande et puissance sont séparées.'],
      ar: { e: ['المرحّل يتحكم في تيار كبير بتيار صغير، والدارتان منفصلتان.'], u: 'اضغط للتحكم.', w: [['relais', 'مرحّل'], ['bobine', 'ملف']] } },
    { short: 'Transistor', title: 'Le transistor', intro: 'Augmente VB et observe.', build: transistorCommande,
      retenir: ['Le <b>transistor</b> est un interrupteur électronique.', 'Au-delà de 0,6 V sur la base, il conduit.'],
      ar: { e: ['الترانزستور قاطع إلكتروني: يمرّر التيار عندما يتجاوز توتر القاعدة 0.6 V.'], u: 'حرّك المنزلق.', w: [['transistor', 'ترانزستور'], ['base', 'قاعدة']] } }
  ]; },
  quiz: [
    { q: 'Quel interrupteur ferme le circuit seulement pendant l’appui ?', o: ['le bouton-poussoir', 'l’interrupteur', 'l’inverseur'], a: 0, e: 'Il revient en position ouverte au relâchement.' },
    { q: 'Le relais permet de :', o: ['commander un gros courant avec un petit', 'produire de l’énergie', 'mesurer la lumière'], a: 0, e: 'La bobine commande le contact.' },
    { q: 'Un transistor bloqué se comporte comme :', o: ['un interrupteur ouvert', 'un interrupteur fermé', 'une pile'], a: 0, e: 'Aucun courant ne passe.' },
    { q: 'Seuil de conduction d’un transistor NPN :', o: ['≈ 0,6 V', '≈ 9 V', '≈ 0 V'], a: 0, e: 'Entre base et émetteur.' }
  ]
});
