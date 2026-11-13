#!/usr/bin/env python3
"""Assemble les deux applications autonomes (HTML + JS en ligne)."""
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def rd(p): return open(os.path.join(ROOT, p), encoding='utf8').read()
def wr(p, t): open(os.path.join(ROOT, p), 'w', encoding='utf8').write(t)

LAB = rd('lab/lab.js')
EXTRA = {'maths': rd('lab/extra-maths.js') if os.path.exists(os.path.join(ROOT,'lab/extra-maths.js')) else '',
         'pc': rd('lab/extra-pc.js') if os.path.exists(os.path.join(ROOT,'lab/extra-pc.js')) else ''}

def inject(frag, marker, cfgfile, ns, key):
    i = frag.index(marker)
    j = frag.index('</script>', i) + len('</script>')
    block = '\n<script src="lab/notify-config.js"></script>\n<script>\n' + rd(cfgfile) + '\n' + LAB + '\nLab.install(window.' + ns + ');\n</script>\n'
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
    <p class="lead">Cours de sciences de la vie et de la Terre de la 3<sup>e</sup> année du collège : nutrition et santé, avec des figures animées et un résumé en arabe sous chaque leçon.</p>
    <p class="lead ar-lead" dir="rtl" lang="ar">دروس علوم الحياة والأرض للسنة الثالثة إعدادي: التغذية والصحة، مع رسوم متحركة وشرح بالعربية تحت كل درس.</p>
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
