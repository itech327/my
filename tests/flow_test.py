#!/usr/bin/env python3
"""Fluidité : passage auto, désactivation, touches - et /."""
import os, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
def start(ctx, f, chap, lvl=0):
    pg = ctx.new_page()
    pg.add_init_script("try{sessionStorage.setItem('lab_skip','1')}catch(e){}")
    pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
    pg.goto('file://' + os.path.join(ROOT, f)); pg.wait_for_timeout(600)
    pg.evaluate("sessionStorage.setItem('lab_skip','1')")
    pg.evaluate("location.hash='#%s'" % chap); pg.wait_for_timeout(500)
    pg.locator('#%s .lab-tab' % chap).nth(lvl).click()
    pg.locator('#%s .btn:has-text("Lancer la série")' % chap).click()
    pg.wait_for_timeout(250)
    return pg
with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    ctx = b.new_context(viewport={'width': 420, 'height': 900})
    pg = start(ctx, 'svt.html', 's3-3')
    c = '#s3-3'
    check(pg.locator(c + ' .lab-auto input').is_checked(), 'case Passage auto cochée par défaut')
    # avancer jusqu'à une bonne réponse, puis vérifier le passage automatique
    seen_auto = False
    for _ in range(14):
        if pg.locator(c + ' .lab-sum').count(): break
        before = pg.locator(c + ' .lab-q').first.inner_text()
        it = pg.evaluate("(function(){var i=Lab.current();return {t:i.t,a:i.a}})()")
        if it['t'] == 'num':
            pg.locator(c + ' .lab-q .lab-row input').fill(str(it['a']).replace('.', ','))
            pg.keyboard.press('Enter')
        else:
            pg.locator(c + ' .lab-q .lab-opt:not([disabled])').nth(int(it['a'])).click()
        pg.wait_for_timeout(150)
        ok = pg.locator(c + ' .lab-q.is-ok').count() > 0
        if ok:
            pg.wait_for_timeout(2300)
            after = pg.locator(c + ' .lab-q').first.inner_text() if pg.locator(c + ' .lab-q').count() else ''
            seen_auto = pg.locator(c + ' .lab-sum').count() > 0 or after != before
            break
        nb = pg.locator(c + ' .lab-q .btn:has-text("uivante"), ' + c + ' .lab-q .btn:has-text("ésultat")')
        if nb.count(): nb.first.click()
    check(seen_auto, 'bonne réponse : passage automatique à la suite')
    # désactiver mémorise
    if pg.locator(c + ' .lab-auto input').count():
        pg.locator(c + ' .lab-auto input').uncheck()
    check(pg.evaluate("String(JSON.parse(localStorage.getItem('lab_auto')))") == '0', 'désactivation mémorisée')
    pg.close()
    # touches - et / sur un champ numérique
    pg = start(ctx, 'maths.html', 'c2-2', 0)
    inp = pg.locator('#c2-2 .lab-q .lab-row input')
    if inp.count():
        pg.locator('#c2-2 .lab-keys button').nth(0).click(); pg.locator('#c2-2 .lab-keys button').nth(1).click()
        check(inp.input_value() == '−/', 'touches - et / : ' + inp.input_value())
    else:
        print('SKIP touches : question QCM')
    # barre de session réductible
    small = pg.locator('.lab-bar2').bounding_box()['width']
    check(small < 200 and pg.evaluate("getComputedStyle(document.body).paddingBottom") == '96px', 'barre réduite par défaut : %d px, marge basse 96px' % small)
    pg.locator('.lab-bar2 [data-a=tog]').click(); pg.wait_for_timeout(100)
    check(pg.locator('.lab-bar2').bounding_box()['width'] > small + 100, 'barre agrandie au toucher')
    ctx.close(); b.close()
print('FAILS:', len(fails))
sys.exit(1 if fails else 0)
