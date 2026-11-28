// Recalcul indépendant des nombres de la carte maths-2ac-calcul (node test/verif-maths-2ac-calcul.mjs)
import fs from 'fs'; global.window = {};
eval(fs.readFileSync(new URL('../chapitres/maths-2ac-calcul.js', import.meta.url), 'utf8'));
const C = window.BAB_CHAPTER, D = C.doors, R = []; const chk = (n, a, b, t = 1e-9) => R.push([n, Math.abs(a - b) <= t, a, b]);
chk('3 h = 9 périodes de 20 min', 180 / 20, 9); chk('2⁹ = 512', 2 ** 9, 512); chk('mot de passe porte 2 = 512', +D[1].key.o[D[1].key.a], 512);
chk('2⁵ = 32 ≠ 10', 2 ** 5, 32); chk('10⁻² = 0,01', 10 ** -2, 0.01, 1e-15); chk('3⁴ = 81', 3 ** 4, D[0].frags[1].ans);
for (const x of [0, 1, 4, 7.5]) chk('(x+3)(x+2) = x²+5x+6 pour x=' + x, (x + 3) * (x + 2), x * x + 5 * x + 6, 1e-9);
chk('aire x=4 : 42', (4 + 3) * (4 + 2), D[1].frags[1].ans); chk('16 + 20 + 6 = 42', 16 + 20 + 6, 42);
for (const x of [0, 3, 10]) chk('4(x−2) = 4x−8 pour x=' + x, 4 * (x - 2), 4 * x - 8);
const A = (h) => 10 + 4 * h, B = (h) => 25 + h; chk('vélos : x = 5', (25 - 10) / (4 - 1), 5); chk('A(5) = B(5) = 30', A(5), 30); chk('B(5) = 30', B(5), 30);
chk('avant 5 h A moins cher', A(2) < B(2) ? 1 : 0, 1); chk('après 5 h B moins cher', B(8) < A(8) ? 1 : 0, 1);
chk('5x − 7 = 33 → 8', (33 + 7) / 5, D[2].frags[2].ans); chk('2x+1=7 → 3', (7 - 1) / 2, 3);
chk('recette : 6 personnes = 450 g', 300 / 4 * 6, 450); chk('mot de passe coffre x = 5', 15 / 3, 5);
for (const d of D) for (const f of d.frags || []) { if (f.t === 'num') chk(d.id + ' réponse positive', f.ans > 0 ? 1 : 0, 1); if (f.t === 'order') chk(d.id + ' 4 étapes', f.items.length, 4); }
chk('4 portes', D.length, 4); chk('4 audios', C.audio.length, 4);
let bad = 0; for (const [n, g, p, q] of R) if (!g) { bad++; console.log('ECHEC', n, p, q); }
console.log(R.length + ' vérifications, ' + (bad ? bad + ' échecs' : 'toutes justes')); process.exit(bad ? 1 : 0);
