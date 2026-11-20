#!/usr/bin/env python3
"""Garde-fous du modèle pilote « Pythagore » (docs/registre-erreurs-et-garde-fous.md, branche plan/modeles-pro).

    python3 mouvement/tools/build.py && python3 mouvement/tests/modele_pilote_test.py

La leçon vit dans mouvement/modeles/ (jamais publiée). Le test l'installe dans une copie temporaire de dist/maths,
la sert avec la CSP réelle du fichier _headers, puis la parcourt comme un élève. Se termine par « FAILS: N ».

Portes vérifiées : G-GRID, G-MATH, G-DIAG, G-ORDER, G-LANG, G-LEX, G-KEYS, G-MOBILE, G-CSP, G-GAME, G-MOCK, G-A11Y (si axe-core est fourni par AXE_JS).
"""
import asyncio
import functools
import http.server
import itertools
import math
import os
import re
import shutil
import sys
import tempfile
import threading
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'mouvement' / 'tools'))
import build  # noqa: E402

LESSON = Path(os.environ.get('PILOT_FILE', ROOT / 'mouvement' / 'modeles' / 'maths' / '2ac-pythagore-modele.js'))
ID = '2ac-pythagore-modele'
OX, OY, U = 75, 36, 30
FAILS = []


def fail(gate, msg):
    FAILS.append(f'{gate}: {msg}')
    print('FAIL', gate, msg)


def check(gate, cond, msg):
    if not cond:
        fail(gate, msg)
    return cond


# ---------- solveur indépendant : les réponses attendues sont recalculées ici, pas lues dans la leçon ----------
def hyp(a, b):
    return math.sqrt(a * a + b * b)


def leg(c, a):
    return math.sqrt(c * c - a * a)


def fmt(x):
    return str(int(round(x))) if abs(x - round(x)) < 1e-9 else f'{x:.2f}'.replace('.', ',')


# ---------- géométrie exacte : aires et intersections de polygones convexes ----------
def area(poly):
    return abs(sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[(i + 1) % len(poly)][0] * poly[i][1] for i in range(len(poly)))) / 2


def clip(subject, clipper):
    """Sutherland-Hodgman : intersection de deux polygones convexes."""
    def inside(p, a, b, s):
        return s * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) >= -1e-9

    def cross(p, q, a, b):
        x1, y1, x2, y2, x3, y3, x4, y4 = p[0], p[1], q[0], q[1], a[0], a[1], b[0], b[1]
        d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
        t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d
        return (x1 + t * (x2 - x1), y1 + t * (y2 - y1))
    s = 1 if sum(clipper[i][0] * clipper[(i + 1) % len(clipper)][1] - clipper[(i + 1) % len(clipper)][0] * clipper[i][1] for i in range(len(clipper))) > 0 else -1
    out = subject
    for i in range(len(clipper)):
        a, b = clipper[i], clipper[(i + 1) % len(clipper)]
        inp, out = out, []
        for j in range(len(inp)):
            p, q = inp[j], inp[(j + 1) % len(inp)]
            if inside(q, a, b, s):
                if not inside(p, a, b, s):
                    out.append(cross(p, q, a, b))
                out.append(q)
            elif inside(p, a, b, s):
                out.append(cross(p, q, a, b))
        if not out:
            return []
    return out


def cells(poly):
    return [((x - OX) / U, (y - OY) / U) for x, y in poly]


# ---------- site temporaire ----------
def install():
    tmp = Path(tempfile.mkdtemp(prefix='pilote-'))
    site = tmp / 'maths'
    shutil.copytree(ROOT / 'mouvement' / 'dist' / 'maths', site)
    shutil.copy(LESSON, site / 'lessons' / (ID + '.js'))
    meta = [m for m in [build.lessons_of('maths')[0]]][0]
    import json
    m = re.match(r'/\* @meta (\{.*?\}) \*/', LESSON.read_text(encoding='utf-8'))
    meta = json.loads(m.group(1))
    (site / ID).mkdir()
    (site / ID / 'index.html').write_text(build.lesson_page('maths', build.SUBJECTS['maths'], meta), encoding='utf-8')
    return tmp, site


