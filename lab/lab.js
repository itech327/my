/* Lab : exercices par niveaux + session visiteur + rapport.
   Partagé par « Maths en mouvement » et « Physique-Chimie en mouvement ».
   Configuration : window.LAB_CONFIG = {app, appName, map, gen(key,d)} */
(function () {
  'use strict';
  var CFG = window.LAB_CONFIG;
  if (!CFG) return;
  var Lab = (window.Lab = {});

  /* ---------- utilitaires ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function h(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"'`]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' }[c]; }); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (_) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (_) { return false; } },
    del: function (k) { try { localStorage.removeItem(k); } catch (_) {} }
  };
  function plain(html) {
    var s = String(html == null ? '' : html)
      .replace(/<span class="fr"><span>([^<]*)<\/span><span>([^<]*)<\/span><\/span>/g, '$1/$2')
      .replace(/<sup>([^<]*)<\/sup>/g, '^$1')
      .replace(/<sub>([^<]*)<\/sub>/g, '_$1');
    var d = document.createElement('div'); d.innerHTML = s;
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
  }
  function parseNum(t) {
    t = String(t).trim().replace(/[−–—]/g, '-').replace(/[()\s]/g, '').replace(/,/g, '.');
    if (!t) return NaN;
    var mm = t.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
    if (mm) return (+mm[2]) === 0 ? NaN : (+mm[1]) / (+mm[2]);
    return /^-?\d+(\.\d+)?$/.test(t) ? +t : NaN;
  }
  function fmtDur(ms) {
    var s = Math.round(ms / 1000), m = Math.floor(s / 60);
    return m ? m + ' د ' + (s % 60) + ' ث' : s + ' ث';
  }
  function fmtDate(t) {
    try { return new Date(t).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }); } catch (_) { return String(t); }
  }

  var LV = {
    1: { fr: 'Facile', ar: 'سهل', pts: 1, mark: '★' },
    2: { fr: 'Moyen', ar: 'متوسط', pts: 2, mark: '★★' },
    3: { fr: 'Difficile', ar: 'صعب', pts: 3, mark: '★★★' },
    4: { fr: 'Défi', ar: 'تحدّي', pts: 5, mark: '⚡' }
  };
  Lab.LV = LV;

  /* ---------- styles ---------- */
  var css = [
    'body{padding-bottom:72px}',
    '.lab-box{margin:14px 0}',
    '.lab-note{color:var(--muted);font-size:15px;margin:8px 0}',
    '.lab-ar{font-family:var(--f-ar,Cairo,sans-serif);direction:rtl;text-align:right;color:var(--teal);line-height:1.9;font-size:16px;margin:8px 0}',
    '.lab-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}',
    '.lab-tab{font:inherit;font-weight:600;font-size:14px;color:var(--muted);background:var(--surface);border:1.5px solid var(--line);border-radius:12px;padding:8px 12px;min-height:44px;cursor:pointer;text-align:center;line-height:1.25}',
    '.lab-tab small{display:block;font-weight:400;font-family:var(--f-ar,Cairo,sans-serif);color:var(--lav)}',
    '.lab-tab[aria-selected="true"]{color:#150f1c;border-color:transparent;background:var(--grad)}',
    '.lab-tab[aria-selected="true"] small{color:#150f1c}',
    '.lab-tab .ok{color:#ffcf5c}',
    '.lab-bar{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:center;margin:10px 0;font-weight:600}',
    '.lab-prog{height:8px;border-radius:99px;background:var(--surface-2);overflow:hidden;margin:6px 0 12px}',
    '.lab-prog i{display:block;height:100%;background:var(--grad);width:0;transition:width .3s}',
    '.lab-timer{font-variant-numeric:tabular-nums;color:var(--coral)}',
    '.lab-q{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin:10px 0}',
    '.lab-q.is-ok{border-color:var(--teal)}.lab-q.is-ko{border-color:var(--coral)}',
    '.lab-q{animation:labin .28s ease both}',
    '@keyframes labin{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
    '@media (prefers-reduced-motion:reduce){.lab-q{animation:none}}',
    '.lab-keys{display:flex;gap:6px}',
    '.lab-keys button{font:inherit;font-weight:700;font-size:20px;color:var(--fg);background:var(--surface-2);border:1.5px solid var(--line);border-radius:10px;min-width:44px;min-height:44px;cursor:pointer}',
    '.lab-keys button:active{transform:translateY(1px)}',
    '.lab-auto{display:inline-flex;gap:6px;align-items:center;font-size:13px;font-weight:400;color:var(--muted);cursor:pointer}',
    '.lab-auto input{width:18px;height:18px;accent-color:var(--pink)}',
    '.lesson p.eyebrow{max-width:none}',
    '.stage svg{max-height:max(260px,calc(var(--lab-vh,100vh) - 380px))}',
    '.lab-tools{position:fixed;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:59;display:none;gap:6px;align-items:center;background:var(--surface-2);border:1.5px solid var(--line);border-radius:999px;padding:4px 8px;opacity:.85;font-size:13px;color:var(--fg)}',
    '.lab-tools:hover,.lab-tools:focus-within{opacity:1}',
    '.lab-tools button{font:inherit;font-weight:700;color:var(--fg);background:transparent;border:1.5px solid var(--line);border-radius:999px;min-width:40px;min-height:36px;padding:2px 10px;cursor:pointer}',
    '.lab-tools button:hover,.lab-tools button:focus-visible{border-color:var(--teal);outline:3px solid var(--teal);outline-offset:1px}',
    '@media (min-width:700px){.lab-tools{display:flex}}',
    '.rp-top{position:sticky;top:0;z-index:3;display:flex;justify-content:flex-end;padding:8px 0;margin:0 0 4px;background:var(--bg)}',
    '.lab-q .q{margin:0 0 10px;font-weight:600;font-size:17px}',
    '.lab-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}',
    '.lab-row input{font:inherit;color:var(--fg);background:var(--surface-2);border:1.5px solid var(--line);border-radius:10px;padding:9px 12px;min-height:44px;width:100%;flex:1 1 120px;max-width:220px}',
    '.lab-opts{display:grid;gap:8px}',
    '.lab-opt{font:inherit;text-align:left;color:var(--fg);background:var(--surface-2);border:1.5px solid var(--line);border-radius:10px;padding:10px 14px;min-height:44px;cursor:pointer}',
    '.lab-opt.ok{border-color:var(--teal)}.lab-opt.ko{border-color:var(--coral)}',
    '.lab-opt[disabled]{cursor:default}',
    '.lab-hint{margin:8px 0 0;padding:8px 12px;border-radius:10px;background:var(--surface-2);color:var(--lav);font-size:15px}',
    '.lab-fb{margin:10px 0 0;font-size:15px;color:var(--muted)}',
    '.lab-sum{padding:16px 18px;border-radius:14px;border:1.5px solid transparent;background:linear-gradient(var(--surface),var(--surface)) padding-box,var(--grad) border-box;margin:12px 0}',
    '.lab-sum h4{font-family:var(--f-display,serif);font-style:italic;font-size:26px;margin:0 0 6px}',
    '.lab-sum p{margin:0 0 6px}',
    '.lab-streak{color:var(--teal);font-weight:600}',
    '.lab-newbadge{display:inline-block;margin:4px 6px 0 0;padding:4px 12px;border-radius:999px;border:1.5px solid var(--pink);font-weight:600}',
    '.rp-badges{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}',
    '.rp-badge{padding:6px 14px;border-radius:999px;border:1.5px solid var(--teal);font-weight:600}',
    '.rp-badge.off{border-color:var(--line);color:var(--muted);font-weight:400}',
    '.lab-bar2{position:fixed;left:12px;bottom:12px;z-index:60;max-width:calc(100vw - 24px);display:flex;flex-wrap:wrap;gap:6px;align-items:center;background:var(--surface-2);border:1.5px solid var(--teal);border-radius:16px;padding:6px 10px;font-size:14px;box-shadow:0 8px 24px rgba(0,0,0,.45)}',
    '.lab-bar2 b{max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;vertical-align:bottom}',
    '.lab-bar2 button{font:inherit;font-size:13px;font-weight:600;color:var(--fg);background:none;border:1.5px solid var(--line);border-radius:999px;padding:4px 10px;min-height:34px;cursor:pointer}',
    '.lab-bar2 button:hover{border-color:var(--teal)}',
    '.lab-bar2{bottom:calc(12px + env(safe-area-inset-bottom,0px));opacity:.96}',
    '.lab-bar2.min{padding:4px 8px;gap:4px;border-radius:999px}',
    '.lab-bar2.min b,.lab-bar2.min button:not([data-a=tog]){display:none}',
    '.lab-bar2 [data-a=tog]{min-width:34px;padding:4px 8px}',
    'body.lab-has-bar{padding-bottom:96px}',
    '.lab-dot{width:9px;height:9px;border-radius:50%;background:var(--teal);display:inline-block}',
    '.lab-dot.off{background:var(--muted)}',
    '.lab-modal{position:fixed;inset:0;z-index:100;background:rgba(5,4,10,.82);display:grid;place-items:center;padding:16px;overflow:auto}',
    '.lab-card{width:100%;max-width:480px;background:var(--surface);border:1.5px solid var(--line);border-radius:18px;padding:16px 18px}',
    '.lab-card h3{font-family:var(--f-display,serif);font-style:italic;font-size:32px;margin:0 0 4px}',
    '.lab-card label.f{display:block;font-weight:600;margin:12px 0 4px}',
    '.lab-card input[type=text]{font:inherit;color:var(--fg);background:var(--surface-2);border:1.5px solid var(--line);border-radius:10px;padding:10px 12px;min-height:46px;width:100%}',
    '.lab-chk{display:flex;gap:10px;align-items:flex-start;margin:10px 0;font-size:14px;line-height:1.5}.lab-chk .lab-ar{display:block;margin:2px 0 0;font-size:14px;line-height:1.7}',
    '.lab-chk input{width:22px;height:22px;margin-top:3px;flex:none;accent-color:var(--pink)}',
    '.lab-err{color:var(--coral);min-height:22px;margin:4px 0}',
    '.lab-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}',
    '#lab-report{position:fixed;inset:0;z-index:90;background:var(--bg);overflow:auto;padding:16px max(16px,env(safe-area-inset-left,0px))}',
    '#lab-report .rp{max-width:820px;margin:0 auto 60px}',
    '.rp h2{font-family:var(--f-display,serif);font-style:italic;font-size:clamp(32px,8vw,46px);margin:6px 0 2px}',
    '.rp h3{font-family:var(--f-ar,Cairo,sans-serif);color:var(--teal);margin:26px 0 8px;font-size:20px}',
    '.rp-ar{font-family:var(--f-ar,Cairo,sans-serif);direction:rtl;text-align:right}',
    '.rp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}',
    '.rp-card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:12px 16px}',
    '.rp-card dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:4px 12px}',
    '.rp-card dt{color:var(--muted);font-family:var(--f-ar,Cairo,sans-serif)}',
    '.rp-card dd{margin:0;overflow-wrap:anywhere;font-weight:600}',
    '.rp-kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin:14px 0}',
    '.rp-kpi div{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:10px 14px;text-align:center}',
    '.rp-kpi b{display:block;font-size:26px;font-variant-numeric:tabular-nums}',
    '.rp-kpi span{color:var(--muted);font-size:13px;font-family:var(--f-ar,Cairo,sans-serif)}',
    '.rp-bar{display:grid;grid-template-columns:110px 1fr 90px;gap:10px;align-items:center;margin:6px 0;font-size:14px}',
    '.rp-bar i{display:block;height:12px;border-radius:99px;background:var(--surface-2);position:relative;overflow:hidden}',
    '.rp-bar i u{position:absolute;inset:0 auto 0 0;background:var(--grad);border-radius:99px}',
    '.rp table{width:100%;border-collapse:collapse;font-size:14px}',
    '.rp th,.rp td{border-bottom:1px solid var(--line);padding:7px 8px;text-align:left;vertical-align:top}',
    '.rp th{color:var(--muted);font-weight:600}',
    '.rp .scroll-x{overflow-x:auto}',
    '.rp .bad{color:var(--coral)}.rp .good{color:var(--teal)}',
    '.rp-rec{padding:10px 14px;border-radius:12px;background:var(--surface);border:1px solid var(--line);margin:6px 0;font-family:var(--f-ar,Cairo,sans-serif);line-height:1.8}',
    '.rp-rec a{color:var(--pink)}',
    '.rp-wrong{padding:10px 14px;border-radius:12px;background:var(--surface);border:1px solid var(--line);margin:8px 0;font-size:15px}',
    '.rp-wrong small{color:var(--muted)}',
    '.rp-wide{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}',
    '@page{size:A4;margin:12mm}',
    '@media print{',
    '  html.lab-printing,body.lab-printing{background:#fff!important;color:#14101c;color-scheme:light}',
    '  body.lab-printing *{-webkit-print-color-adjust:exact;print-color-adjust:exact}',
    '  body.lab-printing #lab-report .rp{max-width:none;margin:0;font-size:13px}',
    '  body.lab-printing .rp h2{font-size:30px;margin:2px 0}',
    '  body.lab-printing .rp h3{margin:14px 0 6px;font-size:16px;border-bottom:1.5px solid var(--line);padding-bottom:3px}',
    '  body.lab-printing .rp-grid{grid-template-columns:1fr 1fr;gap:8px}',
    '  body.lab-printing .rp-kpi{grid-template-columns:repeat(5,1fr);gap:6px;margin:8px 0}',
    '  body.lab-printing .rp-kpi b{font-size:20px}',
    '  body.lab-printing .rp-card,body.lab-printing .rp-kpi div,body.lab-printing .rp-rec,body.lab-printing .rp-wrong{padding:6px 10px;border-radius:8px;margin:4px 0}',
    '  body.lab-printing .rp-wrongs{column-count:2;column-gap:10px}',
    '  body.lab-printing .rp-rec a{color:inherit;text-decoration:none;font-weight:700}',
    '  body.lab-printing .rp table{font-size:12px}',
    '  body.lab-printing .rp th{background:var(--surface-2)}',
    '  body.lab-printing>*:not(#lab-report){display:none!important}',
    '  body.lab-printing #lab-report{position:static;inset:auto;overflow:visible;padding:0;background:#fff;color:#14101c;--bg:#fff;--fg:#14101c;--muted:#55506a;--surface:#f6f4fb;--surface-2:#efecf7;--line:#cfc9e0;--teal:#17806c;--pink:#b0307f;--lav:#5b52b0;--coral:#c24a2f;--grad:linear-gradient(90deg,#b0307f,#5b52b0,#17806c)}',
    '  body.lab-printing .rp-wide,body.lab-printing .lab-noprint,body.lab-printing .rp-top,.lab-tools{display:none!important}',
    '  body.lab-printing .rp-card,body.lab-printing .rp-wrong,body.lab-printing tr{break-inside:avoid}',
    '}',
    '@media (max-width:520px){.rp-bar{grid-template-columns:80px 1fr 70px}.lab-bar2{right:12px}.lab-bar2.min{right:auto}}'
  ].join('\n');
  document.head.appendChild(h('style', { id: 'lab-css' }, css));

  /* ---------- appareil et réseau ---------- */
  function detectDevice() {
    var nav = navigator, ua = nav.userAgent || '', os = 'Inconnu', osv = '', m;
    if ((m = ua.match(/Windows NT ([\d.]+)/))) { os = 'Windows'; osv = { '10.0': '10 / 11', '6.3': '8.1', '6.2': '8', '6.1': '7' }[m[1]] || m[1]; }
    else if ((m = ua.match(/Android ([\d.]+)/))) { os = 'Android'; osv = m[1]; }
    else if ((m = ua.match(/(iPhone|iPad|iPod).*? OS ([\d_]+)/))) { os = m[1] === 'iPad' ? 'iPadOS' : 'iOS'; osv = m[2].replace(/_/g, '.'); }
    else if (/Macintosh/.test(ua)) { os = nav.maxTouchPoints > 1 ? 'iPadOS' : 'macOS'; var mv = ua.match(/Mac OS X ([\d_.]+)/); osv = mv ? mv[1].replace(/_/g, '.') : ''; }
    else if (/CrOS/.test(ua)) os = 'ChromeOS';
    else if (/Linux/.test(ua)) os = 'Linux';
    var browser = 'Inconnu', bv = '', br = [[/Edg(?:e|A|iOS)?\/([\d.]+)/, 'Edge'], [/OPR\/([\d.]+)/, 'Opera'], [/SamsungBrowser\/([\d.]+)/, 'Samsung Internet'], [/(?:Firefox|FxiOS)\/([\d.]+)/, 'Firefox'], [/(?:Chrome|CriOS)\/([\d.]+)/, 'Chrome'], [/Version\/([\d.]+).*Safari/, 'Safari']];
    for (var i = 0; i < br.length; i++) { var x = ua.match(br[i][0]); if (x) { browser = br[i][1]; bv = x[1].split('.')[0]; break; } }
    var type = 'Ordinateur';
    if (/iPad|Tablet/.test(ua) || os === 'iPadOS' || (/Android/.test(ua) && !/Mobile/.test(ua))) type = 'Tablette';
    else if (/Mobi|iPhone|iPod|Android/.test(ua)) type = 'Téléphone';
    var model = '';
    if ((m = ua.match(/Android [\d.]+;\s*([^;)]+?)(?:\s+Build\/|[;)])/))) model = m[1].trim();
    if (/iPhone/.test(ua)) model = 'iPhone';
    if (model === 'K') model = '';
    var scr = window.screen || {};
    return {
      type: type, os: os, osVersion: osv, browser: browser, browserVersion: bv, model: model,
      screen: (scr.width || 0) + '×' + (scr.height || 0), viewport: window.innerWidth + '×' + window.innerHeight,
      dpr: window.devicePixelRatio || 1, lang: nav.language || '',
      tz: (Intl.DateTimeFormat().resolvedOptions() || {}).timeZone || '', touch: nav.maxTouchPoints || 0
    };
  }
  function deviceLabel(d) {
    if (!d) return '-';
    var p = [d.type]; if (d.model) p.push(d.model);
    p.push(d.os + (d.osVersion ? ' ' + d.osVersion : '')); p.push(d.browser + (d.browserVersion ? ' ' + d.browserVersion : ''));
    return p.join(' / ');
  }
  function getJSON(url, ms) {
    var c = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var t = setTimeout(function () { if (c) c.abort(); }, ms || 6000);
    return fetch(url, { signal: c ? c.signal : undefined, cache: 'no-store' }).then(function (r) {
      clearTimeout(t); if (!r.ok) throw new Error('http ' + r.status); return r.json();
    }, function (e) { clearTimeout(t); throw e; });
  }
  function cityFromTz(tz) { var c = String(tz || '').split('/').pop(); return c ? c.replace(/_/g, ' ') : ''; }
  function fetchNet() {
    var tz = (Intl.DateTimeFormat().resolvedOptions() || {}).timeZone || '';
    var tries = [
      function () { return getJSON('https://ipwho.is/').then(function (j) { if (j.success === false) throw 0; return { ip: j.ip, city: j.city, region: j.region, country: j.country, isp: j.connection && j.connection.isp, source: 'ipwho.is' }; }); },
      function () { return getJSON('https://ipapi.co/json/').then(function (j) { if (j.error) throw 0; return { ip: j.ip, city: j.city, region: j.region, country: j.country_name, isp: j.org, source: 'ipapi.co' }; }); },
      function () { return getJSON('https://api.ipify.org?format=json').then(function (j) { return { ip: j.ip, source: 'ipify.org' }; }); }
    ];
    var i = 0;
    function next() {
      if (i >= tries.length) return Promise.resolve({ status: 'failed', city: cityFromTz(tz), cityApprox: true, source: 'المنطقة الزمنية للمتصفح' });
      return tries[i++]().then(function (r) {
        if (r && r.ip) { r.status = 'ok'; if (!r.city) { r.city = cityFromTz(tz); r.cityApprox = true; } return r; }
        return next();
      }, next);
    }
    return next();
  }

  /* ---------- session ---------- */
  var K_CUR = 'lab_cur', K_HIST = 'lab_hist', K_PROG = 'lab_prog', K_NAME = 'lab_name', K_CLS = 'lab_cls';
  /* code de classe : 3 à 12 lettres ou chiffres, fourni par l'enseignant (lien ?c=CODE ou saisie) */
  function clsClean(v) { v = String(v == null ? '' : v).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12); return v.length >= 3 ? v : ''; }
  try { var mc = /[?&]c=([^&#]*)/.exec(location.search); if (mc && clsClean(decodeURIComponent(mc[1]))) store.set(K_CLS, clsClean(decodeURIComponent(mc[1]))); } catch (_) {}
  var Sess = (Lab.Session = {});
  var listeners = [];
  Sess.on = function (f) { listeners.push(f); };
  function emit() { listeners.forEach(function (f) { try { f(); } catch (_) {} }); }
  /* données relues depuis localStorage : jamais de confiance (contenu modifiable par l'utilisateur) */
  function sstr(x, n) { return String(x == null ? '' : x).replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, n); }
  function snum(x, d, lo, hi) { x = +x; return isFinite(x) ? Math.min(hi, Math.max(lo, x)) : d; }
  function sprim(o) { var r = {}; if (!o || typeof o !== 'object') return r; Object.keys(o).slice(0, 40).forEach(function (k) { var v = o[k]; if (typeof v === 'string') r[sstr(k, 30)] = sstr(v, 120); else if (typeof v === 'number' && isFinite(v)) r[sstr(k, 30)] = v; else if (typeof v === 'boolean') r[sstr(k, 30)] = v; }); return r; }
  function cleanAns(a) {
    a = a && typeof a === 'object' ? a : {};
    return { app: sstr(a.app, 12), chap: sstr(a.chap, 24).replace(/[^\w-]/g, ''), title: sstr(a.title, 120), topic: sstr(a.topic, 40), d: Math.round(snum(a.d, 1, 1, 4)), ok: !!a.ok, pts: snum(a.pts, 0, 0, 100), hint: !!a.hint, ms: snum(a.ms, 0, 0, 36e5), q: sstr(a.q, 300), given: sstr(a.given, 80), right: sstr(a.right, 120), t: snum(a.t, 0, 0, 4e12), late: !!a.late };
  }
  function cleanSess(s) {
    if (!s || typeof s !== 'object' || Array.isArray(s)) return null;
    var c = sprim(s);
    c.id = sstr(s.id, 40).replace(/[^\w-]/g, ''); c.name = sstr(s.name, 60); c.cls = clsClean(s.cls);
    c.startedAt = snum(s.startedAt, 0, 0, 4e12); c.endedAt = s.endedAt ? snum(s.endedAt, 0, 0, 4e12) : null; c.consent = !!s.consent;
    c.device = sprim(s.device); c.net = sprim(s.net);
    c.answers = (Array.isArray(s.answers) ? s.answers : []).slice(-2000).map(cleanAns);
    return c.id ? c : null;
  }
  Sess.cur = function () { return cleanSess(store.get(K_CUR, null)); };
  Sess.hist = function () { var h = store.get(K_HIST, []); return (Array.isArray(h) ? h : []).slice(0, 20).map(cleanSess).filter(Boolean); };
  function patch(id, fn) {
    var c = Sess.cur(); if (c && c.id === id) { fn(c); store.set(K_CUR, c); }
    var hs = Sess.hist(), i = hs.findIndex(function (x) { return x.id === id; });
    if (i >= 0) { fn(hs[i]); store.set(K_HIST, hs); }
  }
  Sess.start = function (name, consent, cls) {
    var id = 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    var s = { id: id, name: String(name).trim().slice(0, 60), startedAt: Date.now(), endedAt: null, consent: !!consent, cls: clsClean(cls), device: detectDevice(), net: consent ? { status: 'pending' } : { status: 'declined' }, answers: [] };
    store.set(K_CUR, s); store.set(K_NAME, s.name); if (s.cls) store.set(K_CLS, s.cls); else store.del(K_CLS);
    var hs = Sess.hist(); hs.unshift(s); store.set(K_HIST, hs.slice(0, 20));
    emit();
    if (consent) {
      fetchNet().then(function (net) {
        patch(id, function (x) { x.net = net; }); emit();
        var cur = Sess.hist().find(function (x) { return x.id === id; }); if (cur) Notify.login(cur);
      });
      try {
        if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues)
          navigator.userAgentData.getHighEntropyValues(['model', 'platformVersion']).then(function (v) {
            patch(id, function (x) { if (v.model) x.device.model = v.model; if (v.platformVersion && x.device.os === 'Windows') x.device.osVersion = (parseInt(v.platformVersion, 10) >= 13 ? '11' : '10'); });
            emit();
          }, function () {});
      } catch (_) {}
    }
    return s;
  };
  Sess.end = function () {
    var c = Sess.cur(); if (!c) return null;
    patch(c.id, function (x) { x.endedAt = Date.now(); });
    store.del(K_CUR); emit();
    var done = Sess.hist().find(function (x) { return x.id === c.id; }) || c;
    Notify.end(done);
    return done;
  };
  Sess.log = function (rec) {
    var c = Sess.cur(); if (!c) return;
    rec.t = Date.now();
    patch(c.id, function (x) { x.answers.push(rec); if (x.answers.length > 3000) x.answers.shift(); });
    emit();
  };
  Sess.clearAll = function () { [K_CUR, K_HIST, K_PROG, K_NAME, 'lab_game'].forEach(store.del); try { sessionStorage.removeItem('lab_skip'); } catch (_) {} emit(); };
  function stats(s) {
    var a = (s && s.answers) || [], n = a.length, ok = a.filter(function (x) { return x.ok; }).length;
    var pts = a.reduce(function (t, x) { return t + (x.pts || 0); }, 0), hints = a.filter(function (x) { return x.hint; }).length;
    var ms = a.reduce(function (t, x) { return t + (x.ms || 0); }, 0);
    var lv = {}; [1, 2, 3, 4].forEach(function (d) { var l = a.filter(function (x) { return x.d === d; }); lv[d] = { n: l.length, ok: l.filter(function (x) { return x.ok; }).length }; });
    var ch = {};
    a.forEach(function (x) {
      var k = x.app + '|' + x.chap; var c = ch[k] || (ch[k] = { app: x.app, chap: x.chap, title: x.title, n: 0, ok: 0, ms: 0, pts: 0 });
      c.n++; if (x.ok) c.ok++; c.ms += x.ms || 0; c.pts += x.pts || 0;
    });
    return { n: n, ok: ok, pct: n ? Math.round(100 * ok / n) : 0, pts: pts, hints: hints, avg: n ? ms / n : 0, lv: lv, ch: Object.keys(ch).map(function (k) { return ch[k]; }) };
  }
  Sess.stats = stats;

  /* ---------- alertes vers l'enseignant (Telegram via un relais) ---------- */
  var Notify = (Lab.Notify = {});
  function nurl() { return window.LAB_NOTIFY_URL || ''; }
  Notify.enabled = function () { return !!nurl(); };
  function send(payload, beacon) {
    var u = nurl(); if (!u) return;
    payload.v = 1; payload.page = CFG.appName; payload.t = Date.now();
    var body = JSON.stringify(payload);
    try {
      if (beacon && navigator.sendBeacon && navigator.sendBeacon(u, new Blob([body], { type: 'text/plain;charset=UTF-8' }))) return;
      fetch(u, { method: 'POST', body: body, keepalive: true, headers: { 'Content-Type': 'text/plain;charset=UTF-8' } }).catch(function () {});
    } catch (_) {}
  }
  function summary(s) {
    var st = stats(s), n = s.net || {};
    var weak = st.ch.filter(function (c) { return c.n >= 3 && c.ok / c.n < 0.6; }).slice(0, 5).map(function (c) { return { title: c.title, pct: Math.round(100 * c.ok / c.n), n: c.n }; });
    return {
      sid: s.id, name: s.name, cls: s.cls || '', device: deviceLabel(s.device), consent: !!s.consent,
      ip: s.consent ? n.ip || '' : '', city: s.consent ? n.city || '' : '', region: s.consent ? n.region || '' : '', country: s.consent ? n.country || '' : '', isp: s.consent ? n.isp || '' : '', cityApprox: !!n.cityApprox,
      durMs: (s.endedAt || Date.now()) - s.startedAt, n: st.n, ok: st.ok, pct: st.pct, pts: Math.round(st.pts * 10) / 10, hints: st.hints,
      lv: [1, 2, 3, 4].map(function (k) { return [st.lv[k].ok, st.lv[k].n]; }), weak: weak
    };
  }
  var openSent = false, exitCount = -1;
  Notify.open = function () {
    if (openSent) return; openSent = true;
    var s = Sess.cur();
    send(s && s.consent ? { type: 'open', name: s.name, sid: s.id } : { type: 'open' });
  };
  Notify.login = function (s) { send(Object.assign({ type: 'login' }, summary(s))); };
  Notify.series = function (o) { var s = Sess.cur(); if (!s || !s.consent) return; send(Object.assign({ type: 'series', sid: s.id, name: s.name, cls: s.cls || '' }, o)); };
  Notify.end = function (s) { if (s && s.consent) send(Object.assign({ type: 'end' }, summary(s))); };
  Notify.exit = function () {
    var s = Sess.cur(); if (!s || !s.consent) return;
    if (exitCount === s.answers.length) return; exitCount = s.answers.length;
    send(Object.assign({ type: 'exit' }, summary(s)), true);
  };
  window.addEventListener('pagehide', Notify.exit);

  /* ---------- progression par chapitre ---------- */
  function progGet() { return store.get(K_PROG, {}); }
  function progSet(app, chap, d, pct) {
    var p = progGet(), k = app + '|' + chap; p[k] = p[k] || {};
    if (!p[k][d] || p[k][d] < pct) p[k][d] = pct;
    store.set(K_PROG, p);
  }

  /* ---------- jours de suite et badges : gardés dans ce navigateur, jamais envoyés ---------- */
  var K_GAME = 'lab_game';
  function dayKey(t) { var d = new Date(t); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function validatedChapters() {
    var p = progGet(), n = 0;
    Object.keys(p).forEach(function (k) { var o = p[k] || {}; if (Object.keys(o).some(function (d) { return +o[d] >= 80; })) n++; });
    return n;
  }
  function streakOf(days, now) {
    var set = {}; days.forEach(function (d) { set[d] = 1; });
    var t = now, n = 0;
    if (!set[dayKey(t)]) t -= 864e5;            // la série reste vivante jusqu'à la fin du jour suivant
    while (set[dayKey(t)] && n < 400) { n++; t -= 864e5; }
    return n;
  }
  var BADGES = [
    { id: 'first', fr: 'Première série', ar: 'أول سلسلة', ok: function (g) { return g.series >= 1; } },
    { id: 'ten', fr: '10 séries', ar: '10 سلاسل', ok: function (g) { return g.series >= 10; } },
    { id: 'perfect', fr: 'Sans faute', ar: 'علامة كاملة', ok: function (g) { return g.perfect >= 1; } },
    { id: 'defi', fr: 'Défi réussi', ar: 'تحدٍّ ناجح', ok: function (g) { return g.defi >= 1; } },
    { id: 'chap3', fr: '3 chapitres validés', ar: '3 دروس متقنة', ok: function () { return validatedChapters() >= 3; } },
    { id: 'streak3', fr: '3 jours de suite', ar: '3 أيام متتالية', ok: function (g, now) { return streakOf(g.days, now) >= 3; } },
    { id: 'streak7', fr: '7 jours de suite', ar: '7 أيام متتالية', ok: function (g, now) { return streakOf(g.days, now) >= 7; } }
  ];
  function gameGet() {
    var g = store.get(K_GAME, {}); g = g && typeof g === 'object' && !Array.isArray(g) ? g : {};
    var ids = BADGES.map(function (b) { return b.id; }), badges = {};
    ids.forEach(function (id) { if (g.badges && isFinite(+g.badges[id]) && +g.badges[id] > 0) badges[id] = +g.badges[id]; });
    return {
      series: Math.round(snum(g.series, 0, 0, 1e6)), perfect: Math.round(snum(g.perfect, 0, 0, 1e6)), defi: Math.round(snum(g.defi, 0, 0, 1e6)),
      days: (Array.isArray(g.days) ? g.days : []).filter(function (d) { return /^\d{4}-\d{2}-\d{2}$/.test(d); }).slice(-120), badges: badges
    };
  }
  /* r = { pct, d } : appelé à chaque série terminée. Retourne le nombre de jours de suite et les nouveaux badges. */
  function gameRecord(r, now) {
    now = now || Date.now();
    var g = gameGet(), today = dayKey(now);
    g.series++; if (r.pct === 100) g.perfect++; if (r.d === 4 && r.pct >= 80) g.defi++;
    if (g.days.indexOf(today) < 0) g.days.push(today);
    g.days = g.days.slice(-120);
    var fresh = [];
    BADGES.forEach(function (b) { if (!g.badges[b.id] && b.ok(g, now)) { g.badges[b.id] = now; fresh.push(b); } });
    store.set(K_GAME, g);
    return { streak: streakOf(g.days, now), fresh: fresh };
  }
  Lab.Game = { record: gameRecord, get: gameGet, badges: BADGES, streak: function (now) { return streakOf(gameGet().days, now || Date.now()); } };
  function gameHtml(res) {
    if (!res) return '';
    var out = '<p class="lab-streak">' + res.streak + (res.streak > 1 ? ' jours de suite' : ' jour') + ' · <span dir="rtl" lang="ar">' + res.streak + (res.streak > 2 ? ' أيام متتالية' : ' يوم') + '</span></p>';
    if (res.fresh.length) out += '<p>' + res.fresh.map(function (b) { return '<span class="lab-newbadge">Badge : ' + esc(b.fr) + ' · <span dir="rtl" lang="ar">' + esc(b.ar) + '</span></span>'; }).join('') + '</p>';
    return out;
  }

  /* ---------- fabrique de questions ---------- */
  function norm(it) {
    if (!it || typeof it.q !== 'string' || !it.q) return null;
    var o = {}; for (var k in it) o[k] = it[k];
    if (o.t === 'qcm') o.t = 'mcq';
    if (o.t === 'num') { if (typeof o.a !== 'number' || !isFinite(o.a)) return null; if (o.tol == null) o.tol = 1e-6; }
    else if (o.t === 'mcq') { if (!o.o || o.o.length < 2 || o.a == null || o.a < 0 || o.a >= o.o.length) return null; }
    else return null;
    if (/NaN|undefined|Infinity/.test(o.q + (o.e || '') + (o.sol || ''))) return null;
    return o;
  }
  function makeItem(cfg, d, seen) {
    for (var tries = 0; tries < 40; tries++) {
      var key = pick(cfg.topics), it = null;
      try { it = norm(CFG.gen(key, d)); } catch (e) { it = null; }
      if (it && !seen[it.q]) { seen[it.q] = 1; it.key = key; it.d = d; return it; }
    }
    return null;
  }
  Lab.makeItem = makeItem;
  function answerText(it) {
    if (it.t === 'num') return it.sol ? plain(it.sol) : String(it.a) + (it.u ? ' ' + it.u : '');
    return plain(it.o[it.a]);
  }
  Lab.answerText = answerText;

  /* ---------- composant d'exercices ---------- */
  var SECS = 45; // secondes par question au niveau Défi
  function mount(el, ctx) {
    var cfg = ctx.cfg, level = 2, mode = 'level';
    var wrap = h('div', { 'class': 'lab-box' });
    function reduceMotion() { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; }
    el.appendChild(wrap);

    var tabs = h('div', { 'class': 'lab-tabs', role: 'tablist' });
    var list = [[1], [2], [3], [4], ['a']];
    function tabLabel(t) {
      var pr = progGet()[CFG.app + '|' + ctx.id] || {}, done = t[0] !== 'a' && pr[t[0]] >= 80;
      if (t[0] === 'a') return 'Adaptatif<small>تكيّفي</small>';
      return LV[t[0]].mark + ' ' + LV[t[0]].fr + (done ? ' <span class="ok">✓</span>' : '') + '<small>' + LV[t[0]].ar + '</small>';
    }
    function drawTabs() {
      tabs.innerHTML = '';
      list.forEach(function (t) {
        var sel = t[0] === 'a' ? mode === 'adapt' : (mode === 'level' && level === t[0]);
        var b = h('button', { type: 'button', 'class': 'lab-tab', role: 'tab', 'aria-selected': sel ? 'true' : 'false' }, tabLabel(t));
        b.addEventListener('click', function () { if (t[0] === 'a') { mode = 'adapt'; } else { mode = 'level'; level = t[0]; } stopRun(); drawTabs(); intro(); });
        tabs.appendChild(b);
      });
    }
    var info = h('div'), arena = h('div');
    wrap.appendChild(tabs); wrap.appendChild(info); wrap.appendChild(arena);

    var timerId = null;
    var stopHook = null;
    function stopRun() { if (timerId) { clearInterval(timerId); timerId = null; } if (stopHook) stopHook(); arena.innerHTML = ''; }

    function intro() {
      var d = level, s = Sess.cur();
      var txt = mode === 'adapt'
        ? 'La difficulté s’ajuste : une bonne réponse monte d’un niveau, une erreur redescend. 8 questions.'
        : (d === 4 ? 'Défi : 5 questions du niveau le plus difficile, ' + SECS + ' secondes par question, sans indice, une seule tentative. Points ×5.'
          : (d === 3 ? '6 questions difficiles, plusieurs étapes. Un indice coûte la moitié des points.' : '6 questions. Un indice coûte la moitié des points.'));
      var ar = mode === 'adapt'
        ? 'المستوى يتغيّر حسب إجاباتك: إجابة صحيحة تصعّد المستوى، وخطأ ينزل به. 8 أسئلة.'
        : (d === 4 ? 'التحدّي: 5 أسئلة من أصعب مستوى، ' + SECS + ' ثانية لكل سؤال، بلا تلميح، ومحاولة واحدة. النقاط ×5.'
          : 'ستّ أسئلة. استعمال التلميح يخسّرك نصف النقاط. النجاح عند 80% فما فوق.');
      info.innerHTML = '<p class="lab-note">' + txt + '</p><p class="lab-ar" dir="rtl" lang="ar">' + ar + '</p>' +
        (s ? '' : '<p class="lab-note lab-noprint">Aucune session ouverte : tes résultats ne sont pas enregistrés. <a href="#" data-lab-start>Démarrer une session</a></p>');
      var a = info.querySelector('[data-lab-start]');
      if (a) a.addEventListener('click', function (e) { e.preventDefault(); openStart(); });
      arena.innerHTML = '';
      var go = h('button', { type: 'button', 'class': 'btn' }, 'Lancer la série');
      go.addEventListener('click', run);
      arena.appendChild(go);
    }

    function run() {
      stopRun();
      var seen = {}, N = mode === 'adapt' ? 8 : (level === 4 ? 5 : 6);
      var d = mode === 'adapt' ? 2 : level, idx = 0, good = 0, pts = 0, max = 0, deadline = 0, answered = false;
      var autoOn = String(store.get('lab_auto', '1')) !== '0', autoT = null;
      var head = h('div', { 'class': 'lab-bar' }), prog = h('div', { 'class': 'lab-prog' }, '<i></i>'), holder = h('div');
      arena.appendChild(head); arena.appendChild(prog); arena.appendChild(holder);
      var timerEl = h('span', { 'class': 'lab-timer' });
      stopHook = function () { if (autoT) { clearTimeout(autoT); autoT = null; } };
      var autoLbl = h('label', { 'class': 'lab-auto' }, '<input type="checkbox"' + (autoOn ? ' checked' : '') + '> Passage auto · تلقائي');
      autoLbl.firstChild.addEventListener('change', function () { autoOn = this.checked; store.set('lab_auto', autoOn ? '1' : '0'); if (!autoOn && autoT) { clearTimeout(autoT); autoT = null; } });
      arena.insertBefore(autoLbl, head);
      function upHead(cur) {
        head.innerHTML = '<span>Question ' + (Math.min(idx + 1, N)) + ' / ' + N + ' · ' + LV[cur].mark + ' ' + LV[cur].fr + '</span><span>' + pts + ' pts</span>';
        if (mode === 'level' && level === 4) head.appendChild(timerEl);
        prog.firstChild.style.width = (100 * idx / N) + '%';
      }
      if (mode === 'level' && level === 4) {
        deadline = Date.now() + SECS * N * 1000;
        timerId = setInterval(function () {
          var left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
          timerEl.textContent = '⏱ ' + Math.floor(left / 60) + ':' + ('0' + (left % 60)).slice(-2);
          if (left <= 0) { clearInterval(timerId); timerId = null; timeUp(); }
        }, 250);
      }
      var current = null;
      function timeUp() {
        if (current && !answered) record(current.it, false, '(temps écoulé)', current.hint, true);
        idx = N;
        finish(true);
      }
      var startT = 0;
      function next() {
        if (idx >= N) { finish(false); return; }
        var dd = mode === 'adapt' ? d : level;
        var it = makeItem(cfg, dd, seen);
        if (!it) { N = idx; finish(false); return; }
        if (autoT) { clearTimeout(autoT); autoT = null; }
        answered = false; startT = Date.now(); max += LV[dd].pts;
        current = { it: it, i: idx, hint: false }; Lab.current = function () { return current && current.it; };
        upHead(dd);
        holder.innerHTML = '';
        var cardEl = card(it, dd); holder.appendChild(cardEl);
        try { var rc = cardEl.getBoundingClientRect(); if (rc.top < 60 || rc.bottom > window.innerHeight - 40) cardEl.scrollIntoView({ block: 'center', behavior: reduceMotion() ? 'auto' : 'smooth' }); } catch (_) {}
      }
      function record(it, ok, given, hint, late) {
        var dd = it.d, base = LV[dd].pts, p = ok ? (hint ? base / 2 : base) : 0;
        pts += p; if (ok) good++;
        Sess.log({ app: CFG.app, chap: ctx.id, title: ctx.title, topic: it.key, d: dd, ok: ok, pts: p, hint: !!hint, ms: Date.now() - startT, q: plain(it.q).slice(0, 220), given: String(given).slice(0, 60), right: answerText(it).slice(0, 80), late: !!late });
        answered = true;
      }
      function card(it, dd) {
        var box = h('div', { 'class': 'lab-q' }), over = false, usedHint = false, tries = 0;
        box.appendChild(h('p', { 'class': 'q' }, it.q));
        var fb = h('p', { 'class': 'lab-fb', 'aria-live': 'polite' });
        var hintEl = h('p', { 'class': 'lab-hint', hidden: '' }, '<b>Indice.</b> ' + (it.h || 'Relis le cours.'));
        var tools = h('div', { 'class': 'lab-actions' }), hb = null;
        function done(ok, given) {
          over = true; if (hb) hb.disabled = true;
          record(it, ok, given, usedHint, false);
          box.classList.add(ok ? 'is-ok' : 'is-ko');
          fb.innerHTML = (ok ? '<b>Exact.</b> ' : '<b>Pas tout à fait.</b> La réponse est <b>' + esc(answerText(it)) + '</b>. ') + (it.e || '');
          idx++; upHead(mode === 'adapt' ? d : level); prog.firstChild.style.width = (100 * idx / N) + '%';
          if (mode === 'adapt') d = ok ? Math.min(4, d + 1) : Math.max(1, d - 1);
          var nb = h('button', { type: 'button', 'class': 'btn' }, idx >= N ? 'Voir le résultat' : 'Question suivante');
          nb.addEventListener('click', next);
          box.appendChild(nb);
          nb.focus({ preventScroll: true });
          if (ok && autoOn && true) {
            nb.textContent = (idx >= N ? 'Résultat' : 'Suivante') + ' …';
            autoT = setTimeout(function () { autoT = null; next(); }, 1500);
          }
        }
        if (it.t === 'num') {
          var row = h('div', { 'class': 'lab-row' }), inp = h('input', { type: 'text', inputmode: 'decimal', autocomplete: 'off', autocapitalize: 'off', 'aria-label': 'Ta réponse', placeholder: 'Ta réponse' }), go = h('button', { type: 'button', 'class': 'btn' }, 'Valider');
          var keys = h('div', { 'class': 'lab-keys' });
          [['−', '−'], ['/', '/'], [',', ',']].forEach(function (k) { var kb = h('button', { type: 'button', 'aria-label': 'Insérer ' + k[0] }, k[0]); kb.addEventListener('mousedown', function (e) { e.preventDefault(); }); kb.addEventListener('click', function () { if (!inp.disabled) { inp.value += k[1]; inp.focus(); } }); keys.appendChild(kb); });
          row.appendChild(inp); row.appendChild(keys); if (it.u) row.appendChild(h('span', { 'class': 'lab-note' }, it.u)); row.appendChild(go); box.appendChild(row);
          var check = function () {
            if (over) return;
            var v = parseNum(inp.value);
            if (isNaN(v)) { fb.textContent = 'Écris un nombre, par exemple 3,5 ou 3/4.'; return; }
            inp.disabled = true; go.disabled = true;
            done(Math.abs(v - it.a) <= (it.tol || 0) + 1e-9, inp.value);
          };
          go.addEventListener('click', check);
          inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); check(); } });
          setTimeout(function () { try { inp.focus(); } catch (_) {} }, 30);
        } else {
          var ob = h('div', { 'class': 'lab-opts' });
          var btns = it.o.map(function (t, i) {
            var b = h('button', { type: 'button', 'class': 'lab-opt' }, t);
            b.addEventListener('click', function () {
              if (over) return;
              var ok = i === it.a;
              btns.forEach(function (x, xi) { x.disabled = true; if (xi === it.a) x.classList.add('ok'); });
              if (!ok) b.classList.add('ko');
              done(ok, plain(t));
            });
            ob.appendChild(b); return b;
          });
          box.appendChild(ob);
        }
        if (dd < 4) {
          hb = h('button', { type: 'button', 'class': 'btn ghost' }, 'Indice (−50 %)');
          hb.addEventListener('click', function () { usedHint = true; current.hint = true; hintEl.hidden = false; });
          tools.appendChild(hb); box.appendChild(tools);
        }
        box.appendChild(hintEl); box.appendChild(fb);
        return box;
      }
      function finish(timeout) {
        if (timerId) { clearInterval(timerId); timerId = null; }
        var asked = Math.max(1, N), pct = Math.round(100 * good / asked);
        var lvl = mode === 'adapt' ? 0 : level;
        if (lvl) progSet(CFG.app, ctx.id, lvl, pct);
        prog.firstChild.style.width = '100%';
        Notify.series({ app: CFG.app, chap: ctx.id, title: ctx.title, d: mode === 'adapt' ? 0 : level, good: good, asked: asked, pct: pct, pts: Math.round(pts * 10) / 10, max: max, timeout: !!timeout });
        var game = null; try { game = gameRecord({ pct: pct, d: mode === 'adapt' ? 0 : level }); } catch (_) {}
        var msg = pct >= 80 ? 'Bravo : niveau validé.' : (pct >= 50 ? 'Bien. Relis la leçon puis recommence pour valider.' : 'Reprends le cours de ce chapitre, puis un niveau plus facile.');
        var ar = pct >= 80 ? 'أحسنت! تم اجتياز هذا المستوى.' : (pct >= 50 ? 'جيّد. راجع الدرس وأعد المحاولة للنجاح في المستوى.' : 'عُد إلى درس هذا الفصل ثم جرّب مستوى أسهل.');
        var s = h('div', { 'class': 'lab-sum' }, '<h4>' + good + ' / ' + asked + ' · ' + pct + ' %</h4><p>' + pts + ' / ' + max + ' points' + (timeout ? ' · temps écoulé' : '') + '. ' + msg + '</p><p class="lab-ar" dir="rtl" lang="ar">' + ar + '</p>' + gameHtml(game));
        var act = h('div', { 'class': 'lab-actions' });
        var again = h('button', { type: 'button', 'class': 'btn' }, 'Nouvelle série'); again.addEventListener('click', run); act.appendChild(again);
        if (lvl && lvl < 4 && pct >= 80) { var up = h('button', { type: 'button', 'class': 'btn' }, 'Niveau suivant'); up.addEventListener('click', function () { level = lvl + 1; drawTabs(); intro(); run(); }); act.appendChild(up); }
        if (Sess.cur()) { var rp = h('button', { type: 'button', 'class': 'btn ghost' }, 'Mon rapport'); rp.addEventListener('click', function () { openReport(Sess.cur()); }); act.appendChild(rp); }
        s.appendChild(act); holder.innerHTML = ''; holder.appendChild(s);
        drawTabs();
        try { s.scrollIntoView({ block: 'center', behavior: reduceMotion() ? 'auto' : 'smooth' }); } catch (_) {}
      }
      next();
    }

    drawTabs(); intro();
    return { stop: stopRun };
  }
  Lab.mount = mount;

  /* ---------- hook sur les chapitres ---------- */
  /* exercices et quiz hors du composant Défis (Collège pionnier, « Je m'entraîne ») : enregistrés dans la session */
  function chapOf(el) {
    var ch = el && el.closest ? el.closest('.chapter') : null;
    return { id: ch ? ch.id : '', title: ch && ch.querySelector('h2') ? ch.querySelector('h2').textContent : '' };
  }
  Lab.record = function (el, r) {
    try {
      var c = chapOf(el), d = r.d || 1;
      Sess.log({ app: CFG.app, chap: c.id, title: c.title, topic: r.topic || 'cours', d: d, ok: !!r.ok, pts: r.ok ? (LV[d] ? LV[d].pts : 1) * (r.hint ? 0.5 : 1) : 0, hint: !!r.hint, ms: 0, q: plain(r.q || '').slice(0, 220), given: String(r.given == null ? '' : r.given).slice(0, 60), right: plain(r.right || '').slice(0, 80), late: false });
    } catch (_) {}
  };
  Lab.seriesDone = function (el, r) {
    try {
      var c = chapOf(el), d = r.d || 1, asked = Math.max(1, r.asked), pp = LV[d] ? LV[d].pts : 1;
      Notify.series({ app: CFG.app, chap: c.id, title: c.title, d: d, good: r.good, asked: asked, pct: Math.round(100 * r.good / asked), pts: Math.round(r.good * pp * 10) / 10, max: asked * pp, timeout: false });
      gameRecord({ pct: Math.round(100 * r.good / asked), d: d });
    } catch (_) {}
  };

  Lab.install = function (NS) {
    var orig = NS.chapter;
    NS.chapter = function (c) {
      var cfg = CFG.map[c.id];
      if (cfg) {
        var ctx = { id: c.id, title: c.title, cfg: cfg };
        var extra = {
          short: 'Défis', title: 'Défis par niveaux', label: 'Défis · تحدّيات',
          intro: 'Quatre niveaux, du plus facile au défi chronométré. Chaque série est tirée au hasard.',
          build: function (el) { mount(el, ctx); },
          ar: { e: ['هذه تمارين تفاعلية بأربعة مستويات: سهل، متوسط، صعب، ثم تحدٍّ بمؤقّت. الأسئلة تتغيّر في كل مرة، ونتائجك تُسجَّل في جلستك لتظهر في التقرير.'], w: [['niveau', 'مستوى'], ['indice', 'تلميح'], ['défi', 'تحدٍّ'], ['série', 'سلسلة أسئلة']] }
        };
        if (typeof c.lessons === 'function') { var f = c.lessons; c.lessons = function () { var a = f(); a.push(extra); return a; }; }
        else c.lessons = c.lessons.concat([extra]);
      }
      return orig.apply(this, arguments);
    };
  };

  /* ---------- fenêtre de démarrage ---------- */
  var modal = null;
  function closeModal() { if (modal) { modal.remove(); modal = null; } }
  function openStart() {
    closeModal();
    var last = store.get(K_NAME, '');
    modal = h('div', { 'class': 'lab-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Démarrer une session' });
    modal.innerHTML =
      '<div class="lab-card"><h3>Ma session · جلستي</h3>' +
      '<label class="f" for="lab-name">Nom · الاسم</label><input id="lab-name" type="text" maxlength="60" autocomplete="name" value="' + esc(last) + '">' +
      (Notify.enabled() ? '<label class="f" for="lab-cls">Code de classe (facultatif) · رمز القسم</label><input id="lab-cls" type="text" maxlength="12" autocomplete="off" autocapitalize="characters" spellcheck="false" value="' + esc(store.get(K_CLS, '')) + '">' : '') +
      (Notify.enabled()
        ? '<label class="lab-chk"><input id="lab-cons" type="checkbox"><span>J’accepte que mon nom, mon appareil, mon IP et ma ville approximative soient envoyés à mon enseignant.<span class="lab-ar" dir="rtl" lang="ar">أوافق على إرسال اسمي وجهازي وعنوان IP ومدينتي التقريبية إلى أستاذي.</span></span></label>' +
          '<p class="lab-note">Une visite anonyme (page, heure, pays) est aussi signalée. <a href="confidentialite.html" target="_blank" rel="noopener">Confidentialité · الخصوصية</a></p>'
        : '<label class="lab-chk"><input id="lab-cons" type="checkbox"><span>J’accepte que mon appareil, mon IP et ma ville approximative figurent dans mon rapport.<span class="lab-ar" dir="rtl" lang="ar">أوافق على إظهار جهازي وعنوان IP ومدينتي التقريبية في تقريري.</span></span></label>' +
          '<p class="lab-note">Données gardées dans ce navigateur. <a href="confidentialite.html" target="_blank" rel="noopener">Confidentialité · الخصوصية</a></p>') +
      '<p class="lab-err" id="lab-err" role="alert"></p>' +
      '<div class="lab-actions"><button type="button" class="btn" id="lab-go">Commencer</button><button type="button" class="btn ghost" id="lab-skip">Sans session</button></div></div>';
    document.body.appendChild(modal);
    var nm = $('#lab-name', modal);
    setTimeout(function () { nm.focus(); }, 30);
    $('#lab-go', modal).addEventListener('click', function () {
      var n = nm.value.trim();
      if (n.length < 2) { $('#lab-err', modal).textContent = 'Écris ton nom (2 lettres au moins). · اكتب اسمك'; return; }
      var okc = $('#lab-cons', modal).checked;
      if (Notify.enabled() && !okc) { $('#lab-err', modal).textContent = 'Coche la case pour continuer, ou choisis « Sans session ». · وافق للمتابعة أو اختر «Sans session»'; return; }
      var ce = $('#lab-cls', modal); Sess.start(n, okc, ce ? ce.value : ''); closeModal();
    });
    nm.addEventListener('keydown', function (e) { if (e.key === 'Enter') $('#lab-go', modal).click(); });
    $('#lab-skip', modal).addEventListener('click', function () { try { sessionStorage.setItem('lab_skip', '1'); } catch (_) {} closeModal(); render(); });
  }
  Lab.openStart = openStart;

  /* ---------- application installable et hors ligne ---------- */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }

  /* ---------- barre de session ---------- */
  var bar = null;
  function render() {
    if (!bar) { bar = h('div', { 'class': 'lab-bar2 lab-noprint', role: 'region', 'aria-label': 'Session' }); document.body.appendChild(bar); }
    var s = Sess.cur();
    if (!s) {
      bar.innerHTML = '<span class="lab-dot off"></span><span>Sans session</span><button type="button" data-a="start">Démarrer</button>' + (Sess.hist().length ? '<button type="button" data-a="last">Dernier rapport</button>' : '') + '<button type="button" data-a="tog" aria-label="Réduire ou agrandir la barre">' + (isMin() ? '▴' : '▾') + '</button>';
    } else {
      var st = stats(s);
      bar.innerHTML = '<span class="lab-dot"></span><b>' + esc(s.name) + '</b><span>' + st.ok + '/' + st.n + '</span><button type="button" data-a="rep">Rapport</button><button type="button" data-a="end">Terminer</button><button type="button" data-a="tog" aria-label="Réduire ou agrandir la barre">' + (isMin() ? '▴' : '▾') + '</button>';
    }
    bar.classList.toggle('min', isMin());
    document.body.classList.add('lab-has-bar');
  }
  function isMin() { try { return sessionStorage.getItem('lab_barmin') !== '0'; } catch (_) { return true; } }
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('[data-a]') : null;
    if (!b || !bar || !bar.contains(b)) return;
    var a = b.getAttribute('data-a');
    if (a === 'tog') { try { sessionStorage.setItem('lab_barmin', isMin() ? '0' : '1'); } catch (_) {} render(); }
    else if (a === 'start') openStart();
    else if (a === 'rep') openReport(Sess.cur());
    else if (a === 'last') openReport(Sess.hist()[0]);
    else if (a === 'end') { if (confirm('Terminer la session et voir le rapport ? · إنهاء الجلسة وعرض التقرير؟')) openReport(Sess.end()); }
  });
  Sess.on(render);

  /* ---------- rapport ---------- */
  function rpDl(label, val) { return '<dt>' + label + '</dt><dd>' + (val === '' || val == null ? '-' : esc(val)) + '</dd>'; }
  function openReport(s) {
    if (!s) return;
    var old = $('#lab-report'); if (old) old.remove();
    var st = stats(s), box = h('div', { id: 'lab-report', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Rapport de session' });
    var d = s.device || {}, n = s.net || {}, end = s.endedAt || Date.now();
    var netState = n.status === 'pending' ? 'جارٍ التحديد…' : (n.status === 'declined' ? 'لم يوافق المستخدم' : (n.status === 'failed' ? 'تعذّر الحصول على IP' : ''));
    var place = [n.city, n.region, n.country].filter(Boolean).join('، ');
    var html = '<div class="rp"><div class="rp-top"><button type="button" class="btn ghost" data-r="close">✕ Fermer · إغلاق</button></div><p class="lab-note">' + esc(CFG.appName) + ' · rapport de session</p>' +
      '<h2>' + esc(s.name) + '</h2><p class="rp-ar" dir="rtl" lang="ar">' + (s.endedAt ? 'جلسة منتهية' : 'جلسة جارية') + ' · ' + fmtDate(s.startedAt) + ' · المدة ' + fmtDur(end - s.startedAt) + '</p>';
    html += '<h3 dir="rtl">الجهاز والموقع</h3><div class="rp-grid"><div class="rp-card" dir="rtl"><dl>' +
      rpDl('الاسم', s.name) + rpDl('الجهاز', deviceLabel(d)) + rpDl('النظام', (d.os || '') + (d.osVersion ? ' ' + d.osVersion : '')) + rpDl('المتصفح', (d.browser || '') + (d.browserVersion ? ' ' + d.browserVersion : '')) +
      rpDl('الشاشة', d.screen) + rpDl('اللغة', d.lang) + rpDl('المنطقة الزمنية', d.tz) + '</dl></div>' +
      '<div class="rp-card" dir="rtl"><dl>' + rpDl('عنوان IP', n.ip || netState) + rpDl('المدينة', place || netState) + (n.cityApprox ? rpDl('ملاحظة', 'المدينة مأخوذة من المنطقة الزمنية') : '') + rpDl('مزوّد الخدمة', n.isp) + rpDl('المصدر', n.source) +
      '</dl><p class="lab-note" style="margin-top:8px">المدينة تقريبية وتُستنتج من عنوان IP.</p></div></div>';
    html += '<h3 dir="rtl">النتائج</h3><div class="rp-kpi" dir="rtl"><div><b>' + st.n + '</b><span>أسئلة</span></div><div><b class="' + (st.pct >= 60 ? 'good' : 'bad') + '">' + st.pct + '%</b><span>صحيحة</span></div><div><b>' + (Math.round(st.pts * 10) / 10) + '</b><span>نقاط</span></div><div><b>' + (st.n ? Math.round(st.avg / 1000) : 0) + ' ث</b><span>متوسط الزمن</span></div><div><b>' + st.hints + '</b><span>تلميحات</span></div></div>';
    html += '<div dir="rtl">' + [1, 2, 3, 4].map(function (k) {
      var l = st.lv[k], p = l.n ? Math.round(100 * l.ok / l.n) : 0;
      return '<div class="rp-bar"><span>' + LV[k].ar + ' · ' + LV[k].fr + '</span><i><u style="width:' + p + '%"></u></i><span>' + l.ok + '/' + l.n + (l.n ? ' · ' + p + '%' : '') + '</span></div>';
    }).join('') + '</div>';
    var gm = gameGet();
    html += '<h3 dir="rtl">الشارات والمواظبة</h3><p class="rp-ar">أيام متتالية: ' + streakOf(gm.days, Date.now()) + ' · سلاسل مكتملة: ' + gm.series + '</p><div class="rp-badges" dir="rtl">' +
      BADGES.map(function (b) { return '<span class="rp-badge' + (gm.badges[b.id] ? '' : ' off') + '">' + esc(b.ar) + ' · ' + esc(b.fr) + '</span>'; }).join('') + '</div>';
    if (st.ch.length) {
      st.ch.sort(function (a, b) { return a.ok / a.n - b.ok / b.n; });
      html += '<h3 dir="rtl">حسب الفصل</h3><div class="scroll-x"><table><tr><th>Application</th><th>Chapitre</th><th>Questions</th><th>Réussite</th><th>Temps moyen</th></tr>' +
        st.ch.map(function (c) { var p = Math.round(100 * c.ok / c.n); return '<tr><td>' + esc(c.app === 'maths' ? 'Maths' : 'Physique-Chimie') + '</td><td>' + esc(c.title) + '</td><td>' + c.ok + '/' + c.n + '</td><td class="' + (p >= 60 ? 'good' : 'bad') + '">' + p + ' %</td><td>' + Math.round(c.ms / c.n / 1000) + ' s</td></tr>'; }).join('') + '</table></div>';
      var weak = st.ch.filter(function (c) { return c.n >= 3 && c.ok / c.n < 0.6; });
      html += '<h3 dir="rtl">توصيات</h3>';
      if (weak.length) html += weak.slice(0, 6).map(function (c) { return '<div class="rp-rec" dir="rtl">راجع فصل <a href="#' + esc(c.chap) + '" data-go="' + esc(c.chap) + '">' + esc(c.title) + '</a>: نسبة النجاح ' + Math.round(100 * c.ok / c.n) + '%. ابدأ بالمستوى «سهل» ثم تدرّج.</div>'; }).join('');
      else html += '<div class="rp-rec" dir="rtl">لا توجد فصول ضعيفة ظاهرة. جرّب مستوى «تحدّي» في الفصول التي أتقنتها.</div>';
    }
    var wrong = (s.answers || []).filter(function (a) { return !a.ok; }).slice(-30).reverse();
    if (wrong.length) html += '<h3 dir="rtl">الأسئلة التي أخطأت فيها</h3><div class="rp-wrongs">' + wrong.map(function (a) { return '<div class="rp-wrong"><b>' + esc(a.q) + '</b><br><small>Ta réponse : ' + esc(a.given || '-') + ' · Bonne réponse : ' + esc(a.right) + ' · ' + esc(a.title) + ' · ' + LV[a.d].fr + '</small></div>'; }).join('') + '</div>';
    if (!st.n) html += '<div class="rp-rec" dir="rtl">لم تُجَب أي أسئلة في هذه الجلسة بعد. افتح فصلًا وانتقل إلى «Défis».</div>';
    html += '<div class="rp-wide"><button type="button" class="btn" data-r="print">Imprimer / PDF</button>' + (store.get('lab_dev', false) ? '<button type="button" class="btn ghost" data-r="csv">CSV</button><button type="button" class="btn ghost" data-r="json">JSON</button>' : '') +
      (s.endedAt ? '<button type="button" class="btn ghost" data-r="new">Nouvelle session</button>' : '') + '<button type="button" class="btn ghost" data-r="wipe">Effacer mes données</button><button type="button" class="btn" data-r="close">Fermer</button></div>' +
      (Notify.enabled() ? '<p class="lab-note">Ces données sont enregistrées dans ce navigateur. Un résumé est envoyé à l’enseignant pendant la session et à sa fermeture.<br><span class="rp-ar" dir="rtl" lang="ar">البيانات محفوظة في هذا المتصفح، ويُرسل ملخّص منها إلى الأستاذ أثناء الجلسة وعند إغلاقها.</span></p></div>' : '<p class="lab-note">Ces données sont enregistrées uniquement dans ce navigateur. Pour les transmettre à l’enseignant, utilise PDF ou JSON.<br><span class="rp-ar" dir="rtl" lang="ar">البيانات محفوظة في هذا المتصفح فقط. لإرسالها إلى الأستاذ استعمل PDF أو JSON.</span></p></div>');
    box.innerHTML = html;
    document.body.appendChild(box); box.scrollTop = 0;
    box.addEventListener('click', function (e) {
      var go = e.target.closest && e.target.closest('[data-go]');
      if (go) { e.preventDefault(); box.remove(); var id = go.getAttribute('data-go'); location.hash = '#' + id; return; }
      var b = e.target.closest && e.target.closest('[data-r]'); if (!b) return;
      var a = b.getAttribute('data-r');
      if (a === 'close') box.remove();
      else if (a === 'print') { document.body.classList.add('lab-printing'); document.documentElement.classList.add('lab-printing'); window.addEventListener('afterprint', function () { document.body.classList.remove('lab-printing'); document.documentElement.classList.remove('lab-printing'); }, { once: true }); setTimeout(function () { window.print(); }, 50); }
      else if (a === 'csv' && store.get('lab_dev', false)) download('session-' + s.id + '.csv', toCSV(s), 'text/csv;charset=utf-8');
      else if (a === 'json' && store.get('lab_dev', false)) download('session-' + s.id + '.json', JSON.stringify(s, null, 2), 'application/json');
      else if (a === 'new') { box.remove(); openStart(); }
      else if (a === 'wipe') { if (confirm('Effacer toutes les sessions et la progression de ce navigateur ? · مسح كل الجلسات والتقدّم؟')) { Sess.clearAll(); box.remove(); } }
    });
  }
  Lab.openReport = openReport;
  function csvCell(v) { v = String(v == null ? '' : v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return /[",;\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function toCSV(s) {
    var n = s.net || {}, d = s.device || {};
    var head = ['nom', 'appareil', 'ip', 'ville', 'app', 'chapitre', 'sujet', 'niveau', 'correct', 'points', 'indice', 'duree_ms', 'question', 'reponse', 'bonne_reponse', 'date'];
    var rows = (s.answers || []).map(function (a) {
      return [s.name, deviceLabel(d), n.ip || '', [n.city, n.country].filter(Boolean).join(' '), a.app, a.title, a.topic, LV[a.d].fr, a.ok ? 1 : 0, a.pts, a.hint ? 1 : 0, a.ms, a.q, a.given, a.right, new Date(a.t).toISOString()].map(csvCell).join(',');
    });
    return '﻿' + head.join(',') + '\n' + rows.join('\n');
  }
  function download(name, text, type) {
    var url = URL.createObjectURL(new Blob([text], { type: type })), a = h('a', { href: url, download: name });
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  /* ---------- démarrage ---------- */
  /* ---------- grands écrans (télévision) : échelle, plein écran ---------- */
  var Zoom = {
    auto: function () { var w = window.innerWidth || 0; return w >= 1500 ? Math.min(2.5, Math.max(1, Math.round(w / 1250 * 4) / 4)) : 1; },
    get: function () { var s = store.get('lab_zoom', null); return (s !== null && !isNaN(+s) && +s >= 0.75 && +s <= 3) ? +s : Zoom.auto(); },
    apply: function () {
      var z = Zoom.get(), root = document.documentElement;
      root.style.zoom = z === 1 ? '' : String(z);
      root.style.setProperty('--lab-vh', Math.round((window.innerHeight || 800) / z) + 'px');
      var lb = document.getElementById('lab-zoom-val'); if (lb) lb.textContent = Math.round(z * 100) + '%';
      return z;
    },
    set: function (z) { store.set('lab_zoom', Math.round(Math.min(3, Math.max(0.75, z)) * 100) / 100); Zoom.apply(); },
    reset: function () { try { localStorage.removeItem('lab_zoom'); } catch (_) {} Zoom.apply(); }
  };
  Lab.Zoom = Zoom;
  function fsEl() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
  function fsCan() { var r = document.documentElement; return !!(r.requestFullscreen || r.webkitRequestFullscreen); }
  function fsToggle() {
    try {
      if (fsEl()) { var x = document.exitFullscreen || document.webkitExitFullscreen; var pr = x.call(document); if (pr && pr.catch) pr.catch(function () {}); }
      else { var r = document.documentElement, f = r.requestFullscreen || r.webkitRequestFullscreen, p2 = f.call(r); if (p2 && p2.catch) p2.catch(function () {}); }
    } catch (_) {}
  }
  function tools() {
    if (document.getElementById('lab-tools')) return;
    var box = h('div', { 'class': 'lab-tools lab-noprint', id: 'lab-tools', role: 'group', 'aria-label': 'Affichage' });
    var mk = function (txt, label, fn, id) { var b = h('button', { type: 'button', 'aria-label': label, title: label }, txt); if (id) b.id = id; b.addEventListener('click', fn); box.appendChild(b); return b; };
    mk('A−', 'Réduire la taille', function () { Zoom.set(Zoom.get() - 0.25); });
    mk('100%', 'Taille automatique', function () { Zoom.reset(); }, 'lab-zoom-val');
    mk('A+', 'Agrandir la taille', function () { Zoom.set(Zoom.get() + 0.25); });
    if (fsCan()) mk('⛶', 'Plein écran', fsToggle, 'lab-fs');
    document.body.appendChild(box); Zoom.apply();
  }
  document.addEventListener('keydown', function (e) {
    var tg = e.target && e.target.tagName; if (/INPUT|TEXTAREA|SELECT/.test(tg || '') || e.ctrlKey || e.metaKey || e.altKey) return;
    if ((e.key === 'f' || e.key === 'F') && fsCan()) { e.preventDefault(); fsToggle(); }
  });
  window.addEventListener('resize', function () { Zoom.apply(); });
  Zoom.apply();

  function boot() {
    render(); tools(); Notify.open();
    var skip = false; try { skip = sessionStorage.getItem('lab_skip') === '1'; } catch (_) {}
    if (!Sess.cur() && !skip && CFG.app !== 'portal') openStart(); // l'accueil laisse d'abord choisir la matière
  }
  if (document.readyState === 'complete') setTimeout(boot, 0); else window.addEventListener('load', function () { setTimeout(boot, 0); });

  /* ---------- auto-test (utilisé par les tests) ---------- */
  Lab.selftest = function (draws) {
    var bad = [], total = 0;
    Object.keys(CFG.map).forEach(function (id) {
      var cfg = CFG.map[id];
      [1, 2, 3, 4].forEach(function (d) {
        for (var i = 0; i < (draws || 40); i++) {
          cfg.topics.forEach(function (key) {
            total++;
            var it = null, err = '';
            try { it = norm(CFG.gen(key, d)); } catch (e) { err = String(e); }
            if (!it) bad.push(id + ' ' + key + ' d' + d + ' ' + err);
          });
        }
      });
    });
    return { total: total, bad: bad.slice(0, 20), badCount: bad.length };
  };
})();
