/* ===================================================== 2AC · t2-10 CIRCUIT IMPRIMÉ */
function etapesPcb(el) {
  ordering(el, 'Étapes de réalisation d’un circuit imprimé', ['Schéma', 'Typon', 'Insolation', 'Révélation', 'Gravure', 'Perçage', 'Soudure'], 'Touche les étapes dans l’ordre de réalisation.');
}
function tracerPistes(el) {
  var svg = ui.stage(el, 400, 220, 'Tracer les pistes du circuit imprimé'), g = S('g', null, svg), dyn = S('g', null, svg), info = ui.info(el), verd = ui.verdict(el), chips = ui.chips(el);
  var P = { bp: [60, 60, 'Pile +'], bm: [60, 170, 'Pile −'], r1: [160, 60, 'R1'], r2: [250, 60, 'R2'], dp: [340, 60, 'LED +'], dm: [340, 170, 'LED −'] };
  var NET = [['bp', 'r1'], ['r2', 'dp'], ['dm', 'bm']], done = [], sel = null, pads = {};
  S('rect', { x: 20, y: 24, width: 360, height: 180, rx: 8, style: 'fill:#0b3b22;fill-opacity:.55;stroke:#1f8f5b;stroke-width:2' }, g);
  S('rect', { x: 168, y: 48, width: 74, height: 24, style: 'fill:none;stroke:#cfe3f2;stroke-width:1.5;stroke-dasharray:3 2' }, g); txt(g, 205, 64, 'résistance', '#cfe3f2', 'middle', 9);
  S('path', { d: 'M326 108l28 0-14 24z', style: 'fill:none;stroke:#cfe3f2;stroke-width:1.5;stroke-dasharray:3 2' }, g); txt(g, 340, 148, 'LED', '#cfe3f2', 'middle', 9);
  S('rect', { x: 34, y: 100, width: 52, height: 36, style: 'fill:none;stroke:#cfe3f2;stroke-width:1.5;stroke-dasharray:3 2' }, g); txt(g, 60, 122, 'pile', '#cfe3f2', 'middle', 9);
  Object.keys(P).forEach(function (k) { var p = P[k]; var c = S('circle', { cx: p[0], cy: p[1], r: 9, style: 'fill:#d49b4a;stroke:#f3c98a;stroke-width:2' }, g); S('circle', { cx: p[0], cy: p[1], r: 3, style: 'fill:#0b3b22' }, g); txt(g, p[0], p[1] + (p[1] < 100 ? -16 : 24), p[2], '#e8f1f8', 'middle', 9.5); hot(S('circle', { cx: p[0], cy: p[1], r: 16, style: 'fill:transparent' }, g), function () { tap(k); }, p[2]); pads[k] = c; });
  function draw() { dyn.replaceChildren(); done.forEach(function (d) { var a = P[d[0]], b = P[d[1]]; ln(dyn, a[0], a[1], b[0], b[1], '#f3c98a', 5); }); if (sel) circ(dyn, P[sel][0], P[sel][1], 14, AMBER, 0, 2.5); chips.set(ui.chip(done.length + ' / ' + NET.length + ' pistes', done.length === NET.length ? GREEN : BLUE)); }
  function tap(k) {
    if (done.length === NET.length) return;
    if (!sel) { sel = k; draw(); info.set('Relie <b>' + P[k][2] + '</b> à un autre point.'); return; }
    if (sel === k) { sel = null; draw(); return; }
    var hit = NET.filter(function (n) { return (n[0] === sel && n[1] === k) || (n[1] === sel && n[0] === k); })[0];
    if (hit && done.indexOf(hit) < 0) { done.push(hit); verd.set('Piste correcte.', 'ok'); } else verd.set(hit ? 'Déjà tracée.' : 'Ces deux points ne sont pas reliés sur le schéma.', '');
    sel = null; draw(); if (done.length === NET.length) { verd.set('Circuit complet : pile → R → LED → pile.', 'ok'); info.set('Les pistes de cuivre remplacent les fils.'); }
  }
  ui.btn(ui.controls(el), 'Effacer les pistes', function () { done = []; sel = null; verd.set('', ''); draw(); });
  info.set('Suis le schéma : pile +, résistance, LED, pile −. Touche deux pastilles pour tracer une piste.'); draw();
}
function securitePcb(el) {
  classify(el, 'Sécurité et recyclage', [
    { name: 'Porter des lunettes de protection', cat: 0, why: 'Les produits de gravure projettent.' },
    { name: 'Toucher la panne du fer à souder', cat: 1, why: 'Elle dépasse 300 °C.' },
    { name: 'Souder dans une pièce aérée', cat: 0, why: 'Les fumées de soudure sont nocives.' },
    { name: 'Jeter la solution de gravure à l’évier', cat: 1, why: 'Elle est polluante : on la recycle.' },
    { name: 'Poser le fer sur son support', cat: 0, why: 'Il évite brûlures et incendies.' },
    { name: 'Déposer un vieil appareil au point de collecte', cat: 0, why: 'On le recycle : ses matériaux sont réutilisés.' }
  ], ['À faire', 'À éviter'], 'Bonne pratique ou à éviter ?');
}
PC.chapter({ id: 't2-10', lazy: true, eyebrow: EY2 + 'Module 3 · Réalisation d’un circuit imprimé', title: 'Du schéma au circuit imprimé', ar: 'من المخطط إلى الدارة المطبوعة',
  lessons: function () { return [
    { short: 'Étapes', title: 'Les étapes', intro: 'Remets les étapes dans l’ordre.', build: etapesPcb,
      retenir: ['Un <b>circuit imprimé</b> remplace les fils par des pistes de cuivre.', 'Schéma, typon, insolation, révélation, gravure, perçage, soudure.'],
      ar: { e: ['الدارة المطبوعة تعوّض الأسلاك بمسالك نحاسية، وتُنجز في مراحل مرتبة.'], u: 'رتّب المراحل.', w: [['circuit imprimé', 'دارة مطبوعة'], ['gravure', 'حفر']] } },
    { short: 'Pistes', title: 'Tracer les pistes', intro: 'Relie les pastilles comme sur le schéma.', build: tracerPistes,
      retenir: ['Chaque piste relie deux pastilles du schéma.', 'Les composants se soudent sur les pastilles.'],
      ar: { e: ['كل مسلك يربط نقطتين كما في المخطط، وتُلحم المكوّنات على النقاط.'], u: 'اربط النقاط.', w: [['piste', 'مسلك'], ['pastille', 'نقطة لحام']] } },
    { short: 'Sécurité', title: 'Sécurité et recyclage', intro: 'Bonne pratique ou à éviter ?', build: securitePcb,
      retenir: ['Lunettes, gants, local aéré, fer sur son support.', '<b>Recycler</b> : réutiliser les matériaux d’un appareil usagé.'],
      ar: { e: ['نرتدي النظارات ونهوّي المكان. وإعادة التدوير تعني استعمال مواد الأجهزة القديمة.'], u: 'صنّف السلوك.', w: [['recyclage', 'إعادة التدوير'], ['soudure', 'لحام']] } }
  ]; },
  quiz: [
    { q: 'Un circuit imprimé remplace :', o: ['les fils par des pistes', 'la pile', 'la LED'], a: 0, e: 'Avantage : plus compact et fiable.' },
    { q: 'Quelle étape suit l’insolation ?', o: ['la révélation', 'la soudure', 'le perçage'], a: 0, e: 'Typon, insolation, révélation, gravure.' },
    { q: 'La soudure se fait :', o: ['en dernier', 'avant la gravure', 'avant le typon'], a: 0, e: 'Après le perçage.' },
    { q: 'La solution de gravure :', o: ['ne se jette pas à l’évier', 'se boit', 'se réutilise pour l’eau'], a: 0, e: 'Elle est polluante.' }
  ]
});