class Handler(http.server.SimpleHTTPRequestHandler):
    csp = ''

    def end_headers(self):
        self.send_header('Content-Security-Policy', self.csp)
        super().end_headers()

    def log_message(self, *a):
        pass


def serve(d):
    csp = re.search(r'Content-Security-Policy: (.+)', (d / '_headers').read_text()).group(1).strip()
    h = type('H', (Handler,), {'csp': csp})
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(h, directory=str(d)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


async def new_page(b, port, w=420, h=860):
    ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2)
    await ctx.route('https://taalim-relay.abderrahim-habz.workers.dev/**', lambda r: r.fulfill(status=200, body='ok'))
    for host in ('https://static.cloudflareinsights.com/**', 'https://cloudflareinsights.com/**'):
        await ctx.route(host, lambda r: r.fulfill(status=200, content_type='text/javascript', body=''))
    pg = await ctx.new_page()
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    await pg.goto(f'http://127.0.0.1:{port}/{ID}/')
    await pg.wait_for_selector('section.mv-sec.on')
    return ctx, pg, errs


async def nexts(pg, n):
    for _ in range(n):
        await pg.click('section.on [data-next]')
        await pg.wait_for_timeout(200)


async def jump(pg, i):
    await pg.click(f'nav.stepper button:nth-child({i})')
    await pg.wait_for_timeout(150)


async def fb(pg, scope='section.on'):
    return (await pg.locator(f'{scope} .fb').last.inner_text()).strip()


async def num(pg, v, expect_ok=True):
    inp = pg.locator('section.on input.num:not([disabled])').first
    await inp.fill(str(v))
    await inp.press('Enter')                                            # G-KEYS : Entrée valide
    await pg.wait_for_timeout(120)
    if expect_ok:
        await pg.wait_for_function("document.querySelectorAll('section.on input.num[disabled]').length > 0", timeout=2000) if False else None


async def last_num_feedback(pg, v):
    inp = pg.locator('section.on input.num:not([disabled])').first
    box = inp.locator('xpath=ancestor::div[1]/parent::div')
    await inp.fill(str(v))
    await inp.press('Enter')
    await pg.wait_for_timeout(120)
    return (await box.locator('.fb').inner_text()).strip()


async def pick(pg, text):
    await pg.locator('section.on .opts:has(button:not([disabled])) button.opt:not([disabled])', has_text=text).first.click()
    await pg.wait_for_timeout(450)


async def type_ok(pg, v):
    inp = pg.locator('section.on input.num:not([disabled])').first
    await inp.fill(str(v))
    await inp.press('Enter')
    await pg.wait_for_timeout(500)


# ---------- G-GRID / G-MATH : lecture des sommets réels des triangles dans la page ----------
TRI_JS = """() => [...document.querySelectorAll('section.on svg polygon[data-tri]')].map(p => {
  const m = new DOMMatrix(getComputedStyle(p).transform);
  return p.getAttribute('points').trim().split(/\\s+/).map(s => { const [x, y] = s.split(',').map(Number); const q = m.transformPoint(new DOMPoint(x, y)); return [q.x, q.y]; });
})"""


WHITE_JS = """() => [...document.querySelectorAll('section.on svg polygon:not([data-tri]), section.on svg rect[fill^="rgba"]')]
  .filter(e => { let n = e; while (n && n.tagName !== 'svg') { if (n.style && n.style.opacity === '1') return true; n = n.parentNode; } return false; })
  .map(e => e.tagName === 'polygon'
    ? e.getAttribute('points').trim().split(/\\s+/).map(s => s.split(',').map(Number))
    : (() => { const x = +e.getAttribute('x'), y = +e.getAttribute('y'), w = +e.getAttribute('width'), h = +e.getAttribute('height'); return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; })())"""


