// Recalcul indépendant des nombres de la carte maths-3ac-fonctions (node test/verif-maths-3ac-fonctions.mjs)
import fs from 'fs'; global.window = {};
eval(fs.readFileSync(new URL('../chapitres/maths-3ac-fonctions.js', import.meta.url), 'utf8'));
const C = window.BAB_CHAPTER, D = C.doors, R = []; const chk = (n, a, b, t = 1e-9) => R.push([n, Math.abs(a - b) <= t, a, b]);
const oranges = (x) => 18 / 3 * x; chk('6 kg → 36 DH', oranges(6), 36); chk('1,5 kg → 9 DH', oranges(1.5), 9);
chk('a = f(4)/4', 10 / 4, D[0].frags[1].ans); chk('f(-2) pour -3x', -3 * -2, 6); chk('qcm porte 1 = "6"', +D[0].frags[2].o[D[0].frags[2].a], 6);
const A = (x) => 4 * x + 5, B = (x) => 3 * x + 11;
chk('taxi 2 km = 13', A(2), 13); chk('taxi 4 km = 21', A(4), 21); chk('2 × 13 = 26 ≠ 21', 2 * A(2) - A(4), 5);
chk('pente (21-13)/(4-2)', (A(4) - A(2)) / 2, 4); chk('a = (13-7)/(3-1)', (13 - 7) / (3 - 1), D[1].frags[1].ans);
chk('4x+5=25 → x=5', (25 - 5) / 4, +D[1].frags[2].o[D[1].frags[2].a]);
const x = (11 - 5) / (4 - 3); chk('intersection x', x, D[2].frags[2].ans); chk('intersection y = 29', A(x), 29); chk('B(6) = 29', B(6), 29);
chk('avant 6 km A moins cher', A(3) < B(3) ? 1 : 0, 1); chk('après 6 km B moins cher', B(10) < A(10) ? 1 : 0, 1);
// coffre : 3a + 2e = 130, 2a + 4e = 140
const e = (3 * 140 / 2 - 130) / (3 * 4 / 2 - 2), a = (140 - 4 * e) / 2; chk('coffre e = 20', e, 20); chk('coffre a = 30', a, 30);
chk('vérif 1', 3 * a + 2 * e, 130); chk('vérif 2', 2 * a + 4 * e, 140);
for (const d of D) for (const f of d.frags || []) { if (f.t === 'num') chk(d.id + ' réponse positive', f.ans > 0 ? 1 : 0, 1); if (f.t === 'order') chk(d.id + ' 4 étapes', f.items.length, 4); }
chk('4 portes', D.length, 4); chk('4 audios', C.audio.length, 4);
let bad = 0; for (const [n, g, p, q] of R) if (!g) { bad++; console.log('ECHEC', n, p, q); }
console.log(R.length + ' vérifications, ' + (bad ? bad + ' échecs' : 'toutes justes')); process.exit(bad ? 1 : 0);
