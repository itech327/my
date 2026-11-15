/* ===================================================== 3AC · MODULE 2 · CHAÎNE D'INFORMATION (acquérir · traiter · communiquer) */
function echoUltrason(el) {
  var svg = ui.stage(el, 400, 220, 'Capteur à ultrasons : mesurer une distance'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), t = 0, D = 100;
  ui.slider(el, { label: 'Distance de l’obstacle', min: 10, max: 200, value: 100, step: 5, color: AMBER, fmt: function (v) { return v + ' cm'; } }, function (v) { D = v; paint(); });
  function paint() { var us = Math.round(2 * D / 100 / 340 * 1e6); chips.set(ui.chip('aller-retour : ' + (us / 1000).toFixed(2) + ' ms', BLUE) + ui.chip('d = v × t ÷ 2', AMBER)); info.set('Le capteur émet un <b>son inaudible</b>, attend l’<b>écho</b> et calcule : d = 340 m/s × t ÷ 2.'); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var X0 = 70, X1 = 70 + D * 1.5, per = 3, p = (t % per) / per;
    ln(dyn, 20, 140, 380, 140, '#2a4660', 1.4); for (var m = 0; m <= 200; m += 50) { ln(dyn, X0 + m * 1.5, 136, X0 + m * 1.5, 144, '#37536b', 1.4); txt(dyn, X0 + m * 1.5, 158, m + '', '#7e9bb2', 'middle', 8.5); }
    S('rect', { x: 20, y: 92, width: 38, height: 54, rx: 5, style: 'fill:' + BLUE + ';fill-opacity:.18;stroke:' + BLUE + ';stroke-width:2.2' }, dyn); circ(dyn, 38, 108, 6, BLUE, .5, 1.8); circ(dyn, 38, 130, 6, BLUE, .5, 1.8); txt(dyn, 38, 82, 'émetteur / récepteur', BLUE, 'middle', 8.5);
    S('rect', { x: X1, y: 78, width: 14, height: 76, style: 'fill:#37536b;stroke:#7e9bb2;stroke-width:2' }, dyn);
    var go = p < .5, q = go ? p * 2 : (1 - (p - .5) * 2), xw = X0 + (X1 - X0) * q;
    for (var r = 0; r < 3; r++) { var xx = xw - r * 12 * (go ? 1 : -1); if (xx > X0 - 2 && xx < X1) S('path', { d: 'M' + xx + ' 104Q' + (xx + (go ? 10 : -10)) + ' 120 ' + xx + ' 136', style: 'fill:none;stroke:' + (go ? BLUE : AMBER) + ';stroke-width:2.4;opacity:' + (1 - r * .3) }, dyn); }
    txt(dyn, 200, 36, go ? 'émission →' : '← écho', go ? BLUE : AMBER, 'middle', 12, true);
    ln(dyn, X0, 185, X1, 185, AMBER, 2); ln(dyn, X0, 180, X0, 190, AMBER, 2); ln(dyn, X1, 180, X1, 190, AMBER, 2); txt(dyn, (X0 + X1) / 2, 205, 'd = ' + D + ' cm', AMBER, 'middle', 11, true);
  }); paint();
}
function choixCapteur(el) {
  var d = function (n, s) { return function (g) { rect(g, 30, 28, 340, 80, BLUE, .08, 4, 1.8); txt(g, 200, 62, n, '#fff', 'middle', 15, true); txt(g, 200, 90, s, '#9fb8cc', 'middle', 11); }; };
  classify(el, 'Quel capteur choisir ?', [
    { name: 'Compter les voitures qui entrent', cat: 0, why: 'Passage : oui ou non. Un détecteur de passage suffit.', draw: d('Compter les voitures qui entrent', 'évènement : passe / ne passe pas') },
    { name: 'Allumer un lampadaire à la nuit', cat: 0, why: 'Une seule décision à un seuil : détecteur de luminosité.', draw: d('Allumer un lampadaire à la nuit', 'seuil de lumière') },
    { name: 'Afficher la température d’une salle', cat: 1, why: 'On veut une valeur qui varie : capteur analogique.', draw: d('Afficher la température d’une salle', 'valeur en °C') },
    { name: 'Régler la vitesse selon la distance à l’obstacle', cat: 1, why: 'Il faut la mesure, pas seulement « proche ou loin ».', draw: d('Régler la vitesse selon la distance', 'valeur en cm') },
    { name: 'Savoir si une porte est fermée', cat: 0, why: 'Deux états : détecteur TOR.', draw: d('Savoir si une porte est fermée', 'ouverte / fermée') },
    { name: 'Indiquer le niveau d’eau d’un réservoir en %', cat: 1, why: 'Une grandeur continue : mesure analogique.', draw: d('Niveau d’eau d’un réservoir', 'de 0 à 100 %') }
  ], ['Détecteur (tout ou rien)', 'Capteur (mesure)'], 'Faut-il une décision oui/non ou une valeur ?');
}

