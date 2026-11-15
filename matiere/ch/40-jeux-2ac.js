/* ===================================================== JEUX ET ÉVASION (2e année)
   Code couleurs (fabrique la résistance), tri express (bien/service, tout ou rien/analogique),
   chrono-défi (circuit imprimé, mini-entreprise) et quatre jeux d'évasion. Les moteurs viennent de 38-jeux.js et 39-evasion.js. */

/* ---------- Code couleurs : fabrique la résistance demandée ---------- */
var RES_COL = [['noir', '#1b1b1b'], ['marron', '#7b4a2a'], ['rouge', '#e04a4a'], ['orange', '#ff9a2e'], ['jaune', '#ffd93d'], ['vert', '#3fb950'], ['bleu', '#3b7dff'], ['violet', '#9b5de5'], ['gris', '#8d99a6'], ['blanc', '#f2f2f2']];
var RES_POOL = [[100, 1, 0, 1], [150, 1, 5, 1], [220, 2, 2, 1], [330, 3, 3, 1], [470, 4, 7, 1], [680, 6, 8, 1], [1000, 1, 0, 2], [2200, 2, 2, 2], [4700, 4, 7, 2], [10000, 1, 0, 3]];
function resFmt(v) { return v >= 1000 ? fm(v / 1000, v % 1000 ? 1 : 0) + ' kΩ' : v + ' Ω'; }
function jeuResistance(el) {
  var svg = ui.stage(el, 400, 250, 'Code couleurs'), dyn = S('g', null, svg), hit = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), ctl = ui.controls(el);
  var BX = [132, 170, 208], deck, qi, sel, bands, errs, t0, now, done, best = jeuxGet('tech_cc_best', 0);
  function val() { return bands[0] === null || bands[1] === null || bands[2] === null ? null : (bands[0] * 10 + bands[1]) * Math.pow(10, bands[2]); }
  function ask() { var T = deck[qi]; bands = [null, null, null]; sel = 0; info.set('<b>Fabrique ' + resFmt(T[0]) + '</b> (' + (qi + 1) + '/5). Touche la bande à régler, puis une couleur. Aide : bandes 1 et 2 = chiffres, bande 3 = nombre de zéros.'); paint(); }
  function paint() { chips.set(ui.chip('Résistance ' + Math.min(qi + 1, 5) + '/5', BLUE) + ui.chip('Erreurs : ' + errs, errs ? RED : '#9fb8cc', !errs) + ui.chip('Meilleur : ' + (best ? best + ' s' : '—'), '#9fb8cc', true)); }
  function init() { deck = jeuxShuffle(RES_POOL).slice(0, 5); qi = 0; errs = 0; t0 = null; now = 0; done = false; ask(); }
  function put(c) {
    if (done) return; if (t0 === null) t0 = performance.now(); bands[sel] = c; sel = Math.min(2, sel + 1);
    var v = val(); if (v !== null) info.set('<b>Tu as fabriqué ' + resFmt(v) + '.</b> Il faut ' + resFmt(deck[qi][0]) + '. Touche Valider si c’est bon.');
  }
  ui.btn(ctl, 'Valider', function () {
    if (done) return; var v = val(), T = deck[qi];
    if (v === null) { info.set('Choisis une couleur pour chacune des trois bandes.'); return; }
    if (v === T[0]) {
      qi++; if (qi >= 5) { done = true; var secs = Math.round(now), st = errs <= 1 ? '★★★' : (errs <= 3 ? '★★☆' : '★☆☆'); if (!best || secs < best) { best = secs; jeuxSet('tech_cc_best', best); } info.set('<b>' + st + ' Cinq résistances en ' + secs + ' s.</b> Tu sais lire le code couleurs.'); paint(); }
      else { info.set('<b>✓ Exact.</b> Suivante.'); var keep = info; ask(); keep.set('<b>✓ Exact.</b> Suivante : <b>fabrique ' + resFmt(deck[qi][0]) + '</b> (' + (qi + 1) + '/5).'); }
    } else { errs++; info.set('<b>✗ Non :</b> tes bandes donnent ' + resFmt(v) + '. Rappel : (bande 1)(bande 2) puis autant de zéros que la bande 3.'); paint(); }
  });
  ui.btn(ctl, 'Recommencer', init);
  BX.forEach(function (x, i) { var r = S('rect', { x: x - 14, y: 92, width: 28, height: 66, tabindex: 0, role: 'button', 'aria-label': 'Bande ' + (i + 1), style: 'touch-action:manipulation;cursor:pointer;fill:#fff;fill-opacity:0' }, hit); function go() { if (!done) sel = i; } r.addEventListener('pointerdown', function (e) { e.preventDefault(); go(); }); r.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); });
  RES_COL.forEach(function (c, i) { var r = S('rect', { x: 28 + i * 36, y: 186, width: 30, height: 34, rx: 6, tabindex: 0, role: 'button', 'aria-label': c[0], style: 'touch-action:manipulation;cursor:pointer;fill:#fff;fill-opacity:0' }, hit); r.addEventListener('pointerdown', function (e) { e.preventDefault(); put(i); }); r.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); put(i); } }); });
  PC.anim(svg, function (dt, t) {
    dyn.replaceChildren(); if (t0 !== null && !done) now = (performance.now() - t0) / 1000;
    S('rect', { x: 8, y: 8, width: 384, height: 234, rx: 10, style: 'fill:#0a121b;stroke:#2a4660;stroke-width:1.6' }, dyn);
    txt(dyn, 22, 26, done ? 'Terminé' : 'Fabrique ' + resFmt(deck[qi][0]), AMBER, 'start', 13, true); txt(dyn, 340, 26, Math.floor(now) + ' s', '#9fb8cc', 'end', 11, true);
    ln(dyn, 50, 125, 100, 125, '#9fb8cc', 4); ln(dyn, 300, 125, 350, 125, '#9fb8cc', 4);
    S('rect', { x: 96, y: 94, width: 208, height: 62, rx: 22, style: 'fill:#d9c9a2;stroke:#8c7b52;stroke-width:2' }, dyn);
    BX.forEach(function (x, i) {
      var c = bands[i]; S('rect', { x: x - 11, y: 94, width: 22, height: 62, style: 'fill:' + (c === null ? 'none' : RES_COL[c][1]) + ';stroke:' + (sel === i && !done ? AMBER : (c === null ? '#6b5d3a' : '#00000055')) + ';stroke-width:' + (sel === i && !done ? 3.2 : 1.4) + ';stroke-dasharray:' + (c === null ? '4 3' : 'none') }, dyn);
      txt(dyn, x, 176, String(i + 1), sel === i ? AMBER : '#9fb8cc', 'middle', 11, true);
    });
    S('rect', { x: 262, y: 94, width: 16, height: 62, style: 'fill:#d4af37' }, dyn);
    if (!done) { var ax = BX[sel]; S('path', { d: 'M' + (ax - 6) + ' 84L' + (ax + 6) + ' 84L' + ax + ' 92Z', style: 'fill:' + AMBER }, dyn); }
    var v = val(); txt(dyn, 200, 76, v === null ? 'valeur lue : ?' : 'valeur lue : ' + resFmt(v), v !== null && !done && deck[qi] && v === deck[qi][0] ? GREEN : '#cfe3f2', 'middle', 12, true);
    RES_COL.forEach(function (c, i) { S('rect', { x: 28 + i * 36, y: 186, width: 30, height: 34, rx: 6, style: 'fill:' + c[1] + ';stroke:#ffffff55;stroke-width:1.4' }, dyn); txt(dyn, 43 + i * 36, 232, String(i), '#6f8aa0', 'middle', 9); });
  });
  init();
}

