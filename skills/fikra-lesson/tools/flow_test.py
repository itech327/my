"""Flow test for a « Le concept en main » lesson (engine v1.3).

  python3 flow_test.py LESSON.html [--shots DIR] [--n 40]

Opens the lesson at phone width (420 px) with ?test, then checks:
  1. the engine's own validation found no problem;
  2. every prediction can be answered and the next moment unlocks only then;
  3. the experiment gate opens once the required missions are done;
  4. the proof flap opens and each wrong prediction gets its misconception text;
  5. for each exercise level, N generated exercises: every trap value is diagnosed
     with its own misconception, and the right answer is accepted;
  6. the check questions produce the report;
  7. no page error, no horizontal overflow at 420 px, file under 150 KB;
  8. every Darija audio file referenced exists next to the lesson (or is inlined by `bundle`) and stays under 400 KB;
  9. nothing gives the answer away before its time: no verdict or misconception text on screen before a
     prediction is made, the proof covered and hidden from screen readers until the flap is lifted,
     no exercise answer printed in its own question;
 10. only first tries count as unassisted in the report;
 11. every text on screen keeps a readable contrast (4.5:1, or 3:1 for large text), in light AND dark mode.
Exit code 1 on any failure.
"""
import os, re, sys, argparse
from playwright.sync_api import sync_playwright

def fmt(x):
    s = ('%.6f' % x).rstrip('0').rstrip('.')
    return s.replace('.', ',')

