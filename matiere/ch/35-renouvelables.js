/* ===================================================== 3AC · MODULE 5 · ÉNERGIES RENOUVELABLES */
/* ---------- t3-11 : sources d'énergie ---------- */
function sourcesRenouv(el) {
  var d = function (n, s) { return function (g) { rect(g, 30, 28, 340, 80, GREEN, .08, 4, 1.8); txt(g, 200, 62, n, '#fff', 'middle', 15, true); txt(g, 200, 90, s, '#9fb8cc', 'middle', 11); }; };
  classify(el, 'Renouvelable ou non renouvelable ?', [
    { name: 'Le pétrole', cat: 1, why: 'Énergie fossile : formée en millions d’années, elle s’épuise.', draw: d('Le pétrole', 'fossile') },
    { name: 'Le vent', cat: 0, why: 'Il se renouvelle sans cesse.', draw: d('Le vent', 'éolien') },
    { name: 'Le charbon', cat: 1, why: 'Énergie fossile.', draw: d('Le charbon', 'fossile') },
    { name: 'Le rayonnement du Soleil', cat: 0, why: 'Source inépuisable à notre échelle.', draw: d('Le rayonnement du Soleil', 'solaire') },
    { name: 'La force de l’eau d’un barrage', cat: 0, why: 'Le cycle de l’eau la renouvelle.', draw: d('La force de l’eau', 'hydraulique') },
    { name: 'Le gaz naturel', cat: 1, why: 'Énergie fossile.', draw: d('Le gaz naturel', 'fossile') },
    { name: 'La chaleur du sous-sol', cat: 0, why: 'La géothermie est renouvelable.', draw: d('La chaleur du sous-sol', 'géothermie') },
    { name: 'L’uranium', cat: 1, why: 'Ressource en quantité limitée : non renouvelable.', draw: d('L’uranium', 'nucléaire') },
    { name: 'Les déchets végétaux (biomasse)', cat: 0, why: 'La matière végétale repousse.', draw: d('Déchets végétaux', 'biomasse') }
  ], ['Renouvelable', 'Non renouvelable'], 'Se reconstitue-t-elle vite à notre échelle ?');
}
function mixMaroc(el) {
  var svg = ui.stage(el, 400, 240, 'Puissance renouvelable installée au Maroc (fin 2025)'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), sel = -1;
  var M = [['Éolien', 2452, BLUE, 'Parcs comme Tarfaya (301 MW) : 131 éoliennes de 2,3 MW.'], ['Hydraulique', 1306, GREEN, 'Barrages hydroélectriques. Les STEP (814 MW) servent au stockage.'], ['Solaire', 1086, AMBER, '546 MW photovoltaïque + 540 MW à concentration (Noor Ouarzazate).']], TOT = 4851;
  function paint() { chips.set(ui.chip('total ≈ ' + TOT + ' MW', AMBER) + ui.chip('objectif 2030 : 52 % du parc', GREEN)); info.set(sel < 0 ? 'Touche une barre. Source des chiffres : <b>IRENA</b> (fin 2025). Le Maroc vise <b>52 %</b> d’énergies renouvelables dans la puissance installée en 2030.' : '<b>' + M[sel][0] + '</b> : ' + M[sel][1] + ' MW (' + Math.round(M[sel][1] / TOT * 100) + ' % du renouvelable). ' + M[sel][3]); draw(); }
  function draw() {
    dyn.replaceChildren(); var g = dyn, sc = 230 / 2600;
    M.forEach(function (m, i) { var y = 40 + i * 52, w = m[1] * sc, on = sel === i; var r = S('rect', { x: 96, y: y, width: w, height: 34, rx: 3, style: 'fill:' + m[2] + ';fill-opacity:' + (on ? .55 : .25) + ';stroke:' + m[2] + ';stroke-width:' + (on ? 3 : 1.8) }, g); hot(r, function () { sel = i; paint(); }, m[0]);
      txt(g, 90, y + 21, m[0], '#fff', 'end', 10, on); txt(g, 102 + w, y + 21, m[1] + ' MW', '#fff', 'start', 10.5, true); });
    var a = 0; M.forEach(function (m) { var w = m[1] / TOT * 340; S('rect', { x: 30 + a, y: 202, width: w, height: 16, style: 'fill:' + m[2] + ';fill-opacity:.5;stroke:#04080c;stroke-width:1' }, g); a += w; }); txt(g, 30, 196, 'répartition du renouvelable', '#7e9bb2', 'start', 8.5);
  }
  paint();
}
function impactCO2(el) {
  var svg = ui.stage(el, 400, 240, 'Émissions de CO₂ selon la source'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), kwh = 200;
  var S5 = [['Charbon', 820, RED], ['Gaz', 490, '#d97b3a'], ['Solaire PV', 45, AMBER], ['Hydraulique', 24, BLUE], ['Éolien', 11, GREEN]];
  ui.slider(el, { label: 'Consommation du mois', min: 50, max: 500, value: 200, step: 50, color: AMBER, fmt: function (v) { return v + ' kWh'; } }, function (v) { kwh = v; paint(); });
  function paint() { chips.set(ui.chip('charbon : ' + fm(kwh * .82, 0) + ' kg', RED) + ui.chip('éolien : ' + fm(kwh * .011, 1) + ' kg', GREEN)); info.set('Émissions sur tout le cycle de vie (valeurs médianes du GIEC, en g de CO₂ par kWh). Produire ' + kwh + ' kWh au charbon émet <b>' + Math.round(820 / 11) + ' fois</b> plus qu’avec l’éolien.'); draw(); }
  function draw() {
    dyn.replaceChildren(); var g = dyn, sc = 190 / 820;
    S5.forEach(function (s, i) { var y = 22 + i * 38, w = Math.max(3, s[1] * sc); S('rect', { x: 88, y: y, width: w, height: 24, rx: 3, style: 'fill:' + s[2] + ';fill-opacity:.35;stroke:' + s[2] + ';stroke-width:2' }, g); txt(g, 82, y + 16, s[0], '#fff', 'end', 10); txt(g, 94 + w, y + 12, s[1] + ' g/kWh', '#fff', 'start', 9); txt(g, 94 + w, y + 22, '→ ' + fm(kwh * s[1] / 1000, 1) + ' kg ce mois', s[2], 'start', 8.5, true); });
  }
  paint();
}
function autoconso(el) {
  var svg = ui.stage(el, 400, 250, 'Pourquoi stocker ? Une journée avec panneaux et batterie'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), PV = 4, BAT = 4;
  var C = [.3, .3, .3, .3, .3, .4, .8, 1.2, 1, .6, .5, .5, .7, .6, .5, .5, .6, .9, 1.4, 1.6, 1.5, 1.2, .8, .5];
  ui.slider(el, { label: 'Panneaux (puissance crête)', min: 1, max: 8, value: 4, step: 1, color: AMBER, fmt: function (v) { return v + ' kW'; } }, function (v) { PV = v; paint(); });
  ui.slider(el, { label: 'Batterie', min: 0, max: 12, value: 4, step: 2, color: GREEN, fmt: function (v) { return v + ' kWh'; } }, function (v) { BAT = v; paint(); });
  function pv(h) { return PV * .75 * Math.max(0, Math.sin(Math.PI * (h + .5 - 6) / 12)); }
  function sim() { var soc = 0, out = null, day; for (day = 0; day < 2; day++) { var r = { soc: [], grid: [], direct: 0, disch: 0, waste: 0, gridT: 0, cons: 0 }; for (var h = 0; h < 24; h++) { var p = pv(h), c = C[h], dir = Math.min(p, c), sur = p - dir, def = c - dir, ch = Math.min(sur, BAT - soc), dis = Math.min(def, soc), gr = def - dis; soc += ch - dis; r.soc.push(soc); r.grid.push(gr); r.direct += dir; r.disch += dis; r.waste += sur - ch; r.gridT += gr; r.cons += c; } out = r; } return out; }
  function paint() { var r = sim(); chips.set(ui.chip('autonomie ' + Math.round((r.direct + r.disch) / r.cons * 100) + ' %', GREEN) + ui.chip('achat réseau ' + fm(r.gridT, 1) + ' kWh', RED) + ui.chip('surplus perdu ' + fm(r.waste, 1) + ' kWh', AMBER)); info.set('Le soleil produit au milieu du jour, mais on consomme surtout <b>le matin et le soir</b>. La batterie <b>décale</b> l’énergie : sans elle, le surplus est perdu et le soir on achète au réseau.'); draw(r); }
  function draw(r) {
    dyn.replaceChildren(); var g = dyn, x0 = 30, w = 340, y0 = 200, hh = 150, ymax = Math.max(2, PV * .75 * 1.1, 1.8), X = function (h) { return x0 + h / 24 * w; }, Y = function (v) { return y0 - v / ymax * hh; }, h;
    ln(g, x0, y0, x0 + w, y0, '#37536b', 1.6); for (h = 0; h <= 24; h += 6) { ln(g, X(h), y0, X(h), y0 + 5, '#37536b', 1.4); txt(g, X(h), y0 + 17, h + ' h', '#7e9bb2', 'middle', 8.5); }
    var pp = [[X(0), Y(0)]]; for (h = 0; h < 24; h++) { pp.push([X(h + .5), Y(pv(h))]); } pp.push([X(24), Y(0)]); S('path', { d: 'M' + pp.map(function (p) { return p[0] + ' ' + p[1]; }).join('L') + 'Z', style: 'fill:' + AMBER + ';fill-opacity:.2;stroke:' + AMBER + ';stroke-width:2' }, g);
    for (h = 0; h < 24; h++) { S('rect', { x: X(h) + 1, y: Y(C[h]), width: w / 24 - 2, height: y0 - Y(C[h]), style: 'fill:none;stroke:' + BLUE + ';stroke-width:1.6' }, g); if (r.grid[h] > .01) S('rect', { x: X(h) + 3, y: Y(r.grid[h]), width: w / 24 - 6, height: y0 - Y(r.grid[h]), style: 'fill:' + RED + ';fill-opacity:.6' }, g); }
    if (BAT > 0) { var sp = r.soc.map(function (v, i) { return [X(i + .5), y0 + 0 - v / BAT * 28 - 0]; }); sp.forEach(function (p) { p[1] = 232 - (232 - 216) * 0 - (p[1] - 0) * 0; }); var sl = r.soc.map(function (v, i) { return [X(i + .5), 238 - v / BAT * 22]; }); wire(g, sl, GREEN, 2.2); txt(g, 372, 218, 'batterie', GREEN, 'end', 8.5); }
    txt(g, 30, 24, 'production', AMBER, 'start', 9); txt(g, 100, 24, 'consommation', BLUE, 'start', 9); txt(g, 190, 24, 'achat au réseau', RED, 'start', 9);
  }
  paint();
}
PC.chapter({ id: 't3-11', lazy: true, eyebrow: EY + 'Module 5 · Énergies renouvelables', title: 'Sources d’énergie renouvelables et non renouvelables', ar: 'مصادر الطاقة المتجددة وغير المتجددة',
  lessons: function () { return [
    { short: 'Classer', title: 'Classer les sources d’énergie', intro: 'Renouvelable ou non renouvelable ?', build: sourcesRenouv,
      retenir: ['<b>Fossiles</b> (pétrole, charbon, gaz) et uranium : non renouvelables.', '<b>Renouvelables</b> : Soleil, vent, eau, biomasse, géothermie.'],
      ar: { e: ['الوقود الأحفوري واليورانيوم غير متجددة، أما الشمس والرياح والماء والكتلة الحيوية فمتجددة.'], u: 'صنّف.', w: [['énergie renouvelable', 'طاقة متجددة'], ['énergie fossile', 'طاقة أحفورية']] } },
    { short: 'Le Maroc', title: 'Le Maroc en 2025', intro: 'Touche une barre : éolien, hydraulique, solaire.', build: mixMaroc,
      retenir: ['Environ <b>4 850 MW</b> renouvelables fin 2025.', 'L’<b>éolien</b> est la première source, devant l’hydraulique et le solaire.', 'Objectif : <b>52 %</b> de la puissance installée en 2030.'],
      ar: { e: ['حوالي 4850 ميغاواط من المتجددة نهاية 2025، والهدف 52 في المئة سنة 2030.'], u: 'المس عمودا.', w: [['éolien', 'ريحي'], ['hydraulique', 'مائي'], ['solaire', 'شمسي']] } },
    { short: 'Impact', title: 'Impact sur l’environnement', intro: 'Compare le CO₂ émis pour la même énergie.', build: impactCO2,
      retenir: ['Le charbon émet environ <b>800 g</b> de CO₂ par kWh, l’éolien environ <b>11 g</b>.', 'Les renouvelables réduisent aussi les polluants nocifs pour la santé.'],
      ar: { e: ['الفحم ينتج نحو 800 غ من ثاني أكسيد الكربون لكل كيلواط ساعة والريح نحو 11 غ.'], u: 'غيّر الاستهلاك.', w: [['émissions', 'انبعاثات']] } },
    { short: 'Stocker', title: 'Pourquoi stocker l’énergie ?', intro: 'Ajoute une batterie : le soir, qui fournit ?', build: autoconso,
      retenir: ['Le soleil et le vent sont <b>intermittents</b>.', 'Le <b>stockage</b> décale l’énergie du moment où on la produit vers le moment où on l’utilise.'],
      ar: { e: ['الشمس والرياح متقطعتان، والتخزين ينقل الطاقة من وقت إنتاجها إلى وقت استعمالها.'], u: 'غيّر البطارية.', w: [['stockage', 'تخزين'], ['intermittence', 'تقطّع']] } }
  ]; },
  quiz: [
    { q: 'Le gaz naturel est :', o: ['non renouvelable', 'renouvelable', 'inépuisable'], a: 0, e: 'Énergie fossile.' },
    { q: 'La première source renouvelable installée au Maroc fin 2025 est :', o: ['l’éolien', 'le solaire', 'la biomasse'], a: 0, e: 'Environ 2 450 MW.' },
    { q: 'Pour le même kWh, le charbon émet environ combien de fois plus de CO₂ que l’éolien ?', o: ['70 fois', '2 fois', '5 fois'], a: 0, e: '820 ÷ 11 ≈ 75.' },
    { q: 'Le stockage sert à :', o: ['décaler l’énergie dans le temps', 'produire du vent', 'refroidir les panneaux'], a: 0, e: 'Produire le jour, utiliser le soir.' }
  ]
});

