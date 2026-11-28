// Recalcul indépendant des nombres de la carte pc-3ac-energie (node test/verif-pc-3ac-energie.mjs)
import fs from 'fs'; global.window = {};
eval(fs.readFileSync(new URL('../chapitres/pc-3ac-energie.js', import.meta.url), 'utf8'));
const C = window.BAB_CHAPTER, D = C.doors, ok = []; const chk = (n, a, b, t = 1e-9) => ok.push([n, Math.abs(a - b) <= t, a, b]);
const a = 7, kmh = v => v / 3.6, df = v => kmh(v) ** 2 / (2 * a);           // freinage, décélération 7 m/s²
chk('freinage 50 km/h ≈ 14 m', Math.round(df(50)), 14); chk('freinage 100 km/h > 55 m', df(100) > 55 ? 1 : 0, 1); chk('rapport ×4', df(100) / df(50), 4);
chk('Ec 1000 kg 10 m/s', 0.5 * 1000 * 10 ** 2, D[0].frags[1].ans);
chk('v double → ×4', ((2 * 3) ** 2) / (3 ** 2), +D[0].frags[2].o[D[0].frags[2].a]);
chk('I bouilloire', 2000 / 220, D[1].frags[2].ans, D[1].frags[2].tol);
chk('somme 5500 W → 25 A', (2000 + 2000 + 1500) / 220, 25); chk('25 A > 16 A', 25 > 16 ? 1 : 0, 1);
chk('radiateur 1,5 kW × 2 h', 1.5 * 2, D[2].frags[1].ans);
chk('bouilloire 2000 W × 0,05 h', 2000 * 3 / 60, 100); chk('lampe 10 W × 10 h', 10 * 10, 100);
const Ec = 0.5 * 1500 * kmh(72) ** 2; chk('coffre Ec = 300 kJ', Ec, 300000, 1e-6); chk('coffre t ≈ 130 s', Math.round(Ec / 2300), 130);
for (const d of D) for (const f of d.frags || []) { if (f.t === 'qcm') chk(d.id + ' qcm a valide', f.a < f.o.length ? 1 : 0, 1); if (f.t === 'vf') chk(d.id + ' 3 vf', f.items.length, 3); }
chk('4 audios', C.audio.length, 4); chk('4 portes', D.length, 4);
let bad = 0; for (const [n, g, x, y] of ok) { if (!g) { bad++; console.log('ECHEC', n, x, y); } }
console.log(ok.length + ' vérifications, ' + (bad ? bad + ' échecs' : 'toutes justes'));
process.exit(bad ? 1 : 0);
