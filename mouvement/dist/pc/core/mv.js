/* Moteur « Mouvement » : une séance = ouverture, je me prépare, je regarde,
   nous faisons, je fais seul, bilan. Aucune dépendance, aucun script en ligne. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  function S(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function T(parent, x, y, t, cls, anchor) {
    var e = S('text', { x: x, y: y, 'class': cls || 'lbl', 'text-anchor': anchor || 'middle' }, parent);
    e.textContent = t; return e;
  }
  function H(tag, cls, html, parent) {
    var e = document.createElement(tag); if (cls) e.className = cls;
    if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e;
  }
  // valeur du HUD : police réduite quand le texte est long, pour ne pas le couper
  function fit(span, v) { v = String(v); span.textContent = v; span.style.fontSize = v.length > 12 ? '12px' : v.length > 8 ? '14px' : v.length > 6 ? '17px' : ''; }
  function show(el, on) { el.style.opacity = on ? 1 : 0; el.style.pointerEvents = on ? '' : 'none'; }
  // [[...]] dans un texte arabe : passage en sens gauche-droite (formules, lettres)
  function ar(s) { return (s || '').replace(/\[\[(.+?)\]\]/g, '<bdi dir="ltr">$1</bdi>'); }
  function parseNum(v) { return parseFloat(String(v).replace(/\s/g, '').replace(/[\u2212\u2013]/g, '-').replace(',', '.')); }
  function fmt(n, d) { if (Number.isInteger(n)) return String(n); return n.toFixed(d == null ? 2 : d).replace('.', ','); }

  /* ---------- scène : légende mot par mot, éléments nommés, HUD ---------- */
  function scene(card, def, onEnd) {
    card.classList.add('scn');
    var cap = H('div', 'cap', '', card);
    var stage = H('div', 'stage', '', card);
    var svg = S('svg', { viewBox: def.vb || '0 0 360 300', role: 'img', 'aria-label': def.label || 'Animation' }, stage);
    var hud = H('div', 'hud', def.hud.map(function (h) { return '<div data-k="' + h[0] + '"><small>' + h[1] + '</small><span>–</span></div>'; }).join(''), card);
    var arl = H('div', 'ar', '', card); arl.style.minHeight = '28px'; arl.style.marginTop = '8px';
    var nav = H('div', 'nav', '<button class="btn" data-prev aria-label="Étape précédente">◀</button><div class="dots"></div><button class="btn pri" data-next>Suivant ▶</button>', card);
    var dots = nav.querySelector('.dots'), prev = nav.querySelector('[data-prev]'), next = nav.querySelector('[data-next]');
    dots.innerHTML = def.steps.map(function () { return '<i></i>'; }).join('');
    var els = def.draw(svg, MV) || {};
    var named = Object.keys(els).filter(function (n) { return els[n] && els[n].nodeType === 1 && !els[n].hasAttribute('data-keep'); });
    named.forEach(function (n) { els[n].classList.add('fade'); });
    var k = 0, timers = [];
    function caption(s) {
      timers.forEach(clearTimeout); timers = [];
      var parts = s.split(/(\*\*[^*]+\*\*|\s+)/).filter(Boolean);
      cap.innerHTML = parts.map(function (p) {
        if (/^\s+$/.test(p)) return ' ';
        return p.indexOf('**') === 0 ? '<span class="w"><b>' + p.slice(2, -2) + '</b></span>' : '<span class="w">' + p + '</span>';
      }).join('');
      [].forEach.call(cap.children, function (w, i) { timers.push(setTimeout(function () { w.classList.add('in'); }, 80 * i)); });
    }
    function setHud(v) {
      for (var key in v) {
        var d = hud.querySelector('[data-k="' + key + '"]'); if (!d) continue;
        var val = v[key], hot = Array.isArray(val);
        fit(d.querySelector('span'), hot ? val[0] : val); d.classList.toggle('hot', hot);
      }
    }
    function go(i) {
      k = Math.max(0, Math.min(def.steps.length - 1, i));
      var st = def.steps[k], on = st.on || [], hot = st.hot || [];
      caption(st.cap); arl.innerHTML = ar(st.ar);
      setHud(st.hud || {});
      named.forEach(function (n) { show(els[n], on.indexOf(n) >= 0); els[n].classList.toggle('hot', hot.indexOf(n) >= 0); });
      if (st.run) st.run(els, svg);
      [].forEach.call(dots.children, function (d, j) { d.classList.toggle('on', j <= k); });
      prev.disabled = k === 0;
      next.textContent = k === def.steps.length - 1 ? (def.end || 'Continuer ▶') : 'Suivant ▶';
    }
    prev.onclick = function () { go(k - 1); };
    next.onclick = function () { if (k === def.steps.length - 1) onEnd(); else go(k + 1); };
    return { go: go, svg: svg, els: els };
  }

  /* ---------- petits outils d'exercice ---------- */
  function feedback(fb, ok, msg) { fb.className = 'fb ' + (ok ? 'ok' : 'ko'); fb.textContent = msg; }

  // question numérique : {q, a, tol, unit, hint, ok}
  function numQ(parent, o, done) {
    var d = H('div', '', '<div class="q">' + o.q + '</div><div class="row"><input class="num" inputmode="decimal" aria-label="Réponse">' +
      (o.unit ? '<span class="small">' + o.unit + '</span>' : '') + '<button class="btn" data-v>Vérifier</button>' +
      (o.hint ? '<button class="btn" data-h>Indice</button>' : '') + '</div><div class="fb" aria-live="polite"></div>', parent);
    var inp = d.querySelector('input'), fb = d.querySelector('.fb'), bv = d.querySelector('[data-v]'), bh = d.querySelector('[data-h]'), miss = false;
    function check() {
      if (inp.value.trim() === '') { feedback(fb, false, 'Écris d\'abord ta réponse.'); return; }
      var v = parseNum(inp.value);
      if (!isNaN(v) && Math.abs(v - o.a) <= (o.tol || 1e-9)) {
        feedback(fb, true, 'Juste. ' + (o.ok || '')); inp.disabled = bv.disabled = true; if (bh) bh.disabled = true; if (done) done(!miss);
      } else { miss = true; feedback(fb, false, o.ko || 'Pas encore. Vérifie ton calcul' + (o.hint ? ' ou demande l\'indice.' : '.')); }
    }
    bv.onclick = check; inp.onkeydown = function (e) { if (e.key === 'Enter') check(); };
    if (bh) bh.onclick = function () { miss = true; fb.className = 'fb'; fb.textContent = o.hint; };
    return d;
  }
  // choix multiple : {q, o:[...], a, e, ko}
  function optQ(parent, o, done) {
    var d = H('div', '', '<div class="q">' + o.q + '</div><div class="opts"></div><div class="fb" aria-live="polite"></div>', parent);
    var box = d.querySelector('.opts'), fb = d.querySelector('.fb'), miss = false;
    o.o.forEach(function (t, i) {
      var b = H('button', 'btn opt', t, box);
      b.onclick = function () {
        if (i === o.a) { b.classList.add('ok'); [].forEach.call(box.children, function (x) { x.disabled = true; }); feedback(fb, true, 'Juste. ' + (o.e || '')); if (done) done(!miss); }
        else { miss = true; b.classList.add('ko'); b.disabled = true; feedback(fb, false, o.ko || 'Relis la question et essaie encore.'); }
      };
    });
    return d;
  }
  // toucher une zone d'une figure : {q, targets:{nom:element}, good, ok, ko}
  function tapQ(parent, o, done) {
    var d = H('div', '', '<div class="q">' + o.q + '</div><div class="fb" aria-live="polite"></div>', parent), fb = d.querySelector('.fb'), over = false;
    Object.keys(o.targets).forEach(function (n) {
      var el = o.targets[n]; el.style.cursor = 'pointer'; el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button'); el.setAttribute('aria-label', n);
      function pick() {
        if (over) return;
        if (n === o.good) { over = true; feedback(fb, true, 'Juste. ' + (o.ok || '')); if (o.onGood) o.onGood(); if (done) done(); }
        else feedback(fb, false, o.ko || 'Ce n\'est pas cette partie.');
      }
      el.addEventListener('click', pick);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    });
    return d;
  }
  // suite d'étapes guidées : chaque étape s'affiche quand la précédente est juste
  function guide(parent, steps, onDone) {
    var i = 0;
    function nextStep() {
      if (i >= steps.length) { if (onDone) onDone(); return; }
      var st = steps[i++], fn = st.type === 'tap' ? tapQ : st.type === 'opt' ? optQ : numQ;
      fn(parent, st, function () { if (st.after) st.after(); setTimeout(nextStep, 350); });
    }
    nextStep();
  }
  function slider(parent, o, cb) {
    var d = H('div', 'sl', '<label>' + o.label + '</label><input type="range" min="' + o.min + '" max="' + o.max + '" step="' + (o.step || 1) + '" value="' + o.value + '" aria-label="' + o.label + '"><output></output>', parent);
    var inp = d.querySelector('input'), out = d.querySelector('output');
    function upd() { var v = +inp.value; out.textContent = o.fmt ? o.fmt(v) : v; cb(v); }
    inp.addEventListener('input', upd);
    return { input: inp, update: upd, get value() { return +inp.value; } };
  }
  function hudBox(parent, cells) {
    var hud = H('div', 'hud', cells.map(function (h) { return '<div data-k="' + h[0] + '"' + (h[2] ? ' class="hot"' : '') + '><small>' + h[1] + '</small><span>–</span></div>'; }).join(''), parent);
    return function (k, v) { var d = hud.querySelector('[data-k="' + k + '"] span'); if (d) fit(d, v); };
  }

  /* ---------- évaluation et plein écran ---------- */
  // Je me prépare compte pour un tiers, Je fais seul pour deux tiers.
  function noteSur20(p, P, s, N) { return Math.round(20 * ((P ? p / P : 0) + 2 * (N ? s / N : 0)) / ((P ? 1 : 0) + (N ? 2 : 0)) * 2) / 2; }
  function mention(n) { return n >= 16 ? 'Très bien · حسن جدا' : n >= 14 ? 'Bien · حسن' : n >= 12 ? 'Assez bien · مستحسن' : n >= 10 ? 'Passable · مقبول' : 'À revoir · يحتاج إلى مراجعة'; }
  // thème clair ou sombre, mémorisé ; la scène animée reste sombre comme un tableau
  function theme() { var t = store.get('mv_theme'); return t || (window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); }
  function applyTheme(t) { document.documentElement.classList.toggle('light', t === 'light'); var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', t === 'light' ? '#f4f5f7' : '#141517'); }
  applyTheme(theme());
  function themeBtn(parent, before) {
    if (!parent) return;
    var b = H('button', 'fsbtn thbtn', '', null); parent.insertBefore(b, before || null);
    function upd() { var l = theme() === 'light'; b.innerHTML = l ? '☾<span class="t"> Sombre</span>' : '☀<span class="t"> Clair</span>'; b.setAttribute('aria-label', l ? 'Passer en thème sombre' : 'Passer en thème clair'); }
    b.onclick = function () { var t = theme() === 'light' ? 'dark' : 'light'; store.set('mv_theme', t); applyTheme(t); upd(); };
    upd();
  }
  function fullscreenBtn() {
    var de = document.documentElement, req = de.requestFullscreen || de.webkitRequestFullscreen;
    var top = document.querySelector('.top'); if (!top) return;
    themeBtn(top, top.querySelector('.brand'));
    if (!req) return;
    var b = H('button', 'fsbtn', '⛶<span class="t"> Plein écran</span>', null); top.insertBefore(b, top.querySelector('.brand'));
    b.setAttribute('aria-label', 'Plein écran');
    function isFs() { return document.fullscreenElement || document.webkitFullscreenElement; }
    function upd() { b.setAttribute('aria-label', isFs() ? 'Quitter le plein écran' : 'Plein écran'); b.innerHTML = isFs() ? '✕<span class="t"> Quitter</span>' : '⛶<span class="t"> Plein écran</span>'; document.body.classList.toggle('fs', !!isFs()); }
    b.onclick = function () {
      if (isFs()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else { var r = req.call(de); if (r && r.catch) r.catch(function () {}); }
    };
    document.addEventListener('fullscreenchange', upd); document.addEventListener('webkitfullscreenchange', upd);
  }

  /* ---------- la séance ---------- */
  var NAMES = ['Ouverture', 'Je me prépare', 'Je regarde', 'Nous faisons', 'Je fais seul', 'Bilan'];
  function lesson(def) {
    var main = document.getElementById('mv'); if (!main) return;
    var stepper = H('nav', 'stepper', '', main); stepper.setAttribute('aria-label', 'Étapes de la séance');
    var secs = NAMES.map(function (n) { var s = H('section', 'mv-sec', '', main); s.dataset.t = n; return s; });
    var cur = 0, scenes = [], score = { prep: 0, seul: 0, done: 0 };
    fullscreenBtn();
    NAMES.forEach(function (n, i) { var b = H('button', '', (i + 1) + '. ' + n, stepper); b.onclick = function () { go(i); }; });
    function go(i) {
      cur = i;
      secs.forEach(function (s, j) { s.classList.toggle('on', j === i); });
      [].forEach.call(stepper.children, function (b, j) { b.classList.toggle('on', j === i); if (j < i) b.classList.add('done'); });
      var b = stepper.children[i]; if (b.scrollIntoView) b.scrollIntoView({ inline: 'center', block: 'nearest' });
      window.scrollTo(0, 0);
      if (scenes[i]) scenes[i].go(0);
      if (i === 5) { store.set('mv_done_' + def.id, '1'); showScore(); }
    }
    function nextBtn(parent, label, to) { var b = H('button', 'btn pri', label, parent); b.style.marginTop = '12px'; b.onclick = function () { go(to); }; return b; }

    // 1. Ouverture
    H('div', 'card obj', '<div class="eyebrow">Objectif de la séance</div><div>' + def.objectif.fr + '</div><div class="ar">' + ar(def.objectif.ar) + '</div>', secs[0]);
    var c0 = H('div', 'card', '', secs[0]);
    def.ouverture.end = def.ouverture.end || 'Je me prépare ▶';
    scenes[0] = scene(c0, def.ouverture, function () { go(1); });

    // 2. Je me prépare
    var c1 = H('div', 'card', '<div class="eyebrow">Je me prépare · vrai ou faux ?</div>', secs[1]), left = def.prepare.length;
    var go2 = nextBtn(c1, 'Je regarde ▶', 2); go2.style.display = 'none';
    def.prepare.forEach(function (p, i) {
      var d = H('div', '', '<div class="q">' + (i + 1) + '. ' + p[0] + '</div><div class="tf"><button class="btn">Vrai</button><button class="btn">Faux</button></div><div class="fb" aria-live="polite"></div>');
      c1.insertBefore(d, go2);
      var bs = d.querySelectorAll('button'), fb = d.querySelector('.fb');
      function ans(x) {
        var ok = x === p[1]; if (ok) score.prep++; feedback(fb, ok, (ok ? 'Juste. ' : 'Pas tout à fait. ') + p[2]);
        bs[0].disabled = bs[1].disabled = true; bs[x ? 0 : 1].classList.add(ok ? 'ok' : 'ko');
        if (--left === 0) go2.style.display = '';
      }
      bs[0].onclick = function () { ans(true); }; bs[1].onclick = function () { ans(false); };
    });

    // 3. Je regarde
    var c2 = H('div', 'card', '', secs[2]);
    def.regarde.end = def.regarde.end || 'Nous faisons ▶';
    scenes[2] = scene(c2, def.regarde, function () { go(3); });

    // 4. Nous faisons
    def.faisons.forEach(function (f, i) {
      var c = H('div', 'card', '<div class="eyebrow">Nous faisons · ' + (i + 1) + '. ' + f.title + '</div>', secs[3]);
      if (f.intro) H('p', 'small', f.intro, c);
      f.build(c, MV, function () { if (i === def.faisons.length - 1) nextBtn(c, 'Je fais seul ▶', 4); });
    });

    // 5. Je fais seul
    var c4 = H('div', 'card', '<div class="eyebrow">Je fais seul</div>', secs[4]), rest = def.seul.length;
    var fin = H('div', 'row', '', c4);
    def.seul.forEach(function (x) {
      var w = H('div', '', '<div class="eyebrow" style="margin-top:16px">' + x.lvl + '</div>');
      c4.insertBefore(w, fin);
      (x.o ? optQ : numQ)(w, x, function (first) { score.done++; if (first) score.seul++; if (--rest === 0) { bb.classList.add('pri'); bb.textContent = 'Bilan ▶'; } });
    });
    var bb = H('button', 'btn', 'Passer au bilan', fin); bb.style.marginTop = '12px'; bb.onclick = function () { go(5); };

    // 6. Bilan
    var c5 = H('div', 'card', '', secs[5]), ev = H('div', 'card eval', '', secs[5]);
    function showScore() {
      var P = def.prepare.length, N = def.seul.length, note = noteSur20(score.prep, P, score.seul, N);
      var key = 'mv_score_' + def.id, best = +(store.get(key) || -1);
      if (score.done === N && note > best) { store.set(key, String(note)); best = note; }
      ev.innerHTML = '<div class="eyebrow">Mon évaluation</div>' +
        (score.done < N ? '<p class="small">Termine les ' + N + ' exercices de « Je fais seul » pour obtenir ta note. Exercices réussis : ' + score.done + ' sur ' + N + '.</p>' :
        '<div class="note20"><b>' + fmt(note, 1) + '</b><span>/ 20</span></div><div class="mention">' + mention(note) + '</div>') +
        '<table class="voc"><tr><td>Je me prépare : bonnes réponses</td><td class="mono">' + score.prep + ' / ' + P + '</td></tr>' +
        '<tr><td>Je fais seul : réussis du premier coup</td><td class="mono">' + score.seul + ' / ' + N + '</td></tr>' +
        (best >= 0 ? '<tr><td>Ma meilleure note</td><td class="mono">' + fmt(best, 1) + ' / 20</td></tr>' : '') + '</table>' +
        '<p class="small">Une réponse juste après une erreur ou après l\'indice ne compte pas dans la note.</p>';
    }
    def.bilan.end = def.bilan.end || 'Recommencer ▶';
    scenes[5] = scene(c5, def.bilan, function () { go(0); });
    H('div', 'card', '<div class="eyebrow">À retenir</div>' + def.retenir.map(function (r) { return '<div class="retenir">' + r + '</div>'; }).join('') +
      '<div class="ar">' + ar(def.retenirAr) + '</div><table class="voc" style="margin-top:10px">' +
      def.voc.map(function (v) { return '<tr><td>' + v[0] + '</td><td>' + v[1] + '</td></tr>'; }).join('') + '</table>', secs[5]);

    go(0);
    MV.go = go;
  }

  // accueil : coche les leçons terminées
  function home() {
    [].forEach.call(document.querySelectorAll('[data-lesson]'), function (a) {
      var id = a.getAttribute('data-lesson'), sc = store.get('mv_score_' + id);
      if (store.get('mv_done_' + id)) { var n = a.querySelector('.n'); if (n) n.textContent = '✓'; }
      if (sc) { var t = H('span', 'badge', fmt(+sc, 1) + '/20', null); a.appendChild(t); }
    });
  }

  var MV = window.MV = { S: S, T: T, H: H, show: show, ar: ar, fmt: fmt, parseNum: parseNum, noteSur20: noteSur20, mention: mention, fullscreenBtn: fullscreenBtn, numQ: numQ, optQ: optQ, tapQ: tapQ, guide: guide, slider: slider, hud: hudBox, lesson: lesson, store: store };
  if (document.body && document.body.hasAttribute('data-home')) { home(); var hero = document.querySelector('.hero'); if (hero) themeBtn(hero, hero.firstChild); }
})();
