import sys, os
from playwright.sync_api import sync_playwright
ts=[float(x) for x in sys.argv[1:]]
os.makedirs('stills',exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1920,'height':1080})
    errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://'+os.path.abspath('board.html')); pg.evaluate('document.fonts.ready')
    for t in ts:
        pg.evaluate(f'render({t})'); pg.screenshot(path=f'stills/t{t:05.1f}.jpg', quality=85)
    b.close(); print('errs', errs)
