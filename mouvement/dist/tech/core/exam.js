/* Examens « en mouvement » : questions tirées des leçons (Je me prépare, Je fais seul),
   par niveau scolaire et par difficulté. Une seule réponse par question, correction à la fin. */
(function () {
  'use strict';
  var MV = window.MV, H = MV.H, store = MV.store, DATA = window.MVQ || [];
  var main = document.getElementById('ex'); if (!main) return;
  MV.fullscreenBtn();

  var DIFF = [
    { k: 1, fr: 'Niveau 1 · Essentiel', ar: 'المستوى 1: الأساسيات', d: 'Vrai ou faux et exercices de niveaux 1 et 2.', lv: [0, 1, 2] },
    { k: 2, fr: 'Niveau 2 · Application', ar: 'المستوى 2: التطبيق', d: 'Exercices de niveaux 2 et 3.', lv: [2, 3] },
    { k: 3, fr: 'Niveau 3 · Approfondissement', ar: 'المستوى 3: التعمق', d: 'Exercices de niveaux 3 et 4, les plus exigeants.', lv: [3, 4] }
  ];
  var LEVELS = ['1', '2', '3'].filter(function (k) { return DATA.some(function (l) { return l.level === k; }); });
  var cfg = { level: (location.hash.match(/n([123])/) || [])[1] || LEVELS[0] || '1', diff: 1, theme: '', n: 10 };
  if (LEVELS.indexOf(cfg.level) < 0) cfg.level = LEVELS[0];
  var box = H('div', '', '', main);

  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function num(v) { return String(v).replace('.', ','); }
  function lessonsOf() { return DATA.filter(function (l) { return l.level === cfg.level && (!cfg.theme || l.theme === cfg.theme); }); }
  function bestKey() { return 'mv_exam_' + cfg.level + '_' + cfg.diff + (cfg.theme ? '_' + cfg.theme : ''); }

  // banque : une file de questions par leçon, puis tirage tour à tour pour couvrir le plus de leçons possible
  function draw() {
    var lv = DIFF[cfg.diff - 1].lv, files = lessonsOf().map(function (l) {
      var qs = [];
      if (lv.indexOf(0) >= 0) l.prepare.forEach(function (p) { qs.push({ L: l, q: 'Vrai ou faux ? ' + p.q, o: ['Vrai', 'Faux'], a: p.a ? 0 : 1, e: p.e }); });
      l.seul.forEach(function (s) { if (lv.indexOf(s.lvl) >= 0) qs.push({ L: l, q: s.q, o: s.o, a: s.a, tol: s.tol, unit: s.unit, e: s.e || s.ok, lvl: s.lvl }); });
      return shuffle(qs);
    });
    shuffle(files);
    var out = [];
    for (var round = 0; out.length < cfg.n; round++) {
      var added = false;
      files.forEach(function (f) { if (out.length < cfg.n && f[round]) { out.push(f[round]); added = true; } });
      if (!added) break;
    }
    return shuffle(out).map(function (q) { // options mélangées, bonne réponse suivie
      if (!q.o || q.o[0] === 'Vrai') return q;
      var idx = shuffle(q.o.map(function (_, i) { return i; }));
      return Object.assign({}, q, { o: idx.map(function (i) { return q.o[i]; }), a: idx.indexOf(q.a) });
    });
  }

  /* ---------- 1. choix de l'examen ---------- */
  function setup() {
    box.innerHTML = '';
    var c = H('div', 'card', '<div class="eyebrow">1. Niveau scolaire</div>', box), lv = H('div', 'seg', '', c);
    LEVELS.forEach(function (k) {
      var b = H('button', 'btn' + (cfg.level === k ? ' pri' : ''), k + 'AC', lv);
      b.onclick = function () { cfg.level = k; cfg.theme = ''; setup(); };
    });
    var themes = DATA.filter(function (l) { return l.level === cfg.level; }).map(function (l) { return l.theme; })
      .filter(function (t, i, a) { return a.indexOf(t) === i; });
    H('div', 'eyebrow', '2. Partie du programme', c).style.marginTop = '14px';
    var th = H('div', 'seg wrapseg', '', c);
    [''].concat(themes).forEach(function (t) {
      var b = H('button', 'btn' + (cfg.theme === t ? ' pri' : ''), t || 'Toute l\'année', th);
      b.onclick = function () { cfg.theme = t; setup(); };
    });
    var nl = lessonsOf().length;
    H('p', 'small', nl + ' leçon' + (nl > 1 ? 's' : '') + ' concernée' + (nl > 1 ? 's' : '') + '.', c);

    var c2 = H('div', 'card', '<div class="eyebrow">3. Difficulté</div>', box);
    DIFF.forEach(function (d) {
      var key = 'mv_exam_' + cfg.level + '_' + d.k + (cfg.theme ? '_' + cfg.theme : ''), best = store.get(key);
      var b = H('button', 'btn opt diff' + (cfg.diff === d.k ? ' pri' : ''), '<b>' + d.fr + '</b><span class="ar">' + d.ar + '</span><span class="small">' + d.d +
        (best ? ' Meilleure note : ' + num(best) + '/20.' : '') + '</span>', c2);
      b.onclick = function () { cfg.diff = d.k; setup(); };
    });

    var c3 = H('div', 'card', '<div class="eyebrow">4. Nombre de questions</div>', box), sn = H('div', 'seg', '', c3);
    [10, 20].forEach(function (n) {
      var b = H('button', 'btn' + (cfg.n === n ? ' pri' : ''), n + ' questions', sn);
      b.onclick = function () { cfg.n = n; setup(); };
    });
    MV.eleveCard(box);
    var go = H('button', 'btn pri big', 'Commencer l\'examen ▶', box);
    go.onclick = function () { run(draw()); };
    H('p', 'small', 'Une seule réponse par question. La correction et la note sur 20 s\'affichent à la fin.', box);
  }

  /* ---------- 2. passage de l'examen ---------- */
  function run(qs) {
    if (!qs.length) { box.innerHTML = '<p class="card">Pas de question pour ce choix.</p>'; return; }
    var i = 0, ans = [], t0 = Date.now();
    box.innerHTML = '';
    var head = H('div', 'exhead', '', box), bar = H('div', 'bar', '<i></i>', box), card = H('div', 'card', '', box);
    var tick = setInterval(function () { clock(); }, 1000);
    function clock() { var s = Math.round((Date.now() - t0) / 1000); head.innerHTML = '<span>Question ' + Math.min(i + 1, qs.length) + ' / ' + qs.length + '</span><span class="mono">' + Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2) + '</span>'; }
    function show() {
      clock(); bar.firstChild.style.width = (100 * i / qs.length) + '%';
      var q = qs[i];
      card.innerHTML = '<div class="eyebrow">' + q.L.title + (q.lvl ? ' · Niveau ' + q.lvl : '') + '</div><div class="q">' + q.q + '</div>';
      if (q.o) {
        var opts = H('div', 'opts', '', card);
        q.o.forEach(function (t, k) { var b = H('button', 'btn opt', t, opts); b.onclick = function () { next(k); }; });
      } else {
        var r = H('div', 'row', '<input class="num" inputmode="decimal" aria-label="Réponse">' + (q.unit ? '<span class="small">' + q.unit + '</span>' : '') +
          '<button class="btn pri">Valider</button><button class="btn">Je ne sais pas</button>', card);
        var inp = r.querySelector('input'), bs = r.querySelectorAll('button'), fb = H('div', 'fb', '', card);
        var val = function () { if (inp.value.trim() === '') { fb.className = 'fb ko'; fb.textContent = 'Écris ta réponse ou choisis « Je ne sais pas ».'; return; } next(inp.value.trim()); };
        bs[0].onclick = val; bs[1].onclick = function () { next(null); };
        inp.onkeydown = function (e) { if (e.key === 'Enter') val(); };
        inp.focus();
      }
    }
    function next(v) {
      ans.push(v); i++;
      window.scrollTo(0, 0);
      if (i < qs.length) show(); else { clearInterval(tick); result(qs, ans, Math.round((Date.now() - t0) / 1000)); }
    }
    show();
  }

  /* ---------- 3. note et correction ---------- */
  function right(q, v) {
    if (v == null) return false;
    if (q.o) return v === q.a;
    var x = MV.parseNum(v); return !isNaN(x) && Math.abs(x - q.a) <= (q.tol || 1e-9);
  }
  function result(qs, ans, sec) {
    var ok = qs.filter(function (q, k) { return right(q, ans[k]); }).length;
    var note = Math.round(40 * ok / qs.length) / 2, key = bestKey(), best = +(store.get(key) || -1);
    if (note > best) { store.set(key, String(note)); best = note; }
    var envoye = MV.notifyResult({ title: 'Examen ' + cfg.level + 'AC' + (cfg.theme ? ' · ' + cfg.theme : '') + ' · ' + qs.length + ' questions', d: cfg.diff, good: ok, asked: qs.length, pct: Math.round(100 * ok / qs.length), pts: note, max: 20 });
    var weak = {};
    qs.forEach(function (q, k) { if (!right(q, ans[k])) weak[q.L.id] = q.L; });
    box.innerHTML = '';
    var c = H('div', 'card eval', '<div class="eyebrow">Résultat · ' + cfg.level + 'AC · ' + DIFF[cfg.diff - 1].fr + (cfg.theme ? ' · ' + cfg.theme : '') + '</div>' +
      '<div class="note20"><b>' + num(note) + '</b><span>/ 20</span></div><div class="mention">' + MV.mention(note) + '</div>' +
      '<table class="voc"><tr><td>Bonnes réponses</td><td class="mono">' + ok + ' / ' + qs.length + '</td></tr>' +
      '<tr><td>Durée</td><td class="mono">' + Math.floor(sec / 60) + ' min ' + ('0' + sec % 60).slice(-2) + ' s</td></tr>' +
      '<tr><td>Meilleure note à cet examen</td><td class="mono">' + num(best) + ' / 20</td></tr></table>' +
      (envoye ? '<p class="small">Note envoyée à ton enseignant.</p>' : ''), box);
    var ids = Object.keys(weak);
    if (ids.length) H('div', '', '<div class="q">Leçons à revoir</div>' + ids.map(function (id) { return '<a class="relink" href="../' + id + '/">' + weak[id].title + ' ▶</a>'; }).join(''), c);
    var row = H('div', 'row', '', c);
    var again = H('button', 'btn pri', 'Nouvel examen ▶', row); again.onclick = function () { run(draw()); };
    var back = H('button', 'btn', 'Changer de niveau', row); back.onclick = setup;

    var cor = H('div', 'card', '<div class="eyebrow">Correction</div>', box);
    qs.forEach(function (q, k) {
      var g = right(q, ans[k]), mine = ans[k] == null ? 'sans réponse' : q.o ? q.o[ans[k]] : ans[k] + (q.unit ? ' ' + q.unit : '');
      var good = q.o ? q.o[q.a] : num(q.a) + (q.unit ? ' ' + q.unit : '');
      H('div', 'corr ' + (g ? 'ok' : 'ko'), '<div class="q">' + (k + 1) + '. ' + q.q + '</div>' +
        '<div>' + (g ? '✓ Juste : ' + good : '✗ Ta réponse : ' + mine + '<br>Bonne réponse : <b>' + good + '</b>') + '</div>' +
        (q.e ? '<div class="small">' + q.e + '</div>' : '') + '<div class="small">Leçon : <a href="../' + q.L.id + '/">' + q.L.title + '</a></div>', cor);
    });
  }

  setup();
})();
