/* ===================================================== JEUX D'ÉVASION (3e année, un par module)
   Quatre énigmes tirées du cours ; chacune allume un voyant et révèle un chiffre du code. Les quatre chiffres ouvrent la porte.
   Erreur : +10 s. Indice : +20 s. Étoiles selon le temps et les indices. */
function escGame(el, cfg) {
  var svg = ui.stage(el, 400, 236, cfg.title), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el);
  var qbox = h('div', { 'class': 'esc-q' }); el.appendChild(qbox);
  var step = 0, t0 = null, pen = 0, hints = 0, open = 0, shake = 0, done = false, solved = [], best = jeuxGet('tech_esc_' + cfg.id, 0), now = 0, wrong = 0;
  function reset() { step = 0; t0 = null; pen = 0; hints = 0; open = 0; shake = 0; done = false; solved = []; wrong = 0; info.set(cfg.story); chips.set(''); render(); }
  function fmt2(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60); }
  function start() { if (t0 === null) t0 = performance.now(); }
  function good(P) {
    solved.push(P.d); step++; info.set('<b>✓ Voyant ' + step + ' allumé.</b> ' + P.e);
    if (step >= cfg.p.length) {
      done = true; var secs = Math.round(now + pen), st = secs <= 100 && !hints && !wrong ? '★★★' : (secs <= 200 ? '★★☆' : '★☆☆');
      if (!best || secs < best) { best = secs; jeuxSet('tech_esc_' + cfg.id, best); }
      info.set('<b>' + st + ' Porte ouverte en ' + fmt2(secs) + '.</b> Code : <b>' + solved.join(' ') + '</b>. ' + cfg.win);
    }
    chipsRefresh(); render();
  }
  function bad(P) { wrong++; pen += 10; shake = .5; info.set('<b>✗ Non.</b> +10 s. Relis la question' + (P.hint ? ' ou demande un indice.' : '.')); chipsRefresh(); }
  function chipsRefresh() { chips.set(ui.chip('Énigme ' + Math.min(step + 1, cfg.p.length) + '/' + cfg.p.length, BLUE) + ui.chip('Pénalités : ' + pen + ' s', pen ? RED : '#9fb8cc', !pen) + ui.chip('Meilleur : ' + (best ? fmt2(best) : '—'), '#9fb8cc', true)); }
  function render() {
    qbox.replaceChildren(); chipsRefresh();
    if (done) { qbox.appendChild(h('button', { 'class': 'btn', type: 'button' }, 'Rejouer')).addEventListener('click', reset); return; }
    var P = cfg.p[step];
    qbox.appendChild(h('div', { 'class': 'esc-qt' }, '<b>' + (step + 1) + '.</b> ' + P.q));
    if (P.ar) qbox.appendChild(h('div', { 'class': 'esc-ar', dir: 'rtl', lang: 'ar' }, P.ar));
    var row = h('div', { 'class': 'esc-opts' }); qbox.appendChild(row);
    if (P.o) {
      P.o.forEach(function (t, i) { var b = h('button', { 'class': 'btn', type: 'button' }, t); b.addEventListener('click', function () { start(); if (i === P.a) good(P); else bad(P); }); row.appendChild(b); });
    } else {
      var inp = h('input', { type: 'text', inputmode: 'numeric', 'aria-label': 'Ta réponse', 'class': 'esc-in', maxlength: 6 }); row.appendChild(inp);
      var ok = h('button', { 'class': 'btn', type: 'button' }, 'Valider'); row.appendChild(ok);
      function go() { start(); var v = parseFloat(String(inp.value).replace(',', '.')); if (isNaN(v)) { info.set('Écris un nombre.'); return; } if (Math.abs(v - P.a) < 1e-9) good(P); else bad(P); }
      ok.addEventListener('click', go); inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    }
    if (P.hint) { var hb = h('button', { 'class': 'btn ghost', type: 'button' }, 'Indice (+20 s)'); hb.addEventListener('click', function () { start(); hints++; pen += 20; info.set('<b>Indice.</b> ' + P.hint); chipsRefresh(); }); row.appendChild(hb); }
  }
  PC.anim(svg, function (dt, t) {
    dyn.replaceChildren(); if (t0 !== null && !done) now = (performance.now() - t0) / 1000;
    if (done) open = Math.min(1, open + dt * .7); if (shake > 0) shake -= dt;
    var sx = shake > 0 ? Math.sin(t * 60) * 4 : 0;
    S('rect', { x: 8, y: 8, width: 384, height: 220, rx: 10, style: 'fill:#0a121b;stroke:#2a4660;stroke-width:1.6' }, dyn);
    txt(dyn, 22, 26, cfg.title, '#9fb8cc', 'start', 10.5, true); txt(dyn, 340, 26, fmt2(now + pen), pen ? RED : AMBER, 'end', 12, true);
    /* lumière derrière la porte */
    if (open > 0) S('rect', { x: 130, y: 62, width: 140, height: 150, style: 'fill:#fff2b8;fill-opacity:' + (.25 + .5 * open) }, dyn);
    var gap = 70 * open;
    [[130 - gap, 1], [200 + gap, 2]].forEach(function (d) { S('rect', { x: d[0] + sx, y: 62, width: 70, height: 150, rx: 3, style: 'fill:#16283a;stroke:' + (done ? GREEN : BLUE) + ';stroke-width:2.2' }, dyn); ln(dyn, d[0] + sx + 12, 74, d[0] + sx + 58, 74, '#2a4660', 2); ln(dyn, d[0] + sx + 12, 200, d[0] + sx + 58, 200, '#2a4660', 2); });
    circ(dyn, 192 - gap + sx, 140, 3.5, AMBER, 1, 0); circ(dyn, 208 + gap + sx, 140, 3.5, AMBER, 1, 0);
    /* quatre voyants et chiffres */
    for (var i = 0; i < cfg.p.length; i++) {
      var x = 66 + i * 90, on = i < solved.length, c = on ? GREEN : '#37536b';
      if (i < 2) { x = 40 + i * 50; } else { x = 290 + (i - 2) * 50; }
      circ(dyn, x + 0, 100, 13, c, on ? .5 : .12, 2.2);
      S('rect', { x: x - 17, y: 124, width: 34, height: 40, rx: 6, style: 'fill:#04080c;stroke:' + c + ';stroke-width:1.6' }, dyn);
      txt(dyn, x, 152, on ? String(solved[i]) : '?', on ? GREEN : '#37536b', 'middle', 22, true); txt(dyn, x, 104, String(i + 1), on ? INK : '#6f8aa0', 'middle', 11, true);
    }
    txt(dyn, 200, 52, done ? 'OUVERT' : 'VERROUILLÉ', done ? GREEN : RED, 'middle', 12, true);
    txt(dyn, 200, 222, done ? 'Bravo !' : 'Résous les énigmes : chaque bonne réponse allume un voyant', '#6f8aa0', 'middle', 9);
  });
  reset();
}

