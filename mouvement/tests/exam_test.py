#!/usr/bin/env python3
"""Teste les examens (3 matières × 3 niveaux × 3 difficultés), la note d'une leçon et le plein écran.

    python3 mouvement/tools/build.py && python3 mouvement/tests/exam_test.py [--shots DOSSIER]

Chaque examen est passé deux fois : toutes les réponses justes (note 20) puis « Je ne sais pas » partout (note 0).
Se termine par « FAILS: N ».
"""
import asyncio
import sys
from pathlib import Path

from playwright.async_api import async_playwright

sys.path.insert(0, str(Path(__file__).parent))
from layout_test import DIST, serve  # noqa: E402

SHOTS = Path(sys.argv[sys.argv.index('--shots') + 1]) if '--shots' in sys.argv else None
FAILS = []

# trouve la bonne réponse de la question affichée dans window.MVQ
SOLVE = """() => {
  const q = document.querySelector('#ex .card .q').innerHTML.replace(/^Vrai ou faux \\? /, '');
  const d = document.createElement('div'), norm = (t) => { d.innerHTML = t; return d.innerHTML; };
  const fx = (t) => { d.innerHTML = t; return d.textContent; };
  const shown = [...document.querySelectorAll('#ex .opts button')].map(b => b.textContent);
  for (const l of window.MVQ) {
    for (const p of l.prepare) if (norm(p.q) === q) return {opt: p.a ? 'Vrai' : 'Faux', bad: p.a ? 'Faux' : 'Vrai'};
    for (const s of l.seul) if (norm(s.q) === q && (!s.o || s.o.every(o => shown.includes(fx(o))))) return s.o ? {opt: fx(s.o[s.a]), bad: fx(s.o[(s.a + 1) % s.o.length])} : {num: String(s.a).replace('.', ',')};
  }
  return null;
}"""


def fail(m):
    FAILS.append(m)
    print('FAIL', m, flush=True)


async def click_text(page, t, label):
    ok = await page.evaluate("""(t) => { const b = [...document.querySelectorAll('#ex .opts button')].find(x => x.textContent === t);
      if (b) b.click(); return !!b; }""", t)
    if not ok:
        fail(label + ' : option introuvable ' + t)


async def take(page, label, good):
    await page.get_by_role('button', name="Commencer l'examen ▶").click()
    n = 0
    while await page.locator('.note20').count() == 0 and n < 25:
        s = await page.evaluate(SOLVE)
        if not s:
            fail(label + ' : question introuvable'); return
        if good:
            if 'opt' in s:
                await click_text(page, s['opt'], label)
            else:
                await page.fill('#ex input.num', s['num']); await page.get_by_role('button', name='Valider').click()
        else:
            if 'bad' in s:
                await click_text(page, s['bad'], label)
            else:
                await page.get_by_role('button', name='Je ne sais pas').click()
        n += 1
    note = await page.locator('.note20 b').inner_text()
    ncorr = await page.locator('.corr').count()
    if ncorr != n or n == 0:
        fail('%s : %d questions, %d corrections' % (label, n, ncorr))
    if good and note != '20':
        fail('%s : toutes justes mais note %s' % (label, note))
    if good and await page.locator('.corr.ko').count():
        fail(label + ' : réponse juste comptée fausse')
    return n


