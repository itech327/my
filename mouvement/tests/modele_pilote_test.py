#!/usr/bin/env python3
"""Garde-fous des modèles pilotes (docs/registre-erreurs-et-garde-fous.md, branche plan/modeles-pro).

    python3 mouvement/tools/build.py && python3 mouvement/tests/modele_pilote_test.py
    MODEL=2ac-air-modele python3 mouvement/tests/modele_pilote_test.py     # un seul modèle
    PILOT_FILE=autre.js MODEL=2ac-pythagore-modele python3 …                # variante d'un modèle (tests de mutation)

Les leçons vivent dans mouvement/modeles/<matière>/ (jamais publiées). Le test installe chaque modèle dans une copie
temporaire de dist/<matière>, la sert avec la CSP réelle du fichier _headers, puis la parcourt comme un élève.
Les parcours et les erreurs courantes à tester sont décrits dans modeles_specs.py. Se termine par « FAILS: N ».

Portes : G-GRID, G-MATH, G-DIAG, G-ORDER, G-LANG, G-LEX, G-KEYS, G-MOBILE, G-CSP, G-GAME, G-MEASURE, G-OFFLINE, G-A11Y (avec AXE_JS).
"""
import asyncio
import functools
import http.server
import itertools
import json
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
sys.path.insert(0, str(Path(__file__).resolve().parent))
import build  # noqa: E402
from modeles_specs import SPECS  # noqa: E402

OX, OY, U = 75, 36, 30          # grille du modèle Pythagore
FAILS = []
CUR = {}                        # modèle en cours : id, spec, fichier


def fail(gate, msg):
    FAILS.append(f'[{CUR.get("id", "?")}] {gate}: {msg}')
    print('FAIL', CUR.get('id', '?'), gate, msg)


def check(gate, cond, msg):
    if not cond:
        fail(gate, msg)
    return cond


# ---------- géométrie exacte (modèle Pythagore) ----------
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
def install(mid, lesson_file, subject):
    tmp = Path(tempfile.mkdtemp(prefix='pilote-'))
    site = tmp / subject
    shutil.copytree(ROOT / 'mouvement' / 'dist' / subject, site)
    shutil.copy(lesson_file, site / 'lessons' / (mid + '.js'))
    meta = json.loads(re.match(r'/\* @meta (\{.*?\}) \*/', Path(lesson_file).read_text(encoding='utf-8')).group(1))
    (site / mid).mkdir()
    (site / mid / 'index.html').write_text(build.lesson_page(subject, build.SUBJECTS[subject], meta), encoding='utf-8')
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
    await pg.goto(f'http://127.0.0.1:{port}/{CUR["id"]}/')
    await pg.wait_for_selector('section.mv-sec.on')
    return ctx, pg, errs


# ---------- assistants de parcours (utilisés aussi par modeles_specs.py) ----------
async def step_count(pg):
    return await pg.locator('section.on .dots i').count()


async def nexts(pg, n):
    for _ in range(n):
        await pg.click('section.on [data-next]')
        await pg.wait_for_timeout(200)


async def jump(pg, i):
    await pg.click(f'nav.stepper button:nth-child({i})')
    await pg.wait_for_timeout(150)


async def type_ok(pg, v, scope='section.on'):
    inp = pg.locator(f'{scope} input.num:not([disabled])').first
    await inp.fill(str(v))
    await inp.press('Enter')                                            # G-KEYS : Entrée valide
    await pg.wait_for_timeout(500)


async def pick(pg, text, exact=False, scope='section.on'):
    pat = re.compile('^' + re.escape(text) + '$') if exact else text
    await pg.locator(f'{scope} .opts:has(button:not([disabled])) button.opt:not([disabled])', has_text=pat).first.click()
    await pg.wait_for_timeout(450)


async def diag_num(pg, cases):
    """Pour chaque réponse fausse : le message contient le fragment attendu, et deux erreurs ne reçoivent jamais le même message."""
    seen = {}
    for v, frag in cases:
        inp = pg.locator('section.on input.num:not([disabled])').first
        box = inp.locator('xpath=ancestor::div[1]/parent::div')
        await inp.fill(str(v))
        await inp.press('Enter')
        await pg.wait_for_timeout(120)
        m = (await box.locator('.fb').inner_text()).strip()
        check('G-DIAG', frag in m, f'réponse {v} : message « {m} », fragment attendu « {frag} »')
        seen[v] = m
    check('G-DIAG', len(set(seen.values())) == len(seen), f'deux erreurs différentes reçoivent le même message : {seen}')


