/* Énigme du jour : une question courte par matière, la même pour tous ce jour-là (window.MVE). */
(function () {
  'use strict';
  var R = window.MVE || [], box = document.getElementById('enigme');
  if (!box || !R.length || !window.MV) return;
  var H = window.MV.H, store = window.MV.store;
  var d = new Date(), day = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(), hsh = 0;
  for (var i = 0; i < day.length; i++) hsh = (hsh * 31 + day.charCodeAt(i)) >>> 0;
  var r = R[hsh % R.length], saved = {};
  try { saved = JSON.parse(store.get('mv_enigme') || '{}') || {}; } catch (_) {}
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var card = H('div', 'card enigme', '<div class="eyebrow">Énigme du jour · لغز اليوم</div><p class="q">' + esc(r.q) + '</p><p class="ar">' + esc(r.qa || '') + '</p>', box);
  var opts = H('div', 'opts', '', card), fb = H('p', 'small', '', card);
  fb.setAttribute('aria-live', 'polite');
  function reveal(k) {
    [].forEach.call(opts.children, function (b, j) { b.disabled = true; if (j === r.a) b.classList.add('ok'); else if (j === k) b.classList.add('ko'); });
    fb.innerHTML = '<b>' + (k === r.a ? 'Exact.' : 'Pas tout à fait.') + '</b> ' + esc(r.e) + (r.ea ? '<span class="ar" style="display:block">' + esc(r.ea) + '</span>' : '');
  }
  r.o.forEach(function (t, k) {
    var b = H('button', 'btn', esc(t), opts);
    b.onclick = function () { store.set('mv_enigme', JSON.stringify({ day: day, pick: k })); reveal(k); };
  });
  if (saved.day === day && typeof saved.pick === 'number' && saved.pick < r.o.length) reveal(saved.pick);
})();