var ESC_M1 = {
  id: 'm1', title: 'Évasion · Systèmes techniques', story: 'La barrière du lycée est bloquée. Résous quatre énigmes pour déverrouiller le boîtier de commande.',
  win: 'Tu sais distinguer l’information et l’énergie dans un système.',
  p: [
    { q: 'Dans la chaîne d’information, quel élément <b>traite</b> les données des capteurs ?', ar: 'من يعالج معطيات الملتقطات؟', o: ['La carte programmable', 'Le moteur', 'La batterie'], a: 0, d: 4, e: 'La carte programmable décide.', hint: 'Acquérir → traiter → communiquer.' },
    { q: 'Combien de fonctions compte la <b>chaîne d’énergie</b> (alimenter, distribuer, convertir, transmettre, agir) ?', ar: 'كم وظيفة في سلسلة الطاقة؟', a: 5, d: 1, e: 'Cinq fonctions.', hint: 'Compte les cinq verbes de la question.' },
    { q: 'Le moteur de la barrière appartient à la fonction…', ar: 'المحرك يقوم بوظيفة…', o: ['Alimenter', 'Convertir', 'Communiquer'], a: 1, d: 7, e: 'Il convertit l’énergie électrique en mouvement.', hint: 'Électrique → mécanique.' },
    { q: 'Combien de fonctions compte la <b>chaîne d’information</b> ?', ar: 'كم وظيفة في سلسلة المعلومات؟', a: 3, d: 2, e: 'Acquérir, traiter, communiquer.', hint: 'Capteur, carte, afficheur.' }
  ]
};
var ESC_M2 = {
  id: 'm2', title: 'Évasion · Information', story: 'La station météo du collège est verrouillée. Prouve que tu comprends les capteurs et le codage.',
  win: 'Tu sais choisir un capteur et décoder une information.',
  p: [
    { q: 'Pour mesurer une température qui varie, on choisit un capteur…', ar: 'لقياس درجة حرارة متغيرة نختار ملتقطا…', o: ['analogique', 'tout ou rien', 'un simple bouton'], a: 0, d: 6, e: 'Il donne une valeur qui varie.', hint: 'On veut une valeur, pas seulement oui ou non.' },
    { q: 'Un octet contient combien de bits ?', ar: 'كم بتّا في البايت؟', a: 8, d: 3, e: 'Un octet = 8 bits.', hint: 'Pense à 0 ou 1 répété.' },
    { q: 'Le buzzer relève de quelle fonction ?', ar: 'الجرس يقوم بوظيفة…', o: ['Acquérir', 'Traiter', 'Communiquer'], a: 2, d: 9, e: 'Il communique une alerte à l’utilisateur.', hint: 'Il avertit la personne.' },
    { q: 'Un capteur donne 0 à 5 V. À <b>2,5 V</b>, quelle est la fraction de la plage, <b>en dixièmes</b> ?', ar: 'عند 2٫5 فولت، ما الكسر من المجال بالأعشار؟', a: 5, d: 0, e: '2,5 / 5 = 0,5, soit 5 dixièmes.', hint: 'Divise 2,5 par 5.' }
  ]
};
var ESC_M3 = {
  id: 'm3', title: 'Évasion · Énergie et mouvement', story: 'L’atelier est fermé : la perceuse ne démarre plus. Réponds pour récupérer la clé électronique.',
  win: 'Tu sais suivre l’énergie de la batterie jusqu’au mouvement.',
  p: [
    { q: 'Une perceuse de <b>60 W</b> est alimentée en <b>12 V</b>. Quel courant (en A) ?', ar: 'ما شدة التيار (أمبير)؟', a: 5, d: 8, e: 'I = P / U = 60 / 12 = 5 A.', hint: 'I = P ÷ U.' },
    { q: 'Quel composant protège un circuit en cas de surintensité ?', ar: 'أي مكوّن يحمي الدارة من فرط التيار؟', o: ['Le fusible', 'L’interrupteur', 'La LED'], a: 0, d: 2, e: 'Le fusible fond et coupe le courant.', hint: 'Il se sacrifie.' },
    { q: 'Un moteur tourne à <b>3 000 tr/min</b> ; le réducteur a un rapport <b>10 : 1</b>. Vitesse de sortie en <b>centaines</b> de tr/min ?', ar: 'سرعة الخرج بالمئات من الدورات في الدقيقة؟', a: 3, d: 5, e: '3 000 / 10 = 300 tr/min.', hint: 'Divise par 10.' },
    { q: 'Un vérin pneumatique transforme l’air comprimé en…', ar: 'الرافعة الهوائية تحوّل الهواء المضغوط إلى…', o: ['mouvement linéaire', 'rotation continue', 'lumière'], a: 0, d: 1, e: 'La tige sort et rentre en ligne droite.', hint: 'La tige va et vient.' }
  ]
};
var ESC_M4 = {
  id: 'm4', title: 'Évasion · Dessin technique', story: 'Le plan de la pièce est verrouillé dans le bureau d’études. Lis le dessin pour trouver le code.',
  win: 'Tu sais lire vues, traits et échelle.',
  p: [
    { q: 'Une pièce de <b>40 mm</b> est dessinée à l’échelle <b>1 : 2</b>. Combien mesure-t-elle sur le dessin, <b>en cm</b> ?', ar: 'كم يقيس رسمها بالسنتيمتر؟', a: 2, d: 7, e: '40 / 2 = 20 mm = 2 cm.', hint: '1 : 2 veut dire deux fois plus petit.' },
    { q: 'Combien de vues compte la projection orthogonale usuelle (face, dessus, gauche) ?', ar: 'كم منظرا في الإسقاط العمودي المعتاد؟', a: 3, d: 4, e: 'Trois vues.', hint: 'Face, dessus et gauche.' },
    { q: 'Quel trait représente les <b>arêtes cachées</b> ?', ar: 'أي خط يمثل الحروف المخفية؟', o: ['Trait continu fort', 'Trait interrompu fin', 'Trait mixte fin'], a: 1, d: 0, e: 'Des tirets : on ne les voit pas.', hint: 'Elles sont cachées : le trait est lui aussi « caché » par des vides.' },
    { q: 'Quel trait représente un <b>axe de symétrie</b> ?', ar: 'أي خط يمثل محور التماثل؟', o: ['Trait continu fort', 'Trait mixte fin', 'Trait interrompu fin'], a: 1, d: 6, e: 'Point-tiret fin.', hint: 'Il alterne long trait et point.' }
  ]
};
var ESC_M5 = {
  id: 'm5', title: 'Évasion · Énergies', story: 'Le centre de contrôle du réseau électrique est verrouillé. Montre que tu connais les énergies du Maroc.',
  win: 'Tu sais calculer une énergie et reconnaître une source renouvelable.',
  p: [
    { q: 'Le parc de Tarfaya a <b>131 éoliennes de 2,3 MW</b>, soit environ 301 MW. Quel est le chiffre des <b>centaines</b> ?', ar: 'ما رقم المئات في 301؟', a: 3, d: 9, e: '301 MW : le chiffre des centaines est 3.', hint: '131 × 2,3 ≈ 301.' },
    { q: 'Laquelle est une énergie <b>non renouvelable</b> ?', ar: 'أيّ طاقة غير متجددة؟', o: ['Le vent', 'Le gaz naturel', 'L’eau d’un barrage'], a: 1, d: 3, e: 'Le gaz est un stock limité.', hint: 'Elle est fossile.' },
    { q: 'Une lampe de <b>10 W</b> reste allumée <b>100 h</b>. Énergie consommée en <b>kWh</b> ?', ar: 'كم كيلواط ساعة؟', a: 1, d: 5, e: '10 W × 100 h = 1 000 Wh = 1 kWh.', hint: 'E = P × t, puis 1 000 Wh = 1 kWh.' },
    { q: 'Quelle part d’électricité renouvelable le Maroc vise-t-il en 2030 ?', ar: 'ما نسبة الكهرباء المتجددة المستهدفة في 2030؟', o: ['25 %', '52 %', '80 %'], a: 1, d: 2, e: 'L’objectif est 52 %.', hint: 'Un peu plus de la moitié.' }
  ]
};
[['t3-1', ESC_M1, 'Module 1'], ['t3-4', ESC_M2, 'Module 2'], ['t3-9', ESC_M3, 'Module 3'], ['t3-10', ESC_M4, 'Module 4'], ['t3-14', ESC_M5, 'Module 5']].forEach(function (x) {
  PC.extra(x[0], [{
    short: 'Évasion', title: 'Jeu d’évasion · ' + x[2], intro: 'Quatre énigmes pour ouvrir la porte : le plus vite, sans erreur ni indice.',
    build: function (el) { escGame(el, x[1]); },
    retenir: ['Chaque énigme reprend une idée du module : relis la leçon si tu bloques.', 'Une erreur ajoute <b>10 s</b>, un indice <b>20 s</b>.'],
    ar: { e: ['أربعة ألغاز من درس الوحدة. كل جواب صحيح يضيء مصباحا ويكشف رقما، وعند الانتهاء تفتح الباب. الخطأ يضيف 10 ثوانٍ والتلميح 20 ثانية.'], u: 'اختر الجواب أو اكتب رقما ثم اضغط «Valider».', w: [['énigme', 'لغز'], ['indice', 'تلميح'], ['code', 'رمز'], ['verrouillé', 'مقفل']] }
  }]);
});
