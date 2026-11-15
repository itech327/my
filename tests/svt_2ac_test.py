# SVT 2e année : leçons ajoutées pour couvrir le programme officiel (roches magmatiques ; multiplication végétative, approfondissement).
import os, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = 0
def check(c, m):
    global fails
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails += 1
def page(b, hash_):
    ctx = b.new_context(); errs = []
    ctx.add_init_script("try{localStorage.setItem('lab_auto','0');localStorage.setItem('lab_wel',String(Date.now()));sessionStorage.setItem('lab_skip','1')}catch(e){}")
    pg = ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.join(ROOT, 'svt.html') + hash_); pg.wait_for_timeout(1000)
    return pg, errs
with sync_playwright() as p:
    b = p.chromium.launch()
    pg, errs = page(b, '#s2-1'); t = pg.locator('body').inner_text()
    check('Les roches magmatiques' in t, 's2-1 : leçon roches magmatiques')
    check('صخرة نارية' in t and 'بازلت' in t, 's2-1 : arabe et termes')
    check('leçon 7' in t.lower() and 'La formation des chaînes de montagnes' in t, 's2-1 : numérotation de la leçon Montagnes')
    check(pg.locator('.appro').count() >= 2, 's2-1 : les deux leçons hors programme allégé restent marquées')
    pg.get_by_text('Roches', exact=True).first.click(); pg.wait_for_timeout(300)
    pg.get_by_text('Roche plutonique', exact=True).first.click(); pg.wait_for_timeout(200)
    check('granite' in pg.locator('body').inner_text().lower(), 's2-1 : onglet plutonique affiche le granite')
    check(not errs, 's2-1 : sans erreur JS %s' % errs[:1])
    pg, errs = page(b, '#s2-3'); t = pg.locator('body').inner_text()
    check('La multiplication végétative' in t and 'Approfondissement' in t, 's2-3 : leçon multiplication végétative marquée approfondissement')
    check('تكاثر خضري' in t, 's2-3 : arabe')
    check('Une bouture donne' in t, 's2-3 : quiz ajouté')
    check(not errs, 's2-3 : sans erreur JS %s' % errs[:1])
    b.close()
print('FAILS: %d' % fails); sys.exit(1 if fails else 0)
