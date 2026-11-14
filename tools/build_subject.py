#!/usr/bin/env python3
"""Assemble le site d'une matière isolée (sous-domaine) dans matiere/site/.

Même cadre, même module de défis et même durcissement que tools/build.py.
Seuls changent le contenu (matiere/ch/*.js, matiere/lab-config.js) et matiere/config.json.
Usage : python3 tools/build_subject.py   (SITE_URL=... pour changer l'adresse)
"""
import os, re, json, hashlib, base64, shutil, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'matiere')
OUT = os.path.join(SRC, 'site')
def rd(p, base=ROOT): return open(os.path.join(base, p), encoding='utf8').read()
def wr(p, t):
    full = os.path.join(OUT, p); os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, 'w', encoding='utf8').write(t)

C = json.loads(rd('config.json', SRC))
SITE = os.environ.get('SITE_URL', C['site_url']).rstrip('/') + '/'
APP_NAME = C['name'] + ' en mouvement'
SUBJ = json.dumps({'key': C['key'], 'name': C['name'], 'levels': C['levels']}, ensure_ascii=False)
def subj(js): return js.replace('/*__SUBJECT__*/null', SUBJ)

if os.path.isdir(OUT): shutil.rmtree(OUT)
os.makedirs(OUT)
for d in ('fonts', 'icons'): shutil.copytree(os.path.join(ROOT, d), os.path.join(OUT, d))
for f in ('lab/lab.js', 'lab/notify-config.js'):
    wr(f, rd(f))

LAB = rd('lab/lab.js')
NOTIFY = rd('lab/notify-config.js')

# --- cadre : première feuille de style et premier script du fragment Physique-Chimie
fr = rd('source/physique-chimie.fragment.html')
css_end = fr.index('</style>') + len('</style>')
head_css = fr[:css_end].replace('Physique-Chimie en mouvement', APP_NAME)
s0 = fr.index('<script>')
s1 = fr.index('</script>', s0) + len('</script>')
framework = fr[s0:s1]

body = '''
<style>h2.lvl{font-size:20px;margin:30px 0 0;padding-bottom:6px;border-bottom:1px solid var(--line)}h2.lvl span{color:var(--teal);font-weight:600;margin-inline-start:.4em}.appro{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:none;color:var(--gold,#e8b84a);border:1px solid currentColor;border-radius:999px;padding:1px 8px}.appro-note{margin-top:26px}h3.unit{font-size:15px;margin:22px 0 0;color:var(--muted);font-weight:600;line-height:1.5}h3.unit span{display:block;color:var(--lav);font-size:15px}.welcome{font-size:18px;max-width:60ch;margin:0 0 10px}.welcome.w-ar{color:var(--teal);font-size:19px}</style>
<div class="wrap">
  <div class="view" id="home">
  <header>
    <p class="kicker">Collège · option française</p>
    <h1 class="display">__NAME__ en mouvement</h1>
    <p class="welcome">Merci de ta visite. Ici, les cours bougent : tu touches la figure, tu changes les valeurs et tu comprends. Choisis ton chapitre pour commencer.</p>
    <p class="welcome w-ar" lang="ar" dir="rtl">شكرًا لزيارتك! هنا تتحرّك الدروس: تلمس الشكل وتغيّر القيم فتفهم. اختر الدرس الذي يناسبك لتبدأ.</p>
    <p class="lead">__LEAD__</p>
    <p class="lead ar-lead" dir="rtl" lang="ar">__LEAD_AR__</p>
  </header>
  <section aria-label="Chapitres">
    <p class="kicker">Chapitres par module</p>
    <div id="chapters"></div>
    <p class="lead" style="margin-top:18px"><a class="btn ghost" href="__PORTAL__">← Toutes les matières</a></p>
  </section>
  </div>
  <div id="more"></div>
  <footer>__NAME__ en mouvement · collège, option française</footer>
</div>
'''
for k, v in (('__NAME__', C['name']), ('__LEAD__', C['lead']), ('__LEAD_AR__', C['lead_ar']), ('__PORTAL__', C['portal_url'])):
    body = body.replace(k, v)

