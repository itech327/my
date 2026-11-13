#!/usr/bin/env python3
"""Alertes : ouverture, connexion, série, fin, sortie. Relais simulé."""
import os, sys, json
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
URL = 'https://relay.test/'
with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    ctx = b.new_context(viewport={'width': 420, 'height': 900})
    ctx.add_init_script("Object.defineProperty(window,'LAB_NOTIFY_URL',{get:()=>'%s',set:()=>{}})" % URL)
    ctx.add_init_script("try{localStorage.setItem('lab_auto','0')}catch(e){}")
    got = []
    def route(r):
        u = r.request.url
        if u.startswith(URL):
            try: got.append(json.loads(r.request.post_data))
            except Exception: got.append({'bad': r.request.post_data})
            r.fulfill(status=200, body='ok')
        elif u.startswith('http'): r.abort()
        else: r.continue_()
    ctx.route('**/*', route)
    pg = ctx.new_page()
    pg.goto('file://' + ROOT + '/maths.html'); pg.wait_for_timeout(700)
    types = lambda: [g.get('type') for g in got]
    check(types() == ['open'] and 'name' not in got[0], 'ouverture : alerte anonyme')
    check('Une visite anonyme' in pg.locator('.lab-modal').inner_text(), 'modale : mention de la visite anonyme et envoi à l’enseignant')
    pg.fill('#lab-name', 'Salma'); pg.click('#lab-go'); pg.wait_for_timeout(200)
    check(pg.locator('#lab-err').inner_text() != '' and 'login' not in types(), 'sans consentement : refusé, rien envoyé')
    pg.check('#lab-cons'); pg.click('#lab-go'); pg.wait_for_timeout(1500)
    lg = [g for g in got if g.get('type') == 'login']
    check(len(lg) == 1 and lg[0]['name'] == 'Salma' and lg[0]['consent'] is True and lg[0]['device'], 'connexion : nom et appareil')
    pg.evaluate("location.hash='#c1-2'"); pg.wait_for_timeout(400)
    pg.locator('#c1-2 .lab-tab').nth(0).click(); pg.locator('#c1-2 .btn:has-text("Lancer la série")').click()
    for _ in range(14):
        if pg.locator('#c1-2 .lab-sum').count(): break
        if pg.locator('#c1-2 .lab-q .lab-row input').count():
            pg.locator('#c1-2 .lab-q .lab-row input').fill('1'); pg.keyboard.press('Enter')
        elif pg.locator('#c1-2 .lab-q .lab-opt:not([disabled])').count():
            pg.locator('#c1-2 .lab-q .lab-opt:not([disabled])').first.click()
        nb = pg.locator('#c1-2 .lab-q .btn:has-text("suivant"), #c1-2 .lab-q .btn:has-text("résultat")')
        if nb.count(): nb.first.click()
    pg.wait_for_timeout(300)
    se = [g for g in got if g.get('type') == 'series']
    check(len(se) == 1 and se[0]['asked'] == 6 and se[0]['title'] and se[0]['d'] == 1, 'série terminée : une seule alerte avec score')
    pg.once('dialog', lambda d: d.accept())
    pg.locator('.lab-bar2 button:has-text("Terminer")').click(); pg.wait_for_timeout(400)
    en = [g for g in got if g.get('type') == 'end']
    check(len(en) == 1 and en[0]['n'] >= 6 and en[0]['name'] == 'Salma' and len(en[0]['lv']) == 4, 'fin : résultats envoyés')
    # sortie : nouvelle session puis fermeture de la page
    pg.evaluate("document.getElementById('lab-report') && document.getElementById('lab-report').remove()")
    pg.evaluate("Lab.Session.start('Karim', true)"); pg.wait_for_timeout(1200)
    pg.evaluate("Lab.Session.log({app:'maths',chap:'c1-2',title:'Fractions',topic:'fadd',d:1,ok:false,pts:0,hint:false,ms:3000,q:'x',given:'1',right:'2'})")
    n0 = len(got)
    pg.evaluate("window.dispatchEvent(new Event('pagehide'))"); pg.wait_for_timeout(500)
    ex = [g for g in got[n0:] if g.get('type') == 'exit']
    check(len(ex) == 1 and ex[0]['name'] == 'Karim' and ex[0]['n'] == 1, 'sortie : alerte avec résultats')
    pg.evaluate("window.dispatchEvent(new Event('pagehide'))"); pg.wait_for_timeout(300)
    check(len([g for g in got[n0:] if g.get('type') == 'exit']) == 1, 'sortie : pas de doublon sans nouvelle réponse')
    check(not any('bad' in g for g in got), 'toutes les charges utiles sont du JSON valide')
    ctx.close()
    # relais désactivé : aucune requête
    ctx2 = b.new_context(); got2 = []
    ctx2.route('**/*', lambda r: (got2.append(r.request.url), r.abort()) if r.request.url.startswith('http') and 'relay' in r.request.url else (r.abort() if r.request.url.startswith('http') else r.continue_()))
    pg2 = ctx2.new_page(); pg2.goto('file://' + ROOT + '/svt.html'); pg2.wait_for_timeout(600)
    check(not got2 and 'envoyés à mon enseignant' not in pg2.locator('.lab-modal').inner_text(), 'URL vide : aucune alerte et texte de consentement local')
    b.close()
print('FAILS:', len(fails)); sys.exit(1 if fails else 0)