/* ---------- Tri express (2e année) ---------- */
var TRI_BS = { id: 'bs', title: 'Bien ou service ?', L: 'Bien', LS: 'objet matériel', R: 'Service', RS: 'activité rendue', sub: 'Bien ou service ? 60 s, 3 vies',
  how: 'Chaque carte tombe : classe-la avant qu’elle arrive. <b>Gauche</b> : bien. <b>Droite</b> : service.', play: 'Touche la <b>moitié gauche</b> (bien) ou <b>droite</b> (service) avant que la carte tombe.',
  items: [
    ['Un téléphone', 'boutique', 1, 'On peut le toucher : c’est un bien.'], ['Une bicyclette', 'magasin de sport', 1, 'Objet matériel : un bien.'], ['Un pain', 'boulangerie', 1, 'Objet matériel qu’on consomme : un bien.'],
    ['Un ordinateur', 'magasin', 1, 'Objet matériel : un bien.'], ['Un cahier', 'librairie', 1, 'Objet matériel : un bien.'], ['Un fauteuil', 'menuisier', 1, 'Objet matériel : un bien.'],
    ['Une coupe de cheveux', 'salon de coiffure', 0, 'Activité rendue par une personne : un service.'], ['Un trajet en taxi', 'ville', 0, 'On paie une activité : un service.'], ['Un cours de soutien', 'académie', 0, 'Activité d’enseignement : un service.'],
    ['Une consultation', 'médecin', 0, 'Activité rendue : un service.'], ['Une réparation de vélo', 'atelier', 0, 'Le réparateur rend une activité : un service.'], ['Une livraison', 'coursier', 0, 'Transport rendu : un service.']
  ] };
