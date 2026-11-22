/* Fiche de résultats d'un poste : lit le stockage local du navigateur (clés de la plateforme mv_*). */
(function () {
  'use strict';
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function json(k) { try { return JSON.parse(get(k) || 'null'); } catch (e) { return null; } }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var SUBJ = { maths: 'Maths', pc: 'PC' };
  var eleve = json('mv_eleve') || {}, pred = (json('mv_pred1') || { by: {} }).by, rev = json('mv_rev1') || { cards: {}, streak: { n: 0 } };
  var lab = $('lab'); lab.value = get('club_label') || eleve.name || '';
  lab.oninput = function () { set('club_label', lab.value); head(); };

  var rows = CATALOG.map(function (l) {
    var note = get('mv_score_' + l.id), done = !!get('mv_done_' + l.id), p = pred[l.id];
    return { s: SUBJ[l.s], lvl: l.lvl, title: l.title, note: note == null ? '' : +note, done: done, pred: p == null ? '' : (p ? 'juste' : 'à retenir') };
  }).filter(function (r) { return r.done || r.note !== '' || r.pred !== ''; });

  function fmt(n) { return String(n).replace('.', ','); }
  function today() { var d = new Date(); return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }
  function head() {
    $('head').innerHTML = '<div class="eyebrow">Fiche</div><p><b>' + esc(lab.value || 'Poste sans nom') + '</b></p><p class="small">Éditée le ' + today() + '</p>';
  }
  head();

  var notes = rows.filter(function (r) { return r.note !== ''; });
  var avg = notes.length ? Math.round(10 * notes.reduce(function (a, r) { return a + r.note; }, 0) / notes.length) / 10 : null;
  $('lessons').innerHTML = '<div class="eyebrow">Leçons</div>' + (rows.length ?
    '<p class="small">' + rows.filter(function (r) { return r.done; }).length + ' leçon(s) terminée(s)' + (avg != null ? ' · moyenne des notes : <b>' + fmt(avg) + ' / 20</b>' : '') + '</p>' +
    '<table><tr><th>Matière</th><th>Niveau</th><th>Leçon</th><th>Note</th><th>Prédiction</th></tr>' + rows.map(function (r) {
      return '<tr><td>' + r.s + '</td><td>' + r.lvl + '</td><td>' + esc(r.title) + '</td><td class="mono">' + (r.note !== '' ? fmt(r.note) + ' / 20' : (r.done ? 'terminée' : '')) + '</td><td>' + r.pred + '</td></tr>';
    }).join('') + '</table>' : '<p class="small">Aucune leçon commencée sur ce poste.</p>');

  var ids = Object.keys(rev.cards || {}), master = ids.filter(function (k) { return rev.cards[k][0] >= 3; }).length;
  $('rev').innerHTML = '<div class="eyebrow">Révision du jour</div>' + (ids.length ?
    '<table><tr><td>Cartes travaillées</td><td class="mono">' + ids.length + '</td></tr><tr><td>Cartes maîtrisées (réussies avec assurance 3 fois)</td><td class="mono">' + master + '</td></tr><tr><td>Jours de suite (dernière série)</td><td class="mono">' + ((rev.streak && rev.streak.n) || 0) + '</td></tr></table>' :
    '<p class="small">Pas encore de séance de révision du jour sur ce poste.</p>');

  function csv() {
    var L = ['Fiche;Matière;Niveau;Leçon;Note sur 20;Prédiction'];
    function c(x) { return '"' + String(x).replace(/"/g, '""') + '"'; }
    rows.forEach(function (r) { L.push([c(lab.value || 'Poste'), c(r.s), c(r.lvl), c(r.title), r.note === '' ? '' : String(r.note).replace('.', ','), c(r.pred)].join(';')); });
    L.push([c(lab.value || 'Poste'), c('Révision'), '', c('cartes travaillées / maîtrisées'), '', c(ids.length + ' / ' + master)].join(';'));
    return '﻿' + L.join('\r\n');
  }
  $('print').onclick = function () { window.print(); };
  $('csv').onclick = function () {
    var a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv());
    a.download = 'resultats-' + (lab.value || 'poste').replace(/[^A-Za-z0-9_-]+/g, '-') + '.csv'; document.body.appendChild(a); a.click(); a.remove();
    $('msg').className = 'fb ok'; $('msg').textContent = 'Fichier préparé. Cherche-le dans le dossier Téléchargements.';
  };
  $('clear').onclick = function () {
    if (!window.confirm('Effacer toutes les données de ce poste (leçons, notes, révision) ? Cette action est définitive.')) return;
    try { var k = []; for (var i = 0; i < localStorage.length; i++) { var n = localStorage.key(i); if (/^(mv_|club_)/.test(n) && n !== 'mv_theme') k.push(n); } k.forEach(function (n) { localStorage.removeItem(n); }); } catch (e) {}
    location.reload();
  };
})();
