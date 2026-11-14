#!/usr/bin/env python3
"""Examen, révision, défi de la semaine, signalement d'erreur."""
import os, sys, json
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
CH = 's3-3'
def page(ctx, f='svt.html'):
    pg = ctx.new_page()
    pg.add_init_script("try{sessionStorage.setItem('lab_skip','1');sessionStorage.setItem('lab_barmin','0');localStorage.setItem('lab_auto','0')}catch(e){}")
    pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.join(ROOT, f)); pg.wait_for_timeout(600)
    return pg, errs
def tab(pg, chap, label):
    pg.locator('#%s .lab-tab:has-text("%s")' % (chap, label)).first.click()
def answer_wrong(pg, root, n):
    """Répond à n questions en cliquant une mauvaise option, sinon une réponse fausse en numérique."""
    for i in range(n):
        pg.wait_for_timeout(80)
        cur = pg.evaluate("Lab.current().a")
        opts = pg.locator(root + ' .lab-opt')
        if opts.count():
            idx = 0 if cur != 0 else 1
            opts.nth(idx).click()
        else:
            pg.locator(root + ' .lab-q input').fill('-98765'); pg.keyboard.press('Enter')
        pg.wait_for_timeout(60)
        nb = pg.locator(root + ' .lab-q.is-ko .btn, ' + root + ' .lab-q.is-ok .btn').last
        nb.click()
def qs(pg, root, n):
    out = []
    for i in range(n):
        pg.wait_for_timeout(60)
        out.append(pg.evaluate("Lab.current().q"))
        opts = pg.locator(root + ' .lab-opt')
        if opts.count(): opts.nth(0).click()
        else:
            pg.locator(root + ' .lab-q input').fill('1'); pg.keyboard.press('Enter')
        pg.wait_for_timeout(40)
        pg.locator(root + ' .lab-q.is-ko .btn, ' + root + ' .lab-q.is-ok .btn').last.click()
    return out

