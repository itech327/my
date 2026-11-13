/* Configuration des défis : Maths en mouvement */
(function () {
  'use strict';
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function fm(x, d) {
    d = d === undefined ? 2 : d; var s = (+x).toFixed(d);
    if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
    s = s.replace('.', ',').replace('-', '−'); return /^−0(,0*)?$/.test(s) ? '0' : s;
  }
  function num(q, a, e, h, o) { o = o || {}; return { t: 'num', q: q, a: a, e: e, h: h || '', u: o.u || '', tol: o.tol === undefined ? 1e-6 : o.tol, sol: o.sol || fm(a, 3) + (o.u ? ' ' + o.u : '') }; }

  /* générateurs du niveau Défi : plusieurs étapes, aucune aide */
  var HARD = {
    eq2: function () {
      var x = ri(-9, 9), m = ri(2, 5), p = ri(2, 5), n = ri(1, 6);
      if (m === p) return HARD.eq2();
      var r = m * x + n - p * x;
      var q = m + 'x + ' + n + ' = ' + p + 'x ' + (r < 0 ? '− ' + (-r) : '+ ' + r);
      return num('Résous l’équation ' + q + '. Que vaut 2x + 1 ?', 2 * x + 1, 'On regroupe : (' + m + ' − ' + p + ')x = ' + r + ' − ' + n + ', donc x = ' + x + ' et 2x + 1 = ' + (2 * x + 1) + '.', 'Commence par trouver x.');
    },
    sys: function () {
      var x = ri(-5, 6), y = ri(-5, 6), a = ri(1, 4), b = ri(1, 4), c = ri(1, 4), d = ri(1, 4);
      if (a * d - b * c === 0) return HARD.sys();
      var e = a * x + b * y, f = c * x - d * y;
      // système : a x + b y = e ; c x - d y = f  => déterminant a*(-d) - b*c
      if (a * (-d) - b * c === 0) return HARD.sys();
      return num('Résous le système { ' + a + 'x + ' + b + 'y = ' + e + ' ; ' + c + 'x − ' + d + 'y = ' + f + ' }. Que vaut x × y ?', x * y, 'Par substitution ou combinaison, on trouve x = ' + x + ' et y = ' + y + ', donc x × y = ' + (x * y) + '.', 'Résous d’abord le système.');
    },
    pyth: function () {
      var t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]), k = ri(1, 3), a = t[0] * k, b = t[1] * k, c = t[2] * k;
      var kind = ri(0, 1);
      if (kind) return num('Un rectangle mesure ' + a + ' cm sur ' + b + ' cm. Calcule le périmètre du triangle formé par deux côtés consécutifs et une diagonale.', a + b + c, 'La diagonale mesure √(' + a + '² + ' + b + '²) = ' + c + ' cm. Périmètre : ' + a + ' + ' + b + ' + ' + c + ' = ' + (a + b + c) + ' cm.', 'Trouve d’abord la diagonale.', { u: 'cm' });
      return num('Dans un triangle ABC rectangle en A, AB = ' + a + ' cm et BC = ' + c + ' cm. Calcule l’aire du triangle.', a * b / 2, 'AC = √(' + c + '² − ' + a + '²) = ' + b + ' cm. Aire = ' + a + ' × ' + b + ' ÷ 2 = ' + (a * b / 2) + ' cm².', 'Calcule AC avec le théorème de Pythagore.', { u: 'cm²' });
    },
    thal: function () {
      var k = ri(2, 4), ab = ri(3, 7) * k, ad = ri(2, ab / k + 1), ac = ri(3, 8) * k;
      var ae = Math.round(ac * ad / ab * 100) / 100;
      return num('Dans le triangle ABC, D est sur [AB] et E sur [AC] avec (DE) // (BC). On donne AB = ' + ab + ' cm, AD = ' + ad + ' cm et AC = ' + ac + ' cm. Calcule EC (en cm, arrondi au centième).', Math.round((ac - ac * ad / ab) * 100) / 100, 'Thalès : AE/AC = AD/AB, donc AE = ' + ac + ' × ' + ad + ' ÷ ' + ab + ' ≈ ' + fm(ac * ad / ab) + ' cm. Alors EC = AC − AE ≈ ' + fm(ac - ac * ad / ab) + ' cm.', 'Calcule d’abord AE, puis EC = AC − AE.', { u: 'cm', tol: 0.011 });
    },
    trig: function () {
      var ang = pick([20, 25, 30, 35, 40, 50, 55, 60]), hyp = ri(8, 20), s = Math.round(hyp * Math.sin(ang * Math.PI / 180) * 10) / 10;
      return num('Un échelle de ' + hyp + ' m est appuyée contre un mur et forme un angle de ' + ang + '° avec le mur. À quelle hauteur du sol touche-t-elle le mur ? (arrondi au dixième)', Math.round(hyp * Math.cos(ang * Math.PI / 180) * 10) / 10, 'La hauteur est le côté adjacent à l’angle de ' + ang + '° : h = ' + hyp + ' × cos(' + ang + '°) ≈ ' + fm(hyp * Math.cos(ang * Math.PI / 180), 1) + ' m.', 'cos = adjacent ÷ hypoténuse.', { u: 'm', tol: 0.06 });
    },
    sqrt: function () {
      var a = ri(2, 6), b = pick([2, 3, 5, 6, 7]), n = a * a * b;
      return num('On écrit √' + n + ' = a√b avec b le plus petit possible. Que vaut a + b ?', a + b, '√' + n + ' = √(' + (a * a) + ' × ' + b + ') = ' + a + '√' + b + ', donc a + b = ' + (a + b) + '.', 'Cherche le plus grand carré qui divise ' + n + '.');
    },
    lit: function () {
      var a = ri(2, 4), b = ri(1, 5), x = ri(-3, 4);
      var v = (a * x + b) * (a * x + b) - (a * x - b) * (a * x - b);
      return num('Pour x = ' + x + ', calcule A = (' + a + 'x + ' + b + ')² − (' + a + 'x − ' + b + ')².', v, 'A = 4 × ' + a + 'x × ' + b + ' = ' + (4 * a * b) + 'x. Pour x = ' + x + ' : ' + v + '.', 'Utilise a² − b² = (a − b)(a + b) ou développe.');
    },
    pct: function () {
      var p = pick([10, 20, 25, 30, 40, 50]);
      var net = Math.round(((1 + p / 100) * (1 - p / 100) - 1) * 10000) / 100;
      return num('Un prix augmente de ' + p + ' %, puis baisse de ' + p + ' %. Quelle est la variation totale en % ? (réponds avec le signe)', net, 'Coefficient : ' + fm(1 + p / 100, 2) + ' × ' + fm(1 - p / 100, 2) + ' = ' + fm((1 + p / 100) * (1 - p / 100), 4) + '. Variation : ' + fm(net, 2) + ' %.', 'Multiplie les deux coefficients multiplicateurs.', { u: '%', tol: 0.011 });
    },
    vit: function () {
      var d = ri(2, 8) * 30, v1 = pick([30, 40, 60]), v2 = pick([60, 80, 120]);
      if (v1 === v2) return HARD.vit();
      var vm = 2 * d / (d / v1 + d / v2);
      return num('Un trajet aller de ' + d + ' km se fait à ' + v1 + ' km/h, le retour à ' + v2 + ' km/h. Quelle est la vitesse moyenne sur l’aller-retour ? (arrondie au dixième)', Math.round(vm * 10) / 10, 'Durée totale : ' + d + '/' + v1 + ' + ' + d + '/' + v2 + ' h ; distance totale ' + (2 * d) + ' km. v = ' + fm(vm, 2) + ' km/h. Ce n’est pas la moyenne des vitesses.', 'Vitesse moyenne = distance totale ÷ durée totale.', { u: 'km/h', tol: 0.06 });
    },
    stat: function () {
      var n = ri(4, 6), vals = [], i; for (i = 0; i < n; i++) vals.push(ri(8, 18));
      var s = vals.reduce(function (a, b) { return a + b; }, 0), m = ri(11, 15), x = m * (n + 1) - s;
      if (x < 0 || x > 20) return HARD.stat();
      return num('Les notes de ' + n + ' contrôles sont : ' + vals.join(' ; ') + '. Quelle note faut-il obtenir au prochain contrôle pour que la moyenne des ' + (n + 1) + ' notes soit ' + m + ' ?', x, 'Somme nécessaire : ' + m + ' × ' + (n + 1) + ' = ' + (m * (n + 1)) + '. Somme actuelle : ' + s + '. Note à obtenir : ' + x + '.', 'Moyenne × effectif = somme des notes.');
    },
    vol: function () {
      var k = pick([2, 3, 0.5]), v = ri(2, 9) * 8;
      var res = Math.round(v * k * k * k * 100) / 100;
      return num('Un solide a un volume de ' + v + ' cm³. On l’agrandit (ou on le réduit) avec le rapport k = ' + fm(k, 1) + '. Quel est le volume du nouveau solide ?', res, 'Les volumes sont multipliés par k³ = ' + fm(k * k * k, 3) + '. Volume : ' + v + ' × ' + fm(k * k * k, 3) + ' = ' + fm(res, 2) + ' cm³.', 'Les longueurs sont multipliées par k, les volumes par k³.', { u: 'cm³', tol: 0.011 });
    },
    pow: function () {
      var a = ri(2, 5), b = ri(2, 6), c = ri(1, 4), base = pick([2, 3, 5]);
      var e = a + b - c;
      return num('Écris ' + base + '<sup>' + a + '</sup> × ' + base + '<sup>' + b + '</sup> ÷ ' + base + '<sup>' + c + '</sup> sous la forme ' + base + '<sup>n</sup>. Que vaut n ?', e, 'On additionne les exposants pour le produit : ' + (a + b) + ', puis on soustrait pour le quotient : ' + (a + b) + ' − ' + c + ' = ' + e + '.', 'a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup> et a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m−n</sup>.');
    },
    prop: function () {
      var w = ri(2, 6), days = ri(4, 12) * 2, nw = w * ri(2, 3);
      return num(w + ' ouvriers terminent un chantier en ' + days + ' jours. Combien de jours faut-il à ' + nw + ' ouvriers (même rythme) ?', days * w / nw, 'Le travail total est ' + w + ' × ' + days + ' = ' + (w * days) + ' ouvrier-jours. Avec ' + nw + ' ouvriers : ' + (w * days) + ' ÷ ' + nw + ' = ' + fm(days * w / nw, 2) + ' jours.', 'Plus il y a d’ouvriers, moins il faut de jours : situation inversement proportionnelle.', { u: 'jours', tol: 0.01 });
    },
    ineq: function () {
      var a = ri(-6, 0), b = a + ri(6, 12), k = 1;
      return num('Combien de nombres entiers x vérifient ' + (a < 0 ? '−' + (-a) : a) + ' ≤ x < ' + b + ' ?', b - a, 'Les entiers vont de ' + a + ' à ' + (b - 1) + ' : il y en a ' + (b - a) + '.', 'Attention : l’inégalité est large à gauche et stricte à droite.');
    }
  };

  /* générateurs propres aux chapitres ajoutés pour la 2e année (sommaire du manuel) */
  function sgn2(n) { return n < 0 ? '−' + (-n) : String(n); }
  function fs(f) { return f[1] === 1 ? sgn2(f[0]) : sgn2(f[0]) + '/' + f[1]; }
  function fn(n, d) { var g = gcd(n, d); return [n / g, d / g]; }
  function fadd2(a, b) { return fn(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function fmul2(a, b) { return fn(a[0] * b[0], a[1] * b[1]); }
  function finv2(a) { return a[0] < 0 ? [-a[1], -a[0]] : [a[1], a[0]]; }
  function fneg(a) { return [-a[0], a[1]]; }
  function rf(neg) { var n = pick([1, 2, 3, 4, 5]), d = pick([2, 3, 4, 5, 6]); if (neg && Math.random() < 0.5) n = -n; return fn(n, d); }
  function fnum(q, f, e, h) { return num(q, f[0] / f[1], e, h, { tol: 0.006, sol: fs(f) }); }
  function par(f) { return f[0] < 0 ? '(' + fs(f) + ')' : fs(f); }
  var EXTRA = {
    ops4: function (d) {
      var a, b, c, r, t;
      if (d === 1) {
        a = ri(2, 9); b = ri(2, 6); c = ri(2, 6);
        return num('Calcule ' + a + ' + ' + b + ' × ' + c + '.', a + b * c, 'La multiplication est prioritaire : ' + b + ' × ' + c + ' = ' + (b * c) + ', puis ' + a + ' + ' + (b * c) + ' = ' + (a + b * c) + '.', 'Multiplie avant d’additionner.');
      }
      if (d === 2) {
        a = rf(false); b = rf(false); c = rf(false);
        r = fadd2(a, fmul2(b, c));
        return fnum('Calcule ' + fs(a) + ' + ' + fs(b) + ' × ' + fs(c) + '. Écris le résultat sous forme de fraction (ou en décimal arrondi au centième).', r, 'Priorité à la multiplication : ' + fs(b) + ' × ' + fs(c) + ' = ' + fs(fmul2(b, c)) + ', puis on additionne : ' + fs(r) + '.', 'Multiplie d’abord.');
      }
      if (d === 3) {
        a = rf(true); b = rf(true); c = rf(false);
        r = fmul2(fadd2(a, fneg(b)), finv2(c));
        return fnum('Calcule (' + fs(a) + ' − ' + par(b) + ') ÷ ' + fs(c) + '. Écris le résultat sous forme de fraction (ou en décimal arrondi au centième).', r, 'Parenthèse : ' + fs(a) + ' − ' + par(b) + ' = ' + fs(fadd2(a, fneg(b))) + '. Diviser par ' + fs(c) + ', c’est multiplier par son inverse : résultat ' + fs(r) + '.', 'Calcule la parenthèse, puis multiplie par l’inverse.');
      }
      a = rf(true); b = rf(true); c = rf(true); t = rf(false);
      r = fadd2(fmul2(a, fadd2(b, c)), fneg(t));
      return fnum('Calcule ' + par(a) + ' × (' + fs(b) + ' + ' + par(c) + ') − ' + fs(t) + '. Écris le résultat sous forme de fraction (ou en décimal arrondi au centième).', r, 'Parenthèse : ' + fs(fadd2(b, c)) + '. Produit : ' + fs(fmul2(a, fadd2(b, c))) + '. Puis on retranche ' + fs(t) + ' : ' + fs(r) + '.', '');
    },
    rem: function (d) {
      var x, y, k, t;
      if (d === 4) {
        x = 3 * ri(2, 8); y = 3 * ri(2, 8);
        return num('G est le centre de gravité du triangle ABC. Les médianes [AA′] et [BB′] mesurent ' + x + ' cm et ' + y + ' cm. Calcule AG + BG.', 2 * (x + y) / 3, 'G est aux deux tiers de chaque médiane : AG = ⅔ × ' + x + ' = ' + (2 * x / 3) + ' et BG = ⅔ × ' + y + ' = ' + (2 * y / 3) + '.', 'AG = ⅔ AA′ et BG = ⅔ BB′.', { u: 'cm' });
      }
      t = ri(0, d === 1 ? 1 : 3);
      if (t === 0) { x = 3 * ri(2, 10); return num('G est le centre de gravité de ABC et A′ le milieu de [BC]. AA′ = ' + x + ' cm. Calcule AG.', 2 * x / 3, 'AG = ⅔ × AA′ = ⅔ × ' + x + ' = ' + (2 * x / 3) + ' cm.', 'G est aux deux tiers de la médiane.', { u: 'cm' }); }
      if (t === 1) { x = 3 * ri(2, 10); return num('G est le centre de gravité de ABC et A′ le milieu de [BC]. AA′ = ' + x + ' cm. Calcule GA′.', x / 3, 'GA′ = AA′ − AG = ⅓ × AA′ = ' + (x / 3) + ' cm.', 'GA′ est le tiers de AA′.', { u: 'cm' }); }
      if (t === 2) { x = ri(2, 12); return num('G est le centre de gravité de ABC et A′ le milieu de [BC]. GA′ = ' + x + ' cm. Calcule AA′.', 3 * x, 'GA′ est le tiers de AA′, donc AA′ = 3 × ' + x + ' = ' + (3 * x) + ' cm.', 'AA′ = 3 × GA′.', { u: 'cm' }); }
      k = ri(3, 15); return num('ABC est rectangle en A et BC = ' + (2 * k) + ' cm. Quel est le rayon de son cercle circonscrit ?', k, 'Le centre du cercle circonscrit est le milieu de l’hypoténuse : rayon = ' + (2 * k) + ' ÷ 2 = ' + k + ' cm.', 'Le centre est le milieu de [BC].', { u: 'cm' });
    },
    cos: function (d) {
      var p, H, a, t;
      if (d === 1) {
        p = pick([[3, 5], [4, 5], [6, 10], [8, 10], [9, 15], [12, 15], [12, 20], [16, 20]]);
        return num('ABC est rectangle en A, AB = ' + p[0] + ' cm et BC = ' + p[1] + ' cm. Calcule cos B.', p[0] / p[1], 'cos B = côté adjacent ÷ hypoténuse = AB ÷ BC = ' + p[0] + ' ÷ ' + p[1] + ' = ' + fm(p[0] / p[1], 3) + '.', 'cos = adjacent ÷ hypoténuse.', { tol: 0.006 });
      }
      if (d === 2) {
        H = 2 * ri(2, 10);
        return num('ABC est rectangle en A, BC = ' + H + ' cm et l’angle B mesure 60°. Sachant que cos 60° = 0,5, calcule AB.', H / 2, 'AB = BC × cos B = ' + H + ' × 0,5 = ' + (H / 2) + ' cm.', 'AB = BC × cos B.', { u: 'cm' });
      }
      if (d === 3) {
        H = ri(5, 20); a = pick([30, 35, 40, 45, 50, 55]);
        return num('ABC est rectangle en A, BC = ' + H + ' cm et l’angle B mesure ' + a + '°. Calcule AB (arrondi au dixième).', +(H * Math.cos(a * Math.PI / 180)).toFixed(1), 'AB = BC × cos B = ' + H + ' × cos ' + a + '° ≈ ' + fm(H * Math.cos(a * Math.PI / 180), 1) + ' cm.', 'Calculatrice en mode degrés.', { u: 'cm', tol: 0.06 });
      }
      if (Math.random() < 0.5) {
        H = ri(4, 9); a = pick([40, 50, 55, 65]);
        return num('Une échelle de ' + H + ' m est appuyée contre un mur. Elle forme avec le sol un angle de ' + a + '°. À quelle distance du mur se trouve son pied ? (arrondis au dixième)', +(H * Math.cos(a * Math.PI / 180)).toFixed(1), 'Le pied est le côté adjacent à l’angle : ' + H + ' × cos ' + a + '° ≈ ' + fm(H * Math.cos(a * Math.PI / 180), 1) + ' m.', 'Dessine le triangle rectangle : l’échelle est l’hypoténuse.', { u: 'm', tol: 0.06 });
      }
      p = pick([[4, 6], [5, 8], [3, 7], [6, 9], [2, 5], [7, 10]]);
      return num('ABC est rectangle en A, AB = ' + p[0] + ' cm et BC = ' + p[1] + ' cm. Calcule l’angle B, arrondi au degré.', Math.round(Math.acos(p[0] / p[1]) * 180 / Math.PI), 'cos B = ' + p[0] + ' ÷ ' + p[1] + ' ≈ ' + fm(p[0] / p[1], 3) + ', donc B = cos⁻¹(' + fm(p[0] / p[1], 3) + ') ≈ ' + Math.round(Math.acos(p[0] / p[1]) * 180 / Math.PI) + '°.', 'Utilise cos⁻¹ sur la calculatrice.', { u: '°', tol: 0.6 });
    },
    pyr: function (d) {
      var B, h, c, V, tr, ap, lat;
      if (d === 1) { B = 3 * ri(2, 12); h = ri(2, 9); return num('Volume d’une pyramide de base ' + B + ' cm² et de hauteur ' + h + ' cm.', B * h / 3, 'V = ⅓ × B × h = ⅓ × ' + B + ' × ' + h + ' = ' + fm(B * h / 3) + ' cm³.', 'V = ⅓ × B × h.', { u: 'cm³' }); }
      if (d === 2) { c = 3 * ri(1, 4); h = ri(2, 9); return num('Une pyramide a pour base un carré de côté ' + c + ' cm et pour hauteur ' + h + ' cm. Calcule son volume.', c * c * h / 3, 'B = ' + c + '² = ' + (c * c) + ' cm², puis V = ⅓ × ' + (c * c) + ' × ' + h + ' = ' + fm(c * c * h / 3) + ' cm³.', 'Calcule d’abord l’aire de la base.', { u: 'cm³' }); }
      if (d === 3) { B = ri(2, 10) * 3; h = ri(2, 8); V = B * h / 3; return num('Une pyramide de volume ' + V + ' cm³ a une base de ' + B + ' cm². Calcule sa hauteur.', h, 'V = ⅓ × B × h donc h = 3 × V ÷ B = 3 × ' + V + ' ÷ ' + B + ' = ' + h + ' cm.', 'h = 3V ÷ B.', { u: 'cm' }); }
      tr = pick([[4, 3, 5], [3, 4, 5], [12, 5, 13], [6, 8, 10]]); h = tr[0]; c = 2 * tr[1]; ap = tr[2]; lat = 2 * c * ap;
      return num('Une pyramide régulière a pour base un carré de côté ' + c + ' cm et pour hauteur ' + h + ' cm. L’apothème (hauteur d’une face triangulaire) mesure ' + ap + ' cm. Calcule son aire totale (base + faces).', c * c + lat, 'Aire latérale = 4 × (' + c + ' × ' + ap + ' ÷ 2) = ' + lat + ' cm². Base : ' + c + '² = ' + (c * c) + ' cm². Total : ' + (c * c + lat) + ' cm².', 'Quatre faces triangulaires de base ' + c + ' cm et de hauteur ' + ap + ' cm.', { u: 'cm²' });
    }
  };

  function expo() { return window.MM && window.MM.G; }

  var M1 = {};
  function T(id, topics) { M1[id] = { topics: topics }; }
  T('c1-1', ['ent', 'divr', 'dec', 'prio']);
  T('c1-2', ['fsimp', 'fadd', 'fmul', 'fcomp', 'fpart']);
  T('c1-3', ['rel']);
  T('c1-4', ['rel', 'sci', 'pow']);
  T('c1-5', ['lit']);
  T('c1-6', ['eq1']);
  T('c1-11', ['perim', 'aire']);
  T('c1-13', ['cercle']);
  T('c1-14', ['rep']);
  T('c1-15', ['vol']);
  T('c1-16', ['prop', 'pct', 'ech']);
  T('c1-17', ['stat']);
  T('c2-1', ['rel', 'fcomp']);
  T('c2-2', ['fadd']);
  T('c2-3', ['fmul']);
  T('c2-4', ['pow']);
  T('c2-5', ['lit']);
  T('c2-6', ['eq1', 'eq2']);
  T('c2-7', ['ordre', 'enc']);
  T('c2-8', ['sym']);
  T('c2-10', ['thal']);
  T('c2-11', ['pyth', 'cercle']);
  T('c2-12', ['vec']);
  T('c2-13', ['pyr', 'vol']);
  T('c2-14', ['prop', 'pct', 'ech']);
  T('c2-15', ['stat']);
  T('c2-9', ['rem']);
  T('c2-16', ['ops4', 'fadd', 'fmul']);
  T('c2-17', ['pyth']);
  T('c2-18', ['cos']);
  T('c3-1', ['sqrt']);
  T('c3-2', ['lit', 'pow', 'sci']);
  T('c3-3', ['ordre', 'enc']);
  T('c3-4', ['eq2', 'ineq']);
  T('c3-5', ['sys']);
  T('c3-6', ['pyth', 'trig']);
  T('c3-7', ['thal']);
  T('c3-8', ['inscrit']);
  T('c3-9', ['thal']);
  T('c3-10', ['vec']);
  T('c3-11', ['rep']);
  T('c3-12', ['droite']);
  T('c3-13', ['vol']);
  T('c3-14', ['droite', 'prop']);
  T('c3-15', ['stat']);

  window.LAB_CONFIG = {
    app: 'maths', appName: 'Maths en mouvement', map: M1,
    gen: function (key, d) {
      var G = expo();
      if (EXTRA[key]) return EXTRA[key](d);
      if (d === 4 && HARD[key]) return HARD[key]();
      if (!G || !G[key]) return null;
      return G[key](d === 4 ? 3 : d);
    }
  };
})();
