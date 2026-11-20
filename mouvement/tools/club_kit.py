#!/usr/bin/env python3
"""Trousse « club de révision » : un dossier à copier sur une clé USB, qui s'ouvre sans internet.

    python3 mouvement/tools/build.py && python3 mouvement/tools/club_kit.py [dossier_de_sortie]

Contenu : une page d'accueil bilingue, la leçon de maths (Rationnels) et la leçon de physique-chimie (Air) de 2AC.
Garanties vérifiées par mouvement/tests/club_kit_test.py : aucune requête réseau, aucune mesure d'audience, aucune donnée
envoyée (LAB_NOTIFY_URL vide), lien « Toutes les leçons » vers ../../index.html (accueil de la trousse), polices locales, VERSION.txt avec l'empreinte de chaque fichier.
La trousse est figée pour toute la durée de l'expérience : ne pas la modifier après le premier élève.
"""
import hashlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'mouvement' / 'tools'))
import build  # noqa: E402

DIST = ROOT / 'mouvement' / 'dist'
KIT_LESSONS = [('maths', '2ac-rationnels-modele'), ('pc', '2ac-air-modele')]


def meta_of(path):
    return json.loads(re.match(r'/\* @meta (\{.*?\}) \*/', Path(path).read_text(encoding='utf-8')).group(1))


def offline_html(h):
    h = re.sub(r'<script[^>]*cloudflareinsights[^>]*></script>\n?', '', h)               # pas de mesure d'audience
    h = re.sub(r'<link rel="canonical"[^>]*>\n?|<meta property="og:[^>]*>\n?|<meta name="twitter:[^>]*>\n?', '', h)
    h = re.sub(r'<script type="application/ld\+json">.*?</script>\n?', '', h, flags=re.S)
    h = h.replace('href="../"', 'href="../../index.html"')
    h = re.sub(r'<footer class="wrap">.*?</footer>', '<footer class="wrap"><p class="small">Trousse du club de révision · fonctionne sans internet</p></footer>', h, flags=re.S)
    return h


START = """<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Club de révision · 2AC</title>
<link rel="stylesheet" href="maths/core/mv.css"><link rel="stylesheet" href="maths/fonts/fonts.css">
</head><body><main>
<div class="hero"><div class="glyph">★</div><h1>Club de révision · 2<sup>e</sup> année collège</h1>
<div class="ar">نادي المراجعة · السنة الثانية إعدادي</div>
<p class="small">Deux leçons animées. Fais d'abord la leçon en entier, puis le test sur papier avec ton professeur.</p></div>
<a class="lesson" href="maths/2ac-rationnels-modele/index.html"><span class="n">π</span><span><span class="eyebrow">Mathématiques</span><b>%(m_title)s</b>
<span class="ar">%(m_ar)s</span></span></a>
<a class="lesson" href="pc/2ac-air-modele/index.html"><span class="n">⚛</span><span><span class="eyebrow">Physique-chimie</span><b>%(p_title)s</b>
<span class="ar">%(p_ar)s</span></span></a>
<p class="small">Cette trousse fonctionne sans internet, avec Chrome ou Edge. Rien n'est envoyé : tes résultats restent sur cet ordinateur.</p>
</main></body></html>
"""


def main():
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'mouvement' / 'dist-club'
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    metas = {}
    for subject, mid in KIT_LESSONS:
        src = ROOT / 'mouvement' / 'modeles' / subject / f'{mid}.js'
        meta = metas[subject] = meta_of(src)
        site = out / subject
        for d in ('core', 'fonts', 'icons'):
            shutil.copytree(DIST / subject / d, site / d)
        (site / 'core' / 'notify-config.js').write_text('window.LAB_NOTIFY_URL = "";\n', encoding='utf-8')   # rien ne quitte l'ordinateur
        (site / 'lessons').mkdir()
        shutil.copy(src, site / 'lessons' / f'{mid}.js')
        (site / mid).mkdir()
        (site / mid / 'index.html').write_text(offline_html(build.lesson_page(subject, build.SUBJECTS[subject], meta)), encoding='utf-8')
    (out / 'index.html').write_text(START % dict(m_title=metas['maths']['title'], m_ar=metas['maths']['ar'], p_title=metas['pc']['title'], p_ar=metas['pc']['ar']), encoding='utf-8')
    (out / 'LISEZ-MOI.txt').write_text(
        'TROUSSE DU CLUB DE RÉVISION (2AC)\n\n'
        '1. Copier tout le dossier sur l\'ordinateur (ou travailler directement depuis la clé).\n'
        '2. Ouvrir le fichier index.html avec Chrome ou Edge. Aucune connexion internet n\'est nécessaire.\n'
        '3. Ne rien modifier dans le dossier : la version est figée pour toute l\'expérience (voir VERSION.txt).\n'
        '4. Les résultats des élèves restent dans le navigateur de l\'ordinateur. Rien n\'est envoyé.\n'
        '   La mesure se fait avec les tests sur papier, pas avec les écrans.\n'
        '5. Si une page reste blanche : actualiser (F5). Si le problème continue, noter le nom du navigateur et le message affiché.\n\n'
        'ملاحظة بالعربية: افتحوا الملف index.html بمتصفح Chrome أو Edge. لا حاجة إلى الإنترنت، ولا يُرسَل أي شيء. لا تغيّروا أي ملف داخل المجلد.\n', encoding='utf-8')
    try:
        rev = subprocess.run(['git', '-C', str(ROOT), 'rev-parse', '--short', 'HEAD'], capture_output=True, text=True).stdout.strip()
    except Exception:  # noqa: BLE001
        rev = '?'
    files = sorted(p for p in out.rglob('*') if p.is_file() and p.name != 'VERSION.txt')
    lines = [f'Trousse club 2AC · commit {rev}'] + [f'{hashlib.sha256(p.read_bytes()).hexdigest()[:16]}  {p.relative_to(out)}' for p in files]
    (out / 'VERSION.txt').write_text('\n'.join(lines) + '\n', encoding='utf-8')
    size = sum(p.stat().st_size for p in out.rglob('*') if p.is_file())
    print(f'trousse -> {out} : {len(files)} fichiers, {size / 1e6:.1f} Mo')


if __name__ == '__main__':
    main()