with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    ctx = b.new_context(viewport={'width': 420, 'height': 900})
    # --- semaine ISO
    pg, errs = page(ctx)
    wk = lambda d: pg.evaluate("Lab.weekKey(%d)" % d)
    import datetime
    ms = lambda y, m, d: int(datetime.datetime(y, m, d, 12).timestamp() * 1000)
    check(wk(ms(2026, 1, 1)) == '2026-W01', 'weekKey 1 janvier 2026 : %s' % wk(ms(2026, 1, 1)))
    check(wk(ms(2026, 3, 9)) == wk(ms(2026, 3, 15)) and wk(ms(2026, 3, 15)) != wk(ms(2026, 3, 16)), 'la semaine change le lundi')
    check(wk(ms(2025, 12, 29)) == '2026-W01', 'le 29 décembre 2025 appartient à 2026-W01 : %s' % wk(ms(2025, 12, 29)))
    # --- onglets Examen / Révision
    pg.evaluate("location.hash='#%s'" % CH); pg.wait_for_timeout(500)
    root = '#' + CH
    check(pg.locator(root + ' .lab-tab:has-text("Examen")').count() == 1, 'onglet Examen présent')
    check(pg.locator(root + ' .lab-tab:has-text("Révision")').count() == 0, 'onglet Révision absent sans erreur')
    tab(pg, CH, 'Examen')
    txt = pg.locator(root + ' .lab-note').first.inner_text()
    check('12 minutes' in txt and 'sans indice' in txt, 'texte de l’examen')
    pg.locator(root + ' .btn:has-text("Lancer la série")').click(); pg.wait_for_timeout(250)
    check(pg.locator(root + ' .lab-q .btn:has-text("Indice")').count() == 0, 'examen : aucun indice')
    check(pg.locator(root + ' .lab-timer, ' + root + ' [class*=timer]').count() >= 1, 'examen : minuteur affiché')
    # 10 questions, mauvaises réponses pour remplir le magasin d’erreurs
    answer_wrong(pg, root, 10)
    pg.wait_for_timeout(200)
    prog = json.loads(pg.evaluate("localStorage.getItem('lab_prog')") or '{}')
    check(not any(k.endswith(CH) and set(v.keys()) - set() and any(str(x) in ('1','2','3','4') for x in v.keys()) for k, v in prog.items()), 'l’examen ne valide aucun niveau')
    err = json.loads(pg.evaluate("localStorage.getItem('lab_err')") or '{}')
    key = 'svt|' + CH
    check(key in err and len(err[key]) >= 1, 'erreurs enregistrées par thème : %s' % list(err.get(key, {}).keys()))
    check(all(isinstance(v, list) and 1 <= v[0] <= 5 for v in err.get(key, {}).values()), 'compteurs entre 1 et 5')
    # --- révision
    pg.evaluate("location.hash='#'"); pg.wait_for_timeout(200)
    pg.evaluate("location.hash='#%s'" % CH); pg.wait_for_timeout(500)
    check(pg.locator(root + ' .lab-tab:has-text("Révision")').count() == 1, 'onglet Révision apparaît après des erreurs')
    weak = pg.evaluate("Lab.errTopics('%s')" % CH)
    tab(pg, CH, 'Révision'); pg.locator(root + ' .btn:has-text("Lancer la série")').click(); pg.wait_for_timeout(250)
    keys = []
    for i in range(3):
        keys.append(pg.evaluate("Lab.current().key"))
        pg.locator(root + ' .lab-opt').first.click() if pg.locator(root + ' .lab-opt').count() else (pg.locator(root + ' .lab-q input').fill('1'), pg.keyboard.press('Enter'))
        pg.wait_for_timeout(60)
        pg.locator(root + ' .lab-q.is-ko .btn, ' + root + ' .lab-q.is-ok .btn').last.click(); pg.wait_for_timeout(60)
    check(all(k in weak for k in keys), 'révision : questions tirées des thèmes faibles %s dans %s' % (keys, weak))
    # --- effacement des données
    pg.evaluate("Lab.Session.clearAll()")
    check(pg.evaluate("localStorage.getItem('lab_err')") is None, 'effacer les données retire aussi les erreurs')
    # --- défi de la semaine : mêmes questions à chaque ouverture
    pg2, errs2 = page(ctx)
    pg2.evaluate("document.querySelector('[data-a=week]').click()"); pg2.wait_for_timeout(300)
    check(pg2.locator('.lab-modal:has-text("Défi de la semaine")').count() == 1, 'fenêtre du défi ouverte')
    pg2.locator('.lab-modal .btn:has-text("Lancer la série")').click(); pg2.wait_for_timeout(250)
    check(pg2.locator('.lab-modal .lab-q .btn:has-text("Indice")').count() == 0, 'défi : aucun indice')
    a = qs(pg2, '.lab-modal', 10)
    check(len(a) == 10 and len(set(a)) == 10, 'défi : 10 questions distinctes')
    pg3, _ = page(ctx)
    pg3.evaluate("document.querySelector('[data-a=week]').click()"); pg3.wait_for_timeout(300)
    pg3.locator('.lab-modal .btn:has-text("Lancer la série")').click(); pg3.wait_for_timeout(250)
    c = qs(pg3, '.lab-modal', 10)
    check(a == c, 'défi : mêmes questions pour un autre élève la même semaine')
    check(pg3.evaluate("localStorage.getItem('lab_err')") is None, 'le défi ne touche pas aux erreurs par chapitre')
    # --- signalement
    pg4, errs4 = page(ctx)
    pg4.evaluate("location.hash='#%s'" % CH); pg4.wait_for_timeout(400)
    pg4.evaluate("document.querySelector('[data-a=err]').click()"); pg4.wait_for_timeout(200)
    ta = pg4.locator('#lab-em')
    check(ta.count() == 1 and 'Signalement' in ta.input_value() and 'URL' in ta.input_value(), 'signalement : message prérempli')
    check(pg4.locator('#lab-em2').count() == 0, 'pas de bouton e-mail sans LAB_CONTACT')
    pg4.locator('#lab-ex').click()
    check(pg4.locator('.lab-modal').count() == 0, 'signalement : fermeture')
    for e in (errs, errs2, errs4): check(not e, 'aucune erreur JS %s' % e[:1])
    b.close()
print('\n%d échec(s)' % len(fails))
sys.exit(1 if fails else 0)
