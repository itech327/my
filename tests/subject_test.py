#!/usr/bin/env python3
"""Site de la matière isolée (matiere/site) : chargement, chaque chapitre, interactions, défis, session, hors ligne."""
import sys, os, json
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'matiere', 'site')
SHOTS = os.environ.get('SHOTS')
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
UA = 'Mozilla/5.0 (Linux; Android 13; SM-A536B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    ctx = b.new_context(viewport={'width': 420, 'height': 900}, user_agent=UA)
    ctx.add_init_script("try{localStorage.setItem('lab_auto','0');sessionStorage.setItem('lab_skip','1');sessionStorage.setItem('lab_barmin','0')}catch(e){}")
    pg = ctx.new_page()
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'Failed to load resource' not in m.text else None)
    pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
    pg.goto('file://' + os.path.join(SITE, 'index.html')); pg.wait_for_timeout(700)
    check(not errs, 'aucune erreur au chargement ' + str(errs[:3]))
    check('Technologie en mouvement' in pg.title(), 'titre : ' + pg.title())
    links = pg.evaluate("Array.from(document.querySelectorAll('#chapters a.chap')).map(a=>a.getAttribute('href').slice(1))")
    check(len(links) >= 1, '%d chapitres au sommaire' % len(links))
    st = pg.evaluate('Lab.selftest(30)')
    check(st['badCount'] == 0, 'générateurs valides (%d tirages, %d invalides) %s' % (st['total'], st['badCount'], st['bad'][:3]))
    cfg_ids = pg.evaluate('Object.keys(LAB_CONFIG.map)')
    check(sorted(cfg_ids) == sorted(links), 'chaque chapitre a une configuration de défis : ' + str(set(links) ^ set(cfg_ids)))
    # chaque chapitre : leçons construites, interactions sans erreur
    for cid in links:
        errs.clear()
        pg.evaluate("location.hash='#%s'" % cid); pg.wait_for_timeout(450)
        n = pg.locator('#%s section.lesson' % cid).count()
        check(n >= 3, '%s : %d leçons (dont Défis)' % (cid, n))
        bad = pg.locator('#%s :text("ne s’est pas chargée")' % cid).count()
        check(bad == 0, cid + ' : toutes les animations se chargent')
        empty = pg.evaluate("Array.from(document.querySelectorAll('#%s section.lesson')).filter(s=>!s.querySelector('svg,table,.quiz,.lab-ex,.lab-box,button')).map(s=>s.id)" % cid)
        check(not empty, cid + ' : aucune leçon vide ' + str(empty))
        # interactions : onglets, boutons, curseurs (hors Défis)
        pg.evaluate("""(cid)=>{
          const ls=Array.from(document.querySelectorAll('#'+cid+' section.lesson')).filter(s=>!/Défis/.test(s.querySelector('h3')?.textContent||'')&&!/entraîne/.test(s.querySelector('h3')?.textContent||''));
          ls.forEach(s=>{
            s.querySelectorAll('.seg button').forEach(b=>b.click());
            s.querySelectorAll('input[type=range]').forEach(r=>{ [r.max,r.min,Math.round((+r.max+ +r.min)/2)].forEach(v=>{r.value=v;r.dispatchEvent(new Event('input',{bubbles:true}));}); });
            s.querySelectorAll('button.btn').forEach(b=>{ try{b.click()}catch(e){} });
            s.querySelectorAll('button.opt,button[data-k]').forEach(b=>{ try{b.click()}catch(e){} });
          });
        }""", cid)
        pg.wait_for_timeout(250)
        check(not errs, cid + ' : interactions sans erreur ' + str(errs[:3]))
        if SHOTS:
            os.makedirs(SHOTS, exist_ok=True)
            pg.evaluate("document.querySelector('#%s section.lesson').scrollIntoView()" % cid)
            pg.screenshot(path=os.path.join(SHOTS, cid + '-l1.png'))
    # défis + session sur le premier chapitre
    pg.evaluate("location.hash='#%s'" % links[0]); pg.wait_for_timeout(300)
    pg.evaluate("Lab.openStart && Lab.openStart()") if pg.evaluate("!!(window.Lab&&Lab.openStart)") else None
    if pg.locator('#lab-name').count():
        pg.fill('#lab-name', 'Salma Test'); pg.check('#lab-cons'); pg.click('#lab-go'); pg.wait_for_timeout(300)
        check(pg.locator('.lab-bar2 b').inner_text() == 'Salma Test', 'barre de session')
    cid = links[0]
    tabs = pg.locator('#%s .lab-tab' % cid)
    check(tabs.count() == 6, '6 onglets de défis dans ' + cid)
    for lvl in range(5):
        pg.locator('#%s .lab-tab' % cid).nth(lvl).click()
        pg.locator('#%s .btn:has-text("Lancer la série")' % cid).click()
        for _ in range(12):
            if pg.locator('#%s .lab-done' % cid).count(): break
            o = pg.locator('#%s .lab-opts button:not([disabled])' % cid)
            if o.count(): o.first.click()
            else:
                inp = pg.locator('#%s .lab-ex input[type=text], #%s .lab-ex input:not([type])' % (cid, cid))
                if inp.count(): inp.first.fill('1'); pg.locator('#%s .lab-ex button:has-text("Valider")' % cid).first.click()
            nx = pg.locator('#%s button:has-text("Suivant"), #%s button:has-text("Terminer")' % (cid, cid))
            if nx.count(): nx.first.click()
            pg.wait_for_timeout(60)
    check(pg.evaluate('Lab.Session && Lab.Session.cur() ? Lab.Session.cur().answers.length : 0') > 0, 'des réponses sont enregistrées dans la session')
    # sécurité de base
    check(pg.evaluate("!!document.querySelector('meta[http-equiv=Content-Security-Policy]')"), 'CSP présente')
    ctx.close(); b.close()
print('\n%d échec(s)' % len(fails))
sys.exit(1 if fails else 0)