var ALGO = { nuit: 1, pres: 1, i: 0, path: [], run: false };
function algoPas(el) {
  var Z = ALGO, svg = ui.stage(el, 400, 260, 'Algorithme : éclairage automatique, pas à pas'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), ctl = ui.controls(el), t = 0;
  Z.nuit = 1; Z.pres = 1; Z.i = 0; Z.run = false;
  function path() { return Z.nuit ? (Z.pres ? [0, 1, 2, 3, 5] : [0, 1, 2, 3, 6]) : [0, 1, 2, 4]; }
  function reset() { Z.i = 0; Z.run = false; paint(); }
  ui.tabs(el, [['0', 'Il fait jour'], ['1', 'Il fait nuit']], function (k) { Z.nuit = +k; reset(); });
  ui.tabs(el, [['0', 'Personne'], ['1', 'Présence']], function (k) { Z.pres = +k; reset(); });
  ui.btn(ctl, 'Pas suivant', function () { var p = path(); if (Z.i < p.length - 1) Z.i++; paint(); });
  ui.btn(ctl, 'Recommencer', reset);
  var TXT = ['On démarre le programme.', 'On <b>lit</b> les deux capteurs et on mémorise leurs valeurs.', 'Test : <b>nuit = ' + 1 + ' ?</b>', 'Test : <b>présence = 1 ?</b>', 'Il fait jour : <b>éteindre</b> la lampe.', 'Nuit et présence : <b>allumer</b> la lampe.', 'Personne : <b>éteindre</b> la lampe.'];
  function paint() { var p = path(), id = p[Z.i]; info.set(TXT[id].replace('nuit = 1 ?', 'nuit = 1 ?')); chips.set(ui.chip('nuit = ' + Z.nuit, BLUE) + ui.chip('présence = ' + Z.pres, BLUE) + ui.chip('étape ' + (Z.i + 1) + '/' + p.length, AMBER)); }
  var N = [[110, 20, 'DÉBUT', 'o'], [110, 56, 'Lire les capteurs', 'r'], [110, 100, 'nuit = 1 ?', 'd'], [110, 164, 'présence = 1 ?', 'd'], [290, 100, 'Éteindre', 'r'], [290, 164, 'Allumer', 'r'], [110, 232, 'Éteindre', 'r']];
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var p = path(), seen = p.slice(0, Z.i + 1), cur = p[Z.i];
    function lk(a, b, lab) { var A = N[a], B = N[b], on = seen.indexOf(a) >= 0 && seen.indexOf(b) >= 0; ln(dyn, A[0], A[1] + (A[2].indexOf('?') > 0 ? 24 : 12), B[0], B[1] - 12, on ? AMBER : '#2a4660', 2); }
    ln(dyn, 110, 32, 110, 44, seen.indexOf(1) >= 0 ? AMBER : '#2a4660', 2); ln(dyn, 110, 68, 110, 76, seen.indexOf(2) >= 0 ? AMBER : '#2a4660', 2);
    ln(dyn, 110, 124, 110, 140, seen.indexOf(3) >= 0 ? AMBER : '#2a4660', 2); txt(dyn, 120, 134, 'oui', '#9fb8cc', 'start', 8.5);
    ln(dyn, 146, 100, 254, 100, seen.indexOf(4) >= 0 ? AMBER : '#2a4660', 2); txt(dyn, 200, 94, 'non', '#9fb8cc', 'middle', 8.5);
    ln(dyn, 164, 164, 254, 164, seen.indexOf(5) >= 0 ? AMBER : '#2a4660', 2); txt(dyn, 210, 158, 'oui', '#9fb8cc', 'middle', 8.5);
    ln(dyn, 110, 188, 110, 220, seen.indexOf(6) >= 0 ? AMBER : '#2a4660', 2); txt(dyn, 120, 206, 'non', '#9fb8cc', 'start', 8.5);
    N.forEach(function (n, i) {
      var on = i === cur, vis = seen.indexOf(i) >= 0, c = on ? AMBER : (vis ? GREEN : WIRE), x = n[0], y = n[1];
      if (n[3] === 'd') S('path', { d: 'M' + (x - 54) + ' ' + y + 'L' + x + ' ' + (y - 24) + 'L' + (x + 54) + ' ' + y + 'L' + x + ' ' + (y + 24) + 'Z', style: 'fill:' + c + ';fill-opacity:' + (on ? .3 : .08) + ';stroke:' + c + ';stroke-width:2' }, dyn);
      else S('rect', { x: x - 54, y: y - 12, width: 108, height: 24, rx: n[3] === 'o' ? 12 : 3, style: 'fill:' + c + ';fill-opacity:' + (on ? .3 : .08) + ';stroke:' + c + ';stroke-width:2' }, dyn);
      txt(dyn, x, y + 4, n[2], on ? '#fff' : '#cfe0ee', 'middle', 10, on);
    });
    var res = cur >= 5 ? (cur === 5 ? 1 : 0) : (cur === 4 ? 0 : -1), lampOn = res === 1;
    S('circle', { cx: 350, cy: 40, r: 18, style: 'fill:' + (lampOn ? AMBER : 'none') + ';fill-opacity:.7;stroke:' + (lampOn ? AMBER : WIRE) + ';stroke-width:2.4' }, dyn); if (lampOn) circ(dyn, 350, 40, 26 + Math.sin(t * 6) * 2, AMBER, .15, 0);
    txt(dyn, 350, 74, res === -1 ? 'lampe ?' : (lampOn ? 'lampe ON' : 'lampe OFF'), lampOn ? AMBER : '#9fb8cc', 'middle', 10, true);
    txt(dyn, 290, 230, 'nuit = ' + Z.nuit + ' · présence = ' + Z.pres, '#7e9bb2', 'middle', 10);
  }); paint();
}
function ordreAlgo(el) {
  ordering(el, 'Remettre l’algorithme dans l’ordre', ['Lire le bouton', 'Tester : appuyé ?', 'Allumer la lampe', 'Attendre 5 secondes', 'Éteindre la lampe'], 'Dans quel ordre le programme exécute-t-il ces actions ?');
}
var PG = { a: 0, b: 0 };
function portesLogiques(el) {
  var Z = PG, svg = ui.stage(el, 400, 220, 'Portes logiques ET, OU, NON'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), ctl = ui.controls(el), g = 'et', t = 0;
  Z.a = 0; Z.b = 0;
  ui.tabs(el, [['et', 'ET'], ['ou', 'OU'], ['non', 'NON (A)']], function (k) { g = k; paint(); });
  ui.btn(ctl, 'Basculer A', function () { Z.a ^= 1; paint(); }); ui.btn(ctl, 'Basculer B', function () { Z.b ^= 1; paint(); });
  function out() { return g === 'et' ? (Z.a & Z.b) : (g === 'ou' ? (Z.a | Z.b) : 1 - Z.a); }
  var D = { et: 'ET : la sortie est 1 si A <b>et</b> B valent 1 (deux conditions à la fois).', ou: 'OU : la sortie est 1 si A <b>ou</b> B (au moins un) vaut 1.', non: 'NON : la sortie est l’<b>inverse</b> de A.' };
  function paint() { info.set(D[g]); chips.set(ui.chip('A = ' + Z.a, Z.a ? GREEN : WIRE) + (g === 'non' ? '' : ui.chip('B = ' + Z.b, Z.b ? GREEN : WIRE)) + ui.chip('S = ' + out(), out() ? AMBER : WIRE)); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var o = out(), nb = g !== 'non';
    var cA = Z.a ? AMBER : '#37536b', cB = Z.b ? AMBER : '#37536b', cS = o ? AMBER : '#37536b';
    txt(dyn, 24, nb ? 62 : 108, 'A', '#fff', 'middle', 12, true); if (nb) txt(dyn, 24, 142, 'B', '#fff', 'middle', 12, true);
    wire(dyn, nb ? [[34, 58], [130, 58], [130, 80], [150, 80]] : [[34, 104], [150, 104]], cA, 3); if (nb) wire(dyn, [[34, 138], [130, 138], [130, 120], [150, 120]], cB, 3);
    if (Z.a) flow(dyn, nb ? [[34, 58], [130, 58], [130, 80], [150, 80]] : [[34, 104], [150, 104]], (t * .5) % 1, 6, AMBER, 2.4); if (nb && Z.b) flow(dyn, [[34, 138], [130, 138], [130, 120], [150, 120]], (t * .5) % 1, 6, AMBER, 2.4);
    S('rect', { x: 150, y: 62, width: 90, height: 76, rx: 8, style: 'fill:' + BLUE + ';fill-opacity:.12;stroke:' + BLUE + ';stroke-width:2.4' }, dyn); txt(dyn, 195, 107, g === 'non' ? '1' : (g === 'et' ? '&' : '≥1'), '#fff', 'middle', 22, true);
    wire(dyn, [[240, 100], [300, 100]], cS, 3); if (o) flow(dyn, [[240, 100], [300, 100]], (t * .6) % 1, 4, AMBER, 2.4);
    S('circle', { cx: 330, cy: 100, r: 24, style: 'fill:' + (o ? AMBER : 'none') + ';fill-opacity:.7;stroke:' + (o ? AMBER : WIRE) + ';stroke-width:2.6' }, dyn); if (o) circ(dyn, 330, 100, 34 + Math.sin(t * 6) * 2, AMBER, .12, 0); txt(dyn, 330, 148, o ? 'S = 1 · allumée' : 'S = 0 · éteinte', o ? AMBER : '#9fb8cc', 'middle', 10.5, true);
    var rows = nb ? [[0, 0], [0, 1], [1, 0], [1, 1]] : [[0, 0], [1, 0]];
    txt(dyn, 100, 176, 'A', '#9fb8cc', 'middle', 9.5, true); if (nb) txt(dyn, 140, 176, 'B', '#9fb8cc', 'middle', 9.5, true); txt(dyn, 190, 176, 'S', '#9fb8cc', 'middle', 9.5, true);
    rows.forEach(function (r, i) { var s = g === 'et' ? r[0] & r[1] : (g === 'ou' ? r[0] | r[1] : 1 - r[0]), on = r[0] === Z.a && (!nb || r[1] === Z.b); if (on) S('rect', { x: 84, y: 180 + i * 10 - 1, width: 120, height: 11, style: 'fill:' + AMBER + ';fill-opacity:.2' }, dyn); txt(dyn, 100, 189 + i * 10, r[0] + '', on ? '#fff' : '#7e9bb2', 'middle', 9); if (nb) txt(dyn, 140, 189 + i * 10, r[1] + '', on ? '#fff' : '#7e9bb2', 'middle', 9); txt(dyn, 190, 189 + i * 10, s + '', on ? AMBER : '#7e9bb2', 'middle', 9, on); });
  }); paint();
}