CONTRAST_JS = r'''() => {
  // any CSS colour (rgb, color(srgb …), oklab from color-mix or light-dark) → RGBA through one canvas pixel
  const cx = document.createElement('canvas').getContext('2d', { willReadFrequently: true }); cx.canvas.width = cx.canvas.height = 1;
  const lum = c => { if (!c || c === 'none') return null; cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
    const [r, g, b, A] = cx.getImageData(0, 0, 1, 1).data, f = v => { v = v / 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
    return { L: .2126 * f(r) + .7152 * f(g) + .0722 * f(b), a: A / 255 }; };
  const bgOf = el => { for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none') return null; const c = lum(cs.backgroundColor); if (c && c.a > .9) return c.L; } return lum(getComputedStyle(document.body).backgroundColor).L; };
  const bad = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!el.checkVisibility || !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); if (!own) continue;
    if (el.closest('[inert]') || el.closest(':disabled')) continue;   // inactive controls are exempt (WCAG 1.4.3)
    const cs = getComputedStyle(el), svg = el instanceof SVGElement, fg = lum(svg ? (cs.fill !== 'none' ? cs.fill : cs.color) : cs.color); if (!fg) continue;
    const bg = bgOf(svg ? el.closest('svg').parentElement : el); if (bg === null) continue;
    const ratio = (Math.max(fg.L, bg) + .05) / (Math.min(fg.L, bg) + .05), size = parseFloat(cs.fontSize), large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
    if (ratio < (large ? 3 : 4.5)) bad.push(`${el.tagName.toLowerCase()} « ${el.textContent.trim().slice(0, 30)} » ${ratio.toFixed(2)}:1`);
  }
  return bad;
}'''

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('lesson'); ap.add_argument('--shots'); ap.add_argument('--n', type=int, default=40)
    a = ap.parse_args(); path = os.path.abspath(a.lesson); fails = []
    def check(cond, msg):
        if not cond: fails.append(msg); print('FAIL', msg)
    import re as _re
    size = os.path.getsize(path)
    inlined = sum(len(m) for m in _re.findall(r'data:audio/[\w-]+;base64,([\w+/=]+)', open(path, encoding='utf-8').read()))
    size -= inlined  # a bundled lesson carries its audio inside; the 150 KB budget is for the lesson itself
    check(size < 150_000, f'file is {size // 1024} KB, budget is 150 KB')
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 420, 'height': 900})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text and 'ERR_' not in m.text else None)
        pg.emulate_media(reduced_motion='reduce')
        pg.goto('file://' + path + '?test'); pg.wait_for_timeout(400)
        F = 'window.__fikra'
        check(pg.evaluate(f'!!{F}'), 'engine did not start (no window.__fikra)')
        if fails: print('\n'.join(errs)); sys.exit(1)
        problems = pg.evaluate(f'{F}.problems'); check(not problems, 'validation: ' + '; '.join(problems))
        L = pg.evaluate(f'(() => {{ const L = {F}.L; return {{ predict: L.predict, check: L.check, mis: L.misconceptions, missions: L.experiment.missions.map(m => m.id), required: L.experiment.required || [L.experiment.missions[0].id], levels: L.exercises.levels.map(l => l.label) }}; }})()')
        def overflow(tag):
            w = pg.evaluate('document.documentElement.scrollWidth'); check(w <= 420, f'horizontal overflow at {tag}: {w}px')
        def shot(n):
            if a.shots: os.makedirs(a.shots, exist_ok=True); pg.locator(f'#m{n}').screenshot(path=os.path.join(a.shots, f'm{n}.png'))
        audios = pg.evaluate('[...document.querySelectorAll("[data-audio]")].map(b => b.dataset.audio)')
        for au in audios:
            if au.startswith('data:'):
                check(len(au) * 3 // 4 < 400_000, 'inlined audio too large'); continue
            fp = os.path.join(os.path.dirname(path), au)
            check(os.path.isfile(fp), f'audio file missing: {au}')
            if os.path.isfile(fp): check(os.path.getsize(fp) < 400_000, f'audio file too large: {au} ({os.path.getsize(fp) // 1024} KB, budget 400 KB)')
        shot(1); overflow('moment 1')
        pg.click('#m1 [data-next="2"]')
        # 2. predictions: pick the first wrong option when there is one
        picks = []
        m2 = pg.inner_text('#m2')
        check(not any(v['fr'][:30] in m2 for v in L['mis'].values()) and 'Juste' not in m2, 'answer leak: a verdict or a misconception is on screen before the prediction')
        for k, q in enumerate(L['predict']):
            check(pg.is_disabled('#next2'), 'moment 3 unlocked before all predictions')
            i = next((j for j, o in enumerate(q['options']) if o[1]), 0); picks.append(i)
            pg.click(f'#p{k} [data-i="{i}"]')
        check(pg.is_enabled('#next2'), 'moment 3 still locked after all predictions'); shot(2)
        pg.click('#next2')
        # 3. experiment gate
        check(pg.is_disabled('#next3'), 'moment 4 unlocked before the missions')
        for mid in L['required']: pg.evaluate(f'{F}.done({mid!r})')
        check(pg.is_enabled('#next3'), 'moment 4 still locked after the required missions')
        for mid in L['missions']: pg.evaluate(f'{F}.done({mid!r})')
        shot(3); overflow('moment 3')
        pg.click('#next3'); shot(4); pg.click('#m4 [data-next="5"]')
        # 4. proof and verdicts
        check(pg.evaluate("document.getElementById('proof') && document.getElementById('proof').inert"), 'answer leak: the proof is readable by screen readers before the flap is lifted')
        covered = pg.evaluate('''() => { const p = document.getElementById('proof').getBoundingClientRect(), f = document.getElementById('flap');
          for (const [x, y] of [[.5, .5], [.1, .1], [.9, .9]]) { const e = document.elementFromPoint(p.left + p.width * x, p.top + p.height * y); if (e && e !== f && !f.contains(e)) return false; }
          return getComputedStyle(f).opacity === '1'; }''')
        check(covered, 'answer leak: the proof shows through or around the flap before it is lifted')
        pg.click('#flap'); pg.wait_for_timeout(100)
        check('open' in (pg.get_attribute('#flap', 'class') or ''), 'proof flap did not open')
        pv = pg.inner_text('#pv')
        for k, q in enumerate(L['predict']):
            code = q['options'][picks[k]][1]
            if code: check(L['mis'][code]['fr'][:30] in pv, f'prediction {k}: misconception {code} not shown')
        shot(5); pg.click('#m5 [data-next="6"]')
        # 5. exercises
        total = 0; firsts = 0
        def ans_in_q(ex):
            t = fmt(ex['ans']); return len(t.replace(',', '').replace('-', '')) >= 3 and re.search(r'(?<![\d,])(?<!\d[ \u00a0\u202f])' + re.escape(t) + r'(?![\d,])(?![ \u00a0\u202f]\d{3})', ex['q'])  # « 2 400 » is not « 400 »
        for lvl, label in enumerate(L['levels']):
            pg.click(f'#lv [data-l="{lvl}"]')
            for _ in range(a.n):
                pg.evaluate(f'{F}.newEx()')
                ex = pg.evaluate(f'{F}.S.cur')
                check(not ans_in_q(ex), f'{label}: answer leak, the answer {fmt(ex["ans"])} is printed in the question « {ex["q"]} »')
                check(not pg.inner_text('#exf').strip(), f'{label}: feedback visible before the answer')
                if not ex.get('traps'): firsts += 1
                for v, code in ex.get('traps', []):
                    pg.fill('#exa', fmt(v)); pg.click('#exc')
                    fb = pg.inner_text('#exf')
                    check(L['mis'][code]['fr'][:30] in fb, f'{label}: trap {code} ({fmt(v)}) not diagnosed for « {ex["q"]} », got « {fb[:60]} »')
                pg.fill('#exa', fmt(ex['ans'])); pg.click('#exc')
                fb = pg.inner_text('#exf'); check(fb.startswith('Juste'), f'{label}: right answer {fmt(ex["ans"])} refused for « {ex["q"]} »')
                total += 1
        pg.evaluate(f'{F}.newEx()'); ex = pg.evaluate(f'{F}.S.cur'); pg.fill('#exa', fmt(ex['ans'])); pg.click('#exc'); firsts += 1; total += 1
        shot(6); overflow('moment 6')
        pg.click('#m6 [data-next="7"]')
        # 6. checks and report
        for k, q in enumerate(L['check']):
            i = next(j for j, o in enumerate(q['options']) if o[1] == '')
            pg.click(f'#c{k} [data-i="{i}"]')
        check(pg.is_visible('#rep'), 'report not shown after the checks')
        r2 = pg.inner_text('#r2'); check(r2.startswith(str(len(L['check']))), f'report shows {r2} for all checks right')
        r3 = pg.inner_text('#r3'); check(r3.replace(' ', '') == f'{firsts}/{total}', f'report counts {r3} first tries, expected {firsts} / {total}: answers after a misconception message are help')
        shot(7); overflow('moment 7')
        # 11. contrast in light and dark mode, every moment shown
        pg.evaluate("document.querySelectorAll('.moment').forEach(m => m.hidden = false)")
        for scheme in ('light', 'dark'):
            pg.emulate_media(reduced_motion='reduce', color_scheme=scheme); pg.wait_for_timeout(150)
            bad = pg.evaluate(CONTRAST_JS)
            check(not bad, f'low contrast in {scheme} mode: ' + '; '.join(bad[:6]) + (f' (+{len(bad) - 6})' if len(bad) > 6 else ''))
            if a.shots: pg.screenshot(path=os.path.join(a.shots, f'all-{scheme}.png'), full_page=True)
        check(not errs, 'page errors: ' + ' | '.join(errs))
        print(f'{os.path.basename(path)}: {total} exercises across {len(L["levels"])} levels, {len(L["predict"])} predictions, {len(L["check"])} checks, {len(audios)} audio, {size // 1024} KB')
    print('RESULT:', 'OK' if not fails else f'{len(fails)} failure(s)')
    sys.exit(1 if fails else 0)

if __name__ == '__main__':
    main()