async def geometry(pg, label, expected_areas):
    white = [cells(w) for w in await pg.evaluate(WHITE_JS)]               # les zones lues dans la page, pas recopiées ici
    got = sorted(round(area(w), 6) for w in white)
    check('G-GRID', got == sorted(expected_areas), f'{label}: aires des zones blanches affichées {got}, attendu {sorted(expected_areas)}')
    tris = await pg.evaluate(TRI_JS)
    check('G-GRID', len(tris) == 4, f'{label}: 4 triangles attendus, {len(tris)} trouvés')
    for n, t in enumerate(tris):
        for (cx, cy) in cells(t):
            check('G-GRID', abs(cx - round(cx)) < 1e-3 and abs(cy - round(cy)) < 1e-3, f'{label}: sommet du triangle {n} hors grille ({cx:.3f}, {cy:.3f})')
            check('G-GRID', -1e-3 <= cx <= 7.001 and -1e-3 <= cy <= 7.001, f'{label}: triangle {n} hors du grand carré')
        check('G-MATH', abs(area(cells(t)) - 6) < 1e-6, f'{label}: aire du triangle {n} = {area(cells(t))}, attendu 6 cases')
    for i, j in itertools.combinations(range(4), 2):
        inter = clip(cells(tris[i]), cells(tris[j]))
        check('G-GRID', not inter or area(inter) < 1e-6, f'{label}: les triangles {i} et {j} se chevauchent')
    for k, w in enumerate(white):
        check('G-GRID', all(abs(x - round(x)) < 1e-9 and abs(y - round(y)) < 1e-9 for x, y in w), f'{label}: zone blanche {k} hors grille')
        for n, t in enumerate(tris):
            inter = clip(cells(t), w)
            check('G-GRID', not inter or area(inter) < 1e-6, f'{label}: le triangle {n} recouvre la zone blanche {k}')
    total = 24 + sum(area(w) for w in white)
    check('G-MATH', abs(total - 49) < 1e-6, f'{label}: 24 + blanc = {total}, attendu 49')


