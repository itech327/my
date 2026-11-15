/* ===================================================== LABORATOIRE DE CIRCUITS (2e année)
   Circuit en série à 4 emplacements : on glisse les composants (ou on touche un composant puis un emplacement).
   Modèle : pile (1 Ω de résistance interne), LED (seuil 2 V, grille au-dessus de 30 mA), lampe 3,8 V (grille au-dessus de 5,5 V),
   buzzer (sonne dès 3 V), résistances, interrupteur, bouton-poussoir, fil. Six missions. */
var LABO_PIECES = [
  { t: 'sw', n: 'Interrupteur' }, { t: 'bp', n: 'Bouton' }, { t: 'r100', n: '100 Ω' }, { t: 'r220', n: '220 Ω' }, { t: 'r1k', n: '1 kΩ' },
  { t: 'led', n: 'LED' }, { t: 'buz', n: 'Buzzer' }, { t: 'lamp', n: 'Lampe 3,8 V' }, { t: 'wire', n: 'Fil' }
];
var LABO_R = { r100: 100, r220: 220, r1k: 1000, buz: 100, lamp: 38, wire: 0.05 };
/* emplacements dans le sens du courant : 0 = pile (en bas à gauche), puis haut gauche, haut droite, bas droite, bas milieu */
var LABO_SL = [{ x: 95, y: 232, dir: -1 }, { x: 115, y: 66, dir: 1 }, { x: 285, y: 66, dir: 1 }, { x: 305, y: 232, dir: -1 }, { x: 200, y: 232, dir: -1 }];
var LABO_MISSIONS = [
  { t: 'Mode libre', d: 'Construis ce que tu veux : change la pile, ajoute des composants et observe l’ampèremètre.', src: 4.5, pre: [] },
  { t: 'Répare le circuit : la LED reste éteinte', d: 'Tout est branché, mais la LED ne s’allume pas. Regarde son sens.', src: 4.5, pre: [null, { t: 'sw', on: true }, { t: 'r220' }, { t: 'led' }, null], ok: function (s) { return s.run && s.leds >= 1 && s.litLed; } },
  { t: 'Allume la LED sans la griller', d: 'Une pile, un interrupteur, une résistance et une LED.', src: 4.5, pre: [], ok: function (s) { return s.run && s.litLed && !s.burned; } },
  { t: 'Même chose avec la pile de 9 V', d: 'Avec 9 V, une résistance trop petite fait griller la LED. Choisis bien.', src: 9, lock: 9, pre: [], ok: function (s) { return s.run && s.litLed && !s.burned && s.src === 9; } },
  { t: 'Fais sonner le buzzer avec un bouton', d: 'Le buzzer ne sonne que si la tension à ses bornes atteint 3 V.', src: 4.5, pre: [], ok: function (s) { return s.run && s.sound && s.has.bp; } },
  { t: 'Fais briller la lampe sans la griller', d: 'La lampe supporte 3,8 V (jusqu’à 5,5 V). Compare les piles.', src: 1.5, pre: [], ok: function (s) { return s.run && s.lamp >= 0.6 && !s.burned; } },
  { t: 'Allume deux LED avec une seule pile', d: 'Deux LED en série ont besoin de 4 V ou plus.', src: 4.5, pre: [], ok: function (s) { return s.run && s.leds >= 2 && s.litLeds >= 2 && !s.burned; } }
];
function laboDrawPiece(g, t, x, y, st, tm, w) {
  w = w || 48; st = st || {};
  if (t === 'sw') sSwitch(g, x, y, !!st.on, '', w);
  else if (t === 'bp') {
    sSwitch(g, x, y, !!st.pressed, '', w); ln(g, x, y - 20, x, y - (st.pressed ? 6 : 12), WIRE, 2); ln(g, x - 7, y - 20, x + 7, y - 20, WIRE, 3);
  } else if (t === 'r100' || t === 'r220' || t === 'r1k') sRes(g, x, y, '', w);
  else if (t === 'led') {
    var gg = S('g', st.flip ? { transform: 'translate(' + (2 * x) + ',0) scale(-1,1)' } : null, g);
    sLed(gg, x, y, st.burned ? 0 : (st.glow || 0), '', st.burned ? '#555' : RED, w);
    if (st.burned) { txt(g, x, y + 4, '✕', RED, 'middle', 16, true); }
  } else if (t === 'buz') sBuzzer(g, x, y, !!st.sound, tm || 0, '', w);
  else if (t === 'lamp') { sLamp(g, x, y, st.burned ? 0 : (st.glow || 0), '', w); if (st.burned) txt(g, x, y + 5, '✕', RED, 'middle', 16, true); }
  else if (t === 'wire') { ln(g, x - w / 2, y, x + w / 2, y, st.hot ? RED : AMBER, 4); }
}
function laboLabel(t, st) {
  var m = { sw: 'Interrupteur', bp: 'Bouton', r100: '100 Ω', r220: '220 Ω', r1k: '1 kΩ', led: 'LED', buz: 'Buzzer', lamp: 'Lampe 3,8 V', wire: 'Fil' };
  return t === 'sw' ? (st && st.on ? 'fermé' : 'ouvert') : m[t];
}
function laboFr(x, d) { return fm(x, d === undefined ? 1 : d); }
function labCircuit(el) {
  var svg = ui.stage(el, 400, 424, 'Laboratoire de circuits'), dyn = S('g', null, svg), hit = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el), ctl = ui.controls(el);
  var src = 4.5, slots = [null, null, null, null, null], armed = null, drag = null, mi = 0, lastMsg = '', okT = 0, tm = 0, phase = 0, flash = 0, ammeter = 0, banner = '';
  var done = {}; try { (JSON.parse(localStorage.getItem('tech_lab_done') || '[]') || []).forEach(function (k) { done[k] = 1; }); } catch (e) {}
  function saveDone() { try { localStorage.setItem('tech_lab_done', JSON.stringify(Object.keys(done))); } catch (e) {} }
  function mk(t) { return { t: t, on: false, pressed: false, flip: false, burned: false }; }
  function loadMission(i) {
    mi = clamp(i, 0, LABO_MISSIONS.length - 1); var M = LABO_MISSIONS[mi]; src = M.src; slots = [null, null, null, null, null]; okT = 0; armed = null; lastMsg = ''; banner = '';
    (M.pre || []).forEach(function (p, k) { if (p) { var o = mk(p.t); for (var q in p) o[q] = p[q]; slots[k] = o; } });
    if (srcTabs) { var bs = srcTabs.querySelectorAll('button'), ix = src === 1.5 ? 0 : (src === 4.5 ? 1 : 2); bs.forEach(function (b, j) { b.setAttribute('aria-selected', j === ix ? 'true' : 'false'); }); }
    paintChips();
  }
  function paintChips() { chips.set(ui.chip('Mission ' + mi + '/' + (LABO_MISSIONS.length - 1) + (done[mi] ? ' ✓' : ''), done[mi] ? GREEN : BLUE) + ui.chip('Réussies : ' + Object.keys(done).length + '/' + (LABO_MISSIONS.length - 1), '#9fb8cc', true)); }
  var srcTabs = ui.tabs(el, [['1.5', 'Pile 1,5 V'], ['4.5', 'Pile 4,5 V'], ['9', 'Pile 9 V']], function (k) {
    var M = LABO_MISSIONS[mi]; if (M.lock && +k !== M.lock) { info.set('Pour cette mission, la pile est imposée : ' + laboFr(M.lock) + ' V.'); lastMsg = ''; var bs0 = srcTabs.querySelectorAll('button'); bs0.forEach(function (b, j) { b.setAttribute('aria-selected', (M.lock === 1.5 ? j === 0 : (M.lock === 4.5 ? j === 1 : j === 2)) ? 'true' : 'false'); }); return; }
    src = +k; lastMsg = '';
  });
  el.insertBefore(srcTabs, ctl);
  ui.btn(ctl, '◀ Mission', function () { loadMission(mi - 1); });
  ui.btn(ctl, 'Mission ▶', function () { loadMission(mi + 1); });
  ui.btn(ctl, 'Vider le circuit', function () { slots = [null, null, null, null, null]; armed = null; lastMsg = ''; okT = 0; banner = ''; });
  srcTabs.querySelectorAll('button')[1].setAttribute('aria-selected', 'true'); srcTabs.querySelectorAll('button')[0].setAttribute('aria-selected', 'false');

  /* ---------- simulation du circuit en série ---------- */
  function simulate(burn) {
    var s = { src: src, run: false, any: false, open: '', short: false, I: 0, leds: 0, litLeds: 0, litLed: false, lamp: 0, sound: false, burned: false, has: {}, V: [], note: '' };
    var Rt = 1, Vf = 0, i, p;
    for (i = 1; i <= 4; i++) if (slots[i]) { slots[i].glow = 0; slots[i].sound = false; }
    for (i = 1; i <= 4; i++) {
      p = slots[i]; if (!p) continue; s.any = true; s.has[p.t] = true; if (p.burned) s.burned = true;
      if (p.t === 'sw' && !p.on) s.open = s.open || 'L’interrupteur est ouvert.';
      else if (p.t === 'bp' && !p.pressed) s.open = s.open || 'Le bouton-poussoir n’est pas enfoncé : appuie dessus.';
      else if (p.t === 'led') {
        s.leds++;
        if (p.burned) s.open = s.open || 'La LED est grillée : touche-la pour la retirer.';
        else if (((p.flip ? -1 : 1) !== LABO_SL[i].dir)) s.open = s.open || 'Aucun courant ne circule : une LED ne laisse passer le courant que dans un sens. Touche-la pour la retourner.';
        else { Vf += 2; Rt += 10; }
      } else if (p.t === 'lamp' && p.burned) s.open = s.open || 'La lampe est grillée : touche-la pour la retirer.';
      else if (LABO_R[p.t]) Rt += LABO_R[p.t];
    }
    if (!s.any) { s.note = '<b>' + LABO_MISSIONS[mi].d + '</b> Glisse des composants sur les emplacements, ou touche un composant puis un emplacement vide.'; return s; }
    if (s.open) { s.note = s.open; return s; }
    if (src <= Vf + 0.02) { s.note = 'La tension de la pile (' + laboFr(src) + ' V) ne suffit pas à allumer ' + (s.leds > 1 ? 'les LED' : 'la LED') + ' : il faut plus de ' + laboFr(Vf) + ' V.'; s.run = true; return s; }
    s.I = (src - Vf) / Rt; s.run = true;
    if (s.I > 0.6) { s.short = true; s.note = 'Court-circuit ! Courant de ' + laboFr(s.I, 1) + ' A : la pile chauffe. Ajoute une résistance.'; }
    for (i = 1; i <= 4; i++) {
      p = slots[i]; if (!p || p.burned) continue; var V;
      if (p.t === 'led' ) { V = 2 + s.I * 10; s.V[i] = V; if (s.I > 0.03 && burn) { p.burned = true; s.burned = true; s.note = 'La LED vient de griller : le courant dépassait 30 mA. Il fallait une résistance plus grande.'; flash = 1; } else { var gl = clamp(s.I / 0.015, 0, 1); p.glow = gl; if (s.I >= 0.001) { s.litLeds++; s.litLed = true; } } }
      else if (p.t === 'lamp') { V = s.I * 38; s.V[i] = V; if (V > 5.5 && burn) { p.burned = true; s.burned = true; s.note = 'La lampe vient de griller : elle a reçu ' + laboFr(V) + ' V pour 3,8 V prévus.'; flash = 1; } else { var P = V * s.I / 0.38; s.lamp = Math.max(s.lamp, P); p.glow = clamp(P, 0, 1); } }
      else if (p.t === 'buz') { V = s.I * 100; s.V[i] = V; p.sound = V >= 3; if (p.sound) s.sound = true; }
      else if (LABO_R[p.t]) s.V[i] = s.I * LABO_R[p.t];
    }
    if (!s.note) {
      var parts = []; for (i = 1; i <= 4; i++) if (slots[i] && s.V[i] !== undefined && slots[i].t !== 'wire') parts.push(laboLabel(slots[i].t, slots[i]) + ' : ' + laboFr(s.V[i], 1) + ' V');
      s.note = '<b>I = ' + laboFr(s.I * 1000, 1) + ' mA.</b> ' + parts.join(' · ');
      if (s.has.buz && !s.sound) s.note += ' Le buzzer a besoin de 3 V pour sonner.';
      if (s.has.lamp && s.lamp < 0.2) s.note += ' La lampe est presque éteinte : tension trop faible.';
    }
    return s;
  }

  /* ---------- gestes : glisser-déposer ou toucher-poser ---------- */
  function svgPt(e) { var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; var m = svg.getScreenCTM(); return m ? pt.matrixTransform(m.inverse()) : { x: 0, y: 0 }; }
  function nearest(x, y) { var best = -1, bd = 62; for (var i = 1; i <= 4; i++) { var d = Math.hypot(x - LABO_SL[i].x, y - LABO_SL[i].y); if (d < bd) { bd = d; best = i; } } return best; }
  function place(i, p) { slots[i] = p; lastMsg = ''; }
  function tapToken(t) { armed = armed === t ? null : t; info.set(armed ? 'Touche maintenant un emplacement du circuit.' : 'Sélection annulée.'); lastMsg = ''; }
  function tapSlot(i) {
    var p = slots[i];
    if (!p) { if (armed) { place(i, mk(armed)); armed = null; } return; }
    if (p.burned) { slots[i] = null; lastMsg = ''; return; }
    if (p.t === 'sw') p.on = !p.on; else if (p.t === 'led') p.flip = !p.flip; lastMsg = '';
  }
  LABO_PIECES.forEach(function (d, k) {
    var r = S('rect', { x: (k < 5 ? 10 + k * 76 : 48 + (k - 5) * 76), y: (k < 5 ? 286 : 350), width: 76, height: 62, rx: 8, tabindex: 0, role: 'button', 'aria-label': 'Composant : ' + d.n, style: 'touch-action:none;cursor:grab;fill:#fff;fill-opacity:0' }, hit);
    r.addEventListener('pointerdown', function (e) { e.preventDefault(); var p = svgPt(e); drag = { t: d.t, from: -1, sx: p.x, sy: p.y, x: p.x, y: p.y, moved: false }; });
    r.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tapToken(d.t); } });
  });
  for (var si = 1; si <= 4; si++) (function (i) {
    var S0 = LABO_SL[i], r = S('rect', { x: S0.x - 40, y: S0.y - 34, width: 80, height: 68, rx: 10, tabindex: 0, role: 'button', 'aria-label': 'Emplacement ' + i, style: 'touch-action:none;cursor:pointer;fill:#fff;fill-opacity:0' }, hit);
    r.addEventListener('pointerdown', function (e) {
      e.preventDefault(); var p = svgPt(e), q = slots[i];
      drag = { t: q ? q.t : null, part: q, from: i, sx: p.x, sy: p.y, x: p.x, y: p.y, moved: false };
      if (q && q.t === 'bp') q.pressed = true;
    });
    r.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tapSlot(i); } });
  })(si);
  window.addEventListener('pointermove', function (e) {
    if (!drag) return; var p = svgPt(e); drag.x = p.x; drag.y = p.y;
    if (!drag.moved && Math.hypot(p.x - drag.sx, p.y - drag.sy) > 9) {
      drag.moved = true;
      if (drag.from > 0 && drag.part) { slots[drag.from] = null; drag.part.pressed = false; lastMsg = ''; }
    }
  });
  function endDrag(e) {
    if (!drag) return; var d = drag; drag = null;
    if (!d.moved) {
      if (d.from === -1) tapToken(d.t);
      else if (d.part) { if (d.part.t === 'bp') d.part.pressed = false; else tapSlot(d.from); }
      else tapSlot(d.from);
      return;
    }
    if (!d.t) return;
    var tgt = nearest(d.x, d.y);
    if (tgt > 0) place(tgt, d.part || mk(d.t));
    else if (d.part) lastMsg = '';
    armed = null;
  }
  window.addEventListener('pointerup', endDrag); window.addEventListener('pointercancel', endDrag);

  /* ---------- dessin ---------- */
  function loopPoints() {
    var P = [], i, S0;
    function io(i) { var q = LABO_SL[i]; return q.dir === 1 ? [[q.x - 24, q.y], [q.x + 24, q.y]] : [[q.x + 24, q.y], [q.x - 24, q.y]]; }
    var a = io(0), b1 = io(1), b2 = io(2), b3 = io(3), b4 = io(4);
    return { path: [a[1], [40, 232], [40, 66], b1[0], b1[1], b2[0], b2[1], [360, 66], [360, 232], b3[0], b3[1], b4[0], b4[1], a[0]], io: io };
  }
  var LP = loopPoints();
  PC.anim(svg, function (dt, t) {
    dyn.replaceChildren(); tm = t;
    var s = simulate(true), M = LABO_MISSIONS[mi];
    phase += dt * clamp(s.I * 28, 0, 1.4); flash = Math.max(0, flash - dt * 1.5); ammeter += (s.I * 1000 - ammeter) * Math.min(1, dt * 9);
    /* fils */
    var P = LP.path; wire(dyn, P.slice(0, 4), s.short ? RED : WIRE, 2.2); wire(dyn, [P[4], P[5]], s.short ? RED : WIRE, 2.2);
    wire(dyn, [P[6], P[7], P[8], P[9]], s.short ? RED : WIRE, 2.2); wire(dyn, [P[10], P[11]], s.short ? RED : WIRE, 2.2); wire(dyn, [P[12], P[13]], s.short ? RED : WIRE, 2.2);
    /* pile */
    sBat(dyn, LABO_SL[0].x, LABO_SL[0].y, 'Pile ' + laboFr(src) + ' V', 48);
    var near = drag && drag.moved ? nearest(drag.x, drag.y) : -1;
    for (var i = 1; i <= 4; i++) {
      var q = LABO_SL[i], p = slots[i];
      if (!p) {
        S('rect', { x: q.x - 30, y: q.y - 20, width: 60, height: 40, rx: 8, style: 'fill:' + (near === i ? BLUE : 'none') + ';fill-opacity:.15;stroke:' + (near === i || armed ? BLUE : '#2f4a60') + ';stroke-width:1.8;stroke-dasharray:4 4' }, dyn);
        ln(dyn, q.x - 24, q.y, q.x + 24, q.y, '#4a647a', 2); txt(dyn, q.x, q.y - 28, 'emplacement ' + i, '#6f8aa0', 'middle', 8.5);
      } else {
        var st = p; ln(dyn, q.x - 24, q.y, q.x + 24, q.y, WIRE, 2);
        if (p.t === 'wire' && s.short) p.hot = true; else p.hot = false;
        laboDrawPiece(dyn, p.t, q.x, q.y, st, t, 48); txt(dyn, q.x, q.y + (q.dir === 1 ? -22 : 34), laboLabel(p.t, p), p.burned ? RED : '#9fb8cc', 'middle', 9.5);
        if (near === i) S('rect', { x: q.x - 32, y: q.y - 24, width: 64, height: 48, rx: 8, style: 'fill:none;stroke:' + AMBER + ';stroke-width:2' }, dyn);
      }
    }
    if (s.I > 0.0005) flow(dyn, P, phase, 10, s.short ? RED : AMBER, 2.8);
    /* ampèremètre au centre */
    var big = s.run && s.I >= 0 ? laboFr(ammeter, ammeter < 10 ? 1 : 0) + ' mA' : '--', small = s.short ? 'COURT-CIRCUIT' : (s.open ? 'circuit ouvert' : (s.any ? 'ampèremètre' : 'circuit vide'));
    lcdBox(dyn, 150, 116, 100, 76, s.short ? laboFr(ammeter / 1000, 1) + ' A' : big, small, s.short || (s.open && s.any) ? RED : GREEN);
    /* bandeau de mission */
    txt(dyn, 14, 30, (mi ? 'Mission ' + mi + ' · ' : '') + M.t + (done[mi] ? '  ✓' : ''), done[mi] ? GREEN : AMBER, 'start', 11, true);
    if (flash > 0) S('rect', { x: 0, y: 0, width: 400, height: 424, style: 'fill:' + RED + ';opacity:' + (flash * .18) }, dyn);
    /* plateau de composants */
    txt(dyn, 14, 281, 'Plateau : glisse un composant, ou touche-le puis un emplacement', '#6f8aa0', 'start', 9);
    LABO_PIECES.forEach(function (d, k) {
      var cx = (k < 5 ? 10 + k * 76 : 48 + (k - 5) * 76) + 38, cy = (k < 5 ? 286 : 350) + 24, on = armed === d.t;
      S('rect', { x: cx - 36, y: cy - 22, width: 72, height: 60, rx: 8, style: 'fill:' + (on ? AMBER : '#0d1620') + ';fill-opacity:' + (on ? .2 : .85) + ';stroke:' + (on ? AMBER : '#2a4660') + ';stroke-width:' + (on ? 2.4 : 1.4) }, dyn);
      laboDrawPiece(dyn, d.t, cx, cy, { on: false, pressed: false }, t, 40); txt(dyn, cx, cy + 28, d.n, '#cfe3f2', 'middle', 9.5);
    });
    /* fantôme du glisser */
    if (drag && drag.moved && drag.t) { var g2 = S('g', { style: 'opacity:.85' }, dyn); laboDrawPiece(g2, drag.t, drag.x, drag.y, drag.part || {}, t, 48); }
    /* message et validation de mission */
    var msg = (banner && done[mi] ? banner + ' ' : '') + (s.note || ''); if (msg !== lastMsg) { lastMsg = msg; info.set(msg); }
    if (M.ok && !done[mi]) {
      if (M.ok(s)) { okT += dt; if (okT > .9) { done[mi] = 1; saveDone(); paintChips(); banner = '<b>Mission réussie ✓</b> ' + (mi < LABO_MISSIONS.length - 1 ? 'Passe à la mission suivante.' : 'Tu as réussi toutes les missions.'); } } else okT = 0;
    }
  });
  loadMission(0);
}

PC.extra('t2-5', [
  { short: 'Laboratoire', title: 'Laboratoire : construis tes circuits', intro: 'Six missions : une LED à réparer, la pile de 9 V, un buzzer, une lampe.', build: labCircuit,
    retenir: ['Une <b>résistance</b> en série limite le courant : sans elle, la LED grille.', 'Chaque composant a une <b>tension nominale</b> à ne pas dépasser, et la LED a un sens.'],
    ar: { e: ['المقاومة على التسلسل تحدّ من التيار؛ بدونها تحترق LED. لكل مكوّن توتر اسمي لا يجب تجاوزه، وللـ LED اتجاه.'], u: 'اسحب المكوّنات إلى الأماكن الفارغة، أو المس المكوّن ثم المكان.', w: [['résistance', 'مقاومة'], ['court-circuit', 'دارة قصيرة'], ['tension nominale', 'التوتر الاسمي'], ['bouton-poussoir', 'زر ضغط']] } }
], 'Buzzer');
