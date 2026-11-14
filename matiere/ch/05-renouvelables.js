/* ===================================================== 11. SOURCES D’ÉNERGIE */
function classer(el) {
  var SRCS = [
    ['Le pétrole', 0, 'Énergie fossile : formée sur des millions d’années, elle ne se renouvelle pas à l’échelle humaine.'],
    ['Le charbon', 0, 'Énergie fossile : les réserves s’épuisent et sa combustion libère beaucoup de CO₂.'],
    ['Le gaz naturel', 0, 'Énergie fossile : réserves limitées.'],
    ['Le Soleil', 1, 'Source inépuisable à l’échelle humaine : énergie solaire.'],
    ['Le vent', 1, 'Il se renouvelle sans cesse : énergie éolienne.'],
    ['La force de l’eau', 1, 'Le cycle de l’eau se renouvelle : énergie hydraulique.'],
    ['La biomasse', 1, 'Matière d’origine vivante (bois, déchets végétaux) renouvelée par la croissance des plantes.'],
    ['La chaleur du sol', 1, 'Géothermie : la chaleur de la Terre est disponible en continu.']
  ];
  var box = h('div', { 'class': 'quiz' }); el.appendChild(box);
  var score = h('p', { 'class': 'score', 'aria-live': 'polite' }); el.appendChild(score);
  var ctl = ui.controls(el), rs = ui.btn(ctl, 'Recommencer', function () { build(); }); rs.hidden = true;
  function build() {
    box.replaceChildren(); score.textContent = ''; rs.hidden = true;
    var done = 0, good = 0, list = PC.shuffle(SRCS);
    list.forEach(function (it, qi) {
      var d = h('div', { 'class': 'q' }), ob = h('div', { 'class': 'opts' }), fb = h('p', { 'class': 'fb', 'aria-live': 'polite' });
      d.appendChild(h('p', null, (qi + 1) + '. ' + it[0] + ' : renouvelable ou non ?')); d.appendChild(ob); d.appendChild(fb);
      var btns = ['Non renouvelable', 'Renouvelable'].map(function (t, oi) {
        var b = h('button', { type: 'button', 'class': 'opt' }, t);
        b.addEventListener('click', function () {
          btns.forEach(function (x, xi) { x.disabled = true; if (xi === it[1]) x.classList.add('ok'); });
          var right = oi === it[1]; if (!right) b.classList.add('ko');
          fb.innerHTML = (right ? 'Exact. ' : 'Faux. ') + it[2]; done++; if (right) good++;
          if (window.Lab && Lab.record) Lab.record(d, { ok: right, d: 1, q: it[0] + ' : renouvelable ou non ?', given: t, right: ['Non renouvelable', 'Renouvelable'][it[1]], topic: 'classer' });
          if (done === list.length) { score.textContent = 'Score : ' + good + ' / ' + list.length; rs.hidden = false; if (window.Lab && Lab.seriesDone) Lab.seriesDone(box, { d: 1, good: good, asked: list.length }); }
        });
        ob.appendChild(b); return b;
      });
      box.appendChild(d);
    });
  }
  build();
}

function impact(el) {
  var svg = ui.stage(el, 400, 250, 'Émissions de CO₂ selon la source d’énergie'), g = S('g', null, svg);
  var info = ui.info(el);
  var DATA = [['Charbon', 820, 0, 'Pollution de l’air (particules, dioxyde de soufre) et fortes émissions de gaz à effet de serre.'], ['Gaz', 490, 0, 'Moins polluant que le charbon, mais émet du CO₂ et du méthane.'],
    ['Biomasse', 230, 1, 'Émissions plus faibles si les plantes sont replantées ; peut concurrencer les cultures et les forêts.'], ['Solaire PV', 48, 1, 'Très peu d’émissions en fonctionnement ; la fabrication des panneaux consomme de l’énergie.'],
    ['Géothermie', 38, 1, 'Faibles émissions ; installation possible seulement dans certaines régions.'], ['Hydraulique', 24, 1, 'Faibles émissions ; un barrage modifie le paysage et le milieu naturel.'], ['Éolien', 11, 1, 'Très faibles émissions ; impact sur le paysage et sur les oiseaux à étudier.']];
  txt(g, 200, 14, 'grammes de CO₂ par kWh produit (ordres de grandeur, cycle de vie)', 'rgba(255,255,255,.65)', 'middle', 10.5);
  var bars = [], p = 0, sel = 0;
  DATA.forEach(function (d, i) {
    var y = 28 + i * 31; txt(g, 82, y + 16, d[0], INK, 'end', 11.5);
    var b = S('rect', { x: 90, y: y, width: 0, height: 22, rx: 4, style: 'fill:' + (d[2] ? T : C) + ';fill-opacity:.7;cursor:pointer' }, g);
    var t = txt(g, 94, y + 16, '', INK, 'start', 11, true);
    b.addEventListener('click', function () { sel = i; paint(); }); bars.push([b, t, d]);
  });
  function paint() {
    bars.forEach(function (a, i) {
      var w = Math.max(3, 250 * a[2][1] / 820 * ease(p)); a[0].setAttribute('width', w); a[0].style.strokeWidth = i === sel ? 3 : 0; a[0].style.stroke = '#fff';
      a[1].setAttribute('x', 94 + w); a[1].textContent = Math.round(a[2][1] * ease(p));
    });
    var d = DATA[sel][2]; info.set('<b>' + DATA[sel][0] + '</b> : ' + DATA[sel][1] + ' g de CO₂ par kWh. ' + DATA[sel][3] + ' Touche une barre pour changer.');
  }
  PC.anim(svg, function (dt) { if (p < 1) { p = Math.min(1, p + dt / 1.2); paint(); } });
  paint();
}