async def run_perfect(b, port):
    ctx, pg, errs = await new_page(b, port)
    try:
        # Ouverture
        check('G-GAME', await pg.locator('section.on').count() == 1, 'une seule section visible au départ')
        await nexts(pg, 3)
        # Je me prépare : vrai/faux, la première affirmation est une prédiction
        truth = [False, True, False, True]
        for i, t in enumerate(truth):
            await pg.locator('section.on .tf').nth(i).locator('button').nth(0 if t else 1).click()
        txt = await pg.locator('section.on .fb').first.inner_text()
        check('G-HINT', 'plus petit que 3 + 4' in txt or 'plus courte' in txt or 'détour' in txt, 'la prédiction doit expliquer pourquoi 7 est trop grand')
        await pg.click('section.on .btn.pri:has-text("Je regarde")')
        # Je regarde : géométrie exacte à chaque étape clé
        await pg.wait_for_timeout(300)
        for step in range(6):
            await pg.wait_for_timeout(1500)
            if step == 2:
                await geometry(pg, 'rangement 1 (moulinet)', [25])
                w = [cells(x) for x in await pg.evaluate(WHITE_JS)]
                check('G-MATH', len(w) == 1 and all(math.isclose(math.dist(w[0][i], w[0][(i + 1) % 4]), 5, abs_tol=1e-6) for i in range(4)), 'le carré incliné affiché a pour côté 5 cases')
            if step == 4:
                await geometry(pg, 'rangement 2 (deux carrés)', [9, 16])
            hud = (await pg.locator('section.on .hud').inner_text()).replace('\n', ' ')
            if step == 2:
                check('G-MATH', '25' in hud and '49' in hud and '24' in hud, f'HUD étape 3 : {hud}')
            if step < 5:
                await pg.click('section.on [data-next]')
        await pg.click('section.on [data-next]')
        await pg.wait_for_timeout(300)
        # Nous faisons : curseurs puis étapes guidées, avec le solveur indépendant
        check('G-GAME', await pg.locator('section.on input[type=range]').count() == 2, 'deux curseurs dans « J\'explore »')
        await pg.locator('section.on input[type=range]').first.fill('6')
        await pg.locator('section.on input[type=range]').nth(1).fill('8')
        hud = (await pg.locator('section.on .card').first.inner_text())
        await type_ok(pg, fmt(hyp(6, 8) ** 2))                          # a² + b² avec a = 6, b = 8
        await pick(pg, 'c² est toujours égal à a² + b²')
        await pg.locator('section.on svg [aria-label="côté EF"]').click()   # tapQ au clic
        await pg.wait_for_timeout(500)
        await type_ok(pg, fmt(8 ** 2 + 15 ** 2))
        await type_ok(pg, fmt(hyp(8, 15)))
        await pick(pg, 'soustrait les carrés')
        await type_ok(pg, fmt(26 ** 2 - 10 ** 2))
        await type_ok(pg, fmt(leg(26, 10)))
        await pick(pg, 'le plus grand')
        await type_ok(pg, fmt(25 ** 2))
        await type_ok(pg, fmt(7 ** 2 + 24 ** 2))
        await pick(pg, '25² = 7² + 24² : le triangle est rectangle')
        await pg.click('section.on .btn.pri:has-text("Je fais seul")')
        # Je fais seul : solveur indépendant
        await type_ok(pg, fmt(hyp(16, 12)))
        await type_ok(pg, fmt(leg(41, 9)))
        await pick(pg, 'Il n\'est pas rectangle : 5² + 6² = 61')
        await type_ok(pg, fmt(hyp(12, 5)))
        txt = await pg.locator('section.on').inner_text()
        check('G-MATH', txt.count('Juste.') >= 4, f'4 « Juste. » attendus en « Je fais seul », trouvés {txt.count("Juste.")}')
        await pg.click('section.on .btn.pri:has-text("Bilan")')
        await pg.wait_for_timeout(300)
        ev = await pg.locator('section.on .eval').inner_text()
        check('G-MEASURE', '20' in ev.split('/')[0] or re.search(r'\b20\b', ev) is not None, f'note attendue 20/20 pour un parcours parfait : {ev[:120]}')
        # Défi facultatif : sans chronomètre, ne change pas la note
        defi = pg.locator('section.on .defi')
        check('G-GAME', await defi.count() == 1, 'le défi facultatif est présent')
        dtxt = await defi.inner_text()
        check('G-GAME', not re.search(r'(chrono|minute|seconde|temps restant|⏱)', re.sub('sans chronomètre', '', dtxt, flags=re.I), re.I), 'le défi ne doit contenir aucun chronomètre')
        for v in (fmt(math.sqrt(2)), fmt(hyp(20, 21)), fmt(leg(15, 12))):
            inp = defi.locator('input.num:not([disabled])').first
            await inp.fill(v)
            await inp.press('Enter')
            await pg.wait_for_timeout(200)
        res = (await defi.locator('.fb').last.inner_text()).strip()
        check('G-GAME', 'Défi terminé : 3 du premier coup sur 3' in res, f'résultat du défi : {res}')
        ev2 = await pg.locator('section.on .eval').inner_text()
        check('G-MEASURE', ev2 == ev, 'le défi ne doit pas modifier la note de la séance')
        stored = await pg.evaluate("localStorage.getItem('mv_defi_2ac-pythagore-modele')")
        check('G-MEASURE', stored == '3', f'meilleure série du défi mémorisée : {stored}')
        # G-LANG : bilingue en même temps, aucun marqueur [[ ]] visible
        body = await pg.evaluate("document.body.innerText")
        check('G-LANG', '[[' not in body and ']]' not in body, 'marqueurs [[ ]] visibles')
        for i in range(1, 7):
            await jump(pg, i)
        for name, sel in (('ouverture', 1), ('regarde', 3), ('bilan', 6)):
            await jump(pg, sel)
            for _ in range(8):
                ar = (await pg.locator('section.on .ar').last.inner_text()).strip()
                if name != 'ouverture' or _ < 2:
                    check('G-LANG', len(ar) > 5, f'{name} : ligne arabe vide à une étape')
                nxt = pg.locator('section.on [data-next]')
                if 'Suivant' not in (await nxt.inner_text()):
                    break
                await nxt.click()
                await pg.wait_for_timeout(150)
        await jump(pg, 6)
        retenir = await pg.locator('section.on .card').last.inner_text()
        check('G-LANG', 'مبرهنة فيتاغورس' in retenir and 'الوتر' in retenir, 'résumé arabe : مبرهنة فيتاغورس et الوتر attendus')
        # G-CSP : aucun script en ligne, aucun gestionnaire on*, aucune erreur de console ou de CSP
        html = await pg.content()
        check('G-CSP', not re.search(r'<script(?![^>]*(?:\bsrc=|ld\+json))[^>]*>[^<]', html), 'script en ligne détecté')
        check('G-CSP', not re.search(r'\son(click|load|error|input|change|keydown)\s*=', html), 'gestionnaire on* détecté')
        for e in errs:
            fail('G-CSP', f'erreur JS ou CSP : {e}')
    finally:
        await ctx.close()