var TRI_TA = { id: 'ta', title: 'Tout ou rien / analogique', L: 'Tout ou rien', LS: 'deux états', R: 'Analogique', RS: 'valeur qui varie', sub: 'Quel type de capteur ? 60 s, 3 vies',
  how: 'Chaque capteur tombe : classe-le avant qu’il arrive. <b>Gauche</b> : tout ou rien. <b>Droite</b> : analogique.', play: 'Touche la <b>moitié gauche</b> (tout ou rien) ou <b>droite</b> (analogique) avant que la carte tombe.',
  items: [
    ['Interrupteur de porte', 'ouvert ou fermé', 1, 'Deux états seulement : tout ou rien.'], ['Bouton-poussoir', 'appuyé ou relâché', 1, 'Deux états : tout ou rien.'], ['Détecteur de présence', 'éclairage de couloir', 1, 'Il détecte ou non : tout ou rien.'],
    ['Capteur de fin de course', 'portail', 1, 'Touché ou non : tout ou rien.'], ['Détecteur de fumée', 'alarme', 1, 'Alarme ou pas d’alarme : tout ou rien.'], ['Flotteur de réservoir', 'plein ou vide', 1, 'Deux états : tout ou rien.'],
    ['Photorésistance (LDR)', 'lumière', 0, 'Sa résistance varie avec la lumière : analogique.'], ['Thermistance CTN', 'température', 0, 'Sa résistance varie avec la chaleur : analogique.'], ['Potentiomètre', 'volume', 0, 'Il donne toutes les valeurs entre deux limites : analogique.'],
    ['Capteur de niveau continu', 'citerne', 0, 'Il mesure la hauteur exacte : analogique.'], ['Thermomètre électronique', 'salle de classe', 0, 'Valeur qui varie progressivement : analogique.'], ['Capteur de luminosité', 'lampadaire', 0, 'Il mesure une quantité de lumière : analogique.']
  ] };

/* ---------- Chrono-défi (2e année) ---------- */
var CHR_PCB = { id: 'pcb', title: 'Chrono-défi · circuit imprimé', a: 'première étape', b: 'dernière étape',
  how: 'Touche une carte, puis un emplacement : de la <b>première</b> étape (à gauche) à la <b>dernière</b> (à droite).', win: 'Le circuit passe du schéma aux pistes de cuivre, puis aux composants soudés.',
  ev: [['Schéma', 'étape 1', 1], ['Typon', 'étape 2', 2], ['Insolation', 'étape 3', 3], ['Révélation', 'étape 4', 4], ['Gravure', 'étape 5', 5], ['Perçage', 'étape 6', 6], ['Soudure', 'étape 7', 7]] };
