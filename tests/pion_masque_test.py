# Le parcours pionnier est masqué : seul le collège ordinaire apparaît. ?pion=1 le montre pour relecture.
import os, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = 0
def check(c, m):
    global fails
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails += 1
with sync_playwright() as p:
    b = p.chromium.launch()
    for f in ['maths.html', 'physique-chimie.html']:
        # visiteur ayant un ancien choix « pionnier » enregistré
        ctx = b.new_context(); errs = []
        ctx.add_init_script("try{localStorage.setItem('mm-kind','pion');localStorage.setItem('pc-save',JSON.stringify({kind:'pion',plv:1}));localStorage.setItem('lab_auto','0');localStorage.setItem('lab_wel',String(Date.now()));sessionStorage.setItem('lab_skip','1')}catch(e){}")
        pg = ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto('file://' + os.path.join(ROOT, f)); pg.wait_for_timeout(700)
        vis = lambda sel: pg.locator(sel).first.is_visible()
        check(not vis('#kinds'), f + ' : choix du type de collège masqué')
        check(not vis('#kindhint'), f + ' : invite de choix masquée')
        check(vis('#ord') and not vis('#pion'), f + ' : collège ordinaire affiché, pionnier absent, même avec un ancien choix pionnier')
        check(pg.locator('#ord > .kicker').first.inner_text().startswith('1 ·'), f + ' : numérotation corrigée')
        check(pg.locator('#levels button').count() == 3, f + ' : trois niveaux ordinaires')
        check('pionnier' not in pg.locator('header').first.inner_text().lower(), f + ' : texte d’accueil sans pionnier')
        check(not errs, f + ' : sans erreur JS %s' % errs[:1])
        # relecture
        pg.goto('file://' + os.path.join(ROOT, f) + '?pion=1'); pg.wait_for_timeout(700)
        check(pg.locator('#kinds').first.is_visible(), f + ' : ?pion=1 rend le choix visible')
        ctx.close()
    b.close()
print('FAILS: %d' % fails); sys.exit(1 if fails else 0)