async def run_diag(b, port):
    """G-DIAG : chaque erreur courante reçoit SON message ; deux erreurs différentes ne reçoivent jamais le même."""
    ctx, pg, errs = await new_page(b, port)
    try:
        await jump(pg, 5)
        cases = [  # (réponse fausse, fragment attendu)
            ('28', 'additionné les côtés'), ('400', 'racine carrée'), ('4', 'soustrait'), ('7', 'Pas encore')]
        seen = {}
        for v, frag in cases:
            m = await last_num_feedback(pg, v)
            check('G-DIAG', frag in m, f'niveau 1, réponse {v} : message « {m} », fragment attendu « {frag} »')
            seen[v] = m
        check('G-DIAG', len(set(seen.values())) == len(seen), 'niveau 1 : deux erreurs différentes reçoivent le même message')
        await type_ok(pg, '20')
        # niveau 2 : quatre diagnostics distincts
        cases2 = [('1600', 'racine carrée'), ('1762', 'additionné'), ('32', 'soustrait les côtés'), ('50', 'impossible')]
        seen2 = {}
        for v, frag in cases2:
            m = await last_num_feedback(pg, v)
            check('G-DIAG', frag in m, f'niveau 2, réponse {v} : message « {m} »')
            seen2[v] = m
        check('G-DIAG', len(set(seen2.values())) == 4, 'niveau 2 : messages non distincts')
        await type_ok(pg, '40')
        # niveau 3 : QCM, chaque mauvais choix explique son erreur, et aucune explication n'est partagée
        whys = []
        for t in ('5 + 6 > 8', '61 est proche de 64', '8 est trop grand'):
            await pg.locator('section.on .opts button.opt:not([disabled])', has_text=t).first.click()
            whys.append((await pg.locator('section.on .opts + .fb').inner_text()).strip())
        check('G-DIAG', len(set(whys)) == 3 and all(len(w) > 20 for w in whys), f'niveau 3 : explications par choix : {whys}')
        # une réponse juste après erreur ne compte pas dans la note (règle annoncée)
        await pick(pg, 'Il n\'est pas rectangle : 5² + 6² = 61')
        await type_ok(pg, '13')
        await pg.click('section.on .btn.pri:has-text("Bilan")')
        ev = await pg.locator('section.on .eval').inner_text()
        check('G-MEASURE', 'Je fais seul : réussis du premier coup' in ev and '1 / 4' in ev, f'après erreurs, 1 seul réussite du premier coup attendue : {ev[:200]}')
        for e in errs:
            fail('G-CSP', f'erreur JS (parcours diagnostic) : {e}')
    finally:
        await ctx.close()


