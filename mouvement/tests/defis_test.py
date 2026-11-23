#!/usr/bin/env python3
"""Défis et énigme du jour sur maths, pc et svt (dist/) : générateurs valides, aucune erreur, carte élève -> envoi.
python3 mouvement/tests/defis_test.py"""
import functools, http.server, json, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
DIST = Path(__file__).resolve().parent.parent / 'dist'
FAILS = []
def check(ok, msg):
    print(('ok   ' if ok else 'FAIL ') + msg, flush=True)
    if not ok: FAILS.append(msg)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
h = functools.partial(Q, directory=str(DIST))
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8893), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch()
    for s in ('maths', 'pc', 'svt'):
        for vp in ({'width': 390, 'height': 844}, {'width': 1366, 'height': 768}):
            posts, errs = [], []
            pg = b.new_page(viewport=vp)
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.on('console', lambda m: m.type == 'error' and 'ERR_TUNNEL' not in m.text and 'Failed to load resource' not in m.text and errs.append(m.text))
            pg.route('https://relay.taalim.men/**', lambda r: (posts.append(r.request.post_data), r.fulfill(status=200, body='ok', headers={'Access-Control-Allow-Origin': '*'})))
            pg.route('https://static.cloudflareinsights.com/**', lambda r: r.fulfill(status=200, body=''))
            pg.route('https://challenges.cloudflare.com/**', lambda r: r.fulfill(status=200, content_type='text/javascript', body=''))
            pg.add_init_script("localStorage.setItem('mv_eleve', JSON.stringify({name:'Test',cls:'2APIC1',consent:true}))")
            tag = '%s %dpx' % (s, vp['width'])
            pg.goto('http://127.0.0.1:8893/%s/defis/' % s); pg.wait_for_timeout(1200)
            n = pg.locator('.defi-head').count()
            check(n >= 5, '%s : %d chapitres' % (tag, n))
            st = pg.evaluate('Lab.selftest(2)')
            check(st['badCount'] == 0 and st['total'] > 100, '%s : générateurs %d tirages, %d invalides' % (tag, st['total'], st['badCount']))
            check(pg.locator('.lab-bar2').count() == 0, '%s : pas de barre de session' % tag)
            pg.locator('.defi-head').first.click(); pg.wait_for_timeout(200)
            pg.get_by_role('button', name='Lancer la série').click(); pg.wait_for_timeout(200)
            for _ in range(10):
                inp = pg.locator('.lab-box input[inputmode]:not([disabled])')
                opt = pg.locator('.lab-box .lab-q button:not([disabled])').filter(has_not_text='Indice')
                if inp.count(): inp.last.fill('1'); inp.last.press('Enter')
                elif opt.count(): opt.first.click()
                pg.wait_for_timeout(150)
                for t in ('Suivant', 'Voir le résultat'):
                    bt = pg.locator('.lab-box button', has_text=t)
                    if bt.count(): bt.last.click(); pg.wait_for_timeout(120)
            pg.wait_for_timeout(600)
            types = [json.loads(x).get('type') for x in posts if x]
            check('login' in types and 'series' in types, '%s : envoi au relais %s' % (tag, types))
            right = pg.evaluate("(()=>{const r=[...document.querySelectorAll('body *')].reduce((m,e)=>Math.max(m,e.getBoundingClientRect().right),0);return r<=innerWidth+1})()")
            check(right, '%s : rien ne dépasse à droite' % tag)
            pg.goto('http://127.0.0.1:8893/%s/' % s); pg.wait_for_timeout(500)
            check(pg.locator('#enigme .enigme').count() == 1, '%s : énigme du jour sur l’accueil' % tag)
            check(pg.locator('a[href="defis/"]').count() == 1, '%s : lien vers les défis' % tag)
            pg.locator('#enigme .opts .btn').first.click()
            check(pg.locator('#enigme .opts .btn.ok').count() == 1, '%s : l’énigme montre la bonne réponse' % tag)
            check(not errs, '%s : aucune erreur %s' % (tag, errs[:2]))
            pg.close()
    b.close()
srv.shutdown()
print('FAILS:', len(FAILS))
