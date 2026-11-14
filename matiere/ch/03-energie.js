/* ===================================================== 5. ALIMENTER */
function symPile(g, x, y, c) {
  ln(g, x, y - 60, x, y - 6, c, 2.5); ln(g, x - 18, y - 6, x + 18, y - 6, c, 3.5); ln(g, x - 10, y + 6, x + 10, y + 6, c, 3.5); ln(g, x, y + 6, x, y + 60, c, 2.5);
  txt(g, x + 26, y - 8, '+', c, 'start', 15, true); txt(g, x + 26, y + 16, '−', c, 'start', 15, true);
}
function circuit(el) {
  var svg = ui.stage(el, 400, 230, 'Schéma électronique : pile, interrupteur, lampe'), g = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el);
  var closed = false, WIRE = 'rgba(255,255,255,.85)';
  ln(g, 70, 50, 160, 50, WIRE, 2.5); ln(g, 240, 50, 330, 50, WIRE, 2.5);
  ln(g, 330, 50, 330, 92, WIRE, 2.5); ln(g, 330, 128, 330, 170, WIRE, 2.5); ln(g, 330, 170, 70, 170, WIRE, 2.5);
  ln(g, 70, 50, 70, 54, WIRE, 2.5); ln(g, 70, 170, 70, 166, WIRE, 2.5);
  symPile(g, 70, 110, WIRE);
  var lampG = S('g', null, g), swG = S('g', null, g), dots = S('g', null, g);
  var D = {
    pile: ['Source d’énergie (pile)', P, 'Elle fournit l’énergie électrique en courant continu (CC). Le côté long est la borne +.'],
    inter: ['Interrupteur', GOLD, 'Il ouvre ou ferme le circuit. Ouvert, le courant ne passe pas.'],
    lampe: ['Lampe', C, 'Elle transforme l’énergie électrique en lumière (et un peu de chaleur).']
  };
  function hit(x, y, w, hh, k) {
    var r = S('rect', { x: x, y: y, width: w, height: hh, style: 'fill:transparent;cursor:pointer' }, svg);
    r.addEventListener('click', function () { say(k); });
  }
  function say(k) { var d = D[k]; info.set('<b>' + d[0] + '.</b> ' + d[2]); }
  function draw() {
    lampG.replaceChildren(); swG.replaceChildren();
    circ(lampG, 330, 110, 18, C, closed ? .85 : .12, 3); ln(lampG, 318, 98, 342, 122, closed ? '#fff' : WIRE, 2.5); ln(lampG, 342, 98, 318, 122, closed ? '#fff' : WIRE, 2.5);
    circ(swG, 160, 50, 4, GOLD, 1, 1); circ(swG, 240, 50, 4, GOLD, 1, 1);
    if (closed) ln(swG, 160, 50, 240, 50, GOLD, 3); else ln(swG, 160, 50, 232, 22, GOLD, 3);
    chips.set(ui.chip(closed ? 'Circuit fermé : le courant circule' : 'Circuit ouvert : pas de courant', closed ? T : C));
  }
  txt(g, 52, 114, 'pile', P, 'end', 11); txt(g, 200, 78, 'interrupteur', GOLD, 'middle', 11); txt(g, 296, 150, 'lampe', C, 'end', 11);
  hit(40, 70, 80, 80, 'pile'); hit(150, 10, 100, 60, 'inter'); hit(300, 82, 60, 56, 'lampe');
  var path = follower([[70, 106], [70, 50], [330, 50], [330, 170], [70, 170], [70, 114]]), t0 = 0;
  PC.anim(svg, function (dt) {
    dots.replaceChildren(); if (!closed) return; t0 += dt * .22;
    for (var i = 0; i < 14; i++) { var p = path.at(((t0 + i / 14) % 1)); circ(dots, p.x, p.y, 3.2, GOLD, 1, 0); }
  });
  var ctl = ui.controls(el);
  var b = ui.btn(ctl, 'Fermer l’interrupteur', function () { closed = !closed; b.textContent = closed ? 'Ouvrir l’interrupteur' : 'Fermer l’interrupteur'; draw(); });
  info.set('Touche un composant du schéma pour lire son rôle. Le schéma utilise des <b>symboles normalisés</b>.');
  draw();
}

function autonomie(el) {
  var svg = ui.stage(el, 400, 200, 'Autonomie d’une source d’alimentation'), g = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el), verd = ui.verdict(el);
  rect(g, 30, 60, 150, 90, 'rgba(255,255,255,1)', .05, 12, 2.5); rect(g, 180, 90, 12, 30, 'rgba(255,255,255,1)', .5, 3, 0);
  var lvl = S('rect', { x: 36, y: 66, width: 138, height: 78, rx: 8, style: 'fill:' + T + ';fill-opacity:.7' }, g);
  var pct = txt(g, 105, 112, '100 %', INK, 'middle', 22, true);
  arrow(g, 200, 105, 246, 105, C);
  block(g, 250, 78, 130, 54, 'Consommation\ndu système', C, 12);
  var tm = txt(g, 200, 184, '', INK, 'middle', 12);
  var SRC = { p15: ['Pile 1,5 V', 1.5, 2500], p9: ['Pile 9 V', 9, 500], li: ['Batterie 3,7 V', 3.7, 3000], pb: ['Batterie 12 V', 12, 7000] };
  var cur = 'p15';
  var sc = ui.slider(el, { label: 'Capacité', min: 500, max: 8000, value: 2500, step: 100, color: T, fmt: function (v) { return v + ' mAh'; } }, calc);
  var si = ui.slider(el, { label: 'Courant consommé', min: 20, max: 1000, value: 250, step: 10, color: C, fmt: function (v) { return v + ' mA'; } }, calc);
  var t = 0, auto = 10;
  function calc() {
    var cap = sc.get(), i = si.get(); auto = cap / i; var S0 = SRC[cur];
    chips.set(ui.chip('U = ' + fm(S0[1], 1) + ' V', P) + ui.chip('I = ' + i + ' mA', C) + ui.chip('Autonomie ≈ ' + fm(auto, 1) + ' h' + (auto >= 48 ? ' (' + fm(auto / 24, 1) + ' jours)' : ''), T));
    info.set('<b>Autonomie = capacité ÷ courant.</b> ' + cap + ' mAh ÷ ' + i + ' mA = ' + fm(auto, 1) + ' h. Valeurs de capacité indicatives pour ' + S0[0].toLowerCase() + '.');
    verd.set(auto < 5 ? 'Autonomie courte : choisis une batterie plus grande ou réduis la consommation.' : 'Autonomie correcte pour cette consommation.', auto < 5 ? '' : 'ok');
  }
  ui.tabs(el, Object.keys(SRC).map(function (k) { return [k, SRC[k][0]]; }), function (k) { cur = k; sc.set(SRC[k][2]); calc(); });
  calc();
  PC.anim(svg, function (dt) {
    t += dt / (4 + Math.min(auto, 40) / 5); if (t > 1.15) t = 0;
    var f = clamp(1 - t, 0, 1);
    lvl.setAttribute('width', 138 * f); lvl.style.fillOpacity = f < .2 ? .75 : .7; lvl.style.fill = f < .2 ? 'var(--coral)' : 'var(--teal)';
    pct.textContent = Math.round(f * 100) + ' %'; tm.textContent = 'Temps écoulé : ' + fm((1 - f) * auto, 1) + ' h sur ' + fm(auto, 1) + ' h';
  });
}