# Lab : inject après "PC.route=route;" (même méthode que build.py)
i = framework.index('PC.route=route;')
j = framework.index('</script>', i) + len('</script>')
ver = hashlib.sha256(NOTIFY.encode()).hexdigest()[:8]
block = ('\n<script src="lab/notify-config.js?v=' + ver + '"></script>\n<script>\n' + subj(rd('lab-config.js', SRC)) +
         '\n' + LAB + '\nLab.install(window.PC);\n</script>\n')
fw = framework[:j] + block + framework[j:]

# Contenu : tous les fichiers matiere/ch/*.js dans une seule fonction
chs = sorted(f for f in os.listdir(os.path.join(SRC, 'ch')) if f.endswith('.js'))
content = "(function () {\n'use strict';\nvar SUBJECT = " + SUBJ + ";\n" + '\n'.join(rd('ch/' + f, SRC) for f in chs) + "\n})();"
page = fw + '\n<script>\n' + content + '\n</script>\n'
head = '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
acc = C['color']
theme = '<style>:root{--grad:' + C['gradient'] + '}a.chap{border-color:' + acc + '}input[type=range]{accent-color:' + acc + '}</style>\n'
html = head + head_css.lstrip() + '\n' + theme + '</head>\n<body>' + body + page + '\n</body>\n</html>\n'

# --- durcissement (même logique que build.py)
DESC = {
  'index.html': (APP_NAME + ' : cours de la 3e année du collège', C['desc']),
  'confidentialite.html': ('Confidentialité · ' + APP_NAME, 'Quelles données sont enregistrées, où elles restent et ce qui n’est jamais fait.'),
}
FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='11' fill='%230d0b14'/%3E%3Cpath d='M5 33Q24 -1 43 33' fill='none' stroke='%237066 96' stroke-width='4' stroke-linecap='round'/%3E%3Ccircle cx='11' cy='24' r='5' fill='%23e371cb'/%3E%3Ccircle cx='24' cy='15' r='5' fill='%239b92dc'/%3E%3Ccircle cx='37' cy='24' r='5' fill='%236ccdb6'/%3E%3C/svg%3E"
def notify_origin():
    m = re.search(r'LAB_NOTIFY_URL\s*=\s*"(https://[^"/]+)', NOTIFY)
    return m.group(1) if m else ''
def inline_hashes(h):
    return ["'sha256-" + base64.b64encode(hashlib.sha256(m.group(1).encode('utf8')).digest()).decode() + "'" for m in re.finditer(r'<script>(.*?)</script>', h, re.S)]
def csp_for(h, header=False):
    conn = ["'self'", 'https://ipwho.is', 'https://ipapi.co', 'https://api.ipify.org'] + ([notify_origin()] if notify_origin() else [])
    parts = ["default-src 'none'", "script-src 'self' " + ' '.join(inline_hashes(h)), "style-src 'self' 'unsafe-inline'", "img-src 'self' data:",
             "font-src 'self'", 'connect-src ' + ' '.join(conn), "base-uri 'none'", "form-action 'none'", "object-src 'none'", "manifest-src 'self'", 'upgrade-insecure-requests']
    if header: parts.append("frame-ancestors 'none'")
    return '; '.join(parts)