async def diag_opt(pg, cases):
    seen = []
    for text, frag in cases:
        b = pg.locator('section.on .opts button.opt:not([disabled])', has_text=text).first
        fbox = b.locator('xpath=ancestor::div[contains(@class,"opts")][1]/following-sibling::div[contains(@class,"fb")][1]')
        handle = await fbox.element_handle()                          # résolu avant le clic : le bouton devient disabled ensuite
        await b.click()
        m = (await handle.inner_text()).strip()
        check('G-DIAG', frag in m, f'choix « {text} » : message « {m} », fragment attendu « {frag} »')
        seen.append(m)
    check('G-DIAG', len(set(seen)) == len(seen) and all(len(x) > 20 for x in seen), f'explications par choix : {seen}')


async def defi_nums(pg, nums, opt=None):
    defi = pg.locator('section.on .defi')
    for v in nums:
        inp = defi.locator('input.num:not([disabled])').first
        await inp.fill(v)
        await inp.press('Enter')
        await pg.wait_for_timeout(250)
    if opt:
        await pick(pg, opt, scope='section.on .defi')


# ---------- G-GRID / G-MATH : lecture des sommets réels (modèle Pythagore) ----------
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
    white = [cells(w) for w in await pg.evaluate(WHITE_JS)]               # zones lues dans la page, pas recopiées ici
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
    check('G-MATH', abs(24 + sum(area(w) for w in white) - 49) < 1e-6, f'{label}: 24 + blanc ≠ 49')


async def pyth_regarde_hook(pg, step):
    if step == 2:
        await geometry(pg, 'rangement 1 (moulinet)', [25])
        w = [cells(x) for x in await pg.evaluate(WHITE_JS)]
        check('G-MATH', len(w) == 1 and all(math.isclose(math.dist(w[0][i], w[0][(i + 1) % 4]), 5, abs_tol=1e-6) for i in range(4)), 'le carré incliné affiché a pour côté 5 cases')
        hud = (await pg.locator('section.on .hud').inner_text()).replace('\n', ' ')
        check('G-MATH', '25' in hud and '49' in hud and '24' in hud, f'HUD étape 3 : {hud}')
    if step == 4:
        await geometry(pg, 'rangement 2 (deux carrés)', [9, 16])


