#!/usr/bin/env python3
"""Construit les trois sites « en mouvement » : maths, pc, svt.

Entrées : mouvement/core, mouvement/lessons/<matière>/*.js, fonts/ et icons/ du dépôt.
Sorties : mouvement/dist/<matière>/ (dossier publié par Cloudflare Pages, sans commande de build).

    python3 mouvement/tools/build.py
"""
import html
import json
import os
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MV = ROOT / 'mouvement'
DIST = MV / 'dist'

SUBJECTS = {
    'maths': {'name': 'Maths', 'full': 'Mathématiques', 'ar': 'الرياضيات', 'glyph': 'π', 'url': 'https://maths.taalim.men/'},
    'pc': {'name': 'Physique-chimie', 'full': 'Physique-chimie', 'ar': 'الفيزياء والكيمياء', 'glyph': '⚛', 'url': 'https://pc.taalim.men/'},
    'svt': {'name': 'SVT', 'full': 'Sciences de la vie et de la Terre', 'ar': 'علوم الحياة والأرض', 'glyph': '✿', 'url': 'https://svt.taalim.men/'},
    # live=False : le site n'est pas encore relié à son domaine, donc absent des pieds de page des autres matières
    'tech': {'name': 'Technologie', 'full': 'Technologie', 'ar': 'التكنولوجيا', 'glyph': '⚙', 'url': 'https://tech.taalim.men/',
             'levels': ['2', '3']},
}
LEVELS = [('1', '1<sup>re</sup> année', 'السنة الأولى'), ('2', '2<sup>e</sup> année', 'السنة الثانية'), ('3', '3<sup>e</sup> année', 'السنة الثالثة')]
LEAD = 'Des leçons courtes qui expliquent par le mouvement : une scène animée, des exercices guidés puis autonomes, et un résumé en arabe.'
LEAD_AR = 'دروس قصيرة تشرح بالحركة: مشهد متحرك، ثم تمارين موجهة، ثم تمارين فردية، وملخص بالعربية.'

# SEO bilingue (arabe + français) et mesure d'audience : maths, pc, svt seulement. La technologie reste identique.
SEO = ('maths', 'pc', 'svt')
LEVEL_AR = {'1': 'الأولى', '2': 'الثانية', '3': 'الثالثة'}
PARENT = {'name': 'Taalim MEN', 'url': 'https://taalim.men/'}
# Mesure d'audience : Cloudflare Web Analytics par défaut. Une seule des deux, choisie à la construction :
#   CFWA_TOKEN_MATHS, CFWA_TOKEN_PC, CFWA_TOKEN_SVT = <32 caractères hexadécimaux>   Cloudflare Web Analytics, sans cookie
#   (un site par sous-domaine ; CFWA_TOKEN sert de valeur commune si les trois ne sont pas fournis)
#   GA4_ID=G-XXXXXXXXXX                       Google Analytics 4
# La CSP n'autorise alors que les sources nécessaires, et le script d'initialisation reste un fichier (aucun script en ligne).
# Jetons publics (visibles dans le code source de chaque page), un site Web Analytics par sous-domaine.
# Les variables d'environnement les remplacent ; CFWA_TOKEN_<MATIERE>= (vide) désactive la mesure de la matière.
CFWA_DEFAULT = {'maths': '7e6fe31aacb644e0a8f28ed8440e473d', 'pc': 'ca2091a162164b0eac8d0bd88ceef1ea', 'svt': '9f9cfbac24a94fdf8c823677ad077041'}
CFWA = {}
for _s in SEO:
    _v = os.environ.get(f'CFWA_TOKEN_{_s.upper()}', os.environ.get('CFWA_TOKEN', CFWA_DEFAULT[_s]))
    CFWA[_s] = _v.strip()
GA4 = os.environ.get('GA4_ID', '').strip()
for _s, _t in CFWA.items():
    if _t and not re.fullmatch(r'[0-9a-f]{32}', _t):
        raise SystemExit(f'Jeton Cloudflare invalide pour {_s} : 32 caractères hexadécimaux attendus')
if GA4 and not re.fullmatch(r'G-[A-Z0-9]{6,}', GA4):
    raise SystemExit('GA4_ID invalide : format G-XXXXXXXXXX attendu')
if any(CFWA.values()) and GA4:
    raise SystemExit('Choisir Cloudflare ou GA4, pas les deux')
RELAY = 'https://taalim-relay.abderrahim-habz.workers.dev'


