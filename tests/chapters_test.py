#!/usr/bin/env python3
"""Ouvre chaque chapitre de chaque application : aucune erreur, aucune leçon cassée."""
import sys, os
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
bad = []
with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    for f in ['maths.html', 'physique-chimie.html', 'svt.html']:
        pg = b.new_page(viewport={'width': 420, 'height': 900})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
        pg.goto('file://' + os.path.join(ROOT, f)); pg.wait_for_timeout(500)
        pg.evaluate("sessionStorage.setItem('lab_skip','1')")
        ids = pg.evaluate("Array.from(document.querySelectorAll('section.chapter.view, main.chapter.view')).map(e=>e.id)")
        n = 0
        for i in ids:
            pg.evaluate("location.hash='#%s'" % i); pg.wait_for_timeout(120)
            broken = pg.evaluate("document.getElementById('%s').innerText.includes('ne s’est pas chargée')" % i)
            nl = pg.evaluate("document.getElementById('%s').querySelectorAll('.lesson').length" % i)
            if broken or nl == 0: bad.append((f, i, 'broken' if broken else 'no lessons'))
            n += 1
        print(f, n, 'chapitres', 'erreurs JS:', errs[:3])
        if errs: bad.append((f, 'js', errs[0]))
        pg.close()
    b.close()
print('BAD:', bad)
sys.exit(1 if bad else 0)
