/* ===================================================== FICHE A4 IMPRIMABLE
   Un bouton « Fiche A4 » dans chaque chapitre : l'essentiel (À retenir), le résumé arabe, les termes FR/AR,
   une case « Je sais expliquer » par leçon et un cadre pour le schéma de l'élève. Le contenu est lu dans le chapitre ouvert. */
function ficheText(node) { return node ? node.innerHTML : ''; }
function ficheBuild(ch) {
  var id = ch.id || '', lvl = id.indexOf('t2-') === 0 ? '2e année' : '3e année';
  var title = (ch.querySelector('h2') || {}).textContent || '', arT = (ch.querySelector('.ar-title') || {}).textContent || '';
  var box = h('div', { id: 'fiche' });
  var head = h('div', { 'class': 'fi-head' });
  head.appendChild(h('div', { 'class': 'fi-kick' }, 'Technologie · ' + ((ch.querySelector('.eyebrow') || {}).textContent || lvl)));
  head.appendChild(h('h1', null, title));
  if (arT) head.appendChild(h('div', { 'class': 'fi-ar', dir: 'rtl', lang: 'ar' }, arT));
  head.appendChild(h('div', { 'class': 'fi-who' }, 'Nom : ………………………………………  Classe : …………  Date : …… / …… / ……'));
  box.appendChild(head);
  var words = [], seen = {}, n = 0;
  Array.prototype.forEach.call(ch.querySelectorAll('section.lesson'), function (l) {
    var r = l.querySelector('.retenir'); if (!r) return; n++;
    var sec = h('section', { 'class': 'fi-les' });
    sec.appendChild(h('h2', null, (l.querySelector('h3') || {}).textContent || ''));
    var body = h('div', { 'class': 'fi-body' }); Array.prototype.forEach.call(r.querySelectorAll('p'), function (p) { body.appendChild(h('p', null, p.innerHTML)); }); sec.appendChild(body);
    var ar = l.querySelector('details.ar');
    if (ar) {
      var ps = Array.prototype.filter.call(ar.querySelectorAll('p'), function (p) { return !p.className; });
      if (ps.length) { var a = h('div', { 'class': 'fi-ar-p', dir: 'rtl', lang: 'ar' }); ps.forEach(function (p) { a.appendChild(h('p', null, p.innerHTML)); }); sec.appendChild(a); }
      Array.prototype.forEach.call(ar.querySelectorAll('.ar-words li'), function (li) {
        var sp = li.querySelectorAll('span'); if (sp.length < 2) return; var fr = sp[0].textContent; if (seen[fr]) return; seen[fr] = 1; words.push([fr, sp[1].textContent]);
      });
    }
    sec.appendChild(h('div', { 'class': 'fi-check' }, '☐ Je sais l’expliquer avec mes mots'));
    box.appendChild(sec);
  });
  if (words.length) {
    var t = h('table', { 'class': 'fi-words' }), tb = h('tbody'); t.appendChild(h('caption', null, 'Vocabulaire · المصطلحات'));
    for (var i = 0; i < words.length; i += 2) {
      var tr = h('tr'); [words[i], words[i + 1]].forEach(function (w) { tr.appendChild(h('td', { lang: 'fr' }, w ? w[0] : '')); tr.appendChild(h('td', { dir: 'rtl', lang: 'ar' }, w ? w[1] : '')); }); tb.appendChild(tr);
    }
    t.appendChild(tb); box.appendChild(t);
  }
  box.appendChild(h('div', { 'class': 'fi-draw' }, 'Mon schéma ou mes notes'));
  box.appendChild(h('div', { 'class': 'fi-foot' }, 'technologie.taalim.men · ' + n + ' leçon' + (n > 1 ? 's' : '')));
  return box;
}
function ficheOpen(ch) {
  var old = document.getElementById('fiche'); if (old) old.remove();
  var box = ficheBuild(ch); document.body.appendChild(box); document.body.classList.add('printing');
  function clean() { document.body.classList.remove('printing'); var b = document.getElementById('fiche'); if (b) b.remove(); window.removeEventListener('afterprint', clean); }
  window.addEventListener('afterprint', clean);
  try { window.print(); } catch (e) { clean(); }
}
function ficheInject() {
  Array.prototype.forEach.call(document.querySelectorAll('section.chapter, .chapter.view'), function (ch) {
    if (ch.querySelector('.fiche-btn') || !ch.querySelector('ul.toc')) return;
    var b = h('button', { 'class': 'btn fiche-btn', type: 'button', 'aria-label': 'Fiche A4 à imprimer' }, '🖨 Fiche A4');
    b.addEventListener('click', function () { ficheOpen(ch); });
    var wrap = h('div', { 'class': 'fiche-row' }); wrap.appendChild(b); ch.querySelector('ul.toc').before(wrap);
  });
}
(function () {
  var q = false;
  function go() { if (q) return; q = true; requestAnimationFrame(function () { q = false; ficheInject(); }); }
  new MutationObserver(go).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('hashchange', go); window.addEventListener('load', go); go();
})();