def csp(s):
    script, conn, img = ["'self'"], ["'self'", RELAY], ["'self'", 'data:']
    if CFWA.get(s):
        script.append('https://static.cloudflareinsights.com')
        conn.append('https://cloudflareinsights.com')
    if s in SEO and GA4:
        script.append('https://www.googletagmanager.com')
        conn += ['https://www.google-analytics.com', 'https://region1.google-analytics.com', 'https://*.analytics.google.com']
        img.append('https://www.google-analytics.com')
    return (f"default-src 'none'; script-src {' '.join(script)}; style-src 'self' 'unsafe-inline'; img-src {' '.join(img)}; font-src 'self'; "
            f"connect-src {' '.join(conn)}; base-uri 'none'; form-action 'none'; object-src 'none'; manifest-src 'self'; "
            "upgrade-insecure-requests; frame-ancestors 'none'")


def headers(s):
    return f"""# Généré par mouvement/tools/build.py : ne pas modifier à la main.
/*
  Content-Security-Policy: {csp(s)}
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
  Cross-Origin-Opener-Policy: same-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/icons/*
  Cache-Control: public, max-age=604800
""" + ('\n/og.png\n  Cache-Control: public, max-age=604800\n' if s in SEO else '')


E = html.escape


def ld_json(data):
    """Bloc JSON-LD. Une donnée, pas un script exécuté : la CSP ne le bloque pas."""
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c') + '</script>\n'


def seo_extra(s, cfg, depth, ld=None):
    """Balises ajoutées dans <head> pour maths, pc, svt : Open Graph complet, JSON-LD, mesure d'audience."""
    if s not in SEO:
        return ''
    up = '../' * depth
    out = ('<meta property="og:type" content="website"><meta property="og:locale" content="ar_MA">'
           '<meta property="og:locale:alternate" content="fr_MA"><meta property="og:site_name" content="Taalim MEN · تعليم من">\n'
           f'<meta property="og:image" content="{cfg["url"]}og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
           f'<meta property="og:image:alt" content="{E(cfg["name"])} en mouvement · {E(cfg["ar"])}">\n'
           f'<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="{cfg["url"]}og.png">\n')
    if ld:
        out += ld_json(ld)
    if CFWA.get(s):
        out += f'<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon=\'{{"token": "{CFWA[s]}"}}\'></script>\n'
    if GA4:
        out += (f'<script async src="https://www.googletagmanager.com/gtag/js?id={GA4}"></script>\n'
                f'<script defer src="{up}core/ga.js"></script>\n')
    return out


def crumbs(cfg, name=None, url=None):
    items = [(PARENT['name'], PARENT['url']), (f'{cfg["ar"]} | {cfg["name"]}', cfg['url'])]
    if name:
        items.append((name, url))
    return {'@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': i, 'name': n, 'item': u} for i, (n, u) in enumerate(items, 1)]}


def lessons_of(subject):
    out = []
    for f in sorted((MV / 'lessons' / subject).glob('*.js')):
        m = re.match(r'/\* @meta (\{.*?\}) \*/', f.read_text(encoding='utf-8'))
        if not m:
            raise SystemExit(f'{f} : en-tête @meta manquant')
        meta = json.loads(m.group(1))
        if meta['id'] != f.stem:
            raise SystemExit(f'{f} : l\'id {meta["id"]} doit égaler le nom du fichier')
        meta['file'] = f
        out.append(meta)
    out.sort(key=lambda m: (m['level'], m.get('order', 99), m['id']))
    return out


def head(s, cfg, title, desc, url, depth, extra=''):
    up = '../' * depth
    return f"""<!DOCTYPE html>
<html lang="fr" data-s="{s}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<meta name="theme-color" content="#141517">
<link rel="canonical" href="{url}">
<link rel="icon" href="{up}icons/icon-192.png">
<link rel="apple-touch-icon" href="{up}icons/apple-touch-icon.png">
<meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(desc)}"><meta property="og:url" content="{url}">
{extra}<link rel="stylesheet" href="{up}fonts/fonts.css">
<link rel="stylesheet" href="{up}core/mv.css">
"""


TECH_VISIBLE = False   # liens vers la technologie masqués dans les autres matières, le temps de finir maths, pc et svt (le site tech lui-même n'est pas modifié)


