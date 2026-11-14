#!/usr/bin/env python3
"""Assemble les deux applications autonomes (HTML + JS en ligne)."""
import os, re, sys, hashlib
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def rd(p): return open(os.path.join(ROOT, p), encoding='utf8').read()
def wr(p, t): open(os.path.join(ROOT, p), 'w', encoding='utf8').write(t)

LAB = rd('lab/lab.js')
EXTRA = {'maths': rd('lab/extra-maths.js') if os.path.exists(os.path.join(ROOT,'lab/extra-maths.js')) else '',
         'pc': rd('lab/extra-pc.js') if os.path.exists(os.path.join(ROOT,'lab/extra-pc.js')) else ''}

def inject(frag, marker, cfgfile, ns, key):
    i = frag.index(marker)
    j = frag.index('</script>', i) + len('</script>')
    ver = hashlib.sha256(rd('lab/notify-config.js').encode()).hexdigest()[:8]
    block = '\n<script src="lab/notify-config.js?v=' + ver + '"></script>\n<script>\n' + rd(cfgfile) + '\n' + LAB + '\nLab.install(window.' + ns + ');\n</script>\n'
    return frag[:j] + block + frag[j:]

def inject_extra(frag, key):
    """Chapitres supplémentaires : placés avant le dernier script de l'application."""
    if not EXTRA[key]: return frag
    k = frag.rindex('<script>')
    return frag[:k] + '<script>\n' + EXTRA[key] + '\n</script>\n' + frag[k:]

# Maths : le fragment est déjà un document complet
m = rd('source/maths.fragment.html')
m = inject(m, 'M.route=route;', 'lab/lab-maths.js', 'MM', 'maths')
m = inject_extra(m, 'maths')
m = m.rstrip() + '\n'
wr('maths.html', m.lstrip())

# Physique-chimie : le fragment commence au <title>
p = rd('source/physique-chimie.fragment.html')
p = inject(p, 'PC.route=route;', 'lab/lab-pc.js', 'PC', 'pc')
p = inject_extra(p, 'pc')
k = p.index('</style>') + len('</style>')
head = '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
wr('physique-chimie.html', head + p[:k].lstrip() + '\n</head>\n<body>' + p[k:] + '\n</body>\n</html>\n')

# SVT : même cadre que la physique-chimie (CSS + première balise script), contenu propre
fr = rd('source/physique-chimie.fragment.html')
css_end = fr.index('</style>') + len('</style>')
head_css = fr[:css_end].replace('Physique-Chimie en mouvement', 'SVT en mouvement')
s0 = fr.index('<script>')
s1 = fr.index('</script>', s0) + len('</script>')
framework = fr[s0:s1]
svt_body = '''
<div class="wrap">
  <div class="view" id="home">
  <header>
    <p class="kicker">Collège · option française</p>
    <h1 class="display">SVT en mouvement</h1>
    <p class="lead">Cours de sciences de la vie et de la Terre de la 3<sup>e</sup> année du collège : nutrition, système nerveux, muscles et santé, avec des figures animées et un résumé en arabe sous chaque leçon.</p>
    <p class="lead ar-lead" dir="rtl" lang="ar">دروس علوم الحياة والأرض للسنة الثالثة إعدادي: التغذية والجهازان العصبي والعضلي والصحة، مع رسوم متحركة وشرح بالعربية تحت كل درس.</p>
  </header>
  <section aria-label="Chapitres">
    <p class="kicker">3<sup>e</sup> année · Chapitres</p>
    <div class="chap-grid" id="chapters"></div>
    <p class="lead" style="margin-top:18px"><a class="btn ghost" href="index.html">← Toutes les matières</a></p>
  </section>
  </div>
  <div id="more"></div>
  <footer>SVT en mouvement · collège, option française · 3<sup>e</sup> année</footer>
</div>
'''
sv = inject(framework, 'PC.route=route;', 'lab/lab-svt.js', 'PC', 'svt')
sv = sv + '\n<script>\n' + rd('svt/svt.js') + '\n</script>\n'
head = '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
wr('svt.html', head + head_css.lstrip() + '\n</head>\n<body>' + svt_body + sv + '\n</body>\n</html>\n')
print('ok', len(m), len(p), len(sv))

