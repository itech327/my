#!/usr/bin/env python3
"""Code de classe côté élève et page enseignant (API simulée)."""
import os, sys, json, threading, functools, http.server, socketserver
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)

class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        p = self.path.split('?')[0]
        if p not in ('/',) and '.' not in os.path.basename(p) and os.path.exists(ROOT + p + '.html'): self.path = p + '.html' + ('?' + self.path.split('?', 1)[1] if '?' in self.path else '')
        return super().do_GET()
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(H, directory=ROOT))
BASE = 'http://127.0.0.1:%d' % srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
RELAY = 'https://taalim-relay.abderrahim-habz.workers.dev/'

with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')

    # ---- élève : code de classe ----
    ctx = b.new_context(viewport={'width': 420, 'height': 900}, service_workers='block')
    ctx.add_init_script("Object.defineProperty(window,'LAB_NOTIFY_URL',{get:()=>'%s',set:()=>{}})" % RELAY)
    ctx.add_init_script("try{sessionStorage.setItem('lab_barmin','0');sessionStorage.setItem('lab_skip','1')}catch(e){}")
    got = []
    def route(r):
        u = r.request.url
        if u.startswith(RELAY):
            try: got.append(json.loads(r.request.post_data))
            except Exception: pass
            r.fulfill(status=200, body='ok')
        elif u.startswith(BASE): r.continue_()
        else: r.abort()
    ctx.route('**/*', route)
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(BASE + '/maths.html?c=ab-12'); pg.wait_for_timeout(600)
    pg.evaluate("Lab.openStart()"); pg.wait_for_timeout(200)
    check(pg.input_value('#lab-cls') == 'AB12', 'le lien ?c= préremplit le code (normalisé)')
    pg.fill('#lab-name', 'Salma'); pg.check('#lab-cons'); pg.click('#lab-go'); pg.wait_for_timeout(1500)
    lg = [x for x in got if x.get('type') == 'login']
    check(lg and lg[0].get('cls') == 'AB12', 'alerte de connexion avec cls=AB12')
    s = pg.evaluate("Lab.Session.cur()"); check(s and s['cls'] == 'AB12', 'cls dans la session')
    pg.evaluate("Lab.Session.end()"); pg.wait_for_timeout(300)
    pg.evaluate("Lab.openStart()"); pg.wait_for_timeout(200)
    pg.fill('#lab-cls', 'x'); pg.fill('#lab-name', 'Omar'); pg.check('#lab-cons'); pg.click('#lab-go'); pg.wait_for_timeout(500)
    check(pg.evaluate("Lab.Session.cur().cls") == '', 'code trop court ignoré')
    pg.evaluate("localStorage.setItem('lab_cur', JSON.stringify(Object.assign(Lab.Session.cur(), {cls:'<img src=x>'})))")
    check(pg.evaluate("Lab.Session.cur().cls") == 'IMGSRCX', 'code relu du stockage : nettoyé')
    check(not errs, 'aucune erreur JS %s' % errs[:2])
    ctx.close()

    # ---- enseignant : page avec API simulée ----
    ctx = b.new_context(viewport={'width': 1000, 'height': 800}, service_workers='block')
    state = {'mode': 'ok', 'deleted': None, 'auth': []}
    now = 1_800_000_000_000
    def ev(i, ts, cls, sid, typ, name, data): return {'id': i, 'ts': ts, 'cls': cls, 'sid': sid, 'type': typ, 'app': 'Maths', 'name': name, 'data': data}
    EV = [
      ev(5, now - 60000, 'AB12', 's2', 'series', 'Omar', {'title': 'Thalès', 'd': 2, 'good': 1, 'asked': 5, 'pct': 20, 'pts': 2, 'max': 10}),
      ev(4, now - 120000, 'AB12', 's1', 'end', 'Salma', {'n': 20, 'ok': 16, 'pct': 80, 'pts': 31.5, 'durMs': 600000, 'weak': []}),
      ev(3, now - 180000, 'AB12', 's1', 'series', 'Salma', {'title': 'Thalès', 'd': 2, 'good': 4, 'asked': 5, 'pct': 80, 'pts': 8, 'max': 10}),
      ev(2, now - 200000, 'ZZ99', 's3', 'login', '<img src=x onerror="window.__xss=1">', {'device': 'x'}),
    ]
    def api(r):
        u = r.request.url
        if '/api/teacher/' in u:
            state['auth'].append(r.request.headers.get('authorization'))
            if r.request.headers.get('authorization') != 'Bearer cle-enseignant-123': return r.fulfill(status=401, body='{}')
        if '/api/teacher/events' in u:
            if state['mode'] == '503': return r.fulfill(status=503, body='{}')
            return r.fulfill(status=200, content_type='application/json', body=json.dumps({'now': now, 'classes': [{'cls': 'AB12', 'n': 2}, {'cls': 'ZZ99', 'n': 1}], 'events': EV}))
        if '/api/teacher/delete' in u:
            state['deleted'] = json.loads(r.request.post_data)['sid']; return r.fulfill(status=200, content_type='application/json', body='{"ok":true,"deleted":1}')
        if u.startswith(BASE): return r.continue_()
        r.abort()
    ctx.route('**/*', api)
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('dialog', lambda d: d.accept())
    pg.goto(BASE + '/teacher'); pg.wait_for_timeout(600)
    check(pg.is_visible('#key') and not pg.is_visible('#out') and not state['auth'], 'sans clé : formulaire, aucun appel à l’API')
    pg.fill('#key', 'mauvaise-cle-long'); pg.click('#login button'); pg.wait_for_timeout(600)
    check('Clé incorrecte' in pg.inner_text('#status') and pg.is_visible('#key'), 'mauvaise clé : message et retour au formulaire')
    check(pg.evaluate("sessionStorage.getItem('teacher_key')") is None, 'mauvaise clé : non conservée')
    pg.fill('#key', 'cle-enseignant-123'); pg.click('#login button'); pg.wait_for_timeout(800)
    check(state['auth'][-1] == 'Bearer cle-enseignant-123', 'clé envoyée en Authorization')
    check(pg.evaluate("localStorage.length") == 0, 'clé jamais dans localStorage')
    check(pg.locator('#students tbody tr').count() == 3, 'trois élèves listés')
    txt = pg.inner_text('#students')
    check('Salma' in txt and '80 %' in txt and '16/20' in txt, 'Salma : 16/20, 80 %')
    check('Omar' in txt and '20 %' in txt, 'Omar : 20 % (séries seules)')
    check(pg.evaluate("window.__xss") is None, 'nom piégé : aucun script exécuté')
    check('<img src=x' in txt, 'nom piégé affiché comme texte')
    ch = pg.inner_text('#chapters')
    check('Thalès' in ch and '50 %' in ch and 'Omar' in ch, 'chapitre Thalès : moyenne 50 %, Omar en difficulté')
    check(pg.locator('#cls option').count() == 3, 'liste des classes remplie')
    pg.locator('#students tbody tr', has_text='Omar').locator('button').click(); pg.wait_for_timeout(500)
    check(state['deleted'] == 's2', 'suppression envoyée pour la bonne session')
    check('robots' in pg.evaluate("document.head.innerHTML") and 'noindex' in pg.evaluate("document.head.innerHTML"), 'balise noindex')
    check(not errs, 'aucune erreur JS %s' % errs[:2])
    state['mode'] = '503'; pg.click('#refresh'); pg.wait_for_timeout(500)
    check('pas encore configuré' in pg.inner_text('#status'), 'message clair quand le relais n’est pas configuré')
    pg.click('#logout'); check(pg.is_visible('#key') and pg.evaluate("sessionStorage.getItem('teacher_key')") is None, 'Quitter : clé effacée')
    ctx.close(); b.close()
srv.shutdown()
print('FAILS: %d' % len(fails)); sys.exit(1 if fails else 0)
