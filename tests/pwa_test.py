#!/usr/bin/env python3
"""Application installable : manifeste, icônes, service worker, ouverture hors ligne."""
import os, sys, json, threading, functools, http.server, socketserver
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)

class H(http.server.SimpleHTTPRequestHandler):
    """Imite Cloudflare Pages : /x.html redirige vers /x, /x sert x.html."""
    def log_message(self, *a): pass
    def do_GET(self):
        p = self.path.split('?')[0]
        if p.endswith('.html') and p != '/index.html':
            self.send_response(308); self.send_header('Location', p[:-5]); self.end_headers(); return
        if p not in ('/',) and '.' not in os.path.basename(p) and os.path.exists(ROOT + p + '.html'):
            self.path = p + '.html'
        return super().do_GET()
    def guess_type(self, path):
        if path.endswith('.webmanifest'): return 'application/manifest+json'
        return super().guess_type(path)

socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(H, directory=ROOT))
PORT = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d' % PORT

with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    ctx = b.new_context(viewport={'width': 420, 'height': 900}, service_workers='allow')
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(BASE + '/maths.html'); pg.wait_for_timeout(500)
    m = json.loads(pg.evaluate("fetch('manifest.webmanifest').then(r=>r.text())"))
    check(m.get('display') == 'standalone' and m.get('start_url') and len(m.get('icons', [])) >= 3, 'manifeste : standalone, start_url, icônes')
    ok = pg.evaluate("Promise.all(%s.map(u=>fetch(u).then(r=>r.status)))" % json.dumps([i['src'] for i in m['icons']]))
    check(all(s == 200 for s in ok), 'icônes du manifeste accessibles')
    check(pg.evaluate("!!document.querySelector('link[rel=manifest]') && !!document.querySelector('link[rel=apple-touch-icon]')"), 'balises manifest et apple-touch-icon')
    pg.evaluate("navigator.serviceWorker.ready.then(function(){return 1})"); pg.wait_for_timeout(2500)
    check(pg.evaluate("navigator.serviceWorker.controller !== null || navigator.serviceWorker.getRegistration().then(r=>!!(r&&r.active))") is not False, 'service worker actif')
    names = pg.evaluate("caches.keys()")
    check(len(names) == 1 and names[0].startswith('cem-'), 'un seul cache versionné : %s' % names)
    n = pg.evaluate("caches.open(%s).then(c=>c.keys()).then(k=>k.map(x=>new URL(x.url).pathname))" % json.dumps(names[0] if names else ''))
    need = ['/', '/maths', '/physique-chimie', '/svt', '/confidentialite', '/lab/lab.js', '/fonts/fonts.css']
    check(all(x in n for x in need), 'pré-cache : pages, lab.js et polices (%d entrées)' % len(n))
    # passer hors ligne : nouvelle visite de chaque page
    pg.reload(); pg.wait_for_timeout(1200)   # le SW prend le contrôle
    ctx.set_offline(True)
    for path, title in (('/maths', 'Maths en mouvement'), ('/maths.html', 'Maths en mouvement'), ('/physique-chimie', 'Physique-Chimie'), ('/svt', 'SVT'), ('/', 'Cours en mouvement')):
        try:
            pg.goto(BASE + path, wait_until='domcontentloaded'); pg.wait_for_timeout(500)
            check(title.lower() in pg.title().lower() or title.lower() in pg.evaluate("document.body.innerText.slice(0,400)").lower(), 'hors ligne : %s s’ouvre (%s)' % (path, pg.title()))
        except Exception as e:
            check(False, 'hors ligne : %s ne s’ouvre pas (%s)' % (path, str(e)[:80]))
    pg.goto(BASE + '/maths', wait_until='domcontentloaded'); pg.wait_for_timeout(900)
    check(pg.locator('.lab-modal').count() + pg.locator('.lab-bar2').count() >= 1, 'hors ligne : l’application s’initialise')
    check(not errs, 'aucune erreur JS %s' % errs[:2])
    ctx.set_offline(False)
    b.close()
srv.shutdown()
print('FAILS: %d' % len(fails)); sys.exit(1 if fails else 0)
