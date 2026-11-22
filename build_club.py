#!/usr/bin/env python3
"""Construit le dossier « Club de révision » : un paquet autonome, sans internet, qui s'ouvre en double-cliquant index.html.

    python3 build_club.py [DIST_MOUVEMENT] [SORTIE]

Il copie les sites maths et pc de la plateforme (dist), puis adapte les COPIES pour le protocole file:// :
liens de dossier -> index.html, pas de liens externes, pas d'envoi réseau. La plateforme elle-même n'est pas modifiée.
Ajoute : index.html (accueil du club), resultats.html (fiche de résultats de CE poste, imprimable, export CSV), guide-enseignant.html.
"""
import json, re, shutil, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
DIST = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE.parent / 'site-mv' / 'mouvement' / 'dist'
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else HERE / 'club-revision'
SUBJ = {'maths': 'Mathématiques', 'pc': 'Physique-chimie'}
LEVEL = 'n2'  # le club commence par la 2AC
SKIP = {'_headers', 'robots.txt', 'sitemap.xml', '404.html', 'og.png'}

if OUT.exists():
    shutil.rmtree(OUT)
catalog = []
for s in SUBJ:
    src, dst = DIST / s, OUT / s
    shutil.copytree(src, dst, ignore=lambda d, names: [n for n in names if n in SKIP])
    home = (src / 'index.html').read_text(encoding='utf-8')
    for m in re.finditer(r'<a class="lesson" href="([^"]+)/" data-lesson="([^"]+)"><span class="n">\d+</span><span><span class="eyebrow">([^<]*)</span><b>([^<]*)</b>', home):
        lid = m.group(2)
        catalog.append({'s': s, 'id': lid, 'lvl': lid[:3].upper(), 'theme': m.group(3), 'title': m.group(4)})

def fix_html(t):
    t = re.sub(r'<script[^>]*cloudflareinsights[^>]*></script>\s*', '', t)
    t = re.sub(r'<nav class="others".*?</nav>', '', t, flags=re.S)  # liens vers les autres sites : inutiles hors ligne
    t = re.sub(r'<p class="note">Cours en mouvement[^<]*</p>', '<p class="note">Club de révision · poste hors ligne</p>', t)
    # file:// n'ouvre pas index.html tout seul : on l'écrit dans chaque lien relatif de dossier
    t = re.sub(r'href="((?:\.\./)+|(?:\.\./)*(?:[A-Za-z0-9_-]+/)+)"', lambda m: 'href="%sindex.html"' % m.group(1), t)
    return t

for p in OUT.rglob('index.html'):
    p.write_text(fix_html(p.read_text(encoding='utf-8')), encoding='utf-8')

for s in SUBJ:
    c = OUT / s / 'core'
    mv = (c / 'mv.js').read_text(encoding='utf-8')
    assert mv.count("'revision/'") == 2, 'mv.js: liens revision inattendus'
    mv = mv.replace("'revision/'", "'revision/index.html'")
    assert mv.count("'parcours/'") == 2 and mv.count("'../parcours/'") == 1, 'mv.js: liens parcours inattendus'
    mv = mv.replace("'parcours/'", "'parcours/index.html'").replace("'../parcours/'", "'../parcours/index.html'")
    a = "var lv = cur ? lvOf(cur) : lvOf(links[0]);"
    assert a in mv; mv = mv.replace(a, "var lv = cur ? lvOf(cur) : (window.CLUB_LEVEL || lvOf(links[0]));")
    b = "    if (!start) start = (groups"
    assert b in mv; mv = mv.replace(b, "    if (!start && window.CLUB_LEVEL && groups.some(function (g) { return g.id === window.CLUB_LEVEL; })) start = window.CLUB_LEVEL;\n" + b)
    (c / 'mv.js').write_text(mv, encoding='utf-8')
    for f in ('revise.js', 'exam.js'):
        t = (c / f).read_text(encoding='utf-8')
        n = t.count("+ '/\">'")
        assert n >= 1, f
        (c / f).write_text(t.replace("+ '/\">'", "+ '/index.html\">'"), encoding='utf-8')
    pj = (c / 'parcours.js').read_text(encoding='utf-8')
    assert pj.count("'../revision/'") == 1, 'parcours.js: lien revision inattendu'
    (c / 'parcours.js').write_text(pj.replace("'../revision/'", "'../revision/index.html'"), encoding='utf-8')
    # pas d'envoi réseau au club ; la 2AC d'abord
    (c / 'notify-config.js').write_text("window.CLUB_LEVEL = '%s';\n" % LEVEL, encoding='utf-8')

shutil.copytree(DIST / 'maths' / 'fonts', OUT / 'fonts')  # partagées par l'accueil et la fiche
for f in ('club.css', 'club.js'):
    shutil.copyfile(HERE / f, OUT / f)
(OUT / 'resultats.js').write_text('var CATALOG = %s;\n' % json.dumps(catalog, ensure_ascii=False) + (HERE / 'resultats.js').read_text(encoding='utf-8'), encoding='utf-8')
for f in ('index.html', 'resultats.html', 'guide-enseignant.html', 'LISEZMOI.txt'):
    shutil.copyfile(HERE / f, OUT / f)
print('Club prêt :', OUT, '·', len(catalog), 'leçons')
