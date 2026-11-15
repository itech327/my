/* ===================================================== ATELIER DE DÉPANNAGE
   Trouver une panne par la méthode : provoquer la situation, mesurer, observer, conclure.
   Deux moteurs : une chaîne de blocs (3e année) et un circuit en série avec voltmètre (2e année).
   La panne est tirée au hasard : on peut rejouer. */
function etoilesAtelier(mesures, erreurs, mini) {
  var c = mesures + 2 * erreurs, n = c <= mini ? 3 : (c <= mini + 2 ? 2 : 1);
  return ['★☆☆', '★☆☆', '★★☆', '★★★'][n];
}
function autrePanne(n, prev) { var k; do { k = Math.floor(Math.random() * n); } while (n > 1 && k === prev); return k; }
function lcdBox(g, x, y, w, hh, big, small, col) {
  S('rect', { x: x, y: y, width: w, height: hh, rx: 9, style: 'fill:#0a121b;stroke:#2a4660;stroke-width:2' }, g);
  S('rect', { x: x + 8, y: y + 8, width: w - 16, height: 40, rx: 5, style: 'fill:#0d1f1a;stroke:#1d3448;stroke-width:1.5' }, g);
  txt(g, x + w - 16, y + 38, big, col || GREEN, 'end', 24, true);
  txt(g, x + w / 2, y + 62, small, '#9fb8cc', 'middle', 10);
}

