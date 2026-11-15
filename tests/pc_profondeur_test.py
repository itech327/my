# PC : leçons ajoutées pour couvrir le programme officiel en profondeur (code des couleurs, couches de l'atmosphère, vent, récepteurs, chambre noire, emballages, sécurité routière, centre de gravité).
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
    def go(h):
        pg.goto('file://' + os.path.join(ROOT, 'physique-chimie.html') + h); pg.wait_for_timeout(1200)
        return pg.locator('body').inner_text()
    t = go('#c1-20')
    check('Lire le code des couleurs' in t and 'R = 2,2 kΩ' in t, 'c1-20 : code des couleurs, 22 x 10^2 = 2,2 kΩ')
    check('رمز الألوان' in t and 'rouge, violet, orange' in t, 'c1-20 : arabe et quiz')
    t = go('#c2-2')
    check('Les couches de l’atmosphère' in t and 'D’où vient le vent' in t, 'c2-2 : deux leçons présentes')
    pg.get_by_role('tab', name='Stratosphère').first.click(); pg.wait_for_timeout(200)
    check('couche d’ozone' in pg.locator('body').inner_text(), 'c2-2 : onglet stratosphère parle de l’ozone')
    pg.get_by_role('tab', name='3. Le vent souffle').first.click(); pg.wait_for_timeout(200)
    check('ce déplacement d’air est le vent' in pg.locator('body').inner_text(), 'c2-2 : étape 3 du vent')
    t = go('#c2-8')
    check('Les récepteurs de lumière' in t and 'مستقبل' in t, 'c2-8 : récepteurs, arabe')
    t = go('#c2-10')
    check('La chambre noire' in t and 'Hauteur de l’image : 3,3 cm' in t, 'c2-10 : chambre noire, image 3,3 cm')
    t = go('#c3-1')
    check('Familles de matériaux et choix d’un emballage' in t and 'تغليف' in t, 'c3-1 : emballages, arabe')
    t = go('#c3-9')
    check('Vitesse et distance d’arrêt' in t and 'Arrêt : 28 m' in t, 'c3-9 : 50 km/h donne 28 m')
    t = go('#c3-12')
    check('Trouver le centre de gravité' in t, 'c3-12 : leçon présente')
    pg.get_by_role('tab', name='Puis en B').first.click(); pg.wait_for_timeout(200)
    check(pg.locator('svg text', has_text='G').count() >= 1, 'c3-12 : G apparaît à la deuxième suspension')
    t = go('#c2-3')
    check('0,1 nm' in t, 'c2-3 : ordre de grandeur de l’atome')
    check(not errs, 'aucune erreur JS %s' % errs[:1])
    b.close()
print('FAILS: %d' % fails); sys.exit(1 if fails else 0)
