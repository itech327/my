"""Smoke test for a pop-up 3D lesson page without network access.

Serves a stand-in three.js (logic only, no rendering) through Playwright
routes, then clicks every mode chip [data-m], sub chip [data-k] and action
button [data-a], and reports page errors and the HUD text after each click.

Usage: python3 smoke_test.py path/to/page.html
"""
import os, sys
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
THREE = open(os.path.join(HERE, 'three-stub.js')).read()
ORBIT = open(os.path.join(HERE, 'orbit-stub.js')).read()
CORS = {'Access-Control-Allow-Origin': '*'}

def main(path):
    url = 'file://' + os.path.abspath(path)
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 400, 'height': 860})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e) + ' ' + (e.stack or '')))
        pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
        pg.route('**/three@0.160.0/build/three.module.js', lambda r: r.fulfill(body=THREE, content_type='application/javascript', headers=CORS))
        pg.route('**/three@0.160.0/examples/jsm/controls/OrbitControls.js', lambda r: r.fulfill(body=ORBIT, content_type='application/javascript', headers=CORS))
        pg.goto(url); pg.wait_for_timeout(800)
        hud = lambda: pg.inner_text('body').replace('\n', ' ')[:300]
        print('start |', hud())
        for m in [e.get_attribute('data-m') for e in pg.query_selector_all('[data-m]')]:
            pg.click(f'[data-m="{m}"]'); pg.wait_for_timeout(200); print(m, '|', hud())
            for k in [e.get_attribute('data-k') for e in pg.query_selector_all('[data-k]')]:
                pg.click(f'[data-k="{k}"]'); pg.wait_for_timeout(120); print('  ', k, '|', hud())
            for _ in range(6):
                a = pg.query_selector_all('[data-a]')
                if not a: break
                a[-1].click(); pg.wait_for_timeout(400); print('   act |', hud())
        print('frames rendered:', pg.evaluate('window.__frames'))
        print('ERRORS:', errs or 'none')
        sys.exit(1 if errs else 0)

if __name__ == '__main__':
    main(sys.argv[1])