PC.chapter({ id: 't3-2', lazy: true, eyebrow: EY + 'Module 2 · Chaîne d’information', title: 'Acquérir l’information', ar: 'اكتساب المعلومة',
  lessons: function () { return [
    { short: 'Capteur / détecteur', title: 'Signal analogique et logique', intro: 'Règle le seuil : le détecteur transforme la mesure en 0 ou 1.', build: oscilloscope,
      retenir: ['Un <b>capteur</b> donne une valeur qui varie (analogique).', 'Un <b>détecteur</b> compare à un seuil : 0 ou 1 (tout ou rien).'],
      ar: { e: ['اللاقط يعطي قيمة متغيرة، والكاشف يقارنها بعتبة فيعطي 0 أو 1.'], u: 'حرّك العتبة.', w: [['capteur', 'لاقط'], ['détecteur', 'كاشف'], ['seuil', 'عتبة']] } },
    { short: 'Ultrasons', title: 'Mesurer avec un écho', intro: 'Éloigne l’obstacle : le temps d’écho change.', build: echoUltrason,
      retenir: ['Le capteur à ultrasons mesure le <b>temps aller-retour</b> du son.', 'd = v × t ÷ 2, avec v ≈ 340 m/s dans l’air.'],
      ar: { e: ['حساس الموجات فوق الصوتية يقيس زمن ذهاب الصوت وإيابه ثم يحسب المسافة.'], u: 'غيّر المسافة.', w: [['ultrasons', 'موجات فوق صوتية'], ['écho', 'صدى']] } },
    { short: 'Choisir', title: 'Choisir le bon capteur', intro: 'Décision oui/non ou mesure ?', build: choixCapteur,
      retenir: ['Décision simple : <b>détecteur</b>.', 'Valeur à afficher ou à régler : <b>capteur</b>.'],
      ar: { e: ['قرار بسيط نستعمل كاشفا، وقيمة متغيرة نستعمل لاقطا.'], u: 'اختر.', w: [['tout ou rien', 'كل شيء أو لا شيء']] } }
  ]; },
  quiz: [
    { q: 'Un détecteur fournit :', o: ['un signal 0 ou 1', 'toujours une mesure en °C', 'une énergie'], a: 0, e: 'Il compare à un seuil.' },
    { q: 'Un capteur ultrasons mesure :', o: ['le temps aller-retour d’un son', 'la couleur', 'la masse'], a: 0, e: 'Puis il calcule d = v × t ÷ 2.' },
    { q: 'Un écho met 5,8 ms pour revenir. La distance vaut (v = 340 m/s) :', o: ['environ 1 m', 'environ 2 m', 'environ 10 cm'], a: 0, e: 'd = 340 × 0,0058 ÷ 2 ≈ 0,99 m.' },
    { q: 'Pour afficher une température, on utilise :', o: ['un capteur', 'un bouton', 'un relais'], a: 0, e: 'Il faut une valeur variable.' }
  ]
});

