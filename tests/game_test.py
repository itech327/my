#!/usr/bin/env python3
"""Jours de suite et badges : calculs, données altérées, affichage après une série."""
import os, sys, json, datetime
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
D = 864e5
t0 = int(datetime.datetime(2026, 3, 10, 15, 0).timestamp() * 1000)

with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    ctx = b.new_context(viewport={'width': 420, 'height': 900})
    ctx.add_init_script("try{sessionStorage.setItem('lab_barmin','0');sessionStorage.setItem('lab_skip','1')}catch(e){}")
    ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith('file:') else r.abort())
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + ROOT + '/maths.html'); pg.wait_for_timeout(500)
    ev = lambda js: pg.evaluate(js)
    r = ev("Lab.Game.record({pct:100,d:2}, %d)" % t0)
    ids = [x['id'] for x in r['fresh']]
    check(r['streak'] == 1 and 'first' in ids and 'perfect' in ids, 'première série : streak 1, badges first et perfect %s' % ids)
    r = ev("Lab.Game.record({pct:40,d:1}, %d)" % (t0 + D)); check(r['streak'] == 2 and not r['fresh'], 'jour 2 : streak 2')
    r = ev("Lab.Game.record({pct:70,d:1}, %d)" % (t0 + 2 * D)); check(r['streak'] == 3 and [x['id'] for x in r['fresh']] == ['streak3'], 'jour 3 : badge 3 jours')
    check(ev("Lab.Game.streak(%d)" % (t0 + 3 * D)) == 3, 'la série survit jusqu’au lendemain sans activité')
    check(ev("Lab.Game.streak(%d)" % (t0 + 4 * D)) == 0, 'deux jours sans activité : série à 0')
    r = ev("Lab.Game.record({pct:80,d:4}, %d)" % (t0 + 5 * D)); ids = [x['id'] for x in r['fresh']]
    check(r['streak'] == 1 and ids == ['defi'], 'après une pause : streak 1, badge défi %s' % ids)
    for i in range(6, 11): r = ev("Lab.Game.record({pct:50,d:1}, %d)" % (t0 + i * D))
    check(ev("Lab.Game.get().series") == 9, '9 séries comptées')
    r = ev("Lab.Game.record({pct:50,d:1}, %d)" % (t0 + 11 * D)); ids = [x['id'] for x in r['fresh']]
    check(sorted(ids) == ['streak7', 'ten'] and r['streak'] == 7, 'dixième série : badges 10 séries et 7 jours %s streak %s' % (ids, r['streak']))
    # même jour : pas de double comptage de jour
    n = len(ev("Lab.Game.get().days")); ev("Lab.Game.record({pct:50,d:1}, %d)" % (t0 + 11 * D + 3600000)); check(len(ev("Lab.Game.get().days")) == n, 'même jour : un seul jour compté')
    # données altérées
    ev("localStorage.setItem('lab_game', JSON.stringify({series:'<b>',perfect:-5,defi:1e99,days:['x','2026-01-01','<img>'],badges:{first:'abc',hacker:1,ten:5}}))")
    g = ev("Lab.Game.get()")
    check(g['series'] == 0 and g['perfect'] == 0 and g['days'] == ['2026-01-01'] and g['badges'] == {'ten': 5}, 'données altérées nettoyées %s' % json.dumps(g)[:120])
    ev("localStorage.removeItem('lab_game')")
    # série réelle dans l'interface
    chap = 'c1-2'
    pg.evaluate("location.hash='#%s'" % chap); pg.wait_for_timeout(500)
    pg.locator('#%s .lab-tab' % chap).nth(1).click()
    pg.locator('#%s .btn:has-text("Lancer la série")' % chap).click()
    for _ in range(14):
        if pg.locator('#%s .lab-sum' % chap).count(): break
        if pg.locator('#%s .lab-q .lab-row input' % chap).count():
            pg.locator('#%s .lab-q .lab-row input' % chap).fill('1'); pg.keyboard.press('Enter')
        elif pg.locator('#%s .lab-q .lab-opt:not([disabled])' % chap).count():
            pg.locator('#%s .lab-q .lab-opt:not([disabled])' % chap).first.click()
        nb = pg.locator('#%s .lab-q .btn:has-text("suivant"), #%s .lab-q .btn:has-text("résultat")' % (chap, chap))
        if nb.count(): nb.first.click()
    txt = pg.inner_text('#%s .lab-sum' % chap)
    check('1 jour' in txt and 'Badge : Première série' in txt, 'résumé de série : jours de suite et badge')
    pg.evaluate("Lab.openStart()"); pg.fill('#lab-name', 'Salma'); pg.check('#lab-cons'); pg.click('#lab-go'); pg.wait_for_timeout(300)
    pg.evaluate("Lab.openReport(Lab.Session.cur())"); pg.wait_for_timeout(300)
    rp = pg.inner_text('#lab-report')
    check('الشارات والمواظبة' in rp and 'Première série' in rp and pg.locator('#lab-report .rp-badge').count() == 7 and pg.locator('#lab-report .rp-badge.off').count() == 6, 'rapport : 7 badges dont 1 obtenu')
    pg.evaluate("Lab.Session.clearAll()"); check(ev("localStorage.getItem('lab_game')") is None, 'effacer les données efface aussi les badges')
    check(not errs, 'aucune erreur JS %s' % errs[:2])
    b.close()
print('FAILS: %d' % len(fails)); sys.exit(1 if fails else 0)
