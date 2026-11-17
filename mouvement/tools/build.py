#!/usr/bin/env python3
"""Construit les trois sites « en mouvement » : maths, pc, svt.

Entrées : mouvement/core, mouvement/lessons/<matière>/*.js, fonts/ et icons/ du dépôt.
Sorties : mouvement/dist/<matière>/ (dossier publié par Cloudflare Pages, sans commande de build).

    python3 mouvement/tools/build.py
"""
import html
import json
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
             'levels': ['2', '3'], 'live': False},
}
LEVELS = [('1', '1<sup>re</sup> année', 'السنة الأولى'), ('2', '2<sup>e</sup> année', 'السنة الثانية'), ('3', '3<sup>e</sup> année', 'السنة الثالثة')]
LEAD = 'Des leçons courtes qui expliquent par le mouvement : une scène animée, des exercices guidés puis autonomes, et un résumé en arabe.'
LEAD_AR = 'دروس قصيرة تشرح بالحركة: مشهد متحرك، ثم تمارين موجهة، ثم تمارين فردية، وملخص بالعربية.'

CSP = ("default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; "
       "connect-src 'self'; base-uri 'none'; form-action 'none'; object-src 'none'; manifest-src 'self'; "
       "upgrade-insecure-requests; frame-ancestors 'none'")
HEADERS = f"""# Généré par mouvement/tools/build.py : ne pas modifier à la main.
/*
  Content-Security-Policy: {CSP}
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
"""
E = html.escape


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


def head(s, cfg, title, desc, url, depth):
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
<link rel="stylesheet" href="{up}fonts/fonts.css">
<link rel="stylesheet" href="{up}core/mv.css">
"""


def footer(s):
    others = ' '.join(f'<a href="{c["url"]}">{c["glyph"]} {c["name"]}</a>' for k, c in SUBJECTS.items()
                      if k != s and (c.get('live', True) or k == 'tech' and s == 'tech'))
    labo = ('<a href="https://technologie.taalim.men/">⚙ Labo et jeux de technologie</a>' if s == 'tech' or SUBJECTS['tech'].get('live', True)
            else '<a href="https://technologie.taalim.men/">⚙ Technologie</a>')
    return (f'<nav class="others" aria-label="Autres matières">{others}'
            f'{labo}<a href="https://taalim.men/">Tous les cours</a></nav>'
            '<p class="note">Cours en mouvement · collège, option française · taalim.men</p>')


def lesson_page(s, cfg, m):
    lvl = f'{m["level"]}AC'
    url = f'{cfg["url"]}{m["id"]}/'
    return (head(s, cfg, f'{m["title"]} · {cfg["name"]} {lvl}', m['lead'], url, 1) +
            f'<script defer src="../core/mv.js"></script>\n<script defer src="../lessons/{m["id"]}.js"></script>\n</head>\n<body>\n<main id="mv">\n'
            f'<div class="top"><a href="../">◀ Toutes les leçons</a><span class="brand">{cfg["glyph"]} {E(cfg["name"])}</span></div>\n'
            f'<div class="eyebrow">{E(cfg["name"])} · {lvl} · {E(m["theme"])}</div>\n'
            f'<h1>{E(m["title"])}</h1>\n<div class="ar">{E(m["ar"])}</div>\n'
            '<noscript><p class="card">Cette leçon animée a besoin de JavaScript.</p></noscript>\n'
            f'</main>\n<footer class="wrap">{footer(s)}</footer>\n</body>\n</html>\n')


def home_page(s, cfg, lessons):
    desc = f'{cfg["full"]} au collège, leçons en mouvement : animations, exercices guidés et résumé en arabe.'
    out = [head(s, cfg, f'{cfg["name"]} en mouvement · collège', desc, cfg['url'], 0),
           '<script defer src="core/mv.js"></script>\n</head>\n<body data-home>\n<main>\n',
           f'<div class="hero"><div class="glyph">{cfg["glyph"]}</div><h1>{E(cfg["name"])} en mouvement</h1>',
           f'<div class="ar">{E(cfg["ar"])}: {E(LEAD_AR)}</div><p class="small">{E(LEAD)}</p></div>\n',
           '<nav class="lvl" aria-label="Niveaux">' + ''.join(f'<a href="#n{k}">{k}AC</a>' for k, _, _ in LEVELS if k in cfg.get('levels', '123')) + '</nav>\n',
           '<a class="lesson exam" href="examen/"><span class="n">20</span><span><span class="eyebrow">Évaluation</span><b>Examens par niveau</b>'
           '<span class="ar">امتحانات: ثلاثة مستويات للصعوبة، النقطة على 20 والتصحيح</span></span></a>\n']
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
    return (head(s, cfg, f'Examens · {cfg["name"]} en mouvement', f'Examens de {cfg["full"]} au collège par niveau et par difficulté, note sur 20 et correction.', url, 1) +
            '<script defer src="../core/mv.js"></script>\n<script defer src="questions.js"></script>\n<script defer src="../core/exam.js"></script>\n</head>\n<body>\n<main id="ex">\n'
            f'<div class="top"><a href="../">◀ Toutes les leçons</a><span class="brand">{cfg["glyph"]} {E(cfg["name"])}</span></div>\n'
            f'<div class="eyebrow">{E(cfg["name"])} · Examens</div>\n<h1>Examens</h1>\n<div class="ar">امتحانات حسب المستوى ودرجة الصعوبة، مع النقطة على 20 والتصحيح</div>\n'
            '<noscript><p class="card">Les examens ont besoin de JavaScript.</p></noscript>\n'
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
        for f in ('mv.css', 'mv.js', 'exam.js'):
            shutil.copy(MV / 'core' / f, d / 'core' / f)
        shutil.copytree(ROOT / 'fonts', d / 'fonts')
        shutil.copytree(ROOT / 'icons', d / 'icons')
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
        (d / '404.html').write_text(head(s, cfg, 'Page introuvable', 'Page introuvable', cfg['url'], 0) +
                                    '</head>\n<body>\n<main><h1>Page introuvable</h1><p><a href="/">Retour aux leçons</a></p></main>\n</body>\n</html>\n', encoding='utf-8')
        (d / '_headers').write_text(HEADERS, encoding='utf-8')
        (d / 'robots.txt').write_text(f'User-agent: *\nAllow: /\nSitemap: {cfg["url"]}sitemap.xml\n', encoding='utf-8')
        (d / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
                                       ''.join(f'  <url><loc>{u}</loc></url>\n' for u in urls) + '</urlset>\n', encoding='utf-8')
        print(f'{s}: {len(lessons)} leçon(s) -> {d.relative_to(ROOT)}')


if __name__ == '__main__':
    build()
