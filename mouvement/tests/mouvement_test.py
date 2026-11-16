#!/usr/bin/env python3
"""Parcourt chaque leçon des sites maths, pc et svt comme un élève, avec la CSP du fichier _headers.

    python3 mouvement/tools/build.py && python3 mouvement/tests/mouvement_test.py [--shots DOSSIER]

Se termine par « FAILS: N ».
"""
import asyncio
import functools
import http.server
import re
import os
import sys
import threading
from pathlib import Path

from playwright.async_api import async_playwright

DIST = Path(__file__).resolve().parents[1] / 'dist'
SHOTS = Path(sys.argv[sys.argv.index('--shots') + 1]) if '--shots' in sys.argv else None
FAILS = []

# réponses : (type, valeur) dans l'ordre des questions de « Nous faisons », puis réponses de « Je fais seul »
PLAN = {
    'maths/1ac-developpement': {'sliders': [3, 5, 2], 'guide': [('num', '10'), ('num', '15'), ('opt', '6(y + 3)')], 'seul': ['20', '918', '7(a + b)', '1300']},
    'maths/2ac-puissances': {'sliders': [9], 'guide': [('num', '2'), ('num', '1'), ('num', '3')], 'seul': ['125', '7', '-8', '-4']},
    'maths/3ac-systemes': {'sliders': [10, 12], 'guide': [('opt', '2x = 14'), ('num', '7'), ('num', '3')], 'seul': ['oui', '3', '7', '18']},
    'pc/1ac-melanges': {'buttons': ['Décanter', 'Filtrer'], 'guide': [('opt', 'décantation'), ('opt', 'un filtre'), ('opt', 'distillation')], 'seul': ['hétérogène', 'homogène', 'limpide mais', '10']},
    'pc/2ac-matieres': {'sliders': [8], 'guide': [('opt', 'naturelle'), ('opt', 'synthétique'), ('opt', 'du pétrole')], 'seul': ['naturelle', 'synthétique', 'minérale', '25']},
    'pc/3ac-acides-bases': {'sliders': [4], 'buttons': ['Acide pH 2'], 'guide': [('opt', 'acide'), ('opt', 'augmente vers 7'), ('opt', 'non')], 'seul': ['basique', 'pH 2', '5', '3']},
    'svt/1ac-classification': {'sliders': [5], 'guide': [('opt', 'vertébré'), ('opt', 'poils'), ('opt', 'mammifère')], 'seul': ['oiseau', 'amphibien', 'mammifère', '5']},
    'svt/2ac-heredite': {'buttons': ['Spermatozoïde X', 'Spermatozoïde Y'], 'guide': [('num', '46'), ('num', '23'), ('opt', 'du père')], 'seul': ['les chromosomes', '23', 'un garçon', '50']},
    'svt/3ac-nutrition': {'buttons': ['Pain', 'Orange', 'Lait', 'Œuf', 'Huile'], 'guide': [('num', '760'), ('num', '595'), ('opt', 'presque pas')], 'seul': ['des protéines', 'des caries', 'pain, lait', '380']},
    'maths/1ac-operations-relatifs': {
        'sliders': [-2, 6],
        'guide': [('opt', 'ajouter +3'), ('opt', 'contraires'), ('num', '−4')],
        'seul': ['-9', '-3', '3', '-5'],
    },
    'maths/2ac-multiplication-rationnels': {
        'sliders': [2, 5, 1, 2],
        'guide': [('opt', '3/10'), ('opt', 'négatif'), ('num', '4')],
        'seul': ['6', 'positif', '2', '180'],
    },
    'maths/3ac-equations': {
        'sliders': [4],
        'guide': [('opt', '3x − 7 = 8'), ('num', '15'), ('num', '5')],
        'seul': ['7', '7', 'x < −4', '8'],
    },
    'pc/1ac-pression': {
        'sliders': [400],
        'guide': [('opt', 'augmente'), ('num', '2200'), ('opt', 'le baromètre')],
        'seul': ['un manomètre', '1 013 hPa', 'diminue', '273'],
    },
    'pc/2ac-lois-reaction': {
        'sliders': [2, 1, 2],
        'guide': [('opt', 'du dioxyde de carbone'), ('num', '44'), ('opt', 'oui')],
        'seul': ['se conserve', '4', '2', '22'],
    },
    'pc/3ac-reactions-air': {
        'sliders': [30],
        'buttons': ['eau', 'peinture'],
        'guide': [('opt', 'dioxygène et eau'), ('opt', 'empêche'), ('opt', 'couche de zinc')],
        'seul': ['dioxygène et eau', 'Sa couche', '6', '2'],
    },
    'svt/1ac-chaines-alimentaires': {
        'clicks': ['[aria-label="herbe"]', '[aria-label="criquet"]', '[aria-label="lézard"]', '[aria-label="faucon"]'],
        'guide': [('opt', 'des souris'), ('opt', 'augmente'), ('opt', 'est plus consommée')],
        'seul': ['un producteur', 'est mangée par', '3', 'diminuer'],
    },
    'svt/2ac-reproduction-homme': {
        'sliders': [9],
        'guide': [('opt', "l'ovulation"), ('opt', 'dans la trompe'), ('opt', "dans l'utérus")],
        'seul': ['les testicules', 'la fécondation', '9', 'par le placenta'],
    },
    'svt/3ac-immunite': {
        'sliders': [3],
        'guide': [('opt', 'fabriquer une mémoire'), ('opt', 'vite et en grande'), ('opt', 'non, la réponse')],
        'seul': ['la peau', 'des globules blancs', 'les lymphocytes', 'pour entretenir'],
    },
    'maths/1ac-relatifs': {
        'sliders': [5],
        'guide': [('opt', '−7'), ('opt', '−1'), ('opt', '−7 < −1 < 0 < 3')],
        'seul': ['8', '−4 > −9', '12', 'Azrou'],
    },
    'maths/2ac-addition-rationnels': {
        'sliders': [2, -3],
        'guide': [('opt', '10'), ('num', '6'), ('num', '−1')],
        'seul': ['5', '-3', '-1', '3'],
    },
    'maths/3ac-ordre': {
        'sliders': [-1, 3, -2],
        'guide': [('opt', '6 ≤ 3x ≤ 15'), ('num', '5'), ('num', '14')],
        'seul': ['<', '>', '11', '-4'],
    },
    'pc/1ac-masse-volumique': {
        'buttons': ['eau', 'huile', 'fer'],
        'guide': [('num', '24'), ('num', '2,5'), ('opt', 'coule')],
        'seul': ['250', '7,9', '2000', 'flotte'],
    },
    'pc/2ac-combustions': {
        'sliders': [2],
        'guide': [('opt', 'soufre et dioxygène'), ('opt', 'le dioxyde de soufre'), ('opt', 'soufre + dioxygène → dioxyde')],
        'seul': ['du dioxyde de carbone', 'carbone et dioxygène', 'une combustion incomplète', 'aérer'],
    },
    'pc/3ac-materiaux-electricite': {
        'buttons': ['cuivre', 'aluminium', 'plastique', 'verre'],
        'guide': [('opt', 'un conducteur'), ('opt', 'isoler'), ('opt', 'des électrons libres')],
        'seul': ['le verre', 'conducteur', "d'électrons libres", 'parce que le plastique'],
    },
    'svt/1ac-regimes-alimentaires': {
        'buttons': ['chèvre', 'renard', 'Homme'],
        'guide': [('opt', 'attraper'), ('opt', 'carnivore'), ('opt', 'un chacal')],
        'seul': ['herbivore', 'omnivore', 'herbivore', 'change avec'],
    },
    'svt/2ac-reproduction-plantes': {
        'sliders': [3],
        'guide': [('opt', 'les insectes'), ('opt', 'fécondation'), ('opt', 'la pollinisation puis')],
        'seul': ["l'étamine", 'la pollinisation', 'le fruit', 'Les abeilles assurent'],
    },
    'svt/3ac-sang': {
        'buttons': ['Centrifuger', 'plasma', 'globules rouges', 'globules blancs', 'plaquettes'],
        'guide': [('opt', 'le dioxygène'), ('opt', 'moins de dioxygène'), ('opt', 'vite fatiguée')],
        'seul': ['les globules blancs', 'le plasma', '5,5', 'des capillaires'],
    },
    'maths/1ac-fractions': {
        'guide': [('opt', '6'), ('num', '2'), ('num', '3')],
        'seul': ['4', '7/9', '2/3 < 5/6', 'Amine'],
    },
    'maths/2ac-rationnels': {
        'sliders': [-5, 2],
        'guide': [('opt', 'négatif'), ('num', '−3'), ('opt', '−1 et 0')],
        'seul': ['-3', 'négatif', '−3/4 < −1/2', '-2,25'],
    },
    'maths/3ac-identites': {
        'sliders': [7, 2],
        'guide': [('opt', '(a + b)² = a² + 2ab + b²'), ('opt', '4x²'), ('num', '20'), ('num', '25')],
        'seul': ['441', '25', '9999', '(x − 7)(x + 7)'],
    },
    'pc/1ac-etats-matiere': {
        'sliders': [25],
        'guide': [('opt', 'solide'), ('opt', 'liquide'), ('num', '250')],
        'seul': ['ni forme propre', 'plane et horizontale', '1500', 'un solide en petits grains'],
    },
    'pc/2ac-molecules': {
        'buttons': ['+ H', '+ H', '+ O', 'Vider', '+ O', '+ O'],
        'guide': [('num', '3'), ('opt', 'un corps composé'), ('num', '6')],
        'seul': ['5', 'un corps simple', 'H₂O', '10'],
    },
    'pc/3ac-materiaux': {
        'buttons': ['canette de sardines', 'Test aimant', 'Test courant', 'canette de soda', 'Test aimant', 'Test courant', 'bocal', 'Test aimant', 'Test courant'],
        'guide': [('opt', 'un métal'), ('opt', 'du fer'), ('opt', "de l'aluminium")],
        'seul': ['le fer', 'verre ou plastique', 'Le cuivre conduit', 'verre'],
    },
    'svt/1ac-respiration': {
        'buttons': ['Homme', 'poisson', 'criquet', 'grenouille'],
        'guide': [('opt', 'du dioxyde de carbone'), ('opt', 'de la respiration de la souris'), ('opt', 'rejette du dioxyde')],
        'seul': ['du dioxyde de carbone', 'les branchies', 'La plante respire', 'branchies puis poumons'],
    },
    'svt/2ac-reproduction-animaux': {
        'sliders': [12],
        'guide': [('opt', 'externe'), ('opt', 'interne'), ('opt', 'direct')],
        'seul': ['les spermatozoïdes', "l'union", 'ovipare', 'une métamorphose'],
    },
    'svt/3ac-respiration-homme': {
        'sliders': [3],
        'guide': [('num', '5'), ('opt', 'dans les alvéoles'), ('opt', 'dioxyde de carbone')],
        'seul': ['descend', 'au niveau des alvéoles', '150', 'Pour faciliter'],
    },
    'maths/1ac-priorites': {
        'clicks': ['[aria-label="Opération × numéro 2"]', '[aria-label="Opération ÷ numéro 3"]', '[aria-label="Opération + numéro 1"]', '[aria-label="Opération − numéro 1"]'],
        'guide': [('opt', '4 + 2'), ('num', '12'), ('num', '6')],
        'seul': ['24', '15', '20', '29'],
    },
    'maths/3ac-racines-carrees': {
        'sliders': [64],
        'guide': [('opt', '50 = 25 × 2'), ('opt', '√25 × √2'), ('num', '5')],
        'seul': ['9', '0,4', '7', '2'],
    },
    'pc/1ac-eau-nature': {
        'buttons': ['salée', 'douce gelée', 'douce liquide'],
        'guide': [('tap', 'mer'), ('opt', 'fines gouttelettes'), ('opt', 'solide')],
        'seul': ['de l\'état liquide à l\'état gazeux', 'le Soleil', 'évaporation, condensation, précipitations', '97'],
    },
    'pc/2ac-air': {
        'sliders': [20],
        'guide': [('opt', 'reste le même'), ('opt', 'la distance entre'), ('num', '21')],
        'seul': ['le diazote', 'diminue', '42', 'beaucoup d\'espace vide'],
    },
    'svt/1ac-milieu-naturel': {
        'sliders': [20],
        'guide': [('opt', 'du biotope'), ('opt', 'de la biocénose'), ('opt', 'un hygromètre')],
        'seul': ['la température', 'du biotope et de la biocénose', 'à 200 lux', 'plus éclairé et plus sec'],
    },
    'svt/2ac-tectonique': {
        'sliders': [20],
        'guide': [('num', '200'), ('num', '2'), ('opt', 'le rapprochement de deux plaques')],
        'seul': ['de plaques qui bougent', 'la formation de montagnes', '20', 'Des roches formées'],
    },
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
    await shot(pg, f'{lid}-home')
    await pg.click(f'a[data-lesson="{lid}"]')
    await pg.wait_for_selector('section.on .cap')
    # 1. ouverture : toutes les étapes
    n = await pg.locator('section.on .dots i').count()
    await shot(pg, f'{lid}-1-ouverture-a')
    await nexts(pg, n - 1)
    await shot(pg, f'{lid}-1-ouverture-b')
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
            await shot(pg, f'{lid}-3-regarde-{k}')
        if k < n - 1:
            await nexts(pg, 1)
    await nexts(pg, 1)
    # 4. nous faisons
    sec = pg.locator('section.on')
    for i, v in enumerate(plan.get('sliders', [])):
        await sec.locator('input[type=range]').nth(i).fill(str(v))
    for sel in plan.get('clicks', []):
        await sec.locator(sel).dispatch_event('click')
        await pg.wait_for_timeout(150)
    for txt in plan.get('buttons', []):
        await sec.locator('button', has_text=txt).first.click()
    if 'cut' in plan:
        for i in range(plan['cut']):
            await sec.locator(f'[aria-label="Couper le lien {i + 1}"]').dispatch_event('click')
        await sec.get_by_text('Faire passer', exact=True).click()
        await pg.wait_for_timeout(900)
    await shot(pg, f'{lid}-4-faisons-a')
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
    await shot(pg, f'{lid}-4-faisons-b')
    btn = sec.get_by_text('Je fais seul ▶')
    if not await btn.is_visible():
        fail(f'{key}: bouton « Je fais seul » absent')
        return
    await btn.click()
    # 5. je fais seul
    sec = pg.locator('section.on')
    items = sec.locator('.card > div:not(.eyebrow):not(.row)')
    for i, val in enumerate(plan['seul']):
        it = items.nth(i)
        if await it.locator('input.num').count():
            box = it.locator('input.num')
            await box.fill(val)
            await box.press('Enter')
        else:
            await it.locator('.opt', has_text=val).first.click()
    if await sec.locator('.fb.ok').count() != len(plan['seul']):
        fail(f'{key}: « Je fais seul » incomplet')
    await sec.get_by_text('Bilan ▶').click()
    # 6. bilan
    n = await pg.locator('section.on .dots i').count()
    await nexts(pg, n - 1)
    await shot(pg, f'{lid}-6-bilan')
    if await pg.locator('section.on .retenir').count() < 2:
        fail(f'{key}: « À retenir » incomplet')
    # retour à l'accueil : la leçon est cochée
    await pg.goto(base)
    if (await pg.locator(f'a[data-lesson="{lid}"] .n').inner_text()).strip() != '✓':
        fail(f'{key}: leçon non cochée à l\'accueil')


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        only = [k for k in os.environ.get('MV_ONLY', '').split(',') if k]
        for port, key in enumerate(PLAN, 8811):
            if only and key not in only:
                continue
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
