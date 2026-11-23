/* Défis « en mouvement » : séries tirées au hasard par chapitre, quatre niveaux, défi chronométré et défi de la semaine.
   Moteur : lab.js en mode intégré (LAB_CONFIG.embed) ; générateurs : defis-<matière>.js ; chapitres : window.MVD. */
(function () {
  'use strict';
  var MV = window.MV, H = MV.H, Lab = window.Lab, CH = window.MVD || [];
  var main = document.getElementById('ex'); if (!main || !Lab || !window.LAB_CONFIG) return;
  var MAP = window.LAB_CONFIG.map || {};
  MV.fullscreenBtn();
  var chaps = CH.filter(function (c) { return MAP[c[0]]; });
  var LEVELS = ['1', '2', '3'].filter(function (k) { return chaps.some(function (c) { return c[1] === k; }); });
  var lv = (location.hash.match(/n([123])/) || [])[1] || MV.store.get('mv_defis_lv') || LEVELS[0];
  if (LEVELS.indexOf(lv) < 0) lv = LEVELS[0];
  var NAMES = { '1': '1AC · السنة الأولى', '2': '2AC · السنة الثانية', '3': '3AC · السنة الثالثة' };

  var top = H('div', 'card', '<div class="eyebrow">Ma carte élève</div><p class="small">Avec ta carte, tes séries sont envoyées à ton enseignant. Sans carte, elles restent sur cet appareil.</p>', main);
  MV.eleveCard(top, function () { Lab.syncStudent(); });
  var wk = H('div', 'card', '<div class="eyebrow">Défi de la semaine · تحدي الأسبوع</div><p class="small">10 questions de tous les chapitres, les mêmes pour toute la classe cette semaine.</p>', main);
  var wkBtn = H('button', 'btn', 'Ouvrir le défi de la semaine ▶', wk), wkBox = H('div', 'lab-host', '', wk);
  wkBtn.onclick = function () { wkBtn.remove(); Lab.mountWeek(wkBox); };

  var seg = H('div', 'seg', '', H('div', 'card', '<div class="eyebrow">Mon niveau</div>', main));
  var list = H('div', '', '', main), open = null;
  LEVELS.forEach(function (k) {
    var b = H('button', 'btn' + (k === lv ? ' pri' : ''), NAMES[k], seg);
    b.onclick = function () { lv = k; MV.store.set('mv_defis_lv', k); [].forEach.call(seg.children, function (x) { x.classList.toggle('pri', x === b); }); draw(); };
  });
  function draw() {
    list.innerHTML = ''; open = null;
    chaps.filter(function (c) { return c[1] === lv; }).forEach(function (c, i) {
      var card = H('div', 'card defi', '', list);
      var head = H('button', 'defi-head', '<span class="n">' + (i + 1) + '</span><span><b>' + c[2] + '</b>' + (c[3] ? '<span class="ar">' + c[3] + '</span>' : '') + '</span><span class="go">▶</span>', card);
      head.setAttribute('aria-expanded', 'false');
      var body = H('div', 'lab-host', '', card);
      head.onclick = function () {
        if (open && open !== body) { open.innerHTML = ''; open.previousSibling.setAttribute('aria-expanded', 'false'); }
        if (open === body) { body.innerHTML = ''; head.setAttribute('aria-expanded', 'false'); open = null; return; }
        Lab.mount(body, c[0], c[2]); head.setAttribute('aria-expanded', 'true'); open = body;
        card.scrollIntoView({ block: 'start', behavior: 'smooth' });
      };
    });
  }
  draw();
})();
