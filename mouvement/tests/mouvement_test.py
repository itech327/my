#!/usr/bin/env python3
"""Parcourt chaque leçon des sites maths, pc et svt comme un élève, avec la CSP du fichier _headers.

    python3 mouvement/tools/build.py && python3 mouvement/tests/mouvement_test.py [--shots DOSSIER]

Se termine par « FAILS: N ».
"""
import asyncio
import functools
import http.server
import re
import sys
import threading
from pathlib import Path

from playwright.async_api import async_playwright

DIST = Path(__file__).resolve().parents[1] / 'dist'
SHOTS = Path(sys.argv[sys.argv.index('--shots') + 1]) if '--shots' in sys.argv else None
FAILS = []

# réponses : (type, valeur) dans l'ordre des questions de « Nous faisons », puis réponses de « Je fais seul »
PLAN = {
    'maths/2ac-pythagore': {
        'sliders': [6, 8],
        'guide': [('tap', 'DF'), ('opt', 'DF² = DE² + EF²'), ('num', '169'), ('num', '13')],
        'seul': ['10', '15', '8', '4'],
    },
    'pc/3ac-vitesse-moyenne': {
        'sliders': [90, 90],
        'guide': [('opt', '1,5 h'), ('opt', 'v = d ÷ t'), ('num', '20'), ('num', '5,6')],
        'seul': ['60', '5', '20', '60'],
    },
    'svt/3ac-digestion': {
        'cut': 5,
        'guide': [('opt', 'Dans la bouche'), ('tap', 'intestin grêle'), ('opt', 'Parce qu\'il est très petit')],
        'seul': ['du glucose', 'couper les grosses molécules en petites',
                 'le passage des nutriments de l\'intestin grêle vers le sang', 'Dans le sang qui sort de l\'intestin grêle'],
    },
}


def csp_of(d):
    m = re.search(r'Content-Security-Policy: (.+)', (d / '_headers').read_text())
    return m.group(1).strip()


class Handler(http.server.SimpleHTTPRequestHandler):
    csp = ''

    def end_headers(self):
        self.send_header('Content-Security-Policy', self.csp)
        super().end_headers()

    def log_message(self, *a):
        pass


def serve(d, port):
    h = type('H', (Handler,), {'csp': csp_of(d)})
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', port), functools.partial(h, directory=str(d)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def fail(msg):
    FAILS.append(msg)
    print('FAIL', msg)


async def nexts(pg, n):
    for _ in range(n):
        await pg.click('section.on [data-next]')
        await pg.wait_for_timeout(250)


async def shot(pg, name):
    if SHOTS:
        await pg.wait_for_timeout(1300)
        await pg.screenshot(path=str(SHOTS / f'{name}.png'))


async def lesson(pg, base, key, plan):
    s, lid = key.split('/')
    await pg.goto(base)
    if await pg.locator(f'a[data-lesson="{lid}"]').count() != 1:
        fail(f'{key}: lien absent de l\'accueil')
    await shot(pg, f'{s}-home')
    await pg.click(f'a[data-lesson="{lid}"]')
    await pg.wait_for_selector('section.on .cap')
    # 1. ouverture : toutes les étapes
    n = await pg.locator('section.on .dots i').count()
    await shot(pg, f'{s}-1-ouverture-a')
    await nexts(pg, n - 1)
    await shot(pg, f'{s}-1-ouverture-b')
    await nexts(pg, 1)
    # 2. je me prépare : on répond « Vrai » partout, le bouton suivant doit apparaître
    for i in range(await pg.locator('section.on .tf').count()):
        await pg.locator('section.on .tf').nth(i).get_by_text('Vrai', exact=True).click()
    if not await pg.locator('section.on .btn.pri').is_visible():
        fail(f'{key}: bouton « Je regarde » invisible')
    await pg.locator('section.on .btn.pri').click()
    # 3. je regarde
    n = await pg.locator('section.on .dots i').count()
    for k in range(n):
        if k in (1, n // 2, n - 1):
            await shot(pg, f'{s}-3-regarde-{k}')
        if k < n - 1:
            await nexts(pg, 1)
    await nexts(pg, 1)
    # 4. nous faisons
    sec = pg.locator('section.on')
    for i, v in enumerate(plan.get('sliders', [])):
        await sec.locator('input[type=range]').nth(i).fill(str(v))
    if 'cut' in plan:
        for i in range(plan['cut']):
            await sec.locator(f'[aria-label="Couper le lien {i + 1}"]').dispatch_event('click')
        await sec.get_by_text('Faire passer', exact=True).click()
        await pg.wait_for_timeout(900)
    await shot(pg, f'{s}-4-faisons-a')
    for kind, val in plan['guide']:
        await pg.wait_for_timeout(450)
        if kind == 'tap':
            await sec.locator(f'[aria-label="{val}"]').dispatch_event('click')
        elif kind == 'opt':
            await sec.locator('.opt', has_text=val).last.click()
        else:
            box = sec.locator('input.num:not([disabled])').first
            await box.fill(val)
            await box.press('Enter')
    await pg.wait_for_timeout(500)
    oks = await sec.locator('.fb.ok').count()
    if oks < len(plan['guide']):
        fail(f'{key}: guide incomplet ({oks}/{len(plan["guide"])})')
    await shot(pg, f'{s}-4-faisons-b')
    btn = sec.get_by_text('Je fais seul ▶')
    if not await btn.is_visible():
        fail(f'{key}: bouton « Je fais seul » absent')
        return
    await btn.click()
    # 5. je fais seul
    sec = pg.locator('section.on')
    for val in plan['seul']:
        if await sec.locator('input.num:not([disabled])').count():
            box = sec.locator('input.num:not([disabled])').first
            await box.fill(val)
            await box.press('Enter')
        else:
            await sec.locator('.opt:not([disabled])', has_text=val).first.click()
    if await sec.locator('.fb.ok').count() != len(plan['seul']):
        fail(f'{key}: « Je fais seul » incomplet')
    await sec.get_by_text('Bilan ▶').click()
    # 6. bilan
    n = await pg.locator('section.on .dots i').count()
    await nexts(pg, n - 1)
    await shot(pg, f'{s}-6-bilan')
    if await pg.locator('section.on .retenir').count() < 2:
        fail(f'{key}: « À retenir » incomplet')
    # retour à l'accueil : la leçon est cochée
    await pg.goto(base)
    if (await pg.locator(f'a[data-lesson="{lid}"] .n').inner_text()).strip() != '✓':
        fail(f'{key}: leçon non cochée à l\'accueil')


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for port, key in enumerate(PLAN, 8811):
            s = key.split('/')[0]
            srv = serve(DIST / s, port)
            pg = await b.new_page(viewport={'width': 420, 'height': 860}, device_scale_factor=2)
            errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
            try:
                await lesson(pg, f'http://127.0.0.1:{port}/', key, PLAN[key])
            except Exception as e:  # noqa: BLE001
                fail(f'{key}: {e}')
            for e in errs:
                fail(f'{key}: erreur JS ou CSP : {e}')
            await pg.close()
            srv.shutdown()
            print(key, 'ok' if not any(f.startswith(key) for f in FAILS) else 'KO')
        await b.close()
    print(f'FAILS: {len(FAILS)}')
    sys.exit(1 if FAILS else 0)


if __name__ == '__main__':
    asyncio.run(main())