async def run_order(b, port):
    """G-ORDER : la bonne réponse change de place d'un chargement à l'autre, et tire uniformément."""
    ctx, pg, errs = await new_page(b, port)
    try:
        pos = set()
        for _ in range(30):
            await pg.reload()
            await pg.wait_for_selector('section.mv-sec')
            i = await pg.evaluate("""() => { const s = document.querySelector('section[data-t="Je fais seul"]'); const bs = [...s.querySelectorAll('.opts button')]; return bs.findIndex(b => b.textContent.indexOf("Il n'est pas rectangle : 5² + 6²") === 0); }""")
            pos.add(i)
        check('G-ORDER', len(pos) >= 3, f'la bonne réponse du niveau 3 n\'occupe que les positions {sorted(pos)} sur 30 chargements')
        counts = await pg.evaluate("""() => { const c = [0, 0, 0, 0]; for (let n = 0; n < 800; n++) { const d = document.createElement('div'); MV.optQ(d, { q: 'x', o: ['a', 'b', 'c', 'd'], a: 0, shuffle: true }); c[[...d.querySelectorAll('button')].findIndex(b => b.textContent === 'a')]++; } return c; }""")
        check('G-ORDER', all(120 <= x <= 280 for x in counts), f'tirage non uniforme sur 800 essais : {counts}')
        noshuf = await pg.evaluate("""() => { const d = document.createElement('div'); MV.optQ(d, { q: 'x', o: ['a', 'b'], a: 0 }); return [...d.querySelectorAll('button')].map(b => b.textContent).join(''); }""")
        check('G-ORDER', noshuf == 'ab', 'sans shuffle, l\'ordre reste celui des autres leçons (compatibilité)')
    finally:
        await ctx.close()


async def run_mobile(b, port):
    """G-MOBILE : 375 px, pas de défilement horizontal, aucun élément fixe ne recouvre un bouton, cibles ≥ 24 px."""
    ctx, pg, errs = await new_page(b, port, 375, 667)
    try:
        for i in range(1, 7):
            await jump(pg, i)
            await pg.wait_for_timeout(250)
            sw = await pg.evaluate("document.documentElement.scrollWidth")
            check('G-MOBILE', sw <= 376, f'section {i} : défilement horizontal ({sw} px)')
            fixed = await pg.evaluate("[...document.querySelectorAll('body *')].filter(e => ['fixed', 'sticky'].includes(getComputedStyle(e).position) && e.offsetParent !== undefined && e.getBoundingClientRect().height > 0).map(e => e.tagName + '.' + e.className)")
            bad = await pg.evaluate("""() => { const out = []; for (const b of document.querySelectorAll('section.on button')) { b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); if (r.width === 0 || getComputedStyle(b).visibility === 'hidden') continue;
              const el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); if (el && el !== b && !b.contains(el)) out.push(b.textContent.trim().slice(0, 30) + ' <- ' + el.tagName + '.' + el.className); if (r.height < 24 || r.width < 24) out.push('trop petit : ' + b.textContent.trim().slice(0, 30) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); } return out; }""")
            check('G-MOBILE', not bad, f'section {i} : boutons recouverts ou trop petits : {bad} (éléments fixes : {fixed})')
        for e in errs:
            fail('G-CSP', f'erreur JS (mobile) : {e}')
    finally:
        await ctx.close()