PC.chapter({ id: 't3-3', lazy: true, eyebrow: EY + 'Module 2 · Chaîne d’information', title: 'Traiter l’information', ar: 'معالجة المعلومة',
  lessons: function () { return [
    { short: 'Algorithme', title: 'Un algorithme pas à pas', intro: 'Change les capteurs et suis le chemin du programme.', build: algoPas,
      retenir: ['Un <b>algorithme</b> est une suite ordonnée d’instructions.', 'Un test « si… alors… sinon » choisit un chemin.'],
      ar: { e: ['الخوارزمية سلسلة مرتبة من التعليمات، والاختبار «إذا» يختار المسار.'], u: 'تابع الخطوات.', w: [['algorithme', 'خوارزمية'], ['test', 'اختبار']] } },
    { short: 'Ordre', title: 'Ordonner les instructions', intro: 'Un programme se lit de haut en bas.', build: ordreAlgo,
      retenir: ['L’<b>ordre</b> des instructions change le résultat.', 'On teste avant d’agir.'],
      ar: { e: ['ترتيب التعليمات يغيّر النتيجة، ونختبر قبل أن نفعل.'], u: 'رتّب.', w: [['instruction', 'تعليمة']] } },
    { short: 'Portes logiques', title: 'ET, OU, NON', intro: 'Bascule A et B et observe la sortie S.', build: portesLogiques,
      retenir: ['<b>ET</b> : toutes les conditions. <b>OU</b> : au moins une.', '<b>NON</b> inverse l’entrée.'],
      ar: { e: ['و: كل الشروط، أو: شرط واحد على الأقل، لا: عكس المدخل.'], u: 'بدّل A و B.', w: [['porte logique', 'بوابة منطقية']] } },
    { short: 'Arduino', title: 'Programme et chronogramme', intro: 'Modifie la durée et lis le signal.', build: chronogramme,
      retenir: ['Une <b>carte programmable</b> répète sa boucle sans fin.', 'Un <b>chronogramme</b> montre les niveaux dans le temps.'],
      ar: { e: ['البطاقة المبرمجة تكرّر حلقتها، والمخطط الزمني يبيّن المستويات عبر الزمن.'], u: 'غيّر المدة.', w: [['chronogramme', 'مخطط زمني']] } }
  ]; },
  quiz: [
    { q: 'Un algorithme est :', o: ['une suite ordonnée d’instructions', 'un composant', 'une pile'], a: 0, e: 'Il décrit le traitement.' },
    { q: 'A = 1 et B = 0 : la sortie d’une porte ET vaut :', o: ['0', '1', '2'], a: 0, e: 'ET exige A et B égaux à 1.' },
    { q: 'A = 1 et B = 0 : la sortie d’une porte OU vaut :', o: ['1', '0', '2'], a: 0, e: 'Un seul 1 suffit.' },
    { q: 'La porte NON appliquée à 0 donne :', o: ['1', '0', '2'], a: 0, e: 'Elle inverse.' }
  ]
});

