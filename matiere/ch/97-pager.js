/* ===================================================== UNE LEÇON À LA FOIS
   Dans un chapitre, une seule leçon est affichée : l'élève voit tout de suite l'animation, sans descendre la page.
   La barre des leçons (collante) permet de sauter d'une leçon à l'autre, « Précédente / Suivante » est sous chaque leçon.
   Les leçons masquées ne tournent pas (PC.anim s'arrête sur un élément caché) : l'écran est aussi plus fluide. */
function pgGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
function pgSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function pagerBuild(ch) {
  var id = ch.id, toc = ch.querySelector('ul.toc');
  var les = Array.prototype.filter.call(ch.children, function (x) { return x.tagName === 'SECTION' && x.classList.contains('lesson'); });
  if (!toc || !les.length) return;
  ch.setAttribute('data-pager', '1'); ch.classList.add('paged'); toc.classList.add('stepper'); toc.setAttribute('aria-label', 'Leçons du chapitre');
  var seen = pgGet('tech_seen_' + id, []), chips = Array.prototype.slice.call(toc.querySelectorAll('a')), navs = [];
  chips.forEach(function (a, i) {
    var t = a.textContent, b = document.createElement('b'), sp = document.createElement('span');
    b.textContent = String(i + 1); sp.textContent = t; a.textContent = ''; a.appendChild(b); a.appendChild(sp);
    a.addEventListener('click', function (e) { e.preventDefault(); show(i, true); });
  });
  les.forEach(function (s, i) {
    var nav = h('div', { 'class': 'pager-nav' });
    var prev = h('button', { 'class': 'btn', type: 'button' }, '◀ Précédente'), next = h('button', { 'class': 'btn go', type: 'button' }, 'Leçon suivante ▶');
    var cnt = h('span', { 'class': 'pager-cnt' }, (i + 1) + ' / ' + les.length);
    prev.disabled = i === 0;
    if (i === les.length - 1) { next.textContent = 'Fin du chapitre ✓'; next.addEventListener('click', function () { location.hash = '#home'; }); }
    else next.addEventListener('click', function () { show(i + 1, true); });
    prev.addEventListener('click', function () { show(i - 1, true); });
    nav.appendChild(prev); nav.appendChild(cnt); nav.appendChild(next); s.appendChild(nav);
  });
  function show(i, scroll) {
    if (i < 0 || i >= les.length) return;
    les.forEach(function (s, k) { s.hidden = k !== i; });
    if (seen.indexOf(i) < 0) { seen.push(i); pgSet('tech_seen_' + id, seen); }
    chips.forEach(function (a, k) { a.classList.toggle('on', k === i); a.classList.toggle('seen', k !== i && seen.indexOf(k) > -1); if (k === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    var a = chips[i]; toc.scrollLeft = Math.max(0, a.offsetLeft - (toc.clientWidth - a.offsetWidth) / 2);
    try { history.replaceState(null, '', '#' + id + '-l' + (i + 1)); } catch (e) {}
    if (scroll) { var y = les[i].getBoundingClientRect().top + window.pageYOffset - toc.offsetHeight - 6; window.scrollTo(0, Math.max(0, y)); }
  }
  ch._pagerShow = show; ch._pagerCount = les.length;
  var m = new RegExp('^#' + id + '-l(\\d+)$').exec(location.hash || ''), first = m ? Math.min(les.length, Math.max(1, +m[1])) - 1 : 0;
  show(first, !!m);
}
function pagerInject() {
  try { if (sessionStorage.getItem('tech_nopager')) return; } catch (e) {}   /* interrupteur des tests : toutes les leçons affichées */
  Array.prototype.forEach.call(document.querySelectorAll('section.chapter'), function (ch) { if (!ch.hasAttribute('data-pager') && ch.querySelector('ul.toc')) pagerBuild(ch); });
}
(function () {
  /* un observateur léger par chapitre (ses enfants seulement) : il se déclenche à la construction paresseuse du chapitre */
  Array.prototype.forEach.call(document.querySelectorAll('section.chapter'), function (ch) {
    new MutationObserver(function () { pagerInject(); }).observe(ch, { childList: true });
  });
  /* lien direct vers une leçon (#t3-5-l3) : le chapitre est construit à la première visite, on l'ouvre d'abord puis on affiche la leçon */
  function deep() {
    var m = /^#(t[23]-\d+)-l(\d+)$/.exec(location.hash || ''); if (!m) return;
    var ch = document.getElementById(m[1]); if (!ch) return;
    if (ch._pagerShow) { ch._pagerShow(Math.min(ch._pagerCount, Math.max(1, +m[2])) - 1, true); return; }
    if (document.getElementById(m[1] + '-l' + m[2])) return;
    try { history.replaceState(null, '', '#' + m[1]); } catch (e) {}
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    pagerInject();
    if (ch._pagerShow) ch._pagerShow(Math.min(ch._pagerCount, Math.max(1, +m[2])) - 1, true);
  }
  window.addEventListener('hashchange', deep);
  pagerInject();
  deep();
})();
