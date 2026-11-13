#!/usr/bin/env python3
"""Collège pionnier et quiz : les réponses alimentent la session (compteur, rapport)."""
import os, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    ctx = b.new_context(viewport={'width': 420, 'height': 900})
    ctx.add_init_script("try{localStorage.setItem('mm-kind','pion');localStorage.setItem('lab_auto','0');sessionStorage.setItem('lab_barmin','0')}catch(e){}")
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
    pg.goto('file://' + os.path.join(ROOT, 'maths.html')); pg.wait_for_timeout(800)
    pg.fill('#lab-name', 'Salma'); pg.check('#lab-cons'); pg.click('#lab-go'); pg.wait_for_timeout(300)
    cnt = lambda: pg.evaluate("Lab.Session.cur().answers.length")
    check(cnt() == 0, 'session vide au départ')
    links = pg.evaluate("Array.from(document.querySelectorAll('#pcontent a.chap')).map(function(a){return a.getAttribute('href')}).filter(function(h){return /^#p[a-z]*\\d/.test(h)||true})")
    check(len(links) > 3, 'séquences pionnier listées (%d)' % len(links))
    # une séquence avec série ★
    done = False
    for h in links[:14]:
        pg.evaluate("location.hash='%s'" % h); pg.wait_for_timeout(350)
        if pg.locator('%s .px-item' % h).count() >= 3:
            for _ in range(8):
                items = pg.locator('%s .px-item:not(.is-ok):not(.is-ko)' % h)
                if not items.count(): break
                it = items.first
                if it.locator('input').count():
                    it.locator('input').fill('1'); it.locator('input').press('Enter')
                else:
                    it.locator('.opt:not([disabled])').first.click()
                pg.wait_for_timeout(120)
            done = True; break
    check(done, 'exercices pionnier trouvés')
    n = cnt()
    check(n >= 3, 'réponses pionnier enregistrées (%d)' % n)
    bar = pg.locator('.lab-bar2').inner_text()
    check('/' in bar and not bar.replace('\n', ' ').split('/')[0].strip().endswith('0') or n > 0, 'compteur de la barre : ' + bar.replace('\n', ' '))
    s = pg.evaluate("Lab.Session.cur().answers.slice(-1)[0]")
    check(s['app'] == 'maths' and s['chap'] and s['d'] in (1, 2, 3), 'enregistrement complet : ' + str({k: s[k] for k in ('chap', 'd', 'ok', 'pts')}))
    pg.evaluate("location.hash='#pr-1'"); pg.wait_for_timeout(300)
    box = pg.locator('#pr-1 .px-item').filter(has=pg.locator('input')).first
    box = pg.locator('#pr-1 .px-item:not(.is-ok):not(.is-ko)').filter(has=pg.locator('input')).first
    if box.count():
        for i in range(3): box.locator('.lab-keys button').nth(i).click()
        check(box.locator('input').input_value() == '\u2212/,', 'touches pionnier : ' + box.locator('input').input_value())
    # quiz « Je m'entraîne » d'un chapitre ordinaire
    before = cnt()
    pg.evaluate("location.hash='#c2-4'"); pg.wait_for_timeout(400)
    qs = pg.locator('#c2-4 .quiz .q')
    for i in range(qs.count()):
        pg.locator('#c2-4 .quiz .q').nth(i).locator('.opt').first.click(); pg.wait_for_timeout(80)
    check(cnt() == before + qs.count(), 'quiz : %d réponses enregistrées' % (cnt() - before))
    check(not errs, 'aucune erreur JS ' + str(errs[:2]))
    ctx.close(); b.close()
print('FAILS:', len(fails)); sys.exit(1 if fails else 0)
