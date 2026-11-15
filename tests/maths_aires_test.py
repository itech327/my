# Maths 1AC : chapitre Périmètres et aires (approfondissement), ajouté pour couvrir le programme officiel.
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
    pg.goto('file://' + os.path.join(ROOT, 'maths.html')); pg.wait_for_timeout(1000)
    pg.get_by_text('1re année', exact=True).first.click(); pg.wait_for_timeout(300)
    check(pg.locator('#chapters').inner_text().count('Périmètres et aires') == 1, 'liste 1AC : chapitre présent une fois')
    pg.goto('file://' + os.path.join(ROOT, 'maths.html') + '#c1-18'); pg.wait_for_timeout(800)
    t = pg.locator('body').inner_text()
    check('Périmètres et aires' in t and 'Approfondissement' in t, 'chapitre ouvert et marqué approfondissement')
    check('Périmètre = 2 × (6 + 4) = 20 cm' in t and '24 cm²' in t, 'rectangle 6 sur 4 : P = 20, A = 24')
    check('Aire = b × h ÷ 2 = 6 × 4 ÷ 2 = 12 cm²' in t, 'triangle 6 sur 4 : A = 12')
    check('25,12 cm²' in t or '50,24 cm²' in t, 'disque r = 4 : valeurs')
    check('محيط' in t and 'مساحة' in t, 'arabe présent')
    check('Un disque a un rayon de 2 cm' in t, 'quiz présent')
    check(not errs, 'aucune erreur JS %s' % errs[:1])
    b.close()
print('FAILS: %d' % fails); sys.exit(1 if fails else 0)
