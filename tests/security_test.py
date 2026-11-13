#!/usr/bin/env python3
"""Sécurité : CSP valide, aucune ressource externe, XSS, injection CSV, données localStorage altérées."""
import os, re, sys, base64, hashlib, json
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ['index.html', 'maths.html', 'physique-chimie.html', 'svt.html', 'confidentialite.html']
ALLOWED = ('https://ipwho.is', 'https://ipapi.co', 'https://api.ipify.org', 'http://www.w3.org/2000/svg', 'https://itech327.github.io', 'https://www.w3.org/1999/xhtml')
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
rd = lambda p: open(os.path.join(ROOT, p), encoding='utf8').read()
for f in PAGES:
    h = rd(f)
    m = re.search(r'<meta http-equiv="Content-Security-Policy" content="([^"]+)"', h)
    check(bool(m), f + ' : CSP présente')
    if not m: continue
    hashes = set(re.findall(r"'sha256-([^']+)'", m.group(1)))
    calc = {base64.b64encode(hashlib.sha256(s.encode('utf8')).digest()).decode() for s in re.findall(r'<script>(.*?)</script>', h, re.S)}
    check(calc <= hashes, f + ' : chaque script en ligne a son hachage (%d)' % len(calc))
    check('unsafe-inline' not in m.group(1).split('script-src')[1].split(';')[0] and 'unsafe-eval' not in m.group(1), f + ' : scripts sans unsafe-inline ni unsafe-eval')
    check(not re.search(r'\son(click|load|error|mouseover|focus|submit)\s*=', re.sub(r'<script>.*?</script>', '', h, flags=re.S)), f + ' : aucun gestionnaire d’événement en ligne dans le HTML')
    check('fonts.googleapis' not in h and 'gstatic' not in h, f + ' : aucune police externe')
    ext = [u for u in re.findall(r'https?://[A-Za-z0-9./_?=&%:+-]+', re.sub(r'<meta[^>]*>|<link rel="canonical"[^>]*>', '', h)) if not u.startswith(ALLOWED)]
    check(not ext, f + ' : aucune URL externe inattendue ' + str(ext[:2]))
for f in ['_headers', 'robots.txt', 'sitemap.xml', 'fonts/fonts.css']:
    check(os.path.exists(os.path.join(ROOT, f)), f + ' présent')
check('frame-ancestors' in rd('_headers') and 'nosniff' in rd('_headers'), '_headers : frame-ancestors et nosniff')
check('confidentialite.html' in rd('index.html') and 'confidentialite.html' in rd('lab/lab.js'), 'lien Confidentialité (accueil et fenêtre de session)')

XSS = '<img src=x onerror="window.__xss=1">'
with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    ctx = b.new_context(viewport={'width': 420, 'height': 900})
    pg = ctx.new_page(); csp = []
    pg.on('console', lambda m: csp.append(m.text) if 'Content Security Policy' in m.text or 'Refused to' in m.text else None)
    pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
    pg.goto('file://' + os.path.join(ROOT, 'maths.html')); pg.wait_for_timeout(600)
    pg.fill('#lab-name', XSS); pg.check('#lab-cons'); pg.click('#lab-go'); pg.wait_for_timeout(300)
    # session altérée à la main dans localStorage (titre, question, ville, ip, nom)
    pg.evaluate("""(function(){var s=JSON.parse(localStorage.getItem('lab_cur'));var X='<img src=x onerror="window.__xss=1">';
      s.name=X;s.net={status:'ok',ip:X,city:X,country:X,isp:X,source:X};s.device.model=X;s.device.os=X;
      s.answers=[{app:'maths',chap:'c1-1"><img src=x onerror=window.__xss=1>',title:X,topic:X,d:2,ok:false,pts:0,hint:false,ms:10,q:X,given:X,right:X,t:Date.now()}].concat(new Array(5).fill(0).map(function(){return {app:'maths',chap:'c1-1',title:'ok',topic:'t',d:9e9,ok:true,pts:'<b>',hint:false,ms:5,q:'q',given:'1',right:'1',t:Date.now()}}));
      localStorage.setItem('lab_cur',JSON.stringify(s));})()""")
    pg.reload(); pg.wait_for_timeout(500)
    pg.evaluate("sessionStorage.setItem('lab_skip','1')")
    pg.evaluate("Lab.openReport(Lab.Session.cur())"); pg.wait_for_timeout(300)
    check(pg.evaluate("window.__xss") is None, 'XSS : aucun script exécuté depuis les données')
    check(pg.locator('#lab-report img, #lab-report script, .lab-bar2 img').count() == 0, 'XSS : aucune balise injectée dans le rapport et la barre')
    check('&lt;img' in pg.evaluate("document.getElementById('lab-report').innerHTML"), 'XSS : le texte est échappé et affiché tel quel')
    check(pg.evaluate("Lab.Session.cur().answers.every(function(a){return a.d>=1&&a.d<=4&&typeof a.pts==='number'})"), 'session relue : valeurs numériques bornées')
    # injection CSV
    pg.evaluate("(function(){var s=Lab.Session.cur();s.name='=HYPERLINK(\"http://x\")';s.answers[0].given='+cmd|calc';localStorage.setItem('lab_cur',JSON.stringify(s));})()")
    with pg.expect_download() as dl:
        pg.evaluate("Lab.openReport(Lab.Session.cur())"); pg.click('#lab-report [data-r=csv]')
    path = dl.value.path(); csv = open(path, encoding='utf8').read()
    check("'=HYPERLINK" in csv and "'+cmd" in csv and not re.search(r'(^|,)=HYPERLINK', csv, re.M), 'CSV : formules neutralisées')
    check(not csp, 'aucune violation de CSP en navigation normale ' + str(csp[:2]))
    ctx.close()
    # autres pages : chargement sans violation
    ctx = b.new_context(viewport={'width': 420, 'height': 900}); ctx.add_init_script("try{sessionStorage.setItem('lab_skip','1')}catch(e){}")
    for f in PAGES:
        pg = ctx.new_page(); v = []; errs = []
        pg.on('console', lambda m, v=v: v.append(m.text) if 'Content Security Policy' in m.text or 'Refused to' in m.text else None)
        pg.on('pageerror', lambda e, errs=errs: errs.append(str(e)))
        pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
        pg.goto('file://' + os.path.join(ROOT, f)); pg.wait_for_timeout(500)
        check(not v and not errs, f + ' : chargement sans violation CSP ni erreur ' + str((v + errs)[:1]))
        pg.close()
    ctx.close(); b.close()
print('FAILS:', len(fails)); sys.exit(1 if fails else 0)