PC.chapter({ id: 't3-11', lazy: true, eyebrow: EY + 'Module 5 · Énergies renouvelables', title: 'Sources d’énergie renouvelables et non renouvelables', ar: 'مصادر الطاقة المتجددة وغير المتجددة',
  lessons: function () { return [
    { short: 'Classer', title: 'Classer les sources d’énergie', intro: 'Pour chaque source, choisis si elle est renouvelable ou non.', build: classer,
      retenir: ['L’<b>énergie</b> permet de produire un mouvement, de la chaleur, de la lumière, de l’électricité.', '<b>Non renouvelables</b> : pétrole, charbon, gaz (énergies fossiles), dont les réserves s’épuisent.', '<b>Renouvelables</b> : Soleil, vent, eau, biomasse, chaleur de la Terre (géothermie).'],
      ar: { e: ['الطاقة تمكّن من إنتاج الحركة والحرارة والضوء والكهرباء. مصادر الطاقة غير المتجددة هي الأحفورية (النفط والفحم والغاز) وتنفد احتياطاتها. أما المتجددة فهي الشمس والرياح والماء والكتلة الحيوية والحرارة الجوفية.'], u: 'اختر لكل مصدر هل هو متجدد أم لا.', w: [['énergie fossile', 'طاقة أحفورية'], ['énergie renouvelable', 'طاقة متجددة'], ['biomasse', 'كتلة حيوية'], ['géothermie', 'طاقة حرارية أرضية']] } },
    { short: 'Impact', title: 'Impact sur l’environnement et la santé', intro: 'Compare les émissions de CO₂ des sources d’énergie. Touche une barre pour lire l’impact.', build: impact,
      retenir: ['Les énergies fossiles polluent l’air et augmentent l’effet de serre.', 'Les énergies renouvelables émettent très peu de CO₂ en fonctionnement, mais ont aussi des impacts (paysage, milieux naturels, fabrication).', 'À grande échelle : <b>hydroélectricité, éolien, solaire</b>. Au Maroc : barrages, parcs éoliens, centrale solaire Noor de Ouarzazate.'],
      ar: { e: ['الطاقات الأحفورية تلوّث الهواء وتزيد من الاحتباس الحراري. الطاقات المتجددة تُصدر قليلا جدا من ثاني أكسيد الكربون أثناء التشغيل، لكن لها أيضا تأثيرات (المنظر الطبيعي، الأوساط الطبيعية، التصنيع). على نطاق واسع: الطاقة الكهرومائية والريحية والشمسية.'], u: 'المس عمودا لقراءة التأثير.', w: [['effet de serre', 'احتباس حراري'], ['hydroélectricité', 'طاقة كهرومائية'], ['éolien', 'ريحية'], ['solaire', 'شمسية']] } }
  ]; },
  quiz: [
    { q: 'Quelle énergie est non renouvelable ?', o: ['le pétrole', 'le vent', 'le Soleil'], a: 0, e: 'Le pétrole est une énergie fossile.' },
    { q: 'Quelle source émet le moins de CO₂ en fonctionnement ?', o: ['l’éolien', 'le charbon', 'le gaz'], a: 0, e: 'L’éolien ne brûle aucun combustible.' },
    { q: 'La biomasse est :', o: ['renouvelable', 'fossile', 'nucléaire'], a: 0, e: 'Les plantes repoussent.' },
    { q: 'Les trois énergies renouvelables les plus utilisées à grande échelle sont :', o: ['hydroélectricité, éolien, solaire', 'pétrole, gaz, charbon', 'bois, tourbe, charbon'], a: 0, e: 'Ce sont les trois du programme.' }
  ]
});

/* ===================================================== 12. HYDROÉLECTRICITÉ ET ÉOLIENNE */
function hydro(el) {
  var svg = ui.stage(el, 400, 250, 'Centrale hydroélectrique'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el);
  var mode = 'prod';
  S('rect', { x: 10, y: 150, width: 140, height: 60, style: 'fill:#6a5a48;fill-opacity:.5;stroke:rgba(255,255,255,.4);stroke-width:2' }, g);
  S('path', { d: 'M10 60L10 150L120 150L120 60', fill: 'none', style: 'stroke:rgba(255,255,255,.4);stroke-width:2' }, g);
  S('path', { d: 'M120 50L150 50L150 150L120 150Z', style: 'fill:#8d8a95;fill-opacity:.8;stroke:#fff;stroke-opacity:.5;stroke-width:2' }, g);
  txt(g, 66, 40, 'retenue d’eau', L, 'middle', 11, true); txt(g, 138, 44, 'barrage', 'rgba(255,255,255,.7)', 'middle', 10);
  ln(g, 150, 158, 214, 205, '#8d8a95', 12); txt(g, 196, 172, 'conduite forcée', 'rgba(255,255,255,.7)', 'start', 10);
  block(g, 280, 176, 74, 40, 'Génératrice', GOLD, 11); ln(g, 244, 198, 280, 198, '#fff', 4);
  pathd(g, 'M354 196L376 196L376 150', 'rgba(255,255,255,.8)', 2.5); txt(g, 376, 140, 'réseau', 'rgba(255,255,255,.7)', 'middle', 10.5);
  var sl = ui.slider(el, { label: 'Ouverture de la vanne', min: 0, max: 100, value: 60, step: 10, color: L, fmt: function (v) { return v + ' %'; } }, paint);
  var a = 0, t = 0;
  function paint() {
    var o = sl.get(), pw = o / 100;
    chips.set(mode === 'prod' ? ui.chip('Énergie potentielle', L) + ui.chip('→ cinétique', P) + ui.chip('→ mécanique', C) + ui.chip('→ électrique ' + Math.round(pw * 100) + ' %', GOLD) : ui.chip('Énergie électrique', GOLD) + ui.chip('→ pompe', C) + ui.chip('→ énergie potentielle stockée', L));
    info.set(mode === 'prod' ? 'L’eau de la retenue descend dans la <b>conduite forcée</b> et fait tourner la <b>turbine</b>. La turbine entraîne la <b>génératrice</b> qui produit l’électricité. Plus la vanne est ouverte, plus la puissance est grande.' : 'En période de faible demande, une centrale peut <b>pomper</b> l’eau vers le bassin haut pour <b>stocker l’énergie</b> : on la récupérera en turbinant plus tard.');
  }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); var o = sl.get() / 100, i; t += dt * (.3 + o);
    var hw = mode === 'prod' ? 80 : 60 + 25 * ((Math.sin(t * .3) + 1) / 2); S('rect', { x: 11, y: 150 - hw, width: 108, height: hw - 1, style: 'fill:var(--lav);fill-opacity:.55' }, dyn);
    for (i = 0; i < 6; i++) { var p = ((t * (mode === 'prod' ? 1 : -1) + i / 6) % 1 + 1) % 1; circ(dyn, 150 + p * 64, 158 + p * 47, 4, '#cfe6ff', .9, 0); }
    a += dt * (o * 14) * (mode === 'prod' ? 1 : -1);
    circ(dyn, 230, 198, 22, C, .15, 3); for (i = 0; i < 4; i++) { var an = a + i * 1.571; ln(dyn, 230, 198, 230 + Math.cos(an) * 20, 198 + Math.sin(an) * 20, C, 5); }
    if (mode === 'prod' && o > 0) { var lt = S('circle', { cx: 330, cy: 100, r: 20, style: 'fill:' + GOLD + ';fill-opacity:' + (.15 + .75 * o) + ';stroke:' + GOLD + ';stroke-width:3' }, dyn); ln(dyn, 376, 140, 376, 110, 'rgba(255,255,255,.8)', 2.5); ln(dyn, 376, 110, 350, 100, 'rgba(255,255,255,.8)', 2.5); }
  });
  var ctl = ui.controls(el);
  var b = ui.btn(ctl, 'Passer en mode stockage (pompage)', function () { mode = mode === 'prod' ? 'sto' : 'prod'; b.textContent = mode === 'prod' ? 'Passer en mode stockage (pompage)' : 'Revenir à la production'; paint(); });
  paint();
}

