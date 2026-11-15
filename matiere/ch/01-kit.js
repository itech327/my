/* ====== Boîte à composants « ingénierie » : symboles normalisés, flux animés, engrenages, SysML ====== */
var BLUE = '#4cc9f0', WIRE = '#cfe3f2', AMBER = '#ffb454', RED = '#ff6b6b', GREEN = '#5be3a3';
function ptAlong(pts, u) {
  var tot = 0, i, seg = [];
  for (i = 1; i < pts.length; i++) { var d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; }
  var t = ((u % 1) + 1) % 1 * tot;
  for (i = 0; i < seg.length; i++) { if (t <= seg[i]) { var k = seg[i] ? t / seg[i] : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]; } t -= seg[i]; }
  return pts[pts.length - 1];
}
/* fil : polyligne ; actif = courant circule (flux animé par flow()) */
function wire(g, pts, col, w) {
  return S('polyline', { points: pts.map(function (p) { return p.join(','); }).join(' '), style: 'fill:none;stroke:' + (col || WIRE) + ';stroke-width:' + (w || 2) + ';stroke-linejoin:round;stroke-linecap:round' }, g);
}
function flow(g, pts, t, n, col, r) {
  for (var i = 0; i < n; i++) { var p = ptAlong(pts, t + i / n); S('circle', { cx: p[0], cy: p[1], r: r || 2.6, style: 'fill:' + (col || AMBER) + ';opacity:.95' }, g); }
}
function node(g, x, y) { return S('circle', { cx: x, cy: y, r: 3, style: 'fill:' + WIRE }, g); }
function label(g, x, y, t, c, anchor, size) { return txt(g, x, y, t, c || '#9fb8cc', anchor || 'middle', size || 10.5); }
/* --- symboles horizontaux : bornes en (x-w/2, y) et (x+w/2, y) --- */
function sBat(g, x, y, lab, w) {
  w = w || 40; ln(g, x - w / 2, y, x - 5, y, WIRE, 2); ln(g, x + 5, y, x + w / 2, y, WIRE, 2);
  ln(g, x - 5, y - 13, x - 5, y + 13, WIRE, 2.5); ln(g, x + 5, y - 7, x + 5, y + 7, WIRE, 4);
  txt(g, x - 14, y - 16, '+', AMBER, 'middle', 12, true); if (lab) label(g, x, y + 28, lab);
}
function sRes(g, x, y, lab, w) {
  w = w || 48; ln(g, x - w / 2, y, x - 14, y, WIRE, 2); ln(g, x + 14, y, x + w / 2, y, WIRE, 2);
  S('rect', { x: x - 14, y: y - 6, width: 28, height: 12, style: 'fill:none;stroke:' + WIRE + ';stroke-width:2' }, g); if (lab) label(g, x, y - 12, lab);
}
function sLed(g, x, y, glow, lab, col, w) {
  w = w || 48; col = col || RED; ln(g, x - w / 2, y, x - 8, y, WIRE, 2); ln(g, x + 8, y, x + w / 2, y, WIRE, 2);
  S('path', { d: 'M' + (x - 8) + ' ' + (y - 9) + 'L' + (x - 8) + ' ' + (y + 9) + 'L' + (x + 8) + ' ' + y + 'Z', style: 'fill:' + col + ';fill-opacity:' + (.15 + .7 * glow) + ';stroke:' + WIRE + ';stroke-width:2' }, g);
  ln(g, x + 8, y - 9, x + 8, y + 9, WIRE, 2.5);
  [[-3, -11], [3, -15]].forEach(function (o) { ln(g, x + o[0] + 2, y + o[1] - 2, x + o[0] + 9, y + o[1] - 9, col, 1.6); });
  if (glow > 0.02) S('circle', { cx: x, cy: y, r: 10 + 22 * glow, style: 'fill:' + col + ';opacity:' + (.12 + .28 * glow) }, g);
  if (lab) label(g, x, y + 26, lab);
}
function sSwitch(g, x, y, closed, lab, w) {
  w = w || 48; ln(g, x - w / 2, y, x - 12, y, WIRE, 2); ln(g, x + 12, y, x + w / 2, y, WIRE, 2);
  circ(g, x - 12, y, 2.6, WIRE, 1, 0); circ(g, x + 12, y, 2.6, WIRE, 1, 0);
  if (closed) ln(g, x - 12, y, x + 12, y, WIRE, 2.5); else ln(g, x - 12, y, x + 10, y - 14, WIRE, 2.5);
  if (lab) label(g, x, y + 22, lab);
}
function sLdr(g, x, y, lab, w) {
  w = w || 48; ln(g, x - w / 2, y, x - 14, y, WIRE, 2); ln(g, x + 14, y, x + w / 2, y, WIRE, 2);
  S('rect', { x: x - 14, y: y - 6, width: 28, height: 12, style: 'fill:none;stroke:' + WIRE + ';stroke-width:2' }, g);
  ln(g, x - 10, y - 20, x - 2, y - 8, AMBER, 1.6); ln(g, x - 2, y - 20, x + 6, y - 8, AMBER, 1.6);
  if (lab) label(g, x, y + 22, lab);
}
function sCap(g, x, y, charge, lab, w) {
  w = w || 40; ln(g, x - w / 2, y, x - 4, y, WIRE, 2); ln(g, x + 4, y, x + w / 2, y, WIRE, 2);
  ln(g, x - 4, y - 12, x - 4, y + 12, WIRE, 3); ln(g, x + 4, y - 12, x + 4, y + 12, WIRE, 3);
  if (charge > 0.02) { S('rect', { x: x - 3, y: y + 13, width: 6, height: 4 + 10 * charge, style: 'fill:' + BLUE + ';opacity:.8' }, g); }
  if (lab) label(g, x, y - 18, lab);
}
function sBuzzer(g, x, y, on, t, lab, w) {
  w = w || 48; ln(g, x - w / 2, y, x - 12, y, WIRE, 2); ln(g, x + 12, y, x + w / 2, y, WIRE, 2);
  circ(g, x, y, 12, WIRE, .06, 2); txt(g, x, y + 4, '♪', WIRE, 'middle', 13, true);
  if (on) for (var i = 0; i < 3; i++) { var a = ((t * 1.6 + i / 3) % 1); S('path', { d: 'M' + (x + 14 + a * 14) + ' ' + (y - 6 - a * 6) + 'Q' + (x + 20 + a * 14) + ' ' + y + ' ' + (x + 14 + a * 14) + ' ' + (y + 6 + a * 6), style: 'fill:none;stroke:' + AMBER + ';stroke-width:2;opacity:' + (1 - a) }, g); }
  if (lab) label(g, x, y + 26, lab);
}
function sMotor(g, x, y, ang, lab, w) {
  w = w || 48; ln(g, x - w / 2, y, x - 16, y, WIRE, 2); ln(g, x + 16, y, x + w / 2, y, WIRE, 2);
  circ(g, x, y, 16, WIRE, .06, 2); txt(g, x, y + 5, 'M', WIRE, 'middle', 14, true);
  for (var i = 0; i < 3; i++) { var a = ang + i * 2.094; ln(g, x + Math.cos(a) * 9, y + Math.sin(a) * 9, x + Math.cos(a) * 15, y + Math.sin(a) * 15, AMBER, 2.4); }
  if (lab) label(g, x, y + 30, lab);
}
/* transistor NPN : B à gauche (x-w/2,y), C en haut (x+10,y-w/2), E en bas */
function sNpn(g, x, y, on, lab) {
  circ(g, x, y, 22, WIRE, .04, 1.6); ln(g, x - 24, y, x - 6, y, WIRE, 2); ln(g, x - 6, y - 14, x - 6, y + 14, WIRE, 3);
  ln(g, x - 6, y - 6, x + 10, y - 18, WIRE, 2); ln(g, x + 10, y - 18, x + 10, y - 34, WIRE, 2);
  ln(g, x - 6, y + 6, x + 10, y + 18, WIRE, 2); ln(g, x + 10, y + 18, x + 10, y + 34, WIRE, 2);
  S('path', { d: 'M' + (x + 10) + ' ' + (y + 18) + 'L' + (x + 2) + ' ' + (y + 17) + 'L' + (x + 6) + ' ' + (y + 10) + 'Z', style: 'fill:' + WIRE }, g);
  if (on) circ(g, x, y, 22, GREEN, .12, 1.6);
  txt(g, x - 22, y - 6, 'B', '#9fb8cc', 'middle', 9); txt(g, x + 22, y - 28, 'C', '#9fb8cc', 'middle', 9); txt(g, x + 22, y + 36, 'E', '#9fb8cc', 'middle', 9);
  if (lab) label(g, x - 24, y + 30, lab, '#9fb8cc', 'end');
}
function sGround(g, x, y) { ln(g, x, y, x, y + 8, WIRE, 2); ln(g, x - 10, y + 8, x + 10, y + 8, WIRE, 2); ln(g, x - 6, y + 12, x + 6, y + 12, WIRE, 2); ln(g, x - 2, y + 16, x + 2, y + 16, WIRE, 2); }
/* cotation (ligne de cote) */
function dim(g, x1, x2, y, t, c) {
  c = c || AMBER; ln(g, x1, y, x2, y, c, 1.3); ln(g, x1, y - 5, x1, y + 5, c, 1.3); ln(g, x2, y - 5, x2, y + 5, c, 1.3);
  S('path', { d: 'M' + x1 + ' ' + y + 'l7 -3v6zM' + x2 + ' ' + y + 'l-7 -3v6z', style: 'fill:' + c }, g); txt(g, (x1 + x2) / 2, y - 6, t, c, 'middle', 10.5);
}
function dimV(g, x, y1, y2, t, c) {
  c = c || AMBER; ln(g, x, y1, x, y2, c, 1.3); ln(g, x - 5, y1, x + 5, y1, c, 1.3); ln(g, x - 5, y2, x + 5, y2, c, 1.3);
  S('path', { d: 'M' + x + ' ' + y1 + 'l-3 7h6zM' + x + ' ' + y2 + 'l-3 -7h6z', style: 'fill:' + c }, g); txt(g, x + 8, (y1 + y2) / 2 + 3, t, c, 'start', 10.5);
}
/* engrenage : n dents, rayon primitif r, rotation rot (rad) */
function gearPath(cx, cy, r, n, rot) {
  var ro = r + r * 0.16, ri = r - r * 0.16, pts = [], i, a, step = Math.PI * 2 / n;
  for (i = 0; i < n; i++) {
    a = rot + i * step;
    [[-.30, ri], [-.17, ro], [.17, ro], [.30, ri]].forEach(function (q) { pts.push((cx + Math.cos(a + q[0] * step * 1.0) * q[1]).toFixed(1) + ',' + (cy + Math.sin(a + q[0] * step * 1.0) * q[1]).toFixed(1)); });
  }
  return 'M' + pts.join('L') + 'Z';
}
function gear(g, cx, cy, r, n, rot, col, hole) {
  S('path', { d: gearPath(cx, cy, r, n, rot), style: 'fill:' + col + ';fill-opacity:.22;stroke:' + col + ';stroke-width:2;stroke-linejoin:round' }, g);
  circ(g, cx, cy, hole || r * .22, col, .5, 1.5);
  ln(g, cx, cy, cx + Math.cos(rot) * r * .6, cy + Math.sin(rot) * r * .6, col, 2);
}
/* ---- SysML ---- */
function sBox(g, x, y, w, hh, stereo, title, color, bodyLines) {
  S('rect', { x: x, y: y, width: w, height: hh, rx: 3, style: 'fill:#0d1620;stroke:' + color + ';stroke-width:1.8' }, g);
  S('rect', { x: x, y: y, width: w, height: stereo ? 25 : 16, rx: 3, style: 'fill:' + color + ';fill-opacity:.16;stroke:none' }, g);
  var ty = y + 11;
  if (stereo) { txt(g, x + w / 2, ty, '« ' + stereo + ' »', color, 'middle', 8.5); ty += 11; }
  txt(g, x + w / 2, ty + 1, title, '#fff', 'middle', 10, true);
  (bodyLines || []).forEach(function (l, i) { txt(g, x + 5, y + (stereo ? 38 : 30) + i * 11, l, '#b7c9d8', 'start', 8.5); });
}
function sActor(g, x, y, lab, col) {
  col = col || BLUE; circ(g, x, y - 18, 6, col, .25, 1.8); ln(g, x, y - 12, x, y + 8, col, 1.8); ln(g, x - 10, y - 5, x + 10, y - 5, col, 1.8);
  ln(g, x, y + 8, x - 8, y + 20, col, 1.8); ln(g, x, y + 8, x + 8, y + 20, col, 1.8); txt(g, x, y + 33, lab, '#e8f1f8', 'middle', 10);
}
function sUse(g, x, y, rx, ry, lab, col) {
  S('ellipse', { cx: x, cy: y, rx: rx, ry: ry, style: 'fill:' + (col || BLUE) + ';fill-opacity:.12;stroke:' + (col || BLUE) + ';stroke-width:1.8' }, g);
  var L = String(lab).split('\n'); L.forEach(function (s, i) { txt(g, x, y + 3 + (i - (L.length - 1) / 2) * 11, s, '#fff', 'middle', 10); });
}
/* liens : kind = assoc | contain | refine | satisfy | gener */
function sLink(g, x1, y1, x2, y2, kind, col, lab) {
  col = col || '#9fb8cc'; var a = Math.atan2(y2 - y1, x2 - x1);
  if (kind === 'assoc') { ln(g, x1, y1, x2, y2, col, 1.5); return; }
  if (kind === 'refine' || kind === 'satisfy') {
    ln(g, x1, y1, x2, y2, col, 1.5, '6 4');
    S('path', { d: 'M' + x2 + ' ' + y2 + 'L' + (x2 - 9 * Math.cos(a - .4)) + ' ' + (y2 - 9 * Math.sin(a - .4)) + 'M' + x2 + ' ' + y2 + 'L' + (x2 - 9 * Math.cos(a + .4)) + ' ' + (y2 - 9 * Math.sin(a + .4)), style: 'stroke:' + col + ';stroke-width:1.5;fill:none' }, g);
    txt(g, (x1 + x2) / 2 + 4, (y1 + y2) / 2 - 3, '« ' + kind + ' »', col, 'start', 8); return;
  }
  if (kind === 'contain') {
    ln(g, x1, y1, x2, y2, col, 1.5); var cx = x1 + Math.cos(a) * 8, cy = y1 + Math.sin(a) * 8;
    circ(g, cx, cy, 8, col, .1, 1.5); ln(g, cx - 5, cy, cx + 5, cy, col, 1.5); ln(g, cx, cy - 5, cx, cy + 5, col, 1.5); return;
  }
  if (kind === 'gener') {
    ln(g, x1, y1, x2 - Math.cos(a) * 9, y2 - Math.sin(a) * 9, col, 1.5);
    S('path', { d: 'M' + x2 + ' ' + y2 + 'L' + (x2 - 10 * Math.cos(a - .45)) + ' ' + (y2 - 10 * Math.sin(a - .45)) + 'L' + (x2 - 10 * Math.cos(a + .45)) + ' ' + (y2 - 10 * Math.sin(a + .45)) + 'Z', style: 'fill:#0d1620;stroke:' + col + ';stroke-width:1.5' }, g);
  }
}
/* rend un objet cliquable et accessible */
function hot(el, fn, aria) {
  el.style.cursor = 'pointer'; el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button'); if (aria) el.setAttribute('aria-label', aria);
  el.addEventListener('click', fn); el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
  return el;
}
var EY2 = '2<sup>e</sup> année · ';

