/* ===================================================== SOMMAIRE */
/* [id, titre, arabe, mot-clé, module] */
var CH = [
  ['t3-1', 'Évolution des systèmes techniques', 'تطوّر الأنظمة التقنية', 'Primitif, mécanisé, automatisé, robotisé', 1],
  ['t3-2', 'La fonction « Acquérir »', 'الوظيفة «اكتساب المعلومة»', 'Capteurs et détecteurs', 2],
  ['t3-3', 'La fonction « Traiter »', 'الوظيفة «معالجة المعلومة»', 'Algorithme, organigramme, programme', 2],
  ['t3-4', 'La fonction « Communiquer »', 'الوظيفة «تبليغ المعلومة»', 'Visuelle, sonore, câblée, sans fil', 2],
  ['t3-5', 'La fonction « Alimenter »', 'الوظيفة «التزويد بالطاقة»', 'Schéma électronique, autonomie', 3],
  ['t3-6', 'La fonction « Distribuer »', 'الوظيفة «توزيع الطاقة»', 'Relais, transistor', 3],
  ['t3-7', 'La fonction « Convertir »', 'الوظيفة «تحويل الطاقة»', 'Moteur, résistance, vérin, servomoteur', 3],
  ['t3-8', 'La fonction « Transmettre »', 'الوظيفة «نقل الحركة»', 'Transmission et transformation', 3],
  ['t3-9', 'La fonction « Agir »', 'الوظيفة «الفعل»', 'Effecteur, matière d’œuvre, valeur ajoutée', 3],
  ['t3-10', 'Le dessin technique', 'الرسم التقني', 'Traits, vues, perspective, échelle', 4],
  ['t3-11', 'Sources d’énergie', 'مصادر الطاقة', 'Renouvelables et non renouvelables', 5],
  ['t3-12', 'Hydroélectricité et éolienne', 'الطاقة الكهرومائية والمراوح الريحية', 'Centrale hydroélectrique, éolienne', 5],
  ['t3-13', 'L’énergie solaire', 'الطاقة الشمسية', 'Photovoltaïque, concentration, capteur plan', 5],
  ['t3-14', 'Efficacité énergétique et projets', 'النجاعة الطاقية والمشاريع', 'Étiquette énergie, projets au choix', 5]
];
var MODULES = {
  1: ['s1', 'Module 1 · Évolution des systèmes techniques', 'الوحدة 1: تطوّر الأنظمة التقنية', '4 h'],
  2: ['s1', 'Module 2 · Chaîne d’information', 'الوحدة 2: سلسلة المعلومات', '12 h'],
  3: ['s1', 'Module 3 · Chaîne d’énergie', 'الوحدة 3: سلسلة الطاقة', '10 h'],
  4: ['s2', 'Module 4 · Dessin technique', 'الوحدة 4: الرسم التقني', '10 h'],
  5: ['s2', 'Module 5 · Énergies renouvelables', 'الوحدة 5: الطاقات المتجددة', '16 h']
};
var SEM = { s1: ['Semestre 1', 'الدورة الأولى'], s2: ['Semestre 2', 'الدورة الثانية'] };
function home() {
  var box = PC.$('#chapters'); if (!box) return; box.replaceChildren();
  var last = '';
  box.appendChild(h('h2', { 'class': 'lvl' }, '2<sup>e</sup> année · <span dir="rtl" lang="ar">السنة الثانية</span>'));
  var soon = h('div', { 'class': 'chap-grid' }), sc = h('div', { 'class': 'chap soon', 'aria-disabled': 'true' });
  sc.innerHTML = '<strong>Plus tard</strong><span class="ar-t" dir="rtl" lang="ar">لاحقا</span>';
  soon.appendChild(sc); box.appendChild(soon);
  box.appendChild(h('h2', { 'class': 'lvl' }, '3<sup>e</sup> année · <span dir="rtl" lang="ar">السنة الثالثة</span>'));
  [1, 2, 3, 4, 5].forEach(function (m) {
    var list = CH.filter(function (c) { return c[4] === m; });
    if (!list.length) return;
    var M = MODULES[m];
    if (M[0] !== last) { last = M[0]; box.appendChild(h('h3', { 'class': 'unit sem' }, SEM[M[0]][0] + ' · <span dir="rtl" lang="ar">' + SEM[M[0]][1] + '</span>')); }
    box.appendChild(h('h3', { 'class': 'unit' }, M[1] + ' · ' + M[3] + ' <span dir="rtl" lang="ar" style="margin-inline-start:.5em">' + M[2] + '</span>'));
    var grid = h('div', { 'class': 'chap-grid' });
    list.forEach(function (c) {
      var a = h('a', { 'class': 'chap', href: '#' + c[0] });
      a.innerHTML = '<strong>' + c[1] + '</strong><span class="ar-t" dir="rtl" lang="ar">' + c[2] + '</span><small>Disponible · ' + c[3] + '</small>';
      grid.appendChild(a);
    });
    box.appendChild(grid);
  });
  var det = h('details', { 'class': 'lab-note appro-note' });
  det.innerHTML = '<summary><b>Repères du programme officiel · مراجع البرنامج الرسمي</b></summary>' +
    '<p><b>3<sup>e</sup> année · <span dir="rtl" lang="ar">الثالثة</span></b><br>Semestre 1 : évolution des systèmes techniques (4 h), chaîne d’information (12 h), chaîne d’énergie (10 h). Semestre 2 : dessin technique (10 h), énergies renouvelables (16 h), projet au choix (8 h).' +
    '<span dir="rtl" lang="ar" style="display:block">الدورة الأولى: تطوّر الأنظمة التقنية، سلسلة المعلومات، سلسلة الطاقة. الدورة الثانية: الرسم التقني، الطاقات المتجددة، مشروع حسب الاختيار.</span></p>' +
    '<p>Source : « Technologie, enseignement secondaire collégial : programmes et orientations pédagogiques », direction des curricula, ministère de l’Éducation nationale (version finale du 30 juin 2021).<span dir="rtl" lang="ar" style="display:block">المصدر: برنامج التكنولوجيا للسلك الإعدادي والتوجيهات التربوية، مديرية المناهج، وزارة التربية الوطنية (النسخة النهائية 30 يونيو 2021).</span></p>';
  box.appendChild(det);
}
PC.onHome = home; home();
window.addEventListener('load', function () { PC.route(); });