var CHR_MINI = { id: 'mini', title: 'Chrono-défi · mini-entreprise', a: 'au début', b: 'à la fin',
  how: 'Touche une carte, puis un emplacement : de ce qu’on fait <b>au début</b> (à gauche) à ce qu’on fait <b>à la fin</b> (à droite).', win: 'On commence par l’idée et le marché, puis on calcule, on produit et on vend.',
  ev: [['Idée', 'étape 1', 1], ['Étude\nde marché', 'étape 2', 2], ['Nom\net logo', 'étape 3', 3], ['Coût\nde revient', 'étape 4', 4], ['Distribution', 'étape 5', 5], ['Production', 'étape 6', 6], ['Vente', 'étape 7', 7]] };

/* ---------- Évasion (2e année) ---------- */
var ESC_A1 = {
  id: 'a1', title: 'Évasion · Modélisation', story: 'Le portail du lycée est en panne et le plan du système est verrouillé. Lis les diagrammes pour trouver le code.', win: 'Tu sais lire acteurs, contexte et blocs.',
  p: [
    { q: 'Dans un diagramme de cas d’utilisation, qui <b>bénéficie du service</b> ?', ar: 'من يستفيد من الخدمة؟', o: ['L’acteur principal', 'L’acteur secondaire', 'Le moteur'], a: 0, d: 4, e: 'L’acteur principal est à gauche.', hint: 'Il est placé à gauche.' },
    { q: 'La pluie, pour un portail, est dans…', ar: 'المطر بالنسبة للبوابة موجود في…', o: ['le système', 'l’environnement', 'un bloc'], a: 1, d: 7, e: 'Elle est autour du système : l’environnement.', hint: 'Le moteur est dans le système, la pluie non.' },
    { q: 'Combien de <b>capteurs</b> ont des ciseaux ?', ar: 'كم ملتقطا في المقص؟', a: 0, d: 3, e: 'Un objet simple n’a ni capteur ni commande.', hint: 'Les ciseaux sont un objet simple.' },
    { q: 'Un bloc d’un diagramme SysML satisfait…', ar: 'الكتلة في المخطط تحقق…', o: ['une exigence', 'un acteur', 'la pluie'], a: 0, d: 8, e: 'Lien « satisfy » : un bloc satisfait une exigence.', hint: 'Lien « satisfy ».' }
  ]
};
var ESC_A2 = {
  id: 'a2', title: 'Évasion · Fonctions techniques', story: 'La mini-station du club d’électronique est verrouillée. Calcule pour ouvrir le boîtier.', win: 'Tu sais lire les composants et faire les calculs de base.',
  p: [
    { q: 'Résistance <b>marron, noir, rouge</b> : combien de <b>kΩ</b> ?', ar: 'كم كيلو أوم؟', a: 1, d: 6, e: '10 suivi de 2 zéros = 1 000 Ω = 1 kΩ.', hint: '1, 0, puis deux zéros.' },
    { q: 'LED sur 5 V, tension de la LED 2 V, courant 10 mA. <b>R en centaines d’ohms</b> ?', ar: 'قيمة المقاومة بالمئات من الأوم؟', a: 3, d: 2, e: 'R = (5 − 2) / 0,01 = 300 Ω.', hint: 'R = (E − U_LED) / I, avec I = 0,01 A.' },
    { q: 'Poulie : N1 = 100 tr/min, d1 = 20 mm, d2 = 40 mm. <b>N2 en dizaines</b> de tr/min ?', ar: 'N2 بعشرات الدورات في الدقيقة؟', a: 5, d: 9, e: 'N2 = 100 × 20 / 40 = 50 tr/min.', hint: 'N2 = N1 × d1 / d2.' },
    { q: 'Quand la lumière augmente, la résistance d’une LDR…', ar: 'عند ازدياد الضوء، مقاومة LDR…', o: ['baisse', 'augmente', 'ne change pas'], a: 0, d: 1, e: 'Plus de lumière, moins de résistance.', hint: 'Elle détecte la lumière.' }
  ]
};
var ESC_A3 = {
  id: 'a3', title: 'Évasion · Circuit imprimé', story: 'L’atelier de fabrication est fermé. Retrouve les étapes du circuit imprimé pour déverrouiller la porte.', win: 'Tu connais les étapes et la sécurité du circuit imprimé.',
  p: [
    { q: 'Quelle étape vient juste après l’<b>insolation</b> ?', ar: 'أي مرحلة تأتي بعد التعريض؟', o: ['La soudure', 'La révélation', 'Le perçage'], a: 1, d: 5, e: 'Schéma, typon, insolation, révélation…', hint: 'Insolation, puis…' },
    { q: 'Les pistes de cuivre remplacent…', ar: 'مسارات النحاس تعوّض…', o: ['les fils', 'les piles', 'les LED'], a: 0, d: 0, e: 'Elles relient les pastilles sans fils.', hint: 'Sans elles, il faudrait câbler.' },
    { q: 'Combien d’étapes dans la liste : schéma, typon, insolation, révélation, gravure, perçage, soudure ?', ar: 'كم مرحلة في اللائحة؟', a: 7, d: 3, e: 'Sept étapes.', hint: 'Compte les mots de la liste.' },
    { q: 'Pour la gravure, il faut…', ar: 'من أجل الحفر يجب…', o: ['lunettes, gants et local aéré', 'rien de spécial', 'un casque de vélo'], a: 0, d: 8, e: 'Lunettes, gants, local aéré, fer sur son support.', hint: 'Protège tes yeux et tes mains.' }
  ]
};
var ESC_A4 = {
  id: 'a4', title: 'Évasion · Mini-entreprise', story: 'Le stand du forum des métiers est verrouillé. Calcule le prix juste pour recevoir le code.', win: 'Tu sais calculer un coût de revient et un prix de vente.',
  p: [
    { q: 'Matières 30 DH, main-d’œuvre 10 DH, charges 10 DH. <b>Coût de revient en dizaines de DH</b> ?', ar: 'تكلفة الإنتاج بعشرات الدراهم؟', a: 5, d: 2, e: '30 + 10 + 10 = 50 DH.', hint: 'Additionne les trois.' },
    { q: 'Coût de revient 50 DH, marge 10 DH. <b>Prix de vente en dizaines de DH</b> ?', ar: 'ثمن البيع بعشرات الدراهم؟', a: 6, d: 7, e: 'Prix = coût + marge = 60 DH.', hint: 'Prix de vente = coût + marge.' },
    { q: 'Après l’idée, on fait…', ar: 'بعد الفكرة نقوم ب…', o: ['une étude de marché', 'la vente', 'la production'], a: 0, d: 4, e: 'On vérifie d’abord que des clients veulent le produit.', hint: 'Il faut connaître les clients.' },
    { q: 'Quand le prix monte, la demande…', ar: 'عندما يرتفع الثمن، الطلب…', o: ['monte', 'baisse', 'ne change pas'], a: 1, d: 9, e: 'Prix haut : demande basse.', hint: 'Acheter coûte plus cher.' }
  ]
};