function coderMessage(el) {
  var svg = ui.stage(el, 400, 200, 'Coder une information en bits'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), ctl = ui.controls(el);
  var B = [0, 1, 0, 0, 0, 0, 0, 1];
  function val() { return B.reduce(function (a, b) { return a * 2 + b; }, 0); }
  function draw() {
    dyn.replaceChildren();
    B.forEach(function (b, i) { var x = 40 + i * 40, w = 128 >> i; var c = b ? AMBER : WIRE; S('rect', { x: x - 16, y: 60, width: 32, height: 44, rx: 5, style: 'fill:' + c + ';fill-opacity:' + (b ? .3 : .06) + ';stroke:' + c + ';stroke-width:2.2' }, dyn); txt(dyn, x, 90, b + '', b ? '#fff' : '#7e9bb2', 'middle', 22, true); txt(dyn, x, 124, w + '', '#7e9bb2', 'middle', 10); var hit = S('rect', { x: x - 16, y: 60, width: 32, height: 44, style: 'fill:transparent' }, dyn); hot(hit, function () { B[i] ^= 1; draw(); }, 'Bit ' + (i + 1)); });
    var v = val(); txt(dyn, 200, 36, 'Touche un bit pour le changer', '#9fb8cc', 'middle', 11); txt(dyn, 200, 160, 'valeur = ' + v, AMBER, 'middle', 16, true);
    var ch = v >= 33 && v < 127 ? String.fromCharCode(v) : '·'; S('rect', { x: 330, y: 70, width: 50, height: 70, rx: 6, style: 'fill:' + BLUE + ';fill-opacity:.15;stroke:' + BLUE + ';stroke-width:2' }, dyn); txt(dyn, 355, 116, ch, '#fff', 'middle', 34, true); txt(dyn, 355, 62, 'lettre', BLUE, 'middle', 9.5);
    chips.set(ui.chip('octet : ' + B.join(''), AMBER) + ui.chip('code ' + v, BLUE)); info.set('Un <b>octet</b> (8 bits) code un nombre de 0 à 255. En code ASCII, ce nombre peut représenter une lettre.');
  }
  ui.btn(ctl, 'Écrire « A »', function () { B = [0, 1, 0, 0, 0, 0, 0, 1]; draw(); }); ui.btn(ctl, 'Écrire « a »', function () { B = [0, 1, 1, 0, 0, 0, 0, 1]; draw(); }); ui.btn(ctl, 'Tout à 0', function () { B = [0, 0, 0, 0, 0, 0, 0, 0]; draw(); });
  draw();
}
function visuelSonore(el) {
  var d = function (n, s) { return function (g) { rect(g, 30, 28, 340, 80, AMBER, .08, 4, 1.8); txt(g, 200, 62, n, '#fff', 'middle', 15, true); txt(g, 200, 90, s, '#9fb8cc', 'middle', 11); }; };
  classify(el, 'Quel sens reçoit le message ?', [
    { name: 'Feu tricolore', cat: 0, why: 'Signal lumineux : on le voit.', draw: d('Feu tricolore', 'rouge · orange · vert') },
    { name: 'Sirène d’ambulance', cat: 1, why: 'Signal sonore : on l’entend.', draw: d('Sirène d’ambulance', 'sons') },
    { name: 'Écran de smartphone', cat: 0, why: 'Message visuel.', draw: d('Écran de smartphone', 'texte et images') },
    { name: 'Sonnerie de réveil', cat: 1, why: 'Signal sonore.', draw: d('Sonnerie de réveil', 'bip') },
    { name: 'Voyant « batterie faible »', cat: 0, why: 'Signal lumineux.', draw: d('Voyant « batterie faible »', 'LED') },
    { name: 'Bip de recul d’un camion', cat: 1, why: 'Alerte sonore.', draw: d('Bip de recul d’un camion', 'bip') }
  ], ['Visuel', 'Sonore'], 'On le voit ou on l’entend ?');
}
function roleBlocs(el) {
  var d = function (n) { return function (g) { rect(g, 40, 40, 320, 60, BLUE, .08, 4, 1.8); txt(g, 200, 78, n, '#fff', 'middle', 15, true); }; };
  classify(el, 'Dans quelle fonction se trouve ce composant ?', [
    { name: 'Capteur de température', cat: 0, why: 'Il acquiert l’information.', draw: d('Capteur de température') },
    { name: 'Bouton-poussoir', cat: 0, why: 'Il acquiert un ordre de l’utilisateur.', draw: d('Bouton-poussoir') },
    { name: 'Carte Arduino', cat: 1, why: 'Elle traite l’information.', draw: d('Carte Arduino') },
    { name: 'Microcontrôleur', cat: 1, why: 'Il exécute le programme.', draw: d('Microcontrôleur') },
    { name: 'Afficheur LCD', cat: 2, why: 'Il communique le résultat à l’utilisateur.', draw: d('Afficheur LCD') },
    { name: 'Buzzer', cat: 2, why: 'Il communique par un son.', draw: d('Buzzer') },
    { name: 'Module Bluetooth', cat: 2, why: 'Il transmet l’information à distance.', draw: d('Module Bluetooth') },
    { name: 'Capteur ultrasons', cat: 0, why: 'Il acquiert la distance.', draw: d('Capteur ultrasons') }
  ], ['Acquérir', 'Traiter', 'Communiquer'], 'Acquérir, traiter ou communiquer ?');
}
PC.chapter({ id: 't3-4', lazy: true, eyebrow: EY + 'Module 2 · Chaîne d’information', title: 'Communiquer l’information', ar: 'تبليغ المعلومة',
  lessons: function () { return [
    { short: 'Propagation', title: 'Câblée, infrarouge ou radio', intro: 'Éloigne le récepteur, ajoute un mur : que devient le message ?', build: propagationMessage,
      retenir: ['Câblé : fiable. Infrarouge : vue directe. Radio : traverse les murs mais s’affaiblit.', 'Le signal faiblit avec la distance.'],
      ar: { e: ['السلكي موثوق، والأشعة تحت الحمراء تحتاج رؤية مباشرة، والراديو يخترق الجدران ويضعف مع المسافة.'], u: 'غيّر الوسيلة.', w: [['émetteur', 'مرسل'], ['récepteur', 'مستقبل']] } },
    { short: 'Bits', title: 'Coder un message', intro: 'Allume des bits et lis la lettre.', build: coderMessage,
      retenir: ['L’information numérique est codée en <b>bits</b> (0 ou 1).', '8 bits = 1 <b>octet</b>.'],
      ar: { e: ['المعلومة الرقمية تُشفَّر ببتات 0 أو 1، وثمانية بتات تعطي بايت.'], u: 'غيّر البتات.', w: [['bit', 'بت'], ['octet', 'بايت']] } },
    { short: 'Visuel / sonore', title: 'Signaux visuels et sonores', intro: 'Quel sens reçoit le message ?', build: visuelSonore,
      retenir: ['Un message peut être <b>visuel</b> (LED, écran) ou <b>sonore</b> (buzzer).', 'On choisit selon l’environnement.'],
      ar: { e: ['قد تكون الرسالة بصرية أو سمعية حسب المحيط.'], u: 'صنّف.', w: [['visuel', 'بصري'], ['sonore', 'سمعي']] } },
    { short: 'Les trois fonctions', title: 'Acquérir · traiter · communiquer', intro: 'Place chaque composant dans sa fonction.', build: roleBlocs,
      retenir: ['<b>Acquérir</b> : capteurs, boutons.', '<b>Traiter</b> : carte programmable.', '<b>Communiquer</b> : afficheur, buzzer, module radio.'],
      ar: { e: ['اكتساب: لواقط وأزرار. معالجة: بطاقة مبرمجة. تبليغ: شاشة وجرس ووحدة راديو.'], u: 'صنّف.', w: [['acquérir', 'اكتساب'], ['traiter', 'معالجة'], ['communiquer', 'تبليغ']] } }
  ]; },
  quiz: [
    { q: 'Un octet contient :', o: ['8 bits', '4 bits', '16 bits'], a: 0, e: '1 octet = 8 bits.' },
    { q: 'Un buzzer sert à :', o: ['communiquer par le son', 'acquérir une distance', 'traiter un programme'], a: 0, e: 'Il fait partie de « Communiquer ».' },
    { q: 'La liaison infrarouge exige :', o: ['une vue directe', 'un fil', 'une pile'], a: 0, e: 'Un mur la bloque.' },
    { q: 'La carte programmable réalise la fonction :', o: ['traiter', 'acquérir', 'communiquer'], a: 0, e: 'Elle exécute l’algorithme.' }
  ]
});
