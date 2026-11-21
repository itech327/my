'use strict';
// svt-1ac shared drawing kit: plants, leaves, sun, flow arrows and moving particles.
// Names start with pm/arT so they never clash with the engine's globals.

const PM = {
  SUN: '#f0c060', CO2: '#9b92dc', O2: '#6ccdb6', SUGAR: '#e371cb',
  LEAF: '#2c5a46', LEAFE: '#6ccdb6', CHL: '#8fe0cb',
  PALE: '#d8c46a', PALEF: '#5a5230',
  POT: '#c96a4a', SOIL: '#2a1e1c', ROOT: '#c9a06a', WATER: '#7fb2ff',
  BLUE: '#1b2050', BROWN: '#c8963c', FOIL: '#c9ccd6',
};

// Arabic text in its own right-to-left run. align: 'center' | 'right' (x is the right end) | 'left' (x is the left end)
function arT(p, str, { x = 0, y = 0, size = 34, fill = COL.chalk, weight = 600, align = 'center', o = 1 } = {}) {
  const e = T(p, str, { x, y, size, fill, weight, o, anchor: align === 'center' ? 'middle' : align === 'right' ? 'start' : 'end' });
  e.setAttribute('direction', 'rtl');
  return e;
}

// left-to-right formula text (CO₂ + H₂O …) in the maths font
function pmF(p, str, { x = 0, y = 0, size = 56, fill = COL.chalk, weight = 700, anchor = 'middle', o = 1 } = {}) {
  const e = T(p, str, { x, y, size, fill, weight, anchor, o, font: MATH });
  e.setAttribute('direction', 'ltr');
  return e;
}

// world position of a point (lx, ly) given in a group's own coordinates placed at {x, y, s, r}
function pmAt(g, lx, ly) {
  const { x = 0, y = 0, s = 1, r = 0 } = g, a = r * Math.PI / 180;
  return [x + s * (lx * Math.cos(a) - ly * Math.sin(a)), y + s * (lx * Math.sin(a) + ly * Math.cos(a))];
}

// A leaf from its base (0,0) to its tip (240,0). split: two halves (base half, tip half) for the foil experiment.
function pmLeaf(p, { x = 0, y = 0, s = 1, r = 0, fill = PM.LEAF, edge = PM.LEAFE, split = false, o = 1 } = {}) {
  const g = G(p, { x, y, s, r, o });
  const sw = 2.4 / s;
  const parts = split
    ? [path(g, 'M0,0 Q60,-45 120,-45 L120,45 Q60,45 0,0 Z', { fill, stroke: 'none' }),
       path(g, 'M120,-45 Q180,-45 240,0 Q180,45 120,45 Z', { fill, stroke: 'none' })]
    : [path(g, 'M0,0 Q120,-90 240,0 Q120,90 0,0 Z', { fill, stroke: 'none' })];
  const outline = path(g, 'M0,0 Q120,-90 240,0 Q120,90 0,0 Z', { fill: 'none', stroke: edge, 'stroke-width': sw });
  const vein = path(g, 'M0,0 L232,0 M60,0 L90,-28 M60,0 L90,28 M120,0 L150,-30 M120,0 L150,30 M175,0 L198,-20 M175,0 L198,20',
    { fill: 'none', stroke: edge, 'stroke-width': sw * .7, 'stroke-opacity': .7, 'stroke-linecap': 'round' });
  g.blades = parts; g.outline = outline; g.vein = vein; g.place = { x, y, s, r };
  return g;
}

// Chloroplast dots inside a leaf (its own coordinates), hidden until popped.
function pmChloro(leaf, n = 14) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const lx = 30 + (i * 157) % 190, w = 70 * Math.sin(Math.PI * lx / 240) * .7;
    const ly = ((i * 37) % 100) / 100 * 2 * w - w;
    pts.push([lx, ly]);
  }
  return pts.map(([lx, ly]) => {
    const d = G(leaf, { x: lx, y: ly, s: 0, o: 0 });
    mk('ellipse', { rx: 7, ry: 4.5, fill: PM.CHL }, d);
    return d;
  });
}

