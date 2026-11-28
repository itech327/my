// Vérifications de la carte pc-2ac-lumiere (node test/verif-pc-2ac-lumiere.mjs)
import fs from 'fs'; global.window = {};
eval(fs.readFileSync(new URL('../chapitres/pc-2ac-lumiere.js', import.meta.url), 'utf8'));
const C = window.BAB_CHAPTER, D = C.doors, R = []; const chk = (n, a, b, t = 1e-9) => R.push([n, Math.abs(a - b) <= t, a, b]);
chk('300 000 km/s × 500 s = 150 millions de km', 300000 * 500 / 1e6, D[0].frags[1].ans);
const dSun = 1392000, dMoon = 3474, dES = 149.6e6, dEM = 384400;
chk('Soleil ≈ 400 × plus large que la Lune', Math.round(dSun / dMoon / 100) * 100, 400); chk('Soleil ≈ 400 × plus loin (à 10 % près)', Math.abs(dES / dEM / 400 - 1) < 0.1 ? 1 : 0, 1);
chk('tailles apparentes proches (à 5 %)', Math.abs((dSun / dES) / (dMoon / dEM) - 1) < 0.05 ? 1 : 0, 1);
chk('50 Hz → 100 changements de sens par seconde', 50 * 2, 100);
const s = D[1].frags[1]; chk('3 convergentes, 3 divergentes', s.items.filter((x) => x[1] === 0).length * 10 + s.items.filter((x) => x[1] === 1).length, 33);
chk('myopie corrigée par une divergente (tri)', s.items.find((x) => /myope/.test(x[0]))[1], 1);
chk('myopie corrigée par une divergente (coffre)', D[3].key.o[D[3].key.a] === 'une lentille divergente' ? 1 : 0, 1);
chk('image du myope devant la rétine', D[2].frags[2].o[D[2].frags[2].a] === 'devant la rétine' ? 1 : 0, 1);
chk('consigne de sécurité Soleil', /ne regarde jamais le Soleil/.test(D[1].reveal) ? 1 : 0, 1);
for (const d of D) { if (d.key) chk(d.id + ' mot de passe', d.key.a < d.key.o.length ? 1 : 0, 1); for (const f of d.frags || []) { if (f.t === 'vf') chk(d.id + ' 3 vf', f.items.length, 3); if (f.t === 'order') chk(d.id + ' 4 étapes', f.items.length, 4); } }
chk('4 portes', D.length, 4); chk('4 audios', C.audio.length, 4);
let bad = 0; for (const [n, g, p, q] of R) if (!g) { bad++; console.log('ECHEC', n, p, q); }
console.log(R.length + ' vérifications, ' + (bad ? bad + ' échecs' : 'toutes justes')); process.exit(bad ? 1 : 0);
