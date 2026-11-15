/* ===================================================== 2AC · MODULE 1 · MODÉLISATION DES SYSTÈMES TECHNIQUES */
function boucleBesoin(el) {
  var svg = ui.stage(el, 400, 250, 'Du besoin à la satisfaction'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el);
  var STEPS = [
    ['Le besoin', 'Entrer en voiture sans descendre ouvrir le portail.'],
    ['La recherche de solutions', 'On compare : portail manuel, motorisé, télécommandé.'],
    ['L’objet technique', 'On fabrique la solution : un portail motorisé.'],
    ['Le service rendu', 'Le portail s’ouvre sans effort. Si le besoin change, on recommence.']
  ];
  var pos = [[70, 70], [200, 40], [330, 70], [200, 190]];
  var SHORT = [['Le besoin'], ['Recherche', 'de solutions'], ['Objet', 'technique'], ['Service', 'rendu']];
  var step = 0, t = 0;
  var sl = ui.slider(el, { label: 'Étape du cycle', min: 1, max: 4, value: 1, step: 1, color: AMBER, fmt: function (v) { return v + ' / 4'; } }, function (v) { step = v - 1; paint(); });
  ln(g, 70, 70, 200, 40, 'rgba(255,255,255,.25)', 1.5, '4 4'); ln(g, 200, 40, 330, 70, 'rgba(255,255,255,.25)', 1.5, '4 4'); ln(g, 330, 70, 200, 190, 'rgba(255,255,255,.25)', 1.5, '4 4'); ln(g, 200, 190, 70, 70, 'rgba(255,255,255,.25)', 1.5, '4 4');
  function paint() {
    chips.set(STEPS.map(function (s, i) { return ui.chip((i + 1) + ' · ' + s[0], i === step ? AMBER : 'var(--line)'); }).join(''));
    info.set('<b>' + STEPS[step][0] + '.</b> ' + STEPS[step][1]);
  }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); t += dt;
    pos.forEach(function (p, i) {
      var on = i === step, r = 30 + (on ? 3 * Math.sin(t * 4) : 0);
      S('circle', { cx: p[0], cy: p[1], r: r, style: 'fill:' + (on ? AMBER : BLUE) + ';fill-opacity:' + (on ? .22 : .08) + ';stroke:' + (on ? AMBER : BLUE) + ';stroke-width:' + (on ? 3 : 1.6) }, dyn);
      txt(dyn, p[0], p[1] - 10, String(i + 1), on ? AMBER : BLUE, 'middle', 16, true);
      SHORT[i].forEach(function (w, k) { txt(dyn, p[0], p[1] + 8 + (k - (SHORT[i].length - 1) / 2) * 11, w, '#e8f1f8', 'middle', 9); });
    });
    var a = pos[step], b = pos[(step + 1) % 4], u = (t * .6) % 1;
    S('circle', { cx: a[0] + (b[0] - a[0]) * u, cy: a[1] + (b[1] - a[1]) * u, r: 4, style: 'fill:' + AMBER }, dyn);
    txt(dyn, 200, 126, 'cycle d’un produit', 'rgba(255,255,255,.35)', 'middle', 10);
  });
  paint();
}