/* ---------- moteur 1 : chaîne de blocs, tension en sortie de chaque bloc ---------- */
function depannageChaine(el, cfg) {
  var X0 = 14, BW = 216, BH = 38, PITCH = 60, Y0 = 12, n = cfg.blocks.length;
  var svg = ui.stage(el, 400, Y0 + (n - 1) * PITCH + BH + 14, cfg.title), dyn = S('g', null, svg), hit = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el), ctl = ui.controls(el), diagBtn;
  var fi = autrePanne(cfg.faults.length, -1), stim = false, probed = {}, tests = 0, errs = 0, mode = 'mesure', done = false, sel = null, lcd = { v: null, shown: 0, exp: null };
  function blk(i) { return cfg.blocks[i]; }
  function expectedIdle(i) { return !!blk(i).needStim && !stim; }
  function reading(i) {
    var b = blk(i), f = cfg.faults[fi], exp = stim ? b.out.on : b.out.off, v;
    if (i < f.b) v = exp; else if (i === f.b) v = exp === 0 ? 0 : f.val; else v = (f.val > 0 && b.pass && exp !== 0) ? f.val : 0;
    return { v: v, exp: exp };
  }
  function observe(i) {
    var b = blk(i), f = cfg.faults[fi], okT = expectedIdle(i) ? b.idle : b.ok, t;
    if (i === f.b) t = expectedIdle(i) ? b.idle : (f.obs || b.bad);
    else if (i > f.b) t = b.needStim ? b.idle : b.ok;
    else t = okT;
    return { t: t, dev: t !== okT };
  }
  function paintChips() { chips.set(ui.chip('Mesures et observations : ' + tests, BLUE) + ui.chip(stim ? cfg.stim[1] : cfg.stim[2], stim ? GREEN : '#9fb8cc', true)); }
  function reset(keep) {
    if (!keep) fi = autrePanne(cfg.faults.length, fi);
    stim = false; probed = {}; tests = 0; errs = 0; mode = 'mesure'; done = false; sel = null; lcd = { v: null, shown: 0, exp: null };
    diagBtn.textContent = 'Je sais où est la panne'; paintChips();
    info.set('<b>' + cfg.symptom + '</b> Provoque la situation, puis <b>touche un point ●</b> pour mesurer ou <b>un bloc</b> pour l’observer.');
  }
  ui.btn(ctl, cfg.stim[0], function (b) { stim = !stim; probed = {}; sel = null; lcd.v = null; b.textContent = stim ? cfg.stim[3] : cfg.stim[0]; paintChips(); info.set(stim ? 'Situation provoquée : ' + cfg.stim[1].toLowerCase() + '. Les mesures reprennent à zéro.' : 'Situation arrêtée : ' + cfg.stim[2].toLowerCase() + '.'); });
  diagBtn = ui.btn(ctl, 'Je sais où est la panne', function () {
    if (done) return; mode = mode === 'mesure' ? 'diag' : 'mesure';
    diagBtn.textContent = mode === 'diag' ? 'Continuer à chercher' : 'Je sais où est la panne';
    info.set(mode === 'diag' ? '<b>Touche le bloc en panne.</b> Une erreur coûte deux mesures.' : 'Continue : mesure ou observe.');
  });
  ui.btn(ctl, 'Nouvelle panne', function () { reset(false); });
  function pointY(i) { return Y0 + i * PITCH + BH + (PITCH - BH) / 2; }
  /* couche tactile fixe : les figures sont redessinées à chaque image */
  cfg.blocks.forEach(function (b, i) {
    var r = S('rect', { x: X0, y: Y0 + i * PITCH, width: BW, height: BH, rx: 8, style: 'fill:#fff;fill-opacity:0' }, hit);
    hot(r, function () {
      if (done) return;
      if (mode === 'diag') {
        if (i === cfg.faults[fi].b) { done = true; var f = cfg.faults[fi]; info.set('<b>Bravo ' + etoilesAtelier(tests, errs, cfg.mini || 3) + '</b> : ' + f.name + '. ' + f.why + ' <b>Réparation :</b> ' + f.repair + ' <i>Méthode : coupe la chaîne en deux, mesure au milieu, puis recommence sur la bonne moitié.</i>'); sel = { blk: i }; }
        else { errs++; mode = 'mesure'; diagBtn.textContent = 'Je sais où est la panne'; info.set('Ce bloc fonctionne : ' + (blk(i).out ? 'mesure sa sortie pour t’en assurer.' : 'observe-le.') + ' Cherche encore.'); }
        paintChips(); return;
      }
      var k = 'b' + i; if (!probed[k]) { probed[k] = observe(i); tests++; }
      sel = { blk: i }; lcd.v = null; var o = probed[k];
      info.set('<b>' + b.n + '</b> (' + b.t + ') : ' + o.t); paintChips();
    }, b.n);
    if (b.out) {
      var c = S('circle', { cx: X0 + BW / 2, cy: pointY(i), r: 15, style: 'fill:#fff;fill-opacity:0' }, hit);
      hot(c, function () {
        if (done || mode === 'diag') return;
        var k = 'p' + i, rd = reading(i); if (!probed[k]) { probed[k] = { v: rd.v, exp: rd.exp, dev: Math.abs(rd.v - rd.exp) > 0.05 }; tests++; }
        sel = { pt: i }; lcd.v = rd.v; lcd.exp = rd.exp;
        info.set('<b>Sortie de ' + b.n.toLowerCase() + '</b> : ' + fm(rd.v, 1) + ' V mesurés, ' + fm(rd.exp, 1) + ' V attendus.' + (!stim && rd.exp === 0 ? ' Sans la situation provoquée, 0 V est normal.' : '')); paintChips();
      }, 'Mesurer la tension à la sortie de ' + b.n);
    }
  });
  PC.anim(svg, function (dt, t) {
    dyn.replaceChildren();
    lcd.shown += ((lcd.v === null ? 0 : lcd.v) - lcd.shown) * Math.min(1, dt * 9); if (lcd.v !== null && Math.abs(lcd.v - lcd.shown) < 0.04) lcd.shown = lcd.v;
    cfg.blocks.forEach(function (b, i) {
      var y = Y0 + i * PITCH, col = b.kind === 'i' ? BLUE : AMBER, pb = probed['b' + i], ring = sel && sel.blk === i;
      S('rect', { x: X0, y: y, width: BW, height: BH, rx: 8, style: 'fill:' + col + ';fill-opacity:' + (ring ? .34 : .16) + ';stroke:' + (pb ? (pb.dev ? RED : GREEN) : col) + ';stroke-width:' + (ring || pb ? 3 : 2) }, dyn);
      txt(dyn, X0 + 12, y + 17, b.n, INK, 'start', 12.5, true); txt(dyn, X0 + 12, y + 31, b.t, '#9fb8cc', 'start', 9.5);
      if (pb) txt(dyn, X0 + BW - 14, y + 24, pb.dev ? '✗' : '✓', pb.dev ? RED : GREEN, 'end', 16, true);
      if (i < n - 1) {
        var cx = X0 + BW / 2; ln(dyn, cx, y + BH, cx, y + PITCH, '#4a647a', 2.4);
        S('path', { d: 'M' + (cx - 5) + ' ' + (y + PITCH - 7) + 'L' + cx + ' ' + (y + PITCH) + 'L' + (cx + 5) + ' ' + (y + PITCH - 7), style: 'fill:none;stroke:#4a647a;stroke-width:2.4;stroke-linecap:round' }, dyn);
        flow(dyn, [[cx, y + BH], [cx, y + PITCH]], t * .5, 2, '#7d96ab', 2);
        if (b.out) {
          var pp = probed['p' + i], py = pointY(i), act = sel && sel.pt === i;
          S('circle', { cx: cx, cy: py, r: act ? 9 : 7, style: 'fill:' + (pp ? (pp.dev ? RED : GREEN) : '#0a121b') + ';fill-opacity:' + (pp ? .85 : 1) + ';stroke:' + (pp ? '#fff' : BLUE) + ';stroke-width:2' }, dyn);
        }
      }
    });
    /* multimètre */
    var mx = 246, my = Y0 + 4, rr = sel && sel.pt !== undefined;
    lcdBox(dyn, mx, my, 142, 76, rr || lcd.v !== null ? fm(lcd.shown, 1) + ' V' : '--.-', rr ? 'attendu : ' + fm(lcd.exp, 1) + ' V' : 'voltmètre', rr && Math.abs(lcd.v - lcd.exp) > 0.05 ? RED : GREEN);
    if (rr) { var py2 = pointY(sel.pt), cx2 = X0 + BW / 2 + 9; S('path', { d: 'M' + mx + ' ' + (my + 52) + 'C' + (mx - 40) + ' ' + (my + 52) + ' ' + (cx2 + 50) + ' ' + py2 + ' ' + cx2 + ' ' + py2, style: 'fill:none;stroke:' + RED + ';stroke-width:2.6;stroke-linecap:round' }, dyn); circ(dyn, cx2, py2, 3.5, RED, 1, 1); }
    txt(dyn, mx + 4, my + 100, '●  point de mesure', '#9fb8cc', 'start', 10); txt(dyn, mx + 4, my + 116, '▭  bloc à observer', '#9fb8cc', 'start', 10);
    txt(dyn, mx + 4, my + 140, '✓ conforme  ✗ anormal', '#9fb8cc', 'start', 10);
    txt(dyn, mx + 4, my + 172, 'Énergie', AMBER, 'start', 10.5, true); txt(dyn, mx + 56, my + 172, 'Information', BLUE, 'start', 10.5, true);
  });
  reset(true);
}