def harden(name, h):
    h = re.sub(r'<link href="https://fonts\.googleapis\.com[^>]*>', '<link rel="stylesheet" href="fonts/fonts.css">', h)
    h = re.sub(r'<!--gen:head-->.*?<!--/gen:head-->\n?', '', h, flags=re.S)
    title, desc = DESC[name]
    url = SITE + ('' if name == 'index.html' else name)
    blk = ('<!--gen:head-->\n<meta http-equiv="Content-Security-Policy" content="' + csp_for(h) + '">\n'
           '<meta name="referrer" content="strict-origin-when-cross-origin">\n'
           '<meta name="description" content="' + desc + '">\n<link rel="canonical" href="' + url + '">\n'
           '<meta name="theme-color" content="#0d0b14">\n<link rel="icon" href="' + FAVICON + '">\n'
           '<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n'
           '<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">'
           '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="' + C['name'] + '">\n'
           '<meta property="og:type" content="website"><meta property="og:locale" content="fr_MA"><meta property="og:site_name" content="' + APP_NAME + '">\n'
           '<meta property="og:title" content="' + title + '"><meta property="og:description" content="' + desc + '"><meta property="og:url" content="' + url + '">\n'
           '<meta name="twitter:card" content="summary">\n<!--/gen:head-->\n')
    h = h.replace('<meta charset="utf-8">\n', '<meta charset="utf-8">\n' + blk, 1)
    assert '<!--gen:head-->' in h, name
    return h

conf = rd('confidentialite.html')
conf = conf.replace('Cours en mouvement', APP_NAME)
pages = {'index.html': harden('index.html', html), 'confidentialite.html': harden('confidentialite.html', conf)}
hdr = ['# Généré par tools/build_subject.py : ne pas modifier à la main.', '/*',
       '  X-Content-Type-Options: nosniff', '  X-Frame-Options: DENY', '  Referrer-Policy: strict-origin-when-cross-origin',
       '  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
       '  Cross-Origin-Opener-Policy: same-origin', '  Strict-Transport-Security: max-age=31536000; includeSubDomains', '',
       '/fonts/*', '  Cache-Control: public, max-age=31536000, immutable', '',
       '/lab/notify-config.js', '  Cache-Control: no-cache', '',
       '/sw.js', '  Cache-Control: no-cache', '  Service-Worker-Allowed: /', '',
       '/manifest.webmanifest', '  Content-Type: application/manifest+json', '  Cache-Control: no-cache', '',
       '/icons/*', '  Cache-Control: public, max-age=604800', '']
for name, h in pages.items():
    wr(name, h)
    paths = ['/', '/index.html'] if name == 'index.html' else ['/' + name, '/' + name[:-5]]
    for p in paths: hdr += [p, '  Content-Security-Policy: ' + csp_for(h, True)]
    hdr.append('')
wr('_headers', '\n'.join(hdr))
wr('manifest.webmanifest', json.dumps({
    'name': APP_NAME, 'short_name': C['name'], 'description': C['desc'], 'lang': 'fr', 'dir': 'auto',
    'start_url': './', 'scope': './', 'id': './', 'display': 'standalone', 'background_color': '#0d0b14', 'theme_color': '#0d0b14', 'categories': ['education'],
    'icons': [{'src': 'icons/icon-192.png', 'sizes': '192x192', 'type': 'image/png', 'purpose': 'any'},
              {'src': 'icons/icon-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any'},
              {'src': 'icons/icon-maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'}],
}, ensure_ascii=False, indent=2) + '\n')
fonts_list = sorted('fonts/' + f for f in os.listdir(os.path.join(OUT, 'fonts')))
core = ['./', 'confidentialite', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'lab/lab.js', 'lab/notify-config.js'] + fonts_list
ver = hashlib.sha256((pages['index.html'] + pages['confidentialite.html'] + NOTIFY + ''.join(fonts_list)).encode('utf8')).hexdigest()[:10]
wr('sw.js', rd('tools/sw.template.js').replace('__VERSION__', ver).replace('__CORE__', json.dumps(core)))
wr('robots.txt', 'User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ' + SITE + 'sitemap.xml\n')
today = datetime.date.today().isoformat()
wr('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
   ''.join('  <url><loc>%s</loc><lastmod>%s</lastmod></url>\n' % (u, today) for u in (SITE, SITE + 'confidentialite.html')) + '</urlset>\n')
print('ok', C['key'], len(pages['index.html']), 'octets · ', SITE)