function triObjets(el) {
  var svg = ui.stage(el, 400, 220, 'Objet technique ou système technique'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el);
  var ITEMS = [
    ['Ciseaux', 0, 'Objet simple : force de la main.'],
    ['Marteau', 0, 'Un objet technique simple, utilisé directement par la main.'],
    ['Portail automatique', 1, 'Système : énergie, ordres, détection, action.'],
    ['Distributeur de savon', 1, 'Système : un capteur détecte la main, la pompe agit.'],
    ['Stylo bille', 0, 'Un objet technique simple.'],
    ['Lampe à détecteur', 1, 'Système : le détecteur commande l’allumage.'],
    ['Cartable', 0, 'Un objet technique simple.'],
    ['Ascenseur', 1, 'Système : capteurs, commande et moteur coopèrent.']
  ];
  var cur = 0, score = 0, asked = 0, order = PC.shuffle(ITEMS.map(function (_, i) { return i; }));
  var CH = [['Alimenter', 'énergie', 70], ['Acquérir', 'informations', 150], ['Traiter', 'décider', 230], ['Agir', 'action', 310]];
  CH.forEach(function (c, i) { rect(g, c[2] - 32, 100, 64, 44, i === 3 ? AMBER : BLUE, .1, 4, 1.6); txt(g, c[2], 118, c[0], '#fff', 'middle', 10.5, true); txt(g, c[2], 133, c[1], '#9fb8cc', 'middle', 9); if (i < 3) arrow(g, c[2] + 34, 122, CH[i + 1][2] - 34, 122, 'rgba(255,255,255,.4)', 1.6); });
  txt(g, 200, 82, 'Un système technique associe plusieurs fonctions :', '#9fb8cc', 'middle', 10.5);
  var ctl = ui.controls(el), b1, b2;
  function show() {
    if (cur >= order.length) { verd.set('Terminé : ' + score + ' / ' + order.length + '.', score >= 6 ? 'ok' : ''); chips.set(ui.chip('Score ' + score + ' / ' + order.length, AMBER)); b1.hidden = b2.hidden = true; rs.hidden = false; dyn.replaceChildren(); return; }
    chips.set(ui.chip('Objet ' + (cur + 1) + ' / ' + order.length, BLUE) + ui.chip('Score ' + score, AMBER));
    dyn.replaceChildren(); rect(dyn, 110, 14, 180, 42, AMBER, .08, 4, 1.8); txt(dyn, 200, 41, ITEMS[order[cur]][0], '#fff', 'middle', 16, true);
    if (!asked) info.set('Cet objet est-il un <b>objet technique simple</b> ou un <b>système technique</b> ?');
  }
  function answer(sys) {
    if (cur >= order.length) return; var it = ITEMS[order[cur]], ok = (it[1] === 1) === sys;
    if (ok) score++; verd.set(ok ? 'Exact.' : 'Pas tout à fait.', ok ? 'ok' : ''); info.set('<b>' + it[0] + '.</b> ' + it[2]); asked = 1; cur++;
    setTimeout(function () { asked = 0; show(); }, 1300);
  }
  b1 = ui.btn(ctl, 'Objet technique simple', function () { answer(false); });
  b2 = ui.btn(ctl, 'Système technique', function () { answer(true); });
  var rs = ui.btn(ctl, 'Recommencer', function () { cur = 0; score = 0; order = PC.shuffle(order); b1.hidden = b2.hidden = false; rs.hidden = true; verd.set('', ''); show(); }); rs.hidden = true;
  show();
}

PC.chapter({ id: 't2-1', lazy: true, eyebrow: EY2 + 'Module 1 · Modélisation des systèmes techniques', title: 'Besoin, objet technique, système technique', ar: 'الحاجة والشيء التقني والمنظومة',
  lessons: function () { return [
    { short: 'Le besoin', title: 'Du besoin au produit', intro: 'Avance dans le cycle avec le curseur.', build: boucleBesoin,
      retenir: ['Un <b>besoin</b> est une nécessité ressentie.', 'On le satisfait avec un <b>objet technique</b>.'],
      ar: { e: ['الحاجة ضرورة يشعر بها الإنسان، ونلبّيها بشيء تقني يصنعه.'], u: 'حرّك المنزلق.', w: [['besoin', 'حاجة'], ['objet technique', 'شيء تقني']] } },
    { short: 'Système ?', title: 'Objet ou système technique ?', intro: 'Classe huit objets.', build: triObjets,
      retenir: ['Un <b>système technique</b> reçoit énergie et informations, puis <b>agit</b>.', 'Un objet simple (ciseaux) n’a ni capteur ni commande.'],
      ar: { e: ['المنظومة التقنية تتلقى الطاقة والمعلومات ثم تنفّذ فعلا.'], u: 'اختر: شيء بسيط أم منظومة.', w: [['système technique', 'منظومة تقنية'], ['capteur', 'لاقط']] } }
  ]; },
  quiz: [
    { q: 'Un besoin est :', o: ['une nécessité ressentie', 'un objet fabriqué', 'un schéma'], a: 0, e: 'Le besoin vient d’abord ; l’objet technique lui répond.' },
    { q: 'Quel élément est un système technique ?', o: ['un portail automatique', 'un marteau', 'un stylo'], a: 0, e: 'Il reçoit de l’énergie, détecte et agit.' },
    { q: 'Un système technique transforme :', o: ['énergie et informations en action', 'seulement du bois', 'rien'], a: 0, e: 'Il traite énergie et informations pour agir.' },
    { q: 'Les ciseaux sont :', o: ['un objet technique simple', 'un système technique', 'un besoin'], a: 0, e: 'Ils fonctionnent par la force de la main.' }
  ]
});