function eolienne(el) {
  var svg = ui.stage(el, 400, 250, 'Éolienne à axe horizontal'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el), verd = ui.verdict(el);
  var part = 'all', a = 0;
  var PARTS = {
    all: ['Éolienne à axe horizontal', 'Elle transforme l’énergie cinétique du vent en énergie électrique. Choisis un composant pour lire sa fonction.'],
    pal: ['Pales et rotor', 'Les pales captent le vent et font tourner le rotor : c’est de l’énergie mécanique.'],
    nac: ['Nacelle', 'Elle contient le multiplicateur de vitesse et la génératrice, qui produit le courant électrique.'],
    mat: ['Mât', 'Il porte la nacelle en hauteur, là où le vent est plus fort et plus régulier.'],
    ane: ['Anémomètre et girouette', 'Ils mesurent la vitesse et la direction du vent pour orienter la nacelle et arrêter l’éolienne si le vent est trop fort.']
  };
  var sw = ui.slider(el, { label: 'Vitesse du vent', min: 0, max: 30, value: 8, step: 1, color: T, fmt: function (v) { return v + ' m/s'; } }, paint);
  function power(v) { return v < 3 ? 0 : (v < 12 ? Math.pow((v - 3) / 9, 3) * .9 + (v >= 11 ? .1 * (v - 11) : 0) : (v <= 25 ? 1 : 0)); }
  function paint() {
    var v = sw.get(), pw = power(v);
    chips.set(ui.chip('Vent : ' + v + ' m/s', T) + ui.chip('Puissance : ' + Math.round(pw * 100) + ' % du maximum', GOLD));
    verd.set(v < 3 ? 'Vent trop faible : l’éolienne ne démarre pas.' : (v > 25 ? 'Vent trop fort : arrêt de sécurité, les pales sont mises en drapeau.' : (v >= 12 ? 'Puissance nominale atteinte : elle reste constante.' : 'La puissance augmente très vite avec la vitesse du vent.')), v >= 3 && v <= 25 ? 'ok' : '');
    info.set('<b>' + PARTS[part][0] + '.</b> ' + PARTS[part][1]);
  }
  ui.tabs(el, [['all', 'Ensemble'], ['pal', 'Pales'], ['nac', 'Nacelle'], ['mat', 'Mât'], ['ane', 'Mesure']], function (k) { part = k; paint(); });
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); var v = sw.get(), pw = power(v), i;
    var on = function (k) { return part === 'all' || part === k ? 1 : .2; };
    var hx = 170, hy = 90;
    S('path', { d: 'M165 235L175 235L172 106L168 106Z', style: 'fill:#fff;fill-opacity:' + (.5 * on('mat')) + ';stroke:#fff;stroke-width:1.5;stroke-opacity:' + on('mat') }, dyn);
    S('rect', { x: 165, y: 98, width: 54, height: 18, rx: 6, style: 'fill:' + GOLD + ';fill-opacity:' + (.35 * on('nac')) + ';stroke:' + GOLD + ';stroke-width:2.5;stroke-opacity:' + on('nac') }, dyn);
    txt(dyn, 192, 111, 'nacelle', INK, 'middle', 8.5); dyn.lastChild.style.opacity = on('nac');
    ln(dyn, 200, 98, 200, 88, '#fff', 2); circ(dyn, 200, 86, 3, '#fff', 1, 0); dyn.lastChild.style.opacity = on('ane'); dyn.lastChild.previousSibling.style.opacity = on('ane');
    var rot = (v >= 3 && v <= 25) ? 1 : 0; a += dt * (rot ? (1 + v * .22) : 0);
    var feather = v > 25;
    for (i = 0; i < 3; i++) { var an = (feather ? -Math.PI / 2 : a) + i * 2.094, L0 = 78; ln(dyn, hx, hy + 8, hx + Math.cos(an) * L0, hy + 8 + Math.sin(an) * L0, T, 7 * on('pal')); dyn.lastChild.style.strokeOpacity = on('pal'); }
    circ(dyn, hx, hy + 8, 8, P, .9 * on('pal'), 0);
    for (i = 0; i < 4; i++) { var wy = 60 + i * 30, off = ((a * 8 + i * 30) % 80); arrow(dyn, 20 + off * .3, wy, 60 + off * .3, wy, 'rgba(255,255,255,.35)', 1.5); }
    rect(dyn, 300, 40, 18, 160, 'rgba(255,255,255,1)', .06, 5, 1.5); S('rect', { x: 302, y: 198 - 156 * pw, width: 14, height: 156 * pw, rx: 4, style: 'fill:' + GOLD }, dyn); txt(dyn, 309, 216, 'P', GOLD, 'middle', 11, true);
  });
  paint();
}

