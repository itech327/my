/* Configuration des défis : Technologie en mouvement (3AC).
   Même contrat que lab/lab-svt.js : window.LAB_CONFIG = { app, appName, map, gen, riddles }.
   SUBJECT est injecté par tools/build_subject.py depuis matiere/config.json. */
(function () {
  'use strict';
  var SUBJECT = /*__SUBJECT__*/null;
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function fm(x, d) { var s = (+x).toFixed(d === undefined ? 1 : d); if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, ''); return s.replace('.', ','); }
  function num(q, a, u, e, h, tol) { return { t: 'num', q: q, a: a, u: u || '', e: e, h: h || '', tol: tol === undefined ? (Math.abs(a - Math.round(a)) < 1e-9 ? 0.5 : 0.006) : tol, sol: fm(a, 2) + (u ? ' ' + u : '') }; }

  /* Banques : matiere/banks/*.js, au format [niveau, question, options, bonne réponse (index), explication] */
  var B = {};
  /*__BANKS__*/
  function fromBank(key, d) {
    var q = B[key]; if (!q) return null;
    var pool = q.filter(function (x) { return d === 1 ? x[0] <= 2 : (d === 2 ? true : x[0] >= 2); });
    var x = pick(pool), idx = shuffle(x[2].map(function (_, i) { return i; }));
    return { t: 'mcq', q: x[1], o: idx.map(function (i) { return x[2][i]; }), a: idx.indexOf(x[3]), e: x[4], h: 'Relis la leçon du chapitre.' };
  }
  var G = {
    volt: function (d) {
      var t = ri(1, 5) * 8, info = ' (0 V à 0 °C, 5 V à 40 °C, signal proportionnel)';
      if (d === 1) return num('Un capteur de température fournit une tension proportionnelle à la température' + info + '. Quelle tension à ' + t + ' °C ?', 5 * t / 40, 'V', 'U = 5 × ' + t + ' ÷ 40 = ' + fm(5 * t / 40, 3) + ' V.', 'Produit en croix : 5 V correspondent à 40 °C.', 0.02);
      var t2 = ri(3, 37);
      if (d === 2) return num('Un capteur de température fournit une tension proportionnelle à la température' + info + '. Quelle tension à ' + t2 + ' °C ?', 5 * t2 / 40, 'V', 'U = 5 × ' + t2 + ' ÷ 40 = ' + fm(5 * t2 / 40, 3) + ' V.', 'Produit en croix : 5 V correspondent à 40 °C.', 0.02);
      var u = ri(1, 9) * 0.5;
      if (d === 3) return num('Un capteur de température fournit une tension proportionnelle à la température' + info + '. Il indique ' + fm(u, 1) + ' V. Quelle est la température ?', u * 8, '°C', 'T = ' + fm(u, 1) + ' × 40 ÷ 5 = ' + fm(u * 8, 1) + ' °C.', 'Chaque volt correspond à 8 °C.', 0.1);
      var seuil = ri(2, 4) * 5;
      return num('Un capteur de température fournit une tension proportionnelle à la température' + info + '. Un détecteur passe à 1 dès que la température atteint ' + seuil + ' °C. Quelle est la tension du capteur à ce seuil ?', 5 * seuil / 40, 'V', 'U = 5 × ' + seuil + ' ÷ 40 = ' + fm(5 * seuil / 40, 3) + ' V.', 'Applique la proportionnalité au seuil.', 0.02);
    },
    ech: function (d) {
      var r = pick([20, 40, 60, 80, 100, 120, 150]), e = pick([2, 5, 10]);
      if (d === 1) return num('Une pièce de ' + r + ' mm est dessinée à l’échelle 1:2. Quelle est sa longueur sur le dessin ?', r / 2, 'mm', r + ' × 1/2 = ' + (r / 2) + ' mm.', 'Longueur sur le dessin = longueur réelle × échelle.');
      if (d === 2) return num('Une pièce de ' + r + ' mm est dessinée à l’échelle 1:' + e + '. Quelle est sa longueur sur le dessin ?', r / e, 'mm', r + ' ÷ ' + e + ' = ' + fm(r / e, 2) + ' mm.', 'Divise par ' + e + '.', 0.01);
      var dd = pick([10, 20, 25, 30, 40, 50]);
      if (d === 3) return num('Sur un dessin à l’échelle 1:' + e + ', une longueur mesure ' + dd + ' mm. Quelle est la longueur réelle ?', dd * e, 'mm', dd + ' × ' + e + ' = ' + (dd * e) + ' mm.', 'Longueur réelle = longueur dessinée × ' + e + '.');
      return num('Une pièce mesure ' + r + ' mm en réalité et ' + (r / e) + ' mm sur le dessin. Quel est le dénominateur n de l’échelle 1:n ?', e, '', r + ' ÷ ' + (r / e) + ' = ' + e + '.', 'n = longueur réelle ÷ longueur dessinée.');
    },
    mvt: function (d) {
      var R = pick([20, 30, 40, 45, 50]), th = pick([0.5, 1, 1.5, 2, 3]), Pm = pick([1, 2, 3, 4]), n = ri(5, 25);
      if (d === 1) return num('Un pignon de rayon ' + R + ' mm tourne de ' + fm(th, 1) + ' rad. De combien avance la crémaillère, en mm ?', R * th, 'mm', 'L = R × θ = ' + R + ' × ' + fm(th, 1) + ' = ' + fm(R * th, 1) + ' mm.', 'Utilise L = R × θ, avec θ en radians.', 0.1);
      if (d === 2) return num('Une vis de pas ' + Pm + ' mm fait ' + n + ' tours. De combien avance l’écrou, en mm ?', Pm * n, 'mm', 'L = P × n = ' + Pm + ' × ' + n + ' = ' + (Pm * n) + ' mm.', 'Un tour fait avancer l’écrou d’un pas.');
      if (d === 3) { var V = pick([2, 4, 5, 8, 10]); return num('Une vis de pas ' + Pm + ' mm doit faire avancer un écrou à ' + V + ' mm/s. Combien de tours par seconde doit faire la vis ?', V / Pm, 'tr/s', 'n = V ÷ P = ' + V + ' ÷ ' + Pm + ' = ' + fm(V / Pm, 2) + ' tr/s.', 'Divise la vitesse par le pas.', 0.01); }
      var V4 = pick([2, 4, 5, 10]);
      return num('Une vis de pas ' + Pm + ' mm avance à ' + V4 + ' mm/s. Elle est entraînée par un motoréducteur de rapport 1/48. Quelle est la vitesse du moteur, en tr/s ?', V4 / Pm * 48, 'tr/s', 'Vis : ' + V4 + ' ÷ ' + Pm + ' = ' + fm(V4 / Pm, 2) + ' tr/s ; moteur : × 48 = ' + fm(V4 / Pm * 48, 1) + ' tr/s.', 'Le moteur tourne 48 fois plus vite que la vis.', 0.1);
    },
    led: function (d) {
      var E12 = [100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820], E, U, I, R, k;
      do { E = pick([3.7, 5, 6, 7.4, 9]); U = pick([1.6, 2, 2.2]); I = pick([10, 15, 20]); R = (E - U) / I * 1000; } while (R < 100 || R > 820);
      var near = E12[0]; for (k = 0; k < E12.length; k++) if (Math.abs(E12[k] - R) < Math.abs(near - R)) near = E12[k];
      var tail = 'Une LED de ' + fm(U, 1) + ' V est alimentée sous ' + fm(E, 1) + ' V. Le courant doit être de ' + I + ' mA.';
      if (d === 1) return num(tail + ' Quelle résistance en série (en Ω) ?', R, 'Ω', 'R = (E − U) ÷ I = (' + fm(E, 1) + ' − ' + fm(U, 1) + ') ÷ ' + fm(I / 1000, 3) + ' = ' + fm(R, 0) + ' Ω.', 'Loi d’additivité des tensions : la résistance reçoit E − U.', 1);
      if (d === 2) return num('Une LED de ' + fm(U, 1) + ' V est alimentée sous ' + fm(E, 1) + ' V avec une résistance de ' + near + ' Ω. Quel est le courant, en mA ?', (E - U) / near * 1000, 'mA', 'I = (E − U) ÷ R = ' + fm(E - U, 1) + ' ÷ ' + near + ' = ' + fm((E - U) / near * 1000, 1) + ' mA.', 'I = (E − U) ÷ R, puis convertis en mA.', 0.2);
      if (d === 3) return num(tail + ' La valeur calculée est ' + fm(R, 0) + ' Ω. Quelle valeur normalisée de la série E12 est la plus proche (en Ω) ?', near, 'Ω', 'Série E12 : 100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820. La plus proche de ' + fm(R, 0) + ' Ω est ' + near + ' Ω.', 'Compare la valeur calculée aux valeurs de la série.');
      return num(tail + ' On choisit la valeur E12 la plus proche. Quel est alors le courant réel, en mA ?', (E - U) / near * 1000, 'mA', 'R normalisée = ' + near + ' Ω ; I = ' + fm(E - U, 1) + ' ÷ ' + near + ' = ' + fm((E - U) / near * 1000, 1) + ' mA.', 'Calcule R, choisis la valeur E12, puis recalcule I.', 0.2);
    },
    pv: function (d) {
      var u = pick([30, 35, 40]), i = pick([2, 2.5, 3, 4, 4.5]), n = ri(2, 6), h = ri(3, 8), P = u * i;
      if (d === 1) return num('Un panneau solaire fournit ' + u + ' V et ' + fm(i, 1) + ' A. Quelle puissance, en W ?', P, 'W', 'P = U × I = ' + u + ' × ' + fm(i, 1) + ' = ' + fm(P, 1) + ' W.', 'P = U × I.', 0.1);
      if (d === 2) return num('Un panneau fournit ' + fm(P, 1) + ' W pendant ' + h + ' h. Quelle énergie, en Wh ?', P * h, 'Wh', 'W = P × t = ' + fm(P, 1) + ' × ' + h + ' = ' + fm(P * h, 1) + ' Wh.', 'Énergie = puissance × durée.', 0.1);
      if (d === 3) return num('Un panneau a une puissance maximale de ' + (u * i * 2) + ' W. Une installation comporte ' + n + ' panneaux identiques. Quelle est sa puissance maximale, en W ?', u * i * 2 * n, 'W', 'P = ' + (u * i * 2) + ' × ' + n + ' = ' + (u * i * 2 * n) + ' W.', 'Multiplie par le nombre de panneaux.');
      return num('Un panneau de ' + (u * i * 2) + ' W est utilisé ' + h + ' h par jour. Quelle énergie produit-il en kWh par jour ?', u * i * 2 * h / 1000, 'kWh', (u * i * 2) + ' × ' + h + ' = ' + (u * i * 2 * h) + ' Wh = ' + fm(u * i * 2 * h / 1000, 2) + ' kWh.', 'Convertis les Wh en kWh.', 0.01);
    },
    puiss: function (d) {
      var sf = ri(1, 6), g0 = ri(2, 10) * 100, eta = pick([15, 18, 20]);
      if (d === 1) return num('Un panneau photovoltaïque reçoit ' + g0 + ' W/m² sur ' + sf + ' m² avec un rendement de ' + eta + ' %. Quelle puissance produit-il ?', sf * g0 * eta / 100, 'W', sf + ' × ' + g0 + ' × ' + eta + ' ÷ 100 = ' + fm(sf * g0 * eta / 100, 1) + ' W.', 'P = surface × ensoleillement × rendement.', 0.1);
      var p = ri(3, 12) * 50;
      if (d === 2) return num('Un panneau produit ' + p + ' W pendant 5 h. Quelle énergie fournit-il, en Wh ?', p * 5, 'Wh', p + ' × 5 = ' + (p * 5) + ' Wh.', 'Énergie = puissance × durée.');
      if (d === 3) return num('Un panneau de ' + p + ' W produit pendant 5 h. Une lampe de 20 W doit fonctionner 4 h. Combien de lampes peut-on alimenter au maximum ?', Math.floor(p * 5 / 80), '', 'Énergie produite : ' + p + ' × 5 = ' + (p * 5) + ' Wh. Une lampe consomme 20 × 4 = 80 Wh. Nombre de lampes : ' + Math.floor(p * 5 / 80) + '.', 'Divise l’énergie produite par l’énergie consommée par une lampe.');
      var pe = ri(2, 6) * 100, he = ri(4, 10);
      return num('Une éolienne de ' + pe + ' W fonctionne à pleine puissance pendant ' + he + ' h. Quelle énergie produit-elle, en kWh ?', pe * he / 1000, 'kWh', pe + ' × ' + he + ' = ' + (pe * he) + ' Wh = ' + fm(pe * he / 1000, 2) + ' kWh.', 'Énergie = puissance × durée, puis divise les Wh par 1 000.', 0.01);
    },
    cout: function (d) {
      var a = pick([90, 120, 150, 190]), b = pick([230, 280, 340]), p = pick([1, 1.2, 1.5, 2]);
      if (d === 1) return num('Un appareil consomme ' + a + ' kWh par an. Le kWh coûte ' + fm(p, 1) + ' DH. Quel est le coût annuel ?', a * p, 'DH', a + ' × ' + fm(p, 1) + ' = ' + fm(a * p, 1) + ' DH.', 'Coût = énergie × prix du kWh.', 0.1);
      if (d === 2) return num('Un appareil de classe A consomme ' + a + ' kWh par an et un appareil de classe G ' + b + ' kWh par an. Quelle est la différence de consommation, en kWh ?', b - a, 'kWh', b + ' − ' + a + ' = ' + (b - a) + ' kWh.', 'Soustrais les deux consommations.');
      if (d === 3) return num('Un appareil consomme ' + a + ' kWh par an et un autre ' + b + ' kWh par an. Avec un kWh à ' + fm(p, 1) + ' DH, combien économise-t-on par an avec le premier ?', (b - a) * p, 'DH', '(' + b + ' − ' + a + ') × ' + fm(p, 1) + ' = ' + fm((b - a) * p, 1) + ' DH.', 'Différence de consommation × prix.', 0.1);
      var y = ri(5, 10);
      return num('Un appareil consomme ' + a + ' kWh par an et un autre ' + b + ' kWh par an. Avec un kWh à ' + fm(p, 1) + ' DH, combien économise-t-on en ' + y + ' ans avec le premier ?', (b - a) * p * y, 'DH', '(' + b + ' − ' + a + ') × ' + fm(p, 1) + ' × ' + y + ' = ' + fm((b - a) * p * y, 1) + ' DH.', 'Économie annuelle × nombre d’années.', 0.1);
    },
    auto: function (d) {
      var i = ri(2, 10) * 50, c = ri(2, 8) * 500;
      if (d === 1) return num('Une batterie de ' + c + ' mAh alimente un système qui consomme ' + i + ' mA. Quelle est son autonomie ?', c / i, 'h', c + ' ÷ ' + i + ' = ' + fm(c / i, 2) + ' h.', 'Autonomie = capacité ÷ courant.', 0.05);
      if (d === 2) return num('Un système consomme ' + i + ' mA. Il doit fonctionner ' + (c / i >= 4 ? 4 : 2) + ' h. Quelle capacité minimale (en mAh) faut-il ?', i * (c / i >= 4 ? 4 : 2), 'mAh', i + ' × ' + (c / i >= 4 ? 4 : 2) + ' = ' + (i * (c / i >= 4 ? 4 : 2)) + ' mAh.', 'Capacité = courant × durée.');
      var h2 = ri(2, 6);
      if (d === 3) return num('Une batterie de ' + c + ' mAh alimente un système qui consomme ' + i + ' mA. Après ' + h2 + ' h, quelle capacité reste-t-il (en mAh) ?', Math.max(0, c - i * h2), 'mAh', c + ' − ' + i + ' × ' + h2 + ' = ' + Math.max(0, c - i * h2) + ' mAh.', 'Retire la capacité consommée.');
      return num('Un système consomme ' + i + ' mA en fonctionnement et ' + (i / 10) + ' mA en veille. Il fonctionne ' + h2 + ' h par jour. Quelle capacité consomme-t-il par jour (en mAh) ?', i * h2 + (i / 10) * (24 - h2), 'mAh', i + ' × ' + h2 + ' + ' + (i / 10) + ' × ' + (24 - h2) + ' = ' + fm(i * h2 + (i / 10) * (24 - h2), 1) + ' mAh.', 'Additionne la consommation en marche et en veille.', 0.1);
    },
    ratio: function (d) {
      var z1 = pick([10, 12, 15, 20, 24, 30]), z2 = pick([20, 30, 40, 45, 60]), n1 = pick([60, 120, 150, 300]);
      if (d === 1) return num('Un pignon de ' + z1 + ' dents entraîne un pignon de ' + z2 + ' dents. Quel est le rapport de transmission r = Z₁ ÷ Z₂ ?', z1 / z2, '', 'r = ' + z1 + ' ÷ ' + z2 + ' = ' + fm(z1 / z2, 3) + '.', 'Divise le nombre de dents du pignon menant par celui du pignon mené.', 0.01);
      if (d === 2) return num('Un pignon de ' + z1 + ' dents tourne à ' + n1 + ' tr/min et entraîne un pignon de ' + z2 + ' dents. Quelle est la vitesse du second, en tr/min ?', n1 * z1 / z2, 'tr/min', 'n₂ = ' + n1 + ' × ' + z1 + ' ÷ ' + z2 + ' = ' + fm(n1 * z1 / z2, 1) + ' tr/min.', 'n₂ = n₁ × Z₁ ÷ Z₂.', 0.1);
      var d1 = pick([40, 60, 80]), d2 = pick([20, 30, 120, 160]);
      if (d === 3) return num('Une poulie de diamètre ' + d1 + ' mm, qui tourne à ' + n1 + ' tr/min, entraîne par courroie une poulie de diamètre ' + d2 + ' mm. Quelle est la vitesse de la seconde, en tr/min ?', n1 * d1 / d2, 'tr/min', 'n₂ = ' + n1 + ' × ' + d1 + ' ÷ ' + d2 + ' = ' + fm(n1 * d1 / d2, 1) + ' tr/min.', 'n₂ = n₁ × D₁ ÷ D₂.', 0.1);
      return num('Un moteur tourne à ' + n1 + ' tr/min. Un pignon de ' + z1 + ' dents entraîne un pignon de ' + z2 + ' dents, solidaire d’un pignon de 10 dents qui entraîne une roue de 40 dents. Quelle est la vitesse finale, en tr/min ?', n1 * z1 / z2 * 10 / 40, 'tr/min', 'n₂ = ' + n1 + ' × ' + z1 + ' ÷ ' + z2 + ' = ' + fm(n1 * z1 / z2, 2) + ' tr/min. Puis × 10 ÷ 40 = ' + fm(n1 * z1 / z2 * 10 / 40, 2) + ' tr/min.', 'Calcule étage par étage : chaque étage multiplie par Z menant ÷ Z mené.', 0.1);
    },
    algo: function (d) {
      var k = ri(3, 8), st = ri(2, 5);
      if (d === 1) return num('Un programme répète ' + k + ' fois « n ← n + 1 » en partant de n = 0. Quelle est la valeur finale de n ?', k, '', k + ' répétitions, chacune ajoute 1 : n = ' + k + '.', 'Une répétition ajoute 1.');
      if (d === 2) return num('Un programme répète ' + k + ' fois « n ← n + ' + st + ' » en partant de n = 0. Quelle est la valeur finale de n ?', k * st, '', k + ' × ' + st + ' = ' + (k * st) + '.', 'Chaque répétition ajoute ' + st + '.');
      var lim = ri(10, 30);
      if (d === 3) return num('n vaut 0. Tant que n < ' + lim + ', on fait « n ← n + ' + st + ' ». Combien de répétitions sont effectuées ?', Math.ceil(lim / st), '', 'On répète jusqu’à dépasser ' + lim + ' : ' + Math.ceil(lim / st) + ' fois.', 'Compte combien de pas de ' + st + ' il faut pour atteindre ' + lim + '.');
      var a0 = ri(1, 6);
      return num('n vaut ' + a0 + '. Tant que n < ' + lim + ', on fait « n ← n + ' + st + ' ». Quelle est la valeur finale de n ?', a0 + st * Math.ceil((lim - a0) / st), '', 'Il faut ' + Math.ceil((lim - a0) / st) + ' répétitions : n = ' + a0 + ' + ' + st + ' × ' + Math.ceil((lim - a0) / st) + ' = ' + (a0 + st * Math.ceil((lim - a0) / st)) + '.', 'Répète tant que n est inférieur à ' + lim + '.');
    }
  };

  function tl(a) { return Math.max(0.01, Math.abs(a) * 0.012); }
  G.echo = function (d) {
    var t = ri(2, 12), k = ri(2, 12), t1 = ri(2, 8), t2 = t1 + ri(2, 6), t3 = ri(3, 20);
    var tail = ' (vitesse du son : 340 m/s)';
    if (d === 1) return num('Un capteur à ultrasons mesure un aller-retour de ' + t + ' ms' + tail + '. Quelle est la distance de l’obstacle, en cm ?', 17 * t, 'cm', 'd = v × t ÷ 2 = 34 cm/ms × ' + t + ' ÷ 2 = ' + (17 * t) + ' cm.', '1 ms de trajet aller-retour correspond à 17 cm de distance.');
    if (d === 2) return num('Un obstacle est à ' + (17 * k) + ' cm' + tail + '. Quelle durée aller-retour mesure le capteur, en ms ?', k, 'ms', 't = 2d ÷ v = ' + (17 * k) + ' ÷ 17 = ' + k + ' ms.', 'Chaque ms correspond à 17 cm.');
    if (d === 3) return num('Un capteur à ultrasons mesure ' + t3 + ' ms aller-retour' + tail + '. Quelle distance, en m ?', 0.17 * t3, 'm', 'd = 0,17 × ' + t3 + ' = ' + fm(0.17 * t3, 2) + ' m.', 'd = 340 × t ÷ 2, avec t en secondes.', 0.02);
    return num('Un capteur mesure d’abord ' + t1 + ' ms puis ' + t2 + ' ms' + tail + '. De combien l’obstacle s’est-il éloigné, en cm ?', 17 * (t2 - t1), 'cm', '17 × (' + t2 + ' − ' + t1 + ') = ' + (17 * (t2 - t1)) + ' cm.', 'Calcule chaque distance puis soustrais.');
  };
  G.pwm = function (d) {
    var dc = pick([20, 40, 50, 60, 80]), v = pick([1, 2, 2.5, 3, 4]), w = pick([51, 102, 153, 204]);
    if (d === 1) return num('Un signal PWM de 5 V a un rapport cyclique de ' + dc + ' %. Quelle est sa tension moyenne, en V ?', 5 * dc / 100, 'V', '5 × ' + dc + ' ÷ 100 = ' + fm(5 * dc / 100, 2) + ' V.', 'Tension moyenne = 5 V × rapport cyclique.', 0.02);
    if (d === 2) return num('On veut une tension moyenne de ' + fm(v, 1) + ' V avec un signal PWM de 5 V. Quel rapport cyclique, en % ?', v / 5 * 100, '%', fm(v, 1) + ' ÷ 5 = ' + fm(v / 5 * 100, 0) + ' %.', 'Rapport cyclique = tension moyenne ÷ 5 V.');
    if (d === 3) return num('Avec analogWrite(' + w + '), quel est le rapport cyclique, en % ? (255 correspond à 100 %)', w / 255 * 100, '%', w + ' ÷ 255 = ' + fm(w / 255 * 100, 0) + ' %.', 'Divise par 255.', 0.6);
    return num('Une broche en PWM 5 V reçoit analogWrite(' + w + '). Quelle est la tension moyenne, en V ?', 5 * w / 255, 'V', '5 × ' + w + ' ÷ 255 = ' + fm(5 * w / 255, 2) + ' V.', 'Rapport cyclique, puis tension moyenne.', 0.03);
  };
  G.rend = function (d) {
    var Pa = pick([20, 40, 50, 80, 100]), eta = pick([50, 60, 70, 80]), Pu = Pa * eta / 100, Pu2 = pick([30, 45, 60]), e2 = pick([50, 60, 75]);
    if (d === 1) return num('Un moteur absorbe ' + Pa + ' W et fournit ' + fm(Pu, 1) + ' W de puissance utile. Quel est son rendement, en % ?', eta, '%', 'η = ' + fm(Pu, 1) + ' ÷ ' + Pa + ' = ' + eta + ' %.', 'η = puissance utile ÷ puissance absorbée.');
    if (d === 2) return num('Un moteur absorbe ' + Pa + ' W avec un rendement de ' + eta + ' %. Quelle puissance utile fournit-il, en W ?', Pu, 'W', Pa + ' × ' + eta + ' ÷ 100 = ' + fm(Pu, 1) + ' W.', 'Puissance utile = rendement × puissance absorbée.', 0.1);
    if (d === 3) return num('Un moteur absorbe ' + Pa + ' W avec un rendement de ' + eta + ' %. Quelles sont les pertes, en W ?', Pa - Pu, 'W', Pa + ' − ' + fm(Pu, 1) + ' = ' + fm(Pa - Pu, 1) + ' W.', 'Pertes = absorbée − utile.', 0.1);
    return num('On veut ' + Pu2 + ' W de puissance utile avec un moteur de rendement ' + e2 + ' %. Quelle puissance faut-il lui fournir, en W ?', Pu2 * 100 / e2, 'W', Pu2 + ' ÷ ' + fm(e2 / 100, 2) + ' = ' + fm(Pu2 * 100 / e2, 1) + ' W.', 'Puissance absorbée = utile ÷ rendement.', 0.1);
  };
  G.hydro = function (d) {
    var Q = pick([10, 20, 40, 50]), H = pick([50, 100, 200]), P0 = 9.81 * Q * H / 1000, P1 = P0 * 0.9, Pm = pick([20, 40, 60, 80]), h = ri(2, 10);
    if (d === 1) return num('Une chute d’eau : débit ' + Q + ' m³/s, hauteur ' + H + ' m. Quelle puissance maximale (rendement 100 %), en MW ? (g = 9,81 m/s²)', P0, 'MW', 'P = 9,81 × ' + Q + ' × ' + H + ' ÷ 1000 = ' + fm(P0, 1) + ' MW.', 'P = ρ × g × Q × H avec ρ = 1000 kg/m³.', tl(P0));
    if (d === 2) return num('Une centrale a un débit de ' + Q + ' m³/s, une chute de ' + H + ' m et un rendement de 90 %. Quelle puissance électrique, en MW ?', P1, 'MW', 'P = ' + fm(P0, 1) + ' × 0,9 = ' + fm(P1, 1) + ' MW.', 'Multiplie par le rendement.', tl(P1));
    if (d === 3) return num('Une centrale de ' + Q + ' m³/s, de rendement 90 %, voit sa hauteur de chute passer de ' + H + ' m à ' + (2 * H) + ' m. Quelle est la nouvelle puissance, en MW ?', 2 * P1, 'MW', 'La puissance double : 2 × ' + fm(P1, 1) + ' = ' + fm(2 * P1, 1) + ' MW.', 'P est proportionnelle à H.', tl(2 * P1));
    return num('Une centrale de ' + Pm + ' MW fonctionne ' + h + ' h. Quelle énergie produit-elle, en MWh ?', Pm * h, 'MWh', Pm + ' × ' + h + ' = ' + (Pm * h) + ' MWh.', 'Énergie = puissance × durée.');
  };
  G.parc = function (d) {
    var n = ri(5, 40), p = pick([2, 2.5, 3]), n2 = ri(5, 30), P = pick([10, 20, 50, 100]), fc = pick([30, 35, 40]), tot = n2 * p;
    if (d === 1) return num('Un parc compte ' + n + ' éoliennes de 2 MW. Quelle puissance totale, en MW ?', 2 * n, 'MW', n + ' × 2 = ' + (2 * n) + ' MW.', 'Nombre × puissance d’une éolienne.');
    if (d === 2) return num('Un parc compte ' + n2 + ' éoliennes de ' + fm(p, 1) + ' MW. Quelle puissance totale, en MW ?', tot, 'MW', n2 + ' × ' + fm(p, 1) + ' = ' + fm(tot, 1) + ' MW.', 'Nombre × puissance d’une éolienne.', 0.06);
    if (d === 3) return num('On veut un parc de ' + fm(tot, 1) + ' MW avec des éoliennes de ' + fm(p, 1) + ' MW. Combien d’éoliennes faut-il ?', n2, '', fm(tot, 1) + ' ÷ ' + fm(p, 1) + ' = ' + n2 + '.', 'Puissance du parc ÷ puissance d’une éolienne.');
    return num('Un parc de ' + P + ' MW a un facteur de charge de ' + fc + ' % (il produit en moyenne ' + fc + ' % de sa puissance maximale). Quelle énergie par an, en GWh ? (1 an ≈ 8 760 h)', P * 8.76 * fc / 100, 'GWh', P + ' × 8,76 × ' + fm(fc / 100, 2) + ' = ' + fm(P * 8.76 * fc / 100, 0) + ' GWh.', 'Puissance × 8 760 h × facteur de charge, puis ÷ 1 000.', tl(P * 8.76 * fc / 100));
  };
  G.verin = function (d) {
    var P = pick([2, 4, 6, 8]), S = pick([500, 1000, 2000]), dm = pick([20, 40, 50, 80]), Sd = Math.PI * dm * dm / 4, Fd = 0.1 * P * Sd;
    if (d === 1) return num('Un vérin a un piston de ' + S + ' mm² et fonctionne à ' + P + ' bar. Quelle force, en N ? (1 bar = 0,1 N/mm²)', 0.1 * P * S, 'N', 'F = ' + P + ' × 0,1 × ' + S + ' = ' + fm(0.1 * P * S, 0) + ' N.', 'F = P × S avec 1 bar = 0,1 N/mm².');
    if (d === 2) return num('Un piston a un diamètre de ' + dm + ' mm. Quelle est sa surface, en mm² ?', Sd, 'mm²', 'S = π × ' + dm + '² ÷ 4 ≈ ' + fm(Sd, 0) + ' mm².', 'S = π × d² ÷ 4.', tl(Sd));
    if (d === 3) return num('Un vérin à piston de ' + dm + ' mm de diamètre fonctionne à ' + P + ' bar. Quelle force, en N ?', Fd, 'N', 'S ≈ ' + fm(Sd, 0) + ' mm² ; F = ' + P + ' × 0,1 × ' + fm(Sd, 0) + ' ≈ ' + fm(Fd, 0) + ' N.', 'Calcule S, puis F = P × 0,1 × S.', tl(Fd));
    return num('Un vérin de ' + dm + ' mm de diamètre à ' + P + ' bar soulève une masse. Quelle masse maximale, en kg ? (poids = 10 N par kg)', Fd / 10, 'kg', 'F ≈ ' + fm(Fd, 0) + ' N, donc m ≈ ' + fm(Fd / 10, 0) + ' kg.', 'Masse = force ÷ 10.', tl(Fd / 10));
  };
  G.lamp = function (d) {
    var P = pick([10, 20, 60, 100]), t = pick([2, 5, 10]), h = ri(2, 10), px = pick([1, 1.2, 1.5]);
    if (d === 1) return num('Une lampe de ' + P + ' W reste allumée ' + t + ' h. Quelle énergie, en Wh ?', P * t, 'Wh', P + ' × ' + t + ' = ' + (P * t) + ' Wh.', 'E = P × t.');
    if (d === 2) return num('Une lampe de ' + P + ' W est allumée ' + h + ' h par jour pendant 30 jours. Quelle énergie, en kWh ?', P * h * 30 / 1000, 'kWh', P + ' × ' + h + ' × 30 ÷ 1000 = ' + fm(P * h * 30 / 1000, 2) + ' kWh.', 'Wh puis ÷ 1000.', tl(P * h * 30 / 1000));
    if (d === 3) return num('Une lampe de ' + P + ' W est allumée ' + h + ' h par jour pendant 30 jours. Le kWh coûte ' + fm(px, 1) + ' DH. Quel est le coût du mois, en DH ?', P * h * 30 / 1000 * px, 'DH', fm(P * h * 30 / 1000, 2) + ' × ' + fm(px, 1) + ' = ' + fm(P * h * 30 / 1000 * px, 2) + ' DH.', 'Énergie en kWh × prix du kWh.', tl(P * h * 30 / 1000 * px));
    return num('On remplace une lampe de 60 W par une LED de 9 W, allumée ' + h + ' h par jour pendant 30 jours. Le kWh coûte ' + fm(px, 1) + ' DH. Quelle économie par mois, en DH ?', 51 * h * 30 / 1000 * px, 'DH', '(60 − 9) × ' + h + ' × 30 ÷ 1000 × ' + fm(px, 1) + ' = ' + fm(51 * h * 30 / 1000 * px, 2) + ' DH.', 'Écart de puissance × durée × prix.', tl(51 * h * 30 / 1000 * px));
  };
  G.tilt = function (d) {
    var h = pick([30, 40, 45, 50, 60, 70]), h2 = ri(20, 75), tl2 = ri(15, 60), dc = pick([-23, 0, 23]);
    if (d === 1) return num('Le Soleil est à ' + h + '° au-dessus de l’horizon. Quelle inclinaison idéale pour un panneau, en degrés ?', 90 - h, '°', '90 − ' + h + ' = ' + (90 - h) + '°.', 'Inclinaison idéale = 90° − hauteur du Soleil.');
    if (d === 2) return num('Le Soleil est à ' + h2 + '° de hauteur. Quelle inclinaison idéale, en degrés ?', 90 - h2, '°', '90 − ' + h2 + ' = ' + (90 - h2) + '°.', 'Inclinaison idéale = 90° − hauteur du Soleil.');
    if (d === 3) return num('Un panneau est incliné à ' + tl2 + '° et capte au mieux. Quelle est la hauteur du Soleil, en degrés ?', 90 - tl2, '°', '90 − ' + tl2 + ' = ' + (90 - tl2) + '°.', 'Hauteur = 90° − inclinaison.');
    return num('Au Maroc (latitude 31°), l’inclinaison idéale à midi vaut latitude − déclinaison du Soleil. Quelle inclinaison quand la déclinaison est ' + dc + '° ?', 31 - dc, '°', '31 − (' + dc + ') = ' + (31 - dc) + '°.', 'Soustrais la déclinaison de la latitude.');
  };

  G.base = function (d) {
    var b = pick([50, 100, 200]), I = pick([100, 200, 300, 400, 600]), ib = pick([2, 5, 10]);
    if (d === 1) return num('Un transistor de gain ' + b + ' commande un moteur de ' + I + ' mA. Quel courant de base faut-il, en mA ?', I / b, 'mA', 'I base = ' + I + ' ÷ ' + b + ' = ' + fm(I / b, 2) + ' mA.', 'Courant de base = courant commandé ÷ gain.', 0.02);
    if (d === 2) return num('Un transistor de gain ' + b + ' reçoit ' + ib + ' mA sur sa base. Quel courant maximal commande-t-il, en mA ?', ib * b, 'mA', ib + ' × ' + b + ' = ' + (ib * b) + ' mA.', 'Courant commandé = gain × courant de base.');
    if (d === 3) return num('Une broche supporte 20 mA. Un moteur de ' + I + ' mA est branché directement dessus. Il demande combien de fois la limite ?', I / 20, 'fois', I + ' ÷ 20 = ' + fm(I / 20, 1) + '.', 'Divise par 20 mA.', 0.06);
    return num('La broche d’une carte fournit au plus 20 mA à la base d’un transistor de gain ' + b + '. Quel courant maximal de moteur peut-on commander, en mA ?', 20 * b, 'mA', '20 × ' + b + ' = ' + (20 * b) + ' mA.', 'Gain × courant de base.');
  };
  G.co2 = function (d) {
    var kwh = pick([100, 150, 200, 300, 400]), S = [['au charbon', 820], ['au gaz', 490], ['au solaire photovoltaïque', 45], ['à l’hydraulique', 24], ['à l’éolien', 11]], s = pick(S), s2 = pick(S.slice(0, 2));
    if (d === 1) return num('Un foyer consomme ' + kwh + ' kWh produits ' + s2[0] + ' (' + s2[1] + ' g de CO₂ par kWh). Combien de kg de CO₂ cela représente-t-il ?', kwh * s2[1] / 1000, 'kg', kwh + ' × ' + s2[1] + ' ÷ 1000 = ' + fm(kwh * s2[1] / 1000, 1) + ' kg.', 'kg = kWh × g/kWh ÷ 1000.', tl(kwh * s2[1] / 1000));
    if (d === 2) return num('Pour ' + kwh + ' kWh produits ' + s[0] + ' (' + s[1] + ' g de CO₂ par kWh), combien de kg de CO₂ ?', kwh * s[1] / 1000, 'kg', kwh + ' × ' + s[1] + ' ÷ 1000 = ' + fm(kwh * s[1] / 1000, 2) + ' kg.', 'kg = kWh × g/kWh ÷ 1000.', tl(kwh * s[1] / 1000));
    if (d === 3) return num('Pour ' + kwh + ' kWh, de combien de kg de CO₂ réduit-on les émissions en passant du charbon (820 g/kWh) à l’éolien (11 g/kWh) ?', kwh * 809 / 1000, 'kg', kwh + ' × (820 − 11) ÷ 1000 = ' + fm(kwh * 809 / 1000, 1) + ' kg.', 'Écart par kWh × nombre de kWh.', tl(kwh * 809 / 1000));
    return num('Un foyer consomme ' + kwh + ' kWh : la moitié produite au charbon (820 g/kWh), l’autre moitié par l’éolien (11 g/kWh). Combien de kg de CO₂ ?', kwh / 2 * (820 + 11) / 1000, 'kg', fm(kwh / 2, 0) + ' × (820 + 11) ÷ 1000 = ' + fm(kwh / 2 * 831 / 1000, 1) + ' kg.', 'Calcule chaque moitié puis additionne.', tl(kwh / 2 * 831 / 1000));
  };
  G.octet = function (d) {
    var W = [128, 64, 32, 16, 8, 4, 2, 1], i, bits, v;
    function mk(n) { var b = [0, 0, 0, 0, 0, 0, 0, 0], c = 0; while (c < n) { var j = ri(0, 7); if (!b[j]) { b[j] = 1; c++; } } return b; }
    function val(b) { var s = 0; for (i = 0; i < 8; i++) s += b[i] * W[i]; return s; }
    if (d === 1) { bits = [0, 0, 0, 0, ri(0, 1), ri(0, 1), ri(0, 1), ri(0, 1)]; return num('Quelle est la valeur décimale de l’octet ' + bits.join('') + ' ?', val(bits), '', 'On additionne les poids des bits à 1 : ' + val(bits) + '.', 'Poids : 128, 64, 32, 16, 8, 4, 2, 1.'); }
    if (d === 2) { bits = mk(2); return num('Quelle est la valeur décimale de l’octet ' + bits.join('') + ' ?', val(bits), '', 'Poids des bits à 1 : ' + val(bits) + '.', 'Poids : 128, 64, 32, 16, 8, 4, 2, 1.'); }
    if (d === 3) { bits = mk(3); return num('Quelle est la valeur décimale de l’octet ' + bits.join('') + ' ?', val(bits), '', 'Poids des bits à 1 : ' + val(bits) + '.', 'Poids : 128, 64, 32, 16, 8, 4, 2, 1.'); }
    bits = mk(ri(3, 5)); return num('Quelle est la valeur décimale de l’octet ' + bits.join('') + ' ?', val(bits), '', 'Un octet : 256 valeurs (0 à 255). Ici : ' + val(bits) + '.', 'Additionne les poids des bits à 1.');
  };

  G.rc = function (d) {
    var R = pick([10, 20, 50, 100]), C = pick([10, 22, 47, 100]), tau = R * C / 1000, ta = pick([1, 2, 4.7, 10]), Cc = pick([10, 47, 100]);
    if (d === 1) return num('Une temporisation a R = ' + R + ' kΩ et C = ' + C + ' µF. Quelle est la constante de temps τ = R × C, en s ?', tau, 's', 'τ = ' + R + ' × ' + C + ' ÷ 1000 = ' + fm(tau, 2) + ' s.', 'kΩ × µF donne des millisecondes.', tl(tau));
    if (d === 2) return num('R = ' + R + ' kΩ et C = ' + C + ' µF. Quel est le délai, environ 0,69 × τ, en s ?', 0.69 * tau, 's', '0,69 × ' + fm(tau, 2) + ' = ' + fm(0.69 * tau, 2) + ' s.', 'Calcule τ puis multiplie par 0,69.', tl(0.69 * tau));
    if (d === 3) return num('On veut τ = ' + fm(ta * Cc / 100, 2) + ' s avec C = ' + Cc + ' µF. Quelle résistance, en kΩ ?', ta * 10, 'kΩ', 'R = τ ÷ C = ' + fm(ta * Cc / 100, 2) + ' ÷ ' + Cc + ' µF = ' + fm(ta * 10, 1) + ' kΩ.', 'R = τ ÷ C ; avec C en µF, R en kΩ vaut τ(ms) ÷ C.', tl(ta * 10));
    return num('R = ' + R + ' kΩ. On veut τ = ' + fm(tau, 2) + ' s. Quelle capacité C, en µF ?', C, 'µF', 'C = τ ÷ R = ' + fm(tau, 2) + ' ÷ ' + R + ' kΩ = ' + C + ' µF.', 'C = τ ÷ R.', tl(C));
  };
  G.revient = function (d) {
    var m = pick([10, 15, 20, 30]), mo = pick([5, 8, 10, 12]), ch = pick([2, 3, 5]), cout = m + mo + ch, marge = pick([5, 8, 10]), n = pick([10, 20, 30, 50]), fixe = pick([100, 200, 300]), mu = pick([5, 10, 20]);
    if (d === 1) return num('Un article coûte ' + m + ' DH de matières, ' + mo + ' DH de main-d’œuvre et ' + ch + ' DH de charges. Quel est son coût de revient, en DH ?', cout, 'DH', m + ' + ' + mo + ' + ' + ch + ' = ' + cout + ' DH.', 'Additionne les trois postes.');
    if (d === 2) return num('Le coût de revient d’un article est ' + cout + ' DH et la marge ' + marge + ' DH. Quel est le prix de vente, en DH ?', cout + marge, 'DH', cout + ' + ' + marge + ' = ' + (cout + marge) + ' DH.', 'Prix = coût + marge.');
    if (d === 3) return num('Un article de coût ' + cout + ' DH est vendu avec une marge de ' + marge + ' DH. On en vend ' + n + '. Quel bénéfice, en DH ?', marge * n, 'DH', marge + ' × ' + n + ' = ' + (marge * n) + ' DH.', 'Marge × nombre d’articles.');
    return num('Une mini-entreprise a ' + fixe + ' DH de charges fixes et gagne ' + mu + ' DH par article vendu. Combien d’articles faut-il vendre pour couvrir les charges fixes ?', fixe / mu, '', fixe + ' ÷ ' + mu + ' = ' + fm(fixe / mu, 0) + ' articles.', 'Charges fixes ÷ gain par article.');
  };
  var M = {};
  M['t3-1'] = { topics: ['b:evo'] };
  M['t3-2'] = { topics: ['b:acq', 'b:acq', 'g:volt', 'g:echo'] };
  M['t3-3'] = { topics: ['b:trait', 'b:trait', 'g:algo'] };
  M['t3-4'] = { topics: ['b:comm', 'b:comm', 'g:octet'] };
  M['t3-5'] = { topics: ['b:ali', 'b:ali', 'g:auto', 'g:led'] };
  M['t3-6'] = { topics: ['b:dis', 'b:dis', 'g:base'] };
  M['t3-7'] = { topics: ['b:conv', 'b:conv', 'g:pwm', 'g:rend'] };
  M['t3-8'] = { topics: ['b:trans', 'b:trans', 'g:ratio', 'g:mvt'] };
  M['t3-9'] = { topics: ['b:agir', 'b:agir', 'g:verin'] };
  M['t3-10'] = { topics: ['b:des', 'b:des', 'g:ech'] };
  M['t2-1'] = { topics: ['b:ing1'] };
  M['t2-2'] = { topics: ['b:ing2'] };
  M['t2-3'] = { topics: ['b:sch'] };
  M['t2-4'] = { topics: ['b:ali2', 'b:ali2', 'g:auto'] };
  M['t2-6'] = { topics: ['b:com'] };
  M['t2-7'] = { topics: ['b:det', 'b:det', 'g:volt'] };
  M['t2-8'] = { topics: ['b:tmp', 'b:tmp', 'g:rc'] };
  M['t2-9'] = { topics: ['b:mvt2', 'b:mvt2', 'g:ratio'] };
  M['t2-10'] = { topics: ['b:pcb'] };
  M['t2-11'] = { topics: ['b:ent1'] };
  M['t2-12'] = { topics: ['b:ent2'] };
  M['t2-13'] = { topics: ['b:ent3', 'b:ent3', 'g:revient'] };
  M['t2-5'] = { topics: ['b:sig', 'b:sig', 'g:led'] };
  M['t3-11'] = { topics: ['b:ener', 'b:ener', 'g:co2'] };
  M['t3-12'] = { topics: ['b:hyd', 'b:hyd', 'g:hydro', 'g:parc'] };
  M['t3-13'] = { topics: ['b:sol', 'b:sol', 'g:tilt', 'g:puiss', 'g:pv'] };
  M['t3-14'] = { topics: ['b:eff', 'b:eff', 'g:lamp', 'g:cout'] };

  window.LAB_CONFIG = {
    riddles: [
      { q: "Un portail s’ouvre quand un capteur détecte la voiture. Quel élément « décide » ?", qa: "بوابة تُفتح عندما يكتشف لاقط السيارة. أي عنصر «يقرّر»؟", o: ["le moteur", "l’unité de traitement", "la photorésistance"], a: 1, e: "Le capteur informe, le traitement décide, l’actionneur agit.", ea: "اللاقط يخبر، والمعالجة تقرّر، والمنفّذ يعمل." },
      { q: "Un sonar de recul mesure 0,01 s entre l’émission et l’écho. À 340 m/s, la distance est :", qa: "مقياس مسافة للرجوع يقيس 0٫01 ث بين الإرسال والصدى. بسرعة 340 م/ث تكون المسافة:", o: ["3,4 m", "1,7 m", "0,85 m"], a: 1, e: "d = 340 × 0,01 ÷ 2 = 1,7 m : l’onde fait l’aller-retour.", ea: "d = 340 × 0٫01 ÷ 2 = 1٫7 م: الموجة تقطع الذهاب والإياب." },
      { q: "Combien de valeurs différentes peut coder un octet (8 bits) ?", qa: "كم قيمة مختلفة يمكن أن يرمّزها البايت (8 بتات)؟", o: ["8", "256", "64"], a: 1, e: "2⁸ = 256 valeurs, de 0 à 255.", ea: "2⁸ = 256 قيمة، من 0 إلى 255." },
      { q: "Dans une perceuse sur batterie, quel élément est le pré-actionneur ?", qa: "في مثقاب يعمل بالبطارية، أي عنصر هو المنفّذ المسبق؟", o: ["le mandrin", "le moteur", "l’interrupteur à gâchette"], a: 2, e: "Il distribue l’énergie électrique au moteur, qui est l’actionneur.", ea: "يوزّع الطاقة الكهربائية على المحرك الذي هو المنفّذ." },
      { q: "Deux piles de 1,5 V en série alimentent un moteur. La tension est :", qa: "بطاريتان 1٫5 فولت على التسلسل تغذّيان محركا. التوتر هو:", o: ["1,5 V", "3 V", "0 V"], a: 1, e: "En série, les tensions s’additionnent.", ea: "على التسلسل تُجمع التوترات." },
      { q: "Un signal PWM à rapport cyclique de 25 % sur 12 V donne en moyenne :", qa: "إشارة PWM بنسبة دورية 25٪ على 12 فولت تعطي في المتوسط:", o: ["3 V", "6 V", "9 V"], a: 0, e: "12 × 0,25 = 3 V : le moteur tourne lentement.", ea: "12 × 0٫25 = 3 فولت: يدور المحرك ببطء." },
      { q: "Un engrenage de 10 dents entraîne un engrenage de 30 dents. La vitesse est :", qa: "ترس بـ 10 أسنان يدير ترسا بـ 30 سنا. السرعة:", o: ["divisée par 3", "multipliée par 3", "inchangée"], a: 0, e: "Le grand engrenage tourne trois fois moins vite.", ea: "العجلة الكبيرة تدور أبطأ بثلاث مرات." },
      { q: "Quel système transforme une rotation en translation ?", qa: "أي نظام يحوّل الدوران إلى انتقال؟", o: ["le train d’engrenages", "la courroie", "le système vis-écrou"], a: 2, e: "La rotation de la vis déplace l’écrou en ligne droite.", ea: "دوران اللولب يحرّك الصامولة في خط مستقيم." },
      { q: "Quelle ligne représente les arêtes cachées d’une pièce ?", qa: "أي خط يمثل الحواف المخفية لقطعة؟", o: ["trait fort continu", "trait interrompu fin", "trait mixte fin"], a: 1, e: "Les contours cachés sont en traits interrompus fins.", ea: "الحواف المخفية تُرسم بخط متقطع رفيع." },
      { q: "Une pièce de 80 mm est dessinée à l’échelle 1:2. Sur le dessin elle mesure :", qa: "قطعة طولها 80 ملم رُسمت بمقياس 1:2. طولها على الرسم:", o: ["160 mm", "40 mm", "80 mm"], a: 1, e: "80 ÷ 2 = 40 mm.", ea: "80 ÷ 2 = 40 ملم." },
      { q: "Quel format de papier est obtenu en pliant un A3 en deux ?", qa: "أي حجم ورق نحصل عليه بطيّ A3 إلى نصفين؟", o: ["A2", "A5", "A4"], a: 2, e: "Chaque pliage divise la surface par deux : A3 donne A4.", ea: "كل طيّ يقسم المساحة إلى النصف: A3 يعطي A4." },
      { q: "Quelle source est renouvelable ?", qa: "أي مصدر متجدد؟", o: ["le gaz naturel", "le vent", "le charbon"], a: 1, e: "Le vent se renouvelle sans cesse, contrairement aux énergies fossiles.", ea: "الرياح تتجدد باستمرار، بخلاف الطاقات الأحفورية." },
      { q: "Quelle centrale marocaine concentre le soleil avec un champ de miroirs et une tour ?", qa: "أي محطة مغربية تركّز الشمس بحقل مرايا وبرج؟", o: ["Tarfaya", "Noor Ouarzazate III", "Abdelmoumen"], a: 1, e: "Noor III est une centrale à tour de 150 MW.", ea: "نور 3 محطة ببرج قدرتها 150 ميغاواط." },
      { q: "À quoi sert une STEP, comme Abdelmoumen ?", qa: "فيمَ تفيد محطة التخزين بالضخ مثل عبد المومن؟", o: ["produire de l’hydrogène", "stocker l’énergie en pompant l’eau", "capter la lumière"], a: 1, e: "Elle pompe l’eau vers le haut quand l’électricité est abondante, puis turbine.", ea: "تضخّ الماء إلى الأعلى عند وفرة الكهرباء ثم تولّد عند الحاجة." },
      { q: "Quel est le meilleur choix pour un panneau PV fixe au Maroc ?", qa: "ما أفضل وضع للوح كهروضوئي ثابت في المغرب؟", o: ["face au nord", "face au sud, incliné", "à plat, à l’ombre"], a: 1, e: "Au Maroc, le Soleil est au sud : on oriente le panneau vers le sud.", ea: "في المغرب الشمس جنوبا: نوجّه اللوح نحو الجنوب." },
      { q: "Quelle étiquette énergie indique l’appareil le plus économe ?", qa: "أي بطاقة طاقية تدل على الجهاز الأكثر اقتصادا؟", o: ["A", "D", "G"], a: 0, e: "A est la classe la plus économe, G la moins.", ea: "A الأكثر اقتصادا وG الأقل." },
      { q: "Le courant d’une LED est trop fort. Que faire ?", qa: "تيار الصمام الضوئي (LED) قوي جدا. ماذا نفعل؟", o: ["augmenter la résistance en série", "retirer la résistance", "brancher à l’envers"], a: 0, e: "Une résistance plus grande limite davantage le courant.", ea: "مقاومة أكبر تحدّ من التيار أكثر." },
      { q: "Jaune, violet, rouge : quelle valeur ?", qa: "أصفر، بنفسجي، أحمر: ما القيمة؟", o: ["470 Ω", "4 700 Ω", "47 Ω"], a: 1, e: "4, 7, puis deux zéros : 4 700 Ω.", ea: "4 ثم 7 ثم صفران: 4700 أوم." },
      { q: "Quel composant commande une lampe du secteur avec un signal de 5 V ?", qa: "أي مكوّن يتحكم في مصباح الكهرباء العامة بإشارة 5 فولت؟", o: ["le relais", "la LED", "le condensateur"], a: 0, e: "Le relais sépare commande et puissance.", ea: "المرحّل يفصل بين الأمر والقدرة." },
      { q: "La résistance d’une photorésistance, la nuit, est :", qa: "مقاومة المقاومة الضوئية ليلا:", o: ["faible", "élevée", "nulle"], a: 1, e: "Moins de lumière, plus de résistance.", ea: "ضوء أقل، مقاومة أكبر." },
      { q: "R = 10 kΩ, C = 100 µF. La constante de temps vaut :", qa: "R = 10 كيلو أوم وC = 100 µF. ثابت الزمن:", o: ["1 s", "10 s", "0,1 s"], a: 0, e: "τ = R × C = 10 000 × 0,0001 = 1 s.", ea: "τ = R × C = 10000 × 0٫0001 = 1 ث." },
      { q: "Après la gravure d’un circuit imprimé, il faut :", qa: "بعد حفر الدارة المطبوعة يجب:", o: ["l’insoler", "le percer", "le dessiner"], a: 1, e: "Ordre : typon, insolation, révélation, gravure, perçage, soudure.", ea: "الترتيب: الطبع، التعريض، التحميض، الحفر، الثقب، اللحام." },
      { q: "Un coût de revient de 35 DH et une marge de 10 DH donnent un prix de vente de :", qa: "تكلفة 35 درهما وهامش 10 دراهم يعطيان ثمن بيع:", o: ["25 DH", "45 DH", "350 DH"], a: 1, e: "35 + 10 = 45 DH.", ea: "35 + 10 = 45 درهما." }
    ],
    app: SUBJECT.key, appName: SUBJECT.name + ' en mouvement', map: M,
    gen: function (key, d) {
      var k = key.slice(2);
      if (key.charAt(0) === 'b') return fromBank(k, d === 4 ? 3 : d);
      return G[k](d);
    }
  };
})();
