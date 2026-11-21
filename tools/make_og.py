#!/usr/bin/env python3
"""Génère icons/og-image.png (1200x630) avec les polices du site. Nécessite playwright et chromium."""
import os
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML = """<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="file://%s/fonts/fonts.css">
<style>
html,body{margin:0}
body{width:1200px;height:630px;background:radial-gradient(900px 500px at 15%% 10%%,#2a1f45 0,#0d0b14 70%%);color:#f2eefc;font-family:Cairo,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;overflow:hidden;position:relative}
svg{width:240px;height:150px}
h1{margin:0;font-size:118px;font-weight:700;line-height:1.2;background:linear-gradient(90deg,#e371cb,#9b92dc,#6ccdb6);-webkit-background-clip:text;background-clip:text;color:transparent}
p{margin:0;font-size:46px;font-weight:600;color:#d9d3ee}
.fr{font-family:Figtree,sans-serif;font-size:30px;font-weight:500;color:#9b92dc;letter-spacing:.02em}
.url{position:absolute;bottom:26px;font-family:Figtree,sans-serif;font-size:28px;color:#6ccdb6}
</style>
<svg viewBox="0 0 48 30"><path d="M5 27Q24 -7 43 27" fill="none" stroke="#706696" stroke-width="2.4" stroke-linecap="round"/><circle cx="11" cy="18" r="3.4" fill="#e371cb"/><circle cx="24" cy="9" r="3.4" fill="#9b92dc"/><circle cx="37" cy="18" r="3.4" fill="#6ccdb6"/></svg>
<h1 dir="rtl">تعليم من</h1>
<p dir="rtl">دروس الإعدادي المغربي بالحركة</p>
<div class="fr">Maths · Physique-Chimie · SVT</div>
<div class="url">taalim.men</div>
"""
out = os.path.join(ROOT, 'icons', 'og-image.png')
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1200, 'height': 630})
    f = os.path.join(ROOT, 'tools', '_og.html')
    open(f, 'w', encoding='utf8').write(HTML % ROOT)
    pg.goto('file://' + f)
    pg.wait_for_timeout(500)
    pg.screenshot(path=out)
    b.close()
    os.remove(f)
print('ok', out, os.path.getsize(out))
