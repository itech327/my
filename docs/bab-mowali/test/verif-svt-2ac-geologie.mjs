// Vérifications de la carte svt-2ac-geologie (node test/verif-svt-2ac-geologie.mjs)
import fs from 'fs'; global.window = {};
eval(fs.readFileSync(new URL('../chapitres/svt-2ac-geologie.js', import.meta.url), 'utf8'));
const C = window.BAB_CHAPTER, D = C.doors, R = []; const chk = (n, a, b, t = 1e-9) => R.push([n, Math.abs(a - b) <= t, a, b]);
chk('2 cm/an × 1000 ans = 20 m', 2 * 1000 / 100, D[0].frags[1].ans); chk('72 km ÷ 6 km/s = 12 s', 72 / 6, D[1].frags[1].ans);
chk('Al Haouz : septembre 2023 dans l’énigme', /septembre 2023/.test(D[1].hook) ? 1 : 0, 1); chk('pas de chiffre de victimes', /mort|victime|décès/i.test(JSON.stringify(D)) ? 0 : 1, 1);
const s = D[2].frags[1]; chk('2 plis, 2 failles', s.items.filter((x) => x[1] === 0).length * 10 + s.items.filter((x) => x[1] === 1).length, 22);
chk('plis = compression (qcm)', D[2].frags[2].o[D[2].frags[2].a] === 'une compression' ? 1 : 0, 1);
for (const d of D) { if (d.key) chk(d.id + ' mot de passe', d.key.a < d.key.o.length ? 1 : 0, 1); for (const f of d.frags || []) { if (f.t === 'vf') chk(d.id + ' 3 vf', f.items.length, 3); if (f.t === 'num') chk(d.id + ' positif', f.ans > 0 ? 1 : 0, 1); } }
chk('portes 1, 3 et coffre : url svt.taalim.men', [D[0], D[2], D[3]].every((d) => /^https:\/\/svt\.taalim\.men\//.test(d.url)) ? 1 : 0, 1);
chk('4 portes', D.length, 4); chk('4 audios', C.audio.length, 4);
let bad = 0; for (const [n, g, p, q] of R) if (!g) { bad++; console.log('ECHEC', n, p, q); }
console.log(R.length + ' vérifications, ' + (bad ? bad + ' échecs' : 'toutes justes')); process.exit(bad ? 1 : 0);
