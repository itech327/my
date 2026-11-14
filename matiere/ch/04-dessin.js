/* ===================================================== 10. DESSIN TECHNIQUE */
/* petit cube en perspective cavalière (face avant w×h, profondeur d réduite de moitié à 45°) */
function cube(g, x, y, w, hh, d, c, hidden) {
  var k = d * .5 * .7071, ox = k, oy = -k;
  pathd(g, 'M' + x + ' ' + y + 'L' + (x + w) + ' ' + y + 'L' + (x + w) + ' ' + (y + hh) + 'L' + x + ' ' + (y + hh) + 'Z', c, 2.5, c, .15);
  pathd(g, 'M' + x + ' ' + y + 'L' + (x + ox) + ' ' + (y + oy) + 'L' + (x + w + ox) + ' ' + (y + oy) + 'L' + (x + w) + ' ' + y, c, 2.5);
  pathd(g, 'M' + (x + w + ox) + ' ' + (y + oy) + 'L' + (x + w + ox) + ' ' + (y + hh + oy) + 'L' + (x + w) + ' ' + (y + hh), c, 2.5);
  if (hidden) { ln(g, x, y + hh, x + ox, y + hh + oy, c, 1.5, '4 3'); ln(g, x + ox, y + hh + oy, x + w + ox, y + hh + oy, c, 1.5, '4 3'); ln(g, x + ox, y + oy, x + ox, y + hh + oy, c, 1.5, '4 3'); }
}
function typesRep(el) {
  var svg = ui.stage(el, 400, 210, 'Les types de représentation technique'), g = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el);
  var D = {
    cro: { t: 'Croquis', c: P, d: 'Dessin à main levée, rapide, sans instruments. Il sert à chercher et à noter une idée.' },
    sch: { t: 'Schéma', c: T, d: 'Représentation simplifiée avec des symboles. Il montre le fonctionnement, pas la forme réelle.' },
    ens: { t: 'Dessin d’ensemble', c: L, d: 'Il montre plusieurs pièces assemblées dans un mécanisme, avec leurs repères.' },
    def: { t: 'Dessin de définition', c: GOLD, d: 'Il définit une seule pièce de façon complète : vues, cotes, matière. On peut la fabriquer à partir de lui.' },
    cav: { t: 'Perspective cavalière', c: C, d: 'Vue d’ensemble en volume : la face avant est en vraie grandeur, la profondeur est tracée à 45° et réduite de moitié.' },
    ecl: { t: 'Perspective éclatée', c: P, d: 'Les pièces sont séparées le long de leurs axes de montage pour montrer comment elles s’assemblent.' }
  };
  function show(k) {
    var d = D[k]; g.replaceChildren(); var c = d.c;
    if (k === 'cro') {
      pathd(g, 'M90 80Q150 72 230 78Q238 100 232 142Q160 150 94 146Q86 110 90 80', c, 3); pathd(g, 'M90 80Q110 52 160 52Q250 50 276 50Q258 62 230 78', c, 3); pathd(g, 'M276 50Q282 90 272 112Q250 128 232 142', c, 3);
      txt(g, 200, 190, 'à main levée', c, 'middle', 12);
    } else if (k === 'sch') {
      ln(g, 110, 60, 110, 150, '#fff', 2.5); ln(g, 110, 60, 160, 60, '#fff', 2.5); ln(g, 110, 150, 290, 150, '#fff', 2.5); ln(g, 290, 150, 290, 60, '#fff', 2.5); ln(g, 240, 60, 290, 60, '#fff', 2.5);
      ln(g, 90, 98, 130, 98, c, 4); ln(g, 100, 112, 120, 112, c, 4); circ(g, 200, 60, 4, GOLD, 1, 1); circ(g, 240, 60, 4, GOLD, 1, 1); ln(g, 200, 60, 236, 40, GOLD, 3);
      circ(g, 290, 105, 16, c, .2, 3); txt(g, 200, 190, 'symboles normalisés', c, 'middle', 12);
    } else if (k === 'ens') {
      rect(g, 80, 70, 70, 70, c, .2, 6); rect(g, 150, 85, 100, 40, c, .35, 4); rect(g, 250, 70, 70, 70, c, .2, 6);
      [[115, 70, 115, 46, '1'], [200, 85, 200, 46, '2'], [285, 70, 285, 46, '3']].forEach(function (a) { ln(g, a[0], a[1], a[2], a[3] + 8, c, 1.5); circ(g, a[2], a[3], 9, c, .3, 1.5); txt(g, a[2], a[3] + 4, a[4], '#fff', 'middle', 11); });
      txt(g, 200, 180, 'pièces repérées 1, 2, 3', c, 'middle', 12);
    } else if (k === 'def') {
      rect(g, 110, 60, 120, 76, c, .12, 2, 2.5); circ(g, 170, 98, 18, c, .1, 2.5);
      ln(g, 110, 150, 230, 150, 'rgba(255,255,255,.8)', 1.5); txt(g, 170, 166, '80', '#fff', 'middle', 11); ln(g, 250, 60, 250, 136, 'rgba(255,255,255,.8)', 1.5); txt(g, 266, 102, '50', '#fff', 'start', 11);
      txt(g, 200, 192, 'vues + cotes + matière', c, 'middle', 12);
    } else if (k === 'cav') {
      cube(g, 130, 90, 110, 70, 90, c, true); txt(g, 200, 192, 'face en vraie grandeur, profondeur à 45°', c, 'middle', 12);
    } else {
      rect(g, 90, 110, 50, 60, c, .25, 4); rect(g, 175, 90, 50, 60, T, .25, 4); rect(g, 260, 70, 50, 60, GOLD, .25, 4);
      ln(g, 140, 140, 175, 120, 'rgba(255,255,255,.6)', 1.5, '5 4'); ln(g, 225, 120, 260, 100, 'rgba(255,255,255,.6)', 1.5, '5 4'); ln(g, 70, 150, 330, 60, 'rgba(255,255,255,.4)', 1.5, '10 3 2 3');
      txt(g, 200, 192, 'pièces écartées sur l’axe d’assemblage', c, 'middle', 12);
    }
    chips.set(ui.chip(d.t, c)); info.set('<b>' + d.t + '.</b> ' + d.d);
  }
  ui.tabs(el, [['cro', 'Croquis'], ['sch', 'Schéma'], ['ens', 'D. d’ensemble'], ['def', 'D. de définition'], ['cav', 'Cavalière'], ['ecl', 'Éclatée']], show);
  show('cro');
}

