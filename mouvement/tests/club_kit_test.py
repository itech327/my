#!/usr/bin/env python3
"""Trousse du club : parcours complet depuis file://, réseau coupé (G-OFFLINE).

    python3 mouvement/tools/build.py && python3 mouvement/tools/club_kit.py /tmp/kit && python3 mouvement/tests/club_kit_test.py /tmp/kit

Vérifie : aucune requête http(s) émise, aucune erreur JS, page d'accueil -> leçon -> retour, parcours parfait et parcours
avec erreurs des deux leçons (mêmes scénarios que modele_pilote_test.py), mobile 375 px, empreintes de VERSION.txt, aucun lien externe actif.
"""
import asyncio
import hashlib
import re
import sys
from pathlib import Path

from playwright.async_api import async_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
import modele_pilote_test as h  # noqa: E402
from modeles_specs import SPECS  # noqa: E402

KIT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path('/tmp/kit')
NET = []


async def kit_page(b, kit, w=420, hgt=860):
    ctx = await b.new_context(viewport={'width': w, 'height': hgt}, device_scale_factor=2, offline=True)
    pg = await ctx.new_page()
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    pg.on('request', lambda r: r.url.startswith(('http://', 'https://')) and NET.append(r.url))
    sub = h.CUR['spec']['subject']
    await pg.goto(f'file://{kit}/{sub}/{h.CUR["id"]}/index.html')
    await pg.wait_for_selector('section.mv-sec.on', timeout=8000)
    return ctx, pg, errs


def verify_version():
    lines = (KIT / 'VERSION.txt').read_text().splitlines()[1:]
    h.check('G-OFFLINE', len(lines) > 20, 'VERSION.txt liste les fichiers')
    for ln in lines:
        digest, rel = ln.split('  ', 1)
        h.check('G-OFFLINE', hashlib.sha256((KIT / rel).read_bytes()).hexdigest()[:16] == digest, f'empreinte différente : {rel}')


def static():
    for p in KIT.rglob('*.html'):
        t = p.read_text(encoding='utf-8')
        h.check('G-OFFLINE', not re.search(r'<(script|link|img|iframe)[^>]+(src|href)="https?://', t), f'ressource externe dans {p.relative_to(KIT)}')
        h.check('G-OFFLINE', 'cloudflareinsights' not in t, f'mesure d\'audience dans {p.relative_to(KIT)}')
        for m in re.finditer(r'(?:src|href)="(?!https?:|#|mailto:)([^"]+)"', t):
            tgt = (p.parent / m.group(1).split('#')[0].split('?')[0]).resolve()
            h.check('G-OFFLINE', tgt.is_file(), f'lien cassé {m.group(1)} dans {p.relative_to(KIT)}')
    for p in KIT.rglob('notify-config.js'):
        h.check('G-OFFLINE', 'LAB_NOTIFY_URL = ""' in p.read_text(), f'rien ne doit être envoyé : {p.relative_to(KIT)}')


async def start_page(b):
    ctx = await b.new_context(viewport={'width': 1366, 'height': 768}, offline=True)
    pg = await ctx.new_page()
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('request', lambda r: r.url.startswith(('http://', 'https://')) and NET.append(r.url))
    await pg.goto(f'file://{KIT}/index.html')
    links = await pg.locator('a.lesson').count()
    h.check('G-OFFLINE', links == 2, f'la page d\'accueil propose 2 leçons, trouvées : {links}')
    for i in range(links):
        await pg.goto(f'file://{KIT}/index.html')
        await pg.locator('a.lesson').nth(i).click()
        await pg.wait_for_selector('section.mv-sec.on', timeout=8000)
        await pg.click('.top a')
        await pg.wait_for_selector('a.lesson')
        h.check('G-OFFLINE', pg.url.endswith('/index.html') and pg.url.count('/') >= 3, f'retour à l\'accueil : {pg.url}')
    h.check('G-OFFLINE', not errs, f'erreurs JS page d\'accueil : {errs}')
    await ctx.close()


async def main():
    h.new_page = kit_page                                              # les parcours de modele_pilote_test s'ouvrent maintenant depuis la trousse
    verify_version()
    static()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        await start_page(b)
        for mid in ('2ac-rationnels-modele', '2ac-air-modele'):
            spec = SPECS[mid]
            h.CUR.update(id=mid, spec=spec)
            before = len(h.FAILS)
            for fn in (h.run_perfect, h.run_diag, h.run_mobile):
                try:
                    await fn(b, KIT, spec)
                except Exception as e:  # noqa: BLE001
                    h.fail(fn.__name__, repr(e)[:300])
            print(mid, 'ok' if len(h.FAILS) == before else f'KO ({len(h.FAILS) - before})')
        await b.close()
    h.check('G-OFFLINE', not NET, f'requêtes réseau émises : {sorted(set(NET))[:5]}')
    print(f'FAILS: {len(h.FAILS)}')
    sys.exit(1 if h.FAILS else 0)


if __name__ == '__main__':
    asyncio.run(main())
