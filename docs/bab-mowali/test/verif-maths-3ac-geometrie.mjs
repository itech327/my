// Recalcul indépendant des nombres de la carte maths-3ac-geometrie (node test/verif-maths-3ac-geometrie.mjs)
import fs from 'fs'; global.window = {};
eval(fs.readFileSync(new URL('../chapitres/maths-3ac-geometrie.js', import.meta.url), 'utf8'));
const C = window.BAB_CHAPTER, D = C.doors, R = []; const chk = (n, a, b, t = 1e-9) => R.push([n, Math.abs(a - b) <= t, a, b]);
const deg = (r) => r * 180 / Math.PI, rad = (d) => d * Math.PI / 180;
chk('échelle h = 4 m', Math.sqrt(5 ** 2 - 3 ** 2), 4); chk('5 − 3 = 2 ≠ 4', 5 - 3, 2);
chk('hypoténuse 6-8', Math.hypot(6, 8), D[0].frags[1].ans); chk('5-12-13 rectangle', 5 ** 2 + 12 ** 2, 13 ** 2);
chk('cos α = 0,6', 3 / 5, 0.6); chk('α ≈ 53°', Math.round(deg(Math.acos(0.6))), 53);
chk('pied à 75° ≈ 1,3 m', Math.round(5 * Math.cos(rad(75)) * 10) / 10, 1.3);
chk('cos Â = 4/5', 4 / 5, D[1].frags[1].ans); chk('5 cos 60° = 2,5', 5 * Math.cos(rad(60)), 2.5, 1e-12); chk('5 sin 60° ≈ 4,33 (leurre)', Math.round(5 * Math.sin(rad(60)) * 100) / 100, 4.33);
chk('photo 150 → 600 cm²', 20 * 30 / (10 * 15), 4); chk('cube 2 cm k=3 → 216', 2 ** 3 * 3 ** 3, D[2].frags[1].ans); chk('aire ÷ 4 pour k=0,5', 1 / 0.5 ** 2, 4);
chk('coffre hauteur 30 m', 0.30 * 100, 30); chk('coffre ombre ≈ 25,2 m', Math.round(30 / Math.tan(rad(50)) * 10) / 10, 25.2);
chk('coffre volume 1 200 000 dm³ = 1200 m³', 1.2 * 100 ** 3 / 1000, 1200);
for (const d of D) for (const f of d.frags || []) { if (f.t === 'num') chk(d.id + ' réponse positive', f.ans > 0 ? 1 : 0, 1); if (f.t === 'qcm') chk(d.id + ' qcm valide', f.a < f.o.length ? 1 : 0, 1); }
chk('4 portes', D.length, 4); chk('4 audios', C.audio.length, 4);
let bad = 0; for (const [n, g, p, q] of R) if (!g) { bad++; console.log('ECHEC', n, p, q); }
console.log(R.length + ' vérifications, ' + (bad ? bad + ' échecs' : 'toutes justes')); process.exit(bad ? 1 : 0);
