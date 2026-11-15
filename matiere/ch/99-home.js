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
var CH2 = [
  ['t2-1', 'Besoin, objet technique, système', 'الحاجة والشيء التقني والمنظومة', 'Du besoin au produit', 1],
  ['t2-2', 'Lire les diagrammes SysML', 'قراءة مخططات SysML', 'Portail automatique : 4 diagrammes', 1],
  ['t2-3', 'Schéma électronique et fonction technique', 'المخطط الإلكتروني والوظيفة التقنية', 'Symboles et aspects commerciaux', 2],
  ['t2-4', 'La fonction « Alimentation »', 'وظيفة التغذية', 'Pile, batterie, bloc secteur', 2],
  ['t2-5', 'La fonction « Signalisation »', 'وظيفة الإشارة', 'LED, buzzer, résistance de protection', 2],
  ['t2-6', 'La fonction « Commutation »', 'وظيفة التبديل', 'Interrupteur, relais, transistor', 2],
  ['t2-7', 'La fonction « Détection »', 'وظيفة الكشف', 'Photorésistance, thermistance, capteur', 2],
  ['t2-8', 'La fonction « Temporisation »', 'وظيفة التأخير', 'Résistance, condensateur', 2],
  ['t2-9', 'Transmission de mouvement', 'نقل الحركة', 'Poulies-courroie, engrenages, chaîne', 2],
  ['t2-10', 'Du schéma au circuit imprimé', 'من المخطط إلى الدارة المطبوعة', 'Implantation, gravure, soudure', 3],
  ['t2-11', 'Marché, offre et demande', 'السوق والعرض والطلب', 'Prix et équilibre', 4],
  ['t2-12', 'L’entreprise et ses secteurs', 'المقاولة وقطاعاتها', 'Primaire, secondaire, tertiaire, quaternaire', 4],
  ['t2-13', 'Monter sa mini-entreprise', 'إنشاء مقاولة مصغّرة', 'Idée, étude de marché, coût de revient', 4]
];
var MOD2 = {
  1: ['s1', 'Module 1 · Modélisation des systèmes techniques', 'الوحدة 1: نمذجة الأنظمة التقنية', ''],
  2: ['s1', 'Module 2 · Fonctions techniques', 'الوحدة 2: الوظائف التقنية', ''],
  3: ['s2', 'Module 3 · Réalisation d’un circuit imprimé', 'الوحدة 3: إنجاز دارة مطبوعة', ''],
  4: ['s2', 'Module 4 · Entreprise et culture entrepreneuriale', 'الوحدة 4: المقاولة والثقافة المقاولاتية', '']
};
var MODULES = {
  1: ['s1', 'Module 1 · Évolution des systèmes techniques', 'الوحدة 1: تطوّر الأنظمة التقنية', '4 h'],
  2: ['s1', 'Module 2 · Chaîne d’information', 'الوحدة 2: سلسلة المعلومات', '12 h'],
  3: ['s1', 'Module 3 · Chaîne d’énergie', 'الوحدة 3: سلسلة الطاقة', '10 h'],
  4: ['s2', 'Module 4 · Dessin technique', 'الوحدة 4: الرسم التقني', '10 h'],
  5: ['s2', 'Module 5 · Énergies renouvelables', 'الوحدة 5: الطاقات المتجددة', '16 h']
};
var SEM = { s1: ['Semestre 1', 'الدورة الأولى'], s2: ['Semestre 2', 'الدورة الثانية'] };
var LEVELS = [
  { fr: '2<sup>e</sup> année', ar: 'السنة الثانية', list: CH2, mods: MOD2 },
  { fr: '3<sup>e</sup> année', ar: 'السنة الثالثة', list: CH, mods: MODULES }
];
/* niveau choisi : mémorisé dans ce navigateur (avec repli en mémoire si le stockage est refusé) */
var LVK = 'tech_lvl', LASTK = 'tech_last', memLv = null, memLast = null;
function stGet(k) { try { return localStorage.getItem(k); } catch (e) { return k === LVK ? memLv : memLast; } }
function stSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} if (k === LVK) memLv = v; else memLast = v; }
function lvlIndex(id) { return id === '2' ? 0 : (id === '3' ? 1 : -1); }
function noteHash() {
  var m = /^#(t([23])-\d+)/.exec(location.hash || '');
  if (m) { stSet(LASTK, m[1]); stSet(LVK, m[2]); }
}
noteHash(); window.addEventListener('hashchange', noteHash);
/* première visite sur l'accueil : la fenêtre « Ma session » attend que le niveau soit choisi */
var FIRST_PICK = !stGet(LVK) && !location.hash;   // vrai seulement pour le tout premier choix de niveau de cette visite
if (FIRST_PICK) { try { sessionStorage.setItem('lab_skip', '1'); } catch (e) {} }
/* sans stockage (aperçu isolé, navigation privée) lab_skip ne tient pas : la fenêtre « Ma session » s'ouvrirait avant le choix du niveau et bloquerait la page. On la ferme ; elle revient après le choix. */
if (FIRST_PICK) window.addEventListener('load', function () { setTimeout(function () { var b = document.getElementById('lab-skip'); if (FIRST_PICK && b) b.click(); }, 60); });
/* un toucher n'importe où sur le mot de bienvenue le ferme (sinon il paraît bloquer la page jusqu'à ses 6 secondes) */
var WEL_BUSY = false;
document.addEventListener('click', function (e) {
  if (WEL_BUSY || !e.isTrusted) return; var w = document.querySelector('.lab-welcome:not(.out)'); if (!w) return;
  e.preventDefault(); e.stopPropagation(); var b = w.querySelector('.btn'); if (b) { WEL_BUSY = true; try { b.click(); } finally { WEL_BUSY = false; } }
}, true);
function pickLevel(id) {
  stSet(LVK, id);
  var wasFirst = FIRST_PICK && !(window.Lab && Lab.Session && Lab.Session.cur()); FIRST_PICK = false;
  home(); window.scrollTo(0, 0);
  if (wasFirst) { try { sessionStorage.removeItem('lab_skip'); } catch (e) {} if (window.Lab && Lab.openStart) setTimeout(Lab.openStart, 150); }
}
function levelSplash(box) {
  var sp = h('div', { 'class': 'lvl-pick' });
  sp.innerHTML = '<h2 class="lvl-q">Choisis ton niveau · <span dir="rtl" lang="ar">اختر مستواك</span></h2>';
  var info = [
    ['2', 'Modélisation, fonctions techniques, circuit imprimé, entreprise', 'نمذجة، وظائف تقنية، دارة مطبوعة، مقاولة'],
    ['3', 'Chaîne d’information, chaîne d’énergie, dessin technique, énergies renouvelables', 'سلسلة المعلومات، سلسلة الطاقة، الرسم التقني، الطاقات المتجددة']
  ];
  LEVELS.forEach(function (lv, i) {
    var nb = lv.list.length, nm = Object.keys(lv.mods).length;
    var b = h('button', { type: 'button', 'class': 'lvl-card', 'data-lvl': info[i][0] });
    b.innerHTML = '<span class="lvl-big" aria-hidden="true">' + info[i][0] + '</span><span class="lvl-txt"><strong>' + lv.fr + ' <span dir="rtl" lang="ar">· ' + lv.ar + '</span></strong>' +
      '<small>' + nb + ' chapitres · ' + nm + ' modules</small><em>' + info[i][1] + '</em><em class="ar-t" dir="rtl" lang="ar">' + info[i][2] + '</em></span>';
    b.addEventListener('click', function () { pickLevel(info[i][0]); });
    sp.appendChild(b);
  });
  box.appendChild(sp);
}
function levelBar(box, cur) {
  var bar = h('div', { 'class': 'lvl-bar' });
  var seg = h('div', { 'class': 'lvl-seg', role: 'group', 'aria-label': 'Niveau · المستوى' });
  LEVELS.forEach(function (lv, i) {
    var id = String(i + 2), b = h('button', { type: 'button', 'aria-pressed': i === cur ? 'true' : 'false' }, lv.fr + ' <span dir="rtl" lang="ar">' + lv.ar + '</span>');
    b.addEventListener('click', function () { if (i !== cur) pickLevel(id); });
    seg.appendChild(b);
  });
  bar.appendChild(seg); box.appendChild(bar);
  var last = stGet(LASTK), lc = null;
  LEVELS[cur].list.forEach(function (c) { if (c[0] === last) lc = c; });
  if (lc) {
    var r = h('a', { 'class': 'resume', href: '#' + lc[0] });
    r.innerHTML = '<small>Reprendre · <span dir="rtl" lang="ar">أكمل من حيث توقفت</span></small><strong>' + lc[1] + '</strong><span class="ar-t" dir="rtl" lang="ar">' + lc[2] + '</span>';
    box.appendChild(r);
  }
  var chips = h('div', { 'class': 'mod-chips', role: 'group', 'aria-label': 'Aller au module' });
  Object.keys(LEVELS[cur].mods).forEach(function (mk) {
    var M = LEVELS[cur].mods[mk], c = h('button', { type: 'button' }, 'M' + mk + (M[3] ? ' <small>' + M[3] + '</small>' : ''));
    c.title = M[1];
    c.addEventListener('click', function () { var t = document.getElementById('mod-' + (cur + 2) + '-' + mk); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    chips.appendChild(c);
  });
  box.appendChild(chips);
}
function tidyHome() {
  /* le choix du niveau passe en premier : texte d'accueil et énigme descendent sous la liste */
  var hm = document.getElementById('home'), hd = hm && hm.querySelector('header'), sec = hm && hm.querySelector('section[aria-label="Chapitres"]');
  if (!hd || !sec || hm.querySelector('.home-intro')) return;
  var intro = h('div', { 'class': 'home-intro' });
  Array.prototype.slice.call(hd.querySelectorAll('p.welcome,p.lead')).forEach(function (n) { intro.appendChild(n); });
  sec.parentNode.insertBefore(intro, sec.nextSibling);
}
function home() {
  var box = PC.$('#chapters'); if (!box) return; box.replaceChildren();
  tidyHome();
  var cur = lvlIndex(stGet(LVK));
  var kick = document.querySelector('#home section[aria-label="Chapitres"] > .kicker');
  if (kick) kick.textContent = cur < 0 ? 'Ton niveau' : 'Chapitres par module';
  if (cur < 0) levelSplash(box); else levelBar(box, cur);
  LEVELS.forEach(function (lv, li) {
    var wrap = h('div', { 'class': 'lvl-list', id: 'lv-' + (li + 2) });
    if (li !== cur) wrap.hidden = true;
    var last = '';
    Object.keys(lv.mods).forEach(function (mk) {
      var m = +mk, list = lv.list.filter(function (c) { return c[4] === m; });
      if (!list.length) return;
      var M = lv.mods[m];
      if (M[0] !== last) { last = M[0]; wrap.appendChild(h('h3', { 'class': 'unit sem' }, SEM[M[0]][0] + ' · <span dir="rtl" lang="ar">' + SEM[M[0]][1] + '</span>')); }
      wrap.appendChild(h('h3', { 'class': 'unit', id: 'mod-' + (li + 2) + '-' + m }, M[1] + (M[3] ? ' · ' + M[3] : '') + ' <span dir="rtl" lang="ar" style="margin-inline-start:.5em">' + M[2] + '</span>'));
      var grid = h('div', { 'class': 'chap-grid' });
      list.forEach(function (c) {
        var n = lv.list.indexOf(c) + 1, soon = !!c[5], a = h(soon ? 'div' : 'a', soon ? { 'class': 'chap soon', 'aria-disabled': 'true' } : { 'class': 'chap', href: '#' + c[0] });
        a.innerHTML = '<span class="num" aria-hidden="true">' + (n < 10 ? '0' : '') + n + '</span><strong>' + c[1] + '</strong><span class="ar-t" dir="rtl" lang="ar">' + c[2] + '</span><small>' + (soon ? 'Bientôt · قريبا' : c[3]) + '</small>';
        grid.appendChild(a);
      });
      wrap.appendChild(grid);
    });
    box.appendChild(wrap);
  });
  var det = h('details', { 'class': 'lab-note appro-note' });
  det.innerHTML = '<summary><b>Repères du programme officiel · مراجع البرنامج الرسمي</b></summary>' +
    '<p><b>2<sup>e</sup> année · <span dir="rtl" lang="ar">الثانية</span></b><br>Semestre 1 : modélisation des systèmes techniques, fonctions techniques (alimentation, signalisation, commutation, détection, temporisation, transmission de mouvement). Semestre 2 : réalisation d’un circuit imprimé, entreprise et culture entrepreneuriale.' +
    '<span dir="rtl" lang="ar" style="display:block">الدورة الأولى: نمذجة الأنظمة التقنية والوظائف التقنية. الدورة الثانية: إنجاز دارة مطبوعة والمقاولة والثقافة المقاولاتية.</span></p>' +
    '<p><b>3<sup>e</sup> année · <span dir="rtl" lang="ar">الثالثة</span></b><br>Semestre 1 : évolution des systèmes techniques (4 h), chaîne d’information (12 h), chaîne d’énergie (10 h). Semestre 2 : dessin technique (10 h), énergies renouvelables (16 h), projet au choix (8 h).' +
    '<span dir="rtl" lang="ar" style="display:block">الدورة الأولى: تطوّر الأنظمة التقنية، سلسلة المعلومات، سلسلة الطاقة. الدورة الثانية: الرسم التقني، الطاقات المتجددة، مشروع حسب الاختيار.</span></p>' +
    '<p>Source : « Technologie, enseignement secondaire collégial : programmes et orientations pédagogiques », direction des curricula, ministère de l’Éducation nationale (version finale du 30 juin 2021).<span dir="rtl" lang="ar" style="display:block">المصدر: برنامج التكنولوجيا للسلك الإعدادي والتوجيهات التربوية، مديرية المناهج، وزارة التربية الوطنية (النسخة النهائية 30 يونيو 2021).</span></p>';
  box.appendChild(det);
}
PC.onHome = home; home();
window.addEventListener('load', function () { PC.route(); });
