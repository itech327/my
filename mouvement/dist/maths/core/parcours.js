/* Mon parcours : étapes franchies et carte de maîtrise. Individuel, sans classement, tout reste sur l'appareil. */
(function () {
  'use strict';
  var MV = window.MV, H = MV.H, store = MV.store, DATA = window.MVQ || [], B = MV.badges;
  var main = document.getElementById('ex'); if (!main || !B) return;
  MV.fullscreenBtn();
  B.check(true);
  var st = B.stats(), got = B.earned(), defs = B.defs;

  var rev = null; try { rev = JSON.parse(store.get('mv_rev1') || 'null'); } catch (e) {}
  var cards = (rev && rev.cards) || {};

  /* résumé */
  var n = Object.keys(got).length;
  var sum = H('div', 'card', '<div class="eyebrow">Mon parcours · <span class="ar">مساري</span></div>', main);
  sum.insertAdjacentHTML('beforeend',
    '<div class="stat3"><div><b>' + st.lessons + '</b><span>leçons terminées</span></div>' +
    '<div><b>' + st.master + '</b><span>cartes maîtrisées</span></div>' +
    '<div><b>' + n + '/' + defs.length + '</b><span>étapes franchies</span></div></div>');
  H('p', 'small', 'Ces étapes ne se comparent à personne. Elles récompensent ce qui te fait vraiment progresser : revenir régulièrement, retenir longtemps, réfléchir avant de répondre.', sum);

  /* étapes par famille */
  var fams = [];
  defs.forEach(function (b) { if (fams.indexOf(b.fam) < 0) fams.push(b.fam); });
  fams.forEach(function (f) {
    var c = H('div', 'card', '<div class="eyebrow">' + f + '</div>', main);
    defs.filter(function (b) { return b.fam === f; }).forEach(function (b) {
      var ok = !!got[b.id], v = Math.min(st[b.k], b.t);
      var r = H('div', 'step' + (ok ? ' on' : ''), '', c);
      r.innerHTML = '<span class="mk" aria-hidden="true">' + (ok ? '✓' : '') + '</span><span><b>' + b.n + '</b> <span class="ar">' + b.ar + '</span><br><span class="small">' + b.d + '</span></span><span class="mono">' + v + '/' + b.t + '</span><div class="bar"><i></i></div>';
      r.querySelector('i').style.width = Math.round(100 * v / b.t) + '%';
      r.setAttribute('aria-label', b.n + (ok ? ' : franchie' : ' : ' + v + ' sur ' + b.t));
    });
  });

  /* carte de maîtrise par thème, sur toutes les cartes disponibles */
  var lv = rev && rev.level ? rev.level : '', themes = {}, order = [];
  DATA.forEach(function (l) {
    var tot = (l.prepare ? l.prepare.length : 0) + (l.seul ? l.seul.length : 0), ma = 0;
    Object.keys(cards).forEach(function (k) { if (k.slice(0, k.indexOf(':')) === l.id && cards[k][0] >= 3) ma++; });
    var key = l.level + '|' + l.theme;
    if (!themes[key]) { themes[key] = { lv: l.level, th: l.theme, tot: 0, ma: 0 }; order.push(key); }
    themes[key].tot += tot; themes[key].ma += Math.min(ma, tot);
  });
  var LV = ['1', '2', '3'].filter(function (k) { return order.some(function (key) { return themes[key].lv === k; }); });
  if (LV.length) {
    var cur = LV.indexOf(lv) >= 0 ? lv : LV[0];
    var m = H('div', 'card', '<div class="eyebrow">Maîtrise par thème · <span class="ar">الإتقان حسب المحور</span></div>', main);
    var tabs = H('div', 'conf', '', m), list = H('div', '', '', m);
    function draw() {
      list.innerHTML = '';
      Array.prototype.forEach.call(tabs.children, function (b) { b.classList.toggle('on', b.getAttribute('data-l') === cur); });
      order.filter(function (key) { return themes[key].lv === cur; }).forEach(function (key) {
        var t = themes[key], p = t.tot ? Math.round(100 * t.ma / t.tot) : 0;
        var r = H('div', 'mrow', '<span>' + t.th + '</span><span class="mono">' + p + ' %</span><div class="bar"><i></i></div>', list);
        r.querySelector('i').style.width = p + '%';
      });
    }
    LV.forEach(function (k) { var b = H('button', 'btn', k + 'AC', tabs); b.type = 'button'; b.setAttribute('data-l', k); b.onclick = function () { cur = k; draw(); }; });
    draw();
    H('p', 'small', 'Une carte est maîtrisée quand tu l\'as réussie avec assurance trois fois, à des jours différents.', m);
  }
  var a = H('a', 'btn pri big', 'Révision du jour ▶', main); a.href = '../revision/'; a.style.display = 'block'; a.style.textAlign = 'center'; a.style.textDecoration = 'none';
})();
