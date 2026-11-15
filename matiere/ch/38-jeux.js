/* ===================================================== JEUX (3e année)
   1. Tri express : renouvelable ou non, contre la montre.
   2. Chrono-défi : remettre cinq inventions dans l'ordre.
   3. Alimente la ville : un mix énergétique sur 24 h, avec budget et plafond de CO₂ (modèle simplifié). */
function jeuxGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
function jeuxSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function jeuxShuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function jeuxWrap(s, n) { var w = s.split(' '), l = [], c = ''; w.forEach(function (x) { if ((c + ' ' + x).trim().length > n && c) { l.push(c); c = x; } else c = (c + ' ' + x).trim(); }); if (c) l.push(c); return l; }

/* ---------- 1. Tri express ---------- */
var TRI_ITEMS = [
  ['Soleil', 'centrale Noor, Ouarzazate', 1, 'Le Soleil brille chaque jour : renouvelable.'],
  ['Vent', 'parc éolien de Tarfaya', 1, 'Le vent se renouvelle sans cesse : renouvelable.'],
  ['Eau d’un barrage', 'barrage Al Massira', 1, 'Le cycle de l’eau se renouvelle : renouvelable.'],
  ['Biomasse', 'bois et déchets agricoles', 1, 'On peut en produire en continu : renouvelable.'],
  ['Chaleur de la Terre', 'géothermie', 1, 'La chaleur du sous-sol est inépuisable à notre échelle : renouvelable.'],
  ['Vagues et marées', 'énergie marine', 1, 'La mer bouge sans cesse : renouvelable.'],
  ['Panneaux sur un toit', 'photovoltaïque', 1, 'Ils captent le Soleil : renouvelable.'],
  ['Chauffe-eau solaire', 'capteur plan', 1, 'Il utilise la chaleur du Soleil : renouvelable.'],
  ['Pétrole', 'puits de pétrole', 0, 'Il a mis des millions d’années à se former : non renouvelable.'],
  ['Charbon', 'mine de charbon', 0, 'Le stock est limité : non renouvelable.'],
  ['Gaz naturel', 'gazoduc', 0, 'Énergie fossile à stock limité : non renouvelable.'],
  ['Uranium', 'centrale nucléaire', 0, 'Le minerai est en quantité limitée : non renouvelable.'],
  ['Essence', 'station-service', 0, 'Elle vient du pétrole : non renouvelable.'],
  ['Gasoil', 'camion, tracteur', 0, 'Il vient du pétrole : non renouvelable.'],
  ['Gaz butane', 'bouteille de gaz', 0, 'Il vient du pétrole ou du gaz : non renouvelable.']
];
var TRI_DEF = { id: '', title: 'Tri express', items: TRI_ITEMS, L: 'Renouvelable', LS: 'inépuisable', R: 'Non renouvelable', RS: 'stock limité', sub: 'Renouvelable ou non ? 60 s, 3 vies', how: 'Chaque carte tombe vers le bas : classe-la avant qu’elle arrive. <b>Gauche</b> : renouvelable. <b>Droite</b> : non renouvelable.', play: 'Touche la <b>moitié gauche</b> (renouvelable) ou <b>droite</b> (non renouvelable) avant que la carte tombe.' };
function triExpress(el) { triPlay(el, TRI_DEF); }
function triPlay(el, cfg) {
  var svg = ui.stage(el, 400, 336, cfg.title), dyn = S('g', null, svg), hit = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), ctl = ui.controls(el);
  var state = 'ready', left = 60, lives = 3, score = 0, streak = 0, BK = 'tech_tri_' + (cfg.id || 'best'), best = jeuxGet(BK, 0), deck = [], card = null, fb = null, over = null;
  function next() { if (!deck.length) deck = jeuxShuffle(cfg.items); card = { it: deck.pop(), y: 40 }; }
  function paintChips() { chips.set(ui.chip('Score : ' + score, GREEN) + ui.chip('Vies : ' + lives, lives > 1 ? BLUE : RED) + ui.chip('Meilleur : ' + best, '#9fb8cc', true)); }
  function start() { state = 'play'; left = 60; lives = 3; score = 0; streak = 0; deck = []; fb = null; over = null; next(); paintChips(); info.set(cfg.play); }
  function finish(why) {
    state = 'over'; if (score > best) { best = score; jeuxSet(BK, best); }
    var st = score >= 15 ? '★★★' : (score >= 10 ? '★★☆' : (score >= 5 ? '★☆☆' : '☆☆☆'));
    over = { why: why, st: st }; paintChips(); info.set('<b>' + st + ' ' + score + ' bonnes réponses.</b> ' + why + ' Touche la figure pour rejouer.');
  }
  function answer(ren) {
    if (state !== 'play' || !card) return;
    var it = card.it, ok = (it[2] === 1) === ren;
    if (ok) { score++; streak++; fb = { ok: true, side: ren, t: .45 }; info.set('<b>✓ ' + it[0] + '</b> : ' + it[3]); }
    else { lives--; streak = 0; fb = { ok: false, side: ren, t: .45 }; info.set('<b>✗ ' + it[0] + '</b> : ' + it[3]); }
    paintChips(); if (lives <= 0) { finish('Plus de vies.'); return; } next();
  }
  var pf = S('rect', { x: 14, y: 30, width: 372, height: 196, tabindex: 0, role: 'button', 'aria-label': 'Zone de jeu : moitié gauche ' + cfg.L + ', moitié droite ' + cfg.R, style: 'touch-action:manipulation;fill:#fff;fill-opacity:0' }, hit);
  pf.addEventListener('pointerdown', function (e) {
    e.preventDefault(); if (state !== 'play') { start(); return; }
    var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; var m = svg.getScreenCTM(); var x = m ? pt.matrixTransform(m.inverse()).x : 0; answer(x < 200);
  });
  pf.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') { e.preventDefault(); answer(true); } else if (e.key === 'ArrowRight') { e.preventDefault(); answer(false); } else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (state !== 'play') start(); } });
  [[14, true], [206, false]].forEach(function (b) {
    var r = S('rect', { x: b[0], y: 240, width: 180, height: 80, rx: 12, tabindex: 0, role: 'button', 'aria-label': b[1] ? cfg.L : cfg.R, style: 'touch-action:manipulation;fill:#fff;fill-opacity:0;cursor:pointer' }, hit);
    r.addEventListener('pointerdown', function (e) { e.preventDefault(); if (state !== 'play') start(); else answer(b[1]); });
    r.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (state !== 'play') start(); else answer(b[1]); } });
  });
  PC.anim(svg, function (dt, t) {
    dyn.replaceChildren();
    S('rect', { x: 14, y: 30, width: 372, height: 196, rx: 10, style: 'fill:#0a121b;stroke:#2a4660;stroke-width:1.6' }, dyn); ln(dyn, 200, 34, 200, 222, '#2a4660', 1.4, '4 5');
    if (state === 'play') {
      left -= dt; var spd = Math.min(120, 34 + score * 3.2 + (60 - left) * .5); card.y += spd * dt;
      if (left <= 0) finish('Temps écoulé.');
      else if (card.y > 190) { lives--; streak = 0; info.set('<b>Trop lent</b> : ' + card.it[0] + ' — ' + card.it[3]); fb = { ok: false, side: card.it[2] === 1, t: .45 }; paintChips(); if (lives <= 0) finish('Plus de vies.'); else next(); }
    }
    if (fb) { fb.t -= dt; if (fb.t <= 0) fb = null; }
    [[14, true, cfg.L, GREEN, cfg.LS], [206, false, cfg.R, AMBER, cfg.RS]].forEach(function (b) {
      var on = fb && fb.side === b[1], c = on ? (fb.ok ? GREEN : RED) : b[3];
      S('rect', { x: b[0], y: 240, width: 180, height: 80, rx: 12, style: 'fill:' + c + ';fill-opacity:' + (on ? .45 : .14) + ';stroke:' + c + ';stroke-width:' + (on ? 4 : 2.4) }, dyn);
      txt(dyn, b[0] + 90, 274, b[2], INK, 'middle', 15, true); txt(dyn, b[0] + 90, 296, b[4], '#9fb8cc', 'middle', 10.5);
    });
    txt(dyn, 22, 22, 'Temps ' + Math.max(0, Math.ceil(left)) + ' s', left < 10 && state === 'play' ? RED : '#9fb8cc', 'start', 11, true); txt(dyn, 340, 22, state === 'play' ? 'Série : ' + streak : cfg.title, '#9fb8cc', 'end', 11, true);
    for (var i = 0; i < 3; i++) txt(dyn, 175 + i * 18, 22, '♥', i < lives ? RED : '#2a4660', 'middle', 14);
    if (state === 'play' && card) {
      var y = card.y, it = card.it; S('rect', { x: 70, y: y, width: 260, height: 50, rx: 10, style: 'fill:#122030;stroke:' + BLUE + ';stroke-width:2.2' }, dyn);
      txt(dyn, 200, y + 22, it[0], INK, 'middle', 15, true); txt(dyn, 200, y + 40, it[1], '#9fb8cc', 'middle', 10.5);
    } else {
      S('rect', { x: 60, y: 90, width: 280, height: 86, rx: 12, style: 'fill:#0d1620;fill-opacity:.94;stroke:' + AMBER + ';stroke-width:2.4' }, dyn);
      txt(dyn, 200, 122, state === 'over' ? over.st + '  ' + score : cfg.title, AMBER, 'middle', 20, true);
      txt(dyn, 200, 148, state === 'over' ? over.why : cfg.sub, '#cfe3f2', 'middle', 11.5); txt(dyn, 200, 166, 'Touche pour ' + (state === 'over' ? 'rejouer' : 'commencer'), '#9fb8cc', 'middle', 10.5);
    }
  });
  paintChips(); info.set(cfg.how);
}