# ---------- parcours parfait ----------
async def run_perfect(b, port, spec):
    ctx, pg, errs = await new_page(b, port)
    try:
        check('G-GAME', await pg.locator('section.on').count() == 1, 'une seule section visible au départ')
        n = await step_count(pg)
        check('G-LANG', n >= 3, f'ouverture : {n} étapes')
        for i in range(n):                                              # G-LANG : une ligne arabe à chaque étape de l'ouverture
            ar = (await pg.locator('section.on .ar').last.inner_text()).strip()
            check('G-LANG', len(ar) > 5, f'ouverture, étape {i + 1} : ligne arabe vide')
            await pg.click('section.on [data-next]')
            await pg.wait_for_timeout(200)
        # Je me prépare : la première affirmation est un pari
        for i, t in enumerate(spec['truth']):
            await pg.locator('section.on .tf').nth(i).locator('button').nth(0 if t else 1).click()
        txt = await pg.locator('section.on .fb').first.inner_text()
        check('G-HINT', len(txt) > 40, 'la première affirmation (le pari) doit expliquer la réponse en une phrase')
        await pg.click('section.on .btn.pri:has-text("Je regarde")')
        await pg.wait_for_timeout(300)
        # Je regarde
        n = await step_count(pg)
        for step in range(n):
            await pg.wait_for_timeout(1500)
            ar = (await pg.locator('section.on .ar').last.inner_text()).strip()
            check('G-LANG', len(ar) > 5, f'regarde, étape {step + 1} : ligne arabe vide')
            if spec.get('geometry'):
                await pyth_regarde_hook(pg, step)
            await pg.click('section.on [data-next]')
        await pg.wait_for_timeout(300)
        # Nous faisons, Je fais seul : réponses calculées par le solveur indépendant des plans
        await spec['faisons'](pg, sys.modules[__name__])
        await pg.click('section.on .btn.pri:has-text("Je fais seul")')
        await spec['seul'](pg, sys.modules[__name__])
        txt = await pg.locator('section.on').inner_text()
        check('G-MATH', txt.count('Juste.') >= 4, f'4 « Juste. » attendus en « Je fais seul », trouvés {txt.count("Juste.")}')
        await pg.click('section.on .btn.pri:has-text("Bilan")')
        await pg.wait_for_timeout(300)
        ev = await pg.locator('section.on .eval').inner_text()
        check('G-MEASURE', re.search(r'\b20\b', ev) is not None, f'note attendue 20/20 pour un parcours parfait : {ev[:120]}')
        # défi facultatif : sans chronomètre, hors note
        defi = pg.locator('section.on .defi')
        check('G-GAME', await defi.count() == 1, 'le défi facultatif est présent')
        dtxt = await defi.inner_text()
        check('G-GAME', not re.search(r'(chrono|minuteur|compte à rebours|temps restant|⏱)', re.sub('sans chronomètre', '', dtxt, flags=re.I), re.I), 'le défi ne doit contenir aucun chronomètre')
        await spec['defi'](pg, sys.modules[__name__])
        res = (await defi.locator('.fb').last.inner_text()).strip()
        dn = spec['defi_n']
        check('G-GAME', f'Défi terminé : {dn} du premier coup sur {dn}' in res, f'résultat du défi : {res}')
        check('G-MEASURE', (await pg.locator('section.on .eval').inner_text()) == ev, 'le défi ne doit pas modifier la note de la séance')
        stored = await pg.evaluate(f"localStorage.getItem('mv_defi_{CUR['id']}')")
        check('G-MEASURE', stored == str(dn), f'meilleure série du défi mémorisée : {stored}')
        # G-LANG : aucune marque [[ ]] visible ; résumé arabe
        body = await pg.evaluate("document.body.innerText")
        check('G-LANG', '[[' not in body and ']]' not in body, 'marqueurs [[ ]] visibles')
        await jump(pg, 6)
        await pg.wait_for_timeout(2500)
        for _ in range(8):
            ar = (await pg.locator('section.on .scn .ar').last.inner_text()).strip()
            check('G-LANG', len(ar) > 5, 'bilan : ligne arabe vide à une étape')
            nxt = pg.locator('section.on [data-next]')
            if 'Suivant' not in (await nxt.inner_text()):
                break
            await nxt.click()
            await pg.wait_for_timeout(200)
        retenir = await pg.locator('section.on .card').last.inner_text()
        for term in spec['retenir_ar']:
            check('G-LANG', term in retenir, f'résumé arabe : « {term} » attendu')
        # G-CSP
        html = await pg.content()
        check('G-CSP', not re.search(r'<script(?![^>]*(?:\bsrc=|ld\+json))[^>]*>[^<]', html), 'script en ligne détecté')
        check('G-CSP', not re.search(r'\son(click|load|error|input|change|keydown)\s*=', html), 'gestionnaire on* détecté')
        for e in errs:
            fail('G-CSP', f'erreur JS ou CSP : {e}')
    finally:
        await ctx.close()


async def run_diag(b, port, spec):
    """G-DIAG : chaque erreur courante reçoit SON message ; une réponse juste après erreur ne compte pas dans la note."""
    ctx, pg, errs = await new_page(b, port)
    try:
        await jump(pg, 5)
        await spec['diag'](pg, sys.modules[__name__])
        await pg.click('section.on .btn.pri:has-text("Bilan")')
        ev = await pg.locator('section.on .eval').inner_text()
        k = spec['first_try_after_diag']
        check('G-MEASURE', f'Je fais seul : réussis du premier coup\n{k} / 4' in ev.replace('\t', '\n') or f'{k} / 4' in ev, f'réussites du premier coup attendues : {k} / 4 ; trouvé : {ev[:200]}')
        for e in errs:
            fail('G-CSP', f'erreur JS (parcours diagnostic) : {e}')
    finally:
        await ctx.close()