function traits(el) {
  var svg = ui.stage(el, 400, 220, 'Les traits normalisés sur un dessin technique'), g = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el);
  var AX = '10 3 2 3', WH = '#fff';
  var G = { vis: S('g', null, g), hid: S('g', null, g), axe: S('g', null, g), cot: S('g', null, g) };
  // contours visibles : trait continu fort
  S('rect', { x: 30, y: 40, width: 160, height: 100, fill: 'none', style: 'stroke:' + WH + ';stroke-width:3.5' }, G.vis);
  S('circle', { cx: 110, cy: 90, r: 22, fill: 'none', style: 'stroke:' + WH + ';stroke-width:3.5' }, G.vis);
  S('rect', { x: 250, y: 40, width: 80, height: 100, fill: 'none', style: 'stroke:' + WH + ';stroke-width:3.5' }, G.vis);
  // contours cachés : trait interrompu fin
  ln(G.hid, 250, 68, 330, 68, WH, 1.6, '5 4'); ln(G.hid, 250, 112, 330, 112, WH, 1.6, '5 4');
  // axes : trait mixte fin
  ln(G.axe, 20, 90, 200, 90, WH, 1.4, AX); ln(G.axe, 110, 30, 110, 150, WH, 1.4, AX); ln(G.axe, 240, 90, 340, 90, WH, 1.4, AX);
  // cotes : trait continu fin avec flèches
  [[30, 164, 190, 164, '80', 110, 180], [352, 40, 352, 140, '50', 368, 94], [250, 24, 330, 24, '40', 290, 18]].forEach(function (c) {
    ln(G.cot, c[0], c[1], c[2], c[3], WH, 1.3); arrow(G.cot, c[0] + (c[0] === c[2] ? 0 : 10), c[1] + (c[1] === c[3] ? 0 : 10), c[0], c[1], WH, 1.3); arrow(G.cot, c[2] - (c[0] === c[2] ? 0 : 10), c[3] - (c[1] === c[3] ? 0 : 10), c[2], c[3], WH, 1.3);
    txt(G.cot, c[5], c[6] + (c[1] === c[3] ? 0 : 0), c[4], WH, 'middle', 11);
  });
  ln(G.cot, 30, 142, 30, 168, WH, 1.2); ln(G.cot, 190, 142, 190, 168, WH, 1.2);
  txt(g, 110, 206, 'vue de face', 'rgba(255,255,255,.55)', 'middle', 11); txt(g, 290, 206, 'vue de gauche', 'rgba(255,255,255,.55)', 'middle', 11);
  var D = {
    all: ['Tous les traits', '#fff', 'Sur un dessin, chaque type de trait a un sens. Choisis un trait pour le mettre en évidence.'],
    vis: ['Trait continu fort', P, 'Il dessine les <b>contours et arêtes visibles</b> de la pièce.'],
    hid: ['Trait interrompu fin', T, 'Il dessine les <b>contours et arêtes cachés</b>, que l’on ne voit pas de l’extérieur (ici, le trou vu de côté).'],
    axe: ['Trait mixte fin', GOLD, 'Il dessine les <b>axes</b> de symétrie, des trous et des cylindres.'],
    cot: ['Trait continu fin', C, 'Il sert aux <b>cotes</b> (lignes de cote, lignes d’attache) : les dimensions en millimètres.']
  };
  function show(k) {
    Object.keys(G).forEach(function (j) { G[j].style.opacity = (k === 'all' || k === j) ? 1 : .15; });
    var d = D[k]; chips.set(ui.chip(d[0], d[1], k === 'all')); info.set(d[2]);
  }
  ui.tabs(el, [['all', 'Tous'], ['vis', 'Contours'], ['hid', 'Cachés'], ['axe', 'Axes'], ['cot', 'Cotes']], show);
  show('all');
}

