/* Révision du jour : cartes tirées des leçons, révision espacée (boîtes de Leitner), confiance avant la réponse.
   Rien ne quitte l'appareil, aucun classement entre élèves. Les données vivent dans localStorage. */
(function () {
  'use strict';
  var MV = window.MV, H = MV.H, store = MV.store, DATA = window.MVQ || [];
  var main = document.getElementById('ex'); if (!main) return;
  MV.fullscreenBtn();

  var KEY = 'mv_rev1', GAP = [0, 1, 3, 7, 14, 30], SIZE = 8, MASTER = 3; // boîte 3 et plus = maîtrisée
  var box = H('div', '', '', main);

  function load() { try { return JSON.parse(store.get(KEY)) || {}; } catch (e) { return {}; } }
  var S = load(); S.cards = S.cards || {}; S.streak = S.streak || { last: -9, n: 0 }; S.level = S.level || '';
  function save() { store.set(KEY, JSON.stringify(S)); }
  function today() { var d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 6e4) / 864e5); }
  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function num(v) { return String(v).replace('.', ','); }
  function plural(n, s) { return n + ' ' + s + (n > 1 ? 's' : ''); }

  var LEVELS = ['1', '2', '3'].filter(function (k) { return DATA.some(function (l) { return l.level === k; }); });
  if (LEVELS.indexOf(S.level) < 0) S.level = LEVELS[0] || '1';

  /* ---------- le paquet de cartes d'un niveau ---------- */
  function pool(level) {
    var out = [];
    DATA.filter(function (l) { return l.level === level; }).forEach(function (l) {
      l.prepare.forEach(function (p) { out.push({ id: l.id + ':' + hash('t' + p.q), L: l, lvl: 0, q: 'Vrai ou faux ? ' + p.q, o: ['Vrai', 'Faux'], a: p.a ? 0 : 1, e: p.e }); });
      l.seul.forEach(function (s) { out.push({ id: l.id + ':' + hash(s.q), L: l, lvl: s.lvl, q: s.q, o: s.o, a: s.a, tol: s.tol, unit: s.unit, e: s.e || s.ok }); });
    });
    return out;
  }
  function boxOf(c) { var r = S.cards[c.id]; return r ? r[0] : 0; }
  function mastery(cards) { return cards.length ? Math.round(100 * cards.filter(function (c) { return boxOf(c) >= MASTER; }).length / cards.length) : 0; }

  /* ---------- choix de la séance ---------- */
  function pick(cards) {
    var t = today(), seen = cards.filter(function (c) { return S.cards[c.id]; }),
        due = seen.filter(function (c) { return S.cards[c.id][1] <= t; })
          .sort(function (a, b) { return S.cards[a.id][1] - S.cards[b.id][1] || boxOf(a) - boxOf(b); }),
        pct = mastery(cards), cap = pct >= 70 ? 4 : pct >= 40 ? 3 : 2,
        fresh = cards.filter(function (c) { return !S.cards[c.id] && c.lvl <= cap; });
    var weak = {}; // les leçons les moins maîtrisées passent en premier
    DATA.forEach(function (l) { weak[l.id] = mastery(cards.filter(function (c) { return c.L.id === l.id; })); });
    var byL = {};
    shuffle(fresh).forEach(function (c) { (byL[c.L.id] = byL[c.L.id] || []).push(c); });
    var ids = Object.keys(byL).sort(function (a, b) { return weak[a] - weak[b] || Math.random() - 0.5; }), mix = [];
    for (var r = 0; mix.length < SIZE && ids.some(function (i) { return byL[i][r]; }); r++) ids.forEach(function (i) { if (byL[i][r]) mix.push(byL[i][r]); });
    var out = due.slice(0, Math.ceil(SIZE * 0.6)).concat(mix);
    out = out.slice(0, SIZE);
    if (out.length < SIZE) { // pas assez de nouvelles cartes : on avance les plus fragiles
      var rest = seen.filter(function (c) { return out.indexOf(c) < 0; }).sort(function (a, b) { return boxOf(a) - boxOf(b); });
      out = out.concat(rest.slice(0, SIZE - out.length));
    }
    var bonus = fresh.filter(function (c) { return c.lvl >= 3 && out.indexOf(c) < 0; });
    if (out.length >= SIZE && bonus.length && Math.random() < 0.35) { var b = bonus[Math.floor(Math.random() * bonus.length)]; out[out.length - 1] = Object.assign({}, b, { bonus: true }); }
    return shuffle(out).map(function (q) {
      if (!q.o || q.o[0] === 'Vrai') return q;
      var idx = shuffle(q.o.map(function (_, i) { return i; }));
      return Object.assign({}, q, { o: idx.map(function (i) { return q.o[i]; }), a: idx.indexOf(q.a) });
    });
  }

  function setup() {
    box.innerHTML = '';
    var cards = pool(S.level), t = today(), nDue = cards.filter(function (c) { return S.cards[c.id] && S.cards[c.id][1] <= t; }).length,
        done = S.streak.last === t;
    var c = H('div', 'card', '<div class="eyebrow">Niveau scolaire</div>', box), lv = H('div', 'seg', '', c);
    LEVELS.forEach(function (k) {
      var b = H('button', 'btn' + (S.level === k ? ' pri' : ''), k + 'AC', lv);
      b.onclick = function () { S.level = k; save(); setup(); };
    });
    var st = H('div', 'card', '', box);
    H('div', 'stat3', '<div><b>' + mastery(cards) + ' %</b><span>maîtrise · <span class="ar">إتقان</span></span></div>' +
      '<div><b>' + (S.streak.last >= t - 1 ? S.streak.n : 0) + '</b><span>jours de suite · <span class="ar">أيام متتالية</span></span></div>' +
      '<div><b>' + nDue + '</b><span>à revoir aujourd\'hui · <span class="ar">للمراجعة</span></span></div>', st);
    H('p', 'small', done ? 'Séance du jour faite. Une séance de plus reste possible.' :
      'Huit cartes, environ cinq minutes. Les cartes que tu réussis reviennent de plus en plus tard : c\'est ce qui fixe la mémoire.', st);
    themeMap(cards, box);
    MV.eleveCard(box);
    var go = H('button', 'btn pri big', done ? 'Une séance de plus ▶' : 'Commencer la séance ▶', box);
    go.onclick = function () { run(pick(cards), cards); };
  }

  function themeMap(cards, parent) {
    var themes = [];
    cards.forEach(function (c) { if (themes.indexOf(c.L.theme) < 0) themes.push(c.L.theme); });
    if (!themes.length) return;
    var m = H('div', 'card', '<div class="eyebrow">Ma carte de maîtrise · <span class="ar">خريطة الإتقان</span></div>', parent);
    themes.forEach(function (th) {
      var p = mastery(cards.filter(function (c) { return c.L.theme === th; }));
      var r = H('div', 'mrow', '<span>' + th + '</span><span class="mono">' + p + ' %</span><div class="bar"><i></i></div>', m);
      r.querySelector('i').style.width = p + '%';
    });
    H('p', 'small', 'Une carte est maîtrisée quand tu l\'as réussie avec assurance trois fois, à des jours différents.', m);
  }

  /* ---------- la séance ---------- */
  function right(q, v) {
    if (v == null) return false;
    if (q.o) return v === q.a;
    var x = MV.parseNum(v); return !isNaN(x) && Math.abs(x - q.a) <= (q.tol || 1e-9);
  }
  function run(qs, cards) {
    var queue = qs.slice(), total = qs.length, i = 0, log = [], before = mastery(cards), streakRun = 0, retried = {};
    box.innerHTML = '';
    var head = H('div', 'exhead', '', box), bar = H('div', 'bar', '<i></i>', box), card = H('div', 'card', '', box);
    function show() {
      var q = queue[i], conf = true;
      head.innerHTML = '<span>Carte ' + Math.min(log.length + 1, total) + ' / ' + total + (q.retry ? ' · deuxième chance' : '') + '</span><span class="mono">série ' + streakRun + '</span>';
      bar.firstChild.style.width = (100 * log.length / total) + '%';
      card.innerHTML = '<div class="eyebrow">' + q.L.title + (q.bonus ? '<span class="tag">Défi · points doublés</span>' : '') + '</div><div class="q">' + q.q + '</div>';
      var cf = H('div', 'conf', '', card), yes = H('button', 'btn on', 'Je suis sûr·e', cf), no = H('button', 'btn', 'J\'hésite', cf);
      yes.onclick = function () { conf = true; yes.className = 'btn on'; no.className = 'btn'; };
      no.onclick = function () { conf = false; no.className = 'btn on'; yes.className = 'btn'; };
      if (q.o) {
        var opts = H('div', 'opts', '', card);
        q.o.forEach(function (t, k) { var b = H('button', 'btn opt', t, opts); b.onclick = function () { answer(q, k, conf); }; });
      } else {
        var r = H('div', 'row', '<input class="num" inputmode="decimal" aria-label="Réponse">' + (q.unit ? '<span class="small">' + q.unit + '</span>' : '') +
          '<button class="btn pri">Valider</button><button class="btn">Je ne sais pas</button>', card);
        var inp = r.querySelector('input'), bs = r.querySelectorAll('button'), fb = H('div', 'fb', '', card);
        var val = function () { if (inp.value.trim() === '') { fb.className = 'fb ko'; fb.textContent = 'Écris ta réponse ou choisis « Je ne sais pas ».'; return; } answer(q, inp.value.trim(), conf); };
        bs[0].onclick = val; bs[1].onclick = function () { answer(q, null, false); };
        inp.onkeydown = function (e) { if (e.key === 'Enter') val(); };
        inp.focus();
      }
    }
    function answer(q, v, sure) {
      var ok = right(q, v), t = today(), r = S.cards[q.id] || [0, t, 0, 0];
      if (!q.retry) { // la première réponse règle le calendrier
        var kind = ok ? (sure ? 'solide' : 'fragile') : (sure ? 'piège' : 'faux');
        r[2]++; if (ok) r[3]++;
        if (ok && sure) r[0] = Math.min(5, Math.max(1, r[0] + 1)); else if (ok) r[0] = Math.max(1, r[0]); else r[0] = 1;
        r[1] = t + GAP[r[0]];
        S.cards[q.id] = r;
        log.push({ q: q, v: v, ok: ok, kind: kind });
        if (!ok && !retried[q.id]) { retried[q.id] = 1; queue.push(Object.assign({}, q, { retry: true, bonus: false })); }
      }
      streakRun = ok ? streakRun + 1 : 0;
      var good = q.o ? q.o[q.a] : num(q.a) + (q.unit ? ' ' + q.unit : '');
      var msg = ok ? (sure ? 'Juste.' : 'Juste, mais tu hésitais : on te la reposera.') : (sure ? 'Faux, et tu étais sûr·e. C\'est ce genre d\'erreur qu\'il faut corriger maintenant.' : 'Pas encore.');
      card.querySelectorAll('button,input').forEach(function (e) { e.disabled = true; });
      var fb = H('div', 'fb ' + (ok ? 'ok' : 'ko'), '<b>' + msg + '</b>' + (ok ? '' : '<br>Bonne réponse : <b>' + good + '</b>') + (q.e ? '<div class="small">' + q.e + '</div>' : ''), card);
      var nx = H('button', 'btn pri', i + 1 < queue.length ? 'Continuer ▶' : 'Voir mon bilan ▶', card);
      nx.focus(); nx.onclick = function () { i++; window.scrollTo(0, 0); if (i < queue.length) show(); else finish(); };
      save();
    }
    function finish() {
      var t = today(), first = log, good = first.filter(function (x) { return x.ok; }).length;
      if (S.streak.last !== t) { S.streak = { last: t, n: S.streak.last === t - 1 ? S.streak.n + 1 : 1 }; }
      save();
      var after = mastery(cards), gain = after - before;
      var envoye = MV.notifyResult({ title: 'Révision du jour · ' + S.level + 'AC', d: 1, good: good, asked: first.length, pct: Math.round(100 * good / first.length), pts: good, max: first.length });
      box.innerHTML = '';
      var c = H('div', 'card eval', '<div class="eyebrow">Bilan · ' + S.level + 'AC</div>' +
        '<div class="stat3"><div><b>' + good + '/' + first.length + '</b><span>justes du premier coup</span></div>' +
        '<div><b>' + (gain >= 0 ? '+' : '') + gain + ' pt</b><span>de maîtrise · ' + after + ' %</span></div>' +
        '<div><b>' + S.streak.n + '</b><span>jours de suite</span></div></div>' +
        (envoye ? '<p class="small">Résultat envoyé à ton enseignant.</p>' : ''), box);
      var traps = first.filter(function (x) { return x.kind === 'piège'; }), frag = first.filter(function (x) { return x.kind === 'fragile'; });
      if (traps.length) {
        H('div', 'q', 'Pièges : sûr·e mais faux', c);
        traps.forEach(function (x) { H('div', 'corr ko', '<div class="q">' + x.q.q + '</div><div>Bonne réponse : <b>' + (x.q.o ? x.q.o[x.q.a] : num(x.q.a) + (x.q.unit ? ' ' + x.q.unit : '')) + '</b></div>' + (x.q.e ? '<div class="small">' + x.q.e + '</div>' : '') +
          '<div class="small">Leçon : <a href="../' + x.q.L.id + '/">' + x.q.L.title + '</a></div>', c); });
      }
      if (frag.length) H('p', 'small', plural(frag.length, 'carte') + ' juste' + (frag.length > 1 ? 's' : '') + ' mais fragile' + (frag.length > 1 ? 's' : '') + ' : elle' + (frag.length > 1 ? 's' : '') + ' reviendr' + (frag.length > 1 ? 'ont' : 'a') + ' bientôt.', c);
      var due = cards.filter(function (k) { return S.cards[k.id] && S.cards[k.id][1] <= t + 1; }).length;
      H('p', 'small', due ? 'Demain : ' + plural(due, 'carte') + ' à revoir.' : 'Rien à revoir demain. Reviens quand tu veux.', c);
      themeMap(cards, box);
      var row = H('div', 'row', '', box);
      var again = H('button', 'btn pri', 'Une séance de plus ▶', row); again.onclick = function () { run(pick(cards), cards); };
      var back = H('button', 'btn', 'Terminer', row); back.onclick = setup;
    }
    show();
  }

  if (!DATA.length) box.innerHTML = '<p class="card">Pas encore de questions pour cette matière.</p>'; else setup();
})();