async def run_order(b, port, spec):
    """G-ORDER : la bonne réponse change de place d'un chargement à l'autre, et tire uniformément."""
    ctx, pg, errs = await new_page(b, port)
    try:
        pos = set()
        pref = json.dumps(spec['order_prefix'])
        for _ in range(30):
            await pg.reload()
            await pg.wait_for_selector('section.mv-sec')
            i = await pg.evaluate(f"""() => {{ const s = document.querySelector('section[data-t="Je fais seul"]'); for (const o of s.querySelectorAll('.opts')) {{ const bs = [...o.querySelectorAll('button')]; const k = bs.findIndex(b => b.textContent.indexOf({pref}) === 0); if (k >= 0) return k; }} return -1; }}""")
            pos.add(i)
        check('G-ORDER', -1 not in pos and len(pos) >= 3, f'la bonne réponse n\'occupe que les positions {sorted(pos)} sur 30 chargements')
        counts = await pg.evaluate("""() => { const c = [0, 0, 0, 0]; for (let n = 0; n < 800; n++) { const d = document.createElement('div'); MV.optQ(d, { q: 'x', o: ['a', 'b', 'c', 'd'], a: 0, shuffle: true }); c[[...d.querySelectorAll('button')].findIndex(b => b.textContent === 'a')]++; } return c; }""")
        check('G-ORDER', all(120 <= x <= 280 for x in counts), f'tirage non uniforme sur 800 essais : {counts}')
        noshuf = await pg.evaluate("""() => { const d = document.createElement('div'); MV.optQ(d, { q: 'x', o: ['a', 'b'], a: 0 }); return [...d.querySelectorAll('button')].map(b => b.textContent).join(''); }""")
        check('G-ORDER', noshuf == 'ab', 'sans shuffle, l\'ordre reste celui des autres leçons (compatibilité)')
    finally:
        await ctx.close()


async def run_mobile(b, port, spec):
    """G-MOBILE : 375 px, pas de défilement horizontal, aucun élément fixe ne recouvre un bouton, cibles ≥ 24 px."""
    ctx, pg, errs = await new_page(b, port, 375, 667)
    try:
        for i in range(1, 7):
            await jump(pg, i)
            await pg.wait_for_timeout(250)
            sw = await pg.evaluate("document.documentElement.scrollWidth")
            check('G-MOBILE', sw <= 376, f'section {i} : défilement horizontal ({sw} px)')
            fixed = await pg.evaluate("[...document.querySelectorAll('body *')].filter(e => ['fixed', 'sticky'].includes(getComputedStyle(e).position) && e.getBoundingClientRect().height > 0).map(e => e.tagName + '.' + e.className)")
            bad = await pg.evaluate("""() => { const out = []; for (const b of document.querySelectorAll('section.on button')) { b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); if (r.width === 0 || getComputedStyle(b).visibility === 'hidden') continue;
              const el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); if (el && el !== b && !b.contains(el)) out.push(b.textContent.trim().slice(0, 30) + ' <- ' + el.tagName + '.' + el.className); if (r.height < 24 || r.width < 24) out.push('trop petit : ' + b.textContent.trim().slice(0, 30) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); } return out; }""")
            check('G-MOBILE', not bad, f'section {i} : boutons recouverts ou trop petits : {bad} (éléments fixes : {fixed})')
        for e in errs:
            fail('G-CSP', f'erreur JS (mobile) : {e}')
    finally:
        await ctx.close()


async def run_offline(b, site, spec):
    """G-OFFLINE : la leçon fonctionne depuis un dossier local (file://) sans aucun réseau."""
    ctx = await b.new_context(viewport={'width': 1366, 'height': 768}, offline=True)
    try:
        pg = await ctx.new_page()
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(f'file://{site}/{CUR["id"]}/index.html')
        await pg.wait_for_selector('section.mv-sec.on', timeout=5000)
        check('G-OFFLINE', await pg.locator('section.mv-sec').count() == 6, 'les six sections se construisent sans réseau')
        fonts = await pg.evaluate("document.fonts.ready.then(() => [...document.fonts].filter(f => f.status === 'loaded').length)")
        check('G-OFFLINE', fonts > 0, 'les polices locales se chargent sans réseau')
        await pg.click('section.on [data-next]')
        check('G-OFFLINE', not errs, f'erreurs JS hors ligne : {errs}')
    finally:
        await ctx.close()