/* ---------- t3-12 : hydroélectricité et éolienne ---------- */
function hydroPuissance(el) {
  var svg = ui.stage(el, 400, 240, 'Centrale hydroélectrique : P = ρ × g × Q × H × η'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), H = 100, Q = 40, t = 0;
  ui.slider(el, { label: 'Hauteur de chute H', min: 20, max: 300, value: 100, step: 10, color: BLUE, fmt: function (v) { return v + ' m'; } }, function (v) { H = v; paint(); });
  ui.slider(el, { label: 'Débit Q', min: 5, max: 100, value: 40, step: 5, color: AMBER, fmt: function (v) { return v + ' m³/s'; } }, function (v) { Q = v; paint(); });
  function Pm() { return 1000 * 9.81 * Q * H * .9 / 1e6; }
  function paint() { chips.set(ui.chip('P ≈ ' + fm(Pm(), 1) + ' MW', AMBER) + ui.chip('η = 90 %', BLUE)); info.set('L’eau qui tombe de <b>H</b> avec un débit <b>Q</b> fait tourner la turbine. Doubler H <b>ou</b> Q double la puissance.'); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var g = dyn, top = 200 - (H / 300) * 150 - 10, i;
    S('path', { d: 'M20 ' + top + 'L20 215L140 215L140 200L100 ' + top + 'Z', style: 'fill:#37536b;fill-opacity:.5;stroke:#7e9bb2;stroke-width:2' }, g);
    S('path', { d: 'M0 ' + (top + 8) + 'L100 ' + (top + 8) + 'L100 215L0 215Z', style: 'fill:' + BLUE + ';fill-opacity:.25' }, g); txt(g, 50, top - 2, 'retenue', BLUE, 'middle', 9);
    S('rect', { x: 140, y: 200, width: 60, height: 15, style: 'fill:#0d1620;stroke:#7e9bb2;stroke-width:2' }, g); ln(g, 140, top + 14, 140, 200, BLUE, 3); dimV(g, 160, top + 8, 200, 'H = ' + H + ' m', AMBER);
    var rr = Q / 100 * 14 + 2; for (i = 0; i < 6; i++) { var u = (t * (.4 + Q / 100) + i / 6) % 1; circ(g, 135, top + 20 + u * (200 - top - 24), 2 + rr * .08, BLUE, .8, 0); }
    circ(g, 230, 195, 18, AMBER, .15, 2.4); for (i = 0; i < 4; i++) { var a = t * Q / 8 + i * 1.571; ln(g, 230 + Math.cos(a) * 4, 195 + Math.sin(a) * 4, 230 + Math.cos(a) * 16, 195 + Math.sin(a) * 16, AMBER, 2.4); }
    txt(g, 230, 228, 'turbine', AMBER, 'middle', 9); ln(g, 248, 195, 290, 195, '#37536b', 3); S('rect', { x: 290, y: 178, width: 36, height: 34, rx: 4, style: 'fill:' + GREEN + ';fill-opacity:.2;stroke:' + GREEN + ';stroke-width:2' }, g); txt(g, 308, 200, 'G', '#fff', 'middle', 14, true); txt(g, 308, 224, 'alternateur', GREEN, 'middle', 8.5);
    wire(g, [[326, 195], [372, 195], [372, 120]], AMBER, 2.4); flow(g, [[326, 195], [372, 195], [372, 120]], (t * .5) % 1, 5, AMBER, 2.4); txt(g, 372, 110, fm(Pm(), 0) + ' MW', AMBER, 'middle', 11, true);
  }); paint();
}
function stepStockage(el) {
  narrated(el, 400, 230, 'STEP : station de transfert d’énergie par pompage', [
    { t: 'Surplus', d: 'La nuit, l’électricité est abondante : une pompe monte l’eau dans le bassin haut.' },
    { t: 'Stockage', d: 'L’eau en hauteur contient de l’énergie, prête à servir.' },
    { t: 'Pointe', d: 'Au pic de consommation, l’eau redescend et fait tourner la turbine.' }
  ], function (g, k, t, dt) {
    var hi = k === 0 ? .4 + (t * .1 % .5) : (k === 1 ? .9 : .9 - (t * .1 % .5)), lo = 1 - hi + .05;
    S('rect', { x: 20, y: 30, width: 110, height: 54, style: 'fill:#0d1620;stroke:#7e9bb2;stroke-width:2' }, g); S('rect', { x: 22, y: 84 - 52 * Math.min(.95, hi), width: 106, height: 52 * Math.min(.95, hi), style: 'fill:' + BLUE + ';fill-opacity:.4' }, g); txt(g, 75, 24, 'bassin haut', '#9fb8cc', 'middle', 9);
    S('rect', { x: 20, y: 150, width: 110, height: 54, style: 'fill:#0d1620;stroke:#7e9bb2;stroke-width:2' }, g); var l2 = Math.max(.05, Math.min(.95, lo)); S('rect', { x: 22, y: 204 - 52 * l2, width: 106, height: 52 * l2, style: 'fill:' + BLUE + ';fill-opacity:.4' }, g); txt(g, 75, 222, 'bassin bas', '#9fb8cc', 'middle', 9);
    ln(g, 130, 74, 210, 74, '#37536b', 7); ln(g, 210, 74, 210, 184, '#37536b', 7); ln(g, 130, 184, 210, 184, '#37536b', 7);
    var path = k === 0 ? [[130, 184], [210, 184], [210, 74], [130, 74]] : (k === 2 ? [[130, 74], [210, 74], [210, 184], [130, 184]] : null);
    if (path) flow(g, path, (t * .5) % 1, 7, BLUE, 3.2);
    S('rect', { x: 188, y: 118, width: 44, height: 28, rx: 4, style: 'fill:' + (k === 2 ? GREEN : (k === 0 ? AMBER : WIRE)) + ';fill-opacity:.2;stroke:' + (k === 2 ? GREEN : (k === 0 ? AMBER : WIRE)) + ';stroke-width:2.4' }, g); txt(g, 210, 136, k === 0 ? 'pompe' : (k === 2 ? 'turbine' : '—'), '#fff', 'middle', 9.5, true);
    ln(g, 232, 132, 290, 132, k === 1 ? '#2a4660' : AMBER, 3); S('rect', { x: 290, y: 108, width: 70, height: 48, rx: 6, style: 'fill:' + BLUE + ';fill-opacity:.12;stroke:' + BLUE + ';stroke-width:2.2' }, g); txt(g, 325, 128, 'réseau', '#fff', 'middle', 10, true); txt(g, 325, 144, k === 0 ? '← prend' : (k === 2 ? 'fournit →' : 'repos'), k === 2 ? GREEN : (k === 0 ? AMBER : '#7e9bb2'), 'middle', 9);
    txt(g, 200, 12, 'rendement du cycle supérieur à 80 % · STEP Abdelmoumen : 350 MW', '#7e9bb2', 'middle', 8.5);
  });
}
function eolienneCourbe(el) {
  var svg = ui.stage(el, 400, 250, 'Éolienne : puissance selon la vitesse du vent'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), v = 8, t = 0, ang = 0, PR = 2.3;
  ui.slider(el, { label: 'Vitesse du vent', min: 0, max: 30, value: 8, step: 1, color: BLUE, fmt: function (x) { return x + ' m/s'; } }, function (x) { v = x; paint(); });
  function P(x) { if (x < 3 || x >= 25) return 0; if (x >= 12) return PR; return PR * (x * x * x - 27) / (1728 - 27); }
  function st() { return v < 3 ? 'à l’arrêt : vent trop faible' : (v >= 25 ? 'arrêt de sécurité : vent trop fort' : (v >= 12 ? 'puissance nominale' : 'production croissante')); }
  function paint() { chips.set(ui.chip('P = ' + fm(P(v), 2) + ' MW', P(v) > 0 ? AMBER : RED) + ui.chip(st(), P(v) > 0 ? GREEN : RED)); info.set('Démarrage à <b>3 m/s</b>, puissance nominale (2,3 MW) à partir de <b>12 m/s</b>, arrêt de sécurité à <b>25 m/s</b>. Le parc de Tarfaya compte 131 éoliennes de ce type : 301 MW.'); }
  PC.anim(svg, function (dt) {
    t += dt; var run = P(v) > 0; ang += dt * (run ? Math.min(v, 12) * .22 : 0); dyn.replaceChildren(); var g = dyn;
    ln(g, 70, 196, 70, 100, '#9fb8cc', 5); S('rect', { x: 62, y: 92, width: 22, height: 12, rx: 2, style: 'fill:#9fb8cc' }, g); circ(g, 56, 98, 5, '#fff', .9, 0);
    for (var i = 0; i < 3; i++) { var a = ang + i * 2.094; ln(g, 56, 98, 56 + Math.cos(a) * 52, 98 + Math.sin(a) * 52, '#fff', 3.4); }
    ln(g, 20, 196, 120, 196, '#37536b', 2); for (var w = 0; w < 3; w++) { var xx = ((t * (v * 3 + 10) + w * 40) % 100); if (v > 0) ln(g, 6 + xx * .1, 60 + w * 40, 18 + xx * .1 + v, 60 + w * 40, BLUE, 1.4); }
    var x0 = 160, y0 = 190, wd = 220, hh = 120; ln(g, x0, y0, x0 + wd, y0, '#37536b', 1.6); ln(g, x0, y0, x0, y0 - hh, '#37536b', 1.6);
    var pts = []; for (var x = 0; x <= 30; x += .5) pts.push([x0 + x / 30 * wd, y0 - P(x) / PR * (hh - 14)]); wire(g, pts, AMBER, 2.6);
    [0, 5, 10, 15, 20, 25, 30].forEach(function (m) { txt(g, x0 + m / 30 * wd, y0 + 14, m + '', '#7e9bb2', 'middle', 8.5); }); txt(g, x0 + wd, y0 + 28, 'vent (m/s)', '#7e9bb2', 'end', 8.5); txt(g, x0 - 6, y0 - hh + 6, '2,3 MW', '#7e9bb2', 'end', 8.5);
    circ(g, x0 + v / 30 * wd, y0 - P(v) / PR * (hh - 14), 6, run ? GREEN : RED, 1, 0); [[3, 'démarrage'], [12, 'nominale'], [25, 'arrêt']].forEach(function (m) { ln(g, x0 + m[0] / 30 * wd, y0, x0 + m[0] / 30 * wd, y0 - hh + 6, '#2a4660', 1, '3 3'); txt(g, x0 + m[0] / 30 * wd, y0 - hh, m[1], '#7e9bb2', 'middle', 7.5); });
    txt(g, 70, 230, st(), run ? GREEN : RED, 'middle', 9, true);
  }); paint();
}
function eolienneParties(el) {
  var svg = ui.stage(el, 400, 240, 'Les constituants d’une éolienne : touche une pièce'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), sel = '', t = 0, ang = 0;
  var D = { pales: ['Pales', 'captent l’énergie du vent et se mettent en rotation.'], rotor: ['Rotor (moyeu)', 'porte les pales et tourne lentement, environ 15 tours par minute.'], multi: ['Multiplicateur', 'augmente la vitesse de rotation pour le générateur.'], gen: ['Générateur', 'transforme l’énergie de rotation en énergie électrique.'], nac: ['Nacelle', 'abrite le multiplicateur et le générateur et s’oriente face au vent.'], mat: ['Mât', 'élève le rotor là où le vent est plus fort et plus régulier.'], anemo: ['Anémomètre', 'mesure le vent : il commande le démarrage et l’arrêt de sécurité.'], trans: ['Transformateur', 'élève la tension pour injecter l’électricité dans le réseau.'] };
  function paint() { chips.set(sel ? ui.chip(D[sel][0], AMBER) : ui.chip('8 pièces à découvrir', BLUE)); info.set(sel ? '<b>' + D[sel][0] + '</b> : ' + D[sel][1] : 'Touche une pièce pour lire sa <b>fonction</b>.'); }
  PC.anim(svg, function (dt) {
    t += dt; ang += dt * 1.4; dyn.replaceChildren(); var g = dyn;
    function part(k, shape) { shape.style.cursor = 'pointer'; hot(shape, function () { sel = k; paint(); }, D[k][0]); var on = sel === k; shape.style.fillOpacity = on ? .6 : .25; shape.style.stroke = on ? AMBER : shape.getAttribute('data-c'); shape.style.strokeWidth = on ? 3.4 : 2; return shape; }
    function R(k, x, y, w, h, c) { var r = S('rect', { x: x, y: y, width: w, height: h, rx: 3, 'data-c': c, style: 'fill:' + c + ';stroke:' + c }, g); return part(k, r); }
    R('mat', 192, 130, 14, 76, '#9fb8cc'); R('nac', 150, 92, 100, 38, BLUE); R('multi', 164, 102, 26, 18, GREEN); R('gen', 204, 102, 30, 18, RED); ln(g, 190, 111, 204, 111, '#fff', 2);
    for (var i = 0; i < 3; i++) { var a = ang + i * 2.094; var bl = S('path', { d: 'M' + 150 + ' ' + 111 + 'L' + (150 + Math.cos(a - .08) * 70) + ' ' + (111 + Math.sin(a - .08) * 70) + 'L' + (150 + Math.cos(a + .08) * 70) + ' ' + (111 + Math.sin(a + .08) * 70) + 'Z', 'data-c': '#fff', style: 'fill:#fff;stroke:#fff' }, g); part('pales', bl); }
    var hub = S('circle', { cx: 150, cy: 111, r: 9, 'data-c': AMBER, style: 'fill:' + AMBER + ';stroke:' + AMBER }, g); part('rotor', hub);
    ln(g, 232, 92, 232, 80, '#fff', 2); var an = S('rect', { x: 226, y: 74, width: 12, height: 6, 'data-c': '#fff', style: 'fill:#fff;stroke:#fff' }, g); part('anemo', an);
    R('trans', 290, 176, 34, 30, GREEN); wire(g, [[199, 206], [199, 216], [307, 216], [307, 206]], AMBER, 2); ln(g, 20, 206, 380, 206, '#37536b', 2);
    txt(g, 307, 170, 'transformateur', '#9fb8cc', 'middle', 8);
  }); paint();
}
PC.chapter({ id: 't3-12', lazy: true, eyebrow: EY + 'Module 5 · Énergies renouvelables', title: 'Hydroélectricité et éolienne', ar: 'الطاقة الكهرومائية والمراوح الريحية',
  lessons: function () { return [
    { short: 'Hydroélectricité', title: 'La puissance d’une chute d’eau', intro: 'Hauteur et débit : combien de mégawatts ?', build: hydroPuissance,
      retenir: ['La turbine est entraînée par l’eau qui tombe.', 'P = ρ × g × Q × H × η : plus la chute et le débit sont grands, plus P est grande.'],
      ar: { e: ['القدرة تزداد بزيادة ارتفاع السقوط وتدفق الماء.'], u: 'غيّر الارتفاع والتدفق.', w: [['turbine', 'عنفة'], ['barrage', 'سد'], ['débit', 'تدفق']] } },
    { short: 'STEP', title: 'Stocker l’eau : la STEP', intro: 'Pompe la nuit, turbine au pic de consommation.', build: stepStockage,
      retenir: ['Une <b>STEP</b> stocke l’énergie en montant l’eau dans un bassin haut.', 'Elle la restitue en turbinant, avec un rendement de plus de 80 %.'],
      ar: { e: ['محطة التحويل بالضخ تخزّن الطاقة برفع الماء إلى حوض عال ثم تعيدها بتوليد الكهرباء.'], u: 'تنقّل بين المراحل.', w: [['STEP', 'محطة تحويل الطاقة بالضخ']] } },
    { short: 'Éolienne', title: 'Les pièces d’une éolienne', intro: 'Touche une pièce pour lire sa fonction.', build: eolienneParties,
      retenir: ['Pales → rotor → multiplicateur → générateur → transformateur.', 'La nacelle abrite la chaîne mécanique et électrique.'],
      ar: { e: ['الريح تدير الشفرات ثم المضاعف ثم المولّد ثم المحوّل نحو الشبكة.'], u: 'المس قطعة.', w: [['pale', 'شفرة'], ['nacelle', 'الغرفة العلوية'], ['générateur', 'مولّد']] } },
    { short: 'Courbe de puissance', title: 'Le vent et la puissance', intro: 'Fais varier le vent : démarrage, nominale, arrêt.', build: eolienneCourbe,
      retenir: ['Démarrage vers <b>3 m/s</b>, nominale vers <b>12 m/s</b>, arrêt vers <b>25 m/s</b>.', 'La puissance croît très vite avec le vent.'],
      ar: { e: ['تبدأ التوربينة عند حوالي 3 م/ث وتبلغ قدرتها الاسمية عند 12 م/ث وتتوقف عند 25 م/ث.'], u: 'غيّر سرعة الريح.', w: [['vent', 'ريح']] } }
  ]; },
  quiz: [
    { q: 'Q = 50 m³/s, H = 100 m, η = 0,9. La puissance vaut environ :', o: ['44 MW', '4,4 MW', '440 MW'], a: 0, e: '1000 × 9,81 × 50 × 100 × 0,9 = 44 MW.' },
    { q: 'La STEP pompe l’eau vers le bassin haut :', o: ['quand l’électricité est abondante', 'au pic de consommation', 'jamais'], a: 0, e: 'Surplus, souvent la nuit.' },
    { q: 'Le multiplicateur d’une éolienne :', o: ['augmente la vitesse de rotation', 'mesure le vent', 'abaisse la tension'], a: 0, e: 'Il adapte la vitesse au générateur.' },
    { q: 'À 30 m/s, une éolienne :', o: ['s’arrête par sécurité', 'produit au maximum', 'démarre'], a: 0, e: 'Arrêt vers 25 m/s.' }
  ]
});

