/* Service worker de « Cours en mouvement » : généré par tools/build.py.
   Pages : réseau d'abord, copie locale en secours (la mise à jour arrive dès qu'il y a du réseau).
   Polices et icônes : copie locale d'abord. Les services externes ne passent jamais par ici. */
var V = 'cem-c34f00c5fa';
var CORE = ["./", "maths", "physique-chimie", "svt", "confidentialite", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "lab/lab.js", "lab/notify-config.js", "fonts/cairo-arabic-400-normal.woff2", "fonts/cairo-arabic-600-normal.woff2", "fonts/cairo-arabic-700-normal.woff2", "fonts/cairo-latin-400-normal.woff2", "fonts/cairo-latin-600-normal.woff2", "fonts/cairo-latin-700-normal.woff2", "fonts/figtree-latin-400-normal.woff2", "fonts/figtree-latin-500-normal.woff2", "fonts/figtree-latin-700-normal.woff2", "fonts/fonts.css", "fonts/lobster-two-latin-700-italic.woff2", "fonts/lobster-two-latin-700-normal.woff2", "fonts/stix-two-text-latin-500-italic.woff2", "fonts/stix-two-text-latin-500-normal.woff2"];
var SCOPE = self.registration.scope;

function key(u) {
  var x = new URL(u, SCOPE); x.search = ''; x.hash = '';
  var p = x.pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
  return x.origin + p;
}

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) {
    return Promise.all(CORE.map(function (u) {
      return fetch(new URL(u, SCOPE).href, { cache: 'reload' }).then(function (r) {
        if (r.ok && !r.redirected) return c.put(key(u), r);
      }).catch(function () {});
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function store(req, r) {
  if (r && r.ok && r.type === 'basic' && !r.redirected) { var c = r.clone(); caches.open(V).then(function (ch) { ch.put(key(req.url), c); }); }
  return r;
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (/^\/teacher(\/|$|\.html)/.test(url.pathname)) return; // données d'élèves : jamais en cache local
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (r) { return store(req, r); }).catch(function () {
      return caches.match(key(req.url)).then(function (r) { return r || caches.match(key(SCOPE)); });
    }));
    return;
  }
  if (/\/(fonts|icons)\//.test(url.pathname)) {
    e.respondWith(caches.match(key(req.url)).then(function (r) { return r || fetch(req).then(function (n) { return store(req, n); }); }));
    return;
  }
  e.respondWith(fetch(req).then(function (r) { return store(req, r); }).catch(function () { return caches.match(key(req.url)); }));
});