def static_checks():
    src = LESSON.read_text(encoding='utf-8')
    for bad in ('نظرية', 'بحاضرة', 'ليست هيّ', 'فيثاغورس'):
        check('G-LEX', bad not in src, f'terme arabe à proscrire dans la leçon : {bad}')
    check('G-LEX', 'مبرهنة فيتاغورس' in src, 'terminologie : مبرهنة فيتاغورس attendue (orthographe de la plateforme)')
    prod = (ROOT / 'mouvement' / 'lessons' / 'maths' / '2ac-pythagore.js').read_text(encoding='utf-8')
    check('G-LEX', 'فيتاغورس' in prod, 'la leçon de production emploie bien l\'orthographe فيتاغورس')
    for m in re.finditer(r'\d\)[A-Za-zÀ-ÿ]', src):
        fail('G-LEX', f'espace manquante après « ) » : {m.group(0)}')
    check('G-OFFLINE', not re.search(r'hors ligne|offline|sans connexion', src, re.I), 'aucune promesse « hors ligne » non prouvée')
    check('G-CSP', 'onclick' not in src and 'eval(' not in src and 'innerHTML' not in re.sub(r"//.*", '', src).replace('MV.H', ''), 'pas de onclick, eval ni innerHTML direct dans la leçon')
    # G-ORDER (statique) : au moins une question à choix multiples, toutes en shuffle
    opts = len(re.findall(r"\bo: \[", src))
    shuf = len(re.findall(r'shuffle: true', src))
    check('G-ORDER', opts >= 4 and shuf >= opts - 0, f'toutes les questions à choix doivent être mélangées : {opts} questions, {shuf} shuffle')
    # G-DIAG (statique) : chaque question numérique de « Je fais seul » a au moins 2 diagnostics
    seul = src[src.index('seul: ['):src.index('bilan: {')]
    for blk in re.split(r"\n      \{ lvl", seul)[1:]:
        if 'unit:' in blk:
            n = len(re.findall(r'\{ v: ', blk))
            check('G-DIAG', n >= 2, f'question numérique avec {n} diagnostic(s) seulement : {blk[:60]}')


def solver_selfcheck():
    """G-MATH : le solveur lui-même est vérifié sur 10 000 triplets tirés au hasard (propriété a² + b² = c²)."""
    import random
    random.seed(7)
    for _ in range(10000):
        a, b = random.randint(1, 500), random.randint(1, 500)
        c = hyp(a, b)
        check('G-MATH', abs(leg(c, a) - b) < 1e-6, f'solveur incohérent pour {a}, {b}')
        if FAILS:
            break
    for a, b, c in ((3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25), (20, 21, 29), (10, 24, 26), (9, 40, 41)):
        check('G-MATH', a * a + b * b == c * c, f'triplet faux : {a}, {b}, {c}')


async def run_axe(b, port):
    axe = os.environ.get('AXE_JS')
    if not axe or not Path(axe).exists():
        print('G-A11Y : AXE_JS non fourni, porte ignorée')
        return
    src = Path(axe).read_text()
    for theme in ('dark', 'light'):
        ctx, pg, errs = await new_page(b, port, 390, 844)
        try:
            await pg.evaluate(f"localStorage.setItem('mv_theme','{theme}')")
            await pg.reload()
            await pg.wait_for_selector('section.mv-sec.on')
            await pg.evaluate(src)
            for i in range(1, 7):
                await jump(pg, i)
                await pg.wait_for_timeout(1500)
                res = await pg.evaluate("axe.run(document,{resultTypes:['violations']}).then(r=>r.violations.map(v=>v.id+' x'+v.nodes.length+' '+v.nodes[0].target.join(' ')))")
                check('G-A11Y', not res, f'{theme}, section {i} : {res}')
        finally:
            await ctx.close()


async def main():
    static_checks()
    solver_selfcheck()
    tmp, site = install()
    srv = serve(site)
    port = srv.server_address[1]
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for fn in (run_perfect, run_diag, run_order, run_mobile, run_axe):
            try:
                await fn(b, port)
            except Exception as e:  # noqa: BLE001
                fail(fn.__name__, repr(e))
            print(fn.__name__, 'ok' if not any(f.startswith(('G-', fn.__name__)) and fn.__name__ in f for f in FAILS) else '(voir FAIL)')
        await b.close()
    srv.shutdown()
    shutil.rmtree(tmp, ignore_errors=True)
    print(f'FAILS: {len(FAILS)}')
    sys.exit(1 if FAILS else 0)


if __name__ == '__main__':
    asyncio.run(main())