def footer(s):
    show = lambda k: k != s and (k != 'tech' or TECH_VISIBLE or s == 'tech') and (SUBJECTS[k].get('live', True) or k == 'tech' and s == 'tech')
    others = ' '.join(f'<a href="{c["url"]}">{c["glyph"]} {c["name"]}</a>' for k, c in SUBJECTS.items() if show(k))
    labo = ''
    if s == 'tech' or TECH_VISIBLE:
        labo = ('<a href="https://technologie.taalim.men/">⚙ Labo et jeux de technologie</a>' if s == 'tech' or SUBJECTS['tech'].get('live', True)
                else '<a href="https://technologie.taalim.men/">⚙ Technologie</a>')
    return (f'<nav class="others" aria-label="Autres matières">{others}'
            f'{labo}<a href="https://taalim.men/">Tous les cours</a></nav>'
            '<p class="note">Cours en mouvement · collège, option française · taalim.men</p>')


def lesson_page(s, cfg, m):
    lvl = f'{m["level"]}AC'
    url = f'{cfg["url"]}{m["id"]}/'
    title, desc, ld = f'{m["title"]} · {cfg["name"]} {lvl}', m['lead'], None
    if s in SEO:
        title = f'{m["ar"]} | {title}'
        desc = (f'درس {cfg["ar"]} «{m["ar"]}» للسنة {LEVEL_AR[m["level"]]} إعدادي ({lvl}): '
                'مشهد متحرك وتمارين موجهة وملخص بالعربية. مجاني. Leçon animée, exercices guidés et résumé en arabe.')
        ld = {'@context': 'https://schema.org', '@graph': [
            {'@type': 'LearningResource', 'name': f'{m["ar"]} | {m["title"]}', 'url': url, 'description': desc,
             'inLanguage': ['ar', 'fr'], 'learningResourceType': 'Lesson', 'educationalLevel': f'{lvl}',
             'teaches': m['theme'], 'isAccessibleForFree': True,
             'isPartOf': {'@type': 'WebSite', 'name': f'{cfg["name"]} en mouvement', 'url': cfg['url']},
             'provider': {'@type': 'Organization', 'name': PARENT['name'], 'url': PARENT['url']}},
            crumbs(cfg, f'{m["ar"]} | {m["title"]}', url)]}
    return (head(s, cfg, title, desc, url, 1, seo_extra(s, cfg, 1, ld)) +
            f'<script defer src="../core/notify-config.js"></script>\n<script defer src="../core/mv.js"></script>\n<script defer src="../lessons/{m["id"]}.js"></script>\n</head>\n<body>\n<main id="mv">\n'
            f'<div class="top"><a href="../">◀ Toutes les leçons</a><span class="brand">{cfg["glyph"]} {E(cfg["name"])}</span></div>\n'
            f'<div class="eyebrow">{E(cfg["name"])} · {lvl} · {E(m["theme"])}</div>\n'
            f'<h1>{E(m["title"])}</h1>\n<div class="ar">{E(m["ar"])}</div>\n'
            '<noscript><p class="card">Cette leçon animée a besoin de JavaScript.</p></noscript>\n'
            f'</main>\n<footer class="wrap">{footer(s)}</footer>\n</body>\n</html>\n')


def home_page(s, cfg, lessons):
    desc = f'{cfg["full"]} au collège, leçons en mouvement : animations, exercices guidés et résumé en arabe.'
    title, ld = f'{cfg["name"]} en mouvement · collège', None
    if s in SEO:
        title = f'{cfg["ar"]} بالحركة | {title}'
        desc = f'دروس {cfg["ar"]} للسلك الإعدادي بالحركة: مشاهد متحركة وتمارين وملخصات بالعربية. مجانية. {desc}'
        ld = {'@context': 'https://schema.org', '@graph': [
            {'@type': 'WebSite', 'name': f'{cfg["name"]} en mouvement', 'url': cfg['url'], 'inLanguage': ['ar', 'fr'], 'description': desc,
             'publisher': {'@type': 'Organization', 'name': PARENT['name'], 'url': PARENT['url']}},
            crumbs(cfg)]}
    out = [head(s, cfg, title, desc, cfg['url'], 0, seo_extra(s, cfg, 0, ld)),
           '<script defer src="core/notify-config.js"></script>\n<script defer src="core/mv.js"></script>\n</head>\n<body data-home>\n<main>\n',
           f'<div class="hero"><div class="glyph">{cfg["glyph"]}</div><h1>{E(cfg["name"])} en mouvement</h1>',
           f'<div class="ar">{E(cfg["ar"])}: {E(LEAD_AR)}</div><p class="small">{E(LEAD)}</p></div>\n',
           '<nav class="lvl" aria-label="Niveaux">' + ''.join(f'<a href="#n{k}">{k}AC</a>' for k, _, _ in LEVELS if k in cfg.get('levels', '123')) + '</nav>\n',
           '<a class="lesson exam" href="examen/"><span class="n">20</span><span><span class="eyebrow">Évaluation</span><b>Examens par niveau</b>'
           '<span class="ar">امتحانات: ثلاثة مستويات للصعوبة، النقطة على 20 والتصحيح</span></span></a>\n',
           '<a class="lesson exam" href="revision/"><span class="n">8</span><span><span class="eyebrow">Chaque jour, cinq minutes</span><b>Révision du jour</b>'
           '<span class="ar">مراجعة اليوم: بطاقات متباعدة تثبّت الذاكرة وخريطة إتقان</span></span></a>\n']
    for k, fr, ar in LEVELS:
        if k not in cfg.get('levels', '123'):
            continue
        mine = [m for m in lessons if m['level'] == k]
        out.append(f'<h2 id="n{k}">{fr} <span class="small">· {ar}</span></h2>\n')
        if not mine:
            out.append('<p class="empty">Les leçons de ce niveau arrivent bientôt.</p>\n')
        for i, m in enumerate(mine, 1):
            out.append(f'<a class="lesson" href="{m["id"]}/" data-lesson="{m["id"]}"><span class="n">{i}</span><span>'
                       f'<span class="eyebrow">{E(m["theme"])}</span><b>{E(m["title"])}</b><span class="ar">{E(m["ar"])}</span></span></a>\n')
    out.append(footer(s) + '\n</main>\n</body>\n</html>\n')
    return ''.join(out)