async def main():
    if SHOTS:
        SHOTS.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as pw:
        br = await pw.chromium.launch()
        for port, s in enumerate(['maths', 'pc', 'svt'], 8861):
            srv = serve(DIST / s, port)
            base = 'http://127.0.0.1:%d/' % port
            ctx = await br.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
            page = await ctx.new_page()
            errs = []
            page.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
            page.on('pageerror', lambda e: errs.append(str(e)))
            await page.goto(base + 'examen/')
            for lvl in '123':
                await page.get_by_role('button', name=lvl + 'AC', exact=True).click()
                for d, dn in enumerate(['Niveau 1', 'Niveau 2', 'Niveau 3'], 1):
                    await page.locator('.diff').filter(has_text=dn).click()
                    for nq in (10, 20):
                        await page.get_by_role('button', name='%d questions' % nq).click()
                        label = '%s %sAC difficulté %d, %d q' % (s, lvl, d, nq)
                        n = await take(page, label, True)
                        if SHOTS and lvl == '2' and d == 2 and nq == 10:
                            await page.screenshot(path=str(SHOTS / ('%s-examen-resultat.png' % s)), full_page=False)
                        await page.get_by_role('button', name='Changer de niveau').click()
                        print(label, ':', n, 'questions, 20/20', flush=True)
                    await take(page, label + ' sans réponse', False)
                    if await page.locator('.note20 b').inner_text() != '0':
                        fail(label + ' : sans réponse mais note non nulle')
                    await page.get_by_role('button', name='Changer de niveau').click()
            # thème seul
            await page.get_by_role('button', name='1AC', exact=True).click()
            await page.locator('.wrapseg .btn').nth(1).click()
            await take(page, s + ' thème', True)
            await page.get_by_role('button', name='Changer de niveau').click()
            if SHOTS:
                await page.screenshot(path=str(SHOTS / ('%s-examen-choix.png' % s)), full_page=True)
            for e in errs:
                fail('%s examen console : %s' % (s, e[:150]))
            # accueil : lien vers les examens
            await page.goto(base)
            if await page.locator('a.exam').count() != 1:
                fail(s + ' : lien examens absent de l\'accueil')
            await ctx.close()
            srv.shutdown()

        # note d'une leçon, badge sur l'accueil, plein écran
        srv = serve(DIST / 'maths', 8870)
        base = 'http://127.0.0.1:8870/'
        ctx = await br.new_context(viewport={'width': 1366, 'height': 768})
        page = await ctx.new_page()
        await page.goto(base + '1ac-cercle/')
        await page.get_by_role('button', name='Plein écran').click()
        await page.wait_for_timeout(300)
        if not await page.evaluate('!!document.fullscreenElement'):
            fail('plein écran non activé')
        if 'Quitter' not in await page.locator('.fsbtn').inner_text():
            fail('bouton plein écran non mis à jour')
        if SHOTS:
            await page.screenshot(path=str(SHOTS / 'maths-plein-ecran.png'))
        await page.locator('.fsbtn').click()
        await page.wait_for_timeout(300)
        if await page.evaluate('!!document.fullscreenElement'):
            fail('sortie du plein écran impossible')
        await page.locator('.stepper button').nth(1).click()
        for i in range(await page.locator('.mv-sec.on .tf').count()):
            await page.locator('.mv-sec.on .tf').nth(i).locator('button').first.click()
        await page.locator('.stepper button').nth(4).click()
        sec = page.locator('.mv-sec.on')
        await sec.locator('input.num').nth(0).fill('11')
        await sec.locator('button', has_text='Vérifier').nth(0).click()
        await sec.locator('input.num').nth(0).fill('12')
        await sec.locator('button', has_text='Vérifier').nth(0).click()
        await sec.locator('input.num').nth(1).fill('4,5')
        await sec.locator('button', has_text='Vérifier').nth(1).click()
        await sec.locator('.opts button', has_text='intérieur').click()
        await sec.locator('input.num').nth(2).fill('16')
        await sec.locator('button', has_text='Vérifier').nth(2).click()
        await page.get_by_role('button', name='Bilan ▶').click()
        txt = await page.locator('.eval').inner_text()
        if '3 / 4' not in txt or '/ 20' not in txt:
            fail('évaluation de leçon incorrecte : ' + txt.replace('\n', ' | '))
        else:
            print('leçon :', ' | '.join(t for t in txt.split('\n') if t.strip())[:200])
        if SHOTS:
            await page.locator('.eval').screenshot(path=str(SHOTS / 'maths-evaluation-lecon.png'))
        await page.goto(base)
        badge = await page.locator('[data-lesson="1ac-cercle"] .badge').all_inner_texts()
        if not badge:
            fail('note absente de l\'accueil')
        else:
            print('accueil :', badge[0])
        await ctx.close()
        srv.shutdown()
        await br.close()
    print('FAILS:', len(FAILS))


asyncio.run(main())
