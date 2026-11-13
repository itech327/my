#!/usr/bin/env python3
"""Tous les écrans : téléphone, tablette, portable, télévision. Pas de débordement, scène visible, glisser OK."""
import os, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCREENS = [('phone', 390, 844, 3, True), ('phone-land', 844, 390, 3, True), ('tablet', 768, 1024, 2, True), ('laptop', 1366, 768, 1, False),
           ('tv1080', 1920, 1080, 1, False), ('tv540', 960, 540, 2, False), ('tv4k', 3840, 2160, 1, False)]
PAGES = [('maths.html', 'c2-9-l1'), ('maths.html', 'c2-17-l3'), ('physique-chimie.html', 'c3-1-l1'), ('svt.html', 's3-1-l1'), ('index.html', '')]
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
shots = os.environ.get('SHOTS')
with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    for name, w, h, dpr, touch in SCREENS:
        ctx = b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1, has_touch=touch, is_mobile=touch)
        ctx.add_init_script("try{sessionStorage.setItem('lab_skip','1')}catch(e){}")
        for f, hash_ in PAGES:
            pg = ctx.new_page(); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
            pg.goto('file://' + os.path.join(ROOT, f) + ('#' + hash_ if hash_ else '')); pg.wait_for_timeout(600)
            m = pg.evaluate("(function(){var d=document.documentElement;var st=document.querySelector('.stage svg');var r=st?st.getBoundingClientRect():null;var z=parseFloat(d.style.zoom||'1');return {sw:d.scrollWidth,cw:d.clientWidth,z:z,stageH:r?r.height:0,stageW:r?r.width:0,vh:window.innerHeight,tools:!!document.getElementById('lab-tools')&&getComputedStyle(document.getElementById('lab-tools')).display!=='none'}})()")
            tag = '%s %s' % (name, f)
            check(m['sw'] <= m['cw'] + 1, tag + ' pas de défilement horizontal (%d/%d)' % (m['sw'], m['cw']))
            check(not errs, tag + ' aucune erreur JS ' + str(errs[:1]))
            if hash_:
                check(m['stageH'] * m['z'] <= m['vh'] + 2 or m['stageH'] < 270, tag + ' scène tient dans la hauteur (%d x%.2f / %d)' % (m['stageH'], m['z'], m['vh']))
            if w >= 1500: check(m['z'] > 1, tag + ' échelle automatique x%.2f' % m['z'])
            if w < 700: check(m['z'] == 1 and not m['tools'], tag + ' pas d’outils TV sur téléphone')
            if w >= 700: check(m['tools'], tag + ' outils d’affichage visibles')
            if shots and f == 'maths.html' and hash_ == 'c2-9-l1': pg.screenshot(path='/tmp/p/screen_%s.png' % name)
            pg.close()
        ctx.close()
    # glisser un sommet avec l'échelle active
    ctx = b.new_context(viewport={'width': 1920, 'height': 1080}); ctx.add_init_script("try{sessionStorage.setItem('lab_skip','1')}catch(e){}")
    pg = ctx.new_page(); pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
    pg.goto('file://' + os.path.join(ROOT, 'maths.html#c2-9-l4')); pg.wait_for_timeout(700)
    hd = pg.locator('#c2-9-l4 svg .hd').first; hd.scroll_into_view_if_needed(); pg.wait_for_timeout(200)
    bb = hd.bounding_box(); cx, cy = bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2
    pg.mouse.move(cx, cy); pg.mouse.down(); pg.mouse.move(cx + 90, cy + 40, steps=6); pg.mouse.up(); pg.wait_for_timeout(150)
    bb2 = hd.bounding_box(); dx, dy = (bb2['x'] + bb2['width'] / 2) - cx, (bb2['y'] + bb2['height'] / 2) - cy
    check(abs(dx - 90) < 12 and abs(dy - 40) < 12, 'glisser sous échelle x1,5 : le sommet suit la souris (%+.0f, %+.0f)' % (dx, dy))
    # boutons A+ / A- / auto
    z0 = pg.evaluate("Lab.Zoom.get()"); pg.click('#lab-tools button[aria-label="Agrandir la taille"]'); z1 = pg.evaluate("Lab.Zoom.get()")
    check(z1 == z0 + 0.25, 'A+ : %.2f -> %.2f' % (z0, z1))
    pg.click('#lab-zoom-val'); check(pg.evaluate("Lab.Zoom.get()") == z0, 'bouton % : retour à l’automatique')
    ctx.close(); b.close()
print('FAILS:', len(fails)); sys.exit(1 if fails else 0)