/* ----- Diagrammes SysML du portail automatique ----- */
function sysmlStage(el, h0, label) { return ui.stage(el, 400, h0, label); }
function casUtilisation(el) {
  var svg = sysmlStage(el, 250, 'Diagramme de cas d’utilisation du portail'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el), verd = ui.verdict(el);
  var A = {
    prop: { x: 52, y: 110, lab: 'Propriétaire', t: 'Acteur <b>principal</b> : il bénéficie du service.', main: true },
    tech: { x: 350, y: 60, lab: 'Technicien', t: 'Acteur <b>secondaire</b> : il assure l’entretien.', main: false },
    elec: { x: 350, y: 160, lab: 'Fournisseur\nd’électricité', t: 'Acteur <b>secondaire</b> : il fournit l’énergie.', main: false }
  };
  S('rect', { x: 118, y: 14, width: 164, height: 222, rx: 4, style: 'fill:none;stroke:#2a4660;stroke-width:1.6' }, g); txt(g, 124, 28, 'Portail automatique', '#9fb8cc', 'start', 9.5, true);
  sUse(g, 200, 125, 70, 40, 'Ouvrir et fermer\nle portail', AMBER);
  var sel = null, hs = {};
  Object.keys(A).forEach(function (k) {
    var a = A[k], gg = S('g', null, g); sActor(gg, a.x, a.y, a.lab.split('\n')[0], BLUE); if (a.lab.indexOf('\n') > 0) txt(gg, a.x, a.y + 44, a.lab.split('\n')[1], '#e8f1f8', 'middle', 10);
    var ex = k === 'prop' ? 130 : 270; var l = ln(g, a.x + (k === 'prop' ? 14 : -14), a.y - 4, ex, 125, '#9fb8cc', 1.6); hs[k] = [gg, l];
    var hit = S('rect', { x: a.x - 34, y: a.y - 32, width: 68, height: 76, style: 'fill:transparent' }, g); hot(hit, function () { pick(k); }, A[k].lab.replace('\n', ' '));
  });
  var mode = 'explorer', q = 0, QS = [['Touche l’acteur principal, celui qui bénéficie du service.', function (k) { return A[k].main; }], ['Touche un acteur secondaire.', function (k) { return !A[k].main; }]];
  function pick(k) {
    sel = k; Object.keys(hs).forEach(function (j) { hs[j][0].style.opacity = j === k ? 1 : .45; hs[j][1].style.stroke = j === k ? AMBER : '#9fb8cc'; hs[j][1].style.strokeWidth = j === k ? 3 : 1.6; });
    if (mode === 'explorer') { info.set('<b>' + A[k].lab.replace('\n', ' ') + '.</b> ' + A[k].t); return; }
    var ok = QS[q][1](k); verd.set(ok ? 'Exact : ' + A[k].lab.replace('\n', ' ') + '.' : 'Non. Regarde où est placé l’acteur et ce qu’il fait.', ok ? 'ok' : '');
    if (ok) { q++; setTimeout(function () { if (q >= QS.length) { info.set('Bravo : tu sais distinguer l’acteur principal des acteurs secondaires.'); verd.set('Défi terminé.', 'ok'); } else info.set(QS[q][0]); }, 900); }
  }
  ui.tabs(el, [['explorer', 'Explorer'], ['defi', 'Défi']], function (k) {
    mode = k; q = 0; verd.set('', ''); Object.keys(hs).forEach(function (j) { hs[j][0].style.opacity = 1; hs[j][1].style.stroke = '#9fb8cc'; hs[j][1].style.strokeWidth = 1.6; });
    info.set(k === 'explorer' ? 'Touche un acteur. Besoin : <b>ouvrir et fermer sans effort</b>.' : QS[0][0]);
  });
  info.set('Touche un acteur. Besoin : <b>ouvrir et fermer sans effort</b>.');
}