PC.chapter({ id: 't3-5', lazy: true, eyebrow: EY + 'Module 3 · Chaîne d’énergie', title: 'La fonction « Alimenter »', ar: 'الوظيفة «التزويد بالطاقة»',
  lessons: function () { return [
    { short: 'Schéma électronique', title: 'Lire un schéma électronique', intro: 'Ferme l’interrupteur puis touche chaque composant pour lire son rôle.', build: circuit,
      retenir: ['Un <b>schéma électronique</b> représente un circuit avec des symboles normalisés.', 'La fonction <b>Alimenter</b> fournit au système l’énergie dont il a besoin : ici une pile ou une batterie, en courant continu (CC).'],
      ar: { e: ['المخطط الإلكتروني يمثّل الدارة برموز معيارية. وظيفة التزويد بالطاقة تمدّ النظام بالطاقة التي يحتاجها، وهنا مولّد تيار مستمر مثل العمود أو البطارية.'], u: 'أغلق القاطع ثم المس كل مكوّن لتقرأ دوره.', w: [['schéma électronique', 'مخطط إلكتروني'], ['pile', 'عمود'], ['batterie', 'بطارية'], ['courant continu', 'تيار مستمر'], ['interrupteur', 'قاطع التيار']] } },
    { short: 'Autonomie', title: 'Caractéristiques d’une source', intro: 'Choisis une source puis règle la capacité et la consommation : observe l’autonomie.', build: autonomie,
      retenir: ['Une source d’alimentation se caractérise par sa <b>tension</b> (V), son <b>courant</b> (A ou mA) et son <b>autonomie</b> (h).', '<b>Autonomie ≈ capacité (mAh) ÷ courant consommé (mA)</b>.'],
      ar: { e: ['تتميّز المصدر الكهربائي بتوتره وشدة التيار الذي يعطيه ومدة اشتغاله (الاستقلالية). الاستقلالية تقريبا = السعة (mAh) ÷ شدة التيار المستهلك (mA).'], u: 'اختر مصدرا ثم غيّر السعة والاستهلاك.', w: [['tension', 'توتر'], ['courant', 'شدة التيار'], ['autonomie', 'استقلالية'], ['capacité', 'سعة']] } }
  ]; },
  quiz: [
    { q: 'Le côté long du symbole d’une pile est la borne :', o: ['+', '−', 'neutre'], a: 0, e: 'Le trait long représente la borne positive.' },
    { q: 'Une batterie de 2 000 mAh alimente un système de 500 mA. Son autonomie est environ :', o: ['4 h', '40 h', '0,25 h'], a: 0, e: '2 000 ÷ 500 = 4 h.' },
    { q: 'La fonction « Alimenter » assure :', o: ['la fourniture d’énergie au système', 'la mesure d’une grandeur', 'la transmission du mouvement'], a: 0, e: 'Elle apporte l’énergie nécessaire.' },
    { q: 'Un circuit ouvert :', o: ['ne laisse pas passer le courant', 'laisse passer le courant', 'augmente la tension'], a: 0, e: 'Le courant ne circule que dans un circuit fermé.' }
  ]
});

/* ===================================================== 6. DISTRIBUER */
function relais(el) {
  var svg = ui.stage(el, 400, 250, 'Un relais électromagnétique commande un moteur'), g = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el);
  var on = false, W = 'rgba(255,255,255,.85)';
  rect(g, 8, 24, 170, 200, P, .07, 14, 1.8); txt(g, 93, 42, 'Commande (5 V)', P, 'middle', 12, true);
  rect(g, 222, 24, 170, 200, C, .07, 14, 1.8); txt(g, 307, 42, 'Puissance (12 V)', C, 'middle', 12, true);
  var dyn = S('g', null, svg), mot = S('g', null, svg);
  ln(g, 30, 70, 30, 190, W, 2.5); ln(g, 30, 190, 150, 190, W, 2.5); ln(g, 150, 190, 150, 150, W, 2.5);
  ln(g, 30, 70, 50, 70, W, 2.5); ln(g, 110, 70, 150, 70, W, 2.5); ln(g, 150, 70, 150, 100, W, 2.5);
  rect(g, 130, 100, 40, 50, GOLD, .25, 6, 2.5); txt(g, 150, 128, 'bobine', GOLD, 'middle', 10, true);
  txt(g, 80, 60, 'bouton poussoir', P, 'middle', 10.5);
  ln(g, 245, 70, 245, 190, W, 2.5); ln(g, 245, 190, 352, 190, W, 2.5); ln(g, 352, 190, 352, 148, W, 2.5); ln(g, 352, 70, 352, 92, W, 2.5);
  ln(g, 245, 70, 262, 70, W, 2.5); ln(g, 322, 70, 352, 70, W, 2.5); txt(g, 292, 60, 'contact du relais', C, 'middle', 10.5);
  circ(g, 352, 120, 28, C, .15, 3);
  ln(g, 172, 125, 220, 125, GOLD, 2.5, '3 4');
  function draw() {
    dyn.replaceChildren();
    circ(dyn, 50, 70, 4, P, 1, 1); circ(dyn, 110, 70, 4, P, 1, 1);
    if (on) ln(dyn, 50, 70, 110, 70, P, 3.5); else ln(dyn, 50, 70, 104, 46, P, 3.5);
    circ(dyn, 262, 70, 4, C, 1, 1); circ(dyn, 322, 70, 4, C, 1, 1);
    if (on) ln(dyn, 262, 70, 322, 70, C, 3.5); else ln(dyn, 262, 70, 316, 46, C, 3.5);
    S('rect', { x: 130, y: 100, width: 40, height: 50, rx: 6, style: 'fill:' + GOLD + ';fill-opacity:' + (on ? .7 : .12) + ';stroke:' + GOLD + ';stroke-width:2.5' }, dyn);
    chips.set(ui.chip(on ? 'Bouton appuyé' : 'Bouton relâché', P) + ui.chip(on ? 'Contact fermé' : 'Contact ouvert', C) + ui.chip(on ? 'Moteur alimenté' : 'Moteur à l’arrêt', on ? T : 'rgba(255,255,255,.4)'));
    info.set(on ? 'Le courant passe dans la <b>bobine</b> : elle devient un électroaimant et ferme le contact. Le moteur reçoit alors l’énergie du circuit de puissance.' : 'Le <b>relais</b> permet à un petit courant de commande de distribuer un courant plus fort vers le moteur. Appuie sur le bouton.');
  }
  var a = 0;
  PC.anim(svg, function (dt) {
    mot.replaceChildren(); if (on) a += dt * 8;
    for (var i = 0; i < 3; i++) { var an = a + i * 2.094; ln(mot, 352, 120, 352 + Math.cos(an) * 22, 120 + Math.sin(an) * 22, on ? '#fff' : 'rgba(255,255,255,.5)', 3); }
    txt(mot, 352, 124, 'M', C, 'middle', 13, true);
  });
  var ctl = ui.controls(el);
  var b = ui.btn(ctl, 'Appuyer sur le bouton', function () { on = !on; b.textContent = on ? 'Relâcher le bouton' : 'Appuyer sur le bouton'; draw(); });
  draw();
}