def static_checks(spec, src):
    for bad in spec['forbidden_ar']:
        check('G-LEX', bad not in src, f'terme arabe à proscrire dans la leçon : {bad}')
    for need in spec['required_ar']:
        check('G-LEX', need in src, f'terminologie : « {need} » attendu')
    for m in re.finditer(r'\d\)[A-Za-zÀ-ÿ]', src):
        fail('G-LEX', f'espace manquante après « ) » : {m.group(0)}')
    check('G-OFFLINE', not re.search(r'hors ligne|offline|sans connexion', src, re.I), 'aucune promesse « hors ligne » dans le texte de la leçon')
    check('G-CSP', 'onclick' not in src and 'eval(' not in src, 'pas de onclick ni eval dans la leçon')
    opts = len(re.findall(r"\bo: \[", src))
    shuf = len(re.findall(r'shuffle: true', src))
    check('G-ORDER', opts >= 4 and shuf >= opts, f'toutes les questions à choix doivent être mélangées : {opts} questions, {shuf} shuffle')
    # tous les choix d'une question à choix ont une explication « why » quand la question est en shuffle
    check('G-DIAG', len(re.findall(r'why: \[', src)) >= opts, f'chaque question à choix doit expliquer ses erreurs : {opts} questions, {len(re.findall("why: " + chr(92) + "[", src))} why')
    seul = src[src.index('seul: ['):src.index('bilan: {')]
    for blk in re.split(r"\n      \{ lvl", seul)[1:]:
        if re.search(r"\bo: \[", blk) is None:
            n = len(re.findall(r'\{ v: ', blk))
            check('G-DIAG', n >= 2, f'question numérique avec {n} diagnostic(s) seulement : {blk[:60]}')
    check('G-GAME', 'defi: [' in src, 'un défi facultatif est prévu')
    check('G-GENERAL', src.count('Devine') + src.count('parie') >= 2, 'un pari ou une devinette est demandé avant la révélation')


def solver_selfcheck():
    """G-MATH : le solveur est vérifié sur 10 000 triplets tirés au hasard (propriété a² + b² = c²), et les décimaux de pourcentage."""
    import random
    random.seed(7)
    for _ in range(10000):
        a, b = random.randint(1, 500), random.randint(1, 500)
        c = math.sqrt(a * a + b * b)
        if abs(math.sqrt(c * c - a * a) - b) > 1e-6:
            fail('G-MATH', f'solveur incohérent pour {a}, {b}')
            break
    for a, b, c in ((3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25), (20, 21, 29), (10, 24, 26), (9, 40, 41)):
        check('G-MATH', a * a + b * b == c * c, f'triplet faux : {a}, {b}, {c}')
    for pct, vol in ((21, 200), (21, 500), (78, 200), (78, 50)):
        check('G-MATH', abs(pct / 100 * vol - pct * vol / 100) < 1e-9, 'pourcentage')


async def run_axe(b, port, spec):
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
                await pg.wait_for_timeout(2200)
                res = await pg.evaluate("axe.run(document,{resultTypes:['violations']}).then(r=>r.violations.map(v=>v.id+' x'+v.nodes.length+' '+v.nodes[0].target.join(' ')))")
                check('G-A11Y', not res, f'{theme}, section {i} : {res}')
        finally:
            await ctx.close()


async def main():
    solver_selfcheck()
    only = [m for m in os.environ.get('MODEL', '').split(',') if m]
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for mid, spec in SPECS.items():
            if only and mid not in only:
                continue
            f = Path(os.environ['PILOT_FILE']) if os.environ.get('PILOT_FILE') and len(only) == 1 else ROOT / 'mouvement' / 'modeles' / spec['subject'] / f'{mid}.js'
            CUR.update(id=mid, spec=spec, file=f)
            static_checks(spec, f.read_text(encoding='utf-8'))
            tmp, site = install(mid, f, spec['subject'])
            srv = serve(site)
            port = srv.server_address[1]
            before = len(FAILS)
            for fn in (run_perfect, run_diag, run_order, run_mobile, run_axe):
                try:
                    await fn(b, port, spec)
                except Exception as e:  # noqa: BLE001
                    fail(fn.__name__, repr(e)[:300])
            try:
                await run_offline(b, site, spec)
            except Exception as e:  # noqa: BLE001
                fail('run_offline', repr(e)[:300])
            print(mid, 'ok' if len(FAILS) == before else f'KO ({len(FAILS) - before})')
            srv.shutdown()
            shutil.rmtree(tmp, ignore_errors=True)
        await b.close()
    print(f'FAILS: {len(FAILS)}')
    sys.exit(1 if FAILS else 0)


if __name__ == '__main__':
    asyncio.run(main())