function contexte(el) {
  var svg = sysmlStage(el, 260, 'Diagramme de contexte du portail'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el);
  var E = [
    ['Propriétaire', 8, 20, 'Il commande avec une télécommande.', BLUE],
    ['Véhicule\nou piéton', 8, 113, 'Il traverse : il faut le détecter.', BLUE],
    ['Technicien', 8, 206, 'Il règle et répare.', BLUE],
    ['Réseau\nélectrique', 280, 20, 'Il alimente le système.', AMBER],
    ['Intempéries', 280, 113, 'Pluie, vent, soleil : le portail doit y résister.', GREEN],
    ['Sol et rail', 280, 206, 'Support du portail en mouvement.', GREEN]
  ];
  var sysx = 150, sysy = 98, sysw = 100, sysh = 64, boxes = [];
  E.forEach(function (e, i) {
    var cx = e[1] + 56, cy = e[2] + 17, ex = e[1] < 100 ? e[1] + 112 : e[1], ey = cy, sx = e[1] < 100 ? sysx : sysx + sysw, sy = sysy + sysh / 2 + (i % 3 - 1) * 18;
    var l = ln(g, ex, ey, sx, sy, '#9fb8cc', 1.5);
    var r = S('rect', { x: e[1], y: e[2], width: 112, height: 34, rx: 4, style: 'fill:' + e[4] + ';fill-opacity:.10;stroke:' + e[4] + ';stroke-width:1.6' }, g);
    var L = e[0].split('\n'); L.forEach(function (s, k) { txt(g, cx, cy + 4 + (k - (L.length - 1) / 2) * 11, s, '#fff', 'middle', 10); });
    var hit = S('rect', { x: e[1], y: e[2], width: 112, height: 34, style: 'fill:transparent' }, g);
    hot(hit, function () {
      boxes.forEach(function (b) { b[0].style.strokeWidth = 1.6; b[1].style.stroke = '#9fb8cc'; b[1].style.strokeWidth = 1.5; }); r.style.strokeWidth = 3.5; l.style.stroke = AMBER; l.style.strokeWidth = 3;
      info.set('<b>' + e[0].replace('\n', ' ') + '.</b> ' + e[3]);
    }, e[0].replace('\n', ' ')); boxes.push([r, l]);
  });
  sBox(g, sysx, sysy, sysw, sysh, 'block', 'Portail\nautomatique'.split('\n')[0], AMBER, ['système étudié']);
  txt(g, sysx + sysw / 2, sysy + 49, 'automatique', '#fff', 'middle', 10, true);
  info.set('Le système au centre, son environnement autour. Touche un élément.');
  var QU = [
    { q: 'La pluie fait-elle partie de l’environnement du portail ?', o: ['Oui', 'Non'], a: 0, e: 'Le portail doit y résister : c’est le milieu extérieur.' },
    { q: 'Le moteur du portail est-il dans l’environnement ?', o: ['Oui', 'Non'], a: 1, e: 'Le moteur fait partie du système lui-même.' },
    { q: 'Le réseau électrique est-il dans l’environnement ?', o: ['Oui', 'Non'], a: 0, e: 'Il échange de l’énergie avec le système sans en faire partie.' },
    { q: 'Le pignon est-il dans l’environnement ?', o: ['Oui', 'Non'], a: 1, e: 'Le pignon est un composant du système.' }
  ];
  ui.quiz(el, QU);
}

