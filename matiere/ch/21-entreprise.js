/* ===================================================== 2AC · t2-11 MARCHÉ · t2-12 ENTREPRISE · t2-13 MINI-ENTREPRISE */
function bienService(el) {
  classify(el, 'Bien ou service', [
    { name: 'Un cahier', cat: 0, why: 'Objet matériel : un bien.' }, { name: 'Une coupe de cheveux', cat: 1, why: 'Activité rendue : un service.' },
    { name: 'Un téléphone', cat: 0, why: 'Un bien.' }, { name: 'Un cours de soutien', cat: 1, why: 'Un service.' },
    { name: 'Un trajet en taxi', cat: 1, why: 'Un service de transport.' }, { name: 'Une bouteille d’eau', cat: 0, why: 'Un bien consommable.' }
  ], ['Bien', 'Service'], 'Cet élément est-il un bien ou un service ?');
}
function roleClient(el) {
  classify(el, 'Client, utilisateur ou consommateur', [
    { name: 'Il achète un ballon pour son fils', cat: 0, why: 'Il paie : c’est le <b>client</b>.' },
    { name: 'Son fils joue avec le ballon', cat: 1, why: 'Il se sert du produit : l’<b>utilisateur</b>.' },
    { name: 'Elle mange une glace', cat: 2, why: 'Elle consomme le produit : la <b>consommatrice</b>.' },
    { name: 'Il commande un ordinateur pour l’école', cat: 0, why: 'Il achète : le <b>client</b>.' },
    { name: 'L’élève utilise l’ordinateur de l’école', cat: 1, why: 'L’<b>utilisateur</b>.' },
    { name: 'Il boit un jus', cat: 2, why: 'Le <b>consommateur</b>.' }
  ], ['Client', 'Utilisateur', 'Consommateur'], 'Qui est cette personne ?');
}
function drawMarket(g, price, d, s, mark) {
  var X0 = 50, Y0 = 210, W = 320, H = 170, qx = function (q) { return X0 + W * q / 130; }, py = function (p) { return Y0 - H * p / 100; };
  ln(g, X0, Y0, X0 + W, Y0, WIRE, 1.8); ln(g, X0, Y0, X0, Y0 - H - 6, WIRE, 1.8); txt(g, X0 + W, Y0 + 14, 'quantité', '#7e9bb2', 'end', 9.5); txt(g, X0 - 6, Y0 - H - 8, 'prix', '#7e9bb2', 'start', 9.5);
  var dp = [], sp = []; for (var p = 0; p <= 100; p += 2) { var qd = 100 - p + d, qs = p - 20 + s; if (qd >= 0) dp.push([qx(qd), py(p)]); if (qs >= 0) sp.push([qx(qs), py(p)]); }
  wire(g, dp, BLUE, 3); wire(g, sp, AMBER, 3); txt(g, qx(Math.max(8, d + 8)), py(92), 'demande', BLUE, 'start', 10.5, true); txt(g, qx(Math.min(125, 80 + s)), py(100) + 6, 'offre', AMBER, 'end', 10.5, true);
  var pe = (120 + d - s) / 2, qe = 100 - pe + d; if (price === null) price = pe;
  ln(g, X0, py(pe), qx(qe), py(pe), GREEN, 1.2, '4 3'); ln(g, qx(qe), py(pe), qx(qe), Y0, GREEN, 1.2, '4 3'); circ(g, qx(qe), py(pe), 6, GREEN, .9, 0); txt(g, qx(qe) + 8, py(pe) - 8, 'équilibre', GREEN, 'start', 10, true);
  if (mark) { var qdp = Math.max(0, 100 - price + d), qsp = Math.max(0, price - 20 + s); ln(g, X0, py(price), X0 + W, py(price), '#ffffff55', 1.2); circ(g, qx(qdp), py(price), 5, BLUE, 1, 0); circ(g, qx(qsp), py(price), 5, AMBER, 1, 0); return [qdp, qsp, pe, qe]; }
  return [0, 0, pe, qe];
}
function offreDemande(el) {
  var svg = ui.stage(el, 400, 235, 'Offre et demande'), dyn = S('g', null, svg), info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el), price = 70;
  ui.slider(el, { label: 'Prix du produit', min: 10, max: 100, value: 70, step: 1, color: AMBER, fmt: function (v) { return v + ' DH'; } }, function (v) { price = v; paint(); });
  function paint() {
    dyn.replaceChildren(); var r = drawMarket(dyn, price, 0, 0, true), surplus = r[1] > r[0];
    chips.set(ui.chip('demande ' + Math.round(r[0]), BLUE) + ui.chip('offre ' + Math.round(r[1]), AMBER));
    verd.set(Math.abs(price - r[2]) < 2 ? 'Prix d’équilibre : offre = demande.' : (surplus ? 'Prix trop haut : l’offre dépasse la demande.' : 'Prix trop bas : la demande dépasse l’offre.'), Math.abs(price - r[2]) < 2 ? 'ok' : '');
    info.set('Prix qui monte : la demande <b>baisse</b>, l’offre <b>augmente</b>.');
  }
  paint();
}
function chocsMarche(el) {
  var svg = ui.stage(el, 400, 235, 'Déplacement de l’équilibre'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), ctl = ui.controls(el), d = 0, s = 0, td = 0, ts = 0;
  var EV = [['Le produit devient à la mode', 20, 0, 'La demande augmente : le prix d’équilibre monte.'], ['Matière première plus chère', 0, -15, 'L’offre baisse : le prix d’équilibre monte.'], ['Un concurrent arrive', 0, 15, 'L’offre augmente : le prix d’équilibre baisse.'], ['Les clients dépensent moins', -20, 0, 'La demande baisse : le prix d’équilibre baisse.']];
  EV.forEach(function (e) { ui.btn(ctl, e[0], function () { td = e[1]; ts = e[2]; info.set('<b>' + e[0] + '.</b> ' + e[3]); }); });
  ui.btn(ctl, 'Départ', function () { td = 0; ts = 0; info.set('Marché de départ.'); });
  info.set('Choisis un événement et observe l’équilibre.');
  PC.anim(svg, function (dt) {
    d += (td - d) * Math.min(1, dt * 4); s += (ts - s) * Math.min(1, dt * 4); dyn.replaceChildren(); var r = drawMarket(dyn, null, d, s, false); chips.set(ui.chip('prix d’équilibre ≈ ' + Math.round(r[2]) + ' DH', GREEN) + ui.chip('quantité ≈ ' + Math.round(r[3]), GREEN));
  });
}
function secteurs(el) {
  classify(el, 'Secteurs d’activité', [
    { name: 'Un éleveur de moutons', cat: 0, why: 'Il prélève sur la nature : primaire.' }, { name: 'Un pêcheur', cat: 0, why: 'Primaire.' },
    { name: 'Une usine de voitures', cat: 1, why: 'Elle transforme des matières : secondaire.' }, { name: 'Une menuiserie', cat: 1, why: 'Elle fabrique : secondaire.' },
    { name: 'Une banque', cat: 2, why: 'Elle rend un service : tertiaire.' }, { name: 'Un magasin', cat: 2, why: 'Commerce : tertiaire.' },
    { name: 'Un laboratoire de recherche', cat: 3, why: 'Innovation et savoir : quaternaire.' }, { name: 'Une société de logiciels', cat: 3, why: 'Technologies de l’information : quaternaire.' }
  ], ['Primaire', 'Secondaire', 'Tertiaire', 'Quaternaire'], 'Dans quel secteur classer cette activité ?');
}
function fonctionsEntreprise(el) {
  classify(el, 'Fonctions de l’entreprise', [
    { name: 'Choisir les fournisseurs', cat: 0, why: 'Approvisionnement.' }, { name: 'Acheter les matières premières', cat: 0, why: 'Approvisionnement.' },
    { name: 'Assembler le produit', cat: 1, why: 'Production.' }, { name: 'Fabriquer les pièces', cat: 1, why: 'Production.' },
    { name: 'Faire de la publicité', cat: 2, why: 'Commercialisation.' }, { name: 'Vendre en magasin', cat: 2, why: 'Commercialisation.' }
  ], ['Approvisionnement', 'Production', 'Commercialisation'], 'Quelle fonction de l’entreprise ?');
}
function coutRevient(el) {
  var svg = ui.stage(el, 400, 190, 'Coût de revient et prix de vente'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el);
  var N = 50, M = 8, T = 20, F = 200, marge = 30;
  ui.slider(el, { label: 'Nombre d’articles', min: 10, max: 200, value: 50, step: 10, color: AMBER, fmt: function (v) { return v + ' articles'; } }, function (v) { N = v; paint(); });
  ui.slider(el, { label: 'Matières par article', min: 2, max: 30, value: 8, step: 1, color: BLUE, fmt: function (v) { return v + ' DH'; } }, function (v) { M = v; paint(); });
  ui.slider(el, { label: 'Temps par article', min: 5, max: 60, value: 20, step: 5, color: GREEN, fmt: function (v) { return v + ' min'; } }, function (v) { T = v; paint(); });
  ui.slider(el, { label: 'Charges (local, outils)', min: 0, max: 1000, value: 200, step: 50, color: RED, fmt: function (v) { return v + ' DH'; } }, function (v) { F = v; paint(); });
  ui.slider(el, { label: 'Marge souhaitée', min: 0, max: 100, value: 30, step: 5, color: AMBER, fmt: function (v) { return v + ' %'; } }, function (v) { marge = v; paint(); });
  function paint() {
    var mat = M, mo = T / 60 * 20, ch = F / N, cu = mat + mo + ch, pv = cu * (1 + marge / 100); dyn.replaceChildren();
    var X0 = 30, W = 340, sc = W / (pv * 1.15 + 1), x = X0;
    [[mat, BLUE, 'matières'], [mo, GREEN, 'main-d’œuvre'], [ch, RED, 'charges']].forEach(function (c) { var w = c[0] * sc; S('rect', { x: x, y: 60, width: w, height: 40, style: 'fill:' + c[1] + ';fill-opacity:.35;stroke:' + c[1] + ';stroke-width:2' }, dyn); if (w > 40) txt(dyn, x + w / 2, 85, c[2], '#fff', 'middle', 9.5); x += w; });
    txt(dyn, X0, 50, 'coût de revient : ' + cu.toFixed(1) + ' DH', '#fff', 'start', 11.5, true); ln(dyn, X0 + pv * sc, 110, X0 + pv * sc, 56, AMBER, 3); txt(dyn, Math.min(X0 + pv * sc, 340), 128, 'prix de vente ' + pv.toFixed(1) + ' DH', AMBER, 'middle', 11.5, true);
    txt(dyn, 200, 172, 'bénéfice sur ' + N + ' articles : ' + ((pv - cu) * N).toFixed(0) + ' DH', GREEN, 'middle', 11, true);
    chips.set(ui.chip('matières ' + mat.toFixed(1), BLUE) + ui.chip('main-d’œuvre ' + mo.toFixed(1), GREEN) + ui.chip('charges ' + ch.toFixed(1), RED));
    info.set('<b>Coût de revient</b> = matières + main-d’œuvre + charges, par article. <b>Prix de vente</b> = coût + marge.');
  }
  paint();
}
function etapesMini(el) {
  ordering(el, 'Étapes de la mini-entreprise', ['Idée du projet', 'Étude de marché', 'Nom et logo', 'Coût de revient', 'Distribution et publicité', 'Production', 'Vente et bilan'], 'Dans quel ordre lance-t-on une mini-entreprise ?');
}
PC.chapter({ id: 't2-11', lazy: true, eyebrow: EY2 + 'Module 4 · Entreprise et culture entrepreneuriale', title: 'Marché, offre et demande', ar: 'السوق والعرض والطلب',
  lessons: function () { return [
    { short: 'Bien ou service', title: 'Bien ou service', intro: 'Classe six produits.', build: bienService,
      retenir: ['Un <b>bien</b> est un objet matériel.', 'Un <b>service</b> est une activité rendue.'],
      ar: { e: ['السلعة شيء مادي، والخدمة نشاط يُقدَّم للزبون.'], u: 'صنّف.', w: [['bien', 'سلعة'], ['service', 'خدمة']] } },
    { short: 'Client', title: 'Client, utilisateur, consommateur', intro: 'Qui fait quoi ?', build: roleClient,
      retenir: ['Le <b>client</b> achète.', 'L’<b>utilisateur</b> se sert du produit ; le <b>consommateur</b> le consomme.'],
      ar: { e: ['الزبون يشتري، والمستعمل يستخدم المنتج، والمستهلك يستهلكه.'], u: 'حدّد الدور.', w: [['client', 'زبون'], ['consommateur', 'مستهلك']] } },
    { short: 'Offre et demande', title: 'Offre et demande', intro: 'Déplace le prix.', build: offreDemande,
      retenir: ['<b>Demande</b> : ce que les clients veulent acheter. <b>Offre</b> : ce que les producteurs vendent.', 'Prix haut : demande basse, offre haute.'],
      ar: { e: ['الطلب ما يريد الزبائن شراءه، والعرض ما يبيعه المنتجون. ارتفاع الثمن يقلّل الطلب ويزيد العرض.'], u: 'غيّر الثمن.', w: [['offre', 'عرض'], ['demande', 'طلب']] } },
    { short: 'Équilibre', title: 'Équilibre du marché', intro: 'Provoque un événement.', build: chocsMarche,
      retenir: ['L’<b>équilibre</b> : offre = demande.', 'Un événement le déplace, et le prix avec.'],
      ar: { e: ['التوازن عندما يتساوى العرض والطلب، وأي حدث يزيحه.'], u: 'اختر حدثا.', w: [['équilibre', 'توازن'], ['prix', 'ثمن']] } }
  ]; },
  quiz: [
    { q: 'Une coupe de cheveux est :', o: ['un service', 'un bien', 'un client'], a: 0, e: 'Une activité rendue.' },
    { q: 'Quand le prix monte, la demande :', o: ['baisse', 'monte', 'ne change pas'], a: 0, e: 'Les clients achètent moins.' },
    { q: 'À l’équilibre :', o: ['offre = demande', 'offre > demande', 'demande = 0'], a: 0, e: 'Le marché est équilibré.' },
    { q: 'Celui qui paie le produit est :', o: ['le client', 'l’utilisateur', 'le fournisseur'], a: 0, e: 'Il achète.' }
  ]
});
PC.chapter({ id: 't2-12', lazy: true, eyebrow: EY2 + 'Module 4 · Entreprise et culture entrepreneuriale', title: 'L’entreprise et ses secteurs', ar: 'المقاولة وقطاعاتها',
  lessons: function () { return [
    { short: 'Secteurs', title: 'Secteurs d’activité', intro: 'Classe huit activités.', build: secteurs,
      retenir: ['<b>Primaire</b> : nature. <b>Secondaire</b> : transformation.', '<b>Tertiaire</b> : services. <b>Quaternaire</b> : savoir et innovation.'],
      ar: { e: ['القطاع الأولي الطبيعة، الثانوي التحويل، الثالثي الخدمات، الرابعي المعرفة والابتكار.'], u: 'صنّف النشاط.', w: [['secteur', 'قطاع'], ['entreprise', 'مقاولة']] } },
    { short: 'Fonctions', title: 'Fonctions de l’entreprise', intro: 'Qui fait quoi ?', build: fonctionsEntreprise,
      retenir: ['<b>Approvisionnement</b> : acheter.', '<b>Production</b> : fabriquer. <b>Commercialisation</b> : vendre.'],
      ar: { e: ['التزويد: الشراء. الإنتاج: التصنيع. التسويق: البيع.'], u: 'حدّد الوظيفة.', w: [['production', 'إنتاج'], ['commercialisation', 'تسويق']] } }
  ]; },
  quiz: [
    { q: 'Une usine de voitures appartient au secteur :', o: ['secondaire', 'primaire', 'tertiaire'], a: 0, e: 'Elle transforme des matières.' },
    { q: 'Une banque appartient au secteur :', o: ['tertiaire', 'primaire', 'secondaire'], a: 0, e: 'Elle rend un service.' },
    { q: 'Acheter des matières premières relève de :', o: ['l’approvisionnement', 'la production', 'la commercialisation'], a: 0, e: 'On s’approvisionne.' },
    { q: 'La recherche et les logiciels relèvent du secteur :', o: ['quaternaire', 'primaire', 'secondaire'], a: 0, e: 'Savoir et innovation.' }
  ]
});
PC.chapter({ id: 't2-13', lazy: true, eyebrow: EY2 + 'Module 4 · Entreprise et culture entrepreneuriale', title: 'Monter sa mini-entreprise', ar: 'إنشاء مقاولة مصغّرة',
  lessons: function () { return [
    { short: 'Étapes', title: 'Les étapes', intro: 'Remets le projet dans l’ordre.', build: etapesMini,
      retenir: ['Idée, étude de marché, nom et logo.', 'Puis coût de revient, distribution, production, vente.'],
      ar: { e: ['نبدأ بالفكرة ودراسة السوق ثم الاسم والشعار فالتكلفة والتوزيع والإنتاج والبيع.'], u: 'رتّب.', w: [['étude de marché', 'دراسة السوق'], ['logo', 'شعار']] } },
    { short: 'Coût de revient', title: 'Coût de revient', intro: 'Fixe ton prix de vente.', build: coutRevient,
      retenir: ['<b>Coût de revient</b> = matières + main-d’œuvre + charges.', '<b>Prix de vente</b> = coût + marge.'],
      ar: { e: ['تكلفة الإنتاج = المواد + اليد العاملة + المصاريف. ثمن البيع = التكلفة + الهامش.'], u: 'حرّك المنزلقات.', w: [['coût de revient', 'تكلفة الإنتاج'], ['marge', 'هامش']] } }
  ]; },
  quiz: [
    { q: 'Que faut-il faire avant de fixer le prix ?', o: ['calculer le coût de revient', 'faire de la publicité', 'vendre'], a: 0, e: 'Le prix doit couvrir les coûts.' },
    { q: 'Matières 8 DH, main-d’œuvre 6 DH, charges 2 DH : coût ?', o: ['16 DH', '8 DH', '14 DH'], a: 0, e: '8 + 6 + 2.' },
    { q: 'Coût 16 DH, marge 25 % : prix de vente ?', o: ['20 DH', '25 DH', '16 DH'], a: 0, e: '16 × 1,25.' },
    { q: 'L’étude de marché sert à :', o: ['connaître concurrents et clients', 'dessiner le logo', 'fabriquer'], a: 0, e: 'Questionnaire et analyse.' }
  ]
});