def exam_page(s, cfg):
    url = f'{cfg["url"]}examen/'
    title, desc, ld = f'Examens · {cfg["name"]} en mouvement', f'Examens de {cfg["full"]} au collège par niveau et par difficulté, note sur 20 et correction.', None
    if s in SEO:
        title = f'امتحانات {cfg["ar"]} | {title}'
        desc = f'امتحانات {cfg["ar"]} للسلك الإعدادي بثلاثة مستويات لكل سنة، مع النقطة على 20 والتصحيح. مجانية. {desc}'
        ld = {'@context': 'https://schema.org', '@graph': [crumbs(cfg, f'امتحانات | Examens', url)]}
    return (head(s, cfg, title, desc, url, 1, seo_extra(s, cfg, 1, ld)) +
            '<script defer src="../core/notify-config.js"></script>\n<script defer src="../core/mv.js"></script>\n<script defer src="questions.js"></script>\n<script defer src="../core/exam.js"></script>\n</head>\n<body>\n<main id="ex">\n'
            f'<div class="top"><a href="../">◀ Toutes les leçons</a><span class="brand">{cfg["glyph"]} {E(cfg["name"])}</span></div>\n'
            f'<div class="eyebrow">{E(cfg["name"])} · Examens</div>\n<h1>Examens</h1>\n<div class="ar">امتحانات حسب المستوى ودرجة الصعوبة، مع النقطة على 20 والتصحيح</div>\n'
            '<noscript><p class="card">Les examens ont besoin de JavaScript.</p></noscript>\n'
            f'</main>\n<footer class="wrap">{footer(s)}</footer>\n</body>\n</html>\n')


def revision_page(s, cfg):
    url = f'{cfg["url"]}revision/'
    title, desc = f'Révision du jour · {cfg["name"]} en mouvement', f'Huit cartes par jour en {cfg["full"]} : révision espacée, confiance avant la réponse, carte de maîtrise. Sans compte, sans classement.'
    return (head(s, cfg, title, desc, url, 1, seo_extra(s, cfg, 1, None) if s in SEO else '') +
            '<script defer src="../core/notify-config.js"></script>\n<script defer src="../core/mv.js"></script>\n<script defer src="../examen/questions.js"></script>\n<script defer src="../core/revise.js"></script>\n</head>\n<body>\n<main id="ex">\n'
            f'<div class="top"><a href="../">◀ Toutes les leçons</a><span class="brand">{cfg["glyph"]} {E(cfg["name"])}</span></div>\n'
            f'<div class="eyebrow">{E(cfg["name"])} · Révision</div>\n<h1>Révision du jour</h1>\n<div class="ar">مراجعة اليوم: ثماني بطاقات في خمس دقائق</div>\n'
            '<noscript><p class="card">La révision a besoin de JavaScript.</p></noscript>\n'
            f'</main>\n<footer class="wrap">{footer(s)}</footer>\n</body>\n</html>\n')