function transistor(el) {
  var svg = ui.stage(el, 400, 230, 'Un transistor utilisé comme interrupteur'), g = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el), verd = ui.verdict(el);
  var W = 'rgba(255,255,255,.85)';
  txt(g, 215, 12, '+ alimentation', 'rgba(255,255,255,.6)', 'middle', 10.5);
  ln(g, 215, 16, 215, 24, W, 2.5);
  var lamp = circ(g, 215, 42, 17, C, .12, 3); ln(g, 203, 30, 227, 54, W, 2); ln(g, 227, 30, 203, 54, W, 2);
  ln(g, 215, 59, 215, 84, W, 2.5);
  circ(g, 200, 120, 42, 'rgba(255,255,255,1)', .04, 2);
  ln(g, 186, 96, 186, 144, '#fff', 4); ln(g, 100, 120, 186, 120, W, 2.5);
  ln(g, 186, 108, 215, 84, W, 2.5); ln(g, 186, 132, 215, 156, W, 2.5); ln(g, 215, 156, 215, 196, W, 2.5);
  S('path', { d: 'M215 156L204 150L210 146Z', style: 'fill:#fff' }, g);
  ln(g, 200, 196, 230, 196, W, 2.5); ln(g, 207, 202, 223, 202, W, 2.5); ln(g, 213, 208, 217, 208, W, 2.5);
  txt(g, 100, 112, 'base (commande)', P, 'start', 11); txt(g, 236, 78, 'collecteur', 'rgba(255,255,255,.6)', 'start', 10.5); txt(g, 236, 168, 'émetteur', 'rgba(255,255,255,.6)', 'start', 10.5);
  var sl = ui.slider(el, { label: 'Tension de commande', min: 0, max: 2, value: 0.3, step: 0.05, color: P, fmt: function (v) { return fm(v, 2) + ' V'; } }, draw);
  function draw() {
    var v = sl.get(), on = v >= 0.7;
    lamp.setAttribute('style', 'fill:' + C + ';fill-opacity:' + (on ? .9 : .12) + ';stroke:' + C + ';stroke-width:3');
    chips.set(ui.chip('Commande : ' + fm(v, 2) + ' V', P) + ui.chip(on ? 'Transistor saturé' : 'Transistor bloqué', on ? T : C));
    info.set('Un <b>transistor</b> est un interrupteur commandé par une tension. En dessous d’environ 0,7 V, il est <b>bloqué</b> (interrupteur ouvert). Au-dessus, il est <b>saturé</b> (interrupteur fermé) et la lampe s’allume.');
    verd.set(on ? 'Interrupteur fermé : le courant passe dans la lampe.' : 'Interrupteur ouvert : pas de courant dans la lampe.', on ? 'ok' : '');
  }
  draw();
}

function preActionneurs(el) {
  ui.text(el, 'Les <b>pré-actionneurs</b> distribuent l’énergie vers les actionneurs, sur ordre de la partie commande.');
  el.appendChild(h('div', { 'class': 'scroll-x' }, '<table class="tbl"><tr><th>Pré-actionneur</th><th>Rôle</th><th>Commande</th></tr>' +
    '<tr><th>Interrupteur</th><td>Ouvre ou ferme le circuit</td><td>Manuelle, position maintenue</td></tr>' +
    '<tr><th>Bouton poussoir</th><td>Ferme le circuit tant qu’on appuie</td><td>Manuelle, impulsion</td></tr>' +
    '<tr><th>Relais</th><td>Commande un circuit de puissance par un circuit de commande</td><td>Électrique (bobine)</td></tr>' +
    '<tr><th>Transistor</th><td>Interrupteur électronique, rapide et silencieux</td><td>Électrique (tension)</td></tr></table>'));
}

PC.chapter({ id: 't3-6', lazy: true, eyebrow: EY + 'Module 3 · Chaîne d’énergie', title: 'La fonction « Distribuer »', ar: 'الوظيفة «توزيع الطاقة»',
  lessons: function () { return [
    { short: 'Le relais', title: 'Le relais électromagnétique', intro: 'Appuie sur le bouton : observe la bobine, le contact et le moteur.', build: relais,
      retenir: ['La fonction <b>Distribuer</b> envoie l’énergie vers les actionneurs, au bon moment.', 'Le <b>relais</b> permet à un faible courant de commande de commander un circuit de puissance.'],
      ar: { e: ['وظيفة التوزيع توجّه الطاقة نحو المنفّذات في الوقت المناسب. المرحّل (relais) يسمح لتيار ضعيف في دارة التحكم بأن يتحكم في دارة القدرة.'], u: 'اضغط على الزر ولاحظ الملف والملامس والمحرك.', w: [['distribuer', 'توزيع'], ['relais', 'مرحّل'], ['pré-actionneur', 'مُنفِّذ مسبق']] } },
    { short: 'Le transistor', title: 'Le transistor, interrupteur électronique', intro: 'Augmente la tension de commande et regarde l’état du transistor.', build: transistor,
      retenir: ['Le <b>transistor</b> est bloqué sous un seuil de tension (environ 0,7 V) et saturé au-dessus.', 'Bloqué = interrupteur ouvert. Saturé = interrupteur fermé.'],
      ar: { e: ['الترانزستور يشتغل كقاطع إلكتروني: يكون مسدودا إذا كان توتر التحكم أقل من عتبة (حوالي 0,7 فولط) ومشبَعا إذا تجاوزها.'], u: 'حرّك المنزلق وراقب حالة الترانزستور.', w: [['transistor', 'ترانزستور'], ['bloqué', 'مسدود'], ['saturé', 'مشبَع']] } },
    { short: 'Les quatre', title: 'Les pré-actionneurs à connaître', intro: '', build: preActionneurs,
      retenir: ['Interrupteur, bouton poussoir, relais, transistor : quatre solutions pour distribuer l’énergie.'],
      ar: { e: ['المنفِّذات المسبقة أربعة: القاطع والزر الضاغط والمرحّل والترانزستور.'] } }
  ]; },
  quiz: [
    { q: 'Le relais permet de :', o: ['commander un circuit de puissance avec un petit courant', 'mesurer une température', 'stocker de l’énergie'], a: 0, e: 'La bobine ferme un contact dans le circuit de puissance.' },
    { q: 'Un transistor bloqué se comporte comme :', o: ['un interrupteur ouvert', 'un interrupteur fermé', 'une pile'], a: 0, e: 'Aucun courant ne passe.' },
    { q: 'Parmi ces composants, lequel est un pré-actionneur ?', o: ['le relais', 'le moteur', 'la photorésistance'], a: 0, e: 'Le moteur est un actionneur, la photorésistance un capteur.' },
    { q: 'Un bouton poussoir ferme le circuit :', o: ['tant qu’on appuie', 'définitivement', 'jamais'], a: 0, e: 'Dès qu’on relâche, le circuit s’ouvre.' }
  ]
});