# ---------------------------------------------------------------------------
# Durcissement : polices locales, CSP (hachages des scripts en ligne), SEO,
# fichiers _headers, robots.txt, sitemap.xml
# ---------------------------------------------------------------------------
import hashlib, base64, datetime
SITE = os.environ.get('SITE_URL', 'https://itech327.github.io/my/').rstrip('/') + '/'
DESC = {
 'index.html': ('Cours en mouvement : maths, physique-chimie et SVT du collège',
                'Cours interactifs du collège marocain : mathématiques, physique-chimie et SVT. Figures animées, explications en arabe, exercices à quatre niveaux.'),
 'maths.html': ('Maths en mouvement : cours de mathématiques du collège',
                'Mathématiques du collège (1re, 2e et 3e année) avec figures animées, résumés en arabe et exercices par niveaux.'),
 'physique-chimie.html': ('Physique-Chimie en mouvement : cours du collège',
                'Physique-chimie du collège (1re, 2e et 3e année) avec simulations animées, résumés en arabe et exercices par niveaux.'),
 'svt.html': ('SVT en mouvement : cours de la 3e année du collège',
                'Sciences de la vie et de la Terre, 3e année du collège : nutrition et santé, figures animées et résumés en arabe.'),
 'confidentialite.html': ('Confidentialité · Cours en mouvement',
                'Quelles données sont enregistrées, où elles restent et ce qui n’est jamais fait.'),
 'teacher.html': ('Espace enseignant · Cours en mouvement', 'Espace réservé à l’enseignant.'),
}
FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230d0b14'/%3E%3Cpath d='M6 22 L12 10 L18 20 L26 8' fill='none' stroke='%23e371cb' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"

def notify_origin():
    m = re.search(r'LAB_NOTIFY_URL\s*=\s*"(https://[^"/]+)', rd('lab/notify-config.js'))
    return m.group(1) if m else ''

def inline_hashes(html):
    hs = []
    for m in re.finditer(r'<script>(.*?)</script>', html, re.S):
        hs.append("'sha256-" + base64.b64encode(hashlib.sha256(m.group(1).encode('utf8')).digest()).decode() + "'")
    return hs

def csp_for(html, header=False):
    conn = ["'self'", 'https://ipwho.is', 'https://ipapi.co', 'https://api.ipify.org'] + ([notify_origin()] if notify_origin() else [])
    parts = ["default-src 'none'", "script-src 'self' " + ' '.join(inline_hashes(html)), "style-src 'self' 'unsafe-inline'",
             "img-src 'self' data:", "font-src 'self'", 'connect-src ' + ' '.join(conn), "base-uri 'none'", "form-action 'none'", "object-src 'none'",
             "manifest-src 'self'", 'upgrade-insecure-requests']
    if header: parts.append("frame-ancestors 'none'")
    return '; '.join(parts)

def harden(name, html):
    html = re.sub(r'<link href="https://fonts\.googleapis\.com[^>]*>', '<link rel="stylesheet" href="fonts/fonts.css">', html)
    html = re.sub(r'<!--gen:head-->.*?<!--/gen:head-->\n?', '', html, flags=re.S)
    title, desc = DESC[name]
    url = SITE + ('' if name == 'index.html' else name)
    block = ('<!--gen:head-->\n<meta http-equiv="Content-Security-Policy" content="' + csp_for(html) + '">\n'
             '<meta name="referrer" content="strict-origin-when-cross-origin">\n'
             '<meta name="description" content="' + desc + '">\n<link rel="canonical" href="' + url + '">\n'
             '<meta name="theme-color" content="#0d0b14">\n<link rel="icon" href="' + FAVICON + '">\n'
             '<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n'
             '<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">'
             '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Cours">\n'
             '<meta property="og:type" content="website"><meta property="og:locale" content="fr_MA"><meta property="og:site_name" content="Cours en mouvement">\n'
             '<meta property="og:title" content="' + title + '"><meta property="og:description" content="' + desc + '"><meta property="og:url" content="' + url + '">\n'
             '<meta name="twitter:card" content="summary">\n<!--/gen:head-->\n')
    if name == 'teacher.html':
        block = block.replace('<meta name="twitter:card"', '<meta name="robots" content="noindex,nofollow,noarchive"><meta name="twitter:card"')
    html = html.replace('<meta charset="utf-8">\n', '<meta charset="utf-8">\n' + block, 1)
    assert '<!--gen:head-->' in html, name
    return html

