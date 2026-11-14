/* Configuration des défis : Physique-Chimie en mouvement */
(function () {
  'use strict';
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i], a2 = a; a[i] = a[j]; a[j] = t; } return a; }
  function fm(x, d) { var s = (+x).toFixed(d === undefined ? 2 : d); if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, ''); return s.replace('.', ','); }
  function num(q, a, u, e, h, tol) { return { t: 'num', q: q, a: a, u: u || '', e: e, h: h || '', tol: tol === undefined ? Math.max(.0006, Math.abs(a) * .004) : tol, sol: fm(a, Math.abs(a) >= 100 ? 0 : (Math.abs(a) >= 10 ? 1 : 3)) + (u ? ' ' + u : '') }; }

  /* niveau Défi : problèmes en plusieurs étapes */
  var HARD = {
    ohm: function () {
      var r1 = ri(2, 9) * 10, r2 = ri(2, 9) * 10, u = ri(3, 12) * 2, i = u / (r1 + r2);
      return num('Deux conducteurs ohmiques de ' + r1 + ' Ω et ' + r2 + ' Ω sont montés en série aux bornes d’un générateur de ' + u + ' V. Quelle est la tension aux bornes du conducteur de ' + r1 + ' Ω ?', i * r1, 'V', 'Résistance totale : ' + (r1 + r2) + ' Ω. Intensité : I = ' + u + ' ÷ ' + (r1 + r2) + ' = ' + fm(i, 3) + ' A. Tension : U = R × I = ' + r1 + ' × ' + fm(i, 3) + ' = ' + fm(i * r1, 2) + ' V.', 'En série, on additionne les résistances, puis on utilise U = R × I.', 0.02);
    },
    power: function () {
      var p = pick([100, 200, 500, 1000, 1500, 2000]), hh = ri(2, 8), price = pick([1.2, 1.4, 1.6]);
      var kwh = p / 1000 * hh;
      return num('Un appareil de ' + p + ' W fonctionne ' + hh + ' h par jour pendant 30 jours. Le prix du kWh est de ' + fm(price, 1) + ' DH. Quel est le coût du mois, en DH ?', kwh * 30 * price, 'DH', 'Énergie : E = P × t = ' + fm(p / 1000, 2) + ' kW × ' + hh + ' h × 30 = ' + fm(kwh * 30, 2) + ' kWh. Coût : ' + fm(kwh * 30, 2) + ' × ' + fm(price, 1) + ' = ' + fm(kwh * 30 * price, 2) + ' DH.', 'Convertis les watts en kilowatts avant de multiplier par la durée.', 0.02);
    },
    speed: function () {
      var d1 = ri(2, 6) * 20, v1 = pick([40, 60, 80]), d2 = ri(2, 6) * 20, v2 = pick([30, 50, 100]);
      var t = d1 / v1 + d2 / v2, v = (d1 + d2) / t;
      return num('Un car roule ' + d1 + ' km à ' + v1 + ' km/h, puis ' + d2 + ' km à ' + v2 + ' km/h. Quelle est sa vitesse moyenne sur tout le trajet ?', v, 'km/h', 'Durées : ' + d1 + '/' + v1 + ' + ' + d2 + '/' + v2 + ' = ' + fm(t, 3) + ' h. Distance : ' + (d1 + d2) + ' km. v = ' + fm(v, 1) + ' km/h.', 'Vitesse moyenne = distance totale ÷ durée totale.', 0.2);
    },
    weight: function () {
      var m = ri(2, 9) * 10, gt = 10, gl = 1.6, gm = 3.7;
      var astre = pick([['la Lune', 1.6], ['Mars', 3.7]]);
      return num('Sur Terre (g = 10 N/kg), un astronaute avec son équipement pèse ' + (m * 10) + ' N. Quel est son poids sur ' + astre[0] + ' (g = ' + fm(astre[1], 1) + ' N/kg) ?', m * astre[1], 'N', 'Masse : m = P ÷ g = ' + (m * 10) + ' ÷ 10 = ' + m + ' kg (la masse ne change pas). Poids : P = ' + m + ' × ' + fm(astre[1], 1) + ' = ' + fm(m * astre[1], 1) + ' N.', 'Calcule d’abord la masse, qui ne dépend pas du lieu.', 0.2);
    },
    rho: function () {
      var rho = pick([2.7, 7.8, 8.9, 11.3]), v = ri(2, 9) * 5;
      var m = rho * v;
      return num('Un bloc de métal de masse volumique ' + fm(rho, 1) + ' g/cm³ occupe un volume de ' + v + ' cm³. Quelle est sa masse en kilogrammes ?', m / 1000, 'kg', 'm = ρ × V = ' + fm(rho, 1) + ' × ' + v + ' = ' + fm(m, 1) + ' g, soit ' + fm(m / 1000, 4) + ' kg.', 'Calcule en grammes, puis convertis en kilogrammes.', 0.0006);
    },
    node: function () {
      var i1 = ri(2, 6) / 2, i2 = ri(2, 6) / 2, i3 = ri(1, 4) / 2, i4 = i1 + i2 - i3;
      if (i4 <= 0) return HARD.node();
      return num('À un nœud, les courants arrivants sont ' + fm(i1, 1) + ' A et ' + fm(i2, 1) + ' A. Deux courants repartent : un de ' + fm(i3, 1) + ' A et un autre. Quelle est l’intensité de cet autre courant ?', i4, 'A', 'Loi des nœuds : somme des courants arrivants = somme des courants sortants. ' + fm(i1 + i2, 1) + ' = ' + fm(i3, 1) + ' + I, donc I = ' + fm(i4, 1) + ' A.', 'Courants arrivants = courants sortants.', 0.02);
    },
    tens: function () {
      var u = ri(4, 12) * 2, u1 = ri(1, 3), u2 = ri(1, 3), u3 = u - u1 - u2;
      if (u3 <= 0) return HARD.tens();
      return num('Trois lampes en série sont alimentées par un générateur de ' + u + ' V. Les tensions aux bornes de deux lampes sont ' + u1 + ' V et ' + u2 + ' V. Quelle est la tension aux bornes de la troisième lampe ?', u3, 'V', 'Additivité des tensions en série : ' + u + ' = ' + u1 + ' + ' + u2 + ' + U₃, donc U₃ = ' + u3 + ' V.', 'En série, les tensions s’additionnent.', 0.02);
    },
    mass: function () {
      var m0 = ri(2, 9) * 10, mf = m0 - ri(1, 5) * 2;
      return num('On brûle de la laine d’acier (fer) dans l’air : sa masse passe de ' + m0 + ' g à ' + (m0 + 6) + ' g. Quelle masse de dioxygène a réagi ?', 6, 'g', 'Conservation de la masse : masse de fer + masse de dioxygène consommé = masse du produit. ' + (m0 + 6) + ' − ' + m0 + ' = 6 g.', 'La masse augmente car le fer se combine avec le dioxygène.', 0.02);
    }
  };

  function B() { return window.PC && window.PC.bank; }
  function G() { return window.PC && window.PC.gen; }
  function fromBank(key, d) {
    var bk = B() && B()[key]; if (!bk) return null;
    var pool = bk.q.filter(function (x) { return d === 1 ? x[0] <= 2 : (d === 2 ? true : x[0] >= 2); });
    if (!pool.length) pool = bk.q;
    var x = pick(pool), idx = shuffle(x[2].map(function (_, i) { return i; }));
    return { t: 'mcq', q: x[1], o: idx.map(function (i) { return x[2][i]; }), a: idx.indexOf(x[3]), e: x[4], h: 'Relis « ' + (bk.look ? 'Je regarde' : 'le cours') + ' » du chapitre.' };
  }

  var M1 = {};
  function T(id, topics) { M1[id] = { topics: topics }; }
  T('c1-1', ['b:eau']);
  T('c1-2', ['b:etat', 'b:part']);
  T('c1-3', ['g:rho', 'g:convm', 'g:convl']);
  T('c1-7', ['b:mel']);
  T('c1-8', ['b:sep']);
  T('c1-9', ['b:eau']);
  T('c1-10', ['b:circ']);
  T('c1-11', ['b:circ', 'b:cond']);
  T('c1-14', ['b:circ']);
  T('c1-15', ['b:res']);
  T('c1-16', ['g:node', 'g:tens']);
  T('c1-17', ['b:secu']);
  T('c2-2', ['b:air', 'g:air']);
  T('c2-3', ['b:mol', 'g:atoms']);
  T('c2-4', ['b:comb', 'g:mass']);
  T('c2-5', ['g:mass', 'b:comb']);
  T('c2-7', ['b:pol']);
  T('c2-9', ['b:col']);
  T('c2-10', ['b:lum', 'g:shadow']);
  T('c2-14', ['b:dom', 'g:power']);
  T('c3-1', ['b:mat']);
  T('c3-3', ['b:mat']);
  T('c3-4', ['b:ph']);
  T('c3-5', ['b:ph', 'b:mat']);
  T('c3-6', ['b:ion']);
  T('c3-9', ['g:speed', 'g:kmh']);
  T('c3-10', ['b:meca']);
  T('c3-11', ['b:meca']);
  T('c3-12', ['b:meca']);
  T('c3-13', ['g:weight']);
  T('c3-14', ['g:ohm', 'b:res']);
  T('c3-16', ['g:power']);

  window.LAB_CONFIG = {
    riddles: [
      {
        "q": "Un glaçon flotte dans un verre d’eau rempli à ras bord. Quand il a fondu, le verre déborde-t-il ?",
        "qa": "قطعة ثلج تطفو في كأس ماء ممتلئ حتى الحافة. عند ذوبانها هل ينسكب الماء؟",
        "o": [
          "Oui, un peu",
          "Non, le niveau ne change pas",
          "Oui, beaucoup",
          "Le verre se vide"
        ],
        "a": 1,
        "e": "Le glaçon déplace un volume d’eau de même masse que lui. En fondant, il donne exactement ce volume d’eau liquide.",
        "ea": "قطعة الثلج تزيح حجما من الماء له نفس كتلتها. عند الذوبان تعطي بالضبط هذا الحجم من الماء السائل."
      },
      {
        "q": "Comment s’appelle le passage de l’état liquide à l’état solide ?",
        "qa": "ماذا نسمي الانتقال من الحالة السائلة إلى الحالة الصلبة؟",
        "o": [
          "La fusion",
          "La vaporisation",
          "La solidification",
          "La condensation"
        ],
        "a": 2,
        "e": "Liquide vers solide : solidification. Solide vers liquide : fusion.",
        "ea": "من سائل إلى صلب: التصلب. ومن صلب إلى سائل: الانصهار."
      },
      {
        "q": "Quelle grandeur est conservée quand la glace fond ?",
        "qa": "ما المقدار الذي يبقى ثابتا عندما يذوب الثلج؟",
        "o": [
          "Le volume",
          "La masse",
          "La forme",
          "La masse volumique"
        ],
        "a": 1,
        "e": "La masse se conserve lors d’un changement d’état. Le volume et la masse volumique changent.",
        "ea": "تبقى الكتلة ثابتة خلال تغيّر الحالة. أما الحجم والكتلة الحجمية فيتغيران."
      },
      {
        "q": "Une voiture parcourt 90 km en 1 h 30. Quelle est sa vitesse moyenne ?",
        "qa": "قطعت سيارة 90 كم في ساعة ونصف. ما سرعتها المتوسطة؟",
        "o": [
          "45 km/h",
          "60 km/h",
          "90 km/h",
          "135 km/h"
        ],
        "a": 1,
        "e": "v = d ÷ t = 90 ÷ 1,5 = 60 km/h.",
        "ea": "v = d ÷ t = 90 ÷ 1,5 = 60 كم/س."
      },
      {
        "q": "On dissout du sel dans de l’eau. Quel type de mélange obtient-on ?",
        "qa": "أذبنا ملحا في الماء. ما نوع الخليط الناتج؟",
        "o": [
          "Un mélange hétérogène",
          "Un corps pur",
          "Un mélange homogène",
          "Un élément chimique"
        ],
        "a": 2,
        "e": "On ne distingue plus le sel de l’eau à l’œil nu : le mélange est homogène.",
        "ea": "لا نميّز الملح عن الماء بالعين المجردة: الخليط متجانس."
      },
      {
        "q": "Un seul fil relie directement les deux bornes d’une pile. Comment nomme-t-on cette situation, à ne jamais reproduire ?",
        "qa": "سلك واحد يصل مباشرة بين قطبي عمود. ماذا نسمي هذه الوضعية التي يجب ألا نكررها؟",
        "o": [
          "Un circuit en série",
          "Un circuit en dérivation",
          "Un circuit ouvert",
          "Un court-circuit"
        ],
        "a": 3,
        "e": "C’est un court-circuit : le courant est très intense, le fil et la pile chauffent. Il est dangereux.",
        "ea": "هذا هو القصر الكهربائي: تصبح الشدة كبيرة جدا فيسخن السلك والعمود. وهو خطير."
      }
    ],
    app: 'pc', appName: 'Physique-Chimie en mouvement', map: M1,
    gen: function (key, d) {
      var kind = key.slice(0, 1), k = key.slice(2);
      if (kind === 'b') return fromBank(k, d === 4 ? 3 : d);
      if (d === 4 && HARD[k]) return HARD[k]();
      var g = G(); if (!g || !g[k]) return null;
      return g[k](d === 4 ? 3 : d);
    }
  };
})();
