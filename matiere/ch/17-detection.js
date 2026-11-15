/* ===================================================== 2AC · t2-7 DÉTECTION */
function ldrLesson(el) {
  var svg = ui.stage(el, 400, 200, 'Lampe qui s’allume la nuit'), dyn = S('g', null, svg), info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el);
  var L = 80, t = 0;
  ui.slider(el, { label: 'Éclairement', min: 0, max: 100, value: 80, step: 1, color: AMBER, fmt: function (v) { return v + ' %'; } }, function (v) { L = v; calc(); });
  function R() { return Math.pow(10, 6 - 4 * L / 100); }
  function calc() { var night = L < 30; chips.set(ui.chip('R = ' + fmtR(Math.round(R() / 10) * 10 || 10), AMBER) + ui.chip(night ? 'nuit' : 'jour', night ? BLUE : GREEN)); verd.set(night ? 'Il fait sombre : la lampe s’allume.' : 'Il fait clair : la lampe reste éteinte.', night ? 'ok' : ''); info.set('Plus il y a de lumière, plus la résistance <b>diminue</b>.'); }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); t += dt; var night = L < 30, k = L / 100;
    circ(dyn, 60, 60, 20 + 4 * Math.sin(t * 3) * k, night ? '#9fb8cc' : AMBER, .25 + .5 * k, 2);
    if (k > .15) for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4 + t * .4; ln(dyn, 60 + Math.cos(a) * 28, 60 + Math.sin(a) * 28, 60 + Math.cos(a) * (28 + 14 * k), 60 + Math.sin(a) * (28 + 14 * k), AMBER, 2); }
    txt(dyn, 60, 105, night ? 'nuit' : 'jour', '#9fb8cc', 'middle', 10);
    sLdr(dyn, 170, 60, 'photorésistance', 64); txt(dyn, 170, 100, fmtR(Math.round(R() / 10) * 10 || 10), AMBER, 'middle', 10, true);
    arrow(dyn, 206, 60, 246, 60, 'rgba(255,255,255,.4)', 1.5); sLamp(dyn, 290, 60, night ? 1 : 0, 'lampe', 60);
    ln(dyn, 40, 160, 360, 160, '#2a4660', 2); var x = 40 + 320 * L / 100; ln(dyn, 40 + 320 * .3, 150, 40 + 320 * .3, 170, RED, 2, '3 3'); txt(dyn, 40 + 320 * .3, 184, 'seuil 30 %', RED, 'middle', 9);
    circ(dyn, x, 160, 6, AMBER, 1, 0); txt(dyn, 40, 148, 'sombre', '#7e9bb2', 'start', 9); txt(dyn, 360, 148, 'clair', '#7e9bb2', 'end', 9);
  });
  calc();
}
function thermLesson(el) {
  var svg = ui.stage(el, 400, 200, 'Ventilateur commandé par la température'), dyn = S('g', null, svg), info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el);
  var T = 25, t = 0, ang = 0;
  ui.slider(el, { label: 'Température', min: 0, max: 100, value: 25, step: 1, color: RED, fmt: function (v) { return v + ' °C'; } }, function (v) { T = v; calc(); });
  function Rt() { return 10000 * Math.exp(3950 * (1 / (T + 273.15) - 1 / 298.15)); }
  function calc() { var hot = T >= 40; chips.set(ui.chip('R = ' + fmtR(Math.round(Rt())), AMBER) + ui.chip(hot ? 'seuil 40 °C dépassé' : 'sous le seuil', hot ? RED : GREEN)); verd.set(hot ? 'Trop chaud : le ventilateur démarre.' : 'Température normale : ventilateur à l’arrêt.', hot ? 'ok' : ''); info.set('Une <b>thermistance CTN</b> : sa résistance <b>diminue</b> quand la température augmente.'); }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); t += dt; var hot = T >= 40; if (hot) ang += dt * 12;
    S('rect', { x: 52, y: 20, width: 16, height: 120, rx: 8, style: 'fill:none;stroke:' + WIRE + ';stroke-width:2.5' }, dyn); circ(dyn, 60, 150, 14, RED, .6, 2.5);
    var h = 4 + 112 * T / 100; S('rect', { x: 55, y: 140 - h + 8, width: 10, height: h, style: 'fill:' + RED }, dyn); txt(dyn, 90, 150, T + ' °C', RED, 'start', 12, true);
    sRes(dyn, 175, 80, 'CTN', 60); arrow(dyn, 215, 80, 250, 80, 'rgba(255,255,255,.4)', 1.5);
    circ(dyn, 310, 80, 40, hot ? BLUE : WIRE, .06, 2); for (var i = 0; i < 3; i++) { var a = ang + i * 2.094; S('path', { d: 'M310 80Q' + (310 + Math.cos(a - .5) * 30) + ' ' + (80 + Math.sin(a - .5) * 30) + ' ' + (310 + Math.cos(a) * 34) + ' ' + (80 + Math.sin(a) * 34), style: 'fill:none;stroke:' + (hot ? BLUE : WIRE) + ';stroke-width:6;stroke-linecap:round' }, dyn); }
    txt(dyn, 310, 140, 'ventilateur', '#9fb8cc', 'middle', 10);
  });
  calc();
}
function capteursTor(el) {
  classify(el, 'Capteur tout ou rien ou analogique', [
    { name: 'Bouton-poussoir', cat: 0, why: 'Deux états seulement : appuyé ou non.' },
    { name: 'Détecteur de présence', cat: 0, why: 'Présence ou absence : tout ou rien.' },
    { name: 'Photorésistance', cat: 1, why: 'Sa valeur varie progressivement avec la lumière.' },
    { name: 'Thermistance', cat: 1, why: 'Sa valeur varie avec la température.' },
    { name: 'Fin de course', cat: 0, why: 'Contact fermé ou ouvert.' },
    { name: 'Potentiomètre', cat: 1, why: 'Valeur continue selon la position.' }
  ], ['Tout ou rien', 'Analogique'], 'Quel type de signal ce capteur donne-t-il ?');
}
PC.chapter({ id: 't2-7', lazy: true, eyebrow: EY2 + 'Module 2 · Fonctions techniques', title: 'La fonction « Détection »', ar: 'وظيفة الكشف',
  lessons: function () { return [
    { short: 'Lumière', title: 'La photorésistance', intro: 'Fais passer le jour à la nuit.', build: ldrLesson,
      retenir: ['La <b>photorésistance</b> (LDR) détecte la lumière.', 'Plus il y a de lumière, plus sa résistance baisse.'],
      ar: { e: ['المقاومة الضوئية تكشف الضوء: كلما زادت الإضاءة قلّت مقاومتها.'], u: 'غيّر الإضاءة.', w: [['photorésistance', 'مقاومة ضوئية'], ['éclairement', 'إضاءة']] } },
    { short: 'Température', title: 'La thermistance', intro: 'Chauffe jusqu’au seuil.', build: thermLesson,
      retenir: ['La <b>thermistance CTN</b> détecte la température.', 'Sa résistance baisse quand il fait plus chaud.'],
      ar: { e: ['المقاومة الحرارية CTN تكشف الحرارة: تنقص مقاومتها عند الارتفاع.'], u: 'غيّر الحرارة.', w: [['thermistance', 'مقاومة حرارية'], ['seuil', 'عتبة']] } },
    { short: 'Types', title: 'Types de capteurs', intro: 'Tout ou rien ou analogique ?', build: capteursTor,
      retenir: ['<b>Tout ou rien</b> : deux états.', '<b>Analogique</b> : valeur qui varie progressivement.'],
      ar: { e: ['لاقط الكل أو لا شيء له حالتان، أما التناظري فقيمته متغيّرة.'], u: 'صنّف اللاقط.', w: [['capteur', 'لاقط'], ['analogique', 'تناظري']] } }
  ]; },
  quiz: [
    { q: 'Quand la lumière augmente, la résistance d’une LDR :', o: ['diminue', 'augmente', 'ne change pas'], a: 0, e: 'C’est le principe de la photorésistance.' },
    { q: 'Quand la température monte, une CTN :', o: ['diminue sa résistance', 'augmente sa résistance', 'produit de la lumière'], a: 0, e: 'CTN : coefficient de température négatif.' },
    { q: 'Un bouton-poussoir est un capteur :', o: ['tout ou rien', 'analogique', 'sonore'], a: 0, e: 'Deux états seulement.' },
    { q: 'Quelle fonction réalise une LDR ?', o: ['détection', 'alimentation', 'signalisation'], a: 0, e: 'Elle détecte la lumière.' }
  ]
});