function vues(el) {
  var svg = ui.stage(el, 400, 270, 'Perspective cavalière et vues d’un objet'), g = S('g', null, svg);
  var info = ui.info(el), mode = 'cav', hole = true;
  var sl = ui.slider(el, { label: 'Largeur', min: 30, max: 60, value: 50, step: 5, color: P, fmt: function (v) { return v + ' mm'; } }, draw);
  var sh = ui.slider(el, { label: 'Hauteur', min: 20, max: 40, value: 30, step: 5, color: T, fmt: function (v) { return v + ' mm'; } }, draw);
  var sp = ui.slider(el, { label: 'Profondeur', min: 20, max: 40, value: 30, step: 5, color: GOLD, fmt: function (v) { return v + ' mm'; } }, draw);
  var WH = '#fff', AX = '10 3 2 3';
  function box(x, y, w, hh, c) { return S('rect', { x: x, y: y, width: w, height: hh, fill: 'none', style: 'stroke:' + (c || WH) + ';stroke-width:3' }, g); }
  function draw() {
    g.replaceChildren();
    var L = sl.get(), H = sh.get(), Pf = sp.get(), dia = Math.round(Math.min(L, H) * .4);
    if (mode === 'cav') {
      var s = Math.min(280 / (L + Pf * .36), 140 / (H + Pf * .36)), w = L * s, hh = H * s, d = Pf * s, k = d * .5 * .7071, x = (400 - w - k) / 2, y = (236 - hh - k) / 2 + k + 6;
      cube(g, x, y, w, hh, d, P, true);
      if (hole) { var cx = x + w / 2, cy = y + hh / 2, r = dia * s / 2; circ(g, cx, cy, r, GOLD, .12, 2.5); circ(g, cx + k, cy - k, r, GOLD, 0, 0).setAttribute('style', 'fill:none;stroke:' + GOLD + ';stroke-width:1.5;stroke-dasharray:4 3'); ln(g, cx, cy - r, cx + k, cy - k - r, GOLD, 1.5, '4 3'); ln(g, cx, cy + r, cx + k, cy - k + r, GOLD, 1.5, '4 3'); }
      txt(g, 200, 256, 'Perspective cavalière : face en vraie grandeur, profondeur à 45° réduite de moitié', 'rgba(255,255,255,.65)', 'middle', 10.5);
      info.set('Les arêtes visibles sont en trait fort, les arêtes cachées en trait interrompu fin. Change les dimensions : la face avant garde sa forme réelle.');
    } else {
      var s2 = Math.min(320 / (L + Pf), 160 / (H + Pf)), w2 = L * s2, h2 = H * s2, d2 = Pf * s2, x0 = (400 - w2 - 34 - d2) / 2, y0 = (250 - h2 - 34 - d2) / 2 + 12, gx = x0 + w2 + 34, gy = y0 + h2 + 34;
      box(x0, y0, w2, h2, P); box(gx, y0, d2, h2, T); box(x0, gy, w2, d2, GOLD);
      var r2 = dia * s2 / 2, cx2 = x0 + w2 / 2, cy2 = y0 + h2 / 2;
      if (hole) {
        S('circle', { cx: cx2, cy: cy2, r: r2, fill: 'none', style: 'stroke:' + P + ';stroke-width:3' }, g);
        ln(g, gx, cy2 - r2, gx + d2, cy2 - r2, T, 1.6, '5 4'); ln(g, gx, cy2 + r2, gx + d2, cy2 + r2, T, 1.6, '5 4');
        ln(g, cx2 - r2, gy, cx2 - r2, gy + d2, GOLD, 1.6, '5 4'); ln(g, cx2 + r2, gy, cx2 + r2, gy + d2, GOLD, 1.6, '5 4');
        ln(g, x0 - 8, cy2, x0 + w2 + 8, cy2, WH, 1.2, AX); ln(g, cx2, y0 - 8, cx2, y0 + h2 + 8, WH, 1.2, AX);
        ln(g, gx - 8, cy2, gx + d2 + 8, cy2, WH, 1.2, AX); ln(g, cx2, gy - 8, cx2, gy + d2 + 8, WH, 1.2, AX);
      }
      ln(g, x0 + w2 + 4, y0 + h2 + 4, gx - 4, gy - 4, 'rgba(255,255,255,.25)', 1, '3 3');
      txt(g, x0 + w2 / 2, y0 - 8, 'Vue de face', P, 'middle', 11, true); txt(g, gx + d2 / 2, y0 - 8, 'Vue de gauche', T, 'middle', 11, true); txt(g, x0 + w2 / 2, gy + d2 + 16, 'Vue de dessus', GOLD, 'middle', 11, true);
      info.set('La <b>vue de gauche</b> se place à droite de la vue de face, la <b>vue de dessus</b> en dessous. Le trou, invisible de côté, est en trait interrompu fin.');
    }
  }
  ui.tabs(el, [['cav', 'Perspective cavalière'], ['vue', 'Les trois vues']], function (k) { mode = k; draw(); });
  var ctl = ui.controls(el); var hb = ui.btn(ctl, 'Enlever le trou', function () { hole = !hole; hb.textContent = hole ? 'Enlever le trou' : 'Ajouter le trou'; draw(); });
  draw();
}

