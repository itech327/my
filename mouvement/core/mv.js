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

  /* ---------- alertes vers l'enseignant : Telegram par le relais du site principal ---------- */
  // Visite : anonyme, une fois par session. Notes : seulement si l'élève a donné son nom et son accord.
  var SITE = { maths: 'Maths en mouvement', pc: 'PC en mouvement', svt: 'SVT en mouvement', tech: 'Technologie en mouvement' }[document.documentElement.getAttribute('data-s')] || 'Cours en mouvement';
  function sid() {
    var v; try { v = sessionStorage.getItem('mv_sid'); if (!v) { v = 'mv' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); sessionStorage.setItem('mv_sid', v); } } catch (_) { v = ''; }
    return v;
  }
  function eleve() { try { return JSON.parse(store.get('mv_eleve') || 'null'); } catch (_) { return null; } }
  function send(p) {
    var u = window.LAB_NOTIFY_URL; if (!u) return;
    p.v = 1; p.page = SITE; p.t = Date.now();
    try { fetch(u, { method: 'POST', body: JSON.stringify(p), keepalive: true, headers: { 'Content-Type': 'text/plain;charset=UTF-8' } }).catch(function () {}); } catch (_) {}
  }
  function notifyOpen() {
    try { if (sessionStorage.getItem('mv_open')) return; sessionStorage.setItem('mv_open', '1'); } catch (_) { return; }
    var e = eleve(); send(e && e.consent ? { type: 'open', name: e.name, sid: sid() } : { type: 'open' });
  }
  function notifyResult(o) {
    var e = eleve(); if (!e || !e.consent || !e.name) return false;
    send(Object.assign({ type: 'series', sid: sid(), name: e.name, cls: e.cls || '' }, o)); return true;
  }
  (function () { // code de classe dans le lien : ?c=CODE
    var m = location.search.match(/[?&]c=([A-Za-z0-9]{3,12})/), e = eleve();
    if (m && e) { e.cls = m[1].toUpperCase(); store.set('mv_eleve', JSON.stringify(e)); } else if (m) store.set('mv_cls', m[1].toUpperCase());
  })();
  // carte « Envoyer mes résultats à mon enseignant » ; onSave est appelé après l'enregistrement
  function eleveCard(parent, onSave) {
    var c = H('div', 'card eleve', '', parent);
    function vue() {
      var e = eleve();
      if (e && e.consent) {
        c.innerHTML = '<div class="eyebrow">Mon enseignant</div><p class="small">Mes notes sont envoyées à mon enseignant au nom de <b></b>' + (e.cls ? ', classe <b class="mono"></b>' : '') + '.</p>' +
          '<div class="ar">تُرسل نقطي إلى أستاذي.</div>';
        var b = c.querySelectorAll('b'); b[0].textContent = e.name; if (b[1]) b[1].textContent = e.cls;
        var row = H('div', 'row', '', c);
        H('button', 'btn', 'Modifier', row).onclick = form;
        H('button', 'btn', 'Ne plus envoyer', row).onclick = function () { store.set('mv_eleve', JSON.stringify({ name: e.name, cls: e.cls, consent: false })); vue(); };
      } else form();
    }
    function form() {
      var e = eleve() || {};
      c.innerHTML = '<div class="eyebrow">Envoyer mes notes à mon enseignant</div>' +
        '<div class="ar">إرسال نقطي إلى أستاذي (اختياري)</div>' +
        '<div class="row"><input class="num txt" maxlength="40" aria-label="Prénom et nom" placeholder="Prénom et nom"><input class="num txt cls" maxlength="12" aria-label="Code de classe" placeholder="Classe (facultatif)"></div>' +
        '<label class="small chk"><input type="checkbox"> J’accepte d’envoyer mon nom et mes notes à mon enseignant.</label>' +
        '<div class="fb"></div>';
      var ins = c.querySelectorAll('input'), fb = c.querySelector('.fb');
      ins[0].value = e.name || ''; ins[1].value = e.cls || store.get('mv_cls') || '';
      var row = H('div', 'row', '', c);
      H('button', 'btn pri', 'Enregistrer', row).onclick = function () {
        var n = ins[0].value.trim().replace(/\s+/g, ' '), k = ins[1].value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
        if (n.length < 2) { fb.className = 'fb ko'; fb.textContent = 'Écris ton prénom et ton nom.'; return; }
        if (!ins[2].checked) { fb.className = 'fb ko'; fb.textContent = 'Coche la case pour accepter l’envoi.'; return; }
        store.set('mv_eleve', JSON.stringify({ name: n, cls: k, consent: true }));
        send({ type: 'open', name: n, sid: sid() });
        vue(); if (onSave) onSave();
      };
    }
    vue();
    return c;
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

  /* ---------- prédiction avant l'explication ---------- */
  // def.predire = { q, ar?, o:[choix], a:index juste, e:explication, ear? } : le choix est enregistré, la réponse vient après la scène.
  var PRED_KEY = 'mv_pred1';
  function predStats() { try { var o = JSON.parse(store.get(PRED_KEY) || 'null'); if (o && o.by) return o; } catch (_) {} return { by: {} }; }
  function predLine() { var b = predStats().by, k = Object.keys(b); if (!k.length) return ''; var ok = k.filter(function (x) { return b[x]; }).length; return ok + ' / ' + k.length; }
  function predictCard(parent, pr, onPick, onNext) {
    var c = H('div', 'card pred', '<div class="eyebrow">Je prédis avant de savoir</div><div class="q">' + pr.q + '</div>' + (pr.ar ? '<div class="ar">' + ar(pr.ar) + '</div>' : '') +
      '<div class="opts"></div><p class="small">Pas de note ici : ton intuition compte. La réponse viendra dans « Je regarde ».</p><div class="fb" aria-live="polite"></div>', parent);
    var box = c.querySelector('.opts'), fb = c.querySelector('.fb'), done = false;
    pr.o.forEach(function (t, i) {
      var b = H('button', 'btn opt', t, box);
      b.onclick = function () {
        if (done) return; done = true;
        [].forEach.call(box.children, function (x) { x.disabled = true; }); b.classList.add('sel');
        fb.className = 'fb'; fb.textContent = 'Prédiction enregistrée : ' + t + '.';
        onPick(i);
        var nb = H('button', 'btn pri', 'Je me prépare ▶', c); nb.style.marginTop = '12px'; nb.onclick = onNext;
      };
    });
    return c;
  }

  /* ---------- la séance ---------- */
  var NAMES = ['Ouverture', 'Je me prépare', 'Je regarde', 'Nous faisons', 'Je fais seul', 'Bilan'];
  function lesson(def) {
    var main = document.getElementById('mv'); if (!main) return;
    var stepper = H('nav', 'stepper', '', main); stepper.setAttribute('aria-label', 'Étapes de la séance');
    var secs = NAMES.map(function (n) { var s = H('section', 'mv-sec', '', main); s.dataset.t = n; return s; });
    var cur = 0, scenes = [], score = { prep: 0, seul: 0, done: 0 };
    store.set('mv_last', def.id);
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
    var cp = null;
    if (def.predire) {
      def.ouverture.end = def.ouverture.end || 'Je fais ma prédiction ▶';
      cp = predictCard(secs[0], def.predire, function (i) {
        score.pred = i === def.predire.a ? 1 : 0; score.predPick = i;
        var all = predStats(); all.by[def.id] = score.pred; store.set(PRED_KEY, JSON.stringify(all));
      }, function () { go(1); });
      cp.style.display = 'none';
      scenes[0] = scene(c0, def.ouverture, function () { cp.style.display = ''; if (cp.scrollIntoView) cp.scrollIntoView({ block: 'center', behavior: 'smooth' }); });
    } else {
      def.ouverture.end = def.ouverture.end || 'Je me prépare ▶';
      scenes[0] = scene(c0, def.ouverture, function () { go(1); });
    }

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
    var c2 = H('div', 'card', '', secs[2]), verdict = null;
    def.regarde.end = def.regarde.end || 'Nous faisons ▶';
    if (def.predire) {
      verdict = H('div', 'card verdict', '', secs[2]); verdict.style.display = 'none';
      var lastSt = def.regarde.steps[def.regarde.steps.length - 1], prevRun = lastSt.run;
      lastSt.run = function (e, svg) { if (prevRun) prevRun(e, svg); showVerdict(); };
    }
    scenes[2] = scene(c2, def.regarde, function () { go(3); });
    function showVerdict() {
      var pr = def.predire;
      if (score.pred == null) { verdict.style.display = 'none'; return; }
      verdict.style.display = '';
      verdict.innerHTML = '<div class="eyebrow">Ma prédiction · الجواب</div>' +
        '<p>Tu avais prédit : <b>' + pr.o[score.predPick] + '</b>.</p>' +
        '<p>Réponse : <b>' + pr.o[pr.a] + '</b>. ' + (score.pred ? 'Prédiction juste.' : 'Pas cette fois, et c\'est utile : se tromper avant d\'apprendre aide à mieux retenir.') + '</p>' +
        '<p class="small">' + pr.e + '</p>' + (pr.ear ? '<div class="ar">' + ar(pr.ear) + '</div>' : '');
    }

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
    var c5 = H('div', 'card', '', secs[5]), ev = H('div', 'card eval', '', secs[5]), sent = false;
    eleveCard(secs[5], function () { if (score.done === def.seul.length) showScore(); });
    function showScore() {
      var P = def.prepare.length, N = def.seul.length, note = noteSur20(score.prep, P, score.seul, N);
      var key = 'mv_score_' + def.id, best = +(store.get(key) || -1);
      if (score.done === N && note > best) { store.set(key, String(note)); best = note; }
      if (score.done === N && !sent) {
        var h1 = document.querySelector('h1');
        sent = notifyResult({ title: 'Leçon : ' + (h1 ? h1.textContent : def.id), d: 0, good: score.prep + score.seul, asked: P + N, pct: Math.round(100 * (score.prep + score.seul) / (P + N)), pts: note, max: 20 });
      }
      if (score.done === N) badgeCheck(false);
      ev.innerHTML = '<div class="eyebrow">Mon évaluation</div>' +
        (score.done < N ? '<p class="small">Termine les ' + N + ' exercices de « Je fais seul » pour obtenir ta note. Exercices réussis : ' + score.done + ' sur ' + N + '.</p>' :
        '<div class="note20"><b>' + fmt(note, 1) + '</b><span>/ 20</span></div><div class="mention">' + mention(note) + '</div>') +
        '<table class="voc"><tr><td>Je me prépare : bonnes réponses</td><td class="mono">' + score.prep + ' / ' + P + '</td></tr>' +
        '<tr><td>Je fais seul : réussis du premier coup</td><td class="mono">' + score.seul + ' / ' + N + '</td></tr>' +
        (def.predire && score.pred != null ? '<tr><td>Ma prédiction dans cette leçon</td><td class="mono">' + (score.pred ? 'juste' : 'à retenir') + '</td></tr>' : '') +
        (predLine() ? '<tr><td>Mes prédictions justes (toutes les leçons)</td><td class="mono">' + predLine() + '</td></tr>' : '') +
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

  // accueil : une carte « Où j'en suis » (niveau, progression, prochaine étape, révision du jour)
  function gateway() {
    var hero = document.querySelector('.hero'); if (!hero) return;
    var links = [].slice.call(document.querySelectorAll('a[data-lesson]'));
    if (!links.length) return;
    function lvOf(a) { var n = a; while (n && !(n.tagName === 'H2' && n.id)) n = n.previousElementSibling; return n ? n.id : ''; }
    var done = function (a) { return !!store.get('mv_done_' + a.getAttribute('data-lesson')); };
    var last = store.get('mv_last'), cur = null;
    links.forEach(function (a) { if (a.getAttribute('data-lesson') === last) cur = a; });
    var lv = cur ? lvOf(cur) : lvOf(links[0]);
    var mine = links.filter(function (a) { return lvOf(a) === lv; });
    var nDone = mine.filter(done).length, nxt = null, verb = 'Commencer';
    if (cur && !done(cur)) { nxt = cur; verb = 'Continuer'; }
    else {
      var from = cur ? mine.indexOf(cur) + 1 : 0;
      nxt = mine.slice(from).concat(mine.slice(0, from)).filter(function (a) { return !done(a); })[0] || null;
      if (nxt && nDone) verb = 'Suite';
    }
    var rev = null; try { rev = JSON.parse(store.get('mv_rev1') || 'null'); } catch (_) {}
    var today = (function () { var d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 6e4) / 864e5); })();
    var nDue = rev && rev.cards ? Object.keys(rev.cards).filter(function (k) { return rev.cards[k][1] <= today; }).length : 0;
    var c = H('div', 'card gate', '', null); hero.parentNode.insertBefore(c, hero.nextSibling);
    var h = lv ? lv.replace(/^n/, '') + 'AC' : '';
    H('div', 'eyebrow', 'Où j\'en suis' + (h ? ' · ' + h : '') + ' · أين وصلت', c);
    H('div', 'gate-n', nDone ? '<b>' + nDone + '</b> sur ' + mine.length + ' leçons terminées' : 'Premier pas : une leçon de 10 minutes', c);
    var bar = H('div', 'bar', '<i></i>', c); bar.firstChild.style.width = Math.round(100 * nDone / mine.length) + '%';
    if (nxt) {
      var a = H('a', 'btn pri big', '', c); a.href = nxt.getAttribute('href');
      a.textContent = verb + ' : ' + nxt.querySelector('b').textContent + ' ▶';
    } else H('p', 'small', 'Toutes les leçons de ce niveau sont terminées. Passe un examen ou lance la révision du jour.', c);
    var r = H('a', 'btn', '', c); r.href = 'revision/';
    r.textContent = nDue ? 'Révision du jour · ' + nDue + (nDue > 1 ? ' cartes à revoir' : ' carte à revoir') : 'Révision du jour · 5 minutes';
    badgeCheck(true);
    var nb = Object.keys(badgeEarned()).length;
    var pl = H('a', 'small', '', c); pl.href = 'parcours/'; pl.style.display = 'block'; pl.style.marginTop = '10px';
    pl.textContent = 'Mon parcours : ' + nb + ' étape' + (nb > 1 ? 's' : '') + ' sur ' + BADGES.length + ' ▶';
  }

  // accueil : un seul niveau visible, les 3 prochaines leçons, le reste derrière un bouton
  function declutter() {
    var nav = document.querySelector('nav.lvl'), hs = [].slice.call(document.querySelectorAll('main > h2[id]'));
    if (!nav || !hs.length) return;
    var groups = hs.map(function (h) {
      var items = [], n = h.nextElementSibling;
      while (n && !(n.tagName === 'H2' && n.id)) { if (n.classList.contains('lesson') && n.hasAttribute('data-lesson')) items.push(n); n = n.nextElementSibling; }
      return { id: h.id, h: h, items: items };
    });
    // l'évaluation en ligne compacte ; la révision du jour vit déjà dans la carte « Où j'en suis »
    [].forEach.call(document.querySelectorAll('a.lesson.exam'), function (a) {
      if (a.getAttribute('href') === 'revision/' && document.querySelector('.gate')) a.style.display = 'none'; else a.classList.add('compact');
    });
    var gate = document.querySelector('.gate'), cur = store.get('mv_lvl');
    var last = store.get('mv_last'), lastA = last && document.querySelector('a[data-lesson="' + last + '"]');
    function gid(a) { for (var i = 0; i < groups.length; i++) if (groups[i].items.indexOf(a) >= 0) return groups[i].id; return ''; }
    var start = lastA ? gid(lastA) : '';
    if (!start) start = (groups.filter(function (g) { return g.items.length; })[0] || groups[0]).id;
    var active = start, expanded = false;
    var tabs = [].slice.call(nav.querySelectorAll('a'));
    // même règle que la carte du haut : leçon en cours, sinon la suivante non terminée, sinon la première
    function isDone(a) { return !!store.get('mv_done_' + a.getAttribute('data-lesson')); }
    function startIdx(g) {
      var n = g.items.length, ci = lastA ? g.items.indexOf(lastA) : -1;
      if (ci >= 0 && !isDone(lastA)) return ci;
      for (var k = 0; k < n; k++) { var i = (Math.max(ci + 1, 0) + k) % n; if (!isDone(g.items[i])) return i; }
      return 0;
    }
    function render() {
      groups.forEach(function (g) {
        var on = g.id === active; g.h.style.display = on ? '' : 'none';
        var firstTodo = startIdx(g);
        var from = Math.max(0, Math.min(firstTodo, g.items.length - 3));
        g.items.forEach(function (a, i) { a.style.display = on && (expanded || (i >= from && i < from + 3)) ? '' : 'none'; });
        var more = g.h.nextElementSibling; while (more && !more.classList.contains('more') && !(more.tagName === 'H2' && more.id)) more = more.nextElementSibling;
        if (more && more.classList.contains('more')) more.style.display = on && g.items.length > 3 ? '' : 'none';
      });
      tabs.forEach(function (t) { var on = t.getAttribute('href') === '#' + active; t.classList.toggle('on', on); t.setAttribute('aria-current', on ? 'true' : 'false'); });
      groups.forEach(function (g) { if (g.btn) g.btn.textContent = expanded ? 'Voir moins' : 'Toutes les leçons du niveau (' + g.items.length + ')'; });
    }
    groups.forEach(function (g) {
      var m = H('div', 'more', '<button class="btn" type="button"></button>', null);
      var last = g.items.length ? g.items[g.items.length - 1] : g.h;
      last.parentNode.insertBefore(m, last.nextSibling);
      g.btn = m.firstChild; g.btn.onclick = function () { expanded = !expanded; render(); };
    });
    tabs.forEach(function (t) { t.addEventListener('click', function (e) { e.preventDefault(); active = t.getAttribute('href').slice(1); expanded = false; store.set('mv_lvl', active); render(); }); });
    if (cur && groups.some(function (g) { return g.id === cur; }) && !lastA) active = cur;
    render();
  }

  // accueil : coche les leçons terminées
  function home() {
    gateway();
    [].forEach.call(document.querySelectorAll('[data-lesson]'), function (a) {
      var id = a.getAttribute('data-lesson'), sc = store.get('mv_score_' + id);
      if (store.get('mv_done_' + id)) { var n = a.querySelector('.n'); if (n) n.textContent = '✓'; }
      if (sc) { var t = H('span', 'badge', fmt(+sc, 1) + '/20', null); a.appendChild(t); }
    });
    declutter();
  }


  /* ---------- étapes (badges) : individuelles, jamais comparées entre élèves ---------- */
  var BADGES = [
    { id: 'pas1', fam: 'Compréhension', n: 'Premier pas', ar: 'الخطوة الأولى', d: 'Terminer une leçon', k: 'lessons', t: 1 },
    { id: 'lec5', fam: 'Compréhension', n: 'Cinq leçons', ar: 'خمسة دروس', d: 'Terminer cinq leçons', k: 'lessons', t: 5 },
    { id: 'lec15', fam: 'Compréhension', n: 'Quinze leçons', ar: 'خمسة عشر درساً', d: 'Terminer quinze leçons', k: 'lessons', t: 15 },
    { id: 'exc3', fam: 'Excellence', n: 'Maîtrise nette', ar: 'إتقان واضح', d: 'Obtenir 16/20 ou plus à trois leçons', k: 'excel', t: 3 },
    { id: 'reg3', fam: 'Régularité', n: 'Trois jours de suite', ar: 'ثلاثة أيام متتالية', d: 'Faire la révision du jour trois jours de suite', k: 'streak', t: 3 },
    { id: 'reg7', fam: 'Régularité', n: 'Une semaine de suite', ar: 'أسبوع متتال', d: 'Faire la révision du jour sept jours de suite', k: 'streak', t: 7 },
    { id: 'mem10', fam: 'Mémoire', n: 'Mémoire solide', ar: 'ذاكرة راسخة', d: 'Maîtriser dix cartes de révision', k: 'master', t: 10 },
    { id: 'mem30', fam: 'Mémoire', n: 'Mémoire d\'acier', ar: 'ذاكرة فولاذية', d: 'Maîtriser trente cartes de révision', k: 'master', t: 30 },
    { id: 'int5', fam: 'Intuition', n: 'Esprit curieux', ar: 'عقل فضولي', d: 'Faire cinq prédictions avant d\'apprendre', k: 'preds', t: 5 }
  ];
  function dayNo() { var d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 6e4) / 864e5); }
  function badgeStats() {
    var o = { lessons: 0, excel: 0, master: 0, streak: 0, preds: 0 };
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k.indexOf('mv_done_') === 0) o.lessons++;
        else if (k.indexOf('mv_score_') === 0 && +localStorage.getItem(k) >= 16) o.excel++;
      }
    } catch (e) {}
    var rev = null; try { rev = JSON.parse(store.get('mv_rev1') || 'null'); } catch (e) {}
    if (rev && rev.cards) o.master = Object.keys(rev.cards).filter(function (c) { return rev.cards[c][0] >= 3; }).length;
    if (rev && rev.streak && rev.streak.last >= dayNo() - 1) o.streak = rev.streak.n || 0;
    o.preds = Object.keys(predStats().by).length;
    return o;
  }
  function badgeEarned() { try { return JSON.parse(store.get('mv_badges') || '{}') || {}; } catch (e) { return {}; } }
  // enregistre les étapes atteintes ; avec quiet = false, annonce les nouvelles
  function badgeCheck(quiet) {
    var st = badgeStats(), got = badgeEarned(), fresh = [];
    BADGES.forEach(function (b) { if (!got[b.id] && st[b.k] >= b.t) { got[b.id] = dayNo(); fresh.push(b); } });
    if (fresh.length) store.set('mv_badges', JSON.stringify(got));
    if (fresh.length && !quiet) badgeToast(fresh);
    return fresh;
  }
  function badgeToast(list) {
    var PARC = document.body && document.body.hasAttribute('data-home') ? 'parcours/' : '../parcours/';
    var old = document.querySelector('.toast'); if (old) old.remove();
    var t = H('div', 'toast', '', document.body); t.setAttribute('role', 'status');
    t.innerHTML = '<div class="eyebrow">Étape franchie · <span class="ar">مرحلة جديدة</span></div>' +
      list.map(function (b) { return '<div><b>' + b.n + '</b> <span class="small">' + b.d + '</span></div>'; }).join('') +
      '<a class="btn" href="' + PARC + '">Voir mon parcours</a><button class="btn" type="button" aria-label="Fermer">Fermer</button>';
    t.querySelector('button').onclick = function () { t.remove(); };
    setTimeout(function () { if (t.parentNode) t.remove(); }, 12000);
  }

  var MV = window.MV = { notifyResult: notifyResult, eleveCard: eleveCard, S: S, T: T, H: H, show: show, ar: ar, fmt: fmt, parseNum: parseNum, noteSur20: noteSur20, mention: mention, fullscreenBtn: fullscreenBtn, numQ: numQ, optQ: optQ, tapQ: tapQ, guide: guide, slider: slider, hud: hudBox, lesson: lesson, store: store, badges: { defs: BADGES, stats: badgeStats, earned: badgeEarned, check: badgeCheck } };
  notifyOpen();
  if (document.body && document.body.hasAttribute('data-home')) { home(); var hero = document.querySelector('.hero'); if (hero) themeBtn(hero, hero.firstChild); }
})();