PC.chapter({ id: 't3-12', lazy: true, eyebrow: EY + 'Module 5 · Énergies renouvelables', title: 'Hydroélectricité et éolienne', ar: 'الطاقة الكهرومائية والمراوح الريحية',
  lessons: function () { return [
    { short: 'Hydroélectricité', title: 'La centrale hydroélectrique', intro: 'Ouvre la vanne : suis l’énergie de l’eau jusqu’à l’électricité. Essaie ensuite le mode stockage.', build: hydro,
      retenir: ['Chaîne : retenue d’eau, conduite forcée, <b>turbine</b>, <b>génératrice</b>, réseau.', 'Le stockage se fait dans des <b>bassins</b> : on peut pomper l’eau vers le haut quand l’électricité est abondante.'],
      ar: { e: ['في المحطة الكهرومائية ينحدر الماء من الخزان عبر القناة المضغوطة فيدير التوربين الذي يُدير المولّد فينتج الكهرباء. يمكن تخزين الطاقة في أحواض بضخّ الماء إلى الأعلى.'], u: 'غيّر فتح البوابة ثم جرّب وضع التخزين.', w: [['barrage', 'سد'], ['turbine', 'توربين'], ['génératrice', 'مولّد'], ['conduite forcée', 'قناة مضغوطة'], ['stockage', 'تخزين']] } },
    { short: 'Éolienne', title: 'L’éolienne à axe horizontal', intro: 'Change la vitesse du vent et choisis un composant pour lire sa fonction.', build: eolienne,
      retenir: ['Composants : <b>pales</b>, rotor, <b>nacelle</b> (multiplicateur et génératrice), <b>mât</b>, anémomètre.', 'En dessous d’environ 3 m/s l’éolienne ne démarre pas. Au-delà d’environ 25 m/s elle s’arrête pour sa sécurité.', 'Stockage : bassins pour les grandes installations, batteries pour les petites éoliennes.'],
      ar: { e: ['المروحة الريحية ذات المحور الأفقي تحوّل الطاقة الحركية للرياح إلى طاقة كهربائية. مكوّناتها: الريش والدوّار والغرفة (nacelle) التي تحوي المضاعِف والمولّد، والصاري، وجهاز قياس سرعة الرياح. تتوقف المروحة عندما تكون الرياح ضعيفة جدا أو قوية جدا.'], u: 'غيّر سرعة الرياح واختر مكوّنا لتقرأ وظيفته.', w: [['éolienne', 'مروحة ريحية'], ['pale', 'ريشة'], ['nacelle', 'غرفة المولّد'], ['mât', 'صاري'], ['anémomètre', 'مقياس سرعة الرياح']] } }
  ]; },
  quiz: [
    { q: 'Dans une centrale hydroélectrique, la turbine entraîne :', o: ['la génératrice', 'le barrage', 'la conduite forcée'], a: 0, e: 'La génératrice produit l’électricité.' },
    { q: 'Où l’énergie hydraulique est-elle stockée ?', o: ['dans des bassins', 'dans des piles', 'dans des câbles'], a: 0, e: 'L’eau en altitude est une réserve d’énergie.' },
    { q: 'Quel composant contient la génératrice d’une éolienne ?', o: ['la nacelle', 'le mât', 'la pale'], a: 0, e: 'La nacelle abrite aussi le multiplicateur de vitesse.' },
    { q: 'Quand le vent dépasse environ 25 m/s, l’éolienne :', o: ['s’arrête par sécurité', 'produit encore plus', 'accélère'], a: 0, e: 'Les pales sont mises en drapeau.' }
  ]
});

/* ===================================================== 13. LE SOLAIRE */
function photovoltaique(el) {
  var svg = ui.stage(el, 400, 250, 'Centrale solaire photovoltaïque autonome'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el), verd = ui.verdict(el);
  var batt = .5, t = 0;
  S('path', { d: 'M40 120L130 100L150 130L60 150Z', style: 'fill:' + T + ';fill-opacity:.35;stroke:' + T + ';stroke-width:3' }, g);
  txt(g, 94, 172, 'panneaux photovoltaïques', T, 'middle', 11, true);
  block(g, 170, 90, 62, 44, 'Régulateur', L, 10.5); block(g, 250, 90, 56, 44, 'Batterie', GOLD, 10.5); block(g, 320, 90, 70, 44, 'Onduleur', P, 10.5);
  ln(g, 150, 124, 170, 112, '#fff', 2.5); ln(g, 232, 112, 250, 112, '#fff', 2.5); ln(g, 306, 112, 320, 112, '#fff', 2.5);
  pathd(g, 'M355 134L355 170', 'rgba(255,255,255,.8)', 2.5); var lamp = circ(g, 355, 190, 16, GOLD, .15, 3); txt(g, 355, 226, 'éclairage (100 W)', 'rgba(255,255,255,.7)', 'middle', 10);
  var sl = ui.slider(el, { label: 'Ensoleillement', min: 0, max: 1000, value: 700, step: 50, color: GOLD, fmt: function (v) { return v + ' W/m²'; } }, paint);
  var bar = S('rect', { x: 252, y: 142, width: 52, height: 10, rx: 4, style: 'fill:' + GOLD }, g);
  function P0() { return 2 * sl.get() * .18; }
  function paint() { status(); info.set('Puissance du panneau ≈ surface (2 m²) × ensoleillement × rendement (18 %). Le <b>régulateur</b> protège la batterie, l’<b>onduleur</b> transforme le courant continu en courant alternatif pour l’éclairage.'); }
  function status() {
    var p = P0(); chips.set(ui.chip('Puissance produite ≈ ' + Math.round(p) + ' W', T) + ui.chip('Charge : 100 W', P) + ui.chip('Batterie : ' + Math.round(batt * 100) + ' %', GOLD));
    verd.set(p > 100 ? 'Production supérieure à la consommation : la batterie se charge.' : (batt > 0.02 ? 'Production insuffisante : la batterie se décharge.' : 'Batterie vide : plus d’éclairage.'), p > 100 ? 'ok' : '');
  }
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); var p = P0(), i; t += dt;
    circ(dyn, 40, 40, 16, GOLD, .8, 0); for (i = 0; i < 8; i++) { var an = i * .785 + t * .3; ln(dyn, 40 + Math.cos(an) * 22, 40 + Math.sin(an) * 22, 40 + Math.cos(an) * 30, 40 + Math.sin(an) * 30, GOLD, 2); }
    var n = Math.round(p / 80); for (i = 0; i < n; i++) { var q = ((t * .5 + i / Math.max(1, n)) % 1); ln(dyn, 64 + q * 40, 64 + q * 40, 64 + q * 40 + 8, 64 + q * 40 + 8, GOLD, 2.5); }
    batt = clamp(batt + (p - 100) / 100 * dt * .04, 0, 1);
    bar.setAttribute('width', 52 * batt); lamp.setAttribute('style', 'fill:' + GOLD + ';fill-opacity:' + (batt > .02 ? .85 : .12) + ';stroke:' + GOLD + ';stroke-width:3');
    if (Math.floor(t * 4) !== Math.floor((t - dt) * 4)) status();
  });
  paint();
}