def parcours_page(s, cfg):
    url = f'{cfg["url"]}parcours/'
    title, desc = f'Mon parcours · {cfg["name"]} en mouvement', f'Étapes franchies et carte de maîtrise en {cfg["full"]}. Individuel, sans compte, sans classement.'
    return (head(s, cfg, title, desc, url, 1, seo_extra(s, cfg, 1, None) if s in SEO else '') +
            '<script defer src="../core/notify-config.js"></script>\n<script defer src="../core/mv.js"></script>\n<script defer src="../examen/questions.js"></script>\n<script defer src="../core/parcours.js"></script>\n</head>\n<body>\n<main id="ex">\n'
            f'<div class="top"><a href="../">◀ Toutes les leçons</a><span class="brand">{cfg["glyph"]} {E(cfg["name"])}</span></div>\n'
            f'<div class="eyebrow">{E(cfg["name"])} · Parcours</div>\n<h1>Mon parcours</h1>\n<div class="ar">الإتقان والمراحل: تقدّمك أنت، دون مقارنة بأحد</div>\n'
            '<noscript><p class="card">Le parcours a besoin de JavaScript.</p></noscript>\n'
            f'</main>\n<footer class="wrap">{footer(s)}</footer>\n</body>\n</html>\n')


def exam_data(lessons):
    q = json.loads(subprocess.run(['node', str(MV / 'tools' / 'questions.js')] + [str(m['file']) for m in lessons],
                                  check=True, capture_output=True, text=True).stdout)
    data = [{'id': m['id'], 'level': m['level'], 'theme': m['theme'], 'title': m['title'], **q[m['id']]} for m in lessons]
    return '/* Généré par build.py à partir des leçons. */\nwindow.MVQ = ' + json.dumps(data, ensure_ascii=False) + ';\n'


def build():
    for s, cfg in SUBJECTS.items():
        d = DIST / s
        if d.exists():
            shutil.rmtree(d)
        (d / 'core').mkdir(parents=True)
        (d / 'lessons').mkdir()
        shutil.copy(ROOT / 'lab' / 'notify-config.js', d / 'core' / 'notify-config.js')  # adresse du relais Telegram, partagée avec le site principal
        for f in ('mv.css', 'mv.js', 'exam.js', 'revise.js', 'parcours.js'):
            shutil.copy(MV / 'core' / f, d / 'core' / f)
        shutil.copytree(ROOT / 'fonts', d / 'fonts')
        shutil.copytree(ROOT / 'icons', d / 'icons')
        if s in SEO:
            shutil.copy(MV / 'og' / f'og-{s}.png', d / 'og.png')                     # image de partage 1200x630
        lessons = lessons_of(s)
        urls = [cfg['url']]
        for m in lessons:
            shutil.copy(m['file'], d / 'lessons' / m['file'].name)
            (d / m['id']).mkdir()
            (d / m['id'] / 'index.html').write_text(lesson_page(s, cfg, m), encoding='utf-8')
            urls.append(f'{cfg["url"]}{m["id"]}/')
        (d / 'index.html').write_text(home_page(s, cfg, lessons), encoding='utf-8')
        (d / 'examen').mkdir()
        (d / 'examen' / 'index.html').write_text(exam_page(s, cfg), encoding='utf-8')
        (d / 'examen' / 'questions.js').write_text(exam_data(lessons), encoding='utf-8')
        urls.append(f'{cfg["url"]}examen/')
        (d / 'revision').mkdir()
        (d / 'revision' / 'index.html').write_text(revision_page(s, cfg), encoding='utf-8')
        urls.append(f'{cfg["url"]}revision/')
        (d / 'parcours').mkdir()
        (d / 'parcours' / 'index.html').write_text(parcours_page(s, cfg), encoding='utf-8')
        urls.append(f'{cfg["url"]}parcours/')
        (d / '404.html').write_text(head(s, cfg, 'Page introuvable', 'Page introuvable', cfg['url'], 0) +
                                    '</head>\n<body>\n<main><h1>Page introuvable</h1><p><a href="/">Retour aux leçons</a></p></main>\n</body>\n</html>\n', encoding='utf-8')
        (d / '_headers').write_text(headers(s), encoding='utf-8')
        if s in SEO and GA4:
            (d / 'core' / 'ga.js').write_text("window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}"
                                              f"gtag('js',new Date());gtag('config','{GA4}',{{anonymize_ip:true}});\n", encoding='utf-8')
        (d / 'robots.txt').write_text(f'User-agent: *\nAllow: /\nSitemap: {cfg["url"]}sitemap.xml\n', encoding='utf-8')
        (d / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
                                       ''.join(f'  <url><loc>{u}</loc></url>\n' for u in urls) + '</urlset>\n', encoding='utf-8')
        print(f'{s}: {len(lessons)} leçon(s) -> {d.relative_to(ROOT)}')


if __name__ == '__main__':
    build()