/* ---------- t3-13 : solaire ---------- */
function orientationPanneau(el) {
  var svg = ui.stage(el, 400, 240, 'Orienter un panneau vers le Soleil'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), beta = 30, h = 60;
  ui.slider(el, { label: 'Hauteur du Soleil', min: 15, max: 80, value: 60, step: 5, color: AMBER, fmt: function (v) { return v + '°'; } }, function (v) { h = v; paint(); });
  ui.slider(el, { label: 'Inclinaison du panneau', min: 0, max: 90, value: 30, step: 5, color: BLUE, fmt: function (v) { return v + '°'; } }, function (v) { beta = v; paint(); });
  function eff() { return Math.max(0, Math.cos(((90 - h) - beta) * Math.PI / 180)); }
  function paint() { var e = Math.round(eff() * 100); chips.set(ui.chip('captation ' + e + ' %', e > 90 ? GREEN : (e > 70 ? AMBER : RED)) + ui.chip('idéal : ' + (90 - h) + '°', BLUE)); info.set('Le panneau capte le plus quand les rayons arrivent <b>perpendiculaires</b>. L’inclinaison idéale vaut <b>90° moins la hauteur du Soleil</b>. Au Maroc (latitude ≈ 31°), on incline souvent vers 30°, plein sud.'); draw(); }
  function draw() {
    dyn.replaceChildren(); var g = dyn, cx = 150, cy = 190; ln(g, 20, cy, 380, cy, '#37536b', 2);
    var sx = cx + 210 * Math.cos(h * Math.PI / 180), sy = cy - 210 * Math.sin(h * Math.PI / 180); if (sx > 370) sx = 370; var sdx = Math.cos(h * Math.PI / 180), sdy = -Math.sin(h * Math.PI / 180);
    circ(g, cx + 160 * sdx + 10, cy + 160 * sdy, 14, AMBER, .6, 2.4);
    var L = 70, b = beta * Math.PI / 180, px = cx - Math.cos(b) * L / 2, py = cy - Math.sin(b) * L / 2 * 0, ex = cx + Math.cos(b) * L / 2;
    var x1 = cx - L / 2 * Math.cos(b), y1 = cy - 5 + L / 2 * Math.sin(b) * 0, x2 = cx + L / 2 * Math.cos(b), y2 = cy - 5 - L * Math.sin(b);
    var ax = cx + 35, ay = cy - 5, bx = cx + 35 - L * Math.cos(b), by = cy - 5 - L * Math.sin(b);
    ln(g, ax, ay, bx, by, BLUE, 8); ln(g, ax, ay, bx, by, '#fff', 2);
    var mx = (ax + bx) / 2, my = (ay + by) / 2, nx = Math.sin(b), ny = Math.cos(b) * -1 * -1; ln(g, mx, my, mx + Math.sin(b) * 40, my - Math.cos(b) * 40, GREEN, 1.4, '4 3'); txt(g, mx + Math.sin(b) * 48, my - Math.cos(b) * 44, 'normale', GREEN, 'middle', 8);
    for (var i = -2; i <= 2; i++) { var ox = mx + i * 14 * -sdy * 1 + 0, oy = my + i * 14 * sdx; var x0 = ox + sdx * 140, y0 = oy + sdy * 140; ln(g, x0, y0, ox, oy, AMBER, 1.6); }
    S('path', { d: 'M20 ' + cy + 'L' + (20 + 40) + ' ' + cy, style: 'stroke:none' }, g); txt(g, 330, 214, 'plein sud →', '#7e9bb2', 'end', 9);
    var e = eff(); S('rect', { x: 300, y: 40, width: 16, height: 120, rx: 3, style: 'fill:none;stroke:#37536b;stroke-width:1.6' }, g); S('rect', { x: 301, y: 160 - 118 * e, width: 14, height: 118 * e, rx: 2, style: 'fill:' + (e > .9 ? GREEN : (e > .7 ? AMBER : RED)) + ';fill-opacity:.6' }, g); txt(g, 308, 32, 'énergie captée', '#9fb8cc', 'middle', 8.5);
  }
  paint();
}
function centralePV(el) {
  var S5 = [['Panneau', 'Produit du courant continu à partir de la lumière.'], ['Régulateur', 'Protège la batterie contre les surcharges et les décharges profondes.'], ['Batterie', 'Stocke l’énergie pour la nuit.'], ['Onduleur', 'Convertit le continu en alternatif 220 V pour les appareils.'], ['Appareils', 'Consomment : éclairage, télévision…']];
  narrated(el, 400, 230, 'Centrale solaire photovoltaïque autonome', S5.map(function (s) { return { t: s[0], d: s[1] }; }), function (g, k, t, dt) {
    var X = [40, 120, 200, 280, 360], i, path = [];
    circ(g, 40, 30, 14, AMBER, .6, 0); for (i = 0; i < 8; i++) { var a = i * .785 + t * .5; ln(g, 40 + Math.cos(a) * 18, 30 + Math.sin(a) * 18, 40 + Math.cos(a) * 26, 30 + Math.sin(a) * 26, AMBER, 1.6); }
    for (i = 0; i < 5; i++) {
      var on = i === k, c = on ? AMBER : (i < k ? GREEN : '#37536b'); S('rect', { x: X[i] - 32, y: 90, width: 64, height: 54, rx: 6, style: 'fill:' + c + ';fill-opacity:' + (on ? .25 : .07) + ';stroke:' + c + ';stroke-width:' + (on ? 3 : 1.6) }, g); txt(g, X[i], 122, S5[i][0], on ? '#fff' : '#9fb8cc', 'middle', 9.5, on);
      if (i < 4) { ln(g, X[i] + 32, 117, X[i + 1] - 32, 117, i < k ? AMBER : '#2a4660', 2.6); if (i < k) { var u = (t * .7 + i * .3) % 1; circ(g, X[i] + 32 + u * 16, 117, 3, AMBER, 1, 0); } }
    }
    txt(g, 160, 168, 'courant continu (12 V)', BLUE, 'middle', 9); ln(g, 40, 160, 240, 160, BLUE, 1.2); txt(g, 330, 168, 'alternatif 220 V', GREEN, 'middle', 9); ln(g, 250, 160, 390, 160, GREEN, 1.2);
    txt(g, 200, 208, S5[k][1], '#cfe0ee', 'middle', 10);
  });
}
function concentrationSolaire(el) {
  var svg = ui.stage(el, 400, 250, 'Concentrer la chaleur du Soleil'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), mode = 'cyl', sun = 60, t = 0;
  ui.tabs(el, [['cyl', 'Cylindro-parabolique'], ['tour', 'Centrale à tour']], function (k) { mode = k; paint(); });
  ui.slider(el, { label: 'Hauteur du Soleil', min: 20, max: 80, value: 60, step: 5, color: AMBER, fmt: function (v) { return v + '°'; } }, function (v) { sun = v; });
  function paint() { chips.set(mode === 'cyl' ? ui.chip('Noor I : 160 MW · Noor II : 200 MW', AMBER) + ui.chip('stockage 3 h puis 7 h', GREEN) : ui.chip('Noor III : 150 MW', AMBER) + ui.chip('stockage environ 7 à 8 h', GREEN)); info.set(mode === 'cyl' ? 'Des miroirs en <b>auget parabolique</b> suivent le Soleil et concentrent la lumière sur un <b>tube</b> où circule un fluide chaud. Il produit de la vapeur qui entraîne une turbine. Des <b>sels fondus</b> stockent la chaleur.' : 'Des centaines de miroirs mobiles (<b>héliostats</b>) renvoient la lumière vers le haut d’une <b>tour</b>. La chaleur obtenue produit de la vapeur, et des sels fondus la stockent pour la nuit.'); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var g = dyn, th = sun * Math.PI / 180, sdx = Math.cos(th), sdy = -Math.sin(th); ln(g, 20, 200, 380, 200, '#37536b', 2);
    circ(g, 340, 200 + sdy * 170 * .0 - 0, 0, AMBER, 0, 0);
    var sxp = 200 + sdx * 180, syp = 200 + sdy * 180; if (syp < 24) syp = 24; circ(g, Math.min(370, sxp), syp, 12, AMBER, .6, 2);
    if (mode === 'cyl') {
      var f = 40, tilt = (90 - sun) * -1; var gg = S('g', { transform: 'translate(200 ' + 150 + ') rotate(' + (-(90 - sun) + 0) + ')' }, g); gg.setAttribute('transform', 'translate(200 150) rotate(' + (90 - sun) + ')');
      var pts = [], u; for (u = -60; u <= 60; u += 4) pts.push([u, -(u * u) / (4 * f)]);
      for (u = -50; u <= 50; u += 10) { ln(gg, u, -130, u, -(u * u) / (4 * f), AMBER, 1.3); ln(gg, u, -(u * u) / (4 * f), 0, -f, '#ffd27a', 1.1); }
      wire(gg, pts, '#fff', 3.4); circ(gg, 0, -f, 6, RED, .9, 0); circ(gg, 0, -f, 10 + Math.sin(t * 5) * 2, RED, .2, 0);
      txt(g, 290, 130, 'tube récepteur', RED, 'start', 9); txt(g, 290, 146, 'fluide chaud', RED, 'start', 8.5); txt(g, 24, 226, 'les miroirs tournent pour suivre le Soleil', '#9fb8cc', 'start', 9);
    } else {
      var tx = 200, ty = 50; ln(g, tx, 200, tx, ty, '#9fb8cc', 8); S('rect', { x: tx - 12, y: ty - 14, width: 24, height: 20, rx: 3, style: 'fill:' + RED + ';fill-opacity:.5;stroke:' + RED + ';stroke-width:2' }, g); circ(g, tx, ty - 4, 16 + Math.sin(t * 5) * 2, RED, .15, 0);
      [-165, -130, -95, -60, 60, 95, 130, 165].forEach(function (dx) {
        var hx = tx + dx, hy = 196, vt = [tx - hx, ty - hy], lt = Math.hypot(vt[0], vt[1]); vt = [vt[0] / lt, vt[1] / lt]; var nx = sdx + vt[0], ny = sdy + vt[1], ln2 = Math.hypot(nx, ny); nx /= ln2; ny /= ln2;
        ln(g, hx - ny * 11, hy + nx * 11, hx + ny * 11, hy - nx * 11, '#fff', 3.4); ln(g, hx + sdx * 60, hy + sdy * 60, hx, hy, AMBER, 1); ln(g, hx, hy, tx, ty - 4, '#ffd27a', 1);
      });
      txt(g, 214, ty - 20, 'récepteur au sommet', RED, 'start', 9);
    }
  }); paint();
}
var CPL = { hr: 0, T: 20 };
function capteurPlan(el) {
  var Z = CPL, svg = ui.stage(el, 400, 240, 'Chauffe-eau solaire à capteur plan'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), G = 800, A = 2, t = 0;
  Z.hr = 0; Z.T = 20;
  ui.slider(el, { label: 'Ensoleillement', min: 100, max: 1000, value: 800, step: 100, color: AMBER, fmt: function (v) { return v + ' W/m²'; } }, function (v) { G = v; paint(); });
  ui.slider(el, { label: 'Surface du capteur', min: 1, max: 4, value: 2, step: 1, color: BLUE, fmt: function (v) { return v + ' m²'; } }, function (v) { A = v; paint(); });
  function rate() { return G * A * .6 * 3600 / (100 * 4186); }
  function paint() { chips.set(ui.chip('+' + fm(rate(), 1) + ' °C par heure', AMBER) + ui.chip('réservoir 100 L', BLUE)); info.set('Une <b>vitre</b> laisse passer le Soleil, une plaque <b>noire</b> l’absorbe, un <b>isolant</b> garde la chaleur. L’eau circule jusqu’au réservoir. Ici : rendement du capteur 60 %.'); }
  PC.anim(svg, function (dt) {
    t += dt; Z.hr += dt * .6; if (Z.hr > 6) { Z.hr = 0; } Z.T = Math.min(90, 20 + rate() * Z.hr); dyn.replaceChildren(); var g = dyn, i;
    for (i = 0; i < 4; i++) { var a = i * .785 + t; ln(g, 40 + i * 24, 14, 54 + i * 24, 50, AMBER, 1.6); }
    S('rect', { x: 20, y: 56, width: 130, height: 40, rx: 3, style: 'fill:#04080c;stroke:#7e9bb2;stroke-width:2' }, g); S('rect', { x: 24, y: 72, width: 122, height: 14, style: 'fill:#111;stroke:#fff;stroke-width:1.2' }, g); S('rect', { x: 20, y: 56, width: 130, height: 8, style: 'fill:' + BLUE + ';fill-opacity:.3' }, g);
    txt(g, 85, 112, 'capteur plan', '#9fb8cc', 'middle', 9); txt(g, 85, 52, 'vitre', BLUE, 'middle', 8); txt(g, 85, 82, 'absorbeur noir', '#fff', 'middle', 7.5);
    wire(g, [[150, 80], [220, 80], [220, 126]], '#d97b3a', 3); wire(g, [[250, 190], [250, 210], [60, 210], [60, 96]], BLUE, 3); flow(g, [[60, 96], [60, 80], [150, 80], [220, 80], [220, 126]], (t * .4) % 1, 5, '#ff9d5c', 2.4);
    var col = Z.T < 40 ? BLUE : (Z.T < 60 ? AMBER : RED); S('rect', { x: 200, y: 124, width: 90, height: 90, rx: 14, style: 'fill:' + col + ';fill-opacity:.3;stroke:' + col + ';stroke-width:2.6' }, g); txt(g, 245, 160, fm(Z.T, 0) + ' °C', '#fff', 'middle', 22, true); txt(g, 245, 182, 'après ' + fm(Z.hr, 1) + ' h', '#9fb8cc', 'middle', 9);
    S('rect', { x: 310, y: 128, width: 66, height: 30, rx: 5, style: 'fill:#04080c;stroke:#2a4660;stroke-width:1.6' }, g); txt(g, 343, 148, fm(Z.T, 1) + '°', GREEN, 'middle', 13, true); txt(g, 343, 122, 'afficheur', '#9fb8cc', 'middle', 8.5); ln(g, 290, 143, 310, 143, '#37536b', 1.4, '3 3');
  }); paint();
}
PC.chapter({ id: 't3-13', lazy: true, eyebrow: EY + 'Module 5 · Énergies renouvelables', title: 'L’énergie solaire', ar: 'الطاقة الشمسية',
  lessons: function () { return [
    { short: 'Orientation', title: 'Bien orienter un panneau', intro: 'Déplace le Soleil et l’inclinaison.', build: orientationPanneau,
      retenir: ['Meilleure captation : rayons <b>perpendiculaires</b> au panneau.', 'Inclinaison idéale = 90° − hauteur du Soleil.'],
      ar: { e: ['أفضل التقاط عندما تكون الأشعة عمودية على اللوح، والميلان المثالي 90 درجة ناقص ارتفاع الشمس.'], u: 'حرّك المنزلقين.', w: [['panneau', 'لوح'], ['inclinaison', 'ميلان']] } },
    { short: 'Photovoltaïque', title: 'La centrale photovoltaïque', intro: 'Suis l’énergie du panneau à l’appareil.', build: centralePV,
      retenir: ['<b>Panneau</b> : produit. <b>Régulateur</b> : protège. <b>Batterie</b> : stocke. <b>Onduleur</b> : convertit.'],
      ar: { e: ['اللوح ينتج، والمنظّم يحمي، والبطارية تخزّن، والمموّج يحوّل إلى تيار متناوب.'], u: 'تابع المراحل.', w: [['onduleur', 'مموّج'], ['régulateur', 'منظّم شحن']] } },
    { short: 'Concentration', title: 'Concentrer la chaleur', intro: 'Auget parabolique ou tour ? Fais bouger le Soleil.', build: concentrationSolaire,
      retenir: ['<b>Cylindro-parabolique</b> : miroirs en auget et tube chaud.', '<b>À tour</b> : héliostats vers un récepteur au sommet.', 'Les <b>sels fondus</b> stockent la chaleur.'],
      ar: { e: ['المرايا المقعّرة والبرج تركّز الحرارة، والأملاح المنصهرة تخزّنها لتشغيل التوربين ليلا.'], u: 'حرّك الشمس.', w: [['concentration', 'تركيز']] } },
    { short: 'Capteur plan', title: 'Chauffer l’eau au soleil', intro: 'Surface, ensoleillement : à quelle température ?', build: capteurPlan,
      retenir: ['Vitre + absorbeur noir + isolant = <b>capteur plan</b>.', 'Plus l’ensoleillement et la surface sont grands, plus l’eau chauffe vite.'],
      ar: { e: ['اللاقط المسطح يمتص حرارة الشمس بواسطة صفيحة سوداء تحت زجاج وعازل.'], u: 'غيّر القيم.', w: [['capteur plan', 'لاقط مسطح']] } }
  ]; },
  quiz: [
    { q: 'Le Soleil est à 60° de hauteur. L’inclinaison idéale du panneau est :', o: ['30°', '60°', '90°'], a: 0, e: '90° − 60° = 30°.' },
    { q: 'L’onduleur sert à :', o: ['convertir le continu en alternatif', 'stocker l’énergie', 'mesurer le vent'], a: 0, e: 'Pour alimenter les appareils en 220 V.' },
    { q: 'Les héliostats d’une centrale à tour :', o: ['renvoient la lumière vers le sommet de la tour', 'produisent du vent', 'stockent de l’eau'], a: 0, e: 'Ils concentrent la chaleur.' },
    { q: 'Dans un capteur plan, la plaque est noire car elle :', o: ['absorbe mieux la chaleur', 'brille plus', 'coûte moins'], a: 0, e: 'Le noir absorbe le rayonnement.' }
  ]
});

