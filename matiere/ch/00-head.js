/* Aides communes aux figures (même cadre que SVT : PC.chapter, PC.ui). */
var PC = window.PC, ui = PC.ui, S = PC.S, h = PC.h, fmt = PC.fmt, clamp = PC.clamp, ease = PC.ease;
var EY = '3<sup>e</sup> année · ';
var T = 'var(--teal)', P = 'var(--pink)', C = 'var(--coral)', L = 'var(--lav)', GOLD = '#e9b84a', INK = '#fff';
function lerp(a, b, t) { return a + (b - a) * t; }
function fm(x, d) { return fmt(x, d === undefined ? 1 : d); }
function txt(g, x, y, t, c, anchor, size, bold) {
  return S('text', { x: x, y: y, 'class': 'note', text: t, style: 'fill:' + (c || INK) + ';text-anchor:' + (anchor || 'middle') + ';font-size:' + (size || 12) + 'px' + (bold ? ';font-weight:700' : '') }, g);
}
function ln(g, x1, y1, x2, y2, c, w, dash) {
  var a = { x1: x1, y1: y1, x2: x2, y2: y2, style: 'stroke:' + c + ';stroke-width:' + (w || 2) + ';stroke-linecap:round' };
  if (dash) a['stroke-dasharray'] = dash;
  return S('line', a, g);
}
function rect(g, x, y, w, hh, c, op, r, sw) {
  return S('rect', { x: x, y: y, width: w, height: hh, rx: r === undefined ? 10 : r, style: 'fill:' + c + ';fill-opacity:' + (op === undefined ? .22 : op) + ';stroke:' + c + ';stroke-width:' + (sw || 2.5) }, g);
}
function circ(g, x, y, r, c, op, sw) {
  return S('circle', { cx: x, cy: y, r: r, style: 'fill:' + c + ';fill-opacity:' + (op === undefined ? .3 : op) + ';stroke:' + c + ';stroke-width:' + (sw === undefined ? 2.5 : sw) }, g);
}
/* bloc avec libellé centré */
function block(g, x, y, w, hh, t, c, size) {
  var r = rect(g, x, y, w, hh, c);
  var lines = String(t).split('\n'), y0 = y + hh / 2 - (lines.length - 1) * 7 + 4;
  lines.forEach(function (s, i) { txt(g, x + w / 2, y0 + i * 14, s, INK, 'middle', size || 12); });
  return r;
}
/* flèche pleine de (x1,y1) vers (x2,y2) */
function arrow(g, x1, y1, x2, y2, c, w) {
  var a = Math.atan2(y2 - y1, x2 - x1), s = 8;
  ln(g, x1, y1, x2 - Math.cos(a) * 4, y2 - Math.sin(a) * 4, c, w || 2.5);
  S('path', { d: 'M' + x2 + ' ' + y2 + 'L' + (x2 - s * Math.cos(a - .45)) + ' ' + (y2 - s * Math.sin(a - .45)) + 'L' + (x2 - s * Math.cos(a + .45)) + ' ' + (y2 - s * Math.sin(a + .45)) + 'Z', style: 'fill:' + c }, g);
}
function pathd(g, d, c, w, fill, op) {
  return S('path', { d: d, style: 'fill:' + (fill || 'none') + (fill ? ';fill-opacity:' + (op === undefined ? .3 : op) : '') + ';stroke:' + c + ';stroke-width:' + (w || 2.5) + ';stroke-linecap:round;stroke-linejoin:round' }, g);
}
/* petits pictogrammes de systèmes (cx, cy = centre, s = échelle) */
function picto(g, kind, cx, cy, s) {
  s = s || 1;
  function X(x) { return cx + x * s; } function Y(y) { return cy + y * s; }
  if (kind === 'primitif') {
    circ(g, X(-20), Y(-34), 8 * s, P, .4); ln(g, X(-20), Y(-26), X(-20), Y(8), P, 3 * s);
    ln(g, X(-20), Y(-14), X(14), Y(-2), P, 3 * s); ln(g, X(-20), Y(8), X(-32), Y(34), P, 3 * s); ln(g, X(-20), Y(8), X(-6), Y(34), P, 3 * s);
    ln(g, X(14), Y(-2), X(34), Y(34), GOLD, 3 * s); ln(g, X(34), Y(34), X(48), Y(30), GOLD, 3 * s);
  } else if (kind === 'mecanise') {
    rect(g, X(-34), Y(-4), 64 * s, 26 * s, T, .3, 6); rect(g, X(-4), Y(-26), 28 * s, 22 * s, T, .3, 4);
    circ(g, X(-20), Y(26), 12 * s, GOLD, .3); circ(g, X(18), Y(26), 12 * s, GOLD, .3);
    circ(g, X(8), Y(-34), 6 * s, P, .4); ln(g, X(8), Y(-28), X(8), Y(-18), P, 3 * s);
  } else if (kind === 'automatise') {
    rect(g, X(-34), Y(-4), 64 * s, 26 * s, L, .3, 6); rect(g, X(-4), Y(-26), 28 * s, 22 * s, L, .3, 4);
    circ(g, X(-20), Y(26), 12 * s, GOLD, .3); circ(g, X(18), Y(26), 12 * s, GOLD, .3);
    circ(g, X(34), Y(-26), 5 * s, C, .6); pathd(g, 'M' + X(42) + ' ' + Y(-34) + 'Q' + X(50) + ' ' + Y(-26) + ' ' + X(42) + ' ' + Y(-18), C, 2 * s);
    pathd(g, 'M' + X(48) + ' ' + Y(-40) + 'Q' + X(60) + ' ' + Y(-26) + ' ' + X(48) + ' ' + Y(-12), C, 2 * s);
  } else {
    rect(g, X(-34), Y(20), 44 * s, 14 * s, C, .3, 4);
    ln(g, X(-12), Y(20), X(-4), Y(-14), C, 5 * s); ln(g, X(-4), Y(-14), X(30), Y(-30), C, 5 * s);
    circ(g, X(-12), Y(20), 5 * s, GOLD, .8); circ(g, X(-4), Y(-14), 5 * s, GOLD, .8); circ(g, X(30), Y(-30), 5 * s, GOLD, .8);
    ln(g, X(30), Y(-30), X(42), Y(-24), GOLD, 3 * s); ln(g, X(30), Y(-30), X(42), Y(-38), GOLD, 3 * s);
    circ(g, X(46), Y(8), 5 * s, T, .6);
  }
}
/* suit une ligne brisée : renvoie le point à la proportion p (0..1) */
function follower(pts) {
  var cum = [0], i, tot = 0;
  for (i = 1; i < pts.length; i++) { tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); cum.push(tot); }
  return {
    total: tot,
    at: function (p) {
      p = clamp(p, 0, 1); var d = p * tot, k = 1;
      while (k < cum.length - 1 && cum[k] < d) k++;
      var a = pts[k - 1], b = pts[k], s = (d - cum[k - 1]) / ((cum[k] - cum[k - 1]) || 1);
      return { x: lerp(a[0], b[0], s), y: lerp(a[1], b[1], s) };
    }
  };
}
function poly(pts) { return 'M' + pts.map(function (p) { return p[0] + ' ' + p[1]; }).join('L'); }
/* symboles de flux : ovale, parallélogramme, losange, rectangle (retourne {el, cx, cy}) */
function fcNode(g, kind, cx, cy, w, hh, t, c) {
  var e;
  if (kind === 'oval') e = S('rect', { x: cx - w / 2, y: cy - hh / 2, width: w, height: hh, rx: hh / 2 }, g);
  else if (kind === 'io') e = S('path', { d: 'M' + (cx - w / 2 + 12) + ' ' + (cy - hh / 2) + 'L' + (cx + w / 2) + ' ' + (cy - hh / 2) + 'L' + (cx + w / 2 - 12) + ' ' + (cy + hh / 2) + 'L' + (cx - w / 2) + ' ' + (cy + hh / 2) + 'Z' }, g);
  else if (kind === 'test') e = S('path', { d: 'M' + cx + ' ' + (cy - hh / 2) + 'L' + (cx + w / 2) + ' ' + cy + 'L' + cx + ' ' + (cy + hh / 2) + 'L' + (cx - w / 2) + ' ' + cy + 'Z' }, g);
  else e = S('rect', { x: cx - w / 2, y: cy - hh / 2, width: w, height: hh, rx: 4 }, g);
  var lines = String(t).split('\n');
  var tx = lines.map(function (s, i) { return txt(g, cx, cy + 4 - (lines.length - 1) * 7 + i * 14, s, INK, 'middle', 11.5); });
  var o = { el: e, cx: cx, cy: cy, w: w, hh: hh, c: c, on: function (v) { e.setAttribute('style', 'fill:' + c + ';fill-opacity:' + (v ? .6 : .18) + ';stroke:' + c + ';stroke-width:' + (v ? 3.5 : 2.2)); } };
  o.on(false);
  return o;
}
/* signal : analogique (courbe) ou logique (créneaux) ; renvoie y pour la phase t */
function sigY(kind, t) {
  if (kind === 'logique') return Math.sin(t * 2.1) > 0.15 ? -1 : 1;
  return Math.sin(t * 2.4) * .8 + Math.sin(t * 5.1) * .2;
}