function exigencesPortail(el) {
  var svg = sysmlStage(el, 312, 'Diagramme des exigences du portail'), g = S('g', null, svg);
  var info = ui.info(el);
  var R = {
    '1': { t: 'Ouvrir et fermer le portail automatiquement.', n: 'Fonctionnalité', x: 120, y: 8, w: 160, ht: 40 },
    '1.1': { s: 'Alimenter', t: 'Alimenter le système en énergie.', n: 'Fonctionnalité', x: 6, y: 86, w: 90, ht: 52 },
    '1.2': { s: 'Détecter', t: 'Détecter un obstacle sur le passage.', n: 'Fonctionnalité', x: 106, y: 86, w: 90, ht: 52 },
    '1.3': { s: 'Signaler', t: 'Signaler le mouvement du portail.', n: 'Fonctionnalité', x: 206, y: 86, w: 90, ht: 52 },
    '1.4': { s: 'Commuter', t: 'Commander le moteur (marche, arrêt).', n: 'Fonctionnalité', x: 306, y: 86, w: 90, ht: 52 },
    '1.5': { s: 'Temporiser', t: 'Refermer le portail seul au bout de 30 s.', n: 'Fonctionnalité', x: 56, y: 176, w: 100, ht: 52 },
    '1.6': { s: 'Transmettre', t: 'Transmettre le mouvement du moteur au portail.', n: 'Fonctionnalité', x: 246, y: 176, w: 100, ht: 52 },
    '1.6.1': { s: 'Vitesse', t: 'La vitesse du portail doit rester inférieure à 0,2 m/s.', n: 'Contrainte', x: 246, y: 250, w: 100, ht: 44 }
  };
  var parents = { '1.1': '1', '1.2': '1', '1.3': '1', '1.4': '1', '1.5': '1', '1.6': '1' };
  ln(g, 200, 48, 200, 66, '#9fb8cc', 1.5); ln(g, 51, 66, 351, 66, '#9fb8cc', 1.5);
  Object.keys(parents).forEach(function (k) { var b = R[k]; ln(g, b.x + b.w / 2, 66, b.x + b.w / 2, b.y, '#9fb8cc', 1.5); });
  circ(g, 200, 57, 7, '#9fb8cc', .15, 1.6); ln(g, 195, 57, 205, 57, '#cfe3f2', 1.5); ln(g, 200, 52, 200, 62, '#cfe3f2', 1.5);
  sLink(g, 296, 250, 296, 228, 'refine', AMBER);
  var boxes = {};
  Object.keys(R).forEach(function (k) {
    var r = R[k], c = r.n === 'Contrainte' ? RED : BLUE, gg = S('g', null, g);
    S('rect', { x: r.x, y: r.y, width: r.w, height: r.ht, rx: 3, style: 'fill:#0d1620;stroke:' + c + ';stroke-width:1.8' }, gg);
    txt(gg, r.x + r.w / 2, r.y + 12, '« requirement »', c, 'middle', 7.5); txt(gg, r.x + r.w / 2, r.y + 25, 'Id = ' + k, '#fff', 'middle', 9, true); if (r.s) txt(gg, r.x + r.w / 2, r.y + 38, r.s, '#b7c9d8', 'middle', 9);
    hot(S('rect', { x: r.x, y: r.y, width: r.w, height: r.ht, style: 'fill:transparent' }, g), function () {
      Object.keys(boxes).forEach(function (j) { boxes[j].firstChild.style.strokeWidth = 1.8; }); gg.firstChild.style.strokeWidth = 4;
      info.set('<b>Exigence ' + k + '.</b> ' + r.t + '<br><b>Nature :</b> ' + r.n + (r.n === 'Contrainte' ? ' (une limite à respecter)' : ' (ce que le système doit faire)') + (parents[k] ? '<br><b>Liaison :</b> contenue dans l’exigence 1 (⊕).' : (k === '1.6.1' ? '<br><b>Liaison :</b> raffine l’exigence 1.6 (« refine »).' : ''))); 
    }, 'Exigence ' + k); boxes[k] = gg;
  });
  info.set('Touche une exigence : fonctionnalité ou contrainte ?');
  ui.quiz(el, [
    { q: 'L’exigence « La vitesse doit rester inférieure à 0,2 m/s » est :', o: ['une contrainte', 'une fonctionnalité'], a: 0, e: 'C’est une limite à respecter.' },
    { q: 'L’exigence « Détecter un obstacle » est :', o: ['une fonctionnalité', 'une contrainte'], a: 0, e: 'C’est ce que le système doit faire.' },
    { q: 'La liaison portant le signe ⊕ s’appelle :', o: ['la contenance', 'la satisfaction', 'l’association'], a: 0, e: 'Une exigence en contient d’autres.' },
    { q: 'La liaison « refine » :', o: ['précise une exigence', 'relie un bloc à une exigence', 'relie deux acteurs'], a: 0, e: 'L’exigence 1.6.1 précise l’exigence 1.6.' }
  ]);
}

