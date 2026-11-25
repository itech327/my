"""Smoke test for a pop-up 3D lesson page without network access.

Serves a stand-in three.js (logic only, no rendering) through Playwright
routes, then clicks every mode chip [data-m], sub chip [data-k] and action
button [data-a], and reports page errors and the HUD text after each click.

Geometry kernel: when the page exposes window.__lesson.invariants(), it is called after
every click and at six positions of the slider (window.__lesson.slider()). It returns
[[name, ok, detail], ...] computed from the geometry the frame actually drew (S.geo),
not from the formulas, so a drawing that drifts from the mathematics fails the test.

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
        bad = []; checks = [0]
        def inv(tag):
            r = pg.evaluate('window.__lesson && window.__lesson.invariants ? window.__lesson.invariants() : null')
            if r is None: return
            for name, ok, detail in r:
                checks[0] += 1
                if not ok: bad.append(f'{tag}: {name} ({detail})')
        def sweep(tag):
            rng = pg.evaluate('(() => { const s = window.__lesson && window.__lesson.slider && window.__lesson.slider(); return s ? [s.min, s.max] : null; })()')
            if not rng: return
            for i in range(6):
                v = rng[0] + (rng[1] - rng[0]) * i / 5
                pg.evaluate(f'window.__lesson.slider().set({v})'); pg.wait_for_timeout(120); inv(f'{tag} slider={v:g}')
        print('start |', hud())
        for m in [e.get_attribute('data-m') for e in pg.query_selector_all('[data-m]')]:
            pg.click(f'[data-m="{m}"]'); pg.wait_for_timeout(200); print(m, '|', hud()); inv(m); sweep(m)
            for k in [e.get_attribute('data-k') for e in pg.query_selector_all('[data-k]')]:
                pg.click(f'[data-k="{k}"]'); pg.wait_for_timeout(120); print('  ', k, '|', hud()); inv(f'{m}/{k}'); sweep(f'{m}/{k}')
            for _ in range(6):
                a = pg.query_selector_all('[data-a]')
                if not a: break
                a[-1].click(); pg.wait_for_timeout(400); print('   act |', hud()); inv(f'{m} after action')
            for a in [e.get_attribute('data-a') for e in pg.query_selector_all('[data-a]')]:
                if pg.query_selector(f'[data-a="{a}"]'): pg.click(f'[data-a="{a}"]'); pg.wait_for_timeout(2600); inv(f'{m} after {a}')
        print('frames rendered:', pg.evaluate('window.__frames'))
        print(f'geometry kernel: {checks[0]} checks, {len(bad)} failed' if checks[0] else 'geometry kernel: the page exposes no invariants() (required for new lessons)')
        for x in bad[:12]: print('  INVARIANT', x)
        print('ERRORS:', errs or 'none')
        sys.exit(1 if errs or bad else 0)

if __name__ == '__main__':
    main(sys.argv[1])