/* ===================================================== 7. CONVERTIR */
function actionneurs(el) {
  var svg = ui.stage(el, 400, 230, 'Les actionneurs : convertir l’énergie'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el), ctl = ui.controls(el);
  var cur = 'mcc', st = { v: 6, dir: 1, a: 0, p: 50, ext: 0, tgt: 0, ang: 90, cur: 90 };
  var D = {
    mcc: { t: 'Moteur à courant continu', c: P, e: 'Énergie électrique', s: 'Rotation (énergie mécanique)', d: 'La vitesse dépend de la tension. En inversant la polarité, le sens de rotation s’inverse.' },
    res: { t: 'Résistance chauffante', c: C, e: 'Énergie électrique', s: 'Chaleur (énergie thermique)', d: 'Un fil résistant s’échauffe quand le courant le traverse. Plus la puissance est grande, plus il chauffe.' },
    ver: { t: 'Vérin', c: T, e: 'Air comprimé ou huile sous pression', s: 'Translation (mouvement rectiligne)', d: 'La pression pousse le piston : la tige sort ou rentre selon le côté alimenté.' },
    ser: { t: 'Servomoteur', c: GOLD, e: 'Énergie électrique', s: 'Rotation d’un angle commandé', d: 'On lui indique un angle (0° à 180°) : il se place et maintient cette position.' }
  };
  function show(k) {
    cur = k; var d = D[k]; g.replaceChildren(); ctl.replaceChildren();
    chips.set(ui.chip('Entrée : ' + d.e, d.c) + ui.chip('Sortie : ' + d.s, d.c));
    if (k === 'mcc') {
      ui.slider(ctl, { label: 'Tension', min: 0, max: 12, value: st.v, step: 1, color: P, fmt: function (v) { return v + ' V'; } }, function (v) { st.v = v; });
      ui.btn(ctl, 'Inverser la polarité', function () { st.dir *= -1; });
    } else if (k === 'res') {
      ui.slider(ctl, { label: 'Puissance', min: 0, max: 100, value: st.p, step: 5, color: C, fmt: function (v) { return v + ' %'; } }, function (v) { st.p = v; });
    } else if (k === 'ver') {
      ui.btn(ctl, 'Sortir la tige', function () { st.tgt = 1; }); ui.btn(ctl, 'Rentrer la tige', function () { st.tgt = 0; });
    } else {
      ui.slider(ctl, { label: 'Angle commandé', min: 0, max: 180, value: st.ang, step: 5, color: GOLD, fmt: function (v) { return v + '°'; } }, function (v) { st.ang = v; });
    }
    info.set('<b>' + d.t + '.</b> ' + d.d);
  }
  ui.tabs(el, [['mcc', 'Moteur CC'], ['res', 'Résistance'], ['ver', 'Vérin'], ['ser', 'Servomoteur']], show);
  el.appendChild(ctl);
  show('mcc');
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); var d = D[cur], i;
    if (cur === 'mcc') {
      st.a += dt * st.v * .7 * st.dir; circ(dyn, 200, 110, 62, P, .12, 3); circ(dyn, 200, 110, 8, P, .8, 0);
      for (i = 0; i < 3; i++) { var an = st.a + i * 2.094; ln(dyn, 200, 110, 200 + Math.cos(an) * 56, 110 + Math.sin(an) * 56, P, 5); }
      txt(dyn, 200, 114, 'M', '#fff', 'middle', 13, true); txt(dyn, 200, 200, st.v === 0 ? 'arrêt' : (st.dir > 0 ? 'sens horaire' : 'sens inverse'), P, 'middle', 12);
    } else if (cur === 'res') {
      var f = st.p / 100; rect(dyn, 70, 60, 260, 100, C, .06 + .2 * f, 12, 2.5);
      var pts = []; for (i = 0; i <= 12; i++) pts.push([90 + i * 18.3, 110 + (i % 2 ? -26 : 26)]);
      pathd(dyn, poly(pts), f > .6 ? '#ffd1a0' : C, 5 + f * 2, null);
      rect(dyn, 360, 60, 14, 100, 'rgba(255,255,255,1)', .06, 5, 1.5); S('rect', { x: 362, y: 160 - 96 * f, width: 10, height: 96 * f, rx: 4, style: 'fill:' + C }, dyn);
      txt(dyn, 200, 190, 'chaleur dégagée : ' + Math.round(f * 100) + ' %', C, 'middle', 12);
    } else if (cur === 'ver') {
      st.ext += (st.tgt - st.ext) * Math.min(1, dt * 3);
      rect(dyn, 60, 80, 150, 60, T, .12, 6, 3); var x = 70 + 130 * st.ext * .8;
      S('rect', { x: x, y: 86, width: 14, height: 48, style: 'fill:' + T + ';fill-opacity:.8' }, dyn);
      ln(dyn, x + 14, 110, 210 + 130 * st.ext + 20, 110, '#fff', 8); S('rect', { x: 210 + 130 * st.ext + 20, y: 94, width: 12, height: 32, rx: 3, style: 'fill:#fff;fill-opacity:.9' }, dyn);
      arrow(dyn, 48, 100, 70, 100, T); arrow(dyn, 48, 124, 70, 124, 'rgba(255,255,255,.35)');
      txt(dyn, 135, 168, 'air comprimé', T, 'middle', 11); txt(dyn, 220, 190, st.ext > .5 ? 'tige sortie' : 'tige rentrée', T, 'middle', 12);
    } else {
      st.cur += (st.ang - st.cur) * Math.min(1, dt * 5);
      rect(dyn, 150, 100, 100, 70, GOLD, .15, 8, 3); circ(dyn, 200, 100, 10, GOLD, .8, 0);
      var a = (180 - st.cur) * Math.PI / 180; ln(dyn, 200, 100, 200 + Math.cos(a) * 80, 100 - Math.sin(a) * 80, '#fff', 7);
      pathd(dyn, 'M120 100A80 80 0 0 1 280 100', 'rgba(255,255,255,.25)', 2); txt(dyn, 200, 200, 'angle : ' + Math.round(st.cur) + '°', GOLD, 'middle', 13, true);
    }
  });
}
PC.chapter({ id: 't3-7', lazy: true, eyebrow: EY + 'Module 3 · Chaîne d’énergie', title: 'La fonction « Convertir »', ar: 'الوظيفة «تحويل الطاقة»',
  lessons: function () { return [
    { short: 'Actionneurs', title: 'Les actionneurs', intro: 'Choisis un actionneur, règle sa commande et observe ce qu’il produit à partir de l’énergie reçue.', build: actionneurs,
      retenir: ['La fonction <b>Convertir</b> transforme l’énergie reçue en une autre forme d’énergie : mouvement, chaleur…', 'Les <b>actionneurs</b> : moteur à courant continu, résistance chauffante, vérin, servomoteur.'],
      ar: { e: ['وظيفة التحويل تحوّل الطاقة المتلقاة إلى شكل آخر: حركة أو حرارة. المنفِّذات: محرك التيار المستمر، المقاومة التسخينية، الرافعة (vérin) والمحرك المؤازر (servomoteur).'], u: 'اختر منفِّذا وغيّر أمر التحكم الخاص به.', w: [['convertir', 'تحويل'], ['actionneur', 'منفِّذ'], ['moteur à courant continu', 'محرك التيار المستمر'], ['résistance chauffante', 'مقاومة تسخينية'], ['vérin', 'رافعة'], ['servomoteur', 'محرك مؤازر']] } }
  ]; },
  quiz: [
    { q: 'Une résistance chauffante convertit l’énergie électrique en :', o: ['chaleur', 'mouvement de translation', 'lumière uniquement'], a: 0, e: 'C’est l’effet Joule.' },
    { q: 'Quel actionneur produit un mouvement de translation avec de l’air comprimé ?', o: ['le vérin', 'le moteur CC', 'le servomoteur'], a: 0, e: 'La tige du vérin sort ou rentre.' },
    { q: 'Pour inverser le sens de rotation d’un moteur à courant continu, on :', o: ['inverse la polarité', 'coupe l’alimentation', 'ajoute une résistance'], a: 0, e: 'Le sens dépend du sens du courant.' },
    { q: 'Un servomoteur se commande par :', o: ['un angle', 'une température', 'une pression'], a: 0, e: 'Il se positionne à l’angle demandé.' }
  ]
});