/* ----- Plein écran : l'animation et ses commandes passent sur tout l'écran ----- */
(function () {
  var base = PC.ui.stage, cur = null;
  function leave() { try { if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {}); } catch (e) {} if (!cur) return; cur.classList.remove('fs-on'); document.documentElement.classList.remove('fs-lock'); cur._btn.textContent = '⛶'; cur._btn.setAttribute('aria-label', 'Plein écran'); cur = null; }
  function enter(box, btn) {
    leave(); cur = box; box._btn = btn; box.classList.add('fs-on'); document.documentElement.classList.add('fs-lock');
    btn.textContent = '✕'; btn.setAttribute('aria-label', 'Quitter le plein écran');
    try { var p = box.requestFullscreen && box.requestFullscreen(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
  }
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement) leave(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') leave(); });
  window.addEventListener('hashchange', leave);
  PC.ui.stage = function (el, w, hh, label) {
    var svg = base.apply(this, arguments), st = svg.parentNode;
    var btn = h('button', { 'class': 'fs-btn', type: 'button', 'aria-label': 'Plein écran', title: 'Plein écran' }, '⛶');
    btn.addEventListener('click', function () { if (cur === el) leave(); else enter(el, btn); });
    st.appendChild(btn);
    return svg;
  };
})();

/* ----- Extension : ajouter des leçons à un chapitre existant (PC.extra(id, [leçons], 'short après')) ----- */
(function () {
  var EXTRA = {}, base = PC.chapter;
  PC.extra = function (id, lessons, after) { (EXTRA[id] = EXTRA[id] || []).push({ list: lessons, after: after }); };
  PC.chapter = function (c) {
    var orig = c.lessons;
    c.lessons = function () {
      var l = typeof orig === 'function' ? orig() : orig.slice();
      (EXTRA[c.id] || []).forEach(function (x) {
        var at = l.length; if (x.after) { for (var i = 0; i < l.length; i++) if (l[i].short === x.after) at = i + 1; }
        l.splice.apply(l, [at, 0].concat(x.list));
      });
      return l;
    };
    return base.call(this, c);
  };
})();