/* ---------- 2. Chrono-défi ---------- */
var CHR_EV = [
  ['Noria\n(roue à eau)', 'Antiquité', -300], ['Machine à vapeur\nde Watt', '1769', 1769], ['Moteur\nélectrique', 'vers 1830', 1834], ['Ampoule\nélectrique', '1879', 1879],
  ['Robot industriel\nUnimate', '1961', 1961], ['Microprocesseur', '1971', 1971], ['Premiers\nsmartphones tactiles', '2007', 2007], ['Premier site\nweb', '1991', 1991]
];
var CHR_DEF = { id: 'chrono', title: 'Chrono-défi', ev: CHR_EV, a: 'plus ancien', b: 'plus récent', how: 'Touche une carte, puis un emplacement de la frise : du <b>plus ancien</b> (à gauche) au <b>plus récent</b> (à droite).', win: 'Chaque étape ajoute une source d’énergie ou un moyen de commande : eau, vapeur, électricité, puis calcul.' };
function chronoDefi(el) { chronoPlay(el, CHR_DEF); }
function chronoPlay(el, cfg) {
  var svg = ui.stage(el, 400, 330, cfg.title), dyn = S('g', null, svg), hit = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), ctl = ui.controls(el);
  var cards, slot, sel, res, tries, t0, now, BK = 'tech_' + cfg.id + '_best', best = jeuxGet(BK, 0), finished;
  var SX = [59, 129, 199, 269, 339], TX = [[70, 196], [200, 196], [330, 196], [135, 256], [265, 256]];
  function init() { cards = jeuxShuffle(cfg.ev).slice(0, 5); slot = [-1, -1, -1, -1, -1]; sel = -1; res = null; tries = 0; t0 = null; now = 0; finished = false; info.set(cfg.how); paint(); }
  function paint() { chips.set(ui.chip('Essais : ' + tries, BLUE) + ui.chip('Meilleur : ' + (best ? best + ' s' : '—'), '#9fb8cc', true)); }
  var chk = ui.btn(ctl, 'Vérifier', function () {
    if (finished || slot.some(function (s) { return s < 0; })) { if (!finished) info.set('Place d’abord les cinq cartes.'); return; }
    tries++; res = slot.map(function (c, i) { return cards[c][2] === cards.map(function (x) { return x[2]; }).sort(function (a, b) { return a - b; })[i]; });
    var bad = res.filter(function (r) { return !r; }).length;
    if (!bad) { finished = true; var secs = Math.round(now); if (!best || secs < best) { best = secs; jeuxSet(BK, best); } var st = tries === 1 && secs <= 40 ? '★★★' : (tries <= 2 ? '★★☆' : '★☆☆'); info.set('<b>' + st + ' Ordre exact en ' + secs + ' s.</b> ' + cfg.win); }
    else info.set('<b>' + bad + ' carte' + (bad > 1 ? 's' : '') + ' mal placée' + (bad > 1 ? 's' : '') + '.</b> Les emplacements rouges sont faux : déplace-les et vérifie à nouveau.');
    paint();
  });
  ui.btn(ctl, 'Nouvelle série', init);
  TX.forEach(function (p, k) {
    var r = S('rect', { x: p[0] - 62, y: p[1] - 6, width: 124, height: 50, rx: 8, tabindex: 0, role: 'button', 'aria-label': 'Carte', style: 'touch-action:manipulation;cursor:pointer;fill:#fff;fill-opacity:0' }, hit);
    function go() { if (finished || slot.indexOf(k) > -1) return; if (t0 === null) t0 = performance.now(); sel = sel === k ? -1 : k; res = null; }
    r.addEventListener('pointerdown', function (e) { e.preventDefault(); go(); }); r.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
  SX.forEach(function (x, i) {
    var r = S('rect', { x: x - 33, y: 86, width: 66, height: 66, rx: 8, tabindex: 0, role: 'button', 'aria-label': 'Emplacement ' + (i + 1), style: 'touch-action:manipulation;cursor:pointer;fill:#fff;fill-opacity:0' }, hit);
    function go() {
      if (finished) return; res = null;
      if (sel > -1) { slot[i] = sel; sel = -1; } else if (slot[i] > -1) slot[i] = -1;
    }
    r.addEventListener('pointerdown', function (e) { e.preventDefault(); go(); }); r.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
  PC.anim(svg, function (dt, t) {
    dyn.replaceChildren(); if (t0 !== null && !finished) now = (performance.now() - t0) / 1000;
    txt(dyn, 24, 22, cfg.a, '#9fb8cc', 'start', 10.5, true); txt(dyn, 340, 22, cfg.b, '#9fb8cc', 'end', 10.5, true); txt(dyn, 200, 22, Math.floor(now) + ' s', AMBER, 'middle', 12, true);
    ln(dyn, 24, 60, 376, 60, '#4a647a', 3); S('path', { d: 'M366 53L378 60L366 67', style: 'fill:none;stroke:#4a647a;stroke-width:3;stroke-linecap:round' }, dyn);
    SX.forEach(function (x, i) {
      var c = slot[i], ok = res ? res[i] : null; circ(dyn, x, 60, 5, BLUE, 1, 2);
      S('rect', { x: x - 33, y: 86, width: 66, height: 66, rx: 8, style: 'fill:' + (ok === null ? '#0d1620' : (ok ? GREEN : RED)) + ';fill-opacity:' + (ok === null ? .9 : .22) + ';stroke:' + (ok === null ? (sel > -1 ? BLUE : '#2a4660') : (ok ? GREEN : RED)) + ';stroke-width:' + (sel > -1 && c < 0 ? 2.4 : 1.8) + ';stroke-dasharray:' + (c < 0 ? '4 4' : 'none') }, dyn);
      txt(dyn, x, 72, String(i + 1), '#6f8aa0', 'middle', 9);
      if (c > -1) { cards[c][0].split('\n').forEach(function (l, j, a) { txt(dyn, x, 114 + j * 12 - (a.length - 1) * 6, l, INK, 'middle', 8.6, true); }); if (res || finished) txt(dyn, x, 168, cards[c][1], ok === false ? RED : GREEN, 'middle', 10, true); }
    });
    TX.forEach(function (p, k) {
      var used = slot.indexOf(k) > -1, on = sel === k;
      S('rect', { x: p[0] - 62, y: p[1] - 6, width: 124, height: 50, rx: 8, style: 'fill:' + (used ? 'none' : (on ? AMBER : '#122030')) + ';fill-opacity:' + (on ? .25 : 1) + ';stroke:' + (used ? '#25384a' : (on ? AMBER : BLUE)) + ';stroke-width:' + (on ? 3 : 1.8) + ';stroke-dasharray:' + (used ? '3 4' : 'none') }, dyn);
      if (!used) cards[k][0].split('\n').forEach(function (l, j, a) { txt(dyn, p[0], p[1] + 19 + j * 13 - (a.length - 1) * 6, l, INK, 'middle', 10.5, true); });
    });
    txt(dyn, 200, 322, 'Carte puis emplacement · touche un emplacement rempli pour le vider', '#6f8aa0', 'middle', 8.2);
  });
  init();
}

/* ---------- 3. Alimente la ville (modèle simplifié, 24 h) ---------- */
var MIX_DEM = [560, 540, 530, 525, 530, 560, 640, 720, 780, 800, 810, 820, 830, 820, 810, 810, 840, 920, 1000, 1000, 960, 860, 730, 630];
var MIX_WIND = [.55, .58, .6, .58, .55, .5, .45, .38, .3, .25, .22, .2, .2, .22, .25, .3, .35, .4, .45, .5, .52, .55, .55, .56];
var MIX_SRC = [
  { k: 'sol', n: 'Solaire PV', c: 3, co2: 45, col: '#ffd24d', max: 8 }, { k: 'eol', n: 'Éolien', c: 3, co2: 11, col: '#4cc9f0', max: 6 },
  { k: 'hyd', n: 'Hydraulique', c: 4, co2: 24, col: '#5b8def', max: 3 }, { k: 'step', n: 'Stockage (STEP)', c: 4, co2: 0, col: '#b58cff', max: 4 },
  { k: 'gaz', n: 'Gaz naturel', c: 2, co2: 490, col: '#ff9a5a', max: 6 }, { k: 'cha', n: 'Charbon', c: 2, co2: 820, col: '#8795a1', max: 6 }
];
var MIX_LEVELS = [
  { n: 'Jour normal', w: 1, bud: 38, co2: 450, ren: 0, d: 'Un jour ordinaire.' },
  { n: 'Jour sans vent', w: .35, bud: 44, co2: 450, ren: 0, d: 'Le vent est presque tombé : l’éolien produit trois fois moins.' },
  { n: 'Objectif Maroc 2030', w: 1, bud: 46, co2: 350, ren: .52, d: 'Le Maroc vise 52 % d’électricité renouvelable en 2030.' }
];
function mixFill(def, cap, budget) {
  var out = def.map(function () { return 0; }), i; if (cap <= 0 || budget <= 0) return out;
  var lo = 0, hi = Math.max.apply(null, def);
  function tot(L) { var s = 0; for (i = 0; i < 24; i++) s += Math.min(cap, Math.max(0, def[i] - L)); return s; }
  if (tot(0) <= budget) { for (i = 0; i < 24; i++) out[i] = Math.min(cap, Math.max(0, def[i])); return out; }
  for (var k = 0; k < 40; k++) { var m = (lo + hi) / 2; if (tot(m) > budget) lo = m; else hi = m; }
  for (i = 0; i < 24; i++) out[i] = Math.min(cap, Math.max(0, def[i] - hi)); return out;
}
function mixSim(n, wm) {
  var i, sOut = [], wOut = [], def = [];
  for (i = 0; i < 24; i++) { var x = Math.sin(Math.PI * (i + .5 - 6.5) / 12.5); sOut[i] = n.sol * 100 * (x > 0 ? x : 0); wOut[i] = n.eol * 100 * MIX_WIND[i] * wm; def[i] = MIX_DEM[i] - sOut[i] - wOut[i]; }
  var sur = def.map(function (d) { return d < 0 ? Math.min(-d, n.step * 100) : 0; }), surE = sur.reduce(function (a, b) { return a + b; }, 0), stepE = Math.min(n.step * 600, surE * .8);
  var stp = mixFill(def.map(function (d) { return Math.max(0, d); }), n.step * 100, stepE), d2 = def.map(function (d, i) { return Math.max(0, d) - stp[i]; });
  var hyd = mixFill(d2, n.hyd * 100, n.hyd * 960), d3 = d2.map(function (d, i) { return d - hyd[i]; });
  var cha = d3.map(function (d) { return Math.min(Math.max(0, d), n.cha * 100); }), d4 = d3.map(function (d, i) { return d - cha[i]; });
  var gaz = d4.map(function (d) { return Math.min(Math.max(0, d), n.gaz * 100); }), d5 = d4.map(function (d, i) { return d - gaz[i]; });
  var H = [], black = 0, tot = { sol: 0, eol: 0, hyd: 0, step: 0, gaz: 0, cha: 0 };
  for (i = 0; i < 24; i++) {
    var s = Math.min(sOut[i], MIX_DEM[i]), w = Math.min(wOut[i], Math.max(0, MIX_DEM[i] - s)); if (d5[i] > 1) black++;
    H.push({ sol: s, eol: w, hyd: hyd[i], step: stp[i], gaz: gaz[i], cha: cha[i], miss: Math.max(0, d5[i]), lost: Math.max(0, sOut[i] + wOut[i] - MIX_DEM[i]) });
    tot.sol += s; tot.eol += w; tot.hyd += hyd[i]; tot.step += stp[i]; tot.gaz += gaz[i]; tot.cha += cha[i];
  }
  var served = tot.sol + tot.eol + tot.hyd + tot.step + tot.gaz + tot.cha;
  return { H: H, black: black, served: served, co2: served ? (tot.sol * 45 + tot.eol * 11 + tot.hyd * 24 + tot.gaz * 490 + tot.cha * 820) / served : 0, ren: served ? (tot.sol + tot.eol + tot.hyd + tot.step) / served : 0, cost: n.sol * 3 + n.eol * 3 + n.hyd * 4 + n.step * 4 + n.gaz * 2 + n.cha * 2 };
}
function mixVille(el) {
  var X0 = 40, X1 = 392, YT = 16, YB = 200, YM = 1200, svg = ui.stage(el, 400, 330, 'Alimente la ville'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el);
  var lv = 0, n = { sol: 2, eol: 2, hyd: 1, step: 0, gaz: 4, cha: 2 }, R = null, disp = [], done = jeuxGet('tech_mix_done', {}), sw = 0;
  for (var i0 = 0; i0 < 24; i0++) disp.push({ sol: 0, eol: 0, hyd: 0, step: 0, gaz: 0, cha: 0, miss: 0 });
  function ok() { var L = MIX_LEVELS[lv]; return { black: R.black === 0, bud: R.cost <= L.bud, co2: R.co2 <= L.co2, ren: R.ren >= L.ren }; }
  function update() {
    var L = MIX_LEVELS[lv]; R = mixSim(n, L.w); var c = ok(), all = c.black && c.bud && c.co2 && c.ren;
    var line = function (b, t) { return '<div>' + (b ? '✓ ' : '✗ ') + t + '</div>'; };
    var msg = '<b>' + L.n + '.</b> ' + L.d + line(c.black, R.black ? 'Coupures : ' + R.black + ' h sans assez d’électricité' : 'Aucune coupure sur les 24 h') + line(c.bud, 'Budget : ' + R.cost + ' / ' + L.bud + ' points') + line(c.co2, 'CO₂ : ' + fm(R.co2, 0) + ' g/kWh (maximum ' + L.co2 + ')') + (L.ren ? line(c.ren, 'Renouvelables : ' + fm(R.ren * 100, 0) + ' % (objectif ' + fm(L.ren * 100, 0) + ' %)') : '<div>Renouvelables : ' + fm(R.ren * 100, 0) + ' %</div>');
    if (all) { var st = R.co2 <= L.co2 * .6 ? '★★★' : (R.co2 <= L.co2 * .8 ? '★★☆' : '★☆☆'); msg += '<b>' + st + ' La ville est alimentée.</b>'; if (!done[lv]) { done[lv] = 1; jeuxSet('tech_mix_done', done); } }
    info.set(msg); chips.set(ui.chip('Niveaux réussis : ' + Object.keys(done).length + '/3', Object.keys(done).length ? GREEN : '#9fb8cc', true) + ui.chip('Budget ' + R.cost + '/' + L.bud, c.bud ? BLUE : RED));
  }
  ui.tabs(el, MIX_LEVELS.map(function (L, i) { return [String(i), L.n]; }), function (k) { lv = +k; update(); });
  MIX_SRC.forEach(function (s) {
    ui.slider(el, { label: s.n + ' · ' + s.c + ' pts · ' + s.co2 + ' g/kWh', min: 0, max: s.max, value: n[s.k], step: 1, color: s.col, fmt: function (v) { return v + ' × 100 MW'; } }, function (v) { n[s.k] = v; update(); });
  });
  PC.anim(svg, function (dt, t) {
    dyn.replaceChildren(); sw = (sw + dt * 1.6) % 24;
    var bw = (X1 - X0) / 24, yy = function (v) { return YB - v / YM * (YB - YT); }, KS = ['step', 'hyd', 'eol', 'sol', 'cha', 'gaz'];
    [0, 400, 800, 1200].forEach(function (g) { ln(dyn, X0, yy(g), X1, yy(g), '#1d3448', 1); txt(dyn, X0 - 4, yy(g) + 3, String(g), '#6f8aa0', 'end', 8.5); });
    txt(dyn, 8, 12, 'MW', '#6f8aa0', 'start', 8.5);
    for (var i = 0; i < 24; i++) {
      var h = R.H[i], d = disp[i], x = X0 + i * bw, base = 0;
      KS.forEach(function (k) { d[k] += (h[k] - d[k]) * Math.min(1, dt * 8); });
      d.miss += (h.miss - d.miss) * Math.min(1, dt * 8);
      KS.forEach(function (k) { var v = d[k]; if (v > .5) { S('rect', { x: x + .6, y: yy(base + v), width: bw - 1.2, height: Math.max(0, yy(base) - yy(base + v)), style: 'fill:' + MIX_SRC.filter(function (s) { return s.k === k; })[0].col }, dyn); base += v; } });
      if (d.miss > 2) S('rect', { x: x + .6, y: yy(base + d.miss), width: bw - 1.2, height: Math.max(0, yy(base) - yy(base + d.miss)), style: 'fill:' + RED + ';fill-opacity:.55;stroke:' + RED + ';stroke-width:1' }, dyn);
    }
    wire(dyn, MIX_DEM.map(function (v, i) { return [X0 + (i + .5) * bw, yy(v)]; }), '#ffffff', 2);
    [0, 6, 12, 18, 24].forEach(function (hh) { txt(dyn, X0 + hh * bw, YB + 13, hh + ' h', '#6f8aa0', 'middle', 8.5); });
    var cx = X0 + sw * bw; ln(dyn, cx, YT, cx, YB, '#ffffff', 1, '3 3'); txt(dyn, cx, YT - 3, Math.floor(sw) + ' h', '#cfe3f2', 'middle', 8.5);
    txt(dyn, X0 + 6, YT + 12, '— demande de la ville', '#ffffff', 'start', 8.5, true);
    /* légende */
    MIX_SRC.forEach(function (s, i) { var lx = 14 + (i % 3) * 128, ly = 232 + Math.floor(i / 3) * 16; S('rect', { x: lx, y: ly - 8, width: 10, height: 10, rx: 2, style: 'fill:' + s.col }, dyn); txt(dyn, lx + 14, ly, s.n, '#cfe3f2', 'start', 9.5); });
    /* jauges */
    var L = MIX_LEVELS[lv], c = ok();
    function bar(y, lab, v, mx, goodMax, txtv, good) { txt(dyn, 14, y + 8, lab, '#9fb8cc', 'start', 9.5, true); S('rect', { x: 110, y: y, width: 200, height: 10, rx: 5, style: 'fill:#0a121b;stroke:#2a4660;stroke-width:1.2' }, dyn); S('rect', { x: 110, y: y, width: 200 * clamp(v / mx, 0, 1), height: 10, rx: 5, style: 'fill:' + (good ? GREEN : RED) }, dyn); if (goodMax) ln(dyn, 110 + 200 * goodMax / mx, y - 3, 110 + 200 * goodMax / mx, y + 13, '#ffffff', 1.6); txt(dyn, 318, y + 9, txtv, good ? GREEN : RED, 'start', 9.5, true); }
    bar(272, 'Budget', R.cost, 60, L.bud, R.cost + ' / ' + L.bud, c.bud);
    bar(290, 'CO₂ moyen', R.co2, 820, L.co2, fm(R.co2, 0) + ' g/kWh', c.co2);
    bar(308, 'Renouvelables', R.ren * 100, 100, L.ren ? L.ren * 100 : 0, fm(R.ren * 100, 0) + ' %', c.ren);
  });
  update();
}

/* ---------- leçons ---------- */
PC.extra('t3-11', [
  { short: 'Tri express', title: 'Jeu : tri express', intro: 'Renouvelable ou non renouvelable ? Classe les cartes avant qu’elles tombent.', build: triExpress,
    retenir: ['Une énergie est <b>renouvelable</b> quand la nature la renouvelle sans cesse : Soleil, vent, eau, biomasse.', 'Pétrole, charbon, gaz et uranium sont <b>non renouvelables</b> : leur stock est limité.'],
    ar: { e: ['الطاقة المتجددة تتجدد في الطبيعة باستمرار: الشمس والرياح والماء والكتلة الحيوية. أما النفط والفحم والغاز واليورانيوم فمخزونها محدود.'], u: 'المس النصف الأيسر للمتجددة والأيمن لغير المتجددة.', w: [['renouvelable', 'متجددة'], ['non renouvelable', 'غير متجددة'], ['énergie fossile', 'طاقة أحفورية'], ['biomasse', 'كتلة حيوية']] } }
]);
PC.extra('t3-1', [
  { short: 'Chrono-défi', title: 'Jeu : chrono-défi', intro: 'Remets cinq inventions dans l’ordre, du plus ancien au plus récent.', build: chronoDefi,
    retenir: ['Les systèmes évoluent : <b>force de l’eau</b>, puis <b>vapeur</b>, <b>électricité</b>, <b>programmation</b> et <b>robots</b>.', 'Chaque invention répond à un besoin et prépare la suivante.'],
    ar: { e: ['تتطور الأنظمة: قوة الماء ثم البخار ثم الكهرباء ثم البرمجة ثم الروبوتات. كل اختراع يلبّي حاجة ويمهّد لما بعده.'], u: 'المس بطاقة ثم مكانها على الخط الزمني.', w: [['invention', 'اختراع'], ['frise chronologique', 'خط زمني'], ['machine à vapeur', 'آلة بخارية'], ['robot', 'روبوت']] } }
], 'Frise');
PC.extra('t3-14', [
  { short: 'Alimente la ville', title: 'Projet : alimente la ville', intro: 'Choisis ton mix énergétique : pas de coupure, budget et CO₂ sous contrôle.', build: mixVille,
    retenir: ['Le Soleil et le vent <b>varient</b> au fil de la journée : il faut des sources pilotables ou du <b>stockage</b>.', 'Moins un mix émet de <b>CO₂</b>, mieux c’est pour le climat, mais il doit rester fiable et abordable.'],
    ar: { e: ['الشمس والرياح تتغيران خلال اليوم، لذلك نحتاج مصادر يمكن التحكم فيها أو تخزينا. كلما قلّ ثاني أكسيد الكربون كان المزيج أفضل للمناخ، مع الحفاظ على الاعتمادية والتكلفة.'], u: 'حرّك المنزلقات لاختيار عدد الكتل (100 ميغاواط) من كل مصدر. الأرقام مبسّطة ولأغراض تعليمية.', w: [['mix énergétique', 'مزيج طاقي'], ['stockage', 'تخزين'], ['coupure', 'انقطاع'], ['demande', 'الطلب']] } }
]);
