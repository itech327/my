#!/usr/bin/env python3
"""Simule le service IP : le rapport doit afficher IP et ville ; vérifie aussi le repli et le portail."""
import os, sys, json
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    # 1) service disponible
    ctx = b.new_context(viewport={'width': 420, 'height': 900})
    ctx.add_init_script("Object.defineProperty(window,'LAB_NOTIFY_URL',{get:()=>'',set:()=>{}})")
    pg = ctx.new_page()
    def route(r):
        u = r.request.url
        if 'ipwho.is' in u: r.fulfill(status=200, content_type='application/json', body=json.dumps({'success': True, 'ip': '203.0.113.7', 'city': 'Rabat', 'region': 'Rabat-Salé-Kénitra', 'country': 'Morocco', 'connection': {'isp': 'TestNet'}}))
        elif u.startswith('http'): r.abort()
        else: r.continue_()
    pg.route('**/*', route)
    pg.goto('file://' + ROOT + '/index.html'); pg.wait_for_timeout(500)
    check(pg.locator('.lab-modal').count() == 0 and 'Merci de ta visite' in pg.inner_text('body'), 'portail : accueil sans fenêtre, avec remerciement')
    pg.click('#go-start'); pg.wait_for_timeout(200)
    check(pg.locator('.lab-modal').count() == 1, 'portail : le bouton ouvre la fenêtre de session')
    pg.fill('#lab-name', 'Youssef'); pg.check('#lab-cons'); pg.click('#lab-go'); pg.wait_for_timeout(800)
    pg.click('#go-report'); pg.wait_for_timeout(300)
    t = pg.locator('#lab-report').inner_text()
    check('203.0.113.7' in t and 'Rabat' in t and 'TestNet' in t, 'rapport : IP, ville et fournisseur affichés')
    # sans consentement
    pg.evaluate("Lab.Session.end()"); pg.reload(); pg.wait_for_timeout(400)
    pg.click('#go-start'); pg.wait_for_timeout(200)
    pg.fill('#lab-name', 'Sans Accord'); pg.click('#lab-go'); pg.wait_for_timeout(500)
    pg.click('#go-report'); pg.wait_for_timeout(200)
    t = pg.locator('#lab-report').inner_text()
    check('203.0.113.7' not in t and 'لم يوافق' in t, 'sans consentement : aucune IP collectée')
    # CSV (réservé à l'enseignant : drapeau lab_dev)
    pg.evaluate("localStorage.setItem('lab_dev','true')"); pg.evaluate("Lab.openReport(Lab.Session.cur())"); pg.wait_for_timeout(200)
    with pg.expect_download() as d:
        pg.click('[data-r="csv"]')
    check(d.value.suggested_filename.endswith('.csv'), 'export CSV')
    ctx.close()
    b.close()
print('FAILS:', len(fails)); sys.exit(1 if fails else 0)