hdr = ['# Généré par tools/build.py : ne pas modifier à la main.', '/*',
       '  X-Content-Type-Options: nosniff', '  X-Frame-Options: DENY', '  Referrer-Policy: strict-origin-when-cross-origin',
       '  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
       '  Cross-Origin-Opener-Policy: same-origin', '  Strict-Transport-Security: max-age=31536000; includeSubDomains', '',
       '/fonts/*', '  Cache-Control: public, max-age=31536000, immutable', '',
       '/lab/notify-config.js', '  Cache-Control: no-cache', '',
       '/sw.js', '  Cache-Control: no-cache', '  Service-Worker-Allowed: /', '',
       '/manifest.webmanifest', '  Content-Type: application/manifest+json', '  Cache-Control: no-cache', '',
       '/icons/*', '  Cache-Control: public, max-age=604800', '']
today = datetime.date.today().isoformat()
urls = []
for name in ['index.html', 'maths.html', 'physique-chimie.html', 'svt.html', 'confidentialite.html', 'teacher.html']:
    h = harden(name, rd(name)); wr(name, h)
    c = csp_for(h, True)
    paths = ['/', '/index.html'] if name == 'index.html' else ['/' + name, '/' + name[:-5]]
    for pth in paths: hdr += [pth, '  Content-Security-Policy: ' + c]
    if name == 'teacher.html':
        hdr += ['  Cache-Control: no-store', '  X-Robots-Tag: noindex, nofollow, noarchive']
    hdr.append('')
    if name != 'teacher.html':
        urls.append(SITE if name == 'index.html' else SITE + name)
wr('_headers', '\n'.join(hdr))

import json
pages = ['index.html', 'maths.html', 'physique-chimie.html', 'svt.html', 'confidentialite.html']
wr('manifest.webmanifest', json.dumps({
    'name': 'Cours en mouvement', 'short_name': 'Cours', 'description': 'Maths, physique-chimie et SVT du collège',
    'lang': 'fr', 'dir': 'auto', 'start_url': './', 'scope': './', 'id': './', 'display': 'standalone',
    'background_color': '#0d0b14', 'theme_color': '#0d0b14', 'categories': ['education'],
    'icons': [{'src': 'icons/icon-192.png', 'sizes': '192x192', 'type': 'image/png', 'purpose': 'any'},
              {'src': 'icons/icon-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any'},
              {'src': 'icons/icon-maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'}],
    'shortcuts': [{'name': 'Maths', 'url': 'maths.html'}, {'name': 'Physique-Chimie', 'url': 'physique-chimie.html'}, {'name': 'SVT', 'url': 'svt.html'}],
}, ensure_ascii=False, indent=2) + '\n')
fonts_list = sorted('fonts/' + f for f in os.listdir(os.path.join(ROOT, 'fonts')))
core = ['./'] + [n[:-5] for n in pages[1:]] + ['manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'lab/lab.js', 'lab/notify-config.js'] + fonts_list
ver = hashlib.sha256(''.join(rd(n) for n in pages).encode('utf8') + rd('lab/notify-config.js').encode('utf8') + ''.join(fonts_list).encode('utf8')).hexdigest()[:10]
wr('sw.js', rd('tools/sw.template.js').replace('__VERSION__', ver).replace('__CORE__', json.dumps(core)))
wr('robots.txt', 'User-agent: *\nAllow: /\nDisallow: /teacher\nDisallow: /api/\n\nSitemap: ' + SITE + 'sitemap.xml\n')
wr('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
   ''.join('  <url><loc>%s</loc><lastmod>%s</lastmod></url>\n' % (u, today) for u in urls) + '</urlset>\n')
print('durci', len(urls), 'pages ·', SITE)
