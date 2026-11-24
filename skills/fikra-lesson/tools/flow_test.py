"""Flow test for a « Le concept en main » lesson (engine v1).

  python3 flow_test.py LESSON.html [--shots DIR] [--n 40]

Opens the lesson at phone width (420 px) with ?test, then checks:
  1. the engine's own validation found no problem;
  2. every prediction can be answered and the next moment unlocks only then;
  3. the experiment gate opens once the required missions are done;
  4. the proof flap opens and each wrong prediction gets its misconception text;
  5. for each exercise level, N generated exercises: every trap value is diagnosed
     with its own misconception, and the right answer is accepted;
  6. the check questions produce the report;
  7. no page error, no horizontal overflow at 420 px, file under 150 KB.
Exit code 1 on any failure.
"""
import os, sys, argparse
from playwright.sync_api import sync_playwright

def fmt(x):
    s = ('%.6f' % x).rstrip('0').rstrip('.')
    return s.replace('.', ',')

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('lesson'); ap.add_argument('--shots'); ap.add_argument('--n', type=int, default=40)
    a = ap.parse_args(); path = os.path.abspath(a.lesson); fails = []
    def check(cond, msg):
        if not cond: fails.append(msg); print('FAIL', msg)
    size = os.path.getsize(path)
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
        shot(1); overflow('moment 1')
        pg.click('#m1 [data-next="2"]')
        # 2. predictions: pick the first wrong option when there is one
        picks = []
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
        pg.click('#flap'); pg.wait_for_timeout(100)
        check('open' in (pg.get_attribute('#flap', 'class') or ''), 'proof flap did not open')
        pv = pg.inner_text('#pv')
        for k, q in enumerate(L['predict']):
            code = q['options'][picks[k]][1]
            if code: check(L['mis'][code]['fr'][:30] in pv, f'prediction {k}: misconception {code} not shown')
        shot(5); pg.click('#m5 [data-next="6"]')
        # 5. exercises
        total = 0
        for lvl, label in enumerate(L['levels']):
            pg.click(f'#lv [data-l="{lvl}"]')
            for _ in range(a.n):
                pg.evaluate(f'{F}.newEx()')
                ex = pg.evaluate(f'{F}.S.cur')
                for v, code in ex.get('traps', []):
                    pg.fill('#exa', fmt(v)); pg.click('#exc')
                    fb = pg.inner_text('#exf')
                    check(L['mis'][code]['fr'][:30] in fb, f'{label}: trap {code} ({fmt(v)}) not diagnosed for « {ex["q"]} », got « {fb[:60]} »')
                pg.fill('#exa', fmt(ex['ans'])); pg.click('#exc')
                fb = pg.inner_text('#exf'); check(fb.startswith('Juste'), f'{label}: right answer {fmt(ex["ans"])} refused for « {ex["q"]} »')
                total += 1
        shot(6); overflow('moment 6')
        pg.click('#m6 [data-next="7"]')
        # 6. checks and report
        for k, q in enumerate(L['check']):
            i = next(j for j, o in enumerate(q['options']) if o[1] == '')
            pg.click(f'#c{k} [data-i="{i}"]')
        check(pg.is_visible('#rep'), 'report not shown after the checks')
        r2 = pg.inner_text('#r2'); check(r2.startswith(str(len(L['check']))), f'report shows {r2} for all checks right')
        shot(7); overflow('moment 7')
        check(not errs, 'page errors: ' + ' | '.join(errs))
        print(f'{os.path.basename(path)}: {total} exercises across {len(L["levels"])} levels, {len(L["predict"])} predictions, {len(L["check"])} checks, {size // 1024} KB')
    print('RESULT:', 'OK' if not fails else f'{len(fails)} failure(s)')
    sys.exit(1 if fails else 0)

if __name__ == '__main__':
    main()