/* ---------- t3-14 : efficacité énergétique et projets ---------- */
function etiquetteEnergie(el) {
  var svg = ui.stage(el, 400, 240, 'Étiquette énergie d’un réfrigérateur'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), cl = 0, prix = 1.2;
  var K = [['A', 100, '#2fb55a'], ['B', 130, '#7ac943'], ['C', 170, '#c9d92f'], ['D', 220, '#f2c12e'], ['E', 280, '#f29a2e'], ['F', 350, '#ee6b2e'], ['G', 430, '#d9342b']];
  ui.slider(el, { label: 'Prix du kWh', min: .8, max: 2, value: 1.2, step: .1, color: AMBER, fmt: function (v) { return fm(v, 1) + ' DH'; } }, function (v) { prix = v; paint(); });
  function paint() { var k = K[cl], eco = (K[6][1] - k[1]) * prix; chips.set(ui.chip('classe ' + k[0], AMBER) + ui.chip(k[1] + ' kWh/an', BLUE) + ui.chip(fm(k[1] * prix, 0) + ' DH/an', GREEN)); info.set('Plus la classe est proche de <b>A</b>, moins l’appareil consomme. Par rapport à la classe G : <b>' + fm(eco, 0) + ' DH</b> économisés par an (chiffres illustratifs ; prix à titre d’exemple).'); draw(); }
  function draw() {
    dyn.replaceChildren(); var g = dyn;
    K.forEach(function (k, i) { var w = 70 + i * 26, y = 20 + i * 28, on = i === cl; var p = S('path', { d: 'M20 ' + y + 'L' + (20 + w) + ' ' + y + 'L' + (20 + w + 14) + ' ' + (y + 11) + 'L' + (20 + w) + ' ' + (y + 22) + 'L20 ' + (y + 22) + 'Z', style: 'fill:' + k[2] + ';fill-opacity:' + (on ? 1 : .45) + ';stroke:' + (on ? '#fff' : 'none') + ';stroke-width:2.4' }, g); hot(p, function () { cl = i; paint(); }, 'classe ' + k[0]); txt(g, 30, y + 16, k[0], '#04080c', 'start', 13, true); });
    var kk = K[cl], bx = 250; S('rect', { x: bx, y: 40, width: 120, height: 150, rx: 10, style: 'fill:' + kk[2] + ';fill-opacity:.12;stroke:' + kk[2] + ';stroke-width:2.4' }, g); txt(g, bx + 60, 100, kk[0], kk[2], 'middle', 54, true); txt(g, bx + 60, 130, kk[1] + ' kWh/an', '#fff', 'middle', 12, true); txt(g, bx + 60, 154, fm(kk[1] * prix, 0) + ' DH/an', '#9fb8cc', 'middle', 10.5); txt(g, bx + 60, 176, '≈ ' + fm(kk[1] * prix / 12, 0) + ' DH/mois', '#7e9bb2', 'middle', 9);
  }
  paint();
}
function lampeCout(el) {
  var svg = ui.stage(el, 400, 220, 'Énergie consommée : E = P × t'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el), hrs = 5, prix = 1.2, t = 0;
  ui.slider(el, { label: 'Utilisation par jour', min: 1, max: 12, value: 5, step: 1, color: AMBER, fmt: function (v) { return v + ' h'; } }, function (v) { hrs = v; paint(); });
  var L = [['Incandescente', 60, '#f2a03a'], ['LED', 9, '#2fb55a']];
  function mois(p) { return p * hrs * 30 / 1000; }
  function paint() { var a = mois(60), b = mois(9); chips.set(ui.chip('incandescente : ' + fm(a, 1) + ' kWh', RED) + ui.chip('LED : ' + fm(b, 1) + ' kWh', GREEN) + ui.chip('économie : ' + fm((a - b) * prix, 1) + ' DH/mois', AMBER)); info.set('Pour la même lumière : 60 W contre 9 W. E (kWh) = P (kW) × durée (h). La LED consomme environ <b>6,7 fois moins</b>.'); }
  PC.anim(svg, function (dt) {
    t += dt; dyn.replaceChildren(); var g = dyn, sc = 190 / mois(60);
    L.forEach(function (l, i) { var y = 30 + i * 80, e = mois(l[1]), w = Math.max(3, e * sc); S('circle', { cx: 40, cy: y + 24, r: 18, style: 'fill:' + l[2] + ';fill-opacity:' + (.5 + Math.sin(t * 4 + i) * .05) + ';stroke:' + l[2] + ';stroke-width:2.4' }, g); txt(g, 40, y + 56, l[0], '#9fb8cc', 'middle', 9); txt(g, 40, y + 28, l[1] + 'W', '#fff', 'middle', 10, true);
      S('rect', { x: 86, y: y + 8, width: w, height: 32, rx: 3, style: 'fill:' + l[2] + ';fill-opacity:.35;stroke:' + l[2] + ';stroke-width:2' }, g); txt(g, 92 + w, y + 28, fm(e, 1) + ' kWh/mois', '#fff', 'start', 10.5, true); });
  }); paint();
}
var PRJ = { sel: 0, d: 0 };
function projetsCahier(el) {
  var Z = PRJ, svg = ui.stage(el, 400, 250, 'Cahier des charges d’un projet'), dyn = S('g', null, svg), info = ui.info(el), chips = ui.chips(el);
  Z.sel = 0; Z.d = 0;
  var P = [
    { n: 'Éolienne', need: 'Produire de l’électricité avec le vent', uc: ['Capter le vent', 'Produire l’électricité', 'Stocker l’énergie'], ctx: ['Vent', 'Utilisateur', 'Batterie', 'Support'], req: ['R1 · Démarrer dès 3 m/s', 'R2 · Allumer une LED 3 V', 'R3 · Résister à un vent fort'], blk: ['Pales', 'Générateur', 'Redresseur', 'Batterie'] },
    { n: 'Maisonnette PV', need: 'Éclairer la nuit grâce au Soleil', uc: ['Produire (panneau)', 'Éclairer automatiquement', 'Régler le seuil'], ctx: ['Soleil', 'Utilisateur', 'Nuit / jour', 'Maisonnette'], req: ['R1 · Allumer à la tombée de la nuit', 'R2 · Éteindre le jour', 'R3 · Autonomie d’au moins 8 h'], blk: ['Panneau', 'Régulateur', 'Batterie', 'Interrupteur crépusculaire', 'Lampe'] },
    { n: 'Capteur plan', need: 'Chauffer de l’eau au soleil', uc: ['Chauffer l’eau', 'Mesurer la température', 'Afficher la valeur'], ctx: ['Soleil', 'Eau froide', 'Utilisateur', 'Air ambiant'], req: ['R1 · Atteindre 50 °C', 'R2 · Afficher au degré près', 'R3 · Limiter les pertes (isolant)'], blk: ['Capteur plan', 'Réservoir', 'Capteur de T°', 'Afficheur'] }
  ];
  ui.tabs(el, P.map(function (p, i) { return [String(i), p.n]; }), function (k) { Z.sel = +k; paint(); });
  ui.tabs(el, [['0', 'Cas d’utilisation'], ['1', 'Contexte'], ['2', 'Exigences'], ['3', 'Blocs']], function (k) { Z.d = +k; paint(); });
  function paint() { var p = P[Z.sel]; chips.set(ui.chip(p.n, AMBER) + ui.chip(['Cas d’utilisation', 'Contexte', 'Exigences', 'Blocs'][Z.d], BLUE)); info.set('<b>Besoin :</b> ' + p.need + '. Le cahier des charges se lit avec quatre diagrammes : <b>qui fait quoi</b>, <b>avec quoi</b>, <b>à quelles conditions</b>, <b>par quels blocs</b>.'); draw(); }
  function draw() {
    dyn.replaceChildren(); var g = dyn, p = P[Z.sel], i;
    if (Z.d === 0) {
      S('rect', { x: 150, y: 20, width: 230, height: 200, rx: 6, style: 'fill:none;stroke:#37536b;stroke-width:1.6;stroke-dasharray:5 4' }, g); txt(g, 265, 38, p.n, '#9fb8cc', 'middle', 10, true);
      circ(g, 60, 80, 10, '#fff', .15, 2); ln(g, 60, 90, 60, 130, '#fff', 2); ln(g, 40, 104, 80, 104, '#fff', 2); ln(g, 60, 130, 46, 160, '#fff', 2); ln(g, 60, 130, 74, 160, '#fff', 2); txt(g, 60, 180, 'Utilisateur', '#fff', 'middle', 9.5, true);
      p.uc.forEach(function (u, j) { var y = 70 + j * 56; ln(g, 80, 104, 180, y, '#37536b', 1.4); S('ellipse', { cx: 265, cy: y, rx: 82, ry: 22, style: 'fill:' + AMBER + ';fill-opacity:.12;stroke:' + AMBER + ';stroke-width:2' }, g); txt(g, 265, y + 4, u, '#fff', 'middle', 10); });
    } else if (Z.d === 1) {
      block(g, 150, 100, 100, 44, p.n, AMBER, 11); var pos = [[30, 30], [270, 30], [30, 170], [270, 170]];
      p.ctx.forEach(function (c, j) { var x = pos[j][0], y = pos[j][1]; block(g, x, y, 100, 38, c, BLUE, 10); ln(g, x + 50, y + (y < 100 ? 38 : 0), 200, y < 100 ? 100 : 144, '#37536b', 1.6); });
    } else if (Z.d === 2) {
      p.req.forEach(function (r, j) { var y = 30 + j * 62; S('rect', { x: 40, y: y, width: 320, height: 46, rx: 4, style: 'fill:#0d1620;stroke:' + GREEN + ';stroke-width:2' }, g); S('rect', { x: 40, y: y, width: 320, height: 14, rx: 4, style: 'fill:' + GREEN + ';fill-opacity:.18' }, g); txt(g, 50, y + 11, '«requirement»', GREEN, 'start', 8); txt(g, 200, y + 34, r, '#fff', 'middle', 11.5, true); });
    } else {
      var n = p.blk.length, w = (380 - (n - 1) * 14) / n; p.blk.forEach(function (b, j) { var x = 10 + j * (w + 14); block(g, x, 90, w, 60, b, j % 2 ? AMBER : BLUE, w < 70 ? 8.5 : 10); if (j < n - 1) arrow(g, x + w, 120, x + w + 14, 120, '#fff', 2); });
      txt(g, 200, 190, 'chaîne d’énergie du projet', '#9fb8cc', 'middle', 10);
    }
  }
  paint();
}
function gestesEco(el) {
  var d = function (n) { return function (g) { rect(g, 25, 34, 350, 70, GREEN, .08, 4, 1.8); txt(g, 200, 75, n, '#fff', 'middle', 13, true); }; };
  classify(el, 'Geste économe ou gaspillage ?', [
    { name: 'Éteindre la lumière en quittant la pièce', cat: 0, why: 'Aucune énergie perdue inutilement.', draw: d('Éteindre en sortant') },
    { name: 'Laisser la télévision allumée sans la regarder', cat: 1, why: 'Énergie consommée pour rien.', draw: d('Télé allumée sans spectateur') },
    { name: 'Remplacer une lampe à incandescence par une LED', cat: 0, why: 'Même lumière avec environ 6 fois moins d’énergie.', draw: d('Passer à la LED') },
    { name: 'Ouvrir la fenêtre en laissant le chauffage allumé', cat: 1, why: 'La chaleur s’échappe.', draw: d('Chauffage + fenêtre ouverte') },
    { name: 'Choisir un appareil de classe A', cat: 0, why: 'Il consomme moins pour le même service.', draw: d('Appareil de classe A') },
    { name: 'Laisser les chargeurs branchés à vide toute la journée', cat: 1, why: 'Ils consomment encore un peu.', draw: d('Chargeur branché à vide') },
    { name: 'Isoler le toit et les fenêtres', cat: 0, why: 'On chauffe et on refroidit moins.', draw: d('Isolation de la maison') }
  ], ['Économe', 'Gaspillage'], 'Gagne-t-on ou perd-on de l’énergie ?');
}
PC.chapter({ id: 't3-14', lazy: true, eyebrow: EY + 'Module 5 · Énergies renouvelables', title: 'Efficacité énergétique et projets', ar: 'النجاعة الطاقية والمشاريع',
  lessons: function () { return [
    { short: 'Étiquette énergie', title: 'Lire une étiquette énergie', intro: 'De A à G : combien coûte l’appareil chaque année ?', build: etiquetteEnergie,
      retenir: ['<b>A</b> : très économe. <b>G</b> : très gourmand.', 'Coût annuel = kWh par an × prix du kWh.'],
      ar: { e: ['الصنف A الأكثر اقتصادا والصنف G الأكثر استهلاكا للطاقة.'], u: 'اختر صنفا.', w: [['étiquette énergie', 'ملصق الطاقة'], ['efficacité énergétique', 'نجاعة طاقية']] } },
    { short: 'Lampes', title: 'Énergie et coût d’une lampe', intro: 'LED ou incandescente : compare E = P × t.', build: lampeCout,
      retenir: ['E (kWh) = P (kW) × t (h).', 'À même lumière, une LED consomme beaucoup moins.'],
      ar: { e: ['الطاقة تساوي القدرة مضروبة في المدة، ومصباح LED يستهلك أقل بكثير.'], u: 'غيّر المدة.', w: [['kilowattheure', 'كيلوواط ساعة']] } },
    { short: 'Gestes', title: 'Économiser l’énergie', intro: 'Économe ou gaspillage ?', build: gestesEco,
      retenir: ['Le meilleur kWh est celui qu’on ne consomme pas.', 'Appareil efficace + bons gestes + isolation.'],
      ar: { e: ['أفضل كيلوواط ساعة هو الذي لا نستهلكه: أجهزة فعّالة وسلوك رشيد وعزل جيد.'], u: 'صنّف.', w: [['économie d’énergie', 'ترشيد الطاقة']] } },
    { short: 'Projets', title: 'Les projets au choix', intro: 'Lis le cahier des charges avec quatre diagrammes.', build: projetsCahier,
      retenir: ['Quatre diagrammes : <b>cas d’utilisation, contexte, exigences, blocs</b>.', 'Trois projets : éolienne, maisonnette solaire, capteur plan.'],
      ar: { e: ['دفتر التحملات يُقرأ بأربعة مخططات: حالات الاستعمال والسياق والمتطلبات والكتل.'], u: 'تنقّل بين المشاريع.', w: [['cahier des charges', 'دفتر التحملات']] } }
  ]; },
  quiz: [
    { q: 'Une lampe de 10 W allumée 5 h consomme :', o: ['0,05 kWh', '0,5 kWh', '5 kWh'], a: 0, e: '0,010 kW × 5 h.' },
    { q: 'Le meilleur classement énergétique est :', o: ['A', 'G', 'D'], a: 0, e: 'A consomme le moins.' },
    { q: 'Éteindre une lampe inutile est :', o: ['un geste économe', 'un gaspillage', 'sans effet'], a: 0, e: 'Aucun kWh perdu.' },
    { q: 'Le diagramme des exigences décrit :', o: ['les conditions que le système doit respecter', 'les couleurs', 'le prix'], a: 0, e: 'Fonctionnalités et contraintes.' }
  ]
});
