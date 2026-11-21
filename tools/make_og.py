#!/usr/bin/env python3
"""Génère les images de partage (1200x630) : og/og-<clé>.png. Polices locales (Cairo), aucune ressource externe."""
import os
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CARDS = {
    'default': ('#9b92dc', 'Cours en mouvement', 'دروس متحركة للسلك الإعدادي', 'Maths · Physique-Chimie · SVT', 'الرياضيات · الفيزياء والكيمياء · علوم الحياة والأرض'),
    'maths': ('#e371cb', 'Maths en mouvement', 'الرياضيات للسلك الإعدادي', '1re, 2e et 3e année du collège', 'السنوات الأولى والثانية والثالثة إعدادي'),
    'pc': ('#9b92dc', 'Physique-Chimie en mouvement', 'الفيزياء والكيمياء للسلك الإعدادي', '1re, 2e et 3e année du collège', 'السنوات الأولى والثانية والثالثة إعدادي'),
    'svt': ('#6ccdb6', 'SVT en mouvement', 'علوم الحياة والأرض للسلك الإعدادي', 'Sciences de la vie et de la Terre', 'برسوم متحركة وملخصات بالعربية'),
}
PAGE = """<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://%(root)s/fonts/fonts.css"><style>
html,body{margin:0;width:1200px;height:630px;background:#0d0b14;color:#f2eefc;font-family:'Cairo','Figtree',sans-serif;overflow:hidden}
.c{position:relative;width:1200px;height:630px;box-sizing:border-box;padding:70px 80px;background:radial-gradient(900px 500px at 85%% 10%%,%(acc)s33,transparent 70%%),#0d0b14}
svg{position:absolute;right:70px;top:60px;width:300px;height:200px}
h1{margin:150px 0 0;font-size:84px;line-height:1.05;font-weight:700}
.ar{font-size:64px;font-weight:700;color:%(acc)s;margin:14px 0 0;direction:rtl;text-align:left}
.s{margin-top:26px;font-size:32px;color:#c9c3e0;font-weight:400}
.bar{position:absolute;left:0;bottom:0;width:1200px;height:12px;background:linear-gradient(90deg,#e371cb,#9b92dc,#6ccdb6)}
.u{position:absolute;right:80px;bottom:40px;font-size:30px;color:#9b92dc;font-weight:600}
</style></head><body><div class="c">
<svg viewBox="0 0 48 32" aria-hidden="true"><path d="M4 26Q24 -6 44 26" fill="none" stroke="#706696" stroke-width="3.4" stroke-linecap="round"/><circle cx="10" cy="17.8" r="3.6" fill="#e371cb"/><circle cx="24" cy="10" r="3.6" fill="#9b92dc"/><circle cx="38" cy="17.8" r="3.6" fill="#6ccdb6"/></svg>
<h1>%(fr)s</h1><div class="ar">%(ar)s</div><div class="s">%(s1)s</div><div class="s" dir="rtl" style="text-align:left;margin-top:6px">%(s2)s</div>
<div class="u">taalim.men</div><div class="bar"></div></div></body></html>"""
os.makedirs(os.path.join(ROOT, 'og'), exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1200, 'height': 630})
    for key, (acc, fr, ar, s1, s2) in CARDS.items():
        html = os.path.join(ROOT, 'og', '_%s.html' % key)
        open(html, 'w', encoding='utf8').write(PAGE % dict(root=ROOT, acc=acc, fr=fr, ar=ar, s1=s1, s2=s2))
        pg.goto('file://' + html); pg.wait_for_timeout(300); pg.evaluate('document.fonts.ready')
        pg.screenshot(path=os.path.join(ROOT, 'og', 'og-%s.png' % key)); os.remove(html)
    b.close()
print('og ok')
