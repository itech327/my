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
  T('c2-13', ['vol']);
  T('c2-14', ['prop', 'pct', 'ech']);
  T('c2-15', ['stat']);
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
      if (d === 4 && HARD[key]) return HARD[key]();
      if (!G || !G[key]) return null;
      return G[key](d === 4 ? 3 : d);
    }
  };
})();
