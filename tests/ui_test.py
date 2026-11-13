#!/usr/bin/env python3
"""Test de fumée : chargement, générateurs, session, série, rapport."""
import sys, os, json
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
apps = [('maths.html', 'c1-2'), ('physique-chimie.html', 'c3-14'), ('svt.html', 's3-3')]
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    for f, chap in apps:
        ctx = b.new_context(viewport={'width': 420, 'height': 900}, user_agent='Mozilla/5.0 (Linux; Android 13; SM-A536B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36')
        pg = ctx.new_page()
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'fonts.g' not in m.text and 'ERR_' not in m.text and 'Failed to load resource' not in m.text else None)
        pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
        pg.goto('file://' + os.path.join(ROOT, f))
        pg.wait_for_timeout(800)
        check(pg.locator('.lab-modal').count() == 1, f + ': fenêtre de session affichée')
        st = pg.evaluate('Lab.selftest(30)')
        check(st['badCount'] == 0, f + ': générateurs valides (%d tirages, %d invalides) %s' % (st['total'], st['badCount'], st['bad'][:3]))
        # démarrer une session
        pg.fill('#lab-name', 'Salma Test')
        pg.check('#lab-cons')
        pg.click('#lab-go')
        pg.wait_for_timeout(300)
        check(pg.locator('.lab-bar2 b').inner_text() == 'Salma Test', f + ': barre de session')
        # ouvrir un chapitre et lancer une série
        pg.evaluate("location.hash='#%s'" % chap)
        pg.wait_for_timeout(500)
        tabs = pg.locator('#%s .lab-tab' % chap)
        check(tabs.count() == 5, f + ': 5 onglets de niveau dans ' + chap)
        for lvl in range(5):
            pg.locator('#%s .lab-tab' % chap).nth(lvl).click()
            pg.locator('#%s .btn:has-text("Lancer la série")' % chap).click()
            for _ in range(12):
                if pg.locator('#%s .lab-sum' % chap).count(): break
                if pg.locator('#%s .lab-q .lab-row input' % chap).count():
                    pg.locator('#%s .lab-q .lab-row input' % chap).fill('1')
                    pg.keyboard.press('Enter')
                elif pg.locator('#%s .lab-q .lab-opt:not([disabled])' % chap).count():
                    pg.locator('#%s .lab-q .lab-opt:not([disabled])' % chap).first.click()
                nb = pg.locator('#%s .lab-q .btn:has-text("suivant"), #%s .lab-q .btn:has-text("résultat")' % (chap, chap))
                if nb.count(): nb.first.click()
            check(pg.locator('#%s .lab-sum' % chap).count() == 1, f + ': série niveau %d terminée' % (lvl + 1))
        s = pg.evaluate('Lab.Session.cur()')
        check(len(s['answers']) >= 20, f + ': réponses enregistrées (%d)' % len(s['answers']))
        check(s['device']['type'] == 'Téléphone' and s['device']['os'] == 'Android', f + ': appareil détecté ' + json.dumps(s['device'])[:80])
        # rapport
        pg.locator('.lab-bar2 button:has-text("Terminer")').click() if False else None
        pg.once('dialog', lambda d: d.accept())
        pg.locator('.lab-bar2 button:has-text("Terminer")').click()
        pg.wait_for_timeout(400)
        check(pg.locator('#lab-report').count() == 1, f + ': rapport affiché')
        txt = pg.locator('#lab-report').inner_text()
        check('Salma Test' in txt and 'Android' in txt, f + ': nom et appareil dans le rapport')
        check('عنوان IP' in txt and 'المدينة' in txt, f + ': champs IP et ville présents')
        pg.screenshot(path='/tmp/report_%s.png' % f.split('.')[0], full_page=False)
        check(not errs, f + ': aucune erreur JS ' + str(errs[:3]))
        ctx.close()
    b.close()
print('FAILS:', len(fails))
sys.exit(1 if fails else 0)
