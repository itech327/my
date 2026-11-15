/* ===================================================== 3AC · MODULE 4 · DESSIN TECHNIQUE */
function lignesNormalisees(el) {
  var svg = ui.stage(el, 400, 240, 'Les traits normalisés'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), sel = 'tout';
  ui.tabs(el, [['tout', 'Tout'], ['cont', 'Contours'], ['cache', 'Cachés'], ['axe', 'Axes'], ['cote', 'Cotes']], function (k) { sel = k; paint(); });
  var D = { tout: 'Chaque trait a un <b>rôle</b>. Choisis un type pour le mettre en valeur.', cont: '<b>Trait fort continu</b> : contours et arêtes <b>visibles</b>.', cache: '<b>Trait interrompu fin</b> : contours et arêtes <b>cachés</b>.', axe: '<b>Trait mixte fin</b> (tiret – point) : axes de symétrie et de révolution.', cote: '<b>Trait continu fin</b> : lignes de cote et lignes d’attache.' };
  function paint() { chips.set(ui.chip(sel === 'tout' ? '4 types de traits' : { cont: 'fort continu', cache: 'interrompu', axe: 'mixte', cote: 'continu fin' }[sel], AMBER)); info.set(D[sel]); draw(); }
  function op(k) { return sel === 'tout' || sel === k ? 1 : .15; }
  function draw() {
    dyn.replaceChildren(); var g = dyn;
    function L(x1, y1, x2, y2, k, col, w, dash) { var l = ln(g, x1, y1, x2, y2, col, w, dash); l.style.opacity = op(k); return l; }
    txt(g, 90, 36, 'Vue de face', '#9fb8cc', 'middle', 10); txt(g, 250, 36, 'Vue de gauche', '#9fb8cc', 'middle', 10);
    L(30, 60, 150, 60, 'cont', '#fff', 3.2); L(150, 60, 150, 150, 'cont', '#fff', 3.2); L(150, 150, 30, 150, 'cont', '#fff', 3.2); L(30, 150, 30, 60, 'cont', '#fff', 3.2);
    var c = S('circle', { cx: 90, cy: 105, r: 22, style: 'fill:none;stroke:#fff;stroke-width:3.2;opacity:' + op('cont') }, g);
    L(60, 105, 120, 105, 'axe', AMBER, 1.4, '10 3 2 3'); L(90, 75, 90, 135, 'axe', AMBER, 1.4, '10 3 2 3');
    L(30, 150, 30, 176, 'cote', BLUE, 1.2); L(150, 150, 150, 176, 'cote', BLUE, 1.2); L(30, 172, 150, 172, 'cote', BLUE, 1.4); var tt = txt(g, 90, 166, '120', BLUE, 'middle', 10, true); tt.style.opacity = op('cote');
    L(30, 172, 38, 169, 'cote', BLUE, 1.4); L(30, 172, 38, 175, 'cote', BLUE, 1.4); L(150, 172, 142, 169, 'cote', BLUE, 1.4); L(150, 172, 142, 175, 'cote', BLUE, 1.4);
    L(230, 60, 270, 60, 'cont', '#fff', 3.2); L(270, 60, 270, 150, 'cont', '#fff', 3.2); L(270, 150, 230, 150, 'cont', '#fff', 3.2); L(230, 150, 230, 60, 'cont', '#fff', 3.2);
    L(230, 83, 270, 83, 'cache', GREEN, 1.6, '6 4'); L(230, 127, 270, 127, 'cache', GREEN, 1.6, '6 4'); L(224, 105, 276, 105, 'axe', AMBER, 1.4, '10 3 2 3');
    L(290, 60, 290, 150, 'cote', BLUE, 1.4); L(284, 60, 296, 60, 'cote', BLUE, 1.2); L(284, 150, 296, 150, 'cote', BLUE, 1.2); var t2 = txt(g, 306, 110, '80', BLUE, 'start', 10, true); t2.style.opacity = op('cote');
    txt(g, 200, 214, 'Les traits cachés montrent le trou vu de côté.', '#7e9bb2', 'middle', 10);
  }
  paint();
}
function classerTraits(el) {
  var d = function (n, s) { return function (g) { rect(g, 30, 28, 340, 80, BLUE, .08, 4, 1.8); txt(g, 200, 62, n, '#fff', 'middle', 14, true); txt(g, 200, 90, s, '#9fb8cc', 'middle', 11); }; };
  classify(el, 'Quel trait pour quel élément ?', [
    { name: 'Le contour visible d’une pièce', cat: 0, why: 'Trait fort continu.', draw: d('Contour visible', 'pièce vue de face') },
    { name: 'Un trou vu de côté (non visible)', cat: 1, why: 'Trait interrompu fin pour ce qui est caché.', draw: d('Trou vu de côté', 'caché derrière la paroi') },
    { name: 'L’axe d’un cylindre', cat: 2, why: 'Trait mixte fin (tiret – point).', draw: d('Axe d’un cylindre', 'symétrie de révolution') },
    { name: 'Une ligne de cote', cat: 3, why: 'Trait continu fin avec flèches.', draw: d('Ligne de cote', '120 mm') },
    { name: 'L’axe de symétrie d’une pièce', cat: 2, why: 'Trait mixte fin.', draw: d('Axe de symétrie', 'pièce symétrique') },
    { name: 'Une ligne d’attache', cat: 3, why: 'Trait continu fin.', draw: d('Ligne d’attache', 'prolonge le contour') },
    { name: 'Une arête cachée derrière une face', cat: 1, why: 'Trait interrompu.', draw: d('Arête cachée', 'derrière une face') },
    { name: 'Les arêtes visibles du dessus', cat: 0, why: 'Trait fort continu.', draw: d('Arêtes visibles', 'vue de dessus') }
  ], ['Fort continu', 'Interrompu', 'Mixte', 'Continu fin'], 'Visible, caché, axe ou cote ?');
}
var VU = { cw: 30, ch: 25, D: 45 };
function vuesProjection(el) {
  var Z = VU, svg = ui.stage(el, 400, 285, 'Perspective cavalière et vues d’un objet'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el);
  Z.cw = 30; Z.ch = 25; Z.D = 45;
  ui.slider(el, { label: 'Largeur de l’encoche', min: 10, max: 50, value: 30, step: 5, color: AMBER, fmt: function (v) { return v + ' mm'; } }, function (v) { Z.cw = v; draw(); });
  ui.slider(el, { label: 'Hauteur de l’encoche', min: 10, max: 50, value: 25, step: 5, color: BLUE, fmt: function (v) { return v + ' mm'; } }, function (v) { Z.ch = v; draw(); });
  ui.slider(el, { label: 'Profondeur', min: 20, max: 60, value: 45, step: 5, color: GREEN, fmt: function (v) { return v + ' mm'; } }, function (v) { Z.D = v; draw(); });
  function draw() {
    dyn.replaceChildren(); var g = dyn, W = 90, H = 70, s = .85, cw = Z.cw * 1, ch = Z.ch * 1, D = Z.D;
    var P = [[0, 0], [W - cw, 0], [W - cw, ch], [W, ch], [W, H], [0, H]];
    function poly(ox, oy, pts, col, fillop, w, dash) { S('path', { d: 'M' + pts.map(function (p) { return (ox + p[0] * s).toFixed(1) + ' ' + (oy + p[1] * s).toFixed(1); }).join('L') + 'Z', style: 'fill:' + col + ';fill-opacity:' + fillop + ';stroke:' + col + ';stroke-width:' + w + ';stroke-linejoin:round' + (dash ? ';stroke-dasharray:' + dash : '') }, g); }
    var sc = 1.15, d = D * .5 * sc, ox = d * .7071, oy = -d * .7071, fx = 20, fy = 150;
    var F = P.map(function (p) { return [fx + p[0] * sc, fy + p[1] * sc]; }), B = F.map(function (p) { return [p[0] + ox, p[1] + oy]; });
    function quad(a, b, c, d2, o) { S('path', { d: 'M' + a.join(' ') + 'L' + b.join(' ') + 'L' + c.join(' ') + 'L' + d2.join(' ') + 'Z', style: 'fill:' + AMBER + ';fill-opacity:' + o + ';stroke:#fff;stroke-width:2;stroke-linejoin:round' }, g); }
    quad(F[0], F[1], B[1], B[0], .18); quad(F[1], F[2], B[2], B[1], .08); quad(F[2], F[3], B[3], B[2], .22); quad(F[3], F[4], B[4], B[3], .1);
    S('path', { d: 'M' + F.map(function (p) { return p.join(' '); }).join('L') + 'Z', style: 'fill:' + BLUE + ';fill-opacity:.15;stroke:#fff;stroke-width:2.6;stroke-linejoin:round' }, g);
    ln(g, F[5][0], F[5][1], B[5][0], B[5][1], GREEN, 1.4, '4 3'); ln(g, B[5][0], B[5][1], B[4][0], B[4][1], GREEN, 1.4, '4 3'); ln(g, B[5][0], B[5][1], B[0][0], B[0][1], GREEN, 1.4, '4 3');
    txt(g, 20, 252, 'perspective cavalière', '#9fb8cc', 'start', 10);
    txt(g, 20, 266, 'face en vraie grandeur · fuyantes à 45° (÷ 2)', '#7e9bb2', 'start', 8);
    var vx = 214, vy = 44, Dp = D * s, Ws = W * s, Hs = H * s;
    txt(g, vx + Ws / 2, vy - 6, 'Vue de face', AMBER, 'middle', 9, true); poly(vx, vy, P, '#fff', .05, 2.6);
    var dx0 = vx + Ws + 28; txt(g, dx0 + Dp / 2, vy - 6, 'Gauche', AMBER, 'middle', 9, true); S('rect', { x: dx0, y: vy, width: Dp, height: Hs, style: 'fill:#fff;fill-opacity:.05;stroke:#fff;stroke-width:2.6' }, g); ln(g, dx0, vy + ch * s, dx0 + Dp, vy + ch * s, GREEN, 1.6, '5 3');
    var dy0 = vy + Hs + 28; txt(g, vx + Ws / 2, dy0 + Dp + 14, 'Vue de dessus', AMBER, 'middle', 9, true); S('rect', { x: vx, y: dy0, width: Ws, height: Dp, style: 'fill:#fff;fill-opacity:.05;stroke:#fff;stroke-width:2.6' }, g); ln(g, vx + (W - cw) * s, dy0, vx + (W - cw) * s, dy0 + Dp, '#fff', 2.6);
    ln(g, vx + (W - cw) * s, vy + Hs, vx + (W - cw) * s, dy0, '#37536b', 1, '3 3'); ln(g, vx + Ws, vy + ch * s, dx0, vy + ch * s, '#37536b', 1, '3 3'); ln(g, vx + Ws, vy + Hs, vx + Ws, dy0, '#37536b', 1, '3 3');
    txt(g, dx0 + Dp + 4, vy + ch * s - 3, 'caché', GREEN, 'start', 8);
    chips.set(ui.chip('3 vues alignées', AMBER) + ui.chip('volume ≈ ' + Math.round((W * H - cw * ch) * D / 1000) + ' cm³', BLUE)); info.set('Chaque vue montre l’objet sous un angle. Les <b>traits interrompus verts</b> sont des arêtes <b>cachées</b>. Les lignes fines relient les vues : elles restent alignées.');
  }
  draw();
}
function echelleDessin(el) {
  var svg = ui.stage(el, 400, 220, 'Échelle d’un dessin'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), k = 1, R = 60;
  ui.tabs(el, [['1', '1 : 1'], ['0.5', '1 : 2'], ['0.2', '1 : 5'], ['2', '2 : 1']], function (v) { k = +v; paint(); });
  function nm() { return k < 1 ? 'réduction' : (k === 1 ? 'vraie grandeur' : 'agrandissement'); }
  function paint() { chips.set(ui.chip('échelle ' + (k < 1 ? '1 : ' + (1 / k) : k + ' : 1'), AMBER) + ui.chip(nm(), BLUE)); info.set('Longueur sur le dessin = longueur réelle × échelle. Ici : ' + R + ' mm × ' + k + ' = <b>' + fm(R * k, 0) + ' mm</b> sur le papier. <b>La cote écrite reste toujours la dimension réelle.</b>'); draw(); }
  function draw() {
    dyn.replaceChildren(); var g = dyn, px = 2.5, x0 = 30, y = 80; ln(g, x0, 170, x0 + 300, 170, '#37536b', 1.6);
    for (var m = 0; m <= 120; m += 10) { ln(g, x0 + m * px, 170, x0 + m * px, m % 50 === 0 ? 180 : 175, '#37536b', 1.4); if (m % 50 === 0) txt(g, x0 + m * px, 194, m + ' mm', '#7e9bb2', 'middle', 8.5); }
    txt(g, 24, 212, 'règle graduée (papier)', '#7e9bb2', 'start', 8.5);
    S('rect', { x: x0, y: 26, width: R * px, height: 14, rx: 2, style: 'fill:none;stroke:#7e9bb2;stroke-width:1.4;stroke-dasharray:4 3' }, g); txt(g, x0 + R * px + 6, 38, 'objet réel : 60 mm', '#7e9bb2', 'start', 9);
    var L = R * k * px; S('rect', { x: x0, y: y, width: L, height: 36, rx: 3, style: 'fill:' + AMBER + ';fill-opacity:.25;stroke:#fff;stroke-width:3' }, g); circ(g, x0 + L * .75, y + 18, Math.max(2, 9 * k), '#fff', .1, 2.4);
    ln(g, x0, y + 52, x0 + L, y + 52, BLUE, 1.4); ln(g, x0, y + 46, x0, y + 58, BLUE, 1.2); ln(g, x0 + L, y + 46, x0 + L, y + 58, BLUE, 1.2); txt(g, x0 + L / 2, y + 70, '60', BLUE, 'middle', 11, true);
    txt(g, x0 + L + 8, y + 22, 'sur le papier : ' + fm(R * k, 0) + ' mm', AMBER, 'start', 10, true);
  }
  paint();
}
function formatsPapier(el) {
  var svg = ui.stage(el, 400, 240, 'Formats A0 à A4'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), idx = 4, F = [['A0', 841, 1189], ['A1', 594, 841], ['A2', 420, 594], ['A3', 297, 420], ['A4', 210, 297]];
  ui.slider(el, { label: 'Format', min: 0, max: 4, value: 4, step: 1, color: AMBER, fmt: function (v) { return F[v][0]; } }, function (v) { idx = v; paint(); });
  function paint() { var f = F[idx]; chips.set(ui.chip(f[0] + ' : ' + f[1] + ' × ' + f[2] + ' mm', AMBER) + ui.chip(idx < 4 ? '= 2 × ' + F[idx + 1][0] : 'format de base', BLUE)); info.set('Un format se <b>coupe en deux</b> pour donner le suivant : A3 = 2 × A4. Tout dessin porte un <b>cartouche</b> (nom, échelle, date) dans un coin.'); draw(); }
  function draw() {
    dyn.replaceChildren(); var g = dyn, sc = 200 / 1189, bx = 40, by = 220;
    F.forEach(function (f, i) { var w = f[1] * sc, h = f[2] * sc, on = i === idx; S('rect', { x: bx, y: by - h, width: w, height: h, style: 'fill:' + (on ? AMBER : 'none') + ';fill-opacity:.2;stroke:' + (on ? AMBER : '#37536b') + ';stroke-width:' + (on ? 3 : 1.4) }, g); txt(g, bx + w - 4, by - h + 12, f[0], on ? '#fff' : '#7e9bb2', 'end', on ? 11 : 8.5, on); });
    var f = F[idx], w = f[1] * sc, h = f[2] * sc; S('rect', { x: bx + w - 38, y: by - 12, width: 38, height: 12, style: 'fill:' + BLUE + ';fill-opacity:.25;stroke:' + BLUE + ';stroke-width:1.4' }, g); txt(g, bx + w - 19, by - 3, 'cartouche', '#fff', 'middle', 6);
    dim(g, bx, bx + w, by + 14, f[1] + ' mm', AMBER); dimV(g, bx - 14, by - h, by, f[2], AMBER);
    var s2 = 300 / 297; S('rect', { x: 230, y: 40, width: 110, height: 78, style: 'fill:none;stroke:#37536b;stroke-width:1.4;stroke-dasharray:4 3' }, g); txt(g, 285, 34, 'A3 = 2 × A4', '#9fb8cc', 'middle', 9); ln(g, 285, 40, 285, 118, AMBER, 1.6, '4 3'); txt(g, 258, 84, 'A4', '#fff', 'middle', 10); txt(g, 312, 84, 'A4', '#fff', 'middle', 10);
  }
  paint();
}
function erreursCotation(el) {
  var d = function (n, s) { return function (g) { rect(g, 20, 28, 360, 80, BLUE, .08, 4, 1.8); txt(g, 200, 62, n, '#fff', 'middle', 12.5, true); txt(g, 200, 90, s, '#9fb8cc', 'middle', 10.5); }; };
  classify(el, 'Cotation : correct ou erreur ?', [
    { name: 'Cote placée au-dessus de la ligne de cote', cat: 0, why: 'Règle respectée.', draw: d('Cote au-dessus de la ligne', 'lisible, sans croiser un trait') },
    { name: 'Ligne de cote tracée en trait fort', cat: 1, why: 'Elle doit être en trait continu fin.', draw: d('Ligne de cote en trait fort', 'épaisse comme le contour') },
    { name: 'La même cote écrite deux fois', cat: 1, why: 'Chaque cote est inscrite une seule fois.', draw: d('Cote répétée', '60 et 60 sur la même longueur') },
    { name: 'Ligne d’attache en trait fin', cat: 0, why: 'Règle respectée.', draw: d('Ligne d’attache en trait fin', 'prolonge le contour') },
    { name: 'Cote écrite sur le contour de la pièce', cat: 1, why: 'On la place en dehors de la pièce.', draw: d('Cote sur le contour', 'chevauche un trait fort') },
    { name: 'Flèches aux deux extrémités de la cote', cat: 0, why: 'Règle respectée.', draw: d('Deux flèches', 'aux extrémités de la ligne de cote') },
    { name: 'Dessin à l’échelle 2:1 avec la cote réduite de moitié', cat: 1, why: 'La cote reste la dimension réelle.', draw: d('Cote modifiée selon l’échelle', 'jamais') },
    { name: 'Dimensions en mm sans écrire « mm »', cat: 0, why: 'L’unité est précisée une fois pour toutes.', draw: d('Cotes sans unité', 'unité indiquée au cartouche') }
  ], ['Correct', 'Erreur'], 'Respecte-t-elle les règles ?');
}
function typesDessin(el) {
  var d = function (n) { return function (g) { rect(g, 15, 24, 370, 90, AMBER, .08, 4, 1.8); txt(g, 200, 75, n, '#fff', 'middle', 12, true); }; };
  classify(el, 'Quel type de représentation ?', [
    { name: 'Dessin rapide à main levée, sans instruments', cat: 0, why: 'C’est un croquis.', draw: d('Dessin rapide à main levée') },
    { name: 'Symboles et liaisons d’un circuit électrique', cat: 1, why: 'C’est un schéma.', draw: d('Symboles et liaisons') },
    { name: 'Toutes les pièces d’un mécanisme assemblées', cat: 2, why: 'C’est un dessin d’ensemble.', draw: d('Pièces assemblées') },
    { name: 'Une seule pièce, avec toutes ses cotes', cat: 3, why: 'C’est un dessin de définition.', draw: d('Une pièce, toutes les cotes') },
    { name: 'Vue 3D : face en vraie grandeur, fuyantes à 45°', cat: 4, why: 'C’est la perspective cavalière.', draw: d('Face vraie, fuyantes 45°') },
    { name: 'Pièces écartées le long de leurs axes de montage', cat: 5, why: 'C’est la perspective éclatée.', draw: d('Pièces écartées sur l’axe') }
  ], ['Croquis', 'Schéma', 'D. d’ensemble', 'D. de définition', 'Cavalière', 'Éclatée'], 'Que montre-t-il ?');
}
function eclatee(el) {
  var svg = ui.stage(el, 400, 220, 'Perspective éclatée d’un assemblage boulonné'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), k = 0, t = 0;
  ui.slider(el, { label: 'Éclatement', min: 0, max: 100, value: 0, step: 5, color: AMBER, fmt: function (v) { return v + ' %'; } }, function (v) { k = v / 100; paint(); });
  function paint() { chips.set(ui.chip(k < .05 ? 'assemblé' : 'éclaté ' + Math.round(k * 100) + ' %', AMBER)); info.set('La perspective <b>éclatée</b> écarte les pièces <b>le long de leur axe de montage</b> pour voir chacune et l’ordre d’assemblage.'); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var g = dyn, y = 100, o = [-50, -16, 20, 56, 96].map(function (v) { return v * k; });
    ln(g, 14, y, 386, y, AMBER, 1.4, '10 3 2 3'); txt(g, 386, y - 6, 'axe de montage', AMBER, 'end', 8);
    function R(x, yy, w, hh, col, name, ly) { S('rect', { x: x, y: yy, width: w, height: hh, rx: 1.5, style: 'fill:' + col + ';fill-opacity:.25;stroke:' + col + ';stroke-width:2' }, g); if (k > .2) txt(g, x + w / 2, ly, name, '#fff', 'middle', 8.5); }
    R(60 + o[1], y - 36, 30, 72, BLUE, 'plaque 1', y - 46); R(110 + o[2], y - 36, 30, 72, GREEN, 'plaque 2', y + 54); R(150 + o[3], y - 22, 8, 44, '#9fb8cc', 'rondelle', y - 32);
    R(160 + o[4], y - 18, 24, 36, AMBER, 'écrou', y + 34);
    R(30 + o[0], y - 18, 20, 36, RED, 'vis', y - 28); R(50 + o[0], y - 6, 106, 12, RED, '', 0);
    if (k > .2) for (var i = 0; i < 5; i++) { }
  }); paint();
}
PC.chapter({ id: 't3-10', lazy: true, eyebrow: EY + 'Module 4 · Dessin technique', title: 'Dessin technique', ar: 'الرسم التقني',
  lessons: function () { return [
    { short: 'Les traits', title: 'Les traits normalisés', intro: 'Chaque trait a un rôle précis.', build: lignesNormalisees,
      retenir: ['<b>Fort continu</b> : visible. <b>Interrompu</b> : caché.', '<b>Mixte fin</b> : axes. <b>Continu fin</b> : cotes.'],
      ar: { e: ['لكل خط دور: الغليظ المتصل للمرئي، المتقطع للمخفي، المختلط للمحاور، الرفيع للقياسات.'], u: 'اختر نوع الخط.', w: [['trait', 'خط'], ['cote', 'قياس'], ['axe', 'محور']] } },
    { short: 'Classer les traits', title: 'Quel trait ?', intro: 'Associe chaque élément à son trait.', build: classerTraits,
      retenir: ['Un mauvais trait rend le dessin ambigu.'],
      ar: { e: ['الخط الخاطئ يجعل الرسم غامضا.'], u: 'صنّف.', w: [['visible', 'مرئي'], ['caché', 'مخفي']] } },
    { short: 'Vues et cavalière', title: 'Perspective et vues', intro: 'Modifie l’objet : les trois vues suivent.', build: vuesProjection,
      retenir: ['La <b>perspective cavalière</b> : face vraie, fuyantes à 45°.', 'Les vues sont <b>alignées</b> ; les arêtes cachées sont en traits interrompus.'],
      ar: { e: ['المنظور الفارسي: الوجه الأمامي بحجمه الحقيقي والخطوط الهاربة بزاوية 45°، والمساقط متراصفة.'], u: 'غيّر الأبعاد.', w: [['vue de face', 'مسقط أمامي'], ['vue de dessus', 'مسقط أفقي'], ['perspective cavalière', 'منظور فارسي']] } },
    { short: 'Échelle', title: 'L’échelle', intro: 'Agrandis ou réduis : que devient la cote ?', build: echelleDessin,
      retenir: ['Dessin = réel × échelle.', '1:2 réduit, 2:1 agrandit. <b>La cote reste la valeur réelle.</b>'],
      ar: { e: ['طول الرسم = الطول الحقيقي × السلّم، والقياس المكتوب هو دائما القياس الحقيقي.'], u: 'غيّر السلّم.', w: [['échelle', 'سلّم']] } },
    { short: 'Formats', title: 'Les formats de papier', intro: 'De A0 à A4, on coupe en deux.', build: formatsPapier,
      retenir: ['A4 : 210 × 297 mm.', 'Chaque format = 2 fois le suivant.', 'Le <b>cartouche</b> identifie le dessin.'],
      ar: { e: ['كل حجم ورق ضعف الحجم الذي يليه، وللرسم إطار تعريفي يسمى الكارتوش.'], u: 'غيّر الحجم.', w: [['format', 'حجم الورقة'], ['cartouche', 'إطار التعريف']] } },
    { short: 'Cotation', title: 'Règles de cotation', intro: 'Bonne ou mauvaise cotation ?', build: erreursCotation,
      retenir: ['Ligne de cote en trait fin avec deux flèches.', 'Une cote une seule fois, hors du contour.'],
      ar: { e: ['خط القياس رفيع بسهمين، وكل قياس يُكتب مرة واحدة خارج حدود القطعة.'], u: 'صنّف.', w: [['cotation', 'وضع القياسات']] } },
    { short: 'Types de dessins', title: 'Les types de représentation', intro: 'Croquis, schéma, ensemble, définition…', build: typesDessin,
      retenir: ['<b>Croquis</b> : main levée. <b>Schéma</b> : symboles.', '<b>Ensemble</b> : tout assemblé. <b>Définition</b> : une pièce.'],
      ar: { e: ['الرسم الأولي باليد، المخطط بالرموز، الرسم الإجمالي للتجميع، رسم التعريف لقطعة واحدة.'], u: 'اختر.', w: [['croquis', 'رسم أولي'], ['schéma', 'مخطط']] } },
    { short: 'Éclatée', title: 'Perspective éclatée', intro: 'Écarte les pièces sur leur axe.', build: eclatee,
      retenir: ['Les pièces sont écartées sur leur <b>axe de montage</b>.', 'Elle montre l’ordre d’assemblage.'],
      ar: { e: ['المنظور المفكَّك يباعد القطع على محور التركيب لإظهار ترتيب التجميع.'], u: 'حرّك المنزلق.', w: [['éclatée', 'مفكَّك']] } }
  ]; },
  quiz: [
    { q: 'Les arêtes cachées se tracent en :', o: ['trait interrompu fin', 'trait fort continu', 'trait mixte'], a: 0, e: 'Interrompu fin.' },
    { q: 'L’axe d’un cylindre se trace en :', o: ['trait mixte fin', 'trait fort', 'trait interrompu'], a: 0, e: 'Tiret – point.' },
    { q: 'Échelle 2:1 : une pièce de 30 mm mesure sur le dessin :', o: ['60 mm', '15 mm', '30 mm'], a: 0, e: '30 × 2.' },
    { q: 'En perspective cavalière, les fuyantes sont tracées à :', o: ['45°', '90°', '10°'], a: 0, e: 'Avec un coefficient 1/2.' },
    { q: 'Un format A3 vaut :', o: ['2 × A4', '4 × A4', '1/2 A4'], a: 0, e: 'Chaque format double.' }
  ]
});