function concentration(el) {
  var svg = ui.stage(el, 400, 250, 'Centrales à concentration et capteur thermique'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el), ctl = ui.controls(el);
  var cur = 'tour', ang = 60, sun = 50, t = 0;
  var D = {
    tour: { t: 'Centrale à tour', c: P, d: 'Des miroirs plans orientables (héliostats) renvoient les rayons du Soleil vers un récepteur placé en haut de la tour. Le fluide chauffé produit de la vapeur qui fait tourner une turbine, puis un alternateur.', k: 'électrique' },
    cyl: { t: 'Centrale cylindro-parabolique', c: GOLD, d: 'Des miroirs en forme de gouttière parabolique concentrent les rayons sur un tube placé au foyer. Le fluide du tube chauffe, produit de la vapeur, puis de l’électricité. Les miroirs suivent le Soleil.', k: 'électrique' },
    cap: { t: 'Capteur solaire plan', c: C, d: 'Une vitre laisse passer le Soleil et retient la chaleur (effet de serre). L’absorbeur noir chauffe l’eau qui circule dans des tubes. L’isolant limite les pertes.', k: 'thermique' }
  };
  function show(k) {
    cur = k; ctl.replaceChildren(); var d = D[k];
    if (k === 'cyl') ang = 0; if (k === 'cap') sun = 700; if (k === 'tour') sun = 50;
    if (k === 'tour') ui.slider(ctl, { label: 'Hauteur du Soleil', min: 20, max: 80, value: sun, step: 5, color: GOLD, fmt: function (v) { return v + '°'; } }, function (v) { sun = v; });
    else if (k === 'cyl') ui.slider(ctl, { label: 'Position du Soleil', min: -40, max: 40, value: 0, step: 5, color: GOLD, fmt: function (v) { return v + '°'; } }, function (v) { ang = v; });
    else ui.slider(ctl, { label: 'Ensoleillement', min: 100, max: 1000, value: 700, step: 50, color: GOLD, fmt: function (v) { return v + ' W/m²'; } }, function (v) { sun = v; });
    chips.set(ui.chip(d.t, d.c) + ui.chip('Énergie ' + d.k, d.c)); info.set('<b>' + d.t + '.</b> ' + d.d);
  }
  ui.tabs(el, [['tour', 'Centrale à tour'], ['cyl', 'Cylindro-parabolique'], ['cap', 'Capteur plan']], show);
  el.appendChild(ctl);
  show('tour');
  PC.anim(svg, function (dt) {
    dyn.replaceChildren(); t += dt; var i, d = D[cur];
    if (cur === 'tour') {
      var e = sun * Math.PI / 180, s = { x: -Math.cos(e), y: -Math.sin(e) }, rx = 330, ry = 62;
      ln(dyn, 20, 210, 380, 210, 'rgba(255,255,255,.25)', 2); S('path', { d: 'M322 210L338 210L334 70L326 70Z', style: 'fill:#fff;fill-opacity:.4' }, dyn);
      circ(dyn, rx, ry, 11, P, .5 + .4 * Math.sin(t * 3) * .5 + .3, 2);
      [50, 100, 150, 200, 250].forEach(function (x) {
        var tx = rx - x, ty = ry - 208, tl = Math.hypot(tx, ty), tv = { x: tx / tl, y: ty / tl }, nn = { x: s.x + tv.x, y: s.y + tv.y }, nl = Math.hypot(nn.x, nn.y); nn = { x: nn.x / nl, y: nn.y / nl };
        var mx = -nn.y * 14, my = nn.x * 14; ln(dyn, x - mx, 208 - my, x + mx, 208 + my, '#fff', 5);
        ln(dyn, x + s.x * 130, 208 + s.y * 130, x, 208, GOLD, 1.5); ln(dyn, x, 208, x + tv.x * tl, 208 + tv.y * tl, GOLD, 1.5);
      });
      txt(dyn, rx - 6, 52, 'récepteur', P, 'end', 10.5); circ(dyn, 30, 40, 12, GOLD, .8, 0);
    } else if (cur === 'cyl') {
      var f = 40, cx = 200, cy = 175, rad = ang * Math.PI / 180;
      var grp = S('g', { transform: 'rotate(' + ang + ' ' + cx + ' ' + cy + ')' }, dyn), pts = [];
      for (i = -9; i <= 9; i++) { var xx = i * 8.5; pts.push([cx + xx, cy - 45 + xx * xx / (4 * f)]); }
      pathd(grp, poly(pts), GOLD, 5);
      for (i = -4; i <= 4; i++) { var rxx = i * 15, ry0 = cy - 45 + rxx * rxx / (4 * f); ln(grp, cx + rxx, cy - 160, cx + rxx, ry0 - 2, GOLD, 1.5, '6 4'); ln(grp, cx + rxx, ry0, cx, cy - 45 + f, 'rgba(255,220,150,.6)', 1.2); }
      circ(grp, cx, cy - 45 + f, 5, C, .5 + .4 * Math.sin(t * 3) * .5 + .3, 2); txt(dyn, 330, 130, 'tube au foyer', C, 'middle', 10.5);
    } else {
      var q = sun / 1000;
      rect(dyn, 60, 90, 260, 80, C, .06, 6, 2); ln(dyn, 60, 90, 320, 90, '#9bd2ff', 3); ln(dyn, 64, 160, 316, 160, '#444', 8); ln(dyn, 64, 130, 316, 130, '#111', 6);
      txt(dyn, 190, 82, 'vitre', '#9bd2ff', 'middle', 10.5); txt(dyn, 190, 124, 'absorbeur noir + tubes', INK, 'middle', 10.5); txt(dyn, 190, 184, 'isolant', 'rgba(255,255,255,.6)', 'middle', 10.5);
      for (i = 0; i < 6; i++) { var xp = 80 + i * 40, yy = 30 + ((t * 40 + i * 9) % 60); ln(dyn, xp, yy, xp + 10, yy + 10, GOLD, 2); }
      for (i = 0; i < 8; i++) { var p = (t * .3 + i / 8) % 1; circ(dyn, 70 + p * 240, 130, 3.5, p < .5 ? '#6fb5ff' : C, .9, 0); }
      var T0 = 20 + 45 * q; txt(dyn, 190, 224, 'eau chauffée : environ ' + Math.round(T0) + ' °C (valeur indicative)', C, 'middle', 11.5);
    }
  });
}

