#!/usr/bin/env python3
"""Vérifie la mise en page de toutes les leçons sur téléphone, tablette et ordinateur, avec la CSP réelle.

    python3 mouvement/tools/build.py && python3 mouvement/tests/layout_test.py [--shots DOSSIER]

Pour chaque page et chaque taille d'écran : erreurs de console ou de CSP, débordement horizontal,
éléments qui sortent de l'écran, boutons trop petits pour un doigt. Se termine par « FAILS: N ».
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
SUBJ = sys.argv[sys.argv.index('--subj') + 1].split(',') if '--subj' in sys.argv else ['maths', 'pc', 'svt', 'tech']
ONLY = sys.argv[sys.argv.index('--only') + 1].split(',') if '--only' in sys.argv else None
VIEWS = {
    'tel-360': dict(viewport={'width': 360, 'height': 740}, is_mobile=True, has_touch=True, device_scale_factor=2),
    'tel-390': dict(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, device_scale_factor=2),
    'tablette': dict(viewport={'width': 768, 'height': 1024}, is_mobile=True, has_touch=True),
    'ordi': dict(viewport={'width': 1366, 'height': 768}),
}
FAILS = []

AUDIT = """() => {
  const W = innerWidth, out = [];
  if (document.documentElement.scrollWidth > W + 1) out.push('débordement horizontal ' + document.documentElement.scrollWidth + ' > ' + W);
  for (const e of document.querySelectorAll('main *')) {
    if (e.closest('.stepper') || e.closest('svg')) continue;
    const r = e.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const st = getComputedStyle(e); if (st.visibility === 'hidden' || +st.opacity === 0) continue;
    if (r.right > W + 1 || r.left < -1) out.push('hors écran : ' + e.tagName.toLowerCase() + '.' + e.className + ' ' + Math.round(r.left) + '..' + Math.round(r.right));
    if (out.length > 4) break;
  }
  if (matchMedia('(pointer: coarse)').matches) {
    for (const b of document.querySelectorAll('main button, main input')) {
      const r = b.getBoundingClientRect(); if (!r.width) continue;
      if (b.type === 'checkbox') { const l = b.closest('label'); if (l && l.getBoundingClientRect().height >= 34) continue; }
      if (b.type === 'range') { if (r.height < 20) out.push('curseur trop petit ' + Math.round(r.height)); continue; }
      if (r.height < 34) { out.push('bouton trop petit (' + Math.round(r.height) + ' px) : ' + (b.textContent || b.className).trim().slice(0, 30)); break; }
    }
  }
  return out;
}"""


def csp(d):
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
    h = type('H', (Handler,), {'csp': csp(d)})
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', port), functools.partial(h, directory=str(d)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


async def check_page(ctx, url, label, sections, shot):
    page = await ctx.new_page()
    errs = []
    page.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errs.append(str(e)))
    await page.goto(url, wait_until='load')
    await page.wait_for_timeout(250)
    probs = []
    n = await page.locator('.stepper button').count() if sections else 0
    for i in range(max(1, n)):
        if n:
            await page.locator('.stepper button').nth(i).click()
            await page.wait_for_timeout(200)
        for p in await page.evaluate(AUDIT):
            probs.append(('section %d : ' % (i + 1) if n else '') + p)
        if shot and SHOTS and i in (0, 2, 4):
            await page.screenshot(path=str(SHOTS / ('%s-%d.png' % (shot, i + 1))), full_page=False)
    for e in errs:
        probs.append('console : ' + e[:120])
    await page.close()
    for p in dict.fromkeys(probs):
        FAILS.append('%s : %s' % (label, p)); print('FAIL', FAILS[-1], flush=True)


async def main():
    if SHOTS:
        SHOTS.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as pw:
        br = await pw.chromium.launch()
        for s in SUBJ:
            port = 8851 + ['maths', 'pc', 'svt', 'tech'].index(s)
            d = DIST / s
            srv = serve(d, port)
            base = 'http://127.0.0.1:%d/' % port
            ids = sorted(p.parent.name for p in d.glob('*/index.html') if (d / 'lessons' / (p.parent.name + '.js')).exists())
            if ONLY:
                ids = [i for i in ids if s + '/' + i in ONLY]
            for vname, vopt in VIEWS.items():
                ctx = await br.new_context(**vopt)
                await ctx.route('https://taalim-relay.abderrahim-habz.workers.dev/**', lambda r: r.fulfill(status=200, body='ok'))  # relais Telegram simulé
                await check_page(ctx, base, '%s/accueil [%s]' % (s, vname), False, '%s-accueil-%s' % (s, vname))
                await check_page(ctx, base + 'examen/', '%s/examen [%s]' % (s, vname), False, '%s-examen-%s' % (s, vname))
                for i in ids:
                    shot = '%s-%s-%s' % (s, i, vname) if (SHOTS and i == ids[0]) else None
                    await check_page(ctx, base + i + '/', '%s/%s [%s]' % (s, i, vname), True, shot)
                await ctx.close()
                print(s, vname, len(ids), 'leçons, problèmes cumulés :', len(FAILS), flush=True)
            srv.shutdown()
        await br.close()
    for f in FAILS[:200]:
        print('FAIL', f)
    print('FAILS:', len(FAILS))


if __name__ == '__main__':
    asyncio.run(main())