function blocsPortail(el) {
  var svg = sysmlStage(el, 270, 'Diagramme de définition des blocs du portail'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el);
  var B = [
    ['Alimentation', 'Transformateur 24 V\n+ batterie', 6, 100, '1.1', 'Alimenter le système en énergie.'],
    ['Détecteur', 'Cellule\nphotoélectrique', 140, 100, '1.2', 'Détecter un obstacle sur le passage.'],
    ['Signalisation', 'Lampe\nclignotante', 274, 100, '1.3', 'Signaler le mouvement du portail.'],
    ['Commande', 'Relais\n(commutation)', 6, 190, '1.4', 'Commander le moteur.'],
    ['Temporisateur', 'Circuit RC\n(30 s)', 140, 190, '1.5', 'Refermer le portail seul au bout de 30 s.'],
    ['Motoréducteur', 'Moteur + pignon\n+ crémaillère', 274, 190, '1.6', 'Transmettre le mouvement du moteur au portail.']
  ];
  var queue = [], done = {}, mode = 'explorer', boxes = [];
  B.forEach(function (b) { ln(g, 200, 46, b[2] + 60, b[3] > 150 ? b[3] - 8 : b[3], '#9fb8cc', 1.4); });
  B.forEach(function (b, i) {
    var cx = b[2] + 60;
    var gg = S('g', null, g);
    S('rect', { x: b[2], y: b[3] - (b[3] > 150 ? 8 : 0), width: 120, height: 56, rx: 3, style: 'fill:#0d1620;stroke:' + BLUE + ';stroke-width:1.8' }, gg);
    txt(gg, cx, b[3] + 10 - (b[3] > 150 ? 8 : 0), '« block »', BLUE, 'middle', 7.5); txt(gg, cx, b[3] + 22 - (b[3] > 150 ? 8 : 0), b[0], '#fff', 'middle', 10, true);
    b[1].split('\n').forEach(function (s, k) { txt(gg, cx, b[3] + 35 + k * 9 - (b[3] > 150 ? 8 : 0), s, '#b7c9d8', 'middle', 8.5); });
    var hit = S('rect', { x: b[2], y: b[3] - (b[3] > 150 ? 8 : 0), width: 120, height: 54, style: 'fill:transparent' }, g); hot(hit, function () { pick(i); }, b[0]); boxes.push(gg);
  });
  sBox(g, 130, 8, 140, 38, 'block', 'Portail automatique', AMBER);
  function paint() {
    if (mode === 'explorer') { chips.set(ui.chip('6 blocs', BLUE)); return; }
    chips.set(queue.length ? ui.chip('Exigence à satisfaire : ' + B[queue[0]][4] + ' · ' + B[queue[0]][5], AMBER) + ui.chip('Restants : ' + queue.length, BLUE) : ui.chip('Associations terminées', GREEN));
  }
  function pick(i) {
    if (mode === 'explorer') { boxes.forEach(function (x) { x.firstChild.style.strokeWidth = 1.8; }); boxes[i].firstChild.style.strokeWidth = 4; info.set('<b>' + B[i][0] + '</b> (' + B[i][1].replace('\n', ' ') + ') satisfait l’exigence <b>' + B[i][4] + '</b> : ' + B[i][5]); return; }
    if (!queue.length) return;
    if (queue[0] === i) { queue.shift(); boxes[i].firstChild.style.stroke = GREEN; boxes[i].firstChild.style.strokeWidth = 3.5; verd.set('Exact : « satisfy ».', 'ok'); info.set('Le bloc <b>' + B[i][0] + '</b> satisfait l’exigence ' + B[i][4] + '.'); paint(); }
    else { verd.set('Ce bloc ne satisfait pas cette exigence.', ''); }
  }
  ui.tabs(el, [['explorer', 'Explorer'], ['associer', 'Associer']], function (k) {
    mode = k; verd.set('', ''); boxes.forEach(function (x) { x.firstChild.style.stroke = BLUE; x.firstChild.style.strokeWidth = 1.8; });
    if (k === 'associer') { queue = PC.shuffle([0, 1, 2, 3, 4, 5]); info.set('Touche le <b>bloc</b> qui satisfait l’exigence affichée.'); } else info.set('Les blocs sont les solutions techniques. Touche un bloc.');
    paint();
  });
  info.set('Les blocs sont les solutions techniques. Touche un bloc.'); paint();
}

