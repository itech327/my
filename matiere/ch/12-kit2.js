/* ----- Kit 2 : lampe, rotation, courbes, jeu « associer » réutilisables ----- */
function sLamp(g, x, y, glow, lab, w) {
  w = w || 48; ln(g, x - w / 2, y, x - 13, y, WIRE, 2); ln(g, x + 13, y, x + w / 2, y, WIRE, 2);
  if (glow > 0.02) circ(g, x, y, 14 + 18 * glow, AMBER, .12 + .3 * glow, 0);
  circ(g, x, y, 13, glow > 0.9 ? AMBER : WIRE, .08, 2); ln(g, x - 9, y - 9, x + 9, y + 9, WIRE, 1.8); ln(g, x - 9, y + 9, x + 9, y - 9, WIRE, 1.8);
  if (lab) label(g, x, y + 28, lab);
}
/* boucle rectangulaire standard : pile en bas, composants en haut (x=170 et x=270) */
var RING = [[170, 170], [30, 170], [30, 70], [146, 70], [194, 70], [246, 70], [294, 70], [340, 70], [340, 170], [210, 170]];
function ring(g) { wire(g, RING.slice(0, 4), WIRE, 2); wire(g, RING.slice(4), WIRE, 2); ln(g, 194, 70, 246, 70, WIRE, 2); }
/* jeu : associer un élément proposé à l'une des cases touchées */
function matchGame(el, svg, cfg) {
  /* cfg: items [{name, key, why}], zones [{key, el(hot target), mark(fn on/off)}], explain mode text */
  var info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el), mode = 'explorer', queue = [], ok = 0, n = cfg.items.length;
  function paint() {
    if (mode === 'explorer') { chips.set(ui.chip(cfg.zones.length + ' éléments', BLUE)); return; }
    chips.set(queue.length ? ui.chip('Trouve la case de : ' + queue[0].name, AMBER) + ui.chip(ok + ' / ' + n, BLUE) : ui.chip('Terminé : ' + ok + ' / ' + n, GREEN));
  }
  function reset() { cfg.zones.forEach(function (z) { z.mark(0); }); }
  function pick(z) {
    if (mode === 'explorer') { reset(); z.mark(1); var it = cfg.items.filter(function (i) { return i.key === z.key; })[0]; info.set('<b>' + z.title + '</b> : ' + (it ? it.name + '. ' + it.why : '')); return; }
    if (!queue.length) return;
    if (queue[0].key === z.key) { ok++; z.mark(2); verd.set('Exact.', 'ok'); info.set(queue[0].why); queue.shift(); if (!queue.length) verd.set('Terminé : ' + ok + ' / ' + n + '.', 'ok'); }
    else { verd.set('Non. Réfléchis à la fonction.', ''); }
    paint();
  }
  cfg.zones.forEach(function (z) { hot(z.el, function () { pick(z); }, z.title); });
  ui.tabs(el, [['explorer', 'Explorer'], ['jeu', 'Jeu']], function (k) {
    mode = k; reset(); verd.set('', ''); ok = 0;
    if (k === 'jeu') { queue = PC.shuffle(cfg.items.slice()); info.set('Touche la case qui correspond au composant affiché.'); } else info.set(cfg.intro);
    paint();
  });
  info.set(cfg.intro); paint();
}
/* jeu de classement : items [{name, cat (index), why, draw(g)}], cats [libellés] */
function classify(el, label, items, cats, hint) {
  var svg = ui.stage(el, 400, 150, label), dyn = S('g', null, svg);
  var info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el), ctl = ui.controls(el);
  var order = PC.shuffle(items.map(function (_, i) { return i; })), cur = 0, score = 0, locked = false, btns = [];
  cats.forEach(function (c, k) { btns.push(ui.btn(ctl, c, function () { answer(k); })); });
  var rs = ui.btn(ctl, 'Recommencer', function () { order = PC.shuffle(order); cur = 0; score = 0; rs.hidden = true; show(); }); rs.hidden = true;
  function show() {
    verd.set('', ''); locked = false; dyn.replaceChildren(); btns.forEach(function (b) { b.hidden = false; });
    if (cur >= order.length) { chips.set(ui.chip('Score ' + score + ' / ' + order.length, AMBER)); verd.set('Terminé : ' + score + ' / ' + order.length + '.', score >= order.length - 1 ? 'ok' : ''); btns.forEach(function (b) { b.hidden = true; }); rs.hidden = false; return; }
    var it = items[order[cur]]; if (it.draw) it.draw(dyn); else { rect(dyn, 60, 40, 280, 60, AMBER, .08, 4, 1.8); txt(dyn, 200, 78, it.name, '#fff', 'middle', 17, true); }
    chips.set(ui.chip((cur + 1) + ' / ' + order.length, BLUE) + ui.chip('Score ' + score, AMBER)); info.set(hint || 'Classe cet élément.');
  }
  function answer(k) {
    if (locked) return; locked = true; var it = items[order[cur]], ok = it.cat === k; if (ok) score++;
    verd.set(ok ? 'Exact.' : 'Non : ' + cats[it.cat] + '.', ok ? 'ok' : ''); info.set('<b>' + it.name + '.</b> ' + it.why); cur++; setTimeout(show, 1400);
  }
  show();
}
/* jeu d'ordre : touche les étapes dans le bon ordre. steps: [libellés dans l'ordre correct] */
function ordering(el, label, steps, hint) {
  var svg = ui.stage(el, 400, 130, label), dyn = S('g', null, svg), info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el), ctl = ui.controls(el);
  var n = steps.length, placed = 0, btns = [];
  var rs = ui.btn(ctl, 'Recommencer', function () { placed = 0; verd.set('', ''); build(); }); rs.hidden = true;
  function draw() {
    dyn.replaceChildren(); var x0 = 30, dx = (340) / (n - 1); ln(dyn, x0, 70, x0 + 340, 70, '#2a4660', 2);
    for (var i = 0; i < n; i++) { var on = i < placed; circ(dyn, x0 + dx * i, 70, 12, on ? GREEN : BLUE, on ? .3 : .08, 2); txt(dyn, x0 + dx * i, 75, String(i + 1), on ? '#fff' : '#7e9bb2', 'middle', 11, true); }
    txt(dyn, 200, 30, placed ? steps[placed - 1] : 'Commence par la première étape', placed ? GREEN : '#9fb8cc', 'middle', 12, true);
    info.set(placed ? '<b>Étapes :</b> ' + steps.slice(0, placed).map(function (s, i) { return (i + 1) + '. ' + s; }).join(' · ') : (hint || 'Touche les étapes dans l’ordre.'));
    chips.set(ui.chip(placed + ' / ' + n, placed === n ? GREEN : BLUE));
  }
  function build() {
    ctl.querySelectorAll('.ord').forEach(function (b) { b.remove(); }); btns = []; rs.hidden = true;
    PC.shuffle(steps.map(function (_, i) { return i; })).forEach(function (k) {
      var b = ui.btn(ctl, steps[k], function () {
        if (k === placed) { placed++; b.hidden = true; verd.set('Exact.', 'ok'); if (placed === n) { verd.set('Bravo : toutes les étapes dans l’ordre.', 'ok'); rs.hidden = false; } } else { verd.set('Ce n’est pas l’étape suivante.', ''); }
        draw();
      }); b.classList.add('ord'); ctl.insertBefore(b, rs); btns.push(b);
    });
    draw();
  }
  build();
}
/* explication guidée : étapes avec texte court, lecture auto, dessin par image draw(g, étape, temps) */
function narrated(el, w, hh, label, steps, draw) {
  var svg = ui.stage(el, w, hh, label), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), ctl = ui.controls(el);
  var k = 0, t = 0, auto = false, acc = 0, n = steps.length;
  var pb = ui.btn(ctl, '◀ Précédent', function () { go(k - 1); }), nb = ui.btn(ctl, 'Suivant ▶', function () { go(k + 1); }), ab = ui.btn(ctl, '▶ Lecture auto', function () { auto = !auto; acc = 0; ab.textContent = auto ? '❚❚ Pause' : '▶ Lecture auto'; });
  function go(i) { k = (i + n) % n; acc = 0; paint(); if (steps[k].enter) steps[k].enter(); }
  function paint() {
    chips.set(steps.map(function (s, i) { return ui.chip((i + 1) + ' · ' + s.t, i === k ? AMBER : 'var(--line)'); }).join(''));
    info.set('<b>' + steps[k].t + '.</b> ' + steps[k].d);
  }
  PC.anim(svg, function (dt) {
    t += dt; if (auto) { acc += dt; if (acc > 4.2) go(k + 1); }
    dyn.replaceChildren(); draw(dyn, k, t, dt);
  });
  paint();
  return { go: go };
}