// A bean plant. ground: roots in soil, no pot. Returns the group with .up (stem and leaves, scales from the base),
// .stem, .leaves, .blades and .leafAt(i) (world centre of leaf i).
function pmPlant(p, { x = 0, y = 0, s = 1, pale = false, ground = false, o = 1 } = {}) {
  const g = G(p, { x, y, s, o });
  const fill = pale ? PM.PALEF : PM.LEAF, edge = pale ? PM.PALE : PM.LEAFE;
  if (ground) {
    g.roots = path(g, 'M0,0 L0,70 M0,20 L-40,70 M0,20 L40,72 M0,45 L-62,110 M0,45 L58,112 M0,70 L-20,120 M0,70 L22,124',
      { fill: 'none', stroke: PM.ROOT, 'stroke-width': 3.2, 'stroke-linecap': 'round' });
  } else {
    path(g, 'M-62,-72 L62,-72 L48,0 L-48,0 Z', { fill: PM.POT });
    mk('rect', { x: -68, y: -84, width: 136, height: 16, rx: 5, fill: '#b55c3e' }, g);
  }
  const base = ground ? 0 : -78;
  const up = G(g, { x: 0, y: base });
  g.stem = path(up, 'M0,0 C6,-60 -6,-120 0,-180', { fill: 'none', stroke: edge, 'stroke-width': 7, 'stroke-linecap': 'round' });
  const L = [[0, -176, -150, .62], [0, -150, -32, .66], [0, -105, -168, .48]];
  g.leaves = L.map(([lx, ly, r, k]) => pmLeaf(up, { x: lx, y: ly, s: k, r, fill, edge }));
  g.blades = g.leaves.flatMap(l => l.blades);
  g.edges = g.leaves.flatMap(l => [l.outline, l.vein]);
  g.up = up;
  g.leafAt = i => { const [lx, ly, r, k] = L[i]; const c = pmAt({ x: lx, y: ly + base, r, s: k }, 120, 0); return pmAt({ x, y, s }, c[0], c[1]); };
  g.top = pmAt({ x, y, s }, 0, base - 180);
  return g;
}

// Turn a plant pale (or green again) from t0.
function pmFade(pl, pale, t0, dur = 1.6) {
  const fill = pale ? PM.PALEF : PM.LEAF, edge = pale ? PM.PALE : PM.LEAFE;
  pl.blades.forEach(b => tw(b, { c_fill: fill }, t0, dur));
  pl.edges.forEach(b => tw(b, { c_stroke: edge }, t0, dur));
  tw(pl.stem, { c_stroke: edge }, t0, dur);
}

function pmSun(p, x, y, r = 46, o = 1) {
  const g = G(p, { x, y, o });
  const rays = G(g, {});
  for (let i = 0; i < 10; i++) {
    const a = i * 36 * Math.PI / 180;
    path(rays, `M${(r + 10) * Math.cos(a)},${(r + 10) * Math.sin(a)} L${(r + 30) * Math.cos(a)},${(r + 30) * Math.sin(a)}`,
      { stroke: PM.SUN, 'stroke-width': 5, 'stroke-linecap': 'round' });
  }
  mk('circle', { r, fill: PM.SUN }, g);
  g.rays = rays;
  return g;
}

// A straight or curved arrow drawn on: returns { line, head, run(t0, dur) }. d: an SVG path string from start to end.
function pmArrow(p, d, x2, y2, ang, col, w = 5, { dash = false } = {}) {
  const line = path(p, d, { fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, { d: 0 });
  const head = G(p, { x: x2, y: y2, r: ang, o: 0 });
  path(head, `M0,0 L${-4.2 * w},${-2.4 * w} L${-4.2 * w},${2.4 * w} Z`, { fill: col });
  return { line, head, run(t0, dur = .9) { draw(line, t0, dur); show(head, t0 + dur * .85, .2); } };
}

// Particles that travel along a path element forever from t0 (a deterministic function of the beat clock).
// make(i) builds particle i (drawn around 0,0); speed in px per second; gap in seconds between particles.
function pmStream(pathEl, make, { t0 = 0, n = 5, period = 2.4, fadeIn = .3 } = {}) {
  const len = pathEl.getTotalLength();
  const items = Array.from({ length: n }, (_, i) => { const e = make(i); put(e, { o: 0 }); return e; });
  clockRun(t => {
    items.forEach((e, i) => {
      const u = t - t0 - i * period / n;
      if (u < 0) { if (st(e).o !== 0) put(e, { o: 0 }); return; }
      const q = (u % period) / period, pt = pathEl.getPointAtLength(q * len);
      const o = Math.min(1, q / .12, (1 - q) / .12, u / fadeIn);
      put(e, { x: pt.x, y: pt.y, o: Math.max(0, o) });
    });
  }, 0, { tail: true });
  return items;
}

// A small chip with formula text (CO₂, O₂, H₂O) for streams
function pmChip(p, str, col, size = 30) {
  const g = G(p, {});
  const w = str.length * size * .55 + 24;
  mk('rect', { x: -w / 2, y: -size * .78, width: w, height: size * 1.3, rx: size * .65, fill: '#171225', stroke: col, 'stroke-width': 2.5 }, g);
  const t = T(g, str, { x: 0, y: size * .22, size, fill: col, weight: 700, anchor: 'middle', font: MATH });
  t.setAttribute('direction', 'ltr');
  return g;
}

// a thin pointer line from a label to the thing it names, drawn on at t0
function pmPointer(p, x1, y1, x2, y2, col, t0) {
  const l = path(p, `M${x1},${y1} L${x2},${y2}`, { fill: 'none', stroke: col, 'stroke-width': 2.5 }, { d: 0 });
  draw(l, t0, .5);
  const dot = G(p, { x: x2, y: y2, o: 0, s: 0 });
  mk('circle', { r: 6, fill: col }, dot);
  pop(dot, t0 + .45);
  return l;
}
