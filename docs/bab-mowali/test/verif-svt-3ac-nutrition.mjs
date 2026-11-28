// Vérifications de la carte svt-3ac-nutrition (node test/verif-svt-3ac-nutrition.mjs)
import fs from 'fs'; global.window = {};
eval(fs.readFileSync(new URL('../chapitres/svt-3ac-nutrition.js', import.meta.url), 'utf8'));
const C = window.BAB_CHAPTER, D = C.doors, R = []; const chk = (n, a, b, t = 1e-9) => R.push([n, Math.abs(a - b) <= t, a, b]);
chk('CO2 : 4 / 0,04 = 100', 4 / 0.04, D[2].frags[1].ans, 1e-9);
chk('O2 : 21 % → 16 % (baisse de 5 points)', 21 - 16, 5);
const has = (s, t) => (s.indexOf(t) >= 0 ? 1 : 0);
chk('révélation : 4 % et 0,04 %', has(D[2].reveal, '4 %') * has(D[2].reveal, '0,04 %'), 1);
chk('révélation : 16 % et 21 %', has(D[2].reveal, '16 %') * has(D[2].reveal, '21 %'), 1);
// classement amidon : seul le tube salive à 37 °C perd l'amidon
const s1 = D[0].frags[1]; chk('un seul tube digéré', s1.items.filter((x) => x[1] === 1).length, 1); chk('c’est salive 37 °C', has(s1.items.find((x) => x[1] === 1)[0], 'salive, 37'), 1);
const s2 = D[1].frags[2]; chk('3 nutriments, 2 aliments chacun', [0, 1, 2].map((k) => s2.items.filter((x) => x[1] === k).length).join() === '2,2,2' ? 1 : 0, 1);
chk('ordre : 4 organes, intestin grêle en dernier', D[1].frags[1].items[3] === 'Intestin grêle' ? 1 : 0, 1);
for (const d of D) { if (d.key) chk(d.id + ' mot de passe valide', d.key.a < d.key.o.length ? 1 : 0, 1); for (const f of d.frags || []) { if (f.t === 'qcm') chk(d.id + ' qcm valide', f.a < f.o.length ? 1 : 0, 1); if (f.t === 'vf') chk(d.id + ' 3 vf', f.items.length, 3); if (f.t === 'order') chk(d.id + ' 4 étapes', f.items.length, 4); } }
chk('coffre : 7 mots imposés', ['amylase', 'glucose', 'intestin grêle', 'sang', 'alvéoles', 'dioxygène', 'dioxyde de carbone'].every((w) => D[3].hook.indexOf(w) >= 0) ? 1 : 0, 1);
chk('4 portes', D.length, 4); chk('4 audios', C.audio.length, 4);
let bad = 0; for (const [n, g, p, q] of R) if (!g) { bad++; console.log('ECHEC', n, p, q); }
console.log(R.length + ' vérifications, ' + (bad ? bad + ' échecs' : 'toutes justes')); process.exit(bad ? 1 : 0);