var CFG_BARRIERE = {
  title: 'Barrière automatique en panne', symptom: 'La barrière ne se lève plus.', mini: 3,
  stim: ['Placer une voiture', 'Voiture devant le détecteur', 'Aucune voiture', 'Retirer la voiture'],
  blocks: [
    { n: 'Alimentation', t: 'Alimenter', kind: 'e', out: { on: 12, off: 12 }, ok: 'Le voyant d’alimentation est allumé.', bad: 'Le voyant d’alimentation est éteint.' },
    { n: 'Détecteur de véhicule', t: 'Acquérir', kind: 'i', out: { on: 5, off: 0 }, needStim: true, ok: 'La LED du détecteur est allumée.', idle: 'La LED du détecteur est éteinte : rien à détecter.', bad: 'La LED du détecteur reste éteinte malgré la voiture.' },
    { n: 'Carte de commande', t: 'Traiter', kind: 'i', out: { on: 5, off: 0 }, needStim: true, ok: 'La LED « ordre » de la carte est allumée.', idle: 'La LED « ordre » de la carte est éteinte.', bad: 'La LED « ordre » reste éteinte.' },
    { n: 'Relais', t: 'Distribuer', kind: 'e', out: { on: 12, off: 0 }, needStim: true, ok: 'On entend le « clac » du relais.', idle: 'Le relais est silencieux.', bad: 'Aucun « clac » : le relais ne colle pas.' },
    { n: 'Moteur', t: 'Convertir', kind: 'e', out: null, needStim: true, ok: 'Le moteur tourne.', idle: 'Le moteur est à l’arrêt.', bad: 'Le moteur est alimenté mais ne tourne pas ; odeur de brûlé.' },
    { n: 'Réducteur et barrière', t: 'Transmettre · Agir', kind: 'e', out: null, needStim: true, ok: 'La barrière se lève.', idle: 'La barrière reste baissée.', bad: 'Le moteur tourne mais la barrière ne bouge pas ; bruit de dents cassées.' }
  ],
  faults: [
    { b: 0, val: 0, name: 'le fusible de l’alimentation est grillé', why: 'Plus aucune énergie n’arrive : la sortie de l’alimentation est à 0 V.', repair: 'remplacer le fusible.' },
    { b: 1, val: 0, name: 'le détecteur de véhicule est en panne', why: 'Il est alimenté mais ne signale plus la voiture.', repair: 'remplacer le détecteur.' },
    { b: 2, val: 0, name: 'la carte de commande ne donne plus l’ordre', why: 'Elle reçoit 5 V du détecteur mais n’envoie aucune commande.', repair: 'remplacer la carte ou recharger son programme.' },
    { b: 3, val: 0, name: 'le relais est bloqué ouvert', why: 'La commande arrive (5 V) mais l’énergie n’est pas distribuée au moteur.', repair: 'remplacer le relais.' },
    { b: 4, val: 12, name: 'le moteur est grillé', why: 'Il reçoit 12 V mais ne convertit plus l’énergie en mouvement.', repair: 'remplacer le moteur.' },
    { b: 5, val: 12, name: 'le réducteur a des dents cassées', why: 'Le moteur tourne : la panne est dans la transmission.', repair: 'remplacer l’engrenage.' }
  ]
};
var CFG_PERCEUSE = {
  title: 'Perceuse sur batterie en panne', symptom: 'La perceuse ne perce plus.', mini: 3,
  stim: ['Appuyer sur la gâchette', 'Gâchette enfoncée', 'Gâchette relâchée', 'Relâcher la gâchette'],
  blocks: [
    { n: 'Batterie', t: 'Alimenter', kind: 'e', out: { on: 12, off: 12 }, ok: 'Le voyant de charge affiche trois barres.', bad: 'Le voyant de charge ne s’allume pas.' },
    { n: 'Gâchette', t: 'Distribuer', kind: 'e', out: { on: 12, off: 0 }, pass: true, needStim: true, ok: 'Un « clic » : le contact est fermé.', idle: 'Gâchette relâchée : le contact est ouvert.', bad: 'La gâchette est enfoncée mais le contact reste ouvert.' },
    { n: 'Moteur', t: 'Convertir', kind: 'e', out: null, needStim: true, ok: 'Le moteur tourne vite.', idle: 'Le moteur est à l’arrêt.', bad: 'Le moteur reçoit du courant mais ne tourne pas : charbons usés.' },
    { n: 'Réducteur', t: 'Transmettre', kind: 'e', out: null, needStim: true, ok: 'Le mandrin tourne lentement, avec de la force.', idle: 'Le mandrin est immobile.', bad: 'Le moteur tourne mais le mandrin non ; bruit de dents cassées.' },
    { n: 'Mandrin et foret', t: 'Agir', kind: 'e', out: null, needStim: true, ok: 'Le foret perce la planche.', idle: 'Le foret est immobile.', bad: 'Le mandrin tourne mais le foret patine : il est mal serré.' }
  ],
  faults: [
    { b: 0, val: 3.1, name: 'la batterie est déchargée', why: 'Elle ne donne que 3,1 V au lieu de 12 V : la tension ne suffit pas.', repair: 'recharger la batterie.' },
    { b: 1, val: 0, name: 'le contact de la gâchette est hors service', why: 'La batterie est bonne mais aucune tension ne passe après la gâchette.', repair: 'remplacer l’interrupteur.' },
    { b: 2, val: 12, name: 'les charbons du moteur sont usés', why: 'Le courant arrive jusqu’au moteur : la panne est dans le moteur.', repair: 'changer les charbons ou le moteur.' },
    { b: 3, val: 12, name: 'le réducteur est cassé', why: 'Le moteur tourne : la panne est plus loin dans la transmission.', repair: 'remplacer les engrenages.' },
    { b: 4, val: 12, name: 'le mandrin n’est pas serré', why: 'Tout tourne jusqu’au mandrin : c’est le serrage du foret.', repair: 'resserrer le mandrin.' }
  ]
};