PC.chapter({ id: 't3-13', lazy: true, eyebrow: EY + 'Module 5 · Énergies renouvelables', title: 'L’énergie solaire', ar: 'الطاقة الشمسية',
  lessons: function () { return [
    { short: 'Photovoltaïque', title: 'La centrale photovoltaïque', intro: 'Change l’ensoleillement : regarde la production, la batterie et l’éclairage.', build: photovoltaique,
      retenir: ['L’énergie solaire se transforme en <b>électricité</b> (photovoltaïque) ou en <b>chaleur</b> (thermique).', 'Installation photovoltaïque : panneaux, <b>régulateur</b>, <b>batterie</b> (stockage), <b>onduleur</b>, utilisation.'],
      ar: { e: ['تتحوّل الطاقة الشمسية إلى كهرباء (كهروضوئية) أو إلى حرارة (حرارية). التركيبة الكهروضوئية تتكون من الألواح والمنظِّم (régulateur) والبطارية للتخزين والمحوِّل (onduleur) ثم الاستعمال.'], u: 'غيّر شدة الإشعاع ولاحظ الإنتاج والبطارية والإنارة.', w: [['photovoltaïque', 'كهروضوئي'], ['régulateur', 'منظِّم الشحن'], ['batterie', 'بطارية'], ['onduleur', 'محوِّل التيار']] } },
    { short: 'Concentration', title: 'Concentrer la chaleur du Soleil', intro: 'Choisis une installation : observe comment les rayons sont dirigés ou comment la chaleur est retenue.', build: concentration,
      retenir: ['<b>Centrale à tour</b> : des héliostats renvoient les rayons vers un récepteur.', '<b>Cylindro-parabolique</b> : des miroirs concentrent les rayons sur un tube.', '<b>Capteur solaire plan</b> : vitre, absorbeur, tubes d’eau, isolant (solaire thermique).'],
      ar: { e: ['في محطة البرج تعكس مرايا مسطحة متحركة (héliostats) أشعة الشمس نحو مستقبِل في أعلى البرج. في المحطة الأسطوانية المكافئية تركّز مرايا مقعّرة الأشعة على أنبوب في البؤرة. أما اللاقط الشمسي المسطح فيسخّن الماء بفضل زجاج وماص أسود وعازل.'], u: 'اختر تركيبة ثم غيّر موقع الشمس أو شدتها.', w: [['centrale à tour', 'محطة البرج'], ['héliostat', 'مرآة متتبعة للشمس'], ['capteur solaire plan', 'لاقط شمسي مسطح'], ['absorbeur', 'ماصّ']] } }
  ]; },
  quiz: [
    { q: 'Quel appareil transforme le courant continu de la batterie en courant alternatif ?', o: ['l’onduleur', 'le régulateur', 'le panneau'], a: 0, e: 'L’onduleur alimente les appareils en courant alternatif.' },
    { q: 'Dans une centrale à tour, les héliostats :', o: ['renvoient les rayons vers le récepteur', 'produisent la vapeur', 'stockent l’eau'], a: 0, e: 'Ils suivent le Soleil et visent le récepteur.' },
    { q: 'Le solaire thermique produit surtout :', o: ['de la chaleur', 'du vent', 'du son'], a: 0, e: 'Un capteur plan chauffe de l’eau.' },
    { q: 'Le régulateur d’une installation photovoltaïque sert à :', o: ['protéger la batterie', 'produire de l’électricité', 'orienter les panneaux'], a: 0, e: 'Il évite les surcharges et les décharges profondes.' }
  ]
});

