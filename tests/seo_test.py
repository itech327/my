#!/usr/bin/env python3
"""SEO du portail : titres et descriptions arabes, og:image existante, canonical = vrai domaine, 404.html réelle."""
import os, re, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ['index.html', 'maths.html', 'physique-chimie.html', 'svt.html', 'confidentialite.html']
AR = re.compile(r'[؀-ۿ]')
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
rd = lambda p: open(os.path.join(ROOT, p), encoding='utf8').read()
for f in PAGES:
    h = rd(f)
    t = re.search(r'<title>(.*?)</title>', h, re.S).group(1)
    d = re.search(r'<meta name="description" content="([^"]*)"', h).group(1)
    canon = re.search(r'<link rel="canonical" href="([^"]+)"', h).group(1)
    img = re.search(r'<meta property="og:image" content="([^"]+)"', h)
    check(bool(AR.search(t)) and len(t) <= 90, f + ' : titre arabe + français (%d car.)' % len(t))
    check(bool(AR.search(d)) and 'Cours' in d + 'Cours' and len(d) <= 400, f + ' : description arabe + française')
    check(canon == 'https://taalim.men/' + ('' if f == 'index.html' else f), f + ' : canonical ' + canon)
    check(bool(img) and img.group(1).startswith('https://taalim.men/og/') and os.path.exists(os.path.join(ROOT, img.group(1).replace('https://taalim.men/', ''))), f + ' : og:image présente et fichier existant')
    check(h.count('<title>') == 1 and h.count('rel="canonical"') == 1 and h.count('property="og:image"') == 1, f + ' : une seule balise title, canonical, og:image')
    check('og:image:width" content="1200"' in h and 'summary_large_image' in h and 'twitter:image' in h, f + ' : carte large')
check('noindex' in rd('teacher.html'), 'teacher.html : noindex')
for k in ('default', 'maths', 'pc', 'svt'):
    check(os.path.getsize(os.path.join(ROOT, 'og', 'og-%s.png' % k)) < 600000, 'og-%s.png : moins de 600 Ko' % k)
h = rd('404.html')
check(os.path.exists(os.path.join(ROOT, '404.html')) and '<script' not in h and 'noindex' in h, '404.html : présente, sans script, noindex')
check('/404.html' in rd('_headers'), '_headers : règle pour /404.html')
sm = rd('sitemap.xml')
check('404' not in sm and 'teacher' not in sm, 'sitemap : ni 404 ni espace enseignant')
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 390, 'height': 800}); msgs = []
    pg.on('console', lambda m: msgs.append(m.text) if m.type == 'error' else None)
    pg.goto('file://' + os.path.join(ROOT, '404.html')); pg.wait_for_timeout(300)
    check(pg.locator('h1').inner_text() == '404' and pg.locator('a').count() == 4, '404.html : s\'affiche avec quatre liens')
    check(pg.evaluate('document.documentElement.scrollWidth <= innerWidth'), '404.html : pas de défilement horizontal à 390 px')
    b.close()
print('FAILS: %d' % len(fails)); sys.exit(1 if fails else 0)