/* ===================================================== 8. TRANSMETTRE */
function transmission(el) {
  var svg = ui.stage(el, 400, 240, 'Transmission du mouvement : rapport de vitesse'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el), verd = ui.verdict(el);
  var cur = 'pc', a1 = 0;
  var KIND = { pc: ['Poulie-courroie', 'Diamètres', 1], ch: ['Chaîne-pignons', 'Nombre de dents', 1], en: ['Engrenage', 'Nombre de dents', -1], rf: ['Roues de friction', 'Diamètres', -1] };
  ui.tabs(el, Object.keys(KIND).map(function (k) { return [k, KIND[k][0]]; }), function (k) { cur = k; s1.refresh(); s2.refresh(); calc(); });
  var s1 = ui.slider(el, { label: 'Roue menante', min: 12, max: 44, value: 20, step: 2, color: P, fmt: function (v) { return v + (cur === 'ch' || cur === 'en' ? ' dents' : ' mm'); } }, calc);
  var s2 = ui.slider(el, { label: 'Roue menée', min: 12, max: 44, value: 36, step: 2, color: T, fmt: function (v) { return v + (cur === 'ch' || cur === 'en' ? ' dents' : ' mm'); } }, calc);
  var sn = ui.slider(el, { label: 'Vitesse menante', min: 10, max: 100, value: 60, step: 10, color: GOLD, fmt: function (v) { return v + ' tr/min'; } }, calc);
  function calc() {
    var d1 = s1.get(), d2 = s2.get(), n1 = sn.get(), n2 = n1 * d1 / d2, r = d1 / d2, K = KIND[cur];
    chips.set(ui.chip('n₂ = ' + fm(n2, 1) + ' tr/min', T) + ui.chip('rapport r = n₂ ÷ n₁ = ' + fm(r, 2), GOLD) + ui.chip(K[2] > 0 ? 'Même sens' : 'Sens inverse', P));
    info.set('<b>' + K[0] + '.</b> ' + (cur === 'pc' ? 'Une courroie relie deux poulies : elles tournent dans le même sens.' : cur === 'ch' ? 'Une chaîne relie deux pignons : ils tournent dans le même sens et ne glissent pas.' : cur === 'en' ? 'Deux roues dentées en contact : elles tournent en sens inverses et ne glissent pas.' : 'Deux roues en contact tournent en sens inverses, mais elles peuvent glisser.') + ' Rapport : <b>n₂ ÷ n₁ = ' + (cur === 'ch' || cur === 'en' ? 'Z₁ ÷ Z₂' : 'D₁ ÷ D₂') + '</b>.');
    verd.set(Math.abs(r - 1) < .01 ? 'Même vitesse : ni réducteur ni multiplicateur.' : (r < 1 ? 'Réducteur de vitesse : la roue menée tourne moins vite.' : 'Multiplicateur de vitesse : la roue menée tourne plus vite.'), r < 1 ? 'ok' : '');
  }
  calc();
  function wheel(x, y, r, ang, c, teeth) {
    circ(dyn, x, y, r, c, .18, 3); circ(dyn, x, y, 4, c, 1, 0);
    if (teeth) S('circle', { cx: x, cy: y, r: r + 4, fill: 'none', style: 'stroke:' + c + ';stroke-width:8;stroke-dasharray:' + (Math.PI * 2 * (r + 4) / (teeth * 2)) + ' ' + (Math.PI * 2 * (r + 4) / (teeth * 2)) + ';stroke-opacity:.7', transform: 'rotate(' + (ang * 180 / Math.PI) + ' ' + x + ' ' + y + ')' }, dyn);
    ln(dyn, x, y, x + Math.cos(ang) * r, y + Math.sin(ang) * r, '#fff', 3);
  }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren();
    var d1 = s1.get(), d2 = s2.get(), n1 = sn.get(), K = KIND[cur], r1 = d1 * 1.6, r2 = d2 * 1.6, y = 118;
    a1 += dt * n1 / 60 * 2 * Math.PI * .5;
    var a2 = K[2] * a1 * d1 / d2, geared = cur === 'en' || cur === 'rf', x1, x2;
    if (geared) { x1 = 200 - (r1 + r2) / 2; x2 = x1 + r1 + r2 + (cur === 'en' ? 4 : 0); }
    else { x1 = 110; x2 = 300; }
    if (!geared) {
      var D = x2 - x1, al = Math.asin((r1 - r2) / D), c = Math.cos(al), s = Math.sin(al);
      var col = cur === 'pc' ? GOLD : 'rgba(255,255,255,.85)';
      var belt = 'M' + (x1 + r1 * s) + ' ' + (y - r1 * c) + 'L' + (x2 + r2 * s) + ' ' + (y - r2 * c) + 'M' + (x1 + r1 * s) + ' ' + (y + r1 * c) + 'L' + (x2 + r2 * s) + ' ' + (y + r2 * c);
      S('path', { d: belt, fill: 'none', style: 'stroke:' + col + ';stroke-width:4' + (cur === 'ch' ? ';stroke-dasharray:6 4' : '') }, dyn);
    }
    wheel(x1, y, r1, a1, P, cur === 'ch' || cur === 'en' ? d1 : 0); wheel(x2, y, r2, a2, T, cur === 'ch' || cur === 'en' ? d2 : 0);
    txt(dyn, x1, y + r1 + 22, 'menante', P, 'middle', 12, true); txt(dyn, x2, y + r2 + 22, 'menée', T, 'middle', 12, true);
  });
}