PC.chapter({ id: 't2-2', lazy: true, eyebrow: EY2 + 'Module 1 · Modélisation des systèmes techniques', title: 'Lire les diagrammes SysML : le portail', ar: 'قراءة مخططات SysML: البوابة',
  lessons: function () { return [
    { short: 'Cas d’utilisation', title: 'Cas d’utilisation', intro: 'Touche les acteurs.', build: casUtilisation,
      retenir: ['<b>Acteur principal</b> : il bénéficie du service (à gauche).', '<b>Acteur secondaire</b> : il aide à le rendre (à droite).'],
      ar: { e: ['الفاعل الرئيسي يستفيد من الخدمة (يسارا)، والثانوي يساهم فيها (يمينا).'], u: 'المس فاعلا.', w: [['acteur principal', 'فاعل رئيسي'], ['acteur secondaire', 'فاعل ثانوي']] } },
    { short: 'Contexte', title: 'Contexte', intro: 'Qu’y a-t-il autour du système ?', build: contexte,
      retenir: ['Le diagramme de <b>contexte</b> montre l’<b>environnement</b> du système.', 'Le moteur est dans le système ; la pluie est dans l’environnement.'],
      ar: { e: ['مخطط السياق يبيّن محيط المنظومة: ما يتبادل معها دون أن يكون جزءا منها.'], u: 'المس عنصرا.', w: [['environnement', 'محيط'], ['contexte', 'سياق']] } },
    { short: 'Exigences', title: 'Exigences', intro: 'Fonctionnalité ou contrainte ?', build: exigencesPortail,
      retenir: ['<b>Fonctionnalité</b> : ce que le système fait. <b>Contrainte</b> : une limite.', 'Liens : contenance ⊕, raffinement « refine ».'],
      ar: { e: ['المتطلّب إما وظيفة تؤديها المنظومة أو قيد يجب احترامه.'], u: 'المس متطلبا.', w: [['fonctionnalité', 'وظيفة'], ['contrainte', 'قيد']] } },
    { short: 'Blocs', title: 'Définition des blocs', intro: 'Associe chaque bloc à son exigence.', build: blocsPortail,
      retenir: ['Un <b>bloc</b> est une solution technique.', 'Il <b>satisfait</b> une exigence (« satisfy »).'],
      ar: { e: ['الكتلة حل تقني، وهي تحقّق متطلبا (satisfy).'], u: 'المس الكتلة المناسبة.', w: [['bloc', 'كتلة'], ['satisfaire', 'يحقّق']] } }
  ]; },
  quiz: [
    { q: 'Qui bénéficie du service rendu par le portail ?', o: ['l’acteur principal', 'un acteur secondaire', 'le sol'], a: 0, e: 'Le propriétaire est l’acteur principal.' },
    { q: 'Quel diagramme donne les solutions techniques ?', o: ['définition des blocs', 'contexte', 'cas d’utilisation'], a: 0, e: 'Les blocs sont les solutions techniques.' },
    { q: 'Quel diagramme montre l’environnement du système ?', o: ['le diagramme de contexte', 'le diagramme des exigences', 'aucun'], a: 0, e: 'Le contexte recense ce qui entoure le système.' },
    { q: 'Quel bloc satisfait « Détecter un obstacle » ?', o: ['la cellule photoélectrique', 'le moteur', 'la batterie'], a: 0, e: 'La cellule photoélectrique détecte le passage.' }
  ]
});

