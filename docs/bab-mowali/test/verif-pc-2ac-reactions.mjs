// Vérifications de la carte pc-2ac-reactions (node test/verif-pc-2ac-reactions.mjs)
import fs from 'fs'; global.window = {};
eval(fs.readFileSync(new URL('../chapitres/pc-2ac-reactions.js', import.meta.url), 'utf8'));
const C = window.BAB_CHAPTER, D = C.doors, R = []; const chk = (n, a, b, t = 1e-9) => R.push([n, Math.abs(a - b) <= t, a, b]);
const atoms = (f) => [...f.matchAll(/([A-Z][a-z]?)([₀-₉0-9]*)/g)].reduce((s, m) => s + (m[2] ? Number(m[2].replace(/[₀-₉]/g, (c) => c.charCodeAt(0) - 8320)) : 1), 0);
const kinds = (f) => new Set([...f.matchAll(/[A-Z][a-z]?/g)].map((m) => m[0])).size;
chk('H₂O = 3 atomes', atoms('H₂O'), 3); chk('4 H₂O = 12', 4 * atoms('H₂O'), D[0].frags[1].ans);
for (const [f, k] of D[0].frags[2].items) chk(f + ' ' + (k ? 'composé' : 'simple'), kinds(f) > 1 ? 1 : 0, k);
chk('masse : 12 + 32 = 44', 12 + 32, D[2].frags[1].ans);
// C + O2 -> CO2 : conservation des atomes
const side = (s) => s.split('+').reduce((o, t) => { for (const m of t.trim().matchAll(/([A-Z][a-z]?)([₀-₉]*)/g)) o[m[1]] = (o[m[1]] || 0) + (m[2] ? m[2].charCodeAt(0) - 8320 : 1); return o; }, {});
const L = side('C + O₂'), Rr = side('CO₂'); chk('C conservé', L.C, Rr.C); chk('O conservé', L.O, Rr.O); chk('qcm : 2 atomes O', +D[2].frags[2].o[D[2].frags[2].a], L.O);
// butane C4H10 + O2 -> CO2 + H2O : produits attendus
chk('produits de la combustion = CO2 et eau', D[1].frags[1].items.filter((x) => x[1] === 1).map((x) => x[0]).join() === 'Dioxyde de carbone,Eau' ? 1 : 0, 1);
for (const d of D) { if (d.key) chk(d.id + ' mot de passe', d.key.a < d.key.o.length ? 1 : 0, 1); for (const f of d.frags || []) { if (f.t === 'vf') chk(d.id + ' 3 vf', f.items.length, 3); if (f.t === 'qcm') chk(d.id + ' qcm', f.a < f.o.length ? 1 : 0, 1); } }
chk('porte 1 et coffre : url du site public', (D[0].url && D[3].url && /^https:\/\/pc\.taalim\.men\//.test(D[0].url + D[3].url)) ? 1 : 0, 1);
chk('4 portes', D.length, 4); chk('4 audios', C.audio.length, 4);
let bad = 0; for (const [n, g, p, q] of R) if (!g) { bad++; console.log('ECHEC', n, p, q); }
console.log(R.length + ' vérifications, ' + (bad ? bad + ' échecs' : 'toutes justes')); process.exit(bad ? 1 : 0);