function transformation(el) {
  var svg = ui.stage(el, 400, 240, 'Transformation du mouvement'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el);
  var cur = 'bm', a = 0, dir = 1, spd = 2, np = 0;
  var D = {
    bm: { t: 'Bielle-manivelle', c: P, d: 'La rotation continue de la manivelle donne un mouvement de translation alternatif au coulisseau : il fait des allers-retours.', e: 'Rotation continue', s: 'Translation alternative' },
    pc: { t: 'Pignon-crémaillère', c: T, d: 'Le pignon tourne et fait avancer la crémaillère (une barre dentée) en ligne droite. Le sens de translation dépend du sens de rotation.', e: 'Rotation', s: 'Translation' },
    ve: { t: 'Vis-écrou', c: GOLD, d: 'Quand la vis tourne, l’écrou, qui ne peut pas tourner, avance le long de la vis. Un tour fait avancer l’écrou d’un pas.', e: 'Rotation', s: 'Translation' },
    rv: { t: 'Roue et vis sans fin', c: C, d: 'Un tour de la vis fait avancer la roue d’une seule dent : la roue tourne très lentement, avec une grande force. Les axes sont perpendiculaires.', e: 'Rotation rapide', s: 'Rotation lente, axe perpendiculaire' }
  };
  function show() { var d = D[cur]; chips.set(ui.chip('Entrée : ' + d.e, d.c) + ui.chip('Sortie : ' + d.s, d.c)); info.set('<b>' + d.t + '.</b> ' + d.d); }
  ui.tabs(el, Object.keys(D).map(function (k) { return [k, D[k].t]; }), function (k) { cur = k; show(); });
  ui.slider(el, { label: 'Vitesse', min: 1, max: 6, value: 2, step: 1, color: GOLD, fmt: function (v) { return v; } }, function (v) { spd = v; });
  var ctl = ui.controls(el); ui.btn(ctl, 'Inverser le sens', function () { dir *= -1; });
  show();
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); a += dt * spd * .8 * dir; var d = D[cur], i;
    if (cur === 'bm') {
      var R = 38, Lb = 120, cx = 90, cy = 120, px = cx + R * Math.cos(a), py = cy + R * Math.sin(a), sx = px + Math.sqrt(Lb * Lb - (cy - py) * (cy - py)) * 1;
      ln(dyn, 150, 150, 380, 150, 'rgba(255,255,255,.3)', 3); ln(dyn, 150, 90, 380, 90, 'rgba(255,255,255,.3)', 3);
      circ(dyn, cx, cy, R, d.c, .12, 3); ln(dyn, cx, cy, px, py, d.c, 6); circ(dyn, px, py, 6, GOLD, 1, 0);
      ln(dyn, px, py, sx, cy, '#fff', 5); circ(dyn, sx, cy, 5, GOLD, 1, 0); rect(dyn, sx - 10, cy - 24, 40, 48, d.c, .5, 6, 2);
      txt(dyn, 250, 200, 'course = 2 × rayon de la manivelle', d.c, 'middle', 11);
    } else if (cur === 'pc') {
      var r = 38;
      circ(dyn, 150, 100, r, d.c, .15, 3); S('circle', { cx: 150, cy: 100, r: r + 4, fill: 'none', style: 'stroke:' + d.c + ';stroke-width:8;stroke-dasharray:6 6;stroke-opacity:.7', transform: 'rotate(' + (a * 180 / Math.PI) + ' 150 100)' }, dyn);
      ln(dyn, 150, 100, 150 + Math.cos(a) * r, 100 + Math.sin(a) * r, '#fff', 3);
      rect(dyn, 40, 146, 330, 24, 'rgba(255,255,255,1)', .06, 4, 1.5);
      var shift = ((a * r) % 24 + 24) % 24; for (i = -2; i < 16; i++) { var tx = 40 + i * 24 - shift; if (tx > 36 && tx < 360) S('rect', { x: tx, y: 140, width: 12, height: 8, style: 'fill:' + d.c + ';fill-opacity:.8' }, dyn); }
      rect(dyn, 140, 170, 90, 18, d.c, .4, 3, 1.5);
      txt(dyn, 200, 215, 'crémaillère', d.c, 'middle', 11);
    } else if (cur === 've') {
      np += dt * spd * .1 * dir; if (np > 1) { np = 1; dir = -1; } if (np < 0) { np = 0; dir = 1; }
      rect(dyn, 40, 96, 300, 28, 'rgba(255,255,255,1)', .06, 4, 2);
      var sh = ((a * 6) % 18 + 18) % 18; for (i = -1; i < 18; i++) { var xx = 40 + i * 18 + sh; if (xx > 40 && xx < 336) ln(dyn, xx, 96, xx + 10, 124, d.c, 2.5); }
      var nx = 50 + np * 230;
      rect(dyn, nx, 78, 52, 64, d.c, .5, 6, 2.5); txt(dyn, nx + 26, 114, 'écrou', '#fff', 'middle', 11);
      arrow(dyn, 350, 110, 380, 110, d.c); txt(dyn, 200, 180, 'la vis tourne, l’écrou avance (sens inversé en bout de course)', d.c, 'middle', 11);
    } else {
      var wr = 56; circ(dyn, 200, 100, wr, d.c, .15, 3);
      S('circle', { cx: 200, cy: 100, r: wr + 4, fill: 'none', style: 'stroke:' + d.c + ';stroke-width:8;stroke-dasharray:7.6 7.6;stroke-opacity:.7', transform: 'rotate(' + (a * 180 / Math.PI / 20) + ' 200 100)' }, dyn);
      ln(dyn, 200, 100, 200 + Math.cos(a / 20) * wr, 100 + Math.sin(a / 20) * wr, '#fff', 3);
      rect(dyn, 100, 176, 200, 22, '#fff', .06, 11, 2); var sh2 = (a * 8) % 16; for (i = -1; i < 14; i++) { var yy = 100 + i * 16 + sh2; if (yy > 104 && yy < 292) ln(dyn, yy, 176, yy + 8, 198, d.c, 2.5); }
      txt(dyn, 200, 224, 'vis sans fin : 1 tour = 1 dent de la roue', d.c, 'middle', 11); txt(dyn, 330, 100, 'roue', d.c, 'middle', 11);
    }
  });
}
PC.chapter({ id: 't3-8', lazy: true, eyebrow: EY + 'Module 3 · Chaîne d’énergie', title: 'La fonction « Transmettre »', ar: 'الوظيفة «نقل الحركة»',
  lessons: function () { return [
    { short: 'Transmission', title: 'Transmettre un mouvement', intro: 'Choisis une solution, change les tailles des roues et regarde la vitesse de la roue menée.', build: transmission,
      retenir: ['<b>Transmettre</b> un mouvement, c’est le conserver en le faisant passer d’un axe à un autre : poulie-courroie, chaîne-pignons, engrenages, roues de friction.', 'Rapport de vitesse : <b>n₂ ÷ n₁ = D₁ ÷ D₂ = Z₁ ÷ Z₂</b>. Si r &lt; 1 : réducteur. Si r &gt; 1 : multiplicateur.'],
      ar: { e: ['نقل الحركة يعني الحفاظ على نوعها (دوران) مع نقلها من محور إلى آخر: بكرة وسير، سلسلة وعجلات مسنّنة، مسنّنات، عجلات احتكاك. نسبة السرعة = n₂ ÷ n₁ = D₁ ÷ D₂ = Z₁ ÷ Z₂.'], u: 'غيّر حجم العجلتين وراقب سرعة العجلة المنقادة.', w: [['transmission du mouvement', 'نقل الحركة'], ['poulie-courroie', 'بكرة وسير'], ['engrenage', 'مسنّنات'], ['roue menante', 'عجلة قائدة'], ['roue menée', 'عجلة منقادة'], ['réducteur', 'مخفِّض السرعة']] } },
    { short: 'Transformation', title: 'Transformer un mouvement', intro: 'Observe comment une rotation devient une translation, ou une rotation lente.', build: transformation,
      retenir: ['<b>Transformer</b> un mouvement, c’est en changer la nature : rotation vers translation.', 'Bielle-manivelle : translation alternative. Pignon-crémaillère et vis-écrou : translation. Roue et vis sans fin : rotation lente d’axe perpendiculaire.'],
      ar: { e: ['تحويل الحركة يعني تغيير طبيعتها: من دوران إلى انتقال. الذراع والكرنك يعطي انتقالا ترددّيا، الترس والمجرى المسنّن والبرغي والصامولة يعطيان انتقالا مستقيما، والعجلة والبرغي اللانهائي يعطيان دورانا بطيئا بمحور عمودي.'], u: 'اختر تبويبا وغيّر السرعة والاتجاه.', w: [['transformation du mouvement', 'تحويل الحركة'], ['bielle-manivelle', 'ذراع وكرنك'], ['pignon-crémaillère', 'ترس ومجرى مسنّن'], ['vis-écrou', 'برغي وصامولة'], ['vis sans fin', 'برغي لانهائي']] } }
  ]; },
  quiz: [
    { q: 'Un pignon de 20 dents entraîne un pignon de 40 dents. Le second tourne :', o: ['deux fois moins vite', 'deux fois plus vite', 'à la même vitesse'], a: 0, e: 'r = 20 ÷ 40 = 0,5 : c’est un réducteur.' },
    { q: 'La bielle-manivelle transforme :', o: ['une rotation en translation alternative', 'une translation en chaleur', 'une rotation en lumière'], a: 0, e: 'Le coulisseau fait des allers-retours.' },
    { q: 'Deux engrenages en contact tournent :', o: ['en sens inverses', 'dans le même sens', 'sans jamais tourner'], a: 0, e: 'Les dents s’engrènent et inversent le sens.' },
    { q: 'Quelle solution transforme une rotation en translation ?', o: ['le pignon-crémaillère', 'la poulie-courroie', 'les roues de friction'], a: 0, e: 'La crémaillère avance en ligne droite.' },
    { q: 'Quand la roue menée est plus petite que la roue menante, elle tourne :', o: ['plus vite', 'moins vite', 'à la même vitesse'], a: 0, e: 'r = D₁ ÷ D₂ est supérieur à 1.' }
  ]
});