function echelle(el) {
  var svg = ui.stage(el, 400, 170, 'Échelle d’un dessin'), g = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el), verd = ui.verdict(el);
  var E = 0.5, K = 1.2;
  var sr = ui.slider(el, { label: 'Longueur réelle', min: 10, max: 150, value: 60, step: 5, color: P, fmt: function (v) { return v + ' mm'; } }, draw);
  function draw() {
    g.replaceChildren(); var real = sr.get(), dr = real * E;
    txt(g, 20, 24, 'Objet réel : ' + real + ' mm', P, 'start', 12, true);
    rect(g, 20, 34, real * K, 22, P, .35, 4);
    txt(g, 20, 96, 'Sur le dessin : ' + fm(dr, 1) + ' mm', T, 'start', 12, true);
    rect(g, 20, 106, dr * K, 22, T, .35, 4);
    txt(g, 20, 156, 'échelle ' + (E >= 1 ? fm(E, 0) + ':1' : '1:' + fm(1 / E, 0)), GOLD, 'start', 13, true);
    chips.set(ui.chip('Dessin = réel × échelle', GOLD) + ui.chip(fm(real, 0) + ' × ' + fm(E, 2) + ' = ' + fm(dr, 1) + ' mm', T));
    verd.set(E < 1 ? 'Échelle de réduction : le dessin est plus petit que l’objet.' : (E === 1 ? 'Grandeur nature : même taille.' : 'Échelle d’agrandissement : le dessin est plus grand que l’objet.'), E < 1 ? 'ok' : '');
    info.set('L’<b>échelle</b> est le rapport entre une longueur sur le dessin et la longueur réelle. 1:2 veut dire que le dessin est 2 fois plus petit.');
  }
  ui.tabs(el, [[1, '1:1'], [0.5, '1:2'], [0.2, '1:5'], [2, '2:1']], function (k) { E = +k; draw(); });
  draw();
}