/* ---------- moteur 2 : circuit en série, tension aux bornes de chaque composant ---------- */
var CFG_SERIE = {
  comps: [
    { id: 'pile', n: 'Pile 4,5 V', x: 130, y: 230 }, { id: 'sw', n: 'Interrupteur', x: 270, y: 230 },
    { id: 'R', n: 'R = 220 Ω', x: 130, y: 70 }, { id: 'led', n: 'LED', x: 270, y: 70 }
  ],
  obs: {
    pile: { ok: 'La pile a l’air neuve ; on ne voit pas sa charge : il faut la mesurer.' },
    sw: { ok: 'Le levier bouge et fait « clic ».', f_sw: 'Le levier bouge mais les contacts sont oxydés et ne se touchent plus.' },
    R: { ok: 'Résistance intacte : bandes rouge, rouge, marron (220 Ω).', f_R: 'Le corps est fissuré : le fil interne est coupé.' },
    led: { ok: 'LED bien montée : la patte longue est du côté du +.', f_led_g: 'La LED est noircie à l’intérieur.', f_led_i: 'La patte courte est du côté du + : la LED est montée à l’envers.', f_led_c: 'Un fil relie les deux pattes de la LED.' }
  },
  faults: [
    { id: 'pile', c: 'pile', name: 'la pile est vide', why: 'Elle ne donne plus que 0,2 V.', repair: 'changer la pile.' },
    { id: 'sw', c: 'sw', name: 'l’interrupteur est hors service', why: 'Fermé, il laisse pourtant toute la tension à ses bornes : il n’y a pas de contact.', repair: 'changer l’interrupteur.' },
    { id: 'R', c: 'R', name: 'la résistance est coupée', why: 'Le circuit est ouvert : toute la tension se retrouve aux bornes de la résistance.', repair: 'changer la résistance.' },
    { id: 'led_g', c: 'led', name: 'la LED est grillée', why: 'Le circuit est ouvert dans la LED : toute la tension est à ses bornes.', repair: 'changer la LED.' },
    { id: 'led_i', c: 'led', name: 'la LED est montée à l’envers', why: 'La LED ne laisse passer le courant que dans un sens.', repair: 'retourner la LED.' },
    { id: 'led_c', c: 'led', name: 'un fil court-circuite la LED', why: '0 V aux bornes de la LED : un fil la shunte.', repair: 'retirer le fil.' }
  ],
  causes: {
    pile: [['pile', 'Pile vide']], sw: [['sw', 'Contacts hors service']], R: [['R', 'Résistance coupée']],
    led: [['led_g', 'LED grillée'], ['led_i', 'LED à l’envers'], ['led_c', 'Fil en court-circuit']]
  }
};
function depannageSerie(el) {
  var cfg = CFG_SERIE, svg = ui.stage(el, 400, 292, 'Circuit LED en panne'), dyn = S('g', null, svg), hit = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el), ctl = ui.controls(el), causeBox = h('div', { 'class': 'controls' }), swBtn;
  var fi = autrePanne(cfg.faults.length, -1), swOn = false, probed = {}, tests = 0, errs = 0, mode = 'v', done = false, sel = null, lcd = { v: null, shown: 0, exp: null }, tabsRow;
  function F() { return cfg.faults[fi]; }
  function volts() {
    var f = done ? { id: 'none' } : F(), E = f.id === 'pile' ? 0.2 : 4.5, v = { pile: E, sw: 0, R: 0, led: 0 }, open = !swOn ? 'sw' : (f.id === 'sw' ? 'sw' : (f.id === 'R' ? 'R' : (f.id === 'led_g' || f.id === 'led_i' ? 'led' : '')));
    if (open) v[open] = E;
    else if (f.id === 'led_c') { v.R = E; }
    else if (f.id === 'pile') { v.R = 0.1; v.led = 0.1; }
    else { v.R = 2.5; v.led = 2.0; }
    return v;
  }
  function expectedV(id) { return swOn ? { pile: 4.5, sw: 0, R: 2.5, led: 2.0 }[id] : { pile: 4.5, sw: 4.5, R: 0, led: 0 }[id]; }
  function paintChips() { chips.set(ui.chip('Mesures : ' + tests, BLUE) + ui.chip(swOn ? 'interrupteur fermé' : 'interrupteur ouvert', swOn ? GREEN : '#9fb8cc', true)); }
  function setMode(m) { mode = m; causeBox.replaceChildren(); sel = null; lcd.v = null; info.set(m === 'v' ? 'Touche un composant : le voltmètre se place à ses bornes.' : (m === 'o' ? 'Touche un composant pour l’inspecter.' : '<b>Touche le composant en cause</b>, puis la cause. Une erreur coûte deux mesures.')); }
  function reset(keep) {
    if (!keep) fi = autrePanne(cfg.faults.length, fi);
    swOn = false; probed = {}; tests = 0; errs = 0; done = false; sel = null; lcd = { v: null, shown: 0, exp: null }; causeBox.replaceChildren();
    swBtn.textContent = 'Fermer l’interrupteur'; paintChips();
    info.set('<b>La LED reste éteinte.</b> Ferme l’interrupteur, puis mesure la tension aux bornes des composants ou inspecte-les.');
  }
  tabsRow = ui.tabs(el, [['v', 'Voltmètre'], ['o', 'Inspecter'], ['d', 'Diagnostic']], function (k) { if (!done) setMode(k); });
  el.insertBefore(tabsRow, ctl);
  swBtn = ui.btn(ctl, 'Fermer l’interrupteur', function (b) { swOn = !swOn; probed = {}; sel = null; lcd.v = null; b.textContent = swOn ? 'Ouvrir l’interrupteur' : 'Fermer l’interrupteur'; paintChips(); });
  ui.btn(ctl, 'Nouvelle panne', function () { reset(false); });
  el.appendChild(causeBox);
  cfg.comps.forEach(function (c) {
    var r = S('rect', { x: c.x - 34, y: c.y - 28, width: 68, height: 56, rx: 10, style: 'fill:#fff;fill-opacity:0' }, hit);
    hot(r, function () {
      if (done) return;
      if (mode === 'v') {
        var k = 'v' + c.id, vv = volts()[c.id], ex = expectedV(c.id); if (!probed[k]) { probed[k] = { dev: Math.abs(vv - ex) > 0.05 }; tests++; }
        sel = c.id; lcd.v = vv; lcd.exp = ex;
        info.set('<b>' + c.n + '</b> : ' + fm(vv, 1) + ' V mesurés, ' + fm(ex, 1) + ' V attendus' + (swOn ? '.' : ' (interrupteur ouvert : toute la tension est à ses bornes).')); paintChips();
      } else if (mode === 'o') {
        var o = cfg.obs[c.id], f = F(), t = o['f_' + f.id] || o.ok, k2 = 'o' + c.id; if (!probed[k2]) { probed[k2] = { dev: !!o['f_' + f.id] }; tests++; }
        sel = c.id; lcd.v = null; info.set('<b>' + c.n + '</b> : ' + t); paintChips();
      } else {
        sel = c.id; causeBox.replaceChildren(); var list = cfg.causes[c.id];
        function verdict(cid) {
          if (cid === F().id) { done = true; swOn = true; swBtn.textContent = 'Ouvrir l’interrupteur'; causeBox.replaceChildren(); info.set('<b>Bravo ' + etoilesAtelier(tests, errs, 3) + '</b> : ' + F().name + '. ' + F().why + ' <b>Réparation :</b> ' + F().repair + ' La LED s’allume.'); }
          else { errs++; causeBox.replaceChildren(); info.set('Ce n’est pas la bonne cause. Mesure ou inspecte encore.'); }
          paintChips();
        }
        if (list.length === 1) { verdict(list[0][0] === F().id && c.id === F().c ? F().id : '-'); }
        else { info.set('<b>' + c.n + '</b> : quelle est la cause ?'); list.forEach(function (it) { ui.btn(causeBox, it[1], function () { verdict(c.id === F().c ? it[0] : '-'); }); }); }
      }
    }, c.n);
  });
  PC.anim(svg, function (dt, t) {
    dyn.replaceChildren();
    lcd.shown += ((lcd.v === null ? 0 : lcd.v) - lcd.shown) * Math.min(1, dt * 9); if (lcd.v !== null && Math.abs(lcd.v - lcd.shown) < 0.04) lcd.shown = lcd.v;
    var wc = '#cfe3f2', lit = done;
    wire(dyn, [[40, 70], [106, 70]]); wire(dyn, [[154, 70], [246, 70]]); wire(dyn, [[294, 70], [360, 70], [360, 230], [294, 230]]); wire(dyn, [[246, 230], [154, 230]]); wire(dyn, [[106, 230], [40, 230], [40, 70]]);
    if (lit) flow(dyn, [[106, 230], [40, 230], [40, 70], [360, 70], [360, 230], [154, 230]], t * .22, 9, AMBER, 2.8);
    cfg.comps.forEach(function (c) {
      var pb = probed['v' + c.id] || probed['o' + c.id], on = sel === c.id;
      if (on || pb) S('rect', { x: c.x - 34, y: c.y - 30, width: 68, height: 60, rx: 10, style: 'fill:none;stroke:' + (pb ? (pb.dev ? RED : GREEN) : BLUE) + ';stroke-width:' + (on ? 3 : 2) + ';stroke-dasharray:' + (on ? 'none' : '4 4') }, dyn);
    });
    sBat(dyn, 130, 230, 'Pile 4,5 V', 48); sSwitch(dyn, 270, 230, swOn, 'Interrupteur', 48); sRes(dyn, 130, 70, 'R = 220 Ω', 48); sLed(dyn, 270, 70, lit ? .6 : 0, 'LED', RED, 48);
    lcdBox(dyn, 150, 112, 100, 76, lcd.v !== null ? fm(lcd.shown, 1) + ' V' : '--.-', lcd.v !== null ? 'attendu : ' + fm(lcd.exp, 1) + ' V' : 'voltmètre', lcd.v !== null && Math.abs(lcd.v - lcd.exp) > 0.05 ? RED : GREEN);
    if (sel && lcd.v !== null) {
      var c = cfg.comps.filter(function (q) { return q.id === sel; })[0], top = c.y < 150, by = top ? 112 : 188, ty = c.y + (top ? 4 : -4);
      S('path', { d: 'M165 ' + by + 'C165 ' + ((by + ty) / 2) + ' ' + (c.x - 24) + ' ' + ((by + ty) / 2) + ' ' + (c.x - 24) + ' ' + ty, style: 'fill:none;stroke:' + RED + ';stroke-width:2.6;stroke-linecap:round' }, dyn);
      S('path', { d: 'M235 ' + by + 'C235 ' + ((by + ty) / 2) + ' ' + (c.x + 24) + ' ' + ((by + ty) / 2) + ' ' + (c.x + 24) + ' ' + ty, style: 'fill:none;stroke:#e8f1f8;stroke-width:2.6;stroke-linecap:round' }, dyn);
      circ(dyn, c.x - 24, ty, 3.5, RED, 1, 1); circ(dyn, c.x + 24, ty, 3.5, '#e8f1f8', 1, 1);
    }
  });
  reset(true);
}