/* ---------- leçons ---------- */
var JX2_AR = function (e, u, w) { return { e: [e], u: u, w: w }; };
PC.extra('t2-3', [{
  short: 'Code couleurs', title: 'Jeu : fabrique la résistance', intro: 'Choisis les couleurs des trois bandes pour obtenir la valeur demandée.', build: jeuResistance,
  retenir: ['Bandes 1 et 2 : <b>chiffres</b>. Bande 3 : <b>nombre de zéros</b>.', 'Exemple : jaune, violet, rouge = 4 700 Ω.'],
  ar: JX2_AR('الشريطان الأول والثاني رقمان، والثالث عدد الأصفار. مثال: أصفر، بنفسجي، أحمر = 4700 أوم.', 'المس شريطا ثم لونا من اللوحة، واضغط «Valider».', [['résistance', 'مقاومة'], ['bande', 'شريط'], ['valeur', 'قيمة'], ['code couleurs', 'رمز الألوان']])
}]);
PC.extra('t2-11', [{
  short: 'Tri bien/service', title: 'Jeu : bien ou service ?', intro: 'Classe les cartes avant qu’elles tombent.', build: function (el) { triPlay(el, TRI_BS); },
  retenir: ['Un <b>bien</b> est un objet matériel.', 'Un <b>service</b> est une activité rendue.'],
  ar: JX2_AR('السلعة شيء مادي، والخدمة نشاط يُقدَّم للزبون.', 'المس النصف الأيسر للسلعة والأيمن للخدمة.', [['bien', 'سلعة'], ['service', 'خدمة'], ['client', 'زبون'], ['marché', 'سوق']])
}]);
PC.extra('t2-7', [{
  short: 'Tri capteurs', title: 'Jeu : tout ou rien ou analogique ?', intro: 'Classe les capteurs avant qu’ils arrivent en bas.', build: function (el) { triPlay(el, TRI_TA); },
  retenir: ['<b>Tout ou rien</b> : deux états.', '<b>Analogique</b> : valeur qui varie progressivement.'],
  ar: JX2_AR('الملتقط «كل شيء أو لا شيء» له حالتان فقط، والتناظري يعطي قيمة تتغير تدريجيا.', 'المس النصف الأيسر لـ «كل شيء أو لا شيء» والأيمن للتناظري.', [['tout ou rien', 'كل شيء أو لا شيء'], ['analogique', 'تناظري'], ['capteur', 'ملتقط'], ['détecteur', 'كاشف']])
}]);
PC.extra('t2-10', [{
  short: 'Chrono PCB', title: 'Jeu : chrono-défi · circuit imprimé', intro: 'Remets cinq étapes de fabrication dans l’ordre.', build: function (el) { chronoPlay(el, CHR_PCB); },
  retenir: ['Schéma, typon, insolation, révélation, gravure, perçage, soudure.', 'Les pistes de cuivre remplacent les fils.'],
  ar: JX2_AR('مراحل الدارة المطبوعة: مخطط، شفافية، تعريض، إظهار، حفر، ثقب، لحام.', 'المس بطاقة ثم مكانها في الترتيب.', [['insolation', 'تعريض'], ['gravure', 'حفر'], ['perçage', 'ثقب'], ['soudure', 'لحام']])
}]);
PC.extra('t2-13', [{
  short: 'Chrono mini', title: 'Jeu : chrono-défi · mini-entreprise', intro: 'Remets cinq étapes du projet dans l’ordre.', build: function (el) { chronoPlay(el, CHR_MINI); },
  retenir: ['Idée, étude de marché, nom et logo.', 'Puis coût de revient, distribution, production, vente.'],
  ar: JX2_AR('نبدأ بالفكرة ودراسة السوق ثم الاسم والشعار، وبعدها حساب التكلفة والتوزيع والإنتاج والبيع.', 'المس بطاقة ثم مكانها في الترتيب.', [['étude de marché', 'دراسة السوق'], ['coût de revient', 'تكلفة الإنتاج'], ['production', 'إنتاج'], ['vente', 'بيع']])
}]);
[['t2-2', ESC_A1, 'Module 1'], ['t2-9', ESC_A2, 'Module 2'], ['t2-10', ESC_A3, 'Module 3'], ['t2-13', ESC_A4, 'Module 4']].forEach(function (x) {
  PC.extra(x[0], [{
    short: 'Évasion', title: 'Jeu d’évasion · ' + x[2], intro: 'Quatre énigmes pour ouvrir la porte : le plus vite, sans erreur ni indice.',
    build: function (el) { escGame(el, x[1]); },
    retenir: ['Chaque énigme reprend une idée du module : relis la leçon si tu bloques.', 'Une erreur ajoute <b>10 s</b>, un indice <b>20 s</b>.'],
    ar: JX2_AR('أربعة ألغاز من درس الوحدة. كل جواب صحيح يضيء مصباحا ويكشف رقما، وعند الانتهاء يُفتح الباب. الخطأ يضيف 10 ثوانٍ والتلميح 20 ثانية.', 'اختر الجواب أو اكتب رقما ثم اضغط «Valider».', [['énigme', 'لغز'], ['indice', 'تلميح'], ['code', 'رمز'], ['verrouillé', 'مقفل']])
  }]);
});