PC.chapter({ id: 't3-10', lazy: true, eyebrow: EY + 'Module 4 · Dessin technique', title: 'Le dessin technique', ar: 'الرسم التقني',
  lessons: function () { return [
    { short: 'Représentations', title: 'Les types de représentation', intro: 'Choisis un type de représentation technique et compare ce qu’il montre.', build: typesRep,
      retenir: ['Le <b>dessin technique</b> est un langage normalisé pour représenter un objet technique.', 'Croquis, schéma, dessin d’ensemble, dessin de définition, perspective cavalière, perspective éclatée : chaque représentation a un usage.'],
      ar: { e: ['الرسم التقني لغة معيارية لتمثيل الشيء التقني. لكل تمثيل استعماله: الرسم التخطيطي السريع (croquis)، المخطط الرمزي (schéma)، الرسم التجميعي (dessin d’ensemble)، الرسم التعريفي لقطعة واحدة (dessin de définition)، المنظور المجسّم (cavalière) والمنظور المفكَّك (éclatée).'], u: 'اختر نوع التمثيل من التبويبات.', w: [['dessin technique', 'رسم تقني'], ['croquis', 'رسم تخطيطي'], ['schéma', 'مخطط'], ['dessin d’ensemble', 'رسم تجميعي'], ['dessin de définition', 'رسم تعريفي'], ['perspective cavalière', 'منظور مجسّم'], ['perspective éclatée', 'منظور مفكَّك']] } },
    { short: 'Les traits', title: 'Les traits normalisés', intro: 'Choisis un type de trait : il s’allume sur le dessin avec son usage.', build: traits,
      retenir: ['<b>Continu fort</b> : contours visibles. <b>Interrompu fin</b> : contours cachés. <b>Mixte fin</b> : axes. <b>Continu fin</b> : cotes.'],
      ar: { e: ['الخط المتصل الغليظ للحواف المرئية، الخط المتقطع الرفيع للحواف المخفية، الخط المختلط الرفيع للمحاور، والخط المتصل الرفيع للقياسات (الأبعاد).'], u: 'اختر نوع الخط لتراه على الرسم.', w: [['trait', 'خط'], ['cote', 'بُعد (قياس)'], ['axe', 'محور']] } },
    { short: 'Vues', title: 'Perspective cavalière et vues', intro: 'Change les dimensions de la pièce, puis passe de la perspective aux trois vues.', build: vues,
      retenir: ['En <b>perspective cavalière</b>, la face avant est en vraie grandeur et la profondeur est tracée à 45°, réduite de moitié.', 'Les vues : <b>face</b>, <b>gauche</b> (à droite de la face), <b>dessus</b> (sous la face).'],
      ar: { e: ['في المنظور المجسّم تُرسم الواجهة الأمامية بحجمها الحقيقي وتُرسم العمق بزاوية 45° مع تصغيره إلى النصف. المساقط: مسقط أمامي، مسقط أيسر (يوضع على يمين الأمامي) ومسقط أفقي (يوضع تحته).'], u: 'غيّر الأبعاد ثم انتقل بين المنظور والمساقط.', w: [['vue de face', 'مسقط أمامي'], ['vue de gauche', 'مسقط أيسر'], ['vue de dessus', 'مسقط أفقي']] } },
    { short: 'Échelle', title: 'L’échelle', intro: 'Choisis une échelle puis change la longueur réelle.', build: echelle,
      retenir: ['<b>Longueur sur le dessin = longueur réelle × échelle</b>.', '1:1 grandeur nature. 1:2 et 1:5 réduction. 2:1 agrandissement.'],
      ar: { e: ['طول الرسم = الطول الحقيقي × السلّم. السلّم 1:1 يعني الحجم الطبيعي، و1:2 و1:5 تصغير، و2:1 تكبير.'], u: 'اختر سلّما وغيّر الطول الحقيقي.', w: [['échelle', 'سلّم']] } }
  ]; },
  quiz: [
    { q: 'Quel trait représente les contours cachés ?', o: ['interrompu fin', 'continu fort', 'mixte fin'], a: 0, e: 'Les arêtes cachées se dessinent en traits interrompus fins.' },
    { q: 'Une pièce de 80 mm dessinée à l’échelle 1:2 mesure sur le dessin :', o: ['40 mm', '160 mm', '80 mm'], a: 0, e: '80 × 1/2 = 40 mm.' },
    { q: 'En perspective cavalière, la profondeur est :', o: ['tracée à 45° et réduite de moitié', 'en vraie grandeur', 'supprimée'], a: 0, e: 'Seule la face avant est en vraie grandeur.' },
    { q: 'La vue de dessus se place :', o: ['sous la vue de face', 'au-dessus de la vue de face', 'à gauche de la vue de face'], a: 0, e: 'La vue de gauche est à droite, la vue de dessus est en dessous.' },
    { q: 'Quel dessin définit une seule pièce de façon complète ?', o: ['le dessin de définition', 'le schéma', 'le croquis'], a: 0, e: 'Il contient les vues, les cotes et la matière.' }
  ]
});