/* ===================================================== 14. EFFICACITÉ ÉNERGÉTIQUE ET PROJETS */
function etiquette(el) {
  var svg = ui.stage(el, 400, 250, 'Étiquette énergie, de A à G'), g = S('g', null, svg);
  var info = ui.info(el), chips = ui.chips(el), verd = ui.verdict(el);
  var CL = [['A', 90, '#2fa84f'], ['B', 120, '#7fb941'], ['C', 150, '#c9d13b'], ['D', 190, '#f3d035'], ['E', 230, '#f0a030'], ['F', 280, '#e8662e'], ['G', 340, '#d6322d']];
  var sel = 2, bars = [];
  CL.forEach(function (c, i) {
    var w = 90 + i * 22, y = 20 + i * 28;
    var r = S('path', { d: 'M20 ' + y + 'L' + (20 + w) + ' ' + y + 'L' + (30 + w) + ' ' + (y + 11) + 'L' + (20 + w) + ' ' + (y + 22) + 'L20 ' + (y + 22) + 'Z', style: 'fill:' + c[2] + ';cursor:pointer' }, g);
    txt(g, 30, y + 16, c[0], '#fff', 'start', 14, true); r.addEventListener('click', function () { sel = i; paint(); }); bars.push(r);
  });
  var out = S('g', null, g);
  var pr = ui.slider(el, { label: 'Prix du kWh', min: 0.8, max: 2.5, value: 1.5, step: 0.1, color: GOLD, fmt: function (v) { return fm(v, 1) + ' DH'; } }, paint);
  function paint() {
    bars.forEach(function (b, i) { b.style.opacity = i === sel ? 1 : .45; b.style.stroke = i === sel ? '#fff' : 'none'; b.style.strokeWidth = 2; });
    out.replaceChildren(); var kwh = CL[sel][1], p = pr.get(), cost = kwh * p, base = CL[0][1] * p;
    txt(out, 290, 70, 'Réfrigérateur', INK, 'middle', 12, true); txt(out, 290, 92, 'classe ' + CL[sel][0], CL[sel][2], 'middle', 20, true);
    txt(out, 290, 128, kwh + ' kWh par an', INK, 'middle', 14, true); txt(out, 290, 150, '≈ ' + Math.round(cost) + ' DH par an', GOLD, 'middle', 13, true);
    chips.set(ui.chip('Classe ' + CL[sel][0], CL[sel][2]) + ui.chip(kwh + ' kWh/an', GOLD) + ui.chip('Coût ≈ ' + Math.round(cost) + ' DH/an', GOLD));
    verd.set(sel === 0 ? 'Classe la plus efficace : consommation la plus faible.' : 'Par rapport à la classe A, tu paies ' + Math.round(cost - base) + ' DH de plus par an.', sel === 0 ? 'ok' : '');
    info.set('L’<b>efficacité énergétique</b> compare l’énergie consommée pour un même service rendu. Plus la classe est proche de A, moins l’appareil consomme. Valeurs d’exemple pour un même réfrigérateur : touche une classe.');
  }
  paint();
}
function exigences(el) {
  var svg = ui.stage(el, 400, 250, 'Diagramme des exigences du robot auto-tampon'), g = S('g', null, svg), dyn = S('g', null, svg);
  var info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el);
  var EX = [
    ['1.1', 'Énergie', 'S’alimenter avec une énergie embarquée.', 'Accumulateur 7,4 V'],
    ['1.2', 'Marche\nArrêt', 'Mettre le robot sous tension.', 'Interrupteur'],
    ['1.3', 'Départ', 'Synchroniser le circuit de temporisation de recul à la mise sous tension (5 s).', 'Circuit de\ntemporisation'],
    ['1.4', 'Propulsion', 'Se propulser sur le sol.', 'Deux moteurs'],
    ['1.5', 'Obstacles', 'Détecter l’obstacle par contact.', 'Pare-chocs'],
    ['1.6', 'Marche\narrière', 'Reculer si le robot touche un obstacle. Raffinement 1.6.1 : générer deux temporisations réglables et différentes.', 'Deux\ntemporisateurs']
  ];
  var W = 60, X0 = 4, GAP = 6, YB = 96;
  rect(g, 120, 6, 160, 40, P, .22, 8, 2); txt(g, 200, 22, 'Exigence 1', INK, 'middle', 10, true); txt(g, 200, 36, 'Se déplacer dans un espace contraint', INK, 'middle', 8.5);
  EX.forEach(function (e, i) {
    var x = X0 + i * (W + GAP);
    ln(g, 200, 46, x + W / 2, YB, 'rgba(255,255,255,.35)', 1.5);
    var r = rect(g, x, YB, W, 44, L, .2, 6, 2);
    txt(g, x + W / 2, YB + 14, e[0], GOLD, 'middle', 10, true);
    e[1].split('\n').forEach(function (l, k, a) { txt(g, x + W / 2, YB + 27 + k * 10 - (a.length - 1) * 3, l, INK, 'middle', 8.5); });
    var hit = S('rect', { x: x, y: YB, width: W, height: 44, style: 'fill:transparent;cursor:pointer' }, g);
    hit.addEventListener('click', function () { choose(i); });
    hit.setAttribute('tabindex', '0'); hit.setAttribute('role', 'button'); hit.setAttribute('aria-label', 'Exigence ' + e[0] + ' ' + e[1].replace('\n', ' '));
    hit.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); choose(i); } });
  });
  var queue, done, wrong;
  function start() { queue = PC.shuffle([0, 1, 2, 3, 4, 5]); done = {}; wrong = 0; paint(''); }
  function paint(msg) {
    dyn.replaceChildren();
    EX.forEach(function (e, i) {
      if (!done[i]) return; var x = X0 + i * (W + GAP);
      ln(dyn, x + W / 2, YB + 44, x + W / 2, 178, T, 2, '5 4'); txt(dyn, x + W / 2, 168, '« satisfy »', T, 'middle', 7.5);
      rect(dyn, x, 182, W, 44, T, .25, 6, 2);
      e[3].split('\n').forEach(function (l, k, a) { txt(dyn, x + W / 2, 202 + k * 10 - (a.length - 1) * 4, l, INK, 'middle', 8.5); });
    });
    var left = queue.length;
    if (left) {
      chips.set(ui.chip('Bloc à placer : ' + EX[queue[0]][3].replace('\n', ' '), T) + ui.chip('Restants : ' + left, GOLD));
      info.set(msg || 'Touche l’<b>exigence</b> que ce <b>bloc</b> permet de satisfaire.');
      verd.set('', '');
    } else {
      chips.set(ui.chip('Diagramme complet', T) + ui.chip('Erreurs : ' + wrong, wrong ? C : T));
      info.set(msg || 'Chaque bloc satisfait une exigence : c’est la liaison <b>« satisfy »</b>.');
      verd.set('Le diagramme est complet.', 'ok');
    }
  }
  function choose(i) {
    if (!queue.length || done[i]) return;
    if (queue[0] === i) { done[i] = true; var q = queue.shift(); paint('<b>Exact.</b> Exigence ' + EX[i][0] + ' : ' + EX[i][2]); }
    else { wrong++; paint('<b>Pas cette exigence.</b> Relis : ' + EX[queue[0]][3].replace('\n', ' ') + ' ne répond pas à « ' + EX[i][2].split('.')[0] + ' ».'); }
  }
  var ctl = ui.controls(el); ui.btn(ctl, 'Recommencer', start);
  start();
}
var PROJ = {
  eol: { t: 'Projet 1 · Éolienne', d: ['Utilisateur : produire de l’énergie électrique à partir du vent. Option : stocker l’énergie produite.', 'Éolienne, vent, batterie de stockage, utilisateur de l’énergie.', 'Produire une tension utilisable ; résister au vent ; stocker l’énergie ; coût réduit.', 'Pales et rotor, génératrice (petit moteur CC), mât, diode de protection, batterie, voyant de charge.'] },
  pv: { t: 'Projet 2 · Maisonnette solaire', d: ['Utilisateur : éclairer la maisonnette la nuit sans intervenir.', 'Maisonnette, Soleil, panneau photovoltaïque, obscurité, utilisateur.', 'Alimenter l’éclairage avec l’énergie solaire ; s’allumer à la tombée de la nuit ; s’éteindre le jour.', 'Panneau photovoltaïque, batterie, photorésistance (interrupteur crépusculaire), transistor ou relais, lampe.'] },
  th: { t: 'Projet 3 · Chauffe-eau solaire', d: ['Utilisateur : chauffer de l’eau et connaître sa température.', 'Capteur solaire plan, Soleil, eau, réservoir, utilisateur.', 'Chauffer l’eau grâce au Soleil ; mesurer et afficher la température de l’eau ; limiter les pertes de chaleur.', 'Capteur solaire plan, tubes, réservoir isolé, capteur de température, carte programmable, afficheur.'] }
};
function projets(el) {
  var info = ui.info(el), cur = 'eol';
  var NAMES = ['Diagramme de cas d’utilisation (le besoin)', 'Diagramme de contexte (l’environnement)', 'Diagramme des exigences (fonctions et contraintes)', 'Diagramme de définition de blocs (les solutions)'];
  function show() {
    var P0 = PROJ[cur]; info.set('<b>' + P0.t + '.</b> Le cahier des charges se décrit avec quatre diagrammes SysML :<ul style="margin:8px 0 0;padding-inline-start:18px">' + P0.d.map(function (x, i) { return '<li><b>' + NAMES[i] + '</b> : ' + x + '</li>'; }).join('') + '</ul>');
  }
  ui.tabs(el, [['eol', 'Éolienne'], ['pv', 'Maisonnette'], ['th', 'Chauffe-eau']], function (k) { cur = k; show(); });
  show();
}
PC.chapter({ id: 't3-14', lazy: true, eyebrow: EY + 'Module 5 · Énergies renouvelables', title: 'Efficacité énergétique et projets', ar: 'النجاعة الطاقية والمشاريع',
  lessons: function () { return [
    { short: 'Étiquette énergie', title: 'Lire une étiquette énergie', intro: 'Choisis une classe de A à G et regarde la consommation et le coût par an.', build: etiquette,
      retenir: ['L’<b>efficacité énergétique</b> mesure l’énergie nécessaire pour rendre un même service.', 'Sur l’étiquette énergie, la classe <b>A</b> est la plus économe et la classe <b>G</b> la plus gourmande.'],
      ar: { e: ['النجاعة الطاقية تقيس الطاقة اللازمة لتقديم الخدمة نفسها. في ملصق الطاقة، الفئة A هي الأكثر اقتصادا والفئة G هي الأكثر استهلاكا.'], u: 'اختر فئة من A إلى G ولاحظ الاستهلاك والتكلفة السنوية.', w: [['efficacité énergétique', 'نجاعة طاقية'], ['étiquette énergie', 'ملصق الطاقة'], ['classe', 'فئة']] } },
    { short: 'Projets', title: 'Les projets au choix', intro: 'Choisis un projet : lis son cahier des charges sous forme de quatre diagrammes.', build: projets,
      retenir: ['Chaque projet est décrit par un cahier des charges : <b>besoin</b>, <b>contexte</b>, <b>exigences</b>, <b>solutions techniques</b>.', 'Les projets utilisent les connaissances sur les énergies renouvelables et sur les fonctions techniques.'],
      ar: { e: ['كل مشروع يوصف بدفتر تحملات: الحاجة، سياق الاستعمال، المتطلبات والحلول التقنية، ويُعبَّر عنها بمخططات لغة SysML.'], u: 'اختر مشروعا لقراءة دفتر تحملاته.', w: [['cahier des charges', 'دفتر التحملات'], ['exigences', 'متطلبات']] } },
    { short: 'Exigences', title: 'Lire un diagramme des exigences', intro: 'Le robot auto-tampon : associe chaque bloc à l’exigence qu’il satisfait.', build: exigences,
      retenir: ['Une <b>exigence</b> est une fonction du système ou une contrainte. Un <b>bloc</b> est un composant qui la satisfait.', 'Liaisons : <b>contenance</b> (une exigence contient une autre), <b>raffinement</b> (précise une exigence), <b>satisfaction</b> (un bloc satisfait une exigence).'],
      ar: { e: ['المتطلّب (exigence) هو وظيفة للنظام أو قيد عليه، والكتلة (bloc) هي المكوّن الذي يحقّقه. أنواع الروابط: الاحتواء، والتدقيق (raffinement) الذي يوضّح متطلبا، والإشباع (satisfy) الذي يربط كتلة بالمتطلب الذي تحقّقه.'], u: 'اختر المتطلب الذي تحقّقه الكتلة المعروضة.', w: [['exigence', 'متطلّب'], ['bloc', 'كتلة'], ['raffinement', 'تدقيق'], ['satisfaction', 'إشباع']] } }
  ]; },
  quiz: [
    { q: 'Quelle classe de l’étiquette énergie est la plus économe ?', o: ['A', 'D', 'G'], a: 0, e: 'La classe A consomme le moins.' },
    { q: 'Deux appareils rendent le même service. Le moins gourmand a :', o: ['la meilleure efficacité énergétique', 'la moins bonne efficacité', 'aucune efficacité'], a: 0, e: 'Il consomme moins d’énergie pour le même service.' },
    { q: 'Le diagramme des exigences décrit :', o: ['les fonctions et les contraintes', 'les composants électroniques', 'les utilisateurs uniquement'], a: 0, e: 'Il précise ce que le système doit faire et ses limites.' },
    { q: 'Dans le projet « maisonnette solaire », l’éclairage est commandé par :', o: ['un interrupteur crépusculaire', 'une éolienne', 'un chauffe-eau'], a: 0, e: 'Une photorésistance détecte la tombée de la nuit.' },
    { q: 'Dans le robot auto-tampon, quel bloc détecte l’obstacle ?', o: ['le pare-chocs', 'l’accumulateur', 'l’interrupteur'], a: 0, e: 'Il détecte l’obstacle par contact.' },
    { q: 'La liaison « satisfy » relie :', o: ['un bloc à une exigence', 'deux utilisateurs', 'deux exigences contenues'], a: 0, e: 'Le bloc satisfait l’exigence.' }
  ]
});
