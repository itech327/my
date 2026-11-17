// Extrait les questions de chaque leçon (Je me prépare et Je fais seul) pour les examens.
// Appelé par build.py :  node questions.js fichier1.js fichier2.js ...  → JSON sur la sortie standard.
'use strict';
const fs = require('fs');
const vm = require('vm');

function stub() {
  const f = function () { return proxy; };
  const proxy = new Proxy(f, { get: (t, k) => (k === Symbol.toPrimitive ? () => '' : proxy), apply: () => proxy, construct: () => proxy });
  return proxy;
}

const out = {};
for (const file of process.argv.slice(2)) {
  let def = null;
  const MV = new Proxy({}, { get: (t, k) => (k === 'lesson' ? (d) => { def = d; } : stub()) });
  const ctx = { MV, window: {}, document: stub(), Math, setTimeout() {}, clearTimeout() {}, requestAnimationFrame() {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  if (!def) throw new Error(file + ' : MV.lesson non appelé');
  const keep = (x) => {
    const q = { lvl: +String(x.lvl).replace(/\D/g, ''), q: x.q, a: x.a };
    for (const k of ['o', 'tol', 'unit', 'e', 'ok', 'hint']) if (x[k] != null) q[k] = x[k];
    return q;
  };
  out[def.id] = {
    prepare: def.prepare.map((p) => ({ q: p[0], a: p[1], e: p[2] })),
    seul: def.seul.map(keep)
  };
}
process.stdout.write(JSON.stringify(out));
