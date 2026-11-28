"""Joue une carte de chapitre de bout en bout à partir de ses propres données.
Usage : python3 test/play.py pc-3ac-energie.html [--shots DIR]"""
import sys, json, pathlib, re
from playwright.sync_api import sync_playwright
page_file = pathlib.Path(sys.argv[1]).resolve(); shots = sys.argv[sys.argv.index('--shots') + 1] if '--shots' in sys.argv else None
fails = []
def need(c, msg):
    if not c: fails.append(msg)
with sync_playwright() as p:
    for scheme in ['dark']:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 420, 'height': 900}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.route('**/fonts.*/**', lambda r: r.abort())
        pg.goto(page_file.as_uri()); pg.evaluate('localStorage.clear()'); pg.reload()
        C = pg.evaluate('JSON.parse(JSON.stringify(window.BAB_CHAPTER, (k,v)=>k==="ill"?Object.keys(v):v))')
        for a in C['audio']: need((page_file.parent / a).exists(), 'audio manquant ' + a)
        shot = lambda n: shots and pg.screenshot(path=f'{shots}/{n}.png', full_page=True)
        pg.locator('.door[data-i="1"]').click(); need(pg.locator('#modal.show').count() == 1, 'porte 2 devrait être fermée'); pg.keyboard.press('Escape')
        pg.evaluate("document.getElementById('modal').classList.remove('show')")
        for i, d in enumerate(C['doors']):
            if i: pass
            else: pg.click('.door[data-i="0"]')
            if d.get('key'):
                k = d['key']; pg.click(f'.opt:text-is("{k["o"][(k["a"] + 1) % 3]}")'); need(pg.locator('.hint.show').count() > 0, f'porte {i+1} : mauvais mot de passe sans indice')
                pg.click(f'.opt:text-is("{k["o"][k["a"]]}")'); pg.wait_for_timeout(800)
            shot(f'p{i+1}-hook')
            need(d['hook'][:30] in pg.inner_text('body'), f'porte {i+1} : énigme absente')
            if d.get('chest'):
                need(pg.locator('audio, .player, [data-audio], .listen').count() > 0 or 'Écouter' in pg.inner_text('body'), 'coffre sans lecteur'); break
            pg.click('text=Chercher les 3 fragments')
            for n, f in enumerate(d['frags']):
                card = pg.locator('.card').first
                if f['t'] == 'vf':
                    for it in f['items']:
                        row = pg.locator('.vf:not(.ok)').first; row.locator(f'button:text-is("{"Faux" if it["v"] else "Vrai"}")').click()
                        need(pg.locator('.hint.show').count() > 0, f'p{i+1} vf sans indice'); row.locator(f'button:text-is("{"Vrai" if it["v"] else "Faux"}")').click()
                elif f['t'] == 'qcm':
                    pg.click(f'.opt:text-is("{f["o"][(f["a"] + 1) % len(f["o"])]}")'); need(pg.locator('.hint.show').count() > 0, f'p{i+1} qcm sans indice')
                    pg.click(f'.opt:text-is("{f["o"][f["a"]]}")')
                elif f['t'] == 'order':
                    for s in f['items']: pg.click(f'.chips .chip:text-is("{s}")')
                elif f['t'] == 'sort':
                    for name, k in f['items']:
                        pg.click(f'.chips .chip:text-is("{name}")'); pg.locator('.bin').nth(k).click()
                elif f['t'] == 'num':
                    pg.fill('input.num', str(f['ans'] * 10 + 1)); pg.click('text=Vérifier'); need(pg.locator('.hint.show').count() > 0, f'p{i+1} num faux accepté')
                    pg.fill('input.num', str(f['ans']).replace('.', ',')); pg.click('text=Vérifier')
                need(pg.locator('.gain.show').count() == 1, f'porte {i+1} fragment {n+1} non gagné ({f["t"]})')
                shot(f'p{i+1}-f{n+1}')
                pg.click('text=Fragment suivant' if n < 2 else 'text=Assembler les fragments')
            need(d['reveal'][:30] in pg.inner_text('body'), f'porte {i+1} : révélation absente'); shot(f'p{i+1}-reveal')
            pg.click('text=Ouvrir le coffre' if C['doors'][i + 1].get('chest') else f'text=Vers la porte {i+2}')
        w = pg.evaluate('document.documentElement.scrollWidth'); need(w <= 420, f'débordement horizontal {w}px')
        pg.click('text=Retour à la carte'); pg.click('#bTeacher'); pg.click('#bShift'); t = pg.inner_text('#teacher'); shot('prof')
        exp = any(n >= C.get('alertMin', 3) for n in C['sim']['stuck']); need(('Alerte Telegram (classe)' in t) == exp, 'alerte de classe ' + ('absente' if exp else 'inattendue'))
        need(not errs, 'erreurs JS : ' + '; '.join(errs)); b.close()
print('\n'.join(fails) if fails else 'OK : ' + C['id'] + ', 4 portes jouées, indices, coffre, vue professeur, 420 px')
sys.exit(1 if fails else 0)