/* ===================================================== 9. AGIR */
function chaine(el) {
  var svg = ui.stage(el, 400, 330, 'Chaîne d’information et chaîne d’énergie'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el);
  var SYS = {
    per: { t: 'Perceuse automatique', mi: 'Plaque non percée', mo: 'Plaque percée', va: 'Modification de forme : un trou est ajouté',
      b: { acq: 'Fin de course : présence de la pièce', tra: 'Carte programmable', com: 'Voyant « perçage en cours »', ali: 'Alimentation secteur', dis: 'Relais', con: 'Moteur électrique', tran: 'Poulie-courroie', agi: 'Foret (effecteur)' } },
    asc: { t: 'Ascenseur', mi: 'Personnes au rez-de-chaussée', mo: 'Personnes à l’étage', va: 'Changement de position : les personnes sont déplacées',
      b: { acq: 'Capteurs d’étage et boutons d’appel', tra: 'Automate programmable', com: 'Afficheur d’étage', ali: 'Alimentation secteur', dis: 'Contacteurs', con: 'Moteur électrique', tran: 'Réducteur à engrenages et câble', agi: 'Cabine (effecteur)' } },
    cha: { t: 'Chauffe-eau électrique', mi: 'Eau froide', mo: 'Eau chaude', va: 'Changement de température : l’eau est chauffée',
      b: { acq: 'Thermostat (capteur de température)', tra: 'Thermostat', com: 'Voyant lumineux', ali: 'Alimentation secteur', dis: 'Contacteur', con: 'Résistance chauffante', tran: 'Non utilisée : pas de mouvement', agi: 'Résistance immergée (effecteur)' } }
  };
  var cur = 'per', sel = 'agi';
  var ROW1 = [['acq', 'Acquérir', 20], ['tra', 'Traiter', 140], ['com', 'Communiquer', 260]];
  var ROW2 = [['ali', 'Alimenter', 4], ['dis', 'Distribuer', 84], ['con', 'Convertir', 164], ['tran', 'Transmettre', 244], ['agi', 'Agir', 324]];
  var N = {};
  txt(g, 200, 16, 'Chaîne d’information', L, 'middle', 12, true);
  ROW1.forEach(function (r, i) { N[r[0]] = fcNode(g, 'rect', r[2] + 60, 52, 112, 40, r[1], L); if (i) arrow(g, r[2] - 6, 52, r[2], 52, L, 2); N[r[0]].el.style.cursor = 'pointer'; });
  txt(g, 200, 122, 'Chaîne d’énergie', C, 'middle', 12, true);
  ROW2.forEach(function (r, i) { N[r[0]] = fcNode(g, 'rect', r[2] + 36, 150, 74, 40, r[1], C, 10); if (i) arrow(g, r[2] - 4, 150, r[2] + 2, 150, C, 2); N[r[0]].el.style.cursor = 'pointer'; });
  arrow(g, 200, 74, 200, 104, 'rgba(255,255,255,.4)', 1.5);
  txt(g, 212, 94, 'ordres', 'rgba(255,255,255,.55)', 'start', 10);
  txt(g, 200, 228, 'Matière d’œuvre', GOLD, 'middle', 12, true);
  var mi = fcNode(g, 'rect', 74, 262, 128, 44, '', GOLD), mo = fcNode(g, 'rect', 326, 262, 128, 44, '', GOLD);
  arrow(g, 140, 262, 262, 262, GOLD, 3); txt(g, 200, 252, 'valeur ajoutée', GOLD, 'middle', 10.5);
  var tmi = txt(g, 74, 258, '', INK, 'middle', 10.5), tmi2 = txt(g, 74, 272, '', INK, 'middle', 10.5), tmo = txt(g, 326, 258, '', INK, 'middle', 10.5), tmo2 = txt(g, 326, 272, '', INK, 'middle', 10.5);
  Object.keys(N).forEach(function (k) { N[k].el.addEventListener('click', function () { sel = k; paint(); }); });
  function split2(t) { var w = t.split(' '), m = Math.ceil(w.length / 2); return [w.slice(0, m).join(' '), w.slice(m).join(' ')]; }
  function paint() {
    var D = SYS[cur]; Object.keys(N).forEach(function (k) { N[k].on(k === sel); });
    var a = split2(D.mi), b = split2(D.mo); tmi.textContent = a[0]; tmi2.textContent = a[1]; tmo.textContent = b[0]; tmo2.textContent = b[1];
    var names = { acq: 'Acquérir', tra: 'Traiter', com: 'Communiquer', ali: 'Alimenter', dis: 'Distribuer', con: 'Convertir', tran: 'Transmettre', agi: 'Agir' };
    chips.set(ui.chip(D.t, GOLD) + ui.chip(names[sel] + ' : ' + D.b[sel], sel === 'acq' || sel === 'tra' || sel === 'com' ? L : C));
    info.set('<b>' + D.t + '.</b> Matière d’œuvre : <b>' + D.mi.toLowerCase() + '</b> devient <b>' + D.mo.toLowerCase() + '</b>. <b>Valeur ajoutée</b> : ' + D.va.toLowerCase() + '. Touche un bloc pour voir le composant.');
  }
  ui.tabs(el, Object.keys(SYS).map(function (k) { return [k, SYS[k].t]; }), function (k) { cur = k; paint(); });
  paint();
}
PC.chapter({ id: 't3-9', lazy: true, eyebrow: EY + 'Module 3 · Chaîne d’énergie', title: 'La fonction « Agir »', ar: 'الوظيفة «الفعل»',
  lessons: function () { return [
    { short: 'Chaîne complète', title: 'De l’information à l’action', intro: 'Choisis un système. Touche chaque bloc pour trouver le composant qui assure la fonction.', build: chaine,
      retenir: ['La fonction <b>Agir</b> est assurée par l’<b>effecteur</b> : il agit sur la <b>matière d’œuvre</b>.', 'La <b>valeur ajoutée</b> est ce que l’action change : la forme, la position, la température…', 'La chaîne d’information (Acquérir, Traiter, Communiquer) commande la chaîne d’énergie (Alimenter, Distribuer, Convertir, Transmettre, Agir).'],
      ar: { e: ['وظيفة الفعل ينجزها المؤثّر (effecteur) الذي يؤثر على المادة المصنَّعة (matière d’œuvre). القيمة المضافة هي ما يغيّره الفعل: الشكل أو الموضع أو درجة الحرارة. سلسلة المعلومات (اكتساب، معالجة، تبليغ) تتحكم في سلسلة الطاقة (تزويد، توزيع، تحويل، نقل، فعل).'], u: 'اختر نظاما ثم المس كل مربع لتعرف المكوّن المناسب.', w: [['agir', 'فعل'], ['effecteur', 'مؤثّر'], ['matière d’œuvre', 'مادة العمل'], ['valeur ajoutée', 'قيمة مضافة'], ['chaîne d’énergie', 'سلسلة الطاقة'], ['chaîne d’information', 'سلسلة المعلومات']] } }
  ]; },
  quiz: [
    { q: 'Le foret d’une perceuse est :', o: ['l’effecteur', 'le capteur', 'le pré-actionneur'], a: 0, e: 'Il agit directement sur la pièce.' },
    { q: 'Dans un chauffe-eau, la valeur ajoutée est un changement de :', o: ['température', 'forme', 'position'], a: 0, e: 'L’eau froide devient de l’eau chaude.' },
    { q: 'La matière d’œuvre est :', o: ['ce sur quoi agit le système', 'la source d’énergie', 'le programme'], a: 0, e: 'C’est la matière, l’énergie ou l’information traitée.' },
    { q: 'Quelle chaîne contient « Traiter » ?', o: ['la chaîne d’information', 'la chaîne d’énergie', 'aucune'], a: 0, e: 'Acquérir, Traiter et Communiquer forment la chaîne d’information.' }
  ]
});
