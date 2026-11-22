/* thème mémorisé comme sur la plateforme (mv_theme) ; aucune donnée n'est envoyée */
(function () {
  var t = null; try { t = localStorage.getItem('mv_theme'); } catch (e) {}
  if (!t) t = window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.classList.toggle('light', t === 'light');
})();