/* ---------- leçons ---------- */
PC.extra('t3-1', [
  { short: 'Dépanner', title: 'Atelier : la barrière est en panne', intro: 'Provoque la situation, mesure la sortie des blocs et trouve celui qui est en panne.', build: function (el) { depannageChaine(el, CFG_BARRIERE); },
    retenir: ['Pour dépanner : <b>provoquer la situation</b>, mesurer, observer, puis conclure.', 'La panne est dans le <b>premier bloc</b> dont la sortie est anormale alors que son entrée est bonne.'],
    ar: { e: ['لإصلاح عطب نشغّل الحالة أولا ثم نقيس ونلاحظ. العطب في أول مرحلة يكون خرجها غير عادي رغم أن دخلها سليم.'], u: 'ضع سيارة أمام الكاشف ثم قس عند نقاط القياس.', w: [['panne', 'عطب'], ['mesurer', 'قياس'], ['observer', 'ملاحظة'], ['bloc', 'مرحلة']] } }
], 'Barrière');
PC.extra('t3-5', [
  { short: 'Dépanner', title: 'Atelier : la perceuse ne perce plus', intro: 'Suis la chaîne d’énergie : de la batterie jusqu’au foret.', build: function (el) { depannageChaine(el, CFG_PERCEUSE); },
    retenir: ['Une chaîne d’énergie s’explore <b>de la source vers l’action</b>.', 'Une tension trop faible à la source (ici 3,1 V au lieu de 12 V) bloque toute la chaîne.'],
    ar: { e: ['نتتبّع سلسلة الطاقة من المنبع إلى الفعل. توتر ضعيف عند المنبع يوقف السلسلة كلها.'], u: 'اضغط على الزناد ثم افحص كل مرحلة.', w: [['batterie', 'بطارية'], ['gâchette', 'زناد'], ['moteur', 'محرك'], ['mandrin', 'رأس التثبيت']] } }
]);
PC.extra('t2-5', [
  { short: 'Dépanner', title: 'Atelier : la LED ne s’allume plus', intro: 'Ferme l’interrupteur, mesure aux bornes de chaque composant et trouve la cause.', build: depannageSerie,
    retenir: ['Aux bornes d’un composant qui coupe le circuit, le voltmètre indique <b>toute la tension de la pile</b>.', 'Quand deux pannes donnent la même mesure, on <b>inspecte</b> le composant.'],
    ar: { e: ['إذا انقطعت الدارة في مكوّن، يشير الفولطمتر بين طرفيه إلى توتر البطارية كله. وإذا تشابهت القياسات نفحص المكوّن بالعين.'], u: 'أغلق القاطع ثم قس التوتر بين طرفي كل مكوّن.', w: [['tension', 'توتر'], ['voltmètre', 'فولطمتر'], ['circuit ouvert', 'دارة مفتوحة'], ['court-circuit', 'دارة قصيرة']] } }
]);
