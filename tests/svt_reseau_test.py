# SVT 1re année, chapitre s1-4 : leçon « Les réseaux alimentaires » (programme officiel : chaînes et réseaux alimentaires).
import os, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = 0
def check(c, m):
    global fails
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails += 1
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(); errs = []
    ctx.add_init_script("try{localStorage.setItem('lab_auto','0');localStorage.setItem('lab_wel',String(Date.now()));sessionStorage.setItem('lab_skip','1')}catch(e){}")
    pg = ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.join(ROOT, 'svt.html') + '#s1-4'); pg.wait_for_timeout(1000)
    body = pg.locator('body').inner_text()
    check('Chaînes, réseaux alimentaires et équilibres naturels' in body, 'titre du chapitre mis à jour')
    check('Les réseaux alimentaires' in body, 'leçon réseaux présente')
    check('شبكة غذائية' in body, 'termes arabes de la leçon')
    check('Un réseau alimentaire est' in body, 'question de quiz ajoutée')
    pg.get_by_text('Réseau', exact=True).first.click(); pg.wait_for_timeout(400)
    steps = 1
    for _ in range(4):
        pg.get_by_role('button', name='Étape suivante').nth(1).click(); pg.wait_for_timeout(120); steps += 1
    cap = pg.locator('.px-cap').nth(1).inner_text()
    check('réseau alimentaire' in cap and 'Étape 5 / 5' in cap, 'cinq étapes, la dernière nomme le réseau')
    check(not errs, 'sans erreur JS %s' % errs[:1])
    b.close()
print('FAILS: %d' % fails); sys.exit(1 if fails else 0)
